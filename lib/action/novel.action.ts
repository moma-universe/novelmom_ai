import mongoose from "mongoose";
import Novel, { INovel } from "../database/models/Novel.model";
import TextChunk from "../database/models/TextChunk.model";
import Image from "../database/models/Image.model";
import connectToDatabase from "../database/mongoose";
import { uploadImageToCloudflare } from "../cloudflare/cloudflare";

export async function createNovel(
  userId: string,
  genre: string,
  title: string,
  age: number,
  mood: string,
  summary: string,
  generatedTextChunks: string[],
  generatedImages: string[]
): Promise<INovel> {
  await connectToDatabase();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cloudflareImageUrls = await Promise.all(
      generatedImages.map((imageUrl) => uploadImageToCloudflare(imageUrl))
    );
    const newNovel = new Novel({
      userId,
      genre,
      title,
      age,
      mood,
      summary,
      originalImageUrls: generatedImages,
      cloudflareImageUrls,
    });

    const savedNovel = await newNovel.save({ session });

    console.log("savedNovel : ", savedNovel);

    const textChunkPromises = generatedTextChunks.map((text, index) =>
      new TextChunk({
        novelId: savedNovel._id,
        index,
        text,
      }).save({ session })
    );

    const imagePromises = generatedImages.map((imageUrl, index) =>
      new Image({
        novelId: savedNovel._id,
        index,
        imageUrl,
      }).save({ session })
    );

    const [savedTextChunks, savedImages] = await Promise.all([
      Promise.all(textChunkPromises),
      Promise.all(imagePromises),
    ]);

    savedNovel.textChunkIds = savedTextChunks.map(
      (chunk) => chunk._id as mongoose.Types.ObjectId
    );
    savedNovel.imageIds = savedImages.map(
      (image) => image._id as mongoose.Types.ObjectId
    );

    await savedNovel.save({ session });

    await session.commitTransaction();
    return savedNovel;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    if (error instanceof mongoose.Error.ValidationError) {
      throw new Error("소설 생성 중 유효성 검사 오류가 발생했습니다.");
    } else if (error instanceof mongoose.Error.CastError) {
      throw new Error("잘못된 데이터 형식입니다.");
    } else {
      console.error("소설 생성 중 오류 발생:", error);
      throw new Error("소설을 생성하는 중 오류가 발생했습니다.");
    }
  } finally {
    session.endSession();
  }
}

export async function getNovels(): Promise<INovel[]> {
  try {
    return await Novel.find()
      .populate("textChunkIds")
      .populate("imageIds")
      .exec();
  } catch (error) {
    console.error("소설 목록 조회 중 오류 발생:", error);
    throw new Error("소설 목록을 가져오는 중 오류가 발생했습니다.");
  }
}

export async function deleteNovel(novelId: string): Promise<void> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const novel = await Novel.findById(novelId);
    if (!novel) {
      throw new Error("소설을 찾을 수 없습니다.");
    }

    await Novel.findByIdAndDelete(novelId).session(session);
    await TextChunk.deleteMany({ novelId }).session(session);
    await Image.deleteMany({ novelId }).session(session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof mongoose.Error.CastError) {
      throw new Error("잘못된 소설 ID 형식입니다.");
    } else {
      console.error("소설 삭제 중 오류 발생:", error);
      throw new Error("소설을 삭제하는 중 오류가 발생했습니다.");
    }
  } finally {
    session.endSession();
  }
}

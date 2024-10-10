import mongoose from "mongoose";
import Novel, { INovel } from "../database/models/Novel.model";
import TextChunk from "../database/models/TextChunk.model";
import Image from "../database/models/Image.model";
import connectToDatabase from "../database/mongoose";
import { uploadImageToCloudflare } from "../cloudflare/cloudflare-create.actions";
import { deleteCloudflareImageUtil } from "../cloudflare/cloudflare-delete.actions";

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
    const cloudflareImages = await Promise.all(
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
      cloudflareImageUrls: cloudflareImages.map((img) => img.imageUrl),
      cloudflareImageIds: cloudflareImages.map((img) => img.imageId),
    });

    const savedNovel = await newNovel.save({ session });

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

    // 텍스트 청크 삭제
    await TextChunk.deleteMany({ _id: { $in: novel.textChunkIds } });

    // 이미지 삭제
    await Image.deleteMany({ _id: { $in: novel.imageIds } });

    // 소설 삭제
    await Novel.findByIdAndDelete(novelId);

    // Cloudflare 이미지 삭제
    if (novel.cloudflareImageIds && novel.cloudflareImageIds.length > 0) {
      for (const imageId of novel.cloudflareImageIds) {
        try {
          await deleteCloudflareImageUtil(imageId);
        } catch (error) {
          console.error(`Cloudflare 이미지 삭제 실패 (ID: ${imageId}):`, error);
          // 개별 이미지 삭제 실패를 기록하지만 전체 프로세스는 계속 진행
        }
      }
    } else {
      console.warn("Cloudflare 이미지 ID가 없습니다.");
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error("소설 삭제 중 오류 발생:", error);
    if (error instanceof mongoose.Error) {
      throw new Error("데이터베이스 오류: 소설을 삭제할 수 없습니다.");
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("소설 삭제 중 알 수 없는 오류가 발생했습니다.");
    }
  } finally {
    session.endSession();
  }
}

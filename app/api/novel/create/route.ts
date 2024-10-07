import { NextResponse } from "next/server";
import { MongoError } from "mongodb";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createNovel, Novel } from "@/lib/database/models/novel";
import { createTextChunk, TextChunk } from "@/lib/database/models/TextChunk";
import { createImage, Image } from "@/lib/database/models/Image";
import connectToDatabase from "@/lib/database/mongodb";

export async function POST(request: Request) {
  try {
    const { userId } = auth(); // 현재 로그인한 사용자의 ID 가져오기

    if (!userId) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }
    const {
      genre,
      title,
      age,
      mood,
      summary,
      generatedTextChunks,
      generatedImages,
    } = await request.json();

    // 입력 유효성 검사
    if (
      !genre ||
      !title ||
      typeof age !== "number" ||
      !mood ||
      !summary ||
      !Array.isArray(generatedTextChunks) ||
      !Array.isArray(generatedImages)
    ) {
      return NextResponse.json(
        { error: "모든 필드를 정확히 입력해주세요." },
        { status: 400 }
      );
    }

    // 추가적인 유효성 검사
    if (summary.length > 100) {
      return NextResponse.json(
        { error: "줄거리는 100자를 초과할 수 없습니다." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (!db) {
      console.error("데이터베이스 연결 실패");
      return NextResponse.json(
        { error: "데이터베이스 연결에 실패했습니다." },
        { status: 500 }
      );
    }

    const novelsCollection = db.collection<Novel>("novels");
    const textChunksCollection = db.collection<TextChunk>("textChunks");
    const imagesCollection = db.collection<Image>("images");

    // 새로운 소설 생성
    const newNovel = createNovel(userId, genre, title, age, mood, summary);

    const novelResult = await novelsCollection.insertOne(newNovel);
    const novelId = novelResult.insertedId;

    // 텍스트 청크와 이미지 저장
    try {
      const textChunkPromises = generatedTextChunks.map((text, index) =>
        textChunksCollection.insertOne(createTextChunk(novelId, index, text))
      );
      const imagePromises = generatedImages.map((imageUrl, index) =>
        imagesCollection.insertOne(createImage(novelId, index, imageUrl))
      );

      const [textChunkResults, imageResults] = await Promise.all([
        Promise.all(textChunkPromises),
        Promise.all(imagePromises),
      ]);

      const textChunkIds = textChunkResults.map((result) => result.insertedId);
      const imageIds = imageResults.map((result) => result.insertedId);

      // 소설 문서 업데이트에 참조 추가
      await novelsCollection.updateOne(
        { _id: novelId },
        {
          $set: {
            textChunkIds,
            imageIds,
          },
        }
      );
    } catch (error) {
      console.error("텍스트 청크 또는 이미지 저장 중 오류:", error);
      // 롤백: 생성된 소설 삭제
      await novelsCollection.deleteOne({ _id: novelId });
      return NextResponse.json(
        { error: "텍스트 청크 또는 이미지 저장 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "소설이 성공적으로 생성되었습니다.", id: novelId },
      { status: 201 }
    );
  } catch (error) {
    console.error("소설 생성 오류:", error);
    let errorMessage = "소설 생성에 실패했습니다.";
    if (error instanceof Error) {
      errorMessage += ` 오류 내용: ${error.message}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      console.error("데이터베이스 연결 실패");
      return NextResponse.json(
        { error: "데이터베이스 연결에 실패했습니다." },
        { status: 500 }
      );
    }
    const novelsCollection = db.collection<Novel>("novels");
    const textChunksCollection = db.collection<TextChunk>("textChunks");
    const imagesCollection = db.collection<Image>("images");

    const novels = await novelsCollection.find().toArray();

    // 각 소설에 대해 텍스트 청크와 이미지 가져오기
    const novelsWithDetails = await Promise.all(
      novels.map(async (novel) => {
        try {
          const textChunks = await textChunksCollection
            .find({ novelId: novel._id })
            .sort({ index: 1 })
            .toArray();
          const images = await imagesCollection
            .find({ novelId: novel._id })
            .sort({ index: 1 })
            .toArray();

          return {
            ...novel,
            textChunks: textChunks.map((chunk) => chunk.text),
            images: images.map((image) => image.imageUrl),
          };
        } catch (error) {
          console.error(
            `소설 ID ${novel._id}의 상세 정보 조회 중 오류:`,
            error
          );
          return {
            ...novel,
            textChunks: [],
            images: [],
            error: "상세 정보 조회 실패",
          };
        }
      })
    );

    return NextResponse.json(novelsWithDetails, { status: 200 });
  } catch (error) {
    console.error("소설 조회 오류:", error);
    let errorMessage = "소설을 조회하는데 실패했습니다.";
    if (error instanceof MongoError) {
      errorMessage += ` 데이터베이스 오류: ${error.message}`;
    } else if (error instanceof Error) {
      errorMessage += ` 오류 내용: ${error.message}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

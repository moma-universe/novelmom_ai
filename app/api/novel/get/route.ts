import { NextRequest, NextResponse } from "next/server";

import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/database/mongodb";
import { Novel } from "@/lib/database/models/Novel";
import { TextChunk } from "@/lib/database/models/TextChunk";
import { Image } from "@/lib/database/models/Image";

export async function GET() {
  try {
    const db = await getDatabase();
    const novelsCollection = db.collection<Novel>("novels");
    const textChunksCollection = db.collection<TextChunk>("textChunks");
    const imagesCollection = db.collection<Image>("images");

    const novels = await novelsCollection.find().toArray();

    // 각 소설에 대해 텍스트 청크와 이미지 가져오기
    const novelsWithDetails = await Promise.all(
      novels.map(async (novel) => {
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
      })
    );

    return NextResponse.json(novelsWithDetails, { status: 200 });
  } catch (error) {
    console.error("소설 조회 오류:", error);
    return NextResponse.json(
      { error: "소설을 조회하는데 실패했습니다." },
      { status: 500 }
    );
  }
}

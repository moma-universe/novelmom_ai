import { TextChunk } from "@/lib/database/models/TextChunk";
import { getDatabase } from "@/lib/database/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const novelId = req.nextUrl.searchParams.get("novelId");
    if (!novelId) {
      return NextResponse.json(
        { error: "novelId가 필요합니다." },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const textChunksCollection = db.collection<TextChunk>("textChunks");

    const chunks = await textChunksCollection
      .find({ novelId: new ObjectId(novelId) })
      .sort({ index: 1 })
      .toArray();

    return NextResponse.json(chunks, { status: 200 });
  } catch (error) {
    console.error("텍스트 청크 조회 오류:", error);
    return NextResponse.json(
      { error: "텍스트 청크 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}

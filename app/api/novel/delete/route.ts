import { NextApiRequest, NextApiResponse } from "next";

import Novel from "@/lib/database/models/Novel.model";
import connectToDatabase from "@/lib/database/mongoose";
import { deleteNovel } from "@/lib/action/novel.action";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const body = await req.json();
  const { novelId } = body;

  if (!novelId) {
    return NextResponse.json(
      { message: "소설 ID가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    // 소설 정보 가져오기
    const novel = await Novel.findById(novelId);
    if (!novel) {
      return NextResponse.json(
        { message: "소설을 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    await deleteNovel(novelId);

    return NextResponse.json(
      { message: "동화가 성공적으로 삭제되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error("동화 삭제 중 오류 발생:", error);
    return NextResponse.json(
      { message: "동화 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

import { NextApiRequest, NextApiResponse } from "next";

import { NextResponse } from "next/server";
import { deleteNovel } from "@/lib/action/novel.action";
import connectToDatabase from "@/lib/database/mongoose";

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "허용되지 않는 삭제입니다." });
  }

  await connectToDatabase();

  try {
    const { novelId } = req.body;
    console.log(novelId);
    if (!novelId) {
      return NextResponse.json(
        { message: "NoveId를 찾지 못하였습니다." },
        { status: 400 }
      );
    }

    // 동화 삭제
    await deleteNovel(novelId);

    return NextResponse.json(
      { message: "동화가 성공적으로 삭제되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error("삭제 중 오류 발생 :", error);
    return NextResponse.json(
      { message: "동화 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getNovels } from "@/lib/action/novel.action";
import connectToDatabase from "@/lib/database/mongoose";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const novels = await getNovels();
    const userNovels = novels.filter((novel) => novel.userId === userId);

    return NextResponse.json({ novels: userNovels });
  } catch (error) {
    console.error("Error fetching novels:", error);
    return NextResponse.json(
      { error: "Failed to fetch novels" },
      { status: 500 }
    );
  }
}

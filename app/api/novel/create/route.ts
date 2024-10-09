import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createNovel } from "@/lib/action/novel.action";

export async function POST(request: Request) {
  try {
    const { userId } = auth();

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

    if (
      !Array.isArray(generatedTextChunks) ||
      generatedTextChunks.length === 0
    ) {
      return NextResponse.json(
        { error: "생성된 텍스트 청크는 비어있지 않은 배열이어야 합니다." },
        { status: 400 }
      );
    }
    if (!Array.isArray(generatedImages) || generatedImages.length === 0) {
      return NextResponse.json(
        { error: "생성된 이미지는 비어있지 않은 배열이어야 합니다." },
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

    const novel = await createNovel(
      userId,
      genre,
      title,
      age,
      mood,
      summary,
      generatedTextChunks,
      generatedImages
    );

    return NextResponse.json(
      { message: "소설이 성공적으로 생성되었습니다.", id: novel._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("소설 생성 오류:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "소설 생성에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

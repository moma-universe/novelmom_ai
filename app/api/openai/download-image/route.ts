import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const imageUrl = req.nextUrl.searchParams.get("url");

  if (!imageUrl) {
    return new NextResponse("Image URL is required", { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="novel-image.png"',
      },
    });
  } catch (error) {
    console.error("Error downloading image:", error);
    return new NextResponse("Error downloading image", { status: 500 });
  }
}

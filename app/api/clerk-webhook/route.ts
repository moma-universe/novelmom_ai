// app/api/clerk-webhook/route.ts

import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Clerk Webhook의 시그니처 검증은 여기서 수행해야 합니다.
    // Clerk의 공식 문서를 참고하여 시그니처 검증을 구현하세요.

    const { type, data } = payload;

    const db = await getDatabase();
    const usersCollection = db.collection("users");

    if (type === "user.created") {
      const { id, email_addresses } = data;
      const email = email_addresses[0]?.email_address;

      if (email) {
        const newUser = {
          clerkId: id,
          email,
          createdAt: new Date(),
          // 추가적인 사용자 데이터를 여기서 추가할 수 있습니다.
        };
        await usersCollection.insertOne(newUser);
      }
    }

    // 다른 이벤트 유형도 처리할 수 있습니다.

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Clerk Webhook 에러:", error);
    return NextResponse.json(
      { error: "Webhook 처리 중 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}

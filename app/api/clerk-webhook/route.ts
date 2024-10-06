// app/api/clerk-webhook/route.ts
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { getDatabase } from "@/lib/database/mongodb";
import { createUser, User } from "@/lib/database/models/User";
import { MongoError } from "mongodb";

export async function POST(request: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET as string;

  if (!WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET이 설정되지 않았습니다.");
    return NextResponse.json({ error: "서버 설정 오류" }, { status: 500 });
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("필요한 Svix 헤더가 누락되었습니다.");
    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  }

  try {
    // Clerk Webhook Signature Verification
    const payload = await request.json();
    const body = JSON.stringify(payload);
    let evt: WebhookEvent;

    const wh = new Webhook(WEBHOOK_SECRET);

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id as string,
        "svix-timestamp": svix_timestamp as string,
        "svix-signature": svix_signature as string,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occured", {
        status: 400,
      });
    }

    const eventType = evt.type;

    const db = await getDatabase();
    if (!db) {
      throw new Error("데이터베이스 연결 실패");
    }
    const usersCollection = db.collection<User>("users");

    console.log(evt.data);

    if (eventType === "user.created") {
      const { id, email_addresses, last_name, image_url } = evt.data;
      const email = email_addresses[0]?.email_address;

      if (!email || !last_name || !image_url) {
        console.error("사용자 정보 누락:", { id, email, last_name, image_url });
        return NextResponse.json(
          { error: "불완전한 사용자 정보" },
          { status: 400 }
        );
      }

      const newUser: User = createUser(id, email, last_name, image_url);

      try {
        await usersCollection.insertOne(newUser);
      } catch (error) {
        if (error instanceof MongoError && error.code === 11000) {
          console.error("중복된 사용자 ID:", id);
          return NextResponse.json(
            { error: "이미 존재하는 사용자" },
            { status: 409 }
          );
        }
        throw error; // 다른 종류의 에러는 다시 던집니다.
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

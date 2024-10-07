import { getDatabase } from "@/lib/database/mongodb";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ITransaction } from "@/lib/database/models/transaction.model";
import { createTransaction } from "@/lib/action/transaction.actions";
import User from "@/lib/database/models/user.model";
export async function POST(req: NextRequest) {
  try {
    // Clerk 인증 확인
    const { userId } = getAuth(req);
    console.log("userId : " + userId, typeof userId);
    if (!userId) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    // 데이터베이스 연결

    const db = await getDatabase();
    console.log("Database connection status:");
    if (!db) {
      console.error("데이터베이스 연결 실패");
      return NextResponse.json(
        { error: "데이터베이스 연결에 실패했습니다." },
        { status: 500 }
      );
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const body = await req.json();

    const {
      priceId,
      imp_uid,
      merchant_uid,
      status,
      buyer_name,
      buyer_email,
      buyer_tel,
      buyer_addr,
      buyer_postcode,
      paid_at,
      pg_tid,
      emb_pg_provider,
      paid_amount,
      pay_method,
    } = body;

    // 결제 정보 반환 검증.
    if (
      !priceId ||
      !imp_uid ||
      !merchant_uid ||
      !status ||
      !buyer_name ||
      !buyer_email ||
      !buyer_tel ||
      !buyer_addr ||
      !buyer_postcode ||
      !paid_at ||
      !pg_tid ||
      !emb_pg_provider ||
      !paid_amount ||
      !pay_method
    ) {
      return NextResponse.json(
        { error: "누락된 결제 정보가 있습니다." },
        { status: 400 }
      );
    }
    // 데이터 입력 to Database
    try {
      const newTransaction: ITransaction = await createTransaction(
        userId,
        priceId,
        imp_uid,
        merchant_uid,
        status,
        buyer_name,
        buyer_email,
        buyer_tel,
        buyer_addr,
        buyer_postcode,
        paid_at,
        pg_tid,
        emb_pg_provider,
        paid_amount,
        pay_method
      );
      console.log("새 결제가 생성되었습니다:", newTransaction);
    } catch (error) {
      console.error("결제 생성 중 오류 발생:", error);

      if (error instanceof Error) {
        throw new Error(`결제 정보 생성 실패: ${error.message}`);
      } else {
        throw new Error("결제 정보 생성 중 알 수 없는 오류가 발생했습니다.");
      }
    }

    // 포트원 API 요청
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`유저 검증 및 결제 정보 생성 실패: ${error.message}`);
    } else {
      throw new Error(
        "유저 검증 및 결제 정보 생성 중 알 수 없는 오류가 발생했습니다."
      );
    }
  }
}

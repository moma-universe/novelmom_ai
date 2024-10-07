import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ITransaction } from "@/lib/database/models/transaction.model";
import { createTransaction } from "@/lib/action/transaction.actions";
import User from "@/lib/database/models/user.model";
import connectToDatabase from "@/lib/database/mongodb";
export async function POST(req: NextRequest) {
  try {
    // Clerk 인증 확인
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    // 데이터베이스 연결
    try {
      await connectToDatabase();
    } catch (error) {
      console.error("데이터베이스 연결 실패:", error);
      return NextResponse.json(
        { error: "데이터베이스 연결에 실패했습니다." },
        { status: 500 }
      );
    }

    // 사용자 찾기
    let user;
    try {
      user = await User.findOne({ clerkId: userId }).exec();
    } catch (error) {
      console.error("사용자 조회 중 오류 발생:", error);
      return NextResponse.json(
        { error: "사용자 정보를 조회하는 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

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
      paid_at,
      pg_tid,
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
      !paid_at ||
      !pg_tid ||
      !paid_amount ||
      !pay_method
    ) {
      return NextResponse.json(
        { error: "누락된 결제 정보가 있습니다." },
        { status: 400 }
      );
    }
    // 데이터 입력 to Database
    let newTransaction: ITransaction;
    try {
      newTransaction = await createTransaction(
        user._id,
        priceId,
        imp_uid,
        paid_amount,
        merchant_uid,
        status,
        buyer_name,
        buyer_email,
        paid_at,
        pg_tid,
        pay_method
      );
      console.log("새 결제가 생성되었습니다:", newTransaction);
    } catch (error) {
      console.error("결제 생성 중 오류 발생:", error);
      return NextResponse.json(
        { error: "결제 정보 생성에 실패했습니다." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        message: "결제가 성공적으로 처리되었습니다.",
        transaction: newTransaction,
      },
      { status: 200 }
    );
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

import { ObjectId } from "mongodb";
import Transaction, {
  ITransaction,
} from "../database/models/transaction.model";
import { Types } from "mongoose";

export async function createTransaction(
  userId: Types.ObjectId,
  priceId: string,
  imp_uid: string,
  paid_amount: number,
  merchant_uid: string,
  status: string,
  buyer_name: string,
  buyer_email: string,
  paid_at: string,
  pg_tid: string,
  pay_method: string
): Promise<ITransaction> {
  try {
    const newTransaction = new Transaction({
      userId,
      priceId,
      imp_uid,
      paid_amount: Number(paid_amount),
      merchant_uid,
      status,
      buyer_name,
      buyer_email,
      paid_at,
      pg_tid,
      pay_method,
    });

    const savedTransaction = await newTransaction.save();
    return savedTransaction;
  } catch (error) {
    console.error("트랜잭션 생성 중 오류 발생:", error);
    throw error;
  }
}

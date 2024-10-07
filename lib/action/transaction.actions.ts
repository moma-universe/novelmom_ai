import Transaction, {
  ITransaction,
} from "../database/models/transaction.model";

export async function createTransaction(
  userId: string,
  clerkId: string,
  priceId: string,
  imp_uid: string,
  amount: number,
  merchant_uid: string,
  status: "paid" | "failed" | "ready",
  buyer_name: string,
  buyer_email: string,
  buyer_tel: string,
  buyer_addr: string,
  buyer_postcode: string,
  paid_at: string,
  pg_tid: string,
  emb_pg_provider: string
): Promise<ITransaction> {
  try {
    const newTransaction = new Transaction({
      userId,
      clerkId,
      priceId,
      imp_uid,
      amount,
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
    });

    const savedTransaction = await newTransaction.save();
    return savedTransaction;
  } catch (error) {
    console.error("트랜잭션 생성 중 오류 발생:", error);
    throw error;
  }
}

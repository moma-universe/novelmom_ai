import mongoose, { models } from "mongoose";

export interface ITransaction {
  userId: mongoose.Types.ObjectId;
  clerkId: string;
  priceId: string;
  imp_uid: string;
  amount: number;
  merchant_uid: string;
  status: "paid" | "failed" | "ready";
  buyer_name: string;
  buyer_email: string;
  buyer_tel: string;
  buyer_addr: string;
  buyer_postcode: string;
  paid_at: string;
  pg_tid: string;
  emb_pg_provider: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema = new mongoose.Schema<ITransaction>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    clerkId: {
      type: String,
      required: true,
    },
    priceId: {
      type: String,
      required: true,
    },
    imp_uid: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    merchant_uid: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["paid", "failed", "ready"],
      default: "ready",
    },
    buyer_name: {
      type: String,
      required: true,
    },
    buyer_email: {
      type: String,
      required: true,
    },
    buyer_tel: {
      type: String,
      required: true,
    },
    buyer_addr: {
      type: String,
      required: true,
    },
    buyer_postcode: {
      type: String,
      required: true,
    },
    paid_at: {
      type: String,
      required: true,
    },
    pg_tid: {
      type: String,
      required: true,
      unique: true,
    },
    emb_pg_provider: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction =
  models?.transactions ||
  mongoose.model<ITransaction>("transactions", TransactionSchema);

export default Transaction;

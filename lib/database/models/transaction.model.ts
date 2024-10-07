import mongoose, { models } from "mongoose";

export interface ITransaction {
  priceId: string;
  imp_uid: string;
  paid_amount: number;
  merchant_uid: string;
  status: string;
  buyer_name: string;
  buyer_email: string;
  paid_at: string;
  pg_tid: string;
  pay_method: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema = new mongoose.Schema<ITransaction>(
  {
    priceId: {
      type: String,
      required: true,
    },
    imp_uid: {
      type: String,
      required: true,
      unique: true,
    },
    paid_amount: {
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
      required: true,
    },
    buyer_name: {
      type: String,
      required: true,
    },
    buyer_email: {
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
    pay_method: {
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

import mongoose from "mongoose";

export enum TransactionTypes {
  CREDIT = "credit",
  DEBIT = "debit",
}

export enum TransactionStatuses {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

export interface ITransaction {
  accountId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: TransactionTypes;
  amount: mongoose.Types.Decimal128 | string;
  balanceBefore: mongoose.Types.Decimal128 | string;
  balanceAfter: mongoose.Types.Decimal128 | string;
  description: string;
  status: TransactionStatuses;
  metadata: object;
  reference: string;
}

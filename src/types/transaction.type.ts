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

export enum TransactionCategories {
  TRANSFER = "transfer",
  DEBT_TRANSFER = "debt_transfer",
}

export interface ITransaction {
  accountId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: TransactionTypes;
  category: TransactionCategories;
  amount: mongoose.Types.Decimal128 | string;
  balanceBefore: mongoose.Types.Decimal128 | string;
  balanceAfter: mongoose.Types.Decimal128 | string;
  description: string;
  status: TransactionStatuses;
  metadata: object;
  reference: string;
}

export interface TransactionFilters {
  type?: TransactionTypes;
  status?: TransactionStatuses;
  category?: TransactionCategories;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

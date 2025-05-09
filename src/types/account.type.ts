import mongoose from "mongoose";
import { TransactionCategories } from "./transaction.type";

export interface PeerTransfer {
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  description?: string;
  transactionCategory?: TransactionCategories;
}

export interface IAccount {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  balance: mongoose.Types.Decimal128 | string;
  accountNumber: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

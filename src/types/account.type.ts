import mongoose from "mongoose";
import { TransactionCategories } from "./transaction.type";
import { User } from "./user.type";

export interface PeerTransfer {
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  description?: string;
  transactionCategory?: TransactionCategories;
}

export interface FundAccount {
  accountId: string;
  amount: string;
  callbackUrl: string;
}

export interface IAccount {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  balance: mongoose.Types.Decimal128 | string;
  accountNumber: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user: User;
}

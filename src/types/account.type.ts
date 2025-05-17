import mongoose from "mongoose";
import { TransactionCategories } from "./transaction.type";
import { UserDocument } from "./user.type";

export interface PeerTransfer {
  fromAccountId: ObjectId;
  toAccountId: ObjectId;
  amount: string;
  description?: string;
  transactionCategory?: TransactionCategories;
}

export interface FundAccount {
  accountId: ObjectId;
  amount: string;
  callbackUrl: string;
}

export interface Withdraw {
  amount?: string;
  accountNumber?: string;
  bankCode?: string;
  description?: string;
}

export interface Account {
  userId: ObjectId;
  balance: Decimal128;
  accountNumber: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user: UserDocument;
}

export interface AccountDocument extends mongoose.HydratedDocument<Account> {
  user: UserDocument;
}

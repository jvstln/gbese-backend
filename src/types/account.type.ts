import mongoose from "mongoose";
import { TransactionCategories } from "./transaction.type";
import { UserDocument } from "./user.type";

export interface PeerTransfer {
  fromAccount: AccountDocument;
  toAccount: AccountDocument;
  amount: string;
  description?: string;
  transactionCategory?: TransactionCategories;
}

export interface FundAccount {
  account: AccountDocument;
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

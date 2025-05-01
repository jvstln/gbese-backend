import mongoose from "mongoose";

export interface IAccount {
  userId: mongoose.Types.ObjectId;
  balance: mongoose.Types.Decimal128;
  accountNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
}

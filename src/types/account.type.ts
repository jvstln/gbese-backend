export interface PeerTransfer {
  fromAccountId: string;
  toAccountId: string;
  amount: string;
}

import mongoose from "mongoose";

export interface IAccount {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  balance: mongoose.Types.Decimal128 | string;
  accountNumber: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

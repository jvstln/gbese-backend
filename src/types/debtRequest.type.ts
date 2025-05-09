import mongoose from "mongoose";
import { Request } from "express";

export interface DebtRequestCreation {
  debtorId: mongoose.Types.ObjectId;
  creditorId: mongoose.Types.ObjectId;
  payerId: mongoose.Types.ObjectId;
  amount: mongoose.Types.Decimal128;
  description?: string;
}

export interface IDebtRequest extends DebtRequestCreation {
  debtPoint: mongoose.Types.Decimal128;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  getDebtPoint(): mongoose.Types.Decimal128;
}

export enum DebtRequestStatuses {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export enum DebtRequestUserRoles {
  DEBTOR = "debtor",
  CREDITOR = "creditor",
  PAYER = "payer",
}

export interface DebtRequestFilters {
  role?: DebtRequestUserRoles;
  status?: DebtRequestStatuses;
}

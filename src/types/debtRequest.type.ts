import mongoose from "mongoose";

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

export const debtRequestStatuses = ["pending", "accepted", "rejected"] as const;

export const debtRequestUserRoles = ["debtor", "creditor", "payer"] as const;

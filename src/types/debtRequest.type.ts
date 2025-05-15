import mongoose from "mongoose";

export interface DebtRequestCreation {
  debtorId: mongoose.Types.ObjectId;
  loanId?: mongoose.Types.ObjectId;
  payerId?: mongoose.Types.ObjectId;
  amount: mongoose.Types.Decimal128 | string;
  description?: string;
}

export interface DebtRequest extends DebtRequestCreation {
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
  PAYER = "payer",
}

export interface DebtRequestFilters {
  role?: DebtRequestUserRoles;
  status?: DebtRequestStatuses;
}

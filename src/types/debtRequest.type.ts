import mongoose from "mongoose";

export interface DebtRequestCreation {
  debtorId: ObjectId;
  loanId: ObjectId;
  payerId?: ObjectId;
  amount: Decimal128;
  description?: string;
}

export interface DebtRequest extends DebtRequestCreation {
  debtPoint: Decimal128;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  getDebtPoint(): Decimal128;
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

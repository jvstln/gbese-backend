import mongoose, { HydratedDocument } from "mongoose";
import { UserDocument } from "./user.type";
import { LoanDocument } from "./loan.type";

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
}

interface DebtRequestVirtualMap {
  loan: LoanDocument;
  debtor: UserDocument;
  payer: UserDocument;
}

export type DebtRequestVirtual<T extends keyof DebtRequestVirtualMap> = {
  [key in T]: DebtRequestVirtualMap[key];
};

export interface DebtRequestDocument extends HydratedDocument<DebtRequest> {}

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

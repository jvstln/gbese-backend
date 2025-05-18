import mongoose, { HydratedDocument } from "mongoose";
import { AccountDocument } from "./account.type";

export enum LoanStatuses {
  PENDING = "pending",
  ACTIVE = "active",
  REPAID = "repaid",
  DEFAULTED = "defaulted",
}

export interface Loan {
  accountId: ObjectId;
  principal: Decimal128;
  interestRate: number;
  amountPaid: Decimal128;
  durationInDays: number;
  status: LoanStatuses;
  disbursedAt: Date;
  nextDueDate: Date;
  metadata: object;
  totalAmountToBePaid: string;
  amountRemaining: string;
}

export type LoanDocument = HydratedDocument<Loan>;

export interface LoanModel extends mongoose.Model<Loan> {
  getLoanLimit: (
    this: unknown,
    accumulatedDebtPoint: string
  ) => {
    amount: number;
    durationInDays: number;
    activeLoans: number;
  };
}

export interface BorrowLoan {
  account: AccountDocument;
  amount: string;
  durationInDays: number;
  description: string;
}

export interface PayLoanUsingIds {
  loanId: ObjectId;
  account: AccountDocument;
  amount?: string;
}

export interface PayLoan {
  loan: LoanDocument;
  account: AccountDocument;
  amount?: string;
}

export interface LoanFilters {
  status?: LoanStatuses | LoanStatuses[];
}

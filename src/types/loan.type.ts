import mongoose from "mongoose";

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
  accountId: ObjectId;
  amount: string;
  durationInDays: number;
  description?: string;
}

export interface PayLoan {
  loanId: ObjectId;
  accountId: ObjectId;
  amount?: string;
}

export interface LoanFilters {
  status?: LoanStatuses;
}

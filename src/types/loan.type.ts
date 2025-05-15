import mongoose from "mongoose";

export enum LoanStatuses {
  PENDING = "pending",
  ACTIVE = "active",
  REPAID = "repaid",
  DEFAULTED = "defaulted",
}

export interface Loan {
  _id: string;
  accountId: mongoose.Types.ObjectId;
  principal: mongoose.Types.Decimal128 | string;
  interestRate: number;
  amountPaid: mongoose.Types.Decimal128 | string;
  durationInDays: number;
  status: LoanStatuses;
  disbursedAt: Date;
  nextDueDate: Date;
  metadata: object;
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
  accountId: string;
  amount: string;
  durationInDays: number;
  description?: string;
}

export interface PayLoan {
  loanId: string;
  accountId: string;
  amount: string;
  isPartialPayment?: boolean;
}

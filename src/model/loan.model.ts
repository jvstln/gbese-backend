import mongoose, { Schema } from "mongoose";
import { Loan, LoanModel, LoanStatuses } from "../types/loan.type";
import Decimal from "decimal.js";

const loanSchema = new Schema<Loan, LoanModel>(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    principal: {
      type: Schema.Types.Decimal128,
      required: true,
      min: 0,
      get: (value: any) => value.toString(),
    },
    interestRate: {
      type: Number, // as a decimal, e.g., 0.05 = 5%
      required: true,
      min: 0,
      default: 0.05,
    },
    amountPaid: {
      type: Schema.Types.Decimal128,
      default: 0,
      get: (value: any) => value.toString(),
    },
    durationInDays: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: Object.values(LoanStatuses),
      default: LoanStatuses.PENDING,
    },
    disbursedAt: {
      type: Date,
    },
    nextDueDate: {
      type: Date,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },

  {
    timestamps: true,
    statics: {
      getLoanLimit(this, accumulatedDebtPoint: string) {
        return { amount: 50_000, durationInDays: 30, activeLoans: 1 };
      },
    },
    methods: {
      getPayableAmount() {
        return new Decimal(this.principal.toString()).add(
          new Decimal(this.principal.toString()).mul(this.interestRate)
        );
      },
    },
  }
);

export const loanModel = mongoose.model<Loan, LoanModel>("Loan", loanSchema);

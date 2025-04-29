import { Schema, model, Document } from "mongoose";
import { debtRequestStatuses, IDebtRequest } from "../types/debtRequest.type";

const DebtRequestSchema = new Schema<IDebtRequest>(
  {
    debtorId: { type: String, required: [true, "Debtor ID is required"] },
    creditorId: { type: String, required: [true, "Creditor ID is required"] },
    payerId: { type: String, required: [true, "Payer ID is required"] },
    amount: { type: Number, required: [true, "Debt amount is required"] },
    description: { type: String },
    incentive: { type: Number, required: [true, "Incentive is required"] },
    status: {
      type: String,
      enum: debtRequestStatuses,
      default: "pending",
    },
  },
  { timestamps: true }
);

export const DebtRequest = model<IDebtRequest>(
  "DebtRequest",
  DebtRequestSchema
);

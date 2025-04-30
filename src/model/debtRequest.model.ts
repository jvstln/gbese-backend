import mongoose, { Schema, model } from "mongoose";
import { debtRequestStatuses, IDebtRequest } from "../types/debtRequest.type";
import Decimal from "decimal.js";

const DebtRequestSchema = new Schema<IDebtRequest>(
  {
    debtorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Debtor ID is required"],
    },
    creditorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creditor ID is required"],
    },
    payerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Payer ID is required"],
    },
    amount: {
      type: Schema.Types.Decimal128,
      required: [true, "Debt amount is required"],
      validate: [
        {
          validator: (v: number) => v > 0,
          message: "Amount must be greater than 0",
        },
      ],
      get: (value: any) => value.toString(),
    },
    description: { type: String },
    debtPoint: {
      type: Schema.Types.Decimal128,
      default: function () {
        const debtRequestAmount = this.amount.toString();
        return new Decimal(debtRequestAmount).mul(0.01).toString();
      },
      get: (value: any) => value.toString(),
    },
    status: {
      type: String,
      enum: debtRequestStatuses,
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        if (doc.populated("debtorId")) {
          ret.debtor = ret.debtorId;
          delete ret.debtorId;
        }
        if (doc.populated("creditorId")) {
          ret.creditor = ret.creditorId;
          delete ret.creditorId;
        }
        if (doc.populated("payerId")) {
          ret.payer = ret.payerId;
          delete ret.payerId;
        }

        return ret;
      },
    },
  }
);

export const DebtRequest = model<IDebtRequest>(
  "DebtRequest",
  DebtRequestSchema
);

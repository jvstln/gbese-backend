import { Schema, model } from "mongoose";
import { debtRequestStatuses, IDebtRequest } from "../types/debtRequest.type";
import Decimal from "decimal.js";
import { userModel } from "./user.model";
import { APIError } from "better-auth/api";

const DebtRequestSchema = new Schema<IDebtRequest>(
  {
    debtorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Debtor ID is required"],
      validate: userModel.validateUserExistence,
    },
    creditorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creditor ID is required"],
      validate: userModel.validateUserExistence,
    },
    payerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Payer ID is required"],
      validate: userModel.validateUserExistence,
    },
    amount: {
      type: Schema.Types.Decimal128,
      required: [true, "Debt amount is required"],
      validate: {
        validator: (v: number) => v > 0,
        message: "Amount must be greater than 0",
      },
      get: (value: any) => value.toString(),
    },
    description: { type: String },
    debtPoint: {
      type: Schema.Types.Decimal128,
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
    methods: {
      getDebtPoint: function () {
        const debtRequestAmount = this.amount.toString();
        return new Decimal(debtRequestAmount).mul(0.01).toString();
      },
    },
  }
);

DebtRequestSchema.pre("save", function (next) {
  if (this.isModified("amount")) {
    this.debtPoint = this.getDebtPoint();
  }

  // ensure that the creditor, the debtor and the payer are not the same
  if (
    this.debtorId.toString() === this.creditorId.toString() ||
    this.debtorId.toString() === this.payerId.toString()
  ) {
    throw new APIError("UNPROCESSABLE_ENTITY", {
      message: "You (Debtor) cannot be the same as creditor or payer",
    });
  }

  if (this.creditorId.toString() === this.payerId.toString()) {
    throw new APIError("UNPROCESSABLE_ENTITY", {
      message: "Creditor cannot be the same as payer",
    });
  }

  next();
});

DebtRequestSchema.virtual("debtor", {
  ref: "User",
  localField: "debtorId",
  foreignField: "_id",
  justOne: true,
});

DebtRequestSchema.virtual("creditor", {
  ref: "User",
  localField: "creditorId",
  foreignField: "_id",
  justOne: true,
});

DebtRequestSchema.virtual("payer", {
  ref: "User",
  localField: "payerId",
  foreignField: "_id",
  justOne: true,
});

export const DebtRequest = model<IDebtRequest>(
  "DebtRequest",
  DebtRequestSchema
);

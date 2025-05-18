import { Schema, model, Types } from "mongoose";
import { DebtRequestStatuses, DebtRequest } from "../types/debtRequest.type";
import { userModel } from "./user.model";
import { APIError } from "better-auth/api";
import { convertCurrency } from "../utils/finance";

const debtRequestSchema = new Schema<DebtRequest>(
  {
    debtorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Debtor ID is required"],
      validate: userModel.validateUserExistence.bind(userModel),
    },
    payerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      validate: userModel.validateUserExistence.bind(userModel),
    },
    loanId: {
      type: Schema.Types.ObjectId,
      ref: "Loan",
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
      enum: Object.values(DebtRequestStatuses),
      default: DebtRequestStatuses.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

debtRequestSchema.pre("save", function (next) {
  if (this.isModified("amount")) {
    this.debtPoint = new Types.Decimal128(
      convertCurrency(this.amount.toString(), "NGN", "GBP")
    );
  }

  // ensure that the debtor and the payer are not the same
  if (this.debtorId.toString() === this.payerId?.toString()) {
    throw new APIError("UNPROCESSABLE_ENTITY", {
      message: "You (Debtor) cannot be the same as the payer",
    });
  }

  next();
});

debtRequestSchema.virtual("debtor", {
  ref: "User",
  localField: "debtorId",
  foreignField: "_id",
  justOne: true,
});

debtRequestSchema.virtual("payer", {
  ref: "User",
  localField: "payerId",
  foreignField: "_id",
  justOne: true,
});

debtRequestSchema.virtual("loan", {
  ref: "Loan",
  localField: "loanId",
  foreignField: "_id",
  justOne: true,
});

export const debtRequestModel = model("DebtRequest", debtRequestSchema);

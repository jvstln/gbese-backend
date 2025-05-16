import { Schema, model } from "mongoose";
import { DebtRequestStatuses, DebtRequest } from "../types/debtRequest.type";
import Decimal from "decimal.js";
import { userModel } from "./user.model";
import { APIError } from "better-auth/api";

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
    methods: {
      getDebtPoint: function () {
        /**
         * Maths for debt point
         * ₦10000 =20 Gbese points --- 500 = 1 Gbese point
         * 100Gbp = 1 token
         * 100Gbt = 1 Nft
         */
        const debtRequestAmount = this.amount.toString();
        return new Decimal(debtRequestAmount).div(500).toString();
      },
    },
  }
);

debtRequestSchema.pre("save", function (next) {
  if (this.isModified("amount")) {
    this.debtPoint = this.getDebtPoint();
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

export const debtRequestModel = model<DebtRequest>(
  "DebtRequest",
  debtRequestSchema
);

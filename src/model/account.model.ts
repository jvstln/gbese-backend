import { Schema, model } from "mongoose";
import { IAccount } from "../types/wallet.type";
import { userModel } from "./user.model";
import { generateAccountNumber } from "../utils/finance";

const accountSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      validate: userModel.validateUserExistence,
      unique: true,
    },
    balance: {
      type: Schema.Types.Decimal128,
      required: [true, "Balance is required"],
      default: 0,
      get: (v: any) => v.toString(),
    },
    accountNumber: {
      type: String,
      required: [true, "Account number is required"],
      trim: true,
      unique: true,
      immutable: true,
      length: [10, "Account number must be 10 characters long"],
    },
  },
  { timestamps: true }
);

accountSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.accountNumber = generateAccountNumber();
  }
  next();
});

accountSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

export const accountModel = model<IAccount>("Wallet", accountSchema);

import { Schema, model } from "mongoose";
import { userModel } from "./user.model";
import { generateAccountNumber } from "../utils/finance";
import { IAccount } from "../types/account.type";

const accountSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      validate: userModel.validateUserExistence.bind(userModel),
      unique: [true, "A user can only have one account"],
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
      default: generateAccountNumber,
      length: [10, "Account number must be 10 characters long"],
    },
    isActive: {
      type: Boolean,
      required: [true, "Account active status is required"],
      default: true,
    },
  },
  { timestamps: true }
);

accountSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

export const accountModel = model<IAccount>("Account", accountSchema);

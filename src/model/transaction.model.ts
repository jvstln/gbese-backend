import mongoose, { model, Schema } from "mongoose";
import {
  ITransaction,
  TransactionCategories,
  TransactionStatuses,
  TransactionTypes,
} from "../types/transaction.type";
import { generateTransactionReference } from "../utils/finance";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const transactionSchema = new Schema<ITransaction>(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Account ID needed to create transaction"],
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(TransactionTypes),
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(TransactionCategories),
      required: true,
    },
    balanceBefore: {
      type: Schema.Types.Decimal128,
      required: true,
      get: (val: any) => val.toString(),
    },
    balanceAfter: {
      type: Schema.Types.Decimal128,
      required: true,
      get: (val: any) => val.toString(),
    },
    reference: {
      type: String,
      required: true,
      immutable: true,
      default: generateTransactionReference,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatuses),
      default: TransactionStatuses.SUCCESS,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index for fast lookups by user and account
transactionSchema.index({ accountId: 1, createdAt: -1 });

transactionSchema.plugin(mongooseAggregatePaginate);

export const transactionModel = model<
  ITransaction,
  mongoose.AggregatePaginateModel<ITransaction>
>("Transaction", transactionSchema);

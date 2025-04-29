import { Schema, model, Document } from "mongoose";

export interface IDebtTransfer extends Document {
  senderId: string;
  receiverId: string;
  amount: number;
  debtAmount: number;
  incentive: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const DebtTransferSchema = new Schema<IDebtTransfer>(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    amount: { type: Number, required: true },
    debtAmount: { type: Number, required: true },
    incentive: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

export const DebtTransfer = model<IDebtTransfer>("DebtTransfer", DebtTransferSchema);
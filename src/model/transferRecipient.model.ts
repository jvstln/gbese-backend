import mongoose from "mongoose";
import { TransferRecipient } from "../types/transferRecipient.type";

const transferRecipientSchema = new mongoose.Schema<TransferRecipient>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipientCode: {
    type: String,
    required: true,
    unique: true,
  },
});

transferRecipientSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

export const transferRecipientModel = mongoose.model(
  "TransferRecipient",
  transferRecipientSchema
);

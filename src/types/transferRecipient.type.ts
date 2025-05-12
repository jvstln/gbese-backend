import mongoose from "mongoose";
import { User } from "./user.type";

export interface TransferRecipient {
  userId: mongoose.Types.ObjectId | string;
  recipientCode: string;
  user: User;
}

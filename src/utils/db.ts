import { truncate } from "fs/promises";
import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to database: ", error);
  }
};

mongoose.set("toJSON", { getters: true, virtuals: true });
mongoose.set("toObject", { getters: true, virtuals: true });
// Run validators on any mutation/update
mongoose.set("runValidators", true);
// Automatically set session for all operation within mongoose.connection.transaction
mongoose.set("transactionAsyncLocalStorage", true);

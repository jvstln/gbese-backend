import mongoose from "mongoose";
import { accountModel } from "../model/account.model";

class AccountServices {
  async getAccount(filters: Record<string, unknown> = {}) {
    return await accountModel.findOne(filters);
  }

  // Create a wallet for a new user
  async createAccount(userId: string) {
    const userWallet = await accountModel.create({ userId });

    return userWallet;
  }

  // Transfer funds between users
  // async transferFunds(
  //   senderWalletId,
  //   receiverWalletId,
  //   amount,
  //   reference = null,
  //   description = ""
  // ) {
  //   const session = await mongoose.startSession();
  //   session.startTransaction();

  //   try {
  //     const senderWallet = await walletModel
  //       .findById(senderWalletId)
  //       .session(session);
  //     const receiverWallet = await walletModel
  //       .findById(receiverWalletId)
  //       .session(session);

  //     const amountDecimal = mongoose.Types.Decimal128.fromString(
  //       amount.toFixed(2)
  //     );

  //     // Check balance
  //     if (parseFloat(senderWallet.balance.toString()) < amount) {
  //       throw new Error("Insufficient funds");
  //     }

  //     // Deduct from sender
  //     senderWallet.balance = mongoose.Types.Decimal128.fromString(
  //       (parseFloat(senderWallet.balance.toString()) - amount).toFixed(2)
  //     );
  //     await senderWallet.save({ session });

  //     // Credit receiver
  //     receiverWallet.balance = mongoose.Types.Decimal128.fromString(
  //       (parseFloat(receiverWallet.balance.toString()) + amount).toFixed(2)
  //     );
  //     await receiverWallet.save({ session });

  //     // Record transactions
  //     await Transaction.create(
  //       [
  //         {
  //           walletId: senderWalletId,
  //           amount: amountDecimal,
  //           type: "debit",
  //           reference: reference || `GBESE_TXN_${Date.now()}`,
  //           description: description || "Transfer to user",
  //         },
  //         {
  //           walletId: receiverWalletId,
  //           amount: amountDecimal,
  //           type: "credit",
  //           reference: reference || `GBESE_TXN_${Date.now()}`,
  //           description: description || "Received transfer from user",
  //         },
  //       ],
  //       { session }
  //     );

  //     await session.commitTransaction();
  //     session.endSession();

  //     return { success: true, message: "Transfer successful" };
  //   } catch (error) {
  //     await session.abortTransaction();
  //     session.endSession();
  //     throw error;
  //   }
  // },
}

export const accountService = new AccountServices();

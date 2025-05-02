import mongoose from "mongoose";
import { PeerTransfer } from "../../types/account.type";
import { accountModel } from "../../model/account.model";
import { APIError } from "better-auth/api";
import Decimal from "decimal.js";

export class AccountTransferService {
  async peerTransfer({ fromAccountId, toAccountId, amount }: PeerTransfer) {
    return mongoose.connection.transaction(async () => {
      const fromAccount = await accountModel.findById(fromAccountId);
      if (!fromAccount) {
        throw new APIError("BAD_REQUEST", {
          message: "Sender account not found",
        });
      }

      const toAccount = await accountModel.findById(toAccountId);
      if (!toAccount) {
        throw new APIError("BAD_REQUEST", {
          message: "Receiver account not found",
        });
      }

      if (fromAccountId === toAccountId) {
        throw new APIError("BAD_REQUEST", {
          message: "Sender and receiver accounts cannot be the same",
        });
      }

      const amountDecimal = new Decimal(amount);
      if (amountDecimal.gt(fromAccount.balance as string)) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "Insufficient balance",
          currentBalance: fromAccount.balance,
        });
      }

      // Update sender account balance
      fromAccount.balance = new Decimal(fromAccount.balance as string)
        .sub(amount)
        .toString();
      await fromAccount.save();

      // Update receiver account balance
      toAccount.balance = new Decimal(toAccount.balance as string)
        .add(amount)
        .toString();
      await toAccount.save();

      return {
        success: true,
        message: "Transfer successful",
        data: { fromAccount, toAccount, amountTransferred: amountDecimal },
      };
    });
  }
}

export const accountTransferService = new AccountTransferService();

import mongoose from "mongoose";
import { PeerTransfer } from "../types/account.type";
import { accountModel } from "../model/account.model";
import { APIError } from "better-auth/api";
import Decimal from "decimal.js";
import {
  TransactionStatuses,
  TransactionTypes,
} from "../types/transaction.type";
import { transactionModel } from "../model/transaction.model";

export class TransferService {
  async peerTransfer({
    fromAccountId,
    toAccountId,
    amount,
    description,
  }: PeerTransfer) {
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

      // Check if account is disabled
      if (!fromAccount.isActive) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "Sender account is disabled",
        });
      }

      const amountDecimal = new Decimal(amount);
      if (amountDecimal.gt(fromAccount.balance as string)) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "Insufficient balance",
          currentBalance: fromAccount.balance,
        });
      }

      const metadata = {
        fromAccountId,
        toAccountId,
        amount,
      };

      // Create transaction histories for the transfer
      const transactionFrom = new transactionModel({
        accountId: fromAccountId,
        type: TransactionTypes.DEBIT,
        balanceBefore: fromAccount.balance,
        description,
        status: TransactionStatuses.PENDING,
        metadata,
      });

      const transactionTo = new transactionModel({
        accountId: toAccountId,
        type: TransactionTypes.CREDIT,
        balanceBefore: toAccount.balance,
        description,
        status: TransactionStatuses.PENDING,
        reference: transactionFrom.reference,
        metadata,
      });

      // Update sender account balance
      fromAccount.balance = new Decimal(fromAccount.balance.toString())
        .sub(amount)
        .toString();
      await fromAccount.save();

      // Update receiver account balance
      toAccount.balance = new Decimal(toAccount.balance.toString())
        .add(amount)
        .toString();
      await toAccount.save();

      // Update transaction history details
      transactionFrom.status = TransactionStatuses.SUCCESS;
      transactionFrom.balanceAfter = fromAccount.balance;
      transactionTo.status = TransactionStatuses.SUCCESS;
      transactionTo.balanceAfter = toAccount.balance;
      await transactionFrom.save();
      await transactionTo.save();

      return {
        success: true,
        message: "Transfer successful",
        data: {
          fromAccount,
          toAccount,
          amountTransferred: amountDecimal,
          transactions: [transactionFrom, transactionTo],
        },
      };
    });
  }
}

export const transferService = new TransferService();

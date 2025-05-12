import mongoose from "mongoose";
import { FundAccount, PeerTransfer, Withdraw } from "../types/account.type";
import { APIError } from "better-auth/api";
import Decimal from "decimal.js";
import {
  TransactionCategories,
  TransactionStatuses,
  TransactionTypes,
} from "../types/transaction.type";
import { transactionModel } from "../model/transaction.model";
import { paystackService } from "./paystack.service";
import { PaystackMetadataAction } from "../types/paystack.type";
import { accountService } from "./account.service";
import { transferRecipientService } from "./transferRecipient.service";

export class TransferService {
  async peerTransfer({
    fromAccountId,
    toAccountId,
    amount,
    description,
    transactionCategory = TransactionCategories.TRANSFER,
  }: PeerTransfer) {
    return mongoose.connection.transaction(async () => {
      const fromAccount = await accountService.getAccount({
        _id: fromAccountId,
      });
      if (!fromAccount) {
        throw new APIError("BAD_REQUEST", {
          message: "Sender account not found",
        });
      }

      const toAccount = await accountService.getAccount({
        _id: toAccountId,
      });
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
        category: transactionCategory,
        balanceBefore: fromAccount.balance,
        description,
        status: TransactionStatuses.PENDING,
        metadata,
      });

      const transactionTo = new transactionModel({
        accountId: toAccountId,
        type: TransactionTypes.CREDIT,
        category: transactionCategory,
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
        fromAccount,
        toAccount,
        amountTransferred: amountDecimal,
        transactions: [transactionFrom, transactionTo],
      };
    });
  }

  async fundAccount({ accountId, amount, callbackUrl }: FundAccount) {
    const account = await accountService.getAccount({ _id: accountId });
    if (!account) {
      throw new APIError("BAD_REQUEST", {
        message: "Account not found",
      });
    }

    const dbTransaction = await mongoose.connection.transaction(async () => {
      const transaction = new transactionModel({
        accountId,
        type: TransactionTypes.CREDIT,
        category: TransactionCategories.FUND,
        balanceBefore: account.balance,
        balanceAfter: new Decimal(account.balance.toString()).add(amount),
        status: TransactionStatuses.PENDING,
      });

      const response = await paystackService.initializePayment({
        amount,
        email: account.user.email,
        reference: transaction.reference,
        callback_url: callbackUrl,
        metadata: { action: PaystackMetadataAction.FUND, accountId },
      });

      transaction.metadata = response;
      await transaction.save();

      return { ...response, transaction };
    });

    return dbTransaction;
  }

  async withdraw({
    accountId,
    amount,
    accountNumber,
    bankCode,
    description,
  }: Withdraw & { accountId: string }) {
    const account = await accountService.getAccount({ _id: accountId });
    if (!account) {
      throw new APIError("BAD_REQUEST", {
        message: "Account not found",
      });
    }

    const amountDecimal = new Decimal(amount!);
    if (amountDecimal.gt(account.balance as string)) {
      throw new APIError("UNPROCESSABLE_ENTITY", {
        message: "Insufficient balance",
        currentBalance: account.balance,
      });
    }

    const dbTransaction = await mongoose.connection.transaction(async () => {
      const resolvedAccount = await paystackService.resolveAccountNumber(
        accountNumber!,
        bankCode!
      );

      // Create or retrieve transfer recipient
      const transferRecipient =
        await transferRecipientService.resolveTransferRecipient({
          accountName: resolvedAccount.account_name,
          bankCode: bankCode!,
          accountNumber: accountNumber!,
          userId: account.userId.toString(),
        });

      // Create transaction history
      const transaction = new transactionModel({
        accountId,
        type: TransactionTypes.DEBIT,
        category: TransactionCategories.WITHDRAWAL,
        balanceBefore: account.balance,
        balanceAfter: new Decimal(account.balance.toString()).sub(amount!),
        status: TransactionStatuses.SUCCESS,
        description,
        metadata: {
          accountNumber: accountNumber!,
          bankCode: bankCode!,
          amount,
          accountName: transferRecipient.name,
          recipientCode: transferRecipient.recipient_code,
        },
      });

      /**
       * The Below commented code is meant to initiiate a transfer from paystack and then for
       * the webhook to react to  the events
       * but paystack requires business upgrade. until then, the withdrawal will be simulated
       */
      // const response = await paystackService.initiateTransfer({
      //   amount: amount!,
      //   recipient: transferRecipient.recipient_code,
      //   reference: transaction.reference,
      // });

      await transaction.save();
      return transaction;
    });

    return dbTransaction;
  }
}

export const transferService = new TransferService();

import mongoose from "mongoose";
import {
  AccountDocument,
  FundAccount,
  PeerTransfer,
  Withdraw,
} from "../types/account.type";
import { APIError } from "better-auth/api";
import Decimal from "decimal.js";
import {
  TransactionCategories,
  TransactionStatuses,
  TransactionTypes,
} from "../types/transaction.type";
import { paystackService } from "./paystack.service";
import { PaystackMetadataAction } from "../types/paystack.type";
import { transferRecipientService } from "./transferRecipient.service";
import { transactionService } from "./transaction.service";

export class TransferService {
  async peerTransfer(
    {
      fromAccount,
      toAccount,
      amount,
      description,
      transactionCategory = TransactionCategories.TRANSFER,
    }: PeerTransfer,
    useTransaction: boolean = true
  ) {
    const dbTransactionCallback = async () => {
      if (fromAccount._id.toString() === toAccount._id.toString()) {
        throw new APIError("BAD_REQUEST", {
          message: "Sender and receiver accounts cannot be the same",
        });
      }

      // Check if sender account is disabled
      if (!fromAccount.isActive) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "Sender account is disabled",
        });
      }

      // Check if receiver account is disabled
      if (!toAccount.isActive) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "Receiver account is disabled",
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
        fromAccountId: fromAccount._id,
        toAccountId: toAccount._id,
        amount,
      };

      // Create transaction histories for the transfer
      const transactionFrom = transactionService.declare({
        accountId: fromAccount._id,
        type: TransactionTypes.DEBIT,
        category: transactionCategory,
        balanceBefore: fromAccount.balance,
        description,
        status: TransactionStatuses.PENDING,
        metadata,
      });

      const transactionTo = transactionService.declare({
        accountId: toAccount._id,
        type: TransactionTypes.CREDIT,
        category: transactionCategory,
        balanceBefore: toAccount.balance,
        description,
        status: TransactionStatuses.PENDING,
        metadata,
      });
      transactionTo.reference = transactionFrom.reference;

      // Update sender account balance
      fromAccount.balance = new Decimal(fromAccount.balance.toString())
        .sub(amount)
        .toString();

      // Update receiver account balance
      toAccount.balance = new Decimal(toAccount.balance.toString())
        .add(amount)
        .toString();

      // Update transaction history details
      transactionFrom.status = TransactionStatuses.SUCCESS;
      transactionFrom.balanceAfter = fromAccount.balance;
      transactionTo.status = TransactionStatuses.SUCCESS;
      transactionTo.balanceAfter = toAccount.balance;

      // Save updated accounts and transactions
      await toAccount.save();
      await fromAccount.save();
      await transactionFrom.save();
      await transactionTo.save();

      return {
        fromAccount,
        toAccount,
        amountTransferred: amountDecimal,
        transactions: [transactionFrom, transactionTo],
      };
    };

    if (useTransaction) {
      return await mongoose.connection.transaction(dbTransactionCallback);
    }

    return dbTransactionCallback();
  }

  async fundAccount(
    { account, amount, callbackUrl }: FundAccount,
    useTransaction: boolean = true
  ) {
    const dbTransactionCallback = async () => {
      // Create a transaction history for the pending fund
      const transaction = transactionService.declare({
        accountId: account._id,
        type: TransactionTypes.CREDIT,
        category: TransactionCategories.FUND,
        balanceBefore: account.balance,
        balanceAfter: new Decimal(account.balance.toString())
          .add(amount)
          .toString(),
        status: TransactionStatuses.PENDING,
      });

      const response = await paystackService.initializePayment({
        amount,
        email: account.user.email,
        reference: transaction.reference,
        callback_url: callbackUrl,
        metadata: {
          action: PaystackMetadataAction.FUND,
          accountId: account._id,
        },
      });

      transaction.metadata = response;
      await transaction.save();

      return { ...response, transaction };
    };

    if (useTransaction) {
      return await mongoose.connection.transaction(dbTransactionCallback);
    }

    return dbTransactionCallback();
  }

  async withdraw(
    {
      account,
      amount,
      accountNumber,
      bankCode,
      description,
    }: Withdraw & { account: AccountDocument },
    useTransaction: boolean = true
  ) {
    const amountDecimal = new Decimal(amount!);
    if (amountDecimal.gt(account.balance as string)) {
      throw new APIError("UNPROCESSABLE_ENTITY", {
        message: "Insufficient balance",
        currentBalance: account.balance,
      });
    }

    const dbTransactionCallback = async () => {
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
      const transaction = transactionService.declare({
        accountId: account._id,
        type: TransactionTypes.DEBIT,
        category: TransactionCategories.WITHDRAWAL,
        balanceBefore: account.balance,
        status: TransactionStatuses.SUCCESS,
        description,
        metadata: {
          accountNumber: accountNumber!,
          accountName: transferRecipient.details.account_name,
          bankCode: bankCode!,
          bankName: transferRecipient.details.bank_name,
          amount,
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

      // Debit the account
      account.balance = new Decimal(account.balance.toString())
        .sub(amount!)
        .toString();

      transaction.balanceAfter = account.balance;

      await account.save();
      await transaction.save();
      return { transaction, fromAccount: account, ...transaction.metadata };
    };

    if (useTransaction) {
      return await mongoose.connection.transaction(dbTransactionCallback);
    }

    return dbTransactionCallback();
  }
}

export const transferService = new TransferService();

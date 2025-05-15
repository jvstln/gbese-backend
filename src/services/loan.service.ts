import mongoose from "mongoose";
import { loanModel } from "../model/loan.model";
import { transactionModel } from "../model/transaction.model";
import { APIError } from "better-auth/api";
import Decimal from "decimal.js";
import { BorrowLoan, LoanStatuses } from "../types/loan.type";
import {
  TransactionCategories,
  TransactionStatuses,
  TransactionTypes,
} from "../types/transaction.type";
import { accountService } from "./account.service";

class LoanService {
  async borrowLoan({
    accountId,
    amount,
    durationInDays,
    description,
  }: BorrowLoan) {
    const dbTransaction = await mongoose.connection.transaction(async () => {
      // Check that user has a wallet account
      const account = await accountService.getAccount({ _id: accountId });
      if (!account) {
        throw new APIError("BAD_REQUEST", {
          message: "User account not found.",
        });
      }

      // Check for loan limits
      const limits = loanModel.getLoanLimit(account.user.points.toString());
      if (new Decimal(amount).gt(limits.amount)) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "Loan amount exceeds limit.",
          limit: limits.amount,
        });
      }

      if (durationInDays > limits.durationInDays) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "Loan duration exceeds limit.",
          limit: limits.durationInDays,
        });
      }

      const activeLoanCount = await loanModel.countDocuments({
        accountId,
        status: {
          $in: [LoanStatuses.ACTIVE, LoanStatuses.PENDING],
        },
      });
      if (activeLoanCount >= limits.activeLoans) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "User has already reached maximum active loans limit.",
          limit: limits.activeLoans,
        });
      }

      const balanceBefore = account.balance;
      const balanceAfter = new Decimal(balanceBefore.toString()).add(amount);

      // Create disbursement transaction
      const transaction = new transactionModel({
        accountId: account._id,
        type: TransactionTypes.CREDIT,
        category: TransactionCategories.LOAN,
        balanceBefore,
        balanceAfter,
        description,
        status: TransactionStatuses.SUCCESS,
      });

      // Create the loan record
      const loan = new loanModel({
        accountId,
        principal: amount,
        status: LoanStatuses.ACTIVE,
        durationInDays,
      });

      // Disburse funds — credit the user’s wallet And save record
      account.balance = balanceAfter.toString();
      loan.disbursedAt = new Date();
      transaction.metadata = {
        loanId: loan._id,
      };

      await account.save();
      await transaction.save();
      await loan.save();

      return { loan, transaction, account };
    });

    return dbTransaction;
  }
}

export const loanService = new LoanService();

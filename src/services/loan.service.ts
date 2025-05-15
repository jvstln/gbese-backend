import mongoose from "mongoose";
import { loanModel } from "../model/loan.model";
import { transactionModel } from "../model/transaction.model";
import { APIError } from "better-auth/api";
import Decimal from "decimal.js";
import { BorrowLoan, LoanStatuses, PayLoan } from "../types/loan.type";
import {
  TransactionCategories,
  TransactionStatuses,
  TransactionTypes,
} from "../types/transaction.type";
import { accountService } from "./account.service";
import { transactionService } from "./transaction.service";

class LoanService {
  async getLoan(filters: Record<string, unknown>) {
    return loanModel.findOne(filters);
  }

  getUsersActiveLoans(accountId: string | mongoose.Types.ObjectId) {
    return loanModel.find({
      accountId,
      status: {
        $in: [LoanStatuses.ACTIVE, LoanStatuses.PENDING],
      },
    });
  }

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

      const activeLoanCount = await this.getUsersActiveLoans(
        accountId
      ).countDocuments();
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

  async payLoan({ loanId, accountId, amount, isPartialPayment }: PayLoan) {
    const dbTransaction = await mongoose.connection.transaction(async () => {
      const loan = await loanModel.findById(loanId);
      if (!loan) {
        throw new APIError("NOT_FOUND", {
          message: "Loan not found.",
        });
      }

      if (loan.status !== LoanStatuses.ACTIVE) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "Loan is not active.",
        });
      }

      const account = await accountService.getAccount({ _id: accountId });
      if (!account) {
        throw new APIError("BAD_REQUEST", {
          message: "User account not found.",
        });
      }

      if (new Decimal(loan.principal.toString()).lt(amount)) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "Loan amount is less than the payment amount.",
          loanAmount: loan.principal.toString(),
          paymentAmount: amount,
        });
      }

      if (
        !isPartialPayment &&
        !new Decimal(loan.principal.toString()).eq(amount)
      ) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "Loan amount does not match the payment amount.",
          loanAmount: loan.principal.toString(),
          paymentAmount: amount,
        });
      }

      const balanceBefore = account.balance;
      const balanceAfter = new Decimal(balanceBefore.toString()).sub(amount);

      if (balanceAfter.lt(0)) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "Insufficient balance.",
        });
      }

      const disbursementTransaction = await transactionService.getTransaction({
        accountId: loan.accountId,
        type: TransactionTypes.CREDIT,
        category: TransactionCategories.LOAN,
        "metadata.loanId": loan._id,
      });

      const transaction = transactionService.declare({
        accountId,
        type: TransactionTypes.DEBIT,
        category: TransactionCategories.LOAN,
        balanceBefore,
        balanceAfter,
        description: disbursementTransaction?.description,
        status: TransactionStatuses.SUCCESS,
        metadata: {
          loanId: loan._id,
        },
      });

      loan.amountPaid = new Decimal(loan.amountPaid.toString())
        .add(amount)
        .toString();
      if (
        new Decimal(loan.amountPaid.toString()).eq(loan.principal.toString())
      ) {
        loan.status = LoanStatuses.REPAID;
      }

      await loan.save();
      await transaction.save();

      return { transaction, loan };
    });

    return dbTransaction;
  }
}

export const loanService = new LoanService();

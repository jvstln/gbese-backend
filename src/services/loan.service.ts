import mongoose, { Document } from "mongoose";
import { loanModel } from "../model/loan.model";
import { APIError } from "better-auth/api";
import Decimal from "decimal.js";
import {
  BorrowLoan,
  LoanStatuses,
  PayLoan,
  PayLoanUsingIds as PayLoanUsingId,
} from "../types/loan.type";
import {
  TransactionCategories,
  TransactionStatuses,
  TransactionTypes,
} from "../types/transaction.type";
import { accountService } from "./account.service";
import { transactionService } from "./transaction.service";

class LoanService {
  async exists(filters: Record<string, unknown>) {
    return loanModel.exists(filters);
  }

  async getLoan(filters: Record<string, unknown>) {
    return loanModel.findOne(filters);
  }

  async getLoans(filters: Record<string, unknown>) {
    return loanModel.find(filters);
  }

  getUserActiveLoans(accountId: ObjectId) {
    return loanModel.find({
      accountId,
      status: {
        $in: [LoanStatuses.ACTIVE, LoanStatuses.PENDING],
      },
    });
  }

  async getLoanStatistics(accountId: ObjectId) {
    const activeLoans = await this.getUserActiveLoans(accountId);
    const totalAmountInDebt = activeLoans.reduce(
      (total, loan) => total.add(loan.totalAmountToBePaid),
      new Decimal(0)
    );

    return {
      totalAmountInDebt,
      totalLoanCount: activeLoans.length,
    };
  }

  async borrowLoan(
    { account, amount, durationInDays, description }: BorrowLoan,
    useTransaction: boolean = true
  ) {
    if (!account.isActive) {
      throw new APIError("UNPROCESSABLE_ENTITY", {
        message: "Account is disabled.",
      });
    }

    const dbTransactionCallback = async () => {
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

      const activeLoanCount = await this.getUserActiveLoans(
        account._id
      ).countDocuments();
      if (activeLoanCount >= limits.activeLoans) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "User has already reached maximum active loans limit.",
          limit: limits.activeLoans,
        });
      }

      const balanceBefore = account.balance;
      const balanceAfter = new Decimal(balanceBefore.toString())
        .add(amount)
        .toString();

      // Create disbursement transaction
      const transaction = transactionService.declare({
        accountId: account._id,
        type: TransactionTypes.CREDIT,
        category: TransactionCategories.LOAN,
        balanceBefore,
        balanceAfter: balanceAfter,
        description,
        status: TransactionStatuses.SUCCESS,
      });

      // Create the loan record
      const loan = new loanModel({
        accountId: account._id,
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
    };

    if (useTransaction) {
      return await mongoose.connection.transaction(dbTransactionCallback);
    }

    return dbTransactionCallback();
  }

  async payLoanUsingId(
    { loanId, account, amount }: PayLoanUsingId,
    useTransaction?: boolean
  ) {
    const loan = await loanModel.findById(loanId);
    if (!loan) {
      throw new APIError("NOT_FOUND", {
        message: "Loan not found.",
      });
    }

    return this.payLoan({ loan, account, amount }, useTransaction);
  }

  async payLoan(
    { loan, account, amount: defaultAmount }: PayLoan,
    useTransaction: boolean = true
  ) {
    if (!account.isActive) {
      throw new APIError("UNPROCESSABLE_ENTITY", {
        message: "Account is disabled.",
      });
    }

    const transactionCallback = async () => {
      if (loan.status !== LoanStatuses.ACTIVE) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "Loan is not active.",
        });
      }

      // If amount is not specified or if amount is greater than the loan amount, the amount becomes the total loan amount
      const amount =
        !defaultAmount || new Decimal(defaultAmount).gt(loan.amountRemaining)
          ? loan.amountRemaining
          : defaultAmount;

      if (new Decimal(loan.totalAmountToBePaid).lt(amount)) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "Loan amount is less than the payment amount.",
          loanAmount: loan.totalAmountToBePaid,
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
        accountId: account._id,
        type: TransactionTypes.DEBIT,
        category: TransactionCategories.LOAN,
        balanceBefore,
        balanceAfter: balanceAfter.toString(),
        description: disbursementTransaction?.description,
        status: TransactionStatuses.SUCCESS,
        metadata: {
          loanId: loan._id,
        },
      });

      account.balance = balanceAfter.toString();
      loan.amountPaid = new Decimal(loan.amountPaid.toString())
        .add(amount)
        .toString();
      if (
        new Decimal(loan.amountPaid.toString()).gte(loan.principal.toString())
      ) {
        loan.status = LoanStatuses.REPAID;
      }

      await loan.save();
      await transaction.save();
      await account.save();

      return { transaction, loan, account };
    };

    if (useTransaction) {
      return await mongoose.connection.transaction(transactionCallback);
    }

    return transactionCallback();
  }
}

export const loanService = new LoanService();

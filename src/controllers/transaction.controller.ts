import { Request, Response } from "express";
import { transactionService } from "../services/transaction.service";
import { TransactionFilters } from "../types/transaction.type";
import { APIError } from "better-auth/api";

class TransactionController {
  async getUserTransactions(
    req: Request<{}, {}, {}, TransactionFilters>,
    res: Response
  ) {
    console.log(req.query);
    const transactions = await transactionService.getUserTransactions(
      req.userSession!.user._id.toString(),
      req.query
    );

    res.json({
      success: true,
      message: "Transactions fetched successfully",
      ...transactions,
    });
  }

  async getTransactionByReference(
    req: Request<{ reference: string }>,
    res: Response
  ) {
    const transaction = await transactionService.getUserTransactionByReference(
      req.userSession!.user.account._id.toString(),
      req.params.reference
    );

    if (!transaction) {
      throw new APIError("NOT_FOUND", {
        message: "Transaction not found",
      });
    }

    if (transaction.accountId === req.userSession?.user.account._id) {
      throw new APIError("UNAUTHORIZED", {
        message: "You are not authorized to view this transaction",
      });
    }

    res.json({
      success: true,
      message: "Transaction fetched successfully",
      data: transaction,
    });
  }
}

export const transactionController = new TransactionController();

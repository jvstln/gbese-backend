import { Request, Response } from "express";
import { transactionService } from "../services/transaction.service";
import { TransactionFilters } from "../types/transaction.type";
import { APIError } from "better-auth/api";

class TransactionController {
  async getUserTransactions(
    req: Request<{}, {}, {}, TransactionFilters>,
    res: Response
  ) {
    const transactions = await transactionService.getUserTransactions(
      req.userSession!.user._id,
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
      req.userSession!.account._id,
      req.params.reference
    );

    res.json({
      success: true,
      message: "Transaction fetched successfully",
      data: transaction,
    });
  }
}

export const transactionController = new TransactionController();

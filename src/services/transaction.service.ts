import mongoose from "mongoose";
import { transactionModel } from "../model/transaction.model";
import {
  TransactionCreation,
  TransactionFilters,
} from "../types/transaction.type";
import { formatPaginatedDocs } from "../utils/utils";
import { APIError } from "better-auth/api";

class TransactionService {
  async getTransaction(filter: Record<string, unknown>) {
    return transactionModel.findOne(filter);
  }

  declare(data: Partial<TransactionCreation>) {
    return new transactionModel(data);
  }

  async getUserTransactions(userId: ObjectId, filters: TransactionFilters) {
    const matchStage: Record<string, unknown> = {
      "account.userId": new mongoose.Types.ObjectId(userId),
    };

    if (filters.type) matchStage.type = filters.type;
    if (filters.status) matchStage.status = filters.status;
    if (filters.category) matchStage.category = filters.category;
    if (filters.dateTo) {
      matchStage.createdAt = {
        ...(matchStage.createdAt as Record<string, unknown>),
        $lte: new Date(filters.dateTo),
      };
    }
    if (filters.dateFrom) {
      matchStage.createdAt = {
        ...(matchStage.createdAt as Record<string, unknown>),
        $gte: new Date(filters.dateFrom),
      };
    }

    const aggregateQuery = transactionModel.aggregate([
      {
        $lookup: {
          from: "accounts",
          localField: "accountId",
          foreignField: "_id",
          as: "account",
        },
      },
      { $match: matchStage },
      {
        $project: { account: 0 },
      },
      {
        $set: {
          balanceBefore: { $toString: "$balanceBefore" },
          balanceAfter: { $toString: "$balanceAfter" },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    const paginationResult = await transactionModel.aggregatePaginate(
      aggregateQuery,
      {
        page: filters.page,
        limit: filters.limit,
        pagination: filters.page !== undefined || filters.limit !== undefined,
      }
    );
    return formatPaginatedDocs(paginationResult);
  }

  async getUserTransactionByReference(accountId: ObjectId, reference: string) {
    const transaction = await transactionModel.findOne({
      accountId,
      reference,
    });

    if (!transaction) {
      throw new APIError("NOT_FOUND", {
        message: "Transaction not found",
      });
    }

    if (transaction.accountId.toString() === accountId.toString()) {
      throw new APIError("UNAUTHORIZED", {
        message: "You are not authorized to view this transaction",
      });
    }

    return transaction;
  }
}

export const transactionService = new TransactionService();

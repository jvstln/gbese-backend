import { APIError } from "better-auth/api";
import { DebtRequest } from "../model/debtRequest.model";
import {
  DebtRequestCreation,
  DebtRequestStatuses,
} from "../types/debtRequest.type";
import { getDebtStatisticsPipeline } from "../pipelines/debtRequest.pipeline";
import mongoose from "mongoose";
import { transferService } from "./transfer.service";
import { userService } from "./user.service";
import { User } from "../types/user.type";
import { TransactionCategories } from "../types/transaction.type";

class DebtRequestService {
  async createDebtRequest(data: DebtRequestCreation) {
    const debtRequest = await DebtRequest.create(data);
    return debtRequest;
  }

  async getDebtRequests(filters: Record<string, unknown> = {}) {
    return DebtRequest.find(filters).populate("debtor creditor payer");
  }

  async updateDebtRequest(id: string, updates: Partial<DebtRequestCreation>) {
    const debtRequest = await DebtRequest.findById(id);

    if (!debtRequest) {
      throw new APIError("NOT_FOUND", {
        message: "Debt request not found",
      });
    }

    debtRequest.set(updates);

    const updatedDebtRequest = await debtRequest.save();
    return updatedDebtRequest.populate("debtor creditor payer");
  }

  async getDebtStatistics(userId: string) {
    const debtRequestStats = await DebtRequest.aggregate(
      getDebtStatisticsPipeline(userId)
    ).exec();
    return debtRequestStats[0];
  }

  async payDebtRequest(id: string, currentUser: User) {
    const debtRequest = await DebtRequest.findById(id);

    if (!debtRequest) {
      throw new APIError("NOT_FOUND", {
        message: "Debt request not found",
      });
    }

    if (debtRequest.status === DebtRequestStatuses.ACCEPTED) {
      throw new APIError("UNPROCESSABLE_ENTITY", {
        message: "Debt request already accepted/paid",
      });
    }

    const creditor = await userService.getUser({ _id: debtRequest.creditorId });
    const payer = await userService.getUser({ _id: debtRequest.payerId });

    if (!creditor) {
      throw new APIError("UNPROCESSABLE_ENTITY", {
        message:
          "Creditor not found. The person receiving the payment must be a registered user on the platform",
      });
    }

    const isPayerTheCurrentUser =
      payer && payer._id.toString() === currentUser._id.toString();
    if (!isPayerTheCurrentUser) {
      throw new APIError("UNPROCESSABLE_ENTITY", {
        message: "You are not meant to pay this debt.",
      });
    }

    const payedDebtRequest = await mongoose.connection.transaction(async () => {
      const transfer = await transferService.peerTransfer({
        fromAccountId: payer.account._id.toString(),
        toAccountId: creditor.account._id.toString(),
        amount: debtRequest.amount.toString(),
        description: debtRequest.description,
        transactionCategory: TransactionCategories.DEBT_TRANSFER,
      });

      debtRequest.status = DebtRequestStatuses.ACCEPTED;
      await debtRequest.save();

      return transfer;
    });

    return payedDebtRequest;
  }
}

export const debtRequestService = new DebtRequestService();

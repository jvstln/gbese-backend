import { APIError } from "better-auth/api";
import { debtRequestModel } from "../model/debtRequest.model";
import {
  DebtRequestCreation,
  DebtRequestStatuses,
} from "../types/debtRequest.type";
import { getDebtStatisticsPipeline } from "../pipelines/debtRequest.pipeline";
import mongoose from "mongoose";
import { userService } from "./user.service";
import { User } from "../types/user.type";
import { loanService } from "./loan.service";

class DebtRequestService {
  async createDebtRequest(data: DebtRequestCreation) {
    const debtRequest = new debtRequestModel(data);
    return await debtRequest.save();
  }

  async getDebtRequests(filters: Record<string, unknown> = {}) {
    return debtRequestModel.find(filters).populate("debtor payer");
  }

  async updateDebtRequest(id: string, updates: Partial<DebtRequestCreation>) {
    const debtRequest = await debtRequestModel.findById(id);

    if (!debtRequest) {
      throw new APIError("NOT_FOUND", {
        message: "Debt request not found",
      });
    }

    debtRequest.set(updates);

    const updatedDebtRequest = await debtRequest.save();
    return updatedDebtRequest.populate("debtor payer");
  }

  async getDebtStatistics(userId: string) {
    const debtRequestStats = await debtRequestModel
      .aggregate(getDebtStatisticsPipeline(userId))
      .exec();
    return debtRequestStats[0];
  }

  async payDebtRequest(id: string, currentUser: User) {
    const debtRequest = await debtRequestModel.findById(id);

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

    const payer = await userService.getUser({ _id: debtRequest.payerId });

    const isPayerTheCurrentUser =
      payer && payer._id.toString() === currentUser._id.toString();
    if (!payer || !isPayerTheCurrentUser) {
      throw new APIError("UNPROCESSABLE_ENTITY", {
        message: "You are not meant to pay this debt.",
      });
    }

    const payedDebtRequest = await mongoose.connection.transaction(async () => {
      const loanPayment = await loanService.payLoan({
        loanId: debtRequest._id.toString(),
        accountId: payer.account._id.toString(),
        amount: debtRequest.amount.toString(),
        isPartialPayment: false,
      });

      debtRequest.status = DebtRequestStatuses.ACCEPTED;
      await debtRequest.save();

      return loanPayment;
    });

    return payedDebtRequest;
  }
}

export const debtRequestService = new DebtRequestService();

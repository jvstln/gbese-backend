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
import Decimal from "decimal.js";

class DebtRequestService {
  async createDebtRequest(currentUser: User, data: DebtRequestCreation) {
    let loan;

    // Get the loan associated to the debt request
    if (data.loanId) {
      loan = await loanService.getLoan({
        _id: data.loanId,
        accountId: currentUser.account._id,
      });

      if (!loan) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "User has no loan with the specified ID",
        });
      }
    } else {
      // Pick the first active loan of the user
      const activeLoans = await loanService.getUsersActiveLoans(
        currentUser.account._id
      );

      if (activeLoans.length === 0) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "User is currently not in debt.",
        });
      }
      loan = activeLoans[0];
    }

    // If no amount is specified, The amount becomes the total loan amount
    if (!data.amount) {
      data.amount = loan.totalAmountToBePaid;
    }

    const debtRequest = new debtRequestModel({
      ...data,
      loanId: loan._id,
    });
    return await debtRequest.save();
  }

  async getDebtRequests(filters: Record<string, unknown> = {}) {
    return debtRequestModel.find(filters).populate("debtor payer loan");
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
      // Add points for clearing a debt to user
      payer.points = new Decimal(payer.points.toString())
        .add(debtRequest.debtPoint.toString())
        .toString();

      await payer.save();

      const loanPayment = await loanService.payLoan(
        {
          loanId: debtRequest.loanId.toString(),
          accountId: payer.account._id.toString(),
          amount: debtRequest.amount.toString(),
          isPartialPayment: false,
        },
        false
      );

      debtRequest.status = DebtRequestStatuses.ACCEPTED;
      await debtRequest.save();

      return loanPayment;
    });

    return payedDebtRequest;
  }
}

export const debtRequestService = new DebtRequestService();

import { APIError } from "better-auth/api";
import { debtRequestModel } from "../model/debtRequest.model";
import {
  DebtRequestCreation,
  DebtRequestStatuses,
} from "../types/debtRequest.type";
import { getDebtStatisticsPipeline } from "../pipelines/debtRequest.pipeline";
import mongoose from "mongoose";
import { userService } from "./user.service";
import { UserDocument } from "../types/user.type";
import { loanService } from "./loan.service";
import Decimal from "decimal.js";

class DebtRequestService {
  async createDebtRequest(
    currentUser: UserDocument,
    data: DebtRequestCreation
  ) {
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

    // If no amount is specified, The amount becomes the remaining loan amount to be paid
    if (!data.amount) {
      data.amount = loan.amountRemaining;
    }

    if (
      new Decimal(data.amount.toString()).gt(new Decimal(loan.amountRemaining))
    ) {
      throw new APIError("UNPROCESSABLE_ENTITY", {
        message: "Amount to be paid cannot be greater than amount in debt",
      });
    }

    const debtRequest = new debtRequestModel({
      ...data,
      loanId: loan._id,
    });
    await debtRequest.save();
    return debtRequest.populate("debtor payer");
  }

  async getDebtRequests(filters: Record<string, unknown> = {}) {
    return debtRequestModel.find(filters).populate("debtor payer loan");
  }

  async updateDebtRequest(
    id: string,
    updates: Partial<DebtRequestCreation>,
    user: UserDocument
  ) {
    // Get the loan associated to the debt request
    const debtRequest = await debtRequestModel.findById(id);

    if (!debtRequest) {
      throw new APIError("NOT_FOUND", {
        message: "Debt request not found",
      });
    }

    updates.amount = updates.amount ?? debtRequest.amount;

    if (updates.loanId) {
      const loan = await loanService.getLoan({
        _id: updates.loanId,
        accountId: user.account._id,
      });

      if (!loan) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "User has no loan with the specified ID",
        });
      }

      if (
        new Decimal(updates.amount.toString()).gt(
          new Decimal(loan.amountRemaining)
        )
      ) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          message: "Amount to be paid cannot be greater than amount in debt",
        });
      }
    }

    debtRequest.set(updates);

    const updatedDebtRequest = await debtRequest.save();
    return updatedDebtRequest.populate("debtor payer");
  }

  /**
   * Gets all debt request a user can pay/clear
   */
  async getShuffledDebtRequests(user: UserDocument) {
    const debtRequests = await this.getDebtRequests({
      payerId: { $in: [user._id, null] },
      debtorId: { $ne: user._id },
      status: DebtRequestStatuses.PENDING,
      amount: { $lte: user.account.balance },
    });

    return debtRequests;
  }

  async getDebtStatistics(userId: ObjectId) {
    const debtRequestStats = await debtRequestModel
      .aggregate(getDebtStatisticsPipeline(userId))
      .exec();
    return debtRequestStats[0];
  }

  async payDebtRequest(id: string, currentUser: UserDocument) {
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

    const payer = await userService.getUser({
      _id: debtRequest.payerId ?? currentUser._id,
    });

    // Check whether the payer is eligible to pay this debt request.
    // A payer is eligible if he is explicitly stated as the payer or if the payer is not specified
    if (!payer || payer._id.toString() !== currentUser._id.toString()) {
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
          loanId: debtRequest.loanId,
          accountId: payer.account._id,
          amount: debtRequest.amount.toString(),
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

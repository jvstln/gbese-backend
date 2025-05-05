import { APIError } from "better-auth/api";
import { DebtRequest } from "../model/debtRequest.model";
import { DebtRequestCreation } from "../types/debtRequest.type";
import { getDebtStatisticsPipeline } from "../pipelines/debtRequest.pipeline";

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
}

export const debtRequestService = new DebtRequestService();

import { APIError } from "better-auth/api";
import { DebtRequest } from "../model/debtRequest.model";
import { DebtRequestCreation } from "../types/debtRequest.type";

export const createDebtTransfer = async (data: DebtRequestCreation) => {
  const debtRequest = await DebtRequest.create(data);

  return getDebtTransfers({ _id: debtRequest._id });
};

export const getDebtTransfers = async (
  filters: Record<string, unknown> = {}
) => {
  return DebtRequest.find().populate("debtor creditor payer");
};

export const updateDebtTransfer = async (
  id: string,
  updates: Partial<DebtRequestCreation>
) => {
  const debtRequest = await DebtRequest.findById(id);

  if (!debtRequest) {
    throw new APIError("NOT_FOUND", {
      message: "Debt request not found",
    });
  }

  debtRequest.set(updates);

  const updatedDebtRequest = await debtRequest.save();
  return updatedDebtRequest.populate("debtor creditor payer");
};

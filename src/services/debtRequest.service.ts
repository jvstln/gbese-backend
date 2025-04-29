import { DebtRequest } from "../model/debtRequest.model";
import { IDebtRequest } from "../types/debtRequest.type";

export const createDebtTransfer = async (data: Partial<IDebtRequest>) => {
  return await DebtRequest.create(data);
};

export const getDebtTransfers = async (
  filters: Record<string, unknown> = {}
) => {
  return DebtRequest.find(filters).exec();
};

export const updateDebtTransfer = async (
  id: string,
  updates: Partial<IDebtRequest>
) => {
  return DebtRequest.findByIdAndUpdate(id, updates, { new: true }).exec();
};

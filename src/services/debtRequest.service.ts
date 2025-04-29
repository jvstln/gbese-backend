import { DebtRequest, IDebtRequest } from "../model/debtRequest.model";

export const createDebtTransfer = async (data: Partial<IDebtRequest>) => {
  return await DebtRequest.create(data);
};

export const getUserDebtTransfers = async (userId: string) => {
  return DebtRequest.find({ senderId: userId }).exec();
};

export const getAllDebtTransfers = async () => {
  return DebtRequest.find().exec();
};

export const updateDebtTransfer = async (
  id: string,
  updates: Partial<IDebtRequest>
) => {
  return DebtRequest.findByIdAndUpdate(id, updates, { new: true }).exec();
};

import { DebtTransfer, IDebtTransfer } from "../model/debtTransfer.model";

export const createDebtTransfer = async (data: Partial<IDebtTransfer>) => {
  return await DebtTransfer.create(data);
};

export const getUserDebtTransfers = async (userId: string) => {
  return await DebtTransfer.find({ senderId: userId });
};

export const getAllDebtTransfers = async () => {
  return await DebtTransfer.find();
};

export const updateDebtTransfer = async (id: string, updates: Partial<IDebtTransfer>) => {
  return await DebtTransfer.findByIdAndUpdate(id, updates, { new: true });
};
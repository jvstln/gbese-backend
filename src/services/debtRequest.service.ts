import { APIError } from "better-auth/api";
import { DebtRequest } from "../model/debtRequest.model";
import { DebtRequestCreation, IDebtRequest } from "../types/debtRequest.type";

export const createDebtTransfer = async (data: DebtRequestCreation) => {
  validateDebtRequestData(data);

  return (await DebtRequest.create(data)).populate([
    { path: "debtorId" },
    { path: "creditorId" },
    { path: "payerId" },
  ]);
};

export const getDebtTransfers = async (
  filters: Record<string, unknown> = {}
) => {
  return DebtRequest.find(filters)
    .populate([
      { path: "debtorId" },
      { path: "creditorId" },
      { path: "payerId" },
    ])
    .exec();
};

export const updateDebtTransfer = async (
  id: string,
  updates: Partial<DebtRequestCreation>
) => {
  return DebtRequest.findByIdAndUpdate(id, updates, { new: true })
    .populate([
      { path: "debtorId" },
      { path: "creditorId" },
      { path: "payerId" },
    ])
    .exec();
};

const validateDebtRequestData = (data: DebtRequestCreation) => {
  if (
    data.debtorId.toString() === data.creditorId.toString() ||
    data.debtorId.toString() === data.payerId.toString()
  ) {
    throw new APIError("UNPROCESSABLE_ENTITY", {
      message: "You (Debtor) cannot be the same as creditor or payer",
    });
  }

  if (data.creditorId.toString() === data.payerId.toString()) {
    throw new APIError("UNPROCESSABLE_ENTITY", {
      message: "Creditor cannot be the same as payer",
    });
  }
};

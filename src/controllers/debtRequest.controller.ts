import { Request, Response } from "express";
import {
  createDebtTransfer,
  getDebtTransfers,
  updateDebtTransfer,
} from "../services/debtRequest.service";

export const createDebtRequest = async (req: Request, res: Response) => {
  req.body.debtorId = req.userSession!.user._id;

  const debtTransfer = await createDebtTransfer(req.body);
  res.status(201).json({
    success: true,
    message: "Debt request created successfully",
    data: debtTransfer,
  });
};

export const getUserDebtRequests = async (req: Request, res: Response) => {
  const { role } = req.query;
  const userId = req.userSession!.user._id;
  let filter: Record<string, unknown> = {};

  if (role === "creditor") filter.creditorId = userId;
  else if (role === "debtor") filter.debtorId = userId;
  else if (role === "payer") filter.payerId = userId;
  else {
    filter = {
      $or: [{ debtorId: userId }, { creditorId: userId }, { payerId: userId }],
    };
  }

  const userDebtRequests = await getDebtTransfers(filter);
  res.status(200).json({
    success: true,
    message: "User debt requests fetched successfully",
    data: userDebtRequests,
  });
};

export const getAllDebtRequests = async (_req: Request, res: Response) => {
  const debtTransfers = await getDebtTransfers();
  res.status(200).json({
    success: true,
    message: "All debt requests fetched successfully",
    data: debtTransfers,
  });
};

export const updateDebtRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedDebtTransfer = await updateDebtTransfer(id, updates);
  res.status(200).json({ success: true, data: updatedDebtTransfer });
};

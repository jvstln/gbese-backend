import { Request, Response } from "express";
import {
  createDebtTransfer,
  getDebtTransfers,
  updateDebtTransfer,
} from "../services/debtRequest.service";

export const createDebtRequest = async (req: Request, res: Response) => {
  const debtTransfer = await createDebtTransfer(req.body);
  res.status(201).json({ success: true, data: debtTransfer });
};

export const getUserDebtRequests = async (req: Request, res: Response) => {
  const { userId } = req.query;
  let filter: Record<string, unknown> = {};

  if (userId === "creditor") filter.creditorId = userId;
  else if (userId === "debtor") filter.debtorId = userId;
  else if (userId === "payer") filter.payerId = userId;
  else {
    filter = {
      $or: [{ debtorId: userId }, { creditorId: userId }, { payerId: userId }],
    };
  }

  const userDebtRequests = await getDebtTransfers(filter);
  res.status(200).json({ success: true, data: userDebtRequests });
};

export const getAllDebtRequests = async (_req: Request, res: Response) => {
  const debtTransfers = await getDebtTransfers();
  res.status(200).json({ success: true, data: debtTransfers });
};

export const updateDebtRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  // Prevent updating senderId or receiverId
  delete updates.senderId;
  delete updates.receiverId;

  const updatedDebtTransfer = await updateDebtTransfer(id, updates);
  res.status(200).json({ success: true, data: updatedDebtTransfer });
};

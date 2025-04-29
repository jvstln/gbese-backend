import { Request, Response } from "express";
import {
  createDebtTransfer,
  getUserDebtTransfers,
  getAllDebtTransfers,
  updateDebtTransfer,
} from "../services/debtRequest.service";

export const createDebtRequest = async (req: Request, res: Response) => {
  const debtTransfer = await createDebtTransfer(req.body);
  res.status(201).json({ success: true, data: debtTransfer });
};

export const getUserCreatedDebtRequests = async (
  req: Request,
  res: Response
) => {
  const userId = req.userSession!.user._id;

  const userCreatedDebtRequests = await getUserDebtTransfers(userId);
  res.status(200).json({
    success: true,
    message: "Debt requests created by user retrieved successfully",
    data: userCreatedDebtRequests,
  });
};

export const getAllDebtRequests = async (_req: Request, res: Response) => {
  const debtTransfers = await getAllDebtTransfers();
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

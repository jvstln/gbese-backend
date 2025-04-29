import { Request, Response } from "express";
import {
  createDebtTransfer,
  getUserDebtTransfers,
  getAllDebtTransfers,
  updateDebtTransfer,
} from "../services/debtTransfer.service";

export const createDebtRequest = async (req: Request, res: Response) => {
  try {
    const debtTransfer = await createDebtTransfer(req.body);
    res.status(201).json({ success: true, data: debtTransfer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserDebtRequests = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const debtTransfers = await getUserDebtTransfers(userId);
    res.status(200).json({ success: true, data: debtTransfers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDebtRequests = async (_req: Request, res: Response) => {
  try {
    const debtTransfers = await getAllDebtTransfers();
    res.status(200).json({ success: true, data: debtTransfers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDebtRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent updating senderId or receiverId
    delete updates.senderId;
    delete updates.receiverId;

    const updatedDebtTransfer = await updateDebtTransfer(id, updates);
    res.status(200).json({ success: true, data: updatedDebtTransfer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
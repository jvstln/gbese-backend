import { Request, Response } from "express";
import { transferService } from "../services/transfer.service";

class TransferController {
  async peerTransfer(req: Request, res: Response) {
    const response = await transferService.peerTransfer({
      fromAccountId: req.userSession?.user.account._id,
      ...req.body,
    });

    res.status(201).json(response);
  }
}

export const transferController = new TransferController();

import { Request, Response } from "express";
import { transferService } from "../services/transfer.service";

class TransferController {
  async peerTransfer(req: Request, res: Response) {
    const transferResponse = await transferService.peerTransfer({
      fromAccountId: req.userSession?.user.account._id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Transfer successful",
      data: transferResponse,
    });
  }
}

export const transferController = new TransferController();

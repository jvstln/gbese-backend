import { Request, Response } from "express";
import { transferService } from "../services/transfer.service";
import { FundAccount } from "../types/account.type";

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

  async initiateFundUserAccount(
    req: Request<{}, {}, {}, Omit<FundAccount, "accountId">>,
    res: Response
  ) {
    const fundResponse = await transferService.fundAccount({
      accountId: req.userSession!.user.account._id.toString(),
      ...req.query,
    });

    res.redirect(fundResponse.authorization_url);
  }
}

export const transferController = new TransferController();

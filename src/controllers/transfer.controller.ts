import { Request, Response } from "express";
import { transferService } from "../services/transfer.service";
import { FundAccount, Withdraw as Withdrawal } from "../types/account.type";

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

  async initiateWithdrawal(
    req: Request<{}, {}, {}, Withdrawal>,
    res: Response
  ) {
    const withdrawalResponse = await transferService.withdraw({
      accountId: req.userSession!.user.account._id.toString(),
      ...req.body,
    });

    res.json({
      success: true,
      message: "Withdrawal successful",
      data: {
        ...withdrawalResponse.metadata,
        transaction: withdrawalResponse,
      },
    });
  }
}

export const transferController = new TransferController();

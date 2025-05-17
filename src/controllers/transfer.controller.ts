import { Request, Response } from "express";
import { transferService } from "../services/transfer.service";
import { FundAccount, Withdraw as Withdrawal } from "../types/account.type";
import { accountService } from "../services/account.service";

class TransferController {
  async peerTransfer(req: Request, res: Response) {
    const toAccount = accountService.getAccountByIdOrNumber(
      req.body.toAccountId
    );

    const transferResponse = await transferService.peerTransfer({
      ...req.body,
      fromAccount: req.userSession!.account,
      toAccount,
    });

    res.status(201).json({
      success: true,
      message: "Transfer successful",
      data: transferResponse,
    });
  }

  async fundAccount(
    req: Request<{}, {}, {}, Omit<FundAccount, "account">>,
    res: Response
  ) {
    const fundResponse = await transferService.fundAccount({
      ...req.query,
      account: req.userSession!.account,
    });

    res.redirect(fundResponse.authorization_url);
  }

  async withdraw(req: Request<{}, {}, {}, Withdrawal>, res: Response) {
    const withdrawalResponse = await transferService.withdraw({
      account: req.userSession!.account,
      ...req.body,
    });

    res.json({
      success: true,
      message: "Withdrawal successful",
      data: withdrawalResponse,
    });
  }
}

export const transferController = new TransferController();

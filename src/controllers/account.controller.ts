import { Request, Response } from "express";
import { generateAccountNumber } from "../utils/finance";
import { accountService } from "../services/accounts/account.service";
import { accountTransferService } from "../services/accounts/transfer.service";

class AccountController {
  async getUserAccount(req: Request, res: Response) {
    const userWallet = await accountService.getAccount({
      userId: req.userSession!.user._id,
    });

    res.json({
      success: true,
      message: "User wallet fetched successfully",
      data: userWallet,
      number: generateAccountNumber(),
    });
  }

  async peerTransfer(req: Request, res: Response) {
    const response = await accountTransferService.peerTransfer({
      fromAccountId: req.userSession?.user.account._id,
      ...req.body,
    });

    res.json(response);
  }
}

export const accountController = new AccountController();

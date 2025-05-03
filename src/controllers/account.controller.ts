import { Request, Response } from "express";
import { generateAccountNumber } from "../utils/finance";
import { accountService } from "../services/account.service";

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
}

export const accountController = new AccountController();

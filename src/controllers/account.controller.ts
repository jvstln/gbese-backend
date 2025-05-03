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
      message: "User account fetched successfully",
      data: userWallet,
      number: generateAccountNumber(),
    });
  }

  async disableUserAccount(req: Request, res: Response) {
    await accountService.disableAccount(
      req.userSession!.user.account._id.toString()
    );

    res.json({
      success: true,
      message: "User account disabled successfully",
    });
  }

  async enableUserAccount(req: Request, res: Response) {
    await accountService.enableAccount(
      req.userSession!.user.account._id.toString()
    );

    res.json({
      success: true,
      message: "User account enabled successfully",
    });
  }
}

export const accountController = new AccountController();

import { Request, Response } from "express";
import { accountModel } from "../model/account.model";
import { generateAccountNumber } from "../utils/finance";

class AccountController {
  async getUserAccount(req: Request, res: Response) {
    const userWallet = await accountModel.findOne({
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

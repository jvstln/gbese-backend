import { Request, Response } from "express";
import { generateAccountNumber } from "../utils/finance";
import { accountService } from "../services/account.service";
import mongoose from "mongoose";
import { isAccountNumberValid } from "../utils/finance";
import { APIError } from "better-auth/api";

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

  async getAccountByNumberOrId(req: Request, res: Response) {
    if (
      !mongoose.Types.ObjectId.isValid(req.params.accountId) &&
      !isAccountNumberValid(req.params.accountId)
    ) {
      throw new APIError("BAD_REQUEST", {
        message: "Invalid account ID or number provided",
      });
    }

    const account = await accountService.getMinimalUserAccount(
      req.params.accountId
    );

    if (!account) {
      throw new APIError("NOT_FOUND", {
        message: "Account not found",
      });
    }

    res.json({
      success: true,
      message: "Account fetched successfully",
      data: account,
    });
  }
}

export const accountController = new AccountController();

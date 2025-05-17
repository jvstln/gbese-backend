import { Request, Response } from "express";
import { generateAccountNumber } from "../utils/finance";
import { accountService } from "../services/account.service";
import mongoose from "mongoose";
import { isAccountNumberValid } from "../utils/finance";
import { APIError } from "better-auth/api";

class AccountController {
  async getUserAccount(req: Request, res: Response) {
    res.json({
      success: true,
      message: "User account fetched successfully",
      data: req.userSession!.account,
      number: generateAccountNumber(),
    });
  }

  async disableUserAccount(req: Request, res: Response) {
    const account = await accountService.disableAccount(
      req.userSession!.account
    );

    res.json({
      success: true,
      message: "User account disabled successfully",
      data: account,
    });
  }

  async enableUserAccount(req: Request, res: Response) {
    const account = await accountService.enableAccount(
      req.userSession!.account
    );

    res.json({
      success: true,
      message: "User account enabled successfully",
      data: account,
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

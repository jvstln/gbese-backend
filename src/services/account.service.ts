import mongoose from "mongoose";
import { accountModel } from "../model/account.model";
import { AccountDocument } from "../types/account.type";
import { APIError } from "better-auth/api";

class AccountServices {
  async getAccount(filters: Record<string, unknown> = {}) {
    return accountModel.findOne(filters).populate("user");
  }

  // Create account for a new user
  async createAccount(userId: string) {
    const userWallet = accountModel.create({ userId });

    return userWallet;
  }

  async exists(filters: Record<string, unknown>) {
    return accountModel.exists(filters);
  }

  async disableAccount(account: AccountDocument) {
    account.isActive = false;
    return account.save();
  }

  async enableAccount(account: AccountDocument) {
    account.isActive = true;
    return account.save();
  }

  getAccountByIdOrNumber(identifier: string) {
    const accountIdQuery: { [key: string]: string }[] = [
      { accountNumber: identifier },
    ];

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      accountIdQuery.push({ _id: identifier });
    }

    const account = accountModel
      .findOne({ $or: accountIdQuery })
      .populate("user");

    if (!account) {
      throw new APIError("NOT_FOUND", {
        message: "Account not found",
      });
    }

    return account;
  }

  async getMinimalUserAccount(identifier: string) {
    return this.getAccountByIdOrNumber(identifier)
      .select("accountNumber isActive createdAt userId")
      .populate("user", "email name image emailVerified points");
  }
}

export const accountService = new AccountServices();

import mongoose from "mongoose";
import { accountModel } from "../model/account.model";
import { AccountDocument } from "../types/account.type";

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

  async getMinimalUserAccount(accountId: string) {
    const accountIdQuery: { [key: string]: string }[] = [
      { accountNumber: accountId },
    ];

    if (mongoose.Types.ObjectId.isValid(accountId)) {
      accountIdQuery.push({ _id: accountId });
    }

    return accountModel
      .findOne(
        { $or: accountIdQuery },
        "accountNumber isActive createdAt userId"
      )
      .populate("user");
  }
}

export const accountService = new AccountServices();

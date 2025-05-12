import mongoose from "mongoose";
import { accountModel } from "../model/account.model";
import axios from "axios";

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

  async disableAccount(accountId: string) {
    return accountModel
      .updateOne({ _id: accountId }, { isActive: false })
      .populate("user");
  }

  async enableAccount(accountId: string) {
    return accountModel
      .updateOne({ _id: accountId }, { isActive: true })
      .populate("user");
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
      .populate({ path: "user", select: { name: 1, email: 1 } });
  }
}

export const accountService = new AccountServices();

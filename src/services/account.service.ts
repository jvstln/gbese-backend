import { accountModel } from "../model/account.model";

class AccountServices {
  async getAccount(filters: Record<string, unknown> = {}) {
    return await accountModel.findOne(filters);
  }

  // Create account for a new user
  async createAccount(userId: string) {
    const userWallet = await accountModel.create({ userId });

    return userWallet;
  }

  async exists(filters: Record<string, unknown>) {
    return await accountModel.exists(filters);
  }
}

export const accountService = new AccountServices();

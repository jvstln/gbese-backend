import { accountModel } from "../model/account.model";

class AccountServices {
  async getAccount(filters: Record<string, unknown> = {}) {
    return accountModel.findOne(filters);
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
    return accountModel.updateOne({ _id: accountId }, { isActive: false });
  }

  async enableAccount(accountId: string) {
    return accountModel.updateOne({ _id: accountId }, { isActive: true });
  }
}

export const accountService = new AccountServices();

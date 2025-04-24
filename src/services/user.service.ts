import { userModel } from "../model/user.model";

class UserService {
  async getUser(filters: Record<string, unknown> = {}) {
    return userModel.findOne(filters).exec();
  }

  async getUsers(filters: Record<string, unknown> = {}) {
    return userModel.find(filters).exec();
  }
}

export const userService = new UserService();

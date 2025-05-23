import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { debtRequestService } from "../services/debtRequest.service";
import { loanService } from "../services/loan.service";

class UserController {
  async getUser(req: Request, res: Response) {
    const debtRequestStats = await debtRequestService.getDebtStatistics(
      req.userSession!.user._id
    );
    const loanStats = await loanService.getLoanStatistics(
      req.userSession!.account._id
    );

    res.json({
      success: true,
      message: "User details fetched successfully",
      data: req.userSession!.user,
      metadata: {
        ...debtRequestStats,
        ...loanStats,
      },
    });
  }

  async updateUser(req: Request, res: Response) {
    const user = await userService.updateUser(req.userSession!.user, req.body);

    res.json({
      success: true,
      message: "User details updated successfully",
      data: user,
    });
  }

  async searchUser(req: Request, res: Response) {
    const users = await userService.searchUser(req.query.search as string);

    res.json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  }

  async getAllUsers(req: Request, res: Response) {
    const users = await userService.getUsers();

    res.json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  }
}

export const userController = new UserController();

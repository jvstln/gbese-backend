import { Request, Response } from "express";
import { userService } from "../services/user.service";

class UserController {
  async getUser(req: Request, res: Response) {
    res.json({
      success: true,
      message: "User details fetched successfully",
      data: req.userSession!.user,
    });
  }

  async updateUser(req: Request, res: Response) {
    const user = await userService.updateUser(
      req.userSession!.user._id,
      req.body
    );

    res.json({
      success: true,
      message: "User details updated successfully",
      data: user,
    });
  }
}

export const userController = new UserController();

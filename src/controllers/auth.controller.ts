import "dotenv/config";
import { Request, Response } from "express";
import { APIError } from "better-auth/api";
import { VerifyEmail } from "../types/auth.type";
import { authService } from "../services/auth.service";
import { handleRawResponse } from "../utils/utils";
import { StatusCodes } from "../types/api.type";
import { accountService } from "../services/account.service";
import { userModel } from "../model/user.model";

class AuthController {
  async register(req: Request, res: Response) {
    const signUpResponse = await authService.signUp(req.body);
    const responseBody = await handleRawResponse(res, signUpResponse);

    res.status(signUpResponse.status).json({
      message:
        "Account created successfully. Check your email for verification link",
      data: responseBody.user,
    });
  }

  async login(req: Request, res: Response) {
    const loginResponse = await authService.login(req.body);

    const responseBody = await handleRawResponse(res, loginResponse);

    res.status(loginResponse.status).json({
      message: "User logged in successfully",
      data: responseBody.user,
    });
  }

  async verifyEmail(req: Request<{}, {}, {}, VerifyEmail>, res: Response) {
    try {
      const user = await userModel.findById(req.query.userId);
      if (!user) throw new APIError("NOT_FOUND", { message: "User not found" });

      const verificationResponse = await authService.verifyEmail(req.query);

      if (!verificationResponse?.status) {
        throw new APIError(StatusCodes.BAD_REQUEST, {
          message: "Error verifying email",
        });
      }

      // Create account for the user on registration if non exists
      if (!(await accountService.exists({ userId: user.id }))) {
        await accountService.createAccount(user.id);
      }

      res.render("successful-email-verification");
    } catch (error) {
      console.log("Error verifying email", error);
      res.render("failed-email-verification", {
        message:
          error instanceof APIError
            ? error.body?.message ?? error.message
            : error instanceof Error
            ? error.message
            : "An error occurred while verifying email",
      });
    }
  }

  async logout(req: Request, res: Response) {
    const logoutResponse = await authService.logout(req);
    const responseBody = await handleRawResponse(res, logoutResponse);

    res.json({
      success: true,
      message: "User logged out successfully",
      ...responseBody,
    });
  }
}

export const authController = new AuthController();

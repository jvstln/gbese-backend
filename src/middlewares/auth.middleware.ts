import { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service";
import { APIError } from "better-auth/api";
import { userService } from "../services/user.service";
import { accountModel } from "../model/account.model";
import { accountService } from "../services/account.service";

class AuthMiddleware {
  async handleSession(req: Request, res: Response, next: NextFunction) {
    const sessionData = await authService.getSession(req);

    if (!sessionData) {
      throw new APIError("UNAUTHORIZED", { message: "User not logged in" });
    }

    const user = await userService.getUser({ _id: sessionData.user.id });

    if (!user) {
      throw new APIError("UNAUTHORIZED", { message: "User not found" });
    }

    const account = await accountService.getAccount({ userId: user._id });

    if (!account) {
      throw new APIError("BAD_REQUEST", {
        message: "Account not found. User needs to have an account to prceed",
      });
    }

    req.userSession = { session: sessionData.session, user, account };
    next();
  }

  async handleUserVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.userSession || !req.userSession.user.emailVerified) {
      throw new APIError("FORBIDDEN", { message: "User email not verified" });
    }

    next();
  }
}

export const authMiddleware = new AuthMiddleware();

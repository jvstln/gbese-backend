import { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service";
import { APIError } from "better-auth/api";
import { userService } from "../services/user.service";

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

    req.userSession = { session: sessionData.session, user };
    next();
  }
}

export const authMiddleware = new AuthMiddleware();

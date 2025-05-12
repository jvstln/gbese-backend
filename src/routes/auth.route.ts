import express from "express";
import { authController } from "../controllers/auth.controller";
import {
  googleLoginSchema,
  loginSchema,
  signupSchema,
} from "../schemas/auth.schema";
import { validationMiddleware } from "../middlewares/validation.middleware";

export const authRouter = express.Router();

authRouter.post(
  "/register",
  validationMiddleware.validate({ path: "body", schema: signupSchema }),
  authController.register
);

authRouter.post(
  "/login",
  validationMiddleware.validate({ path: "body", schema: loginSchema }),
  authController.login
);
authRouter.get("/verify-email", authController.verifyEmail);
authRouter.get("/logout", authController.logout);

authRouter.get("/google/callback", authController.googleCallback);
authRouter.get(
  "/google",
  validationMiddleware.validate({
    path: "query",
    schema: googleLoginSchema,
  }),
  authController.googleLogin
);

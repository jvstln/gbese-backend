import express from "express";
import { authController } from "../controllers/auth.controller";
import { loginSchema, signupSchema } from "../schemas/auth.schema";
import { validationMiddleware } from "../middlewares/validation.middleware";

export const authRouter = express.Router();

authRouter.post(
  "/register",
  validationMiddleware.validateBody(signupSchema),
  authController.register
);

authRouter.post(
  "/login",
  validationMiddleware.validateBody(loginSchema),
  authController.login
);
authRouter.get("/verify-email", authController.verifyEmail);

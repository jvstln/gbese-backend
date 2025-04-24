import express from "express";
import { authController } from "../controllers/auth.controller";
import { validateSchema } from "../middlewares/validation.middleware";
import { loginSchema, signupSchema } from "../schemas/auth.schema";

export const authRouter = express.Router();

authRouter.post(
  "/register",
  validateSchema(signupSchema),
  authController.register
);

authRouter.post("/login", validateSchema(loginSchema), authController.login);
authRouter.post("/verify-email", authController.verifyEmail);

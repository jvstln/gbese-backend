import express from "express";
import { userController } from "../controllers/user.controller";
import { fileMiddleware } from "../middlewares/file.middleware";
import { userUpdateSchema } from "../schemas/user.schema";
import { validationMiddleware } from "../middlewares/validation.middleware";

export const userRouter = express.Router();

userRouter.get("/me", userController.getUser);

// Update user
userRouter.patch(
  "/me",
  fileMiddleware.single("identityDocument"),
  validationMiddleware.validate({ path: "body", schema: userUpdateSchema }),
  userController.updateUser
);

import express from "express";
import { userController } from "../controllers/user.controller";
import { fileMiddleware } from "../middlewares/file.middleware";
import { userUpdateSchema } from "../schemas/user.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { getDocument } from "../utils/cloudinary";

export const userRouter = express.Router();

userRouter.use(authMiddleware.handleSession);

userRouter.get("/me", userController.getUser);

// Update user
userRouter.patch(
  "/me",
  fileMiddleware.single("identityDocument"),
  validationMiddleware.validateBody(userUpdateSchema),
  userController.updateUser
);

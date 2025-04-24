import express from "express";
import { userController } from "../controllers/user.controller";
import { multerUploader } from "../utils/multer";
import { fileMiddleware } from "../middlewares/file.middleware";
import { validateSchema } from "../middlewares/validation.middleware";
import { userSchema } from "../schemas/user.schema";
import { authMiddleware } from "../middlewares/auth.middleware";

export const userRouter = express.Router();

userRouter.use(authMiddleware.handleSession);

userRouter.patch(
  "/me",
  multerUploader.single("identityDocumentUrl"),
  fileMiddleware.fileToBody("identityDocumentUrl"),
  validateSchema(userSchema),
  userController.updateUser
);

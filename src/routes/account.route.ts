import express from "express";
import { accountController } from "../controllers/account.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { peerTransferSchema } from "../schemas/account.schema";

export const accountRouter = express.Router();

accountRouter.get("/me", accountController.getUserAccount);

accountRouter.post(
  "/transfer",
  validationMiddleware.validate({ path: "body", schema: peerTransferSchema }),
  accountController.peerTransfer
);

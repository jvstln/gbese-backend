import express from "express";
import { accountController } from "../controllers/account.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import {
  fundAccountSchema,
  peerTransferSchema,
} from "../schemas/transfer.schema";
import { transferController } from "../controllers/transfer.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const accountRouter = express.Router();

accountRouter.get("/me", accountController.getUserAccount);

accountRouter.post(
  "/transfer",
  validationMiddleware.validate({ path: "body", schema: peerTransferSchema }),
  authMiddleware.handleUserVerification,
  transferController.peerTransfer
);

accountRouter.patch("/disable", accountController.disableUserAccount);
accountRouter.patch("/enable", accountController.enableUserAccount);

accountRouter.get(
  "/fund",
  validationMiddleware.validate({ path: "query", schema: fundAccountSchema }),
  transferController.initiateFundUserAccount
);

accountRouter.get("/:accountId", accountController.getAccountByNumberOrId);

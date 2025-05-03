import express from "express";
import { accountController } from "../controllers/account.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { peerTransferSchema } from "../schemas/account.schema";
import { transferController } from "../controllers/transfer.controller";

export const accountRouter = express.Router();

accountRouter.get("/me", accountController.getUserAccount);

accountRouter.post(
  "/transfer",
  validationMiddleware.validate({ path: "body", schema: peerTransferSchema }),
  transferController.peerTransfer
);

accountRouter.patch("/disable", accountController.disableUserAccount);
accountRouter.patch("/enable", accountController.enableUserAccount);

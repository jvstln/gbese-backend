import express from "express";
import { accountController } from "../controllers/account.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import {
  fundAccountSchema,
  peerTransferSchema,
  withdrawSchema,
} from "../schemas/transfer.schema";
import { transferController } from "../controllers/transfer.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { paystackController } from "../controllers/paystack.controller";
import { loanRouter } from "./loan.route";

export const accountRouter = express.Router();

accountRouter.use("/loans", loanRouter);

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

accountRouter.post(
  "/withdraw",
  validationMiddleware.validate({ path: "body", schema: withdrawSchema }),
  authMiddleware.handleUserVerification,
  transferController.initiateWithdrawal
);

accountRouter.get("/banks", paystackController.getBanks);

accountRouter.get("/:accountId", accountController.getAccountByNumberOrId);

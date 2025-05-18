import express from "express";
import { web3Controller } from "../controllers/web3.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { verifyKycSchema, withdrawSchema } from "../schemas/web3.schema";
import { authMiddleware } from "../middlewares/auth.middleware";

export const web3Router = express.Router();

web3Router.post(
  "/verify-kyc",
  validationMiddleware.validate({ path: "body", schema: verifyKycSchema }),
  web3Controller.verifyKYC.bind(web3Controller)
);

web3Router.post(
  "/withdraw",
  validationMiddleware.validate({ path: "body", schema: withdrawSchema }),
  authMiddleware.handleUserVerification,
  web3Controller.withdrawToWallet.bind(web3Controller)
);

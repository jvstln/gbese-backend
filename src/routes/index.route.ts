import { Router } from "express";
import { authRouter } from "./auth.route";
import { userRouter } from "./user.route";
import { debtRequestRouter } from "./debtRequest.route";
import { authMiddleware } from "../middlewares/auth.middleware";
import { accountRouter } from "./account.route";
import transactionRouter from "./transaction.route";
import paystackRouter from "./paystack.route";
import { web3Router } from "./web3.route";
import { loanRouter } from "./loan.route";

export const indexRouter = Router();

indexRouter.get("", (_req, res) => {
  res.send("Welcome to Gbese platform - Your debt helper");
});

// For all authenticated routes
indexRouter.use(
  ["/users", "/debt-requests", "/accounts", "/transactions", "/web3"],
  authMiddleware.handleSession
);

indexRouter.use("/auth", authRouter);

indexRouter.use("/users", userRouter);

indexRouter.use("/debt-requests", debtRequestRouter);

indexRouter.use("/accounts/loans", loanRouter);

indexRouter.use("/accounts", accountRouter);

indexRouter.use("/transactions", transactionRouter);

indexRouter.use("/paystack", paystackRouter);

indexRouter.use("/web3", web3Router);

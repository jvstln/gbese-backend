import express from "express";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { borrowLoanSchema, loanFiltersSchema } from "../schemas/loan.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { loanController } from "../controllers/loan.controller";

export const loanRouter = express.Router();

loanRouter.post(
  "/borrow",
  validationMiddleware.validate({ path: "body", schema: borrowLoanSchema }),
  authMiddleware.handleUserVerification,
  loanController.borrowLoan
);

loanRouter.get(
  "/",
  validationMiddleware.validate({ path: "query", schema: loanFiltersSchema }),
  loanController.getUserLoans
);

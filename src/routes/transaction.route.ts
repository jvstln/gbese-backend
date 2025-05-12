import express from "express";
import { transactionController } from "../controllers/transaction.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import {
  transactionFiltersSchema,
  transactionReferenceSchema,
} from "../schemas/transaction.schema";

const transactionRouter = express.Router();

transactionRouter.get(
  "/",
  validationMiddleware.validate({
    path: "query",
    schema: transactionFiltersSchema,
  }),
  transactionController.getUserTransactions
);

transactionRouter.get(
  "/:reference",
  validationMiddleware.validate({
    path: "params",
    schema: transactionReferenceSchema,
  }),
  transactionController.getTransactionByReference
);

export default transactionRouter;

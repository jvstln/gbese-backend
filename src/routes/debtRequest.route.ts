import { Router } from "express";
import { debtRequestController } from "../controllers/debtRequest.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { DebtRequest } from "../model/debtRequest.model";
import {
  debtRequestCreationSchema,
  debtRequestUpdateSchema,
} from "../schemas/debtRequest.schema";
import { authMiddleware } from "../middlewares/auth.middleware";

export const debtRequestRouter = Router();

debtRequestRouter.post(
  "/",
  validationMiddleware.validate([
    { path: "body", schema: debtRequestCreationSchema },
  ]),
  authMiddleware.handleUserVerification,
  debtRequestController.createDebtRequest
);

debtRequestRouter.get("/all", debtRequestController.getAllDebtRequests);
debtRequestRouter.get("/", debtRequestController.getUserDebtRequests);

debtRequestRouter.patch(
  "/:debtRequestId",
  validationMiddleware.validate([
    { path: "params.debtRequestId", model: DebtRequest },
    { path: "body", schema: debtRequestUpdateSchema },
  ]),
  authMiddleware.handleUserVerification,
  debtRequestController.updateDebtRequest
);

debtRequestRouter.get(
  "/accept/:debtRequestId",
  authMiddleware.handleUserVerification,
  debtRequestController.payDebtRequest
);

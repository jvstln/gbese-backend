import { Router } from "express";
import { debtRequestController } from "../controllers/debtRequest.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { DebtRequest } from "../model/debtRequest.model";
import {
  debtRequestCreationSchema,
  debtRequestUpdateSchema,
} from "../schemas/debtRequest.schema";

export const debtRequestRouter = Router();

debtRequestRouter.post(
  "/",
  validationMiddleware.validate([
    { path: "body", schema: debtRequestCreationSchema },
  ]),
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
  debtRequestController.updateDebtRequest
);

debtRequestRouter.get(
  "/pay/:debtRequestId",
  debtRequestController.payDebtRequest
);

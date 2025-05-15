import { Router } from "express";
import { debtRequestController } from "../controllers/debtRequest.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { debtRequestModel } from "../model/debtRequest.model";
import {
  debtRequestCreationSchema,
  debtRequestFiltersSchema,
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

debtRequestRouter.get(
  "/",
  validationMiddleware.validate({
    path: "query",
    schema: debtRequestFiltersSchema,
  }),
  debtRequestController.getUserDebtRequests
);
debtRequestRouter.get("/all", debtRequestController.getAllDebtRequests);

debtRequestRouter.patch(
  "/:debtRequestId",
  validationMiddleware.validate([
    { path: "params.debtRequestId", model: debtRequestModel },
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

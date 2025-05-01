import { Router } from "express";
import {
  createDebtRequest,
  getAllDebtRequests,
  getUserDebtRequests,
  updateDebtRequest,
} from "../controllers/debtRequest.controller";
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
  createDebtRequest
);

debtRequestRouter.get("/all", getAllDebtRequests);
debtRequestRouter.get("/", getUserDebtRequests);

debtRequestRouter.patch(
  "/:debtRequestId",
  validationMiddleware.validate([
    { path: "params.debtRequestId", model: DebtRequest },
    { path: "body", schema: debtRequestUpdateSchema },
  ]),
  updateDebtRequest
);

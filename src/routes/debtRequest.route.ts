import { Router } from "express";
import {
  createDebtRequest,
  getAllDebtRequests,
  getUserDebtRequests,
  updateDebtRequest,
} from "../controllers/debtRequest.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import {
  debtRequestCreationSchema,
  debtRequestUpdateSchema,
} from "../schemas/debtRequest.schema";
import { userModel } from "../model/user.model";

export const debtRequestRouter = Router();

debtRequestRouter.post(
  "/",
  validationMiddleware.validateBody(debtRequestUpdateSchema),
  validationMiddleware.validateObjectId(
    ["body.creditorId", "body.payerId"],
    userModel
  ),
  createDebtRequest
);

debtRequestRouter.get("/all", getAllDebtRequests);
debtRequestRouter.get("/", getUserDebtRequests);

debtRequestRouter.patch(
  "/:id",

  validationMiddleware.validateBody(debtRequestUpdateSchema),
  validationMiddleware.validateObjectId(
    ["body.creditorId", "body.payerId"],
    userModel,
    false
  ),
  updateDebtRequest
);

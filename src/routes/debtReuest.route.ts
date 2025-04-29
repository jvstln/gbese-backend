import { Router } from "express";
import {
  createDebtRequest,
  getAllDebtRequests,
  getUserDebtRequests,
  updateDebtRequest,
} from "../controllers/debtRequest.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { debtRequestSchema } from "../schemas/debtRequest.schema";

export const debtRequestRouter = Router();

debtRequestRouter.post(
  "/",
  validationMiddleware.validateBody(debtRequestSchema),
  createDebtRequest
);
debtRequestRouter.get("/all", getAllDebtRequests);
debtRequestRouter.get("/", getUserDebtRequests);
debtRequestRouter.patch("/:id", updateDebtRequest);

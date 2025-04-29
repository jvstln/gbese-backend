import { Router } from "express";
import {
  createDebtRequest,
  getUserCreatedDebtRequests,
  getAllDebtRequests,
  updateDebtRequest,
} from "../controllers/debtRequest.controller";

export const debtRequestRouter = Router();

debtRequestRouter.post("/", createDebtRequest);
debtRequestRouter.get("/all", getAllDebtRequests);
debtRequestRouter.get("/", getUserCreatedDebtRequests);
debtRequestRouter.patch("/:id", updateDebtRequest);

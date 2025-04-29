import { Router } from "express";
import {
  createDebtRequest,
  getUserDebtRequests,
  getAllDebtRequests,
  updateDebtRequest,
} from "../controllers/debtTransfer.controller";

const router = Router();

router.post("/", createDebtRequest);
router.get("/user/:userId", getUserDebtRequests);
router.get("/", getAllDebtRequests);
router.patch("/:id", updateDebtRequest);

export const debtTransferRouter = router;
import express from "express";
import { paystackController } from "../controllers/paystack.controller";

const paystackRouter = express.Router();

paystackRouter.post("/webhook", (req, res) =>
  paystackController.webhook(req, res)
);

export default paystackRouter;

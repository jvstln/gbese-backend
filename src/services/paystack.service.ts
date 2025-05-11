import "dotenv/config";
import axios from "axios";
import crypto from "crypto";
import { IntializePayment } from "../types/paystack.type";
import { Request } from "express";

class PaystackService {
  api = axios.create({
    baseURL: "https://api.paystack.co",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  });

  validIPAddresses = ["52.31.139.75", "52.49.173.169", "52.214.14.220"];

  async initializePayment(payload: IntializePayment) {
    const response = await this.api.post("/transaction/initialize", {
      ...payload,
      amount: Number(payload.amount) * 100, // Amount in kobo
    });
    return response.data.data;
  }

  verifyPaystackSignature(req: Request) {
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(JSON.stringify(req.body))
      .digest("hex");

    return hash === req.headers["x-paystack-signature"];
  }
}

export const paystackService = new PaystackService();

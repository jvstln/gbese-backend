import "dotenv/config";
import axios from "axios";
import crypto from "crypto";
import {
  CreateTransferRecipient,
  IntializePayment,
  IntiateTransfer,
  PaystackTransferRecipient,
} from "../types/paystack.type";
import { Request } from "express";
import { getAxiosError } from "../utils/utils";
import { APIError } from "better-auth/api";

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

  async initiateTransfer(payload: IntiateTransfer) {
    const response = await this.api.post("/transfer", {
      ...payload,
      source: "balance",
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

  /**
   * Creates a transfer recipient. If it exists, return the existing one
   * @param payload
   * @returns Promise<PaystackTransferRecipient>
   */
  async createTransferRecipient(
    payload: CreateTransferRecipient
  ): Promise<PaystackTransferRecipient> {
    const response = await this.api.post("/transferrecipient", {
      type: "nuban",
      currency: "NGN",
      account_number: payload.accountNumber,
      bank_code: payload.bankCode,
      name: payload.accountName,
    });
    return response.data.data;
  }

  async fetchTransferRecipient(
    recipientCode: string
  ): Promise<PaystackTransferRecipient> {
    const response = await this.api.get(`/transferrecipient/${recipientCode}`);
    return response.data.data;
  }

  async getBanks() {
    const response = await this.api.get("/bank");
    return response.data;
  }

  async resolveAccountNumber(accountNumber: string, bankCode: string) {
    try {
      const response = await this.api.get(
        `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`
      );
      return response.data.data;
    } catch (error) {
      throw new APIError("UNPROCESSABLE_ENTITY", {
        message: "Invalid account number or bank code",
        error: getAxiosError(error),
      });
    }
  }
}

export const paystackService = new PaystackService();

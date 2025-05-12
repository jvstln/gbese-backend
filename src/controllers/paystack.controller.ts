import { APIError } from "better-auth/api";
import { Request, Response } from "express";
import { TransactionStatuses } from "../types/transaction.type";
import { transactionService } from "../services/transaction.service";
import { paystackService } from "../services/paystack.service";
import { accountService } from "../services/account.service";
import mongoose from "mongoose";
import Decimal from "decimal.js";

class PaystackController {
  webhookMap = {
    fund: this.fund,
  };

  async webhook(req: Request, res: Response) {
    // Check if request is coming from paystack
    if (!paystackService.verifyPaystackSignature(req)) {
      throw new APIError("UNAUTHORIZED", {
        message: "Request not from paystack",
      });
    }

    const { data } = req.body;
    const action: keyof typeof this.webhookMap = data.metadata.action;
    const webhookHandler = this.webhookMap[action];

    if (!webhookHandler) {
      throw new APIError("BAD_REQUEST", { message: "Invalid webhook action" });
    }

    console.log("Paystack event: ", req.body.event);
    await webhookHandler(req, res);
  }

  async fund(req: Request, res: Response) {
    const { event, data } = req.body;

    const transaction = await transactionService.getUserTransactionByReference(
      data.metadata.accountId,
      data.reference
    );

    if (!transaction) {
      throw new APIError("BAD_REQUEST", {
        message: "Transaction not found",
      });
    }

    if (transaction.status !== TransactionStatuses.PENDING) {
      throw new APIError("BAD_REQUEST", {
        message: "Transaction is not pending",
      });
    }

    if (event === "charge.success") {
      await mongoose.connection.transaction(async () => {
        const account = await accountService.getAccount({
          _id: transaction.accountId,
        });
        if (!account) {
          throw new APIError("BAD_REQUEST", {
            message: "Account not found",
          });
        }

        account.balance = new Decimal(account.balance.toString())
          .add(new Decimal(data.amount).div(100)) // Convert kobo to naira by dividing by 100
          .toString();

        await account.save();

        transaction.status = TransactionStatuses.SUCCESS;
        await transaction.save();
      });
    }

    res.status(200).json({ message: "OK" });
  }

  async getBanks(req: Request, res: Response) {
    const banks = await paystackService.getBanks();
    res.json({
      success: true,
      message: "Banks fetched successfully",
      data: banks,
    });
  }

  // async resolveAccountNumber(req: Request, res: Response) {
  //   const { accountNumber, bankCode } = req.query;
  //   if (!accountNumber || !bankCode) {
  //     throw new APIError("BAD_REQUEST", {
  //       message: "Account number and bank code are required",
  //     });
  //   }
  //   const response = await paystackService.resolveAccountNumber(
  //     accountNumber as string,
  //     bankCode as string
  //   );
  //   return response;
  // }
}

export const paystackController = new PaystackController();

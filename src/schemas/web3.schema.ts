import Joi from "joi";
import { amountSchema } from "./transfer.schema";

export const verifyKycSchema = Joi.object({
  wallet: Joi.string().required(),
});

export const withdrawSchema = Joi.object({
  walletAddress: Joi.string().required(),
  amountNGN: amountSchema.required(),
  description: Joi.string().optional(),
});

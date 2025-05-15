import Joi from "joi";
import { amountSchema } from "./transfer.schema";

export const borrowLoanSchema = Joi.object({
  amount: amountSchema,
  durationInDays: Joi.number().min(1).required(),
});

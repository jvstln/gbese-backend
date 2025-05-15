import Joi from "joi";
import { amountSchema } from "./transfer.schema";
import { LoanStatuses } from "../types/loan.type";

export const borrowLoanSchema = Joi.object({
  amount: amountSchema,
  durationInDays: Joi.number().min(1).required(),
});

export const loanFiltersSchema = Joi.object({
  status: Joi.string().valid(...Object.values(LoanStatuses)),
});

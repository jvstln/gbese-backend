import Joi from "joi";
import { amountSchema } from "./transfer.schema";
import { LoanStatuses } from "../types/loan.type";

export const borrowLoanSchema = Joi.object({
  amount: amountSchema,
  durationInDays: Joi.number().min(1).required(),
  description: Joi.string().max(50),
});

export const payLoanBodySchema = Joi.object({
  amount: amountSchema,
});

export const payLoanParamSchema = Joi.object({
  loanId: Joi.string().required(),
});

export const loanFiltersSchema = Joi.object({
  status: Joi.alternatives().conditional(Joi.string(), {
    then: Joi.string().valid(...Object.values(LoanStatuses)),
    otherwise: Joi.array().items(
      Joi.string().valid(...Object.values(LoanStatuses))
    ),
  }),
});

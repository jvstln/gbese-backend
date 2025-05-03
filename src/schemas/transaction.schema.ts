import Joi from "joi";
import {
  TransactionCategories,
  TransactionStatuses,
  TransactionTypes,
} from "../types/transaction.type";

export const transactionFiltersSchema = Joi.object({
  type: Joi.string().valid(...Object.values(TransactionTypes)),
  status: Joi.string().valid(...Object.values(TransactionStatuses)),
  category: Joi.string().valid(...Object.values(TransactionCategories)),
  dateFrom: Joi.date(),
  dateTo: Joi.date(),
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
});

export const transactionReferenceSchema = Joi.object({
  reference: Joi.string().required(),
});

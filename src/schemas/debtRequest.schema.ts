import Joi from "joi";
import {
  DebtRequestStatuses,
  DebtRequestUserRoles,
} from "../types/debtRequest.type";
import { amountSchema } from "./transfer.schema";

const debtRequestPayload = {
  payerId: Joi.string(),
  amount: amountSchema,
  description: Joi.string(),
};

export const debtRequestCreationSchema = Joi.object(debtRequestPayload);
export const debtRequestUpdateSchema = debtRequestCreationSchema.fork(
  Object.keys(debtRequestPayload),
  (schema) => schema.optional()
);

export const debtRequestFiltersSchema = Joi.object({
  role: Joi.string().valid(...Object.values(DebtRequestUserRoles), ""),
  status: Joi.string().valid(...Object.values(DebtRequestStatuses), ""),
});

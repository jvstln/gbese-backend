import Joi from "joi";
import {
  DebtRequestStatuses,
  DebtRequestUserRoles,
} from "../types/debtRequest.type";

const debtRequestPayload = {
  creditorId: Joi.string().required(),
  payerId: Joi.string().required(),
  amount: Joi.number().required(),
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

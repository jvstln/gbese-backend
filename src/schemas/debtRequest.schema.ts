import Joi from "joi";

export const debtRequestSchema = Joi.object({
  debtorId: Joi.string().required(),
  creditorId: Joi.string().required(),
  payerId: Joi.string().required(),
  amount: Joi.number().required(),
  description: Joi.string(),
}).options({ stripUnknown: true });

import Joi from "joi";

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

import Joi from "joi";
import Decimal from "decimal.js";

const amountSchema = Joi.alternatives().conditional(Joi.string(), {
  then: Joi.string()
    .custom((value, helpers) => {
      if (isNaN(Number(value))) {
        return helpers.error("number.base");
      }

      const amount = new Decimal(value);
      if (amount.lt(0)) {
        return helpers.error("number.min");
      }

      return value;
    })
    .messages({
      "number.min": "Amount must be greater than 0",
      "number.base": "Amount must be a number",
    }),
  otherwise: Joi.number().min(0),
});

export const peerTransferSchema = Joi.object({
  toAccountId: Joi.string().required(),
  amount: amountSchema.required(),
});

export const fundAccountSchema = Joi.object({
  amount: amountSchema.required(),
  callbackUrl: Joi.string().required(),
});

export const withdrawSchema = Joi.object({
  amount: amountSchema.required(),
  accountNumber: Joi.string().required(),
  bankCode: Joi.string().required(),
});

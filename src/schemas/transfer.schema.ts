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
  amount: amountSchema,
});

export const fundAccountSchema = Joi.object({
  amount: amountSchema,
  callbackUrl: Joi.string().required(),
});

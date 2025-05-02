import Joi from "joi";
import Decimal from "decimal.js";

export const peerTransferSchema = Joi.object({
  toAccountId: Joi.string().required(),
  amount: Joi.string()
    .custom((value, helpers) => {
      const amount = new Decimal(value);
      if (amount.lt(0)) {
        return helpers.error("number.min");
      }
      return value;
    })
    .messages({
      "number.min": "Amount must be greater than 0",
    })
    .required(),
});

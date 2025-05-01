import Joi from "joi";

export const signupSchema = Joi.object({
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  firstName: Joi.string().min(3).max(40).required(),
  lastName: Joi.string().min(3).max(40).required(),
}).options({
  stripUnknown: true,
});

export const loginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
}).options({
  stripUnknown: true,
});


import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { createObjectPath } from "../utils/utils";
import { APIError } from "better-auth/api";

export const validateSchema = <T>(schema: Joi.ObjectSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = schema.validate(req.body ?? {}, {
      abortEarly: false,
    });

    if (error) {
      throw new APIError("FORBIDDEN", {
        message: "Validation Error",
        errors: formatJoiError(error),
      });
    }

    req.body = value;
    next();
  };
};

const formatJoiError = (error: Joi.ValidationError | undefined) => {
  if (!error) return undefined;

  return error.details.reduce((acc, curr) => {
    createObjectPath(acc, curr.path.join("."), curr.message);
    return acc;
  }, {});
};

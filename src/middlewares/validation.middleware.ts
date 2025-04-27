import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { createObjectPath } from "../utils/utils";
import { APIError } from "better-auth/api";

class ValidationMiddleware {
  /**
   * Validates the body of a request using the passed in Joi schema
   * @param schema Joi schema to validate
   * @returns void
   */
  validateBody<T>(schema: Joi.ObjectSchema<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { value, error } = schema.validate(req.body ?? {}, {
        abortEarly: false,
      });

      if (error) {
        throw new APIError("FORBIDDEN", {
          message: "Validation Error",
          errors: this.formatJoiError(error),
        });
      }

      req.body = value;
      next();
    };
  }

  private formatJoiError(error: Joi.ValidationError | undefined) {
    if (!error) return undefined;

    return error.details.reduce((acc, curr) => {
      createObjectPath(acc, curr.path.join("."), curr.message);
      return acc;
    }, {});
  }
}

export const validationMiddleware = new ValidationMiddleware();

import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { createObjectPath } from "../utils/utils";
import { APIError } from "better-auth/api";
import { ParsedQs } from "qs";

class ValidationMiddleware {
  validateBody<T>(schema: Joi.ObjectSchema<T>) {
    return (req: Request, _res: Response, next: NextFunction) => {
      req.body = this.validateJoiSchema(schema, req.body);
      next();
    };
  }

  validateQuery<T extends ParsedQs>(schema: Joi.ObjectSchema<T>) {
    return (req: Request, _res: Response, next: NextFunction) => {
      req.query = this.validateJoiSchema(schema, req.query);
      next();
    };
  }

  validateParams<T extends { [key: string]: string }>(
    schema: Joi.ObjectSchema<T>
  ) {
    return (req: Request, _res: Response, next: NextFunction) => {
      req.params = this.validateJoiSchema(schema, req.params);
      next();
    };
  }

  validateJoiSchema<T>(schema: Joi.ObjectSchema<T>, data: T) {
    const { value, error } = schema.validate(data ?? {}, {
      abortEarly: false,
    });

    if (error) {
      throw new APIError("FORBIDDEN", {
        message: "Validation Error",
        errors: this.formatJoiError(error),
      });
    }

    return value;
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

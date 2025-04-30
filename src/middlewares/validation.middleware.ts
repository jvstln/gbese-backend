import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { createObjectPath, getObjectPath } from "../utils/utils";
import { APIError } from "better-auth/api";
import { ParsedQs } from "qs";
import mongoose, { Model } from "mongoose";

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

  validateObjectId(
    paths: string[] | string,
    model: Model<any>,
    required = true
  ) {
    const pathArray = Array.isArray(paths) ? paths : [paths];

    return async (req: Request, _res: Response, next: NextFunction) => {
      for (const path of pathArray) {
        const idName = path.split(".").pop();
        const idValue = getObjectPath(
          req as unknown as Record<string, unknown>,
          path
        );

        if (!required && idValue === undefined) {
          continue;
        }

        if (!mongoose.Types.ObjectId.isValid(idValue as unknown as string)) {
          throw new APIError("UNPROCESSABLE_ENTITY", {
            message: `Invalid ${idName}`,
          });
        }

        const document = await model.exists({ _id: idValue });
        if (!document) {
          throw new APIError("NOT_FOUND", {
            message: `${idName?.slice(0, -2)} not found`,
          });
        }
      }
      next();
    };
  }

  validateJoiSchema<T>(schema: Joi.ObjectSchema<T>, data: T) {
    const { value, error } = schema.validate(data ?? {}, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new APIError("UNPROCESSABLE_ENTITY", {
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

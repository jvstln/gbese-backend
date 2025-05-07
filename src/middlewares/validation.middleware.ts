import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { setNestedValue, getObjectPath } from "../utils/utils";
import { APIError } from "better-auth/api";
import mongoose, { Model } from "mongoose";

interface ValidationOption {
  path: string;
  schema?: Joi.Schema;
  objectIdName?: string;
  model?: Model<any>;
  required?: boolean;
}

class ValidationMiddleware {
  validate(validationOptions: ValidationOption[] | ValidationOption) {
    validationOptions = Array.isArray(validationOptions)
      ? validationOptions
      : [validationOptions];

    return async (req: Request, _res: Response, next: NextFunction) => {
      const requestObject = req as unknown as Record<string, unknown>;

      for (const option of validationOptions) {
        const value = getObjectPath(requestObject, option.path);
        const isRequired = option.required ?? true;

        if (!isRequired && value === undefined) continue;

        if (option.schema) {
          const validatedValue = await this.validateJoiSchema(
            option.schema,
            value
          );

          if (option.path === "query") {
            const [oldUrl, oldQuery] = (requestObject.url as string).split("?");
            const newQuery = new URLSearchParams(validatedValue);
            requestObject.url = `${oldUrl}?${newQuery.toString()}`;
          } else {
            setNestedValue(requestObject, option.path, validatedValue);
          }
        }

        const objectIdName =
          option.objectIdName ?? option.path.split(".").pop()?.slice(0, -2);

        if (option.objectIdName || option.model) {
          if (!mongoose.Types.ObjectId.isValid(value as unknown as string)) {
            throw new APIError("BAD_REQUEST", {
              message: `Invalid ${objectIdName} ID`,
            });
          }
        }

        if (option.model) {
          const document = await option.model.exists({ _id: value });
          if (!document) {
            throw new APIError(
              option.path.startsWith("params") ? "NOT_FOUND" : "BAD_REQUEST",
              {
                message: `No ${objectIdName} found with ID ${value}`,
              }
            );
          }
        }
      }
      next();
    };
  }

  async validateJoiSchema<T>(schema: Joi.Schema<T>, data: T) {
    try {
      const value = await schema.validateAsync(data, {
        abortEarly: false,
        stripUnknown: true,
      });

      return value;
    } catch (error) {
      throw new APIError("BAD_REQUEST", {
        message: "Validation Error",
        errors: this.formatJoiError(error as Joi.ValidationError),
      });
    }
  }

  private formatJoiError(error: Joi.ValidationError | undefined) {
    if (!error) return undefined;

    return error.details.reduce((acc, curr) => {
      setNestedValue(acc, curr.path.join("."), curr.message);
      return acc;
    }, {});
  }
}

export const validationMiddleware = new ValidationMiddleware();

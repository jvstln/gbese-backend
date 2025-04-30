import { APIError } from "better-auth/api";
import { Request, Response, NextFunction } from "express";
import { Error as ErrorNamespace } from "mongoose";
import { MulterError } from "multer";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log("An error occurred: ", error);

  if (error instanceof ErrorNamespace.ValidationError) {
    let errors: Record<string, string> = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    res.status(400).json({
      success: false,
      message: error.message,
      errors,
    });
    return;
  }

  if (error instanceof APIError) {
    Object.entries(error.headers).forEach(([key, value]) => {
      res.set(key, value);
    });

    res.status(error.statusCode).json({
      success: false,
      ...error.body,
    });
    return;
  }

  if (error instanceof MulterError && error.code === "LIMIT_UNEXPECTED_FILE") {
    res.status(400).json({
      success: false,
      message: `Unknown file field "${error.field}" is not allowed`,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

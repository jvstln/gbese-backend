import { APIError } from "better-auth/api";
import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log("An error occurred: ", error, error?.constructor);

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

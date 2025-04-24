import { NextFunction, Request, Response } from "express";

class FileMiddleware {
  fileToBody(fieldName: string, multiple?: boolean) {
    return (req: Request, res: Response, next: NextFunction) => {
      req.body[fieldName] = req[multiple ? "files" : "file"];
      next();
    };
  }
}

export const fileMiddleware = new FileMiddleware();

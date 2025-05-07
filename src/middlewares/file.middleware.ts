import { Request, Response, NextFunction } from "express";
import multer from "multer";

/**
 * This acts like a wrapper around the multer package
 */
class FileMiddleware {
  multerUploader: ReturnType<typeof multer>;

  constructor() {
    this.multerUploader = multer({ dest: "uploads/" });
  }

  single(...args: Parameters<typeof this.multerUploader.single>) {
    return [
      this.multerUploader.single(args[0]),
      this.parseFormDataBody,
      this.fileToBody(...args),
    ];
  }
  array(...args: Parameters<typeof this.multerUploader.array>) {
    return [
      this.multerUploader.array(...args),
      this.parseFormDataBody,
      this.fileToBody(args[0]),
    ];
  }
  fields(...args: Parameters<typeof this.multerUploader.fields>) {
    return [
      this.multerUploader.fields(...args),
      this.parseFormDataBody,
      this.fileToBody(),
    ];
  }
  any(...args: Parameters<typeof this.multerUploader.any>) {
    return [
      this.multerUploader.any(...args),
      this.parseFormDataBody,
      this.fileToBody(),
    ];
  }
  none(...args: Parameters<typeof this.multerUploader.none>) {
    return [
      this.multerUploader.none(...args),
      this.parseFormDataBody,
      this.fileToBody(),
    ];
  }

  /**
   * Moves all parsed file from multer to request body
   * @param fieldName optional fieldName for the incoming multer file
   * @returns void
   */
  fileToBody(fieldName?: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.file && fieldName) req.body[fieldName] = req.file;

      if (Array.isArray(req.files) && fieldName) {
        req.body[fieldName] = req.files;
      } else if (typeof req.files === "object") {
        req.body = { ...req.body, ...req.files };
      }

      next();
    };
  }

  /**
   * A middleware that convert flattened objects to nested objects in the request body
   * @param req Express Request Object
   * @param res Express Response Object
   * @param next Express Next Function
   * @example from {"address.name": "Africa"} to {"address": {"name": "Africa"}}
   */
  parseFormDataBody(req: Request, res: Response, next: NextFunction) {
    const result = {};

    Object.keys(req.body ?? {}).forEach((key) => {
      const parts = key.split(".");
      let current: { [key: string]: {} } = result;

      for (let i = 0; i < parts.length - 1; i++) {
        current[parts[i]] =
          current[parts[i]] || (Number.isInteger(+parts[i + 1]) ? [] : {});
        current = current[parts[i]];
      }

      current[parts[parts.length - 1]] = req.body[key];
    });

    req.body = result;
    next();
  }
}

export const fileMiddleware = new FileMiddleware();

import Joi from "joi";
import { identityDocumentTypes } from "../types/user.type";

export const userUpdateSchema = Joi.object({
  firstName: Joi.string().min(3).max(40),
  lastName: Joi.string().min(3).max(40),
  phone: Joi.string().length(11),
  address: Joi.object({
    number: Joi.string(),
    street: Joi.string(),
    town: Joi.string(),
    state: Joi.string(),
  }),
  
  // image: Joi.custom((rawFile: Express.Multer.File) => {
  //   const validMimeTypes = /image\/(jpeg|png|jpg|webp)/;
  //   const file = Array.isArray(rawFile) ? rawFile[0] : rawFile;

  //   // 5mb in bytes
  //   if (file.size > 5 * 1024 * 1024) {
  //     throw new Error("Identity document size must be less than 5MB");
  //   }

  //   if (!validMimeTypes.test(file.mimetype)) {
  //     console.log(file);
  //     throw new Error(
  //       "Invalid file type! Supported files include image/jpeg, image/png, image/jpg, image/webp"
  //     );
  //   }

  //   return file;
  // }),
  // identityDocument: Joi.custom((rawFile: Express.Multer.File) => {
  //   const validMimeTypes = /image\/(jpeg|png|jpg|webp)|application\/pdf/;
  //   const file = Array.isArray(rawFile) ? rawFile[0] : rawFile;

  //   // 5mb in bytes
  //   if (file.size > 5 * 1024 * 1024) {
  //     throw new Error("Identity document size must be less than 5MB");
  //   }

  //   if (!validMimeTypes.test(file.mimetype)) {
  //     throw new Error(
  //       "Invalid file type! Supported files include image/jpeg, image/png, image/jpg, image/webp, application/pdf"
  //     );
  //   }

  //   return file;
  // }),
  dateOfBirth: Joi.date()
    .iso()
    .less("now")
    .messages({ "date.less": "dateOfBirth must be in the past" }),
  identityDocumentType: Joi.string().valid(...identityDocumentTypes),
}).with("identityDocument", "identityDocumentType");

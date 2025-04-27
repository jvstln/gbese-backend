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
  dateOfBirth: Joi.date()
    .iso()
    .less("now")
    .messages({ "date.less": "dateOfBirth must be in the past" }),
  identityDocument: Joi.custom((file: Express.Multer.File) => {
    const validMimeTypes = /image\/(jpeg|png|jpg|webp)|application\/pdf/;

    // 5mb in bytes
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Identity document size must be less than 5MB");
    }

    if (!validMimeTypes.test(file.mimetype)) {
      throw new Error(
        "Invalid file type! Supported files include image/jpeg, image/png, image/jpg, image/webp, application/pdf"
      );
    }

    return file;
  }),
  identityDocumentType: Joi.string().valid(...identityDocumentTypes),
})
  .with("identityDocument", "identityDocumentType")
  .options({ stripUnknown: true });

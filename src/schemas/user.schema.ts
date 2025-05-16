import Joi from "joi";
import { IdentityDocumentTypes } from "../types/user.type";

export const userUpdateSchema = Joi.object({
  firstName: Joi.string().min(3).max(40),
  lastName: Joi.string().min(3).max(40),
  phone: Joi.string(),
  address: Joi.object({
    number: Joi.string(),
    street: Joi.string(),
    town: Joi.string(),
    state: Joi.string(),
  }),
  image: Joi.string().uri(),
  identityDocuments: [
    Joi.string().uri(),
    Joi.array().items(Joi.string().uri()),
  ],
  identityDocumentType: Joi.string().valid(
    ...Object.values(IdentityDocumentTypes)
  ),
  dateOfBirth: Joi.date()
    .iso()
    .less("now")
    .messages({ "date.less": "dateOfBirth must be in the past" }),
}).with("identityDocuments", "identityDocumentType");

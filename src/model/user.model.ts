import { model, Schema } from "mongoose";
import { Address, identityDocumentTypes, User } from "../types/user.type";

function isAddressNumberPresent(this: Address) {
  return this.number != undefined;
}

const addressSchema = new Schema<Address>({
  number: {
    type: String,
    trim: true,
  },
  street: {
    type: String,
    trim: true,
    required: [isAddressNumberPresent, "Street is required"],
  },
  town: {
    type: String,
    trim: true,
    required: [isAddressNumberPresent, "Town is required"],
  },
  state: {
    type: String,
    trim: true,
    required: [isAddressNumberPresent, "State is required"],
  },
});

const userSchema = new Schema<User>({
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    minLength: [11, "Phone number must be at least 11 characters long"],
    maxLength: [11, "Phone number cannot exceed 11 characters"],
  },
  dateOfBirth: {
    type: Date,
  },
  address: addressSchema,
  identityDocumentUrl: {
    type: String,
  },
  identityDocumentType: {
    type: String,
    enum: identityDocumentTypes,
  },
});

export const userModel = model("User", userSchema);

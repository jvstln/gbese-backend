import mongoose, { Model, model, Schema } from "mongoose";
import {
  Address,
  identityDocumentTypes,
  User,
  UserModel,
} from "../types/user.type";

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

const userSchema = new Schema<User>(
  {
    firstName: {
      type: String,
      required: [true, "Firstname is required"],
      minLength: [3, "Firstname must be at least 3 characters long"],
    },
    lastName: {
      type: String,
      required: [true, "Lastname is required"],
      minLength: [3, "Lastname must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
    },
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
    points: {
      type: Schema.Types.Decimal128,
      required: true,
      default: 0,
      get: (value: any) => value.toString(),
    },
  },
  {
    timestamps: true,
    statics: {
      async validateUserExistence(userId: string) {
        const userExists = await this.exists({ _id: userId });

        if (!userExists) {
          throw new Error(`User with ID ${userId} does not exist`);
        }
      },
    },
  }
);

export const userModel = model<User, UserModel>("User", userSchema);

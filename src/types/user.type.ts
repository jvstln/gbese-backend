import mongoose from "mongoose";
import { IAccount } from "./account.type";

export const identityDocumentTypes = ["nin", "passport", "bvn"] as const;

export interface UserUpdate {
  firstName: string;
  lastName: string;
  phone: string;
  address: Address;
  dateOfBirth: Date;
  identityDocumentUrl: string;
  identityDocumentType: typeof identityDocumentTypes;
}

export interface User extends UserUpdate {
  _id: string;
  name: string;
  email: string;
  points: mongoose.Types.Decimal128;
  account: IAccount;
}

export interface UserModel extends mongoose.Model<User> {
  validateUserExistence: (userId: string) => Promise<void>;
}

export interface Address {
  number: string;
  street: string;
  town: string;
  state: string;
}

export interface KycDocumentUpload {
  email: string;
  path: string;
  kycDocumentType: typeof identityDocumentTypes;
  filename: string;
  publicId?: string;
}

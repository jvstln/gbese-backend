import mongoose from "mongoose";
import { Account, AccountDocument } from "./account.type";

export enum IdentityDocumentTypes {
  NIN = "nin",
  PASSPORT = "passport",
  BVN = "bvn",
  DRIVERS_LICENSE = "drivers_license",
}

export interface UserUpdate {
  firstName: string;
  lastName: string;
  phone: string;
  address: Address;
  image: string;
  dateOfBirth: Date;
  identityDocuments: string[];
  identityDocumentType: IdentityDocumentTypes;
}

export interface User extends UserUpdate {
  name: string;
  email: string;
  points: Decimal128;
  account: AccountDocument;
  image: string;
  emailVerified: boolean;
}

export interface UserDocument extends mongoose.HydratedDocument<User> {
  account: AccountDocument;
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

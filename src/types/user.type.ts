import mongoose from "mongoose";
import { IAccount } from "./account.type";

export enum IdentityDocumentTypes {
  NIN = "nin",
  PASSPORT = "passport",
  BVN = "bvn",
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
  _id: string;
  name: string;
  email: string;
  points: mongoose.Types.Decimal128;
  account: IAccount;
  image: string;
  emailVerified: boolean;
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

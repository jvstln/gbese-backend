import { userModel } from "../model/user.model";
import { User } from "./user.type";

declare module "express" {
  interface Request {
    userSession?: {
      user: User;
      session: unknown;
    };
  }
}

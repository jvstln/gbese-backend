import { User } from "./user.type";

declare module "express" {
  interface Request {
    userSession?: {
      user: User;
      session: unknown;
    };
  }
}

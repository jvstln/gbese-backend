import { AccountDocument } from "./account.type";
import { UserDocument } from "./user.type";
import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userSession?: {
        user: UserDocument;
        account: AccountDocument;
        session: unknown;
      };
    }
  }

  type ObjectId = mongoose.Types.ObjectId;
  type Decimal128 = mongoose.Types.Decimal128 | string;
}

// export type ObjectId = mongoose.Types.ObjectId;

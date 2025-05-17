import { model, Schema } from "mongoose";
import {
  Address,
  IdentityDocumentTypes,
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
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: [3, "Name must be at least 3 characters long"],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
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
    image: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
    },
    phone: {
      type: String,
      trim: true,
      minLength: [11, "Phone number must be at least 11 characters long"],
      maxLength: [11, "Phone number cannot exceed 11 characters"],
    },
    dateOfBirth: {
      type: Date,
    },
    address: addressSchema,
    identityDocuments: [{ type: String }],
    identityDocumentType: {
      type: String,
      enum: Object.values(IdentityDocumentTypes),
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
    id: false,
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

userSchema.virtual("account", {
  ref: "Account",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

userSchema.pre("save", function () {
  if (this.isModified("firstName") || this.isModified("lastName")) {
    this.name = `${this.firstName} ${this.lastName}`;
  }
});

userSchema.index({ name: "text", email: "text" });

export const userModel = model<User, UserModel>("User", userSchema);

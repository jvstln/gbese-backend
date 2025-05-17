import { userModel } from "../model/user.model";
import { UserDocument, UserUpdate } from "../types/user.type";
import { APIError } from "better-auth/api";

class UserService {
  async getUser(filters: Record<string, unknown> = {}) {
    return userModel.findOne(filters).populate("account").exec();
  }

  async getUsers(filters: Record<string, unknown> = {}) {
    return userModel.find(filters).populate("account").exec();
  }

  async updateUser(user: UserDocument, data: UserUpdate) {
    const {
      identityDocuments,
      identityDocumentType,
      phone,
      image,
      address,
      firstName,
      lastName,
      dateOfBirth,
    } = data;

    // upload profile image. Image should be uploaded to cloudinary from frontend
    if (image) user.image = image;

    // upload identityDocument. Image should be uploaded to cloudinary from frontend
    if (identityDocuments) {
      user.identityDocuments = identityDocuments;
      user.identityDocumentType = identityDocumentType;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (address) user.address = address;

    await user.save();
    return user;
  }

  async searchUser(search: string) {
    return userModel
      .find({ $text: { $search: search } })
      .populate("account")
      .exec();
  }
}

export const userService = new UserService();

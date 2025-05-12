import { userModel } from "../model/user.model";
import { getDocument, uploadDocument } from "../utils/cloudinary";
import { UserUpdate } from "../types/user.type";
import { APIError } from "better-auth/api";

class UserService {
  async getUser(filters: Record<string, unknown> = {}) {
    return userModel.findOne(filters).populate("account").exec();
  }

  async getUsers(filters: Record<string, unknown> = {}) {
    return userModel.find(filters).populate("account").exec();
  }

  async updateUser(
    id: string,
    data: UserUpdate & { identityDocument: Express.Multer.File }
  ) {
    const {
      identityDocument,
      identityDocumentType,
      phone,
      image,
      address,
      firstName,
      lastName,
      dateOfBirth,
    } = data;

    const user = await userModel.findById(id).exec();

    if (!user) {
      throw new APIError("UNAUTHORIZED", { message: "User not found" });
    }

    // upload profile image
    if (data.image && typeof image !== "string") {
      const currentImage = await getDocument(user.image);

      const uploadedDocument = await uploadDocument({
        path: image.path,
        filename: image.originalname,
        tags: [identityDocumentType, "profile-image"],
        folder: `${user.email}`,
        public_id: currentImage?.public_id,
        overwrite: true,
      });

      user.image = uploadedDocument.secure_url;
    }

    // upload identityDocument
    if (data.identityDocument) {
      const currentDocument = await getDocument(user.identityDocumentUrl);

      const uploadedDocument = await uploadDocument({
        path: identityDocument.path,
        filename: identityDocument.originalname,
        tags: [identityDocumentType, "kyc"],
        folder: `${user.email}`,
        public_id: currentDocument?.public_id,
        overwrite: true,
      });

      user.identityDocumentUrl = uploadedDocument.secure_url;
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

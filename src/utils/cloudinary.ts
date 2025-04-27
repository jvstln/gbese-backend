import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { UploadApiOptions } from "cloudinary";
import fs from "node:fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function uploadDocument({
  path,
  folder,
  ...options
}: UploadApiOptions) {
  const uploadedDocument = await cloudinary.uploader.upload(path, {
    folder: folder ? `gbese/${folder}` : "",
    ...options,
  });

  // Delete document after upload
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }

  return uploadedDocument;
}

export async function getDocument(url: string) {
  try {
    // Cloudinary URL Format:
    // https://res.cloudinary.com/{cloud_name}/{resource_type}/{type}/{transformations}/{public_id}.{format}
    const publicId = decodeURIComponent(
      url.match(/res\.cloudinary\.com\/(.+?\/){4}(.+)\..+$/)?.[2] ?? ""
    );

    const document = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
    });
    return document;
  } catch (error) {
    console.log("Error getting cloudinary document details: ", error);
    return null;
  }
}

export { cloudinary };

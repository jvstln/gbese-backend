import "dotenv/config";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { sendEmail } from "./mali";
import {
  verifyEmailHTMLTemplate,
  verifyEmailTextTemplate,
} from "./email-template";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log("Sending verification email to", user.email, token, request);
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: verifyEmailHTMLTemplate({ name: user.name, url }),
        text: verifyEmailTextTemplate({ name: user.name, url }),
      });
    },
    autoSignInAfterVerification: true,
  },
  user: {
    modelName: "users",
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
      },
      lastName: {
        type: "string",
        required: true,
      },
    },
  },
  basePath: "api/v1/better-auth",
});

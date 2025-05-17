import "dotenv/config";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { sendEmail } from "./mail";
import {
  verifyEmailHTMLTemplate,
  verifyEmailTextTemplate,
} from "./email-template";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

export const auth = betterAuth({
  appName: "GBESE",
  baseURL: process.env.BASE_URL,
  basePath: "api/v1/better-auth",
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, token }) => {
      const url = `${process.env.BASE_URL}/api/v1/auth/verify-email?token=${token}&userId=${user.id}`;
      console.log(`Sent verification email to: ${user.email} - ${url}`);
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: verifyEmailHTMLTemplate({ name: user.name, url }),
        text: verifyEmailTextTemplate({ name: user.name, url }),
      });
    },
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
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
  account: {
    modelName: "better-auth-accounts",
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      mapProfileToUser: (profile) => {
        return {
          firstName: profile.given_name,
          lastName: profile.family_name,
        };
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60, // 1hr in seconds
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      overwrite: true,
    },
  },
});

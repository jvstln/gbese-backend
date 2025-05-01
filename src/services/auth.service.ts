import { Request } from "express";
import { Login, Signup, VerifyEmail } from "../types/auth.type";
import { auth } from "../utils/auth";

class AuthService {
  async signUp(data: Signup) {
    const { firstName, lastName, email, password } = data;
    const name = `${firstName} ${lastName}`;

    const response = await auth.api.signUpEmail({
      body: { name, email, password, firstName, lastName },
      asResponse: true,
    });

    return response;
  }

  async login(data: Login) {
    const response = await auth.api.signInEmail({
      body: data,
      asResponse: true,
    });

    return response;
  }

  async verifyEmail(data: VerifyEmail) {
    const response = await auth.api.verifyEmail({
      query: data,
    });
    return response;
  }

  async getSession(requestObject: Request) {
    const requestHeaders = new Headers();

    requestObject.rawHeaders.forEach((value, index) => {
      if (index % 2 === 0) {
        requestHeaders.append(value, requestObject.rawHeaders[index + 1]);
      }
    });

    return auth.api.getSession({ headers: requestHeaders });
  }

  async logout(requestObject: Request) {
    const requestHeaders = new Headers();

    requestObject.rawHeaders.forEach((value, index) => {
      if (index % 2 === 0) {
        requestHeaders.append(value, requestObject.rawHeaders[index + 1]);
      }
    });

    return auth.api.signOut({ headers: requestHeaders, asResponse: true });
  }
}

export const authService = new AuthService();

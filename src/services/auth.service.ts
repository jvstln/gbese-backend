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
}

export const authService = new AuthService();

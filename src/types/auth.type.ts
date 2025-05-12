export interface Signup {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface VerifyEmail {
  token: string;
  userId: string;
}

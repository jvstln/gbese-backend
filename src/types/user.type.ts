export const identityDocumentTypes = ["nin", "passport", "bvn"] as const;

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address;
  dateOfBirth: Date;
  identityDocumentUrl: string;
  identityDocumentType: typeof identityDocumentTypes;
}

export interface Address {
  number: string;
  street: string;
  town: string;
  state: string;
}

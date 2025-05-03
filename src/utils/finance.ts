import { customAlphabet } from "nanoid";

const nanoidNumbers = customAlphabet("0123456789");

export const generateAccountNumber = () => {
  return "99" + nanoidNumbers(8);
};

export const isAccountNumberValid = (accountNumber: string) => {
  return accountNumber.startsWith("99") && accountNumber.length === 10;
};

export const generateTransactionReference = () => {
  return "GBESE_TXN_" + nanoidNumbers(10);
};

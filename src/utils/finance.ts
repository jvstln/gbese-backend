import { customAlphabet } from "nanoid";

const nanoidNumbers = customAlphabet("0123456789");

export const generateAccountNumber = () => {
  return "99" + nanoidNumbers(8);
};

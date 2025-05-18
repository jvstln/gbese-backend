import Decimal from "decimal.js";
import { customAlphabet } from "nanoid";

const nanoidNumbers = customAlphabet("0123456789");

export const generateAccountNumber = () => {
  return "99" + nanoidNumbers(8);
};

export const isAccountNumberValid = (accountNumber: string) => {
  return accountNumber.startsWith("99") && accountNumber.length === 10;
};

export const generateTransactionReference = () => {
  return "GBESE_TXN_" + nanoidNumbers(12);
};

/**
 * Maths for debt point
 * ₦10000 =20 Gbese points --- 500 = 1 Gbese point
 * 100Gbp = 1 token
 * 100Gbt = 1 Nft
 * ---Using NGN as standard---
 */
const currencyConversionRates = {
  NGN: 1 / 1,
  GBP: 1 / 500, // 500NGN = 1 GBP
  GBT: 1 / 50_000, // 50000NGN = 1 GBT
  NFT: 1 / 5_000_000, // 5000000NGN = 1 NFT
};

export const convertCurrency = (
  amount: Decimal.Value,
  from: keyof typeof currencyConversionRates,
  to: keyof typeof currencyConversionRates
) => {
  const fromRate = currencyConversionRates[from];
  const toRate = currencyConversionRates[to];

  return new Decimal(amount).div(fromRate).mul(toRate).toString();
};

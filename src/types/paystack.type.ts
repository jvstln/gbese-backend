export interface IntializePayment {
  amount: string;
  email: string;
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, unknown>;
}

export enum PaystackMetadataAction {
  FUND = "fund",
  WITHDRAW = "withdraw",
}

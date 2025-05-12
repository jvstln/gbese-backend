export interface IntializePayment {
  amount: string;
  email: string;
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, unknown>;
}

export interface IntiateTransfer {
  amount: string;
  recipient: string;
  reference?: string;
}

export enum PaystackMetadataAction {
  FUND = "fund",
  WITHDRAW = "withdraw",
}

export interface CreateTransferRecipient {
  accountName: string;
  bankCode: string;
  accountNumber: string;
  description?: string;
}

export interface PaystackTransferRecipient {
  domain: string;
  type: string;
  currency: string;
  name: string;
  details: {
    account_number: string;
    account_name: string;
    bank_code: string;
    bank_name: string;
  };
  metadata: Record<string, unknown>;
  recipient_code: string;
  active: boolean;
  id: number;
}

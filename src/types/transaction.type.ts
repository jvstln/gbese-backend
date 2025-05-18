export enum TransactionTypes {
  CREDIT = "credit",
  DEBIT = "debit",
}

export enum TransactionStatuses {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

export enum TransactionCategories {
  TRANSFER = "transfer",
  DEBT_TRANSFER = "debt_transfer",
  FUND = "fund",
  WITHDRAWAL = "withdrawal",
  LOAN = "loan",
  DEBT_REPAYMENT = "debt_repayment",
  WEB3_WITHDRAWAL = "web3_withdrawal",
}

export interface TransactionCreation {
  accountId: ObjectId;
  type: TransactionTypes;
  category: TransactionCategories;
  amount: Decimal128;
  balanceBefore: Decimal128;
  balanceAfter: Decimal128;
  description?: string;
  status?: TransactionStatuses;
  metadata?: object;
}

export interface Transaction extends TransactionCreation {
  reference: string;
}

export interface TransactionFilters {
  type?: TransactionTypes;
  status?: TransactionStatuses;
  category?: TransactionCategories;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

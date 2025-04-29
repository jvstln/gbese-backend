export interface IDebtRequest extends Document {
  debtorId: string;
  creditorId: string;
  payerId: string;
  amount: number;
  description: string;
  incentive: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export const debtRequestStatuses = [
  "pending",
  "completed",
  "rejected",
] as const;
export const debtRequestUserRoles = ["debtor", "creditor", "payer"] as const;

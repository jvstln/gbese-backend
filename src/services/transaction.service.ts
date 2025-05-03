import { transactionModel } from "../model/transaction.model";

class TransactionService {
  getUserTransactions(userId: string) {
    return transactionModel.find({ userId });
  }
}

export const transactionService = new TransactionService();

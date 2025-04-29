import Transaction from '../models/transactionModel';
import { ITransaction, TransactionFilters, PaginationOptions } from '../types/transaction';

export const createTransaction = async (transactionData: ITransaction) => {
  const transaction = new Transaction(transactionData);
  return await transaction.save();
};

export const getTransactionById = async (id: string) => {
  const transaction = await Transaction.findById(id);
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  return transaction;
};

export const getTransactionByReference = async (reference: string) => {
  const transaction = await Transaction.findOne({ reference });
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  return transaction;
};

export const getAllTransactions = async (options: PaginationOptions = {}) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = options;
  return await Transaction.paginate({}, { page, limit, sort });
};

export const filterTransactions = async (filter: TransactionFilters, options: PaginationOptions = {}) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = options;
  return await Transaction.paginate(filter, { page, limit, sort });
};

export const updateTransaction = async (id: string, updateData: Partial<ITransaction>) => {
  const transaction = await Transaction.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
  
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  
  return transaction;
};

export const deleteTransaction = async (id: string) => {
  const transaction = await Transaction.findByIdAndDelete(id);
  
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  
  return true;
};
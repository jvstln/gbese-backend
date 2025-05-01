import { Types } from 'mongoose';
import Transaction from '../models/transaction.model';
import { CreateTransactionDto, ITransaction, TransactionQueryFilters } from '../types/transaction.types';

export class TransactionService {
  /**
   * Creates a new transaction
   */
  async createTransaction(transactionData: CreateTransactionDto): Promise<ITransaction> {
    // Generate unique reference if not provided
    if (!transactionData.reference) {
      transactionData.reference = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }
    
    const transaction = new Transaction({
      from: new Types.ObjectId(transactionData.from),
      to: new Types.ObjectId(transactionData.to),
      type: transactionData.type,
      amount: transactionData.amount,
      reference: transactionData.reference,
      description: transactionData.description || '',
    });

    return await transaction.save();
  }

  /**
   * Retrieves transactions with optional filters and pagination
   */
  async getTransactions(
    filters: TransactionQueryFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<{ transactions: ITransaction[]; total: number; page: number; limit: number }> {
    const query: any = {};

    // Apply filters if provided
    if (filters.from) query.from = new Types.ObjectId(filters.from);
    if (filters.to) query.to = new Types.ObjectId(filters.to);
    if (filters.type) query.type = filters.type;
    
    // Handle amount range filters
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      query.amount = {};
      if (filters.minAmount !== undefined) query.amount.$gte = filters.minAmount;
      if (filters.maxAmount !== undefined) query.amount.$lte = filters.maxAmount;
    }

    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('from', 'email firstname lastname')
        .populate('to', 'email firstname lastname'),
      Transaction.countDocuments(query),
    ]);

    return { transactions, total, page, limit };
  }

  /**
   * Retrieves a single transaction by ID
   */
  async getTransactionById(id: string): Promise<ITransaction | null> {
    return Transaction.findById(id)
      .populate('from', 'email firstname lastname')
      .populate('to', 'email firstname lastname');
  }

  /**
   * Gets transactions where user is the sender
   */
  async getTransactionsByUser(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ transactions: ITransaction[]; total: number; page: number; limit: number }> {
    const query = { from: new Types.ObjectId(userId) };
    const skip = (page - 1) * limit;
    
    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('from', 'email firstname lastname')
        .populate('to', 'email firstname lastname'),
      Transaction.countDocuments(query),
    ]);

    return { transactions, total, page, limit };
  }

  /**
   * Gets transactions where user is the recipient
   */
  async getTransactionsReceivedByUser(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ transactions: ITransaction[]; total: number; page: number; limit: number }> {
    const query = { to: new Types.ObjectId(userId) };
    const skip = (page - 1) * limit;
    
    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('from', 'email firstname lastname')
        .populate('to', 'email firstname lastname'),
      Transaction.countDocuments(query),
    ]);

    return { transactions, total, page, limit };
  }
}

export default new TransactionService();
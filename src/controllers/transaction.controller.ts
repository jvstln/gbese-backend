import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import transactionService from '../services/transaction.service';
import { TransactionQueryFilters } from '../types/transaction.types';

export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await transactionService.createTransaction(req.body);
  
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Transaction created successfully',
    data: transaction,
  });
});

export const getAllTransactions = asyncHandler(async (req: Request, res: Response) => {
  const filters: TransactionQueryFilters = {};
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  
  // Apply query filters
  if (req.query.from) filters.from = req.query.from as string;
  if (req.query.to) filters.to = req.query.to as string;
  if (req.query.type) filters.type = req.query.type as string;
  if (req.query.minAmount) filters.minAmount = parseFloat(req.query.minAmount as string);
  if (req.query.maxAmount) filters.maxAmount = parseFloat(req.query.maxAmount as string);
  
  const result = await transactionService.getTransactions(filters, page, limit);
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Transactions retrieved successfully',
    data: result.transactions,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: Math.ceil(result.total / result.limit),
    },
  });
});

export const getTransactionById = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await transactionService.getTransactionById(req.params.id);
  
  if (!transaction) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Transaction not found',
    });
    return;
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Transaction retrieved successfully',
    data: transaction,
  });
});

export const getTransactionsByUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  
  const result = await transactionService.getTransactionsByUser(userId, page, limit);
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Transactions retrieved successfully',
    data: result.transactions,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: Math.ceil(result.total / result.limit),
    },
  });
});

export const getTransactionsReceivedByUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  
  const result = await transactionService.getTransactionsReceivedByUser(userId, page, limit);
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Transactions retrieved successfully',
    data: result.transactions,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: Math.ceil(result.total / result.limit),
    },
  });
});
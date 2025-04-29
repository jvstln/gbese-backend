import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as transactionService from '../services/transactionService';
import { asyncHandler } from '../middlewares/errorMiddleware';

export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error('Invalid input data');
  }

  const transaction = await transactionService.createTransaction(req.body);
  res.status(201).json({ success: true, data: transaction });
});

export const getTransactionById = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await transactionService.getTransactionById(req.params.id);
  res.status(200).json({ success: true, data: transaction });
});

export const getTransactionByReference = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await transactionService.getTransactionByReference(req.params.reference);
  res.status(200).json({ success: true, data: transaction });
});

export const getAllTransactions = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const sort = req.query.sort?.toString() || '-createdAt';
  
  const transactions = await transactionService.getAllTransactions({ page, limit, sort });
  res.status(200).json({ success: true, ...transactions });
});

export const filterTransactions = asyncHandler(async (req: Request, res: Response) => {
  const { userEmail, type, status, startDate, endDate } = req.query;
  
  const filter: any = {};
  
  if (userEmail) filter.userEmail = userEmail;
  if (type) filter.type = type;
  if (status) filter.status = status;
  
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate as string);
    if (endDate) filter.createdAt.$lte = new Date(endDate as string);
  }
  
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const sort = req.query.sort?.toString() || '-createdAt';
  
  const transactions = await transactionService.filterTransactions(filter, { page, limit, sort });
  res.status(200).json({ success: true, ...transactions });
});

export const updateTransaction = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error('Invalid input data');
  }
  
  const transaction = await transactionService.updateTransaction(req.params.id, req.body);
  res.status(200).json({ success: true, data: transaction });
});

export const deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
  await transactionService.deleteTransaction(req.params.id);
  res.status(200).json({ success: true, message: 'Transaction deleted' });
});
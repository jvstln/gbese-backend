import express from 'express';
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionsByUser,
  getTransactionsReceivedByUser,
} from '../controllers/transaction.controller';
import {
  validateCreateTransaction,
  validateGetTransactions,
  validateTransactionId,
} from '../validations/transaction.validation';

const router = express.Router();

// Create a new transaction
router.post('/', createTransaction);

// Get all transactions with optional filtering
router.get('/',  getAllTransactions);

// Get a specific transaction by ID
router.get('/:id', getTransactionById);

// Get transactions initiated by a specific user
router.get('/user/:userId/sent',   getTransactionsByUser);

// Get transactions received by a specific user
router.get('/user/:userId/received', getTransactionsReceivedByUser);

export default router;

// validateGetTransactions
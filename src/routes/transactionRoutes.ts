import express from 'express';
import { check } from 'express-validator';
import * as transactionController from '../controller/transactionController';

const router = express.Router();

const createTransactionRules = [
  check('userEmail').isEmail().withMessage('Valid email required'),
  check('amount').isNumeric().withMessage('Amount must be a number'),
  check('type').isIn(['deposit', 'withdrawal', 'transfer', 'payment'])
    .withMessage('Invalid transaction type'),
  check('currency').optional()
    .isIn(['NGN', 'USD', 'EUR', 'GBP'])
    .withMessage('Invalid currency')
];

const updateTransactionRules = [
  check('status').optional()
    .isIn(['pending', 'completed', 'failed', 'cancelled'])
    .withMessage('Invalid status'),
  check('description').optional().isString(),
  check('metadata').optional().isObject()
];

router.post('/', createTransactionRules, transactionController.createTransaction);
router.get('/:id', transactionController.getTransactionById);
router.get('/reference/:reference', transactionController.getTransactionByReference);
router.get('/', transactionController.getAllTransactions);
router.get('/filter', transactionController.filterTransactions);
router.patch('/:id', updateTransactionRules, transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

export default router;
import mongoose, { Schema } from 'mongoose';
import { ITransaction } from '../types/transaction.types';

// Transaction schema definition
const TransactionSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender user ID is required'],
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient user ID is required'],
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: ['transfer', 'payment', 'debt', 'refund', 'deposit', 'withdrawal'],
    },
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    reference: {
      type: String,
      required: [true, 'Transaction reference is required'],
      unique: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,  // Automatically manage createdAt and updatedAt
  }
);

// Indexes for optimizing queries
TransactionSchema.index({ from: 1, createdAt: -1 });
TransactionSchema.index({ to: 1, createdAt: -1 });
TransactionSchema.index({ reference: 1 }, { unique: true });

const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
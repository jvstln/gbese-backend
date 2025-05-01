import { Document, Types } from 'mongoose';

// Interface for Transaction document in MongoDB
export interface ITransaction extends Document {
  from: Types.ObjectId;      // User who initiated the transaction
  to: Types.ObjectId;        // User receiving the transaction
  type: string;             // Type of transaction (transfer, payment, etc.)
  amount: number;           // Transaction amount
  reference: string;        // Unique transaction reference
  description: string;      // Optional transaction description
  createdAt: Date;         // Transaction creation timestamp
  updatedAt: Date;         // Transaction last update timestamp
}

// Data transfer object for creating new transactions
export interface CreateTransactionDto {
  from: string;            // Sender's user ID
  to: string;             // Recipient's user ID
  type: string;           // Transaction type
  amount: number;         // Amount to transfer
  reference?: string;     // Optional reference (auto-generated if not provided)
  description?: string;   // Optional description
}

// Interface for filtering transactions
export interface TransactionQueryFilters {
  from?: string;          // Filter by sender
  to?: string;           // Filter by recipient
  type?: string;         // Filter by transaction type
  minAmount?: number;    // Minimum amount filter
  maxAmount?: number;    // Maximum amount filter
}

// Response interface for transaction data
export interface TransactionResponse {
  id: string;
  from: string;
  to: string;
  type: string;
  amount: number;
  reference: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
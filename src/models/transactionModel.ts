import mongoose, { Schema, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ITransaction } from '../types/transaction';

const TransactionSchema = new Schema<ITransaction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    userEmail: {
      type: String,
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true,
      default: 'NGN',
      enum: ['NGN', 'USD', 'EUR', 'GBP']
    },
    type: {
      type: String,
      required: true,
      enum: ['deposit', 'withdrawal', 'transfer', 'payment'],
      index: true
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
      index: true
    },
    reference: {
      type: String,
      required: true,
      unique: true
    },
    description: String,
    metadata: Object,
    paymentMethod: {
      type: String,
      enum: ['card', 'bank_transfer', 'ussd', 'wallet']
    },
    destinationAccount: String
  },
  {
    timestamps: true
  }
);

// 👉 Add pagination plugin
TransactionSchema.plugin(mongoosePaginate);

// 👉 Auto-generate reference if not provided
TransactionSchema.pre('save', function (next) {
  if (!this.reference) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000000).toString();
    this.reference = `TRX-${timestamp}-${random}`;
  }
  next();
});

// 👉 Create necessary indexes
TransactionSchema.index({ createdAt: -1 });
TransactionSchema.index({ userEmail: 1, type: 1 });
TransactionSchema.index({ userEmail: 1, status: 1 });

// 👉 Correct model export to support paginate
const Transaction = mongoose.model<ITransaction, PaginateModel<ITransaction>>('Transaction', TransactionSchema);

export default Transaction;

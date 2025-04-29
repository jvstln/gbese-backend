
export interface ITransaction {
    user?: string;
    userEmail: string;
    amount: number;
    currency: 'NGN' | 'USD' | 'EUR' | 'GBP';
    type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    reference: string;
    description?: string;
    metadata?: Record<string, any>;
    paymentMethod?: 'card' | 'bank_transfer' | 'ussd' | 'wallet';
    destinationAccount?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface TransactionFilters {
    userEmail?: string;
    type?: string;
    status?: string;
    createdAt?: {
      $gte?: Date;
      $lte?: Date;
    };
  }
  
  export interface PaginationOptions {
    page?: number;
    limit?: number;
    sort?: string;
  }
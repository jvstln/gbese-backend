import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export const validateCreateTransaction = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    from: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Sender ID must be a valid MongoDB ObjectId',
        'any.required': 'Sender ID is required',
      }),
    to: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Recipient ID must be a valid MongoDB ObjectId',
        'any.required': 'Recipient ID is required',
      }),
    type: Joi.string()
      .valid('transfer', 'payment', 'debt', 'refund', 'deposit', 'withdrawal')
      .required()
      .messages({
        'any.only': 'Transaction type must be one of: transfer, payment, debt, refund, deposit, withdrawal',
        'any.required': 'Transaction type is required',
      }),
    amount: Joi.number().positive().required().messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be greater than 0',
      'any.required': 'Amount is required',
    }),
    reference: Joi.string().messages({
      'string.base': 'Reference must be a string',
    }),
    description: Joi.string().allow('').messages({
      'string.base': 'Description must be a string',
    }),
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.details[0].message,
    });
  }
  
  next();
};

export const validateGetTransactions = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    from: Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
      'string.pattern.base': 'Sender ID must be a valid MongoDB ObjectId',
    }),
    to: Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
      'string.pattern.base': 'Recipient ID must be a valid MongoDB ObjectId',
    }),
    type: Joi.string().valid('transfer', 'payment', 'debt', 'refund', 'deposit', 'withdrawal').messages({
      'any.only': 'Transaction type must be one of: transfer, payment, debt, refund, deposit, withdrawal',
    }),
    minAmount: Joi.number().min(0).messages({
      'number.base': 'Minimum amount must be a number',
      'number.min': 'Minimum amount cannot be negative',
    }),
    maxAmount: Joi.number().min(0).messages({
      'number.base': 'Maximum amount must be a number',
      'number.min': 'Maximum amount cannot be negative',
    }),
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1',
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100',
    }),
  });

  const { error } = schema.validate(req.query);
  
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.details[0].message,
    });
  }
  
  next();
};

export const validateTransactionId = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Transaction ID must be a valid MongoDB ObjectId',
        'any.required': 'Transaction ID is required',
      }),
  });

  const { error } = schema.validate(req.params);
  
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.details[0].message,
    });
  }
  
  next();
};
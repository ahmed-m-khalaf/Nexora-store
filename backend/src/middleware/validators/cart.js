import { body, param } from 'express-validator';

export const validateAddToCart = [
  body('productId').toInt().isInt({ min: 1 }),
  body('quantity').optional().toInt().isInt({ min: 1 })
];

export const validateUpdateCartItem = [
  param('productId').toInt().isInt({ min: 1 }),
  body('quantity').toInt().isInt()
];

export const validateProductIdParam = [
  param('productId').toInt().isInt({ min: 1 })
];

import { query, param, body } from 'express-validator';

export const validateGetProducts = [
  query('search').optional().trim().isLength({ max: 200 }),
  query('page').optional().toInt().isInt({ min: 1 }),
  query('limit').optional().toInt().isInt({ min: 1, max: 100 }),
  query('categoryId').optional().toInt().isInt({ min: 1 }),
  query('minPrice').optional().toFloat().isFloat({ min: 0 }),
  query('maxPrice').optional().toFloat().isFloat({ min: 0 }),
  query('inStock').optional().isBoolean(),
  query('sortBy').optional().isIn(['id', 'title', 'price', 'createdAt']),
  query('order').optional().isIn(['asc', 'desc'])
];

export const validateProductId = [
  param('id').toInt().isInt({ min: 1 })
];

export const validateCreateProduct = [
  body('title').trim().escape().isLength({ min: 3, max: 200 }),
  body('price').isFloat({ min: 0 }),
  body('categoryId').optional().toInt().isInt({ min: 1 }),
  body('category').optional().trim().escape().isLength({ min: 3, max: 100 })
];

export const validateUpdateProduct = [
  body('title').optional().trim().escape().isLength({ min: 3, max: 200 }),
  body('price').optional().isFloat({ min: 0 }),
  body('categoryId').optional().toInt().isInt({ min: 1 }),
  body('category').optional().trim().escape().isLength({ min: 3, max: 100 })
];

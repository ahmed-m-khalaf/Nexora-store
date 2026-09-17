import express from 'express';
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

import {
  validateGetProducts,
  validateProductId,
  validateCreateProduct,
  validateUpdateProduct
} from '../middleware/validators/product.js';
import { handleValidationErrors } from '../middleware/validators/index.js';

const router = express.Router();

// GET /api/products (supports ?search, ?category, ?sortBy, ?order, ?page, ?limit)
router.get('/', validateGetProducts, handleValidationErrors, getAllProducts);

// GET /api/products/category/:category
router.get('/category/:category', getProductsByCategory);

// GET /api/products/:id
router.get('/:id', validateProductId, handleValidationErrors, getProductById);

// POST /api/products
router.post('/', validateCreateProduct, handleValidationErrors, createProduct);

// PATCH /api/products/:id
router.patch('/:id', validateProductId, validateUpdateProduct, handleValidationErrors, updateProduct);

// DELETE /api/products/:id
router.delete('/:id', validateProductId, handleValidationErrors, deleteProduct);

export default router;

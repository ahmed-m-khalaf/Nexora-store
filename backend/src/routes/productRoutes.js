import express from 'express';
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// GET /api/products (supports ?search, ?category, ?sortBy, ?order, ?page, ?limit)
router.get('/', getAllProducts);

// GET /api/products/category/:category
router.get('/category/:category', getProductsByCategory);

// GET /api/products/:id
router.get('/:id', getProductById);

// POST /api/products
router.post('/', createProduct);

// PATCH /api/products/:id
router.patch('/:id', updateProduct);

// DELETE /api/products/:id
router.delete('/:id', deleteProduct);

export default router;

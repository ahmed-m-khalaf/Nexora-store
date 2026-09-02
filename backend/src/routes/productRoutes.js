import express from 'express';
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct
} from '../controllers/productController.js';
import { getAllCategories } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/categories', getAllCategories);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.post('/', createProduct);

export default router;

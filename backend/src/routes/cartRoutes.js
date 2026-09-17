import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cartController.js';
import { optionalAuth } from '../middleware/auth.js';

import {
  validateAddToCart,
  validateUpdateCartItem,
  validateProductIdParam
} from '../middleware/validators/cart.js';
import { handleValidationErrors } from '../middleware/validators/index.js';

const router = express.Router();

router.use(optionalAuth);

// GET /api/cart
router.get('/', getCart);

// POST /api/cart/items
router.post('/items', validateAddToCart, handleValidationErrors, addToCart);

// PATCH /api/cart/items/:productId
router.patch('/items/:productId', validateUpdateCartItem, handleValidationErrors, updateCartItem);

// DELETE /api/cart/items/:productId
router.delete('/items/:productId', validateProductIdParam, handleValidationErrors, removeCartItem);

// DELETE /api/cart
router.delete('/', clearCart);

export default router;

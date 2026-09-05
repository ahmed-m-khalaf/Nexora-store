import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cartController.js';

const router = express.Router();

// GET /api/cart
router.get('/', getCart);

// POST /api/cart/items
router.post('/items', addToCart);

// PATCH /api/cart/items/:productId
router.patch('/items/:productId', updateCartItem);

// DELETE /api/cart/items/:productId
router.delete('/items/:productId', removeCartItem);

// DELETE /api/cart
router.delete('/', clearCart);

export default router;

import { checkoutCart } from '../services/orderService.js';

// POST /api/orders/checkout
// Prices and quantities always come from the database cart, never from the browser.
export const checkout = async (req, res, next) => {
  try {
    const order = await checkoutCart({
      cartId: req.headers['x-cart-id'],
      userId: req.user?.id,
      customer: req.body,
    });
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

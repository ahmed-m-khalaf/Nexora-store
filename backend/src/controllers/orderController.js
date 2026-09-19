import { checkoutCart } from '../services/orderService.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';

// POST /api/orders/checkout
// Prices and quantities always come from the database cart, never from the browser.
export const checkout = async (req, res, next) => {
  try {
    const order = await checkoutCart({
      cartId: req.headers['x-cart-id'],
      userId: req.user?.id,
      customer: req.body,
    });

    // Asynchronously dispatch order confirmation email
    const recipientEmail = order.customerEmail || req.body.customerEmail || req.user?.email;
    const recipientName = order.customerName || req.body.customerName || req.user?.name || 'Customer';
    if (recipientEmail) {
      sendOrderConfirmationEmail({
        to: recipientEmail,
        customerName: recipientName,
        order,
      }).catch((err) => {
        console.error('Background order email error:', err.message);
      });
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

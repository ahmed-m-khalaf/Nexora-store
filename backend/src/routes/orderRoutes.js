import express from 'express';
import { checkout, getMyOrders } from '../controllers/orderController.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';

import { validateCheckout } from '../middleware/validators/order.js';
import { handleValidationErrors } from '../middleware/validators/index.js';

const router = express.Router();

router.use(optionalAuth);

router.post('/checkout', validateCheckout, handleValidationErrors, checkout);
router.get('/mine', requireAuth, getMyOrders);

export default router;

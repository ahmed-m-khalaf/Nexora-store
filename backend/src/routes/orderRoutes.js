import express from 'express';
import { checkout } from '../controllers/orderController.js';
import { optionalAuth } from '../middleware/auth.js';

import { validateCheckout } from '../middleware/validators/order.js';
import { handleValidationErrors } from '../middleware/validators/index.js';

const router = express.Router();

router.use(optionalAuth);

router.post('/checkout', validateCheckout, handleValidationErrors, checkout);

export default router;

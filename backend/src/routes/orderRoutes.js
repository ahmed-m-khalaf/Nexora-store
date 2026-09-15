import express from 'express';
import { checkout } from '../controllers/orderController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(optionalAuth);

router.post('/checkout', checkout);

export default router;

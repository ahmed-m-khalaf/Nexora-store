import express from 'express';
import { login, me, register } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

import { validateRegister, validateLogin } from '../middleware/validators/auth.js';
import { handleValidationErrors } from '../middleware/validators/index.js';

const router = express.Router();

router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.get('/me', requireAuth, me);

export default router;

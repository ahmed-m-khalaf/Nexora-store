import { login as loginUser, register as registerUser } from '../services/authService.js';
import { sendWelcomeEmail } from '../services/emailService.js';

const guestCartIdFromRequest = (req) => req.headers['x-cart-id'];

export const register = async (req, res, next) => {
  try {
    const result = await registerUser({ ...req.body, guestCartId: guestCartIdFromRequest(req) });
    
    // Asynchronously dispatch welcome email without blocking response
    sendWelcomeEmail({ to: result.user.email, name: result.user.name }).catch((err) => {
      console.error('Background welcome email error:', err.message);
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser({ ...req.body, guestCartId: guestCartIdFromRequest(req) });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const me = (req, res) => res.status(200).json({ user: req.user });

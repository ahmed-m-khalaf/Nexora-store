import { body } from 'express-validator';

export const validateCheckout = [
  body('customerName')
    .trim()
    .escape()
    .isLength({ min: 2, max: 200 })
    .withMessage('Name, email, phone, and shipping address are required.'),
  body('customerEmail')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('customerPhone')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Name, email, phone, and shipping address are required.'),
  body('shippingAddress')
    .trim()
    .escape()
    .isLength({ min: 10, max: 500 })
    .withMessage('Name, email, phone, and shipping address are required.'),
];

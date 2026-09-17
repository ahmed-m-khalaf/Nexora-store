import { validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorList = errors.array();
    const firstMsg = errorList[0]?.msg || 'Validation failed.';
    return res.status(400).json({
      error: true,
      message: firstMsg !== 'Invalid value' ? firstMsg : `Validation failed for ${errorList.map(e => e.path).join(', ')}.`,
      errors: errorList.map(e => ({ field: e.path, message: e.msg })),
      status: 400,
    });
  }
  next();
};

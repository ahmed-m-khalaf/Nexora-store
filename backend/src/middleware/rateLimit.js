import rateLimit from 'express-rate-limit';

const isTestEnv = process.env.NODE_ENV === 'test';

const makeRateLimiter = (options) =>
  isTestEnv
    ? (_req, _res, next) => next()
    : rateLimit({
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) =>
          req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip,
        handler: (_req, res) =>
          res.status(429).json({
            error: true,
            message: 'Too many requests, please try again later.',
            status: 429,
          }),
        ...options,
      });

export const apiLimiter = makeRateLimiter({ windowMs: 15 * 60 * 1000, max: 100 });
export const authLimiter = makeRateLimiter({ windowMs: 15 * 60 * 1000, max: 5, skipSuccessfulRequests: true });
export const checkoutLimiter = makeRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });

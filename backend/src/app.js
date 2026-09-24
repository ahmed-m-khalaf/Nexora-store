import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { apiLimiter, authLimiter, checkoutLimiter } from './middleware/rateLimit.js';

const app = express();

// Security Headers
app.use(helmet());

// Enable CORS for all origins & methods
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-cart-id'],
  })
);

// Body parser middleware
app.use(express.json({ limit: '16kb' }));

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    message: 'Nexora Backend API is running',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      cart: '/api/cart',
      orders: '/api/orders',
      auth: '/api/auth',
    },
  });
});

app.use('/api', apiLimiter);

// Mount Feature Routers
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', checkoutLimiter, orderRoutes);
app.use('/api/auth', authLimiter, authRoutes);

// Fallback Route (404 for unknown endpoints)
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: `Endpoint ${req.method} ${req.originalUrl} not found.`,
    status: 404,
  });
});

// Centralized Error Handling Middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  // Prisma known error codes
  if (err.code === 'P2002') {
    return res.status(409).json({ error: true, message: 'Resource already exists.', status: 409 });
  }
  if (err.code === 'P2003') {
    return res.status(400).json({ error: true, message: 'Related resource not found.', status: 400 });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: true, message: 'Resource not found.', status: 404 });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: true, message: 'Invalid token.', status: 401 });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: true, message: 'Token has expired.', status: 401 });
  }

  // Custom error classes (AuthError, CheckoutError)
  const statusCode = err.statusCode || 500;
  const message = (process.env.NODE_ENV === 'production' && statusCode === 500)
    ? 'Internal Server Error'
    : err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error('🔥 Error:', err.message, err.stack);
  } else {
    console.error('🔥 Error:', err.message);
  }

  res.status(statusCode).json({ error: true, message, status: statusCode });
});

export default app;

import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins & methods
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-cart-id'],
  })
);

// Body parser middleware
app.use(express.json());

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    message: 'Nexora Backend API is running',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      cart: '/api/cart',
    },
  });
});

// Mount Feature Routers
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);


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
  console.error('🔥 Central Error Handler:', err.message || err);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: true,
    message,
    status: statusCode,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

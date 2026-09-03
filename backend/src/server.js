import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins & methods
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'Nexora Backend API is running with Neon PostgreSQL & Prisma!' });
});

// Mount Feature Routers
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Fallback Route (404 for unknown endpoints)
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('🔥 Central Error Handler:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ message });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

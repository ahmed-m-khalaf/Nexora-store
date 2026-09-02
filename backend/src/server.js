import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

const app = express();
const PORT = 5000;

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
  res.send('Nexora Backend API is running! Hello from backend');
});

// Mount Feature Routers
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Fallback Route (404 for unknown endpoints)
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import { products } from '../data/products.js';

// GET /api/products
export const getAllProducts = (req, res) => {
  const { category } = req.query;

  if (category) {
    const filtered = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
    return res.status(200).json(filtered);
  }

  res.status(200).json(products);
};

// GET /api/products/:id
export const getProductById = (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(200).json(product);
};

// GET /api/products/category/:category
export const getProductsByCategory = (req, res) => {
  const { category } = req.params;
  const filtered = products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
  res.status(200).json(filtered);
};

// POST /api/products
export const createProduct = (req, res) => {
  const { title, price, category, description, image } = req.body;

  if (!title || !price) {
    return res.status(400).json({ message: 'Title and price are required' });
  }

  const maxId = products.length > 0 ? Math.max(...products.map((p) => p.id)) : 0;

  const newProduct = {
    id: maxId + 1,
    title,
    price: Number(price),
    description: description || '',
    category: category || 'general',
    image: image || ''
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
};

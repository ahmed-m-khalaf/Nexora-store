import { categories } from '../data/categories.js';

// GET /api/categories
export const getAllCategories = (req, res) => {
  res.status(200).json(categories);
};

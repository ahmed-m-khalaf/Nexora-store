import prisma from '../lib/prisma.js';

// GET /api/categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    // Map categories to array of names for frontend compatibility
    res.status(200).json(categories.map(c => c.name));
  } catch (error) {
    next(error);
  }
};

// GET /api/categories/:id
export const getCategoryById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true }
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

// POST /api/categories
export const createCategory = async (req, res, next) => {
  try {
    const { name, slug } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const generatedSlug = slug || name.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]/g, '-');

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug: generatedSlug
      }
    });

    res.status(201).json(newCategory);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Category name or slug already exists' });
    }
    next(error);
  }
};

// PATCH /api/categories/:id
export const updateCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const { name, slug } = req.body;

    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (slug) dataToUpdate.slug = slug;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: dataToUpdate
    });

    res.status(200).json(updatedCategory);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Category not found' });
    }
    next(error);
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    await prisma.category.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Category not found' });
    }
    next(error);
  }
};

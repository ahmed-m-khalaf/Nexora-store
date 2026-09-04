import prisma from '../lib/prisma.js';

// --- Helpers ---

// Format Prisma product output for frontend compatibility
const formatProduct = (p) => ({
  id: p.id,
  title: p.title,
  price: typeof p.price === 'object' ? parseFloat(p.price.toString()) : p.price,
  description: p.description,
  image: p.image,
  category: p.category ? p.category.name : '',
  categoryId: p.categoryId,
  rating: { rate: 4.5, count: 120 }, // Placeholder until ratings model is added
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
});

// Standardized error response
const errorResponse = (res, status, message) =>
  res.status(status).json({ error: true, message, status });

// Validate positive integer, returns parsed int or null
const parsePositiveInt = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const num = parseInt(value, 10);
  if (isNaN(num) || num < 1) return NaN;
  return num;
};

// --- Controllers ---

// GET /api/products
// Always returns { data: [...], pagination: {...} }
// Supports: ?search=shirt &category=electronics &categoryId=1 &sortBy=price &order=asc &page=1 &limit=12
export const getAllProducts = async (req, res, next) => {
  try {
    const { search, category, categoryId, sortBy, order, page, limit, minPrice, maxPrice } = req.query;

    // --- Validation ---
    const pageNum = parsePositiveInt(page) ?? 1;
    if (page !== undefined && isNaN(parsePositiveInt(page))) {
      return errorResponse(res, 400, 'Invalid "page" parameter. Must be a positive integer.');
    }

    let limitNum = parsePositiveInt(limit) ?? 12;
    if (limit !== undefined && isNaN(parsePositiveInt(limit))) {
      return errorResponse(res, 400, 'Invalid "limit" parameter. Must be a positive integer.');
    }
    if (limitNum > 100) limitNum = 100; // Cap limit

    if (categoryId !== undefined) {
      const parsedCatId = parsePositiveInt(categoryId);
      if (isNaN(parsedCatId)) {
        return errorResponse(res, 400, 'Invalid "categoryId" parameter. Must be a positive integer.');
      }
    }

    if (minPrice !== undefined && (isNaN(parseFloat(minPrice)) || parseFloat(minPrice) < 0)) {
      return errorResponse(res, 400, 'Invalid "minPrice" parameter. Must be a non-negative number.');
    }
    if (maxPrice !== undefined && (isNaN(parseFloat(maxPrice)) || parseFloat(maxPrice) < 0)) {
      return errorResponse(res, 400, 'Invalid "maxPrice" parameter. Must be a non-negative number.');
    }

    // --- Build Query ---
    const where = {};

    // 1. Search Filter (Title or Description)
    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    // 2. Category Filter (by CategoryId or Category Name)
    if (categoryId) {
      where.categoryId = parseInt(categoryId, 10);
    } else if (category && category !== 'all') {
      where.category = {
        name: { equals: category, mode: 'insensitive' },
      };
    }

    // 3. Price Range Filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = parseFloat(minPrice);
      if (maxPrice !== undefined) where.price.lte = parseFloat(maxPrice);
    }

    // 4. Sorting
    const validSortFields = ['id', 'title', 'price', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'id';
    const sortOrder = order?.toLowerCase() === 'desc' ? 'desc' : 'asc';
    const orderBy = { [sortField]: sortOrder };

    // 5. Pagination
    const skip = (pageNum - 1) * limitNum;

    // --- Execute Query ---
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        include: { category: true },
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    // --- Unified Response ---
    res.status(200).json({
      data: products.map(formatProduct),
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 1) {
      return errorResponse(res, 400, 'Invalid product ID. Must be a positive integer.');
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return errorResponse(res, 404, `Product with ID ${id} not found.`);
    }

    res.status(200).json(formatProduct(product));
  } catch (error) {
    next(error);
  }
};

// GET /api/products/category/:category
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const products = await prisma.product.findMany({
      where: {
        category: {
          name: { equals: category, mode: 'insensitive' },
        },
      },
      include: { category: true },
    });

    res.status(200).json({
      data: products.map(formatProduct),
      pagination: {
        total: products.length,
        page: 1,
        limit: products.length,
        totalPages: 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const { title, price, description, image, categoryId, category } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return errorResponse(res, 400, 'Title is required and must be a non-empty string.');
    }
    if (price === undefined || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return errorResponse(res, 400, 'Price is required and must be a non-negative number.');
    }

    let targetCategoryId = categoryId ? parseInt(categoryId, 10) : null;

    if (categoryId && (isNaN(targetCategoryId) || targetCategoryId < 1)) {
      return errorResponse(res, 400, 'Invalid categoryId. Must be a positive integer.');
    }

    // If category name provided instead of categoryId, find or create category
    if (!targetCategoryId && category) {
      const slug = category.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]/g, '-');
      let catObj = await prisma.category.findFirst({
        where: { name: { equals: category, mode: 'insensitive' } },
      });

      if (!catObj) {
        catObj = await prisma.category.create({
          data: { name: category, slug },
        });
      }
      targetCategoryId = catObj.id;
    }

    if (!targetCategoryId) {
      return errorResponse(res, 400, 'Category name or categoryId is required.');
    }

    const newProduct = await prisma.product.create({
      data: {
        title: title.trim(),
        price: parseFloat(price),
        description: description || '',
        image: image || '',
        categoryId: targetCategoryId,
      },
      include: { category: true },
    });

    res.status(201).json(formatProduct(newProduct));
  } catch (error) {
    if (error.code === 'P2003') {
      return errorResponse(res, 400, `Category with ID ${req.body.categoryId} does not exist.`);
    }
    next(error);
  }
};

// PATCH /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 1) {
      return errorResponse(res, 400, 'Invalid product ID. Must be a positive integer.');
    }

    const { title, price, description, image, categoryId } = req.body;

    if (price !== undefined && (isNaN(parseFloat(price)) || parseFloat(price) < 0)) {
      return errorResponse(res, 400, 'Price must be a non-negative number.');
    }
    if (categoryId !== undefined) {
      const parsedCatId = parseInt(categoryId, 10);
      if (isNaN(parsedCatId) || parsedCatId < 1) {
        return errorResponse(res, 400, 'Invalid categoryId. Must be a positive integer.');
      }
    }

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (price !== undefined) dataToUpdate.price = parseFloat(price);
    if (description !== undefined) dataToUpdate.description = description;
    if (image !== undefined) dataToUpdate.image = image;
    if (categoryId !== undefined) dataToUpdate.categoryId = parseInt(categoryId, 10);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
      include: { category: true },
    });

    res.status(200).json(formatProduct(updatedProduct));
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 404, `Product with ID ${req.params.id} not found.`);
    }
    next(error);
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 1) {
      return errorResponse(res, 400, 'Invalid product ID. Must be a positive integer.');
    }

    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 404, `Product with ID ${req.params.id} not found.`);
    }
    next(error);
  }
};

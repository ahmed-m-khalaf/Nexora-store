import prisma from '../lib/prisma.js';

// Helper function to format Prisma product output for frontend compatibility
const formatProduct = (p) => ({
  id: p.id,
  title: p.title,
  price: p.price,
  description: p.description,
  image: p.image,
  category: p.category ? p.category.name : '',
  categoryId: p.categoryId,
  rating: { rate: 4.5, count: 120 }, // Added for backward compatibility with frontend
  createdAt: p.createdAt,
  updatedAt: p.updatedAt
});

// GET /api/products
// Supports: ?search=shirt & ?category=electronics & ?sortBy=price & ?order=asc & ?page=1 & ?limit=10
export const getAllProducts = async (req, res, next) => {
  try {
    const { search, category, categoryId, sortBy = 'id', order = 'asc', page, limit } = req.query;

    const where = {};

    // 1. Search Filter (Title or Description)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // 2. Category Filter (by Category Name or CategoryId)
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    } else if (category) {
      where.category = {
        name: { equals: category, mode: 'insensitive' }
      };
    }

    // 3. Sorting
    const orderBy = {};
    const validSortFields = ['id', 'title', 'price', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'id';
    const sortOrder = order.toLowerCase() === 'desc' ? 'desc' : 'asc';
    orderBy[sortField] = sortOrder;

    // 4. Pagination
    const isPaginated = page !== undefined || limit !== undefined;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const queryOptions = {
      where,
      orderBy,
      include: { category: true }
    };

    if (isPaginated) {
      queryOptions.skip = skip;
      queryOptions.take = limitNum;
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany(queryOptions),
      prisma.product.count({ where })
    ]);

    const formattedProducts = products.map(formatProduct);

    if (isPaginated) {
      return res.status(200).json({
        data: formattedProducts,
        pagination: {
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      });
    }

    res.status(200).json(formattedProducts);
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
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
          name: { equals: category, mode: 'insensitive' }
        }
      },
      include: { category: true }
    });

    res.status(200).json(products.map(formatProduct));
  } catch (error) {
    next(error);
  }
};

// POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const { title, price, description, image, categoryId, category } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({ message: 'Title and price are required' });
    }

    let targetCategoryId = categoryId ? parseInt(categoryId) : null;

    // If category name provided instead of categoryId, find or create category
    if (!targetCategoryId && category) {
      const slug = category.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]/g, '-');
      let catObj = await prisma.category.findFirst({
        where: { name: { equals: category, mode: 'insensitive' } }
      });

      if (!catObj) {
        catObj = await prisma.category.create({
          data: { name: category, slug }
        });
      }
      targetCategoryId = catObj.id;
    }

    if (!targetCategoryId) {
      return res.status(400).json({ message: 'Category name or categoryId is required' });
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        price: parseFloat(price),
        description: description || '',
        image: image || '',
        categoryId: targetCategoryId
      },
      include: { category: true }
    });

    res.status(201).json(formatProduct(newProduct));
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({ message: `Category with ID ${req.body.categoryId} does not exist` });
    }
    next(error);
  }

};

// PATCH /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const { title, price, description, image, categoryId } = req.body;

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (price !== undefined) dataToUpdate.price = parseFloat(price);
    if (description !== undefined) dataToUpdate.description = description;
    if (image !== undefined) dataToUpdate.image = image;
    if (categoryId !== undefined) dataToUpdate.categoryId = parseInt(categoryId);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
      include: { category: true }
    });

    res.status(200).json(formatProduct(updatedProduct));
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Product not found' });
    }
    next(error);
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    await prisma.product.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Product not found' });
    }
    next(error);
  }
};

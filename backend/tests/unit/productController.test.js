import { vi, expect, test, beforeEach } from 'vitest';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../src/controllers/productController.js';
import * as prismaModule from '../../src/lib/prisma.js';

// Get the mocked prisma from the module
const prisma = prismaModule.prisma || prismaModule.default;

// Mock request and response objects
const mockReq = (params = {}, query = {}, body = {}) => ({
  params,
  query,
  body,
});

const mockRes = () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res;
};

beforeEach(() => {
  vi.clearAllMocks();
});

// --- getAllProducts Tests ---

test('getAllProducts - returns 200 with products on success', async () => {
  const req = mockReq({}, { page: '1', limit: '10' });
  const res = mockRes();
  
  // Mock prisma responses
  prisma.product.findMany.mockResolvedValue([
    { id: 1, title: 'Test Product', price: 29.99, description: '', image: '', categoryId: 1, category: { name: 'Electronics' }, createdAt: new Date(), updatedAt: new Date() },
  ]);
  prisma.product.count.mockResolvedValue(1);

  await getAllProducts(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    data: expect.any(Array),
    pagination: expect.objectContaining({
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    }),
  });
  expect(res.json.mock.calls[0][0].data[0]).toHaveProperty('id');
  expect(res.json.mock.calls[0][0].data[0]).toHaveProperty('title');
  expect(res.json.mock.calls[0][0].data[0]).toHaveProperty('price');
});

test('getAllProducts - returns 400 for invalid page (page=-1)', async () => {
  const req = mockReq({}, { page: '-1' });
  const res = mockRes();

  await getAllProducts(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: true,
    message: 'Invalid "page" parameter. Must be a positive integer.',
    status: 400,
  });
});

test('getAllProducts - returns 400 for invalid limit (limit=0)', async () => {
  const req = mockReq({}, { limit: '0' });
  const res = mockRes();

  await getAllProducts(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: true,
    message: 'Invalid "limit" parameter. Must be a positive integer.',
    status: 400,
  });
});

test('getAllProducts - returns 400 for invalid categoryId (categoryId=abc)', async () => {
  const req = mockReq({}, { categoryId: 'abc' });
  const res = mockRes();

  await getAllProducts(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: true,
    message: 'Invalid "categoryId" parameter. Must be a positive integer.',
    status: 400,
  });
});

// --- getProductById Tests ---

test('getProductById - returns 200 with product on success', async () => {
  const req = mockReq({ id: '1' });
  const res = mockRes();

  prisma.product.findUnique.mockResolvedValue({
    id: 1,
    title: 'Test Product',
    price: 29.99,
    description: '',
    image: '',
    categoryId: 1,
    category: { name: 'Electronics' },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await getProductById(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    id: 1,
    title: 'Test Product',
    price: 29.99,
    description: '',
    image: '',
    category: 'Electronics',
    categoryId: 1,
    rating: { rate: 4.5, count: 120 },
    createdAt: expect.anything(),
    updatedAt: expect.anything(),
  });
});

test('getProductById - returns 400 for non-numeric id', async () => {
  const req = mockReq({ id: 'abc' });
  const res = mockRes();

  await getProductById(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: true,
    message: 'Invalid product ID. Must be a positive integer.',
    status: 400,
  });
});

test('getProductById - returns 404 for null product', async () => {
  const req = mockReq({ id: '999' });
  const res = mockRes();

  prisma.product.findUnique.mockResolvedValue(null);

  await getProductById(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    error: true,
    message: 'Product with ID 999 not found.',
    status: 404,
  });
});

// --- createProduct Tests ---

test('createProduct - returns 201 with created product on success', async () => {
  const req = mockReq({}, {}, {
    title: 'New Product',
    price: 49.99,
    description: 'A new product',
    image: '',
    categoryId: 1,
  });
  const res = mockRes();

  prisma.product.create.mockResolvedValue({
    id: 2,
    title: 'New Product',
    price: 49.99,
    description: 'A new product',
    image: '',
    categoryId: 1,
    category: { name: 'Electronics' },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await createProduct(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({
    id: 2,
    title: 'New Product',
    price: 49.99,
    description: 'A new product',
    image: '',
    category: 'Electronics',
    categoryId: 1,
    rating: { rate: 4.5, count: 120 },
    createdAt: expect.anything(),
    updatedAt: expect.anything(),
  });
});

test('createProduct - returns 400 for missing title', async () => {
  const req = mockReq({}, {}, {
    price: 49.99,
    description: 'A new product',
    categoryId: 1,
  });
  const res = mockRes();

  await createProduct(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: true,
    message: 'Title is required and must be a non-empty string.',
    status: 400,
  });
});

test('createProduct - returns 400 for negative price', async () => {
  const req = mockReq({}, {}, {
    title: 'New Product',
    price: -10,
    description: 'A new product',
    categoryId: 1,
  });
  const res = mockRes();

  await createProduct(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: true,
    message: 'Price is required and must be a non-negative number.',
    status: 400,
  });
});

test('createProduct - returns 400 for P2003 error (invalid categoryId)', async () => {
  const req = mockReq({}, {}, {
    title: 'New Product',
    price: 49.99,
    description: 'A new product',
    categoryId: 999,
  });
  const res = mockRes();

  // Simulate Prisma P2003 error
  const error = new Error('Foreign key constraint failed');
  error.code = 'P2003';
  prisma.product.create.mockRejectedValue(error);

  await createProduct(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: true,
    message: 'Category with ID 999 does not exist.',
    status: 400,
  });
});

// --- updateProduct Tests ---

test('updateProduct - returns 200 with updated product on success', async () => {
  const req = mockReq({ id: '1' }, {}, {
    title: 'Updated Product',
    price: 59.99,
  });
  const res = mockRes();

  prisma.product.update.mockResolvedValue({
    id: 1,
    title: 'Updated Product',
    price: 59.99,
    description: '',
    image: '',
    categoryId: 1,
    category: { name: 'Electronics' },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await updateProduct(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    id: 1,
    title: 'Updated Product',
    price: 59.99,
    description: '',
    image: '',
    category: 'Electronics',
    categoryId: 1,
    rating: { rate: 4.5, count: 120 },
    createdAt: expect.anything(),
    updatedAt: expect.anything(),
  });
});

test('updateProduct - returns 404 for P2025 error (product not found)', async () => {
  const req = mockReq({ id: '999' }, {}, {
    title: 'Updated Product',
  });
  const res = mockRes();

  // Simulate Prisma P2025 error
  const error = new Error('Record to update not found');
  error.code = 'P2025';
  prisma.product.update.mockRejectedValue(error);

  await updateProduct(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    error: true,
    message: 'Product with ID 999 not found.',
    status: 404,
  });
});

// --- deleteProduct Tests ---

test('deleteProduct - returns 200 on successful deletion', async () => {
  const req = mockReq({ id: '1' });
  const res = mockRes();

  prisma.product.delete.mockResolvedValue({ id: 1 });

  await deleteProduct(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: 'Product deleted successfully.',
  });
});

test('deleteProduct - returns 404 for P2025 error (product not found)', async () => {
  const req = mockReq({ id: '999' });
  const res = mockRes();

  // Simulate Prisma P2025 error
  const error = new Error('Record to delete not found');
  error.code = 'P2025';
  prisma.product.delete.mockRejectedValue(error);

  await deleteProduct(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    error: true,
    message: 'Product with ID 999 not found.',
    status: 404,
  });
});

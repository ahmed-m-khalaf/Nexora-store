import { vi } from 'vitest';

// Helper to create a proper mock function that works with vitest
const createMockFunction = () => {
  const fn = vi.fn();
  
  // Ensure mockResolvedValue is available
  if (typeof fn.mockResolvedValue !== 'function') {
    fn.mockResolvedValue = (val) => {
      fn.mockImplementation(() => Promise.resolve(val));
      return fn;
    };
    fn.mockRejectedValue = (err) => {
      fn.mockImplementation(() => Promise.reject(err));
      return fn;
    };
    fn.mockReturnThis = () => {
      fn.mockImplementation(function() { return this; });
      return fn;
    };
  }
  
  return fn;
};

vi.mock('../../src/lib/prisma.js', () => {
  const mockProduct = {
    findMany: createMockFunction(),
    findUnique: createMockFunction(),
    count: createMockFunction(),
    create: createMockFunction(),
    update: createMockFunction(),
    updateMany: createMockFunction(),
    delete: createMockFunction(),
  };

  const mockCategory = {
    findMany: createMockFunction(),
    findUnique: createMockFunction(),
    create: createMockFunction(),
    update: createMockFunction(),
    delete: createMockFunction(),
  };

  const mockCart = {
    findUnique: createMockFunction(),
    create: createMockFunction(),
  };

  const mockCartItem = {
    upsert: createMockFunction(),
    update: createMockFunction(),
    deleteMany: createMockFunction(),
    findUnique: createMockFunction(),
  };

  const mockOrder = {
    create: createMockFunction(),
  };

  const mockPrisma = {
    product: mockProduct,
    category: mockCategory,
    cart: mockCart,
    cartItem: mockCartItem,
    order: mockOrder,
    $transaction: createMockFunction(),
  };

  return {
    prisma: mockPrisma,
    default: mockPrisma,
  };
});

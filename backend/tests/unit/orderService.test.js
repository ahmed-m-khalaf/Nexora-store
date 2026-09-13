import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';
import prisma from '../../src/lib/prisma.js';
import {
  calculateOrderTotals,
  checkoutCart,
  getCustomerDetails,
} from '../../src/services/orderService.js';

const customer = {
  customerName: '  Ahmed Khalaf ',
  customerEmail: ' AHMED@example.com ',
  customerPhone: '01000000000',
  shippingAddress: 'Cairo, Egypt',
};

const createTransactionClient = () => ({
  cart: { findUnique: vi.fn() },
  product: { updateMany: vi.fn() },
  order: { create: vi.fn() },
  cartItem: { deleteMany: vi.fn() },
});

const createCart = (overrides = {}) => ({
  id: 'cart-1',
  items: [{
    id: 1,
    productId: 7,
    quantity: 2,
    product: {
      id: 7,
      title: 'Wireless Headphones',
      price: new Prisma.Decimal('20.00'),
    },
  }],
  ...overrides,
});

const createOrder = (overrides = {}) => ({
  id: 'order-1',
  status: 'PENDING',
  customerName: 'Ahmed Khalaf',
  customerEmail: 'ahmed@example.com',
  customerPhone: '01000000000',
  shippingAddress: 'Cairo, Egypt',
  subtotal: new Prisma.Decimal('40.00'),
  tax: new Prisma.Decimal('4.00'),
  shipping: new Prisma.Decimal('10.00'),
  total: new Prisma.Decimal('54.00'),
  createdAt: new Date('2026-09-12T10:00:00.000Z'),
  items: [{
    id: 1,
    productId: 7,
    title: 'Wireless Headphones',
    unitPrice: new Prisma.Decimal('20.00'),
    quantity: 2,
    lineTotal: new Prisma.Decimal('40.00'),
  }],
  ...overrides,
});

describe('order service', () => {
  let tx;

  beforeEach(() => {
    vi.clearAllMocks();
    tx = createTransactionClient();
    tx.cart.findUnique.mockResolvedValue(createCart());
    tx.product.updateMany.mockResolvedValue({ count: 1 });
    tx.order.create.mockResolvedValue(createOrder());
    tx.cartItem.deleteMany.mockResolvedValue({ count: 1 });
    prisma.$transaction.mockImplementation((callback) => callback(tx));
  });

  it('normalizes customer fields and validates the email', () => {
    expect(getCustomerDetails(customer)).toEqual({
      customerName: 'Ahmed Khalaf',
      customerEmail: 'ahmed@example.com',
      customerPhone: '01000000000',
      shippingAddress: 'Cairo, Egypt',
    });
  });

  it('calculates tax and shipping with Decimal-safe money rules', () => {
    const totals = calculateOrderTotals([
      { lineTotal: new Prisma.Decimal('99.99') },
    ]);

    expect(totals.subtotal.toString()).toBe('99.99');
    expect(totals.tax.toString()).toBe('10');
    expect(totals.shipping.toString()).toBe('10');
    expect(totals.total.toString()).toBe('119.99');
  });

  it('uses database cart prices, creates an order, and clears the cart atomically', async () => {
    const result = await checkoutCart({
      cartId: ' cart-1 ',
      customer,
      db: prisma,
    });

    expect(result.total).toBe(54);
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(tx.product.updateMany).toHaveBeenCalledWith({
      where: { id: 7, stock: { gte: 2 } },
      data: { stock: { decrement: 2 } },
    });
    expect(tx.order.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        subtotal: new Prisma.Decimal('40'),
        total: new Prisma.Decimal('54'),
        items: { create: [expect.objectContaining({ unitPrice: new Prisma.Decimal('20') })] },
      }),
    }));
    expect(tx.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: 'cart-1' } });
  });

  it('rejects missing cart IDs and invalid customer input before opening a transaction', async () => {
    await expect(checkoutCart({ cartId: '', customer, db: prisma })).rejects.toMatchObject({
      statusCode: 400,
    });
    await expect(checkoutCart({
      cartId: 'cart-1',
      customer: { ...customer, customerEmail: 'invalid' },
      db: prisma,
    })).rejects.toMatchObject({ statusCode: 400 });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('keeps the cart untouched when stock is insufficient', async () => {
    tx.product.updateMany.mockResolvedValue({ count: 0 });

    await expect(checkoutCart({ cartId: 'cart-1', customer, db: prisma })).rejects.toMatchObject({
      statusCode: 409,
      message: expect.stringContaining('stock'),
    });
    expect(tx.order.create).not.toHaveBeenCalled();
    expect(tx.cartItem.deleteMany).not.toHaveBeenCalled();
  });

  it('retries serializable conflicts and maps a final conflict to HTTP 409', async () => {
    const conflict = Object.assign(new Error('serialization failure'), { code: 'P2034' });
    prisma.$transaction
      .mockRejectedValueOnce(conflict)
      .mockImplementationOnce((callback) => callback(tx));

    await expect(checkoutCart({ cartId: 'cart-1', customer, db: prisma })).resolves.toMatchObject({
      id: 'order-1',
    });
    expect(prisma.$transaction).toHaveBeenCalledTimes(2);
  });
});

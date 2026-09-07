/**
 * Order checkout integration tests for Nexora Backend
 * Run: node backend/tests/order.test.js
 * Requires backend server running on http://localhost:5000
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  PASS ${name}`);
    passed++;
  } catch (err) {
    console.log(`  FAIL ${name}`);
    console.log(`       Error: ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

async function requestJSON(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  return { status: res.status, data };
}

const customer = {
  customerName: 'Ahmed Khalaf',
  customerEmail: 'ahmed@example.com',
  customerPhone: '01000000000',
  shippingAddress: 'Cairo, Egypt',
};

function expectedTotals(price, quantity) {
  const subtotal = Number((price * quantity).toFixed(2));
  const tax = Number((subtotal * 0.10).toFixed(2));
  const shipping = subtotal > 0 && subtotal < 100 ? 10 : 0;
  const total = Number((subtotal + tax + shipping).toFixed(2));
  return { subtotal, tax, shipping, total };
}

async function createTestProduct(runId, suffix, data = {}) {
  return prisma.product.create({
    data: {
      title: `Checkout Test Product ${runId} ${suffix}`,
      price: data.price ?? 20,
      description: 'Temporary product created by order integration tests.',
      image: 'https://example.com/test-product.png',
      stock: data.stock ?? 5,
      categoryId: data.categoryId,
    },
  });
}

async function cleanup(runId, cartIds, categoryId) {
  const orders = await prisma.order.findMany({
    where: { cartId: { in: cartIds } },
    select: { id: true },
  });
  const orderIds = orders.map((order) => order.id);

  if (orderIds.length > 0) {
    await prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
    await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
  }

  await prisma.cartItem.deleteMany({ where: { cartId: { in: cartIds } } });
  await prisma.cart.deleteMany({ where: { id: { in: cartIds } } });
  await prisma.product.deleteMany({
    where: { title: { startsWith: `Checkout Test Product ${runId}` } },
  });

  if (categoryId) {
    await prisma.category.deleteMany({ where: { id: categoryId } });
  }
}

async function runOrderTests() {
  console.log('\nNexora Order Checkout Tests\n');

  const runId = `${Date.now()}`;
  const cartIds = [
    `order_success_${runId}`,
    `order_empty_${runId}`,
    `order_stock_${runId}`,
    `order_missing_${runId}`,
    `order_invalid_email_${runId}`,
    `order_unknown_${runId}`,
  ];

  let category;
  let product;
  let lowStockProduct;

  try {
    category = await prisma.category.create({
      data: {
        name: `Checkout Test Category ${runId}`,
        slug: `checkout-test-category-${runId}`,
      },
    });

    product = await createTestProduct(runId, 'success', {
      categoryId: category.id,
      price: 20,
      stock: 5,
    });

    lowStockProduct = await createTestProduct(runId, 'low-stock', {
      categoryId: category.id,
      price: 15,
      stock: 1,
    });

    await test('GET /orders/checkout is rejected because checkout must be POST', async () => {
      const { status, data } = await requestJSON('/orders/checkout');
      assert(status === 404, `Expected 404, got ${status}`);
      assert(data.error === true, 'should return error: true');
    });

    await test('POST /orders/checkout rejects missing x-cart-id header', async () => {
      const { status, data } = await requestJSON('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(customer),
      });
      assert(status === 400, `Expected 400, got ${status}`);
      assert(data.message.includes('x-cart-id'), 'message should mention x-cart-id');
    });

    await test('POST /orders/checkout rejects invalid email before creating an order', async () => {
      const { status, data } = await requestJSON('/orders/checkout', {
        method: 'POST',
        headers: { 'x-cart-id': cartIds[4] },
        body: JSON.stringify({ ...customer, customerEmail: 'not-an-email' }),
      });
      assert(status === 400, `Expected 400, got ${status}`);
      assert(data.message.toLowerCase().includes('email'), 'message should mention email');
    });

    await test('POST /orders/checkout rejects missing customer fields', async () => {
      const { status, data } = await requestJSON('/orders/checkout', {
        method: 'POST',
        headers: { 'x-cart-id': cartIds[3] },
        body: JSON.stringify({ ...customer, shippingAddress: '' }),
      });
      assert(status === 400, `Expected 400, got ${status}`);
      assert(data.message.toLowerCase().includes('required'), 'message should mention required fields');
    });

    await test('POST /orders/checkout rejects an unknown cart', async () => {
      const { status, data } = await requestJSON('/orders/checkout', {
        method: 'POST',
        headers: { 'x-cart-id': cartIds[5] },
        body: JSON.stringify(customer),
      });
      assert(status === 404, `Expected 404, got ${status}`);
      assert(data.message.toLowerCase().includes('cart'), 'message should mention cart');
    });

    await test('POST /orders/checkout rejects an empty cart', async () => {
      await requestJSON('/cart', { headers: { 'x-cart-id': cartIds[1] } });

      const { status, data } = await requestJSON('/orders/checkout', {
        method: 'POST',
        headers: { 'x-cart-id': cartIds[1] },
        body: JSON.stringify(customer),
      });

      assert(status === 400, `Expected 400, got ${status}`);
      assert(data.message.toLowerCase().includes('empty'), 'message should mention empty cart');
    });

    await test('POST /orders/checkout creates an order, deducts stock, and clears cart', async () => {
      const quantity = 2;
      await requestJSON('/cart/items', {
        method: 'POST',
        headers: { 'x-cart-id': cartIds[0] },
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      const { status, data } = await requestJSON('/orders/checkout', {
        method: 'POST',
        headers: { 'x-cart-id': cartIds[0] },
        body: JSON.stringify({
          ...customer,
          productId: 999999,
          quantity: 999999,
          subtotal: 0,
          total: 0,
        }),
      });

      const totals = expectedTotals(20, quantity);
      assert(status === 201, `Expected 201, got ${status}`);
      assert(typeof data.id === 'string' && data.id.length > 0, 'order should have an id');
      assert(data.status === 'PENDING', 'new order should start as PENDING');
      assert(data.customer.email === customer.customerEmail, 'customer email should be returned');
      assert(data.items.length === 1, 'order should contain one line item');
      assert(data.items[0].productId === product.id, 'order item should use product from cart');
      assert(data.items[0].quantity === quantity, 'order item quantity should match cart');
      assert(data.items[0].unitPrice === 20, 'order item price should come from database');
      assert(data.items[0].lineTotal === totals.subtotal, 'line total should be calculated server-side');
      assert(data.subtotal === totals.subtotal, `Expected subtotal ${totals.subtotal}, got ${data.subtotal}`);
      assert(data.tax === totals.tax, `Expected tax ${totals.tax}, got ${data.tax}`);
      assert(data.shipping === totals.shipping, `Expected shipping ${totals.shipping}, got ${data.shipping}`);
      assert(data.total === totals.total, `Expected total ${totals.total}, got ${data.total}`);

      const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });
      assert(updatedProduct.stock === 3, `Expected stock 3, got ${updatedProduct.stock}`);

      const cartAfterCheckout = await prisma.cartItem.findMany({ where: { cartId: cartIds[0] } });
      assert(cartAfterCheckout.length === 0, 'cart should be empty after checkout');

      const persistedOrder = await prisma.order.findUnique({
        where: { id: data.id },
        include: { items: true },
      });
      assert(persistedOrder !== null, 'order should be persisted');
      assert(persistedOrder.items.length === 1, 'persisted order should include items');
    });

    await test('POST /orders/checkout rejects insufficient stock without clearing cart', async () => {
      await requestJSON('/cart/items', {
        method: 'POST',
        headers: { 'x-cart-id': cartIds[2] },
        body: JSON.stringify({ productId: lowStockProduct.id, quantity: 2 }),
      });

      const { status, data } = await requestJSON('/orders/checkout', {
        method: 'POST',
        headers: { 'x-cart-id': cartIds[2] },
        body: JSON.stringify(customer),
      });

      assert(status === 409, `Expected 409, got ${status}`);
      assert(data.message.toLowerCase().includes('stock'), 'message should mention stock');

      const unchangedProduct = await prisma.product.findUnique({ where: { id: lowStockProduct.id } });
      assert(unchangedProduct.stock === 1, `Expected stock to stay 1, got ${unchangedProduct.stock}`);

      const cartItems = await prisma.cartItem.findMany({ where: { cartId: cartIds[2] } });
      assert(cartItems.length === 1, 'cart item should remain after failed checkout');
      assert(cartItems[0].quantity === 2, 'cart quantity should remain after failed checkout');
    });
  } finally {
    await cleanup(runId, cartIds, category?.id);
    await prisma.$disconnect();
  }

  console.log(`\n${'-'.repeat(40)}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}`);
  console.log(`${'-'.repeat(40)}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runOrderTests();

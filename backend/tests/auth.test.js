/**
 * Phase 8 authentication and ownership tests.
 * Run with the backend server running, or through npm run test:all.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';
const runId = `${Date.now()}`;
const emailOne = `phase8-${runId}-one@example.com`;
const emailTwo = `phase8-${runId}-two@example.com`;

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  PASS ${name}`);
    passed++;
  } catch (error) {
    console.log(`  FAIL ${name}`);
    console.log(`       Error: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

async function requestJSON(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  return { status: response.status, data: await response.json() };
}

const bearer = (token) => ({ Authorization: `Bearer ${token}` });

async function runTests() {
  console.log('\nNexora Phase 8 Auth & Ownership Tests\n');

  let category;
  let product;
  let userOne;
  let userTwo;
  let orderId;
  const guestCartId = `phase8_guest_${runId}`;

  try {
    category = await prisma.category.create({
      data: { name: `Phase 8 Category ${runId}`, slug: `phase-8-category-${runId}` },
    });
    product = await prisma.product.create({
      data: {
        title: `Phase 8 Product ${runId}`,
        price: 12.50,
        description: 'Temporary Phase 8 auth test product.',
        image: 'https://example.com/phase8.png',
        stock: 3,
        categoryId: category.id,
      },
    });

    await test('register migrates the guest cart and never returns passwordHash', async () => {
      await requestJSON('/cart', { headers: { 'x-cart-id': guestCartId } });
      await requestJSON('/cart/items', {
        method: 'POST',
        headers: { 'x-cart-id': guestCartId },
        body: JSON.stringify({ productId: product.id, quantity: 2 }),
      });

      const result = await requestJSON('/auth/register', {
        method: 'POST',
        headers: { 'x-cart-id': guestCartId },
        body: JSON.stringify({ name: 'Phase 8 User', email: emailOne, password: 'Password123!' }),
      });

      assert(result.status === 201, `Expected 201, got ${result.status}`);
      assert(typeof result.data.token === 'string', 'register should return a JWT');
      assert(!('passwordHash' in result.data.user), 'passwordHash must not appear in response');
      assert(result.data.user.cartId !== guestCartId, 'user must receive an owned cart');
      userOne = result.data.user;

      const cart = await requestJSON('/cart', {
        headers: { ...bearer(result.data.token), 'x-cart-id': guestCartId },
      });
      assert(cart.status === 200, `Expected 200, got ${cart.status}`);
      assert(cart.data.items.length === 1, 'guest item should migrate to user cart');
      assert(cart.data.items[0].quantity === 2, 'migrated quantity should be preserved');
    });

    await test('invalid JWT returns 401', async () => {
      const result = await requestJSON('/auth/me', { headers: bearer('invalid-token') });
      assert(result.status === 401, `Expected 401, got ${result.status}`);
    });

    await test('a second user cannot read the first user cart by changing x-cart-id', async () => {
      const result = await requestJSON('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: 'Second Phase 8 User', email: emailTwo, password: 'Password123!' }),
      });
      assert(result.status === 201, `Expected 201, got ${result.status}`);
      userTwo = result.data.user;
      assert(userTwo.cartId !== userOne.cartId, 'users must have different carts');

      const cart = await requestJSON('/cart', {
        headers: { ...bearer(result.data.token), 'x-cart-id': userOne.cartId },
      });
      assert(cart.status === 200, `Expected 200, got ${cart.status}`);
      assert(cart.data.id === userTwo.cartId, 'authenticated cart must be resolved from req.user');
      assert(cart.data.items.length === 0, 'second user must not see first user items');
    });

    await test('a guest cannot access an authenticated user cart by UUID', async () => {
      const cart = await requestJSON('/cart', { headers: { 'x-cart-id': userOne.cartId } });
      assert(cart.status === 403, `Expected 403, got ${cart.status}`);
    });

    await test('authenticated checkout uses the owned cart without trusting x-cart-id', async () => {
      const login = await requestJSON('/auth/login', {
        method: 'POST',
        headers: { 'x-cart-id': guestCartId },
        body: JSON.stringify({ email: emailOne, password: 'Password123!' }),
      });
      assert(login.status === 200, `Expected 200, got ${login.status}`);

      const result = await requestJSON('/orders/checkout', {
        method: 'POST',
        headers: { ...bearer(login.data.token), 'x-cart-id': userTwo.cartId },
        body: JSON.stringify({
          customerName: 'Phase 8 User',
          customerEmail: emailOne,
          customerPhone: '01000000000',
          shippingAddress: 'Cairo, Egypt',
        }),
      });
      assert(result.status === 201, `Expected 201, got ${result.status}`);
      orderId = result.data.id;

      const persisted = await prisma.order.findUnique({ where: { id: orderId } });
      assert(persisted.userId === userOne.id, 'order must be owned by authenticated user');
    });
  } finally {
    if (orderId) {
      await prisma.orderItem.deleteMany({ where: { orderId } });
      await prisma.order.delete({ where: { id: orderId } }).catch(() => {});
    }
    if (product) {
      await prisma.product.update({ where: { id: product.id }, data: { stock: 3 } }).catch(() => {});
    }
    if (userOne) await prisma.user.delete({ where: { id: userOne.id } }).catch(() => {});
    if (userTwo) await prisma.user.delete({ where: { id: userTwo.id } }).catch(() => {});
    await prisma.cart.deleteMany({ where: { id: guestCartId } }).catch(() => {});
    if (product) await prisma.product.delete({ where: { id: product.id } }).catch(() => {});
    if (category) await prisma.category.delete({ where: { id: category.id } }).catch(() => {});
    await prisma.$disconnect();
  }

  console.log(`\n${'-'.repeat(40)}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`${'-'.repeat(40)}\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();

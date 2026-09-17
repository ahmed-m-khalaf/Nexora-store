/**
 * Phase 9 Security & Validation Tests for Nexora Backend
 * Run with the backend server running, or through npm run test:all.
 */

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

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
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  return { status: response.status, headers: response.headers, data };
}

async function runSecurityTests() {
  console.log('\n🔒 Nexora Phase 9 Security & Validation Tests\n');

  // 1. Security Headers (Helmet)
  await test('Helmet security headers are present', async () => {
    const res = await fetch(`${BASE_URL}/products`);
    assert(res.headers.get('x-content-type-options') === 'nosniff', 'Missing X-Content-Type-Options: nosniff');
    assert(res.headers.get('x-frame-options') === 'SAMEORIGIN', 'Missing X-Frame-Options: SAMEORIGIN');
  });

  // 2. Body Size Limit (> 16kb payload rejected with 413)
  await test('Payload > 16KB is rejected with 413 Payload Too Large', async () => {
    const largeName = 'A'.repeat(20 * 1024); // 20KB
    const { status } = await requestJSON('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: largeName, email: 'test@example.com', password: 'Password123!' }),
    });
    assert(status === 413, `Expected 413, got ${status}`);
  });

  // 3. Product Validation Rules
  await test('GET /products with invalid sortBy rejects with 400', async () => {
    const { status, data } = await requestJSON('/products?sortBy=invalid_column');
    assert(status === 400, `Expected 400, got ${status}`);
    assert(data.error === true, 'should return error: true');
  });

  await test('GET /products with negative minPrice rejects with 400', async () => {
    const { status, data } = await requestJSON('/products?minPrice=-10');
    assert(status === 400, `Expected 400, got ${status}`);
    assert(data.error === true, 'should return error: true');
  });

  await test('GET /products with limit > 100 rejects with 400', async () => {
    const { status, data } = await requestJSON('/products?limit=150');
    assert(status === 400, `Expected 400, got ${status}`);
    assert(data.error === true, 'should return error: true');
  });

  // 4. Cart Validation Rules
  await test('POST /cart/items with non-integer productId rejects with 400', async () => {
    const { status, data } = await requestJSON('/cart/items', {
      method: 'POST',
      headers: { 'x-cart-id': 'sec_test_cart' },
      body: JSON.stringify({ productId: 'invalid', quantity: 1 }),
    });
    assert(status === 400, `Expected 400, got ${status}`);
    assert(data.error === true, 'should return error: true');
  });

  // 5. Auth Validation & Sanitization
  await test('POST /auth/register with short password rejects with 400', async () => {
    const { status, data } = await requestJSON('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Valid User', email: 'valid@example.com', password: '123' }),
    });
    assert(status === 400, `Expected 400, got ${status}`);
    assert(data.error === true, 'should return error: true');
  });

  await test('POST /auth/login with empty password rejects with 400', async () => {
    const { status, data } = await requestJSON('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'valid@example.com', password: '' }),
    });
    assert(status === 400, `Expected 400, got ${status}`);
    assert(data.error === true, 'should return error: true');
  });

  // 6. Centralized Error Handler format
  await test('Centralized error handler returns unified schema', async () => {
    const { status, data } = await requestJSON('/products/99999999');
    assert(status === 404, `Expected 404, got ${status}`);
    assert(data.error === true, 'error field must be true');
    assert(typeof data.message === 'string', 'message must be string');
    assert(data.status === 404, 'status must match HTTP code');
  });

  console.log(`\n${'-'.repeat(40)}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`${'-'.repeat(40)}\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runSecurityTests();

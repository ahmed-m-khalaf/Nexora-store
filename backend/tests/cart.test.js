/**
 * Cart API Integration Tests for Nexora Backend
 * Run: node backend/tests/cart.test.js
 * Requires backend server running on http://localhost:5000
 */

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ${name}`);
    console.log(`     Error: ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

async function requestJSON(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  return { status: res.status, data };
}

async function runCartTests() {
  console.log('\n🛒 Nexora Cart API Tests\n');

  const cartId1 = `test_cart_${Date.now()}_1`;
  const cartId2 = `test_cart_${Date.now()}_2`;

  // 1. GET /cart creates a new cart
  await test('GET /cart creates/returns empty cart structure', async () => {
    const { status, data } = await requestJSON(`${BASE_URL}/cart`, {
      headers: { 'x-cart-id': cartId1 },
    });
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.id === cartId1, `Cart ID should match header (${cartId1})`);
    assert(Array.isArray(data.items), 'items should be an array');
    assert(data.items.length === 0, 'new cart should have 0 items');
    assert(data.subtotal === 0, 'subtotal should be 0');
    assert(data.tax === 0, 'tax should be 0');
    assert(data.total === 0, 'total should be 0');
  });

  // 2. POST /cart/items adds product
  await test('POST /cart/items adds product to cart', async () => {
    const { status, data } = await requestJSON(`${BASE_URL}/cart/items`, {
      method: 'POST',
      headers: { 'x-cart-id': cartId1 },
      body: JSON.stringify({ productId: 1, quantity: 2 }),
    });
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.items.length === 1, 'cart should contain 1 item');
    assert(data.items[0].productId === 1, 'item productId should be 1');
    assert(data.items[0].quantity === 2, 'item quantity should be 2');
    assert(data.itemCount === 2, 'itemCount should be 2');
  });

  // 3. POST /cart/items same product increments quantity
  await test('POST /cart/items same product increments quantity', async () => {
    const { status, data } = await requestJSON(`${BASE_URL}/cart/items`, {
      method: 'POST',
      headers: { 'x-cart-id': cartId1 },
      body: JSON.stringify({ productId: 1, quantity: 1 }),
    });
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.items.length === 1, 'cart should still contain 1 unique product');
    assert(data.items[0].quantity === 3, 'item quantity should increment to 3');
  });

  // 4. Server-side price, tax, total calculation
  await test('Server calculates correct subtotal, tax (10%), and total', async () => {
    const { status, data } = await requestJSON(`${BASE_URL}/cart`, {
      headers: { 'x-cart-id': cartId1 },
    });
    assert(status === 200, `Expected 200, got ${status}`);
    const itemPrice = data.items[0].product.price;
    const expectedSubtotal = parseFloat((itemPrice * 3).toFixed(2));
    const expectedTax = parseFloat((expectedSubtotal * 0.10).toFixed(2));
    const expectedShipping = expectedSubtotal < 100 ? 10.00 : 0.00;
    const expectedTotal = parseFloat((expectedSubtotal + expectedTax + expectedShipping).toFixed(2));

    assert(data.subtotal === expectedSubtotal, `Expected subtotal ${expectedSubtotal}, got ${data.subtotal}`);
    assert(data.tax === expectedTax, `Expected tax ${expectedTax}, got ${data.tax}`);
    assert(data.total === expectedTotal, `Expected total ${expectedTotal}, got ${data.total}`);
  });

  // 5. PATCH /cart/items/:productId updates quantity
  await test('PATCH /cart/items/:productId updates item quantity', async () => {
    const { status, data } = await requestJSON(`${BASE_URL}/cart/items/1`, {
      method: 'PATCH',
      headers: { 'x-cart-id': cartId1 },
      body: JSON.stringify({ quantity: 5 }),
    });
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.items[0].quantity === 5, 'item quantity should be updated to 5');
  });

  // 6. DELETE /cart/items/:productId removes item
  await test('DELETE /cart/items/:productId removes product from cart', async () => {
    const { status, data } = await requestJSON(`${BASE_URL}/cart/items/1`, {
      method: 'DELETE',
      headers: { 'x-cart-id': cartId1 },
    });
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.items.length === 0, 'cart items should be empty after delete');
    assert(data.total === 0, 'total should be 0 after delete');
  });

  // 7. DELETE /cart clears cart
  await test('DELETE /cart clears all items in cart', async () => {
    // Add two items first
    await requestJSON(`${BASE_URL}/cart/items`, {
      method: 'POST',
      headers: { 'x-cart-id': cartId1 },
      body: JSON.stringify({ productId: 1, quantity: 1 }),
    });
    await requestJSON(`${BASE_URL}/cart/items`, {
      method: 'POST',
      headers: { 'x-cart-id': cartId1 },
      body: JSON.stringify({ productId: 2, quantity: 1 }),
    });

    const { status, data } = await requestJSON(`${BASE_URL}/cart`, {
      method: 'DELETE',
      headers: { 'x-cart-id': cartId1 },
    });
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.items.length === 0, 'cart should be completely empty');
  });

  // 8. Rejects non-existent product ID (404)
  await test('POST /cart/items rejects non-existent product ID with 404', async () => {
    const { status, data } = await requestJSON(`${BASE_URL}/cart/items`, {
      method: 'POST',
      headers: { 'x-cart-id': cartId1 },
      body: JSON.stringify({ productId: 999999, quantity: 1 }),
    });
    assert(status === 404, `Expected 404, got ${status}`);
    assert(data.error === true, 'should have error: true');
  });

  // 9. Rejects invalid or negative quantity (400)
  await test('POST /cart/items rejects negative/zero quantity with 400', async () => {
    const { status, data } = await requestJSON(`${BASE_URL}/cart/items`, {
      method: 'POST',
      headers: { 'x-cart-id': cartId1 },
      body: JSON.stringify({ productId: 1, quantity: -2 }),
    });
    assert(status === 400, `Expected 400, got ${status}`);
    assert(data.error === true, 'should have error: true');
  });

  // 10. Cart Isolation (Cart 1 vs Cart 2)
  await test('Cart 1 and Cart 2 operate independently (isolation)', async () => {
    // Add item to Cart 2
    await requestJSON(`${BASE_URL}/cart/items`, {
      method: 'POST',
      headers: { 'x-cart-id': cartId2 },
      body: JSON.stringify({ productId: 2, quantity: 4 }),
    });

    const res1 = await requestJSON(`${BASE_URL}/cart`, { headers: { 'x-cart-id': cartId1 } });
    const res2 = await requestJSON(`${BASE_URL}/cart`, { headers: { 'x-cart-id': cartId2 } });

    assert(res1.data.items.length === 0, 'Cart 1 should remain empty');
    assert(res2.data.items.length === 1, 'Cart 2 should contain 1 item');
    assert(res2.data.items[0].quantity === 4, 'Cart 2 item quantity should be 4');
  });

  // Summary
  console.log(`\n${'─'.repeat(40)}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total:  ${passed + failed}`);
  console.log(`${'─'.repeat(40)}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runCartTests();

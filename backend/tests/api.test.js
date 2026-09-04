/**
 * Basic API Endpoint Tests for Nexora Backend
 * Run: node backend/tests/api.test.js
 * Requires the backend server to be running on PORT 5000
 */

const BASE_URL = 'http://localhost:5000/api';

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

async function fetchJSON(url) {
  const res = await fetch(url);
  const data = await res.json();
  return { status: res.status, data };
}

async function runTests() {
  console.log('\n🧪 Nexora API Tests\n');

  // --- Products ---
  console.log('📦 Products');

  await test('GET /products returns unified response with data and pagination', async () => {
    const { status, data } = await fetchJSON(`${BASE_URL}/products`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data.data), 'data.data should be an array');
    assert(typeof data.pagination === 'object', 'pagination should be an object');
    assert(typeof data.pagination.total === 'number', 'pagination.total should be a number');
    assert(typeof data.pagination.page === 'number', 'pagination.page should be a number');
    assert(typeof data.pagination.limit === 'number', 'pagination.limit should be a number');
    assert(typeof data.pagination.totalPages === 'number', 'pagination.totalPages should be a number');
  });

  await test('GET /products?page=1&limit=2 paginates correctly', async () => {
    const { data } = await fetchJSON(`${BASE_URL}/products?page=1&limit=2`);
    assert(data.data.length <= 2, 'Should return at most 2 products');
    assert(data.pagination.limit === 2, 'Limit should be 2');
    assert(data.pagination.page === 1, 'Page should be 1');
  });

  await test('GET /products?search=jacket searches correctly', async () => {
    const { data } = await fetchJSON(`${BASE_URL}/products?search=jacket`);
    assert(Array.isArray(data.data), 'Should return data array');
    if (data.data.length > 0) {
      const match = data.data.some(
        (p) => p.title.toLowerCase().includes('jacket') || p.description.toLowerCase().includes('jacket')
      );
      assert(match, 'Search results should match search term');
    }
  });

  await test('GET /products?sortBy=price&order=desc sorts by price descending', async () => {
    const { data } = await fetchJSON(`${BASE_URL}/products?sortBy=price&order=desc`);
    if (data.data.length > 1) {
      assert(data.data[0].price >= data.data[1].price, 'First product should have highest price');
    }
  });

  await test('GET /products?category=electronics filters by category', async () => {
    const { data } = await fetchJSON(`${BASE_URL}/products?category=electronics`);
    assert(Array.isArray(data.data), 'Should return data array');
    data.data.forEach((p) => {
      assert(p.category.toLowerCase() === 'electronics', `Expected electronics, got ${p.category}`);
    });
  });

  await test('GET /products?page=-1 returns 400 validation error', async () => {
    const { status, data } = await fetchJSON(`${BASE_URL}/products?page=-1`);
    assert(status === 400, `Expected 400, got ${status}`);
    assert(data.error === true, 'Should have error: true');
  });

  await test('GET /products?limit=0 returns 400 validation error', async () => {
    const { status, data } = await fetchJSON(`${BASE_URL}/products?limit=0`);
    assert(status === 400, `Expected 400, got ${status}`);
    assert(data.error === true, 'Should have error: true');
  });

  await test('GET /products/:id returns single product', async () => {
    const { status, data } = await fetchJSON(`${BASE_URL}/products/1`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.id === 1, 'Should return product with id 1');
    assert(typeof data.title === 'string', 'Product should have title');
  });

  await test('GET /products/999999 returns 404', async () => {
    const { status, data } = await fetchJSON(`${BASE_URL}/products/999999`);
    assert(status === 404, `Expected 404, got ${status}`);
    assert(data.error === true, 'Should have error: true');
  });

  await test('GET /products/abc returns 400', async () => {
    const { status, data } = await fetchJSON(`${BASE_URL}/products/abc`);
    assert(status === 400, `Expected 400, got ${status}`);
    assert(data.error === true, 'Should have error: true');
  });

  // --- Categories ---
  console.log('\n📂 Categories');

  await test('GET /categories returns array of category names', async () => {
    const { status, data } = await fetchJSON(`${BASE_URL}/categories`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data), 'Should return an array');
    assert(data.length > 0, 'Should have at least one category');
    assert(typeof data[0] === 'string', 'Categories should be strings');
  });

  await test('GET /categories/abc returns 400', async () => {
    const { status, data } = await fetchJSON(`${BASE_URL}/categories/abc`);
    assert(status === 400, `Expected 400, got ${status}`);
    assert(data.error === true, 'Should have error: true');
  });

  // --- 404 Fallback ---
  console.log('\n🔍 Error Handling');

  await test('GET /nonexistent returns 404 with error format', async () => {
    const { status, data } = await fetchJSON('http://localhost:5000/nonexistent');
    assert(status === 404, `Expected 404, got ${status}`);
    assert(data.error === true, 'Should have error: true');
    assert(typeof data.message === 'string', 'Should have error message');
  });

  // --- Search + Category Combined ---
  console.log('\n🔗 Combined Filters');

  await test('GET /products?search=mens&category=mens clothing works together', async () => {
    const { status, data } = await fetchJSON(
      `${BASE_URL}/products?search=mens&category=${encodeURIComponent("men's clothing")}`
    );
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data.data), 'Should return data array');
  });

  // --- Summary ---
  console.log(`\n${'─'.repeat(40)}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total:  ${passed + failed}`);
  console.log(`${'─'.repeat(40)}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();

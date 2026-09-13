# Design Document

## TypeScript Refactor and Vitest Testing Overhaul — Nexora Store

---

## Overview

This document describes the technical architecture for two parallel workstreams:

1. **Frontend TypeScript migration** — rename every `.jsx`/`.js` under `src/` to `.tsx`/`.ts`, wire up strict-mode types using the existing `src/types.ts`, and type the `CartContext` interface.
2. **Vitest test infrastructure** — replace bespoke Node fetch scripts with a unified Vitest setup covering Frontend component tests (jsdom) and Backend unit + integration tests (node).

No new user-facing features are introduced. All existing API contracts, routing, and business logic are preserved exactly.

---

## Architecture

### High-Level Structure

```
Nexora Store
├── src/                          ← Frontend (React 19 + Vite)
│   ├── types.ts                  ← canonical type source (unchanged)
│   ├── main.tsx                  ← renamed from .jsx
│   ├── App.tsx
│   ├── components/               ← all .jsx → .tsx
│   ├── context/                  ← CartContext.tsx, cartContextValue.ts, useCart.ts
│   ├── pages/                    ← all .jsx → .tsx
│   ├── utils/
│   │   └── api.ts                ← renamed, typed return values
│   └── __tests__/                ← NEW: Vitest + @testing-library/react
│       ├── Navbar.test.tsx
│       ├── ProductCard.test.tsx
│       ├── SearchBar.test.tsx
│       ├── CategoryFilter.test.tsx
│       ├── CartContext.test.tsx
│       └── api.test.ts
│
├── vitest.config.ts              ← NEW: jsdom environment for Frontend
│
└── backend/
    ├── src/                      ← stays .js, gains JSDoc annotations
    │   ├── controllers/          ← @param/@returns/@typedef JSDoc
    │   ├── routes/               ← JSDoc on route handlers
    │   ├── lib/prisma.js         ← JSDoc @typedef for PrismaClient
    │   └── server.js
    ├── vitest.config.js          ← NEW: node environment, two projects
    └── tests/
        ├── unit/                 ← NEW: mocked Prisma unit tests
        │   ├── productController.test.js
        │   ├── categoryController.test.js
        │   ├── cartController.test.js
        │   └── orderController.test.js
        └── integration/          ← NEW: real DB, self-managed server
            ├── products.test.js
            ├── categories.test.js
            ├── cart.test.js
            └── orders.test.js
```

---

## Components

### 1. Frontend TypeScript Migration

#### 1.1 File Rename Map

| From | To |
|------|-----|
| `src/main.jsx` | `src/main.tsx` |
| `src/App.jsx` | `src/App.tsx` |
| `src/App.css` | `src/App.css` (unchanged — not a script) |
| `src/utils/api.js` | `src/utils/api.ts` |
| `src/context/CartContext.jsx` | `src/context/CartContext.tsx` |
| `src/context/cartContextValue.js` | `src/context/cartContextValue.ts` |
| `src/context/useCart.js` | `src/context/useCart.ts` |
| `src/components/CategoryFilter.jsx` | `src/components/CategoryFilter.tsx` |
| `src/components/FadeIn.jsx` | `src/components/FadeIn.tsx` |
| `src/components/Footer.jsx` | `src/components/Footer.tsx` |
| `src/components/Hero.jsx` | `src/components/Hero.tsx` |
| `src/components/Loader.jsx` | `src/components/Loader.tsx` |
| `src/components/Navbar.jsx` | `src/components/Navbar.tsx` |
| `src/components/ProductCard.jsx` | `src/components/ProductCard.tsx` |
| `src/components/SearchBar.jsx` | `src/components/SearchBar.tsx` |
| `src/pages/Cart.jsx` | `src/pages/Cart.tsx` |
| `src/pages/Checkout.jsx` | `src/pages/Checkout.tsx` |
| `src/pages/Home.jsx` | `src/pages/Home.tsx` |
| `src/pages/ProductDetails.jsx` | `src/pages/ProductDetails.tsx` |
| `src/pages/Products.jsx` | `src/pages/Products.tsx` |

`src/vite-env.d.ts` is left as-is (declaration file, not a script).

#### 1.2 Props Interface Strategy

Each component receives a named props interface defined at the top of its file. Interfaces that are consumed by more than one component are added to `src/types.ts`. Examples:

```typescript
// CategoryFilter.tsx — local interface
interface CategoryFilterProps {
  categories: CategoryName[]
  selectedCategory: CategoryName | 'all'
  onSelectCategory: (category: CategoryName | 'all') => void
}

// SearchBar.tsx — local interface
interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

// ProductCard.tsx — uses shared type from types.ts
interface ProductCardProps {
  product: Product
}

// FadeIn.tsx — local interface
interface FadeInProps {
  children: React.ReactNode
  delay?: number
}
```

#### 1.3 CartContext Type Interface

`src/context/cartContextValue.ts` is extended to export a typed context interface and a typed `createContext` call:

```typescript
// src/context/cartContextValue.ts
import { createContext } from 'react'
import type { CartItem, CartData, Order, CheckoutCustomer } from '../types'

export interface CartContextValue {
  cart: CartItem[]
  cartData: CartData
  loading: boolean
  error: string | null
  cartId: string
  loadCart: () => Promise<void>
  addToCart: (productOrId: Product | number, quantity?: number) => Promise<CartData>
  removeFromCart: (productId: number) => Promise<CartData>
  updateQuantity: (productId: number, quantity: number) => Promise<CartData>
  clearCart: () => Promise<CartData>
  checkout: (customer: CheckoutCustomer) => Promise<Order>
  getCartTotal: () => number
  getCartCount: () => number
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)
```

`useCart.ts` narrows the return type and throws if used outside the provider:

```typescript
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
```

#### 1.4 `api.ts` Return Type Annotations

Every exported function in `src/utils/api.ts` is typed against `src/types.ts`:

```typescript
export const api = {
  getProducts: (params?: Partial<ProductQuery>): Promise<ProductsResponse> => ...,
  getAllProducts: (): Promise<ProductsResponse> => ...,
  getProductById: (id: number): Promise<Product> => ...,
  getCategories: (): Promise<CategoryName[]> => ...,
  getProductsByCategory: (category: string): Promise<ProductsResponse> => ...,
  getCart: (cartId: string): Promise<CartData> => ...,
  addToCart: (cartId: string, productId: number, quantity?: number): Promise<CartData> => ...,
  updateCartItem: (cartId: string, productId: number, quantity: number): Promise<CartData> => ...,
  removeCartItem: (cartId: string, productId: number): Promise<CartData> => ...,
  clearCart: (cartId: string): Promise<CartData> => ...,
  checkout: (cartId: string, customer: CheckoutCustomer): Promise<Order> => ...,
}
```

#### 1.5 Dependency Additions for Frontend

`@types/react-router-dom` is the only missing `@types` package — `@types/react` and `@types/react-dom` are already present. The test stack additions are:

```json
"devDependencies": {
  "@types/react-router-dom": "^5.3.3",
  "vitest": "^2.x",
  "@testing-library/react": "^16.x",
  "@testing-library/jest-dom": "^6.x",
  "@testing-library/user-event": "^14.x",
  "jsdom": "^25.x"
}
```

---

### 2. Backend JSDoc Annotations

The Backend stays `.js`. JSDoc annotations are added as documentation — they do not change runtime behaviour.

#### 2.1 Import Strategy

Types from Express and Prisma are imported via JSDoc `@import` tags (zero runtime cost):

```javascript
/** @import { Request, Response, NextFunction } from 'express' */
/** @import { PrismaClient } from '@prisma/client' */
```

#### 2.2 Controller Annotation Pattern

```javascript
/**
 * @typedef {Object} FormattedProduct
 * @property {number} id
 * @property {string} title
 * @property {number} price
 * @property {string} description
 * @property {string} image
 * @property {string} category
 * @property {number} categoryId
 * @property {{ rate: number, count: number }} rating
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 */

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const getAllProducts = async (req, res, next) => { ... }
```

#### 2.3 Helper Function Annotations

```javascript
/**
 * @typedef {Object} FormattedCartResponse
 * @property {string} id
 * @property {FormattedCartItem[]} items
 * @property {number} itemCount
 * @property {number} subtotal
 * @property {number} tax
 * @property {number} shipping
 * @property {number} total
 * @property {Date} [updatedAt]
 */

/**
 * @param {{ id: string, items: import('@prisma/client').CartItem[], updatedAt: Date }} cart
 * @returns {FormattedCartResponse}
 */
const formatCartResponse = (cart) => { ... }
```

#### 2.4 CheckoutError Class Annotations

```javascript
class CheckoutError extends Error {
  /** @type {number} */
  statusCode

  /**
   * @param {number} statusCode
   * @param {string} message
   */
  constructor(statusCode, message) { ... }
}
```

---

### 3. Vitest Configuration

#### 3.1 Frontend Vitest Config (`vitest.config.ts`)

Extends the existing Vite config to add Vitest settings without duplicating plugin config:

```typescript
// vitest.config.ts (root)
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/__tests__/**/*.test.{ts,tsx}'],
  },
})
```

Setup file imports `@testing-library/jest-dom` matchers:

```typescript
// src/__tests__/setup.ts
import '@testing-library/jest-dom'
```

#### 3.2 Backend Vitest Config (`backend/vitest.config.js`)

Uses Vitest's `projects` feature to run unit and integration tests under separate conditions:

```javascript
// backend/vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        name: 'unit',
        test: {
          environment: 'node',
          include: ['tests/unit/**/*.test.js'],
          setupFiles: ['tests/unit/setup.js'],
        },
      },
      {
        name: 'integration',
        test: {
          environment: 'node',
          include: ['tests/integration/**/*.test.js'],
          setupFiles: ['tests/integration/setup.js'],
        },
      },
    ],
  },
})
```

#### 3.3 Backend `package.json` Script Updates

```json
{
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "test": "vitest --run",
    "test:unit": "vitest --run --project unit",
    "test:integration": "vitest --run --project integration",
    "test:watch": "vitest"
  }
}
```

#### 3.4 Frontend `package.json` Script Updates

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc -b",
    "test": "vitest --run",
    "test:watch": "vitest"
  }
}
```

---

### 4. Backend Unit Tests — Architecture

#### 4.1 Prisma Mock Setup (`tests/unit/setup.js`)

A global setup file auto-mocks the Prisma module so every unit test file gets stubbed methods without boilerplate:

```javascript
// tests/unit/setup.js
import { vi } from 'vitest'

vi.mock('../../src/lib/prisma.js', () => ({
  default: {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
    },
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    cart: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    cartItem: {
      upsert: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
      findUnique: vi.fn(),
    },
    order: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))
```

Each test file calls `vi.clearAllMocks()` in `beforeEach` to prevent state leakage.

#### 4.2 Request/Response Mock Pattern

Unit tests use lightweight `req`/`res` mocks rather than supertest — this avoids starting a real server and keeps tests fast:

```javascript
const mockRes = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

const mockReq = (overrides = {}) => ({
  params: {},
  query: {},
  body: {},
  headers: {},
  ...overrides,
})
```

#### 4.3 Controller Test Structure (per file)

```
productController.test.js
  getAllProducts
    ✓ returns 200 with { data, pagination } on success
    ✓ returns 400 when page=-1
    ✓ returns 400 when limit=0
    ✓ returns 400 when categoryId=abc
  getProductById
    ✓ returns 200 with formatted product on success
    ✓ returns 400 for non-numeric id
    ✓ returns 404 when Prisma returns null
  createProduct
    ✓ returns 201 with new product on success
    ✓ returns 400 when title missing
    ✓ returns 400 when price is negative
    ✓ returns 400 when P2003 Prisma error (foreign key)
  updateProduct
    ✓ returns 200 on success
    ✓ returns 404 when P2025 (not found)
  deleteProduct
    ✓ returns 200 on success
    ✓ returns 404 when P2025

categoryController.test.js
  getAllCategories — returns array of name strings
  getCategoryById — 200/400/404 cases
  createCategory — 201/400 (missing name) / 400 (P2002 duplicate)
  updateCategory — 200/404
  deleteCategory — 200/404

cartController.test.js
  getCart — creates new cart when none exists
  addToCart — 200 on success / 400 invalid productId / 400 invalid quantity / 404 product not found
  updateCartItem — 200 / 400 / 404 (cart not found) / 404 (item not in cart)
  removeCartItem — 200 / 400 / 404
  clearCart — 200 / 400 (missing cart id)

orderController.test.js
  checkout
    ✓ returns 400 when x-cart-id header missing
    ✓ returns 400 when email format is invalid
    ✓ returns 400 when required customer fields missing
    ✓ calls $transaction exactly once on success
    ✓ $transaction commits → CartItem.deleteMany called + Order.create called with correct financials
    ✓ returns 400 when cart is empty
    ✓ returns 409 when stock insufficient
    ✓ returns 404 when cart not found
```

---

### 5. Backend Integration Tests — Architecture

#### 5.1 Server Lifecycle

A shared setup module (`tests/integration/setup.js`) creates one Express `http.Server` instance per test suite run. The server binds to a random available port (`port: 0`) to avoid conflicts with the dev server:

```javascript
// tests/integration/setup.js
import { createServer } from 'http'
import app from '../../src/app.js'  // server.js refactored to export app separately

let server
let baseUrl

export const getBaseUrl = () => baseUrl

export const startServer = () => new Promise((resolve) => {
  server = createServer(app)
  server.listen(0, () => {
    baseUrl = `http://localhost:${server.address().port}/api`
    resolve()
  })
})

export const stopServer = () => new Promise((resolve) => {
  server.close(resolve)
})
```

**Server refactor**: `backend/src/server.js` is split into:
- `backend/src/app.js` — exports the configured Express `app` (no `app.listen`)
- `backend/src/server.js` — imports `app`, calls `app.listen`, entry point only

This change is required to let integration tests import `app` without starting the port listener.

#### 5.2 Database Isolation Strategy

Integration tests use a dedicated `.env.test` file that points to a test database (same PostgreSQL instance, different database name, or Neon branch). Each test suite:

1. Creates all necessary DB rows in `beforeAll` using Prisma directly
2. Deletes those rows (by their test-run-specific IDs) in `afterAll`
3. Uses `beforeEach`/`afterEach` only for tests that mutate state mid-suite (e.g., stock deduction)

```javascript
// Pattern used in each integration test file
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })

const prisma = new PrismaClient()
const runId = `test_${Date.now()}`
```

#### 5.3 Integration Test Coverage Map

| File | Scenarios |
|------|-----------|
| `products.test.js` | GET /products (pagination, search, sort, category filter, error codes 400/404) |
| `categories.test.js` | GET /categories (string array), GET /categories/:id (200/400/404) |
| `cart.test.js` | Full cart lifecycle: create, add, increment, update qty, delete item, clear, error cases, cart isolation |
| `orders.test.js` | Checkout success (stock deduction, cart cleared, correct totals), empty cart 400, insufficient stock 409, missing header 400, invalid email 400, DB-authoritative pricing |

---

### 6. Frontend Component Tests — Architecture

#### 6.1 Cart Context Mock Helper

A reusable `createCartContextValue` factory provides a fully-typed mock context value, making it easy to override individual fields per test:

```typescript
// src/__tests__/helpers.tsx
import type { CartContextValue } from '../context/cartContextValue'

export const createCartContextValue = (
  overrides: Partial<CartContextValue> = {}
): CartContextValue => ({
  cart: [],
  cartData: { id: 'test', items: [], itemCount: 0, subtotal: 0, tax: 0, shipping: 0, total: 0 },
  loading: false,
  error: null,
  cartId: 'test-cart-id',
  loadCart: vi.fn().mockResolvedValue(undefined),
  addToCart: vi.fn().mockResolvedValue({ items: [] }),
  removeFromCart: vi.fn().mockResolvedValue({ items: [] }),
  updateQuantity: vi.fn().mockResolvedValue({ items: [] }),
  clearCart: vi.fn().mockResolvedValue({ items: [] }),
  checkout: vi.fn().mockResolvedValue({} as Order),
  getCartTotal: vi.fn().mockReturnValue(0),
  getCartCount: vi.fn().mockReturnValue(0),
  ...overrides,
})
```

Components that use `useCart()` are wrapped in a `CartContext.Provider` seeded with this mock value.

#### 6.2 `api.ts` Test Strategy

The `api.ts` module is tested in isolation by mocking `globalThis.fetch`. This avoids `vi.mock('../utils/api')` in the api test itself while still validating query string construction and error propagation:

```typescript
// src/__tests__/api.test.ts
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})
```

#### 6.3 Component Test Inventory

| Test File | Key Assertions |
|-----------|----------------|
| `Navbar.test.tsx` | Badge visible when itemCount > 0; badge absent when itemCount = 0 |
| `ProductCard.test.tsx` | Title, price, image alt rendered; addToCart called with productId on click |
| `SearchBar.test.tsx` | onSearchChange called with typed value |
| `CategoryFilter.test.tsx` | "All" button + one button per category rendered; onSelectCategory called with correct name |
| `CartContext.test.tsx` | addToCart → cartData updated from mocked API response (renderHook) |
| `api.test.ts` | getProducts builds correct query string; non-OK response rejects with correct Error.message |

---

## Data Models

All data models are defined in `backend/prisma/schema.prisma` and mirrored as TypeScript types in `src/types.ts`. No schema changes are made in this refactor. The mapping is:

| Prisma Model | `src/types.ts` type |
|---|---|
| `Product` | `Product` |
| `Category` | `CategoryName` (string alias) |
| `Cart` + `CartItem` | `CartData`, `CartItem` |
| `Order` + `OrderItem` | `Order`, `OrderItem` |

The `formatProduct`, `formatCartResponse`, and `formatOrderResponse` backend helpers produce shapes that match these TypeScript types exactly. The design relies on this contract staying in sync; any schema change must update both `schema.prisma` and `src/types.ts`.

---

## Interfaces

### API Contract (unchanged)

All existing endpoints remain identical in URL, method, request shape, and response shape. The migration adds no new endpoints.

### Internal TypeScript Interfaces (new additions to `src/types.ts`)

```typescript
// Sort option shape used in Products.tsx
export type SortOption = {
  label: string
  value: string
}

// Props types that are shared across multiple components
export type CategoryFilterProps = {
  categories: CategoryName[]
  selectedCategory: CategoryName | 'all'
  onSelectCategory: (cat: CategoryName | 'all') => void
}
```

Props types used by only one component stay local to that file.

---

## Error Handling

### Frontend Error Handling (unchanged runtime behaviour)

- `api.ts` throws `Error` with `error.status` attached for non-OK responses. TypeScript changes only add return type annotations — the throw path is preserved.
- Components catch errors in `try/catch` blocks and set local `error` state. No changes to control flow.
- `useCart()` now throws if called outside `CartProvider` — this is a developer-time safety net and does not affect production behaviour (the provider wraps the entire app in `App.tsx`).

### Backend Error Handling (unchanged)

- `errorResponse(res, status, message)` pattern is unchanged.
- `CheckoutError` class is unchanged in runtime behaviour, only gains JSDoc annotations.
- Centralized error handler in `server.js` is unchanged.
- The `app.js`/`server.js` split does not touch error middleware — it stays in `app.js`.

### Test Error Isolation

- Unit tests mock `next` as `vi.fn()` and assert it was NOT called on success paths and WAS called on unexpected error paths.
- Integration tests rely on the centralized error handler to format error responses — they assert on the JSON body shape `{ error: true, message: string, status: number }`.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Checkout financial calculation correctness

*For any* valid cart with one or more items (each with a price and quantity from the database), the server-computed `subtotal`, `tax`, `shipping`, and `total` values in the order response shall satisfy: `subtotal = sum(unitPrice * quantity)`, `tax = subtotal * 0.10`, `shipping = (subtotal > 0 && subtotal < 100) ? 10 : 0`, `total = subtotal + tax + shipping` — all rounded to two decimal places.

**Validates: Requirements 5.13**

---

### Property 2: DB-authoritative pricing

*For any* checkout request that includes arbitrary `price`, `subtotal`, `total`, or `quantity` fields in the request body, the resulting order's `unitPrice` and `lineTotal` values shall equal those computed from the product's stored database price and the cart's stored quantity — the request body values are always ignored.

**Validates: Requirements 5.16**

---

### Property 3: Category filter renders correct button count

*For any* list of `n` category names passed to `CategoryFilter`, the rendered output shall contain exactly `n + 1` buttons (one "All" button plus one button per category name).

**Validates: Requirements 6.7**

---

### Property 4: `getProducts` query string construction

*For any* valid `ProductQuery` parameter object (with any combination of `search`, `category`, `page`, `limit`, `sortBy`, `order` fields), calling `api.getProducts(params)` shall construct a `fetch` URL whose query string contains exactly the non-empty parameters from the input — no extra keys, no missing keys, and `page`/`limit` always present.

**Validates: Requirements 6.10**

---

### Property 5: `api.ts` error propagation

*For any* HTTP response with `ok === false` and a JSON body of shape `{ message: string }`, the `apiFetch` function shall reject with an `Error` whose `message` property equals the `message` field in the response body.

**Validates: Requirements 6.11**

---

### Property 6: Cart item quantity accumulation

*For any* sequence of `addToCart` calls on the same `cartId` and `productId` with quantities `q1, q2, ..., qn`, the final `items[0].quantity` in the cart response shall equal `q1 + q2 + ... + qn`, and `items.length` shall equal 1.

**Validates: Requirements 5.12**

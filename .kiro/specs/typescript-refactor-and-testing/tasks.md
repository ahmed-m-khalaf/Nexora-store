# Implementation Plan: TypeScript Refactor and Vitest Testing Overhaul

## Overview

Migrate all Frontend `.jsx`/`.js` files to `.tsx`/`.ts`, add JSDoc annotations to Backend controllers, set up Vitest for both workstreams, and replace the bespoke Node test scripts with proper unit + integration + component test suites. No new user-facing features; all API contracts and runtime behaviour are preserved.

---

## Tasks

- [ ] 1. Install dependencies for Frontend TypeScript and testing
  - Add `@types/react-router-dom`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom` to root `devDependencies`
  - Add `test` and `test:watch` scripts to root `package.json`
  - Verify `@types/react` and `@types/react-dom` are already present (they are)
  - _Requirements: 1.7, 3.1, 3.3_

- [ ] 2. Install Vitest for the Backend
  - Add `vitest` and `dotenv` to `backend/devDependencies`
  - Add `test`, `test:unit`, `test:integration`, and `test:watch` scripts to `backend/package.json`
  - _Requirements: 3.2, 3.4_

- [ ] 3. Add Frontend Vitest config and test setup file
  - [ ] 3.1 Create `vitest.config.ts` at the workspace root configuring jsdom environment, globals, setupFiles pointing to `src/__tests__/setup.ts`, and include pattern `src/__tests__/**/*.test.{ts,tsx}`
    - _Requirements: 3.1_
  - [x] 3.2 Create `src/__tests__/setup.ts` that imports `@testing-library/jest-dom`
    - _Requirements: 3.1_

- [x] 4. Add Backend Vitest config
  - [x] 4.1 Create `backend/vitest.config.js` with two projects: `unit` (node env, `tests/unit/**/*.test.js`, setupFiles `tests/unit/setup.js`) and `integration` (node env, `tests/integration/**/*.test.js`, setupFiles `tests/integration/setup.js`)
    - _Requirements: 3.2, 3.5, 3.7_

- [x] 5. Split `backend/src/server.js` into `app.js` + `server.js`
  - [ ] 5.1 Create `backend/src/app.js` that configures and exports the Express `app` (all middleware, routes, error handler) without calling `app.listen`
    - Import and mount all routes (`productRoutes`, `categoryRoutes`, `cartRoutes`, `orderRoutes`) as they are now in `server.js`
    - Export `app` as default
    - _Requirements: 5.2_
  - [x] 5.2 Rewrite `backend/src/server.js` to only import `app` from `./app.js` and call `app.listen(PORT, ...)`
    - _Requirements: 5.2_

- [x] 6. Create Backend unit test Prisma mock setup
  - [x] 6.1 Create `backend/tests/unit/setup.js` that calls `vi.mock('../../src/lib/prisma.js', ...)` with stubbed methods for `product`, `category`, `cart`, `cartItem`, `order`, and `$transaction`
    - _Requirements: 3.5, 4.1_

- [ ] 7. Write Backend unit tests — `productController`
  - [ ] 7.1 Create `backend/tests/unit/productController.test.js`
    - Import `getAllProducts`, `getProductById`, `createProduct`, `updateProduct`, `deleteProduct` from the controller
    - Use `mockReq`/`mockRes` helpers; call `vi.clearAllMocks()` in `beforeEach`
    - _Requirements: 4.1_
  - [ ] 7.2 Implement `getAllProducts` unit tests
    - Returns 200 with `{ data, pagination }` when Prisma resolves
    - Returns 400 when `page=-1`
    - Returns 400 when `limit=0`
    - Returns 400 when `categoryId=abc`
    - _Requirements: 4.2, 4.3, 4.5_
  - [ ] 7.3 Implement `getProductById` unit tests
    - Returns 200 with formatted product on success
    - Returns 400 for non-numeric id (`abc`)
    - Returns 404 when Prisma returns `null`
    - _Requirements: 4.2, 4.3, 4.4_
  - [ ] 7.4 Implement `createProduct` unit tests
    - Returns 201 on success
    - Returns 400 when `title` is missing
    - Returns 400 when `price` is negative
    - Returns 400 on Prisma P2003 (foreign key violation)
    - _Requirements: 4.2, 4.3, 4.6_
  - [ ] 7.5 Implement `updateProduct` / `deleteProduct` unit tests
    - `updateProduct` returns 200 on success, 404 on P2025
    - `deleteProduct` returns 200 on success, 404 on P2025
    - _Requirements: 4.2, 4.4_

- [ ] 8. Write Backend unit tests — `categoryController`
  - [ ] 8.1 Create `backend/tests/unit/categoryController.test.js`
    - `getAllCategories` returns array of name strings (200)
    - `getCategoryById` returns 200 / 400 (non-numeric) / 404 (null from Prisma)
    - `createCategory` returns 201 / 400 (missing name) / 400 (P2002 duplicate)
    - `updateCategory` returns 200 / 404 (P2025)
    - `deleteCategory` returns 200 / 404 (P2025)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 9. Write Backend unit tests — `cartController`
  - [ ] 9.1 Create `backend/tests/unit/cartController.test.js`
    - `getCart` — creates new cart when none exists (200)
    - `addToCart` — 200 on success; 400 invalid productId; 400 invalid quantity; 404 product not found
    - `updateCartItem` — 200; 400 missing quantity; 404 cart not found; 404 item not in cart
    - `removeCartItem` — 200; 400 invalid productId; 404 cart not found
    - `clearCart` — 200; 400 missing cart id
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 10. Write Backend unit tests — `orderController`
  - [ ] 10.1 Create `backend/tests/unit/orderController.test.js`
    - Returns 400 when `x-cart-id` header is missing; message includes `x-cart-id`
    - Returns 400 when email is invalid; message includes `email`
    - Returns 400 when required customer fields are missing; message includes `required`
    - Returns 404 when cart not found
    - Returns 400 when cart is empty; message includes `empty`
    - Returns 409 when stock insufficient; message includes `stock`
    - Calls `$transaction` exactly once on success
    - On successful `$transaction`: `CartItem.deleteMany` called and `Order.create` called with correct `subtotal`, `tax`, `shipping`, `total`
    - _Requirements: 4.1, 4.2, 4.7, 4.8, 4.9, 4.10, 4.11, 4.12_

- [ ] 11. Checkpoint — Unit tests passing
  - Ensure all unit tests pass (`npm run test:unit` inside `backend/`), ask the user if questions arise.

- [ ] 12. Create Backend integration test server setup
  - [ ] 12.1 Create `backend/tests/integration/setup.js` with `startServer` / `stopServer` / `getBaseUrl` helpers that bind to port `0` using `http.createServer(app)`
    - Import `app` from `../../src/app.js`
    - _Requirements: 5.2_
  - [ ] 12.2 Create `.env.test` in `backend/` documenting the `DATABASE_URL` variable for the test database; the file contains only a commented template (actual value supplied by the developer)
    - _Requirements: 3.6_

- [ ] 13. Write Backend integration tests — products
  - [ ] 13.1 Create `backend/tests/integration/products.test.js`
    - Use `beforeAll`/`afterAll` to call `startServer`/`stopServer`
    - Use Prisma directly in `beforeAll` to seed a small set of test products and clean up in `afterAll`
    - `GET /api/products` — 200 with `{ data: Array, pagination: { total, page, limit, totalPages } }`
    - `GET /api/products?page=1&limit=2` — `data.length <= 2`, `pagination.limit === 2`
    - `GET /api/products?sortBy=price&order=desc` — `data[0].price >= data[1].price` (with ≥2 seeded products)
    - `GET /api/products?page=-1` — 400 with `{ error: true }`
    - `GET /api/products?limit=0` — 400 with `{ error: true }`
    - `GET /api/products/:id` with valid id — 200 with correct shape
    - `GET /api/products/999999` — 404 with `{ error: true }`
    - `GET /api/products/abc` — 400 with `{ error: true }`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [ ] 14. Write Backend integration tests — categories
  - [ ] 14.1 Create `backend/tests/integration/categories.test.js`
    - `GET /api/categories` — 200, body is array of strings, length > 0
    - `GET /api/categories/abc` — 400 with `{ error: true }`
    - _Requirements: 5.1, 5.2, 5.3, 5.8_

- [ ] 15. Write Backend integration tests — cart
  - [ ] 15.1 Create `backend/tests/integration/cart.test.js`
    - Seed at least one product in `beforeAll`
    - `GET /api/cart` with new `x-cart-id` — 200, `id` matches header, `items: []`, `subtotal: 0`, `tax: 0`, `total: 0`
    - `POST /api/cart/items` — adds item, returns correct `items.length` and `quantity`
    - `POST /api/cart/items` same product twice — `items.length === 1`, quantity is sum (Property 6)
    - `PATCH /api/cart/items/:productId` — updates quantity
    - `DELETE /api/cart/items/:productId` — removes item
    - `DELETE /api/cart` — clears all items
    - `POST /api/cart/items` with non-existent productId — 404 with `{ error: true }`
    - `POST /api/cart/items` with `quantity: -2` — 400 with `{ error: true }`
    - Cart isolation test: two different cart ids operate independently
    - _Requirements: 5.1, 5.2, 5.3, 5.9, 5.10, 5.11, 5.12_

- [ ] 16. Write Backend integration tests — orders (checkout)
  - [ ] 16.1 Create `backend/tests/integration/orders.test.js`
    - Seed test category, test product (price 20, stock 5), low-stock product (price 15, stock 1) in `beforeAll`; clean up in `afterAll`
    - Successful checkout (Property 1 & Property 2): status 201, `status === 'PENDING'`, correct `subtotal`/`tax`/`shipping`/`total`, stock decremented, cart cleared, request-body price fields ignored
    - Empty cart checkout — 400, message includes `empty`
    - Missing `x-cart-id` — 400, message includes `x-cart-id`
    - Invalid email — 400, message includes `email`
    - Insufficient stock — 409, message includes `stock`, stock unchanged, cart items preserved
    - _Requirements: 5.1, 5.2, 5.3, 5.13, 5.14, 5.15, 5.16_

- [ ] 17. Checkpoint — Integration tests passing
  - Ensure all integration tests pass (`npm run test:integration` inside `backend/`), ask the user if questions arise.

- [ ] 18. Rename Frontend utility and context files to TypeScript
  - [ ] 18.1 Rename `src/utils/api.js` → `src/utils/api.ts`; add typed parameters and `Promise<T>` return types for every exported function using types from `src/types.ts`
    - Type all `api.*` methods: `getProducts`, `getAllProducts`, `getProductById`, `getCategories`, `getProductsByCategory`, `getCart`, `addToCart`, `updateCartItem`, `removeCartItem`, `clearCart`, `checkout`
    - _Requirements: 1.1, 1.6_
  - [ ] 18.2 Rename `src/context/cartContextValue.js` → `src/context/cartContextValue.ts`; export `CartContextValue` interface listing all 13 context fields; update `createContext` call to `createContext<CartContextValue | undefined>(undefined)`
    - _Requirements: 1.1, 1.5_
  - [ ] 18.3 Rename `src/context/useCart.js` → `src/context/useCart.ts`; narrow return type to `CartContextValue`; throw `Error('useCart must be used within CartProvider')` when context is `undefined`
    - _Requirements: 1.1, 1.5_
  - [ ] 18.4 Rename `src/context/CartContext.jsx` → `src/context/CartContext.tsx`; add explicit types to all state variables and function signatures; satisfy `CartContextValue` interface on the Provider value
    - _Requirements: 1.1, 1.3, 1.5_

- [ ] 19. Rename Frontend component files to TypeScript
  - [ ] 19.1 Rename `src/components/SearchBar.jsx` → `src/components/SearchBar.tsx`; add `SearchBarProps` interface (`searchTerm: string`, `onSearchChange: (value: string) => void`)
    - _Requirements: 1.1, 1.4_
  - [ ] 19.2 Rename `src/components/CategoryFilter.jsx` → `src/components/CategoryFilter.tsx`; add `CategoryFilterProps` interface using `CategoryName` from `src/types.ts`
    - _Requirements: 1.1, 1.3, 1.4_
  - [ ] 19.3 Rename `src/components/ProductCard.jsx` → `src/components/ProductCard.tsx`; add `ProductCardProps` interface using `Product` from `src/types.ts`
    - _Requirements: 1.1, 1.3, 1.4_
  - [ ] 19.4 Rename `src/components/Navbar.jsx` → `src/components/Navbar.tsx`; no props needed; ensure `useCart()` return type resolves without errors
    - _Requirements: 1.1, 1.2_
  - [ ] 19.5 Rename remaining component files: `FadeIn.jsx` → `FadeIn.tsx` (add `FadeInProps`), `Footer.jsx` → `Footer.tsx`, `Hero.jsx` → `Hero.tsx`, `Loader.jsx` → `Loader.tsx`
    - _Requirements: 1.1, 1.4_

- [ ] 20. Rename Frontend page files to TypeScript
  - [ ] 20.1 Rename `src/pages/Products.jsx` → `src/pages/Products.tsx`; add local types for state variables; use `ProductQuery`, `ProductsResponse`, `Pagination` from `src/types.ts`
    - _Requirements: 1.1, 1.3_
  - [ ] 20.2 Rename `src/pages/Cart.jsx` → `src/pages/Cart.tsx`; type all variables using `CartItem`, `CartData` from `src/types.ts`
    - _Requirements: 1.1, 1.3_
  - [ ] 20.3 Rename `src/pages/Checkout.jsx` → `src/pages/Checkout.tsx`; type form state with `CheckoutCustomer`; type `order` state with `Order | null`
    - _Requirements: 1.1, 1.3_
  - [ ] 20.4 Rename `src/pages/Home.jsx` → `src/pages/Home.tsx` and `src/pages/ProductDetails.jsx` → `src/pages/ProductDetails.tsx`; add appropriate prop and state types
    - _Requirements: 1.1, 1.3_

- [ ] 21. Rename root Frontend files to TypeScript
  - [ ] 21.1 Rename `src/App.jsx` → `src/App.tsx` and `src/main.jsx` → `src/main.tsx`; fix any strict-mode errors
    - _Requirements: 1.1, 1.2_

- [ ] 22. Verify Frontend compiles with no TypeScript errors
  - Run `tsc -b` against `tsconfig.app.json` and resolve all errors
  - Use targeted `// @ts-expect-error` with explanation for any errors that cannot be resolved without changing runtime behaviour (as a last resort)
  - _Requirements: 1.2, 1.8, 1.9_

- [ ] 23. Add JSDoc annotations to Backend controllers
  - [ ] 23.1 Add `@import` JSDoc tags for Express and Prisma types to `backend/src/controllers/productController.js`; annotate `formatProduct` (`@typedef FormattedProduct`), `errorResponse`, `parsePositiveInt`, and all five exported controllers with `@param`/`@returns`
    - _Requirements: 2.1, 2.2, 2.4, 2.6_
  - [ ] 23.2 Add equivalent JSDoc to `backend/src/controllers/categoryController.js` — `@typedef FormattedCategory` if needed, annotate all five controllers
    - _Requirements: 2.1, 2.2, 2.4, 2.6_
  - [ ] 23.3 Add JSDoc to `backend/src/controllers/cartController.js` — `@typedef FormattedCartResponse`, `@typedef FormattedCartItem`; annotate `formatCartResponse`, `getOrCreateCart`, and all five exported controllers
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6_
  - [ ] 23.4 Add JSDoc to `backend/src/controllers/orderController.js` — annotate `CheckoutError` class (`@type {number}` on `statusCode`), `toNumber`, `formatOrderResponse`, `getCustomerDetails`, and `checkout`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6_

- [ ] 24. Create Frontend component test helpers and write component tests
  - [ ] 24.1 Create `src/__tests__/helpers.tsx` with `createCartContextValue` factory returning a fully-typed mock `CartContextValue` using `vi.fn()` stubs
    - _Requirements: 6.1_
  - [ ] 24.2 Create `src/__tests__/Navbar.test.tsx`
    - Badge visible when `itemCount > 0`
    - Badge absent when `itemCount === 0`
    - Use `CartContext.Provider` seeded with mock value from `createCartContextValue`
    - _Requirements: 6.1, 6.2, 6.3_
  - [ ] 24.3 Create `src/__tests__/ProductCard.test.tsx`
    - Renders product title, price, and image `alt` text
    - Clicking "Add to Cart" calls `addToCart` with the correct `productId`
    - Wrap with `MemoryRouter` and `CartContext.Provider`
    - _Requirements: 6.1, 6.4, 6.5_
  - [ ] 24.4 Create `src/__tests__/SearchBar.test.tsx`
    - Typing in the input calls `onSearchChange` with the typed value
    - _Requirements: 6.1, 6.6_
  - [ ] 24.5 Create `src/__tests__/CategoryFilter.test.tsx`
    - Renders exactly `n + 1` buttons for `n` categories (one "All" + one per category) — Property 3
    - Clicking a category button calls `onSelectCategory` with the correct name
    - _Requirements: 6.1, 6.7, 6.8_
  - [ ] 24.6 Create `src/__tests__/CartContext.test.tsx`
    - Use `renderHook` with a real `CartProvider` wrapper
    - Mock `src/utils/api.ts` with `vi.mock`
    - Assert that calling `addToCart` updates `cartData` state with the mocked API response
    - _Requirements: 6.1, 6.9, 6.12_

- [ ] 25. Write Frontend `api.ts` unit tests
  - [ ] 25.1 Create `src/__tests__/api.test.ts`
    - Mock `globalThis.fetch` with `vi.stubGlobal`
    - `getProducts` builds correct query string for various `ProductQuery` inputs — Property 4
    - Non-OK response rejects with `Error` whose `message` equals the `message` field in the JSON body — Property 5
    - `page` and `limit` are always present in the query string
    - _Requirements: 6.1, 6.10, 6.11_

- [ ] 26. Final checkpoint — All tests passing
  - Ensure `tsc -b` passes with zero errors (Frontend)
  - Ensure `npm test` in `backend/` passes all unit and integration tests
  - Ensure `npm test` in the workspace root passes all component tests
  - Ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Tasks 1–2 (dependency installs) and 3–6 (config/setup files) must complete before any test files are written
- The `app.js`/`server.js` split (task 5) is a hard prerequisite for integration tests (task 12+)
- All 19 file renames (tasks 18–21) can proceed independently once dependencies are installed
- Property-based test scenarios (Properties 1–6 from the design doc) are embedded directly in the integration and component test tasks above — no separate property test task needed as these are validated via standard assertions
- Backend stays `.js` throughout; only annotations change

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["3.1", "3.2", "4.1"] },
    { "id": 1, "tasks": ["5.1"] },
    { "id": 2, "tasks": ["5.2", "6.1"] },
    { "id": 3, "tasks": ["7.1", "8.1", "9.1", "10.1", "12.1", "12.2", "18.1", "18.2"] },
    { "id": 4, "tasks": ["7.2", "7.3", "7.4", "7.5", "18.3"] },
    { "id": 5, "tasks": ["13.1", "14.1", "15.1", "16.1", "18.4"] },
    { "id": 6, "tasks": ["19.1", "19.2", "19.3", "19.4", "19.5"] },
    { "id": 7, "tasks": ["20.1", "20.2", "20.3", "20.4"] },
    { "id": 8, "tasks": ["21.1"] },
    { "id": 9, "tasks": ["23.1", "23.2", "23.3", "23.4", "24.1"] },
    { "id": 10, "tasks": ["24.2", "24.3", "24.4", "24.5", "24.6"] },
    { "id": 11, "tasks": ["25.1"] }
  ]
}
```

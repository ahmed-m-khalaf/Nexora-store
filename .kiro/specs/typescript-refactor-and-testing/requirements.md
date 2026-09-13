# Requirements Document

## Introduction

This feature covers a comprehensive refactor of the Nexora Store monorepo with two parallel goals:

1. **TypeScript migration for the Frontend** — convert all `.jsx` and `.js` files under `src/` to `.tsx` and `.ts`, leveraging the existing `src/types.ts` and the already-configured `tsconfig.app.json` (strict mode). The Backend (`backend/`) remains `.js` but gains JSDoc type annotations throughout.

2. **Test infrastructure overhaul** — replace the existing bespoke Node.js test scripts (`backend/tests/*.js`) with a unified Vitest setup covering both Frontend (component tests) and Backend (unit tests with mocked Prisma + integration tests using real DB). All existing test scenarios must be preserved and new scenarios added for previously untested paths.

The refactor preserves all existing API contracts, UI behaviour, and business logic without introducing new user-facing features.

---

## Glossary

- **Frontend**: The React 19 + Vite application under `src/`.
- **Backend**: The Node.js + Express 4 application under `backend/src/`.
- **Prisma**: The ORM layer (`@prisma/client`) used in the Backend to communicate with PostgreSQL.
- **CartContext**: The React context (`src/context/CartContext`) that owns all client-side cart state and communicates with the Backend cart API.
- **API Contract**: The set of HTTP endpoints, request shapes, and response shapes already implemented in the Backend and consumed by the Frontend.
- **Unit Test**: A test that runs entirely in-process, with Prisma methods replaced by `vi.fn()` stubs.
- **Integration Test**: A test that starts a real Express server and calls the actual database (Neon/PostgreSQL) or a test database.
- **Component Test**: A Vitest + `@testing-library/react` test that mounts a React component in jsdom, stubs external dependencies, and asserts on rendered output and user interactions.
- **JSDoc Annotation**: A `/** @type {...} */` or `@param`/`@returns` comment that conveys type information for `.js` files without requiring a TypeScript compilation step.
- **x-cart-id**: The HTTP request header the Frontend sends on every cart and checkout request to identify the guest cart session.
- **CheckoutError**: The internal Backend error class in `orderController.js` that carries an HTTP status code for structured error propagation.

---

## Requirements

### Requirement 1 — Frontend TypeScript Migration

**User Story:** As a developer, I want all Frontend source files to be TypeScript, so that I get compile-time type safety and IDE auto-complete across the entire React codebase.

#### Acceptance Criteria

1. THE Frontend SHALL rename every `.jsx` file under `src/` to `.tsx` and every `.js` file (excluding `vite-env.d.ts`) to `.ts`.
2. THE Frontend SHALL compile without TypeScript errors when `tsc -b` is run against the existing `tsconfig.app.json` (which has `strict: true`).
3. THE Frontend SHALL use the types already defined in `src/types.ts` (`Product`, `CartItem`, `CartData`, `Order`, `Pagination`, `ProductQuery`, `CheckoutCustomer`, etc.) as the canonical type source — no duplicate type definitions are allowed.
4. WHEN a component receives props, THE Frontend SHALL declare a named props interface or type alias for those props, placed either at the top of the file or in `src/types.ts` if the type is shared.
5. THE Frontend SHALL type the `CartContext` value with an explicit interface that lists every field exposed to consumers (`cart`, `cartData`, `loading`, `error`, `cartId`, `loadCart`, `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `checkout`, `getCartTotal`, `getCartCount`).
6. THE `api.ts` utility SHALL annotate every exported function with typed parameters and return types using the types from `src/types.ts` and returning `Promise<T>` for all async calls.
7. THE Frontend SHALL add `@types/react`, `@types/react-dom`, and `@types/react-router-dom` (or verify they are already present) so that React element and hook types resolve correctly under strict mode.
8. IF a TypeScript error cannot be resolved without changing runtime behaviour, THE Frontend SHALL use a targeted `// @ts-expect-error` comment with a one-line explanation rather than `any` casts or `@ts-ignore`.
9. THE Frontend SHALL retain all existing runtime behaviour — routing, cart operations, checkout flow, product listing with pagination/search/filter/sort — after migration.

---

### Requirement 2 — Backend JSDoc Type Annotations

**User Story:** As a developer, I want the Backend `.js` files annotated with JSDoc types, so that IDE tooling provides type hints without requiring a TypeScript compilation step on the server.

#### Acceptance Criteria

1. THE Backend SHALL annotate every controller function with `@param` and `@returns` JSDoc tags describing the Express `Request`, `Response`, and `NextFunction` types.
2. THE Backend SHALL annotate helper functions (e.g., `formatProduct`, `formatCartResponse`, `formatOrderResponse`, `errorResponse`, `getOrCreateCart`, `getCustomerDetails`) with `@param` and `@returns` JSDoc tags describing their input and output shapes.
3. THE Backend SHALL annotate the `CheckoutError` class properties (`statusCode`, `message`) with `@type` JSDoc tags.
4. THE Backend SHALL define a JSDoc `@typedef` for each internal data shape that is passed between helpers and controllers — specifically the formatted product shape, formatted cart shape, and formatted order shape.
5. THE Backend SHALL retain all existing runtime behaviour after annotations are added — no logic, error codes, or response shapes may change.
6. WHEN a JSDoc annotation would require importing a type from `@prisma/client` or `express`, THE Backend SHALL use an `@import` JSDoc tag or `@typedef {import('...')}` form so the annotation works without adding runtime imports.

---

### Requirement 3 — Vitest Setup and Configuration

**User Story:** As a developer, I want a single test framework (Vitest) configured for both Frontend and Backend, so that I can run all tests with one command and get consistent output.

#### Acceptance Criteria

1. THE Frontend SHALL add a `vitest.config.ts` (or extend `vite.config.ts`) that configures the `jsdom` environment, enables global test utilities, and includes `@testing-library/react` and `@testing-library/jest-dom` for component tests.
2. THE Backend SHALL add a `vitest.config.js` under `backend/` that configures the `node` environment for unit and integration tests.
3. THE Frontend `package.json` SHALL add a `test` script that runs `vitest --run` and a `test:watch` script that runs `vitest`.
4. THE Backend `package.json` SHALL add a `test:unit` script that runs `vitest --run --project unit`, a `test:integration` script that runs `vitest --run --project integration`, and a `test` script that runs both via `vitest --run`.
5. THE Backend unit test project SHALL configure `vi.mock('../lib/prisma.js')` (or a global setup file) so that Prisma is always auto-mocked in unit tests without per-file boilerplate.
6. WHEN running integration tests, THE Backend SHALL use a separate `DATABASE_URL` environment variable (e.g., from `.env.test`) so integration tests never touch the production database.
7. THE setup SHALL allow unit tests and integration tests to run independently via separate npm scripts.

---

### Requirement 4 — Backend Unit Tests (Mocked Prisma)

**User Story:** As a developer, I want unit tests for every Backend controller with Prisma mocked, so that I can verify business logic in isolation without a database connection.

#### Acceptance Criteria

1. THE Backend SHALL have unit test files at `backend/tests/unit/productController.test.js`, `backend/tests/unit/categoryController.test.js`, `backend/tests/unit/cartController.test.js`, and `backend/tests/unit/orderController.test.js`.
2. WHEN a controller returns a success response, THE unit tests SHALL assert the HTTP status code, the `Content-Type` header, and the shape of the JSON body.
3. WHEN an invalid `id` parameter is supplied, THE unit tests SHALL assert that the controller responds with status `400` and a body of `{ error: true, message: <string>, status: 400 }`.
4. WHEN a resource is not found (Prisma returns `null` or throws `P2025`), THE unit tests SHALL assert that the controller responds with status `404` and `{ error: true, ... }`.
5. WHEN `getAllProducts` is called with `?page=-1` or `?limit=0`, THE unit tests SHALL assert that the controller responds with status `400`.
6. WHEN `createProduct` is called with a missing `title` or negative `price`, THE unit tests SHALL assert status `400`.
7. WHEN `checkout` is called without the `x-cart-id` header, THE unit tests SHALL assert status `400` with a message that includes the string `x-cart-id`.
8. WHEN `checkout` is called with an invalid email format, THE unit tests SHALL assert status `400` with a message that includes the word `email`.
9. WHEN the cart is empty at checkout time, THE unit tests SHALL assert status `400` with a message that includes the word `empty`.
10. WHEN stock is insufficient at checkout, THE unit tests SHALL assert status `409` with a message that includes the word `stock`.
11. THE unit tests SHALL verify that the `checkout` controller calls Prisma's `$transaction` exactly once on a successful checkout.
12. WHEN a Prisma `$transaction` is committed successfully, THE unit tests SHALL assert that `CartItem.deleteMany` is called (cart cleared) and `Order.create` is called with the correct financial fields (`subtotal`, `tax`, `shipping`, `total`).

---

### Requirement 5 — Backend Integration Tests (Real Database)

**User Story:** As a developer, I want integration tests that execute real HTTP requests against a running Express server and a test database, so that I can verify end-to-end behaviour including DB transactions and stock deduction.

#### Acceptance Criteria

1. THE Backend SHALL migrate the scenarios from the existing `backend/tests/api.test.js`, `backend/tests/cart.test.js`, and `backend/tests/order.test.js` into Vitest integration test files under `backend/tests/integration/`.
2. THE integration tests SHALL use `beforeAll` / `afterAll` to start and stop an Express `http.Server` instance (not relying on an externally running server).
3. THE integration tests SHALL use `beforeAll` / `afterAll` (or `beforeEach` / `afterEach` where isolation is needed) to seed and clean up test-specific database rows using the Prisma client directly.
4. WHEN `GET /api/products` is called, THE integration tests SHALL assert a `200` response with `{ data: Array, pagination: { total, page, limit, totalPages } }`.
5. WHEN `GET /api/products?page=1&limit=2` is called, THE integration tests SHALL assert that `data.length <= 2` and `pagination.limit === 2`.
6. WHEN `GET /api/products?sortBy=price&order=desc` is called with at least two products, THE integration tests SHALL assert that `data[0].price >= data[1].price`.
7. WHEN `GET /api/products/:id` is called with a non-existent ID, THE integration tests SHALL assert status `404` with `{ error: true }`.
8. WHEN `GET /api/categories` is called, THE integration tests SHALL assert a `200` response where the body is an array of strings.
9. WHEN `POST /api/cart/items` is called with a non-existent `productId`, THE integration tests SHALL assert status `404` with `{ error: true }`.
10. WHEN `POST /api/cart/items` is called with `quantity: -2`, THE integration tests SHALL assert status `400` with `{ error: true }`.
11. WHEN `GET /api/cart` is called with a new `x-cart-id`, THE integration tests SHALL assert a `200` response with `id` matching the header, `items: []`, `subtotal: 0`, `tax: 0`, `total: 0`.
12. WHEN `POST /api/cart/items` is called twice for the same product in the same cart, THE integration tests SHALL assert that `items.length === 1` and the quantity is the sum of both additions.
13. WHEN `POST /api/orders/checkout` is called with a valid cart and customer details, THE integration tests SHALL assert status `201`, order `status === 'PENDING'`, correct `subtotal`/`tax`/`shipping`/`total` values, and that product stock is decremented by the ordered quantity.
14. WHEN `POST /api/orders/checkout` is called and stock is insufficient, THE integration tests SHALL assert status `409`, stock remains unchanged, and cart items are preserved.
15. WHEN `POST /api/orders/checkout` is called on an empty cart, THE integration tests SHALL assert status `400` with a message including the word `empty`.
16. THE integration tests SHALL assert that checkout prices always come from the database — any price or quantity fields sent in the request body SHALL be ignored by the server.

---

### Requirement 6 — Frontend Component Tests

**User Story:** As a developer, I want component tests for key React components and hooks, so that I can verify UI rendering, user interactions, and context behaviour without a browser.

#### Acceptance Criteria

1. THE Frontend SHALL have component test files under `src/__tests__/` for: `Navbar`, `ProductCard`, `SearchBar`, `CategoryFilter`, `CartContext`, and `api.ts`.
2. WHEN `Navbar` is rendered with a `CartContext` value where `itemCount > 0`, THE component tests SHALL assert that the cart badge showing the count is visible in the DOM.
3. WHEN `Navbar` is rendered with `itemCount === 0`, THE component tests SHALL assert that the cart badge is not rendered.
4. WHEN `ProductCard` is rendered with a product fixture, THE component tests SHALL assert that the product title, price, and image `alt` text are present in the rendered output.
5. WHEN the "Add to Cart" button in `ProductCard` is clicked, THE component tests SHALL assert that `addToCart` from `CartContext` is called with the correct `productId`.
6. WHEN `SearchBar` receives an `onSearchChange` prop and the user types in the input, THE component tests SHALL assert that `onSearchChange` is called with the typed value.
7. WHEN `CategoryFilter` renders with a list of categories, THE component tests SHALL assert that an "All" button and one button per category are present.
8. WHEN a category button in `CategoryFilter` is clicked, THE component tests SHALL assert that `onSelectCategory` is called with the correct category name.
9. WHEN `CartContext` is tested in isolation (using `renderHook`), THE component tests SHALL mock `api.ts` and assert that calling `addToCart` updates the `cartData` state with the mocked API response.
10. WHEN `api.ts` is unit-tested, THE tests SHALL mock `globalThis.fetch` and assert that `getProducts` constructs the correct query string for a given set of parameters.
11. WHEN `api.ts` receives a non-OK HTTP response, THE tests SHALL assert that the returned promise rejects with an `Error` whose `message` matches the `message` field in the error JSON body.
12. THE component tests SHALL use `vi.mock` to stub `src/utils/api.ts` in component tests so that no real HTTP requests are made.

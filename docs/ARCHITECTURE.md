# Nexora Store — Current Architecture

## Frontend

The frontend is a strict TypeScript React application. Route-level pages live in `src/pages`, reusable UI is grouped by responsibility under `src/components`, and cart state is isolated under `src/features/cart`.

```text
src/
├── app/                 # App shell, routes, and Vite entry point
├── components/
│   ├── catalog/         # ProductCard, Hero, filters, search
│   ├── common/          # Loader, FadeIn
│   └── layout/          # Navbar, Footer
├── features/cart/       # CartProvider, useCart, context contract
├── pages/               # Home, Products, ProductDetails, Cart, Checkout
├── services/api.ts      # Typed HTTP boundary to the backend
├── types/index.ts       # Canonical frontend domain types
├── utils/               # Small reusable helpers
└── styles/              # Global CSS
```

Data flows from pages to `features/cart` or `services/api.ts`; components do not call `fetch` directly.

## Backend

```text
backend/src/
├── app.js               # Express composition and middleware
├── server.js            # Process entry point
├── routes/              # HTTP paths and verbs
├── controllers/         # Request/response adapters
├── services/            # Business rules and transactions
├── lib/                 # Prisma singleton
└── data/                # Seed/static catalog data
```

The checkout request follows this boundary:

```text
route → controller → orderService → Prisma transaction → response
```

`orderService` owns customer validation, Decimal-safe totals, conditional stock deduction, order snapshots, cart clearing, and Serializable transaction retries. The frontend never supplies prices or financial totals.

## TypeScript boundary

All frontend source files are `.ts` or `.tsx`; `tsconfig.app.json` compiles the complete `src` tree in strict mode, and `vite.config.ts` is checked through `tsconfig.node.json`. Backend JavaScript remains intentionally JavaScript because it is a Node/Express layer and uses runtime JSDoc only where needed.

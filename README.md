# Nexora Store

> Full-Stack E-Commerce MVP — React + Express + Prisma + PostgreSQL

Nexora Store is a learning-focused e-commerce application being built incrementally from a frontend-only React app into a full-stack production-ready MVP.

## Tech Stack

| Layer      | Technology                         |
| ---------- | ---------------------------------- |
| Frontend   | React 19, React Router, Vite      |
| Styling    | Tailwind CSS 4                     |
| Backend    | Node.js, Express 4                 |
| ORM        | Prisma 6                           |
| Database   | PostgreSQL (Neon Cloud)             |

## Project Structure

```
Nexora-store/
├── src/                   # React Frontend (Vite)
│   ├── app/               # Application shell, routing, and entry point
│   ├── components/        # Shared UI grouped by catalog, layout, and common
│   ├── features/cart/     # Cart state, context, and cart-specific hooks
│   ├── pages/             # Route-level page components
│   ├── services/          # Typed backend API client
│   ├── types/             # Canonical frontend domain types
│   ├── utils/             # Small cross-feature helpers
│   └── styles/            # Global and application styles
├── backend/               # Express Backend
│   ├── src/
│   │   ├── controllers/   # Thin HTTP adapters
│   │   ├── routes/        # Express route definitions
│   │   ├── services/       # Business logic (checkout/orders)
│   │   ├── lib/           # Prisma client singleton
│   │   └── data/          # Static seed data
│   ├── prisma/            # Prisma schema, migrations, seed
│   └── tests/             # API endpoint tests
├── ROADMAP.md             # Phase-based development roadmap
└── README.md              # This file
```

## Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **PostgreSQL** database (local or cloud via [Neon](https://neon.tech))

### 1. Clone & Install

```bash
git clone <repo-url>
cd Nexora-store

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### 2. Configure Database

Create `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN=1d
BCRYPT_ROUNDS=12
```

### 3. Run Database Migration & Seed

```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
# Safely sync the expanded catalog without deleting users, carts, or orders
npm run db:seed:catalog
```

### 4. Start Development

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
npm run dev
```

### 5. Run API Tests

```bash
# Start the backend server first, then:
cd backend
npm test
```

## API Endpoints

### Products

| Method   | Endpoint                         | Description                       |
| -------- | -------------------------------- | --------------------------------- |
| `GET`    | `/api/products`                  | List products (search, filter, sort, paginate) |
| `GET`    | `/api/products/:id`              | Get single product                |
| `GET`    | `/api/products/category/:name`   | Get products by category name     |
| `POST`   | `/api/products`                  | Create product                    |
| `PATCH`  | `/api/products/:id`              | Update product                    |
| `DELETE` | `/api/products/:id`              | Delete product                    |

#### Query Parameters for `GET /api/products`

| Param      | Type   | Default | Description                              |
| ---------- | ------ | ------- | ---------------------------------------- |
| `search`   | string | —       | Search in title and description          |
| `category` | string | —       | Filter by category name                  |
| `categoryId` | int  | —       | Filter by category ID                    |
| `sortBy`   | string | `id`    | Sort field: `id`, `title`, `price`, `createdAt` |
| `order`    | string | `asc`   | Sort direction: `asc`, `desc`            |
| `page`     | int    | `1`     | Page number                              |
| `limit`    | int    | `12`    | Items per page (max: 100)                |
| `minPrice` | number | —       | Minimum price filter                     |
| `maxPrice` | number | —       | Maximum price filter                     |

#### Unified Response Format

All product list endpoints return:

```json
{
  "data": [ { "id": 1, "title": "...", "price": 29.99, ... } ],
  "pagination": {
    "total": 20,
    "page": 1,
    "limit": 12,
    "totalPages": 2
  }
}
```

### Categories

| Method   | Endpoint               | Description              |
| -------- | ---------------------- | ------------------------ |
| `GET`    | `/api/categories`      | List all category names  |
| `GET`    | `/api/categories/:id`  | Get category with products |
| `POST`   | `/api/categories`      | Create category          |
| `PATCH`  | `/api/categories/:id`  | Update category          |
| `DELETE` | `/api/categories/:id`  | Delete category          |

### Authentication

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `POST` | `/api/auth/register` | Create an account and optionally migrate the `x-cart-id` guest cart |
| `POST` | `/api/auth/login` | Log in and optionally merge the `x-cart-id` guest cart |
| `GET` | `/api/auth/me` | Return the current user (`Authorization: Bearer <token>`) |

Authenticated Cart and Checkout requests resolve ownership from the JWT user identity. The client cannot select another user's `cartId` or `userId`. Guest Cart and Guest Checkout remain supported through `x-cart-id`.

### Error Response Format

All errors return a consistent format:

```json
{
  "error": true,
  "message": "Description of the error",
  "status": 400
}
```

### Security & Middleware (Phase 9)

- **Helmet**: Secures HTTP response headers (`X-Content-Type-Options`, `X-Frame-Options`, etc.).
- **Rate Limiting (`express-rate-limit`)**:
  - Global `/api`: 100 requests / 15 mins.
  - `/api/auth`: 5 requests / 15 mins (skips successful attempts).
  - `/api/orders`: 10 requests / 15 mins.
  - Automatically disabled in `test` environment (`NODE_ENV=test`).
- **Input Validation & Sanitization (`express-validator`)**: Strict whitelist and boundaries for pagination (`page >= 1`, `limit 1-100`), queries, IDs, and checkout fields with sanitizers (`.trim()`, `.escape()`, `.normalizeEmail()`).
- **CORS Hardening**: Origin configured via `CORS_ORIGIN` env variable with credential support.
- **Payload Limits**: JSON body parser strictly capped at `16kb`.
- **Centralized Error Mapping**: Automatic mapping of Prisma codes (`P2002` -> 409, `P2003` -> 400, `P2025` -> 404) and JWT exceptions.
- **Process Handlers**: Graceful exit on `unhandledRejection` and `uncaughtException`.

### Authorization Audit Notice
- Product mutation endpoints (`POST /api/products`, `PATCH /api/products/:id`, `DELETE /api/products/:id`) currently operate with request validation only and without admin access guards. RBAC enforcement is reserved for subsequent phases.

## Current Phase

**Phase 10 — Testing, Deployment & Production Readiness** ✅ Complete (Full-Stack MVP Complete 🎉)

### Deployment & CI/CD
- **Frontend Deployment (Vercel)**:
  - Framework: Vite / React
  - Root directory: `./`
  - Build command: `npm run build`
  - Output directory: `dist`
  - SPA Routing: Handled by `vercel.json` rewrite rules.
  - Environment variable: `VITE_API_URL=<your-backend-api-url>/api`
- **Backend Deployment (Render / Railway)**:
  - Root directory: `backend`
  - Build command: `npm run build` (runs `npx prisma generate`)
  - Start command: `npm start`
  - Environment variables: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `NODE_ENV=production`
- **Automated CI/CD**:
  - GitHub Actions workflow (`.github/workflows/ci.yml`) runs typecheck, linting, production build on every push and PR.

### Completed Feature Highlights
- **UI/UX Professional Upgrade**: Zero-dependency custom Toasts, Skeleton loaders, 3-step checkout wizard, URL params synchronization, Quick View modal, mobile sticky CTA.
- **Phase 9 Security Hardening**: Helmet headers, express-validator sanitization, rate-limiting, CORS control, 16kb payload limit.
- **Phase 0–8 Core Architecture**: Full PostgreSQL + Prisma catalog, Server-driven cart & pricing, Atomic checkout transactions, JWT authentication with guest cart migration.

## License

This project is for educational purposes.

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
│   ├── components/        # Reusable UI components
│   ├── context/           # React Context (Cart)
│   ├── pages/             # Page components (Home, Products, Cart, etc.)
│   └── utils/             # API client & helpers
├── backend/               # Express Backend
│   ├── src/
│   │   ├── controllers/   # Route handlers (products, categories)
│   │   ├── routes/        # Express route definitions
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
```

### 3. Run Database Migration & Seed

```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
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

### Error Response Format

All errors return a consistent format:

```json
{
  "error": true,
  "message": "Description of the error",
  "status": 400
}
```

## Current Phase

**Phase 5 — Catalog Migration** ✅ Complete

See [ROADMAP.md](ROADMAP.md) for the full development plan.

## License

This project is for educational purposes.

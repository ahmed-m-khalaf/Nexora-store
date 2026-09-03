# Nexora Store — Backend Learning Roadmap (Updated)

> **الهدف:** تحويل Nexora Store تدريجيًا من Frontend-only إلى Full-Stack MVP، مع الاستفادة من المشروع كمعمل عملي لتعلّم الباك إند من الصفر.
> **الهيكل:** Monorepo (مجلد `frontend` و `backend` بنفس الـ Repo).

---

## خريطة المراحل (Phases Overview)

```text
PHASE 0: Project Setup (Monorepo & Initial Express Server)
   ↓
PHASE 1: HTTP + Express Foundations
   ↓
PHASE 2: Nexora Products API (Static Array Data & Controller structure)
   ↓
PHASE 3: Frontend-Backend Integration (React ↔ Express)
   ↓
PHASE 4: PostgreSQL + Prisma Foundations (Cloud DB: Neon/Supabase)
   ↓
PHASE 5: Catalog Migration (DB-Driven Search, Filter, Pagination, Sorting)
   ↓
PHASE 6: Cart Architecture (Guest Cart vs Server Cart)
   ↓
PHASE 7: Orders & Checkout (Business Logic, Server Pricing & Transactions)
   ↓
PHASE 8: Authentication & Authorization (Users, JWT, Passwords & Protection)
   ↓
PHASE 9: Validation, Security & Centralized Error Handling
   ↓
PHASE 10: Testing, Deployment & Production Polish
```

---

## تفاصيل المراحل وقوائم الإنجاز

### Phase 0 — Project Setup
- [x] إنشاء مجلد `backend`
- [x] إعداد `package.json` وتثبيت Express
- [x] تشغيل أول خادم بسيط (`GET /` و `GET /api/products`)
- [x] التجربة عبر Postman / المتصفح

### Phase 1 — HTTP + Express Foundations
- [x] فهم Request / Response lifecycle
- [x] التعامل مع `req.params` و `req.query` و `req.body`
- [x] التعرف على Status Codes (`200`, `201`, `400`, `404`, `500`)

### Phase 2 — Nexora Products API
- [x] بناء Endpoints الخاصة بالمنتجات والاقسام:
  - `GET /api/products`
  - `GET /api/products/:id`
  - `GET /api/categories`
- [x] فصل الكود إلى Routes و Controllers

### Phase 3 — Frontend ↔ Backend Connection
- [x] إعداد CORS في Express
- [x] ربط تطبيق React بالسيرفر المحلي بدل FakeStore API
- [x] معالجة حالات التحميل والأخطاء في Frontend

### Phase 4 — PostgreSQL + Prisma Setup
- [x] إنشاء قاعدة بيانات سحابية (Neon / Supabase)
- [x] إعداد Prisma ORM و Schema أولية (`Category` و `Product`)
- [x] إجراء Migration وإدخال بيانات أولية (Seed)


### Phase 5 — Real Catalog API
- [x] ربط Endpoints المنتجات بقاعدة البيانات عبر Prisma
- [x] نقل عمليات البحث، الفلترة، والـ Pagination للـ Server-side


### Phase 6 — Cart Architecture
- [ ] فصل تفاصيل المنتج عن الـ Cart (تخزين `productId` و `quantity` فقط)
- [ ] إعداد هيكلية Cart API

### Phase 7 — Orders & Checkout
- [ ] إنشاء Model للـ `Order` والـ `OrderItem`
- [ ] حساب الأسعار والـ Totals والتحقق من الـ Stock في السيرفر
- [ ] استخدام DB Transactions

### Phase 8 — Authentication
- [ ] إنشاء User Model وتطبيق Password Hashing
- [ ] إعداد Register / Login / Logout Endpoints
- [ ] استخدام JWT و Auth Middleware لحماية الـ Routes

### Phase 9 — Security & Validation
- [ ] تطبيق Input Validation على الـ Requests
- [ ] إعداد Central Error Middleware
- [ ] حماية الـ API بواسطة Rate Limiting و CORS محدد

### Phase 10 — Testing & Deployment
- [ ] اختبار جميع الـ Endpoints والـ Edge cases
- [ ] رفع السيرفر والداتا بيز وتحديث بيئة الإنتاج

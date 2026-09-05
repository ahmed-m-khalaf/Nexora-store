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
PHASE 5: Catalog Migration (DB-Driven Search, Filter, Pagination, Sorting) ✅
   ↓
PHASE 6: Cart Architecture (Guest Cart vs Server Cart) ✅
   ↓
PHASE 7: Orders & Checkout (Business Logic, Server Pricing & Transactions) ← أنت هنا
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


### Phase 5 — Real Catalog API ✅

#### 5.1 — ربط الواجهة بالـ Backend (Search, Filter, Sort, Pagination)
- [x] إنشاء `api.getProducts()` يرسل query params (search, category, page, limit, sortBy, order) للسيرفر
- [x] إزالة الفلترة المحلية (client-side) من `Products.jsx` بالكامل
- [x] إضافة Debounce للبحث (400ms) لتقليل الطلبات
- [x] إعادة بناء صفحة المنتجات لتعمل بالكامل مع الـ Server-side

#### 5.2 — توحيد عقد الـ API Response
- [x] `GET /api/products` يرجع دائمًا `{ data: [...], pagination: { total, page, limit, totalPages } }`
- [x] إزالة الحالة القديمة اللي كانت ترجع Array فقط بدون Pagination
- [x] تحديث `getProductsByCategory` ليرجع نفس الشكل الموحّد
- [x] تحديث `api.getAllProducts()` في Frontend ليتعامل مع الشكل الجديد

#### 5.3 — تحسين Product Catalog UI
- [x] إضافة Pagination بأزرار (Previous / أرقام الصفحات / Next)
- [x] إضافة Sort Dropdown (السعر ↑↓، الاسم ↑↓، الأحدث)
- [x] عرض عدد المنتجات والصفحة الحالية من إجمالي الصفحات
- [x] البحث والتصنيف يعملان معًا في نفس الوقت عبر query params

#### 5.4 — Validation أساسي
- [x] التحقق من `id` (positive integer) في جميع الـ Endpoints
- [x] التحقق من `page` و `limit` (positive integers, limit max 100)
- [x] التحقق من `price` و `categoryId` في Create/Update
- [x] منع القيم السالبة و غير الرقمية مع رسائل خطأ واضحة

#### 5.5 — توحيد أخطاء الـ API
- [x] جميع الأخطاء ترجع بشكل موحّد: `{ error: true, message: "...", status: N }`
- [x] تحسين Central Error Middleware في `server.js`
- [x] إضافة Error State واضح في الواجهة مع زر 🔄 Retry
- [x] التعامل مع أخطاء الشبكة (Network errors) بشكل منفصل

#### 5.6 — تحسين قاعدة البيانات
- [x] تغيير `price` من `Float` إلى `Decimal(10,2)` للدقة المالية
- [x] إضافة Database Indexes على `categoryId`, `price`, `title`
- [x] التأكد من بيانات الـ Seed كاملة ومتوافقة

#### 5.7 — إصلاح الجودة
- [x] إضافة اختبارات API بسيطة (`npm test` في backend)
- [x] اختبار جميع الـ Endpoints: Products, Categories, Validation, Errors
- [x] توثيق طريقة تشغيل Frontend و Backend معًا

#### 5.8 — تحديث التوثيق
- [x] إعادة كتابة `README.md` مع تعليمات التشغيل والـ API Reference
- [x] تحديث `ROADMAP.md` مع تفاصيل ما تم في Phase 5

---

### النتيجة النهائية لـ Phase 5

```text
React (Products.jsx)
  ↓ sends ?search=X&category=Y&page=1&limit=12&sortBy=price&order=asc
Express API (productController.js)
  ↓ validates + builds Prisma query
Prisma ORM
  ↓ findMany + count (with indexes)
PostgreSQL (Neon Cloud)
  ↓ returns results
Express
  ↓ responds with { data: [...], pagination: {...} }
React
  ↓ renders products grid + pagination controls + sort + search
```

---

### Phase 6 — Cart Architecture (Server-Driven Guest Cart) ✅

- [x] **نمذجة قاعدة البيانات**: إضافة `Cart` و `CartItem` في Prisma Schema مع علاقات و `@@index` وملاءمة `userId` مستقبلياً
- [x] **هيكل البيانات الموحد**: حفظ `productId` و `quantity` فقط داخل السلة دون الاعتماد على أسعار الواجهة
- [x] **حساب الإجماليات على السيرفر**: حساب `subtotal`, `tax` (10%), `shipping`, و `total` بالكامل على السيرفر
- [x] **Cart API Endpoints**:
  - `GET /api/cart` (جلب السلة أو إنشائها)
  - `POST /api/cart/items` (إضافة عنصر أو زيادة الكمية)
  - `PATCH /api/cart/items/:productId` (تعديل الكمية أو الحذف عند 0)
  - `DELETE /api/cart/items/:productId` (حذف عنصر)
  - `DELETE /api/cart` (تفريغ السلة)
- [x] **تكامل React**: تحديث `CartContext` و `api.js` لاستخدام `x-cart-id` الفريد لكل زائر (Guest UUID)
- [x] **تحديث الواجهة**: تحديث صفحات `ProductCard`, `ProductDetails`, `Cart`, و `Navbar`
- [x] **شامل الاختبارات (100%)**: إنشاء `backend/tests/cart.test.js` لاختبار العزل، الإجماليات، الأخطاء والعمليات

---

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


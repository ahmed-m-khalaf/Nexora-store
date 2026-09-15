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
PHASE 7: Orders & Checkout (Business Logic, Server Pricing & Transactions) ✅
   ↓
PHASE 8: Authentication & Authorization (Users, JWT, Passwords & Protection) ✅
   ↓
UI/UX Professional Upgrade (Design System & Shopping Experience) ← أنت هنا
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

### Phase 7 — Orders & Checkout (Business Logic, Transactions & Stock Management) ✅

**الهدف (Goal)**: 
تحويل Cart إلى Order نهائي مع حساب الأسعار من السيرفر، خصم المخزون، والتأكد من سلامة البيانات عبر Database Transactions.

**لماذا هذه المرحلة؟ (Why)**:
- الـ Cart مجرد "حالة مؤقتة" — نحتاج لحفظ Order نهائي لا يمكن تعديله
- الأسعار يجب أن تُحسب من Database وليس من Frontend (security)
- المخزون يجب أن يُخصم atomically لتجنب overselling
- نحتاج snapshot من بيانات المنتج لحظة الشراء (السعر قد يتغير لاحقاً)

**المتطلبات المسبقة (Prerequisites)**:
- ✅ Phase 6 مكتملة (Cart API جاهز)
- ✅ Prisma Schema يحتوي على `Order` و `OrderItem` models
- ✅ Products تحتوي على حقل `stock`

---

#### 7.1 — فهم المعمارية (Understanding the Architecture)

**الفرق بين Cart و Order**:

| الخاصية | Cart | Order |
|---------|------|-------|
| الهدف | سلة مؤقتة قابلة للتعديل | طلب نهائي محفوظ |
| التعديل | يمكن إضافة/حذف/تعديل | Immutable (لا يتغير) |
| الأسعار | تُحسب live من Database | Snapshot محفوظة |
| المخزون | لا يؤثر | يُخصم عند Checkout |
| العميل | Guest UUID فقط | بيانات كاملة (اسم، إيميل، عنوان) |

**Data Flow**:
```text
Frontend (Checkout Page)
  ↓ submits customer info + x-cart-id header
Backend (orderController.checkout)
  ↓ validates customer data
  ↓ fetches cart with items from DB
  ↓ starts DB Transaction (Serializable isolation)
    ├─ calculates totals from DB prices
    ├─ checks stock availability
    ├─ deducts stock (conditional update)
    ├─ creates Order with OrderItem snapshots
    ├─ clears cart items
  ↓ commits transaction OR rolls back on error
Frontend
  ↓ shows order confirmation
```

---

#### 7.2 — Database Models (المُنفذة بالفعل)

**Order Model**:
```prisma
model Order {
  id              String      @id @default(uuid())
  cartId          String
  cart            Cart        @relation(fields: [cartId], references: [id])
  
  // Customer Information
  customerName    String
  customerEmail   String
  customerPhone   String
  shippingAddress String
  
  // Order Status
  status          OrderStatus @default(PENDING)
  
  // Financial Snapshot (من Database وقت الـ checkout)
  subtotal        Decimal     @db.Decimal(10, 2)
  tax             Decimal     @db.Decimal(10, 2)
  shipping        Decimal     @db.Decimal(10, 2)
  total           Decimal     @db.Decimal(10, 2)
  
  items           OrderItem[]
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([cartId])
  @@index([status])
}

enum OrderStatus {
  PENDING      // Order created, payment pending
  PROCESSING   // Payment received, preparing shipment
  COMPLETED    // Order shipped/delivered
  CANCELLED    // Order cancelled
}
```

**OrderItem Model** (Product Snapshot):
```prisma
model OrderItem {
  id        Int      @id @default(autoincrement())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  productId Int?     // nullable: إذا تم حذف Product من Database
  product   Product? @relation(fields: [productId], references: [id], onDelete: SetNull)
  
  // Snapshot data (محفوظة وقت الشراء)
  title     String
  unitPrice Decimal  @db.Decimal(10, 2)
  quantity  Int
  lineTotal Decimal  @db.Decimal(10, 2)
  
  createdAt DateTime @default(now())

  @@index([orderId])
  @@index([productId])
}
```

**لماذا Snapshot؟**
- إذا تغير سعر Product لاحقاً، Order يحتفظ بالسعر القديم
- إذا حُذف Product، Order لا يزال يعرض الاسم والسعر
- `productId` nullable + `onDelete: SetNull` تضمن data integrity

---

#### 7.3 — Server-Side Price Calculation

**القاعدة الذهبية**: 
**Frontend لا يُرسل أسعار أبداً** — فقط `x-cart-id` وبيانات العميل.

**Backend يحسب كل شيء**:
```javascript
// الأسعار تأتي من Database فقط
const cart = await prisma.cart.findUnique({
  where: { id: cartId },
  include: { items: { include: { product: true } } }
});

// حساب الإجماليات
const orderItems = cart.items.map(item => {
  const unitPrice = new Prisma.Decimal(item.product.price);
  const lineTotal = unitPrice.mul(item.quantity);
  return { productId, title, unitPrice, quantity, lineTotal };
});

const subtotal = orderItems.reduce((sum, item) => sum.plus(item.lineTotal), Decimal(0));
const tax = subtotal.mul('0.10');  // 10% ضريبة
const shipping = subtotal.lt(100) && subtotal.gt(0) ? Decimal(10) : Decimal(0);
const total = subtotal.plus(tax).plus(shipping);
```

**لماذا Prisma.Decimal؟**
- JavaScript `Number` غير دقيق للحسابات المالية (floating point errors)
- `Decimal` يضمن دقة 100% في العمليات الحسابية

---

#### 7.4 — Stock Management

**المشكلة**: ماذا لو طلب شخصان آخر قطعة من المنتج في نفس الوقت؟

**الحل**: Conditional Update داخل Transaction
```javascript
// لا نسحب Stock بشكل أعمى — نتحقق من الكمية المتاحة
const updated = await tx.product.updateMany({
  where: { 
    id: item.productId, 
    stock: { gte: item.quantity }  // شرط: المخزون >= الكمية المطلوبة
  },
  data: { 
    stock: { decrement: item.quantity } 
  }
});

if (updated.count !== 1) {
  throw new CheckoutError(409, `Insufficient stock for "${item.title}".`);
}
```

**لماذا `updateMany` وليس `update`؟**
- `update` يُرجع exception إذا لم يجد record
- `updateMany` يُرجع `{ count: 0 }` — نتحكم نحن في الـ error message

---

#### 7.5 — Database Transactions

**لماذا Transactions؟**
```javascript
await prisma.$transaction(async (tx) => {
  // 1. Fetch cart
  // 2. Validate stock
  // 3. Deduct stock
  // 4. Create order
  // 5. Clear cart
}, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
```

**ماذا يحدث إذا فشلت أي خطوة؟**
- الـ Transaction يتراجع (rollback) عن **كل التعديلات**
- المخزون لا يُخصم
- الـ Order لا يُنشأ
- الـ Cart يبقى كما هو

**Serializable Isolation**:
- أعلى مستوى عزل في PostgreSQL
- يضمن عدم حدوث race conditions بين طلبين متزامنين
- يمنع "phantom reads" و "dirty reads"

---

#### 7.6 — Customer Data Validation

**Input Validation**:
```javascript
function getCustomerDetails(body) {
  const customerName = body.customerName?.trim();
  const customerEmail = body.customerEmail?.trim().toLowerCase();
  const customerPhone = body.customerPhone?.trim();
  const shippingAddress = body.shippingAddress?.trim();

  if (!customerName || !customerEmail || !customerPhone || !shippingAddress) {
    throw new CheckoutError(400, 'Name, email, phone, and address are required.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    throw new CheckoutError(400, 'Please provide a valid email address.');
  }

  return { customerName, customerEmail, customerPhone, shippingAddress };
}
```

**لماذا Validation مهم؟**
- منع empty strings
- تنظيف المدخلات (trim whitespace)
- تطبيع Email (lowercase)
- منع SQL injection (Prisma يتعامل مع هذا، لكن validation إضافي)

---

#### 7.7 — API Endpoint

**POST /api/orders/checkout**

**Request**:
```http
POST /api/orders/checkout
Headers:
  x-cart-id: guest-uuid-here
  Content-Type: application/json
Body:
{
  "customerName": "Ahmed Hassan",
  "customerEmail": "ahmed@example.com",
  "customerPhone": "+201234567890",
  "shippingAddress": "123 Main St, Cairo, Egypt"
}
```

**Response (Success 201)**:
```json
{
  "id": "uuid-order-id",
  "status": "PENDING",
  "customer": {
    "name": "Ahmed Hassan",
    "email": "ahmed@example.com",
    "phone": "+201234567890",
    "shippingAddress": "123 Main St, Cairo, Egypt"
  },
  "items": [
    {
      "id": 1,
      "productId": 5,
      "title": "Wireless Headphones",
      "unitPrice": 29.99,
      "quantity": 2,
      "lineTotal": 59.98
    }
  ],
  "subtotal": 59.98,
  "tax": 6.00,
  "shipping": 10.00,
  "total": 75.98,
  "createdAt": "2026-09-11T10:30:00.000Z"
}
```

**Error Responses**:
| Status | Scenario |
|--------|----------|
| `400` | Missing x-cart-id header |
| `400` | Invalid email format |
| `400` | Missing required fields |
| `404` | Cart not found |
| `400` | Empty cart |
| `409` | Insufficient stock |

---

#### 7.8 — Frontend Integration

**CartContext.jsx**:
```javascript
const checkout = async (customer) => {
  try {
    const order = await api.checkout(cartId, customer);
    
    // Clear local cart state بعد نجاح Checkout
    setCartData({
      id: cartId,
      items: [],
      itemCount: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
    });
    
    return order;
  } catch (err) {
    setError(err.message);
    throw err;
  }
};
```

**Checkout.jsx Page**:
```javascript
const handleSubmit = async (event) => {
  event.preventDefault();
  setSubmitting(true);

  try {
    const placedOrder = await checkout(form);
    setOrder(placedOrder);  // Show success page
  } catch (err) {
    setSubmitError(err.message);
  } finally {
    setSubmitting(false);
  }
};
```

**Success UI**:
- يعرض Order ID
- يعرض Total المدفوع
- رابط للعودة للتسوق
- **لا يعرض** payment gateway (ليس جزء من Phase 7)

---

#### 7.9 — Comprehensive Testing

**backend/tests/order.test.js**:

اختبارات شاملة:
- ✅ رفض GET request على endpoint (يجب أن يكون POST)
- ✅ رفض طلب بدون `x-cart-id` header
- ✅ رفض email غير صحيح
- ✅ رفض حقول ناقصة
- ✅ رفض cart غير موجود
- ✅ رفض cart فارغ
- ✅ **Success case**: إنشاء order + خصم stock + تفريغ cart
- ✅ **Insufficient stock**: رفض order دون تعديل database
- ✅ **Atomic operation**: التحقق من أن Transaction تعمل بشكل صحيح

**Run Tests**:
```bash
cd backend
npm run test:orders
# أو
npm run test:all
```

---

#### 7.10 — Files Modified/Created

| File | Action | Purpose |
|------|--------|---------|
| `prisma/schema.prisma` | Modified ✅ | Added Order, OrderItem, OrderStatus enum |
| `backend/src/services/orderService.js` | Created ✅ | Checkout domain logic, Decimal totals, stock deduction, and transaction retries |
| `backend/src/controllers/orderController.js` | Refactored ✅ | Thin HTTP adapter for the checkout service |
| `backend/src/routes/orderRoutes.js` | Created ✅ | POST /orders/checkout route |
| `backend/src/app.js` | Modified ✅ | Mounted `/api/orders` router |
| `src/utils/api.js` | Modified ✅ | Added `checkout()` function |
| `src/context/CartContext.jsx` | Modified ✅ | Added `checkout()` method |
| `src/pages/Checkout.jsx` | Created ✅ | Full checkout form + success page |
| `src/App.jsx` | Modified ✅ | Added `/checkout` route |
| `backend/tests/unit/orderService.test.js` | Created ✅ | Unit coverage for totals, validation, stock, rollback boundaries, and transaction conflicts |

---

#### 7.11 — Definition of Done

✅ Phase 7 تُعتبر مكتملة عندما:
- [x] Order و OrderItem models موجودة في Database
- [x] POST /api/orders/checkout endpoint يعمل بنجاح
- [x] الأسعار تُحسب من Database (zero trust من Frontend)
- [x] Stock يُخصم atomically داخل transaction
- [x] Customer data يُتحقق منها (email validation)
- [x] Transaction rollback يعمل عند insufficient stock
- [x] Cart يُفرّغ بعد checkout ناجح
- [x] Frontend Checkout page متكامل ويعرض order confirmation
- [x] Tests تغطي جميع السيناريوهات (success + error cases)
- [x] الـ Postman collection يحتوي على checkout scenarios

**النتيجة**: Phase 7 **مكتملة 100%** ✅

---

### Phase 8 — Authentication & Authorization (User Accounts, JWT & Protected Routes)

**الهدف (Goal)**:
تحويل التطبيق من Guest-only إلى نظام مستخدمين كامل مع register/login/logout وحماية الـ endpoints الحساسة.

**لماذا هذه المرحلة؟ (Why)**:
- حالياً أي زائر يمكنه الوصول لأي cart (إذا عرف الـ UUID)
- نحتاج ربط Carts و Orders بـ users محددين
- بعض Operations (مثل view order history) يجب أن تكون محمية
- تجهيز للـ features المتقدمة (user profile, order tracking)

**المتطلبات المسبقة (Prerequisites)**:
- ✅ Phase 7 مكتملة (Orders system جاهز)
- معرفة JWT (JSON Web Tokens)
- معرفة Password Hashing (bcrypt)
- فهم HTTP Authentication headers

---

#### 8.1 — User Model & Database Schema

**إضافة User model**:
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String   // hashed with bcrypt
  name      String
  phone     String?
  address   String?
  role      UserRole @default(CUSTOMER)
  carts     Cart[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}

enum UserRole {
  CUSTOMER
  ADMIN
}
```

**تعديل Cart model**:
```prisma
model Cart {
  id        String     @id @default(uuid())
  userId    Int?       @unique
  user      User?      @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     CartItem[]
  orders    Order[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  @@index([userId])
}
```

**Migration**:
```bash
cd backend
npx prisma migrate dev --name add_user_model
```

---

#### 8.2 — Password Security (bcrypt)

**لماذا لا نحفظ Passwords كـ plain text؟**
- إذا تم اختراق Database، جميع كلمات المرور مكشوفة
- المستخدمون يُعيدون استخدام نفس الـ password في مواقع متعددة
- قوانين حماية البيانات (GDPR) تطلب Hashing

**تثبيت bcrypt**:
```bash
npm install bcrypt
```

**Implementation**:
```javascript
import bcrypt from 'bcrypt';

// عند التسجيل
const hashedPassword = await bcrypt.hash(plainPassword, 10);
await prisma.user.create({
  data: { email, password: hashedPassword, name }
});

// عند تسجيل الدخول
const user = await prisma.user.findUnique({ where: { email } });
const isValid = await bcrypt.compare(plainPassword, user.password);
```

**Salt Rounds (10)**:
- كلما زاد العدد، زادت صعوبة brute-force attacks
- 10 rounds = توازن جيد بين الأمان والأداء

---

#### 8.3 — JWT (JSON Web Tokens)

**ما هو JWT؟**
```
header.payload.signature
eyJhbGc...  .eyJ1c2Vy...  .SflKxwRJ...
```

- **Header**: نوع Token والـ algorithm
- **Payload**: البيانات (userId, email, role) — **مرئية**
- **Signature**: تشفير يُثبت أن Token لم يُعدّل

**تثبيت jsonwebtoken**:
```bash
npm install jsonwebtoken
```

**إنشاء Token**:
```javascript
import jwt from 'jsonwebtoken';

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}
```

**التحقق من Token**:
```javascript
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}
```

---

#### 8.4 — Auth Endpoints

**POST /api/auth/register**:
- Validates email uniqueness, password strength
- Hashes password with bcrypt
- Creates user + returns JWT token

**POST /api/auth/login**:
- Validates credentials
- Compares hashed password
- Returns JWT token

**Auth Middleware**:
```javascript
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: true, 
      message: 'Authentication required.', 
      status: 401 
    });
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ 
      error: true, 
      message: 'Invalid token.', 
      status: 401 
    });
  }
};
```

---

#### 8.5 — Guest Cart Migration

**السيناريو**:
- User يضيف منتجات كـ Guest
- User يُسجل دخول
- نريد **نقل** Guest Cart إلى User Cart

**Migration Logic**:
```javascript
async function migrateGuestCartToUser(guestCartId, userId) {
  return await prisma.$transaction(async (tx) => {
    const guestCart = await tx.cart.findUnique({
      where: { id: guestCartId },
      include: { items: true }
    });
    
    if (!guestCart || guestCart.items.length === 0) return null;
    
    let userCart = await tx.cart.findUnique({ where: { userId } });
    if (!userCart) {
      userCart = await tx.cart.create({ data: { userId } });
    }
    
    // Merge items (upsert)
    for (const item of guestCart.items) {
      await tx.cartItem.upsert({
        where: {
          cartId_productId: { cartId: userCart.id, productId: item.productId }
        },
        update: { quantity: { increment: item.quantity } },
        create: {
          cartId: userCart.id,
          productId: item.productId,
          quantity: item.quantity
        }
      });
    }
    
    await tx.cartItem.deleteMany({ where: { cartId: guestCartId } });
    await tx.cart.delete({ where: { id: guestCartId } });
    
    return userCart;
  });
}
```

---

#### 8.6 — Frontend Integration

**AuthContext.jsx**:
```javascript
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email, password) => {
    const { user, token } = await api.login(email, password);
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Protected Route**:
```javascript
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
}
```

---

#### 8.7 — Security Best Practices

**Environment Variables**:
```env
JWT_SECRET=your-super-secret-random-string-min-32-chars
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

**⚠️ أمان مهم**:
- `JWT_SECRET` عشوائي وطويل (32+ characters)
- لا تُضيف `.env` في git
- لا تُرسل password في response
- استخدم HTTPS في production
- أضف rate limiting على login/register

---

#### 8.8 — Definition of Done

✅ Phase 8 تُعتبر مكتملة عندما:
- [x] User model موجود في Database
- [x] Register endpoint يعمل مع bcrypt password hashing
- [x] Login endpoint يُرجع JWT token
- [x] Auth middleware يتحقق من signature وexpiration ويحمي `/api/auth/me`
- [x] Guest cart تُدمج داخل user cart عند register/login داخل transaction
- [x] Frontend يحفظ access token في localStorage للـ MVP
- [x] Protected frontend route (`/account`) تُحوّل لـ login إذا لم يكن user مسجل
- [x] Tests تغطي register, login, invalid JWT, Cart ownership, وauthenticated checkout
- [x] User لا يستطيع قراءة أو تعديل Cart مستخدم آخر
- [x] Order يرتبط بالمستخدم عند authenticated checkout مع الحفاظ على Guest orders القديمة
- [x] `passwordHash` لا يظهر في API responses أو logs

---

**النتيجة الحالية**: Phase 8 **مكتملة 100%** ✅

ملاحظة: `prisma migrate dev` متأثر بتاريخ migrations القديم الذي كان يعتمد على Cart موجودة مسبقًا خارج أول migration؛ تم تطبيق migration Phase 8 بنجاح باستخدام `prisma migrate deploy`. قبل إعادة بناء قاعدة جديدة من الصفر، يجب عمل baseline/squash للمigrations في مهمة مستقلة.

### Phase 9 — Input Validation, Error Handling & Security Hardening

**الهدف (Goal)**:
تحسين أمان وموثوقية API عبر validation شامل، error handling متقدم، وحماية من attacks شائعة.

**لماذا هذه المرحلة؟**:
- validation موزّع في controllers (غير منظم)
- نحتاج centralized error handling
- حماية من SQL injection, XSS, rate limiting

---

#### 9.1 — Request Validation Middleware

**تثبيت express-validator**:
```bash
npm install express-validator
```

**Example**:
```javascript
import { body, validationResult } from 'express-validator';

export const validateCreateProduct = [
  body('title').trim().notEmpty().isLength({ min: 3, max: 200 }),
  body('price').isFloat({ min: 0 }),
  body('categoryId').isInt({ min: 1 }),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: true, 
        message: 'Validation failed', 
        details: errors.array() 
      });
    }
    next();
  }
];
```

---

#### 9.2 — Centralized Error Handling

**errorHandler Middleware**:
```javascript
export const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message } = err;

  // Prisma errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Resource already exists.';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token.';
  }

  res.status(statusCode).json({
    error: true,
    message,
    status: statusCode,
  });
};
```

---

#### 9.3 — Rate Limiting

**تثبيت express-rate-limit**:
```bash
npm install express-rate-limit
```

**Setup**:
```javascript
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: true, message: 'Too many requests.', status: 429 }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts
  skipSuccessfulRequests: true,
});

app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
```

---

#### 9.4 — Security Headers (Helmet)

```bash
npm install helmet
```

```javascript
import helmet from 'helmet';
app.use(helmet());
```

**ماذا يفعل Helmet؟**
- يضيف security headers
- يحمي من XSS
- يمنع clickjacking

---

#### 9.5 — Input Sanitization

```bash
npm install xss-clean
```

```javascript
import xss from 'xss-clean';
app.use(xss());
```

---

#### 9.6 — Definition of Done

✅ Phase 9 تُعتبر مكتملة عندما:
- [ ] Request validation middleware على endpoints
- [ ] Centralized error handler
- [ ] Rate limiting على auth و API
- [ ] Helmet security headers
- [ ] Input sanitization (XSS)
- [ ] CORS محدد
- [ ] Error responses موحّدة

---

### Phase 10 — Testing, Deployment & Production Readiness

**الهدف (Goal)**:
إعداد التطبيق للإنتاج مع testing شامل وdeployment على cloud platform.

---

#### 10.1 — Testing Strategy

**Current**:
- ✅ Integration tests (api.test.js, cart.test.js, order.test.js)
- ❌ Unit tests محدودة
- ❌ لا يوجد E2E tests

**Goal**: 70%+ test coverage

---

#### 10.2 — Environment Setup

**Production** (.env.production):
```env
NODE_ENV=production
DATABASE_URL=postgresql://prod-url
JWT_SECRET=secure-random-64-chars
FRONTEND_URL=https://nexora-store.com
```

---

#### 10.3 — Backend Deployment (Render/Railway)

**Render.com**:
1. Push to GitHub
2. Create Web Service on Render
3. Build: `cd backend && npm install && npx prisma generate`
4. Start: `cd backend && npm start`
5. Add environment variables

---

#### 10.4 — Frontend Deployment (Vercel)

```bash
vercel --prod
```

**Environment**:
```env
VITE_API_URL=https://nexora-api.onrender.com/api
```

---

#### 10.5 — CI/CD Pipeline (GitHub Actions)

**.github/workflows/test.yml**:
```yaml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd backend && npm ci
      - run: cd backend && npx prisma migrate deploy
      - run: cd backend && npm test
```

---

#### 10.6 — Monitoring

**Sentry** (Error Tracking):
```bash
npm install @sentry/node
```

**Uptime Monitoring**: UptimeRobot

---

#### 10.7 — Performance Optimization

**Backend**:
```bash
npm install compression
```

```javascript
import compression from 'compression';
app.use(compression());
```

**Frontend**:
- Code splitting (React.lazy)
- Image optimization
- CDN

---

#### 10.8 — Security Checklist

✅ قبل production:
- [ ] JWT_SECRET عشوائي (64+ chars)
- [ ] Environment variables secure
- [ ] HTTPS enabled
- [ ] CORS محدد
- [ ] Rate limiting
- [ ] Helmet headers
- [ ] Input validation
- [ ] Dependencies updated

---

#### 10.9 — Definition of Done

✅ Phase 10 تُعتبر مكتملة عندما:
- [ ] Test coverage 70%+
- [ ] CI/CD pipeline working
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Production database
- [ ] HTTPS working
- [ ] Error tracking enabled
- [ ] Uptime monitoring
- [ ] Security checklist complete

---

## 🎉 المراحل المستقبلية (Optional)

### Phase 11 — Admin Dashboard
- Admin panel لإدارة المنتجات والطلبات
- Order management
- User management
- Analytics

### Phase 12 — Advanced Features
- Product reviews (real)
- Wishlist
- Order tracking
- Email notifications
- Password reset
- Image upload

### Phase 13 — Payment Integration
- Stripe/PayPal
- Webhooks
- Refunds
- Invoices

### Phase 14 — Performance & Scale
- Redis caching
- Database replicas
- CDN
- Search optimization

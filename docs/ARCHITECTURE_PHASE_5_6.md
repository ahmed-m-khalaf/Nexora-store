# Nexora Store — Phase 5 & Phase 6 System Architecture

هذا المجلد يحتوي على التخطيط المعماري الهيكلي (Architecture Diagram) الخاص بـ **Phase 5 (Product Catalog Migration)** و **Phase 6 (Server-Driven Cart Architecture)**.

---

## 🎨 ملف الرسم التخطيطي (`.drawio`)

تم إنشاء ملف رسم تخطيطي متكامل بصيغة **Draw.io**:
- 📂 **مسار الملف**: [`docs/architecture-phase-5-6.drawio`](file:///d:/1-Nexora%20store/Nexora-store/docs/architecture-phase-5-6.drawio)

### 💡 كيفية فتح وتعديل الرسم:
1. **في VS Code**: قم بتثبيت إضافة **Draw.io Integration** وافتح الملف مباشرة.
2. **عبر المتصفح**: افتح موقع [app.diagrams.net](https://app.diagrams.net) واقذف الملف `architecture-phase-5-6.drawio` داخل الموقع.

---

## 🏗️ مكونات المعمارية (Architectural Overview)

```text
+-----------------------------------------------------------------------------------+
|                            REACT 19 FRONTEND (CLIENT)                             |
|  • Products.jsx (Search Debounce 400ms, Filter, Sort, Pagination)                  |
|  • CartContext.jsx (Guest UUID, x-cart-id header, Reactive State)                 |
|  • Cart.jsx / ProductDetails.jsx / Navbar.jsx                                     |
+-----------------------------------------------------------------------------------+
                                         │
                        HTTP Requests + x-cart-id Header
                                         ▼
+-----------------------------------------------------------------------------------+
|                           EXPRESS 4 BACKEND API (SERVER)                          |
|  • productController.js (Query Validation, Unified { data, pagination })          |
|  • cartController.js (Zero Price Trust, Math: Subtotal, Tax 10%, Shipping, Total) |
|  • Central Error Handling & CORS Middleware                                        |
+-----------------------------------------------------------------------------------+
                                         │
                             Prisma ORM Queries (Indexed)
                                         ▼
+-----------------------------------------------------------------------------------+
|                        PRISMA ORM + POSTGRESQL (NEON CLOUD)                       |
|  • Product (price Decimal(10,2), indexes: categoryId, price, title)               |
|  • Category (name, slug)                                                          |
|  • Cart (id UUID, userId Int?)                                                    |
|  • CartItem (cartId, productId, quantity, @@unique([cartId, productId]))          |
+-----------------------------------------------------------------------------------+
```

---

## 🔑 المبادئ المعمارية الرئيسية (Architectural Highlights)

1. **حماية الأسعار من التلاعب (Zero Price Trust)**:
   - الواجهة لا ترسل أي أسعار للباك إند، بل ترسل فقط `productId` و `quantity`.
   - السيرفر هو مصدر الثقة الوحيد لحساب `subtotal`, `tax` (10%), `shipping`, و `total`.

2. **التصفح والفلترة على السيرفر (Server-Side Pagination & Filtering)**:
   - يتم إرسال `page`, `limit`, `search`, `category`, `sortBy`, `order` كـ query parameters.
   - يستعلم Prisma من قاعدة بيانات PostgreSQL مع تطبيق الـ Indexes المجهزة لسرعة الأداء.

3. **هوية السلة للمحتوى غير المسجل (Guest Cart Session)**:
   - توليد UUID فريد محلياً لكل زائر وإرساله في الهيدر `x-cart-id` مع كل طلب.
   - السيرفر يقوم بالتعرف على السلة أو إنشائها تلقائياً.

4. **تطبييق العلاقات وتكامل البيانات (Database Normalization)**:
   - جدول `CartItem` يرتبط بـ `Cart` و `Product` عبر المفاتيح الأجنبية (Foreign Keys) مع خاصية الحذف بالتتابع (`onDelete: Cascade`).
   - تجهيز حقل `userId` ملحق بالسلة تسهيلاً لربط حسابات المستخدمين في Phase 8 (Authentication).

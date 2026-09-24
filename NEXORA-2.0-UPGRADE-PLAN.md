# 🚀 NEXORA 2.0: Awwwards-Level Upgrade Plan

> خطة شاملة لتطوير متجر Nexora إلى مستوى عالمي احترافي مع الحفاظ على أداء عالٍ (60+ FPS)

---

## 📋 جدول المحتويات

1. [الرؤية العامة](#-الرؤية-العامة)
2. [تحليل الوضع الحالي](#-تحليل-الوضع-الحالي)
3. [التعديلات على الخطة الأصلية](#️-التعديلات-على-الخطة-الأصلية)
4. [المكتبات والتقنيات](#-المكتبات-والتقنيات)
5. [خطة التنفيذ التفصيلية](#-خطة-التنفيذ-التفصيلية)
6. [أمثلة الأكواد](#-أمثلة-الأكواد)
7. [معايير الأداء](#-معايير-الأداء)
8. [Checklist التنفيذ](#-checklist-التنفيذ)

---

## 🎯 الرؤية العامة

### الأهداف الأساسية (Core Pillars)

```
                     ┌──────────────────────────────┐
                     │   Awwwards-Level Nexora 2.0  │
                     └──────────────┬───────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
┌────────▼─────────┐       ┌────────▼─────────┐       ┌────────▼─────────┐
│   Visual Impact  │       │ Motion & Feel    │       │ Performance      │
│ (GSAP + SVG)     │       │ (Lenis + GSAP)   │       │ (60+ FPS)        │
└──────────────────┘       └──────────────────┘       └──────────────────┘
```

#### 1. Visual Impact (الجاذبية البصرية)
- تصميم فاخر بسيط (Luxury Minimalism)
- أنيميشنز سلسة واحترافية
- تفاعلات ممتعة وغير مزعجة

#### 2. Motion Choreography (تناغم الحركة)
- Smooth Scrolling بـ Lenis
- Parallax Effects ذكية
- Magnetic Interactive Elements
- Stagger Animations

#### 3. Rock-Solid Performance (أداء حديدي)
- 60 FPS ثابت
- No Frame Drops
- Zero Memory Leaks
- Fast Initial Load (<2s)

---

## 📊 تحليل الوضع الحالي

### ✅ نقاط القوة الموجودة

```json
{
  "frontend": {
    "framework": "React 19 + TypeScript",
    "build": "Vite (Fast)",
    "styling": "Tailwind CSS",
    "animation": "GSAP ✓ (Already installed!)",
    "routing": "React Router v7"
  },
  "backend": {
    "runtime": "Node.js + Express",
    "database": "PostgreSQL + Prisma ORM",
    "auth": "JWT + bcrypt ✓",
    "validation": "express-validator"
  },
  "features": {
    "authentication": "✓ Ready",
    "cart": "✓ Backend ready (needs Drawer UI)",
    "checkout": "✓ Complete flow",
    "products": "✓ Full CRUD with pagination"
  }
}
```

### ⚠️ الفجوات الحالية (Gaps)

| المشكلة | الوضع الحالي | المطلوب |
|---------|--------------|---------|
| **Cart UX** | صفحة منفصلة فقط | Slide-over Drawer سريع |
| **Smooth Scroll** | Default browser scroll | Lenis inertia scroll |
| **Product Preview** | فتح صفحة كاملة | Quick View Modal |
| **Wishlist** | غير موجود | نظام كامل Frontend + Backend |
| **Coupons** | غير موجود | Discount codes system |
| **Reviews** | غير موجود | Rating & Comments system |
| **Animations** | GSAP موجود لكن غير مستغل | Advanced ScrollTrigger & Magnetic |

---

## ✂️ التعديلات على الخطة الأصلية

### ❌ نحذف (Performance Killers)

#### 1. Three.js Hero 3D Scene
**السبب:**
- يضيف ~500KB للـ bundle
- يستهلك GPU بشكل مستمر
- يؤخر First Contentful Paint
- يحتاج WebGL (مشاكل على بعض الأجهزة)

**البديل الأفضل:**
```tsx
// SVG Morphing Animation (خفيف جداً ~5KB)
<motion.svg>
  <motion.path 
    d={currentPath}
    animate={{ d: targetPath }}
    transition={{ duration: 3, repeat: Infinity }}
  />
</motion.svg>
```

#### 2. 3D Product Viewer
**السبب:**
- يحتاج 3D models لكل منتج (غير متوفر)
- معقد جداً للتنفيذ
- لا يضيف قيمة حقيقية للمنتجات الحالية

**البديل الأفضل:**
```tsx
// 360° Image Viewer + Zoom (أكثر واقعية)
<ImageGallery 
  images={product.images}
  zoom={true}
  preview={true}
/>
```

#### 3. Custom Cursor
**السبب:**
- مزعج للمستخدمين
- يؤثر على Accessibility
- يخالف توقعات UX المعتادة

**نبقي فقط:**
- Magnetic Buttons (تأثير جميل بدون إزعاج)

---

### ✅ نبقي ونطور (Performance-Friendly)

| Feature | Priority | Impact | Difficulty |
|---------|----------|--------|------------|
| **Lenis Smooth Scroll** | 🔥 High | Visual + Feel | Easy |
| **GSAP Advanced Animations** | 🔥 High | Visual | Medium |
| **Magnetic Buttons** | 🔥 High | Feel | Easy |
| **Cart Drawer** | 🔥 Critical | UX | Medium |
| **Wishlist System** | ⭐ Medium | Feature | Medium |
| **Coupons System** | ⭐ Medium | Feature | Easy |
| **Reviews System** | ⭐ Medium | Feature | Medium |
| **Canvas Confetti** | 💫 Low | Fun | Easy |
| **Quick View Modal** | ⭐ Medium | UX | Easy |

---

## 📦 المكتبات والتقنيات

### Frontend Dependencies

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.9.6",
    "gsap": "^3.15.0",
    "lenis": "^1.0.0",
    "canvas-confetti": "^1.9.0"
  },
  "devDependencies": {
    "@types/canvas-confetti": "^1.6.0",
    "vite-plugin-compression": "^0.5.1"
  }
}
```

### Backend Dependencies (إضافات)

```json
{
  "dependencies": {
    "@prisma/client": "^6.19.3",
    "express": "^4.21.2",
    "express-validator": "^7.0.1"
  }
}
```

### لماذا هذه المكتبات بالذات؟

#### Lenis
```
✓ أخف من Locomotive Scroll (~15KB vs ~45KB)
✓ أداء أفضل على Mobile
✓ Inertia scrolling طبيعي جداً
✓ يتكامل مع GSAP ScrollTrigger بسلاسة
```

#### GSAP
```
✓ موجود بالفعل في المشروع!
✓ أقوى مكتبة أنيميشن (Industry standard)
✓ Performance ممتاز
✓ ScrollTrigger plugin قوي جداً
```

#### Canvas Confetti
```
✓ خفيف جداً (~8KB)
✓ Pure Canvas (no DOM manipulation)
✓ 60 FPS guaranteed
✓ تأثير احتفالي جميل
```

---

## 🗓️ خطة التنفيذ التفصيلية

### Phase 1: Setup & Dependencies (Day 1)

#### 1.1 تثبيت المكتبات

```bash
# Frontend
cd Nexora-store
npm install lenis canvas-confetti
npm install -D @types/canvas-confetti

# Backend (لاحقاً في Phase 4)
cd backend
# No new dependencies needed for now
```

#### 1.2 إعداد البنية الأساسية

```typescript
// src/lib/lenis.ts
import Lenis from 'lenis'

export function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false, // Better for mobile performance
    touchMultiplier: 2,
    infinite: false,
  })

  return lenis
}
```

```typescript
// src/hooks/useSmoothScroll.ts
import { useEffect } from 'react'
import { initLenis } from '../lib/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = initLenis()

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])
}
```

**الملفات الجديدة:**
```
src/
├── lib/
│   ├── lenis.ts          ← New
│   └── confetti.ts       ← New
├── hooks/
│   ├── useSmoothScroll.ts  ← New
│   └── useGSAP.ts          ← New
```

---

### Phase 2: Motion Design Foundation (Day 2-3)

#### 2.1 Magnetic Button Component

```typescript
// src/components/common/MagneticButton.tsx
import { useRef, type ReactNode, type MouseEvent } from 'react'
import gsap from 'gsap'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  strength?: number // 0.1 - 0.5 (default: 0.3)
}

export default function MagneticButton({ 
  children, 
  className = '', 
  onClick,
  strength = 0.3 
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return
    
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    gsap.to(buttonRef.current, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: 'power2.out'
    })

    // Text moves slightly more
    gsap.to(textRef.current, {
      x: deltaX * 0.5,
      y: deltaY * 0.5,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const handleMouseLeave = () => {
    gsap.to([buttonRef.current, textRef.current], {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    })
  }

  return (
    <button
      ref={buttonRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <span ref={textRef} className="inline-block">
        {children}
      </span>
    </button>
  )
}
```

#### 2.2 Enhanced ScrollReveal

```typescript
// src/components/common/ScrollReveal.tsx (Enhanced version)
import { useRef, useEffect, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  delay?: number
  stagger?: number
  className?: string
}

export default function ScrollReveal({ 
  children, 
  direction = 'up',
  delay = 0,
  stagger = 0,
  className = '' 
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const elements = ref.current.children
    
    const animations: Record<string, object> = {
      up: { y: 60, opacity: 0 },
      down: { y: -60, opacity: 0 },
      left: { x: 60, opacity: 0 },
      right: { x: -60, opacity: 0 },
      fade: { opacity: 0 }
    }

    gsap.set(elements, animations[direction])

    const ctx = gsap.context(() => {
      gsap.to(elements, {
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 0,
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay,
        stagger: stagger || 0.1,
        ease: 'power3.out'
      })
    })

    return () => ctx.revert()
  }, [direction, delay, stagger])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
```

#### 2.3 Parallax Component

```typescript
// src/components/common/Parallax.tsx
import { useRef, useEffect, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface ParallaxProps {
  children: ReactNode
  speed?: number // 0.5 = slower, 2 = faster
  direction?: 'vertical' | 'horizontal'
  className?: string
}

export default function Parallax({ 
  children, 
  speed = 0.5,
  direction = 'vertical',
  className = '' 
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const movement = direction === 'vertical' ? { y: 100 * speed } : { x: 100 * speed }

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        ...movement,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })
    })

    return () => ctx.revert()
  }, [speed, direction])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
```

**الملفات الجديدة:**
```
src/components/common/
├── MagneticButton.tsx    ← New
├── Parallax.tsx          ← New
└── ScrollReveal.tsx      ← Enhanced
```

---

### Phase 3: UI/UX Upgrades (Day 4-5)

#### 3.1 Cart Drawer Component

```typescript
// src/components/cart/CartDrawer.tsx
import { useEffect, useRef, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { FiX, FiShoppingBag, FiTrash2, FiMinus, FiPlus } from 'react-icons/fi'
import { useCart } from '../../features/cart/useCart'
import gsap from 'gsap'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const overlayRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      
      // Animate in
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 })
      gsap.to(drawerRef.current, { x: 0, duration: 0.4, ease: 'power3.out' })
    } else {
      document.body.style.overflow = ''
      
      // Animate out
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
      gsap.to(drawerRef.current, { x: '100%', duration: 0.3, ease: 'power3.in' })
    }
  }, [isOpen])

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  const total = getCartTotal()
  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      style={{ opacity: 0 }}
      onClick={handleOverlayClick}
    >
      <div
        ref={drawerRef}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl"
        style={{ transform: 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <FiShoppingBag className="text-2xl text-primary-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
              <p className="text-sm text-slate-500">{itemCount} items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Close cart"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex h-[calc(100%-200px)] flex-col overflow-y-auto p-6">
          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
              <div className="rounded-full bg-slate-100 p-6">
                <FiShoppingBag className="text-4xl text-slate-400" />
              </div>
              <p className="text-slate-500">Your cart is empty</p>
              <button
                onClick={onClose}
                className="rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-lg border border-slate-200 p-4 transition hover:shadow-md"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="h-20 w-20 rounded-lg bg-slate-50 object-contain"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 line-clamp-1">
                      {item.product.title}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-primary-600">
                      ${item.product.price.toFixed(2)}
                    </p>
                    
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="rounded bg-slate-100 p-1 transition hover:bg-slate-200 disabled:opacity-40"
                      >
                        <FiMinus className="text-sm" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="rounded bg-slate-100 p-1 transition hover:bg-slate-200"
                      >
                        <FiPlus className="text-sm" />
                      </button>
                      
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="ml-auto rounded bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-slate-600">Subtotal</span>
              <span className="text-2xl font-bold text-slate-900">${total.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full rounded-lg bg-primary-600 py-4 text-center font-bold text-white transition hover:bg-primary-700"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
```

#### 3.2 Quick View Modal

```typescript
// src/components/catalog/QuickViewModal.tsx
import { useRef, useEffect, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { FiX, FiShoppingBag, FiStar } from 'react-icons/fi'
import { useCart } from '../../features/cart/useCart'
import type { Product } from '../../types'
import gsap from 'gsap'

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart()
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && product) {
      document.body.style.overflow = 'hidden'
      
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.2 })
      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      )
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen, product])

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    await addToCart(product.id, 1)
    onClose()
  }

  if (!isOpen || !product) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      style={{ opacity: 0 }}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg transition hover:bg-slate-100"
        >
          <FiX className="text-xl" />
        </button>

        <div className="grid gap-6 p-8 md:grid-cols-2">
          {/* Image */}
          <div className="flex items-center justify-center rounded-xl bg-slate-50 p-8">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-80 w-full object-contain"
            />
          </div>

          {/* Details */}
          <div>
            <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold capitalize text-primary-700">
              {product.category}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">{product.title}</h2>
            <p className="mt-2 text-3xl font-bold text-primary-600">${product.price.toFixed(2)}</p>

            <div className="mt-4 flex items-center gap-2">
              <FiStar className="fill-amber-400 text-amber-400" />
              <span className="font-semibold">{product.rating.rate.toFixed(1)}</span>
              <span className="text-slate-500">({product.rating.count} reviews)</span>
            </div>

            <p className="mt-6 text-slate-600 line-clamp-4">{product.description}</p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 py-4 font-bold text-white transition hover:bg-primary-700"
              >
                <FiShoppingBag />
                Add to Cart
              </button>
              <Link
                to={`/product/${product.id}`}
                className="flex items-center justify-center rounded-lg border-2 border-slate-300 px-6 font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

#### 3.3 Wishlist System

```typescript
// src/features/wishlist/WishlistContext.tsx
import { createContext, useState, useCallback, type ReactNode } from 'react'
import type { Product } from '../../types'

interface WishlistContextType {
  wishlist: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: number) => void
  isInWishlist: (productId: number) => boolean
  toggleWishlist: (product: Product) => void
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nexora-wishlist')
    return saved ? JSON.parse(saved) : []
  })

  const addToWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      const updated = [...prev, product]
      localStorage.setItem('nexora-wishlist', JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeFromWishlist = useCallback((productId: number) => {
    setWishlist((prev) => {
      const updated = prev.filter((p) => p.id !== productId)
      localStorage.setItem('nexora-wishlist', JSON.stringify(updated))
      return updated
    })
  }, [])

  const isInWishlist = useCallback(
    (productId: number) => wishlist.some((p) => p.id === productId),
    [wishlist]
  )

  const toggleWishlist = useCallback(
    (product: Product) => {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id)
      } else {
        addToWishlist(product)
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  )

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  )
}
```

```typescript
// src/components/common/WishlistButton.tsx
import { useRef } from 'react'
import { FiHeart } from 'react-icons/fi'
import { useWishlist } from '../../features/wishlist/useWishlist'
import type { Product } from '../../types'
import gsap from 'gsap'

interface WishlistButtonProps {
  product: Product
  className?: string
}

export default function WishlistButton({ product, className = '' }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isFavorite = isInWishlist(product.id)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    toggleWishlist(product)

    // Heart beat animation
    if (!isFavorite) {
      gsap.fromTo(
        buttonRef.current,
        { scale: 1 },
        { 
          scale: [1, 1.4, 1], 
          duration: 0.4, 
          ease: 'back.out(2)' 
        }
      )
    }
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`rounded-full p-2 transition ${
        isFavorite
          ? 'bg-red-50 text-red-600'
          : 'bg-white/80 text-slate-400 hover:bg-white hover:text-red-500'
      } ${className}`}
      aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <FiHeart className={`text-xl ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  )
}
```

**الملفات الجديدة:**
```
src/
├── components/
│   ├── cart/
│   │   └── CartDrawer.tsx           ← New
│   ├── catalog/
│   │   └── QuickViewModal.tsx       ← New
│   └── common/
│       └── WishlistButton.tsx       ← New
├── features/
│   └── wishlist/
│       ├── WishlistContext.tsx      ← New
│       └── useWishlist.ts           ← New
```

---

### Phase 4: Backend Enhancements (Day 6-7)

#### 4.1 Database Schema Updates

```prisma
// backend/prisma/schema.prisma (إضافات جديدة)

model Coupon {
  id              Int       @id @default(autoincrement())
  code            String    @unique
  discountPercent Decimal   @db.Decimal(5, 2)
  discountFixed   Decimal?  @db.Decimal(10, 2)
  type            CouponType @default(PERCENTAGE)
  maxUses         Int?
  currentUses     Int       @default(0)
  minPurchase     Decimal?  @db.Decimal(10, 2)
  active          Boolean   @default(true)
  expiresAt       DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([code])
  @@index([active])
}

enum CouponType {
  PERCENTAGE
  FIXED
}

model Review {
  id          Int      @id @default(autoincrement())
  productId   Int
  userId      Int
  rating      Int      // 1-5
  comment     String?  @db.Text
  verified    Boolean  @default(false)
  helpful     Int      @default(0)
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([productId, userId])
  @@index([productId])
  @@index([userId])
  @@index([rating])
}

// Update Product model
model Product {
  // ... existing fields
  reviews     Review[]
  avgRating   Decimal?  @db.Decimal(2, 1)
  reviewCount Int       @default(0)
}

// Update User model
model User {
  // ... existing fields
  reviews     Review[]
}
```

#### 4.2 Migration

```bash
cd backend
npx prisma migrate dev --name add_coupons_and_reviews
npx prisma generate
```

#### 4.3 Coupon Controller

```javascript
// backend/src/controllers/couponController.js
import { prisma } from '../lib/prisma.js'

export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!coupon) {
      return res.status(404).json({ error: 'Invalid coupon code' })
    }

    if (!coupon.active) {
      return res.status(400).json({ error: 'This coupon is no longer active' })
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'This coupon has expired' })
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return res.status(400).json({ error: 'This coupon has reached its usage limit' })
    }

    if (coupon.minPurchase && cartTotal < Number(coupon.minPurchase)) {
      return res.status(400).json({
        error: `Minimum purchase of $${coupon.minPurchase} required`
      })
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = (cartTotal * Number(coupon.discountPercent)) / 100
    } else {
      discountAmount = Number(coupon.discountFixed)
    }

    return res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        discount: coupon.type === 'PERCENTAGE' ? coupon.discountPercent : coupon.discountFixed
      },
      discountAmount: Math.min(discountAmount, cartTotal)
    })
  } catch (error) {
    console.error('Coupon validation error:', error)
    return res.status(500).json({ error: 'Failed to validate coupon' })
  }
}

export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body

    await prisma.coupon.update({
      where: { code: code.toUpperCase() },
      data: { currentUses: { increment: 1 } }
    })

    return res.json({ success: true })
  } catch (error) {
    console.error('Coupon application error:', error)
    return res.status(500).json({ error: 'Failed to apply coupon' })
  }
}
```

#### 4.4 Review Controller

```javascript
// backend/src/controllers/reviewController.js
import { prisma } from '../lib/prisma.js'

export const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params
    const { page = 1, limit = 10, sort = 'recent' } = req.query

    const orderBy = sort === 'helpful' 
      ? { helpful: 'desc' }
      : sort === 'rating_high'
      ? { rating: 'desc' }
      : sort === 'rating_low'
      ? { rating: 'asc' }
      : { createdAt: 'desc' }

    const reviews = await prisma.review.findMany({
      where: { productId: Number(id) },
      include: {
        user: {
          select: { id: true, name: true }
        }
      },
      orderBy,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    })

    const total = await prisma.review.count({
      where: { productId: Number(id) }
    })

    const stats = await prisma.review.groupBy({
      by: ['rating'],
      where: { productId: Number(id) },
      _count: { rating: true }
    })

    return res.json({
      reviews,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      },
      stats
    })
  } catch (error) {
    console.error('Get reviews error:', error)
    return res.status(500).json({ error: 'Failed to fetch reviews' })
  }
}

export const createReview = async (req, res) => {
  try {
    const { id } = req.params
    const { rating, comment } = req.body
    const userId = req.user.id

    // Check if user already reviewed
    const existing = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId: Number(id),
          userId
        }
      }
    })

    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this product' })
    }

    const review = await prisma.review.create({
      data: {
        productId: Number(id),
        userId,
        rating: Number(rating),
        comment
      },
      include: {
        user: {
          select: { id: true, name: true }
        }
      }
    })

    // Update product avg rating
    const avgRating = await prisma.review.aggregate({
      where: { productId: Number(id) },
      _avg: { rating: true },
      _count: { rating: true }
    })

    await prisma.product.update({
      where: { id: Number(id) },
      data: {
        avgRating: avgRating._avg.rating,
        reviewCount: avgRating._count.rating
      }
    })

    return res.status(201).json(review)
  } catch (error) {
    console.error('Create review error:', error)
    return res.status(500).json({ error: 'Failed to create review' })
  }
}
```

#### 4.5 Routes

```javascript
// backend/src/routes/couponRoutes.js
import express from 'express'
import { validateCoupon, applyCoupon } from '../controllers/couponController.js'
import { body } from 'express-validator'
import { validate } from '../middleware/validators/index.js'

const router = express.Router()

router.post(
  '/validate',
  [
    body('code').trim().notEmpty().withMessage('Coupon code is required'),
    body('cartTotal').isFloat({ min: 0 }).withMessage('Valid cart total is required'),
    validate
  ],
  validateCoupon
)

router.post(
  '/apply',
  [
    body('code').trim().notEmpty().withMessage('Coupon code is required'),
    validate
  ],
  applyCoupon
)

export default router
```

```javascript
// backend/src/routes/reviewRoutes.js
import express from 'express'
import { getProductReviews, createReview } from '../controllers/reviewController.js'
import { authenticate } from '../middleware/auth.js'
import { body } from 'express-validator'
import { validate } from '../middleware/validators/index.js'

const router = express.Router()

router.get('/products/:id/reviews', getProductReviews)

router.post(
  '/products/:id/reviews',
  authenticate,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim(),
    validate
  ],
  createReview
)

export default router
```

#### 4.6 Update App.js

```javascript
// backend/src/app.js (add routes)
import couponRoutes from './routes/couponRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'

// ... existing routes
app.use('/api/coupons', couponRoutes)
app.use('/api', reviewRoutes)
```

#### 4.7 Seed Sample Coupons

```javascript
// backend/prisma/seedCoupons.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎫 Seeding coupons...')

  const coupons = [
    {
      code: 'WELCOME10',
      type: 'PERCENTAGE',
      discountPercent: 10,
      maxUses: 100,
      active: true,
      expiresAt: new Date('2027-12-31')
    },
    {
      code: 'SAVE20',
      type: 'PERCENTAGE',
      discountPercent: 20,
      minPurchase: 100,
      maxUses: 50,
      active: true,
      expiresAt: new Date('2027-06-30')
    },
    {
      code: 'FREESHIP',
      type: 'FIXED',
      discountFixed: 10,
      active: true,
      expiresAt: new Date('2027-12-31')
    }
  ]

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: coupon,
      create: coupon
    })
  }

  console.log('✅ Coupons seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

**الملفات الجديدة:**
```
backend/
├── src/
│   ├── controllers/
│   │   ├── couponController.js     ← New
│   │   └── reviewController.js     ← New
│   └── routes/
│       ├── couponRoutes.js         ← New
│       └── reviewRoutes.js         ← New
└── prisma/
    ├── migrations/
    │   └── xxx_add_coupons_reviews/
    └── seedCoupons.js              ← New
```

---

### Phase 5: Performance Optimizations (Day 8)

#### 5.1 Image Optimization

```typescript
// src/components/common/ProgressiveImage.tsx
import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

interface ProgressiveImageProps {
  src: string
  alt: string
  placeholder?: string
  className?: string
}

export default function ProgressiveImage({ 
  src, 
  alt, 
  placeholder = '/products/placeholder.svg',
  className = '' 
}: ProgressiveImageProps) {
  const [imgSrc, setImgSrc] = useState(placeholder)
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setImgSrc(src)
      setIsLoaded(true)
    }
  }, [src])

  useEffect(() => {
    if (isLoaded && imgRef.current) {
      gsap.fromTo(
        imgRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
      )
    }
  }, [isLoaded])

  return (
    <img
      ref={imgRef}
      src={imgSrc}
      alt={alt}
      className={`${className} ${!isLoaded ? 'blur-sm' : ''}`}
      loading="lazy"
    />
  )
}
```

#### 5.2 Code Splitting

```typescript
// src/app/App.tsx (update)
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Eager load critical routes
import Home from '../pages/Home'
import Products from '../pages/Products'

// Lazy load heavy components
const CartDrawer = lazy(() => import('../components/cart/CartDrawer'))
const QuickViewModal = lazy(() => import('../components/catalog/QuickViewModal'))
const ProductDetails = lazy(() => import('../pages/ProductDetails'))
const Checkout = lazy(() => import('../pages/Checkout'))
const Account = lazy(() => import('../pages/Account'))

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        {/* ... routes */}
      </Suspense>
    </BrowserRouter>
  )
}
```

#### 5.3 GSAP Cleanup Hook

```typescript
// src/hooks/useGSAP.ts
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useGSAP(callback: (ctx: gsap.Context) => void, deps: any[] = []) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      callback(ctx)
    }, ref)

    return () => ctx.revert() // Auto cleanup!
  }, deps)

  return ref
}
```

#### 5.4 Bundle Optimization

```typescript
// vite.config.ts (update)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    })
  ],
  build: {
    emptyOutDir: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'gsap-vendor': ['gsap'],
          'lenis-vendor': ['lenis']
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'gsap', 'lenis']
  }
})
```

---

## 💻 أمثلة الأكواد

### Hero Section with SVG Morph

```typescript
// src/components/catalog/Hero.tsx (Enhanced)
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import MagneticButton from '../common/MagneticButton'
import Parallax from '../common/Parallax'
import type { Product } from '../../types'

export default function Hero({ featuredProduct }: { featuredProduct?: Product }) {
  const shapeRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!shapeRef.current) return

    // Organic shape morphing
    const shapes = [
      'M50,10 C30,10 10,30 10,50 C10,70 30,90 50,90 C70,90 90,70 90,50 C90,30 70,10 50,10',
      'M50,5 C25,5 5,25 5,50 C5,75 25,95 50,95 C75,95 95,75 95,50 C95,25 75,5 50,5',
      'M50,15 C35,15 15,35 15,50 C15,65 35,85 50,85 C65,85 85,65 85,50 C85,35 65,15 50,15'
    ]

    gsap.to(shapeRef.current, {
      attr: { d: shapes[1] },
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }, [])

  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Animated Background Shape */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <linearGradient id="shapeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path
            ref={shapeRef}
            d="M50,10 C30,10 10,30 10,50 C10,70 30,90 50,90 C70,90 90,70 90,50 C90,30 70,10 50,10"
            fill="url(#shapeGradient)"
            opacity="0.5"
          />
        </svg>
      </div>

      <div className="container relative mx-auto px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold leading-tight text-slate-900 md:text-6xl lg:text-7xl">
              Discover Your
              <span className="block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Perfect Style
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 md:text-xl">
              Curated collection of premium products for modern living
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <MagneticButton
                className="rounded-full bg-primary-600 px-8 py-4 font-bold text-white shadow-lg transition hover:shadow-xl"
                strength={0.2}
              >
                <Link to="/products">Shop Now</Link>
              </MagneticButton>

              <MagneticButton
                className="rounded-full border-2 border-slate-300 px-8 py-4 font-bold text-slate-700 transition hover:border-slate-400"
                strength={0.2}
              >
                <Link to="/products">Explore</Link>
              </MagneticButton>
            </div>
          </div>

          {/* Featured Product */}
          {featuredProduct && (
            <Parallax speed={0.3}>
              <Link
                to={`/product/${featuredProduct.id}`}
                className="group block rounded-2xl bg-white p-8 shadow-xl transition hover:shadow-2xl"
              >
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.title}
                  className="mx-auto h-64 w-full object-contain transition group-hover:scale-105"
                />
                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {featuredProduct.title}
                </h3>
                <p className="mt-2 text-2xl font-bold text-primary-600">
                  ${featuredProduct.price.toFixed(2)}
                </p>
              </Link>
            </Parallax>
          )}
        </div>
      </div>
    </div>
  )
}
```

### Confetti on Checkout Success

```typescript
// src/lib/confetti.ts
import confetti from 'canvas-confetti'

export function celebrateOrder() {
  const duration = 3000
  const end = Date.now() + duration

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']

  const frame = () => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors
    })
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }

  frame()
}
```

```typescript
// src/pages/Checkout.tsx (add after successful order)
import { celebrateOrder } from '../lib/confetti'

// After order success
celebrateOrder()
```

---

## 📊 معايير الأداء

### Performance Budget

| Metric | Current | Target | After Upgrade |
|--------|---------|--------|---------------|
| **Lighthouse Performance** | ~85 | ≥90 | 90-95 |
| **First Contentful Paint** | ~1.8s | <1.5s | <1.3s |
| **Largest Contentful Paint** | ~2.5s | <2.5s | <2.0s |
| **Time to Interactive** | ~3.5s | <3.0s | <2.8s |
| **Total Blocking Time** | ~200ms | <200ms | <150ms |
| **Cumulative Layout Shift** | <0.1 | <0.1 | <0.05 |
| **Bundle Size (gzipped)** | ~380KB | <500KB | ~450KB |
| **FPS (Desktop)** | 60 | 60 | 60 |
| **FPS (Mobile)** | 45-60 | 50-60 | 50-60 |

### Testing Checklist

```markdown
#### Desktop (Chrome DevTools)
- [ ] Lighthouse score ≥90
- [ ] Smooth scroll 60fps
- [ ] No layout shifts
- [ ] No memory leaks (test with 10 page navigations)
- [ ] GSAP animations smooth
- [ ] Magnetic buttons responsive

#### Mobile (Chrome DevTools - Mobile Emulation)
- [ ] Performance score ≥85
- [ ] Touch scroll smooth
- [ ] Cart drawer animations smooth
- [ ] Images load progressively
- [ ] No horizontal scroll
- [ ] Touch targets ≥48px

#### Slow 3G (Network Throttling)
- [ ] Page loads in <5s
- [ ] Skeleton loaders show properly
- [ ] Images lazy load correctly
- [ ] No broken layouts

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color contrast ≥4.5:1
- [ ] Screen reader friendly
```

---

## ✅ Checklist التنفيذ

### Week 1: Foundation & Motion

#### Day 1: Setup
- [ ] Install `lenis` and `canvas-confetti`
- [ ] Create `src/lib/lenis.ts`
- [ ] Create `src/hooks/useSmoothScroll.ts`
- [ ] Test smooth scroll on Home page

#### Day 2: GSAP Components
- [ ] Create `MagneticButton.tsx`
- [ ] Enhance `ScrollReveal.tsx`
- [ ] Create `Parallax.tsx`
- [ ] Create `useGSAP.ts` hook

#### Day 3: Hero & Animations
- [ ] Update Hero with SVG morphing
- [ ] Add magnetic buttons to CTAs
- [ ] Add parallax to featured product
- [ ] Test all animations

### Week 2: UI/UX & Backend

#### Day 4: Cart & Wishlist
- [ ] Create `CartDrawer.tsx`
- [ ] Create `WishlistContext.tsx`
- [ ] Create `WishlistButton.tsx`
- [ ] Update Navbar with cart/wishlist icons
- [ ] Test drawer animations

#### Day 5: Quick View & Polish
- [ ] Create `QuickViewModal.tsx`
- [ ] Add quick view to product cards
- [ ] Create `ProgressiveImage.tsx`
- [ ] Update product images

#### Day 6-7: Backend
- [ ] Add Coupon & Review models to schema
- [ ] Run migrations
- [ ] Create coupon controller & routes
- [ ] Create review controller & routes
- [ ] Seed sample coupons
- [ ] Test API endpoints

#### Day 8: Optimization
- [ ] Add code splitting
- [ ] Optimize images
- [ ] Update vite config
- [ ] Run Lighthouse audit
- [ ] Fix performance issues
- [ ] Test on mobile

### Week 3: Integration & Polish

#### Day 9-10: Frontend-Backend Integration
- [ ] Integrate coupon API in checkout
- [ ] Add coupon input UI
- [ ] Integrate reviews API
- [ ] Create review submission form
- [ ] Create review display component

#### Day 11: Confetti & Micro-interactions
- [ ] Add confetti to order success
- [ ] Add loading states with GSAP
- [ ] Add hover states to cards
- [ ] Polish all transitions

#### Day 12: Testing & Fixes
- [ ] Full E2E testing
- [ ] Mobile testing
- [ ] Fix bugs
- [ ] Performance optimization
- [ ] Documentation

---

## 🚀 النتيجة المتوقعة

### ما سيحصل عليه المستخدم

#### Visual Experience (التجربة البصرية)
```
✓ Smooth scrolling فائق النعومة
✓ Parallax effects ذكية وغير مزعجة
✓ Magnetic buttons ممتعة التفاعل
✓ Stagger animations للبطاقات
✓ Hero مع SVG morphing أنيق
✓ Progressive image loading
✓ Micro-interactions في كل مكان
```

#### UX Improvements (تحسينات تجربة المستخدم)
```
✓ Cart Drawer سريع (بدل صفحة كاملة)
✓ Quick View للمنتجات
✓ Wishlist system كامل
✓ Coupon codes للخصومات
✓ Review system للتقييمات
✓ Confetti celebrations
✓ Better loading states
```

#### Performance (الأداء)
```
✓ 60 FPS ثابت
✓ Fast initial load (<2s)
✓ No memory leaks
✓ Optimized bundle size
✓ Mobile-friendly
✓ Lighthouse score ≥90
```

### ما تم تجنبه

```
✗ Three.js overhead (500KB+)
✗ WebGL complexity
✗ Custom cursor annoyance
✗ 3D models requirement
✗ Performance bottlenecks
✗ Accessibility issues
```

---

## 📚 Resources & Documentation

### Libraries Documentation
- [Lenis Smooth Scroll](https://github.com/studio-freight/lenis)
- [GSAP](https://greensock.com/docs/)
- [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- [Prisma](https://www.prisma.io/docs)

### Awwwards Inspiration (Without the bloat)
- Focus on **motion** not **complexity**
- **Purposeful** animations only
- **Performance first** always
- **User experience** over wow factor

---

## 🎯 Success Criteria

المشروع يعتبر ناجح عندما:

1. ✅ **Lighthouse Performance ≥90**
2. ✅ **Smooth 60fps scrolling**
3. ✅ **Cart Drawer يعمل بسلاسة**
4. ✅ **Wishlist system functional**
5. ✅ **Coupons system working**
6. ✅ **Reviews display properly**
7. ✅ **Mobile experience excellent**
8. ✅ **No console errors**
9. ✅ **All animations smooth**
10. ✅ **Load time <2s on 4G**

---

## 🔄 Next Steps

بعد إنهاء هذه الخطة:

### Phase 2.0 (Optional Future Enhancements)
- [ ] Admin dashboard for coupon management
- [ ] Email notifications for orders
- [ ] Social sharing for products
- [ ] Image zoom on hover
- [ ] Product comparison feature
- [ ] Advanced filters (price range, rating)
- [ ] Related products recommendations
- [ ] Order tracking system

---

**تاريخ الإنشاء:** 2026-09-20  
**الإصدار:** 2.0 Realistic Edition  
**الحالة:** Ready for Implementation 🚀

---


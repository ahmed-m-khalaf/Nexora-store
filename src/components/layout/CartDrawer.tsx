/**
 * Cart Drawer Component
 *
 * Slide-over drawer from the right side with GSAP animations.
 * Shows cart items with quantity controls, order summary, and checkout CTA.
 * Supports swipe-to-dismiss on mobile and keyboard (Escape) to close.
 */

import { useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiX, FiShoppingBag, FiArrowRight, FiTrash2, FiMinus, FiPlus } from 'react-icons/fi'
import gsap from 'gsap'
import { useCart } from '../../features/cart/useCart'
import { useCartDrawer } from '../../hooks/useCartDrawer'
import { useCoupon } from '../../features/coupons/useCoupon'
import CouponInput from '../cart/CouponInput'

export default function CartDrawer() {
  const { isOpen, close } = useCartDrawer()
  const { cart, cartData, loading, removeFromCart, updateQuantity, clearCart } = useCart()
  const { applyCoupon, removeCoupon, getAppliedCoupon } = useCoupon()
  const navigate = useNavigate()

  const appliedCoupon = getAppliedCoupon(cartData.subtotal, cartData.shipping)
  const discountAmount = appliedCoupon?.discountAmount || 0
  const finalTotal = Math.max(0, cartData.total - discountAmount)

  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

  // Touch tracking for swipe-to-dismiss
  const touchStartX = useRef(0)
  const touchDeltaX = useRef(0)
  const isSwiping = useRef(false)

  // ----- GSAP Animations -----
  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dur = reducedMotion ? 0 : 0.4

    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden'

      // Animate in
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: dur,
        ease: 'power2.out',
        onStart() {
          overlayRef.current!.style.pointerEvents = 'auto'
        },
      })

      gsap.fromTo(
        panelRef.current,
        { x: '100%' },
        { x: '0%', duration: dur, ease: 'power3.out' },
      )

      // Stagger items in
      if (itemsRef.current && !reducedMotion) {
        const items = itemsRef.current.querySelectorAll('[data-cart-item]')
        if (items.length) {
          gsap.fromTo(
            items,
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out', delay: dur * 0.5 },
          )
        }
      }
    } else {
      // Animate out
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: dur * 0.8,
        ease: 'power2.in',
        onComplete() {
          if (overlayRef.current) overlayRef.current.style.pointerEvents = 'none'
        },
      })

      gsap.to(panelRef.current, {
        x: '100%',
        duration: dur * 0.8,
        ease: 'power3.in',
        onComplete() {
          document.body.style.overflow = ''
        },
      })
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // ----- Keyboard: Escape -----
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, close])

  // ----- Touch: Swipe to dismiss -----
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
    isSwiping.current = false
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const delta = e.touches[0].clientX - touchStartX.current
    touchDeltaX.current = delta

    // Only allow swiping right (positive delta)
    if (delta > 20) {
      isSwiping.current = true
      if (panelRef.current) {
        gsap.set(panelRef.current, { x: delta })
      }
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping.current) return

    if (touchDeltaX.current > 100) {
      // Swipe far enough → close
      close()
    } else {
      // Snap back
      if (panelRef.current) {
        gsap.to(panelRef.current, { x: '0%', duration: 0.3, ease: 'power2.out' })
      }
    }
    isSwiping.current = false
  }, [close])

  // ----- Navigate to checkout -----
  const handleCheckout = () => {
    close()
    navigate('/checkout')
  }

  const handleViewCart = () => {
    close()
    navigate('/cart')
  }

  const isEmpty = !cart || cart.length === 0

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={close}
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
        style={{ opacity: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="fixed top-0 right-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        style={{ transform: 'translateX(100%)' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <FiShoppingBag className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Your Cart
              {cartData.itemCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">
                  {cartData.itemCount}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={close}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close cart"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* ── Body ── */}
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
          </div>
        ) : isEmpty ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
              <FiShoppingBag className="h-10 w-10" />
            </div>
            <p className="text-lg font-semibold text-slate-700">Your cart is empty</p>
            <p className="text-sm text-slate-500">Add items to get started</p>
            <Link
              to="/products"
              onClick={close}
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 active:scale-95"
            >
              Browse Products
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Free shipping bar */}
            <div className="border-b border-slate-100 px-5 py-3">
              <div className="text-xs font-medium text-slate-600">
                {cartData.subtotal >= 100 ? (
                  <span className="text-green-600 font-semibold">🎉 Free shipping unlocked!</span>
                ) : (
                  <>
                    <span className="font-bold text-primary-600">${(100 - cartData.subtotal).toFixed(2)}</span> away from free shipping
                  </>
                )}
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${cartData.subtotal >= 100 ? 'bg-green-500' : 'bg-primary-500'}`}
                  style={{ width: `${Math.min(100, (cartData.subtotal / 100) * 100)}%` }}
                />
              </div>
            </div>

            {/* Items list */}
            <div ref={itemsRef} className="flex-1 overflow-y-auto overscroll-contain px-5 py-3">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    data-cart-item
                    className="group flex gap-3 rounded-xl border border-slate-100 bg-white p-3 transition hover:border-slate-200 hover:shadow-sm"
                  >
                    {/* Thumbnail */}
                    <Link
                      to={`/product/${item.productId}`}
                      onClick={close}
                      className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 p-1.5"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="h-full w-full object-contain transition group-hover:scale-105"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.productId}`}
                          onClick={close}
                          className="text-sm font-medium text-slate-800 line-clamp-2 leading-tight hover:text-primary-600 transition"
                        >
                          {item.product.title}
                        </Link>
                        <button
                          onClick={() => void removeFromCart(item.productId)}
                          className="flex-shrink-0 rounded-md p-1 text-slate-300 transition hover:bg-red-50 hover:text-red-500"
                          aria-label={`Remove ${item.product.title}`}
                        >
                          <FiTrash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-sm font-bold text-primary-600">
                          ${item.product.price.toFixed(2)}
                        </span>

                        {/* Quantity stepper */}
                        <div className="flex items-center rounded-lg border border-slate-200">
                          <button
                            onClick={() => void updateQuantity(item.productId, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 rounded-l-lg"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus className="h-3 w-3" />
                          </button>
                          <span className="flex h-7 w-7 items-center justify-center text-xs font-semibold text-slate-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => void updateQuantity(item.productId, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 rounded-r-lg"
                            aria-label="Increase quantity"
                          >
                            <FiPlus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear cart */}
              {cart.length > 1 && (
                <button
                  onClick={() => void clearCart()}
                  className="mt-3 flex items-center gap-1.5 text-xs font-medium text-red-500 transition hover:text-red-700"
                >
                  <FiTrash2 className="h-3 w-3" />
                  Clear all
                </button>
              )}
            </div>

            {/* ── Footer: Summary + CTA ── */}
            <div className="border-t border-slate-200 bg-slate-50/80 px-5 py-4 space-y-3">
              {/* Promo code input */}
              <CouponInput
                appliedCoupon={appliedCoupon}
                subtotal={cartData.subtotal}
                shipping={cartData.shipping}
                onApply={(code) => applyCoupon(code, cartData.subtotal, cartData.shipping)}
                onRemove={removeCoupon}
                variant="compact"
              />

              {/* Subtotal row */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold text-slate-900">${cartData.subtotal.toFixed(2)}</span>
              </div>

              {/* Discount row if coupon applied */}
              {appliedCoupon && (
                <div className="flex items-center justify-between text-sm text-emerald-600 font-medium">
                  <span className="flex items-center gap-1">
                    Coupon ({appliedCoupon.code})
                  </span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              {/* Estimated Total */}
              <div className="flex items-center justify-between border-t border-slate-200/80 pt-2 text-base font-bold text-slate-900">
                <span>Estimated Total</span>
                <div className="text-right">
                  {discountAmount > 0 && (
                    <span className="text-xs font-normal text-slate-400 line-through mr-2">
                      ${cartData.total.toFixed(2)}
                    </span>
                  )}
                  <span className="text-primary-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping note */}
              <p className="text-[11px] text-slate-400">Shipping & taxes finalized at checkout</p>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-700 hover:shadow-lg active:scale-[0.98]"
              >
                Proceed to Checkout
                <FiArrowRight className="h-4 w-4" />
              </button>

              {/* View full cart link */}
              <button
                onClick={handleViewCart}
                className="w-full text-center text-xs font-medium text-primary-600 transition hover:text-primary-700 hover:underline"
              >
                View full cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}


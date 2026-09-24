import { useState, useEffect, useRef, type MouseEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiCheck, FiChevronRight, FiMinus, FiPlus, FiShield, FiShoppingBag, FiStar, FiTruck } from 'react-icons/fi'
import { api } from '../services/api'
import { useCart } from '../features/cart/useCart'
import { openCartDrawer } from '../hooks/useCartDrawer'
import FadeIn from '../components/common/FadeIn'
import ProductDetailsSkeleton from '../components/catalog/ProductDetailsSkeleton'
import WishlistButton from '../components/common/WishlistButton'
import ProductReviews from '../components/catalog/ProductReviews'
import type { Product } from '../types'

function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addStatus, setAddStatus] = useState<'idle' | 'added' | 'error'>('idle')
  const [addError, setAddError] = useState('')

  const [showSticky, setShowSticky] = useState(false)
  const ctaRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        if (!id) {
          setError('Invalid product ID.')
          return
        }
        const data = await api.getProductById(Number(id))
        setProduct(data)
      } catch {
        setError('Failed to load product details.')
      } finally {
        setLoading(false)
      }
    }

    void fetchProduct()
  }, [id])

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            // Show sticky bar when main CTA is out of view (above the viewport)
            setShowSticky(entry.boundingClientRect.y < 0 && !entry.isIntersecting)
        },
        { threshold: 0 }
    )

    if (ctaRef.current) {
        observer.observe(ctaRef.current)
    }

    return () => observer.disconnect()
  }, [product, loading])

  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!product) return

    try {
      setAddError('')
      await addToCart(product.id, quantity)
      setAddStatus('added')
      window.setTimeout(() => {
        setAddStatus('idle')
        openCartDrawer()
      }, 600)
    } catch (addError: unknown) {
      setAddStatus('error')
      setAddError(addError instanceof Error ? addError.message : 'Could not add this product.')
    }
  }

  if (loading) return <ProductDetailsSkeleton />
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>
  if (!product) return <div className="text-center py-12">Product not found</div>

  const stock = product.stock ?? 0
  const isOutOfStock = stock <= 0
  const isLowStock = stock > 0 && stock <= 5

  return (
    <FadeIn>
      <div className="container mx-auto px-4 py-8 relative">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-primary-600 transition">Home</Link>
          <FiChevronRight className="h-3.5 w-3.5" />
          <Link to="/products" className="hover:text-primary-600 transition">Catalog</Link>
          <FiChevronRight className="h-3.5 w-3.5" />
          <span className="capitalize text-slate-700">{product.category}</span>
          <FiChevronRight className="h-3.5 w-3.5 hidden sm:inline" />
          <span className="truncate max-w-[200px] text-slate-400 hidden sm:inline">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-8 lg:grid-cols-2 pb-24 md:pb-8">
          <div className="flex min-h-[420px] items-center justify-center rounded-lg bg-slate-50 p-6">
            <img
              src={product.image}
              alt={product.title}
              loading="eager"
              decoding="async"
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = '/products/placeholder.svg'
              }}
              className="max-h-[480px] w-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold capitalize text-primary-700">
                {product.category}
              </span>
              <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                isOutOfStock ? 'bg-red-50 text-red-700' : isLowStock ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {isOutOfStock ? 'Out of stock' : isLowStock ? `Only ${stock} left` : `${stock} in stock`}
              </span>
            </div>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">{product.title}</h1>
            <p className="mb-6 text-4xl font-bold text-primary-600">${product.price.toFixed(2)}</p>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center text-amber-400">
                <FiStar className="h-5 w-5 fill-amber-400" aria-hidden="true" />
              </div>
              <span className="font-semibold text-slate-900">{product.rating.rate.toFixed(1)}</span>
              <span className="text-slate-500">({product.rating.count} customer reviews)</span>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-8 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <FiTruck className="shrink-0 text-primary-600" aria-hidden />
                Free shipping over $100
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <FiShield className="shrink-0 text-primary-600" aria-hidden />
                Secure checkout
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <label className="text-gray-700 font-semibold">Quantity</label>
                <div className="flex items-center rounded-lg border border-gray-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="flex h-10 w-10 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus aria-hidden />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    disabled={isOutOfStock || quantity >= stock}
                    className="flex h-10 w-10 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <FiPlus aria-hidden />
                  </button>
                </div>
              </div>

              {addStatus === 'error' && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{addError}</p>}

              <div className="flex gap-3">
                <button
                  ref={ctaRef}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || addStatus === 'added'}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-4 font-bold text-white shadow-md transition active:scale-[0.99] disabled:cursor-not-allowed ${
                    addStatus === 'added'
                      ? 'bg-emerald-600'
                      : isOutOfStock
                        ? 'bg-slate-300 text-slate-500'
                        : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {addStatus === 'added' ? <><FiCheck aria-hidden /> Added to cart</> : <><FiShoppingBag aria-hidden /> Add to Cart</>}
                </button>
                <WishlistButton product={product} size="lg" showLabel />
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Ratings Section */}
        <ProductReviews product={product} />
      </div>

      {/* Sticky Mobile Add-to-Cart */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 p-3.5 backdrop-blur-lg transition-transform duration-300 md:hidden ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-medium text-slate-500 line-clamp-1">{product.title}</span>
              <span className="font-bold text-slate-900">${product.price.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
              <WishlistButton product={product} size="md" />
              <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || addStatus === 'added'}
                  className={`flex h-10 min-w-[120px] items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-bold text-white shadow-sm transition active:scale-95 disabled:cursor-not-allowed ${
                      addStatus === 'added'
                          ? 'bg-emerald-600'
                          : isOutOfStock
                              ? 'bg-slate-300'
                              : 'bg-primary-600 hover:bg-primary-700'
                  }`}
              >
                  {addStatus === 'added' ? 'Added' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
          </div>
      </div>
    </FadeIn>
  )
}

export default ProductDetails

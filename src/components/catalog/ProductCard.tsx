import { useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { FiCheck, FiEye, FiShoppingBag } from 'react-icons/fi'
import type { Product } from '../../types'
import { useCart } from '../../features/cart/useCart'

type ProductCardProps = { product: Product }

function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart()
    const [isAdded, setIsAdded] = useState(false)
    const [error, setError] = useState('')
    const cardRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const stock = product.stock ?? 0
    const isOutOfStock = stock <= 0
    const isLowStock = stock > 0 && stock <= 5

    const handleMouseEnter = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        gsap.to(cardRef.current, { y: -6, duration: 0.25, ease: 'power2.out', overwrite: true })
        gsap.to(imageRef.current, { scale: 1.06, duration: 0.35, ease: 'power2.out', overwrite: true })
    }

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, { y: 0, duration: 0.3, ease: 'power2.out', overwrite: true })
        gsap.to(imageRef.current, { scale: 1, duration: 0.3, ease: 'power2.out', overwrite: true })
    }

    const handleAddToCart = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (isOutOfStock) return

        try {
            setError('')
            await addToCart(product.id)
            setIsAdded(true)
            window.setTimeout(() => setIsAdded(false), 1500)
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'Could not add this product.')
        }
    }

    const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        gsap.to(event.currentTarget, { scale: 0.97, duration: 0.12, overwrite: true })
    }

    const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        gsap.to(event.currentTarget, { scale: 1, duration: 0.2, ease: 'back.out(2)', overwrite: true })
    }

    return (
        <article ref={cardRef} data-product-card onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl">
            <Link to={`/product/${product.id}`} className="relative block overflow-hidden bg-slate-50 p-5">
                <span className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold capitalize text-slate-600 shadow-sm backdrop-blur">
                    {product.category}
                </span>
                <span className={`absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur ${
                    isOutOfStock ? 'bg-red-50 text-red-700' : isLowStock ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                    {isOutOfStock ? 'Out of stock' : isLowStock ? `${stock} left` : 'In stock'}
                </span>
                <img
                    ref={imageRef}
                    src={product.image || '/products/placeholder.svg'}
                    alt={product.title}
                    loading="lazy"
                    onError={(event) => {
                        event.currentTarget.onerror = null
                        event.currentTarget.src = '/products/placeholder.svg'
                    }}
                    className="h-64 w-full object-contain"
                />
            </Link>
            <div className="flex flex-1 flex-col p-5">
                <Link to={`/product/${product.id}`}>
                    <h3 className="mb-2 line-clamp-2 h-14 text-lg font-semibold text-slate-900 transition-colors group-hover:text-primary-600">
                        {product.title}
                    </h3>
                </Link>
                <p className="mb-3 text-2xl font-bold text-primary-600">${product.price.toFixed(2)}</p>
                <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
                    <span className="text-amber-400">★</span>
                    <span>{product.rating.rate.toFixed(1)}</span>
                    <span>({product.rating.count})</span>
                </div>
                {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                <div className="mt-auto flex gap-2">
                    <button
                        ref={buttonRef}
                        onClick={handleAddToCart}
                        onPointerDown={handlePointerDown}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        disabled={isAdded || isOutOfStock}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${isAdded
                            ? 'cursor-default bg-emerald-600 text-white'
                            : isOutOfStock
                                ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                                : 'bg-primary-600 text-white hover:bg-primary-700'
                            }`}
                    >
                        {isAdded ? <><FiCheck aria-hidden /> Added</> : <><FiShoppingBag aria-hidden /> Add</>}
                    </button>
                    <Link to={`/product/${product.id}`} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200">
                        <FiEye aria-hidden />
                        Details
                    </Link>
                </div>
            </div>
        </article>
    )
}

export default ProductCard

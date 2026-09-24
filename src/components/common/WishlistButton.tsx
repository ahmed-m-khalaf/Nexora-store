import { useRef, type MouseEvent } from 'react'
import { FiHeart } from 'react-icons/fi'
import gsap from 'gsap'
import type { Product } from '../../types'
import { useWishlist } from '../../features/wishlist/useWishlist'

interface WishlistButtonProps {
    product: Product
    className?: string
    size?: 'sm' | 'md' | 'lg'
    showLabel?: boolean
}

export default function WishlistButton({
    product,
    className = '',
    size = 'md',
    showLabel = false,
}: WishlistButtonProps) {
    const { isInWishlist, toggleWishlist } = useWishlist()
    const active = isInWishlist(product.id)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()

        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && buttonRef.current) {
            gsap.timeline()
                .to(buttonRef.current, { scale: 0.75, duration: 0.1, ease: 'power2.in' })
                .to(buttonRef.current, { scale: 1.25, duration: 0.2, ease: 'back.out(3)' })
                .to(buttonRef.current, { scale: 1, duration: 0.15, ease: 'power2.out' })
        }

        toggleWishlist(product)
    }

    const sizeClasses = {
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
    }

    const iconSizes = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    }

    return (
        <button
            ref={buttonRef}
            type="button"
            onClick={handleClick}
            aria-label={active ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
            aria-pressed={active}
            className={`group inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 active:scale-95 ${
                showLabel ? 'px-4 py-2.5 rounded-lg border font-medium text-sm' : sizeClasses[size]
            } ${
                active
                    ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-sm'
                    : 'bg-white/90 backdrop-blur-sm text-slate-500 hover:text-rose-600 hover:bg-rose-50/70 border-slate-200 shadow-sm'
            } ${className}`}
        >
            <FiHeart
                className={`${iconSizes[size]} transition-transform duration-200 group-hover:scale-110 ${
                    active ? 'fill-rose-500 text-rose-500' : ''
                }`}
            />
            {showLabel && (
                <span>{active ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
            )}
        </button>
    )
}

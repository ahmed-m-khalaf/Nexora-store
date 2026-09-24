import { useCallback, useEffect, useState, type PropsWithChildren } from 'react'
import type { Product, WishlistContextValue } from '../../types'
import { WishlistContext } from './wishlistContextValue'
import { useToast } from '../toast/useToast'
import { useCart } from '../cart/useCart'
import { openCartDrawer } from '../../hooks/useCartDrawer'
import { celebrateAction } from '../../lib/confetti'

const STORAGE_KEY = 'nexora_wishlist'

function loadInitialWishlist(): Product[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
    } catch {
        return []
    }
}

export function WishlistProvider({ children }: PropsWithChildren) {
    const [wishlist, setWishlist] = useState<Product[]>(loadInitialWishlist)
    const { success, info } = useToast()
    const { addToCart } = useCart()

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist))
        } catch {
            // localStorage might be unavailable or quota exceeded
        }
    }, [wishlist])

    const isInWishlist = useCallback(
        (productId: number) => wishlist.some((item) => item.id === productId),
        [wishlist]
    )

    const addToWishlist = useCallback(
        (product: Product) => {
            setWishlist((prev) => {
                if (prev.some((p) => p.id === product.id)) return prev
                return [...prev, product]
            })
            success(`Added "${product.title}" to your wishlist`)
            celebrateAction()
        },
        [success]
    )

    const removeFromWishlist = useCallback(
        (productId: number) => {
            setWishlist((prev) => prev.filter((p) => p.id !== productId))
            info('Removed item from your wishlist')
        },
        [info]
    )

    const toggleWishlist = useCallback(
        (product: Product) => {
            if (isInWishlist(product.id)) {
                removeFromWishlist(product.id)
            } else {
                addToWishlist(product)
            }
        },
        [isInWishlist, removeFromWishlist, addToWishlist]
    )

    const clearWishlist = useCallback(() => {
        setWishlist([])
        info('Wishlist cleared')
    }, [info])

    const moveToCart = useCallback(
        async (product: Product) => {
            try {
                await addToCart(product.id, 1)
                removeFromWishlist(product.id)
                openCartDrawer()
            } catch {
                // error handled by cart context
            }
        },
        [addToCart, removeFromWishlist]
    )

    const value: WishlistContextValue = {
        wishlist,
        wishlistCount: wishlist.length,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        moveToCart,
    }

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

import { useContext } from 'react'
import type { WishlistContextValue } from '../../types'
import { WishlistContext } from './WishlistContext'

export function useWishlist(): WishlistContextValue {
    const context = useContext(WishlistContext)
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider')
    }
    return context
}

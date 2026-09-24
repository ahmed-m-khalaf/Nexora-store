import { createContext } from 'react'
import type { WishlistContextValue } from '../../types'

export const WishlistContext = createContext<WishlistContextValue | null>(null)

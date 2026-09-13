import { createContext } from 'react'
import type { CartContextValue } from '../../types'

export const CartContext = createContext<CartContextValue | null>(null)

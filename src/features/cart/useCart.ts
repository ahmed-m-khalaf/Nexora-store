import { useContext } from 'react'
import type { CartContextValue } from '../../types'
import { CartContext } from './cartContextValue'

export function useCart(): CartContextValue {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used inside CartProvider')
    return context
}

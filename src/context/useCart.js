import { useContext } from 'react'
import { CartContext } from './cartContextValue'

export function useCart() {
    return useContext(CartContext)
}

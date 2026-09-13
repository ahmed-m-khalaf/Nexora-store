import { useCallback, useEffect, useState, type PropsWithChildren } from 'react'
import { api } from '../../services/api'
import type { CartContextValue, CartData, CartProductInput, CheckoutCustomer } from '../../types'
import { getErrorMessage } from '../../utils/errors'
import { CartContext } from './cartContextValue'

const EMPTY_CART: CartData = {
    id: '', items: [], itemCount: 0, subtotal: 0, tax: 0, shipping: 0, total: 0,
}

function getOrCreateGuestCartId(): string {
    let cartId = localStorage.getItem('nexora_cart_id')
    if (!cartId) {
        cartId = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `cart_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`
        localStorage.setItem('nexora_cart_id', cartId)
    }
    return cartId
}

export function CartProvider({ children }: PropsWithChildren) {
    const [cartData, setCartData] = useState<CartData>(EMPTY_CART)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [cartId] = useState<string>(getOrCreateGuestCartId)

    const loadCart = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await api.getCart(cartId)
            setCartData(data)
            if (data.id && data.id !== cartId) localStorage.setItem('nexora_cart_id', data.id)
        } catch (loadError) {
            setError(getErrorMessage(loadError, 'Failed to load cart'))
        } finally {
            setLoading(false)
        }
    }, [cartId])

    useEffect(() => { void loadCart() }, [loadCart])

    const addToCart = async (productOrId: CartProductInput, quantity = 1): Promise<CartData> => {
        const productId = typeof productOrId === 'object' ? productOrId.id : productOrId
        try {
            setError(null)
            const updatedCart = await api.addToCart(cartId, productId, quantity)
            setCartData(updatedCart)
            return updatedCart
        } catch (addError) {
            setError(getErrorMessage(addError, 'Failed to add item to cart'))
            throw addError
        }
    }

    const updateQuantity = async (productId: number, quantity: number): Promise<CartData> => {
        try {
            setError(null)
            const updatedCart = await api.updateCartItem(cartId, productId, quantity)
            setCartData(updatedCart)
            return updatedCart
        } catch (updateError) {
            setError(getErrorMessage(updateError, 'Failed to update item quantity'))
            throw updateError
        }
    }

    const removeFromCart = async (productId: number): Promise<CartData> => {
        try {
            setError(null)
            const updatedCart = await api.removeCartItem(cartId, productId)
            setCartData(updatedCart)
            return updatedCart
        } catch (removeError) {
            setError(getErrorMessage(removeError, 'Failed to remove item'))
            throw removeError
        }
    }

    const clearCart = async (): Promise<CartData> => {
        try {
            setError(null)
            const updatedCart = await api.clearCart(cartId)
            setCartData(updatedCart)
            return updatedCart
        } catch (clearError) {
            setError(getErrorMessage(clearError, 'Failed to clear cart'))
            throw clearError
        }
    }

    const checkout = async (customer: CheckoutCustomer) => {
        try {
            setError(null)
            const order = await api.checkout(cartId, customer)
            setCartData({ ...EMPTY_CART, id: cartId })
            return order
        } catch (checkoutError) {
            setError(getErrorMessage(checkoutError, 'Failed to place order'))
            throw checkoutError
        }
    }

    const value: CartContextValue = {
        cart: cartData.items, cartData, loading, error, cartId, loadCart,
        addToCart, removeFromCart, updateQuantity, clearCart, checkout,
        getCartTotal: () => cartData.total,
        getCartCount: () => cartData.itemCount,
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

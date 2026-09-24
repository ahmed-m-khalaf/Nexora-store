import { useCallback, useEffect, useState, type PropsWithChildren } from 'react'
import { api, getStoredToken } from '../../services/api'
import type { CartContextValue, CartData, CartProductInput, CheckoutCustomer } from '../../types'
import { getErrorMessage } from '../../utils/errors'
import { CartContext } from './cartContextValue'
import { useAuth } from '../auth/useAuth'
import { useToast } from '../toast/useToast'

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
    const { user } = useAuth()
    const { success, error: toastError, info } = useToast()
    const [cartData, setCartData] = useState<CartData>(EMPTY_CART)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [guestCartId, setGuestCartId] = useState<string>(getOrCreateGuestCartId)
    const cartId = user?.cartId || guestCartId

    // Regenerate guest cart ID when user logs out (localStorage cleared by AuthContext)
    useEffect(() => {
        if (!user && !getStoredToken()) {
            const freshId = getOrCreateGuestCartId()
            setGuestCartId(freshId)
        }
    }, [user])

    const loadCart = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await api.getCart(cartId)
            setCartData(data)
            if (!user && !getStoredToken() && data.id && data.id !== cartId) {
                localStorage.setItem('nexora_cart_id', data.id)
                setGuestCartId(data.id)
            }
        } catch (loadError) {
            setError(getErrorMessage(loadError, 'Failed to load cart'))
        } finally {
            setLoading(false)
        }
    }, [cartId, user])

    useEffect(() => { void loadCart() }, [loadCart])

    const addToCart = async (productOrId: CartProductInput, quantity = 1): Promise<CartData> => {
        const productId = typeof productOrId === 'object' ? productOrId.id : productOrId
        const productName = typeof productOrId === 'object' ? productOrId.title : 'Item'
        try {
            setError(null)
            const updatedCart = await api.addToCart(cartId, productId, quantity)
            setCartData(updatedCart)
            success(`${quantity} x ${productName} added to cart`)
            return updatedCart
        } catch (addError) {
            const msg = getErrorMessage(addError, 'Failed to add item to cart')
            setError(msg)
            toastError(msg)
            throw addError
        }
    }

    const updateQuantity = async (productId: number, quantity: number): Promise<CartData> => {
        try {
            setError(null)
            const updatedCart = await api.updateCartItem(cartId, productId, quantity)
            setCartData(updatedCart)
            info('Cart updated')
            return updatedCart
        } catch (updateError) {
            const msg = getErrorMessage(updateError, 'Failed to update item quantity')
            setError(msg)
            toastError(msg)
            throw updateError
        }
    }

    const removeFromCart = async (productId: number): Promise<CartData> => {
        try {
            setError(null)
            const updatedCart = await api.removeCartItem(cartId, productId)
            setCartData(updatedCart)
            info('Item removed from cart')
            return updatedCart
        } catch (removeError) {
            const msg = getErrorMessage(removeError, 'Failed to remove item')
            setError(msg)
            toastError(msg)
            throw removeError
        }
    }

    const clearCart = async (): Promise<CartData> => {
        try {
            setError(null)
            const updatedCart = await api.clearCart(cartId)
            setCartData(updatedCart)
            info('Cart cleared')
            return updatedCart
        } catch (clearError) {
            const msg = getErrorMessage(clearError, 'Failed to clear cart')
            setError(msg)
            toastError(msg)
            throw clearError
        }
    }

    const checkout = async (customer: CheckoutCustomer) => {
        try {
            setError(null)
            const order = await api.checkout(cartId, customer)
            setCartData({ ...EMPTY_CART, id: cartId })
            success('Order placed successfully!')
            return order
        } catch (checkoutError) {
            const msg = getErrorMessage(checkoutError, 'Failed to place order')
            setError(msg)
            toastError(msg)
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

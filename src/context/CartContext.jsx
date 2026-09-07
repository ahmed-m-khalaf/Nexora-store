import { useState, useEffect, useCallback } from 'react'
import { api } from '../utils/api'
import { CartContext } from './cartContextValue'

const getOrCreateGuestCartId = () => {
    let cartId = localStorage.getItem('nexora_cart_id')
    if (!cartId) {
        cartId = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : 'cart_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
        localStorage.setItem('nexora_cart_id', cartId)
    }
    return cartId
}

export function CartProvider({ children }) {
    const [cartData, setCartData] = useState({
        id: '',
        items: [],
        itemCount: 0,
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [cartId] = useState(getOrCreateGuestCartId)

    // Load cart from backend API
    const loadCart = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await api.getCart(cartId)
            setCartData(data)
            // Ensure cartId in server matches our saved ID
            if (data.id && data.id !== cartId) {
                localStorage.setItem('nexora_cart_id', data.id)
            }
        } catch (err) {
            setError(err.message || 'Failed to load cart')
            console.error('Failed to load cart:', err)
        } finally {
            setLoading(false)
        }
    }, [cartId])

    useEffect(() => {
        loadCart()
    }, [loadCart])

    // Add item to cart (accepts product object or productId integer)
    const addToCart = async (productOrId, quantity = 1) => {
        const productId = typeof productOrId === 'object' ? productOrId.id : productOrId
        try {
            setError(null)
            const updatedCart = await api.addToCart(cartId, productId, quantity)
            setCartData(updatedCart)
            return updatedCart
        } catch (err) {
            setError(err.message || 'Failed to add item to cart')
            throw err
        }
    }

    // Update item quantity
    const updateQuantity = async (productId, quantity) => {
        try {
            setError(null)
            const updatedCart = await api.updateCartItem(cartId, productId, quantity)
            setCartData(updatedCart)
            return updatedCart
        } catch (err) {
            setError(err.message || 'Failed to update item quantity')
            throw err
        }
    }

    // Remove item from cart
    const removeFromCart = async (productId) => {
        try {
            setError(null)
            const updatedCart = await api.removeCartItem(cartId, productId)
            setCartData(updatedCart)
            return updatedCart
        } catch (err) {
            setError(err.message || 'Failed to remove item')
            throw err
        }
    }

    // Clear all items in cart
    const clearCart = async () => {
        try {
            setError(null)
            const updatedCart = await api.clearCart(cartId)
            setCartData(updatedCart)
            return updatedCart
        } catch (err) {
            setError(err.message || 'Failed to clear cart')
            throw err
        }
    }

    // Checkout uses the server-side cart. The browser only supplies contact details.
    const checkout = async (customer) => {
        try {
            setError(null)
            const order = await api.checkout(cartId, customer)
            setCartData({
                id: cartId,
                items: [],
                itemCount: 0,
                subtotal: 0,
                tax: 0,
                shipping: 0,
                total: 0,
            })
            return order
        } catch (err) {
            setError(err.message || 'Failed to place order')
            throw err
        }
    }

    const getCartTotal = () => cartData.total
    const getCartCount = () => cartData.itemCount

    return (
        <CartContext.Provider
            value={{
                cart: cartData.items, // Array of items [{ product, quantity, subtotal }, ...]
                cartData,            // Full cart object with subtotal, tax, shipping, total
                loading,
                error,
                cartId,
                loadCart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                checkout,
                getCartTotal,
                getCartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

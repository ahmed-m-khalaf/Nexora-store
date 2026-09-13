import type {
    ApiClient,
    CartData,
    CheckoutCustomer,
    Order,
    Product,
    ProductQuery,
    ProductsResponse,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    let response: Response

    try {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        }
        response = await fetch(url, { ...options, headers })
    } catch {
        throw new Error('Network error. Please check your connection and try again.')
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => null) as { message?: string } | null
        const message = errorData?.message || `Request failed with status ${response.status}`
        const error = new Error(message) as Error & { status?: number }
        error.status = response.status
        throw error
    }

    return response.json() as Promise<T>
}

export const api: ApiClient = {
    getProducts: async ({ search, category, page = 1, limit = 12, sortBy, order }: ProductQuery = {}) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) })
        if (search?.trim()) params.set('search', search.trim())
        if (category && category !== 'all') params.set('category', category)
        if (sortBy) params.set('sortBy', sortBy)
        if (order) params.set('order', order)
        return apiFetch<ProductsResponse>(`${API_BASE_URL}/products?${params.toString()}`)
    },
    getAllProducts: () => apiFetch<ProductsResponse>(`${API_BASE_URL}/products?page=1&limit=100`),
    getProductById: (id: number) => apiFetch<Product>(`${API_BASE_URL}/products/${id}`),
    getCategories: () => apiFetch<string[]>(`${API_BASE_URL}/categories`),
    getProductsByCategory: (category: string) => apiFetch<ProductsResponse>(
        `${API_BASE_URL}/products/category/${encodeURIComponent(category)}`,
    ),
    getCart: (cartId: string) => apiFetch<CartData>(`${API_BASE_URL}/cart`, {
        headers: cartId ? { 'x-cart-id': cartId } : {},
    }),
    addToCart: (cartId: string, productId: number, quantity = 1) => apiFetch<CartData>(`${API_BASE_URL}/cart/items`, {
        method: 'POST',
        headers: cartId ? { 'x-cart-id': cartId } : {},
        body: JSON.stringify({ productId, quantity }),
    }),
    updateCartItem: (cartId: string, productId: number, quantity: number) => apiFetch<CartData>(
        `${API_BASE_URL}/cart/items/${productId}`,
        {
            method: 'PATCH',
            headers: cartId ? { 'x-cart-id': cartId } : {},
            body: JSON.stringify({ quantity }),
        },
    ),
    removeCartItem: (cartId: string, productId: number) => apiFetch<CartData>(
        `${API_BASE_URL}/cart/items/${productId}`,
        {
            method: 'DELETE',
            headers: cartId ? { 'x-cart-id': cartId } : {},
        },
    ),
    clearCart: (cartId: string) => apiFetch<CartData>(`${API_BASE_URL}/cart`, {
        method: 'DELETE',
        headers: cartId ? { 'x-cart-id': cartId } : {},
    }),
    checkout: (cartId: string, customer: CheckoutCustomer) => apiFetch<Order>(`${API_BASE_URL}/orders/checkout`, {
        method: 'POST',
        headers: cartId ? { 'x-cart-id': cartId } : {},
        body: JSON.stringify(customer),
    }),
}

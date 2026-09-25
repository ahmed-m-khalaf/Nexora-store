import type {
    ApiClient,
    CartData,
    CheckoutCustomer,
    AuthCredentials,
    AuthResponse,
    Order,
    Product,
    ProductQuery,
    ProductsResponse,
    RegisterInput,
    User,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const TOKEN_KEY = 'nexora_access_token'

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY)
export const setStoredToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)
export const clearStoredToken = () => localStorage.removeItem(TOKEN_KEY)

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    let response: Response

    try {
        const token = getStoredToken()
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        }
        if (token) (headers as Record<string, string>).Authorization = `Bearer ${token}`
        response = await fetch(url, { ...options, headers })
    } catch {
        throw new Error('Network error. Please check your connection and try again.')
    }

    if (!response.ok) {
        if (response.status === 401) {
            clearStoredToken()
        }
        const errorData = await response.json().catch(() => null) as { message?: string } | null
        const message = errorData?.message || `Request failed with status ${response.status}`
        const error = new Error(message) as Error & { status?: number }
        error.status = response.status
        throw error
    }

    return response.json() as Promise<T>
}

export const api: ApiClient = {
    getProducts: async ({ search, category, page = 1, limit = 12, sortBy, order, minPrice, maxPrice, inStock }: ProductQuery = {}) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) })
        if (search?.trim()) params.set('search', search.trim())
        if (category && category !== 'all') params.set('category', category)
        if (sortBy) params.set('sortBy', sortBy)
        if (order) params.set('order', order)
        if (minPrice !== undefined) params.set('minPrice', String(minPrice))
        if (maxPrice !== undefined) params.set('maxPrice', String(maxPrice))
        if (inStock) params.set('inStock', 'true')
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
    register: (input: RegisterInput, guestCartId = '') => apiFetch<AuthResponse>(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: guestCartId ? { 'x-cart-id': guestCartId } : {},
        body: JSON.stringify(input),
    }),
    login: (input: AuthCredentials, guestCartId = '') => apiFetch<AuthResponse>(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: guestCartId ? { 'x-cart-id': guestCartId } : {},
        body: JSON.stringify(input),
    }),
    getCurrentUser: () => apiFetch<{ user: User }>(`${API_BASE_URL}/auth/me`),
    getMyOrders: () => apiFetch<Order[]>(`${API_BASE_URL}/orders/mine`),
}

export type CategoryName = string

export type Rating = {
    rate: number
    count: number
}

export type Product = {
    id: number
    title: string
    price: number
    description: string
    image: string
    category: CategoryName
    categoryId: number
    rating: Rating
    stock?: number
    createdAt?: string
    updatedAt?: string
}

export type Pagination = {
    total: number
    page: number
    limit: number
    totalPages: number
}

export type ProductSortField = 'id' | 'title' | 'price' | 'createdAt'
export type SortOrder = 'asc' | 'desc'

export type ProductQuery = {
    search?: string
    category?: CategoryName | 'all'
    page?: number
    limit?: number
    sortBy?: ProductSortField
    order?: SortOrder
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
}

export type ProductsResponse = {
    data: Product[]
    pagination: Pagination
}

export type CartProduct = Pick<Product, 'id' | 'title' | 'price' | 'image' | 'category' | 'stock'>

export type CartItem = {
    id: number
    productId: number
    product: CartProduct
    quantity: number
    subtotal: number
}

export type CartData = {
    id: string
    items: CartItem[]
    itemCount: number
    subtotal: number
    tax: number
    shipping: number
    total: number
    updatedAt?: string
}

export type CheckoutCustomer = {
    customerName: string
    customerEmail: string
    customerPhone: string
    shippingAddress: string
}

export type CheckoutFormErrors = {
    customerName?: string
    customerEmail?: string
    customerPhone?: string
    shippingAddress?: string
}

export type User = {
    id: number
    email: string
    name: string
    role: 'CUSTOMER' | 'ADMIN'
    cartId: string | null
}

export type AuthCredentials = {
    email: string
    password: string
}

export type RegisterInput = AuthCredentials & {
    name: string
}

export type AuthResponse = {
    token: string
    user: User
}

export type OrderItem = {
    id: number
    productId: number | null
    title: string
    unitPrice: number
    quantity: number
    lineTotal: number
}

export type Order = {
    id: string
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
    customer: {
        name: string
        email: string
        phone: string
        shippingAddress: string
    }
    items: OrderItem[]
    subtotal: number
    tax: number
    shipping: number
    total: number
    createdAt: string
}

export type CartProductInput = Product | number

export type CartContextValue = {
    cart: CartItem[]
    cartData: CartData
    loading: boolean
    error: string | null
    cartId: string
    loadCart: () => Promise<void>
    addToCart: (productOrId: CartProductInput, quantity?: number) => Promise<CartData>
    removeFromCart: (productId: number) => Promise<CartData>
    updateQuantity: (productId: number, quantity: number) => Promise<CartData>
    clearCart: () => Promise<CartData>
    checkout: (customer: CheckoutCustomer) => Promise<Order>
    getCartTotal: () => number
    getCartCount: () => number
}

export type ApiClient = {
    getProducts: (query?: ProductQuery) => Promise<ProductsResponse>
    getAllProducts: () => Promise<ProductsResponse>
    getProductById: (id: number) => Promise<Product>
    getCategories: () => Promise<string[]>
    getProductsByCategory: (category: string) => Promise<ProductsResponse>
    getCart: (cartId: string) => Promise<CartData>
    addToCart: (cartId: string, productId: number, quantity?: number) => Promise<CartData>
    updateCartItem: (cartId: string, productId: number, quantity: number) => Promise<CartData>
    removeCartItem: (cartId: string, productId: number) => Promise<CartData>
    clearCart: (cartId: string) => Promise<CartData>
    checkout: (cartId: string, customer: CheckoutCustomer) => Promise<Order>
    register: (input: RegisterInput, guestCartId?: string) => Promise<AuthResponse>
    login: (input: AuthCredentials, guestCartId?: string) => Promise<AuthResponse>
    getCurrentUser: () => Promise<{ user: User }>
    getMyOrders: () => Promise<Order[]>
}

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export type Toast = {
    id: string
    type: ToastType
    message: string
    action?: {
        label: string
        onClick: () => void
    }
}

export type ToastContextValue = {
    toasts: Toast[]
    addToast: (toast: Omit<Toast, 'id'>) => void
    removeToast: (id: string) => void
    success: (message: string, action?: Toast['action']) => void
    error: (message: string, action?: Toast['action']) => void
    info: (message: string, action?: Toast['action']) => void
    warning: (message: string, action?: Toast['action']) => void
}

export type WishlistContextValue = {
    wishlist: Product[]
    wishlistCount: number
    addToWishlist: (product: Product) => void
    removeFromWishlist: (productId: number) => void
    toggleWishlist: (product: Product) => void
    isInWishlist: (productId: number) => boolean
    clearWishlist: () => void
    moveToCart: (product: Product) => Promise<void>
}

export type Coupon = {
    code: string
    type: 'percentage' | 'fixed' | 'free_shipping'
    value: number
    description: string
    minSpend?: number
}

export type AppliedCoupon = Coupon & {
    discountAmount: number
}

export type Review = {
    id: string
    productId: number
    userName: string
    rating: number
    title: string
    comment: string
    createdAt: string
    verified: boolean
}


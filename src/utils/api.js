// API utility functions for Nexora Backend API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with standardized error handling
 */
const apiFetch = async (url, options = {}) => {
  let response;
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    response = await fetch(url, { ...options, headers });
  } catch {
    throw new Error('Network error. Please check your connection and try again.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.json();
};

export const api = {
  /**
   * Get products with server-side search, filter, sort, and pagination.
   */
  getProducts: async ({ search, category, page = 1, limit = 12, sortBy, order } = {}) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (search && search.trim()) params.set('search', search.trim());
    if (category && category !== 'all') params.set('category', category);
    if (sortBy) params.set('sortBy', sortBy);
    if (order) params.set('order', order);

    return apiFetch(`${API_BASE_URL}/products?${params.toString()}`);
  },

  /**
   * Get all products without pagination (for Home page featured products).
   */
  getAllProducts: async () => {
    return apiFetch(`${API_BASE_URL}/products?page=1&limit=100`);
  },

  /**
   * Get single product by ID
   */
  getProductById: async (id) => {
    return apiFetch(`${API_BASE_URL}/products/${id}`);
  },

  /**
   * Get all categories (returns array of category names)
   */
  getCategories: async () => {
    return apiFetch(`${API_BASE_URL}/categories`);
  },

  /**
   * Get products by category name
   */
  getProductsByCategory: async (category) => {
    return apiFetch(
      `${API_BASE_URL}/products/category/${encodeURIComponent(category)}`
    );
  },

  // --- Cart API Methods ---

  /**
   * Get cart for a given cartId
   */
  getCart: async (cartId) => {
    return apiFetch(`${API_BASE_URL}/cart`, {
      headers: cartId ? { 'x-cart-id': cartId } : {},
    });
  },

  /**
   * Add item to cart
   */
  addToCart: async (cartId, productId, quantity = 1) => {
    return apiFetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: cartId ? { 'x-cart-id': cartId } : {},
      body: JSON.stringify({ productId, quantity }),
    });
  },

  /**
   * Update item quantity in cart
   */
  updateCartItem: async (cartId, productId, quantity) => {
    return apiFetch(`${API_BASE_URL}/cart/items/${productId}`, {
      method: 'PATCH',
      headers: cartId ? { 'x-cart-id': cartId } : {},
      body: JSON.stringify({ quantity }),
    });
  },

  /**
   * Remove item from cart
   */
  removeCartItem: async (cartId, productId) => {
    return apiFetch(`${API_BASE_URL}/cart/items/${productId}`, {
      method: 'DELETE',
      headers: cartId ? { 'x-cart-id': cartId } : {},
    });
  },

  /**
   * Clear all items in cart
   */
  clearCart: async (cartId) => {
    return apiFetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: cartId ? { 'x-cart-id': cartId } : {},
    });
  },
};

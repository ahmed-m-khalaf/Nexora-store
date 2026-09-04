// API utility functions for Nexora Backend API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with standardized error handling
 */
const apiFetch = async (url) => {
  let response;
  try {
    response = await fetch(url);
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
   * Always returns { data: [...], pagination: { total, page, limit, totalPages } }
   *
   * @param {Object} params
   * @param {string}  [params.search]     - Search term for title/description
   * @param {string}  [params.category]   - Category name filter
   * @param {number}  [params.page=1]     - Page number
   * @param {number}  [params.limit=12]   - Items per page
   * @param {string}  [params.sortBy]     - Sort field: id, title, price, createdAt
   * @param {string}  [params.order]      - Sort direction: asc, desc
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
   * Returns the unified { data, pagination } format.
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
};

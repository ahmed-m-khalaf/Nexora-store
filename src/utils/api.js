// API utility functions for FakeStore API

const API_BASE_URL = 'https://fakestoreapi.com'

export const api = {
    // Get all products
    getAllProducts: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/products`)
            if (!response.ok) throw new Error('Failed to fetch products')
            return await response.json()
        } catch (error) {
            console.error('Error fetching products:', error)
            throw error
        }
    },

    // Get single product by ID
    getProductById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`)
            if (!response.ok) throw new Error('Failed to fetch product')
            return await response.json()
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error)
            throw error
        }
    },

    // Get all categories
    getCategories: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/categories`)
            if (!response.ok) throw new Error('Failed to fetch categories')
            return await response.json()
        } catch (error) {
            console.error('Error fetching categories:', error)
            throw error
        }
    },

    // Get products by category
    getProductsByCategory: async (category) => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/category/${category}`)
            if (!response.ok) throw new Error('Failed to fetch category products')
            return await response.json()
        } catch (error) {
            console.error(`Error fetching category ${category}:`, error)
            throw error
        }
    },
}

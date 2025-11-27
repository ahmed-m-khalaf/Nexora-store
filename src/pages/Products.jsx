import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import FadeIn from '../components/FadeIn'

function Products() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Filter states
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                // Fetch products and categories in parallel
                const [productsData, categoriesData] = await Promise.all([
                    api.getAllProducts(),
                    api.getCategories()
                ])
                setProducts(productsData)
                setCategories(categoriesData)
            } catch (err) {
                setError('Failed to load data. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Filter logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    if (loading) return <Loader />
    if (error) return <div className="text-center text-red-500 py-12">{error}</div>

    return (
        <FadeIn>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Products</h1>

                <div className="max-w-4xl mx-auto mb-12">
                    <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-600">No products found matching your criteria.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </FadeIn>
    )
}

export default Products

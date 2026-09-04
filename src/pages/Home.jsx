import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import FadeIn from '../components/FadeIn'

function Home() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchFeaturedProducts = async () => {
        try {
            setLoading(true)
            setError(null)
            const result = await api.getAllProducts()
            // getAllProducts now returns { data, pagination }
            const topProducts = result.data
                .sort((a, b) => b.rating.rate - a.rating.rate)
                .slice(0, 4)
            setProducts(topProducts)
        } catch (err) {
            setError(err.message || 'Failed to fetch products')
            console.error('Failed to fetch products:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFeaturedProducts()
    }, [])

    return (
        <FadeIn>
            <div>
                <Hero />

                {/* Featured Products Section */}
                <div className="container mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
                    <p className="text-gray-600 mb-8">Top rated products just for you</p>

                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500 mb-4">{error}</p>
                            <button
                                onClick={fetchFeaturedProducts}
                                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition"
                            >
                                🔄 Retry
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </FadeIn>
    )
}

export default Home

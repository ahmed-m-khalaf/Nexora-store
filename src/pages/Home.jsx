import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import FadeIn from '../components/FadeIn'

function Home() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setLoading(true)
                const data = await api.getAllProducts()
                // Get top 4 products by rating
                const topProducts = data
                    .sort((a, b) => b.rating.rate - a.rating.rate)
                    .slice(0, 4)
                setProducts(topProducts)
            } catch (error) {
                console.error('Failed to fetch products:', error)
            } finally {
                setLoading(false)
            }
        }

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

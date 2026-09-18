import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'
import Hero from '../components/catalog/Hero'
import ProductGrid from '../components/catalog/ProductGrid'
import FadeIn from '../components/common/FadeIn'
import ScrollReveal from '../components/common/ScrollReveal'
import type { Product } from '../types'
import { getErrorMessage } from '../utils/errors'

function Home() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchFeaturedProducts = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const result = await api.getAllProducts()
            // getAllProducts now returns { data, pagination }
            const topProducts = result.data
                .sort((a, b) => b.rating.rate - a.rating.rate)
                .slice(0, 4)
            setProducts(topProducts)
        } catch (fetchError: unknown) {
            setError(getErrorMessage(fetchError, 'Failed to fetch products'))
            console.error('Failed to fetch products:', fetchError)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchFeaturedProducts()
    }, [fetchFeaturedProducts])

    return (
        <FadeIn>
            <div>
                <Hero featuredProduct={products[0]} />

                {/* Featured Products Section */}
                <ScrollReveal>
                    <div className="container mx-auto px-4 py-16">
                        <div className="mb-8 flex items-end justify-between gap-4">
                            <div>
                                <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600">The edit</span>
                                <h2 className="mt-2 text-3xl font-bold text-slate-900">Featured products</h2>
                                <p className="mt-2 text-slate-500">Thoughtful picks for work, travel, and everyday living.</p>
                            </div>
                        </div>

                        {error ? (
                            <div className="py-8 text-center">
                                <p className="mb-4 text-red-500">{error}</p>
                                <button onClick={fetchFeaturedProducts} className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700">
                                    Try again
                                </button>
                            </div>
                        ) : <ProductGrid products={products} loading={loading} skeletonCount={4} />}
                    </div>
                </ScrollReveal>
            </div>
        </FadeIn>
    )
}

export default Home

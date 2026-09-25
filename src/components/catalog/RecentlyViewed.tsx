import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import type { Product } from '../../types'
import { getRecentlyViewedIds } from '../../utils/recentlyViewed'
import ProductGrid from './ProductGrid'

export default function RecentlyViewed({ excludeId }: { excludeId?: number }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const ids = getRecentlyViewedIds().filter(id => id !== excludeId)
    Promise.all(ids.map(id => api.getProductById(id).catch(() => null)))
      .then(results => { if (active) setProducts(results.filter((item): item is Product => item !== null).slice(0, 4)) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [excludeId])

  if (!loading && products.length === 0) return null
  return <section className="container mx-auto px-4 py-10" aria-labelledby="recently-viewed-title">
    <div className="mb-6"><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-600">Pick up where you left off</p><h2 id="recently-viewed-title" className="mt-2 text-2xl font-bold text-slate-900">Recently viewed</h2></div>
    <ProductGrid products={products} loading={loading} skeletonCount={4} />
  </section>
}

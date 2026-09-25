import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../services/api'
import CategoryFilter from '../components/catalog/CategoryFilter'
import ProductGrid from '../components/catalog/ProductGrid'
import SearchBar from '../components/catalog/SearchBar'
import FadeIn from '../components/common/FadeIn'
import type { Pagination, Product, ProductSortField, SortOrder } from '../types'
import { getErrorMessage } from '../utils/errors'

const SORT_OPTIONS = [
    { label: 'Default', value: 'id-asc' },
    { label: 'Price: Low → High', value: 'price-asc' },
    { label: 'Price: High → Low', value: 'price-desc' },
    { label: 'Name: A → Z', value: 'title-asc' },
    { label: 'Name: Z → A', value: 'title-desc' },
    { label: 'Newest First', value: 'createdAt-desc' },
]

const ITEMS_PER_PAGE = 12

function Products() {
    const [searchParams, setSearchParams] = useSearchParams()

    // Data state
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: ITEMS_PER_PAGE, totalPages: 1 })

    // UI state
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Filter/search/sort state from URL
    const urlSearch = searchParams.get('search') || ''
    const urlCategory = searchParams.get('category') || 'all'
    const urlSort = searchParams.get('sort') || 'id-asc'
    const urlPage = parseInt(searchParams.get('page') || '1', 10) || 1
    const minPriceParam = searchParams.get('minPrice')
    const maxPriceParam = searchParams.get('maxPrice')
    const minPrice = minPriceParam === null ? undefined : Number(minPriceParam)
    const maxPrice = maxPriceParam === null ? undefined : Number(maxPriceParam)
    const inStock = searchParams.get('inStock') === 'true'

    const [searchTerm, setSearchTerm] = useState(urlSearch)

    // Debounce search update to URL
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchParams(prev => {
                if (searchTerm) prev.set('search', searchTerm)
                else prev.delete('search')
                if (urlSearch !== searchTerm) prev.set('page', '1') // Reset page only if search changed
                return prev
            }, { replace: true })
        }, 400)
        return () => clearTimeout(timer)
    }, [searchTerm, setSearchParams, urlSearch])

    // Fetch categories once
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await api.getCategories()
                setCategories(data)
            } catch (err) {
                console.error('Failed to fetch categories:', err)
            }
        }
        fetchCategories()
    }, [])

    // Fetch products
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const [sortBy, order] = urlSort.split('-') as [ProductSortField, SortOrder]

            const result = await api.getProducts({
                search: urlSearch,
                category: urlCategory,
                page: urlPage,
                limit: ITEMS_PER_PAGE,
                sortBy,
                order,
                minPrice,
                maxPrice,
                inStock,
            })

            setProducts(result.data)
            setPagination(result.pagination)
        } catch (fetchError: unknown) {
            setError(getErrorMessage(fetchError, 'Failed to load products. Please try again.'))
            setProducts([])
        } finally {
            setLoading(false)
        }
    }, [urlSearch, urlCategory, urlSort, urlPage, minPrice, maxPrice, inStock])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    // URL Handlers
    const setCategory = (cat: string) => {
        setSearchParams(prev => {
            prev.set('category', cat)
            prev.set('page', '1')
            return prev
        })
    }

    const setSortValue = (sort: string) => {
        setSearchParams(prev => {
            prev.set('sort', sort)
            prev.set('page', '1')
            return prev
        })
    }

    const updateFilter = (key: 'minPrice' | 'maxPrice' | 'inStock', value: string | boolean) => {
        setSearchParams(prev => {
            if (value === '' || value === false) prev.delete(key)
            else prev.set(key, String(value))
            prev.set('page', '1')
            return prev
        })
    }

    // Pagination handlers
    const goToPage = (page: number) => {
        if (page >= 1 && page <= pagination.totalPages) {
            setSearchParams(prev => {
                prev.set('page', page.toString())
                return prev
            })
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    // Generate page numbers to display
    const getPageNumbers = (): number[] => {
        const { totalPages } = pagination
        const pages = []
        const maxVisible = 5
        let start = Math.max(1, urlPage - Math.floor(maxVisible / 2))
        const end = Math.min(totalPages, start + maxVisible - 1)
        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1)
        }
        for (let i = start; i <= end; i++) {
            pages.push(i)
        }
        return pages
    }

    return (
        <FadeIn>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Products</h1>

                {/* Search & Filters */}
                <div className="mx-auto mb-8 max-w-5xl">
                    <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                    <CategoryFilter
                        categories={categories}
                        selectedCategory={urlCategory}
                        onSelectCategory={setCategory}
                    />

                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm sm:p-5">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold text-slate-900">Refine your search</h2>
                                <p className="mt-0.5 text-xs text-slate-500">Set a price range or show only available items.</p>
                            </div>
                            <label className="inline-flex min-h-10 cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:border-primary-300">
                                <input type="checkbox" checked={inStock} onChange={e => updateFilter('inStock', e.target.checked)} className="h-4 w-4 accent-primary-600" />
                                In stock only
                            </label>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <label htmlFor="min-price" className="text-sm font-semibold text-slate-700">Minimum price</label>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                                        <input id="min-price" aria-label="Minimum price" type="number" min="0" value={searchParams.get('minPrice') || ''} onChange={e => updateFilter('minPrice', e.target.value)} placeholder="0" className="w-28 rounded-lg border border-slate-300 bg-white py-2 pl-6 pr-2 text-sm text-slate-800 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                                    </div>
                                </div>
                                <input aria-label="Minimum price slider" type="range" min="0" max="1000" step="5" value={minPrice ?? 0} onChange={e => updateFilter('minPrice', e.target.value === '0' ? '' : e.target.value)} className="block w-full accent-primary-600" />
                                <div className="mt-1 flex justify-between text-[11px] text-slate-400"><span>$0</span><span>$1,000+</span></div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <label htmlFor="max-price" className="text-sm font-semibold text-slate-700">Maximum price</label>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                                        <input id="max-price" aria-label="Maximum price" type="number" min="0" value={searchParams.get('maxPrice') || ''} onChange={e => updateFilter('maxPrice', e.target.value)} placeholder="Any" className="w-28 rounded-lg border border-slate-300 bg-white py-2 pl-6 pr-2 text-sm text-slate-800 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                                    </div>
                                </div>
                                <input aria-label="Maximum price slider" type="range" min="0" max="1000" step="5" value={maxPrice ?? 1000} onChange={e => updateFilter('maxPrice', e.target.value === '1000' ? '' : e.target.value)} className="block w-full accent-primary-600" />
                                <div className="mt-1 flex justify-between text-[11px] text-slate-400"><span>$0</span><span>$1,000+</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Sort & Results Info Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                        <p className="text-gray-500 text-sm">
                            {loading ? 'Loading...' : (
                                <>
                                    <span className="font-semibold text-gray-700">{pagination.total}</span> products found
                                    {pagination.totalPages > 1 && (
                                        <> · Page <span className="font-semibold text-gray-700">{pagination.page}</span> of <span className="font-semibold text-gray-700">{pagination.totalPages}</span></>
                                    )}
                                </>
                            )}
                        </p>

                        <div className="flex items-center gap-2">
                            <label htmlFor="sort-select" className="text-sm text-gray-500 whitespace-nowrap">Sort by:</label>
                            <select
                                id="sort-select"
                                value={urlSort}
                                onChange={(e) => setSortValue(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition cursor-pointer"
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error State with Retry */}
                {error && (
                    <div className="text-center py-12">
                        <div className="inline-flex flex-col items-center gap-4 bg-red-50 border border-red-200 rounded-xl px-8 py-6">
                            <p className="text-red-600 font-medium">{error}</p>
                            <button
                                onClick={fetchProducts}
                                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition shadow-sm"
                            >
                                🔄 Retry
                            </button>
                        </div>
                    </div>
                )}

                {/* Products Grid with Skeleton */}
                {!error && (
                    <>
                        {products.length === 0 && !loading ? (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-600">No products found matching your criteria.</p>
                                <button
                                    onClick={() => { setSearchTerm(''); setCategory('all'); setSortValue('id-asc'); }}
                                    className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <ProductGrid products={products} loading={loading} skeletonCount={12} />

                                {/* Pagination Controls */}
                                {pagination.totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-12">
                                        <button
                                            onClick={() => goToPage(urlPage - 1)}
                                            disabled={urlPage === 1}
                                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
                                        >
                                            ← Previous
                                        </button>

                                        {getPageNumbers()[0] > 1 && (
                                            <>
                                                <button
                                                    onClick={() => goToPage(1)}
                                                    className="w-10 h-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition text-sm font-medium"
                                                >
                                                    1
                                                </button>
                                                {getPageNumbers()[0] > 2 && (
                                                    <span className="text-gray-400 px-1">…</span>
                                                )}
                                            </>
                                        )}

                                        {getPageNumbers().map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                                                    page === urlPage
                                                        ? 'bg-primary-600 text-white shadow-md'
                                                        : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        {getPageNumbers()[getPageNumbers().length - 1] < pagination.totalPages && (
                                            <>
                                                {getPageNumbers()[getPageNumbers().length - 1] < pagination.totalPages - 1 && (
                                                    <span className="text-gray-400 px-1">…</span>
                                                )}
                                                <button
                                                    onClick={() => goToPage(pagination.totalPages)}
                                                    className="w-10 h-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition text-sm font-medium"
                                                >
                                                    {pagination.totalPages}
                                                </button>
                                            </>
                                        )}

                                        <button
                                            onClick={() => goToPage(urlPage + 1)}
                                            disabled={urlPage === pagination.totalPages}
                                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </FadeIn>
    )
}

export default Products

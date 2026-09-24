import { Link } from 'react-router-dom'
import { FiArrowRight, FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi'
import { useWishlist } from '../features/wishlist/useWishlist'
import FadeIn from '../components/common/FadeIn'

export default function Wishlist() {
    const { wishlist, wishlistCount, removeFromWishlist, clearWishlist, moveToCart } = useWishlist()

    if (wishlistCount === 0) {
        return (
            <FadeIn>
                <div className="container mx-auto px-4 py-24 text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-rose-50 text-rose-400">
                        <FiHeart className="h-12 w-12" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Your Wishlist is Empty</h1>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        Explore our store and save your favorite items so you don't lose track of them.
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition shadow-md hover:shadow-lg"
                    >
                        <span>Explore Products</span>
                        <FiArrowRight />
                    </Link>
                </div>
            </FadeIn>
        )
    }

    return (
        <FadeIn>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            My Wishlist
                            <span className="ml-3 text-lg font-normal text-slate-500">
                                ({wishlistCount} {wishlistCount === 1 ? 'item' : 'items'})
                            </span>
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Items saved for later purchase</p>
                    </div>
                    <button
                        onClick={clearWishlist}
                        className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700 transition"
                    >
                        <FiTrash2 className="h-4 w-4" />
                        Clear Wishlist
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.map((product) => {
                        const stock = product.stock ?? 0
                        const isOutOfStock = stock <= 0

                        return (
                            <div
                                key={product.id}
                                className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
                            >
                                <div className="relative aspect-square w-full bg-slate-50 p-4">
                                    <Link to={`/product/${product.id}`} className="block h-full w-full">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                                        />
                                    </Link>
                                    <button
                                        onClick={() => removeFromWishlist(product.id)}
                                        aria-label="Remove from wishlist"
                                        className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-slate-400 shadow-sm backdrop-blur transition hover:bg-rose-50 hover:text-rose-600"
                                    >
                                        <FiTrash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="flex flex-1 flex-col p-4">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-1">
                                        {product.category}
                                    </span>
                                    <Link
                                        to={`/product/${product.id}`}
                                        className="font-medium text-slate-900 line-clamp-2 hover:text-primary-600 transition mb-2"
                                    >
                                        {product.title}
                                    </Link>
                                    <div className="mt-auto pt-2 flex items-center justify-between">
                                        <span className="text-xl font-bold text-slate-900">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                            isOutOfStock ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                                        }`}>
                                            {isOutOfStock ? 'Out of stock' : 'In stock'}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => void moveToCart(product)}
                                        disabled={isOutOfStock}
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                                    >
                                        <FiShoppingBag className="h-4 w-4" />
                                        Move to Cart
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </FadeIn>
    )
}

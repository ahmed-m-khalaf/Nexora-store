import { Link, useNavigate } from 'react-router-dom'
import { FiAlertCircle, FiRefreshCw, FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { useCart } from '../features/cart/useCart'
import { useCoupon } from '../features/coupons/useCoupon'
import FadeIn from '../components/common/FadeIn'
import Loader from '../components/common/Loader'
import CouponInput from '../components/cart/CouponInput'

function Cart() {
    const { cart, cartData, loading, error, clearCart, removeFromCart, updateQuantity, loadCart } = useCart()
    const { applyCoupon, removeCoupon, getAppliedCoupon } = useCoupon()
    const navigate = useNavigate()

    const appliedCoupon = getAppliedCoupon(cartData.subtotal, cartData.shipping)
    const discountAmount = appliedCoupon?.discountAmount || 0
    const finalTotal = Math.max(0, cartData.total - discountAmount)

    if (loading) return <Loader />

    if (error) {
        return (
            <FadeIn>
                <div className="container mx-auto max-w-md px-4 py-20 text-center">
                    <div className="rounded-2xl border border-red-200 bg-red-50/60 p-8 shadow-sm">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <FiAlertCircle className="h-7 w-7" />
                        </div>
                        <h2 className="mb-2 text-xl font-bold text-slate-900">Unable to load your cart</h2>
                        <p className="mb-6 text-sm text-slate-600">{error}</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button
                                onClick={() => void loadCart()}
                                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 active:scale-95"
                            >
                                <FiRefreshCw className="h-4 w-4" />
                                <span>Try Again</span>
                            </button>
                            <Link
                                to="/products"
                                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                            >
                                <span>Explore Products</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </FadeIn>
        )
    }

    if (!cart || cart.length === 0) {
        return (
            <FadeIn>
                <div className="container mx-auto px-4 py-24 text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                        <FiShoppingBag className="h-12 w-12" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Your Cart is Empty</h1>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven&apos;t added any items to your cart yet.</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition shadow-md hover:shadow-lg"
                    >
                        <span>Start Shopping</span>
                        <FiArrowRight />
                    </Link>
                </div>
            </FadeIn>
        )
    }

    return (
        <FadeIn>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Shopping Cart ({cartData.itemCount} {cartData.itemCount === 1 ? 'item' : 'items'})
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm flex gap-4 items-center border border-gray-100">
                                <Link to={`/product/${item.productId}`}>
                                    <img
                                        src={item.product.image}
                                        alt={item.product.title}
                                        className="w-20 h-20 object-contain p-2 border border-gray-100 rounded-md hover:scale-105 transition-transform"
                                    />
                                </Link>
                                <div className="flex-1">
                                    <Link to={`/product/${item.productId}`} className="hover:text-primary-600 transition">
                                        <h3 className="font-semibold text-gray-900 line-clamp-1">{item.product.title}</h3>
                                    </Link>
                                    <p className="text-primary-600 font-bold">${item.product.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button
                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                            className="w-8 h-8 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                            className="w-8 h-8 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.productId)}
                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition"
                                        title="Remove item"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={clearCart}
                            className="text-red-600 hover:text-red-800 text-sm font-medium mt-4 flex items-center gap-2 transition cursor-pointer"
                        >
                            🗑️ Clear Cart
                        </button>
                    </div>

                    {/* Cart Summary */}
                    <div className="bg-gray-50 p-6 rounded-xl h-fit border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        {/* Free Shipping Progress Bar */}
                        <div className="mb-6 rounded-lg bg-white p-4 border border-blue-100 shadow-sm">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                {cartData.subtotal >= 100 
                                    ? <span className="text-green-600 font-semibold flex items-center gap-1">🎉 You've unlocked free shipping!</span> 
                                    : <>You're <span className="font-bold text-primary-600">${(100 - cartData.subtotal).toFixed(2)}</span> away from free shipping</>}
                            </p>
                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ease-out ${cartData.subtotal >= 100 ? 'bg-green-500' : 'bg-primary-500'}`}
                                    style={{ width: `${Math.min(100, (cartData.subtotal / 100) * 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Promo Code Box */}
                        <div className="mb-6">
                            <CouponInput
                                appliedCoupon={appliedCoupon}
                                subtotal={cartData.subtotal}
                                shipping={cartData.shipping}
                                onApply={(code) => applyCoupon(code, cartData.subtotal, cartData.shipping)}
                                onRemove={removeCoupon}
                                variant="full"
                            />
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium">${cartData.subtotal.toFixed(2)}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-emerald-600 font-medium">
                                    <span>Promo Discount ({appliedCoupon.code})</span>
                                    <span>-${discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (10%)</span>
                                <span className="font-medium">${cartData.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="font-medium">
                                    {appliedCoupon?.type === 'free_shipping' || cartData.shipping === 0
                                        ? 'FREE'
                                        : `$${cartData.shipping.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex justify-between text-xl font-bold text-gray-900">
                                <span>Total</span>
                                <div className="text-right">
                                    {discountAmount > 0 && (
                                        <span className="text-sm font-normal text-slate-400 line-through mr-2">
                                            ${cartData.total.toFixed(2)}
                                        </span>
                                    )}
                                    <span className="text-primary-600">${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition shadow-md hover:shadow-lg mb-4 cursor-pointer"
                        >
                            Proceed to Checkout
                        </button>

                        <Link
                            to="/products"
                            className="block text-center text-primary-600 hover:text-primary-700 font-medium hover:underline"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </FadeIn>
    )
}

export default Cart

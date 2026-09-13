import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../features/cart/useCart'
import FadeIn from '../components/common/FadeIn'
import Loader from '../components/common/Loader'

function Cart() {
    const { cart, cartData, loading, error, clearCart, removeFromCart, updateQuantity } = useCart()
    const navigate = useNavigate()

    if (loading) return <Loader />

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <p className="text-red-500 mb-4">{error}</p>
            </div>
        )
    }

    if (!cart || cart.length === 0) {
        return (
            <FadeIn>
                <div className="container mx-auto px-4 py-24 text-center">
                    <div className="mb-6 text-6xl">🛒</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link
                        to="/products"
                        className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition shadow-md hover:shadow-lg"
                    >
                        Start Shopping
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

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium">${cartData.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (10%)</span>
                                <span className="font-medium">${cartData.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="font-medium">
                                    {cartData.shipping === 0 ? 'FREE' : `$${cartData.shipping.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex justify-between text-xl font-bold text-gray-900">
                                <span>Total</span>
                                <span className="text-primary-600">${cartData.total.toFixed(2)}</span>
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

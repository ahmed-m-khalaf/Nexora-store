import { Link } from 'react-router-dom'
import { useCart } from '../../features/cart/useCart'

function Navbar() {
    const { getCartCount } = useCart()
    const cartItemsCount = getCartCount()

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition">
                        🛍️ Nexora Store
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link to="/" className="group relative text-gray-700 hover:text-primary-600 transition font-medium">
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
                        </Link>
                        <Link to="/products" className="group relative text-gray-700 hover:text-primary-600 transition font-medium">
                            Products
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
                        </Link>
                        <Link to="/cart" className="group relative text-gray-700 hover:text-primary-600 transition font-medium">
                            🛒 Cart
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar

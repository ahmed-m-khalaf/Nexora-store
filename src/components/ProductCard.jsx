import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function ProductCard({ product }) {
    const { addToCart } = useCart()
    const [isAdded, setIsAdded] = useState(false)

    const handleAddToCart = async (e) => {
        e.preventDefault() // Prevent navigation if clicked inside Link
        try {
            await addToCart(product.id)
            setIsAdded(true)
            setTimeout(() => setIsAdded(false), 1500)
        } catch (err) {
            console.error('Failed to add product to cart:', err)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
            <Link to={`/product/${product.id}`}>
                <img
                    src={product?.image || 'https://via.placeholder.com/300'}
                    alt={product?.title || 'Product'}
                    className="w-full h-64 object-contain p-4 hover:scale-105 transition-transform duration-300"
                />
            </Link>
            <div className="p-4 flex flex-col flex-1">
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 h-14 hover:text-primary-600 transition">
                        {product?.title || 'Product Title'}
                    </h3>
                </Link>
                <p className="text-2xl font-bold text-primary-600 mb-3">
                    ${product?.price || '0.00'}
                </p>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-gray-600 text-sm">
                        {product?.rating?.rate || '0'} ({product?.rating?.count || '0'})
                    </span>
                </div>
                <div className="flex gap-2 mt-auto">
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdded}
                        className={`flex-1 py-2 px-4 rounded-lg transition active:scale-95 ${isAdded
                                ? 'bg-green-600 text-white cursor-default'
                                : 'bg-primary-600 hover:bg-primary-700 text-white'
                            }`}
                    >
                        {isAdded ? 'Added! ✅' : 'Add to Cart'}
                    </button>
                    <Link
                        to={`/product/${product.id}`}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition text-center"
                    >
                        Details
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProductCard

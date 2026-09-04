import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../utils/api'
import { useCart } from '../context/CartContext'
import Loader from '../components/Loader'
import FadeIn from '../components/FadeIn'

function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await api.getProductById(id)
        setProduct(data)
      } catch {
        setError('Failed to load product details.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }

    // Button feedback logic
    const btn = document.activeElement
    if (btn) {
      const originalText = btn.innerText
      btn.innerText = 'Added to Cart! ✅'
      btn.classList.add('bg-green-600')
      btn.classList.remove('bg-primary-600', 'hover:bg-primary-700')
      setTimeout(() => {
        btn.innerText = originalText
        btn.classList.remove('bg-green-600')
        btn.classList.add('bg-primary-600', 'hover:bg-primary-700')
      }, 1500)
    }
  }

  if (loading) return <Loader />
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>
  if (!product) return <div className="text-center py-12">Product not found</div>

  return (
    <FadeIn>
      <div className="container mx-auto px-4 py-8">
        <Link to="/products" className="text-primary-600 hover:text-primary-700 mb-6 inline-block font-medium">
          ← Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-xl shadow-lg p-8">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-white p-4">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-[500px] object-contain"
            />
          </div>

          {/* Product Info */}
          <div>
            <span className="inline-block bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold mb-4 capitalize">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
            <p className="text-4xl font-bold text-primary-600 mb-6">${product.price}</p>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-yellow-500 text-xl">⭐</span>
              <span className="font-medium text-gray-900">{product.rating.rate}</span>
              <span className="text-gray-500">({product.rating.count} reviews)</span>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-700 font-semibold">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 hover:bg-gray-100 transition flex items-center justify-center text-gray-600"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 hover:bg-gray-100 transition flex items-center justify-center text-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition shadow-lg hover:shadow-xl active:scale-[0.99]"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

export default ProductDetails

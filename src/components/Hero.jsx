import { Link } from 'react-router-dom'

function Hero() {
    return (
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-5xl font-bold mb-4">Welcome to Nexora Store</h1>
                <p className="text-xl mb-8 text-primary-100">
                    Discover amazing products at unbeatable prices
                </p>
                <Link
                    to="/products"
                    className="inline-block bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition shadow-lg hover:shadow-xl"
                >
                    Shop Now →
                </Link>
            </div>
        </div>
    )
}

export default Hero

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../features/auth/AuthContext'
import { CartProvider } from '../features/cart/CartContext'
import { ToastProvider } from '../features/toast/ToastContext'
import ProtectedRoute from '../components/common/ProtectedRoute'
import ToastContainer from '../components/common/ToastContainer'
import ScrollToTop from '../components/common/ScrollToTop'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import Account from '../pages/Account'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import ProductDetails from '../pages/ProductDetails'
import Products from '../pages/Products'
import Register from '../pages/Register'
import NotFound from '../pages/NotFound'
import '../styles/app.css'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/account" element={<Account />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer />
          </div>
        </CartProvider>
      </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

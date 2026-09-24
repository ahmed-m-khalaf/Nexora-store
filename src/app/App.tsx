import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../features/auth/AuthContext'
import { CartProvider } from '../features/cart/CartContext'
import { WishlistProvider } from '../features/wishlist/WishlistContext'
import { ToastProvider } from '../features/toast/ToastContext'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import ProtectedRoute from '../components/common/ProtectedRoute'
import ToastContainer from '../components/common/ToastContainer'
import ScrollToTop from '../components/common/ScrollToTop'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import CartDrawer from '../components/layout/CartDrawer'
import Account from '../pages/Account'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import ProductDetails from '../pages/ProductDetails'
import Products from '../pages/Products'
import Register from '../pages/Register'
import Wishlist from '../pages/Wishlist'
import NotFound from '../pages/NotFound'
import '../styles/app.css'

function AppContent() {
  // Initialize Lenis smooth scroll
  useSmoothScroll()

  return (
    <>
      <ScrollToTop />
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
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
                <CartDrawer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

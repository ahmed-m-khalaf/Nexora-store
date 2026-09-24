import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../features/auth/AuthContext'
import { CartProvider } from '../features/cart/CartContext'
import { WishlistProvider } from '../features/wishlist/WishlistContext'
import { ToastProvider } from '../features/toast/ToastContext'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import ProtectedRoute from '../components/common/ProtectedRoute'
import ToastContainer from '../components/common/ToastContainer'
import ScrollToTop from '../components/common/ScrollToTop'
import PageFallback from '../components/common/PageFallback'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import CartDrawer from '../components/layout/CartDrawer'

// Eager load Home for instant First Contentful Paint
import Home from '../pages/Home'

// Code-split remaining routes for minimal initial bundle size
const Products = lazy(() => import('../pages/Products'))
const ProductDetails = lazy(() => import('../pages/ProductDetails'))
const Cart = lazy(() => import('../pages/Cart'))
const Wishlist = lazy(() => import('../pages/Wishlist'))
const Checkout = lazy(() => import('../pages/Checkout'))
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const Account = lazy(() => import('../pages/Account'))
const NotFound = lazy(() => import('../pages/NotFound'))

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
                  <Suspense fallback={<PageFallback />}>
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
                  </Suspense>
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

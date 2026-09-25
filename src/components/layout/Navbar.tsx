import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiShoppingBag, FiUser, FiLogOut, FiMenu, FiX, FiHome, FiGrid, FiHeart } from 'react-icons/fi'
import { useCart } from '../../features/cart/useCart'
import { useWishlist } from '../../features/wishlist/useWishlist'
import { useAuth } from '../../features/auth/useAuth'
import { openCartDrawer } from '../../hooks/useCartDrawer'
import LiveSearch from '../catalog/LiveSearch'

function Navbar() {
  const { getCartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const cartItemsCount = getCartCount()

  const closeMenu = () => setMobileMenuOpen(false)

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 text-sm font-medium transition-colors ${
      isActive ? 'text-primary-600 font-semibold' : 'text-slate-700 hover:text-primary-600'
    }`

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-8">
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5 font-display text-xl font-semibold tracking-tight text-slate-900 transition hover:opacity-90"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm">
              <FiShoppingBag className="h-5 w-5" />
            </span>
            <span>Nexora</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex xl:items-center xl:gap-8">
            <NavLink to="/" className={navLinkClass}>
              <FiHome className="h-4 w-4" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              <FiGrid className="h-4 w-4" />
              <span>Catalog</span>
            </NavLink>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden justify-self-end xl:flex xl:items-center xl:gap-3">
            <LiveSearch />
            {/* Wishlist Link */}
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-rose-50 text-rose-700'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-rose-600'
                }`
              }
              title="Wishlist"
            >
              <FiHeart className="h-5 w-5" />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </NavLink>

            {/* Cart Button - Opens Drawer */}
            <button
              onClick={openCartDrawer}
              className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <FiShoppingBag className="h-5 w-5" />
              <span>Cart</span>
              {cartItemsCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 text-xs font-bold text-white shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <div className="h-5 w-[1px] bg-slate-200" aria-hidden="true" />

            {/* Auth Session */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/account"
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-2 pr-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white uppercase">
                    {user.name.charAt(0)}
                  </span>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-red-600"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span>Exit</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-primary-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 active:scale-95"
                >
                  Join
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="col-start-3 flex items-center justify-self-end gap-1.5 xl:hidden">
            <LiveSearch compact />
            <Link
              to="/wishlist"
              onClick={closeMenu}
              className="relative rounded-lg p-2 text-slate-700 hover:bg-slate-100"
              aria-label="Wishlist"
            >
              <FiHeart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => { closeMenu(); openCartDrawer() }}
              className="relative rounded-lg p-2 text-slate-700 hover:bg-slate-100"
              aria-label="Cart"
            >
              <FiShoppingBag className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pt-2 pb-6 shadow-xl xl:hidden">
          <div className="space-y-1">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition ${
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              <FiHome className="h-5 w-5" />
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/products"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition ${
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              <FiGrid className="h-5 w-5" />
              <span>Catalog</span>
            </NavLink>
            <NavLink
              to="/wishlist"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium transition ${
                  isActive ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <FiHeart className="h-5 w-5 text-rose-500" />
                <span>Wishlist</span>
              </span>
              {wishlistCount > 0 && (
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </NavLink>
            <button
              onClick={() => { closeMenu(); openCartDrawer() }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <span className="flex items-center gap-3">
                <FiShoppingBag className="h-5 w-5" />
                <span>Cart</span>
              </span>
              {cartItemsCount > 0 && (
                <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs font-bold text-white">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>

          <div className="my-3 border-t border-slate-100" />

          {user ? (
            <div className="space-y-2">
              <Link
                to="/account"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                <FiUser className="h-5 w-5 text-primary-600" />
                <div>
                  <div className="font-semibold text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
              </Link>
              <button
                onClick={() => {
                  logout()
                  closeMenu()
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-red-600 hover:bg-red-50"
              >
                <FiLogOut className="h-5 w-5" />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex items-center justify-center rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="flex items-center justify-center rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar

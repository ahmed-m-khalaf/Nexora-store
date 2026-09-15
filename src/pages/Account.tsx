import { Link } from 'react-router-dom'
import { FiUser, FiMail, FiShield, FiShoppingBag, FiLogOut, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../features/auth/useAuth'

export default function Account() {
  const { user, logout } = useAuth()
  if (!user) return null

  return (
    <section className="container mx-auto max-w-3xl px-4 py-12">
      {/* Profile Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-2xl font-bold text-white shadow-md uppercase">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
              <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700 uppercase">
                {user.role}
              </span>
            </div>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-red-50 hover:text-red-600 sm:self-auto"
        >
          <FiLogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Account Details & Shortcuts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Details Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-slate-900 flex items-center gap-2">
            <FiUser className="text-primary-600" />
            <span>Profile Information</span>
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Full Name</span>
              <span className="font-medium text-slate-900">{user.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Email Address</span>
              <span className="font-medium text-slate-900 flex items-center gap-1.5">
                <FiMail className="text-slate-400" />
                {user.email}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Security</span>
              <span className="font-medium text-emerald-600 flex items-center gap-1">
                <FiShield /> Protected via JWT & bcrypt
              </span>
            </div>
          </div>
        </div>

        {/* Quick Shopping Actions */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="mb-2 text-base font-bold text-slate-900 flex items-center gap-2">
              <FiShoppingBag className="text-primary-600" />
              <span>Shopping & Cart</span>
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Your cart items are synchronized with your account. Continue where you left off.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/cart"
              className="inline-flex items-center justify-between rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
            >
              <span>Go to My Cart</span>
              <FiArrowRight />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <span>Explore Products</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

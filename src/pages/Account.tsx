import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiUser, FiMail, FiShield, FiShoppingBag, FiLogOut, FiArrowRight, FiPackage } from 'react-icons/fi'
import { useAuth } from '../features/auth/useAuth'
import { api } from '../services/api'
import type { Order } from '../types'

export default function Account() {
  const { user, logout } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState('')

  useEffect(() => {
    let active = true
    api.getMyOrders().then(data => { if (active) setOrders(data) })
      .catch(error => { if (active) setOrdersError(error instanceof Error ? error.message : 'Could not load your orders.') })
      .finally(() => { if (active) setOrdersLoading(false) })
    return () => { active = false }
  }, [])

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

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <FiPackage className="text-primary-600" />
          <h2 className="text-base font-bold text-slate-900">Your orders</h2>
        </div>
        {ordersLoading ? <p className="text-sm text-slate-500">Loading order history…</p> : ordersError ? <p role="alert" className="text-sm text-red-600">{ordersError}</p> : orders.length === 0 ? <p className="text-sm text-slate-500">No orders yet. Your purchases will appear here.</p> : (
          <div className="space-y-4">
            {orders.map(order => {
              const steps = ['Order placed', 'Processing', 'Completed']
              const currentStep = order.status === 'COMPLETED' ? 2 : order.status === 'CANCELLED' ? -1 : order.status === 'PROCESSING' ? 1 : 0
              return <article key={order.id} className="rounded-lg border border-slate-100 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div><p className="font-semibold text-slate-900">Order #{order.id.slice(0, 8)}</p><p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p></div>
                  <span className="text-sm font-bold text-primary-700">${order.total.toFixed(2)} · {order.status.toLowerCase()}</span>
                </div>
                {order.status === 'CANCELLED' ? <p className="mt-3 text-sm text-red-600">This order was cancelled.</p> : <ol aria-label={`Order ${order.id} progress`} className="mt-4 grid grid-cols-3 gap-2">
                  {steps.map((step, index) => <li key={step} className="flex items-center gap-2 text-xs">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${index <= currentStep ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{index < currentStep ? '✓' : index + 1}</span>
                    <span className={index <= currentStep ? 'font-semibold text-slate-800' : 'text-slate-400'}>{step}</span>
                  </li>)}
                </ol>}
                <p className="mt-3 text-xs text-slate-500">{order.items.length} item{order.items.length === 1 ? '' : 's'} · {order.items.map(item => `${item.title} × ${item.quantity}`).join(', ')}</p>
              </article>
            })}
          </div>
        )}
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

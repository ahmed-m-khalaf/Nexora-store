import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'
import FadeIn from '../components/FadeIn'
import Loader from '../components/Loader'

const emptyForm = {
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
}

function Checkout() {
    const { cart, cartData, loading, checkout } = useCart()
    const [form, setForm] = useState(emptyForm)
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [order, setOrder] = useState(null)

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((current) => ({ ...current, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitting(true)
        setSubmitError('')

        try {
            const placedOrder = await checkout(form)
            setOrder(placedOrder)
        } catch (err) {
            setSubmitError(err.message || 'We could not place your order. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <Loader />

    if (order) {
        return (
            <FadeIn>
                <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
                    <div className="mb-5 text-6xl">✓</div>
                    <h1 className="mb-3 text-3xl font-bold text-gray-900">Order confirmed</h1>
                    <p className="mb-6 text-gray-600">Thank you, {order.customer.name}. Your order has been placed.</p>
                    <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6 text-left">
                        <p className="mb-3 text-sm text-gray-500">Order reference</p>
                        <p className="mb-5 break-all font-mono text-sm font-semibold text-gray-900">{order.id}</p>
                        <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-bold">
                            <span>Total paid at checkout</span>
                            <span className="text-primary-600">${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                    <Link to="/products" className="inline-block rounded-lg bg-primary-600 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-primary-700">
                        Continue Shopping
                    </Link>
                </div>
            </FadeIn>
        )
    }

    if (!cart || cart.length === 0) {
        return (
            <FadeIn>
                <div className="container mx-auto px-4 py-24 text-center">
                    <h1 className="mb-4 text-3xl font-bold text-gray-900">Your Cart is Empty</h1>
                    <Link to="/products" className="font-semibold text-primary-600 hover:underline">Browse products</Link>
                </div>
            </FadeIn>
        )
    }

    return (
        <FadeIn>
            <div className="container mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-3">
                <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
                    <h1 className="mb-6 text-3xl font-bold text-gray-900">Checkout</h1>
                    <div className="space-y-5">
                        <label className="block text-sm font-medium text-gray-700">
                            Full name
                            <input required name="customerName" value={form.customerName} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-primary-600" />
                        </label>
                        <label className="block text-sm font-medium text-gray-700">
                            Email address
                            <input required type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-primary-600" />
                        </label>
                        <label className="block text-sm font-medium text-gray-700">
                            Phone number
                            <input required type="tel" name="customerPhone" value={form.customerPhone} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-primary-600" />
                        </label>
                        <label className="block text-sm font-medium text-gray-700">
                            Shipping address
                            <textarea required name="shippingAddress" value={form.shippingAddress} onChange={handleChange} rows="4" className="mt-1 w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-primary-600" />
                        </label>
                    </div>
                    {submitError && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{submitError}</p>}
                    <button disabled={submitting} className="mt-7 w-full rounded-lg bg-primary-600 py-3 font-bold text-white shadow-md transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
                        {submitting ? 'Placing order…' : `Place order — $${cartData.total.toFixed(2)}`}
                    </button>
                </form>

                <aside className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
                    <h2 className="mb-5 text-xl font-bold text-gray-900">Order Summary</h2>
                    <div className="space-y-3 text-sm text-gray-600">
                        {cart.map((item) => <div key={item.id} className="flex justify-between gap-4"><span>{item.product.title} × {item.quantity}</span><span>${item.subtotal.toFixed(2)}</span></div>)}
                    </div>
                    <div className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-gray-600">
                        <div className="flex justify-between"><span>Subtotal</span><span>${cartData.subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Tax</span><span>${cartData.tax.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Shipping</span><span>{cartData.shipping === 0 ? 'FREE' : `$${cartData.shipping.toFixed(2)}`}</span></div>
                        <div className="flex justify-between pt-3 text-lg font-bold text-gray-900"><span>Total</span><span className="text-primary-600">${cartData.total.toFixed(2)}</span></div>
                    </div>
                </aside>
            </div>
        </FadeIn>
    )
}

export default Checkout

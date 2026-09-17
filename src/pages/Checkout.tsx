import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../features/cart/useCart'
import FadeIn from '../components/common/FadeIn'
import Loader from '../components/common/Loader'
import type { CheckoutCustomer, CheckoutFormErrors, Order } from '../types'
import { getErrorMessage } from '../utils/errors'
import { FiCheck } from 'react-icons/fi'

const emptyForm: CheckoutCustomer = {
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
}

function Checkout() {
    const { cart, cartData, loading, checkout } = useCart()
    const [step, setStep] = useState<1 | 2>(1)
    const [form, setForm] = useState(emptyForm)
    const [errors, setErrors] = useState<CheckoutFormErrors>({})
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [order, setOrder] = useState<Order | null>(null)

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setForm((current) => ({ ...current, [name]: value }))
        if (errors[name as keyof CheckoutFormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }))
        }
    }

    const validateForm = () => {
        const newErrors: CheckoutFormErrors = {}
        if (!form.customerName.trim()) newErrors.customerName = 'Name is required'
        if (!form.customerEmail.trim()) newErrors.customerEmail = 'Email is required'
        else if (!/^\S+@\S+\.\S+$/.test(form.customerEmail)) newErrors.customerEmail = 'Invalid email address'
        if (!form.customerPhone.trim()) newErrors.customerPhone = 'Phone is required'
        if (!form.shippingAddress.trim()) newErrors.shippingAddress = 'Shipping address is required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = (e: FormEvent) => {
        e.preventDefault()
        if (validateForm()) setStep(2)
    }

    const handleSubmit = async () => {
        setSubmitting(true)
        setSubmitError('')
        try {
            const placedOrder = await checkout(form)
            setOrder(placedOrder)
        } catch (error: unknown) {
            setSubmitError(getErrorMessage(error, 'We could not place your order. Please try again.'))
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <Loader />

    if (order) {
        return (
            <FadeIn>
                <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <FiCheck className="h-10 w-10" />
                    </div>
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
            <div className="container mx-auto max-w-4xl px-4 py-10">
                {/* Step Indicator */}
                <div className="mb-10 flex items-center justify-center">
                    <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                        <div className="text-sm font-semibold text-gray-700">Contact</div>
                        <div className={`h-1 w-16 rounded ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                        <div className="text-sm font-semibold text-gray-700">Review</div>
                        <div className="h-1 w-16 rounded bg-gray-200" />
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-500">3</div>
                        <div className="text-sm font-semibold text-gray-500">Confirm</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        {step === 1 ? (
                            <form onSubmit={handleNext} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="mb-6 text-2xl font-bold text-gray-900">Contact & Shipping</h2>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Full name</label>
                                        <input autoComplete="name" name="customerName" value={form.customerName} onChange={handleChange} className={`mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary-200 ${errors.customerName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'}`} />
                                        {errors.customerName && <p className="mt-1 text-xs text-red-500">{errors.customerName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email address</label>
                                        <input autoComplete="email" type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange} className={`mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary-200 ${errors.customerEmail ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'}`} />
                                        {errors.customerEmail && <p className="mt-1 text-xs text-red-500">{errors.customerEmail}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone number</label>
                                        <input autoComplete="tel" type="tel" name="customerPhone" value={form.customerPhone} onChange={handleChange} className={`mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary-200 ${errors.customerPhone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'}`} />
                                        {errors.customerPhone && <p className="mt-1 text-xs text-red-500">{errors.customerPhone}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Shipping address</label>
                                        <textarea autoComplete="shipping address-line1" name="shippingAddress" value={form.shippingAddress} onChange={handleChange} rows={4} className={`mt-1 w-full resize-y rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary-200 ${errors.shippingAddress ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'}`} />
                                        {errors.shippingAddress && <p className="mt-1 text-xs text-red-500">{errors.shippingAddress}</p>}
                                    </div>
                                </div>
                                <button type="submit" className="mt-7 w-full rounded-lg bg-primary-600 py-3 font-bold text-white shadow-md transition hover:bg-primary-700">
                                    Continue to Review
                                </button>
                            </form>
                        ) : (
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="mb-6 text-2xl font-bold text-gray-900">Review Your Order</h2>
                                <div className="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-gray-900">Shipping Details</h3>
                                        <button onClick={() => setStep(1)} className="text-sm font-medium text-primary-600 hover:underline">Edit</button>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p><span className="font-medium">Name:</span> {form.customerName}</p>
                                        <p><span className="font-medium">Email:</span> {form.customerEmail}</p>
                                        <p><span className="font-medium">Phone:</span> {form.customerPhone}</p>
                                        <p><span className="font-medium">Address:</span> {form.shippingAddress}</p>
                                    </div>
                                </div>
                                
                                {submitError && <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{submitError}</p>}
                                
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} disabled={submitting} className="flex-1 rounded-lg border border-gray-300 bg-white py-3 font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60">
                                        Back
                                    </button>
                                    <button onClick={handleSubmit} disabled={submitting} className="flex-[2] rounded-lg bg-primary-600 py-3 font-bold text-white shadow-md transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
                                        {submitting ? 'Placing order…' : `Place Order — $${cartData.total.toFixed(2)}`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
                        <h2 className="mb-5 text-xl font-bold text-gray-900">Order Summary</h2>
                        <div className="space-y-3 text-sm text-gray-600">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                    <span className="line-clamp-2">{item.product.title} <span className="font-semibold text-gray-400">×{item.quantity}</span></span>
                                    <span className="font-medium text-gray-900">${item.subtotal.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-gray-600 text-sm">
                            <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-gray-900">${cartData.subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Tax</span><span className="font-medium text-gray-900">${cartData.tax.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Shipping</span><span className="font-medium text-gray-900">{cartData.shipping === 0 ? 'FREE' : `$${cartData.shipping.toFixed(2)}`}</span></div>
                            <div className="flex justify-between pt-3 text-lg font-bold text-gray-900"><span>Total</span><span className="text-primary-600">${cartData.total.toFixed(2)}</span></div>
                        </div>
                    </aside>
                </div>
            </div>
        </FadeIn>
    )
}

export default Checkout

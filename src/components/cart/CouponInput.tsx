import { useState, type FormEvent } from 'react'
import { FiChevronDown, FiChevronUp, FiPercent, FiTag, FiX } from 'react-icons/fi'
import type { AppliedCoupon } from '../../types'
import { AVAILABLE_COUPONS } from '../../features/coupons/couponData'

interface CouponInputProps {
    appliedCoupon: AppliedCoupon | null
    subtotal: number
    shipping?: number
    onApply: (code: string) => boolean
    onRemove: () => void
    variant?: 'compact' | 'full'
}

export default function CouponInput({
    appliedCoupon,
    subtotal,
    onApply,
    onRemove,
    variant = 'compact',
}: CouponInputProps) {
    const [inputCode, setInputCode] = useState('')
    const [showHints, setShowHints] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!inputCode.trim()) return
        const ok = onApply(inputCode)
        if (ok) {
            setInputCode('')
        }
    }

    const handleSelectHint = (code: string) => {
        setInputCode(code)
        onApply(code)
    }

    if (appliedCoupon) {
        return (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                        <FiTag className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                            <span>{appliedCoupon.code}</span>
                            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-200/70 text-emerald-800">
                                -${appliedCoupon.discountAmount.toFixed(2)}
                            </span>
                        </div>
                        <p className="text-xs text-emerald-600 truncate">{appliedCoupon.description}</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    className="p-1 rounded-md text-emerald-600 hover:bg-emerald-100 hover:text-emerald-800 transition"
                    title="Remove coupon"
                    aria-label="Remove coupon"
                >
                    <FiX className="h-4 w-4" />
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {variant === 'compact' ? (
                <div>
                    {!isExpanded ? (
                        <button
                            type="button"
                            onClick={() => setIsExpanded(true)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition"
                        >
                            <FiPercent className="h-3 w-3" />
                            Have a promo code?
                        </button>
                    ) : (
                        <div className="space-y-2 pt-1">
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={inputCode}
                                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                                        placeholder="Enter promo code"
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs uppercase text-slate-800 placeholder:normal-case placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!inputCode.trim()}
                                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800 active:scale-95 disabled:opacity-40"
                                >
                                    Apply
                                </button>
                            </form>
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                                <button
                                    type="button"
                                    onClick={() => setShowHints(!showHints)}
                                    className="hover:text-primary-600 underline transition"
                                >
                                    {showHints ? 'Hide suggestions' : 'Available coupons'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded(false)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                            <FiTag className="text-primary-600" />
                            Promo Code
                        </span>
                        <button
                            type="button"
                            onClick={() => setShowHints(!showHints)}
                            className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                        >
                            <span>Available coupons</span>
                            {showHints ? <FiChevronUp className="h-3 w-3" /> : <FiChevronDown className="h-3 w-3" />}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                            placeholder="Enter promo code (e.g. NEXORA10)"
                            className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm uppercase text-slate-800 placeholder:normal-case placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                        />
                        <button
                            type="submit"
                            disabled={!inputCode.trim()}
                            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-95 disabled:opacity-40"
                        >
                            Apply
                        </button>
                    </form>
                </div>
            )}

            {/* Suggestions pill list */}
            {showHints && (
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 space-y-1.5 text-xs animate-in fade-in-50 duration-200">
                    <p className="font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                        Click code to apply:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {AVAILABLE_COUPONS.map((c) => {
                            const isEligible = !c.minSpend || subtotal >= c.minSpend
                            return (
                                <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => handleSelectHint(c.code)}
                                    className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] font-semibold border transition ${
                                        isEligible
                                            ? 'bg-white border-primary-200 text-primary-700 hover:bg-primary-50 active:scale-95'
                                            : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                                    title={c.description}
                                >
                                    <span>{c.code}</span>
                                    <span className="text-[10px] text-slate-500 font-sans">({c.description})</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

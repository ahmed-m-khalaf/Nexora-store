import { useState, useCallback } from 'react'
import type { AppliedCoupon } from '../../types'
import { validateCoupon } from './couponData'
import { useToast } from '../toast/useToast'
import { celebrateAction } from '../../lib/confetti'

const STORAGE_KEY = 'nexora_applied_coupon'

export function useCoupon() {
    const { success, error: toastError, info } = useToast()
    const [couponCode, setCouponCode] = useState<string | null>(() => {
        try {
            return localStorage.getItem(STORAGE_KEY)
        } catch {
            return null
        }
    })

    const apply = useCallback(
        (rawCode: string, subtotal: number, shipping: number) => {
            const result = validateCoupon(rawCode, subtotal, shipping)
            if (!result.success) {
                toastError(result.error)
                return false
            }

            try {
                localStorage.setItem(STORAGE_KEY, result.coupon.code)
            } catch {
                // ignore
            }
            setCouponCode(result.coupon.code)
            success(`Promo code "${result.coupon.code}" applied! You saved $${result.coupon.discountAmount.toFixed(2)}`)
            celebrateAction()
            return true
        },
        [success, toastError]
    )

    const remove = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY)
        } catch {
            // ignore
        }
        setCouponCode(null)
        info('Promo code removed')
    }, [info])

    const getAppliedCoupon = useCallback(
        (subtotal: number, shipping: number): AppliedCoupon | null => {
            if (!couponCode) return null
            const res = validateCoupon(couponCode, subtotal, shipping)
            if (res.success) {
                return res.coupon
            }
            return null
        },
        [couponCode]
    )

    return {
        couponCode,
        applyCoupon: apply,
        removeCoupon: remove,
        getAppliedCoupon,
    }
}

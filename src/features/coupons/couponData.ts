import type { AppliedCoupon, Coupon } from '../../types'

export const AVAILABLE_COUPONS: Coupon[] = [
    {
        code: 'NEXORA10',
        type: 'percentage',
        value: 10,
        description: '10% off entire order',
    },
    {
        code: 'SAVE20',
        type: 'percentage',
        value: 20,
        description: '20% off entire order',
        minSpend: 50,
    },
    {
        code: 'FREESHIP',
        type: 'free_shipping',
        value: 100, // 100% off shipping fee
        description: 'Free shipping on any order',
    },
    {
        code: 'WELCOME5',
        type: 'fixed',
        value: 5,
        description: '$5 off your order',
    },
    {
        code: 'VIP30',
        type: 'percentage',
        value: 30,
        description: '30% off orders over $100',
        minSpend: 100,
    },
]

export function validateCoupon(
    rawCode: string,
    subtotal: number,
    shipping: number
): { success: true; coupon: AppliedCoupon } | { success: false; error: string } {
    const cleanCode = rawCode.trim().toUpperCase()
    const found = AVAILABLE_COUPONS.find((c) => c.code === cleanCode)

    if (!found) {
        return { success: false, error: 'Invalid coupon code. Try NEXORA10 or SAVE20.' }
    }

    if (found.minSpend && subtotal < found.minSpend) {
        return {
            success: false,
            error: `Coupon "${found.code}" requires a minimum spend of $${found.minSpend.toFixed(2)}.`,
        }
    }

    let discountAmount = 0
    if (found.type === 'percentage') {
        discountAmount = (subtotal * found.value) / 100
    } else if (found.type === 'fixed') {
        discountAmount = Math.min(subtotal, found.value)
    } else if (found.type === 'free_shipping') {
        discountAmount = shipping
    }

    return {
        success: true,
        coupon: {
            ...found,
            discountAmount: Math.round(discountAmount * 100) / 100,
        },
    }
}

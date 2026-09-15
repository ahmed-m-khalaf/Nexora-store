import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import type { Product } from '../../types'
import ProductCard from './ProductCard'

type ProductGridProps = { products: Product[] }

export default function ProductGrid({ products }: ProductGridProps) {
    const ref = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const element = ref.current
        if (!element) return

        const cards = element.querySelectorAll<HTMLElement>('[data-product-card]')
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const context = gsap.context(() => {
            if (reducedMotion) {
                gsap.set(cards, { autoAlpha: 1, y: 0 })
                return
            }

            gsap.fromTo(cards,
                { autoAlpha: 0, y: 24 },
                { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out' },
            )
        }, ref)

        return () => context.revert()
    }, [products])

    return (
        <div ref={ref} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
    )
}

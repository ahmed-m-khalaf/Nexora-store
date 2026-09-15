import { useLayoutEffect, useRef, type PropsWithChildren } from 'react'
import gsap from 'gsap'

type FadeInProps = PropsWithChildren<{ delay?: number; className?: string }>

function FadeIn({ children, delay = 0, className = '' }: FadeInProps) {
    const ref = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const element = ref.current
        if (!element) return

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const context = gsap.context(() => {
            if (reducedMotion) {
                gsap.set(element, { autoAlpha: 1, y: 0 })
                return
            }

            gsap.fromTo(element,
                { autoAlpha: 0, y: 18 },
                { autoAlpha: 1, y: 0, delay, duration: 0.55, ease: 'power3.out' },
            )
        }, ref)

        return () => context.revert()
    }, [delay])

    return <div ref={ref} className={className}>{children}</div>
}

export default FadeIn

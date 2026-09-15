import { useLayoutEffect, useRef, type PropsWithChildren } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type ScrollRevealProps = PropsWithChildren<{ className?: string }>

export default function ScrollReveal({ children, className = '' }: ScrollRevealProps) {
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
                { autoAlpha: 0, y: 28 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.65,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: element, start: 'top 86%', once: true },
                },
            )
        }, ref)

        return () => context.revert()
    }, [])

    return <div ref={ref} className={className}>{children}</div>
}

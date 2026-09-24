/**
 * Parallax Component
 * 
 * Creates depth through scroll-based movement.
 * Elements move at different speeds relative to scroll position.
 */

import { useRef, useEffect, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ParallaxProps {
  children: ReactNode
  speed?: number // 0.5 = slower, 2 = faster (default: 0.5)
  direction?: 'vertical' | 'horizontal'
  className?: string
}

export default function Parallax({
  children,
  speed = 0.5,
  direction = 'vertical',
  className = '',
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    // Check for reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const movement = direction === 'vertical' 
      ? { y: 100 * speed } 
      : { x: 100 * speed }

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        ...movement,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    })

    return () => ctx.revert()
  }, [speed, direction])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

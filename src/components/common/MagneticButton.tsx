/**
 * Magnetic Button Component
 * 
 * Interactive button that follows mouse movement with a magnetic effect.
 * Creates an engaging micro-interaction without being distracting.
 */

import { useRef, type ReactNode, type MouseEvent } from 'react'
import gsap from 'gsap'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  strength?: number // 0.1 - 0.5 (default: 0.3)
  as?: 'button' | 'div'
  disabled?: boolean
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  strength = 0.3,
  as: Component = 'button',
  disabled = false,
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (disabled || !containerRef.current) return

    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2

    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    // Move container
    gsap.to(containerRef.current, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: 'power2.out',
    })

    // Move text slightly more for depth effect
    gsap.to(textRef.current, {
      x: deltaX * 0.5,
      y: deltaY * 0.5,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    if (disabled) return

    // Return to original position with elastic bounce
    gsap.to([containerRef.current, textRef.current], {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
    })
  }

  const props = {
    ref: containerRef as any,
    className: `relative inline-block ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick: disabled ? undefined : onClick,
    disabled: Component === 'button' ? disabled : undefined,
  }

  return (
    <Component {...props}>
      <span ref={textRef} className="inline-block">
        {children}
      </span>
    </Component>
  )
}

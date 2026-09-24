/**
 * Lenis Smooth Scroll Configuration
 * 
 * Provides buttery smooth inertia scrolling across the entire application.
 * Integrated with GSAP ScrollTrigger for synchronized animations.
 */

import Lenis from 'lenis'

export function createLenis(): Lenis {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  })

  return lenis
}

export function destroyLenis(lenis: Lenis | null): void {
  if (lenis) {
    lenis.destroy()
  }
}

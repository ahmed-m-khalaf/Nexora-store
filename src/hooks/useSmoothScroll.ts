/**
 * Smooth Scroll Hook
 * 
 * Initializes Lenis smooth scrolling and integrates with GSAP ScrollTrigger
 * for synchronized scroll-based animations.
 */

import { useEffect } from 'react'
import { createLenis, destroyLenis } from '../lib/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll() {
  useEffect(() => {
    // Check for reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (reducedMotion) {
      return // Don't apply smooth scroll if user prefers reduced motion
    }

    const lenis = createLenis()

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Add Lenis raf to GSAP ticker for smooth integration
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    // Disable lag smoothing for better performance
    gsap.ticker.lagSmoothing(0)

    // Cleanup
    return () => {
      gsap.ticker.remove(lenis.raf)
      destroyLenis(lenis)
    }
  }, [])
}

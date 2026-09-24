/**
 * GSAP Context Hook
 * 
 * Provides automatic cleanup for GSAP animations.
 * Ensures no memory leaks when components unmount.
 */

import { useEffect, useRef, type DependencyList } from 'react'
import gsap from 'gsap'

export function useGSAP(
  callback: (ctx: gsap.Context) => void,
  deps: DependencyList = []
) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      callback(ctx)
    }, ref)

    // Automatic cleanup on unmount or deps change
    return () => ctx.revert()
  }, deps)

  return ref
}

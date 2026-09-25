/**
 * Confetti Celebration Utilities
 * 
 * Lightweight canvas-based confetti effects for celebrating user actions
 * (e.g., successful order placement)
 */

import confetti from 'canvas-confetti'

const NEXORA_COLORS = ['#082052', '#f8f0e5', '#385b88', '#d7c6aa', '#ffffff']

/**
 * Celebrate order completion with confetti burst from both sides
 */
export function celebrateOrder(): void {
  const duration = 3000
  const end = Date.now() + duration

  const frame = () => {
    // Left side
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: NEXORA_COLORS,
    })

    // Right side
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: NEXORA_COLORS,
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }

  frame()
}

/**
 * Single burst confetti from center
 */
export function celebrateAction(): void {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: NEXORA_COLORS,
  })
}

/**
 * Cart Drawer State Hook
 *
 * Global state for the slide-over cart drawer.
 * Uses a simple pub/sub to avoid extra context overhead.
 */

import { useCallback, useSyncExternalStore } from 'react'

type Listener = () => void

let isOpen = false
const listeners = new Set<Listener>()

function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): boolean {
  return isOpen
}

function emit(): void {
  listeners.forEach((l) => l())
}

export function openCartDrawer(): void {
  if (!isOpen) {
    isOpen = true
    emit()
  }
}

export function closeCartDrawer(): void {
  if (isOpen) {
    isOpen = false
    emit()
  }
}

export function toggleCartDrawer(): void {
  isOpen = !isOpen
  emit()
}

export function useCartDrawer() {
  const open = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return {
    isOpen: open,
    open: useCallback(() => openCartDrawer(), []),
    close: useCallback(() => closeCartDrawer(), []),
    toggle: useCallback(() => toggleCartDrawer(), []),
  }
}

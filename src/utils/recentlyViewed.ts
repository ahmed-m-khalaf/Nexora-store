import type { Product } from '../types'

const STORAGE_KEY = 'nexora-recently-viewed'
const MAX_RECENT = 8

export function rememberViewedProduct(product: Product) {
  try {
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as number[]
    const next = [product.id, ...ids.filter(id => id !== product.id)].slice(0, MAX_RECENT)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch { /* Storage may be unavailable in private browsing. */ }
}

export function getRecentlyViewedIds() {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(value) ? value.filter((id): id is number => Number.isInteger(id) && id > 0).slice(0, MAX_RECENT) : []
  } catch { return [] }
}

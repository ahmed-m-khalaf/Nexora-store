import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'
import { api } from '../../services/api'
import type { Product } from '../../types'

const POPULAR_SEARCHES = ['Headphones', 'Backpack', 'Smartwatch', 'Sneakers']

export default function LiveSearch({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  useEffect(() => {
    if (!open) return
    let active = true
    const timer = window.setTimeout(() => {
      setLoading(true)
      api.getProducts({ search: query.trim(), page: 1, limit: 5, sortBy: 'title', order: 'asc' })
        .then(({ data }) => { if (active) setResults(data) })
        .catch(() => { if (active) setResults([]) })
        .finally(() => { if (active) setLoading(false) })
    }, query.trim() ? 220 : 0)
    return () => { active = false; window.clearTimeout(timer) }
  }, [open, query])

  const submit = (value = query) => {
    const normalized = value.trim()
    setOpen(false)
    navigate(normalized ? `/products?search=${encodeURIComponent(normalized)}` : '/products')
  }

  return <>
    <button type="button" onClick={() => { setQuery(''); setOpen(true) }} aria-label="Search products" className={compact ? 'rounded-lg p-2 text-slate-700 hover:bg-slate-100' : 'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100'}>
      <FiSearch className="h-5 w-5" />{!compact && <span>Search</span>}
    </button>
    {open && <div className="fixed inset-0 z-[90] bg-slate-950/40 px-4 pt-[8vh] backdrop-blur-sm" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false) }}>
      <section role="dialog" aria-modal="true" aria-label="Search products" className="mx-auto max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <form onSubmit={event => { event.preventDefault(); submit() }} className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
          <FiSearch className="h-5 w-5 shrink-0 text-primary-600" />
          <input ref={inputRef} value={query} onChange={event => setQuery(event.target.value)} placeholder="Search the collection…" className="min-w-0 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400" aria-label="Search the collection" />
          {query && <button type="button" onClick={() => setQuery('')} className="rounded p-1 text-slate-400 hover:bg-slate-100" aria-label="Clear search"><FiX /></button>}
          <kbd className="hidden rounded border border-slate-200 px-2 py-1 text-xs text-slate-400 sm:block">ESC</kbd>
        </form>
        <div className="max-h-[65vh] overflow-y-auto p-4">
          {!query.trim() && <div className="mb-3"><p className="px-2 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Popular searches</p><div className="flex flex-wrap gap-2">{POPULAR_SEARCHES.map(term => <button key={term} onClick={() => { setQuery(term); submit(term) }} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700">{term}</button>)}</div></div>}
          <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">{query.trim() ? 'Products' : 'Popular products'}</p>
          {loading ? <p className="px-2 py-5 text-sm text-slate-500">Searching…</p> : results.length === 0 ? <p className="px-2 py-5 text-sm text-slate-500">No matching products. Press Enter to search the full catalog.</p> : <ul className="space-y-1">{results.map(product => <li key={product.id}><Link to={`/product/${product.id}`} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50"><img src={product.image} alt="" className="h-12 w-12 rounded-lg bg-slate-50 object-contain p-1"/><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-800">{product.title}</span><span className="text-xs capitalize text-slate-400">{product.category}</span></span><span className="text-sm font-bold text-primary-700">${product.price.toFixed(2)}</span></Link></li>)}</ul>}
          <button onClick={() => submit()} className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-700">{query.trim() ? `See all results for “${query.trim()}”` : 'Browse all products'}</button>
        </div>
      </section>
    </div>}
  </>
}

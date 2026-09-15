import type { ChangeEvent } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'

type SearchBarProps = {
    searchTerm: string
    onSearchChange: (value: string) => void
}

function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
    return (
        <div>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-11 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={() => onSearchChange('')}
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Clear search"
                    >
                        <FiX aria-hidden />
                    </button>
                )}
            </div>
        </div>
    )
}

export default SearchBar

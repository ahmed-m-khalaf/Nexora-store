import type { ChangeEvent } from 'react'

type SearchBarProps = {
    searchTerm: string
    onSearchChange: (value: string) => void
}

function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
    return (
        <div className="mb-8">
            <div className="relative max-w-md mx-auto">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition shadow-sm"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                    🔍
                </span>
            </div>
        </div>
    )
}

export default SearchBar

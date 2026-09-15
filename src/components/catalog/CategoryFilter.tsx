type CategoryFilterProps = {
    categories: string[]
    selectedCategory: string
    onSelectCategory: (category: string) => void
}

function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
    return (
        <div className="overflow-x-auto pb-2">
            <div className="flex min-w-max gap-2 sm:flex-wrap sm:justify-center">
                <button
                    onClick={() => onSelectCategory('all')}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition whitespace-nowrap ${selectedCategory === 'all'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                >
                    All
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onSelectCategory(category)}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition whitespace-nowrap capitalize ${selectedCategory === category
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default CategoryFilter

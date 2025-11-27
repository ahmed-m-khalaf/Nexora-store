function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
    return (
        <div className="mb-8 overflow-x-auto pb-2">
            <div className="flex gap-3 justify-center min-w-max px-4">
                <button
                    onClick={() => onSelectCategory('all')}
                    className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${selectedCategory === 'all'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                >
                    All
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onSelectCategory(category)}
                        className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap capitalize ${selectedCategory === category
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
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

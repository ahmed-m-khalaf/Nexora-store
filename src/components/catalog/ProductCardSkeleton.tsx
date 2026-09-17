export default function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full border border-gray-100">
            <div className="aspect-[4/3] bg-gray-200 shimmer relative" />
            <div className="p-5 flex flex-col flex-grow gap-3">
                <div className="flex justify-between items-start gap-2">
                    <div className="h-5 bg-gray-200 rounded w-2/3 shimmer" />
                    <div className="h-5 bg-gray-200 rounded w-1/4 shimmer" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/3 shimmer" />
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="h-8 bg-gray-200 rounded w-1/4 shimmer" />
                    <div className="h-10 bg-gray-200 rounded w-24 shimmer" />
                </div>
            </div>
        </div>
    )
}

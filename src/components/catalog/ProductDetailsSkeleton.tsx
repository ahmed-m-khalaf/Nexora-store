export default function ProductDetailsSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Skeleton */}
                <div className="aspect-square bg-gray-200 rounded-2xl shimmer" />

                {/* Content Skeleton */}
                <div className="flex flex-col gap-6">
                    <div className="h-6 bg-gray-200 rounded w-1/4 shimmer" />
                    <div className="h-10 bg-gray-200 rounded w-3/4 shimmer" />
                    
                    <div className="flex items-center gap-4">
                        <div className="h-6 bg-gray-200 rounded w-32 shimmer" />
                        <div className="h-6 bg-gray-200 rounded w-24 shimmer" />
                    </div>

                    <div className="h-12 bg-gray-200 rounded w-1/3 shimmer" />

                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-full shimmer" />
                        <div className="h-4 bg-gray-200 rounded w-full shimmer" />
                        <div className="h-4 bg-gray-200 rounded w-2/3 shimmer" />
                    </div>

                    <div className="pt-8 border-t border-gray-100 flex gap-4 mt-auto">
                        <div className="h-14 bg-gray-200 rounded w-32 shimmer" />
                        <div className="h-14 bg-gray-200 rounded flex-1 shimmer" />
                    </div>
                </div>
            </div>
        </div>
    )
}

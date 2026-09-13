function Loader() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
                <div className="mt-4 text-center text-gray-600 font-medium">Loading...</div>
            </div>
        </div>
    )
}

export default Loader

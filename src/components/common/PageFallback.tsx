export default function PageFallback() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary-200 border-t-primary-600" />
                <span className="text-xs font-medium text-slate-400">Loading page...</span>
            </div>
        </div>
    )
}

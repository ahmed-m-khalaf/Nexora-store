import { useState, type ImgHTMLAttributes } from 'react'

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string
    alt: string
    fallbackSrc?: string
    containerClassName?: string
}

export default function OptimizedImage({
    src,
    alt,
    fallbackSrc = '/products/placeholder.svg',
    className = '',
    containerClassName = '',
    loading = 'lazy',
    ...props
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)

    const currentSrc = hasError || !src ? fallbackSrc : src

    return (
        <div className={`relative overflow-hidden ${containerClassName}`}>
            {/* Shimmer skeleton while loading */}
            {!isLoaded && !hasError && (
                <div
                    className="absolute inset-0 bg-slate-100 animate-pulse"
                    aria-hidden="true"
                />
            )}

            <img
                src={currentSrc}
                alt={alt}
                loading={loading}
                decoding="async"
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setHasError(true)
                    setIsLoaded(true)
                }}
                className={`transition-opacity duration-300 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                } ${className}`}
                {...props}
            />
        </div>
    )
}

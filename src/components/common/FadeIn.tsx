import { useEffect, useState, type PropsWithChildren } from 'react'

type FadeInProps = PropsWithChildren<{ delay?: number }>

function FadeIn({ children, delay = 0 }: FadeInProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, delay)
        return () => clearTimeout(timer)
    }, [delay])

    return (
        <div
            className={`transition-opacity duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
        >
            {children}
        </div>
    )
}

export default FadeIn

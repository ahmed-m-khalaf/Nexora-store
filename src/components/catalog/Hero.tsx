import { useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { FiSearch } from 'react-icons/fi'
import MagneticButton from '../common/MagneticButton'
import Parallax from '../common/Parallax'
import type { Product } from '../../types'

type HeroProps = {
    featuredProduct?: Product
}

function Hero({ featuredProduct }: HeroProps) {
    const ref = useRef<HTMLElement>(null)
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')

    useLayoutEffect(() => {
        const element = ref.current
        if (!element) return

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const context = gsap.context(() => {
            if (reducedMotion) {
                gsap.set('.hero-piece', { autoAlpha: 1, y: 0, scale: 1 })
                return
            }

            gsap.fromTo('.hero-piece',
                { autoAlpha: 0, y: 22 },
                { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' },
            )
            gsap.to('.hero-orb', {
                y: -16,
                duration: 3.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            })
        }, ref)

        return () => context.revert()
    }, [])

    const handleSearch = (e: FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    return (
        <section ref={ref} className="relative isolate overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(29,88,246,0.25),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.18),_transparent_45%)]" />
            <div className="hero-orb absolute -right-24 top-8 -z-0 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" />
            <div className="container relative z-10 mx-auto grid min-h-[520px] items-center gap-10 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="max-w-2xl">
                    <span className="hero-piece mb-5 inline-flex rounded-full border border-primary-400/30 bg-primary-500/10 px-4 py-2 text-sm font-semibold text-primary-200 backdrop-blur">
                        Curated essentials · Designed for everyday
                    </span>
                    <h1 className="hero-piece text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
                        Better products for your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-sky-300 to-indigo-300">everyday.</span>
                    </h1>
                    <p className="hero-piece mt-6 max-w-xl text-lg leading-8 text-slate-300">
                        Discover a focused collection of useful, beautiful pieces — selected to make work, travel, and life feel lighter.
                    </p>
                    <div className="hero-piece mt-8 flex flex-wrap gap-4 mb-8">
                        <MagneticButton
                            strength={0.2}
                            className="rounded-xl bg-primary-600 px-6 py-3 font-bold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-500 active:scale-95"
                        >
                            <Link to="/products">
                                Explore collection <span aria-hidden="true">→</span>
                            </Link>
                        </MagneticButton>
                        <MagneticButton
                            strength={0.2}
                            className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
                        >
                            <Link to="/products?category=electronics">Shop tech</Link>
                        </MagneticButton>
                    </div>

                    <form onSubmit={handleSearch} className="hero-piece relative max-w-md">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <FiSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="block w-full rounded-xl border border-white/20 bg-white/10 py-3.5 pl-11 pr-4 text-white placeholder:text-gray-400 focus:border-primary-400 focus:bg-white/20 focus:outline-none focus:ring-1 focus:ring-primary-400 backdrop-blur sm:text-sm"
                            />
                            <button type="submit" className="absolute inset-y-1.5 right-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500 transition shadow-sm">
                                Search
                            </button>
                        </div>
                    </form>
                </div>
                <Parallax speed={0.3} className="hero-piece relative mx-auto w-full max-w-md">
                    <div className="absolute -inset-6 rounded-[2rem] bg-primary-500/20 blur-2xl" />
                    <Link to={featuredProduct ? `/product/${featuredProduct.id}` : '#'} className="relative block rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl group hover:border-white/30 transition">
                        <img 
                            src={featuredProduct?.image || "/products/headphones.svg"} 
                            alt={featuredProduct?.title || "Featured wireless headphones"} 
                            className="w-full h-72 object-contain bg-white rounded-2xl p-4 transition-transform group-hover:scale-105" 
                            onError={(e) => {
                                e.currentTarget.onerror = null
                                e.currentTarget.src = '/products/placeholder.svg'
                            }}
                        />
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex-1 mr-4">
                                <p className="text-sm text-slate-300">Featured pick</p>
                                <p className="font-bold line-clamp-1">{featuredProduct?.title || "Pulse Wireless Headphones"}</p>
                            </div>
                            <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-sm font-bold text-emerald-200 shrink-0">
                                ${featuredProduct?.price.toFixed(2) || "89.00"}
                            </span>
                        </div>
                    </Link>
                </Parallax>
            </div>
        </section>
    )
}

export default Hero

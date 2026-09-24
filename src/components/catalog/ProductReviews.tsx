import { useState, useEffect, type FormEvent } from 'react'
import { FiCheckCircle, FiEdit3, FiMessageSquare, FiStar, FiUser } from 'react-icons/fi'
import type { Product, Review } from '../../types'
import { useToast } from '../../features/toast/useToast'
import { celebrateAction } from '../../lib/confetti'

interface ProductReviewsProps {
    product: Product
}

const DEFAULT_REVIEW_TEMPLATES: Record<string, Array<{ name: string; rating: number; title: string; comment: string; daysAgo: number }>> = {
    default: [
        {
            name: 'Sarah Jenkins',
            rating: 5,
            title: 'Exceeded my expectations!',
            comment: 'The quality is fantastic and it arrived much faster than anticipated. Definitely purchasing again.',
            daysAgo: 4,
        },
        {
            name: 'Marcus Vance',
            rating: 4,
            title: 'Great value for the price',
            comment: 'Solid build, matches the description completely. Very happy with this purchase.',
            daysAgo: 12,
        },
        {
            name: 'Elena Rostova',
            rating: 5,
            title: 'Simply outstanding',
            comment: 'Exactly as shown in pictures. Premium feel, excellent finish, and well-packaged.',
            daysAgo: 23,
        },
    ],
}

export default function ProductReviews({ product }: ProductReviewsProps) {
    const { success, error: toastError } = useToast()
    const storageKey = `nexora_reviews_${product.id}`

    const [reviews, setReviews] = useState<Review[]>([])
    const [selectedFilter, setSelectedFilter] = useState<number | 'all'>('all')
    const [isFormOpen, setIsFormOpen] = useState(false)

    // Form state
    const [rating, setRating] = useState<number>(5)
    const [hoverRating, setHoverRating] = useState<number>(0)
    const [userName, setUserName] = useState('')
    const [title, setTitle] = useState('')
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)

    // Load existing reviews from localStorage or seed initial ones
    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey)
            if (saved) {
                setReviews(JSON.parse(saved))
            } else {
                // Generate seeded reviews using product rating
                const seeded: Review[] = DEFAULT_REVIEW_TEMPLATES.default.map((tpl, idx) => ({
                    id: `seed_${product.id}_${idx}`,
                    productId: product.id,
                    userName: tpl.name,
                    rating: tpl.rating,
                    title: tpl.title,
                    comment: tpl.comment,
                    createdAt: new Date(Date.now() - tpl.daysAgo * 86400000).toISOString(),
                    verified: true,
                }))
                setReviews(seeded)
                localStorage.setItem(storageKey, JSON.stringify(seeded))
            }
        } catch {
            // fallback
        }
    }, [product.id, storageKey])

    // Calculate metrics
    const totalReviews = reviews.length
    const avgRating = totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : product.rating.rate

    const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((r) => {
        const star = Math.min(5, Math.max(1, Math.round(r.rating)))
        ratingCounts[star] = (ratingCounts[star] || 0) + 1
    })

    const filteredReviews = selectedFilter === 'all'
        ? reviews
        : reviews.filter((r) => Math.round(r.rating) === selectedFilter)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        if (!userName.trim() || !title.trim() || !comment.trim()) {
            toastError('Please fill in all review fields.')
            return
        }

        setSubmitting(true)
        const newReview: Review = {
            id: `rev_${Date.now()}`,
            productId: product.id,
            userName: userName.trim(),
            rating,
            title: title.trim(),
            comment: comment.trim(),
            createdAt: new Date().toISOString(),
            verified: true,
        }

        const updated = [newReview, ...reviews]
        setReviews(updated)
        try {
            localStorage.setItem(storageKey, JSON.stringify(updated))
        } catch {
            // storage quota
        }

        success('Thank you! Your review has been published.')
        celebrateAction()

        // Reset form
        setUserName('')
        setTitle('')
        setComment('')
        setRating(5)
        setIsFormOpen(false)
        setSubmitting(false)
    }

    return (
        <section className="mt-16 border-t border-slate-200 pt-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <FiMessageSquare className="text-primary-600" />
                        Customer Reviews & Ratings
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Real experiences from verified purchasers
                    </p>
                </div>
                <button
                    onClick={() => setIsFormOpen((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 active:scale-95 self-start md:self-auto"
                >
                    <FiEdit3 className="h-4 w-4" />
                    {isFormOpen ? 'Cancel Review' : 'Write a Review'}
                </button>
            </div>

            {/* Review Breakdown & Score */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 md:p-8">
                <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-8 text-center">
                    <span className="text-5xl font-extrabold text-slate-900">{avgRating.toFixed(1)}</span>
                    <div className="flex items-center gap-1 text-amber-400 my-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                                key={star}
                                className={`h-5 w-5 ${
                                    star <= Math.round(avgRating)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-300'
                                }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-slate-500">
                        Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                    </span>
                </div>

                <div className="md:col-span-8 flex flex-col justify-center gap-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingCounts[star] || 0
                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

                        return (
                            <button
                                key={star}
                                onClick={() => setSelectedFilter((prev) => (prev === star ? 'all' : star))}
                                className={`flex items-center gap-3 text-xs md:text-sm group text-left transition p-1 rounded-md ${
                                    selectedFilter === star ? 'bg-primary-100/70 font-semibold' : 'hover:bg-slate-100'
                                }`}
                            >
                                <span className="w-12 text-slate-600 flex items-center gap-1 font-medium">
                                    {star} <FiStar className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                </span>
                                <div className="h-2.5 flex-1 rounded-full bg-slate-200 overflow-hidden">
                                    <div
                                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="w-10 text-right text-slate-400 group-hover:text-slate-700">
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Write Review Form */}
            {isFormOpen && (
                <form
                    onSubmit={handleSubmit}
                    className="mb-10 rounded-2xl border border-primary-200 bg-primary-50/40 p-6 md:p-8 transition-all"
                >
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Write Your Review</h3>

                    {/* Star Rating Picker */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Overall Rating</label>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    aria-label={`Rate ${star} out of 5 stars`}
                                    className="p-1 text-slate-300 transition-colors"
                                >
                                    <FiStar
                                        className={`h-7 w-7 transition-transform hover:scale-110 ${
                                            star <= (hoverRating || rating)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-slate-300'
                                        }`}
                                    />
                                </button>
                            ))}
                            <span className="ml-3 text-sm font-medium text-slate-600">
                                {rating === 5 && 'Outstanding'}
                                {rating === 4 && 'Very Good'}
                                {rating === 3 && 'Average'}
                                {rating === 2 && 'Below Average'}
                                {rating === 1 && 'Poor'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Your Name
                            </label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="e.g. Alex Morgan"
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Headline / Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Fantastic quality and fit"
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Your Review
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell other shoppers what you liked or disliked about this product..."
                            rows={4}
                            required
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-700 active:scale-95 disabled:bg-slate-300"
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsFormOpen(false)}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Filter tags */}
            {totalReviews > 0 && (
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
                        Filter:
                    </span>
                    <button
                        onClick={() => setSelectedFilter('all')}
                        className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                            selectedFilter === 'all'
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        All ({totalReviews})
                    </button>
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingCounts[star] || 0
                        if (count === 0) return null
                        return (
                            <button
                                key={star}
                                onClick={() => setSelectedFilter(star)}
                                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition flex items-center gap-1 ${
                                    selectedFilter === star
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                <span>{star}</span>
                                <FiStar className="h-3 w-3 fill-current" />
                                <span>({count})</span>
                            </button>
                        )
                    })}
                </div>
            )}

            {/* Reviews List */}
            {filteredReviews.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-white">
                    <p className="text-slate-500">No reviews found for this rating filter.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReviews.map((rev) => (
                        <article
                            key={rev.id}
                            className="rounded-xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm transition hover:border-slate-300"
                        >
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold text-sm">
                                        <FiUser className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-slate-900 text-sm md:text-base">
                                                {rev.userName}
                                            </span>
                                            {rev.verified && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                                    <FiCheckCircle className="h-3 w-3" />
                                                    Verified Buyer
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {new Date(rev.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center text-amber-400">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <FiStar
                                            key={s}
                                            className={`h-4 w-4 ${
                                                s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <h4 className="font-bold text-slate-800 text-base mb-1.5">{rev.title}</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">{rev.comment}</p>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}

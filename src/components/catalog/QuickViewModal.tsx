import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { FiCheck, FiMinus, FiPlus, FiShoppingBag, FiStar, FiX } from 'react-icons/fi'
import { useCart } from '../../features/cart/useCart'
import { openCartDrawer } from '../../hooks/useCartDrawer'
import WishlistButton from '../common/WishlistButton'
import type { Product } from '../../types'

type QuickViewModalProps = {
    product: Product
    isOpen: boolean
    onClose: () => void
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const { addToCart } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [addStatus, setAddStatus] = useState<'idle' | 'added'>('idle')

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        if (isOpen && !dialog.open) {
            dialog.showModal()
        } else if (!isOpen && dialog.open) {
            dialog.close()
        }
    }, [isOpen])

    const handleClose = () => {
        setQuantity(1)
        setAddStatus('idle')
        onClose()
    }

    const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
        const dialog = dialogRef.current
        if (!dialog) return
        const rect = dialog.getBoundingClientRect()
        const isClickInDialog = (
            rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX && e.clientX <= rect.left + rect.width
        )
        if (!isClickInDialog) {
            handleClose()
        }
    }

    const handleAddToCart = async () => {
        try {
            await addToCart(product.id, quantity)
            setAddStatus('added')
            setTimeout(() => {
                setAddStatus('idle')
                handleClose()
                openCartDrawer()
            }, 600)
        } catch {
            // Error is handled by context toast
        }
    }

    const stock = product.stock ?? 0
    const isOutOfStock = stock <= 0

    return (
        <dialog
            ref={dialogRef}
            onClose={handleClose}
            onClick={handleBackdropClick}
            aria-labelledby="quick-view-title"
            className="backdrop:bg-black/50 backdrop:backdrop-blur-sm p-0 rounded-2xl shadow-2xl m-auto w-[90vw] max-w-4xl bg-white outline-none open:animate-in open:fade-in-0 open:zoom-in-95"
        >
            <div className="relative flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full text-gray-500 hover:text-gray-900 transition shadow-sm"
                    aria-label="Close dialog"
                >
                    <FiX className="w-5 h-5" />
                </button>

                <div className="md:w-1/2 bg-slate-50 p-8 flex items-center justify-center min-h-[300px]">
                    <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                        className="max-h-[400px] w-full object-contain"
                    />
                </div>

                <div className="md:w-1/2 p-8 flex flex-col">
                    <div className="mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                            {product.category}
                        </span>
                    </div>

                    <h2 id="quick-view-title" className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h2>
                    
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-amber-400">
                            <FiStar className="fill-current w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm">{product.rating.rate}</span>
                        <span className="text-gray-400 text-sm">({product.rating.count} reviews)</span>
                    </div>

                    <p className="text-3xl font-bold text-gray-900 mb-6">${product.price.toFixed(2)}</p>
                    
                    <p className="text-gray-600 text-sm mb-8 line-clamp-3 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="mt-auto space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-700">Quantity</span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
                                >
                                    <FiMinus />
                                </button>
                                <span className="w-10 text-center font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                                    disabled={isOutOfStock || quantity >= stock}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
                                >
                                    <FiPlus />
                                </button>
                            </div>
                            <span className="text-sm text-gray-500">
                                {isOutOfStock ? 'Out of stock' : `${stock} available`}
                            </span>
                        </div>

                        <div className="flex gap-3 items-center">
                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock || addStatus === 'added'}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-white transition ${
                                    addStatus === 'added' ? 'bg-green-600' :
                                    isOutOfStock ? 'bg-gray-300' : 'bg-primary-600 hover:bg-primary-700 active:scale-95'
                                }`}
                            >
                                {addStatus === 'added' ? <><FiCheck /> Added</> : <><FiShoppingBag /> Add to Cart</>}
                            </button>
                            <WishlistButton product={product} size="lg" />
                            <Link
                                to={`/product/${product.id}`}
                                className="flex items-center justify-center px-4 py-3 rounded-lg border border-gray-300 font-bold text-gray-700 hover:bg-gray-50 transition"
                            >
                                Details
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    )
}

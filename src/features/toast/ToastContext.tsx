import { useState, useCallback, type ReactNode } from 'react'
import type { Toast } from '../../types'
import { ToastContext } from './toastContextValue'

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts((prev) => [...prev, { ...toast, id }])

        setTimeout(() => {
            removeToast(id)
        }, 4000)
    }, [removeToast])

    const success = useCallback((message: string, action?: Toast['action']) => addToast({ type: 'success', message, action }), [addToast])
    const error = useCallback((message: string, action?: Toast['action']) => addToast({ type: 'error', message, action }), [addToast])
    const info = useCallback((message: string, action?: Toast['action']) => addToast({ type: 'info', message, action }), [addToast])
    const warning = useCallback((message: string, action?: Toast['action']) => addToast({ type: 'warning', message, action }), [addToast])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
            {children}
        </ToastContext.Provider>
    )
}

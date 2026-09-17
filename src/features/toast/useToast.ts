import { useContext } from 'react'
import { ToastContext } from './toastContextValue'

export function useToast() {
    const context = useContext(ToastContext)
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

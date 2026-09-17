import { FiCheck, FiInfo, FiX, FiAlertTriangle } from 'react-icons/fi'
import { useToast } from '../../features/toast/useToast'

export default function ToastContainer() {
    const { toasts, removeToast } = useToast()

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => {
                const isSuccess = toast.type === 'success'
                const isError = toast.type === 'error'
                const isWarning = toast.type === 'warning'
                const isInfo = toast.type === 'info'

                return (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white toast-slide-in ${
                            isSuccess ? 'bg-green-600' :
                            isError ? 'bg-red-600' :
                            isWarning ? 'bg-yellow-600' :
                            'bg-primary-600'
                        }`}
                    >
                        {isSuccess && <FiCheck className="w-5 h-5" />}
                        {isError && <FiX className="w-5 h-5" />}
                        {isWarning && <FiAlertTriangle className="w-5 h-5" />}
                        {isInfo && <FiInfo className="w-5 h-5" />}

                        <span className="text-sm font-medium">{toast.message}</span>

                        {toast.action && (
                            <button
                                onClick={toast.action.onClick}
                                className="ml-2 text-sm underline hover:text-gray-200"
                            >
                                {toast.action.label}
                            </button>
                        )}

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-auto text-white/80 hover:text-white"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                )
            })}
        </div>
    )
}

import { toast } from 'sonner'

export const showSuccessToast = (message: string, duration = 4000) => {
    toast.success(message, {
        className: 'bg-green-50 border border-green-600 text-green-800',
        duration,
    })
}

export const showWarningToast = (message: string, duration = 4000) => {
    toast.warning(message, {
        className: 'bg-yellow-50 border border-yellow-600 text-yellow-800',
        duration,
    })
}

export const showErrorToast = (message: string, duration = 5000) => {
    toast.error(message, {
        className: 'bg-red-50 border border-red-600 text-red-800',
        duration,
    })
}

export const actionToast = {
    success: showSuccessToast,
    warning: showWarningToast,
    error: showErrorToast,
}

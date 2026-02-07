import { toast } from 'sonner'

export const showCustomerSuccessToast = (message: string) => {
    toast.success(message, {
        className: 'bg-green-50 border border-green-600 text-green-800',
        duration: 4000,
    })
}

export const showCustomerWarningToast = (message: string) => {
    toast.warning(message, {
        className: 'bg-yellow-50 border border-yellow-600 text-yellow-800',
        duration: 4000,
    })
}

export const showCustomerErrorToast = (message: string) => {
    toast.error(message, {
        className: 'bg-red-50 border border-red-600 text-red-800',
        duration: 5000,
    })
}

export const customerToast = {
    success: showCustomerSuccessToast,
    warning: showCustomerWarningToast,
    error: showCustomerErrorToast,
}
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
    id: number
    message: string
    type: ToastType
    duration?: number
}

const toasts = ref<Toast[]>([])
let counter = 0

export const useToast = () => {
    const addToast = (message: string, type: ToastType = 'info', duration = 5000) => {
        const id = counter++
        toasts.value.push({ id, message, type, duration })

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }
    }

    const removeToast = (id: number) => {
        const index = toasts.value.findIndex(t => t.id === id)
        if (index !== -1) {
            toasts.value.splice(index, 1)
        }
    }

    return {
        toasts,
        success: (msg: string, duration?: number) => addToast(msg, 'success', duration),
        error: (msg: string, duration?: number) => addToast(msg, 'error', duration),
        warning: (msg: string, duration?: number) => addToast(msg, 'warning', duration),
        info: (msg: string, duration?: number) => addToast(msg, 'info', duration),
        removeToast
    }
}

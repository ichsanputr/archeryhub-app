// Toast notification composable
// useState is Nuxt's built-in (auto-imported), readonly from Vue
import { readonly } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastConfig {
  message: string
  type?: ToastType
  duration?: number
  action?: unknown
}

export interface Toast {
  id: number
  message: string
  type: ToastType
  duration: number
  action?: unknown
}

export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => [])

  const addToast = (
    messageOrConfig: string | ToastConfig,
    type: ToastType = 'info',
    duration = 5000
  ): number => {
    const id = Date.now()

    let toast: Toast
    if (typeof messageOrConfig === 'string') {
      toast = {
        id,
        message: messageOrConfig,
        type,
        duration
      }
    } else {
      toast = {
        id,
        message: messageOrConfig.message,
        type: messageOrConfig.type ?? type,
        duration: messageOrConfig.duration ?? duration,
        action: messageOrConfig.action
      }
    }

    toasts.value.push(toast)

    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration)
    }

    return id
  }

  const removeToast = (id: number): void => {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string, duration?: number): number =>
    addToast(message, 'success', duration)
  const error = (message: string, duration?: number): number =>
    addToast(message, 'error', duration)
  const warning = (message: string, duration?: number): number =>
    addToast(message, 'warning', duration)
  const info = (message: string, duration?: number): number =>
    addToast(message, 'info', duration)

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}

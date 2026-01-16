// Toast notification composable
export const useToast = () => {
  const toasts = useState('toasts', () => [])

  const addToast = (messageOrConfig, type = 'info', duration = 5000) => {
    const id = Date.now()
    
    // Handle both string message and config object
    let toast
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
        type: messageOrConfig.type || type,
        duration: messageOrConfig.duration || duration,
        action: messageOrConfig.action
      }
    }
    
    toasts.value.push(toast)
    
    // Auto remove toast after duration
    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration)
    }
    
    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message, duration) => addToast(message, 'success', duration)
  const error = (message, duration) => addToast(message, 'error', duration)
  const warning = (message, duration) => addToast(message, 'warning', duration)
  const info = (message, duration) => addToast(message, 'info', duration)

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

// Login prompt composable
import { useToast } from './useToast'

export const useLoginPrompt = () => {
  const { addToast } = useToast()

  const showLoginPrompt = (
    message = 'Please login to continue',
    duration = 5000
  ): number => {
    const toastId = addToast({
      message,
      type: 'warning',
      duration
    })
    return toastId
  }

  const showSaveLoginPrompt = (): number => {
    return showLoginPrompt('Please login to save problem', 5000)
  }

  return {
    showLoginPrompt,
    showSaveLoginPrompt
  }
}

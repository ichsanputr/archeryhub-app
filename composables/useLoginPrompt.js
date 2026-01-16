// Login prompt composable
import { useToast } from './useToast.js'

export const useLoginPrompt = () => {
    const { addToast } = useToast()

    const showLoginPrompt = (message = 'Please login to continue', duration = 5000) => {
        const toastId = addToast({
            message,
            type: 'warning',
            duration
        })

        return toastId
    }

    const showSaveLoginPrompt = () => {
        return showLoginPrompt('Please login to save problem', 5000)
    }

    return {
        showLoginPrompt,
        showSaveLoginPrompt
    }
}

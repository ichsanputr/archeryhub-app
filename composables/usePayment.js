export const usePayment = () => {
    const config = useRuntimeConfig()
    const apiBaseUrl = config.public.apiBaseUrl
    const auth = useAuth()

    const getChannels = async () => {
        try {
            const data = await $fetch(`${apiBaseUrl}/payment/channels`)
            return data
        } catch (error) {
            console.error('Failed to fetch payment channels:', error)
            return []
        }
    }

    const registerTournament = async (tournamentId, payload) => {
        try {
            const data = await $fetch(`${apiBaseUrl}/tournaments/${tournamentId}/register`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth.token.value}`
                },
                body: payload
            })
            return data
        } catch (error) {
            console.error('Failed to register for tournament:', error)
            throw error
        }
    }

    const createTransaction = async (payload) => {
        try {
            const data = await $fetch(`${apiBaseUrl}/payment/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth.token.value}`
                },
                body: payload
            })
            return data
        } catch (error) {
            console.error('Failed to create payment transaction:', error)
            throw error
        }
    }

    const getPaymentStatus = async (reference) => {
        try {
            const data = await $fetch(`${apiBaseUrl}/payment/status/${reference}`)
            return data
        } catch (error) {
            console.error('Failed to get payment status:', error)
            throw error
        }
    }

    return {
        getChannels,
        registerTournament,
        createTransaction,
        getPaymentStatus
    }
}

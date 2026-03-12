export interface PaymentChannel {
  [key: string]: unknown
}

export interface RegisterPayload {
  [key: string]: unknown
}

export interface CreateTransactionPayload {
  [key: string]: unknown
}

export const usePayment = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl as string

  const getChannels = async (): Promise<PaymentChannel[]> => {
    try {
      const data = await $fetch<PaymentChannel[]>(`${apiBaseUrl}/payment/channels`)
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Failed to fetch payment channels:', error)
      return []
    }
  }

  const registerTournament = async (
    tournamentId: string,
    payload: RegisterPayload
  ): Promise<unknown> => {
    try {
      const data = await $fetch(`${apiBaseUrl}/events/${tournamentId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        credentials: 'include'
      })
      return data
    } catch (error) {
      console.error('Failed to register for tournament:', error)
      throw error
    }
  }

  const createTransaction = async (
    payload: CreateTransactionPayload
  ): Promise<unknown> => {
    try {
      const data = await $fetch(`${apiBaseUrl}/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        credentials: 'include'
      })
      return data
    } catch (error) {
      console.error('Failed to create payment transaction:', error)
      throw error
    }
  }

  const createParticipantPayment = async (
    participantId: string,
    method: string
  ): Promise<any> => {
    try {
      const data = await $fetch(`${apiBaseUrl}/events/participants/${participantId}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { method },
        credentials: 'include'
      })
      return data
    } catch (error) {
      console.error('Failed to create participant payment:', error)
      throw error
    }
  }

  const getPaymentStatus = async (reference: string): Promise<unknown> => {
    try {
      const data = await $fetch(`${apiBaseUrl}/payment/status/${reference}`)
      return data
    } catch (error) {
      console.error('Failed to get payment status:', error)
      throw error
    }
  }

  const simulateSuccess = async (reference: string): Promise<unknown> => {
    try {
      const data = await $fetch(`${apiBaseUrl}/payment/simulate-success/${reference}`)
      return data
    } catch (error) {
      console.error('Failed to simulate payment success:', error)
      throw error
    }
  }

  const getInstruction = async (code: string): Promise<any[]> => {
    try {
      const data = await $fetch<{ data: any[] }>(`${apiBaseUrl}/payment/instruction?code=${code}`)
      return data?.data ?? []
    } catch (error) {
      console.error('Failed to get payment instruction:', error)
      return []
    }
  }

  return {
    getChannels,
    registerTournament,
    createTransaction,
    createParticipantPayment,
    getPaymentStatus,
    simulateSuccess,
    getInstruction
  }
}

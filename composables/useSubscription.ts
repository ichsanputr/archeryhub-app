import { computed } from 'vue'
import { useState, useRuntimeConfig } from '#app'
import { useApi } from './useApi'

export interface SubscriptionData {
    current: {
        plan_id: number | null
        status: string
        plan_name: string | null
        plan_price: number | null
        billing_type: string | null
        next_billing_date: string | null
        usage: {
            label: string
            current: number
            limit: number
        }
    }
    plans: any[]
    invoices: any[]
}

export const useSubscription = () => {
    const subscriptionData = useState<SubscriptionData | null>('subscription.data', () => null)
    const isLoading = useState<boolean>('subscription.isLoading', () => false)
    const lastFetched = useState<number>('subscription.lastFetched', () => 0)

    const config = useRuntimeConfig()
    const api = useApi()

    const fetchSubscription = async (force = false) => {
        // Cache for 1 minute unless forced
        const now = Date.now()
        if (!force && subscriptionData.value && (now - lastFetched.value) < 60 * 1000) {
            return subscriptionData.value
        }

        try {
            isLoading.value = true
            const res = await api.get<SubscriptionData>('/user/subscription')
            subscriptionData.value = res
            lastFetched.value = now
            return res
        } catch (err) {
            console.error('Failed to fetch subscription:', err)
            return null
        } finally {
            isLoading.value = false
        }
    }

    const isSubscribed = computed(() => !!subscriptionData.value?.current?.plan_id)
    const activePlan = computed(() => subscriptionData.value?.current)
    const isSubscriptionActive = computed(() => {
        const { user } = useAuth()
        if (user.value?.role === 'root') return true

        const status = subscriptionData.value?.current?.status
        return status === 'active' || status === 'trial'
    })

    return {
        subscriptionData,
        isLoading,
        fetchSubscription,
        isSubscribed,
        isSubscriptionActive,
        activePlan
    }
}

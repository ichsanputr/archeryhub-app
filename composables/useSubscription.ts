import { computed } from 'vue'
import { useState, useRuntimeConfig } from '#app'
import { useApi } from './useApi'
import { useAuth } from './useAuth'

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
    quota_free?: number
    quota_standard?: number
    quota_elite?: number
    total_quota?: number
}

export const useSubscription = () => {
    const subscriptionData = useState<SubscriptionData | null>('subscription.data', () => null)
    const isLoading = useState<boolean>('subscription.isLoading', () => false)
    const lastFetched = useState<number>('subscription.lastFetched', () => 0)
    
    const quotaData = useState<{quota_free?: number, quota_standard: number, quota_elite: number, total_quota: number} | null>('subscription.quota', () => null)

    const config = useRuntimeConfig()
    const api = useApi()
    const { user } = useAuth()

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

    const fetchQuota = async () => {
        try {
            const res = await api.get<{quota_free: number, quota_standard: number, quota_elite: number, total_quota: number}>('/organizers/me/quota')
            quotaData.value = res
            return res
        } catch (err) {
            console.error('Failed to fetch quota:', err)
            return null
        }
    }

    const isSubscribed = computed(() => !!subscriptionData.value?.current?.plan_id)
    const activePlan = computed(() => subscriptionData.value?.current)

    const isSubscriptionActive = computed(() => {
        if (user.value?.role === 'root') return true
        const status = subscriptionData.value?.current?.status
        const hasQuota = (quotaData.value?.quota_free || 0) > 0 || (quotaData.value?.quota_standard || 0) > 0 || (quotaData.value?.quota_elite || 0) > 0
        return status === 'active' || status === 'trial' || hasQuota
    })

    const hasFreeQuota = computed(() => (quotaData.value?.quota_free || 0) > 0)
    const hasStandardQuota = computed(() => (quotaData.value?.quota_standard || 0) > 0)
    const hasEliteQuota = computed(() => (quotaData.value?.quota_elite || 0) > 0)

    const isElite = computed(() => {
        if (user.value?.role === 'root') return true
        return activePlan.value?.plan_name?.toLowerCase().includes('elite') || false
    })

    // Feature Gates
    const canCreateEvent = computed(() => {
        if (user.value?.role === 'root') return true
        return isSubscriptionActive.value || (quotaData.value?.total_quota || 0) > 0
    })

    const canAddMember = computed(() => {
        if (user.value?.role === 'root') return true
        if (!isSubscriptionActive.value) return false

        // Check limits for non-Elite
        if (!isElite.value) {
            const current = subscriptionData.value?.current?.usage?.current || 0
            const limit = 50 // Standard limit
            return current < limit
        }
        return true
    })

    const canExportData = computed(() => {
        if (user.value?.role === 'root') return true
        return isSubscriptionActive.value
    })

    const canAccessAnalytics = computed(() => {
        if (user.value?.role === 'root') return true
        // Advanced analytics are for Active Elite or Active Standard (base)
        // according to policy, Standard has basic, Elite has advanced.
        return isSubscriptionActive.value
    })

    return {
        subscriptionData,
        quotaData,
        isLoading,
        fetchSubscription,
        fetchQuota,
        isSubscribed,
        isSubscriptionActive,
        hasStandardQuota,
        hasEliteQuota,
        isElite,
        canCreateEvent,
        canAddMember,
        canExportData,
        canAccessAnalytics,
        activePlan
    }
}

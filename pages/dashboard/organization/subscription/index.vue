<template>
    <div class="space-y-8">
        <!-- Success Alert -->
        <div v-if="showSuccessAlert" class="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-start gap-4 shadow-sm relative overflow-hidden">
            <div class="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                <Icon icon="ph:check-circle-bold" class="text-2xl" />
            </div>
            <div class="flex-1">
                <h4 class="text-lg font-black text-emerald-800 leading-none">{{ t('subscription.success.title', 'Pembayaran Berhasil!') }}</h4>
                <div class="text-xs font-semibold text-emerald-600 mt-2">{{ t('subscription.success.message', 'Langganan Anda telah berhasil diperbarui dan masa aktif telah diperpanjang. Terima kasih telah berlangganan!') }}</div>
            </div>
            <button @click="showSuccessAlert = false" class="size-8 rounded-xl hover:bg-emerald-100/50 flex items-center justify-center text-emerald-700 transition-colors shrink-0">
                <Icon icon="ph:x-bold" class="text-lg" />
            </button>
        </div>

        <!-- Header Section -->
        <SubscriptionHeader :status="headerStatus" />

        <!-- Status & Stats Section -->
        <SubscriptionStatus :plan-name="currentPlan?.name"
            :billing-cycle="currentPlan?.billing === 'atlet' ? 'per penggunaan' : 'bulanan'"
            :price-label="`${currentPlan?.priceLabel} / ${currentPlan?.billing}`"
            :next-billing="subscriptionRes?.current?.next_billing_date" :usage-media="usageMedia"
            :usage-members="usageMembers" :remaining-days-label="remainingDaysLabel" :expiry-percent="expiryPercent"
            :is-expired="headerStatus === 'expired' || headerStatus === 'canceled'" :show-members="true"
            :member-label="t('subscription.member_label', 'Peserta per Event')" />

        <div class="space-y-8">
            <!-- Organization Plans -->
            <SubscriptionOrganizationPlans :plans="availablePlans" :comparison-data="comparisonData" @select="handleSelectPlan" />

            <!-- Riwayat Tagihan Section -->
            <SubscriptionBillingHistory :invoices="invoices" />
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onBeforeMount, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuth } from '~/composables/useAuth'
import { useSubscription } from '~/composables/useSubscription'
import SubscriptionHeader from '~/components/dashboard/subscription/SubscriptionHeader.vue'
import SubscriptionStatus from '~/components/dashboard/subscription/SubscriptionStatus.vue'
import SubscriptionOrganizationPlans from '~/components/dashboard/subscription/SubscriptionOrganizationPlans.vue'
import SubscriptionBillingHistory from '~/components/dashboard/subscription/SubscriptionBillingHistory.vue'
import useDashboardI18n from '~/composables/useDashboardI18n'

definePageMeta({
    layout: 'dashboard'
})

const { user, organizationProfile } = useAuth()
const { t } = useDashboardI18n()
const { subscriptionData, fetchSubscription } = useSubscription()
const router = useRouter()
const route = useRoute()

const isUSD = computed(() => {
    return organizationProfile.value?.country !== 'Indonesia'
})

const apiBaseUrl = useApiBaseUrl()

// Fetch comparison features dynamically from backend
const { data: comparisonData } = await useFetch(`${apiBaseUrl}/public/subscription/comparison`, {
    key: 'dashboard-subscription-comparison',
    lazy: true,
    server: false
})
const userType = computed(() => user.value?.user_type || user.value?.role || 'organization')
const showSuccessAlert = ref(false)

onBeforeMount(async () => {
    await fetchSubscription()
})

const toast = useToast()

onMounted(() => {
    fetchSubscription(true)
    if (route.query.status === 'success') {
        showSuccessAlert.value = true
        router.replace({ path: route.path, query: {} })
    } else if (route.query.expired === 'true') {
        toast.error(t('subscription.expired_warning', 'Masa aktif paket langganan Anda telah berakhir. Silakan perbarui paket Anda untuk melanjutkan.'))
        router.replace({ path: route.path, query: {} })
    }
})

const subscriptionRes = computed(() => subscriptionData.value)
const headerStatus = computed(() => {
    const current = subscriptionRes.value?.current
    if (current?.status === 'trial' && !current?.next_billing_date) {
        return ''
    }
    return current?.status || ''
})

const handleSelectPlan = (plan) => {
    if (plan.isCurrent) return
    router.push({
        path: '/dashboard/organization/subscription/payment',
        query: {
            plan_id: plan.id,
            plan_name: plan.name,
            plan_price: plan.priceRaw
        }
    })
}



const orgPlanDetails = [
    {
        id: [3, 5],
        features: ['Maksimum 50 Peserta / Event', 'Manajemen Pendaftaran Online', 'Sistem Digital Scoring', 'Live Results (Public)', 'Penyimpanan Media 1 GB'],
    },
    {
        id: [4, 6],
        features: ['Maksimum Peserta Tak Terbatas', 'Manajemen Match Finals', 'Integrasi Pembayaran Otomatis', 'Analitik & Laporan Lanjutan', 'Penyimpanan Media 5 GB'],
    }
]

const isSubscribed = computed(() => !!subscriptionRes.value?.current?.plan_id)

const availablePlans = computed(() => {
    const plansFromApi = subscriptionRes.value?.plans || []
    const currentPlanId = subscriptionRes.value?.current?.plan_id
    const currentPlanDetails = orgPlanDetails
    const isUSDVal = isUSD.value

    const uniquePlans = []
    const seenNames = new Set()

    for (const plan of plansFromApi) {
        if (!seenNames.has(plan.name)) {
            uniquePlans.push(plan)
            seenNames.add(plan.name)
        } else if (plan.id === currentPlanId) {
            const existingIdx = uniquePlans.findIndex(p => p.name === plan.name)
            if (existingIdx !== -1) uniquePlans[existingIdx] = plan
        }
    }

    if (uniquePlans.length === 0) {
        return [
            { id: 3, name: 'Standar', priceLabel: isUSDVal ? '$2' : 'Rp 30.000', priceRaw: isUSDVal ? 2 : 30000, billing: 'bln', features: currentPlanDetails[0].features, isCurrent: false, isUpgrade: false },
            { id: 4, name: 'Elite', priceLabel: isUSDVal ? '$5' : 'Rp 80.000', priceRaw: isUSDVal ? 5 : 80000, billing: 'bln', features: currentPlanDetails[1].features, isCurrent: false, isUpgrade: true }
        ]
    }

    const sortedPlans = [...uniquePlans].sort((a, b) => {
        if (a.price !== b.price) return a.price - b.price
        return a.id - b.id
    })

    const fallbackPlanId = sortedPlans[0]?.id || null
    const effectiveCurrentPlanId = currentPlanId || fallbackPlanId

    return uniquePlans.map(plan => {
        const detail = currentPlanDetails.find(d => Array.isArray(d.id) ? d.id.includes(plan.id) : d.id === plan.id)

        let localizedName = plan.name
        if (plan.name.toLowerCase().includes('basic') || plan.name.toLowerCase().includes('standard') || plan.name.toLowerCase().includes('standar')) {
            localizedName = 'Standar'
        } else if (plan.name.toLowerCase().includes('elite') || plan.name.toLowerCase().includes('premium')) {
            localizedName = 'Elite'
        }

        let finalPrice = plan.price
        if (localizedName === 'Standar' || plan.name.toLowerCase().includes('basic')) {
            finalPrice = isUSDVal ? 2 : 30000
        } else if (localizedName === 'Elite' || plan.name.toLowerCase().includes('premium')) {
            finalPrice = isUSDVal ? 5 : 80000
        }

        return {
            id: plan.id,
            name: localizedName,
            priceLabel: finalPrice === 0 ? (isUSDVal ? 'Free' : 'Gratis') : (isUSDVal ? `$${finalPrice}` : `Rp ${new Intl.NumberFormat('id-ID').format(finalPrice)}`),
            priceRaw: finalPrice,
            billing: plan.type === 'yearly' ? 'thn' : 'bln',
            features: detail ? detail.features : (function () {
                if (!plan.features) return []
                if (Array.isArray(plan.features)) return plan.features
                try {
                    const parsed = JSON.parse(plan.features)
                    return Array.isArray(parsed) ? parsed : [parsed]
                } catch (e) {
                    // Fallback to splitting by comma if it's not JSON
                    return plan.features.split(',').map(f => f.trim())
                }
            })(),
            isCurrent: plan.id === effectiveCurrentPlanId && headerStatus.value !== 'expired' && headerStatus.value !== 'canceled',
            isUpgrade: effectiveCurrentPlanId ? plan.id > effectiveCurrentPlanId : false
        }
    })
})

const currentPlan = computed(() => {
    return availablePlans.value.find(p => p.isCurrent) || availablePlans.value[0] || null
})

const invoices = computed(() => subscriptionRes.value?.invoices || [])

const parseSubscriptionDate = (value) => {
    if (!value) return null

    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        const d = new Date(value)
        return Number.isNaN(d.getTime()) ? null : d
    }

    const parts = value.trim().split(/\s+/)
    if (parts.length < 3) {
        const fallback = new Date(value)
        return Number.isNaN(fallback.getTime()) ? null : fallback
    }

    const day = Number(parts[0])
    const monthRaw = parts[1].toLowerCase()
    const year = Number(parts[2])
    const monthMap = {
        jan: 0, januari: 0,
        feb: 1, februari: 1,
        mar: 2, maret: 2,
        apr: 3, april: 3,
        may: 4, mei: 4,
        jun: 5, juni: 5,
        jul: 6, juli: 6,
        aug: 7, agustus: 7,
        sep: 8, september: 8,
        oct: 9, oktober: 9,
        nov: 10, november: 10,
        dec: 11, desember: 11,
    }

    if (!Number.isFinite(day) || !Number.isFinite(year) || monthMap[monthRaw] === undefined) return null
    const parsed = new Date(year, monthMap[monthRaw], day, 23, 59, 59)
    return Number.isNaN(parsed.getTime()) ? null : parsed
}

const usageMedia = computed(() => {
    const rawUsage = subscriptionRes.value?.current?.media_usage
    const currentBytes = rawUsage?.current || 0
    // Dynamic limit based on plan name
    const limitBytes = currentPlan.value?.name === 'Elite' ? (5 * 1024 * 1024 * 1024) : (1 * 1024 * 1024 * 1024)

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 MB'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
        const i = Math.max(2, Math.floor(Math.log(bytes) / Math.log(k))) // Start at MB for consistency
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    return {
        current: formatSize(currentBytes),
        limit: formatSize(limitBytes),
        percent: parseFloat(((currentBytes / limitBytes) * 100).toFixed(1))
    }
})

const usageMembers = computed(() => {
    const isElite = currentPlan.value?.name === 'Elite'
    const limitCount = 50 // Standard limit updated to 50
    const limit = isElite ? 'Tak Terbatas' : limitCount
    const current = subscriptionRes.value?.current?.usage?.current || 0
    const percent = isElite ? 0 : Math.min((current / limitCount) * 100, 100)

    return {
        current,
        limit,
        percent
    }
})

const remainingDays = computed(() => {
    const nextBilling = subscriptionRes.value?.current?.next_billing_date
    const parsedDate = parseSubscriptionDate(nextBilling)
    if (!parsedDate) return null
    const diff = parsedDate.getTime() - new Date().getTime()
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0)
})

const remainingDaysLabel = computed(() => {
    if (remainingDays.value === null) {
        const status = (subscriptionRes.value?.current?.status || '').toLowerCase()
        return status === 'active' ? 'Aktif' : '-'
    }
    return `${remainingDays.value} Hari Tersisa`
})

const totalDays = computed(() => {
    const cur = subscriptionRes.value?.current
    if (cur?.status === 'trial') return 90
    if (cur?.billing_type === 'yearly') return 360
    return 30
})

const expiryPercent = computed(() => {
    if (remainingDays.value === null) {
        const status = (subscriptionRes.value?.current?.status || '').toLowerCase()
        return status === 'active' ? 100 : 0
    }
    return Math.min((remainingDays.value / totalDays.value) * 100, 100)
})

const roleContent = computed(() => {
    return {
        packageTitle: t('subscription.packageTitle', 'Event Optimizer'),
        promoBadge: t('subscription.promoBadge', 'Penyelenggara Baru'),
        promoTitle: t('subscription.promoTitle', 'Mulai Turnamen Anda Gratis 3 Bulan!'),
        promoDesc: t('subscription.promoDesc', 'Daftarkan organisasi Anda sekarang and dapatkan paket Standard secara gratis selama 3 bulan pertama.'),
        savings: t('subscription.savings', '104.997'),
        recommendationBadge: t('subscription.recommendationBadge', 'EO Profesional'),
        eliteDescription: t('subscription.eliteDescription', 'Solusi lengkap untuk turnamen skala besar dengan fitur kustom pendaftaran.')
    }
})

useSeoMeta({
    title: t('subscription.seo.title', 'Dashboard Berlangganan - Archeris.net'),
    description: t('subscription.seo.description', 'Kelola langganan, batas penggunaan, dan riwayat tagihan di dashboard Archeris.net.')
})
</script>

<style scoped>
.target-texture {
    background-image: radial-gradient(circle, transparent 20%, rgba(0, 0, 0, 0.03) 21%, rgba(0, 0, 0, 0.03) 39%, transparent 40%, transparent 59%, rgba(0, 0, 0, 0.03) 60%, rgba(0, 0, 0, 0.03) 79%, transparent 80%);
    background-size: 300px 300px;
    background-position: center;
}
</style>

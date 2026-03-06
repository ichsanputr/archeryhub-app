<template>
    <div class="space-y-8">
        <!-- Header Section -->
        <SubscriptionHeader :status="headerStatus" />

        <!-- Status & Stats Section -->
        <SubscriptionStatus :plan-name="currentPlan?.name"
            :billing-cycle="currentPlan?.billing === 'atlet' ? 'per penggunaan' : 'bulanan'"
            :price-label="`${currentPlan?.priceLabel} / ${currentPlan?.billing}`"
            :next-billing="subscriptionRes?.current?.next_billing_date" :usage-media="usageMedia"
            :usage-members="usageMembers" :remaining-days-label="remainingDaysLabel" :expiry-percent="expiryPercent"
            :is-expired="headerStatus === 'expired' || headerStatus === 'canceled'"
            :show-members="userType !== 'organization'" />

        <div class="space-y-8">
            <!-- Organization Plans -->
            <SubscriptionOrganizationPlans v-if="userType === 'organization'" :plans="availablePlans"
                @select="handleSelectPlan" />

            <!-- Club Plans -->
            <SubscriptionClubPlans v-else-if="userType === 'club'" :plans="availablePlans" @select="handleSelectPlan" />

            <!-- Riwayat Tagihan Section -->
            <SubscriptionBillingHistory :invoices="invoices" />
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useSubscription } from '~/composables/useSubscription'
import SubscriptionHeader from '~/components/dashboard/club/subscription/SubscriptionHeader.vue'
import SubscriptionStatus from '~/components/dashboard/club/subscription/SubscriptionStatus.vue'
import SubscriptionOrganizationPlans from '~/components/dashboard/club/subscription/SubscriptionOrganizationPlans.vue'
import SubscriptionClubPlans from '~/components/dashboard/club/subscription/SubscriptionClubPlans.vue'
import SubscriptionBillingHistory from '~/components/dashboard/club/subscription/SubscriptionBillingHistory.vue'

definePageMeta({
    layout: 'dashboard'
})

const { user } = useAuth()
const { subscriptionData, fetchSubscription } = useSubscription()
const router = useRouter()
const userType = computed(() => user.value?.user_type || user.value?.role || 'club')

onBeforeMount(async () => {
    await fetchSubscription()
})

onMounted(() => {
    fetchSubscription(true)
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
        path: '/dashboard/club/subscription/payment',
        query: {
            plan_id: plan.id,
            plan_name: plan.name,
            plan_price: plan.priceRaw
        }
    })
}

const clubPlanDetails = [
    {
        id: [3, 5],
        features: ['Maksimal 50 Anggota Klub', 'Manajemen Absensi & Check-in', 'Manajemen Prestasi & Medali', 'Publikasi Berita & Artikel', 'Penyimpanan Media 1 GB'],
    },
    {
        id: [4, 6],
        features: ['Anggota Tak Terbatas', 'Manajemen Tim & Official', 'Kustom Form Pendaftaran', 'Analitik & Statistik Lanjutan', 'Penyimpanan Media 3 GB'],
    }
]

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

const comparisonData = [
    { feature: 'Pendaftaran Online', basic: true, elite: true, icon: 'ph:clipboard-text-bold' },
    { feature: 'Sistem Digital Scoring', basic: true, elite: true, icon: 'ph:target-bold' },
    { feature: 'Manajemen Match Finals', basic: false, elite: true, icon: 'ph:trophy-bold' },
    { feature: 'Penyimpanan Media', basic: '1 GB', elite: '5 GB', icon: 'ph:hard-drives-bold' },
    { feature: 'Analitik Lanjutan', basic: false, elite: true, icon: 'ph:chart-bar-bold' },
    { feature: 'Integrasi Pembayaran', basic: false, elite: true, icon: 'ph:credit-card-bold' },
    { feature: 'Dukungan Prioritas', basic: true, elite: true, icon: 'ph:headset-bold' },
]

const isSubscribed = computed(() => !!subscriptionRes.value?.current?.plan_id)

const availablePlans = computed(() => {
    const plansFromApi = subscriptionRes.value?.plans || []
    const currentPlanId = subscriptionRes.value?.current?.plan_id
    const isOrg = userType.value === 'organization'
    const currentPlanDetails = isOrg ? orgPlanDetails : clubPlanDetails

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
            { id: 3, name: 'Standar', priceLabel: isOrg ? 'Rp 29.999' : 'Rp 24.999', priceRaw: isOrg ? 29999 : 24999, billing: 'bln', features: currentPlanDetails[0].features, isCurrent: false, isUpgrade: false },
            { id: 4, name: 'Elite', priceLabel: isOrg ? 'Rp 49.999' : 'Rp 39.999', priceRaw: isOrg ? 49999 : 39999, billing: 'bln', features: currentPlanDetails[1].features, isCurrent: false, isUpgrade: true }
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
        if (isOrg) {
            if (localizedName === 'Standar' || plan.name.toLowerCase().includes('basic')) {
                finalPrice = 29999
            } else if (localizedName === 'Elite' || plan.name.toLowerCase().includes('premium')) {
                finalPrice = 49999
            }
        } else if (userType.value === 'club') {
            if (localizedName === 'Standar' || plan.name.toLowerCase().includes('basic')) {
                finalPrice = 24999
            } else if (localizedName === 'Elite' || plan.name.toLowerCase().includes('premium')) {
                finalPrice = 39999
            }
        }

        return {
            id: plan.id,
            name: localizedName,
            priceLabel: finalPrice < 1000 ? 'Gratis' : `Rp ${new Intl.NumberFormat('id-ID').format(finalPrice)}`,
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
    const isOrg = userType.value === 'organization'
    return {
        packageTitle: isOrg ? 'Event Optimizer' : 'Klub',
        promoBadge: isOrg ? 'Penyelenggara Baru' : 'Klub Baru',
        promoTitle: isOrg ? 'Mulai Turnamen Anda Gratis 3 Bulan!' : 'Mulai Klub Anda Gratis 3 Bulan!',
        promoDesc: isOrg
            ? 'Daftarkan organisasi Anda sekarang and dapatkan paket Standard secara gratis selama 3 bulan pertama.'
            : 'Daftarkan klub Anda sekarang and dapatkan paket Standard secara gratis selama 3 bulan pertama.',
        savings: '104.997',
        recommendationBadge: isOrg ? 'EO Profesional' : 'Klub Utama',
        eliteDescription: isOrg
            ? 'Solusi lengkap untuk turnamen skala besar dengan fitur kustom pendaftaran.'
            : 'Dapatkan fitur eksklusif dan limit lebih besar untuk komunitas Anda.'
    }
})

useSeoMeta({
    title: 'Dashboard Berlangganan - Archeryhub.id',
    description: 'Kelola langganan, batas penggunaan, dan riwayat tagihan di dashboard Archeryhub.id.'
})
</script>

<style scoped>
.target-texture {
    background-image: radial-gradient(circle, transparent 20%, rgba(0, 0, 0, 0.03) 21%, rgba(0, 0, 0, 0.03) 39%, transparent 40%, transparent 59%, rgba(0, 0, 0, 0.03) 60%, rgba(0, 0, 0, 0.03) 79%, transparent 80%);
    background-size: 300px 300px;
    background-position: center;
}
</style>

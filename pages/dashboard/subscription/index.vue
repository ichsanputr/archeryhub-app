<template>
    <div class="space-y-8">
        <!-- Header Section -->
        <SubscriptionHeader :status="headerStatus" />


        <!-- Status & Stats Section -->
        <SubscriptionStatus :plan-name="currentPlan?.name"
            :billing-cycle="currentPlan?.billing === 'atlet' ? 'per penggunaan' : 'bulanan'"
            :price-label="`${currentPlan?.priceLabel} / ${currentPlan?.billing}`"
            :next-billing="subscriptionRes?.current?.next_billing_date" :usage-media="usageMedia"
            :usage-members="usageMembers" :remaining-days-label="remainingDaysLabel"
            :expiry-percent="expiryPercent" />

        <div class="space-y-8">
            <!-- Pilihan Paket Section -->
            <SubscriptionPlanSelection :package-title="roleContent.packageTitle"
                :recommendation-badge="roleContent.recommendationBadge"
                :elite-description="roleContent.eliteDescription" :plans="availablePlans" @select="handleSelectPlan" />

            <!-- Comparison Table Section -->
            <SubscriptionComparison :data="comparisonData" />

            <!-- Riwayat Tagihan Section -->
            <SubscriptionBillingHistory :invoices="invoices" />
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useSubscription } from '~/composables/useSubscription'
import SubscriptionHeader from '~/components/dashboard/subscription/SubscriptionHeader.vue'
import SubscriptionPromo from '~/components/dashboard/subscription/SubscriptionPromo.vue'
import SubscriptionStatus from '~/components/dashboard/subscription/SubscriptionStatus.vue'
import SubscriptionPlanSelection from '~/components/dashboard/subscription/SubscriptionPlanSelection.vue'
import SubscriptionComparison from '~/components/dashboard/subscription/SubscriptionComparison.vue'
import SubscriptionBillingHistory from '~/components/dashboard/subscription/SubscriptionBillingHistory.vue'

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
        path: '/dashboard/subscription/payment',
        query: {
            plan_id: plan.id,
            plan_name: plan.name,
            plan_price: plan.priceRaw
        }
    })
}

const planDetails = [
    {
        id: [3, 5],
        features: ['Akses Konten Eksklusif', 'Badge Pendukung Profil', 'Update Berita Prioritas', 'E-Certificate Pendukung'],
    },
    {
        id: [4, 6],
        features: ['Semua fitur Basic Support', 'Diskon Khusus Event Klub', 'Grup Komunitas Prioritas', 'Konsultasi Coach Bulanan', 'Akses Awal Fitur Baru'],
    }
]

const comparisonData = [
    { feature: 'Maksimum Anggota', basic: '50 Orang', elite: 'Tak Terbatas', icon: 'ph:users-three-bold' },
    { feature: 'Penyimpanan Media', basic: '1 GB', elite: 'Tak Terbatas', icon: 'ph:hard-drives-bold' },
    { feature: 'Sertifikat Kustom', basic: false, elite: true, icon: 'ph:certificate-bold' },
    { feature: 'Analitik Lanjutan', basic: false, elite: true, icon: 'ph:chart-bar-bold' },
    { feature: 'Dukungan Prioritas', basic: 'Email', elite: 'Prioritas 24/7', icon: 'ph:headset-bold' },
    { feature: 'Iklan/Promo Event', basic: false, elite: true, icon: 'ph:megaphone-bold' },
]

const isSubscribed = computed(() => !!subscriptionRes.value?.current?.plan_id)

const availablePlans = computed(() => {
    const plansFromApi = subscriptionRes.value?.plans || []
    const currentPlanId = subscriptionRes.value?.current?.plan_id

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
            { id: 3, name: 'Standar', priceLabel: 'Rp 34.999', priceRaw: 34999, billing: 'bln', features: planDetails[0].features, isCurrent: false, isUpgrade: false },
            { id: 4, name: 'Elite', priceLabel: 'Rp 79.999', priceRaw: 79999, billing: 'bln', features: planDetails[1].features, isCurrent: false, isUpgrade: true }
        ]
    }

    const sortedPlans = [...uniquePlans].sort((a, b) => {
        if (a.price !== b.price) return a.price - b.price
        return a.id - b.id
    })

    const fallbackPlanId = sortedPlans[0]?.id || null
    const effectiveCurrentPlanId = currentPlanId || fallbackPlanId

    return uniquePlans.map(plan => {
        const detail = planDetails.find(d => Array.isArray(d.id) ? d.id.includes(plan.id) : d.id === plan.id)

        let localizedName = plan.name
        if (plan.name.toLowerCase().includes('basic') || plan.name.toLowerCase().includes('standard')) {
            localizedName = 'Standar'
        } else if (plan.name.toLowerCase().includes('elite') || plan.name.toLowerCase().includes('premium')) {
            localizedName = 'Elite'
        }

        return {
            id: plan.id,
            name: localizedName,
            priceLabel: plan.price < 1000 ? 'Gratis' : `Rp ${new Intl.NumberFormat('id-ID').format(plan.price)}`,
            priceRaw: plan.price,
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
            isCurrent: plan.id === effectiveCurrentPlanId,
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

const usageMedia = computed(() => ({
    current: '256 MB',
    limit: currentPlan.value?.id === 2 ? 'Unlimited' : '1 GB',
    percent: 25
}))

const usageMembers = computed(() => ({
    current: subscriptionRes.value?.current?.usage?.current || 0,
    limit: currentPlan.value?.id === 2 ? 'Unlimited' : (subscriptionRes.value?.current?.usage?.limit || 50),
    percent: Math.min(((subscriptionRes.value?.current?.usage?.current || 0) / (subscriptionRes.value?.current?.usage?.limit || 50)) * 100, 100)
}))

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

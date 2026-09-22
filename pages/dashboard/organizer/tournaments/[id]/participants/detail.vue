<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useImageOrDefault } from '~/composables/useImageHelper'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'
import BaseButton from '~/components/common/BaseButton.vue'

definePageMeta({
    layout: 'dashboard'
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { get, put, post } = useApi()
const toast = useToast()

const eventId = computed(() => route.params.id)
const archerId = computed(() => route.query.archer_id || route.params.participantId || route.params.archer_id)

const isLoading = ref(true)
const showPremiumModal = ref(false)
const showProofModal = ref(false)
const selectedProofImage = ref(null)

const participant = ref(null)
const categories = ref([])

useHead({
    title: computed(() => `${t('participant.detail.title')} - Archeris Dashboard`)
})

const handleKeydown = (e) => {
    if (e.key === 'Escape' && showProofModal.value) {
        closeProofZoom()
    }
}

onMounted(async () => {
    window.addEventListener('keydown', handleKeydown)
    await fetchParticipantData()
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})

const fetchParticipantData = async () => {
    if (!archerId.value || !eventId.value) return
    isLoading.value = true
    try {
        const [partRes, catRes] = await Promise.all([
            get(`/tournaments/${eventId.value}/participants/${archerId.value}`),
            get(`/tournaments/${eventId.value}/categories`)
        ])
        participant.value = partRes?.data || partRes
        categories.value = catRes?.data || catRes || []
    } catch (err) {
        console.error('Failed to load participant detail:', err)
        toast.error(t('common.error_loading'))
    } finally {
        isLoading.value = false
    }
}

const enrolledCategories = computed(() => {
    if (!participant.value) return []
    const registeredIds = participant.value.category_ids || (participant.value.category_id ? [participant.value.category_id] : [])
    
    let list = []
    if (participant.value.categories && participant.value.categories.length > 0) {
        list = participant.value.categories
    } else {
        list = categories.value.filter(c => registeredIds.includes(c.id))
    }

    return list.map(c => {
        const amount = (c.payment_amount !== undefined && c.payment_amount !== null && c.payment_amount > 0)
            ? c.payment_amount
            : ((c.fee !== undefined && c.fee !== null && c.fee > 0) ? c.fee : (participant.value.payment_amount || 0))
        return {
            ...c,
            payment_amount: amount
        }
    })
})

const participantTransactions = computed(() => {
    if (!participant.value) return []
    if (participant.value.transactions && Array.isArray(participant.value.transactions) && participant.value.transactions.length > 0) {
        return participant.value.transactions
    }
    if (participant.value.transaction && typeof participant.value.transaction === 'object') {
        return [participant.value.transaction]
    }
    return []
})

const proofUrl = computed(() => {
    if (!participant.value) return null
    return participant.value.transaction?.proof_url ||
        participant.value.payment_proof_url ||
        (participant.value.payment_proof_urls && participant.value.payment_proof_urls[0]) ||
        null
})

const openProofZoom = (url) => {
    if (!url) return
    selectedProofImage.value = url
    showProofModal.value = true
}

const closeProofZoom = () => {
    showProofModal.value = false
    selectedProofImage.value = null
}

const isPaidStatus = (status) => {
    const s = (status || '').toLowerCase()
    return ['paid', 'lunas', 'registered', 'terdaftar', 'completed', 'success', 'settlement'].includes(s)
}

const isRefundStatus = (status) => {
    const s = (status || '').toLowerCase()
    return ['refund', 'refunded', 'dikembalikan'].includes(s)
}

const isCheckedIn = computed(() => {
    if (!participant.value) return false
    if (participant.value.last_reregistration_at) return true
    if (participant.value.reregistered) return true
    if (participant.value.is_reregistered) return true
    if (participant.value.checked_in) return true
    if (participant.value.categories && Array.isArray(participant.value.categories)) {
        return participant.value.categories.some(c => c.last_reregistration_at || c.reregistered || c.is_reregistered || c.checked_in)
    }
    return false
})

const checkinTimeFormatted = computed(() => {
    if (!participant.value) return null
    let timeVal = participant.value.last_reregistration_at
    if (!timeVal && participant.value.categories && Array.isArray(participant.value.categories)) {
        const found = participant.value.categories.find(c => c.last_reregistration_at)
        if (found) timeVal = found.last_reregistration_at
    }
    return timeVal ? formatDateTime(timeVal) : null
})

const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID').format(Number(val) || 0)
}

const formatDate = (d) => {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

const formatDateTime = (d) => {
    if (!d) return '-'
    const dateObj = new Date(d)
    if (isNaN(dateObj.getTime())) return '-'
    return dateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const getTrxMethodInfo = (trx) => {
    const method = (trx?.payment_method || trx?.method || '').toLowerCase()
    const channel = (trx?.payment_channel || trx?.channel || '').toUpperCase()

    if (method === 'cash_on_desk') {
        return {
            label: t('participant.detail.method_cash_on_desk'),
            icon: 'ph:money-bold',
            badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }
    }
    if (method === 'refund') {
        return {
            label: t('participant.detail.method_refund'),
            icon: 'ph:arrow-u-up-left-bold',
            badgeClass: 'bg-purple-50 text-purple-700 border-purple-200'
        }
    }
    if (method === 'cash') {
        return {
            label: t('participant.detail.method_cash'),
            icon: 'ph:money-bold',
            badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }
    }
    if (method === 'mayar') {
        return {
            label: channel ? `Mayar (${channel})` : 'Online Gateway (Mayar)',
            icon: 'ph:credit-card-bold',
            badgeClass: 'bg-blue-50 text-blue-700 border-blue-200'
        }
    }
    if (method === 'midtrans') {
        return {
            label: channel ? `Midtrans (${channel})` : 'Online Gateway (Midtrans)',
            icon: 'ph:credit-card-bold',
            badgeClass: 'bg-sky-50 text-sky-700 border-sky-200'
        }
    }
    if (method === 'qris') {
        return {
            label: 'QRIS Online',
            icon: 'ph:qr-code-bold',
            badgeClass: 'bg-rose-50 text-rose-700 border-rose-200'
        }
    }
    if (method === 'manual_transfer' || method === 'bank_transfer' || method === 'transfer' || method === 'manual') {
        return {
            label: t('participant.detail.manual_transfer'),
            icon: 'ph:bank-bold',
            badgeClass: 'bg-slate-100 text-slate-700 border-slate-200'
        }
    }
    return {
        label: method ? method.toUpperCase() : t('participant.detail.method_online'),
        icon: 'ph:credit-card-bold',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200'
    }
}

const getTrxStatusInfo = (status) => {
    const s = (status || '').toLowerCase()
    if (['paid', 'lunas', 'settlement', 'success', 'completed'].includes(s)) {
        return {
            label: t('participant.detail.status_paid'),
            badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            icon: 'ph:check-circle-bold'
        }
    }
    if (['awaiting_verification', 'review', 'in_review', 'verifying', 'review_panitia'].includes(s)) {
        return {
            label: t('payment_status.badge_awaiting_verification'),
            badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
            icon: 'ph:clock-bold'
        }
    }
    if (['pending', 'waiting', 'unpaid', 'belum_bayar'].includes(s)) {
        return {
            label: t('participant.detail.status_pending'),
            badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
            icon: 'ph:hourglass-bold'
        }
    }
    if (['refund', 'refunded', 'dikembalikan'].includes(s)) {
        return {
            label: t('participant.detail.status_refunded'),
            badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
            icon: 'ph:arrow-u-up-left-bold'
        }
    }
    return {
        label: t('payment_status.badge_failed'),
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        icon: 'ph:x-circle-bold'
    }
}

const participantStatusInfo = computed(() => {
    const s = (participant.value?.payment_status || participant.value?.status || '').toLowerCase()
    if (isPaidStatus(s)) {
        return {
            label: t('participant.detail.status_paid'),
            badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }
    }
    if (s === 'awaiting_verification' || (proofUrl.value && !isPaidStatus(s))) {
        return {
            label: t('payment_status.badge_awaiting_verification'),
            badgeClass: 'bg-amber-50 text-amber-800 border border-amber-200'
        }
    }
    if (['pending', 'waiting', 'unpaid', 'belum_bayar'].includes(s)) {
        return {
            label: t('participant.detail.status_pending'),
            badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200'
        }
    }
    return {
        label: t('payment_status.badge_failed'),
        badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200'
    }
})

const displayRegistrationSource = computed(() => {
    if (!participant.value) return '-'
    const src = (participant.value.registration_source || '').toLowerCase()
    if (src === 'invited') {
        return t('participant.detail.source_invited')
    }
    if (src === 'admin_created' || src === 'organizer_added') {
        return t('participant.detail.source_organizer_added')
    }
    if (src === 'self_register') {
        return t('participant.detail.source_self_register')
    }
    return src ? src.replace(/_/g, ' ') : t('participant.detail.source_self_register')
})

const displayPaymentMethod = computed(() => {
    if (!participant.value) return '-'
    const p = participant.value
    const method = (p.transaction?.payment_method || p.payment_method || '').toLowerCase()
    const channel = (p.transaction?.payment_channel || '').toLowerCase()

    if (method === 'cash_on_desk') {
        return t('participant.detail.method_cash_on_desk')
    }
    if (method === 'cash') {
        return t('participant.detail.method_cash')
    }
    if (method === 'mayar') {
        return channel ? `Online Gateway (Mayar - ${channel.toUpperCase()})` : 'Online Gateway (Mayar)'
    }
    if (method === 'midtrans') {
        return channel ? `Online Gateway (Midtrans - ${channel.toUpperCase()})` : 'Online Gateway (Midtrans)'
    }
    if (method === 'qris') {
        return 'QRIS Online'
    }
    if (method === 'manual_transfer' || method === 'bank_transfer' || method === 'manual' || proofUrl.value) {
        return t('participant.detail.manual_transfer')
    }
    if (method) {
        return method.toUpperCase()
    }

    return t('participant.detail.online_gateway')
})

const isAutomaticGateway = computed(() => {
    if (!participant.value) return false
    const p = participant.value
    const method = (p.transaction?.payment_method || p.payment_method || '').toLowerCase()
    const autoGateways = ['mayar', 'paypal', 'midtrans', 'stripe', 'xendit', 'tripay', 'qris_online', 'online', 'gateway']
    return autoGateways.some(g => method === g || method.startsWith(g) || method.includes(g))
})

const needsManualConfirmation = computed(() => {
    if (!participant.value) return false
    if (isPaidStatus(participant.value.payment_status || participant.value.status)) return false
    
    // Automatic gateways are verified automatically via webhook, no EO manual action needed
    if (isAutomaticGateway.value) return false

    const p = participant.value
    const method = (p.transaction?.payment_method || p.payment_method || '').toLowerCase()
    const source = (p.registration_source || '').toLowerCase()
    
    // Manual transfer, Cash on desk, Cash, or uploaded transfer proof
    if (['manual', 'manual_transfer', 'bank_transfer', 'transfer', 'cash', 'cash_on_desk', 'cash_on_venue', 'tunai'].includes(method)) return true
    if (proofUrl.value) return true
    if (source === 'admin_created' || source === 'organizer_added' || source === 'invited') return true

    return false
})
</script>

<template>
    <div class="flex flex-col gap-6 pb-16">
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

        <!-- Page Header (Standard Dashboard Navy Style) -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div class="flex items-center gap-4">
                        <div class="size-14 sm:size-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md shrink-0">
                            <Icon icon="ph:user-bold" class="text-white text-2xl sm:text-3xl" />
                        </div>
                        <div class="min-w-0">
                            <div class="flex items-center gap-2 text-xs sm:text-sm text-white/70 mb-1.5">
                                <NuxtLink :to="`/dashboard/organizer/tournaments/${eventId}/participants`" class="hover:text-white transition-colors">
                                    {{ t('dashboard.participants_list.title') }}
                                </NuxtLink>
                                <Icon icon="ph:caret-right-bold" class="text-xs" />
                                <span class="text-primary font-medium">{{ t('participant.detail.title') }}</span>
                            </div>
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white truncate">
                                {{ participant?.full_name || t('participant.detail.title') }}
                            </h1>
                            <div class="text-slate-300 text-sm sm:text-base mt-1">
                                {{ t('participant.detail.subtitle') }}
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
                        <BaseButton :to="`/dashboard/organizer/tournaments/${eventId}/participants`" variant="white" icon="ph:arrow-left-bold" class="h-11 sm:h-12 px-4 sm:px-6 text-sm sm:text-base font-bold shadow-md">
                            {{ t('dashboard.participants_list.title') }}
                        </BaseButton>
                        <BaseButton v-if="archerId" :to="`/dashboard/organizer/tournaments/${eventId}/participants/edit?archer_id=${archerId}`" variant="primary" icon="ph:pencil-simple-bold" class="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-black shadow-lg shadow-primary/20">
                            {{ t('participant.detail.edit_participant') }}
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <template v-if="isLoading">
            <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <div class="inline-block size-9 border-2 border-slate-300 border-t-slate-800 animate-spin rounded-full"></div>
                <div class="text-slate-600 mt-4 text-sm sm:text-base font-medium">{{ t('participant.detail.loading') }}</div>
            </div>
        </template>

        <!-- Unified Single White Card Layout -->
        <template v-else-if="participant">
            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
                    
                    <!-- Left 2 Columns: Athlete Profile, Categories & Transaction Ledger -->
                    <div class="lg:col-span-2 space-y-8">

                        <!-- Section 1: Profile & Identity -->
                        <div class="space-y-6">
                            <!-- Top Profile Info Header -->
                            <div class="flex items-center justify-between gap-6 pb-6 border-b border-slate-100">
                                <div class="flex items-center gap-4 sm:gap-5 min-w-0">
                                    <div class="size-16 sm:size-18 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-xs ring-4 ring-slate-50">
                                        <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)" class="w-full h-full object-cover">
                                    </div>
                                    <div class="space-y-1.5 min-w-0">
                                        <div class="flex items-center gap-2.5 flex-wrap">
                                            <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate leading-tight">{{ participant.full_name }}</h2>
                                            <span v-if="participant.athlete_code" class="text-xs font-mono font-bold bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-lg shadow-2xs">
                                                {{ participant.athlete_code }}
                                            </span>
                                        </div>
                                        <div class="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
                                            <span class="text-slate-700 font-semibold">{{ participant.club_name || t('participant.detail.independent') }}</span>
                                            <template v-if="participant.city">
                                                <span class="text-slate-300">•</span>
                                                <span>{{ participant.city }}</span>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Data Fields Grid -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                                <div>
                                    <span class="text-xs sm:text-sm text-slate-500 block mb-1 font-medium">{{ t('participant.detail.email_label') }}</span>
                                    <span class="text-sm sm:text-base text-slate-900 font-bold truncate block">{{ participant.email || '-' }}</span>
                                </div>
                                <div>
                                    <span class="text-xs sm:text-sm text-slate-500 block mb-1 font-medium">{{ t('participant.detail.phone_label') }}</span>
                                    <span class="text-sm sm:text-base text-slate-900 font-bold block">{{ participant.phone || '-' }}</span>
                                </div>
                                <div>
                                    <span class="text-xs sm:text-sm text-slate-500 block mb-1 font-medium">{{ t('participant.detail.gender_label') }}</span>
                                    <span class="text-sm sm:text-base text-slate-900 font-bold block">{{ participant.gender === 'male' ? t('participant.detail.gender_male') : (participant.gender === 'female' ? t('participant.detail.gender_female') : (participant.gender || '-')) }}</span>
                                </div>
                                <div>
                                    <span class="text-xs sm:text-sm text-slate-500 block mb-1 font-medium">{{ t('participant.detail.birth_date_label') }}</span>
                                    <span class="text-sm sm:text-base text-slate-900 font-bold block">{{ formatDate(participant.birth_date) }}</span>
                                </div>
                                <div>
                                    <span class="text-xs sm:text-sm text-slate-500 block mb-1 font-medium">{{ t('participant.detail.bow_division_label') }}</span>
                                    <span class="text-sm sm:text-base text-slate-900 font-bold block capitalize">{{ participant.bow_type || '-' }}</span>
                                </div>
                                <div>
                                    <span class="text-xs sm:text-sm text-slate-500 block mb-1 font-medium">{{ t('participant.detail.hand_dominance_label') }}</span>
                                    <span class="text-sm sm:text-base text-slate-900 font-bold block">{{ participant.hand_dominance === 'right' ? t('participant.detail.hand_right') : (participant.hand_dominance === 'left' ? t('participant.detail.hand_left') : (participant.hand_dominance || '-')) }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Section 2: Enrolled Tournament Categories -->
                        <div class="border-t border-slate-100 pt-8 space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                                    <Icon icon="ph:trophy-bold" class="text-slate-500 text-xl" />
                                    <span>{{ t('participant.detail.division_label') }}</span>
                                </h3>
                                <span class="text-xs sm:text-sm font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                                    {{ t('participant.detail.categories_count', { count: enrolledCategories.length }) }}
                                </span>
                            </div>

                            <div v-if="enrolledCategories.length > 0" class="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                                <div v-for="cat in enrolledCategories" :key="cat.id"
                                    class="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                    <div>
                                        <div class="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                                            {{ cat.category_name || cat.label || cat.name }}
                                        </div>
                                        <div class="text-xs sm:text-sm text-slate-500 mt-1">
                                            {{ cat.division_name || '' }} <span v-if="cat.division_name && (cat.event_type_name || cat.class_name)">•</span> {{ cat.event_type_name || cat.class_name || '' }}
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <span class="text-sm sm:text-base font-bold text-slate-900">
                                            Rp {{ formatCurrency(cat.payment_amount) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="py-10 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2.5">
                                <div class="size-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
                                    <Icon icon="ph:trophy-bold" class="text-2xl text-slate-400" />
                                </div>
                                <div class="space-y-0.5">
                                    <div class="text-xs sm:text-sm font-bold text-slate-700">
                                        {{ t('participant.detail.no_categories') }}
                                    </div>
                                    <div class="text-[11px] sm:text-xs text-slate-400">
                                        {{ t('participant.detail.no_categories_desc') }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Section 3: Transaction & Payment Ledger (Riwayat Transaksi Pembayaran) -->
                        <div class="border-t border-slate-100 pt-8 space-y-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                                        <Icon icon="ph:receipt-bold" class="text-slate-500 text-xl" />
                                        <span>{{ t('participant.detail.transactions_title') }}</span>
                                    </h3>
                                    <div class="text-xs sm:text-sm text-slate-500 mt-1">
                                        {{ t('participant.detail.transactions_subtitle') }}
                                    </div>
                                </div>
                                <span v-if="participantTransactions.length > 0" class="text-xs sm:text-sm font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-lg shrink-0">
                                    {{ t('participant.detail.transactions_count', { count: participantTransactions.length }, `${participantTransactions.length} Transaksi`) }}
                                </span>
                            </div>

                            <!-- Transactions List -->
                            <div v-if="participantTransactions.length > 0" class="space-y-3 pt-1">
                                <div v-for="(trx, idx) in participantTransactions" :key="trx.id || trx.uuid || idx"
                                    class="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-3">
                                    
                                    <!-- Top Row: Reference, Method & Status, Amount -->
                                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div class="flex flex-wrap items-center gap-2.5">
                                            <!-- Reference Tag -->
                                            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs sm:text-sm font-mono font-bold bg-white border border-slate-200 text-slate-800 shadow-2xs">
                                                <Icon icon="ph:hash-bold" class="text-slate-400 text-xs" />
                                                {{ trx.reference || trx.id || ('TRX-' + (idx + 1)) }}
                                            </span>

                                            <!-- Method Badge -->
                                            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs sm:text-sm font-bold border"
                                                :class="getTrxMethodInfo(trx).badgeClass">
                                                <Icon :icon="getTrxMethodInfo(trx).icon" class="text-sm" />
                                                <span>{{ getTrxMethodInfo(trx).label }}</span>
                                            </span>

                                            <!-- Status Badge -->
                                            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs sm:text-sm font-bold border"
                                                :class="getTrxStatusInfo(trx.status).badgeClass">
                                                <Icon :icon="getTrxStatusInfo(trx.status).icon" class="text-sm" />
                                                <span>{{ getTrxStatusInfo(trx.status).label }}</span>
                                            </span>
                                        </div>

                                        <!-- Amount -->
                                        <div class="text-left sm:text-right">
                                            <span class="text-base sm:text-lg font-black"
                                                :class="isRefundStatus(trx.status) || (trx.payment_method || '').toLowerCase() === 'refund' ? 'text-purple-700' : 'text-slate-900'">
                                                {{ isRefundStatus(trx.status) || (trx.payment_method || '').toLowerCase() === 'refund' ? '- ' : '+ ' }}Rp {{ formatCurrency(trx.amount || trx.total_amount || 0) }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Middle / Bottom Row: Time, Notes, Verifier & Proof -->
                                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-slate-200/70 text-xs sm:text-sm text-slate-600">
                                        <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
                                            <!-- Timestamp -->
                                            <span class="flex items-center gap-1.5 font-medium">
                                                <Icon icon="ph:calendar-blank-bold" class="text-slate-400" />
                                                {{ formatDateTime(trx.paid_at || trx.created_at) }}
                                            </span>

                                            <!-- Verifier info if available -->
                                            <span v-if="trx.verified_by" class="flex items-center gap-1.5 font-medium text-slate-700">
                                                <Icon icon="ph:user-check-bold" class="text-emerald-600" />
                                                <span>{{ t('participant.detail.verifier_label') }}: {{ trx.verified_by }}</span>
                                            </span>
                                        </div>

                                        <!-- Proof Button if available -->
                                        <div v-if="trx.proof_url" class="shrink-0">
                                            <button type="button" @click="openProofZoom(trx.proof_url)"
                                                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-navy bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-2xs cursor-pointer">
                                                <Icon icon="ph:image-bold" class="text-slate-500" />
                                                <span>{{ t('participant.detail.view_proof_btn') }}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Notes if present -->
                                    <div v-if="trx.rejection_reason || trx.notes || trx.description" class="pt-1 text-xs sm:text-sm text-slate-700 bg-white rounded-lg p-2.5 border border-slate-200/80">
                                        <span class="font-bold text-slate-900">{{ t('participant.detail.notes_label_short') }}:</span> {{ trx.rejection_reason || trx.notes || trx.description }}
                                    </div>
                                </div>
                            </div>

                            <!-- Empty State -->
                            <div v-else class="py-10 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2.5">
                                <div class="size-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
                                    <Icon icon="ph:receipt-bold" class="text-2xl text-slate-400" />
                                </div>
                                <div class="space-y-0.5">
                                    <div class="text-xs sm:text-sm font-bold text-slate-700">
                                        {{ t('participant.detail.no_transactions') }}
                                    </div>
                                    <div class="text-[11px] sm:text-xs text-slate-400">
                                        {{ t('participant.detail.no_transactions_desc') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Payment Summary & Match Status (Seamless inside parent white card) -->
                    <div class="lg:col-span-1 space-y-8 lg:border-l lg:border-slate-100 lg:pl-8 lg:pt-0">
                        
                        <!-- Section 1: Summary Payment -->
                        <div class="space-y-4">
                            <div class="border-b border-slate-100 pb-3.5">
                                <h3 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                                    <Icon icon="ph:credit-card-bold" class="text-slate-500 text-xl" />
                                    <span>{{ t('participant.detail.payment_title') }}</span>
                                </h3>
                            </div>

                            <div class="space-y-4 text-xs sm:text-sm">
                                <div class="flex items-center justify-between py-1">
                                    <span class="text-slate-500 font-medium">{{ t('participant.detail.payment_status_label') }}</span>
                                    <span class="font-bold text-xs sm:text-sm px-2.5 py-1 rounded-md border"
                                        :class="participantStatusInfo.badgeClass">
                                        {{ participantStatusInfo.label }}
                                    </span>
                                </div>
                                <div class="flex items-center justify-between py-1 border-t border-slate-50">
                                    <span class="text-slate-500 font-medium">{{ t('participant.detail.total_fee_label') }}</span>
                                    <span class="text-lg sm:text-xl font-black text-slate-900">
                                        Rp {{ formatCurrency(participant.payment_amount || participant.total_fee || 0) }}
                                    </span>
                                </div>
                                <div class="flex items-center justify-between py-1 border-t border-slate-50">
                                    <span class="text-slate-500 font-medium">{{ t('participant.detail.payment_method_label') }}</span>
                                    <span class="font-bold text-slate-800 text-right">
                                        {{ displayPaymentMethod }}
                                    </span>
                                </div>
                                <div v-if="participant.transaction?.reference || participant.payment_reference" class="flex items-center justify-between py-1 border-t border-slate-50">
                                    <span class="text-slate-500 font-medium">{{ t('participant.detail.invoice_ref_label') }}</span>
                                    <span class="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                                        {{ participant.transaction?.reference || participant.payment_reference }}
                                    </span>
                                </div>
                                <div v-if="participant.transaction?.registered_by_name || participant.transaction?.payer_name" class="flex items-start justify-between py-1 border-t border-slate-50 gap-2">
                                    <span class="text-slate-500 font-medium shrink-0">{{ t('participant.detail.payer_label') }}</span>
                                    <div class="text-right">
                                        <div class="font-bold text-slate-800">
                                            {{ participant.transaction?.registered_by_name || participant.transaction?.payer_name }}
                                        </div>
                                        <div v-if="participant.transaction?.registered_by_email" class="text-[11px] text-slate-500 font-normal">
                                            {{ participant.transaction.registered_by_email }}
                                        </div>
                                    </div>
                                </div>
                                <div v-if="participant.transaction?.delegation_count && participant.transaction.delegation_count > 1" class="flex items-center justify-between py-1 border-t border-slate-50">
                                    <span class="text-slate-500 font-medium">{{ t('participant.detail.registration_source_label') }}</span>
                                    <span class="inline-flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                                        <Icon icon="ph:users-three-bold" class="text-xs" />
                                        <span>{{ t('participant.detail.delegation_invoice_badge', { count: participant.transaction.delegation_count }) }}</span>
                                    </span>
                                </div>
                            </div>

                            <!-- Manual Payment Proof Thumbnail with Lightbox Zoom -->
                            <div v-if="proofUrl" class="pt-3 border-t border-slate-100 space-y-2.5">
                                <span class="text-xs sm:text-sm text-slate-500 font-medium block">{{ t('participant.detail.transfer_proof_label') }}</span>

                                <div @click="openProofZoom(proofUrl)"
                                    class="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer shadow-2xs hover:border-slate-400 transition-all">
                                    <img :src="proofUrl" :alt="t('participant.detail.transfer_proof_label')" class="h-44 w-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                                    <!-- Sleek Overlay on Image -->
                                    <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs sm:text-sm font-bold gap-1.5 backdrop-blur-[2px]">
                                        <div class="size-10 rounded-full bg-white/20 flex items-center justify-center text-white shadow-md">
                                            <Icon icon="ph:magnifying-glass-plus-bold" class="text-xl" />
                                        </div>
                                        <span>{{ t('participant.detail.view_fullscreen') }}</span>
                                    </div>
                                </div>
                                <div v-if="participant.transaction?.sender_name" class="text-xs sm:text-sm text-slate-600 space-y-1 pt-1 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                                    <div class="flex items-center justify-between">
                                        <span class="text-slate-500 font-medium">{{ t('participant.detail.sender_account_name') }}:</span>
                                        <span class="font-bold text-slate-900">{{ participant.transaction.sender_name }}</span>
                                    </div>
                                    <div v-if="participant.transaction?.amount" class="flex items-center justify-between">
                                        <span class="text-slate-500 font-medium">{{ t('participant.detail.amount_label') }}:</span>
                                        <span class="font-bold text-slate-900">Rp {{ formatCurrency(participant.transaction.amount) }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Informational Centralized Verification Notice when Pending/Awaiting Verification -->
                            <div v-if="needsManualConfirmation || (participant.payment_status || '').toLowerCase() === 'awaiting_verification'" class="pt-2">
                                <div class="p-3.5 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-xl space-y-2.5">
                                    <div class="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-300">
                                        <Icon icon="ph:info-bold" class="text-base text-amber-600 shrink-0 mt-0.5" />
                                        <div class="leading-relaxed font-medium">
                                            <span class="font-bold">{{ t('participant.detail.verification_notice_title') }}:</span>
                                            {{ t('participant.detail.verification_notice_desc') }}
                                        </div>
                                    </div>
                                    <NuxtLink
                                        :to="`/dashboard/organizer/tournaments/${eventId}/payments`"
                                        class="w-full h-9 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                                    >
                                        <Icon icon="ph:credit-card-bold" class="text-sm" />
                                        <span>{{ t('participant.detail.go_to_payments') }}</span>
                                        <Icon icon="ph:arrow-right-bold" class="text-xs" />
                                    </NuxtLink>
                                </div>
                            </div>

                            <!-- Automatic Gateway Note when Pending (No EO Confirmation Needed) -->
                            <div v-else-if="isAutomaticGateway && !isPaidStatus(participant.payment_status || participant.status)" class="pt-2">
                                <div class="p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                                    <Icon icon="ph:info-bold" class="text-base text-blue-600 shrink-0 mt-0.5" />
                                    <div class="leading-relaxed">
                                        <span class="font-bold">{{ t('participant.detail.auto_gateway_title') }}:</span>
                                        {{ t('participant.detail.auto_gateway_desc') }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Section 2: Competition / Venue Status -->
                        <div class="border-t border-slate-100 pt-6 space-y-4">
                            <div class="border-b border-slate-100 pb-3.5">
                                <h3 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                                    <Icon icon="ph:seal-check-bold" class="text-slate-500 text-xl" />
                                    <span>{{ t('participant.detail.match_status_title') }}</span>
                                </h3>
                            </div>

                            <div class="divide-y divide-slate-100 text-xs sm:text-sm">
                                <div class="py-3.5 flex items-center justify-between">
                                    <span class="text-slate-500 font-medium">{{ t('participant.detail.registration_source_label') }}</span>
                                    <span class="font-bold text-slate-800">
                                        {{ displayRegistrationSource }}
                                    </span>
                                </div>
                                <div class="py-3.5 flex items-center justify-between">
                                    <span class="text-slate-500 font-medium">{{ t('participant.detail.checkin_label') }}</span>
                                    <div class="text-right">
                                        <span class="font-bold px-2.5 py-0.5 rounded-md text-xs sm:text-sm inline-block" :class="isCheckedIn ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'">
                                            {{ isCheckedIn ? t('participant.detail.checked_in') : t('participant.detail.not_checked_in') }}
                                        </span>
                                        <div v-if="isCheckedIn && checkinTimeFormatted" class="text-[11px] text-slate-500 mt-0.5 font-medium">
                                            {{ checkinTimeFormatted }}
                                        </div>
                                    </div>
                                </div>
                                <div class="py-3.5 flex items-center justify-between">
                                    <span class="text-slate-500 font-medium">{{ t('participant.detail.registration_date_label') }}</span>
                                    <span class="font-bold text-slate-800">
                                        {{ formatDate(participant.registration_date || participant.created_at) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs space-y-4 flex flex-col items-center justify-center">
                <div class="size-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
                    <Icon icon="ph:user-circle-x-bold" class="text-3xl text-slate-400" />
                </div>
                <div class="space-y-1">
                    <h3 class="text-lg font-black text-navy">{{ t('participant.detail.not_found_title') }}</h3>
                    <div class="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto font-medium">
                        {{ t('participant.detail.not_found_desc') }}
                    </div>
                </div>
                <BaseButton :to="`/dashboard/organizer/tournaments/${eventId}/participants`" variant="white" icon="ph:arrow-left-bold" class="h-10 px-5 text-xs sm:text-sm font-bold shadow-xs">
                    {{ t('dashboard.participants_list.title') }}
                </BaseButton>
            </div>
        </template>

        <!-- Fullscreen Proof Zoom Lightbox Modal (True 100% Viewport Height) -->
        <Teleport to="body">
            <Transition name="fade">
                <div v-if="showProofModal && selectedProofImage"
                    class="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-md select-none p-2 sm:p-4"
                    @click.self="closeProofZoom">
                    <!-- True 100% Height Viewport -->
                    <div class="relative w-full h-full flex items-center justify-center" @click.self="closeProofZoom">
                        <img :src="selectedProofImage"
                            :alt="t('participant.detail.transfer_proof_title')"
                            class="h-full w-auto max-h-[98vh] max-w-[98vw] object-contain rounded-xl shadow-2xl border border-white/15 bg-black/60 cursor-zoom-out pointer-events-auto"
                            @click="closeProofZoom" />
                    </div>

                    <!-- Top Floating Action Bar (Always on Top) -->
                    <div class="fixed top-4 right-4 sm:top-6 sm:right-6 z-[1000] flex items-center gap-3 pointer-events-auto">
                        <a :href="selectedProofImage" target="_blank" download
                            class="p-3 text-white bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-all shadow-xl cursor-pointer hover:scale-105 active:scale-95"
                            :title="t('participant.detail.download')"
                            @click.stop>
                            <Icon icon="ph:download-simple-bold" class="text-xl" />
                        </a>
                        <button type="button" @click.stop="closeProofZoom"
                            class="p-3 text-white bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-all shadow-xl cursor-pointer hover:scale-105 active:scale-95"
                            :title="t('participant.detail.close')">
                            <Icon icon="ph:x-bold" class="text-xl" />
                        </button>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

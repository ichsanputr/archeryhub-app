<script setup>
import { Icon } from '@iconify/vue'
import QrcodeVue from 'qrcode.vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useDashboardI18n from '~/composables/useDashboardI18n'

definePageMeta({
    layout: 'dashboard'
})

const { t } = useDashboardI18n()
const { user } = useAuth()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const { get, post, upload, delete: del } = useApi()
const eventId = route.params.id

useHead({
    title: computed(() => `${t('my_registration.title')} - Archeris Dashboard`)
})

const isLoading = ref(true)
const participant = ref(null)
const event = ref(null)

const showImageDialog = ref(false)
const selectedImage = ref('')

const isProcessingPayment = ref(false)
const isCancelling = ref(false)
const showCancelConfirm = ref(false)

const handleCancelRegistration = async () => {
    if (!participant.value) return
    isCancelling.value = true
    try {
        const participantId = participant.value.id || participant.value.participant_id || participant.value.uuid
        if (participant.value.transaction?.reference) {
            await post(`/payments/${participant.value.transaction.reference}/cancel`)
        } else if (participantId) {
            await del(`/tournaments/participants/${participantId}`)
        }
        toast.success(t('my_registration.toast_cancel_success', 'Pendaftaran berhasil dibatalkan'))
        showCancelConfirm.value = false
        await fetchInitialData()
    } catch (e) {
        console.error('Failed to cancel registration:', e)
        toast.error(e?.data?.message || t('my_registration.toast_cancel_failed', 'Gagal membatalkan pendaftaran'))
    } finally {
        isCancelling.value = false
    }
}

const formatPaymentMethodName = (method) => {
    if (isFreeRegistration.value) return `${t('archer_payment_detail.free_badge', 'Pendaftaran Gratis')} (${formatCurrency(0)})`
    if (!method) return '-'
    const m = String(method).toLowerCase()
    if (m === 'free' || m === 'free_registration') return `${t('archer_payment_detail.free_badge', 'Pendaftaran Gratis')} (${formatCurrency(0)})`
    if (m === 'manual' || m === 'manual_transfer' || m === 'bank_transfer') return t('archer_payments_list.method_manual', 'Transfer Bank Manual')
    if (m === 'mayar') return 'Mayar'
    if (m === 'paypal') return 'PayPal'
    if (m === 'midtrans') return 'Midtrans'
    if (m === 'xendit') return 'Xendit'
    if (m === 'qris') return 'QRIS'
    if (m === 'cash' || m === 'tunai') return t('payment_method.cash', 'Tunai')
    return method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const initiatePaymentGateway = async () => {
    isProcessingPayment.value = true
    try {
        const response = await post(`/tournaments/${eventId}/participants/me/checkout`)
        if (response?.checkout_url || response?.transaction_id || response?.reference) {
            await handleTransactionPayment(response)
            await fetchInitialData()
        }
    } catch (e) {
        console.error('Failed to initiate checkout:', e)
        toast.error(t('my_registration.toast_payment_failed'))
    } finally {
        isProcessingPayment.value = false
    }
}

const isPaid = (status) => {
    const ps = (status || participant.value?.payment_status || '').toLowerCase()
    const ts = (participant.value?.transaction?.status || '').toLowerCase()
    return ['paid', 'lunas', 'registered', 'terdaftar', 'success', 'completed'].includes(ps) ||
           ['paid', 'lunas', 'registered', 'terdaftar', 'success', 'completed'].includes(ts)
}

const activeCategories = computed(() => {
    const cats = participant.value?.categories || []
    const nonCancelled = cats.filter(c => {
        const s = (c.payment_status || '').toLowerCase()
        return s !== 'cancelled' && s !== 'canceled' && s !== 'expired' && s !== 'failed'
    })
    return nonCancelled.length > 0 ? nonCancelled : cats
})

const displayPaymentAmount = computed(() => {
    if (participant.value?.transaction?.total_amount) {
        return Number(participant.value.transaction.total_amount)
    }
    if (activeCategories.value.length > 0) {
        return activeCategories.value.reduce((sum, c) => sum + Number(c.payment_amount || c.fee || 0), 0)
    }
    return Number(participant.value?.payment_amount || 0)
})

const isCancelled = computed(() => {
    const ps = (participant.value?.payment_status || '').toLowerCase()
    const ts = (participant.value?.transaction?.status || '').toLowerCase()

    // If active transaction is pending, paid, or awaiting_verification -> NOT cancelled
    if (['pending', 'paid', 'lunas', 'awaiting_verification', 'menunggu_acc'].includes(ts)) {
        return false
    }
    const hasActiveCat = (participant.value?.categories || []).some(c => {
        const cs = (c.payment_status || '').toLowerCase()
        return ['pending', 'paid', 'lunas', 'awaiting_verification', 'menunggu_acc'].includes(cs)
    })
    if (hasActiveCat) {
        return false
    }

    return ['cancelled', 'canceled', 'expired', 'failed'].includes(ps) || ['cancelled', 'canceled', 'expired', 'failed'].includes(ts)
})

const isRejected = computed(() => {
    if (isPaid() || !isCancelled.value) {
        const ts = (participant.value?.transaction?.status || '').toLowerCase()
        return ts === 'rejected'
    }
    const ps = (participant.value?.payment_status || '').toLowerCase()
    const ts = (participant.value?.transaction?.status || '').toLowerCase()
    return ps === 'rejected' || ts === 'rejected'
})

const isAwaitingVerification = computed(() => {
    const ps = (participant.value?.payment_status || '').toLowerCase()
    const ts = (participant.value?.transaction?.status || '').toLowerCase()
    return !isPaid() && !isCancelled.value && !isRejected.value && (ps === 'awaiting_verification' || ts === 'awaiting_verification' || !!participantProofUrl.value)
})

const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID').format(val || 0)
}

const formatDate = (d) => {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

const openImage = (url) => {
    selectedImage.value = url
    showImageDialog.value = true
}

const participantProofUrl = computed(() => {
    return participant.value?.transaction?.proof_url ||
        participant.value?.payment_proof_url ||
        (participant.value?.payment_proof_urls && participant.value?.payment_proof_urls[0]) ||
        null
})

const isInvoiceOwner = computed(() => {
    if (!participant.value) return false
    
    const currentUserId = user.value?.id || user.value?.uuid
    const currentUserEmail = (user.value?.email || '').toLowerCase().trim()
    const txUserId = participant.value.transaction?.user_id
    const txPayerEmail = (participant.value.transaction?.registered_by_email || participant.value.transaction?.payer_email || '').toLowerCase().trim()

    if (participant.value.transaction) {
        if (txUserId && currentUserId && (txUserId === currentUserId)) {
            return true
        }
        if (txPayerEmail && currentUserEmail && (txPayerEmail === currentUserEmail)) {
            return true
        }
        if (txUserId && currentUserId && txUserId !== currentUserId) {
            return false
        }
    }

    const src = (participant.value.registration_source || '').toLowerCase()
    if (src === 'invitation' || src === 'invited') {
        if (txUserId && currentUserId && txUserId !== currentUserId) {
            return false
        }
    }

    return true
})

const isDelegatedByOther = computed(() => {
    const src = (participant.value?.registration_source || '').toLowerCase()
    return !isInvoiceOwner.value || ((src === 'invitation' || src === 'invited' || src === 'delegation') && !isInvoiceOwner.value)
})

const primaryCategory = computed(() => {
    if (activeCategories.value && activeCategories.value.length > 0) {
        return activeCategories.value[0]
    }
    return null
})

const assignedTargets = computed(() => {
    if (participant.value?.targets && Array.isArray(participant.value.targets) && participant.value.targets.length > 0) {
        return participant.value.targets
    }
    // Fallback from categories if any target_name is set directly on participant or categories
    if (participant.value?.categories && Array.isArray(participant.value.categories)) {
        const list = []
        for (const cat of participant.value.categories) {
            if (cat.target_name) {
                list.push({
                    id: cat.id,
                    stage: 'qualification',
                    stage_label: t('my_registration.stage_qualification'),
                    target_name: cat.target_name,
                    target_number: cat.target_name,
                    target_position: '',
                    session_name: t('my_registration.session_default'),
                    category_id: cat.category_id,
                    category_name: cat.category_name,
                    division_name: cat.division_name,
                    participant_id: cat.id
                })
            }
        }
        if (list.length > 0) return list
    }
    if (participant.value?.target_number || participant.value?.target_name) {
        const tName = participant.value.target_number || participant.value.target_name
        return [{
            id: 'legacy-target',
            stage: 'qualification',
            stage_label: t('my_registration.stage_qualification'),
            target_name: tName,
            target_number: tName,
            target_position: participant.value.target_face || '',
            session_name: participant.value.session_name || t('my_registration.session_default'),
            category_name: primaryCategory.value?.category_name || t('my_registration.main_category'),
            division_name: primaryCategory.value?.division_name || '',
            participant_id: participant.value.id
        }]
    }
    return []
})

const getTargetForCategory = (catId) => {
    if (!assignedTargets.value || assignedTargets.value.length === 0) return null
    return assignedTargets.value.find(t => t.category_id === catId || t.participant_id === catId)
}

const targetSummaryText = computed(() => {
    const list = assignedTargets.value
    if (!list || list.length === 0) {
        return t('my_registration.tba')
    }
    if (list.length === 1) {
        return list[0].target_name ? t('my_registration.target_item', { num: list[0].target_name }) : t('my_registration.tba')
    }
    const names = list.map(x => x.target_name).filter(Boolean)
    return `${list.length} ${t('my_registration.target_unit')} (${names.slice(0, 2).join(', ')}${names.length > 2 ? '...' : ''})`
})

const isFreeRegistration = computed(() => {
    if (!participant.value) return false
    
    // Check participant payment amount
    const paymentAmount = Number(participant.value.payment_amount || participant.value.total_fee || 0)
    if (paymentAmount > 0) return false

    // Check categories amount/fee
    if (participant.value.categories && Array.isArray(participant.value.categories)) {
        const hasPaidCat = participant.value.categories.some(c => Number(c.payment_amount || c.fee || 0) > 0)
        if (hasPaidCat) return false
    }

    // Check if event has a registration fee
    if (event.value && Number(event.value.registration_fee || 0) > 0) {
        return false
    }

    return true
})

const sanitizeTarget = (t, idx) => {
    const rawName = (t.target_name || '').trim().replace(/^Target\s*/i, '')
    let pos = (t.target_position || t.target_board || '').trim()
    let num = (t.target_number || '').trim()

    // If pos or num contains UUIDs (more than 4 chars), strip it
    if (pos.length > 3) pos = ''
    if (num.length > 5) num = ''

    // Extract clean name, number, and position
    let cleanName = rawName
    if (cleanName.length > 5) {
        const match = cleanName.match(/^([0-9]+[A-Za-z]|[0-9]+)/)
        cleanName = match ? match[0] : ''
    }
    if (!pos && cleanName) {
        const posMatch = cleanName.match(/[A-Za-z]+$/)
        if (posMatch) pos = posMatch[0]
    }
    if (!num && cleanName) {
        const numMatch = cleanName.match(/^\d+/)
        if (numMatch) num = numMatch[0]
    }
    if (!cleanName && num) {
        cleanName = `${num}${pos}`
    }

    return {
        ...t,
        id: t.id || t.assignment_id || t.session_id || `target-${idx}`,
        stage: t.stage || 'qualification',
        stage_label: t.stage_label || t('my_registration.stage_qualification'),
        target_name: cleanName || t.target_name || '-',
        target_number: num || cleanName || '1',
        target_position: pos,
        session_name: t.session_name || t('my_registration.session_default'),
        session_date: t.session_date || '',
        start_time: t.start_time || '',
        end_time: t.end_time || '',
        category_id: t.category_id || '',
        category_name: t.category_name || primaryCategory.value?.category_name || t('my_registration.general_category'),
        division_name: t.division_name || primaryCategory.value?.division_name || '',
        distance: t.distance || primaryCategory.value?.distance || '70',
        target_face: t.target_face || primaryCategory.value?.target_face || t('my_registration.standard_target_face'),
        participant_id: t.participant_id || participant.value?.id
    }
}

const fetchInitialData = async () => {
    isLoading.value = true
    try {
        const [detailed, evRes, targetRes] = await Promise.all([
            get(`/tournaments/${eventId}/participants/me`),
            get(`/tournaments/${eventId}`).catch(() => null),
            get(`/tournaments/${eventId}/my-target`).catch(() => null)
        ])
        participant.value = detailed?.data || detailed
        event.value = evRes?.data || evRes

        if (participant.value?.targets && Array.isArray(participant.value.targets) && participant.value.targets.length > 0) {
            participant.value.targets = participant.value.targets.map((t, idx) => sanitizeTarget(t, idx))
        } else if (targetRes) {
            // If participant.targets is empty, merge from my-target response
            const tData = targetRes?.data || targetRes
            if (tData?.targets && Array.isArray(tData.targets) && tData.targets.length > 0) {
                if (!participant.value) participant.value = {}
                participant.value.targets = tData.targets.map((t, idx) => sanitizeTarget(t, idx))
            }
        }
    } catch (e) {
        console.error('Failed to fetch registration data:', e)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchInitialData()
})
</script>

<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header (Standard DashboardHeader with Golden Accent & Motif) -->
        <DashboardHeader
            :title="t('my_registration.page_title')"
            :subtitle="t('my_registration.header_subtitle')"
            icon="ph:ticket-bold"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/archer' },
                { label: t('sidebar.my_events', 'Turnamen Saya'), to: '/dashboard/archer/tournaments' },
                { label: t('my_registration.page_title', 'Status Registrasi') }
            ]"
        >
            <template #actions>
                <div class="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
                    <button
                        v-if="participant && !isPaid(participant.payment_status) && !isCancelled && !isDelegatedByOther && participant.registration_source !== 'invitation' && participant.registration_source !== 'invited'"
                        type="button"
                        @click="showCancelConfirm = true"
                        class="inline-flex items-center gap-1.5 h-10 sm:h-11 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 text-xs sm:text-sm font-bold text-rose-100 hover:text-white backdrop-blur-sm transition-colors shadow-xs"
                    >
                        <Icon icon="ph:trash-bold" class="text-xs sm:text-sm" />
                        <span>{{ t('my_registration.cancel_registration_btn', 'Batalkan Pendaftaran') }}</span>
                    </button>
                    <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/overview`"
                        class="inline-flex items-center gap-1.5 h-10 sm:h-11 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-bold text-white backdrop-blur-sm transition-colors shadow-xs">
                        <Icon icon="ph:arrow-left-bold" class="text-xs" />
                        <span>{{ t('my_registration.back_to_overview') }}</span>
                    </NuxtLink>
                </div>
            </template>
        </DashboardHeader>

        <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
                <div class="h-44 bg-white rounded-2xl animate-pulse border border-slate-200" />
                <div class="h-64 bg-white rounded-2xl animate-pulse border border-slate-200" />
            </div>
            <div class="h-96 bg-white rounded-2xl animate-pulse border border-slate-200" />
        </div>

        <template v-else-if="participant">
            <!-- Unified Single White Card Form/Detail Layout (Consistent with Organizer & Detail Layouts) -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    <!-- Left Column (2 cols): Athlete Profile, Metrics, Target, Categories & Payment Details -->
                    <div class="lg:col-span-2 space-y-6">

                        <!-- Section 1: Athlete Pass Header & Metrics -->
                        <div class="space-y-6">
                            <div class="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-slate-100">
                                <div class="size-16 sm:size-20 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                                    <img :src="useImageOrDefault(participant.avatar_url || participant.avatar, participant.full_name)"
                                        :alt="participant.full_name" class="w-full h-full object-cover" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex flex-wrap items-center gap-2.5">
                                        <h2 class="text-xl sm:text-2xl font-black text-slate-900 truncate">{{ participant.full_name }}</h2>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-2.5 mt-1.5 text-sm sm:text-base text-slate-600 font-medium">
                                        <span>{{ participant.club_name || t('my_registration.independent') }}</span>
                                        <span>•</span>
                                        <span class="font-mono font-bold text-slate-700">{{ participant.athlete_code || ('ARC-' + (participant.archer_id || '').substring(0, 6).toUpperCase()) }}</span>
                                        <template v-if="participant.email">
                                            <span>•</span>
                                            <span class="truncate">{{ participant.email }}</span>
                                        </template>
                                    </div>
                                </div>
                            </div>

                            <!-- 4-Grid Athlete Pass Metrics -->
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                                <div class="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 text-center">
                                    <span class="text-slate-500 block mb-1 font-medium text-xs sm:text-sm">{{ t('my_registration.athlete_code_label', 'Kode Atlet') }}</span>
                                    <span class="text-slate-900 font-black text-sm sm:text-base font-mono">
                                        {{ participant.athlete_code || ('ARC-' + (participant.archer_id || participant.id || '').substring(0, 6).toUpperCase()) }}
                                    </span>
                                </div>

                                <div class="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 text-center">
                                    <span class="text-slate-500 block mb-1 font-medium text-xs sm:text-sm">{{ t('my_registration.bow_division') }}</span>
                                    <span class="text-slate-900 font-bold text-sm sm:text-base truncate block">
                                        {{ primaryCategory?.division_name || participant.bow_type || 'Recurve' }}
                                    </span>
                                </div>

                                <div class="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 text-center">
                                    <span class="text-slate-500 block mb-1 font-medium text-xs sm:text-sm">{{ t('my_registration.reregistration_status') }}</span>
                                    <span class="font-bold text-sm sm:text-base block text-slate-900">
                                        {{ participant.last_reregistration_at ? t('my_registration.checked_in') : t('my_registration.not_checked_in') }}
                                    </span>
                                </div>

                                <div class="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 text-center">
                                    <span class="text-slate-500 block mb-1 font-medium text-xs sm:text-sm">{{ t('my_registration.registration_status_label', 'Status Registrasi') }}</span>
                                    <span v-if="isPaid(participant.payment_status)" class="font-black text-sm sm:text-base block text-slate-900 truncate">
                                        {{ t('my_registration.paid', 'Terdaftar (Lunas)') }}
                                    </span>
                                    <span v-else-if="isCancelled" class="font-black text-sm sm:text-base block text-slate-900 truncate">
                                        {{ t('payment_status.badge_cancelled', 'Dibatalkan') }}
                                    </span>
                                    <span v-else-if="isRejected" class="font-black text-sm sm:text-base block text-slate-900 truncate">
                                        {{ t('my_registration.payment_rejected', 'Ditolak') }}
                                    </span>
                                    <span v-else-if="isAwaitingVerification" class="font-black text-sm sm:text-base block text-slate-900 truncate">
                                        {{ t('my_registration.awaiting_verification', 'Menunggu Verifikasi') }}
                                    </span>
                                    <span v-else class="font-black text-sm sm:text-base block text-slate-900 truncate">
                                        {{ t('my_registration.awaiting_payment', 'Menunggu Pembayaran') }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Section 2: Registered Categories -->
                        <div class="border-t border-slate-100 pt-6 space-y-3.5">
                            <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
                                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2.5">
                                    <div class="size-8 rounded-lg bg-primary/15 text-navy border border-primary/20 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                                        <Icon icon="ph:stack-bold" class="text-base" />
                                    </div>
                                    <span>{{ t('my_registration.registered_categories') }}</span>
                                </h3>
                                <span class="text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                                    {{ activeCategories.length || 1 }} {{ (activeCategories.length || 1) === 1 ? t('my_registration.category_unit_single') : t('my_registration.categories_unit') }}
                                </span>
                            </div>

                            <div class="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                                <div v-for="cat in activeCategories" :key="cat.id"
                                    class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                                    <div>
                                        <div class="text-sm sm:text-base font-bold text-slate-900">
                                            {{ cat.category_name }}
                                        </div>
                                        <div class="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium flex items-center gap-2 flex-wrap">
                                            <span>{{ cat.division_name }} <span v-if="cat.event_type_name">•</span> {{ cat.event_type_name }}</span>
                                            <template v-if="getTargetForCategory(cat.category_id || cat.id)">
                                                <span>•</span>
                                                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-navy text-white text-xs sm:text-sm font-bold font-mono">
                                                    <Icon icon="ph:crosshair-bold" class="text-xs" />
                                                    <span>{{ t('my_registration.target_item', { num: getTargetForCategory(cat.category_id || cat.id)?.target_name }) }}</span>
                                                </span>
                                            </template>
                                        </div>
                                    </div>
                                    <div class="flex sm:flex-col items-center sm:items-end justify-between text-xs sm:text-sm">
                                        <span class="text-slate-400 font-medium text-xs sm:text-sm">{{ t('my_registration.fee') }}</span>
                                        <span class="font-bold text-slate-900 text-sm sm:text-base">Rp {{ formatCurrency(cat.payment_amount || cat.fee) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Section 3: Payment Details (Moved to Left Column) -->
                        <div class="border-t border-slate-100 pt-6 space-y-4">
                            <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
                                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2.5">
                                    <div class="size-8 rounded-lg bg-primary/15 text-navy border border-primary/20 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                                        <Icon icon="ph:credit-card-bold" class="text-base" />
                                    </div>
                                    <span>{{ t('my_registration.payment_details_title') }}</span>
                                </h3>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div class="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                                    <span class="text-slate-500 block mb-1 font-medium text-xs sm:text-sm">{{ t('my_registration.total_bill') }}</span>
                                    <span class="text-slate-900 font-black text-base sm:text-lg">
                                        Rp {{ formatCurrency(displayPaymentAmount) }}
                                    </span>
                                </div>
                                <div v-if="participant.transaction?.reference" class="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                                    <span class="text-slate-500 block mb-1 font-medium text-xs sm:text-sm">{{ t('my_registration.invoice_no') }}</span>
                                    <NuxtLink :to="`/dashboard/archer/payments/${participant.transaction.reference}`"
                                        class="font-mono font-bold text-slate-900 hover:text-slate-700 transition-colors flex items-center gap-1 text-xs sm:text-sm truncate">
                                        <span>{{ participant.transaction.reference }}</span>
                                        <Icon icon="ph:arrow-square-out-bold" class="text-xs text-slate-400 shrink-0" />
                                    </NuxtLink>
                                </div>
                                <div v-if="participant.transaction?.payment_method" class="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                                    <span class="text-slate-500 block mb-1 font-medium text-xs sm:text-sm">{{ t('my_registration.method') }}</span>
                                    <span class="font-bold text-slate-900 text-xs sm:text-sm truncate block">
                                        {{ formatPaymentMethodName(participant.transaction.payment_method) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Uploaded Proof Preview (If exists) -->
                            <div v-if="participantProofUrl" class="p-4 bg-slate-50/90 rounded-xl border border-slate-200 space-y-3">
                                <div class="flex items-center justify-between text-xs sm:text-sm">
                                    <span class="font-bold text-slate-800 flex items-center gap-2">
                                        <div class="size-7 rounded-lg bg-navy/5 text-navy flex items-center justify-center font-bold shrink-0">
                                            <Icon icon="ph:image-square-bold" class="text-sm" />
                                        </div>
                                        <span>{{ t('my_registration.payment_proof_title') }}</span>
                                    </span>
                                    <span v-if="participant.transaction?.sender_name" class="text-xs sm:text-sm text-slate-500 font-medium truncate max-w-[200px]" :title="participant.transaction.sender_name">
                                        {{ t('my_registration.sender_account_holder') }} {{ participant.transaction.sender_name }}
                                    </span>
                                </div>
                                <div
                                    @click="openImage(participantProofUrl)"
                                    class="group relative h-36 sm:h-44 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-900/5 cursor-pointer shadow-2xs flex items-center justify-center hover:border-slate-400 transition-all"
                                >
                                    <img :src="participantProofUrl" :alt="t('my_registration.payment_proof_title')" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div class="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs sm:text-sm font-bold backdrop-blur-[1px]">
                                        <Icon icon="ph:magnifying-glass-plus-bold" class="text-base" />
                                        <span>{{ t('my_registration.zoom_proof') }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Payment Actions depending on status -->
                            <!-- Case 1: Lunas (Paid) -->
                            <div v-if="isPaid(participant.payment_status) && participant.transaction?.reference">
                                <NuxtLink :to="`/dashboard/archer/payments/${participant.transaction.reference}`"
                                    class="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs">
                                    <Icon icon="ph:receipt-bold" class="text-base text-slate-700" />
                                    <span>{{ t('my_registration.view_payment_detail', 'Lihat Detail Pembayaran') }}</span>
                                </NuxtLink>
                            </div>

                            <!-- Case 2: Cancelled (Dibatalkan) -->
                            <div v-else-if="isCancelled" class="space-y-3 pt-1">
                                <div class="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-left">
                                    <div class="text-xs sm:text-sm font-bold text-rose-800 flex items-center gap-1.5">
                                        <Icon icon="ph:prohibit-bold" class="text-base shrink-0 text-rose-600" />
                                        <span>{{ t('my_registration.cancelled_notice_title', 'Pendaftaran / Tagihan Dibatalkan') }}</span>
                                    </div>
                                    <div class="text-xs text-rose-700 leading-relaxed font-medium">
                                        {{ t('my_registration.cancelled_notice_desc', 'Tagihan transaksi pendaftaran ini telah dibatalkan. Pembayaran tidak dapat dilanjutkan.') }}
                                    </div>
                                </div>
                                <NuxtLink :to="`/tournaments/${eventId}/register`"
                                    class="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-navy text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm">
                                    <Icon icon="ph:arrow-clockwise-bold" class="text-base" />
                                    <span>{{ t('my_registration.register_again', 'Daftar Ulang Turnamen') }}</span>
                                </NuxtLink>
                                <NuxtLink v-if="participant.transaction?.reference" :to="`/dashboard/archer/payments/${participant.transaction.reference}`"
                                    class="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs">
                                    <Icon icon="ph:receipt-bold" class="text-base text-slate-700" />
                                    <span>{{ t('my_registration.view_payment_detail', 'Lihat Detail Tagihan') }}</span>
                                </NuxtLink>
                            </div>

                            <!-- Case 3: Rejected (Ditolak Panitia) -->
                            <div v-else-if="isRejected" class="space-y-3 pt-1">
                                <div class="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-left">
                                    <div class="text-xs sm:text-sm font-bold text-rose-800 flex items-center gap-1.5">
                                        <Icon icon="ph:warning-circle-bold" class="text-base shrink-0 text-rose-600" />
                                        <span>{{ t('my_registration.proof_rejected_title', 'Bukti Pembayaran Ditolak') }}</span>
                                    </div>
                                    <div class="text-xs text-rose-700 leading-relaxed font-medium">
                                        {{ t('my_registration.proof_rejected_desc', 'Bukti transfer ditolak oleh panitia. Silakan buka halaman detail pembayaran untuk mengunggah ulang bukti baru.') }}
                                    </div>
                                    <div v-if="participant.transaction?.rejection_reason" class="p-2.5 bg-white/90 rounded-lg border border-rose-200 text-xs text-rose-900">
                                        <span class="font-bold block text-rose-950 mb-0.5">{{ t('my_registration.rejection_reason_label', 'Catatan Penolakan:') }}</span>
                                        <span class="italic font-medium">"{{ participant.transaction.rejection_reason }}"</span>
                                    </div>
                                </div>
                                <NuxtLink v-if="participant.transaction?.reference"
                                    :to="`/dashboard/archer/payments/${participant.transaction.reference}`"
                                    class="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-navy text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm">
                                    <Icon icon="ph:credit-card-bold" class="text-base" />
                                    <span>{{ t('my_registration.view_payment_detail', 'Lihat Detail Pembayaran') }}</span>
                                    <Icon icon="ph:arrow-right-bold" class="text-xs" />
                                </NuxtLink>
                            </div>

                            <!-- Case 4: Awaiting Verification (Menunggu Verifikasi Panitia) -->
                            <div v-else-if="isAwaitingVerification" class="space-y-3 pt-1">
                                <!-- Delegation notice if registered by another account -->
                                <div v-if="isDelegatedByOther" class="p-4 bg-blue-50/80 border border-blue-200/80 rounded-xl space-y-1.5 text-left">
                                    <div class="text-xs sm:text-sm font-bold text-blue-900 flex items-center gap-1.5">
                                        <Icon icon="ph:users-three-bold" class="text-base shrink-0 text-blue-600" />
                                        <span>{{ t('my_registration.delegation_registration_title', 'Pendaftaran Kolektif') }}</span>
                                    </div>
                                    <div class="text-xs text-blue-800 leading-relaxed font-medium">
                                        {{ t('my_registration.delegation_registered_by', { name: participant.transaction?.registered_by_name || participant.transaction?.payer_name || 'Perwakilan / Klub' }) }}
                                    </div>
                                    <div class="text-[11px] text-blue-700/80 pt-0.5">
                                        {{ t('my_registration.awaiting_verification_desc', 'Bukti transfer sedang menunggu proses verifikasi oleh panitia pelaksana.') }}
                                    </div>
                                </div>

                                <!-- Self registered owner options -->
                                <template v-else>
                                    <div class="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-left">
                                        <div class="text-xs sm:text-sm font-bold text-amber-800 flex items-center gap-1.5">
                                            <Icon icon="ph:hourglass-medium-bold" class="text-sm shrink-0" />
                                            <span>{{ t('my_registration.awaiting_verification_title', 'Menunggu Verifikasi Pembayaran') }}</span>
                                        </div>
                                        <div class="text-xs sm:text-sm text-amber-700/90 leading-relaxed font-medium">
                                            {{ t('my_registration.awaiting_verification_desc', 'Bukti transfer sedang menunggu proses verifikasi oleh panitia pelaksana.') }}
                                        </div>
                                    </div>
                                    <NuxtLink v-if="participant.transaction?.reference"
                                        :to="`/dashboard/archer/payments/${participant.transaction.reference}`"
                                        class="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs">
                                        <Icon icon="ph:receipt-bold" class="text-base text-slate-700" />
                                        <span>{{ t('my_registration.view_payment_detail', 'Lihat Detail Pembayaran') }}</span>
                                    </NuxtLink>
                                </template>
                            </div>

                            <!-- Case 5: Pending Payment with Existing Transaction -->
                            <div v-else-if="!isPaid(participant.payment_status) && participant.transaction" class="space-y-3 pt-1">
                                <!-- Delegation notice if registered by another account -->
                                <div v-if="isDelegatedByOther" class="p-4 bg-blue-50/80 border border-blue-200/80 rounded-xl space-y-1.5 text-left">
                                    <div class="text-xs sm:text-sm font-bold text-blue-900 flex items-center gap-1.5">
                                        <Icon icon="ph:users-three-bold" class="text-base shrink-0 text-blue-600" />
                                        <span>{{ t('my_registration.delegation_registration_title', 'Pendaftaran Kolektif') }}</span>
                                    </div>
                                    <div class="text-xs text-blue-800 leading-relaxed font-medium">
                                        {{ t('my_registration.delegation_registered_by', { name: participant.transaction?.registered_by_name || participant.transaction?.payer_name || 'Perwakilan / Klub' }) }}
                                    </div>
                                </div>

                                <!-- Self registered owner: Direct cleanly to payment detail page -->
                                <template v-else>
                                    <NuxtLink
                                        :to="`/dashboard/archer/payments/${participant.transaction.reference}`"
                                        class="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-navy text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <Icon icon="ph:credit-card-bold" class="text-base" />
                                        <span>{{ t('my_registration.pay_now', 'Lanjutkan Pembayaran') }}</span>
                                        <Icon icon="ph:arrow-right-bold" class="text-xs" />
                                    </NuxtLink>
                                </template>
                            </div>

                            <!-- Case 6: Pending Payment without Transaction -->
                            <div v-else-if="!isPaid(participant.payment_status) && !participant.transaction && !isDelegatedByOther">
                                <BaseButton variant="primary" block @click="initiatePaymentGateway"
                                    :loading="isProcessingPayment" class="h-11 text-xs sm:text-sm font-bold justify-center">
                                    <Icon icon="ph:lightning-bold" class="text-base mr-1.5" />
                                    <span>{{ t('my_registration.pay_online_auto') }}</span>
                                </BaseButton>
                            </div>
                        </div>

                    </div>

                    <!-- Right Column (1 col): QR Pass & THB Guide -->
                    <div class="lg:col-span-1 space-y-6 lg:border-l lg:border-slate-100 lg:pl-8 lg:pt-0">

                        <!-- Section 1: Official Field Check-in QR Pass -->
                        <div class="space-y-3.5 text-center">
                            <div class="flex items-center justify-between text-xs sm:text-sm pb-2.5 border-b border-slate-100">
                                <span class="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                                    <div class="size-7 rounded-lg bg-navy/5 text-navy flex items-center justify-center font-bold shrink-0">
                                        <Icon icon="ph:qr-code-bold" class="text-sm" />
                                    </div>
                                    <span>{{ t('my_registration.qr_checkin_badge') }}</span>
                                </span>
                            </div>

                            <!-- Active QR Code (Only when Paid) -->
                            <div v-if="isPaid(participant.payment_status)" class="flex flex-col items-center justify-center p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
                                <img :src="`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(participant?.qr_raw || ('ARCHERIS-CHECKIN:' + (participant?.archer_id || eventId)))}&size=200x200&color=051923`"
                                    :alt="t('my_registration.qr_checkin_badge')" class="w-44 h-44 rounded-xl p-2 bg-white border border-slate-200 shadow-xs" />
                                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-navy text-white text-xs sm:text-sm font-black font-mono">
                                    <span>{{ participant.athlete_code || ('ARC-' + (participant.archer_id || '').substring(0, 6).toUpperCase()) }}</span>
                                </div>
                            </div>

                            <!-- Cancelled QR Placeholder -->
                            <div v-else-if="isCancelled" class="flex flex-col items-center justify-center p-6 bg-rose-50/50 rounded-2xl border border-dashed border-rose-200 space-y-3">
                                <div class="size-14 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
                                    <Icon icon="ph:prohibit-bold" class="text-2xl" />
                                </div>
                                <div class="space-y-1 max-w-[220px]">
                                    <div class="text-xs sm:text-sm font-bold text-rose-900">
                                        {{ t('my_registration.qr_cancelled_title', 'QR Tidak Aktif') }}
                                    </div>
                                    <div class="text-xs sm:text-sm text-rose-700 leading-relaxed">
                                        {{ t('my_registration.qr_cancelled_desc', 'Pendaftaran telah dibatalkan sehingga tiket check-in tidak dapat digunakan.') }}
                                    </div>
                                </div>
                            </div>

                            <!-- Locked QR Placeholder (When Pending) -->
                            <div v-else class="flex flex-col items-center justify-center p-6 bg-slate-50/80 rounded-2xl border border-dashed border-slate-300 space-y-3">
                                <div class="size-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
                                    <Icon icon="ph:lock-key-bold" class="text-2xl" />
                                </div>
                                <div class="space-y-1 max-w-[220px]">
                                    <div class="text-xs sm:text-sm font-bold text-slate-800">
                                        {{ t('my_registration.qr_locked_title') }}
                                    </div>
                                    <div class="text-xs sm:text-sm text-slate-500 leading-relaxed">
                                        {{ t('my_registration.qr_locked_desc') }}
                                    </div>
                                </div>
                            </div>

                            <div v-if="isPaid(participant.payment_status)" class="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left space-y-1">
                                <div class="text-xs sm:text-sm font-black text-amber-900 flex items-center gap-1.5">
                                    <Icon icon="ph:info-bold" class="text-sm shrink-0 text-amber-700" />
                                    <span>{{ t('my_registration.important_reregistration_title') }}</span>
                                </div>
                                <div class="text-xs sm:text-sm text-amber-800/90 leading-relaxed font-medium">
                                    {{ t('my_registration.important_reregistration_desc') }}
                                </div>
                            </div>
                        </div>

                        <!-- Section 2: THB Guidebook & Event Info -->
                        <div v-if="event?.technical_guidebook_url" class="border-t border-slate-100 pt-5 text-center space-y-2">
                            <span class="text-xs sm:text-sm text-slate-500 font-medium block">{{ t('my_registration.thb_guidebook') }}</span>
                            <a :href="event.technical_guidebook_url" target="_blank"
                                class="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-bold transition-colors border border-slate-200">
                                <Icon icon="ph:file-pdf-bold" class="text-base text-red-500" />
                                <span>{{ t('my_registration.download_thb_pdf') }}</span>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </template>

        <div v-else class="py-16 text-center bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div class="size-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto">
                <Icon icon="ph:ticket-light" class="text-3xl" />
            </div>
            <div>
                <h3 class="text-lg font-bold text-slate-900">{{ t('my_registration.registration_not_found') }}</h3>
                <div class="text-slate-400 text-xs sm:text-sm mt-1">{{ t('my_registration.session_expired_desc') }}</div>
            </div>
            <div>
                <NuxtLink to="/dashboard/archer/tournaments" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-slate-800 transition-colors">
                    {{ t('my_registration.back_to_dashboard') }}
                </NuxtLink>
            </div>
        </div>

        <!-- Cancel Confirmation Dialog -->
        <AppDialog
            v-model:show="showCancelConfirm"
            :title="t('my_registration.cancel_confirm_title', 'Batalkan Pendaftaran?')"
            :message="t('my_registration.cancel_confirm_desc', 'Apakah Anda yakin ingin membatalkan pendaftaran turnamen ini? Tagihan yang belum dibayar akan dibatalkan.')"
            type="danger"
            icon="ph:warning-bold"
            :confirmText="t('my_registration.cancel_confirm_btn', 'Ya, Batalkan')"
            :cancelText="t('common.cancel', 'Batal')"
            :loading="isCancelling"
            @confirm="handleCancelRegistration"
        />

        <!-- Image Preview Dialog -->
        <AppDialog v-model:show="showImageDialog" :title="t('my_registration.payment_proof_title', 'Bukti Transfer')" message="" type="info" icon="ph:image-bold">
            <div class="flex justify-center p-2">
                <img :src="selectedImage" class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md" />
            </div>
        </AppDialog>
    </div>
</template>

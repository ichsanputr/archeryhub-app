<script setup>
import { Icon } from '@iconify/vue'
import QrcodeVue from 'qrcode.vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'
import { getImageUrl, useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({
    layout: 'dashboard'
})

const { t } = useI18n()
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
const showCancelConfirm = ref(false)
const isCancelling = ref(false)

const parseInstructionGroups = (raw) => {
    if (!raw) return []
    try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
            return parsed
                .map(group => ({
                    title: group.title || '',
                    steps: Array.isArray(group.steps) ? group.steps : []
                }))
                .filter(g => g.steps.length > 0)
        }
    } catch {
        // Not JSON
    }
    return []
}

const handleTransactionPayment = async (transaction) => {
    if (!transaction) return
    if (transaction.checkout_url) {
        window.open(transaction.checkout_url, '_blank')
        if (transaction.reference) {
            navigateTo(`/dashboard/archer/payments/${transaction.reference}`)
        }
    } else if (transaction.reference) {
        navigateTo(`/dashboard/archer/payments/${transaction.reference}`)
    }
}

const cancelRegistration = async () => {
    isCancelling.value = true
    try {
        await del(`/tournaments/${eventId}/participants/me`)
        showCancelConfirm.value = false
        toast.success(t('my_registration.toast_cancel_success'))
        navigateTo('/dashboard/archer/tournaments')
    } catch (e) {
        console.error('Failed to cancel registration:', e)
        toast.error(t('my_registration.toast_cancel_failed'))
    } finally {
        isCancelling.value = false
    }
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
    const s = (status || '').toLowerCase()
    return ['paid', 'lunas', 'registered', 'terdaftar', 'success', 'completed'].includes(s)
}

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

    if (participant.value.registration_source === 'invited') {
        if (txUserId && currentUserId && txUserId !== currentUserId) {
            return false
        }
    }

    return true
})

const isDelegatedByOther = computed(() => {
    return !isInvoiceOwner.value || (participant.value?.registration_source === 'invited' && !isInvoiceOwner.value)
})

// Re-upload proof state
const showReuploadModal = ref(false)
const reuploadSenderName = ref('')
const reuploadFileUrl = ref('')
const reuploadPreviewUrl = ref('')
const isReuploading = ref(false)
const reuploadFileInputRef = ref(null)

const triggerReuploadFileInput = () => {
    reuploadFileInputRef.value?.click()
}

const handleReuploadFileChange = async (evt) => {
    const file = evt.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
        toast.error(t('archer_payment_detail.toast_file_limit', 'Ukuran berkas maksimal 5MB'))
        return
    }
    reuploadPreviewUrl.value = URL.createObjectURL(file)
    isReuploading.value = true
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('caption', `proof-reupload-${participant.value?.transaction?.reference || eventId}-${Date.now()}`)
        const res = await upload('/media/upload', formData)
        reuploadFileUrl.value = res.url || res.URL || ''
        toast.success(t('archer_payment_detail.toast_file_uploaded', 'Bukti berhasil diunggah'))
    } catch (err) {
        toast.error(t('archer_payment_detail.toast_upload_error', 'Gagal mengunggah berkas: ') + (err?.data?.error || err?.message || 'Error'))
        reuploadPreviewUrl.value = ''
    } finally {
        isReuploading.value = false
    }
}

const submitReuploadProof = async () => {
    const refCode = participant.value?.transaction?.reference
    if (!refCode) {
        toast.error(t('my_registration.toast_no_transaction', 'Data transaksi tidak ditemukan'))
        return
    }
    if (!reuploadFileUrl.value || !reuploadSenderName.value.trim()) {
        toast.warning(t('archer_payment_detail.toast_fill_required', 'Mohon lengkapi nama pengirim dan pilih berkas'))
        return
    }
    isReuploading.value = true
    try {
        await post(`/payment/manual/${refCode}/upload-proof`, {
            proof_url: reuploadFileUrl.value,
            sender_name: reuploadSenderName.value.trim()
        })
        toast.success(t('archer_payment_detail.toast_proof_sent', 'Bukti pembayaran berhasil dikirim'))
        showReuploadModal.value = false
        reuploadFileUrl.value = ''
        reuploadPreviewUrl.value = ''
        reuploadSenderName.value = ''
        await fetchInitialData()
    } catch (err) {
        toast.error(err?.data?.error || t('archer_payment_detail.toast_proof_failed', 'Gagal mengirim bukti'))
    } finally {
        isReuploading.value = false
    }
}

const primaryCategory = computed(() => {
    if (participant.value?.categories && participant.value.categories.length > 0) {
        return participant.value.categories[0]
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
    <div class="flex flex-col gap-6 md:gap-8 pb-16">
        <!-- Header (Standard Dashboard Navy Style) -->
        <div
            class="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/5 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5 blur-3xl"></div>

            <div class="relative p-6 sm:p-8">
                <div class="flex items-center gap-2 text-xs sm:text-sm text-white/70 mb-3">
                    <NuxtLink to="/dashboard/archer/tournaments" class="hover:text-white transition-colors">
                        {{ t('my_registration.my_events') }}
                    </NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-xs" />
                    <span class="text-white/90 font-medium">{{ t('my_registration.registration_status') }}</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-start gap-4">
                        <div class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md shrink-0">
                            <Icon icon="ph:ticket-bold" class="text-white text-2xl" />
                        </div>
                        <div class="min-w-0">
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white">
                                {{ t('my_registration.page_title') }}
                            </h1>
                            <div class="text-slate-300 text-xs sm:text-sm mt-1.5">
                                {{ t('my_registration.header_subtitle') }}
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2.5 shrink-0">
                        <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/overview`"
                            class="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-bold text-white backdrop-blur-sm transition-colors shadow-xs">
                            <Icon icon="ph:arrow-left-bold" class="text-xs" />
                            <span>{{ t('my_registration.back_to_overview') }}</span>
                        </NuxtLink>
                        <!-- Only show Cancel Registration if the registration/tournament is 100% free and user is the invoice owner -->
                        <div v-if="participant && isFreeRegistration && !isDelegatedByOther && participant.registration_source !== 'invited'">
                            <BaseButton variant="danger" @click="showCancelConfirm = true" :loading="isCancelling"
                                class="h-10 px-4 text-xs sm:text-sm font-bold shadow-md shadow-red-500/20">
                                <Icon icon="ph:x-circle-bold" class="mr-1.5" />
                                {{ t('my_registration.cancel') }}
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>

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
                    
                    <!-- Left Column (2 cols): Athlete Profile, Metrics, Target & Categories -->
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
                                        <span v-if="isPaid(participant.payment_status)"
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs sm:text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {{ t('my_registration.paid') }}
                                        </span>
                                        <span v-else-if="participant.transaction?.status === 'rejected' || participant.payment_status === 'rejected'"
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs sm:text-sm font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                            Pembayaran Ditolak
                                        </span>
                                        <span v-else-if="participant.transaction?.status === 'awaiting_verification' || participant.payment_status === 'awaiting_verification'"
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs sm:text-sm font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                            Menunggu Verifikasi
                                        </span>
                                        <span v-else
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs sm:text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                            Menunggu Pembayaran
                                        </span>
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
                                    <span class="text-slate-500 block mb-1 font-medium text-xs sm:text-sm">{{ t('my_registration.bib_number') }}</span>
                                    <span class="text-slate-900 font-black text-sm sm:text-base font-mono">
                                        {{ participant.bib_number || participant.athlete_code || ('#' + (participant.id || '101')) }}
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
                                    <span class="font-bold text-sm sm:text-base block" :class="participant.last_reregistration_at ? 'text-emerald-700' : 'text-slate-600'">
                                        {{ participant.last_reregistration_at ? t('my_registration.checked_in') : t('my_registration.not_checked_in') }}
                                    </span>
                                </div>

                                <div class="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 text-center">
                                    <span class="text-slate-500 block mb-1 font-medium text-xs sm:text-sm">{{ t('my_registration.target_number') }}</span>
                                    <span class="text-slate-900 font-black text-sm sm:text-base truncate block" :title="targetSummaryText">
                                        {{ targetSummaryText }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Section 2: Registered Categories -->
                        <div class="border-t border-slate-100 pt-6 space-y-3.5">
                            <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
                                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Icon icon="ph:stack-bold" class="text-slate-500 text-lg" />
                                    <span>{{ t('my_registration.registered_categories') }}</span>
                                </h3>
                                <span class="text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                                    {{ participant.categories?.length || 1 }} {{ (participant.categories?.length || 1) === 1 ? t('my_registration.category_unit_single') : t('my_registration.categories_unit') }}
                                </span>
                            </div>

                            <div class="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                                <div v-for="cat in participant.categories" :key="cat.id"
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

                    </div>

                    <!-- Right Column (1 col): QR Pass, Payment Info & THB Guide -->
                    <div class="lg:col-span-1 space-y-6 lg:border-l lg:border-slate-100 lg:pl-8 lg:pt-0">

                        <!-- Section 1: Official Field Check-in QR Pass -->
                        <div class="space-y-3.5 text-center">
                            <div class="flex items-center justify-between text-xs sm:text-sm pb-2.5 border-b border-slate-100">
                                <span class="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                                    <Icon icon="ph:qr-code-bold" class="text-slate-700 text-base" />
                                    <span>{{ t('my_registration.qr_checkin_badge') }}</span>
                                </span>
                                <span v-if="isPaid(participant.payment_status)" class="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-xs sm:text-sm">
                                    {{ t('my_registration.ready_to_compete') }}
                                </span>
                                <span v-else class="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-xs sm:text-sm">
                                    {{ t('my_registration.qr_locked_unpaid_badge') }}
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

                            <!-- Locked QR Placeholder (When Pending / Unpaid) -->
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

                        <!-- Section 2: Payment Details -->
                        <div class="border-t border-slate-100 pt-5 space-y-3.5">
                            <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
                                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Icon icon="ph:credit-card-bold" class="text-slate-500 text-lg" />
                                    <span>{{ t('my_registration.payment_details_title') }}</span>
                                </h3>
                            </div>

                            <div class="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2.5 text-xs sm:text-sm">
                                <div class="flex justify-between items-center">
                                    <span class="text-slate-500 font-medium">{{ t('my_registration.total_bill') }}</span>
                                    <span class="text-base sm:text-lg font-black text-slate-900">
                                        Rp {{ formatCurrency(participant.payment_amount) }}
                                    </span>
                                </div>
                                <div v-if="participant.transaction?.reference" class="flex justify-between items-center pt-2 border-t border-slate-200/60">
                                    <span class="text-slate-500 font-medium">{{ t('my_registration.invoice_no') }}</span>
                                    <NuxtLink :to="`/dashboard/archer/payments/${participant.transaction.reference}`"
                                        class="font-mono font-bold text-slate-900 hover:text-slate-700 transition-colors flex items-center gap-1 text-xs sm:text-sm">
                                        <span>{{ participant.transaction.reference }}</span>
                                        <Icon icon="ph:arrow-square-out-bold" class="text-xs text-slate-400" />
                                    </NuxtLink>
                                </div>
                                <div v-if="participant.transaction?.payment_method" class="flex justify-between items-center">
                                    <span class="text-slate-500 font-medium">{{ t('my_registration.method') }}</span>
                                    <span class="font-bold text-slate-900 text-xs sm:text-sm">
                                        {{ participant.transaction.payment_method }}
                                    </span>
                                </div>
                            </div>

                            <!-- Uploaded Proof Preview (If exists) -->
                            <div v-if="participantProofUrl" class="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 space-y-2">
                                <div class="flex items-center justify-between text-xs sm:text-sm">
                                    <span class="font-bold text-slate-800 flex items-center gap-1.5">
                                        <Icon icon="ph:image-square-bold" class="text-slate-500 text-sm sm:text-base" />
                                        <span>{{ t('my_registration.payment_proof_title') }}</span>
                                    </span>
                                    <span v-if="participant.transaction?.sender_name" class="text-xs sm:text-sm text-slate-500 font-medium truncate max-w-[130px]" :title="participant.transaction.sender_name">
                                        {{ t('my_registration.sender_account_holder') }} {{ participant.transaction.sender_name }}
                                    </span>
                                </div>
                                <div
                                    @click="openImage(participantProofUrl)"
                                    class="group relative h-28 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-900/5 cursor-pointer shadow-2xs flex items-center justify-center hover:border-slate-400 transition-all"
                                >
                                    <img :src="participantProofUrl" alt="Bukti Transfer" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
                                    class="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs">
                                    <Icon icon="ph:receipt-bold" class="text-base text-slate-700" />
                                    <span>{{ t('my_registration.view_payment_detail') }}</span>
                                </NuxtLink>
                            </div>

                            <!-- Case 2: Rejected (Ditolak Panitia) -->
                            <div v-else-if="participant.transaction?.status === 'rejected' || participant.payment_status === 'rejected'" class="space-y-2.5 pt-1">
                                <div class="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-left">
                                    <div class="text-xs sm:text-sm font-bold text-rose-800 flex items-center gap-1.5">
                                        <Icon icon="ph:warning-circle-bold" class="text-base shrink-0 text-rose-600" />
                                        <span>Bukti Transfer Ditolak Panitia</span>
                                    </div>
                                    <div class="text-xs text-rose-700 leading-relaxed font-medium">
                                        Panitia turnamen menolak bukti transfer sebelumnya. Silakan unggah bukti transfer baru yang sah.
                                    </div>
                                    <div v-if="participant.transaction?.rejection_reason" class="p-2.5 bg-white/90 rounded-lg border border-rose-200 text-xs text-rose-900">
                                        <span class="font-bold block text-rose-950 mb-0.5">Alasan:</span>
                                        <span class="italic font-medium">"{{ participant.transaction.rejection_reason }}"</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    @click="showReuploadModal = true"
                                    class="w-full py-2.5 px-3 rounded-xl bg-rose-600 text-white hover:bg-rose-700 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer">
                                    <Icon icon="ph:upload-simple-bold" class="text-sm" />
                                    <span>Unggah Ulang Bukti Transfer</span>
                                </button>
                            </div>

                            <!-- Case 3: Awaiting Verification (Menunggu Verifikasi Panitia) -->
                            <div v-else-if="participant.transaction?.status === 'awaiting_verification' || participant.payment_status === 'awaiting_verification' || (participantProofUrl && !isPaid(participant.payment_status))" class="space-y-2.5 pt-1">
                                <!-- Delegation notice if registered by another account -->
                                <div v-if="isDelegatedByOther" class="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl space-y-1.5 text-left">
                                    <div class="text-xs sm:text-sm font-bold text-blue-900 flex items-center gap-1.5">
                                        <Icon icon="ph:users-three-bold" class="text-base shrink-0 text-blue-600" />
                                        <span>{{ t('my_registration.delegation_registration_title') }}</span>
                                    </div>
                                    <div class="text-xs text-blue-800 leading-relaxed font-medium">
                                        {{ t('my_registration.delegation_registered_by', { name: participant.transaction?.registered_by_name || participant.transaction?.payer_name || 'Perwakilan / Klub' }) }}
                                    </div>
                                    <div class="text-[11px] text-blue-700/80 pt-0.5">
                                        {{ t('my_registration.awaiting_verification_desc') }}
                                    </div>
                                </div>

                                <!-- Self registered owner options -->
                                <template v-else>
                                    <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-left">
                                        <div class="text-xs sm:text-sm font-bold text-amber-800 flex items-center gap-1.5">
                                            <Icon icon="ph:hourglass-medium-bold" class="text-sm shrink-0" />
                                            <span>{{ t('my_registration.awaiting_verification_title') }}</span>
                                        </div>
                                        <div class="text-xs sm:text-sm text-amber-700/90 leading-relaxed font-medium">
                                            {{ t('my_registration.awaiting_verification_desc') }}
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <button
                                            type="button"
                                            @click="showReuploadModal = true"
                                            class="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                                            <Icon icon="ph:arrows-clockwise-bold" class="text-sm" />
                                            <span>{{ t('my_registration.btn_change_proof') }}</span>
                                        </button>
                                        <NuxtLink :to="`/dashboard/archer/payments/${participant.transaction?.reference || ''}`"
                                            class="flex-1 py-2.5 px-3 rounded-xl bg-navy text-white hover:bg-navy/90 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs">
                                            <Icon icon="ph:receipt-bold" class="text-sm" />
                                            <span>{{ t('my_registration.btn_invoice_detail') }}</span>
                                        </NuxtLink>
                                    </div>
                                </template>
                            </div>

                            <!-- Case 4: Pending Unpaid with Existing Transaction -->
                            <div v-else-if="!isPaid(participant.payment_status) && participant.transaction" class="space-y-2 pt-1">
                                <!-- Delegation notice if registered by another account -->
                                <div v-if="isDelegatedByOther" class="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl space-y-1.5 text-left">
                                    <div class="text-xs sm:text-sm font-bold text-blue-900 flex items-center gap-1.5">
                                        <Icon icon="ph:users-three-bold" class="text-base shrink-0 text-blue-600" />
                                        <span>{{ t('my_registration.delegation_registration_title') }}</span>
                                    </div>
                                    <div class="text-xs text-blue-800 leading-relaxed font-medium">
                                        {{ t('my_registration.delegation_registered_by', { name: participant.transaction?.registered_by_name || participant.transaction?.payer_name || 'Perwakilan / Klub' }) }}
                                    </div>
                                </div>

                                <!-- Self registered owner payment buttons -->
                                <template v-else>
                                    <!-- Online Gateway Checkout Button (Direct to Mayar/PayPal) -->
                                    <a
                                        v-if="participant.transaction.checkout_url"
                                        :href="participant.transaction.checkout_url"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-navy text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <Icon :icon="participant.transaction.payment_method?.toLowerCase() === 'paypal' ? 'logos:paypal' : 'ph:credit-card-bold'" class="text-base" />
                                        <span>{{ participant.transaction.payment_method?.toLowerCase() === 'paypal' ? t('archer_payment_detail.btn_pay_paypal') : t('archer_payment_detail.btn_pay_mayar') }}</span>
                                        <Icon icon="ph:arrow-square-out-bold" class="text-xs" />
                                    </a>

                                    <!-- Manual Bank Transfer or Fallback to Internal Payment Page -->
                                    <NuxtLink
                                        v-else
                                        :to="`/dashboard/archer/payments/${participant.transaction.reference}`"
                                        class="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-navy text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <Icon icon="ph:credit-card-bold" class="text-base" />
                                        <span>{{ participant.transaction.payment_method === 'manual' ? t('my_registration.complete_transfer_upload') : t('my_registration.pay_now') }}</span>
                                        <Icon icon="ph:arrow-right-bold" class="text-xs" />
                                    </NuxtLink>

                                    <!-- Bill Details: Always navigates to internal receipt/invoice page -->
                                    <NuxtLink :to="`/dashboard/archer/payments/${participant.transaction.reference}`"
                                        class="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5">
                                        <Icon icon="ph:receipt-bold" class="text-xs" />
                                        <span>{{ t('my_registration.bill_detail') }}</span>
                                    </NuxtLink>
                                </template>
                            </div>

                            <!-- Case 4: Pending Unpaid without Transaction -->
                            <div v-else-if="!isPaid(participant.payment_status) && !participant.transaction && !isDelegatedByOther">
                                <BaseButton variant="primary" block @click="initiatePaymentGateway"
                                    :loading="isProcessingPayment" class="h-11 text-xs sm:text-sm font-bold justify-center">
                                    <Icon icon="ph:lightning-bold" class="text-base mr-1.5" />
                                    <span>{{ t('my_registration.pay_online_auto') }}</span>
                                </BaseButton>
                            </div>

                            <!-- Cancellation Button (only when unpaid and self-registered owner) -->
                            <div v-if="!isPaid(participant.payment_status) && !isDelegatedByOther && participant.registration_source !== 'invited'" class="pt-2">
                                <button
                                    type="button"
                                    @click="showCancelConfirm = true"
                                    class="w-full py-2 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <Icon icon="ph:trash-bold" class="text-xs" />
                                    <span>{{ t('my_registration.cancel_registration_btn') }}</span>
                                </button>
                            </div>
                        </div>

                        <!-- Section 3: THB Guidebook & Event Info -->
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
        <AppDialog v-model:show="showCancelConfirm" :title="t('my_registration.cancel_dialog_title')"
            :message="t('my_registration.cancel_dialog_desc')"
            type="danger" icon="ph:warning-circle-bold"
            :confirm-text="t('my_registration.cancel_dialog_confirm')"
            :cancel-text="t('my_registration.cancel_dialog_back')" @confirm="cancelRegistration" />

        <!-- Image Preview Dialog -->
        <AppDialog v-model:show="showImageDialog" :title="t('my_registration.payment_proof_title')" message="" type="info" icon="ph:image-bold">
            <div class="flex justify-center p-2">
                <img :src="selectedImage" class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md" />
            </div>
        </AppDialog>

        <!-- Re-upload Proof Modal -->
        <div v-if="showReuploadModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150" @click.self="showReuploadModal = false">
            <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
                <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div class="flex items-center gap-2.5">
                        <div class="size-10 rounded-2xl bg-navy/5 text-navy flex items-center justify-center font-black">
                            <Icon icon="ph:upload-simple-bold" class="text-xl" />
                        </div>
                        <div>
                            <h4 class="font-black text-navy text-base">Unggah Bukti Transfer</h4>
                            <div class="text-xs text-slate-400 font-mono">{{ participant?.transaction?.reference || 'Transfer Manual' }}</div>
                        </div>
                    </div>
                    <button type="button" @click="showReuploadModal = false" class="size-8 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-navy flex items-center justify-center transition-colors cursor-pointer">
                        <Icon icon="ph:x-bold" class="text-base" />
                    </button>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-xs sm:text-sm font-bold text-navy mb-1.5">Nama Pemilik Rekening Pengirim <span class="text-rose-500">*</span></label>
                        <input
                            v-model="reuploadSenderName"
                            type="text"
                            placeholder="cth. Budi Santoso (sesuai nama di rekening/struk)"
                            class="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:bg-white focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all text-navy"
                        />
                    </div>

                    <div>
                        <label class="block text-xs sm:text-sm font-bold text-navy mb-1.5">Berkas Bukti Transfer (Foto / PDF) <span class="text-rose-500">*</span></label>
                        <input ref="reuploadFileInputRef" type="file" accept="image/*,.pdf" class="hidden" @change="handleReuploadFileChange" />

                        <div v-if="isReuploading" class="p-6 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 flex flex-col items-center justify-center text-center gap-2">
                            <Icon icon="ph:spinner-gap-bold" class="text-2xl text-navy animate-spin" />
                            <div class="text-xs sm:text-sm font-bold text-navy">Mengunggah bukti transfer...</div>
                        </div>

                        <div v-else-if="reuploadFileUrl" class="p-4 rounded-2xl border border-emerald-300 bg-emerald-50/60 flex items-center justify-between gap-3">
                            <div class="flex items-center gap-3 min-w-0">
                                <div class="size-12 rounded-xl overflow-hidden bg-white border border-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
                                    <img v-if="!reuploadFileUrl.toLowerCase().endsWith('.pdf')" :src="reuploadPreviewUrl || reuploadFileUrl" class="w-full h-full object-cover" />
                                    <Icon v-else icon="ph:file-pdf-bold" class="text-2xl text-rose-500" />
                                </div>
                                <div class="min-w-0">
                                    <div class="text-xs font-bold text-emerald-800">Berkas Terlampir</div>
                                    <div class="text-[11px] text-slate-500 truncate">Siap dikirim ke panitia</div>
                                </div>
                            </div>
                            <button type="button" @click="triggerReuploadFileInput" class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-navy cursor-pointer">
                                Ganti
                            </button>
                        </div>

                        <div v-else @click="triggerReuploadFileInput" class="border-2 border-dashed border-slate-200 hover:border-navy rounded-2xl p-5 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50 group">
                            <Icon icon="ph:cloud-arrow-up-bold" class="text-2xl text-slate-400 group-hover:text-navy mx-auto mb-1.5 transition-colors" />
                            <div class="text-xs sm:text-sm font-bold text-navy">Klik untuk memilih foto / file PDF struk</div>
                            <div class="text-[11px] text-slate-400 mt-0.5">Format JPG, PNG, WEBP, atau PDF (Maks. 5MB)</div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                    <button type="button" @click="showReuploadModal = false" class="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
                        Batal
                    </button>
                    <button
                        type="button"
                        @click="submitReuploadProof"
                        :disabled="!reuploadFileUrl || !reuploadSenderName.trim() || isReuploading"
                        class="px-5 py-2.5 rounded-xl bg-navy hover:bg-navy/90 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer">
                        <Icon v-if="isReuploading" icon="ph:spinner-bold" class="animate-spin text-sm" />
                        <span>Kirim Bukti Pembayaran</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import QrcodeVue from 'qrcode.vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { getImageUrl, useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({
    layout: 'dashboard'
})

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const { get, post, upload, delete: del } = useApi()
const eventId = route.params.id

useHead({
    title: computed(() => `${t('my_registration.title', 'Pendaftaran & Tiket')} - Archeris Dashboard`)
})

const isLoading = ref(true)
const participant = ref(null)
const event = ref(null)

const showImageDialog = ref(false)
const selectedImage = ref('')

const isProcessingPayment = ref(false)
const showCancelConfirm = ref(false)
const isCancelling = ref(false)
const activeInstructionGroup = ref(0)

const uploadingProof = ref(false)
const uploadError = ref('')
const proofFileUrl = ref('')
const senderName = ref('')
const proofInput = ref(null)

const triggerFileInput = () => {
    proofInput.value?.click()
}

const handleProofUpload = async (evt) => {
    const file = evt.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
        uploadError.value = 'Ukuran file terlalu besar. Maksimal 10MB.'
        return
    }

    uploadingProof.value = true
    uploadError.value = ''
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('caption', `proof-manual-${participant.value?.id || 'reg'}-${Date.now()}`)

        const res = await upload('/media/upload', formData)
        proofFileUrl.value = res.url || res.URL || ''
    } catch (err) {
        uploadError.value = err.response?.data?.error || err.data?.error || err.message || 'Gagal mengunggah gambar.'
    } finally {
        uploadingProof.value = false
    }
}

const submitManualProof = async () => {
    if (!proofFileUrl.value) {
        uploadError.value = 'Silakan pilih bukti transfer terlebih dahulu.'
        return
    }
    uploadingProof.value = true
    uploadError.value = ''
    try {
        const txRef = participant.value?.transaction?.reference
        await post(`/payment/manual/${txRef}/upload-proof`, {
            proof_url: proofFileUrl.value,
            sender_name: senderName.value
        })
        toast.success('Bukti pembayaran berhasil dikirim')
        await fetchInitialData()
    } catch (err) {
        uploadError.value = err.response?.data?.error || err.data?.error || err.message || 'Gagal mengirim bukti.'
    } finally {
        uploadingProof.value = false
    }
}

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
            navigateTo(`/payment/status/${transaction.reference}`)
        }
    } else if (transaction.reference) {
        navigateTo(`/payment/status/${transaction.reference}`)
    }
}

const cancelRegistration = async () => {
    isCancelling.value = true
    try {
        await del(`/events/${eventId}/participants/me`)
        showCancelConfirm.value = false
        toast.success(t('my_registration.toast_cancel_success', 'Pendaftaran berhasil dibatalkan'))
        navigateTo('/dashboard/archer/events')
    } catch (e) {
        console.error('Failed to cancel registration:', e)
        toast.error(t('my_registration.toast_cancel_failed', 'Gagal membatalkan pendaftaran'))
    } finally {
        isCancelling.value = false
    }
}

const initiatePaymentGateway = async () => {
    isProcessingPayment.value = true
    try {
        const response = await post(`/events/${eventId}/participants/me/checkout`)
        if (response?.checkout_url || response?.transaction_id || response?.reference) {
            await handleTransactionPayment(response)
            await fetchInitialData()
        }
    } catch (e) {
        console.error('Failed to initiate checkout:', e)
        toast.error(t('my_registration.toast_payment_failed', 'Gagal memulai proses pembayaran'))
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

const primaryCategory = computed(() => {
    if (participant.value?.categories && participant.value.categories.length > 0) {
        return participant.value.categories[0]
    }
    return null
})

const fetchInitialData = async () => {
    isLoading.value = true
    try {
        const [detailed, evRes] = await Promise.all([
            get(`/events/${eventId}/participants/me`),
            get(`/events/${eventId}`).catch(() => null)
        ])
        participant.value = detailed?.data || detailed
        event.value = evRes?.data || evRes
        if (participant.value?.transaction) {
            if (participant.value.transaction.sender_name) {
                senderName.value = participant.value.transaction.sender_name
            }
            if (participant.value.transaction.proof_url) {
                proofFileUrl.value = participant.value.transaction.proof_url
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
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

            <div class="relative p-6 sm:p-8">
                <div class="flex items-center gap-2 text-xs text-white/60 mb-3">
                    <NuxtLink to="/dashboard/archer/events" class="hover:text-white transition-colors">
                        {{ t('my_registration.my_events', 'Event Saya') }}
                    </NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[10px]" />
                    <span class="text-primary font-medium">{{ t('my_registration.registration_status', 'Pendaftaran & Tiket') }}</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-start gap-4">
                        <div class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md shrink-0">
                            <Icon icon="ph:ticket-bold" class="text-primary text-2xl" />
                        </div>
                        <div class="min-w-0">
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white">
                                {{ t('my_registration.page_title', 'Detail Pendaftaran & Tiket Pertandingan') }}
                            </h1>
                            <div class="text-slate-300 text-xs mt-1">
                                {{ t('my_registration.header_subtitle', 'Kelola informasi pendaftaran, penugasan target bantalan, dan pass tiket resmi Anda.') }}
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2.5 shrink-0">
                        <NuxtLink :to="`/dashboard/archer/events/${eventId}/overview`"
                            class="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white backdrop-blur-sm transition-colors shadow-xs">
                            <Icon icon="ph:arrow-left-bold" class="text-xs" />
                            <span>{{ t('my_registration.back_to_overview', 'Ringkasan Event') }}</span>
                        </NuxtLink>
                        <div v-if="participant && !isPaid(participant.payment_status)">
                            <BaseButton variant="danger" @click="showCancelConfirm = true" :loading="isCancelling"
                                class="h-10 px-4 text-xs font-bold shadow-md shadow-red-500/20">
                                <Icon icon="ph:x-circle-bold" class="mr-1.5" />
                                {{ t('my_registration.cancel', 'Batalkan Pendaftaran') }}
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
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <!-- Left Column (2 cols): All-in-One White Card -->
                <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">

                    <!-- Section 1: Athlete Pass Header & Metrics -->
                    <div class="space-y-6">
                        <div class="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-slate-100">
                            <div class="size-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                <img :src="useImageOrDefault(participant.avatar_url || participant.avatar, participant.full_name)"
                                    :alt="participant.full_name" class="w-full h-full object-cover" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex flex-wrap items-center gap-3">
                                    <h2 class="text-lg font-bold text-slate-900 truncate">{{ participant.full_name }}</h2>
                                    <span v-if="isPaid(participant.payment_status)"
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        {{ t('my_registration.paid', 'Terdaftar & Lunas') }}
                                    </span>
                                    <span v-else
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                        {{ t('my_registration.pending', 'Menunggu Pembayaran') }}
                                    </span>
                                </div>
                                <div class="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                                    <span class="font-semibold text-slate-700">{{ participant.club_name || t('my_registration.independent', 'Klub Independen') }}</span>
                                    <span>•</span>
                                    <span class="font-mono text-slate-600">{{ participant.athlete_code || ('ARC-' + (participant.archer_id || '').substring(0, 6).toUpperCase()) }}</span>
                                    <span>•</span>
                                    <span class="truncate">{{ participant.email }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- 4-Grid Athlete Pass Metrics -->
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <span class="text-slate-400 block mb-1 font-medium capitalize">{{ t('my_registration.bib_number', 'Nomor Dada (Bib)') }}</span>
                                <span class="text-slate-900 font-black text-base font-mono">
                                    {{ participant.bib_number || participant.athlete_code || ('#' + (participant.id || '101')) }}
                                </span>
                            </div>

                            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <span class="text-slate-400 block mb-1 font-medium capitalize">{{ t('my_registration.bow_division', 'Divisi Busur') }}</span>
                                <span class="text-slate-900 font-bold text-sm truncate block">
                                    {{ primaryCategory?.division_name || participant.bow_type || 'Recurve' }}
                                </span>
                            </div>

                            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <span class="text-slate-400 block mb-1 font-medium capitalize">{{ t('my_registration.reregistration_status', 'Daftar Ulang') }}</span>
                                <span class="font-bold text-sm block" :class="participant.last_reregistration_at ? 'text-emerald-700' : 'text-slate-500'">
                                    {{ participant.last_reregistration_at ? t('my_registration.checked_in', 'Sudah Check-in') : t('my_registration.not_checked_in', 'Belum Check-in') }}
                                </span>
                            </div>

                            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <span class="text-slate-400 block mb-1 font-medium capitalize">{{ t('my_registration.target_number', 'Bantalan') }}</span>
                                <span class="text-slate-900 font-black text-base truncate block">
                                    {{ participant.target_number || primaryCategory?.target_name || t('my_registration.tba', 'Akan Diumumkan') }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Section 2: Target & Session Details -->
                    <div class="border-t border-slate-100 pt-6 space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Icon icon="ph:crosshair-bold" class="text-slate-500 text-base" />
                                <span>{{ t('my_registration.target_session_info', 'Penugasan Target & Sesi Kualifikasi') }}</span>
                            </h3>
                            <span class="text-xs text-slate-400 font-medium capitalize">
                                {{ event?.name || 'Turnamen Panahan' }}
                            </span>
                        </div>

                        <div class="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                            <div class="p-3.5 flex justify-between items-center bg-slate-50/50">
                                <span class="text-slate-500 font-medium capitalize">{{ t('my_registration.assigned_target', 'Bantalan Sasaran') }}</span>
                                <span class="font-bold text-slate-900">
                                    {{ participant.target_number ? `${participant.target_number}${participant.target_face || ''}` : (primaryCategory?.target_name || t('my_registration.target_unassigned', 'Belum Ditentukan Panitia')) }}
                                </span>
                            </div>
                            <div class="p-3.5 flex justify-between items-center">
                                <span class="text-slate-500 font-medium capitalize">{{ t('my_registration.qualification_session', 'Gelombang / Sesi Tanding') }}</span>
                                <span class="font-bold text-slate-900">
                                    {{ participant.session_name || t('my_registration.session_default', 'Sesi 1 (Jadwal Reguler)') }}
                                </span>
                            </div>
                            <div class="p-3.5 flex justify-between items-center bg-slate-50/50">
                                <span class="text-slate-500 font-medium capitalize">{{ t('my_registration.target_specs', 'Jarak & Ukuran Target Face') }}</span>
                                <span class="font-semibold text-slate-700">
                                    {{ primaryCategory?.distance ? `${primaryCategory.distance}m` : '50m' }} • {{ primaryCategory?.target_face || 'Target Face 80cm 6-ring' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Section 3: Registered Categories -->
                    <div class="border-t border-slate-100 pt-6 space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Icon icon="ph:stack-bold" class="text-slate-500 text-base" />
                                <span>{{ t('my_registration.registered_categories', 'Kategori Turnamen yang Diikuti') }}</span>
                            </h3>
                            <span class="text-xs text-slate-400 font-medium">
                                {{ participant.categories?.length || 1 }} Kategori
                            </span>
                        </div>

                        <div class="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                            <div v-for="cat in participant.categories" :key="cat.id"
                                class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                                <div>
                                    <div class="text-sm font-bold text-slate-900">
                                        {{ cat.category_name }}
                                    </div>
                                    <div class="text-xs text-slate-400 mt-0.5">
                                        {{ cat.division_name }} <span v-if="cat.event_type_name">•</span> {{ cat.event_type_name }}
                                    </div>
                                </div>
                                <div class="flex sm:flex-col items-center sm:items-end justify-between text-xs">
                                    <span class="text-slate-400 font-medium">{{ t('my_registration.fee', 'Biaya') }}</span>
                                    <span class="font-bold text-slate-900">Rp {{ formatCurrency(cat.payment_amount || cat.fee) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Right Column (1 col): All-in-One White Card -->
                <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">

                    <!-- Section 1: Official Field Check-in QR Pass -->
                    <div class="space-y-4 text-center">
                        <div class="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                            <span class="font-black text-navy uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                <Icon icon="ph:qr-code-bold" class="text-primary text-sm" />
                                <span>QR Registrasi Ulang</span>
                            </span>
                            <span v-if="isPaid(participant.payment_status)" class="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px]">
                                ✓ Siap Tanding
                            </span>
                            <span v-else class="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[10px]">
                                Menunggu Pembayaran
                            </span>
                        </div>

                        <div class="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                            <img :src="`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(participant?.qr_raw || ('ARCHERIS-CHECKIN:' + (participant?.archer_id || eventId)))}&size=200x200&color=051923`"
                                alt="QR Registrasi Ulang" class="w-44 h-44 rounded-xl p-2.5 bg-white border border-slate-200 shadow-xs" />
                            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy text-primary text-[11px] font-black font-mono">
                                <span>{{ participant.athlete_code || ('ARC-' + (participant.archer_id || '').substring(0, 6).toUpperCase()) }}</span>
                            </div>
                        </div>

                        <div class="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left space-y-1">
                            <div class="text-[11px] font-black text-amber-900 flex items-center gap-1.5">
                                <Icon icon="ph:info-bold" class="text-xs shrink-0 text-amber-700" />
                                <span>Penting untuk Registrasi Ulang</span>
                            </div>
                            <p class="text-[11px] text-amber-800/90 leading-relaxed font-medium">
                                Tunjukkan QR Code ini kepada panitia meja registrasi saat verifikasi alat di venue untuk konfirmasi kehadiran (Check-in) dan penugasan bantalan tanding.
                            </p>
                        </div>
                    </div>

                    <!-- Section 2: Payment Details -->
                    <div class="border-t border-slate-100 pt-6 space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Icon icon="ph:credit-card-bold" class="text-slate-500 text-base" />
                                <span>{{ t('my_registration.payment_details_title', 'Informasi Pembayaran') }}</span>
                            </h3>
                            <span :class="isPaid(participant.payment_status) ? 'text-emerald-700' : 'text-amber-700'"
                                class="text-xs font-bold capitalize">
                                {{ isPaid(participant.payment_status) ? t('my_registration.paid', 'Lunas') : t('my_registration.pending', 'Menunggu Pembayaran') }}
                            </span>
                        </div>

                        <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                            <div class="flex justify-between items-center">
                                <span class="text-slate-400 font-medium">{{ t('my_registration.total_bill', 'Total Tagihan') }}</span>
                                <span class="text-base font-black text-slate-900">
                                    Rp {{ formatCurrency(participant.payment_amount) }}
                                </span>
                            </div>
                            <div v-if="participant.transaction?.reference" class="flex justify-between items-center pt-2 border-t border-slate-200/60">
                                <span class="text-slate-400 font-medium">{{ t('my_registration.invoice_no', 'Nomor Invoice') }}</span>
                                <NuxtLink :to="`/payment/status/${participant.transaction.reference}`"
                                    class="font-mono font-bold text-slate-900 hover:text-primary transition-colors flex items-center gap-1">
                                    <span>{{ participant.transaction.reference }}</span>
                                    <Icon icon="ph:arrow-square-out-bold" class="text-xs text-slate-400" />
                                </NuxtLink>
                            </div>
                            <div v-if="participant.transaction?.payment_method" class="flex justify-between items-center">
                                <span class="text-slate-400 font-medium">{{ t('my_registration.method', 'Metode') }}</span>
                                <span class="font-bold text-slate-900 capitalize">
                                    {{ participant.transaction.payment_method }}
                                </span>
                            </div>
                        </div>

                        <!-- Action Button: Open Payment Details -->
                        <div v-if="participant.transaction?.reference">
                            <NuxtLink :to="`/payment/status/${participant.transaction.reference}`"
                                class="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold transition-colors flex items-center justify-center gap-2">
                                <Icon icon="ph:receipt-bold" class="text-base text-primary" />
                                <span>{{ t('my_registration.view_payment_detail', 'Lihat Detail Invoice & Pembayaran') }}</span>
                            </NuxtLink>
                        </div>

                        <!-- If unpaid online: Pay Now Button -->
                        <div v-if="!isPaid(participant.payment_status) && participant.transaction?.status === 'pending'">
                            <BaseButton variant="primary" block class="h-11 text-xs font-bold justify-center"
                                @click="handleTransactionPayment(participant.transaction)">
                                <span>{{ t('my_registration.pay_now', 'Bayar Sekarang') }}</span>
                                <Icon icon="ph:arrow-right-bold" class="ml-1.5" />
                            </BaseButton>
                        </div>

                        <!-- If manual transfer pending upload -->
                        <div v-else-if="!isPaid(participant.payment_status) && participant.transaction?.payment_method === 'manual'" class="space-y-3 pt-2">
                            <div class="space-y-1">
                                <label class="text-xs font-medium text-slate-600 block">{{ t('my_registration.sender_name', 'Nama Pengirim') }}</label>
                                <input type="text" v-model="senderName"
                                    class="w-full h-11 px-4 text-xs font-medium border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    :placeholder="t('my_registration.sender_name_placeholder', 'Nama pemilik rekening pengirim')" />
                            </div>

                            <div @click="triggerFileInput"
                                class="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-slate-50"
                                :class="proofFileUrl ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'">
                                <input type="file" ref="proofInput" class="hidden" accept="image/*" @change="handleProofUpload" />
                                <template v-if="uploadingProof">
                                    <Icon icon="ph:circle-notch-bold" class="text-xl text-slate-700 animate-spin mb-1" />
                                    <span class="text-xs text-slate-500 font-medium">Mengunggah...</span>
                                </template>
                                <template v-else-if="proofFileUrl">
                                    <img :src="proofFileUrl" class="max-h-24 object-contain rounded-lg mb-1 border border-slate-200" />
                                    <span class="text-xs text-emerald-700 font-bold">Bukti Terpilih ✓</span>
                                </template>
                                <template v-else>
                                    <Icon icon="ph:cloud-arrow-up-bold" class="text-xl text-slate-400 mb-1" />
                                    <span class="text-xs text-slate-500 font-medium">Klik untuk Unggah Bukti Transfer</span>
                                </template>
                            </div>

                            <BaseButton variant="primary" block :loading="uploadingProof"
                                class="h-10 text-xs font-bold justify-center" @click="submitManualProof">
                                Kirim Bukti Transfer
                            </BaseButton>

                            <span v-if="uploadError" class="text-xs text-red-500 font-semibold block text-center">{{ uploadError }}</span>
                        </div>

                        <!-- Initiate payment gateway if no transaction yet -->
                        <div v-else-if="!isPaid(participant.payment_status) && !participant.transaction">
                            <BaseButton variant="primary" block @click="initiatePaymentGateway"
                                :loading="isProcessingPayment" class="h-11 text-xs font-bold justify-center">
                                <Icon icon="ph:lightning-bold" class="text-base mr-1.5" />
                                <span>{{ t('my_registration.pay_online_auto', 'Lanjutkan Pembayaran Online') }}</span>
                            </BaseButton>
                        </div>
                    </div>

                    <!-- Section 3: THB Guidebook & Event Info -->
                    <div v-if="event?.technical_guidebook_url" class="border-t border-slate-100 pt-6 text-center space-y-2">
                        <span class="text-xs text-slate-400 font-medium block capitalize">Buku Petunjuk Teknis</span>
                        <a :href="event.technical_guidebook_url" target="_blank"
                            class="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs font-bold transition-colors border border-slate-200">
                            <Icon icon="ph:file-pdf-bold" class="text-base text-red-500" />
                            <span>Unduh THB Resmi (PDF)</span>
                        </a>
                    </div>

                </div>
            </div>
        </template>

        <div v-else class="py-16 text-center bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div class="size-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto">
                <Icon icon="ph:ticket-light" class="text-3xl" />
            </div>
            <div>
                <h3 class="text-lg font-bold text-slate-900">{{ t('my_registration.registration_not_found', 'Data Pendaftaran Tidak Ditemukan') }}</h3>
                <div class="text-slate-400 text-xs mt-1">{{ t('my_registration.session_expired_desc', 'Anda belum terdaftar pada turnamen ini atau sesi telah berakhir.') }}</div>
            </div>
            <div>
                <NuxtLink to="/dashboard/archer/events" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors">
                    {{ t('my_registration.back_to_dashboard', 'Kembali ke Daftar Event') }}
                </NuxtLink>
            </div>
        </div>

        <!-- Cancel Confirmation Dialog -->
        <AppDialog v-model:show="showCancelConfirm" :title="t('my_registration.cancel_dialog_title', 'Batalkan Pendaftaran?')"
            :message="t('my_registration.cancel_dialog_desc', 'Apakah Anda yakin ingin membatalkan pendaftaran ini? Tindakan ini tidak dapat dibatalkan.')"
            type="danger" icon="ph:warning-circle-bold"
            :confirm-text="t('my_registration.cancel_dialog_confirm', 'Ya, Batalkan')"
            :cancel-text="t('my_registration.cancel_dialog_back', 'Kembali')" @confirm="cancelRegistration" />

        <!-- Image Preview Dialog -->
        <AppDialog v-model:show="showImageDialog" title="Bukti Pembayaran" message="" type="info" icon="ph:image-bold">
            <div class="flex justify-center p-2">
                <img :src="selectedImage" class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md" />
            </div>
        </AppDialog>
    </div>
</template>

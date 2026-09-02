<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useImageOrDefault } from '~/composables/useImageHelper'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'

definePageMeta({
    layout: 'dashboard'
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { get, put } = useApi()
const toast = useToast()

const eventId = computed(() => route.params.id)
const archerId = computed(() => route.query.archer_id || route.params.participantId || route.params.archer_id)

const isLoading = ref(true)
const isApproving = ref(false)
const showPremiumModal = ref(false)
const showProofModal = ref(false)
const selectedProofImage = ref(null)

const participant = ref(null)
const categories = ref([])

useHead({
    title: computed(() => `${t('participant.detail.title', 'Detail Peserta')} - Archeris Dashboard`)
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
            get(`/events/${eventId.value}/participants/${archerId.value}`),
            get(`/events/${eventId.value}/categories`)
        ])
        participant.value = partRes.data || partRes
        categories.value = catRes.data || catRes || []
    } catch (err) {
        console.error('Failed to load participant detail:', err)
        toast.error(t('common.error_loading', 'Gagal memuat data peserta'))
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

const handleApprovePayment = async () => {
    isApproving.value = true
    try {
        await put(`/events/${eventId.value}/participants/${archerId.value}`, {
            payment_status: 'paid'
        })
        toast.success(t('participant.detail.approve_success', 'Pembayaran berhasil disetujui'))
        if (participant.value) {
            participant.value.payment_status = 'paid'
            if (participant.value.transaction) {
                participant.value.transaction.status = 'paid'
            }
        }
    } catch (err) {
        toast.error(t('participant.detail.approve_error', 'Gagal menyetujui pembayaran'))
    } finally {
        isApproving.value = false
    }
}

const isPaidStatus = (status) => {
    const s = (status || '').toLowerCase()
    return ['paid', 'lunas', 'registered', 'terdaftar', 'completed', 'success'].includes(s)
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
</script>

<template>
    <div class="flex flex-col gap-6 pb-12">
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

        <!-- Page Header (Standard Dashboard Navy Style) -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div class="flex items-center gap-4">
                        <div class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md shrink-0">
                            <Icon icon="ph:user-bold" class="text-white text-2xl" />
                        </div>
                        <div class="min-w-0">
                            <div class="flex items-center gap-2 text-xs text-white/60 mb-1">
                                <NuxtLink :to="`/dashboard/organizer/events/${eventId}/participants`" class="hover:text-white transition-colors">
                                    {{ t('dashboard.participants_list.title', 'Daftar Peserta') }}
                                </NuxtLink>
                                <Icon icon="ph:caret-right-bold" class="text-xs" />
                                <span class="text-primary font-medium">{{ t('participant.detail.title', 'Detail Peserta') }}</span>
                            </div>
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white truncate">
                                {{ participant?.full_name || t('participant.detail.title', 'Detail Peserta') }}
                            </h1>
                            <div class="text-slate-300 text-xs mt-1">
                                {{ t('participant.detail.subtitle', 'Informasi lengkap pendaftaran, profil atlet, dan status pembayaran peserta.') }}
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-3 shrink-0">
                        <BaseButton v-if="archerId" :to="`/dashboard/organizer/events/${eventId}/participants/edit?archer_id=${archerId}`" variant="primary" icon="ph:pencil-simple-bold" class="h-10 px-5 text-xs font-black shadow-md shadow-primary/20">
                            {{ t('participant.detail.edit_participant', 'Edit Data Peserta') }}
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <template v-if="isLoading">
            <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div class="inline-block size-8 border-2 border-slate-300 border-t-slate-800 animate-spin rounded-full"></div>
                <div class="text-slate-500 mt-4 text-xs font-medium">{{ t('participant.detail.loading', 'Memuat data peserta...') }}</div>
            </div>
        </template>

        <template v-else-if="participant">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left 2 Columns: All-in-One White Card -->
                <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">

                    <!-- Section 1: Profile Info -->
                    <div class="space-y-6">
                        <!-- Top Profile Info -->
                        <div class="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-slate-100">
                            <div class="size-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)" class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-3">
                                    <h2 class="text-lg font-bold text-slate-900 truncate">{{ participant.full_name }}</h2>
                                </div>
                                <div class="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                                    <span>{{ participant.athlete_code || 'ID: ' + (participant.archer_id || '-').substring(0, 8) }}</span>
                                    <span>•</span>
                                    <span>{{ participant.club_name || t('participant.detail.independent', 'Klub Independen') }}</span>
                                    <template v-if="participant.city">
                                        <span>•</span>
                                        <span>{{ participant.city }}</span>
                                    </template>
                                </div>
                            </div>
                        </div>

                        <!-- Data Fields List -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                            <div>
                                <span class="text-xs text-slate-500 block mb-1 font-medium">{{ t('participant.detail.email_label', 'Alamat Email') }}</span>
                                <span class="text-sm sm:text-base text-slate-900 font-bold truncate block">{{ participant.email || '-' }}</span>
                            </div>
                            <div>
                                <span class="text-xs text-slate-500 block mb-1 font-medium">{{ t('participant.detail.phone_label', 'Nomor WhatsApp / Telepon') }}</span>
                                <span class="text-sm sm:text-base text-slate-900 font-bold block">{{ participant.phone || '-' }}</span>
                            </div>
                            <div>
                                <span class="text-xs text-slate-500 block mb-1 font-medium">{{ t('participant.detail.gender_label', 'Jenis Kelamin') }}</span>
                                <span class="text-sm sm:text-base text-slate-900 font-bold block">{{ participant.gender === 'male' ? t('participant.detail.gender_male', 'Laki-laki') : (participant.gender === 'female' ? t('participant.detail.gender_female', 'Perempuan') : (participant.gender || '-')) }}</span>
                            </div>
                            <div>
                                <span class="text-xs text-slate-500 block mb-1 font-medium">{{ t('participant.detail.birth_date_label', 'Tanggal Lahir') }}</span>
                                <span class="text-sm sm:text-base text-slate-900 font-bold block">{{ formatDate(participant.birth_date) }}</span>
                            </div>
                            <div>
                                <span class="text-xs text-slate-500 block mb-1 font-medium">{{ t('participant.detail.bow_division_label', 'Divisi Busur Utama') }}</span>
                                <span class="text-sm sm:text-base text-slate-900 font-bold block capitalize">{{ participant.bow_type || '-' }}</span>
                            </div>
                            <div>
                                <span class="text-xs text-slate-500 block mb-1 font-medium">{{ t('participant.detail.hand_dominance_label', 'Dominasi Tangan') }}</span>
                                <span class="text-sm sm:text-base text-slate-900 font-bold block">{{ participant.hand_dominance === 'right' ? t('participant.detail.hand_right', 'Tangan Kanan') : (participant.hand_dominance === 'left' ? t('participant.detail.hand_left', 'Tangan Kiri') : (participant.hand_dominance || '-')) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Section 2: Enrolled Tournament Categories -->
                    <div class="border-t border-slate-100 pt-6 space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Icon icon="ph:trophy-bold" class="text-slate-500" />
                                <span>{{ t('participant.detail.division_label', 'Kategori Turnamen yang Diikuti') }}</span>
                            </h3>
                            <span class="text-xs text-slate-400 font-medium">
                                {{ t('participant.detail.categories_count', { count: enrolledCategories.length }) }}
                            </span>
                        </div>

                        <div v-if="enrolledCategories.length > 0" class="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                            <div v-for="cat in enrolledCategories" :key="cat.id"
                                class="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                <div>
                                    <div class="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                                        {{ cat.category_name || cat.label || cat.name }}
                                    </div>
                                    <div class="text-xs sm:text-sm text-slate-500 mt-1">
                                        {{ cat.division_name || '' }} <span v-if="cat.division_name && cat.event_type_name">•</span> {{ cat.event_type_name || cat.class_name || '' }}
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="text-sm sm:text-base font-bold text-slate-900">
                                        Rp {{ formatCurrency(cat.payment_amount) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div v-else class="py-6 text-center text-slate-400 text-xs italic">
                            {{ t('participant.detail.no_categories', 'Belum ada kategori turnamen yang terdaftar.') }}
                        </div>
                    </div>
                </div>

                <!-- Right Sidebar Column: All-in-One White Card -->
                <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                    <!-- Section 1: Payment Information -->
                    <div class="space-y-4">
                        <div class="border-b border-slate-100 pb-3">
                            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Icon icon="ph:credit-card-bold" class="text-slate-500 text-base" />
                                <span>{{ t('participant.detail.payment_title', 'Informasi Pembayaran') }}</span>
                            </h3>
                        </div>

                        <div class="space-y-3.5 text-xs">
                            <div class="flex items-center justify-between py-1">
                                <span class="text-slate-500 font-medium">{{ t('participant.detail.payment_status_label', 'Status Pembayaran') }}</span>
                                <span class="font-bold text-sm"
                                    :class="isPaidStatus(participant.payment_status || participant.status) ? 'text-emerald-600' : 'text-amber-600'">
                                    {{ isPaidStatus(participant.payment_status || participant.status) ? t('participant.detail.status_paid', 'Lunas') : t('participant.detail.status_pending', 'Menunggu Pembayaran') }}
                                </span>
                            </div>
                            <div class="flex items-center justify-between py-1 border-t border-slate-50">
                                <span class="text-slate-500 font-medium">{{ t('participant.detail.total_fee_label', 'Total Biaya') }}</span>
                                <span class="text-base font-black text-slate-900">
                                    Rp {{ formatCurrency(participant.payment_amount || participant.total_fee || 0) }}
                                </span>
                            </div>
                            <div class="flex items-center justify-between py-1 border-t border-slate-50">
                                <span class="text-slate-500 font-medium">{{ t('participant.detail.payment_method_label', 'Metode Pembayaran') }}</span>
                                <span class="font-bold text-slate-800 capitalize">
                                    {{ participant.transaction?.payment_method || participant.payment_method || t('participant.detail.online_gateway', 'Online Gateway') }}
                                </span>
                            </div>
                        </div>

                        <!-- Manual Payment Proof Thumbnail with Lightbox Zoom -->
                        <div v-if="proofUrl" class="pt-3 border-t border-slate-100 space-y-2.5">
                            <span class="text-xs text-slate-500 font-medium block">{{ t('participant.detail.transfer_proof_label', 'Bukti Transfer') }}</span>

                            <div @click="openProofZoom(proofUrl)"
                                class="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer shadow-2xs hover:border-slate-400 transition-all">
                                <img :src="proofUrl" :alt="t('participant.detail.transfer_proof_label', 'Bukti Transfer')" class="h-40 w-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                                <!-- Sleek Overlay on Image -->
                                <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[2px]">
                                    <div class="size-9 rounded-full bg-white/20 flex items-center justify-center text-white shadow-md">
                                        <Icon icon="ph:magnifying-glass-plus-bold" class="text-lg" />
                                    </div>
                                    <span>{{ t('participant.detail.view_fullscreen', 'Lihat Layar Penuh') }}</span>
                                </div>
                            </div>
                            <div v-if="participant.transaction?.sender_name" class="text-xs text-slate-500 space-y-0.5 pt-1">
                                <div>{{ t('participant.detail.sender_label', 'Pengirim') }}: <span class="font-bold text-slate-900">{{ participant.transaction.sender_name }}</span></div>
                                <div v-if="participant.transaction?.amount">{{ t('participant.detail.amount_label', 'Nominal') }}: <span class="font-bold text-slate-900">Rp {{ formatCurrency(participant.transaction.amount) }}</span></div>
                            </div>
                        </div>

                        <!-- Action Button: Confirm Paid -->
                        <div v-if="!isPaidStatus(participant.payment_status || participant.status)" class="pt-2">
                            <BaseButton
                                variant="primary"
                                icon="ph:check-circle-bold"
                                class="w-full h-10 justify-center text-xs font-black shadow-xs"
                                :loading="isApproving"
                                @click="handleApprovePayment">
                                {{ t('participant.detail.confirm_paid', 'Konfirmasi Lunas') }}
                            </BaseButton>
                        </div>
                    </div>

                    <!-- Section 2: Tournament Status -->
                    <div class="border-t border-slate-100 pt-6 space-y-4">
                        <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Icon icon="ph:seal-check-bold" class="text-slate-500" />
                            <span>{{ t('participant.detail.match_status_title', 'Status Pertandingan') }}</span>
                        </h3>

                        <div class="divide-y divide-slate-100 text-xs">
                            <div class="py-3 flex items-center justify-between">
                                <span class="text-slate-500 font-medium">{{ t('participant.detail.checkin_label', 'Daftar Ulang (Check-in)') }}</span>
                                <span class="font-bold" :class="participant.last_reregistration_at ? 'text-emerald-600' : 'text-slate-600'">
                                    {{ participant.last_reregistration_at ? t('participant.detail.checked_in', 'Sudah Check-in') : t('participant.detail.not_checked_in', 'Belum Check-in') }}
                                </span>
                            </div>
                            <div class="py-3 flex items-center justify-between">
                                <span class="text-slate-500 font-medium">{{ t('participant.detail.registration_date_label', 'Tanggal Registrasi') }}</span>
                                <span class="font-bold text-slate-700">
                                    {{ formatDate(participant.registration_date || participant.created_at) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
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
                            :alt="t('participant.detail.transfer_proof_title', 'Bukti Transfer Pembayaran')"
                            class="h-full w-auto max-h-[98vh] max-w-[98vw] object-contain rounded-xl shadow-2xl border border-white/15 bg-black/60 cursor-zoom-out pointer-events-auto"
                            @click="closeProofZoom" />
                    </div>

                    <!-- Top Floating Action Bar (Always on Top) -->
                    <div class="fixed top-4 right-4 sm:top-6 sm:right-6 z-[1000] flex items-center gap-3 pointer-events-auto">
                        <a :href="selectedProofImage" target="_blank" download
                            class="p-3 text-white bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-all shadow-xl cursor-pointer hover:scale-105 active:scale-95"
                            :title="t('participant.detail.download', 'Unduh Bukti')"
                            @click.stop>
                            <Icon icon="ph:download-simple-bold" class="text-xl" />
                        </a>
                        <button type="button" @click.stop="closeProofZoom"
                            class="p-3 text-white bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-all shadow-xl cursor-pointer hover:scale-105 active:scale-95"
                            :title="t('participant.detail.close', 'Tutup')">
                            <Icon icon="ph:x-bold" class="text-xl" />
                        </button>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

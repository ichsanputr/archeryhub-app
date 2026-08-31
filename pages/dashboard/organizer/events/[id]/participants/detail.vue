<template>
    <div class="flex flex-col gap-6 pb-12">
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

        <!-- Enhanced Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>

            <!-- Decorative Background Elements -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <!-- Header Content -->
            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="flex flex-col sm:flex-row sm:items-start gap-4 flex-1">
                        <!-- Icon Badge -->
                        <div
                            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Icon icon="ph:user-bold" class="text-white text-2xl" />
                        </div>

                        <!-- Title Section -->
                        <div class="flex-1 min-w-0">
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2 truncate">
                                {{ t('participant.detail.title', 'Detail Informasi Peserta') }}
                            </h1>
                            <div class="text-slate-300 text-sm max-w-2xl">
                                {{ t('participant.detail.subtitle', 'Informasi lengkap pendaftaran, profil atlet, dan status pembayaran peserta.') }}
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex items-center gap-3 flex-shrink-0">
                        <BaseButton :to="`/dashboard/events/${eventId}/participants`" variant="white" icon="ph:arrow-left-bold" class="h-10 md:h-11 px-4 md:px-5 font-bold">
                            {{ t('common.back', 'Kembali') }}
                        </BaseButton>
                        <BaseButton :to="`/dashboard/events/${eventId}/participants/edit?archer_id=${archerId}`" variant="primary" icon="ph:pencil-simple-bold"
                            class="h-10 md:h-11 px-4 md:px-6 shadow-lg shadow-primary/30 hover:shadow-sm hover:shadow-primary/40 transition-all font-black">
                            {{ t('dashboard.participants_list.edit_button', 'Edit Data Registrasi') }}
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <template v-if="isLoading">
            <!-- Loading State -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div class="inline-block h-8 w-8 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
                <div class="text-gray-500 mt-4 font-medium">{{ t('participant.detail.loading', 'Memuat data peserta...') }}</div>
            </div>
        </template>

        <template v-else-if="participant">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left 2 Cols: Main Info -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- 1. Profile & Basic Contact Card -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                                <Icon icon="ph:user-circle-bold" class="text-primary text-xl" />
                                {{ t('participant.detail.info_title', 'Profil & Identitas Atlet') }}
                            </h2>
                            <span :class="getStatusClass(participant.payment_status || participant.status)"
                                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black border capitalize">
                                {{ getDisplayStatus(participant.payment_status || participant.status) }}
                            </span>
                        </div>

                        <!-- Top profile summary -->
                        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 mb-6">
                            <div class="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-navy font-bold text-xl border border-gray-200 overflow-hidden shrink-0">
                                <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)" class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="font-black text-navy text-xl">{{ participant.full_name }}</div>
                                <div class="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500 font-bold">
                                    <span class="flex items-center gap-1">
                                        <Icon icon="ph:identification-badge-bold" class="text-gray-400" />
                                        {{ participant.athlete_code || '-' }}
                                    </span>
                                    <span>•</span>
                                    <span class="flex items-center gap-1">
                                        <Icon icon="ph:buildings-bold" class="text-gray-400" />
                                        {{ participant.club_name || '-' }}
                                    </span>
                                    <span v-if="participant.city">•</span>
                                    <span v-if="participant.city" class="flex items-center gap-1">
                                        <Icon icon="ph:map-pin-bold" class="text-gray-400" />
                                        {{ participant.city }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Details Grid -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                            <div class="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
                                <span class="text-gray-400 font-bold block mb-1">Email</span>
                                <span class="text-navy font-black text-sm truncate block">{{ participant.email || '-' }}</span>
                            </div>
                            <div class="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
                                <span class="text-gray-400 font-bold block mb-1">Nomor Telepon / WA</span>
                                <span class="text-navy font-black text-sm block">{{ participant.phone || '-' }}</span>
                            </div>
                            <div class="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
                                <span class="text-gray-400 font-bold block mb-1">Jenis Kelamin</span>
                                <span class="text-navy font-black text-sm block capitalize">{{ participant.gender || '-' }}</span>
                            </div>
                            <div class="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
                                <span class="text-gray-400 font-bold block mb-1">Tanggal Lahir / Usia</span>
                                <span class="text-navy font-black text-sm block">{{ formatDate(participant.birth_date) || '-' }}</span>
                            </div>
                            <div class="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
                                <span class="text-gray-400 font-bold block mb-1">Jenis Busur</span>
                                <span class="text-navy font-black text-sm block capitalize">{{ participant.bow_type || '-' }}</span>
                            </div>
                            <div class="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
                                <span class="text-gray-400 font-bold block mb-1">Hand Dominance</span>
                                <span class="text-navy font-black text-sm block capitalize">{{ participant.hand_dominance || '-' }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 2. Registered Categories (Readonly) -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                                <Icon icon="ph:trophy-bold" class="text-primary text-xl" />
                                {{ t('participant.detail.division_label', 'Kategori Turnamen yang Diikuti') }}
                            </h2>
                            <span class="px-2.5 py-1 bg-navy/5 text-navy text-xs font-black rounded-lg border border-navy/10">
                                {{ enrolledCategories.length }} Kategori
                            </span>
                        </div>

                        <div v-if="enrolledCategories.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div v-for="cat in enrolledCategories" :key="cat.id"
                                class="p-4 rounded-xl border-2 border-primary/40 bg-primary/5 flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="size-8 rounded-lg bg-primary flex items-center justify-center text-navy font-black">
                                        <Icon icon="ph:check-bold" class="text-sm" />
                                    </div>
                                    <div>
                                        <div class="text-sm font-black text-navy leading-tight">{{ cat.label || cat.name }}</div>
                                        <div class="text-[11px] text-gray-500 font-bold mt-0.5">{{ cat.description || cat.class_name || '-' }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="py-8 text-center text-gray-400 italic text-sm">
                            Belum ada kategori yang terdaftar untuk peserta ini.
                        </div>
                    </div>

                    <!-- 3. Payment Details Card -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                                <Icon icon="ph:currency-circle-dollar-bold" class="text-primary text-xl" />
                                {{ t('participant.detail.payment_title', 'Informasi & Riwayat Pembayaran') }}
                            </h2>
                            <BaseButton v-if="participant.payment_status !== 'paid' && participant.payment_status !== 'lunas'" 
                                variant="primary" size="sm" icon="ph:check-circle-bold"
                                :loading="isApproving"
                                @click="handleApprovePayment">
                                Konfirmasi Lunas
                            </BaseButton>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span class="text-xs font-bold text-gray-400 block mb-1">Status Pembayaran</span>
                                <span :class="getStatusClass(participant.payment_status || participant.status)"
                                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black border capitalize">
                                    {{ getDisplayStatus(participant.payment_status || participant.status) }}
                                </span>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span class="text-xs font-bold text-gray-400 block mb-1">Total Biaya Pendaftaran</span>
                                <span class="text-navy font-black text-base block">Rp {{ formatCurrency(participant.payment_amount || participant.total_fee || 0) }}</span>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span class="text-xs font-bold text-gray-400 block mb-1">Sumber Pendaftaran</span>
                                <span :class="getSourceClass(participant.registration_source)"
                                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border">
                                    <Icon :icon="getSourceIcon(participant.registration_source)" class="text-sm" />
                                    {{ getSourceLabel(participant.registration_source) }}
                                </span>
                            </div>
                        </div>

                        <!-- Payment Proof if manual -->
                        <div v-if="participant.transaction?.proof_url" class="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80">
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-xs font-black text-amber-900 tracking-wider flex items-center gap-1.5">
                                    <Icon icon="ph:receipt-bold" class="text-amber-600 text-base" />
                                    BUKTI TRANSFER MANUAL
                                </span>
                            </div>
                            <div class="flex flex-col sm:flex-row items-start gap-4">
                                <div class="relative group max-w-[160px] cursor-pointer overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm shrink-0">
                                    <img :src="participant.transaction.proof_url" class="h-28 w-40 object-cover" />
                                </div>
                                <div class="flex-1 space-y-1.5 text-xs">
                                    <div class="flex items-center justify-between text-gray-600 border-b border-amber-200/60 pb-1">
                                        <span>Pengirim:</span>
                                        <span class="font-bold text-navy">{{ participant.transaction.sender_name || '-' }}</span>
                                    </div>
                                    <div class="flex items-center justify-between text-gray-600 border-b border-amber-200/60 pb-1">
                                        <span>Nominal:</span>
                                        <span class="font-black text-navy">Rp {{ formatCurrency(participant.transaction.amount) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right 1 Col: Summary & Quick Actions -->
                <div class="space-y-6">
                    <!-- Accreditation & Target Card -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 class="text-lg font-bold text-navy flex items-center gap-2 mb-6">
                            <Icon icon="ph:seal-check-bold" class="text-primary text-xl" />
                            Status Turnamen
                        </h2>

                        <div class="space-y-4 text-xs">
                            <div class="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                                <span class="text-gray-500 font-bold">Status Akreditasi</span>
                                <span :class="participant.accreditation_status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'"
                                    class="px-2.5 py-1 rounded-lg font-black border capitalize">
                                    {{ participant.accreditation_status || 'Pending' }}
                                </span>
                            </div>

                            <div class="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                                <span class="text-gray-500 font-bold">Status Daftar Ulang</span>
                                <span :class="participant.last_reregistration_at ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'"
                                    class="px-2.5 py-1 rounded-lg font-black border">
                                    {{ participant.last_reregistration_at ? 'Sudah Daftar Ulang' : 'Belum Daftar Ulang' }}
                                </span>
                            </div>

                            <div class="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                                <span class="text-gray-500 font-bold">Nomor Bantalan / Target</span>
                                <span class="font-black text-navy text-sm">
                                    {{ participant.target_number ? `${participant.target_number}${participant.target_face || ''}` : 'Belum Diatur' }}
                                </span>
                            </div>

                            <div class="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                                <span class="text-gray-500 font-bold">Waktu Registrasi</span>
                                <span class="font-bold text-navy">
                                    {{ formatDate(participant.registration_date || participant.created_at) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Navigation Card -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
                        <h2 class="text-xs font-black text-gray-400 tracking-widest uppercase mb-4">
                            Aksi Cepat
                        </h2>
                        <BaseButton :to="`/dashboard/events/${eventId}/participants/edit?archer_id=${archerId}`"
                            variant="primary" icon="ph:pencil-simple-bold" class="w-full h-11 justify-center font-black shadow-md shadow-primary/20">
                            Edit Data Registrasi
                        </BaseButton>
                        <BaseButton :to="`/dashboard/events/${eventId}/printout/id-cards?archer_id=${archerId}`"
                            variant="white" icon="ph:identification-card-bold" class="w-full h-11 justify-center font-bold">
                            Cetak ID Card Atlet
                        </BaseButton>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
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
const participant = ref(null)
const categories = ref([])

useHead({
    title: computed(() => `${t('participant.detail.title', 'Detail Peserta')} - ArcheryHub Dashboard`)
})

onMounted(async () => {
    await fetchParticipantData()
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
    if (registeredIds.length === 0 && participant.value.categories) {
        return participant.value.categories
    }
    return categories.value.filter(c => registeredIds.includes(c.id))
})

const handleApprovePayment = async () => {
    isApproving.value = true
    try {
        await put(`/events/${eventId.value}/participants/${archerId.value}`, {
            payment_status: 'paid'
        })
        toast.success(t('participant.detail.approve_success', 'Pembayaran berhasil disetujui'))
        if (participant.value) {
            participant.value.payment_status = 'paid'
        }
    } catch (err) {
        toast.error(t('participant.detail.approve_error', 'Gagal menyetujui pembayaran'))
    } finally {
        isApproving.value = false
    }
}

const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
        case 'paid':
        case 'lunas':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200'
        case 'pending':
        case 'menunggu':
            return 'bg-amber-50 text-amber-700 border-amber-200'
        case 'rejected':
        case 'ditolak':
            return 'bg-red-50 text-red-700 border-red-200'
        default:
            return 'bg-gray-50 text-gray-600 border-gray-200'
    }
}

const getDisplayStatus = (status) => {
    switch (status?.toLowerCase()) {
        case 'paid':
        case 'lunas':
            return 'Terdaftar (Lunas)'
        case 'pending':
        case 'menunggu':
            return 'Menunggu Pembayaran'
        case 'rejected':
        case 'ditolak':
            return 'Dibatalkan'
        default:
            return status || 'Pending'
    }
}

const getSourceClass = (src) => {
    if (src === 'admin') return 'bg-purple-50 text-purple-700 border-purple-200'
    return 'bg-blue-50 text-blue-700 border-blue-200'
}

const getSourceIcon = (src) => {
    if (src === 'admin') return 'ph:user-gear-bold'
    return 'ph:globe-bold'
}

const getSourceLabel = (src) => {
    if (src === 'admin') return 'Manual Admin'
    return 'Registrasi Online'
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

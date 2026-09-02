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
                                <Icon icon="ph:caret-right-bold" class="text-[10px]" />
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
                        <BaseButton :to="`/dashboard/organizer/events/${eventId}/participants`" variant="white" icon="ph:arrow-left-bold" class="h-10 px-4 text-xs font-bold">
                            {{ t('common.back', 'Kembali') }}
                        </BaseButton>
                        <BaseButton v-if="archerId" :to="`/dashboard/organizer/events/${eventId}/participants/edit?archer_id=${archerId}`" variant="primary" icon="ph:pencil-simple-bold" class="h-10 px-5 text-xs font-black shadow-md shadow-primary/20">
                            {{ t('dashboard.participants_list.edit_button', 'Edit Data') }}
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
                <!-- Left 2 Columns -->
                <div class="lg:col-span-2 space-y-6">

                    <!-- Profile Card -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                        <!-- Top Profile Info -->
                        <div class="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-slate-100">
                            <div class="size-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)" class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-3">
                                    <h2 class="text-lg font-bold text-slate-900 truncate">{{ participant.full_name }}</h2>
                                    <span v-if="isPaidStatus(participant.payment_status || participant.status)"
                                        class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        Lunas
                                    </span>
                                    <span v-else
                                        class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                        Menunggu Pembayaran
                                    </span>
                                </div>
                                <div class="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                                    <span>{{ participant.athlete_code || 'ID: ' + (participant.archer_id || '-').substring(0, 8) }}</span>
                                    <span>•</span>
                                    <span>{{ participant.club_name || 'Klub Independen' }}</span>
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
                                <span class="text-xs text-slate-500 block mb-1 font-medium">Alamat Email</span>
                                <span class="text-sm sm:text-base text-slate-900 font-bold truncate block">{{ participant.email || '-' }}</span>
                            </div>
                            <div>
                                <span class="text-xs text-slate-500 block mb-1 font-medium">Nomor WhatsApp / Telepon</span>
                                <span class="text-sm sm:text-base text-slate-900 font-bold block">{{ participant.phone || '-' }}</span>
                            </div>
                            <div>
                                <span class="text-xs text-slate-500 block mb-1 font-medium">Jenis Kelamin</span>
                                <span class="text-sm sm:text-base text-slate-900 font-bold block capitalize">{{ participant.gender || '-' }}</span>
                            </div>
                            <div>
                                <span class="text-xs text-slate-500 block mb-1 font-medium">Tanggal Lahir</span>
                                <span class="text-sm sm:text-base text-slate-900 font-bold block">{{ formatDate(participant.birth_date) }}</span>
                            </div>
                            <div>
                                <span class="text-xs text-slate-500 block mb-1 font-medium">Divisi Busur Utama</span>
                                <span class="text-sm sm:text-base text-slate-900 font-bold block capitalize">{{ participant.bow_type || '-' }}</span>
                            </div>
                            <div>
                                <span class="text-xs text-slate-500 block mb-1 font-medium">Dominasi Tangan</span>
                                <span class="text-sm sm:text-base text-slate-900 font-bold block capitalize">{{ participant.hand_dominance || '-' }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Registered Categories -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Icon icon="ph:trophy-bold" class="text-slate-500" />
                                <span>Kategori yang Diikuti</span>
                            </h3>
                            <span class="text-xs text-slate-400 font-medium">
                                {{ enrolledCategories.length }} Kategori
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
                                        Rp {{ formatCurrency(cat.payment_amount || cat.fee || 0) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div v-else class="py-6 text-center text-slate-400 text-xs italic">
                            Belum ada kategori lomba yang terdaftar.
                        </div>
                    </div>

                    <!-- Payment Information -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Icon icon="ph:credit-card-bold" class="text-slate-500" />
                                <span>Informasi Pembayaran</span>
                            </h3>
                            <BaseButton v-if="!isPaidStatus(participant.payment_status || participant.status)"
                                variant="primary" size="sm" icon="ph:check-circle-bold"
                                :loading="isApproving"
                                @click="handleApprovePayment">
                                Konfirmasi Lunas
                            </BaseButton>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                            <div>
                                <span class="text-xs text-slate-500 block mb-1 font-medium">Status</span>
                                <span class="text-sm sm:text-base font-bold" :class="isPaidStatus(participant.payment_status || participant.status) ? 'text-emerald-700' : 'text-amber-700'">
                                    {{ isPaidStatus(participant.payment_status || participant.status) ? 'Lunas' : 'Menunggu Pembayaran' }}
                                </span>
                            </div>
                            <div>
                                <span class="text-xs text-slate-500 block mb-1 font-medium">Total Biaya</span>
                                <span class="text-sm sm:text-base text-slate-900 font-bold">
                                    Rp {{ formatCurrency(participant.payment_amount || participant.total_fee || 0) }}
                                </span>
                            </div>
                            <div>
                                <span class="text-xs text-slate-500 block mb-1 font-medium">Metode Pembayaran</span>
                                <span class="text-sm sm:text-base text-slate-900 font-bold capitalize">
                                    {{ participant.transaction?.payment_method || participant.payment_method || 'Online Gateway' }}
                                </span>
                            </div>
                        </div>

                        <!-- Manual Payment Proof Preview if present -->
                        <div v-if="participant.transaction?.proof_url" class="pt-4 border-t border-slate-100">
                            <span class="text-xs text-slate-400 font-medium block mb-2">Bukti Transfer</span>
                            <div class="flex items-center gap-4">
                                <a :href="participant.transaction.proof_url" target="_blank" class="block max-w-[120px] rounded-lg overflow-hidden border border-slate-200">
                                    <img :src="participant.transaction.proof_url" alt="Bukti Transfer" class="h-20 w-32 object-cover" />
                                </a>
                                <div class="text-xs space-y-1 text-slate-600">
                                    <div>Pengirim: <span class="font-semibold text-slate-900">{{ participant.transaction.sender_name || '-' }}</span></div>
                                    <div>Nominal: <span class="font-semibold text-slate-900">Rp {{ formatCurrency(participant.transaction.amount) }}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Sidebar Column -->
                <div class="space-y-6">
                    <!-- Tournament Status -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                        <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Icon icon="ph:seal-check-bold" class="text-slate-500" />
                            <span>Status Pertandingan</span>
                        </h3>

                        <div class="divide-y divide-slate-100 text-sm">
                            <div class="py-3 flex items-center justify-between">
                                <span class="text-slate-500 font-medium">Daftar Ulang (Check-in)</span>
                                <span class="font-bold" :class="participant.last_reregistration_at ? 'text-emerald-600' : 'text-slate-600'">
                                    {{ participant.last_reregistration_at ? 'Sudah Check-in' : 'Belum Check-in' }}
                                </span>
                            </div>
                            <div class="py-3 flex items-center justify-between">
                                <span class="text-slate-500 font-medium">Bantalan / Target</span>
                                <span class="font-bold text-slate-900">
                                    {{ participant.target_number ? `${participant.target_number}${participant.target_face || ''}` : 'Belum Ditentukan' }}
                                </span>
                            </div>
                            <div class="py-3 flex items-center justify-between">
                                <span class="text-slate-500 font-medium">Tanggal Registrasi</span>
                                <span class="font-bold text-slate-700">
                                    {{ formatDate(participant.registration_date || participant.created_at) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
                        <span class="text-xs font-semibold text-slate-400 block mb-1">Aksi Cepat</span>
                        <BaseButton :to="`/dashboard/organizer/events/${eventId}/participants/edit?archer_id=${archerId}`"
                            variant="primary" icon="ph:pencil-simple-bold" class="w-full h-10 justify-center text-xs font-bold">
                            Edit Data Peserta
                        </BaseButton>
                        <BaseButton :to="`/dashboard/organizer/events/${eventId}/printout/id-cards?archer_id=${archerId}`"
                            variant="white" icon="ph:identification-card-bold" class="w-full h-10 justify-center text-xs font-semibold">
                            Cetak ID Card
                        </BaseButton>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

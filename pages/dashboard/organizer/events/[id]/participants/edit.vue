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
                            <Icon icon="ph:pencil-simple-bold" class="text-white text-2xl" />
                        </div>

                        <!-- Title Section -->
                        <div class="flex-1 min-w-0">
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2 truncate">
                                {{ t('participant.edit.title', 'Edit Registrasi Peserta') }}
                            </h1>
                            <div class="text-slate-300 text-sm max-w-2xl">
                                {{ t('participant.edit.subtitle', 'Ubah kategori lomba, status pembayaran, dan data registrasi atlet.') }}
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex items-center gap-3 flex-shrink-0">
                        <BaseButton :to="`/dashboard/organizer/events/${eventId}/participants/detail?archer_id=${archerId}`" variant="white" class="h-10 md:h-11 px-4 md:px-5 font-bold">
                            {{ t('common.cancel', 'Batal') }}
                        </BaseButton>
                        <BaseButton variant="primary" icon="ph:floppy-disk-bold"
                            class="h-10 md:h-11 px-4 md:px-6 shadow-lg shadow-primary/30 hover:shadow-sm hover:shadow-primary/40 transition-all font-black"
                            :loading="isSubmitting"
                            @click="handleSubmit">
                            {{ t('common.save_changes', 'Simpan Perubahan') }}
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
            <form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left 2 Cols: Main Form -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Participant Summary Badge -->
                    <div class="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div class="h-14 w-14 rounded-2xl bg-gray-50 shadow-sm flex items-center justify-center text-navy font-bold text-xl border border-gray-200 overflow-hidden shrink-0">
                            <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)" class="w-full h-full object-cover">
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="font-black text-navy text-lg">{{ participant.full_name }}</div>
                            <div class="text-xs text-gray-500 font-bold mt-1">
                                {{ participant.athlete_code || '-' }} • {{ participant.club_name || 'Independen' }} • {{ participant.email || '-' }}
                            </div>
                        </div>
                    </div>

                    <!-- 1. Category Selection -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <div class="flex items-center justify-between">
                            <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                                <Icon icon="ph:trophy-bold" class="text-primary text-xl" />
                                {{ t('participant.detail.division_label', 'Pilih Kategori Lomba') }}
                            </h2>
                            <span class="text-xs font-bold text-gray-400">
                                {{ form.category_ids.length }} Dipilih
                            </span>
                        </div>

                        <div class="relative">
                            <input v-model="categorySearch" type="text"
                                :placeholder="t('participant.detail.search_placeholder', 'Cari kategori lomba...')"
                                class="w-full h-11 px-4 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" />
                            <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                        </div>

                        <div class="max-h-[360px] overflow-y-auto pr-2 space-y-2.5">
                            <div v-for="category in filteredCategories" :key="category.id"
                                class="p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group"
                                :class="form.category_ids.includes(category.id)
                                    ? 'border-primary bg-primary/5 shadow-sm'
                                    : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'"
                                @click="toggleCategory(category.id)">
                                <div class="flex items-center gap-4">
                                    <div class="size-6 rounded-lg border-2 flex items-center justify-center transition-all"
                                        :class="form.category_ids.includes(category.id)
                                            ? 'bg-primary border-primary'
                                            : 'bg-white border-gray-300 group-hover:border-navy'">
                                        <Icon v-if="form.category_ids.includes(category.id)" icon="ph:check-bold" class="text-navy text-xs" />
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-sm font-black text-navy leading-tight">{{ category.label || category.name }}</span>
                                        <span class="text-[10px] text-gray-500 font-bold tracking-wider mt-1">{{ category.description || category.class_name || '-' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 2. Payment Data -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                        <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:currency-circle-dollar-bold" class="text-primary text-xl" />
                            Status & Nominal Pembayaran
                        </h2>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <BaseSelect v-model="form.payment_status" :label="t('participant.detail.payment_status_label', 'Status Pembayaran')" required
                                icon="ph:currency-circle-dollar" :items="paymentStatusOptions" item-title="label" item-value="value"
                                :placeholder="t('dashboard.participants_list.select_status', 'Pilih Status Pembayaran')" />

                            <BaseInput v-model="form.payment_amount" :label="t('participant.detail.payment_amount_label', 'Nominal Pembayaran (Rp)')"
                                placeholder="0" icon="ph:money" kind="currency" required />
                        </div>
                    </div>
                </div>

                <!-- Right 1 Col: Status & Controls -->
                <div class="space-y-6">
                    <!-- Accreditation & Target Card -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <h2 class="text-lg font-bold text-navy flex items-center gap-2 mb-2">
                            <Icon icon="ph:seal-check-bold" class="text-primary text-xl" />
                            Status Turnamen
                        </h2>

                        <BaseSelect v-model="form.accreditation_status" label="Status Akreditasi" required
                            :items="[
                                { label: 'Approved (Disetujui)', value: 'approved' },
                                { label: 'Pending (Menunggu)', value: 'pending' },
                                { label: 'Rejected (Ditolak)', value: 'rejected' }
                            ]"
                            item-title="label" item-value="value"
                            placeholder="Pilih Status Akreditasi" />

                        <BaseInput v-model="form.target_number" label="Nomor Bantalan" placeholder="Contoh: 12" />
                        <BaseInput v-model="form.target_face" label="Posisi Target (Face)" placeholder="Contoh: A / B / C / D" />
                        
                        <BaseInput v-model="form.notes" label="Catatan Tambahan" placeholder="Catatan internal panitia..." type="textarea" />
                    </div>

                    <!-- Action Card -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
                        <BaseButton type="submit" variant="primary" icon="ph:floppy-disk-bold"
                            class="w-full h-11 justify-center font-black shadow-md shadow-primary/20"
                            :loading="isSubmitting">
                            {{ t('common.save_changes', 'Simpan Perubahan') }}
                        </BaseButton>
                        <BaseButton :to="`/dashboard/organizer/events/${eventId}/participants/detail?archer_id=${archerId}`"
                            variant="white" class="w-full h-11 justify-center font-bold">
                            {{ t('common.cancel', 'Batal') }}
                        </BaseButton>
                    </div>
                </div>
            </form>
        </template>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, reactive, computed, onMounted } from 'vue'
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
const isSubmitting = ref(false)
const showPremiumModal = ref(false)
const participant = ref(null)
const categories = ref([])
const categorySearch = ref('')

const form = reactive({
    category_ids: [],
    payment_status: 'pending',
    payment_amount: 0,
    accreditation_status: 'pending',
    target_number: '',
    target_face: '',
    notes: ''
})

const paymentStatusOptions = [
    { label: 'Terdaftar (Lunas)', value: 'paid' },
    { label: 'Menunggu Pembayaran', value: 'pending' },
    { label: 'Dibatalkan', value: 'rejected' }
]

useHead({
    title: computed(() => `${t('participant.edit.title', 'Edit Registrasi Peserta')} - ArcheryHub Dashboard`)
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
        const p = partRes.data || partRes
        participant.value = p
        categories.value = catRes.data || catRes || []

        form.category_ids = p.category_ids || (p.category_id ? [p.category_id] : [])
        form.payment_status = p.payment_status || p.status || 'pending'
        form.payment_amount = p.payment_amount || p.total_fee || 0
        form.accreditation_status = p.accreditation_status || 'pending'
        form.target_number = p.target_number || ''
        form.target_face = p.target_face || ''
        form.notes = p.notes || ''
    } catch (err) {
        console.error('Failed to load participant for edit:', err)
        toast.error(t('common.error_loading', 'Gagal memuat data peserta'))
    } finally {
        isLoading.value = false
    }
}

const filteredCategories = computed(() => {
    if (!categorySearch.value) return categories.value
    const q = categorySearch.value.toLowerCase()
    return categories.value.filter(c => (c.label || c.name || '').toLowerCase().includes(q))
})

const toggleCategory = (catId) => {
    const idx = form.category_ids.indexOf(catId)
    if (idx > -1) {
        form.category_ids.splice(idx, 1)
    } else {
        form.category_ids.push(catId)
    }
}

const handleSubmit = async () => {
    if (form.category_ids.length === 0) {
        toast.error('Pilih setidaknya satu kategori lomba')
        return
    }
    isSubmitting.value = true
    try {
        await put(`/events/${eventId.value}/participants/${archerId.value}`, {
            category_ids: form.category_ids,
            payment_status: form.payment_status,
            payment_amount: Number(form.payment_amount),
            accreditation_status: form.accreditation_status,
            target_number: form.target_number,
            target_face: form.target_face,
            notes: form.notes
        })
        toast.success(t('participant.edit.save_success', 'Data registrasi berhasil diperbarui'))
        router.push(`/dashboard/events/${eventId.value}/participants/detail?archer_id=${archerId.value}`)
    } catch (err) {
        console.error('Save error:', err)
        toast.error(t('participant.edit.save_error', 'Gagal menyimpan perubahan'))
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Enhanced Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-20"
                style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px);">
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
                            <Icon icon="ph:user" class="text-primary text-2xl" />
                        </div>

                        <!-- Title Section -->
                        <div class="flex-1 min-w-0">
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2 truncate">
                                Detail Peserta
                            </h1>
                            <p class="text-slate-300 text-sm max-w-2xl">
                                Lihat informasi lengkap dan status pendaftaran peserta
                            </p>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3 flex-shrink-0">
                        <BaseButton variant="primary" icon="ph:floppy-disk"
                            class="h-10 md:h-11 px-4 md:px-6 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                            @click="handleSubmit" :loading="isSubmitting">
                            <span class="hidden sm:inline">Simpan Perubahan</span>
                            <span class="sm:hidden">Simpan</span>
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <template v-if="isLoading">
            <!-- Loading State -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div class="inline-block h-8 w-8 border-4 border-primary border-t-transparent animate-spin rounded-full">
                </div>
                <p class="text-gray-500 mt-4 font-medium">Memuat data peserta...</p>
            </div>
        </template>

        <template v-else-if="participant">
            <!-- Registered Participant QR Card -->
            <div v-if="form.status === 'Terdaftar' && participant?.qr_raw"
                class="bg-navy rounded-2xl p-6 text-white overflow-hidden relative border border-white/10 shadow-sm group">
                <div
                    class="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all duration-700">
                </div>
                <div class="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div
                        class="bg-white p-4 rounded-2xl shadow-inner-lg transform transition-transform group-hover:scale-105 duration-500">
                        <qrcode-vue :value="participant?.qr_raw" :size="180" level="H" render-as="svg" foreground="#000000" />
                    </div>
                    <div class="flex-1 text-center md:text-left">
                        <span
                            class="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            <Icon icon="ph:seal-check-fill" />
                            ID Peserta Terverifikasi
                        </span>
                        <h2 class="text-2xl font-black mb-2 tracking-tight">QR Code Registrasi Ulang</h2>
                        <p class="text-slate-300 text-sm max-w-md mb-6 font-medium">
                            Tunjukkan QR Code ini kepada panitia untuk proses registrasi ulang dan verifikasi di lokasi event.
                        </p>
                        <div class="flex flex-wrap justify-center md:justify-start gap-3">
                            <BaseButton variant="white" class="h-10 px-4 text-xs font-bold" icon="ph:printer">Cetak QR Code
                            </BaseButton>
                            <BaseButton variant="white" class="h-10 px-4 text-xs font-bold" icon="ph:download-simple">
                                Download QR</BaseButton>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Edit Form (Unified Page) -->
            <form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Form Column -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Participant Info -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
                    <!-- Approved Badge Watermark -->
                    <div v-if="form.accreditation_status === 'approved'"
                        class="absolute -right-8 -top-8 rotate-12 opacity-[0.03] select-none pointer-events-none">
                        <Icon icon="ph:seal-check-fill" class="text-[200px]" />
                    </div>

                    <h2 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                        <Icon icon="ph:user" class="text-primary" />
                        Informasi Peserta
                    </h2>

                    <div class="space-y-6">
                        <div
                            class="flex flex-col md:flex-row items-start md:items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 relative z-10">
                            <div
                                class="h-16 w-16 rounded-xl bg-white shadow-sm flex items-center justify-center text-navy font-bold text-xl uppercase border border-gray-100 overflow-hidden shrink-0">
                                <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)"
                                    class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="font-black text-navy text-lg">{{ participant.full_name }}</p>
                                <div class="flex flex-wrap items-center gap-3 mt-2">
                                    <p class="text-sm font-bold text-gray-500 flex items-center gap-1.5">
                                        <Icon icon="ph:identification-card" />
                                        {{ participant.athlete_code || '-' }}
                                    </p>
                                    <span class="text-gray-300">•</span>
                                    <span :class="getStatusClass(form.status)"
                                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border">
                                        {{ form.status || 'Menunggu Acc' }}
                                    </span>
                                    <span class="text-gray-300">•</span>
                                    <p class="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                                        <Icon icon="ph:calendar-check" />
                                        {{ formatDate(participant?.registration_date) }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 gap-6 mt-6">
                            <div>
                                <BaseSelect v-model="form.category_id" label="Divisi & Kategori" required
                                    placeholder="Pilih Kategori" icon="ph:trophy" :items="categories" item-title="label"
                                    item-value="id" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Payment Info -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                        <Icon icon="ph:currency-circle-dollar" class="text-primary" />
                        Status & Pembayaran
                    </h2>
                    <div class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <BaseSelect v-model="form.payment_status" label="Status Pembayaran" required icon="ph:currency-circle-dollar"
                                :items="paymentStatusOptions" item-title="label" item-value="value" />

                            <BaseInput v-model="form.payment_amount" label="Jumlah Pembayaran" placeholder="0"
                                icon="ph:money" kind="currency" />
                        </div>

                        <!-- Payment Proof Images -->
                        <div class="pt-4 border-t border-gray-100">
                            <label class="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <Icon icon="ph:image" />
                                Bukti Pembayaran
                            </label>

                            <div v-if="form.payment_proof_urls?.length" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <template v-for="(url, index) in form.payment_proof_urls" :key="index">
                                    <div
                                        class="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                        <img :src="url.startsWith('http') ? url : `http://localhost:8001${url}`"
                                            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            alt="Bukti Pembayaran" />
                                        <div
                                            class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                            <a :href="url.startsWith('http') ? url : `http://localhost:8001${url}`"
                                                target="_blank"
                                                class="opacity-0 group-hover:opacity-100 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all">
                                                <Icon icon="ph:magnifying-glass-plus" class="text-xl" />
                                            </a>
                                        </div>
                                    </div>
                                </template>
                            </div>
                            <div v-else
                                class="p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center text-gray-400">
                                <Icon icon="ph:image-slash" class="text-3xl mx-auto mb-2 opacity-50" />
                                <p class="text-xs font-bold uppercase tracking-widest opacity-60">Belum ada
                                    bukti</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">

                <!-- Kick Participant -->
                <div class="bg-red-50 rounded-2xl border border-red-100 shadow-sm p-6">
                    <h3 class="text-sm font-bold text-red-600 mb-2 flex items-center gap-2">
                        <Icon icon="ph:warning-circle" class="text-lg" />
                        Kick Participant
                    </h3>
                    <p class="text-[10px] text-red-500/80 mb-4 leading-relaxed font-bold">
                        Hapus peserta dari event ini secara permanen. Tindakan ini juga akan menghapus data target dan
                        skor yang terkait.
                    </p>
                    <BaseButton variant="danger" block icon="ph:user-minus"
                        class="h-10 text-xs shadow-lg shadow-red-200" @click="showKickDialog = true">
                        Keluarkan Peserta
                    </BaseButton>
                </div>
            </div>
        </form>

        <!-- Kick Participant Confirmation Dialog -->
        <BaseDialogForm v-model="showKickDialog" header="Kick Participant">
            <div class="space-y-4">
                <div class="flex flex-col items-center text-center gap-4">
                    <div class="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center">
                        <Icon icon="ph:warning-circle" class="text-4xl text-red-500" />
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-navy mb-2">Keluarkan Peserta?</h3>
                        <p class="text-gray-500 text-sm leading-relaxed">
                            Apakah Anda yakin ingin mengeluarkan <span class="font-bold text-navy">{{ participant?.full_name }}</span> dari event ini?
                        </p>
                        <p class="text-red-600 text-xs mt-2 font-semibold">
                            Tindakan ini akan menghapus semua data target dan skor yang terkait dan tidak dapat dibatalkan.
                        </p>
                    </div>
                </div>
            </div>

            <template #action>
                <BaseButton variant="white" @click="showKickDialog = false">Batal</BaseButton>
                <BaseButton variant="danger" @click="handleKickUser" :loading="isKicking">
                    <Icon icon="ph:user-minus" class="mr-2" />
                    Keluarkan Peserta
                </BaseButton>
            </template>
        </BaseDialogForm>
        </template>

        <!-- Error State -->
        <template v-else>
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <Icon icon="ph:warning-circle" class="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 class="text-lg font-bold text-navy mb-2">Peserta Tidak Ditemukan</h3>
                <p class="text-gray-500 mb-4">Peserta yang Anda cari tidak ditemukan atau telah dihapus.</p>
                <BaseButton variant="primary" :to="`/dashboard/events/${route.params.id}/participants`">
                    Kembali ke Daftar Peserta
                </BaseButton>
            </div>
        </template>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import Breadcrumbs from '~/components/common/Breadcrumbs.vue'
import QrcodeVue from 'qrcode.vue'
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { definePageMeta } from '#imports'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Detail Peserta - ArcheryHub Dashboard'
})

const route = useRoute()
const router = useRouter()
const { get, put, del } = useApi()
const toast = useToast()

const breadcrumbItems = computed(() => [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Events', path: '/dashboard/events' },
    { label: 'Peserta', path: `/dashboard/events/${route.params.id}/participants` }
])

const eventId = route.params.id
const participantId = route.params.participantId
const isLoading = ref(true)
const isSubmitting = ref(false)
const isKicking = ref(false)
const showKickDialog = ref(false)
const participant = ref(null)
const event = ref(null)
const categories = ref([])

const form = reactive({
    category_id: '',
    status: 'Menunggu Acc',
    payment_status: 'belum_lunas',
    payment_amount: 0,
    payment_proof_urls: []
})

const paymentStatusOptions = [
    { label: 'Belum Lunas', value: 'belum_lunas' },
    { label: 'Lunas', value: 'lunas' },
    { label: 'Menunggu Acc', value: 'menunggu_acc' }
]

const statusOptions = [
    { label: 'Menunggu Acc', value: 'Menunggu Acc' },
    { label: 'Terdaftar', value: 'Terdaftar' },
    { label: 'Ditolak', value: 'Ditolak' }
]

const targetNumberText = computed(() => {
    return participant.value?.target_number || 'Belum Ditentukan'
})

const fetchParticipant = async () => {
    isLoading.value = true
    try {
        console.log(`[DEBUG] Fetching participant ${participantId} for event ${eventId}`)
        // Fetch specific participant by athlete_code or id
        const found = await get(`/events/${eventId}/participants/${participantId}`)
        console.log('[DEBUG] API Response:', found)
        if (found) {
            participant.value = found
            // Populate form
            form.category_id = found.category_id
            form.status = found.status || 'Menunggu Acc'
            form.payment_status = found.payment_status || 'belum_lunas'
            form.payment_amount = found.payment_amount || 0
            form.payment_proof_urls = found.payment_proof_urls ? found.payment_proof_urls.split(',') : []
        }

        // Fetch event details and categories
        const [eventRes, categoriesRes] = await Promise.all([
            get(`/events/${eventId}`),
            get(`/events/${eventId}/categories`)
        ])
        event.value = eventRes
        if (categoriesRes && categoriesRes.events) {
            categories.value = categoriesRes.events.map(cat => ({
                id: cat.id,
                label: formatCategoryName(cat),
                description: `${cat.event_type_name || ''} ${cat.gender_division_name ? '(' + cat.gender_division_name + ')' : ''}`.trim()
            }))
        }
    } catch (error) {
        console.error('Failed to fetch participant:', error)
        toast.error('Gagal memuat data peserta')
    } finally {
        isLoading.value = false
    }
}

const formatCategoryName = (category) => {
    return [
        category.division_name || category.division,
        category.category_name || category.category || category.age_category || category.class_category,
        category.event_type_name || category.event_type,
        category.gender_division_name || category.gender
    ].filter(Boolean).join(' - ') || 'Kategori'
}

const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD'
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(value)
}

const getCategoryName = (p) => {
    if (!p) return 'Sedang memuat...'
    const cat = categories.value.find(c => c.id === p.category_id)
    return cat ? cat.label : 'Pilih Kategori'
}

const getStatusClass = (status) => {
    switch (status) {
        case 'Terdaftar':
            return 'bg-green-50 text-green-600 border-green-200'
        case 'Ditolak':
            return 'bg-red-50 text-red-600 border-red-200'
        case 'Menunggu Acc':
        default:
            return 'bg-amber-50 text-amber-600 border-amber-200'
    }
}

const handleSubmit = async () => {
    isSubmitting.value = true
    try {
        const payload = {
            category_id: form.category_id,
            payment_status: form.payment_status,
            payment_amount: parseFloat(form.payment_amount) || 0
        }
        await put(`/events/${eventId}/participants/${participantId}`, payload)
        toast.success('Data peserta berhasil diperbarui')
        await fetchParticipant()
    } catch (error) {
        console.error('Failed to update participant:', error)
        toast.error(error?.data?.error || 'Gagal memperbarui data peserta')
    } finally {
        isSubmitting.value = false
    }
}

const handleKickUser = async () => {
    isKicking.value = true
    try {
        await del(`/events/${eventId}/participants/${participantId}`)
        toast.success('Peserta berhasil dikeluarkan dari event')
        showKickDialog.value = false
        router.push(`/dashboard/events/${eventId}/participants`)
    } catch (error) {
        console.error('Failed to kick participant:', error)
        toast.error('Gagal mengeluarkan peserta')
    } finally {
        isKicking.value = false
    }
}

onMounted(() => {
    fetchParticipant()
})
</script>

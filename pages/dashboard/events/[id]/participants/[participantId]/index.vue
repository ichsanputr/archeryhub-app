<template>
    <div class="flex flex-col gap-6 pb-12">
        <Breadcrumbs :items="breadcrumbItems" current="Detail Peserta" />

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
                        <NuxtLink
                            :to="`/dashboard/events/${route.params.id}/participants/${route.params.participantId}/edit`"
                            class="h-10 md:h-11 px-4 md:px-6 bg-primary text-navy font-black rounded-xl flex items-center gap-2 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all">
                            <Icon icon="ph:pencil-simple-bold" />
                            <span class="hidden sm:inline">Edit Peserta</span>
                            <span class="sm:hidden">Edit</span>
                        </NuxtLink>
                        <BaseButton variant="white" icon="ph:arrow-left" class="h-10 md:h-11 px-4 md:px-5 font-bold"
                            @click="$router.push(`/dashboard/events/${route.params.id}/participants`)">
                            <span class="hidden sm:inline">Kembali</span>
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Registered Participant QR Card -->
        <div v-if="form.status === 'Terdaftar'"
            class="bg-navy rounded-2xl p-6 text-white overflow-hidden relative border border-white/10 shadow-xl group">
            <div
                class="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all duration-700">
            </div>
            <div class="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div
                    class="bg-white p-4 rounded-2xl shadow-inner-lg transform transition-transform group-hover:scale-105 duration-500">
                    <qrcode-vue :value="participant?.id" :size="180" level="H" render-as="svg" foreground="#000000" />
                </div>
                <div class="flex-1 text-center md:text-left">
                    <span
                        class="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                        <Icon icon="ph:seal-check-fill" />
                        ID Peserta Terverifikasi
                    </span>
                    <h2 class="text-2xl font-black mb-2 tracking-tight">E-ID Card</h2>
                    <p class="text-slate-300 text-sm max-w-md mb-6 font-medium">
                        Tunjukkan QR Code ini kepada panitia untuk proses akreditasi dan verifikasi di lokasi event.
                    </p>
                    <div class="flex flex-wrap justify-center md:justify-start gap-3">
                        <BaseButton variant="white" class="h-10 px-4 text-xs font-bold" icon="ph:printer">Cetak ID Card
                        </BaseButton>
                        <BaseButton variant="white" class="h-10 px-4 text-xs font-bold" icon="ph:download-simple">
                            Download QR</BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div class="inline-block h-8 w-8 border-4 border-primary border-t-transparent animate-spin rounded-full">
            </div>
            <p class="text-gray-500 mt-4 font-medium">Memuat data peserta...</p>
        </div>

        <!-- Edit Form (Unified Page) -->
        <form v-else-if="participant" @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                            class="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 relative z-10">
                            <div
                                class="h-16 w-16 rounded-xl bg-white shadow-sm flex items-center justify-center text-navy font-bold text-xl uppercase border border-gray-100 overflow-hidden">
                                <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)"
                                    class="w-full h-full object-cover">
                            </div>
                            <div>
                                <p class="font-black text-navy text-lg">{{ participant.full_name }}</p>
                            </div>
                            <p class="text-sm font-bold text-gray-500 flex items-center gap-1.5">
                                <Icon icon="ph:identification-card" />
                                {{ participant.athlete_code || '-' }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Participant Competition Data -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <div>
                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5 opacity-70">
                            Divisi & Kategori</p>
                        <div class="flex items-center gap-2.5 text-slate-600">
                            <div
                                class="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-black transition-transform">
                                <Icon icon="ph:trophy-bold" class="text-lg" />
                            </div>

                            <p class="font-bold tracking-tight">{{ getCategoryName(participant) }}</p>
                        </div>
                    </div>

                    <div>
                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5 opacity-70">
                            Nomor Target</p>
                        <div class="flex items-center gap-2.5 text-slate-600">
                            <div
                                class="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-black transition-transform">
                                <Icon icon="ph:target-bold" class="text-lg" />
                            </div>
                            <p class="font-bold tracking-tight">{{ targetNumberText }}</p>
                        </div>
                    </div>

                    <div>
                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5 opacity-70">
                            Tanggal Pendaftaran</p>
                        <div class="flex items-center gap-2.5 text-slate-600">
                            <div
                                class="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-black transition-transform">
                                <Icon icon="ph:calendar-check-bold" class="text-lg" />
                            </div>
                            <p class="font-bold tracking-tight">{{
                                formatDate(participant?.registration_date) }}</p>
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
                            <div>
                                <p class="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Status
                                    Pendaftaran
                                </p>
                                <span
                                    :class="form.status === 'Terdaftar' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'"
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border">
                                    <Icon
                                        :icon="form.status === 'Terdaftar' ? 'ph:check-circle-fill' : 'ph:clock-fill'" />
                                    {{ form.status }}
                                </span>
                            </div>
                            <div>
                                <p class="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Jumlah
                                    Pembayaran
                                </p>
                                <p class="text-navy font-black text-lg">Rp {{ formatCurrency(form.payment_amount
                                    || 0)
                                }}</p>
                            </div>
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


                <!-- Event Info -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="text-sm font-bold text-navy mb-4">Event</h3>
                    <div v-if="event" class="space-y-3">
                        <p class="font-bold text-navy text-sm">{{ event.name }}</p>
                        <div class="space-y-2 text-xs text-gray-500">
                            <div class="flex items-center gap-2">
                                <Icon icon="ph:calendar" />
                                <span>{{ formatDate(event.start_date) }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <Icon icon="ph:map-pin" />
                                <span>{{ event.venue || 'TBD' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <!-- Error State -->
        <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <Icon icon="ph:warning-circle" class="text-5xl text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-navy mb-2">Peserta Tidak Ditemukan</h3>
            <p class="text-gray-500 mb-4">Peserta yang Anda cari tidak ditemukan atau telah dihapus.</p>
            <BaseButton variant="primary" :to="`/dashboard/events/${route.params.id}/participants`">
                Kembali ke Daftar Peserta
            </BaseButton>
        </div>
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
const { get, put } = useApi()
const toast = useToast()

const breadcrumbItems = computed(() => [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Events', path: '/dashboard/events' },
    { label: 'Control Panel', path: `/dashboard/events/${route.params.id}/overview` },
    { label: 'Peserta', path: `/dashboard/events/${route.params.id}/participants` }
])

const eventId = route.params.id
const participantId = route.params.participantId
const isLoading = ref(true)
const participant = ref(null)
const event = ref(null)
const categories = ref([])

const form = reactive({
    category_id: '',
    status: 'Menunggu Acc',
    payment_amount: 0,
    payment_proof_urls: []
})

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

onMounted(() => {
    fetchParticipant()
})
</script>

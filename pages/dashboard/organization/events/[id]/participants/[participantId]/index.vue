<template>
    <div class="flex flex-col gap-6 pb-12">
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
                            <Icon icon="ph:user" class="text-white text-2xl" />
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
                        <BaseButton variant="navy" icon="ph:chart-line-up-bold"
                            class="h-10 md:h-11 px-6 shadow-xl shadow-navy/20"
                            :to="`/dashboard/events/${eventId}/result-user?archer_id=${participant?.athlete_code || participant?.id}`"
                            target="_blank">
                            <span class="hidden sm:inline">Lihat Hasil</span>
                            <span class="sm:hidden text-xs">Hasil</span>
                        </BaseButton>
                        <BaseButton variant="primary" icon="ph:floppy-disk"
                            class="h-10 md:h-11 px-4 md:px-6 shadow-lg shadow-primary/30 hover:shadow-sm hover:shadow-primary/40 transition-all font-black"
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
                <div
                    class="inline-block h-8 w-8 border-4 border-primary border-t-transparent animate-spin rounded-full">
                </div>
                <p class="text-gray-500 mt-4 font-medium">Memuat data peserta...</p>
            </div>
        </template>

        <template v-else-if="participant">

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
                                    class="h-16 w-16 rounded-xl bg-white shadow-sm flex items-center justify-center text-navy font-bold text-xl  border border-gray-100 overflow-hidden shrink-0">
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
                                            {{ getDisplayStatus(form.status) }}
                                        </span>
                                        <span class="text-gray-300">•</span>
                                        <!-- Registration Source Badge -->
                                        <span :class="getSourceClass(participant.registration_source)"
                                            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border">
                                            <Icon :icon="getSourceIcon(participant.registration_source)"
                                                class="text-sm" />
                                            {{ getSourceLabel(participant.registration_source) }}
                                        </span>
                                        <span class="text-gray-300">•</span>
                                        <p class="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                                            <Icon icon="ph:calendar-check" />
                                            {{ formatDate(participant?.registration_date) }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <label
                                    class="block text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
                                    <Icon icon="ph:trophy-bold" class="text-primary" />
                                    Divisi & Kategori Lomba
                                </label>

                                <div class="relative">
                                    <input v-model="categorySearch" type="text"
                                        placeholder="Cari divisi atau kategori..."
                                        class="w-full h-10 px-4 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" />
                                    <Icon icon="ph:magnifying-glass"
                                        class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>

                                <div class="max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div v-for="category in filteredCategories" :key="category.id"
                                            class="p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group"
                                            :class="form.category_ids.includes(category.id)
                                                ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                                                : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'"
                                            @click="toggleCategory(category.id)">
                                            <div class="flex items-center gap-4">
                                                <div class="size-6 rounded-lg border-2 flex items-center justify-center transition-all"
                                                    :class="form.category_ids.includes(category.id)
                                                        ? 'bg-primary border-primary'
                                                        : 'bg-white border-gray-300 group-hover:border-navy'">
                                                    <Icon v-if="form.category_ids.includes(category.id)"
                                                        icon="ph:check-bold" class="text-navy text-xs" />
                                                </div>
                                                <div class="flex flex-col">
                                                    <span class="text-sm font-black text-navy leading-tight">{{
                                                        category.label }}</span>
                                                    <span
                                                        class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">{{
                                                            category.description }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="filteredCategories.length === 0" class="py-12 text-center text-gray-400">
                                        <Icon icon="ph:magnifying-glass-slash"
                                            class="text-3xl mx-auto mb-2 opacity-50" />
                                        <p class="text-xs font-bold uppercase tracking-widest">Kategori tidak ditemukan
                                        </p>
                                    </div>
                                </div>
                                <p class="text-[11px] text-gray-500 font-medium px-1 flex items-center gap-2">
                                    <Icon icon="ph:info-bold" class="text-navy" />
                                    Pemanah dapat mengikuti lebih dari satu kategori (Multiple Selection)
                                </p>
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
                                <BaseSelect v-model="form.payment_status" label="Status Pembayaran" required
                                    icon="ph:currency-circle-dollar" :items="paymentStatusOptions" item-title="label"
                                    item-value="value" />

                                <BaseInput v-model="form.payment_amount" label="Jumlah Pembayaran" placeholder="0"
                                    icon="ph:money" kind="currency" required />
                            </div>

                            <!-- Payment Proof Images -->
                            <div class="pt-4 border-t border-gray-100">
                                <div class="flex items-center justify-between mb-4">
                                    <label class="block text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <Icon icon="ph:image" />
                                        Bukti Pembayaran <span class="text-red-500">*</span>
                                    </label>
                                    <BaseButton type="button" variant="primary" icon="ph:plus-circle-bold"
                                        @click="showMediaLibrary = true" class="!h-8 !px-3 shadow-md shadow-primary/20">
                                        <span class="text-[10px] font-black uppercase tracking-widest">Tambah
                                            Bukti</span>
                                    </BaseButton>
                                </div>

                                <div v-if="form.payment_proof_urls?.length"
                                    class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <template v-for="(url, index) in form.payment_proof_urls" :key="index">
                                        <div
                                            class="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                            <img :src="url.startsWith('http') ? url : `http://localhost:8001${url}`"
                                                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                alt="Bukti Pembayaran" />
                                            <div
                                                class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                                <div
                                                    class="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <a :href="url.startsWith('http') ? url : `http://localhost:8001${url}`"
                                                        target="_blank"
                                                        class="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all">
                                                        <Icon icon="ph:magnifying-glass-plus" class="text-xl" />
                                                    </a>
                                                    <button type="button" @click="removeProof(index)"
                                                        class="p-2 bg-red-500/20 backdrop-blur-md rounded-full text-white hover:bg-red-500/40 transition-all">
                                                        <Icon icon="ph:trash" class="text-xl" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                                <div v-else
                                    class="p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center text-gray-400">
                                    <Icon icon="ph:image-slash" class="text-3xl mx-auto mb-2 opacity-50" />
                                    <p class="text-xs font-bold  tracking-widest opacity-60">Belum ada
                                        bukti</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">

                    <!-- Registration QR & Quick Info -->
                    <div
                        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden relative group">
                        <!-- Top Accent -->
                        <div class="absolute top-0 left-0 w-full h-1 bg-primary"></div>

                        <div class="flex flex-col items-center text-center">
                            <h3 class="text-sm font-black text-navy uppercase tracking-widest mb-4">QR Daftar Ulang</h3>

                            <div class="relative p-3 bg-white border-2 border-primary rounded-2xl shadow-lg mb-4">
                                <!-- Use local qrcode.vue when qr_raw exists -->
                                <QrcodeVue v-if="participant?.qr_raw" :value="participant.qr_raw" :size="128"
                                    :level="'M'" background="#ffffff" foreground="#1a2e4d" render-as="svg" />
                                <div v-else
                                    class="w-32 h-32 flex flex-col items-center justify-center bg-gray-50 rounded-lg text-gray-400">
                                    <Icon icon="ph:qr-code" class="text-4xl mb-1" />
                                    <span class="text-[10px] font-bold">Belum Lunas</span>
                                </div>

                                <!-- Corner Accents -->
                                <div class="absolute -top-1 -left-1 size-3 border-t-2 border-l-2 border-primary"></div>
                                <div class="absolute -top-1 -right-1 size-3 border-t-2 border-r-2 border-primary"></div>
                                <div class="absolute -bottom-1 -left-1 size-3 border-b-2 border-l-2 border-primary">
                                </div>
                                <div class="absolute -bottom-1 -right-1 size-3 border-b-2 border-r-2 border-primary">
                                </div>
                            </div>

                            <p v-if="participant?.qr_raw"
                                class="text-[10px] font-bold text-gray-500 max-w-[180px] leading-relaxed mb-3">
                                Tunjukkan QR ini kepada panitia saat melakukan daftar ulang di lokasi.
                            </p>
                            <p v-else class="text-[10px] font-bold text-amber-600 max-w-[180px] leading-relaxed mb-3">
                                QR akan muncul setelah status pembayaran diubah ke <strong>Lunas</strong>.
                            </p>

                            <!-- Raw QR value copy -->
                            <button v-if="participant?.qr_raw" @click="copyQrRaw"
                                class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500 transition-colors">
                                <Icon icon="ph:copy" class="text-sm" />
                                Salin Kode QR
                            </button>
                        </div>
                    </div>

                    <!-- Kick Participant -->
                    <div class="bg-red-50 rounded-2xl border border-red-100 shadow-sm p-6">
                        <h3 class="text-sm font-bold text-red-600 mb-2 flex items-center gap-2">
                            <Icon icon="ph:warning-circle" class="text-lg" />
                            Kick Participant
                        </h3>
                        <p class="text-[10px] text-red-500/80 mb-4 leading-relaxed font-bold">
                            Hapus peserta dari event ini secara permanen. Tindakan ini juga akan menghapus data target
                            dan
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
            <BaseDialogForm v-model="showKickDialog" @close="showKickDialog = false">
                <template #header>
                    <div class="flex items-center gap-3">
                        <div class="size-10 bg-red-50 rounded-xl flex items-center justify-center shadow-inner">
                            <Icon icon="ph:user-minus-bold" class="text-xl text-red-600" />
                        </div>
                        <h2 class="text-xl font-black text-navy">Keluarkan Peserta?</h2>
                    </div>
                </template>
                <div class="space-y-4">
                    <div class="flex flex-col items-center text-center gap-4">
                        <div class="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center">
                            <Icon icon="ph:warning-circle" class="text-4xl text-red-500" />
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-navy mb-2">Keluarkan Peserta?</h3>
                            <p class="text-gray-500 text-sm leading-relaxed">
                                Apakah Anda yakin ingin mengeluarkan <span class="font-bold text-navy">{{
                                    participant?.full_name
                                }}</span> dari event ini?
                            </p>
                            <p class="text-red-600 text-xs mt-2 font-semibold">
                                Tindakan ini akan menghapus semua data target dan skor yang terkait dan tidak dapat
                                dibatalkan.
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

        <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />
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
const showMediaLibrary = ref(false)
const categorySearch = ref('')

const filteredCategories = computed(() => {
    let list = [...categories.value]

    // Sort: registered ones first
    list.sort((a, b) => {
        const aIsReg = form.category_ids.includes(a.id)
        const bIsReg = form.category_ids.includes(b.id)
        if (aIsReg && !bIsReg) return -1
        if (!aIsReg && bIsReg) return 1
        return 0
    })

    if (!categorySearch.value) return list
    const search = categorySearch.value.toLowerCase()
    return list.filter(c =>
        c.label.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search)
    )
})

const form = reactive({
    category_ids: [],
    payment_status: 'menunggu acc',
    payment_amount: 0,
    payment_proof_urls: []
})

const toggleCategory = (id) => {
    const index = form.category_ids.indexOf(id)
    if (index === -1) form.category_ids.push(id)
    else form.category_ids.splice(index, 1)
}

const paymentStatusOptions = [
    { label: 'Lunas', value: 'lunas' },
    { label: 'Menunggu ACC', value: 'menunggu acc' }
]

const targetNumberText = computed(() => {
    return participant.value?.target_name || 'Belum Ditentukan'
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
            form.category_ids = [...new Set(found.categories?.map(c => c.category_id) || (found.category_id ? [found.category_id] : []))]
            form.payment_status = found.payment_status || 'menunggu acc'
            form.payment_amount = found.payment_amount || 0
            form.payment_proof_urls = found.payment_proof_urls ? (Array.isArray(found.payment_proof_urls) ? found.payment_proof_urls : found.payment_proof_urls.split(',')) : []
        }

        // Fetch event details and categories
        const [eventRes, categoriesRes] = await Promise.all([
            get(`/events/${eventId}`),
            get(`/events/${eventId}/categories?limit=500`)
        ])
        event.value = eventRes
        categories.value = categoriesRes.events.map(cat => ({
            id: cat.id,
            label: formatCategoryName(cat),
            description: `${cat.event_type_name || ''} ${cat.gender_division_name ? '(' + cat.gender_division_name + ')' : ''}`.trim()
        }))
    } catch (error) {
        console.error('Failed to fetch participant:', error)
        toast.error('Gagal memuat data peserta')
    } finally {
        isLoading.value = false
    }
}

const handleMediaSelect = (media) => {
    if (media?.url) {
        form.payment_proof_urls.push(media.url)
        toast.success('Bukti pembayaran berhasil ditambahkan')
    }
}

const removeProof = (index) => {
    form.payment_proof_urls.splice(index, 1)
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

const getDisplayStatus = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'menunggu' || s === 'menunggu acc' || !s) return 'Menunggu ACC'
    return s
}

const getStatusClass = (status) => {
    switch (status) {
        case 'lunas':
            return 'bg-green-50 text-green-600 border-green-200'
        case 'menunggu':
        case 'menunggu acc':
        default:
            return 'bg-amber-50 text-amber-600 border-amber-200'
    }
}

const getSourceLabel = (source) => {
    switch (source) {
        case 'invited': return 'Diundang'
        case 'admin_created': return 'Dibuat Admin'
        case 'self_register':
        default: return 'Daftar Sendiri'
    }
}

const getSourceClass = (source) => {
    switch (source) {
        case 'invited': return 'bg-purple-50 text-purple-600 border-purple-200'
        case 'admin_created': return 'bg-blue-50 text-blue-600 border-blue-200'
        case 'self_register':
        default: return 'bg-gray-50 text-gray-500 border-gray-200'
    }
}

const getSourceIcon = (source) => {
    switch (source) {
        case 'invited': return 'ph:envelope-open'
        case 'admin_created': return 'ph:shield-star'
        case 'self_register':
        default: return 'ph:user-circle'
    }
}

const copyQrRaw = async () => {
    if (!participant.value?.qr_raw) return
    try {
        await navigator.clipboard.writeText(participant.value.qr_raw)
        toast.success('Kode QR berhasil disalin!')
    } catch {
        toast.error('Gagal menyalin kode QR.')
    }
}

const handleSubmit = async () => {
    isSubmitting.value = true
    try {
        const payload = {
            category_ids: form.category_ids,
            payment_status: form.payment_status,
            payment_amount: parseFloat(form.payment_amount) || 0,
            payment_proof_urls: form.payment_proof_urls,
            athlete_id: participant.value?.archer_id // Or participant.value?.athlete_code
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

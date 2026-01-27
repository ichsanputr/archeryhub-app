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
                    <div class="flex items-start gap-4">
                        <!-- Icon Badge -->
                        <div
                            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Icon icon="ph:pencil-simple" class="text-primary text-2xl" />
                        </div>

                        <!-- Title Section -->
                        <div class="flex-1">
                            <div class="flex items-center gap-2 text-sm text-slate-300 mb-2 font-bold tracking-tight">
                                <NuxtLink :to="`/dashboard/events/${route.params.id}/participants`"
                                    class="hover:text-white transition-colors">
                                    Daftar Peserta
                                </NuxtLink>
                                <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                                <NuxtLink
                                    :to="`/dashboard/events/${route.params.id}/participants/${route.params.participantId}`"
                                    class="hover:text-white transition-colors">
                                    Detail
                                </NuxtLink>
                                <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                                <span class="text-white">Edit</span>
                            </div>
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
                                Edit Peserta
                            </h1>
                            <p class="text-slate-300 text-sm max-w-2xl">
                                Ubah informasi peserta event
                            </p>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3 flex-shrink-0">
                        <BaseButton variant="white" icon="ph:arrow-left" class="h-11 px-5"
                            @click="$router.push(`/dashboard/events/${route.params.id}/participants/${route.params.participantId}`)">
                            Batal
                        </BaseButton>
                        <BaseButton variant="primary" icon="ph:floppy-disk"
                            class="h-11 px-5 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                            @click="handleSubmit" :loading="isSubmitting">
                            Simpan Perubahan
                        </BaseButton>
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

        <!-- Edit Form -->
        <form v-else-if="participant" @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Form -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Participant Info -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                        <Icon icon="ph:user" class="text-primary" />
                        Informasi Peserta
                    </h2>
                    <div class="space-y-4">
                        <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div
                                class="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center text-navy font-bold text-xl uppercase border border-gray-200">
                                {{participant.full_name?.split(' ').map(n => n[0]).join('') || 'U'}}
                            </div>
                            <div>
                                <p class="font-bold text-navy">{{ participant.full_name }}</p>
                                <p class="text-sm text-gray-500">{{ participant.athlete_code || '-' }}</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <BaseSelect v-model="form.category_id" label="Kategori Event" required
                                placeholder="Pilih Kategori" icon="ph:trophy" :items="categories" item-title="label"
                                item-value="id" />

                            <BaseInput v-model.number="form.session" type="number" label="Sesi" placeholder="1-4"
                                icon="ph:timer" min="1" max="4" />
                        </div>
                    </div>
                </div>

                <!-- Payment Info -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                        <Icon icon="ph:currency-circle-dollar" class="text-primary" />
                        Informasi Pembayaran
                    </h2>
                    <div class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <BaseSelect v-model="form.status" label="Status Pendaftaran" required icon="ph:checks"
                                :items="statusOptions" />

                            <BaseInput v-model.number="form.payment_amount" type="number" label="Jumlah Pembayaran"
                                placeholder="0" icon="ph:money" min="0" step="0.01" />

                            <BaseSelect v-model="form.accreditation_status" label="Status Akreditasi" required
                                icon="ph:shield-check" :items="accreditationOptions" />
                        </div>

                        <!-- Payment Proof Images -->
                        <div class="pt-4 border-t border-gray-100">
                            <label class="block text-sm font-bold text-gray-700 mb-4">Bukti Pembayaran</label>

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
                                <p class="text-xs">Belum ada bukti pembayaran yang diunggah</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Info Card -->
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

                <!-- Tips -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="text-sm font-bold text-navy mb-3">Tips</h3>
                    <ul class="space-y-2 text-xs text-gray-500">
                        <li class="flex items-start gap-2">
                            <Icon icon="ph:check-circle" class="text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Pastikan kategori yang dipilih sesuai dengan divisi peserta</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <Icon icon="ph:check-circle" class="text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Nomor target akan diassign pada modul khusus target</span>
                        </li>
                    </ul>
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
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { definePageMeta } from '#imports'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const { get, put } = useApi()
const toast = useToast()

const eventId = route.params.id
const participantId = route.params.participantId
const isLoading = ref(true)
const participant = ref(null)
const event = ref(null)
const categories = ref([])
const isSubmitting = ref(false)

const statusOptions = [
    { title: 'Menunggu Acc', value: 'Menunggu Acc', icon: 'ph:hourglass' },
    { title: 'Terdaftar', value: 'Terdaftar', icon: 'ph:check-circle' }
]

const accreditationOptions = [
    { title: 'Pending', value: 'pending', icon: 'ph:clock', description: 'Menunggu verifikasi admin' },
    { title: 'Disetujui', value: 'approved', icon: 'ph:check-circle', description: 'Peserta telah diverifikasi' },
    { title: 'Ditolak', value: 'rejected', icon: 'ph:x-circle', description: 'Pendaftaran tidak valid' }
]

const form = reactive({
    category_id: '',
    session: null,
    status: 'Menunggu Acc',
    payment_amount: 0,
    payment_proof_urls: [],
    accreditation_status: 'pending'
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
            form.session = found.session || null
            form.status = found.status || 'Menunggu Acc'
            form.payment_amount = found.payment_amount || 0
            form.payment_proof_urls = found.payment_proof_urls ? found.payment_proof_urls.split(',') : []
            form.accreditation_status = found.accreditation_status || 'pending'
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
    const parts = []
    if (category.division_name) parts.push(category.division_name)
    if (category.category_name) parts.push(category.category_name)
    return parts.join(' - ') || 'Kategori'
}

const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD'
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

const handleSubmit = async () => {
    if (!form.category_id) {
        toast.error('Pilih kategori event terlebih dahulu')
        return
    }

    isSubmitting.value = true
    try {
        // Update participant via API
        const payload = {
            category_id: form.category_id,
            session: form.session || null,
            status: form.status,
            payment_amount: form.payment_amount || 0,
            payment_proof_urls: form.payment_proof_urls,
            accreditation_status: form.accreditation_status
        }

        await put(`/events/${eventId}/participants/${participantId}`, payload)
        toast.success('Peserta berhasil diupdate')
        router.push(`/dashboard/events/${eventId}/participants`)
    } catch (error) {
        console.error('Failed to update participant:', error)
        toast.error(error.response?.data?.error || 'Gagal mengupdate peserta')
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
    fetchParticipant()
})
</script>

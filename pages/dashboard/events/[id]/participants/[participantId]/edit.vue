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
                        Informasi Profil Peserta
                    </h2>
                    <div class="space-y-6">
                        <!-- If Event Archer, show editable fields -->
                        <template v-if="participant.event_archer_id">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <BaseInput v-model="form.event_archer.full_name" label="Nama Lengkap" required
                                    placeholder="Nama Sesuai KTP" icon="ph:user-focus" />

                                <BaseInput v-model="form.event_archer.email" label="Email" type="email"
                                    placeholder="email@example.com" icon="ph:envelope" />

                                <BaseInput v-model="form.event_archer.phone" label="No. WhatsApp" placeholder="0812..."
                                    icon="ph:whatsapp-logo" />

                                <BaseSelect v-model="form.event_archer.club_id" label="Klub / Sekolah"
                                    placeholder="Pilih Klub" icon="ph:buildings" :items="clubs" item-title="name"
                                    item-value="uuid" />

                                <BaseInput v-model="form.event_archer.city" label="Kota / Kabupaten"
                                    placeholder="Asal Kota" icon="ph:map-pin" />

                                <BaseSelect v-model="form.event_archer.gender" label="Jenis Kelamin"
                                    :items="[{ title: 'Laki-laki', value: 'male' }, { title: 'Perempuan', value: 'female' }]"
                                    icon="ph:gender-intersex" />
                            </div>
                        </template>

                        <!-- If Global Archer, show read-only info -->
                        <div v-else class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div
                                class="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center text-navy font-bold text-xl uppercase border border-gray-200 overflow-hidden">
                                <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)"
                                    class="w-full h-full object-cover">
                            </div>
                            <div>
                                <p class="font-bold text-navy truncate">{{ participant.full_name }}</p>
                                <div class="flex items-center gap-2 mt-1">
                                    <span class="text-xs text-gray-500 font-medium">@{{ participant.username ||
                                        'user' }}</span>
                                    <span v-if="participant.archer_id"
                                        class="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Akun
                                        Terverifikasi</span>
                                    <span v-else
                                        class="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-wider">Guest
                                        Registrant</span>
                                </div>
                            </div>
                        </div>

                        <div class="pt-6 border-t border-gray-50">
                            <h3 class="text-sm font-bold text-navy mb-4">Informasi Lomba</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <BaseSelect v-model="form.category_id" label="Kategori Event" required
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
                        Informasi Pembayaran
                    </h2>
                    <div class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <BaseSelect v-model="form.status" label="Status Pendaftaran" required icon="ph:checks"
                                :items="statusOptions" />

                            <BaseInput v-model="form.payment_amount" label="Jumlah Pembayaran" placeholder="0"
                                icon="ph:money" kind="currency" />
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
                <!-- Danger Zone -->
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
                        class="h-10 text-xs shadow-lg shadow-red-200" @click="handleKickUser" :loading="isKicking">
                        Keluarkan Peserta
                    </BaseButton>
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
const clubs = ref([])
const isSubmitting = ref(false)
const isKicking = ref(false)

const statusOptions = [
    { title: 'Menunggu Acc', value: 'Menunggu Acc', icon: 'ph:hourglass' },
    { title: 'Terdaftar', value: 'Terdaftar', icon: 'ph:check-circle' }
]

const form = reactive({
    category_id: '',
    status: 'Menunggu Acc',
    payment_amount: 0,
    payment_proof_urls: [],
    // Event Archer details
    event_archer: {
        full_name: '',
        email: '',
        phone: '',
        city: '',
        school: '',
        club_id: '',
        bow_type: '',
        gender: ''
    }
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

            // If event_archer_id exists, fetch archer details
            if (found.event_archer_id) {
                try {
                    const archersRes = await get(`/events/${eventId}/event-archers`)
                    const archerData = archersRes.data?.find(a => a.id === found.event_archer_id)
                    if (archerData) {
                        form.event_archer = {
                            full_name: archerData.full_name || '',
                            email: archerData.email || '',
                            phone: archerData.phone || '',
                            city: archerData.city || '',
                            school: archerData.school || '',
                            club_id: archerData.club_id || '',
                            bow_type: archerData.bow_type || '',
                            gender: archerData.gender || ''
                        }
                    }
                } catch (e) {
                    console.error('Failed to fetch event archer details', e)
                }
            }
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

        // Fetch clubs
        const clubsRes = await get('/clubs?limit=1000')
        clubs.value = clubsRes.clubs || []
    } catch (error) {
        console.error('Failed to fetch participant:', error)
        const errorMessage = error?.data?.error || error?.response?.data?.error || error?.message || 'Gagal memuat data peserta'
        toast.error(errorMessage)
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
            status: form.status,
            payment_amount: form.payment_amount || 0,
            payment_proof_urls: form.payment_proof_urls
        }

        // If it's an event archer, update its profile first
        if (participant.value?.event_archer_id) {
            // Sanitize payload: convert empty strings to null to avoid validation errors
            const archerPayload = { ...form.event_archer }
            Object.keys(archerPayload).forEach(key => {
                if (archerPayload[key] === '') {
                    archerPayload[key] = null
                }
            })

            await put(`/events/${eventId}/event-archers/${participant.value.event_archer_id}`, {
                ...archerPayload,
                status: 'active'
            })
        }

        // Use stable UUID if available, otherwise fallback to route param
        const targetId = participant.value?.id || participantId
        await put(`/events/${eventId}/participants/${targetId}`, payload)
        toast.success('Peserta berhasil diupdate')
        router.push(`/dashboard/events/${eventId}/participants/${targetId}`)
    } catch (error) {
        console.error('Failed to update participant:', error)
        const errorMessage = error?.data?.error || error?.response?.data?.error || error?.message || 'Gagal mengupdate peserta'
        toast.error(errorMessage)
    } finally {
        isSubmitting.value = false
    }
}

const handleKickUser = async () => {
    if (!confirm('Apakah Anda yakin ingin mengeluarkan peserta ini dari event? Semua data pendaftaran dan skor akan dihapus secara permanen.')) {
        return
    }

    isKicking.value = true
    try {
        const { delete: del } = useApi()
        await del(`/events/${eventId}/participants/${participantId}`)
        toast.success('Peserta berhasil dikeluarkan')
        router.push(`/dashboard/events/${eventId}/participants`)
    } catch (error) {
        console.error('Failed to kick user:', error)
        toast.error(error.response?.data?.error || 'Gagal mengeluarkan peserta')
    } finally {
        isKicking.value = false
    }
}

onMounted(() => {
    fetchParticipant()
})
</script>

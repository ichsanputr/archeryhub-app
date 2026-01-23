<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Enhanced Header -->
        <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-20" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px);"></div>
            
            <!-- Decorative Background Elements -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
            
            <!-- Header Content -->
            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="flex items-start gap-4">
                        <!-- Icon Badge -->
                        <div class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Icon icon="ph:user" class="text-primary text-2xl" />
                        </div>
                        
                        <!-- Title Section -->
                        <div class="flex-1">
                            <div class="flex items-center gap-2 text-sm text-slate-300 mb-2 font-bold tracking-tight">
                                <NuxtLink :to="`/dashboard/events/${route.params.id}/participants`" class="hover:text-white transition-colors">
                                    Daftar Peserta
                                </NuxtLink>
                                <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                                <span class="text-white">Detail Peserta</span>
                            </div>
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
                                {{ participant?.full_name || 'Detail Peserta' }}
                            </h1>
                            <p class="text-slate-300 text-sm max-w-2xl">
                                Informasi lengkap peserta event
                            </p>
                        </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="flex gap-3 flex-shrink-0">
                        <BaseButton 
                            variant="white" 
                            icon="ph:arrow-left" 
                            class="h-11 px-5"
                            @click="$router.push(`/dashboard/events/${route.params.id}/participants`)">
                            Kembali
                        </BaseButton>
                        <BaseButton 
                            :to="`/dashboard/events/${route.params.id}/participants/${route.params.participantId}/edit`"
                            variant="primary" 
                            icon="ph:pencil-simple" 
                            class="h-11 px-5 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all">
                            Edit Peserta
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div class="inline-block h-8 w-8 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
            <p class="text-gray-500 mt-4 font-medium">Memuat data peserta...</p>
        </div>

        <!-- Participant Details -->
        <div v-else-if="participant" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Profile Card -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                        <Icon icon="ph:user-circle" class="text-primary" />
                        Profil Peserta
                    </h2>
                    <div class="flex items-start gap-6">
                        <div class="h-24 w-24 rounded-xl bg-gray-100 flex items-center justify-center text-navy font-bold text-2xl uppercase border border-gray-200 flex-shrink-0">
                            {{ participant.full_name?.split(' ').map(n => n[0]).join('') || 'U' }}
                        </div>
                        <div class="flex-1 space-y-4">
                            <div>
                                <h3 class="text-xl font-black text-navy mb-1">{{ participant.full_name }}</h3>
                                <p class="text-sm text-gray-500">{{ participant.athlete_code || 'Tidak ada kode atlet' }}</p>
                            </div>
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p class="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Klub</p>
                                    <p class="text-navy font-semibold">{{ participant.club_name || '-' }}</p>
                                </div>
                                <div>
                                    <p class="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Negara</p>
                                    <p class="text-navy font-semibold">{{ participant.country || '-' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Event Registration Info -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                        <Icon icon="ph:clipboard-text" class="text-primary" />
                        Informasi Pendaftaran
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p class="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Divisi / Kategori</p>
                            <p class="text-navy font-bold text-sm">{{ participant.division_name || '-' }}</p>
                            <p class="text-gray-500 text-xs mt-1">{{ participant.category_name || '-' }}</p>
                        </div>
                        <div>
                            <p class="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Nomor Punggung</p>
                            <p class="text-navy font-bold text-lg">{{ participant.back_number || '-' }}</p>
                        </div>
                        <div>
                            <p class="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Sesi</p>
                            <p class="text-navy font-bold text-lg">{{ participant.session || '-' }}</p>
                        </div>
                        <div>
                            <p class="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Tanggal Pendaftaran</p>
                            <p class="text-navy font-semibold">{{ formatDate(participant.registration_date) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Payment Info -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                        <Icon icon="ph:currency-circle-dollar" class="text-primary" />
                        Informasi Pembayaran
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p class="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Status Pembayaran</p>
                            <span :class="participant.payment_status === 'paid' ? 'bg-green-50 text-green-600 border-green-100' : participant.payment_status === 'failed' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'"
                                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border">
                                {{ getPaymentStatusLabel(participant.payment_status) }}
                            </span>
                        </div>
                        <div>
                            <p class="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Jumlah Pembayaran</p>
                            <p class="text-navy font-bold text-lg">Rp {{ formatCurrency(participant.payment_amount || 0) }}</p>
                        </div>
                        <div>
                            <p class="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Status Akreditasi</p>
                            <span :class="participant.accreditation_status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' : participant.accreditation_status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-600 border-gray-100'"
                                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border">
                                {{ getAccreditationStatusLabel(participant.accreditation_status) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Quick Actions -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="text-sm font-bold text-navy mb-4 flex items-center gap-2">
                        <Icon icon="ph:lightning" class="text-primary" />
                        Aksi Cepat
                    </h3>
                    <div class="space-y-2">
                        <BaseButton variant="white" block icon="ph:target" @click="assignTarget">
                            Assign Target
                        </BaseButton>
                        <BaseButton variant="white" block icon="ph:file-text" @click="viewScorecard">
                            Lihat Scorecard
                        </BaseButton>
                        <BaseButton variant="white" block icon="ph:printer" @click="printAccreditation">
                            Cetak Akreditasi
                        </BaseButton>
                    </div>
                </div>

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
        </div>

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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const { get } = useApi()
const toast = useToast()

const eventId = route.params.id
const participantId = route.params.participantId
const isLoading = ref(true)
const participant = ref(null)
const event = ref(null)

const fetchParticipant = async () => {
    isLoading.value = true
    try {
        // Fetch all participants and find the one we need
        const response = await get(`/events/${eventId}/participants`)
        if (response && response.participants) {
            participant.value = response.participants.find(p => p.id === participantId)
        }
        
        // Fetch event details
        const eventRes = await get(`/events/${eventId}`)
        event.value = eventRes
    } catch (error) {
        console.error('Failed to fetch participant:', error)
        toast.error('Gagal memuat data peserta')
    } finally {
        isLoading.value = false
    }
}

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount)
}

const getPaymentStatusLabel = (status) => {
    const labels = {
        'lunas': 'Lunas',
        'belum_lunas': 'Belum Lunas',
        'menunggu_acc': 'Menunggu ACC'
    }
    return labels[status] || status
}

const getPaymentStatusClass = (status) => {
    const classes = {
        'lunas': 'bg-green-50 text-green-600 border-green-100',
        'belum_lunas': 'bg-yellow-50 text-yellow-600 border-yellow-100',
        'menunggu_acc': 'bg-blue-50 text-blue-600 border-blue-100'
    }
    return classes[status] || 'bg-gray-50 text-gray-600 border-gray-100'
}

const getAccreditationStatusLabel = (status) => {
    const labels = {
        'approved': 'Disetujui',
        'pending': 'Pending',
        'rejected': 'Ditolak'
    }
    return labels[status] || status
}

const assignTarget = () => {
    // TODO: Navigate to target assignment
    toast.info('Fitur assign target akan segera tersedia')
}

const viewScorecard = () => {
    // TODO: Navigate to scorecard
    toast.info('Fitur scorecard akan segera tersedia')
}

const printAccreditation = () => {
    // TODO: Print accreditation
    toast.info('Fitur cetak akreditasi akan segera tersedia')
}

onMounted(() => {
    fetchParticipant()
})
</script>

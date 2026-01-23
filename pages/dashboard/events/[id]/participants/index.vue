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
                            <Icon icon="ph:users-three" class="text-primary text-2xl" />
                        </div>
                        
                        <!-- Title Section -->
                        <div class="flex-1">
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
                                Daftar Peserta Event
                            </h1>
                            <p class="text-slate-300 text-sm max-w-2xl">
                                Lihat dan kelola semua peserta yang terdaftar dalam event ini.
                            </p>
                        </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="flex gap-3 flex-shrink-0">
                        <BaseButton variant="white" icon="ph:download" class="h-11 px-5">
                            Export CSV
                        </BaseButton>
                        <BaseButton variant="white" icon="ph:funnel" class="h-11 px-5">
                            Filter
                        </BaseButton>
                        <BaseButton 
                            :to="`/dashboard/events/${route.params.id}/participants/add`" 
                            variant="primary"
                            icon="ph:plus-bold" 
                            class="h-11 px-5 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all">
                            Tambah Peserta
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div
                class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:users-three" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Peserta</p>
                    <p class="text-xl font-black text-navy">{{ participants.length }}</p>
                </div>
            </div>
            <div
                class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:check-circle" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Terverifikasi</p>
                    <p class="text-xl font-black text-navy">{{ verifiedCount }}</p>
                </div>
            </div>
            <div
                class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:clock" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pending</p>
                    <p class="text-xl font-black text-navy">{{ pendingCount }}</p>
                </div>
            </div>
            <div
                class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:buildings" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Klub</p>
                    <p class="text-xl font-black text-navy">{{ uniqueClubs }}</p>
                </div>
            </div>
        </div>

        <!-- Search and Filter -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div class="relative w-full md:w-64">
                    <Icon icon="ph:magnifying-glass"
                        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input v-model="searchQuery"
                        class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        placeholder="Cari nama, email, klub, atau kategori..." type="text">
                </div>
                <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <button v-for="div in filterDivs" :key="div" @click="activeDiv = div"
                        class="px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors"
                        :class="activeDiv === div ? 'bg-navy text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'">
                        {{ div }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Participants Table -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-50/50 border-b border-gray-100">
                        <tr class="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <th class="px-6 py-4">No</th>
                            <th class="px-6 py-4">Nama Peserta</th>
                            <th class="px-6 py-4">Klub</th>
                            <th class="px-6 py-4">Kategori Lomba</th>
                            <th class="px-6 py-4">Status Pembayaran</th>
                            <th class="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="(participant, index) in filteredParticipants" :key="participant.id"
                            class="group hover:bg-gray-50/50 transition-colors">
                            <td class="px-6 py-4">
                                <span class="text-sm font-bold text-gray-400">{{ index + 1 }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-navy font-bold text-xs uppercase border border-gray-200">
                                        {{participant.full_name?.split(' ').map(n => n[0]).join('') || 'U'}}
                                    </div>
                                    <div>
                                        <p class="font-black text-navy tracking-tight">{{ participant.full_name }}</p>
                                        <p class="text-xs text-gray-500 font-medium">{{ participant.email || '-' }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-gray-500 font-medium">{{ participant.club_name || '-' }}</td>
                            <td class="px-6 py-4">
                                <p class="text-navy font-bold text-sm">{{ getCategoryName(participant) }}</p>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    :class="getPaymentStatusClass(participant.payment_status)"
                                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border">
                                    {{ getPaymentStatusText(participant.payment_status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <NuxtLink :to="`/dashboard/events/${route.params.id}/participants/${participant.id}`" 
                                        class="p-2 text-navy/40 hover:text-navy transition-colors">
                                        <Icon icon="ph:eye" />
                                    </NuxtLink>
                                    <NuxtLink :to="`/dashboard/events/${route.params.id}/participants/${participant.id}/edit`" 
                                        class="p-2 text-navy/40 hover:text-navy transition-colors">
                                        <Icon icon="ph:pencil-simple" />
                                    </NuxtLink>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filteredParticipants.length === 0">
                            <td colspan="7" class="px-6 py-12 text-center text-gray-400 italic font-medium">
                                Tidak ada peserta yang ditemukan.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useEventContext } from '~/composables/useEventContext'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const { get } = useApi()
const { setEvent, clearEvent } = useEventContext()

const participants = ref([])
const searchQuery = ref('')
const activeDiv = ref('Semua')
const filterDivs = ['Semua', 'Recurve', 'Compound', 'Barebow']
const isLoading = ref(true)

const fetchEventDetails = async () => {
    try {
        const eventRes = await get(`/events/${route.params.id}`)
        if (eventRes) {
            setEvent(eventRes)
        }
    } catch (error) {
        console.error('Failed to fetch event details:', error)
    }
}

const fetchParticipants = async () => {
    isLoading.value = true
    try {
        const response = await get(`/events/${route.params.id}/participants`)
        participants.value = response?.participants || []
    } catch (error) {
        console.error('Failed to fetch participants:', error)
    } finally {
        isLoading.value = false
    }
}

const filteredParticipants = computed(() => {
    let filtered = participants.value

    // Filter by search query
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        filtered = filtered.filter(p =>
            p.full_name?.toLowerCase().includes(q) ||
            p.email?.toLowerCase().includes(q) ||
            p.club_name?.toLowerCase().includes(q) ||
            p.division_name?.toLowerCase().includes(q) ||
            p.category_name?.toLowerCase().includes(q) ||
            getCategoryName(p).toLowerCase().includes(q) ||
            p.athlete_code?.toLowerCase().includes(q)
        )
    }

    // Filter by division
    if (activeDiv.value !== 'Semua') {
        filtered = filtered.filter(p => p.division_name?.includes(activeDiv.value))
    }

    return filtered
})

const verifiedCount = computed(() => {
    return participants.value.filter(p => p.payment_status === 'lunas').length
})

const pendingCount = computed(() => {
    return participants.value.filter(p => p.payment_status === 'menunggu_acc' || p.payment_status === 'belum_lunas').length
})

const getPaymentStatusClass = (status) => {
    switch(status) {
        case 'lunas':
            return 'bg-green-50 text-green-600 border-green-100'
        case 'belum_lunas':
            return 'bg-yellow-50 text-yellow-600 border-yellow-100'
        case 'menunggu_acc':
            return 'bg-blue-50 text-blue-600 border-blue-100'
        default:
            return 'bg-gray-50 text-gray-600 border-gray-100'
    }
}

const getPaymentStatusText = (status) => {
    switch(status) {
        case 'lunas':
            return 'Lunas'
        case 'belum_lunas':
            return 'Belum Lunas'
        case 'menunggu_acc':
            return 'Menunggu ACC'
        default:
            return status || '-'
    }
}

const uniqueClubs = computed(() => {
    const clubs = new Set(participants.value.map(p => p.club_name).filter(Boolean))
    return clubs.size
})

const getCategoryName = (participant) => {
    if (!participant) return '-'
    
    const parts = []
    if (participant.division_name) parts.push(participant.division_name)
    if (participant.category_name) parts.push(participant.category_name)
    if (participant.event_type_name) parts.push(participant.event_type_name)
    if (participant.gender_division_name) parts.push(participant.gender_division_name)
    
    return parts.length > 0 ? parts.join(' - ') : '-'
}

onMounted(() => {
    fetchEventDetails()
    fetchParticipants()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>

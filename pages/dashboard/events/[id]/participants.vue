<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-gray-100">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
                    <NuxtLink to="/dashboard/events" class="hover:text-primary transition-colors">Events</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <NuxtLink :to="`/dashboard/events/${route.params.id}/overview`"
                        class="hover:text-primary transition-colors">Control Panel</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Peserta</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Daftar Peserta Event</h1>
                <p class="text-gray-500 font-medium mt-1">Lihat dan kelola semua peserta yang terdaftar dalam event ini.
                </p>
            </div>
            <div class="flex gap-3">
                <BaseButton :to="`/dashboard/events/${route.params.id}/participants/add`" variant="primary"
                    icon="ph:plus-bold" class="h-11 shadow-lg shadow-primary/20">
                    Tambah Peserta
                </BaseButton>
                <BaseButton variant="white" icon="ph:download" class="h-11">
                    Export CSV
                </BaseButton>
                <BaseButton variant="white" icon="ph:funnel" class="h-11">
                    Filter
                </BaseButton>
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
                        placeholder="Cari nama, klub, atau kategori..." type="text">
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
                            <th class="px-6 py-4">Divisi / Kategori</th>
                            <th class="px-6 py-4">Bantalan</th>
                            <th class="px-6 py-4">Status</th>
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
                                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                            {{ participant.athlete_code || '-' }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-gray-500 font-medium">{{ participant.club_name || '-' }}</td>
                            <td class="px-6 py-4">
                                <p class="text-navy font-bold text-xs">{{ participant.division_name || '-' }}</p>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{
                                    participant.category_name || '-' }}</p>
                            </td>
                            <td class="px-6 py-4">
                                <span v-if="participant.target_number"
                                    class="inline-flex items-center justify-center px-2 py-1 bg-navy text-primary rounded font-black text-xs shadow-sm">
                                    {{ String(participant.target_number).padStart(2, '0') }}{{ participant.back_number
                                    || '' }}
                                </span>
                                <span v-else class="text-[10px] text-gray-300 font-black uppercase italic">TBD</span>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    :class="participant.payment_status === 'paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'"
                                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border">
                                    {{ participant.payment_status === 'paid' ? 'Lunas' : 'Belum Lunas' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button class="p-2 text-gray-300 hover:text-navy transition-colors">
                                        <Icon icon="ph:eye" />
                                    </button>
                                    <button class="p-2 text-gray-300 hover:text-primary transition-colors">
                                        <Icon icon="ph:pencil-simple" />
                                    </button>
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
            p.club_name?.toLowerCase().includes(q) ||
            p.division_name?.toLowerCase().includes(q) ||
            p.category_name?.toLowerCase().includes(q) ||
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
    return participants.value.filter(p => p.payment_status === 'paid').length
})

const pendingCount = computed(() => {
    return participants.value.filter(p => p.payment_status !== 'paid').length
})

const uniqueClubs = computed(() => {
    const clubs = new Set(participants.value.map(p => p.club_name).filter(Boolean))
    return clubs.size
})

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

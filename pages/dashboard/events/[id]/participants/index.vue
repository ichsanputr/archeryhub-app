<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div class="space-y-1">
                <h1 class="text-3xl font-black text-navy tracking-tight">Daftar Peserta Event</h1>
                <p class="text-gray-500 text-sm">Lihat dan kelola semua peserta yang terdaftar dalam event ini.</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 flex-shrink-0">
                <BaseButton variant="white" icon="ph:download" class="h-11 px-5">
                    Export CSV
                </BaseButton>
                <BaseButton variant="white" icon="ph:funnel" class="h-11 px-5">
                    Filter
                </BaseButton>
                <BaseButton :to="`/dashboard/events/${route.params.id}/participants/add`" variant="primary"
                    icon="ph:plus-bold"
                    class="h-11 px-5 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all">
                    Tambah Peserta
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
                    <p class="text-xl font-black text-navy">{{ total }}</p>
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
                            <th class="px-6 py-4">Status</th>
                            <th class="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="(participant, index) in filteredParticipants" :key="participant.id"
                            class="group hover:bg-gray-50/50 transition-colors">
                            <td class="px-6 py-4">
                                <span class="text-sm font-bold text-gray-400">{{ (page - 1) * limit + index + 1
                                }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-navy font-bold text-xs uppercase border border-gray-200 overflow-hidden">
                                        <img v-if="participant.avatar_url" :src="participant.avatar_url"
                                            class="w-full h-full object-cover">
                                        <template v-else>
                                            {{participant.full_name?.split(' ').map(n => n[0]).join('') || 'U'}}
                                        </template>
                                    </div>
                                    <div>
                                        <p class="font-black text-navy tracking-tight">{{ participant.full_name }}</p>
                                        <p class="text-xs text-gray-500 font-medium">{{ participant.email || '-' }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-gray-500 font-medium text-xs">{{ participant.club_name || '-' }}
                            </td>
                            <td class="px-6 py-4">
                                <p class="text-navy font-bold text-sm">{{ getCategoryName(participant) }}</p>
                            </td>
                            <td class="px-6 py-4">
                                <span :class="getStatusClass(participant.status)"
                                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border">
                                    {{ participant.status || 'Menunggu Acc' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <NuxtLink
                                        :to="`/dashboard/events/${route.params.id}/participants/${participant.id}/edit`"
                                        class="p-2 text-navy/40 hover:text-navy transition-colors">
                                        <Icon icon="ph:pencil-simple" />
                                    </NuxtLink>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filteredParticipants.length === 0">
                            <td colspan="6" class="px-6 py-12 text-center text-gray-400 italic font-medium">
                                Tidak ada peserta yang ditemukan.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Controls -->
            <div v-if="totalPages > 1 && !searchQuery"
                class="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Showing {{ (page - 1) * limit + 1 }} to {{ Math.min(page * limit, total) }} of {{ total }}
                    participants
                </div>
                <div class="flex items-center gap-2">
                    <button @click="changePage(page - 1)" :disabled="page === 1"
                        class="p-2 rounded-lg border border-gray-200 bg-white text-navy/60 hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <Icon icon="ph:caret-left-bold" />
                    </button>

                    <div class="flex items-center gap-1">
                        <button v-for="p in totalPages" :key="p" @click="changePage(p)"
                            class="h-10 w-10 rounded-lg border text-sm font-black transition-all" :class="page === p
                                ? 'bg-navy border-navy text-white shadow-md'
                                : 'bg-white border-gray-200 text-navy/60 hover:bg-gray-50 hover:text-navy'">
                            {{ p }}
                        </button>
                    </div>

                    <button @click="changePage(page + 1)" :disabled="page === totalPages"
                        class="p-2 rounded-lg border border-gray-200 bg-white text-navy/60 hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <Icon icon="ph:caret-right-bold" />
                    </button>
                </div>
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
const total = ref(0)
const verifiedCount = ref(0)
const pendingCount = ref(0)
const page = ref(1)
const limit = ref(10)
const totalPages = computed(() => Math.ceil(total.value / limit.value))

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
        const offset = (page.value - 1) * limit.value
        const response = await get(`/events/${route.params.id}/participants?limit=${limit.value}&offset=${offset}`)
        participants.value = response?.participants || []
        total.value = response?.total || 0
        verifiedCount.value = response?.verified_count || 0
        pendingCount.value = response?.pending_count || 0
    } catch (error) {
        console.error('Failed to fetch participants:', error)
    } finally {
        isLoading.value = false
    }
}

const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
        page.value = newPage
        fetchParticipants()
        // Scroll to top of table
        window.scrollTo({ top: 0, behavior: 'smooth' })
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

const getStatusClass = (status) => {
    switch (status) {
        case 'Terdaftar':
            return 'bg-green-50 text-green-600 border-green-100'
        case 'Menunggu Acc':
            return 'bg-blue-50 text-blue-600 border-blue-100'
        default:
            return 'bg-gray-50 text-gray-600 border-gray-100'
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

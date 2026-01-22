<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
                <div
                    class="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                    <NuxtLink to="/dashboard/events" class="hover:text-primary transition-colors">Events</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[10px]" />
                    <NuxtLink :to="`/dashboard/events/${route.params.id}/overview`"
                        class="hover:text-primary transition-colors">Control Panel</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[10px]" />
                    <span class="text-navy">Tim</span>
                </div>
                <h1 class="text-3xl font-black text-navy tracking-tight">Manajemen Tim</h1>
                <p class="text-gray-500 font-medium mt-1">Kelola tim dan peserta grup dalam event ini.</p>
            </div>
            <div class="flex gap-3">
                <BaseButton variant="white" icon="ph:download" class="h-11">
                    Export CSV
                </BaseButton>
            </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:users-four" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Tim</p>
                    <p class="text-xl font-black text-navy">{{ teams.length }}</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:users-three" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Anggota</p>
                    <p class="text-xl font-black text-navy">{{ totalMembers }}</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:trophy" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kategori</p>
                    <p class="text-xl font-black text-navy">{{ uniqueCategories }}</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:medal" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Rata-rata Skor</p>
                    <p class="text-xl font-black text-navy">{{ averageScore }}</p>
                </div>
            </div>
        </div>

        <!-- Search & Filter -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div class="relative w-full md:w-64">
                    <Icon icon="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input v-model="searchQuery"
                        class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        placeholder="Cari nama tim..." type="text">
                </div>
                <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <button v-for="cat in filterCategories" :key="cat" @click="activeCategory = cat"
                        class="px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors"
                        :class="activeCategory === cat ? 'bg-navy text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'">
                        {{ cat }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Teams Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="team in filteredTeams" :key="team.id"
                class="team-card group">
                <!-- Team Header with Avatar -->
                <div class="p-6 border-b border-gray-100">
                    <div class="flex items-start gap-4">
                        <!-- Team Avatar -->
                        <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-primary font-black text-lg shrink-0 group-hover:scale-105 transition-transform shadow-lg">
                            {{ getTeamInitials(team.team_name) }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between gap-2 mb-2">
                                <h3 class="font-black text-navy text-lg tracking-tight leading-tight group-hover:text-primary transition-colors truncate">
                                    {{ team.team_name }}
                                </h3>
                                <span
                                    class="status-badge shrink-0"
                                    :class="team.status === 'active' ? 'active' : 'inactive'">
                                    {{ team.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                </span>
                            </div>
                            <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">{{ team.category_name || 'Kategori Tidak Ditentukan' }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4 mt-4 text-sm">
                        <div class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl">
                            <Icon icon="ph:users" class="text-gray-400" />
                            <span class="text-gray-600 font-bold">{{ team.member_count || 0 }} Anggota</span>
                        </div>
                        <div class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl">
                            <Icon icon="ph:trophy" class="text-gray-400" />
                            <span class="text-gray-600 font-bold">Rank #{{ team.rank || '-' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Team Stats -->
                <div class="p-6 space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Total Skor</span>
                            <span class="text-xl font-black text-navy tabular-nums">{{ team.total_score || 0 }}</span>
                        </div>
                        <div class="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">X+10</span>
                            <span class="text-xl font-black text-navy tabular-nums">{{ team.total_x_count || 0 }}</span>
                        </div>
                    </div>
                    <div v-if="team.members && team.members.length > 0" class="pt-3 border-t border-gray-100">
                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Anggota Tim</p>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="(member, idx) in team.members.slice(0, 4)" :key="idx"
                                class="member-chip">
                                <span class="h-5 w-5 rounded-full bg-navy/10 flex items-center justify-center text-[9px] font-bold text-navy">
                                    {{ getMemberInitials(member.name || `A${idx + 1}`) }}
                                </span>
                                {{ member.name || `Anggota ${idx + 1}` }}
                            </span>
                            <span v-if="team.members.length > 4"
                                class="member-chip overflow">
                                +{{ team.members.length - 4 }} lagi
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex gap-2">
                    <BaseButton variant="white" size="sm" icon="ph:eye" class="flex-1" @click="viewTeam(team)">
                        Detail
                    </BaseButton>
                    <BaseButton variant="outline" size="sm" icon="ph:pencil-simple" class="flex-1" @click="editTeam(team)">
                        Edit
                    </BaseButton>
                    <button @click="deleteTeam(team)"
                        class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Icon icon="ph:trash" class="text-lg" />
                    </button>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredTeams.length === 0" class="col-span-full">
                <div class="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
                    <div class="h-24 w-24 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl flex items-center justify-center text-gray-300 mb-6 shadow-inner">
                        <Icon icon="ph:users-four" class="text-5xl" />
                    </div>
                    <h3 class="text-2xl font-black text-navy mb-3">Belum Ada Tim</h3>
                    <p class="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">Tim akan otomatis dibuat dari fase kualifikasi. Silakan selesaikan fase kualifikasi terlebih dahulu.</p>
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
import { useToast } from '~/composables/useToast'
import { useEventContext } from '~/composables/useEventContext'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const { get, delete: del } = useApi()
const toast = useToast()
const { setEvent, clearEvent } = useEventContext()

const teams = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const activeCategory = ref('Semua')

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

const fetchTeams = async () => {
    isLoading.value = true
    try {
        const response = await get(`/events/${route.params.id}/teams`)
        teams.value = response?.teams || []
    } catch (error) {
        console.error('Failed to fetch teams:', error)
        toast.error('Gagal mengambil data tim')
    } finally {
        isLoading.value = false
    }
}

const filteredTeams = computed(() => {
    let filtered = teams.value

    // Filter by search query
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        filtered = filtered.filter(t =>
            t.team_name?.toLowerCase().includes(q) ||
            t.category_name?.toLowerCase().includes(q)
        )
    }

    // Filter by category
    if (activeCategory.value !== 'Semua') {
        filtered = filtered.filter(t => t.category_name === activeCategory.value)
    }

    return filtered
})

const filterCategories = computed(() => {
    const categories = ['Semua', ...new Set(teams.value.map(t => t.category_name).filter(Boolean))]
    return categories
})

const totalMembers = computed(() => {
    return teams.value.reduce((sum, team) => sum + (team.member_count || 0), 0)
})

const uniqueCategories = computed(() => {
    return new Set(teams.value.map(t => t.category_name).filter(Boolean)).size
})

const averageScore = computed(() => {
    if (teams.value.length === 0) return 0
    const total = teams.value.reduce((sum, team) => sum + (team.total_score || 0), 0)
    return Math.round(total / teams.value.length)
})

// Helper functions for initials
const getTeamInitials = (name) => {
    if (!name) return '??'
    const words = name.trim().split(/\s+/)
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
    return (words[0][0] + words[1][0]).toUpperCase()
}

const getMemberInitials = (name) => {
    if (!name) return '?'
    const words = name.trim().split(/\s+/)
    if (words.length === 1) return words[0].substring(0, 1).toUpperCase()
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

const viewTeam = (team) => {
    console.log('View team:', team)
}

const editTeam = (team) => {
    console.log('Edit team:', team)
}

const deleteTeam = async (team) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus tim "${team.team_name}"?`)) return

    try {
        await del(`/events/${route.params.id}/teams/${team.id}`)
        toast.success('Tim berhasil dihapus')
        fetchTeams()
    } catch (error) {
        toast.error('Gagal menghapus tim')
    }
}

onMounted(() => {
    fetchEventDetails()
    fetchTeams()
})

onBeforeUnmount(() => {
    clearEvent()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Team Card Styles */
.team-card {
    background-color: #ffffff;
    border-radius: 1.25rem;
    border: 1px solid #f3f4f6;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: all 0.3s ease;
}

.team-card:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: rgba(217, 255, 0, 0.3);
    transform: translateY(-2px);
}

/* Status Badge */
.status-badge {
    padding: 0.25rem 0.625rem;
    border-radius: 0.5rem;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.status-badge.active {
    background-color: rgba(34, 197, 94, 0.1);
    color: #16a34a;
    border: 1px solid rgba(34, 197, 94, 0.2);
}

.status-badge.inactive {
    background-color: #f9fafb;
    color: #6b7280;
    border: 1px solid #f3f4f6;
}

/* Member Chip */
.member-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.625rem 0.25rem 0.25rem;
    background-color: #f9fafb;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
    color: #0f172a;
    border: 1px solid #f3f4f6;
    transition: all 0.2s ease;
}

.member-chip:hover {
    background-color: #f3f4f6;
    border-color: #e5e7eb;
}

.member-chip.overflow {
    padding: 0.25rem 0.625rem;
    color: #9ca3af;
    font-weight: 600;
}
</style>


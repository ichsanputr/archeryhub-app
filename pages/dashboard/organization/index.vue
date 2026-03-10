<template>
    <div class="space-y-8">
        <!-- Header Section -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <!-- Decorative Background Elements (Glows) -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                    <div
                        class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                        <Icon icon="ph:chart-pie-slice-bold" class="text-primary text-2xl sm:text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-3xl font-black tracking-tight">Overview</h1>
                        <p class="text-slate-300 text-xs sm:text-sm font-medium mt-1">Selamat datang kembali, <span
                                class="text-white font-bold">{{ welcomeName }}</span></p>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <NuxtLink to="/dashboard/organization/events" class="w-full sm:w-auto">
                        <BaseButton variant="primary" icon="ph:trophy-bold"
                            class="w-full h-10 sm:h-11 px-6 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-xs">
                            Kelola Event
                        </BaseButton>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <!-- Total Archers -->
            <div
                class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-sm transition-all border border-gray-100 group">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-text-secondary text-xs font-bold  tracking-wider mb-1">Total Atlet</p>
                        <p class="text-navy-dark text-3xl font-extrabold tracking-tight">{{ dashboardStats.totalArchers
                            }}
                        </p>
                    </div>
                    <div
                        class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-btn-text transition-colors">
                        <Icon icon="ph:users" class="text-xl" />
                    </div>
                </div>
                <div class="mt-auto">
                    <p class="text-slate-400 text-[10px] font-bold flex items-center gap-1">
                        <Icon icon="ph:info-bold" class="text-[12px]" />
                        Dikelola oleh organisasi
                    </p>
                </div>
            </div>

            <!-- Active Targets -->
            <div
                class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-sm transition-all border border-gray-100 group">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-text-secondary text-xs font-bold  tracking-wider mb-1">Target Aktif</p>
                        <p class="text-navy-dark text-3xl font-extrabold tracking-tight">
                            {{ dashboardStats.activeTargets }}
                            <span v-if="dashboardStats.activeTotalTargets > 0"
                                class="text-lg text-gray-400 font-medium ml-1">/ {{ dashboardStats.activeTotalTargets
                                }}</span>
                        </p>
                    </div>
                    <div
                        class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-btn-text transition-colors">
                        <Icon icon="ph:target" class="text-xl" />
                    </div>
                </div>
                <div class="mt-auto">
                    <p class="text-text-secondary text-[10px] font-medium flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full"
                            :class="dashboardStats.activeTotalTargets > 0 ? 'bg-green-500' : 'bg-slate-300'"></span>
                        {{ dashboardStats.activeTotalTargets > 0 ? 'Event sedang berlangsung' : 'Tidak ada event aktif'
                        }}
                    </p>
                </div>
            </div>

            <!-- Completion -->
            <div
                class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-sm transition-all border border-gray-100 group">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-text-secondary text-xs font-bold  tracking-wider mb-1">Penyelesaian</p>
                        <p class="text-navy-dark text-3xl font-extrabold tracking-tight">
                            {{ Math.round(dashboardStats.completionRate || 0) }}%
                        </p>
                    </div>
                    <div
                        class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-btn-text transition-colors">
                        <Icon icon="ph:check-square-offset" class="text-xl" />
                    </div>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-1.5 mt-auto">
                    <div class="bg-primary h-1.5 rounded-full transition-all duration-1000"
                        :style="{ width: `${dashboardStats.completionRate || 0}%` }"></div>
                </div>
            </div>

            <!-- Time Left -->
            <div
                class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-sm transition-all border border-gray-100 group">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-text-secondary text-xs font-bold  tracking-wider mb-1">Status Event</p>
                        <p class="text-navy-dark text-xl font-extrabold tracking-tight uppercase tabular-nums">
                            {{ dashboardStats.timeLeft || '-' }}
                        </p>
                    </div>
                    <div
                        class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-btn-text transition-colors">
                        <Icon icon="ph:timer" class="text-xl" />
                    </div>
                </div>
                <div class="mt-auto">
                    <p class="text-text-secondary text-[10px] font-medium">Berdasarkan event terbaru</p>
                </div>
            </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Event Recap (Organization overview â€“ replaces Target Status) -->
            <div
                class="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-sm">
                <div class="p-4 px-6 border-b border-gray-100 flex items-center justify-between bg-white">
                    <h3 class="text-navy-dark font-bold text-lg flex items-center gap-2">
                        <Icon icon="ph:chart-line-up-bold" class="text-primary" />
                        Rekap Event
                    </h3>
                    <NuxtLink to="/dashboard/organization/events">
                        <BaseButton variant="ghost" size="xs">Lihat Semua</BaseButton>
                    </NuxtLink>
                </div>
                <div class="p-5 space-y-4 flex-1 overflow-y-auto">
                    <div v-for="event in orgCompletedEvents" :key="event.id"
                        class="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/30 transition-all cursor-pointer group"
                        @click="router.push(`/dashboard/organization/events/${event.id}/overview`)">
                        <div class="flex items-center gap-4 flex-1 min-w-0">
                            <div
                                class="w-12 h-12 rounded-lg bg-white border border-gray-100 flex flex-col items-center justify-center shrink-0">
                                <span class="text-[10px] font-black text-primary ">{{ event.dateLabel }}</span>
                                <span class="text-lg font-black text-navy leading-none">{{ event.dayLabel }}</span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-navy group-hover:text-primary transition-colors truncate">{{
                                    event.name }}
                                </h4>
                                <div class="flex items-center gap-4 mt-1">
                                    <p class="text-xs text-gray-500">{{ event.statusLabel }}</p>
                                    <div class="flex items-center gap-3 text-xs text-gray-500">
                                        <span class="flex items-center gap-1">
                                            <Icon icon="ph:users-bold" class="text-[10px]" />
                                            {{ event.participantCount || 0 }} peserta
                                        </span>
                                        <span class="flex items-center gap-1">
                                            <Icon icon="ph:trophy-bold" class="text-[10px]" />
                                            {{ event.categoryCount || 0 }} kategori
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Icon icon="ph:arrow-right-bold"
                            class="text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1 shrink-0" />
                    </div>
                    <div v-if="!orgCompletedEvents.length" class="text-center py-10">
                        <Icon icon="ph:chart-line-up" class="text-4xl text-gray-200 mx-auto mb-2" />
                        <p class="text-gray-400 text-sm">Belum ada event yang selesai. Rekap akan muncul setelah event
                            selesai.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Leaderboard -->
            <div class="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-sm">
                <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h3 class="text-navy-dark font-bold text-lg flex items-center gap-2">Leaderboard</h3>
                    <BaseButton variant="ghost" size="sm">
                        View All
                    </BaseButton>
                </div>
                <div class="flex-1 overflow-y-auto">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                            <tr>
                                <th class="px-6 py-3 font-medium text-xs  tracking-wider">Rk</th>
                                <th class="px-6 py-3 font-medium text-xs  tracking-wider">Archer</th>
                                <th class="px-6 py-3 text-right font-medium text-xs  tracking-wider">Score</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="(archer, index) in leaderboard" :key="archer.id"
                                class="hover:bg-gray-50 transition-colors group">
                                <td class="px-6 py-3.5">
                                    <div :class="index === 0 ? 'bg-primary text-primary-text font-extrabold shadow-sm' : 'text-gray-400 font-bold'"
                                        class="w-6 h-6 rounded flex items-center justify-center text-xs">
                                        {{ index + 1 }}
                                    </div>
                                </td>
                                <td class="px-6 py-3.5">
                                    <div class="flex items-center gap-3">
                                        <img :src="useImageOrDefault(archer.avatar_url || archer.photo_url || archer.image, archer.name)"
                                            :alt="archer.name"
                                            class="w-9 h-9 rounded-full object-cover border border-gray-200 bg-gray-50" />
                                        <div>
                                            <div
                                                class="text-navy-dark font-bold group-hover:text-primary-hover transition-colors">
                                                {{
                                                    archer.name
                                                }}</div>
                                            <div class="text-gray-400 text-xs">{{ archer.category || '-' }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td :class="index === 0 ? 'text-navy-dark font-bold text-base' : 'text-navy-dark font-semibold text-sm'"
                                    class="px-6 py-3.5 text-right font-mono">{{ archer.score }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref, reactive } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Dashboard Organisasi - ArcheryHub'
})

const router = useRouter()
const api = useApi()
const { user } = useAuth()

const orgCompletedEventsData = ref([])
const dashboardStats = reactive({
    totalArchers: 0,
    activeTargets: 0,
    activeTotalTargets: 0,
    completionRate: 0,
    timeLeft: '-'
})
const welcomeName = computed(() => user.value?.full_name || 'Admin')

onMounted(() => {
    fetchOrgCompletedEvents()
    fetchDashboardStats()
})

const fetchDashboardStats = async () => {
    try {
        const res = await api.get('/organizations/stats')
        Object.assign(dashboardStats, res)
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
    }
}

const fetchOrgCompletedEvents = async () => {
    try {
        const res = await api.get('/events')
        const list = res?.data ?? res ?? []
        const now = new Date().toISOString()
        const completed = (Array.isArray(list) ? list : [])
            .filter((e) => {
                const status = (e.status || '').toLowerCase()
                const endDate = e.end_date || e.end_at || e.date
                return status === 'completed' || (endDate && new Date(endDate) < new Date(now))
            })
            .sort((a, b) => {
                const dateA = a.end_date || a.end_at || a.date || ''
                const dateB = b.end_date || b.end_at || b.date || ''
                return dateB.localeCompare(dateA)
            })
            .slice(0, 5)
        orgCompletedEventsData.value = completed
    } catch (error) {
        console.error('Failed to fetch org completed events:', error)
    }
}

const orgCompletedEvents = computed(() => {
    const list = orgCompletedEventsData.value || []
    return list.map((e) => {
        const endDate = e.end_date || e.end_at || e.date
        const d = endDate ? new Date(endDate) : new Date()
        const statusMap = { draft: 'Draft', active: 'Aktif' }
        return {
            id: e.id || e.uuid,
            name: e.name || e.title || 'Event',
            dateLabel: d.toLocaleDateString('id-ID', { month: 'short' }),
            dayLabel: String(d.getDate()),
            statusLabel: statusMap[e.status] || e.status || 'Selesai',
            participantCount: e.participant_count || 0,
            categoryCount: e.category_count || 0
        }
    })
})

const leaderboard = [
    { id: 1, name: 'Sarah Jenkins', category: 'Recurve Open', score: 582 },
    { id: 2, name: 'Mike Ross', category: 'Compound', score: 579 },
    { id: 3, name: 'David Chen', category: 'Recurve Open', score: 575 },
    { id: 4, name: 'Jessica Wu', category: 'Compound', score: 572 },
    { id: 5, name: 'Tom Baker', category: 'Recurve Open', score: 568 },
]
</script>

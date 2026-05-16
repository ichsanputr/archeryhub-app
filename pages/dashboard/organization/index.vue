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
                <div class="flex items-center gap-5">
                    <div
                        class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                        <Icon icon="ph:chart-pie-slice-bold" class="text-primary text-2xl sm:text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-2xl font-black tracking-tight leading-none uppercase">Overview</h1>
                        <p class="text-slate-300 text-[10px] sm:text-xs font-bold mt-1 tracking-wider uppercase">Welcome back, <span
                                class="text-white">{{ welcomeName }}</span></p>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <NuxtLink to="/dashboard/organization/events" class="w-full sm:w-auto">
                        <BaseButton variant="primary" icon="ph:trophy-bold"
                            class="w-full h-11 px-6 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px] !rounded-xl">
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

            <!-- Revenue Status -->
            <div
                class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-sm transition-all border border-gray-100 group">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Total Pendapatan</p>
                        <p class="text-navy-dark text-xl font-black tracking-tight uppercase tabular-nums">
                            Rp {{ formatPrice(dashboardStats.totalRevenue || 0) }}
                        </p>
                    </div>
                    <div
                        class="bg-green-50 p-2 rounded-lg text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <Icon icon="ph:wallet-bold" class="text-xl" />
                    </div>
                </div>
                <div class="mt-auto flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                    <span class="text-orange-500 flex items-center gap-1">
                        <Icon icon="ph:clock-bold" />
                        {{ dashboardStats.pendingPayments || 0 }} Menunggu
                    </span>
                    <NuxtLink to="/dashboard/organization/balance" class="text-primary hover:underline">Detail</NuxtLink>
                </div>
            </div>
        </div>

        <!-- Revenue & Registration Analytics -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-navy-dark font-black text-lg flex items-center gap-2">
                        <Icon icon="ph:chart-bar-bold" class="text-primary" />
                        Tren Pendaftaran & Pendapatan
                    </h3>
                    <div class="flex gap-2">
                        <button class="px-3 py-1 text-[10px] font-bold rounded-lg bg-gray-100 text-gray-500">7 Hari</button>
                        <button class="px-3 py-1 text-[10px] font-bold rounded-lg bg-primary/10 text-primary">30 Hari</button>
                    </div>
                </div>
                <!-- Mock Chart Placeholder -->
                <div class="h-64 w-full bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group">
                    <div class="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                    <div class="text-center space-y-2">
                        <Icon icon="ph:presentation-chart-bold" class="text-4xl text-gray-300 group-hover:text-primary transition-colors" />
                        <p class="text-gray-400 text-xs font-bold">Analisis Tren Sedang Disiapkan</p>
                    </div>
                    <!-- Decorative bars -->
                    <div class="absolute bottom-0 left-0 right-0 px-8 flex items-end gap-4 h-32 opacity-20">
                        <div v-for="i in 12" :key="i" class="flex-1 bg-primary rounded-t-lg transition-all duration-1000" :style="{ height: `${Math.random() * 100}%` }"></div>
                    </div>
                </div>
            </div>

            <div class="bg-navy rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
                <div class="absolute top-0 right-0 p-8 opacity-10">
                    <Icon icon="ph:seal-check-fill" class="text-9xl rotate-12" />
                </div>
                <h3 class="text-lg font-black mb-4 flex items-center gap-2">
                    <Icon icon="ph:lightning-bold" class="text-yellow-400" />
                    Quick Actions
                </h3>
                <div class="space-y-3 relative z-10">
                    <NuxtLink to="/dashboard/organization/events" class="flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group">
                        <div class="flex items-center gap-3">
                            <Icon icon="ph:user-circle-check-bold" class="text-xl text-primary" />
                            <span class="text-sm font-bold">Kelola Pendaftar</span>
                        </div>
                        <Icon icon="ph:caret-right-bold" class="text-xs group-hover:translate-x-1 transition-transform" />
                    </NuxtLink>
                    <NuxtLink to="/dashboard/organization/events/create" class="flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group">
                        <div class="flex items-center gap-3">
                            <Icon icon="ph:plus-circle-bold" class="text-xl text-green-400" />
                            <span class="text-sm font-bold">Buat Event Baru</span>
                        </div>
                        <Icon icon="ph:caret-right-bold" class="text-xs group-hover:translate-x-1 transition-transform" />
                    </NuxtLink>
                    <NuxtLink to="/dashboard/organization/news/create" class="flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group">
                        <div class="flex items-center gap-3">
                            <Icon icon="ph:article-bold" class="text-xl text-blue-400" />
                            <span class="text-sm font-bold">Publikasi Berita</span>
                        </div>
                        <Icon icon="ph:caret-right-bold" class="text-xs group-hover:translate-x-1 transition-transform" />
                    </NuxtLink>
                </div>
                <div class="mt-8 pt-6 border-t border-white/10">
                    <div class="flex items-center gap-3 text-xs opacity-60 font-bold mb-4 uppercase tracking-widest">Pusat Bantuan</div>
                    <BaseButton variant="primary" size="sm" class="w-full text-xs font-black">Kontak Support</BaseButton>
                </div>
            </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Event Recap (Organization overview â€“ replaces Target Status) -->
            <div
                class="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-sm">
                <div class="p-4 px-6 border-b border-gray-100 flex items-center justify-between bg-white">
                    <h3 class="text-navy-dark font-black text-xs uppercase tracking-widest flex items-center gap-2">
                        <Icon icon="ph:chart-line-up-bold" class="text-primary" />
                        Rekap Event
                    </h3>
                    <NuxtLink to="/dashboard/organization/events">
                        <BaseButton variant="ghost" class="text-[10px] uppercase font-black tracking-widest">Lihat Semua</BaseButton>
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
                    <h3 class="text-navy-dark font-black text-xs uppercase tracking-widest flex items-center gap-2">Leaderboard</h3>
                    <BaseButton variant="ghost" class="text-[10px] uppercase font-black tracking-widest">
                        Semua
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
    title: 'Dashboard Organisasi - Archeris'
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
    timeLeft: '-',
    totalRevenue: 0,
    pendingPayments: 0
})
const welcomeName = computed(() => user.value?.full_name || 'Admin')

const formatPrice = (value) => {
    return new Intl.NumberFormat('id-ID').format(value)
}

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

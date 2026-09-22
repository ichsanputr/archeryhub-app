<template>
    <div class="space-y-8">
        <!-- Header Section -->
        <DashboardHeader
            :title="t('dashboard.org.overview')"
            :subtitle="t('dashboard.org.welcome') + ' ' + welcomeName"
            icon="ph:chart-pie-slice-bold"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/organizer' },
                { label: t('dashboard.org.overview') }
            ]"
        >
            <template #actions>
                <NuxtLink to="/dashboard/organizer/tournaments" class="w-full sm:w-auto">
                    <BaseButton variant="primary" icon="ph:trophy-bold"
                        class="w-full h-11 px-6 shadow-lg shadow-primary/20 font-black tracking-widest text-[10px] !rounded-xl">
                        {{ t('dashboard.org.manage_events') }}
                    </BaseButton>
                </NuxtLink>
            </template>
        </DashboardHeader>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <!-- Total Archers -->
            <StatCard
                :title="t('dashboard.org.total_archers')"
                :value="dashboardStats.totalArchers"
                icon="ph:users"
                color="primary"
                :description="t('dashboard.org.archers_info')"
                description-icon="ph:info-bold"
            />

            <!-- Active Targets -->
            <StatCard
                :title="t('dashboard.org.active_targets')"
                :value="dashboardStats.activeTotalTargets > 0 ? `${dashboardStats.activeTargets} / ${dashboardStats.activeTotalTargets}` : dashboardStats.activeTargets"
                icon="ph:target"
                color="primary"
            >
                <template #footer>
                    <div class="text-text-secondary text-[10px] font-medium flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full"
                            :class="dashboardStats.activeTotalTargets > 0 ? 'bg-green-500' : 'bg-slate-300'"></span>
                        {{ dashboardStats.activeTotalTargets > 0 ? t('dashboard.org.event_ongoing') : t('dashboard.org.no_event_active') }}
                    </div>
                </template>
            </StatCard>

            <!-- Completion Scoring -->
            <StatCard
                :title="t('dashboard.org.completion_scoring')"
                :value="Math.round(dashboardStats.completionRate || 0) + '%'"
                icon="ph:check-square-offset"
                color="primary"
                :description="t('dashboard.org.scoring_progress_desc')"
                description-icon="ph:crosshair-bold"
            >
                <template #footer>
                    <div class="w-full bg-gray-100 rounded-full h-1.5 mt-auto">
                        <div class="bg-primary h-1.5 rounded-full transition-all duration-1000"
                            :style="{ width: `${dashboardStats.completionRate || 0}%` }"></div>
                    </div>
                </template>
            </StatCard>

            <!-- Revenue Status -->
            <StatCard
                :title="t('dashboard.org.total_revenue')"
                :value="'Rp ' + formatPrice(dashboardStats.totalRevenue || 0)"
                icon="ph:wallet-bold"
                color="success"
            />
        </div>

        <!-- Revenue & Registration Analytics -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                            <Icon icon="ph:chart-bar-bold" class="text-xl" />
                        </div>
                        <div>
                            <h3 class="text-navy font-black text-base leading-tight">
                                {{ t('dashboard.org.revenue_trend_title') }}
                            </h3>
                            <div class="text-xs text-slate-400 font-medium mt-0.5">{{ t('dashboard.org.revenue_trend_subtitle') }}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="px-3 py-1 text-[11px] font-bold rounded-lg bg-navy text-white">{{ t('dashboard.org.last_30_days') }}</span>
                    </div>
                </div>

                <!-- Live Trend Chart Visualization -->
                <div class="w-full bg-slate-50/70 rounded-2xl border border-slate-200/80 p-5 space-y-6">
                    <div class="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200/60">
                        <div>
                            <span class="text-xs font-bold text-slate-500 block">{{ t('dashboard.org.total_verified_revenue') }}</span>
                            <span class="text-2xl font-black text-emerald-600 tabular-nums">Rp {{ formatPrice(dashboardStats.totalRevenue || 0) }}</span>
                        </div>
                        <div>
                            <span class="text-xs font-bold text-slate-500 block">{{ t('dashboard.org.total_archers_registered') }}</span>
                            <span class="text-2xl font-black text-navy tabular-nums">{{ dashboardStats.totalArchers || 0 }} {{ t('dashboard.org.peserta') }}</span>
                        </div>
                    </div>

                    <!-- Trend Bars Grid with Interactive Hover Tooltips -->
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-slate-500 block">{{ t('dashboard.org.visualization_title') }}</span>
                            <span class="text-[10px] font-semibold text-slate-400">{{ t('dashboard.org.hover_chart_hint') }}</span>
                        </div>
                        <div v-if="trendBars && trendBars.length" class="flex items-end gap-2 h-40 pt-8 px-2">
                            <div v-for="(bar, idx) in trendBars" :key="idx" class="relative group/bar flex-1 flex flex-col items-center gap-2 h-full justify-end">
                                <!-- Floating Hover Value Tooltip -->
                                <div class="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-200 pointer-events-none z-30 bg-navy text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg border border-white/10 whitespace-nowrap flex flex-col items-center">
                                    <span class="text-primary font-mono">Rp {{ formatPrice(bar.revenue || (bar.count * 150000)) }}</span>
                                    <span class="text-[8px] text-slate-300 font-medium">{{ bar.count || 0 }} {{ t('dashboard.org.archers_unit') }} · {{ bar.label }}</span>
                                    <div class="w-1.5 h-1.5 bg-navy rotate-45 -mb-1 mt-0.5 border-r border-b border-white/10"></div>
                                </div>

                                <div class="w-full bg-slate-200/80 group-hover/bar:bg-primary rounded-t-lg transition-all relative overflow-hidden cursor-pointer" :style="{ height: `${Math.max(bar.height || 0, bar.count ? 14 : 6)}%` }">
                                    <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                                </div>
                                <span class="text-[9px] font-bold text-slate-400 group-hover/bar:text-navy truncate">{{ bar.label }}</span>
                            </div>
                        </div>
                        <div v-else class="flex items-center justify-center h-40 text-slate-400 text-xs font-medium">
                            {{ t('dashboard.org.no_trend_data') }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions Card -->
            <div class="bg-navy rounded-2xl p-6 text-white border border-navy/20 relative overflow-hidden flex flex-col justify-between">
                <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Icon icon="ph:seal-check-fill" class="text-9xl rotate-12 text-white" />
                </div>
                <div class="space-y-4 relative z-10">
                    <div class="flex items-center gap-3">
                        <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                            <Icon icon="ph:lightning-bold" class="text-xl" />
                        </div>
                        <div>
                            <h3 class="text-base font-black text-white leading-tight">
                                {{ t('dashboard.org.quick_actions') }}
                            </h3>
                            <div class="text-xs text-slate-300 mt-0.5">{{ t('dashboard.org.quick_actions_desc') }}</div>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <NuxtLink to="/dashboard/organizer/tournaments"
                            class="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group">
                            <div class="flex items-center gap-3">
                                <Icon icon="ph:user-circle-check-bold" class="text-lg text-primary" />
                                <span class="text-xs font-bold">{{ t('dashboard.org.manage_registrants') }}</span>
                            </div>
                            <Icon icon="ph:caret-right-bold"
                                class="text-xs group-hover:translate-x-1 transition-transform text-white/50" />
                        </NuxtLink>
                        <NuxtLink to="/dashboard/organizer/tournaments/create"
                            class="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group">
                            <div class="flex items-center gap-3">
                                <Icon icon="ph:plus-circle-bold" class="text-lg text-primary" />
                                <span class="text-xs font-bold">{{ t('dashboard.org.create_event') }}</span>
                            </div>
                            <Icon icon="ph:caret-right-bold"
                                class="text-xs group-hover:translate-x-1 transition-transform text-white/50" />
                        </NuxtLink>
                        <NuxtLink to="/dashboard/organizer/news/create"
                            class="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group">
                            <div class="flex items-center gap-3">
                                <Icon icon="ph:newspaper-bold" class="text-lg text-primary" />
                                <span class="text-xs font-bold">{{ t('dashboard.org.create_news') }}</span>
                            </div>
                            <Icon icon="ph:caret-right-bold"
                                class="text-xs group-hover:translate-x-1 transition-transform text-white/50" />
                        </NuxtLink>
                        <NuxtLink to="/dashboard/organizer/scorekeepers"
                            class="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group">
                            <div class="flex items-center gap-3">
                                <Icon icon="ph:users-three-bold" class="text-lg text-primary" />
                                <span class="text-xs font-bold">{{ t('dashboard.org.manage_scorekeepers') }}</span>
                            </div>
                            <Icon icon="ph:caret-right-bold"
                                class="text-xs group-hover:translate-x-1 transition-transform text-white/50" />
                        </NuxtLink>
                        <NuxtLink to="/dashboard/organizer/balance"
                            class="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group">
                            <div class="flex items-center gap-3">
                                <Icon icon="ph:wallet-bold" class="text-lg text-primary" />
                                <span class="text-xs font-bold">{{ t('dashboard.org.wallet_payouts') }}</span>
                            </div>
                            <Icon icon="ph:caret-right-bold"
                                class="text-xs group-hover:translate-x-1 transition-transform text-white/50" />
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <!-- Event Recap & Leaderboard Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Event Recap Card -->
            <div class="bg-white rounded-2xl border border-slate-200/80 flex flex-col overflow-hidden min-h-[360px]">
                <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                    <div class="flex items-center gap-3">
                        <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                            <Icon icon="ph:calendar-check-bold" class="text-xl" />
                        </div>
                        <div>
                            <h3 class="text-navy font-black text-base leading-tight">
                                {{ t('dashboard.org.event_recap') }}
                            </h3>
                            <div class="text-xs text-slate-400 font-medium mt-0.5">{{ t('dashboard.org.event_recap_desc') }}</div>
                        </div>
                    </div>
                    <NuxtLink to="/dashboard/organizer/tournaments">
                        <BaseButton variant="white" size="xs" class="text-xs font-bold">
                            {{ t('dashboard.org.view_all') }}
                        </BaseButton>
                    </NuxtLink>
                </div>

                <!-- Event Recap List -->
                <div v-if="orgCompletedEvents && orgCompletedEvents.length" class="p-5 space-y-3 flex-1 overflow-y-auto max-h-[300px] custom-scrollbar">
                    <div v-for="event in orgCompletedEvents" :key="event.id"
                        class="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/40 transition-all cursor-pointer group"
                        @click="router.push(`/dashboard/organizer/tournaments/${event.id}/overview`)">
                        <div class="flex items-center gap-4 flex-1 min-w-0">
                            <div
                                class="w-12 h-12 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center shrink-0">
                                <span class="text-[10px] font-black text-primary">{{ event.dateLabel }}</span>
                                <span class="text-lg font-black text-navy leading-none">{{ event.dayLabel }}</span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-navy group-hover:text-primary transition-colors truncate">{{ event.name }}</h4>
                                <div class="flex items-center gap-4 mt-1">
                                    <div class="text-xs text-slate-500">{{ event.statusLabel }}</div>
                                    <div class="flex items-center gap-3 text-xs text-slate-500">
                                        <span class="flex items-center gap-1">
                                            <Icon icon="ph:users-bold" class="text-[10px]" />
                                            {{ event.participantCount || 0 }} {{ t('dashboard.org.peserta') }}
                                        </span>
                                        <span class="flex items-center gap-1">
                                            <Icon icon="ph:trophy-bold" class="text-[10px]" />
                                            {{ event.categoryCount || 0 }} {{ t('dashboard.org.kategori') }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Icon icon="ph:arrow-right-bold"
                            class="text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1 shrink-0" />
                    </div>
                </div>

                <!-- Symmetrical Empty State for Recap -->
                <div v-else class="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <div class="size-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-2xs">
                        <Icon icon="ph:chart-pie-slice-bold" class="text-2xl text-slate-400" />
                    </div>
                    <div class="max-w-xs space-y-1">
                        <div class="text-xs font-bold text-navy">{{ t('dashboard.org.no_event_recap') }}</div>
                        <div class="text-[11px] text-slate-400 font-medium leading-relaxed">{{ t('dashboard.org.recap_empty_desc') }}</div>
                    </div>
                </div>
            </div>

            <!-- Leaderboard Card -->
            <div class="bg-white rounded-2xl border border-slate-200/80 flex flex-col overflow-hidden min-h-[360px]">
                <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                    <div class="flex items-center gap-3">
                        <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                            <Icon icon="ph:trophy-bold" class="text-xl" />
                        </div>
                        <div>
                            <h3 class="text-navy font-black text-base leading-tight">
                                {{ t('dashboard.org.leaderboard') }}
                            </h3>
                            <div class="text-xs text-slate-400 font-medium mt-0.5">{{ t('dashboard.org.leaderboard_desc') }}</div>
                        </div>
                    </div>
                    <span class="px-2.5 py-1 bg-primary/15 text-navy font-bold text-xs rounded-lg border border-primary/30">
                        Top 5
                    </span>
                </div>

                <!-- Leaderboard Table -->
                <div v-if="leaderboard && leaderboard.length" class="flex-1 overflow-x-auto overflow-y-auto max-h-[300px] custom-scrollbar">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 sticky top-0 z-10">
                            <tr>
                                <th class="px-6 py-3 font-semibold text-xs">{{ t('dashboard.org.rank') }}</th>
                                <th class="px-6 py-3 font-semibold text-xs">{{ t('dashboard.org.archer') }}</th>
                                <th class="px-6 py-3 text-right font-semibold text-xs">{{ t('dashboard.org.score') }}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="(archer, index) in leaderboard" :key="archer.id"
                                class="hover:bg-slate-50 transition-colors group">
                                <td class="px-6 py-3.5">
                                    <div :class="index === 0 ? 'bg-primary text-navy font-extrabold' : 'text-slate-400 font-bold'"
                                        class="w-6 h-6 rounded flex items-center justify-center text-xs">
                                        {{ index + 1 }}
                                    </div>
                                </td>
                                <td class="px-6 py-3.5">
                                    <div class="flex items-center gap-3">
                                        <img :src="useImageOrDefault(archer.avatar_url || archer.photo_url || archer.image, archer.name)"
                                            :alt="archer.name"
                                            class="w-9 h-9 rounded-full object-cover border border-slate-200 bg-slate-50" />
                                        <div>
                                            <div
                                                class="text-navy font-bold group-hover:text-primary transition-colors">
                                                {{ archer.name }}
                                            </div>
                                            <div class="text-slate-400 text-xs">{{ archer.category || '-' }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td :class="index === 0 ? 'text-navy font-bold text-base' : 'text-navy font-semibold text-sm'"
                                    class="px-6 py-3.5 text-right font-mono">{{ archer.score }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Symmetrical Empty State for Leaderboard -->
                <div v-else class="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <div class="size-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-2xs">
                        <Icon icon="ph:trophy-bold" class="text-2xl text-slate-400" />
                    </div>
                    <div class="max-w-xs space-y-1">
                        <div class="text-xs font-bold text-navy">{{ t('dashboard.org.no_leaderboard') }}</div>
                        <div class="text-[11px] text-slate-400 font-medium leading-relaxed">{{ t('dashboard.org.leaderboard_empty_desc') }}</div>
                    </div>
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

import useDashboardI18n from '~/composables/useDashboardI18n'

const { t } = useDashboardI18n()

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: computed(() => `${t('dashboard.sidebar.organizer')} Dashboard - Archeris Dashboard`)
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

const leaderboard = ref([])
const trendBars = ref([])

const fetchDashboardStats = async () => {
    try {
        const res = await api.get('/organizers/stats')
        Object.assign(dashboardStats, res)
        if (res?.leaderboard) {
            leaderboard.value = res.leaderboard
        } else {
            leaderboard.value = []
        }
        if (res?.trendBars) {
            trendBars.value = res.trendBars
        } else {
            trendBars.value = []
        }
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
        leaderboard.value = []
        trendBars.value = []
    }
}

const fetchOrgCompletedEvents = async () => {
    try {
        const res = await api.get('/tournaments')
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
        const statusMap = { draft: 'Draft', active: t('dashboard.org.active') }
        return {
            id: e.id || e.uuid,
            name: e.name || e.title || 'Event',
            dateLabel: d.toLocaleDateString('id-ID', { month: 'short' }),
            dayLabel: String(d.getDate()),
            statusLabel: statusMap[e.status] || e.status || t('dashboard.org.completed'),
            participantCount: e.participant_count || 0,
            categoryCount: e.category_count || 0
        }
    })
})
</script>
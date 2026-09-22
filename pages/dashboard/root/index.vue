<template>
    <div class="space-y-8">
        <!-- Header Section -->
        <DashboardHeader
            :title="t('root.overview.title')"
            :subtitle="t('root.overview.subtitle')"
            icon="ph:squares-four-bold"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/root' },
                { label: t('root.overview.title') }
            ]"
        >
            <template #actions>
                <div class="flex items-center gap-3 w-full sm:w-auto">
                    <NuxtLink to="/dashboard/root/articles" class="w-full sm:w-auto">
                        <BaseButton variant="primary" icon="ph:newspaper-bold"
                            class="w-full h-11 px-5 font-bold text-xs !rounded-xl shadow-lg shadow-primary/20">
                            {{ t('root.overview.manage_articles') }}
                        </BaseButton>
                    </NuxtLink>
                </div>
            </template>
        </DashboardHeader>

        <!-- Stats Grid (Using Standard Clean StatCard Component) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <!-- 1. Gross Revenue / GMV -->
            <StatCard
                :title="t('root.overview.total_gmv')"
                :value="'Rp ' + (recap.finance?.total_gmv || 0).toLocaleString('id-ID')"
                icon="ph:wallet-bold"
                color="primary"
                :description="'Rp ' + (recap.finance?.this_month_revenue || 0).toLocaleString('id-ID') + ' ' + t('root.overview.this_month')"
                description-icon="ph:trend-up-bold"
            />

            <!-- 2. Total Platform Users -->
            <StatCard
                :title="t('root.overview.total_users')"
                :value="(recap.users?.total || 0).toLocaleString('id-ID')"
                icon="ph:users-three-bold"
                color="primary"
                :description="'+' + (recap.users?.new_this_month || 0) + ' ' + t('root.overview.new_users_30d')"
                description-icon="ph:user-plus-bold"
            />

            <!-- 3. Tournaments & Registrations -->
            <StatCard
                :title="t('root.overview.tournaments_registrations')"
                :value="(recap.tournaments?.total || 0) + ' ' + t('root.overview.tournaments_unit')"
                icon="ph:trophy-bold"
                color="primary"
                :description="(recap.tournaments?.total_participants || 0).toLocaleString('id-ID') + ' ' + t('root.overview.total_participants')"
                description-icon="ph:target-bold"
            />

            <!-- 4. Content & Articles Engagement -->
            <StatCard
                :title="t('root.overview.articles_reads')"
                :value="(recap.content?.total_articles || 0) + ' ' + t('root.overview.articles_unit')"
                icon="ph:newspaper-bold"
                color="primary"
                :description="(recap.content?.total_views || 0).toLocaleString('id-ID') + ' ' + t('root.overview.total_views')"
                description-icon="ph:eye-bold"
            />
        </div>

        <!-- Section: Recent Transactions & User Demographics Breakdown -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <!-- LEFT (8 cols): Recent Transactions Ledger -->
            <div class="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div class="space-y-0.5">
                        <h3 class="text-sm font-black text-navy tracking-tight flex items-center gap-2">
                            <Icon icon="ph:receipt-bold" class="text-primary text-lg" />
                            <span>{{ t('root.overview.recent_transactions') }}</span>
                        </h3>
                        <div class="text-xs text-slate-400 font-medium">{{ t('root.overview.recent_transactions_desc') }}</div>
                    </div>
                    <div class="text-xs font-bold text-navy">
                        {{ t('root.overview.paid_count', { paid: recap.finance?.paid_transactions || 0, total: recap.finance?.total_transactions || 0 }) }}
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse min-w-[650px]">
                        <thead>
                            <tr class="bg-slate-50/70 text-slate-400 font-bold text-xs border-b border-slate-100">
                                <th class="px-4 py-3">{{ t('root.overview.table_archer') }}</th>
                                <th class="px-4 py-3">{{ t('root.overview.table_tournament') }}</th>
                                <th class="px-4 py-3">{{ t('root.overview.table_method') }}</th>
                                <th class="px-4 py-3 text-right">{{ t('root.overview.table_amount') }}</th>
                                <th class="px-4 py-3 text-center">{{ t('root.overview.table_status') }}</th>
                                <th class="px-4 py-3 text-right">{{ t('root.overview.table_time') }}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-if="loading">
                                <td colspan="6" class="px-4 py-12 text-center text-xs text-slate-400">
                                    <Icon icon="ph:circle-notch-bold" class="text-2xl text-primary animate-spin mx-auto mb-2" />
                                    {{ t('common.loading') }}
                                </td>
                            </tr>
                            <tr v-else-if="!recap.finance?.recent_transactions || recap.finance?.recent_transactions.length === 0">
                                <td colspan="6" class="px-4 py-12 text-center text-xs text-slate-400">
                                    {{ t('root.overview.no_transactions') }}
                                </td>
                            </tr>
                            <tr v-else v-for="tx in recap.finance?.recent_transactions" :key="tx.reference" class="hover:bg-slate-50/60 transition-colors">
                                <td class="px-4 py-3.5">
                                    <div class="font-bold text-xs text-navy leading-tight">{{ tx.archer_name }}</div>
                                    <div class="text-[10px] text-slate-400 font-mono mt-0.5">{{ tx.reference }}</div>
                                </td>
                                <td class="px-4 py-3.5 text-xs text-slate-600 font-medium truncate max-w-[180px]">
                                    {{ tx.tournament_name }}
                                </td>
                                <td class="px-4 py-3.5">
                                    <span class="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                                        {{ tx.payment_method || 'QRIS' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3.5 text-right font-black text-xs text-navy tabular-nums">
                                    Rp {{ (tx.amount || 0).toLocaleString('id-ID') }}
                                </td>
                                <td class="px-4 py-3.5 text-center">
                                    <span class="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                                        :class="tx.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'">
                                        {{ tx.status === 'paid' ? t('earnings.status_paid') : t('earnings.status_pending') }}
                                    </span>
                                </td>
                                <td class="px-4 py-3.5 text-right text-xs text-slate-400 whitespace-nowrap">
                                    {{ formatTimeAgo(tx.created_at) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- RIGHT (4 cols): User Demographics & Persona Distribution -->
            <div class="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                <div class="border-b border-slate-100 pb-4">
                    <h3 class="text-sm font-black text-navy tracking-tight flex items-center gap-2">
                        <Icon icon="ph:chart-pie-slice-bold" class="text-primary text-lg" />
                        <span>{{ t('root.overview.user_composition') }}</span>
                    </h3>
                    <div class="text-xs text-slate-400 font-medium mt-0.5">{{ t('root.overview.user_composition_desc') }}</div>
                </div>

                <div class="space-y-4">
                    <!-- Archers -->
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-bold text-navy flex items-center gap-2">
                                <Icon icon="ph:user-bold" class="text-navy" />
                                <span>{{ t('root.overview.role_archers') }}</span>
                            </span>
                            <span class="font-black text-navy">{{ recap.users?.archers || 0 }} ({{ getPercentage(recap.users?.archers, recap.users?.total) }}%)</span>
                        </div>
                        <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-navy rounded-full transition-all duration-500"
                                :style="{ width: `${getPercentage(recap.users?.archers, recap.users?.total)}%` }"></div>
                        </div>
                    </div>

                    <!-- Clubs -->
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-bold text-navy flex items-center gap-2">
                                <Icon icon="ph:shield-bold" class="text-navy" />
                                <span>{{ t('root.overview.role_clubs') }}</span>
                            </span>
                            <span class="font-black text-navy">{{ recap.users?.clubs || 0 }} ({{ getPercentage(recap.users?.clubs, recap.users?.total) }}%)</span>
                        </div>
                        <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-navy/70 rounded-full transition-all duration-500"
                                :style="{ width: `${getPercentage(recap.users?.clubs, recap.users?.total)}%` }"></div>
                        </div>
                    </div>

                    <!-- Organizers -->
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-bold text-navy flex items-center gap-2">
                                <Icon icon="ph:buildings-bold" class="text-primary" />
                                <span>{{ t('root.overview.role_organizers') }}</span>
                            </span>
                            <span class="font-black text-navy">{{ recap.users?.organizers || 0 }} ({{ getPercentage(recap.users?.organizers, recap.users?.total) }}%)</span>
                        </div>
                        <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-primary rounded-full transition-all duration-500"
                                :style="{ width: `${getPercentage(recap.users?.organizers, recap.users?.total)}%` }"></div>
                        </div>
                    </div>

                    <!-- Scorekeepers -->
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-bold text-navy flex items-center gap-2">
                                <Icon icon="ph:device-mobile-bold" class="text-slate-600" />
                                <span>{{ t('root.overview.role_scorekeepers') }}</span>
                            </span>
                            <span class="font-black text-navy">{{ recap.users?.scorekeepers || 0 }} ({{ getPercentage(recap.users?.scorekeepers, recap.users?.total) }}%)</span>
                        </div>
                        <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-slate-400 rounded-full transition-all duration-500"
                                :style="{ width: `${getPercentage(recap.users?.scorekeepers, recap.users?.total)}%` }"></div>
                        </div>
                    </div>
                </div>

                <!-- Quick Action Shortcuts -->
                <div class="pt-4 border-t border-slate-100 space-y-2">
                    <div class="text-xs font-bold text-slate-400">{{ t('root.overview.quick_management') }}</div>
                    <NuxtLink to="/dashboard/root/articles/create"
                        class="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-navy text-xs font-bold transition-all">
                        <span class="flex items-center gap-2">
                            <Icon icon="ph:plus-circle-bold" class="text-base text-primary" />
                            <span>{{ t('root.overview.write_article') }}</span>
                        </span>
                        <Icon icon="ph:caret-right-bold" class="text-xs text-slate-400" />
                    </NuxtLink>
                    <NuxtLink to="/dashboard/root/articles"
                        class="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-navy text-xs font-bold transition-all">
                        <span class="flex items-center gap-2">
                            <Icon icon="ph:newspaper-bold" class="text-base text-navy" />
                            <span>{{ t('root.overview.manage_articles') }}</span>
                        </span>
                        <Icon icon="ph:caret-right-bold" class="text-xs text-slate-400" />
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Section: Top Tournaments & Top Articles -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <!-- LEFT (6 cols): Top Tournaments -->
            <div class="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 class="text-sm font-black text-navy tracking-tight flex items-center gap-2">
                        <Icon icon="ph:medal-bold" class="text-primary text-lg" />
                        <span>{{ t('root.overview.top_tournaments') }}</span>
                    </h3>
                    <span class="text-xs font-bold text-slate-400">{{ recap.tournaments?.total || 0 }} {{ t('root.overview.tournaments_unit') }}</span>
                </div>

                <div v-if="!recap.tournaments?.top_events || recap.tournaments?.top_events.length === 0" class="py-8 text-center text-xs text-slate-400">
                    {{ t('root.overview.no_tournaments') }}
                </div>
                <div v-else class="space-y-3">
                    <div v-for="event in recap.tournaments?.top_events" :key="event.id"
                        class="p-4 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between hover:bg-slate-100/70 transition-all">
                        <div class="space-y-1 min-w-0 pr-4">
                            <div class="font-bold text-xs text-navy line-clamp-1">{{ event.name }}</div>
                            <div class="text-[11px] text-slate-400 flex items-center gap-2 font-medium">
                                <span>{{ event.venue || event.city || 'Indonesia' }}</span>
                                <span>•</span>
                                <span>{{ formatDate(event.start_date) }}</span>
                            </div>
                        </div>
                        <div class="text-right shrink-0">
                            <div class="text-sm font-black text-navy tabular-nums">{{ event.participants_count }}</div>
                            <div class="text-[10px] text-slate-400 font-semibold">{{ t('root.overview.participants_unit') }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT (6 cols): Top Read Articles -->
            <div class="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 class="text-sm font-black text-navy tracking-tight flex items-center gap-2">
                        <Icon icon="ph:star-bold" class="text-primary text-lg" />
                        <span>{{ t('root.overview.top_articles') }}</span>
                    </h3>
                    <NuxtLink to="/dashboard/root/articles" class="text-xs font-bold text-navy hover:underline transition-colors">
                        {{ t('root.overview.view_all') }}
                    </NuxtLink>
                </div>

                <div v-if="!recap.content?.top_articles || recap.content?.top_articles.length === 0" class="py-8 text-center text-xs text-slate-400">
                    {{ t('root.overview.no_articles') }}
                </div>
                <div v-else class="space-y-3">
                    <div v-for="art in recap.content?.top_articles" :key="art.id"
                        class="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-3.5 hover:bg-slate-100/70 transition-all">
                        <div class="h-12 w-16 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-200/80">
                            <img :src="art.image || '/hero-berita.jpeg'" :alt="art.title" class="w-full h-full object-cover">
                        </div>
                        <div class="min-w-0 flex-grow space-y-0.5">
                            <NuxtLink :to="`/blog/${art.slug}`" target="_blank" class="font-bold text-xs text-navy hover:text-slate-600 hover:underline transition-colors line-clamp-1 block">
                                {{ art.title }}
                            </NuxtLink>
                            <div class="text-[11px] text-slate-400 flex items-center gap-2 font-medium">
                                <span class="text-navy font-bold">{{ art.category }}</span>
                                <span>•</span>
                                <span>{{ formatDate(art.published_at) }}</span>
                            </div>
                        </div>
                        <div class="text-right shrink-0 pl-2">
                            <div class="text-xs font-black text-navy tabular-nums">{{ (art.views || 0).toLocaleString('id-ID') }}</div>
                            <div class="text-[10px] text-slate-400 font-semibold">{{ t('root.overview.reads_unit') }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'
import { useDateFormat, useTimeAgo } from '@vueuse/core'
import DashboardHeader from '~/components/dashboard/DashboardHeader.vue'
import StatCard from '~/components/common/StatCard.vue'

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})

const { t } = useI18n()
const api = useApi()
const toast = useToast()

useHead({
    title: computed(() => `${t('root.overview.title')} - Archeris Root`)
})

const loading = ref(true)
const recap = ref({
    users: {
        total: 0,
        archers: 0,
        organizers: 0,
        clubs: 0,
        scorekeepers: 0,
        new_this_month: 0
    },
    tournaments: {
        total: 0,
        active: 0,
        completed: 0,
        draft: 0,
        total_participants: 0,
        top_events: []
    },
    finance: {
        total_gmv: 0,
        total_transactions: 0,
        paid_transactions: 0,
        pending_transactions: 0,
        this_month_revenue: 0,
        recent_transactions: []
    },
    content: {
        total_articles: 0,
        total_views: 0,
        top_articles: []
    }
})

const fetchRecap = async () => {
    try {
        loading.value = true
        const res = await api.get('/root/dashboard/recap')
        if (res) {
            recap.value = res
        }
    } catch (err) {
        console.error('Failed to fetch executive recap:', err)
        toast.error(err.data?.error || 'Gagal memuat ringkasan bisnis')
    } finally {
        loading.value = false
    }
}

const getPercentage = (val, total) => {
    if (!total || total === 0) return 0
    return Math.round(((val || 0) / total) * 100)
}

const formatDate = (date) => {
    if (!date) return '-'
    return useDateFormat(date, 'DD MMM YYYY', { locales: 'id-ID' }).value
}

const formatTimeAgo = (date) => {
    if (!date) return '-'
    return useTimeAgo(date).value
}

onMounted(() => {
    fetchRecap()
})
</script>

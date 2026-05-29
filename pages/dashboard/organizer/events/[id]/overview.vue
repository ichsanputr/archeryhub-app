<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Enhanced Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
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
                            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
                            <Icon icon="ph:calendar-check" class="text-white text-2xl" />
                        </div>

                        <!-- Title Section -->
                        <div class="flex-1">
                            <div v-if="isLoading" class="space-y-3">
                                <div class="h-8 w-64 bg-white/10 animate-pulse rounded-lg"></div>
                                <div class="h-4 w-48 bg-white/5 animate-pulse rounded"></div>
                                <div class="h-4 w-24 bg-white/5 animate-pulse rounded"></div>
                            </div>
                            <template v-else>
                                <div class="flex items-center gap-3 mb-2">
                                    <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                                        {{ event?.name || $t('dashboard_event_overview.summary_title') }}
                                    </h1>
                                </div>
                                <p v-if="event" class="text-slate-300 text-sm mb-2">
                                    {{ event.venue || $t('dashboard_event_overview.venue_fallback') }} • {{ event.location || $t('dashboard_event_overview.address_fallback') }}
                                </p>
                                <div class="flex flex-wrap items-center gap-4">
                                    <div
                                        class="flex items-center gap-2 text-slate-300 text-xs font-bold  tracking-wider">
                                        <Icon icon="ph:hash-bold" class="text-white text-sm" />
                                        <span>{{ event?.code }}</span>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-wrap gap-3 flex-shrink-0">
                        <BaseButton variant="white" icon="ph:share-network-bold"
                            class="h-11 px-5 border-white/20 shadow-sm font-bold" @click="openShareDialog">
                            {{ $t('dashboard_event_overview.share_button') }}
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content (Overview) -->

        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-8">
            <!-- Stats Grid Skeleton -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div v-for="i in 4" :key="i"
                    class="bg-white rounded-xl p-5 h-32 border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div class="flex justify-between items-start">
                        <div class="space-y-2">
                            <div class="h-3 w-20 bg-gray-100 animate-pulse rounded"></div>
                            <div class="h-8 w-12 bg-gray-100 animate-pulse rounded-lg"></div>
                        </div>
                        <div class="size-10 bg-gray-50 animate-pulse rounded-lg"></div>
                    </div>
                    <div class="h-3 w-24 bg-gray-50 animate-pulse rounded mt-auto"></div>
                </div>
            </div>

            <!-- Main Content Grid Skeleton -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Analytics Skeleton -->
                <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
                        <div class="h-6 w-40 bg-gray-100 animate-pulse rounded"></div>
                        <div class="h-4 w-20 bg-gray-50 animate-pulse rounded"></div>
                    </div>
                    <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/10">
                        <div class="space-y-5">
                            <div class="h-3 w-24 bg-gray-100 animate-pulse rounded mb-6"></div>
                            <div v-for="i in 5" :key="i" class="space-y-2">
                                <div class="flex justify-between">
                                    <div class="h-4 w-32 bg-gray-100 animate-pulse rounded"></div>
                                    <div class="h-4 w-8 bg-gray-50 animate-pulse rounded"></div>
                                </div>
                                <div class="h-1.5 w-full bg-gray-100 animate-pulse rounded-full"></div>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div class="h-3 w-32 bg-gray-100 animate-pulse rounded mb-6"></div>
                            <div v-for="i in 3" :key="i"
                                class="h-20 bg-white border border-gray-50 rounded-xl animate-pulse">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Leaderboard Skeleton -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
                        <div class="h-6 w-32 bg-gray-100 animate-pulse rounded"></div>
                        <div class="h-4 w-16 bg-gray-50 animate-pulse rounded"></div>
                    </div>
                    <div class="p-0">
                        <div v-for="i in 5" :key="i"
                            class="border-b border-gray-50 p-4 px-6 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="size-6 bg-gray-100 animate-pulse rounded"></div>
                                <div class="space-y-2">
                                    <div class="h-4 w-32 bg-gray-100 animate-pulse rounded"></div>
                                    <div class="h-3 w-20 bg-gray-50 animate-pulse rounded"></div>
                                </div>
                            </div>
                            <div class="h-6 w-10 bg-gray-100 animate-pulse rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab Content -->
        <div v-else class="space-y-8">
            <!-- OVERVIEW TAB -->
            <div v-if="activeTab === 'overview'" class="space-y-8">                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <!-- Total Pemanah -->
                    <StatCard
                        :title="$t('dashboard_event_overview.stats.total_archers')"
                        :value="event?.participant_count || 0"
                        icon="ph:users"
                        color="primary"
                    >
                        <template #footer>
                                <p class="text-green-600 text-xs font-bold flex items-center gap-1">
                                <Icon icon="ph:trend-up" class="text-[14px]" />
                                {{ participants.length }} {{ $t('dashboard_event_overview.registered') }}
                            </p>
                        </template>
                    </StatCard>

                    <!-- Total Tim Resmi -->
                    <StatCard
                        :title="$t('dashboard_event_overview.stats.total_teams')"
                        :value="totalTeams"
                        icon="ph:users-three"
                        color="primary"
                    >
                        <template #footer>
                                <NuxtLink :to="`/dashboard/organizer/events/${route.params.id}/teams`"
                                class="text-primary text-[10px] font-black tracking-widest hover:underline flex items-center gap-1">
                                {{ $t('dashboard_event_overview.manage_teams') }}
                                <Icon icon="ph:arrow-right-bold" />
                            </NuxtLink>
                        </template>
                    </StatCard>

                    <!-- Penyelesaian -->
                    <StatCard
                        :title="$t('dashboard_event_overview.stats.completion')"
                        :value="completionPercentage + '%'"
                        icon="ph:check-square-offset"
                        color="primary"
                    >
                        <template #footer>
                            <div class="w-full bg-gray-100 rounded-full h-1.5 mt-auto">
                                <div class="bg-primary h-1.5 rounded-full" :style="`width: ${completionPercentage}%`"></div>
                            </div>
                        </template>
                    </StatCard>

                    <!-- Sisa Waktu -->
                    <StatCard
                        :title="$t('dashboard_event_overview.stats.time_left')"
                        :value="timeLeft"
                        icon="ph:timer"
                        color="primary"
                    >
                        <template #footer>
                            <p class="text-text-secondary text-xs font-medium">{{ t('dashboard_event_overview.estimated_end') }}: {{ estimatedEnd }}</p>
                        </template>
                    </StatCard>
                </div>

                <!-- Main Content Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Registration Analytics -->
                    <div
                        class="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-sm">
                        <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 class="text-navy-dark font-bold text-lg flex items-center gap-2">{{ $t('dashboard_event_overview.registration_analysis') }}
                            </h3>
                            <NuxtLink :to="`/dashboard/events/${route.params.id}/participants`"
                                class="text-xs text-navy font-bold hover:text-primary transition-colors">{{ $t('dashboard_event_overview.view_all_participants') }}</NuxtLink>
                        </div>
                        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/30">
                            <!-- By Category -->
                            <div>
                                <h4 class="text-[10px] font-black text-gray-400  tracking-[0.2em] mb-4">{{ $t('dashboard_event_overview.category_distribution') }}</h4>
                                <div class="space-y-4">
                                    <div v-for="cat in registrationStats.categories.slice(0, 5)" :key="cat.name"
                                        class="space-y-1.5">
                                        <div class="flex items-center gap-3 text-sm">
                                            <div
                                                class="size-8 rounded-lg bg-navy/5 flex items-center justify-center p-1.5 shrink-0">
                                                <img :src="'/' + getCategoryIcon(`${cat.division} ${cat.event_type} ${cat.gender}`)"
                                                    :alt="cat.division" class="w-full h-full object-contain" />
                                            </div>
                                            <span class="font-bold text-navy-dark truncate pr-2">{{ cat.division }} - {{
                                                cat.name }}</span>
                                            <span class="text-navy font-black font-mono shrink-0 ml-auto">{{ cat.count
                                            }}</span>
                                        </div>
                                        <div class="w-full bg-gray-200 rounded-full h-1.5">
                                            <div class="bg-navy h-1.5 rounded-full transition-all duration-500"
                                                :style="`width: ${(cat.count / Math.max(1, participants.length)) * 100}%`">
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="registrationStats.categories.length === 0"
                                        class="py-10 text-center text-gray-400 italic text-xs">
                                        {{ $t('dashboard_event_overview.no_category_data') }}
                                    </div>
                                    <p v-if="registrationStats.categories.length > 5"
                                        class="text-[10px] text-gray-400 italic text-center pt-2">
                                        {{ $t('dashboard_event_overview.showing_top_categories') }}
                                    </p>
                                </div>
                            </div>
                            <!-- Payment Status -->
                            <div>
                                <h4 class="text-[10px] font-black text-gray-400  tracking-[0.2em] mb-4">{{ t('dashboard_event_overview.payment_status_heading') }}</h4>
                                <div class="space-y-3">
                                    <div
                                        class="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-0.5">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-primary">
                                                <Icon icon="ph:check-circle-fill" class="text-xl" />
                                            </div>
                                            <div>
                                                <span
                                                    class="block text-sm font-bold text-navy-dark leading-tight">{{ t('dashboard_event_overview.payment_paid') }}</span>
                                                <span class="text-[10px] text-gray-400 font-medium">{{ t('dashboard_event_overview.payment_paid_desc') }}</span>
                                            </div>
                                        </div>
                                        <span class="text-2xl font-black text-green-600 font-mono">{{
                                            registrationStats.payment.lunas }}</span>
                                    </div>
                                    <div
                                        class="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-0.5">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-primary">
                                                <Icon icon="ph:clock-fill" class="text-xl" />
                                            </div>
                                            <div>
                                                <span
                                                    class="block text-sm font-bold text-navy-dark leading-tight">{{ t('dashboard_event_overview.payment_pending') }}</span>
                                                <span class="text-[10px] text-gray-400 font-medium">{{ t('dashboard_event_overview.payment_pending_desc') }}</span>
                                            </div>
                                        </div>
                                        <span class="text-2xl font-black text-amber-600 font-mono">{{
                                            registrationStats.payment.menunggu_acc }}</span>
                                    </div>
                                    <div
                                        class="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-0.5">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-primary">
                                                <Icon icon="ph:warning-circle-fill" class="text-xl" />
                                            </div>
                                            <div>
                                                <span class="block text-sm font-bold text-navy-dark leading-tight">{{ t('dashboard_event_overview.payment_unpaid') }}</span>
                                                <span class="text-[10px] text-gray-400 font-medium">{{ t('dashboard_event_overview.payment_unpaid_desc') }}</span>
                                            </div>
                                        </div>
                                        <span class="text-2xl font-black text-red-600 font-mono">{{
                                            registrationStats.payment.belum_lunas }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Leaderboard -->
                    <div class="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-sm">
                        <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 class="text-navy-dark font-bold text-lg flex items-center gap-2">{{ $t('dashboard_event_overview.leaderboard.title') }}</h3>
                        </div>
                        <div class="flex-1 overflow-y-auto max-h-[440px] p-4">
                            <div class="space-y-3">
                                <div v-for="(participant, idx) in topParticipants" :key="participant.id"
                                    @click="navigateTo(`/dashboard/events/${route.params.id}/participants/${participant.athlete_code || participant.id}`)"
                                    class="group relative bg-white border border-gray-50 rounded-2xl p-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer flex items-center gap-4">

                                    <!-- Avatar with Rank Badge -->
                                    <div class="relative shrink-0 mr-2">
                                        <div
                                            class="size-12 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm relative z-0">
                                            <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)"
                                                class="w-full h-full object-cover" />
                                        </div>
                                        <div class="absolute -top-1 -right-1 size-6 rounded-lg flex items-center justify-center font-black text-[10px] shadow-md z-10 border-2 border-white"
                                            :class="getRankClass(idx)">
                                            {{ idx + 1 }}
                                        </div>
                                    </div>

                                    <!-- Info -->
                                    <div class="flex-1 min-w-0">
                                        <div
                                            class="text-navy font-black truncate group-hover:text-primary transition-colors leading-tight">
                                            {{ participant.full_name }}
                                        </div>
                                        <div class="flex items-center gap-2 mt-1">
                                            <div
                                                class="flex items-center gap-1.5 px-2 py-0.5 bg-navy/5 rounded-md shrink-0">
                                                <img :src="'/' + getCategoryIcon(`${participant.division_name} ${participant.event_type_name} ${participant.gender_division_name}`)"
                                                    class="size-3 object-contain opacity-60" />
                                                <span
                                                    class="text-[9px] font-black text-gray-500 tracking-wider truncate max-w-[80px]">
                                                    {{ participant.division_name }}
                                                </span>
                                            </div>
                                            <span class="text-[10px] font-bold text-gray-300 truncate">
                                                {{ participant.club_name }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Score -->
                                    <div class="text-right shrink-0">
                                        <div
                                            class="text-xl font-black text-navy group-hover:scale-110 transition-transform tabular-nums">
                                            {{ participant.total_score || 0 }}
                                        </div>
                                            <div class="text-[9px] font-black text-gray-400 tracking-tighter">{{ t('dashboard_event_overview.total_score_label') }}</div>
                                    </div>
                                </div>

                                <div v-if="topParticipants.length === 0"
                                    class="py-12 text-center text-gray-400 italic font-medium bg-gray-50/50 rounded-2xl">
                                    {{ $t('dashboard_event_overview.leaderboard.no_scores') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

        <!-- Share Dialog -->
        <!-- Share Dialog (Teleported) -->
        <ClientOnly>
            <Teleport to="body">
                <div v-if="showShareDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <!-- Backdrop -->
                    <div class="share-dialog-backdrop absolute inset-0 bg-navy-dark/80 backdrop-blur-sm"
                        @click="closeShareDialog"></div>

                    <!-- Dialog Card -->
                    <div
                        class="share-dialog-card bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden border border-gray-100">
                        <!-- Decorative Border Top -->
                        <div class="bg-primary h-1.5 w-full"></div>

                        <div class="p-8">
                            <!-- Close Button -->
                            <BaseButton @click="closeShareDialog" variant="white" size="sm" icon="ph:x-bold"
                                class="absolute right-6 top-6 h-10 w-10 p-0 border-none shadow-none text-gray-400 hover:text-navy" />

                            <!-- Header -->
                            <div class="flex items-start gap-4 mb-8">
                                <div class="p-3 bg-primary/10 text-primary rounded-2xl shrink-0">
                                    <Icon icon="ph:share-network-bold" class="text-3xl" />
                                </div>
                                <div>
                                    <h3 class="text-navy-dark text-xl font-black tracking-tight mb-2">{{ $t('dashboard_event_overview.share_dialog.title') }}</h3>
                                    <p class="text-text-secondary text-sm font-medium leading-relaxed">
                                        {{ $t('dashboard_event_overview.share_dialog.desc') }}
                                    </p>
                                </div>
                            </div>

                            <!-- Link Copy Segment -->
                            <div class="space-y-3 mb-8">
                                <label class="text-[10px] font-black text-gray-400 tracking-[0.2em]">{{ $t('dashboard_event_overview.share_dialog.public_link_label') }}</label>
                                <div class="flex items-center gap-2">
                                    <div
                                        class="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-600 font-mono truncate">
                                        {{ publicEventUrl }}
                                    </div>
                                    <BaseButton @click="copyPublicUrl" variant="primary" size="sm"
                                        :icon="copySuccess ? 'ph:check-bold' : 'ph:copy-bold'"
                                        class="px-5 h-10 font-bold tracking-widest text-[10px] shrink-0 shadow-md">
                                        {{ copySuccess ? $t('dashboard_event_overview.share_dialog.copied') : $t('dashboard_event_overview.share_dialog.copy') }}
                                    </BaseButton>
                                </div>
                            </div>

                            <!-- Social Sharing -->
                            <div class="space-y-4">
                                <label class="text-[10px] font-black text-gray-400 tracking-[0.2em]">{{ $t('dashboard_event_overview.share_dialog.share_to_social') }}</label>
                                <div class="grid grid-cols-4 gap-3">
                                    <div v-for="social in [
                                        { id: 'whatsapp', icon: 'ph:whatsapp-logo-fill', color: 'text-green-500', bg: 'bg-green-50', hover: 'hover:bg-green-500' },
                                        { id: 'telegram', icon: 'ph:telegram-logo-fill', color: 'text-sky-500', bg: 'bg-sky-50', hover: 'hover:bg-sky-500' },
                                        { id: 'twitter', icon: 'ph:twitter-logo-fill', color: 'text-black', bg: 'bg-gray-100', hover: 'hover:bg-black' },
                                        { id: 'facebook', icon: 'ph:facebook-logo-fill', color: 'text-blue-600', bg: 'bg-blue-50', hover: 'hover:bg-blue-600' }
                                    ]" :key="social.id" @click="shareTo(social.id)"
                                        class="flex flex-col items-center gap-2 group cursor-pointer">
                                        <div :class="[social.bg, social.color]"
                                            class="size-12 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-navy transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:-translate-y-1">
                                            <Icon :icon="social.icon" class="text-2xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Background Ornament -->
                            <div
                                class="absolute top-0 right-0 -mr-12 -mt-12 size-32 bg-gray-50 rounded-full -z-10 blur-2xl">
                            </div>
                        </div>
                    </div>
                </div>
            </Teleport>
        </ClientOnly>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { getCategoryIcon } from '~/utils/logoArcheryCategory'
import Breadcrumbs from '~/components/common/Breadcrumbs.vue'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useEventContext } from '~/composables/useEventContext'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'

definePageMeta({
    layout: 'dashboard'
})

const { t } = useI18n()

useHead({
    title: t('dashboard_event_overview.meta_title')
})

const route = useRoute()
const { get, post } = useApi()
const { setEvent, clearEvent } = useEventContext()

const { user } = useAuth()
const userRole = computed(() => user.value?.role || 'archer')

const breadcrumbItems = computed(() => [
    { label: t('dashboard.breadcrumbs.dashboard'), path: '/dashboard' },
    { label: t('dashboard.sidebar.event'), path: userRole.value === 'archer' ? '/dashboard/archers/events' : '/dashboard/events' }
])

const event = ref(null)
const eventCategories = ref([])
const participants = ref([])
const totalTeams = ref(0)
const searchQuery = ref('')
const isLoading = ref(true)
const isPublishing = ref(false)
const activeTab = ref('overview')
const showShareDialog = ref(false)
const copySuccess = ref(false)
const now = ref(new Date())
let timer = null

const filteredParticipants = computed(() => {
    if (!searchQuery.value) return participants.value
    const q = searchQuery.value.toLowerCase()
    return participants.value.filter(p =>
        p.full_name?.toLowerCase().includes(q) ||
        p.name?.toLowerCase().includes(q) ||
        p.athlete_code?.toLowerCase().includes(q) ||
        p.club_name?.toLowerCase().includes(q) ||
        p.club_id?.toLowerCase().includes(q)
    )
})

const tabs = [
    { id: 'overview', label: 'Ringkasan', icon: 'ph:layout-bold' }
]

const groupedTargets = computed(() => {
    const targets = {}
    participants.value.forEach(p => {
        if (!p.target_name) return
        if (!targets[p.target_name]) {
            targets[p.target_name] = []
        }
        targets[p.target_name].push(p)
    })
    return targets
})

const maxTargets = computed(() => {
    try {
        if (!groupedTargets.value || typeof groupedTargets.value !== 'object') return 20
        const targetNames = Object.keys(groupedTargets.value)
        if (targetNames.length === 0) return 20
        // Extract numbers from target_name (e.g., "A6" -> 6)
        const targetNumbers = targetNames
            .map(name => parseInt(name.replace(/^\D+/g, '')))
            .filter(n => !isNaN(n) && isFinite(n) && n > 0)

        if (targetNumbers.length === 0) return 20
        const max = Math.max(...targetNumbers, 20)
        return isFinite(max) && max > 0 ? max : 20
    } catch (error) {
        console.error('Error calculating maxTargets:', error)
        return 20
    }
})

const completionPercentage = computed(() => {
    if (!event.value || !participants.value.length) return 0
    // Simple calculation - can be enhanced with actual completion data
    const assigned = participants.value.filter(p => p.target_name).length
    return Math.round((assigned / participants.value.length) * 100)
})

const timeLeft = computed(() => {
    if (!event.value?.end_date) return 'N/A'
    const end = new Date(event.value.end_date)
    const diff = end - now.value
    if (diff < 0) return t('dashboard_event_overview.completed')

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
})

const estimatedEnd = computed(() => {
    if (!event.value?.end_date) return 'N/A'
    const end = new Date(event.value.end_date)
    return end.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
})

const topParticipants = computed(() => {
    return participants.value
        .filter(p => p.total_score)
        .sort((a, b) => (b.total_score || 0) - (a.total_score || 0))
        .slice(0, 5)
})

const registrationStats = computed(() => {
    const stats = {
        byCategory: {},
        byPayment: {
            lunas: 0,
            menunggu_acc: 0,
            belum_lunas: 0
        }
    }

    participants.value.forEach(p => {
        // Category stats
        const catId = p.category_id || 'unassigned'
        if (!stats.byCategory[catId]) {
            stats.byCategory[catId] = {
                name: p.category_name || t('dashboard_event_overview.unassigned_category'),
                division: p.division_name || 'N/A',
                event_type: p.event_type_name || '',
                gender: p.gender_division_name || '',
                count: 0
            }
        }
        stats.byCategory[catId].count++

        // Payment stats
        const status = p.payment_status?.toLowerCase()
        if (status === 'lunas' || status === 'paid') stats.byPayment.lunas++
        else if (status === 'menunggu_acc' || status === 'menunggu acc' || status === 'pending') stats.byPayment.menunggu_acc++
        else stats.byPayment.belum_lunas++
    })

    return {
        categories: Object.values(stats.byCategory).sort((a, b) => b.count - a.count),
        payment: stats.byPayment
    }
})

const publicEventUrl = computed(() => {
    const slug = event.value?.slug || route.params.id
    const origin = window?.location?.origin || 'https://archeryhub.id'
    return `${origin}/events/${slug}`
})

const openShareDialog = () => {
    copySuccess.value = false
    showShareDialog.value = true
    nextTick(() => {
        const dialog = document.querySelector('.share-dialog-card')
        const backdrop = document.querySelector('.share-dialog-backdrop')
        if (dialog && backdrop) {
            gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3 })
            gsap.fromTo(dialog, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' })
        }
    })
}

const closeShareDialog = () => {
    const dialog = document.querySelector('.share-dialog-card')
    const backdrop = document.querySelector('.share-dialog-backdrop')
    if (dialog && backdrop) {
        gsap.to(dialog, {
            opacity: 0, scale: 0.9, y: 20, duration: 0.2, ease: 'power2.in', onComplete: () => {
                showShareDialog.value = false
            }
        })
        gsap.to(backdrop, { opacity: 0, duration: 0.2 })
    } else {
        showShareDialog.value = false
    }
}

const copyPublicUrl = async () => {
    try {
        await navigator.clipboard.writeText(publicEventUrl.value)
        copySuccess.value = true
        setTimeout(() => {
            copySuccess.value = false
        }, 2000)
    } catch (e) {
        console.error('Failed to copy link:', e)
    }
}

const shareTo = (platform) => {
    const url = encodeURIComponent(publicEventUrl.value)
    const text = encodeURIComponent(event.value?.name || t('dashboard_event_overview.archery_event'))

    let shareUrl = ''
    if (platform === 'whatsapp') {
        shareUrl = `https://wa.me/?text=${text}%20-%20${url}`
    } else if (platform === 'telegram') {
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
    } else if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
    } else if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'noopener,noreferrer')
    }
}

const alerts = computed(() => {
    // Generate alerts based on event status
    const alertList = []
    if (participants.value.filter(p => !p.target_name).length > 0) {
        const count = participants.value.filter(p => !p.target_name).length
        alertList.push({
            id: 1,
            type: 'info',
            icon: 'ph:user-plus',
            title: t('dashboard_event_overview.alerts.unassigned_participants_title'),
            message: t('dashboard_event_overview.alerts.unassigned_participants_message', { count })
        })
    }
    return alertList
})

const getTargetHasIssue = (targetNum) => {
    // Placeholder - can be enhanced with actual issue detection
    return false
}

const fetchEventDetails = async () => {
    isLoading.value = true
    try {
        const [eventRes, categoriesRes, participantsRes, teamsRes] = await Promise.all([
            get(`/events/${route.params.id}`),
            get(`/events/${route.params.id}/categories`),
            get(`/events/${route.params.id}/participants`),
            get(`/teams/event/${route.params.id}`)
        ])
        event.value = eventRes
        eventCategories.value = categoriesRes?.categories || []
        participants.value = participantsRes?.participants || []
        totalTeams.value = teamsRes?.total || 0

        if (event.value) {
            setEvent(event.value)
        }
    } catch (error) {
        console.error('Failed to fetch event management data:', error)
    } finally {
        isLoading.value = false
    }
}

const publishEvent = async () => {
    isPublishing.value = true
    try {
        await post(`/events/${route.params.id}/publish`)
        await fetchEventDetails()
    } catch (error) {
        console.error('Failed to publish event:', error)
    } finally {
        isPublishing.value = false
    }
}

onMounted(() => {
    fetchEventDetails()
    timer = setInterval(() => {
        now.value = new Date()
    }, 60000)
})

onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
})

watch(event, (newEvent) => {
    if (newEvent) {
        setEvent(newEvent)
    }
}, { deep: true })

const getStatusClass = (status) => {
    const classes = {
        'active': 'bg-green-50 text-green-700 border-green-100 shadow-green-100/50',
        'draft': 'bg-amber-50 text-amber-700 border-amber-100 shadow-amber-100/50'
    }
    return classes[status] || 'bg-gray-100 text-gray-600 border-gray-200'
}

const getStatusDotClass = (status) => {
    const classes = {
        'active': 'bg-green-500',
        'draft': 'bg-amber-500'
    }
    return classes[status] || 'bg-gray-300'
}

const getStatusLabel = (status) => {
    const labels = {
        'active': t('dashboard_event_overview.active'),
        'draft': t('dashboard_event_overview.draft')
    }
    return labels[status] || status
}

const getRankClass = (idx) => {
    if (idx === 0) return 'bg-yellow-400 text-white'
    if (idx === 1) return 'bg-slate-300 text-slate-700'
    if (idx === 2) return 'bg-orange-400 text-white'
    return 'bg-gray-50 text-gray-400 border border-gray-100'
}
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>

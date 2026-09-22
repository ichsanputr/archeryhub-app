<template>
    <div class="flex flex-col gap-6 md:gap-8 pb-16">
        <!-- Header (Standard Dashboard Navy Style) -->
        <div
            class="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>

            <!-- Decorative Background Elements -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/5 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5 blur-3xl"></div>

            <!-- Header Content -->
            <div class="relative p-6 sm:p-8">
                <div class="flex items-center gap-2 text-xs sm:text-sm text-white/70 mb-3">
                    <NuxtLink to="/dashboard/archer/tournaments" class="hover:text-white transition-colors">{{ t('qualification.nav_event') }}</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-xs" />
                    <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/overview`" class="hover:text-white transition-colors">{{ eventName || t('qualification.event_fallback') }}</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-xs" />
                    <span class="text-white/90 font-medium">{{ t('qualification.nav_title') }}</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-start gap-4">
                        <!-- Icon Badge -->
                        <div
                            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md shrink-0">
                            <Icon icon="ph:chart-line-up-bold" class="text-white text-2xl" />
                        </div>
                        <div class="min-w-0">
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white">{{ t('qualification.title') }}</h1>
                            <div class="text-slate-300 text-xs sm:text-sm mt-1.5">{{ t('qualification.subtitle') }}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 shrink-0">
                        <div v-if="myCategories.length > 1" class="relative">
                            <select
                                v-model="categoryId"
                                @change="updateResultsData"
                                class="h-10 sm:h-11 pl-4 pr-9 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs sm:text-sm font-bold text-white focus:outline-none focus:border-white/50 cursor-pointer transition-colors appearance-none shadow-xs">
                                <option v-for="c in categoryOptions" :key="c.value" :value="c.value" class="bg-navy text-white py-2">
                                    {{ c.title }}
                                </option>
                            </select>
                            <Icon icon="ph:caret-down-bold" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none text-xs" />
                        </div>
                        <div v-else-if="categoryName || (categoryOptions.length === 1)"
                            class="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs sm:text-sm font-bold text-white tracking-wide shadow-xs">
                            {{ categoryName || categoryOptions[0]?.title }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="isLoading" class="space-y-6">
            <div class="h-44 bg-white rounded-2xl animate-pulse border border-slate-200 shadow-xs" />
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div v-for="i in 3" :key="i" class="h-32 bg-white rounded-2xl animate-pulse border border-slate-200 shadow-xs" />
            </div>
            <div class="h-96 bg-white rounded-2xl animate-pulse border border-slate-200 shadow-xs" />
        </div>

        <template v-else>
            <!-- Profile Card -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-6 sm:p-8">
                <div class="flex flex-col sm:flex-row gap-6 items-center sm:items-center justify-between">
                    <div class="flex flex-col sm:flex-row items-center sm:items-center gap-5 text-center sm:text-left min-w-0">
                        <div class="size-20 sm:size-24 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 p-1 overflow-hidden shrink-0 shadow-xs">
                            <img :src="useImageOrDefault(userProfile?.avatar_url, userProfile?.full_name)"
                                :alt="userProfile?.full_name"
                                class="w-full h-full rounded-xl object-cover" />
                        </div>
                        <div class="min-w-0">
                            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
                                {{ userProfile?.full_name || t('qualification.archer') }}
                            </h2>
                            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                                <span class="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold font-mono text-xs sm:text-sm">
                                    BIB #{{ userProfile?.bib_number || '-' }}
                                </span>
                                <span>•</span>
                                <span>{{ currentCategoryName || categoryName || '-' }}</span>
                                <span>•</span>
                                <span>{{ userProfile?.club_name || t('qualification.independent') }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Rank Emblem -->
                    <div class="flex flex-col items-center sm:items-end shrink-0 bg-slate-50 dark:bg-slate-700/40 px-6 py-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-600/60">
                        <span class="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">{{ t('qualification.rank_title') }}</span>
                        <div class="flex items-baseline gap-1">
                            <span class="text-4xl sm:text-5xl font-black text-navy dark:text-white font-mono tracking-tight tabular-nums">
                                {{ qualRank || '-' }}
                            </span>
                            <span v-if="qualRank" class="text-base sm:text-lg font-bold text-navy dark:text-white">{{ getOrdinal(qualRank) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Row (3-Grid Cards Consistent with Dashboard Standards) -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <!-- Total Score -->
                <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between group hover:border-slate-300 transition-colors">
                    <div>
                        <span class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold block mb-1">
                            {{ t('qualification.total_score') }}
                        </span>
                        <span class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight tabular-nums">
                            {{ qualTotalScore || 0 }}
                        </span>
                    </div>
                    <div class="size-14 bg-slate-50 dark:bg-slate-700/60 border border-slate-200/70 dark:border-slate-600 rounded-2xl flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:bg-navy group-hover:text-white transition-all shadow-2xs">
                        <Icon icon="ph:chart-bar-bold" class="text-2xl" />
                    </div>
                </div>

                <!-- Total 10 + X -->
                <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between group hover:border-slate-300 transition-colors">
                    <div>
                        <span class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold block mb-1">
                            {{ t('qualification.total_ten_x') }}
                        </span>
                        <span class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight tabular-nums">
                            {{ qualTotalTenX || 0 }}
                        </span>
                    </div>
                    <div class="size-14 bg-slate-50 dark:bg-slate-700/60 border border-slate-200/70 dark:border-slate-600 rounded-2xl flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:bg-navy group-hover:text-white transition-all shadow-2xs">
                        <Icon icon="ph:target-bold" class="text-2xl" />
                    </div>
                </div>

                <!-- Total X -->
                <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between group hover:border-slate-300 transition-colors">
                    <div>
                        <span class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold block mb-1">
                            {{ t('qualification.total_x') }}
                        </span>
                        <span class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight tabular-nums">
                            {{ qualTotalX || 0 }}
                        </span>
                    </div>
                    <div class="size-14 bg-slate-50 dark:bg-slate-700/60 border border-slate-200/70 dark:border-slate-600 rounded-2xl flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:bg-navy group-hover:text-white transition-all shadow-2xs">
                        <Icon icon="ph:star-bold" class="text-2xl" />
                    </div>
                </div>
            </div>

            <!-- Score Table Card -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
                <div class="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h3 class="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                        <div class="size-8 rounded-lg bg-navy text-white flex items-center justify-center shrink-0">
                            <Icon icon="ph:pencil-line-bold" class="text-base" />
                        </div>
                        <span>{{ t('qualification.history_title') }}</span>
                    </h3>

                    <!-- Session Tabs -->
                    <div v-if="qualSessions.length > 1"
                        class="flex bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl text-xs sm:text-sm font-bold border border-slate-200/80 dark:border-slate-600">
                        <button v-for="(session, idx) in qualSessions" :key="idx" @click="activeSessionIdx = idx"
                            class="px-4 py-1.5 rounded-lg transition-all"
                            :class="activeSessionIdx === idx ? 'bg-white dark:bg-slate-800 text-navy dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'">
                            {{ t('qualification.session', { num: idx + 1 }, `Sesi ${idx + 1}`) }}
                        </button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-xs sm:text-sm min-w-[540px]">
                        <thead>
                            <tr class="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                                <th class="p-4 sm:px-6 w-20 text-center">{{ t('qualification.end') }}</th>
                                <th class="p-4 sm:px-6 text-center">{{ t('qualification.score_details') }}</th>
                                <th class="p-4 sm:px-6 text-center w-24">{{ t('qualification.ten_count') }}</th>
                                <th class="p-4 sm:px-6 text-center w-24">{{ t('qualification.x_count') }}</th>
                                <th class="p-4 sm:px-6 text-center w-36">{{ t('qualification.end_score') }}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-700 font-medium">
                            <template v-if="activeSession && activeSession.end_scores_list && activeSession.end_scores_list.length > 0">
                                <tr v-for="(endTotal, endIdx) in activeSession.end_scores_list" :key="endIdx"
                                    class="hover:bg-slate-50/60 dark:hover:bg-slate-700/40 transition-colors">
                                    <!-- End # -->
                                    <td class="p-4 sm:px-6 text-center">
                                        <div class="size-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-xs sm:text-sm flex items-center justify-center mx-auto">
                                            {{ endIdx + 1 }}
                                        </div>
                                    </td>
                                    <!-- Arrows -->
                                    <td class="p-4 sm:px-6">
                                        <div class="flex justify-center gap-1.5 flex-wrap">
                                            <template v-if="getArrowScores(endIdx).length">
                                                <span v-for="(arrow, aIdx) in getArrowScores(endIdx)" :key="aIdx"
                                                    class="size-8 sm:size-9 flex items-center justify-center rounded-xl font-black font-mono text-xs sm:text-sm shadow-2xs transition-all hover:scale-105"
                                                    :class="getScoreColorClass(arrow)">
                                                    {{ arrow }}
                                                </span>
                                            </template>
                                            <template v-else>
                                                <div class="flex items-center gap-1">
                                                    <div v-for="i in 6" :key="i"
                                                        class="size-8 rounded-lg bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 font-black text-xs">
                                                        –
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </td>
                                    <!-- 10 (Pure 10) -->
                                    <td class="p-4 sm:px-6 text-center font-bold font-mono text-sm sm:text-base text-slate-600 dark:text-slate-300">
                                        {{ getTensFromEnd(endIdx) ?? '-' }}
                                    </td>
                                    <!-- X (Inner 10) -->
                                    <td class="p-4 sm:px-6 text-center font-bold font-mono text-sm sm:text-base text-slate-600 dark:text-slate-300">
                                        {{ getXsFromEnd(endIdx) ?? '-' }}
                                    </td>
                                    <!-- End total -->
                                    <td class="p-4 sm:px-6 text-center font-black font-mono text-xl sm:text-2xl text-slate-900 dark:text-white tabular-nums">
                                        {{ endTotal }}
                                    </td>
                                </tr>

                                <!-- Summary row -->
                                <tr class="bg-slate-50 dark:bg-slate-700/40 border-t-2 border-slate-300 dark:border-slate-600 font-bold">
                                    <td class="p-4 sm:px-6 text-right text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200"
                                        colspan="2">
                                        {{ t('qualification.session_total') }}
                                    </td>
                                    <td class="p-4 sm:px-6 text-center text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                                        {{ getSessionTensTotal() }}
                                    </td>
                                    <td class="p-4 sm:px-6 text-center text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                                        {{ activeSession.total_x ?? '-' }}
                                    </td>
                                    <td class="p-4 sm:px-6 text-center text-2xl sm:text-3xl font-black font-mono text-navy dark:text-white tabular-nums">
                                        {{ activeSession.total_score }}
                                    </td>
                                </tr>
                            </template>

                            <tr v-else>
                                <td colspan="5" class="py-16 text-center p-6">
                                    <div class="size-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto text-slate-400 mb-3">
                                        <Icon icon="ph:target-bold" class="text-2xl" />
                                    </div>
                                    <div class="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                                        {{ t('qualification.no_scores_recorded_title') }}
                                    </div>
                                    <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                                        {{ t('qualification.no_scores_recorded_desc') }}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { useI18n } from 'vue-i18n'
import { useEventContext } from '~/composables/useTournamentContext'

const { t } = useI18n()

const { get } = useApi()
const route = useRoute()
const router = useRouter()
const { setEvent } = useEventContext()
const eventId = route.params.id
const eventName = ref('')

definePageMeta({ layout: 'dashboard' })

useHead({ title: computed(() => `${eventName.value || t('dashboard.my_qualification')} - Archeris Dashboard`) })

const isLoading = ref(true)
const userProfile = ref(null)
const categoryId = ref(null)
const categoryName = ref('')
const archerUuid = ref(null)
const qualSessions = ref([])
const qualTotalScore = ref(0)
const qualTotalTenX = ref(0)
const qualTotalX = ref(0)
const qualRank = ref(null)
const activeSessionIdx = ref(0)
const sessionsArrowData = ref({})
const myCategories = ref([])

const currentCategoryName = computed(() => {
    const cat = myCategories.value.find(c => c.category_id === categoryId.value)
    return cat ? `${cat.division_name} - ${cat.category_name}` : ''
})

const categoryOptions = computed(() => {
    return myCategories.value.map(cat => ({
        title: `${cat.division_name} - ${cat.category_name}`,
        value: cat.category_id
    }))
})

const activeSession = computed(() => qualSessions.value[activeSessionIdx.value] || null)

const getOrdinal = (n) => {
    if (!n) return ''
    const s = [t('qualification.th'), t('qualification.st'), t('qualification.nd'), t('qualification.rd')]
    const v = n % 100
    return s[(v - 20) % 10] || s[v] || s[0]
}

const getScoreColorClass = (score) => {
    if (score === 'X' || score === '10') return 'bg-amber-400 text-slate-950 border border-amber-500'
    if (score === '9') return 'bg-amber-300 text-slate-950 border border-amber-400'
    if (score === '8' || score === '7') return 'bg-red-500 text-white'
    if (score === '6' || score === '5') return 'bg-blue-600 text-white'
    if (score === '4' || score === '3') return 'bg-slate-900 text-white'
    if (score === '2' || score === '1') return 'bg-white text-slate-900 border border-slate-300'
    if (score === 'M') return 'bg-slate-200 text-slate-500'
    return 'bg-slate-100 text-slate-600'
}

const getArrowScores = (endIdx) => {
    if (!activeSession.value) return []
    const assignmentId = activeSession.value.assignment_id || activeSession.value.assignment_uuid || activeSession.value.uuid
    const endData = sessionsArrowData.value[assignmentId]?.find(e => e.end_number === endIdx + 1)
    if (!endData?.arrows) return []
    return endData.arrows.map(a => a.is_x ? 'X' : a.score.toString())
}

const getTensFromEnd = (endIdx) => {
    const arrows = getArrowScores(endIdx)
    if (!arrows.length) return null
    return arrows.filter(a => a === '10').length || 0
}

const getXsFromEnd = (endIdx) => {
    const arrows = getArrowScores(endIdx)
    if (!arrows.length) return null
    return arrows.filter(a => a === 'X').length || 0
}

const getSessionTensTotal = () => {
    if (!activeSession.value) return '-'
    const total10x = activeSession.value.total_10x ?? activeSession.value.total_ten_x
    const totalX = activeSession.value.total_x
    if (total10x !== undefined && totalX !== undefined) {
        return Math.max(0, (Number(total10x) || 0) - (Number(totalX) || 0))
    }
    return '-'
}

const fetchInitialData = async () => {
    isLoading.value = true
    try {
        const [profileRes, eventRes, meRes] = await Promise.allSettled([
            get('/archer/me'),
            get(`/tournaments/${eventId}`),
            get(`/tournaments/${eventId}/participants/me`)
        ])

        if (profileRes.status === 'fulfilled') {
            userProfile.value = profileRes.value?.data || profileRes.value
        }

        if (eventRes.status === 'fulfilled') {
            const evtData = eventRes.value?.event || eventRes.value?.data || eventRes.value
            if (evtData?.name) {
                eventName.value = evtData.name
                setEvent({ id: eventId, name: evtData.name })
            }
        }

        // Use direct participants/me endpoint
        if (meRes.status === 'fulfilled' && meRes.value?.categories?.length) {
            myCategories.value = meRes.value.categories
            const cat = meRes.value.categories[0]
            categoryId.value = cat.category_id
            categoryName.value = `${cat.division_name} - ${cat.category_name}`
            archerUuid.value = meRes.value.archer_id
        }
        await updateResultsData()
    } catch (e) {
        console.error('Failed to fetch initial qualification data:', e)
    } finally {
        isLoading.value = false
    }
}

const updateResultsData = async () => {
    if (!categoryId.value) return
    try {
        const gRes = await get(`/tournaments/${eventId}/results/qualification`, {
            params: { category_id: categoryId.value }
        })
        const list = gRes?.leaderboard || gRes?.results || []
        const myQual = list.find(r =>
            r.archer_uuid === archerUuid.value ||
            r.archer_uuid === userProfile.value?.uuid ||
            r.archer_name === userProfile.value?.full_name ||
            r.archer_name === userProfile.value?.name
        )
        if (myQual) {
            qualRank.value = myQual.rank
            qualTotalScore.value = myQual.total_score ?? 0
            qualTotalTenX.value = myQual.total_10x ?? 0
            qualTotalX.value = myQual.total_x ?? 0
            qualSessions.value = (myQual.sessions || []).map(s => {
                const asgnId = s.assignment_id || s.assignment_uuid || s.uuid
                return {
                    ...s,
                    assignment_id: asgnId,
                    end_scores_list: (s.end_scores && typeof s.end_scores === 'string')
                        ? s.end_scores.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x))
                        : []
                }
            })

            // Fetch per-arrow detail for each session
            for (const session of qualSessions.value) {
                if (session.assignment_id) {
                    const res = await get(`/qualification/assignments/${session.assignment_id}/scores`)
                    if (res?.scores) {
                        sessionsArrowData.value[session.assignment_id] = res.scores
                    }
                }
            }
        } else {
            // Reset if no qual scores
            qualRank.value = null
            qualTotalScore.value = 0
            qualTotalTenX.value = 0
            qualTotalX.value = 0
            qualSessions.value = []
            sessionsArrowData.value = {}
        }
    } catch (e) {
        console.error('Failed to update results:', e)
    }
}

onMounted(fetchInitialData)
</script>

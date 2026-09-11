<template>
    <div class="flex flex-col gap-6 pb-16">
        <!-- Header (Standard Dashboard Style) -->
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
                <div class="flex items-center gap-2 text-sm text-white/60 mb-4">
                    <NuxtLink to="/dashboard/archer/events" class="hover:text-white transition-colors">{{ t('qualification.nav_event', 'Event Saya') }}</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-base" />
                    <NuxtLink :to="`/dashboard/archer/events/${eventId}/overview`" class="hover:text-white transition-colors">{{ eventName || 'Event' }}</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-base" />
                    <span class="text-primary font-medium">{{ t('qualification.nav_title', 'Scorecard Kualifikasi') }}</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-start gap-4">
                        <!-- Icon Badge -->
                        <div
                            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
                            <Icon icon="ph:pencil-line-bold" class="text-primary text-2xl" />
                        </div>
                        <div class="flex-grow">
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight">{{ t('qualification.title', 'Scorecard Kualifikasi') }}</h1>
                            <div class="text-slate-300 text-sm mt-1">Perolehan skor seri kualifikasi, statistik 10s/Xs, dan peringkat atlet.</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 flex-shrink-0">
                        <div v-if="myCategories.length > 1" class="relative">
                            <select
                                v-model="categoryId"
                                @change="updateResultsData"
                                class="h-10 sm:h-11 pl-4 pr-9 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-primary cursor-pointer transition-colors appearance-none">
                                <option v-for="c in categoryOptions" :key="c.value" :value="c.value" class="bg-navy text-white py-2">
                                    {{ c.title }}
                                </option>
                            </select>
                            <Icon icon="ph:caret-down-bold" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none text-xs" />
                        </div>
                        <div v-else-if="categoryName || (categoryOptions.length === 1)"
                            class="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white tracking-wide">
                            {{ categoryName || categoryOptions[0]?.title }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="space-y-6">
            <div class="h-40 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm" />
            <div class="grid grid-cols-3 gap-5">
                <div v-for="i in 3" :key="i" class="h-28 bg-white rounded-2xl animate-pulse border border-slate-100" />
            </div>
            <div class="h-80 bg-white rounded-3xl animate-pulse border border-slate-100" />
        </div>

        <template v-else>
            <!-- Profile Card -->
            <div
                class="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8 relative overflow-hidden group">
                <div
                    class="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none group-hover:bg-primary/10 transition-all duration-500" />
                <div class="flex flex-col sm:flex-row gap-6 items-center sm:items-start relative z-10">
                    <div
                        class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-primary p-1 bg-white dark:bg-slate-800 shadow-lg shrink-0">
                        <img :src="useImageOrDefault(userProfile?.avatar_url, userProfile?.full_name)"
                            class="w-full h-full rounded-xl object-cover" />
                    </div>
                    <div class="flex-1 text-center sm:text-left">
                        <h2 class="text-2xl sm:text-3xl font-black text-navy dark:text-white tracking-tight">
                            {{ userProfile?.full_name || t('qualification.archer') }}
                        </h2>
                        <div
                            class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
                            <span
                                class="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-[10px] font-black capitalize tracking-widest text-slate-500">
                                BIB #{{ userProfile?.bib_number || '-' }}
                            </span>
                            <span class="w-1 h-1 rounded-full bg-slate-300" />
                            <span>{{ currentCategoryName || categoryName || '-' }}</span>
                            <span class="w-1 h-1 rounded-full bg-slate-300" />
                            <span>{{ userProfile?.club_name || t('qualification.independent') }}</span>
                        </div>
                    </div>
                    <!-- Rank Badge -->
                    <div class="flex flex-col items-center sm:items-end">
                        <span class="text-[10px] font-black text-slate-400 tracking-widest mb-1">{{ t('qualification.rank_title') }}</span>
                        <div class="flex items-baseline gap-1">
                            <span class="text-5xl font-black text-primary tracking-tighter tabular-nums">{{ qualRank ||
                                '-' }}</span>
                            <span class="text-base font-bold text-primary">{{ getOrdinal(qualRank) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Row -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                <div
                    class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <span class="text-[10px] text-slate-400 font-black tracking-widest block mb-1">
                            {{ t('qualification.total_score') }}
                        </span>
                        <span class="text-4xl font-black text-navy dark:text-white tracking-tighter tabular-nums">{{
                            qualTotalScore || 0 }}</span>
                    </div>
                    <div
                        class="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        <Icon icon="ph:chart-bar-bold" class="text-3xl" />
                    </div>
                </div>
                <div
                    class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <span class="text-[10px] text-slate-400 font-black tracking-widest block mb-1">
                            {{ t('qualification.total_ten_x') }}
                        </span>
                        <span class="text-4xl font-black text-navy dark:text-white tracking-tighter tabular-nums">{{
                            qualTotalTenX || 0 }}</span>
                    </div>
                    <div
                        class="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        <Icon icon="ph:target-bold" class="text-3xl" />
                    </div>
                </div>
                <div
                    class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <span class="text-[10px] text-slate-400 font-black tracking-widest block mb-1">
                            {{ t('qualification.total_x') }}
                        </span>
                        <span class="text-4xl font-black text-navy dark:text-white tracking-tighter tabular-nums">{{
                            qualTotalX || 0 }}</span>
                    </div>
                    <div
                        class="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        <Icon icon="ph:star-bold" class="text-3xl" />
                    </div>
                </div>
            </div>

            <!-- Score Table Card -->
            <div
                class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div
                    class="p-6 sm:p-8 border-b border-slate-50 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-900/10">
                    <h4 class="font-black text-xl text-navy dark:text-white flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                            <Icon icon="ph:chart-line-up-bold" class="text-lg" />
                        </div>
                        {{ t('qualification.history_title') }}
                    </h4>
                    <!-- Session Tabs -->
                    <div v-if="qualSessions.length > 1"
                        class="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-[10px] font-black tracking-widest border border-slate-200 dark:border-slate-700 shadow-inner">
                        <button v-for="(session, idx) in qualSessions" :key="idx" @click="activeSessionIdx = idx"
                            class="px-5 py-2 rounded-lg transition-all"
                            :class="activeSessionIdx === idx ? 'bg-white dark:bg-slate-700 text-navy dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'">
                            {{ t('qualification.session', { num: idx + 1 }) }}
                        </button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left min-w-[480px]">
                        <thead
                            class="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 text-[10px] font-black tracking-widest">
                            <tr>
                                <th class="px-6 sm:px-8 py-4">{{ t('qualification.end') }}</th>
                                <th class="px-6 sm:px-8 py-4 text-center">{{ t('qualification.score_details') }}</th>
                                <th class="px-6 sm:px-8 py-4 text-center">{{ t('qualification.end_score') }}</th>
                                <th class="px-6 sm:px-8 py-4 text-center">{{ t('qualification.ten_x') }}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50 dark:divide-slate-700 font-medium">
                            <template v-if="activeSession">
                                <tr v-for="(endTotal, endIdx) in activeSession.end_scores_list" :key="endIdx"
                                    class="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                                    <!-- End # -->
                                    <td class="px-6 sm:px-8 py-5">
                                        <div
                                            class="w-8 h-8 rounded-lg bg-navy/5 dark:bg-white/10 flex items-center justify-center font-black text-navy dark:text-white text-sm">
                                            {{ endIdx + 1 }}
                                        </div>
                                    </td>
                                    <!-- Arrows -->
                                    <td class="px-6 sm:px-8 py-5">
                                        <div class="flex justify-center gap-1.5">
                                            <template v-if="getArrowScores(endIdx).length">
                                                <span v-for="(arrow, aIdx) in getArrowScores(endIdx)" :key="aIdx"
                                                    class="w-9 h-9 flex items-center justify-center rounded-xl font-bold text-xs shadow-sm transition-all hover:scale-110"
                                                    :class="getScoreColorClass(arrow)">
                                                    {{ arrow }}
                                                </span>
                                            </template>
                                            <template v-else>
                                                <div class="flex items-center gap-1">
                                                    <div v-for="i in 6" :key="i"
                                                        class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 text-[10px] font-black">
                                                        –
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </td>
                                    <!-- End total -->
                                    <td
                                        class="px-6 sm:px-8 py-5 text-center font-black text-2xl text-navy dark:text-white tabular-nums">
                                        {{ endTotal }}
                                    </td>
                                    <!-- 10s + X for this end -->
                                    <td
                                        class="px-6 sm:px-8 py-5 text-center text-slate-500 dark:text-slate-400 font-bold">
                                        {{ getTensFromEnd(endIdx) || '-' }}
                                    </td>
                                </tr>

                                <!-- Summary row -->
                                <tr class="bg dark:bg-primary/5 border-t-2 border-primary">
                                    <td class="px-6 sm:px-8 py-5 text-right tracking-widest text-[10px] text-slate-500 font-black"
                                        colspan="2">
                                        {{ t('qualification.session_total') }}
                                    </td>
                                    <td
                                        class="px-6 sm:px-8 py-5 text-center text-3xl font-black tracking-tighter tabular-nums">
                                        {{ activeSession.total_score }}
                                    </td>
                                    <td
                                        class="px-6 sm:px-8 py-5 text-center text-3xl text-navy dark:text-white font-black">
                                        {{ activeSession.total_10x || '-' }}
                                    </td>
                                </tr>
                            </template>

                            <tr v-else>
                                <td colspan="4" class="py-20 text-center">
                                    <Icon icon="ph:target-light" class="text-6xl mx-auto mb-4 opacity-10" />
                                    <span class="text-xs font-black tracking-widest text-slate-300 block">
                                        {{ t('qualification.no_data') }}
                                    </span>
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
import { useEventContext } from '~/composables/useEventContext'

const { t } = useI18n()

const { get } = useApi()
const route = useRoute()
const router = useRouter()
const { setEvent } = useEventContext()
const eventId = route.params.id
const eventName = ref('')

definePageMeta({ layout: 'dashboard' })

useHead({ title: computed(() => `${eventName.value || t('dashboard.my_qualification', 'Hasil Kualifikasi Saya')} - Archeris Dashboard`) })

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
    if (score === 'X' || score === '10') return 'bg-primary text-slate-900'
    if (score === '9') return 'bg-primary/20 text-slate-900 border border-primary/30'
    if (score === '8' || score === '7') return 'bg-red-500 text-white shadow-red-500/20'
    if (score === '6' || score === '5') return 'bg-blue-500 text-white shadow-blue-500/20'
    if (score === '4' || score === '3') return 'bg-slate-800 text-white'
    if (score === 'M') return 'bg-slate-200 text-slate-400'
    return 'bg-slate-100 text-slate-500'
}

const getArrowScores = (endIdx) => {
    if (!activeSession.value) return []
    const assignmentId = activeSession.value.assignment_id
    const endData = sessionsArrowData.value[assignmentId]?.find(e => e.end_number === endIdx + 1)
    if (!endData?.arrows) return []
    return endData.arrows.map(a => a.is_x ? 'X' : a.score.toString())
}

const getTensFromEnd = (endIdx) => {
    const arrows = getArrowScores(endIdx)
    if (!arrows.length) return null
    return arrows.filter(a => a === 'X' || a === '10').length || 0
}

const handleBack = () => router.back()

const fetchInitialData = async () => {
    isLoading.value = true
    try {
        const [profileRes, eventRes, meRes] = await Promise.allSettled([
            get('/archer/me'),
            get(`/events/${eventId}`),
            get(`/events/${eventId}/participants/me`)
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
        const gRes = await get(`/events/${eventId}/results/qualification`, {
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
            qualSessions.value = (myQual.sessions || []).map(s => ({
                ...s,
                end_scores_list: (s.end_scores && typeof s.end_scores === 'string')
                    ? s.end_scores.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x))
                    : []
            }))

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

<template>
    <div class="flex flex-col gap-6 pb-16">
        <!-- Header (matching app style from overview.vue) -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.15);"></div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <button @click="handleBack"
                            class="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
                            <Icon icon="ph:arrow-left-bold" class="text-white" />
                        </button>
                        <div>
                            <nav
                                class="flex text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 items-center gap-1.5">
                                <NuxtLink :to="`/dashboard/archer/events/${eventId}`"
                                    class="hover:text-white transition-colors">Event</NuxtLink>
                                <Icon icon="ph:caret-right-bold" class="text-[9px]" />
                                <span class="text-white/70">Hasil Kualifikasi</span>
                            </nav>
                            <h1 class="text-2xl font-black tracking-tight">Hasil Kualifikasi Saya</h1>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 flex-shrink-0">
                        <select v-if="myCategories.length > 0" v-model="categoryId" @change="updateResultsData"
                            class="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-black tracking-wider text-white outline-none cursor-pointer hover:bg-white/20 transition-colors focus:ring-2 focus:ring-primary appearance-none">
                            <option v-for="cat in myCategories" :key="cat.category_id" :value="cat.category_id"
                                class="text-navy">
                                {{ cat.division_name }} - {{ cat.category_name }}
                            </option>
                        </select>
                        <div v-else-if="categoryName"
                            class="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-black tracking-wider">
                            {{ categoryName }}
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
                            {{ userProfile?.full_name || 'Archer' }}
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
                            <span>{{ userProfile?.club_name || 'Independent' }}</span>
                        </div>
                    </div>
                    <!-- Rank Badge -->
                    <div class="flex flex-col items-center sm:items-end">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Peringkat
                            Kualifikasi</span>
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
                        <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">Total
                            Skor</span>
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
                        <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">Total
                            10s+X</span>
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
                        <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">Total
                            X</span>
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
                        Jejak Kualifikasi
                    </h4>
                    <!-- Session Tabs -->
                    <div v-if="qualSessions.length > 1"
                        class="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 shadow-inner">
                        <button v-for="(session, idx) in qualSessions" :key="idx" @click="activeSessionIdx = idx"
                            class="px-5 py-2 rounded-lg transition-all"
                            :class="activeSessionIdx === idx ? 'bg-white dark:bg-slate-700 text-navy dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'">
                            Sesi {{ idx + 1 }}
                        </button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left min-w-[480px]">
                        <thead
                            class="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                            <tr>
                                <th class="px-6 sm:px-8 py-4">End</th>
                                <th class="px-6 sm:px-8 py-4 text-center">Rincian Skor</th>
                                <th class="px-6 sm:px-8 py-4 text-center">Skor End</th>
                                <th class="px-6 sm:px-8 py-4 text-center">10s+X</th>
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
                                    <td class="px-6 sm:px-8 py-5 text-right uppercase tracking-widest text-[10px] text-slate-500 font-black"
                                        colspan="2">
                                        Total Sesi:
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
                                    <span class="text-xs font-black uppercase tracking-widest text-slate-300 block">Data
                                        tidak tersedia</span>
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

const { get } = useApi()
const route = useRoute()
const router = useRouter()
const eventId = route.params.id

definePageMeta({ layout: 'dashboard' })

useHead({ title: 'Hasil Kualifikasi Saya - ArcheryHub Dashboard' })

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

const activeSession = computed(() => qualSessions.value[activeSessionIdx.value] || null)

const getOrdinal = (n) => {
    if (!n) return ''
    const s = ["th", "st", "nd", "rd"]
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
        const profileRes = await get('/archer/me')
        userProfile.value = profileRes?.data
        const searchEmail = userProfile.value?.email

        const participantsRes = await get(`/events/${eventId}/participants`, {
            params: { limit: 100, group_by: 'archer', search: searchEmail }
        })
        const me = participantsRes?.participants?.find(p => p.email === searchEmail || p.full_name === userProfile.value?.full_name)
        if (me?.categories?.length) {
            myCategories.value = me.categories
            const cat = me.categories[0]
            categoryId.value = cat.category_id
            categoryName.value = `${cat.division_name} - ${cat.category_name}`
            archerUuid.value = me.archer_id
        }
        await updateResultsData()
    } catch (e) {
        console.error('Failed to fetch data:', e)
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
        const myQual = gRes?.results?.find(r =>
            r.archer_uuid === archerUuid.value ||
            r.archer_uuid === userProfile.value?.uuid ||
            r.archer_name === userProfile.value?.full_name
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

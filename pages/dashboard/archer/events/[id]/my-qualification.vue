<template>
    <div class="flex flex-col gap-8 pb-16"> <!-- Breadcrumbs & Header Actions -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <nav class="flex text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 items-center gap-2">
                    <NuxtLink :to="`/dashboard/events/${eventId}`" class="hover:text-primary transition-colors">Event
                    </NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[10px]" />
                    <span class="text-slate-600 dark:text-slate-300">Hasil Kualifikasi</span>
                </nav>
                <div class="flex items-center gap-4">
                    <button @click="handleBack"
                        class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-primary/50 transition-all text-navy dark:text-white">
                        <Icon icon="ph:arrow-left-bold" />
                    </button>
                    <h2 class="text-3xl font-black text-navy dark:text-white tracking-tight">Hasil Kualifikasi</h2>
                </div>
            </div>
            <div class="flex gap-3">
                <BaseButton variant="white" icon="ph:download-bold" class="h-11 px-6 shadow-sm font-bold">
                    Export PDF
                </BaseButton>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-6">
            <div
                class="h-48 bg-white dark:bg-slate-800 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-700" />
            <div class="h-96 bg-white dark:bg-slate-800 rounded-2xl animate-pulse" />
        </div>

        <template v-else>
            <!-- Profile Header Card (Small) -->
            <div
                class="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 relative overflow-hidden group">
                <div class="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
                    <div
                        class="w-20 h-20 rounded-2xl border-2 border-primary p-1 bg-white dark:bg-slate-800 shadow-lg shrink-0">
                        <img :src="useImageOrDefault(userProfile?.avatar_url, userProfile?.full_name)"
                            class="w-full h-full rounded-xl object-cover" />
                    </div>

                    <div class="flex-1 text-center md:text-left">
                        <h3 class="text-2xl font-black text-navy dark:text-white tracking-tight mb-1">{{
                            userProfile?.full_name || 'Archer' }}</h3>
                        <div
                            class="flex flex-wrap items-center justify-center md:justify-start gap-3 text-slate-500 dark:text-slate-400 font-medium text-xs mb-4">
                            <span
                                class="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-[10px] font-black capitalize tracking-widest text-slate-500">BIB
                                #{{ userProfile?.bib_number || '-' }}</span>
                            <span class="w-1 h-1 rounded-full bg-slate-300" />
                            <span>{{ categoryName || '-' }}</span>
                            <span class="w-1 h-1 rounded-full bg-slate-300" />
                            <span>{{ userProfile?.club_name || 'Independent archer' }}</span>
                        </div>
                    </div>

                    <!-- Qual Rank Badge -->
                    <div class="flex flex-col items-center md:items-end justify-center">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Peringkat
                            Kualifikasi</p>
                        <div class="flex items-baseline gap-1">
                            <span class="text-4xl font-black text-primary tracking-tighter">{{ qualRank || '-' }}</span>
                            <span class="text-sm font-bold text-primary">{{ getOrdinal(qualRank) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Qualification Journey Section -->
            <div class="space-y-8">
                <!-- Qualification Table -->
                <div
                    class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div
                        class="p-8 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/10">
                        <h4 class="font-black text-xl text-navy dark:text-white flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                <Icon icon="ph:chart-line-up-bold" class="text-lg" />
                            </div>
                            Jejak Kualifikasi
                        </h4>
                        <div
                            class="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 shadow-inner">
                            <button v-for="(session, idx) in qualSessions" :key="idx" @click="activeSessionIdx = idx"
                                class="px-6 py-2 rounded-lg transition-all"
                                :class="activeSessionIdx === idx ? 'bg-white dark:bg-slate-700 text-navy dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'">
                                Sesi {{ idx + 1 }}
                            </button>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead
                                class="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                                <tr>
                                    <th class="px-8 py-4">End</th>
                                    <th class="px-8 py-4 text-center">Rincian Skor</th>
                                    <th class="px-8 py-4 text-center">Skor</th>
                                    <th class="px-8 py-4 text-center">10s+X</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50 dark:divide-slate-700 font-medium">
                                <template v-if="activeSession">
                                    <tr v-for="(endTotal, endIdx) in activeSession.end_scores_list" :key="endIdx"
                                        class="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td class="px-8 py-5 font-black text-navy dark:text-white">{{ endIdx + 1 }}</td>
                                        <td class="px-8 py-5">
                                            <div class="flex justify-center gap-1.5">
                                                <template v-if="getArrowScores(endIdx).length">
                                                    <span v-for="(arrow, aIdx) in getArrowScores(endIdx)" :key="aIdx"
                                                        class="w-9 h-9 flex items-center justify-center rounded-xl font-bold text-xs shadow-sm transition-all hover:scale-110"
                                                        :class="getScoreColorClass(arrow)">
                                                        {{ arrow }}
                                                    </span>
                                                </template>
                                                <template v-else>
                                                    <div
                                                        class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                        Total End: {{ endTotal }}
                                                    </div>
                                                </template>
                                            </div>
                                        </td>
                                        <td class="px-8 py-5 text-center font-black text-lg text-navy dark:text-white">
                                            {{ endTotal }}</td>
                                        <td class="px-8 py-5 text-center text-slate-400 font-bold">-</td>
                                    </tr>
                                    <tr class="bg-primary/5 dark:bg-primary/5 font-black">
                                        <td class="px-8 py-6 text-right uppercase tracking-widest text-[10px] text-slate-500"
                                            colspan="2">Ringkasan Sesi:
                                        </td>
                                        <td class="px-8 py-6 text-center text-primary text-2xl tracking-tighter">{{
                                            activeSession.total_score }}</td>
                                        <td class="px-8 py-6 text-center text-navy dark:text-white">{{
                                            activeSession.total_10x || '-' }}</td>
                                    </tr>
                                </template>
                                <tr v-else>
                                    <td colspan="4" class="py-20 text-center">
                                        <Icon icon="ph:target-light" class="text-6xl mx-auto mb-4 opacity-10" />
                                        <p class="text-xs font-black uppercase tracking-widest text-slate-300">Data
                                            tidak tersedia</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
const { get } = useApi()
const route = useRoute()
const router = useRouter()
const eventId = route.params.id

definePageMeta({
    layout: 'dashboard'
})

const isLoading = ref(true)
const userProfile = ref(null)
const categoryId = ref(null)
const categoryName = ref('')
const archerUuid = ref(null)
const qualSessions = ref([])
const qualTotalScore = ref(null)
const qualRank = ref(null)
const activeSessionIdx = ref(0)
const sessionsArrowData = ref({})

const activeSession = computed(() => {
    return qualSessions.value[activeSessionIdx.value] || null
})

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
    return 'bg-slate-100 text-slate-500'
}

const getArrowScores = (endIdx) => {
    if (!activeSession.value) return []
    const assignmentId = activeSession.value.assignment_id
    const endData = sessionsArrowData.value[assignmentId]?.find(e => e.end_number === endIdx + 1)
    if (!endData?.arrows) return []
    return endData.arrows.map(a => a.is_x ? 'X' : a.score.toString())
}

const handleBack = () => router.back()

const fetchInitialData = async () => {
    isLoading.value = true
    try {
        const profileRes = await get('/archer/me')
        userProfile.value = profileRes?.data
        const searchEmail = userProfile.value?.email

        const participantsRes = await get(`/events/${eventId}/participants`, {
            params: { limit: 10, group_by: 'archer', search: searchEmail }
        })
        const me = participantsRes?.participants?.find(p => p.email === searchEmail)
        if (me?.categories?.length) {
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
        const myQual = gRes?.results?.find(r => r.archer_uuid === archerUuid.value)
        if (myQual) {
            qualRank.value = myQual.rank
            qualTotalScore.value = myQual.total_score ?? 0
            const sessions = myQual.sessions || []
            qualSessions.value = sessions.map(s => ({
                ...s,
                end_scores_list: (s.end_scores && typeof s.end_scores === 'string')
                    ? s.end_scores.split(',').map(x => x.trim()).filter(Boolean)
                    : []
            }))

            for (const session of qualSessions.value) {
                if (session.assignment_id) {
                    const res = await get(`/scoring/qualification/assignment/${session.assignment_id}/scores`)
                    if (res?.scores) {
                        sessionsArrowData.value[session.assignment_id] = res.scores
                    }
                }
            }
        }
    } catch (e) {
        console.error('Failed to update results:', e)
    }
}

onMounted(() => {
    fetchInitialData()
})
</script>

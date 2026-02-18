<template>
    <div class="flex flex-col gap-6 pb-12 px-2 sm:px-0">
        <!-- Dashboard Standard Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm mb-2">
            <div class="absolute inset-0 opacity-20"
                style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px);" />
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary" />

            <div class="relative p-5 sm:p-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="flex items-center sm:items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        <button @click="handleBack"
                            class="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/10 text-white shrink-0 backdrop-blur-sm border border-white/20">
                            <Icon icon="ph:arrow-left-bold" class="text-lg sm:text-xl" />
                        </button>
                        <div class="min-w-0">
                            <h1
                                class="text-lg sm:text-3xl font-black leading-tight tracking-tight mb-1 sm:mb-2 truncate">
                                {{ route.query.participant_uuid ? 'Detail Hasil Peserta' : 'Hasil Pertandingan' }}
                            </h1>
                            <div
                                class="flex flex-wrap items-center gap-2 text-[10px] sm:text-sm text-slate-300 font-medium">
                                <span v-if="categoryName"
                                    class="px-2 py-0.5 rounded bg-primary/20 text-primary text-[9px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-md border border-primary/20">
                                    {{ categoryName.split('-')[0].trim() }}
                                </span>
                                <span class="opacity-40 hidden sm:inline">•</span>
                                <span class="truncate">{{ eventName }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i"
                class="h-24 sm:h-32 bg-white rounded-2xl animate-pulse border border-slate-100" />
            <div class="h-64 bg-white rounded-2xl animate-pulse border border-slate-100 col-span-full" />
        </div>

        <template v-else>
            <!-- Profile Overview -->
            <div
                class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div class="flex items-center gap-4 sm:gap-8 w-full sm:w-auto">
                    <img :src="useImageOrDefault(userProfile?.avatar_url, userProfile?.full_name)"
                        class="size-16 sm:size-24 rounded-2xl object-cover border-2 border-white shadow-md shrink-0" />
                    <div class="min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                            <span
                                class="px-2 py-0.5 bg-navy text-primary rounded text-[8px] font-black uppercase">Archer</span>
                            <span class="text-[9px] font-bold text-slate-400 uppercase truncate">{{ categoryName
                                }}</span>
                        </div>
                        <h2 class="text-lg sm:text-2xl font-black text-navy truncate block">{{ userProfile?.full_name ||
                            'Archer' }}</h2>
                        <div class="flex flex-wrap gap-3 mt-2">
                            <span v-if="userProfile?.club_name"
                                class="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                <Icon icon="ph:shield-bold" class="text-primary" /> {{ userProfile.club_name }}
                            </span>
                            <span v-if="userProfile?.city"
                                class="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                <Icon icon="ph:map-pin-bold" class="text-primary" /> {{ userProfile.city }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div class="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                    <Icon icon="ph:crown-fill" class="absolute -right-2 -bottom-2 text-6xl text-navy/5 opacity-10" />
                    <span class="text-[9px] font-black tracking-widest text-slate-400 uppercase block mb-1">Rank</span>
                    <div class="flex items-baseline gap-1">
                        <span class="text-2xl sm:text-4xl font-black text-navy">{{ qualRank || '-' }}</span>
                        <span class="text-[10px] font-bold text-slate-400">/ {{ totalParticipants }}</span>
                    </div>
                </div>

                <div class="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-sm">
                    <span class="text-[9px] font-black tracking-widest text-slate-400 uppercase block mb-1">Total
                        Score</span>
                    <div class="flex items-baseline gap-1">
                        <span class="text-2xl sm:text-4xl font-black text-navy">{{ qualTotalScore || 0 }}</span>
                        <span class="text-[9px] font-bold text-slate-400 uppercase">Pts</span>
                    </div>
                </div>

                <div class="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-sm overflow-hidden">
                    <span class="text-[9px] font-black tracking-widest text-slate-400 uppercase block mb-1">Accuracy
                        (10/X)</span>
                    <div class="flex items-center gap-2 sm:gap-4">
                        <div class="flex flex-col">
                            <span class="text-xl sm:text-3xl font-black text-navy">{{ totalTens || 0 }}</span>
                            <span class="text-[8px] font-bold text-slate-400 uppercase">10s</span>
                        </div>
                        <div class="w-px h-6 bg-slate-100" />
                        <div class="flex flex-col">
                            <span class="text-xl sm:text-3xl font-black text-navy">{{ totalXs || 0 }}</span>
                            <span class="text-[8px] font-bold text-slate-400 uppercase">Xs</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-sm">
                    <span class="text-[9px] font-black tracking-widest text-slate-400 uppercase block mb-1">Avg
                        Arrow</span>
                    <div class="flex items-baseline gap-1">
                        <span class="text-2xl sm:text-4xl font-black text-navy">{{ averageArrowScore }}</span>
                        <span class="text-[9px] font-bold text-slate-400 uppercase">/ Arr</span>
                    </div>
                </div>
            </div>

            <!-- Detailed Qualification Scoresheet -->
            <div class="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden relative group">
                <div
                    class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                <div
                    class="px-6 sm:px-8 py-5 sm:py-6 border-b border-slate-50 flex items-center justify-between relative z-10">
                    <div class="flex items-center gap-4">
                        <div
                            class="size-10 sm:size-12 rounded-xl bg-navy flex items-center justify-center shadow-lg shadow-navy/10">
                            <Icon icon="ph:list-numbers-bold" class="text-primary text-xl" />
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-black text-navy uppercase tracking-wider">Skor
                                Kualifikasi</h3>
                            <p class="text-[10px] sm:text-xs text-slate-400 font-medium">Performa detail setiap rambahan
                            </p>
                        </div>
                    </div>
                </div>

                <div class="p-6 sm:p-8 relative z-10">
                    <div v-if="!qualSessions.length" class="py-16 text-center text-slate-300">
                        <Icon icon="ph:target-light" class="text-6xl mx-auto mb-4 opacity-20" />
                        <p class="text-xs font-bold uppercase tracking-widest">Belum ada skor tercatat</p>
                    </div>

                    <div v-else class="space-y-10">
                        <div v-for="(session, sIdx) in qualSessions" :key="sIdx" class="relative">
                            <div class="flex items-center justify-between gap-4 mb-6">
                                <div class="flex items-center gap-4">
                                    <div
                                        class="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                                        <Icon icon="ph:calendar-blank-bold" class="text-navy text-xs" />
                                        <span
                                            class="text-[10px] sm:text-xs font-black text-navy uppercase tracking-widest">
                                            {{ session.session_name || `Sesi ${sIdx + 1}` }}
                                        </span>
                                    </div>

                                    <NuxtLink v-if="categoryId"
                                        :to="`/dashboard/events/${eventId}/qualification/${categoryId}`"
                                        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/50 transition-colors text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                        <Icon icon="ph:eye-bold" class="text-xs" />
                                        Lihat Kualifikasi
                                    </NuxtLink>
                                </div>

                                <div class="flex items-center gap-3">
                                    <div class="h-px w-8 sm:w-16 bg-slate-100 hidden sm:block" />
                                    <div class="flex items-baseline gap-2">
                                        <span class="text-xl sm:text-3xl font-black text-navy tabular-nums">{{
                                            session.total_score || 0 }}</span>
                                        <span
                                            class="text-[10px] font-black text-slate-400 uppercase tracking-widest">PTS</span>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                                <div v-for="(score, endIdx) in session.end_scores_list" :key="endIdx"
                                    class="p-4 rounded-2xl border border-slate-50 bg-slate-50/30 relative overflow-hidden">
                                    <div class="absolute top-0 right-0 p-2 opacity-20">
                                        <Icon icon="ph:target-bold" class="text-2xl text-red-500" />
                                    </div>
                                    <span
                                        class="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-2">End
                                        {{ endIdx + 1 }}</span>
                                    <div class="text-2xl font-black text-navy tabular-nums">
                                        {{ score }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Elimination Battles - Premium Battle Cards -->
            <div class="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden group">
                <div
                    class="px-6 sm:px-8 py-5 sm:py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div class="flex items-center gap-4">
                        <div
                            class="size-10 sm:size-12 rounded-xl bg-navy flex items-center justify-center shadow-lg shadow-navy/10">
                            <Icon icon="ph:sword-bold" class="text-primary text-xl" />
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-black text-navy uppercase tracking-wider">
                                Eliminasi</h3>
                            <p class="text-[10px] sm:text-xs text-slate-400 font-medium whitespace-nowrap">Perjalanan
                                menuju podium</p>
                        </div>
                    </div>
                    <NuxtLink v-if="bracketId" :to="`/dashboard/events/${eventId}/elimination/${bracketId}`"
                        class="px-4 py-2 rounded-xl bg-navy text-primary text-[10px] font-black uppercase tracking-widest">
                        Lihat Bracket
                    </NuxtLink>
                </div>

                <div v-if="elimMatches.length === 0" class="py-20 text-center text-slate-300">
                    <Icon icon="ph:sword-light" class="text-6xl mx-auto mb-4 opacity-20" />
                    <p class="text-xs font-bold uppercase tracking-widest">Belum memasuki babak eliminasi</p>
                </div>

                <div v-else class="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div v-for="match in elimMatches" :key="match.uuid"
                        class="relative p-0.5 rounded-[32px] overflow-hidden shadow-sm"
                        :class="match.winner_entry_uuid === myEntryUuid ? 'bg-gradient-to-br from-primary via-primary/50 to-primary/5' : 'bg-slate-100'">

                        <div class="bg-white rounded-[31px] p-6 h-full relative overflow-hidden">
                            <!-- Background Decor -->
                            <div class="absolute top-0 left-0 w-full h-1 bg-slate-50" />

                            <div class="flex justify-between items-center mb-6">
                                <span
                                    class="px-3 py-1 rounded-lg bg-navy text-primary text-[9px] font-black uppercase tracking-widest">
                                    Round {{ match.round_no }}
                                </span>
                                <div v-if="match.status === 'completed'"
                                    class="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest"
                                    :class="match.winner_entry_uuid === myEntryUuid ? 'text-green-600' : 'text-slate-400'">
                                    <Icon
                                        :icon="match.winner_entry_uuid === myEntryUuid ? 'ph:trophy-fill' : 'ph:check-bold'"
                                        class="text-sm" />
                                    {{ match.winner_entry_uuid === myEntryUuid ? 'Victory' : 'Defeat' }}
                                </div>
                            </div>

                            <div class="flex items-center gap-4 sm:gap-6">
                                <!-- My Side -->
                                <div class="flex-1 min-w-0 flex flex-col items-center">
                                    <div class="relative mb-3">
                                        <img :src="getAvatarUrl(match.entry_a_name)"
                                            class="size-14 sm:size-16 rounded-2xl object-cover border-2"
                                            :class="match.entry_a_uuid === myEntryUuid ? 'border-primary ring-4 ring-primary/10' : 'border-slate-100'" />
                                        <div v-if="match.winner_entry_uuid === match.entry_a_uuid"
                                            class="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-primary text-navy flex items-center justify-center shadow-lg border-2 border-white">
                                            <Icon icon="ph:crown-fill" class="text-[10px]" />
                                        </div>
                                    </div>
                                    <span
                                        class="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 truncate w-full text-center">
                                        {{ match.entry_a_uuid === myEntryUuid ? 'Me' : 'Archer' }}
                                    </span>
                                    <span
                                        class="text-[10px] sm:text-xs font-black text-navy truncate w-full text-center">{{
                                            match.entry_a_name || 'TBD' }}</span>
                                    <span class="text-2xl sm:text-3xl font-black text-navy mt-3 tabular-nums">{{
                                        match.total_score_a ?? 0 }}</span>
                                </div>

                                <!-- VS Circle -->
                                <div class="shrink-0 flex flex-col items-center gap-1">
                                    <div class="w-px h-6 bg-slate-100" />
                                    <div
                                        class="size-8 rounded-full bg-navy text-primary flex items-center justify-center text-[9px] font-black shadow-lg">
                                        VS</div>
                                    <div class="w-px h-6 bg-slate-100" />
                                </div>

                                <!-- Opponent Side -->
                                <div class="flex-1 min-w-0 flex flex-col items-center">
                                    <div class="relative mb-3">
                                        <img :src="getAvatarUrl(match.entry_b_name)"
                                            class="size-14 sm:size-16 rounded-2xl object-cover border-2"
                                            :class="match.entry_b_uuid === myEntryUuid ? 'border-primary ring-4 ring-primary/10' : 'border-slate-100'" />
                                        <div v-if="match.winner_entry_uuid === match.entry_b_uuid"
                                            class="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-primary text-navy flex items-center justify-center shadow-lg border-2 border-white">
                                            <Icon icon="ph:crown-fill" class="text-[10px]" />
                                        </div>
                                    </div>
                                    <span
                                        class="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 truncate w-full text-center">
                                        {{ match.entry_b_uuid === myEntryUuid ? 'Me' : 'Archer' }}
                                    </span>
                                    <span
                                        class="text-[10px] sm:text-xs font-black text-navy truncate w-full text-center">{{
                                            match.entry_b_name || 'TBD' }}</span>
                                    <span class="text-2xl sm:text-3xl font-black text-navy mt-3 tabular-nums">{{
                                        match.total_score_b ?? 0 }}</span>
                                </div>
                            </div>
                        </div>
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
const eventName = ref('Loading...')
const userProfile = ref(null)
const myEntryUuid = ref(null)
const categoryId = ref(null)
const categoryName = ref('')
const qualSessions = ref([])
const qualTotalScore = ref(null)
const qualRank = ref(null)
const totalParticipants = ref(0)
const totalTens = ref(0)
const totalXs = ref(0)
const elimMatches = ref([])
const bracketId = ref(null)

const averageArrowScore = computed(() => {
    if (!qualSessions.value.length || !qualTotalScore.value) return '0.0'
    let totalArrows = 0
    qualSessions.value.forEach(s => {
        totalArrows += s.end_scores_list.length * 6
    })
    if (totalArrows === 0) return '0.0'
    return (qualTotalScore.value / totalArrows).toFixed(1)
})

const elimStatusLabel = computed(() => {
    if (!elimMatches.value.length) return 'Ready'
    const lastMatch = [...elimMatches.value].reverse()[0]
    if (lastMatch.status !== 'completed') return 'Active'
    if (lastMatch.winner_entry_uuid === myEntryUuid.value) return 'Winner'
    return 'Done'
})

const elimProgressColor = computed(() => {
    const label = elimStatusLabel.value
    if (label === 'Winner') return 'bg-primary'
    if (label === 'Active') return 'bg-blue-500'
    return 'bg-slate-300'
})

const handleBack = () => {
    router.back()
}

const getAvatarUrl = (name) => {
    if (!name) return `https://ui-avatars.com/api/?name=TBD&background=f1f5f9&color=94a3b8&font-size=0.45`
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&font-size=0.45`
}

const fetchInitialData = async () => {
    isLoading.value = true
    try {
        const eventRes = await get(`/events/${eventId}`)
        eventName.value = eventRes?.event?.name || eventRes?.name || 'Event'

        const participantUuid = route.query.participant_uuid
        let searchEmail = ''

        if (participantUuid) {
            const pRes = await get(`/events/${eventId}/participants/${participantUuid}`)
            userProfile.value = {
                full_name: pRes?.full_name,
                avatar_url: pRes?.avatar_url,
                club_name: pRes?.club_name,
                city: pRes?.city,
                bow_type: pRes?.division_name,
                uuid: pRes?.archer_id
            }
            searchEmail = pRes?.email
            categoryId.value = pRes?.category_id
            categoryName.value = `${pRes?.division_name} - ${pRes?.category_name}`
        } else {
            const profileRes = await get('/archer/me')
            userProfile.value = profileRes?.data
            searchEmail = userProfile.value?.email

            const participantsRes = await get(`/events/${eventId}/participants`, {
                params: { limit: 1000, group_by: 'archer', search: searchEmail }
            })
            const me = participantsRes?.participants?.find(p => p.email === searchEmail)
            if (me?.categories?.length) {
                const cat = me.categories[0]
                categoryId.value = cat.category_id
                categoryName.value = `${cat.division_name} - ${cat.category_name}`
            }
        }

        await updateResultsData()
    } catch (e) {
        console.error('Failed to fetch result-user data:', e)
    } finally {
        isLoading.value = false
    }
}

const updateResultsData = async () => {
    if (!categoryId.value) return
    const participantUuid = route.query.participant_uuid

    try {
        // Fetch Qualification Results
        const gRes = await get(`/events/${eventId}/results/qualification`, {
            params: { category_id: categoryId.value }
        })
        totalParticipants.value = gRes?.results?.length || 0
        const myQual = gRes?.results?.find(r =>
            (participantUuid && r.participant_id === participantUuid) ||
            (r.archer_uuid === userProfile.value?.uuid)
        )
        if (myQual) {
            qualRank.value = myQual.rank
            qualTotalScore.value = myQual.total_score ?? 0
            totalTens.value = myQual.total_ten || 0
            totalXs.value = myQual.total_x || 0
            const sessions = myQual.sessions || []
            qualSessions.value = sessions.map(s => ({
                session_name: s.session_name,
                session_code: s.session_code,
                total_score: s.total_score,
                end_scores: s.end_scores,
                end_scores_list: (s.end_scores && typeof s.end_scores === 'string')
                    ? s.end_scores.split(',').map(x => x.trim()).filter(Boolean)
                    : []
            }))
        }

        // Fetch Elimination Results
        const elimRes = await get(`/events/${eventId}/results/elimination`, {
            params: { category_id: categoryId.value }
        })
        if (elimRes?.bracket) {
            bracketId.value = elimRes.bracket.bracket_id || elimRes.bracket.id
            if (elimRes.bracket.matches) {
                const raw = Object.values(elimRes.bracket.matches).flat()
                const allMatches = raw.map(m => ({
                    ...m,
                    entry_a_uuid: m.entry_a_uuid ?? m.entry_a_id,
                    entry_b_uuid: m.entry_b_uuid ?? m.entry_b_id
                }))
                const myName = userProfile.value?.full_name
                const myMatch = allMatches.find(m => m.entry_a_name === myName || m.entry_b_name === myName)
                if (myMatch) {
                    myEntryUuid.value = myMatch.entry_a_name === myName ? (myMatch.entry_a_uuid ?? myMatch.entry_a_id) : (myMatch.entry_b_uuid ?? myMatch.entry_b_id)
                    elimMatches.value = allMatches
                        .filter(m => m.entry_a_uuid === myEntryUuid.value || m.entry_b_uuid === myEntryUuid.value)
                        .sort((a, b) => a.round_no - b.round_no)
                }
            }
        }
    } catch (e) {
        console.error('Failed to update results data:', e)
    }
}

let pollInterval = null

onMounted(async () => {
    await fetchInitialData()
    pollInterval = setInterval(updateResultsData, 10000)
})

onUnmounted(() => {
    if (pollInterval) {
        clearInterval(pollInterval)
    }
})
</script>

<style scoped>
.tabular-nums {
    font-variant-numeric: tabular-nums;
}

::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}
</style>

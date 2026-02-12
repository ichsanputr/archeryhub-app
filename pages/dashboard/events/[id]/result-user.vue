<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header with Back Button -->
        <div class="flex items-center gap-4">
            <NuxtLink :to="`/dashboard/events/${eventId}/overview`"
                class="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-navy hover:shadow-sm transition-all shadow-sm">
                <Icon icon="ph:arrow-left-bold" class="text-xl" />
            </NuxtLink>
            <div>
                <h1 class="text-xl font-black text-navy leading-none">
                    {{ route.query.participant_uuid ? 'Detail Hasil Pertandingan' : 'Hasil Pertandingan Saya' }}
                </h1>
                <p class="text-gray-400 text-xs mt-1">{{ eventName }}</p>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-6">
            <div v-for="i in 3" :key="i" class="h-48 bg-gray-100 animate-pulse rounded-3xl"></div>
        </div>

        <template v-else>
            <!-- Archer Profile Card -->
            <div
                class="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-lg p-6 sm:p-8">
                <!-- Background elements -->
                <div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
                <div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

                <div class="relative flex flex-col md:flex-row items-center gap-6 md:gap-8">
                    <div
                        class="h-24 w-24 sm:h-32 sm:w-32 rounded-3xl bg-white/10 backdrop-blur-sm border-2 border-white/20 overflow-hidden shadow-xl shrink-0">
                        <img :src="useImageOrDefault(userProfile?.avatar_url, userProfile?.full_name)"
                            class="w-full h-full object-cover" />
                    </div>

                    <div class="flex-1 text-center md:text-left min-w-0">
                        <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                            <h2 class="text-2xl sm:text-4xl font-black truncate">{{ userProfile?.full_name ||
                                'Loading...' }}</h2>
                            <span v-if="categoryName"
                                class="inline-flex items-center px-3 py-1 rounded-full bg-primary text-navy font-black text-[10px] uppercase tracking-widest whitespace-nowrap self-center md:self-auto">
                                {{ categoryName }}
                            </span>
                        </div>

                        <div class="flex flex-wrap justify-center md:justify-start gap-4">
                            <div class="flex items-center gap-2 text-slate-300">
                                <Icon icon="ph:buildings" class="text-primary text-lg" />
                                <span class="text-sm font-bold">{{ userProfile?.club_name || '-' }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-slate-300 border-l border-white/10 pl-4">
                                <Icon icon="ph:map-pin" class="text-primary text-lg" />
                                <span class="text-sm font-bold">{{ userProfile?.city || '-' }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-slate-300 border-l border-white/10 pl-4">
                                <Icon icon="ph:crosshair" class="text-primary text-lg" />
                                <span class="text-sm font-bold">{{ userProfile?.bow_type || '-' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Performance Dashboard Grid -->
            <div class="flex flex-col gap-8">
                <!-- Qualification Round Card -->
                <div class="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                    <div class="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div
                                class="size-10 bg-navy rounded-xl flex items-center justify-center text-primary shadow-sm font-black">
                                Q
                            </div>
                            <h3 class="font-black text-navy text-lg">Babak Kualifikasi</h3>
                        </div>
                        <div v-if="qualResult" class="flex flex-col items-end">
                            <span class="text-2xl font-black text-navy leading-none">{{ qualResult.total_score }}</span>
                            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total
                                Skor</span>
                        </div>
                    </div>

                    <div v-if="!qualResult" class="p-12 text-center text-gray-400">
                        <Icon icon="ph:target" class="text-4xl mx-auto mb-3 opacity-20" />
                        <p class="text-sm font-bold">Skor kualifikasi belum tersedia</p>
                    </div>

                    <template v-else>
                        <!-- Stats -->
                        <div class="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-50">
                            <NuxtLink :to="`/dashboard/events/${eventId}/results?category_id=${categoryId}`"
                                class="p-4 text-center hover:bg-gray-50 transition-colors group">
                                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">
                                    Rank</p>
                                <p class="text-xl font-black text-navy group-hover:text-primary transition-colors">
                                    {{ qualResult.rank }}</p>
                            </NuxtLink>
                            <div class="p-4 text-center">
                                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">10s</p>
                                <p class="text-xl font-black text-navy">{{ qualResult.total_10x }}</p>
                            </div>
                            <div class="p-4 text-center">
                                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Xs</p>
                                <p class="text-xl font-black text-navy">{{ qualResult.total_x }}</p>
                            </div>
                        </div>

                        <!-- End Details -->
                        <div class="p-8">
                            <div class="flex items-center gap-2 mb-6">
                                <Icon icon="ph:list-numbers-bold" class="text-primary text-xl" />
                                <h4 class="text-sm font-black text-navy uppercase tracking-widest">Rincian Skor Per End
                                </h4>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                <div v-for="(end, index) in qualResult.end_scores" :key="index"
                                    class="flex flex-col border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/50 transition-all bg-white group">
                                    <div
                                        class="bg-navy/5 px-5 py-3 border-b border-gray-100 flex justify-between items-center group-hover:bg-primary/10 transition-colors">
                                        <div class="flex flex-col">
                                            <span
                                                class="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Rambahan</span>
                                            <span class="text-base font-black text-navy mt-0.5">{{ end.end_number ||
                                                index + 1 }}</span>
                                        </div>
                                        <div class="flex flex-col items-end">
                                            <span
                                                class="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Total</span>
                                            <span
                                                class="text-xl font-black text-navy group-hover:text-primary transition-colors mt-0.5">
                                                {{ end.total_score_end }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="p-5 flex flex-wrap justify-center gap-2">
                                        <div v-for="(arrow, aIdx) in end.arrows" :key="aIdx"
                                            class="size-10 rounded-2xl flex items-center justify-center text-sm font-black shadow-sm border transition-all hover:scale-110"
                                            :class="getScoreColorClass(arrow.score, arrow.is_x)">
                                            {{ arrow.is_x ? 'X' : (arrow.score === 0 ? 'M' : arrow.score) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- Elimination Bracket Card -->
                <div class="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                    <div class="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div
                                class="size-10 bg-primary rounded-xl flex items-center justify-center text-navy shadow-sm font-black">
                                E
                            </div>
                            <h3 class="font-black text-navy text-lg">Babak Eliminasi</h3>
                        </div>
                    </div>

                    <div v-if="elimMatches.length === 0" class="p-12 text-center text-gray-400">
                        <Icon icon="mdi:bracket" class="text-4xl mx-auto mb-3 opacity-20" />
                        <p class="text-sm font-bold">Skor eliminasi belum tersedia</p>
                    </div>

                    <div v-else class="flex-1 p-6 space-y-4 overflow-y-auto max-h-[500px]">
                        <div v-for="match in elimMatches" :key="match.uuid"
                            class="border-2 rounded-2xl overflow-hidden transition-all" :class="[
                                match.winner_entry_uuid === myEntryUuid ? 'border-primary/20 bg-primary/5 shadow-sm' : 'border-gray-100 bg-white'
                            ]">
                            <!-- Match Header -->
                            <div class="px-4 py-2 border-b bg-black/5 flex justify-between items-center" :class="[
                                match.winner_entry_uuid === myEntryUuid ? 'border-primary/10' : 'border-gray-50'
                            ]">
                                <span class="text-[9px] font-black text-navy/40 uppercase tracking-widest">Babak {{
                                    match.round_no }} •
                                    Match {{ match.match_no }}</span>
                                <span v-if="match.status === 'completed'"
                                    class="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter" :class="[
                                        match.winner_entry_uuid === myEntryUuid ? 'bg-primary text-navy' : 'bg-gray-100 text-gray-400'
                                    ]">
                                    {{ match.winner_entry_uuid === myEntryUuid ? 'Menang' : 'Kalah' }}
                                </span>
                                <span v-else
                                    class="px-2 py-0.5 rounded bg-blue-100 text-blue-600 text-[8px] font-black uppercase">
                                    Upcoming
                                </span>
                            </div>

                            <!-- Content -->
                            <div class="p-4 flex items-center justify-between gap-4">
                                <div class="flex-1 flex flex-col items-center">
                                    <div
                                        class="text-[10px] font-bold text-navy leading-tight truncate text-center max-w-full">
                                        Saya
                                    </div>
                                    <div class="text-2xl font-black text-navy mt-1"
                                        :class="{ 'opacity-30': match.status !== 'completed' }">
                                        {{ match.entry_a_uuid === myEntryUuid ? (match.total_score_a || 0) :
                                            (match.total_score_b || 0)
                                        }}
                                    </div>
                                </div>

                                <div class="text-xs font-black text-gray-300 italic">VS</div>

                                <div class="flex-1 flex flex-col items-center">
                                    <div
                                        class="text-[10px] font-bold text-gray-500 leading-tight truncate text-center max-w-full">
                                        {{ match.entry_a_uuid === myEntryUuid ? (match.entry_b_name || 'TBD') :
                                            (match.entry_a_name ||
                                                'TBD') }}
                                    </div>
                                    <div class="text-2xl font-black text-gray-400 mt-1"
                                        :class="{ 'opacity-30': match.status !== 'completed' }">
                                        {{ match.entry_a_uuid === myEntryUuid ? (match.total_score_b || 0) :
                                            (match.total_score_a || 0)
                                            ||
                                            0 }}
                                    </div>
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
const eventId = route.params.id

definePageMeta({
    layout: 'dashboard'
})

// State
const isLoading = ref(true)
const eventName = ref('Loading...')
const userProfile = ref(null)
const myEntryUuid = ref(null)
const categoryId = ref(null)
const categoryName = ref('')
const qualResult = ref(null)
const elimMatches = ref([])

const fetchInitialData = async () => {
    isLoading.value = true
    try {
        // 1. Fetch Event Details
        const eventRes = await get(`/events/${eventId}`)
        eventName.value = eventRes?.event?.name || eventRes?.name || 'Event'

        const participantUuid = route.query.participant_uuid
        let searchEmail = ''

        if (participantUuid) {
            // 2. Fetch Specific Participant Profile
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

            // Fetch deep scores if assignment exists
            if (pRes?.qualification_assignment_uuid) {
                const qScores = await get(`/qualification/assignments/${pRes.qualification_assignment_uuid}/scores`)
                if (qScores?.scores) {
                    qualResult.value = {
                        total_score: qScores.scores.reduce((sum, s) => sum + (s.total_score_end || 0), 0),
                        total_10x: qScores.scores.reduce((sum, s) => sum + (s.ten_count_end || 0), 0),
                        total_x: qScores.scores.reduce((sum, s) => sum + (s.x_count_end || 0), 0),
                        end_scores: qScores.scores,
                        rank: '-'
                    }
                }
            }
        } else {
            // 2. Fetch My Profile
            const profileRes = await get('/archer/me')
            userProfile.value = profileRes?.data
            searchEmail = userProfile.value?.email

            // 3. Find me in participants for this event to get category_id
            const participantsRes = await get(`/events/${eventId}/participants`, {
                params: {
                    limit: 1000,
                    group_by: 'archer',
                    search: searchEmail
                }
            })

            const me = participantsRes?.participants?.find(p => p.email === searchEmail)
            if (me && me.categories?.length > 0) {
                // Assuming show first active category for now
                const cat = me.categories[0]
                categoryId.value = cat.category_id
                categoryName.value = `${cat.division_name} - ${cat.category_name}`
            }
        }

        // 4. Fetch Qualification Results (for ranking)
        if (categoryId.value) {
            const gRes = await get(`/events/${eventId}/results/qualification`, {
                params: { category_id: categoryId.value }
            })

            const myQual = gRes?.results?.find(r =>
                (participantUuid && r.participant_id === participantUuid) ||
                (r.archer_uuid === userProfile.value?.uuid)
            )

            if (myQual) {
                // If we already have deep scores, just update the rank
                if (qualResult.value) {
                    qualResult.value.rank = myQual.rank
                } else {
                    qualResult.value = myQual
                }
            }
        }

        // 5. Fetch Elimination Bracket and Matches
        if (categoryId.value) {
            const elimRes = await get(`/events/${eventId}/results/elimination`, {
                params: { category_id: categoryId.value }
            })

            if (elimRes?.bracket?.matches) {
                const allMatches = Object.values(elimRes.bracket.matches).flat()
                const myName = userProfile.value?.full_name
                const myMatch = allMatches.find(m => m.entry_a_name === myName || m.entry_b_name === myName)

                if (myMatch) {
                    myEntryUuid.value = myMatch.entry_a_name === myName ? myMatch.entry_a_uuid : myMatch.entry_b_uuid
                    elimMatches.value = allMatches.filter(m =>
                        m.entry_a_uuid === myEntryUuid.value || m.entry_b_uuid === myEntryUuid.value
                    ).sort((a, b) => a.round_no - b.round_no)
                }
            }
        }
    } catch (error) {
        console.error('Failed to fetch result-user data:', error)
    } finally {
        isLoading.value = false
    }
}

const getScoreColorClass = (score, isX) => {
    if (isX || score === 10 || score === 9) {
        return 'bg-yellow-400 border-yellow-500 text-white'
    } else if (score === 8 || score === 7) {
        return 'bg-red-500 border-red-600 text-white'
    } else if (score === 6 || score === 5) {
        return 'bg-blue-500 border-blue-600 text-white'
    } else if (score === 4 || score === 3) {
        return 'bg-black border-gray-800 text-white'
    } else {
        return 'bg-white border-gray-200 text-navy'
    }
}

onMounted(() => {
    fetchInitialData()
})
</script>

<style scoped>
.font-display {
    font-family: 'Manrope', sans-serif;
}
</style>

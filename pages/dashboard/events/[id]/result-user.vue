<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <div class="flex items-center gap-4 mb-8">
            <NuxtLink :to="backUrl"
                class="flex items-center justify-center w-11 h-11 rounded-2xl bg-white border border-gray-200 text-gray-500 hover:text-navy hover:border-primary/30 hover:bg-primary/5 transition-all">
                <Icon icon="ph:arrow-left-bold" class="text-lg" />
            </NuxtLink>
            <div class="min-w-0 flex-1">
                <h1 class="text-xl sm:text-2xl font-bold text-navy truncate">
                    {{ route.query.participant_uuid ? 'Detail Hasil Pertandingan' : 'Hasil Pertandingan Saya' }}
                </h1>
                <p class="text-sm text-gray-500 mt-0.5 truncate">{{ eventName }}</p>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="space-y-6">
            <div class="h-40 bg-gray-100 rounded-2xl animate-pulse" />
            <div class="h-64 bg-gray-100 rounded-2xl animate-pulse" />
            <div class="h-48 bg-gray-100 rounded-2xl animate-pulse" />
        </div>

        <template v-else>
            <!-- Profile -->
            <section class="mb-8">
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div class="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
                        <div class="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-100 overflow-hidden ring-2 ring-gray-100">
                            <img :src="useImageOrDefault(userProfile?.avatar_url, userProfile?.full_name)"
                                class="w-full h-full object-cover" alt="" />
                        </div>
                        <div class="flex-1 text-center sm:text-left min-w-0">
                            <h2 class="text-lg sm:text-xl font-bold text-navy truncate">
                                {{ userProfile?.full_name || '—' }}
                            </h2>
                            <p v-if="categoryName"
                                class="inline-block mt-2 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide">
                                {{ categoryName }}
                            </p>
                            <div class="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 mt-4 text-sm text-gray-500">
                                <span v-if="userProfile?.club_name" class="flex items-center gap-1.5">
                                    <Icon icon="ph:buildings" class="text-gray-400" />
                                    {{ userProfile.club_name }}
                                </span>
                                <span v-if="userProfile?.city" class="flex items-center gap-1.5">
                                    <Icon icon="ph:map-pin" class="text-gray-400" />
                                    {{ userProfile.city }}
                                </span>
                                <span v-if="userProfile?.bow_type" class="flex items-center gap-1.5">
                                    <Icon icon="ph:crosshair" class="text-gray-400" />
                                    {{ userProfile.bow_type }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Qualification -->
            <section class="mb-8">
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-primary font-bold text-sm">
                                Q
                            </div>
                            <h3 class="text-base font-bold text-navy">Babak Kualifikasi</h3>
                        </div>
                        <div v-if="qualResult" class="flex items-baseline gap-2">
                            <span class="text-2xl font-bold text-navy">{{ qualResult.total_score }}</span>
                            <span class="text-xs text-gray-400 font-medium uppercase tracking-wider">Total</span>
                        </div>
                    </div>

                    <div v-if="!qualResult" class="p-12 text-center text-gray-400">
                        <Icon icon="ph:target" class="text-4xl mx-auto mb-3 opacity-30" />
                        <p class="text-sm font-medium">Skor kualifikasi belum tersedia</p>
                    </div>

                    <template v-else>
                        <div class="p-6 border-t border-gray-50">
                            <h4 class="text-sm font-semibold text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Icon icon="ph:list-numbers-bold" class="text-primary" />
                                Rincian per end
                            </h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                <div v-for="(end, index) in qualResult.end_scores" :key="index"
                                    class="rounded-xl border border-gray-100 bg-gray-50/50 overflow-hidden">
                                    <div class="px-4 py-3 flex justify-between items-center border-b border-gray-100">
                                        <span class="text-xs font-semibold text-gray-500">End {{ end.end_number ?? index + 1 }}</span>
                                        <span class="text-lg font-bold text-navy">{{ end.total_score_end }}</span>
                                    </div>
                                    <div class="p-4 flex flex-wrap justify-center gap-2">
                                        <span v-for="(arrow, aIdx) in end.arrows" :key="aIdx"
                                            class="inline-flex items-center justify-center min-w-[2.25rem] h-9 rounded-lg text-sm font-bold"
                                            :class="getScoreColorClass(arrow.score, arrow.is_x)">
                                            {{ arrow.is_x ? 'X' : (arrow.score === 0 ? 'M' : arrow.score) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </section>

            <!-- Elimination -->
            <section>
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-navy font-bold text-sm">
                            E
                        </div>
                        <h3 class="text-base font-bold text-navy">Babak Eliminasi</h3>
                    </div>

                    <div v-if="elimMatches.length === 0" class="p-12 text-center text-gray-400">
                        <Icon icon="mdi:bracket" class="text-4xl mx-auto mb-3 opacity-30" />
                        <p class="text-sm font-medium">Skor eliminasi belum tersedia</p>
                    </div>

                    <div v-else class="divide-y divide-gray-50">
                        <div v-for="match in elimMatches" :key="match.uuid"
                            class="p-5 sm:p-6 transition-colors"
                            :class="match.winner_entry_uuid === myEntryUuid ? 'bg-primary/5' : 'bg-white'">
                            <div class="flex items-center justify-between gap-4 mb-4">
                                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Babak {{ match.round_no }} · Match {{ match.match_no }}
                                </span>
                                <span v-if="match.status === 'completed'"
                                    class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase shrink-0"
                                    :class="match.winner_entry_uuid === myEntryUuid
                                        ? 'bg-primary text-navy'
                                        : 'bg-gray-100 text-gray-500'">
                                    {{ match.winner_entry_uuid === myEntryUuid ? 'Menang' : 'Kalah' }}
                                </span>
                                <span v-else
                                    class="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-600 text-[10px] font-bold uppercase shrink-0">
                                    Mendatang
                                </span>
                            </div>
                            <div class="flex items-center justify-between gap-6">
                                <div class="flex-1 min-w-0 text-center">
                                    <p class="text-xs font-medium text-navy truncate">Saya</p>
                                    <p class="text-2xl font-bold text-navy mt-1"
                                        :class="{ 'opacity-50': match.status !== 'completed' }">
                                        {{ match.entry_a_uuid === myEntryUuid ? (match.total_score_a ?? 0) : (match.total_score_b ?? 0) }}
                                    </p>
                                </div>
                                <span class="text-sm font-bold text-gray-300 shrink-0">VS</span>
                                <div class="flex-1 min-w-0 text-center">
                                    <p class="text-xs font-medium text-gray-500 truncate">
                                        {{ match.entry_a_uuid === myEntryUuid ? (match.entry_b_name || 'TBD') : (match.entry_a_name || 'TBD') }}
                                    </p>
                                    <p class="text-2xl font-bold text-gray-400 mt-1"
                                        :class="{ 'opacity-50': match.status !== 'completed' }">
                                        {{ match.entry_a_uuid === myEntryUuid ? (match.total_score_b ?? 0) : (match.total_score_a ?? 0) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </template>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
const { get } = useApi()
const route = useRoute()
const eventId = route.params.id

const backUrl = computed(() => `/dashboard/events/${eventId}/overview`)

definePageMeta({
    layout: 'dashboard'
})

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

        if (categoryId.value) {
            const gRes = await get(`/events/${eventId}/results/qualification`, {
                params: { category_id: categoryId.value }
            })
            const myQual = gRes?.results?.find(r =>
                (participantUuid && r.participant_id === participantUuid) ||
                (r.archer_uuid === userProfile.value?.uuid)
            )
            if (myQual) {
                if (qualResult.value) qualResult.value.rank = myQual.rank
                else qualResult.value = myQual
            }
        }

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
                    elimMatches.value = allMatches
                        .filter(m => m.entry_a_uuid === myEntryUuid.value || m.entry_b_uuid === myEntryUuid.value)
                        .sort((a, b) => a.round_no - b.round_no)
                }
            }
        }
    } catch (e) {
        console.error('Failed to fetch result-user data:', e)
    } finally {
        isLoading.value = false
    }
}

const getScoreColorClass = (score, isX) => {
    if (isX || score === 10 || score === 9) return 'bg-primary text-navy border-primary'
    if (score === 8 || score === 7) return 'bg-red-500 text-white border-red-600'
    if (score === 6 || score === 5) return 'bg-blue-500 text-white border-blue-600'
    if (score === 4 || score === 3) return 'bg-gray-800 text-white border-gray-900'
    return 'bg-white text-navy border-gray-200'
}

onMounted(() => fetchInitialData())
</script>

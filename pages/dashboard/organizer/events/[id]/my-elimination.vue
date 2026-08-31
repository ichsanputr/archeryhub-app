<template>
    <div class="flex flex-col gap-8 pb-16">
        <!-- Breadcrumbs & Header Actions -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <nav class="flex text-xs font-bold text-slate-400 tracking-widest mb-2 items-center gap-2">
                    <NuxtLink :to="`/dashboard/events/${eventId}`" class="hover:text-primary transition-colors">Event
                    </NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[10px]" />
                    <span class="text-slate-600 dark:text-slate-300">Hasil Eliminasi</span>
                </nav>
                <div class="flex items-center gap-4">
                    <button @click="handleBack"
                        class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-primary/50 transition-all text-navy dark:text-white">
                        <Icon icon="ph:arrow-left-bold" />
                    </button>
                    <h2 class="text-3xl font-black text-navy dark:text-white tracking-tight">Hasil Eliminasi</h2>
                </div>
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
                        </div>
                    </div>

                    <!-- Final Standing Badge -->
                    <div class="flex flex-col items-center md:items-end justify-center">
                        <div class="text-[10px] font-black text-slate-400 tracking-widest mb-1">Status Eliminasi
                        </div>
                        <div class="flex items-center gap-2">
                            <Icon v-if="elimStatusLabel === 'Juara'" icon="ph:crown-fill"
                                class="text-primary text-2xl" />
                            <span class="text-xl font-black"
                                :class="elimStatusLabel === 'Juara' ? 'text-primary' : 'text-navy dark:text-white'">
                                {{ elimStatusLabel }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Elimination Path Track -->
            <div
                class="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm p-10 overflow-hidden">
                <h4 class="font-black text-2xl text-navy dark:text-white flex items-center gap-4 mb-12">
                    <div
                        class="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-lg shadow-indigo-500/10">
                        <Icon icon="ph:git-merge-bold" class="text-xl" />
                    </div>
                    Alur Eliminasi
                </h4>

                <div v-if="elimMatches.length === 0"
                    class="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px]">
                    <Icon icon="ph:sword-light" class="text-7xl mx-auto mb-6 opacity-10" />
                    <div class="text-sm font-black tracking-widest text-slate-300">Belum mencapai eliminasi</div>
                </div>

                <div v-else class="relative overflow-x-auto pb-8 scrollbar-hide">
                    <div class="flex min-w-[1000px] items-center px-4 gap-4">
                        <template v-for="(match, mIdx) in elimMatches" :key="match.uuid">
                            <!-- Match Box -->
                            <div class="w-[280px] shrink-0">
                                <div class="text-[10px] font-black text-slate-400 tracking-[0.2em] text-center mb-6">
                                    Babak {{ match.round_no }}</div>
                                <div class="relative p-6 rounded-[32px] overflow-hidden transition-all group border"
                                    :class="match.winner_entry_uuid === myEntryUuid ? 'bg-navy text-white shadow-xl shadow-primary/20 border-primary' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700'">

                                    <div class="flex flex-col gap-4">
                                        <div class="flex items-center justify-between gap-3">
                                            <div class="flex items-center gap-3 min-w-0">
                                                <img :src="useImageOrDefault(null, match.entry_a_name)"
                                                    class="size-10 rounded-xl object-cover shrink-0 ring-2 ring-white/10" />
                                                <span class="text-xs font-black truncate"
                                                    :class="match.winner_entry_uuid === match.entry_a_uuid ? 'text-primary' : 'text-slate-500'">{{
                                                        match.entry_a_name || 'TBD' }}</span>
                                            </div>
                                            <span class="text-sm font-black tabular-nums">{{ match.total_score_a ?? 0
                                                }}</span>
                                        </div>

                                        <div class="h-px bg-slate-200 dark:bg-slate-800 opacity-20" />

                                        <div class="flex items-center justify-between gap-3">
                                            <div class="flex items-center gap-3 min-w-0">
                                                <img :src="useImageOrDefault(null, match.entry_b_name)"
                                                    class="size-10 rounded-xl object-cover shrink-0 ring-2 ring-white/10" />
                                                <span class="text-xs font-black truncate"
                                                    :class="match.winner_entry_uuid === match.entry_b_uuid ? 'text-primary' : 'text-slate-500'">{{
                                                        match.entry_b_name || 'TBD' }}</span>
                                            </div>
                                            <span class="text-sm font-black tabular-nums">{{ match.total_score_b ?? 0
                                                }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="mIdx < elimMatches.length - 1"
                                class="w-16 flex items-center justify-center mt-6">
                                <Icon icon="ph:arrow-right-bold" class="text-slate-300" />
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
const { t } = useI18n()
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
const { get } = useApi()
const route = useRoute()
const router = useRouter()
const eventId = route.params.id

definePageMeta({
    layout: 'dashboard'
})

useHead({ title: computed(() => t('elimination.my_bracket', 'My Elimination Bracket') + ' - ArcheryHub Dashboard') })


const isLoading = ref(true)
const userProfile = ref(null)
const myEntryUuid = ref(null)
const categoryId = ref(null)
const categoryName = ref('')
const archerUuid = ref(null)
const elimMatches = ref([])

const elimStatusLabel = computed(() => {
    if (!elimMatches.value.length) return 'Siap'
    const lastMatch = [...elimMatches.value].reverse()[0]
    if (lastMatch.status !== 'completed') return 'Aktif'
    if (lastMatch.winner_entry_uuid === myEntryUuid.value) return 'Juara'
    return 'Selesai'
})

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
        const elimRes = await get(`/events/${eventId}/results/elimination`, {
            params: { category_id: categoryId.value }
        })
        if (elimRes?.bracket?.matches) {
            const allMatches = Object.values(elimRes.bracket.matches).flat()
            const myName = userProfile.value?.full_name
            const myMatch = allMatches.find(m => m.entry_a_name === myName || m.entry_b_name === myName)
            if (myMatch) {
                myEntryUuid.value = myMatch.entry_a_name === myName ? (myMatch.entry_a_uuid ?? myMatch.entry_a_id) : (myMatch.entry_b_uuid ?? myMatch.entry_b_id)
                elimMatches.value = allMatches
                    .filter(m => m.entry_a_uuid === myEntryUuid.value || m.entry_b_uuid === myEntryUuid.value)
                    .sort((a, b) => a.round_no - b.round_no)
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

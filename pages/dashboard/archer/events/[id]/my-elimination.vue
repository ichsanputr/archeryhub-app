<template>
    <div class="flex flex-col gap-6 pb-16">
        <!-- Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.15);"></div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <div>
                            <nav
                                class="flex text-[10px] font-bold text-white/40 tracking-widest mb-1 items-center gap-1.5">
                                <NuxtLink :to="`/dashboard/archer/events/${eventId}`"
                                    class="hover:text-white transition-colors">{{ t('elimination.nav_event') }}</NuxtLink>
                                <Icon icon="ph:caret-right-bold" class="text-[9px]" />
                                <span class="text-white/70">{{ t('elimination.nav_title') }}</span>
                            </nav>
                            <h1 class="text-2xl font-black tracking-tight">{{ t('elimination.title') }}</h1>
                        </div>
                    </div>
                    <!-- Badge & Category -->
                    <div v-if="!isLoading" class="flex-shrink-0 flex items-center gap-3">
                        <!-- Category Selector -->
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

                        <!-- Status badge -->
                        <div class="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-black hidden sm:flex"
                            :class="elimStatusLabel === t('elimination.status_champion')
                                ? 'bg-primary text-navy border-primary/40'
                                : elimStatusLabel === t('elimination.status_active')
                                    ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                    : 'bg-white/10 text-white border-white/20'">
                            <Icon
                                :icon="elimStatusLabel === t('elimination.status_champion') ? 'ph:crown-fill' : elimStatusLabel === t('elimination.status_active') ? 'ph:play-circle-fill' : 'ph:trophy-bold'"
                                class="text-base" />
                            {{ elimStatusLabel }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="space-y-6">
            <div class="h-40 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm" />
            <div class="h-64 bg-white rounded-3xl animate-pulse border border-slate-100" />
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
                            {{ userProfile?.full_name || t('elimination.archer') }}
                        </h2>
                        <div
                            class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
                            <span
                                class="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-[10px] font-black capitalize tracking-widest text-slate-500">
                                BIB #{{ userProfile?.bib_number || '-' }}
                            </span>
                            <span class="w-1 h-1 rounded-full bg-slate-300" />
                            <span>{{ currentCategoryName || categoryName || '-' }}</span>
                        </div>
                    </div>
                    <!-- Match count -->
                    <div class="flex flex-col items-center sm:items-end">
                        <span class="text-[10px] font-black text-slate-400 tracking-widest mb-1">{{ t('elimination.matches') }}</span>
                        <div class="flex items-baseline gap-1">
                            <span class="text-5xl font-black text-navy dark:text-white tracking-tighter tabular-nums">{{
                                elimMatches.length }}</span>
                            <span class="text-sm font-bold text-slate-400">{{ t('elimination.match') }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Elimination Path Section -->
            <div
                class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div
                    class="px-6 sm:px-8 py-5 border-b border-slate-50 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/10 flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                        <Icon icon="ph:git-merge-bold" class="text-lg" />
                    </div>
                    <h4 class="font-black text-xl text-navy dark:text-white">{{ t('elimination.path_title') }}</h4>
                </div>

                <!-- No matches -->
                <div v-if="elimMatches.length === 0"
                    class="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 m-6 rounded-3xl">
                    <Icon icon="ph:sword-light" class="text-7xl mx-auto mb-6 opacity-10" />
                    <span class="text-sm font-black tracking-widest text-slate-300 block">{{ t('elimination.not_reached') }}</span>
                </div>

                <!-- Match cards — vertical timeline layout -->
                <div v-else class="p-6 sm:p-8">
                    <div class="relative">
                        <!-- Connecting line -->
                        <div v-if="elimMatches.length > 1"
                            class="absolute left-5 sm:left-6 top-12 bottom-12 w-0.5 bg-slate-100 dark:bg-slate-700 z-0 hidden sm:block" />

                        <div class="space-y-6 relative z-10">
                            <div v-for="(match, mIdx) in elimMatches" :key="match.uuid"
                                class="flex flex-col sm:flex-row items-start gap-3 sm:gap-5">
                                <!-- Round node -->
                                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 font-black text-[9px] sm:text-[10px] tracking-widest shadow-sm"
                                    :class="match.winner_entry_uuid === myEntryUuid
                                        ? 'bg-primary text-navy'
                                        : (match.status === 'finished' ? 'bg-navy text-white' : 'bg-white border border-slate-200 text-slate-500')">
                                    R{{ match.round_no }}
                                </div>

                                <!-- Match card -->
                                <div class="flex-1 rounded-2xl border overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md"
                                    :class="match.winner_entry_uuid === myEntryUuid
                                        ? 'border-primary/40 bg-navy/5 dark:bg-navy/20'
                                        : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800'">
                                    <!-- Match header -->
                                    <div
                                        class="px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                                        <div
                                            class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                                            <span class="text-[10px] font-black tracking-widest"
                                                :class="match.winner_entry_uuid === myEntryUuid ? 'text-navy dark:text-primary' : 'text-slate-400'">
                                                {{ t('elimination.round_match', { round: match.round_no, match: match.match_no || '-' }) }}
                                            </span>
                                            <span class="flex items-center gap-1 text-[10px] font-black"
                                                :class="match.winner_entry_uuid === myEntryUuid ? '' : 'text-slate-300'">
                                                <Icon
                                                    :icon="match.winner_entry_uuid === myEntryUuid ? 'ph:crown-fill' : (match.status === 'finished' ? 'ph:check-circle-bold' : 'ph:clock-bold')" />
                                                {{ match.winner_entry_uuid === myEntryUuid ? t('elimination.win') : (match.status === 'finished' ? t('elimination.lose') : t('elimination.active')) }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Archer A -->
                                    <div class="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 bg-white gap-3 sm:gap-0"
                                        :class="match.winner_entry_uuid === myEntryUuid ? '' : ''">
                                        <div class="flex items-center gap-3 min-w-0">
                                            <img :src="useImageOrDefault(null, match.entry_a_name)"
                                                class="size-10 rounded-xl object-cover shrink-0 ring-1 ring-slate-100 dark:ring-slate-700" />
                                            <div class="min-w-0">
                                                <span
                                                    class="text-xs font-black text-navy dark:text-white truncate block">
                                                    {{ match.entry_a_name || 'tbd' }}
                                                </span>
                                                <span v-if="match.entry_a_seed"
                                                    class="text-[10px] text-slate-400 font-bold">
                                                    {{ t('elimination.seed', { seed: match.entry_a_seed }) }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-2 shrink-0">
                                            <Icon v-if="match.winner_entry_uuid === match.entry_a_uuid"
                                                icon="ph:crown-fill" class="text-sm" />
                                            <span class="text-xl font-black tabular-nums text-navy dark:text-white">{{
                                                match.total_score_a ?? 0 }}</span>
                                        </div>
                                    </div>

                                    <!-- Archer B -->
                                    <div class="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-slate-800 gap-3 sm:gap-0"
                                        :class="match.winner_entry_uuid === myEntryUuid ? '' : ''">
                                        <div class="flex items-center gap-3 min-w-0">
                                            <img :src="useImageOrDefault(null, match.entry_b_name)"
                                                class="size-10 rounded-xl object-cover shrink-0 ring-1 ring-slate-100 dark:ring-slate-700" />
                                            <div class="min-w-0">
                                                <span
                                                    class="text-xs font-bold text-slate-500 dark:text-slate-400 truncate block">
                                                    {{ match.entry_b_name || 'tbd' }}
                                                </span>
                                                <span v-if="match.entry_b_seed"
                                                    class="text-[10px] text-slate-400 font-bold">
                                                    {{ t('elimination.seed', { seed: match.entry_b_seed }) }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-2 shrink-0">
                                            <Icon v-if="match.winner_entry_uuid === match.entry_b_uuid"
                                                icon="ph:crown-fill" class="text-primary text-sm" />
                                            <span class="text-xl font-black tabular-nums text-navy dark:text-white">{{
                                                match.total_score_b ?? 0 }}</span>
                                        </div>
                                    </div>

                                    <!-- Inline ends / per-end score -->
                                    <div v-if="match.ends && match.ends.length"
                                        class="px-5 py-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                                        <div class="flex gap-2 mb-2">
                                            <span class="text-[10px] font-black tracking-widest text-slate-400">{{ t('elimination.score_per_end') }}</span>
                                        </div>
                                        <div class="flex flex-col gap-2 text-xs">
                                            <div class="flex items-center min-w-0 gap-3">
                                                <div class="w-16 font-bold shrink-0 truncate"
                                                    :class="match.entry_a_uuid === myEntryUuid ? '' : 'text-slate-500 dark:text-slate-400'">
                                                    {{ match.entry_a_name?.split(' ')[0] || 'A' }}
                                                </div>
                                                <div
                                                    class="flex gap-1 overflow-x-auto pb-1 -mb-1 hide-scrollbar flex-1">
                                                    <div v-for="end in match.ends" :key="'A-' + end.end_no"
                                                        class="w-7 h-7 rounded shrink-0 flex items-center justify-center font-bold"
                                                        :class="end.score_a > end.score_b ? 'bg-primary/20 text-navy dark:text-white border border-primary/30' : (end.score_a === end.score_b ? 'bg-white border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-500' : 'bg-white border border-slate-100 dark:border-slate-700 dark:bg-slate-900 text-slate-300')">
                                                        {{ end.score_a }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center min-w-0 gap-3">
                                                <div class="w-16 font-bold shrink-0 truncate"
                                                    :class="match.entry_b_uuid === myEntryUuid ? 'text-primary' : 'text-slate-500 dark:text-slate-400'">
                                                    {{ match.entry_b_name?.split(' ')[0] || 'B' }}
                                                </div>
                                                <div
                                                    class="flex gap-1 overflow-x-auto pb-1 -mb-1 hide-scrollbar flex-1">
                                                    <div v-for="end in match.ends" :key="'B-' + end.end_no"
                                                        class="w-7 h-7 rounded shrink-0 flex items-center justify-center font-bold"
                                                        :class="end.score_b > end.score_a ? 'bg-primary/20 text-navy dark:text-white border border-primary/30' : (end.score_b === end.score_a ? 'bg-white border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-500' : 'bg-white border border-slate-100 dark:border-slate-700 dark:bg-slate-900 text-slate-300')">
                                                        {{ end.score_b }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Match detail link -->
                                    <div
                                        class="px-5 py-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                                        <NuxtLink :to="`/match/${match.id || match.match_id}`"
                                            class="text-[10px] font-black text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                                            <Icon icon="ph:arrow-square-out-bold" />
                                            {{ t('elimination.open_match_page') }}
                                        </NuxtLink>
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
import { useImageOrDefault } from '~/composables/useImageHelper'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { get } = useApi()
const route = useRoute()
const router = useRouter()
const eventId = route.params.id

definePageMeta({ layout: 'dashboard' })

useHead({ title: 'Hasil Eliminasi Saya - ArcheryHub Dashboard' })

const isLoading = ref(true)
const userProfile = ref(null)
const myEntryUuid = ref(null)
const categoryId = ref(null)
const categoryName = ref('')
const archerUuid = ref(null)
const elimMatches = ref([])
const myCategories = ref([])

const currentCategoryName = computed(() => {
    const cat = myCategories.value.find(c => c.category_id === categoryId.value)
    return cat ? `${cat.division_name} - ${cat.category_name}` : ''
})

const elimStatusLabel = computed(() => {
    if (!elimMatches.value.length) return t('elimination.status_ready')
    const lastMatch = [...elimMatches.value].reverse()[0]
    if (lastMatch.status !== 'finished' && lastMatch.status !== 'completed') return t('elimination.status_active')
    if (lastMatch.winner_entry_uuid === myEntryUuid.value) return t('elimination.status_champion')
    return t('elimination.status_ended')
})

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
        const elimRes = await get(`/events/${eventId}/results/elimination`, {
            params: { category_id: categoryId.value }
        })
        if (elimRes?.bracket?.matches) {
            const allMatches = Object.values(elimRes.bracket.matches).flat().map(m => ({
                ...m,
                entry_a_uuid: m.entry_a_uuid ?? m.entry_a_id,
                entry_b_uuid: m.entry_b_uuid ?? m.entry_b_id,
                winner_entry_uuid: m.winner_entry_uuid ?? m.winner_entry_id
            }))
            const myName = userProfile.value?.full_name
            const myMatch = allMatches.find(m => m.entry_a_name === myName || m.entry_b_name === myName)
            if (myMatch) {
                myEntryUuid.value = myMatch.entry_a_name === myName
                    ? (myMatch.entry_a_uuid ?? myMatch.entry_a_id)
                    : (myMatch.entry_b_uuid ?? myMatch.entry_b_id)
                elimMatches.value = allMatches
                    .filter(m => {
                        const searchUuid = myEntryUuid.value || archerUuid.value || userProfile.value?.uuid;
                        return (m.entry_a_uuid === searchUuid || m.entry_a_id === searchUuid) ||
                            (m.entry_b_uuid === searchUuid || m.entry_b_id === searchUuid)
                    })
                    .sort((a, b) => a.round_no - b.round_no)
            } else {
                elimMatches.value = []
            }
        } else {
            elimMatches.value = []
        }
    } catch (e) {
        console.error('Failed to update results:', e)
        elimMatches.value = []
    }
}

onMounted(fetchInitialData)
</script>

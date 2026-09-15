<template>
  <div class="flex flex-col gap-6 pb-16">
    <!-- Header Banner (Standard Dashboard Style) -->
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
          <NuxtLink to="/dashboard/archer/tournaments" class="hover:text-white transition-colors">{{ t('elimination.nav_event', 'Event Saya') }}</NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-base" />
          <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/overview`" class="hover:text-white transition-colors">{{ eventName || 'Event' }}</NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-base" />
          <span class="text-primary font-medium">{{ t('elimination.nav_title', 'Bagan Eliminasi') }}</span>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-start gap-4">
            <!-- Icon Badge -->
            <div
              class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
              <Icon icon="ph:tree-structure-bold" class="text-primary text-2xl" />
            </div>
            <div class="flex-grow">
              <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight">{{ t('elimination.title', 'Bagan Eliminasi') }}</h1>
              <div class="text-slate-300 text-sm mt-1">{{ t('elimination.subtitle', 'Skema pertandingan gugur head-to-head dan live skor eliminasi.') }}</div>
            </div>
          </div>

          <!-- Category Selector -->
          <div v-if="!isLoading" class="flex-shrink-0 flex items-center gap-3">
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

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <div class="h-36 bg-white dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-700" />
      <div class="h-72 bg-white dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-700" />
    </div>

    <template v-else>
      <!-- Profile Card -->
      <div
        class="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-700 p-6 sm:p-8 relative overflow-hidden group">
        <div
          class="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none group-hover:bg-primary/10 transition-all duration-500" />
        <div class="flex flex-col sm:flex-row gap-6 items-center sm:items-start relative z-10">
          <div
            class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-primary/40 p-1 bg-white dark:bg-slate-800 shadow-md shrink-0">
            <img :src="useImageOrDefault(userProfile?.avatar_url, userProfile?.full_name)"
              class="w-full h-full rounded-xl object-cover" />
          </div>
          <div class="flex-1 text-center sm:text-left">
            <h2 class="text-2xl sm:text-3xl font-black text-navy dark:text-white tracking-tight">
              {{ userProfile?.full_name || t('elimination.archer', 'Archer') }}
            </h2>
            <div
              class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span
                class="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-[10px] font-black capitalize tracking-widest text-slate-600 dark:text-slate-300">
                BIB #{{ userProfile?.bib_number || userProfile?.id || '-' }}
              </span>
              <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span>{{ currentCategoryName || categoryName || '-' }}</span>
              <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span>{{ userProfile?.club_name || t('elimination.independent', 'Independent') }}</span>
            </div>
          </div>
          <!-- Match count -->
          <div class="flex flex-col items-center sm:items-end">
            <span class="text-[10px] font-black text-slate-400 tracking-widest mb-1">{{ t('elimination.matches', 'Pertandingan') }}</span>
            <div class="flex items-baseline gap-1">
              <span class="text-4xl sm:text-5xl font-black text-navy dark:text-white tracking-tighter tabular-nums">{{
                elimMatches.length }}</span>
              <span class="text-xs font-bold text-slate-400">{{ t('elimination.match', 'Match') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Elimination Path Section -->
      <div
        class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden w-full">
        <div
          class="px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Icon icon="ph:git-merge-bold" class="text-lg" />
            </div>
            <h4 class="font-black text-lg text-navy dark:text-white">{{ t('elimination.path_title', 'Perjalanan Eliminasi') }}</h4>
          </div>
          <span class="text-xs font-bold text-slate-400">
            {{ elimMatches.length }} {{ t('elimination.rounds_completed', 'Ronde') }}
          </span>
        </div>

        <!-- No matches -->
        <div v-if="elimMatches.length === 0"
          class="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 m-6 rounded-3xl">
          <div class="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Icon icon="ph:git-merge" class="text-3xl" />
          </div>
          <div class="text-base font-black text-navy dark:text-white mb-1">
            {{ t('elimination.not_reached', 'Belum Ada Pertandingan Eliminasi') }}
          </div>
          <div class="text-xs text-slate-400 max-w-sm mx-auto">
            {{ t('elimination.not_reached_desc', 'Bagan eliminasi untuk kategori ini belum digenerate atau pertandingan belum dijadwalkan.') }}
          </div>
        </div>

        <!-- Match cards — modern timeline layout -->
        <div v-else class="p-6 sm:p-8">
          <div class="relative">
            <!-- Connecting vertical line -->
            <div v-if="elimMatches.length > 1"
              class="absolute left-6 top-10 bottom-10 w-0.5 bg-slate-200 dark:bg-slate-700 z-0 hidden sm:block" />

            <div class="space-y-6 relative z-10">
              <div v-for="(match, mIdx) in elimMatches" :key="match.uuid || mIdx"
                class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <!-- Round node -->
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-xs tracking-wider shadow-sm"
                  :class="match.winner_entry_uuid === myEntryUuid
                    ? 'bg-primary text-navy ring-2 ring-primary/40'
                    : (match.status === 'finished' ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500')">
                  R{{ match.round_no }}
                </div>

                <!-- Match card -->
                <div class="flex-1 rounded-2xl border overflow-hidden transition-all shadow-sm hover:shadow-md"
                  :class="match.winner_entry_uuid === myEntryUuid
                    ? 'border-primary/40 bg-white dark:bg-slate-800 ring-1 ring-primary/20'
                    : 'border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800'">
                  <!-- Match header -->
                  <div
                    class="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between"
                    :class="match.winner_entry_uuid === myEntryUuid ? 'bg-primary/5 dark:bg-primary/10' : 'bg-slate-50/50 dark:bg-slate-900/30'">
                    <span class="text-xs font-black tracking-wider text-navy dark:text-white capitalize">
                      {{ getRoundLabel(match.round_no) }} • Match #{{ match.match_no || mIdx + 1 }}
                    </span>
                    <span class="flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-lg"
                      :class="match.winner_entry_uuid === myEntryUuid
                        ? 'bg-primary text-navy font-black'
                        : (match.status === 'finished' ? 'bg-slate-100 dark:bg-slate-700 text-slate-500' : 'bg-amber-100 dark:bg-amber-950 text-amber-600')">
                      <Icon
                        :icon="match.winner_entry_uuid === myEntryUuid ? 'ph:crown-fill' : (match.status === 'finished' ? 'ph:check-circle-bold' : 'ph:clock-bold')" />
                      {{ match.winner_entry_uuid === myEntryUuid ? t('elimination.win', 'WIN') : (match.status === 'finished' ? t('elimination.lose', 'LOSE') : t('elimination.active', 'ACTIVE')) }}
                    </span>
                  </div>

                  <!-- Archer A Row -->
                  <div class="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60"
                    :class="{ 'bg-primary/5 dark:bg-primary/5': match.entry_a_uuid === myEntryUuid }">
                    <div class="flex items-center gap-3 min-w-0">
                      <img :src="useImageOrDefault(null, match.entry_a_name)"
                        class="size-10 rounded-xl object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700" />
                      <div class="min-w-0">
                        <div class="text-sm font-black text-navy dark:text-white truncate flex items-center gap-1.5">
                          <span>{{ match.entry_a_name || 'TBD' }}</span>
                          <span v-if="match.entry_a_uuid === myEntryUuid" class="px-1.5 py-0.5 rounded bg-primary text-navy text-[9px] font-black">YOU</span>
                        </div>
                        <span v-if="match.entry_a_seed"
                          class="text-[10px] text-slate-400 font-bold">
                          Seed #{{ match.entry_a_seed }}
                        </span>
                      </div>
                    </div>
                    <div class="flex items-center gap-3 shrink-0">
                      <Icon v-if="match.winner_entry_uuid === match.entry_a_uuid"
                        icon="ph:crown-fill" class="text-amber-500 text-base" />
                      <div class="text-right">
                        <span class="text-2xl font-black tabular-nums text-navy dark:text-white">
                          {{ match.set_points_a ?? match.total_points_a ?? (match.total_score_a > 0 ? match.total_score_a : 0) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Archer B Row -->
                  <div class="px-5 py-4 flex items-center justify-between"
                    :class="{ 'bg-primary/5 dark:bg-primary/5': match.entry_b_uuid === myEntryUuid }">
                    <div class="flex items-center gap-3 min-w-0">
                      <img :src="useImageOrDefault(null, match.entry_b_name)"
                        class="size-10 rounded-xl object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700" />
                      <div class="min-w-0">
                        <div class="text-sm font-black text-navy dark:text-white truncate flex items-center gap-1.5">
                          <span>{{ match.entry_b_name || 'TBD' }}</span>
                          <span v-if="match.entry_b_uuid === myEntryUuid" class="px-1.5 py-0.5 rounded bg-primary text-navy text-[9px] font-black">YOU</span>
                        </div>
                        <span v-if="match.entry_b_seed"
                          class="text-[10px] text-slate-400 font-bold">
                          Seed #{{ match.entry_b_seed }}
                        </span>
                      </div>
                    </div>
                    <div class="flex items-center gap-3 shrink-0">
                      <Icon v-if="match.winner_entry_uuid === match.entry_b_uuid"
                        icon="ph:crown-fill" class="text-amber-500 text-base" />
                      <div class="text-right">
                        <span class="text-2xl font-black tabular-nums text-navy dark:text-white">
                          {{ match.set_points_b ?? match.total_points_b ?? (match.total_score_b > 0 ? match.total_score_b : 0) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Ends Breakdown (if available) -->
                  <div v-if="match.ends && match.ends.length"
                    class="px-5 py-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                    <div class="text-[10px] font-black capitalize tracking-wider text-slate-400 mb-2">
                      {{ t('elimination.score_per_end', 'Set Points Breakdown') }}
                    </div>
                    <div class="flex flex-wrap gap-2 text-xs">
                      <div v-for="end in match.ends" :key="end.end_no"
                        class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-2">
                        <span class="text-[10px] font-bold text-slate-400">Set {{ end.end_no }}</span>
                        <span class="font-black text-navy dark:text-white">{{ end.score_a }} - {{ end.score_b }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Match detail link -->
                  <div
                    class="px-5 py-2.5 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
                    <NuxtLink :to="`/match/${match.match_id || match.uuid}`"
                      class="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5">
                      <Icon icon="ph:arrow-square-out-bold" />
                      <span>{{ t('elimination.open_match_page', 'Lihat Rincian Pertandingan') }}</span>
                    </NuxtLink>
                    <span v-if="match.target_number" class="text-[11px] font-bold text-slate-400">
                      {{ match.target_number }}
                    </span>
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

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { useEventContext } from '~/composables/useEventContext'

definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()
const { get } = useApi()
const route = useRoute()
const { setEvent } = useEventContext()
const eventId = computed(() => route.params.id as string)
const eventName = ref('')

useHead({
  title: computed(() => `${eventName.value || t('elimination.title', 'My Elimination Matches')} - Archeris Dashboard`)
})

const isLoading = ref(true)
const userProfile = ref<any>(null)
const myEntryUuid = ref<string | null>(null)
const categoryId = ref<string | null>(null)
const categoryName = ref('')
const archerUuid = ref<string | null>(null)
const elimMatches = ref<any[]>([])
const myCategories = ref<any[]>([])

const currentCategoryName = computed(() => {
  const cat = myCategories.value.find(c => c.category_id === categoryId.value || c.uuid === categoryId.value)
  return cat ? (cat.category_name_custom || `${cat.division_name || ''} - ${cat.category_name || ''}`) : ''
})

const categoryOptions = computed(() => {
  return myCategories.value.map(cat => ({
    title: cat.category_name_custom || `${cat.division_name || ''} - ${cat.category_name || ''}`.trim() || 'Category',
    value: cat.category_id || cat.uuid
  }))
})

const elimStatusLabel = computed(() => {
  if (!elimMatches.value.length) return t('elimination.status_ready', 'Standby')
  const lastMatch = [...elimMatches.value].reverse()[0]
  if (lastMatch.status !== 'finished' && lastMatch.status !== 'completed') return t('elimination.status_active', 'In Competition')
  if (lastMatch.winner_entry_uuid === myEntryUuid.value) return t('elimination.status_champion', 'Champion')
  return t('elimination.status_ended', 'Completed')
})

function getRoundLabel(roundNo: number): string {
  if (roundNo === 1) return 'Quarter Final'
  if (roundNo === 2) return 'Semi Final'
  if (roundNo === 3) return 'Gold Medal Final'
  return `Round ${roundNo}`
}

async function fetchInitialData() {
  isLoading.value = true
  try {
    const [profileRes, eventRes, meRes] = await Promise.allSettled([
      get('/archer/me'),
      get(`/tournaments/${eventId.value}`),
      get(`/tournaments/${eventId.value}/participants/me`)
    ])

    if (profileRes.status === 'fulfilled') {
      userProfile.value = profileRes.value?.data || profileRes.value
    }

    if (eventRes.status === 'fulfilled') {
      const evtData = eventRes.value?.event || eventRes.value?.data || eventRes.value
      if (evtData?.name) {
        eventName.value = evtData.name
        setEvent({ id: eventId.value, name: evtData.name })
      }
    }

    if (meRes.status === 'fulfilled' && meRes.value?.categories?.length) {
      myCategories.value = meRes.value.categories
      const cat = meRes.value.categories[0]
      categoryId.value = cat.category_id || cat.uuid
      categoryName.value = cat.category_name_custom || `${cat.division_name || ''} - ${cat.category_name || ''}`
      archerUuid.value = meRes.value.archer_id
    } else {
      // Fallback to event categories
      const catRes = await get(`/tournaments/${eventId.value}/categories`)
      const rawCats = Array.isArray(catRes) ? catRes : catRes?.categories || []
      myCategories.value = rawCats
      if (rawCats.length) {
        categoryId.value = rawCats[0].uuid || rawCats[0].id
      }
    }
    await updateResultsData()
  } catch (e) {
    console.error('Failed to fetch initial elimination data:', e)
  } finally {
    isLoading.value = false
  }
}

async function updateResultsData() {
  if (!categoryId.value) return
  try {
    const elimRes = await get(`/tournaments/${eventId.value}/results/elimination`, {
      params: { category_id: categoryId.value }
    })
    if (elimRes?.bracket?.matches) {
      const allMatches = Object.values(elimRes.bracket.matches).flat().map((m: any) => ({
        ...m,
        entry_a_uuid: m.entry_a_uuid ?? m.entry_a_id,
        entry_b_uuid: m.entry_b_uuid ?? m.entry_b_id,
        winner_entry_uuid: m.winner_entry_uuid ?? m.winner_entry_id
      }))
      const myName = userProfile.value?.full_name
      const myMatch = allMatches.find((m: any) => m.entry_a_name === myName || m.entry_b_name === myName)
      if (myMatch) {
        myEntryUuid.value = myMatch.entry_a_name === myName
          ? (myMatch.entry_a_uuid ?? myMatch.entry_a_id)
          : (myMatch.entry_b_uuid ?? myMatch.entry_b_id)
        elimMatches.value = allMatches
          .filter((m: any) => {
            const searchUuid = myEntryUuid.value || archerUuid.value || userProfile.value?.uuid
            return (m.entry_a_uuid === searchUuid || m.entry_a_id === searchUuid) ||
              (m.entry_b_uuid === searchUuid || m.entry_b_id === searchUuid)
          })
          .sort((a: any, b: any) => a.round_no - b.round_no)
      } else {
        elimMatches.value = allMatches.sort((a: any, b: any) => a.round_no - b.round_no)
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

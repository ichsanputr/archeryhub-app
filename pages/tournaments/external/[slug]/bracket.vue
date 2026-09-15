<template>
  <div class="min-h-screen bg-slate-100 flex flex-col font-sans">
    <!-- Top Header Bar -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
      <div class="flex items-center gap-3">
        <NuxtLink 
          :to="`/tournaments/external/${slug}`" 
          class="size-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy flex items-center justify-center transition-colors cursor-pointer"
          title="Back to Tournament"
        >
          <Icon icon="ph:arrow-left-bold" class="text-base" />
        </NuxtLink>

        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-sm sm:text-base font-bold text-navy font-display truncate max-w-[200px] sm:max-w-md">
              {{ toTitleCase(tournament?.name || 'Tournament Bracket') }}
            </h1>
            <span class="px-2 py-0.5 rounded-full bg-primary/20 text-navy text-[10px] font-bold">
              Elimination Bracket
            </span>
          </div>
          <div class="text-[11px] text-slate-500 font-medium truncate">
            {{ toTitleCase(tournament?.location || tournament?.venue || 'Indonesia') }}
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex items-center gap-2">
        <NuxtLink 
          :to="`/tournaments/external/${slug}`" 
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
        >
          <Icon icon="ph:arrow-left" class="text-xs" />
          <span>Full Details</span>
        </NuxtLink>

        <button 
          @click="toggleBrowserFullscreen"
          class="size-9 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          :title="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'"
        >
          <Icon :icon="isFullscreen ? 'ph:corners-in-bold' : 'ph:corners-out-bold'" class="text-base" />
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 p-4 sm:p-6 flex flex-col space-y-4 max-w-[1920px] w-full mx-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex-1 flex items-center justify-center py-32">
        <div class="flex flex-col items-center gap-3">
          <Icon icon="ph:spinner-gap-bold" class="text-3xl text-navy animate-spin" />
          <span class="text-xs font-semibold text-slate-500">Loading elimination tree...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage || !hasBracketsData" class="flex-1 flex items-center justify-center py-24">
        <div class="max-w-md w-full bg-white rounded-3xl p-8 text-center space-y-4 border border-slate-200 shadow-sm">
          <div class="size-16 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mx-auto text-2xl">
            <Icon icon="ph:sword-bold" />
          </div>
          <h2 class="text-lg font-bold text-navy">No Elimination Bracket Available</h2>
          <div class="text-xs text-slate-500 leading-relaxed">
            Elimination brackets have not been published for this tournament yet.
          </div>
          <NuxtLink :to="`/tournaments/external/${slug}`" class="inline-flex items-center gap-2 px-5 py-2.5 bg-navy hover:bg-navy-light text-white font-bold rounded-xl text-xs transition-colors">
            <Icon icon="ph:arrow-left-bold" />
            <span>Return to Tournament</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Loaded Content -->
      <template v-else>
        <!-- Category Filter Pills Bar -->
        <div class="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs flex items-center justify-between gap-3 overflow-hidden">
          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span class="text-xs font-bold text-slate-400 pl-1 shrink-0">Category:</span>
            <button
              v-for="cat in availableBracketCategories"
              :key="cat"
              @click="selectedCategory = cat"
              :class="[
                'px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer',
                (selectedCategory || availableBracketCategories[0]) === cat
                  ? 'bg-navy text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              ]"
            >
              {{ toTitleCase(cat) }}
            </button>
          </div>
        </div>

        <!-- Elimination Bracket Viewer Component -->
        <div class="flex-1 bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm overflow-hidden flex flex-col">
          <ExternalEliminationBracket
            v-if="hasCurrentBracketRounds"
            :rounds="currentArcherisBracketRounds"
            :config="currentArcherisBracketConfig"
            :tournament-slug="slug"
            :category-name="selectedCategory || availableBracketCategories[0]"
            :is-full-page="true"
          />
          <div v-else class="text-center py-24 text-slate-400 text-xs sm:text-sm my-auto">
            <Icon icon="ph:sword" class="text-3xl mx-auto mb-2 text-slate-300" />
            <span>No bracket matches found for this category.</span>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import ExternalEliminationBracket from '~/components/tournament/ExternalEliminationBracket.vue'

definePageMeta({
  layout: false
})

const route = useRoute()
const config = useRuntimeConfig()
const apiBase = config.public.apiBaseUrl || 'http://localhost:8001'
const slug = route.params.slug || '25818'

const { data: responseData, pending: isLoading, error } = await useAsyncData(
  `tournament-external-bracket-${slug}`,
  () => $fetch(`${apiBase}/tournaments/external/${slug}`),
  { lazy: false, server: true }
)

const tournament = computed(() => responseData.value?.tournament || null)
const tournamentData = computed(() => responseData.value?.data || null)
const errorMessage = computed(() => error.value ? (error.value.message || 'Failed to load tournament data') : '')

const hasBracketsData = computed(() => {
  const br = tournamentData.value?.brackets
  return br && typeof br === 'object' && Object.keys(br).length > 0
})

const availableBracketCategories = computed(() => {
  if (!hasBracketsData.value) return []
  return Object.keys(tournamentData.value.brackets)
})

const selectedCategory = ref('')

watch(availableBracketCategories, (newCats) => {
  if (newCats.length > 0) {
    const qCat = String(route.query.category || '').trim().toLowerCase()
    const matched = newCats.find(c => c.toLowerCase() === qCat)
    if (matched) {
      selectedCategory.value = matched
    } else if (!selectedCategory.value || !newCats.includes(selectedCategory.value)) {
      selectedCategory.value = newCats[0]
    }
  }
}, { immediate: true })

const toTitleCase = (str) => {
  if (!str) return ''
  return String(str).toLowerCase().replace(/(?:^|\s|\/|-)\S/g, char => char.toUpperCase())
}

const currentArcherisBracketConfig = computed(() => {
  const cat = selectedCategory.value || availableBracketCategories.value[0] || ''
  const isCompound = cat.toLowerCase().includes('compound')
  const rounds = currentArcherisBracketRounds.value
  const round1Matches = rounds[1] || []
  const bracketSize = Math.max(8, round1Matches.length * 2)
  return {
    category_name: toTitleCase(cat),
    format: isCompound ? 'compound_cumulative' : 'recurve_set',
    bracket_size: bracketSize
  }
})

const currentArcherisBracketRounds = computed(() => {
  const cat = selectedCategory.value || availableBracketCategories.value[0] || ''
  if (!cat || !hasBracketsData.value) return {}

  const rawBrackets = tournamentData.value.brackets
  const catData = rawBrackets[cat]
  if (!catData) return {}

  let phasesList = []
  if (Array.isArray(catData)) {
    phasesList = catData
  } else if (typeof catData === 'object') {
    Object.keys(catData).forEach(pName => {
      const val = catData[pName]
      if (Array.isArray(val)) {
        phasesList.push({ phase: pName, matches: val })
      } else if (val && typeof val === 'object') {
        phasesList.push({ phase: pName, matches: [val] })
      }
    })
  }

  const parseMatchItem = (m, idx, phaseLabel) => {
    const a1 = String(m.archer1 || m.name1 || m.archer_a || m.name_a || '').trim()
    const s1 = String(m.score1 || m.score_a || '').trim()
    const seed1 = String(m.seed1 || m.seed_a || '').trim()
    const sets1 = String(m.sets1 || m.sets_a || '').trim()

    const a2 = String(m.archer2 || m.name2 || m.archer_b || m.name_b || '').trim()
    const s2 = String(m.score2 || m.score_b || '').trim()
    const seed2 = String(m.seed2 || m.seed_b || '').trim()
    const sets2 = String(m.sets2 || m.sets_b || '').trim()

    let nameA = 'TBD'
    let realSeedA = seed1
    let scoreA = s1

    if (/[a-zA-Z]/.test(a1)) {
      nameA = a1
      scoreA = s1
    } else if (/[a-zA-Z]/.test(s1)) {
      nameA = s1
      realSeedA = /^\d+$/.test(a1) ? a1 : seed1
    }

    let nameB = 'TBD'
    let realSeedB = seed2
    let scoreB = s2

    if (/[a-zA-Z]/.test(a2)) {
      nameB = a2
      scoreB = s2
    } else if (/[a-zA-Z]/.test(s2)) {
      nameB = s2
      realSeedB = /^\d+$/.test(a2) ? a2 : seed2
    }

    const arrA = sets1.split(/\s+/).map(Number).filter(n => !isNaN(n))
    const arrB = sets2.split(/\s+/).map(Number).filter(n => !isNaN(n))

    if (!/^\d+$/.test(scoreA) && arrA.length > 0 && arrB.length > 0) {
      let pA = 0
      let pB = 0
      for (let i = 0; i < Math.min(arrA.length, arrB.length); i++) {
        if (arrA[i] > arrB[i]) pA += 2
        else if (arrB[i] > arrA[i]) pB += 2
        else { pA += 1; pB += 1 }
      }
      scoreA = String(pA)
      scoreB = String(pB)
    }

    let winnerId = null
    const nA = parseFloat(scoreA)
    const nB = parseFloat(scoreB)
    if (!isNaN(nA) && !isNaN(nB)) {
      if (nA > nB) winnerId = 'a'
      else if (nB > nA) winnerId = 'b'
    }

    return {
      id: `m_${phaseLabel}_${idx}`,
      match_no: idx + 1,
      phase: phaseLabel,
      entry_a_id: 'a',
      entry_a_name: toTitleCase(nameA),
      entry_a_seed: realSeedA,
      set_points_a: scoreA,
      total_score_a: scoreA,
      sets_a: sets1,
      entry_b_id: 'b',
      entry_b_name: toTitleCase(nameB),
      entry_b_seed: realSeedB,
      set_points_b: scoreB,
      total_score_b: scoreB,
      sets_b: sets2,
      winner_entry_id: winnerId,
      is_bye: (nameA.toUpperCase() === 'BYE' || nameB.toUpperCase() === 'BYE')
    }
  }

  let allPreliminaryMatches = []
  let bronzeMatch = null

  phasesList.forEach(p => {
    const pName = String(p.phase || '')
    const pLower = pName.toLowerCase()
    const matches = Array.isArray(p.matches) ? p.matches : []

    matches.forEach((m, mIdx) => {
      const parsed = parseMatchItem(m, mIdx, pName)
      if (pLower.includes('bronze')) {
        bronzeMatch = parsed
      } else {
        allPreliminaryMatches.push(parsed)
      }
    })
  })

  const total = allPreliminaryMatches.length
  const rounds = {}

  if (total >= 14) {
    // 16-archer bracket: 8 (1/8) -> 4 (QF) -> 2 (SF) -> Finals
    rounds[1] = allPreliminaryMatches.slice(0, 8)
    rounds[2] = allPreliminaryMatches.slice(8, 12)
    rounds[3] = allPreliminaryMatches.slice(12, 14)
    const finals = []
    if (total >= 15) finals.push(allPreliminaryMatches[14])
    if (bronzeMatch) finals.push(bronzeMatch)
    rounds[4] = finals
  } else if (total >= 8) {
    // 1/8 with byes: last 2 are SF, 4 before SF are QF, rest are 1/8
    const sf = allPreliminaryMatches.slice(total - 2)
    const qf = allPreliminaryMatches.slice(total - 6, total - 2)
    const r16 = allPreliminaryMatches.slice(0, total - 6)

    let rIdx = 1
    if (r16.length > 0) {
      rounds[rIdx] = r16
      rIdx++
    }
    rounds[rIdx] = qf
    rIdx++
    rounds[rIdx] = sf
    rIdx++
    const finals = []
    if (bronzeMatch) finals.push(bronzeMatch)
    rounds[rIdx] = finals
  } else if (total >= 6) {
    // 8-archer bracket: 4 (QF) -> 2 (SF) -> Finals
    rounds[1] = allPreliminaryMatches.slice(0, 4)
    rounds[2] = allPreliminaryMatches.slice(4, 6)
    const finals = []
    if (total >= 7) finals.push(allPreliminaryMatches[6])
    if (bronzeMatch) finals.push(bronzeMatch)
    rounds[3] = finals
  } else if (total >= 2) {
    // 4-archer bracket: 2 (SF) -> Finals
    rounds[1] = allPreliminaryMatches.slice(0, 2)
    const finals = []
    if (total >= 3) finals.push(allPreliminaryMatches[2])
    if (bronzeMatch) finals.push(bronzeMatch)
    rounds[2] = finals
  } else if (total > 0) {
    rounds[1] = allPreliminaryMatches
    if (bronzeMatch) rounds[2] = [bronzeMatch]
  } else if (bronzeMatch) {
    rounds[1] = [bronzeMatch]
  }

  return rounds
})

const hasCurrentBracketRounds = computed(() => {
  return Object.keys(currentArcherisBracketRounds.value).length > 0
})

const isFullscreen = ref(false)
const toggleBrowserFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {})
    isFullscreen.value = true
  } else {
    document.exitFullscreen().catch(() => {})
    isFullscreen.value = false
  }
}
</script>

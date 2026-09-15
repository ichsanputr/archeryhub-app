<template>
  <div class="min-h-screen bg-slate-100 flex flex-col font-sans">
    <!-- Main Content Area -->
    <main class="flex-1 p-3 sm:p-6 flex flex-col space-y-3 sm:space-y-4 max-w-[1920px] w-full mx-auto">
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
          <NuxtLink :to="`/tournaments/${slug}`" class="inline-flex items-center gap-2 px-5 py-2.5 bg-navy hover:bg-navy-light text-white font-bold rounded-xl text-xs transition-colors">
            <Icon icon="ph:arrow-left-bold" />
            <span>Return to Tournament</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Loaded Content -->
      <template v-else>
        <!-- ── TOURNAMENT INFO & SHARING HERO HEADER CARD ── -->
        <div class="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-xs relative overflow-hidden">
          <!-- Subtle decorative background gradient -->
          <div class="absolute -right-20 -top-20 size-72 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
          <div class="absolute -left-20 -bottom-20 size-72 rounded-full bg-navy/5 blur-3xl pointer-events-none"></div>

          <div class="relative z-10 space-y-4">
            <!-- Top Utility Bar: Navigation & Action Buttons -->
            <div class="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <NuxtLink 
                  :to="`/tournaments/${slug}`" 
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy text-xs font-bold transition-colors cursor-pointer"
                  title="Kembali ke Detail Turnamen"
                >
                  <Icon icon="ph:arrow-left-bold" class="text-sm" />
                  <span>Detail Turnamen</span>
                </NuxtLink>

                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-900 border border-amber-400/30 text-[11px] font-bold">
                  <Icon icon="ph:sword-fill" class="text-amber-600 text-xs" />
                  <span>Bagan Eliminasi</span>
                </div>
              </div>

              <!-- Sharing & Actions -->
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="copyShareLink"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <Icon :icon="copiedShareLink ? 'ph:check-bold' : 'ph:share-network-bold'" class="text-xs" />
                  <span>{{ copiedShareLink ? 'Tautan Disalin!' : 'Bagikan' }}</span>
                </button>
              </div>
            </div>

            <!-- Tournament Main Title -->
            <div class="space-y-1">
              <h1 class="text-base sm:text-2xl font-black text-navy font-display tracking-tight leading-snug">
                {{ toTitleCase(tournament?.name || 'Turnamen Panahan') }}
              </h1>
            </div>

            <!-- Metadata Badges Row -->
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <!-- Location / Venue Badge -->
              <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-semibold shadow-2xs">
                <Icon icon="ph:map-pin-fill" class="text-primary text-sm shrink-0" />
                <span class="truncate max-w-[260px] sm:max-w-md">{{ toTitleCase(tournament?.location || tournament?.venue || 'Indonesia') }}</span>
              </div>

              <!-- Date Badge (if available) -->
              <div v-if="formattedDateRange" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-semibold shadow-2xs">
                <Icon icon="ph:calendar-blank-fill" class="text-primary text-sm shrink-0" />
                <span>{{ formattedDateRange }}</span>
              </div>

              <!-- Active Category Badge -->
              <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/20 border border-primary/40 text-xs text-navy font-black shadow-2xs">
                <Icon icon="ph:target-bold" class="text-navy text-sm shrink-0" />
                <span>Kategori: {{ toTitleCase(selectedCategory || availableBracketCategories[0]) }}</span>
              </div>

              <!-- Total Category Matches Badge -->
              <div v-if="totalCategoryMatches > 0" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-semibold shadow-2xs">
                <Icon icon="ph:trophy-fill" class="text-amber-500 text-sm shrink-0" />
                <span>{{ totalCategoryMatches }} Pertandingan</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ── CATEGORY FILTER PILLS BAR ── -->
        <div class="bg-white rounded-2xl border border-slate-200 p-2.5 sm:p-3 shadow-2xs flex items-center justify-between gap-2.5 sm:gap-3 overflow-hidden">
          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 w-full">
            <span class="text-xs font-bold text-slate-400 pl-1 shrink-0">Pilih Kategori:</span>
            <button
              v-for="cat in availableBracketCategories"
              :key="cat"
              @click="handleSelectCategory(cat)"
              :class="[
                'px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap shrink-0 transition-all cursor-pointer',
                (selectedCategory || availableBracketCategories[0]) === cat
                  ? 'bg-navy text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold'
              ]"
            >
              {{ toTitleCase(cat) }}
            </button>
          </div>
        </div>

        <!-- ── ELIMINATION BRACKET VIEWER COMPONENT ── -->
        <div class="flex-1 bg-white rounded-3xl border border-slate-200 p-3 sm:p-6 shadow-sm overflow-hidden flex flex-col">
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
            <span>Tidak ada pertandingan eliminasi untuk kategori ini.</span>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import ExternalEliminationBracket from '~/components/tournament/ExternalEliminationBracket.vue'

definePageMeta({
  layout: false
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const apiBase = config.public.apiBaseUrl || 'http://localhost:8001'
const slug = route.params.slug || '25818'

const { data: responseData, pending: isLoading, error } = await useAsyncData(
  `tournament-bracket-${slug}`,
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

const handleSelectCategory = (cat) => {
  selectedCategory.value = cat
  router.replace({ query: { ...route.query, category: cat } })
}

const copiedShareLink = ref(false)
const copyShareLink = async () => {
  try {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    copiedShareLink.value = true
    setTimeout(() => {
      copiedShareLink.value = false
    }, 2000)
  } catch (e) {
    console.error('Failed to copy', e)
  }
}

const toTitleCase = (str) => {
  if (!str) return ''
  return String(str).toLowerCase().replace(/(?:^|\s|\/|-)\S/g, char => char.toUpperCase())
}

const formattedDateRange = computed(() => {
  const s = tournamentData.value?.start_date || tournament.value?.start_date
  const e = tournamentData.value?.end_date || tournament.value?.end_date
  if (!s) return ''
  try {
    const sDate = new Date(s)
    const options = { day: 'numeric', month: 'short', year: 'numeric' }
    if (!e || s === e) {
      return sDate.toLocaleDateString('id-ID', options)
    }
    const eDate = new Date(e)
    return `${sDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${eDate.toLocaleDateString('id-ID', options)}`
  } catch {
    return ''
  }
})

const totalCategoryMatches = computed(() => {
  let count = 0
  Object.values(currentArcherisBracketRounds.value).forEach(mList => {
    count += (mList || []).length
  })
  return count
})

useHead({
  title: computed(() => {
    const tourName = tournament.value?.name ? toTitleCase(tournament.value.name) : 'Tournament'
    const catName = selectedCategory.value ? toTitleCase(selectedCategory.value) : 'Elimination'
    return `${tourName} - ${catName} Bracket | Archeris`
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        const tourName = tournament.value?.name ? toTitleCase(tournament.value.name) : 'Tournament'
        const catName = selectedCategory.value ? toTitleCase(selectedCategory.value) : 'Elimination'
        return `Live elimination bracket, official scorecard, and head-to-head match results for ${catName} at ${tourName}.`
      })
    },
    {
      property: 'og:title',
      content: computed(() => {
        const tourName = tournament.value?.name ? toTitleCase(tournament.value.name) : 'Tournament'
        const catName = selectedCategory.value ? toTitleCase(selectedCategory.value) : 'Elimination'
        return `${tourName} - ${catName} Bracket | Archeris`
      })
    },
    {
      property: 'og:description',
      content: computed(() => {
        const tourName = tournament.value?.name ? toTitleCase(tournament.value.name) : 'Tournament'
        const catName = selectedCategory.value ? toTitleCase(selectedCategory.value) : 'Elimination'
        return `Live elimination bracket, official scorecard, and head-to-head match results for ${catName} at ${tourName}.`
      })
    },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
})

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
    rounds[1] = allPreliminaryMatches.slice(0, 8)
    rounds[2] = allPreliminaryMatches.slice(8, 12)
    rounds[3] = allPreliminaryMatches.slice(12, 14)
    const finals = []
    if (total >= 15) finals.push(allPreliminaryMatches[14])
    if (bronzeMatch) finals.push(bronzeMatch)
    rounds[4] = finals
  } else if (total >= 8) {
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
    rounds[1] = allPreliminaryMatches.slice(0, 4)
    rounds[2] = allPreliminaryMatches.slice(4, 6)
    const finals = []
    if (total >= 7) finals.push(allPreliminaryMatches[6])
    if (bronzeMatch) finals.push(bronzeMatch)
    rounds[3] = finals
  } else if (total >= 2) {
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
</script>

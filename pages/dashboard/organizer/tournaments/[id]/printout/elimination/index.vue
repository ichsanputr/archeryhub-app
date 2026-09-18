<template>
  <div class="flex flex-col gap-6 pb-16 font-body text-navy antialiased">
    <!-- Header -->
    <DashboardHeader
      :title="t('event_printout.elimination.title', 'Elimination Bracket')"
      :subtitle="t('event_printout.elimination.page_desc', 'Print tournament brackets per category for athletes and spectators.')"
      icon="ph:tree-structure-bold"
      :back-to="`/dashboard/organizer/tournaments/${eventId}/printout`"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('events.list.title', 'Event Saya'), to: '/dashboard/organizer/tournaments' },
        { label: t('event_printout.breadcrumb_printout', 'Printouts'), to: `/dashboard/organizer/tournaments/${eventId}/printout` },
        { label: t('event_printout.elimination.title', 'Elimination Bracket') }
      ]"
    >
      <template #actions v-if="bracket && bracket.rounds?.length > 0">
        <BaseButton variant="primary" icon="ph:printer-bold" class="h-10 sm:h-11 px-6 shadow-sm w-full sm:w-auto text-xs sm:text-sm font-black tracking-wider" @click="printBracket">
          {{ t('event_printout.elimination.btn_print_bracket', 'Print Bracket') }}
        </BaseButton>
      </template>
    </DashboardHeader>

    <!-- Filter Controls Card -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <BaseSelect
            v-model="selectedCategory"
            :items="categoryOptions"
            :label="t('event_printout.elimination.filter_category_label', 'Select Category') + ' *'"
            required
            :placeholder="t('event_printout.elimination.select_category_placeholder', 'Select Category...')"
          />
        </div>

        <div>
          <BaseSelect
            v-model="printOrientation"
            :items="orientationOptions"
            :label="t('event_printout.elimination.orientation_label', 'Print Orientation')"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold text-gray-500">{{ t('event_printout.elimination.display_label', 'Display Elements') }}</label>
          <div class="flex gap-4 items-center h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl">
            <label class="flex items-center gap-2 text-xs font-bold text-navy cursor-pointer">
              <input type="checkbox" v-model="showSeeding" class="rounded text-navy" />
              <span>{{ t('event_printout.elimination.show_seeding', 'Seeding Number') }}</span>
            </label>
            <label class="flex items-center gap-2 text-xs font-bold text-navy cursor-pointer">
              <input type="checkbox" v-model="showScore" class="rounded text-navy" />
              <span>{{ t('event_printout.elimination.show_score', 'Match Score') }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="h-80 bg-white rounded-2xl animate-pulse border border-gray-100 flex items-center justify-center">
      <div class="size-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- No Category Selected -->
    <div v-else-if="!selectedCategory"
      class="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center gap-3 text-center">
      <Icon icon="mdi:bracket" class="text-5xl text-gray-300" />
      <div class="font-black text-navy text-base">{{ t('event_printout.elimination.select_category_first', 'Please Select a Category First') }}</div>
      <div class="text-gray-400 text-xs max-w-sm">{{ t('event_printout.elimination.select_category_desc', 'Select a category to load and view the elimination bracket tree.') }}</div>
    </div>

    <!-- No Bracket Data -->
    <div v-else-if="!bracket || bracket.rounds?.length === 0"
      class="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center gap-3 text-center">
      <Icon icon="mdi:bracket" class="text-5xl text-gray-300" />
      <div class="font-black text-navy text-base">{{ t('event_printout.elimination.bracket_not_available', 'Elimination Bracket Not Generated') }}</div>
      <div class="text-gray-400 text-xs max-w-sm">{{ t('event_printout.elimination.bracket_not_available_desc', 'Generate elimination brackets first on the Elimination page.') }}</div>
      <div class="mt-4">
        <NuxtLink :to="`/dashboard/organizer/tournaments/${eventId}/elimination`">
          <BaseButton variant="primary" size="sm" icon="ph:arrow-right-bold" class="font-bold">
            {{ t('event_printout.elimination.btn_open_elimination', 'Open Elimination Menu') }}
          </BaseButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Bracket Print Area -->
    <div v-else id="bracket-print-area"
      class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-auto">

      <!-- Print Header (shown only on print) -->
      <div class="hidden print:block p-8 border-b border-gray-200 text-center">
        <div class="text-2xl font-black text-navy">{{ eventName }}</div>
        <div class="text-lg font-bold text-gray-600 mt-1">Elimination Bracket — {{ selectedCategoryName }}</div>
        <div class="text-xs text-gray-400 mt-1">{{ t('event_printout.elimination.printed_at', 'Dicetak:') }} {{ printDate }}</div>
      </div>

      <!-- Bracket Visualization -->
      <div class="p-6 overflow-x-auto">
        <div class="flex gap-0 min-w-max items-stretch" style="min-height: 400px;">
          <!-- Rounds -->
          <div v-for="(round, roundIdx) in bracket.rounds" :key="roundIdx"
            class="flex flex-col justify-around gap-2 min-w-[220px]">

            <!-- Round Label -->
            <div class="text-center mb-3">
              <span class="text-xs font-black tracking-wider text-gray-400">{{ round.name || `Round ${roundIdx + 1}` }}</span>
            </div>

            <!-- Matches in this round -->
            <div v-for="(match, matchIdx) in round.matches" :key="matchIdx"
              class="flex flex-col border border-gray-200 rounded-xl overflow-hidden mx-2 text-xs shadow-2xs">

              <!-- Archer 1 -->
              <div class="px-3 py-2.5 border-b border-gray-100 flex items-center justify-between gap-2"
                :class="isWinner(match, 1) ? 'bg-primary/15 font-black text-navy' : 'bg-white text-gray-700'">
                <div class="flex items-center gap-2 min-w-0">
                  <span v-if="showSeeding" class="text-[10px] font-black text-gray-400 shrink-0 w-5 text-center">[{{ match.seed1 || '?' }}]</span>
                  <span class="truncate font-bold">
                    {{ match.archer1_name || 'BYE' }}
                  </span>
                </div>
                <div v-if="showScore && match.score1 != null" class="font-black text-navy shrink-0">{{ match.score1 }}</div>
              </div>

              <!-- Archer 2 -->
              <div class="px-3 py-2.5 flex items-center justify-between gap-2"
                :class="isWinner(match, 2) ? 'bg-primary/15 font-black text-navy' : 'bg-white text-gray-700'">
                <div class="flex items-center gap-2 min-w-0">
                  <span v-if="showSeeding" class="text-[10px] font-black text-gray-400 shrink-0 w-5 text-center">[{{ match.seed2 || '?' }}]</span>
                  <span class="truncate font-bold">
                    {{ match.archer2_name || 'BYE' }}
                  </span>
                </div>
                <div v-if="showScore && match.score2 != null" class="font-black text-navy shrink-0">{{ match.score2 }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'

const route = useRoute()
const { get } = useApi()
const { t } = useI18n()

const eventId = route.params.id
const eventName = ref('')
const isLoading = ref(false)
const bracket = ref(null)
const categories = ref([])
const selectedCategory = ref(null)
const printOrientation = ref('landscape')
const showSeeding = ref(true)
const showScore = ref(true)

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: computed(() => t('event_printout.elimination.title', 'Bagan Eliminasi') + ' - Archeris Dashboard')
})

const categoryOptions = computed(() => {
  return categories.value.map(c => ({
    value: c.id,
    title: `${c.division_name || ''} ${c.category_name || ''} ${c.gender_division_name || ''}`.trim()
  }))
})

const orientationOptions = computed(() => [
  { value: 'landscape', title: t('event_printout.elimination.orientation_landscape', 'Landscape (Recommended)') },
  { value: 'portrait', title: t('event_printout.elimination.orientation_portrait', 'Portrait') }
])

const selectedCategoryName = computed(() => {
  const found = categories.value.find(c => c.id === selectedCategory.value)
  if (!found) return ''
  return `${found.division_name || ''} ${found.category_name || ''} ${found.gender_division_name || ''}`.trim()
})

const printDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const fetchCategories = async () => {
  try {
    const res = await get(`/tournaments/${eventId}/categories`)
    categories.value = res?.events || res?.categories || []
    if (categories.value.length > 0 && !selectedCategory.value) {
      selectedCategory.value = categories.value[0].id
    }
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
}

const fetchBracket = async () => {
  if (!selectedCategory.value) return
  isLoading.value = true
  try {
    const res = await get(`/tournaments/${eventId}/elimination/categories/${selectedCategory.value}/bracket`)
    bracket.value = res?.bracket || res || null
  } catch (err) {
    console.error('Failed to fetch bracket:', err)
    bracket.value = null
  } finally {
    isLoading.value = false
  }
}

watch(selectedCategory, () => {
  fetchBracket()
})

const isWinner = (match, archerNum) => {
  if (!match) return false
  if (match.winner_archer_number === archerNum) return true
  if (archerNum === 1 && match.score1 > match.score2) return true
  if (archerNum === 2 && match.score2 > match.score1) return true
  return false
}

const printBracket = () => {
  window.print()
}

onMounted(() => {
  fetchCategories()
})
</script>

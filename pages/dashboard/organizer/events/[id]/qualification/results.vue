<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: 0.2;"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
      <div class="relative p-6 sm:p-8">
        <nav class="flex text-[10px] font-bold text-white/40 tracking-widest mb-2 items-center gap-1.5">
          <NuxtLink :to="`/dashboard/organizer/events/${eventId}/qualification`" class="hover:text-white transition-colors">Qualification</NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-[9px]" />
          <span class="text-white/70">{{ t("org_qual_results.nav_final_ranking") }}</span>
        </nav>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="h-14 w-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Icon icon="ph:trophy-bold" class="text-primary text-2xl" />
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-black tracking-tight">{{ t("org_qual_results.header_title") }}</h1>
              <div class="text-slate-300 text-sm mt-1">{{ t("org_qual_results.header_subtitle") }}</div>
            </div>
          </div>
          <div class="flex gap-3">
            <BaseButton variant="white" icon="ph:printer-bold" class="h-10 px-5 font-bold" @click="printResults">
              Cetak Hasil
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Selector & Filters -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 flex flex-wrap gap-4 items-center justify-between shadow-sm">
      <div class="flex items-center gap-3 min-w-64">
        <label class="text-xs font-black text-slate-500 capitalize shrink-0">{{ t("org_qual_results.category_label") }}</label>
        <BaseSelect v-model="selectedCategory" :options="categoryOptions" item-title="title" item-value="value" :placeholder="t('org_qual_results.select_category')" class="w-full" />
      </div>

      <div class="flex items-center gap-3">
        <div class="relative w-64">
          <Icon icon="ph:magnifying-glass-bold" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input v-model="search" type="text" :placeholder="t('org_qual_results.search_placeholder')" class="w-full h-10 pl-9 pr-4 text-xs font-medium bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-navy dark:text-white placeholder:text-slate-400" />
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="h-96 bg-white dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-700" />

    <!-- No Category Selected -->
    <div v-else-if="!selectedCategory" class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-12 text-center text-slate-500">
      {{ t("org_qual_results.no_category_selected") }}
    </div>

    <!-- Rankings Table -->
    <div v-else class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden" id="ranking-print-area">
      <div class="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div>
          <h3 class="font-black text-navy dark:text-white text-lg">{{ selectedCategoryName }}</h3>
          <div class="text-xs text-slate-500">{{ t("org_qual_results.archers_registered", { n: filteredRankings.length }) }}</div>
        </div>
      </div>

      <div v-if="filteredRankings.length === 0" class="p-12 text-center text-slate-500">
        {{ t("org_qual_results.no_scores") }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 text-slate-500 font-bold capitalize tracking-wider">
              <th class="p-4 w-14 text-center">{{ t("org_qual_results.th_rank") }}</th>
              <th class="p-4">{{ t("org_qual_results.th_athlete") }}</th>
              <th class="p-4">{{ t("org_qual_results.th_club") }}</th>
              <th class="p-4 text-center">{{ t("org_qual_results.th_session_1") }}</th>
              <th class="p-4 text-center">{{ t("org_qual_results.th_session_2") }}</th>
              <th class="p-4 text-center">{{ t("org_qual_results.th_total_score") }}</th>
              <th class="p-4 text-center">{{ t("org_qual_results.th_x_count") }}</th>
              <th class="p-4 text-center">{{ t("org_qual_results.th_10_count") }}</th>
              <th class="p-4 text-center">{{ t("org_qual_results.th_status") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
            <tr v-for="(r, idx) in filteredRankings" :key="r.uuid || idx"
                class="hover:bg-slate-50/50 dark:hover:bg-slate-700/30"
                :class="idx < 8 ? 'bg-emerald-50/20' : ''">
              <td class="p-4 text-center font-black text-sm" :class="idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-slate-600'">
                {{ idx + 1 }}
              </td>
              <td class="p-4 font-black text-navy dark:text-white text-sm">{{ r.archer_name || r.full_name }}</td>
              <td class="p-4 text-slate-600 dark:text-slate-300 font-bold">{{ r.club_name || 'Independen' }}</td>
              <td class="p-4 text-center font-mono font-bold">{{ r.score_session_1 || r.session1 || 0 }}</td>
              <td class="p-4 text-center font-mono font-bold">{{ r.score_session_2 || r.session2 || 0 }}</td>
              <td class="p-4 text-center font-mono font-black text-sm text-primary">{{ r.total_score || (r.score_session_1 + r.score_session_2) || 0 }}</td>
              <td class="p-4 text-center font-mono font-bold text-slate-600">{{ r.x_count || 0 }}</td>
              <td class="p-4 text-center font-mono font-bold text-slate-600">{{ r.ten_count || 0 }}</td>
              <td class="p-4 text-center">
                <span v-if="idx < 16" class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                  QUALIFIED (Top {{ idx < 8 ? '8' : '16' }})
                </span>
                <span v-else class="text-slate-400 font-bold text-[10px]">Eliminated</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

const { t } = useI18n()
const route = useRoute()
const { get } = useApi()

const eventId = computed(() => route.params.id as string)

useHead({
  title: computed(() => (t ? t('org_qual_results.header_title', 'Hasil Kualifikasi') : 'Hasil Kualifikasi') + ' - Archeris Dashboard')
})
const isLoading = ref(false)
const categories = ref<any[]>([])
const selectedCategory = ref('')
const rankings = ref<any[]>([])
const search = ref('')

const categoryOptions = computed(() =>
  categories.value.map(c => ({ title: c.name || c.category_name, value: c.uuid || c.id }))
)
const selectedCategoryName = computed(() =>
  categories.value.find(c => (c.uuid || c.id) === selectedCategory.value)?.name || ''
)

const filteredRankings = computed(() => {
  if (!search.value) return rankings.value
  const q = search.value.toLowerCase()
  return rankings.value.filter(r =>
    (r.archer_name || r.full_name || '').toLowerCase().includes(q) ||
    (r.club_name || '').toLowerCase().includes(q)
  )
})

async function fetchCategories() {
  try {
    const res = await get(`/events/${eventId.value}/categories`)
    categories.value = res?.data || res?.categories || []
    if (categories.value.length > 0) {
      selectedCategory.value = categories.value[0].uuid || categories.value[0].id
    }
  } catch { categories.value = [] }
}

async function fetchRankings() {
  if (!selectedCategory.value) return
  isLoading.value = true
  try {
    const res = await get(`/events/${eventId.value}/results/qualification?category_id=${selectedCategory.value}`)
    rankings.value = res?.results || res?.data || []
  } catch { rankings.value = [] }
  finally { isLoading.value = false }
}

watch(selectedCategory, fetchRankings)

function printResults() {
  window.print()
}

onMounted(async () => {
  await fetchCategories()
})

definePageMeta({ layout: 'dashboard' })
</script>

<style scoped>
@media print {
  body * { visibility: hidden; }
  #ranking-print-area, #ranking-print-area * { visibility: visible; }
  #ranking-print-area { position: absolute; left: 0; top: 0; width: 100%; }
}
</style>
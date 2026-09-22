<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: 0.2;"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
      <div class="relative p-6 sm:p-8">
        <nav class="flex text-[10px] font-bold text-white/40 tracking-widest mb-2 items-center gap-1.5">
          <NuxtLink :to="`/dashboard/organizer/tournaments/${eventId}/qualification`" class="hover:text-white transition-colors">Qualification</NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-[9px]" />
          <span class="text-white/70">{{ t("org_qual_results.nav_final_ranking", "Final Ranking") }}</span>
        </nav>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-start gap-4">
            <div class="h-14 w-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <Icon icon="ph:trophy-bold" class="text-primary text-2xl" />
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-black tracking-tight">{{ t("org_qual_results.header_title", "Hasil Kualifikasi") }}</h1>
              <div class="text-slate-300 text-sm mt-1">{{ t("org_qual_results.header_subtitle", "Lihat peringkat dan total skor kualifikasi peserta") }}</div>
            </div>
          </div>
          <div class="flex gap-3">
            <BaseButton variant="white" icon="ph:printer-bold" class="h-10 px-5 font-bold" @click="printResults">
              {{ t('org_qual_results.print_btn', 'Cetak Hasil') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Selector Bar -->
    <div class="bg-white rounded-2xl border border-slate-100 p-5 flex flex-wrap gap-4 items-center justify-between shadow-sm">
      <div class="flex items-center gap-3 w-full sm:w-80">
        <label class="text-xs font-black text-slate-500 capitalize shrink-0">{{ t("org_qual_results.category_label", "Kategori") }}</label>
        <BaseSelect v-model="selectedCategory" :items="categoryOptions" item-title="title" item-value="value" :placeholder="t('org_qual_results.select_category', 'Pilih Kategori')" class="w-full" />
      </div>
    </div>

    <!-- No Category Selected -->
    <div v-if="!selectedCategory && !isLoading" class="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-500">
      {{ t("org_qual_results.no_category_selected", "Silakan pilih kategori terlebih dahulu") }}
    </div>

    <!-- Rankings Table with DashboardDataTable -->
    <div v-else id="ranking-print-area">
      <DashboardDataTable
        :items="rankings"
        :headers="headers"
        :loading="isLoading"
        :searchable="true"
        :search-placeholder="t('org_qual_results.search_placeholder', 'Cari pemanah atau klub...')"
        :title="selectedCategoryName || t('org_qual_results.header_title', 'Hasil Kualifikasi')"
        :subtitle="t('org_qual_results.archers_registered', '{n} Pemanah Terdaftar', { n: rankings.length })"
        :icon="'ph:trophy-bold'"
        :default-page-size="25"
      >
        <template #item-rank="{ index }">
          <span
            class="inline-flex items-center justify-center size-8 rounded-lg font-black text-sm"
            :class="index === 0 ? 'bg-amber-500 text-white' : index === 1 ? 'bg-slate-400 text-white' : index === 2 ? 'bg-amber-700 text-white' : 'bg-navy text-white'"
          >
            {{ index + 1 }}
          </span>
        </template>

        <template #item-archer_name="{ item }">
          <div class="font-black text-navy text-sm">{{ item.archer_name || item.full_name }}</div>
        </template>

        <template #item-club_name="{ item }">
          <div class="text-slate-600 font-bold text-xs">{{ item.club_name || t('org_qual_results.independent', 'Independen') }}</div>
        </template>

        <template #item-session_1="{ item }">
          <span class="font-mono font-bold text-xs text-navy">{{ item.score_session_1 || item.session1 || item.sessions?.[0]?.total_score || 0 }}</span>
        </template>

        <template #item-session_2="{ item }">
          <span class="font-mono font-bold text-xs text-navy">{{ item.score_session_2 || item.session2 || item.sessions?.[1]?.total_score || 0 }}</span>
        </template>

        <template #item-total_score="{ item }">
          <span class="font-mono font-black text-sm text-primary">{{ item.total_score || (Number(item.score_session_1 || 0) + Number(item.score_session_2 || 0)) || 0 }}</span>
        </template>

        <template #item-x_count="{ item }">
          <span class="font-mono font-bold text-xs text-slate-600">{{ item.x_count ?? item.total_x ?? 0 }}</span>
        </template>

        <template #item-ten_count="{ item }">
          <span class="font-mono font-bold text-xs text-slate-600">{{ item.ten_count ?? item.total_10x ?? 0 }}</span>
        </template>

        <template #item-status="{ index }">
          <span v-if="index < 16" class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
            QUALIFIED (Top {{ index < 8 ? '8' : '16' }})
          </span>
          <span v-else class="text-slate-400 font-bold text-[10px]">Eliminated</span>
        </template>

        <template #empty>
          <div class="p-12 text-center text-slate-500">
            {{ t("org_qual_results.no_scores", "Belum ada skor kualifikasi untuk kategori ini") }}
          </div>
        </template>
      </DashboardDataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'

const { t, locale } = useI18n()
const route = useRoute()
const { get } = useApi()

const eventId = computed(() => route.params.id as string)

useHead({
  title: computed(() => `${t('org_qual_results.header_title', 'Hasil Kualifikasi')} - Archeris Dashboard`)
})

const isLoading = ref(false)
const categories = ref<any[]>([])
const selectedCategory = ref('')
const rankings = ref<any[]>([])

const categoryOptions = computed(() =>
  categories.value.map(c => ({ title: c.name || c.category_name, value: c.uuid || c.id }))
)
const selectedCategoryName = computed(() =>
  categories.value.find(c => (c.uuid || c.id) === selectedCategory.value)?.name || ''
)

const headers = computed(() => [
  { key: 'rank', label: t('org_qual_results.th_rank', 'Rank'), width: '70px', align: 'center', sortable: false },
  { key: 'archer_name', label: t('org_qual_results.th_athlete', 'Atlet / Pemanah'), sortable: true },
  { key: 'club_name', label: t('org_qual_results.th_club', 'Klub'), sortable: true },
  { key: 'session_1', label: t('org_qual_results.th_session_1', 'Sesi 1'), align: 'center', sortable: true },
  { key: 'session_2', label: t('org_qual_results.th_session_2', 'Sesi 2'), align: 'center', sortable: true },
  { key: 'total_score', label: t('org_qual_results.th_total_score', 'Total'), align: 'center', sortable: true },
  { key: 'x_count', label: t('org_qual_results.th_x_count', 'X'), align: 'center', sortable: true },
  { key: 'ten_count', label: t('org_qual_results.th_10_count', '10+X'), align: 'center', sortable: true },
  { key: 'status', label: t('org_qual_results.th_status', 'Status'), align: 'center', sortable: false }
])

async function fetchCategories() {
  try {
    const res = await get(`/tournaments/${eventId.value}/categories`)
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
    const res = await get(`/tournaments/${eventId.value}/results/qualification?category_id=${selectedCategory.value}`)
    rankings.value = res?.leaderboard || res?.results || res?.data || []
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
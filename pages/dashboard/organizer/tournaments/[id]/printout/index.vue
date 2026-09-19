<template>
  <div class="flex flex-col gap-6 pb-16 font-body text-navy antialiased">
    <!-- Header -->
    <DashboardHeader
      :title="t('event_printout.title', 'Tournament Printouts')"
      :subtitle="t('event_printout.desc', { name: eventName || 'Event' })"
      icon="ph:printer-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('events.list.title', 'Event Saya'), to: '/dashboard/organizer/tournaments' },
        { label: t('event_printout.breadcrumb_printout', 'Printouts') }
      ]"
    />

    <!-- Filter Bar & Search -->
    <div class="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
      <!-- Category Tabs -->
      <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto shrink-0">
        <button
          v-for="tab in categoryTabs"
          :key="tab.id"
          @click="activeCategoryTab = tab.id"
          type="button"
          class="px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2"
          :class="activeCategoryTab === tab.id ? 'bg-white text-navy shadow-xs' : 'text-slate-500 hover:text-navy'">
          <span>{{ tab.label }}</span>
          <span
            class="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
            :class="activeCategoryTab === tab.id ? 'bg-navy text-white' : 'bg-slate-200 text-slate-600'">
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative w-full lg:max-w-md">
        <Icon icon="ph:magnifying-glass-bold" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('event_printout.search_placeholder', 'Search documents, scoresheets, stickers, brackets...')"
          class="w-full h-10 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-navy placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-primary focus:bg-white transition-all" />
      </div>
    </div>

    <!-- Empty Search State -->
    <div v-if="filteredSections.length === 0" class="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-3 shadow-xs">
      <div class="size-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <Icon icon="ph:file-search-bold" class="text-2xl text-navy" />
      </div>
      <p class="text-xs font-bold text-slate-500 max-w-sm mx-auto">
        {{ t('event_printout.empty_search', 'No documents match your search criteria.') }}
      </p>
    </div>

    <!-- Document Sections -->
    <div v-else class="space-y-8">
      <div v-for="section in filteredSections" :key="section.id" class="space-y-4">
        <!-- Section Title Header -->
        <div class="flex items-center gap-2 px-1">
          <Icon :icon="section.icon" class="text-xl text-navy" />
          <h2 class="text-base font-black text-navy">{{ section.title }}</h2>
          <span class="text-[11px] font-bold text-slate-400 font-mono">({{ section.items.length }})</span>
        </div>

        <!-- Grid of Document Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="item in section.items"
            :key="item.id"
            class="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
            
            <!-- Card Top: Icon, Badge, Title & Desc -->
            <div class="space-y-4">
              <div class="flex items-center justify-between gap-3">
                <div class="size-12 bg-slate-100 border border-slate-200 text-navy rounded-2xl flex items-center justify-center shadow-2xs shrink-0">
                  <Icon :icon="item.icon" class="text-2xl text-navy" />
                </div>
                <span v-if="item.badge" class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider font-mono bg-slate-100 text-navy border border-slate-200/80 shrink-0">
                  {{ item.badge }}
                </span>
              </div>

              <div>
                <h3 class="text-base font-black text-navy leading-snug">
                  {{ item.title }}
                </h3>
                <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {{ item.desc }}
                </p>
              </div>
            </div>

            <!-- Card Bottom Action -->
            <div class="pt-5 mt-5 border-t border-slate-100">
              <!-- Type 1: Multi-Format Quick Actions -->
              <div v-if="item.type === 'multi'" class="space-y-2">
                <div class="text-[10px] font-bold text-slate-400 mb-1.5">
                  {{ t('event_printout.format_options', 'Format Options:') }}
                </div>
                <div class="grid grid-cols-1 gap-1.5">
                  <button
                    v-for="subAction in item.subActions"
                    :key="subAction.key || subAction.label"
                    @click="subAction.action"
                    :disabled="!!downloadingKeys[subAction.key || subAction.label]"
                    type="button"
                    class="w-full h-8 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-slate-300 border border-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-between transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-left group/sub">
                    <span class="truncate mr-2">{{ subAction.label }}</span>
                    <Icon
                      v-if="downloadingKeys[subAction.key || subAction.label]"
                      icon="ph:spinner-gap-bold"
                      class="text-xs animate-spin text-navy shrink-0"
                    />
                    <Icon
                      v-else
                      icon="ph:download-simple-bold"
                      class="text-xs text-slate-400 group-hover/sub:text-navy transition-colors shrink-0"
                    />
                  </button>
                </div>
              </div>

              <!-- Type 2: Navigation to Configurable Tool -->
              <NuxtLink
                v-else-if="item.type === 'navigate'"
                :to="item.to"
                class="block w-full">
                <BaseButton
                  variant="outline"
                  :icon="item.actionIcon || 'ph:sliders-horizontal-bold'"
                  class="w-full font-bold text-xs h-10">
                  {{ item.actionLabel }}
                </BaseButton>
              </NuxtLink>

              <!-- Type 3: Single Direct Download PDF -->
              <BaseButton
                v-else-if="item.type === 'direct'"
                @click="item.action"
                :loading="!!downloadingKeys[item.id]"
                :loading-text="t('event_printout.downloading', 'Downloading...')"
                variant="primary"
                icon="ph:download-simple-bold"
                class="w-full font-bold text-xs h-10 shadow-sm shadow-primary/20">
                {{ t('event_printout.download_pdf', 'Download PDF') }}
              </BaseButton>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

const route = useRoute()
const config = useRuntimeConfig()
const { get } = useApi()
const { t } = useI18n()
const toast = useToast()

const eventId = route.params.id
const eventName = ref('')
const activeCategoryTab = ref('all')
const searchQuery = ref('')
const downloadingKeys = ref({})

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: computed(() => t('event_printout.title', 'Cetak Dokumen Turnamen') + ' - Archeris Dashboard')
})

const fetchEventData = async () => {
  try {
    const response = await get(`/tournaments/${eventId}`)
    const data = response?.event || response
    eventName.value = data?.name || ''
  } catch (error) {
    console.error('Failed to fetch event:', error)
    eventName.value = ''
  }
}

const apiBaseUrl = useApiBaseUrl()
const getApiBase = () => {
  return apiBaseUrl
}

const eventSlug = computed(() => {
  const name = eventName.value || (typeof eventId === 'string' ? eventId : '') || 'event'
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'event'
})

// Direct PDF Download without opening new tab
const downloadPdfFile = async (path, defaultFilename = 'document.pdf', key = path) => {
  if (downloadingKeys.value[key]) return
  downloadingKeys.value[key] = true

  try {
    const url = `${getApiBase()}${path}`
    const res = await fetch(url, { credentials: 'include' })
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

    let filename = defaultFilename
    const disposition = res.headers.get('content-disposition')
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (match && match[1]) {
        filename = match[1].replace(/['"]/g, '').trim()
      }
    }
    if (!filename.toLowerCase().endsWith('.pdf')) {
      filename += '.pdf'
    }

    const blob = await res.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  } catch (err) {
    console.error('Failed to download PDF:', err)
    toast.error(t('event_printout.err_download_failed', 'Gagal mengunduh berkas PDF. Pastikan koneksi ke server API aktif.'))
  } finally {
    downloadingKeys.value[key] = false
  }
}

// Document Definitions
const rawSections = computed(() => [
  {
    id: 'scoring',
    title: t('event_printout.section_scoring', 'Scoresheets & Brackets'),
    icon: 'ph:target-bold',
    items: [
      {
        id: 'scoresheet',
        badge: 'CONFIG',
        title: t('event_printout.scoresheet.title', 'Qualification Scoresheets'),
        desc: t('event_printout.scoresheet.desc', 'Print qualification scoresheets per session or per category with official layout.'),
        icon: 'ph:file-pdf-bold',
        type: 'navigate',
        actionLabel: t('event_printout.btn_configure_print', 'Configure & Print'),
        actionIcon: 'ph:gear-six-bold',
        to: `/dashboard/organizer/tournaments/${eventId}/printout/qualification`
      },
      {
        id: 'team_scoresheet',
        badge: 'WA TEAM',
        title: t('event_printout.team_scoresheet.title', 'Team & Mixed Team Scoresheets'),
        desc: t('event_printout.team_scoresheet.desc', 'Print elimination match scoresheets for 3-archer team (6 arrows/set) and 2-archer mixed team (4 arrows/set) World Archery / IanSeo standard.'),
        icon: 'ph:users-four-bold',
        type: 'multi',
        subActions: [
          {
            key: 'team_scoresheet_standard',
            label: t('event_printout.team_scoresheet.by_team', 'Team (3 Archers / 6 Arrows)'),
            action: () => downloadPdfFile(`/tournaments/${eventId}/elimination/scoresheet-team?type=team`, `${eventSlug.value}-team-elimination-scoresheet.pdf`, 'team_scoresheet_standard')
          },
          {
            key: 'team_scoresheet_mixed',
            label: t('event_printout.team_scoresheet.by_mixed', 'Mixed Team (2 Archers / 4 Arrows)'),
            action: () => downloadPdfFile(`/tournaments/${eventId}/elimination/scoresheet-team?type=mixed`, `${eventSlug.value}-mixed-team-elimination-scoresheet.pdf`, 'team_scoresheet_mixed')
          },
          {
            key: 'team_scoresheet_blank',
            label: t('event_printout.team_scoresheet.blank_template', 'Blank Team Template'),
            action: () => downloadPdfFile(`/tournaments/${eventId}/elimination/scoresheet-team?blank=1`, `${eventSlug.value}-team-scoresheet-blank.pdf`, 'team_scoresheet_blank')
          }
        ]
      },
      {
        id: 'elim_schedule',
        badge: 'C58',
        title: t('event_printout.elim_schedule.title', 'Elimination Match Schedule [C58]'),
        desc: t('event_printout.elim_schedule.desc', 'Detailed elimination match schedule (IanSeo ORIS C58 standard) listing match times, targets, rounds, and pairings.'),
        icon: 'ph:calendar-check-bold',
        type: 'direct',
        action: () => downloadPdfFile(`/tournaments/${eventId}/elimination/schedule/printout`, `${eventSlug.value}-elimination-match-schedule-C58.pdf`, 'elim_schedule')
      },
      {
        id: 'elim_brackets_vector',
        badge: 'C75',
        title: t('event_printout.elim_brackets_vector.title', 'Elimination Bracket Vector PDF [C75A/C]'),
        desc: t('event_printout.elim_brackets_vector.desc', 'Official IanSeo A4 Landscape vector tournament tree brackets with match scores, set points, and bronze finals.'),
        icon: 'ph:tree-structure-bold',
        type: 'direct',
        action: () => downloadPdfFile(`/tournaments/${eventId}/elimination/brackets/printout`, `${eventSlug.value}-elimination-brackets-C75.pdf`, 'elim_brackets_vector')
      }
    ]
  },
  {
    id: 'entries',
    title: t('event_printout.section_entries', 'Entries & Target Start Lists'),
    icon: 'ph:users-three-bold',
    items: [
      {
        id: 'participants',
        badge: 'C32A',
        title: t('event_printout.participants.title', 'Participant Lists [C32A]'),
        desc: t('event_printout.participants.desc', 'Participant rosters and attendance lists by alphabet, club, or competition category.'),
        icon: 'ph:address-book-bold',
        type: 'multi',
        subActions: [
          {
            key: 'participants_alphabetical',
            label: t('event_printout.participants.by_alphabet', '[C32A] Alphabetical Order (A-Z)'),
            action: () => downloadPdfFile(`/tournaments/${eventId}/participants/printout?type=alphabetical`, `${eventSlug.value}-participants-alphabetical-C32A.pdf`, 'participants_alphabetical')
          },
          {
            key: 'participants_club',
            label: t('event_printout.participants.by_club', '[C30] By Club / Contingent'),
            action: () => downloadPdfFile(`/tournaments/${eventId}/participants/printout?type=by-club`, `${eventSlug.value}-participants-by-club-C30.pdf`, 'participants_club')
          },
          {
            key: 'participants_category',
            label: t('event_printout.participants.by_category', '[C32A] By Competition Category'),
            action: () => downloadPdfFile(`/tournaments/${eventId}/participants/printout?type=by-category`, `${eventSlug.value}-participants-by-category-C32A.pdf`, 'participants_category')
          }
        ]
      },
      {
        id: 'entries_by_club',
        badge: 'C30',
        title: t('event_printout.entries_by_club.title', 'Number of Entries by Club [C30]'),
        desc: t('event_printout.entries_by_club.desc', 'Official quota summary (Men, Women, Total) and dossier list of registered athletes per club / contingent.'),
        icon: 'ph:buildings-bold',
        type: 'direct',
        action: () => downloadPdfFile(`/tournaments/${eventId}/entries/by-club/printout`, `${eventSlug.value}-entries-by-club-C30.pdf`, 'entries_by_club')
      },
      {
        id: 'start_list',
        badge: 'C32C',
        title: t('event_printout.start_list.title', 'Target Start List [C32C]'),
        desc: t('event_printout.start_list.desc', 'Target board assignment roster (1A, 1B, 1C, 1D) grouped by qualification session.'),
        icon: 'ph:list-numbers-bold',
        type: 'direct',
        action: () => downloadPdfFile(`/tournaments/${eventId}/qualification/start-list/printout`, `${eventSlug.value}-qualification-start-list-C32C.pdf`, 'start_list')
      },
      {
        id: 'elim_start_list',
        badge: 'C51A',
        title: t('event_printout.elim_start_list.title', 'Elimination Target Start List [C51A]'),
        desc: t('event_printout.elim_start_list.desc', 'Target butt allocations and match schedule pairings for elimination rounds.'),
        icon: 'ph:crosshair-bold',
        type: 'direct',
        action: () => downloadPdfFile(`/tournaments/${eventId}/elimination/start-list/printout`, `${eventSlug.value}-elimination-start-list-C51A.pdf`, 'elim_start_list')
      },
      {
        id: 'target_labels',
        badge: 'LABELS',
        title: t('event_printout.target_labels.title', 'Target & Bow Labels'),
        desc: t('event_printout.target_labels.desc', 'Print adhesive stickers with target number, archer name, and club for target faces and bow stands.'),
        icon: 'ph:tag-bold',
        type: 'direct',
        action: () => downloadPdfFile(`/tournaments/${eventId}/targets/labels/printout`, `${eventSlug.value}-target-labels.pdf`, 'target_labels')
      }
    ]
  },
  {
    id: 'results',
    title: t('event_printout.section_results', 'Official Results & Medal Standings'),
    icon: 'ph:trophy-bold',
    items: [
      {
        id: 'qual_results',
        badge: 'C73A/C',
        title: t('event_printout.qual_results.title', 'Official Qualification Results [C73A/C]'),
        desc: t('event_printout.qual_results.desc', 'Official qualification results book with rankings, 10s, Xs, and signature lines for Technical Delegate and Chief Judge.'),
        icon: 'ph:file-text-bold',
        type: 'multi',
        subActions: [
          {
            key: 'qual_results_indiv',
            label: t('event_printout.qual_results.by_individual', '[C73A] Individual Results'),
            action: () => downloadPdfFile(`/tournaments/${eventId}/qualification/results/printout`, `${eventSlug.value}-individual-qualification-results-C73A.pdf`, 'qual_results_indiv')
          },
          {
            key: 'qual_results_team',
            label: t('event_printout.qual_results.by_team', '[C73C] Team Results'),
            action: () => downloadPdfFile(`/tournaments/${eventId}/qualification/results-team/printout?type=team`, `${eventSlug.value}-team-qualification-results-C73C.pdf`, 'qual_results_team')
          },
          {
            key: 'qual_results_mix',
            label: t('event_printout.qual_results.by_mixed', '[C73C] Mixed Team Results'),
            action: () => downloadPdfFile(`/tournaments/${eventId}/qualification/results-team/printout?type=mixed`, `${eventSlug.value}-mixed-team-qualification-results-C73C.pdf`, 'qual_results_mix')
          }
        ]
      },
      {
        id: 'medals',
        badge: 'C95',
        title: t('event_printout.medals.title', 'Medal Standings [C95]'),
        desc: t('event_printout.medals.desc', 'Official medal standings table (Gold, Silver, Bronze) Olympic World Archery standard by club / contingent.'),
        icon: 'ph:medal-bold',
        type: 'direct',
        action: () => downloadPdfFile(`/tournaments/${eventId}/results/medals/printout`, `${eventSlug.value}-medal-standings-C95.pdf`, 'medals')
      },
      {
        id: 'medallists',
        badge: 'C93',
        title: t('event_printout.medallists.title', 'Medallists by Event [C93]'),
        desc: t('event_printout.medallists.desc', 'List of Gold, Silver, and Bronze medal winners for each competition division and category.'),
        icon: 'ph:crown-bold',
        type: 'direct',
        action: () => downloadPdfFile(`/tournaments/${eventId}/results/medallists/printout`, `${eventSlug.value}-medallists-list-C93.pdf`, 'medallists')
      },
      {
        id: 'final_rankings',
        badge: 'C76A/B',
        title: t('event_printout.final_rankings.title', 'Final Rankings [C76A/B]'),
        desc: t('event_printout.final_rankings.desc', 'Official final ranking list of all participants following qualification and elimination rounds.'),
        icon: 'ph:ranking-bold',
        type: 'multi',
        subActions: [
          {
            key: 'final_rank_indiv',
            label: t('event_printout.final_rankings.by_individual', '[C76A] Individual Final Rankings'),
            action: () => downloadPdfFile(`/tournaments/${eventId}/results/final-ranking/printout?type=individual`, `${eventSlug.value}-individual-final-ranking-C76A.pdf`, 'final_rank_indiv')
          },
          {
            key: 'final_rank_team',
            label: t('event_printout.final_rankings.by_team', '[C76B] Team Final Rankings'),
            action: () => downloadPdfFile(`/tournaments/${eventId}/results/final-ranking/printout?type=team`, `${eventSlug.value}-team-final-ranking-C76B.pdf`, 'final_rank_team')
          }
        ]
      },
      {
        id: 'statistics',
        badge: 'STATS',
        title: t('event_printout.statistics.title', 'Tournament Statistics'),
        desc: t('event_printout.statistics.desc', 'Statistical breakdown of participant counts per class, division, and club entries.'),
        icon: 'ph:chart-pie-slice-bold',
        type: 'multi',
        subActions: [
          {
            key: 'stats_classes',
            label: t('event_printout.statistics.classes_title', 'Classes & Divisions Statistics'),
            action: () => downloadPdfFile(`/tournaments/${eventId}/participants/statistics-classes`, `${eventSlug.value}-statistics-classes-divisions.pdf`, 'stats_classes')
          },
          {
            key: 'stats_clubs',
            label: t('event_printout.statistics.clubs_title', 'Clubs & Contingents Statistics'),
            action: () => downloadPdfFile(`/tournaments/${eventId}/participants/statistics-clubs`, `${eventSlug.value}-statistics-clubs-contingents.pdf`, 'stats_clubs')
          }
        ]
      }
    ]
  },
  {
    id: 'schedule_program',
    title: t('event_printout.section_schedule', 'Competition Schedule & Program'),
    icon: 'ph:calendar-bold',
    items: [
      {
        id: 'schedule_program',
        badge: 'C08',
        title: t('event_printout.schedule.title', 'Competition Schedule & Program [C08]'),
        desc: t('event_printout.schedule.desc', 'Official tournament schedule and daily program per competition day and session.'),
        icon: 'ph:calendar-bold',
        type: 'direct',
        action: () => downloadPdfFile(`/tournaments/${eventId}/schedule/printout`, `${eventSlug.value}-competition-schedule-program-C08.pdf`, 'schedule_program')
      }
    ]
  }
])

// Filtered Computed Property
const filteredSections = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  return rawSections.value
    .filter(section => activeCategoryTab.value === 'all' || section.id === activeCategoryTab.value)
    .map(section => {
      let items = [...section.items]
      if (query) {
        items = items.filter(item =>
          item.title.toLowerCase().includes(query) ||
          item.desc.toLowerCase().includes(query)
        )
      }
      return { ...section, items }
    })
    .filter(section => section.items.length > 0)
})

// Category Tabs Count
const categoryTabs = computed(() => {
  const allCount = rawSections.value.reduce((acc, s) => acc + s.items.length, 0)
  return [
    { id: 'all', label: t('event_printout.tab_all', 'All Documents'), count: allCount },
    ...rawSections.value.map(s => ({
      id: s.id,
      label: s.title.split('&')[0].trim(),
      count: s.items.length
    }))
  ]
})

onMounted(() => {
  fetchEventData()
})
</script>

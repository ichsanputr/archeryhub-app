<template>
  <div class="flex flex-col gap-6 pb-16 font-body text-navy antialiased">
    <!-- Header -->
    <DashboardHeader
      :title="t('event_printout.title', 'Cetak Dokumen Event')"
      :subtitle="t('event_printout.desc', { name: eventName || 'Event' })"
      icon="ph:printer-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('events.list.title', 'Event Saya'), to: '/dashboard/organizer/tournaments' },
        { label: t('event_printout.breadcrumb_printout', 'Cetak Dokumen') }
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
          :placeholder="t('event_printout.search_placeholder', 'Cari dokumen, scoresheet, stiker, bagan...')"
          class="w-full h-10 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-navy placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-primary focus:bg-white transition-all" />
      </div>
    </div>

    <!-- Empty Search State -->
    <div v-if="filteredSections.length === 0" class="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-3 shadow-xs">
      <div class="size-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <Icon icon="ph:file-search-bold" class="text-2xl text-navy" />
      </div>
      <p class="text-xs font-bold text-slate-500 max-w-sm mx-auto">
        {{ t('event_printout.empty_search', 'Tidak ada dokumen yang sesuai dengan pencarian Anda.') }}
      </p>
    </div>

    <!-- Document Sections -->
    <div v-else class="space-y-8">
      <div v-for="section in filteredSections" :key="section.id" class="space-y-4">
        <!-- Section Title Header -->
        <div class="flex items-center gap-2 px-1">
          <Icon :icon="section.icon" class="text-xl text-primary" />
          <h2 class="text-base font-black text-navy">{{ section.title }}</h2>
          <span class="text-[11px] font-bold text-slate-400 font-mono">({{ section.items.length }})</span>
        </div>

        <!-- Grid of Document Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="item in section.items"
            :key="item.id"
            class="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
            
            <!-- Card Top: Icon, Title & Desc -->
            <div class="space-y-4">
              <div class="size-12 bg-primary text-btn-text rounded-2xl flex items-center justify-center shadow-xs shrink-0">
                <Icon :icon="item.icon" class="text-2xl" />
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
              <!-- Type 1: Multi-Format Quick Actions (Prioritized) -->
              <div v-if="item.type === 'multi'" class="space-y-2">
                <div class="text-[10px] font-bold text-slate-400 mb-1.5">
                  {{ t('event_printout.badge_multi_format', 'Pilihan Format:') }}
                </div>
                <div class="grid grid-cols-1 gap-1.5">
                  <button
                    v-for="subAction in item.subActions"
                    :key="subAction.label"
                    @click="subAction.action"
                    :disabled="!!downloadingKeys[subAction.key || subAction.label]"
                    type="button"
                    class="w-full h-8 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-slate-300 border border-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-between transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    <span>{{ subAction.label }}</span>
                    <Icon
                      v-if="downloadingKeys[subAction.key || subAction.label]"
                      icon="ph:spinner-gap-bold"
                      class="text-xs animate-spin text-primary"
                    />
                    <Icon
                      v-else
                      icon="ph:download-simple-bold"
                      class="text-xs text-slate-400"
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
                :loading-text="t('event_printout.downloading', 'Mengunduh PDF...')"
                variant="primary"
                icon="ph:download-simple-bold"
                class="w-full font-bold text-xs h-10 shadow-sm shadow-primary/20">
                {{ t('event_printout.download_pdf', 'Unduh PDF') }}
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

const route = useRoute()
const config = useRuntimeConfig()
const { get } = useApi()
const { t } = useI18n()

const eventId = route.params.id
const eventName = ref('')
const activeCategoryTab = ref('all')
const searchQuery = ref('')
const downloadingKeys = ref({})

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: computed(() => t('event_printout.page_title', 'Cetak Dokumen - Event'))
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

const getApiBase = () => {
  return config.public.apiBase || 'http://localhost:8001'
}

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
  } finally {
    downloadingKeys.value[key] = false
  }
}

// Document Definitions
const rawSections = computed(() => [
  {
    id: 'scoring',
    title: t('event_printout.section_scoring', 'Lembar Nilai & Bagan'),
    icon: 'ph:target-bold',
    items: [
      {
        id: 'scoresheet',
        title: t('event_printout.scoresheet.title', 'Scoresheet Kualifikasi'),
        desc: t('event_printout.scoresheet.desc', 'Cetak lembar skor kualifikasi per sesi atau per kategori dengan format standar resmi.'),
        icon: 'ph:file-pdf-bold',
        type: 'navigate',
        actionLabel: t('event_printout.btn_configure_print', 'Atur Parameter Cetak'),
        actionIcon: 'ph:gear-six-bold',
        to: `/dashboard/organizer/tournaments/${eventId}/printout/qualification`
      },
      {
        id: 'elimination',
        title: t('event_printout.elimination.title', 'Bagan Eliminasi'),
        desc: t('event_printout.elimination.desc', 'Pohon bagan eliminasi A3/A4 untuk ditempel pada papan pengumuman venue.'),
        icon: 'mdi:bracket',
        type: 'navigate',
        actionLabel: t('event_printout.btn_view_bracket', 'Lihat & Cetak Bagan'),
        actionIcon: 'ph:tree-structure-bold',
        to: `/dashboard/organizer/tournaments/${eventId}/printout/elimination`
      }
    ]
  },
  {
    id: 'entries',
    title: t('event_printout.section_entries', 'Daftar Peserta & Penempatan Bantalan'),
    icon: 'ph:users-three-bold',
    items: [
      {
        id: 'participants',
        title: t('event_printout.participants.title', 'Daftar Peserta Event'),
        desc: t('event_printout.participants.desc', 'Daftar hadir dan rekap peserta event per abjad, per klub/kontingen, atau per kategori lomba.'),
        icon: 'ph:address-book-bold',
        type: 'multi',
        subActions: [
          {
            key: 'participants_alphabetical',
            label: t('event_printout.participants.by_alphabet', 'Berdasarkan Abjad (A-Z)'),
            action: () => downloadPdfFile(`/tournaments/${eventId}/participants/printout?type=alphabetical`, `${eventName.value || 'event'}-peserta-abjad.pdf`, 'participants_alphabetical')
          },
          {
            key: 'participants_club',
            label: t('event_printout.participants.by_club', 'Berdasarkan Klub / Kontingen'),
            action: () => downloadPdfFile(`/tournaments/${eventId}/participants/printout?type=by-club`, `${eventName.value || 'event'}-peserta-klub.pdf`, 'participants_club')
          },
          {
            key: 'participants_category',
            label: t('event_printout.participants.by_category', 'Berdasarkan Kategori Lomba'),
            action: () => downloadPdfFile(`/tournaments/${eventId}/participants/printout?type=by-category`, `${eventName.value || 'event'}-peserta-kategori.pdf`, 'participants_category')
          }
        ]
      },
      {
        id: 'start_list',
        title: t('event_printout.start_list.title', 'Start List Bantalan'),
        desc: t('event_printout.start_list.desc', 'Daftar penempatan seluruh pemanah pada tiap target bantalan (1A, 1B, 1C, 1D) per sesi kualifikasi.'),
        icon: 'ph:list-numbers-bold',
        type: 'direct',
        action: () => downloadPdfFile(`/tournaments/${eventId}/qualification/start-list/printout`, `${eventName.value || 'event'}-start-list.pdf`, 'start_list')
      },
      {
        id: 'target_labels',
        title: t('event_printout.target_labels.title', 'Label Stiker Bantalan'),
        desc: t('event_printout.target_labels.desc', 'Cetak label stiker nomor bantalan target, nama atlet, dan klub untuk ditempel pada bantalan atau dudukan busur.'),
        icon: 'ph:tag-bold',
        type: 'direct',
        action: () => downloadPdfFile(`/tournaments/${eventId}/targets/labels/printout`, `${eventName.value || 'event'}-label-target.pdf`, 'target_labels')
      }
    ]
  },
  {
    id: 'results',
    title: t('event_printout.section_results', 'Hasil Pertandingan & Rekap Medali'),
    icon: 'ph:trophy-bold',
    items: [
      {
        id: 'statistics',
        title: t('event_printout.statistics.title', 'Statistik Event'),
        desc: t('event_printout.statistics.desc', 'Rekapitulasi statistik jumlah peserta per kelas, divisi, serta kontribusi per klub.'),
        icon: 'ph:chart-pie-slice-bold',
        type: 'multi',
        subActions: [
          {
            key: 'stats_classes',
            label: t('event_printout.statistics.classes_title', 'Statistik Kelas & Divisi'),
            action: () => downloadPdfFile(`/tournaments/${eventId}/participants/statistics-classes`, `${eventName.value || 'event'}-statistik-kelas.pdf`, 'stats_classes')
          },
          {
            key: 'stats_clubs',
            label: t('event_printout.statistics.clubs_title', 'Statistik Klub & Kontingen'),
            action: () => downloadPdfFile(`/tournaments/${eventId}/participants/statistics-clubs`, `${eventName.value || 'event'}-statistik-klub.pdf`, 'stats_clubs')
          }
        ]
      },
      {
        id: 'qual_results',
        title: t('event_printout.qual_results.title', 'Hasil Kualifikasi Resmi'),
        desc: t('event_printout.qual_results.desc', 'Buku hasil skor kualifikasi resmi per kategori lengkap dengan peringkat, 10s, Xs, dan blok tanda tangan juri (Chief Judge/TD).'),
        icon: 'ph:file-text-bold',
        type: 'direct',
        action: () => downloadPdfFile(`/tournaments/${eventId}/qualification/results/printout`, `${eventName.value || 'event'}-hasil-kualifikasi.pdf`, 'qual_results')
      },
      {
        id: 'medals',
        title: t('event_printout.medals.title', 'Klasemen Medali & Juara'),
        desc: t('event_printout.medals.desc', 'Tabel perolehan medali (Emas, Perak, Perunggu) per klub/kontingen serta daftar juara tiap nomor lomba.'),
        icon: 'ph:medal-bold',
        type: 'direct',
        action: () => downloadPdfFile(`/tournaments/${eventId}/results/medals/printout`, `${eventName.value || 'event'}-klasemen-medali.pdf`, 'medals')
      }
    ]
  }
])

// Filtered Computed Property (Cards with sub actions/options prioritized first)
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
      // Prioritize cards that have sub actions or sub navigation
      items.sort((a, b) => {
        const aScore = (a.subActions?.length || 0) > 0 || a.type === 'multi' ? 2 : (a.type === 'navigate' ? 1 : 0)
        const bScore = (b.subActions?.length || 0) > 0 || b.type === 'multi' ? 2 : (b.type === 'navigate' ? 1 : 0)
        return bScore - aScore
      })
      return { ...section, items }
    })
    .filter(section => section.items.length > 0)
})

// Category Tabs Count
const categoryTabs = computed(() => {
  const allCount = rawSections.value.reduce((acc, s) => acc + s.items.length, 0)
  return [
    { id: 'all', label: t('event_printout.tab_all', 'Semua Dokumen'), count: allCount },
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

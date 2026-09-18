<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <DashboardHeader
      :title="t('dashboard.reports.performance_title')"
      :subtitle="t('dashboard.reports.performance_desc')"
      icon="ph:trend-up-bold"
      :back-to="getBackLink()"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('dashboard.reports.title', 'Laporan'), to: '/dashboard/organizer/reports' },
        { label: t('dashboard.reports.performance_title') }
      ]"
    >
      <template #actions>
        <BaseButton variant="primary" icon="ph:download-simple-bold" class="h-11 px-5 text-xs font-black" @click="handleExportExcel">
          {{ t('dashboard.reports.export_excel', 'Ekspor Excel') }}
        </BaseButton>
      </template>
    </DashboardHeader>

    <!-- Filters Panel -->
    <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div class="flex items-center gap-2 pb-3 border-b border-gray-100">
        <Icon icon="ph:funnel-bold" class="text-primary text-lg" />
        <h3 class="text-sm font-black text-navy-dark">{{ t('dashboard.reports.report_filters', 'Filter Laporan') }}</h3>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Start Date Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 tracking-wider">{{ t('dashboard.reports.start_date') }}</label>
          <BaseDatePicker v-model="filters.start_date" :placeholder="t('dashboard.reports.start_date')" />
        </div>

        <!-- End Date Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 tracking-wider">{{ t('dashboard.reports.end_date') }}</label>
          <BaseDatePicker v-model="filters.end_date" :placeholder="t('dashboard.reports.end_date')" />
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <BaseButton variant="ghost" class="h-9 px-4 text-xs font-black" @click="resetFilters">
          {{ t('dashboard.reports.reset_filters') }}
        </BaseButton>
        <BaseButton variant="primary" class="h-9 px-5 text-xs font-black shadow-lg shadow-primary/10" @click="applyFilters">
          {{ t('dashboard.reports.apply_filters') }}
        </BaseButton>
      </div>
    </div>

    <!-- Stats summary grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <StatCard :title="t('dashboard.reports.total_events_organized', 'Total Turnamen Digelar')" :value="stats.events_performance?.length || 0" icon="ph:trophy-bold" color="primary" />
      <StatCard :title="t('dashboard.reports.total_participants_registered', 'Total Atlet Terdaftar')" :value="stats.total_participants || 0" icon="ph:users-three-bold" color="success" />
      <StatCard :title="t('dashboard.reports.avg_fill_rate', 'Rata-rata Keterisian Kuota')" :value="Math.round(stats.average_fill_rate || 0) + '%'" icon="ph:chart-pie-bold" color="primary" />
    </div>

    <!-- Event Performance Table -->
    <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div class="p-5 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-navy-dark font-black text-sm flex items-center gap-2">
          <Icon icon="ph:list-dashes-bold" class="text-primary" />
          {{ t('dashboard.reports.organized_events_fill_rates', 'Tingkat Keterisian Kuota Turnamen') }}
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
            <tr>
              <th @click="toggleSort('name')" class="px-6 py-4 cursor-pointer hover:text-navy transition-colors select-none">
                <div class="flex items-center gap-1.5">
                  <span>{{ t('dashboard.reports.event_name') }}</span>
                  <Icon v-if="sortBy === 'name'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                </div>
              </th>
              <th @click="toggleSort('status')" class="px-6 py-4 cursor-pointer hover:text-navy transition-colors select-none">
                <div class="flex items-center gap-1.5">
                  <span>{{ t('dashboard.reports.status') }}</span>
                  <Icon v-if="sortBy === 'status'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                </div>
              </th>
              <th @click="toggleSort('date')" class="px-6 py-4 cursor-pointer hover:text-navy transition-colors select-none">
                <div class="flex items-center gap-1.5">
                  <span>{{ t('dashboard.reports.event_dates') }}</span>
                  <Icon v-if="sortBy === 'date'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                </div>
              </th>
              <th @click="toggleSort('categories')" class="px-6 py-4 cursor-pointer hover:text-navy transition-colors select-none text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <span>{{ t('dashboard.reports.categories_count') }}</span>
                  <Icon v-if="sortBy === 'categories'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                </div>
              </th>
              <th @click="toggleSort('participants')" class="px-6 py-4 cursor-pointer hover:text-navy transition-colors select-none">
                <div class="flex items-center gap-1.5">
                  <span>{{ t('dashboard.reports.registrants_capacity') }}</span>
                  <Icon v-if="sortBy === 'participants'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                </div>
              </th>
              <th @click="toggleSort('fill_rate')" class="px-6 py-4 cursor-pointer hover:text-navy transition-colors select-none">
                <div class="flex items-center gap-1.5">
                  <span>{{ t('dashboard.reports.quota_fill_rate') }}</span>
                  <Icon v-if="sortBy === 'fill_rate'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 font-medium">
            <tr v-for="e in sortedEventsPerformance" :key="e.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 text-navy-dark font-bold truncate max-w-xs capitalize">{{ e.name.toLowerCase() }}</td>
              <td class="px-6 py-4">
                <span 
                  :class="[
                    e.status === 'published' ? 'bg-green-50 text-green-600 border-green-200' : '',
                    e.status === 'active' ? 'bg-blue-50 text-blue-600 border-blue-200' : '',
                    e.status === 'draft' ? 'bg-slate-50 text-slate-500 border-slate-200' : '',
                  ]"
                  class="px-2 py-0.5 rounded-full border text-[10px] font-black tracking-wider capitalize"
                >
                  {{ e.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-500 font-semibold font-mono">{{ formatDateRange(e.start_date, e.end_date) }}</td>
              <td class="px-6 py-4 text-gray-500 font-bold text-center">{{ e.total_categories }}</td>
              <td class="px-6 py-4 text-navy-dark font-bold font-mono">
                {{ e.total_participants }} / {{ e.total_capacity > 0 ? e.total_capacity : t('dashboard.reports.unlimited', 'Tanpa Batas') }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-24 bg-gray-100 h-2 rounded-full overflow-hidden shrink-0">
                    <div 
                      :class="e.fill_rate >= 100 ? 'bg-green-500' : 'bg-primary'"
                      class="h-full rounded-full" 
                      :style="{ width: Math.min(e.fill_rate, 100) + '%' }"
                    ></div>
                  </div>
                  <span class="text-navy-dark font-bold font-mono text-[10px]">{{ Math.round(e.fill_rate) }}%</span>
                </div>
              </td>
            </tr>
            <tr v-if="!sortedEventsPerformance.length">
              <td colspan="6" class="text-center py-10 text-gray-400 font-bold">{{ t('dashboard.reports.no_events_performance', 'Tidak ada data performa turnamen untuk filter yang dipilih.') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
useHead({ title: computed(() => (t ? t('dashboard.reports.performance_title', 'Performa Turnamen') : 'Performa Turnamen') + ' - Archeris Dashboard') })

const route = useRoute()
const api = useApi()

const sortBy = ref('fill_rate')
const sortOrder = ref('desc')

const toggleSort = (column) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'asc'
  }
}

const stats = ref({
  status_summary: [],
  events_performance: [],
  average_fill_rate: 0,
  total_capacity: 0,
  total_participants: 0
})

const sortedEventsPerformance = computed(() => {
  const list = stats.value?.events_performance || []
  const dir = sortOrder.value === 'asc' ? 1 : -1
  return [...list].sort((a, b) => {
    if (sortBy.value === 'name') {
      return dir * (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' })
    }
    if (sortBy.value === 'status') {
      return dir * (a.status || '').localeCompare(b.status || '')
    }
    if (sortBy.value === 'date') {
      const tA = new Date(a.start_date || 0).getTime()
      const tB = new Date(b.start_date || 0).getTime()
      return dir * (tA - tB)
    }
    if (sortBy.value === 'categories') {
      return dir * ((a.total_categories || 0) - (b.total_categories || 0))
    }
    if (sortBy.value === 'participants') {
      return dir * ((a.total_participants || 0) - (b.total_participants || 0))
    }
    if (sortBy.value === 'fill_rate') {
      return dir * ((a.fill_rate || 0) - (b.fill_rate || 0))
    }
    return 0
  })
})

const filters = reactive({
  start_date: '',
  end_date: ''
})

onMounted(() => {
  fetchReportData()
})

const fetchReportData = async () => {
  try {
    const queryParams = new URLSearchParams()
    if (filters.start_date) queryParams.append('start_date', filters.start_date)
    if (filters.end_date) queryParams.append('end_date', filters.end_date)

    const res = await api.get(`/organizers/reports/performance?${queryParams.toString()}`)
    if (res) {
      stats.value = res
    }
  } catch (err) {
    console.error('failed to fetch performance report:', err)
  }
}

const getBackLink = () => {
  return route.query.event_id ? `/dashboard/organizer/reports?event_id=${route.query.event_id}` : '/dashboard/organizer/reports'
}

const applyFilters = () => {
  fetchReportData()
}

const resetFilters = () => {
  filters.start_date = ''
  filters.end_date = ''
  fetchReportData()
}

import { exportToExcel } from '~/utils/exportExcel'

const handleExportExcel = () => {
  const list = stats.value.events_performance || []
  const data = list.map((p, idx) => ({
    no: idx + 1,
    event_name: p.name || p.event_name || '-',
    date_range: formatDateRange(p.start_date, p.end_date),
    quota: p.quota || p.capacity || 0,
    registered: p.participants_count || p.registered_count || p.participants || 0,
    fill_rate: `${p.fill_rate || 0}%`,
    status: p.status || '-'
  }))
  exportToExcel(
    'Laporan_Performa_Event_Archeris',
    [
      { key: 'no', label: 'No' },
      { key: 'event_name', label: 'Nama Event' },
      { key: 'date_range', label: 'Jadwal Event' },
      { key: 'quota', label: 'Kapasitas Kuota' },
      { key: 'registered', label: 'Jumlah Terdaftar' },
      { key: 'fill_rate', label: 'Tingkat Keterisian (%)' },
      { key: 'status', label: 'Status Event' }
    ],
    data
  )
}

const formatDateRange = (startStr, endStr) => {
  if (!startStr) return '-'
  const start = new Date(startStr)
  const end = endStr ? new Date(endStr) : null
  const opt = { day: '2-digit', month: 'short' }
  const startF = start.toLocaleDateString('id-ID', opt)
  const endF = end ? end.toLocaleDateString('id-ID', opt) : ''
  return endF ? `${startF} - ${endF}` : startF
}
</script>

<style scoped>
.text-navy-dark {
  color: #1e293b;
}
</style>

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
        { label: t('dashboard.reports.title'), to: '/dashboard/organizer/reports' },
        { label: t('dashboard.reports.performance_title') }
      ]"
    >
      <template #actions>
        <BaseButton variant="primary" icon="ph:download-simple-bold" class="h-11 px-5 text-xs font-black" @click="handleExportExcel">
          {{ t('dashboard.reports.export_excel') }}
        </BaseButton>
      </template>
    </DashboardHeader>

    <!-- Filters Panel -->
    <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div class="flex items-center gap-2 pb-3 border-b border-gray-100">
        <Icon icon="ph:funnel-bold" class="text-primary text-lg" />
        <h3 class="text-sm font-black text-navy-dark">{{ t('dashboard.reports.report_filters') }}</h3>
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
      <StatCard :title="t('dashboard.reports.total_events_organized')" :value="stats.events_performance?.length || 0" icon="ph:trophy-bold" color="primary" />
      <StatCard :title="t('dashboard.reports.total_participants_registered')" :value="stats.total_participants || 0" icon="ph:users-three-bold" color="success" />
      <StatCard :title="t('dashboard.reports.avg_fill_rate')" :value="Math.round(stats.average_fill_rate || 0) + '%'" icon="ph:chart-pie-bold" color="primary" />
    </div>

    <!-- Event Performance Table with DashboardDataTable -->
    <DashboardDataTable
      :items="stats.events_performance || []"
      :headers="headers"
      :searchable="true"
      :search-placeholder="t('dashboard.reports.search_placeholder', 'Cari event...')"
      :title="t('dashboard.reports.organized_events_fill_rates')"
      :subtitle="t('dashboard.reports.total_events_count', '{n} Event', { n: (stats.events_performance || []).length })"
      :icon="'ph:list-dashes-bold'"
      :default-page-size="10"
    >
      <template #item-name="{ item }">
        <span class="text-navy-dark font-bold capitalize text-xs">{{ (item.name || '').toLowerCase() }}</span>
      </template>

      <template #item-status="{ item }">
        <span 
          :class="[
            item.status === 'published' ? 'bg-green-50 text-green-600 border-green-200' : '',
            item.status === 'active' ? 'bg-blue-50 text-blue-600 border-blue-200' : '',
            item.status === 'draft' ? 'bg-slate-50 text-slate-500 border-slate-200' : '',
          ]"
          class="px-2 py-0.5 rounded-full border text-[10px] font-black tracking-wider capitalize"
        >
          {{ item.status }}
        </span>
      </template>

      <template #item-date="{ item }">
        <span class="text-gray-500 font-semibold font-mono text-xs">{{ formatDateRange(item.start_date, item.end_date) }}</span>
      </template>

      <template #item-total_categories="{ item }">
        <span class="text-gray-500 font-bold text-xs">{{ item.total_categories }}</span>
      </template>

      <template #item-participants="{ item }">
        <span class="text-navy-dark font-bold font-mono text-xs">
          {{ item.total_participants }} / {{ item.total_capacity > 0 ? item.total_capacity : t('dashboard.reports.unlimited') }}
        </span>
      </template>

      <template #item-fill_rate="{ item }">
        <div class="flex items-center gap-3">
          <div class="w-24 bg-gray-100 h-2 rounded-full overflow-hidden shrink-0">
            <div 
              :class="item.fill_rate >= 100 ? 'bg-green-500' : 'bg-primary'"
              class="h-full rounded-full" 
              :style="{ width: Math.min(item.fill_rate, 100) + '%' }"
            ></div>
          </div>
          <span class="text-navy-dark font-bold font-mono text-[10px]">{{ Math.round(item.fill_rate) }}%</span>
        </div>
      </template>

      <template #empty>
        <div class="text-center py-10 text-gray-400 font-bold">{{ t('dashboard.reports.no_events_performance') }}</div>
      </template>
    </DashboardDataTable>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useI18n } from 'vue-i18n'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'
import { exportToExcel } from '~/utils/exportExcel'

definePageMeta({
  layout: 'dashboard'
})

const { t, locale } = useI18n()
useHead({ title: computed(() => `${t('dashboard.reports.performance_title')} - Archeris Dashboard`) })

const route = useRoute()
const api = useApi()

const headers = computed(() => [
  { key: 'name', label: t('dashboard.reports.event_name', 'Nama Event'), sortable: true },
  { key: 'status', label: t('dashboard.reports.status', 'Status'), sortable: true },
  { key: 'date', label: t('dashboard.reports.event_dates', 'Jadwal Event'), sortable: true },
  { key: 'total_categories', label: t('dashboard.reports.categories_count', 'Kategori'), align: 'center', sortable: true },
  { key: 'participants', label: t('dashboard.reports.registrants_capacity', 'Terdaftar / Kuota'), sortable: true },
  { key: 'fill_rate', label: t('dashboard.reports.quota_fill_rate', 'Keterisian'), sortable: true }
])

const stats = ref({
  status_summary: [],
  events_performance: [],
  average_fill_rate: 0,
  total_capacity: 0,
  total_participants: 0
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

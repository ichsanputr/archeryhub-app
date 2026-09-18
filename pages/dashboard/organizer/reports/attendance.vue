<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <DashboardHeader
      :title="t('dashboard.reports.attendance_title')"
      :subtitle="t('dashboard.reports.attendance_desc')"
      icon="ph:users-three-bold"
      :back-to="getBackLink()"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('dashboard.reports.title', 'Laporan'), to: '/dashboard/organizer/reports' },
        { label: t('dashboard.reports.attendance_title') }
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
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <!-- Event Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 tracking-wider">{{ t('dashboard.reports.select_event') }}</label>
          <BaseSelect v-model="filters.event_id" :items="eventsDropdownItems" :placeholder="t('dashboard.reports.select_event')" />
        </div>

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
    <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
      <StatCard :title="t('dashboard.reports.total_registered', 'Total Terdaftar')" :value="stats.total_registered || 0" icon="ph:users-three-bold" color="primary" />
      <StatCard :title="t('dashboard.reports.checked_in_present', 'Sudah Check-in / Hadir')" :value="stats.total_checked_in || 0" icon="ph:check-square-bold" color="success" />
      <StatCard :title="t('dashboard.reports.pending_checkin', 'Belum Check-in')" :value="stats.total_pending || 0" icon="ph:clock-bold" color="warning" />
      <StatCard :title="t('dashboard.reports.checkin_rate', 'Tingkat Kehadiran')" :value="attendanceRate + '%'" icon="ph:percent-bold" color="primary" />
    </div>

    <!-- Check-in Timeline Chart -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 class="text-navy-dark font-black text-base flex items-center gap-2 mb-6">
        <Icon icon="ph:chart-line-up-bold" class="text-primary" />
        {{ t('dashboard.reports.checkin_timeline', 'Lini Masa Registrasi Ulang') }}
      </h3>
      <div v-if="trendPoints.length > 1" class="relative">
        <svg viewBox="0 0 500 150" class="w-full h-48 overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradient-attendance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#059669" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#059669" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path :d="svgAreaPath" fill="url(#gradient-attendance)" />
          <path :d="svgLinePath" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" />
        </svg>
        <div class="flex justify-between text-[9px] text-gray-400 font-bold mt-3">
          <span>{{ trendPoints[0].date }}</span>
          <span>{{ trendPoints[Math.floor(trendPoints.length / 2)].date }}</span>
          <span>{{ trendPoints[trendPoints.length - 1].date }}</span>
        </div>
      </div>
      <div v-else class="h-48 flex flex-col items-center justify-center text-gray-400 space-y-2 border border-dashed border-gray-100 rounded-xl">
        <Icon icon="ph:identification-card-bold" class="text-3xl" />
        <div class="text-xs font-bold">{{ t('dashboard.reports.no_timeline_data', 'Belum ada data lini masa.') }}</div>
      </div>
    </div>

    <!-- Splits and breakdowns -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- category attendance split -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 class="text-navy-dark font-black text-sm flex items-center gap-2">
          <Icon icon="ph:tag-bold" class="text-primary" />
          {{ t('dashboard.reports.attendance_by_division', 'Kehadiran per Divisi') }}
        </h3>
        <div class="space-y-4 max-h-96 overflow-y-auto no-scrollbar pr-1">
          <div v-for="item in stats.categories_breakdown" :key="item.bow_type + item.age_group + item.gender" class="space-y-1">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-navy-dark capitalize">
                {{ item.bow_type.toLowerCase() }} - {{ item.age_group.toLowerCase() }} ({{ item.gender.toLowerCase() }})
              </span>
              <span class="text-gray-500">
                {{ item.checked_in }} / {{ item.registered }} ({{ getRate(item.checked_in, item.registered) }}%)
              </span>
            </div>
            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div class="bg-emerald-500 h-full rounded-full" :style="{ width: getRate(item.checked_in, item.registered) + '%' }"></div>
            </div>
          </div>
          <div v-if="!stats.categories_breakdown?.length" class="text-center py-6 text-xs text-gray-400">{{ t('dashboard.reports.no_split_data', 'Belum ada data distribusi.') }}</div>
        </div>
      </div>

      <!-- Checked-in List -->
      <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
        <div class="p-5 border-b border-gray-100">
          <h3 class="text-navy-dark font-black text-sm flex items-center gap-2">
            <Icon icon="ph:check-circle-bold" class="text-primary" />
            {{ t('dashboard.reports.recent_checkin_logs', 'Log Registrasi Ulang Terbaru') }}
          </h3>
        </div>
        <div class="overflow-x-auto overflow-y-auto max-h-96 no-scrollbar">
          <table class="w-full text-left text-xs min-w-[500px] sm:min-w-0">
            <thead class="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 sticky top-0">
              <tr>
                <th class="px-5 py-3">{{ t('dashboard.reports.archer') }}</th>
                <th class="px-5 py-3">{{ t('dashboard.reports.event') }}</th>
                <th class="px-5 py-3">{{ t('dashboard.reports.checkin_time') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 font-medium">
              <tr v-for="c in stats.recent_checkins" :key="c.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-5 py-3 flex items-center gap-3">
                  <img :src="useImageOrDefault(c.avatar_url, c.archer_name)" :alt="c.archer_name" class="size-7 rounded-full object-cover border border-gray-100 bg-gray-50 shrink-0" />
                  <span class="text-navy-dark font-bold capitalize">{{ c.archer_name.toLowerCase() }}</span>
                </td>
                <td class="px-5 py-3 text-gray-500 font-semibold truncate max-w-[120px] capitalize">{{ c.event_name.toLowerCase() }}</td>
                <td class="px-5 py-3 text-navy-dark font-mono font-semibold">{{ formatDateTime(c.last_reregistration_at) }}</td>
              </tr>
              <tr v-if="!stats.recent_checkins?.length">
                <td colspan="3" class="text-center py-10 text-gray-400 font-bold">{{ t('dashboard.reports.no_checkins_recorded', 'Belum ada catatan registrasi ulang terbaru.') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
useHead({ title: computed(() => (t ? t('dashboard.reports.attendance_title', 'Kehadiran & Registrasi Ulang') : 'Kehadiran & Registrasi Ulang') + ' - Archeris Dashboard') })

const route = useRoute()
const api = useApi()

const eventsList = ref([])
const eventsDropdownItems = computed(() => [
  { title: t('dashboard.reports.all_events', 'Semua Turnamen'), value: 'all' },
  ...eventsList.value.map(e => ({ title: e.name, value: e.id }))
])
const stats = ref({
  total_registered: 0,
  total_checked_in: 0,
  total_pending: 0,
  categories_breakdown: [],
  checkin_trend: [],
  recent_checkins: [],
  events_list: []
})

const filters = reactive({
  event_id: route.query.event_id || 'all',
  start_date: '',
  end_date: ''
})

onMounted(() => {
  fetchReportData()
})

const fetchReportData = async () => {
  try {
    const queryParams = new URLSearchParams()
    if (filters.event_id !== 'all') queryParams.append('event_id', filters.event_id)
    if (filters.start_date) queryParams.append('start_date', filters.start_date)
    if (filters.end_date) queryParams.append('end_date', filters.end_date)

    const res = await api.get(`/organizers/reports/attendance?${queryParams.toString()}`)
    if (res) {
      stats.value = res
      if (res.events_list) {
        eventsList.value = res.events_list
      }
    }
  } catch (err) {
    console.error('failed to fetch attendance report:', err)
  }
}

const getBackLink = () => {
  return route.query.event_id ? `/dashboard/organizer/reports?event_id=${route.query.event_id}` : '/dashboard/organizer/reports'
}

const applyFilters = () => {
  fetchReportData()
}

const resetFilters = () => {
  filters.event_id = route.query.event_id || 'all'
  filters.start_date = ''
  filters.end_date = ''
  fetchReportData()
}

const attendanceRate = computed(() => {
  const total = stats.value.total_registered || 0
  if (total === 0) return 0
  return Math.round(((stats.value.total_checked_in || 0) / total) * 100)
})

const getRate = (checkedIn, registered) => {
  if (!registered) return 0
  return Math.round((checkedIn / registered) * 100)
}

const trendPoints = computed(() => {
  return stats.value.checkin_trend || []
})

const svgLinePath = computed(() => {
  const trend = trendPoints.value
  if (trend.length <= 1) return ''
  const max = Math.max(...trend.map(d => d.value)) || 1
  const width = 500
  const height = 150
  const points = trend.map((d, i) => {
    const x = (i / (trend.length - 1)) * width
    const y = height - (d.value / max) * height
    return `${x},${y}`
  })
  return `M ${points.join(' L ')}`
})

const svgAreaPath = computed(() => {
  const path = svgLinePath.value
  if (!path) return ''
  const width = 500
  const height = 150
  return `${path} L ${width},${height} L 0,${height} Z`
})

import { exportToExcel } from '~/utils/exportExcel'

const handleExportExcel = () => {
  const list = stats.value.recent_checkins || []
  const data = list.map((a, idx) => ({
    no: idx + 1,
    archer_name: a.archer_name || a.name || '-',
    category_name: a.category_name || '-',
    club_name: a.club_name || '-',
    target_name: a.target_name || '-',
    checked_in_at: a.checked_in_at ? formatDateTime(a.checked_in_at) : (a.time || '-')
  }))
  exportToExcel(
    'Laporan_Kehadiran_Turnamen_Archeris',
    [
      { key: 'no', label: 'No' },
      { key: 'archer_name', label: 'Nama Peserta' },
      { key: 'category_name', label: 'Kategori' },
      { key: 'club_name', label: 'Klub' },
      { key: 'target_name', label: 'Nomor Bantalan' },
      { key: 'checked_in_at', label: 'Waktu Check-In' }
    ],
    data
  )
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.text-navy-dark {
  color: #1e293b;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>

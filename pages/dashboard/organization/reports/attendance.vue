<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
      <div class="absolute inset-0"
        style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
      </div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

      <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-5">
          <NuxtLink :to="getBackLink()"
            class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner text-white hover:bg-white/20 transition-all">
            <Icon icon="ph:arrow-left-bold" class="text-primary text-xl sm:text-2xl" />
          </NuxtLink>
          <div>
            <h1 class="text-xl sm:text-2xl font-black tracking-tight leading-none">{{ t('dashboard.reports.attendance_title') }}</h1>
            <p class="text-slate-300 text-[10px] sm:text-xs font-bold mt-1 tracking-wider">Track Checked-in vs Registered Participants Status.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Panel -->
    <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div class="flex items-center gap-2 pb-3 border-b border-gray-100">
        <Icon icon="ph:funnel-bold" class="text-primary text-lg" />
        <h3 class="text-sm font-black text-navy-dark">Report Filters</h3>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <!-- Event Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 uppercase tracking-wider">{{ t('dashboard.reports.select_event') }}</label>
          <BaseSelect v-model="filters.event_id" :items="eventsDropdownItems" :placeholder="t('dashboard.reports.select_event')" />
        </div>

        <!-- Start Date Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 uppercase tracking-wider">{{ t('dashboard.reports.start_date') }}</label>
          <BaseDatePicker v-model="filters.start_date" :placeholder="t('dashboard.reports.start_date')" />
        </div>

        <!-- End Date Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 uppercase tracking-wider">{{ t('dashboard.reports.end_date') }}</label>
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
      <StatCard title="Total Registered" :value="stats.total_registered || 0" icon="ph:users-three-bold" color="primary" />
      <StatCard title="Checked In / Present" :value="stats.total_checked_in || 0" icon="ph:check-square-bold" color="success" />
      <StatCard title="Pending Check-in" :value="stats.total_pending || 0" icon="ph:clock-bold" color="warning" />
      <StatCard title="Check-in Rate" :value="attendanceRate + '%'" icon="ph:percent-bold" color="primary" />
    </div>

    <!-- Check-in Timeline Chart -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 class="text-navy-dark font-black text-base flex items-center gap-2 mb-6">
        <Icon icon="ph:chart-line-up-bold" class="text-primary" />
        Check-in Timeline
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
        <p class="text-xs font-bold">No Timeline Data Available. Check-in events will appear here chronologically.</p>
      </div>
    </div>

    <!-- Splits and breakdowns -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- category attendance split -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 class="text-navy-dark font-black text-sm flex items-center gap-2">
          <Icon icon="ph:tag-bold" class="text-primary" />
          Attendance by Division
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
          <div v-if="!stats.categories_breakdown?.length" class="text-center py-6 text-xs text-gray-400">No Split Data.</div>
        </div>
      </div>

      <!-- Checked-in List -->
      <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
        <div class="p-5 border-b border-gray-100">
          <h3 class="text-navy-dark font-black text-sm flex items-center gap-2">
            <Icon icon="ph:check-circle-bold" class="text-primary" />
            Recent Check-in Logs
          </h3>
        </div>
        <div class="overflow-y-auto max-h-96 no-scrollbar">
          <table class="w-full text-left text-xs">
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
                <td colspan="3" class="text-center py-10 text-gray-400 font-bold">No Recent Check-ins Recorded.</td>
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
const route = useRoute()
const api = useApi()

const eventsList = ref([])
const eventsDropdownItems = computed(() => [
  { title: t('dashboard.reports.all_events'), value: 'all' },
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

    const res = await api.get(`/organizations/reports/attendance?${queryParams.toString()}`)
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
  return route.query.event_id ? `/dashboard/organization/reports?event_id=${route.query.event_id}` : '/dashboard/organization/reports'
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

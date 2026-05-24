<template>
  <div class="space-y-8">
    <!-- Back Header -->
    <div class="flex items-center gap-3">
      <NuxtLink :to="getBackLink()" class="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-navy-dark transition-all flex items-center justify-center">
        <Icon icon="ph:arrow-left-bold" class="text-lg" />
      </NuxtLink>
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-navy-dark">{{ t('dashboard.reports.participants_title') }}</h1>
        <p class="text-gray-500 text-xs font-bold leading-none mt-1">Analyze Registration Splits, Check-in Status, and Registration Timeline.</p>
      </div>
    </div>

    <!-- Filters Panel -->
    <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div class="flex items-center gap-2 pb-3 border-b border-gray-100">
        <Icon icon="ph:funnel-bold" class="text-primary text-lg" />
        <h3 class="text-sm font-black text-navy-dark">Report Filters</h3>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <!-- Event Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 uppercase tracking-wider">{{ t('dashboard.reports.select_event') }}</label>
          <select v-model="filters.event_id" class="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none">
            <option value="all">{{ t('dashboard.reports.all_events') }}</option>
            <option v-for="e in eventsList" :key="e.id" :value="e.id">{{ e.name }}</option>
          </select>
        </div>

        <!-- Start Date Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 uppercase tracking-wider">{{ t('dashboard.reports.start_date') }}</label>
          <input type="date" v-model="filters.start_date" class="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none" />
        </div>

        <!-- End Date Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 uppercase tracking-wider">{{ t('dashboard.reports.end_date') }}</label>
          <input type="date" v-model="filters.end_date" class="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none" />
        </div>

        <!-- Bow Type Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 uppercase tracking-wider">Bow Type</label>
          <select v-model="filters.bow_type" class="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none">
            <option value="all">All Bow Types</option>
            <option value="Recurve">Recurve</option>
            <option value="Compound">Compound</option>
            <option value="Barebow">Barebow</option>
            <option value="Traditional">Traditional</option>
            <option value="Standard">Standard</option>
          </select>
        </div>

        <!-- Status Checkin Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 uppercase tracking-wider">Check-in Status</label>
          <select v-model="filters.status" class="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none">
            <option value="all">All Status</option>
            <option value="checked_in">Checked In</option>
            <option value="pending">Not Checked In</option>
          </select>
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
      <StatCard title="Total Registrations" :value="stats.total_participants || 0" icon="ph:users-three-bold" color="primary" />
      <StatCard title="Checked-in Archers" :value="stats.checked_in_count || 0" icon="ph:user-circle-check-bold" color="success" />
      <StatCard title="Pending Check-in" :value="stats.pending_checkin_count || 0" icon="ph:clock-bold" color="warning" />
      <StatCard title="Check-in Rate" :value="checkInRate + '%'" icon="ph:percent-bold" color="primary" />
    </div>

    <!-- Registration Trend Chart -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 class="text-navy-dark font-black text-base flex items-center gap-2 mb-6">
        <Icon icon="ph:chart-line-up-bold" class="text-primary" />
        Registration Trend
      </h3>
      <div v-if="trendPoints.length > 1" class="relative">
        <!-- SVG area/line chart -->
        <svg viewBox="0 0 500 150" class="w-full h-48 overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--color-primary, #ea580c)" stop-opacity="0.3" />
              <stop offset="100%" stop-color="var(--color-primary, #ea580c)" stop-opacity="0" />
            </linearGradient>
          </defs>
          <!-- area path -->
          <path :d="svgAreaPath" fill="url(#gradient-area)" />
          <!-- line path -->
          <path :d="svgLinePath" fill="none" stroke="var(--color-primary, #ea580c)" stroke-width="2.5" stroke-linecap="round" />
        </svg>
        <!-- X axis labels -->
        <div class="flex justify-between text-[9px] text-gray-400 font-bold mt-3">
          <span>{{ trendPoints[0].date }}</span>
          <span>{{ trendPoints[Math.floor(trendPoints.length / 2)].date }}</span>
          <span>{{ trendPoints[trendPoints.length - 1].date }}</span>
        </div>
      </div>
      <div v-else class="h-48 flex flex-col items-center justify-center text-gray-400 space-y-2 border border-dashed border-gray-100 rounded-xl">
        <Icon icon="ph:trend-up-bold" class="text-3xl" />
        <p class="text-xs font-bold">No Timeline Trend Data Available for Selected Filter.</p>
      </div>
    </div>

    <!-- Splits and Breakdowns -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- bow types split -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 class="text-navy-dark font-black text-sm flex items-center gap-2">
          <Icon icon="ph:crosshair-bold" class="text-primary" />
          Bow Types Split
        </h3>
        <div class="space-y-3">
          <div v-for="item in stats.bow_type_split" :key="item.name" class="space-y-1">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-navy-dark capitalize">{{ item.name.toLowerCase() }}</span>
              <span class="text-gray-500">{{ item.count }} ({{ getPercent(item.count) }}%)</span>
            </div>
            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div class="bg-primary h-full rounded-full" :style="{ width: getPercent(item.count) + '%' }"></div>
            </div>
          </div>
          <div v-if="!stats.bow_type_split?.length" class="text-center py-6 text-xs text-gray-400">No Split Data.</div>
        </div>
      </div>

      <!-- gender split -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 class="text-navy-dark font-black text-sm flex items-center gap-2">
          <Icon icon="ph:gender-intersex-bold" class="text-primary" />
          Gender Split
        </h3>
        <div class="space-y-3">
          <div v-for="item in stats.gender_split" :key="item.name" class="space-y-1">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-navy-dark capitalize">{{ item.name.toLowerCase() }}</span>
              <span class="text-gray-500">{{ item.count }} ({{ getPercent(item.count) }}%)</span>
            </div>
            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div class="bg-primary h-full rounded-full" :style="{ width: getPercent(item.count) + '%' }"></div>
            </div>
          </div>
          <div v-if="!stats.gender_split?.length" class="text-center py-6 text-xs text-gray-400">No Split Data.</div>
        </div>
      </div>

      <!-- registration source split -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 class="text-navy-dark font-black text-sm flex items-center gap-2">
          <Icon icon="ph:globe-bold" class="text-primary" />
          Registration Sources
        </h3>
        <div class="space-y-3">
          <div v-for="item in stats.registration_source_split" :key="item.name" class="space-y-1">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-navy-dark capitalize">{{ item.name.replace('_', ' ').toLowerCase() }}</span>
              <span class="text-gray-500">{{ item.count }} ({{ getPercent(item.count) }}%)</span>
            </div>
            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div class="bg-primary h-full rounded-full" :style="{ width: getPercent(item.count) + '%' }"></div>
            </div>
          </div>
          <div v-if="!stats.registration_source_split?.length" class="text-center py-6 text-xs text-gray-400">No Split Data.</div>
        </div>
      </div>
    </div>

    <!-- Participants Ledger -->
    <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div class="p-5 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-navy-dark font-black text-sm flex items-center gap-2">
          <Icon icon="ph:list-dashes-bold" class="text-primary" />
          Recent Registered Participants
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
            <tr>
              <th class="px-6 py-4">Archer</th>
              <th class="px-6 py-4">Event</th>
              <th class="px-6 py-4">Category / Bow</th>
              <th class="px-6 py-4">Reg Date</th>
              <th class="px-6 py-4">Payment</th>
              <th class="px-6 py-4">Check-in</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 font-medium">
            <tr v-for="p in stats.recent_participants" :key="p.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 flex items-center gap-3">
                <img :src="useImageOrDefault(p.avatar_url, p.archer_name)" :alt="p.archer_name" class="size-8 rounded-full object-cover border border-gray-100 bg-gray-50 shrink-0" />
                <span class="text-navy-dark font-bold capitalize">{{ p.archer_name.toLowerCase() }}</span>
              </td>
              <td class="px-6 py-4 text-gray-500 font-semibold capitalize">{{ p.event_name.toLowerCase() }}</td>
              <td class="px-6 py-4">
                <div class="text-navy-dark font-bold capitalize">{{ p.bow_type ? p.bow_type.toLowerCase() : '-' }}</div>
                <div class="text-gray-400 text-[10px] font-bold capitalize">{{ p.age_group ? p.age_group.toLowerCase() : '' }} ({{ p.gender ? p.gender.toLowerCase() : '' }})</div>
              </td>
              <td class="px-6 py-4 text-gray-500 font-semibold font-mono">{{ formatDate(p.registration_date) }}</td>
              <td class="px-6 py-4">
                <span :class="p.payment_status === 'paid' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-amber-50 text-amber-600 border-amber-200'" class="px-2 py-0.5 rounded-full border text-[10px] font-black tracking-wider uppercase">
                  {{ p.payment_status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="p.last_reregistration_at ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'" class="px-2 py-0.5 rounded-full border text-[10px] font-black tracking-wider capitalize">
                  {{ p.last_reregistration_at ? 'Checked In' : 'Pending' }}
                </span>
              </td>
            </tr>
            <tr v-if="!stats.recent_participants?.length">
              <td colspan="6" class="text-center py-10 text-gray-400 font-bold">No Participants Found Matching Selected Filters.</td>
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
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
const route = useRoute()
const api = useApi()

const eventsList = ref([])
const stats = ref({
  total_participants: 0,
  gender_split: [],
  bow_type_split: [],
  age_group_split: [],
  registration_source_split: [],
  checked_in_count: 0,
  pending_checkin_count: 0,
  registration_trend: [],
  recent_participants: [],
  events_list: []
})

const filters = reactive({
  event_id: route.query.event_id || 'all',
  start_date: '',
  end_date: '',
  gender: 'all',
  bow_type: 'all',
  status: 'all'
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
    if (filters.gender !== 'all') queryParams.append('gender', filters.gender)
    if (filters.bow_type !== 'all') queryParams.append('bow_type', filters.bow_type)
    if (filters.status !== 'all') queryParams.append('status', filters.status)

    const res = await api.get(`/organizations/reports/participants?${queryParams.toString()}`)
    if (res) {
      stats.value = res
      if (res.events_list) {
        eventsList.value = res.events_list
      }
    }
  } catch (err) {
    console.error('failed to fetch participants report:', err)
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
  filters.gender = 'all'
  filters.bow_type = 'all'
  filters.status = 'all'
  fetchReportData()
}

const checkInRate = computed(() => {
  const total = stats.value.total_participants || 0
  if (total === 0) return 0
  const rate = ((stats.value.checked_in_count || 0) / total) * 100
  return Math.round(rate)
})

const getPercent = (count) => {
  const total = stats.value.total_participants || 0
  if (total === 0) return 0
  return Math.round((count / total) * 100)
}

const trendPoints = computed(() => {
  return stats.value.registration_trend || []
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

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  })
}
</script>

<style scoped>
.text-navy-dark {
  color: #1e293b;
}
.bg-primary\/10 {
  background-color: rgba(234, 88, 12, 0.1);
}
</style>

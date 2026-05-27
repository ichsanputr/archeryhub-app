<template>
  <div class="space-y-8">
    <!-- header -->
    <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white">
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-5">
          <NuxtLink :to="getBackLink()"
            class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 text-white hover:bg-white/20 transition-all">
            <Icon icon="ph:arrow-left-bold" class="text-primary text-xl sm:text-2xl" />
          </NuxtLink>
          <div>
            <h1 class="text-xl sm:text-2xl font-black tracking-tight leading-none">{{ t('dashboard.reports.participants_title') }}</h1>
            <p class="text-slate-300 text-[10px] sm:text-xs font-bold mt-1 tracking-wider">Analyze Registration Splits, Check-in Status, and Registration Timeline.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- filters panel -->
    <div class="bg-white border border-primary/10 rounded-2xl p-5 space-y-4">
      <div class="flex items-center gap-2 pb-3 border-b border-gray-100">
        <Icon icon="ph:funnel-bold" class="text-primary text-lg" />
        <h3 class="text-sm font-black text-navy">Report Filters</h3>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <!-- event -->
        <BaseSelect
          v-model="filters.event_id"
          :items="eventSelectItems"
          item-title="name"
          item-value="id"
          :placeholder="t('dashboard.reports.all_events')"
          :label="t('dashboard.reports.select_event')"
          :searchable="true"
          clearable
        />

        <!-- start date -->
        <BaseDatePicker
          v-model="filters.start_date"
          :label="t('dashboard.reports.start_date')"
          placeholder="Select start date"
          clearable
        />

        <!-- end date -->
        <BaseDatePicker
          v-model="filters.end_date"
          :label="t('dashboard.reports.end_date')"
          placeholder="Select end date"
          clearable
        />

        <!-- bow type -->
        <BaseSelect
          v-model="filters.bow_type"
          :items="bowTypeItems"
          item-title="label"
          item-value="value"
          label="Bow Type"
          :searchable="false"
        />

        <!-- check-in status -->
        <BaseSelect
          v-model="filters.status"
          :items="statusItems"
          item-title="label"
          item-value="value"
          label="Check-in Status"
          :searchable="false"
        />
      </div>

      <div class="flex justify-end gap-3 pt-1">
        <BaseButton variant="ghost" class="h-9 px-4 text-xs font-black" @click="resetFilters">
          {{ t('dashboard.reports.reset_filters') }}
        </BaseButton>
        <BaseButton variant="primary" class="h-9 px-5 text-xs font-black" @click="applyFilters">
          {{ t('dashboard.reports.apply_filters') }}
        </BaseButton>
      </div>
    </div>

    <!-- stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
      <StatCard title="Total Registrations" :value="stats.total_participants || 0" icon="ph:users-three-bold" color="primary" />
      <StatCard title="Checked-in Archers" :value="stats.checked_in_count || 0" icon="ph:user-circle-check-bold" color="success" />
      <StatCard title="Pending Check-in" :value="stats.pending_checkin_count || 0" icon="ph:clock-bold" color="warning" />
      <StatCard title="Check-in Rate" :value="checkInRate + '%'" icon="ph:percent-bold" color="primary" />
    </div>

    <!-- registration trend chart -->
    <div class="bg-white border border-primary/10 rounded-2xl p-6">
      <h3 class="text-navy font-black text-base flex items-center gap-2 mb-6">
        <Icon icon="ph:chart-line-up-bold" class="text-primary" />
        Registration Trend
      </h3>
      <div v-if="trendPoints.length > 1" class="relative">
        <svg viewBox="0 0 500 150" class="w-full h-48 overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--color-primary, #ea580c)" stop-opacity="0.3" />
              <stop offset="100%" stop-color="var(--color-primary, #ea580c)" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path :d="svgAreaPath" fill="url(#gradient-area)" />
          <path :d="svgLinePath" fill="none" stroke="var(--color-primary, #ea580c)" stroke-width="2.5" stroke-linecap="round" />
        </svg>
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

    <!-- splits -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white border border-primary/10 rounded-2xl p-6 space-y-4">
        <h3 class="text-navy font-black text-sm flex items-center gap-2">
          <Icon icon="ph:crosshair-bold" class="text-primary" />
          Bow Types Split
        </h3>
        <div class="space-y-3">
          <div v-for="item in stats.bow_type_split" :key="item.name" class="space-y-1">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-navy capitalize">{{ item.name.toLowerCase() }}</span>
              <span class="text-gray-500">{{ item.count }} ({{ getPercent(item.count) }}%)</span>
            </div>
            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div class="bg-primary h-full rounded-full" :style="{ width: getPercent(item.count) + '%' }"></div>
            </div>
          </div>
          <div v-if="!stats.bow_type_split?.length" class="text-center py-6 text-xs text-gray-400">No Split Data.</div>
        </div>
      </div>

      <div class="bg-white border border-primary/10 rounded-2xl p-6 space-y-4">
        <h3 class="text-navy font-black text-sm flex items-center gap-2">
          <Icon icon="ph:gender-intersex-bold" class="text-primary" />
          Gender Split
        </h3>
        <div class="space-y-3">
          <div v-for="item in stats.gender_split" :key="item.name" class="space-y-1">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-navy capitalize">{{ item.name.toLowerCase() }}</span>
              <span class="text-gray-500">{{ item.count }} ({{ getPercent(item.count) }}%)</span>
            </div>
            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div class="bg-primary h-full rounded-full" :style="{ width: getPercent(item.count) + '%' }"></div>
            </div>
          </div>
          <div v-if="!stats.gender_split?.length" class="text-center py-6 text-xs text-gray-400">No Split Data.</div>
        </div>
      </div>

      <div class="bg-white border border-primary/10 rounded-2xl p-6 space-y-4">
        <h3 class="text-navy font-black text-sm flex items-center gap-2">
          <Icon icon="ph:globe-bold" class="text-primary" />
          Registration Sources
        </h3>
        <div class="space-y-3">
          <div v-for="item in stats.registration_source_split" :key="item.name" class="space-y-1">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-navy capitalize">{{ item.name.replace('_', ' ').toLowerCase() }}</span>
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

    <!-- participants table -->
    <div class="bg-white border border-primary/10 rounded-2xl overflow-hidden">
      <div class="p-5 border-b border-gray-100">
        <h3 class="text-navy font-black text-sm flex items-center gap-2">
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
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img :src="useImageOrDefault(p.avatar_url, p.archer_name)" :alt="p.archer_name" class="size-8 rounded-full object-cover border border-gray-100 bg-gray-50 shrink-0" />
                  <span class="text-navy font-bold capitalize">{{ p.archer_name.toLowerCase() }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-500 font-semibold capitalize">{{ p.event_name.toLowerCase() }}</td>
              <td class="px-6 py-4">
                <div class="text-navy font-bold capitalize">{{ p.bow_type ? p.bow_type.toLowerCase() : '-' }}</div>
                <div class="text-gray-400 text-[10px] font-bold capitalize">{{ p.age_group ? p.age_group.toLowerCase() : '' }} ({{ p.gender ? p.gender.toLowerCase() : '' }})</div>
              </td>
              <td class="px-6 py-4 text-gray-500 font-semibold font-mono">{{ formatDate(p.registration_date) }}</td>
              <td class="px-6 py-4">
                <span :class="p.payment_status === 'paid' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-amber-50 text-amber-600 border-amber-200'"
                  class="px-2 py-0.5 rounded-full border text-[10px] font-black tracking-wider uppercase">
                  {{ p.payment_status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="p.last_reregistration_at ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'"
                  class="px-2 py-0.5 rounded-full border text-[10px] font-black tracking-wider capitalize">
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

definePageMeta({ layout: 'dashboard' })

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

const eventSelectItems = computed(() => [
  { id: 'all', name: t('dashboard.reports.all_events') },
  ...eventsList.value
])

const bowTypeItems = [
  { value: 'all', label: 'All Bow Types' },
  { value: 'Recurve', label: 'Recurve' },
  { value: 'Compound', label: 'Compound' },
  { value: 'Barebow', label: 'Barebow' },
  { value: 'Traditional', label: 'Traditional' },
  { value: 'Standard', label: 'Standard' },
]

const statusItems = [
  { value: 'all', label: 'All Status' },
  { value: 'checked_in', label: 'Checked In' },
  { value: 'pending', label: 'Not Checked In' },
]

onMounted(() => { fetchReportData() })

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
      if (res.events_list) eventsList.value = res.events_list
    }
  } catch (err) {
    console.error('failed to fetch participants report:', err)
  }
}

const getBackLink = () =>
  route.query.event_id
    ? `/dashboard/organization/reports?event_id=${route.query.event_id}`
    : '/dashboard/organization/reports'

const applyFilters = () => fetchReportData()

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
  return Math.round(((stats.value.checked_in_count || 0) / total) * 100)
})

const getPercent = (count) => {
  const total = stats.value.total_participants || 0
  if (total === 0) return 0
  return Math.round((count / total) * 100)
}

const trendPoints = computed(() => stats.value.registration_trend || [])

const svgLinePath = computed(() => {
  const trend = trendPoints.value
  if (trend.length <= 1) return ''
  const max = Math.max(...trend.map(d => d.value)) || 1
  const points = trend.map((d, i) => {
    const x = (i / (trend.length - 1)) * 500
    const y = 150 - (d.value / max) * 150
    return `${x},${y}`
  })
  return `M ${points.join(' L ')}`
})

const svgAreaPath = computed(() => {
  const path = svgLinePath.value
  if (!path) return ''
  return `${path} L 500,150 L 0,150 Z`
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' })
}
</script>

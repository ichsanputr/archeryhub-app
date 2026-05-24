<template>
  <div class="space-y-8">
    <!-- Back Header -->
    <div class="flex items-center gap-3">
      <NuxtLink :to="getBackLink()" class="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-navy-dark transition-all flex items-center justify-center">
        <Icon icon="ph:arrow-left-bold" class="text-lg" />
      </NuxtLink>
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-navy-dark">{{ t('dashboard.reports.finance_title') }}</h1>
        <p class="text-gray-500 text-xs font-bold leading-none mt-1">Monitor Payments Status, Revenue Flow, and Payment Method Summaries.</p>
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

        <!-- Payment Method Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 uppercase tracking-wider">Payment Method</label>
          <select v-model="filters.payment_method" class="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none">
            <option value="all">All Methods</option>
            <option value="paddle">Paddle</option>
            <option value="BCAVA">BCA VA</option>
            <option value="BNIVA">BNI VA</option>
            <option value="BRIVA">BRI VA</option>
            <option value="MANDIRIVA">Mandiri VA</option>
            <option value="manual">Manual Transfer</option>
          </select>
        </div>

        <!-- Payment Status Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 uppercase tracking-wider">Payment Status</label>
          <select v-model="filters.status" class="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none">
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
            <option value="failed">Failed</option>
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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <StatCard title="Total Paid Revenue" :value="'Rp ' + formatPrice(stats.total_paid || 0)" icon="ph:wallet-bold" color="success" />
      <StatCard title="Pending Payments" :value="'Rp ' + formatPrice(stats.total_pending || 0)" icon="ph:clock-bold" color="warning" />
      <StatCard title="Expired/Failed Payments" :value="'Rp ' + formatPrice(stats.total_failed || 0)" icon="ph:x-circle-bold" color="primary" />
    </div>

    <!-- Revenue Trend Chart -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 class="text-navy-dark font-black text-base flex items-center gap-2 mb-6">
        <Icon icon="ph:chart-line-up-bold" class="text-primary" />
        Revenue Trend (Paid Payments)
      </h3>
      <div v-if="trendPoints.length > 1" class="relative">
        <svg viewBox="0 0 500 150" class="w-full h-48 overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradient-finance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path :d="svgAreaPath" fill="url(#gradient-finance)" />
          <path :d="svgLinePath" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" />
        </svg>
        <div class="flex justify-between text-[9px] text-gray-400 font-bold mt-3">
          <span>{{ trendPoints[0].date }}</span>
          <span>{{ trendPoints[Math.floor(trendPoints.length / 2)].date }}</span>
          <span>{{ trendPoints[trendPoints.length - 1].date }}</span>
        </div>
      </div>
      <div v-else class="h-48 flex flex-col items-center justify-center text-gray-400 space-y-2 border border-dashed border-gray-100 rounded-xl">
        <Icon icon="ph:coin-bold" class="text-3xl" />
        <p class="text-xs font-bold">No Revenue Timeline Data Available for Selected Filter.</p>
      </div>
    </div>

    <!-- Splits and Breakdowns -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- payment method split -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-2">
        <h3 class="text-navy-dark font-black text-sm flex items-center gap-2">
          <Icon icon="ph:credit-card-bold" class="text-primary" />
          Payment Methods Split
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div v-for="item in stats.payment_method_split" :key="item.name" class="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-navy-dark uppercase">{{ item.name }}</span>
              <span class="text-gray-500">{{ item.count }} Txn</span>
            </div>
            <div class="text-lg font-black text-navy">Rp {{ formatPrice(item.amount) }}</div>
            <div class="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div class="bg-emerald-500 h-full rounded-full" :style="{ width: getPercent(item.amount) + '%' }"></div>
            </div>
            <div class="text-[10px] text-gray-400 font-bold text-right">{{ getPercent(item.amount) }}% of Total</div>
          </div>
          <div v-if="!stats.payment_method_split?.length" class="text-center col-span-2 py-6 text-xs text-gray-400">No Payment Methods Split Data.</div>
        </div>
      </div>

      <!-- Quick Action Stats -->
      <div class="bg-navy text-white border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div class="absolute top-0 right-0 p-8 opacity-10">
          <Icon icon="ph:bank-bold" class="text-9xl rotate-12" />
        </div>
        <div class="space-y-4 relative z-10">
          <h3 class="text-lg font-black flex items-center gap-2">
            <Icon icon="ph:info-bold" class="text-yellow-400" />
            Financial Overview
          </h3>
          <p class="text-slate-300 text-xs font-medium leading-relaxed">
            This dashboard aggregates payment transaction logs specifically from registered participants. To withdraw settled balance to your registered bank account, go to Balance Dashboard.
          </p>
        </div>
        <NuxtLink to="/dashboard/organization/balance" class="w-full mt-6 relative z-10">
          <BaseButton variant="primary" class="w-full h-11 text-xs font-black shadow-lg shadow-primary/20">
            Go to Withdraw & Balance
          </BaseButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Transactions Ledger -->
    <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div class="p-5 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-navy-dark font-black text-sm flex items-center gap-2">
          <Icon icon="ph:list-dashes-bold" class="text-primary" />
          Recent Transaction History
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
            <tr>
              <th class="px-6 py-4">Reference</th>
              <th class="px-6 py-4">User</th>
              <th class="px-6 py-4">Event</th>
              <th class="px-6 py-4">Amount</th>
              <th class="px-6 py-4">Method</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 font-medium">
            <tr v-for="t in stats.recent_transactions" :key="t.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 text-navy-dark font-bold font-mono">{{ t.reference }}</td>
              <td class="px-6 py-4 text-gray-700 font-bold capitalize">{{ t.user_name ? t.user_name.toLowerCase() : '-' }}</td>
              <td class="px-6 py-4 text-gray-500 font-semibold capitalize">{{ t.event_name.toLowerCase() }}</td>
              <td class="px-6 py-4 text-navy-dark font-black font-mono">Rp {{ formatPrice(t.amount) }}</td>
              <td class="px-6 py-4 text-gray-500 font-bold uppercase">{{ t.payment_method || 'manual' }}</td>
              <td class="px-6 py-4">
                <span 
                  :class="[
                    t.status === 'paid' ? 'bg-green-50 text-green-600 border-green-200' : '',
                    t.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : '',
                    t.status === 'expired' ? 'bg-slate-50 text-slate-400 border-slate-200' : '',
                    t.status === 'failed' ? 'bg-red-50 text-red-600 border-red-200' : '',
                  ]"
                  class="px-2 py-0.5 rounded-full border text-[10px] font-black tracking-wider uppercase"
                >
                  {{ t.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-400 font-semibold font-mono">{{ formatDate(t.created_at) }}</td>
            </tr>
            <tr v-if="!stats.recent_transactions?.length">
              <td colspan="7" class="text-center py-10 text-gray-400 font-bold">No Transactions Found Matching Selected Filters.</td>
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
const route = useRoute()
const api = useApi()

const eventsList = ref([])
const stats = ref({
  total_paid: 0,
  total_pending: 0,
  total_failed: 0,
  payment_method_split: [],
  revenue_trend: [],
  recent_transactions: [],
  events_list: []
})

const filters = reactive({
  event_id: route.query.event_id || 'all',
  start_date: '',
  end_date: '',
  payment_method: 'all',
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
    if (filters.payment_method !== 'all') queryParams.append('payment_method', filters.payment_method)
    if (filters.status !== 'all') queryParams.append('status', filters.status)

    const res = await api.get(`/organizations/reports/finance?${queryParams.toString()}`)
    if (res) {
      stats.value = res
      if (res.events_list) {
        eventsList.value = res.events_list
      }
    }
  } catch (err) {
    console.error('failed to fetch financial report:', err)
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
  filters.payment_method = 'all'
  filters.status = 'all'
  fetchReportData()
}

const formatPrice = (value) => {
  return new Intl.NumberFormat('id-ID').format(value)
}

const getPercent = (amount) => {
  const total = stats.value.total_paid || 1
  return Math.round((amount / total) * 100)
}

const trendPoints = computed(() => {
  return stats.value.revenue_trend || []
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
.bg-navy {
  background-color: var(--sidebar-bg, #0f172a);
}
</style>

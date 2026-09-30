<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <DashboardHeader
      :title="t('org_revenue.header_title')"
      :subtitle="t('org_revenue.header_subtitle')"
      icon="ph:coins-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('dashboard.sidebar.my_events', 'My Tournaments'), to: '/dashboard/organizer/tournaments' },
        { label: tournamentTitle || t('dashboard_event_overview.summary_title', 'Overview'), to: `/dashboard/organizer/tournaments/${eventId}/overview` },
        { label: t('org_revenue.header_title') }
      ]"
    />

    <!-- Revenue Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div class="text-xs font-bold text-slate-500 capitalize tracking-wider mb-1">{{ t("org_revenue.gross_revenue") }}</div>
        <div class="text-2xl font-black text-navy dark:text-white">{{ formattedGrossRevenue }}</div>
      </div>
      <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div class="text-xs font-bold text-slate-500 capitalize tracking-wider mb-1">{{ t("org_revenue.platform_fee") }}</div>
        <div class="text-2xl font-black text-amber-600">{{ formattedPlatformFee }}</div>
      </div>
      <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div class="text-xs font-bold text-slate-500 capitalize tracking-wider mb-1">{{ t("org_revenue.net_revenue") }}</div>
        <div class="text-2xl font-black text-emerald-600">{{ formattedNetRevenue }}</div>
      </div>
      <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div class="text-xs font-bold text-slate-500 capitalize tracking-wider mb-1">{{ t("org_revenue.paid_participants") }}</div>
        <div class="text-2xl font-black text-navy dark:text-white">{{ paidCount }} / {{ participants.length }}</div>
      </div>
    </div>

    <!-- Payment Methods Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Method Breakdown Card -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm space-y-4">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
            <Icon icon="ph:credit-card-bold" class="text-xl" />
          </div>
          <h3 class="font-black text-navy dark:text-white text-lg">{{ t("org_revenue.method_breakdown_title") }}</h3>
        </div>
        <div class="space-y-3">
          <div v-for="(item, idx) in methodBreakdown" :key="idx" class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50">
            <div class="flex items-center gap-3">
              <Icon icon="ph:credit-card-bold" class="text-primary text-xl" />
              <span class="font-bold text-navy dark:text-white text-sm capitalize">{{ item.method }}</span>
            </div>
            <span class="font-mono font-black text-navy dark:text-white text-sm">{{ formatMoney(item.amount, item.currency) }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions Card -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm space-y-4">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
            <Icon icon="ph:wallet-bold" class="text-xl" />
          </div>
          <h3 class="font-black text-navy dark:text-white text-lg">{{ t("org_revenue.financial_actions_title") }}</h3>
        </div>
        <div class="text-xs text-slate-500 leading-relaxed">
          {{ t("org_revenue.financial_actions_desc") }}
        </div>
        <BaseButton to="/dashboard/organizer/wallet" variant="navy" size="md" class="w-full justify-center font-bold">
          <Icon icon="ph:wallet-bold" class="mr-2" /> {{ t("org_revenue.open_wallet_btn") }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { formatMoney } from '~/composables/useCurrency'

const { t } = useI18n()
const route = useRoute()
const { get } = useApi()
const { tournamentTitle, currentTournament } = useTournamentContext()

const eventId = computed(() => route.params.id as string)

const isLoading = ref(true)
const participants = ref<any[]>([])
const invoices = ref<any[]>([])

const tournamentCurrency = computed(() => {
  return currentTournament.value?.currency || (currentTournament.value?.page_settings as any)?.currency || invoices.value[0]?.currency || 'IDR'
})

useHead({
  title: computed(() => (t ? t('org_revenue.header_title') : 'Pendapatan Event') + ' - Archeris Dashboard')
})

const paidParticipants = computed(() =>
  participants.value.filter(p => p.payment_status === 'paid' || p.payment_status === 'lunas')
)

const paidCount = computed(() => paidParticipants.value.length)

const revenueByCurrency = computed(() => {
  const map: Record<string, { gross: number; net: number; fee: number }> = {}
  for (const p of paidParticipants.value) {
    const curr = (p.currency || tournamentCurrency.value || 'IDR').toUpperCase()
    const amt = Number(p.payment_amount || p.amount || 0)
    if (!map[curr]) {
      map[curr] = { gross: 0, net: 0, fee: 0 }
    }
    map[curr].gross += amt
    map[curr].fee += amt * 0.05
    map[curr].net += amt * 0.95
  }
  return map
})

const formattedGrossRevenue = computed(() => {
  const entries = Object.entries(revenueByCurrency.value)
  if (entries.length === 0) return formatMoney(0, tournamentCurrency.value)
  return entries.map(([curr, val]) => formatMoney(val.gross, curr)).join(' + ')
})

const formattedPlatformFee = computed(() => {
  const entries = Object.entries(revenueByCurrency.value)
  if (entries.length === 0) return formatMoney(0, tournamentCurrency.value)
  return entries.map(([curr, val]) => formatMoney(val.fee, curr)).join(' + ')
})

const formattedNetRevenue = computed(() => {
  const entries = Object.entries(revenueByCurrency.value)
  if (entries.length === 0) return formatMoney(0, tournamentCurrency.value)
  return entries.map(([curr, val]) => formatMoney(val.net, curr)).join(' + ')
})

const methodBreakdown = computed(() => {
  if (invoices.value && invoices.value.length > 0) {
    const paidInvoices = invoices.value.filter((inv: any) => ['paid', 'lunas', 'settlement', 'success', 'completed'].includes((inv.status || '').toLowerCase()))
    const map: Record<string, { method: string; amount: number; currency: string }> = {}
    for (const inv of paidInvoices) {
      const rawMethod = (inv.payment_method || inv.method || 'online').toLowerCase()
      let label = 'Gateway Online (Mayar)'
      if (rawMethod === 'manual') label = 'Transfer Bank Manual'
      else if (rawMethod === 'cash') label = 'Tunai (Cash Desk)'
      else if (rawMethod === 'paypal') label = 'PayPal'
      
      const curr = inv.currency || tournamentCurrency.value || 'IDR'
      const key = `${label}_${curr}`
      const amt = Number(inv.total_amount || inv.amount || 0)
      if (!map[key]) {
        map[key] = { method: label, amount: 0, currency: curr }
      }
      map[key].amount += amt
    }
    return Object.values(map)
  }
  
  const map: Record<string, { method: string; amount: number; currency: string }> = {}
  for (const p of paidParticipants.value) {
    const m = (p.payment_method || 'Online Gateway').toUpperCase()
    const curr = p.currency || tournamentCurrency.value || 'IDR'
    const key = `${m}_${curr}`
    if (!map[key]) {
      map[key] = { method: m, amount: 0, currency: curr }
    }
    map[key].amount += Number(p.payment_amount || p.amount || 0)
  }
  return Object.values(map)
})

async function fetchParticipants() {
  isLoading.value = true
  try {
    const [partRes, payRes] = await Promise.all([
      get(`/tournaments/${eventId.value}/participants`).catch(() => ({ participants: [] })),
      get(`/tournaments/${eventId.value}/payments`).catch(() => ({ invoices: [] }))
    ])
    participants.value = partRes?.participants || partRes?.data || (Array.isArray(partRes) ? partRes : [])
    invoices.value = payRes?.invoices || payRes?.data || (Array.isArray(payRes) ? payRes : [])
  } catch {
    participants.value = []
    invoices.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchParticipants)

definePageMeta({ layout: 'dashboard' })
</script>
<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <DashboardHeader
      :title="t('org_revenue.header_title')"
      :subtitle="t('org_revenue.header_subtitle')"
      icon="ph:coins-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('events.list.title'), to: '/dashboard/organizer/tournaments' },
        { label: t('org_revenue.header_title') }
      ]"
    />

    <!-- Revenue Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div class="text-xs font-bold text-slate-500 capitalize tracking-wider mb-1">{{ t("org_revenue.gross_revenue") }}</div>
        <div class="text-2xl font-black text-navy dark:text-white">Rp {{ grossRevenue.toLocaleString('id-ID') }}</div>
      </div>
      <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div class="text-xs font-bold text-slate-500 capitalize tracking-wider mb-1">{{ t("org_revenue.platform_fee") }}</div>
        <div class="text-2xl font-black text-amber-600">Rp {{ platformFee.toLocaleString('id-ID') }}</div>
      </div>
      <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div class="text-xs font-bold text-slate-500 capitalize tracking-wider mb-1">{{ t("org_revenue.net_revenue") }}</div>
        <div class="text-2xl font-black text-emerald-600">Rp {{ netRevenue.toLocaleString('id-ID') }}</div>
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
          <div v-for="(amount, method) in methodBreakdown" :key="method" class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50">
            <div class="flex items-center gap-3">
              <Icon icon="ph:credit-card-bold" class="text-primary text-xl" />
              <span class="font-bold text-navy dark:text-white text-sm capitalize">{{ method }}</span>
            </div>
            <span class="font-mono font-black text-navy dark:text-white text-sm">Rp {{ amount.toLocaleString('id-ID') }}</span>
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

const { t } = useI18n()
const route = useRoute()
const { get } = useApi()

const eventId = computed(() => route.params.id as string)

useHead({
  title: computed(() => (t ? t('org_revenue.header_title') : 'Pendapatan Event') + ' - Archeris Dashboard')
})
const isLoading = ref(true)
const participants = ref<any[]>([])
const invoices = ref<any[]>([])

const paidParticipants = computed(() =>
  participants.value.filter(p => p.payment_status === 'paid' || p.payment_status === 'lunas')
)

const paidCount = computed(() => paidParticipants.value.length)

const grossRevenue = computed(() =>
  paidParticipants.value.reduce((sum, p) => sum + (p.payment_amount || p.amount || 0), 0)
)

const platformFee = computed(() => grossRevenue.value * 0.05)
const netRevenue = computed(() => grossRevenue.value * 0.95)

const methodBreakdown = computed(() => {
  const map: Record<string, number> = {}
  
  if (invoices.value && invoices.value.length > 0) {
    const paidInvoices = invoices.value.filter((inv: any) => inv.status === 'paid' || inv.status === 'lunas' || inv.status === 'settlement')
    for (const inv of paidInvoices) {
      const rawMethod = (inv.payment_method || inv.method || 'online').toLowerCase()
      let label = 'Gateway Online (Mayar)'
      if (rawMethod === 'manual') label = 'Transfer Bank Manual'
      else if (rawMethod === 'cash') label = 'Tunai (Cash Desk)'
      else if (rawMethod === 'paypal') label = 'PayPal'
      
      const amt = Number(inv.total_amount || inv.amount || 0)
      map[label] = (map[label] || 0) + amt
    }
  }
  
  if (Object.keys(map).length === 0) {
    for (const p of paidParticipants.value) {
      const m = (p.payment_method || 'Online Gateway').toUpperCase()
      map[m] = (map[m] || 0) + (Number(p.payment_amount || p.amount || 0))
    }
  }
  
  return map
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
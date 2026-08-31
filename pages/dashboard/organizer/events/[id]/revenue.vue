<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: 0.2;"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
      <div class="relative p-6 sm:p-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="h-14 w-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Icon icon="ph:coins-bold" class="text-primary text-2xl" />
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-black tracking-tight">{{ t("org_revenue.header_title") }}</h1>
              <div class="text-slate-300 text-sm mt-1">{{ t("org_revenue.header_subtitle") }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
        <h3 class="font-black text-navy dark:text-white text-lg">{{ t("org_revenue.method_breakdown_title") }}</h3>
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
        <h3 class="font-black text-navy dark:text-white text-lg">{{ t("org_revenue.financial_actions_title") }}</h3>
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
const isLoading = ref(true)
const participants = ref<any[]>([])

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
  for (const p of paidParticipants.value) {
    const m = (p.payment_method || 'GATEWAY').toUpperCase()
    map[m] = (map[m] || 0) + (p.payment_amount || p.amount || 0)
  }
  return map
})

async function fetchParticipants() {
  isLoading.value = true
  try {
    const res = await get(`/events/${eventId.value}/participants`)
    participants.value = res?.participants || res?.data || []
  } catch { participants.value = [] }
  finally { isLoading.value = false }
}

onMounted(fetchParticipants)

definePageMeta({ layout: 'dashboard' })
</script>
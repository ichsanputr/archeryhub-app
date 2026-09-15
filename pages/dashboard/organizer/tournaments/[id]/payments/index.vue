<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <DashboardHeader
      :title="t('org_event_payments.title', 'Pembayaran & Keuangan Event')"
      :subtitle="t('org_event_payments.subtitle', 'Monitor transaksi pendaftaran, bukti transfer, dan status pembayaran peserta.')"
      icon="ph:credit-card-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('events.list.title', 'Event Saya'), to: '/dashboard/organizer/tournaments' },
        { label: t('org_event_payments.title', 'Pembayaran') }
      ]"
    />

    <!-- Filters & Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div class="text-xs font-bold text-slate-500 capitalize tracking-wider mb-1">{{ t("org_event_payments.total_revenue") }}</div>
        <div class="text-2xl font-black text-emerald-600">Rp {{ totalIncome.toLocaleString('id-ID') }}</div>
      </div>
      <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div class="text-xs font-bold text-slate-500 capitalize tracking-wider mb-1">{{ t("org_event_payments.paid_participants") }}</div>
        <div class="text-2xl font-black text-navy dark:text-white">{{ t("org_event_payments.paid_count_unit", { count: paidCount }) }}</div>
      </div>
      <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div class="text-xs font-bold text-slate-500 capitalize tracking-wider mb-1">{{ t("org_event_payments.pending_manual") }}</div>
        <div class="text-2xl font-black text-amber-600">{{ t("org_event_payments.pending_count_unit", { count: pendingManualCount }) }}</div>
      </div>
    </div>

    <!-- Payment List Table -->
    <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-wrap gap-4 items-center justify-between">
        <h3 class="font-black text-navy dark:text-white text-lg">{{ t("org_event_payments.transaction_list") }}</h3>
        <div class="flex gap-3">
          <div class="relative w-64">
            <Icon icon="ph:magnifying-glass-bold" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input v-model="search" type="text" :placeholder="t('org_event_payments.search_placeholder')" class="w-full h-10 pl-9 pr-4 text-xs font-medium bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-navy dark:text-white placeholder:text-slate-400" />
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="p-12 text-center text-slate-500">{{ t("org_event_payments.loading_payments") }}</div>

      <div v-else-if="filteredPayments.length === 0" class="p-12 text-center text-slate-500">
        {{ t("org_event_payments.no_data") }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 text-slate-500 font-bold capitalize tracking-wider">
              <th class="p-4">{{ t("org_event_payments.th_reference") }}</th>
              <th class="p-4">{{ t("org_event_payments.th_participant") }}</th>
              <th class="p-4">{{ t("org_event_payments.th_category") }}</th>
              <th class="p-4">{{ t("org_event_payments.th_method") }}</th>
              <th class="p-4">{{ t("org_event_payments.th_amount") }}</th>
              <th class="p-4">{{ t("org_event_payments.th_status") }}</th>
              <th class="p-4 text-right">{{ t("org_event_payments.th_action") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
            <tr v-for="p in filteredPayments" :key="p.uuid || p.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
              <td class="p-4 font-mono font-bold text-navy dark:text-white">{{ p.reference || p.uuid }}</td>
              <td class="p-4 font-bold text-slate-800 dark:text-slate-200">{{ p.full_name || p.archer_name }}</td>
              <td class="p-4 text-slate-600 dark:text-slate-400">{{ p.category_name || '-' }}</td>
              <td class="p-4 capitalize font-bold text-slate-600 dark:text-slate-400">{{ p.payment_method || 'GATEWAY' }}</td>
              <td class="p-4 font-black text-navy dark:text-white">Rp {{ (p.amount || p.total_amount || 0).toLocaleString('id-ID') }}</td>
              <td class="p-4">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-black capitalize"
                  :class="p.payment_status === 'paid' || p.payment_status === 'lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
                  {{ p.payment_status || 'PENDING' }}
                </span>
              </td>
              <td class="p-4 text-right space-x-2">
                <button v-if="p.payment_method === 'manual' && p.payment_status !== 'paid'"
                  @click="verifyPayment(p)" class="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold text-[10px] hover:bg-emerald-700 transition-colors">
                  {{ t("org_event_payments.btn_approve") }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

const route = useRoute()
const { get, post } = useApi()
const toast = useToast()

const eventId = computed(() => route.params.id as string)

useHead({
  title: 'Verifikasi Pembayaran - Archeris Dashboard'
})
const isLoading = ref(true)
const payments = ref<any[]>([])
const search = ref('')

const filteredPayments = computed(() => {
  if (!search.value) return payments.value
  const q = search.value.toLowerCase()
  return payments.value.filter(p =>
    (p.full_name || '').toLowerCase().includes(q) ||
    (p.reference || '').toLowerCase().includes(q)
  )
})

const totalIncome = computed(() =>
  payments.value
    .filter(p => p.payment_status === 'paid' || p.payment_status === 'lunas')
    .reduce((sum, p) => sum + (p.amount || p.total_amount || 0), 0)
)

const paidCount = computed(() =>
  payments.value.filter(p => p.payment_status === 'paid' || p.payment_status === 'lunas').length
)

const pendingManualCount = computed(() =>
  payments.value.filter(p => p.payment_method === 'manual' && p.payment_status !== 'paid').length
)

async function fetchPayments() {
  isLoading.value = true
  try {
    const res = await get(`/tournaments/${eventId.value}/participants`)
    payments.value = res?.participants || res?.data || []
  } catch {
    payments.value = []
  } finally {
    isLoading.value = false
  }
}

async function verifyPayment(p: any) {
  if (!confirm(`Verifikasi pembayaran untuk ${p.full_name}?`)) return
  try {
    await post(`/tournaments/${eventId.value}/participants/${p.uuid || p.id}/verify-payment`, { status: 'paid' })
    toast.success('Pembayaran berhasil diverifikasi')
    await fetchPayments()
  } catch (err: any) {
    toast.error(err?.data?.error || 'Gagal memverifikasi pembayaran')
  }
}

onMounted(fetchPayments)

definePageMeta({ layout: 'dashboard' })
</script>
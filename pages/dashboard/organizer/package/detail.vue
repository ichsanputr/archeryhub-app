<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from '#app'
import { usePayment } from '~/composables/usePayment'
import { useAuth } from '~/composables/useAuth'
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: 'dashboard'
})

const { t, locale } = useI18n()
useHead({ title: computed(() => t('package_detail.page_title') + ' - Archeris Dashboard') })

const route = useRoute()
const payment = usePayment()
const { organizerProfile } = useAuth()
const apiBaseUrl = useApiBaseUrl()

const reference = computed(() => (route.query.trx_id || route.query.ref || route.params.id || '').toString())

const tx = ref<any>({})
const isLoading = ref(true)
const errorMsg = ref('')
const activeGroupIdx = ref(0)

const isPaid = computed(() => {
  const s = (tx.value.status || tx.value.payment_status || '').toLowerCase()
  return s === 'paid' || s === 'completed' || s === 'sukses' || s === 'success' || s === 'settlement' || s === 'lunas' || s === 'done' || s === 'verified'
})

const isPending = computed(() => {
  if (isPaid.value) return false
  const s = (tx.value.status || tx.value.payment_status || '').toLowerCase()
  return s === 'pending' || s === 'unpaid' || s === 'waiting' || s === 'awaiting_payment' || s === 'menunggu'
})

const statusBadgeClasses = computed(() => {
  if (isPaid.value) return 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-black'
  if (isPending.value) return 'bg-amber-50 text-amber-800 border-amber-200/80 font-black'
  return 'bg-rose-50 text-rose-800 border-rose-200/80 font-black'
})

function formatStatus(status: string) {
  if (!status) return t('package_detail.status_pending')
  const s = status.toLowerCase()
  if (s === 'paid') return t('package_detail.status_paid')
  if (s === 'pending') return t('package_detail.status_pending')
  if (s === 'expired') return t('package_detail.status_expired')
  if (s === 'failed') return t('package_detail.status_failed')
  return status
}

function formatPaymentMethodName(method: string) {
  if (!method) return t('package_detail.method_mayar')
  const m = method.toUpperCase()
  if (m === 'MAYAR') return t('package_detail.method_mayar')
  if (m === 'QRIS') return t('package_detail.method_qris_full')
  if (m === 'MYBCAVA' || m === 'BCAVA' || m === 'BCA') return t('package_detail.method_bca_va')
  if (m === 'BRIVA' || m === 'BRI') return t('package_detail.method_bri_va')
  if (m === 'MANDIRIVA' || m === 'MANDIRI') return t('package_detail.method_mandiri_va')
  if (m === 'BNIVA' || m === 'BNI') return t('package_detail.method_bni_va')
  if (m === 'PERMATAVA' || m === 'PERMATA') return t('package_detail.method_permata_va')
  return method
}

const isTxUSD = computed(() => {
  const cur = (tx.value?.currency || '').toUpperCase()
  const meth = (tx.value?.payment_method || '').toLowerCase()
  return cur === 'USD' || meth === 'paypal'
})

function formatTxAmount(val: any) {
  const num = Number(val || 0)
  if (isTxUSD.value) {
    return `$${num.toFixed(2)}`
  }
  return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`
}

function formatNumber(val: any) {
  const num = Number(val)
  if (isNaN(num)) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

function formatExpiry(val: any) {
  if (!val) return '-'
  if (typeof val === 'number') {
    return new Date(val * 1000).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
  return new Date(val).toLocaleString('id-ID')
}

function getInvoicePdfUrl(ref: string) {
  return `${apiBaseUrl}/payment/invoice/${ref}`
}

function printInvoice() {
  window.print()
}

const instructionGroups = computed(() => {
  if (!tx.value || !tx.value.instructions) return []
  try {
    const parsed = typeof tx.value.instructions === 'string' ? JSON.parse(tx.value.instructions) : tx.value.instructions
    if (Array.isArray(parsed)) {
      return parsed.map((g: any) => ({ title: g.title || 'Petunjuk', steps: Array.isArray(g.steps) ? g.steps : [] })).filter((g: any) => g.steps.length > 0)
    }
  } catch {}
  return []
})

const activeGroupSteps = computed(() => {
  const groups = instructionGroups.value
  if (groups && groups[activeGroupIdx.value]) {
    return groups[activeGroupIdx.value].steps || []
  }
  return []
})

async function loadDetails() {
  if (!reference.value) {
    errorMsg.value = t('package_detail.id_missing')
    isLoading.value = false
    return
  }
  isLoading.value = true
  errorMsg.value = ''
  try {
    const res: any = await payment.getPaymentStatus(reference.value)
    if (res) {
      tx.value = res
    } else {
      errorMsg.value = t('package_detail.tx_not_found')
    }
  } catch (err: any) {
    errorMsg.value = err?.data?.error || t('package_detail.load_failed')
  } finally {
    isLoading.value = false
  }
}

let pollingInterval: any = null

onMounted(async () => {
  const token = route.query.token
  const payerId = route.query.PayerID
  if (token) {
    try {
      await $fetch(`${apiBaseUrl}/payment/paypal/capture`, {
        method: 'POST',
        body: { order_id: token, reference: reference.value }
      })
    } catch (e) {
      console.error('PayPal auto-capture error:', e)
    }
  }

  loadDetails()
  pollingInterval = setInterval(async () => {
    if (isPaid.value || !isPending.value) return
    try {
      const res: any = await payment.getPaymentStatus(reference.value)
      if (res) tx.value = res
    } catch {}
  }, 5000)
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
})
</script>

<template>
  <div class="space-y-6 pb-16">
    
    <!-- ── 1. Standard Dashboard Header (Hidden on Print) ── -->
    <DashboardHeader
      class="print:hidden"
      :title="t('package_detail.page_title')"
      :subtitle="`${t('package_detail.invoice_number')}: ${tx.reference || reference}`"
      icon="ph:receipt-bold"
      :breadcrumbs="[
        { label: t('package_detail.breadcrumb_package'), to: '/dashboard/organizer/package' },
        { label: `Invoice #${tx.reference || reference}` }
      ]"
    >
      <template #actions>
        <button
          type="button"
          @click="printInvoice"
          class="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer">
          <Icon icon="ph:printer-bold" class="text-sm" />
          <span>{{ t('package_detail.btn_print') }}</span>
        </button>


      </template>
    </DashboardHeader>

    <!-- ── 2. Loading State ── -->
    <div v-if="isLoading" class="w-full bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-xs print:hidden">
      <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin mb-3 mx-auto" />
      <div class="text-slate-600 font-bold text-sm">{{ t('package_detail.loading') }}</div>
    </div>

    <!-- ── 3. Error State ── -->
    <div v-else-if="errorMsg" class="w-full bg-white rounded-3xl border border-gray-100 p-10 text-center shadow-xs space-y-4 print:hidden">
      <div class="size-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-100">
        <Icon icon="ph:warning-circle-bold" class="text-3xl" />
      </div>
      <h2 class="text-base font-black text-navy">{{ t('package_detail.not_found_title') }}</h2>
      <div class="text-slate-500 text-xs font-medium max-w-md mx-auto">{{ errorMsg }}</div>
      <NuxtLink to="/dashboard/organizer/package" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy text-white text-xs font-bold">
        {{ t('package_detail.btn_back_to_packages') }}
      </NuxtLink>
    </div>

    <!-- ── 4. Main 1-Column Dashboard View ── -->
    <div v-else class="w-full space-y-6 print:hidden">
      
      <!-- A. STATUS HERO BANNER -->
      <!-- Paid Hero Banner -->
      <div v-if="isPaid" class="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xs">
        <div class="flex items-start gap-4">
          <div class="size-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
            <Icon icon="ph:check-bold" class="text-2xl" />
          </div>
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black capitalize tracking-wider bg-emerald-100 text-emerald-800">
                {{ t('package_detail.paid_badge') }}
              </span>
              <span class="text-xs text-slate-400 font-semibold">{{ formatDate(tx.purchased_at || tx.created_at) }}</span>
            </div>
            <div class="text-base sm:text-lg font-black text-navy">{{ t('package_detail.paid_title') }}</div>
            <div class="text-xs text-slate-500 font-medium">
              {{ t('package_detail.paid_desc') }}
            </div>
          </div>
        </div>

      </div>

      <!-- Pending Hero Banner (Warm Gold/Amber Vibrant Inner Card - No Dull Gray) -->
      <div v-else-if="isPending" class="bg-white rounded-3xl border border-amber-200/60 p-6 sm:p-7 shadow-sm space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-100">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Icon icon="ph:clock-bold" class="text-xl" />
            </div>
            <div>
              <div class="text-xs font-bold text-slate-400 capitalize tracking-wider">{{ t('package_detail.status_label') }}</div>
              <div class="text-base font-black text-navy">{{ t('package_detail.awaiting_payment') }}</div>
            </div>
          </div>
          <div v-if="tx.expiry_date" class="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-900 text-xs font-bold flex items-center gap-1.5 w-fit">
            <Icon icon="ph:hourglass-medium-bold" class="text-sm text-amber-600" />
            <span>{{ t('package_detail.pay_before') }}: {{ formatExpiry(tx.expiry_date) }}</span>
          </div>
        </div>

        <!-- PayPal Card if payment_method is paypal -->
        <div v-if="tx.payment_method === 'paypal'"
          class="bg-gradient-to-br from-blue-500/10 via-sky-50/70 to-blue-500/20 border-2 border-blue-400/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="space-y-1">
              <div class="text-sm sm:text-base font-black text-navy flex items-center gap-2">
                <Icon icon="logos:paypal" class="text-xl" />
                <span>{{ t('package_detail.pay_via_paypal_title') }}</span>
              </div>
              <div class="text-xs text-slate-600 font-medium leading-relaxed max-w-lg">
                {{ t('package_detail.pay_via_paypal_desc') }}
              </div>
            </div>
            <div class="sm:text-right shrink-0">
              <span class="text-[10px] font-bold text-slate-400 capitalize tracking-wider block">{{ t('package_detail.total_paid') }}</span>
              <span class="text-xl sm:text-2xl font-black text-navy tabular-nums">
                {{ formatTxAmount(tx.total_amount || tx.amount || 0) }}
                <span v-if="!isTxUSD" class="text-xs font-mono font-bold text-blue-600 block">
                  (~${{ (Math.ceil(((tx.total_amount || tx.amount || 0) / 16000) * 100) / 100).toFixed(2) }} USD)
                </span>
              </span>
            </div>
          </div>

          <a v-if="tx.checkout_url" :href="tx.checkout_url" target="_blank" rel="noopener noreferrer"
            class="w-full py-4 px-6 bg-[#0070ba] hover:bg-[#005ea6] text-white rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer">
            <Icon icon="logos:paypal" class="text-xl" />
            <span>{{ t('package_detail.btn_pay_now_paypal') }}</span>
          </a>

          <div class="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-600 font-semibold">
            <span class="text-slate-400">{{ t('package_detail.available_methods_label') }}</span>
            <span class="px-2.5 py-0.5 rounded-lg bg-white border border-blue-200/80 font-bold text-slate-800 shadow-2xs">Saldo PayPal</span>
            <span class="px-2.5 py-0.5 rounded-lg bg-white border border-blue-200/80 font-bold text-slate-800 shadow-2xs">Visa</span>
            <span class="px-2.5 py-0.5 rounded-lg bg-white border border-blue-200/80 font-bold text-slate-800 shadow-2xs">Mastercard</span>
            <span class="px-2.5 py-0.5 rounded-lg bg-white border border-blue-200/80 font-bold text-slate-800 shadow-2xs">AMEX</span>
          </div>
        </div>

        <!-- Mayar Card (Default Domestik) -->
        <div v-else
          class="bg-gradient-to-br from-amber-500/10 via-amber-50/70 to-primary/20 border-2 border-primary/60 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="space-y-1">
              <div class="text-sm sm:text-base font-black text-navy flex items-center gap-2">
                <Icon icon="ph:shield-check-fill" class="text-primary text-lg" />
                <span>{{ t('package_detail.pay_via_mayar_title') }}</span>
              </div>
              <div class="text-xs text-slate-600 font-medium leading-relaxed max-w-lg">
                {{ t('package_detail.pay_via_mayar_desc') }}
              </div>
            </div>
            <div class="sm:text-right shrink-0">
              <span class="text-[10px] font-bold text-slate-400 capitalize tracking-wider block">{{ t('package_detail.total_paid') }}</span>
              <span class="text-xl sm:text-2xl font-black text-navy tabular-nums">{{ formatTxAmount(tx.total_amount || tx.amount || 0) }}</span>
            </div>
          </div>

          <!-- Single Direct Payment CTA Button -->
          <a v-if="tx.checkout_url" :href="tx.checkout_url" target="_blank" rel="noopener noreferrer"
            class="w-full py-4 px-6 bg-primary hover:bg-primary-hover text-navy rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer">
            <Icon icon="ph:arrow-square-out-bold" class="text-xl" />
            <span>{{ t('package_detail.btn_pay_now') }}</span>
          </a>

          <!-- Supported Payment Methods -->
          <div class="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-600 font-semibold">
            <span class="text-slate-400">{{ t('package_detail.available_methods') }}:</span>
            <span class="px-2.5 py-0.5 rounded-lg bg-white border border-amber-200/80 font-bold text-slate-800 shadow-2xs">{{ t('package_detail.method_qris') }}</span>
            <span class="px-2.5 py-0.5 rounded-lg bg-white border border-amber-200/80 font-bold text-slate-800 shadow-2xs">BCA VA</span>
            <span class="px-2.5 py-0.5 rounded-lg bg-white border border-amber-200/80 font-bold text-slate-800 shadow-2xs">Mandiri VA</span>
            <span class="px-2.5 py-0.5 rounded-lg bg-white border border-amber-200/80 font-bold text-slate-800 shadow-2xs">BRI VA</span>
            <span class="px-2.5 py-0.5 rounded-lg bg-white border border-amber-200/80 font-bold text-slate-800 shadow-2xs">BNI VA</span>
            <span class="px-2.5 py-0.5 rounded-lg bg-white border border-amber-200/80 font-bold text-slate-800 shadow-2xs">Permata VA</span>
          </div>
        </div>
      </div>

      <!-- B. MAIN INVOICE ORDER CARD -->
      <div class="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
        
        <!-- Invoice Metadata Header -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-gray-100 text-xs">
          <div class="space-y-1">
            <span class="text-slate-400 font-bold block">{{ t('package_detail.invoice_number') }}</span>
            <span class="font-mono font-black text-navy truncate block select-all">{{ tx.reference || reference }}</span>
          </div>
          <div class="space-y-1">
            <span class="text-slate-400 font-bold block">{{ t('package_detail.purchase_time') }}</span>
            <span class="font-bold text-navy block">{{ formatDate(tx.purchased_at || tx.created_at) }}</span>
          </div>
          <div class="space-y-1">
            <span class="text-slate-400 font-bold block">{{ t('package_detail.method_label') }}</span>
            <span class="font-bold text-navy block capitalize">{{ formatPaymentMethodName(tx.payment_method) }}</span>
          </div>
          <div class="space-y-1">
            <span class="text-slate-400 font-bold block">{{ t('package_detail.status') }}</span>
            <span :class="statusBadgeClasses" class="px-2.5 py-0.5 rounded-lg text-[10px] font-black capitalize border shadow-2xs inline-block">
              {{ formatStatus(tx.status || tx.payment_status) }}
            </span>
          </div>
        </div>

        <!-- Service Itemized Breakdown -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-navy flex items-center gap-2">
              <Icon icon="ph:list-dashes-bold" class="text-primary text-base" />
              <span>{{ t('package_detail.item_details') }}</span>
            </h3>
            <span class="text-xs font-bold text-slate-400">{{ t('package_detail.item_count', { count: 1 }) }}</span>
          </div>

          <div class="border border-gray-100 rounded-2xl overflow-hidden overflow-x-auto">
            <table class="w-full text-left text-xs min-w-[480px]">
              <thead class="bg-slate-50 text-slate-500 font-bold border-b border-gray-100">
                <tr>
                  <th class="py-3 px-4">{{ t('package_detail.col_item') }}</th>
                  <th class="py-3 px-4 text-center">{{ t('package_detail.col_qty') }}</th>
                  <th class="py-3 px-4 text-right">{{ t('package_detail.col_unit_price') }}</th>
                  <th class="py-3 px-4 text-right">{{ t('package_detail.col_subtotal') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 font-medium">
                <tr>
                  <td class="py-4 px-4">
                    <div class="font-black text-navy text-xs sm:text-sm">{{ tx.plan_name || 'Paket Kuota Event' }}</div>
                    <div class="text-[11px] text-slate-400 mt-0.5">{{ t('package_detail.quota_note') }}</div>
                  </td>
                  <td class="py-4 px-4 text-center font-black text-navy">
                    {{ tx.quantity || 1 }} {{ t('package_detail.event_unit') }}
                  </td>
                  <td class="py-4 px-4 text-right font-bold text-slate-600">
                    {{ formatTxAmount((tx.total_amount || tx.amount || 0) / (tx.quantity || 1)) }}
                  </td>
                  <td class="py-4 px-4 text-right font-black text-navy text-xs sm:text-sm">
                    {{ formatTxAmount(tx.total_amount || tx.amount || 0) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Total Calculation Breakdown -->
          <div class="pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div class="text-xs text-slate-400 space-y-1">
              <div>{{ t('package_detail.official_receipt_note') }}</div>
              <div class="text-[11px] text-slate-400">{{ t('package_detail.tax_note') }}</div>
            </div>

            <div class="w-full sm:w-64 space-y-2 text-xs">
              <div class="flex justify-between text-slate-500">
                <span>{{ t('package_detail.col_subtotal') }}</span>
                <span class="font-bold text-navy">{{ formatTxAmount(tx.total_amount || tx.amount || 0) }}</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>{{ t('package_detail.admin_fee') }}</span>
                <span class="font-bold text-emerald-600">{{ isTxUSD ? '$0.00' : t('package_detail.free') }}</span>
              </div>
              <div class="h-px bg-slate-100 my-1"></div>
              <div class="flex justify-between items-baseline">
                <span class="text-xs font-black text-navy">{{ t('package_detail.total_payment') }}</span>
                <span class="text-lg sm:text-xl font-black text-navy tabular-nums">
                  {{ formatTxAmount(tx.total_amount || tx.amount || 0) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- C. PAYMENT INSTRUCTIONS (If Pending) -->
        <div v-if="isPending && instructionGroups.length > 0" class="border-t border-gray-100 pt-6 space-y-4">
          <h4 class="text-sm font-black text-navy flex items-center gap-2">
            <Icon icon="ph:info-bold" class="text-primary text-base" />
            <span>{{ t('package_detail.instructions_title') }}</span>
          </h4>

          <div class="flex flex-wrap gap-2">
            <button v-for="(group, idx) in instructionGroups" :key="idx"
              type="button"
              @click="activeGroupIdx = idx"
              :class="activeGroupIdx === idx ? 'bg-navy text-white font-black' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold'"
              class="px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer">
              {{ group.title }}
            </button>
          </div>

          <ol class="space-y-2 text-xs text-slate-600 font-medium pl-4 list-decimal leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <li v-for="(step, sIdx) in activeGroupSteps" :key="sIdx">
              {{ step }}
            </li>
          </ol>
        </div>

        <!-- D. Bottom Navigation Links (Clean & Non-repetitive) -->
        <div class="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 text-xs text-slate-400">
            <Icon icon="ph:shield-check-bold" class="text-emerald-500 text-base" />
            <span>{{ t('package_detail.security_title') }} (Mayar SSL 256-bit)</span>
          </div>

          <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">


            <NuxtLink to="/dashboard/organizer/package"
              class="px-4 py-2.5 rounded-xl bg-navy hover:bg-navy-dark text-white text-xs font-bold transition-all flex items-center gap-1.5 w-full sm:w-auto justify-center shadow-xs">
              <span>{{ t('package_detail.btn_back') }}</span>
            </NuxtLink>
          </div>
        </div>

      </div>

    </div>

    <!-- ── 5. Standard Clean HTML Invoice (Print Mode - Beautiful Professional Layout) ── -->
    <div class="hidden print:block text-slate-800 bg-white font-sans a4-invoice-container p-6 sm:p-8">
      
      <!-- Invoice Top Bar: Logo & Invoice Header -->
      <div class="flex justify-between items-start border-b-2 border-slate-900 pb-5 mb-6">
        <div>
          <div class="text-2xl font-black text-slate-900 tracking-tight">Archeris.net</div>
          <div class="text-xs text-slate-700 font-bold mt-1">{{ t('package_detail.company_name') }}</div>
          <div class="text-[11px] text-slate-500">{{ t('package_detail.platform_subtitle') }}</div>
          <div class="text-[11px] text-slate-400">{{ t('package_detail.location_info') }}</div>
        </div>

        <div class="text-right">
          <div class="text-2xl font-black tracking-widest text-slate-900">{{ t('package_detail.invoice_label') }}</div>
          <div class="font-mono text-xs font-bold text-slate-700 mt-1">{{ t('package_detail.invoice_no_prefix') }} {{ tx.reference || reference }}</div>
          <div class="text-xs text-slate-500 mt-0.5">{{ t('package_detail.date_label') }}: {{ formatDate(tx.purchased_at || tx.created_at) }}</div>
          <div class="mt-2">
            <span class="inline-block px-3 py-1 rounded-md text-[11px] font-black border"
              :class="isPaid ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-amber-50 text-amber-900 border-amber-300'">
              {{ isPaid ? t('package_detail.status_paid') : t('package_detail.status_pending') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Bill-To / Publisher Information -->
      <div class="grid grid-cols-2 gap-8 mb-6 text-xs">
        <div class="space-y-1">
          <div class="text-[10px] font-bold text-slate-400 capitalize tracking-wider">{{ t('package_detail.issued_by') }}</div>
          <div class="font-black text-slate-900">{{ t('package_detail.billing_dept') }}</div>
          <div class="text-slate-600">{{ t('package_detail.company_name') }}</div>
          <div class="text-slate-400">https://archeris.net</div>
        </div>

        <div class="space-y-1">
          <div class="text-[10px] font-bold text-slate-400 capitalize tracking-wider">{{ t('package_detail.billed_to') }}</div>
          <div class="font-black text-slate-900">{{ organizerProfile?.name || tx.organizer_name || t('package_detail.default_organizer') }}</div>
          <div class="text-slate-600">{{ organizerProfile?.email || tx.organizer_email || '-' }}</div>
          <div class="text-slate-400">{{ t('package_detail.official_organizer_role') }}</div>
        </div>
      </div>

      <!-- Clean Itemized Table with Light Borders -->
      <table class="w-full text-left text-xs mb-6 border-collapse">
        <thead>
          <tr class="border-y border-slate-300 text-slate-700 font-black bg-slate-50">
            <th class="py-2.5 px-3 w-10">{{ t('package_detail.col_no') }}</th>
            <th class="py-2.5 px-3">{{ t('package_detail.col_item') }}</th>
            <th class="py-2.5 px-3 text-center w-24">{{ t('package_detail.col_qty') }}</th>
            <th class="py-2.5 px-3 text-right w-32">{{ t('package_detail.col_unit_price') }}</th>
            <th class="py-2.5 px-3 text-right w-36">{{ isTxUSD ? 'Total (USD)' : t('package_detail.col_total_idr') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr>
            <td class="py-3.5 px-3 text-slate-400 font-medium">1</td>
            <td class="py-3.5 px-3">
              <div class="font-bold text-slate-900">{{ tx.plan_name || 'Paket Kuota Event' }}</div>
              <div class="text-[10px] text-slate-500 mt-0.5">{{ t('package_detail.quota_note') }}</div>
            </td>
            <td class="py-3.5 px-3 text-center font-semibold text-slate-800">{{ tx.quantity || 1 }} {{ t('package_detail.event_unit') }}</td>
            <td class="py-3.5 px-3 text-right text-slate-700 font-medium">{{ formatTxAmount((tx.total_amount || tx.amount || 0) / (tx.quantity || 1)) }}</td>
            <td class="py-3.5 px-3 text-right font-black text-slate-900">{{ formatTxAmount(tx.total_amount || tx.amount || 0) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals & Payment Summary -->
      <div class="flex justify-between items-start border-t border-slate-300 pt-4 mb-6 text-xs">
        <div class="space-y-1 text-slate-600 max-w-xs">
          <div class="font-black text-slate-900">{{ t('package_detail.payment_info_title') }}</div>
          <div>{{ t('package_detail.method_label') }}: {{ formatPaymentMethodName(tx.payment_method) }}</div>
          <div>{{ t('package_detail.status') }}: {{ isPaid ? t('package_detail.status_paid') : t('package_detail.status_pending') }}</div>
        </div>

        <div class="w-64 space-y-1.5 text-right">
          <div class="flex justify-between text-slate-600">
            <span>{{ t('package_detail.col_subtotal') }}:</span>
            <span class="font-semibold text-slate-900">{{ formatTxAmount(tx.total_amount || tx.amount || 0) }}</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>{{ t('package_detail.admin_fee') }}:</span>
            <span class="font-semibold text-emerald-700">{{ isTxUSD ? '$0.00' : t('package_detail.free') }}</span>
          </div>
          <div class="border-t border-slate-300 pt-2 flex justify-between text-sm font-black text-slate-900">
            <span>{{ t('package_detail.total_payment') }}:</span>
            <span class="text-base">{{ formatTxAmount(tx.total_amount || tx.amount || 0) }}</span>
          </div>
        </div>
      </div>

      <!-- Professional Authorization & Terms Footer in Print Mode -->
      <div class="grid grid-cols-2 gap-8 border-t border-slate-200 pt-6 mb-6 text-xs">
        <div class="space-y-1 text-slate-500">
          <div class="font-bold text-slate-800">{{ t('package_detail.terms_title') }}</div>
          <div class="text-[10px] leading-relaxed text-slate-600">{{ t('package_detail.terms_desc') }}</div>
          <div class="text-[10px] leading-relaxed text-slate-600">{{ t('package_detail.terms_desc_2') }}</div>
        </div>

        <div class="text-right space-y-1.5 flex flex-col items-end">
          <div class="text-[10px] text-slate-400 font-semibold">{{ t('package_detail.authorized_by') }}</div>
          <div class="px-4 py-2 border-2 border-emerald-500/40 rounded-xl bg-emerald-50 text-emerald-800 flex items-center gap-2 text-xs font-black tracking-wider">
            <Icon icon="ph:seal-check-bold" class="text-lg text-emerald-600" />
            <span>{{ t('package_detail.verified_stamp') }}</span>
          </div>
          <div class="text-[11px] font-bold text-slate-800">{{ t('package_detail.company_name') }}</div>
        </div>
      </div>

      <!-- Bottom Minimal PDF / Print Footer -->
      <div class="border-t border-slate-200 pt-3 flex justify-between items-center text-[10px] text-slate-400">
        <div>
          {{ t('package_detail.official_receipt_note') }}
        </div>
        <div class="font-bold text-slate-600">
          {{ t('package_detail.digital_receipt_footer') }}
        </div>
      </div>

    </div>

  </div>
</template>

<style>
@page {
  margin: 10mm 12mm;
  size: A4 portrait;
}

@media print {
  html, body {
    background: #ffffff !important;
    color: #0f172a !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
  }

  /* Hide entire dashboard navigation shell */
  nav, aside, header, footer,
  .app-sidebar, .app-header,
  #app-sidebar, #app-header,
  div[class*="sidebar"],
  div[class*="navbar"] {
    display: none !important;
  }

  /* Reset outer layout spacing */
  main,
  .flex-1,
  div[class*="space-y"] {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  .a4-invoice-container {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>

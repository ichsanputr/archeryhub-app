<template>
  <div class="flex flex-col gap-6 pb-16">
    <!-- Header -->
    <DashboardHeader
      :title="t('archer_payment_detail.header_title')"
      :subtitle="`${t('archer_payment_detail.ref_prefix')} ${reference}`"
      icon="ph:credit-card-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/archer' },
        { label: 'Payments', to: '/dashboard/archer/payments' },
        { label: `Detail #${reference}` }
      ]"
    />

    <!-- Loading -->
    <div v-if="isLoading" class="h-80 bg-white dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-700" />

    <!-- Error / Not found -->
    <div v-else-if="!payment"
      class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-12 text-center">
      <Icon icon="ph:warning-circle-bold" class="text-4xl text-red-500 mb-3 mx-auto" />
      <div class="font-black text-navy dark:text-white text-lg">{{ t("archer_payment_detail.not_found_title") }}</div>
      <div class="text-slate-500 text-sm mt-1 mb-6">{{ t("archer_payment_detail.not_found_desc", { ref: reference }) }}</div>
      <BaseButton to="/dashboard/archer/payments" variant="navy">{{ t("archer_payment_detail.back_to_history") }}</BaseButton>
    </div>

    <!-- Payment Detail Card -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Detail -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-6">
          <!-- Status Banner -->
          <div class="flex items-center justify-between p-4 rounded-2xl" :class="getStatusBgClass(payment.status)">
            <div class="flex items-center gap-3">
              <Icon :icon="getStatusIcon(payment.status)" class="text-2xl" :class="getStatusIconClass(payment.status)" />
              <div>
                <div class="text-xs font-bold capitalize tracking-wider text-slate-500">{{ t("archer_payment_detail.transaction_status") }}</div>
                <div class="font-black text-navy dark:text-white text-lg capitalize">{{ getStatusText(payment.status) }}</div>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-lg text-[10px] font-black capitalize tracking-wider border shadow-2xs" :class="getStatusBadgeClass(payment.status)">
              {{ payment.status }}
            </span>
          </div>

          <!-- Transaction Info -->
          <div class="space-y-4">
            <h3 class="font-black text-navy dark:text-white text-base">{{ t("archer_payment_detail.order_info") }}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div class="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl">
                <div class="text-slate-500 text-xs font-bold mb-1">{{ t("archer_payment_detail.item_event_name") }}</div>
                <div class="font-black text-navy dark:text-white">{{ payment.event_name || payment.plan_name || payment.description || 'Pembayaran' }}</div>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl">
                <div class="text-slate-500 text-xs font-bold mb-1">{{ t("archer_payment_detail.payment_method") }}</div>
                <div class="font-black text-navy dark:text-white capitalize">{{ payment.payment_method || 'Payment Gateway' }}</div>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl">
                <div class="text-slate-500 text-xs font-bold mb-1">{{ t("archer_payment_detail.total_bill") }}</div>
                <div class="font-black text-primary text-xl">Rp {{ (payment.amount || payment.total_amount || 0).toLocaleString('id-ID') }}</div>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl">
                <div class="text-slate-500 text-xs font-bold mb-1">{{ t("archer_payment_detail.transaction_date") }}</div>
                <div class="font-bold text-navy dark:text-white">{{ formatDate(payment.created_at) }}</div>
              </div>
            </div>
          </div>

          <!-- Payment Instructions for Pending VA/QRIS -->
          <div v-if="payment.status === 'pending' || payment.status === 'UNPAID'" class="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 space-y-4">
            <div class="flex items-center gap-2 font-black text-blue-900 dark:text-blue-200 text-sm">
              <Icon icon="ph:info-bold" class="text-lg text-primary" />
              <span>{{ t("archer_payment_detail.payment_instructions") }}</span>
            </div>
            
            <div v-if="payment.pay_code || payment.va_number" class="bg-white dark:bg-slate-800 p-4 rounded-xl flex items-center justify-between border border-blue-100 dark:border-blue-900">
              <div>
                <div class="text-xs text-slate-500 font-bold">{{ t("archer_payment_detail.va_pay_code") }}</div>
                <div class="font-mono font-black text-xl text-navy dark:text-white tracking-wider">{{ payment.pay_code || payment.va_number }}</div>
              </div>
              <BaseButton variant="white" size="xs" @click="copyText(payment.pay_code || payment.va_number)">
                <Icon icon="ph:copy-bold" class="mr-1" /> {{ t("archer_payment_detail.copy") }}
              </BaseButton>
            </div>

            <div v-if="payment.checkout_url" class="pt-2">
              <a :href="payment.checkout_url" target="_blank" class="inline-flex items-center justify-center w-full py-3 bg-primary text-navy font-black rounded-xl hover:bg-yellow-400 transition-colors text-sm shadow-sm">
                <Icon icon="ph:credit-card-bold" class="mr-2" /> {{ t("archer_payment_detail.pay_now") }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Actions -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm space-y-4">
          <h4 class="font-black text-navy dark:text-white text-sm">{{ t("archer_payment_detail.transaction_actions") }}</h4>
          
          <BaseButton :to="`/payment/status/${reference}`" variant="navy" size="md" class="w-full justify-center font-bold">
            <Icon icon="ph:arrow-square-out-bold" class="mr-2" /> {{ t("archer_payment_detail.public_status_page") }}
          </BaseButton>

          <BaseButton v-if="payment.status === 'paid' || payment.status === 'PAID'" 
            :to="`/api/v1/payment/invoice/${reference}`" target="_blank" variant="white" size="md" class="w-full justify-center font-bold">
            <Icon icon="ph:download-simple-bold" class="mr-2" /> {{ t("archer_payment_detail.download_invoice") }}
          </BaseButton>

          <BaseButton to="/dashboard/archer/payments" variant="white" size="md" class="w-full justify-center">
            {{ t("archer_payment_detail.back_to_list") }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const { get } = useApi()

const reference = computed(() => route.params.reference as string)
const isLoading = ref(true)
const payment = ref<any>(null)

async function fetchDetail() {
  isLoading.value = true
  try {
    const res = await get(`/mobile/archer/payments/${reference.value}`)
    payment.value = res?.payment || res?.data || res
  } catch {
    try {
      const res = await get(`/payment/status/${reference.value}`)
      payment.value = res?.payment || res?.data || res
    } catch {
      payment.value = null
    }
  } finally {
    isLoading.value = false
  }
}

function getStatusText(status: string) {
  if (!status) return 'Menunggu'
  const map: any = { paid: 'Lunas / Berhasil', PAID: 'Lunas / Berhasil', pending: 'Menunggu Pembayaran', UNPAID: 'Menunggu Pembayaran', expired: 'Kedaluwarsa', EXPIRED: 'Kedaluwarsa' }
  return map[status] || status
}

function getStatusBadgeClass(status: string) {
  if (status === 'paid' || status === 'PAID') return 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
  if (status === 'pending' || status === 'UNPAID') return 'bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-500/30'
  return 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/30'
}

function getStatusBgClass(status: string) {
  if (status === 'paid' || status === 'PAID') return 'bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20'
  if (status === 'pending' || status === 'UNPAID') return 'bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20'
  return 'bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20'
}

function getStatusIcon(status: string) {
  if (status === 'paid' || status === 'PAID') return 'ph:check-circle-bold'
  if (status === 'pending' || status === 'UNPAID') return 'ph:clock-bold'
  return 'ph:x-circle-bold'
}

function getStatusIconClass(status: string) {
  if (status === 'paid' || status === 'PAID') return 'text-emerald-600'
  if (status === 'pending' || status === 'UNPAID') return 'text-amber-600'
  return 'text-red-600'
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function copyText(text: string) {
  if (text) {
    navigator.clipboard.writeText(text)
  }
}

onMounted(fetchDetail)

definePageMeta({ layout: 'dashboard' })
</script>
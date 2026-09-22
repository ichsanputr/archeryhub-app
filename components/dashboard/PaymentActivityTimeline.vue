<template>
  <div class="p-5 sm:p-6 space-y-5">
    <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
      <div class="flex items-center gap-3">
        <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
          <Icon icon="ph:clock-countdown-bold" class="text-xl" />
        </div>
        <div>
          <h3 class="font-bold text-base sm:text-lg text-navy dark:text-white">
            {{ t('org_event_payments.timeline_title') }}
          </h3>
          <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {{ t('org_event_payments.timeline_subtitle') }}
          </div>
        </div>
      </div>
      <span class="text-xs font-bold text-navy dark:text-slate-200 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 select-none">
        {{ t('org_event_payments.timeline_badge') }}
      </span>
    </div>

    <div class="relative pl-6 sm:pl-7 space-y-6 sm:space-y-7 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
      <!-- Stage 1: Invoice Created -->
      <div class="relative flex items-start gap-3.5">
        <div class="absolute -left-6 sm:-left-7 size-5 sm:size-6 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-800 flex items-center justify-center text-white text-xs font-bold shadow-2xs">
          <Icon icon="ph:check-bold" />
        </div>
        <div class="space-y-1 text-xs sm:text-sm">
          <div class="font-bold text-navy dark:text-white">
            {{ t('org_event_payments.timeline_created_title') }}
          </div>
          <div class="text-slate-500 dark:text-slate-400 leading-relaxed">
            <span>{{ t('org_event_payments.timeline_created_desc', { amount: '' }).split('{amount}')[0] }}</span>
            <strong class="text-navy dark:text-white font-bold">{{ formatAmount(payment?.total_amount || payment?.amount || 0) }}</strong>
            <span>{{ (t('org_event_payments.timeline_created_desc', { amount: '' }).split('{amount}')[1] || '').trim() }}</span>
          </div>
          <div v-if="payment?.created_at" class="text-xs text-slate-400 font-medium font-mono pt-0.5 flex items-center gap-1.5">
            <Icon icon="ph:calendar-blank-bold" class="text-xs shrink-0" />
            <span>{{ formatDateTime(payment.created_at) }}</span>
          </div>
        </div>
      </div>

      <!-- Stage 2: Proof Uploaded (if manual method) -->
      <div v-if="isManual" class="relative flex items-start gap-3.5">
        <div
          class="absolute -left-6 sm:-left-7 size-5 sm:size-6 rounded-full ring-4 ring-white dark:ring-slate-800 flex items-center justify-center text-white text-xs font-bold shadow-2xs"
          :class="hasProof ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'"
        >
          <Icon :icon="hasProof ? 'ph:check-bold' : 'ph:clock-bold'" />
        </div>
        <div class="space-y-1 text-xs sm:text-sm">
          <div class="font-bold text-navy dark:text-white">
            {{ hasProof ? t('org_event_payments.timeline_proof_uploaded_title') : t('org_event_payments.timeline_proof_waiting_title') }}
          </div>
          <div class="text-slate-500 dark:text-slate-400 leading-relaxed">
            <template v-if="hasProof">
              <span>{{ t('org_event_payments.timeline_proof_uploaded_desc') }}</span>
              <span v-if="payment?.sender_name"> (a.n <strong class="text-navy dark:text-white">{{ payment.sender_name }}</strong>)</span>.
            </template>
            <template v-else>
              <span>{{ t('org_event_payments.timeline_proof_waiting_desc') }}</span>
            </template>
          </div>
          <div v-if="payment?.proof_uploaded_at" class="text-xs text-slate-400 font-medium font-mono pt-0.5 flex items-center gap-1.5">
            <Icon icon="ph:calendar-blank-bold" class="text-xs shrink-0" />
            <span>{{ formatDateTime(payment.proof_uploaded_at) }}</span>
          </div>
        </div>
      </div>

      <!-- Stage 3: Final / Verification Status -->
      <div class="relative flex items-start gap-3.5">
        <div
          class="absolute -left-6 sm:-left-7 size-5 sm:size-6 rounded-full ring-4 ring-white dark:ring-slate-800 flex items-center justify-center text-white text-xs font-bold shadow-2xs"
          :class="isPaid ? 'bg-emerald-500' : isRejected ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'"
        >
          <Icon :icon="isPaid ? 'ph:seal-check-bold' : isRejected ? 'ph:x-bold' : 'ph:hourglass-bold'" />
        </div>
        <div class="space-y-1 text-xs sm:text-sm">
          <div
            class="font-bold"
            :class="isPaid ? 'text-emerald-700 dark:text-emerald-400' : isRejected ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'"
          >
            {{ isPaid ? t('org_event_payments.timeline_approved_title') : isRejected ? t('org_event_payments.timeline_rejected_title') : t('org_event_payments.timeline_pending_title') }}
          </div>
          <div class="text-slate-500 dark:text-slate-400 leading-relaxed">
            <template v-if="isPaid">
              {{ t('org_event_payments.timeline_approved_desc') }}
            </template>
            <template v-else-if="isRejected">
              <span>{{ t('org_event_payments.timeline_rejected_desc') }}</span>
              <span v-if="payment?.rejection_reason" class="block mt-1 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 text-rose-700 dark:text-rose-300">
                <strong>{{ t('org_event_payments.rejection_reason') }}</strong> <em>"{{ payment.rejection_reason }}"</em>
              </span>
            </template>
            <template v-else>
              {{ t('org_event_payments.timeline_pending_desc') }}
            </template>
          </div>
          <div v-if="payment?.verified_at || (isPaid && payment?.paid_at)" class="text-xs text-slate-400 font-medium font-mono pt-0.5 flex items-center gap-1.5">
            <Icon icon="ph:calendar-blank-bold" class="text-xs shrink-0" />
            <span>{{ formatDateTime(payment.verified_at || payment.paid_at) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import useDashboardI18n from '~/composables/useDashboardI18n'

const props = defineProps({
  payment: {
    type: Object,
    default: () => ({})
  },
  formatCurrency: {
    type: Function,
    default: null
  },
  formatDateTime: {
    type: Function,
    default: (val: any) => val ? new Date(val).toLocaleString('id-ID') : '-'
  }
})

const { t } = useDashboardI18n()

const isPaid = computed(() => {
  const s = (props.payment?.status || '').toLowerCase()
  return ['paid', 'lunas', 'settlement', 'success', 'completed'].includes(s)
})

const isRejected = computed(() => {
  const s = (props.payment?.status || '').toLowerCase()
  return s === 'rejected'
})

const isManual = computed(() => {
  const m = (props.payment?.payment_method || '').toLowerCase()
  const ref = String(props.payment?.reference || '').toUpperCase()
  return m === 'manual' || m === 'manual_transfer' || m === 'bank_transfer' || ref.startsWith('PAY-MANUAL-')
})

const hasProof = computed(() => {
  return !!(props.payment?.proof_uploaded_at || props.payment?.proof_url)
})

const formatAmount = (val: number) => {
  if (props.formatCurrency) return props.formatCurrency(val)
  return 'Rp ' + Number(val || 0).toLocaleString('id-ID')
}
</script>

<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <DashboardHeader
      :title="t('org_wallet.header_title')"
      :subtitle="t('org_wallet.header_subtitle')"
      icon="ph:wallet-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('org_wallet.header_title') }
      ]"
    />

    <!-- Balance Stats & Withdraw Form Card -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm space-y-6">
        <div>
          <div class="text-xs font-bold text-slate-500 capitalize tracking-wider mb-1">{{ t("org_wallet.available_balance") }}</div>
          <div class="text-3xl font-black text-navy dark:text-white">Rp {{ (wallet?.balance || 0).toLocaleString('id-ID') }}</div>
        </div>

        <!-- Request Withdrawal Button & Form -->
        <div v-if="!showWithdrawForm" class="pt-2">
          <BaseButton variant="navy" size="md" class="w-full justify-center font-bold" @click="showWithdrawForm = true">
            <Icon icon="ph:bank-bold" class="mr-2" /> {{ t("org_wallet.request_withdrawal_btn") }}
          </BaseButton>
        </div>

        <form v-else @submit.prevent="submitWithdrawal" class="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-700">
          <h4 class="font-black text-navy dark:text-white text-sm">{{ t("org_wallet.withdrawal_form_title") }}</h4>
          <div>
            <label class="text-xs font-bold text-slate-500 mb-1 block">{{ t("org_wallet.withdraw_amount_label") }}</label>
            <input v-model.number="withdrawAmount" type="number" min="50000" :max="wallet?.balance || 0" :placeholder="t('org_wallet.min_amount_placeholder')" class="w-full px-4 py-2.5 text-sm font-bold bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none" required />
          </div>
          <div>
            <label class="text-xs font-bold text-slate-500 mb-1 block">{{ t("org_wallet.destination_bank_notes") }}</label>
            <input v-model="withdrawNotes" type="text" :placeholder="t('org_wallet.bank_notes_placeholder')" class="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none" required />
          </div>
          <div class="flex gap-2">
            <BaseButton type="submit" variant="navy" size="sm" class="flex-1 justify-center font-bold" :loading="isSubmitting">{{ t("org_wallet.submit_btn") }}</BaseButton>
            <BaseButton type="button" variant="white" size="sm" @click="showWithdrawForm = false">{{ t("org_wallet.cancel") }}</BaseButton>
          </div>
        </form>
      </div>

      <!-- Withdrawal History Table -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 dark:border-slate-700">
          <h3 class="font-black text-navy dark:text-white text-lg">{{ t("org_wallet.history_title") }}</h3>
        </div>

        <div v-if="isLoading" class="p-12 text-center text-slate-500">{{ t("org_wallet.loading_history") }}</div>

        <div v-else-if="withdrawals.length === 0" class="p-12 text-center text-slate-500">
          {{ t("org_wallet.no_history") }}
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 text-slate-500 font-bold capitalize tracking-wider">
                <th class="p-4">{{ t("org_wallet.th_date") }}</th>
                <th class="p-4">{{ t("org_wallet.th_ref_no") }}</th>
                <th class="p-4">{{ t("org_wallet.th_notes_bank") }}</th>
                <th class="p-4 text-right">{{ t("org_wallet.th_amount") }}</th>
                <th class="p-4 text-center">{{ t("org_wallet.th_status") }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
              <tr v-for="w in withdrawals" :key="w.uuid || w.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                <td class="p-4 text-slate-600 dark:text-slate-300 font-bold">{{ formatDate(w.created_at) }}</td>
                <td class="p-4 font-mono font-bold text-navy dark:text-white">{{ w.reference_no || w.uuid }}</td>
                <td class="p-4 text-slate-600 dark:text-slate-300">{{ w.notes || '-' }}</td>
                <td class="p-4 text-right font-black text-navy dark:text-white">Rp {{ (w.amount || 0).toLocaleString('id-ID') }}</td>
                <td class="p-4 text-center">
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-black capitalize"
                    :class="w.status === 'completed' || w.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
                    {{ w.status || 'PENDING' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { get, post } = useApi()
const toast = useToast()

useHead({
  title: 'Dompet Penyelenggara - Archeris Dashboard'
})

const isLoading = ref(true)
const isSubmitting = ref(false)
const showWithdrawForm = ref(false)
const wallet = ref<any>(null)
const withdrawals = ref<any[]>([])
const withdrawAmount = ref<number | null>(null)
const withdrawNotes = ref('')

async function fetchData() {
  isLoading.value = true
  try {
    const wRes = await get('/wallet/my')
    wallet.value = wRes?.wallet || wRes?.data || wRes
  } catch { wallet.value = { balance: 0 } }

  try {
    const wdRes = await get('/wallet/withdrawals')
    withdrawals.value = wdRes?.withdrawals || wdRes?.data || []
  } catch { withdrawals.value = [] }
  finally { isLoading.value = false }
}

async function submitWithdrawal() {
  if (!withdrawAmount.value || withdrawAmount.value < 50000) return
  isSubmitting.value = true
  try {
    await post('/wallet/withdrawals', {
      amount: withdrawAmount.value,
      notes: withdrawNotes.value
    })
    toast.success('Pengajuan penarikan dana berhasil dikirim')
    showWithdrawForm.value = false
    withdrawAmount.value = null
    withdrawNotes.value = ''
    await fetchData()
  } catch (err: any) {
    toast.error(err?.data?.error || 'Gagal mengajukan penarikan')
  } finally { isSubmitting.value = false }
}

function formatDate(d: string) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(fetchData)

definePageMeta({ layout: 'dashboard' })
</script>
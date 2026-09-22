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
      <div class="lg:col-span-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm space-y-6 h-fit">
        <div>
          <div class="text-xs font-bold text-slate-500 capitalize tracking-wider mb-1">{{ t("org_wallet.available_balance", "Saldo Tersedia") }}</div>
          <div class="text-3xl font-black text-navy dark:text-white">Rp {{ (wallet?.balance || 0).toLocaleString('id-ID') }}</div>
        </div>

        <!-- Request Withdrawal Button & Form -->
        <div v-if="!showWithdrawForm" class="pt-2">
          <BaseButton variant="navy" size="md" class="w-full justify-center font-bold" @click="showWithdrawForm = true">
            <Icon icon="ph:bank-bold" class="mr-2" /> {{ t("org_wallet.request_withdrawal_btn", "Tarik Dana") }}
          </BaseButton>
        </div>

        <form v-else @submit.prevent="submitWithdrawal" class="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-700">
          <h4 class="font-black text-navy dark:text-white text-sm">{{ t("org_wallet.withdrawal_form_title", "Formulir Penarikan Dana") }}</h4>
          <BaseCurrencyInput v-model="withdrawAmount" prefix="Rp" :placeholder="t('org_wallet.min_amount_placeholder', 'Min. Rp 50.000')" required />
          <div>
            <label class="text-xs font-bold text-slate-500 mb-1 block">{{ t("org_wallet.destination_bank_notes", "Rekening Bank Tujuan") }}</label>
            <input v-model="withdrawNotes" type="text" :placeholder="t('org_wallet.bank_notes_placeholder', 'BCA 1234567890 a.n John Doe')" class="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none" required />
          </div>
          <div class="flex gap-2">
            <BaseButton type="submit" variant="navy" size="sm" class="flex-1 justify-center font-bold" :loading="isSubmitting">{{ t("org_wallet.submit_btn", "Ajukan") }}</BaseButton>
            <BaseButton type="button" variant="white" size="sm" @click="showWithdrawForm = false">{{ t("org_wallet.cancel", "Batal") }}</BaseButton>
          </div>
        </form>
      </div>

      <!-- Withdrawal History Table with DashboardDataTable -->
      <div class="lg:col-span-2">
        <DashboardDataTable
          :items="withdrawals"
          :headers="headers"
          :loading="isLoading"
          :searchable="true"
          :search-placeholder="t('org_wallet.search_placeholder', 'Cari nomor referensi atau bank...')"
          :title="t('org_wallet.history_title', 'Riwayat Penarikan Dana')"
          :subtitle="t('org_wallet.history_subtitle', '{n} Transaksi', { n: withdrawals.length })"
          :icon="'ph:clock-counter-clockwise-bold'"
          :default-page-size="10"
        >
          <template #item-created_at="{ item }">
            <span class="text-slate-600 dark:text-slate-300 font-bold text-xs">{{ formatDate(item.created_at) }}</span>
          </template>

          <template #item-reference_no="{ item }">
            <span class="font-mono font-bold text-navy dark:text-white text-xs">{{ item.reference_no || item.uuid }}</span>
          </template>

          <template #item-notes="{ item }">
            <span class="text-slate-600 dark:text-slate-300 text-xs">{{ item.notes || '-' }}</span>
          </template>

          <template #item-amount="{ item }">
            <span class="font-black text-navy dark:text-white text-xs">Rp {{ (item.amount || 0).toLocaleString('id-ID') }}</span>
          </template>

          <template #item-status="{ item }">
            <span class="px-2.5 py-1 rounded-full text-[10px] font-black capitalize"
              :class="item.status === 'completed' || item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
              {{ item.status || 'PENDING' }}
            </span>
          </template>

          <template #empty>
            <div class="p-12 text-center text-slate-500">
              {{ t("org_wallet.no_history", "Belum ada riwayat penarikan dana") }}
            </div>
          </template>
        </DashboardDataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'

const { t, locale } = useI18n()
const { get, post } = useApi()
const toast = useToast()

useHead({
  title: computed(() => `${t('org_wallet.header_title', 'Dompet Organizer')} - Archeris Dashboard`)
})

const isLoading = ref(true)
const isSubmitting = ref(false)
const showWithdrawForm = ref(false)
const wallet = ref<any>(null)
const withdrawals = ref<any[]>([])
const withdrawAmount = ref<number | null>(null)
const withdrawNotes = ref('')

const headers = computed(() => [
  { key: 'created_at', label: t('org_wallet.th_date', 'Tanggal'), sortable: true },
  { key: 'reference_no', label: t('org_wallet.th_ref_no', 'No. Referensi'), sortable: true },
  { key: 'notes', label: t('org_wallet.th_notes_bank', 'Tujuan / Catatan'), sortable: true },
  { key: 'amount', label: t('org_wallet.th_amount', 'Nominal'), align: 'right', sortable: true },
  { key: 'status', label: t('org_wallet.th_status', 'Status'), align: 'center', sortable: true },
])

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
    toast.success(t('org_wallet.toast_withdraw_success', 'Pengajuan penarikan berhasil'))
    showWithdrawForm.value = false
    withdrawAmount.value = null
    withdrawNotes.value = ''
    await fetchData()
  } catch (err: any) {
    toast.error(err?.data?.error || t('org_wallet.toast_withdraw_failed', 'Gagal mengajukan penarikan'))
  } finally { isSubmitting.value = false }
}

function formatDate(d: string) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(fetchData)

definePageMeta({ layout: 'dashboard' })
</script>
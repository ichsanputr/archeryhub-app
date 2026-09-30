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
          <div>
            <BaseCurrencyInput v-model="withdrawAmount" prefix="Rp" :placeholder="t('org_wallet.min_amount_placeholder', 'Min. Rp 50.000')" @update:modelValue="withdrawErrors.amount = ''" required />
            <div v-if="withdrawErrors.amount" class="text-rose-500 text-xs font-bold mt-1">
              {{ withdrawErrors.amount }}
            </div>
          </div>
          <div>
            <label class="text-xs font-bold text-slate-500 mb-1 block">{{ t("org_wallet.destination_bank_notes", "Rekening Bank Tujuan") }}</label>
            <input v-model="withdrawNotes" type="text" :placeholder="t('org_wallet.bank_notes_placeholder', 'BCA 1234567890 a.n John Doe')" class="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-700 border rounded-xl focus:outline-none transition-all" :class="withdrawErrors.notes ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-600 focus:border-primary'" @input="withdrawErrors.notes = ''" required />
            <div v-if="withdrawErrors.notes" class="text-rose-500 text-xs font-bold mt-1">
              {{ withdrawErrors.notes }}
            </div>
          </div>
          <div class="flex gap-2">
            <BaseButton type="submit" variant="navy" size="sm" class="flex-1 justify-center font-bold" :loading="isSubmitting">{{ t("org_wallet.submit_btn", "Ajukan") }}</BaseButton>
            <BaseButton type="button" variant="white" size="sm" @click="showWithdrawForm = false">{{ t("org_wallet.cancel", "Batal") }}</BaseButton>
          </div>
        </form>
      </div>

      <!-- Tables Section with Tab Switcher -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Tab Switcher -->
        <div class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit border border-slate-200/80 dark:border-slate-700">
          <button
            type="button"
            @click="activeTab = 'mutations'"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer',
              activeTab === 'mutations'
                ? 'bg-white dark:bg-slate-700 text-navy dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-navy dark:hover:text-white'
            ]"
          >
            <Icon icon="ph:list-dashes-bold" class="text-sm" />
            <span>Mutasi Kas / Saldo</span>
            <span v-if="mutations.length > 0" class="px-1.5 py-0.5 rounded-full text-[10px] bg-primary/20 text-navy font-black">
              {{ mutations.length }}
            </span>
          </button>
          <button
            type="button"
            @click="activeTab = 'withdrawals'"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer',
              activeTab === 'withdrawals'
                ? 'bg-white dark:bg-slate-700 text-navy dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-navy dark:hover:text-white'
            ]"
          >
            <Icon icon="ph:arrow-circle-up-right-bold" class="text-sm" />
            <span>Riwayat Penarikan</span>
            <span v-if="withdrawals.length > 0" class="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-black">
              {{ withdrawals.length }}
            </span>
          </button>
        </div>

        <!-- 1. Mutations Table -->
        <div v-if="activeTab === 'mutations'">
          <DashboardDataTable
            :items="mutations"
            :headers="mutationHeaders"
            :loading="isLoading"
            :searchable="true"
            :search-placeholder="'Cari nomor referensi atau turnamen...'"
            :title="'Mutasi Saldo Dompet'"
            :subtitle="`Total ${mutations.length} catatan mutasi`"
            :icon="'ph:wallet-bold'"
            :default-page-size="10"
          >
            <template #item-created_at="{ item }">
              <span class="text-slate-600 dark:text-slate-300 font-bold text-xs">{{ formatDate(item.created_at) }}</span>
            </template>

            <template #item-mutation_type="{ item }">
              <span
                class="px-2.5 py-1 rounded-full text-[10px] font-black capitalize flex items-center gap-1 w-fit"
                :class="item.mutation_type === 'credit' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'"
              >
                <Icon :icon="item.mutation_type === 'credit' ? 'ph:arrow-down-left-bold' : 'ph:arrow-up-right-bold'" />
                {{ item.mutation_type === 'credit' ? 'Masuk (+)' : 'Keluar (-)' }}
              </span>
            </template>

            <template #item-description="{ item }">
              <div class="space-y-0.5 max-w-xs">
                <div class="text-xs font-bold text-navy dark:text-white truncate">{{ item.description || '-' }}</div>
                <div class="font-mono text-[11px] text-slate-400">{{ item.reference_id }}</div>
              </div>
            </template>

            <template #item-amount="{ item }">
              <span
                class="font-black text-xs"
                :class="item.mutation_type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'"
              >
                {{ item.mutation_type === 'credit' ? '+' : '-' }}Rp {{ (item.amount || 0).toLocaleString('id-ID') }}
              </span>
            </template>

            <template #item-balance_after="{ item }">
              <span class="font-black text-navy dark:text-white text-xs">
                Rp {{ (item.balance_after || 0).toLocaleString('id-ID') }}
              </span>
            </template>

            <template #empty>
              <div class="p-12 text-center text-slate-500">
                Belum ada catatan mutasi saldo.
              </div>
            </template>
          </DashboardDataTable>
        </div>

        <!-- 2. Withdrawal History Table -->
        <div v-else>
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
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
const activeTab = ref('mutations')
const wallet = ref(null)
const withdrawals = ref([])
const mutations = ref([])
const withdrawAmount = ref(null)
const withdrawNotes = ref('')

const withdrawErrors = reactive({
  amount: '',
  notes: ''
})

const headers = computed(() => [
  { key: 'created_at', label: t('org_wallet.th_date', 'Tanggal'), sortable: true },
  { key: 'reference_no', label: t('org_wallet.th_ref_no', 'No. Referensi'), sortable: true },
  { key: 'notes', label: t('org_wallet.th_notes_bank', 'Tujuan / Catatan'), sortable: true },
  { key: 'amount', label: t('org_wallet.th_amount', 'Nominal'), align: 'right', sortable: true },
  { key: 'status', label: t('org_wallet.th_status', 'Status'), align: 'center', sortable: true },
])

const mutationHeaders = computed(() => [
  { key: 'created_at', label: 'Tanggal', sortable: true },
  { key: 'mutation_type', label: 'Tipe', align: 'center', sortable: true },
  { key: 'description', label: 'Keterangan & Referensi', sortable: true },
  { key: 'amount', label: 'Nominal', align: 'right', sortable: true },
  { key: 'balance_after', label: 'Saldo Akhir', align: 'right', sortable: true },
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

  try {
    const mRes = await get('/wallet/mutations?limit=50')
    mutations.value = mRes?.data || []
  } catch { mutations.value = [] }
  finally { isLoading.value = false }
}

async function submitWithdrawal() {
  withdrawErrors.amount = ''
  withdrawErrors.notes = ''

  if (!withdrawAmount.value || withdrawAmount.value <= 0) {
    withdrawErrors.amount = t('org_wallet.error_amount_required', 'Masukkan nominal penarikan')
    toast.error(withdrawErrors.amount)
    return
  }

  if (withdrawAmount.value < 50000) {
    withdrawErrors.amount = t('org_wallet.error_min_amount', 'Minimal penarikan adalah Rp 50.000')
    toast.error(withdrawErrors.amount)
    return
  }

  const currentBalance = Number(wallet.value?.balance || 0)
  if (withdrawAmount.value > currentBalance) {
    withdrawErrors.amount = t('org_wallet.error_exceeds_balance', 'Nominal penarikan melebihi saldo dompet yang tersedia')
    toast.error(withdrawErrors.amount)
    return
  }

  if (!withdrawNotes.value || !withdrawNotes.value.trim()) {
    withdrawErrors.notes = t('org_wallet.error_notes_required', 'Masukkan nomor rekening dan bank tujuan')
    toast.error(withdrawErrors.notes)
    return
  }

  isSubmitting.value = true
  try {
    await post('/wallet/withdrawals', {
      amount: withdrawAmount.value,
      notes: withdrawNotes.value.trim()
    })
    toast.success(t('org_wallet.toast_withdraw_success', 'Pengajuan penarikan berhasil diajukan'))
    showWithdrawForm.value = false
    withdrawAmount.value = null
    withdrawNotes.value = ''
    await fetchData()
  } catch (err) {
    toast.error(err?.data?.error || err?.response?.data?.error || t('org_wallet.toast_withdraw_failed', 'Gagal mengajukan penarikan'))
  } finally {
    isSubmitting.value = false
  }
}

function formatDate(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(fetchData)

definePageMeta({ layout: 'dashboard' })
</script>
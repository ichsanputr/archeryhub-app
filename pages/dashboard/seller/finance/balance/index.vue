<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
      </div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

      <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-4 sm:gap-5">
          <div
            class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <Icon icon="ph:bank-bold" class="text-primary text-2xl sm:text-3xl" />
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-black tracking-tight leading-none capitalize">Saldo & rekening</h1>
            <div class="text-slate-300 text-[10px] sm:text-xs font-bold mt-1 tracking-wide capitalize">Kelola dana masuk dan akun penarikan anda</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left: Balance Card -->
      <div class="lg:col-span-1 space-y-6">
        <div
          class="bg-gradient-to-br from-navy to-navy-dark rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden border border-white/5 group">
          <div
            class="absolute -top-8 -right-8 p-8 opacity-[0.03] transition-transform group-hover:scale-110 duration-700">
            <Icon icon="ph:coins-bold" class="text-[10rem]" />
          </div>

          <div class="relative z-10">
            <div class="flex items-center gap-2 mb-4">
              <div class="size-1.5 bg-primary animate-pulse rounded-full"></div>
              <div class="text-primary text-[9px] font-black tracking-[0.2em]">Saldo tersedia</div>
            </div>

            <h2 class="text-3xl sm:text-4xl font-black tracking-tighter mb-8 leading-none">
              <span class="text-xl font-bold opacity-40 mr-1">Rp</span>{{ wallet.balance.toLocaleString('id-ID') }}
            </h2>

            <div class="space-y-3">
              <BaseButton variant="primary" block
                class="font-black text-[10px] tracking-widest h-11 !rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95">
                Tarik Saldo Ke Bank
              </BaseButton>
              <div class="flex items-center justify-center gap-2 bg-white/5 rounded-lg py-2.5 border border-white/5">
                <Icon icon="ph:info-bold" class="text-primary text-xs" />
                <div class="text-[8px] text-slate-400 font-black tracking-widest">
                  Proses penarikan 1-3 hari kerja
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right: Content Tabs/Lists -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Bank Accounts Card -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div class="px-6 py-5 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon icon="ph:credit-card-bold" class="text-primary text-lg" />
              </div>
              <h2 class="text-sm font-black text-navy tracking-widest">Rekening bank</h2>
            </div>
            <BaseButton @click="openAddModal" variant="primary" icon="ph:plus-bold"
              class="h-9 px-4 !rounded-lg font-black tracking-widest text-[9px]">
              Tambah Rekening
            </BaseButton>
          </div>

          <div class="p-4 overflow-x-auto no-scrollbar">
            <div v-if="loading" class="p-10 text-center">
              <Icon icon="ph:circle-notched-bold" class="text-3xl text-primary animate-spin mx-auto mb-3" />
              <div class="text-[10px] font-bold text-gray-400 tracking-widest">Memuat rekening...</div>
            </div>

            <div v-else-if="bankAccounts.length === 0"
              class="p-10 text-center border-2 border-dashed border-gray-50 rounded-2xl m-2">
              <Icon icon="ph:bank-bold" class="text-4xl text-gray-100 mx-auto mb-3" />
              <div class="text-sm font-bold text-gray-400">Belum ada rekening bank</div>
              <div class="text-[9px] text-gray-300 font-medium mt-1">Tambahkan rekening untuk pencairan saldo</div>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="account in bankAccounts" :key="account.id"
                class="group p-5 rounded-3xl border transition-all duration-300"
                :class="account.is_primary ? 'bg-navy border-navy text-white shadow-lg shadow-navy/20' : 'bg-gray-50/50 border-gray-100 hover:border-primary/30'">
                <div class="flex justify-between items-start mb-4">
                  <div
                    class="size-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden shadow-sm">
                    <span class="text-navy font-black text-[10px] truncate px-1 text-center">{{ account.bank_name
                    }}</span>
                  </div>
                  <div class="flex gap-1">
                    <button @click="openEditModal(account)"
                      class="size-8 rounded-lg flex items-center justify-center transition-colors"
                      :class="account.is_primary ? 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white' : 'bg-white text-gray-400 hover:bg-primary/10 hover:text-primary border border-gray-100'">
                      <Icon icon="ph:pencil-simple-bold" />
                    </button>
                    <button @click="confirmDelete(account)"
                      class="size-8 rounded-lg flex items-center justify-center transition-colors shadow-sm"
                      :class="account.is_primary ? 'bg-red-500/10 text-red-300 hover:bg-red-500 hover:text-white' : 'bg-white text-red-400 hover:bg-red-50 border border-gray-100'">
                      <Icon icon="ph:trash-bold" />
                    </button>
                  </div>
                </div>

                <div class="min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <div class="text-[11px] font-black tracking-widest opacity-40">{{ account.bank_name }}</div>
                    <span v-if="account.is_primary"
                      class="text-[8px] font-black tracking-widest bg-primary text-navy px-1.5 py-0.5 rounded">Rekening
                      Utama</span>
                  </div>
                  <div class="text-sm font-black tracking-widest mb-1">{{ account.account_number }}</div>
                  <div class="text-[10px] font-bold opacity-60 truncate">{{ account.account_name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Withdrawal History Table -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="size-9 rounded-xl bg-navy/5 flex items-center justify-center">
                <Icon icon="ph:clock-counter-clockwise-bold" class="text-navy/60 text-lg" />
              </div>
              <h2 class="text-sm font-black text-navy tracking-widest">Riwayat pencairan</h2>
            </div>
          </div>

          <div class="overflow-x-auto no-scrollbar">
            <table class="w-full text-left min-w-[600px]">
              <thead>
                <tr
                  class="bg-gray-50/50 text-[10px] font-black text-gray-400 tracking-[0.2em] border-b border-gray-100 uppercase">
                  <th @click="toggleSort('status')" class="px-8 py-5 text-left cursor-pointer hover:text-navy transition-colors">
                    <div class="flex items-center gap-2">
                      Status
                      <Icon v-if="sortBy === 'status'"
                        :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-[11px]" />
                      <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                    </div>
                  </th>
                  <th @click="toggleSort('created_at')" class="px-8 py-5 text-left cursor-pointer hover:text-navy transition-colors">
                    <div class="flex items-center gap-2">
                      Tanggal
                      <Icon v-if="sortBy === 'created_at'"
                        :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-[11px]" />
                      <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                    </div>
                  </th>
                  <th class="px-8 py-5 text-left">ID Referensi</th>
                  <th @click="toggleSort('amount')" class="px-8 py-5 text-right cursor-pointer hover:text-navy transition-colors">
                    <div class="flex items-center justify-end gap-2">
                      Nominal
                      <Icon v-if="sortBy === 'amount'"
                        :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-[11px]" />
                      <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="item in withdrawals" :key="item.id"
                  class="hover:bg-gray-50/80 transition-colors">
                  <td class="px-8 py-5 text-left">
                    <span :class="getStatusClass(item.status)"
                      class="px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest border">
                      {{ item.status || 'Pending' }}
                    </span>
                  </td>
                  <td class="px-8 py-5 text-left text-xs font-black text-navy/70 tracking-tighter">
                    {{ formatDate(item.created_at) }}
                  </td>
                  <td class="px-8 py-5 text-left text-xs font-mono font-bold text-gray-400">
                    #{{ item.reference_no || (item.id || '').toString().slice(0, 8) }}
                  </td>
                  <td class="px-8 py-5 text-right font-black text-navy">
                    {{ formatCurrency(item.amount) }}
                  </td>
                </tr>
                <tr v-if="withdrawals.length === 0">
                  <td colspan="4" class="px-8 py-16 text-center">
                    <div
                      class="size-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                      <Icon icon="ph:empty-bold" class="text-gray-200 text-3xl" />
                    </div>
                    <div class="text-sm font-bold text-gray-400">Belum ada riwayat penarikan</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="totalWithdrawals > withdrawalLimit" class="px-8 py-5 bg-gray-50/50 border-t border-gray-50">
            <BasePagination v-model:items-per-page="withdrawalLimit" :current-page="withdrawalPage"
              :total-items="totalWithdrawals" @change-page="withdrawalPage = $event" />
          </div>
        </div>
      </div>
    </div>

    <!-- Redesigned Bank Account Modal -->
    <BaseDialogForm v-model="modal.show" :header="modal.isEdit ? 'Ubah Rekening' : 'Rekening Bank Baru'"
      class="rounded-[2.5rem] !max-w-xl overflow-hidden shadow-2xl">
      <div v-if="!modal.isEdit"
        class="bg-primary/5 p-6 rounded-3xl mb-8 border border-primary/10 flex items-start gap-4">
        <div class="size-10 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
          <Icon icon="ph:info-bold" class="text-primary text-xl" />
        </div>
        <div class="text-[11px] font-bold text-navy/60 leading-relaxed tracking-tighter">
          Pastikan nomor rekening dan nama pemilik sesuai dengan buku tabungan untuk kelancaran proses pencairan dana
          toko anda.
        </div>
      </div>

      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput v-model="form.bankName" label="Nama Bank" placeholder="Contoh: BCA, Mandiri" required
            class="!rounded-2xl" icon="ph:bank-bold" />
          <BaseInput v-model="form.accountNumber" label="Nomor Rekening" placeholder="Masukkan angka saja" required
            class="!rounded-2xl" icon="ph:hash-bold" numberOnly />
        </div>

        <BaseInput v-model="form.accountName" label="Nama Lengkap Pemilik" placeholder="Sesuai Buku Tabungan" required
          class="!rounded-2xl" icon="ph:user-focus-bold" />

        <div class="bg-gray-50 p-5 rounded-3xl border border-gray-100 transition-all hover:border-primary/20 group">
          <label class="flex items-center gap-4 cursor-pointer select-none">
            <div class="relative flex items-center">
              <input v-model="form.isPrimary" type="checkbox"
                class="peer h-6 w-6 rounded-lg border-gray-200 text-primary focus:ring-primary transition-all cursor-pointer opacity-0 absolute z-10" />
              <div
                class="h-6 w-6 rounded-lg border-2 border-gray-200 peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center bg-white">
                <Icon icon="ph:check-bold"
                  class="text-white text-sm scale-0 peer-checked:scale-100 transition-transform" />
              </div>
            </div>
            <div>
              <div class="text-xs font-black text-navy tracking-widest">Jadikan Rekening Utama</div>
              <div class="text-[10px] text-gray-400 font-medium">Rekening ini akan dipilih otomatis saat penarikan saldo
              </div>
            </div>
          </label>
        </div>
      </div>

      <template #action>
        <div class="flex items-center justify-end gap-3 w-full pt-2">
          <button @click="modal.show = false"
            class="px-5 py-3 text-[10px] font-black tracking-widest text-gray-400 hover:text-navy transition-colors">
            Batalkan
          </button>
          <BaseButton variant="primary" :loading="modal.loading" @click="handleSubmit"
            class="h-11 px-8 !rounded-xl font-black tracking-widest text-[10px] shadow-lg shadow-primary/20">
            {{ modal.isEdit ? 'Simpan Perubahan' : 'Daftarkan Rekening' }}
          </BaseButton>
        </div>
      </template>
    </BaseDialogForm>

    <AppDialog v-model:show="deleteState.show" title="Hapus Rekening?"
      message="Rekening ini akan dihapus dari daftar. Anda tetap dapat menambahkannya kembali nanti." type="danger"
      confirm-text="Ya, Hapus" cancel-text="Kembali" @confirm="handleDelete" />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { onMounted, reactive, ref } from 'vue'
import AppDialog from '~/components/common/AppDialog.vue'
import BaseDialogForm from '~/components/common/BaseDialogForm.vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Saldo & Rekening - Dashboard Seller' })

const api = useApi()
const toast = useToast()

const loading = ref(false)
const wallet = ref({ balance: 0 })
const bankAccounts = ref([])
const withdrawals = ref([])
const totalWithdrawals = ref(0)
const withdrawalPage = ref(1)
const withdrawalLimit = ref(10)
const sortBy = ref('created_at')
const order = ref('DESC')

const modal = reactive({
  show: false,
  isEdit: false,
  loading: false,
  currentId: null
})

const form = reactive({
  bankName: '',
  accountNumber: '',
  accountName: '',
  isPrimary: false
})

const deleteState = reactive({
  show: false,
  target: null
})

const fetchWallet = async () => {
  try {
    const res = await api.get('/sellers/wallet')
    wallet.value = res?.data || res || { balance: 0 }
  } catch (error) {
    console.error('Failed to fetch seller wallet:', error)
    wallet.value = { balance: 0 }
  }
}

const fetchBankAccounts = async () => {
  try {
    const res = await api.get('/sellers/bank-accounts')
    bankAccounts.value = res?.data || res || []
  } catch (error) {
    console.error('Failed to fetch seller bank accounts:', error)
    bankAccounts.value = []
  }
}

const fetchWithdrawals = async () => {
  try {
    const offset = (withdrawalPage.value - 1) * withdrawalLimit.value
    const res = await api.get('/sellers/wallet/withdrawals', {
      query: {
        limit: withdrawalLimit.value,
        offset: offset,
        sort_by: sortBy.value,
        order: order.value
      }
    })
    withdrawals.value = res?.data || []
    totalWithdrawals.value = res?.meta?.total_items || 0
  } catch (error) {
    console.error('Failed to fetch seller withdrawals:', error)
    withdrawals.value = []
  }
}

const toggleSort = (field) => {
  if (sortBy.value === field) {
    order.value = order.value === 'ASC' ? 'DESC' : 'ASC'
  } else {
    sortBy.value = field
    order.value = 'ASC'
  }
}

watch([withdrawalPage, sortBy, order], () => {
  fetchWithdrawals()
})

const fetchAll = async () => {
  loading.value = true
  await Promise.all([fetchWallet(), fetchBankAccounts(), fetchWithdrawals()])
  loading.value = false
}

const openAddModal = () => {
  modal.isEdit = false
  modal.currentId = null
  form.bankName = ''
  form.accountNumber = ''
  form.accountName = ''
  form.isPrimary = bankAccounts.value.length === 0
  modal.show = true
}

const openEditModal = (account) => {
  modal.isEdit = true
  modal.currentId = account.id
  form.bankName = account.bank_name
  form.accountNumber = account.account_number
  form.accountName = account.account_name
  form.isPrimary = !!account.is_primary
  modal.show = true
}

const handleSubmit = async () => {
  if (!form.bankName || !form.accountNumber || !form.accountName) {
    toast.error('Mohon lengkapi semua data rekening')
    return
  }

  modal.loading = true
  try {
    const payload = {
      bank_name: form.bankName,
      account_number: form.accountNumber,
      account_name: form.accountName,
      is_primary: form.isPrimary
    }

    if (modal.isEdit) {
      await api.put(`/sellers/bank-accounts/${modal.currentId}`, payload)
      toast.success('Rekening berhasil diperbarui')
    } else {
      await api.post('/sellers/bank-accounts', payload)
      toast.success('Rekening berhasil ditambahkan')
    }

    modal.show = false
    await fetchBankAccounts()
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Gagal menyimpan rekening')
  } finally {
    modal.loading = false
  }
}

const confirmDelete = (account) => {
  deleteState.target = account
  deleteState.show = true
}

const handleDelete = async () => {
  if (!deleteState.target) return

  try {
    await api.delete(`/sellers/bank-accounts/${deleteState.target.id}`)
    toast.success('Rekening berhasil dihapus')
    await fetchBankAccounts()
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Gagal menghapus rekening')
  } finally {
    deleteState.show = false
    deleteState.target = null
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0
  }).format(Number(value || 0))
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getStatusClass = (status) => {
  const s = (status || 'pending').toLowerCase()
  if (s === 'completed' || s === 'selesai' || s === 'success') return 'bg-green-50 text-green-600 border-green-100'
  if (s === 'pending' || s === 'waiting') return 'bg-amber-50 text-amber-600 border-amber-100'
  if (s === 'failed' || s === 'canceled') return 'bg-red-50 text-red-600 border-red-100'
  return 'bg-gray-50 text-gray-500 border-gray-100'
}

onMounted(() => {
  fetchAll()
})
</script>

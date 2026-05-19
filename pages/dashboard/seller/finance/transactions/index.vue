<template>
    <div class="space-y-6">
        <!-- Compact Header Section -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm mb-2">
            <div class="absolute inset-0"
                :style="{ backgroundImage: 'var(--motif-pattern)', opacity: 'var(--motif-opacity, 0.2)' }">
            </div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-5">
                    <div
                        class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                        <Icon icon="ph:clock-counter-clockwise-bold" class="text-primary text-2xl sm:text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-2xl font-black tracking-tight leading-none capitalize">Riwayat
                            transaksi</h1>
                        <div class="text-slate-300 text-[10px] sm:text-xs font-bold mt-1 tracking-wide capitalize">
                            Pantau semua arus kas masuk dan keluar toko anda</div>
                    </div>
                </div>
                <div class="flex flex-wrap gap-3">
                    <NuxtLink to="/dashboard/seller/finance/balance">
                        <BaseButton variant="white" icon="ph:wallet-bold"
                            class="h-10 px-5 font-black text-[10px] tracking-widest !rounded-xl border-white/10 hover:bg-white/10 hover:text-white transition-all">
                            Saldo & Rekening
                        </BaseButton>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Quick Stats Breakdown -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
                class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-green-50 p-2.5 rounded-xl text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                    <Icon icon="ph:trend-up-bold" class="text-xl" />
                </div>
                <div>
                    <div class="text-[10px] text-gray-400 font-bold tracking-widest ">Total Pemasukan</div>
                    <div class="text-lg font-black text-navy">Rp {{ stats.income.toLocaleString('id-ID') }}</div>
                </div>
            </div>
            <div
                class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-red-50 p-2.5 rounded-xl text-red-600 group-hover:bg-red-500 group-hover:text-white transition-colors">
                    <Icon icon="ph:trend-down-bold" class="text-xl" />
                </div>
                <div>
                    <div class="text-[10px] text-gray-400 font-bold tracking-widest ">Total Penarikan</div>
                    <div class="text-lg font-black text-navy">Rp {{ stats.outcome.toLocaleString('id-ID') }}</div>
                </div>
            </div>
            <div
                class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-navy/5 p-2.5 rounded-xl text-navy group-hover:bg-navy group-hover:text-white transition-colors">
                    <Icon icon="ph:wallet-bold" class="text-xl" />
                </div>
                <div>
                    <div class="text-[10px] text-gray-400 font-bold tracking-widest ">Saldo Saat Ini</div>
                    <div class="text-lg font-black text-navy">Rp {{ walletBalance.toLocaleString('id-ID') }}</div>
                </div>
            </div>
        </div>

        <!-- Filters & Table -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
            <div class="p-5 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div class="size-2 bg-primary rounded-full animate-pulse"></div>
                    <h2 class="text-xs font-black text-navy tracking-[0.2em] ">Log Transaksi Terkini</h2>
                </div>
                <div class="flex items-center gap-2">
                    <BaseSelect v-model="filterType" :items="typeOptions" class="w-40 !mb-0" item-title="title" dense />
                    <BaseButton variant="white" icon="ph:arrows-clockwise-bold" @click="fetchTransactions"
                        class="h-10 w-10 !p-0 border-gray-100 text-gray-400" />
                </div>
            </div>

            <div class="overflow-x-auto no-scrollbar">
                <table class="w-full text-left min-w-[700px]">
                    <thead>
                        <tr
                            class="bg-gray-50/50 text-[9px] font-black text-gray-400 tracking-[0.2em] border-b border-gray-50">
                            <th class="px-8 py-4">Tipe</th>
                            <th @click="toggleSort('date')"
                                class="px-8 py-4 cursor-pointer hover:text-navy transition-colors">
                                <div class="flex items-center gap-2">
                                    Tanggal
                                    <Icon v-if="sortBy === 'date'"
                                        :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                                        class="text-primary  text-xs" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                                </div>
                            </th>
                            <th class="px-8 py-4">Referensi</th>
                            <th @click="toggleSort('amount')"
                                class="px-8 py-4 text-right cursor-pointer hover:text-navy transition-colors">
                                <div class="flex items-center justify-end gap-2">
                                    Nominal
                                    <Icon v-if="sortBy === 'amount'"
                                        :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                                        class="text-primary  text-xs" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                                </div>
                            </th>
                            <th @click="toggleSort('status')"
                                class="px-8 py-4 text-center cursor-pointer hover:text-navy transition-colors">
                                <div class="flex items-center justify-center gap-2">
                                    Status
                                    <Icon v-if="sortBy === 'status'"
                                        :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                                        class="text-primary  text-xs" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-if="isLoading">
                            <td colspan="5" class="py-20 text-center">
                                <Icon icon="ph:circle-notched-bold"
                                    class="text-3xl text-primary animate-spin mx-auto mb-2" />
                                <div class="text-[10px] font-bold text-gray-400 tracking-widest">Memuat
                                    Transaksi...</div>
                            </td>
                        </tr>
                        <tr v-else-if="filteredTransactions.length === 0">
                            <td colspan="5" class="py-20 text-center">
                                <div
                                    class="size-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                    <Icon icon="ph:empty-bold" class="text-gray-200 text-3xl" />
                                </div>
                                <div class="text-sm font-bold text-gray-400">Tidak ada data transaksi ditemukan</div>
                                <div v-if="filterType !== 'all'" class="text-[10px] text-gray-300 font-medium mt-1">Coba
                                    ubah filter atau reset pencarian</div>
                            </td>
                        </tr>
                        <tr v-for="item in filteredTransactions" :key="item.id"
                            class="hover:bg-gray-50/50 transition-colors group">
                            <td class="px-8 py-4">
                                <div class="flex items-center gap-3">
                                    <div :class="item.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'"
                                        class="size-8 rounded-lg flex items-center justify-center shrink-0">
                                        <Icon :icon="item.type === 'income' ? 'ph:trend-up' : 'ph:trend-down'" />
                                    </div>
                                    <div class=" text-xs font-black text-navy tracking-tight">{{ item.type
                                        === 'income' ? 'Masuk' : 'Keluar' }}</div>
                                </div>
                            </td>
                            <td class="px-8 py-4">
                                <div class=" text-xs font-bold text-navy/70">{{ formatDate(item.date) }}</div>
                                <div class="text-[9px] text-gray-400 font-bold ">{{ formatTime(item.date) }}</div>
                            </td>
                            <td class="px-8 py-4">
                                <div class=" text-xs font-black leading-none mb-1 text-navy">#{{ item.ref }}</div>
                                <div class="text-[10px] text-gray-400 font-medium max-w-[200px] truncate">{{ item.notes
                                    || 'Penghasilan Pesanan' }}</div>
                            </td>
                            <td class="px-8 py-4 text-right">
                                <div :class="item.type === 'income' ? 'text-green-600' : 'text-navy'"
                                    class="text-xs font-black">
                                    {{ item.type === 'income' ? '+' : '-' }} Rp {{ item.amount.toLocaleString('id-ID')
                                    }}
                                </div>
                            </td>
                            <td class="px-8 py-4 text-center">
                                <span :class="getStatusClass(item.status)"
                                    class="px-2 py-1 rounded-md text-[8px] font-black tracking-widest border ">
                                    {{ item.status }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Riwayat Transaksi - Dashboard Seller' })

const { get } = useApi()
const toast = useToast()

const isLoading = ref(true)
const transactions = ref([])
const walletBalance = ref(0)
const filterType = ref('all')
const sortBy = ref('date')
const order = ref('DESC')

const typeOptions = [
    { title: 'Semua Transaksi', value: 'all' },
    { title: 'Pemasukan', value: 'income' },
    { title: 'Penarikan', value: 'outcome' }
]

const stats = computed(() => {
    return transactions.value.reduce((acc, curr) => {
        if (curr.type === 'income' && curr.status === 'SUCCESS') acc.income += curr.amount
        if (curr.type === 'outcome' && curr.status === 'SUCCESS') acc.outcome += curr.amount
        return acc
    }, { income: 0, outcome: 0 })
})

const filteredTransactions = computed(() => {
    let result = transactions.value
    if (filterType.value !== 'all') {
        result = result.filter(t => t.type === filterType.value)
    }

    // Sort
    return [...result].sort((a, b) => {
        let aVal = a[sortBy.value]
        let bVal = b[sortBy.value]

        if (sortBy.value === 'date') {
            aVal = new Date(aVal).getTime()
            bVal = new Date(bVal).getTime()
        }

        if (order.value === 'DESC') {
            return aVal > bVal ? -1 : 1
        } else {
            return aVal < bVal ? -1 : 1
        }
    })
})

const toggleSort = (field) => {
    if (sortBy.value === field) {
        order.value = order.value === 'ASC' ? 'DESC' : 'ASC'
    } else {
        sortBy.value = field
        order.value = 'ASC'
    }
}

const fetchTransactions = async () => {
    isLoading.value = true
    try {
        const [ordersRes, withdrawalsRes, walletRes] = await Promise.all([
            get('/orders'),
            get('/sellers/wallet/withdrawals'),
            get('/sellers/wallet')
        ])

        const ordersRaw = ordersRes?.data ?? ordersRes ?? []
        const orderArray = Array.isArray(ordersRaw) ? ordersRaw : []
        const orderLogs = orderArray
            .filter(o => o.payment_status === 'paid')
            .map(o => ({
                id: o.uuid,
                type: 'income',
                amount: o.total_amount,
                date: o.created_at,
                ref: o.uuid.slice(0, 8).toUpperCase(),
                status: 'SUCCESS',
                notes: `Penjualan ${o.customer_name}`
            }))

        const withdrawalsRaw = withdrawalsRes?.data ?? withdrawalsRes ?? []
        const withdrawalsArray = Array.isArray(withdrawalsRaw) ? withdrawalsRaw : []
        const withdrawalLogs = withdrawalsArray.map(w => ({
            id: w.id || w.uuid,
            type: 'outcome',
            amount: w.amount,
            date: w.created_at,
            ref: w.reference_no,
            status: (w.status || 'PENDING').toUpperCase(),
            notes: w.notes || 'Penarikan ke rekening bank'
        }))

        transactions.value = [...orderLogs, ...withdrawalLogs].sort((a, b) => new Date(b.date) - new Date(a.date))
        walletBalance.value = walletRes?.balance || 0
    } catch (error) {
        console.error('Failed to fetch transactions:', error)
        toast.error('Gagal mengambil riwayat transaksi')
    } finally {
        isLoading.value = false
    }
}

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const getStatusClass = (status) => {
    const s = status.toLowerCase()
    if (s === 'paid' || s === 'success' || s === 'done') return 'bg-green-50 text-green-600 border-green-100'
    if (s === 'pending') return 'bg-amber-50 text-amber-600 border-amber-100'
    if (s === 'failed' || s === 'cancelled') return 'bg-red-50 text-red-600 border-red-100'
    return 'bg-gray-50 text-gray-500 border-gray-100'
}

onMounted(() => {
    fetchTransactions()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>

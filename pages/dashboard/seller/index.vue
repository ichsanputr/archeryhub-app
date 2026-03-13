<template>
  <div class="space-y-8">
    <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

      <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
            <Icon icon="ph:coins-bold" class="text-primary text-2xl sm:text-3xl" />
          </div>
          <div>
            <h1 class="text-xl sm:text-3xl font-black tracking-tight">Seller Finance</h1>
            <p class="text-slate-300 text-xs sm:text-sm font-medium mt-1">Dashboard seller difokuskan untuk Transactions dan Balance.</p>
          </div>
        </div>
        <div class="flex gap-3">
          <NuxtLink to="/dashboard/seller/finance/transactions">
            <BaseButton variant="primary" icon="ph:credit-card-bold" class="h-11 px-5 font-black text-xs uppercase tracking-widest">Transactions</BaseButton>
          </NuxtLink>
          <NuxtLink to="/dashboard/seller/finance/balance">
            <BaseButton variant="white" icon="ph:wallet-bold" class="h-11 px-5 font-black text-xs uppercase tracking-widest">Balance</BaseButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NuxtLink to="/dashboard/seller/finance/transactions" class="block rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <p class="text-[10px] font-black text-gray-400 tracking-widest uppercase">Transactions</p>
          <Icon icon="ph:credit-card" class="text-primary text-xl" />
        </div>
        <p class="text-3xl font-black text-navy">{{ transactionCount }}</p>
        <p class="text-xs text-gray-500 mt-2">Total transaksi pembayaran yang masuk.</p>
      </NuxtLink>

      <NuxtLink to="/dashboard/seller/finance/balance" class="block rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <p class="text-[10px] font-black text-gray-400 tracking-widest uppercase">Balance</p>
          <Icon icon="ph:wallet" class="text-primary text-xl" />
        </div>
        <p class="text-3xl font-black text-navy">{{ formatCurrency(walletBalance) }}</p>
        <p class="text-xs text-gray-500 mt-2">Saldo wallet seller saat ini.</p>
      </NuxtLink>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 class="text-lg font-black text-navy">Recent Transactions</h2>
        <NuxtLink to="/dashboard/seller/finance/transactions" class="text-xs font-black text-primary uppercase tracking-widest hover:underline">Lihat Semua</NuxtLink>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left min-w-[760px]">
          <thead class="bg-gray-50/50 border-b border-gray-100">
            <tr class="text-[10px] font-black text-gray-400 tracking-widest uppercase">
              <th class="px-6 py-4">Transaksi</th>
              <th class="px-6 py-4">Tanggal</th>
              <th class="px-6 py-4 text-right">Nominal</th>
              <th class="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="item in recentTransactions" :key="item.uuid" class="hover:bg-gray-50/50">
              <td class="px-6 py-4 text-sm font-black text-navy">#{{ (item.uuid || '').slice(0, 10).toUpperCase() }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(item.created_at) }}</td>
              <td class="px-6 py-4 text-sm text-right font-black text-navy">{{ formatCurrency(item.total_amount) }}</td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :class="((item.payment_status || '').toLowerCase() === 'paid') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'">
                  {{ (item.payment_status || 'pending').toLowerCase() === 'paid' ? 'Paid' : 'Pending' }}
                </span>
              </td>
            </tr>
            <tr v-if="!loading && recentTransactions.length === 0">
              <td colspan="4" class="px-6 py-10 text-center text-sm text-gray-400">Belum ada transaksi.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Seller Finance Dashboard - ArcheryHub' })

const api = useApi()

const loading = ref(false)
const orders = ref([])
const walletBalance = ref(0)

const fetchData = async () => {
  loading.value = true
  try {
    const [ordersRes, walletRes] = await Promise.all([
      api.get('/orders').catch(() => ({ data: [] })),
      api.get('/sellers/wallet').catch(() => ({ data: { balance: 0 } }))
    ])
    orders.value = ordersRes?.data || []
    const wallet = walletRes?.data || walletRes || { balance: 0 }
    walletBalance.value = Number(wallet.balance || 0)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const transactionCount = computed(() => orders.value.length)
const recentTransactions = computed(() => orders.value.slice(0, 5))

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(Number(value || 0))
}

const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
</script>

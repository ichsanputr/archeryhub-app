<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-navy tracking-tight">Pesanan Masuk</h1>
        <p class="text-gray-500 mt-1 font-medium">Kelola dan pantau transaksi penjualan produk Anda</p>
      </div>
      <div class="flex gap-3">
        <BaseButton variant="outline" size="sm" icon="ph:download-simple">
          Ekspor Laporan
        </BaseButton>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <div v-for="stat in orderStats" :key="stat.label" 
        class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
        <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Icon :icon="stat.icon" class="text-6xl text-navy" />
        </div>
        <div class="flex items-center gap-3 mb-4">
          <div :class="stat.colorClass" class="p-2 rounded-lg">
            <Icon :icon="stat.icon" class="text-xl" />
          </div>
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ stat.label }}</p>
        </div>
        <div>
          <p class="text-navy text-2xl font-black tracking-tight">{{ stat.value }}</p>
          <p class="text-gray-500 text-[10px] mt-1 font-bold flex items-center gap-1">
            <Icon :icon="stat.trendIcon" :class="stat.trendColor" />
            <span :class="stat.trendColor">{{ stat.trendText }}</span> dari bulan lalu
          </p>
        </div>
      </div>
    </div>

    <!-- Orders Management -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
      <!-- Tabs & Search -->
      <div class="p-6 border-b border-gray-50 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex p-1 bg-gray-50 rounded-xl">
            <button 
              v-for="tab in tabs" 
              :key="tab.value"
              @click="activeTab = tab.value"
              :class="activeTab === tab.value ? 'bg-white text-navy shadow-sm' : 'text-gray-400 hover:text-gray-600'"
              class="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all"
            >
              {{ tab.label }}
            </button>
          </div>
          
          <div class="relative w-full md:w-64">
            <Icon icon="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Cari No. Pesanan atau Pembeli..." 
              class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div class="flex-1 overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
              <th class="px-6 py-4">Pesanan</th>
              <th class="px-6 py-4">Tanggal</th>
              <th class="px-6 py-4">Pembeli</th>
              <th class="px-6 py-4">Item</th>
              <th class="px-6 py-4 text-right">Total</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-6 py-4">
                <p class="font-black text-navy text-sm">#{{ order.id }}</p>
                <div class="flex items-center gap-1 mt-0.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span class="text-[10px] text-gray-400 font-bold">{{ order.paymentStatus }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-xs text-navy font-bold">{{ order.date }}</p>
                <p class="text-[10px] text-gray-400">{{ order.time }}</p>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                   <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-[10px]">
                      {{ order.buyer.charAt(0) }}
                   </div>
                   <div>
                      <p class="text-xs font-black text-navy">{{ order.buyer }}</p>
                      <p class="text-[10px] text-gray-400">{{ order.city }}</p>
                   </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-xs text-navy font-medium">{{ order.items }} Item</p>
                <p class="text-[10px] text-gray-400 truncate max-w-[150px]">{{ order.itemName }}</p>
              </td>
              <td class="px-6 py-4 text-right">
                <p class="text-sm font-black text-navy">{{ formatCurrency(order.total) }}</p>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(order.status)" class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  {{ order.statusLabel }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                   <button class="p-2 bg-gray-100 text-gray-400 hover:text-navy hover:bg-primary transition-all rounded-lg">
                      <Icon icon="ph:eye" class="text-lg" />
                   </button>
                   <button v-if="order.status === 'pending'" class="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-navy transition-all rounded-lg">
                      <Icon icon="ph:check-bold" class="text-lg" />
                   </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredOrders.length === 0" class="flex flex-col items-center justify-center py-20">
          <Icon icon="ph:shopping-bag-open" class="text-6xl text-gray-100 mb-4" />
          <h3 class="text-lg font-black text-navy">Tidak ada pesanan</h3>
          <p class="text-sm text-gray-400 font-medium">Belum ada pesanan yang sesuai dengan filter Anda</p>
        </div>
      </div>

      <!-- Pagination Mock -->
      <div class="p-6 border-t border-gray-50 flex items-center justify-between">
         <p class="text-xs text-gray-400 font-medium">Menampilkan 1-{{ filteredOrders.length }} dari {{ filteredOrders.length }} pesanan</p>
         <div class="flex gap-2">
            <BaseButton variant="outline" size="xs" disabled>Sebelumnya</BaseButton>
            <BaseButton variant="outline" size="xs" disabled>Berikutnya</BaseButton>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

const activeTab = ref('all')
const searchQuery = ref('')

const tabs = [
  { label: 'Semua', value: 'all' },
  { label: 'Menunggu', value: 'pending' },
  { label: 'Diproses', value: 'processing' },
  { label: 'Dikirim', value: 'shipped' },
  { label: 'Selesai', value: 'done' },
]

const orderStats = [
  { 
    label: 'Total Pesanan', 
    value: '124', 
    icon: 'ph:shopping-bag', 
    colorClass: 'bg-primary/10 text-primary',
    trendIcon: 'ph:trend-up',
    trendColor: 'text-green-500',
    trendText: '+8.4%'
  },
  { 
    label: 'Pendapatan', 
    value: 'Rp 12.450.000', 
    icon: 'ph:money', 
    colorClass: 'bg-green-50 text-green-500',
    trendIcon: 'ph:trend-up',
    trendColor: 'text-green-500',
    trendText: '+12.5%'
  },
  { 
    label: 'Menunggu', 
    value: '8', 
    icon: 'ph:clock-afternoon', 
    colorClass: 'bg-amber-50 text-amber-500',
    trendIcon: 'ph:trend-down',
    trendColor: 'text-red-500',
    trendText: '-2.1%'
  },
  { 
    label: 'Rating Toko', 
    value: '4.8', 
    icon: 'ph:star', 
    colorClass: 'bg-blue-50 text-blue-500',
    trendIcon: 'ph:trend-up',
    trendColor: 'text-green-500',
    trendText: '+0.2%'
  },
]

const orders = ref([
  { 
    id: 'AH-202401-001', 
    date: '22 Jan 2024', 
    time: '14:20', 
    buyer: 'Budi Santoso', 
    city: 'Jakarta Selatan',
    items: 2, 
    itemName: 'Finger Tab Win&Win, Arm Guard Avalon',
    total: 850000, 
    status: 'pending', 
    statusLabel: 'Menunggu',
    paymentStatus: 'Dibayar'
  },
  { 
    id: 'AH-202401-002', 
    date: '21 Jan 2024', 
    time: '10:15', 
    buyer: 'Siti Aminah', 
    city: 'Bandung',
    items: 1, 
    itemName: 'Recurve Bow SF Optimo+, Blue 68/24',
    total: 2200000, 
    status: 'processing', 
    statusLabel: 'Diproses',
    paymentStatus: 'Dibayar'
  },
  { 
    id: 'AH-202401-003', 
    date: '20 Jan 2024', 
    time: '09:45', 
    buyer: 'Rahmat Hidayat', 
    city: 'Surabaya',
    items: 12, 
    itemName: 'Easton Apollo Arrows (Pack of 12)',
    total: 1800000, 
    status: 'shipped', 
    statusLabel: 'Dikirim',
    paymentStatus: 'Dibayar'
  },
  { 
    id: 'AH-202401-004', 
    date: '19 Jan 2024', 
    time: '16:30', 
    buyer: 'Andi Wijaya', 
    city: 'Medan',
    items: 1, 
    itemName: 'Arrow Quiver Easton Elite',
    total: 450000, 
    status: 'done', 
    statusLabel: 'Selesai',
    paymentStatus: 'Dibayar'
  },
  { 
    id: 'AH-202401-005', 
    date: '18 Jan 2024', 
    time: '11:20', 
    buyer: 'Dewi Lestari', 
    city: 'Semarang',
    items: 3, 
    itemName: 'Target Face 80cm, Face Pins, Target Hub',
    total: 120000, 
    status: 'pending', 
    statusLabel: 'Menunggu',
    paymentStatus: 'Menunggu Pembayaran'
  },
])

const filteredOrders = computed(() => {
  let result = orders.value

  if (activeTab.value !== 'all') {
    result = result.filter(order => order.status === activeTab.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(order => 
      order.id.toLowerCase().includes(q) || 
      order.buyer.toLowerCase().includes(q)
    )
  }

  return result
})

const getStatusClass = (status) => {
  const classes = {
    'pending': 'bg-amber-50 text-amber-500 border border-amber-100',
    'processing': 'bg-blue-50 text-blue-500 border border-blue-100',
    'shipped': 'bg-primary/10 text-primary border border-primary/20',
    'done': 'bg-green-50 text-green-500 border border-green-100',
    'cancelled': 'bg-red-50 text-red-500 border border-red-100',
  }
  return classes[status] || 'bg-gray-50 text-gray-400'
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}
</script>

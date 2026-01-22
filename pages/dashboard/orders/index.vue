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
      <div class="flex-1 overflow-x-auto relative">
        <div v-if="isLoading" class="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
        
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
              <th class="px-6 py-4">ID Pesanan</th>
              <th class="px-6 py-4">Tanggal</th>
              <th class="px-6 py-4 text-right">Total</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="order in filteredOrders" :key="order.uuid" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-6 py-4">
                <p class="font-black text-navy text-sm">#{{ order.uuid.substring(0, 8).toUpperCase() }}</p>
                <div class="flex items-center gap-1 mt-0.5">
                  <span class="w-1.5 h-1.5 rounded-full" :class="order.payment_status === 'paid' ? 'bg-green-500' : 'bg-red-500'"></span>
                  <span class="text-[10px] text-gray-400 font-bold uppercase">{{ order.payment_status }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-xs text-navy font-bold">{{ formatDate(order.created_at) }}</p>
              </td>
              <td class="px-6 py-4 text-right">
                <p class="text-sm font-black text-navy">{{ formatCurrency(order.total_amount) }}</p>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(order.status)" class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                   <button v-if="order.status === 'pending'" 
                     @click="updateStatus(order.uuid, 'processing')"
                     class="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-navy transition-all rounded-lg"
                     title="Proses Pesanan">
                      <Icon icon="ph:check-bold" class="text-lg" />
                   </button>
                   <button v-if="order.status === 'processing'" 
                     @click="updateStatus(order.uuid, 'shipped')"
                     class="p-2 bg-blue-50 text-blue-500 hover:bg-blue-600 hover:text-white transition-all rounded-lg"
                     title="Kirim Pesanan">
                      <Icon icon="ph:truck-bold" class="text-lg" />
                   </button>
                   <button class="p-2 bg-gray-100 text-gray-400 hover:text-navy hover:bg-primary transition-all rounded-lg">
                      <Icon icon="ph:eye" class="text-lg" />
                   </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="!isLoading && filteredOrders.length === 0" class="flex flex-col items-center justify-center py-20">
          <Icon icon="ph:shopping-bag-open" class="text-6xl text-gray-100 mb-4" />
          <h3 class="text-lg font-black text-navy">Tidak ada pesanan</h3>
          <p class="text-sm text-gray-400 font-medium">Belum ada pesanan yang sesuai dengan filter Anda</p>
        </div>
      </div>

      <!-- Pagination Mock -->
      <div class="p-6 border-t border-gray-50 flex items-center justify-between">
         <p class="text-xs text-gray-400 font-medium">Menampilkan {{ filteredOrders.length }} pesanan</p>
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

const { get, put } = useApi()
const { showToast } = useToast()

const activeTab = ref('all')
const searchQuery = ref('')
const orders = ref([])
const sellerStatsRaw = ref(null)
const isLoading = ref(true)

const tabs = [
  { label: 'Semua', value: 'all' },
  { label: 'Menunggu', value: 'pending' },
  { label: 'Diproses', value: 'processing' },
  { label: 'Dikirim', value: 'shipped' },
  { label: 'Selesai', value: 'done' },
]

const fetchOrdersData = async () => {
  isLoading.value = true
  try {
    const [ordersRes, statsRes] = await Promise.all([
      get('/orders'),
      get('/orders/stats')
    ])
    orders.value = ordersRes.data || []
    sellerStatsRaw.value = statsRes.data
  } catch (error) {
    showToast('Gagal mengambil data pesanan', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchOrdersData()
})

const orderStats = computed(() => [
  { 
    label: 'Total Pesanan', 
    value: sellerStatsRaw.value?.total_orders || 0, 
    icon: 'ph:shopping-bag', 
    colorClass: 'bg-primary/10 text-primary',
    trendIcon: 'ph:trend-up',
    trendColor: 'text-green-500',
    trendText: 'Live'
  },
  { 
    label: 'Pendapatan', 
    value: `Rp ${formatPrice(sellerStatsRaw.value?.total_revenue || 0)}`, 
    icon: 'ph:money', 
    colorClass: 'bg-green-50 text-green-500',
    trendIcon: 'ph:trend-up',
    trendColor: 'text-green-500',
    trendText: 'Live'
  },
  { 
    label: 'Produk Terjual', 
    value: sellerStatsRaw.value?.products_sold || 0, 
    icon: 'ph:package', 
    colorClass: 'bg-amber-50 text-amber-500',
    trendIcon: 'ph:trend-up',
    trendColor: 'text-green-500',
    trendText: 'Live'
  },
  { 
    label: 'Rating Toko', 
    value: sellerStatsRaw.value?.rating || '0.0', 
    icon: 'ph:star', 
    colorClass: 'bg-blue-50 text-blue-500',
    trendIcon: 'ph:trend-up',
    trendColor: 'text-green-500',
    trendText: 'Live'
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
      order.uuid.toLowerCase().includes(q)
      // Note: buyer name might need a join or additional field in the future
    )
  }

  return result
})

const updateStatus = async (orderId, newStatus) => {
  try {
    await put(`/orders/status/${orderId}`, { status: newStatus })
    showToast('Status pesanan diperbarui', 'success')
    fetchOrdersData()
  } catch (error) {
    showToast('Gagal memperbarui status', 'error')
  }
}

const getStatusClass = (status) => {
  const statusLower = status?.toLowerCase()
  const classes = {
    'pending': 'bg-amber-50 text-amber-500 border border-amber-100',
    'processing': 'bg-blue-50 text-blue-500 border border-blue-100',
    'shipped': 'bg-primary/10 text-primary border border-primary/20',
    'done': 'bg-green-50 text-green-500 border border-green-100',
    'cancelled': 'bg-red-50 text-red-500 border border-red-100',
  }
  return classes[statusLower] || 'bg-gray-50 text-gray-400'
}

const getStatusLabel = (status) => {
  const labels = {
    'pending': 'Menunggu',
    'processing': 'Diproses',
    'shipped': 'Dikirim',
    'done': 'Selesai',
    'cancelled': 'Dibatalkan'
  }
  return labels[status?.toLowerCase()] || status
}

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
</script>

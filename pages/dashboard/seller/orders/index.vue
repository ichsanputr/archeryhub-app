<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-navy text-white shadow-sm">
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
      </div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

      <div class="relative p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div class="flex items-center gap-5">
          <div
            class="size-14 sm:size-16 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <Icon icon="ph:shopping-cart-bold" class="text-primary text-3xl sm:text-4xl" />
          </div>
          <div>
            <h1 class="text-2xl sm:text-4xl font-black tracking-tight leading-tight capitalize">Pesanan masuk</h1>
            <div class="text-slate-300 text-xs sm:text-sm font-bold mt-1 tracking-wide capitalize">Kelola dan proses
              pesanan dari pembeli anda</div>
          </div>
        </div>
        <BaseButton variant="primary" icon="ph:download-bold" @click="exportOrders" :loading="isExporting"
          class="h-12 px-8 font-black capitalize tracking-widest text-xs shadow-lg shadow-primary/20">
          Ekspor laporan
        </BaseButton>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-end">
      <div class="w-full md:w-64">
        <BaseSelect v-model="statusFilter" :items="statusOptions" label="Status Pesanan" />
      </div>
      <BaseButton variant="white" icon="ph:funnel" @click="statusFilter = 'all'" class="h-11">
        Reset Filter
      </BaseButton>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div v-if="isLoading" class="py-20 flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <div class="text-gray-400 font-bold">Memuat pesanan...</div>
      </div>
      <div v-else-if="orders.length === 0" class="text-center py-20">
        <Icon icon="ph:package-bold" class="text-6xl text-gray-100 mx-auto mb-4" />
        <div class="text-gray-400 font-bold">Tidak ada pesanan ditemukan</div>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full border-collapse min-w-[1000px]">
          <thead>
            <tr class="text-left bg-gray-50/50 border-b border-gray-100">
              <th class="px-8 py-5  text-xs font-black tracking-widest text-gray-400">
                ID Pesanan</th>
              <th @click="toggleSort('created_at')"
                class="px-8 py-5  text-xs font-black tracking-widest text-gray-400 cursor-pointer hover:text-navy transition-colors">
                <div class="flex items-center gap-2">
                  Tanggal
                  <Icon v-if="sortBy === 'created_at'"
                    :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                </div>
              </th>
              <th @click="toggleSort('buyer_name')"
                class="px-8 py-5  text-xs font-black tracking-widest text-gray-400 cursor-pointer hover:text-navy transition-colors">
                <div class="flex items-center gap-2">
                  Pelanggan
                  <Icon v-if="sortBy === 'buyer_name'"
                    :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                </div>
              </th>
              <th @click="toggleSort('total_amount')"
                class="px-8 py-5  text-xs font-black tracking-widest text-gray-400 cursor-pointer hover:text-navy transition-colors">
                <div class="flex items-center gap-2">
                  Total
                  <Icon v-if="sortBy === 'total_amount'"
                    :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                </div>
              </th>
              <th @click="toggleSort('status')"
                class="px-8 py-5  text-xs font-black tracking-widest text-gray-400 cursor-pointer hover:text-navy transition-colors">
                <div class="flex items-center gap-2">
                  Status
                  <Icon v-if="sortBy === 'status'" :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                    class="text-primary" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                </div>
              </th>
              <th class="px-8 py-5  text-xs font-black tracking-widest text-gray-400 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="order in orders" :key="order.id" class="group hover:bg-gray-50/80 transition-all duration-300">
              <td class="px-8 py-6">
                <div class="font-black text-navy text-sm tracking-wider group-hover:text-primary transition-colors">#{{
                  (order.id || '').slice(0, 8) }}</div>
              </td>
              <td class="px-8 py-6">
                <div class="text-sm text-gray-500 font-medium">{{ formatDate(order.created_at) }}</div>
              </td>
              <td class="px-8 py-6">
                <div class="font-bold text-navy">{{ order.customer_name || 'Pelanggan' }}</div>
                <div class="text-[10px] text-gray-400 mt-0.5">{{ order.customer_email }}</div>
              </td>
              <td class="px-8 py-6">
                <div class="font-black text-navy">Rp {{ formatPrice(order.total_amount) }}</div>
                <div class="text-[10px] text-gray-400 mt-0.5 tracking-wide">{{ order.total_items }} item dipesan</div>
              </td>
              <td class="px-8 py-6">
                <span :class="getStatusClass(order.status)"
                  class="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-sm">
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <BaseButton variant="white" size="md" icon="ph:arrow-right-bold"
                  class="h-11 px-5 !rounded-xl border-gray-100 text-gray-400 hover:text-white hover:bg-navy hover:border-navy transition-all shadow-sm"
                  :to="`/dashboard/seller/orders/${order.id}`">
                  Detail
                </BaseButton>
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
import { ref, onMounted, watch } from 'vue'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Pesanan Masuk - Dashboard Seller' })

const { get } = useApi()
const toast = useToast()

const orders = ref([])
const isLoading = ref(true)
const isExporting = ref(false)
const statusFilter = ref('all')
const sortBy = ref('created_at')
const order = ref('DESC')

const statusOptions = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Menunggu', value: 'pending' },
  { label: 'Lunas', value: 'paid' },
  { label: 'Dikirim', value: 'shipping' },
  { label: 'Selesai', value: 'completed' },
  { label: 'Dibatalkan', value: 'cancelled' }
]

const fetchOrders = async () => {
  isLoading.value = true
  try {
    const response = await get('/orders', {
      query: {
        status: statusFilter.value,
        sort_by: sortBy.value,
        order: order.value
      }
    })
    orders.value = response.data || []
  } catch (error) {
    toast.error('Gagal mengambil data pesanan')
  } finally {
    isLoading.value = false
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

const exportOrders = () => {
  isExporting.value = true
  try {
    const config = useRuntimeConfig()
    const url = `${config.public.apiBase}/orders/export?status=${statusFilter.value}`
    window.open(url, '_blank')
    toast.success('Laporan pesanan berhasil diekspor')
  } catch (error) {
    toast.error('Gagal mengekspor laporan')
  } finally {
    isExporting.value = false
  }
}

onMounted(fetchOrders)
watch([statusFilter, sortBy, order], fetchOrders)

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price || 0)
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Menunggu',
    paid: 'Lunas',
    shipping: 'Dikirim',
    completed: 'Selesai',
    cancelled: 'Batal'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-amber-50 text-amber-600 border border-amber-100',
    paid: 'bg-blue-50 text-blue-600 border border-blue-100',
    shipping: 'bg-purple-50 text-purple-600 border border-purple-100',
    completed: 'bg-green-50 text-green-600 border border-green-100',
    cancelled: 'bg-red-50 text-red-600 border border-red-100'
  }
  return classes[status] || 'bg-gray-50 text-gray-600 border border-gray-100'
}
</script>

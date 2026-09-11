<template>
  <div class="space-y-8">
    <!-- Standardized Dashboard Header -->
    <DashboardHeader
      :title="t('seller_orders.title', 'Pesanan Toko')"
      :subtitle="t('seller_orders.subtitle', 'Kelola daftar pesanan, konfirmasi pembayaran, dan status pengiriman.')"
      icon="ph:shopping-cart-bold"
      :breadcrumbs="[
        { label: t('common.dashboard', 'Dashboard'), to: '/dashboard' },
        { label: t('seller.title', 'Toko Saya'), to: '/dashboard/seller' },
        { label: t('seller_orders.title', 'Pesanan Toko') }
      ]"
    >
      <template #actions>
        <BaseButton variant="primary" icon="ph:download-bold" @click="exportOrders" :loading="isExporting"
          class="h-11 px-6 font-black tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
          {{ t('seller_orders.export_button', 'Ekspor Laporan') }}
        </BaseButton>
      </template>
    </DashboardHeader>

    <!-- Advanced Search & Filters Bar -->
    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <!-- Search Input -->
        <div>
          <label class="block text-[10px] font-black text-gray-400 tracking-widest mb-1 px-1">{{ t('seller_orders.search_label', 'Cari Pesanan') }}</label>
          <div class="relative">
            <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input v-model="searchQuery" type="text" :placeholder="t('seller_orders.search_placeholder', 'No. Order, nama/email...')"
              class="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary/40 focus:bg-white transition-all outline-none" />
          </div>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-[10px] font-black text-gray-400 tracking-widest mb-1 px-1">{{ t('seller_orders.status_filter', 'Status Pesanan') }}</label>
          <BaseSelect v-model="statusFilter" :items="statusOptions" item-title="title" item-value="value" dense />
        </div>

        <!-- Date Range Filter (Start Date) -->
        <div>
          <BaseDatePicker v-model="startDate" :label="t('seller_orders.start_date', 'Dari Tanggal')" :placeholder="t('seller_orders.select_date_placeholder')" clearable />
        </div>

        <!-- Date Range Filter (End Date) -->
        <div>
          <BaseDatePicker v-model="endDate" :label="t('seller_orders.end_date', 'Sampai Tanggal')" :placeholder="t('seller_orders.select_date_placeholder')" clearable />
        </div>
      </div>

      <!-- Action Bar -->
      <div v-if="searchQuery || statusFilter !== 'all' || startDate || endDate" class="flex items-center justify-between pt-2 border-t border-gray-100">
        <span class="text-xs font-bold text-gray-500">
          {{ t("seller_orders.showing_orders", { current: filteredOrders.length, total: orders.length }) }}
        </span>
        <button @click="resetFilters" class="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1">
          <Icon icon="ph:arrow-counter-clockwise-bold" />
          {{ t('seller_orders.reset_filter', 'Reset Filter') }}
        </button>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div v-if="isLoading" class="py-20 flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <div class="text-gray-400 font-bold text-xs">{{ t('seller_orders.loading', 'Memuat daftar pesanan...') }}</div>
      </div>
      <div v-else-if="filteredOrders.length === 0" class="text-center py-20">
        <Icon icon="ph:package-bold" class="text-5xl text-gray-200 mx-auto mb-3" />
        <div class="text-gray-500 font-bold text-sm">{{ t('seller_orders.no_orders', 'Belum ada pesanan masuk') }}</div>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full border-collapse min-w-[1000px]">
          <thead>
            <tr class="text-left bg-gray-50/50 border-b border-gray-100">
              <th class="px-6 py-4 text-xs font-black tracking-widest text-gray-400">
                {{ t('seller_orders.table_order_id', 'No. Order') }}</th>
              <th @click="toggleSort('created_at')"
                class="px-6 py-4 text-xs font-black tracking-widest text-gray-400 cursor-pointer hover:text-navy transition-colors">
                <div class="flex items-center gap-2">
                  {{ t('seller_orders.table_date', 'Tanggal') }}
                  <Icon v-if="sortBy === 'created_at'"
                    :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                </div>
              </th>
              <th @click="toggleSort('buyer_name')"
                class="px-6 py-4 text-xs font-black tracking-widest text-gray-400 cursor-pointer hover:text-navy transition-colors">
                <div class="flex items-center gap-2">
                  {{ t('seller_orders.table_customer', 'Pelanggan') }}
                  <Icon v-if="sortBy === 'buyer_name'"
                    :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                </div>
              </th>
              <th @click="toggleSort('total_amount')"
                class="px-6 py-4 text-xs font-black tracking-widest text-gray-400 cursor-pointer hover:text-navy transition-colors">
                <div class="flex items-center gap-2">
                  {{ t('seller_orders.table_total', 'Total') }}
                  <Icon v-if="sortBy === 'total_amount'"
                    :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                </div>
              </th>
              <th @click="toggleSort('status')"
                class="px-6 py-4 text-xs font-black tracking-widest text-gray-400 cursor-pointer hover:text-navy transition-colors">
                <div class="flex items-center gap-2">
                  {{ t('seller_orders.table_status', 'Status') }}
                  <Icon v-if="sortBy === 'status'" :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                    class="text-primary" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                </div>
              </th>
              <th class="px-6 py-4 text-xs font-black tracking-widest text-gray-400 text-right">{{ t('seller_orders.table_actions', 'Aksi') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="orderItem in filteredOrders" :key="orderItem.id" class="group hover:bg-gray-50/80 transition-all duration-200">
              <td class="px-6 py-4">
                <div class="font-black text-navy text-sm tracking-wider group-hover:text-primary transition-colors">#{{
                  (orderItem.id || '').slice(0, 8) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-xs text-gray-500 font-medium">{{ formatDate(orderItem.created_at) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="font-bold text-navy text-xs">{{ orderItem.customer_name || 'Pelanggan' }}</div>
                <div class="text-[10px] text-gray-400 mt-0.5">{{ orderItem.customer_email }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="font-black text-navy text-xs">Rp {{ formatPrice(orderItem.total_amount) }}</div>
                <div class="text-[10px] text-gray-400 mt-0.5 tracking-wide">{{ orderItem.total_items }} item dipesan</div>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(orderItem.status)"
                  class="px-3 py-1 rounded-full text-[10px] font-black tracking-widest shadow-sm">
                  {{ getStatusLabel(orderItem.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <BaseButton variant="white" size="sm" icon="ph:arrow-right-bold"
                  class="h-9 px-4 !rounded-xl border-gray-100 text-gray-400 hover:text-white hover:bg-navy hover:border-navy transition-all shadow-sm text-xs"
                  :to="`/dashboard/seller/orders/${orderItem.id}`">
                  {{ t('seller_orders.detail_button', 'Detail') }}
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
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({ layout: 'dashboard' })

const { t } = useDashboardI18n()

useHead({ title: computed(() => `${t('seller_orders.title', 'Pesanan Toko')} - Dashboard Seller`) })

const { get } = useApi()
const toast = useToast()

const orders = ref([])
const isLoading = ref(true)
const isExporting = ref(false)

const searchQuery = ref('')
const statusFilter = ref('all')
const startDate = ref('')
const endDate = ref('')

const sortBy = ref('created_at')
const order = ref('DESC')

const statusOptions = computed(() => [
  { title: t('seller_orders.status_all', 'Semua Status'), label: t('seller_orders.status_all', 'Semua Status'), value: 'all' },
  { title: t('seller_orders.status_pending', 'Menunggu Pembayaran'), label: t('seller_orders.status_pending', 'Menunggu Pembayaran'), value: 'pending' },
  { title: t('seller_orders.status_paid', 'Sudah Dibayar'), label: t('seller_orders.status_paid', 'Sudah Dibayar'), value: 'paid' },
  { title: t('seller_orders.status_shipping', 'Dalam Pengiriman'), label: t('seller_orders.status_shipping', 'Dalam Pengiriman'), value: 'shipping' },
  { title: t('seller_orders.status_completed', 'Selesai'), label: t('seller_orders.status_completed', 'Selesai'), value: 'completed' },
  { title: t('seller_orders.status_cancelled', 'Dibatalkan'), label: t('seller_orders.status_cancelled', 'Dibatalkan'), value: 'cancelled' }
])

const filteredOrders = computed(() => {
  let list = [...orders.value]

  // Filter by search query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(o =>
      (o.id || '').toLowerCase().includes(q) ||
      (o.customer_name || '').toLowerCase().includes(q) ||
      (o.customer_email || '').toLowerCase().includes(q)
    )
  }

  // Filter by date range
  if (startDate.value) {
    const start = new Date(startDate.value).getTime()
    list = list.filter(o => new Date(o.created_at).getTime() >= start)
  }
  if (endDate.value) {
    const end = new Date(endDate.value).setHours(23, 59, 59, 999)
    list = list.filter(o => new Date(o.created_at).getTime() <= end)
  }

  return list
})

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  startDate.value = ''
  endDate.value = ''
}

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
    orders.value = response.data || response.orders || response || []
  } catch (error) {
    toast.error(t('seller_orders.fetch_error'))
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
    pending: t('seller_orders.status_pending'),
    paid: t('seller_orders.status_paid'),
    shipping: t('seller_orders.status_shipping'),
    completed: t('seller_orders.status_completed'),
    cancelled: t('seller_orders.status_cancelled')
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

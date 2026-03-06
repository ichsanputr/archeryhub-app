<template>
    <div class="space-y-8">
        <!-- Seller Header -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <!-- Decorative Background Elements (Glows) -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                    <div
                        class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                        <Icon icon="ph:storefront-bold" class="text-primary text-2xl sm:text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-3xl font-black tracking-tight">Ringkasan Toko</h1>
                        <p class="text-slate-300 text-xs sm:text-sm font-medium mt-1">Selamat datang di dashboard
                            penjual Anda,
                            <span class="text-white font-bold">{{ storeDisplayName }}</span>
                        </p>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <NuxtLink to="/dashboard/seller/products" class="w-full sm:w-auto">
                        <BaseButton variant="primary" icon="ph:plus-circle-bold"
                            class="w-full h-10 sm:h-11 px-6 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-xs">
                            Tambah Produk
                        </BaseButton>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Seller Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div v-for="stat in renderedSellerStats" :key="stat.label"
                class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-sm transition-all group overflow-hidden relative">
                <div
                    class="absolute -right-4 -top-4 w-24 h-24 bg-gray-50 rounded-full group-hover:bg-primary/5 transition-colors duration-500">
                </div>

                <div class="flex justify-between items-start mb-4 relative z-10">
                    <div
                        class="p-3 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-navy transition-all duration-300">
                        <Icon :icon="stat.icon" class="text-2xl" />
                    </div>
                </div>

                <div class="relative z-10">
                    <p class="text-gray-400 text-[10px] font-black  tracking-widest mb-1">{{ stat.label }}</p>
                    <p class="text-navy text-3xl font-black tracking-tight tabular-nums">{{ stat.value }}</p>
                    <p class="text-gray-400 text-xs mt-2 font-medium">{{ stat.desc }}</p>
                </div>
            </div>
        </div>

        <!-- Main Content for Seller -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Recent Orders & Performance Chart -->
            <div class="lg:col-span-2 space-y-8">
                <!-- Recent Orders -->
                <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div class="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 class="font-black text-navy flex items-center gap-2">
                            <Icon icon="ph:shopping-cart-bold" class="text-primary" />
                            Pesanan Terbaru
                        </h3>
                        <NuxtLink to="/dashboard/seller/orders">
                            <BaseButton variant="ghost" size="xs">Lihat Semua</BaseButton>
                        </NuxtLink>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-50/50">
                                    <th class="px-6 py-4 text-[10px] font-black text-gray-400  tracking-widest">ID
                                        Pesanan</th>
                                    <th class="px-6 py-4 text-[10px] font-black text-gray-400  tracking-widest">Total
                                    </th>
                                    <th class="px-6 py-4 text-[10px] font-black text-gray-400  tracking-widest">Status
                                    </th>
                                    <th class="px-6 py-4 text-[10px] font-black text-gray-400  tracking-widest">Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50">
                                <tr v-for="order in sellerRecentOrders" :key="order.uuid"
                                    class="hover:bg-gray-50/50 transition-colors group">
                                    <td class="px-6 py-4">
                                        <span class="font-bold text-navy text-sm">{{ order.uuid.substring(0,
                                            8).toUpperCase() }}</span>
                                        <p class="text-[10px] text-gray-400 font-medium">{{ formatDate(order.created_at)
                                        }}</p>
                                    </td>
                                    <td class="px-6 py-4">
                                        <p class="font-black text-navy text-sm">Rp {{ formatPrice(order.total_amount) }}
                                        </p>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span :class="getStatusBadgeClass(order.status)"
                                            class="text-[9px] font-black px-2.5 py-1 rounded-full  tracking-tighter ring-1 ring-inset">
                                            {{ order.status }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4">
                                        <BaseButton :to="`/dashboard/seller/orders/${order.uuid}`" variant="white"
                                            size="sm" icon="ph:eye-bold"
                                            class="h-9 w-9 p-0 text-gray-400 hover:text-primary border-transparent hover:border-primary/20 shadow-none" />
                                    </td>
                                </tr>
                                <tr v-if="!sellerRecentOrders.length">
                                    <td colspan="4" class="px-6 py-10 text-center text-gray-400 text-sm">Tidak ada
                                        pesanan terbaru</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Sales Performance Chart (Chart.js) -->
                <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <h3 class="text-xl font-black mb-1 text-navy">Performa Penjualan</h3>
                            <p class="text-gray-400 text-xs font-medium">Statistik 7 hari terakhir</p>
                        </div>
                        <Icon icon="ph:chart-line-up-bold" class="text-4xl text-primary/20" />
                    </div>

                    <div class="h-64">
                        <Bar v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
                        <div v-else class="h-full flex items-center justify-center text-gray-400 italic">Memuat
                            grafik...</div>
                    </div>
                </div>
            </div>

            <!-- Side Panels -->
            <div class="space-y-8">
                <!-- Inventory Alerts -->
                <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 class="font-black text-navy mb-6 text-xs  tracking-[0.2em] flex items-center gap-2">
                        <Icon icon="ph:warning-circle-bold" class="text-amber-500" />
                        Stok Menipis
                    </h3>
                    <div class="space-y-4">
                        <div v-for="product in sellerStockAlerts" :key="product.id"
                            class="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div class="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                <img v-if="product.image_url" :src="product.image_url"
                                    class="w-full h-full object-cover">
                                <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                                    <Icon icon="ph:package" class="text-xl" />
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p
                                    class="text-sm font-bold text-navy truncate group-hover:text-primary transition-colors">
                                    {{
                                        product.name }}</p>
                                <div class="flex items-center gap-2 mt-1">
                                    <span
                                        class="text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full ">Sisa
                                        {{ product.stock }}</span>
                                </div>
                            </div>
                        </div>

                        <div v-if="!sellerStockAlerts.length" class="text-center py-6">
                            <Icon icon="ph:check-circle-bold" class="text-3xl text-green-200 mx-auto mb-2" />
                            <p class="text-gray-400 text-xs">Stok semua produk aman</p>
                        </div>
                    </div>
                    <NuxtLink to="/dashboard/seller/products"
                        class="block w-full text-center mt-6 text-[10px] font-black text-gray-400 hover:text-primary  tracking-widest transition-colors">
                        Kelola Semua Produk
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useTheme } from '~/composables/useTheme'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Dashboard Seller - ArcheryHub'
})

const api = useApi()
const toast = useToast()
const { user } = useAuth()
const { themeColors } = useTheme()

// Seller-specific reactive state
const sellerStatsRaw = ref(null)
const sellerRecentOrders = ref([])
const sellerStockAlerts = ref([])
const isLoadingSellerData = ref(false)

// Chart state
const chartData = ref({ labels: [], datasets: [] })
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }
    },
    scales: {
        y: { beginAtZero: true, grid: { display: false } },
        x: { grid: { display: false } }
    }
}

onMounted(() => {
    fetchSellerDashboardData()
})

watch(themeColors, () => {
    if (sellerRecentOrders.value.length) {
        prepareChartData(sellerRecentOrders.value)
    }
})

const fetchSellerDashboardData = async () => {
    isLoadingSellerData.value = true
    try {
        const [statsRes, ordersRes, productsRes] = await Promise.all([
            api.get('/orders/stats'),
            api.get('/orders'),
            api.get('/products/my')
        ])

        sellerStatsRaw.value = statsRes.data
        sellerRecentOrders.value = (ordersRes.data || []).slice(0, 5)

        if (productsRes.data) {
            sellerStockAlerts.value = productsRes.data.filter(p => p.stock < 5)
        }

        prepareChartData(ordersRes.data || [])
    } catch (error) {
        console.error('Failed to fetch seller data:', error)
    } finally {
        isLoadingSellerData.value = false
    }
}

const prepareChartData = (orders) => {
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        return d.toISOString().split('T')[0]
    }).reverse()

    const dailyTotals = last7Days.map(day => {
        return orders
            .filter(o => o.created_at.startsWith(day))
            .reduce((sum, o) => sum + parseFloat(o.total_amount), 0)
    })

    chartData.value = {
        labels: last7Days.map(d => new Date(d).toLocaleDateString('id-ID', { weekday: 'short' })),
        datasets: [{
            label: 'Penjualan (Rp)',
            backgroundColor: themeColors.value.primary,
            borderRadius: 8,
            data: dailyTotals
        }]
    }
}

const renderedSellerStats = computed(() => [
    { label: 'Total Pendapatan', value: `Rp ${formatPrice(sellerStatsRaw.value?.total_revenue || 0)}`, icon: 'ph:money-bold', desc: 'Total akumulasi' },
    { label: 'Total Pesanan', value: sellerStatsRaw.value?.total_orders || 0, icon: 'ph:shopping-cart-bold', desc: 'Semua pesanan masuk' },
    { label: 'Produk Terjual', value: sellerStatsRaw.value?.products_sold || 0, icon: 'ph:package-bold', desc: 'Item terbayar' },
    { label: 'Rating Toko', value: sellerStatsRaw.value?.rating || '0.0', icon: 'ph:star-bold', desc: 'Nilai dari pembeli' },
])

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price)
const storeDisplayName = computed(() => user.value?.store_name || user.value?.full_name || 'Penjual')

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

const getStatusBadgeClass = (status) => {
    const statusLower = status?.toLowerCase()
    const classes = {
        'pending': 'text-amber-600 bg-amber-50 ring-amber-500/10',
        'processing': 'text-blue-600 bg-blue-50 ring-blue-500/10',
        'shipped': 'text-purple-600 bg-purple-50 ring-purple-500/10',
        'done': 'text-green-600 bg-green-50 ring-green-500/10',
        'cancelled': 'text-red-600 bg-red-50 ring-red-500/10',
    }
    return classes[statusLower] || 'text-gray-600 bg-gray-50 ring-gray-500/10'
}
</script>

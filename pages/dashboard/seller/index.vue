<template>
  <div class="space-y-8">
    <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
      </div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

      <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-5">
          <div
            class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <Icon icon="ph:storefront-bold" class="text-primary text-2xl sm:text-3xl" />
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-black tracking-tight leading-none text-white">{{ t('seller.header.title', 'Ringkasan Seller') }}</h1>
            <div class="text-slate-300 text-[10px] sm:text-xs font-bold mt-1 tracking-wide capitalize">{{ t('seller.header.subtitle', 'Pantau performa dan operasional toko anda') }}</div>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <NuxtLink to="/dashboard/seller/products/add">
            <BaseButton variant="primary" icon="ph:plus-bold"
              class="h-11 px-5 font-black text-[10px] capitalize tracking-widest !rounded-xl shadow-lg shadow-primary/20">
              {{ t('seller.buttons.add_product', 'Tambah Produk') }}
            </BaseButton>
          </NuxtLink>
          <NuxtLink to="/dashboard/seller/store">
            <BaseButton variant="white" icon="ph:storefront-bold"
              class="h-11 px-5 font-black text-[10px] capitalize tracking-widest !rounded-xl border-white/10">
              {{ t('seller.buttons.store_profile', 'Profil toko') }}
            </BaseButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        :title="t('seller.stats.total_products', 'Total Produk')"
        :value="products.length"
        icon="ph:package-bold"
        color="primary"
      >
        <template #footer>
          <div class="flex items-center gap-2">
            <span class="text-[9px] font-black text-green-500 bg-green-50 px-1.5 py-0.5 rounded capitalize">{{ products.filter(p => p.status === 'active').length }} {{ t('seller.stats.active', 'aktif') }}</span>
            <span class="text-[9px] font-black text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded capitalize">{{ products.filter(p => p.status === 'draft').length }} {{ t('seller.stats.draft', 'draft') }}</span>
          </div>
        </template>
      </StatCard>

      <StatCard
        :title="t('seller.stats.total_sold', 'Total Terjual')"
        :value="totalSold"
        icon="ph:shopping-bag-open-bold"
        color="primary"
        :description="t('seller.stats.delivered', 'Item terkirim ke pelanggan')"
      />

      <StatCard
        :title="t('seller.stats.total_views', 'Total Tayangan')"
        :value="totalViews.toLocaleString('id-ID')"
        icon="ph:eye-bold"
        color="primary"
        :description="t('seller.stats.page_views', 'Kunjungan halaman produk')"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Best Selling Products -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="p-5 px-6 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-xs font-black text-navy capitalize tracking-widest flex items-center gap-2">
            <Icon icon="ph:fire-bold" class="text-primary" />
            {{ t('seller.sections.top_selling', 'Produk Paling Laris') }}
          </h2>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="product in topSellingProducts" :key="product.id"
            class="p-4 px-6 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
            <div class="size-12 rounded-xl bg-gray-50 overflow-hidden shrink-0">
              <img :src="product.image" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-black text-navy truncate">{{ product.name }}</div>
              <div class="text-[10px] text-gray-400 font-bold tracking-wider">{{ product.category }}</div>
            </div>
            <div class="text-right">
              <div class="text-sm font-black text-navy">{{ product.sold }} {{ t('seller.stats.sold_unit', 'Terjual') }}</div>
              <div class="text-[10px] text-primary font-bold tracking-wider">Rp {{ formatCurrencyValue(product.price) }}
              </div>
            </div>
          </div>
          <div v-if="!loading && topSellingProducts.length === 0" class="p-12 text-center text-gray-400 text-sm">
            {{ t('common.no_data_sales', 'Belum ada data penjualan.') }}
          </div>
        </div>
      </div>

      <!-- Latest Products -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="p-5 px-6 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-xs font-black text-navy capitalize tracking-widest flex items-center gap-2">
            <Icon icon="ph:clock-bold" class="text-primary" />
            {{ t('seller.sections.latest', 'Produk Terbaru') }}
          </h2>
          <NuxtLink to="/dashboard/seller/products">
            <BaseButton variant="ghost" class="text-xs font-black tracking-widest text-primary">{{ t('common.view_all', 'Lihat Semua') }}
            </BaseButton>
          </NuxtLink>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="product in latestProducts" :key="product.id"
            class="p-4 px-6 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
            <div class="size-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
              <img :src="product.image" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-black text-navy truncate">{{ product.name }}</div>
              <div class="text-[10px] text-gray-400 font-bold tracking-wider">{{ t('seller.stats.stock_label', 'Stok') }}: {{ product.stock }}</div>
            </div>
            <div class="text-right">
              <NuxtLink :to="`/dashboard/seller/products/${product.id}`">
                <BaseButton variant="outline" size="xs" icon="ph:pencil-simple" class="!rounded-lg" />
              </NuxtLink>
            </div>
          </div>
          <div v-if="!loading && latestProducts.length === 0" class="p-12 text-center text-gray-400 text-sm">
            {{ t('common.no_products', 'Belum ada produk.') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref } from 'vue'
import { useApi } from '~/composables/useApi'
import useDashboardI18n from '~/composables/useDashboardI18n'

const { t } = useDashboardI18n()

definePageMeta({ layout: 'dashboard' })
useHead({ title: computed(() => t('seller.dashboard_title', 'Store Dashboard') + ' - Archeris Dashboard') })

const api = useApi()

const loading = ref(false)
const products = ref([])
const walletBalance = ref(0)

const fetchData = async () => {
  loading.value = true
  try {
    const [productsRes, walletRes] = await Promise.all([
      api.get('/products/my').catch(() => ({ data: [] })),
      api.get('/sellers/wallet').catch(() => ({ data: { balance: 0 } }))
    ])

    // Process products
    products.value = (productsRes.data || []).map(p => ({
      ...p,
      id: p.id || p.uuid,
      image: useImageOrDefault(p.image_url),
      sold: p.sold || 0,
      views: p.views || 0
    }))

    const wallet = walletRes?.data || walletRes || { balance: 0 }
    walletBalance.value = Number(wallet.balance || 0)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const latestProducts = computed(() => {
  return [...products.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
})

const topSellingProducts = computed(() => {
  return [...products.value].sort((a, b) => b.sold - a.sold).slice(0, 5)
})

const totalSold = computed(() => products.value.reduce((acc, p) => acc + (p.sold || 0), 0))
const totalViews = computed(() => products.value.reduce((acc, p) => acc + (p.views || 0), 0))

const formatCurrencyValue = (value) => {
  return new Intl.NumberFormat('id-ID').format(Number(value || 0))
}

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
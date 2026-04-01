<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <section class="bg-navy relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24">
            <div class="absolute inset-0 z-0">
                <img :src="allowedProductImages[0]"
                    alt="Shop Background" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                </div>
            </div>
            <div class="container mx-auto px-4 max-w-7xl relative z-10">
                <div class="max-w-3xl">
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary text-[10px] sm:text-sm font-bold tracking-widest mb-6">
                        <Icon icon="ph:shopping-bag-bold" class="text-base sm:text-lg" />
                        <span>Katalog Produk Panahan</span>
                    </div>
                    <h1
                        class="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                        Lengkapi <span class="text-primary">Peralatan</span><br />
                        Panahan Terbaikmu
                    </h1>
                    <p class="text-white/90 text-sm md:text-lg leading-relaxed max-w-xl">
                        Temukan peralatan berkualitas dari berbagai klub dan organisasi terpercaya di seluruh Indonesia.
                    </p>

                    <!-- Search Bar CTA -->
                    <div class="mt-10 flex flex-col sm:flex-row gap-4 max-w-xl">
                        <div class="relative flex-1">
                            <Icon icon="ph:magnifying-glass-bold"
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input v-model="searchQuery" type="text" placeholder="Cari produk seperti busur, arrow..."
                                class="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-navy font-medium placeholder:text-gray-400 focus:ring-4 focus:ring-primary/30 outline-none transition-all text-base" />
                        </div>
                        <button
                            class="px-6 py-3.5 bg-primary hover:bg-primary-hover text-navy font-black rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                            <Icon icon="ph:magnifying-glass-bold" />
                            Cari
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Search & Filter Bar -->
        <section class="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
            <div class="container mx-auto px-4 max-w-7xl py-4">
                <div class="flex flex-col md:flex-row gap-4 items-center">
                    <div class="flex-grow w-full md:max-w-md">
                        <div class="relative">
                            <Icon icon="ph:magnifying-glass"
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                            <input v-model="searchQuery" type="text" placeholder="Cari produk panahan..."
                                class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" />
                        </div>
                    </div>
                    <div class="flex items-center gap-3 w-full md:w-auto">
                        <div class="min-w-[150px]">
                            <BaseSelect v-model="categoryFilter" :items="categories" item-title="label"
                                item-value="value" placeholder="Semua Kategori" />
                        </div>
                        <div class="min-w-[150px]">
                            <BaseSelect v-model="sortBy" :items="sortOptions" placeholder="Urutan" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Categories -->
        <section class="container mx-auto px-4 max-w-7xl py-8">
            <div class="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                <button v-for="cat in categories" :key="cat.value" @click="categoryFilter = cat.value" :class="[
                    'flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all',
                    categoryFilter === cat.value
                        ? 'bg-navy text-white shadow-sm shadow-navy/20'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-navy'
                ]">
                    <Icon :icon="cat.icon" class="text-lg" />
                    {{ cat.label }}
                </button>
            </div>
        </section>

        <!-- Products Grid -->
        <section class="container mx-auto px-4 max-w-7xl pb-16">
            <Transition name="fade" mode="out-in">
                <ProductListSkeleton v-if="isLoading" key="skeleton" />
                <div v-else-if="filteredProducts.length === 0 && !isLoading" key="empty"
                    class="flex flex-col items-center justify-center py-20">
                    <Icon icon="ph:package-light" class="text-7xl text-gray-200 mb-6" />
                    <h3 class="text-lg sm:text-2xl font-black text-navy mb-3">Produk Tidak Ditemukan</h3>
                    <p class="text-gray-500 max-w-md mx-auto text-center">Coba ubah filter atau kata kunci pencarian
                        untuk
                        menemukan produk yang sesuai.</p>
                </div>
                <div v-else key="content" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    <!-- Product Card Premium -->
                    <a v-for="product in filteredProducts" :key="product.id"
                        :href="`/products/${product.slug || product.id}`"
                        class="bg-white rounded-3xl border border-stone-200 flex flex-col shadow-sm hover:border-stone-300 transition-all group overflow-hidden h-full">

                        <!-- Product Image Container -->
                        <div class="relative pt-[100%] bg-stone-50 overflow-hidden">
                            <img :src="getProductImage(product.image_url)" :alt="product.name"
                                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700" />

                            <!-- Premium Overlays -->
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            </div>

                            <!-- Sale Badge -->
                            <div v-if="product.sale_price" class="absolute top-4 left-4 z-10">
                                <div
                                    class="px-3 py-1 bg-stone-900 text-white text-[10px] font-black rounded-lg shadow-sm flex items-center gap-1">
                                    <Icon icon="ph:tag-fill" />
                                    PROMO
                                </div>
                            </div>

                            <div
                                class="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                <div
                                    class="w-full py-2.5 bg-white/92 backdrop-blur-md text-navy text-xs font-black rounded-xl text-center shadow-sm flex items-center justify-center gap-2">
                                    <Icon icon="ph:arrow-square-out-bold" class="text-sm" />
                                    LIHAT DETAIL
                                </div>
                            </div>
                        </div>

                        <!-- Product Content -->
                        <div class="p-6 flex flex-col flex-1">
                            <!-- Category & Status -->
                            <div class="flex items-center justify-between mb-3">
                                <span
                                    class="text-[10px] font-black text-stone-600 tracking-widest bg-stone-100 px-2 py-0.5 rounded-md uppercase">
                                    {{ getCategoryLabel(product.category) }}
                                </span>
                                <span v-if="product.stock > 0"
                                    class="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                                    <span class="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                                    Tersedia
                                </span>
                            </div>

                            <!-- Title -->
                            <h3
                                class="font-black text-navy text-sm md:text-base mb-3 leading-snug break-words group-hover:text-stone-700 transition-colors">
                                {{ product.name }}
                            </h3>

                            <!-- Price Section -->
                            <div class="mt-auto pt-4 border-t border-stone-100">
                                <div class="flex flex-col">
                                    <span v-if="product.sale_price"
                                        class="text-[10px] text-stone-400 line-through mb-0.5">
                                        Rp {{ formatPrice(product.price) }}
                                    </span>
                                    <div class="flex items-center justify-between">
                                        <span
                                            class="text-lg font-black text-navy group-hover:text-stone-700 transition-colors">
                                            Rp {{ formatPrice(product.sale_price || product.price) }}
                                        </span>
                                        <div
                                            class="w-8 h-8 rounded-lg bg-stone-100 group-hover:bg-stone-200 flex items-center justify-center text-stone-500 group-hover:text-stone-700 transition-all">
                                            <Icon icon="ph:arrow-right-bold" class="text-xs" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </Transition>
        </section>

        <!-- Become a Seller CTA -->
        <section class="bg-gradient-to-r from-primary to-amber-400 py-16">
            <div class="container mx-auto px-4 max-w-7xl text-center">
                <h2 class="text-xl sm:text-2xl md:text-3xl font-black text-navy mb-4">Ingin Jual Produk Panahan?</h2>
                <p class="text-navy/70 max-w-xl mx-auto mb-8">
                    Gabung sebagai penjual dan jangkau ribuan pemanah di seluruh Indonesia. Gratis untuk klub dan
                    organisasi!
                </p>
                <a href="/auth/register?type=club">
                    <BaseButton variant="navy" size="lg" icon="ph:storefront">
                        Daftar Sebagai Penjual
                    </BaseButton>
                </a>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()

definePageMeta({
    layout: 'landing'
})

useHead({
    title: 'Produk Panahan | ArcheryHub',
    meta: [
        {
            name: 'description',
            content: 'Temukan perlengkapan dan aksesoris panahan pilihan untuk latihan dan kompetisi di ArcheryHub.'
        }
    ]
})

const searchQuery = ref('')
const categoryFilter = ref('all')
const sortBy = ref('newest')

const allowedProductImages = [
    'https://images.unsplash.com/photo-1503602642458-232111445657',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796',
    'https://images.unsplash.com/photo-1511556820780-d912e42b4980',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d'
]

const categories = [
    { label: 'Semua', value: 'all', icon: 'ph:squares-four' },
    { label: 'Peralatan', value: 'equipment', icon: 'ph:target' },
    { label: 'Pakaian', value: 'apparel', icon: 'ph:t-shirt' },
    { label: 'Aksesoris', value: 'accessories', icon: 'ph:bag' },
    { label: 'Latihan', value: 'training', icon: 'ph:graduation-cap' },
    { label: 'Lainnya', value: 'other', icon: 'ph:package' },
]

const categoryLabels = {
    equipment: 'Peralatan',
    apparel: 'Pakaian',
    accessories: 'Aksesoris',
    training: 'Latihan',
    other: 'Lainnya'
}

const sortOptions = [
    { value: 'newest', title: 'Terbaru' },
    { value: 'price-low', title: 'Harga Terendah' },
    { value: 'price-high', title: 'Harga Tertinggi' },
    { value: 'popular', title: 'Terpopuler' }
]

const { data: productResponse, pending: isLoading } = useAsyncData('products', () => $fetch(`${apiBaseUrl}/products`), {
    lazy: true,
    server: true
})

const products = computed(() => productResponse.value?.data || [])

const filteredProducts = computed(() => {
    let filtered = products.value.filter(p => {
        const matchesSearch = !searchQuery.value || p.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesCategory = categoryFilter.value === 'all' || p.category === categoryFilter.value
        return matchesSearch && matchesCategory
    })

    // Sort
    if (sortBy.value === 'price-low') {
        filtered.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price))
    } else if (sortBy.value === 'price-high') {
        filtered.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price))
    } else if (sortBy.value === 'popular') {
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
    }

    return filtered
})

const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price)
}

const getCategoryLabel = (category) => categoryLabels[category] || 'Produk'

const getProductImage = (url) => allowedProductImages.includes(url) ? url : allowedProductImages[0]
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

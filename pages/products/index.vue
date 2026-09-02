<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <section class="bg-navy relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24">
            <div class="absolute inset-0 z-0">
                <img :src="allowedProductImages[0]" alt="Shop Background" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                </div>
            </div>
            <div class="container mx-auto px-4 max-w-7xl relative z-10">
                <div class="max-w-3xl">
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary text-[10px] sm:text-sm font-bold tracking-widest mb-6">
                        <Icon icon="ph:shopping-bag-bold" class="text-base sm:text-lg" />
                        <span>{{ $t('products_page.badge') }}</span>
                    </div>
                    <h1
                        class="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6"
                        v-html="$t('products_page.title')">
                    </h1>
                    <p class="text-white/90 text-sm md:text-lg leading-relaxed max-w-xl">
                        {{ $t('products_page.description') }}
                    </p>

                    <!-- Search Bar CTA -->
                    <div class="mt-10 flex flex-col sm:flex-row gap-4 max-w-xl">
                        <div class="relative flex-1">
                            <Icon icon="ph:magnifying-glass-bold"
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input v-model="searchQuery" type="text" :placeholder="$t('products_page.search_placeholder_hero')"
                                class="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-navy font-medium placeholder:text-gray-400 focus:ring-4 focus:ring-primary/30 outline-none transition-all text-base" />
                        </div>
                        <button
                            class="px-6 py-3.5 bg-primary hover:bg-primary-hover text-navy font-black rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                            <Icon icon="ph:magnifying-glass-bold" />
                            {{ $t('products_page.search_button') }}
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
                            <input v-model="searchQuery" type="text" :placeholder="$t('products_page.search_placeholder_sticky')"
                                class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" />
                        </div>
                    </div>
                    <div class="flex items-center gap-3 w-full md:w-auto">
                        <div class="min-w-[150px]">
                            <BaseSelect v-model="categoryFilter" :items="categories" item-title="label"
                                item-value="value" :placeholder="$t('products_page.all_categories')" />
                        </div>
                        <div class="min-w-[150px]">
                            <BaseSelect v-model="sortBy" :items="sortOptions" :placeholder="$t('products_page.sort_title')" />
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
                    <h3 class="text-lg sm:text-2xl font-black text-navy mb-3">{{ $t('products_page.not_found') }}</h3>
                    <p class="text-gray-500 max-w-md mx-auto text-center">{{ $t('products_page.not_found_desc') }}</p>
                </div>
                <div v-else key="content" class="space-y-12">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        <!-- Product Card Premium -->
                        <a v-for="product in paginatedProducts" :key="product.id"
                            :href="localePath(`/products/${product.slug || product.id}`)"
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
                                        {{ $t('products_page.promo') }}
                                    </div>
                                </div>

                            </div>

                            <!-- Product Content -->
                            <div class="p-6 flex flex-col flex-1">
                                <!-- Category & Status -->
                                <div class="flex items-center justify-between mb-3">
                                    <span
                                        class="text-[10px] font-black text-stone-600 tracking-widest bg-stone-100 px-2 py-0.5 rounded-md">
                                        {{ getCategoryLabel(product.category) }}
                                    </span>
                                    <span v-if="product.stock > 0"
                                        class="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                                        <span class="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                                        {{ $t('products_page.in_stock') }}
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

                    <!-- BasePagination -->
                    <div v-if="filteredProducts.length > itemsPerPage" class="flex justify-center pt-8 border-t border-stone-100">
                        <BasePagination :current-page="currentPage" :total-items="filteredProducts.length" :items-per-page="itemsPerPage"
                            @change-page="currentPage = $event" />
                    </div>
                </div>
            </Transition>
        </section>


    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseSelect from '~/components/common/BaseSelect.vue'

const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()

const { tm, t } = useI18n()
const localePath = useLocalePath()

definePageMeta({
    layout: 'landing'
})

useHead({ title: computed(() => t('shop.title', 'Archery Shop') + ' - Archeris') })


useSeoMeta({
    title: () => `${t('products_page.badge')} - Archeris.net`,
    description: () => t('products_page.description')
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

const categories = computed(() => [
    {
        label: t('products_page.category_labels.all'),
        value: 'all',
        icon: 'ph:squares-four'
    },
    {
        label: t('products_page.category_labels.equipment'),
        value: 'equipment',
        icon: 'ph:target'
    },
    {
        label: t('products_page.category_labels.apparel'),
        value: 'apparel',
        icon: 'ph:t-shirt'
    },
    {
        label: t('products_page.category_labels.accessories'),
        value: 'accessories',
        icon: 'ph:bag'
    },
    {
        label: t('products_page.category_labels.training'),
        value: 'training',
        icon: 'ph:graduation-cap'
    },
    {
        label: t('products_page.category_labels.other'),
        value: 'other',
        icon: 'ph:package'
    }
])

const sortOptions = computed(() => [
    {
        value: 'newest',
        title: t('products_page.sort_options.newest')
    },
    {
        value: 'price-low',
        title: t('products_page.sort_options.price_low')
    },
    {
        value: 'price-high',
        title: t('products_page.sort_options.price_high')
    },
    {
        value: 'popular',
        title: t('products_page.sort_options.popular')
    }
])

const { data: productResponse, pending: isLoading } = useAsyncData('products', () => $fetch(`${apiBaseUrl}/products`), {
    lazy: true,
    server: true
})

const products = computed(() => productResponse.value?.data || [])

const itemsPerPage = ref(10)
const currentPage = ref(1)

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

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredProducts.value.slice(start, start + itemsPerPage.value)
})

watch([searchQuery, categoryFilter, sortBy], () => {
    currentPage.value = 1
})

const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price)
}

const getCategoryLabel = (category) => {
    return t(`products_page.category_labels.${category}`) || t('products_page.category_labels.other') || 'Produk'
}

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

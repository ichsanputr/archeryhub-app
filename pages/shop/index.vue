<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <section class="bg-gradient-to-br from-navy to-blue-900 text-white py-16">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div class="max-w-xl">
                        <h1 class="text-4xl md:text-5xl font-black tracking-tight mb-4">
                            Marketplace <span class="text-primary">Panahan</span>
                        </h1>
                        <p class="text-gray-300 text-lg leading-relaxed">
                            Temukan peralatan panahan berkualitas dari berbagai klub dan organisasi terpercaya di
                            Indonesia.
                        </p>
                        <div class="mt-8 flex items-center gap-4">
                            <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                                <Icon icon="ph:storefront" class="text-primary text-2xl" />
                                <div>
                                    <p class="text-sm text-gray-400">Penjual Aktif</p>
                                    <p class="font-bold text-lg">45+ Klub</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                                <Icon icon="ph:package" class="text-primary text-2xl" />
                                <div>
                                    <p class="text-sm text-gray-400">Total Produk</p>
                                    <p class="font-bold text-lg">500+ Item</p>
                                </div>
                            </div>
                        </div>
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
                        <select v-model="categoryFilter"
                            class="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium bg-white min-w-[150px]">
                            <option value="all">Semua Kategori</option>
                            <option value="equipment">Peralatan</option>
                            <option value="apparel">Pakaian</option>
                            <option value="accessories">Aksesoris</option>
                            <option value="training">Training</option>
                        </select>
                        <select v-model="sortBy"
                            class="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium bg-white min-w-[150px]">
                            <option value="newest">Terbaru</option>
                            <option value="price-low">Harga Terendah</option>
                            <option value="price-high">Harga Tertinggi</option>
                            <option value="popular">Terpopuler</option>
                        </select>
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
                        ? 'bg-navy text-white shadow-lg shadow-navy/20'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-navy'
                ]">
                    <Icon :icon="cat.icon" class="text-lg" />
                    {{ cat.label }}
                </button>
            </div>
        </section>

        <!-- Products Grid -->
        <section class="container mx-auto px-4 max-w-7xl pb-16">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                <NuxtLink v-for="product in filteredProducts" :key="product.id"
                    :to="`/shop/${product.slug || product.id}`"
                    class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all group cursor-pointer block">

                    <!-- Product Image -->
                    <div class="relative aspect-square bg-gray-100 overflow-hidden">
                        <img :src="product.image" :alt="product.name"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                        <!-- Sale Badge -->
                        <div v-if="product.salePrice" class="absolute top-3 left-3">
                            <span class="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                SALE
                            </span>
                        </div>

                        <!-- Wishlist Button -->
                        <button
                            class="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-navy">
                            <Icon icon="ph:heart" class="text-lg" />
                        </button>
                    </div>

                    <!-- Product Info -->
                    <div class="p-4">
                        <!-- Seller -->
                        <div class="flex items-center gap-2 mb-2">
                            <div class="w-5 h-5 rounded-full bg-navy flex items-center justify-center">
                                <Icon icon="ph:storefront" class="text-white text-xs" />
                            </div>
                            <span class="text-xs text-gray-400 truncate">{{ product.seller }}</span>
                        </div>

                        <!-- Name -->
                        <h3
                            class="font-bold text-navy text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                            {{ product.name }}
                        </h3>

                        <!-- Price -->
                        <div class="flex items-end gap-2">
                            <span class="text-lg font-black text-navy">
                                Rp {{ formatPrice(product.salePrice || product.price) }}
                            </span>
                            <span v-if="product.salePrice" class="text-sm text-gray-400 line-through">
                                Rp {{ formatPrice(product.price) }}
                            </span>
                        </div>

                        <!-- Sold -->
                        <div class="flex items-center gap-3 mt-3 text-xs text-gray-400">
                            <span>{{ product.sold }} terjual</span>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <!-- Load More -->
            <div class="text-center mt-12">
                <BaseButton variant="outline" size="lg" icon="ph:arrow-down">
                    Muat Lebih Banyak
                </BaseButton>
            </div>
        </section>

        <!-- Become a Seller CTA -->
        <section class="bg-gradient-to-r from-primary to-amber-400 py-16">
            <div class="container mx-auto px-4 max-w-7xl text-center">
                <h2 class="text-3xl font-black text-navy mb-4">Ingin Jual Produk Panahan?</h2>
                <p class="text-navy/70 max-w-xl mx-auto mb-8">
                    Gabung sebagai penjual dan jangkau ribuan pemanah di seluruh Indonesia. Gratis untuk klub dan
                    organisasi!
                </p>
                <NuxtLink to="/auth/register?type=club">
                    <BaseButton variant="navy" size="lg" icon="ph:storefront">
                        Daftar Sebagai Penjual
                    </BaseButton>
                </NuxtLink>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'

definePageMeta({
    layout: 'landing'
})

const searchQuery = ref('')
const categoryFilter = ref('all')
const sortBy = ref('newest')

const categories = [
    { label: 'Semua', value: 'all', icon: 'ph:squares-four' },
    { label: 'Busur', value: 'equipment', icon: 'ph:target' },
    { label: 'Anak Panah', value: 'arrows', icon: 'ph:arrow-up-right' },
    { label: 'Pakaian', value: 'apparel', icon: 'ph:t-shirt' },
    { label: 'Aksesoris', value: 'accessories', icon: 'ph:bag' },
    { label: 'Training', value: 'training', icon: 'ph:graduation-cap' },
]

const products = ref([
    {
        slug: 'recurve-bow-hoyt-satori-23',
        name: 'Recurve Bow Hoyt Satori 23"',
        seller: 'Garuda Archery Club',
        price: 15500000,
        salePrice: 13500000,
        image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400',
        category: 'equipment',
        rating: 4.9,
        sold: 23
    },
    {
        slug: 'carbon-arrow-easton-x10-12pcs',
        name: 'Carbon Arrow Easton X10 (12pcs)',
        seller: 'Elang Jawa AC',
        price: 4800000,
        salePrice: null,
        image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=400',
        category: 'arrows',
        rating: 4.8,
        sold: 56
    },
    {
        slug: 'arm-guard-premium-leather',
        name: 'Arm Guard Premium Leather',
        seller: 'Srikandi Shop',
        price: 350000,
        salePrice: 280000,
        image: 'https://images.unsplash.com/photo-1510925758641-869d353cecc7?w=400',
        category: 'accessories',
        rating: 4.7,
        sold: 128
    },
    {
        slug: 'compound-bow-bear-archery-cruzer',
        name: 'Compound Bow Bear Archery Cruzer',
        seller: 'Phoenix Archer',
        price: 8900000,
        salePrice: null,
        image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=400',
        category: 'equipment',
        rating: 4.9,
        sold: 15
    },
    {
        slug: 'jersey-tim-nasional-indonesia-2024',
        name: 'Jersey Tim Nasional Indonesia 2024',
        seller: 'Perpani Store',
        price: 450000,
        salePrice: null,
        image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=400',
        category: 'apparel',
        rating: 4.6,
        sold: 89
    },
    {
        slug: 'target-face-wa-40cm-10pcs',
        name: 'Target Face WA 40cm (10pcs)',
        seller: 'Garuda Archery Club',
        price: 150000,
        salePrice: null,
        image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=400',
        category: 'training',
        rating: 4.5,
        sold: 234
    },
    {
        slug: 'finger-tab-easton-contour',
        name: 'Finger Tab Easton Contour',
        seller: 'Elang Jawa AC',
        price: 680000,
        salePrice: 580000,
        image: 'https://images.unsplash.com/photo-1510925758641-869d353cecc7?w=400',
        category: 'accessories',
        rating: 4.8,
        sold: 67
    },
    {
        slug: 'quiver-belt-premium',
        name: 'Quiver Belt Premium',
        seller: 'Srikandi Shop',
        price: 420000,
        salePrice: null,
        image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=400',
        category: 'accessories',
        rating: 4.7,
        sold: 45
    }
])

const filteredProducts = computed(() => {
    return products.value.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            p.seller.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesCategory = categoryFilter.value === 'all' || p.category === categoryFilter.value
        return matchesSearch && matchesCategory
    })
})

const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price)
}
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

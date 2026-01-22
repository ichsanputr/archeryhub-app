<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Breadcrumb -->
        <div class="bg-white border-b border-gray-200">
            <div class="container mx-auto px-4 max-w-7xl py-4">
                <div class="flex items-center gap-2 text-sm text-gray-400 font-medium">
                    <NuxtLink to="/shop" class="hover:text-primary transition-colors">Marketplace</NuxtLink>
                    <Icon icon="ph:caret-right" class="text-xs" />
                    <span class="text-gray-600">{{ product.category }}</span>
                    <Icon icon="ph:caret-right" class="text-xs" />
                    <span class="text-navy truncate max-w-xs">{{ product.name }}</span>
                </div>
            </div>
        </div>

        <!-- Main Product Section -->
        <section class="container mx-auto px-4 max-w-7xl py-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                <!-- Product Images -->
                <div class="space-y-4">
                    <!-- Main Image -->
                    <div
                        class="relative aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        <img :src="selectedImage" :alt="product.name" class="w-full h-full object-contain p-4" />

                        <!-- Sale Badge -->
                        <div v-if="product.salePrice" class="absolute top-4 left-4">
                            <span class="px-4 py-2 bg-red-500 text-white font-bold rounded-full shadow-lg">
                                -{{ discountPercent }}%
                            </span>
                        </div>

                        <!-- Zoom Button -->
                        <button
                            class="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-primary hover:text-navy transition-colors">
                            <Icon icon="ph:magnifying-glass-plus" class="text-xl" />
                        </button>
                    </div>

                    <!-- Thumbnails -->
                    <div class="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        <button v-for="(img, idx) in product.images" :key="idx" @click="selectedImage = img" :class="[
                            'w-20 h-20 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all',
                            selectedImage === img ? 'border-primary shadow-lg' : 'border-gray-200 hover:border-gray-300'
                        ]">
                            <img :src="img" class="w-full h-full object-cover" />
                        </button>
                    </div>
                </div>

                <!-- Product Info -->
                <div class="space-y-6">
                    <!-- Category & Stock -->
                    <div class="flex items-center gap-3">
                        <span
                            class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-full">
                            {{ product.category }}
                        </span>
                        <span v-if="product.stock > 0"
                            class="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">
                            Stok: {{ product.stock }}
                        </span>
                        <span v-else class="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                            Habis
                        </span>
                    </div>

                    <!-- Title -->
                    <h1 class="text-2xl lg:text-3xl font-black text-navy leading-tight">{{ product.name }}</h1>

                    <!-- Rating & Stats -->
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                        <div class="flex items-center gap-1.5">
                            <div class="flex items-center gap-0.5">
                                <Icon v-for="i in 5" :key="i" icon="ph:star-fill"
                                    :class="i <= Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200'" />
                            </div>
                            <span class="font-bold text-navy">{{ product.rating }}</span>
                            <span>({{ product.reviews }} ulasan)</span>
                        </div>
                        <span class="text-gray-300">•</span>
                        <span>{{ product.sold }} terjual</span>
                        <span class="text-gray-300">•</span>
                        <span>{{ product.views }} dilihat</span>
                    </div>

                    <!-- Price -->
                    <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <div class="flex items-end gap-4">
                            <span class="text-4xl font-black text-navy">
                                Rp {{ formatPrice(product.salePrice || product.price) }}
                            </span>
                            <span v-if="product.salePrice" class="text-xl text-gray-400 line-through mb-1">
                                Rp {{ formatPrice(product.price) }}
                            </span>
                        </div>
                        <p v-if="product.salePrice" class="text-green-600 font-bold mt-2">
                            Hemat Rp {{ formatPrice(product.price - product.salePrice) }}!
                        </p>
                    </div>

                    <!-- Quantity Selector -->
                    <div class="flex items-center gap-4">
                        <span class="font-bold text-navy">Jumlah:</span>
                        <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                            <button @click="quantity = Math.max(1, quantity - 1)"
                                class="px-4 py-2 hover:bg-gray-100 transition-colors">
                                <Icon icon="ph:minus" />
                            </button>
                            <input v-model.number="quantity" type="number" min="1" :max="product.stock"
                                class="w-16 text-center font-bold text-navy py-2 outline-none" />
                            <button @click="quantity = Math.min(product.stock, quantity + 1)"
                                class="px-4 py-2 hover:bg-gray-100 transition-colors">
                                <Icon icon="ph:plus" />
                            </button>
                        </div>
                        <span class="text-gray-400 text-sm">Maks. {{ product.stock }} pcs</span>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-4 pt-4">
                        <BaseButton variant="outline" size="lg" icon="ph:chat-circle" class="flex-1">
                            Chat Penjual
                        </BaseButton>
                        <BaseButton @click="handleAddToCart" variant="primary" size="lg" icon="ph:shopping-cart" class="flex-1" :loading="isAddingToCart">
                            + Keranjang
                        </BaseButton>
                    </div>

                    <!-- Seller Card -->
                    <div class="bg-white rounded-2xl border border-gray-200 p-5 mt-6">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center text-navy font-black text-xl">
                                {{ product.seller.name.charAt(0) }}
                            </div>
                            <div class="flex-1">
                                <div class="flex items-center gap-2">
                                    <h3 class="font-bold text-navy">{{ product.seller.name }}</h3>
                                    <Icon v-if="product.seller.verified" icon="ph:seal-check-fill"
                                        class="text-blue-500" />
                                </div>
                                <div class="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                    <span class="flex items-center gap-1">
                                        <Icon icon="ph:star-fill" class="text-amber-400" />
                                        {{ product.seller.rating }}
                                    </span>
                                    <span>{{ product.seller.products }} produk</span>
                                    <span>{{ product.seller.location }}</span>
                                </div>
                            </div>
                            <NuxtLink :to="`/shop/seller/${product.seller.slug}`">
                                <BaseButton variant="white" size="sm">Kunjungi</BaseButton>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Product Details Tabs -->
        <section class="bg-white border-t border-gray-200 py-8">
            <div class="container mx-auto px-4 max-w-7xl">
                <!-- Tabs -->
                <div class="flex gap-1 border-b border-gray-200 mb-8">
                    <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value" :class="[
                        'px-6 py-3 font-bold text-sm transition-colors relative',
                        activeTab === tab.value
                            ? 'text-navy'
                            : 'text-gray-400 hover:text-gray-600'
                    ]">
                        {{ tab.label }}
                        <span v-if="activeTab === tab.value"
                            class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
                    </button>
                </div>

                <!-- Tab Content -->
                <div v-if="activeTab === 'description'" class="prose max-w-none text-gray-700">
                    <p>{{ product.description }}</p>

                    <h3 class="text-lg font-bold text-navy mt-6 mb-4">Spesifikasi</h3>
                    <table class="w-full">
                        <tr v-for="(value, key) in product.specifications" :key="key" class="border-b border-gray-100">
                            <td class="py-3 text-gray-500 w-1/3">{{ key }}</td>
                            <td class="py-3 font-medium text-navy">{{ value }}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </section>

        <!-- Related Products -->
        <section class="container mx-auto px-4 max-w-7xl py-12">
            <h2 class="text-2xl font-black text-navy mb-6">Produk Serupa</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
                <div v-for="item in relatedProducts" :key="item.id"
                    class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
                    <div class="relative aspect-square bg-gray-100 overflow-hidden">
                        <img :src="item.image"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div class="p-4">
                        <h3 class="font-bold text-navy text-sm line-clamp-2 mb-2">{{ item.name }}</h3>
                        <span class="text-lg font-black text-navy">Rp {{ formatPrice(item.price) }}</span>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
    layout: 'landing'
})

const route = useRoute()
const quantity = ref(1)
const activeTab = ref('description')

const tabs = [
    { label: 'Deskripsi', value: 'description' },
]

// Dummy product data
const product = ref({
    slug: route.params.slug,
    name: 'Recurve Bow Hoyt Satori 23" ILF Riser - Premium Edition',
    price: 15500000,
    salePrice: 13500000,
    stock: 5,
    category: 'Busur Recurve',
    rating: 4.9,
    reviews: 45,
    sold: 23,
    views: 1234,
    images: [
        'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800',
        'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800',
        'https://images.unsplash.com/photo-1510925758641-869d353cecc7?w=800',
    ],
    description: 'Hoyt Satori adalah riser ILF premium dengan desain ergonomis dan performa tinggi. Terbuat dari aluminium berkualitas tinggi dengan finishing anodized yang tahan lama. Cocok untuk pemanah profesional maupun yang sedang berkembang.',
    specifications: {
        'Panjang Riser': '23 inch',
        'Material': 'Aluminium 6061-T6',
        'Berat': '1.1 kg',
        'Draw Weight Range': '15-45 lbs',
        'Tipe': 'ILF (International Limb Fitting)',
        'Warna': 'Midnight Black',
        'Garansi': '2 Tahun'
    },
    seller: {
        name: 'Garuda Archery Store',
        slug: 'garuda-archery',
        verified: true,
        rating: 4.8,
        products: 45,
        location: 'Jakarta'
    }
})

const selectedImage = ref(product.value.images[0])

const discountPercent = computed(() => {
    if (!product.value.salePrice) return 0
    return Math.round((1 - product.value.salePrice / product.value.price) * 100)
})

const reviews = ref([
    { id: 1, user: 'Ahmad R.', rating: 5, comment: 'Produk sangat berkualitas, pengiriman cepat dan packing aman. Recommended seller!', date: '2 hari lalu' },
    { id: 2, user: 'Budi S.', rating: 5, comment: 'Sesuai deskripsi, build quality excellent. Worth the price.', date: '1 minggu lalu' },
    { id: 3, user: 'Siti M.', rating: 4, comment: 'Bagus, cuma pengiriman agak lama. Overall puas.', date: '2 minggu lalu' },
])

const relatedProducts = ref([
    { id: 2, name: 'WNS Delta LX Riser', price: 8500000, image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=400' },
    { id: 3, name: 'Kinetic Vygo Limbs', price: 4200000, image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=400' },
    { id: 4, name: 'Easton Carbon One Arrows', price: 3800000, image: 'https://images.unsplash.com/photo-1510925758641-869d353cecc7?w=400' },
    { id: 5, name: 'Hoyt Formula Limbs', price: 6200000, image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=400' },
])

const { post } = useApi()
const { showToast } = useToast()
const isAddingToCart = ref(false)

const handleAddToCart = async () => {
    if (!isLoggedIn.value) {
        showToast('Silahkan login sebagai Pemanah untuk menambah ke keranjang', 'error')
        return
    }

    if (user.value?.user_type !== 'archer') {
        showToast('Hanya akun Pemanah yang dapat berbelanja', 'error')
        return
    }

    isAddingToCart.value = true
    try {
        await post('/cart', {
            product_id: product.value.uuid || 'f38b1a3c-f73e-11f0-87db-c3c8a1ce2650', // Use real ID if available, fallback for dummy
            quantity: quantity.value
        })
        showToast('Berhasil ditambah ke keranjang', 'success')
    } catch (error) {
        showToast('Gagal menambah ke keranjang', 'error')
    } finally {
        isAddingToCart.value = false
    }
}

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price)
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

<template>
    <div class="min-h-screen bg-gray-50 pt-24">
        <!-- Breadcrumb -->
        <div class="bg-white border-b border-gray-200 sticky top-16 z-30">
            <div class="container mx-auto px-4 max-w-7xl py-3 md:py-4">
                <Breadcrumbs :items="[
                    { label: 'Marketplace', path: '/products' },
                    { label: breadcrumbCategory }
                ]" :current="product.name" />
            </div>
        </div>

        <Transition name="fade" mode="out-in">
            <ProductPageSkeleton v-if="isLoading || !product" key="skeleton"
                class="container mx-auto px-4 max-w-7xl pt-8 pb-20" />

            <div v-else key="content">
                <!-- Main Product Section -->
                <section class="container mx-auto px-4 max-w-7xl py-8">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                        <!-- Product Images -->
                        <div class="space-y-4">
                            <!-- Main Image -->
                            <div
                                class="relative aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                <img :src="selectedImage" :alt="product.name"
                                    class="w-full h-full object-contain p-4" />

                                <!-- Sale Badge -->
                                <div v-if="product.sale_price" class="absolute top-4 left-4">
                                    <span class="px-4 py-2 bg-red-500 text-white font-bold rounded-full shadow-lg">
                                        -{{ discountPercent }}%
                                    </span>
                                </div>

                                <!-- Zoom Button -->
                                <button @click="isZoomOpen = true"
                                    class="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-primary hover:text-navy transition-colors">
                                    <Icon icon="ph:magnifying-glass-plus" class="text-xl" />
                                </button>
                            </div>

                            <!-- Thumbnails -->
                            <div class="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                <button v-for="(img, idx) in product.images" :key="idx" @click="selectedImage = img"
                                    :class="[
                                        'w-20 h-20 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all',
                                        selectedImage === img ? 'border-primary shadow-lg' : 'border-gray-200 hover:border-gray-300'
                                    ]">
                                    <img :src="img" class="w-full h-full object-cover" />
                                </button>
                            </div>
                        </div>

                        <!-- Product Info -->
                        <div class="space-y-6">
                            <!-- Title & Stock -->
                            <div class="space-y-2">
                                <h1 class="text-xl sm:text-2xl md:text-3xl font-black text-navy leading-tight">{{
                                    product.name
                                }}</h1>
                                <div class="flex items-center gap-2 text-sm">
                                    <span v-if="product.stock > 0" class="font-bold text-green-600">
                                        Stok: {{ product.stock }}
                                    </span>
                                    <span v-else class="font-bold text-red-600">
                                        Stok Habis
                                    </span>
                                </div>
                            </div>

                            <!-- Price -->
                            <div class="bg-gray-50 rounded-2xl py-4 md:py-6 border border-gray-100">
                                <div class="flex items-end gap-3 md:gap-4">
                                    <span class="text-3xl md:text-4xl font-black text-navy">
                                        Rp {{ formatPrice(product.sale_price || product.price) }}
                                    </span>
                                    <span v-if="product.sale_price"
                                        class="text-base sm:text-lg md:text-xl text-gray-400 line-through mb-1">
                                        Rp {{ formatPrice(product.price) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Quantity Selector -->
                            <div class="flex flex-wrap items-center gap-4">
                                <span class="font-bold text-navy text-sm md:text-base">Jumlah:</span>
                                <div
                                    class="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
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
                                <span class="text-gray-400 text-xs md:text-sm">Tersisa {{ product.stock }} pcs</span>
                            </div>

                            <!-- Actions (Desktop) -->
                            <div class="hidden sm:flex gap-4 pt-2">
                                <BaseButton @click="handleAddToCart" variant="primary" size="lg" icon="ph:shopping-cart"
                                    class="w-full" :loading="isAddingToCart">
                                    Tambah ke Keranjang
                                </BaseButton>
                            </div>

                            <!-- Mobile Actions (Visible on small screens) -->
                            <div class="sm:hidden space-y-3">
                                <BaseButton @click="handleAddToCart" variant="primary" size="lg" icon="ph:shopping-cart"
                                    class="w-full py-4 text-base font-black" :loading="isAddingToCart">
                                    Tambah Keranjang
                                </BaseButton>
                            </div>

                            <!-- Sticky Mobile Bottom Bar -->
                            <div
                                class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-40 flex gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                                <BaseButton @click="handleAddToCart" variant="primary" size="lg" icon="ph:shopping-cart"
                                    class="flex-1 font-black text-sm" :loading="isAddingToCart">
                                    Tambah Keranjang
                                </BaseButton>
                            </div>

                        </div>
                    </div>
                </section>
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
                            <div v-if="product.description" class="mb-6">
                                <h3 class="text-lg font-bold text-navy mb-3">Deskripsi</h3>
                                <p class="text-gray-700 whitespace-pre-line">{{ product.description }}</p>
                            </div>
                            <div v-if="product.specifications && Object.keys(product.specifications).length > 0">
                                <h3 class="text-lg font-bold text-navy mt-6 mb-4">Spesifikasi</h3>
                                <table class="w-full">
                                    <tr v-for="(value, key) in product.specifications" :key="key"
                                        class="border-b border-gray-100">
                                        <td class="py-3 text-gray-500 w-1/3">{{ key }}</td>
                                        <td class="py-3 font-medium text-navy">{{ value }}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Transition>

        <!-- Image Zoom Modal -->
        <div v-if="isZoomOpen"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/95 backdrop-blur-sm">
            <button @click="isZoomOpen = false"
                class="absolute top-6 right-6 text-white hover:text-primary transition-colors">
                <Icon icon="ph:x-bold" class="text-3xl" />
            </button>
            <div class="max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
                <img :src="selectedImage" class="max-w-full max-h-full object-contain" />
            </div>
        </div>

    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from '~/composables/useToast'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
    layout: 'landing',
    headerTransparent: false
})

const route = useRoute()
const quantity = ref(1)
const activeTab = ref('description')
const isZoomOpen = ref(false)
const { isLoggedIn, user } = useAuth()

const breadcrumbCategory = computed(() => {
    const cat = product.value?.category || ''
    if (!cat) return ''
    return cat.charAt(0).toUpperCase() + cat.slice(1)
})

const tabs = [
    { label: 'Deskripsi', value: 'description' },
]

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl
const toast = useToast()

const { data: productResponse, pending: isLoading } = useAsyncData(
    `product-${route.params.slug}`,
    () => $fetch(`${apiBaseUrl}/products/${route.params.slug}`),
    { lazy: true, server: true }
)

const product = computed(() => {
    const data = productResponse.value?.data || productResponse.value
    if (!data) return null

    // Clone data to avoid mutating reactive state directly if needed, 
    // although computed return is read-only.
    const p = { ...data }

    // Parse images from JSON string if needed
    if (p.images && typeof p.images === 'string') {
        try {
            p.images = JSON.parse(p.images)
        } catch {
            p.images = []
        }
    }

    // Parse specifications from JSON string if needed
    if (p.specifications && typeof p.specifications === 'string') {
        try {
            p.specifications = JSON.parse(p.specifications)
        } catch {
            p.specifications = {}
        }
    }

    // Set default images array if empty
    if (!p.images || p.images.length === 0) {
        p.images = p.image_url ? [p.image_url] : []
    }

    return p
})

const selectedImage = ref('')

watchEffect(() => {
    if (product.value) {
        selectedImage.value = useImageOrDefault(product.value.images[0] || product.value.image_url)
    }
})

const discountPercent = computed(() => {
    if (!product.value || !product.value.sale_price) return 0
    return Math.round((1 - product.value.sale_price / product.value.price) * 100)
})

const relatedProducts = ref([])

const isAddingToCart = ref(false)

const handleAddToCart = async () => {
    if (!isLoggedIn.value) {
        toast.error('Silahkan login sebagai Pemanah untuk menambah ke keranjang')
        return
    }

    if (user.value?.type !== 'archer' && user.value?.role !== 'archer') {
        toast.error('Hanya akun Pemanah yang dapat berbelanja')
        return
    }

    isAddingToCart.value = true
    try {
        await $fetch(`${apiBaseUrl}/cart`, {
            method: 'POST',
            body: {
                product_id: product.value.id,
                quantity: quantity.value
            },
            headers: {
                'Authorization': `Bearer ${useCookie('auth_token').value}`
            }
        })
        toast.success('Berhasil ditambah ke keranjang')
    } catch (error) {
        toast.error('Gagal menambah ke keranjang')
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

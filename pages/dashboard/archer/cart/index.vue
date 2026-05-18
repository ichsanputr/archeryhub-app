<template>
    <div class="space-y-8 pb-12">
        <!-- Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>

            <!-- Decorative Background Elements -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <!-- Header Content -->
            <div class="relative p-6 sm:p-8">
                <div class="flex items-center gap-2 text-sm text-white/60 mb-4">
                    <NuxtLink to="/dashboard/archer" class="hover:text-white transition-colors">Dashboard</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-base" />
                    <span class="text-primary font-medium">Keranjang Belanja</span>
                </div>
                <div class="flex items-start gap-4">
                    <!-- Icon Badge -->
                    <div
                        class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
                        <Icon icon="ph:shopping-cart" class="text-primary text-2xl" />
                    </div>
                    <div class="flex-grow">
                        <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight">Keranjang Belanja</h1>
                        <p class="text-slate-300 text-sm mt-1">Kelola produk-produk pilihan Anda sebelum checkout</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Content Area -->
        <div v-if="isLoading"
            class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin mb-4" />
            <p class="text-gray-500 font-medium">Memuat data keranjang...</p>
        </div>

        <div v-else>
            <div v-if="productCart.length === 0"
                class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <Icon icon="ph:shopping-bag-open" class="text-5xl text-gray-200" />
                </div>
                <h3 class="text-xl font-bold text-navy mb-2">Keranjang Belanja Kosong</h3>
                <p class="text-gray-500 mb-8 px-6 text-center max-w-md">Belum ada perlengkapan archery di keranjang
                    Anda.</p>
                <NuxtLink to="/products">
                    <BaseButton variant="primary" size="lg" icon="ph:shopping-bag">Mulai Belanja</BaseButton>
                </NuxtLink>
            </div>

            <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Product List -->
                <div class="lg:col-span-2 space-y-4">
                    <div v-for="item in productCart" :key="item.uuid"
                        class="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex gap-4 md:gap-6 relative group overflow-hidden hover:border-primary/20 transition-all">

                        <!-- Product Image -->
                        <div
                            class="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                            <img v-if="item.product_image_url" :src="item.product_image_url" :alt="item.product_name"
                                class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex items-center justify-center">
                                <Icon icon="ph:package" class="text-4xl text-gray-200" />
                            </div>
                        </div>

                        <div class="flex-grow min-w-0 flex flex-col justify-between py-1">
                            <div class="space-y-1">
                                <div
                                    class="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold tracking-wider">
                                    <Icon icon="ph:storefront" />
                                    <span>{{ item.seller_name }}</span>
                                </div>
                                <h3
                                    class="text-base md:text-lg font-bold text-navy truncate pr-8 group-hover:text-primary transition-colors">
                                    {{ item.product_name }}</h3>
                                <div v-if="item.color"
                                    class="inline-flex items-center gap-2 px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600 font-bold">
                                    Varian: {{ item.color }}
                                </div>
                            </div>

                            <div class="flex items-end justify-between mt-4">
                                <div class="space-y-1">
                                    <p class="text-xs text-gray-400 line-through" v-if="item.product_sale_price">
                                        Rp {{ formatPrice(item.product_price) }}
                                    </p>
                                    <p class="text-lg font-black text-navy">
                                        Rp {{ formatPrice(item.product_sale_price || item.product_price) }}
                                    </p>
                                </div>

                                <!-- Quantity Controls -->
                                <div class="flex items-center gap-3 bg-gray-50 p-1 rounded-xl border border-gray-100">
                                    <button @click="updateQty(item, -1)"
                                        class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:text-red-500 transition-all text-gray-400 disabled:opacity-30"
                                        :disabled="isProcessing">
                                        <Icon icon="ph:minus-bold" class="text-sm" />
                                    </button>
                                    <span class="w-6 text-center font-black text-navy text-sm">{{ item.quantity
                                        }}</span>
                                    <button @click="updateQty(item, 1)"
                                        class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:text-primary transition-all text-gray-400 disabled:opacity-30"
                                        :disabled="isProcessing">
                                        <Icon icon="ph:plus-bold" class="text-sm" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Remove Button -->
                        <button @click="removeItem(item.uuid)"
                            class="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            title="Hapus Produk">
                            <Icon icon="ph:trash-bold" class="text-lg" />
                        </button>
                    </div>
                </div>

                <!-- Summary Sidebar -->
                <div class="lg:col-span-1">
                    <div class="sticky top-24 space-y-4">
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ring-4 ring-primary/5">
                            <h4 class="font-bold text-navy mb-6 flex items-center gap-2">
                                <Icon icon="ph:receipt-bold" class="text-primary" />
                                Ringkasan Pesanan
                            </h4>

                            <div class="space-y-4 mb-8">
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-500 font-medium">Subtotal ({{ totalProductQty }}
                                        produk)</span>
                                    <span class="font-bold text-navy">Rp {{ formatPrice(totalProductSubtotal) }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-500 font-medium">Estimasi Ongkir</span>
                                    <span class="text-gray-400 italic text-xs font-bold">Checkout untuk hitung</span>
                                </div>
                                <div
                                    class="pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                                    <span class="font-bold text-navy tracking-widest text-xs">Total Pembayaran</span>
                                    <span class="text-2xl font-black text-navy">Rp {{ formatPrice(totalProductSubtotal)
                                        }}</span>
                                </div>
                            </div>

                            <BaseButton @click="navigateTo('/dashboard/archer/cart/payment')" class="w-full"
                                variant="primary" size="lg" icon="ph:arrow-right-bold"
                                :disabled="productCart.length === 0">
                                Lanjut ke Pembayaran
                            </BaseButton>

                            <div class="mt-6 p-4 bg-navy/[0.02] rounded-xl border border-navy/5">
                                <p class="text-[10px] text-gray-400 text-center italic">
                                    Produk akan dikirim langsung oleh masing-masing penjual setelah pembayaran
                                    diverifikasi.
                                </p>
                            </div>
                        </div>

                        <!-- Info Cards -->
                        <div class="grid grid-cols-2 gap-3">
                            <div
                                class="p-3 bg-white rounded-xl border border-gray-100 flex flex-col items-center text-center gap-2">
                                <Icon icon="ph:shield-check-fill" class="text-primary text-xl" />
                                <span class="text-[9px] font-bold text-navy tracking-tighter">Garansi Aman</span>
                            </div>
                            <div
                                class="p-3 bg-white rounded-xl border border-gray-100 flex flex-col items-center text-center gap-2">
                                <Icon icon="ph:truck-fill" class="text-primary text-xl" />
                                <span class="text-[9px] font-bold text-navy tracking-tighter">Kurir Terpercaya</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Keranjang Belanja - Archeris'
})

const { user } = useAuth()
const { get, put, del } = useApi()
const toast = useToast()

const isLoading = ref(true)
const isProcessing = ref(false)
const productCart = ref([])

// Computed values
const totalProductQty = computed(() => productCart.value.reduce((acc, item) => acc + item.quantity, 0))
const totalProductSubtotal = computed(() => productCart.value.reduce((acc, item) => {
    const price = item.product_sale_price || item.product_price
    return acc + (price * item.quantity)
}, 0))

// Utility functions
const formatPrice = (p) => new Intl.NumberFormat('id-ID').format(p)

// API Handlers
const fetchCart = async () => {
    isLoading.value = true
    try {
        const res = await get('/cart')
        // Normalize UUIDs
        productCart.value = (res.data || []).map(item => ({
            ...item,
            uuid: item.uuid || item.id
        }))
    } catch (e) {
        console.error('Failed to load cart', e)
        toast.error('Gagal mengambil data keranjang')
    } finally {
        isLoading.value = false
    }
}

const updateQty = async (item, delta) => {
    const newQty = item.quantity + delta

    // Minimum quantity is 1 (removal handled separately)
    if (newQty < 1) return removeItem(item.uuid)

    // Stock validation
    if (newQty > item.product_stock) {
        toast.error(`Maaf, stok hanya tersedia ${item.product_stock} unit`)
        return
    }

    isProcessing.value = true
    try {
        await put(`/cart/${item.uuid}`, { quantity: newQty })
        item.quantity = newQty
    } catch (e) {
        toast.error('Gagal memperbarui jumlah produk')
    } finally {
        isProcessing.value = false
    }
}

const removeItem = async (uuid) => {
    if (!confirm('Hapus produk ini dari keranjang?')) return

    isProcessing.value = true
    try {
        await del(`/cart/${uuid}`)
        productCart.value = productCart.value.filter(i => i.uuid !== uuid)
        toast.success('Produk berhasil dihapus')
    } catch (e) {
        toast.error('Gagal menghapus produk')
    } finally {
        isProcessing.value = false
    }
}

onMounted(fetchCart)
</script>

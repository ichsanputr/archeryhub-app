<template>
    <div class="space-y-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-black text-navy tracking-tight">Keranjang Belanja</h1>
                <p class="text-gray-500 mt-1">Kelola item yang ingin Anda beli dari marketplace.</p>
            </div>
            <NuxtLink to="/shop">
                <BaseButton variant="white" icon="ph:shopping-bag">Lanjut Belanja</BaseButton>
            </NuxtLink>
        </div>

        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
            <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin mb-4" />
            <p class="text-gray-500 font-medium">Memuat keranjang...</p>
        </div>

        <div v-else-if="cartItems.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
            <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Icon icon="ph:shopping-cart-light" class="text-4xl text-gray-300" />
            </div>
            <h3 class="text-xl font-bold text-navy mb-2">Keranjang Anda Kosong</h3>
            <p class="text-gray-500 mb-8 px-6 text-center">Belum ada item yang ditambahkan ke keranjang belanja Anda.</p>
            <NuxtLink to="/shop">
                <BaseButton variant="primary" size="lg">Mulai Belanja</BaseButton>
            </NuxtLink>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Items List -->
            <div class="lg:col-span-2 space-y-4">
                <div v-for="item in cartItems" :key="item.id" 
                    class="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all flex flex-col md:flex-row gap-6 relative group">
                    
                    <!-- Product Image -->
                    <div class="w-full md:w-32 aspect-square bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                        <img v-if="item.product_image_url" :src="item.product_image_url" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                            <Icon icon="ph:package" class="text-3xl" />
                        </div>
                    </div>

                    <!-- Details -->
                    <div class="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                            <div class="flex justify-between items-start">
                                <h3 class="text-lg font-bold text-navy truncate pr-8">{{ item.product_name }}</h3>
                                <button @click="removeItem(item)" 
                                    class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all absolute top-4 right-4 md:static">
                                    <Icon icon="ph:trash-bold" class="text-xl" />
                                </button>
                            </div>
                            <p class="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wider">Penjual: {{ item.seller_name }}</p>
                        </div>

                        <div class="flex flex-wrap items-end justify-between gap-4 mt-6">
                            <div class="space-y-1">
                                <p class="text-xl font-black text-navy leading-none">
                                    Rp {{ formatPrice((item.product_sale_price || item.product_price) * item.quantity) }}
                                </p>
                                <p v-if="item.product_sale_price" class="text-xs text-gray-400 line-through">
                                    Rp {{ formatPrice(item.product_price * item.quantity) }}
                                </p>
                            </div>

                            <div class="flex items-center border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-100">
                                <button @click="updateQuantity(item, item.quantity - 1)" 
                                    class="p-2.5 hover:bg-gray-50 transition-colors text-navy disabled:opacity-30"
                                    :disabled="item.quantity <= 1 || isUpdating === item.id">
                                    <Icon icon="ph:minus-bold" class="text-xs" />
                                </button>
                                <div class="w-10 text-center font-bold text-navy text-sm">
                                    <Icon v-if="isUpdating === item.id" icon="ph:spinner-gap-bold" class="animate-spin inline" />
                                    <span v-else>{{ item.quantity }}</span>
                                </div>
                                <button @click="updateQuantity(item, item.quantity + 1)" 
                                    class="p-2.5 hover:bg-gray-50 transition-colors text-navy disabled:opacity-30"
                                    :disabled="item.quantity >= item.product_stock || isUpdating === item.id">
                                    <Icon icon="ph:plus-bold" class="text-xs" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Summary -->
            <div class="lg:col-span-1">
                <div class="bg-navy rounded-3xl p-8 text-white shadow-2xl shadow-navy/20 sticky top-24">
                    <h2 class="text-xl font-black mb-6 flex items-center gap-2">
                        <Icon icon="ph:receipt-bold" />
                        Ringkasan Belanja
                    </h2>

                    <div class="space-y-4 mb-8">
                        <div class="flex justify-between text-white/70">
                            <span>Total Barang</span>
                            <span class="font-bold">{{ cartItems.length }} Item</span>
                        </div>
                        <div class="flex justify-between text-white/70">
                            <span>Total Harga</span>
                            <span>Rp {{ formatPrice(subtotal) }}</span>
                        </div>
                        <div class="flex justify-between text-white/70">
                            <span>Potongan Harga</span>
                            <span class="text-primary">- Rp {{ formatPrice(discountTotal) }}</span>
                        </div>
                        <div class="pt-4 border-t border-white/10 flex justify-between items-end">
                            <span class="text-lg font-bold">Total Tagihan</span>
                            <span class="text-3xl font-black text-primary">Rp {{ formatPrice(total) }}</span>
                        </div>
                    </div>

                    <BaseButton variant="primary" size="lg" icon="ph:credit-card" class="w-full text-lg h-14" @click="handleCheckout">
                        Checkout Sekarang
                    </BaseButton>

                    <div class="mt-6 flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <Icon icon="ph:shield-check-bold" class="text-3xl text-primary" />
                        <p class="text-[10px] text-white/60 leading-relaxed font-medium">
                            Pembayaran Anda dilindungi dengan sistem enkripsi keamanan Archery Hub. 
                            Dana hanya akan diteruskan ke penjual setelah Anda mengonfirmasi pesanan diterima.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'

const { get, put, delete: del } = useApi()
const { showToast } = useToast()

const cartItems = ref([])
const isLoading = ref(true)
const isUpdating = ref(null)

const fetchCart = async () => {
    isLoading.value = true
    try {
        const response = await get('/cart')
        cartItems.value = response.data || []
    } catch (error) {
        showToast('Gagal memuat keranjang', 'error')
    } finally {
        isLoading.value = false
    }
}

const updateQuantity = async (item, newQty) => {
    if (newQty < 1 || newQty > item.product_stock) return
    
    isUpdating.value = item.id
    try {
        await put(`/cart/${item.id}`, { quantity: newQty })
        item.quantity = newQty
    } catch (error) {
        showToast('Gagal memperbarui jumlah', 'error')
    } finally {
        isUpdating.value = null
    }
}

const removeItem = async (item) => {
    if (!confirm(`Hapus "${item.product_name}" dari keranjang?`)) return

    try {
        await del(`/cart/${item.id}`)
        cartItems.value = cartItems.value.filter(i => i.id !== item.id)
        showToast('Item berhasil dihapus', 'success')
    } catch (error) {
        showToast('Gagal menghapus item', 'error')
    }
}

const handleCheckout = () => {
    showToast('Fitur checkout akan segera hadir!', 'info')
}

const subtotal = computed(() => {
    return cartItems.value.reduce((acc, item) => acc + (item.product_price * item.quantity), 0)
})

const total = computed(() => {
    return cartItems.value.reduce((acc, item) => acc + ((item.product_sale_price || item.product_price) * item.quantity), 0)
})

const discountTotal = computed(() => subtotal.value - total.value)

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price)

onMounted(fetchCart)
</script>

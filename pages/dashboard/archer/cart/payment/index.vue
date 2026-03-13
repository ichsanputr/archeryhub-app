<template>
    <div class="space-y-8 pb-12">
        <!-- Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <div class="relative p-6 sm:p-8">
                <div class="flex items-center gap-2 text-sm text-white/60 mb-4">
                    <NuxtLink to="/dashboard/archer/cart" class="hover:text-white transition-colors">Keranjang</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-base" />
                    <span class="text-primary font-medium">Pembayaran</span>
                </div>
                <div class="flex items-start gap-4">
                    <div
                        class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
                        <Icon icon="ph:credit-card-bold" class="text-primary text-2xl" />
                    </div>
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight">Checkout Pembayaran</h1>
                        <p class="text-slate-300 text-sm mt-1">Pilih metode pembayaran dan lengkapi detail pengiriman</p>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isLoadingCart" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin mb-4" />
            <p class="text-gray-500 font-medium">Memuat data pesanan...</p>
        </div>

        <div v-else-if="productCart.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
             <Icon icon="ph:shopping-cart" class="text-5xl text-gray-200 mb-4" />
             <p class="text-gray-500 font-medium">Keranjang Anda kosong</p>
             <NuxtLink to="/dashboard/archer/cart" class="mt-4 text-primary font-bold">Kembali ke Keranjang</NuxtLink>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column: Shipping & Payment -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Shipping Address -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                        <Icon icon="ph:map-pin-bold" class="text-primary" />
                        Alamat Pengiriman
                    </h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Alamat Lengkap</label>
                            <textarea 
                                v-model="form.shipping_address"
                                rows="3"
                                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none text-sm"
                                placeholder="Masukkan alamat lengkap pengiriman (Jalan, No Rumah, Kelurahan, Kecamatan, Kota, Kode Pos)"
                            ></textarea>
                            <p class="mt-2 text-[10px] text-slate-400 italic">Pastikan alamat yang Anda masukkan benar untuk menghindari kendala pengiriman.</p>
                        </div>
                    </div>
                </div>

                <!-- Payment Methods -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                        <Icon icon="ph:wallet-bold" class="text-primary" />
                        Metode Pembayaran
                    </h3>
                    
                    <div v-if="isLoadingChannels" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div v-for="i in 6" :key="i" class="h-20 bg-slate-50 animate-pulse rounded-xl"></div>
                    </div>
                    
                    <div v-else class="space-y-6">
                        <div v-for="(group, groupName) in groupedChannels" :key="groupName">
                            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">{{ groupName }}</h4>
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <button 
                                    v-for="channel in group" 
                                    :key="channel.code"
                                    @click="form.method = channel.code"
                                    class="group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all"
                                    :class="form.method === channel.code 
                                        ? 'border-primary bg-primary/5 shadow-md' 
                                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'"
                                >
                                    <img :src="channel.icon_url" :alt="channel.name" class="h-6 w-auto mb-2 grayscale group-hover:grayscale-0 transition-all" :class="{'grayscale-0': form.method === channel.code}" />
                                    <span class="text-[10px] font-bold text-navy text-center">{{ channel.name }}</span>
                                    
                                    <!-- Selected Indicator -->
                                    <div v-if="form.method === channel.code" class="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full shadow-sm">
                                        <Icon icon="ph:check-bold" class="text-[10px]" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Order Summary -->
            <div class="lg:col-span-1">
                <div class="sticky top-24 space-y-4">
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ring-4 ring-primary/5">
                        <h4 class="font-bold text-navy mb-6 flex items-center gap-2">
                            <Icon icon="ph:receipt-bold" class="text-primary" />
                            Ringkasan Pembayaran
                        </h4>
                        
                        <div class="space-y-4 mb-8">
                            <div v-for="item in productCart" :key="item.uuid" class="flex justify-between text-xs items-start gap-4">
                                <div class="flex-1 min-w-0">
                                    <p class="font-bold text-navy truncate">{{ item.product_name }}</p>
                                    <p class="text-slate-400 mt-0.5">{{ item.quantity }}x @ Rp {{ formatPrice(item.product_sale_price || item.product_price) }}</p>
                                </div>
                                <span class="font-bold text-navy shrink-0">Rp {{ formatPrice((item.product_sale_price || item.product_price) * item.quantity) }}</span>
                            </div>

                            <div class="pt-4 border-t border-dashed border-gray-100 space-y-3">
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-500 font-medium">Subtotal</span>
                                    <span class="font-bold text-navy">Rp {{ formatPrice(totalSubtotal) }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-500 font-medium">Biaya Layanan</span>
                                    <span class="font-bold text-navy">Rp 0</span>
                                </div>
                                <div class="pt-4 border-t border-gray-200 flex justify-between items-center">
                                    <span class="font-bold text-navy uppercase tracking-widest text-xs">Total</span>
                                    <span class="text-2xl font-black text-navy">Rp {{ formatPrice(totalSubtotal) }}</span>
                                </div>
                            </div>
                        </div>

                        <BaseButton 
                            class="w-full" 
                            variant="primary" 
                            size="lg" 
                            icon="ph:lock-key-bold"
                            @click="handleCheckout"
                            :loading="isProcessing"
                            :disabled="!form.method || !form.shipping_address"
                        >
                            Bayar Sekarang
                        </BaseButton>
                        
                        <div class="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-black">
                            <Icon icon="ph:shield-check-fill" class="text-primary text-sm" />
                            Pembayaran Aman & Terenkripsi
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

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Pembayaran Checkout - ArcheryHub'
})

const { get, post } = useApi()
const toast = useToast()

const isLoadingCart = ref(true)
const isLoadingChannels = ref(true)
const isProcessing = ref(false)
const productCart = ref([])
const channels = ref([])

const form = ref({
    method: '',
    shipping_address: ''
})

// Grouped channels for UI
const groupedChannels = computed(() => {
    const groups = {}
    channels.value.forEach(channel => {
        const group = channel.group || 'Lainnya'
        if (!groups[group]) groups[group] = []
        groups[group].push(channel)
    })
    return groups
})

const totalSubtotal = computed(() => {
    return productCart.value.reduce((acc, item) => {
        const price = item.product_sale_price || item.product_price
        return acc + (price * item.quantity)
    }, 0)
})

const formatPrice = (p) => new Intl.NumberFormat('id-ID').format(p)

const fetchData = async () => {
    try {
        isLoadingCart.value = true
        const cartRes = await get('/cart')
        productCart.value = cartRes.data || []
        
        if (productCart.value.length === 0) {
            isLoadingCart.value = false
            return
        }

        isLoadingChannels.value = true
        const channelRes = await get('/payment/channels')
        channels.value = (channelRes || []).filter(c => c.active)
    } catch (e) {
        console.error('Failed to load checkout data', e)
        toast.error('Gagal mengambil data checkout')
    } finally {
        isLoadingCart.value = false
        isLoadingChannels.value = false
    }
}

const handleCheckout = async () => {
    if (!form.value.method) {
        toast.error('Silakan pilih metode pembayaran')
        return
    }
    if (!form.value.shipping_address) {
        toast.error('Silakan isi alamat pengiriman')
        return
    }

    isProcessing.value = true
    try {
        const res = await post('/cart/checkout', form.value)
        if (res.payment && res.payment.checkout_url) {
            toast.success('Pemesanan berhasil, silakan selesaikan pembayaran')
            // Redirect to the payment history page (where they can see the instruction/pay code)
            // or directly to Tripay checkout url if available.
            // But we prefer them to stay in our ecosystem to see instructions.
            setTimeout(() => {
                navigateTo('/dashboard/archer/payments')
            }, 1000)
        } else {
             toast.success('Pesanan berhasil dibuat')
             navigateTo('/dashboard/archer/payments')
        }
    } catch (e) {
        console.error('Checkout failed', e)
        toast.error(e.response?.data?.error || 'Gagal memproses pembayaran')
    } finally {
        isProcessing.value = false
    }
}

onMounted(fetchData)
</script>

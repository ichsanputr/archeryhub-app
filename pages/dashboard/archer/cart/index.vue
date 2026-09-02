<template>
    <div class="space-y-8 pb-12">
        <!-- Header -->
        <DashboardHeader
            :title="t('cart.title')"
            :subtitle="t('cart.desc')"
            icon="ph:shopping-cart"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/archer' },
                { label: t('cart.title') }
            ]"
        />

        <!-- Content Area -->
        <div v-if="isLoading"
            class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin mb-4" />
            <div class="text-gray-500 font-medium">{{ t('cart.loading') }}</div>
        </div>

        <div v-else>
            <div v-if="productCart.length === 0"
                class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <Icon icon="ph:shopping-bag-open" class="text-5xl text-gray-200" />
                </div>
                <h3 class="text-xl font-bold text-navy mb-2">{{ t('cart.empty_title') }}</h3>
                <div class="text-gray-500 mb-8 px-6 text-center max-w-md">{{ t('cart.empty_desc') }}</div>
                <NuxtLink to="/products">
                    <BaseButton variant="primary" size="lg" icon="ph:shopping-bag">{{ t('cart.start_shopping') }}</BaseButton>
                </NuxtLink>
            </div>

            <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Product List -->
                <div class="lg:col-span-2 space-y-4">
                    <div v-for="item in productCart" :key="item.uuid"
                        class="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex gap-4 md:gap-6 relative group overflow-hidden hover:border-primary/20 transition-all">

                        <!-- Product Image -->
                        <div
                            class="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center">
                            <img :src="getProductImage(item)" :alt="item.product_name"
                                class="w-full h-full object-cover" />
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
                                    {{ t('cart.variant', { val: item.color }) }}
                                </div>
                            </div>

                            <div class="flex items-end justify-between mt-4">
                                <div class="space-y-1">
                                    <div class="text-xs text-gray-400 line-through" v-if="item.product_sale_price">
                                        Rp {{ formatPrice(item.product_price) }}
                                    </div>
                                    <div class="text-lg font-black text-navy">
                                        Rp {{ formatPrice(item.product_sale_price || item.product_price) }}
                                    </div>
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
                            :title="t('cart.remove_product')">
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
                                {{ t('cart.order_summary') }}
                            </h4>

                            <div class="space-y-4 mb-8">
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-500 font-medium">{{ t('cart.subtotal', { num: totalProductQty }) }}</span>
                                    <span class="font-bold text-navy">Rp {{ formatPrice(totalProductSubtotal) }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-500 font-medium">{{ t('cart.shipping_est') }}</span>
                                    <span class="text-gray-400 italic text-xs font-bold">{{ t('cart.shipping_checkout_calc') }}</span>
                                </div>
                                <div
                                    class="pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                                    <span class="font-bold text-navy tracking-widest text-xs">{{ t('cart.total_payment') }}</span>
                                    <span class="text-2xl font-black text-navy">Rp {{ formatPrice(totalProductSubtotal) }}</span>
                                </div>
                            </div>

                            <BaseButton @click="openCheckoutModal" class="w-full"
                                variant="primary" size="lg" icon="ph:ticket-bold"
                                :disabled="productCart.length === 0">
                                {{ t("archer_cart.open_checkout_ticket") }}
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Checkout Dialog Modal -->
        <div v-if="showCheckoutModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
                
                <!-- Modal Header -->
                <div class="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div class="flex items-center gap-3">
                        <div class="size-11 rounded-2xl bg-navy text-primary flex items-center justify-center shrink-0">
                            <Icon icon="ph:ticket-bold" class="text-xl" />
                        </div>
                        <div>
                            <h3 class="font-black text-navy text-lg leading-tight">{{ t("archer_cart.open_order_ticket_title") }}</h3>
                            <div class="text-xs text-gray-500 mt-0.5">{{ t("archer_cart.send_order_via_chat_desc") }}</div>
                        </div>
                    </div>
                    <button @click="showCheckoutModal = false" class="size-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition">
                        <Icon icon="ph:x-bold" class="text-sm" />
                    </button>
                </div>

                <!-- Products Summary in Modal -->
                <div class="space-y-3">
                    <div class="text-[10px] font-black text-gray-400 tracking-wider capitalize">{{ t("archer_cart.ordered_products_list") }}</div>
                    <div class="max-h-48 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                        <div v-for="item in productCart" :key="item.uuid" class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-xs border border-gray-100">
                            <div class="size-10 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0 flex items-center justify-center">
                                <img :src="getProductImage(item)" class="w-full h-full object-cover" />
                            </div>
                            <div class="min-w-0 flex-1 pr-2">
                                <div class="font-bold text-navy truncate">{{ item.product_name }}</div>
                                <div class="text-[10px] text-gray-500">
                                    {{ item.quantity }}x @ Rp {{ formatPrice(item.product_sale_price || item.product_price) }}
                                    <span v-if="item.color" class="text-primary font-bold">({{ item.color }})</span>
                                </div>
                            </div>
                            <div class="font-black text-navy shrink-0">
                                Rp {{ formatPrice((item.product_sale_price || item.product_price) * item.quantity) }}
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-between items-center pt-2 px-1 border-t border-gray-100">
                        <span class="text-xs font-bold text-gray-500">{{ t("archer_cart.estimated_total") }}</span>
                        <span class="text-lg font-black text-navy">Rp {{ formatPrice(totalProductSubtotal) }}</span>
                    </div>
                </div>

                <!-- Additional Notes / Address Input -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-black text-navy tracking-wider mb-2">{{ t("archer_cart.shipping_notes_label") }}</label>
                        <textarea v-model="checkoutForm.notes" rows="3"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none text-xs"
                            :placeholder="t('archer_cart.shipping_notes_placeholder')"></textarea>
                    </div>

                    <div class="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-left flex items-start gap-2.5">
                        <Icon icon="ph:info-bold" class="text-blue-600 text-base shrink-0 mt-0.5" />
                        <div class="text-[11px] text-blue-900 leading-relaxed">
                            <span v-html="t('archer_cart.chat_ticket_info')"></span>
                        </div>
                    </div>
                </div>

                <!-- Modal Actions -->
                <div class="flex gap-3 pt-2">
                    <BaseButton @click="showCheckoutModal = false" variant="outline" size="md" class="flex-1 !rounded-xl">
                        {{ t("archer_cart.cancel") }}
                    </BaseButton>
                    <BaseButton @click="handleSendOrderTicket" variant="primary" size="md" icon="ph:paper-plane-tilt-bold"
                        class="flex-1 !rounded-xl font-black shadow-lg shadow-primary/20" :loading="isSubmittingTicket">
                        {{ t("archer_cart.send_order_chat_btn") }}
                    </BaseButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { useI18n } from 'vue-i18n'

definePageMeta({
    layout: 'dashboard'
})

const { t } = useI18n()
const router = useRouter()

useHead({
    title: computed(() => t('cart.title') + ' - Archeris Dashboard')
})

const { user } = useAuth()
const { get, post, put, delete: del } = useApi()
const toast = useToast()

const isLoading = ref(true)
const isProcessing = ref(false)
const isSubmittingTicket = ref(false)
const showCheckoutModal = ref(false)
const productCart = ref([])

const checkoutForm = ref({
    notes: ''
})

// Computed values
const totalProductQty = computed(() => productCart.value.reduce((acc, item) => acc + item.quantity, 0))
const totalProductSubtotal = computed(() => productCart.value.reduce((acc, item) => {
    const price = item.product_sale_price || item.product_price
    return acc + (price * item.quantity)
}, 0))

// Utility functions
const formatPrice = (p) => new Intl.NumberFormat('id-ID').format(p || 0)

const getProductImage = (item) => {
    let img = item.product_image_url || item.image_url || item.product_image
    if (!img && item.images) {
        try {
            const arr = typeof item.images === 'string' ? JSON.parse(item.images) : item.images
            if (Array.isArray(arr) && arr[0]) img = arr[0]
        } catch { /* silent */ }
    }
    if (img && img.trim()) {
        return useImageOrDefault(img)
    }
    return `https://picsum.photos/seed/${item.product_id || item.product_name || 'archery'}/300/300`
}

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
        toast.error(t('cart.cart_error'))
    } finally {
        isLoading.value = false
    }
}

const openCheckoutModal = () => {
    if (productCart.value.length === 0) return
    showCheckoutModal.value = true
}

const handleSendOrderTicket = async () => {
    if (productCart.value.length === 0) return
    isSubmittingTicket.value = true

    try {
        // Group items by seller_id
        const sellerGroups = {}
        productCart.value.forEach(item => {
            const sId = item.seller_id || 'default_seller'
            if (!sellerGroups[sId]) sellerGroups[sId] = []
            sellerGroups[sId].push(item)
        })

        let lastConvId = null

        // Send order ticket for each seller group
        for (const [sellerId, items] of Object.entries(sellerGroups)) {
            const firstItem = items[0]
            const itemsListText = items.map(it => {
                const price = it.product_sale_price || it.product_price
                const variant = it.color ? ` (${it.color})` : ''
                return `• ${it.product_name}${variant} x${it.quantity} — Rp ${formatPrice(price * it.quantity)}`
            }).join('\n')

            const groupTotal = items.reduce((sum, it) => {
                const price = it.product_sale_price || it.product_price
                return sum + (price * it.quantity)
            }, 0)

            const formattedMessage = [
                '🎫 TIKET PESANAN BARU',
                '─────────────────────────',
                '📦 Rincian Produk:',
                itemsListText,
                '',
                `💰 Total Estimasi: Rp ${formatPrice(groupTotal)}`,
                checkoutForm.value.notes ? `📍 Alamat & Catatan:
${checkoutForm.value.notes}` : '',
                '─────────────────────────',
                'Halo, saya ingin memesan produk di atas. Mohon konfirmasi ketersediaan dan detail selanjutnya.'
            ].filter(Boolean).join('\n')

            // Create order record in database so seller sees it in /dashboard/seller/orders
            try {
                await post('/orders', {
                    seller_id: firstItem.seller_id || '',
                    shipping_address: checkoutForm.value.notes || '',
                    notes: checkoutForm.value.notes || '',
                    items: items.map(it => ({
                        product_id: it.product_id,
                        quantity: it.quantity,
                        price: it.product_sale_price || it.product_price,
                        color: it.color || ''
                    }))
                })
            } catch (err) {
                console.warn('Failed to create order record:', err)
            }

            // Start or get conversation
            const convRes = await post('/chat/conversations', {
                seller_id: firstItem.seller_id || '',
                product_id: firstItem.product_id,
                product_name: firstItem.product_name,
                product_image: firstItem.product_image_url
            })

            const convData = convRes?.conversation || convRes?.data || convRes
            const convId = convData?.id || convData?.uuid

            if (convId) {
                lastConvId = convId
                await post(`/chat/conversations/${convId}/messages`, {
                    message: formattedMessage
                })
            }
        }

        // Delete all items from cart
        for (const item of productCart.value) {
            try {
                await del(`/cart/${item.uuid}`)
            } catch (e) { /* silent */ }
        }

        productCart.value = []
        showCheckoutModal.value = false
        toast.success('Tiket pesanan berhasil dikirimkan ke Penjual!')

        // Redirect to chat
        router.push(lastConvId ? `/dashboard/archer/chat?conversation_id=${lastConvId}` : '/dashboard/archer/chat')
    } catch (error) {
        console.error('Failed to send order ticket:', error)
        const errMsg = error?.response?.data?.error || error?.message || 'Gagal mengirimkan tiket pesanan ke penjual'
        toast.error(errMsg)
    } finally {
        isSubmittingTicket.value = false
    }
}

const updateQty = async (item, delta) => {
    const newQty = item.quantity + delta

    // Minimum quantity is 1 (removal handled separately)
    if (newQty < 1) return removeItem(item.uuid)

    // Stock validation
    if (newQty > item.product_stock) {
        toast.error(t('cart.stock_limit', { stock: item.product_stock }))
        return
    }

    isProcessing.value = true
    try {
        await put(`/cart/${item.uuid}`, { quantity: newQty })
        item.quantity = newQty
    } catch (e) {
        toast.error(t('cart.update_failed'))
    } finally {
        isProcessing.value = false
    }
}

const removeItem = async (uuid) => {
    if (!confirm(t('cart.confirm_remove'))) return

    isProcessing.value = true
    try {
        await del(`/cart/${uuid}`)
        productCart.value = productCart.value.filter(i => i.uuid !== uuid)
        toast.success(t('cart.remove_success'))
    } catch (e) {
        toast.error(t('cart.remove_failed'))
    } finally {
        isProcessing.value = false
    }
}

onMounted(fetchCart)
</script>

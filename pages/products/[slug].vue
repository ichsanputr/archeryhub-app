<template>
    <div class="min-h-screen bg-[#f7f8f5] pt-16 pb-20">
        <section class="sticky top-16 z-30 border-b border-black/5 bg-white/95 backdrop-blur">
            <div class="container mx-auto max-w-7xl px-4 py-3">
                <Breadcrumbs :items="[
                    { label: 'Produk', path: '/products' },
                    { label: breadcrumbCategory }
                ]" :current="product?.name || 'Detail Produk'" />
            </div>
        </section>

        <Transition name="fade" mode="out-in">
            <ProductPageSkeleton v-if="isLoading || !product" key="skeleton"
                class="container mx-auto max-w-7xl px-4 pt-8" />

            <div v-else key="content" class="container mx-auto max-w-7xl px-4 pt-8">
                <section
                    class="rounded-3xl border border-black/5 bg-gradient-to-br from-[#fffaf1] via-white to-[#f1f5ff] p-4 shadow-sm md:p-8">
                    <div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_430px]">
                        <div class="space-y-4">
                            <div
                                class="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white ring-1 ring-black/5 shadow-sm">
                                <img :src="selectedImage" :alt="product.name"
                                    class="h-full w-full object-cover transition duration-500 hover:scale-[1.03]" />

                                <div class="absolute left-4 top-4 flex items-center gap-2">
                                    <span
                                        class="inline-flex items-center gap-1 rounded-full bg-black px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                                        {{ productCategoryLabel }}
                                    </span>
                                    <span v-if="product.sale_price"
                                        class="inline-flex rounded-full bg-red-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                                        -{{ discountPercent }}%
                                    </span>
                                </div>

                                <button @click="isZoomOpen = true"
                                    class="absolute bottom-4 right-4 rounded-xl bg-white/90 p-2.5 text-navy shadow-sm hover:bg-white">
                                    <Icon icon="ph:magnifying-glass-plus-bold" class="text-lg" />
                                </button>
                            </div>

                            <div class="grid grid-cols-4 gap-2 sm:grid-cols-6">
                                <button v-for="(img, idx) in galleryImages" :key="idx" @click="selectedImage = img"
                                    :class="[
                                        'aspect-square overflow-hidden rounded-2xl border-2 bg-white transition',
                                        selectedImage === img ? 'border-primary shadow-sm' : 'border-transparent hover:border-black/10'
                                    ]">
                                    <img :src="img" :alt="`${product.name} ${idx + 1}`" class="h-full w-full object-cover" />
                                </button>
                            </div>

                            <div class="grid grid-cols-3 gap-3 rounded-2xl border border-black/5 bg-white p-4 text-center text-xs">
                                <div>
                                    <div class="font-black text-navy">100% Ori</div>
                                    <div class="text-gray-500">Sudah Dicek</div>
                                </div>
                                <div>
                                    <div class="font-black text-navy">Garansi 7 Hari</div>
                                    <div class="text-gray-500">Tukar Produk</div>
                                </div>
                                <div>
                                    <div class="font-black text-navy">Pengiriman Cepat</div>
                                    <div class="text-gray-500">Estimasi 1-3 Hari</div>
                                </div>
                            </div>
                        </div>

                        <aside class="space-y-5 lg:sticky lg:top-28 lg:h-fit">
                            <div class="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
                                <div class="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Produk Pilihan</div>
                                <h1 class="mt-2 text-3xl font-black leading-tight text-navy">{{ product.name }}</h1>

                                <div class="mt-4 flex flex-wrap items-center gap-3 text-sm">
                                    <span
                                        class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 font-bold text-emerald-700">
                                        <span class="h-2 w-2 rounded-full" :class="product.stock > 0 ? 'bg-emerald-600' : 'bg-red-500'" />
                                        {{ product.stock > 0 ? `Stok ${product.stock}` : 'Stok Habis' }}
                                    </span>
                                    <span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 font-bold text-amber-700">
                                        <Icon icon="ph:star-fill" /> 4.9
                                    </span>
                                </div>

                                <div class="mt-5 rounded-2xl bg-[#0f172a] p-5 text-white">
                                    <div class="text-xs uppercase tracking-[0.18em] text-white/70">Harga</div>
                                    <div class="mt-1 flex items-end gap-3">
                                        <div class="text-3xl font-black">Rp {{ formatPrice(finalPrice) }}</div>
                                        <div v-if="product.sale_price" class="pb-1 text-sm text-white/60 line-through">Rp {{ formatPrice(product.price) }}</div>
                                    </div>
                                </div>

                                <div v-if="product.colors?.length" class="mt-5">
                                    <div class="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Warna</div>
                                    <div class="flex flex-wrap gap-2">
                                        <button v-for="color in product.colors" :key="color" @click="selectedColor = color"
                                            :class="[
                                                'rounded-full border px-3 py-1.5 text-xs font-bold transition',
                                                selectedColor === color ? 'border-navy bg-navy text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            ]">
                                            {{ color }}
                                        </button>
                                    </div>
                                </div>

                                <div class="mt-5 flex items-center justify-between rounded-2xl border border-black/5 bg-[#fafafa] p-3">
                                    <div class="text-sm font-bold text-navy">Jumlah</div>
                                    <div class="flex items-center rounded-xl border border-black/10 bg-white">
                                        <button @click="quantity = Math.max(1, quantity - 1)" class="px-3 py-2 text-navy">
                                            <Icon icon="ph:minus-bold" />
                                        </button>
                                        <input v-model.number="quantity" type="number" min="1" :max="maxQty"
                                            class="w-12 border-x border-black/10 text-center text-sm font-black text-navy outline-none" />
                                        <button @click="quantity = Math.min(maxQty, quantity + 1)" class="px-3 py-2 text-navy">
                                            <Icon icon="ph:plus-bold" />
                                        </button>
                                    </div>
                                </div>

                                <BaseButton @click="handleAddToCart" variant="primary" size="lg" icon="ph:shopping-cart-simple-bold"
                                    class="mt-5 w-full rounded-2xl py-4 font-black" :loading="isAddingToCart" :disabled="maxQty < 1">
                                    Tambah ke Keranjang
                                </BaseButton>

                                <div class="mt-4 flex items-center justify-between rounded-2xl border border-black/5 bg-white p-3">
                                    <div class="text-xs font-bold uppercase tracking-widest text-gray-400">Bagikan</div>
                                    <div class="flex items-center gap-2">
                                        <button @click="share('facebook')" class="rounded-lg bg-blue-50 p-2 text-blue-600"><Icon icon="ph:facebook-logo-bold" /></button>
                                        <button @click="share('twitter')" class="rounded-lg bg-sky-50 p-2 text-sky-600"><Icon icon="ph:twitter-logo-bold" /></button>
                                        <button @click="share('whatsapp')" class="rounded-lg bg-green-50 p-2 text-green-600"><Icon icon="ph:whatsapp-logo-bold" /></button>
                                        <button @click="copyLink" class="rounded-lg bg-gray-100 p-2 text-gray-700"><Icon icon="ph:link-bold" /></button>
                                    </div>
                                </div>
                            </div>

                            <div class="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
                                <div class="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Penjual</div>
                                <div class="mt-3 flex items-center gap-3">
                                    <img :src="allowedProductImages[4]"
                                        alt="seller" class="h-12 w-12 rounded-full object-cover" />
                                    <div>
                                        <div class="font-black text-navy">{{ product.seller?.store_name || 'Toko ArcheryHub' }}</div>
                                        <div class="text-xs text-gray-500">Respon chat cepat</div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>

                <section class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
                    <div class="rounded-3xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
                        <h2 class="text-xl font-black text-navy">Deskripsi Produk</h2>
                        <p class="mt-3 whitespace-pre-line leading-relaxed text-gray-600">
                            {{ product.description || 'Belum ada deskripsi detail untuk produk ini.' }}
                        </p>

                        <div v-if="Object.keys(product.specifications || {}).length" class="mt-6">
                            <h3 class="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Spesifikasi</h3>
                            <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div v-for="(value, key) in product.specifications" :key="key"
                                    class="rounded-2xl border border-black/5 bg-[#fafafa] p-4">
                                    <div class="text-xs font-bold uppercase tracking-wider text-gray-400">{{ key }}</div>
                                    <div class="mt-1 font-black text-navy">{{ value }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
                        <h3 class="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Ringkasan</h3>
                        <ul class="mt-4 space-y-3 text-sm text-gray-600">
                            <li class="flex items-center justify-between"><span>SKU</span><span class="font-bold text-navy">{{ (product.slug || '-').toUpperCase() }}</span></li>
                            <li class="flex items-center justify-between"><span>Kategori</span><span class="font-bold text-navy">{{ breadcrumbCategory }}</span></li>
                            <li class="flex items-center justify-between"><span>Harga Jual</span><span class="font-bold text-navy">Rp {{ formatPrice(finalPrice) }}</span></li>
                            <li class="flex items-center justify-between"><span>Kondisi</span><span class="font-bold text-navy">Baru</span></li>
                        </ul>
                    </div>
                </section>
            </div>
        </Transition>

        <div v-if="isZoomOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
            <button @click="isZoomOpen = false" class="absolute right-5 top-5 text-white">
                <Icon icon="ph:x-bold" class="text-3xl" />
            </button>
            <img :src="selectedImage" :alt="product?.name" class="max-h-[90vh] max-w-[92vw] rounded-2xl object-contain" />
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'landing',
    headerTransparent: false
})

const route = useRoute()
const toast = useToast()
const { isLoggedIn, user } = useAuth()
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

const categoryLabels = {
    equipment: 'Peralatan',
    apparel: 'Pakaian',
    accessories: 'Aksesoris',
    training: 'Latihan',
    other: 'Lainnya'
}

useHead(() => ({
    title: product.value?.name
        ? `${product.value.name} | Produk Panahan | ArcheryHub`
        : 'Detail Produk | ArcheryHub',
    meta: [
        {
            name: 'description',
            content: product.value?.description
                ? String(product.value.description).slice(0, 160)
                : 'Lihat detail produk panahan, foto, spesifikasi, dan harga terbaru di ArcheryHub.'
        }
    ]
}))

const quantity = ref(1)
const selectedColor = ref('')
const selectedImage = ref('')
const isZoomOpen = ref(false)
const isAddingToCart = ref(false)

const allowedProductImages = [
    'https://images.unsplash.com/photo-1503602642458-232111445657',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796',
    'https://images.unsplash.com/photo-1511556820780-d912e42b4980',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d'
]

const { data: productResponse, pending: isLoading } = useAsyncData(
    `product-${route.params.slug}`,
    () => $fetch(`${apiBaseUrl}/products/${route.params.slug}`),
    { lazy: true, server: true }
)

const parseJSON = (val, fallback) => {
    if (typeof val === 'string' && val.trim() !== '') {
        try {
            return JSON.parse(val)
        } catch {
            return fallback
        }
    }
    return val || fallback
}

const product = computed(() => {
    const data = productResponse.value?.data || productResponse.value
    if (!data) return null

    const p = { ...data }
    p.price = Number(p.price || 0)
    p.sale_price = p.sale_price !== null && p.sale_price !== undefined ? Number(p.sale_price) : null
    p.stock = Number(p.stock || 0)
    p.images = parseJSON(p.images, [])
    p.colors = parseJSON(p.colors, [])
    p.specifications = parseJSON(p.specifications, {})
    return p
})

const galleryImages = computed(() => {
    const imgs = []
    if (product.value?.image_url) imgs.push(product.value.image_url)
    if (Array.isArray(product.value?.images)) imgs.push(...product.value.images)

    const unique = [...new Set(imgs.filter((img) => allowedProductImages.includes(img)))]
    if (unique.length > 0) return unique

    return [allowedProductImages[0]]
})

watchEffect(() => {
    if (!selectedImage.value && galleryImages.value.length) {
        selectedImage.value = galleryImages.value[0]
    }

    if (product.value?.colors?.length && !selectedColor.value) {
        selectedColor.value = product.value.colors[0]
    }

    const safeMax = Math.max(1, Number(product.value?.stock || 1))
    if (quantity.value > safeMax) quantity.value = safeMax
})

const breadcrumbCategory = computed(() => {
    const cat = product.value?.category || ''
    return categoryLabels[cat] || 'Produk'
})

const productCategoryLabel = computed(() => categoryLabels[product.value?.category] || 'Produk')

const finalPrice = computed(() => product.value?.sale_price || product.value?.price || 0)
const maxQty = computed(() => Math.max(0, Number(product.value?.stock || 0)))

const discountPercent = computed(() => {
    if (!product.value?.sale_price || !product.value?.price) return 0
    return Math.round((1 - product.value.sale_price / product.value.price) * 100)
})

const share = (platform) => {
    const url = window.location.href
    const text = `Cek ${product.value.name} di ArcheryHub! Rp ${formatPrice(finalPrice.value)}`

    const links = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`
    }

    if (links[platform]) window.open(links[platform], '_blank')
}

const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link produk berhasil disalin')
}

const handleAddToCart = async () => {
    if (!isLoggedIn.value) {
        toast.error('Silahkan login sebagai Pemanah untuk menambah ke keranjang')
        return
    }

    if (user.value?.type !== 'archer' && user.value?.role !== 'archer') {
        toast.error('Hanya akun Pemanah yang dapat berbelanja')
        return
    }

    if (!product.value || maxQty.value < 1) {
        toast.error('Stok produk sedang tidak tersedia')
        return
    }

    isAddingToCart.value = true
    try {
        await $fetch(`${apiBaseUrl}/cart`, {
            method: 'POST',
            body: {
                product_id: product.value.id || product.value.uuid,
                quantity: quantity.value,
                color: selectedColor.value
            },
            headers: {
                Authorization: `Bearer ${useCookie('auth_token').value}`
            }
        })
        toast.success('Berhasil ditambah ke keranjang')
    } catch {
        toast.error('Gagal menambah ke keranjang')
    } finally {
        isAddingToCart.value = false
    }
}

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(Number(price || 0))
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

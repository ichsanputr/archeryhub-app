<template>
    <div class="space-y-8 pb-12">
        <!-- Enhanced Header Section -->
        <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-4 sm:gap-5">
                    <div class="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-lg">
                        <Icon icon="ph:pencil-simple-bold" class="text-primary text-2xl sm:text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-3xl font-black tracking-tight leading-tight">{{ t('seller_product_form.edit_title', 'Edit Produk') }}</h1>
                        <div class="text-slate-300 text-xs sm:text-sm font-medium mt-1">{{ t('seller_product_form.edit_subtitle', 'Perbarui informasi produk Anda di marketplace.') }}</div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <NuxtLink to="/dashboard/seller/products">
                        <BaseButton variant="outline" size="sm" icon="ph:arrow-left-bold"
                            class="h-11 px-6 font-black tracking-widest text-xs !rounded-xl border-white/20 text-white hover:bg-white/10 transition-all">
                            Kembali
                        </BaseButton>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingProduct" class="flex items-center justify-center py-24">
            <div class="flex flex-col items-center gap-4">
                <LoadingSpinner size="xl" />
                <div class="text-gray-400 font-medium">{{ t('seller_product_form.loading_data', 'Memuat data produk...') }}</div>
            </div>
        </div>

        <!-- Not Found -->
        <div v-else-if="notFound" class="flex flex-col items-center justify-center py-24">
            <Icon icon="ph:package-x" class="text-6xl text-gray-200 mb-4" />
            <h3 class="text-xl font-black text-navy mb-2">{{ t('seller_product_form.not_found_title', 'Produk Tidak Ditemukan') }}</h3>
            <div class="text-gray-400 font-medium mb-6">{{ t('seller_product_form.not_found_desc', 'Produk yang ingin Anda edit tidak ditemukan.') }}</div>
            <NuxtLink to="/dashboard/seller/products">
                <BaseButton variant="primary" icon="ph:arrow-left">{{ t('seller_product_form.back_to_list', 'Kembali ke Daftar Produk') }}</BaseButton>
            </NuxtLink>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Form -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Basic Information -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 class="text-xl font-bold text-navy mb-6 flex items-center gap-2">
                            <Icon icon="ph:info" class="text-primary" />
                            {{ t('seller_product_form.basic_info', 'Informasi Dasar') }}
                        </h2>
                        <div class="space-y-5">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('seller_product_form.product_name', 'Nama Produk *') }}</label>
                                <input v-model="form.name" type="text" required
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    :placeholder="t('seller_product_form.name_placeholder', 'Contoh: Recurve Bow Hoyt Satori 23 Inch')" />
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('seller_product_form.description', 'Deskripsi') }}</label>
                                <TiptapEditor v-model="form.description" :placeholder="t('seller_product_form.desc_placeholder', 'Jelaskan produk Anda secara detail...')" minHeight="200px" />
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <BaseSelect v-model="form.category" :items="categoryOptions" :label="t('seller_product_form.category', 'Kategori')"
                                        :placeholder="t('seller_product_form.category_select', 'Pilih Kategori')" required />
                                </div>
                                <div>
                                    <BaseSelect v-model="form.status" :items="statusOptions" :label="t('seller_product_form.status', 'Status')"
                                        :placeholder="t('seller_product_form.status_select', 'Pilih Status')" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pricing -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 class="text-xl font-bold text-navy mb-6 flex items-center gap-2">
                            <Icon icon="ph:money" class="text-primary" />
                            {{ t('seller_product_form.pricing_stock', 'Harga & Stok') }}
                        </h2>
                        <div class="space-y-5">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('seller_product_form.price', 'Harga Normal *') }}</label>
                                    <div class="relative">
                                        <span
                                            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                                        <input v-model.number="form.price" type="number" min="0" step="1000" required
                                            class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="0" />
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('seller_product_form.sale_price', 'Harga Diskon') }}</label>
                                    <div class="relative">
                                        <span
                                            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                                        <input v-model.number="form.sale_price" type="number" min="0" step="1000"
                                            class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            :placeholder="t('seller_product_form.sale_price_placeholder', '0 (opsional)')" />
                                    </div>
                                    <div class="text-xs text-gray-400 mt-1">{{ t('seller_product_form.price_sale_hint', 'Kosongkan atau isi 0 untuk tidak terbatas') }}</div>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('seller_product_form.stock', 'Stok Tersedia') }}</label>
                                <input v-model.number="form.stock" type="number" min="0"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="0" />
                            </div>
                        </div>
                    </div>

                    <!-- Images -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 class="text-xl font-bold text-navy mb-6 flex items-center gap-2">
                            <Icon icon="ph:image" class="text-primary" />
                            {{ t('seller_product_form.media', 'Gambar Produk') }}
                        </h2>
                        <div class="space-y-5">
                            <div>
                                <div class="flex items-center justify-between gap-3 mb-2">
                                    <label class="block text-sm font-bold text-gray-700">{{ t('seller_product_form.media_primary', 'Gambar Utama') }}</label>
                                    <BaseButton type="button" variant="white" size="sm" icon="ph:images" @click="openMediaLibrary('primary')">
                                        {{ t('seller_product_form.select_media', 'Pilih dari Media Library') }}
                                    </BaseButton>
                                </div>
                                <div v-if="form.image_url" class="mt-3">
                                    <img :src="form.image_url" alt="Preview"
                                        class="h-32 w-32 object-cover rounded-xl border border-gray-200" />
                                </div>
                                <div v-else class="text-sm text-gray-500">{{ t('seller_product_form.no_main_image', 'Belum ada gambar utama.') }}</div>
                            </div>

                            <div>
                                <div class="flex items-center justify-between gap-3 mb-2">
                                    <label class="block text-sm font-bold text-gray-700">{{ t('seller_product_form.media_gallery', 'Gambar Tambahan') }}</label>
                                    <BaseButton type="button" variant="white" size="sm" icon="ph:images" @click="openMediaLibrary('gallery')">
                                        {{ t('seller_product_form.add_media', 'Tambah dari Media Library') }}
                                    </BaseButton>
                                </div>
                                <div v-if="form.images.length" class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div v-for="(img, idx) in form.images" :key="idx" class="relative group">
                                        <img :src="img" :alt="`Image ${idx + 1}`" class="w-full aspect-square object-cover rounded-xl border border-gray-200" />
                                        <button type="button" @click="removeImage(idx)"
                                            class="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Icon icon="ph:x-bold" class="text-xs" />
                                        </button>
                                    </div>
                                </div>
                                <div v-else class="text-sm text-gray-500">{{ t('seller_product_form.no_additional_images', 'Belum ada gambar tambahan.') }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Specifications -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 class="text-xl font-bold text-navy mb-6 flex items-center gap-2">
                            <Icon icon="ph:list-bullets" class="text-primary" />
                            {{ t('seller_product_form.specifications', 'Spesifikasi') }}
                        </h2>
                        <div class="space-y-4">
                            <div v-for="(spec, idx) in specifications" :key="idx" class="flex gap-3">
                                <input v-model="spec.key" type="text" :placeholder="t('seller_product_form.spec_name', 'Nama Spesifikasi')"
                                    class="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                <input v-model="spec.value" type="text" :placeholder="t('seller_product_form.spec_value', 'Nilai')"
                                    class="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                <button type="button" @click="specifications.splice(idx, 1)"
                                    class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <Icon icon="ph:trash-bold" />
                                </button>
                            </div>
                            <button type="button" @click="specifications.push({ key: '', value: '' })"
                                class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                                <Icon icon="ph:plus-bold" />
                                {{ t('seller_product_form.add_spec', 'Tambah Spesifikasi') }}
                            </button>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 class="text-xl font-bold text-navy mb-2">{{ t('seller_product_form.product_colors', 'Warna Produk') }}</h2>
                        <div class="text-sm text-gray-500 mb-5">{{ t('seller_product_form.product_colors_desc', 'Kelola opsi warna produk yang tersedia.') }}</div>

                        <div class="flex flex-col sm:flex-row gap-3 mb-4">
                            <input
                                v-model="newColor"
                                type="text"
                                class="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                :placeholder="t('seller_product_form.color_placeholder', 'Contoh: Hitam, Navy, Merah')"
                                @keyup.enter.prevent="addColor"
                            />
                            <BaseButton type="button" variant="white" icon="ph:plus-bold" @click="addColor">
                                {{ t('seller_product_form.add_color', 'Tambah Warna') }}
                            </BaseButton>
                        </div>

                        <div class="flex flex-wrap gap-2">
                            <button
                                v-for="(color, idx) in form.colors"
                                :key="`${color}-${idx}`"
                                type="button"
                                class="inline-flex items-center gap-2 rounded-full bg-primary/10 text-navy px-3 py-1.5 text-xs font-bold"
                                @click="removeColor(idx)"
                            >
                                <span>{{ color }}</span>
                                <Icon icon="ph:x-bold" class="text-[10px]" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <h3 class="text-lg font-bold text-navy">{{ t('seller_product_form.actions', 'Aksi') }}</h3>
                        <BaseButton type="submit" variant="primary" size="lg" class="w-full" :loading="isSubmitting">
                            <Icon icon="ph:floppy-disk-bold" class="mr-2" />
                            {{ t('seller_product_form.update_button', 'Simpan Perubahan') }}
                        </BaseButton>
                        <NuxtLink to="/dashboard/seller/products" class="block">
                            <BaseButton type="button" variant="white" size="lg" class="w-full">{{ t('seller_product_form.cancel_button', 'Batal') }}</BaseButton>
                        </NuxtLink>

                    </div>
                </div>
            </div>
        </form>

        <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import MediaLibrary from '~/components/common/MediaLibrary.vue'

definePageMeta({ layout: 'dashboard' })

const { t } = useDashboardI18n()

useHead({ title: computed(() => `${t('seller_product_form.edit_title', 'Edit Produk')} - Archeris Dashboard`) })

const route = useRoute()
const router = useRouter()
const { get, put, delete: del } = useApi()
const toast = useToast()

const isLoadingProduct = ref(true)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const notFound = ref(false)
const specifications = ref([{ key: '', value: '' }])
const showMediaLibrary = ref(false)
const mediaTarget = ref('primary')
const newColor = ref('')

const categoryOptions = computed(() => [
    { value: 'equipment', title: computed(() => t('seller_product_form.cat_equipment', 'Peralatan')) },
    { value: 'apparel', title: computed(() => t('seller_product_form.cat_apparel', 'Pakaian')) },
    { value: 'accessories', title: computed(() => t('seller_product_form.cat_accessories', 'Aksesoris')) },
    { value: 'training', title: computed(() => t('seller_product_form.cat_training', 'Training')) },
    { value: 'other', title: computed(() => t('seller_product_form.cat_other', 'Lainnya')) }
])

const statusOptions = computed(() => [
    { value: 'draft', title: computed(() => t('seller_product_form.stat_draft', 'Draft')) },
    { value: 'active', title: computed(() => t('seller_product_form.stat_active', 'Aktif')) },
    { value: 'archived', title: computed(() => t('seller_product_form.stat_archived', 'Arsip')) }
])

const form = ref({
    name: '',
    description: '',
    price: 0,
    sale_price: null,
    category: '',
    stock: 0,
    status: 'draft',
    image_url: '',
    images: [],
    colors: []
})

const openMediaLibrary = (target) => {
    mediaTarget.value = target
    showMediaLibrary.value = true
}

const handleMediaSelect = (media) => {
    if (!media?.url) return

    if (mediaTarget.value === 'primary') {
        form.value.image_url = media.url
    } else {
        const exists = form.value.images.includes(media.url)
        if (!exists) {
            form.value.images.push(media.url)
        }
    }

    showMediaLibrary.value = false
}

const removeImage = (index) => {
    form.value.images.splice(index, 1)
}

const addColor = () => {
    const value = newColor.value.trim()
    if (!value) return
    const exists = form.value.colors.some(c => c.toLowerCase() === value.toLowerCase())
    if (!exists) {
        form.value.colors.push(value)
    }
    newColor.value = ''
}

const removeColor = (index) => {
    form.value.colors.splice(index, 1)
}

onMounted(async () => {
    const id = route.params.id
    if (!id) { notFound.value = true; isLoadingProduct.value = false; return }
    try {
        const res = await get(`/products/${id}`)
        const p = res.data || res
        if (!p) { notFound.value = true; return }

        form.value.name = p.name || ''
        form.value.description = p.description || ''
        form.value.price = p.price || 0
        form.value.sale_price = p.sale_price || null
        form.value.category = p.category || ''
        form.value.stock = p.stock || 0
        form.value.status = p.status || 'draft'
        form.value.image_url = p.image_url || ''

        // Parse images
        let imgs = p.images || []
        if (typeof imgs === 'string') {
            try { imgs = JSON.parse(imgs) } catch { imgs = [] }
        }
        form.value.images = imgs

        let colors = p.colors || []
        if (typeof colors === 'string') {
            try { colors = JSON.parse(colors) } catch { colors = [] }
        }
        form.value.colors = Array.isArray(colors) ? colors : []

        let pm = p.allowed_payment_methods || ['automatic', 'wallet', 'manual']
        if (typeof pm === 'string') {
            try { pm = JSON.parse(pm) } catch { pm = ['automatic', 'wallet', 'manual'] }
        }
        form.value.allowed_payment_methods = Array.isArray(pm) ? pm : ['automatic', 'wallet', 'manual']

        // Parse specifications
        let specs = p.specifications || {}
        if (typeof specs === 'string') {
            try { specs = JSON.parse(specs) } catch { specs = {} }
        }
        const specList = Object.entries(specs).map(([k, v]) => ({ key: k, value: v }))
        specifications.value = specList.length > 0 ? specList : [{ key: '', value: '' }]
    } catch (e) {
        notFound.value = true
    } finally {
        isLoadingProduct.value = false
    }
})

const handleSubmit = async () => {
    if (!form.value.name || !form.value.price || !form.value.category) {
        toast.error('Harap lengkapi semua field yang wajib diisi')
        return
    }
    if (form.value.sale_price && form.value.sale_price >= form.value.price) {
        toast.error('Harga diskon harus lebih kecil dari harga normal')
        return
    }

    isSubmitting.value = true
    try {
        const specs = {}
        specifications.value.forEach(s => { if (s.key && s.value) specs[s.key] = s.value })

        await put(`/products/${route.params.id}`, {
            name: form.value.name,
            description: form.value.description || null,
            price: Number(form.value.price),
            sale_price: form.value.sale_price ? Number(form.value.sale_price) : null,
            category: form.value.category,
            stock: Number(form.value.stock) || 0,
            status: form.value.status,
            image_url: form.value.image_url || null,
            images: form.value.images || [],
            colors: form.value.colors || [],
            specifications: Object.keys(specs).length > 0 ? specs : null
        })
        toast.success('Produk berhasil diperbarui')
        router.push('/dashboard/seller/products')
    } catch (e) {
        toast.error(e?.data?.error || 'Gagal memperbarui produk')
    } finally {
        isSubmitting.value = false
    }
}

const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.')) return
    isDeleting.value = true
    try {
        await del(`/products/${route.params.id}`)
        toast.success('Produk berhasil dihapus')
        router.push('/dashboard/seller/products')
    } catch (e) {
        toast.error('Gagal menghapus produk')
    } finally {
        isDeleting.value = false
    }
}
</script>

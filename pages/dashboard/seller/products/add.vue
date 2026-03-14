<template>
    <div class="space-y-8 pb-12">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
                    <NuxtLink to="/dashboard/seller/products" class="hover:text-primary transition-colors">Produk</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Tambah Produk</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Tambah Produk Baru</h1>
                <div class="text-gray-500 font-medium mt-1">Lengkapi informasi produk untuk ditambahkan ke marketplace.</div>
            </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Form -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Basic Information -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 class="text-xl font-bold text-navy mb-6">Informasi Dasar</h2>
                        <div class="space-y-5">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Nama Produk *</label>
                                <input v-model="form.name" type="text" required
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="Contoh: Recurve Bow Hoyt Satori 23&quot;" />
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
                                <TiptapEditor v-model="form.description" placeholder="Jelaskan produk Anda secara detail..." minHeight="200px" />
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <BaseSelect v-model="form.category" :items="categoryOptions" label="Kategori"
                                        placeholder="Pilih Kategori" required />
                                </div>
                                <div>
                                    <BaseSelect v-model="form.status" :items="statusOptions" label="Status"
                                        placeholder="Pilih Status" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pricing -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 class="text-xl font-bold text-navy mb-6">Harga & Stok</h2>
                        <div class="space-y-5">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label class="block text-sm font-bold text-gray-700 mb-2">Harga Normal *</label>
                                    <div class="relative">
                                        <span
                                            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                                        <input v-model.number="form.price" type="number" min="0" step="1000" required
                                            class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="0" />
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-bold text-gray-700 mb-2">Harga Diskon</label>
                                    <div class="relative">
                                        <span
                                            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                                        <input v-model.number="form.sale_price" type="number" min="0" step="1000"
                                            class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="0 (opsional)" />
                                    </div>
                                    <div class="text-xs text-gray-400 mt-1">Kosongkan jika tidak ada diskon</div>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Stok Tersedia</label>
                                <input v-model.number="form.stock" type="number" min="0"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="0" />
                                <div class="text-xs text-gray-400 mt-1">Kosongkan atau isi 0 untuk tidak terbatas</div>
                            </div>
                        </div>
                    </div>

                    <!-- Images -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 class="text-xl font-bold text-navy mb-6">Gambar Produk</h2>
                        <div class="space-y-5">
                            <div>
                                <div class="flex items-center justify-between gap-3 mb-2">
                                    <label class="block text-sm font-bold text-gray-700">Gambar Utama</label>
                                    <BaseButton type="button" variant="white" size="sm" icon="ph:images" @click="openMediaLibrary('primary')">
                                        Pilih dari Media Library
                                    </BaseButton>
                                </div>
                                <div class="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
                                    <img v-if="form.image_url" :src="form.image_url" alt="Primary product"
                                        class="h-40 w-full max-w-xs object-cover rounded-xl border border-gray-200" />
                                    <div v-else class="text-sm text-gray-500">Belum ada gambar utama.</div>
                                </div>
                            </div>

                            <div>
                                <div class="flex items-center justify-between gap-3 mb-2">
                                    <label class="block text-sm font-bold text-gray-700">Gambar Tambahan</label>
                                    <BaseButton type="button" variant="white" size="sm" icon="ph:images" @click="openMediaLibrary('gallery')">
                                        Tambah dari Media Library
                                    </BaseButton>
                                </div>
                            </div>

                            <div v-if="form.images && form.images.length > 0"
                                class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div v-for="(img, idx) in form.images" :key="idx" class="relative group">
                                    <img :src="img" :alt="`Image ${idx + 1}`"
                                        class="w-full aspect-square object-cover rounded-xl border border-gray-200" />
                                    <button type="button" @click="removeImage(idx)"
                                        class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Icon icon="ph:x-bold" class="text-sm" />
                                    </button>
                                </div>
                            </div>
                            <div v-else class="text-sm text-gray-500">Belum ada gambar tambahan.</div>
                        </div>
                    </div>

                    <!-- Colors -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 class="text-xl font-bold text-navy mb-2">Warna Produk</h2>
                        <div class="text-sm text-gray-500 mb-5">Tambahkan opsi warna yang tersedia untuk produk ini.</div>

                        <div class="flex flex-col sm:flex-row gap-3 mb-4">
                            <input
                                v-model="newColor"
                                type="text"
                                class="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Contoh: Hitam, Navy, Merah"
                                @keyup.enter.prevent="addColor"
                            />
                            <BaseButton type="button" variant="white" icon="ph:plus-bold" @click="addColor">
                                Tambah Warna
                            </BaseButton>
                        </div>

                        <div class="flex flex-wrap gap-2">
                            <button
                                v-for="(color, idx) in form.colors"
                                :key="`${color}-${idx}`"
                                type="button"
                                class="inline-flex items-center gap-2 rounded-full bg-primary/10 text-navy px-3 py-1.5 text-xs font-bold"
                                @click="removeColor(idx)"
                                :title="`Hapus ${color}`"
                            >
                                <span>{{ color }}</span>
                                <Icon icon="ph:x-bold" class="text-[10px]" />
                            </button>
                        </div>
                    </div>

                    <!-- Specifications -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 class="text-xl font-bold text-navy mb-6">Spesifikasi</h2>
                        <div class="space-y-4">
                            <div v-for="(spec, key) in specifications" :key="key" class="flex gap-3">
                                <input v-model="spec.key" type="text" placeholder="Nama Spesifikasi"
                                    class="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                <input v-model="spec.value" type="text" placeholder="Nilai"
                                    class="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                <button type="button" @click="removeSpecification(key)"
                                    class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <Icon icon="ph:trash-bold" />
                                </button>
                            </div>
                            <button type="button" @click="addSpecification"
                                class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                                <Icon icon="ph:plus-bold" />
                                Tambah Spesifikasi
                            </button>
                        </div>
                    </div>

                    <!-- Shipping Methods -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 class="text-xl font-bold text-navy mb-2">Metode Pengiriman</h2>
                        <div class="text-sm text-gray-500 mb-5">Tentukan metode pengiriman yang didukung seller untuk produk ini.</div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <label
                                v-for="method in shippingMethodOptions"
                                :key="method.value"
                                class="flex items-start gap-3 rounded-xl border border-gray-200 px-4 py-3 cursor-pointer hover:border-primary/40 transition-colors"
                            >
                                <input
                                    v-model="form.shipping_methods"
                                    type="checkbox"
                                    :value="method.value"
                                    class="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <div>
                                    <div class="text-sm font-bold text-navy">{{ method.title }}</div>
                                    <div class="text-xs text-gray-500">{{ method.description }}</div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 class="text-lg font-bold text-navy mb-4">Aksi</h3>
                        <div class="space-y-3">
                            <BaseButton type="submit" variant="primary" size="lg" class="w-full"
                                :loading="isSubmitting">
                                Simpan Produk
                            </BaseButton>
                            <BaseButton type="button" variant="white" size="lg" class="w-full" @click="$router.back()">
                                Batal
                            </BaseButton>
                        </div>
                        <div class="mt-6 pt-6 border-t border-gray-100">
                            <h4 class="text-sm font-bold text-gray-700 mb-3">Tips</h4>
                            <ul class="space-y-2 text-xs text-gray-500">
                                <li class="flex items-start gap-2">
                                    <Icon icon="ph:check-circle" class="text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Gunakan gambar berkualitas tinggi</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <Icon icon="ph:check-circle" class="text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Isi deskripsi yang jelas dan detail</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <Icon icon="ph:check-circle" class="text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Pastikan harga sesuai dengan pasar</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
    import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
    import MediaLibrary from '~/components/common/MediaLibrary.vue'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Tambah Produk - ArcheryHub Dashboard'
})

const router = useRouter()
const { post } = useApi()
const toast = useToast()

const isSubmitting = ref(false)
const specifications = ref([{ key: '', value: '' }])
const showMediaLibrary = ref(false)
const mediaTarget = ref('primary')
const newColor = ref('')

const categoryOptions = [
    { value: 'equipment', title: 'Peralatan' },
    { value: 'apparel', title: 'Pakaian' },
    { value: 'accessories', title: 'Aksesoris' },
    { value: 'training', title: 'Training' },
    { value: 'other', title: 'Lainnya' }
]

const statusOptions = [
    { value: 'draft', title: 'Draft' },
    { value: 'active', title: 'Aktif' },
    { value: 'sold_out', title: 'Habis' },
    { value: 'archived', title: 'Arsip' }
]

const shippingMethodOptions = [
    { value: 'regular_courier', title: 'Kurir Reguler', description: 'Pengiriman standar via JNE, J&T, SiCepat, dan sejenisnya.' },
    { value: 'instant_courier', title: 'Kurir Instan', description: 'Pengiriman cepat dalam kota melalui layanan instant/same-day.' },
    { value: 'pickup', title: 'Ambil di Toko', description: 'Pembeli mengambil produk langsung ke lokasi seller.' },
    { value: 'cargo', title: 'Kargo', description: 'Untuk produk besar atau berat dengan ongkir kargo.' }
]

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
    colors: [],
    shipping_methods: []
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

const addSpecification = () => {
    specifications.value.push({ key: '', value: '' })
}

const removeSpecification = (index) => {
    specifications.value.splice(index, 1)
    if (specifications.value.length === 0) {
        specifications.value = [{ key: '', value: '' }]
    }
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
        const payload = {
            name: form.value.name,
            description: form.value.description || null,
            price: form.value.price,
            sale_price: form.value.sale_price || null,
            category: form.value.category,
            stock: form.value.stock || 0,
            status: form.value.status,
            image_url: form.value.image_url || null,
            images: form.value.images || [],
            colors: form.value.colors || [],
            specifications: (() => {
                const specs = {}
                specifications.value.forEach(spec => {
                    if (spec.key && spec.value) {
                        specs[spec.key] = spec.value
                    }
                })
                if (form.value.shipping_methods.length > 0) {
                    specs.shipping_methods = form.value.shipping_methods
                }
                return Object.keys(specs).length > 0 ? specs : null
            })()
        }

        const response = await post('/products', payload)
        toast.success('Produk berhasil ditambahkan')
        router.push('/dashboard/seller/products')
    } catch (error) {
        console.error('Failed to create product:', error)
        toast.error(error.response?.data?.error || 'Gagal menambahkan produk')
    } finally {
        isSubmitting.value = false
    }
}
</script>

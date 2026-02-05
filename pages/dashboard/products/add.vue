<template>
    <div class="space-y-8 pb-12">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
                    <NuxtLink to="/dashboard/products" class="hover:text-primary transition-colors">Produk</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Tambah Produk</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Tambah Produk Baru</h1>
                <p class="text-gray-500 font-medium mt-1">Lengkapi informasi produk untuk ditambahkan ke marketplace.
                </p>
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
                                <textarea v-model="form.description" rows="6"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                    placeholder="Jelaskan produk Anda secara detail..."></textarea>
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
                                    <p class="text-xs text-gray-400 mt-1">Kosongkan jika tidak ada diskon</p>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Stok Tersedia</label>
                                <input v-model.number="form.stock" type="number" min="0"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="0" />
                                <p class="text-xs text-gray-400 mt-1">Kosongkan atau isi 0 untuk tidak terbatas</p>
                            </div>
                        </div>
                    </div>

                    <!-- Images -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 class="text-xl font-bold text-navy mb-6">Gambar Produk</h2>
                        <div class="space-y-5">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Gambar Utama (URL)</label>
                                <input v-model="form.image_url" type="url"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="https://example.com/image.jpg" />
                                <p class="text-xs text-gray-400 mt-1">URL gambar utama produk</p>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Gambar Tambahan (URL, satu per
                                    baris)</label>
                                <textarea v-model="additionalImagesText" rows="4"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"></textarea>
                                <p class="text-xs text-gray-400 mt-1">Masukkan URL gambar tambahan, satu URL per baris
                                </p>
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
                </div>

                <!-- Sidebar -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
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
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Tambah Produk - ArcheryHub Dashboard'
})

const router = useRouter()
const { post } = useApi()
const toast = useToast()
const { user } = useAuth()

const isSubmitting = ref(false)
const additionalImagesText = ref('')
const specifications = ref([{ key: '', value: '' }])

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

const form = ref({
    name: '',
    description: '',
    price: 0,
    sale_price: null,
    category: '',
    stock: 0,
    status: 'draft',
    image_url: '',
    images: []
})

// Watch additional images text and update form.images
watch(additionalImagesText, (newVal) => {
    if (newVal) {
        form.value.images = newVal.split('\n').filter(url => url.trim() !== '')
    } else {
        form.value.images = []
    }
})

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
    additionalImagesText.value = form.value.images.join('\n')
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
            specifications: (() => {
                const specs = {}
                specifications.value.forEach(spec => {
                    if (spec.key && spec.value) {
                        specs[spec.key] = spec.value
                    }
                })
                return Object.keys(specs).length > 0 ? specs : null
            })()
        }

        const response = await post('/products', payload)
        toast.success('Produk berhasil ditambahkan')
        router.push('/dashboard/products')
    } catch (error) {
        console.error('Failed to create product:', error)
        toast.error(error.response?.data?.error || 'Gagal menambahkan produk')
    } finally {
        isSubmitting.value = false
    }
}
</script>

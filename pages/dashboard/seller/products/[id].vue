<template>
    <div class="space-y-8 pb-12">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
                    <NuxtLink to="/dashboard/seller/products" class="hover:text-primary transition-colors">Produk
                    </NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Edit Produk</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Edit Produk</h1>
                <p class="text-gray-500 font-medium mt-1">Perbarui informasi produk Anda di marketplace.</p>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingProduct" class="flex items-center justify-center py-24">
            <div class="flex flex-col items-center gap-4">
                <LoadingSpinner size="xl" />
                <p class="text-gray-400 font-medium">Memuat data produk...</p>
            </div>
        </div>

        <!-- Not Found -->
        <div v-else-if="notFound" class="flex flex-col items-center justify-center py-24">
            <Icon icon="ph:package-x" class="text-6xl text-gray-200 mb-4" />
            <h3 class="text-xl font-black text-navy mb-2">Produk Tidak Ditemukan</h3>
            <p class="text-gray-400 font-medium mb-6">Produk yang ingin Anda edit tidak ditemukan.</p>
            <NuxtLink to="/dashboard/seller/products">
                <BaseButton variant="primary" icon="ph:arrow-left">Kembali ke Daftar Produk</BaseButton>
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
                            Informasi Dasar
                        </h2>
                        <div class="space-y-5">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Nama Produk *</label>
                                <input v-model="form.name" type="text" required
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder='Contoh: Recurve Bow Hoyt Satori 23"' />
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
                        <h2 class="text-xl font-bold text-navy mb-6 flex items-center gap-2">
                            <Icon icon="ph:money" class="text-primary" />
                            Harga & Stok
                        </h2>
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
                            </div>
                        </div>
                    </div>

                    <!-- Images -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 class="text-xl font-bold text-navy mb-6 flex items-center gap-2">
                            <Icon icon="ph:image" class="text-primary" />
                            Gambar Produk
                        </h2>
                        <div class="space-y-5">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Gambar Utama (URL)</label>
                                <input v-model="form.image_url" type="url"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="https://example.com/image.jpg" />
                                <div v-if="form.image_url" class="mt-3">
                                    <img :src="form.image_url" alt="Preview"
                                        class="h-32 w-32 object-cover rounded-xl border border-gray-200" />
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Gambar Tambahan (URL, satu per
                                    baris)</label>
                                <textarea v-model="additionalImagesText" rows="4"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Specifications -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 class="text-xl font-bold text-navy mb-6 flex items-center gap-2">
                            <Icon icon="ph:list-bullets" class="text-primary" />
                            Spesifikasi
                        </h2>
                        <div class="space-y-4">
                            <div v-for="(spec, idx) in specifications" :key="idx" class="flex gap-3">
                                <input v-model="spec.key" type="text" placeholder="Nama Spesifikasi"
                                    class="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                <input v-model="spec.value" type="text" placeholder="Nilai"
                                    class="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                <button type="button" @click="specifications.splice(idx, 1)"
                                    class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <Icon icon="ph:trash-bold" />
                                </button>
                            </div>
                            <button type="button" @click="specifications.push({ key: '', value: '' })"
                                class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                                <Icon icon="ph:plus-bold" />
                                Tambah Spesifikasi
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24 space-y-4">
                        <h3 class="text-lg font-bold text-navy">Aksi</h3>
                        <BaseButton type="submit" variant="primary" size="lg" class="w-full" :loading="isSubmitting">
                            <Icon icon="ph:floppy-disk-bold" class="mr-2" />
                            Simpan Perubahan
                        </BaseButton>
                        <NuxtLink to="/dashboard/seller/products" class="block">
                            <BaseButton type="button" variant="white" size="lg" class="w-full">Batal</BaseButton>
                        </NuxtLink>

                        <!-- Danger Zone -->
                        <div class="mt-4 pt-4 border-t border-gray-100">
                            <h4 class="text-sm font-bold text-red-500 mb-3">Zona Berbahaya</h4>
                            <BaseButton type="button" variant="white" size="sm"
                                class="w-full border-red-100 text-red-500 hover:bg-red-50" icon="ph:trash"
                                :loading="isDeleting" @click="handleDelete">
                                Hapus Produk Ini
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Edit Produk - ArcheryHub Dashboard' })

const route = useRoute()
const router = useRouter()
const { get, put, delete: del } = useApi()
const toast = useToast()

const isLoadingProduct = ref(true)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const notFound = ref(false)
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

watch(additionalImagesText, (val) => {
    form.value.images = val ? val.split('\n').filter(u => u.trim()) : []
})

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
        additionalImagesText.value = imgs.join('\n')

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

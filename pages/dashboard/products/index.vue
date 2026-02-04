<template>
    <div class="flex flex-col gap-8">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div class="mb-2">
                    <Breadcrumbs :current="'Manajemen Produk'" />
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Manajemen Produk</h1>
                <p class="text-gray-500 font-medium mt-1">Kelola katalog produk yang Anda jual di marketplace.</p>
            </div>
            <BaseButton variant="primary" icon="ph:plus-bold"
                class="shadow-lg shadow-primary/20 h-10 md:h-11 px-4 md:px-6" @click="openCreateModal">
                <span class="hidden sm:inline">Tambah Produk</span>
                <span class="sm:hidden">Tambah</span>
            </BaseButton>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
                class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:package" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Produk</p>
                    <p class="text-lg font-bold text-navy">{{ products.length }}</p>
                </div>
            </div>
            <div
                class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:check-circle" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Aktif</p>
                    <p class="text-lg font-bold text-navy">{{products.filter(p => p.status === 'active').length}}</p>
                </div>
            </div>
            <div
                class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:eye" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Total View</p>
                    <p class="text-lg font-bold text-navy">{{products.reduce((acc, p) => acc + p.views,
                        0).toLocaleString()}}</p>
                </div>
            </div>
            <div
                class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:shopping-cart" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Terjual</p>
                    <p class="text-lg font-bold text-navy">{{products.reduce((acc, p) => acc + p.sold, 0)}}</p>
                </div>
            </div>
        </div>

        <!-- Search & Filter -->
        <div
            class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-grow w-full">
                <BaseInput v-model="searchQuery" icon="ph:magnifying-glass" placeholder="Cari nama produk..."
                    label="Pencarian" />
            </div>
            <div class="w-full md:w-48">
                <BaseSelect v-model="statusFilter" :items="statusOptions" label="Status" />
            </div>
            <div class="w-full md:w-48">
                <BaseSelect v-model="categoryFilter" :items="categoryOptions" label="Kategori" />
            </div>
            <BaseButton variant="white" icon="ph:funnel" @click="resetFilters" class="h-11">
                Reset
            </BaseButton>
        </div>

        <!-- Products Table -->
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr class="bg-gray-50/50 border-b border-gray-100">
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                                Produk</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                                Kategori</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                                Harga</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                                Stok</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                                Status</th>
                            <th
                                class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-right">
                                Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <!-- Loading State -->
                        <tr v-if="isLoading">
                            <td colspan="6" class="px-6 py-12 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <LoadingSpinner size="lg" />
                                    <p class="text-sm text-gray-400 font-medium">Memuat data produk...</p>
                                </div>
                            </td>
                        </tr>
                        <tr v-for="product in filteredProducts" :key="product.id"
                            class="hover:bg-primary/5 transition-colors group">
                            <!-- Product Info -->
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-4">
                                    <div class="h-14 w-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                        <img :src="product.image" class="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p class="font-bold text-navy group-hover:text-primary transition-colors">{{
                                            product.name }}</p>
                                        <div class="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                            <span class="flex items-center gap-1">
                                                <Icon icon="ph:eye" />
                                                {{ product.views }} views
                                            </span>
                                            <span class="flex items-center gap-1">
                                                <Icon icon="ph:shopping-cart" />
                                                {{ product.sold }} terjual
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <!-- Category -->
                            <td class="px-6 py-4">
                                <span :class="[
                                    'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                                    product.category === 'equipment' ? 'bg-blue-50 text-blue-600' :
                                        product.category === 'apparel' ? 'bg-purple-50 text-purple-600' :
                                            product.category === 'accessories' ? 'bg-amber-50 text-amber-600' :
                                                'bg-gray-100 text-gray-600'
                                ]">
                                    {{ getCategoryLabel(product.category) }}
                                </span>
                            </td>

                            <!-- Price -->
                            <td class="px-6 py-4">
                                <div>
                                    <p class="font-bold text-navy">Rp {{ formatPrice(product.price) }}</p>
                                    <p v-if="product.salePrice" class="text-xs text-red-500 line-through">
                                        Rp {{ formatPrice(product.salePrice) }}
                                    </p>
                                </div>
                            </td>

                            <!-- Stock -->
                            <td class="px-6 py-4">
                                <span :class="[
                                    'font-bold',
                                    product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'
                                ]">
                                    {{ product.stock }}
                                </span>
                            </td>

                            <!-- Status -->
                            <td class="px-6 py-4">
                                <span :class="[
                                    'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                                    product.status === 'active' ? 'bg-green-50 text-green-600' :
                                        product.status === 'draft' ? 'bg-gray-100 text-gray-500' :
                                            product.status === 'sold_out' ? 'bg-red-50 text-red-600' :
                                                'bg-gray-100 text-gray-500'
                                ]">
                                    {{ getStatusLabel(product.status) }}
                                </span>
                            </td>

                            <!-- Actions -->
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button @click="editProduct(product)"
                                        class="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                        <Icon icon="ph:pencil-simple" class="text-lg" />
                                    </button>
                                    <button @click="deleteProduct(product)"
                                        class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <Icon icon="ph:trash" class="text-lg" />
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <!-- Empty State -->
                        <tr v-if="!isLoading && filteredProducts.length === 0">
                            <td colspan="6" class="px-6 py-24 text-center">
                                <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                    <div
                                        class="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                                        <Icon icon="ph:package" class="text-4xl" />
                                    </div>
                                    <div class="space-y-1">
                                        <p class="text-lg font-bold text-navy">Belum Ada Produk</p>
                                        <p class="text-sm text-gray-500 font-medium leading-relaxed">
                                            Tambahkan produk pertama Anda untuk mulai berjualan di marketplace.
                                        </p>
                                    </div>
                                    <BaseButton variant="primary" icon="ph:plus-bold" @click="openCreateModal">
                                        Tambah Produk Pertama
                                    </BaseButton>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <div v-if="showCreateModal"
            class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm">
            <div
                class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                <!-- Modal Header -->
                <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h2 class="text-xl font-extrabold text-navy tracking-tight">
                            {{ isEditing ? 'Edit Produk' : 'Tambah Produk Baru' }}
                        </h2>
                        <p class="text-sm text-gray-500 font-medium mt-1">Lengkapi informasi detail produk di bawah
                            ini.</p>
                    </div>
                    <button @click="showCreateModal = false"
                        class="p-2 hover:bg-white rounded-xl transition-colors shadow-sm">
                        <Icon icon="ph:x-bold" class="text-xl text-gray-400" />
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-8 overflow-y-auto flex-grow space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BaseInput v-model="productForm.name" label="Nama Produk" placeholder="Contoh: Recurve Bow"
                            required />
                        <BaseSelect v-model="productForm.category"
                            :items="categoryOptions.filter(o => o.value !== 'all')" label="Kategori" required />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BaseInput v-model="productForm.price" type="number" label="Harga (Rp)" placeholder="0"
                            required />
                        <BaseInput v-model="productForm.salePrice" type="number" label="Harga Diskon (Rp) - Opsional"
                            placeholder="0" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BaseInput v-model="productForm.stock" type="number" label="Stok" placeholder="0" required />
                        <BaseSelect v-model="productForm.status" :items="statusOptions.filter(o => o.value !== 'all')"
                            label="Status" required />
                    </div>

                    <BaseInput v-model="productForm.image_url" label="URL Gambar Utama" placeholder="https://..." />

                    <BaseTextarea v-model="productForm.description" label="Deskripsi Produk"
                        placeholder="Jelaskan detail produk Anda..." rows="4" />
                </div>

                <!-- Modal Footer -->
                <div class="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
                    <BaseButton variant="white" @click="showCreateModal = false">Batal</BaseButton>
                    <BaseButton variant="primary" :loading="isSubmitting" @click="handleSubmit">
                        {{ isEditing ? 'Simpan Perubahan' : 'Tambah Produk' }}
                    </BaseButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'

definePageMeta({
    title: 'Marketplace',
    layout: 'dashboard'
})

useHead({
    title: 'Manajemen Produk - ArcheryHub Dashboard'
})

const { get, post, put, delete: del } = useApi()
const toast = useToast()

const products = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')
const showCreateModal = ref(false)
const isSubmitting = ref(false)

const productForm = ref({
    name: '',
    description: '',
    price: 0,
    sale_price: 0,
    category: 'other',
    stock: 0,
    status: 'draft',
    image_url: ''
})

const isEditing = ref(false)
const currentProductId = ref(null)

const fetchProducts = async () => {
    isLoading.value = true
    try {
        const response = await get('/products/my')
        products.value = (response.data || []).map(p => ({
            ...p,
            id: p.id || p.uuid,
            salePrice: p.sale_price,
            image: useImageOrDefault(p.image_url),
            sold: p.sold || 0 // Assuming 'sold' is handled by backend or aggregation
        }))
    } catch (error) {
        toast.error('Gagal mengambil data produk')
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchProducts()
})

const filteredProducts = computed(() => {
    return products.value.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesStatus = statusFilter.value === 'all' || product.status === statusFilter.value
        const matchesCategory = categoryFilter.value === 'all' || product.category === categoryFilter.value
        return matchesSearch && matchesStatus && matchesCategory
    })
})

const resetFilters = () => {
    searchQuery.value = ''
    statusFilter.value = 'all'
    categoryFilter.value = 'all'
}

const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price)
}

const getCategoryLabel = (cat) => {
    const labels = { equipment: 'Peralatan', apparel: 'Pakaian', accessories: 'Aksesoris', training: 'Training', other: 'Lainnya' }
    return labels[cat] || cat
}

const getStatusLabel = (status) => {
    const labels = { active: 'Aktif', draft: 'Draft', sold_out: 'Habis', archived: 'Arsip' }
    return labels[status] || status
}

const openCreateModal = () => {
    isEditing.value = false
    currentProductId.value = null
    productForm.value = {
        name: '',
        description: '',
        price: 0,
        sale_price: 0,
        category: 'other',
        stock: 0,
        status: 'draft',
        image_url: ''
    }
    showCreateModal.value = true
}

const editProduct = (product) => {
    isEditing.value = true
    currentProductId.value = product.id
    productForm.value = {
        name: product.name,
        description: product.description || '',
        price: product.price,
        sale_price: product.salePrice || 0,
        category: product.category,
        stock: product.stock,
        status: product.status,
        image_url: product.image_url || ''
    }
    showCreateModal.value = true
}

const handleSubmit = async () => {
    if (!productForm.value.name || !productForm.value.price) {
        toast.warning('Nama dan harga harus diisi')
        return
    }

    isSubmitting.value = true
    try {
        const payload = {
            ...productForm.value,
            price: Number(productForm.value.price),
            sale_price: productForm.value.sale_price ? Number(productForm.value.sale_price) : null,
            stock: Number(productForm.value.stock)
        }

        if (isEditing.value) {
            await put(`/products/${currentProductId.value}`, payload)
            toast.success('Produk berhasil diperbarui')
        } else {
            await post('/products', payload)
            toast.success('Produk berhasil ditambahkan')
        }
        showCreateModal.value = false
        fetchProducts()
    } catch (error) {
        toast.error('Gagal menyimpan produk')
    } finally {
        isSubmitting.value = false
    }
}

const deleteProduct = async (product) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`)) return

    try {
        await del(`/products/${product.id}`)
        toast.success('Produk berhasil dihapus')
        fetchProducts()
    } catch (error) {
        toast.error('Gagal menghapus produk')
    }
}
</script>

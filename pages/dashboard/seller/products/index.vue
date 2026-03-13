<template>
    <div class="flex flex-col gap-8">
        <!-- Enhanced Header -->
        <div
            class="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm mb-2">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>

            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-5">
                    <div
                        class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                        <Icon icon="ph:package-bold" class="text-primary text-2xl sm:text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-2xl font-black tracking-tight leading-none uppercase">Manajemen Produk</h1>
                        <p class="text-slate-300 text-[10px] sm:text-xs font-bold mt-1 tracking-wider uppercase">Kelola katalog produk yang Anda jual</p>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <BaseButton variant="primary" icon="ph:plus-bold"
                        class="w-full sm:w-auto h-11 px-6 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px] !rounded-xl"
                        to="/dashboard/seller/products/add">
                        Tambah Produk
                    </BaseButton>
                </div>
            </div>
        </div>
        
        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:package-bold" class="text-xl" />
                </div>
                <div>
                    <p class="text-[9px] text-gray-400 font-black tracking-widest uppercase">Total Produk</p>
                    <p class="text-lg font-black text-navy">{{ products.length }}</p>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div class="bg-gray-50 p-2 rounded-lg text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                    <Icon icon="ph:check-circle-bold" class="text-xl" />
                </div>
                <div>
                    <p class="text-[9px] text-gray-400 font-black tracking-widest uppercase">Produk Aktif</p>
                    <p class="text-lg font-black text-navy">{{ products.filter(p => p.status === 'active').length }}</p>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div class="bg-gray-50 p-2 rounded-lg text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <Icon icon="ph:warning-circle-bold" class="text-xl" />
                </div>
                <div>
                    <p class="text-[9px] text-gray-400 font-black tracking-widest uppercase">Stok Tipis</p>
                    <p class="text-lg font-black text-navy">{{ products.filter(p => p.stock < 10).length }}</p>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div class="bg-gray-50 p-2 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Icon icon="ph:eye-bold" class="text-xl" />
                </div>
                <div>
                    <p class="text-[9px] text-gray-400 font-black tracking-widest uppercase">Total Views</p>
                    <p class="text-lg font-black text-navy">{{ products.reduce((acc, p) => acc + (p.views || 0), 0).toLocaleString('id-ID') }}</p>
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
                <BaseSelect v-model="statusFilter" :items="statusOptions" label="Status" item-title="title" />
            </div>
            <div class="w-full md:w-48">
                <BaseSelect v-model="categoryFilter" :items="categoryOptions" label="Kategori" item-title="title" />
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
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400  tracking-widest">
                                Produk</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400  tracking-widest">
                                Kategori</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400  tracking-widest">
                                Harga</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400  tracking-widest">
                                Stok</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400  tracking-widest">
                                Status</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400  tracking-widest text-right">
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
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <!-- Category -->
                            <td class="px-6 py-4">
                                <span class="text-xs font-bold text-navy tracking-tight">
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
                                <span class="font-bold text-black">
                                    {{ product.stock }}
                                </span>
                            </td>

                            <!-- Status -->
                            <td class="px-6 py-4">
                                <span :class="[
                                    'px-3 py-1 rounded-full text-xs font-bold  tracking-wider',
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
                                    <BaseButton variant="white" size="sm" icon="ph:pencil-simple"
                                        class="h-9 w-9 p-0 text-gray-400 hover:text-primary border-slate-200"
                                        :to="`/dashboard/seller/products/${product.id}`" />
                                    <BaseButton @click="deleteProduct(product)" variant="white" size="sm"
                                        icon="ph:trash"
                                        class="h-9 w-9 p-0 text-red-500 hover:text-red-600 border-slate-200" />
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
                                    <BaseButton variant="primary" icon="ph:plus-bold"
                                        to="/dashboard/seller/products/add">
                                        Tambah Produk Pertama
                                    </BaseButton>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <AppDialog 
            v-model:show="deleteModal.show"
            title="Hapus Produk?"
            :message="`Produk '${deleteModal.productName}' akan dihapus permanen dari katalog Anda.`"
            confirm-text="Ya, Hapus"
            cancel-text="Batal"
            type="danger"
            @confirm="handleConfirmDelete"
        />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
    title: 'Marketplace',
    layout: 'dashboard'
})

useHead({
    title: 'Manajemen Produk - ArcheryHub Dashboard'
})

const { get, delete: del } = useApi()
const router = useRouter()
const toast = useToast()

const products = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')

const deleteModal = ref({
    show: false,
    id: null,
    productName: ''
})

const statusOptions = [
    { title: 'Semua Status', value: 'all' },
    { title: 'Aktif', value: 'active' },
    { title: 'Draft', value: 'draft' },
    { title: 'Habis', value: 'sold_out' }
]

const categoryOptions = [
    { title: 'Semua Kategori', value: 'all' },
    { title: 'Peralatan', value: 'equipment' },
    { title: 'Pakaian', value: 'apparel' },
    { title: 'Aksesoris', value: 'accessories' }
]

const fetchProducts = async () => {
    isLoading.value = true
    try {
        const response = await get('/products/my', {
            status: statusFilter.value,
            category: categoryFilter.value
        })
        products.value = (response.data || []).map(p => ({
            ...p,
            id: p.id || p.uuid,
            salePrice: p.sale_price,
            image: useImageOrDefault(p.image_url),
            sold: p.sold || 0
        }))
    } catch (error) {
        toast.error('Gagal mengambil data produk')
    } finally {
        isLoading.value = false
    }
}

watch([statusFilter, categoryFilter], () => {
    fetchProducts()
})

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

const openCreateModal = () => router.push('/dashboard/seller/products/add')
const editProduct = (product) => router.push(`/dashboard/seller/products/${product.id}`)

const deleteProduct = (product) => {
    deleteModal.value = {
        show: true,
        id: product.id,
        productName: product.name
    }
}

const handleConfirmDelete = async () => {
    try {
        await del(`/products/${deleteModal.value.id}`)
        toast.success('Produk berhasil dihapus')
        fetchProducts()
    } catch (error) {
        toast.error('Gagal menghapus produk')
    }
}
</script>

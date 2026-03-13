<template>
    <div class="flex flex-col gap-8">
        <!-- Enhanced Header -->
        <div
            class="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm mb-2">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>

            <div class="relative p-5 sm:p-8">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div class="flex items-center sm:items-start gap-4 flex-1">
                        <!-- Icon Badge -->
                        <div
                            class="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
                            <Icon icon="ph:package-bold" class="text-primary text-xl sm:text-2xl" />
                        </div>

                        <!-- Title Section -->
                        <div class="min-w-0">
                            <h1
                                class="text-xl sm:text-3xl font-black leading-tight tracking-tight mb-1 sm:mb-2 truncate">
                                Manajemen Produk
                            </h1>
                            <p class="text-slate-300 text-xs sm:text-sm max-w-2xl line-clamp-1 sm:line-clamp-none">
                                Kelola katalog produk yang Anda jual di marketplace
                            </p>
                        </div>
                    </div>

                    <!-- Action Button -->
                    <div class="flex flex-col sm:flex-row gap-3">
                        <BaseButton variant="primary" icon="ph:plus-bold"
                            class="w-full sm:w-auto h-10 sm:h-11 px-6 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px] sm:text-xs"
                            to="/dashboard/seller/products/add">
                            Tambah Produk
                        </BaseButton>
                    </div>
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
                                <span :class="[
                                    'px-3 py-1 rounded-full text-xs font-bold  tracking-wider',
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

        <!-- removed modal: edit/add now use dedicated pages -->
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

const statusOptions = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Aktif', value: 'active' },
    { label: 'Draft', value: 'draft' },
    { label: 'Habis', value: 'sold_out' }
]

const categoryOptions = [
    { label: 'Semua Kategori', value: 'all' },
    { label: 'Peralatan', value: 'equipment' },
    { label: 'Pakaian', value: 'apparel' },
    { label: 'Aksesoris', value: 'accessories' }
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

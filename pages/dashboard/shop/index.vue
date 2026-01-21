<template>
    <div class="flex flex-col gap-8">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight uppercase">
                    <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Marketplace</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Manajemen Produk</h1>
                <p class="text-gray-500 font-medium mt-1">Kelola katalog produk yang Anda jual di marketplace.</p>
            </div>
            <BaseButton variant="primary" icon="ph:plus-bold" class="shadow-lg shadow-primary/20"
                @click="showCreateModal = true">
                Tambah Produk
            </BaseButton>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-10 w-10 rounded-lg bg-primary/10 text-primary-dark flex items-center justify-center">
                    <Icon icon="ph:package" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Produk</p>
                    <p class="text-lg font-bold text-navy">{{ products.length }}</p>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-10 w-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                    <Icon icon="ph:check-circle" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Aktif</p>
                    <p class="text-lg font-bold text-navy">{{products.filter(p => p.status === 'active').length}}</p>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon icon="ph:eye" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Total View</p>
                    <p class="text-lg font-bold text-navy">{{products.reduce((acc, p) => acc + p.views,
                        0).toLocaleString()}}</p>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
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
                        <tr v-if="filteredProducts.length === 0">
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
                                    <BaseButton variant="primary" icon="ph:plus-bold" @click="showCreateModal = true">
                                        Tambah Produk Pertama
                                    </BaseButton>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
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

const searchQuery = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')
const showCreateModal = ref(false)

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
    { title: 'Aksesoris', value: 'accessories' },
    { title: 'Training', value: 'training' }
]

// Dummy data
const products = ref([
    {
        id: 1,
        name: 'Recurve Bow Hoyt Satori 23"',
        price: 15500000,
        salePrice: null,
        image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400',
        category: 'equipment',
        stock: 5,
        status: 'active',
        views: 234,
        sold: 12
    },
    {
        id: 2,
        name: 'Carbon Arrow Easton X10 (12pcs)',
        price: 4800000,
        salePrice: null,
        image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=400',
        category: 'accessories',
        stock: 23,
        status: 'active',
        views: 456,
        sold: 45
    },
    {
        id: 3,
        name: 'Jersey Klub Edisi 2024',
        price: 350000,
        salePrice: null,
        image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=400',
        category: 'apparel',
        stock: 0,
        status: 'sold_out',
        views: 123,
        sold: 89
    },
    {
        id: 4,
        name: 'Target Face WA 40cm (10pcs)',
        price: 150000,
        salePrice: null,
        image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=400',
        category: 'training',
        stock: 50,
        status: 'active',
        views: 89,
        sold: 234
    }
])

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
    const labels = { equipment: 'Peralatan', apparel: 'Pakaian', accessories: 'Aksesoris', training: 'Training' }
    return labels[cat] || cat
}

const getStatusLabel = (status) => {
    const labels = { active: 'Aktif', draft: 'Draft', sold_out: 'Habis' }
    return labels[status] || status
}

const editProduct = (product) => {
    console.log('Edit:', product)
}

const deleteProduct = (product) => {
    console.log('Delete:', product)
}
</script>

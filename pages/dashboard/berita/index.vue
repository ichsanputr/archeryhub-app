<template>
    <div class="flex flex-col gap-8">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight uppercase">
                    <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Berita</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Manajemen Berita</h1>
                <p class="text-gray-500 font-medium mt-1">Kelola berita dan pengumuman organisasi Anda.</p>
            </div>
            <NuxtLink to="/dashboard/berita/create">
                <BaseButton variant="primary" icon="ph:plus-bold" class="shadow-lg shadow-primary/20">
                    Buat Berita Baru
                </BaseButton>
            </NuxtLink>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-10 w-10 rounded-lg bg-primary/10 text-primary-dark flex items-center justify-center">
                    <Icon icon="ph:newspaper" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Berita</p>
                    <p class="text-lg font-bold text-navy">{{ news.length }}</p>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-10 w-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                    <Icon icon="ph:check-circle" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Dipublikasi</p>
                    <p class="text-lg font-bold text-navy">{{news.filter(n => n.status === 'published').length}}</p>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Icon icon="ph:file-text" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Draft</p>
                    <p class="text-lg font-bold text-navy">{{news.filter(n => n.status === 'draft').length}}</p>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon icon="ph:eye" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Total View</p>
                    <p class="text-lg font-bold text-navy">{{news.reduce((acc, n) => acc + n.views, 0).toLocaleString()
                        }}</p>
                </div>
            </div>
        </div>

        <!-- Search & Filter -->
        <div
            class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-grow w-full">
                <BaseInput v-model="searchQuery" icon="ph:magnifying-glass" placeholder="Cari judul berita..."
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

        <!-- News Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="item in filteredNews" :key="item.id"
                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all group">

                <!-- Featured Image -->
                <div class="relative h-48 bg-gradient-to-br from-navy to-blue-800 overflow-hidden">
                    <img v-if="item.image" :src="item.image"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div v-else class="w-full h-full flex items-center justify-center">
                        <Icon icon="ph:newspaper" class="text-6xl text-white/20" />
                    </div>

                    <!-- Category Badge -->
                    <div class="absolute top-4 left-4">
                        <span :class="[
                            'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm',
                            item.category === 'Event' ? 'bg-blue-500/90 text-white' :
                                item.category === 'Pengumuman' ? 'bg-amber-500/90 text-white' :
                                    item.category === 'Prestasi' ? 'bg-green-500/90 text-white' :
                                        'bg-gray-500/90 text-white'
                        ]">
                            {{ item.category }}
                        </span>
                    </div>

                    <!-- Status Badge -->
                    <div class="absolute top-4 right-4">
                        <span :class="[
                            'px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                            item.status === 'published' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                        ]">
                            {{ item.status === 'published' ? 'Live' : 'Draft' }}
                        </span>
                    </div>
                </div>

                <!-- Content -->
                <div class="p-6">
                    <h3
                        class="font-bold text-navy text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {{ item.title }}
                    </h3>
                    <p class="text-gray-500 text-sm line-clamp-2 mb-4">{{ item.excerpt }}</p>

                    <!-- Meta Info -->
                    <div class="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center gap-1">
                                <Icon icon="ph:calendar" />
                                <span>{{ item.date }}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <Icon icon="ph:eye" />
                                <span>{{ item.views.toLocaleString() }}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-1">
                            <Icon icon="ph:user" />
                            <span>{{ item.author }}</span>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex gap-2">
                    <NuxtLink :to="`/dashboard/berita/${item.id}`" class="flex-1">
                        <BaseButton variant="white" size="sm" icon="ph:eye" block>
                            Lihat
                        </BaseButton>
                    </NuxtLink>
                    <NuxtLink :to="`/dashboard/berita/${item.id}/edit`" class="flex-1">
                        <BaseButton variant="outline" size="sm" icon="ph:pencil-simple" block>
                            Edit
                        </BaseButton>
                    </NuxtLink>
                    <button @click="deleteNews(item)"
                        class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Icon icon="ph:trash" class="text-lg" />
                    </button>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredNews.length === 0" class="col-span-full">
                <div class="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <div
                        class="h-20 w-20 mx-auto bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-6">
                        <Icon icon="ph:newspaper" class="text-5xl" />
                    </div>
                    <h3 class="text-xl font-bold text-navy mb-2">Belum Ada Berita</h3>
                    <p class="text-gray-500 mb-6 max-w-sm mx-auto">Buat berita pertama Anda untuk berbagi informasi
                        dengan pemanah dan peserta event.</p>
                    <NuxtLink to="/dashboard/berita/create">
                        <BaseButton variant="primary" icon="ph:plus-bold">
                            Buat Berita Pertama
                        </BaseButton>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'

definePageMeta({
    title: 'Berita',
    layout: 'dashboard'
})

const searchQuery = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')

const statusOptions = [
    { title: 'Semua Status', value: 'all' },
    { title: 'Dipublikasi', value: 'published' },
    { title: 'Draft', value: 'draft' }
]

const categoryOptions = [
    { title: 'Semua Kategori', value: 'all' },
    { title: 'Event', value: 'Event' },
    { title: 'Pengumuman', value: 'Pengumuman' },
    { title: 'Prestasi', value: 'Prestasi' },
    { title: 'Lainnya', value: 'Lainnya' }
]

// Dummy data
const news = ref([
    {
        id: 1,
        title: 'Kejuaraan Nasional Panahan 2024 Resmi Dibuka',
        excerpt: 'Kejuaraan nasional panahan tahun 2024 resmi dibuka dengan diikuti oleh lebih dari 500 atlet dari seluruh Indonesia.',
        category: 'Event',
        status: 'published',
        date: '20 Jan 2024',
        author: 'Admin',
        views: 1234,
        image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800'
    },
    {
        id: 2,
        title: 'Pendaftaran Piala Gubernur 2024 Dibuka',
        excerpt: 'Pendaftaran untuk Piala Gubernur Panahan 2024 telah dibuka. Segera daftarkan tim Anda sebelum kuota habis.',
        category: 'Pengumuman',
        status: 'published',
        date: '18 Jan 2024',
        author: 'Admin',
        views: 856,
        image: 'https://images.unsplash.com/photo-1510925758641-869d353cecc7?w=800'
    },
    {
        id: 3,
        title: 'Tim Garuda Raih Emas di Asian Games',
        excerpt: 'Tim panahan Indonesia meraih medali emas dalam kategori beregu recurve di Asian Games 2023.',
        category: 'Prestasi',
        status: 'published',
        date: '15 Jan 2024',
        author: 'Redaksi',
        views: 2345,
        image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=800'
    },
    {
        id: 4,
        title: 'Perubahan Jadwal Latihan Regional',
        excerpt: 'Informasi perubahan jadwal latihan untuk wilayah Jawa Barat dan DKI Jakarta.',
        category: 'Pengumuman',
        status: 'draft',
        date: '14 Jan 2024',
        author: 'Admin',
        views: 0,
        image: null
    },
    {
        id: 5,
        title: 'Workshop Teknik Dasar Panahan untuk Pemula',
        excerpt: 'Workshop teknik dasar panahan akan diadakan pada tanggal 25 Januari 2024 di GOR Senayan.',
        category: 'Event',
        status: 'published',
        date: '12 Jan 2024',
        author: 'Panitia',
        views: 567,
        image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800'
    },
    {
        id: 6,
        title: 'Pengumuman Hasil Seleksi Timnas Junior',
        excerpt: 'Daftar nama-nama atlet yang lolos seleksi timnas junior panahan Indonesia tahun 2024.',
        category: 'Pengumuman',
        status: 'draft',
        date: '10 Jan 2024',
        author: 'Komite',
        views: 0,
        image: null
    }
])

const filteredNews = computed(() => {
    return news.value.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesStatus = statusFilter.value === 'all' || item.status === statusFilter.value
        const matchesCategory = categoryFilter.value === 'all' || item.category === categoryFilter.value
        return matchesSearch && matchesStatus && matchesCategory
    })
})

const resetFilters = () => {
    searchQuery.value = ''
    statusFilter.value = 'all'
    categoryFilter.value = 'all'
}

const deleteNews = (item) => {
    console.log('Delete news:', item)
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

<template>
    <div class="flex flex-col gap-8">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
                    <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Berita</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Manajemen Berita</h1>
                <p class="text-gray-500 font-medium mt-1">Kelola berita dan pengumuman organisasi Anda.</p>
            </div>
            <NuxtLink to="/dashboard/news/create">
                <BaseButton variant="primary" icon="ph:plus-bold" class="shadow-md shadow-primary/20">
                    Buat Berita Baru
                </BaseButton>
            </NuxtLink>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
                class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:newspaper" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold  tracking-wider">Total Berita</p>
                    <p class="text-lg font-bold text-navy">{{ news.length }}</p>
                </div>
            </div>
            <div
                class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:check-circle" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold  tracking-wider">Dipublikasi</p>
                    <p class="text-lg font-bold text-navy">{{news.filter(n => n.status === 'published').length}}</p>
                </div>
            </div>
            <div
                class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:file-text" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold  tracking-wider">Draft</p>
                    <p class="text-lg font-bold text-navy">{{news.filter(n => n.status === 'draft').length}}</p>
                </div>
            </div>
            <div
                class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:eye" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold  tracking-wider">Total View</p>
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
                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-primary/30 transition-all group">

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
                            'px-3 py-1 rounded-full text-xs font-bold  tracking-wider backdrop-blur-sm',
                            item.category === 'Event' ? 'bg-blue-500/90 text-white' :
                                item.category === 'Pengumuman' ? 'bg-amber-500/90 text-white' :
                                    item.category === 'Prestasi' ? 'bg-green-500/90 text-white' :
                                        'bg-gray-500/90 text-white'
                        ]">
                            {{ item.category }}
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
                    <NuxtLink :to="`/dashboard/news/${item.slug}`" class="flex-1">
                        <BaseButton variant="white" size="sm" icon="ph:eye" block>
                            Lihat
                        </BaseButton>
                    </NuxtLink>
                    <NuxtLink :to="`/dashboard/news/${item.slug}/edit`" class="flex-1">
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
                    <NuxtLink to="/dashboard/news/create">
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

useHead({
    title: 'Manajemen Berita - ArcheryHub Dashboard'
})

const { get, delete: del } = useApi()
const toast = useToast()

const news = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')

const fetchNews = async () => {
    isLoading.value = true
    try {
        const response = await get('/news/my')
        news.value = response.data || []
    } catch (error) {
        toast.error('Gagal mengambil data berita')
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchNews()
})

const filteredNews = computed(() => {
    return news.value.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesStatus = statusFilter.value === 'all' || item.status === statusFilter.value
        const matchesCategory = categoryFilter.value === 'all' || item.category.toLowerCase() === categoryFilter.value.toLowerCase()
        return matchesSearch && matchesStatus && matchesCategory
    })
})

const resetFilters = () => {
    searchQuery.value = ''
    statusFilter.value = 'all'
    categoryFilter.value = 'all'
}

const deleteNews = async (item) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus berita "${item.title}"?`)) return

    try {
        await del(`/news/${item.id}`)
        toast.success('Berita berhasil dihapus')
        fetchNews()
    } catch (error) {
        toast.error('Gagal menghapus berita')
    }
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

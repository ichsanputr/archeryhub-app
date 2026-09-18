<template>
    <div class="flex flex-col gap-8 relative">
        <!-- Header Section -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="space-y-4">
                    <div class="flex items-center gap-2 text-[10px] sm:text-xs font-black tracking-widest text-primary/80">
                        <span class="text-white">{{ t('root.index.root_terminal', 'Root Terminal') }}</span>
                        <Icon icon="ph:caret-right-bold" class="text-[8px] opacity-50" />
                        <span class="text-primary">{{ t('root.articles.title', 'Articles Management') }}</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <div
                            class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                            <Icon icon="ph:newspaper-bold" class="text-primary text-2xl sm:text-3xl" />
                        </div>
                        <div>
                            <h1 class="text-xl sm:text-3xl font-black tracking-tight">{{ t('root.articles.title', 'Articles Management') }}</h1>
                            <div class="text-slate-300 text-[10px] sm:text-sm font-medium mt-1">
                                {{ t('root.articles.subtitle', 'Manage blog publications, archery guides, and news articles') }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <NuxtLink to="/dashboard/root/articles/create">
                        <BaseButton variant="primary" icon="ph:plus-bold" class="shadow-lg shadow-primary/20">
                            {{ t('root.articles.create_button', 'Create New Article') }}
                        </BaseButton>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Metric Stat Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="size-12 rounded-xl bg-primary/10 text-navy flex items-center justify-center shrink-0">
                    <Icon icon="ph:article-bold" class="text-2xl text-navy" />
                </div>
                <div>
                    <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{{ t('root.articles.stats_total', 'Total Articles') }}</div>
                    <div class="text-2xl font-black text-navy tabular-nums">{{ stats.total || 0 }}</div>
                </div>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="size-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                    <Icon icon="ph:check-circle-bold" class="text-2xl text-green-600" />
                </div>
                <div>
                    <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{{ t('root.articles.stats_published', 'Published') }}</div>
                    <div class="text-2xl font-black text-navy tabular-nums">{{ stats.published || 0 }}</div>
                </div>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="size-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Icon icon="ph:file-dashed-bold" class="text-2xl text-amber-600" />
                </div>
                <div>
                    <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{{ t('root.articles.stats_draft', 'Drafts') }}</div>
                    <div class="text-2xl font-black text-navy tabular-nums">{{ stats.draft || 0 }}</div>
                </div>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="size-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Icon icon="ph:eye-bold" class="text-2xl text-blue-600" />
                </div>
                <div>
                    <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{{ t('root.articles.stats_views', 'Total Reads') }}</div>
                    <div class="text-2xl font-black text-navy tabular-nums">{{ (stats.total_views || 0).toLocaleString('id-ID') }}</div>
                </div>
            </div>
        </div>

        <!-- Filters & Search Bar -->
        <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-grow w-full">
                <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">{{ t('root.articles.search_label', 'Search') }}</label>
                <div class="relative">
                    <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input v-model="searchQuery" @keyup.enter="handleSearch" type="text"
                        :placeholder="t('root.articles.search_placeholder', 'Search title, excerpt, or slug...')"
                        class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all" />
                </div>
            </div>

            <div class="w-full md:w-56">
                <BaseSelect v-model="categoryFilter" :options="categoryOptions" :label="t('root.articles.category_label', 'Category')" class="w-full" />
            </div>

            <div class="w-full md:w-48">
                <BaseSelect v-model="statusFilter" :options="statusOptions" :label="t('root.articles.status_label', 'Publication Status')" class="w-full" />
            </div>

            <button @click="resetFilters"
                class="h-11 px-5 font-bold text-xs text-navy bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all shrink-0">
                {{ t('root.index.reset', 'Reset') }}
            </button>
        </div>

        <!-- Articles Table -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr class="bg-gray-50/50 text-gray-500 font-bold text-[10px] tracking-widest border-b border-gray-100">
                            <th @click="toggleSort('title')" class="px-6 py-4 cursor-pointer hover:text-navy transition-colors select-none">
                                <div class="flex items-center gap-1.5">
                                    <span>{{ t('root.articles.table_article', 'Article') }}</span>
                                    <Icon v-if="sortBy === 'title'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                                </div>
                            </th>
                            <th @click="toggleSort('category')" class="px-6 py-4 cursor-pointer hover:text-navy transition-colors select-none">
                                <div class="flex items-center gap-1.5">
                                    <span>{{ t('root.articles.table_category', 'Category') }}</span>
                                    <Icon v-if="sortBy === 'category'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                                </div>
                            </th>
                            <th @click="toggleSort('status')" class="px-6 py-4 text-center cursor-pointer hover:text-navy transition-colors select-none">
                                <div class="flex items-center justify-center gap-1.5">
                                    <span>{{ t('root.articles.table_status', 'Status') }}</span>
                                    <Icon v-if="sortBy === 'status'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                                </div>
                            </th>
                            <th @click="toggleSort('views')" class="px-6 py-4 text-center cursor-pointer hover:text-navy transition-colors select-none">
                                <div class="flex items-center justify-center gap-1.5">
                                    <span>{{ t('root.articles.table_views', 'Reads') }}</span>
                                    <Icon v-if="sortBy === 'views'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                                </div>
                            </th>
                            <th @click="toggleSort('published_at')" class="px-6 py-4 cursor-pointer hover:text-navy transition-colors select-none">
                                <div class="flex items-center gap-1.5">
                                    <span>{{ t('root.articles.table_published_at', 'Published Date') }}</span>
                                    <Icon v-if="sortBy === 'published_at'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                                </div>
                            </th>
                            <th class="px-6 py-4 text-right">{{ t('root.articles.table_actions', 'Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-if="loading">
                            <td colspan="6" class="px-6 py-20 text-center">
                                <div class="flex flex-col items-center justify-center gap-3">
                                    <div class="h-10 w-10 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
                                    <div class="text-xs text-gray-400 font-medium">{{ t('common.loading', 'Memuat data artikel...') }}</div>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="!loading && articles.length === 0">
                            <td colspan="6" class="px-6 py-20 text-center">
                                <div class="flex flex-col items-center gap-3 max-w-sm mx-auto">
                                    <div class="size-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
                                        <Icon icon="ph:newspaper-clipping-bold" class="text-4xl text-gray-300" />
                                    </div>
                                    <div class="space-y-1">
                                        <div class="text-base font-bold text-navy">{{ t('root.articles.no_articles', 'Belum ada artikel ditemukan') }}</div>
                                        <div class="text-xs text-gray-500 font-medium leading-relaxed">
                                            {{ t('root.articles.no_articles_desc', 'Mulai buat artikel edukasi atau panduan baru untuk komunitas panahan.') }}
                                        </div>
                                    </div>
                                    <NuxtLink to="/dashboard/root/articles/create" class="mt-2">
                                        <BaseButton variant="primary" size="sm" icon="ph:plus-bold">
                                            {{ t('root.articles.create_button', 'Buat Artikel Baru') }}
                                        </BaseButton>
                                    </NuxtLink>
                                </div>
                            </td>
                        </tr>
                        <tr v-else v-for="item in articles" :key="item.uuid"
                            class="hover:bg-primary/5 transition-colors group">
                            <!-- Article Info -->
                            <td class="px-6 py-4">
                                <div class="flex items-start gap-4">
                                    <div class="h-12 w-16 sm:h-14 sm:w-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200/60 flex items-center justify-center shrink-0">
                                        <img :src="item.image || '/hero-berita.jpeg'" :alt="item.title" class="w-full h-full object-cover">
                                    </div>
                                    <div class="space-y-1 min-w-0">
                                        <NuxtLink :to="`/dashboard/root/articles/${item.uuid}`"
                                            class="font-bold text-sm text-navy group-hover:text-primary transition-colors line-clamp-1 block">
                                            {{ item.title }}
                                        </NuxtLink>
                                        <div class="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                                            <span class="truncate max-w-[200px]">/blog/{{ item.slug }}</span>
                                            <span>•</span>
                                            <span>{{ item.read_time || 5 }} min</span>
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <!-- Category -->
                            <td class="px-6 py-4">
                                <span class="px-2.5 py-1 rounded-lg bg-navy/5 text-navy text-xs font-bold whitespace-nowrap">
                                    {{ item.category }}
                                </span>
                            </td>

                            <!-- Status -->
                            <td class="px-6 py-4 text-center">
                                <button @click="toggleStatus(item)" :title="`Click to toggle status`"
                                    class="px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest border transition-transform hover:scale-105"
                                    :class="getStatusBadgeClass(item.status)">
                                    {{ item.status ? item.status.toUpperCase() : 'PUBLISHED' }}
                                </button>
                            </td>

                            <!-- Reads / Views -->
                            <td class="px-6 py-4 text-center text-xs font-bold text-navy tabular-nums">
                                {{ (item.views || 0).toLocaleString('id-ID') }}
                            </td>

                            <!-- Published At -->
                            <td class="px-6 py-4 text-xs font-medium text-gray-500 whitespace-nowrap">
                                {{ formatDate(item.published_at || item.created_at) }}
                            </td>

                            <!-- Actions -->
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-1.5">
                                    <!-- Preview on Blog -->
                                    <NuxtLink :to="`/blog/${item.slug}`" target="_blank"
                                        class="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-xl transition-all"
                                        :title="t('root.articles.preview_tooltip', 'Lihat di Blog')">
                                        <Icon icon="ph:arrow-square-out-bold" class="text-base" />
                                    </NuxtLink>

                                    <!-- Edit Article -->
                                    <NuxtLink :to="`/dashboard/root/articles/${item.uuid}`"
                                        class="p-2 text-navy hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                                        :title="t('root.articles.edit_tooltip', 'Edit Artikel')">
                                        <Icon icon="ph:pencil-simple-bold" class="text-base" />
                                    </NuxtLink>

                                    <!-- Delete Article -->
                                    <button @click="openDeleteDialog(item)"
                                        class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                        :title="t('root.articles.delete_tooltip', 'Hapus Artikel')">
                                        <Icon icon="ph:trash-bold" class="text-base" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="articles.length > 0" class="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                <BasePagination
                    v-model:currentPage="currentPage"
                    :totalItems="totalArticles"
                    :itemsPerPage="itemsPerPage"
                    :showPageSize="false"
                    noMargin
                />
            </div>
        </div>

        <!-- Standard AppDialog for Delete Confirmation -->
        <AppDialog
            v-model:show="deleteModal.show"
            type="danger"
            :title="t('root.articles.delete_confirm_title', 'Hapus Artikel?')"
            :message="t('root.articles.delete_confirm_desc', { title: deleteModal.item?.title || '' })"
            :confirm-text="t('root.articles.delete_confirm_button', 'Ya, Hapus Artikel')"
            :cancel-text="t('common.cancel', 'Batal')"
            :loading="deleteModal.loading"
            @confirm="executeDelete"
        />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'
import { useDateFormat } from '@vueuse/core'

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})

const { t } = useI18n()
const api = useApi()
const toast = useToast()

useHead({
    title: computed(() => `${t('root.articles.title', 'Articles Management')} - Archeris Root`)
})

const articles = ref([])
const totalArticles = ref(0)
const loading = ref(true)
const currentPage = ref(1)
const itemsPerPage = ref(20)

const searchQuery = ref('')
const categoryFilter = ref('All')
const statusFilter = ref('All')
const sortBy = ref('published_at')
const sortOrder = ref('desc')

const stats = ref({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    total_views: 0
})

const categoryOptions = [
    { label: 'Semua Kategori', value: 'All' },
    { label: 'Archery Equipment', value: 'Archery Equipment' },
    { label: 'Bow Types', value: 'Bow Types' },
    { label: 'Physics & Sizing', value: 'Physics & Sizing' },
    { label: 'Rules & Tournaments', value: 'Rules & Tournaments' },
    { label: 'Technique & Training', value: 'Technique & Training' },
    { label: 'Maintenance & Gear Care', value: 'Maintenance & Gear Care' },
    { label: 'Mental & Physical Prep', value: 'Mental & Physical Prep' },
    { label: 'Buying & Setup Guide', value: 'Buying & Setup Guide' },
]

const statusOptions = [
    { label: 'Semua Status', value: 'All' },
    { label: 'Published (Terbit)', value: 'published' },
    { label: 'Draft (Draf)', value: 'draft' },
    { label: 'Archived (Arsip)', value: 'archived' },
]

const deleteModal = ref({
    show: false,
    item: null,
    loading: false
})

const toggleSort = (column) => {
    if (sortBy.value === column) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortBy.value = column
        sortOrder.value = 'asc'
    }
    fetchArticles()
}

const handleSearch = () => {
    currentPage.value = 1
    fetchArticles()
}

const resetFilters = () => {
    searchQuery.value = ''
    categoryFilter.value = 'All'
    statusFilter.value = 'All'
    currentPage.value = 1
    fetchArticles()
}

const fetchArticles = async () => {
    try {
        loading.value = true
        const params = {
            page: currentPage.value,
            limit: itemsPerPage.value,
            sort_by: sortBy.value,
            order: sortOrder.value,
        }
        if (searchQuery.value) params.q = searchQuery.value
        if (categoryFilter.value && categoryFilter.value !== 'All') params.category = categoryFilter.value
        if (statusFilter.value && statusFilter.value !== 'All') params.status = statusFilter.value

        const res = await api.get('/root/dashboard/articles', { params })
        articles.value = res.data || []
        totalArticles.value = res.total || 0
        if (res.stats) {
            stats.value = res.stats
        }
    } catch (err) {
        console.error('Failed to fetch articles:', err)
        toast.error(err.data?.error || 'Gagal memuat data artikel')
    } finally {
        loading.value = false
    }
}

const toggleStatus = async (item) => {
    const nextStatus = item.status === 'published' ? 'draft' : 'published'
    try {
        await api.patch(`/root/dashboard/articles/${item.uuid}/status`, { status: nextStatus })
        item.status = nextStatus
        toast.success(t('root.articles.status_update_success', 'Status artikel berhasil diubah'))
        // refresh stats
        fetchArticles()
    } catch (err) {
        console.error('Failed to toggle status:', err)
        toast.error(err.data?.error || 'Gagal mengubah status artikel')
    }
}

const openDeleteDialog = (item) => {
    deleteModal.value = {
        show: true,
        item,
        loading: false
    }
}

const executeDelete = async () => {
    if (!deleteModal.value.item) return
    try {
        deleteModal.value.loading = true
        await api.delete(`/root/dashboard/articles/${deleteModal.value.item.uuid}`)
        toast.success(t('root.articles.delete_success', 'Artikel berhasil dihapus'))
        deleteModal.value.show = false
        fetchArticles()
    } catch (err) {
        console.error('Failed to delete article:', err)
        toast.error(err.data?.error || 'Gagal menghapus artikel')
    } finally {
        deleteModal.value.loading = false
    }
}

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'published':
            return 'bg-green-50 text-green-700 border-green-200'
        case 'draft':
            return 'bg-amber-50 text-amber-700 border-amber-200'
        case 'archived':
            return 'bg-gray-100 text-gray-600 border-gray-200'
        default:
            return 'bg-blue-50 text-blue-700 border-blue-200'
    }
}

const formatDate = (date) => {
    if (!date) return '—'
    return useDateFormat(date, 'DD MMM YYYY', { locales: 'id-ID' }).value
}

watch([categoryFilter, statusFilter, currentPage], () => {
    fetchArticles()
})

onMounted(() => {
    fetchArticles()
})
</script>

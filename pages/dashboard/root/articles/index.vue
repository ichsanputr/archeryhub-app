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
                        <span class="text-white">{{ t('root.index.root_terminal') }}</span>
                        <Icon icon="ph:caret-right-bold" class="text-[8px] opacity-50" />
                        <span class="text-primary">{{ t('root.articles.title') }}</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <div
                            class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                            <Icon icon="ph:newspaper-bold" class="text-primary text-2xl sm:text-3xl" />
                        </div>
                        <div>
                            <h1 class="text-xl sm:text-3xl font-black tracking-tight">{{ t('root.articles.title') }}</h1>
                            <div class="text-slate-300 text-[10px] sm:text-sm font-medium mt-1">
                                {{ t('root.articles.subtitle') }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <NuxtLink to="/dashboard/root/articles/create">
                        <BaseButton variant="primary" icon="ph:plus-bold" class="shadow-lg shadow-primary/20">
                            {{ t('root.articles.create_button') }}
                        </BaseButton>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Unified DashboardDataTable (Category B: Inline Filters) -->
        <DashboardDataTable
            :items="articles"
            :columns="tableColumns"
            :loading="loading"
            :searchable="true"
            :search-placeholder="t('root.articles.search_placeholder')"
            count-icon="ph:newspaper-bold"
            :count-unit="t('root.articles.title')"
            :show-reset-button="true"
            :empty-title="t('root.articles.no_articles')"
            :empty-description="t('root.articles.no_articles_desc')"
            empty-icon="ph:newspaper-clipping-bold"
            :items-per-page="itemsPerPage"
            :initial-sort-by="sortBy"
            :initial-sort-order="sortOrder"
            @search="searchQuery = $event; handleSearch()"
            @sort="toggleSort($event.sortBy)"
            @reset-filters="resetFilters"
        >
            <!-- Inline Filters: Category & Status Selects -->
            <template #inline-filters>
                <div class="flex items-center gap-2 flex-wrap">
                    <div class="w-40 sm:w-48">
                        <BaseSelect v-model="categoryFilter" :options="categoryOptions" class="w-full text-xs" />
                    </div>
                    <div class="w-36 sm:w-44">
                        <BaseSelect v-model="statusFilter" :options="statusOptions" class="w-full text-xs" />
                    </div>
                </div>
            </template>

            <!-- Article Title & Slug Column Slot -->
            <template #item-title="{ item }">
                <div class="flex items-start gap-3.5 py-1">
                    <div class="h-12 w-16 sm:h-14 sm:w-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                        <img :src="item.image || '/hero-berita.jpeg'" :alt="item.title" class="size-full object-cover" />
                    </div>
                    <div class="space-y-0.5 min-w-0">
                        <NuxtLink :to="`/dashboard/root/articles/${item.uuid}`"
                            class="font-bold text-xs sm:text-sm text-navy hover:text-primary transition-colors line-clamp-1 block">
                            {{ item.title }}
                        </NuxtLink>
                        <div class="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                            <span class="truncate max-w-[180px]">/blog/{{ item.slug }}</span>
                            <span>•</span>
                            <span>{{ item.read_time || 5 }} min</span>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Category Column Slot -->
            <template #item-category="{ item }">
                <span class="px-2.5 py-1 rounded-lg bg-navy/5 text-navy text-xs font-bold whitespace-nowrap">
                    {{ item.category }}
                </span>
            </template>

            <!-- Status Column Slot -->
            <template #item-status="{ item }">
                <div class="flex justify-center">
                    <button @click="toggleStatus(item)" :title="`Klik untuk ubah status`"
                        class="px-2.5 py-1 rounded-full text-[11px] font-black border transition-transform hover:scale-105 cursor-pointer tracking-wider"
                        :class="getStatusBadgeClass(item.status)">
                        {{ getStatusLabel(item.status) }}
                    </button>
                </div>
            </template>

            <!-- Views Column Slot -->
            <template #item-views="{ item }">
                <div class="text-center text-xs font-bold text-navy tabular-nums">
                    {{ (item.views || 0).toLocaleString('id-ID') }}
                </div>
            </template>

            <!-- Published At Column Slot -->
            <template #item-published_at="{ item }">
                <span class="text-xs font-medium text-slate-500 whitespace-nowrap">
                    {{ formatDate(item.published_at || item.created_at) }}
                </span>
            </template>

            <!-- Actions Column Slot -->
            <template #actions="{ item }">
                <div class="flex items-center justify-end gap-1">
                    <!-- Preview on Blog -->
                    <NuxtLink :to="`/blog/${item.slug}`" target="_blank"
                        class="p-1.5 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-lg transition-all"
                        :title="t('root.articles.preview_tooltip')">
                        <Icon icon="ph:arrow-square-out-bold" class="text-base" />
                    </NuxtLink>

                    <!-- Edit Article -->
                    <NuxtLink :to="`/dashboard/root/articles/${item.uuid}`"
                        class="p-1.5 text-navy hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                        :title="t('root.articles.edit_tooltip')">
                        <Icon icon="ph:pencil-simple-bold" class="text-base" />
                    </NuxtLink>

                    <!-- Delete Article -->
                    <button @click="openDeleteDialog(item)"
                        class="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        :title="t('root.articles.delete_tooltip')">
                        <Icon icon="ph:trash-bold" class="text-base" />
                    </button>
                </div>
            </template>
        </DashboardDataTable>

        <!-- Standard AppDialog for Delete Confirmation -->
        <AppDialog
            v-model:show="deleteModal.show"
            type="danger"
            :title="t('root.articles.delete_confirm_title')"
            :message="t('root.articles.delete_confirm_desc', { title: deleteModal.item?.title || '' })"
            :confirm-text="t('root.articles.delete_confirm_button')"
            :cancel-text="t('common.cancel')"
            :loading="deleteModal.loading"
            @confirm="executeDelete"
        />
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { useDateFormat } from '@vueuse/core'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})

const { t, locale } = useI18n()
const api = useApi()
const toast = useToast()

useHead({
    title: computed(() => `${t('root.articles.title')} - Archeris Root`)
})

const tableColumns = computed(() => [
    { key: 'title', label: t('root.articles.table_article'), sortable: true, sortKey: 'title', class: 'min-w-[260px]' },
    { key: 'category', label: t('root.articles.table_category'), sortable: true, sortKey: 'category', class: 'min-w-[150px]' },
    { key: 'status', label: t('root.articles.table_status'), sortable: true, sortKey: 'status', align: 'center', class: 'min-w-[130px]' },
    { key: 'views', label: t('root.articles.table_views'), sortable: true, sortKey: 'views', align: 'center', class: 'min-w-[110px]' },
    { key: 'published_at', label: t('root.articles.table_published_at'), sortable: true, sortKey: 'published_at', class: 'min-w-[140px]' }
])

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
    { label: 'Gear & Equipment', value: 'Gear & Equipment' },
    { label: 'Rules & Scoring', value: 'Rules & Scoring' },
    { label: 'Guides & Technique', value: 'Guides & Technique' },
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
        toast.success(t('root.articles.status_update_success'))
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
        toast.success(t('root.articles.delete_success'))
        deleteModal.value.show = false
        fetchArticles()
    } catch (err) {
        console.error('Failed to delete article:', err)
        toast.error(err.data?.error || 'Gagal menghapus artikel')
    } finally {
        deleteModal.value.loading = false
    }
}

const getStatusLabel = (status) => {
    switch (status) {
        case 'published':
            return t('root.articles.status_published')
        case 'draft':
            return t('root.articles.status_draft')
        case 'archived':
            return t('root.articles.status_archived')
        default:
            return t('root.articles.status_published')
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

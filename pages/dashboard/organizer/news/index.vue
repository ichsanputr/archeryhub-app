<template>
    <div class="flex flex-col gap-8">
        <!-- Header Section -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <!-- Decorative Background Elements (Glows) -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                    <div
                        class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                        <Icon icon="ph:newspaper-bold" class="text-primary text-2xl sm:text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-3xl font-black tracking-tight">{{ t('organizer_news.index.title') }}</h1>
                        <p class="text-slate-300 text-xs sm:text-sm font-medium mt-1">{{ t('organizer_news.index.subtitle') }}</p>
                    </div>
                </div>
                <BaseButton to="/dashboard/organizer/news/create" variant="primary" icon="ph:plus-bold"
                    class="h-11 px-6 shadow-lg shadow-primary/20 font-black tracking-widest text-xs">
                    {{ t('organizer_news.index.create') }}
                </BaseButton>
            </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
                :title="t('organizer_news.index.stats_total')"
                :value="news.length"
                icon="ph:newspaper"
                color="primary"
            />
            <StatCard
                :title="t('organizer_news.index.stats_published')"
                :value="news.filter(n => n.status === 'published').length"
                icon="ph:check-circle"
                color="primary"
            />
            <StatCard
                :title="t('organizer_news.index.stats_draft')"
                :value="news.filter(n => n.status === 'draft').length"
                icon="ph:file-text"
                color="primary"
            />
            <StatCard
                :title="t('organizer_news.index.stats_total_view')"
                :value="news.reduce((acc, n) => acc + (n.views || 0), 0).toLocaleString()"
                icon="ph:eye"
                color="primary"
            />
        </div>

        <!-- Search & Filter -->
        <div
            class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-grow w-full">
                <BaseInput v-model="searchQuery" icon="ph:magnifying-glass" :placeholder="t('organizer_news.index.search_placeholder')"
                    :label="t('organizer_news.index.search_label')" />
            </div>
            <div class="w-full md:w-48">
                <BaseSelect v-model="statusFilter" :items="statusOptions" :label="t('organizer_news.index.filter_status')" />
            </div>
            <div class="w-full md:w-48">
                <BaseSelect v-model="categoryFilter" :items="categoryOptions" :label="t('organizer_news.index.filter_category')" />
            </div>
            <BaseButton variant="white" icon="ph:funnel" @click="resetFilters" class="h-11">
                {{ t('organizer_news.index.reset') }}
            </BaseButton>
        </div>

        <!-- News Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="item in filteredNews" :key="item.id"
                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-primary/30 transition-all group">

                <!-- Featured Image -->
                <div class="relative h-48 bg-gradient-to-br from-navy to-blue-800 overflow-hidden">
                    <img v-if="item.image_url" :src="item.image_url"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div v-else class="w-full h-full flex items-center justify-center">
                        <Icon icon="ph:newspaper" class="text-6xl text-white/20" />
                    </div>

                    <!-- Category & Tags Badge -->
                    <div class="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span :class="[
                            'px-3 py-1 rounded-full text-xs font-black tracking-wider backdrop-blur-md',
                            item.category === 'event' ? 'bg-blue-500/90 text-white' :
                                item.category === 'pengumuman' ? 'bg-amber-500/90 text-white' :
                                    item.category === 'prestasi' ? 'bg-green-500/90 text-white' :
                                        'bg-gray-500/90 text-white'
                        ]">
                            {{ capitalizeChip(item.category) }}
                        </span>
                        <template v-if="normalizeTags(item.tags).length > 0">
                            <span v-for="tag in normalizeTags(item.tags)" :key="tag"
                                class="px-2 py-1 rounded-full text-[9px] font-black tracking-widest bg-navy/80 text-primary backdrop-blur-md border border-primary/20 capitalize">
                                {{ capitalizeChip(tag) }}
                            </span>
                        </template>
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
                                <span>{{ formatDate(item.published_at || item.created_at) }}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <Icon icon="ph:eye" />
                                <span>{{ item.views?.toLocaleString() || 0 }}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-1">
                            <Icon icon="ph:user" />
                            <span>{{ item.author_name || 'Admin' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex gap-2">
                    <NuxtLink :to="`/dashboard/organizer/news/${item.slug}`" class="flex-1">
                        <BaseButton variant="white" size="sm" icon="ph:eye" block class="!h-9">
                            {{ t('organizer_news.index.view') }}
                        </BaseButton>
                    </NuxtLink>
                    <NuxtLink :to="`/dashboard/organizer/news/${item.slug}/edit`" class="flex-1">
                        <BaseButton variant="outline" size="sm" icon="ph:pencil-simple" block class="!h-9">
                            {{ t('organizer_news.index.edit') }}
                        </BaseButton>
                    </NuxtLink>
                    <BaseButton @click="confirmDelete(item)" variant="white" size="sm" icon="ph:trash"
                        class="!h-9 !w-9 !p-0 text-red-500 hover:text-red-600 border-slate-200 flex items-center justify-center shrink-0" />
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredNews.length === 0" class="col-span-full">
                <div class="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <div
                        class="h-20 w-20 mx-auto bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-6">
                        <Icon icon="ph:newspaper" class="text-5xl" />
                    </div>
                    <h3 class="text-xl font-bold text-navy mb-2">{{ t('organizer_news.index.empty_title') }}</h3>
                    <p class="text-gray-500 mb-6 max-w-sm mx-auto">{{ t('organizer_news.index.empty_desc') }}</p>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <AppDialog :show="showDeleteDialog" :title="t('organizer_news.index.delete_title')"
            :message="t('organizer_news.index.delete_confirm').replace('{title}', newsToDelete?.title || '')"
            :confirm-text="t('organizer_news.index.delete_yes')" :cancel-text="t('organizer_news.index.delete_no')" type="danger" icon="ph:trash-bold" @confirm="executeDelete"
            @cancel="showDeleteDialog = false" @update:show="showDeleteDialog = $event" />
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
    title: 'Manajemen Berita - Archeris Dashboard'
})

import { useApi } from '~/composables/useApi'

import useDashboardI18n from '~/composables/useDashboardI18n'

const { get, delete: del } = useApi()
const toast = useToast()
const { t } = useDashboardI18n()

const news = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')

const statusOptions = computed(() => [
    { title: t('organizer_news.options.status_all'), value: 'all' },
    { title: t('organizer_news.options.status_draft'), value: 'draft' },
    { title: t('organizer_news.options.status_published'), value: 'published' }
])

const categoryOptions = computed(() => [
    { title: t('organizer_news.options.cat_all'), value: 'all' },
    { title: t('organizer_news.options.cat_event'), value: 'event' },
    { title: t('organizer_news.options.cat_announcement'), value: 'pengumuman' },
    { title: t('organizer_news.options.cat_achievement'), value: 'prestasi' },
    { title: t('organizer_news.options.cat_other'), value: 'lainnya' }
])

const showDeleteDialog = ref(false)
const newsToDelete = ref(null)
const isDeleting = ref(false)

const fetchNews = async () => {
    isLoading.value = true
    try {
        const response = await get('/news/my')
        news.value = response.data || []
    } catch (error) {
        toast.error(t('organizer_news.index.toast_fetch_failed'))
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

const confirmDelete = (item) => {
    newsToDelete.value = item
    showDeleteDialog.value = true
}

const executeDelete = async () => {
    if (!newsToDelete.value) return

    isDeleting.value = true
    try {
        await del(`/news/${newsToDelete.value.id}`)
        toast.success(t('organizer_news.index.toast_delete_ok'))
        fetchNews()
    } catch (error) {
        toast.error(t('organizer_news.index.toast_delete_failed'))
    } finally {
        isDeleting.value = false
        showDeleteDialog.value = false
        newsToDelete.value = null
    }
}

const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(date)
}

const capitalizeChip = (value) => {
    if (!value) return '-'
    return value
        .toString()
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

const normalizeTags = (tags) => {
    if (!tags) return []
    if (Array.isArray(tags)) {
        return tags.map(t => t?.toString().trim()).filter(Boolean)
    }

    const raw = tags.toString().trim()
    if (!raw) return []

    try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
            return parsed.map(t => t?.toString().trim()).filter(Boolean)
        }
    } catch (error) {
        // keep fallback below for comma-separated text
    }

    return raw.split(',').map(t => t.trim()).filter(Boolean)
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

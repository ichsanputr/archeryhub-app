<template>
    <div class="flex flex-col gap-8">
        <!-- Header -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
            <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                    <div class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                        <Icon icon="ph:newspaper-bold" class="text-primary text-2xl sm:text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-3xl font-black tracking-tight">{{ t('organization_news.index.title') }}</h1>
                        <p class="text-slate-300 text-xs sm:text-sm font-medium mt-1">{{ t('organization_news.index.subtitle') }}</p>
                    </div>
                </div>
                <BaseButton to="/dashboard/organization/news/create" variant="primary" icon="ph:plus-bold" class="h-11 px-6">
                    {{ t('organization_news.index.create') }}
                </BaseButton>
            </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard :title="t('organization_news.index.stats_total')" :value="news.length" icon="ph:newspaper-bold" color="primary" />
            <StatCard :title="t('organization_news.index.stats_published')" :value="news.filter(n => n.status === 'published').length" icon="ph:check-circle-bold" color="success" />
            <StatCard :title="t('organization_news.index.stats_draft')" :value="news.filter(n => n.status === 'draft').length" icon="ph:file-text-bold" color="warning" />
            <StatCard :title="t('organization_news.index.stats_total_view')" :value="news.reduce((acc, n) => acc + (n.views || 0), 0).toLocaleString()" icon="ph:eye-bold" color="info" />
        </div>

        <!-- List -->
        <div class="grid grid-cols-1 gap-4">
            <div v-for="item in filteredNews" :key="item.id" class="bg-white rounded-2xl p-4 flex items-center gap-4 border">
                <div class="flex-1">
                    <h3 class="font-bold">{{ item.title }}</h3>
                    <p class="text-sm text-gray-500">{{ item.excerpt }}</p>
                </div>
                <NuxtLink :to="`/dashboard/organization/news/${item.slug}/edit`" class="flex-1">
                    <BaseButton variant="outline" size="sm" icon="ph:pencil-simple" block class="!h-9">Edit</BaseButton>
                </NuxtLink>
                <BaseButton @click="confirmDelete(item)" variant="white" size="sm" icon="ph:trash" class="!h-9 !w-9 !p-0 text-red-500" />
            </div>

            <div v-if="filteredNews.length === 0" class="col-span-full">
                <div class="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <div class="h-20 w-20 mx-auto bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-6">
                        <Icon icon="ph:newspaper" class="text-5xl" />
                    </div>
                    <h3 class="text-xl font-bold text-navy mb-2">{{ t('organization_news.index.empty_title') }}</h3>
                    <p class="text-gray-500 mb-6 max-w-sm mx-auto">{{ t('organization_news.index.empty_desc') }}</p>
                </div>
            </div>
        </div>

        <AppDialog :show="showDeleteDialog" :title="t('organization_news.index.delete_title')" :message="deleteConfirmMessage" :confirm-text="t('organization_news.index.delete_yes')" :cancel-text="t('organization_news.index.delete_no')" type="danger" icon="ph:trash-bold" @confirm="executeDelete" @cancel="showDeleteDialog = false" @update:show="showDeleteDialog = $event" />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'

definePageMeta({ title: 'Berita', layout: 'dashboard' })
useHead({ title: 'Manajemen Berita - Archeris Dashboard' })

const { get, delete: del } = useApi()
const toast = useToast()
const { t } = useI18n()

const news = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')

const statusOptions = computed(() => [
    { title: t('organization_news.options.status_all') || 'All', value: 'all' },
    { title: t('organization_news.options.status_draft'), value: 'draft' },
    { title: t('organization_news.options.status_published'), value: 'published' }
])

const categoryOptions = computed(() => [
    { title: t('organization_news.options.cat_all'), value: 'all' },
    { title: t('organization_news.options.cat_event'), value: 'event' },
    { title: t('organization_news.options.cat_announcement'), value: 'pengumuman' },
    { title: t('organization_news.options.cat_achievement'), value: 'prestasi' },
    { title: t('organization_news.options.cat_other'), value: 'lainnya' }
])

const showDeleteDialog = ref(false)
const newsToDelete = ref(null)
const isDeleting = ref(false)

const deleteConfirmMessage = computed(() => {
    const title = newsToDelete.value?.title || ''
    return t('organization_news.index.delete_confirm', { title })
})

const fetchNews = async () => {
    isLoading.value = true
    try {
        const res = await get('/organization/news')
        news.value = res?.data || []
    } catch (e) {
        toast.error?.(t('organization_news.index.toast_fetch_failed') || 'Failed to fetch news')
    } finally {
        isLoading.value = false
    }
}

onMounted(() => { fetchNews() })

const filteredNews = computed(() => {
    const q = searchQuery.value?.toLowerCase() || ''
    return news.value.filter(item => {
        const matchesSearch = !q || (item.title || '').toLowerCase().includes(q)
        const matchesStatus = statusFilter.value === 'all' || item.status === statusFilter.value
        const matchesCategory = categoryFilter.value === 'all' || (item.category || '').toLowerCase() === categoryFilter.value.toLowerCase()
        return matchesSearch && matchesStatus && matchesCategory
    })
})

const resetFilters = () => { searchQuery.value = ''; statusFilter.value = 'all'; categoryFilter.value = 'all' }

const confirmDelete = (item) => { newsToDelete.value = item; showDeleteDialog.value = true }

const executeDelete = async () => {
    if (!newsToDelete.value) return
    isDeleting.value = true
    try {
        await del(`/organization/news/${newsToDelete.value.id}`)
        news.value = news.value.filter(n => n.id !== newsToDelete.value.id)
        toast.success?.(t('organization_news.index.toast_delete_ok') || 'Deleted')
    } catch (e) {
        toast.error?.(t('organization_news.index.toast_delete_failed') || 'Delete failed')
    } finally {
        isDeleting.value = false
        showDeleteDialog.value = false
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

<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <DashboardHeader
            :title="t('tournament_media.title')"
            :subtitle="tournament ? `${tournament.name} • ${t('tournament_media.subtitle')}` : t('tournament_media.loading')"
            icon="ph:hard-drive-bold"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/organizer' },
                { label: t('events.list.title'), to: '/dashboard/organizer/tournaments' },
                { label: t('tournament_media.title') }
            ]"
        >
            <template #actions>
                <div class="flex items-center gap-3">
                    <input
                        ref="fileInputRef"
                        type="file"
                        class="hidden"
                        accept="image/*,application/pdf"
                        @change="onFileSelected"
                    />
                    <BaseButton
                        variant="primary"
                        icon="ph:cloud-arrow-up-bold"
                        class="h-10 sm:h-11 px-5 shadow-sm font-black text-xs sm:text-sm tracking-wide"
                        :loading="isUploading"
                        :disabled="isUploading"
                        @click="triggerFileInput"
                    >
                        {{ isUploading ? t('tournament_media.uploading') : t('tournament_media.upload_btn') }}
                    </BaseButton>
                </div>
            </template>
        </DashboardHeader>

        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-6">
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-pulse space-y-4">
                <div class="h-6 w-48 bg-slate-100 rounded"></div>
                <div class="h-4 w-full bg-slate-100 rounded-full"></div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div v-for="i in 4" :key="i" class="bg-white rounded-2xl p-4 border border-slate-200 h-48 animate-pulse"></div>
            </div>
        </div>

        <div v-else class="space-y-6">
            <!-- ── Quota & Storage Gauge Card ── -->
            <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm relative overflow-hidden">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div class="space-y-1">
                        <div class="flex items-center gap-3">
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold tracking-wider"
                                :class="tierBadgeClass">
                                <Icon :icon="tierIcon" class="text-sm" />
                                {{ quotaTypeLabel }}
                            </span>
                            <span class="text-xs font-bold text-slate-400">
                                {{ mediaData.total_files }} {{ t('tournament_media.files_count') }}
                            </span>
                        </div>
                        <h2 class="text-xl sm:text-2xl font-black text-navy">
                            {{ t('tournament_media.usage_title') }}
                        </h2>
                    </div>

                    <!-- Usage Metrics -->
                    <div class="flex items-baseline gap-2 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                        <span class="text-3xl sm:text-4xl font-black text-navy">{{ formattedUsedMB }}</span>
                        <span class="text-xs sm:text-sm font-bold text-slate-400">/ {{ formattedLimit }}</span>
                        <span class="text-xs font-black ml-2 px-2 py-0.5 rounded"
                            :class="usagePercentage >= 90 ? 'bg-red-100 text-red-700' : (usagePercentage >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700')">
                            {{ usagePercentage.toFixed(1) }}%
                        </span>
                    </div>
                </div>

                <!-- Storage Progress Bar -->
                <div class="space-y-2">
                    <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <div 
                            class="h-full rounded-full transition-all duration-700 ease-out"
                            :class="progressBarColor"
                            :style="{ width: `${Math.min(100, Math.max(2, usagePercentage))}%` }"
                        ></div>
                    </div>
                    <div class="flex items-center justify-between text-xs text-slate-400 font-medium">
                        <span>0 MB</span>
                        <span>{{ t('tournament_media.remaining') }} {{ formattedRemaining }}</span>
                        <span>{{ formattedLimit }}</span>
                    </div>
                </div>

                <!-- Warning if near limit -->
                <div v-if="usagePercentage >= 85" class="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <div class="size-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                            <Icon icon="ph:warning-circle-bold" class="text-xl" />
                        </div>
                        <div class="text-xs sm:text-sm text-amber-800">
                            <span class="font-bold">{{ t('tournament_media.near_limit_title') }}</span>
                            {{ t('tournament_media.near_limit_desc') }}
                        </div>
                    </div>
                    <NuxtLink to="/dashboard/organizer/package"
                        class="px-4 py-2 bg-navy text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0">
                        {{ t('tournament_media.upgrade_pkg') }}
                    </NuxtLink>
                </div>
            </div>

            <!-- ── Media Assets Gallery & Management ── -->
            <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
                <!-- Filter Tabs & Actions -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
                    <!-- Category Tabs -->
                    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-slate-50 rounded-2xl border border-slate-100">
                        <button
                            v-for="tab in filterTabs"
                            :key="tab.key"
                            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
                            :class="activeFilter === tab.key ? 'bg-white text-navy shadow-xs font-black' : 'text-slate-500 hover:text-navy'"
                            @click="activeFilter = tab.key"
                        >
                            {{ tab.label }}
                            <span class="ml-1 px-1.5 py-0.2 rounded-full text-[10px]"
                                :class="activeFilter === tab.key ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/60 text-slate-500'">
                                {{ getCategoryCount(tab.key) }}
                            </span>
                        </button>
                    </div>

                    <!-- Search Input -->
                    <div class="relative w-full sm:w-64">
                        <Icon icon="ph:magnifying-glass-bold" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                            v-model="searchQuery"
                            type="text"
                            :placeholder="t('tournament_media.search_placeholder')"
                            class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>

                <!-- Empty State -->
                <div v-if="filteredFiles.length === 0" class="text-center py-16 px-4">
                    <div class="size-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <Icon icon="ph:images-square" class="text-3xl" />
                    </div>
                    <h3 class="text-base font-bold text-navy mb-1">
                        {{ t('tournament_media.empty_title') }}
                    </h3>
                    <div class="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                        {{ t('tournament_media.empty_desc') }}
                    </div>
                    <BaseButton
                        variant="primary"
                        icon="ph:cloud-arrow-up-bold"
                        size="sm"
                        class="font-black"
                        :loading="isUploading"
                        :disabled="isUploading"
                        @click="triggerFileInput"
                    >
                        {{ isUploading ? t('tournament_media.uploading') : t('tournament_media.upload_btn') }}
                    </BaseButton>
                </div>

                <!-- Files Grid -->
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    <div
                        v-for="file in filteredFiles"
                        :key="file.id"
                        class="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                    >
                        <!-- Thumbnail / Preview Area -->
                        <div class="h-36 bg-slate-50 relative flex items-center justify-center overflow-hidden cursor-pointer"
                            @click="previewFile(file)">
                            <img
                                v-if="isImage(file)"
                                :src="file.url"
                                :alt="file.filename"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                            <div v-else class="flex flex-col items-center gap-2 text-slate-400">
                                <Icon :icon="getFileIcon(file)" class="text-4xl text-navy/70" />
                                <span class="text-[10px] font-bold text-slate-500 tracking-wider">
                                    {{ getFileExtension(file.filename) }}
                                </span>
                            </div>

                            <!-- Extension Badge Overlay -->
                            <div class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider bg-black/60 text-white backdrop-blur-xs">
                                {{ getFileExtension(file.filename) }}
                            </div>
                        </div>

                        <!-- Info & Actions Footer -->
                        <div class="p-3.5 flex flex-col justify-between flex-1">
                            <div class="mb-3">
                                <div class="text-xs font-bold text-navy truncate" :title="file.filename">
                                    {{ file.filename }}
                                </div>
                                <div class="flex items-center justify-between text-[10px] text-slate-400 font-medium mt-1">
                                    <span>{{ file.size_formatted }}</span>
                                    <span>{{ formatDate(file.created_at) }}</span>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
                                <a
                                    :href="file.url"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="flex-1 py-1.5 text-center text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                    <Icon icon="ph:arrow-square-out-bold" class="text-xs" />
                                    <span>{{ t('tournament_media.view') }}</span>
                                </a>
                                <button
                                    type="button"
                                    class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    :title="t('tournament_media.delete')"
                                    @click="confirmDeleteFile(file)"
                                >
                                    <Icon icon="ph:trash-bold" class="text-sm" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Delete File Confirmation Dialog ── -->
        <AppDialog
            v-model:show="showDeleteDialog"
            :title="t('tournament_media.delete_title')"
            :message="t('tournament_media.delete_message')"
            :confirm-text="t('tournament_media.delete_confirm')"
            :cancel-text="t('common.cancel')"
            type="danger"
            icon="ph:trash-bold"
            @confirm="handleDeleteConfirmed"
        />

        <!-- ── Image Preview Modal ── -->
        <AppDialog
            v-model:show="showPreviewModal"
            :title="previewItem?.filename || t('tournament_media.preview')"
            :confirm-text="t('common.close')"
            :cancel-text="''"
            @confirm="showPreviewModal = false"
        >
            <div class="flex items-center justify-center p-2">
                <img
                    v-if="previewItem && isImage(previewItem)"
                    :src="previewItem.url"
                    :alt="previewItem.filename"
                    class="max-h-[60vh] max-w-full rounded-xl object-contain shadow-sm"
                />
                <div v-else class="py-8 text-center text-slate-500">
                    <Icon icon="ph:file-pdf-bold" class="text-5xl text-red-500 mx-auto mb-3" />
                    <div class="text-xs font-bold mb-4">{{ previewItem?.filename }}</div>
                    <a
                        :href="previewItem?.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="px-4 py-2 bg-primary text-navy text-xs font-black rounded-xl"
                    >
                        {{ t('tournament_media.open_new_tab') }}
                    </a>
                </div>
            </div>
        </AppDialog>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import useDashboardI18n from '~/composables/useDashboardI18n'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const { get, post, del } = useApi()
const { t, locale } = useDashboardI18n()
const toast = useToast()

useHead({
    title: computed(() => (t ? t('tournament_media.title') : 'Media & Penyimpanan') + ' - Archeris Dashboard')
})

const eventId = computed(() => route.params.id || route.params.slug)
const isLoading = ref(true)
const tournament = ref(null)

const mediaData = ref({
    tournament_id: '',
    tournament_name: '',
    quota_type: 'free',
    used_bytes: 0,
    used_mb: 0,
    limit_mb: 200,
    limit_bytes: 200 * 1024 * 1024,
    usage_percentage: 0,
    total_files: 0,
    files: []
})

const activeFilter = ref('all')
const searchQuery = ref('')

const filterTabs = computed(() => [
    { key: 'all', label: t('tournament_media.filter_all') },
    { key: 'image', label: t('tournament_media.filter_images') },
    { key: 'pdf', label: t('tournament_media.filter_pdf') },
    { key: 'document', label: t('tournament_media.filter_doc') },
    { key: 'video', label: t('tournament_media.filter_video') }
])

// Storage calculations
const usagePercentage = computed(() => mediaData.value.usage_percentage || 0)

const formattedUsedMB = computed(() => {
    const bytes = mediaData.value.used_bytes || 0
    if (bytes >= 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
    }
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
})

const formattedLimit = computed(() => {
    const limitMB = mediaData.value.limit_mb || 200
    if (limitMB >= 1024) {
        return `${(limitMB / 1024).toFixed(0)} GB`
    }
    return `${limitMB} MB`
})

const formattedRemaining = computed(() => {
    const limitBytes = mediaData.value.limit_bytes || (200 * 1024 * 1024)
    const usedBytes = mediaData.value.used_bytes || 0
    const remBytes = Math.max(0, limitBytes - usedBytes)
    if (remBytes >= 1024 * 1024 * 1024) {
        return (remBytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
    }
    return (remBytes / (1024 * 1024)).toFixed(1) + ' MB'
})

const quotaTypeLabel = computed(() => {
    const qt = (mediaData.value.quota_type || 'free').toLowerCase()
    if (qt === 'elite') return 'Elite EO (10 GB)'
    if (qt === 'standard') return 'Standard EO (3 GB)'
    return 'Free Starter (200 MB)'
})

const tierBadgeClass = computed(() => {
    const qt = (mediaData.value.quota_type || 'free').toLowerCase()
    if (qt === 'elite') return 'bg-amber-100 text-amber-900 border border-amber-300'
    if (qt === 'standard') return 'bg-primary/20 text-navy border border-primary/40'
    return 'bg-slate-100 text-slate-700 border border-slate-200'
})

const tierIcon = computed(() => {
    const qt = (mediaData.value.quota_type || 'free').toLowerCase()
    if (qt === 'elite') return 'ph:crown-bold'
    if (qt === 'standard') return 'ph:lightning-bold'
    return 'ph:leaf-bold'
})

const progressBarColor = computed(() => {
    const pct = usagePercentage.value
    if (pct >= 90) return 'bg-red-500'
    if (pct >= 70) return 'bg-amber-500'
    return 'bg-primary'
})

// Extension-based classification helper
function getFileGroup(file) {
    const filename = file.filename || file.url || ''
    const ext = filename.split('.').pop().toLowerCase()
    const mime = (file.mime_type || '').toLowerCase()

    if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'bmp'].includes(ext)) {
        return 'image'
    }
    if (mime.includes('pdf') || ext === 'pdf') {
        return 'pdf'
    }
    if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'].includes(ext) || mime.includes('document') || mime.includes('word') || mime.includes('sheet') || mime.includes('excel')) {
        return 'document'
    }
    if (mime.startsWith('video/') || ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) {
        return 'video'
    }
    return 'other'
}

// File Filtering
const filteredFiles = computed(() => {
    let list = mediaData.value.files || []

    if (activeFilter.value !== 'all') {
        list = list.filter(f => getFileGroup(f) === activeFilter.value)
    }

    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase()
        list = list.filter(f => (f.filename || '').toLowerCase().includes(q))
    }

    return list
})

function getCategoryCount(catKey) {
    const list = mediaData.value.files || []
    if (catKey === 'all') return list.length
    return list.filter(f => getFileGroup(f) === catKey).length
}

function isImage(file) {
    return getFileGroup(file) === 'image'
}

function getFileIcon(file) {
    const grp = getFileGroup(file)
    if (grp === 'pdf') return 'ph:file-pdf-bold'
    if (grp === 'video') return 'ph:video-camera-bold'
    const filename = file.filename || file.url || ''
    const ext = filename.split('.').pop().toLowerCase()
    if (['doc', 'docx'].includes(ext)) return 'ph:file-doc-bold'
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'ph:file-xls-bold'
    if (['ppt', 'pptx'].includes(ext)) return 'ph:presentation-bold'
    return 'ph:file-text-bold'
}

function getFileExtension(filename) {
    if (!filename) return 'FILE'
    const parts = filename.split('.')
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE'
}

function formatDate(dateStr) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
    })
}

// Load Data
async function loadMediaStorage() {
    isLoading.value = true
    try {
        const [tourRes, mediaRes] = await Promise.allSettled([
            get(`/tournaments/${eventId.value}`),
            get(`/tournaments/${eventId.value}/media-storage`)
        ])

        if (tourRes.status === 'fulfilled' && tourRes.value) {
            tournament.value = tourRes.value.data || tourRes.value
        }

        if (mediaRes.status === 'fulfilled' && mediaRes.value) {
            mediaData.value = mediaRes.value.data || mediaRes.value
        }
    } catch (err) {
        console.error('Failed to load tournament media storage', err)
    } finally {
        isLoading.value = false
    }
}

// Upload Handling
const fileInputRef = ref(null)
const isUploading = ref(false)

function triggerFileInput() {
    fileInputRef.value?.click()
}

async function onFileSelected(e) {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset input so re-selecting same file works
    e.target.value = ''

    if (file.size > 10 * 1024 * 1024) {
        toast.error(t('tournament_media.max_size_error'))
        return
    }

    const limitBytes = mediaData.value.limit_bytes || (200 * 1024 * 1024)
    const usedBytes = mediaData.value.used_bytes || 0
    if (usedBytes + file.size > limitBytes) {
        toast.error(t('tournament_media.quota_exceeded_error', { remaining: formattedRemaining.value }, `File exceeds remaining tournament storage quota (${formattedRemaining.value} remaining).`))
        return
    }

    isUploading.value = true
    const formData = new FormData()
    formData.append('file', file)
    formData.append('caption', file.name.replace(/\.[^/.]+$/, ''))
    formData.append('tournament_id', tournament.value?.uuid || tournament.value?.id || eventId.value)

    try {
        const res = await post('/media/upload', formData)
        if (res) {
            toast.success(t('tournament_media.upload_success'))
            await loadMediaStorage()
        }
    } catch (err) {
        const errMsg = err?.data?.error || err?.message || t('tournament_media.upload_failed_error')
        toast.error(errMsg)
    } finally {
        isUploading.value = false
    }
}

// Delete Handling
const showDeleteDialog = ref(false)
const fileToDelete = ref(null)

function confirmDeleteFile(file) {
    fileToDelete.value = file
    showDeleteDialog.value = true
}

async function handleDeleteConfirmed() {
    if (!fileToDelete.value) return

    try {
        await del(`/media/${fileToDelete.value.id}`)
        toast.success(t('tournament_media.delete_success'))
        showDeleteDialog.value = false
        fileToDelete.value = null
        await loadMediaStorage()
    } catch (err) {
        toast.error(t('tournament_media.delete_failed_error'))
    }
}

// Preview Handling
const showPreviewModal = ref(false)
const previewItem = ref(null)

function previewFile(file) {
    previewItem.value = file
    showPreviewModal.value = true
}

onMounted(() => {
    loadMediaStorage()
})
</script>
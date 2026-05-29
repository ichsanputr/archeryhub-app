<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-sm text-gray-500 mb-2">
          <NuxtLink to="/dashboard">Dashboard</NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink to="/dashboard/organizer/news">{{ t('organization_news.index.title') }}</NuxtLink>
          <span class="mx-2">/</span>
          <span class="font-bold">Detail</span>
        </div>
        <h1 class="text-2xl font-extrabold">{{ article.title }}</h1>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink :to="`/dashboard/organizer/news/${route.params.slug}/edit`">
          <BaseButton variant="outline" icon="ph:pencil-simple">Edit</BaseButton>
        </NuxtLink>
        <BaseButton variant="white" icon="ph:trash" @click="confirmDelete">{{ t('organization_news.detail.delete') }}</BaseButton>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <main class="md:col-span-2 bg-white rounded-2xl p-6">
        <div v-if="article.image_url" class="mb-4">
          <img :src="article.image_url" class="w-full h-64 object-cover rounded-lg" />
        </div>
        <div v-html="article.content" class="prose"></div>
        <div class="mt-6">
          <div class="flex gap-2 flex-wrap">
            <span v-for="tag in parsedTags" :key="tag" class="px-3 py-1 bg-gray-100 rounded-full">{{ capitalizeChip(tag) }}</span>
          </div>
        </div>
      </main>

      <aside class="space-y-4">
        <div class="bg-white rounded-2xl p-4">
          <div class="text-sm text-gray-500">{{ t('organization_news.detail.created_label') }}</div>
          <div class="font-medium">{{ formatDate(article.created_at, true) }}</div>
        </div>
        <div class="bg-white rounded-2xl p-4">
          <div class="text-sm text-gray-500">{{ t('organization_news.detail.status') }}</div>
          <div class="font-medium">{{ article.status }}</div>
        </div>
        <div class="bg-white rounded-2xl p-4">
          <BaseButton variant="primary" block @click="publishArticle" v-if="article.status !== 'published'">{{ t('organization_news.detail.publish') }}</BaseButton>
          <BaseButton variant="outline" block @click="unpublishArticle" v-else>{{ t('organization_news.detail.unpublish') }}</BaseButton>
          <BaseButton variant="white" block @click="openShareDialog">{{ t('organization_news.detail.share') }}</BaseButton>
        </div>
      </aside>
    </div>

    <ClientOnly>
      <Teleport to="body">
        <div v-if="showShareDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-bold">{{ t('organization_news.detail.share_title') }}</h3>
              <button @click="closeShareDialog"><Icon icon="ph:x-bold" /></button>
            </div>
            <div class="mb-4">
              <div class="bg-gray-50 p-3 rounded">{{ publicNewsUrl }}</div>
            </div>
            <div class="flex gap-2">
              <button @click="copyPublicUrl" class="px-4 py-2 bg-navy text-white rounded">{{ copySuccess ? t('organization_news.detail.copied') : t('organization_news.detail.copy') }}</button>
              <button @click="closeShareDialog" class="px-4 py-2 border rounded">{{ t('common.close') || 'Close' }}</button>
            </div>
          </div>
        </div>
      </Teleport>
    </ClientOnly>

    <AppDialog v-model:show="showDeleteConfirm" title="Hapus Berita" :message="`Apakah Anda yakin ingin menghapus berita '${article.title}'?`" confirm-text="Ya" type="danger" @confirm="deleteArticle" />
  </div>
</template>


<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '~/composables/useToast'
import { useApi } from '~/composables/useApi'
import useDashboardI18n from '~/composables/useDashboardI18n'
import AppDialog from '~/components/common/AppDialog.vue'
import { gsap } from 'gsap'

definePageMeta({
    title: 'Detail Berita',
    layout: 'dashboard'
})

useHead({
    title: 'Detail Berita - ArcheryHub Dashboard'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { t } = useDashboardI18n()
const { get, delete: del, put } = useApi()

// States
const isLoading = ref(true)
const showShareDialog = ref(false)
const showDeleteConfirm = ref(false)
const copySuccess = ref(false)

// Article data
const article = ref({
    uuid: '',
    title: '',
    excerpt: '',
    content: '',
    category: '',
    status: '',
    image_url: '',
    author_name: '',
    published_at: null,
    created_at: null,
    updated_at: null,
    views: 0,
    tags: []
})

const articleCategoryLower = computed(() => (article.value.category || '').toString().toLowerCase())

const parsedTags = computed(() => {
    const rawTags = article.value.tags
    if (!rawTags) return []

    if (Array.isArray(rawTags)) {
        return rawTags.map(tag => tag?.toString().trim()).filter(Boolean)
    }

    const raw = rawTags.toString().trim()
    if (!raw) return []

    try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
            return parsed.map(tag => tag?.toString().trim()).filter(Boolean)
        }
    } catch (error) {
        // fallback to comma-separated
    }

    return raw.split(',').map(tag => tag.trim()).filter(Boolean)
})

const strippedContent = computed(() => {
    const html = article.value.content || ''
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
})

const wordCount = computed(() => {
    if (!strippedContent.value) return 0
    return strippedContent.value.split(' ').filter(Boolean).length
})

const readTimeMinutes = computed(() => {
    const wordsPerMinute = 200
    return Math.max(1, Math.ceil(wordCount.value / wordsPerMinute))
})

const fetchArticle = async () => {
    isLoading.value = true
    try {
        const response = await get(`/news/${route.params.slug}`)
        if (response?.data) {
            article.value = response.data
        }
    } catch (error) {
        toast.error(t('organizer.news.form.toast_load_failed', 'Gagal memuat berita'))
        router.push('/dashboard/news')
    } finally {
        isLoading.value = false
    }
}

const formatDate = (dateString, withTime = false) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    const options = {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }
    if (withTime) {
        options.hour = '2-digit'
        options.minute = '2-digit'
    }
    return new Intl.DateTimeFormat('id-ID', options).format(date)
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

const publishArticle = async () => {
    try {
        await put(`/news/${article.value.uuid}`, {
            ...article.value,
            status: 'published'
        })
        article.value.status = 'published'
        toast.success(t('organizer.news.form.toast_create_ok_published', 'Berita berhasil dipublikasikan!'))
        fetchArticle()
    } catch (error) {
        toast.error(t('organizer.news.detail.toast_publish_failed', 'Gagal mempublikasikan berita'))
    }
}

const unpublishArticle = async () => {
    try {
        await put(`/news/${article.value.uuid}`, {
            ...article.value,
            status: 'draft'
        })
        article.value.status = 'draft'
        toast.info(t('organizer.news.detail.toast_unpublish_ok', 'Berita ditarik ke draft'))
        fetchArticle()
    } catch (error) {
        toast.error(t('organizer.news.detail.toast_unpublish_failed', 'Gagal menarik berita'))
    }
}

// Share Logic
const publicNewsUrl = computed(() => {
    if (typeof window === 'undefined') return ''
    return `${window.location.origin}/news/${route.params.slug}`
})

const openShareDialog = () => {
    copySuccess.value = false
    showShareDialog.value = true
    nextTick(() => {
        const dialog = document.querySelector('.share-dialog-card')
        const backdrop = document.querySelector('.share-dialog-backdrop')
        if (dialog && backdrop) {
            gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3 })
            gsap.fromTo(dialog, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' })
        }
    })
}

const closeShareDialog = () => {
    const dialog = document.querySelector('.share-dialog-card')
    const backdrop = document.querySelector('.share-dialog-backdrop')
    if (dialog && backdrop) {
        gsap.to(dialog, {
            opacity: 0, scale: 0.9, y: 20, duration: 0.2, ease: 'power2.in', onComplete: () => {
                showShareDialog.value = false
            }
        })
        gsap.to(backdrop, { opacity: 0, duration: 0.2 })
    } else {
        showShareDialog.value = false
    }
}

const copyPublicUrl = async () => {
    try {
        await navigator.clipboard.writeText(publicNewsUrl.value)
        copySuccess.value = true
        toast.success(t('organizer.news.detail.toast_link_copied', 'Link berita tersalin!'))
        setTimeout(() => {
            copySuccess.value = false
        }, 2000)
    } catch (e) {
        toast.error(t('organizer.news.detail.toast_copy_failed', 'Gagal menyalin link'))
    }
}

const shareTo = (platform) => {
    const url = encodeURIComponent(publicNewsUrl.value)
    const text = encodeURIComponent(article.value.title || 'Berita ArcheryHub')

    let shareUrl = ''
    if (platform === 'whatsapp') {
        shareUrl = `https://wa.me/?text=${text}%20-%20${url}`
    } else if (platform === 'telegram') {
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
    } else if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
    } else if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'noopener,noreferrer')
    }
}

// Delete Logic
const confirmDelete = () => {
    showDeleteConfirm.value = true
}

const deleteArticle = async () => {
    try {
        await del(`/news/${article.value.uuid}`)
        toast.success(t('organizer.news.index.toast_delete_ok', 'Berita berhasil dihapus'))
        router.push('/dashboard/organizer/news')
    } catch (error) {
        toast.error(t('organizer.news.index.toast_delete_failed', 'Gagal menghapus berita'))
    }
}

onMounted(() => {
    fetchArticle()
})
</script>

<style scoped>
.prose h2 {
    @apply text-xl font-bold text-navy mt-8 mb-4;
}

.prose p {
    @apply mb-4;
}

.prose ul {
    @apply list-disc pl-6 mb-4 space-y-2;
}
</style>

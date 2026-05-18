<template>
    <div class="flex flex-col gap-8">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
                    <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <NuxtLink to="/dashboard/organization/news" class="hover:text-primary transition-colors">Berita
                    </NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Detail</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">{{ article.title }}</h1>
            </div>
            <div class="flex items-center gap-3">
                <NuxtLink :to="`/dashboard/organization/news/${route.params.slug}/edit`">
                    <BaseButton variant="outline" icon="ph:pencil-simple">
                        Edit
                    </BaseButton>
                </NuxtLink>
                <BaseButton variant="white" icon="ph:trash" @click="confirmDelete" class="text-red-500 hover:bg-red-50">
                    Hapus
                </BaseButton>
            </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Article Content -->
            <div class="lg:col-span-2">
                <article class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <!-- Featured Image -->
                    <div class="relative h-80 bg-gradient-to-br from-navy to-blue-800">
                        <img v-if="article.image_url" :src="article.image_url" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center">
                            <Icon icon="ph:newspaper" class="text-7xl text-white/20" />
                        </div>

                        <!-- Category Badge -->
                        <div class="absolute top-6 left-6">
                            <span :class="[
                                'px-4 py-1.5 rounded-full text-sm font-bold  tracking-wider backdrop-blur-sm',
                                articleCategoryLower === 'event' ? 'bg-blue-500/90 text-white' :
                                    articleCategoryLower === 'pengumuman' ? 'bg-amber-500/90 text-white' :
                                        articleCategoryLower === 'prestasi' ? 'bg-green-500/90 text-white' :
                                            'bg-gray-500/90 text-white'
                            ]">
                                {{ capitalizeChip(article.category) }}
                            </span>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-8">
                        <!-- Meta Info -->
                        <div class="flex items-center gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-gray-100">
                            <div class="flex items-center gap-2">
                                <div
                                    class="h-8 w-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-bold">
                                    {{ (article.author_name || 'A').charAt(0) }}
                                </div>
                                <span class="font-medium text-gray-600">{{ article.author_name || 'Admin' }}</span>
                            </div>
                            <div class="h-4 w-px bg-gray-200"></div>
                            <div class="flex items-center gap-1.5">
                                <Icon icon="ph:calendar" />
                                <span>{{ formatDate(article.published_at || article.created_at) }}</span>
                            </div>
                            <div class="h-4 w-px bg-gray-200"></div>
                            <div class="flex items-center gap-1.5">
                                <Icon icon="ph:clock" />
                                <span>{{ article.readTime || 5 }} menit baca</span>
                            </div>
                        </div>

                        <!-- Article Body -->
                        <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                            <p class="text-xl text-gray-600 font-medium mb-6">{{ article.excerpt }}</p>

                            <div v-html="article.content"></div>
                        </div>

                        <!-- Tags -->
                        <div class="mt-8 pt-6 border-t border-gray-100">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-sm text-gray-400 font-medium">Tags:</span>
                                <span v-for="tag in parsedTags" :key="tag"
                                    class="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors">
                                    {{ capitalizeChip(tag) }}
                                </span>
                                <span v-if="parsedTags.length === 0" class="text-sm text-gray-400">-</span>
                            </div>
                        </div>
                    </div>
                </article>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Status Card -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="font-bold text-navy mb-4 flex items-center gap-2">
                        <Icon icon="ph:info" class="text-primary" />
                        Status Berita
                    </h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500">Dibuat</span>
                            <span class="text-sm font-medium text-gray-700">{{ formatDate(article.created_at, true)
                                }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500">Terakhir diubah</span>
                            <span class="text-sm font-medium text-gray-700">{{ formatDate(article.updated_at, true)
                                }}</span>
                        </div>
                    </div>
                </div>

                <!-- Stats Card -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="font-bold text-navy mb-4 flex items-center gap-2">
                        <Icon icon="ph:chart-line-up" class="text-primary" />
                        Statistik
                    </h3>
                    <div class="space-y-3">
                        <div class="grid grid-cols-3 gap-3">
                            <div class="rounded-xl border border-navy/10 bg-navy/5 p-3 text-center">
                                <p class="text-[10px] font-black tracking-widest text-gray-400">Views</p>
                                <p class="text-xl font-black text-navy mt-1">{{ article.views?.toLocaleString() || 0 }}
                                </p>
                            </div>
                            <div class="rounded-xl border border-primary/20 bg-primary/5 p-3 text-center">
                                <p class="text-[10px] font-black tracking-widest text-gray-400">Words</p>
                                <p class="text-xl font-black text-navy mt-1">{{ wordCount.toLocaleString() }}</p>
                            </div>
                            <div class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
                                <p class="text-[10px] font-black tracking-widest text-gray-400">Read Time</p>
                                <p class="text-xl font-black text-navy mt-1">{{ readTimeMinutes }}m</p>
                            </div>
                        </div>

                        <div class="rounded-xl border border-gray-100 bg-gray-50 p-3">
                            <div class="flex items-center justify-between text-xs font-bold">
                                <span class="text-gray-500 tracking-widest">Status</span>
                                <span :class="article.status === 'published' ? 'text-green-600' : 'text-amber-600'">
                                    {{ article.status === 'published' ? 'Published' : 'Draft' }}
                                </span>
                            </div>
                            <div class="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-500"
                                    :class="article.status === 'published' ? 'bg-green-500 w-full' : 'bg-amber-400 w-2/3'" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="font-bold text-navy mb-4 flex items-center gap-2">
                        <Icon icon="ph:lightning" class="text-primary" />
                        Aksi Cepat
                    </h3>
                    <div class="space-y-2">
                        <BaseButton v-if="article.status === 'draft'" variant="gold" block icon="ph:paper-plane-tilt"
                            @click="publishArticle">
                            Publikasikan
                        </BaseButton>
                        <BaseButton v-else variant="outline" block icon="ph:archive" @click="unpublishArticle">
                            Tarik ke Draft
                        </BaseButton>
                        <BaseButton variant="white" block icon="ph:share-network" @click="openShareDialog">
                            Bagikan
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Share Dialog -->
        <ClientOnly>
            <Teleport to="body">
                <div v-if="showShareDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <!-- Backdrop -->
                    <div class="share-dialog-backdrop absolute inset-0 bg-navy-dark/80 backdrop-blur-sm"
                        @click="closeShareDialog"></div>

                    <!-- Dialog Card -->
                    <div
                        class="share-dialog-card bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden border border-gray-100">
                        <!-- Decorative Border Top -->
                        <div class="bg-primary h-1.5 w-full"></div>

                        <div class="p-8">
                            <!-- Close Button -->
                            <button class="absolute right-6 top-6 text-gray-400 hover:text-navy transition-colors"
                                @click="closeShareDialog">
                                <Icon icon="ph:x-bold" class="text-xl" />
                            </button>

                            <!-- Header -->
                            <div class="flex items-start gap-4 mb-8">
                                <div class="p-3 bg-primary/10 text-primary rounded-2xl shrink-0">
                                    <Icon icon="ph:share-network-bold" class="text-3xl" />
                                </div>
                                <div>
                                    <h3 class="text-navy-dark text-xl font-black tracking-tight mb-2">Bagikan Berita
                                    </h3>
                                    <p class="text-text-secondary text-sm font-medium leading-relaxed">
                                        Sebarkan link berita ini ke sosial media atau salin link untuk dibagikan.
                                    </p>
                                </div>
                            </div>

                            <!-- Link Copy Segment -->
                            <div class="space-y-3 mb-8">
                                <label class="text-[10px] font-black text-gray-400 tracking-[0.2em]">Link Berita</label>
                                <div class="flex items-center gap-2">
                                    <div
                                        class="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-600 font-mono truncate">
                                        {{ publicNewsUrl }}
                                    </div>
                                    <button @click="copyPublicUrl"
                                        class="px-4 py-3 bg-navy text-primary rounded-xl font-bold text-xs hover:bg-navy-light transition-all flex items-center gap-2 shrink-0">
                                        <Icon :icon="copySuccess ? 'ph:check-bold' : 'ph:copy-bold'" />
                                        {{ copySuccess ? 'Tersalin' : 'Salin' }}
                                    </button>
                                </div>
                            </div>

                            <!-- Social Sharing -->
                            <div class="space-y-4">
                                <label class="text-[10px] font-black text-gray-400 tracking-[0.2em]">Bagikan Ke Sosial
                                    Media</label>
                                <div class="grid grid-cols-4 gap-3">
                                    <button v-for="social in [
                                        { id: 'whatsapp', icon: 'ph:whatsapp-logo-fill', color: 'text-green-500', bg: 'bg-green-50', hover: 'hover:bg-green-500' },
                                        { id: 'telegram', icon: 'ph:telegram-logo-fill', color: 'text-sky-500', bg: 'bg-sky-50', hover: 'hover:bg-sky-500' },
                                        { id: 'twitter', icon: 'ph:twitter-logo-fill', color: 'text-black', bg: 'bg-gray-100', hover: 'hover:bg-black' },
                                        { id: 'facebook', icon: 'ph:facebook-logo-fill', color: 'text-blue-600', bg: 'bg-blue-50', hover: 'hover:bg-blue-600' }
                                    ]" :key="social.id" @click="shareTo(social.id)"
                                        class="flex flex-col items-center gap-2 group">
                                        <div :class="[social.bg, social.color, social.hover]"
                                            class="size-12 rounded-2xl flex items-center justify-center group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:-translate-y-1">
                                            <Icon :icon="social.icon" class="text-2xl" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Teleport>
        </ClientOnly>

        <!-- Delete Confirmation -->
        <AppDialog v-model:show="showDeleteConfirm" title="Hapus Berita"
            :message="`Apakah Anda yakin ingin menghapus berita '${article.title}'? Tindakan ini tidak dapat dibatalkan.`"
            confirm-text="Ya, Hapus" type="danger" icon="ph:trash" @confirm="deleteArticle" />
    </div>
</template>


<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '~/composables/useToast'
import { useApi } from '~/composables/useApi'
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
        toast.error('Gagal memuat berita')
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
        toast.success('Berita berhasil dipublikasikan!')
        fetchArticle()
    } catch (error) {
        toast.error('Gagal mempublikasikan berita')
    }
}

const unpublishArticle = async () => {
    try {
        await put(`/news/${article.value.uuid}`, {
            ...article.value,
            status: 'draft'
        })
        article.value.status = 'draft'
        toast.info('Berita ditarik ke draft')
        fetchArticle()
    } catch (error) {
        toast.error('Gagal menarik berita')
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
        toast.success('Link berita tersalin!')
        setTimeout(() => {
            copySuccess.value = false
        }, 2000)
    } catch (e) {
        toast.error('Gagal menyalin link')
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
        toast.success('Berita berhasil dihapus')
        router.push('/dashboard/organization/news')
    } catch (error) {
        toast.error('Gagal menghapus berita')
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

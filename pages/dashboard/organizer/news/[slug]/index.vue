<template>
  <div class="flex flex-col gap-6 sm:gap-8 max-w-7xl mx-auto w-full">
    <!-- Header Section (Enhanced Navy & Brand Accents) -->
    <DashboardHeader
      icon="ph:newspaper-bold"
      back-to="/dashboard/organizer/news"
      :back-text="t('organizer_news.detail.back_to_news', 'Kembali ke Daftar Berita')"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard' },
        { label: t('organizer_news.index.title', 'Berita'), to: '/dashboard/organizer/news' },
        { label: article.title || t('organizer_news.detail.title_short', 'Detail Berita') }
      ]"
    >
      <template #title>
        <div>
          <div class="flex items-center gap-2 mb-1.5 flex-wrap">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
              {{ capitalizeChip(article.category || 'Berita') }}
            </span>
            <span
              class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
              :class="article.status === 'published' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'"
            >
              {{ article.status === 'published' ? t('organizer_news.detail.status_published', 'Terbit') : t('organizer_news.detail.status_draft', 'Draf') }}
            </span>
          </div>
          <h1 class="text-xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            {{ article.title || t('organizer_news.detail.title_short', 'Detail Berita') }}
          </h1>
        </div>
      </template>

      <template #subtitle>
        <div class="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300 mt-2">
          <span class="flex items-center gap-1.5">
            <Icon icon="ph:user-bold" class="text-primary" />
            <span>{{ article.author_name || 'Admin' }}</span>
          </span>
          <span class="flex items-center gap-1.5">
            <Icon icon="ph:calendar-blank-bold" class="text-primary" />
            <span>{{ formatDate(article.published_at || article.created_at) }}</span>
          </span>
          <span class="flex items-center gap-1.5">
            <Icon icon="ph:clock-bold" class="text-primary" />
            <span>{{ readTimeMinutes }} {{ t('organizer_news.detail.read_time_unit', 'menit baca') }}</span>
          </span>
          <span class="flex items-center gap-1.5">
            <Icon icon="ph:eye-bold" class="text-primary" />
            <span>{{ (article.views || 0).toLocaleString('id-ID') }} views</span>
          </span>
        </div>
      </template>

      <template #actions>
        <a
          v-if="publicNewsUrl"
          :href="publicNewsUrl"
          target="_blank"
          class="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-white/10 shadow-2xs"
        >
          <Icon icon="ph:arrow-square-out-bold" class="text-sm text-primary" />
          <span>{{ t('organizer_news.detail.preview_public', 'Lihat Publik') }}</span>
        </a>

        <NuxtLink :to="`/dashboard/organizer/news/${route.params.slug}/edit`">
          <BaseButton variant="primary" icon="ph:pencil-simple-bold" class="h-10 px-4 font-bold text-xs">
            {{ t('organizer_news.detail.edit', 'Edit Berita') }}
          </BaseButton>
        </NuxtLink>

        <BaseButton
          variant="white"
          icon="ph:share-network-bold"
          @click="openShareDialog"
          class="h-10 px-3.5 font-bold text-xs"
        >
          {{ t('organizer_news.detail.share', 'Bagikan') }}
        </BaseButton>

        <button
          @click="confirmDelete"
          class="h-10 w-10 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white flex items-center justify-center transition-all border border-red-500/30"
          :title="t('organizer_news.detail.delete', 'Hapus Berita')"
        >
          <Icon icon="ph:trash-bold" class="text-base" />
        </button>
      </template>
    </DashboardHeader>

    <!-- Main Grid Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      
      <!-- Article Content Main Column -->
      <div class="lg:col-span-2 space-y-6">
        <article class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <!-- Featured Cover Image -->
          <div v-if="article.image_url" class="relative h-72 sm:h-96 w-full bg-slate-900 overflow-hidden group">
            <img
              :src="article.image_url"
              :alt="article.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
            
            <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
              <span class="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md font-bold border border-white/20">
                {{ capitalizeChip(article.category || 'Berita') }}
              </span>
              <span class="text-slate-200 text-[11px] font-medium bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                Foto Utama
              </span>
            </div>
          </div>

          <div class="p-6 sm:p-8 space-y-6">
            <!-- Lead Paragraph / Excerpt Callout -->
            <div
              v-if="article.excerpt"
              class="p-5 rounded-2xl bg-slate-50 border-l-4 border-l-primary border-y border-r border-slate-200/70 text-slate-700 font-medium text-base sm:text-lg leading-relaxed italic"
            >
              "{{ article.excerpt }}"
            </div>

            <!-- Full Article Body -->
            <div class="article-prose text-slate-800 text-sm sm:text-base leading-relaxed space-y-4">
              <div v-html="article.content"></div>
            </div>

            <!-- Tags Section -->
            <div class="pt-6 border-t border-slate-100">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-black text-slate-400 capitalize tracking-wider flex items-center gap-1">
                  <Icon icon="ph:tag-bold" class="text-sm" />
                  {{ t('organizer_news.detail.tags_label', 'Label & Tagar') }}:
                </span>
                
                <template v-if="parsedTags.length > 0">
                  <span
                    v-for="tag in parsedTags"
                    :key="tag"
                    class="px-3 py-1 rounded-full bg-slate-100 hover:bg-primary/10 text-slate-700 hover:text-navy text-xs font-bold transition-all border border-slate-200/60 cursor-pointer"
                  >
                    #{{ capitalizeChip(tag) }}
                  </span>
                </template>
                <span v-else class="text-xs text-slate-400 italic">
                  {{ t('organizer_news.detail.no_tags', 'Tidak ada tagar') }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Right Sidebar -->
      <aside class="space-y-6">
        <!-- Status & Publishing Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="text-sm font-black text-navy capitalize tracking-wide flex items-center gap-2">
              <Icon icon="ph:info-bold" class="text-primary" />
              <span>{{ t('organizer_news.detail.status_heading', 'Status & Publikasi') }}</span>
            </h3>
            <span
              class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
              :class="article.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'"
            >
              {{ article.status === 'published' ? t('organizer_news.detail.status_published', 'Terbit') : t('organizer_news.detail.status_draft', 'Draf') }}
            </span>
          </div>

          <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between text-slate-500">
              <span>{{ t('organizer_news.detail.created_label', 'Tanggal Dibuat') }}</span>
              <span class="font-bold text-navy">{{ formatDate(article.created_at, true) }}</span>
            </div>
            <div class="flex items-center justify-between text-slate-500">
              <span>{{ t('organizer_news.detail.updated_label', 'Terakhir Diperbarui') }}</span>
              <span class="font-bold text-navy">{{ formatDate(article.updated_at, true) }}</span>
            </div>
            <div class="flex items-center justify-between text-slate-500">
              <span>{{ t('organizer_news.detail.author_label', 'Penulis') }}</span>
              <span class="font-bold text-navy">{{ article.author_name || 'Admin' }}</span>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 space-y-2">
            <BaseButton
              v-if="article.status !== 'published'"
              variant="primary"
              block
              icon="ph:paper-plane-tilt-bold"
              @click="publishArticle"
              class="h-10 text-xs font-black"
            >
              {{ t('organizer_news.detail.publish', 'Publikasikan Berita') }}
            </BaseButton>

            <BaseButton
              v-else
              variant="outline"
              block
              icon="ph:archive-box-bold"
              @click="unpublishArticle"
              class="h-10 text-xs font-black"
            >
              {{ t('organizer_news.detail.unpublish', 'Tarik ke Draf') }}
            </BaseButton>
          </div>
        </div>

        <!-- Article Metrics Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
          <h3 class="text-sm font-black text-navy capitalize tracking-wide flex items-center gap-2 pb-3 border-b border-slate-100">
            <Icon icon="ph:chart-line-up-bold" class="text-primary" />
            <span>{{ t('organizer_news.detail.stats_heading', 'Statistik Artikel') }}</span>
          </h3>

          <div class="grid grid-cols-3 gap-2.5">
            <div class="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center">
              <span class="text-[10px] font-black text-slate-400 capitalize block">{{ t('organizer_news.detail.stats_views', 'Views') }}</span>
              <span class="text-lg font-black text-navy block mt-0.5 tabular-nums">{{ (article.views || 0).toLocaleString('id-ID') }}</span>
            </div>

            <div class="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center">
              <span class="text-[10px] font-black text-slate-400 capitalize block">{{ t('organizer_news.detail.stats_words', 'Kata') }}</span>
              <span class="text-lg font-black text-navy block mt-0.5 tabular-nums">{{ wordCount.toLocaleString('id-ID') }}</span>
            </div>

            <div class="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center">
              <span class="text-[10px] font-black text-slate-400 capitalize block">{{ t('organizer_news.detail.stats_read_time', 'Durasi') }}</span>
              <span class="text-lg font-black text-navy block mt-0.5 tabular-nums">{{ readTimeMinutes }}m</span>
            </div>
          </div>
        </div>

        <!-- Quick Share Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
          <h3 class="text-sm font-black text-navy capitalize tracking-wide flex items-center gap-2 pb-3 border-b border-slate-100">
            <Icon icon="ph:share-network-bold" class="text-primary" />
            <span>{{ t('organizer_news.detail.share_title', 'Bagikan Berita') }}</span>
          </h3>

          <div class="space-y-3">
            <div class="space-y-1.5">
              <span class="text-[10px] font-bold text-slate-400 capitalize block">{{ t('organizer_news.detail.share_link_label', 'Tautan Artikel') }}</span>
              <div class="flex items-center gap-2">
                <input
                  type="text"
                  readonly
                  :value="publicNewsUrl"
                  class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 font-mono select-all focus:outline-hidden"
                />
                <button
                  @click="copyPublicUrl"
                  class="px-3 py-2 rounded-xl bg-navy hover:bg-navy-dark text-primary text-xs font-bold flex items-center gap-1 transition-all shrink-0 shadow-2xs"
                >
                  <Icon :icon="copySuccess ? 'ph:check-bold' : 'ph:copy-bold'" />
                  <span>{{ copySuccess ? t('organizer_news.detail.copied', 'Tersalin') : t('organizer_news.detail.copy', 'Salin') }}</span>
                </button>
              </div>
            </div>

            <div class="pt-2">
              <span class="text-[10px] font-bold text-slate-400 capitalize block mb-2">{{ t('organizer_news.detail.share_to_label', 'Bagikan ke Media Sosial') }}</span>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="s in [
                    { id: 'whatsapp', icon: 'ph:whatsapp-logo-fill', bg: 'hover:bg-green-50 text-green-600 border-green-200', label: 'WhatsApp' },
                    { id: 'telegram', icon: 'ph:telegram-logo-fill', bg: 'hover:bg-sky-50 text-sky-600 border-sky-200', label: 'Telegram' },
                    { id: 'twitter', icon: 'ph:x-logo-fill', bg: 'hover:bg-slate-100 text-slate-900 border-slate-200', label: 'X' },
                    { id: 'facebook', icon: 'ph:facebook-logo-fill', bg: 'hover:bg-blue-50 text-blue-600 border-blue-200', label: 'Facebook' }
                  ]"
                  :key="s.id"
                  @click="shareTo(s.id)"
                  :class="s.bg"
                  class="p-2.5 rounded-xl border bg-white flex flex-col items-center justify-center gap-1 transition-all group hover:scale-105"
                  :title="`Bagikan ke ${s.label}`"
                >
                  <Icon :icon="s.icon" class="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Share Dialog (Modal) -->
    <ClientOnly>
      <Teleport to="body">
        <div v-if="showShareDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="share-dialog-backdrop absolute inset-0 bg-navy/70 backdrop-blur-xs" @click="closeShareDialog"></div>
          
          <div class="share-dialog-card relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden z-10">
            <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
            
            <div class="flex items-start justify-between gap-4 mb-6">
              <div class="flex items-center gap-3">
                <div class="size-11 rounded-2xl bg-primary/10 text-navy border border-primary/20 flex items-center justify-center shrink-0">
                  <Icon icon="ph:share-network-bold" class="text-2xl text-primary" />
                </div>
                <div>
                  <h3 class="text-lg font-black text-navy">{{ t('organizer_news.detail.share_title', 'Bagikan Berita') }}</h3>
                  <div class="text-xs text-slate-500 mt-0.5">{{ t('organizer_news.detail.share_desc', 'Sebarkan artikel ini ke sosial media') }}</div>
                </div>
              </div>
              
              <button @click="closeShareDialog" class="text-slate-400 hover:text-navy transition-colors">
                <Icon icon="ph:x-bold" class="text-lg" />
              </button>
            </div>

            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-slate-400 capitalize tracking-wider">{{ t('organizer_news.detail.share_link_label', 'Tautan Berita') }}</label>
                <div class="flex items-center gap-2">
                  <input
                    type="text"
                    readonly
                    :value="publicNewsUrl"
                    class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 font-mono select-all focus:outline-hidden"
                  />
                  <button
                    @click="copyPublicUrl"
                    class="px-4 py-2.5 bg-navy hover:bg-navy-dark text-primary rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Icon :icon="copySuccess ? 'ph:check-bold' : 'ph:copy-bold'" />
                    <span>{{ copySuccess ? t('organizer_news.detail.copied', 'Tersalin') : t('organizer_news.detail.copy', 'Salin') }}</span>
                  </button>
                </div>
              </div>

              <div class="pt-2">
                <label class="text-[10px] font-black text-slate-400 capitalize tracking-wider block mb-2">{{ t('organizer_news.detail.share_to_label', 'Bagikan ke Media Sosial') }}</label>
                <div class="grid grid-cols-4 gap-2.5">
                  <button
                    v-for="social in [
                      { id: 'whatsapp', icon: 'ph:whatsapp-logo-fill', color: 'text-green-600 bg-green-50 hover:bg-green-600 hover:text-white', label: 'WhatsApp' },
                      { id: 'telegram', icon: 'ph:telegram-logo-fill', color: 'text-sky-600 bg-sky-50 hover:bg-sky-600 hover:text-white', label: 'Telegram' },
                      { id: 'twitter', icon: 'ph:x-logo-fill', color: 'text-slate-900 bg-slate-100 hover:bg-black hover:text-white', label: 'X' },
                      { id: 'facebook', icon: 'ph:facebook-logo-fill', color: 'text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white', label: 'Facebook' }
                    ]"
                    :key="social.id"
                    @click="shareTo(social.id)"
                    :class="social.color"
                    class="p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 shadow-2xs hover:scale-105"
                  >
                    <Icon :icon="social.icon" class="text-2xl" />
                    <span class="text-[10px] font-bold">{{ social.label }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </ClientOnly>

    <!-- Delete Confirmation Dialog -->
    <AppDialog
      v-model:show="showDeleteConfirm"
      :title="t('organizer_news.detail.delete_dialog_title', 'Hapus Berita')"
      :message="t('organizer_news.detail.delete_dialog_message', 'Apakah Anda yakin ingin menghapus berita ini?').replace('{title}', article.title)"
      :confirm-text="t('organizer_news.detail.delete_dialog_confirm', 'Ya, Hapus Berita')"
      :cancel-text="t('organizer_news.detail.delete_dialog_cancel', 'Batal')"
      type="danger"
      @confirm="deleteArticle"
    />
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

definePageMeta({
    title: 'Detail Berita',
    layout: 'dashboard'
})

useHead({
    title: computed(() => (article.value?.title || t('organizer_news.detail.title_short', 'Detail Berita')) + ' - Archeris Dashboard')
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
        // fallback
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
        toast.error(t('organizer_news.index.toast_fetch_failed', 'Gagal memuat berita'))
        router.push('/dashboard/organizer/news')
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
        toast.success(t('organizer_news.index.toast_publish_ok', 'Berita berhasil dipublikasikan!'))
        fetchArticle()
    } catch (error) {
        toast.error(t('organizer_news.index.toast_publish_failed', 'Gagal mempublikasikan berita'))
    }
}

const unpublishArticle = async () => {
    try {
        await put(`/news/${article.value.uuid}`, {
            ...article.value,
            status: 'draft'
        })
        article.value.status = 'draft'
        toast.info(t('organizer_news.index.toast_unpublish_ok', 'Berita ditarik ke draf'))
        fetchArticle()
    } catch (error) {
        toast.error(t('organizer_news.index.toast_unpublish_failed', 'Gagal menarik berita'))
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
}

const closeShareDialog = () => {
    showShareDialog.value = false
}

const copyPublicUrl = async () => {
    try {
        await navigator.clipboard.writeText(publicNewsUrl.value)
        copySuccess.value = true
        toast.success(t('organizer_news.detail.copied', 'Tautan berita tersalin!'))
        setTimeout(() => {
            copySuccess.value = false
        }, 2000)
    } catch (e) {
        toast.error(t('organizer_news.detail.copy_failed', 'Gagal menyalin tautan'))
    }
}

const shareTo = (platform) => {
    const url = encodeURIComponent(publicNewsUrl.value)
    const text = encodeURIComponent(article.value.title || 'Berita Archeris')

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
        toast.success(t('organizer_news.index.toast_delete_ok', 'Berita berhasil dihapus'))
        router.push('/dashboard/organizer/news')
    } catch (error) {
        toast.error(t('organizer_news.index.toast_delete_failed', 'Gagal menghapus berita'))
    }
}

onMounted(() => {
    fetchArticle()
})
</script>

<style scoped>
:deep(.article-prose h1) {
  font-size: 1.5rem;
  font-weight: 900;
  color: #0f172a;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

:deep(.article-prose h2) {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

:deep(.article-prose h3) {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

:deep(.article-prose p) {
  margin-bottom: 1rem;
  line-height: 1.75;
  color: #334155;
}

:deep(.article-prose ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
  color: #334155;
}

:deep(.article-prose ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
  color: #334155;
}

:deep(.article-prose li) {
  margin-bottom: 0.35rem;
  line-height: 1.6;
}

:deep(.article-prose blockquote) {
  border-left: 4px solid #facc15;
  padding-left: 1rem;
  margin: 1.25rem 0;
  color: #475569;
  font-style: italic;
  background: #f8fafc;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 0 0.5rem 0.5rem 0;
}

:deep(.article-prose img) {
  border-radius: 1rem;
  margin: 1.5rem 0;
  max-width: 100%;
  height: auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>

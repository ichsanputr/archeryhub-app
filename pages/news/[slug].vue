<template>
    <div class="bg-background-light min-h-screen flex flex-col">
        <!-- ── Fixed dot-grid background ── -->
        <div class="fixed inset-0 -z-10 pointer-events-none opacity-[0.035]"
            style="background-image: radial-gradient(circle, #0f172a 1px, transparent 1px); background-size: 40px 40px;">
        </div>

        <!-- HERO HEADER — News Article -->
        <section class="relative w-full bg-navy overflow-hidden">
            <!-- Background Elements -->
            <div class="absolute inset-0 z-0 text-white">
                <img v-if="article.image" :src="article.image" class="w-full h-full object-cover opacity-25" />
                <div v-else class="w-full h-full bg-gradient-to-br from-navy to-navy-light opacity-80"></div>
                <!-- Dynamic Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-navy/30"></div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-10 sm:pb-14 relative z-10 text-white">
                <!-- Back nav -->
                <NuxtLink :to="localePath('/news')"
                    class="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-white/50 hover:text-primary transition-colors mb-8 sm:mb-12">
                    <Icon icon="ph:arrow-left-bold" />
                    {{ $t('news_detail_page.back_to_news') }}
                </NuxtLink>

                <div class="w-full">
                    <!-- Category Tag -->
                    <span
                        class="inline-block bg-primary text-navy text-[10px] sm:text-xs font-black px-3 py-1 mb-6 tracking-widest rounded-full">
                        {{ $t(`news_page.categories.${article.category}`) || article.category }}
                    </span>

                    <h1
                        class="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight mb-8 sm:mb-10 drop-shadow-lg">
                        {{ article.title }}
                    </h1>

                    <!-- Author & Metadata Row -->
                    <div class="flex flex-wrap items-center gap-6 sm:gap-8 pt-8 border-t border-white/10">
                        <!-- Author -->
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 shadow-lg">
                                <img :src="article.author.avatar" alt="Author" class="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <div class="text-sm font-black text-white">{{ article.author.name }}</div>
                                    <span v-if="!article.organization_id && !article.club_id"
                                        class="px-2 py-0.5 rounded bg-primary text-navy text-[9px] font-black tracking-widest shrink-0">
                                        {{ $t('news_page.official_badge') }}
                                    </span>
                                </div>
                                <div class="text-[10px] font-bold text-white/50 tracking-widest">{{
                                    article.author.role }}</div>
                            </div>
                        </div>

                        <!-- Date -->
                        <div class="flex flex-col">
                            <span
                                class="text-[10px] tracking-widest text-white/40 font-black block mb-1">{{ $t('news_detail_page.published') }}</span>
                            <span class="text-sm sm:text-base font-bold text-primary">{{ article.date }}</span>
                        </div>

                        <!-- Read Time -->
                        <div class="flex flex-col">
                            <span class="text-[10px] tracking-widest text-white/40 font-black block mb-1">{{ $t('news_detail_page.read_time') }}</span>
                            <span class="text-sm sm:text-base font-bold">{{ readTime }} {{ $t('news_detail_page.minutes_unit') }}</span>
                        </div>

                        <!-- Share Button -->
                        <div class="ml-auto self-center flex gap-3">
                            <button @click="openShareDialog"
                                class="size-10 sm:size-12 rounded-xl border border-white/10 hover:border-primary hover:bg-primary transition-all flex items-center justify-center group backdrop-blur-md">
                                <Icon icon="ph:share-network-bold" class="text-xl text-white group-hover:text-navy" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- MAIN BODY -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                <!-- Article Content: 1 Parent Card with BG White -->
                <article class="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-10 space-y-10">
                    <div class="prose prose-slate max-w-none 
                        prose-headings:text-navy prose-headings:font-black 
                        prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6 prose-p:font-medium
                        prose-a:text-primary prose-a:font-bold prose-a:no-underline 
                        prose-strong:text-navy prose-strong:font-black
                        prose-img:rounded-2xl prose-img:shadow-md">
                        <div v-html="article.content"></div>
                    </div>

                    <!-- Tags & Share Box -->
                    <div class="pt-8 border-t border-slate-100">
                        <div v-if="article.tags?.length" class="flex flex-wrap gap-2 mb-8">
                            <span v-for="tag in article.tags" :key="tag"
                                class="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-navy hover:text-white transition-all cursor-default">
                                #{{ tag }}
                            </span>
                        </div>

                        <!-- Footer Share CTA -->
                        <div class="p-6 sm:p-8 bg-navy rounded-2xl text-white relative overflow-hidden group border border-white/10 shadow-md">
                            <div
                                class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all">
                            </div>
                            <div class="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div>
                                    <h4 class="font-black text-xl mb-1 tracking-tight">{{ $t('news_detail_page.share_title') }}</h4>
                                    <p class="text-sm text-white/60 font-medium">{{ $t('news_detail_page.share_desc') }}</p>
                                </div>
                                <div class="flex gap-3">
                                    <button @click="shareToSocial('whatsapp')"
                                        class="size-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#25D366] hover:border-[#25D366] transition-all group/s">
                                        <Icon icon="ph:whatsapp-logo-bold" class="text-xl text-white" />
                                    </button>
                                    <button @click="shareToSocial('facebook')"
                                        class="size-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] transition-all group/s">
                                        <Icon icon="ph:facebook-logo-bold" class="text-xl text-white" />
                                    </button>
                                    <button @click="copyToClipboard"
                                        class="size-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group/s">
                                        <Icon icon="ph:link-bold" class="text-xl text-white group-hover/s:text-navy" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- COMMENT SECTION -->
                    <section class="pt-8 border-t border-slate-100">
                        <div class="flex items-center justify-between mb-8">
                            <h3 class="text-xl font-bold text-navy tracking-tight flex items-center gap-3">
                                <Icon icon="ph:chats-circle-bold" class="text-navy text-2xl" />
                                {{ $t('news_detail_page.comments_title') }} ({{ totalComments }})
                            </h3>
                        </div>

                        <!-- Comment Form -->
                        <div class="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100 mb-10 relative overflow-hidden">
                            <h4 class="font-bold text-slate-500 text-xs mb-6">{{ $t('news_detail_page.write_comment') }}</h4>

                            <form @submit.prevent="submitComment" class="space-y-5">
                                <div v-if="!isLoggedIn" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-2">
                                        <label class="text-xs font-bold text-slate-600 ml-1">{{ $t('news_detail_page.your_name') }}</label>
                                        <input v-model="commentForm.guest_name" type="text"
                                            :placeholder="$t('news_detail_page.name_placeholder')"
                                            class="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-navy font-medium placeholder:text-slate-400 transition-all outline-none text-sm shadow-2xs"
                                            required />
                                    </div>
                                </div>
                                <div v-else
                                    class="flex items-center gap-3 mb-4 p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                                    <div
                                        class="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white font-bold text-xs">
                                        {{ user?.full_name?.charAt(0) || user?.name?.charAt(0) || 'U' }}
                                    </div>
                                    <div class="text-xs font-bold text-slate-500">
                                        {{ $t('news_detail_page.comment_as') }} 
                                        <span class="text-navy font-bold">{{ user?.full_name || user?.name }}</span>
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-600 ml-1">{{ $t('news_detail_page.message_label') }}</label>
                                    <textarea v-model="commentForm.content" rows="4"
                                        :placeholder="$t('news_detail_page.message_placeholder')"
                                        class="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-navy font-medium placeholder:text-slate-400 transition-all outline-none text-sm leading-relaxed shadow-2xs"
                                        required></textarea>
                                </div>

                                <BaseButton type="submit" variant="navy" size="md" :loading="isSubmittingComment" icon="ph:paper-plane-tilt-bold">
                                    {{ isSubmittingComment ? $t('news_detail_page.submitting_button') : $t('news_detail_page.submit_button') }}
                                </BaseButton>
                            </form>
                        </div>

                        <!-- Comment List -->
                        <div class="space-y-6">
                            <div v-if="isCommentsLoading" class="flex flex-col items-center py-12 text-slate-300">
                                <Icon icon="ph:spinner" class="text-3xl animate-spin mb-4" />
                                <span class="font-bold text-xs text-slate-400">{{ $t('news_detail_page.loading_comments') }}</span>
                            </div>

                            <div v-else-if="comments.length === 0"
                                class="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8">
                                <Icon icon="ph:chat-teardrop-dots-bold" class="text-4xl text-slate-300 mx-auto mb-3" />
                                <p class="text-slate-400 text-xs font-bold">{{ $t('news_detail_page.no_comments') }}</p>
                            </div>

                            <div v-else v-for="comment in comments" :key="comment.id" class="group">
                                <div class="flex gap-4 sm:gap-6 items-start">
                                    <div class="flex-shrink-0">
                                        <div
                                            class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-navy font-bold text-base group-hover:bg-navy group-hover:text-white transition-all duration-300 shadow-2xs">
                                            {{ comment.user_name?.charAt(0) || '?' }}
                                        </div>
                                    </div>
                                    <div class="flex-grow pt-0.5">
                                        <div class="flex items-center justify-between mb-1.5">
                                            <div class="flex items-center gap-2">
                                                <h5 class="font-bold text-navy text-xs tracking-wide">{{
                                                    comment.user_name }}</h5>
                                                <span v-if="comment.user_type !== 'guest'"
                                                    class="bg-primary/20 text-navy text-[8px] font-bold px-2 py-0.5 rounded-full tracking-wider">{{ $t('news_detail_page.member_tag') }}</span>
                                            </div>
                                            <span class="text-[10px] font-medium text-slate-400 tracking-wide">{{
                                                formatDate(comment.created_at) }}</span>
                                        </div>
                                        <div
                                            class="text-slate-700 text-sm leading-relaxed font-normal bg-slate-50 p-4 sm:p-5 rounded-2xl rounded-tl-none border border-slate-100 group-hover:border-slate-200 transition-all">
                                            {{ comment.content }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </article>

                <!-- Sidebar -->
                <aside class="lg:col-span-4 space-y-8">
                    <!-- Related News -->
                    <div
                        class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                            <span class="w-1 h-6 bg-primary rounded-full"></span>
                            {{ $t('news_detail_page.related_articles') }}
                        </h3>
                        <div class="space-y-5">
                            <NuxtLink v-for="item in relatedArticles" :key="item.slug" :to="localePath(`/news/${item.slug}`)"
                                class="group flex gap-4 items-start">
                                <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative border border-slate-100 bg-slate-100">
                                    <img :src="item.image" :alt="item.title"
                                        class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h4
                                        class="font-bold text-navy text-sm leading-snug mb-1 line-clamp-2">
                                        {{ item.title }}
                                    </h4>
                                    <span class="text-xs text-slate-400">{{ item.date }}</span>
                                </div>
                            </NuxtLink>
                        </div>
                        <NuxtLink :to="localePath('/news')"
                            class="block w-full text-center mt-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                            {{ $t('news_detail_page.all_news') }}
                        </NuxtLink>
                    </div>

                    <!-- Upcoming Tournaments -->
                    <div class="bg-navy rounded-2xl p-6 shadow-md text-white relative overflow-hidden border border-white/10">
                        <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                        <h3 class="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                            <Icon icon="ph:trophy-bold" class="text-primary" />
                            {{ $t('news_page.upcoming_title') }}
                        </h3>
                        <div class="space-y-4 relative z-10">
                            <div v-if="upcomingTournaments.length === 0" class="text-center py-8">
                                <Icon icon="ph:calendar-blank" class="text-4xl text-white/20 mx-auto mb-2" />
                                <p class="text-sm text-white/60">{{ $t('news_page.no_upcoming') }}</p>
                            </div>
                            <NuxtLink v-for="t in upcomingTournaments" :key="t.id" :to="localePath(`/events/${t.id}`)"
                                class="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div
                                    class="bg-white/10 rounded-xl w-12 h-12 flex flex-col items-center justify-center text-center shrink-0 group-hover:bg-primary group-hover:text-navy transition-colors">
                                    <span class="text-[9px] font-bold text-primary group-hover:text-navy/70 leading-none mb-0.5">{{ t.month }}</span>
                                    <span class="text-lg font-black leading-none">{{ t.day }}</span>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h4 class="font-bold text-xs sm:text-sm leading-tight truncate mb-1">{{ t.title }}</h4>
                                    <div class="flex items-center gap-1 text-[11px] text-slate-400">
                                        <Icon icon="ph:map-pin-bold" class="text-xs shrink-0" />
                                        <span class="truncate">{{ t.location }}</span>
                                    </div>
                                </div>
                            </NuxtLink>
                        </div>
                        <NuxtLink :to="localePath('/events')"
                            class="inline-flex items-center gap-1.5 text-primary text-xs font-bold mt-6 hover:text-white transition-colors relative z-10">
                            {{ $t('news_page.all_tournaments') }}
                            <Icon icon="ph:arrow-right-bold" />
                        </NuxtLink>
                    </div>

                    <!-- Subscribe Card -->
                    <div
                        class="bg-gradient-to-br from-primary to-amber-400 rounded-2xl p-6 shadow-md relative overflow-hidden">
                        <div class="relative z-10">
                            <h4 class="font-black text-navy text-lg mb-1">{{ $t('news_page.subscribe_title') }}</h4>
                            <p class="text-navy/80 text-xs sm:text-sm mb-4 leading-relaxed font-medium">{{ $t('news_page.subscribe_desc') }}</p>
                            <form @submit.prevent="handleSubscribe" class="space-y-2.5">
                                <input v-model="subscribeEmail"
                                    class="w-full px-4 py-2.5 rounded-xl text-sm border-0 focus:ring-2 focus:ring-navy/50 outline-none text-navy placeholder:text-navy/40 shadow-xs"
                                    :placeholder="$t('news_page.subscribe_placeholder')" type="email" required />
                                <BaseButton type="submit" variant="navy" block :loading="isSubscribing">
                                    {{ isSubscribing ? $t('news_page.subscribing_button') : $t('news_page.subscribe_button') }}
                                </BaseButton>
                            </form>
                        </div>
                        <Icon icon="ph:envelope" class="absolute -bottom-6 -right-6 text-[8rem] text-navy/10 rotate-12 pointer-events-none" />
                    </div>
                </aside>
            </div>
        </main>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDateFormat } from '@vueuse/core'
import { useToast } from '~/composables/useToast'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'

const { isLoggedIn, user } = useAuth()
const api = useApi()

definePageMeta({
    layout: 'landing',
    headerTransparent: false
})

const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const toast = useToast()
const requestUrl = useRequestURL()

const route = useRoute()
const slug = route.params.slug
const subscribeEmail = ref('')
const isSubscribing = ref(false)

// Comments logic
const isSubmittingComment = ref(false)
const commentForm = ref({
    guest_name: '',
    content: ''
})

const { data: commentsResponse, pending: isCommentsLoading, refresh: refreshComments } = await useAsyncData(
    `news-comments-${slug}`,
    () => api.get(`/news/${slug}/comments`).catch(() => ({ comments: [], count: 0 })),
    { server: false, lazy: true }
)

const comments = computed(() => commentsResponse.value?.comments || [])
const totalComments = computed(() => commentsResponse.value?.count || 0)

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const lang = locale.value === 'id' ? 'id-ID' : 'en-US'
    try {
        return useDateFormat(dateStr, 'DD MMM YYYY, HH:mm', { locales: lang }).value
    } catch {
        return dateStr
    }
}

const submitComment = async () => {
    if (!commentForm.value.content) return
    if (!isLoggedIn.value && !commentForm.value.guest_name) {
        toast.error(t('news_detail_page.name_error'))
        return
    }

    isSubmittingComment.value = true
    try {
        await api.post(`/news/${slug}/comments`, {
            guest_name: commentForm.value.guest_name,
            content: commentForm.value.content
        })

        toast.success(t('news_detail_page.comment_success'))
        commentForm.value.content = ''
        commentForm.value.guest_name = ''
        await refreshComments()
    } catch (err) {
        toast.error(t('news_detail_page.comment_error'))
    } finally {
        isSubmittingComment.value = false
    }
}

const { data: newsResponse, pending: isLoading, error: newsError } = await useAsyncData(
    `news-${slug}`,
    () => $fetch(`${apiBaseUrl}/news/${slug}`).catch(() => null),
    { server: true }
)

const rawArticleData = computed(() => newsResponse.value?.data || newsResponse.value)

if (newsError.value || (!rawArticleData.value && !isLoading.value)) {
    throw createError({
        statusCode: 404,
        statusMessage: t('news_detail_page.not_found', 'Berita tidak ditemukan'),
        fatal: true
    })
}

const article = computed(() => {
    const data = rawArticleData.value
    const lang = locale.value === 'id' ? 'id-ID' : 'en-US'

    if (!data || !data.title) return {
        title: '',
        excerpt: '',
        published_at: null,
        created_at: null,
        updated_at: null,
        category: 'berita',
        date: '',
        author: { name: 'Archeris Editorial', role: 'Tim Redaksi', avatar: useImageOrDefault(null) },
        image: '',
        content: '',
        tags: []
    }

    const rawDate = data.published_at || data.created_at
    const cleanExcerpt = data.excerpt || (data.content ? data.content.replace(/<[^>]*>?/gm, '').substring(0, 160) : '')

    return {
        title: data.title,
        excerpt: cleanExcerpt,
        published_at: data.published_at,
        created_at: data.created_at,
        updated_at: data.updated_at,
        category: data.category || 'berita',
        date: rawDate ? useDateFormat(rawDate, 'DD MMMM YYYY', { locales: lang }).value : '',
        author: {
            name: data.author_name || 'Tim Redaksi',
            role: 'Archeris Editor',
            avatar: useImageOrDefault(null)
        },
        image: useImageOrDefault(data.image_url),
        imageCredit: 'Archeris Documentation',
        content: data.content || '',
        tags: data.tags ? (typeof data.tags === 'string' ? data.tags.split(',').map(s => s.trim()) : data.tags) : ['Panahan', 'Indonesia', 'Archeris'],
        organization_id: data.organization_id,
        club_id: data.club_id
    }
})

// Calculate read time
const readTime = computed(() => {
    const text = article.value.content || ''
    const wordsPerMinute = 200
    const noOfWords = text.split(/\s/g).length
    const minutes = noOfWords / wordsPerMinute
    return Math.ceil(minutes) || 1
})

const { data: relatedResponse } = await useAsyncData(
    `news-related-${slug}`,
    () => $fetch(`${apiBaseUrl}/news`).catch(() => null),
    { server: true, lazy: true }
)

const relatedArticles = computed(() => {
    const rawData = relatedResponse.value?.data || relatedResponse.value || []
    const lang = locale.value === 'id' ? 'id-ID' : 'en-US'

    return rawData
        .filter(a => a.slug !== slug)
        .slice(0, 3)
        .map(a => ({
            slug: a.slug,
            title: a.title,
            date: a.published_at ? useDateFormat(a.published_at, 'DD MMM YYYY', { locales: lang }).value : '',
            image: useImageOrDefault(a.image_url)
        }))
})

const { data: upcomingResponse } = await useAsyncData(
    `news-upcoming-${slug}`,
    () => $fetch(`${apiBaseUrl}/events?limit=3&status=published`).catch(() => null),
    { server: true, lazy: true }
)

const upcomingTournaments = computed(() => {
    const rawData = upcomingResponse.value?.data || upcomingResponse.value || []
    const events = Array.isArray(rawData) ? rawData : []
    const now = new Date()
    const lang = locale.value === 'id' ? 'id-ID' : 'en-US'

    return events
        .filter(e => {
            if (!e.start_date) return false
            const startDate = new Date(e.start_date)
            return startDate >= now
        })
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        .slice(0, 3)
        .map(e => ({
            id: e.uuid || e.id,
            title: e.name,
            month: e.start_date ? new Date(e.start_date).toLocaleDateString(lang, { month: 'short' }) : '',
            day: e.start_date ? new Date(e.start_date).toLocaleDateString(lang, { day: 'numeric' }) : '',
            location: e.venue || e.location || e.city || ''
        }))
})

const handleSubscribe = async () => {
    if (!subscribeEmail.value) return
    isSubscribing.value = true
    try {
        await $fetch(`${apiBaseUrl}/news/subscribe`, {
            method: 'POST',
            body: { email: subscribeEmail.value }
        })
        toast.success(t('news_page.subscribe_success'))
        subscribeEmail.value = ''
    } catch (err) {
        toast.error(t('news_page.subscribe_error'))
    } finally {
        isSubscribing.value = false
    }
}

const copyToClipboard = () => {
    if (import.meta.client) {
        navigator.clipboard.writeText(window.location.href)
        toast.info(t('news_detail_page.link_copied'))
    }
}

const shareToSocial = (platform) => {
    const url = window.location.href
    const text = `${t('news_detail_page.share_intro')}${article.value.title}`

    let shareUrl = ''
    if (platform === 'whatsapp') {
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`
    } else if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    }

    if (shareUrl) window.open(shareUrl, '_blank')
}

const openShareDialog = () => {
    copyToClipboard()
}

const currentUrl = computed(() => requestUrl?.href || '')

useHead({
    title: computed(() => `${article.value.title || 'Berita'} - Archeris.net`),
    link: [
        { rel: 'canonical', href: currentUrl }
    ],
    script: [
        {
            type: 'application/ld+json',
            children: computed(() => JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                'headline': article.value.title,
                'description': article.value.excerpt || '',
                'image': article.value.image ? [article.value.image] : [],
                'datePublished': article.value.published_at || article.value.created_at,
                'dateModified': article.value.updated_at || article.value.created_at,
                'author': {
                    '@type': 'Person',
                    'name': article.value.author?.name || 'Archeris.net'
                },
                'publisher': {
                    '@type': 'Organization',
                    'name': 'Archeris.net',
                    'url': 'https://archeris.net'
                },
                'url': currentUrl.value
            }))
        }
    ]
})

useSeoMeta({
    title: () => `${article.value.title || 'Berita'} - Archeris.net`,
    description: () => article.value.excerpt || '',
    ogTitle: () => article.value.title || 'Berita',
    ogDescription: () => article.value.excerpt || '',
    ogImage: () => article.value.image || 'https://archeris.net/og-default.jpg',
    ogType: 'article',
    twitterCard: 'summary_large_image',
    twitterTitle: () => article.value.title || 'Berita',
    twitterDescription: () => article.value.excerpt || '',
    twitterImage: () => article.value.image || 'https://archeris.net/og-default.jpg',
})
</script>

<style scoped>
:deep(.prose) {
    --tw-prose-body: #0f172a;
    --tw-prose-headings: #0f172a;
    --tw-prose-links: #0f172a;
    --tw-prose-bold: #0f172a;
}
</style>

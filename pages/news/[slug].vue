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
                <img v-if="article.image" :src="article.image" class="w-full h-full object-cover opacity-30" />
                <div v-else class="w-full h-full bg-gradient-to-br from-navy to-navy-light opacity-80"></div>
                <!-- Dynamic Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent"></div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-10 sm:pb-16 relative z-10 text-white">
                <!-- Back nav -->
                <NuxtLink :to="localePath('/news')"
                    class="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-white/50 hover:text-primary transition-colors mb-8 sm:mb-12">
                    <Icon icon="ph:arrow-left-bold" />
                    {{ $t('news_detail_page.back_to_news') }}
                </NuxtLink>

                <div class="w-full">
                    <!-- Category Tag -->
                    <span
                        class="inline-block bg-primary text-navy text-[10px] sm:text-xs font-black px-2 py-1 mb-6 tracking-widest rounded-sm">
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
                                <div class="text-sm font-black text-white">{{ article.author.name }}</div>
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
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                <!-- Article Content -->
                <article class="lg:col-span-8">
                    <div class="prose prose-slate max-w-none dark:prose-invert 
                        prose-headings:text-navy prose-headings:font-black 
                        prose-p:text-[#0f172a]/70 prose-p:leading-relaxed prose-p:mb-6 prose-p:font-medium
                        prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-navy prose-strong:font-black
                        prose-img:rounded-2xl prose-img:shadow-xl">
                        <div v-html="article.content"></div>
                    </div>

                    <!-- Tags -->
                    <div class="mt-12 pt-8 border-t border-[#0f172a]/10">
                        <div v-if="article.tags?.length" class="flex flex-wrap gap-2 mb-8">
                            <span v-for="tag in article.tags" :key="tag"
                                class="px-3 py-1 border border-[#0f172a]/20 text-[10px] font-black tracking-wider hover:bg-navy hover:text-primary hover:border-navy transition-all cursor-default">
                                #{{ tag }}
                            </span>
                        </div>

                        <!-- Footer Share CTA -->
                        <div class="p-8 bg-navy rounded-3xl text-white relative overflow-hidden group">
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
                    <section class="mt-16 pt-16 border-t border-navy/5">
                        <div class="flex items-center justify-between mb-10">
                            <h3 class="text-xl font-bold text-navy tracking-widest flex items-center gap-3">
                                <Icon icon="ph:chats-circle-bold" class="text-navy text-2xl" />
                                {{ $t('news_detail_page.comments_title') }} ({{ totalComments }})
                            </h3>
                        </div>

                        <!-- Comment Form -->
                        <div class="bg-white rounded-3xl p-8 border border-navy/10 mb-12 relative overflow-hidden">
                            <div class="absolute top-0 left-0 w-1.5 h-full bg-navy/20"></div>
                            <h4 class="font-bold text-navy tracking-widest text-[10px] mb-6 opacity-40">{{ $t('news_detail_page.write_comment') }}</h4>

                            <form @submit.prevent="submitComment" class="space-y-6">
                                <div v-if="!isLoggedIn" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-2">
                                        <label class="text-[10px] font-bold tracking-widest text-navy/40 ml-1">{{ $t('news_detail_page.your_name') }}</label>
                                        <input v-model="commentForm.guest_name" type="text"
                                            :placeholder="$t('news_detail_page.name_placeholder')"
                                            class="w-full px-5 py-3 rounded-xl bg-navy/[0.02] border border-navy/10 focus:ring-1 focus:ring-navy/30 text-navy font-bold placeholder:text-navy/20 transition-all outline-none"
                                            required />
                                    </div>
                                </div>
                                <div v-else
                                    class="flex items-center gap-3 mb-4 p-3 bg-navy/[0.02] rounded-xl border border-navy/5">
                                    <div
                                        class="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white font-bold text-xs">
                                        {{ user?.full_name?.charAt(0) || user?.name?.charAt(0) || 'U' }}
                                    </div>
                                    <div class="text-xs font-bold text-navy/60 tracking-widest">
                                        {{ $t('news_detail_page.comment_as') }} 
                                        <span class="text-navy">{{ user?.full_name || user?.name }}</span>
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <label class="text-[10px] font-bold tracking-widest text-navy/40 ml-1">{{ $t('news_detail_page.message_label') }}</label>
                                    <textarea v-model="commentForm.content" rows="4"
                                        :placeholder="$t('news_detail_page.message_placeholder')"
                                        class="w-full px-5 py-4 rounded-xl bg-navy/[0.02] border border-navy/10 focus:ring-1 focus:ring-navy/30 text-navy font-medium placeholder:text-navy/20 transition-all outline-none"
                                        required></textarea>
                                </div>

                                <button type="submit" :disabled="isSubmittingComment"
                                    class="inline-flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-xl font-bold tracking-widest text-[10px] hover:bg-navy-light transition-all active:scale-95 disabled:opacity-50">
                                    <Icon v-if="isSubmittingComment" icon="ph:spinner" class="animate-spin" />
                                    <Icon v-else icon="ph:paper-plane-tilt-bold" />
                                    {{ isSubmittingComment ? $t('news_detail_page.submitting_button') : $t('news_detail_page.submit_button') }}
                                </button>
                            </form>
                        </div>

                        <!-- Comment List -->
                        <div class="space-y-6">
                            <div v-if="isCommentsLoading" class="flex flex-col items-center py-12 text-navy/20">
                                <Icon icon="ph:spinner" class="text-3xl animate-spin mb-4" />
                                <span class="font-bold tracking-widest text-[10px]">{{ $t('news_detail_page.loading_comments') }}</span>
                            </div>

                            <div v-else-if="comments.length === 0"
                                class="text-center py-16 bg-navy/[0.01] rounded-3xl border border-dashed border-navy/10">
                                <Icon icon="ph:chat-teardrop-dots-bold" class="text-4xl text-navy/10 mx-auto mb-4" />
                                <p class="text-navy/30 text-[10px] font-bold tracking-widest">{{ $t('news_detail_page.no_comments') }}</p>
                            </div>

                            <div v-else v-for="comment in comments" :key="comment.id" class="group">
                                <div class="flex gap-4 sm:gap-6 items-start">
                                    <div class="flex-shrink-0">
                                        <div
                                            class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-navy/5 border border-navy/10 flex items-center justify-center text-navy font-bold text-lg group-hover:bg-navy group-hover:text-white transition-all duration-300">
                                            {{ comment.user_name?.charAt(0) || '?' }}
                                        </div>
                                    </div>
                                    <div class="flex-grow pt-1">
                                        <div class="flex items-center justify-between mb-2">
                                            <div class="flex items-center gap-2">
                                                <h5 class="font-bold text-navy text-xs tracking-widest">{{
                                                    comment.user_name }}</h5>
                                                <span v-if="comment.user_type !== 'guest'"
                                                    class="bg-navy/10 text-navy text-[7px] font-bold px-2 py-0.5 rounded-full tracking-tighter">{{ $t('news_detail_page.member_tag') }}</span>
                                            </div>
                                            <span class="text-[8px] font-bold text-navy/20 tracking-widest">{{
                                                formatDate(comment.created_at) }}</span>
                                        </div>
                                        <div
                                            class="text-navy/70 text-sm leading-relaxed font-medium bg-white p-5 rounded-2xl rounded-tl-none border border-navy/5 group-hover:border-navy/20 transition-all">
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
                        class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 class="text-lg font-bold text-navy dark:text-white mb-6 flex items-center gap-2">
                            <span class="w-1 h-6 bg-primary rounded-full"></span>
                            {{ $t('news_detail_page.related_articles') }}
                        </h3>
                        <div class="space-y-6">
                            <NuxtLink v-for="item in relatedArticles" :key="item.slug" :to="localePath(`/news/${item.slug}`)"
                                class="group flex gap-4 items-start">
                                <div class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
                                    <img :src="item.image" :alt="item.title"
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div>
                                    <h4
                                        class="font-bold text-navy dark:text-white text-sm leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                        {{ item.title }}
                                    </h4>
                                    <span class="text-xs text-slate-400">{{ item.date }}</span>
                                </div>
                            </NuxtLink>
                        </div>
                        <NuxtLink :to="localePath('/news')"
                            class="block w-full text-center mt-6 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            {{ $t('news_detail_page.all_news') }}
                        </NuxtLink>
                    </div>

                    <!-- Upcoming Tournaments -->
                    <div class="bg-navy rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
                        <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
                        <h3 class="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                            <Icon icon="ph:trophy" class="text-primary" />
                            {{ $t('news_page.upcoming_title') }}
                        </h3>
                        <div class="space-y-4 relative z-10">
                            <div v-if="upcomingTournaments.length === 0" class="text-center py-8">
                                <Icon icon="ph:calendar-blank" class="text-4xl text-white/20 mx-auto mb-2" />
                                <p class="text-sm text-white/60">{{ $t('news_page.no_upcoming') }}</p>
                            </div>
                            <NuxtLink v-for="t in upcomingTournaments" :key="t.id" :to="localePath(`/events/${t.id}`)"
                                class="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                                <div
                                    class="bg-white/10 rounded-lg w-12 h-12 flex flex-col items-center justify-center text-center flex-shrink-0">
                                    <span class="text-[10px] font-bold text-primary">{{ t.month }}</span>
                                    <span class="text-lg font-bold leading-none">{{ t.day }}</span>
                                </div>
                                <div>
                                    <h4 class="font-bold text-sm leading-tight mb-0.5">{{ t.title }}</h4>
                                    <div class="flex items-center gap-1 text-xs text-slate-300">
                                        <Icon icon="ph:map-pin" class="text-[10px]" />
                                        {{ t.location }}
                                    </div>
                                </div>
                            </NuxtLink>
                        </div>
                        <NuxtLink :to="localePath('/events')"
                            class="inline-flex items-center gap-2 text-primary text-xs font-black mt-6 hover:text-white transition-all group">
                            {{ $t('news_page.all_tournaments') }}
                            <Icon icon="ph:arrow-right-bold"
                                class="transform group-hover:translate-x-1 transition-transform" />
                        </NuxtLink>
                    </div>

                    <!-- Subscribe Card -->
                    <div
                        class="bg-gradient-to-br from-primary to-primary-hover rounded-2xl p-6 shadow-sm border border-primary relative overflow-hidden">
                        <div class="relative z-10">
                            <h4 class="font-bold text-navy text-lg mb-2">{{ $t('news_page.subscribe_title') }}</h4>
                            <p class="text-navy/80 text-sm mb-4">{{ $t('news_page.subscribe_desc') }}</p>
                            <form @submit.prevent="handleSubscribe" class="space-y-2">
                                <input v-model="subscribeEmail"
                                    class="w-full px-3 py-2 rounded-lg text-sm border-0 focus:ring-2 focus:ring-navy/50 text-slate-800"
                                    :placeholder="$t('news_page.subscribe_placeholder')" type="email" required />
                                <button
                                    class="w-full bg-navy text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-navy-dark transition-colors"
                                    :disabled="isSubscribing">
                                    {{ isSubscribing ? $t('news_page.subscribing_button') : $t('news_page.subscribe_button') }}
                                </button>
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
    () => api.get(`/news/${slug}/comments`),
    { server: true, lazy: true }
)

const comments = computed(() => commentsResponse.value?.comments || [])
const totalComments = computed(() => commentsResponse.value?.count || 0)

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const lang = locale.value === 'id' ? 'id-ID' : locale.value === 'kr' ? 'ko-KR' : 'en-US'
    return new Date(dateStr).toLocaleDateString(lang, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
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

const { data: newsResponse, pending: isLoading } = await useAsyncData(
    `news-${slug}`,
    () => $fetch(`${apiBaseUrl}/news/${slug}`),
    { server: true }
)

const article = computed(() => {
    const data = newsResponse.value?.data || newsResponse.value
    const lang = locale.value === 'id' ? 'id-ID' : locale.value === 'kr' ? 'ko-KR' : 'en-US'

    if (!data) return {
        title: '',
        category: 'event',
        date: '',
        author: { name: '', role: '', avatar: '' },
        image: '',
        content: '',
        tags: []
    }

    return {
        title: data.title,
        category: data.category || 'event',
        date: data.published_at ? new Date(data.published_at).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' }) : new Date(data.created_at).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' }),
        author: {
            name: data.author_name || 'Tim Redaksi',
            role: 'Archery Hub Editor',
            avatar: useImageOrDefault(null)
        },
        image: useImageOrDefault(data.image_url),
        imageCredit: 'Archery Hub Documentation',
        content: data.content || '',
        tags: ['Panahan', 'Indonesia', 'ArcheryHub'] // Fake tags for design since API lacks them
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
    'related-news',
    () => $fetch(`${apiBaseUrl}/news`),
    { server: true, lazy: true }
)

const relatedArticles = computed(() => {
    const rawData = relatedResponse.value?.data || relatedResponse.value || []
    const lang = locale.value === 'id' ? 'id-ID' : locale.value === 'kr' ? 'ko-KR' : 'en-US'

    return rawData
        .filter(a => a.slug !== slug)
        .slice(0, 3)
        .map(a => ({
            slug: a.slug,
            title: a.title,
            date: a.published_at ? new Date(a.published_at).toLocaleDateString(lang, { day: 'numeric', month: 'short', year: 'numeric' }) : '',
            image: useImageOrDefault(a.image_url)
        }))
})

const { data: upcomingResponse } = await useAsyncData(
    'upcoming-events-news-sidebar',
    () => $fetch(`${apiBaseUrl}/events?limit=3&status=published`),
    { server: true, lazy: true }
)

const upcomingTournaments = computed(() => {
    const rawData = upcomingResponse.value?.data || upcomingResponse.value || []
    const events = Array.isArray(rawData) ? rawData : []
    const now = new Date()
    const lang = locale.value === 'id' ? 'id-ID' : locale.value === 'kr' ? 'ko-KR' : 'en-US'

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

useHead({
    title: computed(() => `${article.value.title} - Archeryhub.id`),
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ]
})

useSeoMeta({
    title: () => `${article.value.title} - Archeryhub.id`,
    description: () => article.value.excerpt
})
</script>

<style scoped>
:deep(.prose) {
    --tw-prose-body: #0f172a;
    --tw-prose-headings: #0f172a;
    --tw-prose-links: #f59e0b;
    --tw-prose-bold: #0f172a;
}
</style>

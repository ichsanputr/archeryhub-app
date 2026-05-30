<template>
    <div class="min-h-screen bg-gray-50 docs-page">
        <!-- Breadcrumb bar (not sticky) -->
        <div class="bg-white border-b border-gray-100">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="flex items-center gap-2 h-11 text-xs text-gray-500 overflow-x-auto no-scrollbar">
                    <NuxtLink to="/" class="hover:text-navy transition-colors whitespace-nowrap">{{ $t('nav.home') }}</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-gray-300 shrink-0" />
                    <NuxtLink to="/docs" class="hover:text-navy transition-colors whitespace-nowrap">{{ $t('docs.all_docs') }}</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-gray-300 shrink-0" />
                    <span class="text-navy font-semibold whitespace-nowrap truncate">{{ currentDoc?.title }}</span>
                </div>
            </div>
        </div>

        <div class="container mx-auto px-4 max-w-7xl pt-8 pb-20 flex flex-col lg:flex-row gap-0">
            <!-- Left Sidebar (Navigation) -->
            <aside
                class="flex flex-col w-full lg:w-64 xl:w-72 shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-4 lg:scrollbar-styled self-start mb-8 lg:mb-0">
                <!-- Mobile Toggle Button -->
                <button @click="isMobileMenuOpen = !isMobileMenuOpen"
                    class="lg:hidden flex items-center justify-between w-full bg-white border border-gray-200 rounded-xl px-4 py-3 mb-2 text-sm font-bold text-navy hover:bg-gray-50 transition-colors">
                    <span class="flex items-center gap-2">
                        <Icon icon="ph:list-dashes-bold" class="text-lg text-primary" />
                        {{ $t('docs.sidebar_title') }}
                    </span>
                    <Icon :icon="isMobileMenuOpen ? 'ph:caret-up-bold' : 'ph:caret-down-bold'"
                        class="text-gray-400 text-base" />
                </button>

                <!-- Sidebar content (collapsible on mobile, always visible on desktop) -->
                <div :class="isMobileMenuOpen ? 'block' : 'hidden lg:block'"
                    class="bg-gray-50 lg:bg-transparent -mx-4 px-4 py-4 lg:p-0 lg:mx-0 border-y border-gray-100 lg:border-0 rounded-none lg:rounded-none">

                    <!-- Nav sections -->
                    <div v-for="cat in sidebarVisibleCategories" :key="cat.id" class="mb-4">
                        <div class="flex items-center gap-2 px-2 py-1.5 mb-1">
                            <Icon :icon="cat.icon" class="text-sm text-gray-400" />
                            <span class="text-xs font-black text-gray-400 tracking-widest ">{{ $t(cat.label) }}</span>
                        </div>
                        <div class="space-y-0.5">
                            <NuxtLink v-for="doc in filteredSidebarDocs(cat.id)" :key="doc.slug"
                                :to="`/docs/${doc.slug}`"
                                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all relative group"
                                :class="currentSlug === doc.slug
                                    ? 'bg-navy text-primary font-bold'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-navy font-medium'">
                                <div v-if="currentSlug === doc.slug"
                                    class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full">
                                </div>
                                <span class="leading-snug" :class="currentSlug !== doc.slug ? 'pl-2' : ''">{{ doc.title }}</span>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Main content -->
            <main class="flex-1 min-w-0 w-full lg:pl-8 lg:pr-6">
                <div v-if="currentDoc" class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <!-- Doc header -->
                    <div class="bg-navy px-8 pt-10 pb-8 relative overflow-hidden">
                        <div class="absolute inset-0 opacity-10"
                            style="background-image: linear-gradient(to right, #b7fb23 1px, transparent 1px), linear-gradient(to bottom, #b7fb23 1px, transparent 1px); background-size: 40px 40px;">
                        </div>
                        <div class="relative z-10">
                            <div
                                class="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-primary text-xs font-bold mb-4">
                                <Icon :icon="currentDoc.icon" class="text-sm" />
                                {{ getCategoryLabel(currentDoc.category) }}
                            </div>
                            <h1 class="text-2xl md:text-3xl xl:text-4xl font-black text-white mb-3 leading-tight">{{ currentDoc.title }}</h1>
                            <p class="text-white/60 text-sm">{{ currentDoc.excerpt }}</p>
                            <div class="flex items-center gap-4 mt-4 text-white/40 text-xs">
                                <span class="flex items-center gap-1.5">
                                    <Icon icon="ph:clock-bold" class="text-sm" /> {{ currentDoc.readTime }}
                                </span>
                                <span class="flex items-center gap-1.5">
                                    <Icon icon="ph:calendar-blank-bold" class="text-sm" /> {{ $t('docs.updated_at') }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Doc body -->
                    <div class="px-6 md:px-10 py-8 doc-content" v-html="currentDoc.content"></div>

                    <!-- Share Social Media -->
                    <div class="px-6 md:px-10 pb-8 pt-4 border-t border-gray-100">
                        <h4 class="text-xs font-black text-gray-400 tracking-widest uppercase mb-3">{{ $t('docs.share_title') || 'Share this article' }}</h4>
                        <div class="flex flex-wrap gap-2">
                            <button @click="shareTo('twitter')" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-primary/10 text-navy text-xs font-bold transition-all border border-gray-100 hover:border-primary/30">
                                <Icon icon="simple-icons:x" class="text-sm" />
                                X
                            </button>
                            <button @click="shareTo('facebook')" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-primary/10 text-navy text-xs font-bold transition-all border border-gray-100 hover:border-primary/30">
                                <Icon icon="logos:facebook" class="text-sm" />
                                Facebook
                            </button>
                            <button @click="shareTo('whatsapp')" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-primary/10 text-navy text-xs font-bold transition-all border border-gray-100 hover:border-primary/30">
                                <Icon icon="logos:whatsapp-icon" class="text-sm" />
                                WhatsApp
                            </button>
                            <button @click="copyLink" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-primary/10 text-navy text-xs font-bold transition-all border border-gray-100 hover:border-primary/30">
                                <Icon icon="ph:link-bold" class="text-sm" />
                                {{ linkCopied ? ($t('docs.copied') || 'Copied!') : ($t('docs.copy_link') || 'Copy Link') }}
                            </button>
                        </div>
                    </div>

                    <!-- Navigation buttons -->
                    <div
                        class="px-6 md:px-10 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <NuxtLink v-if="prevDoc" :to="`/docs/${prevDoc.slug}`"
                            class="flex items-center gap-3 group p-4 rounded-2xl hover:bg-gray-50 border border-gray-100 transition-all w-full sm:max-w-xs justify-start">
                            <Icon icon="ph:arrow-left-bold"
                                class="text-gray-400 group-hover:text-primary transition-colors shrink-0" />
                            <div class="text-left min-w-0">
                                <div class="text-xs text-gray-400 mb-0.5">{{ $t('docs.previous') }}</div>
                                <div
                                    class="text-sm font-bold text-navy truncate group-hover:text-primary transition-colors">
                                    {{ prevDoc.title }}</div>
                            </div>
                        </NuxtLink>
                        <div v-else class="hidden sm:block"></div>
                        <NuxtLink v-if="nextDoc" :to="`/docs/${nextDoc.slug}`"
                            class="flex items-center gap-3 group p-4 rounded-2xl hover:bg-gray-50 border border-gray-100 transition-all w-full sm:max-w-xs justify-end text-right sm:ml-auto">
                            <div class="min-w-0">
                                <div class="text-xs text-gray-400 mb-0.5">{{ $t('docs.next') }}</div>
                                <div
                                    class="text-sm font-bold text-navy truncate group-hover:text-primary transition-colors">
                                    {{ nextDoc.title }}</div>
                            </div>
                            <Icon icon="ph:arrow-right-bold"
                                class="text-gray-400 group-hover:text-primary transition-colors shrink-0" />
                        </NuxtLink>
                    </div>
                </div>

                <div v-else class="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
                    <Icon icon="ph:file-x-bold" class="text-5xl text-gray-300 mb-4" />
                    <h2 class="text-xl font-black text-navy mb-2">{{ $t('docs.not_found_title') }}</h2>
                    <p class="text-gray-500 mb-6 text-sm">{{ $t('docs.not_found_desc') }}</p>
                    <NuxtLink to="/docs"
                        class="inline-flex items-center gap-2 bg-navy text-primary font-bold px-6 py-2.5 rounded-xl hover:bg-navy/90 transition-all text-sm">
                        <Icon icon="ph:arrow-left-bold" />
                        {{ $t('docs.back_to_docs') }}
                    </NuxtLink>
                </div>

                <!-- Comments Section -->
                <div v-if="currentDoc" class="mt-8 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-10">
                    <h3 class="text-lg font-black text-navy mb-6 flex items-center gap-2">
                        <Icon icon="ph:chat-circle-dots-bold" class="text-primary text-xl" />
                        {{ $t('docs.comments_title') || 'Discussion' }} ({{ comments.length }})
                    </h3>

                    <!-- Comment Form -->
                    <form @submit.prevent="submitComment" class="mb-8 space-y-4">
                        <div v-if="!isLoggedIn" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-400 uppercase mb-2">{{ $t('docs.comment_name') || 'Your Name' }}</label>
                                <input v-model="commentForm.guest_name" type="text" required
                                    class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-navy placeholder:text-gray-400 font-medium"
                                    :placeholder="$t('docs.comment_name_placeholder') || 'Enter your name...'" />
                            </div>
                        </div>
                        <div v-else class="text-xs text-gray-500 font-bold mb-2">
                            {{ $t('docs.commenting_as') || 'Commenting as' }}: <span class="text-navy font-bold">{{ user?.full_name }}</span>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase mb-2">{{ $t('docs.comment_message') || 'Comment' }}</label>
                            <textarea v-model="commentForm.content" rows="4" required
                                class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-navy placeholder:text-gray-400 font-medium"
                                :placeholder="$t('docs.comment_message_placeholder') || 'Write your thoughts...'"></textarea>
                        </div>

                        <div class="flex justify-end">
                            <button type="submit" :disabled="isSubmittingComment || !commentForm.content"
                                class="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover disabled:bg-gray-100 disabled:text-gray-400 text-navy font-bold px-6 py-3 rounded-2xl transition-all text-sm">
                                <Icon v-if="isSubmittingComment" icon="ph:spinner-bold" class="animate-spin text-base" />
                                {{ isSubmittingComment ? ($t('docs.submitting') || 'Submitting...') : ($t('docs.submit_comment') || 'Submit Comment') }}
                            </button>
                        </div>
                    </form>

                    <!-- Comments List -->
                    <div v-if="isCommentsLoading" class="flex flex-col items-center py-10 text-gray-300">
                        <Icon icon="ph:spinner-bold" class="mx-auto block animate-spin text-3xl mb-2" />
                        <span class="text-xs font-bold tracking-wider">{{ $t('docs.loading_comments') || 'Loading comments...' }}</span>
                    </div>

                    <div v-else-if="comments.length === 0" class="text-center py-10 border border-dashed border-gray-100 rounded-2xl">
                        <Icon icon="ph:chat-circle-dots-light" class="mx-auto block text-4xl text-gray-300 mb-2" />
                        <p class="text-gray-400 text-xs font-bold tracking-wider">{{ $t('docs.no_comments') || 'No comments yet. Be the first to share your thoughts!' }}</p>
                    </div>

                    <div v-else class="space-y-6">
                        <div v-for="comment in threadedComments" :key="comment.id" class="space-y-4">
                            <!-- Root Comment Card -->
                            <div class="flex gap-4 p-4 rounded-2xl hover:bg-gray-50/50 transition-colors border border-gray-50 bg-white">
                                <!-- Avatar -->
                                <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden font-bold text-navy text-sm dark:border-slate-800">
                                    <Icon icon="ph:user-bold" class="text-gray-400" />
                                </div>
                                <!-- Comment Content -->
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between gap-2 mb-1">
                                        <h5 class="font-bold text-sm text-navy truncate">{{ comment.user_name }}</h5>
                                        <span class="text-[10px] font-medium text-gray-400 whitespace-nowrap">{{ formatDate(comment.created_at) }}</span>
                                    </div>
                                    <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{{ comment.content }}</p>
                                    
                                    <!-- Actions (Reply Button) -->
                                    <div class="flex items-center gap-4 mt-2">
                                        <button 
                                            @click="startReply(comment.id)" 
                                            class="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors capitalize"
                                        >
                                            <Icon icon="ph:arrow-bend-up-left-bold" />
                                            <span>reply</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Reply Form (if replying to this comment) -->
                            <div v-if="replyingToId === comment.id" class="ml-10 p-4 bg-gray-50 rounded-2xl border border-gray-100 dark:bg-slate-900/50 dark:border-slate-800 space-y-3">
                                <div class="text-xs text-gray-500 font-bold">
                                    replying to <span class="text-navy">{{ comment.user_name }}</span>:
                                </div>
                                <div v-if="!isLoggedIn" class="grid grid-cols-1 gap-4">
                                    <input v-model="replyForm.guest_name" type="text" required
                                        class="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors text-navy placeholder:text-gray-400 font-medium"
                                        placeholder="your name..." />
                                </div>
                                <textarea v-model="replyForm.content" rows="2" required
                                    class="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors text-navy placeholder:text-gray-400 font-medium"
                                    placeholder="write a reply..."></textarea>
                                <div class="flex justify-end gap-2">
                                    <button 
                                        @click="cancelReply" 
                                        class="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all text-xs font-bold"
                                    >
                                        cancel
                                    </button>
                                    <button 
                                        @click="submitReply(comment.id)" 
                                        :disabled="isSubmittingReply || !replyForm.content || (!isLoggedIn && !replyForm.guest_name)"
                                        class="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-gray-100 disabled:text-gray-400 text-navy font-bold transition-all text-xs flex items-center gap-1"
                                    >
                                        <Icon v-if="isSubmittingReply" icon="ph:spinner-bold" class="animate-spin" />
                                        <span>submit</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Replies List -->
                            <div v-if="comment.replies && comment.replies.length > 0" class="ml-10 pl-4 border-l-2 border-gray-100 dark:border-slate-800 space-y-4">
                                <div v-for="reply in comment.replies" :key="reply.id" class="flex gap-3 p-3.5 rounded-xl bg-gray-50/50 dark:bg-slate-900/30 border border-gray-50 dark:border-slate-800">
                                    <!-- Avatar -->
                                    <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-200 dark:border-slate-800 overflow-hidden font-bold text-navy text-xs">
                                        <Icon icon="ph:user-bold" class="text-gray-400" />
                                    </div>
                                    <!-- Content -->
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center justify-between gap-2 mb-0.5">
                                            <h6 class="font-bold text-xs text-navy truncate">{{ reply.user_name }}</h6>
                                            <span class="text-[9px] font-medium text-gray-400 whitespace-nowrap">{{ formatDate(reply.created_at) }}</span>
                                        </div>
                                        <p class="text-gray-600 text-xs leading-relaxed whitespace-pre-line">{{ reply.content }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <!-- Right sidebar: Table of contents -->
            <aside class="hidden lg:block w-56 shrink-0 pl-4 self-start sticky top-24">
                <div class="max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-styled flex flex-col">
                    <div class="text-xs font-black text-gray-400 tracking-widest mb-3">{{ $t('docs.on_this_page') }}</div>
                    <nav class="space-y-1">
                        <a v-for="heading in currentDoc?.toc || []" :key="heading.id" :href="`#${heading.id}`"
                            class="block text-sm py-1.5 transition-colors leading-snug" :class="[
                                heading.level === 2 ? 'text-gray-600 hover:text-primary font-medium pl-0' : 'text-gray-400 hover:text-primary pl-3 text-xs'
                            ]">
                            {{ translateHeadingText(heading.text) }}
                        </a>
                    </nav>

                    <!-- Divider -->
                    <div class="mt-6 pt-6 border-t border-gray-100">
                        <NuxtLink to="/docs"
                            class="flex items-center gap-2 text-xs text-gray-400 hover:text-primary transition-colors font-medium mb-3">
                            <Icon icon="ph:arrow-left-bold" class="text-xs" /> {{ $t('docs.all_docs') }}
                        </NuxtLink>
                        <NuxtLink to="/contact"
                            class="flex items-center gap-2 text-xs text-gray-400 hover:text-primary transition-colors font-medium">
                            <Icon icon="ph:chat-circle-dots-bold" class="text-sm" /> {{ $t('docs.contact_support') }}
                        </NuxtLink>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

definePageMeta({ layout: 'docs' })

const { t, locale } = useI18n()
const apiBaseUrl = useApiBaseUrl()

const route = useRoute()
const router = useRouter()
const currentSlug = computed(() => {
    const raw = route.params.slug
    if (Array.isArray(raw)) return raw.join('/')
    return raw ? String(raw) : ''
})
const sidebarSearch = ref('')
const isMobileMenuOpen = ref(false)

watch(currentSlug, () => {
    isMobileMenuOpen.value = false // Auto close on navigation in mobile
})

const categories = [
    { id: 'dashboard', label: 'docs.categories.dashboard', icon: 'ph:monitor-bold' },
    { id: 'archer', label: 'docs.categories.archer', icon: 'ph:user-bold' },
    { id: 'archery', label: 'docs.categories.archery', icon: 'ph:crosshair-bold' },
    { id: 'subscription', label: 'docs.categories.subscription', icon: 'ph:crown-bold' },
    { id: 'event', label: 'docs.categories.event', icon: 'ph:trophy-bold' },
    { id: 'scoring', label: 'docs.categories.scoring', icon: 'ph:target-bold' },
    { id: 'marketplace', label: 'docs.categories.marketplace', icon: 'ph:storefront-bold' },
]

const sidebarCategories = categories

const getCategoryLabel = (id) => {
    const cat = categories.find(c => c.id === id)
    return cat ? t(cat.label) : id
}

// Fetch all docs list for sidebar navigation & prev/next calculations
const { data: docsList } = await useAsyncData(
    'docs-api-sidebar',
    () => $fetch(`${apiBaseUrl}/docs?lang=${locale.value}`),
    {
        watch: [locale]
    }
)

const docs = computed(() => docsList.value || [])

// Canonicalize legacy non-nested URLs like /docs/archer-profile -> /docs/archer/archer-profile
watch([docs, currentSlug], () => {
    const slug = currentSlug.value
    if (!slug || slug.includes('/')) return

    // Explicit legacy slug aliases
    const legacyAliases: Record<string, string> = {
        'user-roles': 'account-types',
    }
    const alias = legacyAliases[slug]
    if (alias) {
        const matchAlias = docs.value.find(d => typeof d.slug === 'string' && d.slug.endsWith('/' + alias))
        if (matchAlias?.slug) {
            router.replace(`/docs/${matchAlias.slug}`)
            return
        }
    }

    const match = docs.value.find(d => typeof d.slug === 'string' && d.slug.endsWith('/' + slug))
    if (match?.slug) {
        router.replace(`/docs/${match.slug}`)
    }
}, { immediate: true })

// Fetch details for the current doc slug
const { data: currentDocData } = await useAsyncData(
    () => `doc-detail-${currentSlug.value}-${locale.value}`,
    () => $fetch(`${apiBaseUrl}/docs/${currentSlug.value}?lang=${locale.value}`),
    {
        watch: [currentSlug, locale]
    }
)

const currentDoc = computed(() => currentDocData.value)

// Calculate prev/next
const currentIndex = computed(() => docs.value.findIndex(d => d.slug === currentSlug.value))
const prevDoc = computed(() => currentIndex.value > 0 ? docs.value[currentIndex.value - 1] : null)
const nextDoc = computed(() => currentIndex.value >= 0 && currentIndex.value < docs.value.length - 1 ? docs.value[currentIndex.value + 1] : null)

const filteredSidebarDocs = (categoryId) => {
    return docs.value.filter(d => {
        const matchCat = d.category === categoryId
        const matchSearch = sidebarSearch.value === '' ||
            d.title.toLowerCase().includes(sidebarSearch.value.toLowerCase())
        return matchCat && matchSearch
    })
}

const sidebarVisibleCategories = computed(() => {
    return sidebarCategories.filter(cat => filteredSidebarDocs(cat.id).length > 0)
})

// translateHeadingText fallback no longer needed, we render text directly
const translateHeadingText = (text) => {
    return text
}

// Authentication & API
const { isLoggedIn, user } = useAuth()
const api = useApi()

// Social Sharing
const linkCopied = ref(false)
const shareTo = (platform) => {
    if (!import.meta.client) return
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(currentDoc.value?.title || 'Archeris.net Documentation')
    
    let shareUrl = ''
    if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
    } else if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
    } else if (platform === 'whatsapp') {
        shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank')
    }
}

const copyLink = () => {
    if (!import.meta.client) return
    navigator.clipboard.writeText(window.location.href).then(() => {
        linkCopied.value = true
        setTimeout(() => {
            linkCopied.value = false
        }, 2000)
    })
}

// Comments
const isCommentsLoading = ref(false)
const isSubmittingComment = ref(false)
const isSubmittingReply = ref(false)
const comments = ref([])
const commentForm = ref({
    guest_name: '',
    content: ''
})
const replyingToId = ref(null)
const replyForm = ref({
    guest_name: '',
    content: ''
})

const threadedComments = computed(() => {
    const list = [...comments.value]
    // Filter root comments (no parent_id)
    const roots = list.filter(c => !c.parent_id)
    // Filter replies (have parent_id)
    const replies = list.filter(c => c.parent_id)
    
    // Nest one level of replies under their parent
    return roots.map(root => {
        return {
            ...root,
            replies: replies.filter(reply => reply.parent_id === root.id)
        }
    })
})

const startReply = (commentId) => {
    replyingToId.value = commentId
    replyForm.value.content = ''
    replyForm.value.guest_name = ''
}

const cancelReply = () => {
    replyingToId.value = null
    replyForm.value.content = ''
    replyForm.value.guest_name = ''
}

const submitReply = async (parentId) => {
    if (!replyForm.value.content) return
    if (!isLoggedIn.value && !replyForm.value.guest_name) return
    
    isSubmittingReply.value = true
    try {
        await api.post(`/docs/${currentSlug.value}/comments`, {
            guest_name: replyForm.value.guest_name,
            content: replyForm.value.content,
            parent_id: parentId
        })
        cancelReply()
        await fetchComments()
    } catch (error) {
        console.error('Failed to submit reply:', error)
    } finally {
        isSubmittingReply.value = false
    }
}

const fetchComments = async () => {
    if (!currentSlug.value) return
    isCommentsLoading.value = true
    try {
        const response = await api.get(`/docs/${currentSlug.value}/comments`)
        comments.value = response?.comments || []
    } catch (error) {
        console.error('Failed to fetch doc comments:', error)
    } finally {
        isCommentsLoading.value = false
    }
}

const submitComment = async () => {
    if (!commentForm.value.content) return
    if (!isLoggedIn.value && !commentForm.value.guest_name) return
    
    isSubmittingComment.value = true
    try {
        await api.post(`/docs/${currentSlug.value}/comments`, {
            guest_name: commentForm.value.guest_name,
            content: commentForm.value.content
        })
        commentForm.value.content = ''
        commentForm.value.guest_name = ''
        await fetchComments()
    } catch (error) {
        console.error('Failed to submit comment:', error)
    } finally {
        isSubmittingComment.value = false
    }
}

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
        const date = new Date(dateStr)
        return date.toLocaleDateString(locale.value === 'id' ? 'id-ID' : 'en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch (e) {
        return dateStr
    }
}

// Watch for slug changes to re-fetch comments
watch(currentSlug, () => {
    fetchComments()
}, { immediate: true })

useHead(computed(() => ({
    title: currentDoc.value ? `${currentDoc.value.title} - Archeris` : 'Dokumentasi - Archeris',
    meta: [{ name: 'description', content: currentDoc.value?.excerpt || '' }]
})))
</script>

<style>
.doc-content h2 {
    font-size: 1.35rem;
    font-weight: 900;
    color: #0f172a;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #f1f5f9;
    scroll-margin-top: 7rem;
}

.doc-content p {
    color: #4b5563;
    line-height: 1.8;
    margin-bottom: 1rem;
    font-size: 0.95rem;
}

.doc-content ul,
.doc-content ol {
    margin: 0.75rem 0 1.25rem 1.25rem;
    color: #4b5563;
    font-size: 0.95rem;
    line-height: 1.8;
}

.doc-content ul {
    list-style-type: disc;
    padding-left: 1rem;
}

.doc-content ol {
    list-style-type: decimal;
    padding-left: 1rem;
}

.doc-content li {
    margin-bottom: 0.4rem;
}

.doc-content strong {
    color: #0f172a;
    font-weight: 700;
}

.doc-content a {
    color: #b7fb23;
    text-decoration: underline;
}

.doc-content a:hover {
    opacity: 0.8;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-styled::-webkit-scrollbar {
    width: 4px;
}

.scrollbar-styled::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-styled::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>

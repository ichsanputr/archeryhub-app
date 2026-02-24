<template>
    <main class="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 pt-20 md:pt-24">
        <!-- Breadcrumb -->
        <div class="mb-8">
            <Breadcrumbs :items="[{ label: 'Berita', path: '/news' }]" :current="article.title" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <!-- Article Content -->
            <article class="lg:col-span-8">
                <div class="mb-8">
                    <div class="flex items-center gap-3 mb-4">
                        <span
                            class="bg-navy/10 text-navy dark:bg-primary/10 dark:text-primary px-3 py-1 rounded-full text-xs font-bold  tracking-wider">
                            {{ article.category }}
                        </span>
                        <div
                            class="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-slate-500 text-xs font-bold">
                            <Icon icon="ph:calendar-blank-bold" class="text-sm" />
                            {{ article.date }}
                        </div>
                        <div
                            class="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-slate-500 text-xs font-bold">
                            <Icon icon="ph:clock-bold" class="text-sm" />
                            {{ readTime }} mnt baca
                        </div>
                    </div>
                    <h1
                        class="text-3xl md:text-4xl lg:text-5xl font-black text-navy dark:text-white leading-tight mb-6">
                        {{ article.title }}
                    </h1>

                    <div class="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-8">
                        <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                            <img :src="article.author.avatar" alt="Author" class="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div class="text-sm font-bold text-navy dark:text-white">{{ article.author.name }}</div>
                            <div class="text-xs text-slate-500">{{ article.author.role }}</div>
                        </div>
                        <div class="ml-auto flex items-center gap-3">
                            <span
                                class="hidden sm:block text-xs font-bold text-slate-400  tracking-wider">Bagikan:</span>
                            <div class="flex gap-2">
                                <button
                                    class="p-2 text-slate-400 hover:text-green-500 transition-all rounded-xl bg-gray-50 hover:bg-green-50">
                                    <Icon icon="ph:whatsapp-logo-bold" class="text-xl" />
                                </button>
                                <button
                                    class="p-2 text-slate-400 hover:text-blue-600 transition-all rounded-xl bg-gray-50 hover:bg-blue-50">
                                    <Icon icon="ph:facebook-logo-bold" class="text-xl" />
                                </button>
                                <button
                                    class="p-2 text-slate-400 hover:text-navy transition-all rounded-xl bg-gray-50 hover:bg-navy/10">
                                    <Icon icon="ph:link-bold" class="text-xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-10 rounded-2xl overflow-hidden shadow-lg aspect-video relative">
                    <img :src="article.image" :alt="article.title"
                        class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div
                        class="absolute bottom-4 right-4 text-white/80 text-xs bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                        Photo: {{ article.imageCredit || 'Archery Hub Documentation' }}
                    </div>
                </div>

                <!-- Article text -->
                <div class="prose prose-slate prose-lg max-w-none dark:prose-invert 
                    prose-headings:text-navy prose-headings:font-black 
                    prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-navy prose-strong:font-black">
                    <div v-html="article.content"></div>
                </div>

                <!-- Footer Share -->
                <div
                    class="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 class="font-black text-navy text-lg mb-1">Apakah artikel ini bermanfaat?</h4>
                        <p class="text-sm text-slate-500">Bagikan artikel ini ke teman panahan kamu!</p>
                    </div>
                    <div class="flex gap-3">
                        <BaseButton variant="outline" size="sm" icon="ph:whatsapp-logo-bold"
                            class="!bg-white hover:!text-green-600">WhatsApp</BaseButton>
                        <BaseButton variant="outline" size="sm" icon="ph:facebook-logo-bold"
                            class="!bg-white hover:!text-blue-600">Facebook</BaseButton>
                        <BaseButton variant="outline" size="sm" icon="ph:link-bold" class="!bg-white">Salin
                        </BaseButton>
                    </div>
                </div>

                <div class="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                    <div class="flex flex-wrap gap-2 mb-6">
                        <a v-for="tag in article.tags" :key="tag" href="#"
                            class="px-3 py-1 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                            #{{ tag }}
                        </a>
                    </div>
                </div>
            </article>

            <!-- Sidebar -->
            <aside class="lg:col-span-4 space-y-8">
                <!-- Related News -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 class="text-lg font-bold text-navy dark:text-white mb-6 flex items-center gap-2">
                        <span class="w-1 h-6 bg-primary rounded-full"></span>
                        Artikel Terkait
                    </h3>
                    <div class="space-y-6">
                        <NuxtLink v-for="item in relatedArticles" :key="item.slug" :to="`/news/${item.slug}`"
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
                    <NuxtLink to="/news"
                        class="block w-full text-center mt-6 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Lihat Semua Berita
                    </NuxtLink>
                </div>

                <!-- Upcoming Tournaments -->
                <div class="bg-navy rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
                    <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
                    <h3 class="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                        <span class="material-symbols-outlined text-primary">emoji_events</span>
                        Event Terbaru
                    </h3>
                    <div class="space-y-4 relative z-10">
                        <div v-if="upcomingTournaments.length === 0" class="text-center py-8">
                            <Icon icon="ph:calendar-blank" class="text-4xl text-white/20 mx-auto mb-2" />
                            <p class="text-sm text-white/60">Belum ada event mendatang</p>
                        </div>
                        <NuxtLink v-for="t in upcomingTournaments" :key="t.id" :to="`/events/${t.id}`"
                            class="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                            <div
                                class="bg-white/10 rounded-lg w-12 h-12 flex flex-col items-center justify-center text-center flex-shrink-0">
                                <span class="text-[10px]  font-bold text-primary">{{ t.month }}</span>
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
                    <NuxtLink to="/events"
                        class="inline-flex items-center gap-2 text-primary text-xs font-black mt-6 hover:text-white transition-all group">
                        Lihat Kalender Event
                        <Icon icon="ph:arrow-right-bold"
                            class="transform group-hover:translate-x-1 transition-transform" />
                    </NuxtLink>
                </div>

                <!-- Subscribe -->
                <div
                    class="bg-gradient-to-br from-primary to-primary-hover rounded-2xl p-6 shadow-sm border border-primary relative overflow-hidden">
                    <div class="relative z-10">
                        <h4 class="font-bold text-navy text-lg mb-2">Langganan Berita</h4>
                        <p class="text-navy/80 text-sm mb-4">Dapatkan berita panahan terbaru langsung di email Anda.</p>
                        <form class="space-y-2">
                            <input
                                class="w-full px-3 py-2 rounded-lg text-sm border-0 focus:ring-2 focus:ring-navy/50 text-slate-800"
                                placeholder="Alamat email Anda" type="email" required />
                            <button
                                class="w-full bg-navy text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-navy-dark transition-colors">Langganan</button>
                        </form>
                    </div>
                    <span
                        class="material-symbols-outlined absolute -bottom-6 -right-6 text-[8rem] text-navy/10 rotate-12 pointer-events-none">mark_email_unread</span>
                </div>
            </aside>
        </div>
    </main>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
    layout: 'landing',
    headerTransparent: false
})

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

const route = useRoute()
const slug = route.params.slug

const { data: newsResponse, pending: isLoading } = await useAsyncData(
    `news-${slug}`,
    () => $fetch(`${apiBaseUrl}/news/${slug}`),
    { server: true }
)

const article = computed(() => {
    const data = newsResponse.value?.data || newsResponse.value
    if (!data) return {
        title: '',
        category: '',
        date: '',
        author: { name: '', role: '', avatar: '' },
        image: '',
        content: '',
        tags: []
    }

    return {
        title: data.title,
        category: data.category || 'event',
        date: data.published_at ? new Date(data.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date(data.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        author: {
            name: data.author_name || 'Tim Redaksi',
            role: 'Archery Hub Indonesia',
            avatar: useImageOrDefault(null)
        },
        image: useImageOrDefault(data.image_url),
        imageCredit: 'Archery Hub Documentation',
        content: data.content || '',
        tags: [] // Tags are not currently in the API
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
    return rawData
        .filter(a => a.slug !== slug)
        .slice(0, 3)
        .map(a => ({
            slug: a.slug,
            title: a.title,
            date: a.published_at ? new Date(a.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '',
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

    // Filter only upcoming events (start_date >= today) and map
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
            month: e.start_date ? new Date(e.start_date).toLocaleDateString('id-ID', { month: 'short' }) : '',
            day: e.start_date ? new Date(e.start_date).toLocaleDateString('id-ID', { day: 'numeric' }) : '',
            location: e.venue || e.location || e.city || ''
        }))
})

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
.material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>

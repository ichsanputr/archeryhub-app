<template>
    <section class="py-24 sm:py-32 bg-[#F8FAFC] border-t border-slate-100 overflow-hidden relative">
        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <!-- Section Header -->
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                    <span class="px-3.5 py-1 bg-primary/20 border border-primary/30 text-navy text-[11px] font-bold rounded-full inline-block mb-4">
                        {{ $t('home.blog_section.tag', 'Scoring & Knowledge Base') }}
                    </span>
                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-navy leading-tight font-display tracking-tight">
                        {{ $t('home.blog_section.title', 'Archery Scoring Insights') }} <br class="hidden sm:block" />
                        <span class="text-navy/70">{{ $t('home.blog_section.subtitle', '& Tournament Guides') }}</span>
                    </h2>
                </div>
                <div>
                    <NuxtLink to="/blog"
                        class="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-navy hover:text-navy hover:border-slate-300 font-bold text-sm transition-all shadow-xs hover:shadow-sm group">
                        <span>{{ $t('home.blog_section.view_all', 'Explore All Guides') }}</span>
                        <Icon icon="ph:arrow-right-bold" class="text-base group-hover:translate-x-1 transition-transform" />
                    </NuxtLink>
                </div>
            </div>

            <!-- Articles Cards Grid / Mobile Horizontal Scroll -->
            <div class="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-x-visible -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar snap-x snap-mandatory md:snap-none pb-6 md:pb-0">
                <NuxtLink v-for="article in displayArticles" :key="article.slug"
                    :to="`/blog/${article.slug}`"
                    class="min-w-[280px] sm:min-w-[340px] md:min-w-0 w-[82vw] sm:w-[360px] md:w-auto snap-center shrink-0 md:shrink bg-white rounded-[28px] overflow-hidden border border-slate-200/80 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 group cursor-pointer h-full">
                    
                    <!-- Full-Covering Header Thumbnail (16:9 matches thumbnail image aspect ratio) -->
                    <div class="relative w-full aspect-[16/9] bg-slate-900 overflow-hidden shrink-0">
                        <img :src="article.image || '/hero-berita.jpeg'" :alt="article.title"
                            @error="(e) => (e.target.src = '/hero-berita.jpeg')"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            loading="lazy" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        <div class="absolute top-3.5 left-3.5">
                            <span class="bg-navy/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-lg tracking-wider border border-white/10 shadow-xs">
                                {{ article.category }}
                            </span>
                        </div>
                    </div>

                    <!-- Card Body -->
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <!-- Metadata -->
                            <div class="flex items-center gap-2 text-slate-400 text-xs font-bold mb-2.5">
                                <span>{{ article.date }}</span>
                                <span>•</span>
                                <span>{{ article.read_time || 6 }} min read</span>
                            </div>

                            <!-- Title -->
                            <h3 class="text-lg sm:text-xl font-black text-navy leading-snug font-display group-hover:text-slate-900 transition-colors line-clamp-2 mb-2.5">
                                {{ article.title }}
                            </h3>

                            <!-- Excerpt -->
                            <p class="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 font-normal">
                                {{ article.excerpt }}
                            </p>
                        </div>

                        <!-- Footer / Author -->
                        <div class="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                            <div class="flex items-center gap-2.5">
                                <img 
                                    :src="article.author?.avatar || '/profile-author.png'" 
                                    :alt="(article.author?.name || 'Archeris Editorial Team') + ' Avatar'"
                                    class="w-6 h-6 rounded-full bg-slate-100 object-cover border border-slate-200 shrink-0" 
                                />
                                <span class="text-xs font-bold text-navy">{{ article.author?.name || 'Archeris Editorial Team' }}</span>
                            </div>
                            <span class="text-slate-950 font-black text-xs inline-flex items-center gap-1 group-hover:text-black group-hover:translate-x-1 transition-all">
                                Read article <Icon icon="ph:arrow-right-bold" />
                            </span>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { articles as staticArticles } from '~/data/articles/index'

const { get } = useApi()

const { data: dbArticles } = await useAsyncData('home-blog-articles', async () => {
    try {
        const res = await get('/blog/articles')
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
            return res.data.map(a => ({
                slug: a.slug,
                title: a.title,
                excerpt: a.excerpt,
                category: a.category,
                date: a.published_at ? new Date(a.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Mar 2024',
                image: a.image || a.image_url,
                read_time: a.read_time,
                author: {
                    name: a.author_name,
                    avatar: a.author_avatar
                }
            }))
        }
    } catch (e) {
        // Fallback
    }
    return null
}, { lazy: true })

const displayArticles = computed(() => {
    if (dbArticles.value && dbArticles.value.length > 0) {
        return dbArticles.value.slice(0, 3)
    }
    return staticArticles.slice(0, 3)
})
</script>

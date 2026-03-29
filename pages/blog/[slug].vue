<template>
    <div v-if="article" class="min-h-screen bg-[#f8fafc] relative">
        <!-- Blueprint Grid Background -->
        <div class="fixed inset-0 -z-10 pointer-events-none opacity-[0.035]"
            style="background-image: radial-gradient(circle, #0f172a 1px, transparent 1px); background-size: 40px 40px;">
        </div>

        <!-- ── STICKY PLAYER HEADER ── -->
        <header class="fixed top-20 left-0 right-0 z-40 bg-white/50 backdrop-blur-xl border-b border-navy/5 transform transition-transform duration-500"
            :class="{ '-translate-y-full': !showStickyHeader }">
            <div class="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
                <NuxtLink to="/blog" class="text-navy/40 hover:text-navy transition-colors font-black text-[10px] tracking-widest uppercase flex items-center gap-2">
                    <Icon icon="ph:arrow-left-bold" />
                    KEMBALI
                </NuxtLink>
                <div class="hidden md:block text-navy font-black text-xs uppercase tracking-tight truncate max-w-md">
                    {{ article.title }}
                </div>
                <div class="flex items-center gap-4">
                    <button @click="copyLink" class="text-navy/40 hover:text-primary transition-colors"><Icon icon="ph:link-bold" class="text-xl"/></button>
                    <button @click="share('whatsapp')" class="text-navy/40 hover:text-primary transition-colors"><Icon icon="ph:whatsapp-logo-bold" class="text-xl"/></button>
                </div>
            </div>
            <div class="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-100" :style="{ width: `${readProgress}%` }"></div>
        </header>

        <!-- ── ARTICLE HERO ── -->
        <section class="pt-32 pb-16">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="flex flex-wrap items-center gap-3 mb-8">
                    <span class="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase">
                        {{ article.category }}
                    </span>
                    <span class="text-navy/30 text-[10px] font-black tracking-widest uppercase">
                        {{ article.date }} // 5 MIN BACA
                    </span>
                </div>
                
                <h1 class="text-navy text-4xl md:text-6xl font-black leading-[1.05] tracking-tight mb-12 max-w-5xl">
                    {{ article.title }}
                </h1>

                <div class="rounded-[40px] overflow-hidden bg-slate-100 mb-16 aspect-[21/9]">
                    <img :src="article.image" class="w-full h-full object-cover" />
                </div>
            </div>
        </section>

        <!-- ── CONTENT SECTION (2 COLUMNS) ── -->
        <section class="pb-32">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    <!-- LEFT COLUMN: CONTENT -->
                    <div class="lg:col-span-8">
                        <div class="flex items-center justify-between p-8 bg-white rounded-[32px] border border-navy/5 mb-12">
                            <div class="flex items-center gap-6">
                                <img :src="article.author.avatar" class="w-16 h-16 rounded-[20px] bg-slate-100 border-2 border-primary/20" />
                                <div>
                                    <div class="text-navy font-black text-xl leading-none">{{ article.author.name }}</div>
                                    <div class="text-navy/30 text-[10px] font-bold tracking-widest uppercase mt-2">Spesialis Panahan</div>
                                </div>
                            </div>
                            <div class="hidden md:flex gap-3">
                                <button class="size-11 rounded-2xl bg-slate-50 border border-navy/5 flex items-center justify-center hover:bg-navy hover:text-white transition-all"><Icon icon="ph:bookmark-simple-bold" /></button>
                                <button class="size-11 rounded-2xl bg-slate-50 border border-navy/5 flex items-center justify-center hover:bg-navy hover:text-white transition-all"><Icon icon="ph:share-network-bold" /></button>
                            </div>
                        </div>

                        <article ref="contentRef" class="prose prose-slate max-w-none 
                            prose-headings:text-navy prose-headings:font-black 
                            prose-p:text-[#0f172a]/70 prose-p:leading-relaxed prose-p:mb-8 prose-p:text-lg prose-p:font-medium
                            prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-navy prose-strong:font-black
                            prose-img:rounded-[32px] prose-blockquote:border-l-primary prose-blockquote:font-black prose-blockquote:text-navy prose-blockquote:italic prose-blockquote:bg-navy/[0.02] prose-blockquote:p-8 prose-blockquote:rounded-3xl">
                            <div v-html="article.content"></div>
                        </article>

                        <div class="mt-20 pt-12 border-t border-navy/10">
                            <div class="flex flex-wrap gap-3">
                                <span v-for="tag in article.tags" :key="tag" class="px-5 py-2 bg-navy/[0.03] text-navy/40 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all cursor-pointer">
                                    #{{ tag }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: SIDEBAR -->
                    <aside class="lg:col-span-4 sticky top-40 self-start">
                        <div class="bg-white rounded-[32px] border border-navy/5 p-8">
                            <h3 class="text-navy font-black text-xs uppercase tracking-widest mb-8 border-b border-navy/5 pb-4">
                                Artikel Populer
                            </h3>
                            <div class="flex flex-col gap-8">
                                <NuxtLink v-for="item in popularArticles" :key="item.slug" :to="`/blog/${item.slug}`"
                                    class="group flex gap-4 items-start">
                                    <div class="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                                        <img :src="item.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div class="flex flex-col gap-1">
                                        <div class="text-[8px] font-black text-primary uppercase tracking-widest">{{ item.category }}</div>
                                        <h4 class="text-navy font-black text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                            {{ item.title }}
                                        </h4>
                                        <div class="text-navy/20 text-[8px] font-bold uppercase">{{ item.date }}</div>
                                    </div>
                                </NuxtLink>
                            </div>

                            <NuxtLink to="/blog" class="mt-10 block w-full text-center py-4 rounded-2xl bg-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-navy-light transition-all shadow-xl shadow-navy/10">
                                LIHAT SEMUA BLOG
                            </NuxtLink>
                        </div>

                        <!-- Newsletter Mini -->
                        <div class="mt-8 bg-primary rounded-[32px] p-8 text-navy relative overflow-hidden">
                             <div class="relative z-10 text-center">
                                <h4 class="text-xl font-black leading-tight mb-2">Tajamkan Bidikan Anda!</h4>
                                <p class="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-6">Berlangganan berita terbaru.</p>
                                <button class="w-full bg-navy text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest">Langganan Sekarang</button>
                             </div>
                             <Icon icon="ph:target-bold" class="absolute -bottom-4 -right-4 text-[6rem] opacity-10 rotate-12" />
                        </div>
                    </aside>
                </div>
            </div>
        </section>

        <!-- ── MORE FROM BLOG ── -->
        <section class="bg-navy py-32 text-white overflow-hidden relative">
            <div class="absolute top-0 right-0 w-1/3 h-full bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="flex items-center justify-between mb-16">
                    <h2 class="text-3xl md:text-5xl font-black tracking-tight uppercase">Lainnya <span class="text-primary">Untuk Anda.</span></h2>
                    <NuxtLink to="/blog" class="text-primary font-black text-xs uppercase tracking-widest hover:text-white transition-colors">Lihat Semua →</NuxtLink>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <NuxtLink v-for="item in moreArticles" :key="item.slug" :to="`/blog/${item.slug}`"
                        class="group bg-white/5 border border-white/10 p-6 rounded-[32px] hover:bg-white/10 hover:border-primary/30 transition-all duration-500">
                        <div class="aspect-[16/10] overflow-hidden rounded-2xl mb-8">
                            <img :src="item.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <h4 class="text-xl font-black mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-snug">{{ item.title }}</h4>
                        <div class="flex items-center justify-between text-[10px] font-black tracking-widest uppercase text-white/40">
                            <span>{{ item.category }}</span>
                            <span>{{ item.date }}</span>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { articles as staticArticles } from '~/data/articles/index'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'landing'
})

const route = useRoute()
const toast = useToast()
const slug = route.params.slug
const contentRef = ref(null)

const article = computed(() => staticArticles.find(a => a.slug === slug))

const popularArticles = computed(() => {
    // For demo, just show top 3 articles
    return staticArticles.slice(0, 3)
})

const moreArticles = computed(() => {
    return staticArticles.filter(a => a.slug !== slug).slice(0, 3)
})

// Scroll Logic
const showStickyHeader = ref(false)
const readProgress = ref(0)

const onScroll = () => {
    const scroll = window.scrollY
    showStickyHeader.value = scroll > 500
    
    // Calculate Reading Progress
    if (contentRef.value) {
        const h = contentRef.value.scrollHeight
        const top = contentRef.value.offsetTop
        const winH = window.innerHeight
        const p = Math.max(0, Math.min(100, ((scroll - top + winH / 2) / h) * 100))
        readProgress.value = p
    }
}

onMounted(() => {
    window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
})

const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Tautan disalin!')
}

const share = (platform) => {
    if (platform === 'whatsapp') {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(article.value.title + ' ' + window.location.href)}`, '_blank')
    }
}

useHead({
    title: computed(() => article.value ? `${article.value.title} - ArcheryHub` : 'Blog Panahan - ArcheryHub'),
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ],
    meta: [
        { name: 'description', content: computed(() => article.value?.excerpt || '') }
    ]
})
</script>

<style scoped>
:deep(.prose) {
    --tw-prose-body: #0f172a;
    --tw-prose-headings: #0f172a;
    --tw-prose-links: #ef4444;
    --tw-prose-bold: #0f172a;
    --tw-prose-quotes: #0f172a;
}
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>

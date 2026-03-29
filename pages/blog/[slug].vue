<template>
    <div v-if="article" class="min-h-screen bg-[#f8fafc] relative">
        <LayoutAppHeaderDynamic />
        
        <!-- Blueprint Grid Background -->
        <div class="fixed inset-0 -z-10 pointer-events-none opacity-[0.035]"
            style="background-image: radial-gradient(circle, #0f172a 1px, transparent 1px); background-size: 40px 40px;">
        </div>

        <!-- ── BREADCRUMBS ── -->
        <div class="pt-24">
            <div class="container mx-auto px-4 max-w-7xl">
                <nav class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-navy/40">
                    <NuxtLink to="/" class="hover:text-primary transition-colors">HOME</NuxtLink>
                    <Icon icon="ph:caret-right-bold" />
                    <NuxtLink to="/blog" class="hover:text-primary transition-colors">BLOG</NuxtLink>
                    <Icon icon="ph:caret-right-bold" />
                    <span class="text-navy truncate max-w-[200px] md:max-w-none">{{ article.title }}</span>
                </nav>
            </div>
        </div>

        <!-- ── ARTICLE HERO ── -->
        <section class="pt-12 pb-16">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="flex flex-wrap items-center gap-3 mb-8">
                    <span class="bg-primary text-navy text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase">
                        {{ article.category }}
                    </span>
                    <span class="text-navy/30 text-[10px] font-black tracking-widest uppercase">
                        {{ article.date }} // {{ readTime }} MIN BACA
                    </span>
                </div>
                
                <h1 class="text-navy text-4xl md:text-6xl font-black leading-[1.05] tracking-tight mb-12 max-w-5xl">
                    {{ article.title }}
                </h1>

                <div class="rounded-[40px] overflow-hidden bg-slate-100 mb-16 aspect-[21/9] border border-navy/5">
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
                        <article ref="contentRef" class="prose prose-slate max-w-none 
                            prose-headings:text-navy prose-headings:font-black 
                            prose-p:text-[#0f172a]/70 prose-p:leading-relaxed prose-p:mb-8 prose-p:text-lg prose-p:font-medium
                            prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-navy prose-strong:font-black
                            prose-img:rounded-[32px] prose-blockquote:border-l-primary prose-blockquote:font-black prose-blockquote:text-navy prose-blockquote:italic prose-blockquote:bg-navy/[0.02] prose-blockquote:p-8 prose-blockquote:rounded-3xl">
                            <div v-html="article.content"></div>
                        </article>

                        <div class="mt-20 pt-12 border-t border-navy/10">
                            <div class="flex flex-wrap gap-3 mb-16">
                                <span v-for="tag in article.tags" :key="tag" class="px-5 py-2 bg-navy/[0.03] text-navy/40 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all cursor-pointer">
                                    #{{ tag }}
                                </span>
                            </div>

                            <!-- AUTHOR CARD (LINKED TO ABOUT US) - MOVED DOWN -->
                            <NuxtLink to="/about-us" class="flex items-center justify-between p-8 bg-white rounded-[32px] border border-navy/5 mb-20 group hover:border-primary/50 transition-all shadow-sm">
                                <div class="flex items-center gap-6">
                                    <img :src="article.author.avatar" class="w-16 h-16 rounded-[20px] bg-slate-100 border-2 border-primary/20 group-hover:border-primary transition-all" />
                                    <div>
                                        <div class="text-navy font-black text-xl leading-none group-hover:text-primary transition-colors text-left">{{ article.author.name }}</div>
                                        <div class="text-navy/30 text-[10px] font-bold tracking-widest uppercase mt-2 text-left">Penulis Artikel & Pelatih Panahan</div>
                                    </div>
                                </div>
                                <div class="hidden md:flex gap-3">
                                    <div class="size-11 rounded-2xl bg-slate-50 border border-navy/5 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-all">
                                        <Icon icon="ph:arrow-right-bold" />
                                    </div>
                                </div>
                            </NuxtLink>

                            <!-- ── COMMENT SECTION ── -->
                            <section class="mt-16 pt-16 border-t border-navy/5">
                                <div class="flex items-center justify-between mb-10">
                                    <h3 class="text-xl font-black text-navy uppercase tracking-widest flex items-center gap-3">
                                        <Icon icon="ph:chats-circle-bold" class="text-navy text-2xl" />
                                        Komentar ({{ totalComments }})
                                    </h3>
                                </div>

                                <!-- Comment Form -->
                                <div class="bg-white rounded-[32px] p-8 border border-navy/5 mb-12 relative overflow-hidden shadow-sm">
                                    <div class="absolute top-0 left-0 w-1.5 h-full bg-primary/20"></div>
                                    <h4 class="font-black text-navy uppercase tracking-widest text-[10px] mb-8 opacity-40">Suarakan Pendapat Anda</h4>
                                    
                                    <form @submit.prevent="submitComment" class="space-y-6">
                                        <div v-if="!isLoggedIn" class="grid grid-cols-1 gap-6">
                                            <div class="space-y-2">
                                                <label class="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Nama Lengkap</label>
                                                <input v-model="commentForm.guest_name" type="text" placeholder="Masukkan nama Anda..." 
                                                    class="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-navy/5 focus:ring-2 focus:ring-primary/20 text-navy font-black placeholder:text-navy/20 transition-all outline-none"
                                                    required />
                                            </div>
                                        </div>
                                        <div v-else class="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-2xl border border-navy/5">
                                            <div class="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-white font-black text-xs">
                                                {{ user?.full_name?.charAt(0) || user?.name?.charAt(0) || 'U' }}
                                            </div>
                                            <div class="text-xs font-black text-navy/40 uppercase tracking-widest">Komentar sebagai <span class="text-navy">{{ user?.full_name || user?.name }}</span></div>
                                        </div>

                                        <div class="space-y-2">
                                            <label class="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Pesan Komentar</label>
                                            <textarea v-model="commentForm.content" rows="4" placeholder="Apa yang Anda pikirkan tentang artikel ini?"
                                                class="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-navy/5 focus:ring-2 focus:ring-primary/20 text-navy font-medium placeholder:text-navy/20 transition-all outline-none resize-none"
                                                required></textarea>
                                        </div>

                                        <button type="submit" :disabled="isSubmittingComment"
                                            class="inline-flex items-center gap-3 bg-navy text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-navy-light transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-navy/10">
                                            <Icon v-if="isSubmittingComment" icon="ph:spinner" class="animate-spin text-lg" />
                                            <Icon v-else icon="ph:paper-plane-tilt-bold" class="text-lg" />
                                            {{ isSubmittingComment ? 'Mengirim...' : 'Kirim Komentar' }}
                                        </button>
                                    </form>
                                </div>

                                <!-- Comment List -->
                                <div class="space-y-8">
                                    <div v-if="isCommentsLoading" class="flex flex-col items-center py-20 text-navy/10">
                                        <Icon icon="ph:spinner" class="text-4xl animate-spin mb-4" />
                                        <span class="font-black uppercase tracking-widest text-[10px]">Memuat Komentar...</span>
                                    </div>

                                    <div v-else-if="comments.length === 0" class="text-center py-24 bg-navy/[0.01] rounded-[40px] border-2 border-dashed border-navy/10">
                                        <Icon icon="ph:chat-teardrop-dots-bold" class="text-5xl text-navy/10 mx-auto mb-6" />
                                        <p class="text-navy/20 text-[10px] font-black uppercase tracking-widest">Belum ada diskusi. Mulai sekarang!</p>
                                    </div>

                                    <div v-else v-for="comment in comments" :key="comment.id" class="group">
                                        <div class="flex gap-4 sm:gap-6 items-start">
                                            <div class="flex-shrink-0">
                                                <div class="w-12 h-12 rounded-2xl bg-white border border-navy/5 flex items-center justify-center text-navy font-black text-xl group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 shadow-sm">
                                                    {{ comment.user_name?.charAt(0) || '?' }}
                                                </div>
                                            </div>
                                            <div class="flex-grow pt-1">
                                                <div class="flex items-center justify-between mb-3">
                                                    <div class="flex items-center gap-3">
                                                        <h5 class="font-black text-navy text-xs uppercase tracking-widest">{{ comment.user_name }}</h5>
                                                        <span v-if="comment.user_type !== 'guest'" class="bg-primary/20 text-navy text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest">MEMBER</span>
                                                    </div>
                                                    <span class="text-[9px] font-black text-navy/20 uppercase tracking-widest">{{ formatDate(comment.created_at) }}</span>
                                                </div>
                                                <div class="text-navy/70 text-lg leading-relaxed font-medium bg-white p-7 rounded-3xl rounded-tl-none border border-navy/5 group-hover:border-primary/20 transition-all shadow-sm">
                                                    {{ comment.content }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: SIDEBAR -->
                    <aside class="lg:col-span-4 sticky top-40 self-start">
                        <div class="bg-white rounded-[32px] border border-navy/5 p-8 shadow-sm">
                            <h3 class="text-navy font-black text-xs uppercase tracking-widest mb-8 border-b border-navy/5 pb-4">
                                Artikel Populer
                            </h3>
                            <div class="flex flex-col gap-8">
                                <NuxtLink v-for="item in popularArticles" :key="item.slug" :to="`/blog/${item.slug}`"
                                    class="group flex gap-4 items-start">
                                    <div class="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 border border-navy/5">
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

                            <NuxtLink to="/blog" class="mt-10 block w-full text-center py-4 rounded-2xl bg-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-navy-light transition-all active:scale-95 shadow-lg shadow-navy/10">
                                LIHAT SEMUA BLOG
                            </NuxtLink>
                        </div>

                        <!-- Newsletter Mini -->
                        <div class="mt-8 bg-primary rounded-[32px] p-8 text-navy relative overflow-hidden shadow-xl shadow-primary/10">
                             <div class="relative z-10 text-center">
                                <h4 class="text-xl font-black leading-tight mb-2">Tajamkan Bidikan Anda!</h4>
                                <p class="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-6">Berlangganan berita terbaru.</p>
                                <button class="w-full bg-navy text-white py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-navy-light transition-all">Langganan Sekarang</button>
                             </div>
                             <Icon icon="ph:target-bold" class="absolute -bottom-4 -right-4 text-[6rem] opacity-10 rotate-12" />
                        </div>
                    </aside>
                </div>
            </div>
        </section>

        <!-- ── MORE FROM BLOG (SLATE BG) ── -->
        <section class="bg-slate-50 py-32 border-t border-navy/5 overflow-hidden relative">
            <div class="absolute top-0 right-0 w-1/3 h-full bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="flex items-center justify-between mb-16">
                    <h2 class="text-navy text-3xl md:text-5xl font-black tracking-tight uppercase">Lainnya <span class="text-primary">Untuk Anda.</span></h2>
                    <NuxtLink to="/blog" class="text-navy hover:text-primary transition-colors font-black text-xs uppercase tracking-widest">Lihat Semua →</NuxtLink>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    <NuxtLink v-for="item in moreArticles" :key="item.slug" :to="`/blog/${item.slug}`"
                        class="group bg-white p-4 rounded-[40px] border border-navy/5 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                        <div class="aspect-[16/10] overflow-hidden rounded-[32px] mb-8 border border-navy/5">
                            <img :src="item.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div class="px-4 pb-4">
                            <h4 class="text-navy text-xl font-black mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-snug">{{ item.title }}</h4>
                            <div class="flex items-center justify-between text-[10px] font-black tracking-widest uppercase text-navy/20">
                                <span>{{ item.category }}</span>
                                <span>{{ item.date }}</span>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </section>

        <LayoutAppFooter />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { articles as staticArticles } from '~/data/articles/index'
import { useToast } from '~/composables/useToast'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'

definePageMeta({
    layout: 'blank'
})

const route = useRoute()
const toast = useToast()
const slug = route.params.slug
const contentRef = ref(null)

const { isLoggedIn, user } = useAuth()
const api = useApi()

const article = computed(() => staticArticles.find(a => a.slug === slug))

// Calculate read time
const readTime = computed(() => {
    const text = article.value?.content || ''
    const wordsPerMinute = 200
    const noOfWords = text.split(/\s/g).length
    const minutes = noOfWords / wordsPerMinute
    return Math.ceil(minutes) || 1
})

const popularArticles = computed(() => staticArticles.slice(0, 3))
const moreArticles = computed(() => staticArticles.filter(a => a.slug !== slug).slice(0, 3))

// Comments logic
const isSubmittingComment = ref(false)
const commentForm = ref({
    guest_name: '',
    content: ''
})

const { data: commentsResponse, pending: isCommentsLoading, refresh: refreshComments } = await useAsyncData(
    `blog-comments-${slug}`,
    () => api.get(`/blog/${slug}/comments`),
    { server: true, lazy: true }
)

const comments = computed(() => commentsResponse.value?.comments || [])
const totalComments = computed(() => commentsResponse.value?.count || 0)

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

const submitComment = async () => {
    if (!commentForm.value.content) return
    if (!isLoggedIn.value && !commentForm.value.guest_name) {
        toast.error('Silakan isi nama Anda')
        return
    }

    isSubmittingComment.value = true
    try {
        await api.post(`/blog/${slug}/comments`, {
            guest_name: commentForm.value.guest_name,
            content: commentForm.value.content
        })

        toast.success('Komentar berhasil ditambahkan!')
        commentForm.value.content = ''
        commentForm.value.guest_name = ''
        await refreshComments()
    } catch (err) {
        toast.error('Gagal mengirim komentar. Coba lagi nanti.')
    } finally {
        isSubmittingComment.value = false
    }
}

// Analytics view increment (Optional)
onMounted(async () => {
    try {
        await api.post(`/blog/${slug}/views`, {})
    } catch (e) {
        // Ignore
    }
})

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
</style>

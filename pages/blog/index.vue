<template>
    <div class="min-h-screen bg-[#f8fafc] relative">
        <LayoutAppHeaderDynamic />

        <!-- Blueprint Grid Background -->
        <div class="fixed inset-0 -z-10 pointer-events-none opacity-[0.035]"
            style="background-image: radial-gradient(circle, #0f172a 1px, transparent 1px); background-size: 40px 40px;">
        </div>

        <!-- ── HERO / FEATURED ARTICLE ── -->
        <section v-if="featuredArticle" class="relative pt-24 pb-16 overflow-hidden">
            <div class="container mx-auto px-4 max-w-7xl">
                <NuxtLink :to="`/blog/${featuredArticle.slug}`"
                    class="group block relative rounded-[40px] overflow-hidden bg-navy">
                    <div
                        class="aspect-[21/9] relative scale-100 group-hover:scale-105 transition-transform duration-1000">
                        <img :src="featuredArticle.image" class="w-full h-full object-cover opacity-60" />
                        <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent"></div>
                    </div>

                    <div class="absolute inset-0 p-8 md:p-16 flex flex-col justify-end">
                        <div class="flex items-center gap-3 mb-6">
                            <span
                                class="bg-primary text-navy text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest ">
                                {{ featuredArticle.category }}
                            </span>
                            <span class="text-white/50 text-[10px] font-black tracking-widest ">
                                {{ featuredArticle.date }}
                            </span>
                        </div>
                        <h1
                            class="text-white text-3xl md:text-6xl font-black leading-[1.1] max-w-4xl tracking-tight group-hover:text-primary transition-colors">
                            {{ featuredArticle.title }}
                        </h1>
                        <p class="text-white/70 text-sm md:text-lg mt-6 max-w-2xl line-clamp-2 font-medium">
                            {{ featuredArticle.excerpt }}
                        </p>

                        <div class="flex items-center gap-4 mt-8 pt-8 border-t border-white/10">
                            <img :src="featuredArticle.author.avatar"
                                class="w-10 h-10 rounded-full border-2 border-primary/30" />
                            <div>
                                <div class="text-white font-black text-sm">{{ featuredArticle.author.name }}</div>
                                <div class="text-white/40 text-[10px] font-bold tracking-widest ">Archery Specialist</div>
                            </div>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </section>

        <!-- ── MAIN CONTENT GRID ── -->
        <section class="container mx-auto px-4 max-w-7xl pb-32">
            <!-- Category Filter -->
            <div class="flex items-center justify-between mb-12 border-b border-navy/5 pb-8">
                <div class="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                    <button v-for="cat in categories" :key="cat" @click="activeCategory = cat" :class="[
                        'px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all whitespace-nowrap',
                        activeCategory === cat ? 'bg-navy text-white' : 'bg-white border border-navy/10 text-navy/40 hover:bg-navy/5'
                     ]">
                        {{ cat }}
                    </button>
                </div>

                <div class="hidden md:flex items-center gap-2 text-navy/20">
                    <Icon icon="ph:magnifying-glass-bold" class="text-xl" />
                    <input v-model="searchQuery" type="text" placeholder="Search articles..."
                        class="bg-transparent border-none outline-none text-[10px] font-black tracking-widest text-navy placeholder:text-navy/10 w-48" />
                </div>
            </div>

            <!-- Articles Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                <NuxtLink v-for="article in filteredArticles" :key="article.slug" :to="`/blog/${article.slug}`"
                    class="group flex flex-col bg-white rounded-[32px] border border-navy/5 hover:border-primary/50 transition-all duration-500 overflow-hidden h-full">

                    <div class="relative aspect-video overflow-hidden bg-slate-100">
                        <img :src="article.image"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div class="absolute top-4 left-4">
                            <span
                                class="bg-white/90 backdrop-blur-md text-navy text-[8px] font-black px-3 py-1 rounded-lg tracking-widest border border-navy/5">
                                {{ article.category }}
                            </span>
                        </div>
                    </div>

                    <div class="p-8 flex flex-col flex-1">
                        <div class="text-navy/20 text-[9px] font-black tracking-widest mb-4">{{ article.date }}</div>
                        <h3
                            class="text-navy text-xl font-black leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-4">
                            {{ article.title }}
                        </h3>
                        <p class="text-navy/50 text-xs font-medium leading-relaxed line-clamp-3 mb-8">
                            {{ article.excerpt }}
                        </p>

                        <div class="mt-auto pt-6 border-t border-navy/5 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <img :src="article.author.avatar"
                                    class="w-6 h-6 rounded-full grayscale group-hover:grayscale-0 transition-all" />
                                <span class="text-[10px] font-black text-navy/40 tracking-widest">{{
                                    article.author.name }}</span>
                            </div>
                            <Icon icon="ph:arrow-up-right-bold"
                                class="text-navy/10 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <!-- Empty State -->
            <div v-if="filteredArticles.length === 0" class="py-32 text-center">
                <div class="text-6xl mb-6">🔍</div>
                <h3 class="text-2xl font-black text-navy tracking-tight">No articles found</h3>
                <p class="text-navy/40 font-medium mt-2">Try different keywords or select a different category.</p>
            </div>
        </section>

        <!-- ── NEWSLETTER SECTION ── -->
        <section class="container mx-auto px-4 max-w-7xl pb-32">
            <div class="bg-primary rounded-[40px] p-12 md:p-20 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-1/2 h-full bg-navy/5 transform skew-x-12 translate-x-20"></div>
                <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 class="text-navy text-4xl md:text-5xl font-black leading-tight tracking-tight mb-6">
                            Sharpen Your Focus <br />
                            Get <span class="text-white">Archeris</span> Updates.
                        </h2>
                        <p class="text-navy/60 text-lg font-bold">Get exclusive coaching tips and performance news delivered straight to your inbox.</p>
                    </div>
                    <div>
                        <form @submit.prevent="handleSubscribe" class="flex flex-col sm:flex-row gap-4">
                            <input v-model="subscribeEmail" type="email" placeholder="Your email address..."
                                class="flex-1 bg-white border-none rounded-2xl px-6 py-4 text-navy font-bold focus:ring-4 focus:ring-navy/10 outline-none"
                                required />
                            <button
                                class="bg-navy text-white px-10 py-4 rounded-2xl font-black tracking-widest text-xs hover:bg-navy-light transition-all active:scale-95">
                                Join Now
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <LayoutAppFooter />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { articles as staticArticles } from '~/data/articles/index'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'blank'
})

const toast = useToast()
const searchQuery = ref('')
const activeCategory = ref('All')
const subscribeEmail = ref('')

const categories = ['All', 'Tips & Tutorials', 'Performance', 'Health']

const featuredArticle = computed(() => staticArticles[0])

const filteredArticles = computed(() => {
    // Show all except featured in the grid, filtered by search/category
    return staticArticles.slice(1).filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesCategory = activeCategory.value === 'All' || article.category === activeCategory.value
        return matchesSearch && matchesCategory
    })
})

const handleSubscribe = () => {
    toast.success('Thank you! You have successfully subscribed to our newsletter.')
    subscribeEmail.value = ''
}

useHead({
    title: computed(() => t('blog.title', 'Archery Blog & Articles') + ' - ArcheryHub'),
    meta: [
        { name: 'description', content: 'Learn archery techniques, gear selection tips, and mental secrets from the experts at Archeris.' }
    ]
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>

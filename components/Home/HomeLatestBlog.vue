<template>
    <section ref="sectionRef" class="py-24 bg-navy text-white overflow-hidden">
        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                    <h2 class="text-white reveal-title">
                        {{ $t('home.blog.title1') }}<br />
                        {{ $t('home.blog.title2') }}
                    </h2>
                </div>
                <div class="flex items-center gap-4">
                    <!-- Left Arrow Button -->
                    <button @click="scrollLeft"
                        class="w-12 h-12 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary text-white flex items-center justify-center transition-all group/btn shadow-lg"
                        aria-label="Scroll Left">
                        <Icon icon="ph:caret-left-bold"
                            class="text-xl group-hover/btn:-translate-x-0.5 transition-transform" />
                    </button>
                    <!-- Right Arrow Button -->
                    <button @click="scrollRight"
                        class="w-12 h-12 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary text-white flex items-center justify-center transition-all group/btn shadow-lg"
                        aria-label="Scroll Right">
                        <Icon icon="ph:caret-right-bold"
                            class="text-xl group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                    <NuxtLink :to="localePath('/blog')"
                        class="ml-4 inline-flex items-center gap-2 text-white/60 font-bold tracking-widest text-sm hover:text-primary transition-colors">
                        {{ $t('home.blog.view_all') }}
                        <Icon icon="ph:arrow-right-bold" />
                    </NuxtLink>
                </div>
            </div>

            <!-- dynamic carousel of actual english blog posts -->
            <div ref="blogScrollContainer"
                class="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                
                <NuxtLink 
                    v-for="article in articles" 
                    :key="article.slug" 
                    :to="localePath('/blog/' + article.slug)"
                    class="w-[280px] sm:w-[350px] md:w-[400px] flex-shrink-0 snap-start group cursor-pointer blog-card block"
                >
                    <div class="aspect-[16/10] rounded-3xl overflow-hidden mb-6 bg-white/5 border border-white/10 shadow-lg relative">
                        <img 
                            :src="article.image" 
                            :alt="article.title"
                            class="w-full h-full object-cover blog-card-image group-hover:scale-105 transition-transform duration-700" 
                        />
                    </div>
                    
                    <div class="flex items-center gap-4 mb-4">
                        <span class="px-3 py-1 bg-white/10 text-primary text-[10px] font-bold rounded-full tracking-widest uppercase">
                            {{ article.category }}
                        </span>
                        <span class="text-white/40 text-xs font-bold tracking-widest">
                            {{ article.date }}
                        </span>
                    </div>
                    
                    <h3 class="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {{ article.title }}
                    </h3>
                    
                    <p class="text-white/60 font-light leading-relaxed line-clamp-2">
                        {{ article.excerpt }}
                    </p>
                </NuxtLink>

            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { articles } from '~/data/articles/index'

const localePath = useLocalePath()
const sectionRef = ref(null)
const blogScrollContainer = ref(null)

onMounted(() => {
    gsap.registerPlugin(ScrollTrigger)
    const el = sectionRef.value
    if (!el) return

    // title/desc reveal animations
    gsap.from(el.querySelector('.reveal-title'), {
        scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 35,
        duration: 1.1,
        ease: 'power3.out'
    })

    // cards entry animation: slide in from right and fade in
    const cards = el.querySelectorAll('.blog-card')
    if (cards.length > 0) {
        gsap.from(cards, {
            scrollTrigger: {
                trigger: blogScrollContainer.value,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: 60,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power3.out'
        })

        // zoom-out lens effect on the thumbnails when entering the viewport
        const cardImages = el.querySelectorAll('.blog-card-image')
        gsap.from(cardImages, {
            scrollTrigger: {
                trigger: blogScrollContainer.value,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            scale: 1.2,
            duration: 1.6,
            ease: 'power3.out'
        })
    }
})

const scrollLeft = () => {
    if (blogScrollContainer.value) {
        blogScrollContainer.value.scrollBy({ left: -432, behavior: 'smooth' })
    }
}

const scrollRight = () => {
    if (blogScrollContainer.value) {
        blogScrollContainer.value.scrollBy({ left: 432, behavior: 'smooth' })
    }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>

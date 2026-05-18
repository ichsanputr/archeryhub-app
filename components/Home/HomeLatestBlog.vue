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

            <div ref="blogScrollContainer"
                class="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <!-- Blog Card 1 -->
                <div class="w-[280px] sm:w-[350px] md:w-[400px] flex-shrink-0 snap-start group cursor-pointer">
                    <div class="aspect-[16/10] rounded-3xl overflow-hidden mb-6 bg-white shadow-lg">
                        <img src="/archery_blog_thumbnail_1778934914638.png" alt="Blog Post"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div class="flex items-center gap-4 mb-4">
                        <span
                            class="px-3 py-1 bg-white/10 text-primary text-[10px] font-bold rounded-full tracking-widest">Update</span>
                        <span class="text-white/40 text-xs font-bold tracking-widest">May 16, 2026</span>
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                        Digitalizing the Archery Ecosystem: Archeris Release Notes v1.0</h3>
                    <p class="text-white/60 font-light leading-relaxed line-clamp-2">
                        Kami dengan bangga memperkenalkan versi stabil pertama Archeris, platform yang akan mengubah
                        cara kita mengelola olahraga panahan di Indonesia.
                    </p>
                </div>

                <!-- Blog Card 2 (Placeholder) -->
                <div class="w-[280px] sm:w-[350px] md:w-[400px] flex-shrink-0 snap-start group cursor-pointer">
                    <div
                        class="aspect-[16/10] rounded-3xl overflow-hidden mb-6 bg-white/5 border border-white/10 flex items-center justify-center">
                        <Icon icon="ph:image-square-bold" class="text-4xl text-white/20" />
                    </div>
                    <div class="flex items-center gap-4 mb-4">
                        <span
                            class="px-3 py-1 bg-white/10 text-primary text-[10px] font-bold rounded-full tracking-widest">Tips</span>
                        <span class="text-white/40 text-xs font-bold tracking-widest">May 14, 2026</span>
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">Cara
                        Efektif Mengelola Turnamen Skala Nasional</h3>
                    <p class="text-white/60 font-light leading-relaxed line-clamp-2">
                        Panduan lengkap bagi operator klub untuk memaksimalkan fitur Archeris dalam penyelenggaraan
                        event besar.
                    </p>
                </div>

                <!-- Blog Card 3 (Placeholder) -->
                <div class="w-[280px] sm:w-[350px] md:w-[400px] flex-shrink-0 snap-start group cursor-pointer">
                    <div
                        class="aspect-[16/10] rounded-3xl overflow-hidden mb-6 bg-white/5 border border-white/10 flex items-center justify-center">
                        <Icon icon="ph:image-square-bold" class="text-4xl text-white/20" />
                    </div>
                    <div class="flex items-center gap-4 mb-4">
                        <span
                            class="px-3 py-1 bg-white/10 text-primary text-[10px] font-bold rounded-full tracking-widest">Feature</span>
                        <span class="text-white/40 text-xs font-bold tracking-widest">May 12, 2026</span>
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">Mengenal
                        Fitur Athlete Portfolio Pro</h3>
                    <p class="text-white/60 font-light leading-relaxed line-clamp-2">
                        Bagaimana profil digital dapat membantu atlet mendapatkan visibilitas lebih luas di komunitas
                        panahan.
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const localePath = useLocalePath()
const sectionRef = ref(null)
const blogScrollContainer = ref(null)

onMounted(() => {
    gsap.registerPlugin(ScrollTrigger)
    const el = sectionRef.value
    if (!el) return

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

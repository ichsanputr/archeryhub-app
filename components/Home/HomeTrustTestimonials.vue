<template>
    <section ref="sectionRef" class="py-20 sm:py-24 bg-[#DEFEBD]/15 border-y border-[#DEFEBD]/30 overflow-hidden relative">
        <!-- Subtle Vector Graphic in Background for aesthetics -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#DEFEBD]/30 via-transparent to-transparent pointer-events-none"></div>

        <!-- Badminton Player Decorative Watermark Graphic in Bottom Corner -->
        <div class="absolute bottom-0 right-0 w-[180px] sm:w-[280px] md:w-[350px] opacity-15 pointer-events-none transform translate-y-8 translate-x-8 z-0">
            <img src="/archery_vector.png" alt="Badminton Players Watermark" class="w-full h-auto object-contain select-none pointer-events-none" />
        </div>

        <!-- Second Badminton Player Decorative Watermark Graphic in Left Corner -->
        <div class="absolute bottom-0 left-0 w-[180px] sm:w-[280px] md:w-[350px] opacity-15 pointer-events-none transform translate-y-8 -translate-x-8 z-0">
            <img src="/archery_vector_2.png" alt="Badminton Players Watermark Left" class="w-full h-auto object-contain select-none pointer-events-none" />
        </div>

        <div class="max-w-[1280px] mx-auto px-6 md:px-12">
            <!-- ── Top Header Section: Metric and Badges (Exact Same layout as image) ── -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-16 relative z-10">
                
                <!-- Left Metric Panel -->
                <div class="md:col-span-6 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <!-- Concentric circles background behind count -->
                    <div class="relative flex items-center justify-center">
                        <div class="absolute w-24 h-24 rounded-full bg-[#DEFEBD]/40 animate-ping opacity-25"></div>
                        <div class="absolute w-20 h-20 rounded-full bg-[#DEFEBD]/30"></div>
                        <div class="w-16 h-16 rounded-full bg-[#DEFEBD] flex items-center justify-center text-navy relative z-10">
                            <!-- Custom SVG Icon replacing original -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-navy/80" viewBox="0 0 32 32">
                                <path d="M0 0h32v32H0z" fill="none" />
                                <path fill="currentColor" d="m16 8l1.912 3.703l4.088.594L19 15l1 4l-4-2.25L12 19l1-4l-3-2.703l4.2-.594z" />
                                <path fill="currentColor" d="M17.736 30L16 29l4-7h6a1.997 1.997 0 0 0 2-2V8a1.997 1.997 0 0 0-2-2H6a1.997 1.997 0 0 0-2 2v12a1.997 1.997 0 0 0 2 2h9v2H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-4.835Z" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <div class="text-5xl sm:text-7xl font-black text-navy font-display tracking-tight leading-none mb-2 reveal-title">
                            {{ t('home.testimonials.count') }}
                        </div>
                        <p class="text-base sm:text-lg font-bold text-slate-500 tracking-tight leading-normal reveal-desc" v-html="t('home.testimonials.trust_desc', { brand: '<span class=\'text-navy font-black\'>Archeris</span>' })">
                        </p>
                    </div>
                </div>

                <!-- Right Review Badges Stack -->
                <div class="md:col-span-6 flex flex-col gap-4 sm:max-w-md md:ml-auto w-full">
                    <!-- Badge 1: G2 / 4.7 stars -->
                    <a href="#" class="flex items-center justify-between p-4 bg-[#DEFEBD]/25 border border-[#DEFEBD]/40 rounded-full hover:border-[#9ae811] transition-all hover:-translate-y-0.5 group shadow-sm">
                        <div class="flex items-center gap-3.5">
                            <div class="w-8 h-8 rounded-full bg-[#ff4e00] flex items-center justify-center text-white shrink-0 shadow-sm">
                                <Icon icon="simple-icons:g2" class="text-base" />
                            </div>
                            <span class="text-xs sm:text-sm font-semibold text-slate-600">
                                <span class="font-black text-navy">4.7</span> {{ t('home.testimonials.stars') }} <span class="font-black text-navy">215+</span> {{ t('home.testimonials.reviews') }}
                            </span>
                        </div>
                        <Icon icon="ph:caret-right-bold" class="text-slate-400 group-hover:text-navy transition-colors text-sm" />
                    </a>

                    <!-- Badge 2: Star rating / 5.0 stars -->
                    <a href="#" class="flex items-center justify-between p-4 bg-[#DEFEBD]/25 border border-[#DEFEBD]/40 rounded-full hover:border-[#9ae811] transition-all hover:-translate-y-0.5 group shadow-sm">
                        <div class="flex items-center gap-3.5">
                            <div class="w-8 h-8 rounded-full bg-[#00c853] flex items-center justify-center text-white shrink-0 shadow-sm">
                                <Icon icon="ph:star-fill" class="text-base" />
                            </div>
                            <span class="text-xs sm:text-sm font-semibold text-slate-600">
                                <span class="font-black text-navy">5.0</span> {{ t('home.testimonials.stars') }} <span class="font-black text-navy">1,000+</span> {{ t('home.testimonials.reviews') }}
                            </span>
                        </div>
                        <Icon icon="ph:caret-right-bold" class="text-slate-400 group-hover:text-navy transition-colors text-sm" />
                    </a>
                </div>

            </div>

            <!-- ── Bottom Row Section: Card Testimonials (Running Infinite Loop) ── -->
            <div class="relative w-full overflow-hidden mt-8">
                <!-- Fading Mask for side scrolling indicators -->
                <div class="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#fcfdfa] via-[#fcfdfa]/80 to-transparent z-10 pointer-events-none"></div>
                <div class="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#fcfdfa] via-[#fcfdfa]/80 to-transparent z-10 pointer-events-none"></div>

                <!-- Infinite Marquee Scrolling Container -->
                <div class="animate-marquee flex gap-6 py-4">
                    <!-- original set of cards -->
                    <div 
                        v-for="(item, index) in testimonials" 
                        :key="'testi-orig-' + index"
                        class="w-[320px] sm:w-[360px] bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between shrink-0 shadow-[0_4px_16px_rgba(183,251,35,0.04)] hover:shadow-[0_8px_24px_rgba(183,251,35,0.12)] hover:border-primary/45 hover:-translate-y-1 transition-all duration-300 animate-hover-lift"
                    >
                        <div class="flex-1">
                            <p class="text-xs sm:text-sm text-navy/80 font-bold leading-relaxed">
                                "{{ item.quote }}"
                            </p>
                        </div>
                        <div class="flex items-center gap-3.5 mt-5 border-t border-slate-100 pt-4 shrink-0">
                            <img :src="item.avatar" :alt="item.name + ' Avatar'" class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/50 shrink-0" />
                            <div>
                                <h4 class="font-black text-xs text-navy leading-none">{{ item.name }}</h4>
                                <span class="text-[9px] font-black text-slate-400 mt-1 block capitalize tracking-wider">
                                    {{ item.org }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- duplicate set of cards for seamless infinite looping -->
                    <div 
                        v-for="(item, index) in testimonials" 
                        :key="'testi-dup-' + index"
                        class="w-[320px] sm:w-[360px] bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between shrink-0 shadow-[0_4px_16px_rgba(183,251,35,0.04)] hover:shadow-[0_8px_24px_rgba(183,251,35,0.12)] hover:border-primary/45 hover:-translate-y-1 transition-all duration-300 animate-hover-lift"
                    >
                        <div class="flex-1">
                            <p class="text-xs sm:text-sm text-navy/80 font-bold leading-relaxed">
                                "{{ item.quote }}"
                            </p>
                        </div>
                        <div class="flex items-center gap-3.5 mt-5 border-t border-slate-100 pt-4 shrink-0">
                            <img :src="item.avatar" :alt="item.name + ' Avatar'" class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/50 shrink-0" />
                            <div>
                                <h4 class="font-black text-xs text-navy leading-none">{{ item.name }}</h4>
                                <span class="text-[9px] font-black text-slate-400 mt-1 block capitalize tracking-wider">
                                    {{ item.org }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()

const sectionRef = ref(null)

const testimonials = computed(() => [
    {
        quote: t('home.testimonials.items.0.quote'),
        name: t('home.testimonials.items.0.name'),
        org: t('home.testimonials.items.0.org'),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Farhan"
    },
    {
        quote: t('home.testimonials.items.1.quote'),
        name: t('home.testimonials.items.1.name'),
        org: t('home.testimonials.items.1.org'),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rania"
    },
    {
        quote: t('home.testimonials.items.2.quote'),
        name: t('home.testimonials.items.2.name'),
        org: t('home.testimonials.items.2.org'),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi"
    },
    {
        quote: t('home.testimonials.items.3.quote'),
        name: t('home.testimonials.items.3.name'),
        org: t('home.testimonials.items.3.org'),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica"
    },
    {
        quote: t('home.testimonials.items.4.quote'),
        name: t('home.testimonials.items.4.name'),
        org: t('home.testimonials.items.4.org'),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
    }
])

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

    gsap.from(el.querySelector('.reveal-desc'), {
        scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 20,
        duration: 1.1,
        delay: 0.18,
        ease: 'power3.out'
    })
})
</script>

<style scoped>
@keyframes marquee {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}

.animate-marquee {
    display: flex;
    width: max-content;
    animation: marquee 35s linear infinite;
}

.animate-marquee:hover {
    animation-play-state: paused;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>

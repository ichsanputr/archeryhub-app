<template>
    <section ref="sectionRef" class="relative py-24 sm:py-32 bg-white overflow-hidden">
        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <!-- Main Heading -->
            <div class="text-center mb-24">
                <h2 class="text-navy mb-6 reveal-title">
                    {{ $t('home.features_demo.title1') }}<br />
                    {{ $t('home.features_demo.title2') }}
                </h2>
                <p class="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto font-light reveal-desc">
                    {{ $t('home.features_demo.description') }}
                </p>
            </div>

            <!-- Feature Block 1: EO Registration & Payments -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-20 items-center mb-20 sm:mb-28 lg:mb-32 feature-row">
                <div class="order-2 lg:order-1 text-col">
                    <span class="text-xs font-bold tracking-wide text-primary mb-3 sm:mb-4 block">{{
                        $t('home.features_demo.f1_tag') }}</span>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-black text-navy mb-4 sm:mb-6 leading-tight tracking-tight font-display">{{
                        $t('home.features_demo.f1_title') }}</h3>
                    <p class="text-text-secondary text-sm sm:text-base lg:text-lg font-light leading-relaxed mb-6 sm:mb-8">
                        {{ $t('home.features_demo.f1_desc') }}
                    </p>

                    <div class="space-y-2.5 sm:space-y-3 pt-6 border-t border-slate-100">
                        <div v-for="key in ['f1_list_1', 'f1_list_2', 'f1_list_3', 'f1_list_4']" :key="key"
                            class="flex items-center gap-3 sm:gap-3.5 p-3 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 hover:bg-white hover:border-[#63C03B]/40 hover:shadow-md hover:shadow-slate-100 transition-all duration-200 group/item">
                            <div class="w-6 h-6 rounded-full bg-[#63C03B]/15 text-[#63C03B] flex items-center justify-center shrink-0 group-hover/item:bg-[#63C03B] group-hover/item:text-white transition-colors duration-200">
                                <Icon icon="ph:check-bold" class="text-xs" />
                            </div>
                            <span class="text-navy font-bold text-xs sm:text-sm lg:text-base leading-snug">
                                {{ $t(`home.features_demo.${key}`) }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="order-1 lg:order-2 relative flex justify-center image-col w-full">
                    <AnimatedImageStack 
                        :images="[
                            'https://placehold.co/1200x750/0f172a/63c03b?text=EO+Registration+Setup',
                            'https://placehold.co/1200x750/1e293b/63c03b?text=Payment+Gateway+%26+Invoicing',
                            'https://placehold.co/1200x750/0f172a/38bdf8?text=Realtime+Participant+Roster'
                        ]"
                        alt="EO Tournament Registration & Online Payments"
                    />
                </div>
            </div>

            <!-- Feature Block 2: EO Management, Targets & WA Brackets -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-20 items-center mb-20 sm:mb-28 lg:mb-32 feature-row">
                <div class="order-1 relative flex justify-center image-col w-full">
                    <AnimatedImageStack 
                        :images="[
                            'https://placehold.co/1200x750/0f172a/63c03b?text=Target+Butt+Matrix+Allocation',
                            'https://placehold.co/1200x750/1e293b/38bdf8?text=Qualification+Round+Standings',
                            'https://placehold.co/1200x750/0f172a/f59e0b?text=World+Archery+Brackets',
                            'https://placehold.co/1200x750/1e293b/63c03b?text=Shoot-Off+%26+Medal+Matches'
                        ]"
                        alt="Target Butt Management & World Archery Elimination Brackets"
                    />
                </div>

                <div class="order-2 text-col">
                    <span class="text-xs font-bold tracking-wide text-primary mb-3 sm:mb-4 block">{{
                        $t('home.features_demo.f2_tag') }}</span>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-black text-navy mb-4 sm:mb-6 leading-tight tracking-tight font-display">{{
                        $t('home.features_demo.f2_title') }}</h3>
                    <p class="text-text-secondary text-sm sm:text-base lg:text-lg font-light leading-relaxed mb-6 sm:mb-8">
                        {{ $t('home.features_demo.f2_desc') }}
                    </p>

                    <div class="space-y-2.5 sm:space-y-3 pt-6 border-t border-slate-100">
                        <div v-for="key in ['f2_list_1', 'f2_list_2', 'f2_list_3', 'f2_list_4']" :key="key"
                            class="flex items-center gap-3 sm:gap-3.5 p-3 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 hover:bg-white hover:border-[#63C03B]/40 hover:shadow-md hover:shadow-slate-100 transition-all duration-200 group/item">
                            <div class="w-6 h-6 rounded-full bg-[#63C03B]/15 text-[#63C03B] flex items-center justify-center shrink-0 group-hover/item:bg-[#63C03B] group-hover/item:text-white transition-colors duration-200">
                                <Icon icon="ph:check-bold" class="text-xs" />
                            </div>
                            <span class="text-navy font-bold text-xs sm:text-sm lg:text-base leading-snug">
                                {{ $t(`home.features_demo.${key}`) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Feature Block 3: Archer Mobile App & Career Stats -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-20 items-center mb-20 sm:mb-28 lg:mb-32 feature-row">
                <div class="order-2 lg:order-1 text-col">
                    <span class="text-xs font-bold tracking-wide text-primary mb-3 sm:mb-4 block">{{
                        $t('home.features_demo.f3_tag') }}</span>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-black text-navy mb-4 sm:mb-6 leading-tight tracking-tight font-display">{{
                        $t('home.features_demo.f3_title') }}</h3>
                    <p class="text-text-secondary text-sm sm:text-base lg:text-lg font-light leading-relaxed mb-6 sm:mb-8">
                        {{ $t('home.features_demo.f3_desc') }}
                    </p>

                    <div class="space-y-2.5 sm:space-y-3 pt-6 border-t border-slate-100">
                        <div v-for="key in ['f3_list_1', 'f3_list_2', 'f3_list_3', 'f3_list_4']" :key="key"
                            class="flex items-center gap-3 sm:gap-3.5 p-3 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 hover:bg-white hover:border-[#63C03B]/40 hover:shadow-md hover:shadow-slate-100 transition-all duration-200 group/item">
                            <div class="w-6 h-6 rounded-full bg-[#63C03B]/15 text-[#63C03B] flex items-center justify-center shrink-0 group-hover/item:bg-[#63C03B] group-hover/item:text-white transition-colors duration-200">
                                <Icon icon="ph:check-bold" class="text-xs" />
                            </div>
                            <span class="text-navy font-bold text-xs sm:text-sm lg:text-base leading-snug">
                                {{ $t(`home.features_demo.${key}`) }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="order-1 lg:order-2 relative flex justify-center image-col w-full">
                    <AnimatedImageStack 
                        :images="[
                            'https://placehold.co/1200x750/0f172a/63c03b?text=Archer+Profile+%26+QR+Badge',
                            'https://placehold.co/1200x750/1e293b/38bdf8?text=Live+Leaderboard+%26+Scorecard',
                            'https://placehold.co/1200x750/0f172a/a855f7?text=Career+Statistics+%26+History'
                        ]"
                        alt="Archer Mobile App, Live Standings & Statistics"
                    />
                </div>
            </div>

            <!-- Feature Block 4: Certified Scorekeeper Mobile App -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-20 items-center feature-row">
                <div class="order-1 relative flex justify-center image-col w-full">
                    <AnimatedImageStack 
                        :images="[
                            'https://placehold.co/1200x750/0f172a/63c03b?text=Scorekeeper+Mobile+Input',
                            'https://placehold.co/1200x750/1e293b/38bdf8?text=Arrow+Value+Verification',
                            'https://placehold.co/1200x750/0f172a/f59e0b?text=Live+Sync+to+Central+Server'
                        ]"
                        alt="Scorekeeper Mobile App & Digital Touchscreen Scoring"
                    />
                </div>

                <div class="order-2 text-col">
                    <span class="text-xs font-bold tracking-wide text-primary mb-3 sm:mb-4 block">{{
                        $t('home.features_demo.f4_tag') }}</span>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-black text-navy mb-4 sm:mb-6 leading-tight tracking-tight font-display">{{
                        $t('home.features_demo.f4_title') }}</h3>
                    <p class="text-text-secondary text-sm sm:text-base lg:text-lg font-light leading-relaxed mb-6 sm:mb-8">
                        {{ $t('home.features_demo.f4_desc') }}
                    </p>

                    <div class="space-y-2.5 sm:space-y-3 pt-6 border-t border-slate-100">
                        <div v-for="key in ['f4_list_1', 'f4_list_2', 'f4_list_3', 'f4_list_4']" :key="key"
                            class="flex items-center gap-3 sm:gap-3.5 p-3 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 hover:bg-white hover:border-[#63C03B]/40 hover:shadow-md hover:shadow-slate-100 transition-all duration-200 group/item">
                            <div class="w-6 h-6 rounded-full bg-[#63C03B]/15 text-[#63C03B] flex items-center justify-center shrink-0 group-hover/item:bg-[#63C03B] group-hover/item:text-white transition-colors duration-200">
                                <Icon icon="ph:check-bold" class="text-xs" />
                            </div>
                            <span class="text-navy font-bold text-xs sm:text-sm lg:text-base leading-snug">
                                {{ $t(`home.features_demo.${key}`) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Comparison Table Section -->
            <div class="mt-32 pt-24 border-t border-gray-100 reveal-comparison">
                <div class="text-center max-w-3xl mx-auto mb-16">
                    <h3 class="text-3xl sm:text-4xl md:text-5xl font-black text-navy mb-5 tracking-tight leading-tight">
                        {{ $t('home.comparison.title') }}
                    </h3>
                    <p class="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
                        {{ $t('home.comparison.description') }}
                    </p>
                </div>

                <!-- Modern Comparison Table -->
                <div class="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse min-w-[760px]">
                            <thead>
                                <tr class="bg-navy text-white text-xs font-black tracking-wider border-b border-navy">
                                    <th class="py-6 px-7 w-1/3 text-slate-200 text-sm font-bold tracking-wide">
                                        {{ $t('home.comparison.col_feature') }}
                                    </th>
                                    <th class="py-6 px-7 w-1/3 bg-slate-900 border-x border-slate-800/80">
                                        <span class="text-base font-black text-primary tracking-wide">Archeris.net</span>
                                    </th>
                                    <th class="py-6 px-7 w-1/3 text-slate-300 text-sm font-bold">
                                        <span class="text-base font-black text-slate-200 tracking-wide">Ianseo.net</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="i in 8" :key="i" class="hover:bg-slate-50/70 transition-all duration-200 group">
                                    <!-- Feature Name -->
                                    <td class="py-6 px-7 align-top">
                                        <div class="flex items-start gap-3">
                                            <div class="w-7 h-7 rounded-xl bg-slate-100 text-navy font-black text-xs flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 group-hover:text-navy transition-colors">
                                                0{{ i }}
                                            </div>
                                            <div>
                                                <h4 class="text-base sm:text-lg font-black text-navy leading-snug">
                                                    {{ $t(`home.comparison.f${i}_name`) }}
                                                </h4>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- Archeris Column (Highlighted) -->
                                    <td class="py-6 px-7 align-top bg-emerald-500/[0.04] border-x border-slate-100 group-hover:bg-emerald-500/[0.08] transition-colors">
                                        <div class="flex items-start gap-3">
                                            <div class="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-emerald-500/30">
                                                <Icon icon="ph:check-bold" class="text-xs" />
                                            </div>
                                            <p class="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                                                {{ $t(`home.comparison.f${i}_archeris`) }}
                                            </p>
                                        </div>
                                    </td>

                                    <!-- Ianseo Column -->
                                    <td class="py-6 px-7 align-top text-slate-500">
                                        <div class="flex items-start gap-3">
                                            <div class="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                                                <Icon icon="ph:x-bold" class="text-xs" />
                                            </div>
                                            <p class="text-sm sm:text-base font-normal text-slate-500 leading-relaxed">
                                                {{ $t(`home.comparison.f${i}_ianseo`) }}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Bottom Quick CTA Bar -->
                    <div class="p-6 sm:p-8 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                        <div class="text-center sm:text-left">
                            <h4 class="text-white font-bold text-base sm:text-lg">{{ $t('home.comparison.cta_banner_title', 'Ready to switch to modern archery scoring?') }}</h4>
                            <p class="text-slate-400 text-xs sm:text-sm">{{ $t('home.comparison.cta_banner_desc', 'Create your tournament account for free without complex server setup.') }}</p>
                        </div>
                        <NuxtLink to="/auth/register" class="px-6 py-3 bg-primary text-navy font-black text-sm rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0">
                            <span>{{ $t('home.comparison.cta_banner_button', 'Get Started Free') }}</span>
                            <Icon icon="ph:arrow-right-bold" />
                        </NuxtLink>
                    </div>
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

onMounted(() => {
    gsap.registerPlugin(ScrollTrigger)
    const el = sectionRef.value
    if (!el) return

    // heading animations
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

    // row-by-row coordinated slide animations
    const rows = el.querySelectorAll('.feature-row')
    rows.forEach((row, index) => {
        const textCol = row.querySelector('.text-col')
        const imageCol = row.querySelector('.image-col')

        // alternating slide directions based on grid order
        // block 1: text slides from left, image from right
        // block 2: image slides from left, text from right
        // block 3: text slides from left, image from right
        // block 4: image slides from left, text from right
        const isTextLeft = index % 2 === 0

        if (textCol) {
            gsap.from(textCol, {
                scrollTrigger: {
                    trigger: row,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                x: isTextLeft ? -60 : 60,
                duration: 1.2,
                ease: 'power3.out'
            })
        }

        if (imageCol) {
            gsap.from(imageCol, {
                scrollTrigger: {
                    trigger: row,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                x: isTextLeft ? 60 : -60,
                scale: 0.95,
                duration: 1.3,
                delay: 0.12,
                ease: 'power3.out'
            })
        }
    })

    const comparisonEl = el.querySelector('.reveal-comparison')
    if (comparisonEl) {
        gsap.from(comparisonEl, {
            scrollTrigger: {
                trigger: comparisonEl,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            duration: 1.2,
            ease: 'power3.out'
        })
    }
})
</script>

<style scoped></style>

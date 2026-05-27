<template>
    <section ref="sectionRef" class="relative py-24 sm:py-32 bg-white overflow-hidden">
        <!-- Decorative Border Features on Left & Right Sides -->
        <div class="absolute top-0 bottom-0 left-0 w-[40px] sm:w-[100px] opacity-[0.3] sm:opacity-[0.2] pointer-events-none z-0 mix-blend-multiply"
            style="
    background-image: url('/ok1-removebg-preview.png');
    background-repeat: repeat-y;
    background-size: 100% auto;
    transform-origin: center;
  ">
        </div>

        <div class="absolute top-0 bottom-0 right-0 w-[40px] sm:w-[100px] opacity-[0.3] sm:opacity-[0.2] pointer-events-none z-0 mix-blend-multiply"
            style="
    background-image: url('/ok1-removebg-preview.png');
    background-repeat: repeat-y;
    background-size: 100% auto;
    transform: scaleX(-1);
  ">
        </div>

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

            <!-- Feature Block 1: App -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32 feature-row">
                <div class="order-2 lg:order-1 text-col">
                    <span class="text-[10px] font-bold tracking-[0.2em] text-navy/40 mb-4 block">{{
                        $t('home.features_demo.f1_tag') }}</span>
                    <h3 class="text-3xl sm:text-4xl font-bold text-navy mb-6 leading-tight">{{
                        $t('home.features_demo.f1_title') }}</h3>
                    <p class="text-text-secondary text-base sm:text-lg font-light leading-relaxed mb-10">
                        {{ $t('home.features_demo.f1_desc') }}
                    </p>

                    <ul class="space-y-4 border-t border-gray-100 pt-8">
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            {{ $t('home.features_demo.f1_list_1') }}
                        </li>
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            {{ $t('home.features_demo.f1_list_2') }}
                        </li>
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            {{ $t('home.features_demo.f1_list_3') }}
                        </li>
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            {{ $t('home.features_demo.f1_list_4') }}
                        </li>
                    </ul>
                </div>

                <div class="order-1 lg:order-2 relative flex justify-center lg:justify-end image-col">
                    <div class="absolute inset-0 bg-[#E2F9C2] rounded-[3rem] -rotate-3 scale-95 opacity-50"></div>
                    <div
                        class="relative w-full max-w-[400px] aspect-[4/5] bg-[#E2F9C2] rounded-[3rem] flex items-center justify-center p-8">
                        <img src="/archery_app_mockup_1778934013917.png" alt="Archery App Mockup"
                            class="w-full h-full object-contain rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700" />
                    </div>
                </div>
            </div>

            <!-- Feature Block 2: Scheduling -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32 feature-row">
                <div class="relative flex justify-center lg:justify-start image-col">
                    <div class="absolute inset-0 bg-[#E2F9C2] rounded-[3rem] rotate-3 scale-95 opacity-50"></div>
                    <div
                        class="relative w-full aspect-video lg:aspect-[4/3] bg-[#E2F9C2] rounded-[3rem] flex items-center justify-center p-8">
                        <img src="/archery_dashboard_mockup_1778934029945.png" alt="Archery Dashboard Mockup"
                            class="w-full h-full object-cover rounded-2xl shadow-2xl -rotate-1 hover:rotate-0 transition-transform duration-700" />
                    </div>
                </div>

                <div class="text-col">
                    <span class="text-[10px] font-bold tracking-[0.2em] text-navy/40 mb-4 block">{{
                        $t('home.features_demo.f2_tag') }}</span>
                    <h3 class="text-3xl sm:text-4xl font-bold text-navy mb-6 leading-tight">{{
                        $t('home.features_demo.f2_title') }}</h3>
                    <p class="text-text-secondary text-base sm:text-lg font-light leading-relaxed mb-10">
                        {{ $t('home.features_demo.f2_desc') }}
                    </p>

                    <ul class="space-y-4 border-t border-gray-100 pt-8">
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            {{ $t('home.features_demo.f2_list_1') }}
                        </li>
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            {{ $t('home.features_demo.f2_list_2') }}
                        </li>
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            {{ $t('home.features_demo.f2_list_3') }}
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Feature Block 3: Payments -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32 feature-row">
                <div class="order-2 lg:order-1 text-col">
                    <span class="text-[10px] font-bold tracking-[0.2em] text-navy/40 mb-4 block">{{
                        $t('home.features_demo.f3_tag') }}</span>
                    <h3 class="text-3xl sm:text-4xl font-bold text-navy mb-6 leading-tight">{{
                        $t('home.features_demo.f3_title') }}</h3>
                    <p class="text-text-secondary text-base sm:text-lg font-light leading-relaxed mb-10">
                        {{ $t('home.features_demo.f3_desc') }}
                    </p>

                    <ul class="space-y-4 border-t border-gray-100 pt-8">
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            {{ $t('home.features_demo.f3_list_1') }}
                        </li>
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            {{ $t('home.features_demo.f3_list_2') }}
                        </li>
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            {{ $t('home.features_demo.f3_list_3') }}
                        </li>
                    </ul>
                </div>

                <div class="order-1 lg:order-2 relative flex justify-center lg:justify-end image-col">
                    <div class="absolute inset-0 bg-[#E2F9C2] rounded-[3rem] -rotate-3 scale-95 opacity-50"></div>
                    <div
                        class="relative w-full max-w-[400px] aspect-[4/5] bg-[#E2F9C2] rounded-[3rem] flex items-center justify-center p-8">
                        <img src="/archery_payments_mockup_1778934758511.png" alt="Payments Mockup"
                            class="w-full h-full object-contain rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700" />
                    </div>
                </div>
            </div>

            <!-- Feature Block 4: Portfolio -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center feature-row">
                <div class="relative flex justify-center lg:justify-start image-col">
                    <div class="absolute inset-0 bg-[#E2F9C2] rounded-[3rem] rotate-3 scale-95 opacity-50"></div>
                    <div
                        class="relative w-full max-w-[400px] aspect-[4/5] bg-[#E2F9C2] rounded-[3rem] flex items-center justify-center p-8">
                        <img src="/archery_portfolio_mockup_1778934772420.png" alt="Portfolio Mockup"
                            class="w-full h-full object-contain rounded-2xl shadow-2xl -rotate-1 hover:rotate-0 transition-transform duration-700" />
                    </div>
                </div>

                <div class="text-col">
                    <span class="text-[10px] font-bold tracking-[0.2em] text-navy/40 mb-4 block">{{
                        $t('home.features_demo.f4_tag') }}</span>
                    <h3 class="text-3xl sm:text-4xl font-bold text-navy mb-6 leading-tight">{{
                        $t('home.features_demo.f4_title') }}</h3>
                    <p class="text-text-secondary text-base sm:text-lg font-light leading-relaxed mb-10">
                        {{ $t('home.features_demo.f4_desc') }}
                    </p>

                    <ul class="space-y-4 border-t border-gray-100 pt-8">
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            {{ $t('home.features_demo.f4_list_1') }}
                        </li>
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            {{ $t('home.features_demo.f4_list_2') }}
                        </li>
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            {{ $t('home.features_demo.f4_list_3') }}
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Comparison Table Section -->
            <div class="mt-32 pt-24 border-t border-gray-100 reveal-comparison">
                <div class="text-center mb-16">
                    <span class="text-[10px] font-bold tracking-[0.2em] text-navy/40 mb-4 block uppercase">{{ $t('home.comparison.subtitle') }}</span>
                    <h3 class="text-3xl sm:text-4xl font-bold text-navy mb-4">{{ $t('home.comparison.title') }}</h3>
                    <p class="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto font-light">
                        {{ $t('home.comparison.description') }}
                    </p>
                </div>

                <div class="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm">
                    <table class="w-full text-left border-collapse bg-white min-w-[700px]">
                        <thead>
                            <tr class="bg-navy text-white text-xs font-black tracking-wider uppercase border-b border-navy">
                                <th class="py-5 px-6">{{ $t('home.comparison.col_feature') }}</th>
                                <th class="py-5 px-6 bg-navy/95 border-x border-white/10 text-primary">{{ $t('home.comparison.col_archeris') }}</th>
                                <th class="py-5 px-6 text-white/70">{{ $t('home.comparison.col_ianseo') }}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 text-sm">
                            <tr v-for="i in 6" :key="i" class="hover:bg-gray-50/50 transition-colors">
                                <td class="py-6 px-6 font-bold text-navy">
                                    {{ $t(`home.comparison.f${i}_name`) }}
                                </td>
                                <td class="py-6 px-6 bg-[#E2F9C2]/10 border-x border-gray-100 font-medium text-navy">
                                    <div class="flex items-start gap-2.5">
                                        <Icon icon="ph:check-circle-fill" class="text-primary text-lg shrink-0 mt-0.5" />
                                        <span>{{ $t(`home.comparison.f${i}_archeris`) }}</span>
                                    </div>
                                </td>
                                <td class="py-6 px-6 text-gray-500 font-light">
                                    <div class="flex items-start gap-2.5">
                                        <Icon icon="ph:minus-circle" class="text-gray-400 text-lg shrink-0 mt-0.5" />
                                        <span>{{ $t(`home.comparison.f${i}_ianseo`) }}</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

<template>
    <section class="py-24 bg-[#DEFEBD] overflow-hidden">
        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <!-- Text Content -->
                <div class="order-2 lg:order-1">
                    <h2
                        class="text-4xl sm:text-6xl font-black text-navy leading-tight mb-8 font-display tracking-tighter">
                        {{ $t('home.mobile.title1') }}<br />
                        {{ $t('home.mobile.title2') }}
                    </h2>
                    <p class="text-navy/70 text-lg sm:text-xl font-light leading-relaxed mb-10 max-w-xl">
                        {{ $t('home.mobile.description') }}
                    </p>

                    <div class="flex flex-wrap gap-4">
                        <a href="#"
                            class="inline-flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-2xl hover:scale-105 transition-transform shadow-xl">
                            <Icon icon="ic:baseline-apple" class="text-2xl" />
                            <div class="text-left">
                                <div class="text-[10px] font-bold opacity-60 leading-none">Download on the</div>
                                <div class="text-lg font-bold leading-none">App Store</div>
                            </div>
                        </a>
                        <a href="#"
                            class="inline-flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-2xl hover:scale-105 transition-transform shadow-xl">
                            <Icon icon="logos:google-play-icon" class="text-2xl" />
                            <div class="text-left">
                                <div class="text-[10px] font-bold opacity-60 leading-none">Get it on</div>
                                <div class="text-lg font-bold leading-none">Google Play</div>
                            </div>
                        </a>
                    </div>
                </div>

                <!-- Image Mockup -->
                <div class="order-1 lg:order-2 flex justify-center lg:justify-end">
                    <div class="relative w-full max-w-[500px]">
                        <img src="/archery_mobile_app_download_1778934899178.png" alt="Archeris Mobile App"
                            class="w-full h-auto object-contain drop-shadow-2xl" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'
</script>

<style scoped></style>

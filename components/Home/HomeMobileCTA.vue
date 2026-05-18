<template>
    <section class="py-24 bg-[#DEFEBD] overflow-hidden relative">
        <!-- Creative Archery Target Orbit Spiral SVG (Left Background - Navy) -->
        <svg class="absolute -top-12 -left-20 h-[120%] w-auto text-navy pointer-events-none opacity-20" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
            <circle cx="300" cy="300" r="250" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="12 12" opacity="0.1" />
            <circle cx="300" cy="300" r="180" fill="none" stroke="currentColor" stroke-width="2" opacity="0.15" />
            <circle cx="300" cy="300" r="110" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="6 6" opacity="0.2" />
            <path d="M 300 300 A 200 200 0 0 1 500 300 A 150 150 0 0 1 300 450 A 100 100 0 0 1 200 300 Z" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.12" />
            <line x1="300" y1="50" x2="300" y2="550" stroke="currentColor" stroke-width="1" stroke-dasharray="10 10" opacity="0.08" />
            <line x1="50" y1="300" x2="550" y2="300" stroke="currentColor" stroke-width="1" stroke-dasharray="10 10" opacity="0.08" />
        </svg>

        <!-- Dynamic Archery Concentric Telemetry Target (Right Background - Brand Green) -->
        <svg class="absolute -right-32 -bottom-32 h-[155%] w-auto text-[#63C03B] pointer-events-none opacity-90 animate-[spin_180s_linear_infinite]" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <!-- Concentric Target Rings -->
            <circle cx="400" cy="400" r="360" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="10 15" opacity="0.25" />
            <circle cx="400" cy="400" r="290" fill="none" stroke="currentColor" stroke-width="4" opacity="0.35" />
            <circle cx="400" cy="400" r="220" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.4" />
            <circle cx="400" cy="400" r="150" fill="none" stroke="currentColor" stroke-width="6" opacity="0.55" />
            <circle cx="400" cy="400" r="80" fill="none" stroke="currentColor" stroke-width="3" opacity="0.7" />
            <circle cx="400" cy="400" r="20" fill="none" stroke="currentColor" stroke-width="8" opacity="0.9" />
            
            <!-- Expanding Radar Telemetry Grid & Spiral Arcs -->
            <line x1="400" y1="40" x2="400" y2="760" stroke="currentColor" stroke-width="1.5" stroke-dasharray="10 10" opacity="0.2" />
            <line x1="40" y1="400" x2="760" y2="400" stroke="currentColor" stroke-width="1.5" stroke-dasharray="10 10" opacity="0.2" />
            
            <!-- Beautiful Spiraling Curved Orbit Variant -->
            <path d="M 400 400 A 300 300 0 0 1 700 400 A 240 240 0 0 1 400 640 A 180 180 0 0 1 220 400 Z" fill="none" stroke="currentColor" stroke-width="2.5" opacity="0.25" />
            <path d="M 400 400 A 350 350 0 0 0 50 400 A 280 280 0 0 0 400 680" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 8" opacity="0.3" />
        </svg>

        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

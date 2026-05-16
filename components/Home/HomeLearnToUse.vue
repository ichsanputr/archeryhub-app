<template>
    <section class="py-20 sm:py-32 bg-background-light overflow-hidden">
        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Section Header -->
            <div class="text-center mb-16 sm:mb-24">
                <h2 class="text-3xl sm:text-5xl font-black text-navy leading-tight mb-6 font-display">
                    Step-by-Step Guide to Using <br class="hidden sm:block" />
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-navy to-navy/60">Archeris Efficiently</span>
                </h2>
                <p class="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto font-light">
                    Mulai kelola turnamen panahan Anda dengan sistem digital yang terintegrasi dan mudah digunakan.
                </p>
            </div>

            <!-- Steps Grid Replaced by Iframe -->
            <div class="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
                <iframe 
                    src="about:blank" 
                    class="w-full h-full"
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
                <!-- Placeholder overlay (can be removed once URL is set) -->
                <div class="absolute inset-0 flex flex-col items-center justify-center bg-navy/5 backdrop-blur-[2px] pointer-events-none">
                    <Icon icon="ph:monitor-play-bold" class="text-6xl text-navy/20 mb-4" />
                    <p class="text-navy/40 font-medium tracking-widest uppercase text-sm">Embed Tutorial / Walkthrough Here</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'
</script>

<style scoped>
/* Custom styles if needed */
</style>

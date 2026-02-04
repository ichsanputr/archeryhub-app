<template>
    <div class="relative w-full flex items-center justify-center p-4">
        <!-- Animated background elements -->
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse"
            style="animation-delay: 1s"></div>

        <div class="relative z-10 max-w-lg w-full">
            <div
                class="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 text-center relative overflow-hidden group">
                <!-- Top accent line -->
                <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-yellow-300 to-primary">
                </div>

                <!-- Decorative icon background -->
                <div
                    class="absolute -top-12 -right-12 opacity-[0.03] rotate-12 transition-transform group-hover:rotate-45 duration-700">
                    <Icon icon="ph:gear-duotone" class="text-[12rem]" />
                </div>

                <!-- Main Icon Container -->
                <div class="relative mb-8">
                    <div
                        class="w-24 h-24 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl flex items-center justify-center shadow-inner relative">
                        <Icon icon="ph:shooting-star-bold" class="text-5xl text-primary" />

                        <!-- Pulse rings -->
                        <div class="absolute inset-0 rounded-3xl border-2 border-primary/20 animate-ping"></div>
                    </div>
                </div>

                <h2 class="text-3xl font-black text-navy mb-4 tracking-tight leading-tight">
                    Fitur Ini <br />
                    <span class="text-primar">Sedang Dikembangkan</span>
                </h2>

                <p class="text-gray-500 mb-8 leading-relaxed font-medium">
                    Kami sedang bekerja keras membangun fitur terbaik untuk Anda. Nantikan fitur ini kedepannya dengan
                    tetap update di Instagram kami.
                </p>

                <a href="https://www.instagram.com/archeryhub.id/" target="_blank"
                    class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-2xl font-black text-sm  tracking-widest shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                    <Icon icon="ph:instagram-logo-fill" class="text-xl" />
                    Follow @archeryhub.id
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
</script>

<style scoped>
@keyframes pulse {

    0%,
    100% {
        opacity: 0.2;
        transform: scale(1);
    }

    50% {
        opacity: 0.3;
        transform: scale(1.1);
    }
}
</style>

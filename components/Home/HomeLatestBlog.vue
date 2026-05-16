<template>
    <section class="py-24 bg-[#DEFEBD] overflow-hidden">
        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                    <h2 class="text-4xl sm:text-6xl font-black text-navy uppercase leading-tight font-display tracking-tighter">
                        LATEST FROM<br />
                        OUR ARCHIVE.
                    </h2>
                </div>
                <NuxtLink to="/blog" class="inline-flex items-center gap-2 text-navy font-bold uppercase tracking-widest text-sm hover:translate-x-2 transition-transform">
                    View All Posts <Icon icon="ph:arrow-right-bold" />
                </NuxtLink>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Blog Card 1 -->
                <div class="group cursor-pointer">
                    <div class="aspect-[16/10] rounded-3xl overflow-hidden mb-6 bg-white shadow-lg">
                        <img src="/archery_blog_thumbnail_1778934914638.png" alt="Blog Post" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div class="flex items-center gap-4 mb-4">
                        <span class="px-3 py-1 bg-navy text-primary text-[10px] font-bold rounded-full uppercase tracking-widest">Update</span>
                        <span class="text-navy/40 text-xs font-bold uppercase tracking-widest">May 16, 2026</span>
                    </div>
                    <h3 class="text-2xl font-bold text-navy mb-4 group-hover:text-navy/70 transition-colors">Digitalizing the Archery Ecosystem: Archeris Release Notes v1.0</h3>
                    <p class="text-navy/60 font-light leading-relaxed line-clamp-2">
                        Kami dengan bangga memperkenalkan versi stabil pertama Archeris, platform yang akan mengubah cara kita mengelola olahraga panahan di Indonesia.
                    </p>
                </div>

                <!-- Blog Card 2 (Placeholder) -->
                <div class="group cursor-pointer">
                    <div class="aspect-[16/10] rounded-3xl overflow-hidden mb-6 bg-navy/5 border border-navy/10 flex items-center justify-center">
                        <Icon icon="ph:image-square-bold" class="text-4xl text-navy/20" />
                    </div>
                    <div class="flex items-center gap-4 mb-4">
                        <span class="px-3 py-1 bg-navy/10 text-navy text-[10px] font-bold rounded-full uppercase tracking-widest">Tips</span>
                        <span class="text-navy/40 text-xs font-bold uppercase tracking-widest">May 14, 2026</span>
                    </div>
                    <h3 class="text-2xl font-bold text-navy mb-4 group-hover:text-navy/70 transition-colors">Cara Efektif Mengelola Turnamen Skala Nasional</h3>
                    <p class="text-navy/60 font-light leading-relaxed line-clamp-2">
                        Panduan lengkap bagi operator klub untuk memaksimalkan fitur Archeris dalam penyelenggaraan event besar.
                    </p>
                </div>

                <!-- Blog Card 3 (Placeholder) -->
                <div class="group cursor-pointer">
                    <div class="aspect-[16/10] rounded-3xl overflow-hidden mb-6 bg-navy/5 border border-navy/10 flex items-center justify-center">
                        <Icon icon="ph:image-square-bold" class="text-4xl text-navy/20" />
                    </div>
                    <div class="flex items-center gap-4 mb-4">
                        <span class="px-3 py-1 bg-navy/10 text-navy text-[10px] font-bold rounded-full uppercase tracking-widest">Feature</span>
                        <span class="text-navy/40 text-xs font-bold uppercase tracking-widest">May 12, 2026</span>
                    </div>
                    <h3 class="text-2xl font-bold text-navy mb-4 group-hover:text-navy/70 transition-colors">Mengenal Fitur Athlete Portfolio Pro</h3>
                    <p class="text-navy/60 font-light leading-relaxed line-clamp-2">
                        Bagaimana profil digital dapat membantu atlet mendapatkan visibilitas lebih luas di komunitas panahan.
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'
</script>

<style scoped>
</style>

<template>
    <section class="py-20 sm:py-32 bg-[#DEFEBD] overflow-hidden">
        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Section Header -->
            <div class="text-center mb-16 sm:mb-24">
                <h2 class="text-3xl sm:text-5xl font-black text-navy leading-tight mb-6 font-display">
                    {{ $t('home.learn.title') }} <br class="hidden sm:block" />
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-navy to-navy/60">{{
                        $t('home.learn.subtitle') }}</span>
                </h2>
                <p class="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto font-light">
                    {{ $t('home.learn.description') }}
                </p>
            </div>

            <!-- Carousel Wrapper (Exact same style as Jersey Watch Hero Carousel with Fading Gradients) -->
            <div class="relative w-full overflow-hidden py-4">

                <!-- Left/Right Fading Shadow Gradients (The "bg shadow" effect) -->
                <div
                    class="absolute left-0 top-0 bottom-0 w-8 sm:w-32 bg-gradient-to-r from-[#DEFEBD] via-[#DEFEBD]/90 to-transparent z-20 pointer-events-none">
                </div>
                <div
                    class="absolute right-0 top-0 bottom-0 w-8 sm:w-32 bg-gradient-to-l from-[#DEFEBD] via-[#DEFEBD]/90 to-transparent z-20 pointer-events-none">
                </div>

                <!-- Scrolling Container -->
                <div ref="carouselContainer"
                    class="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar px-8 sm:px-32 pb-8">

                    <!-- Slide 1 -->
                    <div
                        class="min-w-[280px] sm:min-w-[500px] md:min-w-[700px] snap-center flex-shrink-0 bg-white rounded-3xl border border-navy/5 shadow-xl overflow-hidden p-6 sm:p-10 flex flex-col md:flex-row gap-8">
                        <div class="flex-1 flex flex-col justify-center">
                            <span
                                class="w-10 h-10 rounded-full bg-primary/20 text-navy flex items-center justify-center font-black mb-6">1</span>
                            <h3 class="text-xl sm:text-2xl font-black text-navy mb-4 font-display">Daftar & Buat Profil
                                Klub</h3>
                            <p class="text-text-secondary text-sm sm:text-base font-light leading-relaxed">
                                Buat profil klub kustom Anda, tambahkan logo, info kontak, dan atur jadwal latihan
                                anggota dalam hitungan menit.
                            </p>
                        </div>
                        <div
                            class="flex-1 bg-gray-50 rounded-2xl border border-gray-100 p-6 flex flex-col justify-center gap-4 relative overflow-hidden group">
                            <!-- Visual Graphic Mockup for step 1 -->
                            <div class="flex items-center gap-4 border-b border-gray-200/60 pb-4">
                                <div
                                    class="w-12 h-12 rounded-xl bg-primary flex items-center justify-center font-black text-navy text-lg shadow-sm">
                                    AH</div>
                                <div>
                                    <h4 class="font-bold text-navy text-sm">Archery Hub Surabaya</h4>
                                    <span class="text-xs text-text-secondary/80">Klub Panahan Profesional</span>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <div class="h-2 bg-navy/10 rounded-full w-full"></div>
                                <div class="h-2 bg-navy/10 rounded-full w-5/6"></div>
                                <div class="h-2 bg-navy/10 rounded-full w-4/6"></div>
                            </div>
                            <span
                                class="absolute right-4 bottom-4 px-3 py-1 bg-[#DEFEBD] text-navy text-[10px] font-bold rounded-full uppercase tracking-wider">Aktif</span>
                        </div>
                    </div>

                    <!-- Slide 2 -->
                    <div
                        class="min-w-[280px] sm:min-w-[500px] md:min-w-[700px] snap-center flex-shrink-0 bg-white rounded-3xl border border-navy/5 shadow-xl overflow-hidden p-6 sm:p-10 flex flex-col md:flex-row gap-8">
                        <div class="flex-1 flex flex-col justify-center">
                            <span
                                class="w-10 h-10 rounded-full bg-primary/20 text-navy flex items-center justify-center font-black mb-6">2</span>
                            <h3 class="text-xl sm:text-2xl font-black text-navy mb-4 font-display">Atur Target &
                                Lapangan</h3>
                            <p class="text-text-secondary text-sm sm:text-base font-light leading-relaxed">
                                Alokasikan bantalan target secara dinamis berdasarkan divisi umur, jenis busur, dan sesi
                                kualifikasi turnamen.
                            </p>
                        </div>
                        <div
                            class="flex-1 bg-gray-50 rounded-2xl border border-gray-100 p-6 flex flex-col justify-center gap-4 relative overflow-hidden">
                            <!-- Visual Graphic Mockup for step 2 -->
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-xs font-bold text-navy">Layout Target Butt</span>
                                <span class="text-xs text-primary font-bold">12 Sasaran</span>
                            </div>
                            <div class="grid grid-cols-4 gap-3">
                                <div v-for="i in 4" :key="i"
                                    class="aspect-square rounded-xl border-2 border-navy/10 bg-white flex flex-col items-center justify-center p-1 hover:border-primary transition-colors cursor-pointer">
                                    <span class="text-xs font-bold text-navy">{{ i }}A</span>
                                    <span class="text-[8px] text-text-secondary">U-15</span>
                                </div>
                            </div>
                            <div class="h-2 bg-navy/10 rounded-full w-full mt-2"></div>
                        </div>
                    </div>

                    <!-- Slide 3 -->
                    <div
                        class="min-w-[280px] sm:min-w-[500px] md:min-w-[700px] snap-center flex-shrink-0 bg-white rounded-3xl border border-navy/5 shadow-xl overflow-hidden p-6 sm:p-10 flex flex-col md:flex-row gap-8">
                        <div class="flex-1 flex flex-col justify-center">
                            <span
                                class="w-10 h-10 rounded-full bg-primary/20 text-navy flex items-center justify-center font-black mb-6">3</span>
                            <h3 class="text-xl sm:text-2xl font-black text-navy mb-4 font-display">Skor Live & Turnamen
                            </h3>
                            <p class="text-text-secondary text-sm sm:text-base font-light leading-relaxed">
                                Skor kualifikasi dan eliminasi atlet dicatat langsung dari lapangan menggunakan aplikasi
                                skor digital atau kode QR.
                            </p>
                        </div>
                        <div
                            class="flex-1 bg-navy text-white rounded-2xl p-6 flex flex-col justify-center gap-4 relative overflow-hidden">
                            <!-- Visual Graphic Mockup for step 3 -->
                            <div class="flex justify-between items-center border-b border-white/10 pb-3">
                                <span class="text-xs font-bold text-primary tracking-widest ">Live Scoring</span>
                                <span class="text-xs font-bold text-white/40">Sesi 1</span>
                            </div>
                            <div class="flex items-center justify-between gap-4">
                                <div>
                                    <span
                                        class="text-[10px] text-white/40 font-bold uppercase tracking-wider">Archer</span>
                                    <h4 class="font-bold text-sm text-white">Budi Santoso</h4>
                                </div>
                                <div class="flex gap-1.5">
                                    <span
                                        class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sm">X</span>
                                    <span
                                        class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sm">10</span>
                                    <span
                                        class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sm">9</span>
                                </div>
                            </div>
                            <div
                                class="flex justify-between items-center text-xs font-bold pt-2 border-t border-white/5">
                                <span class="text-white/60">Total Score:</span>
                                <span class="text-primary text-base">29</span>
                            </div>
                        </div>
                    </div>

                    <!-- Slide 4 -->
                    <div
                        class="min-w-[280px] sm:min-w-[500px] md:min-w-[700px] snap-center flex-shrink-0 bg-white rounded-3xl border border-navy/5 shadow-xl overflow-hidden p-6 sm:p-10 flex flex-col md:flex-row gap-8">
                        <div class="flex-1 flex flex-col justify-center">
                            <span
                                class="w-10 h-10 rounded-full bg-primary/20 text-navy flex items-center justify-center font-black mb-6">4</span>
                            <h3 class="text-xl sm:text-2xl font-black text-navy mb-4 font-display">Analisis & Portofolio
                                Atlet</h3>
                            <p class="text-text-secondary text-sm sm:text-base font-light leading-relaxed">
                                Lihat tren performa atlet secara visual, unduh sertifikat digital, dan bagikan
                                pencapaian ke komunitas luas.
                            </p>
                        </div>
                        <div
                            class="flex-1 bg-gray-50 rounded-2xl border border-gray-100 p-6 flex flex-col justify-center gap-4 relative overflow-hidden">
                            <!-- Visual Graphic Mockup for step 4 -->
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-bold text-navy">Statistik Atlet</span>
                                <span class="text-xs text-navy/40 font-bold">10 Sesi Terakhir</span>
                            </div>
                            <div class="flex items-end gap-3 h-20 pt-4">
                                <div class="bg-navy/10 rounded-t-lg flex-1 h-[40%]"></div>
                                <div class="bg-navy/10 rounded-t-lg flex-1 h-[60%]"></div>
                                <div class="bg-navy/10 rounded-t-lg flex-1 h-[55%]"></div>
                                <div class="bg-primary rounded-t-lg flex-1 h-[90%] relative group">
                                    <span
                                        class="absolute -top-6 left-1/2 -translate-x-1/2 bg-navy text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">9.2</span>
                                </div>
                            </div>
                            <div
                                class="flex justify-between items-center text-[10px] text-text-secondary font-bold pt-2 border-t border-gray-200">
                                <span>Rata-rata Skor: 9.2</span>
                                <span class="text-primary">Naik 12%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Navigation Controls -->
                <div class="flex justify-center items-center gap-4 mt-8">
                    <button @click="scrollLeft"
                        class="w-12 h-12 rounded-full border border-navy/15 bg-white hover:bg-navy/5 hover:border-primary text-navy flex items-center justify-center transition-all group/btn shadow-md"
                        aria-label="Previous Step">
                        <Icon icon="ph:caret-left-bold"
                            class="text-xl group-hover/btn:-translate-x-0.5 transition-transform" />
                    </button>
                    <!-- Indicators -->
                    <div class="flex items-center gap-2">
                        <span v-for="i in 4" :key="i" class="h-1.5 rounded-full transition-all duration-300"
                            :class="activeIndex === i - 1 ? 'w-8 bg-navy' : 'w-2 bg-navy/20'"></span>
                    </div>
                    <button @click="scrollRight"
                        class="w-12 h-12 rounded-full border border-navy/15 bg-white hover:bg-navy/5 hover:border-primary text-navy flex items-center justify-center transition-all group/btn shadow-md"
                        aria-label="Next Step">
                        <Icon icon="ph:caret-right-bold"
                            class="text-xl group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

const activeIndex = ref(0)
const carouselContainer = ref(null)

const handleScroll = () => {
    if (!carouselContainer.value) return
    const scrollLeft = carouselContainer.value.scrollLeft
    const card = carouselContainer.value.querySelector('.snap-center')
    if (card) {
        const cardWidth = card.clientWidth + 32
        const index = Math.round(scrollLeft / cardWidth)
        activeIndex.value = Math.max(0, Math.min(3, index))
    }
}

const scrollLeft = () => {
    if (carouselContainer.value) {
        const card = carouselContainer.value.querySelector('.snap-center')
        if (card) {
            const cardWidth = card.clientWidth + 32
            carouselContainer.value.scrollBy({ left: -cardWidth, behavior: 'smooth' })
        }
    }
}

const scrollRight = () => {
    if (carouselContainer.value) {
        const card = carouselContainer.value.querySelector('.snap-center')
        if (card) {
            const cardWidth = card.clientWidth + 32
            carouselContainer.value.scrollBy({ left: cardWidth, behavior: 'smooth' })
        }
    }
}

onMounted(() => {
    if (carouselContainer.value) {
        carouselContainer.value.addEventListener('scroll', handleScroll)
    }
})

onUnmounted(() => {
    if (carouselContainer.value) {
        carouselContainer.value.removeEventListener('scroll', handleScroll)
    }
})
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

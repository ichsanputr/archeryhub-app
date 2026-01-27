<template>
    <div class="min-h-screen bg-background-light font-body text-navy overflow-x-hidden">

        <!-- Hero Section -->
        <section class="relative w-full h-screen overflow-hidden">
            <div class="absolute inset-0 w-full h-full">
                <img alt="Professional archer aiming at target" class="w-full h-full object-cover object-center"
                    src="/hero-homepage.jpeg" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                </div>
            </div>
            <div class="relative z-10 w-full h-full flex items-center">
                <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div class="max-w-2xl">
                        <div ref="heroBadge"
                            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 w-fit mb-6 border border-white/10 backdrop-blur-md opacity-0 translate-y-4">
                            <span class="w-2 h-2 rounded-full bg-primary"></span>
                            <span class="text-white/90 text-xs font-medium tracking-wide uppercase">Platform Panahan
                                No.1 di
                                Indonesia</span>
                        </div>
                        <h1 ref="heroTitle"
                            class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.2] sm:leading-[1.1] mb-4 sm:mb-6 tracking-tight drop-shadow-lg font-display opacity-0 translate-y-8">
                            All in One<br />
                            <span
                                class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-green-300">Platform
                                Panahan</span><br /> Indonesia
                        </h1>
                        <p ref="heroText"
                            class="text-white/80 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-8 sm:mb-10 max-w-xl drop-shadow-md opacity-0 translate-y-8">
                            Archeryhub.id hadir sebagai wadah bagi seluruh penggiat panahan di Indonesia. Dari pemula
                            hingga juara nasional, di sini kita terhubung lewat event, prestasi, dan semangat yang sama.
                        </p>
                        <div ref="heroButtons" class="flex flex-col sm:flex-row gap-4 opacity-0 translate-y-8">
                            <NuxtLink to="/auth/login"
                                class="bg-primary hover:bg-primary-hover text-navy text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(183,251,35,0.39)] hover:shadow-[0_6px_20px_rgba(183,251,35,0.23)] hover:-translate-y-0.5 text-center">
                                Mulai Sekarang
                            </NuxtLink>
                            <button
                                class="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors backdrop-blur-md">
                                Cek Fiturnya
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Main Content Section: Tournaments & CTA -->
        <section class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 -mt-12 relative z-20">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 sm:mt-2 gap-6 md:gap-8">
                <!-- Column 1: Upcoming Tournaments -->
                <div class="md:col-span-2 lg:col-span-2">
                    <div class="bg-white rounded-3xl shadow-sm border border-border-subtle/50 p-6 md:p-8 h-full">
                        <div class="flex items-center justify-between mb-8">
                            <div>
                                <h2 class="text-navy text-xl sm:text-2xl font-bold tracking-tight font-display">Event
                                    Bakal Digelar</h2>
                                <p class="text-text-sub text-xs sm:text-sm mt-1">Daftar sekarang sebelum slotnya penuh!
                                </p>
                            </div>
                            <NuxtLink to="/events"
                                class="flex items-center gap-1 text-navy text-xs sm:text-sm font-semibold hover:text-primary transition-colors group">
                                <span class="hidden sm:inline">Cek Semua</span>
                                <span class="sm:hidden">Semua</span>
                                <span
                                    class="material-symbols-outlined text-base sm:text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </NuxtLink>
                        </div>

                        <div
                            class="space-y-4 px-1 max-h-[550px] overflow-y-auto scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-200 hover:scrollbar-thumb-primary/30 transition-colors pr-2 custom-scrollbar">
                            <div v-for="(event, index) in upcomingEvents" :key="event.name"
                                class="group bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden">
                                <div class="flex flex-row items-center sm:items-center justify-between gap-4">
                                    <div class="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
                                        <!-- Date Badge (Redesigned for Mobile) -->
                                        <div
                                            class="flex-shrink-0 flex flex-col items-center justify-center w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-navy text-white shadow-sm group-hover:bg-primary group-hover:text-navy transition-colors duration-300">
                                            <span
                                                class="text-[8px] sm:text-xs font-bold uppercase tracking-wider opacity-80">{{
                                                    event.month }}</span>
                                            <span class="text-sm sm:text-2xl font-black leading-none">{{ event.day
                                                }}</span>
                                        </div>

                                        <div class="flex flex-col min-w-0 flex-1">
                                            <h3
                                                class="text-navy text-sm sm:text-lg font-bold group-hover:text-primary transition-colors font-display line-clamp-1">
                                                {{ event.name }}
                                            </h3>
                                            <div
                                                class="flex items-center gap-2 mt-0.5 sm:mt-1 text-[10px] sm:text-sm text-text-sub">
                                                <div class="flex items-center gap-1">
                                                    <span
                                                        class="material-symbols-outlined text-[12px] sm:text-base text-primary/60">location_on</span>
                                                    <span class="truncate">{{ event.location }}</span>
                                                </div>
                                                <span class="sm:hidden w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span class="sm:hidden text-navy font-bold">Terverifikasi</span>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- asas -->

                                    <div v-if="!isLoggedIn || isArcher" class="flex-shrink-0">
                                        <NuxtLink :to="`/events/${event.slug || index}`"
                                            class="inline-flex items-center justify-center bg-gray-50 group-hover:bg-primary text-navy font-bold p-2 sm:py-2.5 sm:px-6 rounded-lg sm:rounded-xl transition-all border border-gray-100 group-hover:border-primary text-xs sm:text-sm shadow-sm group-hover:shadow-md">
                                            <span class="hidden sm:inline">Ikuti</span>
                                            <span
                                                class="material-symbols-outlined text-lg sm:ml-2 text-navy/40 group-hover:text-navy transition-colors">chevron_right</span>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- View More Footer -->
                        <div class="mt-8 flex justify-center">
                            <NuxtLink to="/events"
                                class="flex items-center gap-2 text-navy text-sm font-bold hover:text-primary transition-colors group">
                                Cek Semua Event
                                <span
                                    class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </NuxtLink>
                        </div>
                    </div>
                </div>

                <!-- Column 2: CTA Cards (Stacked) -->
                <div class="md:col-span-2 lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
                    <div
                        class="relative overflow-hidden group bg-navy rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm transition-all duration-300 flex-1 min-h-[240px] sm:min-h-[280px]">
                        <div
                            class="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-50 z-0">
                        </div>
                        <div class="relative z-10">
                            <div
                                class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-navy mb-5">
                                <span class="material-symbols-outlined text-xl">person_add</span>
                            </div>
                            <h3 class="text-xl sm:text-2xl font-bold text-white mb-2 font-display">Gabung Jadi Pemanah
                            </h3>
                            <p class="text-white/60 text-sm mb-6">Bikin profil prestasi dan ikut event seru
                                se-Indonesia.
                            </p>
                        </div>
                        <div class="relative z-10">
                            <NuxtLink to="/auth/register?type=archer"
                                class="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-navy text-sm font-bold px-6 py-3 rounded-xl transition-all">
                                Daftar Sekarang
                                <span class="material-symbols-outlined text-lg">arrow_forward</span>
                            </NuxtLink>
                        </div>
                    </div>

                    <div
                        class="relative overflow-hidden group bg-white border border-border-subtle rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm transition-all duration-300 flex-1 min-h-[240px] sm:min-h-[280px]">
                        <div class="relative z-10">
                            <div class="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-white mb-5">
                                <span class="material-symbols-outlined text-xl">domain_add</span>
                            </div>
                            <h3 class="text-xl sm:text-2xl font-bold text-navy mb-2 font-display">Klub & Organisasi</h3>
                            <p class="text-text-sub text-sm mb-6">Kelola klub atau federasi kamu pakai cara modern.</p>
                        </div>
                        <div class="relative z-10">
                            <NuxtLink to="/auth/register?type=organization"
                                class="w-full inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white text-sm font-bold px-6 py-3 rounded-xl transition-all">
                                Bikin Akun Klub
                                <span class="material-symbols-outlined text-lg">arrow_forward</span>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Precision Ecosystem Features -->
        <section class="relative bg-white py-12 sm:py-24 md:py-32 overflow-hidden border-b border-gray-100">
            <!-- Background Glow/Patterns -->
            <div class="absolute inset-0 pointer-events-none opacity-20">
                <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full"></div>
                <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-navy/5 blur-[120px] rounded-full"></div>
            </div>

            <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    <!-- Desktop: Left Column (Image Slider) -->
                    <div v-if="!isMobile" class="lg:col-span-7 relative order-1 lg:order-1">
                        <!-- Main Feature Image with Description Overlay -->
                        <div
                            class="relative w-full aspect-video md:aspect-[4/3] rounded-[2rem] bg-navy overflow-hidden shadow-2xl group border border-white/5">
                            <!-- Background Image -->
                            <img :src="featureItems[activeFeature].image" :alt="featureItems[activeFeature].title"
                                class="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000 scale-[1.05]" />

                            <!-- Static Overlays -->
                            <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent"></div>
                            <div class="absolute inset-0 abstract-pattern opacity-5"></div>
                            <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[80px] rounded-full">
                            </div>

                            <!-- Dynamic Content Overlay -->
                            <div class="absolute inset-0 p-6 sm:p-8 md:p-12 flex flex-col justify-end">
                                <Transition mode="out-in" enter-active-class="transition duration-500 ease-out"
                                    enter-from-class="opacity-0 translate-y-8"
                                    enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition duration-300 ease-in"
                                    leave-from-class="opacity-100 translate-y-0"
                                    leave-to-class="opacity-0 -translate-y-8">
                                    <div :key="activeFeature" class="max-w-xl">
                                        <h3
                                            class="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black text-white mb-2 sm:mb-4 font-display leading-tight">
                                            {{ featureItems[activeFeature].title }}
                                        </h3>
                                        <p
                                            class="text-white/80 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed font-light">
                                            {{ featureItems[activeFeature].longDescription }}
                                        </p>
                                    </div>
                                </Transition>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Features List -->
                    <div class="lg:col-span-12 lg:col-start-8 lg:col-span-5 flex flex-col gap-8 md:gap-10 order-2">
                        <div class="space-y-6">
                            <span
                                class="inline-block py-1 px-3 bg-primary text-navy text-[10px] font-black uppercase tracking-[0.2em] rounded-md">Ekosistem
                                Presisi</span>
                            <h2
                                class="text-3xl md:text-4xl lg:text-5xl font-black text-navy leading-[1.1] font-display">
                                Semua Makin <span
                                    class="text-transparent bg-clip-text bg-gradient-to-r from-navy to-navy/40">Presisi.</span>
                            </h2>
                            <p class="text-sm sm:text-base lg:text-lg text-text-sub leading-relaxed max-w-md">
                                Solusi digital lengkap buat semua penggiat panahan Indonesia.
                            </p>
                        </div>

                        <!-- Mobile: Main Feature Image with Description Overlay -->
                        <div v-if="isMobile"
                            class="relative w-full aspect-video rounded-3xl bg-navy overflow-hidden shadow-xl border border-white/5 animate-fade-in">
                            <!-- Background Image -->
                            <img :src="featureItems[activeFeature].image" :alt="featureItems[activeFeature].title"
                                class="w-full h-full object-cover opacity-60 scale-[1.05]" />

                            <!-- Static Overlays -->
                            <div class="absolute inset-0 bg-gradient-to-t from-navy transition-all duration-500"
                                :style="{ opacity: activeFeature >= 0 ? 0.9 : 0.6 }"></div>

                            <!-- Dynamic Content Overlay (Mobile View) -->
                            <div class="absolute inset-0 p-6 flex flex-col justify-end">
                                <Transition mode="out-in" enter-active-class="transition duration-300 ease-out"
                                    enter-from-class="opacity-0 translate-y-4"
                                    enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition duration-200 ease-in"
                                    leave-from-class="opacity-100 translate-y-0"
                                    leave-to-class="opacity-0 -translate-y-4">
                                    <div :key="activeFeature">
                                        <h3 class="text-xl font-black text-white mb-2 font-display">
                                            {{ featureItems[activeFeature].title }}
                                        </h3>
                                        <p class="text-white/80 text-[11px] leading-relaxed line-clamp-3">
                                            {{ featureItems[activeFeature].longDescription }}
                                        </p>
                                    </div>
                                </Transition>
                            </div>
                        </div>

                        <!-- Interactive Feature Cards (Scrollable) -->
                        <div class="relative">
                            <div
                                class="flex flex-col gap-3 max-h-[350px] sm:max-h-[400px] overflow-y-auto pr-2 sm:pr-4 custom-scrollbar">
                                <div v-for="(feature, idx) in featureItems" :key="feature.title"
                                    @click="activeFeature = idx"
                                    class="group flex items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 cursor-pointer"
                                    :class="activeFeature === idx ? 'bg-navy border-navy ring-1 sm:ring-2 ring-primary ring-offset-2 shadow-xl scale-[1.01]' : 'bg-white border-gray-100 hover:border-primary/50 hover:shadow-lg'">
                                    <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-5 transition-colors duration-300 flex-shrink-0"
                                        :class="activeFeature === idx ? 'bg-primary text-navy' : 'bg-gray-50 text-navy group-hover:bg-primary'">
                                        <Icon :icon="feature.icon" class="text-xl sm:text-2xl" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h4 class="text-sm sm:text-lg font-bold transition-colors duration-300 truncate"
                                            :class="activeFeature === idx ? 'text-white' : 'text-navy'">
                                            {{ feature.title }}
                                        </h4>
                                        <p v-if="activeFeature === idx"
                                            class="text-white/60 text-[10px] sm:text-xs mt-0.5 animate-fade-in line-clamp-1">
                                            {{ feature.description }}
                                        </p>
                                    </div>
                                    <Icon icon="ph:caret-right-bold"
                                        class="text-lg sm:text-xl transition-all duration-300 flex-shrink-0"
                                        :class="activeFeature === idx ? 'text-primary opacity-100 translate-x-1' : 'text-gray-200 opacity-20'" />
                                </div>
                            </div>
                            <!-- Bottom Fade Overlay -->
                            <div
                                class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/80 to-transparent pointer-events-none">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Live Events Section -->
        <section class="bg-gray-50 py-16 md:py-20 overflow-hidden">
            <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2 sm:gap-3 font-display">
                        <span class="w-2.5 h-2.5 sm:w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                        Lagi Berlangsung Nih!
                    </h2>
                    <NuxtLink to="/events"
                        class="text-navy hover:text-primary font-bold text-xs sm:text-sm flex items-center gap-1 group">
                        <span class="hidden sm:inline">Cek Jadwalnya</span>
                        <span class="sm:hidden">Jadwal</span>
                        <span
                            class="material-symbols-outlined text-base sm:text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </NuxtLink>
                </div>
                <div
                    class="flex lg:grid lg:grid-cols-4 gap-6 lg:gap-8 pb-8 lg:pb-0 overflow-x-auto lg:overflow-x-visible -mx-4 px-4 sm:mx-0 sm:px-0 lg:mx-0 lg:px-0 no-scrollbar snap-x lg:snap-none">
                    <div v-for="live in liveEvents" :key="live.name"
                        class="min-w-[300px] md:min-w-[380px] lg:min-w-0 snap-center group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col">
                        <div class="relative h-48 overflow-hidden">
                            <img :src="useImageOrDefault(live.image || live.image_url || live.banner_url)"
                                :alt="live.name"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div class="p-5 flex-1 flex flex-col">
                            <h3
                                class="text-lg font-bold text-navy mb-2 leading-snug group-hover:text-primary transition-colors font-display">
                                {{ live.name }}
                            </h3>
                            <div class="flex items-start gap-2 text-text-sub text-sm mb-4">
                                <span class="material-symbols-outlined text-lg mt-0.5">location_on</span>
                                <span class="truncate">{{ live.location }}</span>
                            </div>
                            <div class="mt-auto">
                                <NuxtLink :to="`/events/${live.slug || live.uuid}`"
                                    class="w-full h-10 rounded-lg border-2 border-navy text-navy hover:bg-navy hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
                                    <span class="material-symbols-outlined text-lg">scoreboard</span>
                                    Cek Skor Live
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Featured Clubs Section -->
        <section class="bg-[#f8fafc] py-16 md:py-20 border-y border-gray-200 relative z-10">
            <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-bold text-navy mb-2 font-display">Klub Pilihan</h2>
                        <p class="text-text-sub text-xs sm:text-sm hidden sm:block">Cek klub panahan keren di sekitar
                            kamu.</p>
                    </div>
                    <NuxtLink to="/klub"
                        class="text-navy hover:text-primary font-bold text-xs sm:text-sm flex items-center gap-1 sm:gap-2 group">
                        <span class="hidden sm:inline">Cek Semua Klub</span>
                        <span class="sm:hidden">Semua Klub</span>
                        <span
                            class="material-symbols-outlined text-base sm:text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </NuxtLink>
                </div>
                <div
                    class="flex flex-nowrap items-center gap-3 mb-8 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                    <button v-for="region in regions" :key="region"
                        class="px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors whitespace-nowrap flex-shrink-0"
                        :class="activeRegion === region ? 'bg-primary text-navy shadow-md' : 'bg-slate-200/70 text-navy hover:bg-slate-300'"
                        @click="activeRegion = region">
                        {{ region }}
                    </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div v-for="club in filteredClubs" :key="club.name"
                        class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center relative group">
                        <div v-if="club.verified"
                            class="absolute top-3 right-3 bg-primary text-navy px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <span class="material-symbols-outlined text-[14px] fill-1">verified</span> Verifikasi
                        </div>
                        <div
                            class="w-20 h-20 rounded-2xl bg-navy/5 text-navy flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                            <img v-if="club.logo_url" :src="club.logo_url" :alt="club.name"
                                class="w-full h-full object-cover" />
                            <span v-else class="material-symbols-outlined text-4xl">{{ club.icon }}</span>
                        </div>
                        <h3 class="text-base sm:text-lg font-bold text-navy mb-1 font-display">{{ club.name }}</h3>
                        <div class="flex items-center gap-1 text-text-sub text-xs sm:text-sm mb-6">
                            <span class="material-symbols-outlined text-sm sm:text-base">location_on</span>
                            <span>{{ club.location }}</span>
                        </div>
                        <NuxtLink :to="`/klub/${club.slug}`"
                            class="w-full mt-auto py-2.5 px-4 bg-primary hover:bg-primary-hover text-navy font-bold text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2">
                            Cek Profil
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </section>

        <!-- Latest News Section -->
        <section class="bg-white py-16 md:py-20 border-t border-gray-100">
            <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">Kabar Terbaru</h2>
                    <NuxtLink class="text-text-sub hover:text-navy font-bold text-xs sm:text-sm" to="/berita">Cek Berita
                        Lainnya
                    </NuxtLink>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <NuxtLink v-for="news in latestNews" :key="news.title" :to="`/berita/${news.slug}`"
                        class="flex flex-col group cursor-pointer">
                        <div class="relative h-60 rounded-2xl overflow-hidden mb-5">
                            <img :src="useImageOrDefault(news.image || news.image_url)" :alt="news.title"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div
                                class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent">
                            </div>
                            <span
                                class="absolute bottom-4 left-4 text-white text-xs font-bold bg-navy px-3 py-1 rounded-md">{{
                                    news.category }}</span>
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center gap-3 text-sm text-text-sub mb-2">
                                <span class="flex items-center gap-1"><span
                                        class="material-symbols-outlined text-sm">calendar_today</span> {{ news.date
                                        }}</span>
                            </div>
                            <h3
                                class="text-lg sm:text-xl font-bold text-navy mb-3 group-hover:text-primary line-clamp-2 font-display">
                                {{ news.title }}
                            </h3>
                            <p class="text-text-sub mb-4 line-clamp-2 text-sm sm:text-base">
                                {{ news.excerpt }}
                            </p>
                            <span
                                class="text-navy hover:text-primary font-bold text-xs sm:text-sm flex items-center gap-1">
                                Simak Selengkapnya <span
                                    class="material-symbols-outlined text-sm">arrow_right_alt</span>
                            </span>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'

gsap.registerPlugin(ScrollTrigger)

const isMobile = ref(false)
const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024
}

onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
})

definePageMeta({
    layout: 'landing'
})

const { isLoggedIn, user } = useAuth()
const isArcher = computed(() => user.value?.type === 'archer' || user.value?.role === 'archer')

const activeRegion = ref('Semua Wilayah')
const clubs = ref([])

const regions = ['Semua Wilayah', 'DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'DI Yogyakarta', 'Banten', 'Bali']

// Map province names to region names
const provinceToRegion = {
    'DKI Jakarta': 'DKI Jakarta',
    'Jawa Barat': 'Jawa Barat',
    'Jawa Timur': 'Jawa Timur',
    'DI Yogyakarta': 'DI Yogyakarta',
    'Banten': 'Banten',
    'Bali': 'Bali',
    'Kalimantan Timur': 'Kalimantan'
}

const fetchClubs = async () => {
    try {
        const response = await get('/clubs', { query: { limit: '20' } })
        const clubsData = response?.data || []
        // Map club names to icons
        const iconMap = {
            'Jakarta Elite Archery': 'target',
            'Pasopati Archery': 'legend_toggle',
            'Borneo Eagle Club': 'flight',
            'Bali Zen Archery': 'spa',
            'Bandung Archery Club': 'sports',
            'Surabaya Archery Team': 'emoji_events',
            'Akun Ngekode': 'code'
        }

        clubs.value = clubsData.map(club => ({
            slug: club.slug,
            name: club.name,
            location: club.city ? `${club.city}${club.province ? ', ' + club.province : ''}` : (club.province || ''),
            icon: iconMap[club.name] || 'target', // Use mapped icon or default
            verified: club.verification_status === 'verified',
            logo_url: club.logo_url,
            region: provinceToRegion[club.province] || club.province || 'Semua Wilayah',
            city: club.city,
            province: club.province
        }))
    } catch (error) {
        console.error('Failed to fetch clubs:', error)
        clubs.value = []
    }
}

const filteredClubs = computed(() => {
    if (activeRegion.value === 'Semua Wilayah') return clubs.value
    return clubs.value.filter(club => club.region === activeRegion.value)
})

// Refs for GSAP animations
const heroBadge = ref(null)
const heroTitle = ref(null)
const heroText = ref(null)
const heroButtons = ref(null)

onMounted(() => {
    // GSAP Hero Animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } })

    tl.to(heroBadge.value, { opacity: 1, y: 0, duration: 0.8 }, 0.2)
        .to(heroTitle.value, { opacity: 1, y: 0, duration: 1 }, 0.4)
        .to(heroText.value, { opacity: 1, y: 0, duration: 1 }, 0.6)
        .to(heroButtons.value, { opacity: 1, y: 0, duration: 1 }, 0.8)

    // Fetch live events, latest news, and clubs
    fetchLiveEvents()
    fetchLatestNews()
    fetchClubs()
})

useHead({
    title: 'Archeryhub.id - All in One Platform Panahan Indonesia',
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ],
    meta: [
        {
            name: 'description', content: 'Archeryhub.id hadir sebagai wadah bagi seluruh penggiat panahan di Indonesia. Dari pemula hingga juara nasional, di sini kita terhubung lewat event, prestasi, dan semangat yang sama.'
        }
    ]
})

const upcomingEvents = [
    {
        slug: 'jakarta-open-2024',
        name: 'Jakarta Open 2024',
        month: 'Nov',
        day: '14',
        location: 'GBK Arena, Senayan',
        categories: 'Recurve & Compound',
        tags: [
            { label: 'Grade A', class: 'bg-primary/10 text-primary border border-primary/20' },
            { label: 'National', class: 'bg-navy/10 text-navy border border-navy/20' }
        ]
    },
    {
        slug: 'banten-archery-series',
        name: 'Banten Archery Series',
        month: 'Dec',
        day: '05',
        location: 'Tangerang, Banten',
        categories: 'Barebow & Standard',
        tags: [
            { label: 'Official', class: 'bg-primary/10 text-primary border border-primary/20' }
        ]
    },
    {
        slug: 'youth-archery-cup',
        name: 'Youth Archery Cup',
        month: 'Dec',
        day: '20',
        location: 'Bandung, Jawa Barat',
        categories: 'U-12, U-15, U-17',
        tags: [
            { label: 'Junior', class: 'bg-orange-50 text-orange-600 border border-orange-100' }
        ]
    }
]

const { get } = useApi()
const liveEvents = ref([])

const fetchLiveEvents = async () => {
    try {
        const response = await get('/events', { query: { status: 'ongoing', limit: '8' } })
        liveEvents.value = (response?.events || []).map(event => ({
            name: event.name || event.title,
            location: event.location || event.venue || '',
            type: event.status || 'Ongoing',
            image: event.image || event.banner_url || event.image_url,
            slug: event.slug || event.uuid,
            uuid: event.uuid
        }))
    } catch (error) {
        console.error('Failed to fetch live events:', error)
        liveEvents.value = []
    }
}

const activeFeature = ref(0)
const featureItems = [
    {
        title: 'Skoring Digital Real-time',
        icon: 'ic:outline-scoreboard',
        description: 'Input skor langsung di genggaman.',
        longDescription: 'Nggak ada lagi catat manual pakai kertas. Wasit atau atlet tinggal klik skor di aplikasi, dan hasilnya langsung dihitung otomatis. Data skor langsung sinkron ke server buat ditampilin di TV atau layar besar saat event berlangsung.',
        image: 'https://images.unsplash.com/photo-1541535881962-3bb380b08458?auto=format&fit=crop&q=80&w=1200'
    },
    {
        title: 'Registrasi Simpel',
        icon: 'ph:user-plus-bold',
        description: 'Daftar turnamen dalam satu klik.',
        longDescription: 'Capek nginput data yang sama berulang kali? Di Archeryhub, profil atlet kamu udah kesimpan aman. Mau ikut turnamen apapun tinggal pilih eventnya, klik daftar, dan beres! Nggak perlu lagi isi form panjang yang bikin pening.',
        image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=1200'
    },
    {
        title: 'Leaderboard Update Terus',
        icon: 'ph:chart-bar-horizontal-bold',
        description: 'Pantau posisi rival tanpa jeda.',
        longDescription: 'Mau tau siapa yang lagi memimpin? Leaderboard kami update setiap ada skor baru yang masuk. Atlet, pelatih, dan penonton bisa terus mantau siapa yang dapet peringkat teratas di babak kualifikasi maupun eliminasi secara detail.',
        image: 'https://images.unsplash.com/photo-1444491741275-3747c33cc99b?auto=format&fit=crop&q=80&w=1200'
    },
    {
        title: 'Laporan Beres Otomatis',
        icon: 'ph:article-bold',
        description: 'Hasil lomba siap dalam sekejap.',
        longDescription: 'Begitu panah terakhir ditembakkan, laporan hasil pertandingan udah siap. Panitia nggak perlu begadang buat rekap data. Sistem kita otomatis nge-generate PDF hasil lomba per divisi yang akurat dan sesuai standar federasi.',
        image: 'https://images.unsplash.com/photo-1511880493577-f3d35706497f?auto=format&fit=crop&q=80&w=1200'
    },
    {
        title: 'Sertifikat Digital Instant',
        icon: 'ph:certificate-bold',
        description: 'Klaim prestasi kamu hari itu juga.',
        longDescription: 'Menang atau kalah, dedikasi kamu pantes dapet apresiasi. E-sertifikat resmi bakal langsung muncul di profil kamu begitu event selesai. Bisa langsung didownload buat diprint atau dipamerin ke story Instagram kamu!',
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=1200'
    },
    {
        title: 'Manajemen Klub Terpadu',
        icon: 'ph:users-four-bold',
        description: 'Kelola klub makin pro dan rapi.',
        longDescription: 'Bikin klub kamu makin solid dengan manajemen data atlet yang rapi. Pantau kehadiran latihan, rekap skor internal klub, sampai pengingat iuran bulanan angggota, semuanya bisa dikelola lewat dashboard admin khusus klub.',
        image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?auto=format&fit=crop&q=80&w=1200'
    },
    {
        title: 'Integrasi Membership',
        icon: 'ph:identification-card-bold',
        description: 'KTA digital buat akses nasional.',
        longDescription: 'Punya akses ke seluruh ekosistem panahan dengan satu ID. Membership Archeryhub bukan cuma buat keren-kerenan, tapi jadi syarat resmi buat ikut turnamen berlisensi nasional dan bukti kamu bagian dari komunitas atlet pro.',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80&w=1200'
    },
    {
        title: 'Analitik Performa Atlet',
        icon: 'ph:trend-up-bold',
        description: 'Lihat progres kamu makin tajam.',
        longDescription: 'Lihat data di balik performa kamu. Sistem kita nangkep statistik skor kamu dari setiap event dan latihan, terus nampilin grafik progres yang gampang dibaca. Bantu kamu dan pelatih nentuin apa yang perlu ditingkatkan buat ke depannya.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200'
    }
]


const latestNews = ref([])

const fetchLatestNews = async () => {
    try {
        const response = await get('/news', { query: { limit: '3' } })
        const newsData = response?.data || []
        latestNews.value = newsData.slice(0, 3).map(article => ({
            slug: article.slug,
            title: article.title,
            date: article.published_at ? new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            category: article.category || 'Berita',
            image: article.image_url,
            excerpt: article.excerpt || ''
        }))
    } catch (error) {
        console.error('Failed to fetch latest news:', error)
        latestNews.value = []
    }
}
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}

.border-border-subtle {
    border-color: #e5e7eb;
}

/* Custom Scrollbar */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
}
</style>

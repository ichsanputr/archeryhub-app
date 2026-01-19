<template>
    <div class="min-h-screen bg-background-light font-body text-navy overflow-x-hidden">
        <!-- Navigation -->
        <nav class="fixed top-0 z-50 w-full transition-all duration-500" :class="[
            isScrolled
                ? 'bg-white/95 backdrop-blur-md border-b border-border-subtle py-2 shadow-lg'
                : 'bg-transparent border-transparent py-4'
        ]">
            <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-14">
                    <div class="flex items-center gap-3 group cursor-pointer" @click="navigateTo('/')">
                        <div class="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 overflow-hidden"
                            :class="isScrolled ? 'bg-navy' : 'bg-primary'">
                            <img src="/logo.png" alt="Logo" class="w-7 h-7 object-contain" />
                        </div>
                        <span class="text-xl font-bold tracking-tight font-display transition-colors duration-300"
                            :class="isScrolled ? 'text-navy' : 'text-white'">Archeryhub<span
                                class="text-logo-id">.id</span></span>
                    </div>
                    <div class="hidden md:flex items-center gap-8">
                        <NuxtLink to="/" class="text-sm font-medium transition-all duration-300 hover:text-primary"
                            :class="isScrolled ? 'text-navy' : 'text-white/80'">Beranda</NuxtLink>
                        <NuxtLink to="/tournaments"
                            class="text-sm font-medium transition-all duration-300 hover:text-primary"
                            :class="isScrolled ? 'text-navy' : 'text-white/80'">Turnamen</NuxtLink>
                        <NuxtLink to="#" class="text-sm font-medium transition-all duration-300 hover:text-primary"
                            :class="isScrolled ? 'text-navy' : 'text-white/80'">Skor</NuxtLink>
                        <NuxtLink to="#" class="text-sm font-medium transition-all duration-300 hover:text-primary"
                            :class="isScrolled ? 'text-navy' : 'text-white/80'">Klub</NuxtLink>
                        <NuxtLink to="/about" class="text-sm font-medium transition-all duration-300 hover:text-primary"
                            :class="isScrolled ? 'text-navy' : 'text-white/80'">Tentang</NuxtLink>
                    </div>
                    <div class="hidden md:flex">
                        <NuxtLink v-if="isLoggedIn" to="/dashboard"
                            class="bg-primary hover:bg-primary-hover text-navy text-sm font-bold px-6 py-2.5 rounded-lg transition-colors duration-200 flex items-center gap-2">
                            <span class="material-symbols-outlined text-lg">dashboard</span>
                            Dashboard
                        </NuxtLink>
                        <NuxtLink v-else to="/auth/login"
                            class="bg-primary hover:bg-primary-hover text-navy text-sm font-bold px-6 py-2.5 rounded-lg transition-colors duration-200">
                            Masuk / Daftar
                        </NuxtLink>
                    </div>
                    <div class="flex md:hidden">
                        <button class="transition-colors duration-300" :class="isScrolled ? 'text-navy' : 'text-white'"
                            @click="mobileMenuOpen = !mobileMenuOpen">
                            <span class="material-symbols-outlined">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div v-if="mobileMenuOpen" class="md:hidden bg-white border-b border-border-subtle p-4 space-y-4">
                <NuxtLink to="/" class="block text-navy text-sm font-medium">Beranda</NuxtLink>
                <NuxtLink to="/tournaments" class="block text-navy text-sm font-medium">Turnamen</NuxtLink>
                <NuxtLink to="#" class="block text-navy text-sm font-medium">Skor</NuxtLink>
                <NuxtLink to="#" class="block text-navy text-sm font-medium">Klub</NuxtLink>
                <NuxtLink to="/about" class="block text-navy text-sm font-medium">Tentang</NuxtLink>
                <NuxtLink v-if="isLoggedIn" to="/dashboard"
                    class="block bg-primary text-navy text-center font-bold py-2 rounded-lg">
                    Dashboard</NuxtLink>
                <NuxtLink v-else to="/auth/login"
                    class="block bg-primary text-navy text-center font-bold py-2 rounded-lg">
                    Masuk / Daftar</NuxtLink>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="relative w-full h-screen overflow-hidden">
            <div class="absolute inset-0 w-full h-full">
                <img alt="Professional archer aiming at target" class="w-full h-full object-cover object-center"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy5qIYUnhOAA9fRw-ezPUypzWUtCQTHv6EpNe6Q0bAAz6AFkDLOqgltBvPdIyyRsW4WqNcDFxXZlfgwFHWevvHH2yphLfwWEOEHT3GyFbvXsenr1qoxDPsSf-bmVfNqwG9_5cJoVMhgvCJ2FfEt6bQgicn5WlBrsP8axm39cBTN9E6cF7MQ9vKO5p0acgAZ1z3IYSXi-yQILL1HoOdT6ZobZEyg4qolUIumeiK6bVGuATW7dwLfqmaRIFiXL-l1PEPGa_sRD5Lc9E" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                </div>
            </div>
            <div class="relative z-10 w-full h-full flex items-center">
                <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div class="max-w-2xl">
                        <div ref="heroBadge"
                            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 w-fit mb-6 border border-white/10 backdrop-blur-md opacity-0 translate-y-4">
                            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span class="text-white/90 text-xs font-medium tracking-wide uppercase">Platform No.1 di
                                Indonesia</span>
                        </div>
                        <h1 ref="heroTitle"
                            class="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight drop-shadow-lg font-display opacity-0 translate-y-8">
                            Modernisasi Tata <span
                                class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">Kelola
                                Panahan</span> Indonesia
                        </h1>
                        <p ref="heroText"
                            class="text-white/80 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-xl drop-shadow-md opacity-0 translate-y-8">
                            Platform infrastruktur digital terintegrasi untuk manajemen klub, skor real-time, dan
                            turnamen panahan profesional yang lebih efisien.
                        </p>
                        <div ref="heroButtons" class="flex flex-col sm:flex-row gap-4 opacity-0 translate-y-8">
                            <NuxtLink to="/auth/login"
                                class="bg-primary hover:bg-primary-hover text-navy text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(183,251,35,0.39)] hover:shadow-[0_6px_20px_rgba(183,251,35,0.23)] hover:-translate-y-0.5 text-center">
                                Mulai Sekarang
                            </NuxtLink>
                            <button
                                class="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors backdrop-blur-md">
                                Pelajari Fitur
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Main Content Section: Tournaments & CTA -->
        <section class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 -mt-12 relative z-20">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <!-- Column 1: Upcoming Tournaments -->
                <div class="md:col-span-2 lg:col-span-2">
                    <div class="bg-white rounded-3xl shadow-sm border border-border-subtle/50 p-6 md:p-8 h-full">
                        <div class="flex items-center justify-between mb-8">
                            <div>
                                <h2 class="text-navy text-2xl font-bold tracking-tight font-display">Turnamen Mendatang
                                </h2>
                                <p class="text-text-sub text-sm mt-1">Daftar kompetisi resmi terdekat yang dibuka untuk
                                    pendaftaran.</p>
                            </div>
                            <NuxtLink to="/tournaments"
                                class="hidden sm:flex items-center gap-1 text-navy text-sm font-semibold hover:text-primary-hover transition-colors group">
                                Lihat Semua
                                <span
                                    class="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </NuxtLink>
                        </div>
                        <div
                            class="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                            <div v-for="event in upcomingEvents" :key="event.name"
                                class="group bg-white rounded-2xl border border-border-subtle p-5 hover:border-primary/50 hover:shadow-card transition-all duration-300">
                                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div class="flex items-start gap-5">
                                        <div
                                            class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-navy text-white shadow-sm">
                                            <span class="text-xs font-medium uppercase tracking-wider text-primary">{{
                                                event.month }}</span>
                                            <span class="text-2xl font-bold leading-none">{{ event.day }}</span>
                                        </div>
                                        <div class="flex flex-col">
                                            <div class="flex items-center gap-2 mb-1">
                                                <span v-for="tag in event.tags" :key="tag.label" :class="tag.class"
                                                    class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                                                    {{ tag.label }}
                                                </span>
                                            </div>
                                            <h3
                                                class="text-navy text-lg font-bold group-hover:text-primary-hover transition-colors font-display">
                                                {{ event.name }}</h3>
                                            <div class="flex items-center gap-4 mt-1 text-sm text-text-sub">
                                                <div class="flex items-center gap-1">
                                                    <span
                                                        class="material-symbols-outlined text-base text-primary">location_on</span>
                                                    {{ event.location }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex-shrink-0 sm:self-center">
                                        <button
                                            class="w-full sm:w-auto bg-primary text-navy text-sm font-bold py-2.5 px-6 rounded-lg transition-colors border border-primary/20 shadow-sm hover:shadow-md">
                                            Daftar Sekarang
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Column 2: CTA Cards (Stacked) -->
                <div class="md:col-span-2 lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                    <div
                        class="relative overflow-hidden group bg-navy rounded-3xl p-8 flex flex-col justify-between shadow-sm transition-all duration-300 flex-1 min-h-[280px]">
                        <div
                            class="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-50 z-0">
                        </div>
                        <div class="relative z-10">
                            <div
                                class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-navy mb-5">
                                <span class="material-symbols-outlined text-xl">person_add</span>
                            </div>
                            <h3 class="text-2xl font-bold text-white mb-2 font-display">Jadi Atlet</h3>
                            <p class="text-white/60 text-sm mb-6">Profil prestasi dan ikuti turnamen resmi se-Indonesia.
                            </p>
                        </div>
                        <div class="relative z-10">
                            <NuxtLink to="/auth/register?type=archer"
                                class="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-navy text-sm font-bold px-6 py-3 rounded-xl transition-all">
                                Daftar Atlet
                                <span class="material-symbols-outlined text-lg">arrow_forward</span>
                            </NuxtLink>
                        </div>
                    </div>

                    <div
                        class="relative overflow-hidden group bg-white border border-border-subtle rounded-3xl p-8 flex flex-col justify-between shadow-sm transition-all duration-300 flex-1 min-h-[280px]">
                        <div class="relative z-10">
                            <div class="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-white mb-5">
                                <span class="material-symbols-outlined text-xl">domain_add</span>
                            </div>
                            <h3 class="text-2xl font-bold text-navy mb-2 font-display">Organisasi</h3>
                            <p class="text-text-sub text-sm mb-6">Kelola klub atau federasi dengan sistem modern.</p>
                        </div>
                        <div class="relative z-10">
                            <NuxtLink to="/auth/register?type=organization"
                                class="w-full inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white text-sm font-bold px-6 py-3 rounded-xl transition-all">
                                Gabung Mitra
                                <span class="material-symbols-outlined text-lg">arrow_forward</span>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Digital Governance Ecosystem -->
        <section class="bg-white py-16 md:py-24 border-b border-gray-100">
            <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16 max-w-2xl mx-auto">
                    <h2 class="text-navy text-3xl font-bold mb-4 font-display">Ekosistem Tata Kelola Digital</h2>
                    <p class="text-text-sub">Fitur terintegrasi dirancang untuk memprofesionalkan manajemen panahan dari
                        tingkat klub hingga federasi nasional.</p>
                </div>
                <div class="grid md:grid-cols-3 gap-8 lg:gap-12">
                    <div
                        class="group p-8 rounded-2xl bg-gray-50 border border-transparent hover:border-primary/20 hover:shadow-xl transition-all duration-300">
                        <div
                            class="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span class="material-symbols-outlined text-primary text-4xl">scoreboard</span>
                        </div>
                        <h3 class="text-xl font-bold text-navy mb-3">Scoring Real-time</h3>
                        <p class="text-text-sub leading-relaxed">
                            Sistem penilaian digital dengan sinkronisasi cloud instan. Hilangkan papan skor kertas dan
                            sediakan hasil langsung untuk penonton di seluruh dunia.
                        </p>
                    </div>
                    <div
                        class="group p-8 rounded-2xl bg-gray-50 border border-transparent hover:border-primary/20 hover:shadow-xl transition-all duration-300">
                        <div
                            class="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span class="material-symbols-outlined text-primary text-4xl">domain</span>
                        </div>
                        <h3 class="text-xl font-bold text-navy mb-3">Manajemen Klub</h3>
                        <p class="text-text-sub leading-relaxed">
                            Alat administrasi bagi klub untuk mengelola anggota, memproses pendaftaran, dan memantau
                            kemajuan perkembangan atlet dari waktu ke waktu.
                        </p>
                    </div>
                    <div
                        class="group p-8 rounded-2xl bg-gray-50 border border-transparent hover:border-primary/20 hover:shadow-xl transition-all duration-300">
                        <div
                            class="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span class="material-symbols-outlined text-primary text-4xl">leaderboard</span>
                        </div>
                        <h3 class="text-xl font-bold text-navy mb-3">Ranking Nasional</h3>
                        <p class="text-text-sub leading-relaxed">
                            Kalkulasi poin otomatis dan pembaruan peringkat berdasarkan hasil turnamen, memastikan
                            transparansi dalam seleksi nasional.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Live Events Section -->
        <section class="bg-gray-50 py-16 md:py-20 overflow-hidden">
            <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-2xl font-bold text-navy flex items-center gap-3 font-display">
                        <span class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                        Event Live Saat Ini
                    </h2>
                    <NuxtLink to="/tournaments"
                        class="text-navy hover:text-primary font-bold text-sm flex items-center gap-1 group">
                        Lihat Jadwal <span
                            class="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </NuxtLink>
                </div>
                <div class="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 no-scrollbar snap-x">
                    <div v-for="live in liveEvents" :key="live.name"
                        class="min-w-[300px] md:min-w-[380px] snap-center group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col">
                        <div class="relative h-48 overflow-hidden">
                            <div class="absolute top-3 left-3 z-10 flex gap-2">
                                <span
                                    class="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1 animate-pulse">
                                    <span class="material-symbols-outlined text-[12px]">fiber_manual_record</span> Live
                                </span>
                                <span
                                    class="bg-white/90 backdrop-blur-sm text-navy text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                                    {{ live.type }}
                                </span>
                            </div>
                            <img :src="live.image" :alt="live.name"
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
                                <button
                                    class="w-full h-10 rounded-lg border-2 border-navy text-navy hover:bg-navy hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
                                    <span class="material-symbols-outlined text-lg">scoreboard</span>
                                    Skor Langsung
                                </button>
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
                        <h2 class="text-2xl font-bold text-navy mb-2 font-display">Klub Unggulan</h2>
                        <p class="text-text-sub text-sm hidden sm:block">Akademi dan klub panahan terbaik di sekitar
                            Anda</p>
                    </div>
                    <NuxtLink to="/clubs"
                        class="text-navy hover:text-primary-hover font-bold text-sm flex items-center gap-2 group bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        Lihat Semua Klub <span
                            class="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </NuxtLink>
                </div>
                <div class="flex flex-wrap items-center gap-3 mb-8 overflow-x-auto no-scrollbar pb-2">
                    <button v-for="region in regions" :key="region"
                        class="px-5 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap"
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
                            class="w-20 h-20 rounded-2xl bg-navy/5 text-navy flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <span class="material-symbols-outlined text-4xl">{{ club.icon }}</span>
                        </div>
                        <h3 class="text-lg font-bold text-navy mb-1 font-display">{{ club.name }}</h3>
                        <div class="flex items-center gap-1 text-text-sub text-sm mb-6">
                            <span class="material-symbols-outlined text-base">location_on</span>
                            <span>{{ club.location }}</span>
                        </div>
                        <button
                            class="w-full mt-auto py-2.5 px-4 bg-primary hover:bg-primary-hover text-navy font-bold text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2">
                            Lihat Profil
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Latest News Section -->
        <section class="bg-white py-16 md:py-20 border-t border-gray-100">
            <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-2xl font-bold text-navy font-display">Berita Terbaru</h2>
                    <a class="text-text-sub hover:text-navy font-bold text-sm" href="#">Lihat Semua Berita</a>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <NuxtLink v-for="news in latestNews" :key="news.title" :to="`/berita/${news.slug}`"
                        class="flex flex-col group cursor-pointer">
                        <div class="relative h-60 rounded-2xl overflow-hidden mb-5">
                            <img :src="news.image" :alt="news.title"
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
                                class="text-xl font-bold text-navy mb-3 group-hover:text-primary line-clamp-2 font-display">
                                {{ news.title }}
                            </h3>
                            <p class="text-text-sub mb-4 line-clamp-2 text-sm">
                                {{ news.excerpt }}
                            </p>
                            <span class="text-navy hover:text-primary font-bold text-sm flex items-center gap-1">
                                Baca Selengkapnya <span class="material-symbols-outlined text-sm">arrow_right_alt</span>
                            </span>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <LayoutAppFooter />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAuth } from '~/composables/useAuth'

gsap.registerPlugin(ScrollTrigger)

const { isLoggedIn, user } = useAuth()

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const activeRegion = ref('Semua Wilayah')

const regions = ['Semua Wilayah', 'DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'DI Yogyakarta', 'Banten', 'Bali']

const clubs = [
    { name: 'Jakarta Elite Archery', location: 'GBK Senayan, Jakarta', icon: 'target', verified: true, region: 'DKI Jakarta' },
    { name: 'Pasopati Archery', location: 'Sleman, Yogyakarta', icon: 'legend_toggle', verified: true, region: 'DI Yogyakarta' },
    { name: 'Borneo Eagle Club', location: 'Balikpapan, Kaltim', icon: 'flight', verified: false, region: 'Kalimantan' },
    { name: 'Bali Zen Archery', location: 'Ubud, Bali', icon: 'spa', verified: false, region: 'Bali' }
]

const filteredClubs = computed(() => {
    if (activeRegion.value === 'Semua Wilayah') return clubs
    return clubs.filter(club => club.region === activeRegion.value)
})

// Refs for GSAP animations
const heroBadge = ref(null)
const heroTitle = ref(null)
const heroText = ref(null)
const heroButtons = ref(null)

const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)

    // GSAP Hero Animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } })

    tl.to(heroBadge.value, { opacity: 1, y: 0, duration: 0.8 }, 0.2)
        .to(heroTitle.value, { opacity: 1, y: 0, duration: 1 }, 0.4)
        .to(heroText.value, { opacity: 1, y: 0, duration: 1 }, 0.6)
        .to(heroButtons.value, { opacity: 1, y: 0, duration: 1 }, 0.8)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

definePageMeta({
    layout: 'blank'
})

useHead({
    title: 'Archeryhub.id - Modernisasi Tata Kelola Panahan Indonesia',
    meta: [
        {
            name: 'description', content: 'Platform infrastruktur digital terintegrasi untuk manajemen klub, skor real-time, dan turnamen panahan profesional.'
        }
    ]
})

const upcomingEvents = [
    {
        name: 'Jakarta Open 2024',
        month: 'Nov',
        day: '14',
        location: 'GBK Arena, Senayan',
        categories: 'Recurve & Compound',
        tags: [
            { label: 'Open', class: 'bg-blue-100 text-blue-700' },
            { label: 'Nasional', class: 'bg-orange-100 text-orange-700' }
        ]
    },
    {
        name: 'Indonesian Open Championship',
        month: 'Nov',
        day: '20',
        location: 'GBK Archery Field, Jakarta',
        categories: 'Semua Divisi',
        tags: [
            { label: 'Grade A', class: 'bg-red-100 text-red-700' },
            { label: 'Internasional', class: 'bg-blue-100 text-blue-700' }
        ]
    },
    {
        name: 'Surabaya Archery Cup',
        month: 'Dec',
        day: '20',
        location: 'Lapangan KONI Jatim',
        categories: 'Standard Bow U-15',
        tags: [
            { label: 'Junior', class: 'bg-green-100 text-green-700' }
        ]
    },
    {
        name: 'Bali International Open',
        month: 'Dec',
        day: '05',
        location: 'Denpasar Archery Center',
        categories: 'Recurve & Compound',
        tags: [
            { label: 'Open', class: 'bg-blue-100 text-blue-700' },
            { label: 'Internasional', class: 'bg-purple-100 text-purple-700' }
        ]
    },
    {
        name: 'Yogyakarta Indoor Series',
        month: 'Jan',
        day: '12',
        location: 'GOR Klebengan',
        categories: 'Barebow & Recurve',
        tags: [
            { label: 'Series 1', class: 'bg-purple-100 text-purple-700' }
        ]
    },
    {
        name: 'Medan Archery Open',
        month: 'Feb',
        day: '01',
        location: 'USU Sports Center',
        categories: 'Recurve & Compound',
        tags: [
            { label: 'Regional', class: 'bg-orange-100 text-orange-700' }
        ]
    },
    {
        name: 'Borneo Archery Festival',
        month: 'Jan',
        day: '10',
        location: 'Balikpapan Sports Center',
        categories: 'Semua Divisi',
        tags: [
            { label: 'Klub', class: 'bg-teal-100 text-teal-700' }
        ]
    },
    {
        name: 'Makassar Championship',
        month: 'Feb',
        day: '15',
        location: 'Karebosi Field',
        categories: 'Hanya Recurve',
        tags: [
            { label: 'Provinsi', class: 'bg-yellow-100 text-yellow-700' }
        ]
    }
]

const liveEvents = [
    {
        name: 'Surabaya Archery Cup 2024',
        type: 'Seri Nasional',
        location: 'KONI Jatim Field, Surabaya',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAJXWL-Z7f7fP24_IyBjI_e-q_jYcMbzRtaKiOpKP8TxgqwSxRrCqNcE-GXJXbiCEv6rlwlNJzTmbbgAdQFWHH4Jk_Fw-aslTiT3Qezy8bbmGRG0WoRA-yD8tykZuxYObytzJ6Yf7yNL8poFU6vWlyEuFjbHcIzwfoLAMru-bfdw4GXezmv71SwRPYw_-Ct6ZP3f6AqglpvBIhCSrp9g13uTQpj69_-hzZqp1wSqJJ-9PdZqp0CYWgFWsajdRos9QmU7eeyuFhFPH0'
    },
    {
        name: 'Jakarta Indoor Open',
        type: 'Regional',
        location: 'Senayan Hall B, Jakarta',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBmKeu4qLnuI8uJ8itXirIGY311f6c_CfhqFD3qtMv-M4oTNDiSeGeylyU0qI_7lQHeMywtfdDw175-dWrdxwZwWSnnEMmkBca4ScW0dEbBQ_wZYVWuCaOPI-A204QdKHKXQxHsutHbZP8c9uPaZpfK8lzqziHTAW_dqnlmi99AtLhIGmxfUZ-irvcNm1YUswSsH9HGhvq4Hr6jq7rsveM4HwMmhNVDABEGcgh0sYQHoHy9t1IzkTX2LexV72X240IEyZL2_InQGZ8'
    },
    {
        name: 'Borneo Youth Qualifier',
        type: 'Seri Klub',
        location: 'Balikpapan Sports Center',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDQStrrmLQN-DtqrTO5KWNF3EvwOXSw-raemHMh-lxMUVAtHiqxHNMqzQoV2l1ReELlRe_dVIAkp1P8Bc8ekRqbhOn-axS6izTQXKw3d70pq-CpZHWUZoS58mGL70U_Bk96ViNRcaOaGr5wIkPrtg8w46mzrAtHgWRH6VKAUalmkrFJ8qjDltkmd-nHJs4aUfrBBphZSnivwOkhoIjzG8dpjeCtp_UOZTOnovXJP7IAWJEeWqw7Uh7-mlLVkorgyeOsSRun6CmO_8I'
    }
]

const latestNews = [
    {
        slug: 'hasil-seleksi-pelatnas-2025',
        title: 'Hasil Seleksi Pelatnas Archery 2025 Resmi Diumumkan',
        date: 'Oct 28, 2024',
        category: 'Pelatnas',
        image: '/berita1.JPG',
        excerpt: 'Persatuan Panahan Indonesia secara resmi merilis daftar atlet yang terpilih untuk mengikuti pemusatan latihan nasional tahun depan.'
    },
    {
        slug: 'indonesia-juara-umum-sea-2024',
        title: 'Indonesia Juara Umum di Kejuaraan Asia Tenggara 2024',
        date: 'Oct 25, 2024',
        category: 'Prestasi',
        image: '/berita2.JPG',
        excerpt: 'Penampilan bersejarah kontingen nasional berhasil mengamankan 5 medali emas, mendominasi divisi Recurve dan Compound.'
    },
    {
        slug: 'regulasi-peralatan-baru-indoor',
        title: 'Regulasi Peralatan Baru untuk Musim Indoor Mendatang',
        date: 'Oct 20, 2024',
        category: 'Regulasi',
        image: '/berita3.JPG',
        excerpt: 'World Archery telah memperbarui aturan mengenai diameter anak panah dan berat stabilizer untuk kompetisi dalam ruangan.'
    }
]
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}

.border-border-subtle {
    border-color: #e5e7eb;
}
</style>

<template>
    <div class="flex flex-col gap-6">
        <!-- Breadcrumb & Header -->
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-500 mb-2 font-medium">
                    <NuxtLink to="/dashboard/tournaments"
                        class="hover:text-primary-hover transition-colors flex items-center gap-1">
                        <span class="material-symbols-outlined text-[16px]">arrow_back</span>
                        Kembali ke Events
                    </NuxtLink>
                    <span class="text-gray-300">/</span>
                    <span class="text-navy font-semibold">Detail View</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">2024 State Indoor Championship</h1>
                <div class="flex items-center gap-3 mt-2">
                    <span
                        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Live
                    </span>
                    <span class="text-gray-500 text-sm font-medium border-l border-gray-300 pl-3">ID:
                        #EV-2024-082</span>
                </div>
            </div>
            <div class="flex gap-3 mt-2 md:mt-0">
                <button
                    class="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-navy hover:bg-gray-50 font-bold text-sm transition-all shadow-sm">
                    <span class="material-symbols-outlined text-[20px]">share</span>
                    Bagikan
                </button>
                <button
                    class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-navy hover:bg-primary-hover font-bold text-sm transition-all shadow-md group">
                    <span
                        class="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">edit</span>
                    Edit Event
                </button>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
                class="bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center gap-5 hover:shadow-[0_10px_15px_rgba(0,0,0,0.05)] transition-shadow">
                <div class="h-14 w-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-3xl">groups</span>
                </div>
                <div>
                    <p class="text-sm text-gray-500 font-medium mb-1">Total Atlet</p>
                    <div class="flex items-baseline gap-2">
                        <h3 class="text-2xl font-bold text-navy">124</h3>
                        <span class="text-xs font-semibold px-1.5 py-0.5 rounded bg-green-50 text-green-600">+12%</span>
                    </div>
                </div>
            </div>
            <div
                class="bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center gap-5 hover:shadow-[0_10px_15px_rgba(0,0,0,0.05)] transition-shadow">
                <div
                    class="h-14 w-14 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-3xl">ads_click</span>
                </div>
                <div>
                    <p class="text-sm text-gray-500 font-medium mb-1">Status Target</p>
                    <div class="flex items-baseline gap-2">
                        <h3 class="text-2xl font-bold text-navy">32</h3>
                        <span class="text-sm text-gray-400 font-normal">Lane Aktif</span>
                    </div>
                </div>
            </div>
            <div
                class="bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center gap-5 hover:shadow-[0_10px_15px_rgba(0,0,0,0.05)] transition-shadow">
                <div class="h-14 w-14 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-3xl">payments</span>
                </div>
                <div>
                    <p class="text-sm text-gray-500 font-medium mb-1">Pendapatan</p>
                    <div class="flex items-baseline gap-2">
                        <h3 class="text-2xl font-bold text-navy">Rp 45jt</h3>
                        <span class="text-xs text-gray-400 font-medium">IDR</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Quick Information Card -->
            <div
                class="lg:col-span-1 bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col h-full">
                <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                    <h3 class="font-bold text-navy text-lg">Informasi Singkat</h3>
                    <button
                        class="text-gray-400 hover:text-primary-hover hover:bg-gray-50 p-1.5 rounded-md transition-colors">
                        <span class="material-symbols-outlined text-[20px]">edit_square</span>
                    </button>
                </div>
                <div class="p-6 flex flex-col gap-6 flex-1">
                    <div>
                        <label
                            class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Deskripsi</label>
                        <p class="text-sm text-gray-600 leading-relaxed">
                            Kejuaraan indoor tahunan tingkat provinsi untuk divisi Recurve, Compound, dan Barebow. Event
                            ini merupakan kualifikasi utama untuk tingkat Nasional.
                        </p>
                    </div>
                    <div class="space-y-4">
                        <div class="flex gap-4">
                            <div
                                class="shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                <span class="material-symbols-outlined text-[18px]">calendar_month</span>
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-navy">24 - 26 Okt 2024</p>
                                <p class="text-xs text-gray-500 mt-0.5">08:00 - 18:00 WIB</p>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <div
                                class="shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                <span class="material-symbols-outlined text-[18px]">location_on</span>
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-navy">GBK Archery Field</p>
                                <p class="text-xs text-gray-500 mt-0.5">Jl. Pintu Satu Senayan, Jakarta 10270</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label
                            class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Kategori</label>
                        <div class="flex flex-wrap gap-2">
                            <span
                                class="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold border border-gray-200">Recurve</span>
                            <span
                                class="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold border border-gray-200">Compound</span>
                            <span
                                class="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold border border-gray-200">Barebow</span>
                            <span
                                class="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold border border-gray-200">Youth</span>
                        </div>
                    </div>
                </div>
                <div class="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100 text-center">
                    <NuxtLink :to="`/tournaments/${route.params.id}`"
                        class="text-sm text-gray-500 hover:text-primary-hover font-bold hover:underline transition-colors">
                        Lihat Halaman Publik</NuxtLink>
                </div>
            </div>

            <!-- Live Status Card -->
            <div class="lg:col-span-2 flex flex-col gap-6">
                <div
                    class="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col h-full">
                    <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                        <div class="flex items-center gap-3">
                            <div class="relative flex h-3 w-3">
                                <span
                                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </div>
                            <h3 class="font-bold text-navy text-lg">Status Live</h3>
                        </div>
                        <div class="flex gap-2">
                            <button
                                class="text-xs font-bold bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-navy transition-colors shadow-sm">
                                Pause
                            </button>
                            <button
                                class="text-xs font-bold bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                                Stop Session
                            </button>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col">
                        <!-- Session Info -->
                        <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
                            <div>
                                <div class="text-xs font-bold text-primary-hover uppercase tracking-wide mb-1">Sesi Saat
                                    Ini</div>
                                <h4 class="font-bold text-2xl text-navy">Ronde Kualifikasi 1</h4>
                                <p class="text-sm text-gray-500 mt-1">Grup A • Jarak 60m</p>
                            </div>
                            <div class="text-left sm:text-right bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                                <div class="text-xs text-gray-500 uppercase font-semibold">Progress</div>
                                <div class="flex items-baseline gap-1 sm:justify-end">
                                    <span class="text-3xl font-bold text-navy">End 4</span>
                                    <span class="text-gray-400 text-lg font-medium">/ 12</span>
                                </div>
                            </div>
                        </div>

                        <!-- Progress Bar -->
                        <div class="w-full bg-gray-100 rounded-full h-4 mb-8 overflow-hidden shadow-inner">
                            <div class="bg-primary h-4 rounded-full flex items-center justify-end pr-2"
                                style="width: 33%">
                                <span class="text-[10px] font-bold text-navy opacity-50">33%</span>
                            </div>
                        </div>

                        <!-- Mini Stats -->
                        <div class="grid grid-cols-3 gap-4 mb-8">
                            <div
                                class="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center hover:bg-gray-100 transition-colors cursor-default">
                                <div class="text-xs text-gray-500 uppercase font-bold tracking-wide">Sisa Waktu</div>
                                <div class="text-2xl font-mono font-bold text-navy mt-1">01:45</div>
                            </div>
                            <div
                                class="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center hover:bg-gray-100 transition-colors cursor-default">
                                <div class="text-xs text-gray-500 uppercase font-bold tracking-wide">Anak Panah</div>
                                <div class="text-2xl font-bold text-navy mt-1">452</div>
                            </div>
                            <div
                                class="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center hover:bg-gray-100 transition-colors cursor-default">
                                <div class="text-xs text-gray-500 uppercase font-bold tracking-wide">Rata-rata</div>
                                <div class="text-2xl font-bold text-navy mt-1">8.4</div>
                            </div>
                        </div>

                        <!-- Lane Status Grid -->
                        <div class="mt-auto">
                            <div class="flex justify-between items-center mb-3">
                                <h5 class="text-sm font-bold text-navy">Status Lane Overview</h5>
                                <div class="flex gap-3 text-xs">
                                    <span class="flex items-center gap-1.5 text-gray-500"><span
                                            class="w-2 h-2 rounded-full bg-green-500"></span> Aktif</span>
                                    <span class="flex items-center gap-1.5 text-gray-500"><span
                                            class="w-2 h-2 rounded-full bg-yellow-500"></span> Masalah</span>
                                    <span class="flex items-center gap-1.5 text-gray-500"><span
                                            class="w-2 h-2 rounded-full bg-gray-300"></span> Kosong</span>
                                </div>
                            </div>
                            <div class="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2">
                                <div
                                    class="aspect-square bg-green-100 border border-green-200 rounded-md flex items-center justify-center text-[10px] font-bold text-green-800 transition-all hover:scale-105 cursor-pointer">
                                    1</div>
                                <div
                                    class="aspect-square bg-green-100 border border-green-200 rounded-md flex items-center justify-center text-[10px] font-bold text-green-800 transition-all hover:scale-105 cursor-pointer">
                                    2</div>
                                <div
                                    class="aspect-square bg-green-100 border border-green-200 rounded-md flex items-center justify-center text-[10px] font-bold text-green-800 transition-all hover:scale-105 cursor-pointer">
                                    3</div>
                                <div
                                    class="aspect-square bg-yellow-100 border border-yellow-200 rounded-md flex items-center justify-center text-[10px] font-bold text-yellow-800 transition-all hover:scale-105 cursor-pointer shadow-sm shadow-yellow-100">
                                    4</div>
                                <div
                                    class="aspect-square bg-green-100 border border-green-200 rounded-md flex items-center justify-center text-[10px] font-bold text-green-800 transition-all hover:scale-105 cursor-pointer">
                                    5</div>
                                <div
                                    class="aspect-square bg-green-100 border border-green-200 rounded-md flex items-center justify-center text-[10px] font-bold text-green-800 transition-all hover:scale-105 cursor-pointer">
                                    6</div>
                                <div
                                    class="aspect-square bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center text-[10px] font-bold text-gray-400">
                                    7</div>
                                <div
                                    class="aspect-square bg-green-100 border border-green-200 rounded-md flex items-center justify-center text-[10px] font-bold text-green-800 transition-all hover:scale-105 cursor-pointer">
                                    8</div>
                                <div
                                    class="aspect-square bg-green-100 border border-green-200 rounded-md flex items-center justify-center text-[10px] font-bold text-green-800 transition-all hover:scale-105 cursor-pointer">
                                    9</div>
                                <div
                                    class="aspect-square bg-green-100 border border-green-200 rounded-md flex items-center justify-center text-[10px] font-bold text-green-800 transition-all hover:scale-105 cursor-pointer">
                                    10</div>
                                <div
                                    class="aspect-square bg-green-100 border border-green-200 rounded-md flex items-center justify-center text-[10px] font-bold text-green-800 transition-all hover:scale-105 cursor-pointer">
                                    11</div>
                                <div
                                    class="aspect-square bg-green-100 border border-green-200 rounded-md flex items-center justify-center text-[10px] font-bold text-green-800 transition-all hover:scale-105 cursor-pointer">
                                    12</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
</script>

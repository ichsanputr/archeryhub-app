<template>
    <div class="space-y-8">
        <!-- Event Context Header -->
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
                <div
                    class="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    <NuxtLink to="/dashboard" class="hover:text-primary transition-colors flex items-center gap-1">
                        <span class="material-symbols-outlined text-[14px]">arrow_back</span>
                        Kembali ke Dashboard
                    </NuxtLink>
                    <span class="text-gray-200">/</span>
                    <span class="text-navy">Detail Kelola</span>
                </div>
                <h1 class="text-3xl font-black text-navy tracking-tight uppercase italic">2024 State Indoor Championship
                </h1>
                <div class="flex items-center gap-3 mt-2">
                    <span
                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-green-50 text-green-700 border border-green-200 uppercase tracking-widest">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Status: Live
                    </span>
                    <span class="text-gray-400 text-xs font-bold border-l border-gray-100 pl-3">ID: #EV-2024-082</span>
                </div>
            </div>
            <div class="flex gap-3">
                <button
                    class="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white text-navy font-black text-sm hover:bg-gray-50 transition-all shadow-sm">
                    <span class="material-symbols-outlined text-[20px]">share</span>
                    Bagikan
                </button>
                <button
                    class="flex items-center gap-2 px-6 py-3 rounded-xl bg-navy text-primary font-black text-sm hover:opacity-90 transition-all shadow-lg group">
                    <span
                        class="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">edit</span>
                    Edit Event
                </button>
            </div>
        </div>

        <!-- Quick Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="stat in quickStats" :key="stat.label"
                class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-all">
                <div :class="stat.bgClass" class="h-14 w-14 rounded-xl flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-3xl" :class="stat.iconColor">{{ stat.icon }}</span>
                </div>
                <div>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{{ stat.label }}</p>
                    <div class="flex items-baseline gap-2">
                        <h3 class="text-2xl font-black text-navy tabular-nums">{{ stat.value }}</h3>
                        <span v-if="stat.subtext"
                            class="text-[10px] font-black px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 uppercase tracking-tighter">{{
                            stat.subtext }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Detail Sections Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Information Panel -->
            <div class="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div class="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <h3 class="font-black text-navy text-lg uppercase tracking-tight">Informasi Cepat</h3>
                    <button class="text-gray-300 hover:text-primary transition-colors">
                        <span class="material-symbols-outlined text-[20px]">edit_square</span>
                    </button>
                </div>
                <div class="p-6 flex flex-col gap-8">
                    <div>
                        <label
                            class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Deskripsi</label>
                        <p class="text-sm text-text-sub font-medium leading-relaxed">
                            Kejuaraan indoor tingkat provinsi tahunan yang melombakan divisi Recurve, Compound, dan
                            Barebow. Acara ini merupakan kualifikasi utama untuk Kejuaraan Nasional.
                        </p>
                    </div>
                    <div class="space-y-5">
                        <div class="flex gap-4">
                            <div
                                class="shrink-0 w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                                <span class="material-symbols-outlined text-[18px]">calendar_month</span>
                            </div>
                            <div>
                                <p class="text-sm font-black text-navy">24 Okt - 26 Okt, 2024</p>
                                <p class="text-[10px] font-bold text-gray-400 uppercase mt-0.5">08:00 WIB - 18:00 WIB
                                </p>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <div
                                class="shrink-0 w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                                <span class="material-symbols-outlined text-[18px]">location_on</span>
                            </div>
                            <div>
                                <p class="text-sm font-black text-navy">Cobo Center Jakarta</p>
                                <p class="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Jl. Senayan No. 1,
                                    Jakarta Pusat</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Divisi
                            Lombanya</label>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="cat in ['Recurve', 'Compound', 'Barebow', 'Youth']" :key="cat"
                                class="px-3 py-1 rounded-full bg-gray-50 text-text-sub text-[10px] font-black border border-gray-100 uppercase tracking-widest">
                                {{ cat }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="mt-auto p-4 bg-gray-50/50 rounded-b-2xl border-t border-gray-50 text-center">
                    <a href="#"
                        class="text-[10px] font-black text-navy hover:text-primary transition-colors uppercase tracking-widest">Lihat
                        Halaman Publik →</a>
                </div>
            </div>

            <!-- Live Session Monitor -->
            <div
                class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div class="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-navy text-white">
                    <div class="flex items-center gap-3">
                        <div class="relative flex h-3 w-3">
                            <span
                                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </div>
                        <h3 class="font-black text-lg uppercase tracking-tight">Monitor Live Status</h3>
                    </div>
                    <div class="flex gap-2">
                        <button
                            class="text-[10px] font-black bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white transition-all uppercase tracking-widest border border-white/10">
                            Jeda Sesi
                        </button>
                        <button
                            class="text-[10px] font-black bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white transition-all uppercase tracking-widest shadow-lg shadow-red-500/20">
                            Hentikan Sesi
                        </button>
                    </div>
                </div>
                <div class="p-8 space-y-8 flex-grow">
                    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div>
                            <div class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Sesi Saat
                                Ini</div>
                            <h4 class="font-black text-4xl text-navy tracking-tight uppercase italic">Babak Kualifikasi
                                1</h4>
                            <p class="text-sm font-bold text-gray-400 mt-2">Grup A • Jarak 60 Meter</p>
                        </div>
                        <div class="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 text-right">
                            <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kemajuan
                                Sesi</div>
                            <div class="flex items-baseline gap-1 justify-end">
                                <span class="text-4xl font-black text-navy tabular-nums">End 4</span>
                                <span class="text-gray-300 text-xl font-black italic">/ 12</span>
                            </div>
                        </div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="relative pt-1">
                        <div class="flex mb-2 items-center justify-between">
                            <div class="text-[10px] font-black text-navy uppercase tracking-widest">33% Terlewati</div>
                            <div class="text-[10px] font-black text-primary uppercase tracking-widest tabular-nums">End
                                ke-4 berjalan</div>
                        </div>
                        <div
                            class="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-100 shadow-inner border border-gray-100">
                            <div style="width:33%"
                                class="shadow-inner flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500">
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-6">
                        <div v-for="metric in sessionMetrics" :key="metric.label"
                            class="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center hover:bg-gray-100 transition-all cursor-default group">
                            <div
                                class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">
                                {{ metric.label }}</div>
                            <div class="text-3xl font-black text-navy tabular-nums">{{ metric.value }}</div>
                        </div>
                    </div>

                    <!-- Lane Visualizer -->
                    <div class="pt-6 border-t border-gray-50">
                        <div class="flex justify-between items-center mb-4">
                            <h5 class="text-xs font-black text-navy uppercase tracking-widest">Status Lajur (Lane)</h5>
                            <div class="flex gap-4 text-[8px] font-black uppercase tracking-widest opacity-60">
                                <span class="flex items-center gap-1.5"><span
                                        class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Aktif</span>
                                <span class="flex items-center gap-1.5"><span
                                        class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Masalah</span>
                                <span class="flex items-center gap-1.5"><span
                                        class="w-1.5 h-1.5 rounded-full bg-gray-200"></span> Kosong</span>
                            </div>
                        </div>
                        <div class="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-3">
                            <div v-for="i in 12" :key="i"
                                class="aspect-square rounded-lg flex items-center justify-center text-xs font-black transition-all hover:scale-110 cursor-pointer border"
                                :class="getLaneClass(i)">
                                {{ i }}
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

const quickStats = [
    { label: 'Total Atlet', value: '124', icon: 'groups', iconColor: 'text-blue-600', bgClass: 'bg-blue-50', subtext: '+12%' },
    { label: 'Status Jalur', value: '32', icon: 'ads_click', iconColor: 'text-orange-600', bgClass: 'bg-orange-50', subtext: 'Lajur Aktif' },
    { label: 'Pendapatan', value: '45.2M', icon: 'payments', iconColor: 'text-green-600', bgClass: 'bg-green-50', subtext: 'IDR' },
]

const sessionMetrics = [
    { label: 'Sisa Waktu', value: '01:45' },
    { label: 'Anak Panah', value: '452' },
    { label: 'Skor Rata-rata', value: '8.4' },
]

const getLaneClass = (i) => {
    if (i === 4) return 'bg-yellow-50 border-yellow-200 text-yellow-700 shadow-sm shadow-yellow-100'
    if (i === 7) return 'bg-gray-50 border-gray-100 text-gray-300'
    return 'bg-primary/10 border-primary/20 text-navy hover:bg-primary'
}
</script>

<style scoped>
.text-navy {
    color: #0f172a;
}

.text-text-sub {
    color: #4b5563;
}

.bg-navy {
    background-color: #0f172a;
}
</style>

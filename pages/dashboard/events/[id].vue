<template>
    <div class="min-h-screen bg-background-light font-body text-navy antialiased flex flex-col">
        <!-- Hero Section -->
        <div class="bg-navy relative overflow-hidden">
            <div class="absolute inset-0 z-0">
                <div class="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/80 z-10"></div>
                <img alt="Tournament Hero" class="w-full h-full object-cover object-center opacity-50 mix-blend-overlay"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuByxS8LZ93pBQXI_V_Vu3nB0633lwPZGiFCM3UtI-xk79b_O83ASmlHYA36lOzcnmVsbgs4DEe9awj543MvzCN1yzOo1wZ3ViXLdiMRV7vAMdy66lvu-l5dpFAOgZ0uCMKJxsBRXPJL1QeX4_ZdX2ynTEZR-ZMilrncma7gKG2YK0vsj0KJZnw_lD0UZaXFKW2aVFD1SU-mzi_sAT2D-62TP0j5LF6KprFriv2sV9rdypqLSvfrZekYDy45XaK8F1vVh7e5nfrgK7o" />
            </div>
            <div class="relative z-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 pb-0">
                <nav class="flex items-center gap-2 text-xs text-white/40 mb-6 uppercase tracking-widest font-bold">
                    <NuxtLink to="/dashboard/tournaments" class="hover:text-white transition-colors">Tournaments
                    </NuxtLink>
                    <span class="material-symbols-outlined text-sm">chevron_right</span>
                    <span class="text-primary">Indonesian Open 2024</span>
                </nav>
                <div class="flex flex-col lg:flex-row items-start justify-between gap-8 mb-10">
                    <div class="max-w-3xl">
                        <div class="flex items-center gap-3 mb-4">
                            <span
                                class="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">National
                                Series</span>
                            <span
                                class="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Pendaftaran
                                Dibuka
                            </span>
                        </div>
                        <h1
                            class="text-white text-3xl md:text-5xl font-black leading-tight tracking-tight mb-6 font-display">
                            Indonesian Open Championship 2024</h1>
                        <div class="flex flex-wrap items-center gap-6 text-white/70 text-sm">
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary text-xl">calendar_month</span>
                                <span>12 - 15 November 2024</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary text-xl">location_on</span>
                                <span>Lapangan Panahan GBK, Jakarta</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto mt-4 lg:mt-0">
                        <button
                            class="h-14 px-8 bg-primary hover:bg-primary-hover text-navy font-bold text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(183,251,35,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2">
                            Daftar Sekarang
                            <span class="material-symbols-outlined text-xl">arrow_forward</span>
                        </button>
                    </div>
                </div>
                <!-- Tabs -->
                <div class="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-white/10">
                    <NuxtLink v-for="tab in tabs" :key="tab.id" :to="tab.path"
                        class="px-6 py-4 text-sm font-bold transition-all whitespace-nowrap border-b-2"
                        :class="isTabActive(tab) ? 'text-primary border-primary' : 'text-white/40 border-transparent hover:text-white hover:bg-white/5'">
                        {{ tab.name }}
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <main class="flex-grow max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                <!-- Left Content (NuxtPage for nested routes) -->
                <div class="lg:col-span-2">
                    <NuxtPage />
                </div>

                <!-- Shared Sidebar -->
                <aside class="space-y-8">
                    <div class="bg-white rounded-2xl p-6 shadow-xl border-t-4 border-primary relative">
                        <h3 class="text-lg font-bold text-navy mb-4 font-display">Sisa Waktu Pendaftaran</h3>
                        <div class="flex gap-3 mb-6">
                            <div v-for="unit in ['Hari', 'Jam', 'Menit']" :key="unit"
                                class="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                                <span class="block text-2xl font-black text-navy">{{ Math.floor(Math.random() * 24)
                                    }}</span>
                                <span class="text-[10px] text-text-sub uppercase font-bold">{{ unit }}</span>
                            </div>
                        </div>
                        <div class="space-y-4 mb-6">
                            <div class="flex justify-between items-center text-sm border-b border-gray-50 pb-3">
                                <span class="text-text-sub">Biaya (Individu)</span>
                                <span class="font-bold text-navy">Rp 350.000</span>
                            </div>
                            <div class="flex justify-between items-center text-sm border-b border-gray-50 pb-3">
                                <span class="text-text-sub">Biaya (Beregu)</span>
                                <span class="font-bold text-navy">Rp 500.000</span>
                            </div>
                            <div class="flex justify-between items-center text-sm pb-1">
                                <span class="text-text-sub">Slot Tersedia</span>
                                <span class="font-bold text-primary">45 / 200 Tersisa</span>
                            </div>
                            <div class="w-full bg-gray-100 rounded-full h-2">
                                <div class="bg-primary h-2 rounded-full" style="width: 77%"></div>
                            </div>
                        </div>
                        <button
                            class="w-full py-4 bg-primary hover:bg-primary-hover text-navy font-bold rounded-xl transition-all shadow-lg shadow-primary/20 hover:-translate-y-1">
                            Daftar Sekarang
                        </button>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 class="text-lg font-bold text-navy mb-4 font-display">Penyelenggara</h3>
                        <div class="flex items-center gap-4 mb-4">
                            <div class="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
                                <img alt="Perpani" class="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLm2bt_rocjJTBJyLy5egiG9qWTRu9j6JZGiQJiPm8b1G-HSoEuiHPFCrCPBc7qb81krUTSO68P9GueohN-_0IAPQUYSb-Jmd32xXgCNveXoWn0ACR6lV3AFfehy0pYgrdNBVXEyn4uZBaLcOM53xvrj6Nj8lqZdHdDm_sqOirc-36E7u9Qk0pblOTfHJH69INJpXI6D78iO58yfy0HygaJfL6aQRUXwsA6QzEsyDTsfEt6-q4b8f5rl3D59A-pT-X4fXlv7Fm3ng" />
                            </div>
                            <div>
                                <h4 class="font-bold text-navy text-sm">Perpani DKI Jakarta</h4>
                                <p class="text-xs text-text-sub flex items-center gap-1">Penyelenggara Terverifikasi
                                    <span class="material-symbols-outlined text-[14px] text-blue-500">verified</span>
                                </p>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button
                                class="flex-1 py-2 border border-gray-100 rounded-lg text-sm font-bold text-navy hover:bg-gray-50 transition-colors">Kontak</button>
                            <button
                                class="flex-1 py-2 border border-gray-100 rounded-lg text-sm font-bold text-navy hover:bg-gray-50 transition-colors">Ikuti</button>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    </div>
</template>

<script setup>
const route = useRoute()
const tId = route.params.id || '1'

const tabs = [
    { id: 'overview', name: 'Ringkasan', path: `/dashboard/tournaments/${tId}` },
    { id: 'timeline', name: 'Jadwal Pertandingan', path: `/dashboard/tournaments/${tId}/timeline` },
    { id: 'participants', name: 'Daftar Atlet', path: `/dashboard/tournaments/${tId}/participants` },
    { id: 'results', name: 'Hasil Live', path: `/dashboard/tournaments/${tId}/results` },
    { id: 'venue', name: 'Informasi Venue', path: `/dashboard/tournaments/${tId}/venue` }
]

const isTabActive = (tab) => {
    if (tab.id === 'overview' && route.path === `/dashboard/tournaments/${tId}`) return true
    return route.path === tab.path
}
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>

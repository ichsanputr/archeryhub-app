<template>
    <div class="min-h-screen bg-background-light font-body text-navy overflow-x-hidden">
        <!-- Header: Athlete Identity -->
        <div class="bg-navy relative overflow-hidden">
            <div class="absolute inset-0 z-0">
                <div class="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/40 z-10"></div>
                <img alt="Athlete Background"
                    class="w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuByxS8LZ93pBQXI_V_Vu3nB0633lwPZGiFCM3UtI-xk79b_O83ASmlHYA36lOzcnmVsbgs4DEe9awj543MvzCN1yzOo1wZ3ViXLdiMRV7vAMdy66lvu-l5dpFAOgZ0uCMKJxsBRXPJL1QeX4_ZdX2ynTEZR-ZMilrncma7gKG2YK0vsj0KJZnw_lD0UZaXFKW2aVFD1SU-mzi_sAT2D-62TP0j5LF6KprFriv2sV9rdypqLSvfrZekYDy45XaK8F1vVh7e5nfrgK7o" />
            </div>
            <div class="relative z-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div class="flex flex-col md:flex-row items-center md:items-end gap-8">
                    <div class="flex-shrink-0 relative group">
                        <div
                            class="w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-primary shadow-[0_0_30px_rgba(183,251,35,0.3)] overflow-hidden bg-gray-800">
                            <img :src="athlete.avatar" :alt="athlete.name"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    </div>
                    <div class="flex-1 text-center md:text-left text-white mb-2">
                        <div
                            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                            <span
                                class="w-5 h-3.5 bg-red-600 relative overflow-hidden rounded-[2px] shadow-sm ring-1 ring-white/30">
                                <span class="absolute bottom-0 left-0 w-full h-1/2 bg-white"></span>
                            </span>
                            <span class="text-sm font-bold tracking-wide">INA - Indonesia</span>
                        </div>
                        <h1 class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2 font-display">
                            {{ athlete.name }}
                        </h1>
                        <div class="flex flex-col md:flex-row items-center gap-4 text-white/70 text-lg mb-6">
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">badge</span>
                                <span>{{ athlete.division }}</span>
                            </div>
                            <span class="hidden md:inline text-white/20">•</span>
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">apartment</span>
                                <span>{{ athlete.club }}</span>
                            </div>
                        </div>
                        <div class="flex flex-wrap justify-center md:justify-start gap-4">
                            <BaseButton variant="primary" size="md" icon="ph:plus-bold">
                                Ikuti Atlet
                            </BaseButton>
                            <BaseButton variant="ghost" size="md" icon="ph:share-network-bold"
                                class="bg-white/10 !text-white hover:bg-white/20 backdrop-blur-sm border border-white/10">
                                Bagikan Profil
                            </BaseButton>
                        </div>
                    </div>
                    <div
                        class="hidden lg:block bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 w-64 text-white">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-white/40 text-xs font-bold uppercase tracking-wider">Status Saat
                                Ini</span>
                            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        </div>
                        <p class="font-bold mb-1">Persiapan PON 2024</p>
                        <div class="w-full bg-white/10 rounded-full h-1.5 mt-2">
                            <div class="bg-primary h-1.5 rounded-full" :style="{ width: athlete.readiness + '%' }">
                            </div>
                        </div>
                        <p class="text-right text-xs text-primary mt-1">{{ athlete.readiness }}% Kesiapan</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <main
            class="flex-grow max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 -mt-8 relative z-30">
            <!-- Performance Metrics -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-for="metric in metrics" :key="metric.label"
                    class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-primary/50 transition-colors">
                    <div>
                        <p class="text-text-sub text-xs font-bold uppercase tracking-wider mb-1">{{ metric.label }}</p>
                        <div class="flex items-baseline gap-2">
                            <h3 class="text-4xl font-black text-navy">{{ metric.value }}</h3>
                            <span v-if="metric.trend" :class="metric.trend > 0 ? 'text-green-500' : 'text-red-500'"
                                class="text-sm font-bold flex items-center">
                                <span class="material-symbols-outlined text-base">{{ metric.trend > 0 ? 'arrow_drop_up'
                                    : 'arrow_drop_down' }}</span> {{ Math.abs(metric.trend) }}
                            </span>
                        </div>
                    </div>
                    <div
                        class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-primary transition-colors">
                        <Icon :icon="metric.icon" class="text-2xl" />
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Performance Trend (Simplified Chart Representation) -->
                <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-bold text-navy flex items-center gap-2 font-display">
                            <span class="material-symbols-outlined text-primary">monitoring</span>
                            Tren Performa
                        </h3>
                    </div>
                    <div class="relative h-64 w-full flex items-end justify-between gap-4 pt-8 pb-6 px-2">
                        <div v-for="bar in performanceHistory" :key="bar.month"
                            class="relative flex flex-col items-center justify-end h-full w-full group">
                            <div :style="{ height: (bar.score / 700 * 100) + '%' }"
                                :class="bar.highlight ? 'bg-primary shadow-[0_0_15px_rgba(183,251,35,0.4)]' : 'bg-navy/10 hover:bg-navy/20'"
                                class="w-full rounded-t-sm transition-all relative">
                                <div
                                    class="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    Score: {{ bar.score }}
                                </div>
                            </div>
                            <span class="text-[10px] text-text-sub font-bold mt-2">{{ bar.month }}</span>
                        </div>
                    </div>
                </div>

                <!-- Equipment Setup -->
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 class="text-lg font-bold text-navy flex items-center gap-2 mb-6 font-display">
                        <span class="material-symbols-outlined text-primary">build</span>
                        Spesifikasi Alat
                    </h3>
                    <div class="space-y-4">
                        <div v-for="item in equipment" :key="item.label"
                            class="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-transparent hover:border-primary/20 transition-all">
                            <div
                                class="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-navy shadow-sm">
                                <Icon :icon="item.icon" class="text-xl" />
                            </div>
                            <div>
                                <p class="text-xs text-text-sub font-bold uppercase">{{ item.label }}</p>
                                <p class="font-bold text-navy text-sm">{{ item.value }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Results -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 class="text-lg font-bold text-navy flex items-center gap-2 font-display">
                        <Icon icon="ph:history-bold" class="text-primary" />
                        Hasil Turnamen Terakhir
                    </h3>
                    <BaseButton variant="ghost" size="sm" class="!text-navy font-bold">
                        Lihat Semua Riwayat
                    </BaseButton>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead>
                            <tr class="bg-gray-50 border-b border-gray-100 text-xs uppercase text-text-sub">
                                <th class="px-6 py-4 font-bold">Turnamen</th>
                                <th class="px-6 py-4 font-bold">Tanggal</th>
                                <th class="px-6 py-4 font-bold">Kategori</th>
                                <th class="px-6 py-4 font-bold">Skor Kul.</th>
                                <th class="px-6 py-4 font-bold">Peringkat Akhir</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="result in recentResults" :key="result.id"
                                class="group hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <span class="font-bold text-navy">{{ result.name }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-text-sub">{{ result.date }}</td>
                                <td class="px-6 py-4 text-text-sub">{{ result.category }}</td>
                                <td class="px-6 py-4 text-text-sub font-mono">{{ result.qualifyingScore }}</td>
                                <td class="px-6 py-4">
                                    <span :class="result.badgeClass"
                                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border">
                                        <Icon icon="ph:medal-bold" class="text-[14px]" /> {{
                                            result.rank }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
const athlete = {
    name: 'Arif Dwi Pangestu',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJXWL-Z7f7fP24_IyBjI_e-q_jYcMbzRtaKiOpKP8TxgqwSxRrCqNcE-GXJXbiCEv6rlwlNJzTmbbgAdQFWHH4Jk_Fw-aslTiT3Qezy8bbmGRG0WoRA-yD8tykZuxYObytzJ6Yf7yNL8poFU6vWlyEuFjbHcIzwfoLAMru-bfdw4GXezmv71SwRPYw_-Ct6ZP3f6AqglpvBIhCSrp9g13uTQpj69_-hzZqp1wSqJJ-9PdZqp0CYWgFWsajdRos9QmU7eeyuFhFPH0',
    division: 'Recurve Men',
    club: 'Senayan Archery Club',
    readiness: 85
}

const metrics = [
    { label: 'Ranking Nasional', value: '#1', trend: 0, icon: 'ph:globe-hemisphere-west' },
    { label: 'Rata-rata Skor', value: '9.35', trend: 0.12, icon: 'ph:target' },
    { label: 'Total Medali', value: '11', trend: 2, icon: 'ph:medal' }
]

const performanceHistory = [
    { month: 'Mei', score: 642 },
    { month: 'Jun', score: 658 },
    { month: 'Jul', score: 650 },
    { month: 'Agu', score: 675 },
    { month: 'Sep', score: 682, highlight: true },
    { month: 'Okt', score: 679 }
]

const equipment = [
    { label: 'Riser', value: 'Hoyt Formula Xi', icon: 'ph:arrow-fat-line-right' },
    { label: 'Limbs', value: 'Hoyt Velos', icon: 'ph:sketch-logo' },
    { label: 'Arrows', value: 'Easton X10', icon: 'ph:navigation-arrow' },
    { label: 'Sight', value: 'Axcel Achieve XP', icon: 'ph:eye' }
]

const recentResults = [
    {
        id: 1,
        name: 'PON Aceh-Sumut 2024',
        date: 'Sep 2024',
        category: 'Recurve Individual',
        qualifyingScore: 682,
        rank: 'Juara 1',
        badgeClass: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    },
    {
        id: 2,
        name: 'Surabaya Archery Cup',
        date: 'Agu 2024',
        category: 'Recurve Team',
        qualifyingScore: 1985,
        rank: 'Juara 2',
        badgeClass: 'bg-gray-50 text-gray-700 border-gray-200'
    }
]
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}
</style>

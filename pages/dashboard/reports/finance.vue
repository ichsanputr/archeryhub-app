<template>
    <div class="space-y-8">
        <!-- Header Section -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <!-- Decorative Background Elements (Glows) -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                    <NuxtLink to="/dashboard/reports"
                        class="size-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all group shrink-0">
                        <Icon icon="ph:arrow-left-bold"
                            class="text-white group-hover:-translate-x-1 transition-transform" />
                    </NuxtLink>
                    <div
                        class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                        <Icon icon="ph:money-bold" class="text-primary text-2xl sm:text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-3xl font-black tracking-tight">Laporan Keuangan</h1>
                        <p class="text-slate-300 text-xs sm:text-sm font-medium mt-1">Analisis arus kas, iuran, dan
                            kesehatan finansial klub</p>
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-3">
                    <div class="relative group">
                        <button
                            class="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center gap-3 hover:bg-white/20 transition-all shadow-md">
                            <Icon icon="ph:calendar-blank-bold" class="text-primary text-lg" />
                            <span>{{ dateRangeLabel }}</span>
                            <Icon icon="ph:caret-down-bold"
                                class="text-white/40 group-hover:rotate-180 transition-transform" />
                        </button>
                        <!-- Simple Dropdown Placeholder -->
                        <div
                            class="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-20 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0">
                            <div v-for="range in rangeOptions" :key="range" @click="dateRange = range"
                                class="px-4 py-3 text-xs font-bold text-navy hover:bg-primary transition-colors cursor-pointer">
                                {{ range }}
                            </div>
                        </div>
                    </div>
                    <BaseButton variant="primary" icon="ph:download-simple"
                        class="h-11 px-6 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-xs">
                        Ekspor
                    </BaseButton>
                </div>
            </div>
        </div>

        <template v-if="userRole === 'club'">
            <!-- Club Stats Overview -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div v-for="stat in clubOverviewStats" :key="stat.label"
                    class="bg-white rounded-xl p-5 flex flex-col justify-between min-h-[120px] shadow-sm hover:border-primary/50 transition-all border border-gray-100 group">
                    <div class="flex justify-between items-start gap-2">
                        <div class="min-w-0">
                            <p class="text-gray-400 text-[10px] font-black  tracking-wider mb-1 truncate">{{
                                stat.label }}</p>
                            <p class="text-navy text-2xl font-black tracking-tight tabular-nums">{{ stat.value }}</p>
                        </div>
                        <div
                            class="bg-slate-50 p-2 rounded-lg text-navy group-hover:bg-primary group-hover:text-navy transition-colors shrink-0">
                            <Icon :icon="stat.icon" class="text-2xl" />
                        </div>
                    </div>
                    <div class="mt-4">
                        <p :class="stat.trendColor" class="text-[10px] font-black flex items-center gap-1">
                            <Icon :icon="stat.trendIcon" class="text-[14px]" />
                            {{ stat.trend }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Member Performance Table -->
                <div
                    class="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-sm">
                    <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
                        <h3 class="text-navy font-black text-lg flex items-center gap-2">
                            <Icon icon="ph:trend-up-bold" class="text-primary" />
                            Performa Atlet Klub
                        </h3>
                    </div>
                    <div class="flex-1 overflow-x-auto">
                        <table class="w-full text-left min-w-[500px]">
                            <thead class="bg-gray-50/50 text-gray-500 font-bold border-b border-gray-100">
                                <tr>
                                    <th class="px-6 py-3 text-[10px]  tracking-wider">Atlet</th>
                                    <th class="px-6 py-3 text-[10px]  tracking-wider">Kategori</th>
                                    <th class="px-6 py-3 text-[10px]  tracking-wider text-center">Avg Score
                                    </th>
                                    <th class="px-6 py-3 text-[10px]  tracking-wider text-right">Trend</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50">
                                <tr v-for="athlete in clubMemberPerformance" :key="athlete.id"
                                    class="group hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="size-9 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-xs shrink-0">
                                                {{ athlete.name.charAt(0) }}
                                            </div>
                                            <div class="text-sm font-bold text-navy">{{ athlete.name }}</div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span
                                            class="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{{
                                                athlete.category }}</span>
                                    </td>
                                    <td class="px-6 py-4 text-center">
                                        <span class="text-navy font-black">{{ athlete.avgScore }}</span>
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <span
                                            :class="athlete.improvement.startsWith('+') ? 'text-green-500' : 'text-red-500'"
                                            class="text-xs font-black">
                                            {{ athlete.improvement }} pts
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Category Distribution -->
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 class="text-navy font-black text-sm  tracking-widest mb-6 flex items-center gap-2">
                        <Icon icon="ph:chart-pie-slice-bold" class="text-primary" />
                        Sebaran Kategori
                    </h3>
                    <div class="space-y-6">
                        <div v-for="cat in clubCategories" :key="cat.name" class="space-y-2">
                            <div class="flex justify-between items-center text-xs">
                                <span class="font-bold text-navy">{{ cat.name }}</span>
                                <span class="font-black text-gray-400">{{ cat.count }} Anggota</span>
                            </div>
                            <div class="w-full h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                <div class="h-full bg-primary transition-all duration-1000"
                                    :style="`width: ${cat.percentage}%`"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template v-else>
            <!-- Stats Overview -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div v-for="stat in overviewStats" :key="stat.label"
                    class="bg-white rounded-xl p-4 md:p-5 flex flex-col justify-between min-h-[120px] shadow-sm hover:border-primary/50 transition-all border border-gray-100 group">
                    <div class="flex justify-between items-start gap-2">
                        <div class="min-w-0">
                            <p
                                class="text-text-secondary text-[10px] md:text-xs font-bold  tracking-wider mb-1 truncate">
                                {{ stat.label }}</p>
                            <p class="text-navy text-2xl md:text-3xl font-black tracking-tight tabular-nums">{{
                                stat.value
                                }}</p>
                        </div>
                        <div
                            class="bg-slate-50 p-2 rounded-lg text-navy group-hover:bg-primary group-hover:text-navy transition-colors shrink-0">
                            <Icon :icon="stat.icon" class="text-xl md:text-2xl" />
                        </div>
                    </div>
                    <div class="mt-auto pt-2">
                        <p :class="stat.trendColor" class="text-[10px] font-bold flex items-center gap-1">
                            <Icon :icon="stat.trendIcon" class="text-[14px]" />
                            {{ stat.trend }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Top Athletes -->
                <div
                    class="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                        <h3 class="text-navy font-bold text-base md:text-lg flex items-center gap-2">
                            Top Atlet Bulan Ini
                        </h3>
                        <NuxtLink to="/dashboard/archers"
                            class="text-xs text-text-secondary hover:text-navy font-bold transition-colors">Lihat Semua
                        </NuxtLink>
                    </div>
                    <div class="flex-1 overflow-x-auto">
                        <table class="w-full text-left min-w-[500px]">
                            <thead class="bg-gray-50/50 text-gray-500 font-bold border-b border-gray-100">
                                <tr>
                                    <th class="px-4 md:px-6 py-3 text-[10px]  tracking-wider">Peringkat</th>
                                    <th class="px-4 md:px-6 py-3 text-[10px]  tracking-wider">Atlet</th>
                                    <th class="px-4 md:px-6 py-3 text-[10px]  tracking-wider text-center">Skor
                                        Tertinggi</th>
                                    <th class="px-4 md:px-6 py-3 text-[10px]  tracking-wider text-right">
                                        Turnamen
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50">
                                <tr v-for="(athlete, index) in topAthletes" :key="athlete.id"
                                    class="group hover:bg-gray-50 transition-colors">
                                    <td class="px-4 md:px-6 py-4">
                                        <div :class="index === 0 ? 'bg-primary text-navy' : 'bg-gray-100 text-gray-600'"
                                            class="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm">
                                            {{ index + 1 }}
                                        </div>
                                    </td>
                                    <td class="px-4 md:px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div class="size-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                <img :src="athlete.image" class="w-full h-full object-cover">
                                            </div>
                                            <div class="min-w-0">
                                                <div
                                                    class="text-sm font-bold text-navy group-hover:text-primary-hover transition-colors truncate">
                                                    {{ athlete.name }}</div>
                                                <div class="text-[10px] text-gray-400 font-bold ">{{
                                                    athlete.club
                                                    }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-4 md:px-6 py-4 text-center">
                                        <span class="text-navy font-black text-lg">{{ athlete.score }}</span>
                                    </td>
                                    <td class="px-4 md:px-6 py-4 text-right">
                                        <span class="text-gray-600 font-bold">{{ athlete.tournaments }}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Categories -->
                <div
                    class="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                        <h3 class="text-navy font-bold text-base md:text-lg">Kategori Populer</h3>
                    </div>
                    <div class="flex-1 p-6 space-y-5">
                        <div v-for="category in categories" :key="category.name" class="space-y-2 group">
                            <div class="flex justify-between items-center">
                                <span
                                    class="text-sm font-bold text-navy group-hover:text-primary-dark transition-colors">{{
                                        category.name }}</span>
                                <span class="text-xs font-bold text-gray-400">{{ category.count }} atlet</span>
                            </div>
                            <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <div class="bg-primary h-full rounded-full transition-all duration-1000"
                                    :style="`width: ${category.percentage}%`"></div>
                            </div>
                        </div>

                        <div class="pt-4 border-t border-gray-100">
                            <h4 class="text-[10px] font-black text-gray-400  tracking-[0.2em] mb-4">Distribusi
                                Geografis</h4>
                            <div class="flex items-center gap-2">
                                <div class="flex-1 h-3 bg-gray-100 rounded-lg flex overflow-hidden">
                                    <div class="h-full bg-navy w-[45%]" title="Jawa"></div>
                                    <div class="h-full bg-primary w-[30%]" title="Sumatera"></div>
                                    <div class="h-full bg-blue-400 w-[15%]" title="Kalimantan"></div>
                                    <div class="h-full bg-gray-300 w-[10%]" title="Lainnya"></div>
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                                <div class="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                    <div class="size-2 rounded-sm bg-navy"></div> Jawa (45%)
                                </div>
                                <div class="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                    <div class="size-2 rounded-sm bg-primary"></div> Sumatera (30%)
                                </div>
                                <div class="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                    <div class="size-2 rounded-sm bg-blue-400"></div> Kalimantan (15%)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h3 class="text-navy font-bold text-base md:text-lg">Aktivitas Terkini</h3>
                </div>
                <div class="p-4 space-y-3">
                    <div v-for="activity in recentActivities" :key="activity.id"
                        class="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary/20 transition-all group">
                        <div
                            class="p-2 bg-white rounded-lg border border-gray-100 shadow-sm shrink-0 group-hover:bg-primary/10 transition-colors">
                            <Icon :icon="activity.icon" class="text-[20px]" :class="activity.iconColor" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-bold text-navy">{{ activity.title }}</p>
                            <p class="text-xs text-text-secondary mt-1 leading-relaxed">{{ activity.description }}</p>
                        </div>
                        <span class="text-[10px] text-text-secondary font-black  shrink-0">{{ activity.time
                        }}</span>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
    layout: 'dashboard'
})

useSeoMeta({
    title: 'Laporan Keuangan - Archeryhub.id',
    description: 'Pantau arus kas dan kesehatan finansial klub Anda secara real-time.'
})

const { user } = useAuth()
const userRole = computed(() => user.value?.role || user.value?.type || 'archer')

const clubOverviewStats = [
    { label: 'Uang Kas / Saldo', value: 'Rp 12.4M', icon: 'ph:wallet-bold', trend: '+5.2% bulan ini', trendIcon: 'ph:trend-up', trendColor: 'text-green-600' },
    { label: 'Total Anggota', value: '48', icon: 'ph:users-three-bold', trend: '+2 anggota baru', trendIcon: 'ph:trend-up', trendColor: 'text-green-600' },
    { label: 'Partisipasi Event', value: '85%', icon: 'ph:target-bold', trend: 'Rata-rata kehadiran', trendIcon: 'ph:check-circle', trendColor: 'text-blue-600' },
    { label: 'Prestasi (Medali)', value: '15', icon: 'ph:medal-bold', trend: '+3 dari Kejurnas', trendIcon: 'ph:trend-up', trendColor: 'text-green-600' },
]

const clubMemberPerformance = [
    { id: 1, name: 'Budi Santoso', category: 'Recurve U-15', avgScore: 320, improvement: '+15', image: 'https://i.pravatar.cc/150?u=budi' },
    { id: 2, name: 'Siti Aminah', category: 'Compound Umum', avgScore: 345, improvement: '+8', image: 'https://i.pravatar.cc/150?u=siti' },
    { id: 3, name: 'Rahmat Hidayat', category: 'Barebow', avgScore: 280, improvement: '-5', image: 'https://i.pravatar.cc/150?u=rahmat' },
]

const clubCategories = [
    { name: 'Recurve Junior', count: 15, percentage: 40 },
    { name: 'Recurve Senior', count: 10, percentage: 25 },
    { name: 'Compound', count: 12, percentage: 20 },
    { name: 'Barebow', count: 11, percentage: 15 },
]

const dateRange = ref('30 Hari Terakhir')
const rangeOptions = ['7 Hari Terakhir', '30 Hari Terakhir', '3 Bulan Terakhir', 'Tahun Ini', 'Semua Waktu']
const dateRangeLabel = computed(() => dateRange.value)

const overviewStats = [
    { label: 'Total Pendapatan', value: 'Rp 42.5M', icon: 'ph:money-bold', trend: '+18.4% vs bln lalu', trendIcon: 'ph:trend-up', trendColor: 'text-green-600' },
    { label: 'Pendaftar Baru', value: '1.284', icon: 'ph:user-plus-bold', trend: '+12% hari ini', trendIcon: 'ph:trend-up', trendColor: 'text-green-600' },
    { label: 'Tingkat Partisipasi', value: '92%', icon: 'ph:chart-line-up-bold', trend: '+5.2% vs target', trendIcon: 'ph:trend-up', trendColor: 'text-green-600' },
    { label: 'Klub Aktif', value: '89', icon: 'ph:house-line-bold', trend: '+5 klub baru', trendIcon: 'ph:plus-circle', trendColor: 'text-blue-600' },
]

const topAthletes = [
    { id: 1, name: 'Arif Dwi Pangestu', club: 'DKI Jakarta', score: 685, tournaments: 12, image: 'https://i.pravatar.cc/150?u=arif' },
    { id: 2, name: 'Diananda Choirunisa', club: 'Jatim Archery', score: 678, tournaments: 10, image: 'https://i.pravatar.cc/150?u=diana' },
    { id: 3, name: 'Riau Ega Agatha', club: 'Puslatnas', score: 672, tournaments: 15, image: 'https://i.pravatar.cc/150?u=ega' },
    { id: 4, name: 'Alviyanto Bagas', club: 'Solo Archery', score: 665, tournaments: 8, image: 'https://i.pravatar.cc/150?u=bagas' },
    { id: 5, name: 'Rezza Octavia', club: 'Papua Archery', score: 658, tournaments: 11, image: 'https://i.pravatar.cc/150?u=rezza' },
]

const categories = [
    { name: 'Recurve Putra', count: 892, percentage: 75 },
    { name: 'Recurve Putri', count: 645, percentage: 55 },
    { name: 'Compound Putra', count: 423, percentage: 40 },
    { name: 'Compound Putri', count: 312, percentage: 30 },
    { name: 'Barebow', count: 187, percentage: 18 },
]

const recentActivities = [
    { id: 1, title: 'Indonesian Open 2024 selesai', description: '450 atlet berpartisipasi dari 35 klub', time: '2 jam lalu', icon: 'ph:trophy', iconColor: 'text-primary-dark' },
    { id: 2, title: 'Rekor baru tercatat', description: 'Arif Dwi mencatat skor 685 di kategori Recurve 70m', time: '5 jam lalu', icon: 'ph:star-fill', iconColor: 'text-yellow-500' },
    { id: 3, title: 'Klub baru bergabung', description: 'Surabaya Archery Academy mendaftar sebagai mitra', time: '1 hari lalu', icon: 'ph:user-plus', iconColor: 'text-blue-500' },
]
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>

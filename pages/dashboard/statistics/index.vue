<template>
    <div class="space-y-8">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">Statistik Global</h1>
                <p class="text-text-secondary mt-1 font-medium text-sm">Analisis performa atlet dan turnamen</p>
            </div>
            <div class="flex gap-3">
                <BaseButton variant="outline" icon="ph:download-simple">
                    Ekspor Laporan
                </BaseButton>
            </div>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="stat in overviewStats" :key="stat.label"
                class="bg-white rounded-xl p-4 md:p-5 flex flex-col justify-between min-h-[120px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
                <div class="flex justify-between items-start gap-2">
                    <div class="min-w-0">
                        <p
                            class="text-text-secondary text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 truncate">
                            {{ stat.label }}</p>
                        <p class="text-navy text-2xl md:text-3xl font-black tracking-tight tabular-nums">{{ stat.value
                        }}</p>
                    </div>
                    <div
                        class="bg-gray-50 p-2 rounded-lg text-primary-dark group-hover:bg-primary group-hover:text-navy transition-colors shrink-0">
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
                    <NuxtLink to="/dashboard/athletes"
                        class="text-xs text-text-secondary hover:text-navy font-bold transition-colors">Lihat Semua
                    </NuxtLink>
                </div>
                <div class="flex-1 overflow-x-auto">
                    <table class="w-full text-left min-w-[500px]">
                        <thead class="bg-gray-50/50 text-gray-500 font-bold border-b border-gray-100">
                            <tr>
                                <th class="px-4 md:px-6 py-3 text-[10px] uppercase tracking-wider">Peringkat</th>
                                <th class="px-4 md:px-6 py-3 text-[10px] uppercase tracking-wider">Atlet</th>
                                <th class="px-4 md:px-6 py-3 text-[10px] uppercase tracking-wider text-center">Skor
                                    Tertinggi</th>
                                <th class="px-4 md:px-6 py-3 text-[10px] uppercase tracking-wider text-right">Turnamen
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
                                            <div class="text-[10px] text-gray-400 font-bold uppercase">{{ athlete.club
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
                <div class="flex-1 p-4 space-y-4">
                    <div v-for="category in categories" :key="category.name" class="space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-bold text-navy">{{ category.name }}</span>
                            <span class="text-xs font-bold text-gray-400">{{ category.count }} atlet</span>
                        </div>
                        <div class="w-full bg-gray-100 rounded-full h-2">
                            <div class="bg-primary h-2 rounded-full transition-all"
                                :style="`width: ${category.percentage}%`"></div>
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
                    <span class="text-[10px] text-text-secondary font-black uppercase shrink-0">{{ activity.time
                        }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
definePageMeta({
    layout: 'dashboard'
})

const overviewStats = [
    { label: 'Total Atlet', value: '2.847', icon: 'ph:users-three', trend: '+128 bulan ini', trendIcon: 'ph:trend-up', trendColor: 'text-green-600' },
    { label: 'Turnamen Selesai', value: '156', icon: 'ph:trophy', trend: '+12 bulan ini', trendIcon: 'ph:trend-up', trendColor: 'text-green-600' },
    { label: 'Rata-rata Skor', value: '542', icon: 'ph:target', trend: '+3.2% vs bulan lalu', trendIcon: 'ph:trend-up', trendColor: 'text-green-600' },
    { label: 'Klub Terdaftar', value: '89', icon: 'ph:house-line', trend: '+5 klub baru', trendIcon: 'ph:plus-circle', trendColor: 'text-blue-600' },
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

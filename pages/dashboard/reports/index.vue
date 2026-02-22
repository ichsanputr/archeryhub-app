<template>
    <div class="space-y-8">
        <!-- Header Section -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <!-- Decorative Background Elements -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                    <div
                        class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                        <Icon icon="ph:files-bold" class="text-primary text-2xl sm:text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-3xl font-black tracking-tight">Pusat Laporan</h1>
                        <p class="text-slate-300 text-xs sm:text-sm font-medium mt-1">Pilih jenis laporan yang ingin
                            Anda analisis</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Reports Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink v-for="report in reports" :key="report.title" :to="report.link"
                class="group bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 relative overflow-hidden flex flex-col h-full">
                <!-- Hover Glow -->
                <div
                    class="absolute -right-10 -top-10 size-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500">
                </div>

                <div class="relative z-10">
                    <div :class="report.bgClass"
                        class="size-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Icon :icon="report.icon" :class="report.iconClass" class="text-3xl" />
                    </div>

                    <h3 class="text-xl font-black text-navy mb-3">{{ report.title }}</h3>
                    <p class="text-gray-500 text-sm font-medium leading-relaxed mb-8">
                        {{ report.description }}
                    </p>
                </div>

                <div
                    class="mt-auto flex items-center justify-between pt-6 border-t border-gray-50 group-hover:border-primary/10 transition-colors">
                    <span
                        class="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-primary transition-colors">
                        Buka Laporan
                    </span>
                    <div
                        class="size-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary transition-all duration-500 group-hover:translate-x-1">
                        <Icon icon="ph:arrow-right-bold" class="text-navy text-sm group-hover:text-navy" />
                    </div>
                </div>
            </NuxtLink>
        </div>

        <!-- Quick Insights Section (Optional) -->
        <div class="bg-slate-50 rounded-[32px] p-8 border border-gray-100">
            <div class="flex items-center gap-3 mb-6">
                <Icon icon="ph:lightning-fill" class="text-primary text-xl" />
                <h2 class="text-sm font-black text-navy uppercase tracking-widest">Informasi Penting Hari Ini</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white p-4 rounded-2xl flex items-center gap-4 border border-white shadow-sm">
                    <div class="size-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                        <Icon icon="ph:check-circle-fill" class="text-green-500" />
                    </div>
                    <div>
                        <p class="text-xs font-bold text-navy">Laporan Keuangan Terupdate</p>
                        <p class="text-[10px] text-gray-400">Terakhir dibuat 2 jam yang lalu</p>
                    </div>
                </div>
                <div class="bg-white p-4 rounded-2xl flex items-center gap-4 border border-white shadow-sm">
                    <div class="size-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                        <Icon icon="ph:warning-circle-fill" class="text-orange-500" />
                    </div>
                    <div>
                        <p class="text-xs font-bold text-navy">3 Atlet Perlu Review Performa</p>
                        <p class="text-[10px] text-gray-400">Penurunan skor rata-rata minggu ini</p>
                    </div>
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

const reports = [
    {
        title: 'Laporan Keuangan',
        description: 'Kelola kas klub, iuran bulanan, pendapatan turnamen, dan pengeluaran operasional secara detail.',
        icon: 'ph:money-bold',
        link: '/dashboard/reports/finance',
        bgClass: 'bg-green-50',
        iconClass: 'text-green-600'
    },
    {
        title: 'Statistik Anggota',
        description: 'Pantau pertumbuhan anggota, tingkat kehadiran latihan, dan distribusi kategori usia atlet.',
        icon: 'ph:users-four-bold',
        link: '#',
        bgClass: 'bg-blue-50',
        iconClass: 'text-blue-600'
    },
    {
        title: 'Analisis Performa',
        description: 'Lihat progres skor atlet, hasil turnamen terakhir, dan grafik peningkatan performa individu.',
        icon: 'ph:chart-line-up-bold',
        link: '#',
        bgClass: 'bg-primary/10',
        iconClass: 'text-navy'
    },
    {
        title: 'Inventaris & Aset',
        description: 'Data peminjaman alat, stok busur klub, anak panah, dan perlengkapan lainnya.',
        icon: 'ph:package-bold',
        link: '#',
        bgClass: 'bg-orange-50',
        iconClass: 'text-orange-600'
    },
    {
        title: 'Laporan Event',
        description: 'Evaluasi hasil penyelenggaraan event internal maupun open tournament yang diikuti klub.',
        icon: 'ph:calendar-check-bold',
        link: '#',
        bgClass: 'bg-purple-50',
        iconClass: 'text-purple-600'
    },
    {
        title: 'Sertifikasi & Lisensi',
        description: 'Data sertifikat atlet, lisensi pelatih aktif, dan riwayat pelatihan internal klub.',
        icon: 'ph:certificate-bold',
        link: '#',
        bgClass: 'bg-red-50',
        iconClass: 'text-red-600'
    }
]

useSeoMeta({
    title: 'Pusat Laporan - Archeryhub.id',
    description: 'Analisis dan pantau performa klub Anda dengan laporan komprehensif dari Archeryhub.id.'
})
</script>

<style scoped>
.font-display {
    font-family: 'Lexend', sans-serif;
}
</style>

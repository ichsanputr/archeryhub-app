<template>
    <div class="space-y-6">
        <!-- Breadcrumb & Header -->
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight uppercase">
                    <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Detail Event</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Manajemen Eliminasi</h1>
                <p class="text-gray-500 font-medium mt-1">Kelola bagan pertandingan dan pemilihan pemenang.</p>
            </div>
            <div class="flex gap-3 mt-2 md:mt-0">
                <BaseButton variant="white" icon="ph:printer" class="h-11">
                    Cetak Bagan
                </BaseButton>
                <BaseButton variant="primary" icon="ph:broadcast-bold" class="h-11 shadow-lg shadow-primary/20">
                    Tampilan Siaran
                </BaseButton>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-12 w-12 rounded-xl bg-navy/5 text-navy flex items-center justify-center">
                    <Icon icon="ph:brackets-square" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Bagan</p>
                    <p class="text-xl font-black text-navy">4</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                    <Icon icon="ph:check-circle" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pertandingan Selesai</p>
                    <p class="text-xl font-black text-navy">12/16</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Icon icon="ph:clock" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sedang Berlangsung</p>
                    <p class="text-xl font-black text-navy">2</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-12 w-12 rounded-xl bg-primary/10 text-primary-dark flex items-center justify-center">
                    <Icon icon="ph:trend-up" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Finalis Terpilih</p>
                    <p class="text-xl font-black text-navy">2/4</p>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div
            class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-grow w-full">
                <BaseSelect v-model="activeCategory" :items="['Recurve Men Individual', 'Compound Women Individual']"
                    label="Pilih Kategori" />
            </div>
            <div class="w-full md:w-64">
                <BaseSelect v-model="activeStage"
                    :items="['1/16 Final', '1/8 Final', 'Quarter-final', 'Semi-final', 'Final']" label="Tahap" />
            </div>
            <BaseButton variant="white" icon="ph:swap" class="h-11">
                Atur Seed
            </BaseButton>
        </div>

        <!-- Bracket Visualization Area -->
        <div
            class="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <div class="flex items-center gap-4">
                    <h3 class="font-bold text-navy">Bagan Event</h3>
                    <div class="flex bg-gray-100 p-1 rounded-lg">
                        <button class="px-4 py-1.5 rounded-md text-xs font-bold bg-white text-navy shadow-sm">1/8
                            Final</button>
                        <button class="px-4 py-1.5 rounded-md text-xs font-bold text-gray-500 hover:text-navy">Perempat
                            Final</button>
                        <button class="px-4 py-1.5 rounded-md text-xs font-bold text-gray-500 hover:text-navy">Semi
                            Final</button>
                        <button
                            class="px-4 py-1.5 rounded-md text-xs font-bold text-gray-500 hover:text-navy">Final</button>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pembaruan
                        Langsung</span>
                    <span class="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                </div>
            </div>

            <div class="flex-1 p-8 overflow-auto bg-slate-50/50">
                <div class="flex items-center gap-4 mb-8">
                    <h2 class="text-lg font-black text-navy uppercase tracking-widest">Bracket Preview</h2>
                    <div class="h-px flex-grow bg-gray-100"></div>
                    <span class="text-xs text-text-secondary font-bold">Zoom: 100%</span>
                </div>

                <!-- Simplified Bracket Mockup -->
                <div class="flex gap-16 min-w-max h-full items-center">
                    <!-- 1/8 Finals -->
                    <div class="flex flex-col gap-8">
                        <div v-for="i in 4" :key="i"
                            class="w-48 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:border-primary transition-colors cursor-pointer group">
                            <div
                                class="bg-gray-50 px-3 py-1.5 border-b border-gray-100 flex justify-between items-center">
                                <span class="text-[9px] font-bold text-gray-400 uppercase">Pertandingan {{ i }}</span>
                                <span
                                    class="text-[9px] font-bold text-primary-hover bg-navy px-1.5 rounded">Langsung</span>
                            </div>
                            <div class="p-3 space-y-2">
                                <div class="flex justify-between items-center">
                                    <span class="text-xs font-bold text-navy truncate">Archer A{{ i }}</span>
                                    <span class="text-xs font-black text-navy">6</span>
                                </div>
                                <div class="flex justify-between items-center opacity-50">
                                    <span class="text-xs font-medium text-gray-500 truncate">Archer B{{ i }}</span>
                                    <span class="text-xs font-bold text-gray-400">2</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quarter Finals -->
                    <div class="flex flex-col gap-32">
                        <div v-for="i in 2" :key="i"
                            class="w-48 bg-white border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-center">
                            <span
                                class="text-[10px] font-bold text-gray-300 uppercase tracking-widest text-center">Menunggu
                                Pemenang M{{ i * 2 - 1 }}/M{{ i * 2 }}</span>
                        </div>
                    </div>

                    <!-- Finals -->
                    <div class="flex flex-col">
                        <div
                            class="w-64 h-40 bg-white border-2 border-primary rounded-2xl flex flex-col items-center justify-center shadow-xl relative overflow-hidden group">
                            <div class="absolute top-0 inset-x-0 h-1.5 bg-primary"></div>
                            <span
                                class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Pertandingan
                                Medali Emas</span>
                            <div class="flex items-center gap-6">
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="size-10 rounded-full bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-300">
                                        <Icon icon="ph:user" class="text-xl" />
                                    </div>
                                    <span class="text-[10px] font-bold text-gray-400">TBD</span>
                                </div>
                                <span class="text-sm font-black text-navy italic">vs</span>
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="size-10 rounded-full bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-300">
                                        <Icon icon="ph:user" class="text-xl" />
                                    </div>
                                    <span class="text-[10px] font-bold text-gray-400">TBD</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
                <div class="flex gap-8">
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pertandingan
                            Aktif</span>
                        <span class="text-sm font-bold text-navy">4</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selesai</span>
                        <span class="text-sm font-bold text-navy">12 / 16</span>
                    </div>
                </div>
                <button
                    class="flex items-center gap-2 bg-navy text-primary px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-navy-light transition-all">
                    Inisialisasi Bagan
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
definePageMeta({
    layout: 'dashboard'
})

const activeCategory = ref('Recurve Men Individual')
const activeStage = ref('1/8 Final')
</script>

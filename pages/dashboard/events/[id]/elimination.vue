<template>
    <div class="space-y-6 pb-20">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
                <div
                    class="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                    <NuxtLink to="/dashboard/events" class="hover:text-primary transition-colors">Events</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[10px]" />
                    <NuxtLink :to="`/dashboard/events/${route.params.id}/overview`"
                        class="hover:text-primary transition-colors">Control Panel</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[10px]" />
                    <span class="text-navy">Detail Eliminasi</span>
                </div>
                <h1 class="text-3xl font-black text-navy tracking-tight">Manajemen Bagan Eliminasi</h1>
            </div>
            <div class="flex gap-3">
                <BaseButton variant="white" icon="ph:printer-bold" class="h-11 px-5 border-gray-200">Cetak Bagan
                </BaseButton>
                <BaseButton variant="primary" icon="ph:broadcast-bold" class="h-11 px-6 shadow-lg shadow-primary/20">
                    Siar Langsung</BaseButton>
            </div>
        </div>

        <!-- Filter & Control Bar -->
        <div
            class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
            <div class="flex items-center gap-6 flex-grow w-full md:w-auto">
                <div class="flex flex-col gap-1.5 w-full md:w-64">
                    <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Kategori
                        Pertandingan</label>
                    <BaseSelect v-model="activeCategory"
                        :items="['Recurve Men Individual', 'Compound Women Individual']" />
                </div>
                <div class="h-10 w-px bg-gray-100 hidden md:block"></div>
                <div class="flex gap-1 bg-gray-100 p-1.5 rounded-2xl">
                    <button v-for="round in ['1/32', '1/16', '1/8', 'Final']" :key="round" @click="activeRound = round"
                        :class="activeRound === round ? 'bg-white text-navy shadow-sm' : 'text-gray-400 hover:text-navy'"
                        class="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        {{ round }}
                    </button>
                </div>
            </div>
            <div class="flex items-center gap-4 w-full md:w-auto shrink-0">
                <div class="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-2xl border border-green-100/50">
                    <span class="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span
                        class="text-[9px] font-black text-green-700 uppercase tracking-widest whitespace-nowrap">Auto-sync
                        Active</span>
                </div>
                <button
                    class="p-3 bg-navy text-primary rounded-2xl hover:bg-navy-light transition-all shadow-md active:scale-95">
                    <Icon icon="ph:arrows-clockwise-bold" class="text-lg" />
                </button>
            </div>
        </div>

        <!-- Bracket Visualization -->
        <div
            class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-[700px] flex flex-col relative">
            <!-- Scrollable Area -->
            <div class="flex-1 overflow-auto p-12 bg-slate-50/50 select-none scrollbar-thin">
                <div class="min-w-max flex gap-20 h-full relative">
                    <!-- Round 1/8 -->
                    <div class="flex flex-col justify-around gap-12 py-8">
                        <div class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center mb-4">
                            1/8 Finals</div>
                        <div v-for="i in 4" :key="i" @click="selectedMatch = i" :class="[
                            i === 1 ? 'border-l-4 border-l-primary ring-1 ring-primary/10' :
                                i === 2 ? 'border-l-4 border-l-red-500 shadow-md ring-1 ring-red-100' :
                                    'opacity-70 grayscale-[0.3]'
                        ]"
                            class="w-56 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-primary transition-all cursor-pointer overflow-hidden flex flex-col group">
                            <div
                                class="flex justify-between items-center px-4 py-2 border-b border-gray-50 bg-gray-50/30">
                                <span
                                    :class="i === 1 ? 'text-primary-hover bg-navy' : i === 2 ? 'text-red-600 bg-red-50' : 'text-gray-400 bg-gray-100'"
                                    class="text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest">
                                    {{ i === 1 ? 'Selesai' : i === 2 ? 'Live' : 'Antrean' }}
                                </span>
                                <span class="text-[8px] font-black text-gray-400 uppercase tracking-widest">Match {{ i
                                    }}</span>
                            </div>
                            <div class="p-3 space-y-2">
                                <div class="flex justify-between items-center h-6">
                                    <span class="text-[11px] font-black text-navy truncate">Archer A{{ i }}</span>
                                    <span class="text-xs font-black text-navy">{{ i === 1 ? '6' : i === 2 ? '4' : '-'
                                        }}</span>
                                </div>
                                <div class="flex justify-between items-center h-6">
                                    <span class="text-[11px] font-bold text-gray-400 truncate">Archer B{{ i }}</span>
                                    <span class="text-xs font-black text-gray-400">{{ i === 1 ? '0' : i === 2 ? '2' :
                                        '-' }}</span>
                                </div>
                            </div>
                            <div v-if="i === 2" class="h-1 bg-red-500/20">
                                <div class="bg-red-500 h-full w-2/3 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Connection 1 -->
                    <div class="flex flex-col justify-around py-8">
                        <div v-for="i in 2" :key="i"
                            class="h-[200px] w-12 border-y-2 border-r-2 border-gray-200 rounded-r-3xl my-[-100px] first:mb-32">
                        </div>
                    </div>

                    <!-- Quarter Finals -->
                    <div class="flex flex-col justify-around gap-24 py-8">
                        <div class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center mb-4">
                            Quarter-Finals</div>
                        <div v-for="i in 2" :key="i"
                            class="w-56 bg-white border-2 border-dashed border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 opacity-40">
                            <Icon icon="ph:hourglass-bold" class="text-2xl text-gray-300" />
                            <span
                                class="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center leading-relaxed">Menunggu
                                Pemenang<br />Match {{ i * 2 - 1 }} & {{ i * 2 }}</span>
                        </div>
                    </div>

                    <!-- Finals -->
                    <div class="flex flex-col justify-around py-8">
                        <div
                            class="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] text-center mb-4 bg-navy px-8 py-2 rounded-full shadow-lg shadow-navy/20">
                            Gold Finals</div>
                        <div
                            class="w-64 h-48 bg-white border-2 border-primary rounded-[2.5rem] flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group hover:shadow-primary/20 transition-all cursor-pointer p-8">
                            <div class="absolute top-0 inset-x-0 h-2 bg-primary"></div>
                            <div
                                class="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                                <Icon icon="ph:trophy-bold" class="text-9xl" />
                            </div>
                            <span
                                class="text-[10px] font-black text-gray-400 uppercase mb-6 tracking-[0.2em] relative z-10">Gold
                                Medal Match</span>
                            <div class="flex items-center gap-6 relative z-10 w-full justify-center">
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="h-14 w-14 rounded-full bg-slate-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
                                        <Icon icon="ph:user-bold" class="text-gray-200 text-2xl" />
                                    </div>
                                    <span class="text-[9px] font-black text-gray-300 uppercase">Winner S1</span>
                                </div>
                                <span class="text-sm font-black text-navy/20 italic mt-[-20px]">VS</span>
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="h-14 w-14 rounded-full bg-slate-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
                                        <Icon icon="ph:user-bold" class="text-gray-200 text-2xl" />
                                    </div>
                                    <span class="text-[9px] font-black text-gray-300 uppercase">Winner S2</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Stats -->
            <div class="px-10 py-5 bg-navy text-white flex items-center justify-between shrink-0">
                <div class="flex gap-12">
                    <div class="space-y-1">
                        <p class="text-[8px] font-black text-primary/60 uppercase tracking-widest leading-none">Total
                            Pertandingan</p>
                        <p class="text-xl font-black tabular-nums">16 <span
                                class="text-xs text-white/30 font-medium tracking-normal">Matches</span></p>
                    </div>
                    <div class="space-y-1">
                        <p class="text-[8px] font-black text-primary/60 uppercase tracking-widest leading-none">Selesai
                        </p>
                        <p class="text-xl font-black tabular-nums">12 <span
                                class="text-xs text-white/30 font-medium tracking-normal">/ 16</span></p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <NuxtLink :to="`/dashboard/events/${route.params.id}/overview`"
                        class="px-6 py-2.5 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">
                        Inisialisasi Ulang
                    </NuxtLink>
                    <button
                        class="px-6 py-2.5 bg-primary text-navy hover:bg-primary-hover transition-all rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95">
                        Kunci Bagan
                    </button>
                </div>
            </div>

            <!-- Side Entry Panel (Conditional) -->
            <Transition name="slide-panel">
                <div v-if="selectedMatch"
                    class="absolute top-0 right-0 w-80 h-full bg-white shadow-2xl border-l border-gray-100 z-20 flex flex-col clip-panel">
                    <div class="p-6 bg-navy text-white flex justify-between items-center">
                        <div>
                            <h4 class="text-xs font-black uppercase tracking-widest text-primary">Input Skor Cepat</h4>
                            <p class="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-1">Match {{
                                selectedMatch }} • 1/8 Finals</p>
                        </div>
                        <button @click="selectedMatch = null"
                            class="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-all group">
                            <Icon icon="ph:x-bold" class="group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>
                    <div class="p-8 flex-1 flex flex-col">
                        <div class="space-y-10 flex-1">
                            <div v-for="i in 2" :key="i" class="space-y-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-navy border border-gray-100">
                                        {{ i === 1 ? 'A' : 'B' }}</div>
                                    <div>
                                        <p class="text-xs font-black text-navy">Archer {{ i === 1 ? 'A' : 'B' }}{{
                                            selectedMatch }}</p>
                                        <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Set
                                            Points: {{ i === 1 ? '4' : '2' }}</p>
                                    </div>
                                </div>
                                <div
                                    class="flex items-center justify-center gap-6 py-4 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                    <button
                                        class="h-10 w-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-xl font-black text-navy shadow-sm hover:border-primary transition-all active:scale-90">-</button>
                                    <div class="text-3xl font-black text-navy tabular-nums w-12 text-center">{{ i === 1
                                        ? '2' : '0' }}</div>
                                    <button
                                        class="h-10 w-10 bg-primary border border-primary rounded-xl flex items-center justify-center text-xl font-black text-navy shadow-md hover:bg-primary-hover transition-all active:scale-90">+</button>
                                </div>
                            </div>
                        </div>
                        <div class="pt-8 border-t border-gray-50 space-y-3">
                            <div
                                class="flex items-center gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-100 mb-6">
                                <Icon icon="ph:warning-circle-bold" class="text-amber-500 shrink-0" />
                                <p class="text-[9px] font-bold text-amber-700 uppercase leading-relaxed">Update ini akan
                                    langsung mengubah data scoreboard publik.</p>
                            </div>
                            <BaseButton variant="primary"
                                class="w-full h-14 font-black text-[11px] uppercase tracking-[0.15em] shadow-lg shadow-primary/20"
                                icon="ph:cloud-arrow-up-bold">
                                Update Hasil Set
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()

const activeCategory = ref('Recurve Men Individual')
const activeRound = ref('1/8')
const selectedMatch = ref(null)
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

.slide-panel-enter-active,
.slide-panel-leave-active {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-panel-enter-from,
.slide-panel-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.clip-panel {
    border-top-left-radius: 2.5rem;
    border-bottom-left-radius: 2.5rem;
}
</style>

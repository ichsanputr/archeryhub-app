<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Qualification Control Card -->
        <div
            class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:border-primary/30 transition-all">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h3 class="font-black text-navy text-sm uppercase tracking-widest">Babak Kualifikasi</h3>
                    <p class="text-xs text-gray-400 mt-1">Recurve Men - 72 Arrows @ 70m</p>
                </div>
                <span
                    :class="phaseStatus.qualification === 'active' ? 'bg-primary text-navy shadow-primary/20' : 'bg-gray-100 text-gray-400'"
                    class="px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm">
                    {{ phaseStatus.qualification === 'active' ? 'Aktif' : 'Non-aktif' }}
                </span>
            </div>
            <div class="p-8 flex-grow space-y-8">
                <!-- Progress Stats -->
                <div class="bg-gray-50/50 rounded-2xl p-5 border border-gray-100/50">
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progres Sesi</span>
                        <span class="text-sm font-black text-navy">9 / 12 Seri</span>
                    </div>
                    <div class="w-full bg-gray-200/50 h-2.5 rounded-full overflow-hidden flex">
                        <div class="bg-primary h-full shadow-[0_0_15px_rgba(217,255,0,0.5)] transition-all duration-1000"
                            style="width: 75%"></div>
                    </div>
                    <div class="grid grid-cols-12 gap-1.5 mt-4">
                        <div v-for="i in 12" :key="i"
                            :class="i <= 9 ? 'bg-primary shadow-[0_0_5px_rgba(217,255,0,0.3)]' : 'bg-gray-200'"
                            class="h-1.5 rounded-full transition-colors duration-500"></div>
                    </div>
                </div>

                <!-- Action Grid -->
                <div class="grid grid-cols-2 gap-4">
                    <button @click="togglePhase('qualification')"
                        :class="phaseStatus.qualification === 'active' ? 'bg-navy text-white hover:bg-navy-light' : 'bg-primary text-navy hover:bg-primary-hover'"
                        class="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm">
                        <Icon
                            :icon="phaseStatus.qualification === 'active' ? 'ph:stop-circle-bold' : 'ph:play-circle-bold'"
                            class="text-3xl" />
                        {{ phaseStatus.qualification === 'active' ? 'Hentikan Sesi' : 'Mulai Kualifikasi' }}
                    </button>
                    <NuxtLink :to="`/dashboard/events/${route.params.id}/manage/qualification`"
                        class="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-primary hover:bg-primary/5 transition-all text-navy group-hover:shadow-md">
                        <Icon icon="ph:scoreboard-bold" class="text-3xl text-gray-400 group-hover:text-primary" />
                        Detail Skor
                    </NuxtLink>
                </div>

                <!-- Real-time Ranking Highlights -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h4 class="text-[10px] font-black text-navy-dark uppercase tracking-widest">Peringkat Sementara
                        </h4>
                        <span class="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    </div>
                    <div class="space-y-2">
                        <div v-for="(rank, i) in topRanks" :key="i"
                            class="flex items-center gap-4 p-3 rounded-xl border border-gray-50 bg-white hover:shadow-sm transition-all group/item">
                            <span class="text-sm font-black text-navy w-4">{{ i + 1 }}</span>
                            <div
                                class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
                                <Icon icon="ph:user-bold" class="text-gray-300" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-xs font-black text-navy truncate">{{ rank.name }}</p>
                                <p class="text-[9px] text-gray-400 font-bold uppercase">{{ rank.club }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-black text-navy">{{ rank.score }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span>Sync Status: <span class="text-green-500">Online</span></span>
                <button class="hover:text-navy transition-colors flex items-center gap-1">
                    <Icon icon="ph:arrow-clockwise" /> Force Sync
                </button>
            </div>
        </div>

        <!-- Elimination Control Card -->
        <div
            class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:border-primary/30 transition-all">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h3 class="font-black text-navy text-sm uppercase tracking-widest">Babak Eliminasi</h3>
                    <p class="text-xs text-gray-400 mt-1">Head-to-Head • Sets Format</p>
                </div>
                <span
                    :class="phaseStatus.elimination === 'active' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'"
                    class="px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm">
                    {{ phaseStatus.elimination === 'active' ? 'Live' : 'Antrean' }}
                </span>
            </div>
            <div class="p-8 flex-grow space-y-8">
                <!-- Management Actions -->
                <div class="bg-navy/5 rounded-2xl p-6 border border-navy/5 space-y-6">
                    <div class="flex items-start gap-4">
                        <div class="h-10 w-10 rounded-xl bg-navy text-white flex items-center justify-center shrink-0">
                            <Icon icon="ph:tree-structure-bold" class="text-xl" />
                        </div>
                        <div>
                            <h4 class="text-xs font-black text-navy uppercase tracking-widest mb-1">Inisialisasi Bagan
                            </h4>
                            <p class="text-[10px] text-gray-400 font-medium">Buat bagan otomatis berdasarkan hasil
                                kualifikasi.</p>
                        </div>
                    </div>
                    <BaseButton variant="primary"
                        class="w-full h-12 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
                        icon="ph:lightning-bold">
                        Bangun Bracket Sekarang
                    </BaseButton>
                </div>

                <!-- Match Progress Grid -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Pertandingan
                            Selesai</p>
                        <p class="text-2xl font-black text-navy">12 <span class="text-xs text-gray-300">/ 16</span></p>
                    </div>
                    <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Live Matches</p>
                        <p class="text-2xl font-black text-orange-500">4</p>
                    </div>
                </div>

                <!-- Quick Settings -->
                <div class="space-y-4">
                    <h4 class="text-[10px] font-black text-navy uppercase tracking-widest">Pengaturan Cepat</h4>
                    <div class="space-y-3">
                        <div
                            class="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all cursor-pointer">
                            <div class="flex items-center gap-3">
                                <Icon icon="ph:shield-check-bold" class="text-navy text-lg" />
                                <span class="text-[11px] font-bold text-navy uppercase tracking-wider">Verifikasi Hasil
                                    Terpusat</span>
                            </div>
                            <div class="h-4 w-8 rounded-full bg-primary relative cursor-pointer">
                                <div class="h-3 w-3 rounded-full bg-navy absolute right-0.5 top-0.5 shadow-sm"></div>
                            </div>
                        </div>
                        <div
                            class="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all cursor-pointer">
                            <div class="flex items-center gap-3">
                                <Icon icon="ph:broadcast-bold" class="text-navy text-lg" />
                                <span class="text-[11px] font-bold text-navy uppercase tracking-wider">Auto-update
                                    Result TV</span>
                            </div>
                            <div class="h-4 w-8 rounded-full bg-gray-200 relative cursor-pointer">
                                <div class="h-3 w-3 rounded-full bg-white absolute left-0.5 top-0.5 shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="px-8 py-6 bg-navy text-white flex justify-between items-center group/btn cursor-pointer overflow-hidden relative">
                <div
                    class="absolute top-0 left-0 w-full h-full bg-primary/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300">
                </div>
                <div class="relative z-10">
                    <h4 class="text-xs font-black uppercase tracking-[0.2em] text-primary">MANAJEMEN ELIMINASI</h4>
                    <p class="text-[9px] font-medium text-gray-400 mt-1">Buka editor bagan dan kontrol pertandingan</p>
                </div>
                <Icon icon="ph:arrow-right-bold"
                    class="text-2xl text-primary group-hover/btn:translate-x-2 transition-transform relative z-10" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, reactive } from 'vue'

const route = useRoute()

const phaseStatus = reactive({
    qualification: 'active',
    elimination: 'pending'
})

const topRanks = ref([
    { name: 'Marcus Thompson', club: 'Garuda AC', score: 588 },
    { name: 'Kim Jae-seong', club: 'Korean Archery', score: 584 },
    { name: 'Luca Rossi', club: 'Roma Archery', score: 579 },
    { name: 'Ahmad Rifai', club: 'Jakarta AC', score: 575 }
])

const togglePhase = (phase) => {
    phaseStatus[phase] = phaseStatus[phase] === 'active' ? 'pending' : 'active'
}
</script>

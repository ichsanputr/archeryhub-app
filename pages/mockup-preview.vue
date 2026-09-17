<template>
    <div class="min-h-screen bg-slate-950 text-white font-body p-6 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden">
        <!-- Ambient Background Glows -->
        <div class="absolute inset-0 pointer-events-none">
            <div class="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/15 blur-[140px] rounded-full"></div>
            <div class="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[140px] rounded-full"></div>
        </div>

        <!-- Toolbar / Selector -->
        <div class="relative z-30 mb-8 flex flex-wrap items-center justify-center gap-3 bg-slate-900/80 backdrop-blur-xl border border-white/10 p-2.5 rounded-2xl shadow-2xl">
            <button
                v-for="preset in presets"
                :key="preset.id"
                @click="selectPreset(preset)"
                class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                :class="currentPreset.id === preset.id ? 'bg-primary text-navy shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'"
            >
                <Icon :icon="preset.icon" class="text-sm" />
                <span>{{ preset.label }}</span>
            </button>
        </div>

        <!-- ── MOCKUP CANVAS WRAPPER ── -->
        <div class="relative z-20 w-full max-w-[1100px] flex items-center justify-center">
            
            <!-- 1. MOBILE SMARTPHONE FRAME -->
            <div v-if="currentPreset.device === 'mobile'" class="relative flex flex-col items-center">
                <!-- Ambient Device Back Glow -->
                <div class="absolute inset-4 rounded-[3.5rem] bg-gradient-to-tr from-primary/30 to-emerald-400/20 blur-2xl -z-10 transform scale-95"></div>

                <!-- Titanium Smartphone Bezel -->
                <div class="w-[340px] sm:w-[380px] aspect-[9/19.5] rounded-[3.2rem] bg-slate-900 border-[8px] border-slate-800/90 shadow-[0_25px_70px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col relative ring-1 ring-white/15">
                    
                    <!-- Dynamic Island / Top Bar -->
                    <div class="h-11 bg-slate-950 px-7 flex items-center justify-between z-30 shrink-0 select-none">
                        <span class="text-xs font-bold text-white tracking-tight">9:41</span>
                        <!-- Dynamic Island Pill -->
                        <div class="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 border border-white/5 shadow-inner">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/10"></span>
                            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                        <!-- Icons -->
                        <div class="flex items-center gap-1.5 text-white text-[11px]">
                            <Icon icon="ph:cell-signal-full-bold" />
                            <Icon icon="ph:wifi-high-bold" />
                            <Icon icon="ph:battery-charging-bold" />
                        </div>
                    </div>

                    <!-- Screen Image Content -->
                    <div class="flex-1 bg-slate-950 overflow-hidden relative group">
                        <img
                            :src="currentPreset.image"
                            :alt="currentPreset.title"
                            class="w-full h-full object-cover object-top"
                        />

                        <!-- Floating Feature Badge -->
                        <div v-if="currentPreset.badge" class="absolute top-4 right-4 z-20">
                            <span class="px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-black/70 text-white backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                {{ currentPreset.badge }}
                            </span>
                        </div>

                        <!-- Home Bar / Bottom Gesture Indicator -->
                        <div class="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-30 pointer-events-none"></div>
                    </div>
                </div>
            </div>

            <!-- 2. DESKTOP BROWSER FRAME -->
            <div v-else class="relative w-full max-w-[960px] flex flex-col items-center">
                <!-- Ambient Device Back Glow -->
                <div class="absolute inset-4 rounded-3xl bg-gradient-to-tr from-primary/20 to-emerald-400/15 blur-3xl -z-10 transform scale-95"></div>

                <!-- Modern Browser Window -->
                <div class="w-full rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-700/70 shadow-[0_30px_90px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative ring-1 ring-white/10">
                    
                    <!-- Window Header / Browser Bar -->
                    <div class="h-12 bg-slate-950/95 border-b border-white/10 px-5 flex items-center justify-between gap-4 z-30 shrink-0 select-none">
                        <!-- Traffic Light Dots -->
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-rose-500/90 shadow-sm shadow-rose-500/30"></span>
                            <span class="w-3 h-3 rounded-full bg-amber-500/90 shadow-sm shadow-amber-500/30"></span>
                            <span class="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm shadow-emerald-500/30"></span>
                        </div>

                        <!-- Pill URL Address Bar -->
                        <div class="flex-1 max-w-md mx-auto h-7 rounded-lg bg-white/5 border border-white/10 px-3 flex items-center justify-center gap-2 text-[11px] text-slate-300 font-mono">
                            <Icon icon="ph:lock-simple-fill" class="text-emerald-400 text-xs" />
                            <span class="truncate">{{ currentPreset.url || 'https://archeris.net/dashboard' }}</span>
                        </div>

                        <!-- Right Window Controls / Badge -->
                        <div class="flex items-center gap-2">
                            <span v-if="currentPreset.badge" class="px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase bg-primary/20 text-primary border border-primary/30">
                                {{ currentPreset.badge }}
                            </span>
                        </div>
                    </div>

                    <!-- Screen Image Content -->
                    <div class="relative w-full aspect-[16/10] bg-slate-950 overflow-hidden group">
                        <img
                            :src="currentPreset.image"
                            :alt="currentPreset.title"
                            class="w-full h-full object-cover object-top"
                        />
                    </div>
                </div>
            </div>

        </div>

        <!-- Info / Download helper -->
        <div class="mt-8 text-center text-slate-400 text-xs">
            <p class="font-bold text-white mb-1">{{ currentPreset.title }}</p>
            <p class="text-slate-500">{{ currentPreset.subtitle }} ({{ currentPreset.device.toUpperCase() }} MOCKUP)</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

definePageMeta({
    layout: 'empty'
})

const presets = [
    {
        id: 'eo-registration',
        label: '1. EO Registration',
        device: 'desktop',
        icon: 'ph:ticket-bold',
        title: 'Publikasi & Pendaftaran Turnamen',
        subtitle: 'Sisi EO — Online Event Registration & Payment Gateway',
        badge: 'EO REGISTRATION',
        url: 'https://archeris.net/dashboard/organizer/tournaments/create',
        image: '/features/feature_registration.png'
    },
    {
        id: 'eo-brackets',
        label: '2. EO Brackets & Target',
        device: 'desktop',
        icon: 'ph:tree-structure-bold',
        title: 'Manajemen Operasional & Bagan Eliminasi',
        subtitle: 'Sisi EO — Target Butt Manager & World Archery Brackets',
        badge: 'TOURNAMENT OPERATIONS',
        url: 'https://archeris.net/dashboard/organizer/tournaments/1/elimination',
        image: '/features/screenshot-4-brackets.png'
    },
    {
        id: 'archer-mobile',
        label: '3. Archer Mobile App',
        device: 'mobile',
        icon: 'ph:device-mobile-bold',
        title: 'Mobile App Khusus Atlet & E-Tiket',
        subtitle: 'Sisi Archer — 1-Tap Entry, Digital ID Pass & Analytics',
        badge: 'ARCHER MOBILE',
        image: '/features/feature_profile.png'
    },
    {
        id: 'sk-mobile',
        label: '4. Scorekeeper 3x4 Numpad',
        device: 'mobile',
        icon: 'ph:crosshair-simple-bold',
        title: 'Mobile App Wasit & Input Skor Lapangan',
        subtitle: 'Sisi Scorekeeper — Touch Numpad 3x4 Warna Target Face',
        badge: 'SCOREKEEPER LIVE',
        image: '/features/feature_scoring.png'
    }
]

const currentPreset = ref(presets[0])

const selectPreset = (preset) => {
    currentPreset.value = preset
}
</script>

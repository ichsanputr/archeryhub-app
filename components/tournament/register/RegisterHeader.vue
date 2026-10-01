<template>
    <div class="bg-navy text-white border-b border-navy/90 relative overflow-hidden">
        <div class="absolute inset-0 z-0">
            <picture>
                <source :srcset="event.banner_url || event.image || '/hero-homepage.webp'" type="image/webp" />
                <img
                    :src="event.banner_url || event.image || '/hero-homepage.webp'"
                    alt="Tournament Hero"
                    class="w-full h-full object-cover object-center" />
            </picture>
            <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/60"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent opacity-95"></div>
        </div>

        <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span class="text-xs sm:text-sm font-bold text-slate-300 block mb-1">
                        {{ isEn ? 'Tournament Registration' : 'Pendaftaran Turnamen' }}
                    </span>
                    <h1 class="text-xl sm:text-2xl font-black text-white tracking-tight">{{ event.name }}</h1>
                    <div class="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-300 font-medium">
                        <span class="flex items-center gap-1.5">
                            <Icon icon="ph:calendar-blank" class="text-primary text-base" />
                            <span>{{ displayValue(event.date) }}</span>
                        </span>
                        <span class="flex items-center gap-1.5">
                            <Icon icon="ph:map-pin" class="text-primary text-base" />
                            <span>{{ displayValue(event.location) }}</span>
                        </span>
                    </div>
                </div>

                <!-- Language Switcher in Hero Title Row with Iconify Flags -->
                <div class="flex items-center gap-1 bg-white/10 p-1 rounded-2xl border border-white/15 shrink-0 self-start sm:self-center shadow-xs">
                    <button
                        type="button"
                        @click="$emit('setLocaleLang', 'en')"
                        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
                        :class="isEn ? 'bg-primary text-navy font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-white/10'">
                        <Icon icon="circle-flags:us" class="text-base shrink-0" />
                        <span>EN</span>
                    </button>
                    <button
                        type="button"
                        @click="$emit('setLocaleLang', 'id')"
                        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
                        :class="!isEn ? 'bg-primary text-navy font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-white/10'">
                        <Icon icon="circle-flags:id" class="text-base shrink-0" />
                        <span>ID</span>
                    </button>
                </div>
            </div>

            <!-- 3-Step Guided Tabs -->
            <div class="mt-6 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 sm:gap-3">
                <button
                    type="button"
                    @click="$emit('goToStep', 1)"
                    class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-left"
                    :class="currentStep === 1 ? 'bg-white/10 text-white font-bold border border-primary/40 shadow-xs' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'">
                    <div class="size-7 rounded-lg flex items-center justify-center text-xs sm:text-sm shrink-0 font-black"
                        :class="currentStep === 1 ? 'bg-primary text-navy shadow-xs' : (currentStep > 1 ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300')">
                        <Icon v-if="currentStep > 1" icon="ph:check-bold" />
                        <span v-else>1</span>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="text-xs sm:text-sm font-bold leading-tight truncate">
                            {{ isEn ? 'Registration Type' : 'Tipe Pendaftaran' }}
                        </div>
                    </div>
                </button>

                <button
                    type="button"
                    @click="$emit('goToStep', 2)"
                    class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-left"
                    :class="currentStep === 2 ? 'bg-white/10 text-white font-bold border border-primary/40 shadow-xs' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'">
                    <div class="size-7 rounded-lg flex items-center justify-center text-xs sm:text-sm shrink-0 font-black"
                        :class="currentStep === 2 ? 'bg-primary text-navy shadow-xs' : (currentStep > 2 ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300')">
                        <Icon v-if="currentStep > 2" icon="ph:check-bold" />
                        <span v-else>2</span>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="text-xs sm:text-sm font-bold leading-tight truncate">
                            {{ isEn ? 'Select Categories' : 'Pilih Kategori' }}
                        </div>
                    </div>
                </button>

                <button
                    type="button"
                    @click="$emit('goToStep', 3)"
                    class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-left"
                    :class="currentStep === 3 ? 'bg-white/10 text-white font-bold border border-primary/40 shadow-xs' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'">
                    <div class="size-7 rounded-lg flex items-center justify-center text-xs sm:text-sm shrink-0 font-black"
                        :class="currentStep === 3 ? 'bg-primary text-navy shadow-xs' : 'bg-white/10 text-slate-300'">
                        <span>3</span>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="text-xs sm:text-sm font-bold leading-tight truncate">
                            {{ isEn ? 'Payment' : 'Pembayaran' }}
                        </div>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
const props = defineProps({
    event: {
        type: Object,
        default: () => ({})
    },
    currentStep: {
        type: Number,
        default: 1
    },
    isEn: {
        type: Boolean,
        default: false
    }
})

defineEmits(['goToStep', 'setLocaleLang'])

const displayValue = (val) => {
    if (!val) return '-'
    if (typeof val === 'string') return val
    if (typeof val === 'object') return val.id || val.en || '-'
    return String(val)
}
</script>

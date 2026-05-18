<template>
    <div class="space-y-5">
        <h2 class="text-lg font-extrabold text-navy">Pilihan Paket {{ packageTitle }}</h2>
        <div
            class="flex flex-col lg:flex-row overflow-hidden rounded-[32px] border border-gray-100 shadow-sm bg-white min-h-[500px]">
            <!-- Banner Highlight (Paket Elite) -->
            <div
                class="lg:w-4/12 bg-navy relative flex flex-col justify-center items-center px-8 py-16 text-center overflow-hidden text-white">
                <div class="relative z-10">
                    <span class="text-primary/60 font-black tracking-[0.3em] text-[10px] mb-4 block">
                        Direkomendasikan untuk {{ recommendationBadge }}
                    </span>
                    <h3 class="text-white text-3xl font-black leading-tight mb-4 tracking-tight">Paket Elite</h3>
                    <div class="h-1.5 w-24 bg-primary mx-auto mb-8 rounded-full"></div>
                    <p class="text-slate-400 text-sm font-medium max-w-[220px] mx-auto leading-relaxed">
                        {{ eliteDescription }}
                    </p>

                    <div class="mt-12 space-y-4">
                        <div class="flex items-center gap-3 justify-center text-primary/80">
                            <Icon icon="ph:crown-fill" class="text-xl" />
                            <span class="text-xs font-black tracking-widest text-white/80">Fitur
                                Premium</span>
                        </div>
                        <div class="flex items-center gap-3 justify-center text-primary/80">
                            <Icon icon="ph:shield-star-fill" class="text-xl" />
                            <span class="text-xs font-black tracking-widest text-white/80">Support
                                Prioritas</span>
                        </div>
                    </div>
                </div>
                <Icon icon="ph:trend-up-bold"
                    class="absolute -bottom-10 -right-10 text-[240px] text-white/5 rotate-12" />
            </div>

            <!-- Plan Selection Grid -->
            <div class="lg:w-8/12 p-8 md:p-12 flex flex-col justify-center bg-slate-50/20">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div v-for="plan in plans" :key="plan.id"
                        class="bg-white p-8 rounded-[24px] border-2 transition-all duration-300 flex flex-col relative group h-full shadow-sm"
                        :class="plan.isCurrent ? 'border-primary ring-8 ring-primary/5' : 'border-gray-100 hover:border-primary/20 hover:shadow-md'">

                        <div v-if="plan.isCurrent"
                            class="absolute -top-3 left-6 bg-navy text-btn-inverse text-[10px] font-black px-4 py-1.5 rounded-full capitalize tracking-widest shadow-sm">
                            Aktif
                        </div>

                        <div class="mb-6">
                            <div
                                class="size-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                                <Icon
                                    :icon="plan.name.toLowerCase().includes('elite') ? 'ph:crown-bold' : 'ph:sparkle-bold'"
                                    class="text-xl text-navy" />
                            </div>
                            <h4 class="text-[11px] font-black text-gray-400 tracking-[0.2em] mb-2">{{
                                plan.name }}</h4>
                            <div class="flex items-baseline gap-1">
                                <span class="text-3xl font-black text-navy">{{ plan.priceLabel }}</span>
                                <span class="text-[10px] font-bold text-gray-400 tracking-widest ml-1">/ {{
                                    plan.billing }}</span>
                            </div>
                        </div>

                        <ul class="space-y-3 mb-8 flex-1">
                            <li v-for="feat in plan.features" :key="feat" class="flex items-start gap-2.5 text-[12px]"
                                :class="plan.isCurrent ? 'text-navy font-bold' : 'text-navy/60 font-medium'">
                                <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                                <span>{{ feat }}</span>
                            </li>
                        </ul>

                        <button v-if="plan.isCurrent"
                            class="w-full py-4 text-[10px] font-black bg-slate-100 text-slate-400 rounded-2xl cursor-not-allowed tracking-widest border border-slate-200"
                            disabled>
                            Paket Aktif
                        </button>
                        <button v-else @click="$emit('select', plan)"
                            class="w-full py-4 text-[10px] font-black bg-navy text-white rounded-2xl hover:bg-primary hover:text-btn-text transition-all tracking-widest shadow-sm active:scale-95">
                            {{ plan.isUpgrade ? 'Upgrade Sekarang' : 'Pilih Paket' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
    packageTitle: String,
    recommendationBadge: String,
    eliteDescription: String,
    plans: Array
})

defineEmits(['select'])
</script>

<template>
    <div
        class="bg-gradient-to-r from-navy to-navy-light rounded-3xl p-8 relative overflow-hidden shadow-sm border border-white/10 group">
        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div class="text-center md:text-left max-w-xl">
                <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full mb-4">
                    <Icon icon="ph:sparkle-fill" class="text-primary text-sm" />
                    <span class="text-[10px] font-black text-primary tracking-widest">
                        {{ promoBadge }}
                    </span>
                </div>
                <h2 class="text-3xl font-black text-white mb-3">
                    {{ promoTitle }}
                </h2>
                <div class="text-slate-300 text-sm font-medium leading-relaxed">
                    {{ promoDesc }}
                    <span class="block mt-1 opacity-80">{{ t('subscription.promo.extra') }}</span>
                </div>
            </div>
            <div class="shrink-0 flex flex-col items-center">
                <div
                    class="size-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 border border-white/20 transform group-hover:rotate-12 transition-transform duration-500">
                    <Icon icon="ph:gift-bold" class="text-primary text-4xl" />
                </div>
                <div class="text-center">
                    <div class="text-white font-black text-lg">{{ savings }}</div>
                    <div class="text-white/50 text-[10px] font-bold tracking-widest">{{ t('subscription.promo.total_value') }}</div>
                </div>
            </div>
        </div>
        <!-- Abstract Shapes (Premium feel) -->
        <div class="absolute -right-20 -bottom-20 size-80 bg-primary/10 rounded-full blur-[100px]"></div>
        <div class="absolute -left-20 -top-20 size-80 bg-primary/5 rounded-full blur-[100px]"></div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import useDashboardI18n from '~/composables/useDashboardI18n'

const { t } = useDashboardI18n()

defineProps({
    promoBadge: String,
    promoTitle: String,
    promoDesc: String,
    savings: String
})
</script>

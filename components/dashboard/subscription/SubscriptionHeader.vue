<template>
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
                <div
                    class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                    <Icon icon="ph:crown-bold" class="text-primary text-2xl sm:text-3xl" />
                </div>
                <div>
                    <h1 class="text-xl sm:text-3xl font-black tracking-tight">Subscription Saya</h1>
                    <p class="text-slate-300 text-xs sm:text-sm font-medium mt-1 tracking-widest opacity-70">
                        {{ subTitle }}
                    </p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <div v-if="status === 'trial'"
                    class="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center gap-2">
                    <Icon icon="ph:clock-countdown-fill" class="text-primary text-lg" />
                    <span class="text-xs font-black text-white tracking-widest">Trial 3 Bulan Aktif</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
    status: String,
    subTitle: {
        type: String,
        default: 'Kelola paket, pemakaian, dan riwayat tagihan Anda.'
    }
})
</script>

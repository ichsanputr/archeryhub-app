<template>
    <!-- Expired Banner -->
    <div v-if="status === 'expired' || status === 'canceled'"
        class="relative overflow-hidden rounded-3xl border border-orange-200 bg-orange-50 shadow-sm">
        <div class="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 opacity-60"></div>
        <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="flex items-center gap-4">
                <div
                    class="size-12 sm:size-14 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center shrink-0">
                    <Icon icon="ph:warning-octagon-fill" class="text-orange-500 text-2xl sm:text-3xl" />
                </div>
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span
                            class="px-2.5 py-0.5 bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                            {{ status === 'expired' ? 'Kedaluwarsa' : 'Dibatalkan' }}
                        </span>
                    </div>
                    <h1 class="text-xl sm:text-2xl font-black text-orange-700 tracking-tight">Subscription Anda Tidak
                        Aktif
                    </h1>
                    <div class="text-orange-600/80 text-xs sm:text-sm font-medium mt-1">
                        Fitur premium tidak dapat diakses. Perbarui paket Anda untuk melanjutkan.
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-3 shrink-0">
                <NuxtLink to="/dashboard/subscription"
                    class="px-5 py-3 bg-navy text-primary hover:bg-navy/90 rounded-xl text-sm font-black transition-all shadow-lg shadow-navy/20 flex items-center gap-2">
                    <Icon icon="ph:crown-bold" />
                    Perbarui Sekarang
                </NuxtLink>
            </div>
        </div>
    </div>

    <!-- Normal Header (active / trial / default) -->
    <div v-else class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
        <div class="absolute inset-0"
            style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
        </div>
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
                    <div class="text-slate-300 text-xs sm:text-sm font-medium mt-1 tracking-widest opacity-70">
                        {{ subTitle }}
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <div v-if="status === 'trial'"
                    class="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center gap-2">
                    <Icon icon="ph:clock-countdown-fill" class="text-primary text-lg" />
                    <span class="text-xs font-black text-white tracking-widest">Trial 3 Bulan Aktif</span>
                </div>
                <div v-else-if="status === 'active'"
                    class="px-4 py-2 bg-green-500/20 backdrop-blur-md border border-green-400/30 rounded-xl flex items-center gap-2">
                    <Icon icon="ph:seal-check-fill" class="text-green-400 text-lg" />
                    <span class="text-xs font-black text-green-300 tracking-widest">Aktif</span>
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

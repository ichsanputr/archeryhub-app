<template>
    <!-- Expired Banner -->
    <div v-if="status === 'expired' || status === 'canceled'"
        class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-lg group">
        <!-- Premium Motif & Glow -->
        <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: 0.1;"></div>
        <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
        <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-red-500/5 blur-3xl"></div>

        <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="flex items-center gap-4">
                <div
                    class="size-12 sm:size-14 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-colors">
                    <Icon icon="ph:crown-bold" class="text-primary text-2xl sm:text-3xl animate-pulse" />
                </div>
                <div>
                    <div class="flex items-center gap-2 mb-1.5">
                        <span
                            class="px-2.5 py-0.5 bg-primary text-navy text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">
                            {{ status === 'expired' ? 'Kedaluwarsa' : 'Dibatalkan' }}
                        </span>
                        <div class="size-1.5 rounded-full bg-primary/40"></div>
                    </div>
                    <h1 class="text-xl sm:text-2xl font-black text-white tracking-tight">Subscription Anda Tidak Aktif
                    </h1>
                    <div class="text-slate-400 text-xs sm:text-sm font-medium mt-1">
                        Nikmati kembali akses penuh fitur premium dengan memperbarui paket Anda.
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-3 shrink-0">
                <NuxtLink to="/dashboard/subscription"
                    class="px-6 py-3.5 bg-primary hover:bg-white text-navy rounded-xl text-xs font-black transition-all shadow-xl shadow-primary/10 flex items-center gap-2 uppercase tracking-widest active:scale-95">
                    <Icon icon="ph:sketch-logo-fill" />
                    Pilih Paket Baru
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

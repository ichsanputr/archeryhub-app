<template>
    <section class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Current Plan Card -->
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div class="absolute top-4 right-4">
                <span
                    class="px-3 py-1 bg-primary/20 text-navy text-[10px] font-black uppercase tracking-widest rounded-full">
                    Aktif
                </span>
            </div>
            <h3 class="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6">Paket Saat Ini</h3>
            <div class="mb-6">
                <p class="text-3xl font-black text-navy mb-1">{{ planName }}</p>
                <p class="text-sm text-gray-500">Ditagih {{ billingCycle }}</p>
            </div>
            <div class="space-y-4 mb-6">
                <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-500">Harga</span>
                    <span class="font-bold text-navy">{{ priceLabel }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-500">Tagihan Berikutnya</span>
                    <span class="font-bold text-navy">{{ nextBilling || '-' }}</span>
                </div>
            </div>
        </div>

        <!-- Usage Stats Card -->
        <div class="xl:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 class="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6">Pemakaian & Batas</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Media Storage Usage -->
                <div class="space-y-3">
                    <div class="flex justify-between items-end">
                        <div>
                            <p class="text-xs font-black text-gray-400 uppercase tracking-widest">Penyimpanan Media</p>
                            <p class="text-sm font-black text-navy mt-1">{{ usageMedia.current }} / {{ usageMedia.limit
                            }}</p>
                        </div>
                        <span class="text-[10px] font-black text-primary">{{ usageMedia.percent }}%</span>
                    </div>
                    <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-navy rounded-full transition-all duration-1000"
                            :style="{ width: usageMedia.percent + '%' }"></div>
                    </div>
                </div>

                <!-- Members Usage (not shown for organizations) -->
                <div v-if="showMembers" class="space-y-3">
                    <div class="flex justify-between items-end">
                        <div>
                            <p class="text-xs font-black text-gray-400 uppercase tracking-widest">Total Anggota</p>
                            <p class="text-sm font-black text-navy mt-1">{{ usageMembers.current }} / {{
                                usageMembers.limit }}</p>
                        </div>
                        <span class="text-[10px] font-black text-primary">{{ usageMembers.percent }}%</span>
                    </div>
                    <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-primary rounded-full transition-all duration-1000"
                            :style="{ width: usageMembers.percent + '%' }"></div>
                    </div>
                </div>

                <!-- Time Remaining -->
                <div class="space-y-3">
                    <div class="flex justify-between items-end">
                        <div>
                            <p class="text-xs font-black text-gray-400 uppercase tracking-widest">Masa Aktif</p>
                            <p class="text-sm font-black text-navy mt-1">{{ remainingDaysLabel }}</p>
                        </div>
                        <Icon icon="ph:clock-countdown-bold" class="text-primary text-xl" />
                    </div>
                    <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-green-500 rounded-full transition-all duration-1000"
                            :style="{ width: expiryPercent + '%' }"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
    planName: String,
    billingCycle: String,
    priceLabel: String,
    nextBilling: String,
    usageMedia: Object,
    usageMembers: Object,
    remainingDaysLabel: String,
    expiryPercent: Number,
    showMembers: {
        type: Boolean,
        default: true
    }
})
</script>

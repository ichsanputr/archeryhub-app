<template>
    <section class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Current Plan Card -->
        <div class="bg-white p-6 rounded-2xl shadow-sm relative overflow-hidden"
            :class="isExpired ? 'border-2 border-red-200' : 'border border-gray-200'">
            <div class="absolute top-4 right-4">
                <span class="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full"
                    :class="isExpired ? 'bg-red-100 text-red-600' : 'bg-primary/20 text-navy'">
                    {{ isExpired ? 'Expired' : 'Aktif' }}
                </span>
            </div>
            <h3 class="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6">Paket Saat Ini</h3>
            <div class="mb-6">
                <p class="text-3xl font-black mb-1" :class="isExpired ? 'text-red-400' : 'text-navy'">{{ planName || '—'
                    }}</p>
                <p class="text-sm text-gray-500">Ditagih {{ billingCycle }}</p>
            </div>
            <div v-if="!isExpired" class="space-y-4 mb-6">
                <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-500">Harga</span>
                    <span class="font-bold text-navy">{{ priceLabel }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-500">Tagihan Berikutnya</span>
                    <span class="font-bold text-navy">{{ nextBilling || '-' }}</span>
                </div>
            </div>
            <div v-else class="mt-4">
                <NuxtLink to="/dashboard/subscription"
                    class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-black transition-all">
                    <Icon icon="ph:crown-bold" />
                    Perbarui Paket
                </NuxtLink>
            </div>
        </div>

        <!-- Usage Stats Card -->
        <div class="xl:col-span-2 bg-white p-6 rounded-2xl border shadow-sm"
            :class="isExpired ? 'border-red-100 opacity-60' : 'border-gray-200'">
            <h3 class="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6">Pemakaian &amp; Batas</h3>
            <div v-if="isExpired" class="flex flex-col items-center justify-center py-8 text-center gap-3">
                <Icon icon="ph:lock-bold" class="text-4xl text-red-300" />
                <p class="text-sm font-black text-red-400">Data pemakaian tidak tersedia</p>
                <p class="text-xs text-gray-400">Perbarui subscription untuk melihat statistik pemakaian Anda.</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
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
    isExpired: Boolean,
    showMembers: {
        type: Boolean,
        default: true
    }
})
</script>

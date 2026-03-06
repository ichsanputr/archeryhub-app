<template>
    <section class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Current Plan Card -->
        <div class="bg-white p-6 rounded-2xl shadow-sm relative overflow-hidden"
            :class="isExpired ? 'border-2 border-orange-200' : 'border border-gray-200'">
            <div class="absolute top-4 right-4">
                <span class="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full"
                    :class="isExpired ? 'bg-orange-100 text-orange-600' : 'bg-primary/20 text-navy'">
                    {{ isExpired ? 'Expired' : 'Aktif' }}
                </span>
            </div>
            <h3 class="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6">Paket Saat Ini</h3>
            <div class="mb-6">
                <div class="text-3xl font-black mb-1" :class="isExpired ? 'text-orange-600' : 'text-navy'">{{ planName
                    ||
                    '—'
                }}</div>
                <div class="text-sm text-gray-500">Ditagih {{ billingCycle }}</div>
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
                    class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-navy text-primary hover:bg-navy/90 rounded-xl text-sm font-black transition-all shadow-lg shadow-navy/20">
                    <Icon icon="ph:crown-bold" />
                    Perbarui Paket
                </NuxtLink>
            </div>
        </div>

        <!-- Usage Stats Card -->
        <div class="xl:col-span-2 bg-white p-6 rounded-2xl border shadow-sm"
            :class="isExpired ? 'border-orange-100 opacity-60' : 'border-gray-200'">
            <h3 class="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6">Pemakaian &amp; Batas</h3>
            <div v-if="isExpired" class="flex flex-col items-center justify-center py-8 text-center gap-3">
                <Icon icon="ph:lock-bold" class="text-4xl text-orange-300" />
                <div class="text-sm font-black text-orange-400">Data pemakaian tidak tersedia</div>
                <div class="text-xs text-gray-400">Perbarui subscription untuk melihat statistik pemakaian Anda.</div>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Media Storage Usage -->
                <div class="space-y-3">
                    <div class="flex justify-between items-end">
                        <div>
                            <div class="text-xs font-black text-gray-400 uppercase tracking-widest">Penyimpanan Media
                            </div>
                            <div class="text-sm font-black text-navy mt-1">{{ usageMedia.current }} / {{
                                usageMedia.limit
                            }}</div>
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
                            <div class="text-xs font-black text-gray-400 uppercase tracking-widest">Total Anggota</div>
                            <div class="text-sm font-black text-navy mt-1">{{ usageMembers.current }} / {{
                                usageMembers.limit }}</div>
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
                            <div class="text-xs font-black text-gray-400 uppercase tracking-widest">Masa Aktif</div>
                            <div class="text-sm font-black text-navy mt-1">{{ remainingDaysLabel }}</div>
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

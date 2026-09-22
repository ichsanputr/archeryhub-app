<template>
    <section class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Current Plan Card -->
        <div class="bg-white p-6 rounded-2xl shadow-sm relative overflow-hidden group transition-all"
            :class="isExpired ? 'border-2 border-primary/20 ring-4 ring-primary/5' : 'border border-gray-200 hover:border-primary/30'">
            <div class="absolute top-4 right-4">
                <span class="px-3 py-1 text-[10px] font-black tracking-widest rounded-full"
                    :class="isExpired ? 'bg-red-50 text-red-700 border border-red-200/80' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'">
                    {{ isExpired ? t('subscription.status.expired') : t('subscription.status.active') }}
                </span>
            </div>
            <h3 class=" text-xs font-black text-gray-500 tracking-widest mb-6">{{ t('subscription.status.current_plan_title') }}</h3>
            <div class="mb-6">
                <div class="text-3xl font-black mb-1 group-hover:text-primary transition-colors"
                    :class="isExpired ? 'text-primary' : 'text-navy'">{{ planName ||
                        '—'
                    }}</div>
                <div class="text-sm text-gray-500">{{ t('subscription.status.billed') }} {{ billingCycle }}</div>
            </div>
            <div v-if="!isExpired" class="space-y-4 mb-6">
                <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-500">{{ t('subscription.status.price') }}</span>
                    <span class="font-bold text-navy">{{ priceLabel }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-500">{{ t('subscription.status.next_billing') }}</span>
                    <span class="font-bold text-navy">{{ nextBilling || '-' }}</span>
                </div>
            </div>
            <div v-else class="mt-4">
                <NuxtLink :to="`/dashboard/${userPersona}/package`"
                    class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-navy text-primary hover:bg-white hover:text-navy border border-navy rounded-xl text-xs font-black transition-all shadow-xl shadow-navy/10 tracking-widest active:scale-95">
                    <Icon icon="ph:sketch-logo-bold" />
                    {{ t('subscription.header.choose_new') }}
                </NuxtLink>
            </div>
        </div>

        <!-- Usage Stats Card -->
        <div class="xl:col-span-2 bg-white p-6 rounded-2xl border shadow-sm transition-all"
            :class="isExpired ? 'border-primary/10 opacity-70 group' : 'border-gray-200 hover:border-primary/20'">
            <h3 class=" text-xs font-black text-gray-500 tracking-widest mb-6">{{ t('subscription.usage.title') }}</h3>
            <div v-if="isExpired" class="flex flex-col items-center justify-center py-8 text-center gap-3">
                <div
                    class="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-2 transform group-hover:rotate-6 transition-transform">
                    <Icon icon="ph:lock-keyhole-fill" class="text-4xl text-primary" />
                </div>
                <div class="text-sm font-black text-navy tracking-widest">{{ t('subscription.usage.locked') }}</div>
                <div class="text-xs text-gray-400 font-medium leading-relaxed">{{ t('subscription.usage.unlock_message') }}</div>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Media Storage Usage -->
                <div class="space-y-3">
                    <div class="flex justify-between items-end">
                        <div>
                            <div class="text-xs font-black text-gray-400 tracking-widest">{{ t('subscription.usage.media_storage') }}
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

                <!-- Members Usage (not shown for organizers) -->
                <div v-if="showMembers" class="space-y-3">
                    <div class="flex justify-between items-end">
                        <div>
                            <div class="text-xs font-black text-gray-400 tracking-widest">{{ memberLabel || t('subscription.usage.total_members') }}</div>
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
                            <div class="text-xs font-black text-gray-400 tracking-widest">{{ t('subscription.usage.active_period') }}</div>
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

import useDashboardI18n from '~/composables/useDashboardI18n'

const { t } = useDashboardI18n()

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
    memberLabel: String,
    showMembers: {
        type: Boolean,
        default: true
    }
})
</script>

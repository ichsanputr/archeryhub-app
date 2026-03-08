<template>
    <div class="space-y-8">
        <!-- Header Section -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <!-- Decorative Background Elements -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                    <div
                        class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                        <Icon icon="ph:files-bold" class="text-primary text-2xl sm:text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-3xl font-black tracking-tight">Pusat Laporan</h1>
                        <p class="text-slate-300 text-xs sm:text-sm font-medium mt-1">Pilih jenis laporan yang ingin
                            Anda analisis</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Reports Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <template v-for="report in reports" :key="report.title">
                <NuxtLink v-if="!report.isLocked" :to="report.link"
                    class="group bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary transition-all duration-300 relative overflow-hidden flex flex-col h-full">
                    <!-- Subtle Hover Glow -->
                    <div
                        class="absolute -right-10 -top-10 size-40 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    </div>

                    <div class="relative z-10">
                        <div
                            class="size-16 rounded-2xl bg-slate-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-sm">
                            <Icon :icon="report.icon" class="text-3xl text-navy" />
                        </div>

                        <h3 class="text-xl font-black text-navy mb-3">{{ report.title }}</h3>
                        <p class="text-gray-500 text-sm font-medium leading-relaxed mb-8">
                            {{ report.description }}
                        </p>
                    </div>

                    <div
                        class="mt-auto flex items-center justify-between pt-6 border-t border-gray-50 group-hover:border-primary/10 transition-colors">
                        <span
                            class="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-navy transition-colors">
                            Buka Laporan
                        </span>
                        <div
                            class="size-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary transition-all duration-300 group-hover:translate-x-1">
                            <Icon icon="ph:arrow-right-bold" class="text-navy text-sm" />
                        </div>
                    </div>
                </NuxtLink>

                <!-- Locked State -->
                <div v-else @click="openPremiumModal(report)"
                    class="group bg-gray-50/50 rounded-[32px] p-8 border border-gray-100 shadow-none cursor-pointer hover:border-amber-200 transition-all duration-300 relative overflow-hidden flex flex-col h-full opacity-70 grayscale-[0.5]">
                    <div class="relative z-10">
                        <div
                            class="size-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mb-6 shadow-sm">
                            <Icon :icon="report.icon" class="text-3xl text-gray-400" />
                        </div>

                        <div class="flex items-center gap-2 mb-3">
                            <h3 class="text-xl font-black text-gray-600">{{ report.title }}</h3>
                            <Icon icon="ph:lock-key-bold" class="text-amber-500 text-lg" />
                        </div>
                        <p class="text-gray-400 text-sm font-medium leading-relaxed mb-8">
                            {{ report.description }}
                        </p>
                    </div>

                    <div class="mt-auto flex items-center justify-between pt-6 border-t border-gray-200/50">
                        <div
                            class="flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Icon icon="ph:crown" />
                            <span>Fitur Premium</span>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <PremiumRequiredModal v-model:show="showPremiumModal" :feature="premiumFeature" />

    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useSubscription } from '~/composables/useSubscription'

definePageMeta({
    layout: 'dashboard'
})

const { isSubscriptionActive, canAccessAnalytics, isElite } = useSubscription()
const showPremiumModal = ref(false)
const premiumFeature = ref('analytics')

const openPremiumModal = (report) => {
    if (!isSubscriptionActive.value) {
        premiumFeature.value = 'active_subscription'
    } else {
        premiumFeature.value = 'analytics'
    }
    showPremiumModal.value = true
}

const reports = computed(() => {
    const isActive = isSubscriptionActive.value
    const isElitePlan = isElite.value

    return [
        {
            title: 'Laporan Keuangan',
            description: 'Kelola kas organisasi, iuran bulanan, pendapatan turnamen, and pengeluaran operasional secara detail.',
            icon: 'ph:money-bold',
            link: '/dashboard/organization/reports/finance',
            isLocked: !isActive
        }
    ]
})

useSeoMeta({
    title: 'Pusat Laporan - Archeryhub.id',
    description: 'Analisis dan pantau performa organisasi Anda dengan laporan komprehensif dari Archeryhub.id.'
})
</script>

<style scoped>
.font-display {
    font-family: 'Lexend', sans-serif;
}
</style>

<template>
    <div class="space-y-8">
        <!-- Club Header -->
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
                        <Icon icon="ph:house-line-bold" class="text-primary text-2xl sm:text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-3xl font-black tracking-tight">{{ dashboardTitle }}</h1>
                        <p class="text-slate-300 text-xs sm:text-sm font-medium mt-1">Monitoring performa dan manajemen
                            anggota
                            klub secara real-time</p>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <NuxtLink :to="canAddMember ? '/dashboard/club/members/create' : undefined"
                        @click="!canAddMember && (showPremiumModal = true)" class="w-full sm:w-auto">
                        <BaseButton variant="primary" icon="ph:user-plus-bold"
                            class="w-full h-10 sm:h-11 px-6 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-xs"
                            :class="{ 'opacity-50 grayscale cursor-not-allowed': !canAddMember }">
                            Tambah Anggota
                        </BaseButton>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <PremiumRequiredModal v-model:show="showPremiumModal" :feature="premiumModalFeature" />

        <!-- Club Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div v-for="stat in clubStats" :key="stat.label"
                class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-sm transition-all group">
                <div class="flex justify-between items-start mb-4">
                    <div
                        class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-btn-text transition-colors">
                        <Icon :icon="stat.icon" class="text-2xl" />
                    </div>
                    <span class="text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                </div>
                <div>
                    <p class="text-gray-400 text-[10px] font-black  tracking-widest mb-1">{{ stat.label }}</p>
                    <p class="text-navy text-3xl font-black tracking-tight">{{ stat.value }}</p>
                    <p class="text-gray-500 text-xs mt-2 font-medium">{{ stat.desc }}</p>
                </div>
            </div>
        </div>

        <!-- Main Info for Club -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Upcoming Tournaments -->
            <div
                class="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div class="p-5 border-b border-gray-50 flex items-center justify-between">
                    <h3 class="font-black text-navy flex items-center gap-2">
                        <Icon icon="ph:calendar-star-bold" class="text-primary" />
                        Event Mendatang
                    </h3>
                    <BaseButton variant="ghost" size="xs">Lihat Semua</BaseButton>
                </div>
                <div class="p-5 space-y-4 flex-1">
                    <div v-for="event in upcomingClubTournaments" :key="event.id"
                        class="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/30 transition-all cursor-pointer group">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-12 h-12 rounded-lg bg-white border border-gray-100 flex flex-col items-center justify-center shrink-0">
                                <span class="text-[10px] font-black text-primary ">{{ event.date.split(' ')[1] }}</span>
                                <span class="text-lg font-black text-navy leading-none">{{ event.date.split(' ')[0]
                                }}</span>
                            </div>
                            <div>
                                <h4 class="font-bold text-navy group-hover:text-primary transition-colors">{{ event.name
                                }}</h4>
                                <p class="text-xs text-gray-500">{{ event.status }}</p>
                            </div>
                        </div>
                        <Icon icon="ph:arrow-right-bold"
                            class="text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                    </div>

                    <div v-if="!upcomingClubTournaments.length" class="text-center py-10">
                        <Icon icon="ph:calendar-blank" class="text-4xl text-gray-200 mx-auto mb-2" />
                        <p class="text-gray-400 text-sm">Belum ada turnamen terdaftar</p>
                    </div>
                </div>
            </div>

            <!-- Quick Actions & New Members -->
            <div class="space-y-6">

                <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <h3 class="font-black text-navy mb-4 text-xs  tracking-[0.2em] flex items-center gap-2">
                        <Icon icon="ph:user-plus-bold" class="text-primary" />
                        Anggota Terbaru
                    </h3>
                    <div class="space-y-4">
                        <div v-for="(member, index) in recentMembers" :key="index" class="flex items-center gap-3">
                            <div
                                class="w-9 h-9 rounded-full bg-navy flex items-center justify-center overflow-hidden shrink-0">
                                <img :src="useImageOrDefault(member.avatar_url || member.photo_url, member.name)"
                                    class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-bold text-navy truncate">{{ member.name }}</p>
                                <p class="text-[10px] text-gray-400  tracking-tighter">{{ member.joinDate }}</p>
                            </div>
                            <span
                                :class="member.status === 'Active' ? 'text-green-500 bg-green-50' : 'text-amber-500 bg-amber-50'"
                                class="text-[9px] font-black px-2 py-0.5 rounded-full ">{{ member.status }}</span>
                        </div>
                    </div>
                    <NuxtLink to="/dashboard/club/members"
                        class="block w-full text-center mt-5 text-xs font-bold text-gray-400 hover:text-primary transition-colors">
                        Lihat Semua Anggota
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useSubscription } from '~/composables/useSubscription'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Dashboard Klub - ArcheryHub'
})

const api = useApi()
const toast = useToast()
const { user } = useAuth()
const { isSubscriptionActive, canAddMember } = useSubscription()

const showPremiumModal = ref(false)
const premiumModalFeature = computed(() => {
    if (!isSubscriptionActive.value) return 'active_subscription'
    return 'member_limit'
})

const isLoadingClubData = ref(false)
const clubStatsData = ref(null)
const clubRecentMembers = ref([])
const clubUpcomingTournaments = ref([])

onMounted(async () => {
    await fetchClubDashboardData()
})

const fetchClubDashboardData = async () => {
    isLoadingClubData.value = true
    try {
        const res = await api.get('/clubs/dashboard/stats')
        if (res.data) {
            clubStatsData.value = res.data.stats
            clubRecentMembers.value = res.data.recentMembers || []
            clubUpcomingTournaments.value = res.data.upcomingTournaments || []
        }
    } catch (error) {
        console.error('Failed to fetch club dashboard data:', error)
    } finally {
        isLoadingClubData.value = false
    }
}

const clubStats = computed(() => [
    { label: 'Total Anggota', value: clubStatsData.value?.totalMembers || '0', icon: 'ph:users-three', desc: 'Total terdaftar' },
    { label: 'Pemanah Aktif', value: clubStatsData.value?.activeArchers || '0', icon: 'ph:user-focus', desc: 'Status aktif' },
    { label: 'Event Mendatang', value: clubStatsData.value?.upcomingEvents || '0', icon: 'ph:calendar-star', desc: 'Turnamen nasional' },
    { label: 'Prestasi', value: clubStatsData.value?.totalAwards || '0', icon: 'ph:medal', desc: 'Total medali' },
])

const recentMembers = computed(() => clubRecentMembers.value)
const upcomingClubTournaments = computed(() => clubUpcomingTournaments.value)

const dashboardTitle = computed(() => user.value?.full_name || 'Panel Kontrol Klub')
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Profile Banner -->
        <section class="relative h-48 md:h-64 bg-gradient-to-r from-navy to-blue-900 overflow-hidden">
            <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10">
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent"></div>
        </section>

        <!-- Profile Header Card -->
        <section class="container mx-auto px-4 max-w-5xl -mt-20 relative z-10 mb-8">
            <div class="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                <div class="p-6 md:p-10">
                    <div class="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                        <!-- Avatar -->
                        <div class="relative group">
                            <div
                                class="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-slate-100">
                                <img v-if="userProfile.avatarUrl" :src="userProfile.avatarUrl"
                                    :alt="userProfile.fullName" class="w-full h-full object-cover" />
                                <div v-else
                                    class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                                    <Icon icon="ph:user-bold" class="text-5xl text-gray-400" />
                                </div>
                            </div>
                            <div v-if="userProfile.verified"
                                class="absolute bottom-2 right-2 w-8 h-8 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg"
                                title="Verified Archer">
                                <Icon icon="ph:seal-check-fill" class="text-white text-sm" />
                            </div>
                        </div>

                        <!-- Basic Info -->
                        <div class="flex-1">
                            <h1 class="text-3xl md:text-4xl font-black text-navy mb-2">{{ userProfile.fullName }}</h1>
                            <p
                                class="text-slate-500 font-bold mb-4 flex items-center justify-center md:justify-start gap-2">
                                <span class="text-primary">@{{ userProfile.username }}</span>
                                <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span class="text-xs uppercase tracking-wider">{{ userProfile.division }}</span>
                            </p>

                            <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                                <div
                                    class="flex items-center gap-1.5 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 text-slate-600 text-sm font-bold transition-all hover:bg-gray-100">
                                    <Icon icon="ph:calendar-bold" class="text-primary" />
                                    Gabung {{ userProfile.joinedDate }}
                                </div>
                                <NuxtLink v-if="userProfile.club" :to="`/clubs/${userProfile.club.slug}`"
                                    class="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-xl text-sm font-bold shadow-lg shadow-navy/20 hover:scale-105 transition-all">
                                    <Icon icon="ph:users-three-bold" class="text-primary" />
                                    {{ userProfile.club.name }}
                                </NuxtLink>
                                <div v-else
                                    class="text-xs text-slate-400 font-bold uppercase tracking-widest px-4 py-2 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    Free Agent
                                </div>
                            </div>

                            <p class="text-slate-600 leading-relaxed max-w-2xl text-lg">{{ userProfile.bio }}</p>
                        </div>

                        <!-- Actions (Placeholder) -->
                        <div class="flex md:flex-col gap-3">
                            <BaseButton variant="primary" icon="ph:share-network-bold">Bagikan</BaseButton>
                            <BaseButton v-if="isOwnProfile" variant="outline" icon="ph:pencil-simple-bold"
                                to="/dashboard/settings">Edit Profil</BaseButton>
                        </div>
                    </div>
                </div>

                <!-- Stats Bar -->
                <div class="grid grid-cols-2 lg:grid-cols-4 border-t border-gray-100 bg-gray-50/50">
                    <div v-for="stat in profileStats" :key="stat.label"
                        class="p-6 text-center border-r border-gray-100 last:border-0">
                        <p class="text-3xl font-black text-navy mb-1">{{ stat.value }}</p>
                        <div
                            class="flex items-center justify-center gap-1 text-slate-400 text-xs font-bold uppercase tracking-widest">
                            <Icon :icon="stat.icon" class="text-sm" />
                            {{ stat.label }}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Detail Content -->
        <section class="container mx-auto px-4 max-w-5xl pb-16">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left: Achievements & Equipment -->
                <div class="space-y-6">
                    <!-- Achievements -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 class="font-black text-navy mb-5 flex items-center gap-2">
                            <Icon icon="ph:medal-bold" class="text-primary" />
                            Prestasi
                        </h3>
                        <div class="space-y-4">
                            <div v-for="medali in userProfile.medals" :key="medali.title"
                                class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-500 font-black text-xl">
                                    {{ medali.emoji }}
                                </div>
                                <div>
                                    <p class="text-sm font-black text-navy leading-tight">{{ medali.title }}</p>
                                    <p class="text-[10px] text-slate-400 font-bold uppercase">{{ medali.event }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Equipment -->
                    <div class="bg-navy rounded-2xl p-6 shadow-xl text-white">
                        <h3 class="font-black mb-5 flex items-center gap-2">
                            <Icon icon="ph:bow-arrow-bold" class="text-primary" />
                            Gear & Setup
                        </h3>
                        <div class="space-y-3">
                            <div v-for="(gear, type) in userProfile.equipment" :key="type"
                                class="bg-white/5 p-4 rounded-xl border border-white/10">
                                <p class="text-[10px] text-slate-400 font-bold uppercase mb-1">{{ type }}</p>
                                <p class="text-sm font-black text-white">{{ gear }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right: Recent Activity / Tournament Results -->
                <div class="lg:col-span-2 space-y-6">
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <h3 class="font-black text-navy text-xl mb-6 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon icon="ph:activity-bold" class="text-xl text-primary" />
                            </div>
                            Riwayat Turnamen
                        </h3>

                        <div class="space-y-4">
                            <div v-for="event in userProfile.events" :key="event.id"
                                class="flex items-center gap-5 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-primary/30 transition-all group cursor-pointer">
                                <div
                                    class="w-14 h-14 rounded-xl bg-navy flex flex-col items-center justify-center text-white shrink-0">
                                    <span class="text-[10px] uppercase font-bold text-primary">{{ event.month }}</span>
                                    <span class="text-lg font-bold leading-none">{{ event.day }}</span>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4
                                        class="font-black text-navy text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
                                        {{ event.name }}</h4>
                                    <p class="text-sm text-slate-400 font-medium">Rank #{{ event.rank }} • {{
                                        event.division }}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-2xl font-black text-navy leading-none">{{ event.score }}</p>
                                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Skor
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
    layout: 'landing'
})

const route = useRoute()
const { user, isLoggedIn } = useAuth()
const slug = route.params.slug

const isOwnProfile = computed(() => {
    return isLoggedIn.value && user.value?.username === slug
})

// Dummy Data
const userProfile = ref({
    fullName: 'Arif Dwi Pangestu',
    username: 'arifdp',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcgAI-cKVqB-rFvg63jv5RqEiFblqdw595CXHY_R7cP1SzEvLj9RApZNYpesTGKW4hnP6dODFBORzsQz0VTfOAeoUYNYWc66Rf-yAuUMyNAA2_feDvo-BF1MCVdcMHo0CJNnE5nLwPtWxfvnSOcil9PLAyYxZ56fuEWoyVFIc05X2iy2UqUQ5lNWaZZ6_e7XIc0IsvLCNI8qHt3-Z3Y-kccrkuHvLLZ1FVuFXdTt8f1fPfb-RIIZpqmeTGSo32A8PCc9Zn-1ij28M',
    division: 'Recurve Men',
    joinedDate: 'Januari 2023',
    verified: true,
    bio: 'Atlet panahan profesional Indonesia. Berfokus pada divisi Recurve dengan target Olimpiade 2024. Selalu percaya bahwa konsistensi adalah kunci dari akurasi.',
    club: {
        name: 'PB Perpani',
        slug: 'pb-perpani'
    },
    medals: [
        { title: 'Gold Medal', event: 'SEA Games 2023', emoji: '🥇' },
        { title: 'Silver Medal', event: 'Asian Grand Prix 2023', emoji: '🥈' },
        { title: 'Qualified', event: 'Olympics Paris 2024', emoji: '🎯' }
    ],
    equipment: {
        'Riser': 'Hoyt Formula Xi',
        'Limbs': 'Wiawis NS-G Graphene',
        'Sight': 'Shibuya Ultima CPX II',
        'Arrows': 'Easton X10 450'
    },
    events: [
        { id: 1, name: 'Kejuaraan Nasional 2024', month: 'JAN', day: '15', rank: 1, division: 'Recurve Men', score: 685 },
        { id: 2, name: 'Piala Gubernur DKI', month: 'DES', day: '05', rank: 2, division: 'Recurve Men', score: 672 },
        { id: 3, name: 'Jakarta Open 2023', month: 'NOV', day: '20', rank: 3, division: 'Recurve Men', score: 668 }
    ]
})

const profileStats = [
    { label: 'Turnamen', value: '24', icon: 'ph:trophy-bold' },
    { label: 'Avg. Score', value: '342', icon: 'ph:chart-bar-bold' },
    { label: 'Peringkat', value: '#1', icon: 'ph:ranking-bold' },
    { label: 'Member', value: '1y+', icon: 'ph:clock-bold' }
]

useSeoMeta({
    title: () => `${userProfile.value.fullName} (@${userProfile.value.username}) - Archeryhub.id`,
    description: () => userProfile.value.bio
})
</script>

<style scoped>
.font-display {
    font-family: 'Lexend', sans-serif;
}
</style>

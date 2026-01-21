<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Club Banner -->
        <section class="relative h-64 md:h-80 bg-gradient-to-br from-navy to-blue-900 overflow-hidden">
            <img v-if="club.bannerUrl" :src="club.bannerUrl" class="w-full h-full object-cover opacity-50" />
            <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent"></div>
        </section>

        <!-- Club Header -->
        <section class="container mx-auto px-4 max-w-7xl -mt-20 relative z-10 mb-8">
            <div class="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8">
                <div class="flex flex-col md:flex-row gap-6">
                    <!-- Logo -->
                    <div
                        class="w-28 h-28 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden flex-shrink-0 -mt-16 md:-mt-20">
                        <div v-if="!club.logoUrl"
                            class="w-full h-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center">
                            <span class="text-4xl font-black text-navy">{{ club.name.charAt(0) }}</span>
                        </div>
                        <img v-else :src="club.logoUrl" class="w-full h-full object-cover" />
                    </div>

                    <!-- Info -->
                    <div class="flex-1">
                        <div class="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <div class="flex items-center gap-3 mb-2">
                                    <h1 class="text-2xl md:text-3xl font-black text-navy">{{ club.name }}</h1>
                                    <span v-if="club.verified"
                                        class="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                                        <Icon icon="ph:seal-check-fill" />
                                        Verified
                                    </span>
                                </div>
                                <div class="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
                                    <span class="flex items-center gap-1">
                                        <Icon icon="ph:map-pin" />
                                        {{ club.city }}, {{ club.province }}
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <Icon icon="ph:calendar" />
                                        Berdiri {{ club.established }}
                                    </span>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex gap-3">
                                <BaseButton v-if="!isMember && isArcher" variant="primary" size="lg" icon="ph:plus-bold"
                                    :loading="isJoining" @click="joinClub">
                                    Gabung Klub
                                </BaseButton>
                                <span v-else-if="isMember"
                                    class="px-4 py-2 bg-green-50 text-green-600 font-bold text-sm rounded-xl flex items-center gap-2">
                                    <Icon icon="ph:check-circle-fill" />
                                    Anggota
                                </span>
                                <BaseButton variant="white" icon="ph:share-network">
                                    Bagikan
                                </BaseButton>
                            </div>
                        </div>

                        <!-- Stats -->
                        <div class="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-gray-100">
                            <div class="text-center">
                                <p class="text-2xl font-black text-navy">{{ club.memberCount }}</p>
                                <p class="text-xs text-gray-400 font-medium">Anggota</p>
                            </div>
                            <div class="h-8 w-px bg-gray-200"></div>
                            <div class="text-center">
                                <p class="text-2xl font-black text-navy">{{ club.eventCount }}</p>
                                <p class="text-xs text-gray-400 font-medium">Event</p>
                            </div>
                            <div class="h-8 w-px bg-gray-200"></div>
                            <div class="text-center">
                                <div class="flex items-center justify-center gap-1">
                                    <Icon icon="ph:star-fill" class="text-amber-400" />
                                    <p class="text-2xl font-black text-navy">{{ club.rating }}</p>
                                </div>
                                <p class="text-xs text-gray-400 font-medium">Rating</p>
                            </div>
                            <div class="h-8 w-px bg-gray-200"></div>
                            <div class="text-center">
                                <p class="text-2xl font-black text-navy">{{ club.achievements }}</p>
                                <p class="text-xs text-gray-400 font-medium">Prestasi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Main Content -->
        <section class="container mx-auto px-4 max-w-7xl pb-12">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Column -->
                <div class="lg:col-span-2 space-y-8">
                    <!-- About -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 class="font-bold text-navy text-lg mb-4 flex items-center gap-2">
                            <Icon icon="ph:info" class="text-primary" />
                            Tentang Klub
                        </h2>
                        <p class="text-gray-600 leading-relaxed">{{ club.description }}</p>

                        <!-- Facilities -->
                        <div class="mt-6 pt-6 border-t border-gray-100">
                            <h3 class="font-bold text-navy text-sm mb-4">Fasilitas</h3>
                            <div class="flex flex-wrap gap-2">
                                <span v-for="facility in club.facilities" :key="facility"
                                    class="px-3 py-1.5 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg">
                                    {{ facility }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Events -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 class="font-bold text-navy text-lg mb-4 flex items-center gap-2">
                            <Icon icon="ph:trophy" class="text-primary" />
                            Event Terbaru
                        </h2>
                        <div class="space-y-4">
                            <div v-for="event in club.recentEvents" :key="event.id"
                                class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                                <div
                                    class="w-12 h-12 rounded-lg bg-navy flex items-center justify-center text-primary shrink-0">
                                    <Icon icon="ph:trophy" class="text-xl" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-bold text-navy truncate">{{ event.name }}</h4>
                                    <p class="text-sm text-gray-400">{{ event.date }}</p>
                                </div>
                                <span class="px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded">{{
                                    event.result }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Top Members -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 class="font-bold text-navy text-lg mb-4 flex items-center gap-2">
                            <Icon icon="ph:medal" class="text-primary" />
                            Anggota Unggulan
                        </h2>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div v-for="member in club.topMembers" :key="member.id"
                                class="text-center p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                <div
                                    class="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-3 flex items-center justify-center">
                                    <Icon icon="ph:user" class="text-2xl text-gray-300" />
                                </div>
                                <h4 class="font-bold text-navy text-sm truncate">{{ member.name }}</h4>
                                <p class="text-xs text-gray-400">{{ member.division }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                    <!-- Contact Card -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 class="font-bold text-navy mb-4">Kontak</h3>
                        <div class="space-y-4">
                            <div class="flex items-center gap-3 text-sm">
                                <div class="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                                    <Icon icon="ph:phone" class="text-gray-400" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs">Telepon</p>
                                    <p class="font-medium text-navy">{{ club.phone }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3 text-sm">
                                <div class="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                                    <Icon icon="ph:envelope" class="text-gray-400" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs">Email</p>
                                    <p class="font-medium text-navy">{{ club.email }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3 text-sm">
                                <div class="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                                    <Icon icon="ph:map-pin" class="text-gray-400" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs">Alamat</p>
                                    <p class="font-medium text-navy">{{ club.address }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Training Schedule -->
                    <div class="bg-navy rounded-2xl p-6 text-white">
                        <h3 class="font-bold mb-4 flex items-center gap-2">
                            <Icon icon="ph:calendar" class="text-primary" />
                            Jadwal Latihan
                        </h3>
                        <div class="space-y-3">
                            <div v-for="schedule in club.schedules" :key="schedule.day"
                                class="flex justify-between items-center text-sm bg-white/5 p-3 rounded-xl">
                                <span class="font-medium">{{ schedule.day }}</span>
                                <span class="text-primary font-bold">{{ schedule.time }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Map Placeholder -->
                    <div class="bg-gray-200 rounded-2xl h-48 flex items-center justify-center">
                        <Icon icon="ph:map-trifold" class="text-4xl text-gray-400" />
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'landing'
})

const route = useRoute()
const router = useRouter()
const { isLoggedIn, user } = useAuth()
const toast = useToast()

const isJoining = ref(false)

// Check if user is archer
const isArcher = computed(() => {
    return isLoggedIn.value && (user.value?.role === 'archer' || user.value?.type === 'archer')
})

// Check if already a member (would be from API)
const isMember = ref(false)

// Dummy club data
const club = ref({
    id: 1,
    name: 'Garuda Archery Club',
    slug: 'garuda-archery',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    established: '2018',
    bannerUrl: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=1600',
    logoUrl: null,
    verified: true,
    memberCount: 45,
    eventCount: 12,
    rating: 4.9,
    achievements: 8,
    description: 'Garuda Archery Club adalah klub panahan profesional yang berdiri sejak 2018. Kami menyediakan pelatihan untuk berbagai level dari pemula hingga profesional dengan fokus pada pengembangan teknik dan mental.',
    facilities: ['Lapangan Indoor 18m', 'Lapangan Outdoor 70m', 'Ruang Peralatan', 'Ruang Ganti', 'Parkir Luas'],
    phone: '021-1234567',
    email: 'info@garudaarchery.com',
    address: 'Jl. Panahan No. 123, Senayan, Jakarta Selatan',
    schedules: [
        { day: 'Senin - Rabu', time: '16:00 - 19:00' },
        { day: 'Jumat', time: '16:00 - 18:00' },
        { day: 'Sabtu - Minggu', time: '08:00 - 12:00' },
    ],
    recentEvents: [
        { id: 1, name: 'Kejuaraan Nasional 2024', date: '15-18 Jan 2024', result: '🥇 Juara 1' },
        { id: 2, name: 'Piala Gubernur DKI', date: '5-7 Des 2023', result: '🥈 Juara 2' },
        { id: 3, name: 'Jakarta Open 2023', date: '20-22 Nov 2023', result: '🥉 Juara 3' },
    ],
    topMembers: [
        { id: 1, name: 'Ahmad Rifai', division: 'Recurve Senior' },
        { id: 2, name: 'Sari Dewi', division: 'Compound Senior' },
        { id: 3, name: 'Budi Santoso', division: 'Barebow Senior' },
        { id: 4, name: 'Citra Lestari', division: 'Recurve Junior' },
    ]
})

const joinClub = async () => {
    if (!isLoggedIn.value) {
        router.push('/auth/login')
        return
    }

    isJoining.value = true
    try {
        // Would call API: await post(`/api/v1/clubs/${club.value.id}/join`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        toast.success('Permintaan bergabung telah dikirim!')
        isMember.value = true
    } catch (error) {
        toast.error('Gagal mengirim permintaan')
    } finally {
        isJoining.value = false
    }
}
</script>

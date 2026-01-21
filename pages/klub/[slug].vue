<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Club Banner -->
        <section class="relative h-72 md:h-96 bg-gradient-to-br from-navy to-blue-900 overflow-hidden">
            <img v-if="club.bannerUrl" :src="club.bannerUrl" class="w-full h-full object-cover opacity-60" />
            <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent"></div>

            <!-- Back Button -->
            <NuxtLink to="/klub"
                class="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all">
                <Icon icon="ph:arrow-left-bold" />
                <span class="text-sm font-bold">Kembali</span>
            </NuxtLink>
        </section>

        <!-- Club Header Card -->
        <section class="container mx-auto px-4 max-w-6xl -mt-28 relative z-10 mb-10">
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-10">
                <div class="flex flex-col md:flex-row gap-6 md:gap-8">
                    <!-- Logo -->
                    <div
                        class="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white border-2 border-white shadow-sm overflow-hidden flex-shrink-0 -mt-20 md:-mt-24 relative z-20">
                        <div v-if="!club.logoUrl"
                            class="w-full h-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center">
                            <span class="text-4xl md:text-5xl font-black text-navy">{{ club.name.charAt(0) }}</span>
                        </div>
                        <img v-else :src="club.logoUrl" class="w-full h-full object-cover" />
                    </div>

                    <!-- Info -->
                    <div class="flex-1">
                        <div class="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <div class="flex flex-wrap items-center gap-3 mb-3">
                                    <h1 class="text-2xl md:text-4xl font-black text-navy leading-tight">{{ club.name }}
                                    </h1>
                                    <span v-if="club.verified"
                                        class="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] md:text-xs font-black rounded-full uppercase tracking-wider">
                                        <Icon icon="ph:seal-check-fill" />
                                        Verified
                                    </span>
                                </div>
                                <div class="flex flex-wrap items-center gap-4 text-gray-500 text-sm font-medium">
                                    <span class="flex items-center gap-1.5">
                                        <Icon icon="ph:map-pin-fill" class="text-primary" />
                                        {{ club.city }}, {{ club.province }}
                                    </span>
                                    <span class="flex items-center gap-1.5">
                                        <Icon icon="ph:calendar-bold" />
                                        Berdiri {{ club.established }}
                                    </span>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex gap-3">
                                <BaseButton v-if="!isMember && isArcher" variant="primary" size="lg" icon="ph:plus-bold"
                                    :loading="isJoining" @click="joinClub" class="shadow-lg shadow-primary/30">
                                    Gabung Klub
                                </BaseButton>
                                <div v-else-if="isMember"
                                    class="px-6 py-3 bg-green-50 text-green-600 font-black text-sm rounded-xl flex items-center gap-2 border-2 border-green-200">
                                    <Icon icon="ph:check-circle-fill" class="text-lg" />
                                    Anggota Aktif
                                </div>
                                <button class="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
                                    <Icon icon="ph:share-network-bold" class="text-xl text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <!-- Stats Bar -->
                        <div
                            class="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-4 md:gap-8 mt-8 pt-8 border-t border-gray-100">
                            <div class="text-center sm:text-left">
                                <p class="text-2xl md:text-3xl font-black text-navy">{{ club.memberCount }}</p>
                                <p class="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-wide">
                                    Anggota</p>
                            </div>
                            <div class="h-10 w-px bg-gray-200 hidden sm:block"></div>
                            <div class="text-center sm:text-left">
                                <p class="text-2xl md:text-3xl font-black text-navy">{{ club.eventCount }}</p>
                                <p class="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-wide">Event
                                </p>
                            </div>
                            <div class="h-10 w-px bg-gray-200 hidden sm:block"></div>
                            <div class="text-center sm:text-left">
                                <div class="flex items-center justify-center sm:justify-start gap-1">
                                    <Icon icon="ph:star-fill" class="text-xl md:text-2xl text-amber-400" />
                                    <p class="text-2xl md:text-3xl font-black text-navy">{{ club.rating }}</p>
                                </div>
                                <p class="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-wide">Rating
                                </p>
                            </div>
                            <div class="h-10 w-px bg-gray-200 hidden sm:block"></div>
                            <div class="text-center sm:text-left">
                                <p class="text-2xl md:text-3xl font-black text-navy">{{ club.achievements }}</p>
                                <p class="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-wide">
                                    Prestasi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Main Content -->
        <section class="container mx-auto px-4 max-w-6xl pb-16">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Column -->
                <div class="lg:col-span-2 space-y-8">
                    <!-- About -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <h2 class="font-black text-navy text-xl mb-5 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon icon="ph:info-bold" class="text-xl text-primary" />
                            </div>
                            Tentang Klub
                        </h2>
                        <p class="text-gray-600 leading-relaxed text-lg">{{ club.description }}</p>

                        <!-- Facilities -->
                        <div class="mt-8 pt-8 border-t border-gray-100">
                            <h3 class="font-black text-navy text-base mb-4">Fasilitas</h3>
                            <div class="flex flex-wrap gap-3">
                                <span v-for="facility in club.facilities" :key="facility"
                                    class="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl flex items-center gap-2">
                                    <Icon icon="ph:check-circle-fill" class="text-green-500" />
                                    {{ facility }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Events -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <h2 class="font-black text-navy text-xl mb-5 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon icon="ph:trophy-bold" class="text-xl text-primary" />
                            </div>
                            Prestasi
                        </h2>
                        <div class="space-y-4">
                            <div v-for="event in club.recentEvents" :key="event.id"
                                class="flex items-center gap-5 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-primary/30 transition-all cursor-pointer">
                                <div
                                    class="w-14 h-14 rounded-xl bg-navy flex items-center justify-center text-primary shrink-0">
                                    <Icon icon="ph:trophy-fill" class="text-2xl" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-black text-navy text-lg">{{ event.name }}</h4>
                                    <p class="text-sm text-gray-400 flex items-center gap-2">
                                        <Icon icon="ph:calendar" />
                                        {{ event.date }}
                                    </p>
                                </div>
                                <span
                                    class="px-4 py-2 bg-green-50 text-green-600 text-sm font-black rounded-full border border-green-200">{{
                                        event.result }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Top Members -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <h2 class="font-black text-navy text-xl mb-5 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon icon="ph:medal-bold" class="text-xl text-primary" />
                            </div>
                            Anggota
                        </h2>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div v-for="member in club.topMembers" :key="member.id"
                                class="text-center p-5 rounded-xl border-2 border-gray-100 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                                <div
                                    class="w-18 h-18 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                                    <Icon icon="ph:user-bold"
                                        class="text-3xl text-gray-400 group-hover:text-primary transition-colors" />
                                </div>
                                <h4 class="font-black text-navy text-sm group-hover:text-primary transition-colors">{{
                                    member.name }}</h4>
                                <p class="text-xs text-gray-400 mt-1">{{ member.division }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                    <!-- Contact Card -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 class="font-black text-navy mb-5 flex items-center gap-2">
                            <Icon icon="ph:phone-bold" class="text-primary" />
                            Kontak
                        </h3>
                        <div class="space-y-4">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                                    <Icon icon="ph:phone-fill" class="text-xl text-blue-500" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs font-bold uppercase">Telepon</p>
                                    <p class="font-bold text-navy">{{ club.phone }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                                    <Icon icon="ph:whatsapp-logo-fill" class="text-xl text-green-500" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs font-bold uppercase">WhatsApp</p>
                                    <p class="font-bold text-navy">{{ club.whatsapp }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center">
                                    <Icon icon="ph:instagram-logo-fill" class="text-xl text-pink-500" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs font-bold uppercase">Instagram</p>
                                    <p class="font-bold text-navy">{{ club.instagram }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <Icon icon="ph:facebook-logo-fill" class="text-xl text-blue-600" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs font-bold uppercase">Facebook</p>
                                    <p class="font-bold text-navy">{{ club.facebook }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                                    <Icon icon="ph:envelope-fill" class="text-xl text-red-400" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs font-bold uppercase">Email</p>
                                    <p class="font-bold text-navy">{{ club.email }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                                    <Icon icon="ph:map-pin-fill" class="text-xl text-orange-400" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs font-bold uppercase">Alamat</p>
                                    <p class="font-bold text-navy text-sm">{{ club.address }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Training Schedule -->
                    <div class="bg-gradient-to-br from-navy to-navy-light rounded-2xl p-6 text-white shadow-sm">
                        <h3 class="font-black mb-5 flex items-center gap-2">
                            <Icon icon="ph:calendar-bold" class="text-primary" />
                            Jadwal Latihan
                        </h3>
                        <div class="space-y-3">
                            <div v-for="schedule in club.schedules" :key="schedule.day"
                                class="flex justify-between items-center bg-white/10 p-4 rounded-xl">
                                <span class="font-bold text-sm">{{ schedule.day }}</span>
                                <span class="text-primary font-black">{{ schedule.time }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Location Map -->
                    <div
                        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-64 relative group">
                        <iframe width="100%" height="100%" frameborder="0" style="border:0"
                            :src="`https://www.google.com/maps/embed/v1/place?key=REPLACE_WITH_YOUR_API_KEY&q=${encodeURIComponent(club.name + ' ' + club.city + ' ' + club.province)}`"
                            allowfullscreen v-if="false"></iframe>
                        <!-- Real Embed with shared link approach (no key needed for basic display usually but iframe embed is better) -->
                        <iframe width="100%" height="100%" style="border:0" loading="lazy" allowfullscreen
                            referrerpolicy="no-referrer-when-downgrade"
                            :src="`https://www.google.com/maps?q=${encodeURIComponent(club.name + ' ' + club.city + ' ' + club.province)}&output=embed`"></iframe>
                        <div
                            class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <p class="text-white text-xs font-bold flex items-center gap-1">
                                <Icon icon="ph:map-pin-bold" />
                                Lihat di Google Maps
                            </p>
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
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'
import { useApi } from '~/composables/useApi'

definePageMeta({
    layout: 'landing'
})

const route = useRoute()
const router = useRouter()
const { isLoggedIn, user } = useAuth()
const toast = useToast()
const { post } = useApi()

const isJoining = ref(false)

// Check if user is archer
const isArcher = computed(() => {
    return isLoggedIn.value && (user.value?.role === 'archer' || user.value?.user_type === 'archer')
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
    description: 'Garuda Archery Club adalah klub panahan profesional yang berdiri sejak 2018. Kami menyediakan pelatihan untuk berbagai level dari pemula hingga profesional dengan fokus pada pengembangan teknik dan mental. Fasilitas lengkap dengan lapangan indoor 18m dan outdoor 70m.',
    facilities: ['Lapangan Indoor 18m', 'Lapangan Outdoor 70m', 'Ruang Peralatan', 'Ruang Ganti', 'Parkir Luas', 'Cafeteria'],
    phone: '021-1234567',
    whatsapp: '+62 812-3456-7890',
    instagram: '@garudaarchery',
    facebook: 'Garuda Archery',
    email: 'info@garudaarchery.com',
    address: 'Jl. Panahan No. 123, Senayan, Jakarta Selatan 12190',
    schedules: [
        { day: 'Senin - Rabu', time: '16:00 - 19:00' },
        { day: 'Jumat', time: '16:00 - 18:00' },
        { day: 'Sabtu - Minggu', time: '08:00 - 12:00' },
    ],
    recentEvents: [
        { id: 1, name: 'Kejuaraan Nasional 2024', date: '15-18 Januari 2024', result: '🥇 Juara 1' },
        { id: 2, name: 'Piala Gubernur DKI', date: '5-7 Desember 2023', result: '🥈 Juara 2' },
        { id: 3, name: 'Jakarta Open 2023', date: '20-22 November 2023', result: '🥉 Juara 3' },
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
        await post(`/api/v1/clubs/join/${club.value.id}`)
        toast.success('Permintaan bergabung telah dikirim!')
        isMember.value = true
    } catch (error) {
        toast.error('Gagal mengirim permintaan. ' + (error.message || ''))
    } finally {
        isJoining.value = false
    }
}
</script>

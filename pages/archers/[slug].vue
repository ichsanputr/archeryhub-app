<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Back Button -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 mb-6">
            <NuxtLink to="/archers"
                class="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 text-navy hover:bg-gray-50 transition-all shadow-sm">
                <Icon icon="ph:arrow-left-bold" />
                <span class="text-sm font-bold">Kembali ke Daftar Pemanah</span>
            </NuxtLink>
        </div>

        <!-- Archer Header Card -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-10">
                <div class="flex flex-col md:flex-row gap-6 md:gap-8">
                    <!-- Avatar -->
                    <div
                        class="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white border-2 border-gray-100 shadow-lg overflow-hidden flex-shrink-0">
                        <div v-if="!archer.photo_url && !archer.avatar_url"
                            class="w-full h-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center">
                            <span class="text-4xl md:text-5xl font-black text-navy">{{ archer.full_name?.charAt(0) ||
                                'A' }}</span>
                        </div>
                        <img v-else :src="useImageOrDefault(archer.photo_url || archer.avatar_url)"
                            class="w-full h-full object-cover" />
                    </div>

                    <!-- Info -->
                    <div class="flex-1">
                        <div class="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <div class="flex flex-wrap items-center gap-3 mb-3">
                                    <h1 class="text-2xl md:text-4xl font-black text-navy leading-tight">{{
                                        archer.full_name }}
                                    </h1>
                                    <span v-if="archer.athlete_code"
                                        class="px-3 py-1.5 bg-primary/10 text-primary text-[10px] md:text-xs font-black rounded-full uppercase tracking-wider">
                                        {{ archer.athlete_code }}
                                    </span>
                                </div>
                                <div class="flex flex-wrap items-center gap-4 text-gray-500 text-sm font-medium">
                                    <span v-if="archer.city" class="flex items-center gap-1.5">
                                        <Icon icon="ph:map-pin-fill" class="text-primary" />
                                        {{ archer.city }}{{ archer.province ? ', ' + archer.province : '' }}
                                    </span>
                                    <span v-if="archer.bow_type" class="flex items-center gap-1.5">
                                        <Icon icon="ph:target-bold" />
                                        {{ bowTypeLabel }}
                                    </span>
                                    <span v-if="archer.club_name || archer.club" class="flex items-center gap-1.5">
                                        <Icon icon="ph:users-three-bold" />
                                        {{ archer.club_name || archer.club }}
                                    </span>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex gap-3">
                                <button class="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
                                    <Icon icon="ph:share-network-bold" class="text-xl text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <!-- Stats Bar -->
                        <div
                            class="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-4 md:gap-8 mt-8 pt-8 border-t border-gray-100">
                            <div class="text-center sm:text-left">
                                <p class="text-2xl md:text-3xl font-black text-navy">{{ archer.total_events || 0 }}</p>
                                <p class="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-wide">
                                    Total Event</p>
                            </div>
                            <div class="h-10 w-px bg-gray-200 hidden sm:block"></div>
                            <div class="text-center sm:text-left">
                                <p class="text-2xl md:text-3xl font-black text-navy">{{ archer.completed_events || 0 }}
                                </p>
                                <p class="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-wide">
                                    Selesai
                                </p>
                            </div>
                            <div class="h-10 w-px bg-gray-200 hidden sm:block"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Main Content -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Column -->
                <div class="lg:col-span-2 space-y-8">
                    <!-- About -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <h2 class="font-black text-navy text-xl mb-5 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon icon="ph:info-bold" class="text-xl text-primary" />
                            </div>
                            Tentang Pemanah
                        </h2>
                        <p v-if="archer.bio" class="text-gray-600 leading-relaxed text-lg">{{ archer.bio }}</p>
                        <p v-else class="text-gray-400 italic">Belum ada informasi tentang pemanah ini.</p>

                        <!-- Personal Info -->
                        <div class="mt-8 pt-8 border-t border-gray-100">
                            <h3 class="font-black text-navy text-base mb-4">Informasi Pribadi</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-if="archer.date_of_birth" class="flex items-center gap-3">
                                    <Icon icon="ph:calendar-bold" class="text-primary text-xl" />
                                    <div>
                                        <p class="text-xs text-gray-400 font-bold uppercase">Tanggal Lahir</p>
                                        <p class="text-navy font-bold">{{ formatDate(archer.date_of_birth) }}</p>
                                    </div>
                                </div>
                                <div v-if="archer.gender" class="flex items-center gap-3">
                                    <Icon icon="ph:user-bold" class="text-primary text-xl" />
                                    <div>
                                        <p class="text-xs text-gray-400 font-bold uppercase">Jenis Kelamin</p>
                                        <p class="text-navy font-bold">{{ genderLabel }}</p>
                                    </div>
                                </div>
                                <div v-if="archer.experience_years" class="flex items-center gap-3">
                                    <Icon icon="ph:clock-bold" class="text-primary text-xl" />
                                    <div>
                                        <p class="text-xs text-gray-400 font-bold uppercase">Pengalaman</p>
                                        <p class="text-navy font-bold">{{ archer.experience_years }} Tahun</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Achievements -->
                        <div v-if="archer.achievements" class="mt-8 pt-8 border-t border-gray-100">
                            <h3 class="font-black text-navy text-base mb-4">Prestasi</h3>
                            <div class="prose max-w-none">
                                <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ archer.achievements }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Event History -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <h2 class="font-black text-navy text-xl mb-5 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon icon="ph:calendar-star-bold" class="text-xl text-primary" />
                            </div>
                            Riwayat Event
                        </h2>
                        <div v-if="eventHistory.length > 0" class="space-y-4">
                            <div v-for="event in eventHistory" :key="event.id"
                                class="flex items-center gap-5 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-primary/30 transition-all">
                                <div
                                    class="w-14 h-14 rounded-xl bg-navy flex items-center justify-center text-primary shrink-0">
                                    <Icon icon="ph:trophy-fill" class="text-2xl" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-black text-navy text-lg mb-1">{{ event.name }}</h4>
                                    <p class="text-gray-500 text-sm">{{ event.location }} • {{ event.date }}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-2xl font-black text-navy">{{ event.score || '-' }}</p>
                                    <p class="text-xs text-gray-400">Score</p>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-10">
                            <Icon icon="ph:calendar-blank" class="text-5xl text-gray-300 mx-auto mb-3" />
                            <p class="text-gray-400">Belum ada riwayat event</p>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                    <!-- Contact Info Card (Moved from main column) -->
                    <div v-if="archer.phone || archer.email || archer.address"
                        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 class="font-black text-navy text-base mb-4 flex items-center gap-3">
                            <Icon icon="ph:phone-bold" class="text-primary" />
                            Kontak & Lokasi
                        </h3>
                        <div class="space-y-4">
                            <div v-if="archer.email" class="flex items-center gap-3">
                                <div
                                    class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                                    <Icon icon="ph:envelope-bold" class="text-gray-400" />
                                </div>
                                <span class="text-navy text-sm font-medium break-all">{{ archer.email }}</span>
                            </div>
                            <div v-if="archer.phone" class="flex items-center gap-3">
                                <div
                                    class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                                    <Icon icon="ph:phone-bold" class="text-gray-400" />
                                </div>
                                <span class="text-navy text-sm font-medium">{{ archer.phone }}</span>
                            </div>
                            <div v-if="archer.address" class="flex items-start gap-3">
                                <div
                                    class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Icon icon="ph:map-pin-bold" class="text-gray-400" />
                                </div>
                                <span class="text-navy text-sm font-medium leading-relaxed">{{ archer.address
                                }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Club Information (Kept in sidebar but styled) -->
                    <div v-if="archer.club_name || archer.club"
                        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 class="font-black text-navy text-base mb-4 flex items-center gap-3">
                            <Icon icon="ph:shield-bold" class="text-primary" />
                            Afiliasi Klub
                        </h3>
                        <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <NuxtLink v-if="archer.club_slug" :to="`/clubs/${archer.club_slug}`"
                                class="flex items-center gap-3 group">
                                <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                    <Icon icon="ph:buildings-bold" class="text-navy" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                                        Klub Saat Ini</p>
                                    <p
                                        class="text-navy font-black text-sm truncate group-hover:text-primary transition-colors">
                                        {{ archer.club_name || archer.club }}
                                    </p>
                                </div>
                                <Icon icon="ph:caret-right-bold"
                                    class="text-gray-300 group-hover:text-primary transition-all" />
                            </NuxtLink>
                            <div v-else class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                    <Icon icon="ph:buildings-bold" class="text-navy" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                                        Klub Saat Ini</p>
                                    <p class="text-navy font-bold text-sm truncate">
                                        {{ archer.club_name || archer.club }}
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
    layout: 'landing'
})

const route = useRoute()
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

// Dummy data fallback
const dummyArcher = {
    uuid: '1',
    slug: 'budi-santoso',
    full_name: 'Budi Santoso',
    athlete_code: 'ARC-2024-001',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    bow_type: 'recurve',
    gender: 'male',
    date_of_birth: '1995-05-15',
    photo_url: null,
    club: 'Jakarta Elite Archery',
    club_name: 'Jakarta Elite Archery',
    club_slug: 'jakarta-elite-archery',
    total_events: 12,
    completed_events: 10,
    best_score: 680,
    current_ranking: 5,
    experience_years: 8,
    dominant_hand: 'right',
    phone: '+628123456789',
    email: 'budi.santoso@example.com',
    address: 'Jl. Sudirman No. 123, Jakarta Selatan',
    bio: 'Pemanah profesional dengan pengalaman lebih dari 8 tahun. Spesialisasi di divisi Recurve dengan fokus pada kompetisi nasional dan internasional.',
    achievements: 'Juara 1 Kejurda Jabar 2023\nJuara 2 Piala Presiden 2022\nJuara 3 Kejurda DKI Jakarta 2021',
    status: 'active'
}

// SSR Data Fetching
const { data: archerResponse, pending: isLoading } = await useAsyncData(
    `archer-${route.params.slug}`,
    () => $fetch(`${apiBaseUrl}/archers/${route.params.slug}`),
    { server: true }
)

const archer = computed(() => {
    const data = archerResponse.value
    if (!data || Object.keys(data).length === 0) {
        return { ...dummyArcher, slug: route.params.slug }
    }
    return data
})

const eventHistory = ref([
    { id: 1, name: 'Kejurda Jabar 2023', location: 'Bandung', date: '15 Mar 2023', score: 680 },
    { id: 2, name: 'Piala Presiden 2022', location: 'Jakarta', date: '20 Nov 2022', score: 675 },
    { id: 3, name: 'Kejurda DKI Jakarta 2021', location: 'Jakarta', date: '10 Sep 2021', score: 670 }
])

const bowTypeLabel = computed(() => {
    const labels = {
        recurve: 'Recurve',
        compound: 'Compound',
        barebow: 'Barebow',
        traditional: 'Traditional'
    }
    return labels[archer.value.bow_type] || archer.value.bow_type || '-'
})

const genderLabel = computed(() => {
    return archer.value.gender === 'male' ? 'Laki-laki' : archer.value.gender === 'female' ? 'Perempuan' : '-'
})


const statusLabel = computed(() => {
    const labels = {
        active: 'Aktif',
        inactive: 'Tidak Aktif',
        suspended: 'Ditangguhkan'
    }
    return labels[archer.value.status] || archer.value.status || '-'
})

const formatDate = (date) => {
    if (!date) return '-'
    const d = new Date(date)
    return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

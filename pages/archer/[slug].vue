<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Back Button -->
        <div class="container mx-auto px-4 max-w-6xl pt-6 mb-6">
            <NuxtLink to="/archer"
                class="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 text-navy hover:bg-gray-50 transition-all shadow-sm">
                <Icon icon="ph:arrow-left-bold" />
                <span class="text-sm font-bold">Kembali ke Daftar Pemanah</span>
            </NuxtLink>
        </div>

        <!-- Archer Header Card -->
        <section class="container mx-auto px-4 max-w-6xl mb-10">
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-10">
                <div class="flex flex-col md:flex-row gap-6 md:gap-8">
                    <!-- Avatar -->
                    <div
                        class="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white border-2 border-gray-100 shadow-lg overflow-hidden flex-shrink-0">
                        <div v-if="!archer.photo_url && !archer.avatar_url"
                            class="w-full h-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center">
                            <span class="text-4xl md:text-5xl font-black text-navy">{{ archer.full_name?.charAt(0) || 'A' }}</span>
                        </div>
                        <img v-else :src="archer.photo_url || archer.avatar_url" class="w-full h-full object-cover" />
                    </div>

                    <!-- Info -->
                    <div class="flex-1">
                        <div class="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <div class="flex flex-wrap items-center gap-3 mb-3">
                                    <h1 class="text-2xl md:text-4xl font-black text-navy leading-tight">{{ archer.full_name }}
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
                                <p class="text-2xl md:text-3xl font-black text-navy">{{ archer.completed_events || 0 }}</p>
                                <p class="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-wide">Selesai
                                </p>
                            </div>
                            <div class="h-10 w-px bg-gray-200 hidden sm:block"></div>
                            <div v-if="archer.best_score" class="text-center sm:text-left">
                                <p class="text-2xl md:text-3xl font-black text-navy">{{ archer.best_score }}</p>
                                <p class="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-wide">Best Score
                                </p>
                            </div>
                            <div v-if="archer.current_ranking" class="h-10 w-px bg-gray-200 hidden sm:block"></div>
                            <div v-if="archer.current_ranking" class="text-center sm:text-left">
                                <p class="text-2xl md:text-3xl font-black text-navy">#{{ archer.current_ranking }}</p>
                                <p class="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-wide">
                                    Ranking</p>
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
                                <div v-if="archer.dominant_hand" class="flex items-center gap-3">
                                    <Icon icon="ph:hand-bold" class="text-primary text-xl" />
                                    <div>
                                        <p class="text-xs text-gray-400 font-bold uppercase">Tangan Dominan</p>
                                        <p class="text-navy font-bold">{{ dominantHandLabel }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Contact Info -->
                        <div v-if="archer.phone || archer.email" class="mt-8 pt-8 border-t border-gray-100">
                            <h3 class="font-black text-navy text-base mb-4">Kontak</h3>
                            <div class="space-y-3">
                                <div v-if="archer.email" class="flex items-center gap-3">
                                    <Icon icon="ph:envelope-bold" class="text-primary text-xl" />
                                    <span class="text-navy font-medium">{{ archer.email }}</span>
                                </div>
                                <div v-if="archer.phone" class="flex items-center gap-3">
                                    <Icon icon="ph:phone-bold" class="text-primary text-xl" />
                                    <span class="text-navy font-medium">{{ archer.phone }}</span>
                                </div>
                                <div v-if="archer.address" class="flex items-start gap-3">
                                    <Icon icon="ph:map-pin-bold" class="text-primary text-xl mt-1" />
                                    <span class="text-navy font-medium">{{ archer.address }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Achievements -->
                        <div v-if="archer.achievements" class="mt-8 pt-8 border-t border-gray-100">
                            <h3 class="font-black text-navy text-base mb-4">Prestasi</h3>
                            <div class="prose max-w-none">
                                <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ archer.achievements }}</p>
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
                    <!-- Quick Info Card -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 class="font-black text-navy text-base mb-4 flex items-center gap-2">
                            <Icon icon="ph:info-bold" class="text-primary" />
                            Informasi Cepat
                        </h3>
                        <div class="space-y-4">
                            <div v-if="archer.athlete_code">
                                <p class="text-xs text-gray-400 font-bold uppercase mb-1">Kode Atlet</p>
                                <p class="text-navy font-black text-lg">{{ archer.athlete_code }}</p>
                            </div>
                            <div v-if="archer.status">
                                <p class="text-xs text-gray-400 font-bold uppercase mb-1">Status</p>
                                <span :class="[
                                    'px-3 py-1 rounded-full text-xs font-black uppercase',
                                    archer.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                ]">
                                    {{ statusLabel }}
                                </span>
                            </div>
                            <div v-if="archer.club_name || archer.club">
                                <p class="text-xs text-gray-400 font-bold uppercase mb-1">Klub</p>
                                <NuxtLink v-if="archer.club_slug" :to="`/klub/${archer.club_slug}`" 
                                    class="text-primary hover:underline font-bold">
                                    {{ archer.club_name || archer.club }}
                                </NuxtLink>
                                <span v-else class="text-navy font-bold">
                                    {{ archer.club_name || archer.club }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Emergency Contact -->
                    <div v-if="archer.emergency_contact_name" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 class="font-black text-navy text-base mb-4 flex items-center gap-2">
                            <Icon icon="ph:phone-bold" class="text-primary" />
                            Kontak Darurat
                        </h3>
                        <div class="space-y-2">
                            <p class="text-navy font-bold">{{ archer.emergency_contact_name }}</p>
                            <p v-if="archer.emergency_contact_phone" class="text-gray-500 text-sm">{{ archer.emergency_contact_phone }}</p>
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
const { get } = useApi()

const archer = ref({})
const isLoading = ref(false)
const eventHistory = ref([])

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
    emergency_contact_name: 'Siti Santoso',
    emergency_contact_phone: '+628123456790',
    status: 'active'
}

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

const dominantHandLabel = computed(() => {
    return archer.value.dominant_hand === 'left' ? 'Kiri' : archer.value.dominant_hand === 'right' ? 'Kanan' : '-'
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

const fetchArcher = async () => {
    isLoading.value = true
    try {
        const slug = route.params.slug
        
        // Try to fetch by slug first, then by UUID
        let response
        try {
            // Try fetching all archers and find by slug
            const allArchers = await get('/archers')
            const found = allArchers.archers?.find(a => a.slug === slug || a.uuid === slug)
            if (found) {
                response = { ...found }
            } else {
                // Try direct fetch by ID
                response = await get(`/archers/${slug}`)
            }
        } catch {
            // If direct fetch fails, try by ID
            response = await get(`/archers/${slug}`)
        }
        
        if (response && Object.keys(response).length > 0) {
            archer.value = response
        } else {
            // Use dummy data if API returns empty
            archer.value = { ...dummyArcher, slug: slug }
        }
        
        // Fetch event history (dummy for now)
        eventHistory.value = [
            { id: 1, name: 'Kejurda Jabar 2023', location: 'Bandung', date: '15 Mar 2023', score: 680 },
            { id: 2, name: 'Piala Presiden 2022', location: 'Jakarta', date: '20 Nov 2022', score: 675 },
            { id: 3, name: 'Kejurda DKI Jakarta 2021', location: 'Jakarta', date: '10 Sep 2021', score: 670 }
        ]
    } catch (error) {
        console.error('Failed to fetch archer:', error)
        // Use dummy data on error
        archer.value = { ...dummyArcher, slug: route.params.slug }
        eventHistory.value = [
            { id: 1, name: 'Kejurda Jabar 2023', location: 'Bandung', date: '15 Mar 2023', score: 680 },
            { id: 2, name: 'Piala Presiden 2022', location: 'Jakarta', date: '20 Nov 2022', score: 675 },
            { id: 3, name: 'Kejurda DKI Jakarta 2021', location: 'Jakarta', date: '10 Sep 2021', score: 670 }
        ]
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchArcher()
})
</script>

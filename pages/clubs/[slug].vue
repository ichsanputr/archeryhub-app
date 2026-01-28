<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Club Banner -->
        <section class="relative h-72 md:h-96 bg-gradient-to-br from-navy to-blue-900 overflow-hidden">
            <img :src="club.bannerUrl || '/hero-club-detail-default.jpeg'" class="w-full h-full object-cover opacity-60" />
            <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent"></div>

            <!-- Back Button -->
            <div class="container mx-auto px-4 max-w-6xl relative h-full">
                <NuxtLink to="/clubs"
                    class="absolute top-6 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all">
                    <Icon icon="ph:arrow-left-bold" />
                    <span class="text-sm font-bold">Kembali</span>
                </NuxtLink>
            </div>
        </section>

        <!-- Club Header Card -->
        <section class="container mx-auto px-4 max-w-6xl -mt-28 relative z-10 mb-10">
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-10">
                <div class="flex flex-col md:flex-row gap-6 md:gap-8">
                    <div
                        class="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white border-2 border-white shadow-sm overflow-hidden flex-shrink-0 -mt-20 md:-mt-24 relative z-20">
                        <img v-if="club.logoUrl" :src="club.logoUrl" :alt="club.name"
                            class="w-full h-full object-cover" />
                        <div v-else-if="!club.logoUrl"
                            class="w-full h-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center">
                            <span class="text-4xl md:text-5xl font-black text-navy">{{ club.name.charAt(0) }}</span>
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="flex-1">
                        <div class="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <div class="flex flex-wrap items-center gap-3 mb-3">
                                    <h1 class="text-2xl md:text-4xl font-black text-navy leading-tight">{{ club.name }}
                                    </h1>
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
                                <BaseButton v-if="!membership && isArcher" variant="primary" size="lg"
                                    icon="ph:plus-bold" :loading="isJoining" @click="joinClub"
                                    class="shadow-lg shadow-primary/30">
                                    Gabung Klub
                                </BaseButton>
                                <div v-else-if="membership && membership.status === 'active' && membership.club_id === club.id"
                                    class="px-6 py-3 bg-green-50 text-green-600 font-black text-sm rounded-xl flex items-center gap-2 border-2 border-green-200">
                                    <Icon icon="ph:check-circle-fill" class="text-lg" />
                                    Anggota Aktif
                                </div>
                                <div v-else-if="membership && membership.status === 'pending' && membership.club_id === club.id"
                                    class="px-6 py-3 bg-yellow-50 text-yellow-600 font-black text-sm rounded-xl flex items-center gap-2 border-2 border-yellow-200">
                                    <Icon icon="ph:clock-fill" class="text-lg" />
                                    Menunggu Persetujuan
                                </div>
                                <div v-else-if="membership && membership.club_id !== club.id"
                                    class="px-4 py-3 bg-gray-50 text-gray-500 font-bold text-xs rounded-xl flex items-center gap-2 border-2 border-gray-100 max-w-[200px]">
                                    <Icon icon="ph:info-fill" class="text-lg" />
                                    Terdaftar di Klub {{ membership.club_name }}
                                </div>
                                <button class="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
                                    <Icon icon="ph:share-network-bold" class="text-xl text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <!-- Stats Bar -->
                        <div class="flex flex-wrap items-center gap-4 md:gap-8 mt-8 pt-8 border-t border-gray-100">
                            <div class="text-center sm:text-left">
                                <p class="text-2xl md:text-3xl font-black text-navy">{{ club.memberCount }}</p>
                                <p class="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-wide">
                                    Anggota</p>
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
                            <div v-if="club.phone" class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <Icon icon="ph:phone-fill" class="text-lg text-gray-600" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs font-bold uppercase">Telepon</p>
                                    <p class="font-bold text-navy">{{ club.phone }}</p>
                                </div>
                            </div>
                            <div v-if="club.whatsapp" class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <Icon icon="ph:whatsapp-logo-fill" class="text-lg text-gray-600" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs font-bold uppercase">WhatsApp</p>
                                    <p class="font-bold text-navy">{{ club.whatsapp }}</p>
                                </div>
                            </div>
                            <div v-if="club.email" class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <Icon icon="ph:envelope-fill" class="text-lg text-gray-600" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs font-bold uppercase">Email</p>
                                    <p class="font-bold text-navy">{{ club.email }}</p>
                                </div>
                            </div>
                            <div v-if="club.address" class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <Icon icon="ph:map-pin-fill" class="text-lg text-gray-600" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs font-bold uppercase">Alamat</p>
                                    <p class="font-bold text-navy text-sm">{{ club.address }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Social Media -->
                    <div v-if="club.socialMedia && club.socialMedia.length"
                        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 class="font-black text-navy mb-5 flex items-center gap-2">
                            <Icon icon="ph:share-network-bold" class="text-primary" />
                            Media Sosial
                        </h3>
                        <div class="space-y-3">
                            <a v-for="social in club.socialMedia" :key="social.platform" :href="getSocialUrl(social)"
                                target="_blank"
                                class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <Icon :icon="getSocialIcon(social.platform)" class="text-xl text-gray-600" />
                                <span class="font-bold text-navy text-sm">{{ social.username }}</span>
                            </a>
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
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'landing'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { isLoggedIn, user } = useAuth()
const toast = useToast()
const isJoining = ref(false)
const membership = ref(null)

// SSR: Fetch club data with useAsyncData
const { data: clubData, error } = await useAsyncData(
    `club-${route.params.slug}`,
    async () => {
        const response = await $fetch(`${config.public.apiBaseUrl}/clubs/${route.params.slug}`)
        return response
    }
)

// Throw 404 if club not found
if (error.value || !clubData.value || !clubData.value.name) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Klub tidak ditemukan',
        fatal: true
    })
}

// Check if user is archer
const isArcher = computed(() => {
    return isLoggedIn.value && (user.value?.role === 'archer' || user.value?.user_type === 'archer')
})

const parseFacilities = (facilitiesData) => {
    if (!facilitiesData) return []
    if (Array.isArray(facilitiesData)) return facilitiesData
    if (typeof facilitiesData === 'string') {
        try {
            const parsed = JSON.parse(facilitiesData)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return facilitiesData.split(',').map(f => f.trim()).filter(Boolean)
        }
    }
    return []
}

const parseSchedules = (scheduleData) => {
    if (!scheduleData) return []
    if (Array.isArray(scheduleData)) return scheduleData
    if (typeof scheduleData === 'string') {
        try {
            const parsed = JSON.parse(scheduleData)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    }
    return []
}

const parseSocialMedia = (data) => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (typeof data === 'string') {
        try {
            const parsed = JSON.parse(data)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    }
    return []
}

// Helper function to get image URL (handles double /api/v1 issue)
const getImageUrl = (url) => {
    if (!url) return ''
    // If already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
    }
    // Remove /api/v1 if it's already in the path
    let cleanUrl = url
    if (cleanUrl.startsWith('/api/v1/')) {
        cleanUrl = cleanUrl.replace('/api/v1', '')
    }
    // Prepend base URL
    return `${config.public.apiBaseUrl}${cleanUrl}`
}

// Transform API data to component format (SSR-computed)
const club = computed(() => {
    const data = clubData.value || {}
    const logoUrl = data.logo_url || data.avatar_url || ''
    const bannerUrl = data.banner_url || ''
    return {
        id: data.id || data.uuid || 0,
        name: data.name || '',
        slug: data.slug || route.params.slug,
        city: data.city || '',
        province: data.province || '',
        established: data.established ? new Date(data.established).getFullYear().toString() : '',
        bannerUrl: getImageUrl(bannerUrl),
        logoUrl: getImageUrl(logoUrl),
        memberCount: data.member_count || data.members || 0,
        eventCount: data.event_count || data.events || 0,
        achievements: data.achievements || 0,
        description: data.description || 'Klub panahan yang berdedikasi untuk mengembangkan bakat dan prestasi atlet.',
        facilities: parseFacilities(data.facilities),
        phone: data.phone || '',
        whatsapp: data.whatsapp || data.phone || '',
        email: data.email || '',
        address: data.address || '',
        schedules: parseSchedules(data.schedules),
        recentEvents: data.recent_events || [],
        topMembers: data.top_members || [],
        sections: data.sections || [],
        socialMedia: parseSocialMedia(data.social_media)
    }
})

useHead({
    title: computed(() => club.value.name ? `${club.value.name} - Profil Klub Archeryhub.id` : 'Profil Klub - Archeryhub.id'),
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ]
})

const getSocialIcon = (platform) => {
    const icons = {
        instagram: 'ph:instagram-logo-fill',
        facebook: 'ph:facebook-logo-fill',
        twitter: 'ph:twitter-logo-fill',
        youtube: 'ph:youtube-logo-fill',
        tiktok: 'ph:tiktok-logo-fill',
        linkedin: 'ph:linkedin-logo-fill'
    }
    return icons[platform] || 'ph:link-bold'
}

const getSocialUrl = (social) => {
    const urls = {
        instagram: `https://instagram.com/${social.username.replace('@', '')}`,
        facebook: social.username.startsWith('http') ? social.username : `https://facebook.com/${social.username}`,
        twitter: `https://twitter.com/${social.username.replace('@', '')}`,
        youtube: social.username.startsWith('http') ? social.username : `https://youtube.com/@${social.username}`,
        tiktok: `https://tiktok.com/@${social.username.replace('@', '')}`,
        linkedin: social.username.startsWith('http') ? social.username : `https://linkedin.com/in/${social.username}`
    }
    return urls[social.platform] || social.username
}

const joinClub = async () => {
    if (!isLoggedIn.value) {
        router.push('/auth/login')
        return
    }

    isJoining.value = true
    try {
        await $fetch(`${config.public.apiBaseUrl}/clubs/join/${club.value.id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${useCookie('auth_token').value}`
            }
        })
        toast.success('Permintaan bergabung telah dikirim!')
        membership.value = {
            status: 'pending',
            club_id: club.value.id,
            club_name: club.value.name
        }
    } catch (err) {
        toast.error('Gagal mengirim permintaan. ' + (err.message || ''))
    } finally {
        isJoining.value = false
    }
}

// Fetch membership on client side if logged in
onMounted(async () => {
    if (isArcher.value) {
        try {
            const memberResp = await $fetch(`${config.public.apiBaseUrl}/clubs/my/membership`, {
                headers: {
                    'Authorization': `Bearer ${useCookie('auth_token').value}`
                }
            })
            if (memberResp?.data) {
                membership.value = memberResp.data
            }
        } catch (e) {
            // Silent fail - user might not have membership
        }
    }
})
</script>

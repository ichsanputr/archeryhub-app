<template>
    <div class="bg-background-light min-h-screen flex flex-col">

        <!-- ── Fixed dot-grid background ── -->
        <div class="fixed inset-0 -z-10 pointer-events-none opacity-[0.035]"
            style="background-image: radial-gradient(circle, #0f172a 1px, transparent 1px); background-size: 40px 40px;">
        </div>

        <!-- ══════════════════════════════════════
             HERO HEADER — Full Width
             ══════════════════════════════════════ -->
        <section class="relative w-full bg-navy overflow-hidden">
            <!-- Background Elements -->
            <div class="absolute inset-0 z-0">
                <img v-if="club.bannerUrl" :src="club.bannerUrl" class="w-full h-full object-cover opacity-30" />
                <div v-else class="w-full h-full bg-gradient-to-br from-navy to-navy-light opacity-80"></div>
                <!-- Dynamic Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent"></div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-10 sm:pb-12 relative z-10 text-white">
                <!-- Back nav -->
                <NuxtLink to="/clubs"
                    class="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-primary transition-colors mb-10">
                    <Icon icon="ph:arrow-left-bold" />
                    Semua Klub
                </NuxtLink>

                <!-- Logo + Club name row -->
                <div class="flex flex-col md:flex-row md:items-end gap-5 md:gap-6 mb-8 sm:mb-10">
                    <!-- Logo -->
                    <div
                        class="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white/10 overflow-hidden bg-white shadow-2xl flex-shrink-0 animate-fade-in">
                        <img :src="useImageOrDefault(club.logoUrl, club.name)" :alt="club.name"
                            class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1">
                        <!-- Official tag -->
                        <span
                            class="inline-block bg-primary text-navy text-[10px] font-black px-2 py-1 mb-4 tracking-widest uppercase">
                            Profil Resmi
                        </span>
                        <h1
                            class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-none mb-4 sm:mb-5 uppercase break-words drop-shadow-md">
                            {{ club.name || 'Klub Panahan' }}
                        </h1>
                        <p class="text-base sm:text-lg md:text-xl font-light text-white/80 max-w-3xl leading-snug">
                            {{ club.description || defaultDesc }}
                        </p>
                    </div>
                </div>

                <!-- Stats bar -->
                <div class="flex flex-wrap gap-5 sm:gap-10 py-6 sm:py-8 border-y border-white/10 mb-0">
                    <div>
                        <span class="text-[10px] uppercase tracking-widest text-white/40 font-black block mb-1">Total
                            Anggota</span>
                        <span class="text-xl sm:text-2xl font-black text-primary">{{ club.memberCount || '—' }}{{
                            club.memberCount ? '+' : ''
                        }}</span>
                    </div>
                    <div v-if="club.established">
                        <span
                            class="text-[10px] uppercase tracking-widest text-white/40 font-black block mb-1">Berdiri</span>
                        <span class="text-xl sm:text-2xl font-black">{{ club.established }}</span>
                    </div>
                    <div v-if="club.city || club.province">
                        <span
                            class="text-[10px] uppercase tracking-widest text-white/40 font-black block mb-1">Lokasi</span>
                        <span class="text-xl sm:text-2xl font-black">{{ club.formattedLocation }}</span>
                    </div>
                    <div v-if="club.headCoach">
                        <span class="text-[10px] uppercase tracking-widest text-white/40 font-black block mb-1">Pelatih
                            Kepala</span>
                        <span class="text-xl sm:text-2xl font-black">{{ club.headCoach }}</span>
                    </div>
                    <div class="w-full sm:w-auto sm:ml-auto self-center flex gap-3">
                        <!-- Membership action -->
                        <BaseButton v-if="!membership" variant="primary" size="md" icon="ph:plus-bold"
                            :loading="isJoining" @click="joinClub"
                            class="shadow-xl shadow-primary/20 whitespace-nowrap">
                            Gabung Klub
                        </BaseButton>
                        <div v-else-if="membership && membership.status === 'active' && membership.club_id === club.id"
                            class="px-5 py-2.5 bg-primary text-navy font-black text-xs flex items-center gap-2 rounded-xl shadow-lg shadow-primary/10">
                            <Icon icon="ph:check-circle-fill" class="text-base" />
                            Anggota Aktif
                        </div>
                        <div v-else-if="membership && membership.status === 'pending' && membership.club_id === club.id"
                            class="px-5 py-2.5 bg-white/5 border border-white/10 text-white/60 font-black text-xs flex items-center gap-2 rounded-xl backdrop-blur-md">
                            <Icon icon="ph:clock-bold" class="text-base" />
                            Menunggu Persetujuan
                        </div>
                        <button @click="shareClub"
                            class="size-11 sm:size-12 rounded-xl border border-white/10 hover:border-primary hover:bg-primary transition-all flex items-center justify-center group sm:ml-0 ml-auto backdrop-blur-md">
                            <Icon icon="ph:share-network-bold" class="text-xl text-white group-hover:text-navy" />
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- ══════════════════════════════════════
             MAIN BODY
             ══════════════════════════════════════ -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">

            <!-- ── About + Facilities grid ── -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 py-10 sm:py-16">
                <!-- About / philosophy -->
                <section>
                    <div class="flex items-center gap-3 mb-6">
                        <span class="bg-navy p-1.5 rounded text-primary flex items-center">
                            <Icon icon="ph:info-bold" class="text-sm" />
                        </span>
                        <h2 class="text-xl font-black uppercase tracking-tight">Tentang Klub</h2>
                    </div>
                    <div class="space-y-4 text-[#0f172a]/70 leading-relaxed font-medium">
                        <p>{{ club.description || defaultDesc }}</p>
                        <p v-if="club.registrationNumber">
                            No. Registrasi: <strong class="text-navy">{{ club.registrationNumber }}</strong>
                        </p>
                    </div>
                </section>

                <!-- Facilities / Schedules -->
                <section>
                    <div class="flex items-center gap-3 mb-6">
                        <span class="bg-navy p-1.5 rounded text-primary flex items-center">
                            <Icon icon="ph:calendar-bold" class="text-sm" />
                        </span>
                        <h2 class="text-xl font-black uppercase tracking-tight">Jadwal & Fasilitas</h2>
                    </div>

                    <!-- Schedules -->
                    <ul v-if="club.schedules?.length" class="space-y-3 mb-6">
                        <li v-for="schedule in club.schedules" :key="schedule.day"
                            class="flex justify-between border-b border-[#0f172a]/10 pb-2">
                            <span class="text-[#64748b] text-sm uppercase font-bold tracking-wider">{{ schedule.day
                                }}</span>
                            <span class="font-bold text-primary bg-navy px-2 py-0.5 text-xs">{{ schedule.time }}</span>
                        </li>
                    </ul>

                    <!-- Facilities chips -->
                    <div v-if="club.facilities?.length" class="flex flex-wrap gap-2">
                        <span v-for="f in club.facilities" :key="f"
                            class="px-3 py-1 border border-[#0f172a]/20 text-xs font-bold uppercase tracking-wider hover:bg-navy hover:text-primary hover:border-navy transition-all">
                            {{ f }}
                        </span>
                    </div>
                    <p v-if="!club.schedules?.length && !club.facilities?.length"
                        class="text-[#64748b] text-sm font-medium italic">Informasi jadwal belum tersedia.</p>
                </section>
            </div>

            <div class="border-t border-[#0f172a]/10 my-0"></div>

            <!-- ── Elite Rankings (Members) ── -->
            <section class="py-10 sm:py-16">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-8 sm:mb-10">
                    <div>
                        <h2 class="text-3xl font-black tracking-tighter uppercase">Anggota Unggulan</h2>
                        <p class="text-[#64748b] font-medium mt-1 uppercase text-[10px] tracking-widest">
                            Daftar Atlet Aktif
                        </p>
                    </div>
                </div>

                <!-- Ranked list header -->
                <div class="grid grid-cols-1 gap-0.5">
                    <div class="flex items-center justify-between p-4 bg-navy text-white">
                        <div class="flex items-center gap-6">
                            <span class="w-8 text-[10px] font-bold text-white/50">NO</span>
                            <span class="font-bold text-sm">ATLET</span>
                        </div>
                        <span class="text-[10px] font-bold text-white/50 uppercase tracking-widest">KATEGORI</span>
                    </div>

                    <template v-if="club.topMembers?.length">
                        <NuxtLink v-for="(member, idx) in club.topMembers" :key="member.id"
                            :to="`/archers/${member.username || member.slug || member.uuid}`"
                            class="flex items-center justify-between p-4 border border-[#0f172a]/10 hover:bg-white transition-colors group"
                            :class="idx === 0 ? '' : 'border-t-0'">
                            <div class="flex items-center gap-6">
                                <span class="w-8 font-black text-[#0f172a]/25 italic text-lg">
                                    {{ String(idx + 1).padStart(2, '0') }}
                                </span>
                                <div class="flex items-center gap-3">
                                    <div class="w-9 h-9 rounded-full overflow-hidden border border-[#0f172a]/10 flex-shrink-0"
                                        :class="idx === 0 ? 'ring-2 ring-primary' : ''">
                                        <img :src="useImageOrDefault(member.avatar, member.name)" :alt="member.name"
                                            class="w-full h-full object-cover" />
                                    </div>
                                    <span class="font-bold text-sm group-hover:text-navy transition-colors">{{
                                        member.name }}</span>
                                </div>
                            </div>
                            <span class="text-[#64748b] text-xs font-bold uppercase tracking-wider">{{ member.division
                                || '—' }}</span>
                        </NuxtLink>
                    </template>

                    <div v-else class="py-16 text-center border border-[#0f172a]/10">
                        <Icon icon="ph:users-light" class="text-5xl mx-auto mb-3 opacity-20" />
                        <p class="text-[10px] font-black uppercase tracking-widest text-[#64748b]">Belum ada data
                            anggota</p>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center gap-2">
                    <button @click="memberPage--" :disabled="memberPage === 1"
                        class="w-10 h-10 border border-navy/20 flex items-center justify-center font-bold hover:bg-navy hover:text-primary hover:border-navy disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                        <Icon icon="ph:caret-left-bold" />
                    </button>
                    <button v-for="p in totalPages" :key="p" @click="memberPage = p"
                        class="w-10 h-10 font-black text-sm border transition-all"
                        :class="memberPage === p ? 'bg-navy text-primary border-navy' : 'border-navy/20 hover:border-navy text-[#64748b]'">
                        {{ p }}
                    </button>
                    <button @click="memberPage++" :disabled="memberPage === totalPages"
                        class="w-10 h-10 border border-navy/20 flex items-center justify-center font-bold hover:bg-navy hover:text-primary hover:border-navy disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                        <Icon icon="ph:caret-right-bold" />
                    </button>
                </div>
            </section>

            <!-- ── Section divider ── -->
            <div class="border-t border-[#0f172a]/10"></div>

            <!-- ── Dispatches & Achievements ── -->
            <section class="py-10 sm:py-16">
                <h2 class="text-3xl font-black tracking-tighter uppercase mb-12">Prestasi & Berita</h2>
                <div class="max-w-3xl space-y-0">
                    <template v-if="club.recentEvents?.length">
                        <div v-for="(event, idx) in club.recentEvents" :key="event.id || idx" class="py-8"
                            :class="idx < club.recentEvents.length - 1 ? 'border-b border-[#0f172a]/5' : ''">
                            <span
                                class="text-[10px] font-black tracking-widest text-[#64748b] uppercase mb-2 block italic">
                                {{ event.date }}
                            </span>
                            <h3
                                class="text-2xl font-black leading-tight mb-3 hover:text-primary transition-colors cursor-pointer">
                                {{ event.name }}
                            </h3>
                            <div class="inline-flex items-center gap-2">
                                <span
                                    class="px-3 py-1 bg-primary text-navy text-[10px] font-black uppercase tracking-wider">
                                    {{ event.result }}
                                </span>
                            </div>
                        </div>
                    </template>
                    <div v-else class="py-16 text-center">
                        <Icon icon="ph:trophy-light" class="text-5xl mx-auto mb-3 opacity-20" />
                        <p class="text-[10px] font-black uppercase tracking-widest text-[#64748b]">Belum ada catatan
                            prestasi</p>
                    </div>
                </div>
            </section>

            <!-- ── Dynamic Sections (FAQ, Gallery) ── -->
            <template v-if="club.sections?.length">
                <div class="border-t border-[#0f172a]/10"></div>
                <section v-for="(section, sIdx) in club.sections" :key="sIdx" class="py-16">
                    <div class="flex items-center gap-3 mb-8">
                        <span class="bg-navy p-1.5 rounded text-primary flex items-center">
                            <Icon :icon="section.type === 'faq' ? 'ph:question-bold' : 'ph:image-bold'"
                                class="text-sm" />
                        </span>
                        <h2 class="text-2xl font-black uppercase tracking-tight">{{ section.title }}</h2>
                    </div>

                    <p v-if="section.content" class="text-[#0f172a]/70 leading-relaxed mb-8 max-w-2xl">{{
                        section.content }}</p>

                    <!-- FAQ -->
                    <div v-if="section.type === 'faq'" class="space-y-4 max-w-2xl">
                        <div v-for="(item, iIdx) in section.items" :key="iIdx"
                            class="p-5 border border-[#0f172a]/10 hover:border-primary/40 transition-all">
                            <h4 class="font-black text-navy text-sm mb-2 flex items-start gap-2">
                                <Icon icon="ph:caret-right-bold" class="text-primary mt-0.5 flex-shrink-0" />
                                {{ item.question }}
                            </h4>
                            <p class="text-[#64748b] text-sm leading-relaxed pl-5">{{ item.answer }}</p>
                        </div>
                    </div>

                    <!-- Gallery -->
                    <div v-if="section.type === 'gallery'" class="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div v-for="(img, iIdx) in (section.images ? section.images.split(',') : [])" :key="iIdx"
                            class="aspect-square overflow-hidden bg-[#0f172a]/5 group">
                            <img :src="img.trim()"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                    </div>
                </section>
            </template>
        </main>



        <!-- Dialogs -->
        <AppDialog v-model:show="showJoinConfirmDialog" title="Gabung Klub"
            :message="`Apakah Anda yakin ingin bergabung dengan ${club.name}? Permintaan Anda akan dikirim ke pengurus klub untuk disetujui.`"
            confirm-text="Ya, Gabung Sekarang" icon="ph:user-plus-bold" @confirm="confirmJoin" />

        <AppDialog v-model:show="showLoginRequiredDialog" title="Login Diperlukan"
            message="Anda harus masuk ke akun Archer Anda untuk dapat bergabung dengan klub ini."
            confirm-text="Login Sekarang" icon="ph:lock-key-bold" @confirm="router.push('/auth/login')" />

        <AppDialog v-model:show="showArcherRequiredDialog" title="Tipe Akun Tidak Sesuai"
            message="Maaf, saat ini hanya akun dengan tipe 'Archer' yang dapat bergabung dengan klub. Silakan gunakan akun Archer Anda."
            confirm-text="Mengerti" icon="ph:warning-circle-bold" @confirm="showArcherRequiredDialog = false" />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import AppDialog from '~/components/common/AppDialog.vue'
import { useToast } from '~/composables/useToast'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({ layout: 'landing' })

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { isLoggedIn, user } = useAuth()
const toast = useToast()
const isJoining = ref(false)
const showJoinConfirmDialog = ref(false)
const showLoginRequiredDialog = ref(false)
const showArcherRequiredDialog = ref(false)
const membership = ref(null)
const memberPage = ref(1)
const memberLimit = 12
const defaultDesc = 'Klub panahan yang berdedikasi untuk mengembangkan bakat dan prestasi atlet di Indonesia.'

// SSR: Fetch club data
const { data: clubData, error } = await useAsyncData(
    `club-${route.params.slug}`,
    async () => {
        const response = await $fetch(`${config.public.apiBaseUrl}/clubs/${route.params.slug}`, {
            params: { member_page: memberPage.value, member_limit: memberLimit }
        })
        return response
    },
    { watch: [memberPage] }
)

if (error.value || !clubData.value || !clubData.value.name) {
    throw createError({ statusCode: 404, statusMessage: 'Klub tidak ditemukan', fatal: true })
}

const isArcher = computed(() =>
    isLoggedIn.value && (user.value?.role === 'archer' || user.value?.user_type === 'archer')
)

const parseFacilities = (d) => {
    if (!d) return []
    if (Array.isArray(d)) return d
    try { const p = JSON.parse(d); return Array.isArray(p) ? p : [] } catch { return d.split(',').map(f => f.trim()).filter(Boolean) }
}
const parseSchedules = (d) => {
    if (!d) return []
    if (Array.isArray(d)) return d
    try { const p = JSON.parse(d); return Array.isArray(p) ? p : [] } catch { return [] }
}
const parseSocialMedia = (d) => {
    if (!d) return []
    if (Array.isArray(d)) return d
    try { const p = JSON.parse(d); return Array.isArray(p) ? p : [] } catch { return [] }
}

const totalPages = computed(() => Math.ceil((club.value?.memberCount || 0) / memberLimit))

const club = computed(() => {
    const data = clubData.value || {}
    return {
        id: data.id || data.uuid || 0,
        name: data.name || '',
        slug: data.slug || route.params.slug,
        abbreviation: data.abbreviation || '',
        city: data.city || '',
        province: data.province || '',
        formattedLocation: [data.city, data.province].filter(Boolean).join(', '),
        established: data.established ? new Date(data.established).getFullYear().toString() : '',
        bannerUrl: data.banner_url || '',
        logoUrl: data.logo_url || data.avatar_url || '',
        memberCount: data.member_count || data.members || 0,
        description: data.description || '',
        facilities: parseFacilities(data.facilities),
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        headCoach: data.head_coach_name || '',
        registrationNumber: data.registration_number || '',
        schedules: parseSchedules(data.schedules || data.training_schedule),
        recentEvents: data.recent_events || [],
        topMembers: data.top_members || [],
        sections: (data.sections || []).filter(s => s.title?.toLowerCase() !== 'apa kata anggota'),
        socialMedia: parseSocialMedia(data.social_media),
        registrationConfig: data.registration_config
    }
})

useHead({
    title: computed(() => club.value.name ? `${club.value.name} — Archeryhub.id` : 'Profil Klub — Archeryhub.id'),
    link: [{ rel: 'canonical', href: useRequestURL().href }]
})

const getSocialIcon = (platform) => ({
    instagram: 'ph:instagram-logo-fill',
    facebook: 'ph:facebook-logo-fill',
    twitter: 'ph:twitter-logo-fill',
    youtube: 'ph:youtube-logo-fill',
    tiktok: 'ph:tiktok-logo-fill',
}[platform] || 'ph:link-bold')

const getSocialUrl = (social) => {
    const base = {
        instagram: `https://instagram.com/${social.username?.replace('@', '')}`,
        facebook: social.username?.startsWith('http') ? social.username : `https://facebook.com/${social.username}`,
        twitter: `https://twitter.com/${social.username?.replace('@', '')}`,
        youtube: `https://youtube.com/@${social.username}`,
        tiktok: `https://tiktok.com/@${social.username?.replace('@', '')}`,
    }
    return base[social.platform] || social.username
}

const shareClub = async () => {
    if (navigator.share) {
        try { await navigator.share({ title: club.value.name, url: window.location.href }) } catch { }
    } else {
        try { await navigator.clipboard.writeText(window.location.href); toast.success('Link disalin!') } catch { }
    }
}

const joinClub = async () => {
    if (!isLoggedIn.value) {
        showLoginRequiredDialog.value = true
        return
    }

    if (!isArcher.value) {
        showArcherRequiredDialog.value = true
        return
    }

    // Check if custom registration form exists
    if (club.value.registrationConfig) {
        try {
            const config = JSON.parse(club.value.registrationConfig)
            if (config.fields && config.fields.length > 0) {
                router.push(`/clubs/${club.value.slug}/registration`)
                return
            }
        } catch { }
    }

    showJoinConfirmDialog.value = true
}

const confirmJoin = async () => {
    isJoining.value = true
    try {
        await $fetch(`${config.public.apiBaseUrl}/clubs/join/${club.value.id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${useCookie('auth_token').value}` }
        })
        toast.success('Permintaan bergabung telah dikirim!')
        membership.value = { status: 'pending', club_id: club.value.id, club_name: club.value.name }
    } catch (err) {
        toast.error(err.data?.error || 'Gagal mengirim permintaan.')
    } finally {
        isJoining.value = false
    }
}

onMounted(async () => {
    if (isLoggedIn.value) {
        try {
            const memberResp = await $fetch(`${config.public.apiBaseUrl}/clubs/my/membership`, {
                headers: { 'Authorization': `Bearer ${useCookie('auth_token').value}` }
            })
            if (memberResp?.data) membership.value = memberResp.data
        } catch { }
    }
})
</script>

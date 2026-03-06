<template>
    <div class="bg-navy-dark min-h-screen flex flex-col selection:bg-primary selection:text-navy-dark">
        <Transition name="fade" mode="out-in">
            <ArcherPageSkeleton v-if="isLoading || !archerResponse" key="skeleton" />
            <div v-else key="content">
                <!-- ── Hero Section ── -->
                <section
                    class="relative min-h-[32rem] w-full overflow-hidden bg-navy-dark pt-28 sm:pt-36 pb-12 sm:pb-20 flex items-end">
                    <img :src="useImageOrDefault(archer.banner_url || archer.avatar_url, archer.full_name)"
                        class="absolute inset-0 w-full h-full object-cover object-top opacity-80"
                        :alt="archer.full_name" />
                    <!-- Permanent Backdrop for content visibility -->
                    <div
                        class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-dark/95 to-transparent pointer-events-none">
                    </div>

                    <div
                        class="relative w-full p-8 sm:p-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-end justify-between gap-8 z-10">
                        <div class="text-white space-y-4 w-full sm:w-auto">
                            <div class="flex flex-wrap items-center gap-4">
                                <span
                                    class="px-4 py-1 bg-primary text-navy-dark text-[10px] font-black rounded-full capitalize tracking-[0.2em]">Atlet
                                    ArcherHub</span>
                                <div v-if="archer.club_name" class="flex items-center gap-1 text-primary">
                                    <Icon icon="ph:shield-star-fill" class="text-lg" />
                                    <span class="text-[10px] font-extrabold uppercase tracking-widest">{{
                                        archer.club_name
                                        }}</span>
                                </div>
                            </div>

                            <div class="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
                                <div
                                    class="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 sm:border-[6px] border-white/20 shadow-2xl overflow-hidden shrink-0 group">
                                    <img :src="useImageOrDefault(archer.avatar_url, archer.full_name)"
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        :alt="archer.full_name" />
                                </div>
                                <h1
                                    class="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter leading-[0.95] break-words">
                                    {{ archer.full_name?.split(' ')[0] }} <br />
                                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">
                                        {{ archer.full_name?.split(' ').slice(1).join(' ') }}
                                    </span>
                                </h1>
                            </div>

                            <div class="flex items-center gap-6 pt-4">
                                <div class="flex items-center gap-2">
                                    <span
                                        class="text-white/60 text-[10px] font-black uppercase tracking-widest">Asal</span>
                                    <span class="font-bold flex items-center gap-2 text-sm">{{ archer.city ||
                                        'Indonesia' }}
                                        🇮🇩</span>
                                </div>
                                <div v-if="bowTypeLabel" class="w-px h-4 bg-white/20"></div>
                                <div v-if="bowTypeLabel" class="flex items-center gap-2">
                                    <span
                                        class="text-white/60 text-[10px] font-black uppercase tracking-widest">Busur</span>
                                    <span class="font-bold uppercase tracking-widest text-sm text-primary">{{
                                        bowTypeLabel
                                        }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ── Main Content ── -->
                <div class="bg-white rounded-t-[3rem] -mt-12 relative z-20">
                    <main class="max-w-7xl mx-auto px-6 md:px-12 py-24">
                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
                            <!-- Left Column -->
                            <div class="lg:col-span-8 space-y-16">
                                <!-- Biography -->
                                <div class="space-y-6">
                                    <h3
                                        class="text-sm font-black uppercase tracking-[0.4em] text-navy/30 flex items-center gap-4">
                                        Biografi <span class="h-px flex-1 bg-gray-100"></span>
                                    </h3>
                                    <p class="text-sm md:text-lg text-navy/80 leading-relaxed font-light">
                                        {{ archer.bio || `${archer.full_name} adalah atlet panahan berdedikasi yang
                                        berkompetisi
                                        di kategori ${bowTypeLabel || 'Recurve'}. Aktif berpartisipasi dalam berbagai
                                        kejuaraan
                                        untuk mengasah kemampuan dan meraih prestasi terbaik.` }}
                                    </p>
                                </div>

                                <!-- Personal Data Grid -->
                                <div class="space-y-8">
                                    <h3
                                        class="text-sm font-black uppercase tracking-[0.4em] text-navy/30 flex items-center gap-4">
                                        Data Atlet <span class="h-px flex-1 bg-gray-100"></span>
                                    </h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div v-if="archer.school"
                                            class="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
                                            <div class="p-3 bg-white rounded-xl shadow-sm">
                                                <Icon icon="ph:student" class="text-xl text-navy" />
                                            </div>
                                            <div>
                                                <p
                                                    class="text-[10px] font-black text-navy/30 uppercase tracking-[0.2em]">
                                                    Pendidikan
                                                </p>
                                                <h5 class="font-bold text-navy mt-1">{{ archer.school }}</h5>
                                            </div>
                                        </div>

                                        <div
                                            class="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
                                            <div class="p-3 bg-white rounded-xl shadow-sm">
                                                <Icon icon="ph:info" class="text-xl text-navy" />
                                            </div>
                                            <div>
                                                <p
                                                    class="text-[10px] font-black text-navy/30 uppercase tracking-[0.2em]">
                                                    Informasi
                                                </p>
                                                <h5 class="font-bold text-navy mt-1">
                                                    {{ archer.gender === 'male' ? 'Laki-laki' : 'Perempuan' }}
                                                    <span v-if="age" class="text-navy/40 ml-1">({{ age }} Tahun)</span>
                                                </h5>
                                            </div>
                                        </div>

                                        <div
                                            class="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
                                            <div class="p-3 bg-white rounded-xl shadow-sm">
                                                <Icon icon="material-symbols:id-card-outline"
                                                    class="text-xl text-navy" />
                                            </div>
                                            <div>
                                                <p
                                                    class="text-[10px] font-black text-navy/30 uppercase tracking-[0.2em]">
                                                    Archer
                                                    ID
                                                </p>
                                                <h5 class="font-bold text-navy mt-1">{{ archer.id }}</h5>
                                            </div>
                                        </div>

                                        <div v-if="archer.address"
                                            class="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
                                            <div class="p-3 bg-white rounded-xl shadow-sm">
                                                <Icon icon="ph:map-pin" class="text-xl text-navy" />
                                            </div>
                                            <div>
                                                <p
                                                    class="text-[10px] font-black text-navy/30 uppercase tracking-[0.2em]">
                                                    Domisili /
                                                    Alamat</p>
                                                <h5 class="font-bold text-navy mt-1 uppercase text-xs">{{ archer.address
                                                    }},
                                                    {{
                                                        archer.city }}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Achievements Full List -->
                                <div v-if="processedAchievements.full.length" class="space-y-8">
                                    <h3
                                        class="text-sm font-black uppercase tracking-[0.4em] text-navy/30 flex items-center gap-4">
                                        Prestasi & Penghargaan <span class="h-px flex-1 bg-gray-100"></span>
                                    </h3>
                                    <div class="grid grid-cols-1 gap-4">
                                        <div v-for="(ach, idx) in processedAchievements.full" :key="idx"
                                            class="p-6 bg-white border border-gray-100 rounded-2xl flex items-center gap-6 shadow-sm hover:border-amber-400 transition-all group">
                                            <div
                                                class="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                                                <Icon icon="ph:medal-fill" class="text-2xl" />
                                            </div>
                                            <h4 class="font-bold text-navy flex-1">{{ ach }}</h4>
                                        </div>
                                    </div>
                                </div>

                                <!-- Event History Table -->
                                <div class="space-y-8">
                                    <div class="flex items-center justify-between">
                                        <h3
                                            class="text-sm font-black uppercase tracking-[0.4em] text-navy/30 flex items-center gap-4 flex-1">
                                            Riwayat Pertandingan <span class="h-px flex-1 bg-gray-100"></span>
                                        </h3>
                                    </div>

                                    <div class="space-y-4">
                                        <div v-for="event in groupedEventHistory.slice(0, 5)" :key="event.id"
                                            class="group bg-white border border-gray-100 p-6 rounded-2xl flex items-center justify-between hover:shadow-xl hover:shadow-navy/5 transition-all cursor-pointer"
                                            @click="router.push(`/events/${event.slug}`)">
                                            <div class="flex items-center gap-6">
                                                <div
                                                    class="w-16 h-16 bg-gray-50 rounded-xl flex flex-col items-center justify-center border border-gray-100 group-hover:border-primary transition-colors">
                                                    <span class="text-[10px] font-black text-navy/40 uppercase">{{
                                                        formatDate(event.date, 'MMM') }}</span>
                                                    <span class="text-2xl font-black text-navy">{{
                                                        formatDate(event.date,
                                                        'DD')
                                                        }}</span>
                                                </div>
                                                <div>
                                                    <h4
                                                        class="font-bold text-lg text-navy group-hover:text-primary transition-colors text-ellipsis overflow-hidden max-w-[200px] sm:max-w-md whitespace-nowrap">
                                                        {{ event.name }}</h4>
                                                    <div class="flex gap-2 mt-1">
                                                        <span v-for="cat in event.categories" :key="cat"
                                                            class="text-[10px] font-bold text-navy/40 uppercase tracking-wider">{{
                                                                cat }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex flex-col items-end">
                                                <span
                                                    class="text-[10px] font-black uppercase tracking-widest text-navy/20 mb-1">Rank</span>
                                                <span class="text-2xl font-black text-navy italic">#{{ event.rank
                                                    }}</span>
                                            </div>
                                        </div>

                                        <div v-if="groupedEventHistory.length === 0"
                                            class="py-16 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                            <p class="text-xs font-black text-navy/20 uppercase tracking-[0.3em]">Belum
                                                ada
                                                riwayat kompetisi</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column -->
                            <div class="lg:col-span-4 space-y-12">
                                <!-- Achievements Highlights -->
                                <div v-if="processedAchievements.highlights.length" class="space-y-6">
                                    <h3 class="text-sm font-black uppercase tracking-[0.4em] text-navy/30">Top
                                        Highlights
                                    </h3>
                                    <div
                                        class="bg-navy p-8 rounded-3xl text-white space-y-6 shadow-sm relative overflow-hidden group">
                                        <Icon icon="ph:star-fill"
                                            class="absolute -right-8 -bottom-8 text-white/5 text-9xl rotate-12 transition-transform group-hover:scale-110" />
                                        <div class="relative z-10 space-y-4">
                                            <div v-for="(ach, idx) in processedAchievements.highlights" :key="idx"
                                                class="flex items-start gap-3">
                                                <Icon icon="ph:caret-right-bold" class="text-primary mt-1 shrink-0" />
                                                <p class="text-sm font-bold leading-relaxed text-white/90">{{ ach }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Equipment -->
                                <div v-if="archer.equipment" class="space-y-6">
                                    <h3 class="text-sm font-black uppercase tracking-[0.4em] text-navy/30">Peralatan
                                        (Gear)
                                    </h3>
                                    <div class="space-y-3">
                                        <template v-for="(gear, idx) in archer.equipment.split('\n')" :key="idx">
                                            <div v-if="gear.trim()"
                                                class="p-5 border border-gray-100 rounded-2xl bg-white hover:border-primary transition-colors shadow-sm">
                                                <p class="text-xs font-black text-navy leading-tight">{{ gear.trim() }}
                                                </p>
                                                <p class="text-[9px] text-navy/30 uppercase tracking-widest mt-1.5">
                                                    Primary
                                                    Equipment</p>
                                            </div>
                                        </template>
                                    </div>
                                </div>

                                <!-- Kontak & Sosial -->
                                <div class="space-y-6">
                                    <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-navy/20">Kontak &
                                        Media
                                        Sosial
                                    </h3>
                                    <div class="space-y-3">
                                        <a v-if="archer.social_instagram"
                                            :href="`https://instagram.com/${archer.social_instagram.replace('@', '')}`"
                                            target="_blank"
                                            class="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-white hover:border-primary transition-all group">
                                            <div
                                                class="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                                                <Icon icon="ph:instagram-logo-bold" class="text-xl" />
                                            </div>
                                            <div class="flex-1">
                                                <p
                                                    class="text-[10px] font-black text-navy/40 uppercase tracking-widest">
                                                    Instagram</p>
                                                <p class="text-xs font-bold text-navy">{{ archer.social_instagram }}</p>
                                            </div>
                                        </a>

                                        <a v-if="archer.social_tiktok"
                                            :href="`https://tiktok.com/@${archer.social_tiktok.replace('@', '')}`"
                                            target="_blank"
                                            class="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-white hover:border-primary transition-all group">
                                            <div
                                                class="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-white transition-colors">
                                                <Icon icon="ph:tiktok-logo-bold" class="text-xl" />
                                            </div>
                                            <div class="flex-1">
                                                <p
                                                    class="text-[10px] font-black text-navy/40 uppercase tracking-widest">
                                                    TikTok
                                                </p>
                                                <p class="text-xs font-bold text-navy">{{ archer.social_tiktok }}</p>
                                            </div>
                                        </a>

                                        <a v-if="archer.social_whatsapp"
                                            :href="`https://wa.me/${archer.social_whatsapp.replace(/[^0-9]/g, '')}`"
                                            target="_blank"
                                            class="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-white hover:border-primary transition-all group">
                                            <div
                                                class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                                <Icon icon="ph:whatsapp-logo-bold" class="text-xl" />
                                            </div>
                                            <div class="flex-1">
                                                <p
                                                    class="text-[10px] font-black text-navy/40 uppercase tracking-widest">
                                                    WhatsApp</p>
                                                <p class="text-xs font-bold text-navy">{{ archer.social_whatsapp }}</p>
                                            </div>
                                        </a>

                                        <a v-if="archer.social_facebook"
                                            :href="archer.social_facebook.startsWith('http') ? archer.social_facebook : `https://facebook.com/${archer.social_facebook}`"
                                            target="_blank"
                                            class="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-white hover:border-primary transition-all group">
                                            <div
                                                class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <Icon icon="ph:facebook-logo-bold" class="text-xl" />
                                            </div>
                                            <div class="flex-1">
                                                <p
                                                    class="text-[10px] font-black text-navy/40 uppercase tracking-widest">
                                                    Facebook</p>
                                                <p class="text-xs font-bold text-navy">{{ archer.social_facebook }}</p>
                                            </div>
                                        </a>

                                        <a v-if="archer.social_twitter"
                                            :href="`https://twitter.com/${archer.social_twitter.replace('@', '')}`"
                                            target="_blank"
                                            class="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-white hover:border-primary transition-all group">
                                            <div
                                                class="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-800 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                                <Icon icon="ph:twitter-logo-bold" class="text-xl" />
                                            </div>
                                            <div class="flex-1">
                                                <p
                                                    class="text-[10px] font-black text-navy/40 uppercase tracking-widest">
                                                    Twitter
                                                    (X)</p>
                                                <p class="text-xs font-bold text-navy">{{ archer.social_twitter }}</p>
                                            </div>
                                        </a>

                                        <button @click="openShareDialog"
                                            class="w-full flex items-center justify-center gap-3 py-3 px-4 bg-navy rounded-xl text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-navy-dark transition-all shadow-sm shadow-navy/20">
                                            <Icon icon="ph:share-network-bold" class="text-sm" />
                                            Bagikan Profil Atlet
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                <!-- ── Share Dialog ── -->
                <Transition name="modal">
                    <div v-if="showShareDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div @click="closeShareDialog" class="absolute inset-0 bg-[#0e1e3a]/80 backdrop-blur-sm"></div>
                        <div
                            class="relative w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 z-10">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-xl font-black text-[#0e1e3a]">Bagikan Profil</h3>
                                <button @click="closeShareDialog"
                                    class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-[#0e1e3a] hover:bg-gray-200 transition-colors">
                                    <Icon icon="ph:x-bold" />
                                </button>
                            </div>

                            <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                                <div
                                    class="w-14 h-14 rounded-full overflow-hidden border-2 border-[#c3f53c] flex-shrink-0">
                                    <img :src="useImageOrDefault(archer.photo_url || archer.avatar_url, archer.full_name)"
                                        class="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Profil
                                        Atlet
                                    </p>
                                    <p class="font-black text-[#0e1e3a] text-base">{{ archer.full_name }}</p>
                                    <p v-if="shareMetaLine" class="text-xs text-slate-500">{{ shareMetaLine }}</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-4 gap-3 mb-6">
                                <button v-for="plat in platforms" :key="plat.id" @click="shareTo(plat.id)"
                                    class="flex flex-col items-center gap-2 group">
                                    <div :class="`w-12 h-12 rounded-xl ${plat.bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-all`"
                                        v-html="plat.iconHtml"></div>
                                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider">{{
                                        plat.name
                                        }}</span>
                                </button>
                            </div>

                            <div class="flex gap-2">
                                <input type="text" readonly :value="shareUrl"
                                    class="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-slate-500 outline-none" />
                                <button @click="copyLink"
                                    class="px-4 py-3 bg-[#0e1e3a] text-white rounded-xl text-xs font-black hover:bg-[#1a365d] transition-colors whitespace-nowrap">
                                    {{ copied ? '✓ Tersalin' : 'Salin' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDateFormat } from '@vueuse/core'
import { getBowIcon } from '~/utils/bowIcons'

definePageMeta({ layout: 'landing' })

const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

useHead({
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ]
})

// ── Data Fetching ──
const { data: archerResponse, error: archerError, pending: isLoading } = useAsyncData(
    `archer-${route.params.slug}`,
    async () => {
        const [archerData, eventsData] = await Promise.all([
            $fetch(`${apiBaseUrl}/archers/${route.params.slug}`),
            $fetch(`${apiBaseUrl}/archers/${route.params.slug}/events`).catch(() => ({ events: [] }))
        ])
        return { archer: archerData, events: eventsData.events || [] }
    },
    { lazy: true, server: true }
)

// Throw 404 if archer not found (only after loading is complete)
watchEffect(() => {
    if (!isLoading.value && archerResponse.value && (archerError.value || !archerResponse.value?.archer?.full_name)) {
        if (process.client) {
            throw createError({ statusCode: 404, statusMessage: 'Profil Atlet Tidak Ditemukan', fatal: true })
        }
    }
})

const archer = computed(() => archerResponse.value?.archer || {})
const eventHistory = computed(() => archerResponse.value?.events || [])

const formatEventCategoryLabel = (event) => {
    const parts = [
        event?.division_name,
        event?.category_name,
        event?.gender_division_name
    ].filter(Boolean)

    if (event?.event_type_name && event.event_type_name !== 'Individual') {
        parts.push(`(${event.event_type_name})`)
    }

    return parts.join(' ')
}

const groupedEventHistory = computed(() => {
    const grouped = new Map()

    eventHistory.value.forEach((event) => {
        if (!event?.id) return

        if (!grouped.has(event.id)) {
            grouped.set(event.id, {
                id: event.id,
                slug: event.slug || event.id,
                name: event.name,
                city: event.city,
                date: event.date,
                categories: []
            })
        }

        const categoryLabel = formatEventCategoryLabel(event)
        if (categoryLabel) {
            const existing = grouped.get(event.id)
            if (!existing.categories.includes(categoryLabel)) {
                existing.categories.push(categoryLabel)
            }
        }
    })

    return Array.from(grouped.values())
})

useSeoMeta({
    title: () => archer.value?.full_name
        ? `${archer.value.full_name} — Profil Atlet Panahan | Archeryhub.id`
        : 'Profil Atlet Panahan — Archeryhub.id',
    description: () => archer.value?.full_name
        ? `Lihat profil ${archer.value.full_name}${archer.value.bow_type ? `, atlet panahan ${archer.value.bow_type}` : ''}${archer.value.city ? ` dari ${archer.value.city}` : ''}. Statistik, riwayat event, dan prestasi lengkap di Archeryhub.id.`
        : 'Profil atlet panahan Indonesia di Archeryhub.id',
})

// ── Computed Labels ──
const age = computed(() => {
    if (!archer.value?.date_of_birth) return null
    const birthDate = new Date(archer.value.date_of_birth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return age
})

const bowTypes = computed(() => {
    if (!archer.value?.bow_type) return []
    const raw = archer.value.bow_type.split(',').map(s => s.trim().toLowerCase())
    const labels = {
        recurve: 'Recurve',
        compound: 'Compound',
        barebow: 'Barebow',
        traditional: 'Traditional',
        standard: 'Standard',
        nasional: 'Nasional'
    }
    return raw.map(type => ({
        id: type,
        label: labels[type] || type.charAt(0).toUpperCase() + type.slice(1),
        icon: getBowIcon(type)
    }))
})

const bowTypeLabel = computed(() => bowTypes.value.map(t => t.label).join(', '))

const genderLabel = computed(() =>
    archer.value?.gender === 'male' ? 'Laki-laki'
        : archer.value?.gender === 'female' ? 'Perempuan' : '')

const processedAchievements = computed(() => {
    if (!archer.value?.achievements) return { highlights: [], full: [] }
    const lines = archer.value.achievements.split('\n').filter(l => l.trim() !== '')
    const highlights = lines.filter(l => l.startsWith('[H] ')).map(l => l.replace('[H] ', '')).slice(0, 3)
    const full = lines.map(l => l.replace('[H] ', ''))
    return { highlights, full }
})

const hasExperience = computed(() =>
    archer.value?.experience_years !== null &&
    archer.value?.experience_years !== undefined &&
    archer.value?.experience_years !== '')

const shareMetaLine = computed(() =>
    [bowTypeLabel.value, archer.value?.city].filter(Boolean).join(' • '))

const formatDate = (date, format = 'DD MMMM YYYY') => {
    if (!date) return ''
    return useDateFormat(date, format, { locales: 'id-ID' }).value
}

// ── Performance Chart ──
const perfBars = computed(() => {
    const events = eventHistory.value
    if (!events.length) return []
    const scored = events
        .filter(e => e.total_score || e.qualification_score)
        .slice(-6)
        .map(e => ({
            score: e.total_score || e.qualification_score || 0,
            label: formatDate(e.date, 'MMM YY')
        }))
    if (!scored.length) return []
    const max = Math.max(...scored.map(s => s.score))
    const min = Math.min(...scored.map(s => s.score))
    return scored.map(s => ({
        ...s,
        pct: max > 0 ? Math.max(15, Math.round(((s.score - min * 0.95) / (max * 1.05 - min * 0.95)) * 85) + 10) : 50
    }))
})

const perfMax = computed(() => perfBars.value.length ? Math.max(...perfBars.value.map(b => b.score)) : 0)
const perfMin = computed(() => perfBars.value.length ? Math.min(...perfBars.value.map(b => b.score)) : 0)

// ── Share System ──
const showShareDialog = ref(false)
const copied = ref(false)
const shareUrl = computed(() => typeof window !== 'undefined' ? window.location.href : '')

const openShareDialog = () => showShareDialog.value = true
const closeShareDialog = () => { showShareDialog.value = false; copied.value = false }

const platforms = [
    { id: 'whatsapp', name: 'WhatsApp', bg: 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white', iconHtml: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.038 3.069l-.669 2.445 2.511-.659c.722.451 1.591.696 2.891.696 3.128 0 5.768-2.586 5.768-5.766 0-3.18-2.585-5.766-5.762-5.766zm3.369 8.303c-.144.405-.842.755-1.168.807-.326.052-.728.093-2.185-.484-1.85-.733-3.038-2.613-3.13-2.733-.093-.12-.76-.997-.76-1.996 0-1 .475-1.5.692-1.742.176-.192.42-.312.693-.312s.273.012.396.024c.123 0 .285-.048.438.312.153.36.525 1.261.57 1.356.045.093.076.204.015.324-.312.612-.342.66-.45.804-.108.144-.225.216-.108.408.117.192.52.852 1.118 1.38.77.684 1.411.897 1.613.997.202.102.321.084.441-.054.12-.138.514-.594.651-.798.136-.204.272-.171.459-.102.187.069 1.187.561 1.391.663z"/></svg>' },
    { id: 'facebook', name: 'Facebook', bg: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white', iconHtml: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>' },
    { id: 'twitter', name: 'X', bg: 'bg-slate-50 text-slate-800 hover:bg-slate-800 hover:text-white', iconHtml: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' },
    { id: 'copy', name: 'Salin', bg: 'bg-gray-100 text-slate-600 hover:bg-[#0e1e3a] hover:text-white', iconHtml: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10"/></svg>' }
]

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(shareUrl.value)
        copied.value = true
        setTimeout(() => copied.value = false, 2000)
    } catch { }
}

const shareTo = (platform) => {
    if (platform === 'copy') return copyLink()
    const text = encodeURIComponent(`Profil Atlet Panahan: ${archer.value?.full_name} | Archery Hub Indonesia`)
    const url = encodeURIComponent(shareUrl.value)
    let link = ''
    if (platform === 'whatsapp') link = `https://wa.me/?text=${text}%20${url}`
    else if (platform === 'facebook') link = `https://www.facebook.com/sharer/sharer.php?u=${url}`
    else if (platform === 'twitter') link = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
    if (link) { window.open(link, '_blank', 'noopener,noreferrer'); closeShareDialog() }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

* {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>

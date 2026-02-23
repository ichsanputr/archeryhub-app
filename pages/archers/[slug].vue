<template>
    <div class="bg-white min-h-screen flex flex-col">
        <!-- ── Hero Section ── -->
        <div class="bg-navy relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
            <!-- Decorative Elements -->
            <div class="absolute inset-0 z-0 opacity-20">
                <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent"></div>
                <div class="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary/10 to-transparent">
                </div>
            </div>

            <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12">
                    <!-- Photo -->
                    <div class="relative group">
                        <div
                            class="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl bg-navy-dark relative z-10">
                            <img :src="useImageOrDefault(archer.photo_url || archer.avatar_url, archer.full_name)"
                                :alt="archer.full_name"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <!-- Background Ornament -->
                        <div
                            class="absolute -inset-4 bg-primary/20 blur-2xl rounded-full -z-0 opacity-50 group-hover:opacity-100 transition-opacity">
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="flex-1 text-center md:text-left text-white">
                        <div
                            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6 group hover:border-primary/50 transition-colors">
                            <span class="text-sm">🇮🇩</span>
                            <span class="text-[10px] font-black tracking-[0.2em] uppercase text-white/80">Indonesia • {{
                                archer.city || 'Atlet Nasional' }}</span>
                        </div>

                        <h1
                            class="text-2xl sm:text-4xl font-black tracking-tight leading-none mb-6 uppercase break-words drop-shadow-lg">
                            {{ archer.full_name }}
                        </h1>

                        <div
                            class="flex flex-wrap justify-center md:justify-start items-center gap-x-8 gap-y-4 mb-10 text-white/90">
                            <div class="flex items-center gap-6">
                                <template v-for="(type, idx) in bowTypes" :key="type.id">
                                    <div class="flex items-center gap-2.5 group/bow">
                                        <img :src="`/${type.icon}`"
                                            class="w-5 h-5 brightness-0 invert opacity-70 group-hover/bow:opacity-100 transition-opacity" />
                                        <span class="font-black uppercase tracking-[0.15em] text-[10px]">{{ type.label
                                        }}</span>
                                        <span v-if="idx < bowTypes.length - 1"
                                            class="text-white/20 ml-2 font-light">•</span>
                                    </div>
                                </template>
                            </div>
                            <div v-if="archer.club_name"
                                class="flex items-center gap-2.5 group cursor-pointer md:border-l md:border-white/10 md:pl-8"
                                @click="archer.club_slug && router.push(`/clubs/${archer.club_slug}`)">
                                <Icon icon="ph:buildings-bold" class="text-primary text-xl" />
                                <span
                                    class="font-bold text-white/80 group-hover:text-primary transition-colors tracking-tight">{{
                                        archer.club_name
                                    }}</span>
                            </div>
                        </div>

                        <div class="flex flex-wrap justify-center md:justify-start gap-4">
                            <button @click="openShareDialog"
                                class="h-12 px-8 rounded-xl bg-white/5 border border-white/10 hover:border-primary hover:bg-primary hover:text-navy transition-all flex items-center justify-center gap-3 group backdrop-blur-md">
                                <Icon icon="ph:share-network-bold"
                                    class="text-xl group-hover:scale-110 transition-transform" />
                                <span class="font-black uppercase tracking-wider text-xs">Bagikan Profil</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Stats Header ── -->
        <div class="bg-navy-dark border-y border-white/5 py-8 relative z-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div class="text-center md:text-left border-r border-white/10 pr-4 last:border-0">
                        <p class="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Total Event</p>
                        <p class="text-3xl font-black text-primary">{{ groupedEventHistory.length }}</p>
                    </div>
                    <div class="text-center md:text-left border-r border-white/10 pr-4 last:border-0">
                        <p class="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Pengalaman</p>
                        <p class="text-3xl font-black text-primary">{{ hasExperience ? archer.experience_years : '—' }}
                            <span class="text-xs font-bold text-white/40 uppercase">Thn</span>
                        </p>
                    </div>
                    <div class="text-center md:text-left border-r border-white/10 pr-4 last:border-0">
                        <p class="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Gender</p>
                        <p class="text-3xl font-black text-primary">{{ genderLabel || '—' }}</p>
                    </div>
                    <div class="text-center md:text-left last:border-0">
                        <p class="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Klub</p>
                        <p class="text-xl font-black text-primary truncate" :title="archer.club_name">{{
                            archer.club_name || 'Mandiri' }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Main Content ── -->
        <main class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-24">
            <!-- ── About & Info ── -->
            <section class="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <!-- Bio -->
                <div class="lg:col-span-12 space-y-8">
                    <div class="flex items-center gap-3 mb-8">
                        <span class="bg-navy p-1.5 rounded text-primary flex items-center">
                            <Icon icon="ph:user-bold" class="text-sm" />
                        </span>
                        <h2 class="text-2xl font-black uppercase tracking-tight">Biografi & Perjalanan</h2>
                    </div>
                    <div class="prose prose-slate max-w-none">
                        <p class="text-lg text-[#64748b] leading-relaxed font-medium">
                            {{ archer.bio || `${archer.full_name} adalah atlet panahan berdedikasi yang berkompetisi di
                            kategori ${bowTypeLabel}. Aktif berpartisipasi dalam berbagai kejuaraan nasional untuk
                            mengasah kemampuan dan meraih prestasi terbaik.` }}
                        </p>
                    </div>

                    <!-- Achievements Section -->
                    <div v-if="archer.achievements" class="pt-8">
                        <div class="flex items-center gap-3 mb-6">
                            <span class="bg-navy p-1.5 rounded text-primary flex items-center">
                                <Icon icon="ph:medal-bold" class="text-sm" />
                            </span>
                            <h2 class="text-xl font-black uppercase tracking-tight">Prestasi & Penghargaan</h2>
                        </div>
                        <div
                            class="bg-gray-50 p-6 rounded-2xl border border-gray-100 italic text-[#64748b] whitespace-pre-line font-medium leading-relaxed">
                            {{ archer.achievements }}
                        </div>
                    </div>

                    <!-- Equipment Section -->
                    <div v-if="archer.equipment" class="pt-8">
                        <div class="flex items-center gap-3 mb-6">
                            <span class="bg-navy p-1.5 rounded text-primary flex items-center">
                                <Icon icon="ph:bow-arrow-bold" class="text-sm" />
                            </span>
                            <h2 class="text-xl font-black uppercase tracking-tight">Peralatan Panahan</h2>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                                <Icon icon="ph:gear-bold" class="text-2xl text-primary" />
                                <span class="text-[#64748b] font-medium">{{ archer.equipment }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Social Media Links -->
                    <div v-if="archer.social_instagram || archer.social_tiktok || archer.social_whatsapp" class="pt-8">
                        <div class="flex items-center gap-3 mb-6">
                            <span class="bg-navy p-1.5 rounded text-primary flex items-center">
                                <Icon icon="ph:share-network-bold" class="text-sm" />
                            </span>
                            <h2 class="text-xl font-black uppercase tracking-tight">Sosial & Kontak</h2>
                        </div>
                        <div class="flex flex-wrap gap-4">
                            <a v-if="archer.social_whatsapp"
                                :href="`https://wa.me/${archer.social_whatsapp.replace(/[^0-9]/g, '')}`" target="_blank"
                                class="flex items-center gap-3 px-6 py-3 bg-green-50 text-green-700 rounded-xl border border-green-100 hover:bg-green-100 transition-all font-bold">
                                <Icon icon="ph:whatsapp-logo-bold" class="text-xl" />
                                WhatsApp
                            </a>
                            <a v-if="archer.social_instagram"
                                :href="`https://instagram.com/${archer.social_instagram.replace('@', '')}`"
                                target="_blank"
                                class="flex items-center gap-3 px-6 py-3 bg-pink-50 text-pink-700 rounded-xl border border-pink-100 hover:bg-pink-100 transition-all font-bold">
                                <Icon icon="ph:instagram-logo-bold" class="text-xl" />
                                Instagram
                            </a>
                            <a v-if="archer.social_tiktok"
                                :href="`https://tiktok.com/@${archer.social_tiktok.replace('@', '')}`" target="_blank"
                                class="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-xl hover:opacity-80 transition-all font-bold">
                                <Icon icon="ph:tiktok-logo-bold" class="text-xl" />
                                TikTok
                            </a>
                        </div>
                    </div>

                    <!-- Additional Details Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-gray-100 mt-8">
                        <div v-if="archer.date_of_birth"
                            class="p-6 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-primary/50 transition-colors">
                            <p class="text-[10px] font-black text-[#64748b] uppercase tracking-widest mb-2">Tanggal
                                Lahir</p>
                            <p class="text-lg font-black text-navy">{{ formatDate(archer.date_of_birth) }}</p>
                        </div>
                        <div v-if="archer.id"
                            class="p-6 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-primary/50 transition-colors">
                            <p class="text-[10px] font-black text-[#64748b] uppercase tracking-widest mb-2">ID Atlet</p>
                            <p class="text-lg font-black text-navy font-mono">{{ archer.id }}</p>
                        </div>
                        <div v-if="archer.city"
                            class="p-6 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-primary/50 transition-colors">
                            <p class="text-[10px] font-black text-[#64748b] uppercase tracking-widest mb-2">Kota Asal
                            </p>
                            <p class="text-lg font-black text-navy">{{ archer.city }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <div class="border-t border-[#0f172a]/10"></div>

            <!-- ── Performance Section ── -->
            <section class="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div class="space-y-8">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="bg-navy p-1.5 rounded text-primary flex items-center">
                            <Icon icon="ph:chart-line-up-bold" class="text-sm" />
                        </span>
                        <h2 class="text-2xl font-black uppercase tracking-tight">Tren Performa</h2>
                    </div>
                    <p class="text-[#64748b] font-medium leading-relaxed">
                        Analisis data skor dari 6 event terakhir untuk memantau konsistensi dan perkembangan akurasi
                        bidikan.
                    </p>

                    <div class="bg-gray-50 p-8 rounded-3xl overflow-hidden border border-gray-100 relative group">
                        <template v-if="perfBars.length > 0">
                            <div class="relative h-64 w-full flex items-end justify-between gap-3 pt-12">
                                <div v-for="(bar, i) in perfBars" :key="i"
                                    class="relative flex flex-col items-center justify-end h-full w-full group/bar">
                                    <div class="w-full rounded-t-xl relative transition-all duration-500 delay-[i*100ms]"
                                        :class="i === perfBars.length - 1 ? 'bg-navy' : 'bg-navy/10 group-hover/bar:bg-navy/30'"
                                        :style="{ height: bar.pct + '%' }">
                                        <div
                                            class="absolute -top-10 left-1/2 -translate-x-1/2 bg-navy border border-white/20 text-white text-[10px] font-black py-1.5 px-3 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all scale-75 group-hover/bar:scale-100 whitespace-nowrap shadow-xl">
                                            Skor: {{ bar.score }}
                                        </div>
                                    </div>
                                    <span
                                        class="text-[9px] text-[#64748b] font-black mt-4 uppercase tracking-widest text-center truncate w-full">{{
                                            bar.label }}</span>
                                </div>
                            </div>
                        </template>
                        <div v-else class="h-64 flex flex-col items-center justify-center text-gray-300">
                            <Icon icon="ph:chart-bar-light" class="text-6xl mb-4 opacity-50" />
                            <p class="text-xs font-black uppercase tracking-[0.3em]">Data skor belum tersedia</p>
                        </div>
                    </div>
                </div>

                <!-- Riwayat Summary -->
                <div class="space-y-8">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="bg-navy p-1.5 rounded text-primary flex items-center">
                            <Icon icon="ph:scroll-bold" class="text-sm" />
                        </span>
                        <h2 class="text-2xl font-black uppercase tracking-tight">Perjalanan Karier</h2>
                    </div>
                    <div class="space-y-6">
                        <template v-if="groupedEventHistory.length">
                            <div v-for="(event, idx) in groupedEventHistory.slice(0, 3)" :key="event.id"
                                class="flex gap-6 relative">
                                <div v-if="idx < 2" class="absolute left-6 top-10 bottom-0 w-px bg-gray-100"></div>
                                <div
                                    class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 z-10 group-hover:border-primary transition-colors">
                                    <Icon icon="ph:medal-bold" class="text-navy text-xl" />
                                </div>
                                <div class="pb-8">
                                    <p class="text-[10px] font-black text-[#64748b] uppercase tracking-widest mb-1">{{
                                        formatDate(event.date, 'MMMM YYYY') }}</p>
                                    <h4 class="text-lg font-black text-navy mb-2">{{ event.name }}</h4>
                                    <div class="flex flex-wrap gap-2">
                                        <span v-for="cat in event.categories" :key="cat"
                                            class="text-[10px] font-bold bg-[#0f172a]/5 px-2 py-0.5 rounded uppercase text-[#64748b] tracking-wider">{{
                                                cat }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <div v-else
                            class="py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <p class="text-xs font-black text-[#64748b] uppercase tracking-widest">Belum ada riwayat
                                resmi</p>
                        </div>
                    </div>
                </div>
            </section>

            <div class="border-t border-[#0f172a]/10"></div>

            <!-- ── Full History Table ── -->
            <section class="space-y-12">
                <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div>
                        <div class="flex items-center gap-3 mb-3">
                            <span class="bg-navy p-1.5 rounded text-primary flex items-center">
                                <Icon icon="ph:table-bold" class="text-sm" />
                            </span>
                            <h2 class="text-2xl font-black uppercase tracking-tight">Arsip Pertandingan</h2>
                        </div>
                        <p class="text-[#64748b] font-medium uppercase text-[10px] tracking-widest">Catatan Lengkap
                            Partisipasi
                            Event</p>
                    </div>
                    <div class="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                        <span class="text-navy font-black text-2xl">{{ groupedEventHistory.length }}</span>
                        <span class="text-[#64748b] font-black text-[10px] uppercase tracking-widest ml-2">Total
                            Event</span>
                    </div>
                </div>

                <div class="overflow-x-auto -mx-4 sm:mx-0">
                    <div class="inline-block min-w-full align-middle">
                        <div class="overflow-hidden border border-gray-100 rounded-3xl shadow-sm">
                            <table class="min-w-full divide-y divide-gray-100 bg-white">
                                <thead class="bg-gray-50/50">
                                    <tr>
                                        <th
                                            class="px-8 py-5 text-left text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em]">
                                            Nama Event</th>
                                        <th
                                            class="px-8 py-5 text-left text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em]">
                                            Lokasi / Tanggal</th>
                                        <th
                                            class="px-8 py-5 text-left text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em]">
                                            Kategori</th>
                                        <th
                                            class="px-8 py-5 text-right text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em]">
                                            Hasil</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    <tr v-for="event in groupedEventHistory" :key="event.id"
                                        class="group hover:bg-gray-50/50 transition-colors">
                                        <td class="px-8 py-6 cursor-pointer"
                                            @click="router.push(`/events/${event.slug}`)">
                                            <p
                                                class="text-sm font-black text-navy group-hover:text-primary transition-colors">
                                                {{
                                                    event.name }}</p>
                                        </td>
                                        <td class="px-8 py-6">
                                            <p class="text-xs font-bold text-navy/70 mb-1 uppercase tracking-wider">{{
                                                event.city ||
                                                '—' }}</p>
                                            <p class="text-[10px] font-black text-[#64748b] uppercase tracking-widest">
                                                {{
                                                    formatDate(event.date, 'DD MMM YYYY') }}</p>
                                        </td>
                                        <td class="px-8 py-6">
                                            <div class="flex flex-wrap gap-1.5">
                                                <span v-for="cat in event.categories" :key="cat"
                                                    class="px-2 py-1 bg-navy/5 text-navy text-[9px] font-black uppercase tracking-wider rounded-lg">
                                                    {{ cat }}
                                                </span>
                                            </div>
                                        </td>
                                        <td class="px-8 py-6 text-right">
                                            <div
                                                class="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                <Icon icon="ph:check-circle-bold" />
                                                Finish
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </main>



        <!-- ── Share Dialog ── -->
        <Transition name="modal">
            <div v-if="showShareDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div @click="closeShareDialog" class="absolute inset-0 bg-[#0e1e3a]/80 backdrop-blur-sm"></div>
                <div class="relative w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 z-10">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-black text-[#0e1e3a]">Bagikan Profil</h3>
                        <button @click="closeShareDialog"
                            class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-[#0e1e3a] hover:bg-gray-200 transition-colors">
                            <Icon icon="ph:x-bold" />
                        </button>
                    </div>

                    <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                        <div class="w-14 h-14 rounded-full overflow-hidden border-2 border-[#c3f53c] flex-shrink-0">
                            <img :src="useImageOrDefault(archer.photo_url || archer.avatar_url, archer.full_name)"
                                class="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Profil Atlet</p>
                            <p class="font-black text-[#0e1e3a] text-base">{{ archer.full_name }}</p>
                            <p v-if="shareMetaLine" class="text-xs text-slate-500">{{ shareMetaLine }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-4 gap-3 mb-6">
                        <button v-for="plat in platforms" :key="plat.id" @click="shareTo(plat.id)"
                            class="flex flex-col items-center gap-2 group">
                            <div :class="`w-12 h-12 rounded-xl ${plat.bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-all`"
                                v-html="plat.iconHtml"></div>
                            <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider">{{ plat.name
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
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
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
const { data: archerResponse } = await useAsyncData(
    `archer-${route.params.slug}`,
    async () => {
        try {
            const [archerData, eventsData] = await Promise.all([
                $fetch(`${apiBaseUrl}/archers/${route.params.slug}`),
                $fetch(`${apiBaseUrl}/archers/${route.params.slug}/events`).catch(() => ({ events: [] }))
            ])
            return { archer: archerData, events: eventsData.events || [] }
        } catch {
            throw createError({ statusCode: 404, statusMessage: 'Profil Atlet Tidak Ditemukan' })
        }
    },
    { server: true }
)

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

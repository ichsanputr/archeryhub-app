<template>
    <div class="min-h-screen bg-background-light font-body text-navy">
        <!-- Hero Header -->
        <div class="bg-navy relative overflow-hidden h-[400px] md:h-[500px] flex items-center">
            <div class="absolute inset-0 z-0">
                <img :alt="tournament.name" class="w-full h-full object-cover object-center" :src="tournament.image" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                </div>
            </div>
            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4 md:mt-6">
                <!-- Breadcrumb -->
                <div class="mb-8">
                    <Breadcrumbs :items="[{ label: 'Event', path: '/events' }]" :current="tournament.name || 'Event'"
                        class="!text-gray-300" />
                </div>

                <div class="flex flex-col lg:flex-row items-end justify-between gap-8 mb-12">
                    <div class="max-w-3xl">
                        <div v-if="tournament.status === 'ongoing' || tournament.status === 'live'"
                            class="flex items-center gap-3 mb-4">
                            <span
                                class="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-700 text-xs font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Sedang
                                Berlangsung
                            </span>
                        </div>
                        <h1
                            class="text-white text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6 font-display">
                            {{ tournament.name }}
                        </h1>
                        <div class="flex flex-wrap items-center gap-6 text-white/80 text-base">
                            <div class="flex items-center gap-2">
                                <Icon icon="ph:calendar-blank" class="text-primary" />
                                <span>{{ tournament.date }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <Icon icon="ph:map-pin" class="text-primary" />
                                <span>{{ tournament.location }}</span>
                                <a v-if="tournament.gmaps_link" :href="tournament.gmaps_link" target="_blank"
                                    class="text-xs text-primary hover:underline flex items-center gap-1 ml-2 font-bold">
                                    (Lihat di Peta)
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sticky Tabs -->
        <div class="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center gap-1 overflow-x-auto no-scrollbar -mb-px">
                    <button v-for="tab in tabs" :key="tab"
                        @click="navigateTo({ query: { ...route.query, tab } }, { replace: true })"
                        class="px-4 md:px-6 py-3 md:py-4 font-semibold text-sm md:text-base transition-colors whitespace-nowrap border-b-2"
                        :class="activeTab === tab ? 'text-navy border-primary bg-primary/5' : 'text-gray-500 border-transparent hover:text-navy hover:bg-gray-50'">
                        {{ tab }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <main class="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div
                :class="activeTab === 'Hasil' ? 'grid grid-cols-1' : 'grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12'">
                <!-- Left Column -->
                <div :class="activeTab === 'Hasil' ? 'space-y-10' : 'lg:col-span-2 space-y-10'">
                    <div v-if="activeTab === 'Ringkasan'" class="space-y-8">
                        <!-- Event Description Section -->
                        <section v-if="tournament.description"
                            class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 class="text-xl font-bold text-navy mb-6 flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">info</span>
                                Tentang Event
                            </h2>
                            <div class="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                                {{ tournament.description }}
                            </div>
                        </section>

                        <!-- About Section -->
                        <section class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <div v-if="tournament.thumbnail" class="mb-6">
                                <img :src="tournament.thumbnail" :alt="tournament.name"
                                    class="w-full h-64 object-cover rounded-xl" />
                            </div>
                            <h2 class="text-xl font-bold text-navy mb-6 flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">info</span>
                                Tentang Turnamen
                            </h2>
                            <div class="prose max-w-none text-gray-600 leading-relaxed space-y-4">
                                <p>
                                    <strong>{{ tournament.name }}</strong> adalah salah satu event panahan terkemuka
                                    tahun
                                    ini,
                                    mengumpulkan talenta-talenta terbaik dari seluruh nusantara dan negara-negara
                                    tetangga.
                                    Diselenggarakan di {{ tournament.venue }} yang bergengsi, acara ini berfungsi
                                    sebagai
                                    babak kualifikasi
                                    untuk Asian Archery Cup yang akan datang.
                                </p>
                                <p>
                                    Peserta akan berkompetisi dalam kondisi kelas dunia yang mengikuti standar World
                                    Archery.
                                    Tahun ini, kami memperkenalkan format tim campuran baru untuk divisi Compound,
                                    menjanjikan pertandingan yang lebih seru dan menegangkan.
                                </p>
                                <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-6">
                                    <h4 class="font-bold text-navy mb-2">Buku Panduan Teknis</h4>
                                    <p class="text-sm text-gray-600 mb-3">Unduh buku panduan teknis lengkap
                                        yang berisi peraturan, regulasi, dan jadwal detail.</p>
                                    <button
                                        class="text-navy font-bold text-sm hover:underline inline-flex items-center gap-1">
                                        Unduh PDF <span class="material-symbols-outlined text-lg">download</span>
                                    </button>
                                </div>
                            </div>
                        </section>

                        <!-- Divisions Section -->
                        <section class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <div class="flex items-center justify-between mb-6">
                                <h2 class="text-xl font-bold text-navy flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary">category</span>
                                    Divisi Kompetisi
                                </h2>
                                <div class="hidden md:flex items-center gap-2">
                                    <button @click="scroll('left')"
                                        class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-navy hover:border-primary hover:text-primary transition-all">
                                        <span class="material-symbols-outlined">chevron_left</span>
                                    </button>
                                    <button @click="scroll('right')"
                                        class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-navy hover:border-primary hover:text-primary transition-all">
                                        <span class="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>
                            </div>

                            <div class="relative">
                                <div ref="scrollContainer"
                                    class="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 -mx-1 px-1">
                                    <div v-for="division in divisions" :key="division.name"
                                        class="min-w-[280px] md:min-w-[320px] group border border-gray-200 rounded-xl p-5 hover:border-primary transition-colors bg-white">
                                        <div class="flex items-center justify-between mb-4">
                                            <div
                                                class="w-12 h-12 bg-navy/5 rounded-lg flex items-center justify-center text-navy">
                                                <span class="material-symbols-outlined text-3xl">{{ division.icon
                                                }}</span>
                                            </div>
                                            <span class="bg-navy text-white text-xs font-bold px-2 py-1 rounded">{{
                                                division.distance }}</span>
                                        </div>
                                        <h3 class="font-bold text-navy mb-3">{{ division.name }}</h3>
                                        <div class="flex flex-wrap gap-2">
                                            <span v-for="cat in division.categories" :key="cat"
                                                class="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full uppercase tracking-wider">
                                                {{ cat }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Registration Fees Section -->
                        <section class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 class="text-xl font-bold text-navy mb-6 flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">payments</span>
                                Biaya Pendaftaran
                            </h2>
                            <div v-if="tournament.fees && tournament.fees.length > 0"
                                class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div v-for="(fee, idx) in tournament.fees" :key="idx"
                                    class="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-primary/30 transition-colors shadow-sm">
                                    <div class="flex items-center gap-3 mb-4">
                                        <div
                                            class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                            <Icon
                                                :icon="fee.name.toLowerCase().includes('tim') ? 'ph:users-three-bold' : 'ph:user-bold'"
                                                class="text-2xl text-primary" />
                                        </div>
                                        <span class="font-bold text-navy">{{ fee.name }}</span>
                                    </div>
                                    <div class="text-3xl font-black text-navy mb-1">IDR {{
                                        fee.amount.toLocaleString('id-ID') }}</div>
                                    <p v-if="fee.description" class="text-xs text-gray-500 font-medium">{{
                                        fee.description }}</p>
                                </div>
                            </div>
                            <!-- Fallback if no fees list -->
                            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                    <div class="flex items-center gap-3 mb-4">
                                        <div
                                            class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                            <Icon icon="ph:user-bold" class="text-2xl text-primary" />
                                        </div>
                                        <span class="font-bold text-navy">Individu</span>
                                    </div>
                                    <div class="text-3xl font-black text-navy mb-1">IDR 350.000</div>
                                    <p class="text-xs text-gray-500 font-medium">Per peserta per divisi</p>
                                </div>
                                <div class="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                    <div class="flex items-center gap-3 mb-4">
                                        <div
                                            class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                            <Icon icon="ph:users-three-bold" class="text-2xl text-primary" />
                                        </div>
                                        <span class="font-bold text-navy">Tim / Beregu</span>
                                    </div>
                                    <div class="text-3xl font-black text-navy mb-1">IDR 500.000</div>
                                    <p class="text-xs text-gray-500 font-medium">Per tim per kategori</p>
                                </div>
                            </div>
                        </section>

                        <section
                            class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                            <div
                                class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2">
                            </div>
                            <h2 class="text-xl font-bold text-navy mb-1 flex items-center gap-2 relative z-10">
                                <span class="material-symbols-outlined text-primary">emoji_events</span>
                                Total Hadiah
                            </h2>
                            <p v-if="tournament.total_prize" class="text-gray-500 text-sm mb-6 relative z-10">
                                Total Hadiah IDR {{ tournament.total_prize.toLocaleString('id-ID') }}
                            </p>
                            <div v-else class="mb-6"></div>
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                                <div
                                    class="bg-gradient-to-br from-[#FFD700]/10 to-transparent border border-[#FFD700]/30 rounded-xl p-6 text-center">
                                    <div class="text-4xl mb-2">🥇</div>
                                    <div class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Juara 1
                                    </div>
                                    <div class="text-2xl font-black text-navy">IDR 15.000.000</div>
                                    <div class="text-xs text-gray-400 mt-2">+ Medali Emas & Sertifikat</div>
                                </div>
                                <div
                                    class="bg-gradient-to-br from-[#C0C0C0]/10 to-transparent border border-[#C0C0C0]/30 rounded-xl p-6 text-center">
                                    <div class="text-4xl mb-2">🥈</div>
                                    <div class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Juara 2
                                    </div>
                                    <div class="text-2xl font-black text-navy">IDR 10.000.000</div>
                                    <div class="text-xs text-gray-400 mt-2">+ Medali Perak & Sertifikat</div>
                                </div>
                                <div
                                    class="bg-gradient-to-br from-[#CD7F32]/10 to-transparent border border-[#CD7F32]/30 rounded-xl p-6 text-center">
                                    <div class="text-4xl mb-2">🥉</div>
                                    <div class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Juara 3
                                    </div>
                                    <div class="text-2xl font-black text-navy">IDR 7.500.000</div>
                                    <div class="text-xs text-gray-400 mt-2">+ Medali Perunggu & Sertifikat</div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <TournamentScheduleTab v-else-if="activeTab === 'Jadwal Lomba'" :event-id="slug" />
                    <TournamentAthletesTab v-else-if="activeTab === 'Peserta'" />
                    <TournamentResultsTab v-else-if="activeTab === 'Hasil'" :event-id="slug" />
                    <TournamentVenueTab v-else-if="activeTab === 'Lokasi'" :venue="tournament.venue"
                        :address="tournament.address" :gmaps-link="tournament.gmaps_link" />
                </div>

                <!-- Right Sidebar - Hidden on Hasil tab -->
                <aside v-if="activeTab !== 'Hasil'" class="space-y-8">
                    <!-- Registration Card -->
                    <div class="bg-white rounded-2xl p-6 shadow-sm border-t-4 border-primary relative">
                        <h3 class="text-lg font-bold text-navy mb-4">Pendaftaran Ditutup Dalam</h3>
                        <div class="flex gap-3 mb-6">
                            <div class="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                                <span class="block text-2xl font-bold text-navy">04</span>
                                <span class="text-xs text-gray-500 uppercase">Hari</span>
                            </div>
                            <div class="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                                <span class="block text-2xl font-bold text-navy">12</span>
                                <span class="text-xs text-gray-500 uppercase">Jam</span>
                            </div>
                            <div class="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                                <span class="block text-2xl font-bold text-navy">45</span>
                                <span class="text-xs text-gray-500 uppercase">Menit</span>
                            </div>
                        </div>
                        <div class="space-y-4 mb-6">
                            <div class="flex justify-between items-center text-sm pb-1">
                                <span class="text-gray-500">Slot Tersedia</span>
                                <span class="font-bold text-primary">45 / 200 Tersisa</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-primary h-2 rounded-full" style="width: 77%"></div>
                            </div>
                        </div>
                        <!-- Auth-aware registration CTA: Only show for non-logged-in or logged-in archers -->
                        <template v-if="!isLoggedIn || isArcher">
                            <template v-if="!isLoggedIn">
                                <NuxtLink :to="loginUrl"
                                    class="w-full block py-4 bg-primary hover:bg-primary-hover text-navy font-bold rounded-xl transition-colors shadow-md text-center">
                                    Login untuk Mendaftar
                                </NuxtLink>
                                <p class="text-center text-xs text-gray-400 mt-3">Belum punya akun?
                                    <NuxtLink class="text-navy font-bold hover:underline" to="/auth/register">Daftar
                                    </NuxtLink>
                                </p>
                            </template>
                            <template v-else>
                                <NuxtLink :to="registerUrl"
                                    class="w-full block py-4 bg-primary hover:bg-primary-hover text-navy font-bold rounded-xl transition-colors shadow-md text-center">
                                    Yuk Daftar Sekarang
                                </NuxtLink>
                                <p class="text-center text-xs text-gray-400 mt-3">Sudah terdaftar?
                                    <NuxtLink class="text-navy font-bold hover:underline" :to="`/dashboard/events`">Cek
                                        status
                                    </NuxtLink>
                                </p>
                            </template>
                        </template>
                    </div>

                    <!-- Organizer Card -->
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 class="text-lg font-bold text-navy mb-4">Penyelenggara</h3>
                        <div class="flex items-center gap-4 mb-4">
                            <div class="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                <img alt="Logo Penyelenggara" class="w-full h-full object-cover"
                                    :src="tournament.organizer_logo || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLm2bt_rocjJTBJyLy5egiG9qWTRu9j6JZGiQJiPm8b1G-HSoEuiHPFCrCPBc7qb81krUTSO68P9GueohN-_0IAPQUYSb-Jmd32xXgCNveXoWn0ACR6lV3AFfehy0pYgrdNBVXEyn4uZBaLcOM53xvrj6Nj8lqZdHdDm_sqOirc-36E7u9Qk0pblOTfHJH69INJpXI6D78iO58yfy0HygaJfL6aQRUXwsA6QzEsyDTsfEt6-q4b8f5rl3D59A-pT-X4fXlv7Fm3ng'" />
                            </div>
                            <div>
                                <NuxtLink v-if="tournament.organizer_slug"
                                    :to="`/organization/${tournament.organizer_slug}`"
                                    class="font-bold text-navy text-sm hover:text-primary transition-colors">
                                    {{ tournament.organizer }}
                                </NuxtLink>
                                <h4 v-else class="font-bold text-navy text-sm">{{ tournament.organizer }}</h4>
                                <p class="text-xs text-gray-500">Penyelenggara Terverifikasi <span
                                        class="material-symbols-outlined text-[14px] align-middle text-blue-500">verified</span>
                                </p>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <a v-if="tournament.organizer_phone" :href="`https://wa.me/${tournament.organizer_phone}`"
                                target="_blank"
                                class="flex-1 py-2.5 bg-green-500 hover:bg-green-600 border border-green-500 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-sm shadow-green-200">
                                <Icon icon="ph:whatsapp-logo-bold" class="text-lg" />
                                WhatsApp
                            </a>
                            <button v-else
                                class="flex-1 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-400 cursor-not-allowed flex items-center justify-center gap-2">
                                <Icon icon="ph:phone-slash" class="text-lg" />
                                No. Telp
                            </button>

                            <NuxtLink v-if="tournament.organizer_slug"
                                :to="`/organization/${tournament.organizer_slug}`"
                                class="flex-1 py-2.5 bg-navy hover:bg-navy-light border border-navy rounded-xl text-xs font-bold text-white transition-all text-center flex items-center justify-center">
                                Lihat Profil
                            </NuxtLink>
                        </div>
                    </div>

                    <!-- Map Card -->
                    <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                        <div class="h-48 w-full bg-gray-100 relative group">
                            <iframe v-if="gmapsEmbedUrl" :src="gmapsEmbedUrl" width="100%" height="100%"
                                style="border:0;" allowfullscreen="" loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade">
                            </iframe>
                            <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
                                <Icon icon="ph:map-pin" class="text-3xl text-gray-300" />
                            </div>
                        </div>
                        <div class="p-5">
                            <h3 class="font-bold text-navy mb-1">{{ tournament.venue }}</h3>
                            <p class="text-sm text-gray-500">{{ tournament.address }}</p>
                        </div>
                    </div>

                    <!-- Share Section -->
                    <div
                        class="flex flex-col items-center gap-4 justify-center bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                        <span class="text-xs font-black text-gray-400 uppercase tracking-widest">Bagikan Event
                            Ini</span>
                        <div class="flex gap-4">
                            <button @click="shareTo('whatsapp')"
                                class="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                                <Icon icon="ph:whatsapp-logo-fill" class="text-2xl" />
                            </button>
                            <button @click="shareTo('facebook')"
                                class="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                                <Icon icon="ph:facebook-logo-fill" class="text-2xl" />
                            </button>
                            <button @click="shareTo('twitter')"
                                class="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-black hover:bg-black hover:text-white hover:border-black transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                                <Icon icon="ph:twitter-logo-fill" class="text-2xl" />
                            </button>
                            <button @click="copyPublicUrl"
                                class="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-navy hover:bg-navy hover:text-white hover:border-navy transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                                <Icon icon="ph:link-bold" class="text-2xl" />
                            </button>
                        </div>
                        <p v-if="copySuccess" class="text-[10px] font-bold text-green-600">Link berhasil disalin!</p>
                    </div>
                </aside>
            </div>
        </main>

    </div>
</template>

/* eslint-disable vue/multi-word-component-names */
<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { definePageMeta, useSeoMeta } from '#imports'

const route = useRoute()
const slug = route.params.slug

// Auth state
const { user, isLoggedIn } = useAuth()
const isArcher = computed(() => user.value?.type === 'archer' || user.value?.role === 'archer')

// Generate login URL with redirect
const loginUrl = computed(() => `/auth/login?redirect=${encodeURIComponent(`/events/${slug}`)}`)
const registerUrl = computed(() => `/events/${slug}/register`)

const { get } = useApi()
const isLoading = ref(true)

const tabs = ['Ringkasan', 'Jadwal Lomba', 'Peserta', 'Hasil', 'Lokasi']
const activeTab = ref('Ringkasan')
const scrollContainer = ref(null)

const scroll = (direction) => {
    if (scrollContainer.value) {
        const scrollAmount = 350
        scrollContainer.value.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        })
    }
}

// Sync tab with query params
watch(() => route.query.tab, (newTab) => {
    if (newTab && tabs.includes(newTab)) {
        activeTab.value = newTab
    } else if (!newTab) {
        activeTab.value = 'Ringkasan'
    }
}, { immediate: true })

// Fallback data
const fallbackTournament = {
    name: 'Indonesian Open Championship 2024',
    date: 'Nov 12 - 15, 2024',
    location: 'GBK Archery Field, Jakarta',
    venue: 'GBK Archery Field',
    gmaps_link: 'https://maps.app.goo.gl/9b1H5y8oVQ...',
    address: 'Jl. Pintu Satu Senayan, Gelora, Tanah Abang, Jakarta Pusat',
    status: 'upcoming',
    category: 'National Series',
    organizer: 'Perpani DKI Jakarta',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByxS8LZ93pBQXI_V_Vu3nB0633lwPZGiFCM3UtI-xk79b_O83ASmlHYA36lOzcnmVsbgs4DEe9awj543MvzCN1yzOo1wZ3ViXLdiMRV7vAMdy66lvu-l5dpFAOgZ0uCMKJxsBRXPJL1QeX4_ZdX2ynTEZR-ZMilrncma7gKG2YK0vsj0KJZnw_lD0UZaXFKW2aVFD1SU-mzi_sAT2D-62TP0j5LF6KprFriv2sV9rdypqLSvfrZekYDy45XaK8F1vVh7e5nfrgK7o'
}

const tournament = ref(fallbackTournament)

const transformEventData = (data) => ({
    name: data.name || data.title || '',
    date: data.start_date
        ? `${new Date(data.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(data.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
        : data.date || '',
    location: data.venue || data.location || '',
    venue: data.venue || data.location || '',
    gmaps_link: data.gmaps_link || '',
    address: data.address || '',
    status: data.status || 'upcoming',
    category: data.category || '',
    organizer: data.organizer_name || data.organizer || 'Penyelenggara',
    organizer_slug: data.organizer_username || data.organizer_slug || null,
    organizer_logo: data.organizer_avatar_url || data.organizer_logo || null,
    organizer_phone: data.organizer_phone || data.phone || null,
    image: data.banner_url || data.image || fallbackTournament.image,
    thumbnail: data.logo_url || data.thumbnail || null,
    fees: data.fees || [],
    description: data.description || '',
    total_prize: data.total_prize || 0
})

// Google Maps embed URL
const gmapsEmbedUrl = computed(() => {
    if (!tournament.value.gmaps_link) return null

    try {
        const link = tournament.value.gmaps_link
        // If it's already an embed URL
        if (link.includes('google.com/maps/embed')) return link

        // Extract coordinates or place from URL if available
        const coordsMatch = link.match(/[?&]q=([^&]+)/)
        if (coordsMatch) {
            const query = decodeURIComponent(coordsMatch[1])
            return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
        }

        // For maps.app.goo.gl or goo.gl links, or direct google.com/maps/place/
        // Use venue and location if available for better reliability
        const searchQuery = tournament.value.venue || tournament.value.location || link
        return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
    } catch (e) {
        const searchQuery = tournament.value.venue || tournament.value.location || tournament.value.gmaps_link
        return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
    }
})

const fetchTournament = async () => {
    isLoading.value = true
    try {
        const response = await get(`/events/${slug}`)
        if (response) {
            tournament.value = transformEventData(response.data || response)
        }
    } catch (error) {
        console.error('Failed to fetch event:', error)
        // Keep fallback data
    } finally {
        isLoading.value = false
    }
}

const divisions = [
    { name: 'Recurve Division', icon: 'adjust', distance: '70m', categories: ["Men's Individual", "Women's Individual", "Mixed Team"] },
    { name: 'Compound Division', icon: 'gps_fixed', distance: '50m', categories: ["Men's Individual", "Women's Individual", "Mixed Team"] },
    { name: 'Barebow Division', icon: 'radar', distance: '50m', categories: ["Men's Individual", "Women's Individual", "Mixed Team"] },
    { name: 'Nasional Division', icon: 'flag', distance: '40m', categories: ["U-12", "U-15", "Umum"] },
    { name: 'Traditional', icon: 'history_edu', distance: '30m', categories: ["Umum Putra", "Umum Putri"] },
]

onMounted(() => {
    fetchTournament()
})

definePageMeta({
    layout: 'landing'
})

useHead({
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ]
})

useSeoMeta({
    title: () => `${tournament.value.name} - Archeryhub.id`,
    description: () => tournament.value.description,
    ogTitle: () => tournament.value.name,
    ogDescription: () => tournament.value.description,
    ogImage: () => tournament.value.image,
    twitterCard: 'summary_large_image',
})

const copySuccess = ref(false)
const publicEventUrl = computed(() => {
    const origin = window?.location?.origin || 'https://archeryhub.id'
    return `${origin}/events/${slug}`
})

const copyPublicUrl = async () => {
    try {
        await navigator.clipboard.writeText(publicEventUrl.value)
        copySuccess.value = true
        setTimeout(() => {
            copySuccess.value = false
        }, 2000)
    } catch (e) {
        console.error('Failed to copy link:', e)
    }
}

const shareTo = (platform) => {
    const url = encodeURIComponent(publicEventUrl.value)
    const text = encodeURIComponent(tournament.value.name || 'Event Panahan')

    let shareUrl = ''
    if (platform === 'whatsapp') {
        shareUrl = `https://wa.me/?text=${text}%20-%20${url}`
    } else if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
    } else if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'noopener,noreferrer')
    }
}
</script>


<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>

<template>
    <div class="min-h-screen bg-background-light font-body text-navy">
        <!-- Navigation -->
        <nav class="bg-white border-b border-gray-200 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <NuxtLink to="/" class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
                            <img src="/logo.png" alt="Logo" class="w-5 h-5 object-contain" />
                        </div>
                        <span class="text-navy text-xl font-black tracking-tight font-display">Archeryhub<span
                                class="text-logo-id">.id</span></span>
                    </NuxtLink>
                    <nav class="hidden md:flex items-center gap-8">
                        <NuxtLink to="/" class="text-gray-600 hover:text-navy font-medium text-sm transition-colors">
                            Beranda</NuxtLink>
                        <NuxtLink to="/events"
                            class="text-navy font-bold text-sm relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:-bottom-5 after:left-0">
                            Turnamen</NuxtLink>
                        <NuxtLink to="#" class="text-gray-600 hover:text-navy font-medium text-sm transition-colors">
                            Peringkat</NuxtLink>
                        <NuxtLink to="#" class="text-gray-600 hover:text-navy font-medium text-sm transition-colors">
                            Berita</NuxtLink>
                    </nav>
                    <div class="flex items-center gap-4">
                        <NuxtLink to="/auth/login"
                            class="hidden md:flex text-gray-600 font-medium text-sm hover:text-navy">Masuk</NuxtLink>
                        <NuxtLink to="/auth/register"
                            class="hidden sm:flex bg-navy hover:bg-navy-light text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg">
                            Daftar
                        </NuxtLink>
                        <!-- Mobile Menu Button -->
                        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-navy p-2">
                            <span class="material-symbols-outlined text-2xl">{{ mobileMenuOpen ? 'close' :
                                'menu' }}</span>
                        </button>
                    </div>
                </div>
                <!-- Mobile Menu -->
                <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3">
                    <NuxtLink to="/" class="block text-navy font-medium text-sm py-2">Beranda</NuxtLink>
                    <NuxtLink to="/events" class="block text-primary font-bold text-sm py-2">Turnamen</NuxtLink>
                    <NuxtLink to="#" class="block text-gray-600 font-medium text-sm py-2">Peringkat</NuxtLink>
                    <NuxtLink to="#" class="block text-gray-600 font-medium text-sm py-2">Berita</NuxtLink>
                    <div class="pt-3 border-t border-gray-100 flex gap-3">
                        <NuxtLink to="/auth/login"
                            class="flex-1 text-center py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-navy">
                            Masuk</NuxtLink>
                        <NuxtLink to="/auth/register"
                            class="flex-1 text-center py-2.5 bg-navy text-white rounded-lg text-sm font-bold">Daftar
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Header -->
        <div class="bg-navy relative overflow-hidden">
            <div class="absolute inset-0 z-0">
                <div class="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/80 z-10"></div>
                <img :alt="tournament.name"
                    class="w-full h-full object-cover object-center opacity-50 mix-blend-overlay"
                    :src="tournament.image" />
            </div>
            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-0">
                <!-- Breadcrumb -->
                <nav class="flex items-center gap-2 text-sm text-gray-400 mb-8">
                    <NuxtLink to="/events" class="hover:text-white transition-colors">Tournaments</NuxtLink>
                    <span class="material-symbols-outlined text-base">chevron_right</span>
                    <span class="text-primary font-medium">{{ tournament.name }}</span>
                </nav>

                <div class="flex flex-col lg:flex-row items-start justify-between gap-8 mb-12">
                    <div class="max-w-3xl">
                        <div class="flex items-center gap-3 mb-4">
                            <span
                                class="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                {{ tournament.category }}
                            </span>
                            <span v-if="tournament.status === 'upcoming'"
                                class="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Pendaftaran
                                Dibuka
                            </span>
                            <span v-else-if="tournament.status === 'live'"
                                class="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Sedang
                                Berlangsung
                            </span>
                        </div>
                        <h1 class="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight mb-6">
                            {{ tournament.name }}
                        </h1>
                        <div class="flex flex-wrap items-center gap-6 text-gray-300 text-base">
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">calendar_month</span>
                                <span>{{ tournament.date }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">location_on</span>
                                <span>{{ tournament.location }}</span>
                                <a v-if="tournament.gmaps_link" :href="tournament.gmaps_link" target="_blank"
                                    class="text-xs text-primary hover:underline flex items-center gap-1 ml-2">
                                    (Lihat di Peta)
                                </a>
                            </div>
                        </div>
                    </div>
                    <NuxtLink :to="`/events/${slug}/register`"
                        class="h-10 px-5 bg-primary hover:bg-primary-hover text-navy font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md">
                        Daftar Sekarang
                        <span class="material-symbols-outlined text-lg">arrow_forward</span>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Sticky Tabs -->
        <div class="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center gap-1 overflow-x-auto no-scrollbar -mb-px">
                    <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
                        class="px-4 md:px-6 py-3 md:py-4 font-semibold text-sm md:text-base transition-colors whitespace-nowrap border-b-2"
                        :class="activeTab === tab ? 'text-navy border-primary bg-primary/5' : 'text-gray-500 border-transparent hover:text-navy hover:bg-gray-50'">
                        {{ tab }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <main class="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                <!-- Left Column -->
                <div class="lg:col-span-2 space-y-10">
                    <div v-if="activeTab === 'Ringkasan'" class="space-y-10">
                        <!-- About Section -->
                        <section class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 class="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
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
                            <h2 class="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">category</span>
                                Divisi Kompetisi
                            </h2>
                            <div class="grid md:grid-cols-2 gap-6">
                                <div v-for="division in divisions" :key="division.name"
                                    class="group border border-gray-200 rounded-xl p-5 hover:border-primary transition-colors">
                                    <div class="flex items-center justify-between mb-4">
                                        <div
                                            class="w-12 h-12 bg-navy/5 rounded-lg flex items-center justify-center text-navy">
                                            <span class="material-symbols-outlined text-3xl">{{ division.icon }}</span>
                                        </div>
                                        <span class="bg-navy text-white text-xs font-bold px-2 py-1 rounded">{{
                                            division.distance }}</span>
                                    </div>
                                    <h3 class="text-lg font-bold text-navy mb-2">{{ division.name }}</h3>
                                    <ul class="space-y-2 text-sm text-gray-600">
                                        <li v-for="cat in division.categories" :key="cat"
                                            class="flex items-center gap-2">
                                            <span
                                                class="material-symbols-outlined text-primary text-base">check_circle</span>
                                            {{ cat }}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section
                            class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                            <div
                                class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2">
                            </div>
                            <h2 class="text-2xl font-bold text-navy mb-6 flex items-center gap-2 relative z-10">
                                <span class="material-symbols-outlined text-primary">emoji_events</span>
                                Total Hadiah
                            </h2>
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

                    <TournamentScheduleTab v-else-if="activeTab === 'Jadwal Pertandingan'" />
                    <TournamentAthletesTab v-else-if="activeTab === 'Daftar Atlet'" />
                    <TournamentResultsTab v-else-if="activeTab === 'Hasil Live'" />
                    <TournamentVenueTab v-else-if="activeTab === 'Info Venue'" :venue="tournament.venue"
                        :address="tournament.address" />
                </div>

                <!-- Right Sidebar -->
                <aside class="space-y-8">
                    <!-- Registration Card -->
                    <div class="bg-white rounded-2xl p-6 shadow-lg border-t-4 border-primary relative">
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
                            <div class="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                                <span class="text-gray-500">Biaya Pendaftaran (Individu)</span>
                                <span class="font-bold text-navy">IDR 350.000</span>
                            </div>
                            <div class="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                                <span class="text-gray-500">Biaya Pendaftaran (Tim)</span>
                                <span class="font-bold text-navy">IDR 500.000</span>
                            </div>
                            <div class="flex justify-between items-center text-sm pb-1">
                                <span class="text-gray-500">Slot Tersedia</span>
                                <span class="font-bold text-primary">45 / 200 Tersisa</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-primary h-2 rounded-full" style="width: 77%"></div>
                            </div>
                        </div>
                        <NuxtLink :to="`/events/${slug}/register`"
                            class="w-full block py-4 bg-primary hover:bg-primary-hover text-navy font-bold rounded-xl transition-colors shadow-md text-center">
                            Daftar Sekarang
                        </NuxtLink>
                        <p class="text-center text-xs text-gray-400 mt-3">Sudah terdaftar? <NuxtLink
                                class="text-navy font-bold hover:underline" :to="`/dashboard/events`">Cek status
                            </NuxtLink>
                        </p>
                    </div>

                    <!-- Organizer Card -->
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 class="text-lg font-bold text-navy mb-4">Penyelenggara</h3>
                        <div class="flex items-center gap-4 mb-4">
                            <div class="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                <img alt="Logo Penyelenggara" class="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLm2bt_rocjJTBJyLy5egiG9qWTRu9j6JZGiQJiPm8b1G-HSoEuiHPFCrCPBc7qb81krUTSO68P9GueohN-_0IAPQUYSb-Jmd32xXgCNveXoWn0ACR6lV3AFfehy0pYgrdNBVXEyn4uZBaLcOM53xvrj6Nj8lqZdHdDm_sqOirc-36E7u9Qk0pblOTfHJH69INJpXI6D78iO58yfy0HygaJfL6aQRUXwsA6QzEsyDTsfEt6-q4b8f5rl3D59A-pT-X4fXlv7Fm3ng" />
                            </div>
                            <div>
                                <h4 class="font-bold text-navy text-sm">{{ tournament.organizer }}</h4>
                                <p class="text-xs text-gray-500">Penyelenggara Terverifikasi <span
                                        class="material-symbols-outlined text-[14px] align-middle text-blue-500">verified</span>
                                </p>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button
                                class="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Hubungi</button>
                            <button
                                class="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Ikuti</button>
                        </div>
                    </div>

                    <!-- Map Card -->
                    <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                        <a :href="tournament.gmaps_link || '#'" target="_blank"
                            class="block h-48 bg-gray-200 relative group cursor-pointer">
                            <img alt="Map Location"
                                class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBrem4azc6WDMeDRbQw-2joq0fcWSF6QDRhvFPnW-ZtTHG4r0ECeGr8vc0pPmiT9d1nf6uWWAKZV7gq4w5KOncu3fb8KTi_XBz3tdpkVmJJmYaADUQlUXX_F7nLa_E2NafPu8ouY13kIof5Eq-of3RwBG7KLqmrOsacwZG3PTf4QMy_Kg7hNn1wy70_AypgzTCtU9fNYKdIuuk90f3tKG-PQTM6beImIzXkc9NJP7mrw7xfVZmahm9Ur0fzjDkkH2C0zP1aJy_XLg" />
                            <div class="absolute inset-0 bg-gray-800/10 flex items-center justify-center">
                                <span
                                    class="px-4 py-2 bg-white rounded-lg shadow-md font-bold text-sm text-navy flex items-center gap-2">
                                    <span class="material-symbols-outlined text-red-500">location_on</span>
                                    {{ tournament.gmaps_link ? 'Buka Google Maps' : 'Lihat di Peta' }}
                                </span>
                            </div>
                        </a>
                        <div class="p-5">
                            <h3 class="font-bold text-navy mb-1">{{ tournament.venue }}</h3>
                            <p class="text-sm text-gray-500 mb-4">{{ tournament.address }}</p>
                            <div class="flex items-center gap-2 text-xs text-gray-400">
                                <span class="material-symbols-outlined text-sm">sunny</span> 32°C Prakiraan Cerah
                            </div>
                        </div>
                    </div>

                    <!-- Share Section -->
                    <div class="flex items-center gap-4 justify-center">
                        <span class="text-sm font-medium text-gray-500">Bagikan Event:</span>
                        <div class="flex gap-2">
                            <button
                                class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-navy hover:border-navy transition-colors">
                                <span class="material-symbols-outlined text-lg">share</span>
                            </button>
                            <button
                                class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-navy hover:border-navy transition-colors">
                                <span class="material-symbols-outlined text-lg">link</span>
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </main>

        <!-- Footer -->
        <LayoutAppFooter />
    </div>
</template>

<script setup>
const route = useRoute()
const slug = route.params.slug

const mobileMenuOpen = ref(false)

const tabs = ['Ringkasan', 'Jadwal Pertandingan', 'Daftar Atlet', 'Hasil Live', 'Info Venue']
const activeTab = ref('Ringkasan')

const tournamentsData = {
    'indonesian-open-2024': {
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
    },
    'surabaya-archery-cup-2024': {
        name: 'Surabaya Archery Cup 2024',
        date: 'Nov 10 - 13, 2024',
        location: 'KONI Jatim Field, Surabaya',
        venue: 'KONI Jatim Field',
        address: 'Jl. Jatim, Surabaya, East Java',
        status: 'live',
        category: 'National Series',
        organizer: 'Perpani Jawa Timur',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJXWL-Z7f7fP24_IyBjI_e-q_jYcMbzRtaKiOpKP8TxgqwSxRrCqNcE-GXJXbiCEv6rlwlNJzTmbbgAdQFWHH4Jk_Fw-aslTiT3Qezy8bbmGRG0WoRA-yD8tykZuxYObytzJ6Yf7yNL8poFU6vWlyEuFjbHcIzwfoLAMru-bfdw4GXezmv71SwRPYw_-Ct6ZP3f6AqglpvBIhCSrp9g13uTQpj69_-hzZqp1wSqJJ-9PdZqp0CYWgFWsajdRos9QmU7eeyuFhFPH0'
    },
    'bali-international-open': {
        name: 'Bali International Open',
        date: 'Dec 01 - 05, 2024',
        location: 'Denpasar Archery Center, Bali',
        venue: 'Denpasar Archery Center',
        address: 'Jl. Gatot Subroto, Denpasar, Bali',
        status: 'upcoming',
        category: 'Grade A',
        organizer: 'Perpani Bali',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmKeu4qLnuI8uJ8itXirIGY311f6c_CfhqFD3qtMv-M4oTNDiSeGeylyU0qI_7lQHeMywtfdDw175-dWrdxwZwWSnnEMmkBca4ScW0dEbBQ_wZYVWuCaOPI-A204QdKHKXQxHsutHbZP8c9uPaZpfK8lzqziHTAW_dqnlmi99AtLhIGmxfUZ-irvcNm1YUswSsH9HGhvq4Hr6jq7rsveM4HwMmhNVDABEGcgh0sYQHoHy9t1IzkTX2LexV72X240IEyZL2_InQGZ8'
    }
}

const tournament = computed(() => {
    return tournamentsData[slug] || tournamentsData['indonesian-open-2024']
})

const divisions = [
    { name: 'Recurve Division', icon: 'adjust', distance: '70m', categories: ["Men's Individual", "Women's Individual", "Mixed Team"] },
    { name: 'Compound Division', icon: 'gps_fixed', distance: '50m', categories: ["Men's Individual", "Women's Individual", "Mixed Team"] },
]

useSeoMeta({
    title: () => `${tournament.value.name} - Archeryhub.id`,
    description: () => `Register for ${tournament.value.name} at ${tournament.value.location}. ${tournament.value.date}.`
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>

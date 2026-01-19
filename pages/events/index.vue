<template>
    <div class="min-h-screen bg-background-light font-body text-navy">
        <!-- Navigation -->
        <nav class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <NuxtLink to="/" class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
                            <img src="/logo.png" alt="Logo" class="w-5 h-5 object-contain" />
                        </div>
                        <span class="text-navy text-xl font-bold tracking-tight">Archeryhub<span
                                class="text-primary">.id</span></span>
                    </NuxtLink>
                    <nav class="hidden md:flex items-center gap-8">
                        <NuxtLink to="/" class="text-gray-600 hover:text-navy font-medium text-sm transition-colors">
                            Home</NuxtLink>
                        <NuxtLink to="/tournaments"
                            class="text-navy font-bold text-sm relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:-bottom-5 after:left-0">
                            Tournaments</NuxtLink>
                        <a href="#"
                            class="text-gray-600 hover:text-navy font-medium text-sm transition-colors">Rankings</a>
                        <a href="#" class="text-gray-600 hover:text-navy font-medium text-sm transition-colors">News</a>
                    </nav>
                    <div class="flex items-center gap-4">
                        <NuxtLink to="/auth/login"
                            class="hidden md:flex text-gray-600 font-medium text-sm hover:text-navy">Log In</NuxtLink>
                        <NuxtLink to="/auth/login"
                            class="bg-navy hover:bg-navy-light text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg">
                            Sign Up
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section: Featured Event -->
        <div class="bg-navy relative overflow-hidden">
            <div class="absolute inset-0 z-0">
                <div class="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-transparent z-10"></div>
                <img alt="Archer drawing a bow during sunset"
                    class="w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy5qIYUnhOAA9fRw-ezPUypzWUtCQTHv6EpNe6Q0bAAz6AFkDLOqgltBvPdIyyRsW4WqNcDFxXZlfgwFHWevvHH2yphLfwWEOEHT3GyFbvXsenr1qoxDPsSf-bmVfNqwG9_5cJoVMhgvCJ2FfEt6bQgicn5WlBrsP8axm39cBTN9E6cF7MQ9vKO5p0acgAZ1z3IYSXi-yQILL1HoOdT6ZobZEyg4qolUIumeiK6bVGuATW7dwLfqmaRIFiXL-l1PEPGa_sRD5Lc9E" />
            </div>
            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
                <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
                    <div class="max-w-2xl">
                        <div
                            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm mb-6">
                            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span class="text-primary text-xs font-bold uppercase tracking-wider">Featured Event</span>
                        </div>
                        <h1
                            class="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
                            Indonesian Open <br class="hidden md:block" />Championship 2024
                        </h1>
                        <div class="flex flex-wrap items-center gap-6 text-gray-300 text-sm md:text-base mb-8">
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">calendar_month</span>
                                <span>Nov 12 - 15, 2024</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">location_on</span>
                                <span>GBK Archery Field, Jakarta</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">groups</span>
                                <span>Recurve & Compound</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <NuxtLink to="/tournaments/indonesian-open-2024"
                            class="flex-1 sm:flex-none h-12 px-8 bg-primary hover:bg-primary-hover text-navy font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(183,251,35,0.3)]">
                            Register Now
                            <span class="material-symbols-outlined text-lg">arrow_forward</span>
                        </NuxtLink>
                        <button
                            class="flex-1 sm:flex-none h-12 px-8 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg backdrop-blur-sm border border-white/10 transition-colors flex items-center justify-center">
                            Event Details
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Layout -->
        <main class="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Sidebar: Filters -->
                <aside class="w-full lg:w-80 flex-shrink-0 space-y-6">
                    <!-- Search -->
                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h3 class="text-navy font-bold text-lg mb-4 flex items-center gap-2">
                            <span class="material-symbols-outlined">search</span>
                            Find Tournament
                        </h3>
                        <div class="relative">
                            <span
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-xl">search</span>
                            <input v-model="searchQuery"
                                class="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-navy placeholder:text-gray-400"
                                placeholder="Search by name..." type="text" />
                        </div>
                    </div>

                    <!-- Filters -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 class="text-navy font-bold text-lg flex items-center gap-2">
                                <span class="material-symbols-outlined">filter_list</span>
                                Filters
                            </h3>
                            <button class="text-xs font-semibold text-gray-500 hover:text-navy">Reset</button>
                        </div>
                        <div class="divide-y divide-gray-100">
                            <!-- Category Filter -->
                            <details class="group" open>
                                <summary
                                    class="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-sm text-gray-800 hover:bg-gray-50 transition-colors">
                                    <span>Category</span>
                                    <span
                                        class="transition group-open:rotate-180 material-symbols-outlined text-gray-400">expand_more</span>
                                </summary>
                                <div class="text-gray-600 px-5 pb-5 text-sm space-y-3">
                                    <label class="flex items-center gap-3 cursor-pointer group/item">
                                        <input checked class="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                            type="checkbox" />
                                        <span class="group-hover/item:text-navy transition-colors">National
                                            Series</span>
                                    </label>
                                    <label class="flex items-center gap-3 cursor-pointer group/item">
                                        <input class="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                            type="checkbox" />
                                        <span class="group-hover/item:text-navy transition-colors">Regional Open</span>
                                    </label>
                                    <label class="flex items-center gap-3 cursor-pointer group/item">
                                        <input class="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                            type="checkbox" />
                                        <span class="group-hover/item:text-navy transition-colors">Club
                                            Invitationals</span>
                                    </label>
                                </div>
                            </details>
                            <!-- Status Filter -->
                            <details class="group">
                                <summary
                                    class="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-sm text-gray-800 hover:bg-gray-50 transition-colors">
                                    <span>Status</span>
                                    <span
                                        class="transition group-open:rotate-180 material-symbols-outlined text-gray-400">expand_more</span>
                                </summary>
                                <div class="text-gray-600 px-5 pb-5 text-sm space-y-3">
                                    <label class="flex items-center gap-3 cursor-pointer">
                                        <input class="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                            type="checkbox" />
                                        <span>Upcoming</span>
                                    </label>
                                    <label class="flex items-center gap-3 cursor-pointer">
                                        <input class="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                            type="checkbox" />
                                        <span>Live Now</span>
                                    </label>
                                    <label class="flex items-center gap-3 cursor-pointer">
                                        <input class="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                            type="checkbox" />
                                        <span>Past Events</span>
                                    </label>
                                </div>
                            </details>
                            <!-- Division Filter -->
                            <details class="group">
                                <summary
                                    class="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-sm text-gray-800 hover:bg-gray-50 transition-colors">
                                    <span>Division</span>
                                    <span
                                        class="transition group-open:rotate-180 material-symbols-outlined text-gray-400">expand_more</span>
                                </summary>
                                <div class="text-gray-600 px-5 pb-5 text-sm space-y-3">
                                    <label class="flex items-center gap-3 cursor-pointer">
                                        <input class="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                            type="checkbox" />
                                        <span>Recurve</span>
                                    </label>
                                    <label class="flex items-center gap-3 cursor-pointer">
                                        <input class="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                            type="checkbox" />
                                        <span>Compound</span>
                                    </label>
                                    <label class="flex items-center gap-3 cursor-pointer">
                                        <input class="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                            type="checkbox" />
                                        <span>Barebow</span>
                                    </label>
                                </div>
                            </details>
                        </div>
                    </div>
                </aside>

                <!-- Main Content: Tournament Grid -->
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-navy">All Tournaments <span
                                class="text-gray-400 font-normal text-lg ml-2">({{ filteredTournaments.length }})</span>
                        </h2>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
                            <select v-model="sortBy"
                                class="border-none bg-white text-sm font-medium text-navy rounded-lg shadow-sm py-2 pl-3 pr-8 focus:ring-navy cursor-pointer">
                                <option value="newest">Date: Newest First</option>
                                <option value="oldest">Date: Oldest First</option>
                                <option value="name">Name: A-Z</option>
                            </select>
                        </div>
                    </div>

                    <!-- Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <NuxtLink v-for="tournament in filteredTournaments" :key="tournament.slug"
                            :to="`/tournaments/${tournament.slug}`"
                            class="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col h-full"
                            :class="tournament.status === 'finished' ? 'opacity-80 grayscale hover:opacity-100 hover:grayscale-0' : ''">
                            <div class="relative h-48 overflow-hidden">
                                <div class="absolute top-3 left-3 z-10 flex gap-2">
                                    <span v-if="tournament.status === 'live'"
                                        class="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1 animate-pulse">
                                        <span class="material-symbols-outlined text-[12px]">fiber_manual_record</span>
                                        Live
                                    </span>
                                    <span v-else-if="tournament.status === 'upcoming'"
                                        class="bg-navy text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                                        Upcoming
                                    </span>
                                    <span v-else
                                        class="bg-gray-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                                        Finished
                                    </span>
                                    <span v-if="tournament.category"
                                        class="bg-white/90 backdrop-blur-sm text-navy text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                                        {{ tournament.category }}
                                    </span>
                                </div>
                                <img :alt="tournament.name"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    :src="tournament.image" />
                            </div>
                            <div class="p-5 flex-1 flex flex-col">
                                <h3
                                    class="text-lg font-bold text-navy mb-2 leading-snug group-hover:text-primary-hover transition-colors">
                                    {{ tournament.name }}
                                </h3>
                                <div class="space-y-2 mb-6">
                                    <div class="flex items-start gap-2 text-gray-500 text-sm">
                                        <span class="material-symbols-outlined text-lg mt-0.5">calendar_today</span>
                                        <span>{{ tournament.date }}</span>
                                    </div>
                                    <div class="flex items-start gap-2 text-gray-500 text-sm">
                                        <span class="material-symbols-outlined text-lg mt-0.5">location_on</span>
                                        <span class="truncate">{{ tournament.location }}</span>
                                    </div>
                                </div>
                                <div class="mt-auto">
                                    <button v-if="tournament.status === 'live'"
                                        class="w-full h-10 rounded-lg border-2 border-navy text-navy hover:bg-navy hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
                                        <span class="material-symbols-outlined text-lg">scoreboard</span>
                                        Live Scores
                                    </button>
                                    <button v-else-if="tournament.status === 'upcoming'"
                                        class="w-full h-10 rounded-lg bg-primary hover:bg-primary-hover text-navy font-bold text-sm transition-all shadow-sm">
                                        Register Now
                                    </button>
                                    <button v-else
                                        class="w-full h-10 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-sm transition-all flex items-center justify-center gap-2">
                                        View Results
                                        <span class="material-symbols-outlined text-lg">emoji_events</span>
                                    </button>
                                </div>
                            </div>
                        </NuxtLink>
                    </div>

                    <!-- Pagination -->
                    <div class="mt-12 flex justify-center">
                        <button
                            class="px-8 py-3 bg-white border border-gray-200 text-navy font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
                            Load More Tournaments
                            <span class="material-symbols-outlined">expand_more</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <LayoutAppFooter />
    </div>
</template>

<script setup>
const searchQuery = ref('')
const sortBy = ref('newest')

const tournaments = [
    { slug: 'surabaya-archery-cup-2024', name: 'Surabaya Archery Cup 2024', date: 'Nov 10 - 13, 2024', location: 'KONI Jatim Field, Surabaya', status: 'live', category: 'National Series', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJXWL-Z7f7fP24_IyBjI_e-q_jYcMbzRtaKiOpKP8TxgqwSxRrCqNcE-GXJXbiCEv6rlwlNJzTmbbgAdQFWHH4Jk_Fw-aslTiT3Qezy8bbmGRG0WoRA-yD8tykZuxYObytzJ6Yf7yNL8poFU6vWlyEuFjbHcIzwfoLAMru-bfdw4GXezmv71SwRPYw_-Ct6ZP3f6AqglpvBIhCSrp9g13uTQpj69_-hzZqp1wSqJJ-9PdZqp0CYWgFWsajdRos9QmU7eeyuFhFPH0' },
    { slug: 'indonesian-open-2024', name: 'Indonesian Open Championship 2024', date: 'Nov 12 - 15, 2024', location: 'GBK Archery Field, Jakarta', status: 'upcoming', category: 'Grade A', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByxS8LZ93pBQXI_V_Vu3nB0633lwPZGiFCM3UtI-xk79b_O83ASmlHYA36lOzcnmVsbgs4DEe9awj543MvzCN1yzOo1wZ3ViXLdiMRV7vAMdy66lvu-l5dpFAOgZ0uCMKJxsBRXPJL1QeX4_ZdX2ynTEZR-ZMilrncma7gKG2YK0vsj0KJZnw_lD0UZaXFKW2aVFD1SU-mzi_sAT2D-62TP0j5LF6KprFriv2sV9rdypqLSvfrZekYDy45XaK8F1vVh7e5nfrgK7o' },
    { slug: 'bali-international-open', name: 'Bali International Open', date: 'Dec 01 - 05, 2024', location: 'Denpasar Archery Center, Bali', status: 'upcoming', category: 'Grade A', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmKeu4qLnuI8uJ8itXirIGY311f6c_CfhqFD3qtMv-M4oTNDiSeGeylyU0qI_7lQHeMywtfdDw175-dWrdxwZwWSnnEMmkBca4ScW0dEbBQ_wZYVWuCaOPI-A204QdKHKXQxHsutHbZP8c9uPaZpfK8lzqziHTAW_dqnlmi99AtLhIGmxfUZ-irvcNm1YUswSsH9HGhvq4Hr6jq7rsveM4HwMmhNVDABEGcgh0sYQHoHy9t1IzkTX2LexV72X240IEyZL2_InQGZ8' },
    { slug: 'jogja-youth-championship', name: 'Jogja Youth Championship', date: 'Dec 15 - 17, 2024', location: 'UNY Sports Complex, Yogyakarta', status: 'upcoming', category: null, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaKz9i1Sy4TPWgHSZRQZdfbE9FAsY4xikvvu2rhp8s_A9V5Sy5lv8pftyxQXwQSSv1xbdCGZkIqVOv_3u8sisf-kuW8CCXnYrzldx8xKkp12tmxF1SztarFv2PQMwoYr5sv7cn1wpmzOMepJof7lZkvTkOqS_LS94B-kyA-HRdMFPaNXbC-I6OY9Rp2dTCI-86cqoGMepWYeLPECuEvPwH35G_RyrcW4OoeB-xFCH1noe3E3mLKFdU_ftNYNRJ-e35YW_UO7tjW3E' },
    { slug: 'bandung-indoor-classic', name: 'Bandung Indoor Classic', date: 'Oct 20 - 22, 2024', location: 'GOR Pajajaran, Bandung', status: 'finished', category: null, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq8OlQbcxO7uY4gwKVt6JygaktR4FjGZfJwbWiOyDIXqXr0bCnQIn3f-5m63myglDTGxdrpDHrFX2wVGOC7C8INtL7td4RDrpYhrJi0qjxPG7jixXi-Cw0fJQfRMda9sgJhfzCsFLmMhX9mvC6_gNAo5OF_MDtU5ukfm3hvRqWuHC0pbxNqSd0uWfIxLjxHXmyDnRtFg9VIz-XC2tCuvSusJKEFLjs57_DO7_uOGurALxGKsxcgIJmc_0gHV72A6BGvhiStIpWr3o' },
    { slug: 'borneo-archery-festival', name: 'Borneo Archery Festival', date: 'Jan 10 - 14, 2025', location: 'Balikpapan Sports Center', status: 'upcoming', category: 'Club', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQStrrmLQN-DtqrTO5KWNF3EvwOXSw-raemHMh-lxMUVAtHiqxHNMqzQoV2l1ReELlRe_dVIAkp1P8Bc8ekRqbhOn-axS6izTQXKw3d70pq-CpZHWUZoS58mGL70U_Bk96ViNRcaOaGr5wIkPrtg8w46mzrAtHgWRH6VKAUalmkrFJ8qjDltkmd-nHJs4aUfrBBphZSnivwOkhoIjzG8dpjeCtp_UOZTOnovXJP7IAWJEeWqw7Uh7-mlLVkorgyeOsSRun6CmO_8I' },
    { slug: 'semarang-open-2024', name: 'Semarang Open 2024', date: 'Sep 05 - 08, 2024', location: 'Jatidiri Stadium, Semarang', status: 'finished', category: null, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEyoMyPhTl7-9oRbs8Fqz1YZxEwczL3vvrIpNzNHGImIhte8_MRqCsmxPDpeo-GMFv4xD1UFE7CzQuZjLAaeTEFSwwGpLM5Fuuji1ri-DclVPd3XjaiZbP_HVCmNxUF4N4RvPt5eunD3D7XJwRXiE80p0b-XDjG79vpkghLPtwWffcqE__kLuIxrZg_xFXL5tPcnF3V-v_UjBTeSP3GZHOFSZ132JQ3wm91uitNtsctbagveyUjYxxYgEumBV7_uYhaBtTeHfBlCs' },
    { slug: 'medan-archery-open', name: 'Medan Archery Open 2024', date: 'Feb 01 - 04, 2025', location: 'USU Sports Center, Medan', status: 'upcoming', category: 'Regional', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAy5qIYUnhOAA9fRw-ezPUypzWUtCQTHv6EpNe6Q0bAAz6AFkDLOqgltBvPdIyyRsW4WqNcDFxXZlfgwFHWevvHH2yphLfwWEOEHT3GyFbvXsenr1qoxDPsSf-bmVfNqwG9_5cJoVMhgvCJ2FfEt6bQgicn5WlBrsP8axm39cBTN9E6cF7MQ9vKO5p0acgAZ1z3IYSXi-yQILL1HoOdT6ZobZEyg4qolUIumeiK6bVGuATW7dwLfqmaRIFiXL-l1PEPGa_sRD5Lc9E' },
    { slug: 'makassar-championship', name: 'Makassar Championship 2024', date: 'Feb 15 - 18, 2025', location: 'Karebosi Field, Makassar', status: 'upcoming', category: 'Provincial', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmKeu4qLnuI8uJ8itXirIGY311f6c_CfhqFD3qtMv-M4oTNDiSeGeylyU0qI_7lQHeMywtfdDw175-dWrdxwZwWSnnEMmkBca4ScW0dEbBQ_wZYVWuCaOPI-A204QdKHKXQxHsutHbZP8c9uPaZpfK8lzqziHTAW_dqnlmi99AtLhIGmxfUZ-irvcNm1YUswSsH9HGhvq4Hr6jq7rsveM4HwMmhNVDABEGcgh0sYQHoHy9t1IzkTX2LexV72X240IEyZL2_InQGZ8' },
]

const filteredTournaments = computed(() => {
    let result = tournaments
    if (searchQuery.value) {
        result = result.filter(t => t.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    }
    if (sortBy.value === 'newest') {
        result = [...result].sort((a, b) => new Date(b.date.split(' - ')[0]) - new Date(a.date.split(' - ')[0]))
    } else if (sortBy.value === 'oldest') {
        result = [...result].sort((a, b) => new Date(a.date.split(' - ')[0]) - new Date(b.date.split(' - ')[0]))
    } else if (sortBy.value === 'name') {
        result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    }
    return result
})

useSeoMeta({
    title: 'Tournaments - Archeryhub.id',
    description: 'Browse and register for archery tournaments across Indonesia.'
})
</script>

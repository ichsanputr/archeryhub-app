<template>
    <div class="bg-[#f3f4f6] text-slate-900 font-[Manrope,sans-serif] antialiased min-h-screen flex flex-col">

        <!-- ── Header ── -->
        <header class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <NuxtLink to="/" class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-[#0e1e3a] rounded-lg flex items-center justify-center">
                            <Icon icon="ph:target-fill" class="text-[#c3f53c] text-xl" />
                        </div>
                        <span class="text-[#0e1e3a] text-xl font-bold tracking-tight">Archery Hub</span>
                    </NuxtLink>

                    <nav class="hidden md:flex items-center gap-8">
                        <NuxtLink to="/"
                            class="text-slate-600 hover:text-[#0e1e3a] font-medium text-sm transition-colors">Beranda
                        </NuxtLink>
                        <NuxtLink to="/events"
                            class="text-slate-600 hover:text-[#0e1e3a] font-medium text-sm transition-colors">Turnamen
                        </NuxtLink>
                        <NuxtLink to="/archers"
                            class="text-[#0e1e3a] font-bold text-sm relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-[#0e1e3a] after:-bottom-5 after:left-0">
                            Atlet</NuxtLink>
                        <NuxtLink to="/clubs"
                            class="text-slate-600 hover:text-[#0e1e3a] font-medium text-sm transition-colors">Klub
                        </NuxtLink>
                    </nav>

                    <div class="flex items-center gap-3">
                        <button @click="openShareDialog"
                            class="hidden md:flex items-center gap-2 text-slate-600 font-medium text-sm hover:text-[#0e1e3a] transition-colors">
                            <Icon icon="ph:share-network-bold" />
                            Bagikan
                        </button>
                        <NuxtLink to="/archers"
                            class="bg-[#0e1e3a] hover:bg-[#1a365d] text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg">
                            Cari Atlet
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </header>

        <!-- ── Hero Banner ── -->
        <div class="bg-[#0e1e3a] relative overflow-hidden">
            <div class="absolute inset-0 z-0">
                <div class="absolute inset-0 bg-gradient-to-r from-[#0e1e3a] via-[#0e1e3a]/95 to-[#0e1e3a]/40 z-10">
                </div>
                <img :src="useImageOrDefault(archer.photo_url || archer.banner_url, archer.full_name)"
                    class="w-full h-full object-cover object-center opacity-30 mix-blend-overlay" />
            </div>

            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div class="flex flex-col md:flex-row items-center md:items-end gap-8">
                    <!-- Avatar Circle -->
                    <div class="flex-shrink-0 relative group">
                        <div
                            class="w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-[#c3f53c] shadow-[0_0_30px_rgba(195,245,60,0.3)] overflow-hidden bg-gray-800">
                            <img :src="useImageOrDefault(archer.photo_url || archer.avatar_url, archer.full_name)"
                                :alt="archer.full_name"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <!-- Bow type badge -->
                        <div class="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                            :title="bowTypeLabel">
                            <Icon icon="ph:bow-bold" class="text-[#0e1e3a] text-lg" />
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="flex-1 text-center md:text-left text-white mb-2">
                        <!-- Country badge -->
                        <div
                            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                            <span class="text-sm">🇮🇩</span>
                            <span class="text-sm font-bold tracking-wide">INA — Indonesia</span>
                        </div>

                        <h1 class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2">
                            {{ archer.full_name || 'Profil Atlet' }}
                        </h1>

                        <div class="flex flex-col md:flex-row items-center gap-4 text-slate-300 text-base mb-6">
                            <div v-if="bowTypeLabel" class="flex items-center gap-2">
                                <Icon icon="ph:bow-bold" class="text-[#c3f53c]" />
                                <span>{{ bowTypeLabel }}</span>
                            </div>
                            <span v-if="bowTypeLabel && archer.club_name"
                                class="hidden md:inline text-slate-600">•</span>
                            <div v-if="archer.club_name" class="flex items-center gap-2">
                                <Icon icon="ph:buildings-bold" class="text-[#c3f53c]" />
                                <NuxtLink v-if="archer.club_slug" :to="`/clubs/${archer.club_slug}`"
                                    class="hover:text-[#c3f53c] transition-colors">{{ archer.club_name }}</NuxtLink>
                                <span v-else>{{ archer.club_name }}</span>
                            </div>
                        </div>

                        <div class="flex flex-wrap justify-center md:justify-start gap-3">
                            <button
                                class="h-10 px-6 bg-[#c3f53c] hover:bg-[#a3d92a] text-[#0e1e3a] font-bold rounded-lg transition-colors flex items-center gap-2">
                                <Icon icon="ph:plus-bold" class="text-lg" />
                                Ikuti Atlet
                            </button>
                            <button @click="openShareDialog"
                                class="h-10 px-6 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg backdrop-blur-sm border border-white/10 transition-colors flex items-center gap-2">
                                <Icon icon="ph:share-network-bold" class="text-lg" />
                                Bagikan Profil
                            </button>
                        </div>
                    </div>

                    <!-- Status card -->
                    <div v-if="archer.bio"
                        class="hidden lg:block bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 w-72">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-slate-400 text-xs font-bold uppercase tracking-wider">Biografi</span>
                            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        </div>
                        <p class="text-white text-sm leading-relaxed line-clamp-4">{{ archer.bio }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Main Content ── -->
        <main
            class="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 -mt-6 relative z-30">

            <!-- Top Stats Row -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Events Participated -->
                <div
                    class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#c3f53c]/50 transition-colors">
                    <div>
                        <p class="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Event</p>
                        <div class="flex items-baseline gap-2">
                            <h3 class="text-4xl font-black text-[#0e1e3a]">{{ eventHistory.length || '—' }}</h3>
                            <span class="text-slate-400 text-sm font-medium">partisipasi</span>
                        </div>
                    </div>
                    <div
                        class="w-12 h-12 bg-[#0e1e3a]/5 rounded-full flex items-center justify-center text-[#0e1e3a] group-hover:bg-[#0e1e3a] group-hover:text-[#c3f53c] transition-colors">
                        <Icon icon="ph:calendar-check-bold" class="text-2xl" />
                    </div>
                </div>

                <!-- Avg Arrow Score -->
                <div
                    class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#c3f53c]/50 transition-colors">
                    <div>
                        <p class="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Pengalaman</p>
                        <div class="flex items-baseline gap-2">
                            <h3 class="text-4xl font-black text-[#0e1e3a]">{{ archer.experience_years || '—' }}</h3>
                            <span class="text-slate-400 text-sm font-medium">tahun</span>
                        </div>
                    </div>
                    <div
                        class="w-12 h-12 bg-[#0e1e3a]/5 rounded-full flex items-center justify-center text-[#0e1e3a] group-hover:bg-[#0e1e3a] group-hover:text-[#c3f53c] transition-colors">
                        <Icon icon="ph:medal-bold" class="text-2xl" />
                    </div>
                </div>

                <!-- Personal Info -->
                <div
                    class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#c3f53c]/50 transition-colors">
                    <div>
                        <p class="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Kota / Lokasi</p>
                        <div class="flex items-baseline gap-2">
                            <h3 class="text-2xl font-black text-[#0e1e3a] leading-tight">{{ archer.city || 'Indonesia'
                            }}</h3>
                        </div>
                    </div>
                    <div
                        class="w-12 h-12 bg-[#0e1e3a]/5 rounded-full flex items-center justify-center text-[#0e1e3a] group-hover:bg-[#0e1e3a] group-hover:text-[#c3f53c] transition-colors">
                        <Icon icon="ph:map-pin-bold" class="text-2xl" />
                    </div>
                </div>
            </div>

            <!-- Biography + Sidebar Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Bio & Performance -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Biography -->
                    <div v-if="archer.bio" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 class="text-lg font-bold text-[#0e1e3a] flex items-center gap-2 mb-4">
                            <Icon icon="ph:user-bold" class="text-[#c3f53c]" />
                            Biografi
                        </h3>
                        <p class="text-slate-600 leading-relaxed">{{ archer.bio }}</p>
                    </div>

                    <!-- Performance Bar Chart -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-lg font-bold text-[#0e1e3a] flex items-center gap-2">
                                <Icon icon="ph:chart-bar-bold" class="text-[#c3f53c]" />
                                Tren Performa
                            </h3>
                            <span class="text-xs text-slate-400 font-bold uppercase tracking-wider">Skor
                                Kualifikasi</span>
                        </div>

                        <template v-if="perfBars.length > 0">
                            <div class="relative h-52 w-full flex items-end justify-between gap-2 pt-8 pb-6 px-2">
                                <!-- Grid lines -->
                                <div
                                    class="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6 text-[10px] text-slate-300 font-mono">
                                    <div
                                        class="border-b border-dashed border-slate-100 w-full h-0 flex items-center gap-1">
                                        <span class="-mt-3">{{ perfMax }}</span>
                                    </div>
                                    <div
                                        class="border-b border-dashed border-slate-100 w-full h-0 flex items-center gap-1">
                                        <span class="-mt-3">{{ Math.round((perfMax + perfMin) / 2) }}</span>
                                    </div>
                                    <div class="border-b border-slate-100 w-full h-0"></div>
                                </div>

                                <div v-for="(bar, i) in perfBars" :key="i"
                                    class="relative flex flex-col items-center justify-end h-full w-full group">
                                    <div class="w-full rounded-t-sm relative transition-all duration-300"
                                        :class="i === perfBars.length - 1 ? 'bg-[#0e1e3a]' : 'bg-[#0e1e3a]/20 group-hover:bg-[#0e1e3a]/40'"
                                        :style="{ height: bar.pct + '%' }">
                                        <div class="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] py-1 px-2 rounded whitespace-nowrap"
                                            :class="i === perfBars.length - 1 ? 'bg-[#c3f53c] text-[#0e1e3a] font-bold opacity-100' : 'bg-[#0e1e3a] text-white opacity-0 group-hover:opacity-100 transition-opacity'">
                                            {{ bar.score }}
                                        </div>
                                    </div>
                                    <span
                                        class="text-[9px] text-slate-400 font-bold mt-2 text-center truncate w-full px-1">{{
                                            bar.label }}</span>
                                </div>
                            </div>
                        </template>
                        <div v-else class="h-52 flex flex-col items-center justify-center text-slate-300">
                            <Icon icon="ph:chart-bar-light" class="text-5xl mb-3" />
                            <p class="text-sm font-bold uppercase tracking-widest">Belum ada data skor</p>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                    <!-- Personal Data -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 class="text-lg font-bold text-[#0e1e3a] flex items-center gap-2 mb-5">
                            <Icon icon="ph:identification-card-bold" class="text-[#c3f53c]" />
                            Data Atlet
                        </h3>
                        <div class="space-y-3 text-sm">
                            <div v-if="archer.id"
                                class="flex items-center justify-between py-2 border-b border-gray-50">
                                <span class="text-slate-500 font-medium">Kode Atlet</span>
                                <span class="font-black text-[#0e1e3a] font-mono">{{ archer.id }}</span>
                            </div>
                            <div v-if="genderLabel"
                                class="flex items-center justify-between py-2 border-b border-gray-50">
                                <span class="text-slate-500 font-medium">Jenis Kelamin</span>
                                <span class="font-bold text-[#0e1e3a]">{{ genderLabel }}</span>
                            </div>
                            <div v-if="archer.date_of_birth"
                                class="flex items-center justify-between py-2 border-b border-gray-50">
                                <span class="text-slate-500 font-medium">Tgl. Lahir</span>
                                <span class="font-bold text-[#0e1e3a]">{{ formatDate(archer.date_of_birth) }}</span>
                            </div>
                            <div v-if="bowTypeLabel"
                                class="flex items-center justify-between py-2 border-b border-gray-50">
                                <span class="text-slate-500 font-medium">Jenis Busur</span>
                                <span
                                    class="font-bold text-[#0e1e3a] px-2 py-0.5 bg-[#c3f53c]/20 rounded text-xs uppercase">{{
                                        bowTypeLabel }}</span>
                            </div>
                            <div v-if="archer.city" class="flex items-center justify-between py-2">
                                <span class="text-slate-500 font-medium">Kota</span>
                                <span class="font-bold text-[#0e1e3a]">{{ archer.city }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Equipment (if available) -->
                    <div v-if="archer.equipment?.length"
                        class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 class="text-lg font-bold text-[#0e1e3a] flex items-center gap-2 mb-5">
                            <Icon icon="ph:wrench-bold" class="text-[#c3f53c]" />
                            Perlengkapan
                        </h3>
                        <div class="space-y-3">
                            <div v-for="item in archer.equipment" :key="item.type"
                                class="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                                <div
                                    class="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-[#0e1e3a] shadow-sm">
                                    <Icon icon="ph:package-bold" class="text-lg" />
                                </div>
                                <div>
                                    <p class="text-[10px] text-slate-500 font-bold uppercase">{{ item.type }}</p>
                                    <p class="font-bold text-[#0e1e3a] text-sm">{{ item.name }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Club affiliation -->
                    <div v-if="archer.club_name" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 class="text-lg font-bold text-[#0e1e3a] flex items-center gap-2 mb-5">
                            <Icon icon="ph:buildings-bold" class="text-[#c3f53c]" />
                            Afiliasi Klub
                        </h3>
                        <NuxtLink v-if="archer.club_slug" :to="`/clubs/${archer.club_slug}`"
                            class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[#0e1e3a] group transition-colors">
                            <div
                                class="w-10 h-10 bg-[#0e1e3a] group-hover:bg-[#c3f53c] rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                                <Icon icon="ph:buildings-bold"
                                    class="text-[#c3f53c] group-hover:text-[#0e1e3a] transition-colors" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-[10px] text-slate-500 group-hover:text-slate-400 font-bold uppercase">
                                    Anggota Aktif</p>
                                <p
                                    class="font-bold text-[#0e1e3a] group-hover:text-white truncate text-sm transition-colors">
                                    {{ archer.club_name }}</p>
                            </div>
                            <Icon icon="ph:caret-right-bold"
                                class="text-slate-300 group-hover:text-white transition-colors flex-shrink-0" />
                        </NuxtLink>
                        <div v-else class="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                            <div
                                class="w-10 h-10 bg-[#0e1e3a]/5 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Icon icon="ph:buildings-bold" class="text-[#0e1e3a]" />
                            </div>
                            <p class="font-bold text-[#0e1e3a] text-sm">{{ archer.club_name }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ── Recent Results Table ── -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 class="text-lg font-bold text-[#0e1e3a] flex items-center gap-2">
                        <Icon icon="ph:clock-counter-clockwise-bold" class="text-[#c3f53c]" />
                        Riwayat Event
                    </h3>
                    <span class="text-sm text-slate-400 font-medium">{{ eventHistory.length }} event</span>
                </div>

                <template v-if="eventHistory.length > 0">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm">
                            <thead>
                                <tr
                                    class="bg-gray-50 border-b border-gray-100 text-xs uppercase text-slate-500 tracking-wider">
                                    <th class="px-6 py-4 font-bold">Turnamen</th>
                                    <th class="px-6 py-4 font-bold">Tanggal</th>
                                    <th class="px-6 py-4 font-bold">Kota</th>
                                    <th class="px-6 py-4 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr v-for="event in eventHistory" :key="event.id"
                                    class="group hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="w-9 h-9 rounded-lg bg-[#0e1e3a]/5 flex items-center justify-center flex-shrink-0">
                                                <Icon icon="ph:trophy-bold" class="text-[#0e1e3a] text-base" />
                                            </div>
                                            <span class="font-bold text-[#0e1e3a]">{{ event.name }}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-slate-600">{{ formatDate(event.date, 'MMM YYYY') }}</td>
                                    <td class="px-6 py-4 text-slate-600">{{ event.city || '—' }}</td>
                                    <td class="px-6 py-4">
                                        <span
                                            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#c3f53c]/20 text-[#0e1e3a] text-xs font-bold">
                                            <Icon icon="ph:check-circle-bold" class="text-sm" />
                                            Berpartisipasi
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
                <div v-else class="py-16 text-center text-slate-300">
                    <Icon icon="ph:calendar-blank-light" class="text-5xl mx-auto mb-3" />
                    <p class="text-sm font-bold uppercase tracking-widest">Riwayat event belum tersedia</p>
                </div>
            </div>
        </main>

        <!-- ── Footer ── -->
        <footer class="bg-[#0e1e3a] text-white py-12 mt-auto">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-[#c3f53c] rounded-lg flex items-center justify-center">
                            <Icon icon="ph:target-fill" class="text-[#0e1e3a] text-xl" />
                        </div>
                        <span class="text-xl font-bold tracking-tight">Archery Hub</span>
                    </div>
                    <div class="flex gap-8 text-sm text-slate-300">
                        <NuxtLink to="/events" class="hover:text-white transition-colors">Event</NuxtLink>
                        <NuxtLink to="/archers" class="hover:text-white transition-colors">Atlet</NuxtLink>
                        <NuxtLink to="/clubs" class="hover:text-white transition-colors">Klub</NuxtLink>
                    </div>
                    <div class="text-sm text-slate-400">
                        © {{ new Date().getFullYear() }} Archery Hub Indonesia.
                    </div>
                </div>
            </div>
        </footer>

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
                            <p class="text-xs text-slate-500">{{ bowTypeLabel }} • {{ archer.city || 'Indonesia' }}</p>
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
import { useRoute } from 'vue-router'
import { useDateFormat } from '@vueuse/core'

definePageMeta({ layout: false })

useHead({
    link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap' },
        { rel: 'canonical', href: useRequestURL().href }
    ]
})

const route = useRoute()
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

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

useSeoMeta({
    title: () => archer.value?.full_name
        ? `${archer.value.full_name} — Profil Atlet Panahan | Archeryhub.id`
        : 'Profil Atlet Panahan — Archeryhub.id',
    description: () => archer.value?.full_name
        ? `Lihat profil ${archer.value.full_name}, atlet panahan ${archer.value.bow_type || ''} dari ${archer.value.city || 'Indonesia'}. Statistik, riwayat event, dan prestasi lengkap di Archeryhub.id.`
        : 'Profil atlet panahan Indonesia di Archeryhub.id',
})

// ── Computed Labels ──
const bowTypeLabel = computed(() => {
    const labels = { recurve: 'Recurve', compound: 'Compound', barebow: 'Barebow', traditional: 'Traditional' }
    return labels[archer.value?.bow_type] || archer.value?.bow_type || ''
})

const genderLabel = computed(() =>
    archer.value?.gender === 'male' ? 'Laki-laki'
        : archer.value?.gender === 'female' ? 'Perempuan' : '')

const formatDate = (date, format = 'DD MMMM YYYY') => {
    if (!date) return '-'
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

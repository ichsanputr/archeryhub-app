<template>
    <div class="min-h-screen bg-[#fdfdfd] text-[#111827] selection:bg-[#D9FF00] selection:text-[#0f172a] font-sans">
        <!-- Navigation Bar (Glass effect) -->
        <nav
            class="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 h-20 flex items-center justify-between glass-card border-b border-[#e2e8f0]/50">
            <NuxtLink to="/" class="flex items-center gap-2">
                <div class="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center text-[#D9FF00]">
                    <Icon icon="ph:target-bold" class="text-2xl" />
                </div>
                <span class="font-black text-xl tracking-tighter uppercase italic hidden sm:block">Archery<span
                        class="text-[#D9FF00]">Hub</span></span>
            </NuxtLink>

            <div
                class="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-[#0f172a]/70">
                <a href="#overview"
                    class="hover:text-[#0f172a] transition-colors border-b-2 border-[#D9FF00]">Ringkasan</a>
                <a href="#history"
                    class="hover:text-[#0f172a] transition-colors border-b-2 border-transparent">Riwayat</a>
                <a href="#achievements"
                    class="hover:text-[#0f172a] transition-colors border-b-2 border-transparent">Prestasi</a>
            </div>

            <div class="flex items-center gap-3">
                <button @click="openShareDialog"
                    class="p-2.5 bg-[#0f172a]/5 hover:bg-[#0f172a]/10 rounded-full transition-all">
                    <Icon icon="ph:share-network-bold" class="text-xl text-[#0f172a]" />
                </button>
                <NuxtLink to="/archers"
                    class="bg-[#0f172a] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#1e293b] transition-all flex items-center gap-2">
                    Cari Pemanah
                </NuxtLink>
            </div>
        </nav>

        <main class="pt-20">
            <!-- Hero Section -->
            <section class="relative h-[70vh] md:h-[85vh] w-full overflow-hidden bg-[#0f172a]">
                <img :src="useImageOrDefault(archer.photo_url || archer.avatar_url, archer.full_name)"
                    class="w-full h-full object-cover object-top opacity-60 md:opacity-80 scale-105" />
                <div class="absolute inset-0 hero-gradient"></div>

                <div
                    class="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-8">
                    <div class="text-white space-y-4 w-full">
                        <div class="flex items-center gap-4">
                            <span v-if="archer.id"
                                class="px-4 py-1 bg-[#D9FF00] text-[#0f172a] text-[10px] font-black rounded-full uppercase tracking-[0.2em]">Atlet
                                Resmi</span>
                            <div class="flex items-center gap-1 text-[#D9FF00]">
                                <Icon icon="ph:star-fill" class="text-sm" />
                                <span class="text-[10px] font-bold uppercase tracking-widest">Pengalaman {{
                                    archer.experience_years || '5+' }} Tahun</span>
                            </div>
                        </div>
                        <h1
                            class="text-5xl md:text-9xl font-black uppercase tracking-tighter leading-none italic break-words">
                            {{ firstName }} <br />
                            <span
                                class="text-transparent border-t-0 bg-clip-text bg-gradient-to-r from-[#D9FF00] to-white">{{
                                lastName }}</span>
                        </h1>
                        <div class="flex items-center gap-6 pt-4">
                            <div class="flex items-center gap-2">
                                <span class="text-white/60 text-xs md:text-sm font-medium">Kewarganegaraan</span>
                                <span class="font-bold text-xs md:text-sm flex items-center gap-2">Indonesia 🇮🇩</span>
                            </div>
                            <div class="w-px h-4 bg-white/20"></div>
                            <div class="flex items-center gap-2">
                                <span class="text-white/60 text-xs md:text-sm font-medium">Jenis Busur</span>
                                <span class="font-bold text-xs md:text-sm uppercase tracking-widest">{{ bowTypeLabel
                                    }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Season Stats Card -->
                    <div class="glass-card p-6 md:p-8 rounded-3xl w-full md:w-80 space-y-6 shrink-0 shadow-2xl">
                        <div class="flex justify-between items-center">
                            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#0f172a]/50">Ringkasan
                                Musim</span>
                            <span class="text-[10px] font-bold text-[#0f172a] bg-[#0f172a]/5 px-2 py-1 rounded">Seri
                                2024</span>
                        </div>
                        <div class="space-y-1">
                            <p class="text-3xl font-black text-[#0f172a] italic leading-none">{{ averageArrowValue }}
                            </p>
                            <p class="text-[10px] font-bold text-[#0f172a]/40 uppercase tracking-widest">Rata-rata Skor
                            </p>
                        </div>
                        <div class="h-px bg-[#0f172a]/5"></div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-xl font-black text-[#0f172a]">{{ winRate }}</p>
                                <p class="text-[9px] font-bold text-[#0f172a]/40 uppercase tracking-widest">Kemenangan
                                </p>
                            </div>
                            <div>
                                <p class="text-xl font-black text-[#0f172a]">{{ podiumCount }}</p>
                                <p class="text-[9px] font-bold text-[#0f172a]/40 uppercase tracking-widest">Podium</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Profile Content -->
            <section id="overview" class="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
                <div class="grid grid-cols-12 gap-8 md:gap-16">
                    <!-- Main Column -->
                    <div class="col-span-12 lg:col-span-8 space-y-16">
                        <!-- Biography -->
                        <div class="space-y-6">
                            <h3
                                class="text-xs font-black uppercase tracking-[0.4em] text-[#0f172a]/30 flex items-center gap-4">
                                Biografi <span class="h-px flex-1 bg-[#e2e8f0]"></span>
                            </h3>
                            <p v-if="archer.bio"
                                class="text-lg md:text-xl text-[#0f172a]/80 leading-relaxed font-light italic">
                                "{{ archer.bio }}"
                            </p>
                            <p v-else class="text-lg text-[#0f172a]/40 leading-relaxed font-light italic">
                                Belum ada biografi resmi untuk atlet ini. Informasi sedang diperbarui oleh anggota
                                federasi.
                            </p>
                        </div>

                        <!-- Recent Performance -->
                        <div id="history" class="space-y-8">
                            <h3
                                class="text-xs font-black uppercase tracking-[0.4em] text-[#0f172a]/30 flex items-center gap-4">
                                Event Terbaru <span class="h-px flex-1 bg-[#e2e8f0]"></span>
                            </h3>

                            <div v-if="eventHistory.length > 0" class="space-y-4">
                                <div v-for="event in eventHistory" :key="event.id"
                                    class="group bg-white border border-[#e2e8f0] p-6 rounded-2xl flex items-center justify-between hover:shadow-xl hover:shadow-[#0f172a]/5 transition-all cursor-pointer">
                                    <div class="flex items-center gap-6">
                                        <div
                                            class="w-14 h-14 md:w-16 md:h-16 bg-[#f8fafc] rounded-xl flex flex-col items-center justify-center border border-[#e2e8f0] shrink-0">
                                            <span
                                                class="text-[8px] md:text-[10px] font-black text-[#0f172a]/40 uppercase">{{
                                                formatDate(event.date, 'MMM') }}</span>
                                            <span class="text-xl md:text-2xl font-black text-[#0f172a]">{{
                                                formatDate(event.date, 'DD') }}</span>
                                        </div>
                                        <div class="min-w-0">
                                            <h4 class="font-bold text-base md:text-lg text-[#0f172a] truncate">{{
                                                event.name }}</h4>
                                            <p class="text-xs md:text-sm text-[#64748b] truncate">{{ event.city }} •
                                                Tahap Kompetisi</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-4 md:gap-8 shrink-0">
                                        <div class="text-right hidden sm:block">
                                            <span
                                                class="px-3 py-1 bg-[#D9FF00]/20 text-[#0f172a] text-[9px] font-black rounded uppercase tracking-widest">Berpartisipasi</span>
                                            <p class="text-sm font-bold text-[#0f172a] mt-1">{{ formatDate(event.date,
                                                'YYYY') }}</p>
                                        </div>
                                        <Icon icon="ph:caret-right-bold"
                                            class="text-[#0f172a]/20 group-hover:text-[#D9FF00] transition-colors" />
                                    </div>
                                </div>
                            </div>
                            <div v-else
                                class="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center text-[#64748b]/50 italic">
                                <Icon icon="ph:calendar-blank-bold" class="text-4xl mx-auto mb-3 opacity-20" />
                                <p>Riwayat event atlet ini sedang dikumpulkan dari arsip data historis.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div class="col-span-12 lg:col-span-4 space-y-12">
                        <!-- Achievements -->
                        <div id="achievements" class="space-y-6">
                            <h3 class="text-xs font-black uppercase tracking-[0.4em] text-[#0f172a]/30">Statistik Utama
                            </h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="bg-[#0f172a] p-6 rounded-2xl text-white space-y-4">
                                    <div
                                        class="w-10 h-10 bg-[#D9FF00]/10 rounded-lg flex items-center justify-center text-[#D9FF00]">
                                        <Icon icon="ph:medal-bold" class="text-2xl" />
                                    </div>
                                    <div>
                                        <p class="text-2xl font-black italic">{{ podiumCount }}</p>
                                        <p
                                            class="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">
                                            Total Podium</p>
                                    </div>
                                </div>
                                <div
                                    class="bg-white border border-[#e2e8f0] p-6 rounded-2xl text-[#0f172a] space-y-4 shadow-sm">
                                    <div
                                        class="w-10 h-10 bg-[#0f172a]/5 rounded-lg flex items-center justify-center text-[#0f172a]">
                                        <Icon icon="ph:shooting-star-bold" class="text-2xl" />
                                    </div>
                                    <div>
                                        <p class="text-2xl font-black italic">{{ archer.experience_years || '5' }}th</p>
                                        <p
                                            class="text-[10px] font-bold text-[#0f172a]/40 uppercase tracking-widest leading-tight">
                                            Masa Karir</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Heat Map Analysis Card -->
                        <div class="bg-[#0f172a] p-8 rounded-3xl relative overflow-hidden shadow-xl">
                            <div class="relative z-10">
                                <h3
                                    class="text-white font-black uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
                                    <span class="w-1 h-1 rounded-full bg-[#D9FF00] animate-pulse"></span>
                                    Analisis Peta Akurasi Latihan
                                </h3>
                                <div class="flex justify-center mb-8">
                                    <div class="w-48 h-48 relative group cursor-crosshair">
                                        <!-- Animated Target Background -->
                                        <div
                                            class="absolute inset-0 border-[16px] border-[#D9FF00]/10 rounded-full transition-all group-hover:border-[#D9FF00]/20">
                                        </div>
                                        <div class="absolute inset-4 border-[16px] border-[#D9FF00]/30 rounded-full">
                                        </div>
                                        <div class="absolute inset-8 border-[16px] border-[#D9FF00]/50 rounded-full">
                                        </div>
                                        <div class="absolute inset-12 border-[16px] border-[#D9FF00]/70 rounded-full">
                                        </div>
                                        <div
                                            class="absolute inset-[3.5rem] bg-[#D9FF00] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(217,255,0,0.4)]">
                                            <span class="text-[#0f172a] text-xl font-black">{{ averageArrowValue
                                                }}</span>
                                        </div>

                                        <!-- Simulated Hit Dots -->
                                        <div v-for="i in 12" :key="i"
                                            class="absolute w-1.5 h-1.5 bg-white border border-[#0f172a] rounded-full shadow-sm"
                                            :style="{ top: (45 + Math.random() * 10) + '%', left: (45 + Math.random() * 10) + '%' }">
                                        </div>
                                    </div>
                                </div>
                                <p
                                    class="text-white/60 text-[10px] text-center leading-relaxed max-w-[200px] mx-auto uppercase font-bold tracking-widest">
                                    Akurasi sesi saat ini menunjukkan <span class="text-[#D9FF00]">Kepadatan
                                        Tinggi</span>.
                                </p>
                            </div>
                            <!-- Background Decor -->
                            <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-[#D9FF00]/10 rounded-full blur-3xl">
                            </div>
                        </div>

                        <!-- Organization Affiliation -->
                        <div v-if="archer.club_name" class="space-y-6">
                            <h3 class="text-xs font-black uppercase tracking-[0.4em] text-[#0f172a]/30">Afiliasi</h3>
                            <div class="p-6 bg-white rounded-2xl border border-[#e2e8f0] shadow-sm group">
                                <NuxtLink v-if="archer.club_slug" :to="`/clubs/${archer.club_slug}`"
                                    class="flex items-center gap-4">
                                    <div
                                        class="w-12 h-12 rounded-xl bg-[#0f172a] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Icon icon="ph:buildings-bold" class="text-white text-xl" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-[8px] text-[#64748b] font-black uppercase tracking-[0.2em] mb-1">
                                            Anggota Klub Utama</p>
                                        <p class="text-sm font-black text-[#0f172a] truncate uppercase">{{
                                            archer.club_name }}</p>
                                    </div>
                                    <Icon icon="ph:caret-right-bold"
                                        class="text-slate-300 group-hover:text-[#D9FF00] transition-colors" />
                                </NuxtLink>
                                <div v-else class="flex items-center gap-4">
                                    <div class="w-12 h-12 rounded-xl bg-[#0f172a]/5 flex items-center justify-center">
                                        <Icon icon="ph:buildings-bold" class="text-[#0f172a] text-xl" />
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-[8px] text-[#64748b] font-black uppercase tracking-[0.2em] mb-1">
                                            Anggota Klub Utama</p>
                                        <p class="text-sm font-black text-[#0f172a] truncate uppercase">{{
                                            archer.club_name }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Athlete Bio-Data Summary -->
                        <div class="space-y-6">
                            <h3 class="text-xs font-black uppercase tracking-[0.4em] text-[#0f172a]/30">Data Pribadi
                            </h3>
                            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-[#e2e8f0] space-y-4">
                                <div v-if="archer.date_of_birth"
                                    class="flex justify-between items-center py-2 border-b border-[#e2e8f0]/50 text-xs">
                                    <span class="text-[#64748b] font-medium">Tanggal Lahir</span>
                                    <span class="font-black text-[#0f172a]">{{ formatDate(archer.date_of_birth)
                                        }}</span>
                                </div>
                                <div v-if="archer.gender"
                                    class="flex justify-between items-center py-2 border-b border-[#e2e8f0]/50 text-xs">
                                    <span class="text-[#64748b] font-medium">Jenis Kelamin</span>
                                    <span class="font-black text-[#0f172a] uppercase tracking-wider">{{ genderLabel
                                        }}</span>
                                </div>
                                <div v-if="archer.city" class="flex justify-between items-center py-2 text-xs">
                                    <span class="text-[#64748b] font-medium">Lokasi</span>
                                    <span class="font-black text-[#0f172a]">{{ archer.city }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <!-- Footer -->
        <footer class="bg-[#0f172a] py-20 px-4 md:px-8 text-white relative overflow-hidden">
            <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-16 relative z-10">
                <div class="col-span-1 md:col-span-2 space-y-8">
                    <div class="flex items-center gap-2">
                        <div class="w-10 h-10 bg-[#D9FF00] rounded-xl flex items-center justify-center text-[#0f172a]">
                            <Icon icon="ph:target-bold" class="text-2xl" />
                        </div>
                        <span class="font-black text-2xl tracking-tighter uppercase italic">Archery<span
                                class="text-[#D9FF00]">Hub</span></span>
                    </div>
                    <p class="text-white/40 max-w-sm text-sm leading-relaxed font-light">
                        Destinasi utama untuk pelacakan panahan profesional, portofolio performa atlet, dan hasil
                        federasi global.
                    </p>
                    <div class="flex gap-4">
                        <div
                            class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#0f172a] cursor-pointer transition-all">
                            <Icon icon="ph:instagram-logo-bold" />
                        </div>
                        <div
                            class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#0f172a] cursor-pointer transition-all">
                            <Icon icon="ph:facebook-logo-bold" />
                        </div>
                        <div
                            class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#0f172a] cursor-pointer transition-all">
                            <Icon icon="ph:twitter-logo-bold" />
                        </div>
                    </div>
                </div>
                <div class="space-y-6">
                    <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Navigasi Portal</h4>
                    <nav class="flex flex-col gap-4 text-xs font-bold uppercase tracking-wider">
                        <NuxtLink to="/events" class="hover:text-[#D9FF00] transition-colors">Event Mendatang</NuxtLink>
                        <NuxtLink to="/archers" class="hover:text-[#D9FF00] transition-colors">Peringkat</NuxtLink>
                        <NuxtLink to="/clubs" class="hover:text-[#D9FF00] transition-colors">Direktori</NuxtLink>
                        <NuxtLink to="/auth/register" class="hover:text-[#D9FF00] transition-colors">Bergabung
                        </NuxtLink>
                    </nav>
                </div>
                <div class="space-y-6">
                    <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Buletin Hub</h4>
                    <div class="space-y-4">
                        <p class="text-[10px] text-white/60 font-bold uppercase tracking-widest leading-loose">Dapatkan
                            pembaruan performa dan peringatan pencarian atlet di email Anda.</p>
                        <div class="relative group">
                            <input
                                class="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#D9FF00] focus:border-[#D9FF00] outline-none transition-all"
                                placeholder="atlet@archeryhub.id" type="email" />
                            <button
                                class="absolute right-2 top-2 bg-[#D9FF00] text-[#0f172a] p-1.5 rounded-lg hover:scale-105 transition-transform shadow-lg">
                                <Icon icon="ph:arrow-right-bold" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">
                <p>© 2024 Archery Hub Ecosystem Professional. Dikembangkan oleh Tim ArcheryHubID.</p>
                <div class="flex gap-8">
                    <a href="#" class="hover:text-white transition-colors">Hukum</a>
                    <a href="#" class="hover:text-white transition-colors">Privasi</a>
                    <a href="#" class="hover:text-white transition-colors">Dukungan Teknis</a>
                </div>
            </div>

            <!-- Abstract Shapes Background -->
            <div
                class="absolute -top-20 -left-20 w-80 h-80 bg-[#D9FF00]/5 rounded-full blur-[100px] pointer-events-none">
            </div>
            <div
                class="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none">
            </div>
        </footer>

        <!-- Share Dialog -->
        <Transition name="modal">
            <div v-if="showShareDialog"
                class="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
                <Transition name="fade" appear>
                    <div @click="closeShareDialog" class="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-md"></div>
                </Transition>

                <Transition name="scale" appear>
                    <div
                        class="relative w-full max-w-md transform rounded-[2rem] bg-white p-8 md:p-10 text-left shadow-2xl transition-all border border-white/20">
                        <div class="flex items-center justify-between mb-8">
                            <h3 class="text-2xl font-black text-[#0f172a] uppercase tracking-tighter italic">Bagikan
                                Profil</h3>
                            <button @click="closeShareDialog"
                                class="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-[#0f172a] hover:bg-slate-100 transition-colors">
                                <Icon icon="ph:x-bold" class="text-xl" />
                            </button>
                        </div>

                        <div class="space-y-8">
                            <div class="flex items-center gap-6 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                <div
                                    class="w-16 h-16 rounded-2xl bg-white shadow-lg overflow-hidden shrink-0 border-2 border-white">
                                    <img :src="useImageOrDefault(archer.photo_url || archer.avatar_url, archer.full_name)"
                                        class="w-full h-full object-cover" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <p
                                        class="text-xs font-black text-[#0f172a]/40 uppercase tracking-widest mb-1 leading-none">
                                        Profil Atlet</p>
                                    <p class="font-black text-lg text-[#0f172a] truncate leading-none mb-1">{{
                                        archer.full_name }}</p>
                                    <p class="text-[10px] font-bold text-[#64748b] truncate tracking-wide leading-none">
                                        Anggota Hub {{ archer.city }}</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-4 gap-4">
                                <button v-for="plat in platforms" :key="plat.id" @click="shareTo(plat.id)"
                                    class="flex flex-col items-center gap-3 group">
                                    <div :class="`w-14 h-14 rounded-2xl ${plat.bg} flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-lg transition-all`"
                                        v-html="plat.iconHtml">
                                    </div>
                                    <span class="text-[9px] font-black text-[#0f172a]/50 uppercase tracking-widest">{{
                                        plat.name }}</span>
                                </button>
                            </div>

                            <div class="relative group mt-4">
                                <input type="text" readonly :value="shareUrl"
                                    class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-bold text-[#64748b] outline-none group-hover:border-[#D9FF00]/50 transition-colors" />
                                <button @click="copyLink"
                                    class="absolute right-2 top-2 px-4 py-2 bg-[#0f172a] text-white rounded-xl text-[9px] font-black hover:bg-[#1e293b] transition-all shadow-md">
                                    {{ copied ? 'TERSALIN' : 'SALIN TAUTAN' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>

        <!-- Texture Overlay -->
        <div class="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
            style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 40px 40px;"></div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDateFormat } from '@vueuse/core'

definePageMeta({
    layout: 'landing'
})

// SEO & Styling Setup
useHead({
    titleTemplate: (title) => `${title} - Profil Atlet Resmi | Archery Hub`,
    link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@700&display=swap' }
    ]
})

const route = useRoute()
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

// Data Fetching
const { data: archerResponse } = await useAsyncData(
    `archer-${route.params.slug}`,
    async () => {
        try {
            const [archerData, eventsData] = await Promise.all([
                $fetch(`${apiBaseUrl}/archers/${route.params.slug}`),
                $fetch(`${apiBaseUrl}/archers/${route.params.slug}/events`).catch(() => ({ events: [] }))
            ])
            return { archer: archerData, events: eventsData.events || [] }
        } catch (e) {
            console.error("Failed to fetch archer data")
            throw createError({ statusCode: 404, statusMessage: 'Profil Atlet Tidak Ditemukan' })
        }
    },
    { server: true }
)

const archer = computed(() => archerResponse.value?.archer || {})
const eventHistory = computed(() => archerResponse.value?.events || [])

// Name splitter for Typography
const firstName = computed(() => archer.value.full_name?.split(' ')[0] || 'Atlet')
const lastName = computed(() => archer.value.full_name?.split(' ').slice(1).join(' ') || 'Panahan')

// Mock/Calculated Stats
const averageArrowValue = computed(() => '9.' + (Math.floor(Math.random() * 50) + 40))
const winRate = computed(() => (Math.floor(Math.random() * 20) + 75) + '%')
const podiumCount = computed(() => Math.floor(Math.random() * 8) + 3)

const bowTypeLabel = computed(() => {
    const labels = { recurve: 'Recurve', compound: 'Compound', barebow: 'Barebow', traditional: 'Traditional' }
    return labels[archer.value?.bow_type] || archer.value?.bow_type || 'Elite'
})

const genderLabel = computed(() => archer.value?.gender === 'male' ? 'Laki-laki' : archer.value?.gender === 'female' ? 'Perempuan' : '-')

const formatDate = (date, format = 'DD MMMM YYYY') => {
    if (!date) return '-'
    return useDateFormat(date, format, { locales: 'id-ID' }).value
}

// Share System
const showShareDialog = ref(false)
const copied = ref(false)
const shareUrl = computed(() => typeof window !== 'undefined' ? window.location.href : '')

const openShareDialog = () => showShareDialog.value = true
const closeShareDialog = () => {
    showShareDialog.value = false
    copied.value = false
}

const platforms = [
    { id: 'whatsapp', name: 'WhatsApp', bg: 'bg-green-50 text-green-500 hover:bg-green-500 hover:text-white', iconHtml: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.038 3.069l-.669 2.445 2.511-.659c.722.451 1.591.696 2.891.696 3.128 0 5.768-2.586 5.768-5.766 0-3.18-2.585-5.766-5.762-5.766zm3.369 8.303c-.144.405-.842.755-1.168.807-.326.052-.728.093-2.185-.484-1.85-.733-3.038-2.613-3.13-2.733-.093-.12-.76-.997-.76-1.996 0-1 .475-1.5 0.692-1.742.176-.192.42-.312.693-.312s.273.012.396.024c.123 0 .285-.048.438.312.153.36.525 1.261.57 1.356.045.093.076.204.015.324-.312.612-.342.66-.45.804-.108.144-.225.216-.108.408.117.192.52 0.852 1.118 1.38.77.684 1.411.897 1.613.997.202.102.321.084.441-.054.12-.138.514-.594.651-.798.136-.204.272-.171.459-.102.187.069 1.187.561 1.391.663.204.102.341.15.39.231.05.081.05.462-.093.867z" /></svg>' },
    { id: 'facebook', name: 'Facebook', bg: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white', iconHtml: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>' },
    { id: 'twitter', name: 'X', bg: 'bg-slate-50 text-slate-800 hover:bg-slate-800 hover:text-white', iconHtml: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>' },
    { id: 'copy', name: 'Salin', bg: 'bg-slate-100 text-slate-600 hover:bg-[#0f172a] hover:text-white', iconHtml: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>' }
]

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(shareUrl.value)
        copied.value = true
        setTimeout(() => copied.value = false, 2000)
    } catch (err) { console.error('Gagal menyalin:', err) }
}

const shareTo = (platform) => {
    if (platform === 'copy') return copyLink()
    const text = encodeURIComponent(`Profil Profesional: ${archer.value?.full_name} | ArcheryHub.id`)
    const url = encodeURIComponent(shareUrl.value)
    let link = ''
    if (platform === 'whatsapp') link = `https://wa.me/?text=${text}%20${url}`
    else if (platform === 'facebook') link = `https://www.facebook.com/sharer/sharer.php?u=${url}`
    else if (platform === 'twitter') link = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
    if (link) {
        window.open(link, '_blank', 'noopener,noreferrer')
        closeShareDialog()
    }
}
</script>

<style scoped>
.glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.hero-gradient {
    background: linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.9) 100%);
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.4s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from,
.scale-leave-to {
    transform: scale(0.9) translateY(20px);
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Font smoothness */
* {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Custom underline for secondary links */
nav a {
    position: relative;
}

nav a::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: #D9FF00;
    transition: width 0.3s ease;
}

nav a:hover::after {
    width: 100%;
}
</style>

<template>
    <div class="bg-slate-50/60 min-h-screen flex flex-col selection:bg-primary selection:text-navy-dark">
        <Transition name="fade" mode="out-in">
            <ArcherPageSkeleton v-if="isLoading || !archerResponse" key="skeleton" />
            <div v-else key="content">
                <!-- ── Hero Section ── -->
                <section class="relative w-full overflow-hidden bg-gradient-to-br from-[#1a365d] via-[#0f172a] to-[#1e3a8a] pt-24 sm:pt-36 pb-0 flex items-end">
                    <!-- Backdrop image -->
                    <img :src="useImageOrDefault(archer.banner_url || archer.avatar_url, archer.full_name)"
                        class="absolute inset-0 w-full h-full object-cover object-top opacity-20 mix-blend-overlay pointer-events-none scale-105 filter blur-sm"
                        :alt="archer.full_name" />
                    <!-- Motif Pattern from settings -->
                    <div class="absolute inset-0 pointer-events-none z-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.08);"></div>
                    <!-- Radial vignette -->
                    <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(30,58,138,0.25),rgba(15,23,42,0.85))]"></div>
                    <!-- Top golden gradient border -->
                    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
                    <!-- Bottom fade -->
                    <div class="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-slate-50/60 to-transparent pointer-events-none z-10"></div>

                    <div class="relative w-full px-4 sm:px-6 md:px-12 max-w-7xl mx-auto z-10 pb-20 sm:pb-24">
                        <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-10">
                            <div class="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                                <!-- Avatar -->
                                <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white/10 shadow-2xl overflow-hidden shrink-0 bg-navy/50 backdrop-blur-md">
                                    <img :src="useImageOrDefault(archer.avatar_url, archer.full_name)"
                                        class="w-full h-full object-cover"
                                        :alt="archer.full_name" />
                                </div>

                                <!-- Identity -->
                                <div class="flex-1 min-w-0 space-y-3">
                                    <!-- Badges row -->
                                    <div class="flex flex-wrap items-center gap-2">
                                        <span class="px-3 py-1 bg-primary text-navy text-xs font-bold rounded-lg">
                                            {{ t('archers.public.pro_archer', 'Pemanah Pro') }}
                                        </span>
                                        <div v-if="archer.club_name" class="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg">
                                            <Icon icon="ph:shield-star-fill" class="text-primary text-xs" />
                                            <span class="text-xs font-bold text-white/90">{{ archer.club_name }}</span>
                                        </div>
                                    </div>

                                    <!-- Name -->
                                    <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
                                        {{ archer.full_name }}
                                    </h1>

                                    <!-- Meta row -->
                                    <div class="flex flex-wrap items-center gap-4 text-sm text-white/60 font-bold">
                                        <span class="flex items-center gap-1.5">
                                            <Icon icon="ph:map-pin-bold" class="text-primary text-sm" />
                                            {{ archer.city || 'Indonesia' }}
                                        </span>
                                        <span v-if="bowTypeLabel" class="flex items-center gap-1.5">
                                            <Icon icon="ph:target-bold" class="text-primary text-sm" />
                                            {{ bowTypeLabel }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Stats & Summary -->
                            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                                <div class="flex items-center gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden shrink-0 backdrop-blur-md">
                                    <div class="text-center px-5 py-3.5 sm:px-6 sm:py-4">
                                        <div class="text-xs font-medium text-white/60 mb-1">{{ t('archers.public.events', 'Event') }}</div>
                                        <div class="text-2xl font-black text-white">{{ statsSummary.totalEvents }}</div>
                                    </div>
                                    <div class="w-px h-10 bg-white/10"></div>
                                    <div class="text-center px-5 py-3.5 sm:px-6 sm:py-4">
                                        <div class="text-xs font-bold text-primary mb-1">{{ t('archers.public.wins', 'Menang') }}</div>
                                        <div class="text-2xl font-black text-primary">{{ statsSummary.wins }}</div>
                                    </div>
                                    <div class="w-px h-10 bg-white/10"></div>
                                    <div class="text-center px-5 py-3.5 sm:px-6 sm:py-4">
                                        <div class="text-xs font-medium text-white/60 mb-1">{{ t('archers.public.avg_rank', 'Rata-rata Peringkat') }}</div>
                                        <div class="text-2xl font-black text-white">#{{ statsSummary.avgRank }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ── Main Content (ONE SINGLE PARENT CARD CONTAINER) ── -->
                <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 -mt-10 relative z-20 pb-24 w-full">
                    <div class="bg-white rounded-3xl border border-gray-200/70 shadow-md p-6 sm:p-10 md:p-12 space-y-12">
                        
                        <!-- ── 1. Bio, Trend & Highlights Section ── -->
                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            <!-- Left Column: Bio & Trend -->
                            <div class="lg:col-span-8 space-y-8">
                                <!-- Biography -->
                                <div class="space-y-3">
                                    <div class="flex items-center gap-3">
                                        <h3 class="text-sm font-bold text-slate-900">
                                            {{ t('archers.public.athlete_biography', 'Biografi Atlet') }}
                                        </h3>
                                        <div class="h-px flex-1 bg-slate-100"></div>
                                    </div>
                                    <div v-if="archer.bio" class="text-sm sm:text-base text-slate-700 leading-relaxed font-normal prose prose-sm max-w-none"
                                        v-html="archer.bio">
                                    </div>
                                    <div v-else class="p-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex items-center gap-3.5 text-slate-400">
                                        <Icon icon="ph:user-circle-bold" class="text-2xl text-slate-300 shrink-0" />
                                        <span class="text-xs font-medium">{{ t('archers.public.no_bio', 'Atlet belum menambahkan ringkasan biografi profil.') }}</span>
                                    </div>
                                </div>

                                <!-- Performance Trend -->
                                <div v-if="perfBars.length >= 2" class="space-y-4 pt-2">
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-xs font-bold text-slate-400 flex items-center gap-4">
                                            {{ t('archers.public.performance_trend', 'Tren Performa') }}
                                        </h3>
                                        <span class="text-xs font-medium text-slate-400">{{ t('archers.public.qual_scores_last_6', 'Skor Kualifikasi (6 Event Terakhir)') }}</span>
                                    </div>

                                    <div class="relative w-full h-48 bg-navy-dark rounded-2xl p-4 overflow-hidden shadow-inner group">
                                        <!-- SVG Line Path -->
                                        <svg class="w-full h-full" viewBox="0 0 600 150" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stop-color="#eab308" stop-opacity="0.3" />
                                                    <stop offset="100%" stop-color="#eab308" stop-opacity="0" />
                                                </linearGradient>
                                            </defs>
                                            <line x1="20" y1="20" x2="580" y2="20" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
                                            <line x1="20" y1="75" x2="580" y2="75" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
                                            <line x1="20" y1="130" x2="580" y2="130" stroke="rgba(255,255,255,0.05)" stroke-width="1" />

                                            <path :d="svgAreaPath" fill="url(#areaGrad)" />
                                            <path :d="svgPath" fill="none" stroke="#eab308" stroke-width="3" stroke-linecap="round" />

                                            <circle v-for="(p, i) in svgPoints" :key="i"
                                                :cx="p.x" :cy="p.y" r="5" fill="#0f172a" stroke="#eab308" stroke-width="3" />
                                        </svg>

                                        <div class="absolute inset-x-0 bottom-1.5 px-6 flex justify-between text-xs font-medium text-slate-400">
                                            <span v-for="(p, i) in svgPoints" :key="i">{{ p.label }}</span>
                                        </div>

                                        <div v-for="(p, i) in svgPoints" :key="i"
                                            class="absolute text-xs font-bold text-white px-2 py-0.5 bg-navy border border-white/10 rounded-lg transform -translate-x-1/2 -translate-y-full"
                                            :style="{ left: `${(p.x / 600) * 100}%`, top: `${(p.y / 150) * 100 - 8}%` }">
                                            {{ p.score }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Recent Competition Summary -->
                                <div class="space-y-4 pt-2">
                                    <h3 class="text-xs font-bold text-slate-400 flex items-center gap-4">
                                        {{ t('archers.public.recent_competition', 'Kompetisi Terkini') }} <span class="h-px flex-1 bg-gray-100"></span>
                                    </h3>
                                    <div v-if="groupedEventHistory.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div v-for="event in groupedEventHistory.slice(0, 2)" :key="event.id"
                                            class="bg-slate-50/50 border border-gray-200/60 rounded-2xl p-5 hover:shadow-xs hover:border-slate-300 transition-all group cursor-pointer"
                                            @click="router.push(`/events/${event.slug}`)">
                                            <div class="flex items-center gap-4 mb-3">
                                                <div class="w-11 h-11 bg-navy rounded-xl flex flex-col items-center justify-center shrink-0">
                                                    <span class="text-xs font-bold text-white/70">{{ formatDate(event.date, 'MMM') }}</span>
                                                    <span class="text-sm font-black text-white leading-none">{{ formatDate(event.date, 'DD') }}</span>
                                                </div>
                                                <div class="min-w-0 flex-1">
                                                    <h4 class="font-black text-navy truncate text-xs sm:text-sm">{{ event.name }}</h4>
                                                    <div class="text-xs text-slate-500 font-medium mt-0.5 truncate">{{ event.city }}</div>
                                                </div>
                                            </div>
                                            <div class="flex items-center justify-between pt-3 border-t border-gray-200/60">
                                                <div class="flex flex-wrap gap-1">
                                                    <span v-for="cat in event.categories.slice(0, 1)" :key="cat"
                                                        class="px-2.5 py-0.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-slate-600">
                                                        {{ cat }}
                                                    </span>
                                                </div>
                                                <div class="text-right">
                                                    <span class="text-xs font-medium text-slate-500 block">{{ t('archers.public.table_placement', 'Peringkat') }}</span>
                                                    <span class="text-base font-black text-navy">#{{ event.rank || '-' }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="border border-dashed border-gray-200 rounded-2xl p-6 text-center bg-gray-50/50">
                                        <h4 class="font-black text-navy text-xs">{{ t('archers.public.no_competition_history', 'Belum Ada Riwayat Kompetisi') }}</h4>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column: Trophy Highlights & Socials -->
                            <div class="lg:col-span-4 space-y-8 border-t lg:border-t-0 lg:border-l border-gray-100 pt-8 lg:pt-0 lg:pl-8">
                                <!-- Trophy Showcase -->
                                <div class="bg-navy rounded-2xl p-6 text-white relative overflow-hidden shadow-md border border-white/5">
                                    <div class="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
                                        <Icon icon="ph:trophy-bold" class="text-[14rem]" />
                                    </div>
                                    <h3 class="text-xs font-bold text-slate-400 mb-5 flex items-center gap-2">
                                        <Icon icon="ph:crown-bold" class="text-primary text-base" />
                                        {{ t('archers.public.top_highlights', 'Sorotan Prestasi') }}
                                    </h3>
                                    <div v-if="processedAchievements.highlights.length" class="space-y-3">
                                        <div v-for="(ach, idx) in processedAchievements.highlights" :key="idx"
                                            class="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3.5">
                                            <Icon icon="ph:medal-fill" class="text-primary text-lg shrink-0 mt-0.5" />
                                            <div class="text-xs font-bold leading-relaxed text-slate-100">{{ ach }}</div>
                                        </div>
                                    </div>
                                    <div v-else class="text-center py-6 border border-white/10 rounded-xl bg-white/5">
                                        <Icon icon="ph:shield-warning-bold" class="text-2xl text-white/30 mx-auto mb-2" />
                                        <div class="text-xs font-medium text-white/60">{{ t('archers.public.no_highlights', 'Belum Ada Highlight Prestasi') }}</div>
                                    </div>
                                </div>

                                <!-- Social Channels -->
                                <div class="space-y-3">
                                    <h4 class="text-sm font-bold text-slate-900">
                                        {{ t('archers.public.social_channels', 'Media Sosial') }}
                                    </h4>
                                    <div v-if="hasAnySocial" class="grid grid-cols-2 gap-2.5">
                                        <a v-if="archer.social_instagram"
                                            :href="`https://instagram.com/${archer.social_instagram.replace('@', '')}`"
                                            target="_blank"
                                            class="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl group transition-all text-slate-800">
                                            <Icon icon="ph:instagram-logo-bold" class="text-base text-slate-400 group-hover:text-pink-600 transition-colors" />
                                            <span class="text-xs font-bold truncate">Instagram</span>
                                        </a>
                                        <a v-if="archer.social_tiktok"
                                            :href="`https://tiktok.com/@${archer.social_tiktok.replace('@', '')}`"
                                            target="_blank"
                                            class="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl group transition-all text-slate-800">
                                            <Icon icon="ph:tiktok-logo-bold" class="text-base text-slate-400 group-hover:text-slate-900 transition-colors" />
                                            <span class="text-xs font-bold truncate">TikTok</span>
                                        </a>
                                        <a v-if="archer.social_facebook"
                                            :href="archer.social_facebook.startsWith('http') ? archer.social_facebook : `https://${archer.social_facebook}`"
                                            target="_blank"
                                            class="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl group transition-all text-slate-800">
                                            <Icon icon="ph:facebook-logo-bold" class="text-base text-slate-400 group-hover:text-blue-600 transition-colors" />
                                            <span class="text-xs font-bold truncate">Facebook</span>
                                        </a>
                                        <a v-if="archer.social_twitter"
                                            :href="`https://twitter.com/${archer.social_twitter.replace('@', '')}`"
                                            target="_blank"
                                            class="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl group transition-all text-slate-800">
                                            <Icon icon="ph:x-logo-bold" class="text-base text-slate-400 group-hover:text-slate-900 transition-colors" />
                                            <span class="text-xs font-bold truncate">X / Twitter</span>
                                        </a>
                                        <a v-if="archer.social_youtube"
                                            :href="archer.social_youtube.startsWith('http') ? archer.social_youtube : `https://youtube.com/${archer.social_youtube}`"
                                            target="_blank"
                                            class="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl group transition-all text-slate-800">
                                            <Icon icon="ph:youtube-logo-bold" class="text-base text-slate-400 group-hover:text-red-600 transition-colors" />
                                            <span class="text-xs font-bold truncate">YouTube</span>
                                        </a>
                                        <a v-if="archer.social_website"
                                            :href="archer.social_website.startsWith('http') ? archer.social_website : `https://${archer.social_website}`"
                                            target="_blank"
                                            class="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl group transition-all text-slate-800">
                                            <Icon icon="ph:globe-bold" class="text-base text-slate-400 group-hover:text-primary transition-colors" />
                                            <span class="text-xs font-bold truncate">Website</span>
                                        </a>
                                        <a v-if="archer.social_whatsapp"
                                            :href="`https://wa.me/${archer.social_whatsapp.replace(/[^0-9]/g, '')}`"
                                            target="_blank"
                                            class="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl group transition-all col-span-2 text-slate-800">
                                            <Icon icon="ph:whatsapp-logo-bold" class="text-base text-slate-400 group-hover:text-green-600 transition-colors" />
                                            <span class="text-xs font-bold">WhatsApp</span>
                                        </a>
                                    </div>
                                    <div v-else class="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center space-y-1">
                                        <Icon icon="ph:share-network" class="text-xl text-slate-300 mx-auto" />
                                        <div class="text-xs text-slate-400 font-medium">{{ t('archers.public.no_social_links', 'Belum ada tautan media sosial') }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Divider Line -->
                        <div class="h-px bg-gray-100 w-full"></div>

                        <!-- ── 2. Specifications & Performance Breakdown ── -->
                        <div class="space-y-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-base font-black text-navy tracking-wider">{{ t('archers.public.athlete_specifications', 'Spesifikasi Atlet') }}</h3>
                                    <div class="text-xs text-slate-400 mt-0.5">{{ t('archers.public.athlete_specifications_subtitle', 'Riwayat Pribadi, Afiliasi, dan Kredensial Lengkap') }}</div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                <!-- Compact Specifications Grid -->
                                <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div class="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center gap-3">
                                        <div class="size-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-2xs">
                                            <Icon icon="ph:shield-star-bold" class="text-lg text-primary" />
                                        </div>
                                        <div class="min-w-0">
                                            <span class="text-xs font-medium text-slate-500 block leading-none mb-1">{{ t('archers.public.education_affiliation', 'Klub / Afiliasi') }}</span>
                                            <div class="font-bold text-slate-900 text-xs sm:text-sm truncate">{{ archer.club_name || '-' }}</div>
                                        </div>
                                    </div>

                                    <div class="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center gap-3">
                                        <div class="size-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-2xs">
                                            <Icon icon="ph:gender-intersex-bold" class="text-lg text-slate-700" />
                                        </div>
                                        <div class="min-w-0">
                                            <span class="text-xs font-medium text-slate-500 block leading-none mb-1">{{ t('archers.public.gender_profile', 'Profil & Usia') }}</span>
                                            <div class="font-bold text-slate-900 text-xs sm:text-sm truncate">
                                                {{ genderLabel }}
                                                <span v-if="age" class="text-slate-400 font-medium ml-1">({{ age }} {{ t('archers.public.years_old', 'thn') }})</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center gap-3">
                                        <div class="size-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-2xs">
                                            <Icon icon="ph:crosshair-bold" class="text-lg text-slate-700" />
                                        </div>
                                        <div class="min-w-0">
                                            <span class="text-xs font-medium text-slate-500 block leading-none mb-1">{{ t('archers.public.bow_division', 'Divisi Busur') }}</span>
                                            <div class="font-bold text-slate-900 text-xs sm:text-sm truncate">{{ bowTypeLabel || '-' }}</div>
                                        </div>
                                    </div>

                                    <div class="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center gap-3">
                                        <div class="size-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-2xs">
                                            <Icon icon="ph:hand-pointing-bold" class="text-lg text-slate-700" />
                                        </div>
                                        <div class="min-w-0">
                                            <span class="text-xs font-medium text-slate-500 block leading-none mb-1">{{ t('archers.public.hand_dominance', 'Dominansi Tangan') }}</span>
                                            <div class="font-bold text-slate-900 text-xs sm:text-sm truncate">{{ handDominanceLabel }}</div>
                                        </div>
                                    </div>

                                    <div v-if="archer.height_cm || archer.weight_kg" class="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center gap-3">
                                        <div class="size-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-2xs">
                                            <Icon icon="ph:barbell-bold" class="text-lg text-slate-700" />
                                        </div>
                                        <div class="min-w-0">
                                            <span class="text-xs font-medium text-slate-500 block leading-none mb-1">{{ t('archers.public.height_weight', 'Tinggi & Berat Badan') }}</span>
                                            <div class="font-bold text-slate-900 text-xs sm:text-sm truncate">
                                                {{ [archer.height_cm ? `${archer.height_cm} cm` : '', archer.weight_kg ? `${archer.weight_kg} kg` : ''].filter(Boolean).join(' / ') }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center gap-3">
                                        <div class="size-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-2xs">
                                            <Icon icon="ph:map-pin-bold" class="text-lg text-slate-700" />
                                        </div>
                                        <div class="min-w-0">
                                            <span class="text-xs font-medium text-slate-500 block leading-none mb-1">{{ t('archers.public.resident_address', 'Domisili / Asal') }}</span>
                                            <div class="font-bold text-slate-900 text-xs sm:text-sm leading-tight truncate">
                                                {{ archer.city || 'Indonesia' }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Compact Performance Summary Box -->
                                <div class="lg:col-span-5 bg-navy rounded-2xl p-5 text-white relative overflow-hidden shadow-xs border border-white/10 space-y-3">
                                    <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
                                        <span class="text-xs font-medium text-slate-400">{{ t('archers.public.performance_summary', 'Ringkasan Statistik') }}</span>
                                        <span class="text-xs font-mono font-bold text-primary">{{ statsSummary.totalEvents }} Event</span>
                                    </div>

                                    <div class="grid grid-cols-2 gap-3 text-xs">
                                        <div class="bg-white/5 border border-white/10 rounded-xl p-2.5">
                                            <span class="text-slate-400 font-medium block leading-none mb-1">{{ t('archers.public.podium_finishes', 'Podium Kejuaraan') }}</span>
                                            <span class="text-base font-black text-primary">{{ statsSummary.podiums }}x {{ t('archers.public.times_unit', 'Podium') }}</span>
                                        </div>
                                        <div class="bg-white/5 border border-white/10 rounded-xl p-2.5">
                                            <span class="text-slate-400 font-medium block leading-none mb-1">{{ t('archers.public.gold_medals', 'Medali Emas') }}</span>
                                            <span class="text-base font-black text-white">{{ statsSummary.wins }} {{ t('archers.public.wins_unit', 'Emas') }}</span>
                                        </div>
                                        <div class="bg-white/5 border border-white/10 rounded-xl p-2.5">
                                            <span class="text-slate-400 font-medium block leading-none mb-1">{{ t('archers.public.personal_best', 'Skor Tertinggi') }}</span>
                                            <span class="text-base font-black text-primary">{{ statsSummary.maxScore || '-' }} {{ t('archers.public.pts_unit', 'Pts') }}</span>
                                        </div>
                                        <div class="bg-white/5 border border-white/10 rounded-xl p-2.5">
                                            <span class="text-slate-400 font-medium block leading-none mb-1">{{ t('archers.public.average_score', 'Rata-rata Skor') }}</span>
                                            <span class="text-base font-black text-white">{{ statsSummary.avgScore || '-' }} {{ t('archers.public.pts_unit', 'Pts') }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Divider Line -->
                        <div class="h-px bg-gray-100 w-full"></div>

                        <!-- ── 3. Equipment Locker (Peralatan & Gear) ── -->
                        <div class="space-y-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-base font-black text-navy tracking-wider">{{ t('archers.public.equipment_locker', 'Peralatan & Gear') }}</h3>
                                    <div class="text-xs text-slate-400 mt-0.5">{{ t('archers.public.verified_gear', 'Perlengkapan panahan resmi yang digunakan atlet.') }}</div>
                                </div>
                            </div>

                            <div v-if="parsedEquipment.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                <div v-for="(gear, idx) in parsedEquipment" :key="idx"
                                    class="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:bg-white hover:shadow-xs transition-all">
                                    <div class="size-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary mb-3 shadow-2xs">
                                        <Icon :icon="gear.icon || 'ph:crosshair-bold'" class="text-lg" />
                                    </div>
                                    <div>
                                        <span class="text-[11px] font-medium text-slate-500 block leading-none mb-1">{{ gear.label }}</span>
                                        <div class="font-bold text-slate-900 text-xs truncate">{{ gear.value }}</div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="p-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex items-center gap-3.5 text-slate-400">
                                <Icon icon="ph:backpack-bold" class="text-2xl text-slate-300 shrink-0" />
                                <span class="text-xs font-medium">{{ t('archers.public.no_equipment', 'Belum ada data peralatan yang dicantumkan atlet.') }}</span>
                            </div>
                        </div>

                        <!-- Divider Line -->
                        <div v-if="processedAchievements.full.length" class="h-px bg-gray-100 w-full"></div>

                        <!-- ── 4. All Achievements & Honors Log ── -->
                        <div v-if="processedAchievements.full.length" class="space-y-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-base font-black text-navy tracking-wider">{{ t('archers.public.achievements_log', 'Log Prestasi') }}</h3>
                                    <div class="text-xs text-slate-400 mt-0.5">{{ t('archers.public.achievements_desc', 'Daftar medali, kejuaraan, dan rekor resmi yang telah diraih atlet.') }}</div>
                                </div>
                                <span class="text-xs font-black bg-primary/10 text-navy px-3 py-1 rounded-full border border-primary/20">
                                    {{ processedAchievements.full.length }} {{ t('archers.public.achievements_count_unit', 'Prestasi') }}
                                </span>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-for="(ach, idx) in processedAchievements.full" :key="idx"
                                    class="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-primary/40 hover:shadow-xs transition-all group">
                                    <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 group-hover:bg-primary group-hover:text-navy transition-all shrink-0">
                                        <Icon icon="ph:medal-fill" class="text-lg" />
                                    </div>
                                    <span class="font-bold text-navy text-xs sm:text-sm leading-snug">{{ ach }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Divider Line -->
                        <div class="h-px bg-gray-100 w-full"></div>

                        <!-- ── 5. Tournament & Competition History ── -->
                        <div class="space-y-4">
                            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h3 class="text-base font-black text-navy tracking-tight">{{ t('archers.public.tournament_history_title', 'Riwayat Turnamen & Kejuaraan') }}</h3>
                                    <div class="text-xs text-slate-500 font-medium mt-0.5">{{ t('archers.public.tournament_history_desc', 'Catatan keikutsertaan turnamen resmi, kategori lomba, dan peringkat atlet.') }}</div>
                                </div>
                                <!-- Search input -->
                                <div class="relative w-full sm:w-72 shrink-0">
                                    <span class="absolute inset-y-0 left-3 flex items-center text-slate-400">
                                        <Icon icon="ph:magnifying-glass-bold" />
                                    </span>
                                    <input type="text" v-model="searchQuery"
                                        :placeholder="t('archers.public.search_tournament', 'Cari Turnamen...')"
                                        class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-primary transition-all bg-gray-50/50" />
                                </div>
                            </div>

                            <div class="overflow-x-auto -mx-6 sm:mx-0">
                                <table class="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
                                    <thead>
                                        <tr class="bg-gray-50 text-slate-400 border-y border-gray-100">
                                            <th class="px-6 py-3.5 text-xs font-bold text-slate-500 tracking-normal">{{ t('archers.public.table_date', 'Tanggal') }}</th>
                                            <th class="px-6 py-3.5 text-xs font-bold text-slate-500 tracking-normal">{{ t('archers.public.table_tournament', 'Turnamen') }}</th>
                                            <th class="px-6 py-3.5 text-xs font-bold text-slate-500 tracking-normal">{{ t('archers.public.table_division', 'Divisi') }}</th>
                                            <th class="px-6 py-3.5 text-xs font-bold text-slate-500 tracking-normal text-center">{{ t('archers.public.table_placement', 'Peringkat') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-100">
                                        <tr v-for="event in filteredEventHistory" :key="event.id"
                                            class="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                            @click="router.push(`/events/${event.slug}`)">
                                            <td class="px-6 py-4 font-mono text-xs text-slate-400">{{ formatDate(event.date, 'DD MMM YYYY') }}</td>
                                            <td class="px-6 py-4">
                                                <div class="font-black text-navy transition-colors text-xs sm:text-sm">{{ event.name }}</div>
                                                <div class="text-xs text-slate-500 font-medium mt-0.5">{{ event.city }}</div>
                                            </td>
                                            <td class="px-6 py-4">
                                                <div class="flex flex-wrap gap-1">
                                                    <span v-for="cat in event.categories" :key="cat"
                                                        class="px-2.5 py-0.5 bg-gray-100 rounded-full text-xs font-semibold text-slate-600 tracking-wider">
                                                        {{ cat }}
                                                    </span>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 text-center">
                                                <span :class="[
                                                    'inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-black shadow-xs italic',
                                                    event.rank === 1 ? 'bg-amber-100 text-amber-800' :
                                                    event.rank === 2 ? 'bg-slate-200 text-slate-800' :
                                                    event.rank === 3 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-slate-600'
                                                ]">
                                                    #{{ event.rank }}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr v-if="filteredEventHistory.length === 0">
                                            <td colspan="4" class="px-6 py-12 text-center text-slate-400">
                                                <Icon icon="ph:folder-open-bold" class="text-3xl mx-auto mb-2 opacity-50" />
                                                <div class="text-xs font-medium text-slate-400">{{ t('archers.public.no_matching_tournaments', 'Tidak Ada Turnamen yang Cocok') }}</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watchEffect, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDateFormat } from '@vueuse/core'
import { getBowIcon } from '~/utils/bowIcons'
import { useTheme } from '~/composables/useTheme'
import { useI18n } from 'vue-i18n'

definePageMeta({ layout: 'landing' })

const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const { t } = useI18n()

onMounted(() => {
    try {
        useTheme().applyTheme()
    } catch (e) {
        console.warn('Failed to apply theme:', e)
    }
})

const searchQuery = ref('')

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

// Throw 404 if archer not found
watchEffect(() => {
    if (!isLoading.value) {
        if (archerError.value || !archerResponse.value || !archerResponse.value?.archer?.full_name) {
            throw createError({ statusCode: 404, statusMessage: 'Athlete profile not found', fatal: true })
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
                categories: [],
                rank: event.rank || '-'
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

    return Array.from(grouped.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// Filtered event history for Search
const filteredEventHistory = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return groupedEventHistory.value
    return groupedEventHistory.value.filter(e =>
        e.name.toLowerCase().includes(query) ||
        (e.city && e.city.toLowerCase().includes(query)) ||
        e.categories.some(cat => cat.toLowerCase().includes(query))
    )
})

useSeoMeta({
    title: () => archer.value?.full_name
        ? `${archer.value.full_name} — ${t('archers.public.pro_archer', 'Archer Profile')} | Archeris`
        : `${t('archers.title', 'Archer Profile')} — Archeris`,
    description: () => archer.value?.full_name
        ? `View the athlete profile of ${archer.value.full_name}${archer.value.bow_type ? `, ${archer.value.bow_type} archer` : ''}${archer.value.city ? ` from ${archer.value.city}` : ''}. Tournament history, arrow average, and achievements at Archeris.net.`
        : 'Archer profiles, tournament records, and verified achievements at Archeris.net',
    ogTitle: () => archer.value?.full_name
        ? `${archer.value.full_name} — Archer Profile | Archeris`
        : 'Archer Profile — Archeris',
    ogDescription: () => archer.value?.full_name
        ? `View the athlete profile of ${archer.value.full_name}${archer.value.bow_type ? `, ${archer.value.bow_type} archer` : ''}. Tournament records and stats at Archeris.net.`
        : 'Archer profiles and verified achievements at Archeris.net',
    ogType: 'profile'
})

useHead({
    title: computed(() => archer.value?.full_name
        ? `${archer.value.full_name} - ${t('archers.athlete_profile', 'Archer Profile')} | Archeris`
        : `${t('archers.athlete_profile', 'Archer Profile')} - Archeris`
    )
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

const genderLabel = computed(() => {
    const val = (archer.value?.gender || '').toLowerCase()
    if (val === 'male' || val === 'm' || val === 'laki-laki') return t('archers.public.male', 'Laki-laki')
    if (val === 'female' || val === 'f' || val === 'perempuan') return t('archers.public.female', 'Perempuan')
    return '-'
})

const handDominanceLabel = computed(() => {
    const val = (archer.value?.hand_dominance || '').toLowerCase()
    if (val === 'right' || val === 'kanan') return t('archers.public.hand_right', 'Tangan Kanan')
    if (val === 'left' || val === 'kiri') return t('archers.public.hand_left', 'Tangan Kiri')
    return archer.value?.hand_dominance || '-'
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

const hasAnySocial = computed(() => {
    return Boolean(
        archer.value?.social_instagram ||
        archer.value?.social_tiktok ||
        archer.value?.social_whatsapp ||
        archer.value?.social_facebook ||
        archer.value?.social_twitter ||
        archer.value?.social_youtube ||
        archer.value?.social_website
    )
})

const parsedEquipment = computed(() => {
    if (!archer.value?.equipment) return []
    try {
        if (typeof archer.value.equipment === 'string' && archer.value.equipment.trim().startsWith('{')) {
            const obj = JSON.parse(archer.value.equipment)
            const iconMap = {
                riser: 'ph:bow-bold',
                limbs: 'ph:arrows-out-cardinal-bold',
                sight: 'ph:crosshair-bold',
                stabilizer: 'ph:line-segments-bold',
                arrows: 'ph:arrow-bend-up-right-bold',
                tab: 'ph:hand-pointing-bold',
                string: 'ph:activity-bold'
            }
            return Object.entries(obj).filter(([_, v]) => Boolean(v)).map(([k, v]) => ({
                label: k.charAt(0).toUpperCase() + k.slice(1),
                value: String(v),
                icon: iconMap[k.toLowerCase()] || 'ph:crosshair-bold'
            }))
        }
    } catch (e) {}

    if (typeof archer.value.equipment === 'string') {
        return archer.value.equipment
            .split(/\r?\n/)
            .map(l => l.trim())
            .filter(Boolean)
            .map(line => {
                const parts = line.split(':')
                if (parts.length >= 2) {
                    return {
                        label: parts[0].trim(),
                        value: parts.slice(1).join(':').trim(),
                        icon: 'ph:crosshair-bold'
                    }
                }
                return {
                    label: 'Gear',
                    value: line,
                    icon: 'ph:crosshair-bold'
                }
            })
    }
    return []
})

const processedAchievements = computed(() => {
    if (!archer.value?.achievements) return { highlights: [], full: [] }
    const lines = archer.value.achievements.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
    const explicitHighlights = lines.filter(l => l.startsWith('[H] ')).map(l => l.replace('[H] ', ''))
    const full = lines.map(l => l.replace('[H] ', ''))
    const highlights = (explicitHighlights.length > 0 ? explicitHighlights : full).slice(0, 3)
    return { highlights, full }
})

const formatDate = (date, format = 'DD MMMM YYYY') => {
    if (!date) return ''
    return useDateFormat(date, format, { locales: 'id-ID' }).value
}

// ── Performance Trend Line Calculations ──
const perfBars = computed(() => {
    const events = eventHistory.value
    if (!events.length) return []
    const scored = events
        .filter(e => e.total_score || e.qual_score)
        .slice(-6)
        .map(e => ({
            score: e.total_score || e.qual_score || 0,
            label: formatDate(e.date, 'MMM YY')
        }))
    if (!scored.length) return []
    const max = Math.max(...scored.map(s => s.score))
    const min = Math.min(...scored.map(s => s.score))
    return scored.map(s => ({
        ...s,
        pct: max > 0 ? Math.max(15, Math.round(((s.score - min * 0.95) / (max * 1.05 - min * 0.95)) * 80) + 10) : 50
    }))
})

const svgPath = computed(() => {
    const bars = perfBars.value
    if (bars.length < 2) return ''
    const width = 600
    const height = 150
    const padding = 20
    const xStep = (width - padding * 2) / (bars.length - 1)
    
    return bars.map((b, i) => {
        const x = padding + i * xStep
        const y = height - padding - (b.pct / 100) * (height - padding * 2)
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
})

const svgAreaPath = computed(() => {
    const bars = perfBars.value
    if (bars.length < 2) return ''
    const width = 600
    const height = 150
    const padding = 20
    const xStep = (width - padding * 2) / (bars.length - 1)
    const points = bars.map((b, i) => {
        const x = padding + i * xStep
        const y = height - padding - (b.pct / 100) * (height - padding * 2)
        return `${x},${y}`
    })
    const startX = padding
    const endX = padding + (bars.length - 1) * xStep
    const bottomY = height - padding
    return `M ${startX} ${bottomY} L ${points.join(' L ')} L ${endX} ${bottomY} Z`
})

const svgPoints = computed(() => {
    const bars = perfBars.value
    if (!bars.length) return []
    const width = 600
    const height = 150
    const padding = 20
    const xStep = (width - padding * 2) / Math.max(1, bars.length - 1)
    return bars.map((b, i) => {
        const x = padding + i * xStep
        const y = height - padding - (b.pct / 100) * (height - padding * 2)
        return { x, y, score: b.score, label: b.label }
    })
})

const statsSummary = computed(() => {
    const events = eventHistory.value
    const scores = events.map(e => e.total_score || e.qual_score).filter(Boolean)
    const ranks = events.map(e => Number(e.rank)).filter(r => !isNaN(r))
    
    const totalEvents = events.length
    const wins = ranks.filter(r => r === 1).length
    const podiums = ranks.filter(r => r <= 3).length
    const maxScore = scores.length ? Math.max(...scores) : 0
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    const avgRank = ranks.length ? (ranks.reduce((a, b) => a + b, 0) / ranks.length).toFixed(1) : '-'

    return {
        totalEvents,
        wins,
        podiums,
        maxScore,
        avgScore,
        avgRank
    }
})
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

<template>
    <div class="bg-white min-h-screen flex flex-col selection:bg-primary selection:text-navy-dark">
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
                    <!-- Bottom fade into white -->
                    <div class="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>

                    <div class="relative w-full px-4 sm:px-6 md:px-12 max-w-7xl mx-auto z-10 pb-20 sm:pb-24">
                        <div class="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-10">
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
                                    <span class="px-3 py-1 bg-primary text-navy text-[9px] font-black rounded-lg capitalize tracking-widest">
                                        {{ t('archers.public.pro_archer') }}
                                    </span>
                                    <div v-if="archer.club_name" class="flex items-center gap-1.5 px-3 py-1 bg-white/8 backdrop-blur-sm border border-white/10 rounded-lg">
                                        <Icon icon="ph:shield-star-fill" class="text-primary text-xs" />
                                        <span class="text-[9px] font-black tracking-widest text-white/80 capitalize">{{ archer.club_name }}</span>
                                    </div>
                                </div>

                                <!-- Name -->
                                <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
                                    {{ archer.full_name }}
                                </h1>

                                <!-- Meta row -->
                                <div class="flex flex-wrap items-center gap-4 text-sm text-white/50 font-bold">
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

                            <!-- Stats pill row — right side on desktop -->
                            <div class="flex items-center gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden shrink-0 backdrop-blur-md">
                                <div class="text-center px-6 py-4">
                                    <div class="text-[9px] font-black text-white/40 tracking-widest capitalize mb-1">{{ t('archers.public.events') }}</div>
                                    <div class="text-2xl font-black text-white">{{ statsSummary.totalEvents }}</div>
                                </div>
                                <div class="w-px h-12 bg-white/10"></div>
                                <div class="text-center px-6 py-4">
                                    <div class="text-[9px] font-black text-primary tracking-widest capitalize mb-1">{{ t('archers.public.wins') }}</div>
                                    <div class="text-2xl font-black text-primary">{{ statsSummary.wins }}</div>
                                </div>
                                <div class="w-px h-12 bg-white/10"></div>
                                <div class="text-center px-6 py-4">
                                    <div class="text-[9px] font-black text-white/40 tracking-widest capitalize mb-1">{{ t('archers.public.avg_rank') }}</div>
                                    <div class="text-2xl font-black text-white">#{{ statsSummary.avgRank }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ── Main Content (consolidated inside exactly one card) ── -->
                <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 -mt-12 relative z-20 pb-24 w-full">
                    <div class="bg-white rounded-3xl border border-gray-200/60 shadow-md overflow-hidden">
                        <!-- inner sub-navigation tab bar -->
                        <div class="border-b border-gray-100 bg-gray-50/50 px-6 sm:px-10 py-4 flex flex-wrap items-center justify-between gap-4">
                            <div class="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none">
                                <button v-for="tab in ['overview', 'results', 'bio']" :key="tab"
                                    @click="activeTab = tab"
                                    class="py-2.5 font-black text-xs tracking-widest capitalize transition-all duration-300 relative shrink-0"
                                    :class="activeTab === tab ? 'text-navy border-b-2 border-primary' : 'text-gray-400 hover:text-navy'">
                                    {{ t('archers.public.' + tab) }}
                                </button>
                            </div>
                            <button @click="openShareDialog"
                                class="flex items-center gap-2 py-2 px-4 bg-white border border-gray-200 rounded-xl text-[10px] font-black tracking-widest text-navy hover:bg-gray-50 transition-all capitalize shrink-0">
                                <Icon icon="ph:share-network-bold" class="text-sm text-primary" />
                                <span>{{ t('archers.public.share') }}</span>
                            </button>
                        </div>

                        <!-- active tab panels -->
                        <div class="p-6 sm:p-10">
                            <Transition name="fade" mode="out-in">
                                <div v-if="activeTab === 'overview'" key="overview" class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                    <!-- Left Column: Bio & Analytics -->
                                    <div class="lg:col-span-8 space-y-10">
                                         <!-- Biography -->
                                         <div class="space-y-4">
                                             <h3 class="text-xs font-black tracking-[0.2em] text-navy/40 flex items-center gap-4 capitalize">
                                                 {{ t('archers.public.athlete_biography') }} <span class="h-px flex-1 bg-gray-100"></span>
                                             </h3>
                                             <div class="text-sm sm:text-base text-navy/70 leading-relaxed font-light">
                                                 {{ archer.bio || `${archer.full_name} adalah atlet panahan profesional berdedikasi tinggi yang berkompetisi aktif di kategori ${bowTypeLabel || 'Recurve'}. Berfokus pada presisi tinggi dan konsistensi mental untuk meraih podium kejuaraan nasional.` }}
                                             </div>
                                         </div>

                                         <!-- Performance Trend -->
                                         <div v-if="perfBars.length >= 2" class="space-y-6 pt-6">
                                             <div class="flex items-center justify-between">
                                                 <h3 class="text-xs font-black tracking-[0.2em] text-navy/40 flex items-center gap-4 capitalize">
                                                     {{ t('archers.public.performance_trend') }}
                                                 </h3>
                                                 <span class="text-[10px] font-black text-slate-400 tracking-wider capitalize">{{ t('archers.public.qual_scores_last_6') }}</span>
                                             </div>

                                             <div class="relative w-full h-48 bg-navy-dark rounded-2xl p-4 overflow-hidden shadow-inner group">
                                                 <!-- SVG Line Path -->
                                                 <svg class="w-full h-full" viewBox="0 0 600 150" preserveAspectRatio="none">
                                                     <defs>
                                                         <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                                             <stop offset="0%" stop-color="#c3f53c" stop-opacity="0.3" />
                                                             <stop offset="100%" stop-color="#c3f53c" stop-opacity="0" />
                                                         </linearGradient>
                                                     </defs>
                                                     <!-- Grid Lines -->
                                                     <line x1="20" y1="20" x2="580" y2="20" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
                                                     <line x1="20" y1="75" x2="580" y2="75" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
                                                     <line x1="20" y1="130" x2="580" y2="130" stroke="rgba(255,255,255,0.05)" stroke-width="1" />

                                                     <!-- Area fill under trend line -->
                                                     <path :d="svgAreaPath" fill="url(#areaGrad)" />
                                                     <!-- Main Trend Line -->
                                                     <path :d="svgPath" fill="none" stroke="#c3f53c" stroke-width="3" stroke-linecap="round" />

                                                     <!-- Interactive Circles -->
                                                     <circle v-for="(p, i) in svgPoints" :key="i"
                                                         :cx="p.x" :cy="p.y" r="5" fill="#0f172a" stroke="#c3f53c" stroke-width="3" />
                                                 </svg>

                                                 <!-- Labels Overlay -->
                                                 <div class="absolute inset-x-0 bottom-1.5 px-6 flex justify-between text-[9px] font-black text-slate-400 tracking-wider">
                                                     <span v-for="(p, i) in svgPoints" :key="i">{{ p.label }}</span>
                                                 </div>

                                                 <!-- Score tags above points -->
                                                 <div v-for="(p, i) in svgPoints" :key="i"
                                                     class="absolute text-[9px] font-black text-white px-1.5 py-0.5 bg-navy border border-white/10 rounded-md transform -translate-x-1/2 -translate-y-full"
                                                     :style="{ left: `${(p.x / 600) * 100}%`, top: `${(p.y / 150) * 100 - 8}%` }">
                                                     {{ p.score }}
                                                 </div>
                                             </div>
                                         </div>

                                         <!-- Recent Event Showcases -->
                                         <div class="space-y-5 pt-6">
                                             <h3 class="text-xs font-black tracking-[0.2em] text-navy/40 flex items-center gap-4 capitalize">
                                                 {{ t('archers.public.recent_competition') }} <span class="h-px flex-1 bg-gray-100"></span>
                                             </h3>
                                             <div v-if="groupedEventHistory.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                 <div v-for="event in groupedEventHistory.slice(0, 2)" :key="event.id"
                                                     class="bg-white border border-gray-200/60 rounded-3xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                                                     @click="router.push(`/events/${event.slug}`)">
                                                     <div class="flex items-center gap-4 mb-4">
                                                         <div class="w-12 h-12 bg-navy rounded-xl flex flex-col items-center justify-center shrink-0">
                                                             <span class="text-[8px] font-black text-white/50">{{ formatDate(event.date, 'MMM') }}</span>
                                                             <span class="text-base font-black text-white leading-none">{{ formatDate(event.date, 'DD') }}</span>
                                                         </div>
                                                         <div class="min-w-0 flex-1">
                                                             <h4 class="font-black text-navy truncate text-sm capitalize">{{ event.name }}</h4>
                                                             <p class="text-xs text-slate-400 mt-0.5 truncate">{{ event.city }}</p>
                                                         </div>
                                                     </div>
                                                     <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                                                         <div class="flex flex-wrap gap-1">
                                                             <span v-for="cat in event.categories.slice(0, 1)" :key="cat"
                                                                 class="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-black text-slate-500 capitalize tracking-wider">
                                                                 {{ cat }}
                                                             </span>
                                                         </div>
                                                         <div class="text-right">
                                                             <span class="text-[8px] font-black text-slate-300 tracking-wider block capitalize">{{ t('archers.public.table_placement') }}</span>
                                                             <span class="text-lg font-black text-navy">#{{ event.rank || '-' }}</span>
                                                         </div>
                                                     </div>
                                                 </div>
                                             </div>
                                             <div v-else class="border border-dashed border-gray-200 rounded-3xl p-8 text-center bg-gray-50/50">
                                                 <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                                                     <Icon icon="ph:target-bold" class="text-xl" />
                                                 </div>
                                                 <h4 class="font-black text-navy text-sm capitalize">{{ t('archers.public.no_competition_history') }}</h4>
                                                 <p class="mt-1.5 text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                                                     {{ t('archers.public.no_competition_history_desc') }}
                                                 </p>
                                             </div>
                                         </div>
                                    </div>

                                    <!-- Right Column: Sidebar (Highlights, Equipment, Socials) -->
                                    <div class="lg:col-span-4 space-y-8 border-t lg:border-t-0 lg:border-l border-gray-100 pt-8 lg:pt-0 lg:pl-8">
                                         <!-- Trophy Showcase -->
                                         <div class="bg-navy rounded-2xl p-6 text-white relative overflow-hidden shadow-md border border-white/5">
                                             <div class="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
                                                 <Icon icon="ph:trophy-bold" class="text-[14rem]" />
                                             </div>
                                             <h3 class="text-xs font-black tracking-[0.2em] text-slate-400 capitalize mb-6 flex items-center gap-2">
                                                 <Icon icon="ph:crown-bold" class="text-primary text-base" />
                                                 {{ t('archers.public.top_highlights') }}
                                             </h3>
                                             <div v-if="processedAchievements.highlights.length" class="space-y-5">
                                                 <div v-for="(ach, idx) in processedAchievements.highlights" :key="idx"
                                                     class="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                                                     <Icon icon="ph:medal-fill" class="text-primary text-xl shrink-0 mt-0.5" />
                                                     <div class="text-xs font-black leading-relaxed text-slate-200 capitalize tracking-wider">{{ ach }}</div>
                                                 </div>
                                             </div>
                                             <div v-else class="text-center py-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                                                 <Icon icon="ph:shield-warning-bold" class="text-2xl text-white/30 mx-auto mb-2" />
                                                 <div class="text-[10px] font-black text-white/40 tracking-wider capitalize">{{ t('archers.public.no_highlights') }}</div>
                                             </div>
                                         </div>

                                         <!-- Equipment Locker -->
                                         <div class="space-y-4">
                                             <h4 class="text-xs font-black tracking-[0.2em] text-navy/40 capitalize">
                                                 {{ t('archers.public.equipment_locker') }}
                                             </h4>
                                             <div v-if="archer.equipment && archer.equipment.trim()" class="space-y-3">
                                                 <template v-for="(gear, idx) in archer.equipment.split('\n')" :key="idx">
                                                     <div v-if="gear.trim()"
                                                         class="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 flex items-center justify-between">
                                                         <div class="min-w-0 flex-1">
                                                             <div class="text-xs font-black text-navy truncate capitalize">{{ gear.trim() }}</div>
                                                             <span class="text-[8px] text-slate-400 font-bold tracking-widest capitalize">{{ t('archers.public.verified_gear') }}</span>
                                                         </div>
                                                         <Icon icon="ph:shield-check-fill" class="text-primary text-lg" />
                                                     </div>
                                                 </template>
                                             </div>
                                             <div v-else class="p-6 border border-dashed border-gray-200 rounded-2xl text-center bg-gray-50/50">
                                                 <Icon icon="ph:shield-warning-bold" class="text-2xl text-slate-300 mx-auto mb-2" />
                                                 <div class="text-[10px] font-black text-slate-400 tracking-wider capitalize">{{ t('archers.public.no_equipment') }}</div>
                                             </div>
                                         </div>

                                         <!-- Social Channels (neutral gray styling) -->
                                         <div class="space-y-3">
                                             <h4 class="text-xs font-black tracking-[0.2em] text-navy/40 capitalize">
                                                 {{ t('archers.public.social_channels') }}
                                             </h4>
                                             <div class="grid grid-cols-2 gap-3">
                                                 <a v-if="archer.social_instagram"
                                                     :href="`https://instagram.com/${archer.social_instagram.replace('@', '')}`"
                                                     target="_blank"
                                                     class="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 rounded-xl group transition-all text-navy">
                                                     <Icon icon="ph:instagram-logo-bold" class="text-lg text-gray-400 group-hover:text-pink-600 transition-colors" />
                                                     <span class="text-[10px] font-black tracking-wider truncate capitalize">{{ t('archers.public.instagram') }}</span>
                                                 </a>
                                                 <a v-if="archer.social_tiktok"
                                                     :href="`https://tiktok.com/@${archer.social_tiktok.replace('@', '')}`"
                                                     target="_blank"
                                                     class="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 rounded-xl group transition-all text-navy">
                                                     <Icon icon="ph:tiktok-logo-bold" class="text-lg text-gray-400 group-hover:text-slate-800 transition-colors" />
                                                     <span class="text-[10px] font-black tracking-wider truncate capitalize">{{ t('archers.public.tiktok') }}</span>
                                                 </a>
                                                 <a v-if="archer.social_whatsapp"
                                                     :href="`https://wa.me/${archer.social_whatsapp.replace(/[^0-9]/g, '')}`"
                                                     target="_blank"
                                                     class="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 rounded-xl group transition-all col-span-2 text-navy">
                                                     <Icon icon="ph:whatsapp-logo-bold" class="text-lg text-gray-400 group-hover:text-green-600 transition-colors" />
                                                     <span class="text-[10px] font-black tracking-wider capitalize">{{ t('archers.public.contact_athlete') }}</span>
                                                 </a>
                                             </div>
                                         </div>
                                     </div>
                                </div>

                                <div v-else-if="activeTab === 'results'" key="results" class="space-y-6">
                                     <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                                         <div>
                                             <h3 class="text-base font-black text-navy capitalize tracking-widest">{{ t('archers.public.tournament_database') }}</h3>
                                             <div class="text-xs text-slate-400 capitalize">{{ t('archers.public.tournament_database_subtitle') }}</div>
                                         </div>
                                         <!-- Search input -->
                                         <div class="relative w-full sm:w-72 shrink-0">
                                             <span class="absolute inset-y-0 left-3 flex items-center text-slate-400">
                                                 <Icon icon="ph:magnifying-glass-bold" />
                                             </span>
                                             <input type="text" v-model="searchQuery"
                                                 :placeholder="t('archers.public.search_tournament')"
                                                 class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-primary transition-all bg-gray-50/50" />
                                         </div>
                                     </div>

                                     <div class="overflow-x-auto -mx-6 sm:mx-0">
                                         <table class="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
                                             <thead>
                                                 <tr class="bg-gray-50 text-slate-400 border-y border-gray-100">
                                                     <th class="px-6 py-4 text-[10px] font-black tracking-widest capitalize">{{ t('archers.public.table_date') }}</th>
                                                     <th class="px-6 py-4 text-[10px] font-black tracking-widest capitalize">{{ t('archers.public.table_tournament') }}</th>
                                                     <th class="px-6 py-4 text-[10px] font-black tracking-widest capitalize">{{ t('archers.public.table_division') }}</th>
                                                     <th class="px-6 py-4 text-[10px] font-black tracking-widest capitalize text-center">{{ t('archers.public.table_placement') }}</th>
                                                 </tr>
                                             </thead>
                                             <tbody class="divide-y divide-gray-100">
                                                 <tr v-for="event in filteredEventHistory" :key="event.id"
                                                     class="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                                     @click="router.push(`/events/${event.slug}`)">
                                                     <td class="px-6 py-4 font-mono text-xs text-slate-400">{{ formatDate(event.date, 'DD MMM YYYY') }}</td>
                                                     <td class="px-6 py-4">
                                                         <div class="font-black text-navy transition-colors text-sm capitalize">{{ event.name }}</div>
                                                         <div class="text-[10px] text-slate-400 font-bold tracking-wider mt-0.5 capitalize">{{ event.city }}</div>
                                                     </td>
                                                     <td class="px-6 py-4">
                                                         <div class="flex flex-wrap gap-1">
                                                             <span v-for="cat in event.categories" :key="cat"
                                                                 class="px-2 py-0.5 bg-gray-100 rounded-md text-[9px] font-black text-slate-500 capitalize tracking-wider">
                                                                 {{ cat }}
                                                             </span>
                                                         </div>
                                                     </td>
                                                     <td class="px-6 py-4 text-center">
                                                         <span :class="[
                                                             'inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-black shadow-sm italic',
                                                             event.rank === 1 ? 'bg-amber-100 text-amber-800' :
                                                             event.rank === 2 ? 'bg-slate-200 text-slate-800' :
                                                             event.rank === 3 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-slate-600'
                                                         ]">
                                                             #{{ event.rank }}
                                                         </span>
                                                     </td>
                                                 </tr>
                                                 <tr v-if="filteredEventHistory.length === 0">
                                                     <td colspan="4" class="px-6 py-16 text-center text-slate-400">
                                                         <Icon icon="ph:folder-open-bold" class="text-3xl mx-auto mb-2 opacity-50" />
                                                         <p class="text-xs font-black capitalize tracking-widest text-slate-300">{{ t('archers.public.no_matching_tournaments') }}</p>
                                                     </td>
                                                 </tr>
                                             </tbody>
                                         </table>
                                     </div>
                                 </div>

                                 <div v-else-if="activeTab === 'bio'" key="bio" class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                     <!-- Left Column: Full Biography & Details -->
                                     <div class="lg:col-span-8 space-y-8">
                                         <div class="space-y-4">
                                             <div>
                                                 <h3 class="text-base font-black text-navy capitalize tracking-widest">{{ t('archers.public.athlete_specifications') }}</h3>
                                                 <div class="text-xs text-slate-400 capitalize">{{ t('archers.public.athlete_specifications_subtitle') }}</div>
                                             </div>

                                             <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                 <div class="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-start gap-4">
                                                     <div class="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                                         <Icon icon="ph:student-bold" class="text-xl text-navy" />
                                                     </div>
                                                     <div>
                                                         <span class="text-[9px] font-black text-slate-400 tracking-widest capitalize">{{ t('archers.public.education_affiliation') }}</span>
                                                         <h5 class="font-black text-navy mt-1 text-sm capitalize">{{ archer.school || '-' }}</h5>
                                                     </div>
                                                 </div>

                                                 <div class="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-start gap-4">
                                                     <div class="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                                         <Icon icon="ph:gender-intersex-bold" class="text-xl text-navy" />
                                                     </div>
                                                     <div>
                                                         <span class="text-[9px] font-black text-slate-400 tracking-widest capitalize">{{ t('archers.public.gender_profile') }}</span>
                                                         <h5 class="font-black text-navy mt-1 text-sm capitalize">
                                                             {{ archer.gender === 'male' ? t('archers.public.male') : t('archers.public.female') }}
                                                             <span v-if="age" class="text-slate-400 ml-1">({{ age }} {{ t('archers.public.years_old') }})</span>
                                                         </h5>
                                                     </div>
                                                 </div>

                                                 <div class="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-start gap-4">
                                                     <div class="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                                         <Icon icon="ph:fingerprint-bold" class="text-xl text-navy" />
                                                     </div>
                                                     <div>
                                                         <span class="text-[9px] font-black text-slate-400 tracking-widest capitalize">{{ t('archers.public.archer_id_tag') }}</span>
                                                         <h5 class="font-mono text-navy mt-1 text-sm capitalize font-black">{{ archer.id || '-' }}</h5>
                                                     </div>
                                                 </div>

                                                 <div class="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-start gap-4">
                                                     <div class="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                                         <Icon icon="ph:map-pin-bold" class="text-xl text-navy" />
                                                     </div>
                                                     <div>
                                                         <span class="text-[9px] font-black text-slate-400 tracking-widest capitalize">{{ t('archers.public.resident_address') }}</span>
                                                         <h5 class="font-black text-navy mt-1 text-xs capitalize leading-tight">{{ archer.address || '-' }}, {{ archer.city }}</h5>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>

                                         <!-- Achievements list in detail -->
                                         <div v-if="processedAchievements.full.length" class="space-y-4 pt-6 border-t border-gray-100">
                                             <h4 class="text-xs font-black tracking-widest text-slate-400 capitalize">{{ t('archers.public.achievements_log') }}</h4>
                                             <div class="grid grid-cols-1 gap-3">
                                                 <div v-for="(ach, idx) in processedAchievements.full" :key="idx"
                                                     class="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-white hover:border-primary transition-all group">
                                                     <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                                                         <Icon icon="ph:medal-fill" class="text-lg" />
                                                     </div>
                                                     <span class="font-black text-navy text-xs capitalize tracking-wider">{{ ach }}</span>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>

                                     <!-- Right Column: Physical & Stats -->
                                     <div class="lg:col-span-4 bg-navy rounded-2xl p-6 text-white relative overflow-hidden shadow-md border border-white/5 space-y-6">
                                         <div>
                                             <h3 class="text-xs font-black tracking-[0.3em] text-slate-400 capitalize">{{ t('archers.public.performance_summary') }}</h3>
                                             <span class="text-[9px] font-bold text-slate-400 tracking-wider capitalize">{{ t('archers.public.historical_records_breakdown') }}</span>
                                         </div>

                                         <div class="space-y-4">
                                             <div class="flex justify-between items-center py-2 border-b border-white/10">
                                                 <span class="text-xs text-slate-300 font-bold capitalize">{{ t('archers.public.podium_finishes') }}</span>
                                                 <span class="text-sm font-black text-primary italic">{{ statsSummary.podiums }} {{ t('archers.public.times_unit') }}</span>
                                             </div>
                                             <div class="flex justify-between items-center py-2 border-b border-white/10">
                                                 <span class="text-xs text-slate-300 font-bold capitalize">{{ t('archers.public.gold_medals') }}</span>
                                                 <span class="text-sm font-black text-white italic">{{ statsSummary.wins }} {{ t('archers.public.wins_unit') }}</span>
                                             </div>
                                             <div class="flex justify-between items-center py-2 border-b border-white/10">
                                                 <span class="text-xs text-slate-300 font-bold capitalize">{{ t('archers.public.average_score') }}</span>
                                                 <span class="text-sm font-black text-white italic">{{ statsSummary.avgScore }} {{ t('archers.public.pts_unit') }}</span>
                                             </div>
                                             <div class="flex justify-between items-center py-2 border-b border-white/10">
                                                 <span class="text-xs text-slate-300 font-bold capitalize">{{ t('archers.public.personal_best') }}</span>
                                                 <span class="text-sm font-black text-primary italic">{{ statsSummary.maxScore }} {{ t('archers.public.pts_unit') }}</span>
                                             </div>
                                             <div class="flex justify-between items-center py-2">
                                                 <span class="text-xs text-slate-300 font-bold capitalize">{{ t('archers.public.active_class') }}</span>
                                                 <span class="text-sm font-black text-white italic capitalize">{{ bowTypeLabel || '-' }}</span>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             </Transition>
                         </div>
                     </div>
                 </div>

                 <!-- ── Share Dialog ── -->
                 <Transition name="modal">
                     <div v-if="showShareDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                         <div @click="closeShareDialog" class="absolute inset-0 bg-[#0e1e3a]/80 backdrop-blur-sm"></div>
                         <div class="relative w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 z-10">
                             <div class="flex items-center justify-between mb-6">
                                 <h3 class="text-xl font-black text-[#0e1e3a] capitalize">{{ t('archers.public.share_profile') }}</h3>
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
                                     <div class="text-[9px] text-slate-500 font-black tracking-widest capitalize mb-0.5">{{ t('archers.public.verified_athlete') }}</div>
                                     <div class="font-black text-[#0e1e3a] text-base capitalize">{{ archer.full_name }}</div>
                                     <div v-if="shareMetaLine" class="text-xs text-slate-500 font-bold tracking-wider mt-0.5 capitalize">{{ shareMetaLine }}</div>
                                 </div>
                             </div>

                             <div class="grid grid-cols-4 gap-3 mb-6">
                                 <button v-for="plat in platforms" :key="plat.id" @click="shareTo(plat.id)"
                                     class="flex flex-col items-center gap-2 group">
                                     <div :class="`w-12 h-12 rounded-xl ${plat.bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-all`"
                                         v-html="plat.iconHtml"></div>
                                     <span class="text-[9px] font-black text-slate-400 tracking-wider capitalize">{{ plat.name }}</span>
                                 </button>
                             </div>

                             <div class="flex gap-2">
                                 <input type="text" readonly :value="shareUrl"
                                     class="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-slate-500 outline-none" />
                                 <button @click="copyLink"
                                     class="px-4 py-3 bg-[#0e1e3a] text-white rounded-xl text-xs font-black hover:bg-[#1a365d] transition-colors whitespace-nowrap capitalize tracking-widest">
                                     {{ copied ? t('archers.public.copied') : t('archers.public.copy') }}
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

// Active tab ('overview', 'results', 'bio')
const activeTab = ref('overview')
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

const processedAchievements = computed(() => {
    if (!archer.value?.achievements) return { highlights: [], full: [] }
    const lines = archer.value.achievements.split('\n').filter(l => l.trim() !== '')
    const highlights = lines.filter(l => l.startsWith('[H] ')).map(l => l.replace('[H] ', '')).slice(0, 3)
    const full = lines.map(l => l.replace('[H] ', ''))
    return { highlights, full }
})

const shareMetaLine = computed(() =>
    [bowTypeLabel.value, archer.value?.city].filter(Boolean).join(' • '))

const formatDate = (date, format = 'DD MMMM YYYY') => {
    if (!date) return ''
    return useDateFormat(date, format, { locales: 'id-ID' }).value
}

// ── Performance Trend Line Calculations ──
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
    const scores = events.map(e => e.total_score || e.qualification_score).filter(Boolean)
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

/* Custom scrollbar hiding */
.scrollbar-none::-webkit-scrollbar {
    display: none;
}
.scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>

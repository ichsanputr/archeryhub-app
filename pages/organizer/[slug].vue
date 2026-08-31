<template>
    <div class="bg-gray-50 min-h-screen flex flex-col selection:bg-primary selection:text-navy-dark">

        <!-- fixed dot-grid background -->
        <div class="fixed inset-0 -z-10 pointer-events-none opacity-[0.035]"
            style="background-image: radial-gradient(circle, #0f172a 1px, transparent 1px); background-size: 40px 40px;">
        </div>

        <!-- hero section -->
        <section class="relative w-full overflow-hidden bg-gradient-to-br from-[#1a365d] via-[#0f172a] to-[#1e3a8a] pt-24 sm:pt-36 pb-0 flex items-end">
            <!-- backdrop image -->
            <img :src="useImageOrDefault(org.banner_url || org.banner, org.name)"
                class="absolute inset-0 w-full h-full object-cover object-center opacity-20 mix-blend-overlay pointer-events-none scale-105 filter blur-sm"
                :alt="org.name" />
            <!-- motif pattern -->
            <div class="absolute inset-0 pointer-events-none z-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.08);"></div>
            <!-- radial vignette -->
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(30,58,138,0.25),rgba(15,23,42,0.85))]"></div>
            <!-- bottom fade into gray -->
            <div class="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none z-10"></div>

            <div class="relative w-full px-4 sm:px-6 md:px-12 max-w-7xl mx-auto z-10 pb-20 sm:pb-24">
                <div class="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-10">
                    <!-- logo -->
                    <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-4 border-white/10 shadow-2xl overflow-hidden bg-white shrink-0">
                        <img :src="useImageOrDefault(org.avatar_url || org.logo_url, org.name)"
                            class="w-full h-full object-cover" :alt="org.name" />
                    </div>

                    <!-- identity -->
                    <div class="flex-grow min-w-0 space-y-3 text-white">
                        <!-- badges row -->
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="px-3 py-1 bg-primary text-navy-dark text-[9px] font-black rounded-lg capitalize tracking-widest">
                                {{ t('organizer.public.official_profile') }}
                            </span>
                            <div v-if="org.status === 'active'"
                                class="flex items-center gap-1.5 px-3 py-1 bg-white/8 backdrop-blur-sm border border-white/10 rounded-lg">
                                <Icon icon="ph:seal-check-fill" class="text-primary text-xs" />
                                <span class="text-[9px] font-black tracking-widest text-white/85 capitalize">{{ t('organizer.public.verified') }}</span>
                            </div>
                        </div>

                        <!-- name -->
                        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
                            {{ displayName }}
                        </h1>

                        <!-- meta row -->
                        <div class="flex flex-wrap items-center gap-4 text-sm text-white/50 font-bold">
                            <span v-if="org.city" class="flex items-center gap-1.5">
                                <Icon icon="ph:map-pin-bold" class="text-primary text-sm" />
                                {{ org.city }}
                            </span>
                            <span v-if="org.established_date" class="flex items-center gap-1.5">
                                <Icon icon="ph:calendar-blank-bold" class="text-primary text-sm" />
                                {{ t('organizer.public.established') }} {{ new Date(org.established_date).getFullYear() }}
                            </span>
                            <span v-if="org.country" class="flex items-center gap-1.5">
                                <Icon icon="ph:globe-bold" class="text-primary text-sm" />
                                {{ org.country }}
                            </span>
                        </div>
                    </div>

                    <!-- stats pill row -->
                    <div class="flex items-center gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden shrink-0 backdrop-blur-md text-white">
                        <div class="text-center px-6 py-4">
                            <div class="text-[9px] font-black text-white/40 tracking-widest capitalize mb-1">{{ t('organizer.public.events') }}</div>
                            <div class="text-2xl font-black text-white">{{ totalEvents || 0 }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- main content (consolidated inside exactly one card) -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 -mt-12 relative z-20 pb-24 w-full">
            <div class="bg-white rounded-3xl border border-gray-200/60 shadow-md overflow-hidden">
                <!-- inner sub-navigation tab bar -->
                <div class="border-b border-gray-100 bg-gray-50/50 px-6 sm:px-10 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div class="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                            class="py-2.5 font-black text-xs tracking-widest capitalize transition-all duration-300 relative shrink-0 whitespace-nowrap"
                            :class="activeTab === tab.id ? 'text-navy border-b-2 border-primary' : 'text-gray-400 hover:text-navy'">
                            {{ tab.label }}
                        </button>
                    </div>
                    <button @click="isShareOpen = true"
                        class="flex items-center gap-2 py-2 px-4 bg-white border border-gray-200 rounded-xl text-[10px] font-black tracking-widest text-navy hover:bg-gray-50 transition-all capitalize shrink-0">
                        <Icon icon="ph:share-network-bold" class="text-sm text-primary" />
                        <span>{{ t('organizer.public.share') }}</span>
                    </button>
                </div>

                <!-- active tab panels -->
                <div class="p-6 sm:p-10">
                    <Transition name="fade" mode="out-in">
                        <!-- tab 1: overview (tentang, visi & misi, sejarah, faq) -->
                        <div v-if="activeTab === 'overview'" key="overview" class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            <!-- left column: biography, visi & misi, sejarah, faq -->
                            <div class="lg:col-span-8 space-y-10">
                                <!-- biography -->
                                <div v-if="pageSettings.sections.about" class="space-y-4">
                                    <h3 class="text-xs font-black tracking-[0.2em] text-navy/40 flex items-center gap-4 capitalize">
                                        {{ t('organizer.public.org_profile') }} <span class="h-px flex-1 bg-gray-100"></span>
                                    </h3>
                                    <div class="text-sm sm:text-base text-navy/70 leading-relaxed font-light whitespace-pre-line" v-html="org.description || displayDescription">
                                    </div>
                                    <div v-if="org.registration_number"
                                        class="inline-flex items-center gap-3 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl mt-4">
                                        <Icon icon="ph:fingerprint-bold" class="text-navy/30 text-lg shrink-0" />
                                        <div>
                                            <div class="text-[9px] font-black text-navy/40 tracking-widest capitalize">{{ t('organizer.public.official_reg_num') }}</div>
                                            <div class="font-black text-navy text-sm">{{ org.registration_number }}</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- visi & misi -->
                                <div v-if="pageSettings.sections.about && (org.vision || org.mission)" class="space-y-4 pt-6">
                                    <h3 class="text-xs font-black tracking-[0.2em] text-navy/40 flex items-center gap-4 capitalize">
                                        {{ t('organizer.public.vision_mission') }} <span class="h-px flex-1 bg-gray-100"></span>
                                    </h3>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div v-if="org.vision" class="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                                            <div class="flex items-center gap-2">
                                                <div class="size-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Icon icon="ph:eye-fill" class="text-base text-primary" />
                                                </div>
                                                <span class="text-[9px] font-black text-navy/40 tracking-widest capitalize">{{ t('organizer.public.org_vision') }}</span>
                                            </div>
                                            <div class="text-sm font-bold text-navy leading-relaxed italic whitespace-pre-line" v-html="org.vision">
                                            </div>
                                        </div>

                                        <div v-if="org.mission" class="p-6 bg-navy rounded-2xl text-white space-y-3 shadow-md">
                                            <div class="flex items-center gap-2">
                                                <div class="size-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                                    <Icon icon="ph:target-fill" class="text-base text-primary" />
                                                </div>
                                                <span class="text-[9px] font-black text-white/30 tracking-widest capitalize">{{ t('organizer.public.strategic_mission') }}</span>
                                            </div>
                                            <div class="text-xs sm:text-sm text-white/80 leading-relaxed font-medium whitespace-pre-line" v-html="org.mission">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- sejarah singkat -->
                                <div v-if="pageSettings.sections.about && org.history" class="space-y-4 pt-6">
                                    <h3 class="text-xs font-black tracking-[0.2em] text-navy/40 flex items-center gap-4 capitalize">
                                        {{ t('organizer.public.brief_history') }} <span class="h-px flex-1 bg-gray-100"></span>
                                    </h3>
                                    <div class="text-sm sm:text-base text-navy/70 leading-relaxed font-light whitespace-pre-line" v-html="org.history">
                                    </div>
                                </div>

                                <!-- faq -->
                                <div v-if="pageSettings.sections.faq && org.faq?.length > 0" class="space-y-4 pt-6">
                                    <h3 class="text-xs font-black tracking-[0.2em] text-navy/40 flex items-center gap-4 capitalize">
                                        {{ t('organizer.public.faq') }} <span class="h-px flex-1 bg-gray-100"></span>
                                    </h3>
                                    <div class="grid grid-cols-1 gap-4">
                                        <div v-for="(item, idx) in org.faq" :key="idx"
                                            class="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-start gap-4">
                                            <div class="size-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <Icon icon="ph:question-bold" class="text-sm text-primary" />
                                            </div>
                                            <div class="space-y-2 flex-1 min-w-0">
                                                <h4 class="font-black text-navy text-sm leading-tight tracking-tight">
                                                    {{ item.question }}
                                                </h4>
                                                <div class="h-px bg-gray-100"></div>
                                                <div class="text-xs sm:text-sm text-navy/60 leading-relaxed whitespace-pre-line" v-html="item.answer">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- right column: sidebar metadata & map & socials -->
                            <div class="lg:col-span-4 space-y-8 border-t lg:border-t-0 lg:border-l border-gray-100 pt-8 lg:pt-0 lg:pl-8">
                                <!-- info box -->
                                <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
                                    <h4 class="text-xs font-black text-navy/40 tracking-widest capitalize flex items-center gap-2">
                                        <Icon icon="ph:info-bold" class="text-primary text-base" />
                                        {{ t('organizer.public.org_info') }}
                                    </h4>
                                    <div class="space-y-3 text-xs">
                                        <div class="flex justify-between items-center py-2 border-b border-gray-200/50">
                                            <span class="text-slate-400 font-bold">{{ t('organizer.public.region') }}</span>
                                            <span class="font-black text-navy">{{ org.city || '-' }}</span>
                                        </div>
                                        <div class="flex justify-between items-center py-2 border-b border-gray-200/50">
                                            <span class="text-slate-400 font-bold">{{ t('organizer.public.established') }}</span>
                                            <span class="font-black text-navy">{{ org.established_date ? new Date(org.established_date).getFullYear() : '-' }}</span>
                                        </div>
                                        <div class="flex justify-between items-center py-2">
                                            <span class="text-slate-400 font-bold">{{ t('organizer.public.country') }}</span>
                                            <span class="font-black text-navy">{{ org.country || 'indonesia' }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- maps embed -->
                                <div v-if="org.address || org.gmaps_link" class="space-y-3">
                                    <h4 class="text-xs font-black text-navy/40 tracking-widest capitalize flex items-center gap-2">
                                        <Icon icon="ph:map-trifold-bold" class="text-primary text-base" />
                                        {{ t('organizer.public.office_location') }}
                                    </h4>
                                    <div class="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                        <div class="h-44 w-full bg-gray-50">
                                            <iframe v-if="gmapsEmbedUrl" :src="gmapsEmbedUrl" width="100%" height="100%"
                                                style="border:0;" allowfullscreen="" loading="lazy"
                                                referrerpolicy="no-referrer-when-downgrade">
                                            </iframe>
                                            <div v-else class="w-full h-full flex items-center justify-center bg-gray-50">
                                                <div class="text-center p-4">
                                                    <Icon icon="ph:map-pin-light" class="text-3xl text-gray-300 mb-1 mx-auto" />
                                                    <div class="text-[9px] font-black text-navy/20 tracking-wider">{{ t('organizer.public.map_unavailable') }}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="p-4">
                                            <div class="text-xs font-black text-navy leading-tight line-clamp-2 mb-2">{{ org.address || 'sekretariat utama' }}</div>
                                            <a v-if="org.gmaps_link" :href="org.gmaps_link" target="_blank"
                                                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-navy rounded-xl text-[10px] font-black tracking-widest border border-gray-100 hover:bg-gray-100 transition-colors w-full justify-center">
                                                {{ t('organizer.public.open_in_gmaps') }}
                                                <Icon icon="ph:arrow-square-out-bold" class="text-xs" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <!-- contact channels -->
                                <div class="space-y-3">
                                    <h4 class="text-xs font-black text-navy/40 tracking-widest capitalize flex items-center gap-2">
                                        <Icon icon="ph:phone-bold" class="text-primary text-base" />
                                        {{ t('organizer.public.official_contacts') }}
                                    </h4>
                                    <div class="grid grid-cols-1 gap-2">
                                        <a v-if="org.whatsapp_no" :href="`https://wa.me/${org.whatsapp_no.replace(/\D/g, '')}`"
                                            target="_blank" class="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 rounded-xl group transition-all">
                                            <Icon icon="ph:whatsapp-logo-fill" class="text-lg text-gray-400 group-hover:text-green-600 transition-colors" />
                                            <span class="text-[10px] font-black text-navy tracking-wider truncate">{{ org.whatsapp_no }}</span>
                                        </a>
                                        <a v-if="org.email" :href="`mailto:${org.email}`"
                                            class="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 rounded-xl group transition-all">
                                            <Icon icon="ph:envelope-fill" class="text-lg text-gray-400 group-hover:text-blue-600 transition-colors" />
                                            <span class="text-[10px] font-black text-navy tracking-wider truncate">{{ org.email }}</span>
                                        </a>
                                    </div>
                                </div>

                                <!-- social channels -->
                                <div v-if="hasSocialMedia" class="space-y-3">
                                    <h4 class="text-xs font-black text-navy/40 tracking-widest capitalize flex items-center gap-2">
                                        <Icon icon="ph:share-network-bold" class="text-primary text-base" />
                                        {{ t('organizer.public.social_media') }}
                                    </h4>
                                    <div class="flex flex-wrap gap-2">
                                        <a v-if="org.social_instagram"
                                            :href="`https://instagram.com/${org.social_instagram.replace('@', '')}`"
                                            target="_blank"
                                            class="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 rounded-xl group transition-all text-[10px] font-black text-navy">
                                            <Icon icon="ph:instagram-logo-bold" class="text-sm text-gray-400 group-hover:text-pink-600 transition-colors" />
                                            <span>instagram</span>
                                        </a>
                                        <a v-if="org.social_facebook" :href="org.social_facebook" target="_blank"
                                            class="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 rounded-xl group transition-all text-[10px] font-black text-blue-700">
                                            <Icon icon="ph:facebook-logo-bold" class="text-sm text-gray-400 group-hover:text-blue-600 transition-colors" />
                                            <span>facebook</span>
                                        </a>
                                        <a v-if="org.social_twitter" :href="`https://twitter.com/${org.social_twitter}`"
                                            target="_blank"
                                            class="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 rounded-xl group transition-all text-[10px] font-black text-navy">
                                            <Icon icon="ph:x-logo-bold" class="text-sm text-gray-400 group-hover:text-slate-800 transition-colors" />
                                            <span>twitter / X</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- tab 2: events (event diselenggarakan) -->
                        <div v-else-if="activeTab === 'events'" key="events" class="space-y-6">
                            <div class="flex items-center justify-between pb-4 border-b border-gray-100">
                                <div>
                                    <h3 class="text-base font-black text-navy capitalize tracking-widest">{{ t('organizer.public.event_list') }}</h3>
                                    <div class="text-xs text-slate-400">{{ t('organizer.public.events_subtitle') }}</div>
                                </div>
                            </div>

                            <div v-if="events.length === 0"
                                class="py-16 text-center border border-dashed border-gray-200 rounded-3xl">
                                <Icon icon="ph:calendar-blank-light" class="text-5xl text-gray-200 mx-auto mb-3" />
                                <div class="text-xs font-black text-navy/30 tracking-widest capitalize">{{ t('organizer.public.no_events') }}</div>
                            </div>

                            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <NuxtLink v-for="event in events" :key="event.id" :to="`/events/${event.slug || event.id}`"
                                    class="bg-white p-5 rounded-2xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all group flex gap-5">
                                    <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                                        <img :src="useImageOrDefault(event.logo_url, event.name)" :alt="event.name"
                                            class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                                        <div class="space-y-2">
                                            <span :class="statusClass(event)"
                                                class="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black capitalize tracking-wider">
                                                {{ statusLabel(event) }}
                                            </span>
                                            <h4 class="font-black text-navy text-sm leading-tight truncate group-hover:text-primary transition-colors">
                                                {{ event.name }}
                                            </h4>
                                        </div>
                                        <div class="flex flex-wrap gap-3 pt-2 border-t border-gray-50 text-[10px] text-navy/40 font-black">
                                            <div class="flex items-center gap-1">
                                                <Icon icon="ph:calendar-blank-fill" class="text-xs text-primary" />
                                                {{ formatDate(event.start_date) }}
                                            </div>
                                            <div v-if="event.venue" class="flex items-center gap-1 min-w-0">
                                                <Icon icon="ph:map-pin-fill" class="text-xs text-primary" />
                                                <span class="truncate">{{ event.venue }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </NuxtLink>
                            </div>
                        </div>

                        <!-- tab 3: news & achievements (berita & prestasi) -->
                        <div v-else-if="activeTab === 'news'" key="news" class="space-y-10">
                            <!-- prestasi section -->
                            <div v-if="achievements.length > 0" class="space-y-4">
                                <h3 class="text-xs font-black tracking-[0.2em] text-navy/40 flex items-center gap-4 capitalize">
                                    {{ t('organizer.public.org_achievements') }} <span class="h-px flex-1 bg-gray-100"></span>
                                </h3>
                                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    <div v-for="item in achievements" :key="item.id"
                                        class="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col gap-3">
                                        <div class="flex items-center justify-between">
                                            <span class="text-[9px] font-black tracking-widest text-navy/20">{{ formatDate(item.published_at) }}</span>
                                            <div class="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <Icon icon="ph:trophy-fill" class="text-primary text-base" />
                                            </div>
                                        </div>
                                        <h4 class="text-sm font-black text-navy leading-tight">{{ item.title }}</h4>
                                        <div class="text-xs text-navy/60 line-clamp-2 leading-relaxed" v-html="item.excerpt"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- berita section -->
                            <div v-if="news.length > 0" class="space-y-4 pt-4">
                                <h3 class="text-xs font-black tracking-[0.2em] text-navy/40 flex items-center gap-4 capitalize">
                                    {{ t('organizer.public.news_articles') }} <span class="h-px flex-1 bg-gray-100"></span>
                                </h3>
                                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    <div v-for="item in news" :key="item.id"
                                        class="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                        <div class="w-full aspect-video bg-gray-100 overflow-hidden">
                                            <img :src="item.image_url" class="w-full h-full object-cover" />
                                        </div>
                                        <div class="p-5 flex flex-col gap-2 flex-1">
                                            <span class="text-[9px] font-black tracking-widest text-navy/20">{{ formatDate(item.published_at) }}</span>
                                            <h4 class="text-sm font-black text-navy leading-tight">{{ item.title }}</h4>
                                            <div class="text-xs text-navy/60 line-clamp-2 leading-relaxed" v-html="item.excerpt"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- empty state if both empty -->
                            <div v-if="achievements.length === 0 && news.length === 0"
                                class="py-16 text-center border border-dashed border-gray-200 rounded-3xl">
                                <Icon icon="ph:newspaper-clipping-light" class="text-5xl text-gray-200 mx-auto mb-3" />
                                <div class="text-xs font-black text-navy/30 tracking-widest capitalize">{{ t('organizer.public.no_news_achievements') }}</div>
                            </div>
                        </div>

                        <!-- tab 4: contact & details (hubungi kami) -->
                        <div v-else-if="activeTab === 'contact'" key="contact" class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            <!-- left column: details & secretary info -->
                            <div class="lg:col-span-8 space-y-8">
                                <div class="space-y-4">
                                    <h3 class="text-xs font-black tracking-[0.2em] text-navy/40 flex items-center gap-4 capitalize">
                                        {{ t('organizer.public.main_secretariat') }} <span class="h-px flex-1 bg-gray-100"></span>
                                    </h3>
                                    <div class="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
                                        <div class="p-3 bg-white rounded-xl shadow-sm border border-gray-100 shrink-0">
                                            <Icon icon="ph:map-pin-bold" class="text-xl text-navy" />
                                        </div>
                                        <div>
                                            <div class="text-[9px] font-black text-slate-400 tracking-widest capitalize">{{ t('organizer.public.office_address') }}</div>
                                            <h5 class="font-black text-navy mt-1 text-sm leading-relaxed">{{ org.address || '-' }}</h5>
                                            <div class="text-xs text-slate-500 font-bold mt-1">{{ org.city }}, {{ org.province }}, {{ org.country }}</div>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div class="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
                                            <div class="p-3 bg-white rounded-xl shadow-sm border border-gray-100 shrink-0">
                                                <Icon icon="ph:fingerprint-bold" class="text-xl text-navy" />
                                            </div>
                                            <div>
                                                <div class="text-[9px] font-black text-slate-400 tracking-widest capitalize">{{ t('organizer.public.reg_id') }}</div>
                                                <h5 class="font-mono text-navy mt-1 text-sm font-black">{{ org.id || org.uuid || '-' }}</h5>
                                            </div>
                                        </div>

                                        <div class="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
                                            <div class="p-3 bg-white rounded-xl shadow-sm border border-gray-100 shrink-0">
                                                <Icon icon="ph:calendar-blank-bold" class="text-xl text-navy" />
                                            </div>
                                            <div>
                                                <div class="text-[9px] font-black text-slate-400 tracking-widest capitalize">{{ t('organizer.public.established_year') }}</div>
                                                <h5 class="font-black text-navy mt-1 text-sm">{{ org.established_date ? new Date(org.established_date).getFullYear() : '-' }}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- maps embed large -->
                                <div v-if="org.address || org.gmaps_link" class="space-y-4 pt-4">
                                    <h3 class="text-xs font-black tracking-[0.2em] text-navy/40 flex items-center gap-4 capitalize">
                                        {{ t('organizer.public.location_map') }} <span class="h-px flex-1 bg-gray-100"></span>
                                    </h3>
                                    <div class="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm h-72">
                                        <iframe v-if="gmapsEmbedUrl" :src="gmapsEmbedUrl" width="100%" height="100%"
                                            style="border:0;" allowfullscreen="" loading="lazy"
                                            referrerpolicy="no-referrer-when-downgrade">
                                        </iframe>
                                        <div v-else class="w-full h-full flex items-center justify-center bg-gray-50">
                                            <div class="text-center">
                                                <Icon icon="ph:map-pin-light" class="text-4xl text-gray-200 mb-2 mx-auto" />
                                                <div class="text-[10px] font-black text-navy/20 tracking-widest capitalize">{{ t('organizer.public.map_unavailable') }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- right column: quick contacts -->
                            <div class="lg:col-span-4 space-y-8">
                                <div class="bg-navy p-6 sm:p-8 rounded-[2rem] text-white shadow-sm relative overflow-hidden space-y-6">
                                    <div>
                                        <h4 class="text-xs font-black tracking-[0.2em] text-primary capitalize">{{ t('organizer.public.contact_tab') }}</h4>
                                        <div class="text-[10px] text-white/50 font-bold mt-1">{{ t('organizer.public.contact_desc') }}</div>
                                    </div>
                                    <div class="space-y-4">
                                        <a v-if="org.whatsapp_no" :href="`https://wa.me/${org.whatsapp_no.replace(/\D/g, '')}`"
                                            target="_blank" class="flex items-center gap-3 text-white hover:text-primary transition-colors">
                                            <div class="size-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                                                <Icon icon="ph:whatsapp-logo-fill" class="text-base" />
                                            </div>
                                            <span class="font-bold text-xs sm:text-sm truncate">{{ org.whatsapp_no }}</span>
                                        </a>
                                        <a v-if="org.email" :href="`mailto:${org.email}`" class="flex items-center gap-3 text-white hover:text-primary transition-colors">
                                            <div class="size-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                                                <Icon icon="ph:envelope-bold" class="text-base" />
                                            </div>
                                            <span class="font-bold text-xs sm:text-sm truncate">{{ org.email }}</span>
                                        </a>
                                        <div v-if="!org.whatsapp_no && !org.email"
                                            class="text-white/30 text-xs font-black tracking-widest capitalize">{{ t('organizer.public.not_available') }}</div>
                                    </div>
                                </div>

                                <div v-if="hasSocialMedia" class="bg-gray-50 p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                                    <h4 class="text-xs font-black tracking-[0.2em] text-navy/30 capitalize">{{ t('organizer.public.social_network') }}</h4>
                                    <div class="grid grid-cols-1 gap-2">
                                        <a v-if="org.social_instagram"
                                            :href="`https://instagram.com/${org.social_instagram.replace('@', '')}`"
                                            target="_blank"
                                            class="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 rounded-xl group transition-all text-[10px] font-black text-navy">
                                            <Icon icon="ph:instagram-logo-bold" class="text-base shrink-0 text-gray-400 group-hover:text-pink-600 transition-colors" />
                                            <span class="truncate">instagram</span>
                                        </a>
                                        <a v-if="org.social_facebook" :href="org.social_facebook" target="_blank"
                                            class="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 rounded-xl group transition-all text-[10px] font-black text-blue-700">
                                            <Icon icon="ph:facebook-logo-bold" class="text-base shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                            <span class="truncate">facebook</span>
                                        </a>
                                        <a v-if="org.social_twitter" :href="`https://twitter.com/${org.social_twitter}`"
                                            target="_blank"
                                            class="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 rounded-xl group transition-all text-[10px] font-black text-navy">
                                            <Icon icon="ph:x-logo-bold" class="text-base shrink-0 text-gray-400 group-hover:text-slate-800 transition-colors" />
                                            <span class="truncate">twitter / X</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>

        <!-- share dialog -->
        <Transition name="modal">
            <div v-if="isShareOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div @click="isShareOpen = false" class="absolute inset-0 bg-navy/80 backdrop-blur-sm"></div>
                <div class="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 z-10">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-base font-black text-navy tracking-tighter capitalize">{{ t('organizer.public.share_profile') }}</h3>
                        <button @click="isShareOpen = false"
                            class="size-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <Icon icon="ph:x-bold" class="text-sm" />
                        </button>
                    </div>

                    <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6">
                        <div
                            class="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary flex-shrink-0 bg-white">
                            <img :src="useImageOrDefault(org.avatar_url || org.logo_url, org.name)"
                                class="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div class="text-[9px] font-black text-navy/40 tracking-widest capitalize mb-0.5">{{ t('organizer.public.official_profile') }}</div>
                            <div class="font-black text-navy text-sm leading-none">{{ org.name }}</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-4 gap-3 mb-6">
                        <button v-for="plat in platforms" :key="plat.id" @click="shareTo(plat.id)"
                            class="flex flex-col items-center gap-2 group">
                            <div :class="`size-12 rounded-2xl ${plat.bg} flex items-center justify-center group-hover:scale-110 transition-all`"
                                v-html="plat.iconHtml"></div>
                            <span class="text-[10px] font-black text-navy/40 tracking-wider capitalize">{{ plat.name }}</span>
                        </button>
                    </div>

                    <div class="flex gap-2">
                        <input type="text" readonly :value="shareUrl"
                            class="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-navy/40 outline-none" />
                        <button @click="copyLink"
                            class="px-5 py-3 bg-navy text-white rounded-xl text-xs font-black tracking-widest hover:bg-navy-dark transition-all">
                            {{ copied ? t('organizer.public.copied') : t('organizer.public.copy') }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

/* snappy fade transition */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease-out;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

definePageMeta({ layout: 'landing' })

const route = useRoute()
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const page = ref(1)
const isShareOpen = ref(false)
const copied = ref(false)
const shareUrl = computed(() => typeof window !== 'undefined' ? window.location.href : '')

// active tab ('overview', 'events', 'news', 'contact')
const activeTab = ref('overview')

const tabs = computed(() => [
    { id: 'overview', label: t('organizer.public.profile_tab') },
    { id: 'events', label: `${t('organizer.public.events')} (${totalEvents.value || 0})` },
    { id: 'news', label: t('organizer.public.news_achievements_tab') },
    { id: 'contact', label: t('organizer.public.contact_tab') }
])

const { data: orgResponse } = await useAsyncData(
    `org-${route.params.slug}`,
    () => $fetch(`${apiBaseUrl}/organizers/${route.params.slug}`, {
        params: { page: page.value, limit: 12 }
    }),
    { watch: [page], server: true }
)

const org = computed(() => {
    const data = orgResponse.value?.data || orgResponse.value || {}
    return data.organizer || data || {}
})
const events = computed(() => orgResponse.value?.events || orgResponse.value?.data?.events || [])
const clubs = computed(() => orgResponse.value?.clubs || orgResponse.value?.data?.clubs || [])
const achievements = computed(() => orgResponse.value?.achievements || orgResponse.value?.data?.achievements || [])
const news = computed(() => orgResponse.value?.news || orgResponse.value?.data?.news || [])
const totalEvents = computed(() => orgResponse.value?.total_events || orgResponse.value?.data?.total_events || 0)
const totalPages = computed(() => Math.ceil(totalEvents.value / 12))

const gmapsEmbedUrl = computed(() => {
    const link = org.value?.gmaps_link || org.value?.google_maps_link
    if (!link && !org.value?.address) return null

    try {
        if (link && link.includes('google.com/maps/embed')) return link
        const searchQuery = org.value.address || `${org.value.name} ${org.value.city}`
        return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
    } catch (e) {
        return null
    }
})

const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

const displayName = computed(() => org.value.name || 'penyelenggara panahan')
const displayDescription = computed(() => org.value.description || 'penyelenggara resmi panahan indonesia yang berdedikasi membina ekosistem olahraga.')

const pageSettings = computed(() => {
    const rawSettings = org.value?.page_settings
    if (!rawSettings) return { sections: { identity: true, contact: true, about: true, faq: true } }
    try {
        const parsed = typeof rawSettings === 'string' ? JSON.parse(rawSettings) : rawSettings
        return {
            sections: {
                identity: true,
                contact: true,
                about: true,
                faq: true,
                ...(parsed.sections || {})
            }
        }
    } catch (e) {
        return { sections: { identity: true, contact: true, about: true, faq: true } }
    }
})

const copyLink = () => {
    navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
}

const platforms = [
    { id: 'whatsapp', name: 'WhatsApp', bg: 'bg-green-50 text-green-600', iconHtml: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.038 3.069l-.669 2.445 2.511-.659c.722.451 1.591.696 2.891.696 3.128 0 5.768-2.586 5.768-5.766 0-3.18-2.585-5.766-5.762-5.766zm3.369 8.303c-.144.405-.842.755-1.168.807-.326.052-.728.093-2.185-.484-1.85-.733-3.038-2.613-3.13-2.733-.093-.12-.76-.997-.76-1.996 0-1 .475-1.5.692-1.742.176-.192.42-.312.693-.312s.273.012.396.024c.123 0 .285-.048.438.312.153.36.525 1.261.57 1.356.045.093.076.204.015.324-.312.612-.342.66-.45.804-.108.144-.225.216-.108.408.117.192.52.852 1.118 1.38.77.684 1.411.897 1.613.997.202.102.321.084.441-.054.12-.138.514-.594.651-.798.136-.204.272-.171.459-.102.187.069 1.187.561 1.391.663z"/></svg>' },
    { id: 'facebook', name: 'Facebook', bg: 'bg-blue-50 text-blue-600', iconHtml: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>' },
    { id: 'twitter', name: 'X', bg: 'bg-slate-50 text-slate-800', iconHtml: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' },
    { id: 'copy', name: 'Salin', bg: 'bg-gray-100 text-slate-600', iconHtml: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10"/></svg>' }
]

const shareTo = (platform) => {
    if (platform === 'copy') return copyLink()
    const text = encodeURIComponent(`Cek profil ${org.value.name} di Archeryhub!`)
    const url = encodeURIComponent(shareUrl.value)
    let link = ''
    switch (platform) {
        case 'whatsapp': link = `https://wa.me/?text=${text}%20${url}`; break;
        case 'facebook': link = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
        case 'twitter': link = `https://twitter.com/intent/tweet?text=${text}&url=${url}`; break;
    }
    if (link) window.open(link, '_blank')
}

const hasSocialMedia = computed(() => !!(org.value.social_instagram || org.value.social_facebook || org.value.social_twitter))

const getEventPublicStatus = (event) => {
    const now = new Date()
    const startDate = event.start_date ? new Date(event.start_date) : null
    const endDate = event.end_date ? new Date(event.end_date) : null
    const regEnd = event.registration_end_date ? new Date(event.registration_end_date) : null

    if (now < startDate && regEnd && now <= regEnd) return 'Pendaftaran Dibuka'
    if (now < startDate) return 'Mendatang'
    if (endDate && now > endDate) return 'Selesai'
    if (startDate && now >= startDate) return 'Sedang Berlangsung'
    return 'Mendatang'
}

const statusLabel = (event) => getEventPublicStatus(event)

const statusClass = (event) => {
    const status = getEventPublicStatus(event)
    const classes = {
        'Pendaftaran Dibuka': 'bg-green-50 text-green-600 border border-green-100',
        'Mendatang': 'bg-blue-50 text-blue-600 border border-blue-100',
        'Sedang Berlangsung': 'bg-primary text-navy-dark',
        'Selesai': 'bg-gray-100 text-gray-400'
    }
    return classes[status] || 'bg-gray-50 text-gray-600'
}

useHead({
    title: computed(() => `${displayName.value} - Archeryhub.id`),
})

useSeoMeta({
    title: () => `${displayName.value} - Archeryhub.id`,
    description: () => displayDescription.value,
    ogTitle: () => displayName.value,
    ogDescription: () => displayDescription.value,
    ogImage: () => org.value.avatar_url || org.value.banner_url
})
</script>

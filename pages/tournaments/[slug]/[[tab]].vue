<template>
    <div v-if="eventData?.isExternal">
        <TournamentExternalDetailView :tournament="eventData.externalTournament" :tournament-data="eventData.externalData" />
    </div>
    <div v-else class="min-h-screen bg-background-light font-body text-navy overflow-x-hidden">
        <TournamentPageSkeleton v-if="isPageLoading || !eventData" />
        <template v-else>

            <!-- Hero Header -->
            <div class="bg-navy relative overflow-hidden min-h-[420px] pt-24 sm:pt-32 pb-12 flex items-center">
                <div class="absolute inset-0 z-0">
                    <img :alt="tournament.name" class="w-full h-full object-cover object-center"
                        :src="tournament.image" />
                    <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                    </div>
                </div>
                <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <!-- Breadcrumb -->
                    <div class="mb-8">
                        <Breadcrumbs :items="[{ label: 'Event', path: '/tournaments' }]"
                            :current="tournament.name || 'Event'" class="!text-gray-300" />
                    </div>

                    <div class="flex flex-col lg:flex-row items-end justify-between gap-8 mb-12">
                        <div class="">
                            <h1
                                class="text-2xl sm:text-3xl md:text-5xl font-black leading-tight tracking-tight mb-6 font-display text-white">
                                {{ tournament.name }}
                            </h1>
                            <div
                                class="flex flex-wrap items-center text-sm sm:text-base gap-4 text-white/80 text-base md:text-lg">
                                <div class="flex items-center gap-2">
                                    <Icon icon="ph:calendar-blank" class="text-primary" />
                                    <span>{{ displayValue(tournament.date) }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Icon icon="ph:map-pin" class="text-primary" />
                                    <span>{{ displayValue(tournament.location) }}</span>
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
                        <NuxtLink v-for="tab in tabs" :key="tab" :to="getTabLink(tab)" replace
                            class="px-4 md:px-6 py-3 md:py-4 font-semibold text-sm md:text-base transition-colors whitespace-nowrap border-b-2"
                            :class="activeTab === tab ? 'text-navy border-primary bg-primary/5' : 'text-gray-500 border-transparent hover:text-navy hover:bg-gray-50'">
                            {{ t('event_detail.tabs.' + tab, tab) }}
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <main class="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                <div
                    :class="activeTab === 'Hasil' ? 'grid grid-cols-1' : 'grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12'">
                    <!-- Left Column -->
                    <div :class="activeTab === 'Hasil' ? 'space-y-10' : 'lg:col-span-2 space-y-10'" :key="activeTab">
                        <TournamentTabsSkeleton v-if="isTabLoading" :tab="activeTab" />
                        <div v-else-if="activeTab === 'Ringkasan'"
                            class="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-gray-100 space-y-10 md:space-y-12">
                            <!-- About Section -->
                            <section>
                                <h2
                                    class="font-black text-navy text-lg sm:text-2xl mb-6 flex items-center gap-2 md:gap-3">
                                    <div
                                        class="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-navy/5 flex items-center justify-center shrink-0">
                                        <Icon icon="ph:info-bold" class="text-base md:text-xl text-navy" />
                                    </div>
                                    {{ t('event_detail.about_event') }}
                                </h2>
                                <div class="tentang-event prose max-w-none text-gray-600 leading-relaxed space-y-4">
                                    <div v-if="tournament.description" v-html="tournament.description"
                                        class="event-description text-sm sm:text-base leading-relaxed">
                                    </div>
                                    <div v-else class="italic text-gray-400">
                                        {{ t('event_detail.no_description') }}
                                    </div>

                                    <div v-if="tournament.technical_guidebook_url"
                                        class="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
                                        <h4 class="font-bold text-navy !mt-0 mb-2">{{ t('event_detail.technical_handbook') }}</h4>
                                        <div class="text-sm text-gray-600 mb-3">Unduh buku panduan teknis lengkap yang
                                            berisi
                                            peraturan, regulasi, dan jadwal detail.</div>
                                        <a :href="tournament.technical_guidebook_url" target="_blank"
                                            class="text-navy font-bold text-sm hover:underline inline-flex items-center gap-1">
                                            {{ t('event_detail.download_pdf') }}
                                            <Icon icon="ph:download-simple" class="text-lg" />
                                        </a>
                                    </div>
                                </div>
                            </section>

                            <!-- Divider -->
                            <div v-if="divisionsData.length > 0" class="h-px bg-gray-100"></div>

                            <!-- Divisions Section -->
                            <section v-if="divisionsData.length > 0" class="relative overflow-hidden">
                                <div class="flex items-center justify-between mb-8 relative z-10">
                                    <div>
                                        <h2
                                            class="font-black text-navy text-lg md:text-2xl mb-2 flex items-center gap-2 md:gap-3">
                                            <div
                                                class="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-navy/5 flex items-center justify-center shrink-0">
                                                <Icon icon="ph:squares-four-bold"
                                                    class="text-base md:text-xl text-navy" />
                                            </div>
                                            {{ $t('event_detail.competition_categories') }}
                                        </h2>
                                        <div class="text-sm text-gray-400 font-medium">{{ $t('event_detail.competition_categories_desc') }}</div>
                                    </div>
                                    <div v-if="divisionsData.length > 2" class="hidden md:flex gap-2">
                                        <button @click="scroll('left')"
                                            class="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-navy hover:border-navy hover:bg-navy hover:text-white transition-all shadow-sm">
                                            <Icon icon="ph:caret-left-bold" />
                                        </button>
                                        <button @click="scroll('right')"
                                            class="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-navy hover:border-navy hover:bg-navy hover:text-white transition-all shadow-sm">
                                            <Icon icon="ph:caret-right-bold" />
                                        </button>
                                    </div>
                                </div>

                                <div class="relative z-10">
                                    <!-- Mobile Arrows: only when more than two cards -->
                                    <div v-if="divisionsData.length > 2"
                                        class="flex md:hidden absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between pointer-events-none z-20 px-2">
                                        <button @click="scroll('left')"
                                            class="w-10 h-10 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-navy shadow-lg pointer-events-auto">
                                            <Icon icon="ph:caret-left-bold" />
                                        </button>
                                        <button @click="scroll('right')"
                                            class="w-10 h-10 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-navy shadow-lg pointer-events-auto">
                                            <Icon icon="ph:caret-right-bold" />
                                        </button>
                                    </div>
                                    <div ref="scrollContainer"
                                        class="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 -mx-1 px-1">
                                        <div v-for="division in divisionsData" :key="division.name"
                                            class="min-w-[300px] md:min-w-[340px] group relative bg-gray-50 border border-gray-100 rounded-[2rem] p-7">
                                            <!-- Card Header -->
                                            <div class="flex items-center gap-4 mb-6">
                                                <div
                                                    class="w-10 h-10 md:w-12 md:h-12 bg-navy rounded-2xl flex items-center justify-center p-1.5 shadow-sm shadow-navy/20 overflow-hidden shrink-0">
                                                    <img :src="'/' + division.icon" :alt="division.name"
                                                        class="w-full h-full object-contain invert" />
                                                </div>
                                                <div>
                                                    <h3 class="font-black text-navy text-lg md:text-xl">{{ division.name
                                                        }}
                                                    </h3>
                                                    <span class="text-[10px] font-black tracking-[0.2em] ">Tournament
                                                        Division</span>
                                                </div>
                                            </div>

                                            <!-- Categories List -->
                                            <div class="space-y-3 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
                                                <div v-for="cat in division.categories" :key="cat"
                                                    class="flex items-start gap-3 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300">
                                                    <Icon icon="ph:check-circle-fill"
                                                        class="text-primary mt-0.5 shrink-0" />
                                                    <span class="text-[13px] font-bold text-navy leading-tight">
                                                        {{ cat }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- Divider -->
                            <div class="h-px bg-gray-100"></div>

                            <!-- Registration Fees Section -->
                            <section>
                                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
                                    <div>
                                        <h2 class="font-black text-navy text-lg md:text-2xl mb-2 flex items-center gap-2 md:gap-3">
                                            <div class="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-navy/5 flex items-center justify-center shrink-0">
                                                <Icon icon="ph:wallet-bold" class="text-base md:text-xl text-navy" />
                                            </div>
                                            {{ t('event_detail.registration_fee') }}
                                        </h2>
                                        <div class="text-sm text-gray-400 font-medium">
                                            <template v-if="tournament.fee_mode === 'per_category'">{{ t('event_detail.fee_per_category') }}</template>
                                            <template v-else-if="tournament.fee_mode === 'per_type'">{{ t('event_detail.fee_per_type') }}</template>
                                            <template v-else>{{ t('event_detail.fee_general_desc') }}</template>
                                        </div>
                                    </div>
                                </div>

                                <!-- Per Type: show 3 cards (individual / team / mixed) -->
                                <div v-if="tournament.fee_mode === 'per_type' && formattedFees.length > 0"
                                    class="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                    <div v-for="fee in formattedFees" :key="fee.name"
                                        class="bg-gray-50/70 border border-gray-100 p-6 rounded-[2rem] hover:border-primary hover:shadow-md transition-all relative">
                                        <div class="flex items-center gap-3 mb-4">
                                            <div class="size-10 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
                                                <Icon :icon="fee.iconName || 'ph:user-bold'" class="text-navy text-xl" />
                                            </div>
                                            <div>
                                                <div class="text-[10px] font-black tracking-widest text-gray-400">{{ fee.typeLabel }}</div>
                                                <h3 class="text-base font-black text-navy leading-tight">{{ fee.name }}</h3>
                                            </div>
                                        </div>
                                        <div class="text-2xl sm:text-3xl font-black text-navy mb-2 tracking-tight">
                                            Rp {{ (fee.amount || 0).toLocaleString('id-ID') }}
                                            <span class="text-sm text-gray-400 font-semibold">{{ t('event_detail.per_category') }}</span>
                                        </div>
                                        <div class="text-xs text-gray-500">{{ fee.description }}</div>
                                    </div>
                                </div>

                                <!-- Per Category: table-style list -->
                                <div v-else-if="tournament.fee_mode === 'per_category' && formattedFees.length > 0"
                                    class="space-y-2">
                                    <div v-for="fee in formattedFees" :key="fee.name"
                                        class="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-primary/30 transition-all">
                                        <!-- Category icon -->
                                        <div class="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-1.5 shadow-sm">
                                            <img v-if="fee.icon" :src="'/' + fee.icon" :alt="fee.typeLabel" class="w-full h-full object-contain" />
                                            <Icon v-else icon="ph:target-bold" class="text-navy text-lg" />
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="text-sm font-black text-navy truncate">{{ fee.name }}</div>
                                            <div class="text-[10px] text-gray-400">{{ fee.typeLabel }}</div>
                                        </div>
                                        <div class="text-right shrink-0">
                                            <div class="text-base font-black text-navy tabular-nums">Rp {{ (fee.amount || 0).toLocaleString('id-ID') }}</div>
                                            <div class="text-[10px] text-gray-400">{{ t('event_detail.per_participant') }}</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Fallback: informational fees list (old format) or single flat fee -->
                                <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                    <template v-if="formattedFees.length > 0">
                                        <div v-for="(fee, idx) in formattedFees" :key="idx"
                                            class="bg-gray-50/70 border border-gray-100 p-6 rounded-2xl hover:border-primary hover:shadow-md transition-all">
                                            <div class="text-[10px] font-black tracking-widest text-gray-400 mb-2">{{ fee.typeLabel }}</div>
                                            <h3 class="text-lg font-black text-navy mb-4">{{ fee.name }}</h3>
                                            <div class="text-2xl sm:text-3xl font-black text-navy mb-4 tracking-tight">
                                                Rp {{ (fee.amount || 0).toLocaleString('id-ID') }}
                                                <span class="text-sm text-gray-400 font-semibold">{{ t('event_detail.per_participant') }}</span>
                                            </div>
                                            <div v-if="fee.description" class="text-sm text-gray-500">{{ fee.description }}</div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="bg-gray-50/70 border border-gray-100 p-6 rounded-2xl">
                                            <div class="text-[10px] font-black tracking-widest text-gray-400 mb-2">{{ t('event_detail.flat_fee') }}</div>
                                            <h3 class="text-lg font-black text-navy mb-4">{{ t('event_detail.all_categories') }}</h3>
                                            <div class="text-2xl sm:text-3xl font-black text-navy mb-4 tracking-tight">
                                                Rp {{ (tournament.entry_fee || 0).toLocaleString('id-ID') }}
                                                <span class="text-sm text-gray-400 font-semibold">{{ t('event_detail.per_participant') }}</span>
                                            </div>
                                            <ul class="space-y-2 text-sm text-gray-600">
                                                <li class="flex items-start gap-2">
                                                    <Icon icon="ph:check-circle-fill" class="text-primary mt-0.5" />
                                                    <span>{{ t('event_detail.applies_to_all_categories') }}</span>
                                                </li>
                                                <li class="flex items-start gap-2">
                                                    <Icon icon="ph:check-circle-fill" class="text-primary mt-0.5" />
                                                    <span>{{ t('event_detail.payment_per_participant') }}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </template>
                                </div>

                                <!-- Integrated Payment Methods inside Fee Section -->
                                <div v-if="tournament.payment_methods && tournament.payment_methods.length > 0"
                                    class="pt-8 mt-8 border-t border-gray-100">
                                    <h3 class="text-xs font-black text-gray-400 tracking-[0.2em] mb-5">{{ t('event_detail.payment_methods') }}</h3>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div v-for="(method, idx) in tournament.payment_methods" :key="idx"
                                            class="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-center gap-4">
                                            <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden p-1.5">
                                                <img v-if="getPaymentMethodImage(method.bank_name)"
                                                    :src="getPaymentMethodImage(method.bank_name)"
                                                    class="w-full h-full object-contain" :alt="method.bank_name" />
                                                <Icon v-else :icon="getPaymentIcon(method)" class="text-xl md:text-2xl text-navy" />
                                            </div>
                                            <div class="min-w-0">
                                                <div class="text-[10px] font-black text-gray-400 tracking-wider mb-0.5">{{ method.bank_name }}</div>
                                                <div class="text-sm font-black text-navy truncate">{{ method.account_number }}</div>
                                                <div class="text-[10px] font-bold text-gray-500 truncate mt-0.5 italic">a.n {{ method.account_name }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- Divider -->
                            <div v-if="tournament.total_prize > 0 || tournament.prizes?.first" class="h-px bg-gray-100"></div>

                            <!-- Prize Pool Section -->
                            <section v-if="tournament.total_prize > 0 || tournament.prizes?.first"
                                class="flex flex-col lg:flex-row overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
                                <div
                                    class="lg:w-1/2 bg-primary relative flex flex-col justify-center items-center px-8 md:px-12 py-16 target-texture">
                                    <div class="relative z-10 text-center">
                                        <span class="text-navy/40 font-black tracking-[0.3em] text-xs mb-4 block">{{ t('event_detail.total_prize') }}</span>
                                        <h2 class="text-navy text-4xl md:text-5xl font-black leading-none mb-4">Rp {{
                                            (tournament.total_prize || 0).toLocaleString('id-ID') }}</h2>
                                        <div class="h-2 w-40 bg-navy mx-auto mb-6"></div>
                                        <div class="text-navy font-bold text-base tracking-widest">{{ t('event_detail.fight_for_best_podium') }}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="lg:w-1/2 bg-navy relative flex flex-col justify-center px-8 md:px-12 py-16 overflow-hidden">
                                    <div class="absolute inset-0 opacity-20 pointer-events-none"
                                        style="background-image: radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px); background-size: 30px 30px;">
                                    </div>
                                    <div class="relative z-10 w-full">
                                        <h3 class="text-white text-lg sm:text-2xl mb-10 flex items-center gap-3">
                                            <Icon icon="ph:trophy-bold" class="text-primary text-2xl md:text-3xl" />
                                            {{ t('event_detail.prize_details') }}
                                        </h3>
                                        <div class="space-y-10">
                                            <div>
                                                <div class="flex justify-between items-end mb-3">
                                                    <div>
                                                        <span
                                                            class="text-primary font-black text-xs tracking-widest ">{{ t('event_detail.main_champion') }}</span>
                                                        <h4 class="text-white text-lg sm:text-xl font-black">{{ t('event_detail.champion_1') }}
                                                        </h4>
                                                    </div>
                                                    <div class="text-white text-lg sm:text-xl font-black">{{
                                                        displayValue(tournament.prizes?.first) }}
                                                    </div>
                                                </div>
                                                <div class="w-full h-2 bg-white/10 overflow-hidden">
                                                    <div class="h-full bg-primary w-full"></div>
                                                </div>
                                                <div v-if="tournament.prizes?.first_caption"
                                                    class="text-white/60 text-xs mt-2">{{
                                                        tournament.prizes.first_caption }}</div>
                                            </div>
                                            <div>
                                                <div class="flex justify-between items-end mb-3">
                                                    <div>
                                                        <span
                                                            class="text-white/40 font-black text-xs tracking-widest ">{{ t('event_detail.second_place') }}</span>
                                                        <h4 class="text-white text-lg sm:text-xl font-black">{{ t('event_detail.champion_2') }}
                                                        </h4>
                                                    </div>
                                                    <div class="text-white text-lg sm:text-xl font-black">{{
                                                        displayValue(tournament.prizes?.second)
                                                        }}</div>
                                                </div>
                                                <div class="w-full h-2 bg-white/10 overflow-hidden">
                                                    <div class="h-full bg-white/60 w-1/2"></div>
                                                </div>
                                                <div v-if="tournament.prizes?.second_caption"
                                                    class="text-white/60 text-xs mt-2">{{
                                                        tournament.prizes.second_caption }}</div>
                                            </div>
                                            <div>
                                                <div class="flex justify-between items-end mb-3">
                                                    <div>
                                                        <span
                                                            class="text-white/40 font-black text-xs tracking-widest ">{{ t('event_detail.third_place') }}</span>
                                                        <h4 class="text-white text-lg sm:text-xl font-black">{{ t('event_detail.champion_3') }}
                                                        </h4>
                                                    </div>
                                                    <div class="text-white text-lg sm:text-xl font-black">{{
                                                        displayValue(tournament.prizes?.third) }}
                                                    </div>
                                                </div>
                                                <div class="w-full h-2 bg-white/10 overflow-hidden">
                                                    <div class="h-full bg-white/30 w-1/4"></div>
                                                </div>
                                                <div v-if="tournament.prizes?.third_caption"
                                                    class="text-white/60 text-xs mt-2">{{
                                                        tournament.prizes.third_caption }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- Divider -->
                            <div v-if="tournament.faq && tournament.faq.length > 0" class="h-px bg-gray-100"></div>

                            <!-- FAQ Section -->
                            <section v-if="tournament.faq && tournament.faq.length > 0"
                                class="overflow-hidden relative">
                                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
                                    <div>
                                        <h2 class="font-black text-navy text-lg md:text-2xl mb-2 flex items-center gap-2 md:gap-3">
                                            <div class="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-navy/5 flex items-center justify-center shrink-0">
                                                <Icon icon="ph:question-bold" class="text-base md:text-xl text-navy" />
                                            </div>
                                            {{ t('event_detail.faq') }}
                                        </h2>
                                        <div class="text-sm text-gray-400 font-medium">Informasi penting seputar event ini</div>
                                    </div>
                                </div>

                                <div class="space-y-4 relative z-10">
                                    <details v-for="(faq, fIdx) in tournament.faq" :key="fIdx"
                                        class="group border border-gray-100 rounded-3xl transition-all duration-300 open:bg-gray-50/50 open:border-primary/20 open:shadow-lg open:shadow-primary/5">
                                        <summary
                                            class="list-none p-6 font-black text-navy cursor-pointer flex items-center justify-between group-hover:bg-gray-50 group-open:bg-transparent rounded-3xl transition-all duration-300">
                                            <div class="flex items-center gap-4">
                                                <span
                                                    class="flex-shrink-0 w-8 h-8 rounded-xl bg-gray-100 group-open:bg-navy group-open:text-white flex items-center justify-center text-xs font-black transition-colors">
                                                    {{ fIdx + 1 }}
                                                </span>
                                                <span class="text-lg leading-tight">{{ faq.question }}</span>
                                            </div>
                                            <div
                                                class="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-open:rotate-180 group-open:bg-navy group-open:border-navy transition-all duration-500">
                                                <Icon icon="ph:caret-down-bold"
                                                    class="text-gray-400 group-open:text-white transition-colors" />
                                            </div>
                                        </summary>
                                        <div class="px-6 pb-8 pt-0 ml-12">
                                            <div
                                                class="h-px w-full bg-gradient-to-r from-primary/20 to-transparent mb-6">
                                            </div>
                                            <div class="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                                                {{ faq.answer }}
                                            </div>
                                        </div>
                                    </details>
                                </div>
                            </section>
                        </div>

                        <TournamentScheduleTab v-else-if="activeTab === 'Jadwal Lomba'" :event-id="slug"
                            :schedules="schedulesData" />
                        <TournamentAthletesTab v-else-if="activeTab === 'Peserta'" :participants="participantsData" />
                        <TournamentResultsTab v-else-if="activeTab === 'Hasil'" :event-id="slug"
                            :results-type="tournament.page_settings?.results_type" :results="tournament.results || []"
                            :categories="categoriesList" :participants="participantsData" />
                        <TournamentVenueTab v-else-if="activeTab === 'Lokasi'" :venue="tournament.venue"
                            :address="tournament.address" :gmaps-link="tournament.gmaps_link"
                            :accessibility="tournament.location_accessibility" />

                        <!-- Galeri Tab -->
                        <div v-else-if="activeTab === 'Galeri'" class="space-y-8">
                            <section
                                class="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 overflow-hidden relative">
                                <div class="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl">
                                </div>
                                <div class="flex items-center gap-3 mb-8 relative z-10">
                                    <div
                                        class="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-navy/5 flex items-center justify-center shrink-0">
                                        <Icon icon="ph:images-bold" class="text-base md:text-xl text-navy" />
                                    </div>
                                    <div>
                                        <h2 class="font-black text-navy text-lg md:text-2xl">{{ t('event_detail.event_gallery') }}</h2>
                                        <div class="text-sm text-gray-400 font-medium">{{ t('event_detail.event_gallery_desc') }}</div>
                                    </div>
                                </div>

                                <!-- Poster & Banner -->
                                <div v-if="tournament.thumbnail || tournament.image"
                                    class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10">
                                    <div v-if="tournament.image && tournament.image !== '/hero-event-detail.jpeg'"
                                        class="group relative rounded-2xl overflow-hidden aspect-video cursor-pointer shadow-sm border border-gray-100 hover:shadow-md transition-all"
                                        @click="openLightbox(tournament.image)">
                                        <img :src="tournament.image" :alt="tournament.name + ' - Banner'"
                                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div
                                            class="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                            <span class="text-white text-xs font-black tracking-wider ">{{ t('event_detail.event_banner') }}</span>
                                        </div>
                                    </div>
                                    <div v-if="tournament.thumbnail"
                                        class="group relative rounded-2xl overflow-hidden aspect-video cursor-pointer shadow-sm border border-gray-100 hover:shadow-md transition-all"
                                        @click="openLightbox(tournament.thumbnail)">
                                        <img :src="tournament.thumbnail" :alt="tournament.name + ' - Poster'"
                                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div
                                            class="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                            <span class="text-white text-xs font-black tracking-wider ">{{ t('event_detail.event_poster') }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Gallery Grid -->
                                <div v-if="galleryImages.length > 0" class="relative z-10">
                                    <h3 v-if="tournament.thumbnail || (tournament.image && tournament.image !== '/hero-event-detail.jpeg')"
                                        class="text-sm font-black text-gray-400 tracking-widest mb-4 pt-6 border-t border-gray-100">
                                        Dokumentasi</h3>
                                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                                        <div v-for="(img, idx) in galleryImages" :key="idx"
                                            class="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-gray-100 hover:shadow-md transition-all"
                                            @click="openLightbox(img.url)">
                                            <img :src="img.url" :alt="img.caption || 'Foto event'"
                                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div
                                                class="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div
                                                    class="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                                                    <Icon icon="ph:magnifying-glass-plus-bold"
                                                        class="text-navy text-lg" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Empty State -->
                                <div v-if="galleryImages.length === 0 && !tournament.thumbnail && (tournament.image === '/hero-event-detail.jpeg' || !tournament.image)"
                                    class="text-center py-16 relative z-10">
                                    <div
                                        class="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                                        <Icon icon="ph:camera-slash" class="text-4xl text-gray-200" />
                                    </div>
                                    <div class="text-gray-400 font-bold">{{ t('event_detail.no_photos') }}</div>
                                </div>
                            </section>
                        </div>
                    </div>

                    <!-- Right Sidebar - Hidden on Hasil tab -->
                    <aside v-if="activeTab !== 'Hasil'" class="space-y-8">
                        <!-- Registration Card -->
                        <div class="bg-white rounded-2xl p-6 shadow-sm border-t-4 border-primary relative">
                            <h3 class="text-lg font-bold text-navy mb-4">
                                <template v-if="countdown.isNotStarted">{{ t('event_detail.registration_starts_in') }}</template>
                                <template v-else-if="countdown.isClosed">{{ t('event_detail.registration_closed_past') }}</template>
                                <template v-else>{{ t('event_detail.registration_closes_in') }}</template>
                            </h3>
                            <div class="flex gap-3 mb-6">
                                <div class="flex-1 bg-gray-50 rounded-lg p-3 text-center"
                                    :class="{ 'opacity-50': countdown.isClosed }">
                                    <span class="block text-xl sm:text-2xl font-bold text-navy">{{
                                        String(countdown.days).padStart(2,
                                            '0') }}</span>
                                    <span class="text-xs text-gray-500 ">{{ t('common.days') }}</span>
                                </div>
                                <div class="flex-1 bg-gray-50 rounded-lg p-3 text-center"
                                    :class="{ 'opacity-50': countdown.isClosed }">
                                    <span class="block text-xl sm:text-2xl font-bold text-navy">{{
                                        String(countdown.hours).padStart(2,
                                            '0') }}</span>
                                    <span class="text-xs text-gray-500 ">{{ t('common.hours') }}</span>
                                </div>
                                <div class="flex-1 bg-gray-50 rounded-lg p-3 text-center"
                                    :class="{ 'opacity-50': countdown.isClosed }">
                                    <span class="block text-xl sm:text-2xl font-bold text-navy">{{
                                        String(countdown.minutes).padStart(2, '0') }}</span>
                                    <span class="text-xs text-gray-500 ">{{ t('common.minutes') }}</span>
                                </div>
                            </div>
                            <!-- New Per-Category Quota Section -->
                            <!-- New Per-Category Quota Section (Always Scrollable) -->
                            <div class="mb-6">
                                <div class="flex items-center justify-between mb-3 px-1">
                                    <span class="text-[10px] font-black tracking-widest text-gray-400">{{ t('event_detail.slot_availability') }}</span>
                                    <span class="text-xs font-bold text-navy bg-gray-100 px-2.5 py-0.5 rounded-full">
                                        {{ tournament.participant_count || 0 }} {{ t('event_detail.registered') }}</span>
                                </div>

                                <div v-if="categoriesList && categoriesList.length > 0"
                                    class="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar border border-gray-50 rounded-xl p-3 bg-gray-50/30">
                                    <div v-for="cat in categoriesList" :key="cat.id"
                                        class="space-y-1.5 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                        <div class="flex justify-between items-start gap-4">
                                            <span
                                                class="text-[10px] font-black text-navy leading-tight line-clamp-2  tracking-tight">
                                                {{ formatCategoryLabel(cat) }}
                                            </span>
                                            <div class="text-right shrink-0">
                                                <div class="text-[10px] font-black text-navy">
                                                    {{ cat.participant_count }} / {{ cat.max_participants > 0 ?
                                                        cat.max_participants : t('common.unlimited') }}
                                                </div>
                                                <div class="text-[9px] text-gray-400 font-bold  tracking-tighter">
                                                    Peserta</div>
                                            </div>
                                        </div>

                                        <div v-if="cat.max_participants > 0"
                                            class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div class="bg-primary h-full transition-all duration-1000"
                                                :style="{ width: `${Math.min(100, (cat.participant_count / cat.max_participants) * 100)}%` }">
                                            </div>
                                        </div>
                                        <div v-else class="w-full bg-gray-100 rounded-full h-1.5 bg-primary/10">
                                            <div class="bg-primary/30 h-full w-full rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else
                                    class="text-xs text-gray-400 italic text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    {{ t('event_detail.quota_info_unavailable') }}
                                </div>
                            </div>
                            <!-- Auth-aware registration CTA: Only show for non-logged-in or logged-in archers -->
                            <template v-if="(!isLoggedIn || isArcher)">
                                <template v-if="registrationStatus.status === 'not_started'">
                                    <div
                                        class="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-xl text-center cursor-not-allowed border border-gray-200">
                                        {{ t('event_detail.registration_not_started') }}
                                    </div>
                                    <div class="text-[10px] text-center text-gray-400 font-bold mt-2">
                                        Dibuka pada {{ useDateFormat(registrationStatus.startTime, 'DD MMM YYYY, HH:mm', { locales: 'id-ID' }).value }}
                                    </div>
                                </template>
                                <template v-else-if="registrationStatus.status === 'closed'">
                                    <div
                                        class="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-xl text-center cursor-not-allowed">
                                        {{ t('event_detail.registration_closed') }}
                                    </div>
                                </template>
                                <template v-else-if="!isLoggedIn">
                                    <NuxtLink :to="registerUrl"
                                        class="w-full block py-4 bg-primary hover:bg-primary-hover text-navy font-bold rounded-xl transition-colors shadow-md text-center">
                                        {{ t('event_detail.register_now') }}
                                    </NuxtLink>
                                </template>
                                <template v-else>
                                    <div v-if="isAlreadyRegistered"
                                        class="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-xl text-center cursor-not-allowed border border-gray-200">
                                        {{ $t('event_detail.already_registered') }}
                                    </div>
                                    <NuxtLink v-else :to="registerUrl"
                                        class="w-full block py-4 bg-primary hover:bg-primary-hover text-navy font-bold rounded-xl transition-colors shadow-md text-center">
                                        {{ $t('event_detail.register_now') }}
                                    </NuxtLink>
                                </template>
                            </template>
                        </div>

                        <!-- Organizer Card -->
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 class="text-lg font-bold text-navy mb-4">{{ t('event_detail.organizer') }}</h3>
                            <div class="flex items-center gap-4 mb-4">
                                <div class="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                    <img alt="Logo Penyelenggara" class="w-full h-full object-cover"
                                        :src="tournament.organizer_logo || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLm2bt_rocjJTBJyLy5egiG9qWTRu9j6JZGiQJiPm8b1G-HSoEuiHPFCrCPBc7qb81krUTSO68P9GueohN-_0IAPQUYSb-Jmd32xXgCNveXoWn0ACR6lV3AFfehy0pYgrdNBVXEyn4uZBaLcOM53xvrj6Nj8lqZdHdDm_sqOirc-36E7u9Qk0pblOTfHJH69INJpXI6D78iO58yfy0HygaJfL6aQRUXwsA6QzEsyDTsfEt6-q4b8f5rl3D59A-pT-X4fXlv7Fm3ng'" />
                                </div>
                                <div>
                                    <NuxtLink v-if="tournament.organizer_slug"
                                        :to="`/organizer/${tournament.organizer_slug}`"
                                        class="font-bold text-navy text-sm hover:text-primary transition-colors">
                                        {{ tournament.organizer }}
                                    </NuxtLink>
                                    <h4 v-else class="font-bold text-navy text-sm">{{ tournament.organizer }}</h4>
                                    <div class="text-xs text-gray-500">Penyelenggara Terverifikasi <Icon
                                            icon="ph:seal-check-fill" class="text-[14px] inline align-middle text-blue-500" />
                                    </div>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <a v-if="tournament.whatsapp_number"
                                    :href="`https://wa.me/${tournament.whatsapp_number}`" target="_blank"
                                    class="flex-1 py-2.5 bg-green-500 hover:bg-green-600 border border-green-500 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-sm shadow-green-200">
                                    <Icon icon="ph:whatsapp-logo-bold" class="text-lg" />
                                    WhatsApp
                                </a>
                                <button v-else
                                    class="flex-1 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-400 cursor-not-allowed flex items-center justify-center gap-2">
                                    <Icon icon="ph:whatsapp-logo" class="text-lg" />
                                    WhatsApp
                                </button>

                                <NuxtLink v-if="tournament.organizer_slug"
                                    :to="`/organizer/${tournament.organizer_slug}`"
                                    class="flex-1 py-2.5 bg-navy hover:bg-navy-light border border-navy rounded-xl text-xs font-bold text-white transition-all text-center flex items-center justify-center">
                                    Lihat Profil
                                </NuxtLink>
                            </div>
                        </div>

                        <!-- Map Card -->
                        <div v-if="tournament.gmaps_link || tournament.address"
                            class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <div class="h-48 w-full bg-gray-100 relative group">
                                <iframe v-if="gmapsEmbedUrl" :src="gmapsEmbedUrl" width="100%" height="100%"
                                    style="border:0;" allowfullscreen="" loading="lazy"
                                    referrerpolicy="no-referrer-when-downgrade">
                                </iframe>
                                <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
                                    <Icon icon="ph:map-pin" class="text-3xl text-gray-300" />
                                </div>
                            </div>
                            <div class="p-4">
                                <h3 class="font-bold text-navy text-sm leading-snug line-clamp-2 mb-1">{{ displayValue(tournament.venue) }}</h3>
                                <div class="text-xs text-gray-500 line-clamp-2 leading-relaxed">{{ displayValue(tournament.address) }}</div>
                            </div>
                        </div>

                        <!-- Share Section -->
                        <div
                            class="flex flex-col items-center gap-3 justify-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <span class="text-xs font-black text-gray-400 tracking-[0.2em] capitalize">Bagikan Event Ini</span>
                            <div class="grid grid-cols-4 gap-2 w-full">
                                <button @click="shareTo('whatsapp')"
                                    class="w-full h-10 rounded-xl bg-green-50/50 border border-green-100/50 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-300 shadow-2xs active:scale-95"
                                    title="WhatsApp">
                                    <Icon icon="ph:whatsapp-logo-fill" class="text-lg" />
                                </button>
                                <button @click="shareTo('facebook')"
                                    class="w-full h-10 rounded-xl bg-blue-50/50 border border-blue-100/50 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-300 shadow-2xs active:scale-95"
                                    title="Facebook">
                                    <Icon icon="ph:facebook-logo-fill" class="text-lg" />
                                </button>
                                <button @click="shareTo('twitter')"
                                    class="w-full h-10 rounded-xl bg-gray-50/50 border border-gray-100 flex items-center justify-center text-navy hover:bg-navy hover:text-white hover:border-navy transition-all duration-300 shadow-2xs active:scale-95"
                                    title="X / Twitter">
                                    <Icon icon="ph:twitter-logo-fill" class="text-lg" />
                                </button>
                                <button @click="copyPublicUrl"
                                    class="w-full h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-navy hover:bg-primary transition-all duration-300 shadow-2xs active:scale-95"
                                    title="Salin Link">
                                    <Icon icon="ph:link-bold" class="text-lg" />
                                </button>
                            </div>
                            <div v-if="copySuccess" class="text-[10px] font-bold text-green-600 transition-all animate-fade-in">
                                Link berhasil disalin!
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <!-- Lightbox Modal -->
            <ClientOnly>
                <Teleport to="body">
                    <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0"
                        enter-to-class="opacity-100" leave-active-class="transition duration-150"
                        leave-from-class="opacity-100" leave-to-class="opacity-0">
                        <div v-if="lightboxUrl"
                            class="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                            @click.self="lightboxUrl = null">
                            <button @click="lightboxUrl = null"
                                class="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-50">
                                <Icon icon="ph:x-bold" class="text-2xl" />
                            </button>
                            <img :src="lightboxUrl"
                                class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
                        </div>
                    </Transition>
                </Teleport>
            </ClientOnly>
        </template>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'landing',
    headerTransparent: true,
    headerSticky: true,
})

import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onUnmounted, watch, nextTick, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useSeoMeta, useHead, useRequestURL, createError, useRuntimeConfig, useAsyncData, navigateTo } from '#imports'
import { useDateFormat } from '@vueuse/core'
import { getCategoryIcon } from '~/utils/logoArcheryCategory'
import { useI18n } from 'vue-i18n'
import TournamentExternalDetailView from '~/components/tournament/TournamentExternalDetailView.vue'


const { t } = useI18n()
const route = useRoute()
const slug = route.params.slug
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()

// Auth state
const { user, isLoggedIn } = useAuth()

const scrollContainer = ref(null)
const scroll = (direction) => {
    if (!scrollContainer.value) return
    const scrollAmount = 400
    scrollContainer.value.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
    })
}
const isArcher = computed(() => user.value?.type === 'archer' || user.value?.role === 'archer')

// Generate login URL with redirect
const loginUrl = computed(() => `/auth/login?redirect=${encodeURIComponent(`/tournaments/${slug}`)}`)
const registerUrl = computed(() => `/tournaments/${slug}/register`)

// Initial local state
const isLoading = ref(false)

// Fallback data
const fallbackTournament = {
    name: '',
    organizer: 'Perpani DKI Jakarta',
    image: '/hero-event-detail.jpeg',
    page_settings: {
        sections: {
            about: true,
            divisions: true,
            fees: true,
            payment_methods: true,
            prizes: true,
            schedule: true,
            location: true
        }
    }
}

const tabs = computed(() => {
    if (!tournament.value || !tournament.value.page_settings) return ['Ringkasan']
    return ['Ringkasan', 'Jadwal Lomba', 'Peserta', 'Hasil', 'Lokasi', 'Galeri']
})
const activeTab = computed(() => {
    const q = route.query.tab || ''
    return slugToTab[q] || 'Ringkasan'
})
const isTabLoading = ref(false)

const getTabLink = (tabName) => {
    const slug_tab = tabToSlug[tabName]
    if (!slug_tab) return `/tournaments/${slug}`
    return `/tournaments/${slug}?tab=${slug_tab}`
}

const tabToSlug = {
    'Ringkasan': '',
    'Jadwal Lomba': 'jadwal-lomba',
    'Peserta': 'peserta',
    'Hasil': 'hasil',
    'Lokasi': 'lokasi',
    'Galeri': 'galeri'
}

const slugToTab = {
    '': 'Ringkasan',
    'jadwal-lomba': 'Jadwal Lomba',
    'peserta': 'Peserta',
    'hasil': 'Hasil',
    'lokasi': 'Lokasi',
    'galeri': 'Galeri',
    'faq': 'Ringkasan'
}

// Keeping this for compatibility or if we need a fast way to switch without full reload (though NuxtLink handles it)
const setTabWithLoader = async (newTab) => {
    const targetSlug = tabToSlug[newTab]
    navigateTo(getTabLink(newTab))
}

// Helper function to decode tab name from URL
const decodeTabName = (tab) => {
    if (!tab) return null
    return decodeURIComponent(String(tab).replace(/\+/g, ' '))
}

const transformEventData = (data, paymentMethodsData = null) => {
    if (!data) return fallbackTournament

    let pg = {}
    try {
        if (typeof data.page_settings === 'string') {
            pg = JSON.parse(data.page_settings)
        } else if (data.page_settings && typeof data.page_settings === 'object') {
            pg = data.page_settings
        }
    } catch (e) {
        console.warn('Failed to parse page_settings', e)
    }

    const sections = pg.sections || {
        about: true,
        divisions: true,
        fees: true,
        prizes: true,
        schedule: true,
        location: true,
        faq: true,
        payment_methods: true
    }

    let paymentMethodsList = []
    if (paymentMethodsData) {
        paymentMethodsList = (Array.isArray(paymentMethodsData) ? paymentMethodsData : paymentMethodsData?.data || []).map(m => ({
            bank_name: m.payment_method || m.bank_name || '',
            account_number: m.account_number,
            account_name: m.account_name,
            instructions: m.instructions
        }))
    } else if (pg.payment_methods) {
        paymentMethodsList = pg.payment_methods
    }

    return {
        name: data.name || data.title || '',
        date: (() => {
            if (!data.start_date) return data.date || '-'
            const start = useDateFormat(data.start_date, 'DD MMM YYYY', { locales: 'id-ID' }).value
            const end = data.end_date ? useDateFormat(data.end_date, 'DD MMM YYYY', { locales: 'id-ID' }).value : null
            if (!end || start === end) return start
            return `${start} - ${end}`
        })(),
        location: data.venue || data.location || '',
        venue: data.venue || data.location || '',
        gmaps_link: data.gmaps_link || '',
        address: data.address || '',
        status: data.status || 'upcoming',
        category: data.category || '',
        organizer: data.organizer_name || data.organizer || 'Penyelenggara',
        organizer_slug: data.organizer_username || data.organizer_slug || null,
        organizer_logo: data.organizer_avatar_url || data.organizer_logo || null,
        whatsapp_number: (() => {
            const num = data.whatsapp_number || data.organizer_phone || data.phone || null
            if (!num) return null
            // Basic formatting for wa.me: remove non-digits, handle leading 0
            let cleaned = String(num).replace(/\D/g, '')
            if (cleaned.startsWith('0')) cleaned = '62' + cleaned.substring(1)
            return cleaned
        })(),
        image: data.banner_url || data.image || '/hero-event-detail.jpeg',
        thumbnail: data.logo_url || data.thumbnail || null,
        description: data.description || '',
        total_prize: data.total_prize || 0,
        technical_guidebook_url: data.technical_guidebook_url || null,
        max_participants: data.max_participants ?? null,
        registration_deadline: data.registration_deadline || null,
        participant_count: data.participant_count || 0,
        page_settings: { ...pg, sections },
        faq: data.faq ? (typeof data.faq === 'string' ? JSON.parse(data.faq) : data.faq) : [],
        prizes: pg.prizes || { first: '-', second: '-', third: '-' },
        fees: pg.fees || [],
        results: pg.results || [],
        payment_methods: paymentMethodsList,
        location_accessibility: pg.location_accessibility || [],
        entry_fee: data.entry_fee || 0,
        fee_mode: pg.fee_mode || 'per_type',
        fee_per_type: pg.fee_per_type || { individual: data.entry_fee || 0, team: 0, mixed_team: 0 },
        fee_per_category: pg.fee_per_category || {}
    }
}

const formatCategoryLabel = (e) => {
    return [e.category_name, e.event_type_name, e.gender_division_name]
        .filter(Boolean)
        .join(' ')
}

const processDivisions = (events) => {
    const grouped = {}
    events.forEach(e => {
        if (!grouped[e.division_name]) {
            grouped[e.division_name] = {
                name: e.division_name,
                categories: new Set(),
                rawCategories: []
            }
        }
        const label = formatCategoryLabel(e)
        if (label) grouped[e.division_name].categories.add(label)
        grouped[e.division_name].rawCategories.push(e)
    })

    return Object.values(grouped).map(d => ({
        name: d.name,
        categories: Array.from(d.categories),
        rawCategories: d.rawCategories,
        icon: getCategoryIcon(d.name)
    }))
}

// Computed values for gmaps and logic
const gmapsEmbedUrl = computed(() => {
    if (!tournament.value || !tournament.value.gmaps_link) return null

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

        const searchQuery = tournament.value.venue || tournament.value.location || link
        return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
    } catch (e) {
        const searchQuery = tournament.value.venue || tournament.value.location || tournament.value.gmaps_link
        return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
    }
})

const displayValue = (value) => {
    if (value === null || value === undefined || value === '') return '-'
    return value
}

const indonesianPaymentMethods = [
    { title: 'BCA (Bank Central Asia)', value: 'BCA', image: '/payment-method/bca.png', type: 'bank' },
    { title: 'Mandiri', value: 'Mandiri', image: '/payment-method/mandiri.png', type: 'bank' },
    { title: 'BNI (Bank Negara Indonesia)', value: 'BNI', image: '/payment-method/bni.png', type: 'bank' },
    { title: 'BRI (Bank Rakyat Indonesia)', value: 'BRI', image: '/payment-method/bri.png', type: 'bank' },
    { title: 'BSI (Bank Syariah Indonesia)', value: 'BSI', image: '/payment-method/bsi.png', type: 'bank' },
    { title: 'Bank Danamon', value: 'Danamon', image: '/payment-method/danamon.png', type: 'bank' },
    { title: 'GoPay', value: 'GoPay', image: '/payment-method/gopay.png', type: 'ewallet' },
    { title: 'OVO', value: 'OVO', image: '/payment-method/ovo.png', type: 'ewallet' },
    { title: 'DANA', value: 'DANA', image: '/payment-method/dana.png', type: 'ewallet' },
]

const getPaymentMethodImage = (bankName) => {
    if (!bankName) return null
    const method = indonesianPaymentMethods.find(m => m.value.toLowerCase() === bankName.toLowerCase() || bankName.toLowerCase().includes(m.value.toLowerCase()))
    return method ? method.image : null
}

const getPaymentIcon = (method) => {
    const name = (method.bank_name || '').toLowerCase()
    if (method.type === 'qris' || name.includes('qris')) return 'ph:qr-code-bold'
    if (name.includes('bca')) return 'ph:bank-bold'
    if (name.includes('mandiri')) return 'ph:bank-bold'
    if (name.includes('bni')) return 'ph:bank-bold'
    if (name.includes('bri')) return 'ph:bank-bold'
    if (name.includes('gopay')) return 'ph:wallet-bold'
    if (name.includes('dana')) return 'ph:wallet-bold'
    if (name.includes('ovo')) return 'ph:wallet-bold'
    return method.type === 'bank' ? 'ph:bank-bold' : 'ph:wallet-bold'
}

// SSR: Fetch event data with useAsyncData
const { data: eventData, error: eventError, pending: isPageLoading } = useAsyncData(
    `event-${slug}`,
    async () => {
        try {
            const eventRes = await $fetch(`${apiBaseUrl}/tournaments/${slug}`)
            const [categoriesRes, schedulesRes, participantsRes, imagesRes, paymentMethodsRes] = await Promise.all([
                $fetch(`${apiBaseUrl}/tournaments/${slug}/categories`).catch(() => null),
                $fetch(`${apiBaseUrl}/tournaments/${slug}/schedule`).catch(() => null),
                $fetch(`${apiBaseUrl}/tournaments/${slug}/participants?limit=2000`).catch(() => null),
                $fetch(`${apiBaseUrl}/tournaments/${slug}/images`).catch(() => null),
                $fetch(`${apiBaseUrl}/tournaments/${slug}/payment-methods`).catch(() => null)
            ])
            return {
                isExternal: false,
                event: eventRes,
                categories: categoriesRes,
                schedules: schedulesRes,
                participants: participantsRes,
                images: imagesRes,
                paymentMethods: paymentMethodsRes
            }
        } catch (e) {
            // Check if it exists as an external scraped tournament
            try {
                const extRes = await $fetch(`${apiBaseUrl}/tournaments/external/${slug}`)
                if (extRes && (extRes.tournament || extRes.data)) {
                    return {
                        isExternal: true,
                        externalTournament: extRes.tournament,
                        externalData: extRes.data,
                        event: { data: { name: extRes.tournament?.name || '' } }
                    }
                }
            } catch (extErr) {}
            throw createError({ statusCode: 404, statusMessage: 'Event not found', fatal: true })
        }
    },
    { lazy: false, server: true }
)

const isExternalTournamentState = useState('isExternalTournamentPage', () => /^\d+$/.test(String(slug || '')))
watchEffect(() => {
    isExternalTournamentState.value = eventData.value?.isExternal === true || /^\d+$/.test(String(slug || ''))
})
onUnmounted(() => {
    isExternalTournamentState.value = false
})

// Initialize data reactively
const tournament = computed(() => {
    if (eventData.value?.event) {
        return transformEventData(eventData.value.event.data || eventData.value.event, eventData.value.paymentMethods)
    }
    return fallbackTournament
})

const divisionsData = computed(() => {
    if (eventData.value?.categories?.events) {
        return processDivisions(eventData.value.categories.events)
    }
    return []
})

const schedulesData = computed(() => eventData.value?.schedules?.schedules || eventData.value?.schedules?.data?.schedules || [])
const participantsData = computed(() => eventData.value?.participants?.data || eventData.value?.participants?.participants || [])
const categoriesList = computed(() => eventData.value?.categories?.events || [])
const galleryImages = computed(() => eventData.value?.images?.images || eventData.value?.images?.data?.images || [])

// Lightbox state
const lightboxUrl = ref(null)
const openLightbox = (url) => {
    lightboxUrl.value = url
}

// Throw 404 if event not found (only after loading is complete)
watchEffect(() => {
    if (!isPageLoading.value) {
        if (eventError.value || !eventData.value) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Event not found',
                fatal: true
            })
        }
        if (!eventData.value.isExternal && (!eventData.value?.event || !tournament.value.name)) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Event not found',
                fatal: true
            })
        }
    }
})

const formattedFees = computed(() => {
    const t = tournament.value
    if (!t) return []

    const fmtRp = (val) => `Rp ${(val || 0).toLocaleString('id-ID')}`

    if (t.fee_mode === 'per_category' && divisionsData.value?.length > 0) {
        // Build per-category fee list from all categories
        const result = []
        const seen = new Set()
        ;(divisionsData.value || []).forEach(div => {
            div.rawCategories?.forEach(cat => {
                const catId = cat.id || cat.uuid
                const fee = t.fee_per_category?.[catId] ?? t.entry_fee ?? 0
                const label = [cat.category_name, cat.event_type_name, cat.gender_division_name].filter(Boolean).join(' – ')
                if (!seen.has(label)) {
                    seen.add(label)
                    result.push({
                        name: label,
                        amount: fee,
                        description: '',
                        typeLabel: div.name,
                        icon: div.icon
                    })
                }
            })
        })
        return result
    }

    if (t.fee_mode === 'per_type') {
        const types = [
            { key: 'individual', label: 'Individual', icon: 'ph:user-bold', desc: 'Per category per archer' },
            { key: 'team', label: 'Team (3 archers)', icon: 'ph:users-bold', desc: 'Per category per team' },
            { key: 'mixed_team', label: 'Mixed Team (2 archers)', icon: 'ph:users-three-bold', desc: 'Per category per team' }
        ]
        return types
            .filter(tp => (t.fee_per_type?.[tp.key] || 0) > 0)
            .map(tp => ({
                name: tp.label,
                amount: t.fee_per_type?.[tp.key] || 0,
                description: tp.desc,
                typeLabel: 'Per Participant Type',
                iconName: tp.icon
            }))
    }

    // Fallback: informational fees list
    return (t.fees || []).map(fee => ({
        ...fee,
        typeLabel: (fee.name || '').toLowerCase().includes('tim') ? 'Divisi Tim' : 'Divisi Individu'
    }))
})

// Initial tab sync logic is now handled by computed activeTab
onMounted(() => {
    if (!tournament.value) return
    // Handle old path-based tab redirects (e.g. /events/slug/jadwal-lomba → /events/slug?tab=jadwal-lomba)
    const pathTab = route.params.tab
    if (pathTab && typeof pathTab === 'string' && pathTab !== '') {
        navigateTo(`/tournaments/${slug}?tab=${pathTab}`, { replace: true })
    }
})

useHead({
    title: () => {
        if (!activeTab.value || activeTab.value === 'Ringkasan') {
            return `${tournament.value.name} - Archeris.net`
        }
        return `${activeTab.value} ${tournament.value.name} - Archeris.net`
    },
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ]
})

useSeoMeta({
    description: () => tournament.value.description,
    ogTitle: () => activeTab.value && activeTab.value !== 'Ringkasan'
        ? `${activeTab.value} ${tournament.value.name}`
        : tournament.value.name,
    ogDescription: () => tournament.value.description,
    ogImage: () => tournament.value.image,
    twitterCard: 'summary_large_image',
    twitterTitle: () => activeTab.value && activeTab.value !== 'Ringkasan'
        ? `${activeTab.value} ${tournament.value.name}`
        : tournament.value.name,
    twitterDescription: () => tournament.value.description,
    twitterImage: () => tournament.value.image
})

const copySuccess = ref(false)
const publicEventUrl = computed(() => {
    if (import.meta.server) return ''
    return window.location.href
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

// Share functionality
const shareTo = (platform) => {
    const url = encodeURIComponent(publicEventUrl.value)
    const text = encodeURIComponent(`Cek event panahan seru ini: ${tournament.value.name}`)

    let shareUrl = ''
    switch (platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`
            break
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
            break
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
            break
    }

    if (shareUrl) window.open(shareUrl, '_blank')
}

// Event countdown/status logic
const registrationStatus = computed(() => {
    const start = tournament.value.page_settings?.registration_start 
        ? new Date(tournament.value.page_settings.registration_start) 
        : null
    const deadline = tournament.value.registration_deadline 
        ? new Date(tournament.value.registration_deadline) 
        : null
    const now = new Date()

    if (start && now < start) {
        return {
            status: 'not_started',
            startTime: start,
            text: t('event_detail.registration_not_started')
        }
    }
    if (deadline && now > deadline) {
        return {
            status: 'closed',
            text: t('event_detail.registration_closed')
        }
    }
    return {
        status: 'open',
        text: t('event_detail.registration_opened')
    }
})

const countdown = computed(() => {
    const start = tournament.value.page_settings?.registration_start 
        ? new Date(tournament.value.page_settings.registration_start) 
        : null
    const deadline = tournament.value.registration_deadline 
        ? new Date(tournament.value.registration_deadline) 
        : null
    const now = new Date()

    if (start && now < start) {
        const diff = start - now
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        return { days, hours, minutes, isClosed: false, isNotStarted: true }
    }

    if (!tournament.value.registration_deadline) return { days: 0, hours: 0, minutes: 0, isClosed: false }
    const diff = deadline - now

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, isClosed: true }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return { days, hours, minutes, isClosed: false }
})

// Check if current user is already registered
const isAlreadyRegistered = computed(() => {
    if (!isLoggedIn.value || !user.value || !participantsData.value) return false

    // Support multiple check strategies: archer_id, user_id, or email
    const userId = user.value.id
    const userEmail = user.value.email

    return participantsData.value.some(p =>
        (p.archer_id && String(p.archer_id) === String(userId)) ||
        (p.user_id && String(p.user_id) === String(userId)) ||
        (p.email && p.email === userEmail) ||
        (p.athlete_code && p.athlete_code === user.value.athlete_code)
    )
})

// Dynamic SEO & Open Graph Meta Tags for Social Sharing & Google Rich Snippets
useSeoMeta({
    title: () => `${tournament.value.name || 'Archery Tournament'} - Archeris.net`,
    ogTitle: () => `${tournament.value.name || 'Archery Tournament'} - Archeris.net`,
    description: () => tournament.value.description ? tournament.value.description.replace(/<[^>]*>?/gm, '').substring(0, 160) : `Join ${tournament.value.name || 'archery tournament'} in ${tournament.value.location || 'Indonesia'}. Get schedule details, live qualification & elimination brackets, and registration.`,
    ogDescription: () => tournament.value.description ? tournament.value.description.replace(/<[^>]*>?/gm, '').substring(0, 160) : `Join ${tournament.value.name || 'archery tournament'} in ${tournament.value.location || 'Indonesia'}. Get schedule details, live qualification & elimination brackets, and registration.`,
    ogImage: () => tournament.value.banner_url || tournament.value.logo_url || 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=1200&auto=format&fit=crop',
    twitterCard: 'summary_large_image',
    twitterTitle: () => `${tournament.value.name || 'Archery Tournament'} - Archeris.net`,
    twitterDescription: () => tournament.value.description ? tournament.value.description.replace(/<[^>]*>?/gm, '').substring(0, 160) : `Join ${tournament.value.name || 'archery tournament'} in ${tournament.value.location || 'Indonesia'}.`,
    twitterImage: () => tournament.value.banner_url || tournament.value.logo_url || 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=1200&auto=format&fit=crop',
})

// Canonical Link & SportsEvent JSON-LD Structured Data for Google Rich Snippets
useHead({
    title: computed(() => `${tournament.value.name || 'Archery Tournament'} - Archeris.net`),
    link: [
        { rel: 'canonical', href: `https://archeris.net/events/${slug}` }
    ],
    script: [
        {
            type: 'application/ld+json',
            children: computed(() => JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'SportsEvent',
                'name': tournament.value.name || 'Archery Tournament',
                'description': tournament.value.description ? tournament.value.description.replace(/<[^>]*>?/gm, '').substring(0, 200) : 'Archery tournament with live scoring',
                'image': [tournament.value.banner_url || 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=1200&auto=format&fit=crop'],
                'location': {
                    '@type': 'Place',
                    'name': tournament.value.location || 'Archery Range',
                    'address': {
                        '@type': 'PostalAddress',
                        'addressLocality': tournament.value.location || 'Indonesia',
                        'addressCountry': 'ID'
                    }
                },
                'organizer': {
                    '@type': 'Organization',
                    'name': tournament.value.organizer || 'Tournament Organizer',
                    'url': 'https://archeris.net'
                }
            }))
        }
    ]
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}

.target-texture {
    background-image: radial-gradient(circle, transparent 20%, rgba(0, 0, 0, 0.03) 21%, rgba(0, 0, 0, 0.03) 39%, transparent 40%, transparent 59%, rgba(0, 0, 0, 0.03) 60%, rgba(0, 0, 0, 0.03) 79%, transparent 80%);
    background-size: 300px 300px;
    background-position: center;
}
</style>

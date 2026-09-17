<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <DashboardHeader
            :title="event?.name || t('dashboard_event_overview.summary_title', 'Ringkasan Event')"
            :subtitle="event ? `${event.venue || t('dashboard_event_overview.venue_fallback', 'Venue Belum Diatur')} • ${event.location || t('dashboard_event_overview.address_fallback', 'Lokasi')}` : t('dashboard_event_overview.summary_title', 'Ringkasan Event')"
            icon="ph:calendar-check"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/organizer' },
                { label: t('events.list.title', 'Event Saya'), to: '/dashboard/organizer/tournaments' },
                { label: event?.name || t('dashboard_event_overview.summary_title', 'Ringkasan Event') }
            ]"
        >
            <template #actions>
                <div class="flex flex-wrap items-center gap-3 shrink-0">
                    <BaseButton v-if="event?.status === 'draft'" variant="primary" icon="ph:rocket-launch-bold"
                        class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-black tracking-widest" @click="showQuotaModal = true">
                        {{ t('dashboard_event_overview.publish', 'Publikasikan') }}
                    </BaseButton>
                    <BaseButton variant="white" icon="ph:share-network-bold"
                        class="h-10 sm:h-11 px-5 border-white/20 shadow-sm font-bold text-xs sm:text-sm" @click="openShareDialog">
                        {{ t('dashboard_event_overview.share_button', 'Bagikan') }}
                    </BaseButton>
                </div>
            </template>
        </DashboardHeader>

        <!-- Main Content (Overview) -->

        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-8">
            <!-- Stats Grid Skeleton -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div v-for="i in 4" :key="i"
                    class="bg-white rounded-xl p-5 h-32 border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div class="flex justify-between items-start">
                        <div class="space-y-2">
                            <div class="h-3 w-20 bg-gray-100 animate-pulse rounded"></div>
                            <div class="h-8 w-12 bg-gray-100 animate-pulse rounded-lg"></div>
                        </div>
                        <div class="size-10 bg-gray-50 animate-pulse rounded-lg"></div>
                    </div>
                    <div class="h-3 w-24 bg-gray-50 animate-pulse rounded mt-auto"></div>
                </div>
            </div>

            <!-- Main Content Grid Skeleton -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Analytics Skeleton -->
                <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
                        <div class="h-6 w-40 bg-gray-100 animate-pulse rounded"></div>
                        <div class="h-4 w-20 bg-gray-50 animate-pulse rounded"></div>
                    </div>
                    <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/10">
                        <div class="space-y-5">
                            <div class="h-3 w-24 bg-gray-100 animate-pulse rounded mb-6"></div>
                            <div v-for="i in 5" :key="i" class="space-y-2">
                                <div class="flex justify-between">
                                    <div class="h-4 w-32 bg-gray-100 animate-pulse rounded"></div>
                                    <div class="h-4 w-8 bg-gray-50 animate-pulse rounded"></div>
                                </div>
                                <div class="h-1.5 w-full bg-gray-100 animate-pulse rounded-full"></div>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div class="h-3 w-32 bg-gray-100 animate-pulse rounded mb-6"></div>
                            <div v-for="i in 3" :key="i"
                                class="h-20 bg-white border border-gray-50 rounded-xl animate-pulse">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Leaderboard Skeleton -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
                        <div class="h-6 w-32 bg-gray-100 animate-pulse rounded"></div>
                        <div class="h-4 w-16 bg-gray-50 animate-pulse rounded"></div>
                    </div>
                    <div class="p-0">
                        <div v-for="i in 5" :key="i"
                            class="border-b border-gray-50 p-4 px-6 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="size-6 bg-gray-100 animate-pulse rounded"></div>
                                <div class="space-y-2">
                                    <div class="h-4 w-32 bg-gray-100 animate-pulse rounded"></div>
                                    <div class="h-3 w-20 bg-gray-50 animate-pulse rounded"></div>
                                </div>
                            </div>
                            <div class="h-6 w-10 bg-gray-100 animate-pulse rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab Content -->
        <div v-else class="space-y-8">
            <!-- OVERVIEW TAB -->
            <div v-if="activeTab === 'overview'" class="space-y-8">
                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <!-- Total Pemanah -->
                    <StatCard
                        :title="$t('dashboard_event_overview.stats.total_archers')"
                        :value="event?.participant_count || 0"
                        icon="ph:users"
                        color="primary"
                    />

                    <!-- Total Tim Resmi -->
                    <StatCard
                        :title="$t('dashboard_event_overview.stats.total_teams')"
                        :value="totalTeams"
                        icon="ph:users-three"
                        color="primary"
                    />

                    <!-- Penyelesaian -->
                    <StatCard
                        :title="$t('dashboard_event_overview.stats.completion')"
                        :value="completionPercentage + '%'"
                        icon="ph:check-square-offset"
                        color="primary"
                    >
                        <template #footer>
                            <div class="w-full bg-gray-100 rounded-full h-1.5 mt-auto">
                                <div class="bg-primary h-1.5 rounded-full" :style="`width: ${completionPercentage}%`"></div>
                            </div>
                        </template>
                    </StatCard>

                    <!-- Sisa Waktu -->
                    <StatCard
                        :title="$t('dashboard_event_overview.stats.time_left')"
                        :value="timeLeft"
                        icon="ph:timer"
                        color="primary"
                    >
                        <template #footer>
                            <div class="text-text-secondary text-xs font-medium">{{ t('dashboard_event_overview.estimated_end') }}: {{ estimatedEnd }}</div>
                        </template>
                    </StatCard>
                </div>
                <!-- Row 2: 2 Columns for Registration Analytics & Payment Status -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Column 1: Category Distribution Bar List -->
                    <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between space-y-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-navy font-bold text-base flex items-center gap-2">
                                    <Icon icon="ph:chart-bar-bold" class="text-primary text-xl" />
                                    {{ $t('dashboard_event_overview.registration_analysis', 'Analisis Registrasi Kategori') }}
                                </h3>
                                <div class="text-xs text-slate-400 font-medium mt-0.5">{{ $t('dashboard_event_overview.category_registration_desc', 'Jumlah pendaftaran peserta per kategori lomba') }}</div>
                            </div>
                            <NuxtLink :to="`/dashboard/organizer/tournaments/${route.params.id}/participants`"
                                class="text-xs text-navy font-bold hover:text-primary transition-colors flex items-center gap-1 shrink-0">
                                {{ $t('dashboard_event_overview.view_all_participants', 'Lihat Peserta') }}
                                <Icon icon="ph:caret-right-bold" />
                            </NuxtLink>
                        </div>

                        <!-- Progress Bars List -->
                        <div v-if="registrationStats.categories.length > 0" class="space-y-4 flex-1 flex flex-col justify-center">
                            <div v-for="(cat, idx) in registrationStats.categories.slice(0, 5)" :key="cat.name" class="space-y-1.5">
                                <div class="flex items-center justify-between text-xs font-bold text-navy">
                                    <span class="flex items-center gap-2 truncate">
                                        <span class="size-2.5 rounded-full shrink-0" :class="['bg-primary', 'bg-navy', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'][idx % 5]"></span>
                                        {{ cat.division }} - {{ cat.name }}
                                    </span>
                                    <span class="font-mono text-xs tabular-nums ml-2 shrink-0">{{ cat.count }} {{ $t('dashboard_event_overview.archers_unit', 'Peserta') }}</span>
                                </div>
                                <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div class="h-2 rounded-full transition-all duration-500"
                                        :class="['bg-primary', 'bg-navy', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'][idx % 5]"
                                        :style="`width: ${(cat.count / Math.max(1, participants.length)) * 100}%`">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div v-else class="py-14 flex flex-col items-center justify-center text-center space-y-3">
                            <div class="size-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                                <Icon icon="ph:chart-bar-bold" class="text-3xl text-slate-400" />
                            </div>
                            <div class="max-w-xs space-y-1">
                                <div class="text-xs font-bold text-navy">{{ $t('dashboard_event_overview.empty_pie_title', 'Belum Ada Data Kategori') }}</div>
                                <div class="text-[11px] text-slate-400 font-medium">{{ $t('dashboard_event_overview.no_category_data_desc', 'Statistik pendaftaran kategori akan otomatis muncul setelah peserta mendaftar.') }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Column 2: Payment Status Breakdown -->
                    <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
                        <h4 class="text-base font-bold text-navy flex items-center gap-2 mb-4">
                            <Icon icon="ph:wallet-bold" class="text-primary text-xl" />
                            {{ t('dashboard_event_overview.payment_status_heading', 'Status Pembayaran Peserta') }}
                        </h4>
                        <div class="space-y-3 flex-1 flex flex-col justify-center">
                            <div
                                class="flex items-center justify-between p-4 bg-slate-50/70 rounded-xl border border-slate-100 transition-transform hover:-translate-y-0.5">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                        <Icon icon="ph:check-circle-fill" class="text-xl" />
                                    </div>
                                    <div>
                                        <span
                                            class="block text-sm font-bold text-navy leading-tight">{{ t('dashboard_event_overview.payment_paid', 'Terbayar (Lunas)') }}</span>
                                        <span class="text-[10px] text-gray-400 font-medium">{{ t('dashboard_event_overview.payment_paid_desc', 'Pembayaran telah terverifikasi') }}</span>
                                    </div>
                                </div>
                                <span class="text-2xl font-black text-emerald-600 font-mono">{{
                                    registrationStats.payment.lunas }}</span>
                            </div>
                            <div
                                class="flex items-center justify-between p-4 bg-slate-50/70 rounded-xl border border-slate-100 transition-transform hover:-translate-y-0.5">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                                        <Icon icon="ph:clock-fill" class="text-xl" />
                                    </div>
                                    <div>
                                        <span
                                            class="block text-sm font-bold text-navy leading-tight">{{ t('dashboard_event_overview.payment_pending', 'Menunggu Pembayaran') }}</span>
                                        <span class="text-[10px] text-gray-400 font-medium">{{ t('dashboard_event_overview.payment_pending_desc', 'Dalam proses transaksi') }}</span>
                                    </div>
                                </div>
                                <span class="text-2xl font-black text-amber-600 font-mono">{{
                                    registrationStats.payment.menunggu_acc }}</span>
                            </div>
                            <div
                                class="flex items-center justify-between p-4 bg-slate-50/70 rounded-xl border border-slate-100 transition-transform hover:-translate-y-0.5">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center">
                                        <Icon icon="ph:warning-circle-fill" class="text-xl" />
                                    </div>
                                    <div>
                                        <span class="block text-sm font-bold text-navy leading-tight">{{ t('dashboard_event_overview.payment_unpaid', 'Belum Lunas') }}</span>
                                        <span class="text-[10px] text-gray-400 font-medium">{{ t('dashboard_event_overview.payment_unpaid_desc', 'Belum ada bukti / pembayaran') }}</span>
                                    </div>
                                </div>
                                <span class="text-2xl font-black text-red-600 font-mono">{{
                                    registrationStats.payment.belum_lunas }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Row 3: 2 Equal Columns (col 6 & col 6) for Leaderboard & Category Pie Chart -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Col 6 (Left): Leaderboard -->
                    <div class="bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden shadow-sm">
                        <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 class="text-navy font-bold text-sm flex items-center gap-2">
                                <Icon icon="ph:trophy-bold" class="text-primary text-base" />
                                {{ $t('dashboard_event_overview.leaderboard.title', 'Papan Peringkat (Leaderboard)') }}
                            </h3>
                            <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{{ $t('dashboard_event_overview.top_archers_badge', 'Top 6 Pemanah') }}</span>
                        </div>
                        <div class="flex-1 overflow-y-auto max-h-[460px] p-4 custom-scrollbar">
                            <div class="space-y-3">
                                <div v-for="(participant, idx) in topParticipants" :key="participant.id"
                                    @click="navigateTo(`/dashboard/organizer/tournaments/${route.params.id}/participants/${participant.athlete_code || participant.id}`)"
                                    class="group relative bg-white border border-gray-100 rounded-xl p-3 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer flex items-center gap-3">

                                    <!-- Rank Badge -->
                                    <div class="size-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0"
                                        :class="getRankClass(idx)">
                                        {{ idx + 1 }}
                                    </div>

                                    <!-- Avatar -->
                                    <div class="size-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                                        <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)"
                                            class="w-full h-full object-cover" />
                                    </div>

                                    <!-- Info -->
                                    <div class="flex-1 min-w-0">
                                        <div class="text-navy font-bold text-xs truncate group-hover:text-primary transition-colors">
                                            {{ participant.full_name }}
                                        </div>
                                        <div class="flex items-center gap-2 mt-0.5">
                                            <span class="text-[10px] font-semibold text-gray-500 truncate">
                                                {{ participant.division_name }}
                                            </span>
                                            <span class="text-[9px] text-gray-300">•</span>
                                            <span class="text-[10px] text-gray-400 truncate">
                                                {{ participant.club_name || '-' }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Score -->
                                    <div class="text-right shrink-0">
                                        <div class="text-base font-black text-navy tabular-nums">
                                            {{ participant.total_score || 0 }}
                                        </div>
                                        <div class="text-[9px] font-bold text-gray-400">{{ t('dashboard_event_overview.total_score_label', 'Skor Total') }}</div>
                                    </div>
                                </div>

                                <div v-if="topParticipants.length === 0"
                                    class="py-14 flex flex-col items-center justify-center text-center space-y-3">
                                    <div class="size-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                                        <Icon icon="ph:trophy-bold" class="text-3xl text-slate-400" />
                                    </div>
                                    <div class="max-w-xs space-y-1">
                                        <div class="text-xs font-bold text-navy">{{ $t('dashboard_event_overview.leaderboard.empty_title', 'Belum Ada Skor Tercatat') }}</div>
                                        <div class="text-[11px] text-slate-400 font-medium">{{ $t('dashboard_event_overview.leaderboard.no_scores', 'Papan peringkat pemanah terbaik akan tampil setelah pertandingan dimulai.') }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Col 6 (Right): Pie Chart Visualization Card -->
                    <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between space-y-6">
                        <div class="flex items-center justify-between border-b border-gray-100 pb-4">
                            <h3 class="text-navy font-bold text-sm flex items-center gap-2">
                                <Icon icon="ph:chart-pie-bold" class="text-primary text-base" />
                                {{ $t('dashboard_event_overview.pie_chart_title', 'Proporsi Kategori (Pie Chart)') }}
                            </h3>
                            <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{{ $t('dashboard_event_overview.percentage_overall', 'Persentase Keseluruhan') }}</span>
                        </div>

                        <!-- Pie Chart & Legend Container -->
                        <div v-if="registrationStats.categories.length > 0" class="flex-1 flex flex-col items-center justify-center space-y-6">
                            <!-- Circular Donut SVG Chart -->
                            <div class="relative size-44 flex items-center justify-center">
                                <svg class="size-full transform -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="15.9155" class="text-slate-100" stroke-width="4" stroke="currentColor" fill="none" />
                                    <!-- Dynamic SVG Segments -->
                                    <circle v-for="(cat, idx) in registrationStats.categories.slice(0, 5)" :key="cat.name"
                                        cx="18" cy="18" r="15.9155"
                                        :class="['transition-all duration-700', ['text-primary', 'text-navy', 'text-emerald-500', 'text-amber-500', 'text-purple-500'][idx % 5]]"
                                        stroke-width="4.5"
                                        stroke-linecap="round"
                                        :stroke-dasharray="`${(cat.count / Math.max(1, participants.length)) * 100}, 100`"
                                        :stroke-dashoffset="`-${registrationStats.categories.slice(0, idx).reduce((acc, c) => acc + (c.count / Math.max(1, participants.length)) * 100, 0)}`"
                                        stroke="currentColor"
                                        fill="none" />
                                </svg>
                                <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span class="text-2xl font-black text-navy font-mono leading-none">{{ participants.length }}</span>
                                    <span class="text-[10px] font-bold text-gray-400 tracking-wider mt-1">{{ $t('dashboard_event_overview.total_athletes_label', 'Total Atlet') }}</span>
                                </div>
                            </div>

                            <!-- Legend items grid -->
                            <div class="grid grid-cols-2 gap-3 w-full pt-2">
                                <div v-for="(cat, idx) in registrationStats.categories.slice(0, 4)" :key="cat.name"
                                    class="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100/80">
                                    <span class="size-3 rounded-full shrink-0" :class="['bg-primary', 'bg-navy', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'][idx % 5]"></span>
                                    <div class="min-w-0 flex-1">
                                        <div class="text-xs font-bold text-navy truncate">{{ cat.division }} - {{ cat.name }}</div>
                                        <div class="text-[10px] text-slate-400 font-mono">{{ cat.count }} ({{ Math.round((cat.count / Math.max(1, participants.length)) * 100) }}%)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Empty Pie Chart State -->
                        <div v-else class="py-14 flex flex-col items-center justify-center text-center space-y-3">
                            <div class="size-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                                <Icon icon="ph:chart-pie-bold" class="text-3xl text-slate-400" />
                            </div>
                            <div class="max-w-xs space-y-1">
                                <div class="text-xs font-bold text-navy">{{ $t('dashboard_event_overview.empty_pie_title', 'Belum Ada Data Kategori') }}</div>
                                <div class="text-[11px] text-slate-400 font-medium">{{ $t('dashboard_event_overview.empty_pie_desc', 'Visualisasi pie chart kategori akan otomatis muncul setelah peserta mendaftar.') }}</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

        <!-- Share Dialog (Teleported) -->
        <ClientOnly>
            <Teleport to="body">
                <div v-if="showShareDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <!-- Backdrop -->
                    <div class="share-dialog-backdrop absolute inset-0 bg-navy/60 backdrop-blur-sm"
                        @click="closeShareDialog"></div>

                    <!-- Dialog Card -->
                    <div
                        class="share-dialog-card bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden border border-gray-100">
                        <!-- Decorative Border Top -->
                        <div class="bg-primary h-1.5 w-full"></div>

                        <div class="p-6 sm:p-8">
                            <!-- Close Button -->
                            <BaseButton @click="closeShareDialog" variant="white" size="sm" icon="ph:x-bold"
                                class="absolute right-6 top-6 h-10 w-10 p-0 border-none shadow-none text-gray-400 hover:text-navy" />

                            <!-- Header -->
                            <div class="flex items-start gap-4 mb-8">
                                <div class="p-3 bg-primary/10 text-primary rounded-2xl shrink-0">
                                    <Icon icon="ph:share-network-bold" class="text-3xl" />
                                </div>
                                <div>
                                    <h3 class="text-navy-dark text-xl font-black tracking-tight mb-2">{{ $t('dashboard_event_overview.share_dialog.title') }}</h3>
                                    <div class="text-text-secondary text-sm font-medium leading-relaxed">
                                        {{ $t('dashboard_event_overview.share_dialog.desc') }}
                                    </div>
                                </div>
                            </div>

                            <!-- Link Copy Segment -->
                            <div class="space-y-3 mb-8">
                                <label class="text-[10px] font-black text-gray-400 tracking-[0.2em]">{{ $t('dashboard_event_overview.share_dialog.public_link_label') }}</label>
                                <div class="flex items-center gap-2">
                                    <div
                                        class="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-600 font-mono truncate">
                                        {{ publicEventUrl }}
                                    </div>
                                    <BaseButton @click="copyPublicUrl" variant="primary" size="sm"
                                        :icon="copySuccess ? 'ph:check-bold' : 'ph:copy-bold'"
                                        class="px-5 h-10 font-bold tracking-widest text-[10px] shrink-0 shadow-md">
                                        {{ copySuccess ? $t('dashboard_event_overview.share_dialog.copied') : $t('dashboard_event_overview.share_dialog.copy') }}
                                    </BaseButton>
                                </div>
                            </div>

                            <!-- Social Sharing -->
                            <div class="space-y-4">
                                <label class="text-[10px] font-black text-gray-400 tracking-[0.2em]">{{ $t('dashboard_event_overview.share_dialog.share_to_social') }}</label>
                                <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                    <div v-for="social in [
                                        { id: 'whatsapp', icon: 'ph:whatsapp-logo-fill', color: 'text-green-500', bg: 'bg-green-50', hover: 'hover:bg-green-500' },
                                        { id: 'telegram', icon: 'ph:telegram-logo-fill', color: 'text-sky-500', bg: 'bg-sky-50', hover: 'hover:bg-sky-500' },
                                        { id: 'twitter', icon: 'ph:twitter-logo-fill', color: 'text-black', bg: 'bg-gray-100', hover: 'hover:bg-black' },
                                        { id: 'facebook', icon: 'ph:facebook-logo-fill', color: 'text-blue-600', bg: 'bg-blue-50', hover: 'hover:bg-blue-600' },
                                        { id: 'linkedin', icon: 'ph:linkedin-logo-fill', color: 'text-indigo-600', bg: 'bg-indigo-50', hover: 'hover:bg-indigo-600' },
                                        { id: 'email', icon: 'ph:envelope-simple-fill', color: 'text-amber-600', bg: 'bg-amber-50', hover: 'hover:bg-amber-600' }
                                    ]" :key="social.id" @click="shareTo(social.id)"
                                        class="flex flex-col items-center gap-2 group cursor-pointer">
                                        <div :class="[social.bg, social.color]"
                                            class="size-12 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-navy transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:-translate-y-1">
                                            <Icon :icon="social.icon" class="text-2xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Background Ornament -->
                            <div
                                class="absolute top-0 right-0 -mr-12 -mt-12 size-32 bg-gray-50 rounded-full -z-10 blur-2xl">
                            </div>
                        </div>
                    </div>
                </div>
            </Teleport>


            <!-- Quota Selection Modal -->
            <Teleport to="body">
                <div v-if="showQuotaModal"
                    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    <div class="fixed inset-0 bg-navy/60 backdrop-blur-sm transition-opacity"
                        @click="showQuotaModal = false"></div>
                    <div class="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 z-10 border border-slate-100">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div class="flex items-center gap-3">
                                <div class="size-10 rounded-xl bg-primary/20 text-navy flex items-center justify-center shadow-xs">
                                    <Icon icon="ph:rocket-launch-bold" class="text-navy text-xl" />
                                </div>
                                <div>
                                    <h3 class="font-black text-navy text-lg leading-tight">{{ $t('dashboard_event_overview.quota_modal.title', 'Pilih Tier Event') }}</h3>
                                    <div class="text-xs text-slate-500 font-medium">{{ $t('dashboard_event_overview.quota_modal.desc', 'Gunakan quota event Anda untuk mempublikasikan.') }}</div>
                                </div>
                            </div>
                            <button @click="showQuotaModal = false" class="size-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-navy flex items-center justify-center transition-colors">
                                <Icon icon="ph:x-bold" class="text-base" />
                            </button>
                        </div>
                        
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Standard Tier -->
                            <div :class="[
                                'rounded-2xl border-2 p-5 transition-all flex flex-col justify-between',
                                (quotaData?.quota_standard || 0) > 0
                                    ? 'border-slate-200 hover:border-primary bg-white shadow-xs'
                                    : 'border-slate-200/80 bg-slate-50/70'
                            ]">
                                <div>
                                    <div class="flex items-center justify-between gap-2 mb-3">
                                        <div class="size-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                                            <Icon icon="ph:lightning-bold" class="text-xl" />
                                        </div>
                                        <span :class="[
                                            'px-2 py-0.5 rounded-md text-[10px] font-black',
                                            (quotaData?.quota_standard || 0) > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
                                        ]">
                                            {{ (quotaData?.quota_standard || 0) > 0 ? `${quotaData.quota_standard} Sisa` : '0 Kuota' }}
                                        </span>
                                    </div>
                                    <div class="text-[10px] font-black text-slate-400 tracking-widest">STANDARD</div>
                                    <div class="text-xl font-black text-navy">{{ quotaData?.quota_standard || 0 }} <span class="text-xs font-normal text-slate-400">kuota</span></div>
                                    <div class="text-xs text-slate-500 mt-2 leading-relaxed font-medium">{{ $t('dashboard_event_overview.quota_modal.standard_desc', 'Maksimal 200 peserta, 10 kategori, 3 scorekeeper.') }}</div>
                                </div>

                                <div class="pt-4 mt-2">
                                    <BaseButton
                                        v-if="(quotaData?.quota_standard || 0) > 0"
                                        @click="confirmPublish('standard')"
                                        variant="primary" size="sm" block class="font-black">
                                        {{ $t('dashboard_event_overview.publish', 'Publikasikan') }}
                                    </BaseButton>
                                    <BaseButton
                                        v-else
                                        to="/dashboard/organizer/package"
                                        variant="outline" size="sm" block class="font-bold text-xs text-amber-700 border-amber-300 hover:bg-amber-50">
                                        {{ $t('dashboard_event_overview.quota_modal.get_quota', 'Dapatkan Kuota') }}
                                    </BaseButton>
                                </div>
                            </div>

                            <!-- Elite Tier -->
                            <div :class="[
                                'rounded-2xl border-2 p-5 transition-all flex flex-col justify-between',
                                (quotaData?.quota_elite || 0) > 0
                                    ? 'border-slate-200 hover:border-primary bg-white shadow-xs'
                                    : 'border-slate-200/80 bg-slate-50/70'
                            ]">
                                <div>
                                    <div class="flex items-center justify-between gap-2 mb-3">
                                        <div class="size-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                            <Icon icon="ph:crown-simple-bold" class="text-xl" />
                                        </div>
                                        <span :class="[
                                            'px-2 py-0.5 rounded-md text-[10px] font-black',
                                            (quotaData?.quota_elite || 0) > 0 ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-600'
                                        ]">
                                            {{ (quotaData?.quota_elite || 0) > 0 ? `${quotaData.quota_elite} Sisa` : '0 Kuota' }}
                                        </span>
                                    </div>
                                    <div class="text-[10px] font-black text-slate-400 tracking-widest">ELITE</div>
                                    <div class="text-xl font-black text-navy">{{ quotaData?.quota_elite || 0 }} <span class="text-xs font-normal text-slate-400">kuota</span></div>
                                    <div class="text-xs text-slate-500 mt-2 leading-relaxed font-medium">{{ $t('dashboard_event_overview.quota_modal.elite_desc', 'Tanpa batas peserta, kategori, scorekeeper.') }}</div>
                                </div>

                                <div class="pt-4 mt-2">
                                    <BaseButton
                                        v-if="(quotaData?.quota_elite || 0) > 0"
                                        @click="confirmPublish('elite')"
                                        variant="primary" size="sm" block class="font-black">
                                        {{ $t('dashboard_event_overview.publish', 'Publikasikan') }}
                                    </BaseButton>
                                    <BaseButton
                                        v-else
                                        to="/dashboard/organizer/package"
                                        variant="outline" size="sm" block class="font-bold text-xs text-purple-700 border-purple-300 hover:bg-purple-50">
                                        {{ $t('dashboard_event_overview.quota_modal.get_quota', 'Dapatkan Kuota') }}
                                    </BaseButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Teleport>

            <!-- Zero / Insufficient Quota Modal (Flow Error Handler) -->
            <Teleport to="body">
                <div v-if="showInsufficientQuotaModal"
                    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    <div class="fixed inset-0 bg-navy/60 backdrop-blur-sm transition-opacity"
                        @click="showInsufficientQuotaModal = false"></div>
                    <div class="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 z-10 border border-slate-100 text-center">
                        <div class="size-16 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
                            <Icon icon="ph:crown-simple-bold" class="text-3xl" />
                        </div>
                        
                        <div class="space-y-2">
                            <h3 class="text-xl font-black text-navy tracking-tight">
                                {{ $t('dashboard_event_overview.quota_modal.insufficient_title', 'Kuota Event Tidak Mencukupi') }}
                            </h3>
                            <p class="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                                {{ $t('dashboard_event_overview.quota_modal.insufficient_desc', 'Anda tidak memiliki kuota event yang cukup untuk mempublikasikan turnamen ini. Silakan beli kuota tambahan.') }}
                            </p>
                        </div>

                        <!-- Quota Balance Card -->
                        <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 grid grid-cols-2 gap-3 text-center">
                            <div class="p-2.5 bg-white rounded-xl border border-slate-200/60">
                                <div class="text-[10px] font-black text-slate-400 tracking-wider">STANDARD EO</div>
                                <div class="text-lg font-black text-navy mt-0.5">{{ quotaData?.quota_standard || 0 }}</div>
                            </div>
                            <div class="p-2.5 bg-white rounded-xl border border-slate-200/60">
                                <div class="text-[10px] font-black text-slate-400 tracking-wider">ELITE EO</div>
                                <div class="text-lg font-black text-navy mt-0.5">{{ quotaData?.quota_elite || 0 }}</div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="space-y-2.5 pt-1">
                            <BaseButton
                                to="/dashboard/organizer/package"
                                variant="primary" size="lg" block icon="ph:sparkle-bold" class="font-black">
                                {{ $t('dashboard_event_overview.quota_modal.claim_or_buy_btn', 'Klaim / Beli Kuota Event') }}
                            </BaseButton>
                            
                            <BaseButton
                                @click="showInsufficientQuotaModal = false"
                                variant="white" size="md" block class="font-bold">
                                {{ $t('dashboard_event_overview.quota_modal.cancel', 'Nanti Saja') }}
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </Teleport>
        </ClientOnly>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { getCategoryIcon } from '~/utils/logoArcheryCategory'
import Breadcrumbs from '~/components/common/Breadcrumbs.vue'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useEventContext } from '~/composables/useTournamentContext'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { useSubscription } from '~/composables/useSubscription'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'dashboard'
})

const { t } = useI18n()

useHead({
    title: computed(() => t('dashboard_event_overview.meta_title'))
})

const route = useRoute()
const { get, post } = useApi()
const { setEvent, clearEvent } = useEventContext()

const { user } = useAuth()
const userRole = computed(() => user.value?.role || 'archer')

const breadcrumbItems = computed(() => [
    { label: t('dashboard.breadcrumbs.dashboard'), path: '/dashboard' },
    { label: t('dashboard.sidebar.event'), path: userRole.value === 'archer' ? '/dashboard/archer/tournaments' : '/dashboard/organizer/tournaments' }
])

const event = ref(null)
const eventCategories = ref([])
const participants = ref([])
const totalTeams = ref(0)
const searchQuery = ref('')
const isLoading = ref(true)
const isPublishing = ref(false)
const activeTab = ref('overview')

const { quotaData, fetchQuota } = useSubscription()
const toast = useToast()
const router = useRouter()
const showQuotaModal = ref(false)
const showInsufficientQuotaModal = ref(false)

const confirmPublish = async (tier) => {
    const stdQuota = quotaData.value?.quota_standard || 0
    const eliteQuota = quotaData.value?.quota_elite || 0

    if (tier === 'standard' && stdQuota <= 0) {
        showQuotaModal.value = false
        showInsufficientQuotaModal.value = true
        return
    }
    if (tier === 'elite' && eliteQuota <= 0) {
        showQuotaModal.value = false
        showInsufficientQuotaModal.value = true
        return
    }
    
    showQuotaModal.value = false
    await publishEvent(tier)
}
const showShareDialog = ref(false)
const copySuccess = ref(false)
const now = ref(new Date())
let timer = null

const filteredParticipants = computed(() => {
    if (!searchQuery.value) return participants.value
    const q = searchQuery.value.toLowerCase()
    return participants.value.filter(p =>
        p.full_name?.toLowerCase().includes(q) ||
        p.name?.toLowerCase().includes(q) ||
        p.athlete_code?.toLowerCase().includes(q) ||
        p.club_name?.toLowerCase().includes(q) ||
        p.club_id?.toLowerCase().includes(q)
    )
})

const tabs = [
    { id: 'overview', label: 'Ringkasan', icon: 'ph:layout-bold' }
]

const groupedTargets = computed(() => {
    const targets = {}
    participants.value.forEach(p => {
        if (!p.target_name) return
        if (!targets[p.target_name]) {
            targets[p.target_name] = []
        }
        targets[p.target_name].push(p)
    })
    return targets
})

const maxTargets = computed(() => {
    try {
        if (!groupedTargets.value || typeof groupedTargets.value !== 'object') return 20
        const targetNames = Object.keys(groupedTargets.value)
        if (targetNames.length === 0) return 20
        // Extract numbers from target_name (e.g., "A6" -> 6)
        const targetNumbers = targetNames
            .map(name => parseInt(name.replace(/^\D+/g, '')))
            .filter(n => !isNaN(n) && isFinite(n) && n > 0)

        if (targetNumbers.length === 0) return 20
        const max = Math.max(...targetNumbers, 20)
        return isFinite(max) && max > 0 ? max : 20
    } catch (error) {
        console.error('Error calculating maxTargets:', error)
        return 20
    }
})

const completionPercentage = computed(() => {
    if (!event.value || !participants.value.length) return 0
    // Simple calculation - can be enhanced with actual completion data
    const assigned = participants.value.filter(p => p.target_name).length
    return Math.round((assigned / participants.value.length) * 100)
})

const timeLeft = computed(() => {
    if (!event.value?.end_date) return 'N/A'
    const end = new Date(event.value.end_date)
    const diff = end - now.value
    if (diff < 0) return t('dashboard_event_overview.completed')

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
})

const estimatedEnd = computed(() => {
    if (!event.value?.end_date) return 'N/A'
    const end = new Date(event.value.end_date)
    return end.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
})

const topParticipants = computed(() => {
    return participants.value
        .filter(p => p.total_score)
        .sort((a, b) => (b.total_score || 0) - (a.total_score || 0))
        .slice(0, 6)
})

const registrationStats = computed(() => {
    const stats = {
        byCategory: {},
        byPayment: {
            lunas: 0,
            menunggu_acc: 0,
            belum_lunas: 0
        }
    }

    participants.value.forEach(p => {
        // Category stats
        const catId = p.category_id || 'unassigned'
        if (!stats.byCategory[catId]) {
            stats.byCategory[catId] = {
                name: p.category_name || t('dashboard_event_overview.unassigned_category'),
                division: p.division_name || 'N/A',
                event_type: p.event_type_name || '',
                gender: p.gender_division_name || '',
                count: 0
            }
        }
        stats.byCategory[catId].count++

        // Payment stats
        const status = p.payment_status?.toLowerCase()
        if (status === 'lunas' || status === 'paid') stats.byPayment.lunas++
        else if (status === 'menunggu_acc' || status === 'menunggu acc' || status === 'pending') stats.byPayment.menunggu_acc++
        else stats.byPayment.belum_lunas++
    })

    return {
        categories: Object.values(stats.byCategory).sort((a, b) => b.count - a.count),
        payment: stats.byPayment
    }
})

const publicEventUrl = computed(() => {
    const slug = event.value?.slug || route.params.id
    const origin = window?.location?.origin || 'https://archeris.net'
    return `${origin}/events/${slug}`
})

const openShareDialog = () => {
    copySuccess.value = false
    showShareDialog.value = true
    nextTick(() => {
        const dialog = document.querySelector('.share-dialog-card')
        const backdrop = document.querySelector('.share-dialog-backdrop')
        if (dialog && backdrop) {
            gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3 })
            gsap.fromTo(dialog, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' })
        }
    })
}

const closeShareDialog = () => {
    const dialog = document.querySelector('.share-dialog-card')
    const backdrop = document.querySelector('.share-dialog-backdrop')
    if (dialog && backdrop) {
        gsap.to(dialog, {
            opacity: 0, scale: 0.9, y: 20, duration: 0.2, ease: 'power2.in', onComplete: () => {
                showShareDialog.value = false
            }
        })
        gsap.to(backdrop, { opacity: 0, duration: 0.2 })
    } else {
        showShareDialog.value = false
    }
}

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
    const text = encodeURIComponent(event.value?.name || t('dashboard_event_overview.archery_event'))

    let shareUrl = ''
    if (platform === 'whatsapp') {
        shareUrl = `https://wa.me/?text=${text}%20-%20${url}`
    } else if (platform === 'telegram') {
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
    } else if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
    } else if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
    } else if (platform === 'linkedin') {
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    } else if (platform === 'email') {
        shareUrl = `mailto:?subject=${text}&body=${url}`
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'noopener,noreferrer')
    }
}

const alerts = computed(() => {
    // Generate alerts based on event status
    const alertList = []
    if (participants.value.filter(p => !p.target_name).length > 0) {
        const count = participants.value.filter(p => !p.target_name).length
        alertList.push({
            id: 1,
            type: 'info',
            icon: 'ph:user-plus',
            title: computed(() => t('dashboard_event_overview.alerts.unassigned_participants_title')),
            message: t('dashboard_event_overview.alerts.unassigned_participants_message', { count })
        })
    }
    return alertList
})

const getTargetHasIssue = (targetNum) => {
    // Placeholder - can be enhanced with actual issue detection
    return false
}

const fetchEventDetails = async () => {
    isLoading.value = true
    try {
        const [eventRes, categoriesRes, participantsRes, teamsRes] = await Promise.all([
            get(`/tournaments/${route.params.id}`),
            get(`/tournaments/${route.params.id}/categories`),
            get(`/tournaments/${route.params.id}/participants`),
            get(`/teams/event/${route.params.id}`)
        ])
        event.value = eventRes
        eventCategories.value = categoriesRes?.categories || []
        participants.value = participantsRes?.participants || []
        totalTeams.value = teamsRes?.total || 0

        if (event.value) {
            setEvent(event.value)
        }
    } catch (error) {
        console.error('Failed to fetch event management data:', error)
    } finally {
        isLoading.value = false
    }
}

const publishEvent = async (tier = 'standard') => {
    isPublishing.value = true
    try {
        await post(`/tournaments/${route.params.id}/publish?quota_type=${tier}`)
        toast.success(t('dashboard_event_overview.quota_modal.publish_success', 'Event berhasil dipublikasikan!'))
        await fetchEventDetails()
        await fetchQuota() // Refresh quota
    } catch (error) {
        console.error('Failed to publish event:', error)
        const errMsg = error?.data?.error || error?.response?.data?.error || error?.message || ''
        const code = error?.data?.code || error?.response?.data?.code || ''
        
        if (code === 'quota_insufficient' || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('kuota') || error?.status === 402 || error?.status === 403) {
            showInsufficientQuotaModal.value = true
        } else {
            toast.error(errMsg || t('dashboard_event_overview.publish_failed', 'Gagal mempublikasikan event'))
        }
    } finally {
        isPublishing.value = false
    }
}

onMounted(() => {
    fetchEventDetails()
    fetchQuota()
    timer = setInterval(() => {
        now.value = new Date()
    }, 60000)
})

onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
})

watch(event, (newEvent) => {
    if (newEvent) {
        setEvent(newEvent)
    }
}, { deep: true })

const getStatusClass = (status) => {
    const classes = {
        'active': 'bg-green-50 text-green-700 border-green-100 shadow-green-100/50',
        'draft': 'bg-amber-50 text-amber-700 border-amber-100 shadow-amber-100/50'
    }
    return classes[status] || 'bg-gray-100 text-gray-600 border-gray-200'
}

const getStatusDotClass = (status) => {
    const classes = {
        'active': 'bg-green-500',
        'draft': 'bg-amber-500'
    }
    return classes[status] || 'bg-gray-300'
}

const getStatusLabel = (status) => {
    const labels = {
        'active': t('dashboard_event_overview.active'),
        'draft': t('dashboard_event_overview.draft')
    }
    return labels[status] || status
}

const getRankClass = (idx) => {
    if (idx === 0) return 'bg-yellow-400 text-white'
    if (idx === 1) return 'bg-slate-300 text-slate-700'
    if (idx === 2) return 'bg-orange-400 text-white'
    return 'bg-gray-50 text-gray-400 border border-gray-100'
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar,
.scrollbar-thin::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track,
.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb,
.scrollbar-thin::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover,
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

.custom-scrollbar,
.scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>

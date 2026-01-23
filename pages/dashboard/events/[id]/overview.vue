<template>
    <div class="flex flex-col gap-8 pb-12">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div class="space-y-3">
                <div class="flex items-center gap-3">
                    <h1 class="text-3xl font-bold text-navy-dark tracking-tight">
                        {{ isLoading ? 'Loading...' : event?.name || 'Event Overview' }}
                    </h1>
                    <span v-if="event?.status === 'ongoing'"
                        class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 flex items-center gap-1.5 shadow-sm">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        LIVE
                    </span>
                </div>
                <p v-if="event" class="text-text-secondary mt-1 font-medium text-sm">
                    {{ event.venue || 'Event Venue' }} • {{ event.location || 'Location' }}
                </p>
                <div class="flex flex-wrap items-center gap-4">
                    <span :class="getStatusClass(event?.status)"
                        class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border shadow-sm">
                        <span class="w-2 h-2 rounded-full" :class="getStatusDotClass(event?.status)"></span>
                        {{ getStatusLabel(event?.status) }}
                    </span>
                    <div class="h-4 w-px bg-gray-200 hidden sm:block"></div>
                    <div class="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <Icon icon="ph:hash-bold" class="text-primary text-sm" />
                        <span>{{ event?.code }}</span>
                    </div>
                </div>
            </div>

            <div class="flex flex-wrap gap-3 mt-2 md:mt-0">
                <BaseButton variant="white" icon="ph:share-network-bold"
                    class="h-11 px-5 border-gray-200 shadow-sm font-bold" @click="openShareDialog">
                    Bagikan
                </BaseButton>
                <BaseButton :to="`/dashboard/events/${route.params.id}/edit`" variant="primary"
                    icon="ph:pencil-simple-line-bold" class="h-11 px-6 shadow-lg shadow-primary/20 font-bold">
                    Edit Event
                </BaseButton>
            </div>
        </div>

        <!-- Navigation Tabs -->
        <div
            class="flex items-center gap-6 border-b border-gray-100 pb-0 shadow-sm -mx-4 px-4 overflow-x-auto no-scrollbar">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                :class="activeTab === tab.id ? 'text-navy border-b-2 border-primary bg-primary/5' : 'text-gray-400 hover:text-navy hover:bg-gray-50'"
                class="pb-4 pt-4 px-4 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 border-transparent flex items-center gap-2 whitespace-nowrap">
                <Icon :icon="tab.icon" class="text-lg" />
                {{ tab.label }}
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div class="lg:col-span-1 space-y-8">
                    <div class="h-32 bg-gray-50 animate-pulse rounded-2xl"></div>
                    <div class="h-32 bg-gray-50 animate-pulse rounded-2xl"></div>
                </div>
                <div class="lg:col-span-3 h-96 bg-gray-50 animate-pulse rounded-2xl"></div>
            </div>
        </div>

        <!-- Tab Content -->
        <div v-else class="space-y-8">
            <!-- OVERVIEW TAB -->
            <div v-if="activeTab === 'overview'" class="space-y-8">
                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div
                        class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Total
                                    Archers</p>
                                <p class="text-navy-dark text-3xl font-extrabold tracking-tight">{{
                                    event?.participant_count || 0 }}</p>
                            </div>
                            <div
                                class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                                <Icon icon="ph:users" class="text-xl" />
                            </div>
                        </div>
                        <div class="mt-auto">
                            <p class="text-green-600 text-xs font-bold flex items-center gap-1">
                                <Icon icon="ph:trend-up" class="text-[14px]" />
                                {{ participants.length }} registered
                            </p>
                        </div>
                    </div>

                    <div
                        class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Active
                                    Targets</p>
                                <p class="text-navy-dark text-3xl font-extrabold tracking-tight">
                                    {{ Math.ceil((event?.participant_count || 0) / 4) }}<span
                                        class="text-lg text-gray-400 font-medium ml-1">/ {{ maxTargets }}</span></p>
                            </div>
                            <div
                                class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                                <Icon icon="ph:target" class="text-xl" />
                            </div>
                        </div>
                        <div class="mt-auto">
                            <p class="text-text-secondary text-xs font-medium flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                All systems online
                            </p>
                        </div>
                    </div>

                    <div
                        class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">
                                    Completion</p>
                                <p class="text-navy-dark text-3xl font-extrabold tracking-tight">{{ completionPercentage
                                    }}%</p>
                            </div>
                            <div
                                class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                                <Icon icon="ph:check-square-offset" class="text-xl" />
                            </div>
                        </div>
                        <div class="w-full bg-gray-100 rounded-full h-1.5 mt-auto">
                            <div class="bg-primary h-1.5 rounded-full" :style="`width: ${completionPercentage}%`"></div>
                        </div>
                    </div>

                    <div
                        class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Time
                                    Left</p>
                                <p class="text-navy-dark text-3xl font-extrabold tracking-tight tabular-nums">{{
                                    timeLeft }}</p>
                            </div>
                            <div
                                class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                                <Icon icon="ph:timer" class="text-xl" />
                            </div>
                        </div>
                        <div class="mt-auto">
                            <p class="text-text-secondary text-xs font-medium">Est. End: {{ estimatedEnd }}</p>
                        </div>
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Target Status -->
                    <div
                        class="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 class="text-navy-dark font-bold text-lg flex items-center gap-2">Target Status</h3>
                            <div class="flex gap-3 text-xs font-semibold">
                                <div class="flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Shooting
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-primary"></span> Scoring
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-red-500"></span> Issue
                                </div>
                            </div>
                        </div>
                        <div class="p-6 flex-1 overflow-y-auto bg-gray-50/30">
                            <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                                <button v-for="i in maxTargets" :key="i" :class="getTargetStatusClass(i)"
                                    class="aspect-square rounded-lg border flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all group shadow-sm">
                                    <span class="font-bold text-lg group-hover:scale-110 transition-transform"
                                        :class="getTargetTextClass(i)">
                                        {{ String(i).padStart(2, '0') }}
                                    </span>
                                    <div v-if="groupedTargets[i]" class="flex gap-1 mt-1">
                                        <div v-for="p in groupedTargets[i]" :key="p.id"
                                            class="w-2 h-2 rounded-full bg-primary border border-white"></div>
                                    </div>
                                    <Icon v-if="getTargetHasIssue(i)" icon="ph:warning"
                                        class="text-[16px] text-red-500 mt-1" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Leaderboard -->
                    <div
                        class="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 class="text-navy-dark font-bold text-lg flex items-center gap-2">Leaderboard</h3>
                            <button
                                class="text-xs text-text-secondary hover:text-navy-dark font-semibold transition-colors">View
                                All</button>
                        </div>
                        <div class="flex-1 overflow-y-auto">
                            <table class="w-full text-left text-sm">
                                <thead class="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                                    <tr>
                                        <th class="px-6 py-3 font-medium text-xs uppercase tracking-wider">Rk</th>
                                        <th class="px-6 py-3 font-medium text-xs uppercase tracking-wider">Archer</th>
                                        <th class="px-6 py-3 text-right font-medium text-xs uppercase tracking-wider">
                                            Score</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    <tr v-for="(participant, idx) in topParticipants" :key="participant.id"
                                        class="hover:bg-gray-50 transition-colors group">
                                        <td class="px-6 py-3.5">
                                            <div v-if="idx === 0"
                                                class="bg-primary text-navy-dark font-extrabold w-6 h-6 rounded flex items-center justify-center text-xs shadow-sm">
                                                {{ idx + 1 }}</div>
                                            <span v-else class="text-lg font-black text-gray-400">{{ idx + 1 }}</span>
                                        </td>
                                        <td class="px-6 py-3.5">
                                            <div
                                                class="text-navy-dark font-bold group-hover:text-primary-hover transition-colors">
                                                {{ participant.full_name || participant.name || 'Unknown' }}</div>
                                            <div class="text-gray-400 text-xs">{{ participant.division_name || 'N/A' }}
                                            </div>
                                        </td>
                                        <td class="px-6 py-3.5 text-right font-mono text-navy-dark font-bold text-base">
                                            {{ participant.total_score || 0 }}</td>
                                    </tr>
                                    <tr v-if="topParticipants.length === 0">
                                        <td colspan="3" class="px-6 py-12 text-center text-gray-400 italic font-medium">
                                            No scores yet
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions & Alerts -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Live Alerts -->
                    <div
                        class="bg-white rounded-xl border border-gray-200 flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 class="text-navy-dark font-bold text-lg flex items-center gap-2">Live Alerts</h3>
                            <span v-if="alerts.length > 0"
                                class="bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                {{ alerts.length }} New</span>
                        </div>
                        <div class="p-6 flex flex-col gap-4">
                            <div v-for="alert in alerts" :key="alert.id"
                                :class="alert.type === 'warning' ? 'bg-red-50/50 border-red-100' : 'bg-gray-50 border-gray-100'"
                                class="flex items-start gap-4 p-4 rounded-xl border">
                                <div :class="alert.type === 'warning' ? 'bg-white border-red-100 text-red-500' : 'bg-white border-gray-200 text-navy-dark'"
                                    class="p-2 rounded-lg border shadow-sm">
                                    <Icon :icon="alert.icon" class="text-xl" />
                                </div>
                                <div class="flex-1">
                                    <p class="text-navy-dark text-sm font-bold">{{ alert.title }}</p>
                                    <p class="text-text-secondary text-xs mt-1">{{ alert.message }}</p>
                                </div>
                                <button
                                    class="px-3 py-1.5 bg-white border border-gray-200 hover:border-red-200 hover:text-red-600 text-text-secondary text-xs font-semibold rounded-lg shadow-sm transition-colors">
                                    Dismiss</button>
                            </div>
                            <div v-if="alerts.length === 0" class="text-center py-8">
                                <Icon icon="ph:check-circle" class="text-4xl text-green-200 mx-auto mb-2" />
                                <p class="text-gray-400 text-sm">All systems operational</p>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <h3 class="text-navy-dark font-bold mb-4 flex items-center gap-2 text-lg">Quick Actions</h3>
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <button
                                class="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary hover:shadow-lg hover:shadow-primary/10 text-text-main transition-all group duration-300">
                                <Icon icon="ph:printer"
                                    class="mb-2 text-gray-400 group-hover:text-primary transition-colors text-2xl" />
                                <span class="text-xs font-bold group-hover:text-navy-dark">Print Scorecards</span>
                            </button>
                            <button
                                class="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary hover:shadow-lg hover:shadow-primary/10 text-text-main transition-all group duration-300">
                                <Icon icon="ph:arrows-clockwise"
                                    class="mb-2 text-gray-400 group-hover:text-primary transition-colors text-2xl" />
                                <span class="text-xs font-bold group-hover:text-navy-dark">Sync Leaderboard</span>
                            </button>
                            <button
                                class="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary hover:shadow-lg hover:shadow-primary/10 text-text-main transition-all group duration-300">
                                <Icon icon="ph:pencil"
                                    class="mb-2 text-gray-400 group-hover:text-primary transition-colors text-2xl" />
                                <span class="text-xs font-bold group-hover:text-navy-dark">Edit Assignments</span>
                            </button>
                            <button
                                class="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary hover:shadow-lg hover:shadow-primary/10 text-text-main transition-all group duration-300">
                                <Icon icon="ph:megaphone"
                                    class="mb-2 text-gray-400 group-hover:text-primary transition-colors text-2xl" />
                                <span class="text-xs font-bold group-hover:text-navy-dark">Announcements</span>
                            </button>
                            <button
                                class="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary hover:shadow-lg hover:shadow-primary/10 text-text-main transition-all group duration-300">
                                <Icon icon="ph:qr-code"
                                    class="mb-2 text-gray-400 group-hover:text-primary transition-colors text-2xl" />
                                <span class="text-xs font-bold group-hover:text-navy-dark">Generate QR</span>
                            </button>
                            <button
                                class="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary hover:shadow-lg hover:shadow-primary/10 text-text-main transition-all group duration-300">
                                <Icon icon="ph:gear"
                                    class="mb-2 text-gray-400 group-hover:text-primary transition-colors text-2xl" />
                                <span class="text-xs font-bold group-hover:text-navy-dark">Device Manager</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Other Tabs -->
            <div v-if="activeTab === 'control'">
                <EventPhaseControl :event="event" @refresh="fetchEventDetails" />
            </div>

            <div v-if="activeTab === 'qualification'">
                <EventQualificationManager :event-id="route.params.id" />
            </div>

            <div v-if="activeTab === 'elimination'">
                <EventEliminationManager :event-id="route.params.id" />
            </div>

            <div v-if="activeTab === 'athletes'" class="space-y-6">
                <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div
                        class="px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                        <div>
                            <h3 class="font-black text-navy text-xl tracking-tight">Daftar Atlet Terpusat</h3>
                            <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Total {{
                                participants.length }} Atlet Terdaftar</p>
                        </div>
                        <div class="flex gap-3">
                            <BaseInput v-model="searchQuery" placeholder="Cari Nama / Klub..."
                                icon="ph:magnifying-glass-bold" class="max-w-xs" />
                            <BaseButton variant="primary" icon="ph:plus-bold" size="sm" class="font-bold">Tambah Manual
                            </BaseButton>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead>
                                <tr
                                    class="border-b border-gray-50 bg-gray-50/20 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                                    <th class="px-8 py-5">Atlet</th>
                                    <th class="px-8 py-5">Klub</th>
                                    <th class="px-8 py-5">Divisi / Kategori</th>
                                    <th class="px-8 py-5">Target</th>
                                    <th class="px-8 py-5">Pembayaran</th>
                                    <th class="px-8 py-5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50 text-sm">
                                <tr v-for="p in filteredParticipants" :key="p.id"
                                    class="group hover:bg-gray-50/50 transition-colors">
                                    <td class="px-8 py-5">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-navy font-bold text-xs uppercase">
                                                {{p.full_name?.split(' ').map(n => n[0]).join('') || 'N/A'}}
                                            </div>
                                            <div>
                                                <p class="font-black text-navy tracking-tight">{{ p.full_name || p.name
                                                    }}</p>
                                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                    {{ p.athlete_code || '-' }}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-8 py-5 text-gray-500 font-medium">{{ p.club_name || p.club_id || '-'
                                        }}
                                    </td>
                                    <td class="px-8 py-5">
                                        <p class="text-navy font-bold text-xs">{{ p.division_name || '-' }}</p>
                                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{
                                            p.category_name || '-' }}</p>
                                    </td>
                                    <td class="px-8 py-5">
                                        <span v-if="p.target_number"
                                            class="inline-flex items-center justify-center px-2 py-1 bg-navy text-primary rounded font-black text-xs shadow-sm">
                                            {{ String(p.target_number).padStart(2, '0') }}{{ p.back_number || '' }}
                                        </span>
                                        <span v-else
                                            class="text-[10px] text-gray-300 font-black uppercase italic">TBD</span>
                                    </td>
                                    <td class="px-8 py-5">
                                        <span
                                            :class="p.payment_status === 'paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'"
                                            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border">
                                            {{ p.payment_status || 'Unpaid' }}
                                        </span>
                                    </td>
                                    <td class="px-8 py-5 text-right">
                                        <button class="p-2 text-gray-300 hover:text-navy transition-colors">
                                            <Icon icon="ph:pencil-simple-bold" />
                                        </button>
                                        <button class="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                            <Icon icon="ph:trash-bold" />
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="filteredParticipants.length === 0">
                                    <td colspan="6" class="px-8 py-12 text-center text-gray-400 italic font-medium">
                                        Tidak ada atlet yang ditemukan.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div v-if="activeTab === 'categories'" class="space-y-8">
                <EventCategoryManager :event-id="route.params.id" @refresh="fetchEventDetails" />
            </div>

            <div v-if="activeTab === 'settings'" class="max-w-3xl space-y-8">
                <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div class="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 class="font-black text-navy text-lg tracking-tight">Pengaturan Publikasi</h3>
                    </div>
                    <div class="p-8 space-y-6">
                        <div v-if="event?.status === 'draft'"
                            class="flex items-center justify-between gap-6 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                            <div class="flex items-center gap-4 text-amber-700">
                                <Icon icon="ph:warning-circle-bold" class="text-3xl" />
                                <div>
                                    <p class="font-black text-sm uppercase tracking-widest">Event Masih Draft</p>
                                    <p class="text-xs font-medium">Atlet belum bisa mendaftar sampai event dipublish.
                                    </p>
                                </div>
                            </div>
                            <BaseButton variant="primary" @click="publishEvent" :loading="isPublishing"
                                class="font-black text-[10px] uppercase tracking-widest px-6">Publish Sekarang
                            </BaseButton>
                        </div>
                        <div class="space-y-4">
                            <h4 class="text-sm font-bold text-navy">Danger Zone</h4>
                            <BaseButton variant="white"
                                class="text-red-600 border-red-100 bg-red-50/30 hover:bg-red-50 font-bold"
                                icon="ph:trash-bold">
                                Batalkan Event
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Share Dialog -->
        <div v-if="showShareDialog"
            class="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div
                class="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md mx-4 p-6 space-y-5 relative">
                <button
                    class="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                    @click="closeShareDialog">
                    <Icon icon="ph:x-bold" class="text-lg" />
                </button>

                <div class="flex items-start gap-3">
                    <div
                        class="bg-primary/10 text-primary rounded-xl w-10 h-10 flex items-center justify-center shrink-0">
                        <Icon icon="ph:share-network-bold" class="text-xl" />
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-navy">Bagikan Halaman Event</h3>
                        <p class="text-sm text-gray-500 mt-1">
                            Sebarkan link halaman publik event ini ke sosial media atau salin link untuk dibagikan
                            ke peserta.
                        </p>
                    </div>
                </div>

                <div class="space-y-2">
                    <p class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.18em]">Link Publik
                        Event</p>
                    <div class="flex items-center gap-2">
                        <div
                            class="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs text-gray-600 font-mono truncate">
                            {{ publicEventUrl }}
                        </div>
                        <BaseButton variant="white" size="sm" icon="ph:copy-bold" class="whitespace-nowrap"
                            @click="copyPublicUrl">
                            Salin
                        </BaseButton>
                    </div>
                    <p v-if="copySuccess" class="text-[11px] text-green-600 font-semibold mt-1">
                        Link berhasil disalin ke clipboard
                    </p>
                </div>

                <div class="pt-3 border-t border-gray-100 space-y-3">
                    <p class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.18em]">Bagikan ke
                        Sosial Media</p>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button type="button" @click="shareTo('whatsapp')"
                            class="flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-100 hover:border-green-500 hover:bg-green-50 transition-all">
                            <Icon icon="ph:whatsapp-logo" class="text-2xl text-green-500" />
                            <span class="text-[11px] font-semibold text-gray-600">WhatsApp</span>
                        </button>
                        <button type="button" @click="shareTo('telegram')"
                            class="flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-100 hover:border-sky-500 hover:bg-sky-50 transition-all">
                            <Icon icon="ph:telegram-logo" class="text-2xl text-sky-500" />
                            <span class="text-[11px] font-semibold text-gray-600">Telegram</span>
                        </button>
                        <button type="button" @click="shareTo('twitter')"
                            class="flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-100 hover:border-black hover:bg-gray-50 transition-all">
                            <Icon icon="ph:twitter-logo" class="text-2xl text-black" />
                            <span class="text-[11px] font-semibold text-gray-600">X (Twitter)</span>
                        </button>
                        <button type="button" @click="shareTo('facebook')"
                            class="flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-100 hover:border-blue-600 hover:bg-blue-50 transition-all">
                            <Icon icon="ph:facebook-logo" class="text-2xl text-blue-600" />
                            <span class="text-[11px] font-semibold text-gray-600">Facebook</span>
                        </button>
                    </div>
                </div>

                <div class="flex justify-end gap-3 pt-3 border-t border-gray-100">
                    <BaseButton variant="ghost" size="sm" @click="closeShareDialog">
                        Tutup
                    </BaseButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useEventContext } from '~/composables/useEventContext'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const { get, post } = useApi()
const { setEvent, clearEvent } = useEventContext()
const event = ref(null)
const eventCategories = ref([])
const participants = ref([])
const searchQuery = ref('')
const isLoading = ref(true)
const isPublishing = ref(false)
const activeTab = ref('overview')
const showShareDialog = ref(false)
const copySuccess = ref(false)

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
    { id: 'overview', label: 'Ringkasan', icon: 'ph:layout-bold' },
    { id: 'qualification', label: 'Kualifikasi', icon: 'ph:scoreboard-bold' },
    { id: 'elimination', label: 'Eliminasi', icon: 'ph:tree-structure-bold' },
    { id: 'athletes', label: 'Atlet', icon: 'ph:users-three-bold' },
    { id: 'categories', label: 'Kategori', icon: 'ph:tag-bold' },
    { id: 'settings', label: 'Pengaturan', icon: 'ph:gear-six-bold' }
]

const groupedTargets = computed(() => {
    const targets = {}
    participants.value.forEach(p => {
        if (!p.target_number) return
        if (!targets[p.target_number]) {
            targets[p.target_number] = []
        }
        targets[p.target_number].push(p)
    })
    return targets
})

const maxTargets = computed(() => {
    const targetNumbers = Object.keys(groupedTargets.value).map(Number)
    if (targetNumbers.length === 0) return 20
    return Math.max(...targetNumbers, 20)
})

const completionPercentage = computed(() => {
    if (!event.value || !participants.value.length) return 0
    // Simple calculation - can be enhanced with actual completion data
    const assigned = participants.value.filter(p => p.target_number).length
    return Math.round((assigned / participants.value.length) * 100)
})

const timeLeft = computed(() => {
    if (!event.value?.end_date) return 'N/A'
    const end = new Date(event.value.end_date)
    const now = new Date()
    const diff = end - now
    if (diff < 0) return '00:00'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
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
        .slice(0, 5)
})

const publicEventUrl = computed(() => {
    const slug = event.value?.slug || route.params.id
    const origin = window?.location?.origin || 'https://archeryhub.id'
    return `${origin}/events/${slug}`
})

const openShareDialog = () => {
    copySuccess.value = false
    showShareDialog.value = true
}

const closeShareDialog = () => {
    showShareDialog.value = false
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
    const text = encodeURIComponent(event.value?.name || 'Event Panahan')

    let shareUrl = ''
    if (platform === 'whatsapp') {
        shareUrl = `https://wa.me/?text=${text}%20-%20${url}`
    } else if (platform === 'telegram') {
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
    } else if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
    } else if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'noopener,noreferrer')
    }
}

const alerts = computed(() => {
    // Generate alerts based on event status
    const alertList = []
    if (participants.value.filter(p => !p.target_number).length > 0) {
        alertList.push({
            id: 1,
            type: 'info',
            icon: 'ph:user-plus',
            title: 'Unassigned Participants',
            message: `${participants.value.filter(p => !p.target_number).length} participants need target assignment.`
        })
    }
    return alertList
})

const getTargetStatusClass = (targetNum) => {
    const hasParticipants = groupedTargets.value[targetNum]
    if (!hasParticipants) {
        return 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
    }
    // Check if target has issues (can be enhanced with actual issue data)
    const hasIssue = false // Placeholder
    if (hasIssue) {
        return 'bg-red-50 border-red-200 text-red-600 animate-pulse'
    }
    return 'bg-white border-emerald-200 text-emerald-700 hover:border-emerald-400'
}

const getTargetTextClass = (targetNum) => {
    const hasParticipants = groupedTargets.value[targetNum]
    if (!hasParticipants) return 'text-gray-300'
    return 'text-emerald-700'
}

const getTargetHasIssue = (targetNum) => {
    // Placeholder - can be enhanced with actual issue detection
    return false
}

const fetchEventDetails = async () => {
    isLoading.value = true
    try {
        const [eventRes, categoriesRes, participantsRes] = await Promise.all([
            get(`/events/${route.params.id}`),
            get(`/events/${route.params.id}/categories`),
            get(`/events/${route.params.id}/participants`)
        ])
        event.value = eventRes
        eventCategories.value = categoriesRes?.categories || []
        participants.value = participantsRes?.participants || []

        if (event.value) {
            setEvent(event.value)
        }
    } catch (error) {
        console.error('Failed to fetch event management data:', error)
    } finally {
        isLoading.value = false
    }
}

const publishEvent = async () => {
    isPublishing.value = true
    try {
        await post(`/events/${route.params.id}/publish`)
        await fetchEventDetails()
    } catch (error) {
        console.error('Failed to publish event:', error)
    } finally {
        isPublishing.value = false
    }
}

onMounted(() => {
    fetchEventDetails()
})

watch(event, (newEvent) => {
    if (newEvent) {
        setEvent(newEvent)
    }
}, { deep: true })

const getStatusClass = (status) => {
    const classes = {
        'published': 'bg-green-50 text-green-700 border-green-100 shadow-green-100/50',
        'draft': 'bg-amber-50 text-amber-700 border-amber-100 shadow-amber-100/50',
        'ongoing': 'bg-primary/20 text-navy border-primary/20 shadow-primary/10',
        'upcoming': 'bg-blue-50 text-blue-700 border-blue-100 shadow-blue-100/50',
        'completed': 'bg-gray-100 text-gray-600 border-gray-200'
    }
    return classes[status] || 'bg-gray-100 text-gray-600 border-gray-200'
}

const getStatusDotClass = (status) => {
    const classes = {
        'published': 'bg-green-500',
        'draft': 'bg-amber-500',
        'ongoing': 'bg-primary animate-pulse',
        'upcoming': 'bg-blue-500',
        'completed': 'bg-gray-300'
    }
    return classes[status] || 'bg-gray-300'
}

const getStatusLabel = (status) => {
    const labels = {
        'published': 'Published',
        'draft': 'Draft Mode',
        'ongoing': 'Live Event',
        'upcoming': 'Scheduled',
        'completed': 'Completed'
    }
    return labels[status] || status
}
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>

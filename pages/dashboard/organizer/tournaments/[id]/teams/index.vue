<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <DashboardHeader
            :title="t('event_teams.title', 'Tim')"
            :subtitle="t('event_teams.subtitle', 'Kelola tim resmi untuk kategori terpilih')"
            icon="ph:users-three"
            :breadcrumbs="[
                { label: t('dashboard.sidebar.dashboard', 'Dashboard'), to: '/dashboard/organizer' },
                { label: t('dashboard.sidebar.my_events', 'My Tournaments'), to: '/dashboard/organizer/tournaments' },
                { label: (eventName !== 'Loading...' && eventName) || tournamentTitle || t('dashboard_event_overview.summary_title', 'Overview'), to: `/dashboard/organizer/tournaments/${eventId}/overview` },
                { label: t('event_teams.title', 'Tim') }
            ]"
        >
            <template #actions>
                <div class="flex flex-wrap items-center gap-3 shrink-0" v-if="selectedCategory">
                    <BaseButton variant="white" icon="ph:arrows-clockwise"
                        class="h-10 sm:h-11 px-5 border-white/20 text-xs sm:text-sm font-bold"
                        :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                        @click="isSubscriptionActive ? handleSyncTeams() : (showPremiumModal = true)"
                        :loading="isSyncing">
                        {{ t('event_teams.auto_sync', 'Sinkron Otomatis') }}
                    </BaseButton>
                    <BaseButton variant="primary" icon="ph:plus-bold"
                        class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-bold"
                        :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                        @click="isSubscriptionActive ? openAddTeamModal() : (showPremiumModal = true)">
                        {{ t('event_teams.add_team', 'Tambah Tim') }}
                    </BaseButton>
                </div>
            </template>
        </DashboardHeader>
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

        <!-- Category Selection -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs">
            <div class="flex items-center gap-3 mb-4">
                <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                    <Icon icon="ph:folders-bold" class="text-xl" />
                </div>
                <div class="text-base font-black text-navy dark:text-white">{{ t('event_teams.select_category', 'Pilih Kategori') }}</div>
            </div>

            <div v-if="loadingCategories" class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <div v-for="i in 4" :key="i"
                    class="flex-shrink-0 w-72 p-5 rounded-xl border border-slate-100 dark:border-slate-700 animate-pulse">
                    <div class="flex items-start gap-3">
                        <div class="size-12 bg-gray-100 rounded-xl"></div>
                        <div class="flex-1">
                            <div class="h-5 bg-gray-100 rounded mb-2"></div>
                            <div class="h-4 bg-gray-50 rounded w-24"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="categories.length === 0" class="text-center py-8 text-gray-400">
                <Icon icon="ph:folder-notch-open" class="text-4xl mx-auto mb-2" />
                <div>{{ t('event_teams.category_not_found', 'Kategori tim tidak ditemukan.') }}</div>
            </div>

            <div v-else class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <button v-for="category in categories" :key="category.id" @click="selectCategory(category)" :class="[
                    'flex-shrink-0 w-72 p-5 rounded-xl border-2 transition-all text-left group hover:shadow-md relative',
                    selectedCategory?.id === category.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                ]">
                    <div class="absolute top-0 left-0 w-1.5 h-full rounded-l-xl transition-colors"
                        :class="selectedCategory?.id === category.id ? 'bg-primary' : 'bg-transparent'"></div>
                    <div class="flex items-start gap-3 pl-2">
                        <div
                            class="size-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs overflow-hidden p-2">
                            <img :src="'/' + (getCategoryIcon(`${category?.division_name || ''} ${category?.event_type_name || ''} ${category?.gender_division_name || ''}`) || 'category-icon/men-team.svg')"
                                :alt="category?.division_name || 'Category'"
                                class="w-full h-full object-contain"
                                @error="(e) => { e.target.onerror = null; e.target.src = '/category-icon/men-team.svg' }" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="font-bold text-navy dark:text-white leading-tight mb-1 line-clamp-2">
                                {{ getCategoryName(category) }}
                            </div>
                            <div class="flex flex-wrap items-center gap-2">
                                <div class="flex items-center gap-3">
                                    <div v-if="category.team_count > 0"
                                        class="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                        <Icon icon="ph:users-three-bold" class="text-gray-400" />
                                        <span>{{ t('event_teams.team_count_badge', { count: category.team_count }) }}</span>
                                    </div>
                                    <div v-else class="text-[10px] font-medium text-gray-400">
                                        {{ t('event_teams.no_teams_badge', 'Belum ada tim') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        </div>

        <!-- Main Content: Official Teams List -->
        <div class="space-y-6">
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div class="flex items-center gap-3">
                        <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                            <Icon icon="ph:users-three-bold" class="text-xl" />
                        </div>
                        <div>
                            <div class="text-lg font-black text-navy dark:text-white leading-tight">{{ t('event_teams.official_team_list', 'Tim Resmi') }}</div>
                            <div class="text-sm text-gray-500 mt-1">{{ t('event_teams.team_list_desc', 'Kelola tim yang terdaftar resmi pada turnamen ini.') }}</div>
                        </div>
                    </div>

                    <!-- Search and Filter Controls -->
                    <div class="flex flex-wrap items-center gap-2.5">
                        <div class="w-full sm:w-60">
                            <BaseInput
                                v-model="teamSearchQuery"
                                :placeholder="t('event_teams.search_placeholder', 'Cari tim, klub, atau pemanah...')"
                                icon="ph:magnifying-glass"
                            />
                        </div>
                        <div class="w-full sm:w-44">
                            <BaseSelect
                                v-model="teamClubFilter"
                                :items="officialTeamClubOptions"
                                :placeholder="t('event_teams.filter_club', 'Semua Klub')"
                                teleport
                            />
                        </div>
                        <div class="w-full sm:w-44">
                            <BaseSelect
                                v-model="teamSortBy"
                                :items="teamSortOptions"
                                :placeholder="t('event_teams.sort_by', 'Urutan')"
                                teleport
                            />
                        </div>
                    </div>
                </div>

                <div v-if="loadingTeams" class="space-y-4">
                    <div v-for="i in 3" :key="i" class="h-32 bg-gray-50 dark:bg-slate-700/30 rounded-2xl animate-pulse"></div>
                </div>

                <div v-else-if="officialTeams.length === 0"
                    class="text-center py-20 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <div
                        class="size-20 bg-white dark:bg-slate-800 shadow-sm rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                        <Icon icon="ph:users-four" class="text-4xl text-gray-200" />
                    </div>
                    <div class="text-xl font-bold text-navy dark:text-white mb-2">{{ t('event_teams.no_teams', 'Belum ada tim resmi') }}</div>
                    <div class="text-gray-400 max-w-sm mx-auto text-sm" v-html="t('event_teams.no_teams_desc', 'Anda dapat membuat tim atau sinkron dari peserta terdaftar.')"></div>
                </div>

                <div v-else-if="filteredOfficialTeams.length === 0"
                    class="text-center py-16 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <div class="size-16 bg-white dark:bg-slate-800 shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <Icon icon="ph:magnifying-glass" class="text-3xl" />
                    </div>
                    <div class="text-lg font-bold text-navy dark:text-white mb-1">{{ t('event_teams.no_teams_filtered', 'Tidak ada tim yang sesuai') }}</div>
                    <div class="text-gray-400 text-xs max-w-xs mx-auto mb-4">{{ t('event_teams.no_teams_filtered_desc', 'Coba ubah kata kunci pencarian atau filter yang Anda pilih.') }}</div>
                    <BaseButton variant="white" class="px-4 py-2 text-xs font-bold" @click="resetFilters">
                        {{ t('event_teams.reset_filter', 'Reset Filter') }}
                    </BaseButton>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="team in filteredOfficialTeams" :key="team.id"
                        class="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 overflow-hidden flex flex-col">
                        <!-- Card Header -->
                        <div class="px-5 py-4 bg-slate-50/50 dark:bg-slate-700/30 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3">
                            <div class="flex items-center gap-3 min-w-0">
                                <span
                                    class="size-8 rounded-lg bg-navy text-white flex items-center justify-center font-black text-xs font-mono shadow-2xs shrink-0">
                                    #{{ team.team_rank || '-' }}
                                </span>
                                <span class="font-black text-navy dark:text-white text-base truncate">
                                    {{ team.team_name }}
                                </span>
                            </div>

                            <!-- Action buttons -->
                            <div class="flex items-center gap-1 shrink-0">
                                <button @click="isSubscriptionActive ? openEditTeamModal(team) : (showPremiumModal = true)"
                                    class="size-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                                    :title="t('event_teams.edit_team_detail', 'Edit Tim')">
                                    <Icon icon="ph:pencil-simple-bold" class="text-sm" />
                                </button>
                                <button @click="isSubscriptionActive ? (teamToDelete = team, showDeleteConfirm = true) : (showPremiumModal = true)"
                                    class="size-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                                    :title="t('event_teams.delete_team_confirm', 'Hapus Tim')">
                                    <Icon icon="ph:trash-bold" class="text-sm" />
                                </button>
                            </div>
                        </div>

                        <!-- Card Body: Members list -->
                        <div class="p-5 flex-1 space-y-3">
                            <div class="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
                                <Icon icon="ph:users-three-bold" />
                                <span>{{ t('event_teams.members_list', 'Anggota Tim') }}</span>
                            </div>

                            <div v-if="team.members && team.members.length > 0" class="space-y-2">
                                <div v-for="(member, index) in team.members" :key="member.id || index"
                                    class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/60">
                                    <span class="size-6 rounded-lg bg-navy/10 dark:bg-white/10 text-navy dark:text-white text-xs font-black flex items-center justify-center shrink-0">
                                        {{ index + 1 }}
                                    </span>
                                    <span class="text-xs sm:text-sm font-bold text-navy dark:text-white truncate flex-1">
                                        {{ member.full_name || '-' }}
                                    </span>
                                </div>
                            </div>
                            <div v-else class="text-xs text-slate-400 italic py-2 text-center">
                                {{ t('event_teams.no_members', 'Belum ada anggota') }}
                            </div>
                        </div>

                        <!-- Card Footer -->
                        <div class="px-5 py-3 bg-slate-50/30 dark:bg-slate-700/20 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <div class="flex items-center gap-1.5 truncate">
                                <Icon icon="ph:buildings-bold" class="text-sm text-slate-400 shrink-0" />
                                <span class="truncate font-medium">{{ formatClubName(team.club_name) }}</span>
                            </div>
                            <div class="text-[11px] font-bold text-slate-400 shrink-0">
                                {{ t('event_teams.members_count', { count: team.members?.length || 0 }) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Team Modal -->
        <BaseDialogForm
            v-model="showTeamModal"
            size="lg"
            :header="isEditing ? t('event_teams.edit_team_detail', 'Edit Tim') : t('event_teams.add_team', 'Tambah Tim')"
            @close="showTeamModal = false"
        >
            <div class="space-y-6">
                <!-- Section 1: Identitas Tim -->
                <div class="space-y-4">
                    <div class="flex items-center gap-2 text-sm font-bold text-navy dark:text-white">
                        <Icon icon="ph:identification-card-bold" class="text-base text-primary" />
                        <span>{{ t('event_teams.identity_and_category', 'Identitas & Kategori') }}</span>
                    </div>

                    <div class="bg-gray-50/70 dark:bg-slate-800/60 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 space-y-4">
                        <BaseInput
                            v-model="teamForm.team_name"
                            :label="t('event_teams.team_name', 'Nama Tim')"
                            :placeholder="t('event_teams.team_name_placeholder', 'Masukkan nama tim')"
                            required
                            icon="ph:users-four"
                        />

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Editing: lock category and club as read-only -->
                            <template v-if="isEditing">
                                <div class="space-y-1.5">
                                    <label class="block text-xs font-bold text-gray-600 dark:text-gray-300">{{ t('event_teams.category_label', 'Kategori') }}</label>
                                    <div
                                        class="h-11 px-3.5 flex items-center rounded-xl bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-sm font-bold text-navy dark:text-white shadow-xs">
                                        <Icon icon="ph:lock-simple" class="text-gray-400 mr-2 shrink-0" />
                                        <span class="truncate">{{ getCategoryName(categories.find(c => c.id === teamForm.category_id)) || teamForm.category_id }}</span>
                                    </div>
                                </div>
                                <div class="space-y-1.5">
                                    <label class="block text-xs font-bold text-gray-600 dark:text-gray-300">{{ t('event_teams.club', 'Klub') }}</label>
                                    <div
                                        class="h-11 px-3.5 flex items-center rounded-xl bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-sm font-bold text-navy dark:text-white shadow-xs">
                                        <Icon icon="ph:lock-simple" class="text-gray-400 mr-2 shrink-0" />
                                        <span class="truncate">{{ formatClubName(teamForm.club_name) }}</span>
                                    </div>
                                </div>
                            </template>
                            <!-- Adding: show dropdowns -->
                            <template v-else>
                                <BaseSelect
                                    v-model="teamForm.category_id"
                                    :items="mappedCategories"
                                    :label="t('event_teams.category_label', 'Kategori')"
                                    :placeholder="t('event_teams.select_category_placeholder', 'Pilih kategori')"
                                    @update:modelValue="onModalCategoryChange"
                                    searchable
                                    teleport
                                />
                                <BaseSelect
                                    v-model="teamForm.club_name"
                                    :items="mappedClubs"
                                    :label="t('event_teams.club', 'Klub')"
                                    :placeholder="t('event_teams.select_club_placeholder', 'Pilih klub')"
                                    :disabled="!teamForm.category_id || loadingParticipants"
                                    @update:modelValue="onModalClubChange"
                                    searchable
                                    teleport
                                />
                            </template>
                        </div>

                        <!-- Mixed Team Notice -->
                        <div v-if="modalCategoryInfo?.event_type_name?.toLowerCase().includes('mixed')"
                            class="flex items-center gap-2.5 p-3.5 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 rounded-xl text-xs text-blue-800 dark:text-blue-300 font-medium">
                            <Icon icon="ph:info-bold" class="text-blue-600 dark:text-blue-400 text-base shrink-0" />
                            <span>{{ t('event_teams.mixed_team_notice', 'Mixed Team wajib terdiri dari 1 pemanah putra dan 1 pemanah putri dari klub yang sama.') }}</span>
                        </div>
                    </div>
                </div>

                <!-- Section 2: Pemilihan Anggota -->
                <div class="space-y-4 pt-2 border-t border-gray-100 dark:border-slate-700" v-if="teamForm.club_name || isEditing">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div class="flex items-center gap-2 text-sm font-bold text-navy dark:text-white">
                            <Icon icon="ph:users-four-bold" class="text-base text-primary" />
                            <span>{{ t('event_teams.select_members', { current: teamForm.member_ids.length, max: maxMembers }) }}</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <!-- Male Selected Count Chip -->
                            <span v-if="selectedMaleCount > 0"
                                class="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50 px-2 py-0.5 rounded-full font-bold">
                                <Icon icon="ph:gender-male-bold" class="text-xs" />
                                <span>{{ t('event_teams.male_count', { count: selectedMaleCount }) }}</span>
                            </span>

                            <!-- Female Selected Count Chip -->
                            <span v-if="selectedFemaleCount > 0"
                                class="inline-flex items-center gap-1 text-[11px] bg-pink-50 text-pink-600 border border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-900/50 px-2 py-0.5 rounded-full font-bold">
                                <Icon icon="ph:gender-female-bold" class="text-xs" />
                                <span>{{ t('event_teams.female_count', { count: selectedFemaleCount }) }}</span>
                            </span>

                            <!-- Slot Full Badge -->
                            <span v-if="teamForm.member_ids.length === maxMembers"
                                class="text-[11px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                                {{ t('event_teams.slot_full', 'Slot Penuh') }}
                            </span>
                        </div>
                    </div>

                    <div v-if="loadingParticipants" class="py-12 text-center">
                        <LoadingSpinner />
                        <div class="text-xs text-gray-400 mt-2">{{ t('event_teams.loading_archers', 'Memuat pemanah...') }}</div>
                    </div>

                    <div v-else-if="!teamForm.club_name"
                        class="py-10 text-center bg-gray-50/80 dark:bg-slate-800/60 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                        <div class="size-12 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center mx-auto mb-3 shadow-xs border border-gray-100 dark:border-slate-600 text-navy dark:text-white">
                            <Icon icon="ph:buildings" class="text-2xl text-gray-400" />
                        </div>
                        <div class="text-xs font-bold text-gray-600 dark:text-gray-300">{{ t('event_teams.please_select_club', 'Silakan pilih klub terlebih dahulu') }}</div>
                        <div class="text-[11px] text-gray-400 mt-0.5">{{ t('event_teams.same_club_rule', 'Anggota harus berasal dari klub yang sama') }}</div>
                    </div>

                    <div v-else-if="filteredParticipants.length > 0"
                        class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                        <template v-for="(participant, index) in filteredParticipants" :key="participant.id">
                            <label
                                class="group relative flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden"
                                :class="teamForm.member_ids.includes(participant.id)
                                    ? 'border-navy dark:border-primary bg-navy/5 dark:bg-primary/10 shadow-xs'
                                    : 'border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 hover:border-gray-200 dark:hover:border-slate-600'">

                                <input type="checkbox" v-model="teamForm.member_ids" :value="participant.id"
                                    :disabled="!teamForm.member_ids.includes(participant.id) && teamForm.member_ids.length >= maxMembers"
                                    class="sr-only" />

                                <!-- Profile Image / Avatar -->
                                <div
                                    class="size-12 rounded-xl bg-gray-200 dark:bg-slate-700 overflow-hidden shrink-0 border border-gray-100 dark:border-slate-600 group-hover:border-navy/30 transition-colors shadow-xs">
                                    <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)"
                                        class="w-full h-full object-cover" :alt="participant.full_name" />
                                </div>

                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between gap-1">
                                        <div class="text-[13px] font-black text-navy dark:text-white truncate flex-1">
                                            {{ participant.full_name }}
                                        </div>
                                        <span class="text-[10px] font-black text-navy dark:text-white bg-navy/10 dark:bg-white/10 px-1.5 py-0.5 rounded shrink-0">#{{ index + 1 }}</span>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-2 mt-1.5">
                                        <!-- Gender Chip with Icon -->
                                        <div
                                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-2xs"
                                            :class="isMale(participant)
                                                ? 'bg-blue-50 text-blue-600 border border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50'
                                                : 'bg-pink-50 text-pink-600 border border-pink-200/80 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-900/50'">
                                            <Icon :icon="isMale(participant) ? 'ph:gender-male-bold' : 'ph:gender-female-bold'" class="text-xs" />
                                            <span>{{ formatGender(participant) }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Selection Status indicator -->
                                <div class="size-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0"
                                    :class="teamForm.member_ids.includes(participant.id)
                                        ? 'bg-navy dark:bg-primary border-navy dark:border-primary text-primary dark:text-navy'
                                        : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-transparent'">
                                    <Icon icon="ph:check-bold" class="text-xs" />
                                </div>
                            </label>
                        </template>
                    </div>

                    <div v-else
                        class="py-12 text-center bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                        <div
                            class="size-16 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center mx-auto mb-4 shadow-xs border border-gray-100 dark:border-slate-600">
                            <Icon icon="ph:user-focus-bold" class="text-3xl text-slate-400" />
                        </div>
                        <div class="text-sm font-bold text-gray-500 dark:text-gray-300">{{ t('event_teams.archers_not_found', 'Pemanah tidak ditemukan') }}</div>
                        <div class="text-xs text-gray-400 mt-1 max-w-[220px] mx-auto">
                            {{ t('event_teams.no_archers_registered_desc', 'Belum ada pemanah yang terdaftar untuk klub ini.') }}
                        </div>
                    </div>
                </div>
            </div>

            <template #action>
                <div class="flex items-center justify-end gap-2.5">
                    <BaseButton variant="white" @click="showTeamModal = false" class="px-5 font-bold text-sm">
                        {{ t('event_teams.cancel', 'Batal') }}
                    </BaseButton>
                    <BaseButton variant="primary" :loading="isSaving" @click="handleSaveTeam"
                        class="px-6 font-bold text-sm shadow-md shadow-primary/20 flex items-center gap-2"
                        :disabled="teamForm.member_ids.length < minMembers || !teamForm.team_name">
                        <Icon :icon="isEditing ? 'ph:check-bold' : 'ph:plus-bold'" class="text-base" />
                        {{ isEditing ? t('event_teams.save_changes', 'Simpan Perubahan') : t('event_teams.create_team', 'Simpan Tim') }}
                    </BaseButton>
                </div>
            </template>
        </BaseDialogForm>

        <!-- Delete Team Confirmation Dialog -->
        <BaseDialogForm v-model="showDeleteConfirm" size="sm" @close="showDeleteConfirm = false">
            <div class="text-center py-4 space-y-3">
                <div class="size-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-xs">
                    <Icon icon="ph:trash-bold" class="text-2xl" />
                </div>
                <div class="text-lg font-black text-navy dark:text-white">
                    {{ t('event_teams.delete_team_confirm', 'Hapus Tim') }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed" v-html="t('event_teams.delete_warning', { name: teamToDelete?.team_name })"></div>
            </div>

            <template #action>
                <div class="flex items-center justify-end gap-2.5 w-full">
                    <BaseButton variant="white" @click="showDeleteConfirm = false" class="px-5 font-bold text-sm">
                        {{ t('event_teams.cancel', 'Batal') }}
                    </BaseButton>
                    <BaseButton variant="primary" :loading="isDeleting" @click="executeDeleteTeam"
                        class="px-5 bg-rose-600 hover:bg-rose-700 border-rose-600 text-white shadow-md shadow-rose-200 dark:shadow-none font-bold text-sm flex items-center justify-center gap-2">
                        <Icon icon="ph:trash-bold" class="text-base" />
                        {{ t('event_teams.yes_delete', 'Ya, Hapus') }}
                    </BaseButton>
                </div>
            </template>
        </BaseDialogForm>

        <!-- Sync Confirmation Dialog -->
        <BaseDialogForm v-model="showSyncConfirm" size="md" @close="showSyncConfirm = false">
            <template #header>
                <div class="flex items-center gap-3">
                    <div class="size-10 bg-navy rounded-xl flex items-center justify-center text-primary shrink-0 shadow-sm">
                        <Icon icon="ph:arrows-clockwise-bold" class="text-xl" />
                    </div>
                    <div>
                        <div class="text-lg font-black text-navy leading-tight">{{ t('event_teams.sync_teams_confirm', 'Sinkron Tim') }}</div>
                        <div class="text-[11px] font-medium text-gray-400">{{ t('event_teams.auto_sync', 'Sinkron Otomatis') }}</div>
                    </div>
                </div>
            </template>

            <div class="space-y-4">
                <!-- Target Category Card -->
                <div class="bg-gradient-to-br from-navy/5 via-navy/[0.02] to-transparent rounded-2xl border border-navy/10 p-4">
                    <div class="flex items-center gap-3">
                        <div class="size-10 rounded-xl bg-white border border-gray-200/60 flex items-center justify-center shrink-0 shadow-sm">
                            <img :src="'/' + (getCategoryIcon(`${selectedCategory?.division_name || ''} ${selectedCategory?.gender_division_name || ''} ${selectedCategory?.event_type_name || ''}`) || 'category-icon/men-team.svg')"
                                class="size-6 object-contain"
                                :alt="getCategoryName(selectedCategory)"
                                @error="(e) => { e.target.onerror = null; e.target.src = '/category-icon/men-team.svg' }" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <div class="text-[11px] font-bold text-gray-400">{{ t('event_teams.category_label', 'Kategori') }}</div>
                            <div class="text-sm font-black text-navy truncate">{{ getCategoryName(selectedCategory) }}</div>
                        </div>
                        <div class="px-2.5 py-1 rounded-lg bg-navy/10 text-navy text-xs font-black shrink-0">
                            {{ t('event_teams.archers_per_team', { count: maxMembers }) }}
                        </div>
                    </div>
                </div>

                <!-- How it works description -->
                <div class="bg-gray-50/80 rounded-2xl border border-gray-100 p-4 space-y-2.5">
                    <div class="text-xs font-bold text-navy flex items-center gap-1.5">
                        <Icon icon="ph:sparkle-fill" class="text-amber-500 text-sm" />
                        {{ t('event_teams.how_sync_works', 'Cara Kerja Auto-Sync Tim') }}
                    </div>
                    <ul class="text-xs text-gray-600 space-y-2 pl-1">
                        <li class="flex items-start gap-2">
                            <span class="size-4 rounded-full bg-navy/10 text-navy font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                            <span>{{ t('event_teams.sync_step_1', 'Mengelompokkan atlet terverifikasi dari klub yang sama.') }}</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="size-4 rounded-full bg-navy/10 text-navy font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                            <span v-html="t('event_teams.sync_step_2', { count: maxMembers })"></span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="size-4 rounded-full bg-navy/10 text-navy font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                            <span>{{ t('event_teams.sync_step_3', 'Menyusun tim beregu resmi secara otomatis per klub.') }}</span>
                        </li>
                    </ul>
                </div>

                <!-- Warning Notice -->
                <div class="flex items-start gap-3 bg-amber-50/80 border border-amber-200/70 rounded-2xl p-3.5 text-xs text-amber-900 leading-relaxed">
                    <Icon icon="ph:warning-circle-fill" class="text-amber-500 text-base shrink-0 mt-0.5" />
                    <div>
                        <span class="font-bold block mb-0.5">{{ t('event_teams.destructive_action', 'Aksi Berisiko') }}</span>
                        <span>{{ t('event_teams.sync_warning', 'Sinkron akan menimpa tim yang ada. Lanjutkan dengan hati-hati.') }}</span>
                    </div>
                </div>
            </div>

            <template #action>
                <div class="flex items-center justify-end gap-2.5 pt-1">
                    <BaseButton variant="white" @click="showSyncConfirm = false" class="px-5 font-bold text-sm">
                        {{ t('event_teams.cancel', 'Batal') }}
                    </BaseButton>
                    <BaseButton variant="primary" :loading="isSyncing" @click="executeSyncTeams"
                        class="px-6 font-bold text-sm shadow-md shadow-primary/20 flex items-center gap-2">
                        <Icon icon="ph:arrows-clockwise-bold" class="text-base" />
                        {{ t('event_teams.yes_sync', 'Ya, Sinkron') }}
                    </BaseButton>
                </div>
            </template>
        </BaseDialogForm>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { getCategoryIcon } from '~/utils/logoArcheryCategory'
import DashboardHeader from '~/components/dashboard/DashboardHeader.vue'
import AppDialog from '~/components/common/AppDialog.vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import BaseDialogForm from '~/components/common/BaseDialogForm.vue'
import LoadingSpinner from '~/components/common/LoadingSpinner.vue'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { useI18n } from 'vue-i18n'
import { useSubscription } from '~/composables/useSubscription'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'

const route = useRoute()
const eventId = computed(() => (route.params.id || '').toString())
const { tournamentTitle } = useTournamentContext()
const { get, post, put, delete: del } = useApi()
const toast = useToast()
const { t } = useI18n()
const { isSubscriptionActive } = useSubscription()
const showPremiumModal = ref(false)

definePageMeta({
    layout: 'dashboard'
})

// State Management
const eventName = ref('Loading...')
const categories = ref([])
const selectedCategory = ref(null)
const officialTeams = ref([])
const participants = ref([])
const globalClubs = ref([])

useHead({
    title: () => `${eventName.value && eventName.value !== 'Loading...' ? eventName.value + ' - ' : ''}${t('event_teams.title', 'Tim')} - Archeris Dashboard`
})

// Loading States
const loadingCategories = ref(false)
const loadingTeams = ref(false)
const loadingParticipants = ref(false)
const isSyncing = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)

// Modal State
const showTeamModal = ref(false)
const showSyncConfirm = ref(false)
const showDeleteConfirm = ref(false)
const teamToDelete = ref(null)
const isEditing = ref(false)
const currentTeamId = ref(null)
const clubFilter = ref('')

// Search, Filter & Sort State for Official Teams
const teamSearchQuery = ref('')
const teamClubFilter = ref('all')
const teamSortBy = ref('rank_asc')

const resetFilters = () => {
    teamSearchQuery.value = ''
    teamClubFilter.value = 'all'
    teamSortBy.value = 'rank_asc'
}

const formatClubName = (clubName?: string) => {
    if (!clubName || clubName.toLowerCase() === 'independen' || clubName.toLowerCase() === 'independent') {
        return t('event_teams.independent', 'Independen')
    }
    return clubName
}

const formatEventType = (eventTypeName?: string) => {
    if (!eventTypeName) return ''
    const isEn = (useI18n().locale.value || 'id').startsWith('en')
    const lower = String(eventTypeName).trim().toLowerCase()
    if (lower.includes('mixed')) {
        return isEn ? 'Mixed Team' : 'Beregu Campuran'
    }
    if (lower.includes('team') || lower.includes('beregu')) {
        return isEn ? 'Team' : 'Beregu'
    }
    if (lower.includes('individual') || lower.includes('individu') || lower.includes('perorangan')) {
        return isEn ? 'Individual' : 'Individu'
    }
    return eventTypeName
}

const officialTeamClubOptions = computed(() => {
    const clubs = new Set()
    if (Array.isArray(officialTeams.value)) {
        officialTeams.value.forEach(team => {
            if (team.club_name) clubs.add(team.club_name)
            if (Array.isArray(team.members)) {
                team.members.forEach(m => {
                    if (m.club_name) clubs.add(m.club_name)
                })
            }
        })
    }
    const list = Array.from(clubs).sort().map(c => {
        const clubStr = String(c)
        return {
            title: formatClubName(clubStr),
            value: clubStr
        }
    })
    return [{ title: t('event_teams.all_clubs', 'Semua Klub'), value: 'all' }, ...list]
})

const teamSortOptions = computed(() => [
    { title: t('event_teams.sort_rank', 'Peringkat'), value: 'rank_asc' },
    { title: t('event_teams.sort_score_desc', 'Skor Tertinggi'), value: 'score_desc' },
    { title: t('event_teams.sort_name_asc', 'Nama Tim (A-Z)'), value: 'name_asc' }
])

const filteredOfficialTeams = computed(() => {
    let list = Array.isArray(officialTeams.value) ? [...officialTeams.value] : []

    // 1. Club filter
    if (teamClubFilter.value && teamClubFilter.value !== 'all') {
        const filterVal = teamClubFilter.value.toLowerCase()
        list = list.filter(team => {
            const teamClub = (team.club_name || '').toLowerCase()
            const memberClub = team.members?.some(m => (m.club_name || '').toLowerCase() === filterVal)
            return teamClub === filterVal || memberClub
        })
    }

    // 2. Search query filter
    if (teamSearchQuery.value.trim()) {
        const q = teamSearchQuery.value.trim().toLowerCase()
        list = list.filter(team => {
            const matchName = (team.team_name || '').toLowerCase().includes(q)
            const matchClub = (team.club_name || '').toLowerCase().includes(q)
            const matchMember = team.members?.some(m =>
                (m.full_name || '').toLowerCase().includes(q) ||
                (m.club_name || '').toLowerCase().includes(q)
            )
            return matchName || matchClub || matchMember
        })
    }

    // 3. Sort
    list.sort((a, b) => {
        if (teamSortBy.value === 'rank_asc') {
            const rankA = Number(a.team_rank) || 999999
            const rankB = Number(b.team_rank) || 999999
            return rankA - rankB
        } else if (teamSortBy.value === 'score_desc') {
            return (Number(b.total_score) || 0) - (Number(a.total_score) || 0)
        } else if (teamSortBy.value === 'name_asc') {
            return (a.team_name || '').localeCompare(b.team_name || '')
        }
        return 0
    })

    return list
})

const teamForm = reactive({
    team_name: '',
    member_ids: [],
    category_id: '',
    club_name: ''
})

const isMale = (participant) => {
    const g = String(participant?.gender_division_name || participant?.gender || '').toLowerCase()
    return g.includes('putra') || g.includes('men') || g.includes('male')
}

const isFemale = (participant) => {
    const g = String(participant?.gender_division_name || participant?.gender || '').toLowerCase()
    return g.includes('putri') || g.includes('women') || g.includes('female') || g.includes('wanita')
}

const formatGender = (participant) => {
    if (isMale(participant)) {
        return t('event_teams.male', 'Putra')
    }
    if (isFemale(participant)) {
        return t('event_teams.female', 'Putri')
    }
    return participant?.gender_division_name || ''
}

const selectedMaleCount = computed(() => {
    if (!Array.isArray(teamForm.member_ids) || !Array.isArray(participants.value)) return 0
    return participants.value.filter(p => teamForm.member_ids.includes(p.id) && isMale(p)).length
})

const selectedFemaleCount = computed(() => {
    if (!Array.isArray(teamForm.member_ids) || !Array.isArray(participants.value)) return 0
    return participants.value.filter(p => teamForm.member_ids.includes(p.id) && isFemale(p)).length
})

// Max members per team based on category type
const modalCategoryInfo = computed(() => {
    if (!teamForm.category_id || !Array.isArray(categories.value)) return null
    return categories.value.find(c => c.id === teamForm.category_id)
})

// Computed Properties
const maxMembers = computed(() => {
    if (!modalCategoryInfo.value) return 3
    const type = String(modalCategoryInfo.value.event_type_name || '').toLowerCase()
    if (type.includes('mixed')) return 2
    return 3
})

const minMembers = computed(() => maxMembers.value)

const mappedCategories = computed(() => {
    if (!Array.isArray(categories.value)) return []
    return categories.value.map(cat => ({
        title: getCategoryName(cat),
        value: cat.id,
        description: formatEventType(cat.event_type_name)
    }))
})

const mappedClubs = computed(() => {
    // 1. Group existing participants by club to see who is actually available
    const clubCounts = {}
    let hasIndependen = false

    if (Array.isArray(participants.value)) {
        participants.value.forEach(p => {
            const name = typeof p?.club_name === 'string' ? p.club_name.trim() : ''
            if (!name || name.toLowerCase() === 'independen') {
                hasIndependen = true
            } else {
                clubCounts[name] = (clubCounts[name] || 0) + 1
            }
        })
    }

    // 2. Map global clubs and add the count if they have participants
    const rawClubs = Array.isArray(globalClubs.value) ? globalClubs.value : []
    const clubs = rawClubs.map(club => {
        const clubName = typeof club === 'object' && club !== null ? (club.name || '') : String(club || '')
        const count = clubCounts[clubName] || 0
        return {
            title: clubName + (count > 0 ? ` (${count})` : ''),
            value: clubName,
            icon: 'ph:buildings',
            description: count > 0 ? t('event_teams.archers_available', { count }) : t('event_teams.no_archers_available', 'Tidak ada pemanah tersedia')
        }
    })

    // 3. Sort so clubs with participants appear first
    clubs.sort((a, b) => {
        const countA = clubCounts[a.value] || 0
        const countB = clubCounts[b.value] || 0
        if (countA !== countB) return countB - countA
        return (a.title || '').localeCompare(b.title || '')
    })

    // 4. Add Independen if participants exist
    if (hasIndependen) {
        clubs.unshift({
            title: t('event_teams.independent', 'Independen'),
            value: 'Independen',
            icon: 'ph:user',
            description: t('event_teams.no_club_archers', 'Tidak ada pemanah terdaftar di klub ini')
        })
    }

    return clubs
})

const filteredParticipants = computed(() => {
    if (!teamForm.club_name) return []

    const selectedClub = String(teamForm.club_name || '').trim().toLowerCase()
    let list = Array.isArray(participants.value) ? [...participants.value] : []

    // Use a more robust filter that matches the mappedClubs logic
    list = list.filter(p => {
        const pClub = (p?.club_name || 'Independen').toString().trim()
        return pClub.toLowerCase() === selectedClub
    })

    // Sort by score descending
    return list.sort((a, b) => (Number(b?.total_score) || 0) - (Number(a?.total_score) || 0))
})

const onModalCategoryChange = async () => {
    participants.value = [] // Clear previous results immediately
    teamForm.member_ids = []
    teamForm.club_name = ''
    if (teamForm.category_id) {
        await fetchParticipants(teamForm.category_id)
    }
}

const onModalClubChange = () => {
    // Reset member selection when club changes
    teamForm.member_ids = []
}

// Methods
const fetchEventName = async () => {
    try {
        const response = await get(`/tournaments/${eventId.value}`)
        eventName.value = response?.event?.name || response?.name || 'Event'
    } catch (error) {
        console.error('Failed to fetch event:', error)
    }
}

const fetchCategories = async () => {
    loadingCategories.value = true
    try {
        const response = await get(`/tournaments/${eventId.value}/categories`)
        const data = response?.events || response?.categories || []
        // Filter out individual categories for Team management
        const teamCategories = (Array.isArray(data) ? data : []).filter(cat =>
            String(cat?.event_type_name || '').toLowerCase() !== 'individual'
        )

        // Sort by participant_count descending
        teamCategories.sort((a, b) => (Number(b?.participant_count) || 0) - (Number(a?.participant_count) || 0))

        categories.value = teamCategories

        if (teamCategories.length > 0) {
            const catId = route.query.category || teamCategories[0].id
            const found = teamCategories.find(c => c.id === catId) || teamCategories[0]
            selectCategory(found)
        }
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    } finally {
        loadingCategories.value = false
    }
}

const selectCategory = async (category) => {
    if (!category) return
    selectedCategory.value = category
    await fetchTeams(category.id)
    await fetchParticipants(category.id)
}

const fetchTeams = async (categoryId) => {
    if (!categoryId) return
    loadingTeams.value = true
    try {
        const response = await get(`/teams/event/${eventId.value}`, {
            params: { category_id: categoryId }
        })
        officialTeams.value = response?.teams || []
    } catch (error) {
        console.error('Failed to fetch teams:', error)
        officialTeams.value = []
    } finally {
        loadingTeams.value = false
    }
}

const fetchParticipants = async (categoryId) => {
    if (!categoryId) return
    loadingParticipants.value = true
    try {
        const response = await get(`/tournaments/${eventId.value}/participants`, {
            params: {
                category_id: categoryId,
                payment_status: 'paid',
                limit: 2000 // Get all
            }
        })
        participants.value = response?.participants || []
    } catch (error) {
        console.error('Failed to fetch participants:', error)
    } finally {
        loadingParticipants.value = false
    }
}

const fetchGlobalClubs = async () => {
    try {
        const response = await get('/clubs', { params: { limit: 1000 } })
        globalClubs.value = response?.data || []
    } catch (error) {
        console.error('Failed to fetch clubs:', error)
    }
}

const handleSyncTeams = () => {
    if (!selectedCategory.value) return
    showSyncConfirm.value = true
}

const formatSyncDetailsMessage = (details = {}) => {
    if (!details || typeof details !== 'object') return ''

    let mainReason = details.reason || ''
    if (details.reason_code === 'no_eligible_groups') {
        mainReason = t('event_teams.no_eligible_groups_reason', { count: details.team_size || 3 })
    } else if (details.reason_code === 'no_mixed_pairs') {
        mainReason = t('event_teams.no_mixed_pairs_reason', 'Belum ada kombinasi klub dengan 1 putra + 1 putri yang keduanya punya skor kualifikasi')
    } else if (details.reason_code === 'missing_individual_categories') {
        mainReason = t('event_teams.missing_individual_categories_reason', 'Kategori pasangan perorangan putra/putri tidak ditemukan atau tidak lengkap')
    }

    if (mainReason) {
        const extras = []

        if (typeof details.total_participants === 'number') {
            extras.push(t('event_teams.total_participants_sync', { count: details.total_participants }))
        }

        if (typeof details.clubs_with_participants === 'number') {
            extras.push(t('event_teams.clubs_involved_sync', { count: details.clubs_with_participants }))
        }

        if (typeof details.male_participants === 'number') {
            extras.push(t('event_teams.male_sync', { count: details.male_participants }))
        }

        if (typeof details.female_participants === 'number') {
            extras.push(t('event_teams.female_sync', { count: details.female_participants }))
        }

        if (typeof details.eligible_team_groups === 'number') {
            extras.push(t('event_teams.eligible_groups_sync', { count: details.eligible_team_groups }))
        }

        return extras.length > 0
            ? `${mainReason} (${extras.join(', ')})`
            : mainReason
    }

    return ''
}

const executeSyncTeams = async () => {
    if (!selectedCategory.value?.id) return
    isSyncing.value = true
    try {
        const response = await post(`/teams/event/${eventId.value}/sync`, {
            category_id: selectedCategory.value.id
        })

        const syncCount = Number(response?.count || 0)
        const detailMessage = formatSyncDetailsMessage(response?.details)

        if (syncCount > 0) {
            toast.success(t('event_teams.toast_sync_success', { count: syncCount }))
        } else {
            toast.error(detailMessage || t('event_teams.toast_sync_no_teams', 'Tidak ada tim yang dibuat saat sinkron'))
        }

        await fetchTeams(selectedCategory.value.id)
    } catch (error) {
        console.error('Failed to sync teams:', error)
        const errorMessage = error?.data?.error || error?.data?.details?.reason || error?.data?.message || error?.message || t('event_teams.toast_sync_failed', 'Gagal menyinkron tim')
        toast.error(errorMessage)
    } finally {
        isSyncing.value = false
        showSyncConfirm.value = false
    }
}

const openAddTeamModal = async () => {
    isEditing.value = false
    currentTeamId.value = null
    teamForm.team_name = ''
    teamForm.member_ids = []
    teamForm.category_id = selectedCategory.value?.id || ''
    teamForm.club_name = ''

    if (teamForm.category_id) {
        participants.value = [] // Clear before fetching
        await fetchParticipants(teamForm.category_id)
    }

    showTeamModal.value = true
}

const openEditTeamModal = async (team) => {
    if (!team) return
    isEditing.value = true
    currentTeamId.value = team.id
    teamForm.team_name = team.team_name || ''
    teamForm.category_id = team.category_id || selectedCategory.value?.id || ''
    if (team.members && team.members.length > 0) {
        teamForm.club_name = team.members[0].club_name || ''
    }
    teamForm.member_ids = team.members?.map(m => m.participant_id) ?? []

    if (teamForm.category_id) {
        await fetchParticipants(teamForm.category_id)
    }
    showTeamModal.value = true
}

const handleSaveTeam = async () => {
    if (!teamForm.team_name) {
        toast.error(t('event_teams.toast_team_name_required', 'Nama tim wajib diisi'))
        return
    }
    if (teamForm.member_ids.length < minMembers.value) {
        toast.error(t('event_teams.toast_min_members', { count: minMembers.value }))
        return
    }

    // Mixed team gender validation
    const isMixed = modalCategoryInfo.value?.event_type_name?.toLowerCase().includes('mixed')
    if (isMixed) {
        const selectedArchers = participants.value.filter(p => teamForm.member_ids.includes(p.id))
        const hasMale = selectedArchers.some(p => {
            const g = (p.gender_division_name || p.gender || '').toLowerCase()
            return g.includes('putra') || g.includes('men') || g.includes('male')
        })
        const hasFemale = selectedArchers.some(p => {
            const g = (p.gender_division_name || p.gender || '').toLowerCase()
            return g.includes('putri') || g.includes('women') || g.includes('female')
        })
        if (!hasMale || !hasFemale) {
            toast.error(t('event_teams.toast_mixed_gender_required', 'Mixed team wajib terdiri dari 1 pemanah putra dan 1 pemanah putri'))
            return
        }
    }

    isSaving.value = true
    try {
        const payload = {
            team_name: teamForm.team_name,
            category_id: teamForm.category_id,
            member_ids: teamForm.member_ids
        }

        if (isEditing.value) {
            await put(`/teams/${currentTeamId.value}`, payload)
            toast.success(t('event_teams.toast_team_updated', 'Detail tim berhasil diperbarui'))
        } else {
            await post(`/teams/event/${eventId.value}`, payload)
            toast.success(t('event_teams.toast_team_created', 'Tim baru berhasil dibuat'))
        }

        showTeamModal.value = false
        if (selectedCategory.value?.id) {
            await fetchTeams(selectedCategory.value.id)
        }
    } catch (error) {
        console.error('Failed to save team:', error)
        const errMsg = error?.data?.error || error?.response?.data?.error || error?.message || t('event_teams.toast_team_save_failed', 'Gagal menyimpan data tim')
        toast.error(errMsg)
    } finally {
        isSaving.value = false
    }
}

const executeDeleteTeam = async () => {
    if (!teamToDelete.value?.id) return
    isDeleting.value = true
    try {
        await del(`/teams/${teamToDelete.value.id}`)
        toast.success(t('event_teams.toast_team_deleted', 'Tim berhasil dihapus'))
        showDeleteConfirm.value = false
        teamToDelete.value = null
        if (selectedCategory.value?.id) {
            await fetchTeams(selectedCategory.value.id)
        }
    } catch (error) {
        console.error('Failed to delete team:', error)
        const errMsg = error?.data?.error || error?.response?.data?.error || error?.message || t('event_teams.toast_team_delete_failed', 'Gagal menghapus tim')
        toast.error(errMsg)
    } finally {
        isDeleting.value = false
    }
}

const getCategoryName = (category) => {
    if (!category || typeof category !== 'object') return ''
    const parts = [
        category.division_name,
        category.category_name,
        category.gender_division_name,
        category.event_type_name
    ].filter(Boolean)

    const isEn = (useI18n().locale.value || 'id').startsWith('en')

    const translateWord = (w) => {
        const lower = String(w).trim().toLowerCase()
        if (isEn) {
            if (lower === 'putra' || lower === 'men' || lower === 'male') return 'Men'
            if (lower === 'putri' || lower === 'women' || lower === 'female' || lower === 'wanita') return 'Women'
            if (lower === 'campuran' || lower === 'mixed') return 'Mixed'
            if (lower === 'beregu' || lower === 'team') return 'Team'
            if (lower === 'individu' || lower === 'individual' || lower === 'perorangan') return 'Individual'
            if (lower === 'tradisional' || lower === 'traditional') return 'Traditional'
            if (lower === 'umum' || lower === 'general' || lower === 'open') return 'Open'
        } else {
            if (lower === 'men' || lower === 'male' || lower === 'putra') return 'Putra'
            if (lower === 'women' || lower === 'female' || lower === 'wanita' || lower === 'putri') return 'Putri'
            if (lower === 'mixed' || lower === 'campuran') return 'Campuran'
            if (lower === 'team' || lower === 'beregu') return 'Beregu'
            if (lower === 'individual' || lower === 'individu' || lower === 'perorangan') return 'Individu'
            if (lower === 'traditional' || lower === 'tradisional') return 'Tradisional'
            if (lower === 'open' || lower === 'general' || lower === 'umum') return 'Umum'
        }
        return w
    }

    const words = []
    const seen = new Set()

    parts.forEach(part => {
        const text = typeof part === 'object' && part !== null ? (part.String || '') : String(part || '')
        if (!text) return
        text.split(' ').forEach(rawWord => {
            const trimmed = rawWord.trim()
            if (!trimmed) return
            const translated = translateWord(trimmed)
            const key = translated.toLowerCase()
            if (!seen.has(key)) {
                words.push(translated)
                seen.add(key)
            }
        })
    })

    return words.join(' ')
}

// Watchers and lifecycle
onMounted(() => {
    fetchEventName()
    fetchCategories()
    fetchGlobalClubs()
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}

/* Animations */
.scale-enter-active,
.scale-leave-active {
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from,
.scale-leave-to {
    opacity: 0;
    transform: scale(0.5) translate(5px, -5px);
}
</style>

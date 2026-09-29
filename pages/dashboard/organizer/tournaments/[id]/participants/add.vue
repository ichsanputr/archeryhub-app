<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Enhanced Header Banner -->
        <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>

            <!-- Decorative Background Elements -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary">
            </div>

            <!-- Header Content -->
            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div class="flex items-start gap-4">
                        <div class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg shrink-0">
                            <Icon icon="ph:user-plus-bold" class="text-white text-2xl" />
                        </div>
                        <div>
                            <nav class="flex text-xs font-bold text-white/50 tracking-wider items-center gap-1.5 flex-wrap mb-2">
                                <NuxtLink to="/dashboard/organizer" class="hover:text-white transition-colors text-white/60">Dashboard</NuxtLink>
                                <Icon icon="ph:caret-right-bold" class="text-[10px] text-white/40" />
                                <NuxtLink to="/dashboard/organizer/tournaments" class="hover:text-white transition-colors text-white/60">{{ t('dashboard.sidebar.my_events', 'My Tournaments') }}</NuxtLink>
                                <Icon icon="ph:caret-right-bold" class="text-[10px] text-white/40" />
                                <NuxtLink :to="`/dashboard/organizer/tournaments/${route.params.id}/overview`" class="hover:text-white transition-colors text-white/60">{{ tournamentTitle || event?.name || t('dashboard_event_overview.summary_title', 'Overview') }}</NuxtLink>
                                <Icon icon="ph:caret-right-bold" class="text-[10px] text-white/40" />
                                <NuxtLink :to="`/dashboard/organizer/tournaments/${route.params.id}/participants`" class="hover:text-white transition-colors text-white/60">{{ t('dashboard.participants_list.title', 'Peserta') }}</NuxtLink>
                                <Icon icon="ph:caret-right-bold" class="text-[10px] text-white/40" />
                                <span class="text-white font-bold truncate max-w-[200px] sm:max-w-xs">{{ t('dashboard_events_participants_add.title') }}</span>
                            </nav>
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-1 text-white">
                                {{ t('dashboard_events_participants_add.title') }}
                            </h1>
                            <div class="text-slate-300 text-xs sm:text-sm max-w-2xl">
                                {{ t('dashboard_events_participants_add.subtitle') }}
                            </div>
                        </div>
                    </div>

                    <BaseButton :to="`/dashboard/organizer/tournaments/${route.params.id}/participants`" variant="white" icon="ph:arrow-left-bold" class="h-11 px-5 text-xs sm:text-sm font-bold shrink-0 shadow-md">
                        {{ t('dashboard_events_participants_add.back_to_list') }}
                    </BaseButton>
                </div>
            </div>
        </div>

        <!-- Subscription Expired / Locked Banner -->
        <div v-if="!isSubscriptionActive" class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-amber-900 shadow-sm">
            <div class="flex items-center gap-4">
                <div class="size-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-700">
                    <Icon icon="ph:lock-key-bold" class="text-2xl" />
                </div>
                <div>
                    <h3 class="font-black text-base text-navy">{{ t("dashboard_events_participants_add.subscription_expired_title") }}</h3>
                    <div class="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">{{ t("dashboard_events_participants_add.subscription_expired_desc") }}</div>
                </div>
            </div>
            <BaseButton to="/dashboard/organizer/package" variant="primary" icon="ph:sparkle-bold" class="shrink-0 h-10 px-5 text-xs sm:text-sm font-black tracking-widest">
                {{ t("dashboard_events_participants_add.upgrade_plan_btn") }}
            </BaseButton>
        </div>

        <!-- Form -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6" :class="{ 'opacity-60 pointer-events-none select-none': !isSubscriptionActive }">
            <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                <!-- Step 1: Select Archer -->
                <div>
                    <h3 class="text-lg font-black text-navy mb-4 pb-4 border-b-2 border-gray-200">{{ t('dashboard_events_participants_add.select_archer') }}</h3>
                    <div class="space-y-4">
                        <div class="flex p-1.5 bg-gray-100/80 rounded-2xl gap-2 border border-gray-200/50">
                            <button type="button" @click="archerMode = 'existing'"
                                :class="[
                                    'flex-1 h-11 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-none',
                                    archerMode === 'existing'
                                        ? 'bg-white text-navy shadow-md shadow-gray-200/50 border border-gray-100 font-extrabold'
                                        : 'text-gray-500 hover:text-navy hover:bg-white/50'
                                ]">
                                <Icon icon="ph:users-three-bold" :class="archerMode === 'existing' ? 'text-primary text-base' : 'text-gray-400'" />
                                <span class="hidden sm:inline">{{ t('dashboard_events_participants_add.select_registered') }}</span>
                                <span class="sm:hidden">{{ t('dashboard_events_participants_add.select_archer') }}</span>
                            </button>
                            <button type="button" @click="archerMode = 'new'"
                                :class="[
                                    'flex-1 h-11 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-none',
                                    archerMode === 'new'
                                        ? 'bg-white text-navy shadow-md shadow-gray-200/50 border border-gray-100 font-extrabold'
                                        : 'text-gray-500 hover:text-navy hover:bg-white/50'
                                ]">
                                <Icon icon="ph:user-plus-bold" :class="archerMode === 'new' ? 'text-primary text-base' : 'text-gray-400'" />
                                <span class="hidden sm:inline">{{ t('dashboard_events_participants_add.create_new') }}</span>
                                <span class="sm:hidden">{{ t('dashboard_events_participants_add.create_new_short') }}</span>
                            </button>
                        </div>

                        <!-- Existing Archer Selection (Redesigned with Full Filter Toolbar) -->
                        <div v-if="archerMode === 'existing'" class="space-y-4 flex flex-col flex-1">
                            <!-- Search & Filter Controls Panel -->
                            <div class="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-3.5 shadow-2xs">
                                <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                    <!-- Search Query Input (Col 7) -->
                                    <div class="sm:col-span-7 relative">
                                        <Icon icon="ph:magnifying-glass-bold" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                                        <input
                                            v-model="searchArcherQuery"
                                            type="text"
                                            :placeholder="t('dashboard_events_participants_add.search_placeholder', 'Cari nama pemanah, email...')"
                                            class="w-full pl-10 pr-9 h-11 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-navy placeholder:text-slate-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all shadow-2xs"
                                        />
                                        <button
                                            v-if="searchArcherQuery"
                                            type="button"
                                            @click="searchArcherQuery = ''"
                                            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                                        >
                                            <Icon icon="ph:x-circle-fill" class="text-base" />
                                        </button>
                                    </div>

                                    <!-- Club Selector Filter (Col 5) with Custom BaseSelect -->
                                    <div class="sm:col-span-5">
                                        <BaseSelect
                                            v-model="filterArcherClub"
                                            :items="filterClubOptions"
                                            :placeholder="t('dashboard_events_participants_add.all_clubs', 'Semua Klub / Kontingen')"
                                            icon="ph:shield-bold"
                                            searchable
                                            clearable
                                            class="w-full"
                                        />
                                    </div>
                                </div>

                                <!-- Row 2: Bulk Select on Left, Gender Filter Pills, Counters & Reset on Right -->
                                <div class="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200/60">
                                    <!-- Left Group: Select All Button & Gender Filter Pills -->
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <!-- Select All / Deselect All Button (Moved to Left) -->
                                        <button
                                            v-if="filteredArchers.length > 0"
                                            type="button"
                                            @click="toggleSelectAllFiltered"
                                            class="text-xs font-extrabold text-navy bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
                                        >
                                            <Icon :icon="areAllFilteredSelected ? 'ph:check-square-fill' : 'ph:square-bold'" class="text-sm text-navy" />
                                            <span>{{ areAllFilteredSelected ? t('common.deselect_all_results', 'Batal Pilih Semua') : t('common.select_all_results', 'Pilih Semua Hasil') }} ({{ filteredArchers.length }})</span>
                                        </button>

                                        <!-- Gender Filter Pills -->
                                        <div class="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                                            <button
                                                type="button"
                                                @click="filterArcherGender = 'all'"
                                                :class="[
                                                    'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                                                    filterArcherGender === 'all'
                                                        ? 'bg-navy text-white shadow-xs font-black'
                                                        : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                                                ]"
                                            >
                                                {{ t('common.all', 'Semua') }}
                                            </button>
                                            <button
                                                type="button"
                                                @click="filterArcherGender = 'male'"
                                                :class="[
                                                    'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1',
                                                    filterArcherGender === 'male'
                                                        ? 'bg-navy text-white shadow-xs font-black'
                                                        : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                                                ]"
                                            >
                                                <Icon icon="ph:gender-male-bold" class="text-xs" />
                                                <span>{{ t('participant.detail.gender_male', 'Laki-laki') }}</span>
                                            </button>
                                            <button
                                                type="button"
                                                @click="filterArcherGender = 'female'"
                                                :class="[
                                                    'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1',
                                                    filterArcherGender === 'female'
                                                        ? 'bg-navy text-white shadow-xs font-black'
                                                        : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                                                ]"
                                            >
                                                <Icon icon="ph:gender-female-bold" class="text-xs" />
                                                <span>{{ t('participant.detail.gender_female', 'Perempuan') }}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Right Group: Counters & Reset Button -->
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <span class="text-xs text-slate-500 font-medium">
                                            {{ filteredArchers.length }} {{ t('dashboard_events_participants_add.archers_unit', 'pemanah') }}
                                        </span>

                                        <button
                                            v-if="hasActiveArcherFilters"
                                            type="button"
                                            @click="resetArcherFilters"
                                            class="text-xs font-bold text-slate-500 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1"
                                        >
                                            <Icon icon="ph:arrow-counter-clockwise-bold" class="text-xs" />
                                            <span>{{ t('common.reset', 'Reset') }}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Results List (Scrollable Cards Grid) -->
                            <div class="max-h-[500px] min-h-[220px] flex-1 overflow-y-auto border border-slate-200 rounded-2xl bg-slate-50/40 p-2 space-y-2 shadow-2xs custom-scrollbar">
                                <template v-if="filteredArchers.length > 0">
                                    <div v-for="archer in filteredArchers" :key="archer.uuid || archer.id"
                                        @click="toggleArcher(archer)"
                                        :class="[
                                            'w-full p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none',
                                            isArcherSelected(archer)
                                                ? 'bg-white border-navy ring-1 ring-navy/20 shadow-xs'
                                                : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs'
                                        ]"
                                    >
                                        <div class="flex items-center gap-3.5 min-w-0 flex-1">
                                            <!-- Checkbox Box -->
                                            <div class="flex-shrink-0">
                                                <div v-if="isArcherSelected(archer)"
                                                    class="size-5 rounded-md bg-navy text-primary flex items-center justify-center shadow-2xs font-black">
                                                    <Icon icon="ph:check-bold" class="text-xs" />
                                                </div>
                                                <div v-else class="size-5 rounded-md border-2 border-slate-300 hover:border-slate-400 bg-white transition-colors">
                                                </div>
                                            </div>

                                            <!-- Avatar with fallback -->
                                            <div
                                                class="size-11 rounded-xl bg-slate-100 flex items-center justify-center text-navy font-bold text-xs sm:text-sm overflow-hidden border border-slate-200/90 shrink-0 shadow-2xs">
                                                <img :src="useImageOrDefault(archer.photo_url || archer.avatar_url, archer.full_name)"
                                                    class="size-full object-cover" />
                                            </div>

                                            <!-- Archer Info: Clean name, club, email, gender text (no chips beside name, no phone) -->
                                            <div class="flex-1 min-w-0 space-y-0.5">
                                                <div class="text-sm font-black text-navy truncate">{{ archer.full_name }}</div>
                                                <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
                                                    <span class="flex items-center gap-1 font-semibold text-slate-700">
                                                        <Icon icon="ph:shield-bold" class="text-xs text-slate-400" />
                                                        <span>{{ getArcherClubName(archer) }}</span>
                                                    </span>
                                                    <span v-if="archer.email" class="text-slate-400 truncate">{{ archer.email }}</span>
                                                    <span v-if="getGenderLabel(archer.gender)" class="text-slate-500 font-medium">
                                                        • {{ getGenderLabel(archer.gender) }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Add / Selected Status Button Action -->
                                        <div class="shrink-0">
                                            <span
                                                :class="[
                                                    'px-2.5 py-1 rounded-lg text-xs font-black transition-colors',
                                                    isArcherSelected(archer)
                                                        ? 'bg-navy text-primary'
                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                ]"
                                            >
                                                {{ isArcherSelected(archer) ? t('common.selected', 'Dipilih') : t('common.select', 'Pilih') }}
                                            </span>
                                        </div>
                                    </div>
                                </template>

                                <!-- Empty Result State -->
                                <div v-else-if="!isSearchingArchers" class="p-8 text-center space-y-3">
                                    <div class="size-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
                                        <Icon icon="ph:user-minus-bold" class="text-2xl" />
                                    </div>
                                    <div class="space-y-1">
                                        <div class="text-sm font-bold text-navy">
                                            {{ archers.length > 0 ? t('dashboard_events_participants_add.all_already_registered', 'Semua pemanah yang cocok sudah terdaftar') : t('dashboard_events_participants_add.not_found', 'Pemanah Tidak Ditemukan') }}
                                        </div>
                                        <div class="text-xs text-slate-400 max-w-sm mx-auto">
                                            {{ archers.length > 0 ? t('dashboard_events_participants_add.all_already_registered_desc', 'Semua pemanah hasil pencarian ini sudah terdaftar dalam turnamen ini.') : t('dashboard_events_participants_add.not_found_desc', 'Tidak ada data pemanah terdaftar yang cocok dengan kata kunci atau filter ini.') }}
                                        </div>
                                    </div>
                                    <BaseButton
                                        v-if="archers.length === 0"
                                        @click="archerMode = 'new'"
                                        variant="outline"
                                        size="sm"
                                        icon="ph:user-plus-bold"
                                        class="font-bold text-xs mx-auto"
                                    >
                                        {{ t('dashboard_events_participants_add.create_new', 'Buat Profil Pemanah Baru') }}
                                    </BaseButton>
                                </div>

                                <div v-if="isSearchingArchers" class="flex items-center justify-center py-12 gap-2 text-sm text-slate-500 font-medium">
                                    <span class="size-4 border-2 border-navy border-t-transparent rounded-full animate-spin"></span>
                                    <span>{{ t('dashboard_events_participants_add.searching', 'Mencari data pemanah...') }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- New Archer Form Info -->
                        <div v-if="archerMode === 'new'" class="space-y-4">
                            <!-- CSV Import Quick Action Banner -->
                            <div class="p-4 bg-gradient-to-r from-navy via-navy/95 to-navy/90 text-white rounded-2xl border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                                <div class="flex items-center gap-3">
                                    <div class="size-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                                        <Icon icon="ph:file-csv-bold" class="text-2xl text-primary" />
                                    </div>
                                    <div>
                                        <div class="text-sm font-bold tracking-tight">{{ t('dashboard_events_participants_add.csv_banner_title') }}</div>
                                        <div class="text-xs sm:text-sm text-slate-300">{{ t('dashboard_events_participants_add.csv_banner_desc') }}</div>
                                    </div>
                                </div>
                                <div class="flex flex-wrap gap-2 shrink-0">
                                    <BaseButton @click="downloadCsvTemplate" variant="white" icon="ph:download-simple-bold" size="sm" class="font-bold text-xs sm:text-sm shadow-md">
                                        {{ t('dashboard_events_participants_add.btn_download_template') }}
                                    </BaseButton>
                                    <BaseButton @click="showImportModal = true" variant="primary" icon="ph:upload-simple-bold" size="sm" class="font-bold text-xs sm:text-sm shadow-md">
                                        {{ t('dashboard_events_participants_add.btn_import_csv') }}
                                    </BaseButton>
                                </div>
                            </div>

                            <!-- Avatar Upload -->
                            <div class="flex items-center gap-5 p-4 bg-gray-50/80 border border-gray-200/60 rounded-2xl">
                                <div class="relative cursor-pointer group shrink-0" @click="showMediaLibrary = true">
                                    <div class="size-20 rounded-2xl bg-white border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center shadow-sm group-hover:border-primary transition-colors">
                                        <img :src="useImageOrDefault(newArcherForm.avatar_url, newArcherForm.full_name)"
                                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                        <div class="absolute inset-0 bg-navy/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Icon icon="ph:camera-bold" class="text-white text-xl" />
                                        </div>
                                    </div>
                                    <div class="absolute -bottom-1 -right-1 size-7 bg-primary rounded-xl flex items-center justify-center shadow-md border-2 border-white text-navy">
                                        <Icon icon="ph:pencil-simple-bold" class="text-xs" />
                                    </div>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="text-sm font-bold text-navy mb-0.5">{{ t('dashboard_events_participants_add.profile_photo') }}</div>
                                    <div class="text-xs sm:text-sm text-gray-400 mb-2 font-medium">{{ t('dashboard_events_participants_add.photo_hint') }}</div>
                                    <div class="flex gap-2">
                                        <BaseButton @click="showMediaLibrary = true" variant="white" size="sm" icon="ph:cloud-arrow-up-bold" class="h-8 px-3 text-xs sm:text-sm font-bold shadow-sm">
                                            {{ newArcherForm.avatar_url ? t('dashboard_events_participants_add.change_photo') : t('dashboard_events_participants_add.upload_photo') }}
                                        </BaseButton>
                                        <BaseButton v-if="newArcherForm.avatar_url" @click="newArcherForm.avatar_url = ''" variant="white" size="sm" icon="ph:trash-bold" class="h-8 w-8 p-0 text-red-500 bg-red-50 border-red-100 hover:bg-red-100" />
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <BaseInput v-model="newArcherForm.full_name" :label="t('dashboard_events_participants_add.full_name')"
                                    :placeholder="t('dashboard_events_participants_add.full_name_placeholder')" required @input="generateUsername" />
                                <BaseInput v-model="newArcherForm.email" :label="t('dashboard_events_participants_add.email')" type="email"
                                    :placeholder="t('dashboard_events_participants_add.email_placeholder')" required />
                                <BaseSelect v-model="newArcherForm.gender" :label="t('dashboard_events_participants_add.gender', 'Jenis Kelamin')"
                                    :items="genderOptions" required />
                                <BaseInput v-model="newArcherForm.phone" :label="t('dashboard_events_participants_add.phone')" type="tel"
                                    :placeholder="t('dashboard_events_participants_add.phone_placeholder')" numberOnly
                                    :rules="[v => !v || String(v).length >= 8 || t('dashboard_events_participants_add.phone_error')]" />
                                
                                <div class="relative">
                                    <BaseInput v-model="newArcherForm.password" :label="t('dashboard_events_participants_add.password')" type="text"
                                        :placeholder="t('dashboard_events_participants_add.password_placeholder')" required />
                                    <button type="button" @click="generateRandomPassword"
                                        class="absolute right-2 top-8 text-xs sm:text-sm font-bold text-slate-600 hover:text-navy bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1">
                                        <Icon icon="ph:arrows-clockwise-bold" class="text-xs sm:text-sm text-slate-500" />
                                        <span>{{ t('dashboard_events_participants_add.generate_password') }}</span>
                                    </button>
                                </div>

                                <BaseSelect v-model="newArcherForm.club_id" :label="t('dashboard_events_participants_add.club')" :items="clubOptions" required
                                    searchable />
                            </div>

                            <!-- Custom Archer Fields (Dynamic Configured Fields) -->
                            <div v-if="customFields.length > 0" class="pt-2">
                                <DynamicCustomFieldsRenderer
                                    :fields="customFields"
                                    v-model="newArcherForm.custom_fields"
                                />
                            </div>
                            
                            <div class="flex items-center justify-between pt-2">
                                <div class="text-xs sm:text-sm text-gray-400">
                                    {{ t('dashboard_events_participants_add.required_fields_hint') }}
                                </div>
                                <BaseButton type="button" @click="addNewArcherToList" variant="primary" icon="ph:user-plus-bold" size="sm" class="font-bold text-xs sm:text-sm shadow-md">
                                    {{ t('dashboard_events_participants_add.add_to_list') }}
                                </BaseButton>
                            </div>
                        </div>

                        <!-- Selected / Added Participants List Section -->
                        <div class="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4 mt-4">
                            <div class="flex items-center justify-between border-b border-slate-200/70 pb-3">
                                <div class="flex items-center gap-2.5">
                                    <div class="size-8 rounded-xl bg-navy text-primary flex items-center justify-center font-black text-xs shadow-xs">
                                        <Icon icon="ph:users-three-bold" />
                                    </div>
                                    <div class="text-sm font-black text-navy">{{ t('dashboard_events_participants_add.selected_title', { count: selectedArchers.length }) }}</div>
                                </div>
                                <BaseButton v-if="selectedArchers.length > 0" @click="selectedArchers = []" variant="white" size="xs"
                                    class="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border-red-200/80 font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs sm:text-sm">
                                    <Icon icon="ph:trash-bold" class="text-xs sm:text-sm" />
                                    <span>{{ t('dashboard_events_participants_add.clear_all') }}</span>
                                </BaseButton>
                            </div>

                            <!-- List Items -->
                            <div v-if="selectedArchers.length > 0" class="space-y-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                                <div v-for="(archer, index) in selectedArchers" :key="archer.uuid || archer.id || index"
                                    class="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition-all group">
                                    <div class="flex items-center gap-3.5 min-w-0 flex-1">
                                        <!-- Index Number Pill -->
                                        <div class="size-7 rounded-lg bg-slate-100 text-slate-500 font-mono font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
                                            #{{ index + 1 }}
                                        </div>

                                        <!-- Avatar -->
                                        <div
                                            class="size-11 rounded-xl bg-gray-100 flex items-center justify-center text-navy font-bold text-xs sm:text-sm overflow-hidden border border-gray-200 shrink-0 shadow-2xs">
                                            <img :src="useImageOrDefault(archer.photo_url || archer.avatar_url, archer.full_name)"
                                                class="w-full h-full object-cover" />
                                        </div>

                                        <!-- Archer Information -->
                                        <div class="flex-1 min-w-0 space-y-1">
                                            <div class="flex flex-wrap items-center gap-2">
                                                <span class="font-black text-navy text-sm sm:text-base truncate">{{ archer.full_name }}</span>
                                                <span v-if="archer.is_new_profile" class="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] sm:text-xs font-extrabold rounded-md">
                                                    {{ t('dashboard_events_participants_add.create_new_short') }}
                                                </span>
                                            </div>

                                            <div class="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-slate-500">
                                                <!-- Club Badge -->
                                                <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px] sm:text-xs border border-slate-200/60">
                                                    <Icon icon="ph:shield-chevron-bold" class="text-slate-500 text-xs sm:text-sm" />
                                                    <span class="truncate max-w-[200px]">{{ getArcherClubName(archer) }}</span>
                                                </div>

                                                <!-- Contact / Gender Info -->
                                                <span v-if="archer.email" class="inline-flex items-center gap-1 text-[11px] sm:text-xs text-slate-400 font-medium truncate max-w-[220px]">
                                                    <Icon icon="ph:envelope-simple-bold" />
                                                    <span class="truncate">{{ archer.email }}</span>
                                                </span>
                                                <span v-if="getGenderLabel(archer.gender)" class="inline-flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 font-medium">
                                                    <span>• {{ getGenderLabel(archer.gender) }}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Delete Single Archer Button -->
                                    <button type="button" @click="removeArcher(index)"
                                        class="size-9 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 flex items-center justify-center transition-colors shrink-0"
                                        :title="t('dashboard_events_participants_add.remove_from_list')">
                                        <Icon icon="ph:trash-bold" class="text-sm" />
                                    </button>
                                </div>
                            </div>

                            <!-- Empty State -->
                            <div v-else class="py-10 px-4 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                                <div class="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                                    <Icon icon="ph:users-thin" class="text-3xl" />
                                </div>
                                <div class="text-sm sm:text-base font-black text-navy">{{ t('dashboard_events_participants_add.empty_list_title') }}</div>
                                <div class="text-xs sm:text-sm text-slate-400 max-w-sm sm:max-w-md mx-auto mt-1">{{ t('dashboard_events_participants_add.empty_list_desc') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Step 2: Sidebar Column -->
            <div class="lg:col-span-1 space-y-6">
                <!-- Step 2: Select Category -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="text-lg font-black text-navy mb-4 pb-4 border-b-2 border-gray-200">{{ t('dashboard_events_participants_add.competition_category') }}</h3>
                    <div class="space-y-4">
                        <div class="grid grid-cols-1 gap-3">
                            <div v-for="category in categories" :key="category.id || category.uuid"
                                class="p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group"
                                :class="form.category_ids.includes(category.id || category.uuid)
                                    ? 'border-navy bg-navy/5 shadow-sm'
                                    : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'"
                                @click="toggleCategory(category.id || category.uuid)">
                                <div class="flex items-center gap-4">
                                    <div class="size-6 rounded-lg border-2 flex items-center justify-center transition-all"
                                        :class="form.category_ids.includes(category.id || category.uuid)
                                            ? 'bg-navy border-navy text-white'
                                            : 'bg-white border-gray-300 group-hover:border-navy'">
                                        <Icon v-if="form.category_ids.includes(category.id || category.uuid)"
                                            icon="ph:check-bold" class="text-white text-xs" />
                                    </div>
                                    <span class="text-sm font-bold text-navy">{{ category.name ||
                                        getCategoryName(category)
                                        }}</span>
                                </div>
                                <div v-if="form.category_ids.includes(category.id || category.uuid)"
                                    class="px-2 py-1 bg-navy text-white text-[10px] sm:text-xs font-black tracking-widest rounded-md">
                                    {{ t('dashboard_events_participants_add.selected') }}
                                </div>
                            </div>
                        </div>
                        <div class=" text-xs sm:text-sm text-gray-500 font-medium px-1 flex items-center gap-2">
                            <Icon icon="ph:info-bold" class="text-navy shrink-0" />
                            {{ t('dashboard_events_participants_add.category_schedule_hint') }}
                        </div>
                        <div v-if="categories.length === 0" class="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                            <div class="flex items-center gap-2">
                                <Icon icon="ph:info-bold" class="text-amber-500 text-xl shrink-0" />
                                <div class="text-sm text-amber-700 font-medium">
                                    {{ t('dashboard_events_participants_add.no_categories_warning') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons below Card 2 -->
                <div class="flex gap-3">
                    <BaseButton variant="white" :to="`/dashboard/organizer/tournaments/${route.params.id}/participants`"
                        class="flex-1 h-11 px-4 font-bold">
                        {{ t('dashboard_events_participants_add.cancel') }}
                    </BaseButton>
                    <BaseButton variant="primary" @click="submit" :loading="isSubmitting"
                        class="flex-1 h-11 px-4 font-bold shadow-lg shadow-primary/20">
                        {{ t('dashboard_events_participants_add.save_participant') }}
                    </BaseButton>
                </div>
            </div>
        </div>

    </div>

    <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleAvatarSelect" />
    <ImportParticipantsModal v-model:show="showImportModal" :event-id="route.params.id" :custom-fields="customFields" @parsed="handleCsvParsed" />
</template>

<script setup>
import { Icon } from '@iconify/vue'
import Breadcrumbs from '~/components/common/Breadcrumbs.vue'
import MediaLibrary from '~/components/common/MediaLibrary.vue'
import ImportParticipantsModal from '~/components/dashboard/ImportParticipantsModal.vue'
import DynamicCustomFieldsRenderer from '~/components/tournaments/DynamicCustomFieldsRenderer.vue'
import { ref, computed, onMounted, onBeforeUnmount, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useEventContext } from '~/composables/useTournamentContext'
import { useToast } from '~/composables/useToast'
import { useAuth } from '~/composables/useAuth'
import { useSubscription } from '~/composables/useSubscription'
import useDashboardI18n from '~/composables/useDashboardI18n'

const { t } = useDashboardI18n()

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})

useHead({
    title: computed(() => `${t('dashboard_events_participants_add.title')} - Archeris Dashboard`)
})

const route = useRoute()
const router = useRouter()
const { get, post } = useApi()
const toast = useToast()
const { user } = useAuth()
const { setEvent, clearEvent, tournamentTitle } = useEventContext()
const { isSubscriptionActive } = useSubscription()

const event = ref(null)
const archers = ref([])
const categories = ref([])
const clubs = ref([])
const cityOptions = ref([])
const archerMode = ref('existing')
const customFields = ref([])

watch(archerMode, () => {
    form.registration_source = 'invitation'
})

const breadcrumbItems = computed(() => [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Tournaments', path: '/dashboard/organizer/tournaments' },
    { label: 'Peserta', path: `/dashboard/organizer/tournaments/${route.params.id}/participants` }
])

const searchArcherQuery = ref('')
const filterArcherClub = ref('')
const filterArcherGender = ref('all')
const selectedArchers = ref([])
const isSubmitting = ref(false)
const showMediaLibrary = ref(false)
const showImportModal = ref(false)

const hasActiveArcherFilters = computed(() => {
    return Boolean(
        (searchArcherQuery.value && searchArcherQuery.value.trim() !== '') ||
        (filterArcherClub.value && filterArcherClub.value !== '') ||
        (filterArcherGender.value && filterArcherGender.value !== 'all')
    )
})

const areAllFilteredSelected = computed(() => {
    if (filteredArchers.value.length === 0) return false
    return filteredArchers.value.every(a => isArcherSelected(a))
})

const toggleSelectAllFiltered = () => {
    if (areAllFilteredSelected.value) {
        const filteredIds = new Set(filteredArchers.value.map(a => a.uuid || a.id))
        selectedArchers.value = selectedArchers.value.filter(a => !filteredIds.has(a.uuid || a.id))
    } else {
        for (const archer of filteredArchers.value) {
            if (!isArcherSelected(archer)) {
                selectedArchers.value.push(archer)
            }
        }
    }
}

const resetArcherFilters = () => {
    searchArcherQuery.value = ''
    filterArcherClub.value = ''
    filterArcherGender.value = 'all'
    searchArchers()
}

const form = reactive({
    category_ids: [],
    payment_status: 'paid',
    payment_amount: 0,
    registration_source: 'invitation',
    notes: ''
})

const newArcherForm = reactive({
    full_name: '',
    username: '',
    id: '',
    email: '',
    password: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    bow_type: '',
    city: '',
    school: '',
    club_id: '',
    address: '',
    avatar_url: '',
    custom_fields: {}
})

const genderOptions = computed(() => [
    { title: t('dashboard_events_participants_add.gender_placeholder', '-- Pilih Jenis Kelamin --'), value: '' },
    { title: t('dashboard_events_participants_add.gender_male', 'Laki-laki'), value: 'male' },
    { title: t('dashboard_events_participants_add.gender_female', 'Perempuan'), value: 'female' }
])

const bowOptions = computed(() => [
    { title: t('dashboard_events_participants_add.bow_type_placeholder'), value: '' },
    { title: 'Standard', value: 'standard' },
    { title: 'Recurve', value: 'recurve' },
    { title: 'Compound', value: 'compound' },
    { title: 'Barebow', value: 'barebow' },
    { title: 'Traditional', value: 'traditional' }
])

const paymentStatusOptions = computed(() => [
    { title: t('dashboard_events_participants_add.payment_status_paid'), value: 'paid' },
    { title: t('dashboard_events_participants_add.payment_status_pending'), value: 'pending' }
])

const sourceOptions = computed(() => [
    { title: t('dashboard_events_participants_add.source_options.self_registration', 'Pendaftaran Mandiri'), value: 'self_registration' },
    { title: t('dashboard_events_participants_add.source_options.invitation', 'Undangan Panitia'), value: 'invitation' },
    { title: t('dashboard_events_participants_add.source_options.delegation', 'Delegasi Klub'), value: 'delegation' }
])

const isSearchingArchers = ref(false)
const existingParticipants = ref([])

const existingArcherSet = computed(() => {
    const set = new Set()
    for (const p of existingParticipants.value) {
        if (p.archer_id) set.add(String(p.archer_id).toLowerCase().trim())
        if (p.user_id) set.add(String(p.user_id).toLowerCase().trim())
        if (p.athlete_id) set.add(String(p.athlete_id).toLowerCase().trim())
        if (p.id) set.add(String(p.id).toLowerCase().trim())
        if (p.uuid) set.add(String(p.uuid).toLowerCase().trim())
        if (p.email) set.add(String(p.email).toLowerCase().trim())
        if (p.athlete_code) set.add(String(p.athlete_code).toLowerCase().trim())
        if (p.full_name) set.add(String(p.full_name).toLowerCase().trim())
    }
    return set
})

const filteredArchers = computed(() => {
    const registered = existingArcherSet.value
    return (archers.value || []).filter(archer => {
        const id = String(archer.id || '').toLowerCase().trim()
        const uuid = String(archer.uuid || '').toLowerCase().trim()
        const userId = String(archer.user_id || '').toLowerCase().trim()
        const email = String(archer.email || '').toLowerCase().trim()
        const code = String(archer.athlete_code || '').toLowerCase().trim()
        const name = String(archer.full_name || '').toLowerCase().trim()

        if (id && registered.has(id)) return false
        if (uuid && registered.has(uuid)) return false
        if (userId && registered.has(userId)) return false
        if (email && registered.has(email)) return false
        if (code && registered.has(code)) return false
        if (name && registered.has(name)) return false

        if (filterArcherGender.value && filterArcherGender.value !== 'all') {
            const g = (archer.gender || '').toLowerCase()
            if (filterArcherGender.value === 'male' && g !== 'male' && g !== 'men') return false
            if (filterArcherGender.value === 'female' && g !== 'female' && g !== 'women') return false
        }

        if (filterArcherClub.value && filterArcherClub.value !== 'all' && filterArcherClub.value !== '') {
            const cId = String(archer.club_id || '').toLowerCase()
            const cName = String(archer.club_name || '').toLowerCase()
            const target = String(filterArcherClub.value).toLowerCase()
            if (cId !== target && !cName.includes(target)) return false
        }

        return true
    })
})

const fetchExistingParticipants = async () => {
    try {
        const res = await get(`/tournaments/${route.params.id}/participants?limit=1000`)
        existingParticipants.value = res?.participants || res?.data || (Array.isArray(res) ? res : [])
    } catch (err) {
        console.error('Failed to fetch existing event participants:', err)
        existingParticipants.value = []
    }
}

const getCategoryName = (cat) => {
    if (!cat) return ''
    return `${cat.division_name || cat.division || ''} - ${cat.category_name || cat.category || cat.age_category || cat.class_category || ''} ${cat.event_type_name ? '- ' + cat.event_type_name : ''} ${cat.gender_division_name ? '- ' + cat.gender_division_name : ''}`.trim().replace(/\s+/g, ' ') || t('dashboard_events_participants_add.competition_category')
}

const toggleCategory = (categoryId) => {
    if (!Array.isArray(form.category_ids)) form.category_ids = []
    const index = form.category_ids.indexOf(categoryId)
    if (index === -1) form.category_ids.push(categoryId)
    else form.category_ids.splice(index, 1)
}

const selectedCategories = computed(() => {
    if (!Array.isArray(form.category_ids) || form.category_ids.length === 0) return []
    return categories.value.filter(c => form.category_ids.includes(c.id || c.uuid))
})

const clubOptions = computed(() => {
    return [
        { title: t('dashboard_events_participants_add.select_club_placeholder'), value: '' },
        ...clubs.value.map(club => ({
            title: club.name,
            value: club.uuid
        }))
    ]
})

const filterClubOptions = computed(() => {
    return [
        { title: t('dashboard_events_participants_add.all_clubs', 'Semua Klub / Kontingen'), value: '' },
        ...clubs.value.map(club => ({
            title: club.name,
            value: club.uuid || club.id
        }))
    ]
})

const fetchEventDetails = async () => {
    try {
        const eventRes = await get(`/tournaments/${route.params.id}`)
        event.value = eventRes
        if (eventRes) {
            setEvent(eventRes)
        }
    } catch (error) {
        console.error('Failed to fetch event details:', error)
    }
}

const searchArchers = async () => {
    isSearchingArchers.value = true
    try {
        let url = `/archers?limit=500`
        if (searchArcherQuery.value && searchArcherQuery.value.trim() !== '') {
            url += `&search=${encodeURIComponent(searchArcherQuery.value.trim())}`
        }
        if (filterArcherClub.value && filterArcherClub.value !== '') {
            url += `&club_id=${encodeURIComponent(filterArcherClub.value)}`
        }
        if (filterArcherGender.value && filterArcherGender.value !== 'all') {
            url += `&gender=${encodeURIComponent(filterArcherGender.value)}`
        }
        const response = await get(url)
        archers.value = response?.archers || response?.data || (Array.isArray(response) ? response : [])
    } catch (error) {
        console.error('Failed to search archers:', error)
        archers.value = []
    } finally {
        isSearchingArchers.value = false
    }
}

const fetchCategories = async () => {
    try {
        const response = await get(`/tournaments/${route.params.id}/categories`)
        const cats = response?.events || response?.categories || []

        // Sort by participant_count descending
        cats.sort((a, b) => (b.participant_count || 0) - (a.participant_count || 0))

        categories.value = cats
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

const fetchClubs = async () => {
    try {
        const response = await get('/clubs?limit=100')
        clubs.value = response?.data || []
    } catch (error) {
        console.error('Failed to fetch clubs:', error)
    }
}

const fetchCities = async () => {
    try {
        const response = await get('/cities')
        const data = response?.data || []
        cityOptions.value = data.map(c => ({ title: c.name, value: c.name }))
    } catch (error) {
        console.error('Failed to fetch cities:', error)
    }
}

const fetchCustomFields = async () => {
    try {
        const res = await get(`/tournaments/${route.params.id}/custom-fields`)
        customFields.value = res?.fields || []
    } catch (error) {
        console.error('Failed to fetch custom fields:', error)
        customFields.value = []
    }
}

const areRequiredCustomFieldsFilled = (answers, fields) => {
    if (!fields || fields.length === 0) return true
    for (const f of fields) {
        if (f.is_active && f.is_required) {
            const val = answers?.[f.field_key] ?? answers?.[f.uuid]
            if (val === undefined || val === null || val === '') return false
            if (Array.isArray(val) && val.length === 0) return false
        }
    }
    return true
}

const selectArcher = (archer) => {
    selectedArcher.value = archer
}

const toggleArcher = (archer) => {
    const archerId = archer.uuid || archer.id
    const index = selectedArchers.value.findIndex(a => (a.uuid || a.id) === archerId)
    if (index > -1) {
        selectedArchers.value.splice(index, 1)
    } else {
        selectedArchers.value.push(archer)
    }
}

const removeArcher = (index) => {
    selectedArchers.value.splice(index, 1)
}

const isArcherSelected = (archer) => {
    const archerId = archer.uuid || archer.id
    return selectedArchers.value.some(a => (a.uuid || a.id) === archerId)
}

const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD'
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

const generateUsername = () => {
    if (!newArcherForm.full_name.trim()) {
        newArcherForm.username = ''
        return
    }
    let username = newArcherForm.full_name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

    newArcherForm.username = username
}

const getArcherClubName = (archer) => {
    if (archer.club_name) return archer.club_name
    if (archer.club_id) {
        const found = clubs.value.find(c => (c.uuid || c.id) === archer.club_id)
        if (found) return found.name
    }
    return t('dashboard_events_participants_add.no_club')
}

const getGenderLabel = (gender) => {
    if (!gender) return ''
    const g = String(gender).toLowerCase().trim()
    if (g === 'male' || g === 'men' || g === 'm' || g === 'putra' || g === 'laki-laki') {
        return t('participant.detail.gender_male', 'Laki-laki')
    }
    if (g === 'female' || g === 'women' || g === 'f' || g === 'putri' || g === 'perempuan') {
        return t('participant.detail.gender_female', 'Perempuan')
    }
    return gender
}

const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$'
    let pass = ''
    for (let i = 0; i < 10; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    newArcherForm.password = pass
}

const downloadCsvTemplate = () => {
    // Core columns
    const coreHeaders = ['full_name', 'email', 'phone', 'password', 'gender', 'club_name']
    
    // Filter active custom fields (exclude decorative types)
    const validCustomFields = (customFields.value || []).filter(f => 
        f.is_active && !['heading', 'divider', 'notice'].includes(f.element_type)
    )
    
    const customHeaderKeys = validCustomFields.map(f => f.field_key || f.uuid)
    const allHeaders = [...coreHeaders, ...customHeaderKeys]

    const getSampleCustomVal = (field, idx) => {
        if (field.field_type === 'number') return idx === 0 ? '123' : '456'
        if (field.field_type === 'select' || field.field_type === 'radio') {
            if (Array.isArray(field.options) && field.options.length > 0) return field.options[idx % field.options.length]
            return 'Pilihan 1'
        }
        if (field.field_type === 'checkbox') {
            if (Array.isArray(field.options) && field.options.length > 0) return field.options[0]
            return 'Ya'
        }
        if (field.field_type === 'date') return idx === 0 ? '2000-01-15' : '1998-07-22'
        return idx === 0 ? 'Contoh 1' : 'Contoh 2'
    }

    const row1Custom = validCustomFields.map(f => getSampleCustomVal(f, 0))
    const row2Custom = validCustomFields.map(f => getSampleCustomVal(f, 1))

    const row1 = ['Budi Santoso', 'budi@example.com', '081234567890', 'Archeris123!', 'M', 'Klub Panahan Sleman', ...row1Custom]
    const row2 = ['Siti Aminah', 'siti@example.com', '081298765432', 'Archeris123!', 'F', 'Archery Club Jogja', ...row2Custom]

    const csvLines = [
        allHeaders.join(','),
        row1.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','),
        row2.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    ]

    const csvContent = '\uFEFF' + csvLines.join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'template_import_peserta_archeris.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(t('dashboard_events_participants_add.download_template_success'))
}

const handleCsvParsed = (parsedArchers) => {
    if (!Array.isArray(parsedArchers) || parsedArchers.length === 0) return

    const existingEmails = new Set(
        selectedArchers.value
            .map(a => (a.email || '').trim().toLowerCase())
            .filter(Boolean)
    )

    let addedCount = 0
    let duplicateCount = 0

    for (const archer of parsedArchers) {
        const email = (archer.email || '').trim().toLowerCase()
        if (email && existingEmails.has(email)) {
            duplicateCount++
            continue
        }

        if (email) existingEmails.add(email)
        selectedArchers.value.push(archer)
        addedCount++
    }

    if (duplicateCount > 0) {
        toast.info(t('dashboard_events_participants_add.toasts.csv_duplicate_notice', { added: addedCount, duplicates: duplicateCount }))
    }
}

const addNewArcherToList = () => {
    if (!validateNewArcherForm()) return

    const inputEmail = newArcherForm.email.trim().toLowerCase()
    const isDuplicate = selectedArchers.value.some(
        a => (a.email || '').trim().toLowerCase() === inputEmail
    )

    if (isDuplicate) {
        toast.error(t('dashboard_events_participants_add.toasts.archer_already_in_list', { email: newArcherForm.email }))
        return
    }

    if (!areRequiredCustomFieldsFilled(newArcherForm.custom_fields, customFields.value)) {
        toast.warning(t('event_archer_fields.toasts.required_fields_warning') || 'Mohon lengkapi semua data persyaratan tambahan yang wajib diisi.')
        return
    }

    const tempId = `new-${Date.now()}`
    const newArcher = {
        id: tempId,
        uuid: tempId,
        full_name: newArcherForm.full_name,
        username: newArcherForm.username,
        email: newArcherForm.email.trim(),
        phone: newArcherForm.phone,
        password: newArcherForm.password,
        gender: newArcherForm.gender,
        club_id: newArcherForm.club_id,
        avatar_url: newArcherForm.avatar_url,
        custom_fields: { ...newArcherForm.custom_fields },
        is_new_profile: true
    }

    selectedArchers.value.push(newArcher)
    toast.success(t('dashboard_events_participants_add.archer_added_toast'))

    // Reset form
    newArcherForm.full_name = ''
    newArcherForm.username = ''
    newArcherForm.email = ''
    newArcherForm.phone = ''
    newArcherForm.password = ''
    newArcherForm.avatar_url = ''
    newArcherForm.custom_fields = {}
}

const validateNewArcherForm = () => {
    if (!newArcherForm.full_name.trim()) {
        toast.error(t('dashboard_events_participants_add.toasts.name_required'))
        return false
    }

    if (!newArcherForm.email || !newArcherForm.email.trim()) {
        toast.error(t('dashboard_events_participants_add.email_required_toast'))
        return false
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(newArcherForm.email.trim())) {
        toast.error(t('dashboard_events_participants_add.toasts.email_invalid'))
        return false
    }

    if (!newArcherForm.password || !newArcherForm.password.trim()) {
        toast.error(t('dashboard_events_participants_add.password_required_toast'))
        return false
    }

    if (newArcherForm.password.trim().length < 6) {
        toast.error(t('dashboard_events_participants_add.password_min_toast'))
        return false
    }

    if (!newArcherForm.club_id) {
        toast.error(t('dashboard_events_participants_add.toasts.club_required'))
        return false
    }
    return true
}

const submit = async () => {
    if (!Array.isArray(form.category_ids) || form.category_ids.length === 0) {
        toast.error(t('dashboard_events_participants_add.toasts.category_required'))
        return
    }

    // If in 'new' mode and form is filled, automatically push to selectedArchers list
    if (archerMode.value === 'new' && newArcherForm.full_name.trim()) {
        if (!validateNewArcherForm()) return
        addNewArcherToList()
    }

    if (selectedArchers.value.length === 0) {
        toast.error(t('dashboard_events_participants_add.no_archers_selected_toast'))
        return
    }

    isSubmitting.value = true

    try {
        const existingArcherIds = []
        const createdArcherIds = []
        const archerCustomFieldsMap = {}

        // Process any newly created profiles first
        for (const archer of selectedArchers.value) {
            if (archer.is_new_profile) {
                let targetClubId = archer.club_id
                if (!targetClubId && archer.club_name && Array.isArray(clubs.value)) {
                    const matched = clubs.value.find(c =>
                        (c.name || '').trim().toLowerCase() === archer.club_name.trim().toLowerCase()
                    )
                    if (matched) {
                        targetClubId = matched.uuid || matched.id
                    }
                }

                const archerResponse = await post('/archers', {
                    full_name: archer.full_name,
                    username: archer.username || undefined,
                    email: archer.email || undefined,
                    password: archer.password || undefined,
                    phone: archer.phone || undefined,
                    club_id: targetClubId || undefined,
                    club_name: archer.club_name || undefined,
                    avatar_url: archer.avatar_url || undefined
                })
                const newId = archerResponse.uuid || archerResponse.archer_id || archerResponse.id
                if (newId) {
                    createdArcherIds.push(newId)
                    if (archer.custom_fields && Object.keys(archer.custom_fields).length > 0) {
                        archerCustomFieldsMap[newId] = archer.custom_fields
                    }
                }
            } else {
                const existingId = archer.uuid || archer.id
                existingArcherIds.push(existingId)
                if (archer.custom_fields && Object.keys(archer.custom_fields).length > 0) {
                    archerCustomFieldsMap[existingId] = archer.custom_fields
                }
            }
        }

        const allArcherIds = [...existingArcherIds, ...createdArcherIds]

        if (allArcherIds.length > 0) {
            const payload = {
                athlete_ids: allArcherIds,
                event_category_ids: form.category_ids,
                payment_amount: 0,
                payment_status: 'paid',
                registration_source: 'invitation',
                archer_custom_fields: archerCustomFieldsMap
            }
            const result = await post(`/tournaments/${route.params.id}/participants/batch`, payload)
            const count = result?.registered ?? 0
            const skipped = result?.skipped ?? 0
            const rejected = result?.rejected ?? []

            if (count > 0) {
                const msg = skipped > 0
                    ? t('dashboard_events_participants_add.toasts.batch_success_with_skipped', { count, skipped })
                    : t('dashboard_events_participants_add.toasts.batch_success', { count })
                toast.success(msg)
                router.push(`/dashboard/organizer/tournaments/${route.params.id}/participants`)
            } else if (rejected.length > 0) {
                const reasons = rejected.map(r => r.reason).filter(Boolean).slice(0, 2).join('; ')
                toast.error(reasons || t('dashboard_events_participants_add.toasts.save_failed'))
            } else if (skipped > 0) {
                toast.warning(t('dashboard_events_participants_add.all_already_registered', 'Semua pemanah yang dipilih sudah terdaftar'))
                router.push(`/dashboard/organizer/tournaments/${route.params.id}/participants`)
            } else {
                toast.success(t('dashboard_events_participants_add.toasts.batch_success', { count }))
                router.push(`/dashboard/organizer/tournaments/${route.params.id}/participants`)
            }
        }
    } catch (error) {
        console.error('Failed to add participant:', error)
        const errorMessage = error?.data?.error || error?.response?.data?.error || error?.response?._data?.error || error?.message || t('dashboard_events_participants_add.toasts.save_failed')
        toast.error(errorMessage)
    } finally {
        isSubmitting.value = false
    }
}

const handleAvatarSelect = (media) => {
    newArcherForm.avatar_url = media.url
}

let searchTimeout

watch([searchArcherQuery, filterArcherClub, filterArcherGender], () => {
    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }

    // throttle/debounce: wait briefly before querying API
    searchTimeout = setTimeout(() => {
        searchArchers()
    }, 350)
})

onMounted(() => {
    fetchExistingParticipants()
    searchArchers()
    fetchEventDetails()
    fetchCategories()
    fetchClubs()
    fetchCities()
    fetchCustomFields()
})

onBeforeUnmount(() => {
    clearEvent()
    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }
})
</script>

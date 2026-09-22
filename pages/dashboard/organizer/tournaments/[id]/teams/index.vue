<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <DashboardHeader
            :title="t('event_teams.title')"
            :subtitle="t('event_teams.subtitle')"
            icon="ph:users-three"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/organizer' },
                { label: t('events.list.title'), to: '/dashboard/organizer/tournaments' },
                { label: t('event_teams.title') }
            ]"
        >
            <template #actions>
                <div class="flex flex-wrap items-center gap-3 shrink-0" v-if="selectedCategory">
                    <BaseButton variant="white" icon="ph:arrows-clockwise"
                        class="h-10 sm:h-11 px-5 border-white/20 text-xs sm:text-sm font-bold"
                        :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                        @click="isSubscriptionActive ? handleSyncTeams() : (showPremiumModal = true)"
                        :loading="isSyncing">
                        {{ t('event_teams.auto_sync') }}
                    </BaseButton>
                    <BaseButton variant="primary" icon="ph:plus-bold"
                        class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-black tracking-widest"
                        :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                        @click="isSubscriptionActive ? openAddTeamModal() : (showPremiumModal = true)">
                        {{ t('event_teams.add_manual') }}
                    </BaseButton>
                </div>
            </template>
        </DashboardHeader>
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

        <!-- Category Selection -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
                <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                    <Icon icon="ph:folders-bold" class="text-xl" />
                </div>
                <h2 class="text-base font-black text-navy">{{ t('event_teams.select_category') }}</h2>
            </div>

            <div v-if="loadingCategories" class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <div v-for="i in 4" :key="i"
                    class="flex-shrink-0 w-72 p-5 rounded-xl border border-gray-100 animate-pulse">
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
                <div>{{ t('event_teams.category_not_found') }}</div>
            </div>

            <div v-else class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <button v-for="category in categories" :key="category.id" @click="selectCategory(category)" :class="[
                    'flex-shrink-0 w-72 p-5 rounded-xl border-2 transition-all text-left group hover:shadow-md relative',
                    selectedCategory?.id === category.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
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
                            <div class="font-bold text-navy group-hover:text-primary transition-colors leading-tight mb-1 line-clamp-2">
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
                                        {{ t('event_teams.no_teams_badge') }}
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
            <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div class="flex items-center gap-3">
                        <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                            <Icon icon="ph:users-three-bold" class="text-xl" />
                        </div>
                        <div>
                            <h2 class="text-lg font-black text-navy leading-tight">{{ t('event_teams.official_team_list') }}</h2>
                            <div class="text-sm text-gray-500 mt-1">{{ t('event_teams.team_list_desc') }}</div>
                        </div>
                    </div>
                </div>

                <div v-if="loadingTeams" class="space-y-4">
                    <div v-for="i in 3" :key="i" class="h-32 bg-gray-50 rounded-2xl animate-pulse"></div>
                </div>

                <div v-else-if="officialTeams.length === 0"
                    class="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div
                        class="size-20 bg-white shadow-sm rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                        <Icon icon="ph:users-four" class="text-4xl text-gray-200" />
                    </div>
                    <h3 class="text-xl font-bold text-navy mb-2">{{ t('event_teams.no_teams') }}</h3>
                    <div class="text-gray-400 max-w-sm mx-auto text-sm" v-html="t('event_teams.no_teams_desc')"></div>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="team in officialTeams" :key="team.id"
                        class="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-sm hover:shadow-navy/5 transition-all group border-b-4 border-b-gray-100 hover:border-b-primary relative">
                        <!-- Rank Badge -->
                        <div
                            class="absolute -top-3 -right-3 size-10 bg-navy text-white rounded-xl flex items-center justify-center font-black text-lg shadow-sm border-4 border-white group-hover:bg-primary group-hover:text-navy transition-colors">
                            {{ team.team_rank || '-' }}
                        </div>

                        <div class="flex items-start justify-between mb-6">
                            <div class="flex items-center gap-4">
                                <div
                                    class="size-14 bg-navy/5 rounded-2xl flex items-center justify-center text-navy group-hover:bg-primary group-hover:scale-110 transition-all">
                                    <Icon icon="ph:users-four-bold" class="text-3xl" />
                                </div>
                                <div>
                                    <h3
                                        class="font-black text-navy text-lg group-hover:text-primary transition-colors line-clamp-1">
                                        {{ team.team_name }}</h3>
                                </div>
                            </div>
                        </div>

                        <!-- Members list -->
                        <div class="space-y-3 mb-6 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            <div
                                class="text-[10px] font-black text-gray-400 tracking-widest mb-2 flex items-center gap-2">
                                <Icon icon="ph:identification-card-bold" />
                                {{ t('event_teams.members_and_scores') }}
                            </div>
                            <div v-if="team.members && team.members.length > 0">
                                <div v-for="(member, index) in team.members" :key="member.id || index"
                                    class="flex items-center justify-between group/member py-1">
                                    <div class="flex items-center gap-2 flex-1 min-w-0">
                                        <span class="text-xs font-black text-primary">{{ index + 1 }}</span>
                                        <span
                                            class="text-sm font-bold text-navy truncate group-hover/member:text-primary transition-colors">
                                            {{ member.full_name || '-' }}
                                        </span>
                                    </div>
                                    <span
                                        class="px-2 py-0.5 bg-white border border-gray-100 rounded-md  text-xs font-black text-navy shadow-sm">
                                        {{ member.total_score || 0 }}
                                    </span>
                                </div>
                            </div>
                            <div v-else class="text-sm text-gray-400 italic">{{ t('event_teams.no_members') }}</div>
                        </div>

                        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div class="flex items-center gap-1.5">
                                <NuxtLink :to="`/dashboard/organizer/tournaments/${eventId}/teams/${team.id}`"
                                    class="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-navy/5"
                                    :title="t('org_team_detail.team_detail')">
                                    <Icon icon="ph:eye-bold" class="text-lg" />
                                </NuxtLink>
                                <button @click="isSubscriptionActive ? openEditTeamModal(team) : (showPremiumModal = true)"
                                    class="p-2 text-gray-400 hover:text-navy transition-colors rounded-lg hover:bg-gray-100">
                                    <Icon icon="ph:pencil-simple" class="text-lg" />
                                </button>
                                <button @click="isSubscriptionActive ? (teamToDelete = team, showDeleteConfirm = true) : (showPremiumModal = true)"
                                    class="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                                    <Icon icon="ph:trash" class="text-lg" />
                                </button>
                            </div>
                            <div class="flex flex-col items-end">
                                <span class="text-[10px] font-black text-gray-400 tracking-widest">{{ t('event_teams.total_score') }}</span>
                                <span class="text-xl font-black text-navy">{{ team.total_score }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Team Modal (Manual) -->
        <BaseDialogForm v-model="showTeamModal" size="lg" @close="showTeamModal = false">
            <template #header>
                <div class="flex items-center gap-3">
                    <div class="size-10 bg-navy rounded-xl flex items-center justify-center text-primary shrink-0 shadow-sm">
                        <Icon :icon="isEditing ? 'ph:pencil-simple-bold' : 'ph:users-three-bold'" class="text-xl" />
                    </div>
                    <div>
                        <h2 class="text-lg font-black text-navy leading-tight">{{ isEditing ? t('event_teams.edit_team_detail') : t('event_teams.add_team_manual') }}</h2>
                        <div class="text-[11px] font-medium text-gray-400">{{ teamForm.team_name || t('event_teams.new_team') }}</div>
                    </div>
                </div>
            </template>
            <div class="space-y-6">
                <!-- Section 1: Identitas Tim -->
                <div class="space-y-3">
                    <h3 class="text-xs font-black text-navy flex items-center gap-2">
                        <Icon icon="ph:identification-card-bold" class="text-navy text-base" />
                        {{ t('event_teams.identity_and_category') }}
                    </h3>

                    <div class="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 space-y-4">
                        <BaseInput v-model="teamForm.team_name" :label="t('event_teams.team_name')" :placeholder="t('event_teams.team_name_placeholder')"
                            required icon="ph:users-four" />

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Editing: lock category and club as read-only -->
                            <template v-if="isEditing">
                                <div class="space-y-1.5">
                                    <label class="block text-xs font-bold text-gray-500">{{ t('event_teams.category_label') }}</label>
                                    <div
                                        class="h-11 px-3.5 flex items-center rounded-xl bg-white border border-gray-200 text-sm font-bold text-navy shadow-sm">
                                        <Icon icon="ph:lock-simple" class="text-gray-400 mr-2 shrink-0" />
                                        {{getCategoryName(categories.find(c => c.id === teamForm.category_id)) || teamForm.category_id}}
                                    </div>
                                </div>
                                <div class="space-y-1.5">
                                    <label class="block text-xs font-bold text-gray-500">{{ t('event_teams.club') }}</label>
                                    <div
                                        class="h-11 px-3.5 flex items-center rounded-xl bg-white border border-gray-200 text-sm font-bold text-navy shadow-sm">
                                        <Icon icon="ph:lock-simple" class="text-gray-400 mr-2 shrink-0" />
                                        {{ teamForm.club_name || '—' }}
                                    </div>
                                </div>
                            </template>
                            <!-- Adding: show dropdowns -->
                            <template v-else>
                                <BaseSelect v-model="teamForm.category_id" :items="mappedCategories" :label="t('event_teams.category_label')"
                                    :placeholder="t('event_teams.select_category_placeholder')" @update:modelValue="onModalCategoryChange" searchable />
                                <BaseSelect v-model="teamForm.club_name" :items="mappedClubs" :label="t('event_teams.club')"
                                    :placeholder="t('event_teams.select_club_placeholder')" :disabled="!teamForm.category_id || loadingParticipants"
                                    @update:modelValue="onModalClubChange" searchable />
                            </template>
                        </div>

                        <!-- Mixed Team Notice -->
                        <div v-if="modalCategoryInfo?.event_type_name?.toLowerCase().includes('mixed')"
                            class="flex items-center gap-2 p-3 bg-blue-50/80 border border-blue-200/60 rounded-xl text-xs text-blue-800 font-medium">
                            <Icon icon="ph:info-bold" class="text-blue-600 text-base shrink-0" />
                            <span>{{ t('event_teams.mixed_team_notice') }}</span>
                        </div>
                    </div>
                </div>

                <!-- Section 2: Pemilihan Anggota -->
                <div class="space-y-3 pt-3 border-t border-gray-100" v-if="teamForm.club_name || isEditing">
                    <div class="flex items-center justify-between">
                        <h3 class="text-xs font-black text-navy flex items-center gap-2">
                            <Icon icon="ph:users-four-bold" class="text-navy text-base" />
                            {{ t('event_teams.select_members', { current: teamForm.member_ids.length, max: maxMembers }) }}
                        </h3>
                        <span v-if="teamForm.member_ids.length === maxMembers"
                            class="text-[10px] bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full font-black">
                            {{ t('event_teams.slot_full') }}
                        </span>
                    </div>

                    <div v-if="loadingParticipants" class="py-12 text-center">
                        <LoadingSpinner />
                        <div class="text-xs text-gray-400 mt-2">{{ t('event_teams.loading_archers') }}</div>
                    </div>

                    <div v-else-if="!teamForm.club_name"
                        class="py-10 text-center bg-gray-50/80 rounded-2xl border border-dashed border-gray-200">
                        <div class="size-12 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-xs border border-gray-100 text-navy">
                            <Icon icon="ph:buildings" class="text-2xl text-gray-400" />
                        </div>
                        <div class="text-xs font-bold text-gray-600">{{ t('event_teams.please_select_club') }}</div>
                        <div class="text-[11px] text-gray-400 mt-0.5">{{ t('event_teams.same_club_rule') }}</div>
                    </div>

                    <div v-else-if="filteredParticipants.length > 0"
                        class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        <template v-for="(participant, index) in filteredParticipants" :key="participant.id">
                            <label
                                class="group relative flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden"
                                :class="teamForm.member_ids.includes(participant.id)
                                    ? 'border-navy bg-navy/5 shadow-sm'
                                    : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'">

                                <input type="checkbox" v-model="teamForm.member_ids" :value="participant.id"
                                    :disabled="!teamForm.member_ids.includes(participant.id) && teamForm.member_ids.length >= maxMembers"
                                    class="sr-only" />

                                <!-- Profile Image / Avatar -->
                                <div
                                    class="size-12 rounded-xl bg-gray-200 overflow-hidden shrink-0 border border-gray-100 group-hover:border-navy/30 transition-colors shadow-sm">
                                    <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)"
                                        class="w-full h-full object-cover" :alt="participant.full_name" />
                                </div>

                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between gap-1">
                                        <div class="text-[13px] font-black text-navy truncate group-hover:text-primary transition-colors flex-1">
                                            {{ participant.full_name }}
                                        </div>
                                        <span class="text-[10px] font-black text-navy bg-navy/10 px-1.5 py-0.5 rounded shrink-0">#{{ index + 1 }}</span>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-2 mt-1">
                                        <!-- Category Label (Debug) -->
                                        <div class="px-1.5 py-0.5 rounded-md text-[9px] font-black tracking-tighter bg-navy/5 text-navy/70">
                                            {{ participant.division_name }} {{ participant.category_name }}
                                        </div>
                                        <!-- Score Chip -->
                                        <div
                                            class="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-gray-200 rounded-md shadow-xs">
                                            <Icon icon="ph:crosshair-bold" class="text-navy text-[10px]" />
                                            <span class="text-[10px] font-black text-navy leading-none">
                                                {{ participant.total_score || 0 }}
                                            </span>
                                        </div>
                                        <!-- Gender Badge -->
                                        <div class="px-1.5 py-0.5 rounded-md text-[9px] font-black tracking-tighter leading-none"
                                            :class="participant.gender_division_name?.toLowerCase().includes('putra') || participant.gender_division_name?.toLowerCase().includes('men')
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'bg-pink-50 text-pink-600'">
                                            {{ participant.gender_division_name || 'N/A' }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Selection Status indicator -->
                                <div class="size-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0"
                                    :class="teamForm.member_ids.includes(participant.id)
                                        ? 'bg-navy border-navy text-primary'
                                        : 'bg-white border-gray-200 text-transparent'">
                                    <Icon icon="ph:check-bold" class="text-xs" />
                                </div>
                            </label>
                        </template>
                    </div>

                    <div v-else
                        class="py-12 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
                        <div
                            class="size-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                            <Icon icon="ph:user-focus-bold" class="text-3xl text-slate-400" />
                        </div>
                        <div class="text-sm font-bold text-gray-500">{{ t('event_teams.archers_not_found') }}</div>
                        <div class="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">
                            {{ t('event_teams.no_archers_registered_desc') }}
                        </div>
                    </div>
            </div>
        </div>

            <template #action>
                <div class="flex items-center justify-end gap-2.5 pt-1">
                    <BaseButton variant="white" @click="showTeamModal = false" class="px-5 font-bold text-sm">{{ t('event_teams.cancel') }}</BaseButton>
                    <BaseButton variant="primary" :loading="isSaving" @click="handleSaveTeam"
                        class="px-6 font-bold text-sm shadow-md shadow-primary/20 flex items-center gap-2"
                        :disabled="teamForm.member_ids.length < minMembers || !teamForm.team_name">
                        <Icon :icon="isEditing ? 'ph:check-bold' : 'ph:plus-bold'" class="text-base" />
                        {{ isEditing ? t('event_teams.save_changes') : t('event_teams.create_team') }}
                    </BaseButton>
                </div>
            </template>
        </BaseDialogForm>

        <!-- Delete Team Confirmation Dialog -->
        <BaseDialogForm v-model="showDeleteConfirm" size="sm" @close="showDeleteConfirm = false">
            <template #header>
                <div class="flex items-center gap-3">
                    <div class="size-10 bg-red-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
                        <Icon icon="ph:trash-bold" class="text-xl" />
                    </div>
                    <div>
                        <h2 class="text-lg font-black text-navy leading-tight">{{ t('event_teams.delete_team_confirm') }}</h2>
                        <div class="text-[11px] font-medium text-gray-400">{{ t('event_teams.delete_confirm_title') }}</div>
                    </div>
                </div>
            </template>

            <div class="space-y-4">
                <!-- Team Preview Card -->
                <div class="bg-gray-50/80 rounded-2xl border border-gray-100 p-4 space-y-2">
                    <div class="flex items-center gap-3">
                        <div class="size-9 rounded-xl bg-navy text-primary flex items-center justify-center shrink-0 shadow-xs">
                            <Icon icon="ph:users-four-bold" class="text-base" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <div class="text-sm font-black text-navy truncate">{{ teamToDelete?.team_name || t('event_teams.title') }}</div>
                            <div class="text-xs text-gray-500 truncate flex items-center gap-1.5 mt-0.5">
                                <span>{{ teamToDelete?.club_name || t('event_teams.club') }}</span>
                                <span>•</span>
                                <span>{{ t('event_teams.members_count', { count: teamToDelete?.members?.length || 0 }) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Warning Callout -->
                <div class="flex items-start gap-3 bg-red-50/60 border border-red-100 rounded-2xl p-3.5 text-xs text-red-700 leading-relaxed">
                    <Icon icon="ph:warning-circle-fill" class="text-red-500 text-base shrink-0 mt-0.5" />
                    <div v-html="t('event_teams.delete_warning', { name: teamToDelete?.team_name })"></div>
                </div>
            </div>

            <template #action>
                <div class="flex items-center justify-end gap-2.5 pt-1">
                    <BaseButton variant="white" @click="showDeleteConfirm = false" class="px-5 font-bold text-sm">
                        {{ t('event_teams.cancel') }}
                    </BaseButton>
                    <BaseButton variant="primary" :loading="isDeleting" @click="executeDeleteTeam"
                        class="px-5 bg-red-600 hover:bg-red-700 border-red-600 text-white shadow-md shadow-red-200 font-bold text-sm flex items-center gap-2">
                        <Icon icon="ph:trash-bold" class="text-base" />
                        {{ t('event_teams.yes_delete') }}
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
                        <h2 class="text-lg font-black text-navy leading-tight">{{ t('event_teams.sync_teams_confirm') }}</h2>
                        <div class="text-[11px] font-medium text-gray-400">{{ t('event_teams.auto_sync') }}</div>
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
                            <div class="text-[11px] font-bold text-gray-400">{{ t('event_teams.category_label') }}</div>
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
                        {{ t('event_teams.how_sync_works') }}
                    </div>
                    <ul class="text-xs text-gray-600 space-y-2 pl-1">
                        <li class="flex items-start gap-2">
                            <span class="size-4 rounded-full bg-navy/10 text-navy font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                            <span>{{ t('event_teams.sync_step_1') }}</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="size-4 rounded-full bg-navy/10 text-navy font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                            <span v-html="t('event_teams.sync_step_2', { count: maxMembers })"></span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="size-4 rounded-full bg-navy/10 text-navy font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                            <span>{{ t('event_teams.sync_step_3') }}</span>
                        </li>
                    </ul>
                </div>

                <!-- Warning Notice -->
                <div class="flex items-start gap-3 bg-amber-50/80 border border-amber-200/70 rounded-2xl p-3.5 text-xs text-amber-900 leading-relaxed">
                    <Icon icon="ph:warning-circle-fill" class="text-amber-500 text-base shrink-0 mt-0.5" />
                    <div>
                        <span class="font-bold block mb-0.5">{{ t('event_teams.destructive_action') }}</span>
                        <span>{{ t('event_teams.sync_warning') }}</span>
                    </div>
                </div>
            </div>

            <template #action>
                <div class="flex items-center justify-end gap-2.5 pt-1">
                    <BaseButton variant="white" @click="showSyncConfirm = false" class="px-5 font-bold text-sm">
                        {{ t('event_teams.cancel') }}
                    </BaseButton>
                    <BaseButton variant="primary" :loading="isSyncing" @click="executeSyncTeams"
                        class="px-6 font-bold text-sm shadow-md shadow-primary/20 flex items-center gap-2">
                        <Icon icon="ph:arrows-clockwise-bold" class="text-base" />
                        {{ t('event_teams.yes_sync') }}
                    </BaseButton>
                </div>
            </template>
        </BaseDialogForm>
    </div>
</template>

<script setup>
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
    title: () => `${eventName.value && eventName.value !== 'Loading...' ? eventName.value + ' - ' : ''}${t('event_teams.title')} - Archeris Dashboard`
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

const teamForm = reactive({
    team_name: '',
    member_ids: [],
    category_id: '',
    club_name: ''
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
        description: cat.event_type_name || ''
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
            description: count > 0 ? t('event_teams.archers_available', { count }) : t('event_teams.no_archers_available')
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
            title: t('event_teams.independent'),
            value: 'Independen',
            icon: 'ph:user',
            description: t('event_teams.no_club_archers')
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
        mainReason = t('event_teams.no_mixed_pairs_reason')
    } else if (details.reason_code === 'missing_individual_categories') {
        mainReason = t('event_teams.missing_individual_categories_reason')
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
            toast.success(response?.message
                ? `${response.message}. ${t('event_teams.toast_sync_count', { count: syncCount })}`
                : t('event_teams.toast_sync_success', { count: syncCount }))
        } else {
            toast.error(detailMessage || t('event_teams.toast_sync_no_teams'))
        }

        await fetchTeams(selectedCategory.value.id)
    } catch (error) {
        console.error('Failed to sync teams:', error)
        const errorMessage = error?.data?.error || error?.data?.details?.reason || error?.data?.message || error?.message || t('event_teams.toast_sync_failed')
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

const openEditTeamModal = (team) => {
    if (!team) return
    isEditing.value = true
    currentTeamId.value = team.id
    teamForm.team_name = team.team_name || ''
    teamForm.category_id = team.category_id || selectedCategory.value?.id || ''
    if (team.members && team.members.length > 0) {
        teamForm.club_name = team.members[0].club_name || ''
    }
    teamForm.member_ids = team.members?.map(m => m.participant_id) ?? []
    // participants already loaded by selectCategory — no need to re-fetch
    showTeamModal.value = true
}

const handleSaveTeam = async () => {
    if (!teamForm.team_name) {
        toast.error(t('event_teams.toast_team_name_required'))
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
            toast.error(t('event_teams.toast_mixed_gender_required'))
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
            toast.success(t('event_teams.toast_team_updated'))
        } else {
            await post(`/teams/event/${eventId.value}`, payload)
            toast.success(t('event_teams.toast_team_created'))
        }

        showTeamModal.value = false
        if (selectedCategory.value?.id) {
            await fetchTeams(selectedCategory.value.id)
        }
    } catch (error) {
        console.error('Failed to save team:', error)
        const errMsg = error?.data?.error || error?.response?.data?.error || error?.message || t('event_teams.toast_team_save_failed')
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
        toast.success(t('event_teams.toast_team_deleted'))
        showDeleteConfirm.value = false
        teamToDelete.value = null
        if (selectedCategory.value?.id) {
            await fetchTeams(selectedCategory.value.id)
        }
    } catch (error) {
        console.error('Failed to delete team:', error)
        const errMsg = error?.data?.error || error?.response?.data?.error || error?.message || t('event_teams.toast_team_delete_failed')
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

    // De-duplicate words while preserving order (e.g., avoid "Mixed Mixed Team")
    const words = []
    const seen = new Set()

    parts.forEach(part => {
        const text = typeof part === 'object' && part !== null ? (part.String || '') : String(part || '')
        if (!text) return
        text.split(' ').forEach(word => {
            const lowerWord = word.trim().toLowerCase()
            if (lowerWord && !seen.has(lowerWord)) {
                words.push(word.trim())
                seen.add(lowerWord)
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

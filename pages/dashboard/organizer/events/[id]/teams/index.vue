<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <DashboardHeader
            :title="t('event_teams.title', 'Tim & Beregu')"
            :subtitle="t('event_teams.subtitle', 'Kelola tim resmi, anggota beregu, dan sinkronisasi otomatis per kategori.')"
            icon="ph:users-three"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/organizer' },
                { label: t('events.list.title', 'Event Saya'), to: '/dashboard/organizer/events' },
                { label: t('event_teams.title', 'Tim & Beregu') }
            ]"
        >
            <template #actions>
                <div class="flex flex-wrap items-center gap-3 shrink-0" v-if="selectedCategory">
                    <BaseButton variant="white" icon="ph:arrows-clockwise"
                        class="h-10 sm:h-11 px-5 border-white/20 text-xs sm:text-sm font-bold"
                        :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                        @click="isSubscriptionActive ? handleSyncTeams() : (showPremiumModal = true)"
                        :loading="isSyncing">
                        {{ t('event_teams.auto_sync', 'Sinkron Tim') }}
                    </BaseButton>
                    <BaseButton variant="primary" icon="ph:plus-bold"
                        class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-black tracking-widest"
                        :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                        @click="isSubscriptionActive ? openAddTeamModal() : (showPremiumModal = true)">
                        {{ t('event_teams.add_manual', 'Tambah Tim') }}
                    </BaseButton>
                </div>
            </template>
        </DashboardHeader>
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

        <!-- Category Selection -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 class="text-base font-black text-navy mb-4">{{ t('event_teams.select_category') }}</h2>

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
                            class="size-12 bg-navy rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden p-2 group-hover:bg-primary transition-colors">
                            <img :src="'/' + getCategoryIcon(`${category.division_name} ${category.event_type_name} ${category.gender_division_name}`)"
                                :alt="category.division_name"
                                class="w-full h-full object-contain invert group-hover:invert-0 transition-all" />
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
                                        Belum ada tim
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
                    <div>
                        <h2 class="text-lg font-black text-navy leading-tight">{{ t('event_teams.official_team_list') }}</h2>
                        <div class="text-sm text-gray-500 mt-1">{{ t('event_teams.team_list_desc') }}</div>
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
                            <div class="flex gap-2">
                                <button @click="isSubscriptionActive ? openEditTeamModal(team) : (showPremiumModal = true)"
                                    class="p-2 text-gray-400 hover:text-navy transition-colors">
                                    <Icon icon="ph:pencil-simple" class="text-lg" />
                                </button>
                                <button @click="isSubscriptionActive ? (teamToDelete = team, showDeleteConfirm = true) : (showPremiumModal = true)"
                                    class="p-2 text-gray-400 hover:text-red-500 transition-colors">
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
        <BaseDialogForm v-model="showTeamModal" @close="showTeamModal = false">
            <template #header>
                <div class="flex items-center gap-3">
                    <div class="size-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy shrink-0">
                        <Icon :icon="isEditing ? 'ph:pencil-circle-bold' : 'ph:users-three-bold'" class="text-xl text-navy" />
                    </div>
                    <div class="flex flex-col -space-y-1">
                        <h2 class="text-xl font-black text-navy tracking-tighter">{{ isEditing ? t('event_teams.edit_team_detail') : t('event_teams.add_team_manual') }}</h2>
                        <div class="text-[10px] font-bold text-gray-400 tracking-widest">{{ teamForm.team_name || t('event_teams.new_team') }}</div>
                    </div>
                </div>
            </template>
            <div class="space-y-8">
                <!-- Section 1: Identitas Tim -->
                <div class="space-y-4">
                    <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2">
                        <Icon icon="ph:identification-card-bold" class="text-primary text-lg" />
                        {{ t('event_teams.identity_and_category') }}
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                        <div class="md:col-span-2">
                             <BaseInput v-model="teamForm.team_name" :label="t('event_teams.team_name')" :placeholder="t('event_teams.team_name_placeholder')"
                                required icon="ph:users-four" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Editing: lock category and club as read-only -->
                        <template v-if="isEditing">
                            <div class="space-y-1.5">
                                <label class="block text-xs font-bold text-gray-500 tracking-widest">{{ t('event_teams.category_label') }}</label>
                                <div
                                    class="h-10 px-3 flex items-center rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-navy">
                                    <Icon icon="ph:lock-simple" class="text-gray-400 mr-2 shrink-0" />
                                    {{getCategoryName(categories.find(c => c.id === teamForm.category_id)) ||
                                        teamForm.category_id}}
                                </div>
                            </div>
                            <div class="space-y-1.5">
                                <label
                                    class="block text-xs font-bold text-gray-500 tracking-widest">{{ t('event_teams.club') }}</label>
                                <div
                                    class="h-10 px-3 flex items-center rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-navy">
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
                </div>

                <!-- Section 2: Pemilihan Anggota -->
                <div class="space-y-4 pt-4 border-t border-gray-100" v-if="teamForm.club_name || isEditing">
                    <div class="flex items-center justify-between">
                        <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2">
                            <Icon icon="ph:users-four-bold" class="text-primary text-lg" />
                            {{ t('event_teams.select_members', { current: teamForm.member_ids.length, max: maxMembers }) }}
                        </h3>
                        <span v-if="teamForm.member_ids.length === maxMembers"
                            class="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-black tracking-widest animate-pulse">
                            {{ t('event_teams.slot_full') }}
                        </span>
                    </div>

                    <div v-if="loadingParticipants" class="py-12 text-center">
                        <LoadingSpinner />
                        <div class="text-xs text-gray-400 mt-2">{{ t('event_teams.loading_archers') }}</div>
                    </div>

                    <div v-else-if="!teamForm.club_name"
                        class="py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <div class="size-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                            <Icon icon="ph:buildings" class="text-3xl text-gray-300" />
                        </div>
                        <div class="text-sm font-bold text-gray-500">{{ t('event_teams.please_select_club') }}</div>
                        <div class="text-xs text-gray-400 mt-1">{{ t('event_teams.same_club_rule') }}</div>
                    </div>

                    <div v-else-if="filteredParticipants.length > 0"
                        class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        <template v-for="(participant, index) in filteredParticipants" :key="participant.id">
                            <label
                                class="group relative flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden"
                                :class="teamForm.member_ids.includes(participant.id)
                                    ? 'border-primary bg-primary/5 shadow-sm'
                                    : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'">

                                <input type="checkbox" v-model="teamForm.member_ids" :value="participant.id"
                                    :disabled="!teamForm.member_ids.includes(participant.id) && teamForm.member_ids.length >= maxMembers"
                                    class="sr-only" />

                                <!-- Profile Image / Avatar -->
                                <div
                                    class="size-12 rounded-xl bg-gray-200 overflow-hidden shrink-0 border border-gray-100 group-hover:border-primary/30 transition-colors shadow-sm">
                                    <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)"
                                        class="w-full h-full object-cover" :alt="participant.full_name" />
                                </div>

                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between gap-1">
                                        <div class="text-[13px] font-black text-navy truncate group-hover:text-primary transition-colors flex-1">
                                            {{ participant.full_name }}
                                        </div>
                                        <span class="text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">#{{ index + 1 }}</span>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-2 mt-1">
                                        <!-- Category Label (Debug) -->
                                        <div class="px-1.5 py-0.5 rounded-md text-[9px] font-black tracking-tighter bg-navy/5 text-navy/60">
                                            {{ participant.division_name }} {{ participant.category_name }}
                                        </div>
                                        <!-- Score Chip -->
                                        <div
                                            class="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-gray-100 rounded-md shadow-sm">
                                            <Icon icon="ph:crosshair-bold" class="text-primary text-[10px]" />
                                            <span class="text-[10px] font-black text-navy leading-none">
                                                {{ participant.total_score || 0 }}
                                            </span>
                                        </div>
                                        <!-- Gender Badge -->
                                        <div class="px-1.5 py-0.5 rounded-md text-[9px] font-black tracking-tighter leading-none"
                                            :class="participant.gender_division_name?.toLowerCase().includes('putra') || participant.gender_division_name?.toLowerCase().includes('men')
                                                ? 'bg-blue-50 text-blue-500'
                                                : 'bg-pink-50 text-pink-500'">
                                            {{ participant.gender_division_name || 'N/A' }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Selection Status indicator -->
                                <div class="size-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0"
                                    :class="teamForm.member_ids.includes(participant.id)
                                        ? 'bg-primary border-primary text-navy'
                                        : 'bg-white border-gray-100 text-transparent'">
                                    <Icon icon="ph:check-bold" class="text-sm" />
                                </div>
                            </label>
                        </template>
                    </div>

                    <div v-else
                        class="py-12 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
                        <div
                            class="size-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                            <Icon icon="ph:user-search" class="text-3xl text-gray-300" />
                        </div>
                        <div class="text-sm font-bold text-gray-500">{{ t('event_teams.archers_not_found') }}</div>
                        <div class="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">
                            {{ t('event_teams.no_archers_registered_desc') }}
                        </div>
                    </div>
            </div>
        </div>

            <template #action>
                <div class="flex justify-end gap-3 pt-2">
                    <BaseButton variant="white" @click="showTeamModal = false" class="px-8">{{ t('event_teams.cancel') }}</BaseButton>
                    <BaseButton variant="primary" :loading="isSaving" @click="handleSaveTeam"
                        class="px-8 shadow-lg shadow-primary/20"
                        :disabled="teamForm.member_ids.length < minMembers || !teamForm.team_name">
                        {{ isEditing ? t('event_teams.save_changes') : t('event_teams.create_team') }}
                    </BaseButton>
                </div>
            </template>
        </BaseDialogForm>

        <!-- Delete Team Confirmation Dialog -->
        <BaseDialogForm v-model="showDeleteConfirm" @close="showDeleteConfirm = false">
            <template #header>
                <div class="flex items-center gap-3">
                    <div class="size-10 bg-red-50 rounded-xl flex items-center justify-center shadow-inner">
                        <Icon icon="ph:trash-bold" class="text-xl text-red-600" />
                    </div>
                    <h2 class="text-xl font-black text-navy">{{ t('event_teams.delete_team_confirm') }}</h2>
                </div>
            </template>
            <div class="space-y-6">
                <div class="flex flex-col items-center text-center space-y-4">
                    <div class="size-20 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                        <Icon icon="ph:trash-bold" class="text-5xl" />
                    </div>
                    <div class="space-y-2">
                        <h3 class="text-lg font-black text-navy tracking-widest">{{ t('event_teams.delete_confirm_title') }}</h3>
                        <div class="text-sm text-gray-500 max-w-sm" v-html="t('event_teams.delete_warning', { name: teamToDelete?.team_name })"></div>
                    </div>
                </div>
            </div>
            <template #action>
                <div class="flex justify-end gap-3 pt-2">
                    <BaseButton variant="white" @click="showDeleteConfirm = false" class="px-8 font-bold">{{ t('event_teams.cancel') }}
                    </BaseButton>
                    <BaseButton variant="primary" :loading="isDeleting" @click="executeDeleteTeam"
                        class="px-8 bg-red-500 hover:bg-red-600 border-red-500 shadow-lg shadow-red-200 font-bold">
                        {{ t('event_teams.yes_delete') }}
                    </BaseButton>
                </div>
            </template>
        </BaseDialogForm>

        <!-- Sync Confirmation Dialog -->
        <BaseDialogForm v-model="showSyncConfirm" @close="showSyncConfirm = false">
            <template #header>
                <div class="flex items-center gap-3">
                    <div class="size-10 bg-red-50 rounded-xl flex items-center justify-center shadow-inner">
                        <Icon icon="ph:arrows-clockwise-bold" class="text-xl text-red-600" />
                    </div>
                    <h2 class="text-xl font-black text-navy">{{ t('event_teams.sync_teams_confirm') }}</h2>
                </div>
            </template>
            <div class="space-y-6">
                <div class="flex flex-col items-center text-center space-y-4">
                    <div
                        class="size-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 animate-pulse">
                        <Icon icon="ph:warning-circle-bold" class="text-5xl" />
                    </div>
                    <div class="space-y-2">
                        <h3 class="text-lg font-black text-navy tracking-widest">{{ t('event_teams.destructive_action') }}</h3>
                        <div class="text-sm text-gray-500 max-w-sm">
                            {{ t('event_teams.sync_warning') }}
                        </div>
                    </div>
                </div>
            </div>

            <template #action>
                <div class="flex justify-end gap-3 pt-2">
                    <BaseButton variant="white" @click="showSyncConfirm = false" class="px-8 font-bold">{{ t('event_teams.cancel') }}
                    </BaseButton>
                    <BaseButton variant="primary" :loading="isSyncing" @click="executeSyncTeams"
                        class="px-8 bg-red-500 hover:bg-red-600 border-red-500 shadow-lg shadow-red-200 font-bold">
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
const eventId = route.params.id
const { get, post, put, delete: del } = useApi()
const toast = useToast()
const { t } = useI18n()
const { isSubscriptionActive } = useSubscription()
const showPremiumModal = ref(false)

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: computed(() => `${eventName.value && eventName.value !== 'Loading...' ? eventName.value + ' - ' : ''}${t('event_teams.title', 'Tim Beregu')} - Archeris Dashboard`)
})

// State Management
const eventName = ref('Loading...')
const categories = ref([])
const selectedCategory = ref(null)
const officialTeams = ref([])
const participants = ref([])
const globalClubs = ref([])

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
    if (!teamForm.category_id) return null
    return categories.value.find(c => c.id === teamForm.category_id)
})

// Computed Properties
const maxMembers = computed(() => {
    if (!modalCategoryInfo.value) return 3
    const type = modalCategoryInfo.value.event_type_name?.toLowerCase() || ''
    if (type.includes('mixed')) return 2
    return 3
})

const minMembers = computed(() => maxMembers.value)

const mappedCategories = computed(() => {
    return categories.value.map(cat => ({
        title: getCategoryName(cat),
        value: cat.id,
        description: cat.event_type_name
    }))
})

const mappedClubs = computed(() => {
    // 1. Group existing participants by club to see who is actually available
    const clubCounts = {}
    let hasIndependen = false

    participants.value.forEach(p => {
        const name = p.club_name?.trim()
        if (!name || name?.toLowerCase() === 'independen') {
            hasIndependen = true
        } else {
            clubCounts[name] = (clubCounts[name] || 0) + 1
        }
    })

    // 2. Map global clubs and add the count if they have participants
    const clubs = globalClubs.value.map(club => {
        const count = clubCounts[club.name] || 0
        return {
            title: club.name + (count > 0 ? ` (${count})` : ''),
            value: club.name,
            icon: 'ph:buildings',
            description: count > 0 ? t('event_teams.archers_available', { count }) : t('event_teams.no_archers_available')
        }
    })

    // 3. Sort so clubs with participants appear first
    clubs.sort((a, b) => {
        const countA = clubCounts[a.value] || 0
        const countB = clubCounts[b.value] || 0
        if (countA !== countB) return countB - countA
        return a.title.localeCompare(b.title)
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

// Removed clubList as we now use globalClubs for selection

const filteredParticipants = computed(() => {
    if (!teamForm.club_name) return []

    const selectedClub = teamForm.club_name.trim().toLowerCase()
    let list = [...participants.value]

    // Use a more robust filter that matches the mappedClubs logic
    list = list.filter(p => {
        const pClub = p.club_name?.trim() || 'Independen'
        return pClub.toLowerCase() === selectedClub
    })

    // Sort by score descending
    return list.sort((a, b) => (b.total_score || 0) - (a.total_score || 0))
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
        const response = await get(`/events/${eventId}`)
        eventName.value = response?.event?.name || response?.name || 'Event'
    } catch (error) {
        console.error('Failed to fetch event:', error)
    }
}

const fetchCategories = async () => {
    loadingCategories.value = true
    try {
        const response = await get(`/events/${eventId}/categories`)
        const data = response?.events || response?.categories || []
        // Filter out individual categories for Team management
        const teamCategories = data.filter(cat =>
            cat.event_type_name?.toLowerCase() !== 'individual'
        )

        // Sort by participant_count descending
        teamCategories.sort((a, b) => (b.participant_count || 0) - (a.participant_count || 0))

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
    selectedCategory.value = category
    await fetchTeams(category.id)
    await fetchParticipants(category.id)
}

const fetchTeams = async (categoryId) => {
    loadingTeams.value = true
    try {
        const response = await get(`/teams/event/${eventId}`, {
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
    loadingParticipants.value = true
    try {
        const response = await get(`/events/${eventId}/participants`, {
            params: {
                category_id: categoryId,
                payment_status: 'Terbayar',
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

    if (details.reason) {
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
            ? `${details.reason} (${extras.join(', ')})`
            : details.reason
    }

    return ''
}

const executeSyncTeams = async () => {
    isSyncing.value = true
    try {
        const response = await post(`/teams/event/${eventId}/sync`, {
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
    isEditing.value = true
    currentTeamId.value = team.id
    teamForm.team_name = team.team_name
    teamForm.category_id = team.category_id || selectedCategory.value?.id || ''
    if (team.members && team.members.length > 0) {
        teamForm.club_name = team.members[0].club_name
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
            await post(`/teams/event/${eventId}`, payload)
            toast.success(t('event_teams.toast_team_created'))
        }

        showTeamModal.value = false
        await fetchTeams(selectedCategory.value.id)
    } catch (error) {
        console.error('Failed to save team:', error)
        toast.error(t('event_teams.toast_team_save_failed'))
    } finally {
        isSaving.value = false
    }
}

const executeDeleteTeam = async () => {
    if (!teamToDelete.value) return
    isDeleting.value = true
    try {
        await del(`/teams/${teamToDelete.value.id}`)
        toast.success(t('event_teams.toast_team_deleted'))
        showDeleteConfirm.value = false
        teamToDelete.value = null
        await fetchTeams(selectedCategory.value.id)
    } catch (error) {
        console.error('Failed to delete team:', error)
        toast.error(t('event_teams.toast_team_delete_failed'))
    } finally {
        isDeleting.value = false
    }
}

const getCategoryName = (category) => {
    if (!category) return ''
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
        part.split(' ').forEach(word => {
            const lowerWord = word.toLowerCase()
            if (!seen.has(lowerWord)) {
                words.push(word)
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

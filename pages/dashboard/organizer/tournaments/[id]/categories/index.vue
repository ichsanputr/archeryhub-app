<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <DashboardHeader
            :title="t('event_categories.title')"
            :subtitle="t('event_categories.desc')"
            icon="ph:tag"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/organizer' },
                { label: t('events.list.title'), to: '/dashboard/organizer/tournaments' },
                { label: t('event_categories.title') }
            ]"
        >
            <template #actions>
                <div class="flex gap-3 flex-shrink-0">
                    <BaseButton variant="primary" icon="ph:plus-bold"
                        class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-black tracking-widest"
                        :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                        @click="isSubscriptionActive ? openCreateDialog() : (showPremiumModal = true)">
                        {{ t('event_categories.add_category') }}
                    </BaseButton>
                </div>
            </template>
        </DashboardHeader>
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

        <!-- Categories List (Unified DashboardDataTable) -->
        <DashboardDataTable
            :items="categories"
            :columns="tableColumns"
            :loading="isLoading"
            :searchable="false"
            count-icon="ph:tag-bold"
            :count-unit="t('event_categories.category_list')"
            :items-per-page="limit"
            :empty-title="t('event_categories.no_categories')"
            :empty-description="t('event_categories.no_categories_desc')"
            empty-icon="ph:tag-simple"
        >
            <!-- Inline Filters: Bow & Team Type Selects -->
            <template #inline-filters>
                <div class="flex items-center gap-2 flex-wrap">
                    <div class="w-40 sm:w-48">
                        <BaseSelect v-model="selectedBowType" :items="bowFilterOptions" :placeholder="t('event_categories.all_bows')" />
                    </div>
                    <div class="w-40 sm:w-48">
                        <BaseSelect v-model="selectedTeamType" :items="teamTypeFilterOptions" :placeholder="t('event_categories.all_team_types')" />
                    </div>
                </div>
            </template>

            <!-- Category Column Slot -->
            <template #item-category="{ item }">
                <div class="flex items-center gap-3.5 py-1">
                    <div class="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-2xs shrink-0 p-2 overflow-hidden">
                        <img :src="'/' + getCategoryIcon(`${item.division_name || ''} ${item.category_name || ''} ${item.event_type_name || ''} ${item.gender_division_name || ''}`)"
                            :alt="item.division_name"
                            class="w-full h-full object-contain" />
                    </div>
                    <div class="min-w-0">
                        <div class="font-bold text-xs sm:text-sm text-navy leading-snug">
                            {{ [item.division_name, item.category_name, item.event_type_name, item.gender_division_name].filter(s => s && s.trim() && s !== '-').join(' – ') }}
                        </div>
                        <div class="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                            <Icon icon="ph:calendar-blank-bold" class="text-[10px] text-slate-400" />
                            <span>{{ t('event_categories.created', { date: formatDate(item.created_at) }) }}</span>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Quota Column Slot -->
            <template #item-quota="{ item }">
                <div class="flex justify-center">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-xs font-bold text-navy">
                        <Icon icon="ph:users-bold" class="text-xs text-slate-400" />
                        <span>{{ item.max_participants || t('event_categories.unlimited') }}</span>
                    </span>
                </div>
            </template>

            <!-- Team Type Column Slot -->
            <template #item-team="{ item }">
                <div class="flex justify-center">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-navy/5 border border-navy/10 text-xs font-bold text-navy">
                        <Icon :icon="item.team_size > 1 ? 'ph:users-three-bold' : 'ph:user-bold'" class="text-xs text-navy/70" />
                        <span>{{ item.team_size > 1 ? t('event_categories.team_capacity', { count: item.team_size }) : 'Individu' }}</span>
                    </span>
                </div>
            </template>

            <!-- Status Column Slot -->
            <template #item-status="{ item }">
                <div class="flex justify-center">
                    <span :class="item.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'"
                        class="px-2.5 py-0.5 rounded-full text-[10px] font-black border tracking-wider">
                        {{ item.status === 'active' ? t('event_categories.status_active') : t('event_categories.status_inactive') }}
                    </span>
                </div>
            </template>

            <!-- Actions Column Slot -->
            <template #actions="{ item }">
                <div class="flex items-center justify-end gap-1.5">
                    <BaseButton variant="white" size="sm" icon="ph:eye" :title="t('event_categories.view_participants')"
                        :to="`/dashboard/organizer/tournaments/${eventId}/categories/${item.id}`">
                        {{ t('event_categories.view') }}
                    </BaseButton>
                    <BaseButton variant="white" size="sm" icon="ph:pencil"
                        @click="isSubscriptionActive ? openEditDialog(item) : (showPremiumModal = true)">
                        {{ t('event_categories.edit') }}
                    </BaseButton>
                    <button @click="isSubscriptionActive ? deleteCategory(item) : (showPremiumModal = true)"
                        class="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        :title="t('event_categories.delete_category')">
                        <Icon icon="ph:trash-bold" class="text-base" />
                    </button>
                </div>
            </template>
        </DashboardDataTable>

        <!-- Create/Edit Dialog -->
        <BaseDialogForm v-model="showDialog" :header="editingCategory ? t('event_categories.edit_category') : t('event_categories.add_category_new')">
            <template #default>
                <div class="space-y-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <BaseSelect v-model="form.division_uuid" :items="bowOptions" :label="t('event_categories.bow_type_label')"
                                :placeholder="t('event_categories.select_bow_type')" required teleport />
                        </div>
                        <div>
                            <BaseSelect v-model="form.category_uuid" :items="ageOptions" :label="t('event_categories.age_group_label')"
                                :placeholder="t('event_categories.select_age_group')" required teleport />
                        </div>
                        <div v-if="isCustomAgeGroup" class="md:col-span-2">
                            <label class="text-sm font-bold text-gray-700 block mb-2">{{ t('event_categories.custom_age_group_label') }}</label>
                            <input v-model="form.category_name_custom" type="text"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                :placeholder="t('event_categories.custom_age_group_placeholder')" required />
                        </div>
                        <div>
                            <BaseSelect v-model="form.event_type_uuid" :items="eventTypeOptions" :label="t('event_categories.team_type_label')"
                                :placeholder="t('event_categories.select_team_type')" required teleport />
                        </div>
                        <div v-if="!isMixedTeam">
                            <BaseSelect v-model="form.gender_division_uuid" :items="genderOptions" :label="t('event_categories.gender_division_label')"
                                :placeholder="t('event_categories.select_gender_division')" required teleport />
                        </div>
                        <div v-else>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700 block">{{ t('event_categories.gender_division_label') }}</label>
                                <div
                                    class="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 text-sm font-medium">
                                    {{ t('event_categories.mixed_auto') }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">{{ t('event_categories.max_participants_label') }}</label>
                            <input v-model.number="form.max_participants" type="number" min="0"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                :placeholder="t('event_categories.unlimited_placeholder')" />
                            <div class="text-[10px] text-gray-400">{{ t('event_categories.max_participants_desc') }}</div>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">{{ t('event_categories.members_per_team') }}</label>
                            <div class="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-navy font-bold">
                                {{ t('event_categories.people_count', { count: form.team_size || (isTeamEvent ? (isMixedTeam ? 2 : 3) : 1) }) }}
                            </div>
                            <div class="text-[10px] text-gray-400">
                                {{ teamTypeDescription }}
                            </div>
                        </div>
                    </div>

                    <!-- Gate Warning Banner for Team & Mixed Team -->
                    <div v-if="missingIndividualCategory" class="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3.5">
                        <div class="size-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Icon icon="ph:warning-circle-bold" class="text-lg" />
                        </div>
                        <div class="space-y-1 min-w-0 flex-1">
                            <div class="text-xs font-bold text-amber-900 leading-tight">
                                {{ t('event_categories.gate_warning_title') }}
                            </div>
                            <div class="text-[11px] text-amber-800 leading-relaxed">
                                {{ missingIndividualCategory.message }}
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template #action>
                <BaseButton variant="white" @click="closeDialog">{{ t('event_categories.cancel') }}</BaseButton>
                <BaseButton variant="primary" @click="saveCategory" :loading="saving">
                    {{ editingCategory ? t('event_categories.save_changes') : t('event_categories.add_category') }}
                </BaseButton>
            </template>
        </BaseDialogForm>

        <!-- Standardized Delete Confirmation Dialog -->
        <BaseDialogForm v-model="showDeleteDialog" @close="showDeleteDialog = false">
            <template #header>
                <div class="flex items-center gap-3">
                    <div class="size-10 bg-red-50 rounded-xl flex items-center justify-center shadow-inner">
                        <Icon icon="ph:trash-bold" class="text-xl text-red-600" />
                    </div>
                    <h2 class="text-xl font-black text-navy">{{ t('event_categories.delete_category_confirm') }}</h2>
                </div>
            </template>

            <div v-if="fetchingDetails" class="py-12 flex flex-col items-center justify-center gap-4 text-center">
                <Icon icon="ph:circle-notch-bold" class="text-4xl text-primary animate-spin" />
                <div class="text-sm font-bold text-gray-400 tracking-widest">{{ t('event_categories.analyzing_relations') }}</div>
            </div>

            <div v-else-if="categoryDetails" class="space-y-6">
                <div class="text-slate-500 font-medium leading-relaxed">
                    {{ t('event_categories.permanent_action_desc') }}
                </div>

                <!-- Category Summary Card -->
                <div class="p-5 rounded-2xl bg-navy text-white relative overflow-hidden group shadow-sm">
                    <div class="absolute inset-0 opacity-10 pointer-events-none"
                        style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 11px);">
                    </div>
                    <div class="relative z-10">
                        <h4 class="text-[9px] font-black text-primary tracking-[0.2em] mb-2">{{ t('event_categories.category_id_label') }}</h4>
                        <div class="text-lg font-black leading-tight mb-1">
                            {{ categoryDetails.category.division_name }} - {{ categoryDetails.category.category_name }}
                        </div>
                        <div class="text-xs font-bold text-slate-300">
                            {{ categoryDetails.category.event_type_name }}
                            <span v-if="categoryDetails.category.gender_division_name"> • {{
                                categoryDetails.category.gender_division_name }}</span>
                        </div>
                        <div v-if="categoryDetails.category.category_name_custom"
                            class="mt-3 inline-flex px-2 py-0.5 bg-white/10 backdrop-blur border border-white/10 rounded text-[10px] font-bold">
                            {{ categoryDetails.category.category_name_custom }}
                        </div>
                    </div>
                </div>

                <!-- Statistics Grid -->
                <div class="grid grid-cols-2 gap-4">
                    <div v-for="stat in [
                        { label: t('event_categories.stat_participants'), count: categoryDetails.participant_count, icon: 'ph:users-bold' },
                        { label: t('event_categories.stat_teams'), count: categoryDetails.team_count, icon: 'ph:users-three-bold' },
                        { label: t('event_categories.stat_sessions'), count: categoryDetails.session_count, icon: 'ph:hourglass-bold' },
                        { label: t('event_categories.stat_brackets'), count: categoryDetails.bracket_count, icon: 'ph:stack-bold' }
                    ]" :key="stat.label" class="p-4 rounded-2xl border transition-all duration-300 shadow-sm"
                        :class="stat.count > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-50 opacity-60'">
                        <div class="flex items-center justify-between mb-2">
                            <div class="size-9 rounded-lg flex items-center justify-center transition-colors shadow-inner"
                                :class="stat.count > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-400'">
                                <Icon :icon="stat.icon" class="text-lg" />
                            </div>
                            <div class="text-xl font-black" :class="stat.count > 0 ? 'text-red-700' : 'text-gray-400'">
                                {{ stat.count }}
                            </div>
                        </div>
                        <span class="text-[9px] font-black text-gray-400 tracking-wider">{{ stat.label
                            }}</span>
                    </div>
                </div>
            </div>

            <template #action>
                <BaseButton variant="white" @click="showDeleteDialog = false"
                    class="px-6 font-bold tracking-wider text-xs">
                    {{ t('event_categories.cancel') }}
                </BaseButton>
                <BaseButton variant="danger" @click="confirmDeleteCategory" :disabled="saving" :loading="saving"
                    icon="ph:trash-bold" class="px-8 font-black tracking-wider text-xs shadow-lg shadow-red-200">
                    {{ t('event_categories.confirm_delete_button') }}
                </BaseButton>
            </template>
        </BaseDialogForm>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import BasePagination from '~/components/common/BasePagination.vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { getCategoryIcon, getCategoryColorClass } from '~/utils/logoArcheryCategory'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'

const { t, locale } = useI18n()

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: computed(() => `${t('event_categories.title')} - Archeris Dashboard`)
})

const tableColumns = computed(() => [
    { key: 'category', label: t('event_categories.category_list'), sortable: false, class: 'min-w-[260px]' },
    { key: 'quota', label: 'Kuota', sortable: false, align: 'center', class: 'min-w-[130px]' },
    { key: 'team', label: t('event_categories.team_type'), sortable: false, align: 'center', class: 'min-w-[130px]' },
    { key: 'status', label: t('common.status'), sortable: false, align: 'center', class: 'min-w-[120px]' }
])

const route = useRoute()
const eventId = route.params.id
const { get, post, put, delete: delApi } = useApi()
const toast = useToast()
const { isSubscriptionActive } = useSubscription()
const showPremiumModal = ref(false)

const isLoading = ref(true)
const saving = ref(false)
const categories = ref([])
const bowTypes = ref([])
const ageGroups = ref([])
const eventTypes = ref([])
const genderDivisions = ref([])
const showDialog = ref(false)
const editingCategory = ref(null)
const showDeleteDialog = ref(false)
const categoryToDelete = ref(null)
const fetchingDetails = ref(false)
const categoryDetails = ref(null)

// Pagination & Filtering
const currentPage = ref(1)
const totalItems = ref(0)
const limit = ref(10)
const selectedBowType = ref('all')
const selectedTeamType = ref('all')

const bowFilterOptions = computed(() => {
    return [
        { value: 'all', title: computed(() => t('event_categories.all_bows')) },
        ...bowTypes.value.map(bow => ({ value: bow.code, title: bow.name }))
    ]
})

const teamTypeFilterOptions = computed(() => {
    return [
        { value: 'all', title: computed(() => t('event_categories.all_team_types')) },
        ...eventTypes.value.map(type => ({ value: type.id, title: type.name }))
    ]
})

watch(selectedBowType, () => {
    currentPage.value = 1
    fetchCategories()
})

watch(selectedTeamType, () => {
    currentPage.value = 1
    fetchCategories()
})

const bowOptions = computed(() => {
    return bowTypes.value.map(bow => ({ value: bow.id, title: bow.name }))
})

const ageOptions = computed(() => {
    return ageGroups.value.map(age => {
        let title = age.name
        if (age.code === 'kustom' || age.name?.toLowerCase().includes('kustom')) {
            title = t('event_categories.opt_custom')
        } else if (age.code === 'umum' || age.name?.toLowerCase() === 'umum') {
            title = t('event_categories.opt_general')
        }
        return { value: age.id, title }
    })
})

const eventTypeOptions = computed(() => {
    return eventTypes.value.map(type => {
        let title = type.name
        const code = (type.code || type.name || '').toLowerCase()
        if (code === 'individual' || code.includes('individu')) {
            title = t('event_categories.opt_individual')
        } else if (code === 'mixed_team' || code.includes('mixed')) {
            title = t('event_categories.opt_mixed_team')
        } else if (code === 'team' || code.includes('beregu') || code.includes('team')) {
            title = t('event_categories.opt_team')
        }
        return { value: type.id, title }
    })
})

const genderOptions = computed(() => {
    return genderDivisions.value
        .filter(gender => gender.code !== 'mixed')
        .map(gender => {
            let title = gender.name
            const code = (gender.code || gender.name || '').toLowerCase()
            if (code === 'men' || code === 'male' || code.includes('putra')) {
                title = t('common.gender_male')
            } else if (code === 'women' || code === 'female' || code.includes('putri')) {
                title = t('common.gender_female')
            }
            return { value: gender.id, title }
        })
})

const form = ref({
    division_uuid: '',
    category_uuid: '',
    category_name_custom: '',
    event_type_uuid: '',
    gender_division_uuid: '',
    max_participants: null,
    team_size: 3,
    status: 'active'
})

const allTournamentCategories = ref([])

const isCustomAgeGroup = computed(() => {
    const selected = ageGroups.value.find(ag => ag.id === form.value.category_uuid)
    return selected?.code === 'kustom' || selected?.name?.toLowerCase().includes('kustom')
})

const isMixedTeam = computed(() => {
    const selected = eventTypes.value.find(et => et.id === form.value.event_type_uuid)
    return selected?.name?.toLowerCase().includes('mixed') || selected?.code === 'mixed_team'
})

const isTeamEvent = computed(() => {
    const selected = eventTypes.value.find(et => et.id === form.value.event_type_uuid)
    return selected?.name?.toLowerCase() !== 'individual'
})

const getGenderLabel = (gender) => {
    const code = (gender?.code || gender?.name || '').toLowerCase()
    if (code === 'men' || code === 'male' || code.includes('putra')) {
        return t('event_categories.gender_male')
    }
    if (code === 'women' || code === 'female' || code.includes('putri')) {
        return t('event_categories.gender_female')
    }
    return gender?.name || ''
}

const missingIndividualCategory = computed(() => {
    if (!isTeamEvent.value || !form.value.division_uuid || !form.value.category_uuid) {
        return null
    }

    const existing = allTournamentCategories.value.length > 0 ? allTournamentCategories.value : categories.value

    if (isMixedTeam.value) {
        const maleGender = genderDivisions.value.find(g => g.code === 'men' || g.code === 'male')
        const femaleGender = genderDivisions.value.find(g => g.code === 'women' || g.code === 'female')

        const hasMaleIndiv = existing.some(c => {
            const isSameDivision = (c.division_id === form.value.division_uuid || c.division_uuid === form.value.division_uuid)
            const isSameAge = (c.category_id === form.value.category_uuid || c.category_uuid === form.value.category_uuid)
            const isIndiv = (c.event_type_name?.toLowerCase() === 'individual' || c.event_type_code === 'individual')
            const isMale = (c.gender_division_id === maleGender?.id || c.gender_division_uuid === maleGender?.id || c.gender_division_name?.toLowerCase().includes('putra') || c.gender_division_name?.toLowerCase().includes('men') || c.gender_division_code === 'men' || c.gender_division_code === 'male')
            return isSameDivision && isSameAge && isIndiv && isMale
        })

        const hasFemaleIndiv = existing.some(c => {
            const isSameDivision = (c.division_id === form.value.division_uuid || c.division_uuid === form.value.division_uuid)
            const isSameAge = (c.category_id === form.value.category_uuid || c.category_uuid === form.value.category_uuid)
            const isIndiv = (c.event_type_name?.toLowerCase() === 'individual' || c.event_type_code === 'individual')
            const isFemale = (c.gender_division_id === femaleGender?.id || c.gender_division_uuid === femaleGender?.id || c.gender_division_name?.toLowerCase().includes('putri') || c.gender_division_name?.toLowerCase().includes('women') || c.gender_division_code === 'women' || c.gender_division_code === 'female')
            return isSameDivision && isSameAge && isIndiv && isFemale
        })

        if (!hasMaleIndiv || !hasFemaleIndiv) {
            let missing = []
            if (!hasMaleIndiv) missing.push(t('event_categories.gender_male'))
            if (!hasFemaleIndiv) missing.push(t('event_categories.gender_female'))
            return {
                type: 'mixed',
                missingGenders: missing.join(' & '),
                message: t('event_categories.gate_warning_mixed_desc')
            }
        }
    } else {
        if (!form.value.gender_division_uuid) return null
        const selectedGender = genderDivisions.value.find(g => g.id === form.value.gender_division_uuid)
        const genderLabel = getGenderLabel(selectedGender)

        const hasIndiv = existing.some(c => {
            const isSameDivision = (c.division_id === form.value.division_uuid || c.division_uuid === form.value.division_uuid)
            const isSameAge = (c.category_id === form.value.category_uuid || c.category_uuid === form.value.category_uuid)
            const isIndiv = (c.event_type_name?.toLowerCase() === 'individual' || c.event_type_code === 'individual')
            const isSameGender = (c.gender_division_id === form.value.gender_division_uuid || c.gender_division_uuid === form.value.gender_division_uuid || c.gender_division_name === selectedGender?.name || (selectedGender?.code && c.gender_division_code === selectedGender.code))
            return isSameDivision && isSameAge && isIndiv && isSameGender
        })

        if (!hasIndiv) {
            return {
                type: 'team',
                missingGenders: genderLabel,
                message: t('event_categories.gate_warning_team_desc', { gender: genderLabel })
            }
        }
    }

    return null
})

const teamTypeDescription = computed(() => {
    if (isMixedTeam.value) return t('event_categories.desc_mixed_team')
    if (isTeamEvent.value) return t('event_categories.desc_same_gender')
    return t('event_categories.desc_individual')
})

watch(() => form.value.event_type_uuid, (newId) => {
    if (!newId) return
    const selected = eventTypes.value.find(et => et.id === newId)
    const type = selected?.name?.toLowerCase() || ''
    if (type.includes('mixed')) {
        form.value.team_size = 2
        // Auto-select mixed gender if available
        const mixed = genderDivisions.value.find(g => g.code === 'mixed')
        if (mixed) form.value.gender_division_uuid = mixed.id
    } else if (type === 'team') {
        form.value.team_size = 3
        // If it was mixed before, clear it to force selection
        const mixed = genderDivisions.value.find(g => g.code === 'mixed')
        if (form.value.gender_division_uuid === mixed?.id) {
            form.value.gender_division_uuid = ''
        }
    } else {
        form.value.team_size = 1
        // If it was mixed before, clear it
        const mixed = genderDivisions.value.find(g => g.code === 'mixed')
        if (form.value.gender_division_uuid === mixed?.id) {
            form.value.gender_division_uuid = ''
        }
    }
})

const activeCount = computed(() => categories.value.filter(c => c.status === 'active').length)
const totalQuota = computed(() => {
    return categories.value.reduce((sum, c) => sum + (c.max_participants || 0), 0)
})

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    try {
        const localeCode = locale.value === 'id' ? 'id-ID' : 'en-US'
        return new Date(dateStr).toLocaleDateString(localeCode, {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    } catch {
        return dateStr
    }
}

const fetchCategories = async () => {
    isLoading.value = true
    try {
        const offset = (currentPage.value - 1) * limit.value
        const params = new URLSearchParams({
            limit: limit.value.toString(),
            offset: offset.toString()
        })

        if (selectedBowType.value !== 'all') {
            params.append('bow_type', selectedBowType.value)
        }

        if (selectedTeamType.value !== 'all') {
            params.append('event_type', selectedTeamType.value)
        }

        const [categoriesRes, allCatsRes, bowRes, ageRes, eventTypeRes, genderRes] = await Promise.all([
            get(`/tournaments/${eventId}/categories?${params.toString()}`),
            get(`/tournaments/${eventId}/categories?limit=500`),
            get('/bow-types'),
            get('/age-groups'),
            get('/team-types'),
            get('/gender-divisions')
        ])
        categories.value = categoriesRes?.events || categoriesRes?.data?.events || []
        allTournamentCategories.value = allCatsRes?.events || allCatsRes?.data?.events || categories.value
        totalItems.value = categoriesRes?.total || categoriesRes?.data?.total || 0
        bowTypes.value = bowRes?.bow_types || bowRes?.data?.bow_types || []
        ageGroups.value = ageRes?.age_groups || ageRes?.data?.age_groups || []
        eventTypes.value = eventTypeRes?.team_types || eventTypeRes?.event_types || eventTypeRes?.data?.team_types || eventTypeRes?.data?.event_types || []
        genderDivisions.value = genderRes?.gender_divisions || genderRes?.data?.gender_divisions || []
    } catch (error) {
        console.error('Failed to fetch categories:', error)
        toast.error(getApiErrorMessage(error, t('event_categories.toast_load_failed')))
    } finally {
        isLoading.value = false
    }
}

const handlePageChange = (page) => {
    currentPage.value = page
    fetchCategories()
}

const openCreateDialog = () => {
    editingCategory.value = null
    form.value = {
        division_uuid: '',
        category_uuid: '',
        category_name_custom: '',
        event_type_uuid: '',
        gender_division_uuid: '',
        max_participants: null,
        team_size: 1,
        status: 'active'
    }
    showDialog.value = true
}

const openEditDialog = (category) => {
    editingCategory.value = category
    form.value = {
        division_uuid: category.division_id,
        category_uuid: category.category_id,
        category_name_custom: category.category_name_custom || '',
        event_type_uuid: category.event_type_id || '',
        gender_division_uuid: category.gender_division_id || '',
        max_participants: category.max_participants,
        team_size: category.team_size || 0,
        status: category.status || 'active'
    }
    showDialog.value = true
}

const closeDialog = () => {
    showDialog.value = false
    editingCategory.value = null
}

const deleteCategory = async (category) => {
    categoryToDelete.value = category
    showDeleteDialog.value = true
    fetchingDetails.value = true
    try {
        const res = await get(`/tournaments/${eventId}/categories/${category.id}`)
        categoryDetails.value = res?.data || res
    } catch (error) {
        console.error('Failed to fetch category details:', error)
        toast.error(t('event_categories.toast_load_details_failed'))
        showDeleteDialog.value = false
    } finally {
        fetchingDetails.value = false
    }
}

const confirmDeleteCategory = async () => {
    if (!categoryToDelete.value) return

    saving.value = true
    try {
        await delApi(`/tournaments/${eventId}/categories/${categoryToDelete.value.id}`)
        toast.success(t('event_categories.toast_delete_success'))
        showDeleteDialog.value = false
        await fetchCategories()
    } catch (error) {
        console.error('Failed to delete category:', error)
        toast.error(getApiErrorMessage(error, t('event_categories.toast_delete_failed')))
    } finally {
        saving.value = false
    }
}

const getApiErrorMessage = (error, defaultMsg) => {
    const errData = error?.response?.data || error?.data || {}
    const rawError = errData.error || error?.message || ''
    const errorCode = errData.error_code || ''

    if (errorCode === 'team_requires_individual' || rawError.includes('Kategori Beregu memerlukan')) {
        const selectedGender = genderDivisions.value.find(g => g.id === form.value.gender_division_uuid)
        const genderLabel = getGenderLabel(selectedGender)
        return t('event_categories.toast_gate_team_requires_individual', { gender: genderLabel })
    }
    if (errorCode === 'mixed_team_requires_both' || rawError.includes('Kategori Beregu Campuran')) {
        return t('event_categories.toast_gate_mixed_requires_both')
    }
    if (errorCode === 'category_has_paid_participants' || rawError.includes('status pembayaran lunas')) {
        return t('event_categories.toast_cannot_delete_paid')
    }
    if (errorCode === 'individual_required_by_team' || rawError.includes('masih digunakan sebagai basis skoring')) {
        return t('event_categories.toast_cannot_delete_dep_team')
    }
    if (errorCode === 'category_has_scores' || rawError.includes('rekaman skor anak panah')) {
        return t('event_categories.toast_cannot_delete_has_scores')
    }
    if (rawError.includes('Kategori sudah ada') || rawError.includes('already exists')) {
        return t('event_categories.toast_category_exists')
    }

    return rawError || defaultMsg
}

const saveCategory = async () => {
    const isMixed = isMixedTeam.value
    if (!form.value.division_uuid || !form.value.category_uuid || !form.value.event_type_uuid || (!isMixed && !form.value.gender_division_uuid)) {
        toast.error(t('event_categories.toast_fill_required'))
        return
    }

    if (isCustomAgeGroup.value && !form.value.category_name_custom) {
        toast.error(t('event_categories.toast_custom_age_required'))
        return
    }

    if (isTeamEvent.value && (!form.value.team_size || form.value.team_size <= 1)) {
        toast.error(t('event_categories.toast_team_size_invalid'))
        return
    }

    if (missingIndividualCategory.value) {
        toast.error(missingIndividualCategory.value.message)
        return
    }

    saving.value = true
    try {
        const payload = {
            division_uuid: form.value.division_uuid,
            category_uuid: form.value.category_uuid,
            category_name_custom: isCustomAgeGroup.value ? form.value.category_name_custom : null,
            event_type_uuid: form.value.event_type_uuid,
            gender_division_uuid: isMixed ? (genderDivisions.value.find(g => g.code === 'mixed')?.id || form.value.gender_division_uuid) : form.value.gender_division_uuid,
            max_participants: form.value.max_participants || null,
            status: form.value.status
        }

        if (editingCategory.value) {
            await put(`/tournaments/${eventId}/categories/${editingCategory.value.id}`, payload)
            toast.success(t('event_categories.toast_update_success'))
        } else {
            await post(`/tournaments/${eventId}/categories`, payload)
            toast.success(t('event_categories.toast_create_success'))
        }
        await fetchCategories()
        closeDialog()
    } catch (error) {
        console.error('Failed to save category:', error)
        toast.error(getApiErrorMessage(error, t('event_categories.toast_save_failed')))
    } finally {
        saving.value = false
    }
}

onMounted(() => {
    fetchCategories()
})
</script>

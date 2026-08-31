<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Enhanced Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>

            <!-- Decorative Background Elements -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <!-- Header Content -->
            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="flex items-start gap-4">
                        <!-- Icon Badge -->
                        <div
                            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Icon icon="ph:tag" class="text-white text-2xl" />
                        </div>

                        <!-- Title Section -->
                        <div class="flex-1">
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
                                {{ t('event_categories.title') }}
                            </h1>
                            <div class="text-slate-300 text-sm max-w-2xl">
                                {{ t('event_categories.desc') }}
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3 flex-shrink-0">
                        <BaseButton variant="primary" icon="ph:plus-bold"
                            class="h-11 px-5 shadow-lg shadow-primary/30 hover:shadow-sm hover:shadow-primary/40 transition-all"
                            :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                            @click="isSubscriptionActive ? openCreateDialog() : (showPremiumModal = true)">
                            {{ t('event_categories.add_category') }}
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

        <!-- Categories List -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div
                class="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 class="text-lg font-bold text-navy">{{ t('event_categories.category_list') }}</h2>
                <div class="flex items-center gap-3">
                    <span class="text-sm font-medium text-gray-500 hidden sm:inline">{{ t('event_categories.filter_bow') }}</span>
                    <BaseSelect v-model="selectedBowType" :items="bowFilterOptions" :placeholder="t('event_categories.all_bows')"
                        class="w-full sm:w-48" />
                    <span class="text-sm font-medium text-gray-500 hidden sm:inline">{{ t('event_categories.team_type') }}</span>
                    <BaseSelect v-model="selectedTeamType" :items="teamTypeFilterOptions" :placeholder="t('event_categories.all_team_types')"
                        class="w-full sm:w-48" />
                </div>
            </div>
            <!-- Skeleton Loader -->
            <div v-if="isLoading" class="divide-y divide-gray-100">
                <div v-for="i in 3" :key="i" class="p-4 sm:p-6">
                    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div class="flex-1 space-y-4">
                            <div class="flex items-center gap-3">
                                <div class="h-6 w-3/4 bg-gray-100 animate-pulse rounded"></div>
                                <div class="h-5 w-16 bg-gray-50 animate-pulse rounded-full"></div>
                            </div>
                            <div class="flex gap-6">
                                <div class="h-4 w-32 bg-gray-50 animate-pulse rounded"></div>
                                <div class="h-4 w-32 bg-gray-50 animate-pulse rounded"></div>
                            </div>
                        </div>
                        <div class="h-9 w-20 bg-gray-100 animate-pulse rounded-lg"></div>
                    </div>
                </div>
            </div>
            <div v-else-if="categories.length === 0" class="p-12 text-center">
                <Icon icon="ph:tag-simple" class="text-5xl text-gray-300 mx-auto mb-4" />
                <div class="text-gray-600 font-bold mb-1">{{ t('event_categories.no_categories') }}</div>
                <div class="text-sm text-gray-400">{{ t('event_categories.no_categories_desc') }}</div>
            </div>
            <div v-else class="divide-y divide-gray-100">
                <div v-for="category in categories" :key="category.id"
                    class="p-4 sm:p-6 hover:bg-gray-50 transition-colors group">
                    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div class="flex items-start gap-4 flex-1 min-w-0">
                            <!-- Category Icon -->
                            <div
                                class="h-12 w-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shadow-sm shrink-0 transition-all group-hover:bg-navy p-2 overflow-hidden">
                                <img :src="'/' + getCategoryIcon(`${category.division_name} ${category.event_type_name} ${category.gender_division_name}`)"
                                    :alt="category.division_name"
                                    class="w-full h-full object-contain group-hover:invert transition-all" />
                            </div>

                            <div class="min-w-0 flex-1">
                                <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                    <h3 class="text-base sm:text-lg font-bold text-navy break-words min-w-0">
                                        {{ category.division_name }} – {{ category.category_name }} – {{
                                            category.event_type_name }}
                                        – {{ category.gender_division_name }}
                                    </h3>
                                    <span
                                        :class="category.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                                        class="px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0">
                                        {{ category.status === 'active' ? t('event_categories.status_active') : t('event_categories.status_inactive') }}
                                    </span>
                                </div>
                                <div
                                    class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6 text-sm text-gray-500">
                                    <div class="flex items-center gap-2 min-w-0">
                                        <Icon icon="ph:users" class="text-base shrink-0" />
                                        <span class="break-words">
                                            {{ t('event_categories.max_participants', { count: category.max_participants || t('event_categories.unlimited') }) }}
                                        </span>
                                    </div>
                                    <div v-if="category.team_size > 0" class="flex items-center gap-2 min-w-0">
                                        <Icon icon="ph:users-three" class="text-base shrink-0" />
                                        <span class="break-words">
                                            {{ t('event_categories.team_capacity', { count: category.team_size }) }}
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-2 min-w-0">
                                        <Icon icon="ph:calendar" class="text-base shrink-0" />
                                        <span class="break-words">
                                            {{ t('event_categories.created', { date: formatDate(category.created_at) }) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="flex items-center justify-end sm:justify-start shrink-0 pt-2 sm:pt-0 border-t border-gray-100 sm:border-t-0 gap-2">
                            <BaseButton variant="white" size="sm" icon="ph:eye" :title="t('event_categories.view_participants')"
                                :to="`/dashboard/organizer/events/${eventId}/categories/${category.id}`">
                                {{ t('event_categories.view') }}
                            </BaseButton>
                            <BaseButton variant="white" size="sm" icon="ph:pencil"
                                @click="isSubscriptionActive ? openEditDialog(category) : (showPremiumModal = true)">
                                {{ t('event_categories.edit') }}
                            </BaseButton>
                            <button @click="isSubscriptionActive ? deleteCategory(category) : (showPremiumModal = true)"
                                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group/del"
                                :title="t('event_categories.delete_category')">
                                <Icon icon="ph:trash" class="text-lg group-hover/del:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="categories.length > 0" class="p-6 border-t border-gray-100">
                <BasePagination :current-page="currentPage" :total-items="totalItems" :items-per-page="limit"
                    @change-page="handlePageChange" />
            </div>
        </div>

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
import { useI18n } from 'vue-i18n'
import { useSubscription } from '~/composables/useSubscription'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'

const { t, locale } = useI18n()

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: computed(() => `${t('event_categories.title')} - Dashboard`)
})

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
    return ageGroups.value.map(age => ({ value: age.id, title: age.name }))
})

const eventTypeOptions = computed(() => {
    return eventTypes.value.map(type => ({ value: type.id, title: type.name }))
})

const genderOptions = computed(() => {
    return genderDivisions.value
        .filter(gender => gender.code !== 'mixed')
        .map(gender => ({ value: gender.id, title: gender.name }))
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
        const localeCode = locale.value === 'id' ? 'id-ID' : locale.value === 'kr' ? 'ko-KR' : 'en-US'
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

        const [categoriesRes, bowRes, ageRes, eventTypeRes, genderRes] = await Promise.all([
            get(`/events/${eventId}/categories?${params.toString()}`),
            get('/bow-types'),
            get('/age-groups'),
            get('/team-types'),
            get('/gender-divisions')
        ])
        categories.value = categoriesRes?.events || categoriesRes?.data?.events || []
        totalItems.value = categoriesRes?.total || categoriesRes?.data?.total || 0
        bowTypes.value = bowRes?.bow_types || bowRes?.data?.bow_types || []
        ageGroups.value = ageGroups.value.length > 0 ? ageGroups.value : (ageRes?.age_groups || ageRes?.data?.age_groups || [])
        eventTypes.value = eventTypes.value.length > 0 ? eventTypes.value : (eventTypeRes?.team_types || eventTypeRes?.event_types || eventTypeRes?.data?.team_types || eventTypeRes?.data?.event_types || [])
        genderDivisions.value = genderDivisions.value.length > 0 ? genderDivisions.value : (genderRes?.gender_divisions || genderRes?.data?.gender_divisions || [])
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
        const res = await get(`/events/${eventId}/categories/${category.id}`)
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
        await delApi(`/events/${eventId}/categories/${categoryToDelete.value.id}`)
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
    return error?.response?.data?.error || error?.data?.error || error?.message || defaultMsg
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
            await put(`/events/${eventId}/categories/${editingCategory.value.id}`, payload)
            toast.success(t('event_categories.toast_update_success'))
        } else {
            await post(`/events/${eventId}/categories`, payload)
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

import re

target_file = r'c:\E\ichsan\startup\archeryhub.id\app\pages\dashboard\organizer\tournaments\[id]\participants\index.vue'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the template section from <ParticipantFilterModal ... /> to end of table
old_template_part = """        <ParticipantFilterModal
            v-model:show="showFilterModal"
            :categories="categories"
            :current-filters="filters"
            @apply="handleApplyModalFilters"
            @reset="resetAllFilters"
        />

        <!-- Search and Filter Bar -->
        <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
            <div class="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <!-- Search Input with Clear Button -->
                <div class="relative flex-1 w-full">
                    <Icon icon="ph:magnifying-glass"
                        class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                        v-model="searchQuery"
                        type="text"
                        :placeholder="t('dashboard.participants_list.search_placeholder')"
                        class="w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                        @input="handleSearch"
                    />
                    <button
                        v-if="searchQuery"
                        type="button"
                        @click="searchQuery = ''; handleSearch()"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                        :title="t('common.clear')"
                    >
                        <Icon icon="ph:x-circle-fill" class="text-base" />
                    </button>
                </div>

                <!-- Single Filter Trigger Button, Reset, and Counter -->
                <div class="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                    <button
                        type="button"
                        @click="showFilterModal = true"
                        :class="[
                            'relative h-11 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-2 cursor-pointer shrink-0',
                            activeFilterCount > 0
                                ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                                : 'bg-white border-gray-200 text-slate-700 hover:bg-gray-50 hover:border-gray-300'
                        ]"
                    >
                        <Icon icon="ph:sliders-horizontal-bold" class="text-base sm:text-lg text-navy" />
                        <span>{{ t('common.filter') }}</span>
                        <span
                            v-if="activeFilterCount > 0"
                            class="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-navy text-white text-[10px] font-black flex items-center justify-center shadow-xs ring-2 ring-white"
                        >
                            {{ activeFilterCount }}
                        </span>
                    </button>

                    <button
                        v-if="hasActiveFilters"
                        type="button"
                        @click="resetAllFilters"
                        class="h-11 px-3.5 rounded-xl border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 text-xs font-black tracking-wider transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                        :title="t('common.reset_filters')"
                    >
                        <Icon icon="ph:arrow-counter-clockwise-bold" class="text-sm" />
                        <span class="hidden md:inline">{{ t('common.reset') }}</span>
                    </button>

                    <div class="px-3.5 py-2.5 bg-navy/5 text-navy rounded-xl font-black text-xs border border-navy/10 flex items-center gap-1.5 shrink-0">
                        <Icon icon="ph:users-three-bold" class="text-sm text-navy/70" />
                        <span>{{ total }} {{ t('dashboard.participants_list.archers_unit') }}</span>
                    </div>
                </div>
            </div>

            <!-- Active Filter Chips Bar -->
            <div
                v-if="activeFilterChips.length > 0"
                class="flex items-center gap-2.5 pt-3 flex-wrap border-t border-gray-100 animate-in fade-in duration-150"
            >
                <div class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 shrink-0 select-none">
                    <Icon icon="ph:funnel-bold" class="text-xs text-slate-400 shrink-0" />
                    <span>{{ t('common.active_filters') }}</span>
                </div>

                <div
                    v-for="chip in activeFilterChips"
                    :key="chip.key"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold shadow-2xs group hover:border-gray-300 transition-colors"
                >
                    <span class="truncate max-w-[260px] text-navy font-bold leading-none">{{ chip.label }}</span>
                    <button
                        type="button"
                        @click="removeFilterChip(chip.key)"
                        class="text-gray-400 hover:text-red-500 rounded-full p-0.5 transition-colors cursor-pointer inline-flex items-center justify-center shrink-0"
                        :title="t('common.remove_filter')"
                    >
                        <Icon icon="ph:x-bold" class="text-[10px]" />
                    </button>
                </div>

                <button
                    type="button"
                    @click="resetAllFilters"
                    class="inline-flex items-center text-xs font-bold text-slate-500 hover:text-red-600 transition-colors ml-1 cursor-pointer"
                >
                    {{ t('common.clear_all') }}
                </button>
            </div>
        </div>

        <!-- Participants Table -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-50/50 border-b border-gray-100">
                        <tr class="text-[10px] font-black text-gray-400 tracking-widest capitalize">
                            <th class="px-6 py-4">{{ t('dashboard.participants_list.table.no') }}</th>
                            <th @click="toggleSort('name')" class="px-6 py-4 cursor-pointer hover:text-navy transition-colors select-none">
                                <div class="flex items-center gap-1.5">
                                    <span>{{ t('dashboard.participants_list.table.name_email') }}</span>
                                    <Icon v-if="sortBy === 'name'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                                </div>
                            </th>
                            <th @click="toggleSort('club')" class="px-6 py-4 cursor-pointer hover:text-navy transition-colors select-none">
                                <div class="flex items-center gap-1.5">
                                    <span>{{ t('dashboard.participants_list.table.club_city') }}</span>
                                    <Icon v-if="sortBy === 'club'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                                </div>
                            </th>
                            <th v-if="hasActiveCategoryFilter" class="px-6 py-4 min-w-[240px]">{{ t('dashboard.participants_list.table.category') }}</th>
                            <th @click="toggleSort('status')" class="px-6 py-4 min-w-[160px] cursor-pointer hover:text-navy transition-colors select-none">
                                <div class="flex items-center gap-1.5">
                                    <span>{{ t('dashboard.participants_list.table.payment_status') }}</span>
                                    <Icon v-if="sortBy === 'status'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                                </div>
                            </th>
                            <th @click="toggleSort('reregistration')" class="px-6 py-4 min-w-[180px] cursor-pointer hover:text-navy transition-colors select-none">
                                <div class="flex items-center gap-1.5">
                                    <span>{{ t('dashboard.participants_list.reregistration') }}</span>
                                    <Icon v-if="sortBy === 'reregistration'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                                </div>
                            </th>
                            <th class="px-6 py-4 text-right">{{ t('dashboard.participants_list.table.action') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <!-- Loading State -->
                        <template v-if="isLoading">
                            <tr v-for="i in 5" :key="i">
                                <td class="px-6 py-4">
                                    <div class="h-4 w-4 bg-gray-100 animate-pulse rounded"></div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="h-10 w-10 bg-gray-100 animate-pulse rounded-full"></div>
                                        <div class="space-y-2">
                                            <div class="h-4 w-32 bg-gray-100 animate-pulse rounded"></div>
                                            <div class="h-3 w-40 bg-gray-50 animate-pulse rounded"></div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
                                </td>
                                <td v-if="hasActiveCategoryFilter" class="px-6 py-4 min-w-[240px]">
                                    <div class="h-4 w-40 bg-gray-50 animate-pulse rounded"></div>
                                </td>
                                <td class="px-6 py-4 min-w-[160px]">
                                    <div class="h-6 w-28 bg-gray-100 animate-pulse rounded-lg"></div>
                                </td>
                                <td class="px-6 py-4 min-w-[180px]">
                                    <div class="h-6 w-28 bg-gray-100 animate-pulse rounded-lg"></div>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <div class="flex justify-end gap-2">
                                        <div class="size-8 bg-gray-50 animate-pulse rounded-lg"></div>
                                    </div>
                                </td>
                            </tr>
                        </template>

                        <template v-else>
                            <tr v-for="(participant, index) in filteredParticipants" :key="participant.archer_id"
                                class="group hover:bg-gray-50/50 transition-colors">
                                <td class="px-6 py-4 align-top text-center w-16">
                                    <span class="text-sm font-bold text-gray-400">{{ (page - 1) * limit + index + 1
                                        }}</span>
                                </td>
                                <td class="px-6 py-4 align-top min-w-[250px]">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-navy font-bold text-xs  border border-gray-200 overflow-hidden shrink-0 shadow-sm">
                                            <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)"
                                                class="w-full h-full object-cover">
                                        </div>
                                        <div class="min-w-0 py-1">
                                            <div class="text-sm font-black text-navy leading-tight">{{
                                                participant.full_name }}</div>
                                            <div class=" text-xs text-gray-400 font-medium mt-1 leading-none">{{
                                                participant.email || '-' }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 align-top min-w-[150px]">
                                    <div class="flex flex-col">
                                        <span class="text-xs font-bold text-gray-600 leading-snug">{{
                                            participant.club_name || '-' }}</span>
                                        <span v-if="participant.city"
                                             class="text-[10px] text-gray-400 font-bold tracking-wider">{{
                                                participant.city }}</span>
                                    </div>
                                </td>

                                <td v-if="hasActiveCategoryFilter" class="px-6 py-4 align-top min-w-[240px]">
                                    <div class="flex flex-wrap gap-1.5 max-w-[360px]">
                                        <span v-for="label in getFilteredCategoryLabels(participant)" :key="label"
                                            class="inline-flex px-2 py-0.5 rounded-full text-[10px] font-black bg-navy/5 text-navy border border-navy/10">
                                            {{ label }}
                                        </span>
                                    </div>
                                </td>

                                <td class="px-6 py-4 align-top min-w-[160px]">
                                    <span :class="getStatusClass(participant.payment_status || participant.status)"
                                        class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border capitalize">
                                        {{ getDisplayStatus(participant.payment_status || participant.status) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 align-top min-w-[180px]">
                                    <button
                                        type="button"
                                        @click="toggleReregister(participant)"
                                        :disabled="isTogglingReregister[participant.athlete_code || participant.archer_id]"
                                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer select-none"
                                        :class="participant.last_reregistration_at 
                                            ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100/70 hover:border-green-300' 
                                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:text-navy'">
                                        <Icon v-if="isTogglingReregister[participant.athlete_code || participant.archer_id]" icon="ph:circle-notch" class="animate-spin text-sm" />
                                        <Icon v-else-if="participant.last_reregistration_at" icon="ph:check-bold" class="text-sm" />
                                        <Icon v-else icon="ph:minus-bold" class="text-sm" />
                                        <span>{{ participant.last_reregistration_at ? t('dashboard.participants_list.reregistered') : t('dashboard.participants_list.not_reregistered') }}</span>
                                    </button>
                                </td>
                                <td class="px-6 py-4 text-right align-top w-28">
                                    <div class="flex items-center justify-end gap-1.5">
                                        <BaseButton
                                            :to="`/dashboard/organizer/tournaments/${eventId}/participants/detail?archer_id=${participant.archer_id || participant.athlete_code}`"
                                            variant="white" size="sm" icon="ph:eye-bold"
                                            class="h-9 w-9 p-0 text-gray-400 hover:text-navy border-gray-100 hover:border-navy/20 shadow-none"
                                            :title="t('dashboard.participants_list.view_details')" />
                                        <BaseButton
                                            :to="`/dashboard/organizer/tournaments/${eventId}/participants/edit?archer_id=${participant.archer_id || participant.athlete_code}`"
                                            variant="white" size="sm" icon="ph:pencil-simple-bold"
                                            class="h-9 w-9 p-0 text-gray-400 hover:text-primary hover:border-primary/30 border-gray-100 shadow-none"
                                            :title="t('dashboard.participants_list.edit_button')" />
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="filteredParticipants.length === 0">
                                <td :colspan="hasActiveCategoryFilter ? 7 : 6"
                                    class="px-6 py-12 text-center text-gray-400 italic font-medium">
                                    {{ t('dashboard.participants_list.no_participants') }}
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Controls -->
            <div class="px-6 py-6 border-t border-gray-100 bg-gray-50/10">
                <BasePagination :current-page="page" :total-items="total" :items-per-page="limit"
                    @change-page="p => { page = p; fetchParticipants(); }"
                    @update:items-per-page="v => { limit = v; page = 1; fetchParticipants(); }" />
            </div>
        </div>"""

new_template_part = """        <ParticipantFilterModal
            v-model:show="showFilterModal"
            :categories="categories"
            :current-filters="filters"
            @apply="handleApplyModalFilters"
            @reset="resetAllFilters"
        />

        <!-- Unified Dashboard Table -->
        <DashboardDataTable
            :columns="tableColumns"
            :items="participants"
            :loading="isLoading"
            :total="total"
            :server-side="true"
            v-model:page="page"
            v-model:perPage="limit"
            v-model:sortBy="sortBy"
            v-model:sortOrder="sortOrder"
            v-model:searchValue="searchQuery"
            :search-placeholder="t('dashboard.participants_list.search_placeholder')"
            :has-filter-modal="true"
            :active-filter-count="activeFilterCount"
            :active-filter-chips="activeFilterChips"
            count-icon="ph:users-three-bold"
            :count-unit="t('dashboard.participants_list.archers_unit')"
            :empty-title="t('dashboard.participants_list.no_participants')"
            @search="handleSearch"
            @sort="handleSortChange"
            @page-change="handlePageChange"
            @open-filter="showFilterModal = true"
            @remove-chip="removeFilterChip"
            @reset-filters="resetAllFilters"
        >
            <!-- Archer Name & Avatar Column -->
            <template #item-name="{ item }">
                <div class="flex items-center gap-3">
                    <div class="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-navy font-bold text-xs border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                        <img :src="useImageOrDefault(item.avatar_url, item.full_name)" class="w-full h-full object-cover">
                    </div>
                    <div class="min-w-0">
                        <div class="text-xs sm:text-sm font-black text-navy leading-tight truncate">{{ item.full_name }}</div>
                        <div class="text-xs text-slate-400 font-medium mt-0.5 truncate">{{ item.email || '-' }}</div>
                    </div>
                </div>
            </template>

            <!-- Club & City Column -->
            <template #item-club="{ item }">
                <div class="flex flex-col">
                    <span class="text-xs sm:text-sm font-bold text-slate-700 leading-snug">{{ item.club_name || '-' }}</span>
                    <span v-if="item.city" class="text-xs text-slate-400 font-medium">{{ item.city }}</span>
                </div>
            </template>

            <!-- Category Column (if filtered) -->
            <template #item-category="{ item }">
                <div class="flex flex-wrap gap-1.5 max-w-[360px]">
                    <span v-for="label in getFilteredCategoryLabels(item)" :key="label"
                        class="inline-flex px-2 py-0.5 rounded-md text-xs font-bold bg-navy/5 text-navy border border-navy/10">
                        {{ label }}
                    </span>
                </div>
            </template>

            <!-- Payment Status Column -->
            <template #item-payment_status="{ item }">
                <span :class="getStatusClass(item.payment_status || item.status)"
                    class="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold border capitalize shadow-2xs">
                    {{ getDisplayStatus(item.payment_status || item.status) }}
                </span>
            </template>

            <!-- Re-registration Status Column -->
            <template #item-reregistration="{ item }">
                <button
                    type="button"
                    @click="toggleReregister(item)"
                    :disabled="isTogglingReregister[item.athlete_code || item.archer_id]"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer select-none shadow-2xs"
                    :class="item.last_reregistration_at 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300 hover:text-navy'">
                    <Icon v-if="isTogglingReregister[item.athlete_code || item.archer_id]" icon="ph:circle-notch" class="animate-spin text-sm" />
                    <Icon v-else-if="item.last_reregistration_at" icon="ph:check-bold" class="text-sm" />
                    <Icon v-else icon="ph:minus-bold" class="text-sm" />
                    <span>{{ item.last_reregistration_at ? t('dashboard.participants_list.reregistered') : t('dashboard.participants_list.not_reregistered') }}</span>
                </button>
            </template>

            <!-- Actions Column -->
            <template #actions="{ item }">
                <div class="flex items-center justify-end gap-1.5">
                    <BaseButton
                        :to="`/dashboard/organizer/tournaments/${eventId}/participants/detail?archer_id=${item.archer_id || item.athlete_code}`"
                        variant="white" size="sm" icon="ph:eye-bold"
                        class="h-8.5 w-8.5 p-0 text-slate-400 hover:text-navy border-slate-200 shadow-2xs"
                        :title="t('dashboard.participants_list.view_details')" />
                    <BaseButton
                        :to="`/dashboard/organizer/tournaments/${eventId}/participants/edit?archer_id=${item.archer_id || item.athlete_code}`"
                        variant="white" size="sm" icon="ph:pencil-simple-bold"
                        class="h-8.5 w-8.5 p-0 text-slate-400 hover:text-primary hover:border-primary/30 border-slate-200 shadow-2xs"
                        :title="t('dashboard.participants_list.edit_button')" />
                </div>
            </template>
        </DashboardDataTable>"""

content = content.replace(old_template_part, new_template_part)

# Add DashboardDataTable import and columns computed in script
content = content.replace(
    "import BasePagination from '~/components/common/BasePagination.vue'",
    "import DashboardDataTable from '~/components/common/DashboardDataTable.vue'\nimport { useImageOrDefault } from '~/composables/useImageHelper'"
)

# Update columns definition and sort handlers
old_sort_section = """// Table sorting state
const sortBy = ref('name')
const sortOrder = ref('asc')

const toggleSort = (field) => {
    if (sortBy.value === field) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortBy.value = field
        sortOrder.value = 'asc'
    }
    page.value = 1
    fetchParticipants()
}"""

new_sort_section = """// Table columns configuration
const isEn = computed(() => locale.value !== 'id')

const tableColumns = computed(() => {
    const cols = [
        { key: 'name', label: t('dashboard.participants_list.table.name_email'), sortable: true, width: 'w-[28%]' },
        { key: 'club', label: t('dashboard.participants_list.table.club_city'), sortable: true, width: 'w-[18%]' }
    ]
    if (hasActiveCategoryFilter.value) {
        cols.push({ key: 'category', label: t('dashboard.participants_list.table.category'), sortable: false, width: 'w-[22%]' })
    }
    cols.push(
        { key: 'payment_status', label: t('dashboard.participants_list.table.payment_status'), sortable: true, width: 'w-[16%]' },
        { key: 'reregistration', label: t('dashboard.participants_list.reregistration'), sortable: true, width: 'w-[16%]' }
    )
    return cols
})

// Table sorting state
const sortBy = ref('name')
const sortOrder = ref('asc')

const handleSortChange = () => {
    page.value = 1
    fetchParticipants()
}

const handlePageChange = (newPage) => {
    page.value = newPage
    fetchParticipants()
    window.scrollTo({ top: 0, behavior: 'smooth' })
}"""

content = content.replace(old_sort_section, new_sort_section)

# Update getDisplayStatus and getStatusClass
old_status_helpers = """const getDisplayStatus = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'lunas' || s === 'paid' || s === 'registered' || s === 'terdaftar') return t('dashboard.participants_list.status_options.paid')
    return t('dashboard.participants_list.status_options.pending')
}

const getStatusClass = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'paid' || s === 'lunas' || s === 'registered' || s === 'terdaftar') {
        return 'bg-green-50 text-green-600 border-green-200'
    }
    return 'bg-amber-50 text-amber-600 border-amber-200'
}"""

new_status_helpers = """const getDisplayStatus = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'lunas' || s === 'paid' || s === 'registered' || s === 'terdaftar') return t('dashboard.participants_list.status_options.paid')
    if (s === 'unpaid' || s === 'belum_bayar') return isEn.value ? 'Unpaid' : 'Belum Bayar'
    if (s === 'rejected' || s === 'ditolak') return isEn.value ? 'Rejected' : 'Ditolak'
    return t('dashboard.participants_list.status_options.pending')
}

const getStatusClass = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'paid' || s === 'lunas' || s === 'registered' || s === 'terdaftar') {
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
    if (s === 'unpaid' || s === 'belum_bayar') {
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
    if (s === 'rejected' || s === 'ditolak') {
        return 'bg-rose-50 text-rose-700 border-rose-200'
    }
    return 'bg-amber-50 text-amber-700 border-amber-200'
}"""

content = content.replace(old_status_helpers, new_status_helpers)

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(content)

print('participants/index.vue updated successfully!')

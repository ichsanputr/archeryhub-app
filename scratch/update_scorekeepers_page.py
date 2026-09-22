import re

target_file = r'c:\E\ichsan\startup\archeryhub.id\app\pages\dashboard\organizer\scorekeepers.vue'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the search bar and table container
old_content_middle = """        <!-- Search & Filter Controls -->
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="relative flex-1 w-full">
                <Icon icon="ph:magnifying-glass"
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input v-model="searchQuery" type="text"
                    :placeholder="t('organizer.scorekeepers.search_placeholder')"
                    class="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium" />
            </div>
            <div class="w-full sm:w-48 shrink-0">
                <BaseSelect v-model="statusFilter" :options="statusOptions" class="w-full" />
            </div>
            <BaseButton variant="white" icon="ph:funnel" @click="resetFilters"
                class="h-11 px-6 rounded-xl text-xs font-black tracking-widest shrink-0">
                {{ t('common.reset') }}
            </BaseButton>
        </div>

        <!-- Main Table Container -->
        <div
            class="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col overflow-hidden relative min-h-[400px]">
            <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <div class="flex items-center gap-3">
                    <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                        <Icon icon="ph:users-three-bold" class="text-xl" />
                    </div>
                    <div>
                        <h3 class="text-navy font-black text-base leading-tight">
                            {{ t('organizer.scorekeepers.table_title') }}
                        </h3>
                        <div class="text-xs text-slate-400 font-medium mt-0.5">{{ t('organizer.scorekeepers.table_desc') }}</div>
                    </div>
                </div>
                <span class="px-2.5 py-1 bg-navy/5 text-navy font-bold text-xs rounded-lg border border-navy/10">
                    {{ filteredScorekeepers.length }} {{ t('organizer.scorekeepers.staff_unit') }}
                </span>
            </div>
            <!-- Overlay Loading State -->
            <div v-if="loading && scorekeepers.length > 0"
                class="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <Icon icon="ph:circle-notch-bold" class="text-3xl text-navy animate-spin" />
            </div>

            <!-- Initial Loading State -->
            <div v-if="loading && scorekeepers.length === 0"
                class="flex flex-col items-center justify-center py-24 gap-4">
                <Icon icon="ph:spinner-bold" class="text-4xl text-navy animate-spin" />
                <div class="text-center">
                    <div class="text-navy font-bold text-sm">{{ t('common.loading') }}</div>
                    <div class="text-xs text-gray-400 font-medium">{{ t('organizer.scorekeepers.loading_desc') }}</div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!loading && scorekeepers.length === 0"
                class="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div class="size-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 text-gray-300 border border-gray-100 shadow-2xs">
                    <Icon icon="ph:user-focus-duotone" class="text-3xl text-gray-400" />
                </div>
                <div class="space-y-2 max-w-sm">
                    <h3 class="text-xl font-black text-navy tracking-tight">{{ t('organizer.scorekeepers.empty_title') }}</h3>
                    <div class="text-xs text-gray-500 leading-relaxed">
                        {{ t('organizer.scorekeepers.empty_desc') }}
                    </div>
                </div>
            </div>

            <!-- No Results State -->
            <div v-else-if="!loading && filteredScorekeepers.length === 0"
                class="flex flex-col items-center justify-center py-32 px-6 text-center">
                <div class="size-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-300 border border-gray-100 shadow-2xs">
                    <Icon icon="ph:magnifying-glass-duotone" class="text-3xl text-gray-400" />
                </div>
                <div class="space-y-1 mb-6">
                    <h3 class="text-lg font-bold text-navy">{{ t('common.no_results') }}</h3>
                    <div class="text-sm text-gray-500 max-w-xs mx-auto">
                        {{ t('common.no_results_desc') }} "<span class="font-bold text-navy">{{ searchQuery }}</span>".
                    </div>
                </div>
                <BaseButton @click="searchQuery = ''" variant="white" size="sm" class="font-bold text-xs rounded-xl">
                    {{ t('common.clear_search') }}
                </BaseButton>
            </div>

            <!-- Table View -->
            <div v-if="filteredScorekeepers.length > 0" class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50/50 border-b border-gray-100">
                            <th @click="toggleSort('name')"
                                class="px-6 py-4 text-xs font-extrabold text-gray-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                                <div class="flex items-center gap-2">
                                    {{ t('organizer.scorekeepers.table_profile') }}
                                    <Icon v-if="sortBy === 'name'"
                                        :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                                        class="text-primary" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                                </div>
                            </th>
                            <th @click="toggleSort('code')"
                                class="px-6 py-4 text-xs font-extrabold text-gray-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                                <div class="flex items-center gap-2">
                                    {{ t('organizer.scorekeepers.table_code') }}
                                    <Icon v-if="sortBy === 'code'"
                                        :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                                        class="text-primary" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                                </div>
                            </th>
                            <th @click="toggleSort('status')"
                                class="px-6 py-4 text-xs font-extrabold text-gray-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                                <div class="flex items-center gap-2">
                                    {{ t('organizer.scorekeepers.table_status') }}
                                    <Icon v-if="sortBy === 'status'"
                                        :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                                        class="text-primary" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                                </div>
                            </th>
                            <th @click="toggleSort('created_at')"
                                class="px-6 py-4 text-xs font-extrabold text-gray-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                                <div class="flex items-center gap-2">
                                    {{ t('organizer.scorekeepers.table_joined') }}
                                    <Icon v-if="sortBy === 'created_at'"
                                        :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                                        class="text-primary" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                                </div>
                            </th>
                            <th class="px-6 py-4 text-xs font-extrabold text-gray-400 tracking-widest text-right">
                                {{ t('common.actions') }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="sk in filteredScorekeepers" :key="sk.uuid"
                            class="hover:bg-gray-50/50 transition-all group">
                            <td class="px-6 py-5">
                                <div class="flex items-center gap-3.5">
                                    <div class="size-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                                        <img :src="useImageOrDefault(sk.avatar_url || sk.photo_url, sk.name)" :alt="sk.name"
                                            @error="(e) => e.target.src = generateDicebearAvatar(sk.name)"
                                            class="size-full object-cover" />
                                    </div>
                                    <div class="flex flex-col min-w-0">
                                        <span class="text-[15px] font-bold text-navy group-hover:text-primary-dark transition-colors">{{ sk.name }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-5">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-bold font-mono text-navy bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg tracking-wider">{{ sk.code }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-5">
                                <span
                                    :class="sk.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border">
                                    <span :class="sk.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'"
                                        class="h-1.5 w-1.5 rounded-full"></span>
                                    {{ sk.status === 'active' ? t('common.active') : t('common.inactive') }}
                                </span>
                            </td>
                            <td class="px-6 py-5 text-gray-500 text-xs font-semibold">
                                {{ formatDate(sk.created_at) }}
                            </td>
                            <td class="px-6 py-5 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <BaseButton
                                        @click="isSubscriptionActive ? openEditModal(sk) : (showPremiumModal = true)"
                                        variant="white" size="md" icon="ph:pencil-simple"
                                        class="!size-10 !p-0 text-slate-600 hover:text-navy hover:border-navy border-slate-200"
                                        :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }" />
                                    <BaseButton
                                        @click="isSubscriptionActive ? confirmDelete(sk) : (showPremiumModal = true)"
                                        variant="white" size="md" icon="ph:trash"
                                        class="!size-10 !p-0 text-rose-500 hover:text-rose-700 hover:border-rose-300 border-slate-200"
                                        :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Footer -->
            <div v-if="totalItems > 0" class="p-4 border-t border-gray-100 bg-gray-50/50">
                <BasePagination
                    :current-page="currentPage"
                    :total-items="totalItems"
                    :items-per-page="limit"
                    no-margin
                    @change-page="p => currentPage = p"
                    @update:items-per-page="sz => { limit = sz; currentPage = 1 }"
                />
            </div>
        </div>"""

new_content_middle = """        <!-- Unified Dashboard Table for Scorekeepers (Category B: Inline Filter) -->
        <DashboardDataTable
            :columns="tableColumns"
            :items="filteredScorekeepers"
            :loading="loading"
            :server-side="false"
            v-model:page="currentPage"
            v-model:perPage="limit"
            v-model:sortBy="sortBy"
            v-model:sortOrder="sortOrder"
            v-model:searchValue="searchQuery"
            :search-placeholder="t('organizer.scorekeepers.search_placeholder')"
            :has-filter-modal="false"
            count-icon="ph:users-three-bold"
            :count-unit="t('organizer.scorekeepers.staff_unit')"
            :empty-title="t('organizer.scorekeepers.empty_title')"
            :empty-description="t('organizer.scorekeepers.empty_desc')"
            empty-icon="ph:user-focus-duotone"
            @reset-filters="resetFilters"
        >
            <!-- Inline Status Filter Dropdown -->
            <template #inline-filters>
                <div class="w-40 sm:w-48 shrink-0">
                    <select
                        v-model="statusFilter"
                        class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-navy focus:outline-none focus:ring-1 focus:ring-navy cursor-pointer shadow-2xs"
                    >
                        <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                            {{ opt.label }}
                        </option>
                    </select>
                </div>
            </template>

            <!-- Name / Profile Column -->
            <template #item-name="{ item: sk }">
                <div class="flex items-center gap-3.5">
                    <div class="size-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                        <img :src="useImageOrDefault(sk.avatar_url || sk.photo_url, sk.name)" :alt="sk.name"
                            @error="(e) => e.target.src = generateDicebearAvatar(sk.name)"
                            class="size-full object-cover" />
                    </div>
                    <div class="flex flex-col min-w-0">
                        <span class="text-xs sm:text-sm font-bold text-navy group-hover:text-primary-dark transition-colors truncate">{{ sk.name }}</span>
                    </div>
                </div>
            </template>

            <!-- Code Column -->
            <template #item-code="{ item: sk }">
                <span class="text-xs font-bold font-mono text-navy bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg tracking-wider shadow-2xs">
                    {{ sk.code }}
                </span>
            </template>

            <!-- Status Column -->
            <template #item-status="{ item: sk }">
                <span
                    :class="sk.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs">
                    <span :class="sk.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'"
                        class="h-1.5 w-1.5 rounded-full"></span>
                    {{ sk.status === 'active' ? t('common.active') : t('common.inactive') }}
                </span>
            </template>

            <!-- Created At Column -->
            <template #item-created_at="{ item: sk }">
                <span class="text-slate-500 text-xs font-medium">
                    {{ formatDate(sk.created_at) }}
                </span>
            </template>

            <!-- Actions Column -->
            <template #actions="{ item: sk }">
                <div class="flex items-center justify-end gap-1.5">
                    <BaseButton
                        @click="isSubscriptionActive ? openEditModal(sk) : (showPremiumModal = true)"
                        variant="white" size="sm" icon="ph:pencil-simple-bold"
                        class="h-8.5 w-8.5 p-0 text-slate-600 hover:text-navy border-slate-200 shadow-2xs"
                        :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                        :title="t('common.edit')" />
                    <BaseButton
                        @click="isSubscriptionActive ? confirmDelete(sk) : (showPremiumModal = true)"
                        variant="white" size="sm" icon="ph:trash-bold"
                        class="h-8.5 w-8.5 p-0 text-rose-500 hover:text-rose-700 hover:border-rose-300 border-slate-200 shadow-2xs"
                        :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                        :title="t('common.delete')" />
                </div>
            </template>
        </DashboardDataTable>"""

content = content.replace(old_content_middle, new_content_middle)

# Replace imports and add columns in script
content = content.replace(
    "import BasePagination from '~/components/common/BasePagination.vue'",
    "import DashboardDataTable from '~/components/common/DashboardDataTable.vue'"
)

old_sk_script_state = """const sortBy = ref('name')
const order = ref('ASC')
const currentPage = ref(1)
const limit = ref(10)"""

new_sk_script_state = """const sortBy = ref('name')
const sortOrder = ref('asc')
const currentPage = ref(1)
const limit = ref(10)

const tableColumns = computed(() => [
    { key: 'name', label: t('organizer.scorekeepers.table_profile'), sortable: true, width: 'w-[32%]' },
    { key: 'code', label: t('organizer.scorekeepers.table_code'), sortable: true, width: 'w-[20%]' },
    { key: 'status', label: t('organizer.scorekeepers.table_status'), sortable: true, width: 'w-[20%]' },
    { key: 'created_at', label: t('organizer.scorekeepers.table_joined'), sortable: true, width: 'w-[28%]' }
])"""

content = content.replace(old_sk_script_state, new_sk_script_state)

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(content)

print('scorekeepers.vue updated successfully!')

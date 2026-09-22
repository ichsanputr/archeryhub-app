import re

target_file = r'c:\E\ichsan\startup\archeryhub.id\app\pages\dashboard\organizer\tournaments\[id]\certificate.vue'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace from Search and Filter Bar down to before Modal 1
old_table_block = """    <!-- Row 2: Search & Filter Bar (Compact Modern Header) -->
    <div class="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
      <div class="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <!-- Search Input with Clear Button -->
        <div class="relative flex-1 w-full">
          <Icon
            icon="ph:magnifying-glass"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('org_certificate.search_placeholder')"
            class="w-full pl-11 pr-10 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all text-xs sm:text-sm font-medium"
          />
          <button
            v-if="searchQuery"
            type="button"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            :title="t('common.clear')"
          >
            <Icon icon="ph:x-circle-fill" class="text-base" />
          </button>
        </div>

        <!-- Single Filter Trigger Button, Reset, Clear All, and Counter -->
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

          <button
            v-if="certificatesList.length > 0"
            @click="promptClearAll"
            :disabled="isClearing"
            type="button"
            class="h-11 px-3.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
            :title="t('org_certificate.btn_clear_all')">
            <Icon icon="ph:trash-bold" />
            <span class="hidden sm:inline">{{ t('org_certificate.btn_clear_all') }}</span>
          </button>

          <div class="px-3.5 py-2.5 bg-navy/5 text-navy rounded-xl font-black text-xs border border-navy/10 flex items-center gap-1.5 shrink-0">
            <Icon icon="ph:users-three-bold" class="text-sm text-navy/70" />
            <span>{{ filteredArchersList.length }} {{ t('dashboard.participants_list.archers_unit') }}</span>
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
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs group hover:border-slate-300 transition-colors"
        >
          <span class="truncate max-w-[260px] text-navy font-bold leading-none">{{ chip.label }}</span>
          <button
            type="button"
            @click="removeFilterChip(chip.key)"
            class="text-slate-400 hover:text-red-500 rounded-full p-0.5 transition-colors cursor-pointer inline-flex items-center justify-center shrink-0"
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

    <!-- Row 3: Participants Certificate Roster Table -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="py-20 text-center space-y-3">
        <Icon icon="ph:spinner-gap-bold" class="text-3xl text-primary animate-spin mx-auto" />
        <div class="text-xs sm:text-sm text-slate-400 font-bold">{{ t('common.loading') }}</div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredArchersList.length === 0" class="py-20 text-center space-y-3">
        <div class="size-14 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center mx-auto shadow-xs">
          <Icon icon="ph:certificate-bold" class="text-2xl text-navy" />
        </div>
        <div class="space-y-1">
          <h4 class="text-sm sm:text-base font-black text-navy">{{ t('org_certificate.empty_certs_title') }}</h4>
          <div class="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            {{ hasActiveFilters ? t('org_certificate.empty_filtered_desc') : t('org_certificate.empty_initial_desc') }}
          </div>
        </div>
      </div>

      <!-- Main Roster Table (1 Archer = 1 Row) -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200/80 text-xs sm:text-sm font-bold text-slate-500 tracking-wider">
              <th class="py-4 px-5 w-14 text-center">#</th>
              <th @click="toggleSort('name')" class="py-4 px-5 cursor-pointer hover:text-navy transition-colors select-none">
                <div class="flex items-center gap-1.5">
                  <span>{{ t('org_certificate.th_archer') }}</span>
                  <Icon v-if="sortBy === 'name'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                </div>
              </th>
              <th class="py-4 px-5">
                <span>{{ t('org_certificate.th_category') }}</span>
              </th>
              <th class="py-4 px-5">
                <span>{{ t('org_certificate.th_status') }}</span>
              </th>
              <th class="py-4 px-5 text-right">{{ t('org_certificate.th_action') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <tr
              v-for="(row, idx) in paginatedArchersList"
              :key="row.archer_id || row.athlete_code || row.id || row.uuid"
              class="hover:bg-slate-50/70 transition-colors group">
              <!-- Index Number -->
              <td class="py-4 px-5 font-mono font-bold text-slate-400 text-center text-xs sm:text-sm align-middle">
                {{ (currentPage - 1) * itemsPerPage + idx + 1 }}
              </td>

              <!-- Archer & Club -->
              <td class="py-4 px-5 align-middle">
                <div class="flex items-center gap-3">
                  <div class="size-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-navy text-xs overflow-hidden shrink-0">
                    <img
                      :src="useImageOrDefault(row.avatar_url, row.full_name)"
                      :alt="row.full_name || 'Archer'"
                      @error="(e) => e.target.src = generateDicebearAvatar(row.full_name)"
                      class="size-full object-cover" />
                  </div>
                  <div class="min-w-0">
                    <div class="font-black text-navy text-xs sm:text-sm truncate">{{ row.full_name || '-' }}</div>
                    <div class="text-[11px] sm:text-xs text-slate-400 font-medium truncate flex items-center gap-1.5 mt-0.5">
                      <span v-if="row.athlete_code" class="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        {{ row.athlete_code }}
                      </span>
                      <span>{{ row.club_name || '-' }}</span>
                      <span v-if="row.email" class="hidden md:inline text-slate-400 font-normal">({{ row.email }})</span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Category (all categories of the archer) -->
              <td class="py-4 px-5 align-middle">
                <div class="flex flex-wrap gap-1.5 max-w-sm">
                  <span
                    v-for="cat in row.categories"
                    :key="cat"
                    class="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg text-[10px] sm:text-xs border border-slate-200 truncate">
                    {{ cat }}
                  </span>
                  <span v-if="!row.categories || row.categories.length === 0" class="text-xs text-slate-400">-</span>
                </div>
              </td>

              <!-- Certificate Status (per archer) -->
              <td class="py-4 px-5 align-middle">
                <div v-if="row.certificates && row.certificates.length > 0" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-navy text-white shadow-xs">
                  <Icon icon="ph:check-bold" class="text-xs text-white" />
                  <span>{{ t('org_certificate.status_issued') }}</span>
                  <span v-if="row.certificates.length > 1" class="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                    {{ row.certificates.length }} {{ t('org_certificate.files_count') }}
                  </span>
                </div>
                <div v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                  <Icon icon="ph:clock-bold" class="text-xs" />
                  <span>{{ t('org_certificate.status_pending') }}</span>
                </div>
              </td>

              <!-- Action Buttons (1 Unified Action Block per Archer) -->
              <td class="py-4 px-5 text-right whitespace-nowrap align-middle">
                <!-- Case 1: No Certificates Yet -->
                <div v-if="!row.certificates || row.certificates.length === 0" class="flex items-center justify-end">
                  <button
                    @click="openSingleUpload(row)"
                    type="button"
                    :disabled="isSingleUploading[getArcherKey(row)]"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-navy hover:text-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    <Icon v-if="isSingleUploading[getArcherKey(row)]" icon="ph:spinner-gap-bold" class="animate-spin text-sm" />
                    <Icon v-else icon="ph:upload-simple-bold" />
                    <span>{{ isSingleUploading[getArcherKey(row)] ? t('common.loading') : t('org_certificate.btn_upload_single') }}</span>
                  </button>
                </div>

                <!-- Case 2: Exactly 1 Certificate -->
                <div v-else-if="row.certificates.length === 1" class="flex items-center justify-end gap-1.5">
                  <button
                    @click="openPdfPreview(row.certificates[0].pdf_url, `${row.full_name} - ${row.certificates[0].original_filename || 'Sertifikat'}`)"
                    type="button"
                    class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy transition-colors cursor-pointer"
                    :title="t('org_certificate.btn_preview')">
                    <Icon icon="ph:eye-bold" class="text-sm" />
                  </button>

                  <a
                    :href="getImageUrl(row.certificates[0].pdf_url)"
                    target="_blank"
                    download
                    class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy transition-colors cursor-pointer"
                    :title="t('org_certificate.btn_download')">
                    <Icon icon="ph:download-simple-bold" class="text-sm" />
                  </a>

                  <button
                    @click="promptDeleteCert(row.certificates[0].uuid, `${row.full_name} (${row.certificates[0].original_filename || row.certificates[0].certificate_no})`)"
                    type="button"
                    class="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    :title="t('org_certificate.btn_delete')">
                    <Icon icon="ph:trash-bold" class="text-sm" />
                  </button>

                  <button
                    @click="openSingleUpload(row)"
                    type="button"
                    :disabled="isSingleUploading[getArcherKey(row)]"
                    class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-navy hover:text-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    :title="t('org_certificate.btn_add_more')">
                    <Icon v-if="isSingleUploading[getArcherKey(row)]" icon="ph:spinner-gap-bold" class="animate-spin text-xs" />
                    <Icon v-else icon="ph:plus-bold" class="text-xs" />
                    <span class="hidden sm:inline text-xs font-bold">{{ isSingleUploading[getArcherKey(row)] ? '...' : t('org_certificate.btn_add') }}</span>
                  </button>
                </div>

                <!-- Case 3: Multiple Certificates (> 1) -->
                <div v-else class="flex items-center justify-end gap-2">
                  <button
                    @click="openMultiCertModal(row)"
                    type="button"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-navy hover:text-white text-navy font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer shadow-2xs"
                    :title="t('org_certificate.btn_manage_certs')">
                    <Icon icon="ph:files-bold" class="text-sm" />
                    <span>{{ row.certificates.length }} {{ t('org_certificate.files_count') }}</span>
                  </button>

                  <button
                    @click="openSingleUpload(row)"
                    type="button"
                    :disabled="isSingleUploading[getArcherKey(row)]"
                    class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-navy hover:text-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    :title="t('org_certificate.btn_add_more')">
                    <Icon v-if="isSingleUploading[getArcherKey(row)]" icon="ph:spinner-gap-bold" class="animate-spin text-xs" />
                    <Icon v-else icon="ph:plus-bold" class="text-xs" />
                    <span class="hidden sm:inline text-xs font-bold">{{ isSingleUploading[getArcherKey(row)] ? '...' : t('org_certificate.btn_add') }}</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Pagination Footer -->
      <div v-if="filteredArchersList.length > 0" class="p-4 sm:p-5 border-t border-slate-100 bg-white">
        <BasePagination
          :current-page="currentPage"
          :total-items="filteredArchersList.length"
          :items-per-page="itemsPerPage"
          :show-page-size="true"
          :show-info="true"
          no-margin
          @update:current-page="currentPage = $event"
          @update:items-per-page="itemsPerPage = $event"
        />
      </div>
    </div>"""

new_table_block = """    <!-- Unified Dashboard Table for Certificates -->
    <DashboardDataTable
      :columns="tableColumns"
      :items="filteredArchersList"
      :loading="isLoading"
      :server-side="false"
      v-model:page="currentPage"
      v-model:perPage="itemsPerPage"
      v-model:sortBy="sortBy"
      v-model:sortOrder="sortOrder"
      v-model:searchValue="searchQuery"
      :search-placeholder="t('org_certificate.search_placeholder')"
      :has-filter-modal="true"
      :active-filter-count="activeFilterCount"
      :active-filter-chips="activeFilterChips"
      count-icon="ph:users-three-bold"
      :count-unit="t('dashboard.participants_list.archers_unit')"
      :empty-title="t('org_certificate.empty_certs_title')"
      :empty-description="hasActiveFilters ? t('org_certificate.empty_filtered_desc') : t('org_certificate.empty_initial_desc')"
      empty-icon="ph:certificate-bold"
      @open-filter="showFilterModal = true"
      @remove-chip="removeFilterChip"
      @reset-filters="resetAllFilters"
    >
      <!-- Custom Clear All Button in Toolbar Actions -->
      <template #toolbar-actions>
        <button
          v-if="certificatesList.length > 0"
          @click="promptClearAll"
          :disabled="isClearing"
          type="button"
          class="h-10 px-3.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-2xs"
          :title="t('org_certificate.btn_clear_all')">
          <Icon icon="ph:trash-bold" class="text-xs sm:text-sm" />
          <span class="hidden sm:inline">{{ t('org_certificate.btn_clear_all') }}</span>
        </button>
      </template>

      <!-- Archer Column -->
      <template #item-name="{ item: row }">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-navy text-xs overflow-hidden shrink-0 shadow-2xs">
            <img
              :src="useImageOrDefault(row.avatar_url, row.full_name)"
              :alt="row.full_name || 'Archer'"
              @error="(e) => e.target.src = generateDicebearAvatar(row.full_name)"
              class="size-full object-cover" />
          </div>
          <div class="min-w-0">
            <div class="font-black text-navy text-xs sm:text-sm truncate">{{ row.full_name || '-' }}</div>
            <div class="text-[11px] sm:text-xs text-slate-400 font-medium truncate flex items-center gap-1.5 mt-0.5">
              <span v-if="row.athlete_code" class="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                {{ row.athlete_code }}
              </span>
              <span>{{ row.club_name || '-' }}</span>
              <span v-if="row.email" class="hidden md:inline text-slate-400 font-normal">({{ row.email }})</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Category Column -->
      <template #item-category="{ item: row }">
        <div class="flex flex-wrap gap-1.5 max-w-sm">
          <span
            v-for="cat in row.categories"
            :key="cat"
            class="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg text-[10px] sm:text-xs border border-slate-200 truncate">
            {{ cat }}
          </span>
          <span v-if="!row.categories || row.categories.length === 0" class="text-xs text-slate-400">-</span>
        </div>
      </template>

      <!-- Status Column -->
      <template #item-status="{ item: row }">
        <div v-if="row.certificates && row.certificates.length > 0" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-navy text-primary shadow-2xs">
          <Icon icon="ph:check-bold" class="text-xs text-primary" />
          <span>{{ t('org_certificate.status_issued') }}</span>
          <span v-if="row.certificates.length > 1" class="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-md font-mono">
            {{ row.certificates.length }} {{ t('org_certificate.files_count') }}
          </span>
        </div>
        <div v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
          <Icon icon="ph:clock-bold" class="text-xs" />
          <span>{{ t('org_certificate.status_pending') }}</span>
        </div>
      </template>

      <!-- Actions Column -->
      <template #actions="{ item: row }">
        <!-- Case 1: No Certificates Yet -->
        <div v-if="!row.certificates || row.certificates.length === 0" class="flex items-center justify-end">
          <button
            @click="openSingleUpload(row)"
            type="button"
            :disabled="isSingleUploading[getArcherKey(row)]"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-navy hover:text-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs">
            <Icon v-if="isSingleUploading[getArcherKey(row)]" icon="ph:spinner-gap-bold" class="animate-spin text-sm" />
            <Icon v-else icon="ph:upload-simple-bold" />
            <span>{{ isSingleUploading[getArcherKey(row)] ? t('common.loading') : t('org_certificate.btn_upload_single') }}</span>
          </button>
        </div>

        <!-- Case 2: Exactly 1 Certificate -->
        <div v-else-if="row.certificates.length === 1" class="flex items-center justify-end gap-1.5">
          <button
            @click="openPdfPreview(row.certificates[0].pdf_url, `${row.full_name} - ${row.certificates[0].original_filename || 'Sertifikat'}`)"
            type="button"
            class="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-navy transition-colors cursor-pointer shadow-2xs"
            :title="t('org_certificate.btn_preview')">
            <Icon icon="ph:eye-bold" class="text-sm" />
          </button>

          <a
            :href="getImageUrl(row.certificates[0].pdf_url)"
            target="_blank"
            download
            class="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-navy transition-colors cursor-pointer shadow-2xs"
            :title="t('org_certificate.btn_download')">
            <Icon icon="ph:download-simple-bold" class="text-sm" />
          </a>

          <button
            @click="promptDeleteCert(row.certificates[0].uuid, `${row.full_name} (${row.certificates[0].original_filename || row.certificates[0].certificate_no})`)"
            type="button"
            class="p-2 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer shadow-2xs"
            :title="t('org_certificate.btn_delete')">
            <Icon icon="ph:trash-bold" class="text-sm" />
          </button>

          <button
            @click="openSingleUpload(row)"
            type="button"
            :disabled="isSingleUploading[getArcherKey(row)]"
            class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-navy hover:text-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
            :title="t('org_certificate.btn_add_more')">
            <Icon v-if="isSingleUploading[getArcherKey(row)]" icon="ph:spinner-gap-bold" class="animate-spin text-xs" />
            <Icon v-else icon="ph:plus-bold" class="text-xs" />
            <span class="hidden sm:inline text-xs font-bold">{{ isSingleUploading[getArcherKey(row)] ? '...' : t('org_certificate.btn_add') }}</span>
          </button>
        </div>

        <!-- Case 3: Multiple Certificates (> 1) -->
        <div v-else class="flex items-center justify-end gap-2">
          <button
            @click="openMultiCertModal(row)"
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-navy hover:text-white text-navy font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer shadow-2xs"
            :title="t('org_certificate.btn_manage_certs')">
            <Icon icon="ph:files-bold" class="text-sm" />
            <span>{{ row.certificates.length }} {{ t('org_certificate.files_count') }}</span>
          </button>

          <button
            @click="openSingleUpload(row)"
            type="button"
            :disabled="isSingleUploading[getArcherKey(row)]"
            class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-navy hover:text-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
            :title="t('org_certificate.btn_add_more')">
            <Icon v-if="isSingleUploading[getArcherKey(row)]" icon="ph:spinner-gap-bold" class="animate-spin text-xs" />
            <Icon v-else icon="ph:plus-bold" class="text-xs" />
            <span class="hidden sm:inline text-xs font-bold">{{ isSingleUploading[getArcherKey(row)] ? '...' : t('org_certificate.btn_add') }}</span>
          </button>
        </div>
      </template>
    </DashboardDataTable>"""

content = content.replace(old_table_block, new_table_block)

# Add DashboardDataTable import and columns computed
content = content.replace(
    "import BasePagination from '~/components/common/BasePagination.vue'",
    "import DashboardDataTable from '~/components/common/DashboardDataTable.vue'"
)

old_cert_script_sort = """// ─── PAGINATION & SORTING STATE ────────────────────────────────────────────────
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref('name')
const sortOrder = ref('asc')

const toggleSort = (field) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}"""

new_cert_script_sort = """// ─── PAGINATION & SORTING STATE ────────────────────────────────────────────────
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref('name')
const sortOrder = ref('asc')

const tableColumns = computed(() => [
  { key: 'name', label: t('org_certificate.th_archer'), sortable: true, width: 'w-[32%]' },
  { key: 'category', label: t('org_certificate.th_category'), sortable: false, width: 'w-[28%]' },
  { key: 'status', label: t('org_certificate.th_status'), sortable: false, width: 'w-[20%]' }
])

const toggleSort = (field) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}"""

content = content.replace(old_cert_script_sort, new_cert_script_sort)

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(content)

print('certificate.vue updated successfully!')

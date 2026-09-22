<template>
  <div class="flex flex-col gap-6 pb-16 font-body text-navy antialiased">
    <!-- Header -->
    <DashboardHeader
      :title="t('org_certificate.header_title')"
      :subtitle="t('org_certificate.header_subtitle')"
      icon="ph:certificate-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('events.list.title'), to: '/dashboard/organizer/tournaments' },
        { label: t('org_certificate.header_title') }
      ]"
    >
      <template #actions>
        <BaseButton
          @click="showUploadModal = true"
          variant="primary"
          icon="ph:cloud-arrow-up-bold"
          class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-black tracking-widest">
          <span>{{ t('org_certificate.bulk_upload_btn') }}</span>
        </BaseButton>
      </template>
    </DashboardHeader>

    <!-- Row 1: KPI Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Total Peserta -->
      <StatCard
        :title="t('org_certificate.stats_total')"
        :value="enrichedArchersList.length"
        icon="ph:users"
        color="primary"
        :description="t('org_certificate.stats_total_desc')"
        description-icon="ph:users-bold"
      />

      <!-- Peserta Lunas (Eligible) -->
      <StatCard
        :title="t('org_certificate.stats_paid')"
        :value="eligibleParticipantsCount"
        icon="ph:check-circle-bold"
        color="primary"
        :description="t('org_certificate.stats_paid_desc')"
        description-icon="ph:check-circle-bold"
      />

      <!-- Sertifikat Terbit -->
      <StatCard
        :title="t('org_certificate.stats_issued')"
        :value="certificatesList.length"
        icon="ph:certificate-bold"
        color="primary"
        :description="t('org_certificate.stats_issued_desc')"
        description-icon="ph:download-simple-bold"
      />

      <!-- Tingkat Penyelesaian -->
      <StatCard
        :title="t('org_certificate.stats_completion')"
        :value="completionRate + '%'"
        icon="ph:check-square-offset"
        color="primary"
      >
        <template #footer>
          <div class="w-full bg-gray-100 rounded-full h-1.5 mt-auto">
            <div class="bg-primary h-1.5 rounded-full transition-all duration-700" :style="`width: ${completionRate}%`"></div>
          </div>
        </template>
      </StatCard>
    </div>

    <CertificateFilterModal
      v-model:show="showFilterModal"
      :categories="uniqueCategories"
      :current-filters="filters"
      @apply="handleApplyModalFilters"
      @reset="resetAllFilters"
    />

    <!-- Certificate Filter Modal -->
    <CertificateFilterModal
      v-model:show="showFilterModal"
      :categories="uniqueCategories"
      :current-filters="filters"
      @apply="handleApplyModalFilters"
      @reset="resetAllFilters"
    />

    <!-- Unified DashboardDataTable (Category A: Modal Filter) -->
    <DashboardDataTable
      :items="filteredArchersList"
      :columns="tableColumns"
      :loading="isLoading"
      :searchable="true"
      :search-placeholder="t('org_certificate.search_placeholder')"
      :has-filter-modal="true"
      :filter-button-label="t('common.filter')"
      :active-filter-count="activeFilterCount"
      :active-filter-chips="activeFilterChips"
      :show-reset-button="hasActiveFilters"
      count-icon="ph:users-three-bold"
      :count-unit="t('dashboard.participants_list.archers_unit')"
      :show-count-badge="true"
      :empty-title="t('org_certificate.empty_certs_title')"
      :empty-description="hasActiveFilters ? t('org_certificate.empty_filtered_desc') : t('org_certificate.empty_initial_desc')"
      empty-icon="ph:certificate-bold"
      :items-per-page="itemsPerPage"
      :initial-sort-by="sortBy"
      :initial-sort-order="sortOrder"
      @search="handleTableSearch"
      @sort="handleTableSort"
      @open-filter="showFilterModal = true"
      @reset-filters="resetAllFilters"
      @remove-chip="removeFilterChip"
    >
      <!-- Toolbar Actions Slot: Clear All Certificates Button -->
      <template #toolbar-actions>
        <button
          v-if="certificatesList.length > 0"
          @click="promptClearAll"
          :disabled="isClearing"
          type="button"
          class="h-10 px-3.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-2xs"
          :title="t('org_certificate.btn_clear_all')"
        >
          <Icon icon="ph:trash-bold" />
          <span class="hidden sm:inline">{{ t('org_certificate.btn_clear_all') }}</span>
        </button>
      </template>

      <!-- Archer & Club Profile Slot -->
      <template #item-profile="{ item }">
        <div class="flex items-center gap-3 py-1">
          <div class="size-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-navy text-xs overflow-hidden shrink-0 shadow-2xs">
            <img
              :src="useImageOrDefault(item.avatar_url, item.full_name)"
              :alt="item.full_name || 'Archer'"
              @error="(e) => e.target.src = generateDicebearAvatar(item.full_name)"
              class="size-full object-cover"
            />
          </div>
          <div class="min-w-0">
            <div class="font-black text-navy text-xs sm:text-sm truncate">{{ item.full_name || '-' }}</div>
            <div class="text-[11px] sm:text-xs text-slate-400 font-medium truncate flex items-center gap-1.5 mt-0.5">
              <span v-if="item.athlete_code" class="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                {{ item.athlete_code }}
              </span>
              <span>{{ item.club_name || '-' }}</span>
              <span v-if="item.email" class="hidden md:inline text-slate-400 font-normal">({{ item.email }})</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Category Column Slot -->
      <template #item-category="{ item }">
        <div class="flex flex-wrap gap-1.5 max-w-sm py-1">
          <span
            v-for="cat in item.categories"
            :key="cat"
            class="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg text-[10px] sm:text-xs border border-slate-200 truncate"
          >
            {{ cat }}
          </span>
          <span v-if="!item.categories || item.categories.length === 0" class="text-xs text-slate-400">-</span>
        </div>
      </template>

      <!-- Status Column Slot -->
      <template #item-status="{ item }">
        <div class="py-1">
          <div v-if="item.certificates && item.certificates.length > 0" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-navy text-white shadow-2xs">
            <Icon icon="ph:check-bold" class="text-xs text-white" />
            <span>{{ t('org_certificate.status_issued') }}</span>
            <span v-if="item.certificates.length > 1" class="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
              {{ item.certificates.length }} {{ t('org_certificate.files_count') }}
            </span>
          </div>
          <div v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
            <Icon icon="ph:clock-bold" class="text-xs" />
            <span>{{ t('org_certificate.status_pending') }}</span>
          </div>
        </div>
      </template>

      <!-- Action Buttons Slot (1 Unified Action Block per Archer) -->
      <template #actions="{ item }">
        <div class="flex items-center justify-end gap-1.5 py-1">
          <!-- Case 1: No Certificates Yet -->
          <div v-if="!item.certificates || item.certificates.length === 0" class="flex items-center justify-end">
            <button
              @click="openSingleUpload(item)"
              type="button"
              :disabled="isSingleUploading[getArcherKey(item)]"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-navy hover:text-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
            >
              <Icon v-if="isSingleUploading[getArcherKey(item)]" icon="ph:spinner-gap-bold" class="animate-spin text-sm" />
              <Icon v-else icon="ph:upload-simple-bold" />
              <span>{{ isSingleUploading[getArcherKey(item)] ? t('common.loading') : t('org_certificate.btn_upload_single') }}</span>
            </button>
          </div>

          <!-- Case 2: Exactly 1 Certificate -->
          <div v-else-if="item.certificates.length === 1" class="flex items-center justify-end gap-1.5">
            <button
              @click="openPdfPreview(item.certificates[0].pdf_url, `${item.full_name} - ${item.certificates[0].original_filename || 'Sertifikat'}`)"
              type="button"
              class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy transition-colors cursor-pointer shadow-2xs"
              :title="t('org_certificate.btn_preview')"
            >
              <Icon icon="ph:eye-bold" class="text-sm" />
            </button>

            <a
              :href="getImageUrl(item.certificates[0].pdf_url)"
              target="_blank"
              download
              class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy transition-colors cursor-pointer shadow-2xs"
              :title="t('org_certificate.btn_download')"
            >
              <Icon icon="ph:download-simple-bold" class="text-sm" />
            </a>

            <button
              @click="promptDeleteCert(item.certificates[0].uuid, `${item.full_name} (${item.certificates[0].original_filename || item.certificates[0].certificate_no})`)"
              type="button"
              class="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer shadow-2xs"
              :title="t('org_certificate.btn_delete')"
            >
              <Icon icon="ph:trash-bold" class="text-sm" />
            </button>

            <button
              @click="openSingleUpload(item)"
              type="button"
              :disabled="isSingleUploading[getArcherKey(item)]"
              class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-navy hover:text-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
              :title="t('org_certificate.btn_add_more')"
            >
              <Icon v-if="isSingleUploading[getArcherKey(item)]" icon="ph:spinner-gap-bold" class="animate-spin text-xs" />
              <Icon v-else icon="ph:plus-bold" class="text-xs" />
              <span class="hidden sm:inline text-xs font-bold">{{ isSingleUploading[getArcherKey(item)] ? '...' : t('org_certificate.btn_add') }}</span>
            </button>
          </div>

          <!-- Case 3: Multiple Certificates (> 1) -->
          <div v-else class="flex items-center justify-end gap-2">
            <button
              @click="openMultiCertModal(item)"
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-navy hover:text-white text-navy font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer shadow-2xs"
              :title="t('org_certificate.btn_manage_certs')"
            >
              <Icon icon="ph:files-bold" class="text-sm" />
              <span>{{ item.certificates.length }} {{ t('org_certificate.files_count') }}</span>
            </button>

            <button
              @click="openSingleUpload(item)"
              type="button"
              :disabled="isSingleUploading[getArcherKey(item)]"
              class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-navy hover:text-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
              :title="t('org_certificate.btn_add_more')"
            >
              <Icon v-if="isSingleUploading[getArcherKey(item)]" icon="ph:spinner-gap-bold" class="animate-spin text-xs" />
              <Icon v-else icon="ph:plus-bold" class="text-xs" />
              <span class="hidden sm:inline text-xs font-bold">{{ isSingleUploading[getArcherKey(item)] ? '...' : t('org_certificate.btn_add') }}</span>
            </button>
          </div>
        </div>
      </template>
    </DashboardDataTable>

    <!-- Modal 1: Upload Modal (ZIP / Multi-PDF) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div
        v-if="showUploadModal"
        class="fixed inset-0 z-50 overflow-y-auto bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="closeUploadModal">
        <div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
          <!-- Modal Header -->
          <div class="px-6 py-5 bg-gradient-to-r from-navy to-navy/90 text-white flex items-center justify-between border-b border-primary/20">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 text-white">
                <Icon icon="ph:cloud-arrow-up-bold" class="text-2xl" />
              </div>
              <div>
                <h3 class="text-lg font-black tracking-tight">{{ t('org_certificate.bulk_upload_title') }}</h3>
                <div class="text-xs text-slate-300">{{ t('org_certificate.bulk_upload_subtitle') }}</div>
              </div>
            </div>
            <button
              @click="closeUploadModal"
              class="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer">
              <Icon icon="ph:x-bold" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            <!-- Naming Guide Pill Box -->
            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div class="flex items-center gap-2 text-xs font-bold text-navy">
                <Icon icon="ph:info-bold" class="text-primary text-base" />
                <span>{{ t('org_certificate.naming_guide_title') }}</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <div class="font-black text-navy">{{ t('org_certificate.naming_format_a_title') }}</div>
                  <div class="font-mono text-slate-500 truncate text-[10px]">ARC-0012_Recurve-Men.pdf</div>
                  <div class="font-mono text-slate-400 truncate text-[10px]">Budi_Barebow.png</div>
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <div class="font-black text-navy">{{ t('org_certificate.naming_format_b_title') }}</div>
                  <div class="font-mono text-slate-500 truncate text-[10px]">Budi Santoso/Recurve.pdf</div>
                  <div class="font-mono text-slate-400 truncate text-[10px]">ARC-0012/Barebow.jpg</div>
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <div class="font-black text-navy">{{ t('org_certificate.naming_format_c_title') }}</div>
                  <div class="font-mono text-slate-500 truncate text-[10px]">Recurve Men/Ahmad.pdf</div>
                  <div class="font-mono text-slate-400 truncate text-[10px]">Semua folder diekstrak otomatis</div>
                </div>
              </div>
            </div>

            <!-- Drag & Drop Dropzone -->
            <div
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
              class="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group relative flex flex-col items-center justify-center gap-3 bg-slate-50/50"
              :class="isDragging ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-slate-200 hover:border-navy hover:bg-slate-50'">
              <input
                type="file"
                ref="fileInputRef"
                accept=".zip,.rar"
                multiple
                class="hidden"
                @change="handleFileInputChange" />

              <div class="size-14 rounded-2xl bg-navy text-white group-hover:scale-105 transition-all flex items-center justify-center shadow-xs">
                <Icon v-if="!isBulkUploading" icon="ph:file-archive-bold" class="text-2xl" />
                <Icon v-else icon="ph:spinner-gap-bold" class="text-2xl animate-spin" />
              </div>

              <div v-if="!isBulkUploading" class="space-y-1">
                <div class="text-sm font-black text-navy transition-colors">
                  {{ t('org_certificate.dropzone_title') }}
                </div>
                <div class="text-xs text-slate-400 font-medium">
                  {{ t('org_certificate.dropzone_subtitle') }}
                </div>
              </div>

              <div v-else class="space-y-2 max-w-xs w-full">
                <div class="text-xs font-bold text-navy">{{ t('org_certificate.uploading') }}</div>
                <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div class="bg-primary h-full rounded-full animate-pulse" style="width: 100%"></div>
                </div>
              </div>
            </div>

            <!-- Upload Result & Unmatched Files Resolver -->
            <div v-if="uploadResult" class="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div class="flex items-center justify-between border-b border-slate-200 pb-3">
                <div class="text-xs font-black text-navy flex items-center gap-2">
                  <Icon icon="ph:chart-donut-bold" class="text-primary text-base" />
                  <span>{{ t('org_certificate.batch_result_title') }}</span>
                </div>
                <span class="text-[11px] font-mono text-slate-400">{{ uploadResult.batch_id ? `Batch: ${uploadResult.batch_id.slice(0, 8)}` : '' }}</span>
              </div>

              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <div class="text-[11px] font-bold text-slate-500">{{ t('org_certificate.total_files') }}</div>
                  <div class="text-lg font-black text-navy mt-0.5 font-mono">{{ uploadResult.total_files || 0 }}</div>
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <div class="text-[11px] font-bold text-slate-500">{{ t('org_certificate.matched_count') }}</div>
                  <div class="text-lg font-black text-navy mt-0.5 font-mono">{{ uploadResult.matched_count || 0 }}</div>
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <div class="text-[11px] font-bold text-slate-500">{{ t('org_certificate.unmatched_count') }}</div>
                  <div class="text-lg font-black text-navy mt-0.5 font-mono">{{ uploadResult.unmatched_count || 0 }}</div>
                </div>
              </div>

              <!-- Unmatched List -->
              <div v-if="uploadResult.unmatched && uploadResult.unmatched.length > 0" class="space-y-3 pt-2">
                <div class="text-xs font-bold text-navy flex items-center gap-1.5">
                  <Icon icon="ph:warning-circle-bold" class="text-navy" />
                  <span>{{ t('org_certificate.unmatched_section_title') }} ({{ uploadResult.unmatched.length }})</span>
                </div>

                <div class="space-y-2 max-h-48 overflow-y-auto">
                  <div
                    v-for="unm in uploadResult.unmatched"
                    :key="unm.filename"
                    class="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200">
                    <div class="min-w-0 flex-1">
                      <div class="font-mono text-xs font-bold text-navy truncate">{{ unm.filename }}</div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                      <select
                        v-model="manualAssignments[unm.filename]"
                        class="h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-navy focus:outline-none focus:border-primary w-56">
                        <option value="">{{ t('org_certificate.select_archer') }}</option>
                        <option v-for="p in (Array.isArray(participants) ? participants : [])" :key="p.uuid || p.id" :value="p.uuid || p.id">
                          {{ p.full_name }} ({{ p.category_name || '-' }}) — {{ p.athlete_code || p.id || '-' }}
                        </option>
                      </select>
                      <BaseButton
                        size="sm"
                        variant="primary"
                        :loading="isAssigning[unm.filename]"
                        :disabled="!manualAssignments[unm.filename]"
                        @click="handleManualAssign(unm.filename, unm.pdf_url)"
                        class="shrink-0 font-bold text-[11px] h-8 px-3">
                        {{ t('org_certificate.btn_assign') }}
                      </BaseButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
            <BaseButton @click="closeUploadModal" variant="white" class="h-10 px-5">
              {{ t('org_certificate.close') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal: Multi-Certificates List Dialog (Clean Dialog replacing pop-up menu) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div
        v-if="showMultiCertModal && selectedArcherForCerts"
        class="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="showMultiCertModal = false">
        <div class="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[85vh] border border-slate-200">
          
          <!-- Header -->
          <div class="bg-navy p-5 shrink-0 flex items-center justify-between text-white border-b border-primary/20">
            <div class="flex items-center gap-3 min-w-0">
              <div class="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20 shrink-0">
                <Icon icon="ph:files-bold" class="text-xl text-primary" />
              </div>
              <div class="min-w-0">
                <h3 class="font-black text-base text-white leading-tight truncate">
                  {{ selectedArcherForCerts.full_name }}
                </h3>
                <div class="text-[11px] text-slate-300 truncate">
                  {{ selectedArcherForCerts.athlete_code ? selectedArcherForCerts.athlete_code + ' • ' : '' }}
                  {{ selectedArcherForCerts.categories?.join(', ') || t('org_certificate.default_category') }}
                  <span class="text-primary font-bold">({{ selectedArcherForCerts.certificates?.length || 0 }} {{ t('org_certificate.files_count') }})</span>
                </div>
              </div>
            </div>
            <button
              @click="showMultiCertModal = false"
              class="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0 ml-3">
              <Icon icon="ph:x-bold" class="text-base" />
            </button>
          </div>

          <!-- Body List -->
          <div class="p-5 space-y-2.5 overflow-y-auto max-h-[55vh] divide-y divide-slate-100">
            <div
              v-for="(cert, cIdx) in selectedArcherForCerts.certificates"
              :key="cert.uuid || cert.id || cIdx"
              class="pt-2.5 first:pt-0 flex items-center justify-between gap-3 group/item hover:bg-slate-50 p-3 rounded-2xl transition-colors">
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <div class="size-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-navy shrink-0 font-bold text-xs">
                  <Icon icon="ph:file-pdf-bold" class="text-2xl text-red-500" v-if="isPdf(cert.pdf_url)" />
                  <Icon icon="ph:file-image-bold" class="text-2xl text-blue-500" v-else />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-xs sm:text-sm font-bold text-navy truncate" :title="cert.original_filename || cert.certificate_no">
                    {{ cert.original_filename || `Sertifikat ${cIdx + 1}` }}
                  </div>
                  <div class="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-400 mt-0.5 font-mono">
                    <span v-if="cert.certificate_no" class="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold border border-slate-200">
                      {{ cert.certificate_no }}
                    </span>
                    <span v-if="cert.created_at || cert.issue_date">{{ formatDate(cert.issue_date || cert.created_at) }}</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons for this cert -->
              <div class="flex items-center gap-1.5 shrink-0">
                <button
                  @click="openPdfPreview(cert.pdf_url, `${selectedArcherForCerts.full_name} - ${cert.original_filename || 'Sertifikat'}`)"
                  type="button"
                  class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy transition-colors cursor-pointer shadow-2xs"
                  :title="t('org_certificate.btn_preview')">
                  <Icon icon="ph:eye-bold" class="text-sm" />
                </button>
                <a
                  :href="getImageUrl(cert.pdf_url)"
                  target="_blank"
                  download
                  class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy transition-colors cursor-pointer shadow-2xs"
                  :title="t('org_certificate.btn_download')">
                  <Icon icon="ph:download-simple-bold" class="text-sm" />
                </a>
                <button
                  @click="promptDeleteCert(cert.uuid || cert.id, `${selectedArcherForCerts.full_name} (${cert.original_filename || cert.certificate_no})`)"
                  type="button"
                  class="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer shadow-2xs"
                  :title="t('org_certificate.btn_delete')">
                  <Icon icon="ph:trash-bold" class="text-sm" />
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <button
              @click="openSingleUpload(selectedArcherForCerts)"
              type="button"
              class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-navy font-black text-xs rounded-xl shadow-xs hover:bg-primary-hover transition-colors cursor-pointer">
              <Icon icon="ph:plus-bold" />
              <span>{{ t('org_certificate.btn_add_more') }}</span>
            </button>
            <button
              @click="showMultiCertModal = false"
              type="button"
              class="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
              {{ t('org_certificate.close') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal 2: Preview Modal (PDF / Image) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div
        v-if="showPreviewModal"
        class="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="showPreviewModal = false">
        <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
          <div class="bg-navy p-5 shrink-0 flex items-center justify-between text-white border-b border-primary/20">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Icon icon="ph:certificate-bold" class="text-xl" />
              </div>
              <div>
                <h3 class="font-black text-base text-white leading-tight">{{ previewModalTitle }}</h3>
                <div class="text-[11px] text-slate-300">{{ t('org_certificate.preview_modal_title') }}</div>
              </div>
            </div>
            <button
              @click="showPreviewModal = false"
              class="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer">
              <Icon icon="ph:x-bold" class="text-base" />
            </button>
          </div>

          <div class="flex-grow bg-slate-100 p-4 min-h-[500px] flex items-center justify-center">
            <iframe
              v-if="isPdf(activePreviewUrl)"
              :src="activePreviewUrl"
              class="w-full h-full min-h-[500px] rounded-2xl bg-white shadow-sm border border-slate-200"
              title="Certificate Preview"></iframe>
            <img
              v-else
              :src="activePreviewUrl"
              :alt="previewModalTitle"
              class="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-sm border border-slate-200" />
          </div>

          <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
            <a
              :href="activePreviewUrl"
              target="_blank"
              download
              class="px-5 py-2.5 bg-primary text-navy font-black text-xs rounded-xl shadow-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer">
              <Icon icon="ph:download-simple-bold" />
              <span>{{ t('org_certificate.btn_download') }}</span>
            </a>
            <button
              @click="showPreviewModal = false"
              class="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
              {{ t('org_certificate.close') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal (Standard AppDialog) -->
    <AppDialog
      v-model:show="deleteModal.show"
      :title="deleteModal.title"
      :message="deleteModal.message"
      :confirm-text="deleteModal.confirmText"
      type="danger"
      @confirm="executeDelete"
    />

    <!-- Hidden Input for Single Participant Upload (PDF or Image) -->
    <input
      type="file"
      ref="singleFileInputRef"
      accept=".pdf,.png,.jpg,.jpeg,.webp"
      class="hidden"
      @change="handleSingleFileInputChange" />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute } from '#app'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'
import { getImageUrl, useImageOrDefault, generateDicebearAvatar } from '~/composables/useImageHelper'
import AppDialog from '~/components/common/AppDialog.vue'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'
import CertificateFilterModal from '~/components/dashboard/CertificateFilterModal.vue'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
const route = useRoute()
const eventId = route.params.id
const { get, post, del } = useApi()
const toast = useToast()

useHead({
  title: computed(() => (t ? t('org_certificate.title') : 'Kelola Sertifikat Event') + ' - Archeris Dashboard')
})

const participants = ref([])
const certificatesList = ref([])
const isLoading = ref(true)
const isBulkUploading = ref(false)
const isSingleUploading = ref({})
const isClearing = ref(false)
const isDragging = ref(false)
const fileInputRef = ref(null)
const singleFileInputRef = ref(null)

const getArcherKey = (row) => {
  return String(row?.archer_id || row?.athlete_code || row?.id || row?.uuid || 'default')
}

// Table columns definition
const tableColumns = computed(() => [
  { key: 'profile', label: t('org_certificate.th_archer', 'Pemanah / Klub'), sortable: true, sortKey: 'name', class: 'min-w-[240px]' },
  { key: 'category', label: t('org_certificate.th_category', 'Kategori'), sortable: false, class: 'min-w-[200px]' },
  { key: 'status', label: t('org_certificate.th_status', 'Status Sertifikat'), sortable: true, sortKey: 'status', class: 'min-w-[140px]' }
])

// Search and Filter Modal State
const showFilterModal = ref(false)
const searchQuery = ref('')
const filters = ref({
  status: 'Semua',
  categories: [],
  club: ''
})

const activeFilterCount = computed(() => {
  let count = 0
  if (filters.value.status && filters.value.status !== 'Semua') count++
  if (filters.value.categories && filters.value.categories.length > 0) count++
  if (filters.value.club && filters.value.club.trim() !== '') count++
  return count
})

const hasActiveFilters = computed(() => activeFilterCount.value > 0 || !!searchQuery.value)

const activeFilterChips = computed(() => {
  const chips = []
  if (filters.value.status && filters.value.status !== 'Semua') {
    const label = filters.value.status === 'issued'
      ? t('org_certificate.status_issued_tab')
      : t('org_certificate.status_pending_tab')
    chips.push({ key: 'status', label: `${t('org_certificate.filter_status_label')}: ${label}` })
  }
  if (filters.value.categories && filters.value.categories.length > 0) {
    chips.push({
      key: 'categories',
      label: `${t('org_certificate.th_category')}: ${filters.value.categories.join(', ')}`
    })
  }
  if (filters.value.club && filters.value.club.trim() !== '') {
    chips.push({ key: 'club', label: `${t('org_certificate.filter_club_label')}: ${filters.value.club}` })
  }
  return chips
})

const removeFilterChip = (key) => {
  if (key === 'status') filters.value.status = 'Semua'
  else if (key === 'categories') filters.value.categories = []
  else if (key === 'club') filters.value.club = ''
  currentPage.value = 1
}

const handleApplyModalFilters = (newFilters) => {
  filters.value = { ...newFilters }
  currentPage.value = 1
}

const resetAllFilters = () => {
  searchQuery.value = ''
  filters.value = {
    status: 'Semua',
    categories: [],
    club: ''
  }
  sortBy.value = 'name'
  sortOrder.value = 'asc'
  currentPage.value = 1
}

// Table Sorting
const sortBy = ref('name') // 'name' | 'category' | 'cert_no' | 'status'
const sortOrder = ref('asc') // 'asc' | 'desc'

const handleTableSearch = (q) => {
  searchQuery.value = q
  currentPage.value = 1
}

const handleTableSort = ({ sortBy: field, sortOrder: direction }) => {
  sortBy.value = field === 'profile' ? 'name' : field
  sortOrder.value = direction
  currentPage.value = 1
}

const toggleSort = (column) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'asc'
  }
}

const showUploadModal = ref(false)
const uploadResult = ref(null)
const manualAssignments = ref({})
const isAssigning = ref({})
const selectedParticipantForUpload = ref(null)

// Multi-Certificate Modal State
const showMultiCertModal = ref(false)
const selectedArcherForCerts = ref(null)

const openMultiCertModal = (archer) => {
  if (!archer) return
  selectedArcherForCerts.value = archer
  showMultiCertModal.value = true
}

// Preview Modal State
const showPreviewModal = ref(false)
const activePreviewUrl = ref('')
const previewModalTitle = ref('')

const isPdf = (url) => {
  if (!url) return false
  const clean = url.split('?')[0].toLowerCase()
  return clean.endsWith('.pdf') || clean.includes('/pdf') || clean.includes('format=pdf') || clean.includes('.pdf')
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return String(dateStr)
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return String(dateStr)
  }
}

// Delete Dialog State
const deleteModal = reactive({
  show: false,
  type: 'single', // 'single' | 'all'
  targetId: null,
  title: '',
  message: '',
  confirmText: ''
})

const getInitials = (name) => {
  if (!name) return 'A'
  const parts = name.trim().split(' ')
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase()
}

const eligibleParticipantsCount = computed(() => {
  if (!Array.isArray(participants.value)) return 0
  return participants.value.filter(p => {
    const s = (p.payment_status || '').toLowerCase()
    return s === 'paid' || s === 'lunas'
  }).length
})

const completionRate = computed(() => {
  const eligible = eligibleParticipantsCount.value
  if (eligible === 0) return 0
  const certCount = Array.isArray(certificatesList.value) ? certificatesList.value.length : 0
  return Math.min(100, Math.round((certCount / eligible) * 100))
})

const uniqueCategories = computed(() => {
  if (!Array.isArray(participants.value)) return []
  const cats = participants.value
    .map(p => p.category_name)
    .filter(Boolean)
  return [...new Set(cats)]
})

// Build enriched list grouped by unique archer (1 Archer = 1 Row)
const enrichedArchersList = computed(() => {
  const partList = Array.isArray(participants.value) ? participants.value : []
  const certList = Array.isArray(certificatesList.value) ? certificatesList.value : []
  const archerMap = new Map()

  for (const p of partList) {
    const archerKey = String(p.archer_id || p.athlete_code || p.full_name || p.id || p.uuid).trim()
    const partId = String(p.uuid || p.id || '')
    const catName = p.category_name || ''

    if (!archerMap.has(archerKey)) {
      archerMap.set(archerKey, {
        id: p.id,
        uuid: p.uuid,
        archer_id: p.archer_id,
        athlete_code: p.athlete_code || p.back_number,
        full_name: p.full_name,
        email: p.email || '',
        club_name: p.club_name,
        avatar_url: p.avatar_url,
        categories: catName ? [catName] : [],
        participant_ids: partId ? [partId] : [],
        certificates: []
      })
    } else {
      const existing = archerMap.get(archerKey)
      if (p.email && !existing.email) {
        existing.email = p.email
      }
      if (catName && !existing.categories.includes(catName)) {
        existing.categories.push(catName)
      }
      if (partId && !existing.participant_ids.includes(partId)) {
        existing.participant_ids.push(partId)
      }
    }
  }

  // Assign certificates to archers
  for (const cert of certList) {
    const partId = String(cert.participant_id || cert.registration_id || '')
    const archerId = String(cert.archer_id || '')
    const code = String(cert.athlete_code || '').toLowerCase().trim()
    const name = String(cert.archer_name || '').toLowerCase().trim()

    for (const [key, archer] of archerMap.entries()) {
      const match =
        (archerId && archer.archer_id && String(archer.archer_id) === archerId) ||
        (partId && archer.participant_ids.includes(partId)) ||
        (code && archer.athlete_code && String(archer.athlete_code).toLowerCase().trim() === code) ||
        (name && archer.full_name && String(archer.full_name).toLowerCase().trim() === name)

      if (match) {
        if (!archer.certificates.some(c => c.uuid === cert.uuid || (c.id && c.id === cert.id) || (cert.pdf_url && c.pdf_url === cert.pdf_url))) {
          archer.certificates.push(cert)
        }
        break
      }
    }
  }

  return Array.from(archerMap.values())
})

const filteredArchersList = computed(() => {
  let list = enrichedArchersList.value

  // Status Filter
  if (filters.value.status === 'issued') {
    list = list.filter(a => a.certificates && a.certificates.length > 0)
  } else if (filters.value.status === 'pending') {
    list = list.filter(a => !a.certificates || a.certificates.length === 0)
  }

  // Category Filter
  if (filters.value.categories && filters.value.categories.length > 0) {
    list = list.filter(a => a.categories && a.categories.some(c => filters.value.categories.includes(c)))
  }

  // Club Filter
  if (filters.value.club && filters.value.club.trim() !== '') {
    const clubQ = filters.value.club.toLowerCase().trim()
    list = list.filter(a => a.club_name?.toLowerCase().includes(clubQ))
  }

  // Search Query
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(a =>
      a.full_name?.toLowerCase().includes(q) ||
      a.athlete_code?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.club_name?.toLowerCase().includes(q) ||
      a.categories?.some(c => c.toLowerCase().includes(q)) ||
      a.certificates?.some(c =>
        c.certificate_no?.toLowerCase().includes(q) ||
        c.original_filename?.toLowerCase().includes(q)
      )
    )
  }

  // Sorting
  const dir = sortOrder.value === 'asc' ? 1 : -1
  list = [...list].sort((a, b) => {
    if (sortBy.value === 'name') {
      const nameA = a.full_name || ''
      const nameB = b.full_name || ''
      return dir * nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' })
    }
    return 0
  })

  return list
})

// Pagination State & Computed
const currentPage = ref(1)
const itemsPerPage = ref(10)

watch([searchQuery, filters, sortBy, sortOrder], () => {
  currentPage.value = 1
}, { deep: true })

const paginatedArchersList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredArchersList.value.slice(start, end)
})

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileInputChange = (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    uploadFiles(files)
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const files = event.dataTransfer.files
  if (files && files.length > 0) {
    uploadFiles(files)
  }
}

const uploadFiles = async (fileList) => {
  const formData = new FormData()
  for (let i = 0; i < fileList.length; i++) {
    formData.append('file', fileList[i])
  }

  isBulkUploading.value = true
  try {
    const res = await post(`/tournaments/${eventId}/certificates/upload-zip`, formData)
    uploadResult.value = res
    if (res.matched_count > 0 && res.unmatched_count === 0) {
      toast.success(t('org_certificate.msg_zip_success', { count: res.matched_count || 0 }))
    } else if (res.unmatched_count > 0) {
      toast.info(t('org_certificate.msg_partial_match', { matched: res.matched_count || 0, unmatched: res.unmatched_count }))
    } else {
      toast.info(t('org_certificate.msg_no_auto_match'))
    }
    await fetchData()
  } catch (error) {
    console.error('Failed to upload certificates:', error)
    toast.error(error?.data?.error || error?.response?.data?.error || t('org_certificate.err_process_zip'))
  } finally {
    isBulkUploading.value = false
    if (fileInputRef.value) fileInputRef.value.value = ''
  }
}

const openSingleUpload = (participant) => {
  selectedParticipantForUpload.value = participant
  singleFileInputRef.value?.click()
}

const handleSingleFileInputChange = async (event) => {
  const files = event.target.files
  if (!files || files.length === 0 || !selectedParticipantForUpload.value) return
  const p = selectedParticipantForUpload.value
  const partId = p.uuid || p.id || (p.participant_ids && p.participant_ids[0]) || p.archer_id
  const archerKey = getArcherKey(p)

  const formData = new FormData()
  formData.append('file', files[0])

  isSingleUploading.value[archerKey] = true
  try {
    await post(`/tournaments/${eventId}/participants/${partId}/certificate`, formData)
    toast.success(t('org_certificate.msg_cert_assigned'))
    await fetchData()
  } catch (error) {
    console.error('Failed to upload participant certificate:', error)
    toast.error(error?.data?.error || error?.response?.data?.error || t('org_certificate.err_upload_single'))
  } finally {
    isSingleUploading.value[archerKey] = false
    selectedParticipantForUpload.value = null
    if (singleFileInputRef.value) singleFileInputRef.value.value = ''
  }
}

const handleManualAssign = async (filename, pdfUrl) => {
  const partId = manualAssignments.value[filename]
  if (!partId) return

  isAssigning.value[filename] = true
  try {
    await post(`/tournaments/${eventId}/certificates/manual-assign`, {
      batch_id: uploadResult.value?.batch_id,
      original_filename: filename,
      participant_id: partId,
      pdf_url: pdfUrl
    })
    toast.success(t('org_certificate.msg_cert_assigned'))
    if (uploadResult.value?.unmatched) {
      uploadResult.value.unmatched = uploadResult.value.unmatched.filter(f => f.filename !== filename)
      uploadResult.value.matched_count = (uploadResult.value.matched_count || 0) + 1
      uploadResult.value.unmatched_count = Math.max((uploadResult.value.unmatched_count || 1) - 1, 0)
    }
    await fetchData()
  } catch (error) {
    console.error('Failed to assign certificate:', error)
    toast.error(error?.data?.error || error?.response?.data?.error || t('org_certificate.err_assign'))
  } finally {
    isAssigning.value[filename] = false
  }
}

const promptDeleteCert = (certId, name = '') => {
  if (!certId) {
    toast.error('ID Sertifikat tidak valid')
    return
  }
  deleteModal.type = 'single'
  deleteModal.targetId = certId
  deleteModal.title = t('org_certificate.modal_delete_title')
  deleteModal.message = name
    ? t('org_certificate.confirm_delete_named', { name })
    : t('org_certificate.confirm_delete_single')
  deleteModal.confirmText = t('common.delete')
  deleteModal.show = true
}

const promptClearAll = () => {
  deleteModal.type = 'all'
  deleteModal.targetId = null
  deleteModal.title = t('org_certificate.modal_clear_all_title')
  deleteModal.message = t('org_certificate.confirm_clear_all')
  deleteModal.confirmText = t('org_certificate.btn_clear_all')
  deleteModal.show = true
}

const executeDelete = async () => {
  if (deleteModal.type === 'single') {
    try {
      await del(`/tournaments/${eventId}/certificates/${deleteModal.targetId}`)
      toast.success(t('org_certificate.msg_cert_deleted'))
      await fetchData()
    } catch (error) {
      console.error('Failed to delete certificate:', error)
      toast.error(t('org_certificate.err_delete'))
    }
  } else if (deleteModal.type === 'all') {
    isClearing.value = true
    try {
      await del(`/tournaments/${eventId}/certificates/clear-all`)
      toast.success(t('org_certificate.msg_certs_cleared'))
      await fetchData()
    } catch (error) {
      console.error('Failed to clear certificates:', error)
      toast.error(t('org_certificate.err_clear_all'))
    } finally {
      isClearing.value = false
    }
  }
}

const openPdfPreview = (url, title = '') => {
  activePreviewUrl.value = getImageUrl(url)
  previewModalTitle.value = title || 'Preview'
  showPreviewModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const [certsRes, partsRes] = await Promise.all([
      get(`/tournaments/${eventId}/certificates`).catch(err => {
        console.error('Failed to fetch certificates:', err)
        return []
      }),
      get(`/tournaments/${eventId}/participants?limit=1000`).catch(err => {
        console.error('Failed to fetch participants:', err)
        return []
      })
    ])

    if (Array.isArray(certsRes)) {
      certificatesList.value = certsRes
    } else if (Array.isArray(certsRes?.data)) {
      certificatesList.value = certsRes.data
    } else if (Array.isArray(certsRes?.certificates)) {
      certificatesList.value = certsRes.certificates
    } else {
      certificatesList.value = []
    }

    if (Array.isArray(partsRes?.participants)) {
      participants.value = partsRes.participants
    } else if (Array.isArray(partsRes?.data)) {
      participants.value = partsRes.data
    } else if (Array.isArray(partsRes)) {
      participants.value = partsRes
    } else {
      participants.value = []
    }

    // Sync active multi-cert dialog if open
    if (selectedArcherForCerts.value) {
      const updated = enrichedArchersList.value.find(a => getArcherKey(a) === getArcherKey(selectedArcherForCerts.value))
      if (updated && updated.certificates && updated.certificates.length > 0) {
        selectedArcherForCerts.value = updated
      } else {
        showMultiCertModal.value = false
        selectedArcherForCerts.value = null
      }
    }
  } catch (err) {
    console.error('Failed to fetch certificates data:', err)
    certificatesList.value = []
    participants.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>


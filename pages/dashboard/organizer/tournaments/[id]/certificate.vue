<template>
  <div class="flex flex-col gap-6 pb-16 font-body text-navy antialiased">
    <!-- Header -->
    <DashboardHeader
      :title="t('org_certificate.header_title', 'Sertifikat Event')"
      :subtitle="t('org_certificate.header_subtitle', 'Unggah dan Kelola Distribusi Sertifikat Digital Resmi Peserta.')"
      icon="ph:certificate-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('events.list.title', 'Event Saya'), to: '/dashboard/organizer/tournaments' },
        { label: t('org_certificate.header_title', 'Sertifikat') }
      ]"
    >
      <template #actions>
        <BaseButton
          @click="showUploadModal = true"
          variant="primary"
          icon="ph:cloud-arrow-up-bold"
          class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-black tracking-widest">
          <span>{{ t('org_certificate.bulk_upload_btn', 'Unggah Massal (Bulk Upload)') }}</span>
        </BaseButton>
      </template>
    </DashboardHeader>

    <!-- Row 1: KPI Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Total Peserta -->
      <StatCard
        :title="t('org_certificate.stats_total', 'Total Peserta')"
        :value="participants.length"
        icon="ph:users"
        color="primary"
        :description="t('org_certificate.stats_total_desc', 'Total atlet terdaftar resmi')"
        description-icon="ph:users-bold"
      />

      <!-- Peserta Lunas (Eligible) -->
      <StatCard
        :title="t('org_certificate.stats_paid', 'Peserta Lunas')"
        :value="eligibleParticipantsCount"
        icon="ph:check-circle-bold"
        color="primary"
        :description="t('org_certificate.stats_paid_desc', 'Peserta berhak sertifikat')"
        description-icon="ph:check-circle-bold"
      />

      <!-- Sertifikat Terbit -->
      <StatCard
        :title="t('org_certificate.stats_issued', 'Sertifikat Terbit')"
        :value="certificatesList.length"
        icon="ph:certificate-bold"
        color="primary"
        :description="t('org_certificate.stats_issued_desc', 'Sertifikat siap diunduh')"
        description-icon="ph:download-simple-bold"
      />

      <!-- Tingkat Penyelesaian -->
      <StatCard
        :title="t('org_certificate.stats_completion', 'Tingkat Penyelesaian')"
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

    <!-- Row 2: Status Tabs & Filter Bar -->
    <div class="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
      <!-- Status Tabs -->
      <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto shrink-0">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          @click="activeStatusTab = tab.value"
          type="button"
          class="px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2"
          :class="activeStatusTab === tab.value ? 'bg-white text-navy shadow-xs' : 'text-slate-500 hover:text-navy'">
          <span>{{ tab.label }}</span>
          <span
            class="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
            :class="activeStatusTab === tab.value ? 'bg-navy text-white' : 'bg-slate-200 text-slate-600'">
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Search & Category Filters -->
      <div class="flex flex-col sm:flex-row items-center gap-3 flex-1 lg:max-w-xl justify-end">
        <!-- Search Input -->
        <div class="relative w-full sm:flex-1">
          <Icon icon="ph:magnifying-glass-bold" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('org_certificate.search_placeholder', 'Cari Nama Atlet, Kode, Nomor...')"
            class="w-full h-10 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-navy placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-primary focus:bg-white transition-all" />
        </div>

        <!-- Category Select -->
        <div class="w-full sm:w-56 shrink-0">
          <select
            v-model="selectedCategory"
            class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-navy focus:outline-none focus:border-primary">
            <option value="">{{ t('org_certificate.all_categories', 'Semua Kategori') }}</option>
            <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <!-- Clear All Button -->
        <button
          v-if="certificatesList.length > 0"
          @click="handleClearAll"
          :disabled="isClearing"
          type="button"
          class="h-10 px-3.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
          :title="t('org_certificate.btn_clear_all', 'Hapus Semua')">
          <Icon icon="ph:trash-bold" />
          <span class="hidden sm:inline">{{ t('org_certificate.btn_clear_all', 'Hapus Semua') }}</span>
        </button>
      </div>
    </div>

    <!-- Row 3: Participants Certificate Roster Table -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="py-20 text-center space-y-3">
        <Icon icon="ph:spinner-gap-bold" class="text-3xl text-primary animate-spin mx-auto" />
        <p class="text-xs text-slate-400 font-bold">{{ t('common.loading', 'Memuat Data Sertifikat...') }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredParticipantsList.length === 0" class="py-20 text-center space-y-3">
        <div class="size-14 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center mx-auto shadow-xs">
          <Icon icon="ph:certificate-bold" class="text-2xl text-navy" />
        </div>
        <div class="space-y-1">
          <h4 class="text-sm font-black text-navy">{{ t('org_certificate.empty_certs_title', 'Tidak Ada Data Sertifikat') }}</h4>
          <p class="text-xs text-slate-400 max-w-sm mx-auto">
            {{ searchQuery || selectedCategory ? t('org_certificate.empty_filtered_desc', 'Coba ubah kata kunci pencarian atau filter kategori Anda.') : t('org_certificate.empty_initial_desc', 'Belum ada peserta yang terdaftar pada event ini.') }}
          </p>
        </div>
      </div>

      <!-- Main Roster Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 tracking-wider">
              <th class="py-4 px-5 w-14 text-center">#</th>
              <th class="py-4 px-5">{{ t('org_certificate.th_archer', 'Nama Pemanah & Klub') }}</th>
              <th class="py-4 px-5">{{ t('org_certificate.th_category', 'Kategori Lomba') }}</th>
              <th class="py-4 px-5">{{ t('org_certificate.th_cert_no', 'Nomor Sertifikat') }}</th>
              <th class="py-4 px-5">{{ t('org_certificate.th_status', 'Status Sertifikat') }}</th>
              <th class="py-4 px-5 text-right">{{ t('org_certificate.th_action', 'Aksi') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <tr
              v-for="(row, idx) in paginatedParticipantsList"
              :key="row.id || row.uuid"
              class="hover:bg-slate-50/70 transition-colors group">
              <!-- Index Number -->
              <td class="py-4 px-5 font-mono font-bold text-slate-400 text-center text-[11px]">
                {{ (currentPage - 1) * itemsPerPage + idx + 1 }}
              </td>

              <!-- Archer & Club -->
              <td class="py-4 px-5">
                <div class="flex items-center gap-3">
                  <div class="size-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-navy text-xs overflow-hidden shrink-0">
                    <img
                      v-if="row.avatar_url"
                      :src="row.avatar_url"
                      :alt="row.full_name || 'Archer'"
                      class="size-full object-cover" />
                    <span v-else>{{ getInitials(row.full_name) }}</span>
                  </div>
                  <div class="min-w-0">
                    <div class="font-black text-navy text-xs truncate">{{ row.full_name || '-' }}</div>
                    <div class="text-[11px] text-slate-400 font-medium truncate flex items-center gap-1.5 mt-0.5">
                      <span v-if="row.athlete_code" class="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        {{ row.athlete_code }}
                      </span>
                      <span>{{ row.club_name || '-' }}</span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Category -->
              <td class="py-4 px-5">
                <span class="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg text-[10px] border border-slate-200">
                  {{ row.category_name || '-' }}
                </span>
              </td>

              <!-- Certificate Number -->
              <td class="py-4 px-5">
                <span v-if="row.cert?.certificate_no" class="font-mono text-[11px] font-bold text-navy bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                  {{ row.cert.certificate_no }}
                </span>
                <span v-else class="text-slate-300 font-mono text-[11px]">-</span>
              </td>

              <!-- Certificate Status -->
              <td class="py-4 px-5">
                <div v-if="row.cert" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-navy text-white shadow-xs">
                  <Icon icon="ph:check-bold" class="text-xs text-white" />
                  <span>{{ t('org_certificate.status_issued', 'Terbit') }}</span>
                </div>
                <div v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                  <Icon icon="ph:clock-bold" class="text-xs" />
                  <span>{{ t('org_certificate.status_pending', 'Belum Terbit') }}</span>
                </div>
              </td>

              <!-- Action Buttons -->
              <td class="py-4 px-5 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- When Certificate Exists: Preview, Download, Delete -->
                  <template v-if="row.cert?.pdf_url">
                    <button
                      @click="openPdfPreview(row.cert.pdf_url, row.full_name || 'Sertifikat')"
                      type="button"
                      class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy transition-colors"
                      :title="t('org_certificate.btn_preview', 'Pratinjau PDF')">
                      <Icon icon="ph:eye-bold" class="text-sm" />
                    </button>

                    <a
                      :href="row.cert.pdf_url"
                      target="_blank"
                      download
                      class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy transition-colors"
                      :title="t('org_certificate.btn_download', 'Unduh PDF')">
                      <Icon icon="ph:download-simple-bold" class="text-sm" />
                    </a>

                    <button
                      @click="handleDeleteCert(row.cert.uuid || row.cert.id)"
                      type="button"
                      class="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      :title="t('org_certificate.btn_delete', 'Hapus Sertifikat')">
                      <Icon icon="ph:trash-bold" class="text-sm" />
                    </button>
                  </template>

                  <!-- When Certificate Not Yet Issued: Quick Upload -->
                  <template v-else>
                    <button
                      @click="openSingleUpload(row)"
                      type="button"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-navy hover:text-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-95">
                      <Icon icon="ph:upload-simple-bold" />
                      <span>{{ t('org_certificate.btn_upload_single', 'Unggah PDF') }}</span>
                    </button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Pagination Footer -->
      <div v-if="filteredParticipantsList.length > 0" class="p-4 sm:p-5 border-t border-slate-100 bg-white">
        <BasePagination
          :current-page="currentPage"
          :total-items="filteredParticipantsList.length"
          :items-per-page="itemsPerPage"
          :show-page-size="true"
          :show-info="true"
          no-margin
          @update:current-page="currentPage = $event"
          @update:items-per-page="itemsPerPage = $event"
        />
      </div>
    </div>

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
                <h3 class="text-lg font-black tracking-tight">{{ t('org_certificate.bulk_upload_title', 'Unggah Massal Sertifikat (Bulk Upload)') }}</h3>
                <div class="text-xs text-slate-300">{{ t('org_certificate.bulk_upload_subtitle', 'Unggah banyak sertifikat peserta sekaligus menggunakan arsip file .ZIP atau multi-file .PDF.') }}</div>
              </div>
            </div>
            <button
              @click="closeUploadModal"
              class="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
              <Icon icon="ph:x-bold" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            <!-- Naming Guide Pill Box -->
            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div class="flex items-center gap-2 text-xs font-bold text-navy">
                <Icon icon="ph:info-bold" class="text-primary text-base" />
                <span>{{ t('org_certificate.naming_guide_title', 'Panduan Penamaan Berkas Sertifikat') }}</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <div class="font-black text-navy">{{ t('org_certificate.naming_format_a_title', 'Format Rekomendasi (Kode + Nama)') }}</div>
                  <div class="font-mono text-slate-500 truncate text-[10px]">ARC-0012_Nama Pemanah.pdf</div>
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <div class="font-black text-navy">{{ t('org_certificate.naming_format_b_title', 'Format Alternatif (Nama Lengkap)') }}</div>
                  <div class="font-mono text-slate-500 truncate text-[10px]">Nama Lengkap Peserta.pdf</div>
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <div class="font-black text-navy">{{ t('org_certificate.naming_format_c_title', 'Format Kode Saja (Kode Atlet)') }}</div>
                  <div class="font-mono text-slate-500 truncate text-[10px]">ARC-0012.pdf</div>
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
                accept=".zip,.pdf"
                multiple
                class="hidden"
                @change="handleFileInputChange" />

              <div class="size-14 rounded-2xl bg-navy text-white group-hover:scale-105 transition-all flex items-center justify-center shadow-xs">
                <Icon v-if="!isUploading" icon="ph:cloud-arrow-up-bold" class="text-2xl" />
                <Icon v-else icon="ph:spinner-gap-bold" class="text-2xl animate-spin" />
              </div>

              <div v-if="!isUploading" class="space-y-1">
                <div class="text-sm font-black text-navy transition-colors">
                  {{ t('org_certificate.dropzone_title', 'Tarik & Lepas File .ZIP / Multi-PDF di Sini') }}
                </div>
                <p class="text-xs text-slate-400 font-medium">
                  {{ t('org_certificate.dropzone_subtitle', 'Atau klik untuk memilih berkas dari komputer (.zip, .pdf)') }}
                </p>
              </div>

              <div v-else class="space-y-2 max-w-xs w-full">
                <div class="text-xs font-bold text-navy">{{ t('org_certificate.uploading', 'Mengunggah & Memproses Berkas...') }}</div>
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
                  <span>{{ t('org_certificate.batch_result_title', 'Hasil Pemrosesan Batch Terakhir') }}</span>
                </div>
                <span class="text-[11px] font-mono text-slate-400">{{ uploadResult.batch_id ? `Batch: ${uploadResult.batch_id.slice(0, 8)}` : '' }}</span>
              </div>

              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <div class="text-[11px] font-bold text-slate-500">{{ t('org_certificate.total_files', 'Total Berkas') }}</div>
                  <div class="text-lg font-black text-navy mt-0.5 font-mono">{{ uploadResult.total_files || 0 }}</div>
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <div class="text-[11px] font-bold text-slate-500">{{ t('org_certificate.matched_count', 'Berhasil Dicocokkan') }}</div>
                  <div class="text-lg font-black text-navy mt-0.5 font-mono">{{ uploadResult.matched_count || 0 }}</div>
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <div class="text-[11px] font-bold text-slate-500">{{ t('org_certificate.unmatched_count', 'Perlu Ditinjau') }}</div>
                  <div class="text-lg font-black text-navy mt-0.5 font-mono">{{ uploadResult.unmatched_count || 0 }}</div>
                </div>
              </div>

              <!-- Unmatched List -->
              <div v-if="uploadResult.unmatched && uploadResult.unmatched.length > 0" class="space-y-3 pt-2">
                <div class="text-xs font-bold text-navy flex items-center gap-1.5">
                  <Icon icon="ph:warning-circle-bold" class="text-navy" />
                  <span>{{ t('org_certificate.unmatched_section_title', 'Berkas yang Belum Terhubung Otomatis') }} ({{ uploadResult.unmatched.length }})</span>
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
                        class="h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-navy focus:outline-none focus:border-primary w-44">
                        <option value="">{{ t('org_certificate.select_archer', 'Pilih Atlet...') }}</option>
                        <option v-for="p in participants" :key="p.uuid || p.id" :value="p.uuid || p.id">
                          {{ p.full_name }} ({{ p.athlete_code || p.id || '-' }})
                        </option>
                      </select>
                      <BaseButton
                        size="sm"
                        variant="primary"
                        :loading="isAssigning[unm.filename]"
                        :disabled="!manualAssignments[unm.filename]"
                        @click="handleManualAssign(unm.filename, unm.pdf_url)"
                        class="shrink-0 font-bold text-[11px] h-8 px-3">
                        {{ t('org_certificate.btn_assign', 'Hubungkan') }}
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
              {{ t('org_certificate.close', 'Tutup') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal 2: PDF Preview Modal -->
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
                <Icon icon="ph:file-pdf-bold" class="text-xl" />
              </div>
              <div>
                <h3 class="font-black text-base text-white leading-tight">{{ previewModalTitle }}</h3>
                <div class="text-[11px] text-slate-300">{{ t('org_certificate.preview_modal_title', 'Pratinjau Berkas Sertifikat') }}</div>
              </div>
            </div>
            <button
              @click="showPreviewModal = false"
              class="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
              <Icon icon="ph:x-bold" class="text-base" />
            </button>
          </div>

          <div class="flex-grow bg-slate-100 p-4 min-h-[500px]">
            <iframe
              :src="activePreviewUrl"
              class="w-full h-full min-h-[500px] rounded-2xl bg-white shadow-sm border border-slate-200"
              title="PDF Certificate Preview"></iframe>
          </div>

          <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
            <a
              :href="activePreviewUrl"
              target="_blank"
              download
              class="px-5 py-2.5 bg-primary text-navy font-black text-xs rounded-xl shadow-xs hover:opacity-90 transition-opacity flex items-center gap-1.5">
              <Icon icon="ph:download-simple-bold" />
              <span>{{ t('org_certificate.btn_download', 'Unduh PDF') }}</span>
            </a>
            <button
              @click="showPreviewModal = false"
              class="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors">
              {{ t('org_certificate.close', 'Tutup') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Hidden Input for Single Participant Upload -->
    <input
      type="file"
      ref="singleFileInputRef"
      accept=".pdf"
      class="hidden"
      @change="handleSingleFileInputChange" />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from '#app'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
const route = useRoute()
const eventId = route.params.id
const { get, post, del } = useApi()
const toast = useToast()

useHead({
  title: computed(() => (t ? t('org_certificate.title', 'Kelola Sertifikat Event') : 'Kelola Sertifikat Event') + ' - Archeris Dashboard')
})

const participants = ref([])
const certificatesList = ref([])
const isLoading = ref(false)
const isUploading = ref(false)
const isClearing = ref(false)
const isDragging = ref(false)
const fileInputRef = ref(null)
const singleFileInputRef = ref(null)

const searchQuery = ref('')
const selectedCategory = ref('')
const activeStatusTab = ref('all') // 'all' | 'issued' | 'pending'

const showUploadModal = ref(false)
const uploadResult = ref(null)
const manualAssignments = ref({})
const isAssigning = ref({})
const selectedParticipantForUpload = ref(null)

// Preview Modal State
const showPreviewModal = ref(false)
const activePreviewUrl = ref('')
const previewModalTitle = ref('')

const getInitials = (name) => {
  if (!name) return 'A'
  const parts = name.trim().split(' ')
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase()
}

const eligibleParticipantsCount = computed(() => {
  return participants.value.filter(p => {
    const s = (p.payment_status || '').toLowerCase()
    return s === 'paid' || s === 'lunas'
  }).length
})

const completionRate = computed(() => {
  const eligible = eligibleParticipantsCount.value
  if (eligible === 0) return 0
  return Math.min(100, Math.round((certificatesList.value.length / eligible) * 100))
})

const uniqueCategories = computed(() => {
  const cats = participants.value
    .map(p => p.category_name)
    .filter(Boolean)
  return [...new Set(cats)]
})

// Build enriched participants list with matched certificate
const enrichedParticipantsList = computed(() => {
  const certMapByPartId = new Map()
  const certMapByArcherId = new Map()
  const certMapByAthleteCode = new Map()
  const certMapByName = new Map()

  for (const cert of certificatesList.value) {
    const partId = cert.participant_id || cert.registration_id
    if (partId) certMapByPartId.set(String(partId), cert)
    if (cert.archer_id) certMapByArcherId.set(String(cert.archer_id), cert)
    if (cert.athlete_code) certMapByAthleteCode.set(String(cert.athlete_code).toLowerCase().trim(), cert)
    if (cert.archer_name) certMapByName.set(String(cert.archer_name).toLowerCase().trim(), cert)
  }

  return participants.value.map(p => {
    const partId = String(p.uuid || p.id || '')
    const archerId = String(p.archer_id || '')
    const code = String(p.athlete_code || p.back_number || '').toLowerCase().trim()
    const name = String(p.full_name || '').toLowerCase().trim()

    const cert = (partId ? certMapByPartId.get(partId) : null) ||
      (archerId ? certMapByArcherId.get(archerId) : null) ||
      (code ? certMapByAthleteCode.get(code) : null) ||
      (name ? certMapByName.get(name) : null)

    return {
      ...p,
      cert: cert || null
    }
  })
})

const statusTabs = computed(() => {
  const all = enrichedParticipantsList.value.length
  const issued = enrichedParticipantsList.value.filter(p => p.cert !== null).length
  const pending = all - issued

  return [
    { label: t('org_certificate.all_participants', 'Semua Peserta'), value: 'all', count: all },
    { label: t('org_certificate.status_issued_tab', 'Sudah Terbit'), value: 'issued', count: issued },
    { label: t('org_certificate.status_pending_tab', 'Belum Terbit'), value: 'pending', count: pending }
  ]
})

const filteredParticipantsList = computed(() => {
  let list = enrichedParticipantsList.value

  // Status Tab Filter
  if (activeStatusTab.value === 'issued') {
    list = list.filter(p => p.cert !== null)
  } else if (activeStatusTab.value === 'pending') {
    list = list.filter(p => p.cert === null)
  }

  // Category Filter
  if (selectedCategory.value) {
    list = list.filter(p => p.category_name === selectedCategory.value)
  }

  // Search Query
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(p =>
      p.full_name?.toLowerCase().includes(q) ||
      p.athlete_code?.toLowerCase().includes(q) ||
      p.club_name?.toLowerCase().includes(q) ||
      p.cert?.certificate_no?.toLowerCase().includes(q) ||
      p.cert?.original_filename?.toLowerCase().includes(q)
    )
  }

  return list
})

// Pagination State & Computed
const currentPage = ref(1)
const itemsPerPage = ref(10)

watch([searchQuery, selectedCategory, activeStatusTab], () => {
  currentPage.value = 1
})

const paginatedParticipantsList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredParticipantsList.value.slice(start, end)
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

  isUploading.value = true
  try {
    const res = await post(`/tournaments/${eventId}/certificates/upload-zip`, formData)
    uploadResult.value = res
    if (res.matched_count > 0 && res.unmatched_count === 0) {
      toast.success(t('org_certificate.msg_zip_success', { count: res.matched_count || 0 }))
    } else if (res.unmatched_count > 0) {
      toast.info(`Berhasil mencocokkan ${res.matched_count || 0} berkas. ${res.unmatched_count} berkas perlu dihubungkan manual.`)
    } else {
      toast.info(`Tidak ada nama berkas yang otomatis cocok. Silakan hubungkan manual di bawah.`)
    }
    await fetchData()
  } catch (error) {
    console.error('Failed to upload certificates:', error)
    toast.error(error?.data?.error || error?.response?.data?.error || 'Gagal memproses berkas sertifikat')
  } finally {
    isUploading.value = false
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
  const partId = p.uuid || p.id

  const formData = new FormData()
  formData.append('file', files[0])

  isUploading.value = true
  try {
    await post(`/tournaments/${eventId}/participants/${partId}/certificate`, formData)
    toast.success(t('org_certificate.msg_cert_assigned', 'Sertifikat berhasil diunggah dan dihubungkan!'))
    await fetchData()
  } catch (error) {
    console.error('Failed to upload participant certificate:', error)
    toast.error(error?.data?.error || error?.response?.data?.error || 'Gagal mengunggah sertifikat peserta')
  } finally {
    isUploading.value = false
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
    toast.success(t('org_certificate.msg_cert_assigned', 'Sertifikat berhasil dihubungkan!'))
    if (uploadResult.value?.unmatched) {
      uploadResult.value.unmatched = uploadResult.value.unmatched.filter(f => f.filename !== filename)
      uploadResult.value.matched_count = (uploadResult.value.matched_count || 0) + 1
      uploadResult.value.unmatched_count = Math.max((uploadResult.value.unmatched_count || 1) - 1, 0)
    }
    await fetchData()
  } catch (error) {
    console.error('Failed to assign certificate:', error)
    toast.error(error?.data?.error || error?.response?.data?.error || 'Gagal menghubungkan sertifikat')
  } finally {
    isAssigning.value[filename] = false
  }
}

const handleDeleteCert = async (certId) => {
  if (!confirm(t('org_certificate.confirm_delete_single', 'Yakin ingin menghapus sertifikat ini?'))) return
  try {
    await del(`/tournaments/${eventId}/certificates/${certId}`)
    toast.success(t('org_certificate.msg_cert_deleted', 'Sertifikat berhasil dihapus'))
    await fetchData()
  } catch (error) {
    console.error('Failed to delete certificate:', error)
    toast.error('Gagal menghapus sertifikat')
  }
}

const handleClearAll = async () => {
  if (!confirm(t('org_certificate.confirm_clear_all', 'Peringatan: Yakin ingin menghapus seluruh sertifikat yang telah diterbitkan untuk event ini?'))) return
  isClearing.value = true
  try {
    await del(`/tournaments/${eventId}/certificates/clear-all`)
    toast.success(t('org_certificate.msg_certs_cleared', 'Seluruh sertifikat event berhasil dibersihkan'))
    await fetchData()
  } catch (error) {
    console.error('Failed to clear certificates:', error)
    toast.error('Gagal membersihkan sertifikat')
  } finally {
    isClearing.value = false
  }
}

const openPdfPreview = (url, title = '') => {
  activePreviewUrl.value = url
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
      get(`/tournaments/${eventId}/certificates`),
      get(`/tournaments/${eventId}/participants?limit=1000`)
    ])
    certificatesList.value = certsRes?.data || certsRes || []
    participants.value = partsRes?.participants || partsRes?.data || partsRes || []
  } catch (err) {
    console.error('Failed to fetch certificates data:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>


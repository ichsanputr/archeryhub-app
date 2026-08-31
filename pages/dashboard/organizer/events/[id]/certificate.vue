<template>
  <div class="flex flex-col gap-6 pb-16 font-body text-navy antialiased">
    <!-- Enhanced Header -->
    <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

      <div class="relative p-6 sm:p-8">
        <div class="flex items-center sm:items-start gap-4">
          <div class="size-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
            <Icon icon="ph:certificate-bold" class="text-white text-2xl" />
          </div>
          <div class="min-w-0 text-left">
            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2 truncate">
              {{ t('org_certificate.header_title', 'Sertifikat Event') }}
            </h1>
            <div class="text-slate-300 text-sm max-w-2xl">
              {{ t('org_certificate.header_subtitle', 'Alur penerbitan sertifikat digital resmi untuk peserta yang telah menyelesaikan pembayaran event.') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3-Step Wizard Navigation Stepper -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <!-- Step 1 Button -->
      <button @click="currentStep = 1" type="button"
        class="flex items-center gap-3.5 p-4 rounded-2xl border transition-all text-left group relative overflow-hidden"
        :class="currentStep === 1 ? 'bg-navy text-white border-navy shadow-md ring-2 ring-primary/30' : 'bg-white text-navy border-gray-200 hover:border-gray-300 shadow-2xs'">
        <div class="size-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-colors"
          :class="currentStep === 1 ? 'bg-primary text-btn-text' : (certificatesList.length > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500')">
          <Icon v-if="currentStep > 1 || certificatesList.length > 0" icon="ph:check-bold" class="text-base" />
          <span v-else>1</span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-[11px] font-bold tracking-wide"
            :class="currentStep === 1 ? 'text-primary' : 'text-gray-400'">{{ t('org_certificate.step1_label', 'Langkah 1') }}</div>
          <div class="font-black text-xs sm:text-sm truncate">{{ t('org_certificate.step1_title', 'Desain & Template') }}</div>
        </div>
        <Icon icon="ph:caret-right-bold" class="text-base shrink-0" :class="currentStep === 1 ? 'text-primary' : 'text-gray-300'" />
      </button>

      <!-- Step 2 Button -->
      <button @click="currentStep = 2" type="button"
        class="flex items-center gap-3.5 p-4 rounded-2xl border transition-all text-left group relative overflow-hidden"
        :class="currentStep === 2 ? 'bg-navy text-white border-navy shadow-md ring-2 ring-primary/30' : 'bg-white text-navy border-gray-200 hover:border-gray-300 shadow-2xs'">
        <div class="size-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-colors"
          :class="currentStep === 2 ? 'bg-primary text-btn-text' : (certificatesList.length > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500')">
          <Icon v-if="certificatesList.length > 0" icon="ph:check-bold" class="text-base" />
          <span v-else>2</span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-[11px] font-bold tracking-wide"
            :class="currentStep === 2 ? 'text-primary' : 'text-gray-400'">{{ t('org_certificate.step2_label', 'Langkah 2') }}</div>
          <div class="font-black text-xs sm:text-sm truncate">{{ t('org_certificate.step2_title', 'Terbitkan Massal') }}</div>
        </div>
        <Icon icon="ph:caret-right-bold" class="text-base shrink-0" :class="currentStep === 2 ? 'text-primary' : 'text-gray-300'" />
      </button>

      <!-- Step 3 Button -->
      <button @click="currentStep = 3" type="button"
        class="flex items-center gap-3.5 p-4 rounded-2xl border transition-all text-left group relative overflow-hidden"
        :class="currentStep === 3 ? 'bg-navy text-white border-navy shadow-md ring-2 ring-primary/30' : 'bg-white text-navy border-gray-200 hover:border-gray-300 shadow-2xs'">
        <div class="size-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-colors"
          :class="currentStep === 3 ? 'bg-primary text-btn-text' : 'bg-gray-100 text-gray-500'">
          <span>3</span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-[11px] font-bold tracking-wide"
            :class="currentStep === 3 ? 'text-primary' : 'text-gray-400'">{{ t('org_certificate.step3_label', 'Langkah 3') }}</div>
          <div class="font-black text-xs sm:text-sm truncate">{{ t('org_certificate.step3_title', 'Sertifikat Terbit') }} ({{ certificatesList.length }})</div>
        </div>
        <Icon icon="ph:certificate-bold" class="text-base shrink-0" :class="currentStep === 3 ? 'text-primary' : 'text-gray-300'" />
      </button>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- STEP 1: DESAIN & KONFIGURASI TEMPLATE                                  -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <div v-if="currentStep === 1" class="space-y-6">
      
      <!-- Mode Selection Segmented Toggle -->
      <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-sm font-black text-navy">{{ t('org_certificate.method_title', 'Metode Pembuatan Sertifikat') }}</h3>
          <div class="text-xs text-gray-500 mt-0.5">{{ t('org_certificate.method_desc', 'Pilih ingin membuat otomatis dari template atau upload file jadi dari panitia.') }}</div>
        </div>

        <div class="flex gap-1 bg-slate-100 rounded-xl p-1 shrink-0">
          <button type="button" @click="sourceMode = 'template'"
            class="px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2"
            :class="sourceMode === 'template' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'">
            <Icon icon="ph:magic-wand-bold" />
            <span>{{ t('org_certificate.method_template', 'Generator Template') }}</span>
          </button>
          <button type="button" @click="sourceMode = 'zip'"
            class="px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2"
            :class="sourceMode === 'zip' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'">
            <Icon icon="ph:file-zip-bold" />
            <span>{{ t('org_certificate.method_zip', 'Upload File (ZIP)') }}</span>
          </button>
        </div>
      </div>

      <!-- OPSI A: GENERATOR TEMPLATE OTOMATIS -->
      <div v-if="sourceMode === 'template'" class="space-y-6">
        <!-- Preset Templates Selector -->
        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div>
            <h3 class="text-base font-black text-navy flex items-center gap-2">
              <span>{{ t('org_certificate.preset_title', 'Pilihan Template Sertifikat (16:9)') }}</span>
            </h3>
            <div class="text-xs text-gray-500 mt-1">{{ t('org_certificate.preset_desc', 'Pilih desain template siap pakai dengan rasio 16:9 untuk diterapkan ke event Anda.') }}</div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
            <div v-for="tmpl in presetTemplates" :key="tmpl.id"
              @click="applyPresetTemplate(tmpl)"
              class="group cursor-pointer rounded-xl border-2 p-4 transition-all relative flex flex-col justify-between"
              :class="selectedPresetId === tmpl.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'">
              
              <div class="space-y-3">
                <div class="aspect-video rounded-lg flex items-center justify-center p-3 text-center border overflow-hidden"
                  :class="tmpl.previewBg">
                  <div class="space-y-1">
                    <div class="text-[9px] font-bold tracking-wider opacity-70">Sertifikat</div>
                    <div class="text-[11px] font-black truncate max-w-[110px]">{{ tmpl.name }}</div>
                  </div>
                </div>

                <div>
                  <h4 class="font-black text-navy text-xs">{{ tmpl.name }}</h4>
                  <div class="text-[10px] text-gray-400 mt-0.5 leading-snug line-clamp-2">{{ tmpl.desc }}</div>
                </div>
              </div>

              <div class="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-black">
                <span :class="selectedPresetId === tmpl.id ? 'text-navy font-bold' : 'text-gray-400'">
                  {{ selectedPresetId === tmpl.id ? t('org_certificate.badge_used', '✓ Digunakan') : t('org_certificate.btn_apply', 'Terapkan') }}
                </span>
                <Icon icon="ph:arrow-right-bold" class="text-xs" :class="selectedPresetId === tmpl.id ? 'text-navy' : 'text-gray-300'" />
              </div>
            </div>
          </div>
        </div>

        <!-- Live Preview & Settings Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- Live Preview Frame (Left / 7 cols) -->
          <div class="lg:col-span-7 space-y-4">
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 class="text-sm font-black text-navy flex items-center gap-2">
                  <span>{{ t('org_certificate.preview_title', 'Pratinjau Desain Sertifikat (16:9)') }}</span>
                </h3>

                <!-- Sample Archer Selector -->
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-400 font-bold">{{ t('org_certificate.sample_archer', 'Contoh Atlet:') }}</span>
                  <select v-model="selectedSampleArcherId" class="h-8 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-navy focus:outline-none focus:border-primary">
                    <option v-for="p in sampleParticipants" :key="p.id" :value="p.id">
                      {{ p.full_name }} ({{ p.athlete_code }})
                    </option>
                  </select>
                </div>
              </div>

              <!-- Iframe Preview Container (16:9 Aspect Ratio) -->
              <div class="bg-gray-50/80 rounded-xl p-3 sm:p-4 border border-gray-200 flex items-center justify-center w-full">
                <iframe
                  :srcdoc="previewIframeDoc"
                  class="w-full aspect-video min-h-[300px] rounded-xl shadow-md border border-gray-200 bg-white"
                  sandbox="allow-same-origin"
                  title="Pratinjau Sertifikat 16:9"
                ></iframe>
              </div>

              <!-- HTML/CSS Custom Editor Toggle -->
              <div class="pt-2 border-t border-gray-100">
                <button @click="showAdvancedEditor = !showAdvancedEditor" type="button"
                  class="text-xs font-bold text-gray-500 hover:text-navy flex items-center gap-1.5 transition-colors">
                  <Icon :icon="showAdvancedEditor ? 'ph:caret-up-bold' : 'ph:code-bold'" class="text-sm" />
                  <span>{{ showAdvancedEditor ? t('org_certificate.hide_code', 'Sembunyikan Editor Kode HTML/CSS') : t('org_certificate.show_code', 'Kustomisasi Kode HTML/CSS') }}</span>
                </button>

                <div v-if="showAdvancedEditor" class="mt-4 space-y-3">
                  <textarea v-model="form.html_template" rows="12" class="w-full font-mono text-xs p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-700 outline-none focus:border-primary transition-colors leading-relaxed"></textarea>
                  
                  <div class="flex flex-wrap gap-1.5 items-center">
                    <span class="text-[10px] font-black text-gray-400 mr-2">Placeholder:</span>
                    <button v-for="ph in placeholders" :key="ph" type="button" @click="insertPlaceholder(ph)" class="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-navy font-mono text-[10px] font-bold rounded transition-colors border border-gray-200">
                      {{ ph }}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Signatory Settings (Right / 5 cols) -->
          <div class="lg:col-span-5 space-y-5">
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 class="text-sm font-black text-navy flex items-center gap-2">
                <span>{{ t('org_certificate.signatory_title', 'Pengaturan Penandatangan & Aset') }}</span>
              </h3>

              <div class="space-y-4">
                <BaseInput v-model="form.organizer_name" :label="t('org_certificate.organizer_name_label', 'Nama Penyelenggara / Penandatangan')" placeholder="Contoh: Pengkab PERPANI Sleman" icon="ph:user-bold" />
                <BaseInput v-model="form.signature_url" :label="t('org_certificate.signature_url_label', 'URL Tanda Tangan / Stempel')" placeholder="https://..." icon="ph:signature-bold" />
                <BaseInput v-model="form.background_url" :label="t('org_certificate.background_url_label', 'URL Latar Belakang (Opsional)')" placeholder="https://..." icon="ph:image-bold" />
                
                <BaseButton @click="saveTemplate" :loading="saving" variant="white" size="sm" icon="ph:floppy-disk-bold" class="w-full font-bold">
                  {{ t('org_certificate.btn_save_config', 'Simpan Konfigurasi') }}
                </BaseButton>
              </div>
            </div>

            <!-- Next Step CTA -->
            <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-3 text-center">
              <div class="text-xs text-gray-500 font-medium">{{ t('org_certificate.next_step_prompt', 'Desain dan penandatangan sudah siap?') }}</div>
              <BaseButton @click="currentStep = 2" variant="primary" size="lg" icon="ph:arrow-right-bold" class="w-full font-black text-sm">
                {{ t('org_certificate.btn_next_step2', 'Lanjut ke Langkah 2: Terbitkan Massal') }}
              </BaseButton>
            </div>
          </div>

        </div>
      </div>

      <!-- OPSI B: BULK UPLOAD FILE JADI (ZIP) -->
      <div v-else class="space-y-6">
        <div class="bg-white rounded-2xl p-10 border-2 border-dashed border-gray-200 hover:border-primary transition-colors text-center relative group">
          <input type="file" ref="fileInput" accept=".zip" class="hidden" @change="handleFileSelected" />
          
          <div class="max-w-md mx-auto space-y-4">
            <div class="size-16 rounded-2xl bg-navy text-primary mx-auto flex items-center justify-center">
              <Icon icon="ph:file-zip-bold" class="text-3xl" />
            </div>
            <div>
              <h3 class="text-base font-black text-navy">{{ t('org_certificate.upload_zip_title', 'Upload File ZIP Sertifikat') }}</h3>
              <div class="text-xs text-gray-500 mt-1 leading-relaxed">
                {{ t('org_certificate.upload_zip_desc', 'Sistem akan otomatis mendeteksi nama atlet berdasarkan format:') }} <br/>
                <span class="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-navy font-bold">ARC-0066_Nama.pdf</span> atau 
                <span class="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-navy font-bold">Nama Lengkap.pdf</span>
              </div>
            </div>
            
            <div class="pt-2">
              <BaseButton @click="$refs.fileInput.click()" :loading="isUploading" variant="primary" size="lg" icon="ph:upload-simple-bold" class="px-8 font-black text-sm">
                {{ isUploading ? t('org_certificate.uploading_zip', 'Memproses File ZIP...') : t('org_certificate.upload_zip_btn', 'Upload File ZIP') }}
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Upload Result Summary (if just uploaded) -->
        <div v-if="uploadResult" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div class="text-xs font-bold text-gray-400">{{ t('org_certificate.total_pdf', 'Total File PDF') }}</div>
              <div class="text-2xl font-black text-navy mt-1">{{ uploadResult.total_files }}</div>
            </div>
            <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div class="text-xs font-bold text-gray-400">{{ t('org_certificate.matched_unit', 'Otomatis Terhubung') }}</div>
              <div class="text-2xl font-black text-navy mt-1">{{ uploadResult.matched_count }}</div>
            </div>
            <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div class="text-xs font-bold text-gray-400">{{ t('org_certificate.unmatched_unit', 'Perlu Penyesuaian') }}</div>
              <div class="text-2xl font-black text-navy mt-1">{{ uploadResult.unmatched_count }}</div>
            </div>
          </div>

          <!-- Unmatched Files Mapping Section -->
          <div v-if="uploadResult.unmatched && uploadResult.unmatched.length > 0" class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-navy flex items-center gap-2">
                <Icon icon="ph:warning-circle-bold" class="text-amber-500 text-lg" />
                <span>{{ t('org_certificate.unmatched_files_title', 'File Yang Belum Terhubung Otomatis') }}</span>
              </h3>
              <span class="text-xs font-bold text-navy bg-gray-100 px-2.5 py-1 rounded-lg">
                {{ uploadResult.unmatched.length }} File
              </span>
            </div>

            <div class="divide-y divide-gray-100">
              <div v-for="file in uploadResult.unmatched" :key="file.filename" class="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <Icon icon="ph:file-pdf-bold" class="text-navy text-2xl shrink-0" />
                  <div class="font-mono text-xs font-bold text-navy truncate max-w-xs">{{ file.filename }}</div>
                </div>

                <div class="flex items-center gap-2">
                  <select v-model="manualAssignments[file.filename]" class="h-9 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-navy focus:outline-none focus:border-primary">
                    <option value="">{{ t('org_certificate.select_archer_default', 'Pilih Atlet Sesuai File...') }}</option>
                    <option v-for="p in participants" :key="p.uuid || p.id" :value="p.uuid || p.id">
                      {{ p.full_name }} ({{ p.athlete_code || p.id || '-' }})
                    </option>
                  </select>
                  <BaseButton size="xs" variant="primary" icon="ph:link-bold" :loading="isAssigning[file.filename]" @click="handleManualAssign(file.filename, file.pdf_url)">
                    {{ t('org_certificate.btn_assign', 'Hubungkan') }}
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- STEP 2: TERBITKAN SERTIFIKAT MASSAL                                    -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <div v-if="currentStep === 2" class="space-y-6">
      
      <!-- Issuance Review Card -->
      <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6">
          <div>
            <span class="text-xs font-bold text-primary bg-navy px-3 py-1 rounded-md">{{ t('org_certificate.step2_badge', 'Langkah 2 Dari 3') }}</span>
            <h2 class="text-xl font-black text-navy mt-2">{{ t('org_certificate.step2_heading', 'Konfirmasi & Terbitkan Sertifikat') }}</h2>
            <div class="text-xs text-gray-500 mt-1">{{ t('org_certificate.step2_desc', 'Review kesiapan peserta berhak lunas sebelum menerbitkan nomor sertifikat resmi.') }}</div>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-right">
              <div class="text-[11px] font-bold text-gray-400">{{ t('org_certificate.total_paid_participants', 'Total Peserta Lunas') }}</div>
              <div class="text-2xl font-black text-navy">{{ eligibleParticipants.length }} Atlet</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div class="text-[11px] font-bold text-gray-400">{{ t('org_certificate.selected_method', 'Metode Terpilih') }}</div>
            <div class="font-black text-sm text-navy mt-1">
              {{ sourceMode === 'template' ? t('org_certificate.method_template', 'Generator Template') : t('org_certificate.method_zip', 'Upload File (ZIP)') }}
            </div>
          </div>

          <div class="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div class="text-[11px] font-bold text-gray-400">{{ t('org_certificate.numbering_format', 'Format Penomoran') }}</div>
            <div class="font-black text-sm text-navy mt-1 font-mono">
              CERT-{{ new Date().getFullYear() }}-XXXX
            </div>
          </div>

          <div class="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div class="text-[11px] font-bold text-gray-400">{{ t('org_certificate.current_status', 'Status Saat Ini') }}</div>
            <div class="font-black text-sm mt-1" :class="certificatesList.length > 0 ? 'text-emerald-600' : 'text-amber-600'">
              {{ certificatesList.length > 0 ? t('org_certificate.status_issued_count', { count: certificatesList.length }) : t('org_certificate.status_not_issued', 'Belum Diterbitkan') }}
            </div>
          </div>
        </div>

        <!-- Action Box -->
        <div class="bg-navy rounded-2xl p-6 text-white border border-primary/20 shadow-md space-y-4">
          <div class="flex items-center gap-3">
            <div class="size-11 rounded-xl bg-white/10 text-primary flex items-center justify-center shrink-0">
              <Icon icon="ph:lightning-bold" class="text-2xl" />
            </div>
            <div>
              <h4 class="font-black text-sm text-white">{{ t('org_certificate.exec_title', 'Eksekusi Penerbitan Sertifikat') }}</h4>
              <div class="text-xs text-slate-300">{{ t('org_certificate.exec_desc', 'Buat nomor sertifikat unik dan link verifikasi online secara instan.') }}</div>
            </div>
          </div>

          <div class="pt-2 flex flex-col sm:flex-row gap-3">
            <BaseButton @click="handleGenerateAll" :loading="isGeneratingAll" variant="primary" size="lg" icon="ph:paper-plane-tilt-bold" class="flex-1 font-black text-sm">
              {{ isGeneratingAll ? t('org_certificate.btn_issuing', 'Menerbitkan...') : t('org_certificate.btn_issue_all', { count: eligibleParticipants.length }) }}
            </BaseButton>
            <BaseButton @click="currentStep = 1" variant="white" size="lg" icon="ph:arrow-left-bold" class="!bg-white/10 !text-white hover:!bg-white/20 !border-white/20 font-bold">
              {{ t('org_certificate.btn_back_to_design', 'Kembali ke Desain') }}
            </BaseButton>
          </div>
        </div>

      </div>

    </div>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- STEP 3: DAFTAR SERTIFIKAT TERBIT & DISTRIBUSI                          -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <div v-if="currentStep === 3" class="space-y-4">
      <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="relative flex-1 max-w-md">
            <input v-model="certSearch" type="text" :placeholder="t('org_certificate.search_cert_placeholder', 'Cari nama atlet, nomor sertifikat, atau kategori...')"
              class="w-full h-11 px-4 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-navy focus:outline-none focus:border-primary" />
            <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
          </div>

          <div class="flex items-center gap-3">
            <BaseButton @click="currentStep = 1" variant="white" size="sm" icon="ph:pencil-simple-bold" class="font-bold">
              {{ t('org_certificate.btn_change_design', 'Ubah Desain') }}
            </BaseButton>
            <BaseButton v-if="certificatesList.length > 0" @click="handleClearAll" :loading="isClearing" variant="white" size="sm" icon="ph:trash-bold" class="!text-red-500 !border-red-100 hover:!bg-red-50 font-bold">
              {{ t('org_certificate.btn_clear_all', 'Bersihkan Semua') }}
            </BaseButton>
          </div>
        </div>

        <div v-if="isLoadingCerts" class="py-16 text-center text-gray-400 text-xs">
          <div class="size-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          {{ t('org_certificate.loading_certs', 'Memuat data sertifikat...') }}
        </div>
        
        <div v-else-if="filteredCerts.length === 0" class="py-16 text-center text-gray-400 text-xs">
          <Icon icon="ph:certificate-bold" class="text-4xl mx-auto mb-2 text-gray-300" />
          <div class="font-bold text-gray-500">{{ t('org_certificate.empty_title', 'Belum ada sertifikat yang diterbitkan') }}</div>
          <div class="text-gray-400 mt-1 max-w-sm mx-auto">{{ t('org_certificate.empty_desc', 'Klik Langkah 2: Terbitkan Massal untuk membuat sertifikat bagi peserta lunas.') }}</div>
          <div class="mt-4">
            <BaseButton @click="currentStep = 2" variant="primary" size="sm" icon="ph:arrow-right-bold" class="font-bold">
              {{ t('org_certificate.btn_go_to_step2', 'Menuju Langkah 2') }}
            </BaseButton>
          </div>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-gray-100 text-gray-400 font-black tracking-wider text-[10px]">
                <th class="py-3.5 px-4">{{ t('org_certificate.th_archer', 'Atlet / Peserta') }}</th>
                <th class="py-3.5 px-4">{{ t('org_certificate.th_cert_no', 'No. Sertifikat') }}</th>
                <th class="py-3.5 px-4">{{ t('org_certificate.th_category', 'Kategori Lomba') }}</th>
                <th class="py-3.5 px-4">{{ t('org_certificate.th_issue_date', 'Tanggal Terbit') }}</th>
                <th class="py-3.5 px-4 text-right">{{ t('org_certificate.th_action', 'Aksi') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="cert in filteredCerts" :key="cert.uuid" class="hover:bg-gray-50/60 transition-colors">
                <td class="py-3.5 px-4">
                  <div class="font-black text-navy text-sm">{{ cert.archer_name }}</div>
                  <div class="text-[11px] text-gray-400 font-mono">{{ cert.athlete_code || '-' }}</div>
                </td>
                <td class="py-3.5 px-4">
                  <span class="font-mono font-bold text-navy px-2 py-1 rounded bg-gray-100 text-[11px]">
                    {{ cert.certificate_no }}
                  </span>
                </td>
                <td class="py-3.5 px-4 text-gray-600 font-medium">{{ cert.category_name || '-' }}</td>
                <td class="py-3.5 px-4 text-gray-500">{{ formatDate(cert.issue_date || cert.created_at) }}</td>
                <td class="py-3.5 px-4 text-right space-x-2">
                  <a v-if="cert.pdf_url" :href="cert.pdf_url" target="_blank"
                    class="inline-flex items-center gap-1 px-3 py-1.5 bg-navy text-btn-inverse rounded-xl font-bold text-xs hover:bg-navy/90 transition-colors">
                    <Icon icon="ph:file-pdf-bold" />
                    <span>{{ t('org_certificate.btn_view_pdf', 'Lihat PDF') }}</span>
                  </a>
                  <a v-else :href="`/api/certificates/${cert.uuid}/pdf`" target="_blank"
                    class="inline-flex items-center gap-1 px-3 py-1.5 bg-navy text-btn-inverse rounded-xl font-bold text-xs hover:bg-navy/90 transition-colors">
                    <Icon icon="ph:file-pdf-bold" />
                    <span>{{ t('org_certificate.btn_view_pdf', 'Lihat PDF') }}</span>
                  </a>
                  <button @click="handleDeleteCert(cert.uuid)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors" :title="t('org_certificate.th_action', 'Hapus Sertifikat')">
                    <Icon icon="ph:trash-bold" class="text-base" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from '#app'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

definePageMeta({
  layout: 'dashboard'
})

useHead({ title: computed(() => t('org_certificate.header_title', 'Sertifikat Event') + ' - ArcheryHub Dashboard') })

const route = useRoute()
const eventId = route.params.id
const { get, post, delete: del } = useApi()
const toast = useToast()

const currentStep = ref(1)
const sourceMode = ref('template')
const saving = ref(false)
const isUploading = ref(false)
const isLoadingCerts = ref(false)
const isGeneratingAll = ref(false)
const isClearing = ref(false)
const uploadResult = ref(null)
const manualAssignments = ref({})
const isAssigning = ref({})
const certificatesList = ref([])
const batchHistory = ref([])
const participants = ref([])
const eventData = ref(null)
const certSearch = ref('')
const selectedPresetId = ref('classic_gold')
const selectedSampleArcherId = ref('')
const showAdvancedEditor = ref(false)

const placeholders = [
  '{{ArcherName}}',
  '{{EventName}}',
  '{{CategoryName}}',
  '{{CertificateNo}}',
  '{{IssueDate}}',
  '{{OrganizerName}}'
]

// ── 5 Preset Certificate Templates (16:9 Aspect Ratio) ───────────────────
const presetTemplates = [
  {
    id: 'classic_gold',
    name: 'Classic Gold',
    desc: 'Desain elegan ornamen emas & royal navy dengan aksen klasik resmi kejuaraan nasional.',
    previewBg: 'bg-navy text-primary border-primary/30',
    html: `<div style="width: 100%; aspect-ratio: 16/9; padding: 25px 30px; background: #0f172a; color: #f8fafc; font-family: 'Times New Roman', serif; box-sizing: border-box; position: relative; border: 6px double #e2b714; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
  <div style="border: 1.5px solid #e2b714; padding: 18px 24px; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
    <div>
      <div style="color: #e2b714; font-size: 11px; letter-spacing: 3px; font-weight: bold;">SERTIFIKAT PENGHARGAAN</div>
      <div style="font-size: 20px; font-weight: bold; color: #ffffff; margin: 6px 0 2px;">{{EventName}}</div>
      <div style="font-size: 10px; color: #94a3b8; letter-spacing: 1.5px;">Diberikan dengan bangga kepada:</div>
    </div>
    
    <div style="margin: 8px 0;">
      <div style="font-size: 26px; color: #e2b714; font-weight: bold; font-family: 'Georgia', serif; border-bottom: 2px solid #334155; display: inline-block; padding-bottom: 4px; min-width: 280px;">
        {{ArcherName}}
      </div>
      <div style="font-size: 11px; color: #cbd5e1; max-width: 520px; margin: 8px auto 0; line-height: 1.4;">
        Atas partisipasi dan prestasi luar biasa pada kategori <strong style="color: #ffffff;">{{CategoryName}}</strong> dalam kejuaraan resmi yang diselenggarakan oleh <strong>{{OrganizerName}}</strong>.
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 8px;">
      <div style="text-align: left; font-size: 9px; color: #64748b; font-family: sans-serif;">
        <div>No: <strong style="color: #94a3b8;">{{CertificateNo}}</strong></div>
        <div>Tanggal: {{IssueDate}}</div>
      </div>
      <div style="text-align: center;">
        <div style="height: 28px; border-bottom: 1px dashed #64748b; width: 120px; margin-bottom: 4px;"></div>
        <div style="font-size: 10px; font-weight: bold; color: #ffffff;">{{OrganizerName}}</div>
        <div style="font-size: 8px; color: #64748b;">Penyelenggara Resmi</div>
      </div>
    </div>
  </div>
</div>`
  },
  {
    id: 'modern_navy',
    name: 'Modern Vanguard',
    desc: 'Gaya modern minimalis bersih dengan kontras tinggi dan aksen garis target panahan.',
    previewBg: 'bg-white text-navy border-gray-300',
    html: `<div style="width: 100%; aspect-ratio: 16/9; padding: 25px 30px; background: #ffffff; color: #0f172a; font-family: 'Inter', sans-serif; box-sizing: border-box; position: relative; border: 8px solid #0f172a; display: flex; flex-direction: column; justify-content: space-between;">
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">
    <div>
      <div style="font-size: 16px; font-weight: 900; color: #0f172a;">ARCHERY CHAMPIONSHIP</div>
      <div style="font-size: 9px; font-weight: 700; color: #64748b;">Official Certificate of Achievement</div>
    </div>
    <div style="font-size: 9px; font-family: monospace; color: #0f172a; background: #f8fafc; padding: 3px 8px; border-radius: 4px; border: 1px solid #e2e8f0;">
      NO: {{CertificateNo}}
    </div>
  </div>

  <div style="margin: 8px 0;">
    <div style="font-size: 10px; font-weight: 700; color: #94a3b8; letter-spacing: 1px;">Diberikan Kepada:</div>
    <div style="font-size: 28px; font-weight: 900; color: #0f172a; margin: 4px 0 8px;">{{ArcherName}}</div>
    <div style="font-size: 11px; color: #475569; max-width: 500px; line-height: 1.4;">
      Sebagai bentuk apresiasi atas keikutsertaan dan dedikasi atlet pada event <strong>{{EventName}}</strong> divisi <strong>{{CategoryName}}</strong>.
    </div>
  </div>

  <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 10px; border-top: 2px solid #f1f5f9;">
    <div>
      <div style="font-size: 9px; color: #94a3b8;">Diterbitkan pada:</div>
      <div style="font-size: 11px; font-weight: 700; color: #0f172a;">{{IssueDate}}</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 11px; font-weight: 800; color: #0f172a;">{{OrganizerName}}</div>
      <div style="font-size: 9px; color: #64748b;">Event Committee</div>
    </div>
  </div>
</div>`
  },
  {
    id: 'royal_emerald',
    name: 'Royal Emerald',
    desc: 'Tema kemewahan hijau zamrud dan emas dengan bingkai ornamen prestasi formal.',
    previewBg: 'bg-navy text-primary border-gray-300',
    html: `<div style="width: 100%; aspect-ratio: 16/9; padding: 25px; background: #064e3b; color: #ecfdf5; font-family: 'Georgia', serif; box-sizing: border-box; position: relative; border: 8px solid #d97706; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
  <div style="border: 1.5px dashed #fbbf24; padding: 18px 24px; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
    <div>
      <div style="color: #fbbf24; font-size: 11px; letter-spacing: 3px; font-weight: bold;">PIAGAM PENGHARGAAN</div>
      <div style="font-size: 20px; font-weight: bold; color: #ffffff; margin: 6px 0;">{{EventName}}</div>
      <div style="font-size: 10px; color: #a7f3d0;">Dianugerahkan kepada:</div>
    </div>
    
    <div style="margin: 6px 0;">
      <div style="font-size: 28px; color: #fbbf24; font-weight: bold; margin: 4px 0;">{{ArcherName}}</div>
      <div style="font-size: 11px; color: #d1fae5; max-width: 500px; margin: 0 auto; line-height: 1.4;">
        Telah berhasil menunjukkan dedikasi dan sportivitas terbaik dalam kompetisi divisi <strong>{{CategoryName}}</strong> yang diselenggarakan oleh <strong>{{OrganizerName}}</strong>.
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 8px;">
      <div style="text-align: left; font-size: 9px; color: #6ee7b7; font-family: sans-serif;">
        <div>Sertifikat No: {{CertificateNo}}</div>
        <div>Tanggal: {{IssueDate}}</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 11px; font-weight: bold; color: #ffffff;">{{OrganizerName}}</div>
        <div style="font-size: 9px; color: #6ee7b7;">Ketua Pelaksana</div>
      </div>
    </div>
  </div>
</div>`
  },
  {
    id: 'dynamic_champion',
    name: 'Dynamic Champion',
    desc: 'Desain sporty penuh energi dengan aksen garis dan layout atletik kontemporer.',
    previewBg: 'bg-navy text-white border-primary/20',
    html: `<div style="width: 100%; aspect-ratio: 16/9; padding: 25px 30px; background: #1e1b4b; color: #ffffff; font-family: 'Inter', sans-serif; box-sizing: border-box; position: relative; border-top: 8px solid #e11d48; border-bottom: 8px solid #e11d48; display: flex; flex-direction: column; justify-content: space-between;">
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
    <div>
      <div style="font-size: 16px; font-weight: 900; color: #e11d48; letter-spacing: 1px;">CERTIFICATE OF EXCELLENCE</div>
      <div style="font-size: 10px; font-weight: 600; color: #cbd5e1;">{{EventName}}</div>
    </div>
    <div style="text-align: right; font-family: monospace; font-size: 10px; color: #fda4af;">
      #{{CertificateNo}}
    </div>
  </div>

  <div style="margin: 8px 0; text-align: center;">
    <div style="font-size: 9px; font-weight: 800; color: #e11d48; letter-spacing: 2px;">THIS IS PROUDLY PRESENTED TO</div>
    <div style="font-size: 28px; font-weight: 900; color: #ffffff; margin: 4px 0 6px;">{{ArcherName}}</div>
    <div style="display: inline-block; background: rgba(225, 29, 72, 0.2); border: 1px solid #e11d48; padding: 2px 10px; border-radius: 999px; font-weight: 800; font-size: 10px; color: #fecdd3; margin-bottom: 6px;">
      {{CategoryName}}
    </div>
    <div style="font-size: 10px; color: #94a3b8; max-width: 460px; margin: 0 auto; line-height: 1.4;">
      In recognition of outstanding performance and true spirit of competitive archery.
    </div>
  </div>

  <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px;">
    <div style="font-size: 9px; color: #64748b;">
      Date: <strong style="color: #cbd5e1;">{{IssueDate}}</strong>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 11px; font-weight: 800; color: #ffffff;">{{OrganizerName}}</div>
      <div style="font-size: 9px; color: #fda4af;">Authorized Official</div>
    </div>
  </div>
</div>`
  },
  {
    id: 'vintage_pergament',
    name: 'Vintage Pergament',
    desc: 'Nuansa klasik perkamen bernuansa hangat dengan bingkai kaligrafi tradisional.',
    previewBg: 'bg-navy text-primary border-primary/20',
    html: `<div style="width: 100%; aspect-ratio: 16/9; padding: 25px; background: #fffbeb; color: #451a03; font-family: 'Times New Roman', serif; box-sizing: border-box; position: relative; border: 8px solid #78350f; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
  <div style="border: 1.5px solid #b45309; padding: 18px 24px; height: 100%; box-sizing: border-box; background: #fef3c7; display: flex; flex-direction: column; justify-content: space-between;">
    <div>
      <div style="font-size: 11px; letter-spacing: 3px; font-weight: bold; color: #78350f;">SERTIFIKAT PRESTASI</div>
      <div style="font-size: 20px; font-weight: bold; color: #451a03; margin: 4px 0 2px;">{{EventName}}</div>
      <div style="font-size: 10px; font-style: italic; color: #92400e;">Diberikan kepada:</div>
    </div>
    
    <div style="margin: 6px 0;">
      <div style="font-size: 28px; color: #78350f; font-weight: bold; font-family: 'Georgia', serif; border-bottom: 2px solid #b45309; display: inline-block; padding-bottom: 4px; min-width: 260px;">
        {{ArcherName}}
      </div>
      <div style="font-size: 11px; color: #78350f; max-width: 480px; margin: 6px auto 0; line-height: 1.4;">
        Sebagai bukti keikutsertaan resmi dan dedikasi panahan pada divisi <strong>{{CategoryName}}</strong> yang diselenggarakan oleh <strong>{{OrganizerName}}</strong>.
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 8px;">
      <div style="text-align: left; font-size: 9px; color: #92400e; font-family: sans-serif;">
        <div>No: <strong>{{CertificateNo}}</strong></div>
        <div>Tanggal: {{IssueDate}}</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 11px; font-weight: bold; color: #451a03;">{{OrganizerName}}</div>
        <div style="font-size: 9px; color: #92400e;">Panitia Pelaksana</div>
      </div>
    </div>
  </div>
</div>`
  }
]

const form = ref({
  html_template: presetTemplates[0].html,
  organizer_name: 'Panitia Pelaksana Event',
  signature_url: '',
  background_url: ''
})

const eligibleParticipants = computed(() => {
  return participants.value.filter(p => {
    const s = (p.payment_status || '').toLowerCase()
    return s === 'paid' || s === 'lunas'
  })
})

const sampleParticipants = computed(() => {
  if (eligibleParticipants.value.length > 0) return eligibleParticipants.value.slice(0, 10)
  if (participants.value.length > 0) return participants.value.slice(0, 10)
  return [
    { id: '1', full_name: 'Angger Raka Sanjaya', athlete_code: 'ARC-0066', category_name: 'Barebow Umum Putra' },
    { id: '2', full_name: 'Dimas Aditya', athlete_code: 'ARC-0064', category_name: 'Recurve U-15 Putra' }
  ]
})

const currentSampleArcher = computed(() => {
  if (selectedSampleArcherId.value) {
    const found = sampleParticipants.value.find(p => p.id === selectedSampleArcherId.value)
    if (found) return found
  }
  return sampleParticipants.value[0] || {
    full_name: 'Angger Raka Sanjaya',
    athlete_code: 'ARC-0066',
    category_name: 'Barebow Umum Putra'
  }
})

const renderedPreviewHtml = computed(() => {
  let raw = form.value.html_template || presetTemplates[0].html
  const archer = currentSampleArcher.value
  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  
  raw = raw.replace(/\{\{ArcherName\}\}/g, archer.full_name || 'Nama Atlet')
  raw = raw.replace(/\{\{EventName\}\}/g, eventData.value?.name || 'Kejuaraan Panahan Nasional 2026')
  raw = raw.replace(/\{\{CategoryName\}\}/g, archer.category_name || 'Barebow Putra 50m')
  raw = raw.replace(/\{\{CertificateNo\}\}/g, 'CERT-2026-PREVIEW')
  raw = raw.replace(/\{\{IssueDate\}\}/g, today)
  raw = raw.replace(/\{\{OrganizerName\}\}/g, form.value.organizer_name || 'Penyelenggara Event')
  
  return raw
})

const previewIframeDoc = computed(() => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      overflow: hidden;
    }
  </style>
</head>
<body>
  ${renderedPreviewHtml.value}
</body>
</html>`
})

const applyPresetTemplate = (tmpl) => {
  selectedPresetId.value = tmpl.id
  form.value.html_template = tmpl.html
  toast.success(t('org_certificate.msg_template_applied', { name: tmpl.name }))
}

const filteredCerts = computed(() => {
  if (!certSearch.value) return certificatesList.value
  const q = certSearch.value.toLowerCase()
  return certificatesList.value.filter(c =>
    c.archer_name?.toLowerCase().includes(q) ||
    c.certificate_no?.toLowerCase().includes(q) ||
    c.athlete_code?.toLowerCase().includes(q) ||
    c.category_name?.toLowerCase().includes(q)
  )
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const fetchCertificates = async () => {
  isLoadingCerts.value = true
  try {
    const [certsRes, batchesRes, partsRes, eventRes] = await Promise.all([
      get(`/events/${eventId}/certificates`),
      get(`/events/${eventId}/certificates/upload-batches`),
      get(`/events/${eventId}/participants?limit=500`),
      get(`/events/${eventId}`)
    ])
    certificatesList.value = certsRes?.data || certsRes || []
    batchHistory.value = batchesRes?.data || batchesRes || []
    participants.value = partsRes?.participants || partsRes?.data || partsRes || []
    eventData.value = eventRes?.event || eventRes || null
    if (sampleParticipants.value.length > 0 && !selectedSampleArcherId.value) {
      selectedSampleArcherId.value = sampleParticipants.value[0].id
    }
  } catch (err) {
    console.error('Failed to fetch certificates data:', err)
  } finally {
    isLoadingCerts.value = false
  }
}

const handleGenerateAll = async () => {
  if (!confirm(t('org_certificate.confirm_generate_all', 'Terbitkan sertifikat resmi sekarang untuk semua peserta lunas?'))) return
  isGeneratingAll.value = true
  try {
    const res = await post(`/events/${eventId}/certificates/generate-all`, {})
    toast.success(res?.message || t('org_certificate.msg_certs_generated', 'Semua sertifikat berhasil diterbitkan!'))
    await fetchCertificates()
    currentStep.value = 3
  } catch (err) {
    console.error('Failed to generate certificates:', err)
    toast.error(err?.data?.error || 'Gagal menerbitkan sertifikat')
  } finally {
    isGeneratingAll.value = false
  }
}

const handleClearAll = async () => {
  if (!confirm(t('org_certificate.confirm_clear_all', 'Peringatan: Yakin ingin menghapus dan membersihkan seluruh sertifikat yang telah diterbitkan untuk event ini?'))) return
  isClearing.value = true
  try {
    await del(`/events/${eventId}/certificates/clear-all`)
    toast.success(t('org_certificate.msg_certs_cleared', 'Seluruh sertifikat event berhasil dibersihkan'))
    await fetchCertificates()
    currentStep.value = 1
  } catch (err) {
    console.error('Failed to clear certificates:', err)
    toast.error('Gagal membersihkan sertifikat')
  } finally {
    isClearing.value = false
  }
}

const handleFileSelected = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  isUploading.value = true
  try {
    const res = await post(`/events/${eventId}/certificates/upload-zip`, formData)
    uploadResult.value = res
    toast.success(t('org_certificate.msg_zip_success', { count: res.matched_count || 0 }))
    await fetchCertificates()
    currentStep.value = 2
  } catch (error) {
    console.error('Failed to upload certificates ZIP:', error)
    toast.error(error?.data?.error || 'Gagal memproses file ZIP sertifikat')
  } finally {
    isUploading.value = false
    event.target.value = ''
  }
}

const handleManualAssign = async (filename, pdfUrl) => {
  const partId = manualAssignments.value[filename]
  if (!partId) {
    toast.error('Silakan pilih atlet terlebih dahulu')
    return
  }

  isAssigning.value[filename] = true
  try {
    await post(`/events/${eventId}/certificates/manual-assign`, {
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
    await fetchCertificates()
  } catch (error) {
    console.error('Failed to assign certificate:', error)
    toast.error(error?.data?.error || 'Gagal menghubungkan sertifikat')
  } finally {
    isAssigning.value[filename] = false
  }
}

const handleDeleteCert = async (certId) => {
  if (!confirm(t('org_certificate.confirm_delete_single', 'Yakin ingin menghapus sertifikat ini?'))) return
  try {
    await del(`/events/${eventId}/certificates/${certId}`)
    toast.success(t('org_certificate.msg_cert_deleted', 'Sertifikat berhasil dihapus'))
    await fetchCertificates()
  } catch (error) {
    console.error('Failed to delete certificate:', error)
    toast.error('Gagal menghapus sertifikat')
  }
}

const fetchTemplate = async () => {
  try {
    const res = await get(`/events/${eventId}/certificate-template`)
    if (res && res.html_template) {
      form.value.html_template = res.html_template
      form.value.signature_url = res.signature_url || ''
      form.value.background_url = res.background_url || ''
    }
  } catch (err) {
    console.error('Failed to fetch certificate template:', err)
  }
}

const insertPlaceholder = (ph) => {
  form.value.html_template += ` ${ph}`
}

const saveTemplate = async () => {
  saving.value = true
  try {
    await post(`/events/${eventId}/certificate-template`, form.value)
    toast.success(t('org_certificate.msg_template_saved', 'Template sertifikat berhasil disimpan!'))
  } catch (err) {
    console.error('Failed to save template:', err)
    toast.error('Gagal menyimpan template sertifikat.')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchTemplate()
  fetchCertificates()
})
</script>

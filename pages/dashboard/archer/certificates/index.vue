<template>
  <div class="space-y-6 md:space-y-8 pb-16 font-body text-navy antialiased">
    <!-- Header Section -->
    <DashboardHeader
      :title="t('archer_certificates.title')"
      :subtitle="t('archer_certificates.subtitle')"
      icon="ph:certificate-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/archer' },
        { label: t('archer_certificates.breadcrumb') }
      ]"
    >
      <template #actions>
        <!-- Quick Search Bar in Header -->
        <div class="relative w-full sm:w-72 shrink-0">
          <Icon
            icon="ph:magnifying-glass-bold"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"
          />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('archer_certificates.search_placeholder')"
            class="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs font-bold text-navy placeholder:text-slate-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all shadow-2xs"
          />
          <button
            v-if="searchQuery"
            type="button"
            @click="searchQuery = ''"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <Icon icon="ph:x-bold" class="text-xs" />
          </button>
        </div>
      </template>
    </DashboardHeader>

    <!-- Top KPI Stats Summary (3 Cards) -->
    <div v-if="!pending && certificates && certificates.length > 0" class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
      <!-- Stat 1: Total Certificates -->
      <StatCard
        :title="t('archer_certificates.total_certs')"
        :value="certificates.length"
        icon="ph:certificate-bold"
        color="primary"
        :description="t('archer_certificates.total_certs_desc')"
        description-icon="ph:seal-check-bold"
      />

      <!-- Stat 2: Total Tournaments -->
      <StatCard
        :title="t('archer_certificates.total_tournaments')"
        :value="uniqueTournaments.length"
        icon="ph:trophy-bold"
        color="primary"
        :description="t('archer_certificates.total_tournaments_desc')"
        description-icon="ph:flag-banner-bold"
      />

      <!-- Stat 3: Latest Certificate Date -->
      <StatCard
        :title="t('archer_certificates.latest_cert')"
        :value="latestCertificateDate"
        icon="ph:calendar-check-bold"
        color="primary"
        :description="latestCertificateEventName || t('archer_certificates.latest_cert_desc')"
        description-icon="ph:clock-bold"
      />
    </div>

    <!-- Tournament Filter Pills & Controls Bar -->
    <div v-if="!pending && certificates && certificates.length > 0" class="space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <!-- Tournament Filter Pills (Scrollable) -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
          <button
            type="button"
            @click="selectTournament('')"
            :class="[
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer border',
              !selectedTournamentId
                ? 'bg-navy text-white border-navy shadow-2xs'
                : 'bg-white text-slate-600 hover:text-navy hover:bg-slate-50 border-slate-200/90'
            ]"
          >
            <span>{{ t('archer_certificates.all_tournaments') }}</span>
            <span
              :class="[
                'px-1.5 py-0.2 rounded-md text-[10px] font-black',
                !selectedTournamentId ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              ]"
            >
              {{ certificates.length }}
            </span>
          </button>

          <button
            v-for="tourney in uniqueTournaments"
            :key="tourney.id"
            type="button"
            @click="selectTournament(tourney.id)"
            :class="[
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer border max-w-[240px] truncate',
              selectedTournamentId === tourney.id
                ? 'bg-navy text-white border-navy shadow-2xs'
                : 'bg-white text-slate-600 hover:text-navy hover:bg-slate-50 border-slate-200/90'
            ]"
            :title="tourney.name"
          >
            <Icon icon="ph:trophy-bold" class="text-xs shrink-0" :class="selectedTournamentId === tourney.id ? 'text-primary' : 'text-slate-400'" />
            <span class="truncate">{{ tourney.name }}</span>
            <span
              :class="[
                'px-1.5 py-0.2 rounded-md text-[10px] font-black shrink-0',
                selectedTournamentId === tourney.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              ]"
            >
              {{ tourney.count }}
            </span>
          </button>
        </div>

        <!-- View Mode Switch (Grouped per Tournament vs Flat Grid) -->
        <div v-if="!selectedTournamentId" class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-end sm:self-auto border border-slate-200/60">
          <button
            type="button"
            @click="viewMode = 'grouped'"
            :class="[
              'px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
              viewMode === 'grouped' ? 'bg-white text-navy shadow-2xs font-black' : 'text-slate-500 hover:text-navy'
            ]"
            :title="t('archer_certificates.group_by_tournament')"
          >
            <Icon icon="ph:folders-bold" class="text-xs" />
            <span>{{ t('archer_certificates.group_by_tournament') }}</span>
          </button>
          <button
            type="button"
            @click="viewMode = 'grid'"
            :class="[
              'px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
              viewMode === 'grid' ? 'bg-white text-navy shadow-2xs font-black' : 'text-slate-500 hover:text-navy'
            ]"
            :title="t('archer_certificates.view_flat')"
          >
            <Icon icon="ph:squares-four-bold" class="text-xs" />
            <span>{{ t('archer_certificates.view_flat') }}</span>
          </button>
        </div>
      </div>

      <!-- Active Tournament Filter Banner (When a tournament is selected) -->
      <div
        v-if="selectedTournament"
        class="bg-white rounded-2xl border border-primary/20 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="size-10 rounded-xl bg-navy text-white flex items-center justify-center shrink-0 shadow-xs border border-primary/20">
            <Icon icon="ph:trophy-bold" class="text-lg text-primary" />
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-md bg-primary/10 text-primary-dark font-black text-[10px] tracking-wider">
                {{ t('archer_certificates.active_filter_scope') }}
              </span>
              <span class="text-xs text-slate-400 font-bold">
                {{ selectedTournament.count }} {{ t('archer_certificates.cert_count_suffix') }}
              </span>
            </div>
            <h3 class="text-sm sm:text-base font-black text-navy truncate mt-0.5">
              {{ selectedTournament.name }}
            </h3>
          </div>
        </div>

        <button
          type="button"
          @click="selectTournament('')"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer shrink-0"
        >
          <Icon icon="ph:x-bold" class="text-xs" />
          <span>{{ t('archer_certificates.show_all_tournaments') }}</span>
        </button>
      </div>
    </div>

    <!-- Loading State: 3 Columns Grid -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="n in 6" :key="n" class="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs animate-pulse space-y-4">
        <div class="h-40 bg-slate-100 rounded-2xl w-full"></div>
        <div class="h-4 bg-slate-200 rounded-full w-3/4"></div>
        <div class="h-3 bg-slate-100 rounded-full w-1/2"></div>
        <div class="h-9 bg-slate-100 rounded-xl w-full"></div>
      </div>
    </div>

    <!-- Empty State: No Certificates at All -->
    <div v-else-if="!certificates || certificates.length === 0" class="bg-white border border-gray-100 rounded-3xl p-12 sm:p-16 text-center shadow-sm">
      <div class="max-w-md mx-auto space-y-4">
        <div class="size-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-navy border border-primary/20 shadow-xs">
          <Icon icon="ph:certificate-bold" class="text-4xl text-primary-dark" />
        </div>
        <div class="text-xl font-black text-navy">{{ t('archer_certificates.empty_title') }}</div>
        <div class="text-sm text-slate-500 font-medium leading-relaxed">
          {{ t('archer_certificates.empty_desc') }}
        </div>
        <div class="pt-2">
          <NuxtLink
            to="/dashboard/archer/tournaments"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-navy hover:bg-navy-light text-white font-bold text-xs rounded-xl transition-colors shadow-2xs cursor-pointer"
          >
            <Icon icon="ph:trophy-bold" class="text-primary text-sm" />
            <span>{{ t('archer_certificates.explore_events') }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Empty State: Search / Filter No Match -->
    <div v-else-if="filteredCertificates.length === 0" class="bg-white border border-slate-200/80 rounded-3xl p-10 sm:p-14 text-center shadow-xs">
      <div class="max-w-md mx-auto space-y-4">
        <div class="size-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
          <Icon icon="ph:magnifying-glass-bold" class="text-3xl" />
        </div>
        <div class="text-lg font-black text-navy">{{ t('archer_certificates.no_match_title') }}</div>
        <div class="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          {{ t('archer_certificates.no_match_desc') }}
        </div>
        <div class="pt-2 flex items-center justify-center gap-2">
          <button
            v-if="searchQuery"
            type="button"
            @click="searchQuery = ''"
            class="px-4 py-2 bg-navy text-white text-xs font-bold rounded-xl hover:bg-navy-light transition-colors cursor-pointer"
          >
            {{ t('archer_certificates.clear_search') }}
          </button>
          <button
            v-if="selectedTournamentId"
            type="button"
            @click="selectTournament('')"
            class="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {{ t('archer_certificates.show_all_tournaments') }}
          </button>
        </div>
      </div>
    </div>

    <!-- VIEW MODE 1: Grouped by Tournament (Default, 3 Columns) -->
    <div v-else-if="viewMode === 'grouped' && !selectedTournamentId" class="space-y-8">
      <div
        v-for="group in groupedCertificates"
        :key="group.id"
        class="bg-white/80 rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5"
      >
        <!-- Tournament Section Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div class="flex items-center gap-3 min-w-0">
            <div class="size-10 rounded-xl bg-navy text-white flex items-center justify-center shrink-0 shadow-xs border border-primary/20">
              <Icon icon="ph:trophy-bold" class="text-lg text-primary" />
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 bg-primary/10 text-primary-dark font-black text-[10px] tracking-wider rounded-md">
                  {{ t('archer_certificates.tournament_badge') }}
                </span>
                <span class="text-xs text-slate-400 font-bold">
                  {{ group.certificates.length }} {{ t('archer_certificates.cert_count_suffix') }}
                </span>
              </div>
              <h3 class="text-base sm:text-lg font-black text-navy truncate mt-0.5">
                {{ group.name }}
              </h3>
            </div>
          </div>

          <NuxtLink
            v-if="group.slug"
            :to="`/tournaments/${group.slug}`"
            target="_blank"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-navy bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            <span>{{ t('archer_certificates.view_tournament_page') }}</span>
            <Icon icon="ph:arrow-square-out-bold" class="text-xs" />
          </NuxtLink>
        </div>

        <!-- Certificate Cards Grid: 3 Columns -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="cert in group.certificates"
            :key="cert.id || cert.uuid || cert.certificate_no"
            class="group/card bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <!-- Card Header & Content -->
            <div class="p-4 sm:p-5 space-y-3">
              <!-- Top Info Header -->
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0 flex-1 space-y-0.5">
                  <div class="flex items-center gap-1.5">
                    <span class="text-[10px] sm:text-xs font-black text-slate-400 font-mono tracking-wider truncate">
                      {{ cert.certificate_no || 'CERT-OFFICIAL' }}
                    </span>
                    <button
                      v-if="cert.certificate_no"
                      type="button"
                      @click="copyCertNo(cert.certificate_no)"
                      class="text-slate-400 hover:text-navy transition-colors cursor-pointer p-0.5 shrink-0"
                      :title="copiedCertNo === cert.certificate_no ? t('archer_certificates.cert_no_copied') : t('archer_certificates.copy_cert_no')"
                    >
                      <Icon
                        :icon="copiedCertNo === cert.certificate_no ? 'ph:check-bold' : 'ph:copy-bold'"
                        :class="copiedCertNo === cert.certificate_no ? 'text-emerald-600' : 'text-slate-400'"
                        class="text-xs"
                      />
                    </button>
                  </div>
                  <h4 class="text-sm font-black text-navy truncate leading-tight">
                    {{ cert.category_name || t('archer_certificates.default_category') }}
                  </h4>
                </div>

                <span class="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-lg shrink-0 flex items-center gap-1">
                  <Icon icon="ph:seal-check-fill" class="text-xs text-emerald-600" />
                  <span>{{ t('archer_certificates.status_official') }}</span>
                </span>
              </div>

              <!-- Document Preview Thumbnail Area (Aspect fit for 3 cols) -->
              <div
                v-if="cert.pdf_url"
                @click="openPreview(cert)"
                class="group/preview relative w-full h-36 sm:h-40 rounded-xl overflow-hidden bg-slate-950 border border-slate-200/80 cursor-pointer shadow-2xs flex items-center justify-center"
              >
                <!-- PDF Preview Iframe -->
                <iframe
                  v-if="isPdf(cert.pdf_url)"
                  :src="`${getImageUrl(cert.pdf_url)}#toolbar=0&navpanes=0&scrollbar=0`"
                  class="w-full h-full pointer-events-none scale-100 bg-white opacity-90 group-hover/preview:opacity-100 transition-opacity"
                  title="Certificate Document Preview"
                />

                <!-- Image Preview Fallback -->
                <img
                  v-else
                  :src="getImageUrl(cert.pdf_url)"
                  :alt="cert.event_name || 'Certificate'"
                  class="w-full h-full object-contain object-center group-hover/preview:scale-105 transition-transform duration-300"
                />

                <!-- Sleek Hover Overlay -->
                <div class="absolute inset-0 bg-navy/60 backdrop-blur-[2px] opacity-0 group-hover/preview:opacity-100 transition-all flex flex-col items-center justify-center text-white gap-1.5">
                  <div class="size-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shadow-lg text-white group-hover/preview:scale-110 transition-transform">
                    <Icon icon="ph:magnifying-glass-plus-bold" class="text-base" />
                  </div>
                  <span class="text-[10px] font-black tracking-wide">{{ t('archer_certificates.click_to_preview') }}</span>
                </div>
              </div>

              <!-- Fallback when no PDF URL yet -->
              <div v-else class="w-full h-32 rounded-xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center gap-1.5 text-slate-400">
                <Icon icon="ph:file-dashed-bold" class="text-2xl" />
                <span class="text-xs font-medium italic">{{ t('archer_certificates.processing_pdf') }}</span>
              </div>
            </div>

            <!-- Card Footer Toolbar -->
            <div class="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs flex-wrap gap-2">
              <div class="text-slate-500 font-medium flex items-center gap-1.5 text-[11px]">
                <Icon icon="ph:calendar-blank-bold" class="text-slate-400" />
                <span>{{ t('archer_certificates.issued_at') }}: <strong class="text-navy font-bold">{{ formatDate(cert.issue_date || cert.created_at) }}</strong></span>
              </div>

              <div class="flex items-center gap-1.5">
                <!-- Modal Preview Button -->
                <button
                  v-if="cert.pdf_url"
                  type="button"
                  @click="openPreview(cert)"
                  class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 hover:text-navy font-bold text-xs rounded-xl border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                  :title="t('archer_certificates.view_btn')"
                >
                  <Icon icon="ph:eye-bold" class="text-xs text-slate-500" />
                  <span>{{ t('archer_certificates.view_btn') }}</span>
                </button>

                <!-- Download Button -->
                <a
                  v-if="cert.pdf_url"
                  :href="getImageUrl(cert.pdf_url)"
                  download
                  target="_blank"
                  class="inline-flex items-center gap-1 px-3 py-1.5 bg-navy hover:bg-navy-light text-white font-bold text-xs rounded-xl transition-colors shadow-2xs cursor-pointer"
                  :title="t('archer_certificates.download_pdf')"
                >
                  <Icon icon="ph:download-simple-bold" class="text-primary text-xs" />
                  <span>{{ t('archer_certificates.download_pdf') }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW MODE 2: Flat Grid View (or when single tournament is filtered, 3 Columns) -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="cert in filteredCertificates"
        :key="cert.id || cert.uuid || cert.certificate_no"
        class="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-300 overflow-hidden flex flex-col justify-between"
      >
        <!-- Card Header & Content -->
        <div class="p-4 sm:p-5 space-y-3">
          <!-- Top Info Header -->
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0 flex-1 space-y-0.5">
              <div class="flex items-center gap-1.5">
                <span class="text-[10px] sm:text-xs font-black text-slate-400 tracking-wider font-mono truncate">
                  {{ cert.certificate_no || 'CERT-OFFICIAL' }}
                </span>
                <button
                  v-if="cert.certificate_no"
                  type="button"
                  @click="copyCertNo(cert.certificate_no)"
                  class="text-slate-400 hover:text-navy transition-colors cursor-pointer p-0.5 shrink-0"
                  :title="copiedCertNo === cert.certificate_no ? t('archer_certificates.cert_no_copied') : t('archer_certificates.copy_cert_no')"
                >
                  <Icon
                    :icon="copiedCertNo === cert.certificate_no ? 'ph:check-bold' : 'ph:copy-bold'"
                    :class="copiedCertNo === cert.certificate_no ? 'text-emerald-600' : 'text-slate-400'"
                    class="text-xs"
                  />
                </button>
              </div>
              <h3 class="text-sm font-black text-navy truncate leading-tight" :title="cert.event_name">
                {{ cert.event_name }}
              </h3>
              <div class="text-[11px] text-slate-500 font-medium truncate">
                {{ cert.category_name || t('archer_certificates.default_category') }}
              </div>
            </div>

            <span class="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-lg shrink-0 flex items-center gap-1">
              <Icon icon="ph:seal-check-fill" class="text-xs text-emerald-600" />
              <span>{{ t('archer_certificates.status_official') }}</span>
            </span>
          </div>

          <!-- Document Preview Area (3 cols responsive height) -->
          <div
            v-if="cert.pdf_url"
            @click="openPreview(cert)"
            class="group/preview relative w-full h-36 sm:h-40 rounded-xl overflow-hidden bg-slate-950 border border-slate-200/80 cursor-pointer shadow-2xs flex items-center justify-center"
          >
            <!-- PDF Preview -->
            <iframe
              v-if="isPdf(cert.pdf_url)"
              :src="`${getImageUrl(cert.pdf_url)}#toolbar=0&navpanes=0&scrollbar=0`"
              class="w-full h-full pointer-events-none scale-100 bg-white opacity-90 group-hover/preview:opacity-100 transition-opacity"
              title="Certificate Document Preview"
            />

            <!-- Image Preview -->
            <img
              v-else
              :src="getImageUrl(cert.pdf_url)"
              :alt="cert.event_name || 'Certificate'"
              class="w-full h-full object-contain object-center group-hover/preview:scale-105 transition-transform duration-300"
            />

            <!-- Hover Overlay -->
            <div class="absolute inset-0 bg-navy/60 backdrop-blur-[2px] opacity-0 group-hover/preview:opacity-100 transition-all flex flex-col items-center justify-center text-white gap-1.5">
              <div class="size-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shadow-lg text-white group-hover/preview:scale-110 transition-transform">
                <Icon icon="ph:magnifying-glass-plus-bold" class="text-base" />
              </div>
              <span class="text-[10px] font-black tracking-wide">{{ t('archer_certificates.click_to_preview') }}</span>
            </div>
          </div>

          <!-- Fallback when processing -->
          <div v-else class="w-full h-32 rounded-xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center gap-1.5 text-slate-400">
            <Icon icon="ph:file-dashed-bold" class="text-2xl" />
            <span class="text-xs font-medium italic">{{ t('archer_certificates.processing_pdf') }}</span>
          </div>
        </div>

        <!-- Card Footer Toolbar -->
        <div class="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs flex-wrap gap-2">
          <div class="text-slate-500 font-medium flex items-center gap-1.5 text-[11px]">
            <Icon icon="ph:calendar-blank-bold" class="text-slate-400" />
            <span>{{ t('archer_certificates.issued_at') }}: <strong class="text-navy font-bold">{{ formatDate(cert.issue_date || cert.created_at) }}</strong></span>
          </div>

          <div class="flex items-center gap-1.5">
            <!-- Modal Preview Button -->
            <button
              v-if="cert.pdf_url"
              type="button"
              @click="openPreview(cert)"
              class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 hover:text-navy font-bold text-xs rounded-xl border border-slate-200 transition-colors shadow-2xs cursor-pointer"
              :title="t('archer_certificates.view_btn')"
            >
              <Icon icon="ph:eye-bold" class="text-xs text-slate-500" />
              <span>{{ t('archer_certificates.view_btn') }}</span>
            </button>

            <!-- Download Button -->
            <a
              v-if="cert.pdf_url"
              :href="getImageUrl(cert.pdf_url)"
              download
              target="_blank"
              class="inline-flex items-center gap-1 px-3 py-1.5 bg-navy hover:bg-navy-light text-white font-bold text-xs rounded-xl transition-colors shadow-2xs cursor-pointer"
              :title="t('archer_certificates.download_pdf')"
            >
              <Icon icon="ph:download-simple-bold" class="text-primary text-xs" />
              <span>{{ t('archer_certificates.download_pdf') }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Fullscreen Certificate Preview Lightbox Modal -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showPreviewModal && activePreviewUrl"
        class="fixed inset-0 bg-navy/70 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6"
        @click.self="showPreviewModal = false"
      >
        <div class="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
          <!-- Modal Top Header -->
          <div class="bg-navy px-6 py-4 shrink-0 flex items-center justify-between text-white border-b border-primary/20">
            <div class="flex items-center gap-3 min-w-0">
              <div class="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 border border-white/20">
                <Icon icon="ph:certificate-bold" class="text-xl text-primary" />
              </div>
              <div class="min-w-0">
                <h3 class="font-black text-sm sm:text-base text-white leading-tight truncate">{{ previewModalTitle }}</h3>
                <div class="text-[11px] text-slate-300 font-medium">{{ previewModalSubtitle || t('archer_certificates.preview_modal_subtitle') }}</div>
              </div>
            </div>

            <button
              @click="showPreviewModal = false"
              class="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0 ml-3"
            >
              <Icon icon="ph:x-bold" class="text-base" />
            </button>
          </div>

          <!-- Document Body Viewer -->
          <div class="flex-grow bg-slate-900 p-2 sm:p-4 min-h-[450px] sm:min-h-[550px] flex items-center justify-center overflow-hidden">
            <iframe
              v-if="isPdf(activePreviewUrl)"
              :src="activePreviewUrl"
              class="w-full h-full min-h-[450px] sm:min-h-[550px] rounded-2xl bg-white shadow-md border border-slate-700"
              title="Certificate Document Viewer"
            />
            <img
              v-else
              :src="activePreviewUrl"
              :alt="previewModalTitle"
              class="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-md border border-slate-700"
            />
          </div>

          <!-- Modal Action Footer -->
          <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <div class="text-xs text-slate-500 font-mono font-bold truncate">
              {{ selectedCert?.certificate_no ? `No: ${selectedCert.certificate_no}` : '' }}
            </div>

            <div class="flex items-center gap-2.5">
              <a
                :href="activePreviewUrl"
                target="_blank"
                download
                class="px-5 py-2 bg-primary text-navy font-black text-xs rounded-xl shadow-xs hover:bg-primary-hover transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Icon icon="ph:download-simple-bold" />
                <span>{{ t('archer_certificates.download_pdf') }}</span>
              </a>
              <button
                @click="showPreviewModal = false"
                class="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {{ t('common.close') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDashboardI18n } from '~/composables/useDashboardI18n'
import { useApi } from '~/composables/useApi'
import { getImageUrl } from '~/composables/useImageHelper'
import StatCard from '~/components/common/StatCard.vue'

const { t, locale } = useDashboardI18n()
const route = useRoute()
const router = useRouter()

definePageMeta({
  layout: 'dashboard'
})

useHead({ 
  title: computed(() => (t('archer_certificates.seo_title')) + ' - Archeris Dashboard')
})

const { get } = useApi()

// State
const selectedTournamentId = ref(route.query.event_id || route.query.event_slug || '')
const searchQuery = ref('')
const viewMode = ref('grouped') // 'grouped' | 'grid'
const copiedCertNo = ref('')

// Preview Modal State
const showPreviewModal = ref(false)
const activePreviewUrl = ref('')
const previewModalTitle = ref('')
const previewModalSubtitle = ref('')
const selectedCert = ref(null)

const isPdf = (url) => {
  if (!url) return false
  const clean = url.split('?')[0].toLowerCase()
  return clean.endsWith('.pdf') || clean.includes('/pdf') || clean.includes('format=pdf') || clean.includes('.pdf')
}

const openPreview = (cert) => {
  if (!cert || !cert.pdf_url) return
  selectedCert.value = cert
  activePreviewUrl.value = getImageUrl(cert.pdf_url)
  previewModalTitle.value = cert.event_name || 'Sertifikat'
  previewModalSubtitle.value = `${cert.category_name || 'Kategori Umum'} • ${cert.certificate_no || 'Resmi'}`
  showPreviewModal.value = true
}

const copyCertNo = (no) => {
  if (!no) return
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(no)
  }
  copiedCertNo.value = no
  setTimeout(() => {
    if (copiedCertNo.value === no) {
      copiedCertNo.value = ''
    }
  }, 2000)
}

const { data: certificates, pending } = await useAsyncData('archer-certificates', async () => {
  try {
    const res = await get('/archers/my/certificates')
    return res?.data || res || []
  } catch (err) {
    console.error('Failed to fetch certificates:', err)
    return []
  }
})

// Unique Tournaments
const uniqueTournaments = computed(() => {
  const map = new Map()
  if (!certificates.value || !Array.isArray(certificates.value)) return []
  
  certificates.value.forEach(cert => {
    const id = cert.event_id || cert.event_slug || cert.event_name || 'other'
    if (!map.has(id)) {
      map.set(id, {
        id,
        slug: cert.event_slug || cert.event_id,
        name: cert.event_name || 'Turnamen',
        count: 0,
        latestDate: cert.issue_date || cert.created_at
      })
    }
    const t = map.get(id)
    t.count++
  })

  return Array.from(map.values())
})

const selectedTournament = computed(() => {
  if (!selectedTournamentId.value) return null
  return uniqueTournaments.value.find(t => (
    String(t.id) === String(selectedTournamentId.value) ||
    String(t.slug) === String(selectedTournamentId.value) ||
    String(t.name) === String(selectedTournamentId.value)
  )) || null
})

const selectTournament = (id) => {
  selectedTournamentId.value = id || ''
  if (id) {
    router.replace({ query: { ...route.query, event_id: id } })
  } else {
    const query = { ...route.query }
    delete query.event_id
    delete query.event_slug
    router.replace({ query })
  }
}

// Stats Helpers
const latestCertificateDate = computed(() => {
  if (!certificates.value || certificates.value.length === 0) return '-'
  const sorted = [...certificates.value].sort((a, b) => {
    const dateA = new Date(a.issue_date || a.created_at || 0).getTime()
    const dateB = new Date(b.issue_date || b.created_at || 0).getTime()
    return dateB - dateA
  })
  return formatDate(sorted[0]?.issue_date || sorted[0]?.created_at)
})

const latestCertificateEventName = computed(() => {
  if (!certificates.value || certificates.value.length === 0) return ''
  const sorted = [...certificates.value].sort((a, b) => {
    const dateA = new Date(a.issue_date || a.created_at || 0).getTime()
    const dateB = new Date(b.issue_date || b.created_at || 0).getTime()
    return dateB - dateA
  })
  return sorted[0]?.event_name || ''
})

// Filtered Certificates
const filteredCertificates = computed(() => {
  if (!certificates.value || !Array.isArray(certificates.value)) return []
  let list = certificates.value

  // Filter by tournament
  if (selectedTournamentId.value) {
    list = list.filter(cert => {
      const id = cert.event_id || cert.event_slug || cert.event_name
      return String(id) === String(selectedTournamentId.value) ||
             String(cert.event_slug) === String(selectedTournamentId.value) ||
             String(cert.event_id) === String(selectedTournamentId.value)
    })
  }

  // Filter by search query
  if (searchQuery.value?.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(cert => {
      return (cert.event_name && cert.event_name.toLowerCase().includes(q)) ||
             (cert.category_name && cert.category_name.toLowerCase().includes(q)) ||
             (cert.certificate_no && cert.certificate_no.toLowerCase().includes(q))
    })
  }

  return list
})

// Grouped Certificates (by tournament)
const groupedCertificates = computed(() => {
  const groups = []
  const map = new Map()

  filteredCertificates.value.forEach(cert => {
    const key = cert.event_id || cert.event_slug || cert.event_name || 'other'
    if (!map.has(key)) {
      const groupObj = {
        id: key,
        slug: cert.event_slug || cert.event_id,
        name: cert.event_name || 'Turnamen',
        certificates: []
      }
      map.set(key, groupObj)
      groups.push(groupObj)
    }
    map.get(key).certificates.push(cert)
  })

  return groups
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const loc = locale?.value === 'en' ? 'en-US' : 'id-ID'
    return new Date(dateStr).toLocaleDateString(loc, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}

watch(() => route.query.event_id, (newVal) => {
  if (newVal !== selectedTournamentId.value) {
    selectedTournamentId.value = newVal || ''
  }
})
</script>

<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Enhanced Header -->
    <div
      class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-20"
        style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px);">
      </div>

      <!-- Decorative Background Elements -->
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

      <!-- Header Content -->
      <div class="relative p-5 sm:p-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center sm:items-start gap-4 flex-1">
            <!-- Icon Badge -->
            <div
              class="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
              <Icon icon="ph:crosshair" class="text-primary text-xl sm:text-2xl" />
            </div>

            <!-- Title Section -->
            <div class="min-w-0">
              <h1 class="text-xl sm:text-3xl font-black leading-tight tracking-tight mb-1 sm:mb-2 truncate">
                Manajemen Kualifikasi
              </h1>
              <p class="text-slate-300 text-xs sm:text-sm max-w-2xl line-clamp-1 sm:line-clamp-none">
                Kelola penempatan pemanah dan penilaian untuk {{ eventName }}
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <BaseButton variant="primary" icon="ph:plus-bold"
              class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-black uppercase tracking-widest"
              @click="openCreateModal">
              Tambah Sesi
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Sessions List View -->
    <div class="space-y-6">
      <!-- Sessions List (event-level) -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-bold text-navy">Daftar Sesi Kualifikasi</h2>
        </div>

        <div v-if="loadingSessions" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i" class="p-5 rounded-xl border border-gray-100 animate-pulse">
            <div class="flex items-start gap-3">
              <div class="size-12 bg-gray-100 rounded-xl"></div>
              <div class="flex-1">
                <div class="h-5 bg-gray-100 rounded mb-2"></div>
                <div class="h-4 bg-gray-50 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="qualificationSessions.length === 0"
          class="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Icon icon="ph:calendar-blank" class="text-4xl text-gray-300 mx-auto mb-3" />
          <p class="text-sm font-bold text-gray-600 mb-1">Belum Ada Sesi Kualifikasi</p>
          <p class="text-xs text-gray-400 mb-4">Buat sesi pertama untuk mulai mengelola kualifikasi</p>
          <button @click="openCreateModal"
            class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-navy rounded-lg font-bold hover:bg-primary/90 transition-colors text-sm">
            <Icon icon="ph:plus" class="text-lg" />
            Buat Sesi Pertama
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="session in qualificationSessions" :key="session.uuid" @click="goToSession(session)"
            class="p-5 bg-gradient-to-br from-white to-gray-50 rounded-3xl border-2 border-gray-100 hover:border-primary hover:shadow-md hover:shadow-primary/10 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden">

            <!-- Action Icons -->
            <div
              class="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button @click.stop="editSession(session)"
                class="size-9 bg-white shadow-md rounded-xl flex items-center justify-center text-gray-400 hover:text-navy hover:scale-110 active:scale-95 transition-all">
                <Icon icon="ph:pencil-simple-bold" class="text-lg" />
              </button>
            </div>

            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-4">
                <div
                  class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors duration-500 shadow-inner">
                  <Icon icon="ph:calendar-check-bold" class="text-3xl text-navy" />
                </div>
                <div>
                  <h3 class="font-black text-navy text-lg leading-tight group-hover:text-primary transition-colors">{{
                    session.name }}</h3>
                  <div class="flex items-center gap-1.5 mt-1">
                    <span
                      class="text-[10px] font-black  tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{{
                        session.session_code }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4 mb-6 flex-1">
              <div class="flex items-center gap-3">
                <div class="size-8 rounded-lg bg-navy/5 flex items-center justify-center text-navy">
                  <Icon icon="ph:calendar-bold" class="text-lg" />
                </div>
                <span class="text-sm font-bold text-gray-600">{{ session.session_date ? formatDate(session.session_date)
                  : 'Belum diset' }}</span>
              </div>

              <div class="flex items-center gap-3">
                <div class="size-8 rounded-lg bg-navy/5 flex items-center justify-center text-navy">
                  <Icon icon="ph:clock-bold" class="text-lg" />
                </div>
                <span v-if="session.start_time || session.end_time" class="text-sm font-bold text-gray-600">
                  {{ formatTime(session.start_time) }} - {{ formatTime(session.end_time) }}
                </span>
                <span v-else class="text-sm font-medium text-gray-400 italic">Waktu belum diset</span>
              </div>

              <div class="grid grid-cols-2 gap-3 pt-2">
                <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                  <Icon icon="ph:arrow-clockwise-bold" class="text-primary text-lg" />
                  <span class="text-xs font-black text-navy">{{ session.total_ends }} Ends</span>
                </div>
                <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                  <Icon icon="ph:crosshair-bold" class="text-primary text-lg" />
                  <span class="text-xs font-black text-navy">{{ session.arrows_per_end }} Panah</span>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="flex items-center gap-2 px-3 py-1.5 bg-navy/5 rounded-xl">
                <Icon icon="ph:users-three-bold" class="text-navy text-base" />
                <span class="text-xs font-bold text-navy">
                  <span class="text-sm">{{ session.participant_count || 0 }}</span> Pemanah
                </span>
              </div>
              <div
                class="flex items-center gap-1 font-black text-[10px]  tracking-widest group-hover:gap-2 transition-all">
                <span>Kelola</span>
                <Icon icon="ph:arrow-right-bold" class="text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-base font-bold text-navy">Hasil Kualifikasi</h2>
        </div>

        <!-- Category Selection -->
        <div v-if="loadingCategories" class="flex gap-4 overflow-hidden pb-2">
          <div v-for="i in 4" :key="i" class="flex-shrink-0 w-72 p-5 rounded-xl border border-gray-100 animate-pulse">
            <div class="flex items-start gap-3">
              <div class="size-12 bg-gray-100 rounded-xl"></div>
              <div class="flex-1">
                <div class="h-5 bg-gray-100 rounded mb-2"></div>
                <div class="h-4 bg-gray-50 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="categories.length === 0"
          class="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Icon icon="ph:folder-notch-open" class="text-4xl text-gray-300 mx-auto mb-3" />
          <p class="text-sm font-bold text-gray-600 mb-1">Belum Ada Kategori</p>
          <p class="text-xs text-gray-400">Kategori akan muncul setelah event dikonfigurasi</p>
        </div>

        <div v-else>
          <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mb-6">
            <button v-for="category in categories" :key="category.id" @click="selectCategory(category.id)" :class="[
              'flex-shrink-0 w-72 p-5 rounded-xl border-2 transition-all text-left group hover:shadow-md relative',
              selectedCategory === category.id
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300'
            ]">
              <div class="absolute top-0 left-0 w-1.5 h-full rounded-l-xl transition-colors"
                :class="selectedCategory === category.id ? 'bg-primary' : 'bg-transparent'"></div>
              <div class="flex items-start gap-3 pl-2">
                <div
                  class="size-12 bg-navy rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden p-2 group-hover:bg-primary transition-colors">
                  <img
                    :src="'/' + getCategoryIcon(`${category.division_name} ${category.event_type_name} ${category.gender_division_name}`)"
                    :alt="category.division_name"
                    class="w-full h-full object-contain invert group-hover:invert-0 transition-all" />
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    class="font-bold text-navy group-hover:text-primary transition-colors leading-tight mb-1.5 line-clamp-2">
                    {{ getCategoryName(category) }}</p>
                  <div class="flex items-center gap-2 text-xs text-gray-500">
                    <Icon icon="ph:users-three" class="text-base" />
                    <span class="font-semibold">{{ category.participant_count || 0 }} pemanah</span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          <!-- Results Table -->
          <div v-if="loadingReport" class="bg-gray-50 rounded-xl p-12 text-center">
            <div class="animate-spin inline-block">
              <Icon icon="ph:circle-notch" class="text-4xl text-primary" />
            </div>
            <p class="text-gray-500 mt-4">Memuat laporan...</p>
          </div>

          <div v-else-if="selectedCategory && reportEntries.length > 0"
            class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50/50 border-b border-gray-100">
                  <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400  tracking-widest w-24">
                    Posisi</th>
                  <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 tracking-widest min-w-[350px]">
                    Nama Pemanah</th>
                  <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 tracking-widest min-w-[400px]">
                    Skor Per Rambahan</th>
                  <th class="px-6 py-4 text-right text-[10px] font-black text-gray-400  tracking-widest w-32">
                    Total Score</th>
                  <th class="px-6 py-4 text-right text-[10px] font-black text-gray-400  tracking-widest w-32">
                    Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(archer, index) in paginatedEntries" :key="archer.rowKey"
                  class="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex items-center justify-center size-8 rounded-lg bg-navy text-white font-bold text-sm">{{
                        (currentPage - 1) * pageSize + index + 1 }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <img :src="useImageOrDefault(archer.avatar_url, archer.archer_name)"
                        class="size-9 rounded-lg object-cover border border-gray-100" />
                      <div>
                        <p class="text-[11px] sm:text-base font-bold text-navy leading-tight">{{ archer.archer_name }}
                        </p>
                        <div class="flex items-center gap-2 mt-1">
                          <p class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{{ archer.club_name
                            ||
                            'Independen' }}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div v-if="archer.processedSessions?.length > 0" class="flex flex-col gap-3">
                      <div v-for="session in archer.processedSessions" :key="session.session_code"
                        class="flex items-center gap-3">
                        <!-- Session Label -->
                        <div class="w-6 shrink-0">
                          <span
                            class="text-[9px] px-1.5 py-0.5 rounded-md bg-navy text-white font-black uppercase tracking-widest whitespace-nowrap">
                            S{{ session.sessionNumber }}
                          </span>
                        </div>

                        <!-- End Scores Chips -->
                        <div class="flex items-center gap-2">
                          <div v-for="(s, sIdx) in session.displayScores" :key="sIdx"
                            class="flex flex-col items-center bg-gray-50 border border-gray-100 rounded-lg overflow-hidden shadow-sm group/score hover:border-primary/50 transition-all">
                            <div class="bg-navy/5 px-2 py-0.5 w-full text-center border-b border-gray-100">
                              <span class="text-[8px] font-black text-gray-400 uppercase tracking-tighter">E{{ sIdx + 1
                              }}</span>
                            </div>
                            <div class="px-3 py-1 min-w-[45px] flex items-center justify-center">
                              <span
                                class="text-[12px] font-black text-navy group-hover/score:text-primary transition-colors">{{
                                  s }}</span>
                            </div>
                          </div>

                          <!-- More Ends Chip -->
                          <div v-if="session.remainingEnds > 0"
                            class="p-2 bg-gray-50 text-gray-400 my-auto rounded-lg flex items-center justify-center border border-gray-100 self-end shadow-inner">
                            <span class="text-[10px] font-black tracking-widest">+{{ session.remainingEnds }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else
                      class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100 max-w-[150px]">
                      <span class="text-[11px] text-gray-400 font-black italic uppercase tracking-widest">Kosong</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <p class="text-xl font-black text-navy">{{ archer.total_score || 0 }}</p>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <NuxtLink
                      :to="`/dashboard/events/${eventId}/result-user?participant_uuid=${archer.participant_uuid}`"
                      class="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-primary/10 text-navy text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary transition-all">
                      <Icon icon="ph:eye-bold" class="text-sm" />
                      Detail
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Pagination Controls -->
            <div v-if="totalPages > 1"
              class="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
              <p class="text-xs text-gray-400 font-bold">
                Menampilkan <span class="text-navy">{{ (currentPage - 1) * pageSize + 1 }}</span> -
                <span class="text-navy">{{ Math.min(currentPage * pageSize, reportEntries.length) }}</span> dari
                <span class="text-navy">{{ reportEntries.length }}</span> pemanah
              </p>
              <div class="flex items-center gap-2">
                <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
                  class="size-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all shadow-sm bg-white">
                  <Icon icon="ph:caret-left-bold" />
                </button>

                <div class="flex items-center gap-1">
                  <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="[
                    'size-8 rounded-lg text-xs font-black transition-all',
                    currentPage === page
                      ? 'bg-primary text-navy shadow-md shadow-primary/20'
                      : 'bg-white border border-gray-200 text-gray-400 hover:border-primary hover:text-primary'
                  ]">
                    {{ page }}
                  </button>
                </div>

                <button @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="size-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all shadow-sm bg-white">
                  <Icon icon="ph:caret-right-bold" />
                </button>
              </div>
            </div>
          </div>

          <div v-else-if="selectedCategory"
            class="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <Icon icon="ph:users-three" class="text-5xl text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500">Tidak ada pemanah di kategori ini</p>
          </div>

          <div v-else class="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <Icon icon="ph:selection" class="text-5xl text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500">Pilih kategori untuk melihat hasil kualifikasi</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Session Modal Dialog -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="showSessionDialog"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showSessionDialog = false">
        <div class="bg-white rounded-3xl shadow-md max-w-lg w-full overflow-hidden border border-white/20">
          <!-- Modal Header -->
          <div class="bg-navy p-6 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-md shadow-primary/20">
                <Icon icon="ph:calendar-plus-bold" class="text-2xl text-navy" />
              </div>
              <div>
                <h3 class="text-xl font-black text-white leading-tight">{{ modalTitle }}</h3>
                <p class="text-gray-400 text-xs mt-0.5">Konfigurasi jadwal dan aturan penilaian</p>
              </div>
            </div>
            <button @click="showSessionDialog = false"
              class="size-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all group">
              <Icon icon="ph:x-bold" class="text-xl group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-8 space-y-6">
            <div class="space-y-4">
              <div>
                <label class="block text-[10px] font-black text-gray-400  tracking-widest mb-2 px-1">Judul
                  Sesi</label>
                <div class="relative group">
                  <Icon icon="ph:text-t-bold"
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input v-model="newSessionName" type="text" placeholder="Contoh: Kualifikasi Gelombang 1"
                    class="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-navy font-bold placeholder:font-normal placeholder:text-gray-300" />
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400  tracking-widest mb-2 px-1">Tanggal
                  Sesi</label>
                <div class="relative group">
                  <Icon icon="ph:calendar-bold"
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input v-model="newSessionDate" type="date"
                    class="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-navy font-bold" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-black text-gray-400  tracking-widest mb-2 px-1">Jam
                    Mulai</label>
                  <div class="relative group">
                    <Icon icon="ph:clock-bold"
                      class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input v-model="newSessionStart" type="time"
                      class="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-navy font-bold" />
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-black text-gray-400  tracking-widest mb-2 px-1">Jam
                    Selesai</label>
                  <div class="relative group">
                    <Icon icon="ph:clock-afternoon-bold"
                      class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input v-model="newSessionEnd" type="time"
                      class="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-navy font-bold" />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 pt-2">
                <div
                  class="p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-gray-100 transition-all">
                  <label class="block text-[10px] font-black text-gray-400  tracking-widest mb-3 text-center">Jumlah
                    End</label>
                  <div class="flex items-center justify-between gap-3">
                    <button @click="newSessionEnds = Math.max(1, newSessionEnds - 1)"
                      class="size-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center text-navy hover:text-primary transition-colors">
                      <Icon icon="ph:minus-bold" />
                    </button>
                    <span class="text-xl font-black text-navy">{{ newSessionEnds }}</span>
                    <button @click="newSessionEnds++"
                      class="size-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center text-navy hover:text-primary transition-colors">
                      <Icon icon="ph:plus-bold" />
                    </button>
                  </div>
                </div>
                <div
                  class="p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-gray-100 transition-all">
                  <label class="block text-[10px] font-black text-gray-400  tracking-widest mb-3 text-center">Panah
                    per End</label>
                  <div class="flex items-center justify-between gap-3">
                    <button @click="newSessionArrows = Math.max(1, newSessionArrows - 1)"
                      class="size-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center text-navy hover:text-primary transition-colors">
                      <Icon icon="ph:minus-bold" />
                    </button>
                    <span class="text-xl font-black text-navy">{{ newSessionArrows }}</span>
                    <button @click="newSessionArrows = Math.min(12, newSessionArrows + 1)"
                      class="size-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center text-navy hover:text-primary transition-colors">
                      <Icon icon="ph:plus-bold" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-8 bg-gray-50 flex gap-4">
            <button @click="showSessionDialog = false"
              class="flex-1 px-6 py-4 bg-white border-2 border-gray-200 text-gray-500 rounded-2xl font-black hover:bg-gray-100 hover:border-gray-300 transition-all  tracking-widest text-xs">
              Batal
            </button>
            <button @click="saveSession" :disabled="creatingSession || !newSessionName"
              class="flex-[2] px-6 py-4 bg-primary text-navy rounded-2xl font-black hover:shadow-md hover:shadow-primary/20 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3  tracking-widest text-xs">
              <Icon v-if="creatingSession" icon="ph:circle-notch" class="text-lg animate-spin" />
              {{ submitButtonLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const { get, post, patch, delete: del } = useApi()
const toast = useToast()
import { getCategoryIcon } from '~/utils/logoArcheryCategory'
const eventId = route.params.id

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Manajemen Kualifikasi - ArcheryHub Dashboard'
})

// State Management
const eventName = ref('Loading...')
const qualificationSessions = ref([])
const categories = ref([])
const selectedCategory = ref(null)
const reportEntries = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

// Loading States
const loadingSessions = ref(false)
const loadingCategories = ref(false)
const loadingReport = ref(false)
const creatingSession = ref(false)
const showSessionDialog = ref(false)
const editingSessionId = ref(null)

// New/Edit Session Form
const newSessionName = ref('')
const newSessionDate = ref(new Date().toISOString().split('T')[0])
const newSessionStart = ref('08:00')
const newSessionEnd = ref('12:00')
const newSessionEnds = ref(12)
const newSessionArrows = ref(6)

// Pagination Computed
const totalPages = computed(() => Math.ceil(reportEntries.value.length / pageSize.value))
const paginatedEntries = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value

  // Sort sessions by created_at to determine session number
  const sortedSessions = [...qualificationSessions.value].sort((a, b) =>
    new Date(a.created_at) - new Date(b.created_at)
  )

  return reportEntries.value.slice(start, end).map(entry => {
    const sessions = (entry.sessions || []).map(s => {
      const allScores = s.end_scores ? s.end_scores.split(', ') : []
      const sessionIdx = sortedSessions.findIndex(session => session.session_code === s.session_code)
      return {
        ...s,
        sessionNumber: sessionIdx !== -1 ? sessionIdx + 1 : null,
        displayScores: allScores.slice(0, 6),
        remainingEnds: Math.max(0, allScores.length - 6)
      }
    })

    return {
      ...entry,
      rowKey: entry.participant_uuid,
      processedSessions: sessions
    }
  })
})

watch(reportEntries, () => {
  currentPage.value = 1
})

// Computed Properties
const modalTitle = computed(() => editingSessionId.value ? 'Edit Sesi Kualifikasi' : 'Sesi Kualifikasi Baru')
const submitButtonLabel = computed(() => editingSessionId.value ? (creatingSession.value ? 'Menyimpan...' : 'Simpan Perubahan') : (creatingSession.value ? 'Memproses...' : 'Simpan Sesi'))

const breadcrumbItems = computed(() => [
  { label: 'Events', to: '/dashboard/events' },
  { label: eventName.value, to: `/dashboard/events/${eventId}` }
])

useHead({
  title: `Qualification Sessions - ${eventName.value}`
})

// Methods
const openCreateModal = () => {
  editingSessionId.value = null
  newSessionName.value = ''
  newSessionDate.value = new Date().toISOString().split('T')[0]
  newSessionStart.value = '08:00'
  newSessionEnd.value = '12:00'
  newSessionEnds.value = 12
  newSessionArrows.value = 6
  showSessionDialog.value = true
}

const editSession = (session) => {
  editingSessionId.value = session.uuid
  newSessionName.value = session.name
  newSessionDate.value = session.session_date ? session.session_date.split('T')[0] : new Date().toISOString().split('T')[0]

  // Extract time parts
  if (session.start_time) {
    const time = session.start_time.includes('T') ? session.start_time.split('T')[1] : (session.start_time.includes(' ') ? session.start_time.split(' ')[1] : session.start_time)
    newSessionStart.value = time.substring(0, 5)
  }
  if (session.end_time) {
    const time = session.end_time.includes('T') ? session.end_time.split('T')[1] : (session.end_time.includes(' ') ? session.end_time.split(' ')[1] : session.end_time)
    newSessionEnd.value = time.substring(0, 5)
  }

  newSessionEnds.value = session.total_ends
  newSessionArrows.value = session.arrows_per_end
  showSessionDialog.value = true
}

const goToSession = (session) => {
  // Use session_code as slug directly since it's already unique
  router.push(`/dashboard/events/${eventId}/qualification/${session.session_code}`)
}

const fetchQualificationSessions = async () => {
  loadingSessions.value = true
  try {
    const response = await get(`/events/${eventId}/qualification/sessions`)
    const sessions = response?.sessions || []
    qualificationSessions.value = sessions
  } catch (error) {
    console.error('Failed to fetch qualification sessions:', error)
    qualificationSessions.value = []
  } finally {
    loadingSessions.value = false
  }
}

const saveSession = async () => {
  if (!newSessionName.value) {
    toast.warning('Nama sesi harus diisi')
    return
  }

  try {
    creatingSession.value = true
    const payload = {
      name: newSessionName.value,
      session_date: newSessionDate.value,
      start_time: newSessionStart.value,
      end_time: newSessionEnd.value,
      total_ends: newSessionEnds.value || 12,
      arrows_per_end: newSessionArrows.value || 6
    }

    if (editingSessionId.value) {
      await patch(`/events/${eventId}/qualification/sessions/${editingSessionId.value}`, payload)
      toast.success('Sesi kualifikasi berhasil diperbarui')
    } else {
      await post(`/events/${eventId}/qualification/sessions`, payload)
      toast.success('Sesi kualifikasi berhasil dibuat')
    }

    showSessionDialog.value = false
    await fetchQualificationSessions()
  } catch (error) {
    console.error('Failed to save session:', error)
    toast.error('Gagal menyimpan sesi kualifikasi')
  } finally {
    creatingSession.value = false
  }
}

const confirmDeleteSession = async (session) => {
  const confirmed = confirm(`Apakah Anda yakin ingin menghapus sesi "${session.name}"? Ini akan menghapus semua tugas target dan skor terkait!`)
  if (!confirmed) return

  try {
    await del(`/events/${eventId}/qualification/sessions/${session.uuid}`)
    toast.success('Sesi berhasil dihapus')
    await fetchQualificationSessions()
  } catch (error) {
    console.error('Failed to delete session:', error)
    toast.error('Gagal menghapus sesi')
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const formatTime = (timeStr) => {
  if (!timeStr) return ''
  // If it's a full ISO/SQL datetime string, extract HH:mm
  if (timeStr.includes('T') || timeStr.includes('-')) {
    const date = new Date(timeStr)
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }
  return timeStr.substring(0, 5) // Handle HH:mm:ss if it's already just time
}

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
    // Fetch all categories (increased limit from default 10)
    const response = await get(`/events/${eventId}/categories`, { params: { limit: 1000 } })
    const fetchedCategories = response?.events || response.data?.events || response?.categories || response.data?.categories || []
    // Filter only individual categories for qualification leaderboard
    const individualCategories = fetchedCategories.filter(cat =>
      cat.event_type_name?.toLowerCase() === 'individual' ||
      !cat.event_type_name
    )
    // Sort categories by participant count (descending)
    const sortedCategories = individualCategories.sort((a, b) => (b.participant_count || 0) - (a.participant_count || 0))
    categories.value = sortedCategories

    // Auto-select first category if available
    if (categories.value.length > 0) {
      await selectCategory(categories.value[0].id)
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    categories.value = []
  } finally {
    loadingCategories.value = false
  }
}

const getCategoryName = (category) => {
  if (!category) return ''
  const parts = [
    category.division_name,
    category.category_name,
    category.event_type_name,
    category.gender_division_name
  ].filter(Boolean)
  return parts.join(' ')
}

const selectCategory = async (categoryId) => {
  selectedCategory.value = categoryId
  await fetchQualificationReport(categoryId)
}

const fetchQualificationReport = async (categoryId) => {
  if (!categoryId) return

  loadingReport.value = true
  try {
    const response = await get(`/events/${eventId}/qualification/leaderboard`, {
      params: { category_id: categoryId }
    })

    // Try multiple response structures
    const data = response?.report
      || response?.data?.report
      || response?.data
      || response?.leaderboard
      || response?.archers
      || response

    reportEntries.value = Array.isArray(data) ? data : []

    if (reportEntries.value.length === 0) {
      console.warn('No report entries found for category:', categoryId, 'Response:', response)
    }
  } catch (error) {
    console.error('Failed to fetch report:', error, 'Category:', categoryId)
    reportEntries.value = []
  } finally {
    loadingReport.value = false
  }
}

// No local getAvatarUrl helper needed as we use useImageOrDefault from composables

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchEventName(), fetchQualificationSessions(), fetchCategories()])
})
</script>

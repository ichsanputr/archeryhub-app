<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Enhanced Header -->
    <div
      class="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm mb-2">
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
          <div class="flex items-center sm:items-start gap-4 flex-1 min-w-0">
            <button @click="navigateTo(`/dashboard/events/${eventId}/qualification`)"
              class="p-2.5 rounded-xl bg-white/10 text-white hover:bg-primary hover:text-navy transition-all group shrink-0 backdrop-blur-sm border border-white/20">
              <Icon icon="ph:arrow-left-bold" class="text-lg group-hover:-translate-x-1 transition-transform" />
            </button>
            <div class="min-w-0">
              <div v-if="isLoading && !sessionData"
                class="h-8 w-48 sm:h-10 sm:w-64 bg-white/10 rounded-lg animate-pulse mb-2"></div>
              <h1 v-else class="text-xl sm:text-3xl font-black leading-tight tracking-tight mb-1 sm:mb-2 truncate">
                {{ sessionData?.name || 'Sesi Kualifikasi' }}
              </h1>

              <div v-if="isLoading && !sessionData" class="flex gap-4">
                <div class="h-5 w-20 bg-white/5 rounded animate-pulse"></div>
                <div class="h-5 w-24 bg-white/5 rounded animate-pulse"></div>
              </div>
              <div v-else
                class="flex flex-wrap items-center gap-1.5 sm:gap-4 text-[10px] sm:text-xs text-slate-300 font-bold uppercase tracking-widest">
                <span class="px-2 py-0.5 rounded bg-white/10 border border-white/10 font-mono">{{
                  sessionData?.session_code
                }}</span>
                <span class="opacity-20 hidden sm:inline">•</span>
                <div class="flex items-center gap-1.5">
                  <Icon icon="ph:arrow-clockwise-bold" class="text-xs sm:text-sm text-primary" />
                  <span>{{ sessionData?.total_ends || 0 }} Ends</span>
                </div>
                <span class="opacity-20 hidden sm:inline">•</span>
                <div class="flex items-center gap-1.5">
                  <Icon icon="ph:crosshair-bold" class="text-xs sm:text-sm text-primary" />
                  <span>{{ sessionData?.arrows_per_end || 0 }} Arr/End</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs for Session Management -->
    <div
      class="flex items-center gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar bg-white rounded-t-2xl px-2">
      <button v-for="t in tabs" :key="t.id" @click="activeTab = t.id"
        class="px-6 py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap"
        :class="activeTab === t.id ? 'text-navy border-navy bg-gray-50' : 'text-gray-500 border-transparent hover:text-navy hover:bg-gray-50'">
        <Icon :icon="t.icon" class="text-xl" />
        {{ t.label }}
      </button>
    </div>

    <!-- Category Selection (Shared for both tabs) -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 class="text-base font-bold text-navy mb-4">Pilih Kategori Lomba</h2>

      <div v-if="loadingCategories" class="flex gap-4 overflow-x-auto pb-2">
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

      <div v-else-if="categories.length === 0" class="text-center py-8 text-gray-400">
        <Icon icon="ph:folder-notch-open" class="text-4xl mx-auto mb-2" />
        <p>Kategori tidak ditemukan</p>
      </div>

      <div v-else class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
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
    </div>

    <!-- TARGET MODE -->
    <div v-if="activeTab === 'target'" class="space-y-8">

      <!-- Target Assignment Grid -->
      <div v-if="selectedCategory" class="space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-black text-navy leading-tight">Pengaturan Target</h2>
            <p class="text-sm text-gray-500 mt-1">Kelola penempatan pemanah pada target kualifikasi</p>
          </div>
          <div class="flex items-center gap-3">
            <button @click="autoAssignTargets" :disabled="submittingAssignments || unassignedArchersCount === 0"
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-navy hover:bg-primary/90 font-bold text-sm transition-all shadow-md shadow-primary/20 disabled:opacity-50 group">
              <Icon icon="fa7-solid:random" class="text-xl group-hover:rotate-12 transition-transform" />
              Auto-Assign
            </button>
            <button @click="submitAssignments" :disabled="!isAssignmentChanged || submittingAssignments"
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy text-white hover:bg-navy/90 font-bold text-sm transition-all shadow-lg disabled:opacity-50">
              <Icon icon="ph:floppy-disk-bold" class="text-xl" />
              {{ submittingAssignments ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </div>

        <!-- Target Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          <div v-for="target in targetGrid" :key="target.name"
            class="bg-white rounded-2xl shadow-sm border relative border-gray-100 flex flex-col hover:shadow-md transition-all group/card"
            :class="{ 'z-[100]': openDropdown?.targetId === target.name }">
            <!-- Card Header -->
            <div
              class="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center rounded-t-2xl">
              <div class="flex items-center gap-3">
                <div class="bg-navy text-primary font-black text-xs px-2 py-1 rounded-lg shadow-sm">
                  {{ target.name.split(' ').pop() }}
                </div>
              </div>
              <span :class="[
                'text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full',
                target.assignedCount === target.availableLetters.length ? 'bg-green-100 text-green-700' :
                  target.assignedCount === 0 ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-700'
              ]">
                {{ target.assignedCount === target.availableLetters.length ? 'Full' :
                  target.assignedCount === 0 ? 'Empty' : `${target.availableLetters.length - target.assignedCount} Slots
                Open` }}
              </span>
            </div>

            <div class="p-4 space-y-3">
              <div v-for="pos in target.availableLetters" :key="pos" class="group">
                <div v-if="target.slots[pos]"
                  class="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-transparent hover:border-primary/30 transition-all">
                  <span
                    class="flex items-center justify-center size-7 rounded-lg bg-white border border-gray-200 text-xs font-black text-navy shadow-sm shrink-0">
                    {{ pos }}
                  </span>
                  <div class="size-8 rounded-full border border-gray-200 overflow-hidden shrink-0 bg-white">
                    <img :src="useImageOrDefault(target.slots[pos].avatar_url, target.slots[pos].name)"
                      class="w-full h-full object-cover" :alt="target.slots[pos].name" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-navy truncate leading-tight">{{ target.slots[pos].name }}</p>
                    <p class="text-[10px] text-gray-500 truncate font-medium uppercase tracking-tight">{{
                      target.slots[pos].club || 'Independen' }}</p>
                  </div>
                  <button @click="unassignArcherFromTarget(target, pos)"
                    class="size-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center">
                    <Icon icon="ph:x-bold" class="text-sm" />
                  </button>
                </div>

                <!-- Custom Archer Dropdown -->
                <div v-else class="relative archer-dropdown-container">
                  <div @click.stop="toggleDropdown(target.name, pos)"
                    class="flex items-center gap-3 p-2.5 rounded-xl border border-dashed border-gray-200 bg-white hover:bg-gray-50/50 hover:border-primary/50 transition-all cursor-pointer group/slot">
                    <span
                      class="flex items-center justify-center size-7 rounded-lg bg-gray-50 border border-gray-100 text-xs font-bold text-gray-400 shrink-0">
                      {{ pos }}
                    </span>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-400">Pilih Pemanah...</p>
                    </div>
                    <Icon icon="ph:plus-circle-bold"
                      class="text-gray-300 text-xl group-hover/slot:text-primary transition-colors" />
                  </div>

                  <!-- Dropdown Menu -->
                  <div v-if="openDropdown?.targetId === target.name && openDropdown?.pos === pos"
                    class="absolute !z-[10000] mt-1 w-full min-w-[280px] bg-white rounded-xl shadow-2xl border border-gray-100 py-2 left-0 top-full">
                    <div class="px-3 pb-2 border-b border-gray-50">
                      <div class="relative">
                        <Icon icon="ph:magnifying-glass"
                          class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input v-model="filterText" type="text" placeholder="Cari pemanah..."
                          class="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-100 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                          @click.stop />
                      </div>
                    </div>
                    <div class="max-h-60 overflow-y-auto pt-1 no-scrollbar">
                      <div v-if="unassignedArcherListFiltered.length === 0"
                        class="px-4 py-3 text-center text-gray-400 text-xs">
                        Tidak ada pemanah tersedia
                      </div>
                      <button v-for="archer in unassignedArcherListFiltered" :key="archer.uuid"
                        @click="assignArcherToTarget(target, pos, archer.uuid)"
                        class="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0 group/archer-item">
                        <div
                          class="size-9 rounded-full border border-gray-100 overflow-hidden shrink-0 bg-gray-50 ring-2 ring-transparent group-hover/archer-item:ring-primary/20 transition-all">
                          <img :src="useImageOrDefault(archer.avatar_url, archer.name)"
                            class="w-full h-full object-cover" :alt="archer.name" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-bold text-navy truncate leading-tight mb-0.5">{{ archer.name }}</p>
                          <p v-if="archer.club"
                            class="text-[10px] text-gray-500 font-medium truncate uppercase tracking-tighter">{{
                              archer.club }}</p>
                          <p v-else class="text-[10px] text-gray-400 italic">Independen</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center">
        <div class="size-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon icon="ph:cursor-click-bold" class="text-4xl text-gray-300" />
        </div>
        <h3 class="text-xl font-bold text-navy mb-2">Kategori Belum Dipilih</h3>
        <p class="text-gray-500 max-w-xs mx-auto">Silakan pilih salah satu kategori di atas untuk mulai mengelola
          penempatan target kualifikasi.</p>
      </div>
    </div>

    <!-- INPUT SCORING MODE -->
    <div v-if="activeTab === 'input'" class="space-y-6">
      <!-- Scoring Interface -->
      <div v-if="selectedCategory && targetAssignments.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Archers List -->
        <div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
          <div v-if="isLoading" v-for="i in 3" :key="i"
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 pl-7 animate-pulse">
            <div class="flex items-center gap-4 mb-4">
              <div class="size-10 bg-gray-100 rounded-lg"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 w-1/3 bg-gray-100 rounded"></div>
                <div class="h-3 w-1/4 bg-gray-50 rounded"></div>
              </div>
            </div>
            <div class="h-24 bg-gray-50 rounded-lg"></div>
          </div>
          <div v-else v-for="(assignment, index) in targetAssignments" :key="assignment.uuid"
            @click="selectArcherForScoring(assignment)" :class="[
              'bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all cursor-pointer',
              currentScoringAssignment?.uuid === assignment.uuid
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-gray-100 hover:border-gray-200'
            ]">
            <div
              :class="['absolute top-0 left-0 w-2 h-full', currentScoringAssignment?.uuid === assignment.uuid ? 'bg-primary' : 'bg-gray-200']">
            </div>
            <div class="p-5 pl-7 relative">
              <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    :src="useImageOrDefault(assignment.archer_avatar_url || assignment.avatar_url, assignment.archer_name)"
                    :alt="assignment.archer_name"
                    class="size-9 sm:size-10 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                  <div class="min-w-0">
                    <h3 class="text-base sm:text-lg font-bold text-navy leading-tight">{{ assignment.archer_name }}
                    </h3>
                    <div class="text-xs text-gray-500 font-medium truncate">
                      Target {{ assignment.target_name }}
                      <span v-if="assignment.club_name" class="opacity-30 mx-1.5">•</span>
                      <span v-if="assignment.club_name">{{ assignment.club_name }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="currentScoringAssignment?.uuid === assignment.uuid"
                  class="flex items-center gap-2 ml-3 flex-shrink-0">
                  <button @click.stop="selectArcherForScoring(assignment); goPrevEnd()"
                    :disabled="(assignment.currentEnd || 1) <= 1"
                    :title="(assignment.currentEnd || 1) <= 1 ? 'Sudah di end pertama' : 'End sebelumnya'"
                    class="size-8 sm:size-9 rounded-lg border border-gray-300 bg-white text-navy flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    <Icon icon="ph:arrow-left" class="text-base sm:text-lg" />
                  </button>
                  <button v-if="(assignment.currentEnd || 1) < (sessionData?.total_ends || 0)"
                    @click.stop="selectArcherForScoring(assignment); goNextEnd()" :title="'End berikutnya'"
                    class="size-8 sm:size-9 rounded-lg bg-primary text-navy flex items-center justify-center hover:bg-primary/90 transition-colors">
                    <Icon icon="ph:arrow-right" class="text-base sm:text-lg" />
                  </button>
                </div>
              </div>

              <!-- Current End Display -->
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div class="flex justify-between items-center mb-3">
                  <div class="flex items-center gap-2">
                    <span class="text-sm sm:text-base font-black text-navy">
                      End {{ assignment.currentEnd || 1 }}
                    </span>
                    <span class="text-xs font-semibold text-gray-500">/ {{ sessionData?.total_ends || 0 }}</span>
                  </div>
                  <span class="text-[10px] font-bold text-gray-400  tracking-wider">
                    {{ sessionData?.arrows_per_end || 0 }} Arrows
                  </span>
                </div>
                <div class="flex gap-2 sm:gap-3">
                  <div v-for="(score, i) in sessionData.arrows_per_end" :key="i" :class="[
                    'flex-1 aspect-square rounded-lg shadow-sm flex items-center justify-center text-lg sm:text-xl font-bold',
                    assignment.currentEndScores[i] !== undefined
                      ? 'bg-white border-2 border-gray-200 text-navy'
                      : 'bg-gray-100 border-dashed border-2 border-gray-300 text-gray-400'
                  ]">
                    {{ assignment.currentEndScores[i] !== undefined ? assignment.currentEndScores[i] : '' }}
                  </div>
                  <div class="w-px bg-gray-300 mx-1"></div>
                  <div
                    class="flex-1 aspect-square bg-navy text-primary rounded-lg flex flex-col items-center justify-center shadow-sm">
                    <span class="text-lg sm:text-xl font-bold">{{ calculateEndSum(assignment.currentEndScores)
                    }}</span>
                  </div>
                </div>


              </div>
            </div>
          </div>

          <div v-if="!targetAssignments || targetAssignments.length === 0"
            class="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Icon icon="ph:users" class="text-5xl text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500">No archers assigned to targets yet</p>
          </div>
        </div>

        <!-- Scoring Keypad -->
        <div class="lg:col-span-5 xl:col-span-4">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-6">
            <div class="flex justify-between items-center mb-5">
              <h3 class="font-bold text-navy flex items-center gap-2">
                <Icon icon="ph:keyboard" class="text-xl" />
                Input Cepat
              </h3>
            </div>

            <!-- Score Buttons -->
            <div class="grid grid-cols-3 gap-3 mb-4">
              <button @click="addScore('X')" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-[#FFE500] border-b-4 border-[#e6ce00] text-navy text-xl sm:text-2xl font-black hover:brightness-105 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                X
              </button>
              <button @click="addScore(10)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-[#FFE500] border-b-4 border-[#e6ce00] text-navy text-xl sm:text-2xl font-black hover:brightness-105 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                10
              </button>
              <button @click="addScore(9)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-[#FFE500] border-b-4 border-[#e6ce00] text-navy text-xl sm:text-2xl font-black hover:brightness-105 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                9
              </button>
              <button @click="addScore(8)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-[#EF4444] border-b-4 border-red-700 text-white text-xl sm:text-2xl font-black hover:brightness-110 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                8
              </button>
              <button @click="addScore(7)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-[#EF4444] border-b-4 border-red-700 text-white text-xl sm:text-2xl font-black hover:brightness-110 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                7
              </button>
              <button @click="addScore(6)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-[#3B82F6] border-b-4 border-blue-700 text-white text-xl sm:text-2xl font-black hover:brightness-110 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                6
              </button>
              <button @click="addScore(5)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-[#3B82F6] border-b-4 border-blue-700 text-white text-xl sm:text-2xl font-black hover:brightness-110 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                5
              </button>
              <button @click="addScore(4)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-[#111827] border-b-4 border-gray-900 text-white text-xl sm:text-2xl font-black hover:bg-gray-800 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                4
              </button>
              <button @click="addScore(3)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-[#111827] border-b-4 border-gray-900 text-white text-xl sm:text-2xl font-black hover:bg-gray-800 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                3
              </button>
              <button @click="addScore(2)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-white border border-gray-200 border-b-4 border-b-gray-300 text-navy text-xl sm:text-2xl font-black hover:bg-gray-50 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                2
              </button>
              <button @click="addScore(1)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-white border border-gray-200 border-b-4 border-b-gray-300 text-navy text-xl sm:text-2xl font-black hover:bg-gray-50 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                1
              </button>
              <button @click="addScore('M')" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-gray-100 border border-gray-200 border-b-4 border-b-gray-300 text-gray-500 text-xl sm:text-2xl font-black hover:bg-gray-200 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                M
              </button>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
              <button @click="deleteLastScore"
                :disabled="!currentScoringAssignment || !currentScoringAssignment.currentEndScores?.length"
                class="flex items-center justify-center gap-2 h-12 rounded-lg border border-gray-300 bg-white text-navy font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Icon icon="ph:backspace" class="text-lg" />
                Hapus
              </button>
              <button @click="saveEndAndNext"
                :disabled="!currentScoringAssignment || !currentScoringAssignment.currentEndScores?.length || savingScore"
                class="flex items-center justify-center gap-2 h-12 rounded-lg bg-navy text-white font-bold hover:bg-navy/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="savingScore" class="inline-flex items-center gap-2">
                  <span class="size-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
                  Menyimpan...
                </span>
                <span v-else class="inline-flex items-center gap-2">
                  Simpan
                  <Icon icon="ph:check" class="text-lg" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <Icon icon="ph:users" class="text-5xl text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500" v-if="!selectedCategory">Pilih kategori untuk input nilai</p>
        <p class="text-gray-500" v-else>Belum ada pemanah yang ditugaskan ke target</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { getCategoryIcon } from '~/utils/logoArcheryCategory'
import { ref, computed, onMounted } from 'vue'
const route = useRoute()
const { get, post } = useApi()
const toast = useToast()
import BaseSelect from '~/components/common/BaseSelect.vue'
const eventId = route.params.id
const sessionCode = route.params.session

definePageMeta({
  layout: 'dashboard'
})

// State Management
const sessionData = ref(null)
const loading = ref(false)
const activeTab = ref('target')
const selectedCategory = ref(null)
const categories = ref([])
const reportEntries = ref([])
const allParticipants = ref([])
const archersByCategory = ref({})
const availableTargets = ref([])
const targetAssignments = ref([])
const currentScoringAssignment = ref(null)
const isLoading = ref(true)
const checkingAssignments = ref(false)
const assignmentsComplete = ref(false)
const savingScore = ref(false)

// Loading States
const loadingCategories = ref(false)
const loadingReport = ref(false)
const submittingAssignments = ref(false)

// Tabs
const tabs = [
  { id: 'target', label: 'Target', icon: 'ph:target' },
  { id: 'input', label: 'Input Nilai', icon: 'ph:pencil-simple' }
]

// Computed Properties
const breadcrumbItems = computed(() => [
  { label: 'Events', to: '/dashboard/events' },
  { label: 'Event', to: `/dashboard/events/${eventId}` },
  { label: 'Qualification', to: `/dashboard/events/${eventId}/qualification` }
])

useHead({
  title: `${sessionData.value?.name || 'Session'} - Qualification`
})

const filteredArchersReport = computed(() => {
  if (!selectedCategory.value) return []
  return reportEntries.value || []
})

const filteredArchersInput = computed(() => {
  if (!selectedCategory.value) return []
  return archersByCategory.value[selectedCategory.value] || []
})

const filteredArchersScoring = computed(() => {
  if (!selectedCategory.value) return []
  return archersByCategory.value[selectedCategory.value] || []
})

const allAssigned = computed(() => {
  return filteredArchersInput.value.length > 0 && filteredArchersInput.value.every(a => a.assignedTarget)
})

const isEndComplete = computed(() => {
  if (!currentScoringAssignment.value) return false
  const scores = currentScoringAssignment.value.currentEndScores || []
  const arrowsPerEnd = sessionData.value?.arrows_per_end || 6
  if (scores.length < arrowsPerEnd) return false
  return scores.slice(0, arrowsPerEnd).every((v) => v !== undefined && v !== null)
})

// Methods
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

// No local getAvatarUrl helper needed as we use useImageOrDefault from composables

const fetchSessionData = async () => {
  loading.value = true
  try {
    const response = await get(`/events/${eventId}/qualification/sessions`)
    const sessions = response?.sessions || []
    sessionData.value = sessions.find(s => s.session_code === sessionCode)
  } catch (error) {
    console.error('Failed to fetch session:', error)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  loadingCategories.value = true
  try {
    const response = await get(`/events/${eventId}/categories`, { params: { limit: 1000 } })
    const fetchedCategories = response?.events || response.data?.events || response?.categories || response.data?.categories || []

    console.log('Fetched categories:', fetchedCategories.length)
    // Filter only individual categories for qualification
    const individual = fetchedCategories.filter(cat =>
      cat.event_type_name?.toLowerCase() === 'individual' ||
      !cat.event_type_name
    )
    categories.value = individual.sort((a, b) => (b.participant_count || 0) - (a.participant_count || 0))
    console.log('Individual categories:', categories.value.length)

    for (const category of categories.value) {
      await fetchArchersForCategory(category.id)
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    toast.error('Gagal memuat kategori')
  } finally {
    loadingCategories.value = false
  }
}

const fetchAllParticipants = async () => {
  try {
    const response = await get(`/events/${eventId}/participants`, {
      params: { limit: 1000, offset: 0 }
    })
    const participants = response?.participants || response.data?.participants || []
    allParticipants.value = participants
    console.log('Total participants fetched:', participants.length)
  } catch (error) {
    console.error('Failed to fetch participants:', error)
    allParticipants.value = []
  }
}

const fetchArchersForCategory = async (categoryId) => {
  const participants = allParticipants.value.filter(p => p.category_id === categoryId)
  const archers = participants.map(p => ({
    uuid: p.archer_id || p.id,
    name: p.full_name || p.archer_name || p.name,
    club: p.club_name || p.club,
    avatar_url: p.avatar_url || p.photo_url,
    assignedTarget: '',
    score: 0,
    isScored: false
  }))
  archersByCategory.value[categoryId] = archers
}

// New computed properties for target management
const assignedArchersCount = computed(() => {
  return filteredArchersInput.value.filter(a => a.assignedTarget).length
})

const unassignedArchersCount = computed(() => {
  return filteredArchersInput.value.filter(a => !a.assignedTarget).length
})

const unassignedArcherList = computed(() => {
  return filteredArchersInput.value.filter(a => !a.assignedTarget)
})

const availableSlotsCount = computed(() => {
  return (availableTargets.value.length * 4) - assignedArchersCount.value
})

const isAssignmentChanged = ref(true) // Always allow saving for now

const openDropdown = ref(null) // { targetId, pos }
const filterText = ref('')

// Track which dropdown is open
const toggleDropdown = (targetId, pos) => {
  if (openDropdown.value?.targetId === targetId && openDropdown.value?.pos === pos) {
    openDropdown.value = null
  } else {
    openDropdown.value = { targetId, pos }
    filterText.value = ''
  }
}

// Close dropdown on outside click
onMounted(() => {
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.archer-dropdown-container')) {
      openDropdown.value = null
    }
  })
})

const unassignedArcherListFiltered = computed(() => {
  if (!filterText.value) return unassignedArcherList.value
  const query = filterText.value.toLowerCase()
  return unassignedArcherList.value.filter(a =>
    a.name.toLowerCase().includes(query) ||
    (a.club && a.club.toLowerCase().includes(query))
  )
})

const targetGrid = computed(() => {
  if (!selectedCategory.value || !availableTargets.value.length) return []

  const archers = filteredArchersInput.value

  // Group physical targets by base name (e.g., "Target 5" from "Target 5A/5B")
  const grouped = {}

  availableTargets.value.forEach(t => {
    // Extract base name (e.g. from "Target 5A" get "Target 5")
    const baseName = t.name.replace(/[A-Za-z]$/, '').trim()
    const letterMatch = t.name.match(/[A-D]$/i)
    const letter = letterMatch ? letterMatch[0].toUpperCase() : 'A'

    if (!grouped[baseName]) {
      grouped[baseName] = {
        name: baseName,
        targetIds: [],
        availableLetters: [],
        slots: {},
        assignedCount: 0
      }
    }
    grouped[baseName].targetIds.push(t.id)
    if (!grouped[baseName].availableLetters.includes(letter)) {
      grouped[baseName].availableLetters.push(letter)
      grouped[baseName].availableLetters.sort()
      grouped[baseName].slots[letter] = null
    }

    // Find archers assigned to this specific target record
    const targetArchers = archers.filter(a => a.assignedTarget === t.id)
    targetArchers.forEach((archer) => {
      if (grouped[baseName].slots[letter] === null) {
        grouped[baseName].slots[letter] = {
          ...archer,
          actualTargetId: t.id
        }
        grouped[baseName].assignedCount++
      }
    })
  })

  return Object.values(grouped).sort((a, b) => {
    const numA = parseInt(a.name.match(/\d+/)?.[0] || 0)
    const numB = parseInt(b.name.match(/\d+/)?.[0] || 0)
    return numA - numB
  })
})

const assignArcherToTarget = (baseTarget, position, archerUuid) => {
  const archer = filteredArchersInput.value.find(a => a.uuid === archerUuid)
  if (archer) {
    let targetId = baseTarget.targetIds[0]
    if (baseTarget.targetIds.length > 1) {
      const matched = availableTargets.value.find(t =>
        baseTarget.targetIds.includes(t.id) &&
        t.name.toUpperCase().endsWith(position)
      )
      if (matched) targetId = matched.id
    }

    archer.assignedTarget = targetId
    archer.assignedPosition = position
    openDropdown.value = null
  }
}

const unassignArcherFromTarget = (baseTarget, position) => {
  const slotData = baseTarget.slots[position]
  if (slotData) {
    const archer = filteredArchersInput.value.find(a => a.uuid === slotData.uuid)
    if (archer) {
      archer.assignedTarget = ''
      archer.assignedPosition = ''
    }
  }
}

const autoAssignTargets = () => {
  const archers = filteredArchersInput.value || []
  const unassignedArchers = archers.filter(a => !a.assignedTarget)

  if (unassignedArchers.length === 0) {
    toast.warning('Semua pemanah sudah memiliki target')
    return
  }

  // Get physical target map from the grid
  const grid = targetGrid.value
  if (!grid.length) {
    toast.error('Tidak ada target tersedia')
    return
  }

  // Identify all available slots across the entire grid
  let availableSlots = []
  grid.forEach(target => {
    target.availableLetters.forEach(pos => {
      if (!target.slots[pos]) {
        availableSlots.push({
          baseName: target.name,
          targetIds: target.targetIds,
          position: pos
        })
      }
    })
  })

  if (availableSlots.length < unassignedArchers.length) {
    toast.warning('Slot tidak mencukupi untuk semua pemanah')
  }

  // Shuffle archers to vary results, or just sort by name? Let's just process.
  // Actually, sorting by club helps in distributing them better.
  const sortedArchers = [...unassignedArchers].sort((a, b) => {
    const clubA = a.club || 'ZZZ'
    const clubB = b.club || 'ZZZ'
    return clubA.localeCompare(clubB)
  })

  let assignedCount = 0

  sortedArchers.forEach(archer => {
    if (availableSlots.length === 0) return

    // Find a slot where no one from the same club is already assigned to this base target
    let bestSlotIndex = -1

    if (archer.club) {
      bestSlotIndex = availableSlots.findIndex(slot => {
        // Check if this base target already has someone from this club
        const targetInGrid = grid.find(g => g.name === slot.baseName)
        if (!targetInGrid) return false

        const hasSameClub = Object.values(targetInGrid.slots).some(s => s && s.club === archer.club)
        return !hasSameClub
      })
    }

    // fallback to first available slot if no "clean" slot found
    const finalIndex = bestSlotIndex !== -1 ? bestSlotIndex : 0
    const slot = availableSlots[finalIndex]

    // Pick the actual DB record ID. 
    // If target has multiple records (e.g. 5A record, 5B record), find the one matching the letter
    let targetId = slot.targetIds[0]
    if (slot.targetIds.length > 1) {
      const matchedRecord = availableTargets.value.find(t =>
        slot.targetIds.includes(t.id) &&
        t.name.toUpperCase().endsWith(slot.position)
      )
      if (matchedRecord) targetId = matchedRecord.id
    }

    // Assign locally
    const archerRef = archers.find(a => a.uuid === archer.uuid)
    if (archerRef) {
      archerRef.assignedTarget = targetId
      archerRef.assignedPosition = slot.position
      assignedCount++

      // Mark as occupied in our local grid reference for the next loop iteration check
      const g = grid.find(tg => tg.name === slot.baseName)
      if (g) g.slots[slot.position] = { club: archer.club }
    }

    // Remove slot from availability
    availableSlots.splice(finalIndex, 1)
  })

  // Trigger grid refresh (computed property relies on archer mutations)
  isAssignmentChanged.value = true

  if (assignedCount > 0) {
    toast.success(`${assignedCount} pemanah berhasil ditempatkan secara otomatis`)
  } else {
    toast.error('Gagal melakukan penempatan otomatis')
  }
}

const fetchQualificationReport = async (categoryId) => {
  if (!categoryId) return

  loadingReport.value = true
  try {
    const response = await get(`/events/${eventId}/qualification/leaderboard`, {
      params: { category_id: categoryId }
    })
    const leaderboard = response?.leaderboard || response?.data?.leaderboard || []
    reportEntries.value = leaderboard.map((item, index) => ({
      id: `${categoryId}-${index}`,
      archer_name: item.archer_name,
      club_name: item.club_name,
      total_score: item.total_score || 0,
      ends_completed: item.ends_completed || 0
    }))
  } catch (error) {
    console.error('Failed to fetch report:', error)
    reportEntries.value = []
    toast.error('Gagal memuat laporan')
  } finally {
    loadingReport.value = false
  }
}

const selectCategory = async (categoryId) => {
  selectedCategory.value = categoryId

  // Reset scoring state before loading new category
  targetAssignments.value = []
  currentScoringAssignment.value = null

  // Load existing assignments for this category
  await loadExistingAssignments(categoryId)

  // Check assignments for scoring tab
  await checkTargetAssignments(categoryId)
  if (assignmentsComplete.value) {
    await fetchTargetAssignments(categoryId)
  } else {
    targetAssignments.value = []
    currentScoringAssignment.value = null
  }
}

const loadExistingAssignments = async (categoryId) => {
  if (!sessionData.value) return

  try {
    const response = await get(`/qualification/sessions/${sessionData.value.uuid}/assignments`)
    const assignments = response?.assignments || response.data?.assignments || []

    // Get archers for this category
    const categoryArchers = archersByCategory.value[categoryId] || []

    // Map existing assignments to archers
    categoryArchers.forEach(archer => {
      const existingAssignment = assignments.find(a => a.archer_uuid === archer.uuid)
      if (existingAssignment) {
        archer.assignedTarget = existingAssignment.target_uuid
        archer.assignedPosition = existingAssignment.target_position
      } else {
        archer.assignedTarget = ''
        archer.assignedPosition = ''
      }
    })
  } catch (error) {
    console.error('Failed to load existing assignments:', error)
  }
}

const checkTargetAssignments = async (categoryId) => {
  if (!sessionData.value) return

  checkingAssignments.value = true
  try {
    const archers = archersByCategory.value[categoryId] || []
    const response = await get(`/qualification/sessions/${sessionData.value.uuid}/assignments`)
    const assignments = response?.assignments || response.data?.assignments || []

    // Check if all archers in category have assignments
    const assignedArcherIds = new Set(assignments.map(a => a.archer_uuid))
    const allAssigned = archers.every(archer => assignedArcherIds.has(archer.uuid))

    assignmentsComplete.value = allAssigned && archers.length > 0
    if (!assignmentsComplete.value) {
      targetAssignments.value = []
      currentScoringAssignment.value = null
    }
  } catch (error) {
    console.error('Failed to check assignments:', error)
    assignmentsComplete.value = false
    targetAssignments.value = []
    currentScoringAssignment.value = null
  } finally {
    checkingAssignments.value = false
  }
}

const fetchTargetAssignments = async (categoryId) => {
  if (!sessionData.value) return

  try {
    const response = await get(`/qualification/sessions/${sessionData.value.uuid}/assignments`)
    let assignments = response?.assignments || response.data?.assignments || []

    // Filter by category
    const archerIds = new Set((archersByCategory.value[categoryId] || []).map(a => a.uuid))
    assignments = assignments.filter(a => archerIds.has(a.archer_uuid))

    // Initialize scoring state for each assignment
    targetAssignments.value = assignments.map(a => ({
      ...a,
      currentEnd: 1,
      currentEndScores: [],
      allEndScores: {} // { endNumber: [scores] }
    }))

    await Promise.all(targetAssignments.value.map((assignment) => loadAssignmentScores(assignment)))

    // Auto-select first archer
    if (targetAssignments.value.length > 0) {
      currentScoringAssignment.value = targetAssignments.value[0]
    }
  } catch (error) {
    console.error('Failed to fetch assignments:', error)
    targetAssignments.value = []
  }
}

const loadAssignmentScores = async (assignment) => {
  try {
    const response = await get(`/qualification/assignments/${assignment.uuid}/scores`)
    const scores = response?.scores || response.data?.scores || []

    const allEndScores = {}
    scores.forEach((endScore) => {
      const arrows = Array.from({ length: sessionData.value?.arrows_per_end || 0 }, () => undefined)
        ; (endScore.arrows || []).forEach((arrow) => {
          const value = arrow.is_x ? 10 : arrow.score
          arrows[arrow.arrow_number - 1] = value
        })
      allEndScores[endScore.end_number] = arrows
    })

    assignment.allEndScores = allEndScores

    // Determine current end: first missing end, or last end
    const totalEnds = sessionData.value?.total_ends || 0
    let nextEnd = 1
    for (let i = 1; i <= totalEnds; i += 1) {
      if (!allEndScores[i] || allEndScores[i].every((v) => v === undefined)) {
        nextEnd = i
        break
      }
      if (i === totalEnds) {
        nextEnd = totalEnds
      }
    }

    assignment.currentEnd = nextEnd
    assignment.currentEndScores = allEndScores[nextEnd] ? [...allEndScores[nextEnd]] : []
  } catch (error) {
    console.error('Failed to load assignment scores:', error)
  }
}

const selectArcherForScoring = (assignment) => {
  currentScoringAssignment.value = assignment
}

const addScore = (score) => {
  if (!currentScoringAssignment.value) return

  // Convert X to 10 for storage
  const numericScore = score === 'X' ? 10 : (score === 'M' ? 0 : score)
  const arrowsPerEnd = sessionData.value?.arrows_per_end || 6

  if (!currentScoringAssignment.value.currentEndScores) {
    currentScoringAssignment.value.currentEndScores = []
  }

  const scores = currentScoringAssignment.value.currentEndScores
  const emptyIndex = scores.findIndex((v) => v === undefined)

  if (emptyIndex !== -1) {
    scores[emptyIndex] = numericScore
    return
  }

  if (scores.length < arrowsPerEnd) {
    scores.push(numericScore)
  }
}

const deleteLastScore = () => {
  if (!currentScoringAssignment.value?.currentEndScores?.length) return
  const scores = currentScoringAssignment.value.currentEndScores
  for (let i = scores.length - 1; i >= 0; i -= 1) {
    if (scores[i] !== undefined) {
      scores[i] = undefined
      break
    }
  }
}

const clearCurrentEnd = () => {
  if (!currentScoringAssignment.value) return
  currentScoringAssignment.value.currentEndScores = []
}

const calculateEndSum = (scores) => {
  if (!scores || !scores.length) return 0
  return scores.reduce((sum, score) => sum + (score || 0), 0)
}

const isAssignmentEndComplete = (assignment) => {
  if (!assignment) return false
  const scores = assignment.currentEndScores || []
  const arrowsPerEnd = sessionData.value?.arrows_per_end || 6
  if (scores.length < arrowsPerEnd) return false
  return scores.slice(0, arrowsPerEnd).every((v) => v !== undefined && v !== null)
}

const goToEnd = (endNumber) => {
  if (!currentScoringAssignment.value) return
  currentScoringAssignment.value.currentEnd = endNumber
  const saved = currentScoringAssignment.value.allEndScores?.[endNumber]
  currentScoringAssignment.value.currentEndScores = saved ? [...saved] : []
}

const goPrevEnd = () => {
  if (!currentScoringAssignment.value) return
  const currentEnd = currentScoringAssignment.value.currentEnd || 1
  if (currentEnd <= 1) return
  goToEnd(currentEnd - 1)
}

const goNextEnd = () => {
  if (!currentScoringAssignment.value) return
  const totalEnds = sessionData.value?.total_ends || 0
  const currentEnd = currentScoringAssignment.value.currentEnd || 1
  if (currentEnd >= totalEnds) return
  goToEnd(currentEnd + 1)
}

const calculateTotalScore = (assignment) => {
  let total = 0

  // Add all saved end scores
  if (assignment.allEndScores) {
    Object.values(assignment.allEndScores).forEach(endScores => {
      total += calculateEndSum(endScores)
    })
  }

  // Add current end scores if not saved yet
  if (assignment.currentEndScores?.length) {
    total += calculateEndSum(assignment.currentEndScores)
  }

  return total
}

const saveEndAndNext = async () => {
  if (!currentScoringAssignment.value || !currentScoringAssignment.value.currentEndScores?.length) return

  savingScore.value = true
  try {
    const endNumber = currentScoringAssignment.value.currentEnd
    const scores = currentScoringAssignment.value.currentEndScores
    const filledScores = (scores || []).filter((score) => score !== undefined && score !== null)

    // Convert scores to arrow format (X=10, M=0, others as string)
    const arrows = filledScores.map(score => {
      if (score === 10) return 'X'
      if (score === 0) return 'M'
      return String(score)
    })

    // Save scores to backend
    await post(`/qualification/assignments/${currentScoringAssignment.value.uuid}/scores`, {
      end_number: endNumber,
      arrows: arrows
    })

    // Store in local state
    if (!currentScoringAssignment.value.allEndScores) {
      currentScoringAssignment.value.allEndScores = {}
    }
    currentScoringAssignment.value.allEndScores[endNumber] = [...scores]

    // Move to next end or next archer
    if (endNumber < sessionData.value.total_ends) {
      currentScoringAssignment.value.currentEnd = endNumber + 1
      currentScoringAssignment.value.currentEndScores = []
    } else {
      // Move to next archer
      const currentIndex = targetAssignments.value.findIndex(a => a.uuid === currentScoringAssignment.value.uuid)
      if (currentIndex < targetAssignments.value.length - 1) {
        currentScoringAssignment.value = targetAssignments.value[currentIndex + 1]
      } else {
        // All done
        toast.success('Semua pemanah selesai!')
        currentScoringAssignment.value.currentEndScores = []
      }
    }

    toast.success('Nilai berhasil disimpan')
  } catch (error) {
    console.error('Failed to save score:', error)
    toast.error('Gagal menyimpan nilai')
  } finally {
    savingScore.value = false
  }
}

const fetchTargets = async () => {
  try {
    const response = await get(`/events/${eventId}/targets/options`)
    const options = response?.options || response.data?.options || []
    availableTargets.value = options.map((opt) => ({
      id: opt.id || opt.uuid,
      name: opt.target_name || opt.value || opt.name
    }))
  } catch (error) {
    console.error('Failed to fetch targets:', error)
    availableTargets.value = []
  }
}

const submitAssignments = async () => {
  try {
    submittingAssignments.value = true

    if (!sessionData.value) {
      toast.warning('Pilih sesi terlebih dahulu')
      return
    }

    if (!allAssigned.value) {
      toast.error('Harap tetapkan semua pemanah ke target')
      return
    }

    const payload = filteredArchersInput.value
      .filter(a => a.assignedTarget)
      .map(a => ({
        archer_uuid: a.uuid,
        target_id: a.assignedTarget,
        target_position: a.assignedPosition || 'A'
      }))

    await post(`/events/${eventId}/qualification/sessions/${sessionData.value.uuid}/assignments`, {
      category_id: selectedCategory.value,
      assignments: payload
    })

    toast.success('Penempatan target berhasil disimpan')
  } catch (error) {
    console.error('Failed to save assignments:', error)
    toast.error('Gagal menyimpan penempatan')
  } finally {
    submittingAssignments.value = false
  }
}

const getAvailableTargetsForArcher = (archer) => {
  // Get all assigned targets except the current archer's assigned target
  const assignedTargetIds = filteredArchersInput.value
    .filter(a => a.uuid !== archer.uuid && a.assignedTarget)
    .map(a => a.assignedTarget)

  // Return targets that are not assigned or is the current archer's target
  return availableTargets.value.filter(target =>
    !assignedTargetIds.includes(target.id) || target.id === archer.assignedTarget
  )
}

// Lifecycle
onMounted(async () => {
  isLoading.value = true
  try {
    await fetchSessionData()
    await fetchAllParticipants()
    await fetchCategories()
    await fetchTargets()

    // Auto-select first category and load existing assignments
    if (categories.value.length > 0) {
      const firstCategoryId = categories.value[0].id
      await selectCategory(firstCategoryId)
    }
  } catch (error) {
    console.error('Initial fetch failed:', error)
  } finally {
    isLoading.value = false
  }
})
</script>
<style scoped>
.key-btn:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
}
</style>
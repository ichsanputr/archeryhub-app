<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Enhanced Header -->
    <div
      class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <!-- Theme Motif Pattern -->
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
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
              class="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
              <Icon icon="ph:brackets-curly" class="text-white text-xl sm:text-2xl" />
            </div>

            <!-- Title Section -->
            <div class="min-w-0">
              <h1 class="text-xl sm:text-3xl font-black leading-tight tracking-tight mb-1 sm:mb-2 truncate">
                {{ t('event_elimination.title') }}
              </h1>
              <div class="text-slate-300 text-xs sm:text-sm max-w-2xl line-clamp-1 sm:line-clamp-none">
                {{ t('event_elimination.desc', { eventName }) }}
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
             <BaseButton variant="primary" icon="ph:plus-bold"
               class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-black tracking-widest"
               :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
               @click="isSubscriptionActive ? (resetForm(), showCreateDialog = true) : (showPremiumModal = true)">
               {{ t('event_elimination.create_bracket') }}
             </BaseButton>
           </div>
        </div>
      </div>
    </div>
    <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

    <!-- Brackets List -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-bold text-navy">{{ t('event_elimination.bracket_list') }}</h2>
          <div class="text-sm text-gray-500 mt-1">{{ t('event_elimination.bracket_list_desc') }}</div>
        </div>
      </div>

      <div v-if="loadingBrackets" class="flex gap-4 overflow-x-hidden pb-2">
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

      <div v-else-if="brackets.length === 0"
        class="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <Icon icon="ph:brackets-curly" class="text-4xl text-gray-300 mx-auto mb-3" />
        <div class="text-sm font-bold text-gray-600 mb-1">{{ t('event_elimination.no_brackets') }}</div>
        <div class="text-xs text-gray-400">{{ t('event_elimination.no_brackets_desc') }}</div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink v-for="bracket in brackets" :key="bracket.id"
          :to="`/dashboard/events/${eventId}/elimination/${bracket.id}`"
          class="p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 hover:border-primary hover:shadow-md transition-all text-left group">

          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3 flex-1">
              <div
                class="w-12 h-12 rounded-lg flex items-center justify-center transition-colors overflow-hidden border bg-primary/50">
                <img :src="`/${getCategoryIcon(bracket.category_name)}`" class="w-8 h-8 object-contain" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="font-bold text-navy group-hover:text-primary transition-colors line-clamp-2">
                  {{ getBracketName(bracket) }}
                </div>
                <div class="text-xs text-gray-500 font-mono mt-1">{{ bracket.id }}</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button @click.stop.prevent="isSubscriptionActive ? openEditBracket(bracket) : (showPremiumModal = true)"
                class="p-2 rounded-lg bg-gray-100 text-gray-400 hover:bg-primary/20 hover:text-primary transition-all">
                <Icon icon="ph:pencil-simple-bold" class="text-lg" />
              </button>
              <button @click.stop.prevent="isSubscriptionActive ? confirmDeleteBracket(bracket) : (showPremiumModal = true)"
                class="p-2 rounded-lg bg-gray-100 text-gray-400 hover:bg-red-50/80 hover:text-red-500 transition-all">
                <Icon icon="ph:trash-bold" class="text-lg" />
              </button>
            </div>
          </div>

          <!-- Details -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-xs text-gray-600">
              <Icon icon="ph:users-three" class="text-sm" />
              <span class="font-semibold">{{ bracket.bracket_size }} {{ bracket.bracket_type === 'individual' ? (t('event_detail.archers') || 'participants') : (t('event_detail.teams') || 'teams') }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-600">
              <Icon icon="ph:crosshair" class="text-sm" />
              <span class="font-semibold">{{ getFormatLabel(bracket.format) }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-600">
              <Icon icon="ph:list" class="text-sm" />
              <span class="font-semibold">{{ getBracketTypeLabel(bracket.bracket_type) }}</span>
            </div>
            <div class="flex items-center gap-3 pt-1">
              <div class="flex items-center gap-1.5 text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                <Icon icon="ph:stack-bold" class="text-xs" />
                <span class="font-bold">{{ bracket.ends_per_match }} End/Match</span>
              </div>
              <div class="flex items-center gap-1.5 text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                <Icon icon="ph:target-bold" class="text-xs" />
                <span class="font-bold">{{ bracket.arrows_per_end }} Arrow/End</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-200">
            <span class="text-xs font-mono text-gray-400">{{ formatDate(bracket.created_at) }}</span>
            <div class="flex items-center gap-1 font-bold text-xs group-hover:gap-2 transition-all">
              <span>{{ t('event_elimination.open') || 'Open' }}</span>
              <Icon icon="ph:arrow-right" class="text-sm" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Suggested Categories Section -->
    <div v-if="loadingCategories || categoriesWithoutBracket.length > 0"
      class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center w-full justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold text-navy">{{ t('event_elimination.categories_without_bracket') }}</h2>
            <div class="text-sm text-gray-500 mt-1">{{ t('event_elimination.categories_without_bracket_desc') }}</div>
          </div>
          <div class="relative w-full sm:w-72">
            <Icon icon="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input v-model="searchQuery" type="text" :placeholder="t('event_elimination.search_categories') || 'Cari kategori...'"
              class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-navy placeholder:font-normal" />
          </div>
        </div>
      </div>

      <div v-if="loadingCategories" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="p-4 rounded-xl border border-gray-100 animate-pulse">
          <div class="flex items-center gap-3">
            <div class="size-10 bg-gray-100 rounded-lg"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-50 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="cat in filteredCategoriesWithoutBracket" :key="cat.id"
          class="p-4 bg-gray-50 hover:bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all cursor-pointer group"
          @click="isSubscriptionActive ? openCreateForCategory(cat) : (showPremiumModal = true)">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center group-hover:bg-navy transition-all overflow-hidden p-1.5">
              <img
                :src="'/' + getCategoryIcon(`${cat.division_name} ${cat.event_type_name} ${cat.gender_division_name}`)"
                :alt="cat.division_name" class="w-full h-full object-contain group-hover:invert transition-all" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-bold text-navy group-hover:text-primary transition-colors truncate">
                {{ getCategoryName(cat) }}
              </div>
              <div class="text-[10px] text-gray-500 font-medium">{{ t('event_elimination.click_to_create') }}</div>
            </div>
            <Icon icon="ph:plus" class="text-gray-300 group-hover:text-primary" />
          </div>
        </div>
      </div>
    </div>

    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showCreateDialog"
        class="fixed inset-0 z-50 overflow-y-auto bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        @click.self="showCreateDialog = false">
        <div class="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col my-auto">
          
          <!-- Signature Navy Header -->
          <div class="relative overflow-hidden px-6 py-5 bg-gradient-to-r from-navy via-navy to-navy/90 text-white flex items-center justify-between border-b border-primary/20">
            <div class="absolute inset-0"
              style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <div class="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl"></div>

            <div class="relative flex items-center gap-3.5 min-w-0">
              <div class="size-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-primary text-xl shrink-0 shadow-sm">
                <Icon :icon="isEditing ? 'ph:pencil-simple-bold' : 'ph:brackets-curly-bold'" />
              </div>
              <div class="min-w-0">
                <h3 class="text-lg font-black tracking-tight text-white leading-tight truncate">
                  {{ modalTitle }}
                </h3>
                <div class="text-xs text-slate-300 truncate mt-0.5">
                  {{ t('event_elimination.configure_details', 'Konfigurasi detail bagan eliminasi') }}
                </div>
              </div>
            </div>

            <button @click="showCreateDialog = false; resetForm()"
              class="relative size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors shrink-0 ml-4">
              <Icon icon="ph:x-bold" class="text-sm" />
            </button>
          </div>

          <!-- Modal Body (Sectioned Cards matching Create Session modal) -->
          <div class="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
            
            <!-- Section 1: Category & Bracket Type -->
            <div class="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
              <div class="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Icon icon="ph:trophy-bold" class="text-slate-600 text-base" />
                <span>{{ t('event_elimination.competition_category', 'Kategori & Tipe Lomba') }}</span>
              </div>

              <div class="space-y-3.5">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">
                    {{ t('event_elimination.competition_category', 'Kategori Lomba') }} <span class="text-red-500">*</span>
                  </label>
                  <BaseSelect v-model="newBracket.categoryId" :items="categoryOptions" :placeholder="t('event_elimination.select_category', 'Pilih Kategori Lomba')"
                    required :disabled="isEditing" teleport />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">
                      {{ t('event_elimination.bracket_type', 'Tipe Bagan') }} <span class="text-red-500">*</span>
                    </label>
                    <BaseSelect v-model="newBracket.bracketType" :items="availableBracketTypes"
                      :placeholder="t('event_elimination.select_bracket_type', 'Pilih Tipe Bagan')" required teleport />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">
                      {{ t('event_elimination.score_format', 'Format Skor') }} <span class="text-red-500">*</span>
                    </label>
                    <BaseSelect v-model="newBracket.format" :items="formatOptions" :placeholder="t('event_elimination.select_format', 'Pilih Format Skor')" required
                      teleport />
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 2: Match Configuration -->
            <div class="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
              <div class="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Icon icon="ph:target-bold" class="text-slate-600 text-base" />
                <span>{{ t('event_elimination.match_config', 'Konfigurasi Pertandingan') }}</span>
              </div>

              <div class="space-y-3.5">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">
                    {{ t('event_elimination.bracket_size', 'Ukuran Bagan') }} <span class="text-red-500">*</span>
                  </label>
                  <!-- Loading -->
                  <div v-if="loadingBracketSize"
                    class="h-11 bg-white rounded-xl border border-slate-200 animate-pulse"></div>
                  <!-- Editing: bracket size is locked -->
                  <div v-else-if="isEditing"
                    class="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 h-11">
                    <Icon icon="ph:brackets-curly-bold" class="text-navy text-lg flex-shrink-0" />
                    <div>
                      <div class="font-bold text-slate-900 text-xs sm:text-sm">{{ newBracket.bracketSize }} Slot</div>
                      <div class="text-[10px] text-slate-400">{{ t('event_elimination.fixed_since_creation', 'Ukuran terkunci sejak pembuatan') }}</div>
                    </div>
                  </div>
                  <!-- Creating: dropdown of valid options -->
                  <div v-else-if="bracketSizeDropdownOptions.length > 0" class="space-y-1.5">
                    <BaseSelect v-model="newBracket.bracketSize" :items="bracketSizeDropdownOptions"
                      :placeholder="t('event_elimination.select_size', 'Pilih Ukuran Bagan')" required teleport />
                    <!-- Hint below dropdown -->
                    <div class="text-xs font-medium"
                      :class="selectedBracketHint.isEstimate ? 'text-amber-600' : 'text-slate-500'">
                      {{ selectedBracketHint.text }}
                    </div>
                  </div>
                  <!-- No / Insufficient participants -->
                  <div v-else-if="newBracket.categoryId"
                    class="flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <Icon icon="ph:warning-circle-bold" class="text-amber-600 text-lg flex-shrink-0" />
                    <span class="text-xs font-bold text-amber-800">
                      {{ bracketSizeInfo.participant_count === 1
                        ? t('event_elimination.min_two_participants', 'Hanya 1 peserta terdaftar. Minimal 2 peserta untuk membuat bagan eliminasi.')
                        : (newBracket.bracketType !== 'individual'
                          ? t('event_elimination.insufficient_teams', 'Jumlah tim belum mencukupi untuk membuat bagan eliminasi (Minimal 2 tim)')
                          : t('event_elimination.no_participants_in_category', 'Jumlah peserta belum mencukupi untuk membuat bagan eliminasi (Minimal 2 peserta)'))
                      }}
                    </span>
                  </div>
                  <div v-else class="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl h-11">
                    <Icon icon="ph:info-bold" class="text-slate-400 flex-shrink-0" />
                    <span class="text-xs text-slate-500">{{ t('event_elimination.select_category_for_calc', 'Pilih kategori untuk kalkulasi ukuran bagan') }}</span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">
                      {{ t('event_elimination.ends_per_match', 'Jumlah Seri / Match') }} <span class="text-red-500">*</span>
                    </label>
                    <BaseInput v-model.number="newBracket.endsPerMatch" type="number" min="1" max="15" required />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">
                      {{ t('event_elimination.arrows_per_end', 'Jumlah Panah / Seri') }} <span class="text-red-500">*</span>
                    </label>
                    <BaseInput v-model.number="newBracket.arrowsPerEnd" type="number" min="1" max="6" required />
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 3: Timing / Schedule -->
            <div class="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
              <div class="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Icon icon="ph:calendar-check-bold" class="text-slate-600 text-base" />
                <span>{{ t('event_elimination.schedule', 'Jadwal Pertandingan') }}</span>
              </div>

              <div class="space-y-3.5">
                <!-- Start Time -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">
                    {{ t('event_elimination.start_elimination', 'Waktu Mulai Eliminasi') }}
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <BaseDatePicker v-model="newBracket.startDate" :placeholder="t('event_elimination.start_date', 'Tanggal Mulai')" />
                    <BaseTimePicker v-model="newBracket.startTime" placeholder="08:00" />
                  </div>
                </div>

                <!-- End Time -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">
                    {{ t('event_elimination.end_elimination', 'Waktu Selesai Eliminasi') }}
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <BaseDatePicker v-model="newBracket.endDate" :placeholder="t('event_elimination.end_date', 'Tanggal Selesai')" />
                    <BaseTimePicker v-model="newBracket.endTime" placeholder="17:00" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Modal Footer (Matching Create Session footer) -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-3xl">
            <BaseButton variant="white" class="h-10 px-5 text-xs font-bold border-slate-200"
              @click="showCreateDialog = false; resetForm()">
              {{ t('event_elimination.cancel', 'Batal') }}
            </BaseButton>
            <BaseButton
              :disabled="(!isEditing && bracketSizeDropdownOptions.length === 0) || !newBracket.categoryId || creatingBracket"
              :loading="creatingBracket" variant="primary"
              class="h-10 px-6 text-xs font-bold shadow-md shadow-primary/20"
              @click="handleCreateOrUpdate">
              <span>{{ submitButtonLabel }}</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Dialog -->
    <BaseDialogForm v-if="showDeleteDialog" v-model="showDeleteDialog" @close="showDeleteDialog = false">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="size-10 bg-red-50 rounded-xl flex items-center justify-center shadow-inner">
            <Icon icon="ph:trash-bold" class="text-xl text-red-600" />
          </div>
          <h2 class="text-xl font-black text-navy">{{ t('event_elimination.delete_bracket_confirm') }}</h2>
        </div>
      </template>
      <div class="space-y-6 pt-2">
        <!-- Warning Banner -->
        <div class="p-6 bg-red-50 border-2 border-red-100 rounded-3xl relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 opacity-10 group-hover:scale-120 transition-transform duration-700">
            <Icon icon="ph:warning-circle-bold" class="text-8xl text-red-600" />
          </div>
          <div class="relative z-10">
            <h4 class="text-sm font-black text-red-700 tracking-widest mb-2">{{ t('event_elimination.delete_warning') }}</h4>
            <div class="text-xs font-bold text-red-600/80 leading-relaxed mb-4">
              {{ t('event_elimination.delete_warning_desc') }}
            </div>

            <div class="flex items-center gap-2 px-3 py-1.5 bg-red-100 rounded-xl w-fit">
              <Icon icon="ph:info-bold" class="text-red-600" />
              <span class="text-[10px] font-black tracking-wider text-red-700">{{ t('event_elimination.action_irreversible') }}</span>
            </div>
          </div>
        </div>

        <!-- Bracket Overview -->
        <div class="p-5 rounded-2xl bg-navy text-white relative overflow-hidden group shadow-sm">
          <div class="absolute inset-0 opacity-10 pointer-events-none"
            style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 11px);">
          </div>
          <div class="relative z-10">
            <h4 class="text-[9px] font-black text-primary tracking-[0.2em] mb-2">{{ t('event_elimination.bracket_info') }}</h4>
            <div class="text-lg font-black leading-tight mb-1">
              {{ getBracketName(bracketToDelete) }}
            </div>
            <div class="text-xs font-bold text-slate-300">
              {{ t('event_elimination.bracket_size') }}: {{ bracketToDelete?.bracket_size }} • {{ t('event_elimination.bracket_type') }}: {{
                getBracketTypeLabel(bracketToDelete?.bracket_type) }}
            </div>
          </div>
        </div>

        <!-- Impact Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div v-for="stat in [
            { label: t('event_elimination.matches'), count: t('common.all') || 'ALL', icon: 'ph:layout-bold' },
            { label: t('event_elimination.scores'), count: t('common.all') || 'ALL', icon: 'ph:medal-bold' },
            { label: t('event_elimination.target_codes'), count: t('common.all') || 'ALL', icon: 'ph:lock-key-bold' },
            { label: t('event_elimination.participants'), count: t('common.all') || 'ALL', icon: 'ph:users-bold' }
          ]" :key="stat.label"
            class="p-4 rounded-2xl border transition-all duration-300 shadow-sm bg-red-50 border-red-100">
            <div class="flex items-center justify-between mb-2">
              <div
                class="size-9 rounded-lg flex items-center justify-center transition-colors shadow-inner bg-red-100 text-red-600">
                <Icon :icon="stat.icon" class="text-lg" />
              </div>
              <div class="text-[10px] font-black text-red-700 tracking-widest">
                {{ stat.count }}
              </div>
            </div>
            <span class="text-[9px] font-black text-gray-400 tracking-wider text-left">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <template #action>
        <BaseButton variant="white" @click="showDeleteDialog = false" class="px-6 font-bold tracking-wider text-xs">
          {{ t('event_elimination.cancel') }}
        </BaseButton>
        <BaseButton variant="danger" @click="handleDeleteBracket" :disabled="savingDelete" :loading="savingDelete"
          icon="ph:trash-bold" class="px-8 font-black tracking-wider text-xs shadow-lg shadow-red-200">
          {{ t('event_elimination.delete_bracket') }}
        </BaseButton>
      </template>
    </BaseDialogForm>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'
import { useSubscription } from '~/composables/useSubscription'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
const { isSubscriptionActive } = useSubscription()
const showPremiumModal = ref(false)

useHead({
  title: computed(() => `${t('event_elimination.title')} - Dashboard`)
})

import { getCategoryIcon, getCategoryColorClass } from '~/utils/logoArcheryCategory'

const route = useRoute()
const eventId = computed(() => route.params.id)
const { get, post, put, delete: del } = useApi()
const toast = useToast()

const eventName = ref('Event')
const brackets = ref([])
const categories = ref([])
const loadingBrackets = ref(false)
const loadingCategories = ref(false)
const loadingBracketSize = ref(false)
const bracketSizeInfo = ref({ participant_count: 0, max_bracket_size: 0, byes: 0, synced_teams: 0, possible_teams: 0, team_size: 1 })
const creatingBracket = ref(false)
const showCreateDialog = ref(false)

const showDeleteDialog = ref(false)
const bracketToDelete = ref(null)
const savingDelete = ref(false)

const editBracketId = ref(null)
const isEditing = computed(() => !!editBracketId.value)
const modalTitle = computed(() => isEditing.value ? (t('event_elimination.edit_bracket') || 'Edit Bracket') : t('event_elimination.create_bracket'))
const submitButtonLabel = computed(() => {
  if (creatingBracket.value) return isEditing.value ? (t('event_elimination.updating') || 'Updating...') : (t('event_elimination.creating') || 'Creating...')
  return isEditing.value ? (t('event_elimination.save_update') || 'Save Update') : t('event_elimination.create_bracket')
})

const defaultStartDate = () => new Date().toISOString().split('T')[0]
const defaultStartTime = '08:00'
const defaultEndTime = '17:00'

const newBracket = ref({
  categoryId: '',
  bracketType: 'individual',
  format: 'recurve_set',
  bracketSize: 0, // display-only when editing; auto-calculated from API when creating
  endsPerMatch: 5,
  arrowsPerEnd: 3,
  startDate: defaultStartDate(),
  startTime: defaultStartTime,
  endDate: defaultStartDate(),
  endTime: defaultEndTime
})

const fetchBracketSizeInfo = async () => {
  const catId = newBracket.value.categoryId
  const type = newBracket.value.bracketType
  if (!catId || !eventId.value || isEditing.value) return

  loadingBracketSize.value = true
  bracketSizeInfo.value = { participant_count: 0, max_bracket_size: 0, byes: 0, synced_teams: 0, possible_teams: 0, team_size: 1 }
  try {
    const response = await get(`/events/${eventId.value}/elimination/bracket-size`, {
      params: { category_id: catId, bracket_type: type }
    })
    bracketSizeInfo.value = {
      participant_count: response?.participant_count || 0,
      max_bracket_size: response?.max_bracket_size || 0,
      byes: response?.byes || 0,
      synced_teams: response?.synced_teams ?? 0,
      possible_teams: response?.possible_teams ?? 0,
      team_size: response?.team_size ?? 1
    }
    // Auto-select max bracket size as default
    if (bracketSizeInfo.value.max_bracket_size > 0) {
      newBracket.value.bracketSize = bracketSizeInfo.value.max_bracket_size
    }
  } catch (e) {
    bracketSizeInfo.value = { participant_count: 0, max_bracket_size: 0, byes: 0, synced_teams: 0, possible_teams: 0, team_size: 1 }
  } finally {
    loadingBracketSize.value = false
  }
}

watch(
  [() => newBracket.value.categoryId, () => newBracket.value.bracketType],
  () => { fetchBracketSizeInfo() }
)

const searchQuery = ref('')

const fetchEventName = async () => {
  const id = eventId.value
  if (!id) return
  try {
    const response = await get(`/events/${id}`)
    eventName.value = response?.event?.name || response?.name || 'Event'
  } catch (error) {
    console.error('Failed to fetch event:', error)
  }
}

const fetchBrackets = async () => {
  const id = eventId.value
  if (!id) return
  loadingBrackets.value = true
  try {
    const response = await get(`/events/${id}/elimination/brackets`)
    brackets.value = response?.brackets || []
  } catch (error) {
    console.error('Failed to fetch brackets:', error)
    brackets.value = []
  } finally {
    loadingBrackets.value = false
  }
}

const fetchCategories = async () => {
  const id = eventId.value
  if (!id) return
  loadingCategories.value = true
  try {
    // Fetch all categories (increased limit from default 10)
    const response = await get(`/events/${id}/categories`, { params: { limit: 1000 } })
    const fetchedCategories = response?.events || response.data?.events || response?.categories || response.data?.categories || []
    categories.value = fetchedCategories
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    categories.value = []
  } finally {
    loadingCategories.value = false
  }
}

function parseBracketDatetime(isoOrNull, defaultTime = defaultStartTime) {
  if (!isoOrNull) return { date: defaultStartDate(), time: defaultTime }
  const d = new Date(isoOrNull)
  if (isNaN(d.getTime())) return { date: defaultStartDate(), time: defaultTime }
  const date = d.toISOString().slice(0, 10)
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return { date, time }
}

const openEditBracket = (bracket) => {
  editBracketId.value = bracket.id || bracket.uuid
  const start = parseBracketDatetime(bracket.start_time, defaultStartTime)
  const end = parseBracketDatetime(bracket.end_time, defaultEndTime)
  bracketSizeInfo.value = { participant_count: 0, bracket_size: bracket.bracket_size, byes: 0 }
  newBracket.value = {
    categoryId: bracket.category_id,
    bracketType: bracket.bracket_type,
    format: bracket.format,
    bracketSize: bracket.bracket_size,
    endsPerMatch: bracket.ends_per_match,
    arrowsPerEnd: bracket.arrows_per_end,
    startDate: start.date,
    startTime: start.time,
    endDate: end.date,
    endTime: end.time
  }
  showCreateDialog.value = true
}

const handleCreateOrUpdate = async () => {
  if (isEditing.value) {
    await updateBracket()
  } else {
    await createBracket()
  }
}

const updateBracket = async () => {
  creatingBracket.value = true
  try {
    const payload = {
      category_id: newBracket.value.categoryId,
      bracket_type: newBracket.value.bracketType,
      format: newBracket.value.format,
      ends_per_match: newBracket.value.endsPerMatch,
      arrows_per_end: newBracket.value.arrowsPerEnd
    }
    const startDt = toDatetimeISO(newBracket.value.startDate, newBracket.value.startTime)
    const endDt = toDatetimeISO(newBracket.value.endDate, newBracket.value.endTime)
    if (startDt) payload.start_time = startDt
    if (endDt) payload.end_time = endDt
    const response = await put(`/events/${eventId.value}/elimination/brackets/${editBracketId.value}`, payload)

    toast.success(t('event_elimination.toast_bracket_updated'))
    showCreateDialog.value = false
    resetForm()
    await fetchBrackets()
  } catch (error) {
    console.error('Failed to update bracket:', error)
    const data = error?.data || error?.response?.data
    const msg = data?.error || t('event_elimination.toast_bracket_update_failed')
    toast.error(msg)
  } finally {
    creatingBracket.value = false
  }
}

const resetForm = () => {
  editBracketId.value = null
  bracketSizeInfo.value = { participant_count: 0, max_bracket_size: 0, byes: 0, synced_teams: 0, possible_teams: 0, team_size: 1 }
  newBracket.value = {
    categoryId: '',
    bracketType: 'individual',
    format: 'recurve_set',
    bracketSize: 0,
    endsPerMatch: 5,
    arrowsPerEnd: 3,
    startDate: defaultStartDate(),
    startTime: defaultStartTime,
    endDate: defaultStartDate(),
    endTime: defaultEndTime
  }
}

function toDatetimeISO(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null
  return `${dateStr}T${timeStr}:00`
}

const createBracket = async () => {
  if (!newBracket.value.categoryId) {
    toast.warning(t('event_elimination.toast_select_category_first'))
    return
  }
  if (bracketSizeDropdownOptions.value.length === 0) {
    toast.warning(t('event_elimination.toast_no_participants_category'))
    return
  }

  creatingBracket.value = true
  try {
    const payload = {
      category_id: newBracket.value.categoryId,
      bracket_type: newBracket.value.bracketType,
      format: newBracket.value.format,
      bracket_size: newBracket.value.bracketSize,
      ends_per_match: newBracket.value.endsPerMatch,
      arrows_per_end: newBracket.value.arrowsPerEnd
    }
    const startDt = toDatetimeISO(newBracket.value.startDate, newBracket.value.startTime)
    const endDt = toDatetimeISO(newBracket.value.endDate, newBracket.value.endTime)
    if (startDt) payload.start_time = startDt
    if (endDt) payload.end_time = endDt
    const response = await post(`/events/${eventId.value}/elimination/brackets`, payload)

    if (response?.bracket?.id || response?.id) {
      toast.success(t('event_elimination.toast_bracket_created'))
      showCreateDialog.value = false
      resetForm()
      await fetchBrackets()
    } else {
      toast.error(t('event_elimination.toast_bracket_create_failed'))
    }
  } catch (error) {
    console.error('Failed to create bracket:', error)
    const data = error?.data || error?.response?.data
    let msg = data?.error || t('event_elimination.toast_bracket_create_failed')
    if (data?.participant_count != null && data?.required != null) {
      msg = `${data.error} (${t('event_elimination.available')} ${data.participant_count}, ${t('event_elimination.required_count')} ${data.required})`
    }
    toast.error(msg)
  } finally {
    creatingBracket.value = false
  }
}

const confirmDeleteBracket = (bracket) => {
  bracketToDelete.value = bracket
  showDeleteDialog.value = true
}

const handleDeleteBracket = async () => {
  if (!bracketToDelete.value) return

  savingDelete.value = true
  try {
    await del(`/events/${eventId.value}/elimination/brackets/${bracketToDelete.value.uuid || bracketToDelete.value.id}`)
    toast.success(t('event_elimination.toast_bracket_deleted'))
    showDeleteDialog.value = false
    bracketToDelete.value = null
    await fetchBrackets()
    await fetchCategories()
  } catch (error) {
    console.error('Failed to delete bracket:', error)
    toast.error(t('event_elimination.toast_bracket_delete_failed'))
  } finally {
    savingDelete.value = false
  }
}

const bracketTypes = computed(() => [
  { value: 'individual', title: computed(() => t('event_detail.individual')) || 'Perorangan', icon: 'ph:user' },
  { value: 'team3', title: computed(() => t('event_detail.team3')) || 'Tim 3 Orang', icon: 'ph:users-three' },
  { value: 'mixed2', title: computed(() => t('event_detail.mixed2')) || 'Tim Campuran 2 Orang', icon: 'ph:gender-intersex' }
])

const availableBracketTypes = computed(() => {
  const selectedCat = categories.value.find(c => c.id === newBracket.value.categoryId)
  if (!selectedCat) return bracketTypes.value

  const eventType = (selectedCat.event_type_name || '').toLowerCase()

  if (eventType === 'individual') {
    return bracketTypes.value.filter(t => t.value === 'individual')
  } else if (eventType.includes('team') || eventType.includes('berregu') || eventType.includes('campuran') || eventType.includes('mixed')) {
    return bracketTypes.value.filter(t => t.value !== 'individual')
  }

  return bracketTypes.value
})

const categoryOptions = computed(() => {
  return categories.value.map(cat => ({
    value: cat.id,
    title: getCategoryName(cat)
  }))
})

const formatOptions = [
  { value: 'recurve_set', title: 'Set System' },
  { value: 'compound_total', title: 'Total Score' }
]

// Generate all valid power-of-2 bracket size options from 4 up to max_bracket_size
const bracketSizeDropdownOptions = computed(() => {
  const max = bracketSizeInfo.value.max_bracket_size
  if (!max || max < 4) return []
  const opts = []
  for (let s = 4; s <= max; s *= 2) {
    opts.push({ value: s, title: `${s} Slot` })
  }
  return opts
})

// Dynamic hint shown below the bracket size dropdown
const selectedBracketHint = computed(() => {
  const size = newBracket.value.bracketSize
  const count = bracketSizeInfo.value.participant_count
  const synced = bracketSizeInfo.value.synced_teams
  const possible = bracketSizeInfo.value.possible_teams
  const isTeam = newBracket.value.bracketType !== 'individual'
  if (!size || !count) return { text: '', isEstimate: false }

  if (size >= count) {
    const byes = size - count
    if (isTeam && synced === 0 && possible > 0) {
      return { text: t('event_elimination.hint_team_potential', { count, byes }), isEstimate: true }
    }
    return { text: t('event_elimination.hint_peserta_bye', { count, byes }), isEstimate: false }
  } else {
    // bracket smaller than count: only top N qualify
    const label = isTeam ? t('event_elimination.team') : t('event_elimination.participant')
    if (isTeam && synced === 0 && possible > 0) {
      return { text: t('event_elimination.hint_top_potential', { size, count, label }), isEstimate: true }
    }
    return { text: t('event_elimination.hint_top_ranking', { size, count, label }), isEstimate: false }
  }
})

const categoriesWithoutBracket = computed(() => {
  const bracketCatIds = brackets.value.map(b => b.category_id)
  return categories.value.filter(c => !bracketCatIds.includes(c.id))
})

const filteredCategoriesWithoutBracket = computed(() => {
  if (!searchQuery.value) return categoriesWithoutBracket.value
  const q = searchQuery.value.toLowerCase()
  return categoriesWithoutBracket.value.filter(cat => {
    const name = getCategoryName(cat).toLowerCase()
    return name.includes(q)
  })
})


const openCreateForCategory = (category) => {
  newBracket.value.categoryId = category.id
  // Auto-set the bracket type
  const eventType = (category.event_type_name || '').toLowerCase()
  if (eventType === 'individual') {
    newBracket.value.bracketType = 'individual'
  } else if (eventType.includes('mixed') || eventType.includes('campuran')) {
    newBracket.value.bracketType = 'mixed2'
  } else {
    newBracket.value.bracketType = 'team3'
  }
  showCreateDialog.value = true
}

const getBracketName = (bracket) => {
  // Use category_name from API response if available
  if (bracket.category_name) {
    return bracket.category_name
  }
  // Fallback to matching with categories
  const category = categories.value.find(c => c.id === bracket.category_id)
  return getCategoryName(category) || `Bracket ${bracket.id}`
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

const getFormatLabel = (format) => {
  const labels = {
    recurve_set: 'Set System',
    compound_total: 'Total Score'
  }
  return labels[format] || format
}

const getBracketTypeLabel = (type) => {
  const labels = {
    individual: t('event_detail.individual') || 'Perorangan',
    team3: t('event_detail.team3') || 'Tim 3 Orang',
    mixed2: t('event_detail.mixed2') || 'Tim Campuran 2 Orang'
  }
  return labels[type] || type
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const loadPageData = () => {
  if (!eventId.value) return
  Promise.all([fetchEventName(), fetchBrackets(), fetchCategories()])
}

// Re-fetch whenever we're on this page (including when returning via browser back / touchpad back)
watch(
  () => [route.params.id, route.params.bracketId],
  ([id, bracketId]) => {
    if (import.meta.client && id && bracketId === undefined) loadPageData()
  },
  { immediate: true }
)

// Re-fetch when page is restored from bfcache (browser back can restore cached page without re-mounting)
const onPageShow = (event) => {
  if (event.persisted) loadPageData()
}

// Fallback: re-fetch when tab/window becomes visible (handles some SSR/back edge cases)
const onVisibilityChange = () => {
  if (document.visibilityState === 'visible' && eventId.value && route.params.bracketId === undefined) {
    loadPageData()
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('pageshow', onPageShow)
    document.addEventListener('visibilitychange', onVisibilityChange)
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('pageshow', onPageShow)
    document.removeEventListener('visibilitychange', onVisibilityChange)
  }
})
</script>

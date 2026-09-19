<template>
    <div class="space-y-6">
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />
        
        <!-- Session Lock / Unlock Confirmation Dialog -->
        <AppDialog
            v-model:show="showLockConfirmDialog"
            :title="isSessionLocked ? t('event_qualification.unlock_session_title', 'Buka Kunci Sesi Penilaian?') : t('event_qualification.lock_session_title', 'Kunci Sesi Penilaian?')"
            :message="isSessionLocked ? t('event_qualification.unlock_session_desc', 'Sesi penilaian akan dibuka kembali. Scorekeeper dan panitia dapat menginput atau mengubah skor kualifikasi.') : t('event_qualification.lock_session_desc', 'Setelah dikunci, input dan perubahan skor pada sesi ini tidak dapat dilakukan hingga kunci dibuka kembali.')"
            :confirmText="isSessionLocked ? t('event_qualification.confirm_unlock_btn', 'Buka Kunci') : t('event_qualification.confirm_lock_btn', 'Kunci Sesi')"
            :cancelText="t('common.cancel', 'Batal')"
            :icon="isSessionLocked ? 'ph:lock-open-bold' : 'ph:lock-bold'"
            :type="isSessionLocked ? 'primary' : 'danger'"
            @confirm="executeToggleSessionLock"
        />

        <!-- Top Target Board Quick Switcher & Stats Bar -->
        <div v-if="selectedCategory && targetAssignments.length > 0"
            class="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <!-- Left: Title & Live Summary -->
                <div class="flex items-center gap-3">
                    <div class="size-10 rounded-xl bg-navy text-primary flex items-center justify-center shadow-2xs shrink-0 font-black">
                        <Icon icon="ph:crosshair-bold" class="text-xl" />
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h3 class="text-base sm:text-lg font-black text-navy leading-tight">
                                {{ t('event_qualification.input_scoring', 'Input Nilai Kualifikasi') }}
                            </h3>
                            <span class="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-mono">
                                {{ targetAssignments.length }} {{ t('event_qualification.archers', 'Pemanah') }}
                            </span>
                        </div>
                        <p class="text-xs text-slate-500 font-medium mt-0.5">
                            {{ t('event_qualification.scoring_subtitle', 'Pilih pemanah dan masukkan perolehan skor panah per rambahan (End).') }}
                        </p>
                    </div>
                </div>

                <!-- Right: Quick Target Search / Filter & Lock Button -->
                <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <div class="relative w-full sm:w-60">
                        <input v-model="searchArcherQuery" type="text"
                            :placeholder="t('event_qualification.search_archer_target', 'Cari pemanah / bantalan...')"
                            class="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy placeholder:text-slate-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" />
                        <Icon icon="ph:magnifying-glass-bold" class="absolute left-3 top-3 text-slate-400 text-sm" />
                        <button v-if="searchArcherQuery" @click="searchArcherQuery = ''"
                            class="absolute right-2.5 top-2.5 size-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] hover:bg-slate-300">
                            <Icon icon="ph:x-bold" />
                        </button>
                    </div>

                    <!-- Lock / Unlock Session Switcher -->
                    <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 shrink-0 select-none shadow-2xs">
                        <div class="flex items-center gap-1.5">
                            <Icon :icon="isSessionLocked ? 'ph:lock-key-fill' : 'ph:lock-key-open-bold'"
                                :class="isSessionLocked ? 'text-rose-600' : 'text-slate-500'"
                                class="text-sm transition-colors" />
                            <span class="text-xs font-bold"
                                :class="isSessionLocked ? 'text-rose-700 font-black' : 'text-slate-600'">
                                {{ isSessionLocked ? t('event_qualification.session_locked', 'Terkunci') : t('event_qualification.session_unlocked', 'Terbuka') }}
                            </span>
                        </div>

                        <!-- Switch Toggle Button -->
                        <button type="button" role="switch" :aria-checked="isSessionLocked"
                            @click="isSubscriptionActive ? promptToggleLock() : (showPremiumModal = true)"
                            :class="[
                                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                                isSessionLocked ? 'bg-rose-600' : 'bg-slate-300 hover:bg-slate-400'
                            ]"
                            :title="isSessionLocked ? t('event_qualification.unlock_session_title', 'Buka Kunci Sesi Penilaian?') : t('event_qualification.lock_session_title', 'Kunci Sesi Penilaian?')">
                            <span
                                :class="[
                                    'pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[10px]',
                                    isSessionLocked ? 'translate-x-5 text-rose-600' : 'translate-x-0 text-slate-400'
                                ]">
                                <Icon :icon="isSessionLocked ? 'ph:lock-fill' : 'ph:lock-open-bold'" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Target Board Filter Pills -->
            <div v-if="availableTargetNumbers.length > 1" class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-slate-100 pt-3">
                <button type="button" @click="selectedTargetFilter = null"
                    :class="[
                        'px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs',
                        selectedTargetFilter === null
                            ? 'bg-navy text-primary shadow-xs'
                            : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200 hover:text-navy'
                    ]">
                    <Icon icon="ph:squares-four-bold" class="text-sm" />
                    <span>{{ t('event_qualification.all_targets', 'Semua Target') }} ({{ targetAssignments.length }})</span>
                </button>

                <button v-for="tNum in availableTargetNumbers" :key="tNum" type="button"
                    @click="selectedTargetFilter = tNum"
                    :class="[
                        'px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs',
                        selectedTargetFilter === tNum
                            ? 'bg-navy text-primary shadow-xs'
                            : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200 hover:text-navy'
                    ]">
                    <Icon icon="ph:target-bold" class="text-xs" />
                    <span>{{ t('event_qualification.target_label', { number: tNum }, 'Target ' + tNum) }}</span>
                    <span v-if="getTargetArcherCount(tNum)" class="text-[10px] opacity-75 font-mono">
                        ({{ getTargetArcherCount(tNum) }})
                    </span>
                </button>
            </div>
        </div>

        <!-- Scoring Main Interface -->
        <div v-if="selectedCategory && targetAssignments.length > 0"
            class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <!-- Left Column: Archers List Cards -->
            <div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-6"
                :class="showMobileInputBoard && currentScoringAssignment ? 'pb-[280px] lg:pb-0' : ''">
                
                <div v-for="group in filteredGroupedAssignments" :key="group.number" class="space-y-3">
                    
                    <!-- Target Section Header -->
                    <div class="flex items-center justify-between gap-3 px-1">
                        <div class="flex items-center gap-2">
                            <span class="size-6 rounded-lg bg-navy text-white text-xs font-black flex items-center justify-center shadow-2xs">
                                {{ group.number }}
                            </span>
                            <span class="text-sm font-black text-navy tracking-tight">
                                {{ t('event_qualification.target_board', { number: group.number }, 'Bantalan Target ' + group.number) }}
                            </span>
                        </div>
                        <span class="text-[11px] font-bold text-slate-400">
                            {{ group.assignments.length }} {{ t('event_qualification.archers', 'Pemanah') }}
                        </span>
                    </div>

                    <!-- Archer Cards List -->
                    <div class="grid grid-cols-1 gap-3.5">
                        <div v-for="assignment in group.assignments" :key="assignment.uuid"
                            @click="selectArcherForScoring(assignment)"
                            :class="[
                                'rounded-2xl transition-all cursor-pointer relative overflow-hidden bg-white select-none',
                                currentScoringAssignment?.uuid === assignment.uuid
                                    ? 'border-2 border-navy shadow-xs ring-2 ring-navy/10'
                                    : 'border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs'
                            ]">

                            <div class="p-4 sm:p-5 space-y-4">
                                <!-- Archer Profile & Overall Score Row -->
                                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div class="flex items-center gap-3.5 min-w-0">
                                        <!-- Avatar -->
                                        <div class="relative shrink-0">
                                            <div class="size-11 sm:size-12 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shadow-2xs">
                                                <img :src="useImageOrDefault(assignment.archer_avatar_url || assignment.avatar_url, assignment.archer_name)"
                                                    :alt="assignment.archer_name"
                                                    class="size-full object-cover" />
                                            </div>
                                            <!-- Target Position Badge -->
                                            <span class="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-navy text-primary text-[10px] font-black font-mono border border-white shadow-xs">
                                                {{ assignment.target_name }}
                                            </span>
                                        </div>

                                        <!-- Archer Name & Club -->
                                        <div class="min-w-0 flex-1">
                                            <div class="flex items-center gap-2">
                                                <h4 class="text-sm sm:text-base font-black text-navy leading-tight truncate">
                                                    {{ assignment.archer_name }}
                                                </h4>
                                                <span v-if="currentScoringAssignment?.uuid === assignment.uuid"
                                                    class="inline-flex items-center px-1.5 py-0.2 rounded-md bg-primary/20 text-navy text-[10px] font-bold shrink-0 border border-primary/40">
                                                    {{ t('event_qualification.active_status', 'Aktif') }}
                                                </span>
                                            </div>
                                            <div class="text-xs text-slate-500 font-semibold truncate flex items-center gap-1.5 mt-0.5">
                                                <Icon icon="ph:shield-bold" class="text-slate-400 text-xs shrink-0" />
                                                <span class="truncate">{{ assignment.club_name || assignment.club || t('event_qualification.independent', 'Independen') }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Overall Score & Stat Chips -->
                                    <div class="flex items-center gap-2 shrink-0 self-start sm:self-center">
                                        <!-- Total Score Pill -->
                                        <div class="px-3 py-1.5 rounded-xl bg-navy text-white text-right border border-navy/80 shadow-2xs flex items-center gap-2">
                                            <span class="text-[11px] font-medium text-slate-300">{{ t('event_qualification.total_score', 'Total') }}</span>
                                            <span class="text-sm sm:text-base font-black text-primary font-mono leading-none">
                                                {{ calculateTotalScore(assignment.allEndScores, assignment.currentEndScores, assignment.currentEnd) }}
                                            </span>
                                        </div>

                                        <!-- 10s & Xs Badges -->
                                        <div class="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-2 font-mono">
                                            <span title="Total X">X: <strong class="text-navy font-black">{{ calculateXs(assignment.allEndScores, assignment.currentEndScores, assignment.currentEnd) }}</strong></span>
                                            <span class="text-slate-300">|</span>
                                            <span title="Total 10">10: <strong class="text-navy font-black">{{ calculateTens(assignment.allEndScores, assignment.currentEndScores, assignment.currentEnd) }}</strong></span>
                                        </div>
                                    </div>
                                </div>

                                <div class="h-px bg-slate-100"></div>

                                <!-- End Selector & Active End Score Boxes -->
                                <div class="space-y-3">
                                    <!-- End Sub-header & Navigation -->
                                    <div class="flex items-center justify-between gap-2">
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs font-black text-navy flex items-center gap-1.5">
                                                <Icon icon="ph:arrow-clockwise-bold" class="text-primary text-sm" />
                                                End {{ assignment.currentEnd || 1 }} / {{ sessionData?.total_ends || 0 }}
                                            </span>
                                            
                                            <!-- End Quick Switcher Buttons (for this archer) -->
                                            <div class="hidden sm:flex items-center gap-1 ml-2">
                                                <button v-for="endNum in (sessionData?.total_ends || 0)" :key="endNum"
                                                    type="button"
                                                    @click.stop="switchArcherEnd(assignment, endNum)"
                                                    :class="[
                                                        'size-6 rounded-lg text-[10px] font-black transition-all flex items-center justify-center cursor-pointer',
                                                        (assignment.currentEnd || 1) === endNum
                                                            ? 'bg-navy text-primary shadow-2xs'
                                                            : (isEndComplete(assignment, endNum)
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200')
                                                    ]">
                                                    {{ endNum }}
                                                </button>
                                            </div>
                                        </div>

                                        <!-- End Total Badge -->
                                        <div class="flex items-center gap-2">
                                            <span class="text-[11px] font-semibold text-slate-500">{{ t('event_qualification.end_score_label', { end: assignment.currentEnd || 1 }, 'Skor End ' + (assignment.currentEnd || 1) + ':') }}</span>
                                            <span class="text-xs font-black text-navy bg-slate-100 px-2.5 py-0.5 rounded-lg font-mono">
                                                {{ calculateEndSum(assignment.currentEndScores) }} pts
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Arrows Matrix (Target Face Colored Rings) -->
                                    <div class="flex flex-wrap items-center gap-2 sm:gap-2.5">
                                        <div v-for="(arrowVal, i) in (sessionData?.arrows_per_end || 6)" :key="i"
                                            @click.stop="isSubscriptionActive ? selectArrowBox(assignment, i) : (showPremiumModal = true)"
                                            :class="[
                                                'size-10 sm:size-12 rounded-xl flex items-center justify-center text-sm sm:text-base font-black cursor-pointer transition-all duration-150 relative select-none font-mono',
                                                currentScoringAssignment?.uuid === assignment.uuid && selectedArrowIndex === i
                                                    ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-white border-2 border-amber-500 scale-105 z-10 shadow-xs'
                                                    : 'border',
                                                getArrowRingClass(assignment.currentEndScores?.[i])
                                            ]">
                                            
                                            <!-- Arrow Value Display -->
                                            <span v-if="assignment.currentEndScores?.[i] !== undefined && assignment.currentEndScores?.[i] !== null && assignment.currentEndScores?.[i] !== ''">
                                                {{ assignment.currentEndScores[i] }}
                                            </span>

                                            <!-- Active Editing Cursor Indicator -->
                                            <div v-if="currentScoringAssignment?.uuid === assignment.uuid && selectedArrowIndex === i"
                                                class="absolute -top-1 -right-1 size-2.5 bg-amber-500 rounded-full border border-white shadow-xs"></div>

                                            <!-- Empty Dot -->
                                            <div v-if="(assignment.currentEndScores?.[i] === undefined || assignment.currentEndScores?.[i] === null || assignment.currentEndScores?.[i] === '') && !(currentScoringAssignment?.uuid === assignment.uuid && selectedArrowIndex === i)"
                                                class="size-1.5 rounded-full bg-slate-300"></div>
                                        </div>

                                        <!-- End Sum Box -->
                                        <div class="ml-auto shrink-0 flex items-center gap-1.5 pl-2">
                                            <div class="h-10 sm:h-12 px-3 rounded-xl bg-slate-100 text-navy border border-slate-200/90 flex flex-col items-center justify-center shadow-2xs min-w-[52px]">
                                                <span class="text-[9px] text-slate-500 font-bold leading-none">{{ t('event_qualification.end_single', 'End') }}</span>
                                                <span class="text-sm sm:text-base font-black text-navy font-mono leading-tight">
                                                    {{ calculateEndSum(assignment.currentEndScores) }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State if no assignments match search -->
                <div v-if="filteredGroupedAssignments.length === 0"
                    class="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
                    <div class="size-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <Icon icon="ph:user-minus-bold" class="text-xl" />
                    </div>
                    <div>
                        <h4 class="text-sm font-black text-navy">{{ t('event_qualification.no_matching_archers', 'Tidak ada pemanah yang cocok') }}</h4>
                        <p class="text-xs text-slate-500 mt-0.5">{{ t('event_qualification.no_matching_archers_desc', 'Coba ubah kata kunci pencarian atau filter bantalan target.') }}</p>
                    </div>
                </div>
            </div>

            <!-- Right Column: Keypad Controller (Sticky on Desktop) -->
            <div class="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-6">
                <div class="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
                    
                    <!-- Controller Header -->
                    <div class="relative bg-gradient-to-r from-navy via-navy to-navy/90 text-white p-5 overflow-hidden">
                        <div class="absolute inset-0 opacity-15 pointer-events-none"
                            style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.15);"></div>

                        <div class="relative z-10 space-y-3">
                            <div class="flex items-center justify-between gap-2">
                                <div class="flex items-center gap-2">
                                    <Icon icon="ph:keypad-bold" class="text-primary text-base" />
                                    <span class="text-xs font-black text-white">{{ t('event_qualification.scorecard_keypad', 'Papan Skor') }}</span>
                                </div>
                                <span v-if="currentScoringAssignment"
                                    class="text-[10px] font-black bg-white/15 px-2 py-0.5 rounded-md font-mono text-primary">
                                    {{ currentScoringAssignment.target_name }}
                                </span>
                            </div>

                            <!-- Active Archer Details -->
                            <div v-if="currentScoringAssignment" class="flex items-center gap-3">
                                <div class="size-11 rounded-xl border border-white/20 overflow-hidden bg-white/10 shrink-0">
                                    <img :src="useImageOrDefault(currentScoringAssignment.archer_avatar_url || currentScoringAssignment.avatar_url, currentScoringAssignment.archer_name)"
                                        class="size-full object-cover" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h4 class="text-sm font-black text-white truncate leading-tight">
                                        {{ currentScoringAssignment.archer_name }}
                                    </h4>
                                    <div class="text-[11px] text-slate-300 font-semibold truncate mt-0.5">
                                        {{ currentScoringAssignment.club_name || currentScoringAssignment.club || t('event_qualification.independent', 'Independen') }}
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-xs text-slate-400 font-medium">
                                {{ t('event_qualification.click_archer_to_score', 'Klik salah satu pemanah untuk menginput nilai.') }}
                            </div>

                            <!-- Active End Stepper Switcher -->
                            <div v-if="currentScoringAssignment"
                                class="flex items-center justify-between p-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                                <button type="button" @click.stop="goPrevEnd"
                                    :disabled="(currentScoringAssignment.currentEnd || 1) <= 1"
                                    class="size-8 rounded-lg bg-white/15 hover:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors cursor-pointer">
                                    <Icon icon="ph:caret-left-bold" class="text-sm" />
                                </button>
                                
                                <div class="text-center">
                                    <div class="text-[10px] font-semibold text-slate-300 leading-none">{{ t('event_qualification.active_end', 'End Aktif') }}</div>
                                    <div class="text-sm font-black text-primary font-mono leading-tight mt-0.5">
                                        End {{ currentScoringAssignment.currentEnd || 1 }} / {{ sessionData?.total_ends || 0 }}
                                    </div>
                                </div>

                                <button type="button" @click.stop="goNextEnd"
                                    :disabled="(currentScoringAssignment.currentEnd || 1) >= (sessionData?.total_ends || 0)"
                                    class="size-8 rounded-lg bg-white/15 hover:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors cursor-pointer">
                                    <Icon icon="ph:caret-right-bold" class="text-sm" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Keypad Body -->
                    <div class="p-4 sm:p-5 space-y-4">
                        <!-- Score Matrix Keys Grid -->
                        <div class="grid grid-cols-4 gap-2">
                            <button v-for="val in ['X', 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 'M']" :key="val"
                                type="button"
                                @click="isSubscriptionActive ? addScore(val) : (showPremiumModal = true)"
                                :disabled="!currentScoringAssignment"
                                :class="[
                                    'h-12 rounded-xl text-base font-black transition-all duration-100 flex items-center justify-center border-b-2 active:border-b-0 active:translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed select-none font-mono shadow-2xs cursor-pointer',
                                    getKeypadRingClass(val)
                                ]">
                                {{ val }}
                            </button>
                        </div>

                        <!-- Action Buttons -->
                        <div class="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
                            <BaseButton variant="white" icon="ph:backspace-bold"
                                :disabled="!currentScoringAssignment || !currentScoringAssignment.currentEndScores?.some(v => v !== undefined && v !== null && v !== '')"
                                class="h-11 !rounded-xl border-slate-200 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-200 font-bold text-xs"
                                @click="isSubscriptionActive ? deleteLastScore() : (showPremiumModal = true)">
                                {{ t('event_qualification.delete_btn', 'Hapus') }}
                            </BaseButton>

                            <BaseButton variant="primary" iconRight="ph:paper-plane-right-fill"
                                :disabled="saving || !currentScoringAssignment" :loading="saving"
                                class="h-11 !rounded-xl font-black text-xs shadow-xs"
                                @click="isSubscriptionActive ? saveEndAndNext() : (showPremiumModal = true)">
                                {{ t('event_qualification.save_end_btn', 'Simpan End') }}
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Sticky Scoring Drawer -->
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-full opacity-0"
            enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in"
            leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-full opacity-0">
            <div v-if="showMobileInputBoard && currentScoringAssignment"
                class="lg:hidden fixed inset-x-0 bottom-0 z-[70] bg-white border-t border-slate-200 shadow-2xl rounded-t-3xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] space-y-3">
                
                <div class="flex items-center justify-between">
                    <div class="min-w-0">
                        <div class="text-[11px] font-semibold text-slate-500">
                            {{ t('event_qualification.input_scoring', 'Input Skor') }} • End {{ currentScoringAssignment?.currentEnd || 1 }}
                        </div>
                        <div class="text-sm font-black text-navy truncate">
                            {{ currentScoringAssignment?.archer_name }} ({{ currentScoringAssignment?.target_name }})
                        </div>
                    </div>
                    <BaseButton variant="white" size="sm" icon="ph:x-bold" class="!size-8 !p-0 !rounded-xl"
                        @click="closeMobileInputBoard" />
                </div>

                <!-- Mobile Keypad Grid -->
                <div class="grid grid-cols-4 gap-2">
                    <button v-for="val in ['X', 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 'M']" :key="val"
                        type="button"
                        @click="isSubscriptionActive ? addScore(val) : (showPremiumModal = true)"
                        :disabled="!currentScoringAssignment"
                        :class="[
                            'h-11 rounded-xl text-sm font-black transition-all flex items-center justify-center border-b-2 active:border-b-0 active:translate-y-0.5 disabled:opacity-30 select-none font-mono shadow-2xs',
                            getKeypadRingClass(val)
                        ]">
                        {{ val }}
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-2">
                    <BaseButton variant="white" icon="ph:backspace-bold"
                        :disabled="!currentScoringAssignment || !currentScoringAssignment.currentEndScores?.some(v => v !== undefined && v !== null && v !== '')"
                        class="h-11 !rounded-xl border border-slate-200 font-bold text-xs"
                        @click="isSubscriptionActive ? deleteLastScore() : (showPremiumModal = true)">
                        {{ t('event_qualification.delete_btn', 'Hapus') }}
                    </BaseButton>
                    <BaseButton variant="primary" :disabled="saving || !currentScoringAssignment" :loading="saving"
                        class="h-11 !rounded-xl font-black text-xs"
                        @click="isSubscriptionActive ? saveEndAndNext() : (showPremiumModal = true)">
                        {{ t('event_qualification.save_btn', 'Simpan') }}
                    </BaseButton>
                </div>
            </div>
        </Transition>

        <!-- Empty State: No Category Selected -->
        <div v-if="!selectedCategory"
            class="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center flex flex-col items-center justify-center space-y-4 shadow-2xs">
            <div class="size-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Icon icon="ph:cursor-click-bold" class="text-3xl" />
            </div>
            <div>
                <h3 class="text-base font-black text-navy">{{ t('event_qualification.category_not_selected', 'Kategori Belum Dipilih') }}</h3>
                <p class="text-xs text-slate-500 font-medium max-w-sm mx-auto mt-1">
                    {{ t('event_qualification.choose_category_to_manage', 'Silakan pilih salah satu kategori di atas untuk mulai mengelola sesi.') }}
                </p>
            </div>
        </div>

        <!-- Empty State: Category Selected but No Target Assignments yet -->
        <div v-else-if="targetAssignments.length === 0"
            class="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 sm:p-16 text-center flex flex-col items-center justify-center space-y-5 shadow-2xs">
            <div class="relative">
                <div class="size-18 rounded-3xl bg-navy text-primary flex items-center justify-center shadow-lg shadow-navy/15">
                    <Icon icon="ph:target-bold" class="text-4xl" />
                </div>
                <div class="absolute -bottom-1 -right-1 size-6 rounded-xl bg-amber-400 text-navy flex items-center justify-center border-2 border-white shadow-xs">
                    <Icon icon="ph:warning-bold" class="text-xs" />
                </div>
            </div>

            <div class="max-w-md space-y-2">
                <h3 class="text-lg font-black text-navy leading-tight">
                    {{ t('event_qualification.no_assignments_title', 'Belum Ada Penempatan Target') }}
                </h3>
                <p class="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                    {{ t('event_qualification.no_assignments_desc', 'Pemanah pada kategori ini belum ditempatkan ke nomor bantalan target kualifikasi. Silakan atur penempatan target terlebih dahulu sebelum memulai input nilai.') }}
                </p>
            </div>

            <div class="pt-1">
                <button type="button" @click="emit('switch-tab', 'target')"
                    class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy hover:bg-primary text-primary hover:text-navy text-xs font-black transition-all shadow-md shadow-navy/10 active:scale-95 cursor-pointer">
                    <Icon icon="ph:target-bold" class="text-base" />
                    <span>{{ t('event_qualification.switch_to_target_assignment', 'Atur Penempatan Target') }}</span>
                    <Icon icon="ph:arrow-right-bold" class="text-xs" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { useApi, getApiErrorMessage } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useSubscription } from '~/composables/useSubscription'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'
import AppDialog from '~/components/common/AppDialog.vue'

const { isSubscriptionActive } = useSubscription()
const { t } = useI18n()
const showPremiumModal = ref(false)

const props = defineProps({
    sessionData: { type: Object, required: true },
    selectedCategory: { type: String, required: true },
    targetAssignments: { type: Array, default: () => [] }
})

const emit = defineEmits(['updated', 'switch-tab'])

const { post } = useApi()
const toast = useToast()
const route = useRoute()

const saving = ref(false)
const localAssignments = ref([])
const currentScoringArcherUuid = ref(null)
const currentScoringAssignment = computed(() => {
    if (!localAssignments.value.length) return null
    if (currentScoringArcherUuid.value) {
        const found = localAssignments.value.find(a => a.uuid === currentScoringArcherUuid.value)
        if (found) return found
    }
    return localAssignments.value[0] || null
})
const selectedArrowIndex = ref(0)
const showMobileInputBoard = ref(false)
const searchArcherQuery = ref('')
const selectedTargetFilter = ref(null)

const isSessionLocked = computed(() => Boolean(props.sessionData?.is_locked))
const showLockConfirmDialog = ref(false)

const promptToggleLock = () => {
    showLockConfirmDialog.value = true
}

const executeToggleSessionLock = async () => {
    try {
        const sessionId = props.sessionData?.uuid || props.sessionData?.id
        const eventId = route.params.id
        const res = await post(`/tournaments/${eventId}/qualification/sessions/${sessionId}/lock`, {})
        if (res) {
            props.sessionData.is_locked = res.is_locked
            if (res.is_locked) {
                toast.success(t('event_qualification.session_locked_success', 'Sesi penilaian berhasil dikunci'))
            } else {
                toast.success(t('event_qualification.session_unlocked_success', 'Kunci sesi penilaian berhasil dibuka'))
            }
            emit('updated')
        }
    } catch (err) {
        toast.error(getApiErrorMessage(err, t('event_qualification.session_lock_failed', 'Gagal mengubah status kunci sesi')))
    }
}

// Ensures currentEndScores array always has length exactly equal to arrows_per_end
const ensureEndScoresArray = (assignment) => {
    if (!assignment) return
    const arrowsPerEnd = props.sessionData?.arrows_per_end || 6
    if (!assignment.currentEndScores || !Array.isArray(assignment.currentEndScores)) {
        assignment.currentEndScores = Array.from({ length: arrowsPerEnd }, () => undefined)
    } else if (assignment.currentEndScores.length < arrowsPerEnd) {
        const newArr = [...assignment.currentEndScores]
        while (newArr.length < arrowsPerEnd) {
            newArr.push(undefined)
        }
        assignment.currentEndScores = newArr
    }
}

const initEndScores = (assignment) => {
    if (!assignment) return
    ensureEndScoresArray(assignment)
    const arrowsPerEnd = props.sessionData?.arrows_per_end || 6
    const emptyIdx = assignment.currentEndScores.findIndex(v => v === undefined || v === null || v === '')
    selectedArrowIndex.value = emptyIdx === -1 ? 0 : emptyIdx
}

const syncCurrentEndScores = () => {
    if (!currentScoringAssignment.value) return
    const assignment = currentScoringAssignment.value
    const currentEndNum = assignment.currentEnd || 1
    if (!assignment.allEndScores) assignment.allEndScores = {}
    if (assignment.currentEndScores) {
        assignment.allEndScores = {
            ...assignment.allEndScores,
            [currentEndNum]: [...assignment.currentEndScores]
        }
    }
}

watch(() => props.targetAssignments, (newVal) => {
    if (newVal?.length > 0) {
        const arrowsPerEnd = props.sessionData?.arrows_per_end || 6
        const mapped = newVal.map(a => {
            const curEnd = a.currentEnd || 1
            const allScores = a.allEndScores ? JSON.parse(JSON.stringify(a.allEndScores)) : {}
            let curScores = a.currentEndScores
            if (!Array.isArray(curScores) || curScores.length === 0) {
                curScores = allScores[curEnd] ? [...allScores[curEnd]] : Array.from({ length: arrowsPerEnd }, () => undefined)
            } else if (curScores.length < arrowsPerEnd) {
                curScores = Array.from({ length: arrowsPerEnd }, (_, i) => curScores[i] !== undefined ? curScores[i] : undefined)
            } else {
                curScores = [...curScores]
            }
            return {
                ...a,
                currentEnd: curEnd,
                currentEndScores: curScores,
                allEndScores: allScores
            }
        })

        const sorted = mapped.sort((a, b) => {
            const numA = parseInt((a.target_name || '').match(/\d+/)?.[0] || 0)
            const numB = parseInt((b.target_name || '').match(/\d+/)?.[0] || 0)
            if (numA !== numB) return numA - numB
            return (a.target_name || '').localeCompare(b.target_name || '')
        })

        localAssignments.value = sorted

        const targetArcherId = route.query.archer
        if (targetArcherId && localAssignments.value.some(a => a.uuid === targetArcherId || a.participant_id === targetArcherId)) {
            const found = localAssignments.value.find(a => a.uuid === targetArcherId || a.participant_id === targetArcherId)
            currentScoringArcherUuid.value = found.uuid
            initEndScores(found)
        } else if (!currentScoringArcherUuid.value || !localAssignments.value.some(a => a.uuid === currentScoringArcherUuid.value)) {
            if (localAssignments.value.length > 0) {
                currentScoringArcherUuid.value = localAssignments.value[0].uuid
                initEndScores(localAssignments.value[0])
            }
        }
    } else {
        localAssignments.value = []
        currentScoringArcherUuid.value = null
    }
}, { immediate: true, deep: true })

const availableTargetNumbers = computed(() => {
    const nums = new Set()
    localAssignments.value.forEach(a => {
        const match = (a.target_name || '').match(/\d+/)
        if (match) nums.add(parseInt(match[0]))
    })
    return Array.from(nums).sort((a, b) => a - b)
})

const getTargetArcherCount = (targetNumber) => {
    return localAssignments.value.filter(a => {
        const match = (a.target_name || '').match(/\d+/)
        return match && parseInt(match[0]) === targetNumber
    }).length
}

const groupedAssignments = computed(() => {
    const groups = {}
    localAssignments.value.forEach(a => {
        const match = (a.target_name || '').match(/\d+/)
        const num = match ? parseInt(match[0]) : 0
        if (!groups[num]) {
            groups[num] = []
        }
        groups[num].push(a)
    })

    return Object.keys(groups)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map(num => ({
            number: num,
            assignments: groups[num].sort((a, b) => (a.target_name || '').localeCompare(b.target_name || ''))
        }))
})

const filteredGroupedAssignments = computed(() => {
    const query = searchArcherQuery.value.trim().toLowerCase()
    const targetFilter = selectedTargetFilter.value

    return groupedAssignments.value
        .filter(group => {
            if (targetFilter !== null && parseInt(group.number) !== targetFilter) {
                return false
            }
            return true
        })
        .map(group => {
            if (!query) return group
            return {
                ...group,
                assignments: group.assignments.filter(a => {
                    const nameMatch = (a.archer_name || '').toLowerCase().includes(query)
                    const clubMatch = (a.club_name || a.club || '').toLowerCase().includes(query)
                    const targetMatch = (a.target_name || '').toLowerCase().includes(query)
                    return nameMatch || clubMatch || targetMatch
                })
            }
        })
        .filter(group => group.assignments.length > 0)
})

const selectArcherForScoring = (assignment) => {
    currentScoringArcherUuid.value = assignment.uuid
    initEndScores(assignment)
    showMobileInputBoard.value = true
}

const selectArrowBox = (assignment, index) => {
    currentScoringArcherUuid.value = assignment.uuid
    ensureEndScoresArray(assignment)
    selectedArrowIndex.value = index
    showMobileInputBoard.value = true
}

const closeMobileInputBoard = () => {
    showMobileInputBoard.value = false
}

const addScore = (score) => {
    if (isSessionLocked.value) {
        toast.warning(t('event_qualification.session_is_locked_warning', 'Sesi penilaian terkunci. Tidak dapat mengubah nilai.'))
        return
    }
    const assignment = currentScoringAssignment.value
    if (!assignment) return
    ensureEndScoresArray(assignment)
    const arrowsPerEnd = props.sessionData?.arrows_per_end || 6

    let idx = selectedArrowIndex.value
    if (idx < 0 || idx >= arrowsPerEnd) {
        idx = 0
    }

    // Direct reactive array reassignment to guarantee instant Vue 3 DOM reactivity
    const newEndScores = [...(assignment.currentEndScores || [])]
    newEndScores[idx] = score
    assignment.currentEndScores = newEndScores

    syncCurrentEndScores()

    if (idx < arrowsPerEnd - 1) {
        selectedArrowIndex.value = idx + 1
    }
}

const deleteLastScore = () => {
    if (isSessionLocked.value) {
        toast.warning(t('event_qualification.session_is_locked_warning', 'Sesi penilaian terkunci. Tidak dapat mengubah nilai.'))
        return
    }
    const assignment = currentScoringAssignment.value
    if (!assignment) return
    ensureEndScoresArray(assignment)
    const scores = assignment.currentEndScores
    if (!scores) return

    const newEndScores = [...scores]

    // 1. If currently selected slot has a value, clear it
    if (newEndScores[selectedArrowIndex.value] !== undefined && newEndScores[selectedArrowIndex.value] !== null && newEndScores[selectedArrowIndex.value] !== '') {
        newEndScores[selectedArrowIndex.value] = undefined
        assignment.currentEndScores = newEndScores
        syncCurrentEndScores()
        return
    }

    // 2. If currently selected slot is empty, find the nearest previous filled slot
    let targetIdx = -1
    for (let i = selectedArrowIndex.value - 1; i >= 0; i--) {
        if (newEndScores[i] !== undefined && newEndScores[i] !== null && newEndScores[i] !== '') {
            targetIdx = i
            break
        }
    }

    // 3. If no filled slot before current cursor, find the last filled slot in the end
    if (targetIdx === -1) {
        for (let i = newEndScores.length - 1; i >= 0; i--) {
            if (newEndScores[i] !== undefined && newEndScores[i] !== null && newEndScores[i] !== '') {
                targetIdx = i
                break
            }
        }
    }

    if (targetIdx !== -1) {
        newEndScores[targetIdx] = undefined
        assignment.currentEndScores = newEndScores
        selectedArrowIndex.value = targetIdx
        syncCurrentEndScores()
    } else if (selectedArrowIndex.value > 0) {
        selectedArrowIndex.value--
    }
}

const calculateEndSum = (scores) => {
    if (!scores || !scores.length) return 0
    return scores.reduce((sum, score) => {
        if (score === undefined || score === null) return sum
        if (score === 'X') return sum + 10
        if (score === 'M') return sum + 0
        return sum + (parseInt(score) || 0)
    }, 0)
}

const calculateTotalScore = (allEndScores, currentEndScores, currentEnd) => {
    let total = 0
    const currentEndNum = currentEnd || 1

    if (allEndScores) {
        Object.keys(allEndScores).forEach(endStr => {
            const endNum = parseInt(endStr)
            if (endNum !== currentEndNum) {
                total += calculateEndSum(allEndScores[endStr])
            }
        })
    }
    total += calculateEndSum(currentEndScores)
    return total
}

const calculateTens = (allEndScores, currentEndScores, currentEnd) => {
    let tens = 0
    const currentEndNum = currentEnd || 1

    const countInList = (list) => {
        if (!list) return
        list.forEach(v => {
            if (v === 10 || v === '10') tens++
        })
    }

    if (allEndScores) {
        Object.keys(allEndScores).forEach(endStr => {
            if (parseInt(endStr) !== currentEndNum) {
                countInList(allEndScores[endStr])
            }
        })
    }
    countInList(currentEndScores)
    return tens
}

const calculateXs = (allEndScores, currentEndScores, currentEnd) => {
    let xs = 0
    const currentEndNum = currentEnd || 1

    const countInList = (list) => {
        if (!list) return
        list.forEach(v => {
            if (v === 'X' || v === 'x') xs++
        })
    }

    if (allEndScores) {
        Object.keys(allEndScores).forEach(endStr => {
            if (parseInt(endStr) !== currentEndNum) {
                countInList(allEndScores[endStr])
            }
        })
    }
    countInList(currentEndScores)
    return xs
}

const isEndComplete = (assignment, endNumber) => {
    if (!assignment) return false
    const arrowsPerEnd = props.sessionData?.arrows_per_end || 6
    if (assignment.currentEnd === endNumber && assignment.currentEndScores) {
        return assignment.currentEndScores.slice(0, arrowsPerEnd).every(v => v !== undefined && v !== null)
    }
    const saved = assignment.allEndScores?.[endNumber]
    if (!saved || saved.length < arrowsPerEnd) return false
    return saved.slice(0, arrowsPerEnd).every(v => v !== undefined && v !== null)
}

const isAssignmentEndComplete = (assignment) => {
    if (!assignment) return false
    const scores = assignment.currentEndScores || []
    const arrowsPerEnd = props.sessionData?.arrows_per_end || 6
    if (scores.length < arrowsPerEnd) return false
    return scores.slice(0, arrowsPerEnd).every((v) => v !== undefined && v !== null)
}

const switchArcherEnd = (assignment, endNumber) => {
    selectArcherForScoring(assignment)
    goToEnd(endNumber)
}

const goToEnd = (endNumber) => {
    if (!currentScoringAssignment.value) return
    const prevEnd = currentScoringAssignment.value.currentEnd || 1
    if (!currentScoringAssignment.value.allEndScores) {
        currentScoringAssignment.value.allEndScores = {}
    }
    if (currentScoringAssignment.value.currentEndScores) {
        currentScoringAssignment.value.allEndScores[prevEnd] = [...currentScoringAssignment.value.currentEndScores]
    }
    currentScoringAssignment.value.currentEnd = endNumber
    const saved = currentScoringAssignment.value.allEndScores[endNumber]
    const arrowsPerEnd = props.sessionData?.arrows_per_end || 6
    if (saved && Array.isArray(saved) && saved.length > 0) {
        currentScoringAssignment.value.currentEndScores = Array.from({ length: arrowsPerEnd }, (_, i) => saved[i] !== undefined ? saved[i] : undefined)
    } else {
        currentScoringAssignment.value.currentEndScores = Array.from({ length: arrowsPerEnd }, () => undefined)
    }
    initEndScores(currentScoringAssignment.value)
}

const goPrevEnd = () => {
    if (!currentScoringAssignment.value) return
    const currentEnd = currentScoringAssignment.value.currentEnd || 1
    if (currentEnd <= 1) return
    goToEnd(currentEnd - 1)
}

const goNextEnd = () => {
    if (!currentScoringAssignment.value) return
    const totalEnds = props.sessionData?.total_ends || 0
    const currentEnd = currentScoringAssignment.value.currentEnd || 1
    if (currentEnd >= totalEnds) return
    goToEnd(currentEnd + 1)
}

const saveEndAndNext = async () => {
    if (isSessionLocked.value) {
        toast.warning(t('event_qualification.session_is_locked_warning', 'Sesi penilaian terkunci. Tidak dapat mengubah nilai.'))
        return
    }
    if (!currentScoringAssignment.value) return
    saving.value = true
    try {
        const assignment = currentScoringAssignment.value
        syncCurrentEndScores()

        const endsToSave = []
        const currentEndNum = assignment.currentEnd || 1

        if (assignment.allEndScores) {
            Object.keys(assignment.allEndScores).forEach(endStr => {
                const endNum = parseInt(endStr)
                const scores = assignment.allEndScores[endStr] || []
                const filteredArrows = scores
                    .filter(s => s !== undefined && s !== null && s !== '')
                    .map(s => String(s))

                endsToSave.push({
                    end_number: endNum,
                    arrows: filteredArrows
                })
            })
        }

        await post(`/qualification/assignments/${assignment.uuid}/scores`, {
            ends: endsToSave
        })

        let transitionToastShown = false

        if (isAssignmentEndComplete(assignment)) {
            if (currentEndNum < (props.sessionData?.total_ends || 0)) {
                goToEnd(currentEndNum + 1)
            } else {
                const currentIndex = localAssignments.value.findIndex(a => a.uuid === assignment.uuid)
                if (currentIndex < localAssignments.value.length - 1) {
                    const nextArcher = localAssignments.value[currentIndex + 1]
                    currentScoringArcherUuid.value = nextArcher.uuid
                    initEndScores(nextArcher)
                    toast.info(t('event_qualification.toast_moved_to_archer', { name: nextArcher.archer_name }))
                    transitionToastShown = true
                } else {
                    toast.success(t('event_qualification.toast_category_completed'))
                    transitionToastShown = true
                }
            }
        }

        if (!transitionToastShown) {
            toast.success(t('event_qualification.toast_score_saved'))
        }

        emit('updated')
    } catch (error) {
        console.error('Failed to save score:', error)
        toast.error(getApiErrorMessage(error, t('event_qualification.toast_score_save_failed')))
    } finally {
        saving.value = false
    }
}

// World Archery Color Rings for Arrow Score Boxes
const getArrowRingClass = (score) => {
    if (score === undefined || score === null) {
        return 'bg-slate-50 border-slate-200 text-slate-300'
    }
    const s = String(score).toUpperCase()
    if (['X', '10', '9'].includes(s)) {
        return 'bg-amber-300 border-amber-500 text-amber-950 font-black shadow-xs'
    }
    if (['8', '7'].includes(s)) {
        return 'bg-red-500 border-red-700 text-white font-black shadow-xs'
    }
    if (['6', '5'].includes(s)) {
        return 'bg-sky-500 border-sky-700 text-white font-black shadow-xs'
    }
    if (['4', '3'].includes(s)) {
        return 'bg-slate-900 border-slate-950 text-white font-black shadow-xs'
    }
    if (['2', '1'].includes(s)) {
        return 'bg-white border-slate-300 text-slate-900 font-black shadow-xs'
    }
    if (s === 'M') {
        return 'bg-slate-200 border-slate-400 text-slate-600 font-black shadow-xs'
    }
    return 'bg-white border-slate-200 text-navy'
}

// Keypad Button Color Themes (World Archery Rings)
const getKeypadRingClass = (val) => {
    const s = String(val).toUpperCase()
    if (['X', '10', '9'].includes(s)) {
        return 'bg-gradient-to-b from-amber-300 to-amber-400 border-amber-600 text-amber-950 hover:brightness-105 active:border-amber-600'
    }
    if (['8', '7'].includes(s)) {
        return 'bg-gradient-to-b from-red-500 to-red-600 border-red-800 text-white hover:brightness-105 active:border-red-800'
    }
    if (['6', '5'].includes(s)) {
        return 'bg-gradient-to-b from-sky-500 to-sky-600 border-sky-800 text-white hover:brightness-105 active:border-sky-800'
    }
    if (['4', '3'].includes(s)) {
        return 'bg-gradient-to-b from-slate-800 to-slate-900 border-black text-white hover:brightness-110 active:border-black'
    }
    if (['2', '1'].includes(s)) {
        return 'bg-gradient-to-b from-white to-slate-100 border-slate-300 text-slate-900 hover:bg-slate-50 active:border-slate-300'
    }
    if (s === 'M') {
        return 'bg-gradient-to-b from-slate-200 to-slate-300 border-slate-400 text-slate-700 hover:brightness-105 active:border-slate-400'
    }
    return 'bg-white border-slate-200 text-navy'
}

// Background Silent Auto-Save Job (Every 15 seconds)
const isAutoSaving = ref(false)
let autoSaveTimer = null

const silentAutoSaveScores = async () => {
    if (!currentScoringAssignment.value || saving.value || isAutoSaving.value) return
    if (!isSubscriptionActive.value) return

    const assignment = currentScoringAssignment.value
    const currentEndNum = assignment.currentEnd || 1

    if (assignment.currentEndScores) {
        if (!assignment.allEndScores) assignment.allEndScores = {}
        assignment.allEndScores[currentEndNum] = [...assignment.currentEndScores]
    }

    if (!assignment.allEndScores) return

    const endsToSave = []
    Object.keys(assignment.allEndScores).forEach(endStr => {
        const endNum = parseInt(endStr)
        const scores = assignment.allEndScores[endStr]
        const filteredArrows = (scores || [])
            .filter(s => s !== undefined && s !== null && s !== '')
            .map(s => String(s))

        endsToSave.push({
            end_number: endNum,
            arrows: filteredArrows
        })
    })

    if (endsToSave.length === 0) return

    try {
        isAutoSaving.value = true
        await post(`/qualification/assignments/${assignment.uuid}/scores`, {
            ends: endsToSave
        })
    } catch (error) {
        console.debug('Silent auto-save error:', error)
    } finally {
        isAutoSaving.value = false
    }
}

onMounted(() => {
    autoSaveTimer = setInterval(() => {
        silentAutoSaveScores()
    }, 15000)
})

onBeforeUnmount(() => {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer)
        autoSaveTimer = null
    }
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>

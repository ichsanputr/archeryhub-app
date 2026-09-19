<template>
    <div class="space-y-6">
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

        <!-- Target Auto-Locked Banner when scores exist in session -->
        <div v-if="hasScoresInSession"
            class="flex items-center gap-3.5 p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-navy shadow-2xs">
            <div class="size-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Icon icon="ph:lock-key-bold" class="text-xl" />
            </div>
            <div class="flex-1 min-w-0">
                <div class="text-xs font-black text-slate-900">
                    {{ t('event_qualification.auto_locked_title', 'Target Terkunci Otomatis') }}
                </div>
                <div class="text-[11px] text-slate-600 font-medium leading-snug mt-0.5">
                    {{ t('event_qualification.auto_locked_desc', 'Penilaian kualifikasi pada sesi ini telah berlangsung. Pengundian otomatis, reset, dan pemindahan posisi target dinonaktifkan demi menjaga integritas data nilai.') }}
                </div>
            </div>
        </div>

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 class="text-xl font-black text-navy leading-tight">{{ t('event_qualification.target_settings', 'Pengaturan Target') }}</h2>
                <div class="text-sm text-gray-500 mt-1">
                    {{ t('event_qualification.target_settings_desc', 'Kelola penempatan pemanah pada target kualifikasi (Geser & Letakkan)') }}
                </div>
            </div>
            <div class="flex items-center gap-3">
                <BaseButton variant="white" icon="ph:trash-bold" size="md"
                    :disabled="isReseting || isAssigning || hasScoresInSession || props.archers.length === unassignedArchersCount"
                    :loading="isReseting" class="!text-red-600 !border-red-200 hover:!bg-red-50 font-bold text-sm h-11 px-5"
                    :title="hasScoresInSession ? t('event_qualification.locked_due_to_scores', 'Target terkunci karena penilaian sudah dimulai') : ''"
                    @click="isSubscriptionActive ? resetAssignments() : (showPremiumModal = true)">
                    {{ t('event_qualification.reset', 'Atur Ulang') }}
                </BaseButton>
 
                <div class="relative dropdown-container">
                    <BaseButton variant="primary" icon="fa7-solid:random" size="md"
                        :disabled="isAssigning || isReseting || hasScoresInSession || props.archers.length === 0" :loading="isAssigning"
                        class="font-black text-sm h-11 px-5 shadow-md shadow-primary/20"
                        :title="hasScoresInSession ? t('event_qualification.locked_due_to_scores', 'Target terkunci karena penilaian sudah dimulai') : ''"
                        @click="isSubscriptionActive && !hasScoresInSession ? (showAutoAssignMenu = !showAutoAssignMenu) : (hasScoresInSession ? null : (showPremiumModal = true))">
                        {{ t('event_qualification.auto_assign', 'Undian Otomatis') }}
                        <Icon icon="ph:caret-down-bold" class="ml-1.5 text-xs transition-transform duration-200"
                            :class="{ 'rotate-180': showAutoAssignMenu }" />
                    </BaseButton>

                    <transition enter-active-class="transition ease-out duration-150"
                        enter-from-class="transform opacity-0 scale-95 -translate-y-2" enter-to-class="transform opacity-100 scale-100 translate-y-0"
                        leave-active-class="transition ease-in duration-100"
                        leave-from-class="transform opacity-100 scale-100 translate-y-0"
                        leave-to-class="transform opacity-0 scale-95 -translate-y-2">
                        <div v-if="showAutoAssignMenu" v-click-outside="() => showAutoAssignMenu = false"
                            class="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2.5 z-[1001] origin-top-right space-y-2">
                            
                            <!-- Menu Header -->
                            <div class="px-3 py-2 bg-gradient-to-r from-navy via-navy to-navy/90 text-white rounded-xl flex items-center justify-between shadow-2xs">
                                <div class="flex items-center gap-2">
                                    <Icon icon="ph:shuffle-bold" class="text-primary text-base" />
                                    <span class="text-xs font-black tracking-wide">{{ t('event_qualification.select_draw_type', 'Pilih Metode Undian') }}</span>
                                </div>
                                <span class="text-[10px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded-md">Auto Assign</span>
                            </div>

                            <!-- Option 1: Standard Draw -->
                            <button type="button" @click="handleAutoAssignSelection('standard')"
                                class="w-full p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/90 transition-all text-left group flex items-start gap-3.5 shadow-2xs cursor-pointer">
                                <div class="size-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 flex items-center justify-center transition-all shrink-0 shadow-2xs">
                                    <Icon icon="ph:list-numbers-bold" class="text-xl" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between gap-1 mb-0.5">
                                        <span class="text-xs font-black text-slate-900 group-hover:text-navy transition-colors">
                                            {{ t('event_qualification.standard_draw', 'Undian Standar (Acak Sekaligus)') }}
                                        </span>
                                    </div>
                                    <p class="text-[11px] text-slate-500 font-medium leading-snug">
                                        {{ t('event_qualification.standard_draw_desc', 'Mengacak seluruh pemanah sekaligus dan mengisi target secara berurutan.') }}
                                    </p>
                                </div>
                                <Icon icon="ph:caret-right-bold" class="text-slate-300 group-hover:text-navy group-hover:translate-x-0.5 transition-all text-sm shrink-0 self-center" />
                            </button>

                            <!-- Option 2: Field Draw -->
                            <button type="button" @click="handleAutoAssignSelection('field')"
                                class="w-full p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/90 transition-all text-left group flex items-start gap-3.5 shadow-2xs cursor-pointer">
                                <div class="size-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600 flex items-center justify-center transition-all shrink-0 shadow-2xs">
                                    <Icon icon="ph:tree-structure-bold" class="text-xl" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between gap-1 mb-0.5">
                                        <span class="text-xs font-black text-slate-900 group-hover:text-navy transition-colors">
                                            {{ t('event_qualification.field_draw', 'Undian Lapangan (Sebar Klub)') }}
                                        </span>
                                    </div>
                                    <p class="text-[11px] text-slate-500 font-medium leading-snug">
                                        {{ t('event_qualification.field_draw_desc', 'Mendistribusikan atlet dari klub yang sama ke target berbeda agar tidak satu bantalan.') }}
                                    </p>
                                </div>
                                <Icon icon="ph:caret-right-bold" class="text-slate-300 group-hover:text-navy group-hover:translate-x-0.5 transition-all text-sm shrink-0 self-center" />
                            </button>
                        </div>
                    </transition>
                </div>
            </div>
        </div>

        <!-- Kanban Board Layout -->
        <div class="flex flex-col lg:flex-row gap-6">
            <!-- Unassigned Column -->
            <div class="lg:w-80 shrink-0 lg:self-start lg:sticky lg:top-4">
                <div class="bg-slate-100/90 rounded-2xl border border-slate-200/90 p-4 min-h-[520px] flex flex-col gap-3.5 shadow-xs"
                     @dragover.prevent @drop="isSubscriptionActive && !hasScoresInSession ? handleDropOnUnassigned() : null">
                    <div class="flex items-center justify-between px-1">
                        <div class="flex items-center gap-2">
                            <Icon icon="ph:users-three-bold" class="text-slate-600 text-base" />
                            <h3 class="font-black text-slate-900 text-xs tracking-wide">{{ t('event_qualification.unassigned', 'Belum Diatur') }}</h3>
                        </div>
                        <span class="bg-navy text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-2xs font-mono">
                            {{ unassignedArchersCount }}
                        </span>
                    </div>

                    <div v-if="unassignedArchersCount === 0"
                        class="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 bg-white/50 rounded-xl border border-dashed border-slate-200">
                        <Icon v-if="props.archers.length > 0" icon="ph:check-circle-bold" class="text-4xl mb-2 text-emerald-500" />
                        <Icon v-else icon="ph:user-circle-minus-bold" class="text-4xl mb-2 text-slate-300" />
                        <div class="text-xs font-bold text-slate-700">
                            {{ props.archers.length > 0 
                                ? t('event_qualification.all_assigned', 'Semua pemanah telah ditempatkan') 
                                : t('event_qualification.no_archers_in_cat', 'Belum ada pemanah di kategori ini') }}
                        </div>
                    </div>

                    <div v-else class="flex flex-col gap-0 max-h-[700px] overflow-y-auto custom-scrollbar pr-0.5 pb-6">
                        <div v-for="group in unassignedArchersByClub" :key="group.clubName" class="space-y-2">
                            <!-- Group Divider -->
                            <div class="flex items-center gap-2 px-1 py-2.5">
                                <div class="flex-1 h-px bg-slate-200"></div>
                                <span
                                    class="text-[10px] font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs truncate max-w-[200px]">
                                    {{ group.clubName === 'Independen' ? t('event_qualification.independent', 'Independen') : group.clubName }}
                                </span>
                                <div class="flex-1 h-px bg-slate-200"></div>
                            </div>

                            <div v-for="archer in group.archers" :key="archer.uuid" :draggable="isSubscriptionActive && !hasScoresInSession"
                                @dragstart="(e) => !hasScoresInSession && handleDragStart(e, archer)" @dragend="handleDragEnd"
                                class="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs transition-all flex items-center gap-3 group select-none"
                                :class="hasScoresInSession ? 'cursor-not-allowed opacity-80' : 'cursor-grab active:cursor-grabbing hover:border-primary hover:shadow-md'">
                                <div
                                    class="size-9 rounded-xl border border-slate-100 overflow-hidden shrink-0 bg-slate-50 pointer-events-none shadow-2xs">
                                    <img :src="useImageOrDefault(archer.avatar_url, archer.name)" draggable="false"
                                        class="w-full h-full object-cover">
                                </div>
                                <div class="flex-1 min-w-0 pointer-events-none">
                                    <div class="flex items-center gap-1.5 justify-between">
                                        <div class="text-xs font-black text-slate-900 group-hover:text-navy transition-colors truncate leading-snug">{{ archer.name }}</div>
                                        <span v-if="archer.has_score || archer.total_score > 0"
                                            class="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-md shrink-0 font-mono shadow-2xs">
                                            {{ archer.total_score }} pts
                                        </span>
                                    </div>
                                    <div class="text-[10px] text-slate-500 font-semibold truncate tracking-tight mt-0.5">
                                        {{ archer.club || t('event_qualification.independent', 'Independen') }}
                                    </div>
                                </div>
                                <Icon v-if="!hasScoresInSession" icon="ph:dots-six-vertical-bold"
                                    class="text-slate-300 group-hover:text-slate-600 pointer-events-none text-base shrink-0" />
                                <Icon v-else icon="ph:lock-key-bold"
                                    class="text-slate-300 pointer-events-none text-xs shrink-0" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Target Grid Column -->
            <div class="flex-1">
                <!-- Empty State when no targets exist -->
                <div v-if="props.availableTargets.length === 0"
                    class="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-8 sm:p-14 text-center flex flex-col items-center justify-center space-y-5 min-h-[480px] shadow-2xs">
                    <div class="relative">
                        <div class="size-20 rounded-3xl bg-navy text-primary flex items-center justify-center shadow-lg shadow-navy/15">
                            <Icon icon="ph:target-bold" class="text-4xl" />
                        </div>
                        <div class="absolute -bottom-1 -right-1 size-7 rounded-xl bg-amber-400 text-navy flex items-center justify-center border-2 border-white shadow-xs">
                            <Icon icon="ph:warning-bold" class="text-xs" />
                        </div>
                    </div>

                    <div class="max-w-md space-y-2">
                        <h3 class="text-lg sm:text-xl font-black text-navy leading-tight">
                            {{ t('event_qualification.no_targets_title', 'Belum Ada Bantalan Target') }}
                        </h3>
                        <p class="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                            {{ t('event_qualification.no_targets_desc', 'Turnamen ini belum memiliki target kualifikasi yang dikonfigurasi. Buat nomor bantalan target terlebih dahulu pada menu Manajemen Target untuk mulai menempatkan pemanah.') }}
                        </p>
                    </div>

                    <div class="pt-2">
                        <NuxtLink :to="`/dashboard/organizer/tournaments/${props.eventId}/targets`"
                            class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-navy hover:bg-primary text-primary hover:text-navy text-xs sm:text-sm font-black transition-all shadow-md shadow-navy/10 active:scale-95">
                            <Icon icon="ph:plus-circle-bold" class="text-base" />
                            <span>{{ t('event_qualification.configure_targets_cta', 'Atur & Tambah Bantalan Target') }}</span>
                            <Icon icon="ph:arrow-right-bold" class="text-xs" />
                        </NuxtLink>
                    </div>
                </div>

                <!-- Target Grid Cards -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div v-for="target in targetGrid" :key="target.name"
                        class="bg-white rounded-2xl shadow-sm border relative border-gray-100 flex flex-col hover:shadow-md transition-all group/card"
                        :class="{ 'z-[100]': openDropdown?.targetId === target.name }">
                        <!-- Card Header -->
                        <div
                            class="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center rounded-t-2xl">
                            <div class="flex items-center gap-3">
                                <div
                                    class="bg-navy text-btn-inverse font-black text-xs px-2 py-1 rounded-lg shadow-sm flex items-center gap-2">
                                    <span>{{ target.name.split(' ').pop() }}</span>
                                    <span v-if="target.assignedCount > 0"
                                        class="text-white text-[10px] font-mono border-l border-white/10 pl-2"
                                        :title="t('event_qualification.board_code', 'Kode Bantalan')">
                                        {{ getBoardCode(target.name) ? getBoardCode(target.name) :
                                             String(target.name.match(/\d+/)?.[0] || '').padStart(2, '0') }}
                                    </span>
                                </div>
                            </div>
                            <span :class="[
                                'text-[10px] font-black tracking-wider px-2 py-1 rounded-full',
                                target.assignedCount === target.availableLetters.length ? 'bg-green-100 text-green-700' :
                                    target.assignedCount === 0 ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-700'
                            ]">
                                {{ target.assignedCount === target.availableLetters.length ? t('event_qualification.full', 'Penuh') :
                                    target.assignedCount === 0 ? t('event_qualification.empty_slot', 'Slot Kosong') :
                                    t('event_qualification.slots_available', { count: target.availableLetters.length - target.assignedCount }, `Tersedia ${target.availableLetters.length - target.assignedCount} Slot`) }}
                            </span>
                        </div>

                        <div class="p-4 space-y-3">
                            <div v-for="pos in target.availableLetters" :key="pos" class="group" @dragover.prevent
                                @drop="isSubscriptionActive && !hasScoresInSession ? handleDropOnTarget(target, pos) : null">
                                <div v-if="target.slots[pos]" :draggable="isSubscriptionActive && !hasScoresInSession"
                                    @dragstart="(e) => !hasScoresInSession && handleDragStart(e, target.slots[pos], target, pos)"
                                    @dragend="handleDragEnd"
                                    class="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/80 transition-all group/slot-filled select-none"
                                    :class="[hasScoresInSession ? 'cursor-not-allowed opacity-90' : 'cursor-grab active:cursor-grabbing hover:border-primary/50 hover:bg-white hover:shadow-sm', { 'opacity-50': draggedArcher?.archer.uuid === target.slots[pos].uuid }]">
                                    <span
                                        class="flex items-center justify-center size-7 rounded-lg bg-white border border-slate-200 text-xs font-black text-navy shadow-2xs shrink-0">
                                        {{ pos }}
                                    </span>
                                    <div
                                        class="size-8 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-white pointer-events-none shadow-2xs">
                                        <img :src="useImageOrDefault(target.slots[pos].avatar_url, target.slots[pos].name)"
                                            draggable="false" class="w-full h-full object-cover"
                                            :alt="target.slots[pos].name" />
                                    </div>
                                    <div class="flex-1 min-w-0 pointer-events-none">
                                        <div class="flex items-center gap-1.5 justify-between">
                                            <div class="text-xs font-black text-slate-900 truncate leading-tight">{{
                                                target.slots[pos].name }}</div>
                                            <span v-if="target.slots[pos].has_score || target.slots[pos].total_score > 0"
                                                class="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-md shrink-0 font-mono shadow-2xs">
                                                {{ target.slots[pos].total_score }} pts
                                            </span>
                                        </div>
                                        <div class="text-[10px] text-slate-500 truncate font-semibold tracking-tight mt-0.5">
                                            {{ target.slots[pos].club || t('event_qualification.independent', 'Independen') }}
                                        </div>
                                    </div>
                                    <button v-if="!hasScoresInSession" type="button"
                                        class="size-7 rounded-lg bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-200 hover:border-red-500 flex items-center justify-center transition-all opacity-0 group-hover/slot-filled:opacity-100 shadow-2xs shrink-0 cursor-pointer"
                                        :title="t('common.remove', 'Lepaskan dari target')"
                                        @click.stop="isSubscriptionActive ? unassignArcherFromTarget(target.slots[pos].assignmentId) : (showPremiumModal = true)">
                                        <Icon icon="ph:trash-bold" class="text-xs" />
                                    </button>
                                </div>
 
                                <!-- Custom Archer Dropdown -->
                                <div v-else class="relative archer-dropdown-container" @dragover.prevent
                                    @drop.stop="isSubscriptionActive && !hasScoresInSession ? handleDropOnTarget(target, pos) : null">
                                    <div v-if="target.otherSlots[pos]"
                                        class="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-gray-100/50 opacity-60">
                                        <span
                                            class="flex items-center justify-center size-7 rounded-lg bg-gray-200 border border-gray-200 text-xs font-black text-gray-400 shrink-0">
                                            {{ pos }}
                                        </span>
                                        <div class="flex-1 min-w-0">
                                            <div class=" text-xs font-black text-gray-500 truncate leading-tight">
                                                {{ target.otherSlots[pos].archer_name }}
                                            </div>
                                            <div class="text-[9px] text-gray-400 font-bold tracking-tighter">
                                                {{ t('event_qualification.other_category', 'Kategori Lain') }}
                                            </div>
                                        </div>
                                        <div class="size-6 flex items-center justify-center">
                                            <Icon icon="ph:lock-key-bold" class="text-gray-300" />
                                        </div>
                                    </div>
 
                                    <div v-else @click.stop="isSubscriptionActive && !hasScoresInSession ? toggleDropdown(target.name, pos) : (hasScoresInSession ? null : (showPremiumModal = true))"
                                        class="flex items-center gap-3 p-2.5 rounded-xl border border-dashed border-gray-200 bg-white transition-all group/slot"
                                        :class="[hasScoresInSession ? 'cursor-not-allowed opacity-50 bg-slate-50' : 'cursor-pointer hover:bg-gray-50/50 hover:border-primary/50', { 'border-primary bg-primary/5 ring-4 ring-primary/10 shadow-inner': isDragging && !hasScoresInSession }]"
                                        @dragover.prevent="(e) => { if (!hasScoresInSession) { e.preventDefault(); e.dataTransfer.dropEffect = 'move' } }">
                                        <span
                                            class="flex items-center justify-center size-7 rounded-lg bg-gray-50 border border-gray-100 text-xs font-bold text-gray-400 shrink-0">
                                            {{ pos }}
                                        </span>
                                        <div class="flex-1 min-w-0">
                                            <div class="text-xs font-bold text-gray-300">
                                                {{ hasScoresInSession ? t('event_qualification.locked', 'Terkunci') : t('event_qualification.move_here', 'Pindahkan ke sini') }}
                                            </div>
                                        </div>
                                        <Icon v-if="!hasScoresInSession" icon="ph:plus-circle-bold"
                                            class="text-gray-200 text-lg group-hover/slot:text-primary transition-colors" />
                                        <Icon v-else icon="ph:lock-key-bold"
                                            class="text-gray-300 text-sm" />
                                    </div>
                                    <div v-if="openDropdown?.targetId === target.name && openDropdown?.pos === pos"
                                        class="absolute !z-[10000] mt-1 w-full min-w-[280px] bg-white shadow-2xl border border-gray-100 py-2 left-0 top-full">
                                        <div class="px-3 pb-2 border-b border-gray-50">
                                            <div class="relative">
                                                <Icon icon="ph:magnifying-glass"
                                                    class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input v-model="filterText" type="text" :placeholder="t('event_qualification.search_archer', 'Cari pemanah...')"
                                                    class="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-100 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                                                    @click.stop />
                                            </div>
                                        </div>
                                        <div class="max-h-60 overflow-y-auto pt-1 no-scrollbar">
                                            <div v-if="unassignedArcherListFiltered.length === 0"
                                                class="px-4 py-3 text-center text-gray-400 text-xs font-bold">
                                                {{ t('event_qualification.all_archers_assigned', 'Semua pemanah terbagi') }}
                                            </div>
                                            <BaseButton v-for="archer in unassignedArcherListFiltered"
                                                :key="archer.uuid"
                                                @click="assignArcherToTarget(target, pos, archer.uuid)" variant="white"
                                                class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors border-none border-b border-gray-50 last:border-0 group/archer-item shadow-none justify-start">
                                                <div
                                                    class="size-8 rounded-full border border-gray-100 overflow-hidden shrink-0 bg-gray-50">
                                                    <img :src="useImageOrDefault(archer.avatar_url, archer.name)"
                                                        class="w-full h-full object-cover" />
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <div
                                                        class="text-xs font-black text-navy truncate leading-tight mb-0.5">
                                                        {{ archer.name }}
                                                    </div>
                                                    <div
                                                        class="text-[9px] text-gray-500 font-bold truncate tracking-tighter">
                                                        {{ archer.club || t('event_qualification.independent', 'Independen') }}
                                                    </div>
                                                </div>
                                            </BaseButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Redesigned Placement Confirmation Modal -->
    <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showAutoAssignDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-navy/60 backdrop-blur-sm transition-opacity"
          @click="showAutoAssignDialog = false"></div>

        <!-- Modal Card -->
        <div
          class="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all z-10">

          <!-- Header -->
          <div class="relative bg-navy text-white p-4 sm:p-5 overflow-hidden">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0 opacity-15 pointer-events-none"
              style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.15);"></div>

            <div class="relative z-10 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="size-9 sm:size-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-primary backdrop-blur-sm shadow-inner shrink-0">
                  <Icon icon="ph:shuffle-bold" class="text-xl" />
                </div>
                <div>
                  <h3 class="text-base sm:text-lg font-black text-white leading-tight">
                    {{ t('event_qualification.auto_assign_confirm_title', 'Konfirmasi Penempatan Target') }}
                  </h3>
                  <p class="text-xs text-slate-300 font-medium mt-0.5">
                    {{ t('event_qualification.auto_assign_confirm_subtitle', 'Penempatan pemanah ke bantalan target secara otomatis') }}
                  </p>
                </div>
              </div>
              <button type="button" @click="showAutoAssignDialog = false"
                class="size-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer">
                <Icon icon="ph:x-bold" class="text-base" />
              </button>
            </div>
          </div>

          <!-- Body Content -->
          <div class="p-5 sm:p-6 space-y-4">
            <!-- Single Unified Info Box -->
            <div class="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-4">
              <!-- Method Detail -->
              <div class="flex items-start gap-3.5">
                <div :class="drawType === 'standard' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'"
                  class="size-10 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs">
                  <Icon :icon="drawType === 'standard' ? 'ph:list-numbers-bold' : 'ph:tree-structure-bold'" class="text-xl" />
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-black text-slate-900 mb-0.5">
                    {{ drawType === 'standard' ? t('event_qualification.standard_draw', 'Undian Standar (Acak Sekaligus)') : t('event_qualification.field_draw', 'Undian Lapangan (Sebar Klub)') }}
                  </h4>
                  <p class="text-xs text-slate-500 font-medium leading-relaxed">
                    {{ drawType === 'standard' ? t('event_qualification.standard_draw_desc', 'Mengacak seluruh pemanah sekaligus dan mengisi target secara berurutan.') : t('event_qualification.field_draw_desc', 'Mendistribusikan atlet dari klub yang sama ke target berbeda agar tidak satu bantalan.') }}
                  </p>
                </div>
              </div>

              <div class="h-px bg-slate-200/80"></div>

              <!-- Inline Stats Row -->
              <div class="grid grid-cols-2 gap-4">
                <div class="flex items-center gap-3">
                  <div class="size-9 rounded-xl bg-primary/15 text-navy border border-primary/20 flex items-center justify-center shrink-0">
                    <Icon icon="ph:users-three-bold" class="text-lg" />
                  </div>
                  <div class="min-w-0">
                    <span class="text-xs font-bold text-slate-500 block truncate">{{ t('event_qualification.total_archers', 'Total Pemanah') }}</span>
                    <span class="text-sm font-black text-slate-900">{{ props.archers.length }} {{ t('event_qualification.archers', 'Pemanah') }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="size-9 rounded-xl bg-navy/10 text-navy border border-navy/20 flex items-center justify-center shrink-0">
                    <Icon icon="ph:target-bold" class="text-lg" />
                  </div>
                  <div class="min-w-0">
                    <span class="text-xs font-bold text-slate-500 block truncate">{{ t('event_qualification.capacity_per_target', 'Kapasitas Target') }}</span>
                    <span class="text-sm font-black text-slate-900">{{ props.sessionData?.archers_per_target || 4 }} {{ t('event_qualification.archers', 'Pemanah') }}/{{ t('event_qualification.target_single', 'Target') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions Footer -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-3xl">
            <BaseButton variant="white" class="h-11 px-6 text-sm font-bold border-slate-200"
              @click="showAutoAssignDialog = false" :disabled="isAssigning">
              {{ t('event_qualification.cancel', 'Batal') }}
            </BaseButton>
            <BaseButton :disabled="isAssigning" :loading="isAssigning" variant="primary" icon="ph:check-circle-bold"
              class="h-11 px-6 text-sm font-black shadow-md shadow-primary/20"
              @click="async () => { await confirmAutoAssign(); showAutoAssignDialog = false }">
              {{ t('event_qualification.yes_assign', 'Terapkan Penempatan') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Redesigned Reset Confirmation Modal -->
    <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showResetDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-navy/60 backdrop-blur-sm transition-opacity"
          @click="showResetDialog = false"></div>

        <div
          class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all z-10">
          <div class="p-6 text-center space-y-4">
            <div class="size-16 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <Icon icon="ph:trash-bold" class="text-3xl" />
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-900 leading-tight">
                {{ t('event_qualification.reset_confirm_title', 'Reset Penempatan Target?') }}
              </h3>
              <p class="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                {{ t('event_qualification.reset_confirm_msg', 'Pemanah tanpa skor akan dikembalikan ke daftar belum diatur (unassigned).') }}
              </p>
            </div>

            <!-- Smart Protection Alert in Reset -->
            <div v-if="scoredArchersCount > 0" class="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-start gap-2.5 text-left">
              <Icon icon="ph:shield-check-bold" class="text-emerald-600 text-lg shrink-0 mt-0.5" />
              <p class="text-xs text-emerald-800 font-medium leading-relaxed">
                {{ t('event_qualification.reset_scored_notice', { count: scoredArchersCount }).replace('{count}', String(scoredArchersCount)) }}
              </p>
            </div>
          </div>

          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-3xl">
            <BaseButton variant="white" class="h-11 px-6 text-sm font-bold border-slate-200"
              @click="showResetDialog = false" :disabled="isReseting">
              {{ t('event_qualification.cancel', 'Batal') }}
            </BaseButton>
            <BaseButton :disabled="isReseting" :loading="isReseting" variant="danger" icon="ph:trash-bold"
              class="h-11 px-6 text-sm font-black shadow-md shadow-red-200"
              @click="confirmReset">
              {{ t('event_qualification.yes_reset', 'Ya, Reset Penempatan') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Confirmation Modal: Move Archer with Scores -->
    <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showMoveScoredModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-navy/60 backdrop-blur-sm" @click="showMoveScoredModal = false"></div>
        <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10">
          <div class="p-6 text-center space-y-4">
            <div class="size-16 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Icon icon="ph:arrows-left-right-bold" class="text-3xl" />
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-900 leading-tight">
                {{ t('event_qualification.move_scored_confirm_title', 'Pindahkan Target Pemanah Berskor?') }}
              </h3>
              <p class="text-sm text-slate-600 font-medium mt-2 leading-relaxed">
                {{ t('event_qualification.move_scored_confirm_desc', {
                  name: pendingMoveData?.movingArcher?.name || '',
                  ends: pendingMoveData?.movingArcher?.ends_completed || 1,
                  score: pendingMoveData?.movingArcher?.total_score || 0
                }).replace('{name}', pendingMoveData?.movingArcher?.name || '')
                  .replace('{ends}', String(pendingMoveData?.movingArcher?.ends_completed || 1))
                  .replace('{score}', String(pendingMoveData?.movingArcher?.total_score || 0)) }}
              </p>
            </div>
          </div>
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-3xl">
            <BaseButton variant="white" class="h-11 px-6 text-sm font-bold border-slate-200"
              @click="showMoveScoredModal = false">
              {{ t('event_qualification.cancel', 'Batal') }}
            </BaseButton>
            <BaseButton variant="primary" icon="ph:check-bold" class="h-11 px-6 text-sm font-black shadow-md shadow-primary/20"
              @click="confirmMoveScoredArcher">
              {{ t('event_qualification.move_here', 'Ya, Pindahkan Target') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Confirmation Modal: Unassign Archer with Scores -->
    <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showUnassignScoredModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-navy/60 backdrop-blur-sm" @click="showUnassignScoredModal = false"></div>
        <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10">
          <div class="p-6 text-center space-y-4">
            <div class="size-16 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Icon icon="ph:warning-bold" class="text-3xl" />
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-900 leading-tight">
                {{ t('event_qualification.unassign_scored_confirm_title', 'Lepas Target Pemanah Berskor?') }}
              </h3>
              <p class="text-sm text-slate-600 font-medium mt-2 leading-relaxed">
                {{ t('event_qualification.unassign_scored_confirm_desc', {
                  name: pendingUnassignData?.archer?.name || '',
                  ends: pendingUnassignData?.archer?.ends_completed || 1,
                  score: pendingUnassignData?.archer?.total_score || 0
                }).replace('{name}', pendingUnassignData?.archer?.name || '')
                  .replace('{ends}', String(pendingUnassignData?.archer?.ends_completed || 1))
                  .replace('{score}', String(pendingUnassignData?.archer?.total_score || 0)) }}
              </p>
            </div>
          </div>
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-3xl">
            <BaseButton variant="white" class="h-11 px-6 text-sm font-bold border-slate-200"
              @click="showUnassignScoredModal = false">
              {{ t('event_qualification.cancel', 'Batal') }}
            </BaseButton>
            <BaseButton variant="danger" icon="ph:trash-bold" class="h-11 px-6 text-sm font-black shadow-md shadow-red-200"
              @click="confirmUnassignScoredArcher">
              {{ t('event_qualification.delete_btn', 'Ya, Lepaskan Target') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { useApi, getApiErrorMessage } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import AppDialog from '~/components/common/AppDialog.vue'
import { useSubscription } from '~/composables/useSubscription'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'

const { isSubscriptionActive } = useSubscription()
const { t } = useI18n()
const showPremiumModal = ref(false)

const props = defineProps({
    eventId: { type: String, required: true },
    sessionData: { type: Object, required: true },
    selectedCategory: { type: String, required: true },
    availableTargets: { type: Array, default: () => [] },
    archers: { type: Array, default: () => [] },
    boardCodes: { type: Array, default: () => [] },
    allAssignments: { type: Array, default: () => [] }
})

const emit = defineEmits(['updated'])

const { post, delete: del } = useApi()
const toast = useToast()

const isSyncing = ref(false)
const isAssigning = ref(false)
const isReseting = ref(false)
const filterText = ref('')
const openDropdown = ref(null)
const showResetDialog = ref(false)
const showAutoAssignDialog = ref(false)
const showAutoAssignMenu = ref(false)
const drawType = ref('standard')

// Smart Protection state & counts
const assignMode = ref('unassigned_only')
const scoredArchersCount = computed(() => {
    return props.archers.filter(a => a.has_score || (a.total_score && a.total_score > 0) || (a.ends_completed && a.ends_completed > 0)).length
})

const hasScoresInSession = computed(() => {
    return props.archers.some(a => a.has_score || (a.total_score && a.total_score > 0) || (a.ends_completed && a.ends_completed > 0)) ||
           props.allAssignments.some(a => a.has_score || (a.total_score && a.total_score > 0) || (a.ends_completed && a.ends_completed > 0))
})

const showMoveScoredModal = ref(false)
const pendingMoveData = ref(null)

const showUnassignScoredModal = ref(false)
const pendingUnassignData = ref(null)

// Click outside directive implementation
const vClickOutside = {
    mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
            if (el && !(el === event.target || el.contains(event.target))) {
                if (typeof binding.value === 'function') {
                    binding.value(event)
                }
            }
        }
        if (typeof document !== 'undefined') {
            document.addEventListener('mousedown', el.clickOutsideEvent)
        }
    },
    beforeUnmount(el) {
        if (typeof document !== 'undefined' && el.clickOutsideEvent) {
            document.removeEventListener('mousedown', el.clickOutsideEvent)
        }
    },
    unmounted(el) {
        if (typeof document !== 'undefined' && el.clickOutsideEvent) {
            document.removeEventListener('mousedown', el.clickOutsideEvent)
        }
    }
}

// Drag and Drop States
const draggedArcher = ref(null) // { archer, sourceTarget, sourcePos }
const isDragging = ref(false)

const unassignedArcherList = computed(() => {
    return props.archers.filter(a => !a.assignedTarget)
})

const unassignedArchersCount = computed(() => unassignedArcherList.value.length)

const unassignedArchersByClub = computed(() => {
    const list = unassignedArcherList.value
    const grouped = {}

    list.forEach(archer => {
        const clubName = archer.club || 'Independen'
        if (!grouped[clubName]) {
            grouped[clubName] = []
        }
        grouped[clubName].push(archer)
    })

    // Sort: Clubs first (A-Z), then Independen at the end
    return Object.keys(grouped).sort((a, b) => {
        if (a === 'Independen') return 1
        if (b === 'Independen') return -1
        return a.localeCompare(b)
    }).map(clubName => ({
        clubName,
        archers: grouped[clubName].sort((a, b) => a.name.localeCompare(b.name))
    }))
})

const unassignedArcherListFiltered = computed(() => {
    if (!filterText.value) return unassignedArcherList.value
    const q = filterText.value.toLowerCase()
    return unassignedArcherList.value.filter(a =>
        a.name.toLowerCase().includes(q) || (a.club && a.club.toLowerCase().includes(q))
    )
})

const targetGrid = computed(() => {
    if (!props.selectedCategory || !props.availableTargets.length) return []

    const archers = props.archers
    const grouped = {}

    props.availableTargets.forEach(t => {
        const baseName = t.name.replace(/[A-Za-z]$/, '').trim()
        const letterMatch = t.name.match(/[A-D]$/i)
        const letter = letterMatch ? letterMatch[0].toUpperCase() : 'A'

        if (!grouped[baseName]) {
            grouped[baseName] = {
                name: baseName,
                targetIds: [],
                targetUuids: {}, // New: map letter to UUID
                availableLetters: [],
                slots: {},
                otherSlots: {},
                assignedCount: 0
            }
        }
        grouped[baseName].targetIds.push(t.id)
        grouped[baseName].targetUuids[letter] = t.id // Store the UUID for this position

        if (!grouped[baseName].availableLetters.includes(letter)) {
            grouped[baseName].availableLetters.push(letter)
            grouped[baseName].availableLetters.sort()
            grouped[baseName].slots[letter] = null
            grouped[baseName].otherSlots[letter] = null
        }

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

        // Check if taken by other categories
        if (grouped[baseName].slots[letter] === null) {
            const otherAssignment = props.allAssignments.find(a => a.target_id === t.id)
            if (otherAssignment) {
                grouped[baseName].otherSlots[letter] = otherAssignment
                grouped[baseName].assignedCount++
            }
        }
    })

    return Object.values(grouped).sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)?.[0] || 0)
        const numB = parseInt(b.name.match(/\d+/)?.[0] || 0)
        return numA - numB
    })
})

const getBoardCode = (boardName) => {
    const num = parseInt(boardName.match(/\d+/)?.[0])
    if (!num) return null
    const found = props.boardCodes.find(bc => bc.board_number === num)
    return found ? found.board_code : null
}

const getPositionCode = (targetName, pos) => {
    const boardCode = getBoardCode(targetName)
    if (boardCode) return `${boardCode}-${pos}`.toUpperCase()
    const num = targetName.match(/\d+/)?.[0]
    return num ? `${num}${pos}`.toUpperCase() : pos
}

const handleDragStart = (event, archer, targetRecord = null, pos = null) => {
    openDropdown.value = null // Close any open dropdowns when starting a drag
    // Set dataTransfer data — required for browsers to enable drag & drop
    event.dataTransfer.setData('text/plain', archer.uuid || '')
    event.dataTransfer.effectAllowed = 'move'
    draggedArcher.value = { archer, sourceTarget: targetRecord, sourcePos: pos }
    isDragging.value = true
}

const handleDragEnd = () => {
    isDragging.value = false
    draggedArcher.value = null
}

const handleDropOnTarget = async (targetRecord, pos) => {
    if (hasScoresInSession.value) {
        toast.error(t('event_qualification.locked_due_to_scores', 'Target terkunci karena penilaian sudah dimulai'))
        return
    }
    if (!draggedArcher.value) return

    const { archer: movingArcher, sourceTarget, sourcePos } = draggedArcher.value

    if (sourceTarget?.name === targetRecord.name && sourcePos === pos) {
        handleDragEnd()
        return
    }

    const existingArcher = targetRecord.slots[pos]

    // Smart Protection: Prompt confirmation if moving archer or existing archer has scores
    const hasScoreMoving = movingArcher.has_score || (movingArcher.total_score && movingArcher.total_score > 0)
    const hasScoreExisting = existingArcher && (existingArcher.has_score || (existingArcher.total_score && existingArcher.total_score > 0))

    if (hasScoreMoving || hasScoreExisting) {
        pendingMoveData.value = { targetRecord, pos, movingArcher, existingArcher, sourceTarget }
        showMoveScoredModal.value = true
        handleDragEnd()
        return
    }

    await executeMoveOrSwap(targetRecord, pos, movingArcher, existingArcher, sourceTarget)
    handleDragEnd()
}

const executeMoveOrSwap = async (targetRecord, pos, movingArcher, existingArcher, sourceTarget) => {
    try {
        isSyncing.value = true

        if (existingArcher && sourceTarget) {
            // Optimistically swap A-B targets
            const originalTargetA = movingArcher.assignedTarget
            const originalTargetB = existingArcher.assignedTarget

            movingArcher.assignedTarget = originalTargetB
            existingArcher.assignedTarget = originalTargetA

            await swapAssignments(movingArcher.uuid, existingArcher.uuid, originalTargetA, originalTargetB, movingArcher, existingArcher)
        } else {
            // Simple move or assign from unassigned
            await assignArcherToTarget(targetRecord, pos, movingArcher.uuid)
        }
    } finally {
        isSyncing.value = false
    }
}

const confirmMoveScoredArcher = async () => {
    if (!pendingMoveData.value) return
    const { targetRecord, pos, movingArcher, existingArcher, sourceTarget } = pendingMoveData.value
    showMoveScoredModal.value = false
    await executeMoveOrSwap(targetRecord, pos, movingArcher, existingArcher, sourceTarget)
    pendingMoveData.value = null
}

const handleDropOnUnassigned = async () => {
    if (hasScoresInSession.value) {
        toast.error(t('event_qualification.locked_due_to_scores', 'Target terkunci karena penilaian sudah dimulai'))
        return
    }
    if (!draggedArcher.value) return
    const { archer: movingArcher } = draggedArcher.value

    if (movingArcher.assignmentId) {
        const hasScore = movingArcher.has_score || (movingArcher.total_score && movingArcher.total_score > 0)
        if (hasScore) {
            pendingUnassignData.value = { assignmentId: movingArcher.assignmentId, archer: movingArcher }
            showUnassignScoredModal.value = true
            handleDragEnd()
            return
        }
        await unassignArcherFromTarget(movingArcher.assignmentId)
    }
    handleDragEnd()
}

const toggleDropdown = (targetId, pos) => {
    if (openDropdown.value?.targetId === targetId && openDropdown.value?.pos === pos) {
        openDropdown.value = null
    } else {
        openDropdown.value = { targetId, pos }
        filterText.value = ''
    }
}

const assignArcherToTarget = async (baseTarget, position, archerUuid) => {
    if (hasScoresInSession.value) {
        toast.error(t('event_qualification.locked_due_to_scores', 'Target terkunci karena penilaian sudah dimulai'))
        return
    }
    const archerObj = props.archers.find(a => a.uuid === archerUuid)
    if (!archerObj) return

    const originalTarget = archerObj.assignedTarget
    const originalAssignmentId = archerObj.assignmentId

    let targetId = baseTarget.targetIds[0]
    if (baseTarget.targetIds.length > 1) {
        const matched = props.availableTargets.find(t =>
            baseTarget.targetIds.includes(t.id) &&
            t.name.toUpperCase().endsWith(position)
        )
        if (matched) targetId = matched.id
    }

    // Optimistically assign target
    archerObj.assignedTarget = targetId

    try {
        isSyncing.value = true
        const payload = {
            category_id: props.selectedCategory,
            assignments: [
                {
                    participant_id: archerUuid,
                    target_id: targetId
                }
            ]
        }

        await post(`/tournaments/${props.eventId}/qualification/sessions/${props.sessionData.uuid}/assignments`, payload)

        toast.success(t('event_qualification.toast_archer_assigned'))
        emit('updated')
        openDropdown.value = null
    } catch (error) {
        console.error('Failed to assign archer:', error)
        // Rollback on failure
        archerObj.assignedTarget = originalTarget
        archerObj.assignmentId = originalAssignmentId
        
        const errorMsg = getApiErrorMessage(error, t('event_qualification.toast_archer_assign_failed'))
        toast.error(errorMsg)
        emit('updated')
    } finally {
        isSyncing.value = false
    }
}

const swapAssignments = async (participantAUuid, participantBUuid, originalTargetA, originalTargetB, archerA, archerB) => {
    if (hasScoresInSession.value) {
        toast.error(t('event_qualification.locked_due_to_scores', 'Target terkunci karena penilaian sudah dimulai'))
        return
    }
    try {
        isSyncing.value = true
        await post(`/qualification/sessions/${props.sessionData.uuid}/swap-assignments`, {
            participant_a: participantAUuid,
            participant_b: participantBUuid
        })
        toast.success(t('event_qualification.toast_archer_swapped'))
        emit('updated')
    } catch (error) {
        console.error('Failed to swap archers:', error)
        // Rollback on failure
        if (archerA && archerB) {
            archerA.assignedTarget = originalTargetA
            archerB.assignedTarget = originalTargetB
        }
        toast.error(getApiErrorMessage(error, t('event_qualification.toast_archer_swap_failed')))
        emit('updated')
    } finally {
        isSyncing.value = false
    }
}

const unassignArcherFromTarget = async (assignmentId) => {
    if (hasScoresInSession.value) {
        toast.error(t('event_qualification.locked_due_to_scores', 'Target terkunci karena penilaian sudah dimulai'))
        return
    }
    if (!assignmentId) return
    const archerObj = props.archers.find(a => a.assignmentId === assignmentId)

    const hasScore = archerObj && (archerObj.has_score || (archerObj.total_score && archerObj.total_score > 0))
    if (hasScore) {
        pendingUnassignData.value = { assignmentId, archer: archerObj }
        showUnassignScoredModal.value = true
        return
    }

    await executeUnassign(assignmentId, archerObj)
}

const executeUnassign = async (assignmentId, archerObj) => {
    if (hasScoresInSession.value) {
        toast.error(t('event_qualification.locked_due_to_scores', 'Target terkunci karena penilaian sudah dimulai'))
        return
    }
    const originalTarget = archerObj ? archerObj.assignedTarget : ''
    const originalAssignmentId = archerObj ? archerObj.assignmentId : null

    if (archerObj) {
        // Optimistically unassign target
        archerObj.assignedTarget = ''
        archerObj.assignmentId = null
    }

    try {
        isSyncing.value = true
        await del(`/qualification/assignments/${assignmentId}`)
        toast.success(t('event_qualification.toast_archer_unassigned'))
        emit('updated')
    } catch (error) {
        console.error('Failed to unassign archer:', error)
        // Rollback on failure
        if (archerObj) {
            archerObj.assignedTarget = originalTarget
            archerObj.assignmentId = originalAssignmentId
        }
        toast.error(getApiErrorMessage(error, t('event_qualification.toast_archer_unassign_failed')))
        emit('updated')
    } finally {
        isSyncing.value = false
    }
}

const confirmUnassignScoredArcher = async () => {
    if (!pendingUnassignData.value) return
    const { assignmentId, archer } = pendingUnassignData.value
    showUnassignScoredModal.value = false
    await executeUnassign(assignmentId, archer)
    pendingUnassignData.value = null
}

const autoAssignTargets = async () => {
    try {
        isAssigning.value = true
        await post(`/qualification/sessions/${props.sessionData.uuid}/auto-assign`, {
            category_id: props.selectedCategory,
            archers_per_target: props.sessionData.archers_per_target || 4,
            draw_type: drawType.value,
            assign_mode: assignMode.value
        })

        toast.success(t('event_qualification.toast_auto_assign_success'))
        emit('updated')
    } catch (error) {
        console.error('Auto-assign failed:', error)
        const errorMsg = getApiErrorMessage(error, t('event_qualification.toast_auto_assign_failed'))
        toast.error(errorMsg)
    } finally {
        isAssigning.value = false
    }
}

const confirmAutoAssign = async () => {
    await autoAssignTargets()
}

const resetAssignments = () => {
    showResetDialog.value = true
}

const confirmReset = async () => {
    try {
        isReseting.value = true
        const res = await post(`/qualification/sessions/${props.sessionData.uuid}/reset-assignments`, {
            category_id: props.selectedCategory
        })

        const resetCount = res?.reset_count ?? 0
        const retainedCount = res?.retained_count ?? 0

        if (retainedCount > 0) {
            toast.success(`${resetCount} pemanah di-reset. ${retainedCount} pemanah berskor tetap aman dipertahankan.`)
        } else {
            toast.success(t('event_qualification.toast_reset_success'))
        }
        emit('updated')
    } catch (error) {
        console.error('Reset assignments failed:', error)
        toast.error(getApiErrorMessage(error, t('event_qualification.toast_reset_failed')))
    } finally {
        isReseting.value = false
        showResetDialog.value = false
    }
}

const handleAutoAssignSelection = (type) => {
    drawType.value = type
    showAutoAssignMenu.value = false
    showAutoAssignDialog.value = true
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
}
</style>

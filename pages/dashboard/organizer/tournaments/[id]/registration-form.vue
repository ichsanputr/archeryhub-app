<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Dashboard Header (Without Add Field in Header) -->
        <DashboardHeader
            :title="t('event_archer_fields.title', 'Formulir Pendaftaran')"
            :subtitle="t('event_archer_fields.desc', 'Kelola susunan formulir, pertanyaan khusus, berkas prasyarat, dan tata letak pendaftaran turnamen.')"
            icon="ph:textbox-bold"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/organizer' },
                { label: t('dashboard.sidebar.my_events', 'My Tournaments'), to: '/dashboard/organizer/tournaments' },
                { label: tournamentTitle || t('dashboard_event_overview.summary_title', 'Overview'), to: `/dashboard/organizer/tournaments/${tournamentId}/overview` },
                { label: t('event_archer_fields.title', 'Formulir Pendaftaran') }
            ]"
        />

        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

        <!-- Navigation Tab Bar (Dedicated Row Below Header) -->
        <div class="flex items-center gap-2.5 border-b border-slate-200/90 pb-3 flex-wrap">
            <button
                type="button"
                @click="activeTab = 'editor'"
                class="px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer select-none"
                :class="activeTab === 'editor' ? 'bg-navy text-white shadow-md shadow-navy/20 ring-1 ring-white/10' : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-navy border border-slate-200/80 shadow-2xs'"
            >
                <Icon icon="ph:layout-bold" class="text-base" :class="activeTab === 'editor' ? 'text-primary' : 'text-slate-500'" />
                <span>{{ t('event_archer_fields.tab_editor', 'Editor Formulir') }}</span>
                <span
                    class="px-2 py-0.5 rounded-full text-xs font-mono font-black transition-colors"
                    :class="activeTab === 'editor' ? 'bg-primary text-navy' : 'bg-slate-100 text-slate-700'"
                >
                    {{ fields.length }}
                </span>
            </button>

            <button
                type="button"
                @click="activeTab = 'preview'"
                class="px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer select-none"
                :class="activeTab === 'preview' ? 'bg-navy text-white shadow-md shadow-navy/20 ring-1 ring-white/10' : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-navy border border-slate-200/80 shadow-2xs'"
            >
                <Icon icon="ph:eye-bold" class="text-base" :class="activeTab === 'preview' ? 'text-primary' : 'text-slate-500'" />
                <span>{{ t('event_archer_fields.tab_preview', 'Pratinjau') }}</span>
            </button>
        </div>

        <!-- ==================================================================== -->
        <!-- TAB 1: FORM CANVAS & BUILDER EDITOR                                  -->
        <!-- ==================================================================== -->
        <div v-if="activeTab === 'editor'" class="space-y-4">
            
            <!-- Quick Insert Bar on Top of Canvas with 4 Main Elements + All Elements Trigger -->
            <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div class="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-navy shrink-0">
                        <Icon icon="ph:plus-circle-fill" class="text-primary text-base" />
                        <span>{{ t('event_archer_fields.quick_insert_label', 'Sisipkan Elemen:') }}</span>
                    </div>
                    <div class="grid grid-cols-2 sm:flex sm:items-center gap-2 flex-wrap">
                        <!-- 1. Input Teks Singkat -->
                        <button
                            type="button"
                            @click="openCreateFieldModalWithType('text')"
                            class="px-3.5 py-2 rounded-xl bg-primary/15 hover:bg-primary/25 text-navy border border-primary/40 text-xs sm:text-sm font-bold flex items-center justify-center sm:justify-start gap-1.5 transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                        >
                            <Icon icon="ph:textbox-bold" class="text-navy text-sm" />
                            <span>{{ t('event_archer_fields.quick_insert_text', '+ Input Teks') }}</span>
                        </button>
                        <!-- 2. Pilihan / Dropdown -->
                        <button
                            type="button"
                            @click="openCreateFieldModalWithType('select')"
                            class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center sm:justify-start gap-1.5 transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                        >
                            <Icon icon="ph:list-bullets-bold" class="text-slate-700 text-sm" />
                            <span>{{ t('event_archer_fields.quick_insert_select', '+ Pilihan (Select)') }}</span>
                        </button>
                        <!-- 3. Judul Seksi -->
                        <button
                            type="button"
                            @click="quickAddLayout('heading')"
                            class="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs sm:text-sm font-bold flex items-center justify-center sm:justify-start gap-1.5 transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                        >
                            <Icon icon="ph:text-h-bold" class="text-blue-600 text-sm" />
                            <span>{{ t('event_archer_fields.quick_insert_heading', '+ Judul Seksi') }}</span>
                        </button>
                        <!-- 4. Unggah Dokumen / Berkas -->
                        <button
                            type="button"
                            @click="openCreateFieldModalWithType('file')"
                            class="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs sm:text-sm font-bold flex items-center justify-center sm:justify-start gap-1.5 transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                        >
                            <Icon icon="ph:file-arrow-up-bold" class="text-purple-600 text-sm" />
                            <span>{{ t('event_archer_fields.quick_insert_file', '+ Unggah Berkas') }}</span>
                        </button>
                        <!-- 5. Semua Elemen & Preset (Dialog Catalog) -->
                        <button
                            type="button"
                            @click="showAllElementsModal = true"
                            class="col-span-2 sm:col-span-1 px-3.5 py-2 rounded-xl bg-navy text-white hover:bg-navy/90 border border-navy text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                        >
                            <Icon icon="ph:squares-four-bold" class="text-primary text-sm" />
                            <span>{{ t('event_archer_fields.quick_insert_all', '+ Semua Elemen') }}</span>
                        </button>
                    </div>
                </div>

                <div class="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-2">
                    <Icon icon="ph:hand-grabbing-bold" class="text-slate-400 text-base shrink-0" />
                    <span>{{ t('event_archer_fields.drag_hint', 'Tarik ikon titik untuk memindahkan urutan') }}</span>
                </div>
            </div>

            <!-- Canvas Container -->
            <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div class="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <Icon icon="ph:stack-bold" class="text-navy text-lg" />
                        <h2 class="text-sm sm:text-base font-bold text-navy">{{ t('event_archer_fields.canvas_title', 'Daftar Pertanyaan & Formulir') }}</h2>
                    </div>

                    <div v-if="isReordering" class="flex items-center gap-2 text-xs sm:text-sm text-navy font-bold">
                        <Icon icon="svg-spinners:90-ring-with-bg" class="text-base text-primary" />
                        <span>{{ t('event_archer_fields.saving_order', 'Menyimpan urutan...') }}</span>
                    </div>
                </div>

                <!-- Loading State -->
                <div v-if="isLoading" class="p-16 text-center text-slate-400">
                    <Icon icon="svg-spinners:90-ring-with-bg" class="text-3xl mx-auto mb-2 text-primary" />
                    <div class="text-sm font-bold text-navy">{{ t('event_archer_fields.loading', 'Memuat susunan form...') }}</div>
                </div>

                <!-- Interactive Drag-and-Drop Canvas -->
                <div v-else class="p-4 sm:p-6 bg-slate-50/40">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                        
                        <!-- System Default Fields (Permanent & Locked) -->
                        <div class="col-span-1 md:col-span-12 mb-1">
                            <div class="bg-navy/5 rounded-2xl border border-navy/15 p-4 sm:p-5">
                                <div class="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-navy/10">
                                    <Icon icon="ph:lock-key-fill" class="text-navy text-base" />
                                    <h3 class="text-xs sm:text-sm font-bold text-navy">
                                        {{ t('event_archer_fields.system_fields_title', 'Data Utama Atlet') }}
                                    </h3>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                                    <div
                                        v-for="sys in systemDefaultFields"
                                        :key="sys.key"
                                        :class="getGridColClass(sys.col_span)"
                                        class="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-2"
                                    >
                                        <div class="flex items-center justify-between gap-2">
                                            <div class="flex items-center gap-2 min-w-0">
                                                <Icon :icon="sys.icon" class="text-navy text-base shrink-0" />
                                                <span class="text-xs sm:text-sm font-black text-navy truncate">{{ sys.label }}</span>
                                                <span class="text-rose-500 font-black">*</span>
                                            </div>
                                            <span class="text-[10px] font-black px-2 py-0.5 rounded bg-navy/5 text-navy border border-navy/10">
                                                {{ sys.type_label }}
                                            </span>
                                        </div>
                                        <div class="text-xs text-slate-500 leading-relaxed">
                                            {{ sys.description }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Organizer Custom Fields (Draggable & Editable) -->
                        <template v-if="fields.length > 0">
                            <div
                                v-for="(element, index) in fields"
                                :key="element.uuid"
                                :class="[
                                    getGridColClass(element.col_span || 12),
                                    draggedIndex === index ? 'opacity-40 scale-[0.99] border-dashed border-primary' : '',
                                    dropTargetIndex === index ? 'ring-2 ring-navy shadow-md' : ''
                                ]"
                                draggable="true"
                                @dragstart="onDragStart(index, $event)"
                                @dragover.prevent="onDragOver(index, $event)"
                                @drop="onDrop(index, $event)"
                                @dragend="onDragEnd"
                                class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-primary/60 transition-all flex flex-col justify-between group select-none relative overflow-hidden"
                            >
                            <!-- Card Header: Type Badge, Drag Handle & Actions -->
                            <div class="p-3 sm:p-3.5 pb-2.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 border-b border-slate-100 bg-gradient-to-r from-slate-50/60 to-white">
                                <!-- Drag Handle & Title Info -->
                                <div class="flex items-center gap-2 sm:gap-2.5 min-w-0">
                                    <div
                                        class="cursor-grab active:cursor-grabbing text-slate-400 hover:text-navy p-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                                        :title="t('event_archer_fields.drag_hint', 'Tarik ikon titik untuk memindahkan urutan')"
                                    >
                                        <Icon icon="ph:dots-six-vertical-bold" class="text-lg text-slate-400 group-hover:text-slate-600" />
                                    </div>
                                    <span class="size-6 rounded-md bg-navy text-primary font-mono text-xs font-black flex items-center justify-center shadow-2xs shrink-0">
                                        {{ index + 1 }}
                                    </span>
                                    <span
                                        class="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border truncate"
                                        :class="getElementBadgeStyle(element)"
                                    >
                                        <Icon :icon="getElementIcon(element)" class="text-sm shrink-0" />
                                        <span class="truncate">{{ getElementTypeBadge(element) }}</span>
                                    </span>
                                </div>

                                <!-- Quick Column Width Selector & Actions -->
                                <div class="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto sm:ml-0">
                                    <!-- Column Width Buttons (1/2 or Full) -->
                                    <div class="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                                        <button
                                            type="button"
                                            @click.stop="setColSpan(element, 6)"
                                            class="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-xs transition-colors cursor-pointer"
                                            :class="element.col_span === 6 ? 'bg-navy text-primary shadow-2xs font-black' : 'text-slate-600 hover:text-navy font-bold'"
                                            :title="t('event_archer_fields.col_half_title', 'Lebar Setengah (50% / 2 Kolom)')"
                                        >
                                            {{ t('event_archer_fields.col_half', '1/2') }}
                                        </button>
                                        <button
                                            type="button"
                                            @click.stop="setColSpan(element, 12)"
                                            class="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-xs transition-colors cursor-pointer"
                                            :class="(!element.col_span || element.col_span === 12) ? 'bg-navy text-primary shadow-2xs font-black' : 'text-slate-600 hover:text-navy font-bold'"
                                            :title="t('event_archer_fields.col_full_title', 'Lebar Penuh (100%)')"
                                        >
                                            {{ t('event_archer_fields.col_full', '1/1') }}
                                        </button>
                                    </div>

                                    <!-- Up / Down Reorder Buttons -->
                                    <button
                                        type="button"
                                        :disabled="index === 0 || isReordering"
                                        @click.stop="moveElement(index, -1)"
                                        class="p-1 sm:p-1.5 text-slate-500 hover:text-navy disabled:opacity-20 disabled:cursor-not-allowed rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                        :title="t('event_archer_fields.move_up', 'Geser ke Atas')"
                                    >
                                        <Icon icon="ph:caret-up-bold" class="text-sm" />
                                    </button>
                                    <button
                                        type="button"
                                        :disabled="index === fields.length - 1 || isReordering"
                                        @click.stop="moveElement(index, 1)"
                                        class="p-1 sm:p-1.5 text-slate-500 hover:text-navy disabled:opacity-20 disabled:cursor-not-allowed rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                        :title="t('event_archer_fields.move_down', 'Geser ke Bawah')"
                                    >
                                        <Icon icon="ph:caret-down-bold" class="text-sm" />
                                    </button>

                                    <!-- Edit Button -->
                                    <button
                                        type="button"
                                        @click.stop="openEditModal(element)"
                                        class="p-1 sm:p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                        :title="t('event_archer_fields.edit_field', 'Edit Pertanyaan')"
                                    >
                                        <Icon icon="ph:pencil-simple-bold" class="text-sm" />
                                    </button>

                                    <!-- Delete Button -->
                                    <button
                                        type="button"
                                        @click.stop="requestDeleteElement(element)"
                                        class="p-1 sm:p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                        :title="t('event_archer_fields.delete_field', 'Hapus Field')"
                                    >
                                        <Icon icon="ph:trash-bold" class="text-sm" />
                                    </button>
                                </div>
                            </div>

                            <!-- Card Body: Preview of Element in Canvas -->
                            <div class="p-3.5 sm:p-4">
                                <!-- 1. Section Heading (Inline Editable) -->
                                <div v-if="element.element_type === 'heading'" class="space-y-1.5">
                                    <div v-if="inlineEditingHeading === element.uuid" class="flex items-center gap-2">
                                        <span class="size-2.5 rounded-full bg-primary inline-block shrink-0"></span>
                                        <input
                                            v-model="element.label_id"
                                            @keydown.enter.prevent="saveInlineHeading(element)"
                                            @blur="saveInlineHeading(element)"
                                            class="flex-1 min-w-0 px-3 py-1.5 rounded-lg border-2 border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-base font-black text-navy outline-none bg-primary/5"
                                            placeholder="Ketik judul seksi..."
                                            autofocus
                                        />
                                        <button
                                            type="button"
                                            @click.stop="saveInlineHeading(element)"
                                            class="p-2 rounded-lg bg-navy text-primary hover:bg-navy/90 text-xs font-bold shrink-0 cursor-pointer"
                                            title="Simpan Judul"
                                        >
                                            <Icon icon="ph:check-bold" class="text-sm" />
                                        </button>
                                    </div>
                                    <div
                                        v-else
                                        @click="startInlineHeadingEdit(element)"
                                        class="group/heading text-sm sm:text-base font-black text-navy border-b border-slate-200 pb-1.5 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-50/80 -mx-1 px-1 rounded-lg transition-colors"
                                        title="Klik untuk langsung mengedit judul"
                                    >
                                        <div class="flex items-center gap-2 min-w-0">
                                            <span class="size-2.5 rounded-full bg-primary inline-block shrink-0"></span>
                                            <span class="truncate">{{ element.label_id || 'Judul Seksi' }}</span>
                                        </div>
                                        <div class="flex items-center gap-1 text-slate-400 opacity-0 group-hover/heading:opacity-100 transition-opacity text-xs font-medium shrink-0">
                                            <Icon icon="ph:pencil-simple-bold" class="text-sm text-blue-600" />
                                            <span class="text-blue-600 font-bold hidden sm:inline">Klik untuk edit</span>
                                        </div>
                                    </div>
                                    <div v-if="element.description_id" class="text-xs sm:text-sm text-slate-500 leading-relaxed">
                                        {{ element.description_id }}
                                    </div>
                                </div>

                                <!-- 2. Divider Line -->
                                <div v-else-if="element.element_type === 'divider'" class="py-1">
                                    <hr class="border-t border-purple-200/80" />
                                    <div class="text-xs text-purple-600 text-center font-mono mt-1 font-bold">{{ t('event_archer_fields.element_divider', 'Garis Pemisah') }}</div>
                                </div>

                                <!-- 3. Notice / Alert -->
                                <div
                                    v-else-if="element.element_type === 'notice'"
                                    class="rounded-xl p-3.5 border text-xs sm:text-sm"
                                    :class="getNoticeStyle(element.style_config?.variant || 'info')"
                                >
                                    <div class="flex items-start gap-2.5">
                                        <Icon :icon="getNoticeIcon(element.style_config?.variant || 'info')" class="text-base shrink-0 mt-0.5" />
                                        <div>
                                            <div class="font-bold">{{ element.label_id || t('event_archer_fields.element_notice', 'Catatan') }}</div>
                                            <div v-if="element.description_id" class="text-xs sm:text-sm opacity-90 mt-1 leading-relaxed">{{ element.description_id }}</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 4. Input Data Field -->
                                <div v-else class="space-y-2">
                                    <div class="flex items-center justify-between gap-2">
                                        <div class="text-sm font-black text-navy truncate">
                                            {{ element.label_id }}
                                            <span v-if="element.is_required" class="text-rose-500 font-black">*</span>
                                        </div>
                                        <div v-if="element.is_required" class="shrink-0">
                                            <span class="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200">
                                                {{ t('event_archer_fields.required_badge', 'Wajib') }}
                                            </span>
                                        </div>
                                    </div>

                                    <div v-if="element.options && element.options.length > 0" class="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <Icon icon="ph:list-bullets-bold" class="text-sm text-slate-400" />
                                        <span>{{ t('event_archer_fields.options_count', { count: element.options.length }, `${element.options.length} opsi`) }}</span>
                                    </div>

                                    <div v-if="element.field_type === 'file' && element.style_config?.file_config" class="text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200/60 inline-flex items-center gap-1.5 font-medium">
                                        <Icon icon="ph:file-arrow-up-bold" class="text-sm" />
                                        <span>{{ getFileConfigSummary(element) }}</span>
                                    </div>

                                    <div v-if="element.description_id" class="text-xs sm:text-sm text-slate-500 line-clamp-2 italic leading-relaxed">
                                        "{{ element.description_id }}"
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                        <!-- Empty State for Custom Fields -->
                        <div v-else class="col-span-1 md:col-span-12">
                            <div class="p-8 sm:p-12 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 shadow-2xs">
                                <div class="size-14 rounded-2xl bg-primary/10 border border-primary/20 text-navy flex items-center justify-center mx-auto mb-3 shadow-2xs">
                                    <Icon icon="ph:textbox-bold" class="text-2xl text-navy" />
                                </div>
                                <h4 class="text-sm sm:text-base font-bold text-navy mb-1">{{ t('event_archer_fields.empty_canvas_title', 'Belum Ada Pertanyaan Tambahan') }}</h4>
                                <div class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
                                    {{ t('event_archer_fields.empty_canvas_desc', 'Formulir saat ini hanya menggunakan Data Utama Atlet di atas. Tambahkan pertanyaan khusus atau kolom berkas tambahan sesuai kebutuhan turnamen Anda.') }}
                                </div>
                                <div class="flex items-center justify-center gap-3">
                                    <BaseButton variant="primary" icon="ph:plus-bold" class="text-xs sm:text-sm font-bold px-4 h-9 shadow-md shadow-primary/20" @click="openCreateFieldModal">
                                        {{ t('event_archer_fields.add_field_btn', 'Tambah Field') }}
                                    </BaseButton>
                                    <BaseButton variant="secondary" icon="ph:squares-four-bold" class="text-xs sm:text-sm font-bold px-4 h-9 border-slate-200" @click="showAllElementsModal = true">
                                        {{ isEn ? 'Browse Presets' : 'Jelajahi Preset' }}
                                    </BaseButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ==================================================================== -->
        <!-- TAB 2: LIVE PREVIEW (FULLY INTERACTIVE)                              -->
        <!-- ==================================================================== -->
        <div v-else-if="activeTab === 'preview'" class="space-y-4">
            <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:eye-bold" class="text-navy text-xl" />
                        <h2 class="text-base sm:text-lg font-black text-navy">{{ t('event_archer_fields.preview_title', 'Pratinjau Formulir Pendaftaran') }}</h2>
                    </div>
                    <div class="text-xs sm:text-sm text-slate-500 mt-1">{{ t('event_archer_fields.preview_desc', 'Tampilan formulir pendaftaran atlet lengkap (data utama + pertanyaan khusus) seperti yang dilihat oleh peserta.') }}</div>
                </div>

                <a
                    :href="publicRegisterUrl"
                    target="_blank"
                    class="px-4 py-2.5 rounded-xl bg-navy text-primary hover:bg-navy/90 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
                >
                    <Icon icon="ph:arrow-square-out-bold" class="text-base" />
                    <span>{{ t('event_archer_fields.preview_open_public', 'Buka Halaman Publik') }}</span>
                </a>
            </div>

            <!-- Browser Mockup Container -->
            <div class="p-3 sm:p-8 bg-slate-100/80 rounded-2xl border border-slate-200/80 flex justify-center">
                <div class="w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden">
                    <!-- Browser Bar with REAL dynamic URL -->
                    <div class="px-4 sm:px-5 py-3 bg-slate-900 text-white flex items-center gap-3 border-b border-slate-800">
                        <div class="flex items-center gap-1.5 shrink-0">
                            <span class="size-3 rounded-full bg-rose-500 inline-block"></span>
                            <span class="size-3 rounded-full bg-amber-500 inline-block"></span>
                            <span class="size-3 rounded-full bg-emerald-500 inline-block"></span>
                        </div>
                        <div class="flex-1 min-w-0 bg-slate-800 rounded-lg px-3 py-1 text-xs text-slate-300 font-mono flex items-center justify-between gap-2">
                            <span class="truncate">{{ publicRegisterUrl }}</span>
                            <a :href="publicRegisterUrl" target="_blank" class="text-slate-400 hover:text-primary shrink-0 transition-colors" title="Buka URL">
                                <Icon icon="ph:arrow-square-out-bold" class="text-sm" />
                            </a>
                        </div>
                    </div>

                    <!-- Preview Form Body -->
                    <div class="p-5 sm:p-8 space-y-6">
                        <!-- Header Preview -->
                        <div class="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h3 class="text-base sm:text-lg font-black text-navy">{{ t('event_archer_fields.preview_form_header', 'Formulir Pendaftaran Atlet') }}</h3>
                                <div class="text-xs sm:text-sm text-slate-500 mt-0.5">{{ t('event_archer_fields.preview_form_header_desc', 'Lengkapi identitas atlet dan persyaratan administrasi resmi turnamen.') }}</div>
                            </div>
                            <span class="px-3 py-1 rounded-lg bg-navy/5 text-navy font-black text-xs self-start sm:self-auto">{{ t('event_archer_fields.preview_step_badge', 'Langkah 1: Data Atlet') }}</span>
                        </div>

                        <!-- UNIFIED FORM: System Fields + Custom Fields (Interactive) -->
                        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <!-- 1. System Field: Nama Lengkap -->
                            <div class="col-span-1 md:col-span-6 flex flex-col gap-1.5">
                                <label class="block text-xs sm:text-sm font-bold text-navy">
                                    {{ t('event_archer_fields.sys_full_name', 'Nama Lengkap Atlet') }} <span class="text-rose-500">*</span>
                                </label>
                                <BaseInput
                                    v-model="previewForm.full_name"
                                    placeholder="Contoh: Muhammad Fadhil"
                                    icon="ph:user-bold"
                                />
                            </div>

                            <!-- 2. System Field: Jenis Kelamin -->
                            <div class="col-span-1 md:col-span-6 flex flex-col gap-1.5">
                                <label class="block text-xs sm:text-sm font-bold text-navy">
                                    {{ t('event_archer_fields.sys_gender', 'Jenis Kelamin') }} <span class="text-rose-500">*</span>
                                </label>
                                <div class="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        @click="previewForm.gender = 'male'"
                                        class="h-11 px-4 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                                        :class="previewForm.gender === 'male' ? 'border-navy bg-navy text-primary shadow-xs' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
                                    >
                                        <Icon icon="ph:gender-male-bold" class="text-base" />
                                        <span>{{ t('event_archer_fields.preview_male', 'Laki-laki') }}</span>
                                    </button>
                                    <button
                                        type="button"
                                        @click="previewForm.gender = 'female'"
                                        class="h-11 px-4 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                                        :class="previewForm.gender === 'female' ? 'border-navy bg-navy text-primary shadow-xs' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
                                    >
                                        <Icon icon="ph:gender-female-bold" class="text-base" />
                                        <span>{{ t('event_archer_fields.preview_female', 'Perempuan') }}</span>
                                    </button>
                                </div>
                            </div>

                            <!-- 3. System Field: Klub / Kontingen -->
                            <div class="col-span-1 md:col-span-12 flex flex-col gap-1.5">
                                <label class="block text-xs sm:text-sm font-bold text-navy">
                                    {{ t('event_archer_fields.sys_club', 'Klub / Asal Kontingen / Sekolah') }} <span class="text-rose-500">*</span>
                                </label>
                                <BaseSelect
                                    v-model="previewForm.club_id"
                                    :items="[
                                        { label: 'Archeris Archery Club Jakarta', value: '1' },
                                        { label: 'Fast Archery Club Bandung', value: '2' },
                                        { label: 'Target Pro Academy Surabaya', value: '3' }
                                    ]"
                                    placeholder="Pilih atau cari klub..."
                                />
                            </div>

                            <!-- 4. Dynamic Custom Elements Configured by Organizer -->
                            <template v-for="element in fields.filter(f => f.is_active)" :key="element.uuid">
                                <!-- Heading -->
                                <div v-if="element.element_type === 'heading'" :class="getGridColClass(element.col_span || 12)" class="pt-3">
                                    <h3 class="text-base sm:text-lg font-black text-navy border-b pb-2 border-slate-200 flex items-center gap-2">
                                        <span class="size-2 rounded-full bg-primary inline-block"></span>
                                        <span>{{ element.label_id }}</span>
                                    </h3>
                                    <div v-if="element.description_id" class="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">{{ element.description_id }}</div>
                                </div>

                                <!-- Divider -->
                                <div v-else-if="element.element_type === 'divider'" :class="getGridColClass(element.col_span || 12)">
                                    <hr class="border-t border-slate-200 my-2" />
                                </div>

                                <!-- Notice -->
                                <div
                                    v-else-if="element.element_type === 'notice'"
                                    class="rounded-xl p-4 border"
                                    :class="[getGridColClass(element.col_span || 12), getNoticeStyle(element.style_config?.variant || 'info')]"
                                >
                                    <div class="flex items-start gap-3 text-xs sm:text-sm">
                                        <Icon :icon="getNoticeIcon(element.style_config?.variant || 'info')" class="text-lg shrink-0 mt-0.5" />
                                        <div>
                                            <div class="font-bold">{{ element.label_id }}</div>
                                            <div v-if="element.description_id" class="opacity-90 mt-1 leading-relaxed">{{ element.description_id }}</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Input Fields -->
                                <div v-else :class="getGridColClass(element.col_span || 12)" class="flex flex-col gap-1.5">
                                    <label class="block text-xs sm:text-sm font-bold text-navy">
                                        {{ element.label_id }}
                                        <span v-if="element.is_required" class="text-rose-500">*</span>
                                    </label>

                                    <!-- Text -->
                                    <BaseInput
                                        v-if="element.field_type === 'text'"
                                        v-model="previewForm[element.field_key]"
                                        :placeholder="element.placeholder_id || ('Masukkan ' + (element.label_id || ''))"
                                    />

                                    <!-- Number -->
                                    <BaseInput
                                        v-else-if="element.field_type === 'number'"
                                        v-model="previewForm[element.field_key]"
                                        type="number"
                                        :placeholder="element.placeholder_id || '0'"
                                    />

                                    <!-- Textarea -->
                                    <textarea
                                        v-else-if="element.field_type === 'textarea'"
                                        v-model="previewForm[element.field_key]"
                                        :placeholder="element.placeholder_id || 'Tuliskan isian Anda di sini...'"
                                        rows="3"
                                        class="w-full p-3.5 rounded-xl border border-slate-200 bg-white focus:border-navy focus:ring-2 focus:ring-navy/10 text-xs sm:text-sm text-navy outline-none transition-all placeholder:text-slate-400"
                                    ></textarea>

                                    <!-- Custom Select Dropdown -->
                                    <BaseSelect
                                        v-else-if="element.field_type === 'select'"
                                        v-model="previewForm[element.field_key]"
                                        :items="formatSelectOptions(element.options)"
                                        :placeholder="element.placeholder_id || '-- Pilih Salah Satu --'"
                                    />

                                    <!-- Radio Chips -->
                                    <div v-else-if="element.field_type === 'radio'" class="flex flex-wrap gap-2 pt-1">
                                        <button
                                            v-for="opt in element.options"
                                            :key="opt"
                                            type="button"
                                            @click="previewForm[element.field_key] = opt"
                                            class="h-10 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer select-none"
                                            :class="previewForm[element.field_key] === opt ? 'border-navy bg-navy text-primary shadow-xs' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'"
                                        >
                                            <Icon :icon="previewForm[element.field_key] === opt ? 'ph:radio-button-fill' : 'ph:circle-bold'" class="text-base" />
                                            <span>{{ opt }}</span>
                                        </button>
                                    </div>

                                    <!-- Checkbox Chips -->
                                    <div v-else-if="element.field_type === 'checkbox'" class="flex flex-wrap gap-2 pt-1">
                                        <button
                                            v-for="opt in element.options"
                                            :key="opt"
                                            type="button"
                                            @click="togglePreviewCheckbox(element.field_key, opt)"
                                            class="h-10 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer select-none"
                                            :class="isPreviewCheckboxChecked(element.field_key, opt) ? 'border-navy bg-navy text-primary shadow-xs' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'"
                                        >
                                            <Icon :icon="isPreviewCheckboxChecked(element.field_key, opt) ? 'ph:check-square-fill' : 'ph:square-bold'" class="text-base" />
                                            <span>{{ opt }}</span>
                                        </button>
                                    </div>

                                    <!-- Date -->
                                    <BaseInput
                                        v-else-if="element.field_type === 'date'"
                                        v-model="previewForm[element.field_key]"
                                        type="date"
                                        icon="ph:calendar-blank-bold"
                                    />

                                    <!-- Date Range -->
                                    <div v-else-if="element.field_type === 'daterange'" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div class="flex flex-col gap-1">
                                            <span class="text-[11px] font-bold text-slate-500">Mulai (Start Date)</span>
                                            <BaseInput
                                                v-model="previewForm[element.field_key + '_start']"
                                                type="date"
                                                icon="ph:calendar-blank-bold"
                                            />
                                        </div>
                                        <div class="flex flex-col gap-1">
                                            <span class="text-[11px] font-bold text-slate-500">Selesai (End Date)</span>
                                            <BaseInput
                                                v-model="previewForm[element.field_key + '_end']"
                                                type="date"
                                                icon="ph:calendar-blank-bold"
                                            />
                                        </div>
                                    </div>

                                    <!-- Time Picker -->
                                    <BaseInput
                                        v-else-if="element.field_type === 'time'"
                                        v-model="previewForm[element.field_key]"
                                        type="time"
                                        icon="ph:clock-bold"
                                    />

                                    <!-- DateTime Picker -->
                                    <BaseInput
                                        v-else-if="element.field_type === 'datetime'"
                                        v-model="previewForm[element.field_key]"
                                        type="datetime-local"
                                        icon="ph:calendar-check-bold"
                                    />

                                    <!-- File Upload Box (Interactive Test Simulation) -->
                                    <div
                                        v-else-if="element.field_type === 'file'"
                                        class="border-2 border-dashed border-primary/50 hover:border-primary rounded-2xl p-5 text-center bg-primary/5 transition-all relative group"
                                    >
                                        <template v-if="previewForm[element.field_key]">
                                            <div class="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-primary/30 text-left">
                                                <div class="flex items-center gap-2.5 min-w-0">
                                                    <div class="size-9 rounded-lg bg-primary/20 text-navy flex items-center justify-center shrink-0">
                                                        <Icon icon="ph:file-check-bold" class="text-xl" />
                                                    </div>
                                                    <div class="min-w-0">
                                                        <div class="text-xs sm:text-sm font-bold text-navy truncate">{{ previewForm[element.field_key].name }}</div>
                                                        <div class="text-[11px] text-slate-500">{{ previewForm[element.field_key].size }}</div>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    @click="previewForm[element.field_key] = null"
                                                    class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                                                    title="Hapus berkas simulasi"
                                                >
                                                    <Icon icon="ph:trash-bold" class="text-base" />
                                                </button>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <input
                                                type="file"
                                                :id="`preview_file_${element.field_key}`"
                                                @change="handlePreviewFileUpload($event, element.field_key)"
                                                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <Icon icon="ph:cloud-arrow-up-bold" class="text-3xl text-navy mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                                            <div class="text-xs sm:text-sm font-bold text-navy">{{ t('event_archer_fields.file_upload_drag', 'Klik atau seret file ke sini') }}</div>
                                            <div class="text-xs text-slate-500 mt-1">
                                                {{ getFileConfigHint(element) }}
                                            </div>
                                        </template>
                                    </div>

                                    <div v-if="element.description_id" class="text-xs text-slate-500 mt-1 leading-relaxed">
                                        {{ element.description_id }}
                                    </div>
                                </div>
                            </template>
                        </div>

                        <!-- Preview Footer Button -->
                        <div class="pt-6 border-t border-slate-100 flex justify-end">
                            <BaseButton
                                type="button"
                                variant="navy"
                                size="md"
                                icon-right="ph:arrow-right-bold"
                                class="text-sm font-bold shadow-md shadow-navy/20 cursor-pointer active:scale-95"
                                @click="testPreviewSubmit"
                            >
                                {{ t('event_archer_fields.preview_continue_btn', 'Lanjut ke Kategori') }}
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ==================================================================== -->
        <!-- CREATE / EDIT FIELD MODAL DIALOG                                     -->
        <!-- ==================================================================== -->
        <BaseDialogForm
            v-model="showEditModal"
            :header="isEditing ? t('event_archer_fields.modal_edit_title', 'Edit Bidang Formulir') : t('event_archer_fields.modal_create_title', 'Tambah Bidang Formulir')"
            size="md"
            :hide-footer="true"
        >
            <form @submit.prevent="saveField" class="flex flex-col gap-4 py-1">
                <!-- Label / Nama Kolom -->
                <div>
                    <label class="block text-xs sm:text-sm font-bold text-navy mb-1.5">
                        {{ t('event_archer_fields.label_id', 'Nama / Label Kolom') }} <span class="text-rose-500">*</span>
                    </label>
                    <BaseInput
                        v-model="formData.label_id"
                        :placeholder="t('event_archer_fields.label_id_placeholder', 'Contoh: Nomor Induk Kependudukan (NIK) / Ukuran Jersey')"
                        required
                    />
                </div>

                <!-- Field Type -->
                <div>
                    <label class="block text-xs sm:text-sm font-bold text-navy mb-1.5">
                        {{ t('event_archer_fields.field_type', 'Tipe Input') }} <span class="text-rose-500">*</span>
                    </label>
                    <BaseSelect
                        v-model="formData.field_type"
                        :items="fieldTypeOptions"
                        :placeholder="t('event_archer_fields.field_type_placeholder', 'Pilih tipe input')"
                        required
                    />
                </div>

                <!-- Options Builder (for select, radio, checkbox) -->
                <div v-if="['select', 'radio', 'checkbox'].includes(formData.field_type)" class="p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
                    <label class="block text-xs sm:text-sm font-bold text-navy mb-1">
                        {{ t('event_archer_fields.options_label', 'Pilihan Jawaban') }} <span class="text-rose-500">*</span>
                    </label>
                    <div class="text-xs sm:text-sm text-slate-500 mb-3">{{ t('event_archer_fields.options_desc', 'Masukkan pilihan yang dapat dipilih pemanah.') }}</div>

                    <div class="flex items-center gap-2 mb-3">
                        <BaseInput
                            v-model="newOptionInput"
                            :placeholder="t('event_archer_fields.option_input_placeholder', 'Ketik opsi (contoh: XL atau Dewasa) lalu klik Tambah')"
                            @keydown.enter.prevent="addOption"
                            class="flex-1"
                        />
                        <BaseButton type="button" variant="primary" icon="ph:plus-bold" class="text-xs sm:text-sm font-bold h-10 px-4 shadow-sm shadow-primary/20" @click="addOption">
                            {{ t('event_archer_fields.add_option_btn', 'Tambah') }}
                        </BaseButton>
                    </div>

                    <div class="flex flex-wrap gap-2 min-h-[32px]">
                        <span
                            v-for="(opt, oIdx) in formData.options"
                            :key="oIdx"
                            class="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/15 border border-primary/30 rounded-xl text-xs sm:text-sm font-black text-navy shadow-2xs"
                        >
                            {{ opt }}
                            <button type="button" @click="removeOption(oIdx)" class="text-navy/70 hover:text-rose-600 cursor-pointer">
                                <Icon icon="ph:x-bold" class="text-xs" />
                            </button>
                        </span>
                        <span v-if="formData.options.length === 0" class="text-xs text-rose-500 font-bold italic">
                            {{ t('event_archer_fields.no_options_warning', 'Belum ada opsi yang ditambahkan.') }}
                        </span>
                    </div>
                </div>

                <!-- File Upload Specific Configuration Box -->
                <div v-if="formData.field_type === 'file'" class="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-3">
                    <div class="flex items-center gap-2 pb-2 border-b border-purple-200/60">
                        <Icon icon="ph:file-gear-bold" class="text-purple-700 text-base" />
                        <h4 class="text-xs sm:text-sm font-bold text-navy">{{ t('event_archer_fields.file_config_title', 'Konfigurasi Berkas & Dokumen') }}</h4>
                    </div>

                    <!-- Allowed Formats -->
                    <div>
                        <label class="block text-xs font-bold text-navy mb-1">
                            {{ t('event_archer_fields.file_allowed_types', 'Format Berkas yang Diizinkan') }}
                        </label>
                        <BaseSelect
                            v-model="formData.style_config.file_config.allowed_types"
                            :items="[
                                { label: t('event_archer_fields.file_type_all', 'Semua Format (Foto & Dokumen)'), value: 'all' },
                                { label: t('event_archer_fields.file_type_images', 'Gambar (JPG, PNG, WEBP)'), value: 'images' },
                                { label: t('event_archer_fields.file_type_docs', 'Dokumen (PDF, DOC, DOCX)'), value: 'docs' }
                            ]"
                        />
                    </div>

                    <!-- Max Size & Max Files -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-bold text-navy mb-1">
                                {{ t('event_archer_fields.file_max_size', 'Ukuran Maksimal Berkas') }}
                            </label>
                            <BaseSelect
                                v-model="formData.style_config.file_config.max_size_mb"
                                :items="[
                                    { label: '2 MB', value: 2 },
                                    { label: '5 MB (Standar)', value: 5 },
                                    { label: '10 MB', value: 10 },
                                    { label: '25 MB', value: 25 }
                                ]"
                            />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-navy mb-1">
                                {{ t('event_archer_fields.file_max_count', 'Jumlah Berkas Maksimal') }}
                            </label>
                            <BaseSelect
                                v-model="formData.style_config.file_config.max_files"
                                :items="[
                                    { label: t('event_archer_fields.file_single', '1 Berkas (Tunggal)'), value: 1 },
                                    { label: t('event_archer_fields.file_multiple_3', 'Hingga 3 Berkas'), value: 3 },
                                    { label: t('event_archer_fields.file_multiple_5', 'Hingga 5 Berkas'), value: 5 }
                                ]"
                            />
                        </div>
                    </div>
                </div>

                <!-- Placeholder & Description -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs sm:text-sm font-bold text-navy mb-1.5">
                            {{ t('event_archer_fields.placeholder_label', 'Teks Contoh Isian') }}
                        </label>
                        <BaseInput
                            v-model="formData.placeholder_id"
                            :placeholder="t('event_archer_fields.placeholder_input', 'Contoh: 16 digit angka...')"
                        />
                    </div>
                    <div>
                        <label class="block text-xs sm:text-sm font-bold text-navy mb-1.5">
                            {{ t('event_archer_fields.tooltip_label', 'Keterangan Petunjuk') }}
                        </label>
                        <BaseInput
                            v-model="formData.description_id"
                            :placeholder="t('event_archer_fields.tooltip_placeholder', 'Contoh: Wajib untuk verifikasi usia...')"
                        />
                    </div>
                </div>

                <!-- Custom Styled Toggle Button (No Native Checkbox) -->
                <div class="pt-1">
                    <button
                        type="button"
                        @click="formData.is_required = !formData.is_required"
                        class="w-full p-3.5 rounded-xl border-2 flex items-center justify-between transition-all cursor-pointer select-none text-left"
                        :class="formData.is_required ? 'bg-primary/15 border-navy text-navy shadow-2xs' : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:border-slate-300'"
                    >
                        <div class="flex items-center gap-3">
                            <div
                                class="size-5 rounded-md flex items-center justify-center transition-colors shrink-0"
                                :class="formData.is_required ? 'bg-navy text-primary' : 'border border-slate-300 bg-white text-transparent'"
                            >
                                <Icon icon="ph:check-bold" class="text-xs" />
                            </div>
                            <div>
                                <div class="text-xs sm:text-sm font-bold text-navy">{{ t('event_archer_fields.is_required_label', 'Wajib Diisi') }}</div>
                                <div class="text-xs text-slate-500 mt-0.5">{{ t('event_archer_fields.is_required_hint', 'Peserta harus mengisi kolom ini saat pendaftaran') }}</div>
                            </div>
                        </div>
                        <span
                            class="text-xs font-black px-2.5 py-1 rounded-lg transition-colors shrink-0"
                            :class="formData.is_required ? 'bg-navy text-primary shadow-2xs' : 'bg-slate-200/80 text-slate-600'"
                        >
                            {{ formData.is_required ? t('event_archer_fields.required_badge', 'Wajib') : t('event_archer_fields.optional_badge', 'Opsional') }}
                        </span>
                    </button>
                </div>

                <!-- Submit Button Only (No Cancel Button and No Extra Footer) -->
                <div class="pt-3">
                    <BaseButton type="submit" variant="primary" :loading="isSaving" class="w-full text-xs sm:text-sm font-black h-12 rounded-xl shadow-md shadow-primary/20 flex items-center justify-center gap-2">
                        <Icon icon="ph:check-circle-bold" class="text-lg" />
                        <span>{{ isEditing ? t('event_archer_fields.save', 'Simpan Perubahan') : t('event_archer_fields.add', 'Simpan Field') }}</span>
                    </BaseButton>
                </div>
            </form>
        </BaseDialogForm>

        <!-- ==================================================================== -->
        <!-- ALL ELEMENTS CATALOG DIALOG MODAL (2 TABS: PRESETS & ELEMENTS)        -->
        <!-- ==================================================================== -->
        <BaseDialogForm
            v-model="showAllElementsModal"
            :header="t('event_archer_fields.catalog_modal_title', 'Pilih Jenis Elemen Formulir')"
            size="xl"
            :hide-footer="true"
        >
            <div class="space-y-5 py-1">
                <!-- Modal Internal Tabs -->
                <div class="flex items-center gap-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80">
                    <button
                        type="button"
                        @click="catalogActiveTab = 'preset'"
                        class="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer select-none"
                        :class="catalogActiveTab === 'preset' ? 'bg-navy text-primary shadow-xs font-black' : 'text-slate-600 hover:text-navy'"
                    >
                        <Icon icon="ph:lightning-fill" class="text-base" />
                        <span>{{ isEn ? 'Browse Presets' : 'Jelajahi Preset' }}</span>
                        <span class="px-2 py-0.5 rounded-full text-[11px] font-mono" :class="catalogActiveTab === 'preset' ? 'bg-primary/20 text-primary' : 'bg-slate-200 text-slate-700'">
                            {{ availablePresets.length }}
                        </span>
                    </button>
                    <button
                        type="button"
                        @click="catalogActiveTab = 'element'"
                        class="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer select-none"
                        :class="catalogActiveTab === 'element' ? 'bg-navy text-primary shadow-xs font-black' : 'text-slate-600 hover:text-navy'"
                    >
                        <Icon icon="ph:plus-circle-bold" class="text-base" />
                        <span>{{ t('event_archer_fields.tab_elements_catalog', 'Buat Elemen Baru') }}</span>
                    </button>
                </div>

                <!-- TAB 1: PRESET SIAP PAKAI -->
                <div v-if="catalogActiveTab === 'preset'" class="space-y-4">
                    <div class="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        {{ t('event_archer_fields.cat_presets_desc', 'Kumpulan kolom data turnamen yang siap pakai tanpa perlu konfigurasi dari awal.') }}
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                        <div
                            v-for="preset in availablePresets"
                            :key="preset.key"
                            class="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-navy/40 transition-all flex flex-col justify-between gap-3 shadow-2xs group"
                        >
                            <div class="flex items-start gap-3 min-w-0">
                                <div class="size-10 rounded-xl flex items-center justify-center text-xl shrink-0" :class="getPresetIconStyle(preset.key)">
                                    <Icon :icon="preset.icon" />
                                </div>
                                <div class="min-w-0">
                                    <div class="text-xs sm:text-sm font-black text-navy leading-snug">{{ getPresetLabel(preset) }}</div>
                                    <div class="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{{ getPresetDesc(preset) }}</div>
                                </div>
                            </div>
                            <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
                                <span class="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                    {{ getFieldTypeLabel(preset.field_type) }}
                                </span>
                                <BaseButton
                                    type="button"
                                    variant="primary"
                                    size="sm"
                                    :disabled="isPresetAdded(preset.field_key) || isSaving"
                                    class="h-8 px-3 text-xs font-black shrink-0"
                                    @click="applyPresetFromModal(preset)"
                                >
                                    {{ isPresetAdded(preset.field_key) ? t('event_archer_fields.preset_used_badge', 'Sudah Ada') : t('event_archer_fields.preset_use_btn', '+ Pakai') }}
                                </BaseButton>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TAB 2: BUAT ELEMEN BARU (KOSONG DARI AWAL) -->
                <div v-else-if="catalogActiveTab === 'element'" class="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
                    <!-- Group 1: Input Data Peserta -->
                    <div>
                        <div class="flex items-center gap-2 mb-2">
                            <Icon icon="ph:textbox-bold" class="text-navy text-base" />
                            <h4 class="text-xs sm:text-sm font-black text-navy">{{ t('event_archer_fields.cat_input_data', 'Input Data Peserta') }}</h4>
                        </div>
                        <div class="text-xs text-slate-500 mb-3">{{ t('event_archer_fields.cat_input_data_desc', 'Tipe kolom input data yang akan diisi oleh peserta turnamen.') }}</div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            <!-- 1. Teks Singkat -->
                            <button
                                type="button"
                                @click="openCreateFieldModalWithType('text')"
                                class="p-4 rounded-2xl border border-slate-200 bg-white hover:border-navy hover:bg-slate-50/80 transition-all text-left flex flex-col justify-between gap-3 shadow-2xs group cursor-pointer"
                            >
                                <div class="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                                    <Icon icon="ph:textbox-bold" />
                                </div>
                                <div>
                                    <div class="text-xs sm:text-sm font-black text-navy">{{ t('event_archer_fields.elem_text_title', 'Teks Singkat') }}</div>
                                    <div class="text-xs text-slate-500 mt-1 leading-relaxed">{{ t('event_archer_fields.elem_text_desc', 'Nama, NIK, NISN, kota, dll.') }}</div>
                                </div>
                            </button>

                            <!-- 2. Textarea -->
                            <button
                                type="button"
                                @click="openCreateFieldModalWithType('textarea')"
                                class="p-4 rounded-2xl border border-slate-200 bg-white hover:border-navy hover:bg-slate-50/80 transition-all text-left flex flex-col justify-between gap-3 shadow-2xs group cursor-pointer"
                            >
                                <div class="size-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                                    <Icon icon="ph:article-bold" />
                                </div>
                                <div>
                                    <div class="text-xs sm:text-sm font-black text-navy">{{ t('event_archer_fields.elem_textarea_title', 'Teks Panjang / Catatan') }}</div>
                                    <div class="text-xs text-slate-500 mt-1 leading-relaxed">{{ t('event_archer_fields.elem_textarea_desc', 'Alamat, catatan alat, spesifikasi.') }}</div>
                                </div>
                            </button>

                            <!-- 3. Angka -->
                            <button
                                type="button"
                                @click="openCreateFieldModalWithType('number')"
                                class="p-4 rounded-2xl border border-slate-200 bg-white hover:border-navy hover:bg-slate-50/80 transition-all text-left flex flex-col justify-between gap-3 shadow-2xs group cursor-pointer"
                            >
                                <div class="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                                    <Icon icon="ph:hash-bold" />
                                </div>
                                <div>
                                    <div class="text-xs sm:text-sm font-black text-navy">{{ t('event_archer_fields.elem_number_title', 'Angka (Number)') }}</div>
                                    <div class="text-xs text-slate-500 mt-1 leading-relaxed">{{ t('event_archer_fields.elem_number_desc', 'Usia, draw weight, tinggi badan.') }}</div>
                                </div>
                            </button>

                            <!-- 4. Pilihan Dropdown -->
                            <button
                                type="button"
                                @click="openCreateFieldModalWithType('select')"
                                class="p-4 rounded-2xl border border-slate-200 bg-white hover:border-navy hover:bg-slate-50/80 transition-all text-left flex flex-col justify-between gap-3 shadow-2xs group cursor-pointer"
                            >
                                <div class="size-10 rounded-xl bg-primary/25 text-navy flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                                    <Icon icon="ph:list-bullets-bold" />
                                </div>
                                <div>
                                    <div class="text-xs sm:text-sm font-black text-navy">{{ t('event_archer_fields.elem_select_title', 'Pilihan Dropdown') }}</div>
                                    <div class="text-xs text-slate-500 mt-1 leading-relaxed">{{ t('event_archer_fields.elem_select_desc', 'Pilih salah satu dari menu drop.') }}</div>
                                </div>
                            </button>

                            <!-- 5. Radio -->
                            <button
                                type="button"
                                @click="openCreateFieldModalWithType('radio')"
                                class="p-4 rounded-2xl border border-slate-200 bg-white hover:border-navy hover:bg-slate-50/80 transition-all text-left flex flex-col justify-between gap-3 shadow-2xs group cursor-pointer"
                            >
                                <div class="size-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                                    <Icon icon="ph:radio-button-bold" />
                                </div>
                                <div>
                                    <div class="text-xs sm:text-sm font-black text-navy">{{ t('event_archer_fields.elem_radio_title', 'Pilihan Tunggal (Radio)') }}</div>
                                    <div class="text-xs text-slate-500 mt-1 leading-relaxed">{{ t('event_archer_fields.elem_radio_desc', 'Pilihan tombol bulat 1 opsi.') }}</div>
                                </div>
                            </button>

                            <!-- 6. Checkbox -->
                            <button
                                type="button"
                                @click="openCreateFieldModalWithType('checkbox')"
                                class="p-4 rounded-2xl border border-slate-200 bg-white hover:border-navy hover:bg-slate-50/80 transition-all text-left flex flex-col justify-between gap-3 shadow-2xs group cursor-pointer"
                            >
                                <div class="size-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                                    <Icon icon="ph:check-square-bold" />
                                </div>
                                <div>
                                    <div class="text-xs sm:text-sm font-black text-navy">{{ t('event_archer_fields.elem_checkbox_title', 'Pilihan Ganda (Checkbox)') }}</div>
                                    <div class="text-xs text-slate-500 mt-1 leading-relaxed">{{ t('event_archer_fields.elem_checkbox_desc', 'Bisa centang lebih dari 1 pilihan.') }}</div>
                                </div>
                            </button>

                            <!-- 7. Tanggal -->
                            <button
                                type="button"
                                @click="openCreateFieldModalWithType('date')"
                                class="p-4 rounded-2xl border border-slate-200 bg-white hover:border-navy hover:bg-slate-50/80 transition-all text-left flex flex-col justify-between gap-3 shadow-2xs group cursor-pointer"
                            >
                                <div class="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                                    <Icon icon="ph:calendar-blank-bold" />
                                </div>
                                <div>
                                    <div class="text-xs sm:text-sm font-black text-navy">{{ t('event_archer_fields.elem_date_title', 'Pemilih Tanggal') }}</div>
                                    <div class="text-xs text-slate-500 mt-1 leading-relaxed">{{ t('event_archer_fields.elem_date_desc', 'Tanggal lahir, tanggal masa berlaku.') }}</div>
                                </div>
                            </button>

                            <!-- 8. Rentang Tanggal (Date Range) -->
                            <button
                                type="button"
                                @click="openCreateFieldModalWithType('daterange')"
                                class="p-4 rounded-2xl border border-slate-200 bg-white hover:border-navy hover:bg-slate-50/80 transition-all text-left flex flex-col justify-between gap-3 shadow-2xs group cursor-pointer"
                            >
                                <div class="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                                    <Icon icon="ph:calendar-plus-bold" />
                                </div>
                                <div>
                                    <div class="text-xs sm:text-sm font-black text-navy">{{ t('event_archer_fields.elem_daterange_title', 'Rentang Tanggal') }}</div>
                                    <div class="text-xs text-slate-500 mt-1 leading-relaxed">{{ t('event_archer_fields.elem_daterange_desc', 'Pilihan tanggal mulai hingga tanggal berakhir.') }}</div>
                                </div>
                            </button>

                            <!-- 9. Pemilih Waktu (Time) -->
                            <button
                                type="button"
                                @click="openCreateFieldModalWithType('time')"
                                class="p-4 rounded-2xl border border-slate-200 bg-white hover:border-navy hover:bg-slate-50/80 transition-all text-left flex flex-col justify-between gap-3 shadow-2xs group cursor-pointer"
                            >
                                <div class="size-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                                    <Icon icon="ph:clock-bold" />
                                </div>
                                <div>
                                    <div class="text-xs sm:text-sm font-black text-navy">{{ t('event_archer_fields.elem_time_title', 'Pemilih Waktu') }}</div>
                                    <div class="text-xs text-slate-500 mt-1 leading-relaxed">{{ t('event_archer_fields.elem_time_desc', 'Waktu sesi tembak atau jam kedatangan.') }}</div>
                                </div>
                            </button>

                            <!-- 10. Tanggal & Waktu (DateTime) -->
                            <button
                                type="button"
                                @click="openCreateFieldModalWithType('datetime')"
                                class="p-4 rounded-2xl border border-slate-200 bg-white hover:border-navy hover:bg-slate-50/80 transition-all text-left flex flex-col justify-between gap-3 shadow-2xs group cursor-pointer"
                            >
                                <div class="size-10 rounded-xl bg-lime-50 text-lime-700 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                                    <Icon icon="ph:calendar-check-bold" />
                                </div>
                                <div>
                                    <div class="text-xs sm:text-sm font-black text-navy">{{ t('event_archer_fields.elem_datetime_title', 'Tanggal & Waktu') }}</div>
                                    <div class="text-xs text-slate-500 mt-1 leading-relaxed">{{ t('event_archer_fields.elem_datetime_desc', 'Kombinasi tanggal dan waktu dalam 1 kolom.') }}</div>
                                </div>
                            </button>

                            <!-- 11. Unggah Berkas -->
                            <button
                                type="button"
                                @click="openCreateFieldModalWithType('file')"
                                class="p-4 rounded-2xl border border-slate-200 bg-white hover:border-navy hover:bg-slate-50/80 transition-all text-left flex flex-col justify-between gap-3 shadow-2xs group cursor-pointer"
                            >
                                <div class="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                                    <Icon icon="ph:file-arrow-up-bold" />
                                </div>
                                <div>
                                    <div class="text-xs sm:text-sm font-black text-navy">{{ t('event_archer_fields.elem_file_title', 'Unggah Berkas / Dokumen') }}</div>
                                    <div class="text-xs text-slate-500 mt-1 leading-relaxed">{{ t('event_archer_fields.elem_file_desc', 'Foto atlet, KK, akta, surat sehat.') }}</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Group 2: Struktur & Layout -->
                    <div>
                        <div class="flex items-center gap-2 mb-2">
                            <Icon icon="ph:layout-bold" class="text-navy text-base" />
                            <h4 class="text-xs sm:text-sm font-black text-navy">{{ t('event_archer_fields.cat_layout', 'Tata Letak & Struktur') }}</h4>
                        </div>
                        <div class="text-xs text-slate-500 mb-3">{{ t('event_archer_fields.cat_layout_desc', 'Elemen pembatas, judul bagian, atau kotak pengumuman formulir.') }}</div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <!-- Judul Seksi -->
                            <button
                                type="button"
                                @click="quickAddLayoutFromModal('heading')"
                                class="p-4 rounded-2xl border border-slate-200 bg-white hover:border-navy hover:bg-slate-50/80 transition-all text-left flex flex-col justify-between gap-3 shadow-2xs group cursor-pointer"
                            >
                                <div class="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                                    <Icon icon="ph:text-h-bold" />
                                </div>
                                <div>
                                    <div class="text-xs sm:text-sm font-black text-navy">{{ t('event_archer_fields.elem_heading_title', 'Judul Seksi') }}</div>
                                    <div class="text-xs text-slate-500 mt-1 leading-relaxed">{{ t('event_archer_fields.elem_heading_desc', 'Membagi form menjadi bagian-bagian teratur.') }}</div>
                                </div>
                            </button>

                            <!-- Garis Pemisah -->
                            <button
                                type="button"
                                @click="quickAddLayoutFromModal('divider')"
                                class="p-4 rounded-2xl border border-slate-200 bg-white hover:border-navy hover:bg-slate-50/80 transition-all text-left flex flex-col justify-between gap-3 shadow-2xs group cursor-pointer"
                            >
                                <div class="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                                    <Icon icon="ph:minus-bold" />
                                </div>
                                <div>
                                    <div class="text-xs sm:text-sm font-black text-navy">{{ t('event_archer_fields.elem_divider_title', 'Garis Pemisah') }}</div>
                                    <div class="text-xs text-slate-500 mt-1 leading-relaxed">{{ t('event_archer_fields.elem_divider_desc', 'Garis horizontal pembatas visual antar kolom.') }}</div>
                                </div>
                            </button>

                            <!-- Catatan / Pengumuman -->
                            <button
                                type="button"
                                @click="quickAddLayoutFromModal('notice')"
                                class="p-4 rounded-2xl border border-slate-200 bg-white hover:border-navy hover:bg-slate-50/80 transition-all text-left flex flex-col justify-between gap-3 shadow-2xs group cursor-pointer"
                            >
                                <div class="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                                    <Icon icon="ph:info-bold" />
                                </div>
                                <div>
                                    <div class="text-xs sm:text-sm font-black text-navy">{{ t('event_archer_fields.elem_notice_title', 'Catatan / Pengumuman') }}</div>
                                    <div class="text-xs text-slate-500 mt-1 leading-relaxed">{{ t('event_archer_fields.elem_notice_desc', 'Kotak pengumuman atau syarat khusus.') }}</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </BaseDialogForm>

        <!-- Delete Confirmation Dialog -->
        <AppDialog
            v-model:show="showDeleteDialog"
            :title="t('event_archer_fields.delete_dialog_title', 'Hapus Elemen Formulir?')"
            :message="t('event_archer_fields.delete_dialog_desc', { name: elementToDelete?.label_id || '' }, `Apakah Anda yakin ingin menghapus '${elementToDelete?.label_id || 'elemen ini'}'? Tindakan ini tidak dapat dibatalkan.`)"
            :confirm-text="t('event_archer_fields.delete_confirm', 'Ya, Hapus')"
            :cancel-text="t('event_archer_fields.cancel', 'Batal')"
            type="danger"
            @confirm="confirmDeleteElement"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useDashboardI18n } from '~/composables/useDashboardI18n'
import { useAuth } from '~/composables/useAuth'
import { useApi, getApiErrorMessage } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import BaseDialogForm from '~/components/common/BaseDialogForm.vue'
import AppDialog from '~/components/common/AppDialog.vue'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})

const { t, locale } = useDashboardI18n()
const { isSubscriptionActive } = useAuth()
const { get, post, put, delete: del } = useApi()
const route = useRoute()
const { tournamentTitle } = useTournamentContext()
const toast = useToast()

const tournamentId = computed(() => route.params.id || route.params.slug)
const tournamentSlug = ref('')

const isEn = computed(() => locale.value === 'en')

const publicRegisterUrl = computed(() => {
    const slugOrId = tournamentSlug.value || tournamentId.value || 'register'
    if (typeof window !== 'undefined') {
        return `${window.location.origin}/tournaments/${slugOrId}/register`
    }
    return `https://archeryhub.id/tournaments/${slugOrId}/register`
})

useHead({
    title: computed(() => `${t('event_archer_fields.title', 'Formulir Pendaftaran')} - Archeris Dashboard`)
})

const activeTab = ref('editor') // 'editor' | 'preview'
const catalogActiveTab = ref('preset') // 'preset' | 'element'

const isLoading = ref(false)
const isSaving = ref(false)
const isReordering = ref(false)
const showPremiumModal = ref(false)
const showEditModal = ref(false)
const showAllElementsModal = ref(false)
const showDeleteDialog = ref(false)
const elementToDelete = ref(null)
const isEditing = ref(false)
const editingUUID = ref('')
const newOptionInput = ref('')
const inlineEditingHeading = ref(null)

const fields = ref([])

// Interactive Live Preview State
const previewForm = ref({
    full_name: 'Muhammad Fadhil',
    gender: 'male',
    club_id: '1'
})

function resetPreviewForm() {
    previewForm.value = {
        full_name: 'Muhammad Fadhil',
        gender: 'male',
        club_id: '1'
    }
    toast.info(isEn.value ? 'Preview form reset to initial values' : 'Formulir pratinjau telah direset')
}

function testPreviewSubmit() {
    toast.success(isEn.value ? 'Interactive preview: Athlete registration data is valid!' : 'Simulasi interaktif: Data formulir atlet valid untuk dilanjutkan!')
}

function isPreviewCheckboxChecked(fieldKey, option) {
    const val = previewForm.value[fieldKey]
    if (Array.isArray(val)) return val.includes(option)
    return val === option
}

function togglePreviewCheckbox(fieldKey, option) {
    if (!Array.isArray(previewForm.value[fieldKey])) {
        previewForm.value[fieldKey] = []
    }
    const arr = previewForm.value[fieldKey]
    const idx = arr.indexOf(option)
    if (idx >= 0) {
        arr.splice(idx, 1)
    } else {
        arr.push(option)
    }
}

function handlePreviewFileUpload(event, fieldKey) {
    const target = event.target
    if (target && target.files && target.files[0]) {
        const file = target.files[0]
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
        previewForm.value[fieldKey] = {
            name: file.name,
            size: `${sizeMb} MB`
        }
        toast.success(isEn.value ? `Uploaded '${file.name}' in preview` : `Berkas '${file.name}' berhasil dipilih untuk simulasi`)
    }
}

// System Default Fields (Permanent & Core)
const systemDefaultFields = computed(() => [
    {
        key: 'full_name',
        label: t('event_archer_fields.sys_full_name', 'Nama Lengkap Atlet'),
        type_label: t('event_archer_fields.sys_type_required_text', 'Teks (Wajib)'),
        icon: 'ph:user-bold',
        col_span: 6,
        description: t('event_archer_fields.sys_full_name_desc', 'Identitas resmi pemanah untuk verifikasi kategori usia, scorecard, bagan tanding, dan e-sertifikat.')
    },
    {
        key: 'gender',
        label: t('event_archer_fields.sys_gender', 'Jenis Kelamin (Pria / Wanita)'),
        type_label: t('event_archer_fields.sys_type_required_choice', 'Pilihan Gender (Wajib)'),
        icon: 'ph:gender-intersex-bold',
        col_span: 6,
        description: t('event_archer_fields.sys_gender_desc', 'Penentu kategori divisi gender (Putra/Putri/Campuran) pada nomor turnamen.')
    },
    {
        key: 'club_id',
        label: t('event_archer_fields.sys_club', 'Klub / Kontingen / Sekolah'),
        type_label: t('event_archer_fields.sys_type_required_select', 'Pencarian Klub / Asal (Wajib)'),
        icon: 'ph:shield-bold',
        col_span: 12,
        description: t('event_archer_fields.sys_club_desc', 'Afiliasi klub atau kontingen asal atlet untuk akumulasi medali dan pembagian tim regu.')
    }
])

function formatSelectOptions(options) {
    if (!options || !Array.isArray(options)) return []
    return options.map(opt => {
        if (typeof opt === 'object' && opt !== null) {
            return {
                label: opt.label || opt.name || String(opt.value),
                value: opt.value !== undefined ? opt.value : opt.label
            }
        }
        return {
            label: String(opt),
            value: String(opt)
        }
    })
}

// Drag & Drop State
const draggedIndex = ref(null)
const dropTargetIndex = ref(null)

const fieldTypeOptions = computed(() => [
    { label: t('event_archer_fields.type_text', 'Teks Singkat'), value: 'text' },
    { label: t('event_archer_fields.type_textarea', 'Teks Panjang / Catatan'), value: 'textarea' },
    { label: t('event_archer_fields.type_number', 'Angka'), value: 'number' },
    { label: t('event_archer_fields.type_select', 'Pilihan Dropdown'), value: 'select' },
    { label: t('event_archer_fields.type_radio', 'Pilihan Tunggal (Radio)'), value: 'radio' },
    { label: t('event_archer_fields.type_checkbox', 'Pilihan Ganda (Checkbox)'), value: 'checkbox' },
    { label: t('event_archer_fields.type_date', 'Pemilih Tanggal'), value: 'date' },
    { label: t('event_archer_fields.type_daterange', 'Rentang Tanggal (Date Range)'), value: 'daterange' },
    { label: t('event_archer_fields.type_time', 'Pemilih Waktu (Time)'), value: 'time' },
    { label: t('event_archer_fields.type_datetime', 'Tanggal & Waktu (DateTime)'), value: 'datetime' },
    { label: t('event_archer_fields.type_file', 'Unggah Berkas / Dokumen'), value: 'file' }
])

const availablePresets = computed(() => [
    {
        key: 'nik',
        icon: 'ph:identification-card-bold',
        label_id: 'Nomor Induk Kependudukan (NIK)',
        label_en: 'National ID / Passport Number',
        field_key: 'nik',
        field_type: 'text',
        element_type: 'field',
        is_required: true,
        placeholder_id: '16 digit NIK sesuai KTP / KK / Paspor',
        placeholder_en: '16-digit ID or Passport Number',
        description_id: 'Digunakan untuk verifikasi keabsahan data kependudukan dan usia atlet.',
        description_en: 'Used for identity, citizenship, and official athlete age verification.'
    },
    {
        key: 'jersey_size',
        icon: 'ph:t-shirt-bold',
        label_id: 'Ukuran Baju / Jersey Turnamen',
        label_en: 'Tournament Jersey / T-Shirt Size',
        field_key: 'jersey_size',
        field_type: 'select',
        element_type: 'field',
        is_required: true,
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
        placeholder_id: 'Pilih ukuran jersey',
        placeholder_en: 'Select jersey size',
        description_id: 'Untuk paket perlengkapan & jersey resmi atlet turnamen.',
        description_en: 'For athlete official event race pack and jersey distribution.'
    },
    {
        key: 'jersey_name',
        icon: 'ph:tag-bold',
        label_id: 'Nama Punggung Jersey',
        label_en: 'Jersey Back Name',
        field_key: 'jersey_name',
        field_type: 'text',
        element_type: 'field',
        is_required: false,
        placeholder_id: 'Contoh: FADHIL M.',
        placeholder_en: 'Example: FADHIL M.',
        description_id: 'Nama yang dicetak pada bagian punggung jersey turnamen (Maks. 14 huruf).',
        description_en: 'Name printed on the back of the official jersey (Max 14 letters).'
    },
    {
        key: 'emergency_phone',
        icon: 'ph:phone-call-bold',
        label_id: 'Nomor Kontak Darurat (Ortu / Pelatih)',
        label_en: 'Emergency Contact Phone (Parent/Coach)',
        field_key: 'emergency_phone',
        field_type: 'text',
        element_type: 'field',
        is_required: true,
        placeholder_id: 'Contoh: 08123456789 (Nama Hubungan)',
        placeholder_en: 'Example: +62 812-3456-7890 (Relation Name)',
        description_id: 'Nomor kontak yang dapat dihubungi saat situasi darurat di lapangan.',
        description_en: 'Primary phone number to contact in case of field medical emergency.'
    },
    {
        key: 'athlete_id_card',
        icon: 'ph:file-arrow-up-bold',
        label_id: 'Unggah Kartu Tanda Anggota / Lisensi Atlet',
        label_en: 'Upload Athlete License / Club Card',
        field_key: 'athlete_license_doc',
        field_type: 'file',
        element_type: 'field',
        is_required: false,
        description_id: 'Dokumen KTA Perpani, sertifikat lisensi daerah, atau kartu pelajar.',
        description_en: 'Federation athlete membership card or student identity verification.'
    },
    {
        key: 'parent_consent',
        icon: 'ph:file-text-bold',
        label_id: 'Surat Izin Orang Tua (Atlet Pelajar)',
        label_en: 'Parental Consent Form (Youth Archers)',
        field_key: 'parent_consent_file',
        field_type: 'file',
        element_type: 'field',
        is_required: false,
        description_id: 'Surat persetujuan orang tua/wali untuk kategori usia U-12, U-15, dan U-18.',
        description_en: 'Signed parental consent document for youth divisions (U-12, U-15, U-18).'
    },
    {
        key: 'medical_certificate',
        icon: 'ph:heartbeat-bold',
        label_id: 'Surat Keterangan Sehat / Bebas Cedera',
        label_en: 'Medical Health / Injury-Free Certificate',
        field_key: 'medical_cert_file',
        field_type: 'file',
        element_type: 'field',
        is_required: false,
        description_id: 'Surat keterangan sehat dokter atau surat pernyataan fisik siap bertanding.',
        description_en: 'Doctor certificate confirming medical clearance and tournament fitness.'
    },
    {
        key: 'blood_type',
        icon: 'ph:drop-bold',
        label_id: 'Golongan Darah',
        label_en: 'Blood Type',
        field_key: 'blood_type',
        field_type: 'select',
        element_type: 'field',
        is_required: false,
        options: ['A', 'B', 'AB', 'O', 'Tidak Tahu / Unknown'],
        placeholder_id: 'Pilih golongan darah',
        placeholder_en: 'Select blood type',
        description_id: 'Data medis darurat untuk tim pertolongan pertama di lapangan.',
        description_en: 'Emergency medical health record for tournament on-site medical staff.'
    },
    {
        key: 'dominant_hand',
        icon: 'ph:hand-pointing-bold',
        label_id: 'Tangan & Mata Dominan',
        label_en: 'Dominant Hand & Eye',
        field_key: 'dominant_hand',
        field_type: 'select',
        element_type: 'field',
        is_required: false,
        options: ['Tangan Kanan (RH / Right Hand)', 'Tangan Kiri (LH / Left Hand)'],
        placeholder_id: 'Pilih tangan dominan',
        placeholder_en: 'Select dominant hand',
        description_id: 'Membantu panitia menata posisi berdiri atlet di garis tembak bantalan.',
        description_en: 'Helps field judges arrange shooting line stance spacing on target butts.'
    },
    {
        key: 'bow_details',
        icon: 'ph:bow-bold',
        label_id: 'Merk & Tipe Busur (Riser/Limbs)',
        label_en: 'Bow Brand & Model Specifications',
        field_key: 'bow_specs',
        field_type: 'text',
        element_type: 'field',
        is_required: false,
        placeholder_id: 'Contoh: Hoyt Formula XD / MK Korea Zest',
        placeholder_en: 'Example: Hoyt Formula XD / MK Korea Zest',
        description_id: 'Data spesifikasi teknis busur yang digunakan atlet.',
        description_en: 'Technical bow equipment details used by the competitor.'
    },
    {
        key: 'draw_weight',
        icon: 'ph:gauge-bold',
        label_id: 'Draw Weight (Berat Tarikan lbs)',
        label_en: 'Draw Weight (Poundage in lbs)',
        field_key: 'draw_weight_lbs',
        field_type: 'number',
        element_type: 'field',
        is_required: false,
        placeholder_id: 'Contoh: 38',
        placeholder_en: 'Example: 38',
        description_id: 'Berat tarikan busur dalam satuan pound (lbs).',
        description_en: 'Nominal limb poundage measurement at full archer draw length.'
    },
    {
        key: 'arrow_spec',
        icon: 'ph:arrow-right-bold',
        label_id: 'Spesifikasi Anak Panah (Spine & Merk)',
        label_en: 'Arrow Spine & Model Specifications',
        field_key: 'arrow_specifications',
        field_type: 'text',
        element_type: 'field',
        is_required: false,
        placeholder_id: 'Contoh: Easton X10 Spine 600 / VAP 700',
        placeholder_en: 'Example: Easton X10 Spine 600 / VAP 700',
        description_id: 'Data shaft panah untuk verifikasi inspeksi alat panitia.',
        description_en: 'Shaft specification for official tournament equipment inspection.'
    },
    {
        key: 'personal_best',
        icon: 'ph:trophy-bold',
        label_id: 'Skor Tertinggi Kualifikasi (Personal Best)',
        label_en: 'Personal Best Qualification Score',
        field_key: 'personal_best_score',
        field_type: 'number',
        element_type: 'field',
        is_required: false,
        placeholder_id: 'Contoh: 645 (dari total 720)',
        placeholder_en: 'Example: 645 (out of 720)',
        description_id: 'Skor resmi terbaik atlet pada sesi kualifikasi jarak terkait.',
        description_en: 'Highest official 72-arrow qualification ranking score achieved.'
    },
    {
        key: 'accommodation',
        icon: 'ph:bed-bold',
        label_id: 'Kebutuhan Akomodasi & Transportasi',
        label_en: 'Accommodation & Transport Assistance',
        field_key: 'accommodation_need',
        field_type: 'select',
        element_type: 'field',
        is_required: false,
        options: [
            'Mandiri / Tidak Membutuhkan',
            'Perlu Rekomendasi Hotel Mitra Turnamen',
            'Perlu Layanan Jemputan Bandara / Stasiun',
            'Paket Komplit (Hotel + Antar Jemput Lapangan)'
        ],
        placeholder_id: 'Pilih kebutuhan akomodasi',
        placeholder_en: 'Select accommodation need',
        description_id: 'Informasi kebutuhan penginapan dan transportasi kontingen luar kota.',
        description_en: 'Logistical assistance information for out-of-town delegation teams.'
    },
    {
        key: 'waiver_agreement',
        icon: 'ph:shield-check-bold',
        label_id: 'Persetujuan Tata Tertib & Tanggung Jawab',
        label_en: 'Tournament Rules & Liability Waiver Agreement',
        field_key: 'waiver_signed',
        field_type: 'checkbox',
        element_type: 'field',
        is_required: true,
        options: ['Saya menyetujui seluruh tata tertib, aturan keselamatan, dan keputusan panitia turnamen.'],
        description_id: 'Pernyataan kepatuhan resmi terhadap regulasi World Archery dan panitia pelaksana.',
        description_en: 'Official agreement confirming compliance with tournament safety rules and regulations.'
    }
])

function getPresetLabel(preset) {
    return isEn.value ? (preset.label_en || preset.label_id) : preset.label_id
}

function getPresetDesc(preset) {
    return isEn.value ? (preset.description_en || preset.description_id) : preset.description_id
}

const formData = ref({
    element_type: 'field',
    field_key: '',
    field_type: 'text',
    label_id: '',
    description_id: '',
    placeholder_id: '',
    options: [],
    is_required: false,
    is_active: true,
    col_span: 12,
    style_config: {
        file_config: {
            allowed_types: 'all',
            max_size_mb: 5,
            max_files: 1
        }
    }
})

function isPresetAdded(presetKey) {
    return fields.value.some(f => f.field_key === presetKey)
}

function getFieldTypeLabel(type) {
    const match = fieldTypeOptions.value.find(t => t.value === type)
    return match ? match.label : type
}

function getGridColClass(colSpan) {
    if (colSpan === 6) return 'col-span-1 md:col-span-6'
    if (colSpan === 4) return 'col-span-1 md:col-span-4'
    if (colSpan === 8) return 'col-span-1 md:col-span-8'
    return 'col-span-1 md:col-span-12'
}

function getElementIcon(el) {
    if (el.element_type === 'heading') return 'ph:text-h-bold'
    if (el.element_type === 'divider') return 'ph:minus-bold'
    if (el.element_type === 'notice') return 'ph:info-bold'
    if (el.field_type === 'file') return 'ph:file-arrow-up-bold'
    if (el.field_type === 'daterange') return 'ph:calendar-plus-bold'
    if (el.field_type === 'time') return 'ph:clock-bold'
    if (el.field_type === 'datetime') return 'ph:calendar-check-bold'
    return 'ph:textbox-bold'
}

function getElementTypeBadge(el) {
    if (el.element_type === 'heading') return t('event_archer_fields.element_heading', 'Judul Seksi')
    if (el.element_type === 'divider') return t('event_archer_fields.element_divider', 'Garis Pemisah')
    if (el.element_type === 'notice') return t('event_archer_fields.element_notice', 'Catatan')
    const match = fieldTypeOptions.value.find(t => t.value === el.field_type)
    return match ? match.label : t('event_archer_fields.quick_insert_field', 'Input Data')
}

function getNoticeIcon(variant) {
    if (variant === 'warning') return 'ph:warning-circle-bold'
    if (variant === 'success') return 'ph:check-circle-bold'
    if (variant === 'danger') return 'ph:x-circle-bold'
    return 'ph:info-bold'
}

function getNoticeStyle(variant) {
    if (variant === 'warning') return 'bg-amber-50 text-amber-900 border-amber-200'
    if (variant === 'success') return 'bg-emerald-50 text-emerald-900 border-emerald-200'
    if (variant === 'danger') return 'bg-rose-50 text-rose-900 border-rose-200'
    return 'bg-slate-50 text-slate-800 border-slate-200'
}

function getElementBadgeStyle(el) {
    if (el.element_type === 'heading') return 'bg-blue-50 text-blue-700 border-blue-200'
    if (el.element_type === 'divider') return 'bg-purple-50 text-purple-700 border-purple-200'
    if (el.element_type === 'notice') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    return 'bg-primary/15 text-navy border-primary/30 font-black'
}

function getPresetIconStyle(key) {
    if (key === 'nik' || key === 'jersey_name') return 'bg-blue-50 text-blue-600 border border-blue-200/70'
    if (key === 'jersey_size') return 'bg-primary/20 text-navy border border-primary/30'
    if (key === 'emergency_phone') return 'bg-rose-50 text-rose-600 border border-rose-200/70'
    if (key === 'athlete_id_card' || key === 'parent_consent') return 'bg-purple-50 text-purple-600 border border-purple-200/70'
    if (key === 'medical_certificate') return 'bg-red-50 text-red-600 border border-red-200/70'
    if (key === 'blood_type') return 'bg-amber-50 text-amber-600 border border-amber-200/70'
    if (key === 'bow_details' || key === 'draw_weight') return 'bg-emerald-50 text-emerald-600 border border-emerald-200/70'
    if (key === 'waiver_agreement') return 'bg-teal-50 text-teal-600 border border-teal-200/70'
    return 'bg-primary/10 text-navy border border-primary/20'
}

function getFileConfigSummary(element) {
    const cfg = element.style_config?.file_config || {}
    const type = cfg.allowed_types === 'images' ? 'Gambar (JPG/PNG)' : cfg.allowed_types === 'docs' ? 'Dokumen (PDF)' : 'Semua Berkas'
    const size = cfg.max_size_mb ? `${cfg.max_size_mb} MB` : '5 MB'
    return `${type} • Maks ${size}`
}

function getFileConfigHint(element) {
    const cfg = element.style_config?.file_config || {}
    const types = cfg.allowed_types === 'images' ? 'JPG, PNG, WEBP' : cfg.allowed_types === 'docs' ? 'PDF, DOCX' : 'JPG, PNG, PDF'
    const size = cfg.max_size_mb ? `${cfg.max_size_mb}MB` : '5MB'
    const max = cfg.max_files && cfg.max_files > 1 ? ` (Maks. ${cfg.max_files} berkas)` : ''
    return isEn.value ? `Supports ${types} (Max ${size}${max})` : `Mendukung format ${types} (Maks ${size}${max})`
}

async function fetchFields() {
    if (!tournamentId.value) return
    isLoading.value = true
    try {
        const res = await get(`/tournaments/${tournamentId.value}/custom-fields`)
        fields.value = res.fields || []
    } catch (err) {
        toast.error(getApiErrorMessage(err, t('event_archer_fields.toast_load_failed', 'Gagal memuat susunan formulir')))
    } finally {
        isLoading.value = false
    }
}

async function fetchTournament() {
    if (!tournamentId.value) return
    try {
        const res = await get(`/tournaments/${tournamentId.value}`)
        if (res?.data?.slug || res?.slug) {
            tournamentSlug.value = res.data?.slug || res.slug
        }
    } catch (_) {}
}

// Drag and drop handlers
function onDragStart(index, event) {
    draggedIndex.value = index
    event.dataTransfer.effectAllowed = 'move'
}

function onDragOver(index, event) {
    dropTargetIndex.value = index
}

async function onDrop(index, event) {
    if (draggedIndex.value === null || draggedIndex.value === index) {
        draggedIndex.value = null
        dropTargetIndex.value = null
        return
    }

    const temp = [...fields.value]
    const [draggedItem] = temp.splice(draggedIndex.value, 1)
    temp.splice(index, 0, draggedItem)
    fields.value = temp

    draggedIndex.value = null
    dropTargetIndex.value = null

    await persistReorder()
}

function onDragEnd() {
    draggedIndex.value = null
    dropTargetIndex.value = null
}

async function moveElement(index, delta) {
    const targetIndex = index + delta
    if (targetIndex < 0 || targetIndex >= fields.value.length) return

    const temp = [...fields.value]
    const [moved] = temp.splice(index, 1)
    temp.splice(targetIndex, 0, moved)
    fields.value = temp

    await persistReorder()
}

async function persistReorder() {
    const orders = fields.value.map((f, i) => ({
        field_uuid: f.uuid,
        display_order: i + 1
    }))

    isReordering.value = true
    try {
        await put(`/tournaments/${tournamentId.value}/custom-fields/reorder`, { orders })
    } catch (err) {
        toast.error(getApiErrorMessage(err, t('event_archer_fields.toast_reorder_failed', 'Gagal menyimpan urutan form')))
        await fetchFields()
    } finally {
        isReordering.value = false
    }
}

async function setColSpan(element, cols) {
    element.col_span = cols
    try {
        await put(`/tournaments/${tournamentId.value}/custom-fields/${element.uuid}`, {
            ...element,
            col_span: cols
        })
    } catch (err) {
        console.error('Failed to update col span:', err)
    }
}

function startInlineHeadingEdit(element) {
    inlineEditingHeading.value = element.uuid
}

async function saveInlineHeading(element) {
    if (inlineEditingHeading.value !== element.uuid) return
    inlineEditingHeading.value = null
    if (!element.label_id?.trim()) {
        element.label_id = 'Judul Seksi'
    }
    try {
        await put(`/tournaments/${tournamentId.value}/custom-fields/${element.uuid}`, {
            ...element,
            label_id: element.label_id.trim()
        })
        toast.success(t('event_archer_fields.toast_update_success', 'Bidang formulir berhasil diperbarui'))
    } catch (err) {
        toast.error(getApiErrorMessage(err, 'Gagal memperbarui judul seksi'))
        await fetchFields()
    }
}

function openCreateFieldModal() {
    openCreateFieldModalWithType('text')
}

function openCreateFieldModalWithType(type) {
    showAllElementsModal.value = false
    isEditing.value = false
    editingUUID.value = ''
    newOptionInput.value = ''
    formData.value = {
        element_type: 'field',
        field_key: '',
        field_type: type || 'text',
        label_id: '',
        description_id: '',
        placeholder_id: '',
        options: [],
        is_required: false,
        is_active: true,
        col_span: 12,
        style_config: {
            file_config: {
                allowed_types: 'all',
                max_size_mb: 5,
                max_files: 1
            }
        }
    }
    showEditModal.value = true
}

function openEditModal(element) {
    isEditing.value = true
    editingUUID.value = element.uuid
    newOptionInput.value = ''
    formData.value = {
        element_type: element.element_type || 'field',
        field_key: element.field_key || '',
        field_type: element.field_type || 'text',
        label_id: element.label_id || '',
        description_id: element.description_id || '',
        placeholder_id: element.placeholder_id || '',
        options: [...(element.options || [])],
        is_required: !!element.is_required,
        is_active: true,
        col_span: element.col_span || 12,
        style_config: {
            file_config: {
                allowed_types: 'all',
                max_size_mb: 5,
                max_files: 1,
                ...(element.style_config?.file_config || {})
            },
            ...(element.style_config || {})
        }
    }
    showEditModal.value = true
}

async function quickAddLayoutFromModal(layoutType) {
    showAllElementsModal.value = false
    await quickAddLayout(layoutType)
}

async function applyPresetFromModal(preset) {
    showAllElementsModal.value = false
    await applyPreset(preset)
}

async function quickAddLayout(layoutType) {
    const defaultLabels = {
        heading: isEn.value ? 'New Section Heading' : 'Judul Seksi Baru',
        divider: isEn.value ? 'Divider Line' : 'Garis Pemisah',
        notice: isEn.value ? 'Important Announcement / Notice' : 'Catatan / Pengumuman Penting'
    }

    const payload = {
        element_type: layoutType,
        field_key: `${layoutType}_${Date.now()}`,
        field_type: 'text',
        label_id: defaultLabels[layoutType] || 'Elemen Baru',
        description_id: layoutType === 'notice' ? (isEn.value ? 'Enter tournament guidelines or important terms here.' : 'Tuliskan informasi penting atau tata tertib di sini.') : '',
        placeholder_id: '',
        options: [],
        is_required: false,
        is_active: true,
        col_span: 12,
        style_config: layoutType === 'notice' ? { variant: 'info' } : {}
    }

    try {
        isSaving.value = true
        const res = await post(`/tournaments/${tournamentId.value}/custom-fields`, payload)
        toast.success(t('event_archer_fields.toast_element_created', 'Elemen berhasil ditambahkan'))
        await fetchFields()
        if (layoutType === 'heading' && res?.field?.uuid) {
            inlineEditingHeading.value = res.field.uuid
        }
    } catch (err) {
        toast.error(getApiErrorMessage(err, t('event_archer_fields.toast_save_failed', 'Gagal menambahkan elemen layout')))
    } finally {
        isSaving.value = false
    }
}

async function applyPreset(preset) {
    const payload = {
        element_type: preset.element_type || 'field',
        field_key: preset.field_key,
        field_type: preset.field_type,
        label_id: isEn.value ? (preset.label_en || preset.label_id) : preset.label_id,
        description_id: (isEn.value ? (preset.description_en || preset.description_id) : preset.description_id) || '',
        placeholder_id: (isEn.value ? (preset.placeholder_en || preset.placeholder_id) : preset.placeholder_id) || '',
        options: preset.options || [],
        is_required: !!preset.is_required,
        is_active: true,
        col_span: 12,
        style_config: preset.field_type === 'file' ? {
            file_config: {
                allowed_types: 'all',
                max_size_mb: 5,
                max_files: 1
            }
        } : {}
    }

    try {
        isSaving.value = true
        await post(`/tournaments/${tournamentId.value}/custom-fields`, payload)
        const name = isEn.value ? (preset.label_en || preset.label_id) : preset.label_id
        toast.success(t('event_archer_fields.toast_preset_created', { name }, `Preset '${name}' berhasil ditambahkan`))
        await fetchFields()
    } catch (err) {
        toast.error(getApiErrorMessage(err, t('event_archer_fields.toast_preset_failed', 'Gagal menambahkan preset field')))
    } finally {
        isSaving.value = false
    }
}

function addOption() {
    const trimmed = newOptionInput.value.trim()
    if (!trimmed) return
    if (!formData.value.options) formData.value.options = []
    if (!formData.value.options.includes(trimmed)) {
        formData.value.options.push(trimmed)
    }
    newOptionInput.value = ''
}

function removeOption(index) {
    formData.value.options.splice(index, 1)
}

async function saveField() {
    if (!formData.value.label_id?.trim()) {
        toast.warning(t('event_archer_fields.toast_label_required', 'Nama / label kolom wajib diisi'))
        return
    }

    if (['select', 'radio', 'checkbox'].includes(formData.value.field_type) && (!formData.value.options || formData.value.options.length === 0)) {
        toast.warning(t('event_archer_fields.toast_options_required', 'Mohon tambahkan minimal 1 opsi untuk tipe pilihan ini'))
        return
    }

    try {
        isSaving.value = true
        const payload = { ...formData.value }

        // Auto-generate field_key from label_id if empty
        if (!payload.field_key) {
            const rawSlug = payload.label_id
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '')
            payload.field_key = rawSlug || `field_${Date.now()}`
        }
        payload.is_active = true
        payload.col_span = payload.col_span || 12

        if (isEditing.value) {
            await put(`/tournaments/${tournamentId.value}/custom-fields/${editingUUID.value}`, payload)
            toast.success(t('event_archer_fields.toast_update_success', 'Bidang formulir berhasil diperbarui'))
        } else {
            await post(`/tournaments/${tournamentId.value}/custom-fields`, payload)
            toast.success(t('event_archer_fields.toast_create_success', 'Bidang formulir baru berhasil ditambahkan'))
        }

        showEditModal.value = false
        await fetchFields()
    } catch (err) {
        toast.error(getApiErrorMessage(err, t('event_archer_fields.toast_save_failed', 'Gagal menyimpan data field')))
    } finally {
        isSaving.value = false
    }
}

function requestDeleteElement(element) {
    elementToDelete.value = element
    showDeleteDialog.value = true
}

async function confirmDeleteElement() {
    if (!elementToDelete.value?.uuid) return
    try {
        await del(`/tournaments/${tournamentId.value}/custom-fields/${elementToDelete.value.uuid}`)
        toast.success(t('event_archer_fields.toast_delete_success', 'Elemen formulir berhasil dihapus'))
        await fetchFields()
    } catch (err) {
        toast.error(getApiErrorMessage(err, t('event_archer_fields.toast_delete_failed', 'Gagal menghapus elemen')))
    } finally {
        showDeleteDialog.value = false
        elementToDelete.value = null
    }
}

onMounted(() => {
    fetchTournament()
    fetchFields()
})
</script>

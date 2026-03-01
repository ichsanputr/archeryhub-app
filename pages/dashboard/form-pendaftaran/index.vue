<template>
    <div class="flex flex-col gap-6">

        <!-- ── Header ─────────────────────────────────────────────────── -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image:var(--motif-pattern);opacity:var(--motif-opacity,0.2)"></div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="space-y-4">
                    <div
                        class="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary/80">
                        <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
                        <Icon icon="ph:caret-right-bold" class="text-[8px] opacity-50" />
                        <span class="text-white">Form Pendaftaran</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <div
                            class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                            <Icon icon="ph:clipboard-text-bold" class="text-primary text-2xl sm:text-3xl" />
                        </div>
                        <div>
                            <h1 class="text-xl sm:text-3xl font-black tracking-tight">Form Pendaftaran</h1>
                            <p class="text-slate-300 text-[10px] sm:text-sm font-medium mt-1">
                                {{ form ? form.title : 'Buat formulir pendaftaran anggota yang dapat dikustomisasi' }}
                            </p>
                        </div>
                    </div>
                </div>
                <div v-if="form" class="flex flex-col sm:flex-row gap-3">
                    <button @click="togglePublish" :disabled="isSaving"
                        :class="form.is_published ? 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'"
                        class="flex items-center gap-2 h-10 px-5 rounded-xl border font-black text-[10px] tracking-widest uppercase transition-all backdrop-blur-md">
                        <Icon :icon="form.is_published ? 'ph:eye-bold' : 'ph:eye-slash-bold'" />
                        {{ form.is_published ? 'Publik' : 'Draft' }}
                    </button>
                    <button @click="saveAll" :disabled="isSaving"
                        class="flex items-center gap-2 h-10 px-6 rounded-xl bg-primary text-primary-text font-black text-[10px] tracking-widest uppercase shadow-lg shadow-primary/20 transition-all hover:opacity-90 disabled:opacity-50">
                        <Icon v-if="isSaving" icon="ph:spinner" class="animate-spin" />
                        <Icon v-else icon="ph:floppy-disk-bold" />
                        Simpan
                    </button>
                </div>
            </div>
        </div>

        <!-- ── Loading ───────────────────────────────────────────────── -->
        <div v-if="isLoading" class="flex items-center justify-center py-32">
            <div class="flex flex-col items-center gap-4">
                <div class="size-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                <p class="text-gray-500 text-sm font-medium">Memuat form...</p>
            </div>
        </div>

        <!-- ── Empty State ───────────────────────────────────────────── -->
        <div v-else-if="!form"
            class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 py-28 gap-6">
            <div class="size-24 rounded-3xl bg-primary/10 flex items-center justify-center">
                <Icon icon="ph:clipboard-text-bold" class="text-primary text-5xl" />
            </div>
            <div class="text-center">
                <h2 class="text-2xl font-black text-gray-800 mb-2">Belum Ada Form Pendaftaran</h2>
                <p class="text-gray-500 text-sm max-w-md">Buat formulir pendaftaran yang dapat dikustomisasi sesuai
                    kebutuhan klub Anda untuk mengumpulkan data anggota baru.</p>
            </div>
            <button @click="createForm" :disabled="isSaving"
                class="flex items-center gap-2 h-12 px-10 rounded-xl bg-primary text-primary-text font-black text-sm tracking-widest uppercase shadow-lg shadow-primary/20 transition-all hover:opacity-90 disabled:opacity-50">
                <Icon icon="ph:plus-bold" />
                Buat Form Sekarang
            </button>
        </div>

        <!-- ── Builder ───────────────────────────────────────────────── -->
        <div v-else class="flex flex-col gap-6">

            <!-- Tab Bar -->
            <div class="flex gap-1 bg-gray-100 rounded-2xl p-1.5">
                <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
                    :class="activeTab === tab.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'"
                    class="flex items-center gap-2 flex-1 justify-center px-4 py-2.5 rounded-xl text-sm font-black transition-all">
                    <Icon :icon="tab.icon" class="text-base" />
                    <span class="hidden sm:inline">{{ tab.label }}</span>
                </button>
            </div>

            <!-- TAB: Informasi -->
            <div v-if="activeTab === 'info'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
                    <h2 class="font-black text-gray-800 flex items-center gap-2">
                        <Icon icon="ph:info-bold" class="text-primary" /> Informasi Dasar
                    </h2>
                    <div>
                        <label class="label-xs">Judul Form</label>
                        <input v-model="form.title" type="text" class="input-std"
                            placeholder="Contoh: Form Pendaftaran Anggota Baru" />
                    </div>
                    <div>
                        <label class="label-xs">Deskripsi</label>
                        <textarea v-model="form.description" rows="3" class="input-std resize-none"
                            placeholder="Tuliskan instruksi atau keterangan untuk calon anggota..."></textarea>
                    </div>
                    <div>
                        <label class="label-xs">Link Pendaftaran Publik</label>
                        <div class="flex gap-2">
                            <input readonly :value="publicUrl"
                                class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono text-gray-500 bg-gray-50 focus:outline-none" />
                            <button @click="copyLink"
                                class="px-4 py-2.5 rounded-xl bg-gray-800 text-white text-sm font-black hover:bg-gray-700 transition-colors">
                                <Icon icon="ph:copy-bold" />
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <div>
                            <p class="font-bold text-sm text-gray-800">Status Publikasi</p>
                            <p class="text-xs text-gray-400 mt-0.5">{{ publishStatusText }}</p>
                        </div>
                        <button @click="togglePublish" :disabled="isSaving"
                            :class="form.is_published ? 'bg-green-500' : 'bg-gray-300'"
                            class="relative w-12 h-7 rounded-full transition-colors">
                            <span :class="form.is_published ? 'translate-x-5' : 'translate-x-0.5'"
                                class="absolute top-0.5 left-0 inline-block w-6 h-6 rounded-full bg-white shadow transition-transform"></span>
                        </button>
                    </div>
                </div>
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
                    <h2 class="font-black text-gray-800 flex items-center gap-2">
                        <Icon icon="ph:chart-bar-bold" class="text-primary" /> Ringkasan Form
                    </h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-primary/5 rounded-2xl p-4 text-center">
                            <p class="text-3xl font-black text-primary">{{ form.sections?.length || 0 }}</p>
                            <p class="text-xs font-black text-gray-500 mt-1 uppercase tracking-wider">Seksi</p>
                        </div>
                        <div class="bg-blue-50 rounded-2xl p-4 text-center">
                            <p class="text-3xl font-black text-blue-600">{{ totalFields }}</p>
                            <p class="text-xs font-black text-gray-500 mt-1 uppercase tracking-wider">Field</p>
                        </div>
                        <div class="bg-green-50 rounded-2xl p-4 text-center">
                            <p class="text-3xl font-black text-green-600">{{ requiredFields }}</p>
                            <p class="text-xs font-black text-gray-500 mt-1 uppercase tracking-wider">Wajib</p>
                        </div>
                        <div class="bg-orange-50 rounded-2xl p-4 text-center">
                            <p class="text-3xl font-black text-orange-500">{{ form.is_published ? 'Aktif' : 'Draft' }}
                            </p>
                            <p class="text-xs font-black text-gray-500 mt-1 uppercase tracking-wider">Status</p>
                        </div>
                    </div>
                    <div class="mt-auto">
                        <p class="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Kemajuan Pembuatan</p>
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-2 text-sm"
                                :class="form.title ? 'text-green-600' : 'text-gray-400'">
                                <Icon :icon="form.title ? 'ph:check-circle-bold' : 'ph:circle'" />
                                <span class="font-medium">Judul form diisi</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm"
                                :class="form.sections?.length ? 'text-green-600' : 'text-gray-400'">
                                <Icon :icon="form.sections?.length ? 'ph:check-circle-bold' : 'ph:circle'" />
                                <span class="font-medium">Minimal 1 seksi dibuat</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm"
                                :class="totalFields > 0 ? 'text-green-600' : 'text-gray-400'">
                                <Icon :icon="totalFields > 0 ? 'ph:check-circle-bold' : 'ph:circle'" />
                                <span class="font-medium">Minimal 1 field ditambahkan</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm"
                                :class="form.is_published ? 'text-green-600' : 'text-gray-400'">
                                <Icon :icon="form.is_published ? 'ph:check-circle-bold' : 'ph:circle'" />
                                <span class="font-medium">Form dipublikasikan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB: Bangun Form -->
            <div v-if="activeTab === 'builder'" class="flex flex-col gap-6">

                <!-- Field Palette -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 class="font-black text-gray-800">Tambah Field</h3>
                            <p class="text-xs text-gray-400 mt-0.5">Pilih tipe field dan tambahkan ke seksi yang
                                diinginkan</p>
                        </div>
                        <div v-if="form.sections?.length" class="flex items-center gap-2">
                            <span class="text-xs font-bold text-gray-500">Seksi aktif:</span>
                            <select v-model="activeSectionId"
                                class="text-sm font-bold text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary bg-white">
                                <option v-for="s in form.sections" :key="s.uuid" :value="s.uuid">{{ s.title }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="p-6">
                        <div v-for="cat in fieldCategories" :key="cat.label" class="mb-5 last:mb-0">
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{{ cat.label
                                }}</p>
                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                <button v-for="ft in cat.fields" :key="ft.type" @click="quickAddField(ft)"
                                    :disabled="!activeSectionId"
                                    class="group flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                                    <div
                                        class="size-10 rounded-xl bg-gray-100 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                                        <Icon :icon="ft.icon"
                                            class="text-gray-500 group-hover:text-primary text-xl transition-colors" />
                                    </div>
                                    <span
                                        class="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 text-center leading-tight">{{
                                            ft.label }}</span>
                                </button>
                            </div>
                        </div>
                        <p v-if="!form.sections?.length" class="text-center text-sm text-gray-400 py-4">
                            Buat seksi terlebih dahulu sebelum menambah field
                        </p>
                    </div>
                </div>

                <!-- Sections -->
                <div v-for="(section, si) in form.sections" :key="section.uuid"
                    class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                    :class="activeSectionId === section.uuid ? 'ring-2 ring-primary ring-offset-2' : ''">
                    <!-- Section Header -->
                    <div class="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100"
                        @click="activeSectionId = section.uuid">
                        <div class="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon icon="ph:squares-four-bold" class="text-primary" />
                        </div>
                        <input v-model="section.title"
                            class="flex-1 bg-transparent font-black text-gray-800 focus:outline-none border-b-2 border-transparent focus:border-primary transition-colors"
                            placeholder="Nama Seksi" @click.stop />
                        <div class="flex items-center gap-1 shrink-0">
                            <button @click.stop="activeSectionId = section.uuid; addSection(false)"
                                class="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-text transition-colors">
                                + Field
                            </button>
                            <button @click.stop="deleteSection(section, si)"
                                class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                <Icon icon="ph:trash-bold" />
                            </button>
                        </div>
                    </div>

                    <!-- Fields -->
                    <div class="p-4 flex flex-col gap-3">
                        <div v-if="!section.fields?.length"
                            class="flex flex-col items-center py-8 gap-2 text-center border-2 border-dashed border-gray-100 rounded-xl">
                            <Icon icon="ph:mouse-bold" class="text-gray-300 text-2xl" />
                            <p class="text-gray-400 text-xs">Klik seksi ini lalu pilih field dari palet di atas</p>
                        </div>

                        <div v-for="(field, fi) in section.fields" :key="field.uuid">
                            <!-- Field Row (view) -->
                            <div v-if="editingFieldId !== field.uuid"
                                class="group flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
                                @click="startEditField(field, section)">
                                <div
                                    class="size-8 rounded-lg bg-white border border-gray-200 text-gray-500 flex items-center justify-center shrink-0">
                                    <Icon :icon="getFieldIcon(field.field_type)" class="text-sm" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <span class="font-bold text-sm text-gray-800">{{ field.label }}</span>
                                        <span v-if="field.is_required" class="text-red-500 text-xs font-black">*</span>
                                        <span
                                            class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-500">
                                            {{ field.field_type }}
                                        </span>
                                        <span v-if="field.map_to_field"
                                            class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                                            → {{ profileFieldLabel(field.map_to_field) }}
                                        </span>
                                    </div>
                                    <p v-if="field.placeholder" class="text-xs text-gray-400 mt-0.5 truncate">{{
                                        field.placeholder }}</p>
                                </div>
                                <div
                                    class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    <button @click.stop="startEditField(field, section)"
                                        class="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors">
                                        <Icon icon="ph:pencil-bold" class="text-sm" />
                                    </button>
                                    <button @click.stop="deleteField(field, section, fi)"
                                        class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                        <Icon icon="ph:trash-bold" class="text-sm" />
                                    </button>
                                </div>
                            </div>

                            <!-- Field Editor (inline) -->
                            <div v-else class="rounded-xl border-2 border-primary bg-primary/5 p-4 flex flex-col gap-4">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <div
                                            class="size-7 rounded-lg bg-primary text-primary-text flex items-center justify-center">
                                            <Icon :icon="getFieldIcon(field.field_type)" class="text-sm" />
                                        </div>
                                        <span class="font-black text-sm text-gray-800">Edit: <span
                                                class="text-primary">{{ field.field_type }}</span></span>
                                    </div>
                                    <button @click="cancelEditField" class="p-1 text-gray-400 hover:text-gray-600">
                                        <Icon icon="ph:x-bold" class="text-sm" />
                                    </button>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label class="label-xs">Label <span class="text-red-500">*</span></label>
                                        <input v-model="editingField.label" type="text" class="input-std" />
                                    </div>
                                    <div>
                                        <label class="label-xs">Placeholder</label>
                                        <input v-model="editingField.placeholder" type="text" class="input-std" />
                                    </div>
                                    <div class="sm:col-span-2">
                                        <label class="label-xs">Teks Bantuan</label>
                                        <input v-model="editingField.helper_text" type="text" class="input-std"
                                            placeholder="Instruksi tambahan untuk pengisi form" />
                                    </div>
                                    <div v-if="['select', 'radio', 'checkbox'].includes(editingField.field_type)"
                                        class="sm:col-span-2">
                                        <label class="label-xs">Pilihan (satu per baris)</label>
                                        <textarea :value="getOptionsText(editingField)"
                                            @input="setOptionsText(editingField, $event.target.value)" rows="4"
                                            class="input-std resize-none font-mono text-sm"
                                            placeholder="Pilihan A&#10;Pilihan B&#10;Pilihan C"></textarea>
                                    </div>
                                    <div>
                                        <label class="label-xs">Petakan ke Profil Pemanah</label>
                                        <select v-model="editingField.map_to_field" class="input-std bg-white">
                                            <option value="">— Tidak dipetakan —</option>
                                            <optgroup label="Data Pribadi">
                                                <option value="full_name">Nama Lengkap</option>
                                                <option value="email">Email</option>
                                                <option value="phone">No. HP</option>
                                                <option value="date_of_birth">Tanggal Lahir</option>
                                                <option value="gender">Jenis Kelamin</option>
                                                <option value="address">Alamat</option>
                                                <option value="city">Kota/Kabupaten</option>
                                                <option value="province">Provinsi</option>
                                            </optgroup>
                                            <optgroup label="Data Kepemanahan">
                                                <option value="bow_type">Tipe Busur</option>
                                                <option value="experience_years">Pengalaman (Tahun)</option>
                                                <option value="dominant_hand">Tangan Dominan</option>
                                            </optgroup>
                                            <optgroup label="Data Pendidikan/Institusi">
                                                <option value="school">Sekolah/Instansi</option>
                                                <option value="grade">Kelas/Tingkat</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                    <div class="flex items-center gap-3 py-2">
                                        <button @click="editingField.is_required = !editingField.is_required"
                                            :class="editingField.is_required ? 'bg-primary' : 'bg-gray-200'"
                                            class="relative w-10 h-6 rounded-full transition-colors shrink-0">
                                            <span
                                                :class="editingField.is_required ? 'translate-x-4' : 'translate-x-0.5'"
                                                class="absolute top-0.5 left-0 inline-block w-5 h-5 rounded-full bg-white shadow transition-transform"></span>
                                        </button>
                                        <div>
                                            <p class="text-sm font-bold text-gray-700">Wajib Diisi</p>
                                            <p class="text-xs text-gray-400">Harus diisi sebelum submit</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex gap-2 justify-end pt-1 border-t border-primary/10">
                                    <button @click="cancelEditField"
                                        class="px-4 py-2 rounded-lg text-gray-600 bg-white border border-gray-200 font-bold text-sm hover:bg-gray-50 transition-colors">
                                        Batal
                                    </button>
                                    <button @click="saveField(field, section)" :disabled="isSaving"
                                        class="px-6 py-2 rounded-lg bg-primary text-primary-text font-black text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
                                        <Icon v-if="isSaving" icon="ph:spinner" class="animate-spin" />
                                        <Icon v-else icon="ph:check-bold" />
                                        Simpan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Add Section Button -->
                <button @click="addSection(true)"
                    class="flex items-center justify-center gap-2 w-full py-5 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 text-sm font-black tracking-wider hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                    <Icon icon="ph:plus-circle-bold" class="text-xl" />
                    Tambah Seksi Baru
                </button>
            </div>

            <!-- TAB: Tema -->
            <div v-if="activeTab === 'theme'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
                    <h2 class="font-black text-gray-800 flex items-center gap-2">
                        <Icon icon="ph:palette-bold" class="text-primary" /> Kustomisasi Tema
                    </h2>
                    <div>
                        <label class="label-xs">Warna Utama Form</label>
                        <div class="flex items-center gap-3 mt-2">
                            <input type="color" v-model="themeColor"
                                class="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer p-1" />
                            <input v-model="themeColor" type="text" maxlength="7" class="input-std font-mono w-36" />
                            <div class="flex gap-2">
                                <button v-for="c in presetColors" :key="c" @click="themeColor = c"
                                    class="size-8 rounded-lg border-2 border-white shadow-sm hover:scale-110 transition-transform"
                                    :style="{ backgroundColor: c }"></button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="label-xs">Gambar Cover Header</label>
                        <div v-if="themeCoverImage"
                            class="relative rounded-xl overflow-hidden h-32 bg-gray-100 group mt-2">
                            <img :src="themeCoverImage" class="w-full h-full object-cover" />
                            <button @click="themeCoverImage = ''"
                                class="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <Icon icon="ph:x-bold" class="text-xs" />
                            </button>
                        </div>
                        <input v-else v-model="themeCoverImage" type="url" class="input-std mt-2"
                            placeholder="https://..." />
                    </div>
                    <div>
                        <label class="label-xs">Logo URL</label>
                        <input v-model="themeLogoUrl" type="url" class="input-std" placeholder="https://..." />
                    </div>
                    <button @click="saveTheme" :disabled="isSaving"
                        class="w-full h-11 rounded-xl bg-primary text-primary-text font-black text-sm tracking-widest uppercase transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                        <Icon v-if="isSaving" icon="ph:spinner" class="animate-spin" />
                        Simpan Tema
                    </button>
                </div>

                <!-- Live Preview -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100">
                        <h3 class="font-black text-gray-800 text-sm">Preview Form</h3>
                    </div>
                    <div class="p-4 overflow-y-auto max-h-[500px]">
                        <!-- Form Preview -->
                        <div class="rounded-xl overflow-hidden border border-gray-200">
                            <!-- Cover -->
                            <div class="h-24 flex items-end px-5 pb-4 relative"
                                :style="{ backgroundColor: themeColor }">
                                <div v-if="themeCoverImage" class="absolute inset-0">
                                    <img :src="themeCoverImage" class="w-full h-full object-cover opacity-50" />
                                </div>
                                <div class="relative">
                                    <p class="text-white font-black text-base leading-tight">{{ displayTitle }}</p>
                                    <p class="text-white/70 text-xs mt-0.5">{{ form.description || '' }}</p>
                                </div>
                            </div>
                            <!-- Fields Preview -->
                            <div class="p-4 bg-gray-50 flex flex-col gap-4">
                                <template v-for="section in form.sections" :key="section.uuid">
                                    <p class="text-xs font-black text-gray-500 uppercase tracking-wider">{{
                                        section.title }}</p>
                                    <div v-for="field in section.fields" :key="field.uuid" class="flex flex-col gap-1">
                                        <label class="text-xs font-bold text-gray-700">
                                            {{ field.label }}
                                            <span v-if="field.is_required" class="text-red-500">*</span>
                                        </label>
                                        <div v-if="field.field_type === 'textarea'"
                                            class="h-14 px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs text-gray-300 italic">
                                            {{ field.placeholder || '...' }}</div>
                                        <div v-else-if="['select'].includes(field.field_type)"
                                            class="h-8 px-3 flex items-center rounded-lg border border-gray-200 bg-white text-xs text-gray-300">
                                            Pilih...
                                        </div>
                                        <div v-else-if="field.field_type === 'divider'" class="h-px bg-gray-200 my-1">
                                        </div>
                                        <div v-else-if="field.field_type === 'heading'"
                                            class="font-black text-sm text-gray-700">{{ field.label }}</div>
                                        <div v-else
                                            class="h-8 px-3 flex items-center rounded-lg border border-gray-200 bg-white text-xs text-gray-300 italic">
                                            {{ field.placeholder || '...' }}</div>
                                        <p v-if="field.helper_text" class="text-[10px] text-gray-400">{{
                                            field.helper_text }}</p>
                                    </div>
                                </template>
                                <div v-if="!totalFields" class="text-center py-6 text-gray-400 text-xs">
                                    Tambahkan field untuk melihat preview
                                </div>
                                <button class="w-full h-9 rounded-lg font-black text-xs text-white transition-all"
                                    :style="{ backgroundColor: themeColor }">Daftar Sekarang</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- Field Type Modal -->
        <Teleport to="body">
            <ClientOnly>
                <div v-if="showFieldModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div @click="showFieldModal = false" class="absolute inset-0 bg-navy/70 backdrop-blur-sm"></div>
                    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
                        <div class="h-1.5 bg-primary w-full"></div>
                        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div>
                                <h3 class="font-black text-gray-800">Pilih Tipe Field</h3>
                                <p class="text-xs text-gray-400 mt-0.5">Tambah ke: <strong>{{ activeSection?.title
                                        }}</strong>
                                </p>
                            </div>
                            <button @click="showFieldModal = false"
                                class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                                <Icon icon="ph:x-bold" />
                            </button>
                        </div>
                        <div class="p-5 overflow-y-auto max-h-[65vh]">
                            <div v-for="cat in fieldCategories" :key="cat.label" class="mb-5 last:mb-0">
                                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{{
                                    cat.label }}
                                </p>
                                <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    <button v-for="ft in cat.fields" :key="ft.type" @click="addFieldFromModal(ft)"
                                        class="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-all group">
                                        <div
                                            class="size-10 rounded-xl bg-gray-100 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                                            <Icon :icon="ft.icon"
                                                class="text-gray-500 group-hover:text-primary text-xl transition-colors" />
                                        </div>
                                        <span
                                            class="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 text-center leading-tight">{{
                                                ft.label }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ClientOnly>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Form Pendaftaran — ArcheryHub' })

const { user } = useAuth()
const { get, post, put, delete: del } = useApi()
const toast = useToast()

const isLoading = ref(true)
const isSaving = ref(false)
const form = ref(null)
const activeTab = ref('info')
const activeSectionId = ref('')
const editingFieldId = ref('')
const editingField = ref({})
const editingFieldSection = ref(null)
const showFieldModal = ref(false)
const clubSlug = ref('')
const themeColor = ref('#22D3EE')
const themeCoverImage = ref('')
const themeLogoUrl = ref('')

const presetColors = ['#22D3EE', '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

const tabs = [
    { key: 'info', label: 'Informasi', icon: 'ph:info-bold' },
    { key: 'builder', label: 'Bangun Form', icon: 'ph:clipboard-text-bold' },
    { key: 'theme', label: 'Tema & Preview', icon: 'ph:palette-bold' },
]

const fieldCategories = [
    {
        label: 'Teks & Angka',
        fields: [
            { type: 'text', label: 'Teks Pendek', icon: 'ph:text-t-bold' },
            { type: 'textarea', label: 'Teks Panjang', icon: 'ph:article-bold' },
            { type: 'number', label: 'Angka', icon: 'ph:hash-bold' },
            { type: 'email', label: 'Email', icon: 'ph:envelope-bold' },
            { type: 'phone', label: 'No. HP', icon: 'ph:phone-bold' },
            { type: 'url', label: 'Link/URL', icon: 'ph:link-bold' },
        ]
    },
    {
        label: 'Pilihan',
        fields: [
            { type: 'select', label: 'Dropdown', icon: 'ph:caret-down-bold' },
            { type: 'radio', label: 'Pilihan Tunggal', icon: 'ph:radio-button-bold' },
            { type: 'checkbox', label: 'Pilihan Ganda', icon: 'ph:check-square-bold' },
        ]
    },
    {
        label: 'Tanggal & Waktu',
        fields: [
            { type: 'date', label: 'Tanggal', icon: 'ph:calendar-bold' },
            { type: 'time', label: 'Waktu', icon: 'ph:clock-bold' },
            { type: 'datetime', label: 'Tgl & Waktu', icon: 'ph:calendar-check-bold' },
        ]
    },
    {
        label: 'Upload & Media',
        fields: [
            { type: 'file', label: 'Upload File', icon: 'ph:upload-simple-bold' },
            { type: 'image', label: 'Upload Foto', icon: 'ph:image-bold' },
        ]
    },
    {
        label: 'Tampilan',
        fields: [
            { type: 'heading', label: 'Judul', icon: 'ph:text-h-bold' },
            { type: 'paragraph', label: 'Paragraf', icon: 'ph:paragraph-bold' },
            { type: 'divider', label: 'Garis Pemisah', icon: 'ph:minus-bold' },
        ]
    },
]

const profileFieldLabels = {
    full_name: 'Nama', email: 'Email', phone: 'HP', date_of_birth: 'Tgl Lahir',
    gender: 'Gender', address: 'Alamat', city: 'Kota', province: 'Provinsi',
    bow_type: 'Busur', experience_years: 'Pengalaman', dominant_hand: 'Tangan',
    school: 'Sekolah', grade: 'Kelas',
}

const publicUrl = computed(() => {
    if (!clubSlug.value) return ''
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://archeryhub.id'
    return `${base}/clubs/${clubSlug.value}/daftar`
})

const totalFields = computed(() => form.value?.sections?.reduce((sum, s) => sum + (s.fields?.length || 0), 0) || 0)
const requiredFields = computed(() => form.value?.sections?.reduce((sum, s) => sum + (s.fields?.filter(f => f.is_required)?.length || 0), 0) || 0)
const activeSection = computed(() => form.value?.sections?.find(s => s.uuid === activeSectionId.value))
const displayTitle = computed(() => form.value?.title || 'Form Pendaftaran')
const publishStatusText = computed(() => {
    if (!form.value) return ''
    return form.value.is_published
        ? 'Form aktif dan dapat diisi pemanah'
        : 'Form masih tersembunyi dari publik'
})

function getFieldIcon(type) {
    for (const cat of fieldCategories) {
        const ft = cat.fields.find(f => f.type === type)
        if (ft) return ft.icon
    }
    return 'ph:text-t-bold'
}

function profileFieldLabel(key) {
    return profileFieldLabels[key] || key
}

function getOptionsText(field) {
    if (!field.options) return ''
    try { return JSON.parse(field.options).map(o => o.label || o).join('\n') } catch { return '' }
}

function setOptionsText(field, text) {
    const lines = text.split('\n').filter(l => l.trim())
    field.options = JSON.stringify(lines.map(l => ({ label: l.trim(), value: l.trim() })))
}

// ── API ──────────────────────────────────────────────────────────────────────

async function fetchForm() {
    isLoading.value = true
    try {
        const resp = await get('/clubs/forms')
        form.value = resp.data || null
        if (form.value) {
            const theme = form.value.theme ? JSON.parse(form.value.theme) : {}
            themeColor.value = theme.primaryColor || '#22D3EE'
            themeCoverImage.value = theme.coverImage || ''
            themeLogoUrl.value = theme.logoUrl || ''
            if (!form.value.sections) form.value.sections = []
            if (form.value.sections.length) activeSectionId.value = form.value.sections[0].uuid
        }
        try {
            const clubResp = await get('/club/me')
            clubSlug.value = clubResp?.slug || clubResp?.data?.slug || ''
        } catch { /* ignore */ }
    } catch (e) {
        console.error(e)
    } finally {
        isLoading.value = false
    }
}

async function createForm() {
    isSaving.value = true
    try {
        await post('/clubs/forms', { title: 'Form Pendaftaran Anggota' })
        await fetchForm()
        activeTab.value = 'builder'
        toast.success('Form berhasil dibuat!')
    } catch (e) {
        toast.error('Gagal membuat form')
    } finally {
        isSaving.value = false
    }
}

async function saveAll() {
    if (!form.value) return
    isSaving.value = true
    try {
        await put(`/clubs/forms/${form.value.uuid}`, {
            title: form.value.title,
            description: form.value.description,
        })
        for (const section of form.value.sections || []) {
            if (section.uuid) {
                await put(`/clubs/forms/${form.value.uuid}/sections/${section.uuid}`, {
                    title: section.title,
                    description: section.description,
                }).catch(() => { })
            }
        }
        toast.success('Tersimpan!')
    } catch (e) {
        toast.error('Gagal menyimpan')
    } finally {
        isSaving.value = false
    }
}

async function saveTheme() {
    isSaving.value = true
    try {
        const theme = JSON.stringify({ primaryColor: themeColor.value, coverImage: themeCoverImage.value, logoUrl: themeLogoUrl.value })
        await put(`/clubs/forms/${form.value.uuid}`, { theme })
        toast.success('Tema disimpan!')
    } catch { toast.error('Gagal menyimpan tema') } finally { isSaving.value = false }
}

async function togglePublish() {
    if (!form.value) return
    isSaving.value = true
    try {
        await post(`/clubs/forms/${form.value.uuid}/publish`, { is_published: !form.value.is_published })
        form.value.is_published = !form.value.is_published
        toast.success(form.value.is_published ? 'Form dipublikasikan!' : 'Form disembunyikan')
    } catch { toast.error('Gagal mengubah status') } finally { isSaving.value = false }
}

// ── Section ───────────────────────────────────────────────────────────────────

async function addSection(switchToBuilder = false) {
    if (!form.value) return
    isSaving.value = true
    try {
        const title = `Seksi ${(form.value.sections?.length || 0) + 1}`
        const resp = await post(`/clubs/forms/${form.value.uuid}/sections`, { title })
        form.value.sections = form.value.sections || []
        const newSection = { uuid: resp.id, form_id: form.value.uuid, title, description: null, order_index: form.value.sections.length, fields: [] }
        form.value.sections.push(newSection)
        activeSectionId.value = resp.id
        if (switchToBuilder) activeTab.value = 'builder'
        toast.success('Seksi ditambahkan!')
    } catch { toast.error('Gagal menambah seksi') } finally { isSaving.value = false }
}

async function deleteSection(section, idx) {
    if (!confirm(`Hapus seksi "${section.title}" dan semua field-nya?`)) return
    try {
        await del(`/clubs/forms/${form.value.uuid}/sections/${section.uuid}`)
        form.value.sections.splice(idx, 1)
        if (activeSectionId.value === section.uuid) {
            activeSectionId.value = form.value.sections[0]?.uuid || ''
        }
        toast.success('Seksi dihapus')
    } catch { toast.error('Gagal menghapus seksi') }
}

// ── Field ─────────────────────────────────────────────────────────────────────

function quickAddField(ft) {
    if (!activeSectionId.value) {
        toast.error('Pilih seksi terlebih dahulu')
        return
    }
    doAddField(ft)
}

function addSection_thenModal() {
    showFieldModal.value = true
}

async function doAddField(ft) {
    const section = activeSection.value
    if (!section) return
    isSaving.value = true
    try {
        const resp = await post(`/clubs/forms/${form.value.uuid}/sections/${section.uuid}/fields`, {
            field_type: ft.type,
            label: ft.label,
            is_required: false,
        })
        section.fields = section.fields || []
        const newField = {
            uuid: resp.id, section_id: section.uuid, form_id: form.value.uuid,
            field_type: ft.type, label: ft.label, placeholder: null,
            helper_text: null, is_required: false, options: null, map_to_field: null, order_index: section.fields.length,
        }
        section.fields.push(newField)
        startEditField(newField, section)
        toast.success('Field ditambahkan!')
    } catch { toast.error('Gagal menambah field') } finally { isSaving.value = false }
}

function addFieldFromModal(ft) {
    showFieldModal.value = false
    doAddField(ft)
}

function startEditField(field, section) {
    editingFieldId.value = field.uuid
    editingField.value = { ...field }
    editingFieldSection.value = section
}

function cancelEditField() {
    editingFieldId.value = ''
    editingField.value = {}
    editingFieldSection.value = null
}

async function saveField(field, section) {
    isSaving.value = true
    try {
        await put(`/clubs/forms/${form.value.uuid}/fields/${editingField.value.uuid}`, {
            label: editingField.value.label,
            placeholder: editingField.value.placeholder,
            helper_text: editingField.value.helper_text,
            is_required: editingField.value.is_required,
            options: editingField.value.options,
            map_to_field: editingField.value.map_to_field,
        })
        const idx = section.fields.findIndex(f => f.uuid === editingField.value.uuid)
        if (idx !== -1) section.fields[idx] = { ...editingField.value }
        cancelEditField()
        toast.success('Field disimpan!')
    } catch { toast.error('Gagal menyimpan field') } finally { isSaving.value = false }
}

async function deleteField(field, section, idx) {
    try {
        await del(`/clubs/forms/${form.value.uuid}/fields/${field.uuid}`)
        section.fields.splice(idx, 1)
        if (editingFieldId.value === field.uuid) cancelEditField()
        toast.success('Field dihapus')
    } catch { toast.error('Gagal menghapus field') }
}

function copyLink() {
    navigator.clipboard.writeText(publicUrl.value)
    toast.success('Link disalin!')
}

onMounted(fetchForm)
</script>

<style scoped>
.input-std {
    @apply w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-primary transition-colors;
}

.label-xs {
    @apply block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5;
}
</style>

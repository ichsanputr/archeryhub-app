<template>
    <div class="flex flex-col gap-6">

        <!-- ── Page Header ──────────────────────────────────────────────── -->
        <div class="relative overflow-hidden rounded-3xl bg-navy text-white">
            <div class="absolute inset-0"
                style="background-image:var(--motif-pattern);opacity:var(--motif-opacity,0.15)"></div>
            <div class="absolute -top-16 -right-16 size-56 rounded-full bg-primary/10 blur-3xl pointer-events-none">
            </div>
            <div class="absolute -bottom-10 -left-10 size-40 rounded-full bg-primary/5 blur-3xl pointer-events-none">
            </div>
            <div class="relative px-6 py-8 sm:px-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div class="flex items-center gap-5">
                    <div
                        class="size-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
                        <Icon icon="ph:crown-bold" class="text-primary text-2xl" />
                    </div>
                    <div>
                        <div
                            class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/70 mb-1">
                            <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
                            <Icon icon="ph:caret-right-bold" class="opacity-50" />
                            <span class="text-white/80">Membership</span>
                        </div>
                        <h1 class="text-2xl sm:text-3xl font-black leading-tight">Manajemen Membership</h1>
                        <p class="text-white/60 text-sm mt-1">Kelola paket dan langganan anggota klub Anda</p>
                    </div>
                </div>
                <button @click="showAssignModal = true"
                    class="flex items-center gap-2.5 h-11 px-7 rounded-2xl bg-primary text-primary-text font-black text-sm shadow-lg shadow-primary/30 hover:opacity-90 transition-all shrink-0">
                    <Icon icon="ph:plus-bold" />
                    Assign Paket
                </button>
            </div>
        </div>

        <!-- ── Stats ────────────────────────────────────────────────────── -->
        <div class="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            <div v-for="stat in statCards" :key="stat.label"
                class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all"
                :class="stat.span ? 'col-span-2 xl:col-span-1' : ''">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors shrink-0">
                    <Icon :icon="stat.icon" class="text-xl" />
                </div>
                <div class="min-w-0">
                    <p class="text-[10px] text-gray-400 font-bold tracking-wider mb-1">{{ stat.label }}</p>
                    <p class="text-lg font-bold text-navy">{{ stat.value }}</p>
                </div>
            </div>
        </div>

        <!-- ── Tabs ──────────────────────────────────────────────────────── -->
        <div class="flex gap-1 bg-gray-100/80 rounded-2xl p-1.5">
            <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key" :class="activeTab === tab.key
                ? 'bg-white shadow text-gray-900 shadow-gray-200/80'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'"
                class="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl text-sm font-black transition-all">
                <Icon :icon="tab.icon" />
                {{ tab.label }}
            </button>
        </div>

        <!-- ═══════════════════════════════════════════════════════════════
         TAB — SUBSCRIBERS
    ════════════════════════════════════════════════════════════════ -->
        <div v-if="activeTab === 'subscribers'" class="flex flex-col gap-4">

            <!-- Toolbar -->
            <div class="flex flex-wrap gap-3">
                <div class="relative flex-1 min-w-52">
                    <Icon icon="ph:magnifying-glass-bold"
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input v-model="search" type="text" placeholder="Cari nama atau email..."
                        class="w-full pl-11 pr-4 h-11 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div class="flex gap-2">
                    <button v-for="f in statusFilters" :key="f.value" @click="filterStatus = f.value" :class="filterStatus === f.value
                        ? 'bg-primary text-primary-text shadow shadow-primary/20'
                        : 'bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-primary'"
                        class="h-11 px-4 rounded-xl font-black text-xs uppercase tracking-wide transition-all">
                        {{ f.label }}
                    </button>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="isLoading"
                class="flex justify-center items-center py-28 bg-white rounded-2xl border border-gray-100">
                <div class="flex flex-col items-center gap-3">
                    <div class="size-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                    <p class="text-sm font-medium text-gray-400">Memuat data...</p>
                </div>
            </div>

            <!-- Empty -->
            <div v-else-if="!filteredSubs.length"
                class="flex flex-col items-center gap-4 py-24 bg-white rounded-2xl border border-gray-100 border-dashed">
                <div class="size-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Icon icon="ph:users-three-bold" class="text-gray-400 text-3xl" />
                </div>
                <div class="text-center">
                    <p class="font-black text-gray-700">{{ emptyStateMessage }}</p>
                    <p class="text-sm text-gray-400 mt-1">{{ search || filterStatus ? 'Coba ubah filter pencarian' :
                        'Assign paket ke anggota untuk mulai' }}</p>
                </div>
            </div>

            <!-- Cards Grid -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <div v-for="sub in filteredSubs" :key="sub.uuid"
                    class="rounded-2xl border shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                    :class="[statusCardBorder(sub.status), statusCardBg(sub.status)]">
                    <!-- Card top stripe based on status -->
                    <div class="h-1.5 w-full" :class="statusStripe(sub.status)"></div>
                    <div class="p-5 flex flex-col gap-4 flex-1">
                        <!-- Archer info -->
                        <div class="flex items-center gap-3">
                            <div class="size-11 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border"
                                :class="statusInnerBox(sub.status)">
                                <img v-if="sub.avatar_url" :src="sub.avatar_url" class="w-full h-full object-cover" />
                                <Icon v-else icon="ph:user-bold" class="text-gray-400 text-lg opacity-60" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="font-black text-gray-800 text-sm truncate">{{ sub.archer_name }}</p>
                                <p class="text-xs text-gray-400 truncate">{{ sub.archer_email }}</p>
                            </div>
                            <span :class="statusPill(sub.status)"
                                class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0">
                                {{ statusLabel(sub.status) }}
                            </span>
                        </div>

                        <!-- Package & Dates -->
                        <div class="grid grid-cols-2 gap-2">
                            <div class="rounded-xl p-3" :class="statusInnerBox(sub.status)">
                                <p class="text-[10px] font-black uppercase tracking-wider mb-1 opacity-50"
                                    :class="statusText(sub.status)">Paket</p>
                                <p class="text-sm font-black text-gray-800 truncate">{{ sub.package_name || '—' }}</p>
                                <p class="text-xs font-bold mt-0.5 text-gray-900">{{ formatCurrency(sub.amount) }}</p>
                            </div>
                            <div class="rounded-xl p-3" :class="statusInnerBox(sub.status)">
                                <p class="text-[10px] font-black uppercase tracking-wider mb-1 opacity-50"
                                    :class="statusText(sub.status)">Berlaku
                                </p>
                                <p class="text-xs font-bold text-gray-800">{{ formatDate(sub.start_date) }}</p>
                                <p class="text-xs text-gray-600">s/d {{ formatDate(sub.end_date) }}</p>
                            </div>
                        </div>

                        <!-- Countdown if active -->
                        <div v-if="sub.status === 'active' && sub.end_date" class="relative">
                            <div class="flex items-center justify-between mb-1.5">
                                <p class="text-[10px] font-black uppercase tracking-wider text-primary/80 opacity-80">
                                    Sisa Masa Aktif
                                </p>
                                <p class="text-[10px] font-black"
                                    :class="daysLeft(sub.end_date) <= 3 ? 'text-red-500' : 'text-gray-500'">
                                    {{ daysLeft(sub.end_date) }} hari
                                </p>
                            </div>
                            <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all"
                                    :class="daysLeft(sub.end_date) <= 3 ? 'bg-red-400' : daysLeft(sub.end_date) <= 7 ? 'bg-amber-400' : 'bg-primary'"
                                    :style="{ width: progressWidth(sub) }"></div>
                            </div>
                        </div>
                    </div>

                    <div class="px-5 py-3 flex gap-2 border-t" :class="statusCardBorder(sub.status)">
                        <button @click="openHistoryModal(sub)"
                            class="flex items-center gap-1.5 h-9 px-4 rounded-xl border border-gray-100 bg-white text-gray-500 font-black text-xs hover:border-primary hover:text-primary transition-colors flex-1 justify-center">
                            <Icon icon="ph:clock-counter-clockwise-bold" />
                            Riwayat
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════════
         TAB — PACKAGES
    ════════════════════════════════════════════════════════════════ -->
        <div v-if="activeTab === 'packages'" class="flex flex-col gap-4">
            <div class="flex justify-end">
                <button @click="openPackageModal(null)"
                    class="flex items-center gap-2 h-11 px-6 rounded-2xl bg-primary text-primary-text font-black text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                    <Icon icon="ph:plus-bold" />
                    Buat Paket Baru
                </button>
            </div>

            <!-- Empty packages -->
            <div v-if="!packages.length"
                class="flex flex-col items-center gap-4 py-24 bg-white rounded-2xl border border-dashed border-gray-200">
                <div class="size-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                    <Icon icon="ph:package-bold" class="text-primary text-3xl" />
                </div>
                <div class="text-center">
                    <p class="font-black text-gray-700">Belum Ada Paket</p>
                    <p class="text-sm text-gray-400 mt-1">Buat paket membership untuk ditetapkan ke anggota</p>
                </div>
                <button @click="openPackageModal(null)"
                    class="h-11 px-8 rounded-2xl bg-primary text-primary-text font-black text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                    Buat Paket Pertama
                </button>
            </div>

            <!-- Packages grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="pkg in packages" :key="pkg.uuid"
                    class="relative bg-white rounded-2xl border overflow-hidden flex flex-col transition-all hover:shadow-md"
                    :class="pkg.is_active ? 'border-gray-100 shadow-sm' : 'border-gray-200 opacity-60'">
                    <!-- Accent top -->
                    <div class="h-1.5 bg-primary w-full"></div>
                    <div class="p-6 flex flex-col gap-4 flex-1">
                        <div class="flex items-start justify-between gap-3">
                            <div class="size-11 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                <Icon icon="ph:crown-bold" class="text-primary text-xl" />
                            </div>
                            <span v-if="!pkg.is_active"
                                class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                                Nonaktif
                            </span>
                        </div>
                        <div class="flex-1">
                            <h3 class="font-black text-gray-900 text-lg leading-tight">{{ pkg.name }}</h3>
                            <p v-if="pkg.description" class="text-sm text-gray-400 mt-1 line-clamp-2">{{ pkg.description
                            }}</p>
                        </div>
                        <div class="flex items-baseline gap-1.5">
                            <span class="text-3xl font-black text-gray-900">{{ formatCurrency(pkg.price) }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-500 font-medium">
                            <Icon icon="ph:calendar-bold" class="text-gray-400" />
                            <span>{{ pkg.duration_days }} hari masa aktif</span>
                        </div>
                    </div>
                    <div class="border-t border-gray-100 p-4 flex gap-2">
                        <button @click="openPackageModal(pkg)"
                            class="flex-1 h-9 rounded-xl border border-gray-200 text-gray-600 font-black text-xs hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
                            <Icon icon="ph:pencil-bold" />
                            Edit
                        </button>
                        <button @click="togglePackageActive(pkg)"
                            class="flex-1 h-9 rounded-xl font-black text-xs transition-colors flex items-center justify-center gap-1.5"
                            :class="pkg.is_active ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-primary/10 text-primary hover:bg-primary/20'">
                            <Icon :icon="pkg.is_active ? 'ph:eye-slash-bold' : 'ph:eye-bold'" />
                            {{ pkg.is_active ? 'Nonaktifkan' : 'Aktifkan' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ════════════════════════════════════════════════════════════
         MODALS
    ═════════════════════════════════════════════════════════════ -->
        <Teleport to="body">
            <ClientOnly>

                <!-- ── Package Modal ── -->
                <Transition name="modal">
                    <div v-if="showPackageModal"
                        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <div @click="showPackageModal = false" class="absolute inset-0 bg-black/60 backdrop-blur-sm">
                        </div>
                        <div
                            class="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl">
                            <div class="h-1.5 bg-primary"></div>
                            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                                <div>
                                    <h3 class="font-black text-gray-900 text-lg">{{ packageModalTitle }}</h3>
                                    <p class="text-xs text-gray-400 mt-0.5">{{ packageModalSubtitle }}</p>
                                </div>
                                <button @click="showPackageModal = false"
                                    class="size-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                                    <Icon icon="ph:x-bold" />
                                </button>
                            </div>
                            <div class="p-6 flex flex-col gap-4">
                                <div>
                                    <label class="label-xs">Nama Paket <span class="text-red-500">*</span></label>
                                    <input v-model="packageForm.name" type="text" class="input-std"
                                        placeholder="Contoh: Paket Latihan Bulanan" />
                                </div>
                                <div>
                                    <label class="label-xs">Deskripsi</label>
                                    <textarea v-model="packageForm.description" rows="2" class="input-std resize-none"
                                        placeholder="Keterangan singkat tentang paket ini..."></textarea>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="label-xs">Harga (Rp) <span class="text-red-500">*</span></label>
                                        <input v-model.number="packageForm.price" type="number" min="0"
                                            class="input-std" placeholder="100000" />
                                    </div>
                                    <div>
                                        <label class="label-xs">Masa Aktif</label>
                                        <select v-model.number="packageForm.duration_days" class="input-std bg-white">
                                            <option :value="30">30 hari — Bulanan</option>
                                            <option :value="60">60 hari</option>
                                            <option :value="90">90 hari — 3 Bulan</option>
                                            <option :value="180">180 hari — 6 Bulan</option>
                                            <option :value="365">365 hari — Tahunan</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="flex gap-3 pt-2 border-t border-gray-100">
                                    <button @click="showPackageModal = false"
                                        class="flex-1 h-11 rounded-xl border border-gray-200 text-gray-600 font-black text-sm hover:bg-gray-50 transition-colors">
                                        Batal
                                    </button>
                                    <button @click="savePackage" :disabled="isSaving"
                                        class="flex-1 h-11 rounded-xl bg-primary text-primary-text font-black text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                                        <Icon v-if="isSaving" icon="ph:spinner" class="animate-spin" />
                                        <Icon v-else icon="ph:check-bold" />
                                        Simpan Paket
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>

                <!-- ── Assign Modal ── -->
                <Transition name="modal">
                    <div v-if="showAssignModal"
                        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <div @click="showAssignModal = false" class="absolute inset-0 bg-black/60 backdrop-blur-sm">
                        </div>
                        <div
                            class="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl">
                            <div class="h-1.5 bg-primary"></div>
                            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                                <div>
                                    <h3 class="font-black text-gray-900 text-lg">Assign Paket</h3>
                                    <p class="text-xs text-gray-400 mt-0.5">Pilih anggota dan paket yang ingin di-assign
                                    </p>
                                </div>
                                <button @click="showAssignModal = false"
                                    class="size-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                                    <Icon icon="ph:x-bold" />
                                </button>
                            </div>
                            <div class="p-6 flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
                                <div>
                                    <label class="label-xs">Pilih Anggota <span class="text-red-500">*</span></label>
                                    <select v-model="assignForm.archer_id" class="input-std bg-white">
                                        <option value="">— Pilih anggota —</option>
                                        <option v-for="m in unassignedMembers" :key="m.uuid" :value="m.archer_id">
                                            {{ m.full_name || m.archer_name }}
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label class="label-xs">Pilih Paket <span class="text-red-500">*</span></label>
                                    <div v-if="!activePackages.length"
                                        class="p-4 rounded-xl bg-orange-50 border border-orange-100 text-sm text-orange-600 font-medium">
                                        Belum ada paket aktif. Buat paket terlebih dahulu di tab Paket.
                                    </div>
                                    <div v-else class="grid gap-2">
                                        <label v-for="pkg in activePackages" :key="pkg.uuid"
                                            class="flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all"
                                            :class="assignForm.membership_package_id === pkg.uuid
                                                ? 'border-primary bg-primary/5'
                                                : 'border-gray-100 hover:border-gray-200'">
                                            <input type="radio" v-model="assignForm.membership_package_id"
                                                :value="pkg.uuid" class="hidden" />
                                            <div class="size-4 rounded-full border-2 flex items-center justify-center shrink-0"
                                                :class="assignForm.membership_package_id === pkg.uuid ? 'border-primary' : 'border-gray-300'">
                                                <div v-if="assignForm.membership_package_id === pkg.uuid"
                                                    class="size-2 rounded-full bg-primary"></div>
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <p class="font-bold text-sm text-gray-800">{{ pkg.name }}</p>
                                                <p class="text-xs text-gray-400">{{ pkg.duration_days }} hari</p>
                                            </div>
                                            <span class="font-black text-gray-900 text-sm shrink-0">{{
                                                formatCurrency(pkg.price) }}</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label class="label-xs">Tanggal Mulai</label>
                                    <input v-model="assignForm.start_date" type="date" class="input-std" />
                                </div>
                                <div class="flex gap-3 pt-2 border-t border-gray-100">
                                    <button @click="showAssignModal = false"
                                        class="flex-1 h-11 rounded-xl border border-gray-200 text-gray-600 font-black text-sm hover:bg-gray-50">Batal</button>
                                    <button @click="assignPackage"
                                        :disabled="isSaving || !assignForm.archer_id || !assignForm.membership_package_id"
                                        class="flex-1 h-11 rounded-xl bg-primary text-primary-text font-black text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                                        <Icon v-if="isSaving" icon="ph:spinner" class="animate-spin" />
                                        <Icon v-else icon="ph:paper-plane-tilt-bold" />
                                        Assign Sekarang
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>



                <!-- ── History Modal ── -->
                <Transition name="modal">
                    <div v-if="showHistoryModal"
                        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <div @click="showHistoryModal = false" class="absolute inset-0 bg-black/60 backdrop-blur-sm">
                        </div>
                        <div
                            class="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl">
                            <div class="h-1.5 bg-primary"></div>
                            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="size-9 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                                        <img v-if="selectedSub?.avatar_url" :src="selectedSub.avatar_url"
                                            class="w-full h-full object-cover" />
                                        <Icon v-else icon="ph:user-bold" class="text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 class="font-black text-gray-900">{{ selectedSub?.archer_name }}</h3>
                                        <p class="text-xs text-gray-400">Riwayat Langganan</p>
                                    </div>
                                </div>
                                <button @click="showHistoryModal = false"
                                    class="size-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                                    <Icon icon="ph:x-bold" />
                                </button>
                            </div>
                            <div class="overflow-y-auto max-h-[70vh]">
                                <div v-if="loadingHistory" class="flex justify-center py-16">
                                    <div
                                        class="size-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin">
                                    </div>
                                </div>
                                <template v-else>
                                    <!-- Subscriptions section -->
                                    <div class="px-6 pt-5 pb-2">
                                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                            Riwayat Paket</p>
                                        <div v-if="!history.subscriptions?.length"
                                            class="text-sm text-gray-400 italic py-3 text-center">Belum ada riwayat
                                            paket</div>
                                        <div v-for="s in history.subscriptions" :key="s.uuid"
                                            class="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                                            <div class="size-9 rounded-xl flex items-center justify-center shrink-0"
                                                :class="statusStripe(s.status).replace('bg-', 'bg-').replace('h-1.5', '')">
                                                <Icon icon="ph:crown-bold" class="text-sm text-white" />
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <div class="flex items-center gap-2 flex-wrap">
                                                    <p class="font-bold text-sm text-gray-800 truncate">{{
                                                        s.package_name || '—' }}</p>
                                                    <span :class="statusPill(s.status)"
                                                        class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                                                        {{ statusLabel(s.status) }}
                                                    </span>
                                                </div>
                                                <p class="text-xs text-gray-400">{{ formatDate(s.start_date) }} — {{
                                                    formatDate(s.end_date) }}</p>
                                            </div>
                                            <span class="text-sm font-black text-gray-700 shrink-0">{{
                                                formatCurrency(s.amount) }}</span>
                                        </div>
                                    </div>
                                    <!-- Payments section -->
                                    <div class="px-6 pt-3 pb-6">
                                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                            Riwayat Pembayaran</p>
                                        <div v-if="!history.payments?.length"
                                            class="text-sm text-gray-400 italic py-3 text-center">
                                            Belum ada pembayaran
                                            tercatat</div>
                                        <div v-for="p in history.payments" :key="p.uuid"
                                            class="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                                            <div
                                                class="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                <Icon icon="ph:receipt-bold" class="text-primary text-sm" />
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <p class="font-bold text-sm text-gray-800">{{ formatCurrency(p.amount)
                                                    }}</p>
                                                <p class="text-xs text-gray-400">{{ p.payment_method }} · {{
                                                    formatDate(p.paid_at) }}</p>
                                                <p v-if="p.payment_note" class="text-xs text-gray-400 truncate">{{
                                                    p.payment_note }}</p>
                                            </div>
                                            <div
                                                class="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <Icon icon="ph:check-bold" class="text-primary text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </Transition>

                <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />

            </ClientOnly>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import { useAuth } from '~/composables/useAuth'
import MediaLibrary from '~/components/common/MediaLibrary.vue'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Membership — ArcheryHub' })

const { get, post, put, delete: del } = useApi()
const { user } = useAuth()

const showMediaLibrary = ref(false)
const mediaContext = ref('pay') // 'pay'
const handleMediaSelect = (media) => {
    payForm.value.proof_url = media.url
}
const toast = useToast()

const isLoading = ref(true)
const isSaving = ref(false)
const loadingHistory = ref(false)

const subscriptions = ref([])
const packages = ref([])
const activeMembers = ref([])
const stats = ref({ total_active: 0, total_expired: 0, total_pending: 0, revenue_month: 0, expiring_in_3_days: 0 })

const activeTab = ref('subscribers')
const search = ref('')
const filterStatus = ref('')

const showPackageModal = ref(false)
const showAssignModal = ref(false)
const showHistoryModal = ref(false)

const editingPackage = ref(null)
const selectedSub = ref(null)
const history = ref({ subscriptions: [], payments: [] })

const packageForm = ref({ name: '', description: '', price: 0, duration_days: 30 })
const assignForm = ref({ archer_id: '', membership_package_id: '', start_date: '' })

const tabs = [
    { key: 'subscribers', label: 'Anggota', icon: 'ph:users-bold' },
    { key: 'packages', label: 'Paket', icon: 'ph:package-bold' },
]

const statusFilters = [
    { label: 'Semua', value: '' },
    { label: 'Aktif', value: 'active' },
    { label: 'Expired', value: 'expired' },
    { label: 'Belum Bayar', value: 'pending' },
]

const statCards = computed(() => [
    { label: 'Aktif', value: stats.value.total_active, icon: 'ph:check-circle-bold' },
    { label: 'Expired', value: stats.value.total_expired, icon: 'ph:x-circle-bold' },
    { label: 'Belum Bayar', value: stats.value.total_pending, icon: 'ph:clock-bold' },
    { label: 'Hampir Habis', value: stats.value.expiring_in_3_days, icon: 'ph:warning-bold' },
    { label: 'Pendapatan Bulan Ini', value: formatCurrency(stats.value.revenue_month), icon: 'ph:currency-circle-dollar-bold', span: true },
])

const activePackages = computed(() => packages.value.filter(p => p.is_active))
const unassignedMembers = computed(() => {
    const assignedIds = new Set(subscriptions.value.map(s => s.archer_id))
    return activeMembers.value.filter(m => !assignedIds.has(m.archer_id))
})

const filteredSubs = computed(() => subscriptions.value.filter(s => {
    const bySearch = !search.value || s.archer_name?.toLowerCase().includes(search.value.toLowerCase()) || s.archer_email?.toLowerCase().includes(search.value.toLowerCase())
    const byStatus = !filterStatus.value || s.status === filterStatus.value
    return bySearch && byStatus
}))

const emptyStateMessage = computed(() =>
    search.value || filterStatus.value ? 'Tidak ada hasil ditemukan' : 'Belum ada anggota yang di-assign paket'
)

const packageModalTitle = computed(() =>
    editingPackage.value?.uuid ? 'Edit Paket' : 'Buat Paket Baru'
)

const packageModalSubtitle = computed(() =>
    editingPackage.value?.uuid ? 'Ubah detail paket' : 'Isi detail paket baru'
)

function statusPill(status) {
    return {
        active: 'bg-primary/15 text-primary',
        expired: 'bg-red-100 text-red-600',
        pending: 'bg-amber-100 text-amber-700',
        canceled: 'bg-gray-100 text-gray-500'
    }[status] || 'bg-gray-100 text-gray-500'
}

function statusCardBorder(status) {
    return 'border-gray-100'
}

function statusCardBg(status) {
    return 'bg-white'
}

function statusInnerBox(status) {
    return 'bg-gray-50 border border-gray-100'
}

function statusText(status) {
    return {
        active: 'text-navy',
        expired: 'text-red-800',
        pending: 'text-amber-800',
        canceled: 'text-gray-800'
    }[status] || 'text-gray-800'
}

function statusStripe(status) {
    return 'bg-gray-200'
}

function statusLabel(status) {
    return { active: 'Aktif', expired: 'Expired', pending: 'Belum Bayar', canceled: 'Dibatalkan' }[status] || status
}

function formatCurrency(v) {
    if (v === undefined || v === null) return '—'
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v)
}

function formatDate(v) {
    if (!v) return '—'
    return new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function daysLeft(endDate) {
    if (!endDate) return 0
    const diff = new Date(endDate) - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function progressWidth(sub) {
    if (!sub.start_date || !sub.end_date) return '0%'
    const total = new Date(sub.end_date) - new Date(sub.start_date)
    const elapsed = new Date() - new Date(sub.start_date)
    const pct = Math.min(100, Math.max(0, (elapsed / total) * 100))
    return `${100 - pct}%`
}

// ── API ───────────────────────────────────────────────────────────────────────

async function fetchAll() {
    isLoading.value = true
    try {
        const [subResp, pkgResp, statsResp] = await Promise.all([
            get('/clubs/membership/subscriptions'),
            get('/clubs/membership/packages'),
            get('/clubs/membership/stats'),
        ])
        subscriptions.value = subResp.data || []
        packages.value = pkgResp.data || []
        stats.value = statsResp.data || stats.value
    } catch (e) {
        console.error(e)
    } finally {
        isLoading.value = false
    }
}

async function fetchMembers() {
    try {
        const clubId = user.value?.uuid || user.value?.id
        if (clubId) {
            const m = await get(`/clubs/members/${clubId}`)
            const list = m.data || []
            // Also include invited & pending members
            activeMembers.value = list.filter(mb => ['active', 'invited', 'pending'].includes(mb.status))
        }
    } catch { /* ignore */ }
}

function openPackageModal(pkg) {
    editingPackage.value = pkg
    packageForm.value = pkg
        ? { name: pkg.name, description: pkg.description || '', price: pkg.price, duration_days: pkg.duration_days }
        : { name: '', description: '', price: 0, duration_days: 30 }
    showPackageModal.value = true
}

async function savePackage() {
    if (!packageForm.value.name || !packageForm.value.price) { toast.error('Nama dan harga wajib diisi'); return }
    isSaving.value = true
    try {
        if (editingPackage.value?.uuid) {
            await put(`/clubs/membership/packages/${editingPackage.value.uuid}`, packageForm.value)
            toast.success('Paket diperbarui!')
        } else {
            await post('/clubs/membership/packages', packageForm.value)
            toast.success('Paket dibuat!')
        }
        showPackageModal.value = false
        await fetchAll()
    } catch { toast.error('Gagal menyimpan paket') } finally { isSaving.value = false }
}

async function togglePackageActive(pkg) {
    try {
        await put(`/clubs/membership/packages/${pkg.uuid}`, { is_active: !pkg.is_active })
        toast.success(pkg.is_active ? 'Paket dinonaktifkan' : 'Paket diaktifkan')
        await fetchAll()
    } catch { toast.error('Gagal mengubah status') }
}

async function assignPackage() {
    isSaving.value = true
    try {
        const payload = { ...assignForm.value }
        await post('/clubs/membership/subscriptions', payload)
        toast.success('Paket berhasil di-assign!')
        showAssignModal.value = false
        assignForm.value = { archer_id: '', membership_package_id: '', start_date: '' }
        await fetchAll()
    } catch (e) {
        toast.error(e?.data?.error || 'Gagal assign paket')
    } finally { isSaving.value = false }
}

async function openHistoryModal(sub) {
    selectedSub.value = sub
    showHistoryModal.value = true
    loadingHistory.value = true
    try {
        history.value = await get(`/clubs/membership/subscriptions/archer/${sub.user_id}`)
    } catch { history.value = { subscriptions: [], payments: [] } } finally { loadingHistory.value = false }
}

onMounted(() => { fetchAll(); fetchMembers() })
</script>

<style scoped>
.input-std {
    @apply w-full px-4 py-2.5 h-11 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-primary transition-colors;
}

.label-xs {
    @apply block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5;
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>

<template>
    <div class="space-y-6">
        <!-- Athlete Roster List -->
        <div class="space-y-4">
            <!-- Empty State: 2 Action Cards -->
            <div v-if="delegationAthletes.length === 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Card 1: Bulk CSV Import -->
                <div
                    @click="$emit('openBulkImport')"
                    class="p-5 sm:p-6 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:border-navy hover:bg-slate-50/70 transition-all cursor-pointer flex flex-col justify-between space-y-4 group shadow-2xs">
                    <div class="space-y-3">
                        <div class="w-11 h-11 rounded-2xl bg-primary/15 border border-primary/30 group-hover:bg-primary group-hover:border-primary flex items-center justify-center text-navy group-hover:text-navy transition-all duration-300 shrink-0">
                            <Icon icon="ph:file-csv-bold" class="text-xl" />
                        </div>
                        <div>
                            <div class="text-base font-bold text-navy leading-snug">
                                {{ isEn ? 'Bulk Import via CSV' : 'Import Massal via CSV' }}
                            </div>
                            <div class="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                                {{ isEn ? 'Download tailored CSV template and import dozens of archers at once.' : 'Unduh template CSV resmi turnamen ini dan unggah puluhan atlet sekaligus.' }}
                            </div>
                        </div>
                    </div>
                    <div class="pt-1">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-navy text-xs sm:text-sm font-bold group-hover:bg-navy group-hover:text-primary transition-colors">
                            <Icon icon="ph:upload-simple" class="text-sm" />
                            <span>{{ isEn ? 'Upload CSV' : 'Unggah File CSV' }}</span>
                        </span>
                    </div>
                </div>

                <!-- Card 2: Manual Add -->
                <div
                    @click="$emit('openAddAthlete')"
                    class="p-5 sm:p-6 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:border-navy hover:bg-slate-50/70 transition-all cursor-pointer flex flex-col justify-between space-y-4 group shadow-2xs">
                    <div class="space-y-3">
                        <div class="w-11 h-11 rounded-2xl bg-primary/15 border border-primary/30 group-hover:bg-primary group-hover:border-primary flex items-center justify-center text-navy group-hover:text-navy transition-all duration-300 shrink-0">
                            <Icon icon="ph:user-plus-bold" class="text-xl" />
                        </div>
                        <div>
                            <div class="text-base font-bold text-navy leading-snug">
                                {{ isEn ? 'Add Archer Manually' : 'Tambah Atlet Manual' }}
                            </div>
                            <div class="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                                {{ isEn ? 'Search registered database or create new archer accounts one-by-one.' : 'Cari di database atau daftarkan akun atlet baru satu per satu lewat form.' }}
                            </div>
                        </div>
                    </div>
                    <div class="pt-1">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-navy text-xs sm:text-sm font-bold group-hover:bg-navy group-hover:text-primary transition-colors">
                            <Icon icon="ph:plus-bold" class="text-sm" />
                            <span>{{ isEn ? 'Add Single' : 'Tambah Manual' }}</span>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Filled State: Searchable & Paginated Table -->
            <div v-else class="space-y-3.5">
                <!-- Table Toolbar -->
                <div class="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                    <!-- Top Row: Title & Main Actions -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div class="flex items-center gap-2.5">
                            <div class="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-navy shrink-0">
                                <Icon icon="ph:users-three-bold" class="text-lg text-navy" />
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-sm sm:text-base font-black text-navy">{{ isEn ? 'Delegation Roster' : 'Daftar Kontingen' }}</span>
                                <span class="text-xs sm:text-sm font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                    {{ delegationAthletes.length }} {{ isEn ? (delegationAthletes.length === 1 ? 'Archer' : 'Archers') : 'Atlet' }}
                                </span>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 self-start sm:self-auto">
                            <button
                                type="button"
                                @click="$emit('openBulkImport')"
                                class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-navy hover:border-slate-400 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors">
                                <Icon icon="ph:file-csv-bold" class="text-sm text-primary-hover" />
                                <span>{{ isEn ? 'Import CSV' : 'Impor CSV' }}</span>
                            </button>

                            <button
                                type="button"
                                @click="$emit('openAddAthlete')"
                                class="px-3.5 py-1.5 rounded-xl bg-navy text-primary text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-navy/90 transition-colors">
                                <Icon icon="ph:plus-bold" class="text-xs font-black" />
                                <span>{{ isEn ? 'Add Archer' : 'Tambah Atlet' }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Bottom Row: Search & Filters -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div class="relative flex-1 max-w-sm">
                            <input
                                v-model="searchQuery"
                                type="text"
                                :placeholder="isEn ? 'Search name, email, club...' : 'Cari nama, email, klub...'"
                                class="w-full h-8 sm:h-9 pl-8 pr-7 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-navy placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-navy focus:bg-white transition-all" />
                            <Icon icon="ph:magnifying-glass" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-sm" />
                            <button
                                v-if="searchQuery"
                                type="button"
                                @click="searchQuery = ''"
                                class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy cursor-pointer">
                                <Icon icon="ph:x-circle-fill" class="text-xs sm:text-sm" />
                            </button>
                        </div>

                        <div class="flex items-center gap-2 flex-wrap">
                            <!-- Gender Filter -->
                            <div class="flex items-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden text-xs sm:text-sm font-bold h-8 sm:h-9 divide-x divide-slate-200">
                                <button type="button" @click="genderFilter = 'all'"
                                    class="px-2.5 sm:px-3 h-full transition-colors cursor-pointer"
                                    :class="genderFilter === 'all' ? 'bg-navy text-primary' : 'text-slate-600 hover:bg-slate-100'">
                                    {{ isEn ? 'All' : 'Semua' }}
                                </button>
                                <button type="button" @click="genderFilter = 'male'"
                                    class="px-2.5 sm:px-3 h-full transition-colors cursor-pointer"
                                    :class="genderFilter === 'male' ? 'bg-navy text-primary' : 'text-slate-600 hover:bg-slate-100'">
                                    Male
                                </button>
                                <button type="button" @click="genderFilter = 'female'"
                                    class="px-2.5 sm:px-3 h-full transition-colors cursor-pointer"
                                    :class="genderFilter === 'female' ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-100'">
                                    Female
                                </button>
                            </div>

                            <!-- Club Filter -->
                            <div v-if="uniqueClubs.length > 1" class="relative">
                                <button
                                    type="button"
                                    @click.stop="showClubDropdown = !showClubDropdown"
                                    class="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                                    :class="clubFilter !== 'all' ? 'border-navy bg-navy text-primary' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'">
                                    <Icon icon="ph:buildings-bold" class="text-sm" />
                                    <span>{{ clubFilter !== 'all' ? clubFilter : (isEn ? 'All Clubs' : 'Semua Klub') }}</span>
                                    <Icon icon="ph:caret-down-bold" class="text-xs" :class="{ 'rotate-180': showClubDropdown }" />
                                </button>
                                <div v-if="showClubDropdown" class="absolute right-0 top-full mt-1.5 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 w-52 overflow-hidden">
                                    <div class="p-1.5 space-y-0.5">
                                        <button type="button"
                                            @click.stop="clubFilter = 'all'; showClubDropdown = false"
                                            class="w-full text-left px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                                            :class="clubFilter === 'all' ? 'bg-navy text-primary' : 'text-slate-700 hover:bg-slate-100'">
                                            {{ isEn ? 'All Clubs' : 'Semua Klub' }}
                                        </button>
                                        <button type="button"
                                            v-for="club in uniqueClubs"
                                            :key="club"
                                            @click.stop="clubFilter = club; showClubDropdown = false"
                                            class="w-full text-left px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer truncate"
                                            :class="clubFilter === club ? 'bg-navy text-primary' : 'text-slate-700 hover:bg-slate-100'">
                                            {{ club }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bulk Action Floating Bar -->
                <div v-if="selectedAthleteEmails.length > 0" class="p-3 bg-navy/5 border border-navy/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
                    <div class="flex items-center gap-2 text-xs sm:text-sm font-bold text-navy">
                        <span class="size-6 rounded-lg bg-navy text-primary flex items-center justify-center text-xs sm:text-sm font-black">{{ selectedAthleteEmails.length }}</span>
                        <span>{{ isEn ? `${selectedAthleteEmails.length} archers selected` : `${selectedAthleteEmails.length} atlet dipilih` }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button
                            type="button"
                            @click="$emit('openBulkCategoryModal')"
                            class="px-3 py-1.5 rounded-xl bg-navy text-primary text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-2xs hover:bg-navy/90 transition-colors cursor-pointer">
                            <Icon icon="ph:tag-bold" class="text-xs sm:text-sm" />
                            <span>{{ isEn ? 'Assign Category' : 'Tetapkan Kategori' }}</span>
                        </button>
                        <button
                            type="button"
                            @click="$emit('removeSelectedAthletes')"
                            class="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer">
                            <Icon icon="ph:trash-bold" class="text-xs sm:text-sm" />
                            <span>{{ isEn ? 'Remove Selected' : 'Hapus Terpilih' }}</span>
                        </button>
                    </div>
                </div>

                <!-- Table View -->
                <div class="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse text-xs sm:text-sm table-fixed min-w-[720px]">
                            <thead class="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                                <tr>
                                    <th class="py-3 px-3 w-10 text-center">
                                        <input
                                            type="checkbox"
                                            :checked="isAllSelected"
                                            @change="$emit('toggleSelectAll')"
                                            class="size-4 rounded border-slate-300 text-navy focus:ring-navy cursor-pointer" />
                                    </th>
                                    <th class="py-3 px-2 w-10 text-center text-slate-400">#</th>
                                    <th class="py-3 px-4 w-[42%]">{{ isEn ? 'Archer Data' : 'Data Atlet' }}</th>
                                    <th class="py-3 px-3.5 w-[36%]">{{ isEn ? 'Category' : 'Kategori Lomba' }}</th>
                                    <th class="py-3 px-4 w-28 text-right">{{ isEn ? 'Fee' : 'Biaya' }}</th>
                                    <th class="py-3 px-3 w-24 text-center text-slate-400">{{ isEn ? 'Action' : 'Aksi' }}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-if="paginatedAthletes.length === 0">
                                    <td colspan="6" class="py-12 px-4 text-center">
                                        <div class="max-w-xs mx-auto space-y-3">
                                            <div class="size-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto shadow-2xs">
                                                <Icon :icon="searchQuery ? 'ph:magnifying-glass-bold' : 'ph:user-minus-bold'" class="text-xl text-slate-500" />
                                            </div>
                                            <div>
                                                <div class="text-sm font-bold text-navy">
                                                    {{ searchQuery ? (isEn ? 'No archers found' : 'Atlet tidak ditemukan') : (isEn ? 'No archers match your filter' : 'Tidak ada atlet yang cocok dengan filter') }}
                                                </div>
                                                <div class="text-xs text-slate-400 mt-1">
                                                    {{ searchQuery 
                                                        ? (isEn ? `No archer matches "${searchQuery}". Try a different keyword.` : `Tidak ada atlet dengan kata kunci "${searchQuery}". Coba kata kunci lain.`) 
                                                        : (isEn ? 'Try resetting gender or club filters to see all archers.' : 'Coba reset filter gender atau klub untuk melihat semua atlet.') }}
                                                </div>
                                            </div>
                                            <button
                                                v-if="searchQuery || genderFilter !== 'all' || clubFilter !== 'all'"
                                                type="button"
                                                @click="searchQuery = ''; genderFilter = 'all'; clubFilter = 'all'"
                                                class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1.5">
                                                <Icon icon="ph:arrow-counter-clockwise-bold" class="text-xs" />
                                                <span>{{ isEn ? 'Reset Filters' : 'Reset Filter' }}</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-for="(ath, idx) in paginatedAthletes" :key="idx" class="hover:bg-slate-50/60 transition-colors" :class="{ 'bg-navy/5': selectedAthleteEmails.includes(ath.email) }">
                                    <!-- Checkbox -->
                                    <td class="py-3 px-3 text-center">
                                        <input
                                            type="checkbox"
                                            :checked="selectedAthleteEmails.includes(ath.email)"
                                            @change="$emit('toggleSelectAthlete', ath.email)"
                                            class="size-4 rounded border-slate-300 text-navy focus:ring-navy cursor-pointer" />
                                    </td>

                                    <!-- Index -->
                                    <td class="py-3 px-2 text-center font-bold text-slate-400 text-xs sm:text-sm">
                                        {{ (currentPage - 1) * pageSize + idx + 1 }}
                                    </td>

                                    <!-- Archer Data -->
                                    <td class="py-3 px-4">
                                        <div class="flex items-center gap-3 min-w-0">
                                            <img
                                                :src="getImage(ath.avatar_url, ath.full_name)"
                                                :alt="ath.full_name"
                                                class="size-9 rounded-full object-cover border border-slate-200 shrink-0" />
                                            <div class="min-w-0 flex-1">
                                                <div class="font-bold text-navy text-xs sm:text-sm truncate leading-snug">{{ ath.full_name }}</div>
                                                <div class="text-xs text-slate-500 font-medium truncate mt-0.5 flex items-center gap-1.5">
                                                    <Icon icon="ph:shield-bold" class="text-xs text-slate-400 shrink-0" />
                                                    <span class="truncate">{{ ath.club_name || delegationClubName || (isEn ? 'Independent' : 'Independen') }}</span>
                                                    <span class="text-slate-300">•</span>
                                                    <span>{{ ath.gender === 'female' ? (isEn ? 'Female' : 'Putri') : (isEn ? 'Male' : 'Putra') }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- Category Selector Button -->
                                    <td class="py-3 px-3.5">
                                        <div class="relative">
                                            <button
                                                type="button"
                                                @click.stop="$emit('openCategoryDropdown', ath, $event)"
                                                class="h-9 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-between gap-2 cursor-pointer border w-full max-w-[260px] shadow-2xs group"
                                                :class="getArcherCategoryIds(ath).length === 0 
                                                    ? 'border-dashed border-amber-300 bg-amber-50/70 hover:bg-amber-100/70 text-amber-900' 
                                                    : getArcherCategoryIds(ath).length === 1 
                                                        ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-navy' 
                                                        : 'border-navy/20 bg-navy/5 hover:bg-navy/10 text-navy'">
                                                
                                                <!-- 0 Selected State -->
                                                <div v-if="getArcherCategoryIds(ath).length === 0" class="flex items-center gap-1.5 truncate">
                                                    <Icon icon="ph:plus-circle-bold" class="text-sm text-amber-600 shrink-0" />
                                                    <span class="truncate">{{ isEn ? 'Select Category' : 'Pilih Kategori' }}</span>
                                                </div>

                                                <!-- 1 Selected State -->
                                                <div v-else-if="getArcherCategoryIds(ath).length === 1" class="flex items-center gap-1.5 truncate min-w-0">
                                                    <span class="size-2 rounded-full bg-emerald-500 shrink-0"></span>
                                                    <span class="truncate font-bold">{{ getCategoryFullName(categories.find(c => c.id === getArcherCategoryIds(ath)[0])) }}</span>
                                                </div>

                                                <!-- Multiple Selected State -->
                                                <div v-else class="flex items-center gap-1.5 truncate min-w-0">
                                                    <span class="px-1.5 py-0.5 rounded-md bg-navy text-primary text-xs font-black shrink-0">
                                                        {{ getArcherCategoryIds(ath).length }}
                                                    </span>
                                                    <span class="truncate font-bold">
                                                        {{ getCategoryFullName(categories.find(c => c.id === getArcherCategoryIds(ath)[0])) }}
                                                    </span>
                                                    <span class="text-slate-400 font-normal shrink-0">
                                                        +{{ getArcherCategoryIds(ath).length - 1 }}
                                                    </span>
                                                </div>

                                                <Icon icon="ph:caret-down-bold" class="text-xs sm:text-sm text-slate-400 group-hover:text-navy shrink-0 transition-transform" />
                                            </button>
                                        </div>
                                    </td>

                                    <!-- Fee -->
                                    <td class="py-3 px-3.5 text-right font-black whitespace-nowrap text-xs sm:text-sm">
                                        <span v-if="getArcherCategoryIds(ath).length === 0" class="text-slate-400 font-bold">
                                            -
                                        </span>
                                        <span v-else-if="getArcherTotalFee(ath) === 0" class="text-emerald-600 font-bold">
                                            {{ isEn ? 'Free' : 'Gratis' }}
                                        </span>
                                        <span v-else class="text-navy">
                                            {{ formatPriceValue(getArcherTotalFee(ath)) }}
                                        </span>
                                    </td>

                                    <!-- Action -->
                                    <td class="py-3 px-3 text-center whitespace-nowrap">
                                        <div class="flex items-center justify-center gap-1">
                                            <button
                                                type="button"
                                                @click.stop="$emit('viewAthleteDetail', ath)"
                                                class="size-7 rounded-lg hover:bg-navy/10 text-slate-400 hover:text-navy inline-flex items-center justify-center transition-colors cursor-pointer"
                                                :title="isEn ? 'View details' : 'Lihat detail atlet'">
                                                <Icon icon="ph:eye-bold" class="text-sm" />
                                            </button>
                                            <button
                                                type="button"
                                                @click.stop="$emit('editDelegationAthlete', ath)"
                                                class="size-7 rounded-lg hover:bg-navy/10 text-slate-400 hover:text-navy inline-flex items-center justify-center transition-colors cursor-pointer"
                                                :title="isEn ? 'Edit athlete data' : 'Edit data atlet'">
                                                <Icon icon="ph:pencil-simple-bold" class="text-sm" />
                                            </button>
                                            <button
                                                type="button"
                                                @click.stop="$emit('promptRemoveAthlete', ath)"
                                                class="size-7 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 inline-flex items-center justify-center transition-colors cursor-pointer"
                                                :title="isEn ? 'Remove athlete' : 'Hapus atlet'">
                                                <Icon icon="ph:trash-bold" class="text-sm" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination Bar -->
                    <div v-if="filteredAthletes.length > 0" class="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
                        <div class="text-slate-500 font-medium">
                            {{ isEn 
                                ? `Showing ${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, filteredAthletes.length)} of ${filteredAthletes.length} archers`
                                : `Menampilkan ${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, filteredAthletes.length)} dari ${filteredAthletes.length} atlet` }}
                        </div>

                        <div v-if="totalPages > 1" class="flex items-center gap-1.5">
                            <button
                                type="button"
                                :disabled="currentPage <= 1"
                                @click="currentPage--"
                                class="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer">
                                <Icon icon="ph:caret-left-bold" class="text-xs sm:text-sm" />
                            </button>

                            <button
                                v-for="page in totalPages"
                                :key="page"
                                @click="currentPage = page"
                                class="size-7 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                                :class="currentPage === page ? 'bg-navy text-white font-black' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'">
                                {{ page }}
                            </button>

                            <button
                                type="button"
                                :disabled="currentPage >= totalPages"
                                @click="currentPage++"
                                class="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer">
                                <Icon icon="ph:caret-right-bold" class="text-xs sm:text-sm" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Team Quotas Booking -->
        <div class="space-y-3.5 pt-4 border-t border-slate-100">
            <div>
                <h3 class="text-base sm:text-lg font-black text-navy">
                    {{ isEn ? 'Reserve Team Quota Slots' : 'Reservasi Kuota Tim' }}
                </h3>
                <div class="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {{ isEn ? 'Lock team quota slots now; name exact archers at Technical Meeting.' : 'Kunci kuota tim sekarang; susunan atlet dapat ditentukan saat Technical Meeting.' }}
                </div>
            </div>

            <div v-if="teamCategories.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div
                    v-for="cat in teamCategories"
                    :key="cat.id"
                    class="p-4 rounded-2xl border border-slate-200 bg-white transition-all flex flex-col justify-between gap-3 shadow-2xs">
                    
                    <!-- Top Info Row -->
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex items-center gap-3 min-w-0">
                            <div class="size-11 rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-primary/30 bg-primary/15 shadow-2xs">
                                <img :src="'/' + (getCategoryIcon(cat.name || cat.division_name) || 'category-icon/men-team.svg')" :alt="cat.name" class="w-full h-full object-contain" @error="(e) => { e.target.onerror = null; e.target.src = '/category-icon/men-team.svg' }" />
                            </div>
                            <div class="min-w-0">
                                <div class="text-sm sm:text-base font-black text-navy truncate">
                                    {{ getCategoryFullName(cat) }}
                                </div>
                                <div class="text-xs sm:text-sm font-bold mt-0.5" :class="!getFeeForCategory(cat.id) ? 'text-emerald-600' : 'text-slate-500'">
                                    <template v-if="!getFeeForCategory(cat.id) || Number(getFeeForCategory(cat.id)) === 0">
                                        {{ isEn ? 'Free' : 'Gratis' }}
                                    </template>
                                    <template v-else>
                                        {{ formatPriceValue(getFeeForCategory(cat.id)) }} / {{ isEn ? 'slot team' : 'slot tim' }}
                                    </template>
                                </div>
                            </div>
                        </div>

                        <!-- Controls -->
                        <div class="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl shrink-0">
                            <button
                                type="button"
                                :disabled="!(delegationTeamBookings[cat.id] > 0)"
                                @click="$emit('decrementTeamBooking', cat.id)"
                                class="size-8 rounded-lg bg-white flex items-center justify-center text-navy font-bold text-sm cursor-pointer shadow-2xs hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed">
                                <Icon icon="ph:minus-bold" />
                            </button>
                            <span class="w-7 text-center text-sm font-black text-navy">
                                {{ delegationTeamBookings[cat.id] || 0 }}
                            </span>
                            <button
                                type="button"
                                :disabled="(delegationTeamBookings[cat.id] || 0) >= getTeamEligibility(cat).maxTeams"
                                @click="$emit('incrementTeamBooking', cat.id)"
                                class="size-8 rounded-lg bg-white flex items-center justify-center text-navy font-bold text-sm cursor-pointer shadow-2xs hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                                :title="(delegationTeamBookings[cat.id] || 0) >= getTeamEligibility(cat).maxTeams ? getTeamEligibility(cat).neededMessage : (isEn ? 'Add Team Slot' : 'Tambah Slot Tim')">
                                <Icon icon="ph:plus-bold" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="p-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 text-center space-y-1.5">
                <div class="size-10 rounded-2xl bg-primary/15 border border-primary/30 text-navy flex items-center justify-center mx-auto mb-2 shadow-2xs">
                    <Icon icon="ph:users-three-bold" class="text-xl text-navy" />
                </div>
                <div class="text-xs sm:text-sm font-bold text-slate-700">
                    {{ isEn ? 'No Team Categories Available' : 'Tidak Ada Kategori Beregu' }}
                </div>
                <div class="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                    {{ isEn ? 'This tournament only offers individual categories. You can proceed with individual roster above.' : 'Turnamen ini hanya menyediakan kategori perorangan/individu. Anda dapat langsung melanjutkan pendaftaran atlet individu di atas.' }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import { ref, computed } from 'vue'

const props = defineProps({
    delegationAthletes: {
        type: Array,
        default: () => []
    },
    categories: {
        type: Array,
        default: () => []
    },
    teamCategories: {
        type: Array,
        default: () => []
    },
    delegationTeamBookings: {
        type: Object,
        default: () => ({})
    },
    delegationClubName: {
        type: String,
        default: ''
    },
    selectedAthleteEmails: {
        type: Array,
        default: () => []
    },
    isEn: {
        type: Boolean,
        default: false
    },
    getCategoryIcon: {
        type: Function,
        default: () => 'category-icon/men-team.svg'
    },
    getCategoryFullName: {
        type: Function,
        default: (c) => [c?.division_name, c?.category_name, c?.gender_division_name, c?.event_type_name].filter(Boolean).join(' ')
    },
    getArcherCategoryIds: {
        type: Function,
        default: () => []
    },
    getArcherTotalFee: {
        type: Function,
        default: () => 0
    },
    getFeeForCategory: {
        type: Function,
        default: () => 0
    },
    getTeamEligibility: {
        type: Function,
        default: () => ({ maxTeams: 0, neededMessage: '' })
    },
    formatPrice: {
        type: Function,
        default: null
    },
    useImageOrDefault: {
        type: Function,
        default: null
    }
})

defineEmits([
    'openBulkImport',
    'openAddAthlete',
    'viewAthleteDetail',
    'editDelegationAthlete',
    'promptRemoveAthlete',
    'removeSelectedAthletes',
    'openBulkCategoryModal',
    'openCategoryDropdown',
    'toggleSelectAthlete',
    'toggleSelectAll',
    'incrementTeamBooking',
    'decrementTeamBooking'
])

const searchQuery = ref('')
const genderFilter = ref('all')
const clubFilter = ref('all')
const showClubDropdown = ref(false)
const currentPage = ref(1)
const pageSize = 10

const uniqueClubs = computed(() => {
    const clubs = new Set()
    props.delegationAthletes.forEach(a => {
        if (a.club_name) clubs.add(a.club_name)
    })
    return Array.from(clubs)
})

const filteredAthletes = computed(() => {
    return props.delegationAthletes.filter(ath => {
        if (genderFilter.value !== 'all') {
            const g = (ath.gender || '').toLowerCase()
            if (genderFilter.value === 'female' && g !== 'female') return false
            if (genderFilter.value === 'male' && g !== 'male') return false
        }
        if (clubFilter.value !== 'all') {
            if ((ath.club_name || props.delegationClubName) !== clubFilter.value) return false
        }
        if (searchQuery.value.trim()) {
            const q = searchQuery.value.toLowerCase().trim()
            const matchName = (ath.full_name || '').toLowerCase().includes(q)
            const matchEmail = (ath.email || '').toLowerCase().includes(q)
            const matchClub = (ath.club_name || '').toLowerCase().includes(q)
            if (!matchName && !matchEmail && !matchClub) return false
        }
        return true
    })
})

const totalPages = computed(() => {
    return Math.ceil(filteredAthletes.value.length / pageSize) || 1
})

const paginatedAthletes = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredAthletes.value.slice(start, start + pageSize)
})

const isAllSelected = computed(() => {
    if (filteredAthletes.value.length === 0) return false
    return filteredAthletes.value.every(a => props.selectedAthleteEmails.includes(a.email))
})

const getImage = (url, name) => {
    if (props.useImageOrDefault) {
        return props.useImageOrDefault(url, name)
    }
    return url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Archer')}&background=0A192F&color=E2F163`
}

const formatPriceValue = (val) => {
    if (props.formatPrice) return props.formatPrice(val)
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0)
}
</script>

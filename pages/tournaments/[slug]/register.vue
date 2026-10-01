<template>
    <div class="min-h-screen bg-slate-100/70 font-body text-navy flex flex-col">
        
        <!-- TOP COMPACT NAVBAR WITH PROFILE -->
        <header class="bg-navy text-white sticky top-0 z-40 border-b border-navy/80 shadow-xs">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                <!-- Left: Logo & Portal Tag -->
                <div class="flex items-center gap-3">
                    <NuxtLink to="/" class="flex items-center gap-2">
                        <img src="/logo.png" alt="Archeris" class="h-6 w-6 object-contain" />
                        <span class="text-base font-black tracking-tight font-display text-white">Archeris</span>
                    </NuxtLink>
                    <span class="text-white/30 text-sm">/</span>
                    <span class="text-xs sm:text-sm font-bold text-primary tracking-wide">
                        {{ isEn ? 'Tournament Registration' : 'Pendaftaran Turnamen' }}
                    </span>
                </div>

                <!-- Right: Back to Event & Profile Dropdown -->
                <div class="flex items-center gap-2.5 sm:gap-3">
                    <NuxtLink
                        :to="`/tournaments/${slug}`"
                        class="text-xs sm:text-sm font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-white/10">
                        <Icon icon="ph:arrow-left-bold" class="text-xs sm:text-sm" />
                        <span class="hidden sm:inline">{{ isEn ? 'Back to Tournament' : 'Kembali ke Event' }}</span>
                        <span class="sm:hidden">{{ isEn ? 'Back' : 'Kembali' }}</span>
                    </NuxtLink>

                    <!-- User Profile Dropdown -->
                    <div v-if="archerProfile || user" class="relative" ref="userDropdownRef">
                        <button
                            type="button"
                            @click="showUserDropdown = !showUserDropdown"
                            class="flex items-center gap-2 pl-2 border-l border-white/15 hover:opacity-90 transition-opacity cursor-pointer text-left">
                            <img
                                :src="useImageOrDefault(archerProfile?.avatar_url || user?.avatar, archerProfile?.full_name || user?.full_name)"
                                class="size-8 rounded-full object-cover border border-white/20" />
                            <span class="text-xs sm:text-sm font-bold text-white hidden md:inline max-w-[130px] truncate">
                                {{ archerProfile?.full_name || user?.full_name || 'My Account' }}
                            </span>
                            <Icon icon="ph:caret-down-bold" class="text-xs text-slate-400 transition-transform duration-200" :class="showUserDropdown ? 'rotate-180 text-white' : ''" />
                        </button>

                        <Transition
                            enter-active-class="transition duration-150 ease-out"
                            enter-from-class="opacity-0 scale-95 -translate-y-1"
                            enter-to-class="opacity-100 scale-100 translate-y-0"
                            leave-active-class="transition duration-100 ease-in"
                            leave-from-class="opacity-100 scale-100 translate-y-0"
                            leave-to-class="opacity-0 scale-95 -translate-y-1">
                            <div
                                v-if="showUserDropdown"
                                class="absolute right-0 top-full mt-2.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-navy font-medium text-sm">
                                <div class="px-4 py-3 border-b border-slate-100">
                                    <div class="font-black text-navy text-sm truncate">{{ archerProfile?.full_name || user?.full_name }}</div>
                                    <div class="text-xs text-slate-400 truncate mt-0.5">{{ user?.email || archerProfile?.email }}</div>
                                    <div v-if="archerProfile?.club_name" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-xs font-bold text-slate-600 mt-1.5">
                                        <Icon icon="ph:shield-bold" class="text-xs text-primary-hover" />
                                        <span>{{ archerProfile.club_name }}</span>
                                    </div>
                                </div>
                                <div class="py-1.5">
                                    <NuxtLink to="/dashboard/archer" @click="showUserDropdown = false" class="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors font-bold text-slate-700 hover:text-navy">
                                        <Icon icon="ph:layout-bold" class="text-base text-slate-400" />
                                        <span>{{ isEn ? 'My Dashboard' : 'Dashboard Saya' }}</span>
                                    </NuxtLink>
                                    <NuxtLink to="/dashboard/archer/profile" @click="showUserDropdown = false" class="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors font-bold text-slate-700 hover:text-navy">
                                        <Icon icon="ph:user-gear-bold" class="text-base text-slate-400" />
                                        <span>{{ isEn ? 'Archer Profile' : 'Profil Atlet' }}</span>
                                    </NuxtLink>
                                </div>
                                <div class="border-t border-slate-100 pt-1.5">
                                    <button
                                        type="button"
                                        @click="handleUserLogout"
                                        class="flex items-center gap-2.5 px-4 py-2 text-red-500 hover:bg-red-50 transition-colors w-full text-left font-bold cursor-pointer">
                                        <Icon icon="ph:sign-out-bold" class="text-base" />
                                        <span>{{ isEn ? 'Log Out' : 'Keluar (Logout)' }}</span>
                                    </button>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </header>

        <!-- Loading State -->
        <div v-if="pending" class="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
            <div class="size-12 rounded-2xl bg-primary/15 border border-primary/30 text-navy shadow-2xs flex items-center justify-center mb-3">
                <Icon icon="ph:spinner-gap-bold" class="text-2xl animate-spin text-navy" />
            </div>
            <h2 class="text-base font-black text-navy mb-0.5">{{ isEn ? 'Loading Registration' : 'Memuat Form Pendaftaran' }}</h2>
            <div class="text-sm text-slate-400">{{ isEn ? 'Preparing tournament categories...' : 'Menyiapkan kategori dan data turnamen...' }}</div>
        </div>

        <!-- Error State -->
        <div v-else-if="fetchError" class="flex-1 flex items-center justify-center p-6">
            <div class="text-center max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div class="size-14 bg-red-500/15 border border-red-500/30 text-red-600 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-2xs">
                    <Icon icon="ph:warning-circle-bold" class="text-2xl" />
                </div>
                <h2 class="text-lg font-black text-navy mb-1.5">{{ isEn ? 'Failed to Load Tournament' : 'Gagal Memuat Data Turnamen' }}</h2>
                <span class="text-slate-500 text-sm mb-5 block leading-relaxed">{{ fetchError.message || (isEn ? 'Error loading tournament data.' : 'Terjadi kesalahan saat memuat detail turnamen.') }}</span>
                <BaseButton @click="refresh()" variant="navy" size="md">{{ isEn ? 'Try Again' : 'Coba Lagi' }}</BaseButton>
            </div>
        </div>

        <!-- Redirecting to Payment State -->
        <div v-else-if="registrationSuccess" class="fixed inset-0 bg-navy flex items-center justify-center z-50 overflow-hidden">
            <div class="relative z-10 flex flex-col items-center gap-4 text-center px-4">
                <div class="size-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                    <Icon icon="ph:check-bold" class="text-3xl text-navy" />
                </div>
                <h1 class="text-xl font-black text-white">{{ isEn ? 'Registration Successful' : 'Pendaftaran Berhasil' }}</h1>
                <div class="text-white/70 text-sm font-medium">{{ isEn ? 'Redirecting to checkout payment page...' : 'Mengarahkan ke halaman pembayaran...' }}</div>
                <Icon icon="ph:spinner-gap-bold" class="text-xl text-primary animate-spin mt-1" />
            </div>
        </div>

        <!-- Already Registered State -->
        <div v-else-if="isAlreadyRegistered && !allowRegisterAnotherDelegation" class="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-6 text-center">
                <div class="size-16 sm:size-20 rounded-2xl bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-2xs">
                    <Icon icon="ph:seal-check-bold" class="text-3xl sm:text-4xl" />
                </div>

                <div class="space-y-2">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-black">
                        <Icon icon="ph:check-circle-fill" class="text-emerald-600 text-sm" />
                        <span>{{ isEn ? 'Already Registered' : 'Sudah Terdaftar' }}</span>
                    </span>
                    <h2 class="text-xl sm:text-2xl font-black text-navy">
                        {{ isEn ? 'You are already registered for this tournament' : 'Anda telah terdaftar pada turnamen ini' }}
                    </h2>
                    <div class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                        {{ isEn 
                            ? 'Your registration data has been recorded. You can view your ticket, target assignment, and payment status anytime.' 
                            : 'Data pendaftaran Anda telah tercatat. Anda dapat memeriksa tiket, jadwal bantalan target, dan status pembayaran kapan saja.' 
                        }}
                    </div>
                </div>

                <!-- Registration Summary Box -->
                <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-3.5 max-w-lg mx-auto">
                    <div class="flex items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                        <div class="text-xs font-medium text-slate-400">{{ isEn ? 'Registered Archer' : 'Nama Atlet' }}</div>
                        <div class="text-xs sm:text-sm font-black text-navy">{{ myRegistration?.full_name || archerProfile?.full_name || user?.full_name }}</div>
                    </div>

                    <div v-if="myRegistration?.categories && myRegistration.categories.length > 0" class="flex items-start justify-between gap-3 border-b border-slate-200/60 pb-3">
                        <div class="text-xs font-medium text-slate-400 mt-0.5">{{ isEn ? 'Category' : 'Kategori' }}</div>
                        <div class="text-right space-y-1">
                            <div v-for="cat in myRegistration.categories" :key="cat.id || cat.category_id" class="text-xs sm:text-sm font-bold text-navy">
                                {{ [cat.division_name, cat.category_name, cat.gender_division_name, cat.event_type_name].filter(Boolean).join(' ') }}
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between gap-3">
                        <div class="text-xs font-medium text-slate-400">{{ isEn ? 'Payment Status' : 'Status Pembayaran' }}</div>
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize"
                            :class="myRegistration?.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
                            <Icon :icon="myRegistration?.payment_status === 'paid' ? 'ph:check-circle-fill' : 'ph:clock-bold'" />
                            <span>{{ myRegistration?.payment_status || 'Pending' }}</span>
                        </span>
                    </div>
                </div>

                <!-- Action CTA Buttons -->
                <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <NuxtLink
                        :to="`/dashboard/archer/tournaments/${slug}/my-registration`"
                        class="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-navy text-primary hover:bg-navy/90 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                        <Icon icon="ph:ticket-bold" class="text-lg" />
                        <span>{{ isEn ? 'View My Ticket & Registration' : 'Lihat Tiket & Pendaftaran Saya' }}</span>
                    </NuxtLink>

                    <NuxtLink
                        :to="`/tournaments/${slug}`"
                        class="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2">
                        <Icon icon="ph:arrow-left-bold" class="text-base" />
                        <span>{{ isEn ? 'Back to Tournament' : 'Kembali ke Info Event' }}</span>
                    </NuxtLink>
                </div>

                <!-- Club delegation alternative -->
                <div class="pt-4 border-t border-slate-100 text-xs text-slate-500">
                    <span>{{ isEn ? 'Need to register other archers as a Club Representative?' : 'Ingin mendaftarkan atlet lain sebagai perwakilan klub?' }}</span>
                    <button
                        type="button"
                        @click="allowRegisterAnotherDelegation = true; registrationMode = 'club_delegation'"
                        class="text-navy font-bold hover:text-primary-hover ml-1 cursor-pointer">
                        {{ isEn ? 'Register Club Delegation' : 'Daftarkan Delegasi Klub' }}
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="flex-1">
            <!-- 1. COMPACT TOURNAMENT HERO HEADER STRIP WITH LANGUAGE TOGGLE & STEPPER -->
            <RegisterHeader
                :event="event"
                :current-step="currentStep"
                :is-en="isEn"
                @go-to-step="goToStep"
                @set-locale-lang="setLocaleLang" />

            <!-- 2. MAIN FORM BODY CONTAINER -->
            <main class="max-w-5xl mx-auto px-0 sm:px-6 py-0 sm:py-6 pb-12 w-full">
                <div class="bg-white rounded-none sm:rounded-3xl border-0 sm:border border-slate-200/90 sm:shadow-sm overflow-hidden divide-y divide-slate-100">
                    
                    <!-- STEP 1: IDENTITY & MODE SELECTION -->
                    <Step1RegistrationType
                        v-if="currentStep === 1"
                        v-model:registration-mode="registrationMode"
                        :profile-form="profileForm"
                        :custom-fields="customFields"
                        v-model:custom-field-answers="customFieldAnswers"
                        :selected-individual-category-ids="selectedIndividualCategoryIds"
                        :is-step1-valid="isStep1Valid"
                        :is-en="isEn"
                        @go-to-step="goToStep" />

                    <!-- STEP 2: CATEGORIES & SQUAD ROSTER BUILDER -->
                    <div v-else-if="currentStep === 2" class="p-4 sm:p-8 space-y-6 sm:space-y-8">
                        <div>
                            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/15 border border-primary/30 text-navy text-xs font-black mb-2 shadow-2xs">
                                <Icon icon="ph:target-bold" class="text-xs" />
                                <span>{{ isEn ? 'Step 2 of 3' : 'Langkah 2 dari 3' }}</span>
                            </div>
                            <h2 class="text-xl sm:text-2xl font-black text-navy tracking-tight">
                                {{ registrationMode === 'captain_team'
                                    ? (isEn ? 'Select Competition Categories' : 'Pilih Kategori Pertandingan')
                                    : (isEn ? 'Athletes Roster & Delegation Quotas' : 'Daftar Atlet & Kuota Delegasi') }}
                            </h2>
                            <div class="text-sm text-slate-500 mt-1">
                                {{ registrationMode === 'captain_team'
                                    ? (isEn ? 'Choose the individual and team categories you wish to enter.' : 'Pilih kategori individu dan kategori beregu yang ingin Anda ikuti.')
                                    : (isEn ? 'Add archers representing your club and reserve official team quota slots.' : 'Tambahkan atlet perwakilan klub Anda dan tentukan kuota beregu untuk turnamen ini.') }}
                            </div>
                        </div>

                        <!-- MODE 1: INDIVIDUAL / CAPTAIN -->
                        <Step2Individual
                            v-if="registrationMode === 'captain_team'"
                            :categories="categories"
                            :individual-categories="individualCategories"
                            :team-categories="teamCategories"
                            :selected-individual-category-ids="selectedIndividualCategoryIds"
                            :selected-team-categories="selectedTeamCategories"
                            :locked-individual-category-ids="lockedIndividualCategoryIds"
                            :profile-form="profileForm"
                            :archer-profile="archerProfile"
                            :user="user"
                            :team-rosters="teamRosters"
                            :single-entry-fee="singleEntryFee"
                            :event-currency="eventCurrency"
                            :is-en="isEn"
                            :get-category-icon="getCategoryIcon"
                            :get-category-type="getCategoryType"
                            :get-fee-for-category="getFeeForCategory"
                            :format-price="formatPrice"
                            :use-image-or-default="useImageOrDefault"
                            @toggle-individual-category="toggleIndividualCategory"
                            @toggle-team-category="toggleTeamCategory"
                            @open-partner-modal="openPartnerModal"
                            @handle-edit-partner="handleEditPartner"
                            @remove-partner="removePartner"
                            @switch-gender="profileForm.gender = (profileForm.gender === 'female' ? 'male' : 'female')" />

                        <!-- MODE 2: CLUB DELEGATION -->
                        <Step2Delegation
                            v-else
                            :delegation-athletes="delegationAthletes"
                            :categories="categories"
                            :team-categories="teamCategories"
                            :delegation-team-bookings="delegationTeamBookings"
                            :delegation-club-name="delegationClubName"
                            :selected-athlete-emails="selectedAthleteEmails"
                            :is-en="isEn"
                            :get-category-icon="getCategoryIcon"
                            :get-category-full-name="getCategoryFullName"
                            :get-archer-category-ids="getArcherCategoryIds"
                            :get-archer-total-fee="getArcherTotalFee"
                            :get-fee-for-category="getFeeForCategory"
                            :get-team-eligibility="getTeamEligibility"
                            :format-price="formatPrice"
                            :use-image-or-default="useImageOrDefault"
                            @open-bulk-import="showBulkImportModal = true"
                            @open-add-athlete="showAddAthleteModal = true"
                            @view-athlete-detail="viewAthleteDetail"
                            @edit-delegation-athlete="editDelegationAthlete"
                            @prompt-remove-athlete="promptRemoveAthlete"
                            @remove-selected-athletes="removeSelectedAthletes"
                            @open-bulk-category-modal="showBulkCategoryModal = true"
                            @open-category-dropdown="openCategoryDropdown"
                            @toggle-select-athlete="toggleSelectAthlete"
                            @toggle-select-all="toggleSelectAll"
                            @increment-team-booking="incrementTeamBooking"
                            @decrement-team-booking="decrementTeamBooking" />

                        <!-- Step 2 Footer Actions -->
                        <div class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <button
                                type="button"
                                @click="currentStep = 1"
                                class="px-5 py-2.5 rounded-xl border border-slate-200 text-navy font-bold text-sm sm:text-base hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto">
                                <Icon icon="ph:arrow-left-bold" />
                                <span>{{ isEn ? 'Back to Type' : 'Kembali ke Tipe' }}</span>
                            </button>

                            <div class="flex items-center gap-4 self-end sm:self-auto">
                                <div class="text-right hidden sm:block">
                                    <div class="text-xs sm:text-sm text-slate-400 font-bold">{{ isEn ? 'Estimated Total' : 'Estimasi Biaya' }}</div>
                                    <div class="text-base sm:text-lg font-black tabular-nums" :class="!hasAnyRegistrationSelection ? 'text-slate-400' : (totalCalculatedFee === 0 ? 'text-emerald-600' : 'text-navy')">
                                        {{ hasAnyRegistrationSelection ? formatPrice(totalCalculatedFee) : '-' }}
                                    </div>
                                </div>

                                <BaseButton
                                    @click="goToStep(3)"
                                    :disabled="!isStep2Valid"
                                    variant="navy"
                                    size="md"
                                    icon-right="ph:arrow-right-bold"
                                    class="text-sm sm:text-base">
                                    {{ isEn ? 'Continue to Payment' : 'Lanjut ke Pembayaran' }}
                                </BaseButton>
                            </div>
                        </div>
                    </div>

                    <!-- STEP 3: REVIEW & PAYMENT CHECKOUT -->
                    <Step3Payment
                        v-else-if="currentStep === 3"
                        :computed-breakdown-items="computedBreakdownItems"
                        :event-currency="eventCurrency"
                        :total-calculated-fee="totalCalculatedFee"
                        v-model:payment-type="paymentType"
                        v-model:manual-method-id="manualMethodId"
                        :org-manual-methods="orgManualMethods"
                        v-model:sender-name="senderName"
                        :proof-file-url="proofFileUrl"
                        :proof-file-name="proofFileName"
                        :proof-file-size="proofFileSize"
                        :uploading-proof="uploadingProof"
                        :copied-bank-id="copiedBankId"
                        :loading="loading"
                        :submit-error="submitError"
                        :checkout-button-text="checkoutButtonText"
                        :is-en="isEn"
                        :get-payment-method-image="getPaymentMethodImage"
                        :format-price="formatPrice"
                        @go-to-step="goToStep"
                        @copy-account-number="copyAccountNumber"
                        @handle-proof-upload="handleProofUpload"
                        @remove-proof-file="removeProofFile"
                        @submit="handleSubmit" />
                </div>
            </main>
        </div>

        <!-- Add/Edit Athlete Modal for Representative Mode -->
        <AddAthleteModal
            :show="showAddAthleteModal"
            :tournament-id="event?.id || slug"
            :individual-categories="individualCategories"
            :custom-fields="customFields"
            :default-club-id="delegationClubId"
            :default-club-name="delegationClubName"
            :existing-emails="delegationAthletes.map(a => a.email?.toLowerCase()).filter(Boolean)"
            :existing-archer-ids="delegationAthletes.map(a => a.archer_id).filter(Boolean)"
            :edit-athlete="editingAthlete"
            @close="handleCloseAthleteModal"
            @save-athlete="handleSaveAthlete"
            @add-athlete="handleSaveAthlete" />

        <!-- Bulk Import CSV/Excel Modal for Representative Mode -->
        <BulkImportModal
            :show="showBulkImportModal"
            :tournament-id="event?.id || slug"
            :tournament-name="event?.name || slug"
            :categories="categories"
            :existing-emails="delegationAthletes.map(a => a.email?.toLowerCase()).filter(Boolean)"
            :custom-fields="customFields"
            @close="showBulkImportModal = false"
            @imported="handleBulkImported" />

        <!-- Athlete Detail Preview Modal -->
        <AthleteDetailModal
            :athlete="viewingAthleteDetail"
            :custom-fields="customFields"
            :categories="categories"
            :delegation-club-name="delegationClubName"
            :is-en="isEn"
            :get-archer-total-fee="getArcherTotalFee"
            :get-archer-category-ids="getArcherCategoryIds"
            :get-category-full-name="getCategoryFullName"
            :format-price="formatPrice"
            :use-image-or-default="useImageOrDefault"
            @close="closeAthleteDetail"
            @edit="ath => { closeAthleteDetail(); editDelegationAthlete(ath); }" />

        <!-- Athlete Delete Confirmation Modal -->
        <AthleteDeleteConfirmModal
            :athlete="athleteToDelete"
            :delegation-club-name="delegationClubName"
            :is-en="isEn"
            :use-image-or-default="useImageOrDefault"
            @cancel="cancelRemoveAthlete"
            @confirm="confirmRemoveAthlete" />

        <!-- Bulk Category Assignment Modal -->
        <BulkCategoryModal
            :show="showBulkCategoryModal"
            :selected-athletes="selectedAthletesForBulk"
            :categories="categories"
            :is-en="isEn"
            :get-category-type="getCategoryType"
            :get-category-full-name="getCategoryFullName"
            :get-fee-for-category="getFeeForCategory"
            :format-price="formatPrice"
            @close="showBulkCategoryModal = false"
            @apply="applyBulkCategory" />


        <!-- Partner Selector Modal Teleported -->
        <PartnerSelectorModal
            :show="showPartnerModal"
            :title="partnerModalCategory ? `${isEn ? (partnerModalEditPartner ? 'Edit Teammate' : 'Add Teammate') : (partnerModalEditPartner ? 'Edit Anggota' : 'Tambah Anggota')}: ${partnerModalCategory.name}` : (isEn ? 'Select Teammate' : 'Pilih Rekan Tim')"
            :category-name="partnerModalCategory?.name || ''"
            :tournament-id="event?.id || slug"
            :category-id="partnerModalCategory?.id || ''"
            :required-gender="partnerModalGender"
            :existing-partners="partnerModalCategory ? (teamRosters[partnerModalCategory.id]?.partners || []) : []"
            :default-single-fee="partnerModalDefaultFee"
            :custom-fields="customFields"
            :edit-partner="partnerModalEditPartner"
            @close="handleClosePartnerModal"
            @select-partner="handlePartnerSelected" />

        <!-- Category Multi-Select Popover (Teleported to body to escape overflow clipping) -->
        <Teleport to="body">
            <div
                v-if="activeCategoryDropdownAth"
                class="fixed inset-0 z-[60]"
                @click="activeCategoryDropdownAth = null" />
            <div
                v-if="activeCategoryDropdownAth"
                @click.stop
                class="fixed z-[70] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-72"
                :style="`top: ${categoryDropdownPos.top}px; left: ${categoryDropdownPos.left}px; width: ${categoryDropdownPos.width}px;`">

                <!-- Popover Header -->
                <div class="px-3.5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="text-xs sm:text-sm font-black text-navy">{{ isEn ? 'Competition Categories' : 'Kategori Lomba' }}</span>
                        <span v-if="activeCategoryDropdownAth && getArcherCategoryIds(activeCategoryDropdownAth).length > 0" class="px-1.5 py-0.5 rounded-md bg-navy text-primary text-xs font-black">
                            {{ getArcherCategoryIds(activeCategoryDropdownAth).length }}
                        </span>
                    </div>
                    <button type="button" @click.stop="activeCategoryDropdownAth = null" class="size-6 rounded-md hover:bg-slate-200 text-slate-400 hover:text-navy flex items-center justify-center transition-colors cursor-pointer">
                        <Icon icon="ph:x-bold" class="text-xs sm:text-sm" />
                    </button>
                </div>

                <!-- Category List -->
                <div class="p-2 space-y-1 overflow-y-auto flex-1">
                    <div
                        v-for="cat in activeCategoryDropdownAth ? availableCategoriesForGender(activeCategoryDropdownAth.gender) : []"
                        :key="cat.id"
                        @click.stop="toggleArcherCategory(activeCategoryDropdownAth, cat.id)"
                        class="flex items-center justify-between p-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer transition-colors"
                        :class="isArcherCategorySelected(activeCategoryDropdownAth, cat.id) ? 'bg-navy/5 text-navy font-bold' : 'hover:bg-slate-50 text-slate-700'">
                        <div class="flex items-center gap-2.5 min-w-0 pr-2">
                            <div class="size-4.5 rounded border flex items-center justify-center shrink-0 transition-colors"
                                :class="isArcherCategorySelected(activeCategoryDropdownAth, cat.id) ? 'bg-navy border-navy text-primary' : 'border-slate-300 bg-white'">
                                <Icon v-if="isArcherCategorySelected(activeCategoryDropdownAth, cat.id)" icon="ph:check-bold" class="text-xs" />
                            </div>
                            <span class="truncate">{{ getCategoryFullName(cat) }}</span>
                        </div>
                        <span class="text-xs sm:text-sm font-bold text-slate-500 whitespace-nowrap">
                            {{ formatPrice(getFeeForCategory(cat.id)) }}
                        </span>
                    </div>
                </div>

                <!-- Popover Footer -->
                <div class="px-3.5 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                    <div class="text-slate-500">
                        <span>Total: </span>
                        <span class="font-black text-navy">{{ activeCategoryDropdownAth ? formatPrice(getArcherTotalFee(activeCategoryDropdownAth)) : '' }}</span>
                    </div>
                    <button type="button" @click.stop="activeCategoryDropdownAth = null"
                        class="px-3 py-1 rounded-lg bg-navy text-primary font-bold text-xs sm:text-sm hover:bg-navy/90 transition-colors cursor-pointer shadow-2xs">
                        {{ isEn ? 'Done' : 'Selesai' }}
                    </button>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { onClickOutside } from '@vueuse/core'
import { useApi } from '~/composables/useApi'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { getCategoryIcon } from '~/utils/logoArcheryCategory'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import ClubSelector from '~/components/common/ClubSelector.vue'
import RegisterHeader from '~/components/tournament/register/RegisterHeader.vue'
import Step1RegistrationType from '~/components/tournament/register/Step1RegistrationType.vue'
import Step2Individual from '~/components/tournament/register/Step2Individual.vue'
import Step2Delegation from '~/components/tournament/register/Step2Delegation.vue'
import Step3Payment from '~/components/tournament/register/Step3Payment.vue'
import AthleteDetailModal from '~/components/tournament/register/AthleteDetailModal.vue'
import AthleteDeleteConfirmModal from '~/components/tournament/register/AthleteDeleteConfirmModal.vue'
import BulkCategoryModal from '~/components/tournament/register/BulkCategoryModal.vue'
import TeamSlotBuilder from '~/components/tournament/register/TeamSlotBuilder.vue'
import PartnerSelectorModal from '~/components/tournament/register/PartnerSelectorModal.vue'
import AddAthleteModal from '~/components/tournament/register/AddAthleteModal.vue'
import BulkImportModal from '~/components/tournament/register/BulkImportModal.vue'
import ItemizedFeeBreakdown from '~/components/tournament/register/ItemizedFeeBreakdown.vue'
import DynamicCustomFieldsRenderer from '~/components/tournaments/DynamicCustomFieldsRenderer.vue'
import { Icon } from '@iconify/vue'
import { useDateFormat } from '@vueuse/core'
import { formatMoney, getPaymentGatewayForCurrency, getCurrencySymbol } from '~/composables/useCurrency'

const { locale, setLocale } = useI18n()
const isEn = computed(() => locale.value !== 'id')

const setLocaleLang = (lang) => {
    if (typeof setLocale === 'function') {
        setLocale(lang)
    } else {
        locale.value = lang
    }
}

const toast = useToast()
const route = useRoute()
const slug = route.params.slug
const apiBaseUrl = useApiBaseUrl()

const { user, archerProfile: globalArcherProfile, logout } = useAuth()
const { upload, put, post, get } = useApi()
const myClientRegistration = ref(null)

// User Dropdown State
const showUserDropdown = ref(false)
const userDropdownRef = ref(null)
onClickOutside(userDropdownRef, () => {
    showUserDropdown.value = false
})

const handleUserLogout = async () => {
    showUserDropdown.value = false
    await logout()
    navigateTo('/auth/login')
}

// ─── DATA FETCHING ────────────────────────────────────────────────────────────
const { data, pending, error: fetchError, refresh } = await useAsyncData(`event-register-${slug}-${user.value?.id || 'guest'}`, async () => {
    const token = useCookie('auth_token').value
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
    const fetchOptions = { headers, credentials: 'include' }

    try {
        const eventResponse = await $fetch(`${apiBaseUrl}/events/${slug}`)
        if (!eventResponse) return null

        const eventId = eventResponse.uuid || eventResponse.id

        const [categoriesResponse, profileResponse, channelsRes, myRegistrationRes, paymentMethodsRes, customFieldsRes] = await Promise.all([
            $fetch(`${apiBaseUrl}/tournaments/${slug}/categories?limit=100`).catch(() => 
                $fetch(`${apiBaseUrl}/events/${slug}/categories`).catch(() => ({ data: [] }))
            ),
            token ? $fetch(`${apiBaseUrl}/archer/me`, fetchOptions).catch(() => null) : Promise.resolve(null),
            $fetch(`${apiBaseUrl}/payment/channels`).catch(() => ({ data: [] })),
            token ? $fetch(`${apiBaseUrl}/tournaments/${slug}/participants/me`, fetchOptions).catch(() => 
                $fetch(`${apiBaseUrl}/events/${slug}/my-registration`, fetchOptions).catch(() => null)
            ) : Promise.resolve(null),
            $fetch(`${apiBaseUrl}/events/${slug}/payment-methods`).catch(() => ({ data: [] })),
            $fetch(`${apiBaseUrl}/tournaments/${slug}/custom-fields/public`).catch(() => ({ fields: [] }))
        ])

        if (myRegistrationRes && ((Array.isArray(myRegistrationRes.categories) && myRegistrationRes.categories.length > 0) || myRegistrationRes.archer_id)) {
            const invalidStatuses = ['cancelled', 'canceled', 'expired', 'failed', 'rejected', 'deleted']
            const pStatus = (myRegistrationRes.status || '').toLowerCase()
            const payStatus = (myRegistrationRes.payment_status || '').toLowerCase()
            const isCancelled = invalidStatuses.includes(pStatus) || invalidStatuses.includes(payStatus)
            if (!isCancelled && route.query.mode !== 'delegation') {
                return navigateTo(`/tournaments/${slug}`)
            }
        }

        const rawCats = categoriesResponse?.data || categoriesResponse?.tournaments || categoriesResponse?.events || categoriesResponse?.competition_categories || []
        const mappedCategories = rawCats.map(cat => {
            const division = cat.division_name || cat.division || ''
            const category = cat.category_name_custom || cat.category_name || cat.category || cat.age_category || ''
            const gender = cat.gender_division_name || cat.gender_division || cat.gender || ''
            const eventType = cat.event_type_name || cat.event_type || ''
            
            const nameParts = [division, category, gender, eventType].filter(Boolean)
            const fallbackName = nameParts.length > 0 ? nameParts.join(' ') : 'Category'
            const catName = cat.name || fallbackName

            return {
                ...cat,
                id: cat.id || cat.uuid,
                name: catName,
                division_name: division,
                category_name: category,
                gender_division_name: gender,
                event_type_name: eventType
            }
        })

        const pageSettings = eventResponse.page_settings || {}

        const formatDate = (d) => {
            if (!d) return ''
            const formatted = useDateFormat(d, 'D MMM YYYY').value
            return formatted ? formatted.replace(/"/g, '') : ''
        }

        const eventData = {
            id: eventId,
            name: eventResponse.name || eventResponse.title || 'Event',
            date: (() => {
                if (!eventResponse.start_date) return eventResponse.date || ''
                const start = formatDate(eventResponse.start_date)
                const end = eventResponse.end_date ? formatDate(eventResponse.end_date) : null
                return (!end || start === end) ? start : `${start} - ${end}`
            })(),
            location: eventResponse.location || eventResponse.venue || '',
            image: eventResponse.image || eventResponse.banner_url || '',
            description: eventResponse.description || '',
            registration_fee: eventResponse.entry_fee || eventResponse.registration_fee || 0,
            currency: eventResponse.currency || 'IDR',
            fee_mode: pageSettings.fee_mode || 'per_type',
            fee_per_type: pageSettings.fee_per_type || {
                individual: eventResponse.entry_fee || 0,
                team: 0,
                mixed_team: 0
            },
            fee_per_category: pageSettings.fee_per_category || {},
            registration_deadline: eventResponse.registration_deadline || null,
            registration_start: pageSettings.registration_start || null
        }

        let archerProfileData = profileResponse?.data || profileResponse
        if (archerProfileData?.club_id && !archerProfileData.club_name) {
            try {
                const clubRes = await $fetch(`${apiBaseUrl}/clubs/${archerProfileData.club_id}`)
                archerProfileData.club_name = clubRes?.name || clubRes?.data?.name
            } catch (e) {}
        }

        return {
            event: eventData,
            categories: mappedCategories,
            paymentChannels: channelsRes?.data || [],
            myRegistration: myRegistrationRes?.data || null,
            orgManualMethods: paymentMethodsRes?.data || [],
            archerProfile: archerProfileData,
            customFields: customFieldsRes?.fields || []
        }
    } catch (err) {
        console.error('Failed to fetch event registration:', err)
        throw createError({ statusCode: 500, message: 'Gagal memuat data pendaftaran' })
    }
})

// ─── WIZARD & WORKFLOW STATE ──────────────────────────────────────────────────
const currentStep = ref(1)
const registrationMode = ref('captain_team') // 'captain_team' | 'club_delegation'
const loading = ref(false)
const submitError = ref('')
const registrationSuccess = ref(false)

// Mode 1 State: Multi-Select Individual Categories & Team Categories
const selectedIndividualCategoryIds = ref([])
const selectedTeamCategories = ref([])
const teamRosters = ref({}) // { [catId]: { teamName: '', partners: [] } }

// Partner Modal State
const showPartnerModal = ref(false)
const partnerModalCategory = ref(null)
const partnerModalSlotIndex = ref(0)
const partnerModalGender = ref('')
const partnerModalEditPartner = ref(null)

const partnerModalDefaultFee = computed(() => {
    if (!partnerModalCategory.value) return singleEntryFee.value
    const partnerGender = (partnerModalGender.value || '').toLowerCase()
    const matchingIndCat = categories.value.find(c => {
        if (getCategoryType(c) !== 'individual') return false
        const sameDiv = !partnerModalCategory.value.division_id || !c.division_id || partnerModalCategory.value.division_id === c.division_id
        const divNameMatch = (partnerModalCategory.value.division_name || '').toLowerCase() === (c.division_name || '').toLowerCase()
        const genderMatch = !partnerGender || isCategoryMatchingGender(c, partnerGender)
        return (sameDiv || divNameMatch) && genderMatch
    })
    return matchingIndCat ? getFeeForCategory(matchingIndCat.id) : singleEntryFee.value
})

// Mode 2 State: Representative
const showAddAthleteModal = ref(false)
const viewingAthleteDetail = ref(null)
const athleteToDelete = ref(null)
const editingAthlete = ref(null)
const showBulkImportModal = ref(false)
const delegationClubId = ref('')
const delegationClubName = ref('')
const delegationOfficialName = ref('')
const delegationOfficialPhone = ref('')
const delegationOfficialEmail = ref('')
const delegationOfficialRole = ref('manager')
const delegationAthletes = ref([]) // [{ archer_id, full_name, gender, category_id, date_of_birth, email, password, phone, club_id, club_name, avatar_url, is_new_account }]
const delegationTeamBookings = ref({}) // { [catId]: count }

// Delegation Athlete Table Search & Pagination State
const athleteSearchQuery = ref('')
const athleteClubFilter = ref('all')
const athleteGenderFilter = ref('all')
const showClubFilterDropdown = ref(false)
const athleteCurrentPage = ref(1)
const athletePageSize = ref(10)

const uniqueClubsInRoster = computed(() => {
    const clubs = delegationAthletes.value.map(a => a.club_name).filter(Boolean)
    return [...new Set(clubs)].sort()
})

const filteredDelegationAthletes = computed(() => {
    let list = delegationAthletes.value
    if (athleteClubFilter.value !== 'all') {
        list = list.filter(a => a.club_name === athleteClubFilter.value)
    }
    if (athleteGenderFilter.value !== 'all') {
        list = list.filter(a => a.gender === athleteGenderFilter.value)
    }
    if (!athleteSearchQuery.value?.trim()) return list
    const q = athleteSearchQuery.value.toLowerCase().trim()
    return list.filter(a => {
        return (
            (a.full_name && a.full_name.toLowerCase().includes(q)) ||
            (a.email && a.email.toLowerCase().includes(q)) ||
            (a.phone && a.phone.toLowerCase().includes(q)) ||
            (a.club_name && a.club_name.toLowerCase().includes(q))
        )
    })
})

const athleteTotalPages = computed(() => {
    return Math.ceil(filteredDelegationAthletes.value.length / athletePageSize.value) || 1
})

const paginatedDelegationAthletes = computed(() => {
    const start = (athleteCurrentPage.value - 1) * athletePageSize.value
    return filteredDelegationAthletes.value.slice(start, start + athletePageSize.value)
})

// ─── BULK SELECTION & ASSIGNMENT ─────────────────────────────────────────────
const selectedAthleteEmails = ref([])
const showBulkCategoryModal = ref(false)

const isAllSelected = computed(() => {
    if (filteredDelegationAthletes.value.length === 0) return false
    return filteredDelegationAthletes.value.every(a => selectedAthleteEmails.value.includes(a.email))
})

const toggleSelectAll = () => {
    if (isAllSelected.value) {
        const filteredEmails = filteredDelegationAthletes.value.map(a => a.email)
        selectedAthleteEmails.value = selectedAthleteEmails.value.filter(e => !filteredEmails.includes(e))
    } else {
        filteredDelegationAthletes.value.forEach(a => {
            if (a.email && !selectedAthleteEmails.value.includes(a.email)) {
                selectedAthleteEmails.value.push(a.email)
            }
        })
    }
}

const toggleSelectAthlete = (email) => {
    if (!email) return
    const idx = selectedAthleteEmails.value.indexOf(email)
    if (idx === -1) {
        selectedAthleteEmails.value.push(email)
    } else {
        selectedAthleteEmails.value.splice(idx, 1)
    }
}

const removeSelectedAthletes = () => {
    if (selectedAthleteEmails.value.length === 0) return
    delegationAthletes.value = delegationAthletes.value.filter(a => !selectedAthleteEmails.value.includes(a.email))
    selectedAthleteEmails.value = []
    if (athleteCurrentPage.value > athleteTotalPages.value) {
        athleteCurrentPage.value = Math.max(1, athleteTotalPages.value)
    }
}

const selectedAthletesForBulk = computed(() => {
    return delegationAthletes.value.filter(a => selectedAthleteEmails.value.includes(a.email))
})

const getBulkCategoryMatchStats = (cat) => {
    const totalSelected = selectedAthletesForBulk.value.length
    if (totalSelected === 0) return { matched: 0, total: 0, allMatched: false, noneMatched: true, partial: false }
    const matched = selectedAthletesForBulk.value.filter(a => isCategoryMatchingGender(cat, a.gender)).length
    return {
        matched,
        total: totalSelected,
        allMatched: matched === totalSelected,
        noneMatched: matched === 0,
        partial: matched > 0 && matched < totalSelected
    }
}

const applyBulkCategory = (catId) => {
    if (!catId) return
    const targetCat = categories.value.find(c => c.id === catId)
    if (!targetCat) return

    let appliedCount = 0
    let skippedCount = 0

    delegationAthletes.value.forEach(ath => {
        if (selectedAthleteEmails.value.includes(ath.email)) {
            if (isCategoryMatchingGender(targetCat, ath.gender)) {
                if (!Array.isArray(ath.category_ids)) {
                    ath.category_ids = []
                }
                if (!ath.category_ids.includes(catId)) {
                    ath.category_ids.push(catId)
                }
                ath.category_id = ath.category_ids[0] || ''
                appliedCount++
            } else {
                skippedCount++
            }
        }
    })

    if (appliedCount > 0) {
        if (skippedCount > 0) {
            toast.warning(
                isEn.value
                    ? `Category assigned to ${appliedCount} archer(s). ${skippedCount} skipped due to gender mismatch.`
                    : `Kategori berhasil ditetapkan ke ${appliedCount} atlet. ${skippedCount} dilewati karena gender tidak cocok.`
            )
        } else {
            toast.success(
                isEn.value
                    ? `Category successfully assigned to ${appliedCount} archer(s).`
                    : `Kategori berhasil ditetapkan ke ${appliedCount} atlet.`
            )
        }
    } else if (skippedCount > 0) {
        toast.error(
            isEn.value
                ? `Cannot assign category: Gender does not match selected archer(s).`
                : `Tidak dapat menetapkan kategori: Gender tidak cocok dengan atlet yang dipilih.`
        )
        return
    }

    showBulkCategoryModal.value = false
    selectedAthleteEmails.value = []
}

// ─── DELEGATION ATHLETE CATEGORY SELECTION HELPERS ────────────────────────────
const activeCategoryDropdownAth = ref(null)

watch([showAddAthleteModal, showBulkImportModal, showBulkCategoryModal, showPartnerModal, viewingAthleteDetail, athleteToDelete, currentStep], () => {
    activeCategoryDropdownAth.value = null
})
const categoryDropdownPos = ref({ top: 0, left: 0, width: 320 })

// Keep backward compat alias for template
const activeCategoryDropdownIndex = computed(() => null) // unused — kept for safety

const getArcherCategoryIds = (ath) => {
    if (Array.isArray(ath?.category_ids) && ath.category_ids.length > 0) {
        return ath.category_ids
    }
    if (ath?.category_id) {
        return [ath.category_id]
    }
    return []
}

const isArcherCategorySelected = (ath, catId) => {
    return getArcherCategoryIds(ath).includes(catId)
}

const toggleArcherCategory = (ath, catId) => {
    if (!ath) return
    const current = Array.isArray(ath.category_ids) ? [...ath.category_ids] : (ath.category_id ? [ath.category_id] : [])
    const idx = current.indexOf(catId)
    if (idx === -1) {
        current.push(catId)
    } else {
        current.splice(idx, 1)
    }
    ath.category_ids = current
    ath.category_id = current[0] || ''
    delegationAthletes.value = [...delegationAthletes.value]
}

const removeArcherCategory = (ath, catId) => {
    if (!ath) return
    const current = Array.isArray(ath.category_ids) ? [...ath.category_ids] : (ath.category_id ? [ath.category_id] : [])
    const idx = current.indexOf(catId)
    if (idx !== -1) {
        current.splice(idx, 1)
    }
    ath.category_ids = current
    ath.category_id = current[0] || ''
    delegationAthletes.value = [...delegationAthletes.value]
}

const getArcherTotalFee = (ath) => {
    const ids = getArcherCategoryIds(ath)
    if (ids.length === 0) return 0
    return ids.reduce((sum, cId) => sum + getFeeForCategory(cId), 0)
}

const openCategoryDropdown = (ath, evt) => {
    if (activeCategoryDropdownAth.value === ath) {
        activeCategoryDropdownAth.value = null
        return
    }
    activeCategoryDropdownAth.value = ath
    nextTick(() => {
        const btn = evt.currentTarget
        const rect = btn.getBoundingClientRect()
        const popoverWidth = 336
        const viewportWidth = window.innerWidth
        let left = rect.left
        if (left + popoverWidth > viewportWidth - 8) {
            left = viewportWidth - popoverWidth - 8
        }
        const top = rect.bottom + 6
        categoryDropdownPos.value = { top, left, width: popoverWidth }
    })
}

if (typeof window !== 'undefined') {
    window.addEventListener('click', (e) => {
        activeCategoryDropdownAth.value = null
        showClubFilterDropdown.value = false
    })
    window.addEventListener('scroll', () => {
        activeCategoryDropdownAth.value = null
    }, { passive: true })
}


// Payment State
const paymentType = ref('online')
const manualMethodId = ref('')
const senderName = ref('')
const proofFileUrl = ref('')
const proofFileName = ref('')
const proofFileSize = ref('')
const uploadingProof = ref(false)
const proofInput = ref(null)

const removeProofFile = () => {
    proofFileUrl.value = ''
    proofFileName.value = ''
    proofFileSize.value = ''
    if (proofInput.value) {
        proofInput.value.value = ''
    }
}

const profileForm = ref({
    full_name: '',
    gender: '',
    date_of_birth: '',
    phone: '',
    country: 'Indonesia',
    club_name: '',
    club_id: null
})

// ─── COMPUTED ─────────────────────────────────────────────────────────────────
const allowRegisterAnotherDelegation = ref(false)
const myRegistration = computed(() => myClientRegistration.value || data.value?.myRegistration || null)
const isAlreadyRegistered = computed(() => {
    if (!myRegistration.value) return false
    const hasCategories = Array.isArray(myRegistration.value.categories) && myRegistration.value.categories.length > 0
    const hasArcherId = !!myRegistration.value.archer_id
    const invalidStatuses = ['cancelled', 'canceled', 'expired', 'failed', 'rejected', 'deleted']
    const pStatus = (myRegistration.value.status || '').toLowerCase()
    const payStatus = (myRegistration.value.payment_status || '').toLowerCase()
    const isCancelled = invalidStatuses.includes(pStatus) || invalidStatuses.includes(payStatus)
    return (hasCategories || hasArcherId) && !isCancelled
})

watch(isAlreadyRegistered, (already) => {
    if (already && !allowRegisterAnotherDelegation.value && route.query.mode !== 'delegation') {
        toast.info(isEn.value ? 'You are already registered for this tournament.' : 'Anda sudah terdaftar pada turnamen ini.')
        navigateTo(`/tournaments/${slug}`)
    }
}, { immediate: true })

onMounted(async () => {
    try {
        const checkRes = await get(`/tournaments/${slug}/participants/me`)
        if (checkRes && ((Array.isArray(checkRes.categories) && checkRes.categories.length > 0) || checkRes.archer_id)) {
            const invalidStatuses = ['cancelled', 'canceled', 'expired', 'failed', 'rejected', 'deleted']
            const pStatus = (checkRes.status || '').toLowerCase()
            const payStatus = (checkRes.payment_status || '').toLowerCase()
            const isCancelled = invalidStatuses.includes(pStatus) || invalidStatuses.includes(payStatus)
            if (!isCancelled) {
                myClientRegistration.value = checkRes
                if (!allowRegisterAnotherDelegation.value && route.query.mode !== 'delegation') {
                    toast.info(isEn.value ? 'You are already registered for this tournament.' : 'Anda sudah terdaftar pada turnamen ini.')
                    navigateTo(`/tournaments/${slug}`)
                }
            }
        }
    } catch (e) {
        // Not registered
    }
})

const event = computed(() => data.value?.event || { name: '', date: '', location: '', registration_fee: 0, fee_mode: 'per_type', fee_per_type: {}, currency: 'IDR' })
const eventCurrency = computed(() => event.value?.currency || 'IDR')
const onlineGateway = computed(() => getPaymentGatewayForCurrency(eventCurrency.value))
const categories = computed(() => data.value?.categories || [])
const orgManualMethods = computed(() => data.value?.orgManualMethods || [])
const customFields = computed(() => data.value?.customFields || [])
const customFieldAnswers = ref({})

const areRequiredCustomFieldsFilled = (answers, fields) => {
    if (!fields || fields.length === 0) return true
    for (const f of fields) {
        const isDataField = !f.element_type || f.element_type === 'field'
        if (f.is_active && f.is_required && isDataField) {
            const val = answers?.[f.field_key]
            if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
                return false
            }
        }
    }
    return true
}
const paymentMethodOptions = [
    { title: 'BCA (Bank Central Asia)', value: 'BCA', image: '/payment-method/bca.png', type: 'bank' },
    { title: 'Mandiri', value: 'Mandiri', image: '/payment-method/mandiri.png', type: 'bank' },
    { title: 'BNI (Bank Negara Indonesia)', value: 'BNI', image: '/payment-method/bni.png', type: 'bank' },
    { title: 'BRI (Bank Rakyat Indonesia)', value: 'BRI', image: '/payment-method/bri.png', type: 'bank' },
    { title: 'BSI (Bank Syariah Indonesia)', value: 'BSI', image: '/payment-method/bsi.png', type: 'bank' },
    { title: 'Bank Danamon', value: 'Danamon', image: '/payment-method/danamon.png', type: 'bank' },
    { title: 'GoPay', value: 'GoPay', image: '/payment-method/gopay.png', type: 'ewallet' },
    { title: 'OVO', value: 'OVO', image: '/payment-method/ovo.png', type: 'ewallet' },
    { title: 'DANA', value: 'DANA', image: '/payment-method/dana.png', type: 'ewallet' },
]

const getPaymentMethodImage = (bankName) => {
    if (!bankName) return null
    const normalized = String(bankName).toLowerCase().trim()
    const method = paymentMethodOptions.find(m => {
        const val = m.value.toLowerCase()
        const tit = m.title.toLowerCase()
        return normalized.includes(val) || val.includes(normalized) || normalized.includes(tit) || tit.includes(normalized)
    })
    return method ? method.image : null
}

watch([orgManualMethods, paymentType], ([methods]) => {
    if (methods && methods.length > 0) {
        if (!manualMethodId.value || !methods.some(m => (m.uuid || m.id) === manualMethodId.value)) {
            manualMethodId.value = methods[0]?.uuid || methods[0]?.id || ''
        }
    }
}, { immediate: true, deep: true })
const archerProfile = computed(() => globalArcherProfile.value || data.value?.archerProfile)

const singleEntryFee = computed(() => {
    return event.value.fee_per_type?.individual ?? event.value.registration_fee ?? 150000
})

const getCategoryType = (cat) => {
    const name = (cat?.event_type_name || cat?.name || '').toLowerCase()
    if (name.includes('mixed')) return 'mixed_team'
    if (name.includes('team') || name.includes('beregu')) return 'team'
    return 'individual'
}

const isCategoryMatchingGender = (cat, archerGender) => {
    if (!archerGender) return true
    const normalizedGender = String(archerGender).toLowerCase().trim()
    const isArcherMale = normalizedGender === 'male' || normalizedGender === 'm' || normalizedGender === 'l' || normalizedGender === 'pria' || normalizedGender === 'laki-laki' || normalizedGender === 'laki' || normalizedGender === 'putra'
    const isArcherFemale = normalizedGender === 'female' || normalizedGender === 'f' || normalizedGender === 'w' || normalizedGender === 'wanita' || normalizedGender === 'perempuan' || normalizedGender === 'putri'

    const gDiv = String(cat?.gender_division_name || cat?.gender_division_code || cat?.gender || '').toLowerCase().trim()
    const fullName = String(`${cat?.name || ''} ${cat?.category_name || ''} ${cat?.category_name_custom || ''} ${gDiv}`).toLowerCase()

    // Female check (checked first and explicitly)
    const hasFemaleMarker = /\b(women|woman|female|putri|wanita|perempuan)\b/i.test(fullName) || gDiv === 'women' || gDiv === 'female' || gDiv === 'putri'

    // Male check using word boundaries to ensure 'women' NEVER matches 'men'
    const hasMaleMarker = (/\b(men|man|male|putra|pria|laki)\b/i.test(fullName) && !/\b(women|woman)\b/i.test(fullName)) || gDiv === 'men' || gDiv === 'male' || gDiv === 'putra'

    // Mixed check
    const hasMixedMarker = /\b(mixed|campuran|open|umum)\b/i.test(fullName) || gDiv === 'mixed'

    if (hasMixedMarker && !hasFemaleMarker && !hasMaleMarker) {
        return true
    }

    if (isArcherMale) {
        if (hasFemaleMarker && !hasMaleMarker) return false
        return true
    }
    if (isArcherFemale) {
        if (hasMaleMarker && !hasFemaleMarker) return false
        return true
    }
    return true
}

const individualCategories = computed(() => {
    const allInd = categories.value.filter(c => getCategoryType(c) === 'individual')
    if (registrationMode.value === 'captain_team' && profileForm.value.gender) {
        return allInd.filter(c => isCategoryMatchingGender(c, profileForm.value.gender))
    }
    return allInd
})

const teamCategories = computed(() => {
    const allTeams = categories.value.filter(c => getCategoryType(c) !== 'individual')
    if (registrationMode.value === 'captain_team' && profileForm.value.gender) {
        return allTeams.filter(c => {
            if (getCategoryType(c) === 'mixed_team') return true
            return isCategoryMatchingGender(c, profileForm.value.gender)
        })
    }
    return allTeams
})

const availableCategoriesForGender = (gender) => {
    const list = categories.value.filter(c => getCategoryType(c) === 'individual')
    if (!gender) return list
    return list.filter(c => isCategoryMatchingGender(c, gender))
}

const getCategoryNameById = (catId) => {
    const cat = categories.value.find(c => c.id === catId)
    return cat ? `${cat.name} (${cat.division_name || 'Open'})` : 'Category'
}

const getFeeForCategory = (catId) => {
    const ev = event.value
    if (ev.fee_mode === 'per_category') {
        return ev.fee_per_category?.[catId] ?? ev.registration_fee ?? 0
    }
    const cat = categories.value.find(c => c.id === catId)
    const type = cat ? getCategoryType(cat) : 'individual'
    return ev.fee_per_type?.[type] ?? ev.registration_fee ?? 0
}

// ─── INDIVIDUAL CATEGORY MULTI-SELECTION & TEAM LOCKING ──────────────────────
const getMatchingIndividualCategoryForTeam = (teamCat) => {
    if (!teamCat) return null
    return individualCategories.value.find(c => {
        if (teamCat.division_id && c.division_id && teamCat.division_id === c.division_id) return true
        if (teamCat.division_name && c.division_name && teamCat.division_name.toLowerCase().trim() === c.division_name.toLowerCase().trim()) return true
        const teamDiv = (teamCat.division_name || teamCat.name || '').toLowerCase()
        const indDiv = (c.division_name || c.name || '').toLowerCase()
        if (teamDiv.includes('compound') && indDiv.includes('compound')) return true
        if (teamDiv.includes('recurve') && indDiv.includes('recurve')) return true
        if (teamDiv.includes('barebow') && indDiv.includes('barebow')) return true
        if (teamDiv.includes('standard') && indDiv.includes('standard')) return true
        if (teamDiv.includes('tradisional') && indDiv.includes('tradisional')) return true
        if (teamDiv.includes('traditional') && indDiv.includes('traditional')) return true
        return false
    }) || individualCategories.value[0] || null
}

const lockedIndividualCategoryIds = computed(() => {
    const locked = new Set()
    for (const teamCat of selectedTeamCategories.value) {
        const indCat = getMatchingIndividualCategoryForTeam(teamCat)
        if (indCat) {
            locked.add(indCat.id)
        }
    }
    return Array.from(locked)
})

watch(lockedIndividualCategoryIds, (lockedIds) => {
    for (const id of lockedIds) {
        if (!selectedIndividualCategoryIds.value.includes(id)) {
            selectedIndividualCategoryIds.value.push(id)
        }
    }
}, { immediate: true, deep: true })

const toggleIndividualCategory = (cat) => {
    if (lockedIndividualCategoryIds.value.includes(cat.id)) {
        toast.info(isEn.value 
            ? 'This individual category is required because you selected a team event.' 
            : 'Kategori individu ini wajib diikuti karena Anda memilih kategori beregu/tim.')
        return
    }
    const idx = selectedIndividualCategoryIds.value.indexOf(cat.id)
    if (idx === -1) {
        selectedIndividualCategoryIds.value.push(cat.id)
    } else {
        selectedIndividualCategoryIds.value.splice(idx, 1)
    }
}

const isIndividualCategorySelected = (catId) => {
    return selectedIndividualCategoryIds.value.includes(catId)
}

const getCategoryFullName = (cat) => {
    if (!cat) return isEn.value ? 'Competition Category' : 'Kategori Pertandingan'
    let text = ''
    if (cat.name && typeof cat.name === 'string' && cat.name.trim()) {
        text = cat.name.trim()
    } else {
        const parts = [
            cat.division_name,
            cat.category_name_custom || cat.category_name,
            cat.gender_division_name,
            cat.event_type_name
        ].filter(s => s && String(s).trim() && s !== '-')
        text = parts.length > 0 ? parts.join(' – ') : (isEn.value ? 'Category' : 'Kategori')
    }
    return text.replace(/\b(\w+)\s+\1\b/gi, '$1').replace(/\s+/g, ' ').trim()
}

// ─── BREAKDOWN COMPUTATION (MODULAR COMPUTED PROPERTIES) ─────────────────────
const captainIndividualBreakdownItems = computed(() => {
    if (registrationMode.value !== 'captain_team') return []
    const registrantName = profileForm.value.full_name || archerProfile.value?.full_name || user.value?.full_name || user.value?.name || (isEn.value ? 'Registrant' : 'Pendaftar')
    const registrantClub = profileForm.value.club_name || archerProfile.value?.club_name || (isEn.value ? 'Independent' : 'Independen')
    const registrantAvatar = archerProfile.value?.avatar_url || ''

    return selectedIndividualCategoryIds.value.map(catId => {
        const cat = categories.value.find(c => c.id === catId)
        const fee = getFeeForCategory(catId)
        const catTitle = getCategoryFullName(cat)
        return {
            id: `ind-${catId}`,
            type: 'captain_individual',
            group: 'individual',
            person_name: registrantName,
            role_label: null,
            role_type: 'captain',
            avatar_url: registrantAvatar,
            club_name: registrantClub,
            category_title: catTitle,
            division_name: cat?.division_name || '',
            gender: profileForm.value.gender || '',
            title: `${registrantName} (${catTitle})`,
            subtitle: registrantClub,
            amount: fee,
            status_badge: null,
            status_type: 'payable',
            note: isEn.value ? 'Individual Category' : 'Kategori Individu'
        }
    })
})

const captainTeamBreakdownItems = computed(() => {
    if (registrationMode.value !== 'captain_team') return []
    const registrantName = profileForm.value.full_name || archerProfile.value?.full_name || user.value?.full_name || user.value?.name || (isEn.value ? 'Registrant' : 'Pendaftar')
    const registrantClub = profileForm.value.club_name || archerProfile.value?.club_name || (isEn.value ? 'Independent' : 'Independen')
    const registrantAvatar = archerProfile.value?.avatar_url || ''

    const items = []
    for (const teamCat of selectedTeamCategories.value) {
        const teamFee = getFeeForCategory(teamCat.id)
        if (teamFee <= 0) continue

        const teamCatTitle = getCategoryFullName(teamCat)
        const customTeamName = teamRosters.value[teamCat.id]?.team_name?.trim()
        const partners = teamRosters.value[teamCat.id]?.partners || []

        const rosterMembers = [
            {
                full_name: registrantName,
                role: isEn.value ? 'Registrant (You)' : 'Pendaftar (Anda)',
                club_name: registrantClub,
                avatar_url: registrantAvatar,
                gender: profileForm.value.gender || 'male'
            },
            ...partners.map((p, pIdx) => ({
                full_name: p.full_name,
                role: isEn.value ? `Archer ${pIdx + 2}` : `Atlet ${pIdx + 2}`,
                club_name: p.club_name || (isEn.value ? 'Independent' : 'Independen'),
                avatar_url: p.avatar_url || '',
                gender: p.gender || 'male'
            }))
        ]

        items.push({
            id: `team-fee-${teamCat.id}`,
            type: 'team_fee',
            group: 'team',
            person_name: customTeamName || teamCatTitle,
            role_label: isEn.value ? 'Team Entry Fee' : 'Biaya Pendaftaran Tim',
            role_type: 'team_slot',
            avatar_url: '',
            club_name: '',
            category_title: teamCatTitle,
            division_name: teamCat?.division_name || '',
            title: customTeamName || teamCatTitle,
            subtitle: customTeamName ? teamCatTitle : '',
            amount: teamFee,
            members: rosterMembers,
            status_badge: null,
            status_type: 'payable',
            note: isEn.value ? 'Official Team Quota' : 'Kuota Tim Resmi'
        })
    }
    return items
})

const captainTeammateBreakdownItems = computed(() => {
    if (registrationMode.value !== 'captain_team') return []
    const registrantClub = profileForm.value.club_name || archerProfile.value?.club_name || (isEn.value ? 'Independent' : 'Independen')

    const items = []
    for (const teamCat of selectedTeamCategories.value) {
        const partners = teamRosters.value[teamCat.id]?.partners || []
        for (const partner of partners) {
            const partnerName = partner.full_name || (isEn.value ? 'Teammate' : 'Rekan Tim')
            const partnerClub = partner.club_name || registrantClub || (isEn.value ? 'Independent' : 'Independen')
            const partnerAvatar = partner.avatar_url || ''
            const partnerGender = (partner.gender || '').toLowerCase()

            const partnerIndCat = categories.value.find(c => {
                if (getCategoryType(c) !== 'individual') return false
                const sameDiv = !teamCat.division_id || !c.division_id || teamCat.division_id === c.division_id
                const divNameMatch = (teamCat.division_name || '').toLowerCase() === (c.division_name || '').toLowerCase()
                const genderMatch = !partnerGender || isCategoryMatchingGender(c, partnerGender)
                return (sameDiv || divNameMatch) && genderMatch
            })

            let indCatTitle = ''
            if (partnerIndCat) {
                indCatTitle = getCategoryFullName(partnerIndCat)
            } else {
                const divName = teamCat.division_name || 'Category'
                const genderLabel = partnerGender === 'female' ? (isEn.value ? 'Women' : 'Putri') : (partnerGender === 'male' ? (isEn.value ? 'Men' : 'Putra') : '')
                indCatTitle = `${divName} ${genderLabel} ${isEn.value ? 'Individual' : 'Individu'}`.replace(/\s+/g, ' ').trim()
            }

            if (partner.is_already_registered_individual) {
                items.push({
                    id: `team-partner-${partner.archer_id || partnerName}-${teamCat.id}`,
                    type: 'teammate_free',
                    group: 'individual',
                    person_name: partnerName,
                    role_label: isEn.value ? 'Teammate' : 'Rekan Tim',
                    role_type: 'member',
                    avatar_url: partnerAvatar,
                    club_name: partnerClub,
                    category_title: indCatTitle,
                    division_name: teamCat?.division_name || '',
                    title: `${partnerName} (${indCatTitle})`,
                    subtitle: `${partnerClub} • ${isEn.value ? 'Already registered individual' : 'Sudah terdaftar individu'}`,
                    amount: 0,
                    status_badge: isEn.value ? 'Individual Paid' : 'Individu Lunas',
                    status_type: 'free',
                    note: isEn.value ? 'Already registered individual (No extra fee)' : 'Sudah terdaftar individu (Bebas biaya tambahan)'
                })
            } else {
                const singleFee = partnerIndCat ? getFeeForCategory(partnerIndCat.id) : (partner.individual_fee || singleEntryFee.value)
                items.push({
                    id: `team-partner-${partner.archer_id || partnerName}-${teamCat.id}`,
                    type: 'teammate_covered',
                    group: 'individual',
                    person_name: partnerName,
                    role_label: isEn.value ? 'Teammate' : 'Rekan Tim',
                    role_type: 'member',
                    avatar_url: partnerAvatar,
                    club_name: partnerClub,
                    category_title: indCatTitle,
                    division_name: teamCat?.division_name || '',
                    title: `${partnerName} (${indCatTitle})`,
                    subtitle: `${partnerClub} • ${isEn.value ? 'Individual Fee (Included in Invoice)' : 'Biaya Individu (Ditanggung Pendaftar)'}`,
                    amount: singleFee,
                    status_badge: isEn.value ? 'Included in Invoice' : 'Ditanggung Pendaftar',
                    status_type: 'covered',
                    note: isEn.value ? 'Individual entry fee included in this invoice' : 'Biaya pendaftaran individu ditanggung pada tagihan ini'
                })
            }
        }
    }
    return items
})

const delegationAthleteBreakdownItems = computed(() => {
    if (registrationMode.value !== 'club_delegation') return []
    const delegationClub = delegationClubName.value || delegationOfficialName.value || (isEn.value ? 'Club Delegation' : 'Kontingen Klub')

    const items = []
    for (const ath of delegationAthletes.value) {
        if (!ath.full_name) continue
        const catIds = getArcherCategoryIds(ath)
        const athClub = ath.club_name || delegationClub

        if (catIds.length === 0) {
            items.push({
                id: `del-ath-${ath.archer_id || ath.full_name}-nocat`,
                type: 'delegation_athlete',
                group: 'delegation',
                person_name: ath.full_name,
                role_label: null,
                role_type: 'athlete',
                avatar_url: ath.avatar_url || '',
                club_name: athClub,
                category_title: isEn.value ? 'No category selected' : 'Kategori belum dipilih',
                division_name: '',
                title: `${ath.full_name} (${isEn.value ? 'No Category' : 'Belum Ada Kategori'})`,
                subtitle: athClub,
                amount: 0,
                status_badge: ath.is_new_account ? (isEn.value ? 'New Account' : 'Akun Baru') : null,
                status_type: 'payable',
                note: isEn.value ? 'Please assign a category in roster' : 'Pilih kategori lomba pada daftar atlet'
            })
        } else {
            for (const catId of catIds) {
                const cat = categories.value.find(c => c.id === catId)
                const fee = getFeeForCategory(catId)
                const catTitle = getCategoryFullName(cat)

                items.push({
                    id: `del-ath-${ath.archer_id || ath.full_name}-${catId}`,
                    type: 'delegation_athlete',
                    group: 'delegation',
                    person_name: ath.full_name,
                    role_label: null,
                    role_type: 'athlete',
                    avatar_url: ath.avatar_url || '',
                    club_name: athClub,
                    category_title: catTitle,
                    division_name: cat?.division_name || '',
                    title: `${ath.full_name} (${catTitle})`,
                    subtitle: athClub,
                    amount: fee,
                    status_badge: ath.is_new_account ? (isEn.value ? 'New Account' : 'Akun Baru') : null,
                    status_type: 'payable',
                    note: ath.is_new_account ? (isEn.value ? 'New account created automatically' : 'Akun baru dibuat otomatis') : (isEn.value ? 'Official Delegation Archer' : 'Pemanah Delegasi Klub')
                })
            }
        }
    }
    return items
})

const delegationTeamBreakdownItems = computed(() => {
    if (registrationMode.value !== 'club_delegation') return []
    const delegationClub = delegationClubName.value || delegationOfficialName.value || (isEn.value ? 'Club Delegation' : 'Kontingen Klub')

    const items = []
    for (const [catId, count] of Object.entries(delegationTeamBookings.value)) {
        if (count > 0) {
            const cat = categories.value.find(c => c.id === catId)
            const unitFee = getFeeForCategory(catId)
            const fee = unitFee * count
            const catTitle = getCategoryFullName(cat)

            items.push({
                id: `del-team-${catId}`,
                type: 'delegation_team',
                group: 'delegation',
                person_name: catTitle,
                qty: count,
                unit_price: unitFee,
                role_label: isEn.value ? 'Team Quota' : 'Kuota Tim',
                role_type: 'team_slot',
                avatar_url: '',
                club_name: delegationClub,
                category_title: catTitle,
                division_name: cat?.division_name || '',
                title: catTitle,
                subtitle: `${delegationClub} • ${isEn.value ? 'Reserved Team Quota' : 'Reservasi Kuota Tim'}`,
                amount: fee,
                status_badge: null,
                status_type: 'reserved',
                note: isEn.value ? 'Roster composition submitted at Technical Meeting' : 'Susunan atlet diserahkan saat Technical Meeting'
            })
        }
    }
    return items
})

const computedBreakdownItems = computed(() => {
    if (registrationMode.value === 'captain_team') {
        return [
            ...captainIndividualBreakdownItems.value,
            ...captainTeamBreakdownItems.value,
            ...captainTeammateBreakdownItems.value
        ]
    }
    return [
        ...delegationAthleteBreakdownItems.value,
        ...delegationTeamBreakdownItems.value
    ]
})

const totalCalculatedFee = computed(() => {
    return computedBreakdownItems.value.reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
})

const hasAnyRegistrationSelection = computed(() => {
    if (registrationMode.value === 'captain_team') {
        return selectedIndividualCategoryIds.value.length > 0 || selectedTeamCategories.value.length > 0
    }
    const hasAssignedAthletes = delegationAthletes.value.some(a => getArcherCategoryIds(a).length > 0)
    const hasTeams = Object.values(delegationTeamBookings.value).some(c => c > 0)
    return hasAssignedAthletes || hasTeams
})

// ─── STEP VALIDATION ──────────────────────────────────────────────────────────
const isStep1Valid = computed(() => {
    if (!registrationMode.value) return false
    if (registrationMode.value === 'captain_team') {
        const basicValid = !!(
            profileForm.value.full_name?.trim() &&
            profileForm.value.gender
        )
        if (!basicValid) return false
        return areRequiredCustomFieldsFilled(customFieldAnswers.value, customFields.value)
    }
    if (registrationMode.value === 'club_delegation') {
        return true
    }
    return false
})

const isStep2Valid = computed(() => {
    if (registrationMode.value === 'captain_team') {
        return selectedIndividualCategoryIds.value.length > 0 || selectedTeamCategories.value.length > 0
    } else {
        const hasAthletes = delegationAthletes.value.length > 0
        const allAthletesHaveCategory = hasAthletes && delegationAthletes.value.every(a => getArcherCategoryIds(a).length > 0)
        const allAthletesHaveRequiredCustom = delegationAthletes.value.every(a => areRequiredCustomFieldsFilled(a.custom_fields, customFields.value))
        const hasTeams = Object.values(delegationTeamBookings.value).some(c => c > 0)
        if (hasAthletes) {
            return allAthletesHaveCategory && allAthletesHaveRequiredCustom
        }
        return hasTeams
    }
})

const isFormValid = computed(() => isStep1Valid.value && isStep2Valid.value)

const checkoutButtonText = computed(() => {
    if (totalCalculatedFee.value === 0) return isEn.value ? 'Complete Free Registration' : 'Selesaikan Pendaftaran Gratis'
    return isEn.value ? 'Pay Now' : 'Bayar Sekarang'
})

const goToStep = async (step) => {
    if (step === 2) {
        if (!isStep1Valid.value) {
            if (registrationMode.value === 'captain_team') {
                if (!profileForm.value.full_name?.trim() || !profileForm.value.gender) {
                    toast.warning(isEn.value 
                        ? 'Please fill in your name and select your gender.' 
                        : 'Mohon lengkapi nama dan pilih jenis kelamin terlebih dahulu.')
                } else if (!areRequiredCustomFieldsFilled(customFieldAnswers.value, customFields.value)) {
                    toast.warning(isEn.value 
                        ? 'Please fill in all required additional fields.' 
                        : 'Mohon lengkapi semua data persyaratan tambahan yang wajib diisi.')
                }
            } else {
                toast.warning(isEn.value 
                    ? 'Please fill in representative name and select club.' 
                    : 'Mohon lengkapi nama perwakilan dan pilih klub terlebih dahulu.')
            }
            return
        }

        // Save profile to database immediately
        if (registrationMode.value === 'captain_team') {
            const profileId = archerProfile.value?.uuid || archerProfile.value?.id
            try {
                if (profileId) {
                    await put(`/archers/${profileId}`, {
                        full_name: profileForm.value.full_name,
                        gender: profileForm.value.gender,
                        club_id: profileForm.value.club_id || null,
                        club_name: profileForm.value.club_name || null,
                        country: profileForm.value.country || 'Indonesia'
                    }).catch(() => {})
                }
                await put('/user/profile', {
                    full_name: profileForm.value.full_name,
                    gender: profileForm.value.gender,
                    club_id: profileForm.value.club_id || null
                }).catch(() => {})
            } catch (e) {
                console.warn('Could not auto-save archer profile:', e)
            }
        }
    }
    if (step === 3 && !isStep2Valid.value) {
        if (registrationMode.value === 'captain_team') {
            toast.warning(isEn.value ? 'Please select at least 1 competition category.' : 'Silakan pilih minimal 1 kategori pertandingan.')
        } else {
            const missingCat = delegationAthletes.value.some(a => getArcherCategoryIds(a).length === 0)
            const missingCustom = delegationAthletes.value.some(a => !areRequiredCustomFieldsFilled(a.custom_fields, customFields.value))
            if (missingCat) {
                toast.warning(isEn.value ? 'Please select a competition category for all athletes in the roster.' : 'Mohon pilih kategori lomba untuk semua atlet di dalam daftar.')
            } else if (missingCustom) {
                toast.warning(isEn.value ? 'Please complete all required fields for every athlete in the roster (click Incomplete Data or Edit icon).' : 'Mohon lengkapi seluruh data wajib untuk semua atlet di dalam daftar (klik Data Belum Lengkap atau ikon Edit).')
            } else {
                toast.warning(isEn.value ? 'Please add at least 1 athlete or reserve team quota.' : 'Silakan tambahkan minimal 1 atlet atau reservasi kuota tim.')
            }
        }
        return
    }
    currentStep.value = step
}

const displayValue = (val) => val || '-'
const formatPrice = (val, allowFree = true) => {
    if (allowFree && (!val || Number(val) === 0)) {
        return isEn.value ? 'Free' : 'Gratis'
    }
    return formatMoney(val, eventCurrency.value)
}

// ─── TEAM & ROSTER ACTIONS ────────────────────────────────────────────────────
const toggleTeamCategory = (cat) => {
    const idx = selectedTeamCategories.value.findIndex(t => t.id === cat.id)
    if (idx === -1) {
        selectedTeamCategories.value.push(cat)
        if (!teamRosters.value[cat.id]) {
            teamRosters.value[cat.id] = { partners: [] }
        }
    } else {
        selectedTeamCategories.value.splice(idx, 1)
    }
}

const openPartnerModal = (cat, params) => {
    partnerModalCategory.value = cat
    partnerModalSlotIndex.value = params.index
    partnerModalGender.value = params.requiredGender || ''
    partnerModalEditPartner.value = null
    showPartnerModal.value = true
}

const handleEditPartner = (cat, params) => {
    partnerModalCategory.value = cat
    partnerModalSlotIndex.value = params.index
    partnerModalGender.value = params.requiredGender || ''
    partnerModalEditPartner.value = params.partner
    showPartnerModal.value = true
}

const handleClosePartnerModal = () => {
    showPartnerModal.value = false
    partnerModalEditPartner.value = null
}

const handlePartnerSelected = (partner) => {
    if (!partnerModalCategory.value) return
    const catId = partnerModalCategory.value.id
    if (!teamRosters.value[catId]) {
        teamRosters.value[catId] = { partners: [] }
    }
    const idx = partnerModalSlotIndex.value
    if (idx !== null && idx !== undefined && teamRosters.value[catId].partners[idx]) {
        teamRosters.value[catId].partners[idx] = partner
    } else {
        teamRosters.value[catId].partners.push(partner)
    }
    partnerModalEditPartner.value = null
}

const removePartner = (catId, partnerIdx) => {
    if (teamRosters.value[catId]?.partners) {
        teamRosters.value[catId].partners.splice(partnerIdx, 1)
    }
}

// ─── REPRESENTATIVE ATHLETE ACTIONS ───────────────────────────────────────────
const editDelegationAthlete = (ath) => {
    activeCategoryDropdownAth.value = null
    editingAthlete.value = JSON.parse(JSON.stringify(ath))
    showAddAthleteModal.value = true
}

const handleCloseAthleteModal = () => {
    showAddAthleteModal.value = false
    editingAthlete.value = null
}

const handleSaveAthlete = (athData) => {
    if (editingAthlete.value) {
        const idx = delegationAthletes.value.findIndex(a => 
            (editingAthlete.value.email && a.email?.toLowerCase()?.trim() === editingAthlete.value.email?.toLowerCase()?.trim()) ||
            (editingAthlete.value.archer_id && a.archer_id && a.archer_id === editingAthlete.value.archer_id) ||
            (a.full_name === editingAthlete.value.full_name && a.gender === editingAthlete.value.gender)
        )
        if (idx !== -1) {
            const currentItem = delegationAthletes.value[idx]
            const existingCatIds = getArcherCategoryIds(currentItem)
            delegationAthletes.value[idx] = {
                ...currentItem,
                ...athData,
                category_ids: athData.category_ids?.length ? athData.category_ids : existingCatIds,
                category_id: athData.category_id || currentItem.category_id
            }
            toast.success(isEn.value ? 'Athlete updated successfully' : 'Data atlet berhasil diperbarui')
        } else {
            delegationAthletes.value.unshift(athData)
            toast.success(isEn.value ? 'Athlete added to roster' : 'Atlet berhasil ditambahkan ke daftar')
        }
        editingAthlete.value = null
        showAddAthleteModal.value = false
    } else {
        handleAddAthlete(athData)
    }
}

const handleAddAthlete = (athData) => {
    const emailClean = (athData.email || '').toLowerCase().trim()
    const isDuplicate = delegationAthletes.value.some(a => {
        const aEmail = (a.email || '').toLowerCase().trim()
        if (emailClean && aEmail && emailClean === aEmail) return true
        if (athData.archer_id && a.archer_id && athData.archer_id === a.archer_id) return true
        return false
    })

    if (isDuplicate) {
        toast.error(isEn.value ? 'This athlete is already in your delegation roster.' : 'Atlet ini sudah ada di daftar kontingen.')
        return
    }

    delegationAthletes.value.unshift(athData)
    athleteCurrentPage.value = 1
    showAddAthleteModal.value = false
    editingAthlete.value = null
    toast.success(isEn.value ? 'Athlete added to roster' : 'Atlet berhasil ditambahkan ke daftar')
}

const handleBulkImported = (importedList) => {
    if (!importedList || importedList.length === 0) return

    const currentEmails = new Set(delegationAthletes.value.map(a => (a.email || '').toLowerCase().trim()).filter(Boolean))
    const currentIds = new Set(delegationAthletes.value.map(a => a.archer_id).filter(Boolean))

    const uniqueNew = []
    let skippedCount = 0

    for (const ath of importedList) {
        const emailClean = (ath.email || '').toLowerCase().trim()
        if ((emailClean && currentEmails.has(emailClean)) || (ath.archer_id && currentIds.has(ath.archer_id))) {
            skippedCount++
            continue
        }
        if (emailClean) currentEmails.add(emailClean)
        if (ath.archer_id) currentIds.add(ath.archer_id)
        uniqueNew.push(ath)
    }

    if (uniqueNew.length === 0) {
        toast.warning(isEn.value ? 'All imported athletes are already in your roster.' : 'Semua atlet yang diimpor sudah ada di daftar kontingen.')
        return
    }

    delegationAthletes.value.unshift(...uniqueNew)
    athleteCurrentPage.value = 1
    
    if (skippedCount > 0) {
        toast.success(isEn.value 
            ? `Added ${uniqueNew.length} athletes to roster (${skippedCount} duplicates skipped)` 
            : `Berhasil menambahkan ${uniqueNew.length} atlet (${skippedCount} duplikat dilewati)`)
    } else {
        toast.success(isEn.value 
            ? `Successfully imported ${uniqueNew.length} athletes to roster` 
            : `Berhasil menambahkan ${uniqueNew.length} atlet ke daftar kontingen`)
    }
}

const removeDelegationAthleteRow = (idx) => {
    delegationAthletes.value.splice(idx, 1)
}


const viewAthleteDetail = (ath) => {
    if (!ath) return
    activeCategoryDropdownAth.value = null
    viewingAthleteDetail.value = JSON.parse(JSON.stringify(ath))
}
const closeAthleteDetail = () => {
    viewingAthleteDetail.value = null
}


const promptRemoveAthlete = (ath) => {
    activeCategoryDropdownAth.value = null
    athleteToDelete.value = ath
}
const cancelRemoveAthlete = () => {
    athleteToDelete.value = null
}
const confirmRemoveAthlete = () => {
    if (!athleteToDelete.value) return
    const ath = athleteToDelete.value
    const idx = delegationAthletes.value.findIndex(a => 
        (ath.email && a.email?.toLowerCase()?.trim() === ath.email?.toLowerCase()?.trim()) ||
        (ath.archer_id && a.archer_id && a.archer_id === ath.archer_id) ||
        (a.full_name === ath.full_name && a.gender === ath.gender)
    )
    if (idx !== -1) {
        delegationAthletes.value.splice(idx, 1)
        selectedAthleteEmails.value = selectedAthleteEmails.value.filter(e => e !== ath.email)
        if (athleteCurrentPage.value > athleteTotalPages.value) {
            athleteCurrentPage.value = Math.max(1, athleteTotalPages.value)
        }
        toast.success(isEn.value ? 'Athlete removed from roster' : 'Atlet berhasil dihapus dari daftar')
    }
    athleteToDelete.value = null
}

const removeDelegationAthlete = (ath) => {
    promptRemoveAthlete(ath)
}

// ─── TEAM ELIGIBILITY & GATE CHECKING FOR DELEGATIONS ────────────────────────
const normalizeDivision = (cat) => {
    const div = String(cat?.division_name || cat?.name || '').toLowerCase()
    if (div.includes('compound')) return 'compound'
    if (div.includes('barebow')) return 'barebow'
    if (div.includes('traditional') || div.includes('tradisional')) return 'traditional'
    if (div.includes('standard') || div.includes('standar') || div.includes('nasional')) return 'standard'
    if (div.includes('recurve')) return 'recurve'
    return div.trim()
}

const normalizeAgeGroup = (cat) => {
    const name = String(cat?.category_name_custom || cat?.category_name || cat?.name || '').toLowerCase()
    const match = name.match(/\b(u-?\s*9|u-?\s*10|u-?\s*12|u-?\s*15|u-?\s*18|u-?\s*21|master|senior|umum|open)\b/i)
    if (match) {
        return match[1].replace(/\s+/g, '').replace('u', 'u-').toLowerCase()
    }
    return 'general'
}

const getTeamEligibility = (teamCat) => {
    if (!teamCat) return { isEligible: false, maxTeams: 0, neededMessage: '', totalEligible: 0, maleCount: 0, femaleCount: 0 }
    const teamType = getCategoryType(teamCat) // 'mixed_team' or 'team'
    const teamDiv = normalizeDivision(teamCat)
    const teamAge = normalizeAgeGroup(teamCat)

    const gDiv = String(teamCat?.gender_division_name || teamCat?.gender_division_code || teamCat?.gender || '').toLowerCase().trim()
    const fullName = String(`${teamCat?.name || ''} ${teamCat?.category_name || ''} ${teamCat?.category_name_custom || ''} ${gDiv}`).toLowerCase()

    const isTeamFemale = /\b(women|woman|female|putri|wanita|perempuan)\b/i.test(fullName) || gDiv === 'women' || gDiv === 'female' || gDiv === 'putri'
    const isTeamMale = (/\b(men|man|male|putra|pria|laki)\b/i.test(fullName) && !/\b(women|woman)\b/i.test(fullName)) || gDiv === 'men' || gDiv === 'male' || gDiv === 'putra'

    let eligibleMales = []
    let eligibleFemales = []
    let eligibleArchers = []

    delegationAthletes.value.forEach(ath => {
        const athGender = (ath.gender || '').toLowerCase().trim()
        const isMale = athGender === 'male' || athGender === 'm' || athGender === 'pria' || athGender === 'laki-laki' || athGender === 'putra'
        const isFemale = athGender === 'female' || athGender === 'f' || athGender === 'wanita' || athGender === 'perempuan' || athGender === 'putri'

        const athCatIds = getArcherCategoryIds(ath)
        let isMatchingDivisionAndAge = false

        if (athCatIds.length > 0) {
            isMatchingDivisionAndAge = athCatIds.some(cId => {
                const c = categories.value.find(cat => cat.id === cId)
                if (!c) return false
                const cDiv = normalizeDivision(c)
                const cAge = normalizeAgeGroup(c)
                const divMatch = !teamDiv || !cDiv || cDiv === teamDiv
                const ageMatch = teamAge === 'general' || cAge === 'general' || cAge === teamAge
                return divMatch && ageMatch
            })
        } else {
            isMatchingDivisionAndAge = true
        }

        if (isMatchingDivisionAndAge) {
            if (isMale) eligibleMales.push(ath)
            if (isFemale) eligibleFemales.push(ath)
            if (teamType === 'mixed_team') {
                if (isMale || isFemale) eligibleArchers.push(ath)
            } else if (isTeamFemale && isFemale) {
                eligibleArchers.push(ath)
            } else if (isTeamMale && isMale) {
                eligibleArchers.push(ath)
            } else if (!isTeamFemale && !isTeamMale) {
                eligibleArchers.push(ath)
            }
        }
    })

    if (teamType === 'mixed_team') {
        const maleCount = eligibleMales.length
        const femaleCount = eligibleFemales.length
        const maxTeams = Math.min(maleCount, femaleCount)
        const isEligible = maxTeams > 0

        let neededMessage = ''
        if (maxTeams === 0) {
            if (maleCount === 0 && femaleCount === 0) {
                neededMessage = isEn.value ? 'Requires 1 Male & 1 Female archer in roster' : 'Butuh 1 atlet Putra & 1 Putri di daftar atlet'
            } else if (maleCount === 0) {
                neededMessage = isEn.value ? 'Requires at least 1 Male archer (0 available)' : 'Kurang 1 atlet Putra (0 atlet tersedia)'
            } else {
                neededMessage = isEn.value ? 'Requires at least 1 Female archer (0 available)' : 'Kurang 1 atlet Putri (0 atlet tersedia)'
            }
        } else {
            neededMessage = isEn.value 
                ? `Max ${maxTeams} Mixed Team(s) (${maleCount}M, ${femaleCount}F available)` 
                : `Maksimal ${maxTeams} Tim Mix (${maleCount} Putra, ${femaleCount} Putri tersedia)`
        }

        return {
            isMixed: true,
            requiredPerTeam: 2,
            maleCount,
            femaleCount,
            totalEligible: maleCount + femaleCount,
            maxTeams,
            isEligible,
            neededMessage
        }
    } else {
        const count = eligibleArchers.length
        const maxTeams = Math.floor(count / 3)
        const isEligible = maxTeams > 0

        let neededMessage = ''
        if (maxTeams === 0) {
            const needed = 3 - count
            neededMessage = isEn.value 
                ? `Need ${needed} more ${isTeamFemale ? 'female' : (isTeamMale ? 'male' : '')} archer(s) (Currently ${count}/3)`
                : `Kurang ${needed} atlet ${isTeamFemale ? 'putri' : (isTeamMale ? 'putra' : '')} lagi (Tersedia ${count}/3)`
        } else {
            neededMessage = isEn.value 
                ? `Max ${maxTeams} Team(s) (${count} eligible archers)`
                : `Maksimal ${maxTeams} Tim (${count} atlet memenuhi syarat)`
        }

        return {
            isMixed: false,
            requiredPerTeam: 3,
            eligibleCount: count,
            maxTeams,
            isEligible,
            neededMessage
        }
    }
}

const incrementTeamBooking = (catId) => {
    const cat = categories.value.find(c => c.id === catId)
    if (!cat) return
    const eligibility = getTeamEligibility(cat)
    const currentBooking = delegationTeamBookings.value[catId] || 0

    if (currentBooking >= eligibility.maxTeams) {
        if (eligibility.maxTeams === 0) {
            toast.warning(
                isEn.value
                    ? `Cannot reserve team: ${eligibility.neededMessage}. Please add eligible archers to the roster first.`
                    : `Tidak dapat memesan kuota tim: ${eligibility.neededMessage}. Silakan tambahkan atlet yang sesuai di daftar kontingen terlebih dahulu.`
            )
        } else {
            toast.warning(
                isEn.value
                    ? `Maximum team quota (${eligibility.maxTeams} teams) reached based on your current roster.`
                    : `Batas kuota maksimal (${eligibility.maxTeams} tim) telah tercapai sesuai jumlah atlet di daftar Anda.`
            )
        }
        return
    }

    delegationTeamBookings.value[catId] = currentBooking + 1
}

const decrementTeamBooking = (catId) => {
    if ((delegationTeamBookings.value[catId] || 0) > 0) {
        delegationTeamBookings.value[catId]--
        if (delegationTeamBookings.value[catId] <= 0) {
            delete delegationTeamBookings.value[catId]
        }
    }
}

watch(delegationAthletes, () => {
    for (const [catId, count] of Object.entries(delegationTeamBookings.value)) {
        if (count > 0) {
            const cat = categories.value.find(c => c.id === catId)
            if (cat) {
                const eligibility = getTeamEligibility(cat)
                if (count > eligibility.maxTeams) {
                    delegationTeamBookings.value[catId] = eligibility.maxTeams
                    if (eligibility.maxTeams === 0) {
                        delete delegationTeamBookings.value[catId]
                    }
                }
            }
        }
    }
}, { deep: true })

const triggerFileInput = () => proofInput.value?.click()

const copiedBankId = ref(null)
const copyAccountNumber = (accNumber, bankId) => {
    if (!accNumber) return
    if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(accNumber)
    }
    copiedBankId.value = bankId
    toast.success(isEn.value ? 'Account number copied to clipboard!' : 'Nomor rekening berhasil disalin!')
    setTimeout(() => {
        if (copiedBankId.value === bankId) {
            copiedBankId.value = null
        }
    }, 2500)
}

const handleProofUpload = async (evt) => {
    const file = evt.target.files?.[0]
    if (!file) return
    
    if (file.size > 5 * 1024 * 1024) {
        toast.error(isEn.value ? 'File size exceeds 5MB limit' : 'Ukuran file melebihi batas 5MB')
        return
    }

    proofFileName.value = file.name
    proofFileSize.value = (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    uploadingProof.value = true
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('caption', `proof-${slug}-${Date.now()}`)
        const res = await upload('/media/upload', formData)
        proofFileUrl.value = res.url || res.URL || ''
    } catch (err) {
        proofFileName.value = ''
        proofFileSize.value = ''
        toast.error(isEn.value ? 'Failed to upload proof' : 'Gagal mengunggah bukti transfer')
    } finally {
        uploadingProof.value = false
    }
}

// ─── SUBMIT HANDLER ───────────────────────────────────────────────────────────
const handleSubmit = async () => {
    if (loading.value) return
    if (!isFormValid.value) return
    loading.value = true
    submitError.value = ''

    try {
        const profileId = archerProfile.value?.uuid || archerProfile.value?.id
        if (profileId) {
            await put(`/archers/${profileId}`, {
                full_name: profileForm.value.full_name,
                gender: profileForm.value.gender,
                date_of_birth: profileForm.value.date_of_birth,
                phone: profileForm.value.phone,
                club_id: profileForm.value.club_id || null,
                club_name: profileForm.value.club_name || null,
                country: profileForm.value.country || 'Indonesia'
            }).catch(() => {})
        }

        let payload = {
            registration_mode: registrationMode.value,
            payment_type: paymentType.value,
            payment_amount: totalCalculatedFee.value
        }

        if (registrationMode.value === 'captain_team') {
            const indCatIDs = [...selectedIndividualCategoryIds.value]

            const teamRegistrations = []
            for (const cat of selectedTeamCategories.value) {
                const roster = teamRosters.value[cat.id] || { partners: [] }
                const defaultTeamName = `${profileForm.value.club_name || 'Archeris'} ${cat.name || 'Team'}`
                const captainMember = {
                    archer_id: profileId,
                    role: 'captain',
                    full_name: profileForm.value.full_name,
                    gender: profileForm.value.gender,
                    is_registered_individual: true,
                    pay_individual_fee: false
                }
                
                const otherMembers = []
                for (const p of (roster.partners || [])) {
                    let partnerArcherId = p.archer_id || ''
                    if (!partnerArcherId && p.email) {
                        try {
                            const newArcherRes = await post('/archers', {
                                full_name: p.full_name,
                                gender: p.gender,
                                email: p.email,
                                password: p.password || 'Archeris123!',
                                club_id: p.club_id || null,
                                club_name: p.club_name || null
                            })
                            partnerArcherId = newArcherRes?.uuid || newArcherRes?.id || partnerArcherId
                        } catch (e) {
                            console.warn('Could not pre-create partner archer account:', e)
                        }
                    }

                    otherMembers.push({
                        archer_id: partnerArcherId,
                        participant_id: p.participant_id || null,
                        role: 'member',
                        full_name: p.full_name,
                        gender: p.gender,
                        email: p.email,
                        is_registered_individual: p.is_already_registered_individual,
                        pay_individual_fee: !p.is_already_registered_individual
                    })
                }

                teamRegistrations.push({
                    category_id: cat.id,
                    team_name: defaultTeamName,
                    members: [captainMember, ...otherMembers]
                })
            }

            payload = {
                ...payload,
                athlete_id: profileId,
                event_category_ids: indCatIDs,
                team_registrations: teamRegistrations,
                custom_fields: customFieldAnswers.value
            }
        } else {
            // First, create any new archer accounts that were entered
            const athletesPayload = []
            for (const a of delegationAthletes.value) {
                let athleteArcherId = a.archer_id || null

                if (a.is_new_account && a.email) {
                    try {
                        const newArcherRes = await post('/archers', {
                            full_name: a.full_name,
                            gender: a.gender,
                            email: a.email,
                            password: a.password || 'Archeris123!',
                            phone: a.phone,
                            date_of_birth: a.date_of_birth,
                            club_id: a.club_id || delegationClubId.value || null,
                            club_name: a.club_name || delegationClubName.value || null
                        })
                        athleteArcherId = newArcherRes?.uuid || newArcherRes?.id || athleteArcherId
                    } catch (e) {
                        console.warn('Could not pre-create archer user account, continuing with registration:', e)
                    }
                }

                const catIds = getArcherCategoryIds(a)

                athletesPayload.push({
                    archer_id: athleteArcherId,
                    full_name: a.full_name,
                    gender: a.gender,
                    email: a.email,
                    phone: a.phone,
                    date_of_birth: a.date_of_birth,
                    category_ids: catIds,
                    club_id: a.club_id || delegationClubId.value || archerProfile.value?.club_id || null,
                    custom_fields: a.custom_fields || {}
                })
            }

            const teamsPayload = Object.entries(delegationTeamBookings.value)
                .filter(([_, count]) => count > 0)
                .map(([catId, count]) => ({
                    category_id: catId,
                    team_name: `${delegationClubName.value || delegationOfficialName.value || 'Representative'} Team`,
                    count: count
                }))

            payload = {
                ...payload,
                club_name: delegationClubName.value || delegationOfficialName.value || 'Representative',
                delegation_athletes: athletesPayload,
                delegation_teams: teamsPayload
            }
        }

        const res = await post(`/tournaments/${event.value.id}/participants`, payload)
        const registrationId = res.registration_id || res.uuid
        const participantIds = res.participant_ids || [registrationId]

        // Handle Payment Flow
        let refCode = ''
        if (paymentType.value === 'online' && totalCalculatedFee.value > 0) {
            const paymentRes = await post('/payment/create', {
                registration_id: registrationId,
                participant_ids: participantIds,
                amount: totalCalculatedFee.value,
                gateway: onlineGateway.value,
                gateway_provider: onlineGateway.value,
                payment_method: onlineGateway.value === 'paypal' ? 'paypal' : 'qris',
                event_id: event.value.id
            })

            const redirectUrl = paymentRes.invoice_url || paymentRes.payment_url || paymentRes.redirect_url
            if (redirectUrl) {
                window.location.href = redirectUrl
                return
            }
            refCode = paymentRes?.reference || paymentRes?.reference_code || paymentRes?.uuid || registrationId
        } else if (paymentType.value === 'manual' && totalCalculatedFee.value > 0) {
            // Step 1: Create manual payment transaction (links to registration_id & all participant_ids)
            const registrationIdStr = registrationId
            const manualPaymentRes = await post('/payment/manual/create', {
                method: 'manual',
                registration_id: registrationIdStr,
                participant_ids: participantIds,
                amount: totalCalculatedFee.value,
                event_id: event.value.id || event.value.uuid,
                type: 'registration'
            })

            // Step 2: Upload proof (mark as awaiting_verification)
            const paymentReference = manualPaymentRes?.reference || manualPaymentRes?.Reference || manualPaymentRes?.data?.reference || manualPaymentRes?.uuid
            if (paymentReference && proofFileUrl.value) {
                await post(`/payment/manual/${paymentReference}/upload-proof`, {
                    proof_url: proofFileUrl.value,
                    sender_name: senderName.value
                }).catch(() => {})
            }

            refCode = paymentReference || registrationId
        } else {
            // Free / Rp 0 registration
            refCode = res.reference || res.reference_code || res.transaction_id || ''
        }

        registrationSuccess.value = true
        await nextTick()
        setTimeout(() => {
            if (refCode) {
                navigateTo(`/dashboard/archer/payments/${refCode}`)
            } else {
                navigateTo(`/dashboard/archer/tournaments/${slug || event.value.slug || event.value.id}/my-registration`)
            }
        }, 800)

    } catch (err) {
        console.error('Registration failed:', err)
        submitError.value = err.response?.data?.error || err.data?.error || err.message || (isEn.value ? 'Failed to complete registration.' : 'Gagal menyelesaikan pendaftaran.')
    } finally {
        loading.value = false
    }
}

// ─── WATCHERS ─────────────────────────────────────────────────────────────────
watch(() => [archerProfile.value, user.value], ([profile, u]) => {
    const fullName = profile?.full_name || profile?.name || u?.full_name || u?.name || ''
    const gender = profile?.gender || u?.gender || ''
    const phone = profile?.phone || u?.phone || ''
    const email = profile?.email || u?.email || ''
    const country = profile?.country || u?.country || 'Indonesia'
    const clubName = profile?.club_name || ''
    const clubId = profile?.club_id || null
    let dob = ''
    if (profile?.date_of_birth) {
        try {
            dob = new Date(profile.date_of_birth).toISOString().split('T')[0]
        } catch (e) {}
    }

    if (fullName || profile || u) {
        profileForm.value = {
            full_name: profileForm.value.full_name || fullName,
            gender: profileForm.value.gender || gender,
            date_of_birth: profileForm.value.date_of_birth || dob,
            phone: profileForm.value.phone || phone,
            country: country,
            club_name: profileForm.value.club_name || clubName,
            club_id: profileForm.value.club_id || clubId
        }
        if (clubId && !delegationClubId.value) {
            delegationClubId.value = clubId
        }
        if (clubName && !delegationClubName.value) {
            delegationClubName.value = clubName
        }
        if (fullName && !delegationOfficialName.value) {
            delegationOfficialName.value = fullName
        }
        if (phone && !delegationOfficialPhone.value) {
            delegationOfficialPhone.value = phone
        }
        if (email && !delegationOfficialEmail.value) {
            delegationOfficialEmail.value = email
        }
    }
}, { immediate: true, deep: true })

watch(() => profileForm.value.gender, (newGender) => {
    if (!newGender) return
    // Prune individual categories that no longer match the new gender
    selectedIndividualCategoryIds.value = selectedIndividualCategoryIds.value.filter(id => {
        const cat = categories.value.find(c => c.id === id)
        return cat && isCategoryMatchingGender(cat, newGender)
    })
    // Prune team categories that no longer match the new gender
    selectedTeamCategories.value = selectedTeamCategories.value.filter(cat => {
        if (getCategoryType(cat) === 'mixed_team') return true
        return isCategoryMatchingGender(cat, newGender)
    })
})

useSeoMeta({
    title: () => `${isEn.value ? 'Register' : 'Daftar'} ${event.value?.name || 'Tournament'} - Archeris.net`,
    description: () => `Registration for ${event.value?.name || 'archery tournament'}`
})
</script>

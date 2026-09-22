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
            <div class="size-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mb-3 text-navy">
                <Icon icon="ph:spinner-gap-bold" class="text-2xl animate-spin text-navy" />
            </div>
            <h2 class="text-base font-black text-navy mb-0.5">{{ isEn ? 'Loading Registration' : 'Memuat Form Pendaftaran' }}</h2>
            <div class="text-sm text-slate-400">{{ isEn ? 'Preparing tournament categories...' : 'Menyiapkan kategori dan data turnamen...' }}</div>
        </div>

        <!-- Error State -->
        <div v-else-if="fetchError" class="flex-1 flex items-center justify-center p-6">
            <div class="text-center max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div class="size-14 bg-red-50 rounded-2xl flex items-center justify-center mb-3 mx-auto text-red-500">
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

        <div v-else class="flex-1">
            <!-- COMPACT TOURNAMENT HERO HEADER STRIP WITH LANGUAGE TOGGLE IN SAME ROW -->
            <div class="bg-navy text-white border-b border-navy/90 relative overflow-hidden">
                <div class="absolute inset-0 z-0 opacity-10">
                    <img :src="useImageOrDefault(event.image, '/hero-event-detail.jpeg')" class="w-full h-full object-cover" />
                </div>

                <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-6">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span class="text-xs sm:text-sm font-bold text-slate-300 block mb-1">
                                {{ isEn ? 'Tournament Registration' : 'Pendaftaran Turnamen' }}
                            </span>
                            <h1 class="text-xl sm:text-2xl font-black text-white tracking-tight">{{ event.name }}</h1>
                            <div class="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-300 font-medium">
                                <span class="flex items-center gap-1.5">
                                    <Icon icon="ph:calendar-blank" class="text-primary text-base" />
                                    <span>{{ displayValue(event.date) }}</span>
                                </span>
                                <span class="flex items-center gap-1.5">
                                    <Icon icon="ph:map-pin" class="text-primary text-base" />
                                    <span>{{ displayValue(event.location) }}</span>
                                </span>
                            </div>
                        </div>

                        <!-- Language Switcher in Hero Title Row with Iconify Flags -->
                        <div class="flex items-center gap-1 bg-white/10 p-1 rounded-2xl border border-white/15 shrink-0 self-start sm:self-center shadow-xs">
                            <button
                                type="button"
                                @click="setLocaleLang('en')"
                                class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
                                :class="isEn ? 'bg-primary text-navy font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-white/10'">
                                <Icon icon="circle-flags:us" class="text-base shrink-0" />
                                <span>EN</span>
                            </button>
                            <button
                                type="button"
                                @click="setLocaleLang('id')"
                                class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
                                :class="!isEn ? 'bg-primary text-navy font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-white/10'">
                                <Icon icon="circle-flags:id" class="text-base shrink-0" />
                                <span>ID</span>
                            </button>
                        </div>
                    </div>

                    <!-- 3-Step Guided Tabs -->
                    <div class="mt-6 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 sm:gap-3">
                        <button
                            type="button"
                            @click="currentStep = 1"
                            class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-left"
                            :class="currentStep === 1 ? 'bg-white/10 text-white font-bold border border-primary/40 shadow-xs' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'">
                            <div class="size-7 rounded-lg flex items-center justify-center text-xs sm:text-sm shrink-0 font-black"
                                :class="currentStep === 1 ? 'bg-primary text-navy shadow-xs' : (currentStep > 1 ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300')">
                                <Icon v-if="currentStep > 1" icon="ph:check-bold" />
                                <span v-else>1</span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="text-xs sm:text-sm font-bold leading-tight truncate">
                                    {{ isEn ? 'Registration Type' : 'Tipe Pendaftaran' }}
                                </div>
                            </div>
                        </button>

                        <button
                            type="button"
                            @click="goToStep(2)"
                            class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-left"
                            :class="currentStep === 2 ? 'bg-white/10 text-white font-bold border border-primary/40 shadow-xs' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'">
                            <div class="size-7 rounded-lg flex items-center justify-center text-xs sm:text-sm shrink-0 font-black"
                                :class="currentStep === 2 ? 'bg-primary text-navy shadow-xs' : (currentStep > 2 ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300')">
                                <Icon v-if="currentStep > 2" icon="ph:check-bold" />
                                <span v-else>2</span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="text-xs sm:text-sm font-bold leading-tight truncate">
                                    {{ isEn ? 'Select Categories' : 'Pilih Kategori' }}
                                </div>
                            </div>
                        </button>

                        <button
                            type="button"
                            @click="goToStep(3)"
                            class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-left"
                            :class="currentStep === 3 ? 'bg-white/10 text-white font-bold border border-primary/40 shadow-xs' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'">
                            <div class="size-7 rounded-lg flex items-center justify-center text-xs sm:text-sm shrink-0 font-black"
                                :class="currentStep === 3 ? 'bg-primary text-navy shadow-xs' : 'bg-white/10 text-slate-300'">
                                <span>3</span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="text-xs sm:text-sm font-bold leading-tight truncate">
                                    {{ isEn ? 'Payment' : 'Pembayaran' }}
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <!-- MAIN FORM BODY CONTAINER -->
            <main class="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-12 w-full">
                <!-- DRAFT RESTORATION BANNER -->
                <div v-if="hasSavedDraft && currentStep === 1" class="mb-5 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200 shadow-xs">
                    <div class="flex items-start gap-3">
                        <div class="size-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
                            <Icon icon="ph:file-text-bold" class="text-lg" />
                        </div>
                        <div>
                            <div class="text-xs sm:text-sm font-black text-slate-900">
                                {{ isEn ? 'Draft Registration Found' : 'Ditemukan Draf Pendaftaran Tersimpan' }}
                            </div>
                            <div class="text-xs text-slate-600 mt-0.5">
                                {{ isEn ? 'You have an unsaved registration session for this tournament. Would you like to restore it?' : 'Anda memiliki sesi pendaftaran yang belum diselesaikan untuk turnamen ini. Ingin memulihkan data tersebut?' }}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                        <button
                            type="button"
                            @click="discardDraft"
                            class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors cursor-pointer">
                            {{ isEn ? 'Discard' : 'Hapus Draf' }}
                        </button>
                        <button
                            type="button"
                            @click="restoreDraft"
                            class="px-3.5 py-1.5 rounded-xl bg-navy text-primary hover:bg-navy/90 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer">
                            <Icon icon="ph:arrow-counter-clockwise-bold" class="text-xs" />
                            <span>{{ isEn ? 'Restore Draft' : 'Pulihkan Draf' }}</span>
                        </button>
                    </div>
                </div>

                <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden divide-y divide-slate-100">
                    
                    <!-- ───────────────────────────────────────────────────────── -->
                    <!-- STEP 1: IDENTITY & MODE SELECTION                       -->
                    <!-- ───────────────────────────────────────────────────────── -->
                    <div v-if="currentStep === 1" class="p-6 sm:p-8 space-y-8">
                        <div>
                            <h2 class="text-xl sm:text-2xl font-black text-navy tracking-tight">
                                {{ isEn ? 'Select Registration Type' : 'Pilih Tipe Pendaftaran' }}
                            </h2>
                            <div class="text-sm text-slate-500 mt-1">
                                {{ isEn ? 'Choose whether you are registering for yourself / team, or registering on behalf of other archers.' : 'Pilih apakah Anda mendaftar untuk diri sendiri & tim, atau mendaftarkan atlet lain sebagai perwakilan.' }}
                            </div>
                        </div>

                        <!-- 2-Way Mode Selector Cards -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Option 1: Individual / Captain -->
                            <div
                                @click="registrationMode = 'captain_team'"
                                class="p-5 sm:p-6 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between group select-none"
                                :class="registrationMode === 'captain_team' ? 'border-navy bg-navy/[0.03] shadow-xs ring-1 ring-navy/10' : 'border-slate-200 hover:border-slate-300 bg-white'">
                                <div>
                                    <div class="flex items-center justify-between gap-2 mb-4">
                                        <div class="size-11 rounded-xl bg-navy text-primary flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                                            <Icon icon="ph:user-bold" class="text-xl" />
                                        </div>
                                        <span class="px-2.5 py-1 rounded-lg text-xs sm:text-sm font-bold"
                                            :class="registrationMode === 'captain_team' ? 'bg-navy text-primary' : 'bg-slate-100 text-slate-600'">
                                            {{ isEn ? 'Competing Athlete' : 'Peserta Bertanding' }}
                                        </span>
                                    </div>
                                    <div class="font-black text-navy text-base sm:text-lg">
                                        {{ isEn ? 'Self & Teammates' : 'Pendaftaran Mandiri & Rekan' }}
                                    </div>
                                    <div class="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed">
                                        {{ isEn ? 'Choose this mode to register yourself for individual categories and invite or register teammates for team events.' : 'Pilih mode ini untuk mendaftar kategori perorangan serta mengajak atau mendaftarkan rekan untuk kategori beregu.' }}
                                    </div>
                                </div>

                                <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <span class="font-bold text-slate-400">{{ isEn ? 'Direct Entry' : 'Pendaftaran Langsung' }}</span>
                                    <div class="size-6 rounded-full flex items-center justify-center transition-all"
                                        :class="registrationMode === 'captain_team' ? 'bg-navy text-primary' : 'border-2 border-slate-300 text-transparent'">
                                        <Icon icon="ph:check-bold" class="text-xs font-black" />
                                    </div>
                                </div>
                            </div>

                            <!-- Option 2: Club Delegation / Representative -->
                            <div
                                @click="registrationMode = 'club_delegation'"
                                class="p-5 sm:p-6 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between group select-none"
                                :class="registrationMode === 'club_delegation' ? 'border-navy bg-navy/[0.03] shadow-xs ring-1 ring-navy/10' : 'border-slate-200 hover:border-slate-300 bg-white'">
                                <div>
                                    <div class="flex items-center justify-between gap-2 mb-4">
                                        <div class="size-11 rounded-xl bg-navy text-primary flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                                            <Icon icon="ph:users-three-bold" class="text-xl" />
                                        </div>
                                        <span class="px-2.5 py-1 rounded-lg text-xs sm:text-sm font-bold"
                                            :class="registrationMode === 'club_delegation' ? 'bg-navy text-primary' : 'bg-slate-100 text-slate-600'">
                                            {{ isEn ? 'Collective / Official' : 'Kolektif / Official' }}
                                        </span>
                                    </div>
                                    <div class="font-black text-navy text-base sm:text-lg">
                                        {{ isEn ? 'Club Delegation / Manager' : 'Pendaftaran Delegasi Klub / Manajer' }}
                                    </div>
                                    <div class="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed">
                                        {{ isEn ? 'Choose this mode if you represent a club, school, or contingent registering multiple athletes together under one single invoice.' : 'Pilih mode ini jika Anda mewakili klub, sekolah, atau pengurus kontingen yang mendaftarkan banyak atlet sekaligus dalam satu tagihan.' }}
                                    </div>
                                </div>

                                <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <span class="font-bold text-slate-400">{{ isEn ? 'Batch Entry & Quotas' : 'Banyak Atlet & Kuota' }}</span>
                                    <div class="size-6 rounded-full flex items-center justify-center transition-all"
                                        :class="registrationMode === 'club_delegation' ? 'bg-navy text-primary' : 'border-2 border-slate-300 text-transparent'">
                                        <Icon icon="ph:check-bold" class="text-xs font-black" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- MODE 1: ARCHER PROFILE FORM -->
                        <div v-if="registrationMode === 'captain_team'" class="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 sm:p-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div class="flex items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
                                <div>
                                    <h3 class="text-sm sm:text-base font-black text-navy">
                                        {{ isEn ? 'Archer Profile Details' : 'Data Profil Atlet' }}
                                    </h3>
                                    <div class="text-xs text-slate-500 mt-0.5">
                                        {{ isEn ? 'Used for age category validation, match brackets, and certificates.' : 'Digunakan untuk verifikasi usia kategori, bagan tanding, dan sertifikat.' }}
                                    </div>
                                </div>
                                <span class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold shrink-0 hidden sm:inline-block">
                                    {{ isEn ? 'Participant Info' : 'Data Peserta' }}
                                </span>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <BaseInput
                                    v-model="profileForm.full_name"
                                    :label="isEn ? 'Full Name' : 'Nama Lengkap Atlet'"
                                    :placeholder="isEn ? 'Official archer name' : 'Nama lengkap atlet'"
                                    icon="ph:user-bold"
                                    required />

                                <!-- Gender Toggle -->
                                <div class="space-y-1.5">
                                    <label class="text-navy text-xs sm:text-sm font-bold block">
                                        {{ isEn ? 'Gender' : 'Jenis Kelamin' }} <span class="text-red-500">*</span>
                                    </label>
                                    <div class="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            @click="profileForm.gender = 'male'"
                                            class="h-11 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                                            :class="profileForm.gender === 'male' ? 'border-navy bg-navy text-primary shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'">
                                            <Icon icon="ph:gender-male-bold" class="text-base" />
                                            <span>{{ isEn ? 'Male' : 'Laki-laki' }}</span>
                                        </button>
                                        <button
                                            type="button"
                                            @click="profileForm.gender = 'female'"
                                            class="h-11 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                                            :class="profileForm.gender === 'female' ? 'border-navy bg-navy text-primary shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'">
                                            <Icon icon="ph:gender-female-bold" class="text-base" />
                                            <span>{{ isEn ? 'Female' : 'Perempuan' }}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <ClubSelector
                                    v-model="profileForm.club_id"
                                    v-model:newClubName="profileForm.club_name"
                                    :label="isEn ? 'Club / Contingent / School' : 'Klub / Asal Kontingen / Sekolah'"
                                    :placeholder="isEn ? 'Select or search club...' : 'Pilih atau cari klub...'" />
                            </div>
                        </div>

                        <!-- Step 1 Footer Action -->
                        <div class="pt-6 border-t border-slate-100 flex justify-end">
                            <BaseButton
                                @click="goToStep(2)"
                                :disabled="!isStep1Valid"
                                variant="navy"
                                size="md"
                                icon-right="ph:arrow-right-bold"
                                class="text-sm sm:text-base">
                                {{ isEn ? 'Continue to Categories' : 'Lanjut ke Kategori' }}
                            </BaseButton>
                        </div>
                    </div>

                    <!-- ───────────────────────────────────────────────────────── -->
                    <!-- STEP 2: CATEGORIES & SQUAD ROSTER BUILDER                -->
                    <!-- ───────────────────────────────────────────────────────── -->
                    <div v-else-if="currentStep === 2" class="p-6 sm:p-8 space-y-8">
                        <div>
                            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy/5 text-navy text-xs font-black uppercase tracking-wider mb-2">
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
                        <div v-if="registrationMode === 'captain_team'" class="space-y-8">
                            
                            <!-- Archer Profile Banner -->
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90">
                                <div class="flex items-center gap-3.5">
                                    <img
                                        :src="useImageOrDefault(archerProfile?.avatar_url || user?.avatar, profileForm.full_name || 'Archer')"
                                        class="size-11 rounded-full object-cover border border-slate-200 shrink-0" />
                                    <div class="min-w-0">
                                        <div class="text-sm sm:text-base font-black text-navy truncate">
                                            {{ profileForm.full_name || archerProfile?.full_name || user?.full_name || 'Archer' }}
                                        </div>
                                        <div class="text-xs sm:text-sm text-slate-500 font-medium truncate mt-0.5">
                                            {{ profileForm.club_name || archerProfile?.club_name || 'Independent' }} • {{ (profileForm.gender || 'male') === 'female' ? 'Female Archer' : 'Male Archer' }}
                                        </div>
                                    </div>
                                </div>
                                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-navy text-primary text-xs sm:text-sm font-black self-start sm:self-auto shrink-0 shadow-xs">
                                    <Icon icon="ph:user-bold" class="text-sm" />
                                    {{ isEn ? 'Registered Archer' : 'Pemanah Terdaftar' }}
                                </span>
                            </div>

                            <!-- Gender mismatch alert if tournament has categories but 0 match selected gender -->
                            <div v-if="categories.length > 0 && individualCategories.length === 0 && teamCategories.length === 0"
                                class="p-6 text-center border-2 border-dashed border-amber-200 bg-amber-50/50 rounded-2xl space-y-3">
                                <div class="size-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                                    <Icon icon="ph:gender-intersex-bold" class="text-2xl" />
                                </div>
                                <div class="max-w-md mx-auto">
                                    <div class="text-base font-bold text-navy">
                                        {{ isEn ? 'No matching categories for selected gender' : 'Tidak ada kategori untuk gender terpilih' }}
                                    </div>
                                    <div class="text-xs sm:text-sm text-slate-500 mt-1">
                                        {{ isEn 
                                            ? `The categories in this tournament are set for a different gender division. Current profile gender: ${(profileForm.gender || 'male') === 'female' ? 'Female' : 'Male'}.`
                                            : `Kategori turnamen ini diperuntukkan bagi divisi gender yang berbeda. Gender profil saat ini: ${(profileForm.gender || 'male') === 'female' ? 'Female' : 'Male'}.` }}
                                    </div>
                                </div>
                                <button type="button" @click="profileForm.gender = (profileForm.gender === 'female' ? 'male' : 'female')"
                                    class="inline-flex items-center gap-2 px-4 py-2 bg-navy text-primary rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:bg-navy/90 transition-all cursor-pointer">
                                    <Icon icon="ph:arrows-clockwise-bold" />
                                    <span>{{ 'Switch Gender to ' + ((profileForm.gender || 'male') === 'female' ? 'Male' : 'Female') }}</span>
                                </button>
                            </div>

                            <!-- Empty categories state if tournament has 0 categories configured -->
                            <div v-else-if="categories.length === 0" class="p-8 text-center border border-slate-200 rounded-2xl text-sm text-slate-500 bg-slate-50/50">
                                {{ isEn ? 'No categories configured for this tournament yet.' : 'Belum ada kategori yang dikonfigurasi untuk turnamen ini.' }}
                            </div>

                            <!-- Section 1: Individual Category (Multi-Selectable) -->
                            <div v-if="individualCategories.length > 0" class="space-y-3.5">
                                <div>
                                    <h3 class="text-base sm:text-lg font-black text-navy">
                                        {{ isEn ? 'Individual Category' : 'Kategori Individu' }}
                                    </h3>
                                    <div class="text-sm text-slate-500 mt-0.5">
                                        {{ isEn ? 'Select your individual competition division (you can select more than 1).' : 'Pilih kategori individu yang akan Anda ikuti (bisa memilih lebih dari 1).' }}
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div
                                        v-for="cat in individualCategories"
                                        :key="cat.id"
                                        @click="toggleIndividualCategory(cat)"
                                        class="p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                                        :class="isIndividualCategorySelected(cat.id) ? 'border-navy bg-navy/[0.03] shadow-xs ring-1 ring-navy/10' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'">
                                        <div class="flex items-center gap-3.5 min-w-0">
                                            <!-- Category Icon Image from logoArcheryCategory -->
                                            <div class="size-11 rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-slate-200/80 bg-white group-hover:scale-105 transition-transform shadow-2xs">
                                                <img :src="'/' + (getCategoryIcon(cat.name || cat.division_name) || 'category-icon/men-single-recurve.svg')" :alt="cat.name" class="w-full h-full object-contain" @error="(e) => { e.target.onerror = null; e.target.src = '/category-icon/men-single-recurve.svg' }" />
                                            </div>
                                            <div class="min-w-0">
                                                <div class="text-sm sm:text-base font-black text-navy truncate">{{ cat.name }}</div>
                                                <div class="text-xs sm:text-sm text-slate-500 font-medium truncate mt-0.5">
                                                    {{ cat.division_name || 'Individual' }} • {{ cat.gender_division_name || 'Open' }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-3 shrink-0">
                                            <span class="text-sm sm:text-base font-black text-navy">
                                                {{ formatPrice(getFeeForCategory(cat.id)) }}
                                            </span>
                                            <div class="size-6 rounded-lg border-2 flex items-center justify-center transition-all"
                                                :class="isIndividualCategorySelected(cat.id) ? 'border-navy bg-navy text-primary font-black' : 'border-slate-300 bg-white'">
                                                <Icon v-if="isIndividualCategorySelected(cat.id)" icon="ph:check-bold" class="text-xs font-black" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Section 2: Team & Mixed Team Events (Expandable Card Format) -->
                            <div v-if="teamCategories.length > 0" class="space-y-3.5 pt-2">
                                <div>
                                    <h3 class="text-base sm:text-lg font-black text-navy">
                                        {{ isEn ? 'Team & Mixed Team Events' : 'Kategori Tim / Beregu' }}
                                    </h3>
                                    <div class="text-sm text-slate-500 mt-0.5">
                                        {{ isEn ? 'Select team events to enter and invite or register teammates.' : 'Pilih kategori beregu untuk mendaftar dan susun rekan tim.' }}
                                    </div>
                                </div>

                                <div class="space-y-4">
                                    <!-- Expandable Team Category Card -->
                                    <div
                                        v-for="cat in teamCategories"
                                        :key="cat.id"
                                        class="rounded-2xl border-2 transition-all overflow-hidden bg-white"
                                        :class="selectedTeamCategories.some(t => t.id === cat.id) ? 'border-navy shadow-sm ring-1 ring-navy/10' : 'border-slate-200 hover:border-slate-300'">
                                        
                                        <!-- Category Toggle Bar -->
                                        <div
                                            @click="toggleTeamCategory(cat)"
                                            class="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none transition-colors"
                                            :class="selectedTeamCategories.some(t => t.id === cat.id) ? 'bg-navy/[0.03]' : 'hover:bg-slate-50/70'">
                                            
                                            <div class="flex items-center gap-3.5 min-w-0">
                                                <!-- Category Icon Image -->
                                                <div class="size-11 rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-slate-200/80 bg-white shadow-2xs">
                                                    <img :src="'/' + getCategoryIcon(cat.name || cat.division_name)" :alt="cat.name" class="w-full h-full object-contain" />
                                                </div>
                                                <div class="min-w-0">
                                                    <div class="flex items-center gap-2">
                                                        <span v-if="cat.division_name" class="px-2 py-0.5 rounded-md bg-slate-100 text-xs font-bold text-slate-600">
                                                            {{ cat.division_name }}
                                                        </span>
                                                        <span class="text-sm sm:text-base font-black text-navy truncate">
                                                            {{ cat.name || `${cat.division_name || ''} Team`.trim() }}
                                                        </span>
                                                    </div>
                                                    <div class="text-xs sm:text-sm text-slate-500 font-medium truncate mt-0.5">
                                                        {{ getCategoryType(cat) === 'mixed_team' ? 'Mixed Team (1 Male + 1 Female)' : 'Team (3 Archers of same division)' }}
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="flex items-center gap-4 shrink-0">
                                                <span class="text-sm sm:text-base font-black text-navy">
                                                    {{ formatPrice(getFeeForCategory(cat.id)) }}
                                                </span>
                                                <div class="size-6 rounded-lg border-2 flex items-center justify-center transition-all"
                                                    :class="selectedTeamCategories.some(t => t.id === cat.id) ? 'border-navy bg-navy text-primary' : 'border-slate-300 bg-white'">
                                                    <Icon v-if="selectedTeamCategories.some(t => t.id === cat.id)" icon="ph:check-bold" class="text-xs font-black" />
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Expanded Roster Builder Section (Directly inside category card) -->
                                        <div
                                            v-if="selectedTeamCategories.some(t => t.id === cat.id)"
                                            class="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/40">
                                            <TeamSlotBuilder
                                                :category-id="cat.id"
                                                :category-name="cat.name || `${cat.division_name || ''} Team`"
                                                :captain-name="profileForm.full_name || archerProfile?.full_name"
                                                :captain-avatar="archerProfile?.avatar_url"
                                                :captain-club="profileForm.club_name"
                                                :captain-gender="profileForm.gender || 'male'"
                                                :is-mixed-team="getCategoryType(cat) === 'mixed_team'"
                                                :partners="teamRosters[cat.id]?.partners || []"
                                                :default-single-fee="singleEntryFee"
                                                :currency="eventCurrency"
                                                @open-search="params => openPartnerModal(cat, params)"
                                                @remove-partner="partnerIdx => removePartner(cat.id, partnerIdx)" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- MODE 2: PERWAKILAN (REPRESENTATIVE) -->
                        <div v-else class="space-y-6">
                            <!-- Athlete Roster List -->
                            <div class="space-y-4">
                                <!-- Empty State: 2 Action Cards -->
                                <div v-if="delegationAthletes.length === 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <!-- Card 1: Bulk CSV Import -->
                                    <div
                                        @click="showBulkImportModal = true"
                                        class="p-5 sm:p-6 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:border-navy hover:bg-slate-50/70 transition-all cursor-pointer flex flex-col justify-between space-y-4 group shadow-2xs">
                                        <div class="space-y-3">
                                            <div class="size-11 rounded-xl bg-navy text-primary flex items-center justify-center shadow-xs">
                                                <Icon icon="ph:file-csv-bold" class="text-2xl" />
                                            </div>
                                            <div>
                                                <div class="text-base font-bold text-navy leading-snug">
                                                    {{ isEn ? 'Bulk Import via CSV' : 'Import Massal via CSV' }}
                                                </div>
                                                <div class="text-xs text-slate-500 mt-1 leading-relaxed">
                                                    {{ isEn ? 'Download tailored CSV template and import dozens of archers at once.' : 'Unduh template CSV resmi turnamen ini dan unggah puluhan atlet sekaligus.' }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="pt-1">
                                            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-navy text-xs font-bold group-hover:bg-navy group-hover:text-primary transition-colors">
                                                <Icon icon="ph:upload-simple" class="text-sm" />
                                                <span>{{ isEn ? 'Upload CSV' : 'Unggah File CSV' }}</span>
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Card 2: Manual Add -->
                                    <div
                                        @click="showAddAthleteModal = true"
                                        class="p-5 sm:p-6 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:border-navy hover:bg-slate-50/70 transition-all cursor-pointer flex flex-col justify-between space-y-4 group shadow-2xs">
                                        <div class="space-y-3">
                                            <div class="size-11 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shadow-xs group-hover:bg-navy group-hover:text-primary transition-colors">
                                                <Icon icon="ph:user-plus-bold" class="text-2xl" />
                                            </div>
                                            <div>
                                                <div class="text-base font-bold text-navy leading-snug">
                                                    {{ isEn ? 'Add Archer Manually' : 'Tambah Atlet Manual' }}
                                                </div>
                                                <div class="text-xs text-slate-500 mt-1 leading-relaxed">
                                                    {{ isEn ? 'Search registered database or create new archer accounts one-by-one.' : 'Cari di database atau daftarkan akun atlet baru satu per satu lewat form.' }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="pt-1">
                                            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-navy text-xs font-bold group-hover:bg-navy group-hover:text-primary transition-colors">
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
                                                <div class="size-8 rounded-xl bg-navy/5 text-navy flex items-center justify-center font-bold text-xs">
                                                    <Icon icon="ph:users-three-bold" class="text-base" />
                                                </div>
                                                <div class="flex items-center gap-2">
                                                    <span class="text-sm font-black text-navy">{{ isEn ? 'Delegation Roster' : 'Daftar Kontingen' }}</span>
                                                    <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                                        {{ delegationAthletes.length }} {{ isEn ? (delegationAthletes.length === 1 ? 'Archer' : 'Archers') : 'Atlet' }}
                                                    </span>
                                                </div>
                                            </div>

                                            <div class="flex items-center gap-2 self-start sm:self-auto">
                                                <button
                                                    type="button"
                                                    @click="showBulkImportModal = true"
                                                    class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-navy hover:border-slate-400 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors">
                                                    <Icon icon="ph:file-csv-bold" class="text-sm text-primary-hover" />
                                                    <span>{{ isEn ? 'Import CSV' : 'Impor CSV' }}</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    @click="showAddAthleteModal = true"
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
                                                    v-model="athleteSearchQuery"
                                                    type="text"
                                                    :placeholder="isEn ? 'Search name, email, club...' : 'Cari nama, email, klub...'"
                                                    class="w-full h-8 sm:h-9 pl-8 pr-7 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-navy placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-navy focus:bg-white transition-all" />
                                                <Icon icon="ph:magnifying-glass" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-sm" />
                                                <button
                                                    v-if="athleteSearchQuery"
                                                    type="button"
                                                    @click="athleteSearchQuery = ''"
                                                    class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy cursor-pointer">
                                                    <Icon icon="ph:x-circle-fill" class="text-xs sm:text-sm" />
                                                </button>
                                            </div>

                                            <div class="flex items-center gap-2 flex-wrap">
                                                <!-- Gender Filter -->
                                                <div class="flex items-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden text-xs sm:text-sm font-bold h-8 sm:h-9 divide-x divide-slate-200">
                                                    <button type="button" @click="athleteGenderFilter = 'all'"
                                                        class="px-2.5 sm:px-3 h-full transition-colors cursor-pointer"
                                                        :class="athleteGenderFilter === 'all' ? 'bg-navy text-primary' : 'text-slate-600 hover:bg-slate-100'">
                                                        {{ isEn ? 'All' : 'Semua' }}
                                                    </button>
                                                    <button type="button" @click="athleteGenderFilter = 'male'"
                                                        class="px-2.5 sm:px-3 h-full transition-colors cursor-pointer"
                                                        :class="athleteGenderFilter === 'male' ? 'bg-navy text-primary' : 'text-slate-600 hover:bg-slate-100'">
                                                        Male
                                                    </button>
                                                    <button type="button" @click="athleteGenderFilter = 'female'"
                                                        class="px-2.5 sm:px-3 h-full transition-colors cursor-pointer"
                                                        :class="athleteGenderFilter === 'female' ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-100'">
                                                        Female
                                                    </button>
                                                </div>

                                                <!-- Club Filter -->
                                                <div v-if="uniqueClubsInRoster.length > 1" class="relative">
                                                    <button
                                                        type="button"
                                                        @click.stop="showClubFilterDropdown = !showClubFilterDropdown"
                                                        class="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                                                        :class="athleteClubFilter !== 'all' ? 'border-navy bg-navy text-primary' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'">
                                                        <Icon icon="ph:buildings-bold" class="text-sm" />
                                                        <span>{{ athleteClubFilter !== 'all' ? athleteClubFilter : (isEn ? 'All Clubs' : 'Semua Klub') }}</span>
                                                        <Icon icon="ph:caret-down-bold" class="text-[10px]" :class="{ 'rotate-180': showClubFilterDropdown }" />
                                                    </button>
                                                    <div v-if="showClubFilterDropdown" class="absolute right-0 top-full mt-1.5 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 w-52 overflow-hidden">
                                                        <div class="p-1.5 space-y-0.5">
                                                            <button type="button"
                                                                @click.stop="athleteClubFilter = 'all'; showClubFilterDropdown = false"
                                                                class="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                                                :class="athleteClubFilter === 'all' ? 'bg-navy text-primary' : 'text-slate-700 hover:bg-slate-100'">
                                                                {{ isEn ? 'All Clubs' : 'Semua Klub' }}
                                                            </button>
                                                            <button type="button"
                                                                v-for="club in uniqueClubsInRoster"
                                                                :key="club"
                                                                @click.stop="athleteClubFilter = club; showClubFilterDropdown = false"
                                                                class="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer truncate"
                                                                :class="athleteClubFilter === club ? 'bg-navy text-primary' : 'text-slate-700 hover:bg-slate-100'">
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
                                        <div class="flex items-center gap-2 text-xs font-bold text-navy">
                                            <span class="size-6 rounded-lg bg-navy text-primary flex items-center justify-center text-xs font-black">{{ selectedAthleteEmails.length }}</span>
                                            <span>{{ isEn ? `${selectedAthleteEmails.length} archers selected` : `${selectedAthleteEmails.length} atlet dipilih` }}</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <button
                                                type="button"
                                                @click="showBulkCategoryModal = true"
                                                class="px-3 py-1.5 rounded-xl bg-navy text-primary text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-navy/90 transition-colors cursor-pointer">
                                                <Icon icon="ph:tag-bold" class="text-xs" />
                                                <span>{{ isEn ? 'Assign Category' : 'Tetapkan Kategori' }}</span>
                                            </button>
                                            <button
                                                type="button"
                                                @click="removeSelectedAthletes"
                                                class="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer">
                                                <Icon icon="ph:trash-bold" class="text-xs" />
                                                <span>{{ isEn ? 'Remove Selected' : 'Hapus Terpilih' }}</span>
                                            </button>
                                            <button
                                                type="button"
                                                @click="selectedAthleteEmails = []"
                                                class="text-xs text-slate-500 hover:text-navy font-bold px-2 py-1 cursor-pointer">
                                                {{ isEn ? 'Deselect' : 'Batal' }}
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Table View -->
                                    <div class="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                                        <div class="overflow-x-auto">
                                            <table class="w-full text-left border-collapse text-xs sm:text-sm table-fixed min-w-[790px]">
                                                <thead class="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                                                    <tr>
                                                        <th class="py-3 px-3 w-10 text-center">
                                                            <input
                                                                type="checkbox"
                                                                :checked="isAllSelected"
                                                                @change="toggleSelectAll"
                                                                class="size-4 rounded border-slate-300 text-navy focus:ring-navy cursor-pointer" />
                                                        </th>
                                                        <th class="py-3 px-2 w-10 text-center text-slate-400">#</th>
                                                        <th class="py-3 px-4 w-[36%]">{{ isEn ? 'Archer Data' : 'Data Atlet' }}</th>
                                                        <th class="py-3 px-3.5 w-28">{{ isEn ? 'Account' : 'Status Akun' }}</th>
                                                        <th class="py-3 px-3.5 w-[34%]">{{ isEn ? 'Category' : 'Kategori Lomba' }}</th>
                                                        <th class="py-3 px-4 w-32 text-right">{{ isEn ? 'Fee' : 'Biaya' }}</th>
                                                        <th class="py-3 px-3 w-12 text-center text-slate-400">{{ isEn ? 'Action' : 'Aksi' }}</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="divide-y divide-slate-100">
                                                    <tr v-if="paginatedDelegationAthletes.length === 0">
                                                        <td colspan="7" class="py-8 text-center text-slate-400">
                                                            <Icon icon="ph:user-slash" class="text-3xl mx-auto mb-1 text-slate-300" />
                                                            <div class="text-xs font-bold">{{ isEn ? 'No archers match your search' : 'Tidak ada atlet yang cocok dengan pencarian' }}</div>
                                                        </td>
                                                    </tr>
                                                    <tr v-for="(ath, idx) in paginatedDelegationAthletes" :key="idx" class="hover:bg-slate-50/60 transition-colors" :class="{ 'bg-navy/5': selectedAthleteEmails.includes(ath.email) }">
                                                        <!-- Checkbox -->
                                                        <td class="py-3 px-3 text-center">
                                                            <input
                                                                type="checkbox"
                                                                :checked="selectedAthleteEmails.includes(ath.email)"
                                                                @change="toggleSelectAthlete(ath.email)"
                                                                class="size-4 rounded border-slate-300 text-navy focus:ring-navy cursor-pointer" />
                                                        </td>

                                                        <!-- Index -->
                                                        <td class="py-3 px-2 text-center font-bold text-slate-400 text-xs">
                                                            {{ (athleteCurrentPage - 1) * athletePageSize + idx + 1 }}
                                                        </td>

                                                        <!-- Archer Data -->
                                                        <td class="py-3 px-4">
                                                            <div class="font-bold text-navy leading-snug">{{ ath.full_name }}</div>
                                                            <div class="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1.5 flex-wrap">
                                                                <span>{{ ath.email }}</span>
                                                                <span v-if="ath.phone" class="text-slate-300">•</span>
                                                                <span v-if="ath.phone">{{ ath.phone }}</span>
                                                                <span class="text-slate-300">•</span>
                                                                <span class="font-semibold" :class="ath.gender === 'female' ? 'text-rose-600' : 'text-slate-700'">
                                                                    {{ ath.gender === 'female' ? 'Female' : 'Male' }}
                                                                </span>
                                                                <span v-if="ath.club_name" class="text-slate-300">•</span>
                                                                <span v-if="ath.club_name" class="text-slate-600 font-medium">{{ ath.club_name }}</span>
                                                            </div>
                                                        </td>

                                                        <!-- Account Status -->
                                                        <td class="py-3 px-3.5 whitespace-nowrap">
                                                            <span v-if="ath.is_new_account" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                                                <Icon icon="ph:user-plus-bold" />
                                                                <span>{{ isEn ? 'New' : 'Akun Baru' }}</span>
                                                            </span>
                                                            <span v-else class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                                                                <Icon icon="ph:user-check-bold" />
                                                                <span>{{ isEn ? 'Existing' : 'Akun Terdaftar' }}</span>
                                                            </span>
                                                        </td>

                                                        <!-- Category Selector (Compact Uniform Single-Height Button + Multi-Select Popover) -->
                                                        <td class="py-3 px-3.5">
                                                            <div class="relative">
                                                                <!-- Trigger Button (Keeps table row height perfectly neat & identical) -->
                                                                <button
                                                                    type="button"
                                                                    @click.stop="openCategoryDropdown(ath, $event)"
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
                                                                        <span class="px-1.5 py-0.5 rounded-md bg-navy text-primary text-[10px] font-black shrink-0">
                                                                            {{ getArcherCategoryIds(ath).length }}
                                                                        </span>
                                                                        <span class="truncate font-bold">
                                                                            {{ getCategoryFullName(categories.find(c => c.id === getArcherCategoryIds(ath)[0])) }}
                                                                        </span>
                                                                        <span class="text-slate-400 font-normal shrink-0">
                                                                            +{{ getArcherCategoryIds(ath).length - 1 }}
                                                                        </span>
                                                                    </div>

                                                                    <Icon icon="ph:caret-down-bold" class="text-xs text-slate-400 group-hover:text-navy shrink-0 transition-transform" :class="{ 'rotate-180': activeCategoryDropdownAth === ath }" />
                                                                </button>
                                                            </div>
                                                        </td>

                                                        <!-- Fee -->
                                                        <td class="py-3 px-3.5 text-right font-black text-navy whitespace-nowrap">
                                                            {{ formatPrice(getArcherTotalFee(ath)) }}
                                                        </td>

                                                        <!-- Action -->
                                                        <td class="py-3 px-3 text-center">
                                                            <button
                                                                type="button"
                                                                @click="removeDelegationAthlete(ath)"
                                                                class="size-7 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 inline-flex items-center justify-center transition-colors cursor-pointer"
                                                                :title="isEn ? 'Remove athlete' : 'Hapus atlet'">
                                                                <Icon icon="ph:trash" class="text-sm" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <!-- Pagination Bar -->
                                        <div v-if="filteredDelegationAthletes.length > 0" class="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
                                            <div class="text-slate-500 font-medium">
                                                {{ isEn 
                                                    ? `Showing ${(athleteCurrentPage - 1) * athletePageSize + 1} - ${Math.min(athleteCurrentPage * athletePageSize, filteredDelegationAthletes.length)} of ${filteredDelegationAthletes.length} archers`
                                                    : `Menampilkan ${(athleteCurrentPage - 1) * athletePageSize + 1} - ${Math.min(athleteCurrentPage * athletePageSize, filteredDelegationAthletes.length)} dari ${filteredDelegationAthletes.length} atlet` }}
                                            </div>

                                            <div v-if="athleteTotalPages > 1" class="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    :disabled="athleteCurrentPage <= 1"
                                                    @click="athleteCurrentPage--"
                                                    class="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer">
                                                    <Icon icon="ph:caret-left-bold" class="text-xs" />
                                                </button>

                                                <button
                                                    v-for="page in athleteTotalPages"
                                                    :key="page"
                                                    @click="athleteCurrentPage = page"
                                                    class="size-7 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                                    :class="athleteCurrentPage === page ? 'bg-navy text-white font-black' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'">
                                                    {{ page }}
                                                </button>

                                                <button
                                                    type="button"
                                                    :disabled="athleteCurrentPage >= athleteTotalPages"
                                                    @click="athleteCurrentPage++"
                                                    class="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer">
                                                    <Icon icon="ph:caret-right-bold" class="text-xs" />
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
                                    <div class="text-sm text-slate-500 mt-0.5">
                                        {{ isEn ? 'Lock team quota slots now; name exact archers at Technical Meeting.' : 'Kunci kuota tim sekarang; susunan atlet dapat ditentukan saat Technical Meeting.' }}
                                    </div>
                                </div>

                                <div v-if="teamCategories.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div
                                        v-for="cat in teamCategories"
                                        :key="cat.id"
                                        class="p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 shadow-2xs"
                                        :class="getTeamEligibility(cat).isEligible ? 'border-slate-200 bg-white' : 'border-slate-200/80 bg-slate-50/70'">
                                        
                                        <!-- Top Info Row -->
                                        <div class="flex items-start justify-between gap-3">
                                            <div class="flex items-center gap-3 min-w-0">
                                                <div class="size-11 rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-slate-200 bg-slate-50 shadow-2xs">
                                                    <img :src="'/' + (getCategoryIcon(cat.name || cat.division_name) || 'category-icon/men-team.svg')" :alt="cat.name" class="w-full h-full object-contain" @error="(e) => { e.target.onerror = null; e.target.src = '/category-icon/men-team.svg' }" />
                                                </div>
                                                <div class="min-w-0">
                                                    <div class="text-sm sm:text-base font-black text-navy truncate">
                                                        {{ cat.name || `${cat.division_name || ''} Team`.trim() || 'Team Category' }}
                                                    </div>
                                                    <div class="text-xs font-bold text-slate-500 mt-0.5">
                                                        {{ formatPrice(getFeeForCategory(cat.id)) }} / team
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Controls -->
                                            <div class="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl shrink-0">
                                                <button
                                                    type="button"
                                                    :disabled="!(delegationTeamBookings[cat.id] > 0)"
                                                    @click="decrementTeamBooking(cat.id)"
                                                    class="size-8 rounded-lg bg-white flex items-center justify-center text-navy font-bold text-sm cursor-pointer shadow-2xs hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed">
                                                    <Icon icon="ph:minus-bold" />
                                                </button>
                                                <span class="w-7 text-center text-sm font-black text-navy">
                                                    {{ delegationTeamBookings[cat.id] || 0 }}
                                                </span>
                                                <button
                                                    type="button"
                                                    :disabled="(delegationTeamBookings[cat.id] || 0) >= getTeamEligibility(cat).maxTeams"
                                                    @click="incrementTeamBooking(cat.id)"
                                                    class="size-8 rounded-lg bg-white flex items-center justify-center text-navy font-bold text-sm cursor-pointer shadow-2xs hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                                                    :title="(delegationTeamBookings[cat.id] || 0) >= getTeamEligibility(cat).maxTeams ? getTeamEligibility(cat).neededMessage : (isEn ? 'Add Team Slot' : 'Tambah Slot Tim')">
                                                    <Icon icon="ph:plus-bold" />
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Gate Checking Status Footer -->
                                        <div class="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                                            <div class="flex items-center gap-1.5 font-bold truncate">
                                                <span
                                                    class="px-2 py-0.5 rounded-md text-[11px] font-black inline-flex items-center gap-1 shrink-0"
                                                    :class="getTeamEligibility(cat).isEligible ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'">
                                                    <Icon :icon="getTeamEligibility(cat).isEligible ? 'ph:check-circle-bold' : 'ph:warning-circle-bold'" class="text-xs" />
                                                    <span>{{ getTeamEligibility(cat).isEligible ? (isEn ? `Eligible (Max ${getTeamEligibility(cat).maxTeams} Team)` : `Memenuhi Syarat (Maks. ${getTeamEligibility(cat).maxTeams} Tim)`) : (isEn ? 'Roster Incomplete' : 'Roster Belum Cukup') }}</span>
                                                </span>
                                                <span class="text-slate-400 truncate hidden sm:inline">• {{ getTeamEligibility(cat).neededMessage }}</span>
                                            </div>

                                            <button
                                                v-if="!getTeamEligibility(cat).isEligible"
                                                type="button"
                                                @click="showAddAthleteModal = true"
                                                class="text-[11px] font-black text-navy hover:underline shrink-0 flex items-center gap-0.5 cursor-pointer">
                                                <Icon icon="ph:user-plus-bold" />
                                                <span>{{ isEn ? '+ Add Archer' : '+ Tambah Atlet' }}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div v-else class="p-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 text-center space-y-1.5">
                                    <div class="size-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                                        <Icon icon="ph:users-three-bold" class="text-xl text-slate-400" />
                                    </div>
                                    <div class="text-xs sm:text-sm font-bold text-slate-700">
                                        {{ isEn ? 'No Team Categories Available' : 'Tidak Ada Kategori Beregu' }}
                                    </div>
                                    <div class="text-xs text-slate-400 max-w-sm mx-auto">
                                        {{ isEn ? 'This tournament only offers individual categories. You can proceed with individual roster above.' : 'Turnamen ini hanya menyediakan kategori perorangan/individu. Anda dapat langsung melanjutkan pendaftaran atlet individu di atas.' }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Step 2 Footer Actions -->
                        <div class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <button
                                type="button"
                                @click="currentStep = 1"
                                class="px-5 py-2.5 rounded-xl border border-slate-200 text-navy font-bold text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto">
                                <Icon icon="ph:arrow-left-bold" />
                                <span>{{ isEn ? 'Back to Type' : 'Kembali ke Tipe' }}</span>
                            </button>

                            <div class="flex items-center gap-4 self-end sm:self-auto">
                                <div class="text-right hidden sm:block">
                                    <div class="text-xs text-slate-400 font-bold uppercase tracking-wider">{{ isEn ? 'Estimated Total' : 'Estimasi Biaya' }}</div>
                                    <div class="text-base font-black text-navy tabular-nums">{{ formatPrice(totalCalculatedFee) }}</div>
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

                    <!-- ───────────────────────────────────────────────────────── -->
                    <!-- STEP 3: REVIEW & PAYMENT CHECKOUT                        -->
                    <!-- ───────────────────────────────────────────────────────── -->
                    <div v-else-if="currentStep === 3" class="p-6 sm:p-8 space-y-6">
                        <!-- Header -->
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                            <div>
                                <h2 class="text-xl sm:text-2xl font-black text-navy tracking-tight">
                                    {{ isEn ? 'Review Invoice & Payment' : 'Ringkasan & Pembayaran' }}
                                </h2>
                                <div class="text-sm text-slate-500 mt-0.5">
                                    {{ isEn ? 'Review your itemized summary and complete your payment.' : 'Periksa rincian biaya pendaftaran dan selesaikan pembayaran.' }}
                                </div>
                            </div>

                            <button
                                type="button"
                                @click="currentStep = 2"
                                class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-navy hover:bg-slate-50 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors self-start sm:self-center shrink-0">
                                <Icon icon="ph:arrow-left-bold" />
                                <span>{{ isEn ? 'Change Categories' : 'Ubah Kategori' }}</span>
                            </button>
                        </div>

                        <!-- Single Column Linear Flow -->
                        <div class="space-y-6">
                            
                            <!-- 1. Itemized Fee Breakdown -->
                            <ItemizedFeeBreakdown :items="computedBreakdownItems" :currency="eventCurrency" />

                            <!-- 2. Payment Method & Checkout Card -->
                            <div class="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
                                
                                <!-- Payment Method Selector -->
                                <div>
                                    <div class="text-xs font-black text-navy mb-1">
                                        {{ isEn ? 'Payment Method' : 'Metode Pembayaran' }}
                                    </div>
                                    <div class="text-xs text-slate-500 mb-3">
                                        {{ isEn ? 'Choose how you would like to pay:' : 'Pilih cara pembayaran yang Anda inginkan:' }}
                                    </div>

                                    <!-- Payment Radio Cards -->
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <div
                                            @click="paymentType = 'online'; manualMethodId = ''"
                                            class="p-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all flex flex-col justify-between select-none"
                                            :class="paymentType === 'online' ? 'border-navy bg-navy/[0.03] shadow-xs ring-1 ring-navy/10' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'">
                                            <div class="flex items-center justify-between mb-2">
                                                <Icon icon="ph:lightning-bold" class="text-base" :class="paymentType === 'online' ? 'text-primary' : 'text-slate-400'" />
                                                <div class="size-4 rounded-full flex items-center justify-center"
                                                    :class="paymentType === 'online' ? 'bg-navy text-primary' : 'border-2 border-slate-300'">
                                                    <Icon v-if="paymentType === 'online'" icon="ph:check-bold" class="text-[9px] font-black" />
                                                </div>
                                            </div>
                                            <div class="font-bold text-navy text-xs sm:text-sm leading-tight">
                                                {{ isEn ? 'Instant Online' : 'Instan Online' }}
                                            </div>
                                            <div class="text-xs text-slate-400 mt-0.5">
                                                {{ eventCurrency === 'IDR' ? 'QRIS & VA (Mayar)' : 'PayPal & Card' }}
                                            </div>
                                        </div>

                                        <div
                                            @click="paymentType = 'manual'"
                                            class="p-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all flex flex-col justify-between select-none"
                                            :class="paymentType === 'manual' ? 'border-navy bg-navy/[0.03] shadow-xs ring-1 ring-navy/10' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'">
                                            <div class="flex items-center justify-between mb-2">
                                                <Icon icon="ph:bank-bold" class="text-base" :class="paymentType === 'manual' ? 'text-primary' : 'text-slate-400'" />
                                                <div class="size-4 rounded-full flex items-center justify-center"
                                                    :class="paymentType === 'manual' ? 'bg-navy text-primary' : 'border-2 border-slate-300'">
                                                    <Icon v-if="paymentType === 'manual'" icon="ph:check-bold" class="text-[9px] font-black" />
                                                </div>
                                            </div>
                                            <div class="font-bold text-navy text-xs sm:text-sm leading-tight">
                                                {{ isEn ? 'Manual Transfer' : 'Transfer Bank' }}
                                            </div>
                                            <div class="text-xs text-slate-400 mt-0.5">
                                                {{ isEn ? 'Transfer & receipt' : 'Transfer & struk' }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Payment Details Panel -->
                                <div class="pt-2 border-t border-slate-100">
                                    <!-- ONLINE GATEWAY PREVIEW -->
                                    <div v-if="paymentType === 'online'" class="space-y-3">
                                        <!-- Mayar (IDR) -->
                                        <div v-if="eventCurrency === 'IDR'" class="p-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/70 flex items-center gap-3">
                                            <div class="size-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                                                <img src="/mayar-logo.png" alt="Mayar" class="w-full h-full object-contain" />
                                            </div>
                                            <div class="min-w-0">
                                                <div class="text-xs sm:text-sm font-bold text-navy">QRIS & Virtual Account (Mayar)</div>
                                                <div class="text-[11px] text-slate-500 font-medium">BCA, Mandiri, BRI, BNI, Permata, QRIS</div>
                                            </div>
                                        </div>

                                        <!-- PayPal (Non-IDR) -->
                                        <div v-else class="p-3.5 rounded-2xl border border-blue-200 bg-blue-50/50 flex items-center gap-3">
                                            <div class="size-10 rounded-xl bg-white border border-blue-200 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                                                <Icon icon="logos:paypal" class="text-xl" />
                                            </div>
                                            <div class="min-w-0">
                                                <div class="text-xs sm:text-sm font-bold text-navy">PayPal & Global Cards</div>
                                                <div class="text-[11px] text-blue-600 font-medium">{{ `Processed in ${eventCurrency}` }}</div>
                                            </div>
                                        </div>

                                        <div class="flex items-center gap-2 text-xs text-slate-500 font-medium px-1">
                                            <Icon icon="ph:check-circle-fill" class="text-emerald-500 text-sm shrink-0" />
                                            <span>{{ isEn ? 'Instant automatic payment verification.' : 'Verifikasi otomatis tanpa perlu upload struk.' }}</span>
                                        </div>
                                    </div>

                                    <!-- MANUAL TRANSFER DETAILS -->
                                    <div v-else class="space-y-3.5">
                                        <div v-if="orgManualMethods.length === 0" class="p-5 rounded-2xl border border-amber-200/90 bg-amber-50/70 text-slate-800 space-y-3">
                                            <div class="flex items-start gap-3">
                                                <div class="size-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                                                    <Icon icon="ph:warning-circle-bold" class="text-lg" />
                                                </div>
                                                <div class="min-w-0">
                                                    <div class="text-xs sm:text-sm font-black text-amber-950">
                                                        {{ isEn ? 'Transfer Account Not Available' : 'Rekening Transfer Belum Tersedia' }}
                                                    </div>
                                                    <div class="text-xs text-amber-900/80 mt-1 leading-relaxed">
                                                        {{ isEn 
                                                            ? 'The organizer has not configured manual bank transfer accounts for this event. Please use the instant online gateway or contact the organizer.' 
                                                            : 'Penyelenggara turnamen belum menambahkan rekening transfer bank manual untuk turnamen ini. Silakan gunakan metode online (otomatis) atau hubungi pihak panitia.' 
                                                        }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="pt-2 border-t border-amber-200/70 flex items-center justify-between gap-2">
                                                <button
                                                    type="button"
                                                    @click="paymentType = 'online'"
                                                    class="px-3.5 py-1.5 rounded-xl bg-navy text-primary hover:bg-navy/90 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer">
                                                    <Icon icon="ph:lightning-bold" class="text-xs" />
                                                    <span>{{ isEn ? 'Switch to Online Gateway' : 'Beralih ke Pembayaran Online' }}</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div v-else class="space-y-4">
                                            <!-- Destination Bank Section -->
                                            <div class="space-y-2">
                                                <div class="text-xs sm:text-sm font-bold text-navy flex items-center gap-1.5">
                                                    <Icon icon="ph:bank-bold" class="text-sm text-slate-500" />
                                                    <span>{{ isEn ? 'Select Destination Bank:' : 'Pilih Rekening Tujuan:' }}</span>
                                                </div>

                                                <div :class="orgManualMethods.length === 1 ? 'grid grid-cols-1' : 'grid grid-cols-1 sm:grid-cols-2 gap-2.5'">
                                                    <div
                                                        v-for="m in orgManualMethods"
                                                        :key="m.uuid || m.id"
                                                        @click="manualMethodId = m.uuid || m.id"
                                                        class="p-4 rounded-2xl border-2 cursor-pointer transition-all relative flex flex-col justify-between"
                                                        :class="manualMethodId === (m.uuid || m.id) ? 'border-navy bg-navy/[0.03] shadow-xs ring-1 ring-navy/10' : 'border-slate-200 bg-white hover:border-slate-300'">
                                                        <div class="flex items-start justify-between gap-3">
                                                            <div class="flex items-start gap-3 min-w-0">
                                                                <div class="size-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs p-1.5 overflow-hidden">
                                                                    <img
                                                                        v-if="getPaymentMethodImage(m.payment_method || m.bank_name)"
                                                                        :src="getPaymentMethodImage(m.payment_method || m.bank_name)"
                                                                        :alt="m.payment_method || m.bank_name"
                                                                        class="w-full h-full object-contain" />
                                                                    <Icon v-else icon="ph:bank-bold" class="text-lg text-navy" />
                                                                </div>
                                                                <div class="min-w-0">
                                                                    <div class="text-xs sm:text-sm font-black text-navy">{{ m.payment_method || m.bank_name }}</div>
                                                                    <div class="text-sm sm:text-base font-black text-slate-900 font-mono tracking-wider mt-1 flex items-center gap-2">
                                                                        <span>{{ m.account_number }}</span>
                                                                        <button
                                                                            type="button"
                                                                            @click.stop="copyAccountNumber(m.account_number, m.uuid || m.id)"
                                                                            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-navy/10 text-slate-600 hover:text-navy text-xs font-sans font-bold transition-colors cursor-pointer"
                                                                            :title="isEn ? 'Copy account number' : 'Salin nomor rekening'">
                                                                            <Icon v-if="copiedBankId === (m.uuid || m.id)" icon="ph:check-bold" class="text-xs text-emerald-600" />
                                                                            <Icon v-else icon="ph:copy-simple-bold" class="text-xs" />
                                                                            <span>{{ copiedBankId === (m.uuid || m.id) ? (isEn ? 'Copied' : 'Tersalin') : (isEn ? 'Copy' : 'Salin') }}</span>
                                                                        </button>
                                                                    </div>
                                                                    <div class="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                                                                        <span class="text-slate-400 font-normal">a/n</span> {{ m.account_name || m.account_holder }}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="size-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                                                                :class="manualMethodId === (m.uuid || m.id) ? 'bg-navy text-primary' : 'border-2 border-slate-300 text-transparent'">
                                                                <Icon icon="ph:check-bold" class="text-[10px] font-black" />
                                                            </div>
                                                        </div>
                                                        <div v-if="m.instructions" class="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500 leading-relaxed flex items-start gap-1.5">
                                                            <Icon icon="ph:info-bold" class="text-xs text-slate-400 shrink-0 mt-0.5" />
                                                            <span>{{ m.instructions }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Sender Name & Receipt Upload Form -->
                                            <div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3.5">
                                                <div class="text-xs sm:text-sm font-bold text-navy flex items-center gap-1.5">
                                                    <Icon icon="ph:receipt-bold" class="text-sm text-slate-500" />
                                                    <span>{{ isEn ? 'Payment Confirmation Details' : 'Konfirmasi Bukti Transfer' }}</span>
                                                </div>

                                                <BaseInput
                                                    v-model="senderName"
                                                    :label="isEn ? 'Sender Account Name' : 'Nama Pemilik Rekening Pengirim'"
                                                    :placeholder="isEn ? 'e.g. Budi Santoso (as written on receipt)' : 'cth. Budi Santoso (sesuai nama di rekening/struk)'"
                                                    required />

                                                <div class="space-y-2">
                                                    <div class="flex items-center justify-between">
                                                        <label class="text-xs sm:text-sm font-bold text-navy block">
                                                            {{ isEn ? 'Upload Transfer Receipt' : 'Unggah Bukti Transfer' }} <span class="text-rose-500">*</span>
                                                        </label>
                                                        <span class="text-[11px] sm:text-xs text-slate-400 font-medium">
                                                            {{ isEn ? 'JPG, PNG, WEBP, PDF (Max 5MB)' : 'JPG, PNG, WEBP, PDF (Maks. 5MB)' }}
                                                        </span>
                                                    </div>

                                                    <input ref="proofInput" type="file" accept="image/*,.pdf" class="hidden" @change="handleProofUpload" />

                                                    <!-- State 1: Uploading State -->
                                                    <div v-if="uploadingProof" class="p-6 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 flex flex-col items-center justify-center text-center gap-2">
                                                        <Icon icon="ph:spinner-gap-bold" class="text-2xl text-navy animate-spin" />
                                                        <div class="text-xs sm:text-sm font-bold text-navy">{{ isEn ? 'Uploading receipt...' : 'Mengunggah bukti transfer...' }}</div>
                                                        <div class="text-xs text-slate-400">{{ isEn ? 'Please wait a moment' : 'Mohon tunggu sebentar' }}</div>
                                                    </div>

                                                    <!-- State 2: Uploaded Card (Modern Structured Card) -->
                                                    <div v-else-if="proofFileUrl" class="p-4 rounded-2xl border border-emerald-300 bg-emerald-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                                                        <div class="flex items-center gap-3.5 min-w-0 flex-1">
                                                            <!-- Thumbnail Preview -->
                                                            <div class="relative size-16 sm:size-20 rounded-xl overflow-hidden border border-emerald-200 bg-white shrink-0 flex items-center justify-center shadow-xs">
                                                                <img
                                                                    v-if="!proofFileUrl.toLowerCase().endsWith('.pdf')"
                                                                    :src="proofFileUrl"
                                                                    alt="Receipt Preview"
                                                                    class="w-full h-full object-cover" />
                                                                <div v-else class="flex flex-col items-center justify-center text-rose-500 p-1">
                                                                    <Icon icon="ph:file-pdf-bold" class="text-2xl" />
                                                                    <span class="text-[10px] font-black uppercase tracking-wider mt-0.5">PDF</span>
                                                                </div>
                                                            </div>

                                                            <!-- Info & Badge -->
                                                            <div class="min-w-0 flex-1 space-y-1">
                                                                <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                                                                    <Icon icon="ph:check-circle-fill" class="text-xs text-emerald-600 shrink-0" />
                                                                    <span>{{ isEn ? 'Receipt Attached' : 'Bukti Transfer Terlampir' }}</span>
                                                                </div>
                                                                <div class="text-xs sm:text-sm font-bold text-navy truncate" :title="proofFileName || 'transfer-receipt'">
                                                                    {{ proofFileName || (isEn ? 'Transfer Receipt' : 'Bukti Transfer') }}
                                                                </div>
                                                                <div class="text-[11px] sm:text-xs text-slate-500 flex items-center gap-2">
                                                                    <span v-if="proofFileSize">{{ proofFileSize }} • </span>
                                                                    <span>{{ isEn ? 'Ready for verification' : 'Siap diverifikasi panitia' }}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <!-- Action Buttons -->
                                                        <div class="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-200/60">
                                                            <button
                                                                type="button"
                                                                @click="triggerFileInput"
                                                                class="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-navy hover:text-navy text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer">
                                                                <Icon icon="ph:arrows-clockwise-bold" class="text-xs sm:text-sm text-slate-400" />
                                                                <span>{{ isEn ? 'Change File' : 'Ganti Berkas' }}</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                @click="removeProofFile"
                                                                class="p-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 text-xs sm:text-sm font-bold flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                                                                :title="isEn ? 'Remove receipt' : 'Hapus bukti transfer'">
                                                                <Icon icon="ph:trash-bold" class="text-base" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <!-- State 3: Empty Dropzone -->
                                                    <div
                                                        v-else
                                                        @click="triggerFileInput"
                                                        class="border-2 border-dashed border-slate-300 hover:border-navy rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition-all bg-white hover:bg-slate-50/70 group shadow-2xs">
                                                        <div class="flex flex-col items-center justify-center gap-2">
                                                            <div class="size-11 rounded-2xl bg-navy/5 group-hover:bg-navy text-slate-500 group-hover:text-primary flex items-center justify-center transition-colors shadow-2xs">
                                                                <Icon icon="ph:cloud-arrow-up-bold" class="text-2xl" />
                                                            </div>
                                                            <div>
                                                                <div class="text-xs sm:text-sm font-bold text-navy">
                                                                    {{ isEn ? 'Click or drag receipt photo / PDF to upload' : 'Klik atau seret foto bukti transfer / PDF ke sini' }}
                                                                </div>
                                                                <div class="text-xs text-slate-400 mt-0.5">
                                                                    {{ isEn ? 'Supports JPG, PNG, WEBP, or PDF (Max 5MB)' : 'Mendukung format JPG, PNG, WEBP, atau PDF (Maks. 5MB)' }}
                                                                </div>
                                                            </div>
                                                            <div class="mt-1">
                                                                <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 group-hover:bg-navy group-hover:text-primary text-slate-700 text-xs font-bold transition-colors">
                                                                    <Icon icon="ph:file-arrow-up-bold" class="text-sm" />
                                                                    <span>{{ isEn ? 'Select File' : 'Pilih Berkas' }}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Total Amount & Checkout Button -->
                                <div class="pt-4 border-t border-slate-100 space-y-3">
                                    <div class="flex items-center justify-between text-sm sm:text-base">
                                        <span class="text-slate-500 font-bold">{{ isEn ? 'Total Payment' : 'Total Pembayaran' }}</span>
                                        <span class="text-xl sm:text-2xl font-black text-navy tabular-nums">{{ formatPrice(totalCalculatedFee) }}</span>
                                    </div>

                                    <BaseButton
                                        @click="handleSubmit"
                                        :disabled="loading || (paymentType === 'manual' && (!manualMethodId || !proofFileUrl || !senderName))"
                                        :loading="loading"
                                        variant="primary"
                                        size="lg"
                                        icon-right="ph:arrow-right-bold"
                                        class="w-full justify-center shadow-md text-sm sm:text-base">
                                        {{ checkoutButtonText }}
                                    </BaseButton>

                                    <div v-if="submitError" class="text-xs font-bold text-red-500 text-center bg-red-50 p-2 rounded-xl border border-red-200">
                                        {{ submitError }}
                                    </div>
                                </div>
                            </div>

                            <!-- 3. Trust & Info Reassurance -->
                            <div class="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center gap-3 text-xs text-slate-500">
                                <Icon icon="ph:shield-check-bold" class="text-emerald-600 text-xl shrink-0" />
                                <div>
                                    <span class="font-bold text-navy">{{ isEn ? 'Official Entry Verified' : 'Entri Resmi Terverifikasi' }}</span>
                                    <span class="hidden sm:inline"> — </span>
                                    <div class="sm:inline">{{ isEn ? 'Match brackets and official event certificates will be issued under your registered roster.' : 'Bagan pertandingan dan sertifikat resmi akan diterbitkan sesuai dengan data terdaftar.' }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- Add Athlete Modal for Representative Mode -->
        <AddAthleteModal
            :show="showAddAthleteModal"
            :tournament-id="event.id || slug"
            :individual-categories="individualCategories"
            :default-club-id="delegationClubId"
            :default-club-name="delegationClubName"
            :existing-emails="delegationAthletes.map(a => a.email?.toLowerCase()).filter(Boolean)"
            :existing-archer-ids="delegationAthletes.map(a => a.archer_id).filter(Boolean)"
            @close="showAddAthleteModal = false"
            @add-athlete="handleAddAthlete" />

        <!-- Bulk Import CSV/Excel Modal for Representative Mode -->
        <BulkImportModal
            :show="showBulkImportModal"
            :tournament-id="event.id || slug"
            :tournament-name="event.name || slug"
            :categories="categories"
            :existing-emails="delegationAthletes.map(a => a.email?.toLowerCase()).filter(Boolean)"
            @close="showBulkImportModal = false"
            @imported="handleBulkImported" />

        <!-- Bulk Category Assignment Modal -->
        <Teleport to="body">
            <div v-if="showBulkCategoryModal"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-fade-in"
                @click.self="showBulkCategoryModal = false">
                <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
                    <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <div class="flex items-center gap-2.5">
                            <div class="size-9 rounded-xl bg-navy text-primary flex items-center justify-center">
                                <Icon icon="ph:tag-bold" class="text-lg" />
                            </div>
                            <div>
                                <h4 class="text-sm font-black text-navy">{{ isEn ? 'Bulk Assign Category' : 'Tetapkan Kategori Massal' }}</h4>
                                <div class="text-xs text-slate-500">{{ isEn ? `Apply category to ${selectedAthleteEmails.length} selected archers` : `Terapkan ke ${selectedAthleteEmails.length} atlet terpilih` }}</div>
                            </div>
                        </div>
                        <button type="button" @click="showBulkCategoryModal = false" class="size-8 rounded-lg text-slate-400 hover:text-navy flex items-center justify-center cursor-pointer">
                            <Icon icon="ph:x-bold" class="text-sm" />
                        </button>
                    </div>

                    <!-- Selected Archers Summary Bar with Gender Badges -->
                    <div class="p-3 bg-slate-50/90 border-b border-slate-100 space-y-1.5">
                        <div class="flex items-center justify-between text-[11px] font-bold text-slate-500">
                            <span class="flex items-center gap-1">
                                <Icon icon="ph:users-three-bold" class="text-xs text-navy" />
                                <span>{{ isEn ? 'Selected Archers & Gender' : 'Atlet Terpilih & Gender' }}</span>
                            </span>
                            <span class="text-slate-400">{{ selectedAthletesForBulk.length }} {{ isEn ? 'archers' : 'atlet' }}</span>
                        </div>
                        <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                            <div
                                v-for="ath in selectedAthletesForBulk"
                                :key="ath.email"
                                class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-navy shadow-2xs">
                                <span class="truncate max-w-[130px]">{{ ath.full_name }}</span>
                                <span
                                    class="px-1.5 py-0.5 rounded text-[10px] font-black inline-flex items-center gap-0.5"
                                    :class="ath.gender?.toLowerCase() === 'female' || ath.gender?.toLowerCase() === 'women' || ath.gender?.toLowerCase() === 'f'
                                        ? 'bg-rose-50 text-rose-700'
                                        : 'bg-sky-50 text-sky-700'">
                                    <Icon
                                        :icon="ath.gender?.toLowerCase() === 'female' || ath.gender?.toLowerCase() === 'women' || ath.gender?.toLowerCase() === 'f'
                                            ? 'ph:gender-female-bold'
                                            : 'ph:gender-male-bold'"
                                        class="text-[10px]" />
                                    {{ ath.gender?.toLowerCase() === 'female' || ath.gender?.toLowerCase() === 'women' || ath.gender?.toLowerCase() === 'f' ? (isEn ? 'Female' : 'Putri') : (isEn ? 'Male' : 'Putra') }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="p-3 space-y-2 overflow-y-auto flex-1 max-h-[380px]">
                        <div
                            v-for="cat in categories.filter(c => getCategoryType(c) === 'individual')"
                            :key="cat.id"
                            @click="!getBulkCategoryMatchStats(cat).noneMatched && applyBulkCategory(cat.id)"
                            :class="[
                                'flex items-center justify-between p-3.5 rounded-2xl border transition-all select-none',
                                getBulkCategoryMatchStats(cat).noneMatched
                                    ? 'border-slate-200/80 bg-slate-50/70 opacity-50 cursor-not-allowed'
                                    : 'border-slate-200 bg-white hover:border-navy hover:bg-slate-50 shadow-2xs cursor-pointer group'
                            ]">
                            <div class="min-w-0 pr-3 space-y-1">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="text-xs font-black text-navy group-hover:underline truncate">{{ getCategoryFullName(cat) }}</span>
                                    <!-- Gender Chip -->
                                    <span
                                        :class="[
                                            'px-2 py-0.5 rounded-md text-[10px] font-black border inline-flex items-center gap-1',
                                            cat.gender_division_name?.toLowerCase().includes('putri') || cat.gender_division_name?.toLowerCase().includes('women') || cat.gender_division_name?.toLowerCase().includes('female')
                                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                : cat.gender_division_name?.toLowerCase().includes('putra') || cat.gender_division_name?.toLowerCase().includes('men') || cat.gender_division_name?.toLowerCase().includes('male')
                                                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                        ]">
                                        <Icon
                                            :icon="
                                                cat.gender_division_name?.toLowerCase().includes('putri') || cat.gender_division_name?.toLowerCase().includes('women') || cat.gender_division_name?.toLowerCase().includes('female')
                                                    ? 'ph:gender-female-bold'
                                                    : cat.gender_division_name?.toLowerCase().includes('putra') || cat.gender_division_name?.toLowerCase().includes('men') || cat.gender_division_name?.toLowerCase().includes('male')
                                                        ? 'ph:gender-male-bold'
                                                        : 'ph:users-bold'
                                            "
                                            class="text-xs" />
                                        <span>{{ cat.gender_division_name || 'Open' }}</span>
                                    </span>
                                </div>
                                
                                <!-- Compatibility Status -->
                                <div class="flex items-center gap-1.5 text-[11px] font-medium">
                                    <span v-if="getBulkCategoryMatchStats(cat).allMatched" class="text-emerald-600 font-bold flex items-center gap-1">
                                        <Icon icon="ph:check-circle-bold" class="text-xs" />
                                        <span>{{ isEn ? `Compatible with all ${selectedAthletesForBulk.length} selected archers` : `Kompatibel untuk semua ${selectedAthletesForBulk.length} atlet terpilih` }}</span>
                                    </span>
                                    <span v-else-if="getBulkCategoryMatchStats(cat).partial" class="text-amber-600 font-bold flex items-center gap-1">
                                        <Icon icon="ph:warning-circle-bold" class="text-xs" />
                                        <span>{{ isEn ? `Compatible with ${getBulkCategoryMatchStats(cat).matched} of ${selectedAthletesForBulk.length} archers (Partial)` : `Hanya kompatibel untuk ${getBulkCategoryMatchStats(cat).matched} dari ${selectedAthletesForBulk.length} atlet` }}</span>
                                    </span>
                                    <span v-else class="text-rose-500 font-bold flex items-center gap-1">
                                        <Icon icon="ph:prohibit-bold" class="text-xs" />
                                        <span>{{ isEn ? 'Gender incompatible with selected archer(s)' : 'Gender tidak cocok dengan atlet terpilih' }}</span>
                                    </span>
                                </div>
                            </div>
                            <div class="text-right shrink-0">
                                <span class="text-xs font-black text-navy whitespace-nowrap block">{{ formatPrice(getFeeForCategory(cat.id)) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Partner Selector Modal Teleported -->
        <PartnerSelectorModal
            :show="showPartnerModal"
            :title="partnerModalCategory ? `${isEn ? 'Add Teammate' : 'Tambah Anggota'}: ${partnerModalCategory.name}` : (isEn ? 'Select Teammate' : 'Pilih Rekan Tim')"
            :category-name="partnerModalCategory?.name || ''"
            :tournament-id="event.id || slug"
            :category-id="partnerModalCategory?.id || ''"
            :required-gender="partnerModalGender"
            :existing-partners="partnerModalCategory ? (teamRosters[partnerModalCategory.id]?.partners || []) : []"
            :default-single-fee="singleEntryFee"
            @close="showPartnerModal = false"
            @select-partner="handlePartnerSelected" />

        <!-- Category Multi-Select Popover (Teleported to body to escape overflow clipping) -->
        <Teleport to="body">
            <div
                v-if="activeCategoryDropdownAth"
                @click.stop
                class="fixed z-[999] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-72"
                :style="`top: ${categoryDropdownPos.top}px; left: ${categoryDropdownPos.left}px; width: ${categoryDropdownPos.width}px;`">

                <!-- Popover Header -->
                <div class="px-3.5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-black text-navy">{{ isEn ? 'Competition Categories' : 'Kategori Lomba' }}</span>
                        <span v-if="activeCategoryDropdownAth && getArcherCategoryIds(activeCategoryDropdownAth).length > 0" class="px-1.5 py-0.5 rounded-md bg-navy text-primary text-[10px] font-black">
                            {{ getArcherCategoryIds(activeCategoryDropdownAth).length }}
                        </span>
                    </div>
                    <button type="button" @click.stop="activeCategoryDropdownAth = null" class="size-6 rounded-md hover:bg-slate-200 text-slate-400 hover:text-navy flex items-center justify-center transition-colors cursor-pointer">
                        <Icon icon="ph:x-bold" class="text-xs" />
                    </button>
                </div>

                <!-- Category List -->
                <div class="p-2 space-y-1 overflow-y-auto flex-1">
                    <div
                        v-for="cat in activeCategoryDropdownAth ? availableCategoriesForGender(activeCategoryDropdownAth.gender) : []"
                        :key="cat.id"
                        @click.stop="toggleArcherCategory(activeCategoryDropdownAth, cat.id)"
                        class="flex items-center justify-between p-2 rounded-xl text-xs font-medium cursor-pointer transition-colors"
                        :class="isArcherCategorySelected(activeCategoryDropdownAth, cat.id) ? 'bg-navy/5 text-navy font-bold' : 'hover:bg-slate-50 text-slate-700'">
                        <div class="flex items-center gap-2.5 min-w-0 pr-2">
                            <div class="size-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                                :class="isArcherCategorySelected(activeCategoryDropdownAth, cat.id) ? 'bg-navy border-navy text-primary' : 'border-slate-300 bg-white'">
                                <Icon v-if="isArcherCategorySelected(activeCategoryDropdownAth, cat.id)" icon="ph:check-bold" class="text-[10px]" />
                            </div>
                            <span class="truncate">{{ getCategoryFullName(cat) }}</span>
                            <span v-if="activeCategoryDropdownAth && isCategoryRecommendedForArcher(cat, activeCategoryDropdownAth)" class="px-1.5 py-0.2 rounded text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                                {{ isEn ? 'Recommended' : 'Sesuai Usia' }}
                            </span>
                        </div>
                        <span class="text-[11px] font-bold text-slate-500 whitespace-nowrap">
                            {{ formatPrice(getFeeForCategory(cat.id)) }}
                        </span>
                    </div>
                </div>

                <!-- Popover Footer -->
                <div class="px-3.5 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div class="text-slate-500">
                        <span>Total: </span>
                        <span class="font-black text-navy">{{ activeCategoryDropdownAth ? formatPrice(getArcherTotalFee(activeCategoryDropdownAth)) : '' }}</span>
                    </div>
                    <button type="button" @click.stop="activeCategoryDropdownAth = null"
                        class="px-3 py-1 rounded-lg bg-navy text-primary font-bold text-xs hover:bg-navy/90 transition-colors cursor-pointer shadow-2xs">
                        {{ isEn ? 'Done' : 'Selesai' }}
                    </button>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
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
import TeamSlotBuilder from '~/components/tournament/register/TeamSlotBuilder.vue'
import PartnerSelectorModal from '~/components/tournament/register/PartnerSelectorModal.vue'
import AddAthleteModal from '~/components/tournament/register/AddAthleteModal.vue'
import BulkImportModal from '~/components/tournament/register/BulkImportModal.vue'
import ItemizedFeeBreakdown from '~/components/tournament/register/ItemizedFeeBreakdown.vue'
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
const { upload, put, post } = useApi()

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
const { data, pending, error: fetchError, refresh } = await useAsyncData(`event-register-${slug}`, async () => {
    const token = useCookie('auth_token').value
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
    const fetchOptions = { headers, credentials: 'include' }

    try {
        const eventResponse = await $fetch(`${apiBaseUrl}/events/${slug}`)
        if (!eventResponse) return null

        const eventId = eventResponse.uuid || eventResponse.id

        const [categoriesResponse, profileResponse, channelsRes, myRegistrationRes, paymentMethodsRes] = await Promise.all([
            $fetch(`${apiBaseUrl}/tournaments/${slug}/categories?limit=100`).catch(() => 
                $fetch(`${apiBaseUrl}/events/${slug}/categories`).catch(() => ({ data: [] }))
            ),
            token ? $fetch(`${apiBaseUrl}/archer/me`, fetchOptions).catch(() => null) : Promise.resolve(null),
            $fetch(`${apiBaseUrl}/payment/channels`).catch(() => ({ data: [] })),
            token ? $fetch(`${apiBaseUrl}/events/${slug}/my-registration`, fetchOptions).catch(() => null) : Promise.resolve(null),
            $fetch(`${apiBaseUrl}/events/${slug}/payment-methods`).catch(() => ({ data: [] }))
        ])

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
            archerProfile: archerProfileData
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

// Mode 2 State: Representative
const showAddAthleteModal = ref(false)
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

// ─── DRAFT AUTOSAVE & RESTORATION ─────────────────────────────────────────────
const hasSavedDraft = ref(false)
const draftKey = computed(() => `archery_reg_draft_${slug}`)

const saveDraftToStorage = () => {
    if (typeof window === 'undefined' || registrationSuccess.value) return
    const draftData = {
        registrationMode: registrationMode.value,
        delegationClubId: delegationClubId.value,
        delegationClubName: delegationClubName.value,
        delegationOfficialName: delegationOfficialName.value,
        delegationOfficialPhone: delegationOfficialPhone.value,
        delegationOfficialEmail: delegationOfficialEmail.value,
        delegationAthletes: delegationAthletes.value,
        delegationTeamBookings: delegationTeamBookings.value,
        selectedIndividualCategoryIds: selectedIndividualCategoryIds.value,
        selectedTeamCategories: selectedTeamCategories.value,
        teamRosters: teamRosters.value,
        timestamp: Date.now()
    }
    try {
        sessionStorage.setItem(draftKey.value, JSON.stringify(draftData))
    } catch (e) {}
}

const restoreDraft = () => {
    if (typeof window === 'undefined') return
    try {
        const saved = sessionStorage.getItem(draftKey.value)
        if (!saved) return
        const parsed = JSON.parse(saved)
        if (parsed.registrationMode) registrationMode.value = parsed.registrationMode
        if (parsed.delegationClubId) delegationClubId.value = parsed.delegationClubId
        if (parsed.delegationClubName) delegationClubName.value = parsed.delegationClubName
        if (parsed.delegationOfficialName) delegationOfficialName.value = parsed.delegationOfficialName
        if (parsed.delegationOfficialPhone) delegationOfficialPhone.value = parsed.delegationOfficialPhone
        if (parsed.delegationOfficialEmail) delegationOfficialEmail.value = parsed.delegationOfficialEmail
        if (Array.isArray(parsed.delegationAthletes)) delegationAthletes.value = parsed.delegationAthletes
        if (parsed.delegationTeamBookings) delegationTeamBookings.value = parsed.delegationTeamBookings
        if (Array.isArray(parsed.selectedIndividualCategoryIds)) selectedIndividualCategoryIds.value = parsed.selectedIndividualCategoryIds
        if (Array.isArray(parsed.selectedTeamCategories)) selectedTeamCategories.value = parsed.selectedTeamCategories
        if (parsed.teamRosters) teamRosters.value = parsed.teamRosters

        hasSavedDraft.value = false
        toast.success(isEn.value ? 'Draft restored successfully' : 'Draf pendaftaran berhasil dipulihkan')
    } catch (e) {
        toast.error(isEn.value ? 'Failed to restore draft' : 'Gagal memulihkan draf')
    }
}

const discardDraft = () => {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem(draftKey.value)
    }
    hasSavedDraft.value = false
    toast.info(isEn.value ? 'Draft discarded' : 'Draf pendaftaran telah dihapus')
}

onMounted(() => {
    if (typeof window !== 'undefined') {
        const saved = sessionStorage.getItem(draftKey.value)
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (parsed && (parsed.delegationAthletes?.length > 0 || parsed.selectedIndividualCategoryIds?.length > 0 || parsed.selectedTeamCategories?.length > 0)) {
                    hasSavedDraft.value = true
                }
            } catch (e) {}
        }
    }
})

watch(
    [
        registrationMode,
        delegationClubId,
        delegationClubName,
        delegationOfficialName,
        delegationOfficialPhone,
        delegationOfficialEmail,
        delegationAthletes,
        delegationTeamBookings,
        selectedIndividualCategoryIds,
        selectedTeamCategories,
        teamRosters
    ],
    () => {
        saveDraftToStorage()
    },
    { deep: true }
)

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

const removeDelegationAthlete = (ath) => {
    const idx = delegationAthletes.value.findIndex(a => a === ath || (a.email === ath.email && a.full_name === ath.full_name))
    if (idx !== -1) {
        delegationAthletes.value.splice(idx, 1)
        if (athleteCurrentPage.value > athleteTotalPages.value) {
            athleteCurrentPage.value = Math.max(1, athleteTotalPages.value)
        }
    }
}

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
    if (!Array.isArray(ath.category_ids)) {
        ath.category_ids = ath.category_id ? [ath.category_id] : []
    }
    const idx = ath.category_ids.indexOf(catId)
    if (idx === -1) {
        ath.category_ids.push(catId)
    } else {
        ath.category_ids.splice(idx, 1)
    }
    ath.category_id = ath.category_ids[0] || ''
}

const removeArcherCategory = (ath, catId) => {
    if (!Array.isArray(ath.category_ids)) {
        ath.category_ids = ath.category_id ? [ath.category_id] : []
    }
    const idx = ath.category_ids.indexOf(catId)
    if (idx !== -1) {
        ath.category_ids.splice(idx, 1)
    }
    ath.category_id = ath.category_ids[0] || ''
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
const event = computed(() => data.value?.event || { name: '', date: '', location: '', registration_fee: 0, fee_mode: 'per_type', fee_per_type: {}, currency: 'IDR' })
const eventCurrency = computed(() => event.value?.currency || 'IDR')
const onlineGateway = computed(() => getPaymentGatewayForCurrency(eventCurrency.value))
const categories = computed(() => data.value?.categories || [])
const orgManualMethods = computed(() => data.value?.orgManualMethods || [])
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

watch(orgManualMethods, (methods) => {
    if (methods?.length > 0) {
        if (!manualMethodId.value || !methods.some(m => (m.uuid || m.id) === manualMethodId.value)) {
            manualMethodId.value = methods[0]?.uuid || methods[0]?.id || ''
        }
    }
}, { immediate: true })
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

const isCategoryRecommendedForArcher = (cat, ath) => {
    if (!cat || !ath) return false
    if (!isCategoryMatchingGender(cat, ath.gender)) return false
    if (!ath.date_of_birth) return false

    const birthDate = new Date(ath.date_of_birth)
    if (isNaN(birthDate.getTime())) return false

    const now = new Date()
    const age = now.getFullYear() - birthDate.getFullYear()
    const catName = String(cat.name || cat.category_name || cat.category_name_custom || '').toLowerCase()

    if (catName.includes('u-12') || catName.includes('u12')) {
        return age <= 12
    }
    if (catName.includes('u-15') || catName.includes('u15')) {
        return age > 12 && age <= 15
    }
    if (catName.includes('u-18') || catName.includes('u18')) {
        return age > 15 && age <= 18
    }
    if (catName.includes('u-21') || catName.includes('u21')) {
        return age > 18 && age <= 21
    }
    if (catName.includes('master')) {
        return age >= 50
    }
    if (catName.includes('umum') || catName.includes('open') || catName.includes('senior')) {
        return age >= 18 && age < 50
    }
    return false
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

// ─── INDIVIDUAL CATEGORY MULTI-SELECTION ──────────────────────────────────────
// ─── INDIVIDUAL CATEGORY MULTI-SELECTION ──────────────────────────────────────
const toggleIndividualCategory = (cat) => {
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
    const parts = [
        cat.division_name,
        cat.category_name_custom || cat.category_name || (cat.name !== cat.division_name ? cat.name : ''),
        cat.gender_division_name,
        cat.event_type_name
    ].filter(s => s && String(s).trim() && s !== '-')
    return parts.length > 0 ? parts.join(' – ') : (cat.name || (isEn.value ? 'Category' : 'Kategori'))
}

// ─── BREAKDOWN COMPUTATION ────────────────────────────────────────────────────
const computedBreakdownItems = computed(() => {
    const items = []

    if (registrationMode.value === 'captain_team') {
        const registrantName = profileForm.value.full_name || archerProfile.value?.full_name || user.value?.full_name || user.value?.name || (isEn.value ? 'Registrant' : 'Pendaftar')
        const registrantClub = profileForm.value.club_name || archerProfile.value?.club_name || (isEn.value ? 'Independent' : 'Independen')
        const registrantAvatar = archerProfile.value?.avatar_url || ''

        // 1. Registrant Individual Categories
        for (const catId of selectedIndividualCategoryIds.value) {
            const cat = categories.value.find(c => c.id === catId)
            const fee = getFeeForCategory(catId)
            const catTitle = getCategoryFullName(cat)
            items.push({
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
            })
        }

        // 2. Team Categories & Roster
        for (const teamCat of selectedTeamCategories.value) {
            const teamFee = getFeeForCategory(teamCat.id)
            const teamCatTitle = getCategoryFullName(teamCat)
            const teamName = `${profileForm.value.club_name || registrantClub || 'Tim'} – ${teamCat.division_name || ''} Team`

            if (teamFee > 0) {
                items.push({
                    id: `team-fee-${teamCat.id}`,
                    type: 'team_fee',
                    group: 'team',
                    person_name: teamName,
                    role_label: isEn.value ? 'Team Entry Fee' : 'Biaya Pendaftaran Tim',
                    role_type: 'team_slot',
                    avatar_url: '',
                    club_name: registrantClub,
                    category_title: teamCatTitle,
                    division_name: teamCat?.division_name || '',
                    title: `Team Entry: ${teamCatTitle}`,
                    subtitle: teamName,
                    amount: teamFee,
                    status_badge: isEn.value ? 'Team Fee' : 'Biaya Tim',
                    status_type: 'payable',
                    note: isEn.value ? 'Official Team Quota' : 'Kuota Tim Resmi'
                })
            }

            const partners = teamRosters.value[teamCat.id]?.partners || []
            for (const partner of partners) {
                const partnerName = partner.full_name || (isEn.value ? 'Teammate' : 'Rekan Tim')
                const partnerClub = partner.club_name || registrantClub || (isEn.value ? 'Independent' : 'Independen')
                const partnerAvatar = partner.avatar_url || ''

                const indCatTitle = teamCatTitle.replace(/ - Team$/i, ' - Individual').replace(/ Team$/i, ' Individual').replace(/ - Beregu$/i, ' - Individu').replace(/ Beregu$/i, ' Individu')

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
                    const singleFee = partner.individual_fee || singleEntryFee.value
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
    } else {
        // Mode 2: Club Delegation
        const delegationClub = delegationClubName.value || delegationOfficialName.value || (isEn.value ? 'Club Delegation' : 'Kontingen Klub')

        for (const ath of delegationAthletes.value) {
            if (ath.full_name) {
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
        }

        for (const [catId, count] of Object.entries(delegationTeamBookings.value)) {
            if (count > 0) {
                const cat = categories.value.find(c => c.id === catId)
                const fee = getFeeForCategory(catId) * count
                const catTitle = getCategoryFullName(cat)

                items.push({
                    id: `del-team-${catId}`,
                    type: 'delegation_team',
                    group: 'delegation',
                    person_name: `${catTitle} (${count} Slot${count > 1 ? 's' : ''})`,
                    role_label: isEn.value ? 'Team Quota' : 'Kuota Tim',
                    role_type: 'team_slot',
                    avatar_url: '',
                    club_name: delegationClub,
                    category_title: catTitle,
                    division_name: cat?.division_name || '',
                    title: `${catTitle} (${count} Slot${count > 1 ? 's' : ''})`,
                    subtitle: `${delegationClub} • ${isEn.value ? 'Reserved Team Quota' : 'Reservasi Kuota Tim'}`,
                    amount: fee,
                    status_badge: isEn.value ? 'Reserved Quota' : 'Reservasi Kuota',
                    status_type: 'reserved',
                    note: isEn.value ? 'Roster composition submitted at Technical Meeting' : 'Susunan atlet diserahkan saat Technical Meeting'
                })
            }
        }
    }

    return items
})

const totalCalculatedFee = computed(() => {
    return computedBreakdownItems.value.reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
})

// ─── STEP VALIDATION ──────────────────────────────────────────────────────────
const isStep1Valid = computed(() => {
    if (!registrationMode.value) return false
    if (registrationMode.value === 'captain_team') {
        return !!(
            profileForm.value.full_name?.trim() &&
            profileForm.value.gender
        )
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
        const allAthletesHaveCategory = delegationAthletes.value.length > 0 && delegationAthletes.value.every(a => getArcherCategoryIds(a).length > 0)
        const hasTeams = Object.values(delegationTeamBookings.value).some(c => c > 0)
        return (hasAthletes && allAthletesHaveCategory) || hasTeams
    }
})

const isFormValid = computed(() => isStep1Valid.value && isStep2Valid.value)

const checkoutButtonText = computed(() => {
    if (totalCalculatedFee.value === 0) return isEn.value ? 'Complete Free Registration' : 'Selesaikan Pendaftaran Gratis'
    if (paymentType.value === 'online') {
        return onlineGateway.value === 'paypal' ? (isEn.value ? 'Pay Now with PayPal' : 'Bayar Sekarang via PayPal') : (isEn.value ? 'Pay Now via Online Gateway' : 'Bayar Sekarang via Gateway Online')
    }
    return isEn.value ? 'Confirm Manual Registration' : 'Konfirmasi Pendaftaran Manual'
})

const goToStep = async (step) => {
    if (step === 2) {
        if (!isStep1Valid.value) {
            if (registrationMode.value === 'captain_team') {
                toast.warning(isEn.value 
                    ? 'Please fill in your name and select your gender.' 
                    : 'Mohon lengkapi nama dan pilih jenis kelamin terlebih dahulu.')
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
            const missingCat = delegationAthletes.value.some(a => !a.category_id)
            if (missingCat) {
                toast.warning(isEn.value ? 'Please select a competition category for all athletes in the roster.' : 'Mohon pilih kategori lomba untuk semua atlet di dalam daftar.')
            } else {
                toast.warning(isEn.value ? 'Please add at least 1 athlete or reserve team quota.' : 'Silakan tambahkan minimal 1 atlet atau reservasi kuota tim.')
            }
        }
        return
    }
    currentStep.value = step
}

const displayValue = (val) => val || '-'
const formatPrice = (val) => {
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

        // If individual categories exist, auto-select matching individual category
        if (individualCategories.value.length > 0) {
            const matchingIndCat = individualCategories.value.find(c => 
                (c.division_name && cat.division_name && c.division_name.toLowerCase() === cat.division_name.toLowerCase()) ||
                (c.division_id && cat.division_id && c.division_id === cat.division_id)
            ) || individualCategories.value[0]

            if (matchingIndCat && !selectedIndividualCategoryIds.value.includes(matchingIndCat.id)) {
                selectedIndividualCategoryIds.value.push(matchingIndCat.id)
                toast.info(isEn.value 
                    ? `Individual category (${matchingIndCat.name}) is selected for team participant.` 
                    : `Kategori individu (${matchingIndCat.name}) dipilih otomatis untuk peserta tim.`)
            }
        }
    } else {
        selectedTeamCategories.value.splice(idx, 1)
    }
}

const openPartnerModal = (cat, params) => {
    partnerModalCategory.value = cat
    partnerModalSlotIndex.value = params.index
    partnerModalGender.value = params.requiredGender || ''
    showPartnerModal.value = true
}

const handlePartnerSelected = (partner) => {
    if (!partnerModalCategory.value) return
    const catId = partnerModalCategory.value.id
    if (!teamRosters.value[catId]) {
        teamRosters.value[catId] = { partners: [] }
    }
    teamRosters.value[catId].partners.push(partner)
}

const removePartner = (catId, partnerIdx) => {
    if (teamRosters.value[catId]?.partners) {
        teamRosters.value[catId].partners.splice(partnerIdx, 1)
    }
}

// ─── REPRESENTATIVE ATHLETE ACTIONS ───────────────────────────────────────────
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
                    : `Tidak dapat memesan kuota tim: ${eligibility.neededMessage}. Silakan lengkapi atlet di daftar pendaftaran terlebih dahulu.`
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
                team_registrations: teamRegistrations
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
                    club_id: a.club_id || delegationClubId.value || archerProfile.value?.club_id || null
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
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem(draftKey.value)
                }
                window.location.href = redirectUrl
                return
            }
            refCode = paymentRes.reference_code || paymentRes.uuid || registrationId
        } else if (paymentType.value === 'manual' && totalCalculatedFee.value > 0) {
            // Step 1: Create manual payment transaction (links to registration_id & all participant_ids)
            const registrationIdStr = registrationId
            const manualPaymentRes = await post('/payment/manual/create', {
                method: 'manual',
                registration_id: registrationIdStr,
                participant_ids: participantIds,
                type: 'registration'
            })

            // Step 2: Upload proof (mark as awaiting_verification)
            const paymentReference = manualPaymentRes?.reference || manualPaymentRes?.Reference
            if (paymentReference && proofFileUrl.value) {
                await post(`/payment/manual/${paymentReference}/upload-proof`, {
                    proof_url: proofFileUrl.value,
                    sender_name: senderName.value
                }).catch(() => {})
            }

            refCode = paymentReference || registrationId
        } else {
            // Free / Rp 0 registration
            refCode = res.reference_code || res.transaction_id || registrationId
        }

        // Clean up draft upon successful submission
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem(draftKey.value)
        }

        registrationSuccess.value = true
        await nextTick()
        setTimeout(() => {
            if (refCode) {
                navigateTo(`/dashboard/archer/payments/${refCode}`)
            } else {
                navigateTo(`/tournaments/${slug}`)
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

watch(individualCategories, (cats) => {
    if (cats.length > 0 && selectedIndividualCategoryIds.value.length === 0) {
        selectedIndividualCategoryIds.value = [cats[0].id]
    }
}, { immediate: true })

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
    // If no individual category remains selected, select first available matching category
    if (selectedIndividualCategoryIds.value.length === 0 && individualCategories.value.length > 0) {
        selectedIndividualCategoryIds.value = [individualCategories.value[0].id]
    }
})

useSeoMeta({
    title: () => `${isEn.value ? 'Register' : 'Daftar'} ${event.value?.name || 'Tournament'} - Archeris.net`,
    description: () => `Registration for ${event.value?.name || 'archery tournament'}`
})
</script>

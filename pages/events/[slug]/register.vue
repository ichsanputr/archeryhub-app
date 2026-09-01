<template>
    <div class="min-h-screen bg-gray-50 font-body text-navy pb-16">
        <!-- Loading -->
        <div v-if="showPageLoader" class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <Icon icon="ph:circle-notch-bold" class="text-4xl text-primary animate-spin mb-4" />
                <span class="text-gray-500 font-medium block">Preparing registration...</span>
            </div>
        </div>

        <!-- Error -->
        <div v-else-if="fetchError" class="min-h-screen flex items-center justify-center px-4">
            <div class="text-center max-w-md">
                <div class="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Icon icon="ph:warning-circle-fill" class="text-3xl text-red-500" />
                </div>
                <h2 class="text-xl font-black text-navy mb-3">Failed to Load Data</h2>
                <span class="text-gray-500 mb-6 block">{{ fetchError.message || 'An error occurred.' }}</span>
                <BaseButton @click="refresh()" variant="navy" size="md">Try Again</BaseButton>
            </div>
        </div>

        <!-- No Data -->
        <div v-else-if="!data || !data.event" class="min-h-screen flex items-center justify-center px-4">
            <div class="text-center max-w-md">
                <h2 class="text-xl font-black text-navy mb-3">Event Not Found</h2>
                <BaseButton to="/events" variant="navy" size="md">View Other Events</BaseButton>
            </div>
        </div>

        <!-- Redirect state (brief loading before navigating) -->
        <div v-else-if="registrationSuccess"
            class="fixed inset-0 bg-navy flex items-center justify-center z-50 overflow-hidden">
            <div class="absolute inset-0 opacity-5"
                style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 32px 32px;">
            </div>
            <div class="relative z-10 flex flex-col items-center gap-4">
                <div class="size-20 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                    <Icon icon="ph:check-bold" class="text-4xl text-navy" />
                </div>
                <h1 class="text-2xl font-black text-white text-center">Registration Successful!</h1>
                <div class="text-white/50 text-sm font-medium text-center">Redirecting to payment page...</div>
                <Icon icon="ph:circle-notch-bold" class="text-2xl text-primary animate-spin mt-2" />
            </div>
        </div>
        <template v-else>

            <!-- Hero Header (Always retained when event data exists) -->
            <div class="bg-navy relative overflow-hidden min-h-[220px] md:min-h-[280px] pt-20 flex items-end">
                <div class="absolute inset-0 z-0">
                    <img alt="Event Banner" class="w-full h-full object-cover object-center"
                        :src="useImageOrDefault(event.image, '/hero-event-detail.jpeg')" />
                    <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                    </div>
                </div>
                <div class="relative z-20 mb-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <div class="flex items-center gap-3 mb-2">
                        <NuxtLink :to="`/events/${slug}`"
                            class="text-white/60 hover:text-white transition-colors text-xs font-bold tracking-widest flex items-center gap-1">
                            <Icon icon="ph:arrow-left-bold" />
                            Back
                        </NuxtLink>
                        <Icon icon="ph:caret-right-bold" class="text-white/30 text-xs" />
                        <span class="text-white/60 text-xs font-bold tracking-widest">
                            {{ existingRegistration && existingRegistration.payment_status !== 'cancelled' ? 'Registration Status' : 'Registration' }}
                        </span>
                    </div>
                    <h1 class="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
                        {{ existingRegistration && existingRegistration.payment_status !== 'cancelled' ? 'Status Pendaftaran: ' + event.name : 'Register: ' + event.name }}
                    </h1>
                    <div class="flex flex-wrap items-center gap-4 mt-2 text-white/70 text-sm">
                        <div class="flex items-center gap-1.5">
                            <Icon icon="ph:calendar-blank" class="text-primary" />
                            <span>{{ displayValue(event.date) }}</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <Icon icon="ph:map-pin" class="text-primary" />
                            <span>{{ displayValue(event.location) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Active Registration Info Page (Status Card Mode) -->
            <main v-if="existingRegistration && existingRegistration.payment_status !== 'cancelled'" class="max-w-3xl mx-auto px-4 py-10 sm:py-14">
                <div class="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
                    <!-- Status Icon & Title -->
                    <div class="text-center space-y-3">
                        <div class="size-20 rounded-2xl flex items-center justify-center mx-auto shadow-xs"
                             :class="existingRegistration.payment_status === 'paid' || existingRegistration.payment_status === 'lunas'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                : 'bg-amber-50 text-amber-600 border border-amber-200'">
                            <Icon :icon="existingRegistration.payment_status === 'paid' || existingRegistration.payment_status === 'lunas'
                                ? 'ph:check-circle-bold'
                                : 'ph:clock-bold'" class="text-4xl" />
                        </div>
                        
                        <h2 class="text-2xl sm:text-3xl font-black text-navy tracking-tight">
                            {{ existingRegistration.payment_status === 'paid' || existingRegistration.payment_status === 'lunas'
                                ? 'Anda Sudah Terdaftar!'
                                : 'Status Pendaftaran Event' }}
                        </h2>
                        
                        <div class="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                            {{ existingRegistration.payment_status === 'paid' || existingRegistration.payment_status === 'lunas'
                                ? 'Pendaftaran Anda telah lunas dan terverifikasi untuk event ini.'
                                : 'Anda memiliki pendaftaran aktif untuk event ini. Silakan selesaikan pembayaran atau batalkan pendaftaran jika ingin mendaftar ulang.' }}
                        </div>
                    </div>

                    <!-- Registration Summary Card -->
                    <div class="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-slate-500 font-bold">Nama Pemanah</span>
                            <span class="font-black text-navy">{{ existingRegistration.full_name }}</span>
                        </div>
                        <div v-if="existingRegistration.club_name" class="flex justify-between items-center text-xs">
                            <span class="text-slate-500 font-bold">Klub</span>
                            <span class="font-bold text-navy">{{ existingRegistration.club_name }}</span>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-slate-500 font-bold">Status Pembayaran</span>
                            <span class="font-black px-2.5 py-0.5 rounded-md text-[10px]"
                                :class="existingRegistration.payment_status === 'paid' || existingRegistration.payment_status === 'lunas'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'">
                                {{ existingRegistration.payment_status === 'paid' || existingRegistration.payment_status === 'lunas' ? 'Lunas' : 'Menunggu Pembayaran' }}
                            </span>
                        </div>
                        <div class="h-px bg-slate-200/80 my-1"></div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-slate-500 font-bold">Total Biaya Pendaftaran</span>
                            <span class="text-xl font-black text-navy tabular-nums">
                                Rp {{ (existingRegistration.payment_amount || 0).toLocaleString('id-ID') }}
                            </span>
                        </div>
                    </div>

                    <!-- Registered Categories List -->
                    <div v-if="existingRegistration.categories && existingRegistration.categories.length > 0" class="space-y-3">
                        <h3 class="text-xs font-black text-slate-400 tracking-wider ">Kategori Yang Diikuti</h3>
                        <div class="space-y-2">
                            <div v-for="cat in existingRegistration.categories" :key="cat.id"
                                 class="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                                <div class="font-bold text-navy">
                                    {{ cat.division_name }} - {{ cat.category_name }} {{ cat.gender_division_name ? '- ' + cat.gender_division_name : '' }}
                                </div>
                                <span class="text-slate-400 font-medium">Target: {{ cat.target_name || '-' }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons: Cancel Registration & Back to Event -->
                    <div class="space-y-3 pt-2">
                        <BaseButton v-if="existingRegistration.payment_status !== 'paid' && existingRegistration.payment_status !== 'lunas'"
                            @click="handleCancelRegistration"
                            variant="outline" size="lg" :loading="isCancellingReg"
                            class="w-full justify-center font-bold text-red-600 border-red-200 hover:bg-red-50">
                            Batalkan Pendaftaran (Mendaftar Ulang)
                        </BaseButton>

                        <BaseButton :to="`/events/${slug}`" variant="navy" size="lg" class="w-full justify-center font-bold">
                            Kembali ke Detail Event
                        </BaseButton>
                    </div>
                </div>
            </main>

            <!-- Already Registered -->
            <main v-else-if="isAlreadyRegistered" class="max-w-2xl mx-auto px-4 py-12 text-center">
                <div class="bg-white rounded-3xl p-10 border border-gray-200 shadow-sm">
                    <div class="h-20 w-20 bg-navy rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Icon icon="ph:identification-card" class="text-4xl text-primary" />
                    </div>
                    <h2 class="text-2xl font-black text-navy mb-3">You Are Already Registered</h2>
                    <span class="text-gray-500 mb-8 leading-relaxed block">You have already registered for <strong>{{
                        event.name }}</strong>.</span>
                    <div class="flex flex-col sm:flex-row gap-3 justify-center">
                        <BaseButton to="/dashboard/archer/events" variant="navy" size="lg" class="px-8">Go to Dashboard
                        </BaseButton>
                        <BaseButton :to="`/events/${slug}`" variant="outline" size="lg" class="px-8">Back to Event
                        </BaseButton>
                    </div>
                </div>
            </main>

            <!-- Registration Not Started -->
            <main v-else-if="registrationStatus === 'not_started'" class="max-w-2xl mx-auto px-4 py-12 text-center">
                <div class="bg-white rounded-3xl p-10 border border-gray-200 shadow-sm">
                    <div class="h-20 w-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Icon icon="ph:calendar-blank-bold" class="text-4xl text-amber-500" />
                    </div>
                    <h2 class="text-2xl font-black text-navy mb-3">Pendaftaran Belum Dimulai</h2>
                    <span class="text-gray-500 mb-8 leading-relaxed block">
                        Pendaftaran untuk event <strong>{{ event.name }}</strong> baru akan dibuka pada <strong>{{ formatDateTime(event.registration_start) }}</strong>.
                    </span>
                    <div class="flex justify-center">
                        <BaseButton :to="`/events/${slug}`" variant="navy" size="lg" class="px-8">Kembali ke Event</BaseButton>
                    </div>
                </div>
            </main>

            <!-- Registration Closed -->
            <main v-else-if="registrationStatus === 'closed'" class="max-w-2xl mx-auto px-4 py-12 text-center">
                <div class="bg-white rounded-3xl p-10 border border-gray-200 shadow-sm">
                    <div class="h-20 w-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Icon icon="ph:calendar-x-bold" class="text-4xl text-red-500" />
                    </div>
                    <h2 class="text-2xl font-black text-navy mb-3">Pendaftaran Telah Ditutup</h2>
                    <span class="text-gray-500 mb-8 leading-relaxed block">
                        Batas akhir pendaftaran untuk event <strong>{{ event.name }}</strong> telah berlalu.
                    </span>
                    <div class="flex justify-center">
                        <BaseButton :to="`/events/${slug}`" variant="navy" size="lg" class="px-8">Kembali ke Event</BaseButton>
                    </div>
                </div>
            </main>

            <!-- ─────────────────────────────────────────── -->
            <!-- NOT LOGGED IN GUEST ONBOARDING VIEW         -->
            <!-- ─────────────────────────────────────────── -->
            <main v-else-if="!isLoggedIn" class="max-w-xl mx-auto px-4 py-12 sm:py-16">
                <div class="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-b from-navy via-navy/95 to-slate-900 text-white p-8 sm:p-12 shadow-2xl text-center space-y-6">
                    <!-- Ambient Glow -->
                    <div class="absolute inset-0"
                        style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.12);"></div>
                    <div class="absolute -top-20 left-1/2 -translate-x-1/2 h-44 w-44 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>

                    <!-- Glowing Icon Badge -->
                    <div class="relative z-10 size-20 rounded-3xl bg-gradient-to-br from-primary via-yellow-300 to-primary flex items-center justify-center mx-auto shadow-xl shadow-primary/25 text-navy">
                        <Icon icon="ph:user-circle-gear-bold" class="text-4xl" />
                    </div>

                    <!-- Content -->
                    <div class="relative z-10 space-y-3">
                        <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                            {{ t('guest_reg.login_required_title') }}
                        </h2>
                        <div class="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                            {{ t('guest_reg.login_required_desc') }}
                        </div>
                    </div>

                    <!-- Micro Feature Tags -->
                    <div class="relative z-10 flex items-center justify-center gap-2 flex-wrap pt-1">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] border border-white/10 text-[11px] font-bold text-slate-200">
                            <Icon icon="ph:target-bold" class="text-primary text-xs" />
                            {{ t('guest_reg.tag_target') }}
                        </span>
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] border border-white/10 text-[11px] font-bold text-slate-200">
                            <Icon icon="ph:lightning-bold" class="text-primary text-xs" />
                            {{ t('guest_reg.tag_scoring') }}
                        </span>
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] border border-white/10 text-[11px] font-bold text-slate-200">
                            <Icon icon="ph:certificate-bold" class="text-primary text-xs" />
                            {{ t('guest_reg.tag_certificate') }}
                        </span>
                    </div>

                    <!-- Actions -->
                    <div class="relative z-10 space-y-3 pt-3">
                        <NuxtLink :to="loginUrl"
                            class="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-navy font-black text-xs capitalize tracking-wider shadow-lg shadow-primary/25 transition-all duration-200 active:scale-98">
                            <Icon icon="ph:sign-in-bold" class="text-base" />
                            <span>{{ t('guest_reg.login_btn') }}</span>
                        </NuxtLink>

                        <NuxtLink :to="registerUrl"
                            class="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/[0.07] hover:bg-white/[0.14] border border-white/15 text-white font-bold text-xs transition-all duration-200 active:scale-98">
                            <Icon icon="ph:user-plus-bold" class="text-sm text-primary" />
                            <span>{{ t('guest_reg.register_btn') }}</span>
                        </NuxtLink>
                    </div>

                    <!-- Back to Event -->
                    <div class="relative z-10 pt-2">
                        <NuxtLink :to="`/events/${slug}`"
                            class="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 font-bold">
                            <Icon icon="ph:arrow-left-bold" class="text-xs" />
                            <span>{{ t('guest_reg.back_to_event') }}</span>
                        </NuxtLink>
                    </div>
                </div>
            </main>

            <!-- LOGGED IN 2-COLUMN REGISTRATION FORM        -->
            <!-- ─────────────────────────────────────────── -->
            <main v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">

                    <!-- LEFT COLUMN — Archer Info + Category -->
                    <div class="lg:col-span-3 space-y-5">

                        <!-- Archer Profile Card -->
                        <section class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                            <div class="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white flex items-center gap-3">
                                <div class="size-10 rounded-xl bg-navy text-primary flex items-center justify-center shadow-xs shrink-0">
                                    <Icon icon="ph:user-bold" class="text-xl" />
                                </div>
                                <h2 class="text-base font-black text-navy">{{ t('my_registration.athlete_data', 'Data Atlet') }}</h2>
                            </div>
                            <div class="p-6">
                                <!-- Not logged in -->
                                <div v-if="!isLoggedIn" class="py-8 flex flex-col items-center text-center">
                                    <div
                                        class="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                                        <Icon icon="ph:lock-bold" class="text-2xl text-navy" />
                                    </div>
                                    <h3 class="font-black text-navy mb-2">Login Required</h3>
                                    <span class="text-sm text-gray-500 mb-5 block">Please log in as an athlete to
                                        register.</span>
                                    <BaseButton :to="loginUrl" variant="navy" size="md">Login Now</BaseButton>
                                </div>

                                <!-- Not an archer -->
                                <div v-else-if="!isArcher" class="py-8 flex flex-col items-center text-center">
                                    <div class="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center mb-4">
                                        <Icon icon="ph:user-plus-bold" class="text-2xl text-navy" />
                                    </div>
                                    <h3 class="font-black text-navy mb-2">Athlete Account Required</h3>
                                    <span class="text-sm text-gray-500 mb-5 block">Specifically for athlete
                                        profiles.</span>
                                    <BaseButton to="/auth/register?type=archer" variant="navy" size="md">Register as
                                        Athlete</BaseButton>
                                </div>

                                <!-- Logged in archer -->
                                <div v-else class="space-y-5">
                                    <div class="flex items-center gap-4 pb-5 border-b border-gray-100">
                                        <div
                                            class="h-16 w-16 rounded-2xl overflow-hidden border-2 border-gray-100 shrink-0">
                                            <img :src="useImageOrDefault(archerProfile?.avatar_url, archerProfile?.full_name || profileForm.full_name)"
                                                class="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <span class="font-black text-navy text-lg leading-tight block">{{
                                                profileForm.full_name || 'Athlete' }}</span>
                                            <span class="text-sm text-gray-400 block">{{ archerProfile?.email || ''
                                                }}</span>
                                            <span v-if="archerProfile?.id"
                                                class="text-xs text-navy font-black bg-gray-100 px-2 py-0.5 rounded-full tracking-wider">ID:
                                                {{ archerProfile.id }}</span>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <BaseInput v-model="profileForm.full_name" :label="t('my_registration.full_name', 'Nama Lengkap')"
                                            :placeholder="t('my_registration.full_name_placeholder', 'Nama lengkap')" required icon="ph:user-bold" />
                                        <BaseSelect v-model="profileForm.gender" :items="genderOptions" :label="t('my_registration.gender', 'Jenis Kelamin')"
                                            :placeholder="t('my_registration.gender', 'Pilih Jenis Kelamin')" required icon="ph:gender-intersex" />
                                        <BaseDatePicker v-model="profileForm.date_of_birth" :label="t('my_registration.date_of_birth', 'Tanggal Lahir')"
                                            required />

                                        <BaseSelect v-model="profileForm.country" :items="countries" :label="t('my_registration.country', 'Negara')"
                                            :placeholder="t('my_registration.country', 'Pilih Negara')" icon="ph:globe-hemisphere-east-bold" />
                                        <BaseInput v-model="profileForm.club_name" :label="t('my_registration.club', 'Klub / Institusi')"
                                            icon="ph:users-bold" :hint="t('my_registration.club_hint', 'Tidak dapat diubah di sini')" disabled readonly />
                                    </div>
                                    <div class="p-3.5 bg-primary/10 border border-primary/20 rounded-xl flex gap-2.5">
                                        <Icon icon="ph:info-bold" class="text-navy shrink-0 mt-0.5" />
                                        <div class="text-xs text-navy/80 font-medium leading-relaxed">
                                            {{ t('my_registration.ensure_data_correct', 'Pastikan data sudah benar sebelum melanjutkan pendaftaran.') }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Participant Type Selection -->
                        <section class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mb-5">
                            <div class="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white flex items-center gap-3">
                                <div class="size-10 rounded-xl bg-navy text-primary flex items-center justify-center shadow-xs shrink-0">
                                    <Icon icon="ph:users-three-bold" class="text-xl" />
                                </div>
                                <div>
                                    <h2 class="text-base font-black text-navy">{{ t('my_registration.select_participant_type', 'Pilih Tipe Peserta') }}</h2>
                                    <div class="text-xs text-slate-400 font-medium">{{ t('my_registration.select_participant_type_desc', 'Tentukan jenis kepesertaan Anda') }}</div>
                                </div>
                            </div>
                            <div class="p-6">
                                <div class="grid grid-cols-2 gap-3">
                                    <button type="button"
                                        @click="participantType = 'individual'"
                                        :class="participantType === 'individual' ? 'border-primary/80 bg-primary/5 shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white'"
                                        class="flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all text-left cursor-pointer">
                                        <div class="size-10 rounded-xl flex items-center justify-center" :class="participantType === 'individual' ? 'bg-primary text-navy' : 'bg-slate-100 text-slate-500'">
                                            <Icon icon="ph:user-bold" class="text-xl" />
                                        </div>
                                        <div class="text-center">
                                            <div class="text-sm font-black text-navy">{{ t('my_registration.individual_type', 'Individu') }}</div>
                                            <div class="text-xs text-slate-500 font-medium mt-0.5">{{ t('my_registration.individual_type_desc', 'Daftar sendiri di satu atau lebih kategori') }}</div>
                                        </div>
                                        <div v-if="participantType === 'individual'" class="text-primary mt-auto">
                                            <Icon icon="ph:check-circle-fill" class="text-lg" />
                                        </div>
                                    </button>
                                    <button type="button"
                                        @click="participantType = 'team'"
                                        :class="participantType === 'team' ? 'border-primary/80 bg-primary/5 shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white'"
                                        class="flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all text-left cursor-pointer">
                                        <div class="size-10 rounded-xl flex items-center justify-center" :class="participantType === 'team' ? 'bg-primary text-navy' : 'bg-slate-100 text-slate-500'">
                                            <Icon icon="ph:users-three-bold" class="text-xl" />
                                        </div>
                                        <div class="text-center">
                                            <div class="text-sm font-black text-navy">{{ t('my_registration.team_type', 'Beregu / Tim') }}</div>
                                            <div class="text-xs text-slate-500 font-medium mt-0.5">{{ t('my_registration.team_type_desc', 'Daftar bersama anggota tim beregu') }}</div>
                                        </div>
                                        <div v-if="participantType === 'team'" class="text-primary mt-auto">
                                            <Icon icon="ph:check-circle-fill" class="text-lg" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </section>

                        <!-- Category Selection -->
                        <section class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                            <div class="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white flex items-center gap-3">
                                <div class="size-10 rounded-xl bg-navy text-primary flex items-center justify-center shadow-xs shrink-0">
                                    <Icon icon="ph:tag-bold" class="text-xl" />
                                </div>
                                <div>
                                    <h2 class="text-base font-black text-navy">{{ t('my_registration.select_category', 'Pilih Kategori') }}</h2>
                                    <div class="text-xs text-slate-400 font-medium">{{ t('my_registration.select_participant_type_desc', 'Tentukan kategori event yang ingin diikuti') }}</div>
                                </div>
                            </div>
                            <div class="p-6 space-y-4">

                                <!-- Category search -->
                                <div class="relative">
                                    <input v-model="categorySearch" type="text"
                                        :placeholder="t('my_registration.search_category_placeholder', 'Cari divisi atau kategori...')"
                                        class="w-full h-10 px-4 pl-10 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" />
                                    <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>

                                <!-- Category list -->
                                <div class="max-h-[320px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                                    <div v-for="category in filteredCategories" :key="category.id"
                                        class="rounded-xl border-2 transition-all cursor-pointer"
                                        :class="form.category_ids.includes(category.id)
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'"
                                        @click="toggleCategory(category.id)">
                                        <div class="flex items-center justify-between p-3.5 gap-3">
                                            <div class="flex items-center gap-3">
                                                <div class="size-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0"
                                                    :class="form.category_ids.includes(category.id) ? 'bg-primary border-primary' : 'bg-white border-gray-300'">
                                                    <Icon v-if="form.category_ids.includes(category.id)" icon="ph:check-bold" class="text-navy text-xs" />
                                                </div>
                                                <span class="text-sm font-bold text-navy leading-tight">{{ category.name }}</span>
                                            </div>
                                            <span v-if="event.fee_mode !== 'per_type' && getFeeForCategory(category.id) > 0"
                                                class="text-xs font-black tabular-nums shrink-0 ml-2 text-navy">
                                                {{ formatPrice(getFeeForCategory(category.id)) }}
                                            </span>
                                            <span v-else-if="event.fee_mode !== 'per_type'" class="text-xs text-gray-400 shrink-0">Free</span>
                                        </div>

                                        <!-- Team partner section (per_type + mixed_team, when category is selected) -->
                                        <div v-if="form.category_ids.includes(category.id) && event.fee_mode === 'per_type' && getCategoryType(category) === 'mixed_team'"
                                            class="border-t border-primary/20 px-3.5 pb-3.5 pt-3 space-y-2"
                                            @click.stop>
                                            <div class="flex items-center justify-between">
                                                <div class="text-xs font-black text-gray-500 tracking-widest ">
                                                    {{ getCategoryType(category) === 'mixed_team' ? 'Partner (1 Required)' : 'Team Members (2 Required)' }}
                                                </div>
                                                <button type="button"
                                                    @click="openPartnerDialog(category.id)"
                                                    :disabled="getPartnersForCategory(category.id).length >= (getCategoryType(category) === 'mixed_team' ? 1 : 2)"
                                                    class="text-xs font-black text-primary hover:text-primary/80 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1">
                                                    <Icon icon="ph:plus-bold" class="text-xs" />
                                                    Add
                                                </button>
                                            </div>
                                            <!-- Added partners -->
                                            <div v-if="getPartnersForCategory(category.id).length > 0" class="space-y-1.5">
                                                <div v-for="partner in getPartnersForCategory(category.id)" :key="partner.uuid || partner.id"
                                                    class="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-100">
                                                    <img :src="partner.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.full_name || 'A')}&background=1a2744&color=f5c842&size=32`"
                                                        class="size-6 rounded-full object-cover shrink-0" />
                                                    <span class="text-xs font-bold text-navy flex-1 truncate">{{ partner.full_name }}</span>
                                                    <span v-if="partner.id" class="text-xs text-gray-400 font-mono">{{ partner.id }}</span>
                                                    <button type="button" @click="removePartner(category.id, partner.uuid || partner.id)"
                                                        class="p-0.5 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                                                        <Icon icon="ph:x-bold" class="text-xs" />
                                                    </button>
                                                </div>
                                            </div>
                                            <!-- Empty state -->
                                            <div v-else class="text-xs text-gray-400 italic">
                                                No Partners Added Yet
                                            </div>
                                            <!-- Incomplete warning -->
                                            <div v-if="!isPartnerComplete(category.id)"
                                                class="flex items-center gap-1.5 text-xs text-amber-600 font-bold">
                                                <Icon icon="ph:warning-bold" class="text-xs" />
                                                {{ getCategoryType(category) === 'mixed_team' ? '1 Partner Required' : '2 Team Members Required' }}
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="filteredCategories.length === 0" class="py-10 text-center text-slate-400">
                                        <Icon icon="ph:magnifying-glass-slash" class="text-3xl mx-auto mb-2 opacity-40" />
                                        <div class="text-xs font-bold tracking-wider">{{ t('my_registration.category_not_found', 'Kategori Tidak Ditemukan') }}</div>
                                    </div>
                                    <div v-if="categories.length === 0 && !pending"
                                        class="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-2.5">
                                        <Icon icon="ph:warning-bold" class="text-amber-500 shrink-0" />
                                        <div class="text-sm text-amber-700 font-medium">{{ t('my_registration.category_not_available', 'Kategori belum tersedia. Silakan hubungi penyelenggara.') }}</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Order Summary -->
                        <section class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                            <div class="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white flex items-center gap-3">
                                <div class="size-10 rounded-xl bg-navy text-primary flex items-center justify-center shadow-xs shrink-0">
                                    <Icon icon="ph:receipt-bold" class="text-xl" />
                                </div>
                                <h2 class="text-base font-black text-navy">{{ t('my_registration.summary', 'Ringkasan Pendaftaran') }}</h2>
                            </div>
                            <div class="p-6">
                                <!-- Selected Categories Receipt -->
                                <div v-if="form.category_ids.length > 0" class="space-y-3">
                                    <!-- Participant Types (only if fee_mode === per_type) -->
                                    <template v-if="event.fee_mode === 'per_type'">
                                        <span class="text-xs font-black text-gray-400 tracking-widest block">{{ t('my_registration.participant_types') }}</span>
                                        <div v-for="type in form.participant_types" :key="type"
                                            class="flex items-center justify-between gap-2">
                                            <div class="flex items-center gap-2 min-w-0">
                                                <div class="size-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Icon icon="ph:user-bold" class="text-navy text-xs" />
                                                </div>
                                                <span class="text-xs font-bold text-navy capitalize">{{ type.replace('_', ' ') }}</span>
                                            </div>
                                            <span class="text-xs font-black text-navy tabular-nums shrink-0">{{ formatPrice(event.fee_per_type?.[type] || 0) }}</span>
                                        </div>
                                        <div class="h-px bg-gray-100 my-2"></div>
                                    </template>

                                    <span class="text-xs font-black text-gray-400 tracking-widest block">{{ t('my_registration.selected_categories') }}</span>
                                    <div v-for="catId in form.category_ids" :key="catId"
                                        class="flex items-center justify-between gap-2">
                                        <div class="flex items-center gap-2 min-w-0">
                                            <div class="size-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <Icon icon="ph:check-bold" class="text-navy text-xs" />
                                            </div>
                                            <span class="text-xs font-medium text-navy truncate">{{ getCategoryName(catId) }}</span>
                                        </div>
                                        <span v-if="event.fee_mode !== 'per_type'" class="text-xs font-black text-navy tabular-nums shrink-0">{{ formatPrice(getFeeForCategory(catId)) }}</span>
                                        <span v-else class="text-xs text-gray-400 shrink-0 capitalize">Included</span>
                                    </div>
                                </div>
                                <div v-else class="py-4 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                                    <Icon icon="ph:tag-light" class="text-3xl text-slate-300 mb-1 mx-auto" />
                                    <div class="text-xs text-slate-400 font-bold tracking-wider">{{ t('my_registration.no_categories_selected', 'Belum ada kategori yang dipilih') }}</div>
                                </div>
                                <div class="pt-4 border-t border-gray-100 space-y-1.5 mt-4">
                                    <div class="flex items-center justify-between text-sm">
                                        <span class="text-gray-500">{{ form.category_ids.length }} {{ form.category_ids.length > 1 ? 'categories' : 'category' }}</span>
                                        <span class="font-bold text-navy capitalize">
                                            {{ event.fee_mode === 'per_type' ? form.participant_types.map(t => t.replace('_', ' ')).join(', ') : 'per category' }}
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <span class="font-black text-navy">{{ t('my_registration.total') }}</span>
                                        <span class="text-2xl font-black text-navy tabular-nums">{{ formatPrice(totalFee) }}</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <!-- RIGHT COLUMN — Payment + CTA (sticky) -->
                    <div class="lg:col-span-2 lg:sticky lg:top-24 space-y-5">

                        <!-- Combined Payment Methods Card (Modernized UI) -->
                        <section class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                            <!-- Header -->
                            <div class="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="size-10 rounded-xl bg-navy text-primary flex items-center justify-center shadow-xs shrink-0">
                                        <Icon icon="ph:credit-card-bold" class="text-xl" />
                                    </div>
                                    <div>
                                        <h2 class="text-base font-black text-navy">{{ t('my_registration.payment_methods', 'Metode Pembayaran') }}</h2>
                                        <div class="text-xs text-slate-400 font-medium">{{ t('my_registration.payment_methods_desc', 'Pilih cara pembayaran pendaftaran') }}</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Tagihan</span>
                                    <span class="text-base font-black text-navy tabular-nums">{{ formatPrice(totalFee) }}</span>
                                </div>
                            </div>

                            <!-- Segmented Pill Tab Switcher -->
                            <div class="p-4 sm:p-5 pb-0">
                                <div class="bg-slate-100/80 p-1 rounded-2xl flex gap-1 border border-slate-200/60">
                                    <button type="button"
                                        @click="form.payment_type = 'online'; form.manual_method_id = ''"
                                        :class="form.payment_type === 'online' ? 'bg-white text-navy font-black shadow-xs' : 'text-slate-500 hover:text-navy font-bold'"
                                        class="flex-1 py-2.5 px-3 text-center rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
                                        <Icon icon="ph:lightning-bold" class="text-base" :class="form.payment_type === 'online' ? 'text-primary' : 'text-slate-400'" />
                                        <span>{{ t('my_registration.online_payment', 'Pembayaran Online') }}</span>
                                    </button>
                                    <button v-if="orgManualMethods.length > 0 || paymentMethods.length > 0"
                                        type="button"
                                        @click="form.payment_type = 'manual'; form.online_channel = ''"
                                        :class="form.payment_type === 'manual' ? 'bg-white text-navy font-black shadow-xs' : 'text-slate-500 hover:text-navy font-bold'"
                                        class="flex-1 py-2.5 px-3 text-center rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
                                        <Icon icon="ph:bank-bold" class="text-base" :class="form.payment_type === 'manual' ? 'text-primary' : 'text-slate-400'" />
                                        <span>{{ t('my_registration.manual_transfer', 'Transfer Manual') }}</span>
                                    </button>
                                </div>
                            </div>

                            <div class="p-4 sm:p-5 pt-3">
                                <!-- Tab Content 1: Online Payment (Unified Mayar Gateway Card) -->
                                <div v-if="form.payment_type === 'online'" class="space-y-3">
                                    <div class="p-4 sm:p-5 rounded-2xl border-2 border-primary/60 bg-gradient-to-br from-amber-500/10 via-amber-50/60 to-primary/15 space-y-2.5 shadow-2xs">
                                        <div class="flex items-start justify-between gap-3">
                                            <div class="flex items-center gap-3">
                                                <div class="size-10 rounded-xl bg-navy text-primary flex items-center justify-center shrink-0 shadow-xs">
                                                    <Icon icon="ph:shield-check-bold" class="text-xl" />
                                                </div>
                                                <div>
                                                    <div class="font-black text-navy text-sm flex items-center gap-2">
                                                        <span>{{ t('my_registration.mayar_gateway_name', 'Mayar Payment Gateway') }}</span>
                                                        <span class="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">{{ t('my_registration.mayar_instant_secure', 'Instan & Otomatis') }}</span>
                                                    </div>
                                                    <div class="text-[11px] text-slate-500 font-medium">
                                                        QRIS · Virtual Account · Kartu Kredit (International)
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="size-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                                <Icon icon="ph:check-bold" class="text-navy text-xs" />
                                            </div>
                                        </div>

                                        <div class="text-xs text-slate-600 font-medium leading-relaxed">
                                            {{ t('my_registration.mayar_supported_desc', 'Bayar instan via QRIS, Virtual Account bank, atau Kartu Kredit/Debit internasional (Visa, Mastercard, JCB). Terverifikasi otomatis.') }}
                                        </div>

                                        <!-- 3 Concise High-Level Chips -->
                                        <div class="pt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-slate-700">
                                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200/80 shadow-2xs flex items-center gap-1">
                                                <Icon icon="ph:qr-code-bold" class="text-xs text-navy" />
                                                {{ t('my_registration.tag_qris', 'QRIS (E-Wallet & M-Banking)') }}
                                            </span>
                                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200/80 shadow-2xs flex items-center gap-1">
                                                <Icon icon="ph:bank-bold" class="text-xs text-navy" />
                                                {{ t('my_registration.tag_va', 'Virtual Account (Semua Bank)') }}
                                            </span>
                                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200/80 shadow-2xs flex items-center gap-1">
                                                <Icon icon="ph:credit-card-bold" class="text-xs text-navy" />
                                                {{ t('my_registration.tag_cc', 'Kartu Kredit / Debit (International)') }}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium px-1">
                                        <Icon icon="ph:lock-key-bold" class="text-emerald-500 text-sm shrink-0" />
                                        <span>{{ t('my_registration.ssl_encryption', 'Enkripsi 256-bit SSL') }}</span>
                                    </div>
                                </div>

                                <!-- Tab Content 2: Manual Transfer -->
                                <div v-if="form.payment_type === 'manual'" class="space-y-3">
                                    <div v-if="orgManualMethods.length === 0"
                                        class="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                                        <Icon icon="ph:credit-card-light" class="text-3xl text-slate-300 mb-1.5 mx-auto" />
                                        <div class="text-xs text-navy font-black">Transfer Manual Tidak Tersedia</div>
                                        <div class="text-xs text-slate-400 mt-1">Event ini belum mengatur rekening bank manual. Silakan gunakan opsi Pembayaran Online.</div>
                                    </div>
                                    <div v-else v-for="method in orgManualMethods"
                                        :key="method.uuid || method.account_number"
                                        @click="form.manual_method_id = (method.uuid || method.account_number); form.payment_type = 'manual'; form.online_channel = ''"
                                        class="flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all"
                                        :class="form.manual_method_id === (method.uuid || method.account_number)
                                            ? 'border-primary bg-primary/5 shadow-xs'
                                            : 'border-slate-100 hover:border-slate-200 bg-white'">
                                        <div class="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden p-1.5 shadow-2xs">
                                            <img v-if="getPaymentMethodImage(method.bank_name || method.payment_method)"
                                                :src="getPaymentMethodImage(method.bank_name || method.payment_method)"
                                                class="w-full h-full object-contain" />
                                            <Icon v-else icon="ph:bank-bold" class="text-xl text-navy" />
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="text-sm font-black text-navy leading-tight">{{ method.custom_name || method.bank_name || method.payment_method }}</div>
                                            <div class="font-mono text-xs font-bold text-slate-600 mt-0.5">{{ method.account_number }}</div>
                                            <div class="text-xs text-slate-400">{{ method.account_name }}</div>
                                        </div>
                                        <div class="flex items-center gap-2 shrink-0">
                                            <button @click.stop="copyToClipboard(method.account_number)"
                                                class="p-2 rounded-xl bg-slate-100 hover:bg-primary hover:text-navy text-slate-500 transition-colors">
                                                <Icon icon="ph:copy-bold" class="text-xs" />
                                            </button>
                                            <div v-if="form.manual_method_id === (method.uuid || method.account_number)"
                                                class="size-5 rounded-full bg-primary flex items-center justify-center shadow-xs">
                                                <Icon icon="ph:check-bold" class="text-navy text-xs" />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Upload proof when manual selected -->
                                    <div v-if="form.manual_method_id" class="pt-3 border-t border-slate-100 space-y-3">
                                        <div class="space-y-1">
                                            <label class="text-xs font-black text-slate-500 uppercase tracking-wider block">{{ t('my_registration.sender_name', 'Nama Pengirim') }}</label>
                                            <input type="text" v-model="form.sender_name" 
                                                class="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary font-medium"
                                                :placeholder="t('my_registration.sender_name_placeholder', 'Nama pemilik rekening pengirim...')" />
                                        </div>
                                        <div class="text-xs font-black text-slate-500 uppercase tracking-wider">{{ t('my_registration.upload_proof', 'Bukti Transfer') }}</div>
                                        <div @click="triggerFileInput"
                                            class="border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-50"
                                            :class="proofFileUrl ? 'border-primary/50 bg-primary/5' : 'border-slate-200'">
                                            <input type="file" ref="proofInput" class="hidden" accept="image/*" @change="handleProofUpload" />
                                            <template v-if="uploadingProof">
                                                <Icon icon="ph:circle-notch-bold" class="text-2xl text-primary animate-spin mb-2" />
                                                <div class="text-xs text-slate-500 font-bold">Mengunggah bukti...</div>
                                            </template>
                                            <template v-else-if="proofFileUrl">
                                                <img :src="proofFileUrl" class="max-h-28 object-contain rounded-xl mb-2 border border-slate-100" />
                                                <div class="text-xs text-emerald-600 font-bold">Bukti berhasil diunggah ✓</div>
                                                <div class="text-[11px] text-slate-400">Klik untuk mengubah foto</div>
                                            </template>
                                            <template v-else>
                                                <Icon icon="ph:cloud-arrow-up-bold" class="text-2xl text-slate-400 mb-1.5" />
                                                <div class="text-xs text-slate-600 font-bold">Klik untuk mengunggah bukti transfer</div>
                                                <div class="text-[10px] text-slate-400">JPG, PNG (maks. 10MB)</div>
                                            </template>
                                        </div>
                                        <div v-if="uploadError" class="text-xs text-red-500 font-bold">{{ uploadError }}</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- CTA Submit -->
                        <div class="space-y-3">
                            <BaseButton @click="handleSubmit" :loading="loading" :disabled="!isFormValid" variant="navy"
                                size="lg" block>
                                {{ buttonText }}
                                <template #icon-right>
                                    <Icon icon="ph:arrow-right-bold" />
                                </template>
                            </BaseButton>
                            <span v-if="submitError" class="text-sm text-red-500 font-bold text-center block">{{
                                submitError }}</span>
                            <div class="text-xs text-slate-400 text-center font-medium leading-relaxed">
                                {{ t('my_registration.auto_confirm_note', 'Konfirmasi otomatis setelah pembayaran berhasil.') }}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </template>

        <!-- Partner Search Dialog -->
        <Teleport to="body">
        <div v-if="showPartnerDialog"
            class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            @click.self="showPartnerDialog = false">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                <!-- Header -->
                <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 class="text-base font-black text-navy">
                            {{ partnerDialogType === 'mixed_team' ? 'Add Partner' : 'Add Team Member' }}
                        </h3>
                        <div class="text-xs text-gray-400 mt-0.5">
                            {{ partnerDialogType === 'mixed_team' ? '1 partner required' : '2 members required' }}
                        </div>
                    </div>
                    <button @click="showPartnerDialog = false"
                        class="size-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                        <Icon icon="ph:x-bold" class="text-sm" />
                    </button>
                </div>

                <!-- Search input -->
                <div class="p-4 border-b border-gray-100">
                    <div class="relative">
                        <input v-model="partnerSearchQuery" type="text"
                            placeholder="Search by name, ID, or username..."
                            class="w-full h-11 px-4 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                            autofocus />
                        <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Icon v-if="partnerSearchLoading" icon="ph:circle-notch-bold"
                            class="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary animate-spin" />
                    </div>
                </div>

                <!-- Results -->
                <div class="max-h-72 overflow-y-auto">
                    <div v-if="partnerSearchQuery.length < 2" class="py-10 text-center text-gray-400">
                        <Icon icon="ph:magnifying-glass" class="text-3xl mx-auto mb-2 opacity-30" />
                        <div class="text-xs font-bold">Type at least 2 characters to search</div>
                    </div>
                    <div v-else-if="partnerSearchResults.length === 0 && !partnerSearchLoading" class="py-10 text-center text-gray-400">
                        <Icon icon="ph:user-slash" class="text-3xl mx-auto mb-2 opacity-30" />
                        <div class="text-xs font-bold">No archers found</div>
                    </div>
                    <div v-else class="divide-y divide-gray-50">
                        <div v-for="archer in partnerSearchResults" :key="archer.uuid || archer.id"
                            @click="addPartner(archer)"
                            class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                            :class="getPartnersForCategory(partnerDialogCategoryId).some(p => (p.uuid || p.id) === (archer.uuid || archer.id)) ? 'opacity-40 pointer-events-none' : ''">
                            <img :src="archer.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(archer.full_name || 'A')}&background=1a2744&color=f5c842&size=40`"
                                class="size-10 rounded-full object-cover shrink-0 border border-gray-100" />
                            <div class="flex-1 min-w-0">
                                <div class="text-sm font-black text-navy truncate">{{ archer.full_name }}</div>
                                <div class="text-xs text-gray-400 font-mono">{{ archer.id }}</div>
                                <div v-if="archer.club_name" class="text-xs text-gray-400">{{ archer.club_name }}</div>
                            </div>
                            <div v-if="getPartnersForCategory(partnerDialogCategoryId).some(p => (p.uuid || p.id) === (archer.uuid || archer.id))"
                                class="size-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <Icon icon="ph:check-bold" class="text-green-600 text-xs" />
                            </div>
                            <Icon v-else icon="ph:plus-circle-bold" class="text-primary text-xl shrink-0" />
                        </div>
                    </div>
                </div>

                <!-- Current partners -->
                <div v-if="partnerDialogCategoryId && getPartnersForCategory(partnerDialogCategoryId).length > 0"
                    class="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                    <div class="text-xs font-black text-gray-400 tracking-widest mb-2 ">Added</div>
                    <div class="space-y-1.5">
                        <div v-for="partner in getPartnersForCategory(partnerDialogCategoryId)" :key="partner.uuid || partner.id"
                            class="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-100">
                            <img :src="partner.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.full_name || 'A')}&background=1a2744&color=f5c842&size=32`"
                                class="size-6 rounded-full object-cover shrink-0" />
                            <span class="text-xs font-bold text-navy flex-1 truncate">{{ partner.full_name }}</span>
                            <button @click="removePartner(partnerDialogCategoryId, partner.uuid || partner.id)"
                                class="p-0.5 text-gray-400 hover:text-red-500 transition-colors">
                                <Icon icon="ph:x-bold" class="text-xs" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Done button -->
                <div class="px-4 py-4 border-t border-gray-100">
                    <BaseButton variant="primary" block @click="showPartnerDialog = false">
                        Done
                    </BaseButton>
                </div>
            </div>
        </div>
    </Teleport>
    </div>
</template>

<script setup>
definePageMeta({ layout: 'landing' })

import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import { usePayment } from '~/composables/usePayment'
import { useImageOrDefault } from '~/composables/useImageHelper'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import { Icon } from '@iconify/vue'
import { useDateFormat } from '@vueuse/core'

const { t } = useI18n()
useHead({ title: computed(() => t('event.register_title', 'Register for Event') + ' - ArcheryHub') })

const route = useRoute()
const router = useRouter()
const slug = route.params.slug
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()

const { user, isLoggedIn, archerProfile: globalArcherProfile } = useAuth()
const { upload, put, post } = useApi()
const payment = usePayment()

// ─── DATA FETCHING ────────────────────────────────────────────────────────────
const { data, pending, error: fetchError, refresh } = await useAsyncData(`event-register-${slug}`, async () => {
    const token = useCookie('auth_token').value
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
    const fetchOptions = { headers, credentials: 'include' }

    try {
        const eventResponse = await $fetch(`${apiBaseUrl}/events/${slug}`)
        if (!eventResponse) return null

        const eventId = eventResponse.uuid || eventResponse.id

        const [categoriesResponse, bowTypesRes, citiesRes, profileResponse, participantsResponse, channelsRes, myRegistrationRes] = await Promise.all([
            $fetch(`${apiBaseUrl}/events/${slug}/categories`).catch(() => ({ events: [] })),
            $fetch(`${apiBaseUrl}/bow-types`).catch(() => ({ bow_types: [] })),
            $fetch(`${apiBaseUrl}/cities`).catch(() => ({ data: [] })),
            token ? $fetch(`${apiBaseUrl}/archer/me`, fetchOptions).catch(() => null) : Promise.resolve(null),
            $fetch(`${apiBaseUrl}/events/${slug}/participants?limit=2000`).catch(() => ({ participants: [] })),
            $fetch(`${apiBaseUrl}/payment/channels`).catch(() => []),
            token ? $fetch(`${apiBaseUrl}/events/${slug}/participants/me`, fetchOptions).catch(() => null) : Promise.resolve(null)
        ])

        const formatDate = (d) => d ? useDateFormat(d, 'DD MMM YYYY', { locales: 'en-US' }).value : ''

        // Parse fee settings from page_settings
        let pageSettings = {}
        try {
            pageSettings = typeof eventResponse.page_settings_raw === 'string'
                ? JSON.parse(eventResponse.page_settings_raw)
                : (eventResponse.page_settings_raw || eventResponse.page_settings || {})
        } catch (e) {}

        // fetch event payment methods
        let paymentMethodsData = []
        if (eventId) {
            try {
                const pmRes = await $fetch(`${apiBaseUrl}/events/${eventId}/payment-methods`, fetchOptions).catch(() => [])
                paymentMethodsData = (Array.isArray(pmRes) ? pmRes : pmRes?.data || []).filter(m => m.is_active !== false)
            } catch (e) {
                console.error('failed to fetch event payment methods:', e)
            }
        }
        const orgManualMethods = paymentMethodsData

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
            // Fee mode settings
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
            } catch (e) { }
        }


        const categoriesData = (categoriesResponse.events || categoriesResponse.categories || []).map(cat => ({
            id: cat.id || cat.uuid,
            name: `${cat.division_name || cat.division || ''} - ${cat.category_name || cat.category || ''} ${cat.event_type_name ? '- ' + cat.event_type_name : ''} ${cat.gender_division_name ? '- ' + cat.gender_division_name : ''}`.trim(),
            event_type_name: cat.event_type_name || ''
        }))

        return {
            isLoggedIn: !!token || !!archerProfileData,
            event: eventData,
            categories: categoriesData,
            archerProfile: archerProfileData,
            paymentMethods: paymentMethodsData,
            orgManualMethods: orgManualMethods,
            bowTypes: (bowTypesRes.bow_types || []).map(b => ({ title: b.name, value: b.code })),
            cities: (citiesRes.data || []).map(c => ({ title: c.name, value: c.name })),
            participants: participantsResponse?.participants || [],
            myRegistration: myRegistrationRes,
            onlineChannels: (Array.isArray(channelsRes) ? channelsRes : channelsRes?.data || [])
                .filter(ch => ch.active !== false)
                .map(ch => ({
                    code: ch.code,
                    label: ch.name,
                    type: ch.group,
                    icon: ch.icon_url
                }))
        }
    } catch (err) {
        throw createError({ statusCode: 500, message: 'Failed to load registration data' })
    }
})

// ─── STATE ────────────────────────────────────────────────────────────────────
const loading = ref(false)
const isClientPreparing = ref(true)
const submitError = ref('')
const registrationSuccess = ref(false)
const manualCancelled = ref(false)

const existingRegistration = computed(() => {
    if (manualCancelled.value) return null
    if (data.value?.myRegistration) {
        return data.value.myRegistration
    }
    if (isLoggedIn.value && user.value && data.value?.participants) {
        const userId = user.value.id
        const userEmail = user.value.email
        const matched = data.value.participants.filter(p =>
            (p.archer_id && String(p.archer_id) === String(userId)) ||
            (p.user_id && String(p.user_id) === String(userId)) ||
            (p.email && p.email === userEmail) ||
            (p.athlete_code && p.athlete_code === user.value.athlete_code)
        )
        if (matched.length > 0) {
            const first = matched[0]
            return {
                full_name: first.full_name || first.name || user.value.name || 'Pemanah',
                club_name: first.club_name || null,
                payment_status: first.payment_status || 'unpaid',
                payment_amount: matched.reduce((sum, item) => sum + (Number(item.payment_amount) || 0), 0),
                categories: matched.map(m => ({
                    id: m.id || m.uuid,
                    division_name: m.division_name || '',
                    category_name: m.category_name || m.name || '',
                    gender_division_name: m.gender_division_name || '',
                    target_name: m.target_name || ''
                })),
                transaction: first.transaction_reference ? { reference: first.transaction_reference } : null
            }
        }
    }
    return null
})

const isCancellingReg = ref(false)
const channelInstructionsLoading = ref(null)
const channelInstructionsCache = ref({})
const activeInstructionTabByChannel = ref({}) // { [channelCode]: tabIndex } for multi-platform tabs
const paymentResult = ref(null)
const redirectCountdown = ref(4)
const proofInput = ref(null)
const paymentPreviews = ref([])
const categorySearch = ref('')
const uploadingProof = ref(false)
const proofFileUrl = ref('')
const uploadError = ref('')

const handleCancelRegistration = async () => {
    if (!confirm('Apakah Anda yakin ingin membatalkan pendaftaran ini? Anda dapat mendaftar ulang setelah pendaftaran dibatalkan.')) return
    isCancellingReg.value = true
    try {
        const token = useCookie('auth_token').value
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
        await $fetch(`${apiBaseUrl}/events/${slug}/participants/me`, {
            method: 'DELETE',
            headers,
            credentials: 'include'
        })
        manualCancelled.value = true
        if (data.value) data.value.myRegistration = null
        await refresh()
    } catch (err) {
        console.error('Gagal membatalkan pendaftaran:', err)
        alert(err.data?.error || err.message || 'Gagal membatalkan pendaftaran. Silakan coba lagi.')
    } finally {
        isCancellingReg.value = false
    }
}



const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text).catch(() => { })
}

const form = ref({
    category_ids: [],
    payment_amount: 0,
    payment_type: 'online',
    online_channel: '',
    participant_type: 'individual',  // legacy single value
    participant_types: ['individual'],
    manual_method_id: '',
    sender_name: '',
    // Team/mixed partners: { [categoryId]: { team: [archer], mixed: [archer] } }
    team_partners: {}
})

// Partner search state
const partnerSearchQuery = ref('')
const partnerSearchResults = ref([])
const partnerSearchLoading = ref(false)
const showPartnerDialog = ref(false)
const partnerDialogCategoryId = ref(null)
const partnerDialogType = ref('team') // 'team' (need 2 more) | 'mixed_team' (need 1 more)

const searchPartners = async () => {
    const q = partnerSearchQuery.value.trim()
    if (!q || q.length < 2) { partnerSearchResults.value = []; return }
    partnerSearchLoading.value = true
    try {
        const res = await $fetch(`${apiBaseUrl}/archers?search=${encodeURIComponent(q)}&limit=10`)
        const list = res?.data || res?.archers || res || []
        // Exclude self
        const selfId = archerProfile.value?.uuid || archerProfile.value?.id
        partnerSearchResults.value = list.filter(a => (a.uuid || a.id) !== selfId)
    } catch (e) {
        partnerSearchResults.value = []
    } finally {
        partnerSearchLoading.value = false
    }
}

const openPartnerDialog = (categoryId) => {
    partnerDialogCategoryId.value = categoryId
    const category = categories.value.find(c => c.id === categoryId)
    partnerDialogType.value = category ? getCategoryType(category) : 'team'
    partnerSearchQuery.value = ''
    partnerSearchResults.value = []
    showPartnerDialog.value = true
}

const getPartnersForCategory = (categoryId) => {
    return form.value.team_partners[categoryId] || []
}

const addPartner = (archer) => {
    const catId = partnerDialogCategoryId.value
    if (!catId) return
    const maxPartners = partnerDialogType.value === 'mixed_team' ? 1 : 2
    const current = form.value.team_partners[catId] || []
    const alreadyAdded = current.some(p => (p.uuid || p.id) === (archer.uuid || archer.id))
    if (alreadyAdded || current.length >= maxPartners) return
    form.value.team_partners = {
        ...form.value.team_partners,
        [catId]: [...current, archer]
    }
}

const removePartner = (categoryId, archerId) => {
    const current = form.value.team_partners[categoryId] || []
    form.value.team_partners = {
        ...form.value.team_partners,
        [categoryId]: current.filter(p => (p.uuid || p.id) !== archerId)
    }
}

const participantType = ref('individual')

watch(participantType, (newVal) => {
    form.value.participant_type = newVal
    form.value.participant_types = [newVal]
    // Clean up selected categories that are no longer in selected types
    form.value.category_ids = form.value.category_ids.filter(catId => {
        const category = categories.value.find(c => c.id === catId)
        if (!category) return false
        const catType = getCategoryType(category)
        return form.value.participant_types.includes(catType)
    })
}, { immediate: true })

const getCategoryType = (category) => {
    const typeName = (category?.event_type_name || '').toLowerCase()
    if (typeName.includes('mixed')) return 'mixed_team'
    if (typeName.includes('team')) return 'team'
    return 'individual'
}

const isPartnerComplete = (categoryId) => {
    const category = categories.value.find(c => c.id === categoryId)
    const type = category ? getCategoryType(category) : 'individual'
    if (type === 'individual') return true
    if (type === 'team') return true
    const partners = getPartnersForCategory(categoryId)
    if (type === 'mixed_team') return partners.length >= 1
    return true
}

// Debounce partner search
let partnerSearchTimer = null
watch(partnerSearchQuery, () => {
    clearTimeout(partnerSearchTimer)
    partnerSearchTimer = setTimeout(searchPartners, 300)
})

const profileForm = ref({
    full_name: '',
    gender: '',
    date_of_birth: '',
    country: '',
    club_name: '',
    club_id: null,
    bow_type: '',
    experience_years: 0
})

const genderOptions = [
    { title: 'Male', value: 'male' },
    { title: 'Female', value: 'female' }
]

const countries = ref([
    { title: 'Indonesia', value: 'Indonesia', icon: 'circle-flags:id' },
    { title: 'Malaysia', value: 'Malaysia', icon: 'circle-flags:my' },
    { title: 'Singapore', value: 'Singapore', icon: 'circle-flags:sg' },
    { title: 'Thailand', value: 'Thailand', icon: 'circle-flags:th' },
    { title: 'Philippines', value: 'Philippines', icon: 'circle-flags:ph' },
    { title: 'Vietnam', value: 'Vietnam', icon: 'circle-flags:vn' },
    { title: 'Australia', value: 'Australia', icon: 'circle-flags:au' },
    { title: 'Japan', value: 'Japan', icon: 'circle-flags:jp' },
    { title: 'South Korea', value: 'South Korea', icon: 'circle-flags:kr' },
    { title: 'United Kingdom', value: 'United Kingdom', icon: 'circle-flags:gb' },
    { title: 'United States', value: 'United States', icon: 'circle-flags:us' }
])

const onlineChannels = computed(() => data.value?.onlineChannels || [])
const showPageLoader = computed(() => pending.value || isClientPreparing.value)

// No auto-select: user must explicitly choose payment method

// ─── COMPUTED ─────────────────────────────────────────────────────────────────
const event = computed(() => data.value?.event || { name: '', date: '', location: '', image: '', description: '', registration_fee: 0, fee_mode: 'per_type', fee_per_type: { individual: 0, team: 0, mixed_team: 0 }, fee_per_category: {} })
const categories = computed(() => data.value?.categories || [])
const bowTypeOptions = computed(() => data.value?.bowTypes || [])
const cityOptions = computed(() => data.value?.cities || [])
const paymentMethods = computed(() => data.value?.paymentMethods || [])
const orgManualMethods = computed(() => data.value?.orgManualMethods || [])
const archerProfile = computed(() => globalArcherProfile.value || data.value?.archerProfile)

const activeParticipantTypes = computed(() => {
    const list = []
    const fees = event.value.fee_per_type || {}
    
    if (fees.individual !== undefined && fees.individual !== null && fees.individual !== '' && Number(fees.individual) > 0) {
        list.push({ value: 'individual', label: 'Individual', icon: 'ph:user-bold', fee: Number(fees.individual) })
    }
    if (fees.team !== undefined && fees.team !== null && fees.team !== '' && Number(fees.team) > 0) {
        list.push({ value: 'team', label: 'Team', icon: 'ph:users-bold', fee: Number(fees.team) })
    }
    if (fees.mixed_team !== undefined && fees.mixed_team !== null && fees.mixed_team !== '' && Number(fees.mixed_team) > 0) {
        list.push({ value: 'mixed_team', label: 'Mixed Team', icon: 'ph:users-three-bold', fee: Number(fees.mixed_team) })
    }
    return list
})

const filteredCategories = computed(() => {
    let list = categories.value
    if (event.value.fee_mode === 'per_type') {
        const types = form.value.participant_types || []
        list = list.filter(c => types.includes(getCategoryType(c)))
    }
    if (!categorySearch.value) return list
    const s = categorySearch.value.toLowerCase()
    return list.filter(c => c.name.toLowerCase().includes(s))
})

const isArcher = computed(() => {
    const t = user.value?.type || user.value?.role || user.value?.user_type
    return t === 'archer'
})

const userDisplay = computed(() => ({
    name: archerProfile.value?.full_name || user.value?.full_name || '',
    email: archerProfile.value?.email || user.value?.email || '',
}))

// Fee per category helper
const getFeeForCategory = (catId) => {
    const ev = event.value
    if (ev.fee_mode === 'per_category') {
        return ev.fee_per_category?.[catId] ?? ev.registration_fee ?? 0
    }
    // per_type mode
    const category = categories.value.find(c => c.id === catId)
    const type = category ? getCategoryType(category) : 'individual'
    return ev.fee_per_type?.[type] ?? ev.registration_fee ?? 0
}

const totalFee = computed(() => {
    if (event.value.fee_mode === 'per_type') {
        const types = form.value.participant_types || []
        const fees = event.value.fee_per_type || {}
        return types.reduce((sum, type) => {
            const fee = fees[type] ?? 0
            return sum + Number(fee)
        }, 0)
    }
    return form.value.category_ids.reduce((sum, catId) => sum + getFeeForCategory(catId), 0)
})

const formatPrice = (val) => {
    const currency = event.value?.currency || 'IDR'
    if (currency === 'IDR') {
        return `Rp ${(val || 0).toLocaleString('id-ID')}`
    } else {
        const formatter = new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-GB', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        })
        return formatter.format(val || 0)
    }
}

const isAlreadyRegistered = computed(() => {
    if (!isLoggedIn.value || !user.value || !data.value?.participants) return false
    const userId = user.value.id
    const userEmail = user.value.email
    return data.value.participants.some(p =>
        (p.archer_id && String(p.archer_id) === String(userId)) ||
        (p.user_id && String(p.user_id) === String(userId)) ||
        (p.email && p.email === userEmail) ||
        (p.athlete_code && p.athlete_code === user.value.athlete_code)
    )
})

const registrationStatus = computed(() => {
    const start = event.value.registration_start ? new Date(event.value.registration_start) : null
    const deadline = event.value.registration_deadline ? new Date(event.value.registration_deadline) : null
    const now = new Date()

    if (start && now < start) {
        return 'not_started'
    }
    if (deadline && now > deadline) {
        return 'closed'
    }
    return 'open'
})

const formatDateTime = (d) => {
    if (!d) return ''
    return useDateFormat(d, 'DD MMM YYYY, HH:mm', { locales: 'id-ID' }).value
}

const isFormValid = computed(() => {
    const categoriesSelected = form.value.category_ids.length > 0
    const archerProfileExists = !!archerProfile.value
    const profileComplete = !!profileForm.value.full_name && !!profileForm.value.gender && !!profileForm.value.date_of_birth && !!profileForm.value.bow_type
    // For team/mixed: all selected categories must have complete partners
    const partnersComplete = form.value.category_ids.every(catId => {
        const category = categories.value.find(c => c.id === catId)
        if (!category) return true
        const catType = getCategoryType(category)
        if (event.value.fee_mode === 'per_type' && catType !== 'individual') {
            return isPartnerComplete(catId)
        }
        return true
    })
    // Payment: either online channel selected OR manual method + proof uploaded
    const paymentSelected = totalFee.value > 0
        ? (form.value.payment_type === 'online' ? !!form.value.online_channel : (!!form.value.manual_method_id && !!proofFileUrl.value))
        : true
    return categoriesSelected && archerProfileExists && profileComplete && partnersComplete && paymentSelected && registrationStatus.value === 'open'
})

const buttonText = computed(() => {
    if (form.value.payment_type === 'online' && (form.value.payment_amount || 0) > 0) {
        return t('my_registration.btn_pay_now', 'Bayar Sekarang via Mayar')
    }
    return t('my_registration.btn_register_now', 'Daftar Sekarang')
})

const loginUrl = computed(() => `/auth/login?redirect=${encodeURIComponent(route.fullPath)}`)
const registerUrl = computed(() => `/auth/register?type=archer&redirect=${encodeURIComponent(route.fullPath)}`)

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const displayValue = (v) => v || 'TBA'

const getCategoryName = (id) => categories.value.find(c => c.id === id)?.name || id

const indonesianPaymentMethods = [
    { value: 'BCA', image: '/payment-method/bca.png' },
    { value: 'Mandiri', image: '/payment-method/mandiri.png' },
    { value: 'BNI', image: '/payment-method/bni.png' },
    { value: 'BRI', image: '/payment-method/bri.png' },
    { value: 'BSI', image: '/payment-method/bsi.png' },
    { value: 'Danamon', image: '/payment-method/danamon.png' },
    { value: 'GoPay', image: '/payment-method/gopay.png' },
    { value: 'OVO', image: '/payment-method/ovo.png' },
    { value: 'DANA', image: '/payment-method/dana.png' },
]

const getPaymentMethodImage = (bankName) => {
    if (!bankName) return null
    const m = indonesianPaymentMethods.find(m =>
        m.value.toLowerCase() === bankName.toLowerCase() ||
        bankName.toLowerCase().includes(m.value.toLowerCase())
    )
    return m ? m.image : null
}

const getChannelIcon = (ch) => {
    const localIcon = getPaymentMethodImage(ch.label)
    if (localIcon) return localIcon
    return ch.icon || ''
}

// Online channel expansion panel: fetch & show payment instructions
const selectOnlineChannel = async (code) => {
    form.value.online_channel = code
    if (channelInstructionsCache.value[code]) return
    channelInstructionsLoading.value = code
    try {
        const data = await payment.getInstruction(code)
        const groups = Array.isArray(data)
            ? data.map(g => ({ title: g.title || '', steps: Array.isArray(g.steps) ? g.steps : [] }))
            : []
        channelInstructionsCache.value = { ...channelInstructionsCache.value, [code]: groups }
    } catch {
        channelInstructionsCache.value = { ...channelInstructionsCache.value, [code]: [] }
    } finally {
        channelInstructionsLoading.value = null
    }
}

const channelInstructionGroups = (code) => {
    return channelInstructionsCache.value[code] || []
}

// Tab panel for multi-platform instructions (Internet Banking | Aplikasi BRImo)
const getActiveInstructionTab = (code) => {
    return activeInstructionTabByChannel.value[code] ?? 0
}

const setActiveInstructionTab = (code, index) => {
    activeInstructionTabByChannel.value = { ...activeInstructionTabByChannel.value, [code]: index }
}

// ─── WATCHERS ─────────────────────────────────────────────────────────────────
watch(() => archerProfile.value, (profile) => {
    if (profile) {
        profileForm.value = {
            full_name: profile.full_name || profile.name || '',
            gender: profile.gender || '',
            date_of_birth: profile.date_of_birth ? new Date(profile.date_of_birth).toISOString().split('T')[0] : '',
            country: profile.country || 'Indonesia',
            club_name: profile.club_name || '',
            club_id: profile.club_id || null,
            bow_type: profile.bow_type || '',
            experience_years: profile.experience_years || 0
        }
    }
}, { immediate: true })

watch(totalFee, (val) => { form.value.payment_amount = val }, { immediate: true })

watch(activeParticipantTypes, (types) => {
    if (types.length > 0) {
        const activeVals = types.map(t => t.value)
        const hasActiveSelected = form.value.participant_types.some(t => activeVals.includes(t))
        if (!hasActiveSelected) {
            form.value.participant_types = [activeVals[0]]
            form.value.participant_type = activeVals[0]
        }
    }
}, { immediate: true })

watch(onlineChannels, (channels) => {
    if (channels && channels.length > 0 && !form.value.online_channel) {
        form.value.online_channel = channels[0].code
    }
}, { immediate: true })

watch(orgManualMethods, (methods) => {
    if (methods && methods.length > 0 && !form.value.manual_method_id) {
        form.value.manual_method_id = methods[0].id || methods[0].uuid
    }
}, { immediate: true })

// ─── METHODS ──────────────────────────────────────────────────────────────────
const toggleCategory = (id) => {
    const idx = form.value.category_ids.indexOf(id)
    idx === -1 ? form.value.category_ids.push(id) : form.value.category_ids.splice(idx, 1)
}


const triggerFileInput = () => {
    proofInput.value?.click()
}

const handleProofUpload = async (evt) => {
    const file = evt.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
        uploadError.value = 'file too large. maximum size is 10mb.'
        return
    }

    uploadingProof.value = true
    uploadError.value = ''
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('caption', `proof-${slug}-${Date.now()}`)

        const res = await upload('/media/upload', formData)
        proofFileUrl.value = res.url || res.URL || ''
    } catch (err) {
        uploadError.value = err.response?.data?.error || err.data?.error || err.message || 'failed to upload image.'
    } finally {
        uploadingProof.value = false
    }
}

const handleSubmit = async () => {
    if (!isFormValid.value) return
    loading.value = true
    submitError.value = ''
    try {
        if (archerProfile.value?.uuid || archerProfile.value?.id) {
            const profileId = archerProfile.value.uuid || archerProfile.value.id
            await put(`/archers/${profileId}`, {
                full_name: profileForm.value.full_name,
                gender: profileForm.value.gender,
                date_of_birth: profileForm.value.date_of_birth,
                country: profileForm.value.country,
                bow_type: profileForm.value.bow_type,
                club_id: profileForm.value.club_id
            })
        }

        const athleteId = archerProfile.value?.uuid || archerProfile.value?.archer_id || archerProfile.value?.id
        if (!athleteId) { submitError.value = 'Archer profile is incomplete. Please log in again.'; return }

        const payload = {
            athlete_id: athleteId,
            event_category_ids: form.value.category_ids,
            payment_amount: form.value.payment_amount || 0,
            payment_type: form.value.payment_type,
            participant_type: form.value.participant_types && form.value.participant_types.length > 0
                ? form.value.participant_types[0]
                : (form.value.participant_type || 'individual'),
            team_partners: form.value.team_partners // { [categoryId]: [{ uuid, full_name }] }
        }

        const response = await post(`/events/${event.value.id}/participants`, payload)

        // create transaction
        const registrationId = response.registration_id || response.uuid
        const selectedChannel = form.value.payment_type === 'online' ? 'mayar' : 'manual'

        try {
            const payResult = await post('/payment/create', {
                type: 'registration',
                registration_id: registrationId,
                event_id: event.value.id,
                method: selectedChannel
            })
            paymentResult.value = payResult

            const ref = payResult?.reference || payResult?.data?.reference || payResult?.uuid || payResult?.payment?.reference

            if (!ref) {
                submitError.value = 'Registrasi berhasil, namun tidak menerima referensi transaksi.'
                return
            }

            // if manual, upload the proof url then redirect to status page
            if (form.value.payment_type === 'manual') {
                await post(`/payment/manual/${ref}/upload-proof`, {
                    proof_url: proofFileUrl.value,
                    sender_name: form.value.sender_name
                })
                registrationSuccess.value = true
                await nextTick()
                setTimeout(() => navigateTo(`/payment/status/${ref}`), 1000)
            } else {
                registrationSuccess.value = true
                await nextTick()
                setTimeout(() => navigateTo(`/payment/status/${ref}`), 800)
            }

        } catch (payErr) {
            console.error('Payment creation failed after registration:', payErr)
            submitError.value = payErr?.response?.data?.error || payErr?.data?.error || payErr?.message || 'Registrasi tersimpan, namun gagal membuat pembayaran.'
        }
    } catch (err) {
        submitError.value = err.response?.data?.error || err.data?.error || err.message || 'Failed to complete registration.'
    } finally {
        loading.value = false
    }
}

useSeoMeta({
    title: () => `Register ${event.value?.name || 'Event'} - Archeris.net`,
    description: () => `Confirm registration for ${event.value?.name || 'event'}`
})

onMounted(async () => {
    await nextTick()
    const token = useCookie('auth_token').value
    if (token) {
        try {
            await refresh()
        } catch (e) {}
    }
    isClientPreparing.value = false
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}
</style>

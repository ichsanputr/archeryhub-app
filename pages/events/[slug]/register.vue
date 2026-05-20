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

        <!-- Success -->
        <div v-else-if="registrationSuccess"
            class="fixed inset-0 bg-navy flex items-center justify-center z-50 overflow-hidden">
            <!-- Background subtle pattern -->
            <div class="absolute inset-0 opacity-5"
                style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 32px 32px;">
            </div>
            <!-- Glow -->
            <div
                class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl">
            </div>

            <div class="relative z-10 w-full max-w-md mx-4">
                <!-- Success Icon -->
                <div class="flex flex-col items-center mb-8">
                    <div class="relative mb-6">
                        <!-- Countdown ring (only for tripay checkout URL redirect) -->
                        <svg v-if="paymentResult?.checkout_url && paymentResult?.payment_method !== 'paddle'"
                            class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
                            <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.1)"
                                stroke-width="4" />
                            <circle cx="40" cy="40" r="36" fill="none" stroke="#f5c842" stroke-width="4"
                                stroke-linecap="round" :stroke-dasharray="226"
                                :stroke-dashoffset="226 * (1 - redirectCountdown / 4)"
                                class="transition-all duration-1000 ease-linear" />
                        </svg>
                        <div
                            class="size-20 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                            <Icon icon="ph:check-bold" class="text-4xl text-navy" />
                        </div>
                    </div>
                    <h1 class="text-2xl font-black text-white mb-2 text-center">Registration Successful!</h1>
                    <span class="text-white/50 text-sm font-medium text-center block">{{ event.name }}</span>
                </div>

                <!-- Online payment result box -->
                <div v-if="paymentResult"
                    class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 space-y-4 mb-6">
                    <!-- VA Number -->
                    <div v-if="paymentResult.pay_code">
                        <span class="text-[10px] font-black tracking-widest text-white/40 block mb-2">Virtual
                            Account</span>
                        <div class="flex items-center justify-between gap-3 bg-white/10 rounded-xl px-4 py-3">
                            <span class="font-mono font-black text-white text-xl tracking-widest">{{
                                paymentResult.pay_code }}</span>
                            <button @click="copyToClipboard(paymentResult.pay_code)"
                                class="p-2 rounded-lg bg-primary text-navy shrink-0">
                                <Icon icon="ph:copy-bold" class="text-sm" />
                            </button>
                        </div>
                    </div>
                    <!-- QR -->
                    <div v-if="paymentResult.qr_url" class="flex flex-col items-center bg-white rounded-xl p-4">
                        <span class="text-[10px] font-black tracking-widest text-gray-400 block mb-3">Scan QRIS</span>
                        <img :src="paymentResult.qr_url" class="w-40 h-40" />
                    </div>
                    <!-- Amount & method -->
                    <div class="flex items-center justify-between border-t border-white/10 pt-3">
                        <div>
                            <span class="text-[9px] text-white/40 font-black tracking-widest block">Total Amount</span>
                            <span class="font-black text-primary text-lg tabular-nums">{{ formatPrice(paymentResult.total_amount
                                || paymentResult.amount || 0) }}</span>
                        </div>
                        <div v-if="paymentResult.payment_method" class="text-right">
                            <span class="text-[9px] text-white/40 font-black tracking-widest block">Method</span>
                            <span class="text-white font-black text-sm">{{ paymentResult.payment_method }}</span>
                        </div>
                    </div>
                    <!-- Redirect notice (Tripay) -->
                    <div v-if="paymentResult.checkout_url && paymentResult.payment_method !== 'paddle'"
                        class="flex flex-col gap-3 bg-primary/10 border border-primary/20 rounded-xl p-4">
                        <div class="flex items-center gap-2.5">
                            <Icon icon="ph:info-bold" class="text-primary shrink-0" />
                            <span class="text-xs text-white/90 font-bold block">Action Required: Complete Payment</span>
                        </div>
                        <span class="text-[11px] text-white/70 font-medium block leading-relaxed">
                            Click the button below to proceed to the secure checkout page and complete your payment.
                        </span>
                        <a :href="paymentResult.checkout_url" target="_blank"
                            class="flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-navy font-black text-xs py-2.5 px-4 rounded-lg transition-colors">
                            <Icon icon="ph:arrow-square-out-bold" class="text-sm" />
                            Proceed to Payment Page
                        </a>
                    </div>
                    <!-- Paddle overlay notice -->
                    <div v-if="paymentResult.payment_method === 'paddle'"
                        class="flex items-center gap-2.5 bg-green-500/10 border border-green-400/20 rounded-xl p-3">
                        <Icon icon="ph:check-circle-bold" class="text-green-300 shrink-0" />
                        <span class="text-xs text-white/70 font-medium block">payment successful! your registration is complete.</span>
                    </div>
                    <!-- Manual payment proof uploaded notice -->
                    <div v-if="paymentResult.payment_method === 'manual'"
                        class="flex items-center gap-2.5 bg-amber-500/10 border border-amber-400/20 rounded-xl p-3">
                        <Icon icon="ph:clock-bold" class="text-amber-300 shrink-0" />
                        <span class="text-xs text-white/70 font-medium block">payment proof uploaded. the organizer will
                            verify your payment.</span>
                    </div>
                </div>


                <!-- Manual go to dashboard link (subtle) -->
                <span class="text-center block text-white/30 text-xs font-medium">
                    <NuxtLink to="/dashboard/archer/events"
                        class="hover:text-white/60 transition-colors underline underline-offset-4">View in Dashboard →
                    </NuxtLink>
                </span>
            </div>
        </div>

        <template v-else>
            <!-- Hero Header -->
            <div class="bg-navy relative overflow-hidden min-h-[220px] md:min-h-[280px] pt-20 flex items-end">
                <div class="absolute inset-0 z-0">
                    <img alt="Event Banner" class="w-full h-full object-cover object-center"
                        src="/hero-event-detail.jpeg" />
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
                        <Icon icon="ph:caret-right-bold" class="text-white/30 text-[10px]" />
                        <span class="text-white/60 text-xs font-bold tracking-widest">Registration</span>
                    </div>
                    <h1 class="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
                        Register: {{ event.name }}
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

            <!-- Already Registered -->
            <main v-if="isAlreadyRegistered" class="max-w-2xl mx-auto px-4 py-12 text-center">
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

            <!-- ─────────────────────────────────────────── -->
            <!-- MAIN 2-COLUMN LAYOUT                        -->
            <!-- ─────────────────────────────────────────── -->
            <main v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">

                    <!-- LEFT COLUMN — Archer Info + Category -->
                    <div class="lg:col-span-3 space-y-5">

                        <!-- Archer Profile Card -->
                        <section class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div
                                class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-3">
                                <div
                                    class="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-navy shadow-sm shrink-0">
                                    <Icon icon="ph:user-bold" class="text-lg" />
                                </div>
                                <h2 class="text-base font-black text-navy">Athlete Data</h2>
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
                                                class="text-[10px] text-navy font-black bg-gray-100 px-2 py-0.5 rounded-full tracking-wider">ID:
                                                {{ archerProfile.id }}</span>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <BaseInput v-model="profileForm.full_name" label="Full Name"
                                            placeholder="Full name" required icon="ph:user-bold" />
                                        <BaseSelect v-model="profileForm.gender" :items="genderOptions" label="Gender"
                                            placeholder="Select" required icon="ph:gender-intersex" />
                                        <BaseInput v-model="profileForm.date_of_birth" label="Date of Birth" type="date"
                                            required icon="ph:calendar-blank" />
                                        <BaseSelect v-model="profileForm.bow_type" :items="bowTypeOptions"
                                            label="Bow Type" placeholder="Select bow type" required
                                            icon="ph:target-bold" />
                                        <BaseInput v-model="profileForm.country" label="Country"
                                            placeholder="Country" icon="ph:globe-hemisphere-east-bold" />
                                        <BaseSelect v-model="profileForm.city" :items="cityOptions"
                                            label="City / Regency" placeholder="Select city" icon="ph:map-pin-bold"
                                            class="relative z-20" />
                                        <BaseInput v-model="profileForm.club_name" label="Club / Institution"
                                            icon="ph:users-bold" hint="Cannot be changed here" disabled readonly />
                                    </div>
                                    <div class="p-3.5 bg-primary/10 border border-primary/20 rounded-xl flex gap-2.5">
                                        <Icon icon="ph:info-bold" class="text-navy shrink-0 mt-0.5" />
                                        <span class="text-xs text-navy/80 font-medium leading-relaxed block">Please
                                            ensure the data is correct before proceeding with registration.</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Participant Type Selection (only when fee_mode === 'per_type') -->
                        <section v-if="event.fee_mode === 'per_type' && activeParticipantTypes.length > 0" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
                            <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-3">
                                <div class="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-navy shadow-sm shrink-0">
                                    <Icon icon="ph:users-three-bold" class="text-lg" />
                                </div>
                                <div>
                                    <h2 class="text-base font-black text-navy">Pilih Tipe Peserta</h2>
                                    <span class="text-[10px] text-gray-400 font-medium block">Can select multiple if the schedule allows</span>
                                </div>
                            </div>
                            <div class="p-6">
                                <div class="grid gap-2"
                                    :class="{
                                        'grid-cols-1 max-w-xs': activeParticipantTypes.length === 1,
                                        'grid-cols-2 max-w-md': activeParticipantTypes.length === 2,
                                        'grid-cols-3': activeParticipantTypes.length >= 3
                                    }">
                                    <button v-for="pt in activeParticipantTypes" :key="pt.value"
                                        type="button"
                                        @click="toggleParticipantType(pt.value)"
                                        :class="form.participant_types.includes(pt.value)
                                            ? 'border-primary bg-primary/5 text-navy'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300'"
                                        class="flex flex-col items-start gap-1 p-3 rounded-xl border-2 transition-all text-left w-full">
                                        <Icon :icon="pt.icon" class="text-lg" />
                                        <span class="text-[10px] font-black tracking-wide">{{ pt.label }}</span>
                                        <span class="text-[9px] font-bold text-navy tabular-nums">{{ formatPrice(pt.fee) }}</span>
                                    </button>
                                </div>
                            </div>
                        </section>

                        <!-- Category Selection -->
                        <section class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-3">
                                <div class="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-navy shadow-sm shrink-0">
                                    <Icon icon="ph:tag-bold" class="text-lg" />
                                </div>
                                <div>
                                    <h2 class="text-base font-black text-navy">Select Category</h2>
                                    <span class="text-[10px] text-gray-400 font-medium block">Can select multiple if the schedule allows</span>
                                </div>
                            </div>
                            <div class="p-6 space-y-4">

                                <!-- Category search -->
                                <div class="relative">
                                    <input v-model="categorySearch" type="text"
                                        placeholder="Search division or category..."
                                        class="w-full h-10 px-4 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" />
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

                                        <!-- Team partner section (per_type + team/mixed, when category is selected) -->
                                        <div v-if="form.category_ids.includes(category.id) && event.fee_mode === 'per_type' && getCategoryType(category) !== 'individual'"
                                            class="border-t border-primary/20 px-3.5 pb-3.5 pt-3 space-y-2"
                                            @click.stop>
                                            <div class="flex items-center justify-between">
                                                <div class="text-[10px] font-black text-gray-500 tracking-widest uppercase">
                                                    {{ getCategoryType(category) === 'mixed_team' ? 'Partner (1 Required)' : 'Team Members (2 Required)' }}
                                                </div>
                                                <button type="button"
                                                    @click="openPartnerDialog(category.id)"
                                                    :disabled="getPartnersForCategory(category.id).length >= (getCategoryType(category) === 'mixed_team' ? 1 : 2)"
                                                    class="text-[10px] font-black text-primary hover:text-primary/80 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1">
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
                                                    <span v-if="partner.id" class="text-[9px] text-gray-400 font-mono">{{ partner.id }}</span>
                                                    <button type="button" @click="removePartner(category.id, partner.uuid || partner.id)"
                                                        class="p-0.5 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                                                        <Icon icon="ph:x-bold" class="text-xs" />
                                                    </button>
                                                </div>
                                            </div>
                                            <!-- Empty state -->
                                            <div v-else class="text-[10px] text-gray-400 italic">
                                                no partners added yet
                                            </div>
                                            <!-- Incomplete warning -->
                                            <div v-if="!isPartnerComplete(category.id)"
                                                class="flex items-center gap-1.5 text-[10px] text-amber-600 font-bold">
                                                <Icon icon="ph:warning-bold" class="text-xs" />
                                                {{ getCategoryType(category) === 'mixed_team' ? '1 partner required' : '2 team members required' }}
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="filteredCategories.length === 0" class="py-10 text-center text-gray-400">
                                        <Icon icon="ph:magnifying-glass-slash" class="text-3xl mx-auto mb-2 opacity-40" />
                                        <span class="text-xs font-bold tracking-widest block">category not found</span>
                                    </div>
                                    <div v-if="categories.length === 0 && !pending"
                                        class="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-2.5">
                                        <Icon icon="ph:warning-bold" class="text-amber-500 shrink-0" />
                                        <span class="text-sm text-amber-700 font-medium block">category not yet available. please contact the organizer.</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Order Summary -->
                        <section class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-3">
                                <div class="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-navy shadow-sm shrink-0">
                                    <Icon icon="ph:receipt-bold" class="text-lg" />
                                </div>
                                <h2 class="text-base font-black text-navy">Summary</h2>
                            </div>
                            <div class="p-6">
                                <!-- Selected Categories Receipt -->
                                <div v-if="form.category_ids.length > 0" class="space-y-3">
                                    <!-- Participant Types (only if fee_mode === per_type) -->
                                    <template v-if="event.fee_mode === 'per_type'">
                                        <span class="text-[10px] font-black text-gray-400 tracking-widest block uppercase">Participant Types</span>
                                        <div v-for="type in form.participant_types" :key="type"
                                            class="flex items-center justify-between gap-2">
                                            <div class="flex items-center gap-2 min-w-0">
                                                <div class="size-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Icon icon="ph:user-bold" class="text-navy text-[8px]" />
                                                </div>
                                                <span class="text-xs font-bold text-navy capitalize">{{ type.replace('_', ' ') }}</span>
                                            </div>
                                            <span class="text-xs font-black text-navy tabular-nums shrink-0">{{ formatPrice(event.fee_per_type?.[type] || 0) }}</span>
                                        </div>
                                        <div class="h-px bg-gray-100 my-2"></div>
                                    </template>

                                    <span class="text-[10px] font-black text-gray-400 tracking-widest block uppercase">Selected Categories</span>
                                    <div v-for="catId in form.category_ids" :key="catId"
                                        class="flex items-center justify-between gap-2">
                                        <div class="flex items-center gap-2 min-w-0">
                                            <div class="size-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <Icon icon="ph:check-bold" class="text-navy text-[8px]" />
                                            </div>
                                            <span class="text-xs font-medium text-navy truncate">{{ getCategoryName(catId) }}</span>
                                        </div>
                                        <span v-if="event.fee_mode !== 'per_type'" class="text-xs font-black text-navy tabular-nums shrink-0">{{ formatPrice(getFeeForCategory(catId)) }}</span>
                                        <span v-else class="text-xs text-gray-400 shrink-0 capitalize">Included</span>
                                    </div>
                                </div>
                                <div v-else class="py-4 text-center border-2 border-dashed border-gray-100 rounded-xl">
                                    <Icon icon="ph:tag-light" class="text-3xl text-gray-300 mb-1 mx-auto" />
                                    <span class="text-xs text-gray-300 font-bold tracking-widest block">no categories selected yet</span>
                                </div>
                                <div class="pt-4 border-t border-gray-100 space-y-1.5 mt-4">
                                    <div class="flex items-center justify-between text-sm">
                                        <span class="text-gray-500">{{ form.category_ids.length }} {{ form.category_ids.length > 1 ? 'categories' : 'category' }}</span>
                                        <span class="font-bold text-navy capitalize">
                                            {{ event.fee_mode === 'per_type' ? form.participant_types.map(t => t.charAt(0).toUpperCase() + t.slice(1).replace('_', ' ')).join(', ') : 'Per Category' }}
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <span class="font-black text-navy">total</span>
                                        <span class="text-2xl font-black text-navy tabular-nums">{{ formatPrice(totalFee) }}</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <!-- RIGHT COLUMN — Payment + CTA (sticky) -->
                    <div class="lg:col-span-2 lg:sticky lg:top-6 space-y-5">

                        <!-- Combined Payment Methods -->
                        <section class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <!-- Header with primary bg-color icon, same as Athlete Data -->
                            <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-3">
                                <div class="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-navy shadow-sm shrink-0">
                                    <Icon icon="ph:credit-card-bold" class="text-lg" />
                                </div>
                                <div>
                                    <h2 class="text-base font-black text-navy">Metode Pembayaran</h2>
                                    <span class="text-[10px] text-gray-400 font-medium block">Pilih metode pembayaran online atau transfer manual</span>
                                </div>
                            </div>

                            <!-- Tabs Switcher -->
                            <div class="flex border-b border-gray-100">
                                <button type="button"
                                    @click="form.payment_type = 'online'; form.manual_method_id = ''"
                                    :class="form.payment_type === 'online' ? 'border-primary text-navy font-black' : 'border-transparent text-gray-400 hover:text-gray-600'"
                                    class="flex-1 py-3 text-center border-b-2 text-xs transition-all tracking-wide">
                                    Pembayaran Online
                                </button>
                                <button v-if="orgManualMethods.length > 0 || paymentMethods.length > 0"
                                    type="button"
                                    @click="form.payment_type = 'manual'; form.online_channel = ''"
                                    :class="form.payment_type === 'manual' ? 'border-primary text-navy font-black' : 'border-transparent text-gray-400 hover:text-gray-600'"
                                    class="flex-1 py-3 text-center border-b-2 text-xs transition-all tracking-wide">
                                    Transfer Manual
                                </button>
                            </div>

                            <div class="p-6">
                                <!-- Tab Content 1: Online Payment -->
                                <div v-if="form.payment_type === 'online'" class="space-y-2">
                                    <!-- Paddle: PayPal -->
                                    <div class="rounded-xl border-2 transition-all overflow-hidden"
                                        :class="form.online_channel === 'paddle_paypal' ? 'border-navy bg-navy/5' : 'border-gray-100 hover:border-gray-200 bg-white'">
                                        <div @click="selectOnlineChannel('paddle_paypal'); form.payment_type = 'online'; form.manual_method_id = ''"
                                            class="w-full p-3.5 flex items-center gap-3 cursor-pointer">
                                            <div class="h-9 w-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-1">
                                                <Icon icon="logos:paypal" class="text-lg" />
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <span class="text-sm font-black text-navy block leading-tight">PayPal</span>
                                                <span class="text-[10px] text-gray-400 font-medium">International · Powered by Paddle</span>
                                            </div>
                                            <div v-if="form.online_channel === 'paddle_paypal'" class="size-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                                                <Icon icon="ph:check-bold" class="text-navy text-[10px]" />
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Paddle: Google Pay -->
                                    <div class="rounded-xl border-2 transition-all overflow-hidden"
                                        :class="form.online_channel === 'paddle_gpay' ? 'border-navy bg-navy/5' : 'border-gray-100 hover:border-gray-200 bg-white'">
                                        <div @click="selectOnlineChannel('paddle_gpay'); form.payment_type = 'online'; form.manual_method_id = ''"
                                            class="w-full p-3.5 flex items-center gap-3 cursor-pointer">
                                            <div class="h-9 w-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-1">
                                                <Icon icon="logos:google-pay" class="text-2xl" />
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <span class="text-sm font-black text-navy block leading-tight">Google Pay</span>
                                                <span class="text-[10px] text-gray-400 font-medium">International · Powered by Paddle</span>
                                            </div>
                                            <div v-if="form.online_channel === 'paddle_gpay'" class="size-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                                                <Icon icon="ph:check-bold" class="text-navy text-[10px]" />
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Tripay channels -->
                                    <div v-for="ch in onlineChannels" :key="ch.code"
                                        class="rounded-xl border-2 transition-all overflow-hidden"
                                        :class="form.online_channel === ch.code ? 'border-navy bg-navy/5' : 'border-gray-100 hover:border-gray-200 bg-white'">
                                        <div @click="selectOnlineChannel(ch.code); form.payment_type = 'online'; form.manual_method_id = ''"
                                            class="w-full p-3.5 flex items-center gap-3 cursor-pointer">
                                            <div class="h-9 w-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-1">
                                                <img v-if="getChannelIcon(ch)" :src="getChannelIcon(ch)" class="w-full h-full object-contain" />
                                                <Icon v-else icon="ph:credit-card-bold" class="text-navy text-sm" />
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <span class="text-sm font-black text-navy block leading-tight">{{ ch.label }}</span>
                                                <span class="text-[10px] text-gray-400 font-medium">{{ ch.type }}</span>
                                            </div>
                                            <div v-if="form.online_channel === ch.code" class="size-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                                                <Icon icon="ph:check-bold" class="text-navy text-[10px]" />
                                            </div>
                                        </div>
                                        <div v-if="form.online_channel === ch.code" class="border-t border-gray-100 bg-white/80 px-4 pb-4 pt-2">
                                            <div v-if="channelInstructionsLoading === ch.code" class="flex items-center gap-2 py-4 text-gray-500">
                                                <Icon icon="ph:circle-notch-bold" class="animate-spin text-lg" />
                                                <span class="text-xs font-medium">Loading payment guide...</span>
                                            </div>
                                            <div v-else-if="channelInstructionGroups(ch.code).length" class="space-y-4">
                                                <div v-if="channelInstructionGroups(ch.code).length > 1" class="flex gap-2 flex-wrap border-b border-gray-100 pb-2 mb-2">
                                                    <div v-for="(group, gi) in channelInstructionGroups(ch.code)" :key="group.title"
                                                        @click="setActiveInstructionTab(ch.code, gi)"
                                                        :class="getActiveInstructionTab(ch.code) === gi ? 'bg-navy text-white border-navy' : 'bg-white text-gray-500 border-gray-200 hover:border-navy/40'"
                                                        class="px-3 py-1.5 rounded-lg border text-[10px] font-black tracking-widest transition-colors cursor-pointer">
                                                        {{ group.title }}
                                                    </div>
                                                </div>
                                                <div v-for="(group, gi) in channelInstructionGroups(ch.code)" :key="group.title"
                                                    v-show="channelInstructionGroups(ch.code).length === 1 || getActiveInstructionTab(ch.code) === gi"
                                                    class="space-y-2.5">
                                                    <div v-for="(step, si) in (group.steps || [])" :key="si" class="flex gap-3">
                                                        <span class="size-5 mt-0.5 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center shrink-0 text-[9px]">{{ si + 1 }}</span>
                                                        <span v-html="step" class="text-xs text-gray-600 font-medium leading-relaxed"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-else class="py-3 text-xs text-gray-500 italic">Guide not available. Instructions will appear after registering.</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 pt-1">
                                        <Icon icon="ph:shield-check-bold" class="text-emerald-500 text-sm shrink-0" />
                                        <span class="text-[10px] text-gray-400 font-medium">Secure · Auto-confirmed after payment</span>
                                    </div>
                                </div>

                                <!-- Tab Content 2: Manual Transfer -->
                                <div v-if="form.payment_type === 'manual'" class="space-y-2">
                                    <div v-if="orgManualMethods.length === 0"
                                        class="p-6 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                                        <Icon icon="ph:credit-card-light" class="text-3xl text-gray-300 mb-1.5 mx-auto" />
                                        <span class="text-xs text-navy font-black block">Manual Transfer Not Available</span>
                                        <span class="text-[10px] text-gray-400 block mt-1">This event does not support manual transfer. Please configure a payment method in your organization settings or use online payment channels.</span>
                                    </div>
                                    <div v-else v-for="method in orgManualMethods"
                                        :key="method.uuid || method.account_number"
                                        @click="form.manual_method_id = (method.uuid || method.account_number); form.payment_type = 'manual'; form.online_channel = ''"
                                        class="flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all"
                                        :class="form.manual_method_id === (method.uuid || method.account_number)
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-100 hover:border-gray-200 bg-white'">
                                        <div class="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-1.5 shadow-sm">
                                            <img v-if="getPaymentMethodImage(method.bank_name || method.payment_method)"
                                                :src="getPaymentMethodImage(method.bank_name || method.payment_method)"
                                                class="w-full h-full object-contain" />
                                            <Icon v-else icon="ph:bank-bold" class="text-xl text-navy" />
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="text-sm font-black text-navy leading-tight">{{ method.custom_name || method.bank_name || method.payment_method }}</div>
                                            <div class="font-mono text-xs font-bold text-gray-500 mt-0.5">{{ method.account_number }}</div>
                                            <div class="text-[10px] text-gray-400">{{ method.account_name }}</div>
                                        </div>
                                        <div class="flex items-center gap-2 shrink-0">
                                            <button @click.stop="copyToClipboard(method.account_number)"
                                                class="p-1.5 rounded-lg bg-gray-100 hover:bg-primary hover:text-navy text-gray-500 transition-colors">
                                                <Icon icon="ph:copy-bold" class="text-xs" />
                                            </button>
                                            <div v-if="form.manual_method_id === (method.uuid || method.account_number)"
                                                class="size-5 rounded-full bg-primary flex items-center justify-center">
                                                <Icon icon="ph:check-bold" class="text-navy text-[10px]" />
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Upload proof when manual selected -->
                                    <div v-if="form.manual_method_id" class="pt-3 border-t border-gray-100 space-y-2">
                                        <div class="text-[10px] font-black text-gray-500 tracking-widest">Upload Payment Proof</div>
                                        <div @click="triggerFileInput"
                                            class="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50"
                                            :class="proofFileUrl ? 'border-primary/50 bg-primary/5' : 'border-gray-200'">
                                            <input type="file" ref="proofInput" class="hidden" accept="image/*" @change="handleProofUpload" />
                                            <template v-if="uploadingProof">
                                                <Icon icon="ph:circle-notch-bold" class="text-2xl text-primary animate-spin mb-2" />
                                                <span class="text-xs text-gray-500 font-bold">Uploading...</span>
                                            </template>
                                            <template v-else-if="proofFileUrl">
                                                <img :src="proofFileUrl" class="max-h-28 object-contain rounded-lg mb-2 border border-gray-100" />
                                                <span class="text-[10px] text-green-600 font-bold">Proof uploaded ✓</span>
                                                <span class="text-[9px] text-gray-400">Click to change</span>
                                            </template>
                                            <template v-else>
                                                <Icon icon="ph:cloud-arrow-up-bold" class="text-2xl text-gray-400 mb-2" />
                                                <span class="text-xs text-gray-500 font-bold">Click to upload proof</span>
                                                <span class="text-[9px] text-gray-400">JPEG, PNG (max 10MB)</span>
                                            </template>
                                        </div>
                                        <span v-if="uploadError" class="text-xs text-red-500 font-bold block">{{ uploadError }}</span>
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
                            <span
                                class="text-[10px] text-gray-400 text-center font-medium leading-relaxed block">Automatic
                                confirmation after
                                successful payment.</span>
                        </div>
                    </div>
                </div>
            </main>
        </template>
    </div>

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
                        <div class="text-[10px] text-gray-400 mt-0.5">
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
                                <div class="text-[10px] text-gray-400 font-mono">{{ archer.id }}</div>
                                <div v-if="archer.club_name" class="text-[10px] text-gray-400">{{ archer.club_name }}</div>
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
                    <div class="text-[10px] font-black text-gray-400 tracking-widest mb-2 uppercase">Added</div>
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
</template>

<script setup>
definePageMeta({ layout: 'landing' })

import { useApi } from '~/composables/useApi'
import { usePayment } from '~/composables/usePayment'
import { useImageOrDefault } from '~/composables/useImageHelper'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import { Icon } from '@iconify/vue'
import { useDateFormat } from '@vueuse/core'

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

        const [categoriesResponse, bowTypesRes, citiesRes, profileResponse, participantsResponse, channelsRes] = await Promise.all([
            $fetch(`${apiBaseUrl}/events/${slug}/categories`).catch(() => ({ events: [] })),
            $fetch(`${apiBaseUrl}/bow-types`).catch(() => ({ bow_types: [] })),
            $fetch(`${apiBaseUrl}/cities`).catch(() => ({ data: [] })),
            token ? $fetch(`${apiBaseUrl}/archer/me`, fetchOptions).catch(() => null) : Promise.resolve(null),
            $fetch(`${apiBaseUrl}/events/${slug}/participants?limit=2000`).catch(() => ({ participants: [] })),
            $fetch(`${apiBaseUrl}/payment/channels`).catch(() => [])
        ])

        const formatDate = (d) => d ? useDateFormat(d, 'DD MMM YYYY', { locales: 'en-US' }).value : ''

        // Parse fee settings from page_settings
        let pageSettings = {}
        try {
            pageSettings = typeof eventResponse.page_settings_raw === 'string'
                ? JSON.parse(eventResponse.page_settings_raw)
                : (eventResponse.page_settings_raw || eventResponse.page_settings || {})
        } catch (e) {}

        // Also fetch org page_settings payment methods (from /organizations/me via event organizer)
        let orgManualMethods = []
        try {
            const orgRes = await $fetch(`${apiBaseUrl}/organizations/${eventResponse.organizer_id || eventResponse.organizer_slug || 'me'}`).catch(() => null)
            const orgSettings = orgRes?.organization?.page_settings || orgRes?.page_settings || orgRes?.data?.page_settings || orgRes?.data?.organization?.page_settings
            let parsedOrgSettings = {}
            if (typeof orgSettings === 'string') {
                try { parsedOrgSettings = JSON.parse(orgSettings) } catch (e) {}
            } else if (orgSettings && typeof orgSettings === 'object') {
                parsedOrgSettings = orgSettings
            }
            orgManualMethods = (parsedOrgSettings.payment_methods || []).filter(m => m.bank_name && m.account_number)
        } catch (e) {}

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
            fee_per_category: pageSettings.fee_per_category || {}
        }

        let archerProfileData = profileResponse?.data || profileResponse
        if (archerProfileData?.club_id && !archerProfileData.club_name) {
            try {
                const clubRes = await $fetch(`${apiBaseUrl}/clubs/${archerProfileData.club_id}`)
                archerProfileData.club_name = clubRes?.name || clubRes?.data?.name
            } catch (e) { }
        }

        let paymentMethodsData = []
        if (token && eventId) {
            const pmRes = await $fetch(`${apiBaseUrl}/events/${eventId}/payment-methods`, fetchOptions).catch(() => [])
            paymentMethodsData = (Array.isArray(pmRes) ? pmRes : pmRes?.data || []).filter(m => m.is_active !== false)
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

const toggleParticipantType = (type) => {
    if (!form.value.participant_types) {
        form.value.participant_types = []
    }
    const idx = form.value.participant_types.indexOf(type)
    if (idx === -1) {
        form.value.participant_types.push(type)
    } else {
        form.value.participant_types.splice(idx, 1)
    }

    form.value.participant_type = form.value.participant_types[0] || 'individual'

    // Clean up selected categories that are no longer in selected types
    form.value.category_ids = form.value.category_ids.filter(catId => {
        const category = categories.value.find(c => c.id === catId)
        if (!category) return false
        const catType = getCategoryType(category)
        return form.value.participant_types.includes(catType)
    })
}

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
    const partners = getPartnersForCategory(categoryId)
    if (type === 'mixed_team') return partners.length >= 1
    if (type === 'team') return partners.length >= 2
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
    city: '',
    club_name: '',
    club_id: null,
    bow_type: '',
    experience_years: 0
})

const genderOptions = [
    { title: 'Male', value: 'male' },
    { title: 'Female', value: 'female' }
]

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
    return categoriesSelected && archerProfileExists && profileComplete && partnersComplete && paymentSelected
})

const buttonText = computed(() => {
    if (form.value.payment_type === 'online') {
        if (form.value.online_channel?.startsWith('paddle_')) {
            return 'Pay with Paddle'
        }
        if (form.value.online_channel) {
            return 'Pay Now'
        }
    }
    return 'Register Now'
})

const loginUrl = computed(() => `/auth/login?redirect=${encodeURIComponent(route.fullPath)}`)

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
    if (code.startsWith('paddle_')) return
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
            city: profile.city || '',
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
                city: profileForm.value.city,
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
        const selectedChannel = form.value.payment_type === 'online'
            ? (form.value.online_channel.startsWith('paddle_') ? 'paddle' : form.value.online_channel)
            : 'manual'

        try {
            const payResult = await post('/payment/create', {
                type: 'registration',
                registration_id: registrationId,
                event_id: event.value.id,
                method: selectedChannel
            })
            paymentResult.value = payResult

            // if manual, upload the proof url
            if (form.value.payment_type === 'manual') {
                const txRef = payResult.reference
                await post(`/payment/manual/${txRef}/upload-proof`, {
                    proof_url: proofFileUrl.value
                })
                registrationSuccess.value = true
            } else if (selectedChannel === 'paddle') {
                const txId = payResult.tripay_reference
                if (txId && !txId.includes('mock') && window.Paddle) {
                    // Always use Paddle popup overlay
                    window.Paddle.Checkout.open({
                        transactionId: txId,
                        eventCallback: (data) => {
                            if (data.name === 'checkout.completed') {
                                registrationSuccess.value = true
                            }
                        }
                    })
                } else if (payResult.checkout_url && payResult.checkout_url.includes('txn_mock_')) {
                    // Automatically simulate success for mock payments in dev
                    alert('simulasi pembayaran berhasil! karena tidak ada paddle api key di backend, sistem secara otomatis menyelesaikan transaksi secara lokal.')
                    await $fetch(`${apiBaseUrl}/payment/simulate-success/${payResult.reference}`, {
                        method: 'GET',
                        credentials: 'include'
                    })
                    registrationSuccess.value = true
                } else {
                    // Fallback: show success if no Paddle SDK available
                    registrationSuccess.value = true
                }
            } else if (payResult.checkout_url) {
                // Tripay: redirect directly
                window.location.href = payResult.checkout_url
            } else {
                registrationSuccess.value = true
            }
        } catch (payErr) {
            // Registration succeeded but payment link failed - still show success
            registrationSuccess.value = true
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

<template>
    <div class="min-h-screen bg-gray-50 font-body text-navy pb-16">
        <!-- Loading -->
        <div v-if="pending" class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <Icon icon="ph:circle-notch-bold" class="text-4xl text-primary animate-spin mb-4" />
                <span class="text-gray-500 font-medium block">Loading data...</span>
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
                        <svg v-if="paymentResult?.checkout_url && paymentResult?.payment_method !== 'paddle'" class="absolute inset-0 w-full h-full -rotate-90"
                            viewBox="0 0 80 80">
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
                            <span class="font-black text-primary text-lg tabular-nums">Rp {{ (paymentResult.total_amount
                                || paymentResult.amount || 0).toLocaleString('id-ID') }}</span>
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
                        class="flex items-center gap-2.5 bg-blue-500/10 border border-blue-400/20 rounded-xl p-3">
                        <Icon icon="ph:credit-card-bold" class="text-blue-300 shrink-0" />
                        <span class="text-xs text-white/70 font-medium block">Payment window is opening... complete your payment in the Paddle overlay.</span>
                    </div>
                    <!-- Manual payment proof uploaded notice -->
                    <div v-if="paymentResult.payment_method === 'manual'"
                        class="flex items-center gap-2.5 bg-amber-500/10 border border-amber-400/20 rounded-xl p-3">
                        <Icon icon="ph:clock-bold" class="text-amber-300 shrink-0" />
                        <span class="text-xs text-white/70 font-medium block">payment proof uploaded. the organizer will verify your payment.</span>
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

                        <!-- Category Selection -->
                        <section class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div
                                class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-3">
                                <div
                                    class="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-navy shadow-sm shrink-0">
                                    <Icon icon="ph:tag-bold" class="text-lg" />
                                </div>
                                <div>
                                    <h2 class="text-base font-black text-navy">Select Category</h2>
                                    <span class="text-[10px] text-gray-400 font-medium block">Can select multiple if the
                                        schedule allows</span>
                                </div>
                            </div>
                            <div class="p-6">
                                <div class="relative mb-4">
                                    <input v-model="categorySearch" type="text"
                                        placeholder="Search division or category..."
                                        class="w-full h-10 px-4 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" />
                                    <Icon icon="ph:magnifying-glass"
                                        class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>

                                <div class="max-h-[320px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                                    <div v-for="category in filteredCategories" :key="category.id"
                                        class="flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer group"
                                        :class="form.category_ids.includes(category.id)
                                            ? 'border-primary bg-primary/5 shadow-sm'
                                            : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'"
                                        @click="toggleCategory(category.id)">
                                        <div class="flex items-center gap-3">
                                            <div class="size-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0"
                                                :class="form.category_ids.includes(category.id) ? 'bg-primary border-primary' : 'bg-white border-gray-300 group-hover:border-navy'">
                                                <Icon v-if="form.category_ids.includes(category.id)"
                                                    icon="ph:check-bold" class="text-navy text-xs" />
                                            </div>
                                            <span class="text-sm font-bold text-navy leading-tight">{{ category.name
                                                }}</span>
                                        </div>
                                        <span v-if="event.registration_fee > 0"
                                            class="text-xs font-black tabular-nums shrink-0 ml-2">
                                            Rp {{ (event.registration_fee || 0).toLocaleString('id-ID') }}
                                        </span>
                                    </div>
                                    <div v-if="filteredCategories.length === 0" class="py-10 text-center text-gray-400">
                                        <Icon icon="ph:magnifying-glass-slash"
                                            class="text-3xl mx-auto mb-2 opacity-40" />
                                        <span class="text-xs font-bold tracking-widest block">Category not found</span>
                                    </div>
                                    <div v-if="categories.length === 0 && !pending"
                                        class="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-2.5">
                                        <Icon icon="ph:warning-bold" class="text-amber-500 shrink-0" />
                                        <span class="text-sm text-amber-700 font-medium block">Category not yet
                                            available. Please contact the organizer.</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Order Summary (below Pilih Kategori) -->
                        <section class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div
                                class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-3">
                                <div
                                    class="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-navy shadow-sm shrink-0">
                                    <Icon icon="ph:receipt-bold" class="text-lg" />
                                </div>
                                <h2 class="text-base font-black text-navy">Summary</h2>
                            </div>
                            <div class="p-6 space-y-4">
                                <!-- Selected categories list -->
                                <div v-if="form.category_ids.length > 0" class="space-y-2">
                                    <span class="text-[10px] font-black text-gray-400 tracking-widest block">Selected
                                        Categories</span>
                                    <div v-for="catId in form.category_ids" :key="catId"
                                        class="flex items-center justify-between gap-2">
                                        <div class="flex items-center gap-2 min-w-0">
                                            <div
                                                class="size-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                                                <Icon icon="ph:check-bold" class="text-navy text-[8px]" />
                                            </div>
                                            <span class="text-xs font-medium text-navy truncate">{{
                                                getCategoryName(catId) }}</span>
                                        </div>
                                        <span class="text-xs font-black text-navy tabular-nums shrink-0">Rp {{
                                            (event.registration_fee || 0).toLocaleString('id-ID') }}</span>
                                    </div>
                                </div>
                                <div v-else class="py-4 text-center border-2 border-dashed border-gray-100 rounded-xl">
                                    <Icon icon="ph:tag-light" class="text-3xl text-gray-300 mb-1 mx-auto" />
                                    <span class="text-xs text-gray-300 font-bold tracking-widest block">No categories
                                        selected yet</span>
                                </div>
                                <div class="pt-4 border-t border-gray-100 space-y-1.5">
                                    <div class="flex items-center justify-between text-sm">
                                        <span class="text-gray-500">{{ form.category_ids.length }} {{
                                            form.category_ids.length > 1 ? 'Categories' : 'Category' }}</span>
                                        <span class="font-bold text-navy">× Rp {{ (event.registration_fee ||
                                            0).toLocaleString('id-ID') }}</span>
                                    </div>
                                    <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <span class="font-black text-navy">Total</span>
                                        <span class="text-2xl font-black text-navy tabular-nums">Rp {{
                                            totalFee.toLocaleString('id-ID') }}</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <!-- RIGHT COLUMN — Payment + CTA (sticky) -->
                    <div class="lg:col-span-2 lg:sticky lg:top-6 space-y-5">

                        <!-- Payment Method -->
                        <section v-if="event.registration_fee > 0"
                            class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div
                                class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-3">
                                <div
                                    class="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-navy shadow-sm shrink-0">
                                    <Icon icon="ph:credit-card-bold" class="text-lg" />
                                </div>
                                <h2 class="text-base font-black text-navy">Payment Method</h2>
                            </div>
                            <div class="p-6 space-y-5">
                                <!-- Payment Type Selector -->
                                <div class="flex gap-2 p-1 bg-gray-100 rounded-xl mb-2">
                                    <button @click="form.payment_type = 'online'" type="button"
                                        :class="form.payment_type === 'online' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'"
                                        class="flex-1 py-2 text-xs font-black tracking-widest rounded-lg transition-all focus:outline-none">
                                        online
                                    </button>
                                    <button @click="form.payment_type = 'manual'" type="button"
                                        :class="form.payment_type === 'manual' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'"
                                        class="flex-1 py-2 text-xs font-black tracking-widest rounded-lg transition-all focus:outline-none">
                                        manual transfer
                                    </button>
                                </div>

                                <!-- Online Payment Channels — Expansion panel -->
                                <div v-if="form.payment_type === 'online'" class="space-y-2">
                                    <span class="text-[10px] font-black text-gray-600 tracking-widest block">select online payment method</span>
                                    <div
                                        class="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
                                        
                                        <!-- PayPal (Powered by Paddle) -->
                                        <div class="rounded-xl border-2 transition-all overflow-hidden shrink-0"
                                            :class="form.online_channel === 'paddle_paypal' ? 'border-navy bg-navy/5' : 'border-gray-100 hover:border-gray-200 bg-white'">
                                            <div @click="selectOnlineChannel('paddle_paypal')"
                                                class="w-full p-4 text-left block focus:outline-none h-auto min-h-[64px] cursor-pointer">
                                                <div class="flex items-center gap-3 w-full">
                                                    <div
                                                        class="h-9 w-9 min-w-[36px] rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-1">
                                                        <Icon icon="logos:paypal" class="text-lg" />
                                                    </div>
                                                    <div class="flex-1 min-w-0">
                                                        <span
                                                            class="text-sm font-black text-navy block leading-tight">PayPal</span>
                                                        <span
                                                            class="text-[10px] text-gray-400 font-medium block mt-0.5">International Payments (Powered by Paddle)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Google Pay (Powered by Paddle) -->
                                        <div class="rounded-xl border-2 transition-all overflow-hidden shrink-0"
                                            :class="form.online_channel === 'paddle_gpay' ? 'border-navy bg-navy/5' : 'border-gray-100 hover:border-gray-200 bg-white'">
                                            <div @click="selectOnlineChannel('paddle_gpay')"
                                                class="w-full p-4 text-left block focus:outline-none h-auto min-h-[64px] cursor-pointer">
                                                <div class="flex items-center gap-3 w-full">
                                                    <div
                                                        class="h-9 w-9 min-w-[36px] rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-1">
                                                        <Icon icon="logos:google-pay" class="text-2xl" />
                                                    </div>
                                                    <div class="flex-1 min-w-0">
                                                        <span
                                                            class="text-sm font-black text-navy block leading-tight">Google Pay</span>
                                                        <span
                                                            class="text-[10px] text-gray-400 font-medium block mt-0.5">International Payments (Powered by Paddle)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div v-for="ch in onlineChannels" :key="ch.code"
                                            class="rounded-xl border-2 transition-all overflow-hidden shrink-0"
                                            :class="form.online_channel === ch.code ? 'border-navy bg-navy/5' : 'border-gray-100 hover:border-gray-200 bg-white'">
                                            <div @click="selectOnlineChannel(ch.code)"
                                                class="w-full p-4 text-left block focus:outline-none h-auto min-h-[64px] cursor-pointer">
                                                <div class="flex items-center gap-3 w-full">
                                                    <div
                                                        class="h-9 w-9 min-w-[36px] rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-1">
                                                        <img v-if="getChannelIcon(ch)" :src="getChannelIcon(ch)"
                                                            class="w-full h-full object-contain" />
                                                        <Icon v-else icon="ph:credit-card-bold"
                                                            class="text-navy text-sm" />
                                                    </div>
                                                    <div class="flex-1 min-w-0">
                                                        <span
                                                            class="text-sm font-black text-navy block leading-tight">{{
                                                                ch.label }}</span>
                                                        <span
                                                            class="text-[10px] text-gray-400 font-medium block mt-0.5">{{
                                                                ch.type
                                                            }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- Expanded: payment instructions -->
                                            <div v-if="form.online_channel === ch.code"
                                                class="border-t border-gray-100 bg-white/80 px-4 pb-4 pt-2">
                                                <div v-if="channelInstructionsLoading === ch.code"
                                                    class="flex items-center gap-2 py-4 text-gray-500">
                                                    <Icon icon="ph:circle-notch-bold" class="animate-spin text-lg" />
                                                    <span class="text-xs font-medium">Loading payment guide...</span>
                                                </div>
                                                <div v-else-if="channelInstructionGroups(ch.code).length"
                                                    class="space-y-4">
                                                    <!-- Tab panel when multiple platforms (e.g. Internet Banking, Aplikasi BRImo) -->
                                                    <div v-if="channelInstructionGroups(ch.code).length > 1"
                                                        class="flex gap-2 flex-wrap border-b border-gray-100 pb-2 mb-2">
                                                        <div v-for="(group, gi) in channelInstructionGroups(ch.code)"
                                                            :key="group.title"
                                                            @click="setActiveInstructionTab(ch.code, gi)"
                                                            :class="getActiveInstructionTab(ch.code) === gi
                                                                ? 'bg-navy text-white border-navy'
                                                                : 'bg-white text-gray-500 border-gray-200 hover:border-navy/40'"
                                                            class="px-3 py-1.5 rounded-lg border text-[10px] font-black tracking-widest transition-colors cursor-pointer">
                                                            {{ group.title }}
                                                        </div>
                                                    </div>
                                                    <!-- Steps for active tab (or only group) -->
                                                    <div v-for="(group, gi) in channelInstructionGroups(ch.code)"
                                                        :key="group.title"
                                                        v-show="channelInstructionGroups(ch.code).length === 1 || getActiveInstructionTab(ch.code) === gi"
                                                        class="space-y-2.5">
                                                        <div v-if="channelInstructionGroups(ch.code).length > 1"
                                                            class="text-[10px] font-black text-gray-500 tracking-widest">
                                                            {{ group.title }}
                                                        </div>
                                                        <div v-for="(step, si) in (group.steps || [])" :key="si"
                                                            class="flex gap-3">
                                                            <span
                                                                class="size-5 mt-0.5 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center shrink-0 text-[9px]">
                                                                {{ si + 1 }}
                                                            </span>
                                                            <span v-html="step"
                                                                class="text-xs text-gray-600 font-medium leading-relaxed"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-else class="py-3 text-xs text-gray-500 italic">
                                                    Guide not available. After registering, payment instructions will
                                                    appear.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 flex gap-2">
                                        <Icon icon="ph:shield-check-bold"
                                            class="text-blue-500 shrink-0 text-sm mt-0.5" />
                                        <span class="text-[10px] text-blue-700 font-medium leading-relaxed block">secure payment via tripay. automatic confirmation after successful payment.</span>
                                    </div>
                                </div>

                                <!-- Manual Bank Transfer Section -->
                                <div v-if="form.payment_type === 'manual'" class="space-y-4">
                                    <span class="text-[10px] font-black text-gray-600 tracking-widest block">transfer to organizer bank account</span>
                                    <div class="flex flex-col gap-3">
                                        <div v-for="bank in paymentMethods" :key="bank.uuid"
                                            class="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between relative overflow-hidden">
                                            <div class="flex items-start justify-between gap-3">
                                                <div>
                                                    <span class="text-[9px] font-black tracking-widest text-gray-400 block mb-1">bank name</span>
                                                    <span class="text-sm font-black text-navy">{{ bank.payment_method }}</span>
                                                </div>
                                                <div class="text-right">
                                                    <span class="text-[9px] font-black tracking-widest text-gray-400 block mb-1">account holder</span>
                                                    <span class="text-sm font-black text-navy">{{ bank.account_name }}</span>
                                                </div>
                                            </div>
                                            <div class="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between">
                                                <div>
                                                    <span class="text-[9px] font-black tracking-widest text-gray-400 block">account number</span>
                                                    <span class="font-mono text-base font-black text-navy tracking-wider">{{ bank.account_number }}</span>
                                                </div>
                                                <button @click="copyToClipboard(bank.account_number)" class="p-2 rounded-lg bg-primary text-navy shrink-0 hover:opacity-90 transition-opacity">
                                                    <Icon icon="ph:copy-bold" class="text-xs" />
                                                </button>
                                            </div>
                                        </div>
                                        <div v-if="paymentMethods.length === 0" class="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-2.5">
                                            <Icon icon="ph:warning-bold" class="text-amber-500 shrink-0" />
                                            <span class="text-xs text-amber-700 font-medium block">no bank accounts available. please contact organizer.</span>
                                        </div>
                                    </div>

                                    <!-- Upload Payment Proof Section -->
                                    <div class="space-y-2 mt-4 pt-4 border-t border-gray-100">
                                        <span class="text-[10px] font-black text-gray-600 tracking-widest block">upload payment proof</span>
                                        <div class="flex flex-col gap-3">
                                            <div @click="triggerFileInput" 
                                                class="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50"
                                                :class="proofFileUrl ? 'border-primary/50 bg-primary/5' : 'border-gray-200 bg-gray-50/50'">
                                                
                                                <input type="file" ref="proofInput" class="hidden" accept="image/*" @change="handleProofUpload" />
                                                
                                                <template v-if="uploadingProof">
                                                    <Icon icon="ph:circle-notch-bold" class="text-2xl text-primary animate-spin mb-2" />
                                                    <span class="text-xs text-gray-500 font-bold block">uploading proof...</span>
                                                </template>
                                                <template v-else-if="proofFileUrl">
                                                    <img :src="proofFileUrl" class="max-h-32 object-contain rounded-lg mb-2 border border-gray-100" />
                                                    <span class="text-[10px] text-green-600 font-bold block">proof uploaded successfully</span>
                                                    <span class="text-[9px] text-gray-400 block">click to change image</span>
                                                </template>
                                                <template v-else>
                                                    <Icon icon="ph:cloud-arrow-up-bold" class="text-2xl text-gray-400 mb-2" />
                                                    <span class="text-xs text-gray-500 font-bold block">click to upload payment proof</span>
                                                    <span class="text-[9px] text-gray-400 block">jpeg, png (max 10mb)</span>
                                                </template>
                                            </div>
                                            <span v-if="uploadError" class="text-xs text-red-500 font-bold block mt-1">{{ uploadError }}</span>
                                        </div>
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
            registration_fee: eventResponse.entry_fee || eventResponse.registration_fee || 0
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
            name: `${cat.division_name || cat.division || ''} - ${cat.category_name || cat.category || ''} ${cat.event_type_name ? '- ' + cat.event_type_name : ''} ${cat.gender_division_name ? '- ' + cat.gender_division_name : ''}`.trim()
        }))

        return {
            isLoggedIn: !!token || !!archerProfileData,
            event: eventData,
            categories: categoriesData,
            archerProfile: archerProfileData,
            paymentMethods: paymentMethodsData,
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

// For Paddle: open inline overlay. For others: redirect countdown.
watch(registrationSuccess, (val) => {
    if (!val || !paymentResult.value) return
    const res = paymentResult.value
    const toast = useToast()

    // Paddle inline overlay
    if (res.payment_method === 'paddle' || res.tripay_reference?.startsWith('txn')) {
        if (window.Paddle && res.tripay_reference && !res.tripay_reference.includes('mock')) {
            nextTick(() => {
                window.Paddle.Checkout.open({ transactionId: res.tripay_reference })
            })
        }
        // If mock / no Paddle.js, just show success screen without redirect
        return
    }

    // Tripay: just show toast and do not redirect
    if (res.checkout_url) {
        toast.success('Registration successful! Please complete your payment.')
    }
})

const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text).catch(() => { })
}

const form = ref({
    category_ids: [],
    payment_amount: 0,
    payment_type: 'online',
    online_channel: ''
})

const profileForm = ref({
    full_name: '',
    gender: '',
    date_of_birth: '',
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

// No auto-select: user must explicitly choose payment method

// ─── COMPUTED ─────────────────────────────────────────────────────────────────
const event = computed(() => data.value?.event || { name: '', date: '', location: '', image: '', description: '', registration_fee: 0 })
const categories = computed(() => data.value?.categories || [])
const bowTypeOptions = computed(() => data.value?.bowTypes || [])
const cityOptions = computed(() => data.value?.cities || [])
const paymentMethods = computed(() => data.value?.paymentMethods || [])
const archerProfile = computed(() => globalArcherProfile.value || data.value?.archerProfile)

const filteredCategories = computed(() => {
    if (!categorySearch.value) return categories.value
    const s = categorySearch.value.toLowerCase()
    return categories.value.filter(c => c.name.toLowerCase().includes(s))
})

const isArcher = computed(() => {
    const t = user.value?.type || user.value?.role || user.value?.user_type
    return t === 'archer'
})

const userDisplay = computed(() => ({
    name: archerProfile.value?.full_name || user.value?.full_name || '',
    email: archerProfile.value?.email || user.value?.email || '',
}))

const totalFee = computed(() => (event.value.registration_fee || 0) * form.value.category_ids.length)

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
    const channelSelected = event.value.registration_fee > 0
        ? (form.value.payment_type === 'online' ? !!form.value.online_channel : !!proofFileUrl.value)
        : true
    return categoriesSelected && archerProfileExists && profileComplete && channelSelected
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
            city: profile.city || '',
            club_name: profile.club_name || '',
            club_id: profile.club_id || null,
            bow_type: profile.bow_type || '',
            experience_years: profile.experience_years || 0
        }
    }
}, { immediate: true })

watch(totalFee, (val) => { form.value.payment_amount = val }, { immediate: true })

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
            payment_type: form.value.payment_type
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
            }

            registrationSuccess.value = true

            // Paddle inline overlay — open immediately if Paddle.js is ready
            if (selectedChannel === 'paddle' && window.Paddle) {
                const txId = payResult.tripay_reference
                if (txId && !txId.includes('mock')) {
                    window.Paddle.Checkout.open({ transactionId: txId })
                }
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

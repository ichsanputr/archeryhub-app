<template>
    <div class="min-h-screen bg-gray-50 font-body text-navy pb-16">
        <!-- Loading -->
        <div v-if="pending" class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <Icon icon="ph:circle-notch-bold" class="text-4xl text-primary animate-spin mb-4" />
                <span class="text-gray-500 font-medium block">Memuat data...</span>
            </div>
        </div>

        <!-- Error -->
        <div v-else-if="fetchError" class="min-h-screen flex items-center justify-center px-4">
            <div class="text-center max-w-md">
                <div class="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Icon icon="ph:warning-circle-fill" class="text-3xl text-red-500" />
                </div>
                <h2 class="text-xl font-black text-navy mb-3">Gagal Memuat Data</h2>
                <span class="text-gray-500 mb-6 block">{{ fetchError.message || 'Terjadi kesalahan.' }}</span>
                <BaseButton @click="refresh()" variant="navy" size="md">Coba Lagi</BaseButton>
            </div>
        </div>

        <!-- No Data -->
        <div v-else-if="!data || !data.event" class="min-h-screen flex items-center justify-center px-4">
            <div class="text-center max-w-md">
                <h2 class="text-xl font-black text-navy mb-3">Event Tidak Ditemukan</h2>
                <BaseButton to="/events" variant="navy" size="md">Lihat Event Lain</BaseButton>
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
                        <!-- Countdown ring (only for online payment with checkout URL) -->
                        <svg v-if="paymentResult?.checkout_url" class="absolute inset-0 w-full h-full -rotate-90"
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
                    <h1 class="text-2xl font-black text-white mb-2 text-center">Pendaftaran Berhasil!</h1>
                    <span class="text-white/50 text-sm font-medium text-center block">{{ event.name }}</span>
                </div>

                <!-- Online payment result box -->
                <div v-if="paymentResult"
                    class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 space-y-4 mb-6">
                    <!-- VA Number -->
                    <div v-if="paymentResult.pay_code">
                        <span class="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">Virtual
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
                        <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Scan
                            QRIS</span>
                        <img :src="paymentResult.qr_url" class="w-40 h-40" />
                    </div>
                    <!-- Amount & method -->
                    <div class="flex items-center justify-between border-t border-white/10 pt-3">
                        <div>
                            <span class="text-[9px] text-white/40 font-black uppercase tracking-widest block">Total
                                Bayar</span>
                            <span class="font-black text-primary text-lg tabular-nums">Rp {{ (paymentResult.total_amount
                                || paymentResult.amount || 0).toLocaleString('id-ID') }}</span>
                        </div>
                        <div v-if="paymentResult.payment_method" class="text-right">
                            <span
                                class="text-[9px] text-white/40 font-black uppercase tracking-widest block">Metode</span>
                            <span class="text-white font-black text-sm">{{ paymentResult.payment_method }}</span>
                        </div>
                    </div>
                    <!-- Redirect notice -->
                    <div v-if="paymentResult.checkout_url"
                        class="flex items-center gap-2.5 bg-primary/10 border border-primary/20 rounded-xl p-3">
                        <Icon icon="ph:arrow-square-out-bold" class="text-primary shrink-0" />
                        <span class="text-xs text-white/70 font-medium block">Mengarahkan ke halaman pembayaran dalam
                            <strong class="text-primary">{{ redirectCountdown }}</strong> detik...</span>
                    </div>
                </div>

                <!-- Manual payment -->
                <div v-else class="bg-white/10 border border-white/20 rounded-2xl p-5 mb-6 flex items-start gap-3">
                    <Icon icon="ph:clock-fill" class="text-primary text-xl shrink-0 mt-0.5" />
                    <div>
                        <span class="text-sm font-black text-white mb-1 block">Menunggu Konfirmasi</span>
                        <span class="text-xs text-white/50 block">Anda akan menerima notifikasi setelah pendaftaran
                            dikonfirmasi oleh penyelenggara.</span>
                    </div>
                </div>

                <!-- Manual go to dashboard link (subtle) -->
                <span class="text-center block text-white/30 text-xs font-medium">
                    <NuxtLink to="/dashboard/archer/events"
                        class="hover:text-white/60 transition-colors underline underline-offset-4">Lihat di Dashboard →
                    </NuxtLink>
                </span>
            </div>
        </div>

        <template v-else>
            <!-- Hero Header -->
            <div class="bg-navy relative overflow-hidden h-[200px] md:h-[260px] flex items-end">
                <div class="absolute inset-0 z-0">
                    <img alt="Event Banner" class="w-full h-full object-cover object-center"
                        src="/hero-event-detail.jpeg" />
                    <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                    </div>
                </div>
                <div class="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <div class="flex items-center gap-3 mb-2">
                        <NuxtLink :to="`/events/${slug}`"
                            class="text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                            <Icon icon="ph:arrow-left-bold" />
                            Kembali
                        </NuxtLink>
                        <Icon icon="ph:caret-right-bold" class="text-white/30 text-[10px]" />
                        <span class="text-white/60 text-xs font-bold uppercase tracking-widest">Pendaftaran</span>
                    </div>
                    <h1 class="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
                        Daftar: {{ event.name }}
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
                    <h2 class="text-2xl font-black text-navy mb-3">Anda Sudah Terdaftar</h2>
                    <span class="text-gray-500 mb-8 leading-relaxed block">Anda telah mendaftar untuk <strong>{{
                        event.name }}</strong>.</span>
                    <div class="flex flex-col sm:flex-row gap-3 justify-center">
                        <BaseButton to="/dashboard/archer/events" variant="navy" size="lg" class="px-8">Ke Dashboard
                        </BaseButton>
                        <BaseButton :to="`/events/${slug}`" variant="outline" size="lg" class="px-8">Kembali ke Event
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
                                <h2 class="text-base font-black text-navy">Data Atlet</h2>
                            </div>
                            <div class="p-6">
                                <!-- Not logged in -->
                                <div v-if="!isLoggedIn" class="py-8 flex flex-col items-center text-center">
                                    <div
                                        class="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                                        <Icon icon="ph:lock-bold" class="text-2xl text-navy" />
                                    </div>
                                    <h3 class="font-black text-navy mb-2">Login Diperlukan</h3>
                                    <span class="text-sm text-gray-500 mb-5 block">Silakan login sebagai atlet untuk
                                        mendaftar.</span>
                                    <BaseButton :to="loginUrl" variant="navy" size="md">Login Sekarang</BaseButton>
                                </div>

                                <!-- Not an archer -->
                                <div v-else-if="!isArcher" class="py-8 flex flex-col items-center text-center">
                                    <div class="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center mb-4">
                                        <Icon icon="ph:user-plus-bold" class="text-2xl text-navy" />
                                    </div>
                                    <h3 class="font-black text-navy mb-2">Akun Atlet Diperlukan</h3>
                                    <span class="text-sm text-gray-500 mb-5 block">Khusus untuk profil atlet.</span>
                                    <BaseButton to="/auth/register?type=archer" variant="navy" size="md">Daftar Sebagai
                                        Atlet</BaseButton>
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
                                                profileForm.full_name || 'Atlet' }}</span>
                                            <span class="text-sm text-gray-400 block">{{ archerProfile?.email || ''
                                                }}</span>
                                            <span v-if="archerProfile?.id"
                                                class="text-[10px] text-navy font-black bg-gray-100 px-2 py-0.5 rounded-full tracking-wider">ID:
                                                {{ archerProfile.id }}</span>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <BaseInput v-model="profileForm.full_name" label="Nama Lengkap"
                                            placeholder="Nama lengkap" required icon="ph:user-bold" />
                                        <BaseSelect v-model="profileForm.gender" :items="genderOptions"
                                            label="Jenis Kelamin" placeholder="Pilih" required
                                            icon="ph:gender-intersex" />
                                        <BaseInput v-model="profileForm.date_of_birth" label="Tanggal Lahir" type="date"
                                            required icon="ph:calendar-blank" />
                                        <BaseSelect v-model="profileForm.bow_type" :items="bowTypeOptions"
                                            label="Jenis Busur" placeholder="Pilih tipe busur" required
                                            icon="ph:target-bold" />
                                        <BaseSelect v-model="profileForm.city" :items="cityOptions"
                                            label="Kota / Kabupaten" placeholder="Pilih kota" icon="ph:map-pin-bold"
                                            class="relative z-20" />
                                        <BaseInput v-model="profileForm.club_name" label="Klub / Instansi"
                                            icon="ph:users-bold" hint="Tidak dapat diubah di sini" disabled readonly />
                                    </div>
                                    <div class="p-3.5 bg-primary/10 border border-primary/20 rounded-xl flex gap-2.5">
                                        <Icon icon="ph:info-bold" class="text-navy shrink-0 mt-0.5" />
                                        <span class="text-xs text-navy/80 font-medium leading-relaxed block">Pastikan
                                            data sudah
                                            benar sebelum melanjutkan pendaftaran.</span>
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
                                    <h2 class="text-base font-black text-navy">Pilih Kategori</h2>
                                    <span class="text-[10px] text-gray-400 font-medium block">Bisa lebih dari satu jika
                                        jadwal
                                        memungkinkan</span>
                                </div>
                            </div>
                            <div class="p-6">
                                <div class="relative mb-4">
                                    <input v-model="categorySearch" type="text"
                                        placeholder="Cari divisi atau kategori..."
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
                                        <span class="text-xs font-bold uppercase tracking-widest block">Kategori tidak
                                            ditemukan</span>
                                    </div>
                                    <div v-if="categories.length === 0 && !pending"
                                        class="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-2.5">
                                        <Icon icon="ph:warning-bold" class="text-amber-500 shrink-0" />
                                        <span class="text-sm text-amber-700 font-medium block">Kategori belum tersedia.
                                            Hubungi penyelenggara.</span>
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
                                <h2 class="text-base font-black text-navy">Ringkasan</h2>
                            </div>
                            <div class="p-6 space-y-4">
                                <!-- Selected categories list -->
                                <div v-if="form.category_ids.length > 0" class="space-y-2">
                                    <span
                                        class="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Kategori
                                        Dipilih</span>
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
                                    <span class="text-xs text-gray-300 font-bold uppercase tracking-widest block">Belum
                                        ada
                                        kategori dipilih</span>
                                </div>
                                <div class="pt-4 border-t border-gray-100 space-y-1.5">
                                    <div class="flex items-center justify-between text-sm">
                                        <span class="text-gray-500">{{ form.category_ids.length }} Kategori</span>
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
                                <h2 class="text-base font-black text-navy">Metode Pembayaran</h2>
                            </div>
                            <div class="p-6 space-y-5">
                                <!-- Method Toggle -->
                                <div class="grid grid-cols-2 gap-3">
                                    <button @click="form.payment_type = 'online'"
                                        class="flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all"
                                        :class="form.payment_type === 'online' ? 'border-navy bg-navy/5 text-navy' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'">
                                        <Icon icon="ph:lightning-bold" class="text-2xl" />
                                        <div class="text-center">
                                            <div class="text-[10px] font-black uppercase tracking-wider">Bayar Online
                                            </div>
                                            <div class="text-[9px] opacity-60 mt-0.5">Otomatis Terkonfirmasi</div>
                                        </div>
                                    </button>
                                    <button @click="form.payment_type = 'manual'"
                                        class="flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all"
                                        :class="form.payment_type === 'manual' ? 'border-navy bg-navy/5 text-navy' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'">
                                        <Icon icon="ph:bank-bold" class="text-2xl" />
                                        <div class="text-center">
                                            <div class="text-[10px] font-black uppercase tracking-wider">Transfer Manual
                                            </div>
                                            <div class="text-[9px] opacity-60 mt-0.5">Verifikasi 1–2 Hari</div>
                                        </div>
                                    </button>
                                </div>

                                <!-- Online Payment Channels — Expansion panel -->
                                <div v-if="form.payment_type === 'online'" class="space-y-2">
                                    <span
                                        class="text-[10px] font-black text-gray-600 uppercase tracking-widest block">Pilih
                                        Metode Pembayaran Online</span>
                                    <div class="flex flex-col gap-2">
                                        <div v-for="ch in onlineChannels" :key="ch.code"
                                            class="rounded-xl border-2 transition-all overflow-hidden"
                                            :class="form.online_channel === ch.code ? 'border-navy bg-navy/5' : 'border-gray-100 hover:border-gray-200 bg-white'">
                                            <button @click="selectOnlineChannel(ch.code)"
                                                class="w-full flex items-center gap-3 p-3 text-left">
                                                <div
                                                    class="h-9 w-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-1">
                                                    <img v-if="ch.icon" :src="ch.icon"
                                                        class="w-full h-full object-contain" />
                                                    <Icon v-else icon="ph:credit-card-bold" class="text-navy text-sm" />
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <span
                                                        class="text-sm font-black text-navy block leading-tight">{{
                                                            ch.label }}</span>
                                                    <span class="text-[10px] text-gray-400 font-medium">{{ ch.type }}</span>
                                                </div>
                                            </button>
                                            <!-- Expanded: payment instructions -->
                                            <div v-if="form.online_channel === ch.code"
                                                class="border-t border-gray-100 bg-white/80 px-4 pb-4 pt-2">
                                                <div v-if="channelInstructionsLoading === ch.code"
                                                    class="flex items-center gap-2 py-4 text-gray-500">
                                                    <Icon icon="ph:circle-notch-bold" class="animate-spin text-lg" />
                                                    <span class="text-xs font-medium">Memuat panduan pembayaran...</span>
                                                </div>
                                                <div v-else-if="channelInstructionGroups(ch.code).length"
                                                    class="space-y-4">
                                                    <!-- Tab panel when multiple platforms (e.g. Internet Banking, Aplikasi BRImo) -->
                                                    <div v-if="channelInstructionGroups(ch.code).length > 1"
                                                        class="flex gap-2 flex-wrap border-b border-gray-100 pb-2 mb-2">
                                                        <button
                                                            v-for="(group, gi) in channelInstructionGroups(ch.code)"
                                                            :key="group.title"
                                                            @click="setActiveInstructionTab(ch.code, gi)"
                                                            :class="getActiveInstructionTab(ch.code) === gi
                                                                ? 'bg-navy text-white border-navy'
                                                                : 'bg-white text-gray-500 border-gray-200 hover:border-navy/40'"
                                                            class="px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-colors">
                                                            {{ group.title }}
                                                        </button>
                                                    </div>
                                                    <!-- Steps for active tab (or only group) -->
                                                    <div
                                                        v-for="(group, gi) in channelInstructionGroups(ch.code)"
                                                        :key="group.title"
                                                        v-show="channelInstructionGroups(ch.code).length === 1 || getActiveInstructionTab(ch.code) === gi"
                                                        class="space-y-2.5">
                                                        <div v-if="channelInstructionGroups(ch.code).length > 1"
                                                            class="text-[10px] font-black text-gray-500 uppercase tracking-widest">
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
                                                    Panduan tidak tersedia. Setelah mendaftar, instruksi pembayaran akan muncul.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 flex gap-2">
                                        <Icon icon="ph:shield-check-bold"
                                            class="text-blue-500 shrink-0 text-sm mt-0.5" />
                                        <span
                                            class="text-[10px] text-blue-700 font-medium leading-relaxed block">Pembayaran
                                            aman via Tripay. Konfirmasi otomatis setelah pembayaran berhasil.</span>
                                    </div>
                                </div>

                                <!-- Manual: Bank Accounts -->
                                <div v-if="form.payment_type === 'manual'" class="space-y-4">
                                    <!-- Proof Upload -->
                                    <div>
                                        <span
                                            class="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 block">Unggah
                                            Bukti Transfer</span>
                                        <span class="text-xs text-gray-500 mb-3 block">Silakan unggah bukti transfer
                                            sesuai nominal pendaftaran. Bisa lebih dari satu foto.</span>

                                        <div class="grid grid-cols-3 gap-3 mb-3">
                                            <!-- Previews -->
                                            <div v-for="(img, idx) in paymentPreviews" :key="idx"
                                                class="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-100 group">
                                                <img :src="img.url" class="w-full h-full object-cover" />
                                                <div
                                                    class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button @click="removeProof(idx)"
                                                        class="bg-red-500 text-white rounded-lg p-1.5">
                                                        <Icon icon="ph:trash-bold" class="text-sm" />
                                                    </button>
                                                </div>
                                                <div v-if="img.uploading"
                                                    class="absolute inset-0 bg-white/80 flex items-center justify-center">
                                                    <Icon icon="ph:circle-notch-bold"
                                                        class="text-navy text-xl animate-spin" />
                                                </div>
                                            </div>

                                            <!-- Add Button -->
                                            <button v-if="isLoggedIn" @click="triggerProofUpload"
                                                class="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-navy hover:bg-navy/5 transition-all flex flex-col items-center justify-center gap-1.5">
                                                <Icon icon="ph:camera-plus-bold" class="text-2xl text-gray-400" />
                                                <span
                                                    class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tambah</span>
                                            </button>
                                        </div>

                                        <div class="p-3 bg-gray-50 border border-gray-100 rounded-xl flex gap-2.5">
                                            <Icon icon="ph:info-bold" class="text-navy shrink-0 mt-0.5 text-sm" />
                                            <span
                                                class="text-[10px] text-navy/70 font-medium leading-relaxed block">Pastikan
                                                tampilkan <strong>Nominal</strong>, <strong>Tanggal</strong>, dan
                                                <strong>Nama Pengirim</strong>. Format: JPG, PNG (Maks 5MB).</span>
                                        </div>
                                        <input ref="proofInput" type="file" multiple accept="image/*" class="hidden"
                                            @change="handleProofUpload" />
                                    </div>

                                    <!-- Bank Accounts -->
                                    <div>
                                        <span
                                            class="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 block">Rekening
                                            Tujuan</span>
                                        <div v-if="paymentMethods.length > 0" class="space-y-2">
                                            <div v-for="method in paymentMethods" :key="method.uuid"
                                                class="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                                                <div
                                                    class="h-9 w-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden p-1">
                                                    <img v-if="getPaymentMethodImage(method.payment_method)"
                                                        :src="getPaymentMethodImage(method.payment_method)"
                                                        class="w-full h-full object-contain" />
                                                    <Icon v-else icon="ph:bank-bold" class="text-navy" />
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <span class="font-bold text-navy text-sm leading-tight block">{{
                                                        method.payment_method }}</span>
                                                    <span v-if="method.account_name"
                                                        class="text-xs text-gray-500 font-medium block">{{
                                                            method.account_name
                                                        }}</span>
                                                    <span v-if="method.account_number"
                                                        class="text-xs font-mono font-bold text-navy bg-white border border-gray-200 px-2 py-0.5 rounded-md inline-block mt-0.5">
                                                        {{ method.account_number }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else
                                            class="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-2.5">
                                            <Icon icon="ph:warning-bold" class="text-amber-500 shrink-0" />
                                            <span class="text-xs text-amber-700 font-medium block">Penyelenggara belum
                                                menambahkan rekening. Pilih <strong>Bayar Online</strong>.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- CTA Submit -->
                        <div class="space-y-3">
                            <BaseButton @click="handleSubmit" :loading="loading" :disabled="!isFormValid" variant="navy"
                                size="lg" block>
                                Daftar Sekarang
                                <template #icon-right>
                                    <Icon icon="ph:arrow-right-bold" />
                                </template>
                            </BaseButton>
                            <span v-if="submitError" class="text-sm text-red-500 font-bold text-center block">{{
                                submitError }}</span>
                            <span
                                class="text-[10px] text-gray-400 text-center font-medium leading-relaxed block">Pendaftaran
                                akan diverifikasi oleh
                                penyelenggara dalam 1–3 hari kerja.</span>
                        </div>
                    </div>
                </div>
            </main>
        </template>
    </div>
</template>

<script setup>
definePageMeta({ layout: 'blank' })

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

        const formatDate = (d) => d ? useDateFormat(d, 'DD MMM YYYY', { locales: 'id-ID' }).value : ''

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
        throw createError({ statusCode: 500, message: 'Gagal memuat data pendaftaran' })
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

// Auto-redirect to Tripay checkout after 4s
watch(registrationSuccess, (val) => {
    if (!val || !paymentResult.value?.checkout_url) return
    redirectCountdown.value = 4
    const interval = setInterval(() => {
        redirectCountdown.value--
        if (redirectCountdown.value <= 0) {
            clearInterval(interval)
            window.location.href = paymentResult.value.checkout_url
        }
    }, 1000)
})

const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text).catch(() => { })
}

const form = ref({
    category_ids: [],
    payment_amount: 0,
    payment_proofs: [],
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
    { title: 'Pria', value: 'male' },
    { title: 'Wanita', value: 'female' }
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
    const paymentProofProvided = (event.value.registration_fee > 0 && form.value.payment_type === 'manual')
        ? form.value.payment_proofs.length > 0
        : true
    const channelSelected = event.value.registration_fee > 0 && form.value.payment_type === 'online'
        ? !!form.value.online_channel
        : true
    return categoriesSelected && archerProfileExists && profileComplete && paymentProofProvided && channelSelected
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

const triggerProofUpload = () => {
    if (!isLoggedIn.value) return
    proofInput.value?.click()
}

const handleProofUpload = async (ev) => {
    const files = Array.from(ev.target.files)
    if (!files.length) return
    for (const file of files) {
        if (file.size > 5 * 1024 * 1024) { alert(`File ${file.name} terlalu besar (Maks 5MB)`); continue }
        const reader = new FileReader()
        const previewId = Date.now() + Math.random()
        reader.onload = (e) => paymentPreviews.value.push({ id: previewId, url: e.target.result, uploading: true })
        reader.readAsDataURL(file)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('caption', 'payment-proof')
        try {
            const response = await upload('/media/upload', formData)
            const idx = paymentPreviews.value.findIndex(p => p.id === previewId)
            if (idx !== -1) { paymentPreviews.value[idx].uploading = false; paymentPreviews.value[idx].finalUrl = response.url }
            form.value.payment_proofs.push(response.url)
        } catch (err) {
            paymentPreviews.value = paymentPreviews.value.filter(p => p.id !== previewId)
            alert(`Upload gagal: ${err?.data?.error || err?.message || 'Gagal mengunggah'}`)
        }
    }
    ev.target.value = ''
}

const removeProof = (index) => {
    const removed = paymentPreviews.value[index].finalUrl
    paymentPreviews.value.splice(index, 1)
    form.value.payment_proofs = form.value.payment_proofs.filter(u => u !== removed)
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
        if (!athleteId) { submitError.value = 'Profil pemanah tidak lengkap. Silakan login ulang.'; return }

        const payload = {
            athlete_id: athleteId,
            event_category_ids: form.value.category_ids,
            payment_amount: form.value.payment_amount || 0,
            payment_proof_urls: form.value.payment_proofs,
            payment_type: form.value.payment_type
        }

        const response = await post(`/events/${event.value.id}/participants`, payload)

        // For online payment: call Tripay with chosen channel
        if (form.value.payment_type === 'online' && (response.registration_id || response.uuid)) {
            const registrationId = response.registration_id || response.uuid
            try {
                const payResult = await post('/payment/create', {
                    type: 'registration',
                    registration_id: registrationId,
                    event_id: event.value.id,
                    method: form.value.online_channel
                })
                paymentResult.value = payResult
                registrationSuccess.value = true
            } catch (payErr) {
                // Registration succeeded but payment link failed - still show success
                registrationSuccess.value = true
            }
            return
        }

        registrationSuccess.value = true
    } catch (err) {
        submitError.value = err.response?.data?.error || err.data?.error || err.message || 'Gagal melakukan pendaftaran.'
    } finally {
        loading.value = false
    }
}

useSeoMeta({
    title: () => `Daftar ${event.value?.name || 'Event'} - Archeryhub.id`,
    description: () => `Konfirmasi pendaftaran untuk ${event.value?.name || 'event'}`
})
</script>

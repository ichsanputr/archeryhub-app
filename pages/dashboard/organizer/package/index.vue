<template>
    <div class="space-y-8 pb-12">
        <!-- ── Header ── -->
        <DashboardHeader
            :title="t('organizer_subscription.page_title')"
            :subtitle="t('organizer_subscription.subtitle')"
            icon="ph:crown-simple-bold"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/organizer' },
                { label: t('organizer_subscription.breadcrumb') }
            ]"
        />

        <!-- ── Section 1: Quota Balance Cards ── -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Free Tier Quota Card -->
            <div class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div class="flex items-start justify-between gap-4 mb-5">
                    <div class="space-y-1">
                        <span class="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black tracking-wider capitalize">
                            {{ t('organizer_subscription.free_tier_badge', 'Bonus Awal Registrasi') }}
                        </span>
                        <h3 class="text-lg font-black text-navy pt-1">{{ t('organizer_subscription.free_tier_title', 'Free Tier') }}</h3>
                        <div class="text-xs text-slate-500">{{ t('organizer_subscription.free_tier_desc', 'Kuota gratis untuk event klub & latihan internal') }}</div>
                    </div>
                    <div class="size-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-navy shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                        <Icon icon="ph:gift-bold" class="text-2xl text-emerald-600" />
                    </div>
                </div>

                <div class="flex items-baseline gap-2 mb-6">
                    <span class="text-4xl font-black text-navy">{{ quota.quota_free ?? 20 }}</span>
                    <span class="text-xs font-bold text-slate-500">{{ t('organizer_subscription.free_tier_slot', '/ 20 slot tersedia') }}</span>
                </div>

                <div class="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-medium">
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-emerald-500 text-base shrink-0" />
                        <span v-html="t('organizer_subscription.free_tier_feat_1', 'Maksimal <strong>50 Peserta</strong> per event')"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-emerald-500 text-base shrink-0" />
                        <span v-html="t('organizer_subscription.free_tier_feat_2', 'Maksimal <strong>2 Kategori Lomba</strong>')"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-emerald-500 text-base shrink-0" />
                        <span v-html="t('organizer_subscription.free_tier_feat_3', '<strong>1 Scorekeeper</strong> Digital')"></span>
                    </div>
                </div>
            </div>

            <!-- Standard Quota Card -->
            <div class="bg-white rounded-2xl border border-primary/20 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div class="flex items-start justify-between gap-4 mb-5">
                    <div class="space-y-1">
                        <span class="inline-block px-2.5 py-0.5 bg-primary/10 text-navy border border-primary/20 rounded-lg text-[10px] font-black tracking-wider capitalize">
                            {{ t('organizer_subscription.standard_tier_badge') }}
                        </span>
                        <h3 class="text-lg font-black text-navy pt-1">{{ t('organizer_subscription.standard_title') }}</h3>
                        <div class="text-xs text-slate-500">{{ t('organizer_subscription.standard_desc') }}</div>
                    </div>
                    <div class="size-12 rounded-xl bg-slate-50 border border-primary/20 flex items-center justify-center text-navy shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                        <Icon icon="ph:lightning-bold" class="text-2xl text-navy" />
                    </div>
                </div>

                <div class="flex items-baseline gap-2 mb-6">
                    <span class="text-4xl font-black text-navy">{{ quota.quota_standard || 0 }}</span>
                    <span class="text-xs font-bold text-slate-500">{{ t('organizer_subscription.slot_available') }}</span>
                </div>

                <div class="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-medium">
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                        <span v-html="t('organizer_subscription.std_feat_1')"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                        <span v-html="t('organizer_subscription.std_feat_2')"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                        <span v-html="t('organizer_subscription.std_feat_3')"></span>
                    </div>
                </div>
            </div>
            
            <!-- Elite Quota Card -->
            <div class="bg-white rounded-2xl border border-primary/20 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div class="flex items-start justify-between gap-4 mb-5">
                    <div class="space-y-1">
                        <span class="inline-block px-2.5 py-0.5 bg-primary/15 text-navy border border-primary/30 rounded-lg text-[10px] font-black tracking-wider capitalize">
                            {{ t('organizer_subscription.elite_tier_badge') }}
                        </span>
                        <h3 class="text-lg font-black text-navy pt-1">{{ t('organizer_subscription.elite_title') }}</h3>
                        <div class="text-xs text-slate-500">{{ t('organizer_subscription.elite_desc') }}</div>
                    </div>
                    <div class="size-12 rounded-xl bg-slate-50 border border-primary/20 flex items-center justify-center text-navy shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                        <Icon icon="ph:crown-simple-bold" class="text-2xl text-navy" />
                    </div>
                </div>

                <div class="flex items-baseline gap-2 mb-6">
                    <span class="text-4xl font-black text-navy">{{ quota.quota_elite || 0 }}</span>
                    <span class="text-xs font-bold text-slate-500">{{ t('organizer_subscription.slot_available') }}</span>
                </div>

                <div class="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-medium">
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                        <span v-html="t('organizer_subscription.elite_feat_1')"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                        <span v-html="t('organizer_subscription.elite_feat_2')"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                        <span v-html="t('organizer_subscription.elite_feat_3')"></span>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Section 2: Buy Quota Interactive Builder ── -->
        <div class="bg-white rounded-2xl border border-primary/20 p-6 sm:p-8 shadow-sm space-y-8">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                    <h3 class="text-xl font-black text-navy flex items-center gap-2">
                        <Icon icon="ph:shopping-cart-simple-bold" class="text-primary text-2xl" />
                        <span>{{ t('organizer_subscription.buy_title') }}</span>
                    </h3>
                    <div class="text-xs text-slate-500 mt-1">{{ t('organizer_subscription.buy_subtitle') }}</div>
                </div>
                <div class="flex items-center gap-2 text-xs font-bold text-navy bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl">
                    <Icon icon="ph:shield-check-bold" class="text-primary text-base" />
                    <span>{{ t('organizer_subscription.instant_activation') }}</span>
                </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- Left Configuration (7 cols) -->
                <div class="lg:col-span-7 space-y-8">
                    
                    <!-- 1. Tier Selection -->
                    <div class="space-y-3">
                        <label class="text-xs font-black text-slate-400 capitalize tracking-widest">
                            {{ t('organizer_subscription.step_tier') }}
                        </label>
                        
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div @click="selectedTier = 'standard'"
                                :class="[
                                    'p-5 rounded-xl border-2 cursor-pointer transition-all relative flex flex-col justify-between',
                                    selectedTier === 'standard' 
                                        ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-xs' 
                                        : 'border-slate-200 hover:border-primary/40 bg-white'
                                ]">
                                <div class="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 class="font-black text-navy text-base">{{ t('organizer_subscription.standard_tier_name', 'Standard') }}</h4>
                                        <div class="text-[11px] text-slate-500 mt-0.5">{{ t('organizer_subscription.standard_capacity') }}</div>
                                    </div>
                                    <div class="size-6 rounded-full flex items-center justify-center text-xs"
                                        :class="selectedTier === 'standard' ? 'bg-primary text-navy font-black' : 'border border-slate-300 text-transparent'">
                                        <Icon icon="ph:check-bold" />
                                    </div>
                                </div>
                                <div class="pt-3 border-t border-slate-200/60 mt-3">
                                    <div class="flex items-center gap-2 mb-0.5">
                                        <span class="text-xs text-slate-400 font-bold line-through">
                                            Rp 49.900
                                        </span>
                                        <span class="text-[9px] font-black uppercase text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                                            {{ t('organizer_subscription.promo_badge_50', 'PROMO 50% OFF') }}
                                        </span>
                                    </div>
                                    <div class="text-lg font-black text-navy">
                                        Rp 24.950
                                        <span class="text-[10px] font-bold text-slate-500">{{ t('organizer_subscription.per_event') }}</span>
                                    </div>
                                    <div class="text-[10px] text-amber-700 font-medium mt-1">
                                        {{ t('organizer_subscription.promo_subtext', 'Diskon launching 50% untuk semua tier') }}
                                    </div>
                                </div>
                            </div>

                            <div @click="selectedTier = 'elite'"
                                :class="[
                                    'p-5 rounded-xl border-2 cursor-pointer transition-all relative flex flex-col justify-between',
                                    selectedTier === 'elite' 
                                        ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-xs' 
                                        : 'border-slate-200 hover:border-primary/40 bg-white'
                                ]">
                                <div class="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 class="font-black text-navy text-base">{{ t('organizer_subscription.elite_tier_name', 'Elite') }}</h4>
                                        <div class="text-[11px] text-slate-500 mt-0.5">{{ t('organizer_subscription.elite_capacity') }}</div>
                                    </div>
                                    <div class="size-6 rounded-full flex items-center justify-center text-xs"
                                        :class="selectedTier === 'elite' ? 'bg-primary text-navy font-black' : 'border border-slate-300 text-transparent'">
                                        <Icon icon="ph:check-bold" />
                                    </div>
                                </div>
                                <div class="pt-3 border-t border-slate-200/60 mt-3">
                                    <div class="flex items-center gap-2 mb-0.5">
                                        <span class="text-xs text-slate-400 font-bold line-through">
                                            Rp 79.900
                                        </span>
                                        <span class="text-[9px] font-black uppercase text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                                            {{ t('organizer_subscription.promo_badge_50', 'PROMO 50% OFF') }}
                                        </span>
                                    </div>
                                    <div class="text-lg font-black text-navy">
                                        Rp 39.950
                                        <span class="text-[10px] font-bold text-slate-500">{{ t('organizer_subscription.per_event') }}</span>
                                    </div>
                                    <div class="text-[10px] text-amber-700 font-medium mt-1">
                                        {{ t('organizer_subscription.promo_subtext', 'Diskon launching 50% untuk semua tier') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 2. Quantity & Bundle (Custom Slot Input) -->
                    <div class="space-y-3">
                        <div class="flex items-center justify-between flex-wrap gap-2">
                            <label class="text-xs font-black text-slate-400 capitalize tracking-widest">
                                {{ t('organizer_subscription.step_qty') }}
                            </label>
                            <span v-if="discountPct > 0" class="text-[11px] font-black text-navy bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                                {{ t('organizer_subscription.save_with_bundle', { pct: discountPct }) }}
                            </span>
                        </div>

                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <button v-for="qty in [1, 3, 5]" :key="qty"
                                type="button"
                                @click="setPresetQty(qty)"
                                :class="[
                                    'p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1',
                                    (!isCustomQty && selectedQty === qty) 
                                        ? 'border-primary bg-navy text-white shadow-xs' 
                                        : 'border-slate-200 text-navy hover:border-primary/40 bg-white'
                                ]">
                                <span class="text-lg font-black">{{ qty }} {{ t('organizer_subscription.event_unit', 'Event') }}</span>
                                <span class="text-[10px] font-bold" :class="(!isCustomQty && selectedQty === qty) ? 'text-primary' : 'text-slate-500'">
                                    {{ qty === 1 ? t('organizer_subscription.single_package') : t('organizer_subscription.save_pct', { pct: {3: 7, 5: 12}[qty] }) }}
                                </span>
                            </button>
                            <button
                                type="button"
                                @click="enableCustomQty"
                                :class="[
                                    'p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1',
                                    isCustomQty 
                                        ? 'border-primary bg-navy text-white shadow-xs' 
                                        : 'border-slate-200 text-navy hover:border-primary/40 bg-white'
                                ]">
                                <span class="text-lg font-black">{{ t('organizer_subscription.custom_tier_name', 'Custom') }}</span>
                                <span class="text-[10px] font-bold" :class="isCustomQty ? 'text-primary' : 'text-slate-500'">
                                    {{ t('organizer_subscription.custom_slot_label', 'Tentukan Sendiri') }}
                                </span>
                            </button>
                        </div>

                        <!-- Custom Slot Input Box -->
                        <div v-if="isCustomQty" class="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div class="space-y-0.5">
                                <label class="text-xs font-black text-navy">{{ t('organizer_subscription.custom_slot_title', 'Jumlah Slot Event Kustom:') }}</label>
                                <div class="text-[11px] text-slate-500">{{ t('organizer_subscription.custom_slot_desc', 'Tentukan jumlah kuota turnamen yang ingin Anda miliki') }}</div>
                            </div>
                            <div class="flex items-center gap-2">
                                <input
                                    v-model.number="customQtyInput"
                                    type="number"
                                    min="1"
                                    max="500"
                                    class="w-28 h-10 px-3 bg-white border border-slate-300 rounded-xl font-black text-navy text-center text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    @input="onCustomQtyChange"
                                />
                                <span class="text-xs font-bold text-navy">{{ t('organizer_subscription.slot_event_unit', 'Slot Event') }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Payment Method -->
                    <div class="space-y-4">
                        <label class="text-xs font-black text-slate-400 capitalize tracking-widest">
                            {{ t('organizer_subscription.step_payment') }}
                        </label>
                        
                        <div class="p-4 rounded-2xl border-2 border-primary bg-primary/5 flex items-center gap-4 text-left">
                            <div class="size-12 rounded-xl bg-navy text-primary flex items-center justify-center shrink-0 shadow-xs">
                                <Icon icon="ph:shield-check-bold" class="text-2xl" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="font-black text-navy text-sm flex items-center gap-2">
                                    <span>Mayar Payment Gateway</span>
                                    <span class="text-[10px] font-bold bg-primary/20 text-navy px-2 py-0.5 rounded-full">Instan & Aman</span>
                                </div>
                                <div class="text-[11px] text-slate-500 mt-0.5">Mendukung QRIS, Virtual Account (BCA, Mandiri, BRI, BNI, Permata), dan E-Wallet</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Checkout Summary (5 cols) -->
                <div class="lg:col-span-5">
                    <div class="sticky top-24 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white rounded-2xl p-6 sm:p-7 border border-primary/20 shadow-lg relative overflow-hidden space-y-6">
                        <div class="absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-primary/10 blur-2xl pointer-events-none"></div>

                        <!-- Header -->
                        <div class="flex items-center justify-between border-b border-white/10 pb-4">
                            <h4 class="font-black text-white text-base tracking-tight">{{ t('organizer_subscription.order_summary') }}</h4>
                            <span class="text-[10px] font-mono font-bold text-primary capitalize bg-primary/10 px-2 py-0.5 rounded border border-primary/20">ArcheryHub EO</span>
                        </div>

                        <!-- Details breakdown -->
                        <div class="space-y-3 text-xs">
                            <div class="flex justify-between items-center">
                                <span class="text-slate-400 font-medium">{{ t('organizer_subscription.selected_package') }}</span>
                                <span class="font-black text-white capitalize bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                                    {{ selectedTier }} Tier ({{ selectedQty }} Event)
                                </span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-slate-400 font-medium">{{ t('organizer_subscription.unit_price_label') }}</span>
                                <span class="font-bold text-slate-200">
                                    Rp {{ new Intl.NumberFormat('id-ID').format(basePrice) }}
                                </span>
                            </div>
                            <div v-if="discountPct > 0" class="flex justify-between items-center text-primary font-bold">
                                <span>{{ t('organizer_subscription.bundle_discount', { pct: discountPct }) }}</span>
                                <span>- Rp {{ new Intl.NumberFormat('id-ID').format((basePrice * selectedQty) - totalIDR) }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-slate-400 font-medium">{{ t('organizer_subscription.payment_method_label') }}</span>
                                <span class="font-bold text-slate-200 capitalize">
                                    Mayar (QRIS / VA / E-Wallet)
                                </span>
                            </div>
                        </div>

                        <!-- Total & CTA Box (Integrated together with zero awkward gap) -->
                        <div class="pt-5 border-t border-white/10 space-y-4">
                            <div class="flex justify-between items-end">
                                <div>
                                    <div class="text-[10px] font-black capitalize text-slate-400 tracking-wider">{{ t('organizer_subscription.total_payment') }}</div>
                                    <div class="text-[11px] text-slate-400 mt-0.5">{{ t('organizer_subscription.total_payment_desc') }}</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl sm:text-3xl font-black text-primary leading-none">
                                        Rp {{ new Intl.NumberFormat('id-ID').format(totalIDR) }}
                                    </div>
                                </div>
                            </div>

                            <BaseButton @click="buyQuota" variant="primary" :loading="isPurchasing" 
                                class="w-full h-12 shadow-md shadow-primary/20 text-xs sm:text-sm font-black tracking-wider flex items-center justify-center gap-2">
                                <span>{{ t('organizer_subscription.pay_now') }}</span>
                                <Icon icon="ph:arrow-right-bold" class="text-base" />
                            </BaseButton>

                            <div class="flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center pt-1">
                                <Icon icon="ph:lock-simple-bold" class="text-primary text-xs" />
                                <span>{{ t('organizer_subscription.ssl_note') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Section 3: Purchase History Table ── -->
        <div class="bg-white rounded-2xl border border-primary/20 overflow-hidden shadow-sm">
            <div class="p-6 sm:p-7 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 class="text-base font-black text-navy">{{ t('organizer_subscription.history_title') }}</h3>
                    <div class="text-xs text-slate-500 mt-0.5">{{ t('organizer_subscription.history_subtitle') }}</div>
                </div>
                <div class="text-xs font-bold text-navy bg-primary/10 border border-primary/20 px-3 py-1 rounded-lg">
                    {{ t('organizer_subscription.total_transactions', { n: history.length }) }}
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr class="bg-slate-50/70 text-slate-400 font-black tracking-wider border-b border-slate-100">
                            <th class="py-3.5 px-5">{{ t('organizer_subscription.col_date') }}</th>
                            <th class="py-3.5 px-5">{{ t('organizer_subscription.col_package') }}</th>
                            <th class="py-3.5 px-5">{{ t('organizer_subscription.col_qty') }}</th>
                            <th class="py-3.5 px-5">{{ t('organizer_subscription.col_total') }}</th>
                            <th class="py-3.5 px-5">{{ t('organizer_subscription.col_method') }}</th>
                            <th class="py-3.5 px-5 text-center">{{ t('organizer_subscription.col_status') }}</th>
                            <th class="py-3.5 px-5 text-right">{{ t('organizer_subscription.col_action', 'Aksi') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="item in history" :key="item.id || item.uuid" class="hover:bg-slate-50/50 transition-colors">
                            <td class="py-4 px-5 text-slate-500 font-medium">{{ formatDate(item.purchased_at || item.created_at) }}</td>
                            <td class="py-4 px-5 font-bold text-navy capitalize">
                                <div class="flex items-center gap-2">
                                    <Icon :icon="(item.plan_name && item.plan_name.toLowerCase().includes('elite')) ? 'ph:crown-simple-bold' : 'ph:lightning-bold'" 
                                        class="text-base text-primary" />
                                    <span>{{ item.plan_name || (item.plan_id === 7 ? 'Standard Event' : 'Elite Event') }}</span>
                                </div>
                            </td>
                            <td class="py-4 px-5 font-bold text-navy">{{ item.quantity }} {{ t('organizer_subscription.slot_unit') }}</td>
                            <td class="py-4 px-5 font-black text-navy">
                                {{ item.currency === 'USD' ? '$' + (item.amount || item.total_amount) : 'Rp ' + new Intl.NumberFormat('id-ID').format(item.amount || item.total_amount || 0) }}
                            </td>
                            <td class="py-4 px-5 capitalize font-medium text-slate-500">{{ item.payment_method || 'Mayar' }}</td>
                            <td class="py-4 px-5 text-center">
                                <span :class="[
                                    'px-3 py-1 text-[10px] font-black rounded-lg capitalize inline-block border',
                                    (item.payment_status === 'paid' || item.status === 'paid' || item.status === 'success') 
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                        : 'bg-amber-50 text-amber-800 border-amber-200'
                                ]">
                                    {{ (item.payment_status === 'paid' || item.status === 'paid' || item.status === 'success') ? t('organizer_subscription.status_paid', 'Lunas') : t('organizer_subscription.status_pending', 'Menunggu Pembayaran') }}
                                </span>
                            </td>
                            <td class="py-4 px-5 text-right">
                                <NuxtLink :to="`/dashboard/organizer/package/detail?trx_id=${item.payment_reference || item.id || item.uuid}`"
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy hover:bg-navy-dark text-white text-xs font-bold transition-all shadow-2xs">
                                    <Icon icon="ph:receipt-bold" />
                                    <span>{{ t('organizer_subscription.btn_pay_detail', 'Detail Bayar') }}</span>
                                </NuxtLink>
                            </td>
                        </tr>
                        <tr v-if="!history.length && !isLoadingHistory">
                            <td colspan="7" class="py-14 text-center">
                                <div class="flex flex-col items-center justify-center gap-3 max-w-md mx-auto">
                                    <div class="size-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                        <Icon icon="ph:receipt-x-bold" class="text-3xl text-slate-400" />
                                    </div>
                                    <div class="space-y-1">
                                        <div class="text-sm font-bold text-navy">{{ t('organizer_subscription.no_history', 'Belum Ada Riwayat Pembelian') }}</div>
                                        <div class="text-xs text-slate-400 font-medium leading-relaxed">
                                            {{ t('organizer_subscription.no_history_desc', 'Riwayat pembelian kuota Standard & Elite akan tercatat di sini. Kuota Free (Bonus Awal) digunakan langsung tanpa transaksi pembelian.') }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="isLoadingHistory">
                            <td colspan="7" class="py-12 text-center text-slate-400">
                                <Icon icon="ph:spinner-gap-bold" class="text-3xl mx-auto mb-2 animate-spin text-primary" />
                                <div>{{ t('organizer_subscription.loading_history', 'Memuat riwayat transaksi...') }}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Bar -->
            <div v-if="total > 0" class="p-4 sm:p-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
                <div class="text-xs text-slate-500 font-medium">
                    {{ t('organizer_subscription.history_page_info', { from: (page - 1) * limit + 1, to: Math.min(page * limit, total), total: total }) }}
                </div>

                <div class="flex items-center gap-1.5">
                    <button 
                        type="button"
                        @click="changePage(page - 1)"
                        :disabled="page <= 1 || isLoadingHistory"
                        class="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-2xs">
                        <Icon icon="ph:caret-left-bold" />
                        <span>{{ t('organizer_subscription.btn_prev', 'Sebelumnya') }}</span>
                    </button>

                    <div class="flex items-center gap-1 px-1">
                        <button 
                            v-for="p in visiblePages" :key="p"
                            type="button"
                            @click="changePage(p)"
                            :class="page === p ? 'bg-navy text-white font-black shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-gray-200 font-bold'"
                            class="size-8 rounded-xl text-xs flex items-center justify-center transition-all">
                            {{ p }}
                        </button>
                    </div>

                    <button 
                        type="button"
                        @click="changePage(page + 1)"
                        :disabled="page >= totalPages || isLoadingHistory"
                        class="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-2xs">
                        <span>{{ t('organizer_subscription.btn_next', 'Selanjutnya') }}</span>
                        <Icon icon="ph:caret-right-bold" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useI18n } from 'vue-i18n'

definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()
useHead({ title: computed(() => t('organizer_subscription.page_title') + ' - ArcheryHub') })

const { get, post } = useApi()
const quota = ref({ quota_free: 20, quota_standard: 0, quota_elite: 0 })
const history = ref([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const totalPages = ref(1)
const isLoadingHistory = ref(false)

const selectedTier = ref('standard')
const selectedQty = ref(1)
const isCustomQty = ref(false)
const customQtyInput = ref(10)
const setPresetQty = (qty) => {
    isCustomQty.value = false
    selectedQty.value = qty
}

const enableCustomQty = () => {
    isCustomQty.value = true
    selectedQty.value = Math.max(1, customQtyInput.value || 1)
}

const onCustomQtyChange = () => {
    selectedQty.value = Math.max(1, customQtyInput.value || 1)
}
const isPurchasing = ref(false)

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
    })
}

async function loadHistory(targetPage = 1) {
    isLoadingHistory.value = true
    page.value = targetPage
    try {
        const h = await get(`/organizers/me/quota/history?limit=${limit.value}&page=${page.value}`)
        if (h) {
            history.value = h.data || (Array.isArray(h) ? h : [])
            total.value = h.total !== undefined ? h.total : history.value.length
            totalPages.value = h.total_pages || Math.ceil(total.value / limit.value) || 1
        }
    } catch (e) {
        console.error(e)
    } finally {
        isLoadingHistory.value = false
    }
}

function changePage(newPage) {
    if (newPage < 1 || newPage > totalPages.value) return
    loadHistory(newPage)
}

const visiblePages = computed(() => {
    const pages = []
    const start = Math.max(1, page.value - 2)
    const end = Math.min(totalPages.value, start + 4)
    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    return pages
})

onMounted(async () => {
    try { const q = await get('/organizers/me/quota'); if (q) quota.value = q } catch (e) {}
    loadHistory(1)
})

const basePrice = computed(() => selectedTier.value === 'standard' ? 24950 : 39950)
const basePriceUSD = computed(() => selectedTier.value === 'standard' ? 1.50 : 2.50)

const discountPct = computed(() => {
    const q = selectedQty.value
    if (q >= 10) return 20
    if (q >= 5) return 12
    if (q >= 3) return 7
    return 0
})

const totalIDR = computed(() => {
    return Math.round(basePrice.value * selectedQty.value * (1 - discountPct.value / 100))
})

const totalUSD = computed(() => {
    return (basePriceUSD.value * selectedQty.value * (1 - discountPct.value / 100)).toFixed(2)
})

const toast = useToast()
const router = useRouter()

async function buyQuota() {
    isPurchasing.value = true
    try {
        const plan_id = selectedTier.value === 'standard' ? 7 : 8
        const res = await post('/organizers/me/quota/purchase', {
            plan_id,
            quantity: selectedQty.value,
            currency: 'IDR'
        })
        
        const trxRef = res?.purchase_id || res?.reference || res?.transaction_id || ''
        toast.success(t('organizer_subscription.order_success_toast', 'Pesanan paket kuota berhasil dibuat'))
        if (res?.checkout_url) {
            window.location.href = res.checkout_url
        } else {
            router.push(`/dashboard/organizer/package/detail?trx_id=${trxRef}`)
        }
    } catch (e) {
        console.error(e)
        toast.error(e?.data?.error || t('organizer_subscription.buy_error', 'Gagal memproses pembelian paket kuota.'))
    } finally {
        isPurchasing.value = false
    }
}
</script>

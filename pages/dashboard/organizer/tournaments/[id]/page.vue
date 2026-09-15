<template>
    <div class="flex flex-col gap-8">
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />
        
        <!-- Header -->
        <DashboardHeader
            :title="t('dashboard_events_page.title', 'Pengaturan Halaman Event')"
            :subtitle="t('dashboard_events_page.subtitle', 'Atur konten, jadwal, lokasi, galeri, dan tampilan publik halaman event Anda.')"
            icon="ph:browser-bold"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/organizer' },
                { label: t('events.list.title', 'Event Saya'), to: '/dashboard/organizer/tournaments' },
                { label: t('dashboard_events_page.title', 'Halaman Event') }
            ]"
        >
            <template #actions>
                <div class="flex flex-col sm:flex-row gap-3 shrink-0">
                    <BaseButton variant="white" icon="ph:eye-bold" :to="`/tournaments/${eventData.slug}`" target="_blank"
                        class="h-10 sm:h-11 px-5 border-white/20 text-xs sm:text-sm font-bold">
                        {{ t('dashboard_events_page.view_button', 'Pratinjau Halaman') }}
                    </BaseButton>
                    <BaseButton variant="primary" icon="ph:floppy-disk-bold"
                        @click="isSubscriptionActive ? saveEventPage() : (showPremiumModal = true)"
                        :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                        :loading="saving"
                        class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all text-xs sm:text-sm font-black tracking-widest">
                        {{ t('dashboard_events_page.save_button', 'Simpan Perubahan') }}
                    </BaseButton>
                </div>
            </template>
        </DashboardHeader>

        <!-- Tabs Navigation -->
        <div class="flex gap-1 bg-gray-100/80 rounded-2xl p-1.5 overflow-x-auto no-scrollbar shadow-sm mt-2">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                :class="activeTab === tab.id ? 'bg-white shadow text-navy' : 'text-gray-500 hover:text-navy hover:bg-white/50'"
                class="flex items-center justify-center gap-2 flex-1 min-w-[120px] px-5 py-2.5 rounded-xl text-sm font-black transition-all">
                <Icon :icon="tab.icon" class="text-lg sm:text-xl shrink-0" />
                <span>{{ $t(`dashboard_events_page.tabs.${tab.id}`) }}</span>
            </button>
        </div>

        <div v-if="activeTab === 'faq'" class="space-y-6">
            <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h2 class="text-base sm:text-lg font-bold text-navy flex items-center gap-2">
                        <Icon icon="ph:question" class="text-primary text-lg sm:text-xl" />
                        {{ $t('dashboard_events_page.faq.title') }}
                    </h2>
                    <BaseButton variant="outline" size="xs" @click="addFAQField">
                        <Icon icon="ph:plus-bold" class="mr-1" /> {{ $t('dashboard_events_page.faq.add') }}
                    </BaseButton>
                </div>
                    <div class="p-4 sm:p-6 space-y-4">
                        <div v-if="form.faq?.length === 0"
                        class="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div class="text-sm text-gray-500">{{ $t('dashboard_events_page.faq.no_items') }}</div>
                    </div>
                    <div v-else class="space-y-4">
                        <div v-for="(item, index) in form.faq" :key="index"
                            class="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative group">
                            <button @click="removeFAQField(index)"
                                class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                                <Icon icon="ph:trash" />
                            </button>
                            <div class="space-y-4">
                                            <div class="space-y-2">
                                                <label class="text-xs font-bold text-gray-400  tracking-widest">{{ $t('dashboard_events_page.faq.question_label') }}</label>
                                                <input v-model="item.question" type="text"
                                                    :placeholder="$t('dashboard_events_page.faq.question_placeholder')"
                                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                            </div>
                                            <div class="space-y-2">
                                                <label class="text-xs font-bold text-gray-400  tracking-widest">{{ $t('dashboard_events_page.faq.answer_label') }}</label>
                                                <textarea v-model="item.answer" rows="3"
                                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all"
                                                    :placeholder="$t('dashboard_events_page.faq.answer_placeholder')"></textarea>
                                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Main Content -->
        <div class="space-y-6">
            <!-- Informasi Tab -->
            <div v-if="activeTab === 'informasi'" class="space-y-6">
                <section class="relative z-20 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
                    <div class="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl overflow-hidden">
                        <h2 class="text-base sm:text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:info" class="text-primary text-lg sm:text-xl" />
                            {{ $t('dashboard_events_page.information.basic_title') }}
                        </h2>
                    </div>
                    <div class="p-4 sm:p-6 space-y-5">
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">{{ $t('dashboard_events_page.information.name_label') }}</label>
                            <input v-model="form.name" type="text"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                :placeholder="$t('dashboard_events_page.information.name_placeholder')" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-bold text-gray-700">{{ $t('dashboard_events_page.information.description_label') }}</label>
                            <TiptapEditor v-model="form.description" class="min-h-[300px]" />
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">{{ $t('dashboard_events_page.information.start_date_label') }}</label>
                                <div class="grid grid-cols-2 gap-2">
                                    <BaseDatePicker :model-value="getSchedDate(form, 'start_date')" @update:model-value="val => setSchedDate(form, 'start_date', val)" />
                                    <BaseTimePicker :model-value="getSchedTime(form, 'start_date')" @update:model-value="val => setSchedTime(form, 'start_date', val)" placeholder="08:00" />
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">{{ $t('dashboard_events_page.information.end_date_label') }}</label>
                                <div class="grid grid-cols-2 gap-2">
                                    <BaseDatePicker :model-value="getSchedDate(form, 'end_date')" @update:model-value="val => setSchedDate(form, 'end_date', val)" />
                                    <BaseTimePicker :model-value="getSchedTime(form, 'end_date')" @update:model-value="val => setSchedTime(form, 'end_date', val)" placeholder="17:00" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <BaseSelect v-model="form.status" :items="statusOptions" :label="$t('dashboard_events_page.information.status_label')" />
                        </div>
                    </div>
                </section>
            </div>

            <!-- Pendaftaran Tab -->
            <div v-if="activeTab === 'pendaftaran'" class="space-y-6">

                <!-- Waktu Pendaftaran -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
                    <div class="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                        <h2 class="text-base sm:text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:calendar-check" class="text-primary text-lg sm:text-xl" />
                            {{ $t('dashboard_events_page.registration.timeline_title') }}
                        </h2>
                    </div>
                    <div class="p-4 sm:p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                                    <Icon icon="ph:calendar-blank-bold" class="text-primary text-base" />
                                    {{ $t('dashboard_events_page.registration.start_label') }}
                                </label>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <BaseDatePicker :model-value="getSchedDate(form.page_settings, 'registration_start')" @update:model-value="val => setSchedDate(form.page_settings, 'registration_start', val)" />
                                    <BaseTimePicker :model-value="getSchedTime(form.page_settings, 'registration_start')" @update:model-value="val => setSchedTime(form.page_settings, 'registration_start', val)" placeholder="08:00" />
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                                    <Icon icon="ph:calendar-check-bold" class="text-primary text-base" />
                                    {{ $t('dashboard_events_page.registration.end_label') }}
                                </label>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <BaseDatePicker :model-value="getSchedDate(form, 'registration_deadline')" @update:model-value="val => setSchedDate(form, 'registration_deadline', val)" />
                                    <BaseTimePicker :model-value="getSchedTime(form, 'registration_deadline')" @update:model-value="val => setSchedTime(form, 'registration_deadline', val)" placeholder="23:59" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Fee Mode Selector + Config -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50">
                        <h2 class="text-base sm:text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:ticket" class="text-primary text-lg sm:text-xl" />
                            {{ $t('dashboard_events_page.registration.fee_title') }}
                        </h2>
                    </div>
                    <div class="p-4 sm:p-6 space-y-6">

                        <!-- Mode Selector -->
                        <div class="space-y-3">
                            <label class="text-sm font-bold text-gray-700">{{ $t('dashboard_events_page.registration.fee_mode_label') }}</label>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <!-- Mode: Per Participant Type -->
                                <button type="button"
                                    @click="form.fee_mode = 'per_type'"
                                    :class="form.fee_mode === 'per_type'
                                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'"
                                    class="flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all">
                                    <div :class="form.fee_mode === 'per_type' ? 'bg-primary text-navy' : 'bg-gray-100 text-gray-500'"
                                        class="size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                                        <Icon icon="ph:users-three-bold" class="text-xl" />
                                    </div>
                                    <div>
                                        <div class="text-sm font-black text-navy">{{ $t('dashboard_events_page.registration.mode_per_type_title') }}</div>
                                        <div class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ $t('dashboard_events_page.registration.mode_per_type_desc') }}</div>
                                    </div>
                                    <div v-if="form.fee_mode === 'per_type'" class="ml-auto shrink-0">
                                        <Icon icon="ph:check-circle-fill" class="text-primary text-xl" />
                                    </div>
                                </button>

                                <!-- Mode: Per Category -->
                                <button type="button"
                                    @click="form.fee_mode = 'per_category'"
                                    :class="form.fee_mode === 'per_category'
                                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'"
                                    class="flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all">
                                    <div :class="form.fee_mode === 'per_category' ? 'bg-primary text-navy' : 'bg-gray-100 text-gray-500'"
                                        class="size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                                        <Icon icon="ph:stack-bold" class="text-xl" />
                                    </div>
                                    <div>
                                        <div class="text-sm font-black text-navy">{{ $t('dashboard_events_page.registration.mode_per_cat_title') }}</div>
                                        <div class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ $t('dashboard_events_page.registration.mode_per_cat_desc') }}</div>
                                    </div>
                                    <div v-if="form.fee_mode === 'per_category'" class="ml-auto shrink-0">
                                        <Icon icon="ph:check-circle-fill" class="text-primary text-xl" />
                                    </div>
                                </button>
                            </div>
                        </div>

                        <!-- ── MODE: Per Participant Type ── -->
                        <div v-if="form.fee_mode === 'per_type'" class="space-y-4">
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <!-- Individual -->
                                <div class="space-y-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div class="flex items-center gap-2 mb-3">
                                        <div class="size-8 rounded-lg bg-navy/10 flex items-center justify-center">
                                            <Icon icon="ph:user-bold" class="text-navy text-sm" />
                                        </div>
                                        <label class="text-sm font-black text-navy">{{ $t('dashboard_events_page.registration.individual') }}</label>
                                    </div>
                                    <div class="relative">
                                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">Rp</span>
                                        <input v-model.number="form.fee_per_type.individual" type="number" min="0"
                                            placeholder="0"
                                            class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                    </div>
                                    <div class="text-[10px] text-gray-400">{{ $t('dashboard_events_page.registration.individual_desc') }}</div>
                                </div>
                                <!-- Team -->
                                <div class="space-y-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div class="flex items-center gap-2 mb-3">
                                        <div class="size-8 rounded-lg bg-navy/10 flex items-center justify-center">
                                            <Icon icon="ph:users-bold" class="text-navy text-sm" />
                                        </div>
                                        <label class="text-sm font-black text-navy">{{ $t('dashboard_events_page.registration.team') }}</label>
                                    </div>
                                    <div class="relative">
                                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">Rp</span>
                                        <input v-model.number="form.fee_per_type.team" type="number" min="0"
                                            placeholder="0"
                                            class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                    </div>
                                    <div class="text-[10px] text-gray-400">{{ $t('dashboard_events_page.registration.team_desc') }}</div>
                                </div>
                                <!-- Mixed Team -->
                                <div class="space-y-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div class="flex items-center gap-2 mb-3">
                                        <div class="size-8 rounded-lg bg-navy/10 flex items-center justify-center">
                                            <Icon icon="ph:users-three-bold" class="text-navy text-sm" />
                                        </div>
                                        <label class="text-sm font-black text-navy">{{ $t('dashboard_events_page.registration.mixed_team') }}</label>
                                    </div>
                                    <div class="relative">
                                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">Rp</span>
                                        <input v-model.number="form.fee_per_type.mixed_team" type="number" min="0"
                                            placeholder="0"
                                            class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                    </div>
                                    <div class="text-[10px] text-gray-400">{{ $t('dashboard_events_page.registration.mixed_team_desc') }}</div>
                                </div>
                            </div>
                            <!-- entry_fee fallback note removed -->
                        </div>

                        <!-- ── MODE: Per Category ── -->
                        <div v-if="form.fee_mode === 'per_category'" class="space-y-4">
                            <div v-if="eventCategories.length === 0"
                                class="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <Icon icon="ph:stack" class="text-3xl text-gray-300 mx-auto mb-2" />
                                <div class="text-xs text-gray-400 font-bold">{{ $t('dashboard_events_page.registration.no_categories') }}</div>
                                <div class="text-xs text-gray-400 mt-1">{{ $t('dashboard_events_page.registration.no_categories_desc') }}</div>
                                <BaseButton variant="outline" size="xs" class="mt-3" :to="`/dashboard/organizer/tournaments/${eventId}/categories`">
                                    <Icon icon="ph:plus-bold" class="mr-1" /> {{ $t('dashboard_events_page.registration.add_category') }}
                                </BaseButton>
                            </div>

                            <div v-else class="space-y-2">
                                <div v-for="cat in eventCategories" :key="cat.id"
                                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/20 transition-all">
                                    <!-- Category Icon -->
                                    <div class="h-10 w-10 rounded-xl border border-gray-100 bg-white flex items-center justify-center shadow-sm shrink-0 overflow-hidden p-1.5">
                                        <img :src="'/' + getCategoryIcon(`${cat.division_name} ${cat.event_type_name} ${cat.gender_division_name}`)"
                                            :alt="cat.division_name"
                                            class="w-full h-full object-contain" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="text-sm font-bold text-navy truncate">
                                            {{ cat.category_name }} – {{ cat.event_type_name }} – {{ cat.gender_division_name }}
                                        </div>
                                        <div class="text-[10px] text-gray-400">{{ cat.division_name }}</div>
                                    </div>
                                    <div class="relative shrink-0 w-36">
                                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">Rp</span>
                                        <input
                                            :value="form.fee_per_category[cat.id] ?? 0"
                                            @input="form.fee_per_category[cat.id] = Number($event.target.value)"
                                            type="number" min="0" placeholder="0"
                                            class="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                    </div>
                                </div>
                            </div>

                            <!-- Default fallback fee -->
                            <div class="pt-4 border-t border-gray-100 space-y-2">
                                <label class="text-sm font-bold text-gray-700">{{ $t('dashboard_events_page.registration.default_fee_label') }}</label>
                                <div class="relative max-w-xs">
                                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">Rp</span>
                                    <input v-model.number="form.entry_fee" type="number" min="0" placeholder="0"
                                        class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                </div>
                                <div class="text-[10px] text-gray-400">{{ $t('dashboard_events_page.registration.default_fee_desc') }}</div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Manual Payment Method Section -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h2 class="text-base sm:text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:credit-card" class="text-primary text-lg sm:text-xl" />
                            {{ $t('dashboard_events_page.manual_payment.title') }}
                        </h2>
                    </div>
                    <div class="p-4 sm:p-6 space-y-4">
                        <div class="text-xs text-gray-500 text-left">
                            {{ $t('dashboard_events_page.manual_payment.description') }}
                        </div>

                        <!-- Preview of configured bank accounts -->
                        <div class="mt-4 border-t border-gray-100 pt-4">
                            <h4 class="text-xs font-black text-gray-400 tracking-wider mb-3 text-left ">{{ $t('dashboard_events_page.manual_payment.list_title') }}</h4>
                            <div v-if="orgBankAccounts.length === 0" class="text-xs text-amber-600 bg-amber-50 border border-amber-100 p-4 rounded-2xl text-left flex items-start gap-2.5">
                                <Icon icon="ph:warning-circle-bold" class="text-lg shrink-0 mt-0.5" />
                                <div>
                                    <span class="font-bold">{{ $t('dashboard_events_page.manual_payment.warning') }}</span> {{ $t('dashboard_events_page.manual_payment.no_accounts_warning') }}
                                    <NuxtLink to="/dashboard/organizer/payment-methods" class="font-bold underline text-primary hover:text-navy block mt-1">{{ $t('dashboard_events_page.manual_payment.configure_link') }}</NuxtLink>
                                </div>
                            </div>
                            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div v-for="bank in orgBankAccounts" :key="bank.uuid || bank.id"
                                    @click="togglePaymentMethod(bank.uuid || bank.id)"
                                    :class="isPaymentMethodEnabled(bank.uuid || bank.id) ? 'border-primary/40 bg-primary/5' : 'border-gray-100 bg-gray-50/50 opacity-60'"
                                    class="flex items-center justify-between p-4 rounded-2xl border cursor-pointer hover:border-primary/20 transition-all shadow-sm">
                                    <div class="flex items-center gap-3.5 min-w-0">
                                        <div class="size-11 bg-white rounded-xl flex items-center justify-center border border-gray-100 shrink-0 p-1.5 shadow-sm">
                                            <img v-if="getPaymentMethodImage(bank.bank_name)" :src="getPaymentMethodImage(bank.bank_name)" class="w-full h-full object-contain" :alt="bank.bank_name" />
                                            <Icon v-else icon="ph:credit-card" class="text-xl text-navy" />
                                        </div>
                                        <div class="text-left min-w-0">
                                            <div class="text-sm font-black text-navy truncate">{{ bank.bank_name }} - {{ bank.account_number }}</div>
                                            <div class="text-xs text-gray-400 font-bold mt-0.5 truncate">a.n. {{ bank.account_name }}</div>
                                        </div>
                                    </div>
                                    <button type="button"
                                        :class="isPaymentMethodEnabled(bank.uuid || bank.id) ? 'bg-primary' : 'bg-gray-200'"
                                        class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">
                                        <span :class="isPaymentMethodEnabled(bank.uuid || bank.id) ? 'translate-x-5 bg-navy' : 'translate-x-0 bg-white'"
                                            class="pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out">
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50">
                        <h2 class="text-base sm:text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:trophy-bold" class="text-primary text-lg sm:text-xl" />
                            {{ $t('dashboard_events_page.prizes.title') }}
                        </h2>
                    </div>
                    <div class="p-4 sm:p-6 space-y-5">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                                    <Icon icon="ph:currency-circle-dollar-bold" class="text-primary text-base" />
                                    {{ $t('dashboard_events_page.prizes.total_prize_label') }}
                                </label>
                                <div class="relative">
                                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">Rp</span>
                                    <input v-model.number="form.total_prize" type="number" min="0" placeholder="0"
                                        class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold" />
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                                    <Icon icon="ph:book-bookmark-bold" class="text-primary text-base" />
                                    {{ $t('dashboard_events_page.prizes.guidebook_label') }}
                                </label>
                                <div class="flex items-center gap-2">
                                    <input type="text" :value="form.technical_guidebook_url ? 'Guidebook.pdf' : ''"
                                        readonly
                                        class="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm italic"
                                        :placeholder="$t('dashboard_events_page.prizes.no_file')" />
                                    <input type="file" ref="guidebookInput" class="hidden" accept=".pdf"
                                        @change="handleGuidebookUpload" />
                                    <BaseButton variant="outline" size="sm" icon="ph:upload-simple-bold" @click="$refs.guidebookInput.click()"
                                        :loading="uploadingGuidebook">{{ $t('dashboard_events_page.prizes.upload') }}</BaseButton>
                                </div>
                            </div>
                        </div>
                        <div class="pt-4 border-t border-gray-100">
                            <label class="text-sm font-bold text-gray-700 mb-3 block">{{ $t('dashboard_events_page.prizes.detail_title') }}</label>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-gray-600">{{ $t('dashboard_events_page.prizes.first_place') }}</label>
                                    <input v-model="form.prizes.first" type="text" :placeholder="$t('dashboard_events_page.prizes.placeholder_prize')"
                                        class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" />
                                    <textarea v-model="form.prizes.first_caption" rows="2"
                                        :placeholder="$t('dashboard_events_page.prizes.placeholder_caption')"
                                        class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-xs resize-none"></textarea>
                                </div>
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-gray-600">{{ $t('dashboard_events_page.prizes.second_place') }}</label>
                                    <input v-model="form.prizes.second" type="text" :placeholder="$t('dashboard_events_page.prizes.placeholder_prize')"
                                        class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" />
                                    <textarea v-model="form.prizes.second_caption" rows="2"
                                        :placeholder="$t('dashboard_events_page.prizes.placeholder_caption')"
                                        class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-xs resize-none"></textarea>
                                </div>
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-gray-600">{{ $t('dashboard_events_page.prizes.third_place') }}</label>
                                    <input v-model="form.prizes.third" type="text" :placeholder="$t('dashboard_events_page.prizes.placeholder_prize')"
                                        class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" />
                                    <textarea v-model="form.prizes.third_caption" rows="2"
                                        :placeholder="$t('dashboard_events_page.prizes.placeholder_caption')"
                                        class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-xs resize-none"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Lokasi Tab -->
            <section v-if="activeTab === 'lokasi'"
                class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 class="text-base sm:text-lg font-bold text-navy flex items-center gap-2">
                        <Icon icon="ph:map-pin" class="text-primary text-lg sm:text-xl" />
                        {{ $t('dashboard_events_page.location.title') }}
                    </h2>
                </div>
                <div class="p-4 sm:p-6 space-y-5">
                    <div class="space-y-2">
                        <label class="text-sm font-bold text-gray-700 flex items-center gap-1">
                            {{ $t('dashboard_events_page.location.venue_label') }}
                            <span class="text-red-500">*</span>
                        </label>
                        <input v-model="form.venue" type="text" required
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                            :placeholder="$t('dashboard_events_page.location.venue_placeholder')" />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-bold text-gray-700 flex items-center gap-1">
                            {{ $t('dashboard_events_page.location.address_label') }}
                            <span class="text-red-500">*</span>
                        </label>
                        <textarea v-model="form.address" rows="2" required
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all font-medium"
                            :placeholder="$t('dashboard_events_page.location.address_placeholder') || 'Tuliskan alamat lengkap lokasi event...'"></textarea>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-bold text-gray-700 flex items-center gap-1">
                            {{ $t('dashboard_events_page.location.gmaps_label') }}
                            <span class="text-red-500">*</span>
                        </label>
                        <input v-model="form.gmaps_link" type="url" required
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                            placeholder="https://maps.app.goo.gl/pxDpbaZ1GTtXHTD28" />
                        <div v-if="gmapsEmbedUrl"
                             class="mt-4 rounded-xl overflow-hidden border border-gray-200 aspect-video">
                            <iframe width="100%" height="100%" style="border:0" loading="lazy"
                                    :src="gmapsEmbedUrl"></iframe>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <label class="text-sm font-bold text-gray-700">{{ $t('dashboard_events_page.location.accessibility_title') }}</label>
                        <div class="text-xs text-gray-500 mb-3">{{ $t('dashboard_events_page.location.accessibility_desc') }}</div>
                        <div class="flex flex-wrap gap-2">
                            <button v-for="option in locationAccessibilityOptions" :key="option" type="button"
                                @click="toggleLocationAccessibility(option)"
                                class="px-4 py-2 rounded-xl text-sm font-bold transition-all border-2" :class="form.location_accessibility?.includes(option)
                                    ? 'bg-primary text-navy border-primary shadow-sm'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-navy'">
                                <Icon :icon="getLocationAccessibilityIcon(option)" class="inline-block mr-1.5" />
                                {{ $t('dashboard_events_page.location.options.' + locationAccessibilityOptionKeys[option]) }}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Media Tab -->
            <div v-if="activeTab === 'media'" class="space-y-6">
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50">
                        <h2 class="text-base sm:text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:image" class="text-primary text-lg sm:text-xl" />
                            {{ $t('dashboard_events_page.media.title') }}
                        </h2>
                    </div>
                    <div class="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                        <div class="space-y-3">
                            <label class="text-sm font-bold text-gray-700 flex items-center justify-between">
                                <span>{{ $t('dashboard_events_page.media.banner_label') }}</span>
                                <span class="text-xs font-bold text-gray-400 font-body">{{ $t('dashboard_events_page.media.banner_ratio') }}</span>
                            </label>
                            <div v-if="form.banner_url" class="relative rounded-xl overflow-hidden aspect-video group">
                                <img :src="form.banner_url" class="w-full h-full object-cover" />
                                <div
                                    class="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button @click="openMediaLibrary('banner')"
                                        class="p-2 bg-white rounded-lg text-navy font-bold text-xs">{{ $t('dashboard_events_page.media.change') }}</button>
                                    <button @click="form.banner_url = ''"
                                        class="p-2 bg-red-500 rounded-lg text-white font-bold text-xs">{{ $t('dashboard_events_page.media.delete') }}</button>
                                </div>
                            </div>
                            <button v-else @click="openMediaLibrary('banner')"
                                class="w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-primary flex flex-col items-center justify-center text-gray-400">
                                <Icon icon="ph:image-bold" class="text-3xl mb-2" />
                                <span class="text-xs font-bold">{{ $t('dashboard_events_page.media.select_banner') }}</span>
                            </button>
                        </div>
                        <div class="space-y-3">
                            <label class="text-sm font-bold text-gray-700 flex items-center justify-between">
                                <span>{{ $t('dashboard_events_page.media.poster_label') }}</span>
                                <span class="text-xs font-bold text-gray-400 font-body">{{ $t('dashboard_events_page.media.poster_ratio') }}</span>
                            </label>
                            <div v-if="form.logo_url" class="relative rounded-xl overflow-hidden aspect-video group">
                                <img :src="form.logo_url" class="w-full h-full object-cover" />
                                <div
                                    class="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button @click="openMediaLibrary('logo')"
                                        class="p-2 bg-white rounded-lg text-navy font-bold text-xs">{{ $t('dashboard_events_page.media.change') }}</button>
                                    <button @click="form.logo_url = ''"
                                        class="p-2 bg-red-500 rounded-lg text-white font-bold text-xs">{{ $t('dashboard_events_page.media.delete') }}</button>
                                </div>
                            </div>
                            <button v-else @click="openMediaLibrary('logo')"
                                class="w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-primary flex flex-col items-center justify-center text-gray-400">
                                <Icon icon="ph:image-square-bold" class="text-3xl mb-2" />
                                <span class="text-xs font-bold">{{ $t('dashboard_events_page.media.select_poster') }}</span>
                            </button>
                        </div>
                    </div>
                </section>

                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50">
                        <h2 class="text-base sm:text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:images" class="text-primary text-lg sm:text-xl" />
                            {{ $t('dashboard_events_page.media.gallery_title') }}
                        </h2>
                    </div>
                    <div class="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                        <div v-for="(image, index) in form.event_images" :key="index"
                            class="relative aspect-square rounded-lg overflow-hidden border border-gray-100 group">
                            <img :src="image.url" class="w-full h-full object-cover" />
                            <button @click="removeImage(index)"
                                class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                <Icon icon="ph:trash" class="text-xs" />
                            </button>
                        </div>
                        <button @click="openMediaLibrary('gallery')"
                            class="aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-primary flex items-center justify-center text-gray-400">
                            <Icon icon="ph:plus-bold" />
                        </button>
                    </div>
                </section>
            </div>

            <!-- Jadwal Tab -->
            <section v-if="activeTab === 'jadwal'"
                class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
                <div class="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl flex items-center justify-between">
                    <h2 class="text-base sm:text-lg font-bold text-navy flex items-center gap-2">
                        <Icon icon="ph:calendar-bold" class="text-primary text-lg sm:text-xl" />
                        {{ $t('dashboard_events_page.schedule.title') }}
                    </h2>
                    <BaseButton variant="outline" size="xs" @click="addScheduleField">
                        <Icon icon="ph:plus-bold" class="mr-1" /> {{ $t('dashboard_events_page.schedule.add') }}
                    </BaseButton>
                </div>
                <div class="p-4 sm:p-6 space-y-4">
                    <div v-if="form.schedules.length === 0"
                        class="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div class="text-sm text-gray-400">{{ $t('dashboard_events_page.schedule.empty') }}</div>
                    </div>
                    <div v-else class="space-y-4">
                        <div v-for="(session, index) in form.schedules" :key="index"
                            class="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100 relative group">
                            <button @click="removeScheduleField(index)"
                                class="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                                <Icon icon="ph:trash" />
                            </button>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <div class="lg:col-span-2 space-y-1">
                                    <label class="text-[10px] font-bold text-gray-400 ">{{ $t('dashboard_events_page.schedule.session_title') }}</label>
                                    <input v-model="session.title" type="text" placeholder="Contoh: Kualifikasi Recurve"
                                        class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-bold text-gray-400 ">{{ $t('dashboard_events_page.schedule.day_order') }}</label>
                                    <input v-model.number="session.day_order" type="number"
                                        class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-bold text-gray-400 ">{{ $t('dashboard_events_page.schedule.start_time') }}</label>
                                    <div class="flex flex-col gap-1">
                                        <BaseDatePicker :model-value="getSchedDate(session, 'start_time')" @update:model-value="val => setSchedDate(session, 'start_time', val)" />
                                        <BaseTimePicker :model-value="getSchedTime(session, 'start_time')" @update:model-value="val => setSchedTime(session, 'start_time', val)" placeholder="08:00" />
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-bold text-gray-400 ">{{ $t('dashboard_events_page.schedule.end_time') }}</label>
                                    <div class="flex flex-col gap-1">
                                        <BaseDatePicker :model-value="getSchedDate(session, 'end_time')" @update:model-value="val => setSchedDate(session, 'end_time', val)" />
                                        <BaseTimePicker :model-value="getSchedTime(session, 'end_time')" @update:model-value="val => setSchedTime(session, 'end_time', val)" placeholder="17:00" />
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-bold text-gray-400 ">{{ $t('dashboard_events_page.schedule.location') }}</label>
                                    <input v-model="session.location" type="text"
                                        class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                                </div>
                                <div class="lg:col-span-3 space-y-1">
                                    <label class="text-[10px] font-bold text-gray-400 ">{{ $t('dashboard_events_page.schedule.description_optional') }}</label>
                                    <textarea v-model="session.description" rows="2"
                                        class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none"
                                        placeholder="Deskripsi sesi..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Hasil Tab -->
        <div v-if="activeTab === 'hasil'" class="space-y-6">
            <!-- Results Source Selector -->
            <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 class="text-base sm:text-lg font-black text-navy flex items-center gap-2 sm:gap-3">
                        <div class="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                            <Icon icon="iconoir:leaderboard" class="text-lg sm:text-xl" />
                        </div>
                        {{ $t('dashboard_events_page.results.source_title') }}
                    </h2>
                    <div class="text-xs text-gray-400 mt-1.5 font-medium">{{ $t('dashboard_events_page.results.source_desc') }}
                        halaman publik event.</div>
                </div>
                <div class="p-4 sm:p-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button @click="form.page_settings.results_type = 'system'" type="button"
                            class="relative p-4 sm:p-5 rounded-2xl border-2 text-left transition-all group"
                            :class="form.page_settings.results_type === 'system' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                                    :class="form.page_settings.results_type === 'system' ? 'bg-navy text-primary' : 'bg-gray-100 text-gray-400'">
                                    <Icon icon="ph:chart-bar-bold" class="text-xl" />
                                </div>
                                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                                    :class="form.page_settings.results_type === 'system' ? 'border-primary' : 'border-gray-300'">
                                    <div v-if="form.page_settings.results_type === 'system'"
                                        class="w-2.5 h-2.5 rounded-full bg-primary"></div>
                                </div>
                            </div>
                            <h4 class="font-bold text-sm text-navy">{{ $t('dashboard_events_page.results.from_system') }}</h4>
                            <div class=" text-xs text-gray-400 mt-0.5 leading-relaxed">{{ $t('dashboard_events_page.results.from_system_desc') }}</div>
                        </button>
                        <button @click="form.page_settings.results_type = 'manual'" type="button"
                            class="relative p-4 sm:p-5 rounded-2xl border-2 text-left transition-all group"
                            :class="form.page_settings.results_type === 'manual' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                                    :class="form.page_settings.results_type === 'manual' ? 'bg-navy text-primary' : 'bg-gray-100 text-gray-400'">
                                    <Icon icon="ph:file-arrow-up-bold" class="text-xl" />
                                </div>
                                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                                    :class="form.page_settings.results_type === 'manual' ? 'border-primary' : 'border-gray-300'">
                                    <div v-if="form.page_settings.results_type === 'manual'"
                                        class="w-2.5 h-2.5 rounded-full bg-primary"></div>
                                </div>
                            </div>
                            <h4 class="font-bold text-sm text-navy">{{ $t('dashboard_events_page.results.manual_upload') }}</h4>
                            <div class=" text-xs text-gray-400 mt-0.5 leading-relaxed">{{ $t('dashboard_events_page.results.manual_upload_desc') }}</div>
                        </button>
                    </div>
                </div>
            </section>

            <!-- Manual Upload Section (Only when manual or both) -->
            <section v-if="form.page_settings.results_type === 'manual'"
                class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div
                    class="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                    <div>
                        <h2 class="text-base sm:text-lg font-black text-navy flex items-center gap-2 sm:gap-3">
                            <div class="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                                <Icon icon="ph:file-arrow-up-bold" class="text-lg sm:text-xl" />
                            </div>
                            {{ $t('dashboard_events_page.results.upload_doc_title') }}
                        </h2>
                        <div class="text-xs sm:text-sm text-gray-500 mt-1 font-medium">{{ $t('dashboard_events_page.results.upload_doc_desc') }}</div>
                    </div>
                    <BaseButton variant="primary" size="sm" icon="ph:plus-bold"
                        @click="$refs.resultsFileInput?.click()">
                        {{ $t('dashboard_events_page.results.add_file') }}
                    </BaseButton>
                </div>

                <div class="p-4 sm:p-8">
                    <!-- Upload Area (Compact when files exist) -->
                    <div v-if="!form.results || form.results.length === 0"
                        class="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                        @click="$refs.resultsFileInput?.click()" @dragover.prevent="isDragging = true"
                        @dragleave.prevent="isDragging = false" @drop.prevent="handleResultsDrop"
                        :class="isDragging ? 'border-primary bg-primary/5' : ''">
                        <div class="flex flex-col items-center gap-4">
                            <div
                                class="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm group-hover:shadow-primary/20 transition-all">
                                <Icon icon="ph:cloud-arrow-up"
                                    class="text-4xl text-gray-300 group-hover:text-primary" />
                            </div>
                            <div class="max-w-xs mx-auto">
                                <div class="text-base font-black text-navy group-hover:text-primary transition-colors">
                                    {{ $t('dashboard_events_page.results.upload_result_label') }}</div>
                                <div class="text-sm text-gray-500 mt-1 font-medium italic">{{ $t('dashboard_events_page.results.drag_drop_hint') }}</div>
                            </div>
                            <div class="flex gap-2">
                                <span
                                    class="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black  text-gray-400">{{ $t('dashboard_events_page.results.max_size_hint') }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Uploaded Files List (Revamped) -->
                    <div v-if="form.results && form.results.length > 0" class="space-y-6">
                        <div class="grid grid-cols-1 gap-4">
                            <div v-for="(file, index) in form.results" :key="index"
                                class="group relative bg-white rounded-2xl border border-gray-100 hover:border-primary/50 hover:shadow-sm hover:shadow-primary/5 transition-all p-4 sm:p-5">

                                <div class="flex gap-3 sm:gap-5">
                                    <!-- File Icon / Preview -->
                                    <div
                                        class="w-16 h-20 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        <Icon :icon="getFileIcon(file.url)" class="text-3xl" />
                                        <span class="text-[9px] font-black text-gray-400  mt-1">{{
                                            getFileExt(file.url) }}</span>
                                    </div>

                                    <!-- File Metadata & Actions -->
                                    <div class="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <div class="space-y-3">
                                            <!-- Title Input -->
                                            <div class="space-y-1">
                                                <label
                                                    class="text-[10px] font-black text-gray-400  tracking-widest pl-1">{{ $t('dashboard_events_page.results.display_title') }}</label>
                                                <input v-model="file.title" type="text"
                                                    placeholder="Contoh: Hasil Kualifikasi Recurve"
                                                    class="w-full px-3 py-2 text-sm font-bold text-navy bg-gray-50 border border-transparent focus:bg-white focus:border-primary rounded-lg outline-none transition-all" />
                                            </div>

                                            <!-- Filename Input -->
                                            <div class="space-y-1">
                                                <label
                                                    class="text-[10px] font-black text-gray-400  tracking-widest pl-1">{{ $t('dashboard_events_page.results.download_name') }}</label>
                                                <div class="flex items-center gap-2">
                                                    <input v-model="file.name" type="text" placeholder="nama-file"
                                                        class="flex-1 px-3 py-2  text-xs font-medium text-gray-500 bg-gray-50 border border-transparent focus:bg-white focus:border-primary rounded-lg outline-none transition-all" />
                                                    <span class="text-[10px] font-bold text-gray-400">.{{
                                                        getFileExt(file.url) }}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Footer Actions -->
                                        <div class="flex items-center justify-between mt-4">
                                            <div
                                                class="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                                                {{ formatFileSize(file.size) }}
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <a :href="file.url" target="_blank"
                                                    class="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                    title="Pratinjau">
                                                    <Icon icon="ph:eye-bold" class="text-lg" />
                                                </a>
                                                <button @click="removeResultFile(index)"
                                                    class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Hapus">
                                                    <Icon icon="ph:trash-bold" class="text-lg" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Add More Area -->
                            <div @click="$refs.resultsFileInput?.click()"
                                class="border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-primary hover:bg-primary/5 transition-all group cursor-pointer border-brand-border">
                                <div
                                    class="p-3 bg-gray-50 rounded-full group-hover:bg-navy group-hover:text-primary transition-all text-gray-400">
                                    <Icon icon="ph:plus-bold" class="text-xl" />
                                </div>
                                <div
                                                    class="text-xs font-black text-gray-400 mt-3  tracking-widest group-hover:text-primary">
                                                    {{ $t('dashboard_events_page.results.add_more') }}</div>
                            </div>
                        </div>
                    </div>

                    <input ref="resultsFileInput" type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png" multiple
                        @change="handleResultsUpload" />
                </div>
            </section>

            <!-- System Results Info (Only when system) -->
            <section v-if="form.page_settings.results_type === 'system'"
                class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-4 sm:p-6">
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                            <Icon icon="ph:info-bold" class="text-2xl text-blue-500" />
                        </div>
                        <div>
                            <h4 class="font-bold text-navy text-sm">{{ $t('dashboard_events_page.results.system_scoring_title') }}</h4>
                            <div class="text-xs text-gray-500 mt-1 leading-relaxed">
                                {{ $t('dashboard_events_page.results.system_scoring_desc') }}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Media Library Modal -->
        <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import TiptapEditor from '~/components/common/TiptapEditor.client.vue'
import MediaLibrary from '~/components/common/MediaLibrary.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import { useApi } from '~/composables/useApi'
import { getCategoryIcon } from '~/utils/logoArcheryCategory'
import { useSubscription } from '~/composables/useSubscription'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'
import { useI18n } from 'vue-i18n'

const { isSubscriptionActive } = useSubscription()
const showPremiumModal = ref(false)
const { t } = useI18n()

const statusOptions = computed(() => [
    { value: 'draft', title: computed(() => t('dashboard_events_page.status_options.draft')) },
    { value: 'active', title: computed(() => t('dashboard_events_page.status_options.active')) }
])

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: () => `${t('dashboard_events_page.title')} - Dashboard`
})

const route = useRoute()
const router = useRouter()
const eventId = route.params.id

const { get, put, post } = useApi()
const saving = ref(false)
const eventCategories = ref([])
const orgBankAccounts = ref([])


// Tab state
const tabs = [
    { id: 'informasi', name: 'Informasi', icon: 'ph:info' },
    { id: 'pendaftaran', name: 'Pendaftaran', icon: 'ph:ticket' },
    { id: 'lokasi', name: 'Lokasi', icon: 'ph:map-pin' },
    { id: 'media', name: 'Media', icon: 'ph:image' },
    { id: 'jadwal', name: 'Jadwal', icon: 'ph:calendar-bold' },
    { id: 'hasil', name: 'Hasil', icon: 'iconoir:leaderboard' },
    { id: 'faq', name: 'FAQ', icon: 'ph:question' }
]

const activeTab = ref('informasi')

// Media Library State
const showMediaLibrary = ref(false)
const mediaTarget = ref('') // 'banner', 'logo', or 'gallery'

const openMediaLibrary = (target) => {
    mediaTarget.value = target
    showMediaLibrary.value = true
}

const handleMediaSelect = (media) => {
    if (mediaTarget.value === 'banner') {
        form.value.banner_url = media.url
    } else if (mediaTarget.value === 'logo') {
        form.value.logo_url = media.url
    } else if (mediaTarget.value === 'gallery') {
        form.value.event_images.push({
            url: media.url,
            caption: media.caption || '',
            alt_text: media.caption || '',
            display_order: form.value.event_images.length,
            is_primary: false
        })
    }
    showMediaLibrary.value = false
}

const eventData = ref({
    slug: eventId,
    status: 'draft'
})

const locationAccessibilityOptions = [
    'Terjangkau Mobil/Motor',
    'Akses Transportasi Umum',
    'Parkir Luas',
    'Fasilitas Toilet',
    'Area Makan',
    'Tempat Duduk',
    'Akses Disabilitas',
    'Area Parkir Motor',
    'Area Parkir Mobil'
]

const locationAccessibilityOptionKeys = {
    'Terjangkau Mobil/Motor': 'car_motorcycle',
    'Akses Transportasi Umum': 'public_transport',
    'Parkir Luas': 'spacious_parking',
    'Fasilitas Toilet': 'toilet',
    'Area Makan': 'food_area',
    'Tempat Duduk': 'seating',
    'Akses Disabilitas': 'disability_access',
    'Area Parkir Motor': 'motorcycle_parking',
    'Area Parkir Mobil': 'car_parking'
}

const getLocationAccessibilityIcon = (option) => {
    const icons = {
        'Terjangkau Mobil/Motor': 'ph:car',
        'Akses Transportasi Umum': 'ph:bus',
        'Parkir Luas': 'ph:parking',
        'Fasilitas Toilet': 'ph:toilet',
        'Area Makan': 'ph:fork-knife',
        'Tempat Duduk': 'ph:chair',
        'Akses Disabilitas': 'ph:wheelchair',
        'Area Parkir Motor': 'ph:motorcycle',
        'Area Parkir Mobil': 'ph:car-simple'
    }
    return icons[option] || 'ph:check-circle'
}

const toggleLocationAccessibility = (option) => {
    if (!form.value.location_accessibility) {
        form.value.location_accessibility = []
    }
    const index = form.value.location_accessibility.indexOf(option)
    if (index > -1) {
        form.value.location_accessibility.splice(index, 1)
    } else {
        form.value.location_accessibility.push(option)
    }
}

const form = ref({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    venue: '',
    address: '',
    gmaps_link: '',
    banner_url: '',
    logo_url: '',
    event_images: [],
    fees: [],
    payment_methods: [],
    schedules: [],
    registration_deadline: '',
    entry_fee: 0,
    fee_mode: 'per_type',           // 'per_type' | 'per_category'
    fee_per_type: {
        individual: 0,
        team: 0,
        mixed_team: 0
    },
    fee_per_category: {},           // { [categoryId]: amount }
    location_type: '',
    status: 'draft',
    total_prize: 0,
    technical_guidebook_url: '',
    location_accessibility: [],
    prizes: {
        first: '',
        second: '',
        third: '',
        first_caption: '',
        second_caption: '',
        third_caption: ''
    },
    page_settings: {
        enable_manual_payment: true,
        sections: {
            about: true,
            divisions: true,
            fees: true,
            payment_methods: true,
            prizes: true,
            schedule: true,
            location: true,
            faq: true
        },
        results_type: 'system'
    },
    faq: [],
    results: []
})

const disciplines = ref([])

const addFAQField = () => {
    if (!form.value.faq) form.value.faq = []
    form.value.faq.push({
        question: '',
        answer: ''
    })
}

const removeFAQField = (index) => {
    form.value.faq.splice(index, 1)
}

const addFeeField = () => {
    if (!form.value.fees) {
        form.value.fees = []
    }
    form.value.fees.push({
        name: '',
        amount: 0,
        description: ''
    })
}

const removeFeeField = (index) => {
    form.value.fees.splice(index, 1)
}



const addScheduleField = () => {
    const lastSchedule = form.value.schedules.length > 0 ? form.value.schedules[form.value.schedules.length - 1] : null
    form.value.schedules.push({
        id: null,
        title: '',
        description: '',
        day_order: lastSchedule ? (lastSchedule.day_order || 1) : 1,
        sort_order: (form.value.schedules.length > 0 ? Math.max(...form.value.schedules.map(s => s.sort_order || 0)) : 0) + 1,
        location: '',
        start_time: '',
        end_time: ''
    })
}

const removeScheduleField = (index) => {
    form.value.schedules.splice(index, 1)
}

const uploadingGuidebook = ref(false)
const guidebookInput = ref(null)

const handleGuidebookUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
        const toast = useToast()
        toast.error(t('dashboard_events_page.toasts.only_pdf'))
        return
    }

    uploadingGuidebook.value = true
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('caption', `Guidebook ${form.value.name}`)

        const response = await post('/media/upload', formData, {
            headers: {
                // Fetch will handle the boundary automatically for FormData
            }
        })

        form.value.technical_guidebook_url = response.url
        const toast = useToast()
        toast.success(t('dashboard_events_page.toasts.guidebook_success'))
    } catch (err) {
        console.error('Upload failed:', err)
        const toast = useToast()
        toast.error(t('dashboard_events_page.toasts.guidebook_failed'))
    } finally {
        uploadingGuidebook.value = false
    }
}

// Results upload handling
const isDragging = ref(false)
const resultsFileInput = ref(null)

const handleResultsUpload = async (event) => {
    const files = Array.from(event.target.files || [])
    await uploadResultFiles(files)
}

const handleResultsDrop = async (event) => {
    isDragging.value = false
    const files = Array.from(event.dataTransfer.files || [])
    await uploadResultFiles(files)
}

const uploadResultFiles = async (files) => {
    const toast = useToast()
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    const maxSize = 10 * 1024 * 1024 // 10MB

    for (const file of files) {
        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            toast.error(t('dashboard_events_page.toasts.invalid_format', { name: file.name }).replace('{name}', file.name))
            continue
        }

        // Validate file size
        if (file.size > maxSize) {
            toast.error(t('dashboard_events_page.toasts.file_too_large', { name: file.name }).replace('{name}', file.name))
            continue
        }

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('caption', `Result - ${form.value.name}`)

            const response = await post('/media/upload', formData, {
                headers: {
                    // Fetch will handle the boundary automatically for FormData
                }
            })

            if (!form.value.results) {
                form.value.results = []
            }

            form.value.results.push({
                url: response.url,
                title: file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' '),
                name: file.name.replace(/\.[^/.]+$/, ""),
                size: file.size,
                type: file.type
            })

            toast.success(t('dashboard_events_page.toasts.file_success', { name: file.name }).replace('{name}', file.name))
        } catch (err) {
            console.error('Upload failed:', err)
            toast.error(t('dashboard_events_page.toasts.file_failed', { name: file.name }).replace('{name}', file.name))
        }
    }

    // Clear input
    if (resultsFileInput.value) {
        resultsFileInput.value.value = ''
    }
}

const removeResultFile = (index) => {
    form.value.results.splice(index, 1)
}

const getFileExt = (url) => {
    if (!url) return ''
    return url.split('.').pop()?.toLowerCase() || ''
}

const getFileIcon = (url) => {
    const ext = getFileExt(url)
    if (ext === 'pdf') return 'ph:file-pdf-duotone'
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'ph:file-image-duotone'
    return 'ph:file-duotone'
}

const getFileName = (url) => {
    if (!url) return 'Unknown'
    return url.split('/').pop() || 'Unknown'
}

const formatFileSize = (bytes) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Convert datetime string to datetime-local format
const formatToDatetimeLocal = (dateStr) => {
    if (!dateStr) return ''
    try {
        const date = new Date(dateStr)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
    } catch {
        return ''
    }
}

// Convert datetime-local format to ISO string for API
const formatFromDatetimeLocal = (datetimeLocal) => {
    if (!datetimeLocal) return null
    try {
        return new Date(datetimeLocal).toISOString()
    } catch {
        return null
    }
}

// Google Maps embed URL
const gmapsEmbedUrl = computed(() => {
    if (!form.value.gmaps_link) return null

    try {
        const url = new URL(form.value.gmaps_link)

        // Extract coordinates from URL if available
        const coordsMatch = form.value.gmaps_link.match(/[?&]q=([^&]+)/)
        if (coordsMatch) {
            const query = decodeURIComponent(coordsMatch[1])
            return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
        }

        // For maps.app.goo.gl or goo.gl links, try to extract place name
        if (url.hostname.includes('maps.app') || url.hostname === 'goo.gl' || url.hostname.includes('google.com')) {
            // Use venue name if available, otherwise use the full link
            const searchQuery = form.value.venue || form.value.gmaps_link
            return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
        }
    } catch (e) {
        // If URL parsing fails, use venue name or link as search query
        const searchQuery = form.value.venue || form.value.gmaps_link
        return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
    }

    return null
})


const removeImage = (index) => {
    form.value.event_images.splice(index, 1)
}

const fetchEventData = async () => {
    try {
        const response = await get(`/tournaments/${eventId}`)
        const data = response?.data || response

        if (data) {
            eventData.value = data

            // Fetch event images
            let eventImages = []
            try {
                const imagesRes = await get(`/tournaments/${eventId}/images`)
                eventImages = imagesRes?.images || imagesRes?.data?.images || []
            } catch (err) {
                console.error('Failed to fetch event images:', err)
            }

            // Fetch event categories
            try {
                const categoriesRes = await get(`/tournaments/${eventId}/categories`)
                eventCategories.value = categoriesRes?.events || categoriesRes?.data?.events || []
            } catch (err) {
                console.error('Failed to fetch event categories:', err)
                eventCategories.value = []
            }

            // Parse page settings safely (string/object) and normalize missing keys
            let parsedPageSettings = {}
            try {
                if (typeof data.page_settings === 'string') {
                    parsedPageSettings = data.page_settings ? JSON.parse(data.page_settings) : {}
                } else if (data.page_settings && typeof data.page_settings === 'object') {
                    parsedPageSettings = data.page_settings
                }
            } catch (error) {
                console.error('Failed to parse page_settings:', error)
                parsedPageSettings = {}
            }

            const sectionDefaults = {
                about: true,
                divisions: true,
                fees: true,
                payment_methods: true,
                prizes: true,
                schedule: true,
                location: true,
                faq: true
            }

            const regStartRaw = parsedPageSettings.registration_start || data.registration_start || data.created_at || ''
            const pageSettings = {
                enable_manual_payment: parsedPageSettings.enable_manual_payment !== false,
                ...parsedPageSettings,
                registration_start: regStartRaw ? formatToDatetimeLocal(regStartRaw) : '',
                sections: {
                    ...sectionDefaults,
                    ...(parsedPageSettings.sections || {})
                },
                results_type: parsedPageSettings.results_type || 'system'
            }

            // Parse FAQ
            let faq = []
            if (data.faq) {
                try {
                    faq = typeof data.faq === 'string' ? JSON.parse(data.faq) : data.faq
                } catch (e) {
                    console.error('Failed to parse FAQ:', e)
                }
            }

            const normalizedFees = Array.isArray(pageSettings.fees)
                ? pageSettings.fees
                : (Array.isArray(data.fees) ? data.fees : [])

            const normalizedPaymentMethods = Array.isArray(pageSettings.payment_methods)
                ? pageSettings.payment_methods
                : (orgBankAccounts.value.length > 0 ? orgBankAccounts.value.map(b => b.uuid || b.id) : [])

            const normalizedPrizes = (pageSettings.prizes && typeof pageSettings.prizes === 'object')
                ? pageSettings.prizes
                : (data.prizes && typeof data.prizes === 'object' ? data.prizes : {
                    first: '',
                    second: '',
                    third: '',
                    first_caption: '',
                    second_caption: '',
                    third_caption: ''
                })

            const normalizedResults = Array.isArray(pageSettings.results)
                ? pageSettings.results
                : (Array.isArray(data.results) ? data.results : [])

            // Fetch schedules
            let schedules = []
            try {
                const scheduleRes = await get(`/tournaments/${eventId}/schedule`)
                schedules = scheduleRes?.schedules || scheduleRes?.data?.schedules || []
            } catch (err) {
                console.error('Failed to fetch schedules:', err)
            }

            form.value = {
                name: data.name || data.title || '',
                description: data.description || '',
                start_date: formatToDatetimeLocal(data.start_date),
                end_date: formatToDatetimeLocal(data.end_date),
                venue: data.venue || data.location || '',
                address: data.address || '',
                gmaps_link: data.gmaps_link || data.gmap_link || '',
                banner_url: data.banner_url || data.image || '',
                logo_url: data.logo_url || '',
                event_images: eventImages.length > 0 ? eventImages.map(img => ({
                    url: img.url || '',
                    caption: img.caption || '',
                    alt_text: img.alt_text || '',
                    display_order: img.display_order || 0,
                    is_primary: img.is_primary || false
                })) : [],
                fees: normalizedFees,
                payment_methods: normalizedPaymentMethods,
                schedules: schedules.map(s => ({
                    id: s.id || s.uuid,
                    title: s.title || '',
                    description: s.description || '',
                    day_order: s.day_order || 1,
                    sort_order: s.sort_order || 1,
                    location: s.location || '',
                    start_time: formatToDatetimeLocal(s.start_time),
                    end_time: formatToDatetimeLocal(s.end_time)
                })),
                registration_deadline: formatToDatetimeLocal(data.registration_deadline),
                entry_fee: data.entry_fee || 0,
                fee_mode: pageSettings.fee_mode || 'per_type',
                fee_per_type: {
                    individual: pageSettings.fee_per_type?.individual ?? data.entry_fee ?? 0,
                    team: pageSettings.fee_per_type?.team ?? 0,
                    mixed_team: pageSettings.fee_per_type?.mixed_team ?? 0
                },
                fee_per_category: pageSettings.fee_per_category || {},
                location_type: data.location_type || data.discipline_name || '',
                status: data.status || 'draft',
                total_prize: data.total_prize || 0,
                technical_guidebook_url: data.technical_guidebook_url || '',
                location_accessibility: pageSettings.location_accessibility || [],
                prizes: normalizedPrizes,
                page_settings: pageSettings,
                faq: faq,
                results: normalizedResults
            }
        }
    } catch (error) {
        console.error('Failed to fetch event:', error)
    }
}

const saveEventPage = async () => {
    // Per-tab validation
    const toast = useToast()
    if (activeTab.value === 'informasi') {
        if (!form.value.name || !form.value.name.trim()) {
            toast.error(t('dashboard_events_page.toasts.fill_event_name', 'Mohon lengkapi Nama Event'))
            return
        }
    } else if (activeTab.value === 'lokasi') {
        if (!form.value.venue || !form.value.address || !form.value.gmaps_link) {
            toast.error(t('dashboard_events_page.toasts.fill_required', 'Mohon lengkapi Nama Venue, Alamat, dan Link Google Maps'))
            return
        }
    }

    saving.value = true
    try {
        // Sync entry_fee from fee_per_type.individual when in per_type mode
        const effectiveEntryFee = form.value.fee_mode === 'per_type'
            ? (form.value.fee_per_type.individual || 0)
            : (form.value.entry_fee || 0)

        // Prepare data for API
        const payload = {
            name: form.value.name,
            description: form.value.description,
            start_date: formatFromDatetimeLocal(form.value.start_date),
            end_date: formatFromDatetimeLocal(form.value.end_date),
            venue: form.value.venue,
            address: form.value.address,
            gmaps_link: form.value.gmaps_link,
            banner_url: form.value.banner_url,
            logo_url: form.value.logo_url,
            registration_deadline: formatFromDatetimeLocal(form.value.registration_deadline),
            entry_fee: effectiveEntryFee,
            location_type: form.value.location_type,
            status: form.value.status,
            total_prize: form.value.total_prize,
            technical_guidebook_url: form.value.technical_guidebook_url,
            faq: form.value.faq,
            fees: form.value.fees,
            schedules: form.value.schedules.map(s => ({
                ...s,
                start_time: formatFromDatetimeLocal(s.start_time),
                end_time: formatFromDatetimeLocal(s.end_time)
            })),
            page_settings: JSON.stringify({
                ...form.value.page_settings,
                registration_start: form.value.page_settings.registration_start ? formatFromDatetimeLocal(form.value.page_settings.registration_start) : null,
                location_accessibility: form.value.location_accessibility || [],
                fees: form.value.fees || [],
                payment_methods: form.value.payment_methods || [],
                prizes: form.value.prizes || {},
                results: form.value.results || [],
                fee_mode: form.value.fee_mode || 'per_type',
                fee_per_type: form.value.fee_per_type || { individual: 0, team: 0, mixed_team: 0 },
                fee_per_category: form.value.fee_per_category || {}
            })
        }

        await put(`/tournaments/${eventId}`, payload)

        // Save schedules separately
        if (form.value.schedules.length > 0) {
            try {
                await put(`/tournaments/${eventId}/schedule`, {
                    schedules: form.value.schedules.map(s => ({
                        id: s.id,
                        title: s.title,
                        description: s.description || null,
                        start_time: formatFromDatetimeLocal(s.start_time),
                        end_time: s.end_time ? formatFromDatetimeLocal(s.end_time) : null,
                        day_order: s.day_order || 1,
                        sort_order: s.sort_order || 1,
                        location: s.location || null
                    }))
                })
            } catch (err) {
                console.error('Failed to save schedules:', err)
            }
        }

        // Save event images separately
        if (form.value.event_images.length > 0) {
            try {
                await put(`/tournaments/${eventId}/images`, {
                    images: form.value.event_images.filter(img => img.url)
                })
            } catch (err) {
                console.error('Failed to save event images:', err)
            }
        }

        // Show success notification
        const toast = useToast()
        toast.success(t('dashboard_events_page.toasts.save_success'))

        // Refresh data to show updated values
        await fetchEventData()
    } catch (error) {
        console.error('Failed to save:', error)
        const toast = useToast()
        const errorMessage = error?.data?.error || error?.response?.data?.error || error?.message || t('dashboard_events_page.toasts.save_failed')
        toast.error(errorMessage)
    } finally {
        saving.value = false
    }
}

// Helper functions for divisions
const getDivisionIcon = (divisionName) => {
    const name = divisionName?.toLowerCase() || ''
    if (name.includes('recurve')) return 'ph:target'
    if (name.includes('compound')) return 'ph:target-bold'
    if (name.includes('barebow')) return 'ph:target-duotone'
    return 'ph:target'
}

const getDivisionDistance = (divisionName) => {
    const name = divisionName?.toLowerCase() || ''
    if (name.includes('recurve')) return '70m'
    if (name.includes('compound')) return '50m'
    if (name.includes('barebow')) return '50m'
    return 'Standard'
}

// Group categories by division
const groupedDivisions = computed(() => {
    const groups = {}
    eventCategories.value.forEach(cat => {
        const divName = cat.division_name || 'Lainnya'
        if (!groups[divName]) {
            groups[divName] = {
                name: divName,
                distance: getDivisionDistance(divName),
                categories: []
            }
        }
        groups[divName].categories.push(cat)
    })
    return Object.values(groups)
})

// Helper functions for payment methods
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
    { title: 'PayPal', value: 'PayPal', icon: 'ph:paypal-logo-bold', type: 'international' },
    { title: 'Wise', value: 'Wise', icon: 'ph:globe-bold', type: 'international' },
    { title: 'Revolut', value: 'Revolut', icon: 'ph:credit-card-bold', type: 'international' },
    { title: 'Payoneer', value: 'Payoneer', icon: 'ph:credit-card-bold', type: 'international' },
    { title: 'Bank Transfer (International / SWIFT)', value: 'International Transfer', icon: 'ph:bank-bold', type: 'bank' },
    { title: 'Credit / Debit Card', value: 'Credit Card', icon: 'ph:credit-card-bold', type: 'international' },
    { title: 'Lainnya / Custom', value: 'Custom', icon: 'ph:dots-three-circle-bold', type: 'custom' }
]

const getPaymentMethodImage = (bankName) => {
    const method = paymentMethodOptions.find(m => m.value === bankName)
    return method ? method.image : null
}

const fetchOrgBankAccounts = async () => {
    try {
        const bankRes = await get('/organizers/bank-accounts')
        orgBankAccounts.value = bankRes?.data || bankRes || []
    } catch (err) {
        console.error('Failed to fetch organizer bank accounts:', err)
        orgBankAccounts.value = []
    }
}

const isPaymentMethodEnabled = (bankUuid) => {
    if (!form.value.payment_methods) return false
    return form.value.payment_methods.includes(bankUuid)
}

const togglePaymentMethod = (bankUuid) => {
    if (!form.value.payment_methods) {
        form.value.payment_methods = []
    }
    const index = form.value.payment_methods.indexOf(bankUuid)
    if (index > -1) {
        form.value.payment_methods.splice(index, 1)
    } else {
        form.value.payment_methods.push(bankUuid)
    }
}


onMounted(async () => {
    // Fetch disciplines for location_type dropdown
    try {
        const discRes = await get('/disciplines')
        if (discRes?.disciplines) {
            disciplines.value = discRes.disciplines
        }
    } catch (err) {
        console.error('Failed to fetch disciplines:', err)
    }
    await fetchOrgBankAccounts()
    await fetchEventData()
})

useSeoMeta({
    title: () => `${t('dashboard_events_page.seo_title')} - Dashboard`
})
const getSchedDate = (session, field) => {
    const val = session ? session[field] : ''
    if (!val) return ''
    return val.split('T')[0]
}

const setSchedDate = (session, field, dateVal) => {
    if (!session) return
    const currentVal = session[field] || ''
    const currentTime = currentVal.includes('T') ? currentVal.split('T')[1] : '00:00'
    session[field] = dateVal ? `${dateVal}T${currentTime}` : ''
}

const getSchedTime = (session, field) => {
    const val = session ? session[field] : ''
    if (!val) return '00:00'
    return val.includes('T') ? val.split('T')[1] : val
}

const setSchedTime = (session, field, timeVal) => {
    if (!session) return
    const currentVal = session[field] || ''
    const currentDate = currentVal.includes('T') ? currentVal.split('T')[0] : ''
    if (currentDate) {
        session[field] = `${currentDate}T${timeVal || '00:00'}`
    } else {
        session[field] = ''
    }
}
</script>

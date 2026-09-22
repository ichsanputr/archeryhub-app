<template>
  <div class="space-y-8">
    <!-- Breadcrumb & Header -->
    <DashboardHeader
      :title="t('event_create.title')"
      :subtitle="t('event_create.subtitle')"
      icon="ph:calendar-plus-bold"
      back-to="/dashboard/organizer/tournaments"
      :breadcrumbs="[
        { label: t('dashboard.sidebar.overview'), to: '/dashboard/organizer' },
        { label: t('dashboard.sidebar.event'), to: '/dashboard/organizer/tournaments' },
        { label: t('event_create.breadcrumb_new') }
      ]"
    />

    <!-- Form Card -->
    <div class="bg-white border border-gray-200 rounded-xl p-6 md:p-10 shadow-sm">
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-10">

        <!-- Single Step: Event Info -->
        <div class="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4">
          <!-- Package / Quota Selector (Placed on Top) -->
          <FormSection icon="ph:package-bold" :title="t('event_create.quota_section_title')">
            <div class="space-y-4 font-body">
              <!-- Quota Balance Header Bar -->
              <div class="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div class="flex flex-wrap items-center gap-3">
                  <span class="text-xs sm:text-sm font-black tracking-wider text-slate-500">{{ t('event_create.quota_balance_label') }}:</span>
                  <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-navy border border-slate-200 text-xs sm:text-sm font-bold shadow-2xs">
                    <Icon icon="ph:gift-bold" class="text-base text-navy" />
                    {{ t('event_create.free_tier_name') }}: {{ quotaBalance.quota_free ?? 20 }}/20 {{ t('event_create.quota_unit') }}
                  </div>
                  <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-navy border border-slate-200 text-xs sm:text-sm font-bold shadow-2xs">
                    <Icon icon="ph:check-circle-bold" class="text-base text-navy" />
                    {{ t('event_create.standard_tier_name') }}: {{ quotaBalance.quota_standard || 0 }} {{ t('event_create.quota_unit') }}
                  </div>
                  <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-navy border border-slate-200 text-xs sm:text-sm font-bold shadow-2xs">
                    <Icon icon="ph:crown-bold" class="text-base text-navy" />
                    {{ t('event_create.elite_tier_name') }}: {{ quotaBalance.quota_elite || 0 }} {{ t('event_create.quota_unit') }}
                  </div>
                </div>

                <NuxtLink
                  to="/dashboard/organizer/package"
                  class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy text-white hover:bg-navy-dark text-xs sm:text-sm font-bold transition-all shadow-sm"
                >
                  <Icon icon="ph:plus-circle-bold" class="text-base text-primary" />
                  {{ t('event_create.buy_quota_btn') }}
                </NuxtLink>
              </div>

              <!-- 3-Package Cards Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Free Package Card -->
                <div
                  @click="(quotaBalance.quota_free ?? 20) > 0 ? form.quotaType = 'free' : null"
                  class="relative flex flex-col justify-between p-5 rounded-2xl border-2 transition-all select-none group"
                  :class="[
                    (quotaBalance.quota_free ?? 20) <= 0 ? 'border-slate-200 bg-slate-50/70 opacity-75 cursor-not-allowed' : 'cursor-pointer',
                    form.quotaType === 'free' ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'
                  ]"
                >
                  <div>
                    <div class="flex items-center justify-between gap-2 mb-3">
                      <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider bg-slate-100 text-slate-700">
                        {{ t('event_create.free_badge') }}
                      </div>
                      <div
                        v-if="(quotaBalance.quota_free ?? 20) > 0"
                        class="size-5 rounded-full border-2 flex items-center justify-center transition-colors font-black"
                        :class="form.quotaType === 'free' ? 'border-primary bg-primary text-btn-text' : 'border-slate-300 group-hover:border-slate-400'"
                      >
                        <Icon v-if="form.quotaType === 'free'" icon="ph:check-bold" class="text-xs" />
                      </div>
                      <span v-else class="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        {{ t('event_create.quota_empty') }}
                      </span>
                    </div>

                    <h4 class="text-lg font-black text-navy mb-1">{{ t('event_create.free_tier_name') }}</h4>
                    <div class="text-xs sm:text-sm text-slate-500 font-medium mb-4">{{ t('event_create.free_tier_desc') }}</div>

                    <div class="space-y-2.5 text-xs sm:text-sm font-medium text-slate-600 border-t border-slate-100 pt-3">
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:users-bold" class="text-slate-400 text-base shrink-0" />
                        <span>{{ t('event_create.max_50_participants') }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:squares-four-bold" class="text-slate-400 text-base shrink-0" />
                        <span><strong>{{ t('event_create.unlimited_categories') }}</strong></span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:device-tablet-speaker-bold" class="text-slate-400 text-base shrink-0" />
                        <span><strong>{{ t('event_create.unlimited_scorekeepers') }}</strong></span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:hard-drive-bold" class="text-slate-400 text-base shrink-0" />
                        <span>{{ t('event_create.free_storage') }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 pt-3 border-t border-slate-100">
                    <div v-if="(quotaBalance.quota_free ?? 20) > 0" class="flex items-center justify-between">
                      <span class="text-xs sm:text-sm font-bold text-slate-400">{{ t('event_create.use_label') }}:</span>
                      <span class="text-xs sm:text-sm font-black text-navy">{{ t('event_create.quota_use_free', { count: quotaBalance.quota_free ?? 20 }) }}</span>
                    </div>
                    <div v-else class="flex items-center justify-between">
                      <span class="text-xs sm:text-sm font-bold text-slate-400">{{ t('event_create.zero_free_quota') }}</span>
                      <span class="text-xs sm:text-sm font-bold text-slate-500">{{ t('event_create.select_standard_elite') }}</span>
                    </div>
                  </div>
                </div>

                <!-- Standard Package Card -->
                <div
                  @click="quotaBalance.quota_standard > 0 ? form.quotaType = 'standard' : null"
                  class="relative flex flex-col justify-between p-5 rounded-2xl border-2 transition-all select-none group"
                  :class="[
                    quotaBalance.quota_standard <= 0 ? 'border-slate-200 bg-slate-50/70 opacity-75 cursor-not-allowed' : 'cursor-pointer',
                    form.quotaType === 'standard' ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'
                  ]"
                >
                  <div>
                    <div class="flex items-center justify-between gap-2 mb-3">
                      <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider bg-slate-100 text-slate-700">
                        {{ t('event_create.standard_badge') }}
                      </div>
                      <div
                        v-if="quotaBalance.quota_standard > 0"
                        class="size-5 rounded-full border-2 flex items-center justify-center transition-colors font-black"
                        :class="form.quotaType === 'standard' ? 'border-primary bg-primary text-btn-text' : 'border-slate-300 group-hover:border-slate-400'"
                      >
                        <Icon v-if="form.quotaType === 'standard'" icon="ph:check-bold" class="text-xs" />
                      </div>
                      <span v-else class="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        {{ t('event_create.quota_empty') }}
                      </span>
                    </div>

                    <h4 class="text-lg font-black text-navy mb-1">{{ t('event_create.standard_tier_name') }}</h4>
                    <div class="text-xs sm:text-sm text-slate-500 font-medium mb-4">{{ t('event_create.standard_tier_desc') }}</div>

                    <div class="space-y-2.5 text-xs sm:text-sm font-medium text-slate-600 border-t border-slate-100 pt-3">
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:users-bold" class="text-slate-400 text-base shrink-0" />
                        <span>{{ t('event_create.max_200_participants') }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:squares-four-bold" class="text-slate-400 text-base shrink-0" />
                        <span><strong>{{ t('event_create.unlimited_categories') }}</strong></span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:device-tablet-speaker-bold" class="text-slate-400 text-base shrink-0" />
                        <span><strong>{{ t('event_create.unlimited_scorekeepers') }}</strong></span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:hard-drive-bold" class="text-slate-400 text-base shrink-0" />
                        <span>{{ t('event_create.standard_storage') }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 pt-3 border-t border-slate-100">
                    <div v-if="quotaBalance.quota_standard > 0" class="flex items-center justify-between">
                      <span class="text-xs sm:text-sm font-bold text-slate-400">{{ t('event_create.use_label') }}:</span>
                      <span class="text-xs sm:text-sm font-black text-navy">{{ t('event_create.quota_use_standard', { count: quotaBalance.quota_standard }) }}</span>
                    </div>
                    <div v-else class="flex items-center justify-between">
                      <span class="text-xs sm:text-sm font-bold text-slate-400">{{ t('event_create.zero_quota') }}</span>
                      <NuxtLink to="/dashboard/organizer/package" class="text-xs sm:text-sm font-bold text-navy hover:underline flex items-center gap-0.5">
                        {{ t('event_create.buy_quota') }} <Icon icon="ph:arrow-right" class="text-xs" />
                      </NuxtLink>
                    </div>
                  </div>
                </div>

                <!-- Elite Package Card -->
                <div
                  @click="quotaBalance.quota_elite > 0 ? form.quotaType = 'elite' : null"
                  class="relative flex flex-col justify-between p-5 rounded-2xl border-2 transition-all select-none group"
                  :class="[
                    quotaBalance.quota_elite <= 0 ? 'border-slate-200 bg-slate-50/70 opacity-75 cursor-not-allowed' : 'cursor-pointer',
                    form.quotaType === 'elite' ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'
                  ]"
                >
                  <div>
                    <div class="flex items-center justify-between gap-2 mb-3">
                      <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider bg-slate-100 text-slate-700">
                        {{ t('event_create.elite_badge') }}
                      </div>
                      <div
                        v-if="quotaBalance.quota_elite > 0"
                        class="size-5 rounded-full border-2 flex items-center justify-center transition-colors font-black"
                        :class="form.quotaType === 'elite' ? 'border-primary bg-primary text-btn-text' : 'border-slate-300 group-hover:border-slate-400'"
                      >
                        <Icon v-if="form.quotaType === 'elite'" icon="ph:check-bold" class="text-xs" />
                      </div>
                      <span v-else class="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        {{ t('event_create.quota_empty') }}
                      </span>
                    </div>

                    <h4 class="text-lg font-black text-navy mb-1">{{ t('event_create.elite_tier_name') }}</h4>
                    <div class="text-xs sm:text-sm text-slate-500 font-medium mb-4">{{ t('event_create.elite_tier_desc') }}</div>

                    <div class="space-y-2.5 text-xs sm:text-sm font-medium text-slate-600 border-t border-slate-100 pt-3">
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:users-bold" class="text-slate-400 text-base shrink-0" />
                        <span><strong>{{ t('event_create.unlimited_participants') }}</strong></span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:squares-four-bold" class="text-slate-400 text-base shrink-0" />
                        <span><strong>{{ t('event_create.unlimited_categories') }}</strong></span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:device-tablet-speaker-bold" class="text-slate-400 text-base shrink-0" />
                        <span><strong>{{ t('event_create.unlimited_scorekeepers') }}</strong></span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:hard-drive-bold" class="text-slate-400 text-base shrink-0" />
                        <span>{{ t('event_create.elite_storage') }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 pt-3 border-t border-slate-100">
                    <div v-if="quotaBalance.quota_elite > 0" class="flex items-center justify-between">
                      <span class="text-xs sm:text-sm font-bold text-slate-400">{{ t('event_create.use_label') }}:</span>
                      <span class="text-xs sm:text-sm font-black text-navy">{{ t('event_create.quota_use_elite', { count: quotaBalance.quota_elite }) }}</span>
                    </div>
                    <div v-else class="flex items-center justify-between">
                      <span class="text-xs sm:text-sm font-bold text-slate-400">{{ t('event_create.zero_quota') }}</span>
                      <NuxtLink to="/dashboard/organizer/package" class="text-xs sm:text-sm font-bold text-navy hover:underline flex items-center gap-0.5">
                        {{ t('event_create.buy_quota') }} <Icon icon="ph:arrow-right" class="text-xs" />
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection icon="ph:identification-card" :title="t('event_create.section_identity')">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <BaseInput v-model="form.name" :label="t('event_create.field_name')"
                  :placeholder="t('event_create.field_name_placeholder')" required :error="errors.name"
                  @blur="validate('name', form.name, [rules.required()])" />
              </div>
              <div class="md:col-span-2">
                <BaseInput v-model="form.slug" :label="t('event_create.field_slug')"
                  :placeholder="t('event_create.field_slug_placeholder')" required :error="errors.slug"
                  @input="onSlugInput"
                  @blur="validate('slug', form.slug, [rules.required(), rules.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t('event_create.slug_validation'))])" />
                <div class="text-xs text-gray-500 mt-1.5">
                  {{ t('event_create.slug_hint') }}
                </div>
              </div>
              <BaseInput v-model="form.venue" :label="t('event_create.field_venue')" :placeholder="t('event_create.field_venue_placeholder')"
                icon="la:place-of-worship" />
              <BaseSelect v-model="form.country" :label="t('event_create.field_country')" :items="countryItems" required :error="errors.country"
                @update:model-value="onCountryChange"
                @blur="validate('country', form.country, [rules.required()])" />
              <BaseSelect v-model="form.currency" :label="t('event_create.field_currency')" :items="currencyItems" required :error="errors.currency"
                @blur="validate('currency', form.currency, [rules.required()])" />
              <BaseSelect v-model="form.type" :label="t('event_create.field_location_type')" :items="disciplineItems" required :error="errors.type"
                @blur="validate('type', form.type, [rules.required()])" />

              <div class="md:col-span-2 space-y-2">
                <div class="flex items-center justify-between">
                  <label class="text-navy text-sm font-bold ml-1 flex items-center gap-1.5">
                    <Icon icon="ph:map-pin" class="text-primary text-base" />
                    {{ t('event_create.field_gmaps') }}
                  </label>
                  <span class="text-[11px] text-gray-400 font-medium hidden sm:inline">
                    {{ t('event_create.gmaps_hint') }}
                  </span>
                </div>
                <textarea
                  v-model="form.gmapsLink"
                  rows="3"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all font-mono text-xs text-gray-700 bg-white"
                  :placeholder="t('event_create.field_gmaps_placeholder')"
                  @input="validateGmapsLink"
                ></textarea>
                <div class="text-[11px] text-gray-500 font-medium flex items-center gap-1.5 pl-1">
                  <Icon icon="ph:info-bold" class="text-blue-500 text-xs shrink-0" />
                  <span>{{ t('event_create.gmaps_hint') }}</span>
                </div>

                <!-- Gmaps Preview -->
                <div v-if="gmapsEmbedUrl" class="mt-3 space-y-2">
                  <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg w-fit">
                    <Icon icon="ph:check-circle-fill" class="text-emerald-500 text-sm" />
                    <span>{{ t('event_create.gmaps_detected') }}</span>
                  </div>
                  <div class="rounded-xl overflow-hidden border border-gray-200 aspect-video w-full bg-gray-50 shadow-inner">
                    <iframe
                      width="100%"
                      height="100%"
                      style="border:0"
                      loading="lazy"
                      allowfullscreen
                      referrerpolicy="no-referrer-when-downgrade"
                      :src="gmapsEmbedUrl"
                    ></iframe>
                  </div>
                </div>
                <div v-else-if="form.gmapsLink && !isValidGmaps" class="text-amber-600 text-xs font-medium mt-1 flex items-center gap-1">
                  <Icon icon="ph:warning-circle-bold" class="text-sm shrink-0" />
                  <span>{{ t('event_create.gmaps_invalid') }}</span>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection icon="ant-design:schedule-outlined" :title="t('event_create.section_schedule')">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-navy text-sm font-bold ml-1 flex items-center gap-1">
                  {{ t('event_create.field_start_date') }} <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-2 gap-2">
                  <BaseDatePicker v-model="startDateDate" :max-date="endDateDate" :placeholder="t('event_create.field_start_date')" :error="errors.startDate" />
                  <BaseTimePicker v-model="startDateTime" placeholder="08:00" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-navy text-sm font-bold ml-1 flex items-center gap-1">
                  {{ t('event_create.field_end_date') }} <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-2 gap-2">
                  <BaseDatePicker v-model="endDateDate" :min-date="startDateDate" :placeholder="t('event_create.field_end_date')" :error="errors.endDate" />
                  <BaseTimePicker v-model="endDateTime" placeholder="17:00" />
                </div>
              </div>
              <div class="space-y-2 md:col-span-2">
                <label class="text-navy text-sm font-bold ml-1 flex items-center gap-1">
                  {{ t('event_create.field_registration_deadline') }}
                </label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <BaseDatePicker v-model="regDate" :max-date="endDateDate || startDateDate" :placeholder="t('event_create.field_registration_deadline')" />
                  <BaseTimePicker v-model="regTime" placeholder="23:59" />
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection icon="ph:article" :title="t('event_create.section_details')">
            <div class="flex flex-col gap-1.5">
              <label class="text-navy text-sm font-bold ml-1">{{ t('event_create.field_description') }}</label>
              <div class="min-h-[300px]">
                <TiptapEditor v-model="form.description" />
              </div>
            </div>
          </FormSection>

          <FormSection icon="ph:gear" :title="t('event_create.section_settings')">
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <BaseSelect v-model="form.status" :label="t('event_create.field_initial_status')" :items="[
                  { title: t('event_create.status_draft'), value: 'draft' },
                  { title: t('event_create.status_published'), value: 'published' }
                ]" />
              </div>

              <!-- Tournament Visibility (External vs Internal) -->
              <div v-if="form.status === 'published'" class="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div>
                  <label class="text-sm font-bold text-navy flex items-center gap-2">
                    <Icon icon="ph:eye-bold" class="text-primary text-base" />
                    <span>{{ t('event_create.visibility_title') }}</span>
                  </label>
                  <span class="text-xs text-gray-500 font-medium">{{ t('event_create.visibility_subtitle') }}</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- External (Default) -->
                  <div
                    @click="form.visibility = 'external'"
                    class="p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 select-none"
                    :class="form.visibility === 'external' ? 'border-primary bg-primary/5 shadow-xs' : 'border-gray-200 bg-white hover:border-gray-300'"
                  >
                    <div
                      class="size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                      :class="form.visibility === 'external' ? 'border-primary bg-primary text-btn-text' : 'border-gray-300'"
                    >
                      <Icon v-if="form.visibility === 'external'" icon="ph:check-bold" class="text-xs" />
                    </div>
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:globe-hemisphere-west-bold" class="text-base text-navy" />
                        <span class="text-sm font-black text-navy">{{ t('event_create.visibility_external_title') }}</span>
                        <span class="px-2 py-0.5 bg-primary/20 text-navy text-[10px] font-black rounded-md">Default</span>
                      </div>
                      <span class="text-xs text-gray-500 font-medium leading-relaxed block">
                        {{ t('event_create.visibility_external_desc') }}
                      </span>
                    </div>
                  </div>

                  <!-- Internal -->
                  <div
                    @click="form.visibility = 'internal'"
                    class="p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 select-none"
                    :class="form.visibility === 'internal' ? 'border-primary bg-primary/5 shadow-xs' : 'border-gray-200 bg-white hover:border-gray-300'"
                  >
                    <div
                      class="size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                      :class="form.visibility === 'internal' ? 'border-primary bg-primary text-btn-text' : 'border-gray-300'"
                    >
                      <Icon v-if="form.visibility === 'internal'" icon="ph:check-bold" class="text-xs" />
                    </div>
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:lock-key-bold" class="text-base text-navy" />
                        <span class="text-sm font-black text-navy">{{ t('event_create.visibility_internal_title') }}</span>
                      </div>
                      <span class="text-xs text-gray-500 font-medium leading-relaxed block">
                        {{ t('event_create.visibility_internal_desc') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FormSection>
        </div>


        <!-- Action Buttons -->
        <div
          class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-8 border-t border-gray-100 mt-4">
          <BaseButton to="/dashboard/organizer/tournaments" variant="ghost" class="px-8 whitespace-nowrap">
            {{ t('event_create.button_cancel') }}
          </BaseButton>
          <BaseButton type="submit" variant="primary" :loading="isSubmitting" class="px-10 whitespace-nowrap">
            {{ t('event_create.button_create') }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import TiptapEditor from '~/components/common/TiptapEditor.client.vue'
import FormSection from '~/components/common/FormSection.vue'
import { useFormValidation } from '~/composables/useFormValidation'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'
import { useSubscription } from '~/composables/useSubscription'
import { extractGmapsEmbedUrl } from '~/utils/maps'
import useCurrency from '~/composables/useCurrency'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
const { currencies: supportedCurrencies, countries: supportedCountryList } = useCurrency()

useHead({
  title: computed(() => `${t('event_create.page_title')} - Archeris Dashboard`)
})

const router = useRouter()
const { get, post } = useApi()
const toast = useToast()
const { isSubscriptionActive } = useSubscription()

const isSubmitting = ref(false)

const { errors, validate, validateForm, rules, clearErrors } = useFormValidation()

const form = reactive({
  name: '',
  slug: '',
  venue: '',
  country: 'Indonesia',
  currency: 'IDR',
  gmapsLink: '',
  startDate: '',
  endDate: '',
  description: '',
  type: '', // Discipline
  registrationDeadline: '',
  status: 'draft',
  quotaType: 'free',
  visibility: 'external'
})

const quotaBalance = ref({
  quota_free: 20,
  quota_standard: 0,
  quota_elite: 0,
  total_quota: 20
})

const startDateDate = ref('')
const startDateTime = ref('08:00')
const endDateDate = ref('')
const endDateTime = ref('17:00')
const regDate = ref('')
const regTime = ref('23:59')

watch([startDateDate, startDateTime], () => {
  form.startDate = startDateDate.value ? `${startDateDate.value}T${startDateTime.value || '00:00'}` : ''
})

watch([endDateDate, endDateTime], () => {
  form.endDate = endDateDate.value ? `${endDateDate.value}T${endDateTime.value || '00:00'}` : ''
})

watch([regDate, regTime], () => {
  form.registrationDeadline = regDate.value ? `${regDate.value}T${regTime.value || '00:00'}` : ''
})

const isSlugManuallyEdited = ref(false)

const slugify = (value) => {
  return (value || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

watch(() => form.name, (newName) => {
  if (!isSlugManuallyEdited.value) {
    form.slug = slugify(newName)
  }
})

const onSlugInput = () => {
  form.slug = slugify(form.slug)
  isSlugManuallyEdited.value = true
}

const disciplines = ref([])
const disciplineItems = computed(() => {
  const excluded = new Set(['3d', 'field'])
  return disciplines.value
    .filter((d) => {
      const name = (d?.name || '').toString().trim().toLowerCase()
      const code = (d?.code || '').toString().trim().toLowerCase()
      return !excluded.has(name) && !excluded.has(code)
    })
    .map((d) => ({ title: d.name, value: d.name }))
})

const countryItems = computed(() => supportedCountryList.map(c => ({
  title: c.name,
  value: c.name,
  icon: c.icon
})))

const currencyItems = computed(() => supportedCurrencies.map(c => ({
  title: `${c.code} (${c.symbol}) – ${c.name}`,
  value: c.code,
  icon: c.icon
})))

const onCountryChange = (countryName) => {
  const found = supportedCountryList.find(c => c.name.toLowerCase() === (countryName || '').toLowerCase())
  if (found && found.defaultCurrency) {
    form.currency = found.defaultCurrency
  }
}

onMounted(async () => {
  if (!isSubscriptionActive.value) {
    toast.error(t('premium.msg_create_event'))
    router.replace('/dashboard/organizer/tournaments')
    return
  }
  try {
    const [resDisc, resQuota] = await Promise.all([
      get('/disciplines'),
      get('/organizers/me/quota').catch(() => null)
    ])
    if (resDisc?.disciplines) {
      disciplines.value = resDisc.disciplines
    }
    if (resQuota) {
      quotaBalance.value = {
        quota_free: resQuota.quota_free ?? 20,
        quota_standard: resQuota.quota_standard || 0,
        quota_elite: resQuota.quota_elite || 0,
        total_quota: resQuota.total_quota || 20
      }
      if ((quotaBalance.value.quota_free ?? 20) > 0) {
        form.quotaType = 'free'
      } else if (quotaBalance.value.quota_standard > 0) {
        form.quotaType = 'standard'
      } else if (quotaBalance.value.quota_elite > 0) {
        form.quotaType = 'elite'
      } else {
        form.quotaType = 'free'
      }
    }
  } catch (err) {
    console.error('Failed to fetch initial data', err)
  }
})

const isValidGmaps = ref(true)

const gmapsEmbedUrl = computed(() => {
  return extractGmapsEmbedUrl(form.gmapsLink, form.venue)
})

const validateGmapsLink = () => {
  if (!form.gmapsLink || !form.gmapsLink.trim()) {
    isValidGmaps.value = true
    return
  }
  const embed = extractGmapsEmbedUrl(form.gmapsLink)
  isValidGmaps.value = !!embed
}

const validateStep = () => {
  const isBasicValid = validateForm(form, {
    name: [rules.required()],
    slug: [rules.required(), rules.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t('event_create.slug_validation'))],
    startDate: [rules.required()],
    endDate: [rules.required()],
    type: [rules.required()],
    country: [rules.required()],
    currency: [rules.required()]
  })

  // Additional validation: end date must be after start date
  if (form.startDate && form.endDate) {
    const startTime = new Date(form.startDate).getTime()
    const endTime = new Date(form.endDate).getTime()
    if (endTime <= startTime) {
      errors.endDate = t('event_create.end_date_validation')
      return false
    }
  }

  return isBasicValid
}

const handleSubmit = async () => {
  if (!validateStep()) return

  isSubmitting.value = true
  try {
    const formatToISO = (dateStr) => {
      if (!dateStr) return null
      return new Date(dateStr).toISOString()
    }

    const payload = {
      code: form.name.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase(),
      name: form.name,
      slug: form.slug,
      venue: form.venue,
      country: form.country,
      currency: form.currency || 'IDR',
      gmaps_link: form.gmapsLink,
      start_date: formatToISO(form.startDate),
      end_date: formatToISO(form.endDate),
      description: form.description,
      status: form.status,
      registration_deadline: formatToISO(form.registrationDeadline),
      location_type: form.type,
      quota_type: form.quotaType,
      visibility: form.visibility || 'external',
      page_settings: JSON.stringify({
        country: form.country,
        currency: form.currency || 'IDR',
        visibility: form.visibility || 'external'
      })
    }

    const result = await post('/tournaments', payload)

    if (result?.id || result?.uuid) {
      toast.success(t('event_create.success_message'))
      router.push('/dashboard/organizer/tournaments')
    }
  } catch (error) {
    console.error('Failed to create tournament:', error)
    toast.error(getApiErrorMessage(error, t('event_create.error_message')))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Header Section -->
    <DashboardHeader
      :title="t('organizer.profile.title')"
      :subtitle="t('organizer.profile.subtitle')"
      icon="ph:buildings-bold"
      :breadcrumbs="[
        { label: t('navigation.dashboard'), to: '/dashboard/organizer' },
        { label: t('organizer.profile.title') }
      ]"
    >
      <template #actions>
        <BaseButton variant="primary" :loading="saving" @click="saveProfile" icon="ph:floppy-disk"
          class="h-11 px-6 shadow-lg shadow-primary/20 font-bold text-xs !rounded-xl">
          {{ saving ? t('organizer.profile.saving') : t('organizer.profile.save') }}
        </BaseButton>
      </template>
    </DashboardHeader>

    <!-- Tab Navigation -->
    <div class="flex gap-1 bg-slate-100 rounded-2xl p-1.5 overflow-x-auto no-scrollbar shadow-sm">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        :class="activeTab === tab.id ? 'bg-white shadow-sm text-navy font-black' : 'text-slate-500 hover:text-navy hover:bg-white/50 font-bold'"
        class="flex items-center justify-center gap-2 flex-1 min-w-[120px] sm:min-w-[140px] px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm whitespace-nowrap shrink-0 transition-all">
        <Icon :icon="tab.icon" class="text-base sm:text-lg shrink-0" />
        <span class="whitespace-nowrap">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main form -->
      <div class="lg:col-span-2 space-y-8">

        <!-- Tab: Umum -->
        <div v-if="activeTab === 'general'" class="space-y-8">
          <!-- Identitas -->
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                <Icon icon="ph:identification-badge-bold" class="text-xl" />
              </div>
              <h3 class="text-base font-bold text-navy">
                {{ t('organizer.profile.identity_section') }}
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput 
                v-model="form.name" 
                :label="t('organizer.profile.name_label')" 
                :placeholder="t('organizer.profile.name_placeholder')" 
                required 
                :error="errors.name"
                @update:model-value="validateName"
                @blur="validateName"
              />

              <!-- Slug URL -->
              <BaseInput 
                v-model="form.slug" 
                :label="t('organizer.profile.slug_label')" 
                :placeholder="t('organizer.profile.slug_placeholder')"
                :helper="t('organizer.profile.slug_helper')" 
                required
                :error="errors.slug"
                @update:model-value="validateSlug"
                @blur="validateSlug"
              />

              <!-- Registration Number / SK -->
              <BaseInput 
                v-model="form.registration_number" 
                :label="t('organizer.profile.reg_number_label')" 
                :placeholder="t('organizer.profile.reg_number_placeholder')" 
              />

              <!-- Established Date (BaseDatePicker) -->
              <BaseDatePicker 
                v-model="form.established_date" 
                :label="t('organizer.profile.est_date_label')" 
                :placeholder="t('organizer.profile.est_date_placeholder')"
                clearable 
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-navy mb-2">{{ t('organizer.profile.about_label') }}</label>
              <TiptapEditor v-model="form.description"
                :placeholder="t('organizer.profile.about_placeholder')" minHeight="180px" />
            </div>
          </div>

          <!-- Logo & Banner -->
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                <Icon icon="ph:image-bold" class="text-xl" />
              </div>
              <h3 class="text-base font-bold text-navy">
                {{ t('organizer.profile.branding_section') }}
              </h3>
            </div>

            <div class="space-y-8">
              <!-- Logo Upload -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-navy">{{ t('organizer.profile.logo_label') }}</label>
                  <div class="text-xs text-gray-400 font-medium mt-1">{{ t('organizer.profile.logo_desc') }} ({{ t('organizer.profile.logo_aspect_desc') }})</div>
                </div>
                <div class="flex flex-col items-center gap-5 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div
                    class="relative w-36 h-36 rounded-2xl bg-white border-2 border-dashed border-primary/50 overflow-hidden flex flex-col items-center justify-center shadow-inner group">
                    <img v-if="form.logoUrl" :src="useImageOrDefault(form.logoUrl, form.name)"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div v-else class="text-center p-3">
                      <Icon icon="ph:image-square-bold" class="text-3xl text-slate-300 mx-auto mb-1" />
                      <span class="text-[10px] font-bold text-slate-400 block">{{ t('organizer.profile.ratio_1_1') }}</span>
                    </div>
                    <span class="absolute bottom-1 bg-navy/80 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">{{ t('organizer.profile.ratio_badge') }}</span>
                  </div>
                  <div class="flex gap-2 w-full">
                    <BaseButton @click="openMediaLibrary('logo')" variant="primary" size="sm"
                      icon="ph:cloud-arrow-up-bold" class="flex-1 h-10 font-bold text-xs">
                      {{ t('organizer.profile.choose_logo') }}
                    </BaseButton>
                    <BaseButton v-if="form.logoUrl" @click="form.logoUrl = ''" variant="white" size="sm"
                      icon="ph:trash-bold"
                      class="h-10 w-10 p-0 text-red-500 bg-red-50 border-red-100 hover:bg-red-100" />
                  </div>
                </div>
              </div>

              <!-- Banner Upload -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-navy">{{ t('organizer.profile.banner_label') }}</label>
                  <div class="text-xs text-gray-400 font-medium mt-1">{{ t('organizer.profile.banner_desc') }}</div>
                </div>
                <div class="relative group">
                  <div
                    class="h-44 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center shadow-inner">
                    <img v-if="form.bannerUrl" :src="form.bannerUrl"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div v-else class="text-center p-6">
                      <Icon icon="ph:image-square-bold" class="text-4xl text-gray-200 mx-auto mb-2" />
                      <div class="text-xs text-gray-400 font-medium">{{ t('organizer.profile.banner_desc') }}</div>
                    </div>
                  </div>
                  <div class="mt-4 flex gap-2">
                    <BaseButton @click="openMediaLibrary('banner')" variant="primary" size="sm" icon="ph:image-bold"
                      class="flex-1 h-10 font-bold text-xs">
                      {{ t('organizer.profile.choose_banner') }}
                    </BaseButton>
                    <BaseButton v-if="form.bannerUrl" @click="form.bannerUrl = ''" variant="white" size="sm"
                      icon="ph:trash-bold"
                      class="h-10 w-10 p-0 text-red-500 bg-red-50 border-red-100 hover:bg-red-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Kontak -->
        <div v-if="activeTab === 'contact'" class="space-y-8">
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                <Icon icon="ph:phone-bold" class="text-xl" />
              </div>
              <h3 class="text-base font-bold text-navy">
                {{ t('organizer.profile.contact_section') }}
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput 
                v-model="form.whatsapp_no" 
                :label="t('organizer.profile.whatsapp_label')" 
                :placeholder="t('organizer.profile.whatsapp_placeholder')"
                required 
                :error="errors.whatsapp_no"
                @update:model-value="validateWhatsApp"
                @blur="validateWhatsApp"
              />
              <BaseInput 
                v-model="form.email" 
                :label="t('organizer.profile.email_label')" 
                type="email" 
                :placeholder="t('organizer.profile.email_placeholder')"
                disabled 
              />
              <BaseInput 
                v-model="form.website" 
                :label="t('organizer.profile.website_label')" 
                :placeholder="t('organizer.profile.website_placeholder')" 
                :error="errors.website"
                @update:model-value="validateWebsite"
                @blur="validateWebsite"
              />
            </div>
            <BaseTextarea v-model="form.address" :label="t('organizer.profile.address_label')" rows="3"
              :placeholder="t('organizer.profile.address_placeholder')" />
          </div>

          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                  <Icon icon="ph:share-network-bold" class="text-xl" />
                </div>
                <h3 class="text-base font-bold text-navy">
                  {{ t('organizer.profile.social_section') }}
                </h3>
              </div>

              <div class="relative group">
                <BaseButton variant="white" size="xs" icon="ph:plus-bold"
                  class="border-dashed border-2 hover:border-primary hover:text-primary transition-all">
                  {{ t('organizer.profile.add_social') }}
                </BaseButton>
                <!-- Dropdown for adding socials -->
                <div
                  class="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                  <button v-for="plat in remainingPlatforms" :key="plat.value" @click="addSocialMedia(plat.value)"
                    class="w-full text-left px-4 py-2 text-sm font-bold text-navy hover:bg-gray-50 flex items-center gap-3">
                    <Icon :icon="plat.icon" :class="plat.iconColor" />
                    {{ plat.title }}
                  </button>
                  <div v-if="remainingPlatforms.length === 0" class="px-4 py-2 text-xs text-gray-400 italic">
                    {{ t('organizer.profile.all_platforms_added') }}
                  </div>
                </div>
              </div>
            </div>

            <div class="text-sm text-gray-500 font-medium">{{ t('organizer.profile.social_desc') }}</div>

            <div class="grid grid-cols-1 gap-4 mt-2">
              <div v-for="(social, idx) in form.socialMedia" :key="social.platform"
                class="bg-gray-50/30 p-4 rounded-2xl border border-gray-100 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                      :class="getPlatformIconBagde(social.platform)">
                      <Icon :icon="getPlatformInfo(social.platform).icon" class="text-lg" />
                    </div>
                    <span class="text-xs font-bold text-navy">{{
                      getPlatformInfo(social.platform).title }}</span>
                  </div>
                  <button @click="removeSocialMedia(idx)" class="text-gray-400 hover:text-red-500 transition-colors">
                    <Icon icon="ph:trash-bold" />
                  </button>
                </div>
                <div class="flex items-center gap-3">
                  <input v-model="social.username" type="text"
                    :placeholder="getPlatformInfo(social.platform).placeholder"
                    class="flex-1 px-4 py-2.5 rounded-xl border border-gray-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold shadow-sm transition-all" />
                </div>
              </div>

              <div v-if="form.socialMedia.length === 0"
                class="py-12 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                <Icon icon="ph:share-network" class="text-4xl text-gray-200 mx-auto mb-3" />
                <div class="text-xs text-gray-400 font-medium">{{ t('organizer.profile.no_social_added') }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Visi & Misi (Sejarah dihapus) -->
        <div v-if="activeTab === 'about'" class="space-y-8">
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                <Icon icon="ph:eye-bold" class="text-xl" />
              </div>
              <h3 class="text-base font-bold text-navy">
                {{ t('organizer.profile.vision_section') }}
              </h3>
            </div>
            <div>
              <label class="block text-sm font-bold text-navy mb-2">{{ t('organizer.profile.vision_label') }}</label>
              <TiptapEditor v-model="form.vision" :placeholder="t('organizer.profile.vision_placeholder')" minHeight="120px" />
            </div>
            <div>
              <label class="block text-sm font-bold text-navy mb-2">{{ t('organizer.profile.mission_label') }}</label>
              <TiptapEditor v-model="form.mission" :placeholder="t('organizer.profile.mission_placeholder')"
                minHeight="180px" />
            </div>
          </div>
        </div>

        <!-- Tab: FAQ (Modern Makeover) -->
        <div v-if="activeTab === 'faq'" class="space-y-8">
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                  <Icon icon="ph:question-bold" class="text-xl" />
                </div>
                <div>
                  <h3 class="text-base font-bold text-navy">
                    {{ t('organizer.profile.faq_section') }}
                  </h3>
                  <div class="text-xs text-slate-400 font-medium mt-0.5">{{ t('organizer.profile.faq_desc') }}</div>
                </div>
              </div>
              <BaseButton variant="primary" size="sm" @click="addFAQ" icon="ph:plus-circle-bold" class="text-xs font-bold h-9">
                {{ t('organizer.profile.add_faq') }}
              </BaseButton>
            </div>

            <div class="space-y-4">
              <div v-for="(item, idx) in form.faq" :key="idx"
                class="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4 relative group hover:bg-white hover:shadow-xs transition-all">
                <div class="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary text-btn-text text-[10px] font-bold font-mono">
                    {{ t('organizer.profile.faq_counter', { number: idx + 1 }) }}
                  </span>
                  <button @click="removeFAQ(idx)"
                    class="size-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors">
                    <Icon icon="ph:trash-bold" class="text-sm" />
                  </button>
                </div>
                <BaseInput v-model="item.question" :label="t('organizer.profile.faq_question_label')"
                  :placeholder="t('organizer.profile.faq_question_placeholder')" />
                <div>
                  <label class="block text-xs font-bold text-navy mb-2">{{ t('organizer.profile.faq_answer_label') }}</label>
                  <TiptapEditor v-model="item.answer" :placeholder="t('organizer.profile.faq_answer_placeholder')" minHeight="120px" />
                </div>
              </div>

              <div v-if="form.faq.length === 0"
                class="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
                <Icon icon="ph:chat-centered-dots-bold" class="text-4xl text-gray-200 mx-auto mb-2" />
                <div class="text-xs text-gray-400 font-medium">{{ t('organizer.profile.no_faq') }}</div>
                <BaseButton @click="addFAQ" variant="primary" size="sm" class="mt-4 text-xs font-bold shadow-md">
                  {{ t('organizer.profile.create_first_faq') }}
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Side card: Redesigned Page Visibility -->
      <div class="space-y-4">
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
              <Icon icon="ph:eye-bold" class="text-xl" />
            </div>
            <div>
              <h3 class="text-base font-bold text-navy">
                {{ t('organizer.profile.visibility_title') }}
              </h3>
              <div class="text-[11px] text-slate-400 font-medium mt-0.5">{{ t('organizer.profile.visibility_subtitle') }}</div>
            </div>
          </div>

          <div class="space-y-2.5 pt-1">
            <!-- Item: Identitas -->
            <div @click="pageSettings.sections.identity = !pageSettings.sections.identity"
              class="p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between"
              :class="pageSettings.sections.identity ? 'bg-primary/5 border-primary/40' : 'bg-slate-50 border-slate-200/80 opacity-60'">
              <div class="flex items-center gap-3">
                <div class="size-8 rounded-xl flex items-center justify-center"
                  :class="pageSettings.sections.identity ? 'bg-primary text-btn-text shadow-2xs' : 'bg-slate-200 text-slate-500'">
                  <Icon icon="ph:identification-card-bold" class="text-base" />
                </div>
                <div>
                  <div class="text-xs font-bold text-navy leading-tight">{{ t('organizer.profile.visibility_identity_title') }}</div>
                  <div class="text-[10px] text-slate-400 font-medium">{{ t('organizer.profile.visibility_identity_desc') }}</div>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                :class="pageSettings.sections.identity ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'">
                {{ pageSettings.sections.identity ? t('organizer.profile.visible_status') : t('organizer.profile.hidden_status') }}
              </span>
            </div>

            <!-- Item: Kontak -->
            <div @click="pageSettings.sections.contact = !pageSettings.sections.contact"
              class="p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between"
              :class="pageSettings.sections.contact ? 'bg-primary/5 border-primary/40' : 'bg-slate-50 border-slate-200/80 opacity-60'">
              <div class="flex items-center gap-3">
                <div class="size-8 rounded-xl flex items-center justify-center"
                  :class="pageSettings.sections.contact ? 'bg-primary text-btn-text shadow-2xs' : 'bg-slate-200 text-slate-500'">
                  <Icon icon="ph:phone-call-bold" class="text-base" />
                </div>
                <div>
                  <div class="text-xs font-bold text-navy leading-tight">{{ t('organizer.profile.visibility_contact_title') }}</div>
                  <div class="text-[10px] text-slate-400 font-medium">{{ t('organizer.profile.visibility_contact_desc') }}</div>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                :class="pageSettings.sections.contact ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'">
                {{ pageSettings.sections.contact ? t('organizer.profile.visible_status') : t('organizer.profile.hidden_status') }}
              </span>
            </div>

            <!-- Item: Visi Misi -->
            <div @click="pageSettings.sections.about = !pageSettings.sections.about"
              class="p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between"
              :class="pageSettings.sections.about ? 'bg-primary/5 border-primary/40' : 'bg-slate-50 border-slate-200/80 opacity-60'">
              <div class="flex items-center gap-3">
                <div class="size-8 rounded-xl flex items-center justify-center"
                  :class="pageSettings.sections.about ? 'bg-primary text-btn-text shadow-2xs' : 'bg-slate-200 text-slate-500'">
                  <Icon icon="ph:target-bold" class="text-base" />
                </div>
                <div>
                  <div class="text-xs font-bold text-navy leading-tight">{{ t('organizer.profile.visibility_about_title') }}</div>
                  <div class="text-[10px] text-slate-400 font-medium">{{ t('organizer.profile.visibility_about_desc') }}</div>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                :class="pageSettings.sections.about ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'">
                {{ pageSettings.sections.about ? t('organizer.profile.visible_status') : t('organizer.profile.hidden_status') }}
              </span>
            </div>

            <!-- Item: FAQ -->
            <div @click="pageSettings.sections.faq = !pageSettings.sections.faq"
              class="p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between"
              :class="pageSettings.sections.faq ? 'bg-primary/5 border-primary/40' : 'bg-slate-50 border-slate-200/80 opacity-60'">
              <div class="flex items-center gap-3">
                <div class="size-8 rounded-xl flex items-center justify-center"
                  :class="pageSettings.sections.faq ? 'bg-primary text-btn-text shadow-2xs' : 'bg-slate-200 text-slate-500'">
                  <Icon icon="ph:question-bold" class="text-base" />
                </div>
                <div>
                  <div class="text-xs font-bold text-navy leading-tight">{{ t('organizer.profile.visibility_faq_title') }}</div>
                  <div class="text-[10px] text-slate-400 font-medium">{{ t('organizer.profile.visibility_faq_desc') }}</div>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                :class="pageSettings.sections.faq ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'">
                {{ pageSettings.sections.faq ? t('organizer.profile.visible_status') : t('organizer.profile.hidden_status') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Media Library Modal -->
    <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import useDashboardI18n from '~/composables/useDashboardI18n'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { useFormValidation } from '~/composables/useFormValidation'
import BaseSelect from '~/components/common/BaseSelect.vue'

const { t, locale } = useDashboardI18n()

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

useHead({
  title: computed(() => `${t('organizer.profile.title')} - Archeris Dashboard`)
})

const router = useRouter()
const { get, put } = useApi()
const { user, organizerProfile } = useAuth()
const toast = useToast()

const { errors, validate, rules } = useFormValidation()

const validateName = () => validate('name', form.name, [
  rules.required(t('organizer.profile.validation.name_required')),
  rules.minLength(2, t('organizer.profile.validation.name_min'))
])

const validateSlug = () => validate('slug', form.slug, [
  rules.required(t('organizer.profile.validation.slug_required')),
  rules.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t('organizer.profile.validation.slug_invalid'))
])

const validateWhatsApp = () => validate('whatsapp_no', form.whatsapp_no, [
  rules.required(t('organizer.profile.validation.whatsapp_required')),
  rules.pattern(/^(\+?[0-9]{8,16})$/, t('organizer.profile.validation.whatsapp_invalid'))
])

const validateWebsite = () => {
  if (!form.website || !form.website.trim()) {
    errors.website = null
    return true
  }
  return validate('website', form.website, [
    rules.pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, t('organizer.profile.validation.website_invalid'))
  ])
}

const saving = ref(false)
const activeTab = ref('general')

const tabs = computed(() => [
  { id: 'general', label: t('organizer.profile.general_tab'), icon: 'ph:identification-badge-bold' },
  { id: 'contact', label: t('organizer.profile.contact_tab'), icon: 'ph:phone-bold' },
  { id: 'about', label: t('organizer.profile.about_tab'), icon: 'ph:eye-bold' },
  { id: 'faq', label: t('organizer.profile.faq_tab'), icon: 'ph:question-bold' }
])

const pageSettings = reactive({
  sections: {
    identity: true,
    contact: true,
    about: true,
    faq: true
  }
})

const platformOptions = computed(() => [
  { value: 'instagram', title: 'Instagram', icon: 'ph:instagram-logo', iconColor: 'text-pink-500', placeholder: '@username_instagram' },
  { value: 'facebook', title: 'Facebook', icon: 'ph:facebook-logo', iconColor: 'text-blue-600', placeholder: t('organizer.profile.platform_username_placeholder') },
  { value: 'twitter', title: 'Twitter / X', icon: 'ph:x-logo', iconColor: 'text-slate-800', placeholder: '@username' },
  { value: 'youtube', title: 'YouTube', icon: 'ph:youtube-logo', iconColor: 'text-red-600', placeholder: t('organizer.profile.platform_channel_placeholder') },
  { value: 'tiktok', title: 'TikTok', icon: 'ph:tiktok-logo', iconColor: 'text-black', placeholder: '@username_tiktok' },
  { value: 'whatsapp', title: 'WhatsApp', icon: 'ph:whatsapp-logo', iconColor: 'text-green-600', placeholder: '081234567890' },
  { value: 'linkedin', title: 'LinkedIn', icon: 'ph:linkedin-logo', iconColor: 'text-blue-700', placeholder: t('organizer.profile.platform_username_placeholder') }
])

const remainingPlatforms = computed(() => {
  return platformOptions.value.filter(p => !form.socialMedia.some(s => s.platform === p.value))
})

const getPlatformInfo = (platform) => {
  return platformOptions.value.find(p => p.value === platform) || platformOptions.value[0]
}

const getPlatformIconBagde = (platform) => {
  if (platform === 'instagram') return 'bg-pink-50 text-pink-600 border border-pink-100'
  if (platform === 'tiktok') return 'bg-black text-white border border-black'
  if (platform === 'whatsapp') return 'bg-green-50 text-green-600 border border-green-100'
  if (platform === 'facebook') return 'bg-blue-50 text-blue-600 border border-blue-100'
  if (platform === 'twitter') return 'bg-slate-50 text-slate-800 border border-slate-100'
  if (platform === 'youtube') return 'bg-red-50 text-red-600 border border-red-100'
  if (platform === 'linkedin') return 'bg-blue-50 text-blue-700 border border-blue-100'
  return 'bg-gray-100 text-gray-600'
}


const form = reactive({
  name: '',
  slug: '',
  bannerUrl: '',
  logoUrl: '',
  country: 'Indonesia',
  registration_number: '',
  established_date: '',
  description: '',
  whatsapp_no: '',
  email: '',
  website: '',
  address: '',
  socialMedia: [],
  vision: '',
  mission: '',
  history: '',
  faq: []
})


// Auto-generate slug from name
watch(() => form.name, (newVal) => {
  // Only auto-generate if slug is empty
  if (!form.slug && newVal) {
    form.slug = newVal
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
})

// City autocomplete
const citySearch = ref('')
const showCityDropdown = ref(false)
const filteredCities = ref([])
const loadingCities = ref(false)
let cityTimeout = null

const handleCitySearch = () => {
  if (cityTimeout) clearTimeout(cityTimeout)
  if (!citySearch.value || citySearch.value.length < 2) {
    filteredCities.value = []
    return
  }

  loadingCities.value = true
  cityTimeout = setTimeout(async () => {
    try {
      const response = await get('/cities')
      const cities = response.data || []

      const search = citySearch.value.toLowerCase()
      filteredCities.value = cities
        .filter(c => c.name.toLowerCase().includes(search))
        .map(c => c.name)
        .slice(0, 10)
    } catch (e) {
      console.error('Failed to fetch cities', e)
    } finally {
      loadingCities.value = false
    }
  }, 500)
}

const selectCity = (city) => {
  form.city = city
  citySearch.value = city
  showCityDropdown.value = false
}

const handleCityBlur = () => {
  setTimeout(() => {
    showCityDropdown.value = false
  }, 200)
}

// Media Library
const showMediaLibrary = ref(false)
const mediaTarget = ref('') // 'logo' or 'banner'

const openMediaLibrary = (target) => {
  mediaTarget.value = target
  showMediaLibrary.value = true
}

const handleMediaSelect = (media) => {
  if (mediaTarget.value === 'logo') {
    const img = new Image()
    img.src = media.url
    img.onload = () => {
      const ratio = img.width / img.height
      if (ratio < 0.8 || ratio > 1.2) {
        toast.error(t('organizer.profile.logo_aspect_error'))
        return
      }
      form.logoUrl = media.url
      showMediaLibrary.value = false
    }
    img.onerror = () => {
      form.logoUrl = media.url
      showMediaLibrary.value = false
    }
  } else if (mediaTarget.value === 'banner') {
    const img = new Image()
    img.src = media.url
    img.onload = () => {
      const ratio = img.width / img.height
      if (ratio < 1.8 || ratio > 3.2) {
        toast.error(t('organizer.profile.banner_aspect_error'))
        return
      }
      form.bannerUrl = media.url
      showMediaLibrary.value = false
    }
    img.onerror = () => {
      form.bannerUrl = media.url
      showMediaLibrary.value = false
    }
  }
}

// Social media handlers
const addSocialMedia = (platform) => {
  if (form.socialMedia.length < 6) {
    // If platform is not provided (legacy call), use first available or instagram
    const p = platform || (remainingPlatforms.value.length > 0 ? remainingPlatforms.value[0].value : 'instagram')
    form.socialMedia.push({ platform: p, username: '' })
  }
}

const removeSocialMedia = (index) => {
  form.socialMedia.splice(index, 1)
}

const addFAQ = () => {
  form.faq.push({ question: '', answer: '' })
}

const removeFAQ = (index) => {
  form.faq.splice(index, 1)
}

const loadProfile = async () => {
  try {
    // Fetch fresh organizer profile from API
    let org = organizerProfile.value
    try {
      const res = await get('/organizers/me')
      if (res && (res.id || res.uuid || res.name)) {
        org = res
      }
    } catch (e) {
      console.warn('API /organizers/me fetch failed, fallback to useAuth organizerProfile:', e)
    }

    if (org && (org.id || org.uuid || org.name)) {
      form.name = org.name || ''
      form.slug = org.slug || ''
      form.registration_number = org.registration_number || ''
      form.established_date = org.established_date ? org.established_date.split('T')[0] : ''
      form.bannerUrl = org.banner_url || ''
      form.logoUrl = org.avatar_url || org.logo_url || ''
      form.country = org.country || 'Indonesia'
      form.description = org.description || ''
      form.whatsapp_no = org.whatsapp_no || ''
      form.email = org.email || ''
      form.website = org.website || ''
      form.address = org.address || ''
      form.vision = org.vision || ''
      form.mission = org.mission || ''
      form.history = org.history || ''

      const parseOrRaw = (val) => {
        if (typeof val === 'string' && (val.startsWith('[') || val.startsWith('{'))) {
          try { return JSON.parse(val) } catch (e) { return [] }
        }
        return val || []
      }

      form.faq = parseOrRaw(org.faq)
      form.socialMedia = parseOrRaw(org.social_media)

      // Load page settings
      const rawPageSettings = org.page_settings
      if (rawPageSettings) {
        try {
          const parsed = typeof rawPageSettings === 'string' ? JSON.parse(rawPageSettings) : rawPageSettings
          if (parsed.sections) {
            Object.assign(pageSettings.sections, parsed.sections)
          }
        } catch (e) {
          console.error('Failed to parse page_settings', e)
        }
      }
    }
  } catch (error) {
    console.error('Load profile error:', error)
    toast.error(t('organizer.profile.load_error'))
  }
}

const saveProfile = async () => {
  const isNameValid = validateName()
  const isSlugValid = validateSlug()
  const isWhatsappValid = validateWhatsApp()
  const isWebsiteValid = validateWebsite()

  if (!isNameValid || !isSlugValid || !isWhatsappValid || !isWebsiteValid) {
    if (!isNameValid || !isSlugValid) {
      activeTab.value = 'general'
    } else if (!isWhatsappValid || !isWebsiteValid) {
      activeTab.value = 'contact'
    }
    toast.error(t('organizer.profile.validation_failed'))
    return
  }

  saving.value = true
  try {
    await put('/organizers/me', {
      name: form.name,
      slug: form.slug,
      banner_url: form.bannerUrl,
      logo_url: form.logoUrl,
      avatar_url: form.logoUrl, // Some APIs might expect avatar_url
      country: form.country,
      registration_number: form.registration_number,
      established_date: form.established_date,
      description: form.description,
      whatsapp_no: form.whatsapp_no,
      website: form.website,
      address: form.address,
      vision: form.vision,
      mission: form.mission,
      history: form.history,
      faq: form.faq,
      social_media: form.socialMedia,
      page_settings: JSON.stringify(pageSettings)
    })
    toast.success(t('organizer.profile.save_success'))
  } catch (error) {
    console.error('Save profile error:', error)
    const errData = error?.data || error?.response?.data || {}
    const errorMessage = errData.error || error?.message || t('organizer.profile.save_error')
    const details = errData.details ? ` (${errData.details})` : ''
    toast.error(errorMessage + details)
  } finally {
    saving.value = false
  }
}


watch(organizerProfile, () => {
  loadProfile()
}, { immediate: true })

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>

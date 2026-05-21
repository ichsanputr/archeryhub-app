<template>
  <div class="flex flex-col gap-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="flex items-center gap-5">
        <div class="size-12 rounded-2xl bg-navy flex items-center justify-center shrink-0 shadow-lg">
          <Icon icon="ph:buildings-bold" class="text-primary text-2xl" />
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-navy tracking-tight leading-none ">
            {{ t('organization.profile.title') }}
          </h1>
          <p class="text-[10px] text-gray-400 font-bold mt-1 tracking-wider ">
            {{ t('organization.profile.subtitle') }}
          </p>
        </div>
      </div>
      <div class="flex gap-3">
        <BaseButton variant="primary" :loading="saving" @click="saveProfile" icon="ph:floppy-disk"
          class="h-11 px-6 shadow-lg shadow-primary/20 font-black tracking-widest text-[10px] !rounded-xl">
          {{ saving ? t('organization.profile.saving') : t('organization.profile.save') }}
        </BaseButton>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="flex gap-1 bg-gray-100/80 rounded-2xl p-1.5 overflow-x-auto no-scrollbar shadow-sm">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        :class="activeTab === tab.id ? 'bg-white shadow text-navy' : 'text-gray-500 hover:text-navy hover:bg-white/50'"
        class="flex items-center justify-center gap-2 flex-1 min-w-[140px] px-5 py-2.5 rounded-xl text-sm font-black transition-all">
        <Icon :icon="tab.icon" class="text-lg" />
        {{ tab.label }}
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
            <div class="flex items-center justify-between">
              <h3 class=" text-xs font-black text-navy  tracking-[0.2em] flex items-center gap-2">
                <Icon icon="ph:identification-badge-bold" class="text-primary text-lg" /> {{ t('organization.profile.identity_section') }}
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="form.name" :label="t('organization.profile.name_label')" :placeholder="t('organization.profile.name_placeholder')" required />

              <!-- Slug URL -->
              <BaseInput v-model="form.slug" :label="t('organization.profile.slug_label')" :placeholder="t('organization.profile.slug_placeholder')"
                :helper="t('organization.profile.slug_helper')" />

              <!-- Country Select -->
              <BaseSelect v-model="form.country" :label="t('organization.profile.country_label')" :placeholder="t('organization.profile.country_placeholder')" required
                :items="countries" searchable />
            </div>
            <div>
              <label class="block text-sm font-bold text-navy mb-2">{{ t('organization.profile.about_label') }}</label>
              <TiptapEditor v-model="form.description"
                :placeholder="t('organization.profile.about_placeholder')" minHeight="180px" />
            </div>
          </div>

          <!-- Logo & Banner -->
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
            <h3 class=" text-xs font-black text-navy  tracking-[0.2em] flex items-center gap-2">
              <Icon icon="ph:image-bold" class="text-primary text-lg" /> {{ t('organization.profile.branding_section') }}
            </h3>

            <div class="space-y-8">
              <!-- Logo Upload -->
              <div class="space-y-4">
                <label class="block text-sm font-black text-navy">{{ t('organization.profile.logo_label') }}</label>
                <div class="flex flex-col items-center gap-5 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div
                    class="w-32 h-32 rounded-2xl bg-white border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center shadow-inner group">
                    <img :src="useImageOrDefault(form.logoUrl, form.name)"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div class="flex gap-2 w-full">
                    <BaseButton @click="openMediaLibrary('logo')" variant="primary" size="sm"
                      icon="ph:cloud-arrow-up-bold" class="flex-1 h-10 font-black tracking-widest text-[10px]">
                      {{ t('organization.profile.choose_logo') }}
                    </BaseButton>
                    <BaseButton v-if="form.logoUrl" @click="form.logoUrl = ''" variant="white" size="sm"
                      icon="ph:trash-bold"
                      class="h-10 w-10 p-0 text-red-500 bg-red-50 border-red-100 hover:bg-red-100" />
                  </div>
                </div>
              </div>

              <!-- Banner Upload -->
              <div class="space-y-4">
                <label class="block text-sm font-black text-navy">{{ t('organization.profile.banner_label') }}</label>
                <div class="relative group">
                  <div
                    class="h-44 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center shadow-inner">
                    <img v-if="form.bannerUrl" :src="form.bannerUrl"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div v-else class="text-center p-6">
                      <Icon icon="ph:image-square-bold" class="text-4xl text-gray-200 mx-auto mb-2" />
                      <p class="text-[10px] text-gray-400 font-bold  tracking-wider">{{ t('organization.profile.banner_desc') }}</p>
                    </div>
                  </div>
                  <div class="mt-4 flex gap-2">
                    <BaseButton @click="openMediaLibrary('banner')" variant="primary" size="sm" icon="ph:image-bold"
                      class="flex-1 h-10 font-black tracking-widest text-[10px]">
                      {{ t('organization.profile.choose_banner') }}
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
            <h3 class=" text-xs font-black text-navy  tracking-[0.2em] flex items-center gap-2">
              <Icon icon="ph:phone-bold" class="text-primary text-xl" /> {{ t('organization.profile.contact_section') }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="form.whatsapp_no" :label="t('organization.profile.whatsapp_label')" :placeholder="t('organization.profile.whatsapp_placeholder')"
                required />
              <BaseInput v-model="form.email" :label="t('organization.profile.email_label')" type="email" :placeholder="t('organization.profile.email_placeholder')"
                disabled />
              <BaseInput v-model="form.website" :label="t('organization.profile.website_label')" :placeholder="t('organization.profile.website_placeholder')" />
            </div>
            <BaseTextarea v-model="form.address" :label="t('organization.profile.address_label')" rows="3"
              :placeholder="t('organization.profile.address_placeholder')" />
          </div>

          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class=" text-xs font-black text-navy tracking-[0.2em] flex items-center gap-2">
                <Icon icon="ph:share-network-bold" class="text-primary text-xl" /> {{ t('organization.profile.social_section') }}
              </h3>

              <div class="relative group">
                <BaseButton variant="white" size="xs" icon="ph:plus-bold"
                  class="border-dashed border-2 hover:border-primary hover:text-primary transition-all">
                  {{ t('organization.profile.add_social') }}
                </BaseButton>
                <!-- Dropdown for adding socials -->
                <div
                  class="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                  <button v-for="plat in remainingPlatforms" :key="plat.value" @click="addSocialMedia(plat.value)"
                    class="w-full text-left px-4 py-2 text-sm font-bold text-navy hover:bg-gray-50 flex items-center gap-3">
                    <Icon :icon="plat.icon" :class="plat.iconColor" />
                    {{ plat.title }}
                  </button>
                  <p v-if="remainingPlatforms.length === 0" class="px-4 py-2 text-xs text-gray-400 italic">
                    {{ t('organization.profile.all_platforms_added') }}
                  </p>
                </div>
              </div>
            </div>

            <p class="text-sm text-gray-500 font-medium">{{ t('organization.profile.social_desc') }}</p>

            <div class="grid grid-cols-1 gap-4 mt-2">
              <div v-for="(social, idx) in form.socialMedia" :key="social.platform"
                class="bg-gray-50/30 p-4 rounded-2xl border border-gray-100 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                      :class="getPlatformIconBagde(social.platform)">
                      <Icon :icon="getPlatformInfo(social.platform).icon" class="text-lg" />
                    </div>
                    <span class="text-xs font-black text-navy tracking-widest">{{
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
                <p class="text-sm text-gray-400 font-bold tracking-widest">{{ t('organization.profile.no_social_added') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Visi, Misi & Sejarah -->
        <div v-if="activeTab === 'about'" class="space-y-8">
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <h3 class=" text-xs font-black text-navy  tracking-[0.2em] flex items-center gap-2">
              <Icon icon="ph:eye-bold" class="text-primary text-xl" /> {{ t('organization.profile.vision_section') }}
            </h3>
            <div>
              <label class="block text-sm font-bold text-navy mb-2">{{ t('organization.profile.vision_label') }}</label>
              <TiptapEditor v-model="form.vision" :placeholder="t('organization.profile.vision_placeholder')" minHeight="120px" />
            </div>
            <div>
              <label class="block text-sm font-bold text-navy mb-2">{{ t('organization.profile.mission_label') }}</label>
              <TiptapEditor v-model="form.mission" :placeholder="t('organization.profile.mission_placeholder')"
                minHeight="180px" />
            </div>
          </div>

          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <h3 class=" text-xs font-black text-navy  tracking-[0.2em] flex items-center gap-2">
              <Icon icon="ph:book-open-bold" class="text-primary text-xl" /> {{ t('organization.profile.history_section') }}
            </h3>
            <div>
              <label class="block text-sm font-bold text-navy mb-2">{{ t('organization.profile.history_label') }}</label>
              <TiptapEditor v-model="form.history" :placeholder="t('organization.profile.history_placeholder')"
                minHeight="240px" />
            </div>
          </div>
        </div>

        <!-- Tab: FAQ -->
        <div v-if="activeTab === 'faq'" class="space-y-8">
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class=" text-xs font-black text-navy  tracking-[0.2em] flex items-center gap-2">
                <Icon icon="ph:question-bold" class="text-primary text-xl" /> {{ t('organization.profile.faq_section') }}
              </h3>
              <button @click="addFAQ"
                class="text-xs font-black text-primary hover:text-primary-dark flex items-center gap-1 transition">
                <Icon icon="ph:plus-circle-bold" /> {{ t('organization.profile.add_faq') }}
              </button>
            </div>

            <div class="space-y-4">
              <div v-for="(item, idx) in form.faq" :key="idx"
                class="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 relative group">
                <button @click="removeFAQ(idx)"
                  class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                  <Icon icon="ph:trash-bold" />
                </button>
                <BaseInput v-model="item.question" :label="t('organization.profile.faq_question_label')"
                  :placeholder="t('organization.profile.faq_question_placeholder')" />
                <div>
                  <label class="block text-sm font-bold text-navy mb-2">{{ t('organization.profile.faq_answer_label') }}</label>
                  <TiptapEditor v-model="item.answer" :placeholder="t('organization.profile.faq_answer_placeholder')" minHeight="120px" />
                </div>
              </div>

              <div v-if="form.faq.length === 0"
                class="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
                <Icon icon="ph:chat-centered-dots-bold" class="text-4xl text-gray-200 mx-auto mb-2" />
                <p class="text-sm text-gray-400 font-bold  tracking-widest">{{ t('organization.profile.no_faq') }}</p>
                <button @click="addFAQ"
                  class="mt-4 px-4 py-2 bg-navy text-white text-xs font-black rounded-xl shadow-md hover:bg-navy-dark transition">{{ t('organization.profile.create_first_faq') }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Side card -->
      <div class="space-y-4">
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h3 class=" text-xs font-black text-navy  tracking-[0.2em] flex items-center gap-2">
            <Icon icon="ph:gear-six-bold" class="text-primary text-lg" /> {{ t('organization.profile.visibility_section') }}
          </h3>
          <p class="text-xs text-gray-500 font-medium">{{ t('organization.profile.visibility_desc') }}</p>
          <div class="space-y-4 pt-2">
            <BaseCheckbox v-model="pageSettings.sections.identity" :label="t('organization.profile.visibility_identity')" />
            <BaseCheckbox v-model="pageSettings.sections.contact" :label="t('organization.profile.visibility_contact')" />
            <BaseCheckbox v-model="pageSettings.sections.about" :label="t('organization.profile.visibility_about')" />
            <BaseCheckbox v-model="pageSettings.sections.faq" :label="t('organization.profile.visibility_faq')" />
          </div>
        </div>

        <!-- Public Profile Link -->
        <div
          class="bg-gradient-to-br from-navy to-navy-light rounded-3xl p-6 text-white shadow-md shadow-navy/20 relative overflow-hidden group">
          <Icon icon="ph:broadcast-bold"
            class="absolute -right-4 -top-4 text-8xl text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          <h3 class="font-black mb-2 flex items-center gap-2 relative z-10">
            {{ t('organization.profile.public_profile') }}
            <Icon icon="ph:check-circle-fill" class="text-primary" />
          </h3>
          <p class="text-xs text-blue-200 mb-6 relative z-10 leading-relaxed font-medium">{{ t('organization.profile.public_profile_desc') }}</p>
          <NuxtLink v-if="form.slug" :to="`/organization/${form.slug}`" target="_blank"
            class="relative z-10 block w-full py-3.5 bg-primary text-navy font-black rounded-2xl text-center hover:bg-primary-hover hover:scale-[1.02] transition-all shadow-md active:scale-95">
            {{ t('organization.profile.view_public_page') }}
          </NuxtLink>
          <p v-else class="text-xs text-blue-300 italic relative z-10">{{ t('organization.profile.slug_not_set') }}</p>
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
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'
import { useImageOrDefault } from '~/composables/useImageHelper'
import BaseSelect from '~/components/common/BaseSelect.vue'

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

definePageMeta({
  title: 'Profil Organisasi',
  layout: 'dashboard',
  middleware: ['auth']
})

useHead({
  title: 'Profil Organisasi - Archeris Dashboard'
})

const router = useRouter()
const { get, put } = useApi()
const { user, organizationProfile } = useAuth()
const toast = useToast()
const { t } = useDashboardI18n()

const saving = ref(false)
const activeTab = ref('general')

const tabs = [
  { id: 'general', label: t('organization.profile.general_tab'), icon: 'ph:identification-badge-bold' },
  { id: 'contact', label: t('organization.profile.contact_tab'), icon: 'ph:phone-bold' },
  { id: 'about', label: t('organization.profile.about_tab'), icon: 'ph:eye-bold' },
  { id: 'faq', label: t('organization.profile.faq_tab'), icon: 'ph:question-bold' }
]

const pageSettings = reactive({
  sections: {
    identity: true,
    contact: true,
    about: true,
    faq: true
  }
})

const platformOptions = [
  { value: 'instagram', title: 'Instagram', icon: 'ph:instagram-logo', iconColor: 'text-pink-500', placeholder: '@username_instagram' },
  { value: 'facebook', title: 'Facebook', icon: 'ph:facebook-logo', iconColor: 'text-blue-600', placeholder: 'username / link' },
  { value: 'twitter', title: 'Twitter / X', icon: 'ph:x-logo', iconColor: 'text-slate-800', placeholder: '@username' },
  { value: 'youtube', title: 'YouTube', icon: 'ph:youtube-logo', iconColor: 'text-red-600', placeholder: 'channel_id / link' },
  { value: 'tiktok', title: 'TikTok', icon: 'ph:tiktok-logo', iconColor: 'text-black', placeholder: '@username_tiktok' },
  { value: 'whatsapp', title: 'WhatsApp', icon: 'ph:whatsapp-logo', iconColor: 'text-green-600', placeholder: '081234567890' },
  { value: 'linkedin', title: 'LinkedIn', icon: 'ph:linkedin-logo', iconColor: 'text-blue-700', placeholder: 'username / link' }
]

const remainingPlatforms = computed(() => {
  return platformOptions.filter(p => !form.socialMedia.some(s => s.platform === p.value))
})

const getPlatformInfo = (platform) => {
  return platformOptions.find(p => p.value === platform) || platformOptions[0]
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
    form.logoUrl = media.url
  } else if (mediaTarget.value === 'banner') {
    form.bannerUrl = media.url
  }
  showMediaLibrary.value = false
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
    // Use organizationProfile (already loaded by server middleware)
    const org = organizationProfile.value

    if (org && (org.id || org.uuid)) {
      form.name = org.name || ''
      form.slug = org.slug || ''
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
    toast.error('Gagal memuat profil organisasi')
  }
}

const saveProfile = async () => {
  saving.value = true
  try {
    await put('/organizations/me', {
      name: form.name,
      slug: form.slug,
      banner_url: form.bannerUrl,
      logo_url: form.logoUrl,
      avatar_url: form.logoUrl, // Some APIs might expect avatar_url
      country: form.country,
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
    toast.success('Profil organisasi berhasil disimpan!')
  } catch (error) {
    console.error('Save profile error:', error)
    const errData = error?.data || error?.response?.data || {}
    const errorMessage = errData.error || error?.message || 'Gagal menyimpan profil'
    const details = errData.details ? ` (${errData.details})` : ''
    toast.error(errorMessage + details)
  } finally {
    saving.value = false
  }
}


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

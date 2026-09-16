<template>
  <div class="flex flex-col gap-8">
    <!-- Header -->
    <div
        class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
        <!-- Theme Motif Pattern -->
        <div class="absolute inset-0"
            style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
        </div>

        <!-- Decorative Background Elements -->
        <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
        <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

        <!-- Header Content -->
        <div class="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
                <div class="flex items-center gap-2 text-sm text-white/60 mb-4">
                    <NuxtLink to="/dashboard/archer" class="hover:text-white transition-colors">Dashboard</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-base" />
                    <span class="text-primary font-medium">{{ t('profile.title') }}</span>
                </div>
                <div class="flex items-start gap-4">
                    <!-- Icon Badge -->
                    <div
                        class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
                        <Icon icon="ph:user-circle-bold" class="text-primary text-2xl" />
                    </div>
                    <div class="flex-grow">
                        <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight">{{ t('profile.title') }}</h1>
                        <div class="text-slate-300 text-sm mt-1">{{ t('profile.subtitle') }}</div>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-3 shrink-0">
                <button v-if="accountForm.username || user?.username" @click="previewProfile"
                    class="h-9 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-black tracking-wider flex items-center gap-2 backdrop-blur-sm transition-all shadow-sm shrink-0">
                    <Icon icon="ph:eye-bold" class="text-base text-primary" />
                    <span>{{ t('profile.preview') }}</span>
                </button>
                <BaseButton variant="gold" size="sm" icon="ph:floppy-disk" @click="saveFullProfile" :loading="isSaving">
                    {{ t('profile.save_profile') }}
                </BaseButton>
            </div>
        </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-slate-100 rounded-2xl p-1.5 overflow-x-auto no-scrollbar shadow-sm">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        :class="activeTab === tab.id ? 'bg-white shadow-sm text-navy font-black' : 'text-slate-500 hover:text-navy hover:bg-white/50 font-bold'"
        class="flex items-center justify-center gap-2 flex-1 min-w-[140px] px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all shrink-0">
        <Icon :icon="tab.icon" class="text-base sm:text-lg shrink-0" />
        <span class="whitespace-nowrap">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Main Full-Width Customization Area -->
    <div class="w-full space-y-6">
        
        <!-- TAB 1: INFORMASI PRIBADI, KONTAK & SOSIAL -->
        <div v-if="activeTab === 'information'" class="space-y-6">
          
          <!-- Media Section (Avatar & Banner) -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy flex items-center gap-2 mb-6">
              <Icon icon="ph:image-bold" class="text-primary text-xl" />
              {{ t('profile.media_title') }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Avatar -->
              <div class="space-y-4">
                <div class="text-xs font-bold text-slate-400">{{ t('profile.avatar_label') }}</div>
                <div class="flex items-center gap-6">
                  <div
                    class="w-24 h-24 rounded-full bg-gray-50 border-4 border-white shadow-md overflow-hidden shrink-0 relative group">
                    <img :src="useImageOrDefault(accountForm.avatar_url, accountForm.full_name)"
                       class="w-full h-full object-cover" />
                    <div
                      class="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      @click="openMediaLibrary('avatar')">
                      <Icon icon="ph:camera-bold" class="text-white text-2xl" />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <h5 class="text-xs font-black text-navy">{{ t('profile.picture_title') }}</h5>
                    <div class="text-[10px] text-gray-500 max-w-[160px]">{{ t('profile.picture_desc') }}</div>
                    <BaseButton variant="outline" size="xs" icon="ph:pencil-simple" @click="openMediaLibrary('avatar')">
                      {{ t('profile.change_photo') }}
                    </BaseButton>
                  </div>
                </div>
              </div>

              <!-- Banner -->
              <div class="space-y-4">
                <div class="text-xs font-bold text-slate-400">{{ t('profile.banner_label') }}</div>
                <div
                  class="w-full aspect-[21/9] rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden relative group">
                  <img v-if="accountForm.banner_url" :src="useImageOrDefault(accountForm.banner_url)"
                    class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <Icon icon="ph:image-square" class="text-3xl mb-1" />
                    <span class="text-[10px] font-bold">{{ t('profile.no_banner') }}</span>
                  </div>
                  <div
                    class="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    @click="openMediaLibrary('banner')">
                    <Icon icon="ph:pencil-simple-bold" class="text-white text-2xl" />
                  </div>
                  <button v-if="accountForm.banner_url" @click.stop="accountForm.banner_url = ''"
                    class="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon icon="ph:trash" />
                  </button>
                </div>
                <div class="text-[10px] text-gray-500">{{ t('profile.banner_desc') }}</div>
              </div>
            </div>
          </div>

          <!-- Identitas & Data Diri -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy flex items-center gap-2 mb-2">
              <Icon icon="ph:user-circle-bold" class="text-primary text-xl" />
              {{ t('profile.identity_title') }}
            </h3>
            <div class="text-xs text-gray-500">
              {{ t('profile.identity_desc') }}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              <BaseInput v-model="accountForm.full_name" :label="t('profile.full_name')" :placeholder="t('profile.full_name_placeholder')" required />
              
              <BaseInput v-model="accountForm.username" :label="t('profile.username')" placeholder="username"
                :hint="t('profile.username_hint')" :error="isUsernameTaken ? t('profile.username_taken', 'Username is already taken') : ''" />

              <BaseDatePicker v-model="accountForm.date_of_birth" :label="t('profile.dob')" />

              <BaseSelect v-model="accountForm.gender" :label="t('profile.gender')" :items="[
                { title: t('profile.male'), value: 'male' },
                { title: t('profile.female'), value: 'female' }
              ]" icon="ph:gender-intersex" />

              <BaseInput v-model.number="accountForm.height_cm" :label="t('profile.height_label')" type="number" placeholder="170" icon="ph:arrows-out-line-vertical-bold" />
              
              <BaseInput v-model.number="accountForm.weight_kg" :label="t('profile.weight_label')" type="number" placeholder="65" icon="ph:scales-bold" />
            </div>
          </div>

          <!-- Spesifikasi Atlet & Klub -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy flex items-center gap-2 mb-2">
              <Icon icon="hugeicons:archer" class="text-primary text-xl" />
              {{ t('profile.athlete_specs_title') }}
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <BaseSelect v-model="accountForm.bow_type" :label="t('profile.bow_type')" :items="[
                { title: 'Recurve', value: 'recurve' },
                { title: 'Compound', value: 'compound' },
                { title: 'Barebow', value: 'barebow' },
                { title: 'Traditional', value: 'traditional' }
              ]" icon="hugeicons:archer" />

              <BaseSelect v-model="accountForm.hand_dominance" :label="t('profile.hand_dominance')" :items="[
                { title: t('profile.right_handed'), value: 'right' },
                { title: t('profile.left_handed'), value: 'left' }
              ]" icon="ph:hand-pointing-bold" />

              <div class="md:col-span-2">
                <ClubSelector 
                  v-model="accountForm.club_id"
                  v-model:newClubName="accountForm.new_club_name"
                  v-model:newClubAcronym="accountForm.new_club_acronym"
                  :label="t('profile.club_label')" />
              </div>
            </div>
          </div>

          <!-- Kontak & Kontak Darurat -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy flex items-center gap-2 mb-2">
              <Icon icon="ph:phone-bold" class="text-primary text-xl" />
              {{ t('profile.contact_title') }}
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              <BaseInput v-model="accountForm.phone" :label="t('profile.phone')" type="tel" placeholder="+62 812-3456-7890"
                icon="ph:phone" numberOnly />

              <BaseInput v-model="accountForm.email" label="Email" type="email" placeholder="archer@example.com" icon="ph:envelope-simple-bold" />

              <BaseInput v-model="accountForm.emergency_contact_name" :label="t('profile.emergency_name')" :placeholder="t('profile.full_name_placeholder', 'Nama Lengkap')" icon="ph:user-bold" />
            </div>
          </div>

          <!-- Alamat & Domisili -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy flex items-center gap-2 mb-2">
              <Icon icon="ph:map-pin-bold" class="text-primary text-xl" />
              {{ t('profile.address_title') }}
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <BaseSelect v-model="accountForm.country" :label="t('profile.country')" :items="countries"
                :placeholder="t('profile.select_country', 'Select Country...')" icon="ph:globe" searchable />

              <BaseInput v-model="accountForm.city" :label="t('profile.city')" :placeholder="t('profile.city_placeholder', 'Kabupaten / Kota')" icon="ph:buildings-bold" />

              <div class="sm:col-span-2">
                <BaseTextarea v-model="accountForm.address" :label="t('profile.address')" :placeholder="t('profile.address_placeholder')"
                  :rows="3" icon="ph:house" />
              </div>
            </div>
          </div>

          <!-- Media Sosial & Tautan Publik -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-navy flex items-center gap-2">
                <Icon icon="ph:share-network-bold" class="text-primary text-xl" />
                {{ t('profile.social_title') }}
              </h3>

              <div class="relative group">
                <BaseButton variant="outline" size="xs" icon="ph:plus-bold">
                  {{ t('profile.add_social') }}
                </BaseButton>
                <!-- Dropdown for adding socials -->
                <div
                  class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                  <button v-for="plat in remainingPlatforms" :key="plat.value" @click="addSocial(plat.value)"
                    class="w-full text-left px-4 py-2 text-sm font-bold text-navy hover:bg-gray-50 flex items-center gap-3">
                    <Icon :icon="plat.icon" :class="plat.iconColor" />
                    {{ plat.title }}
                  </button>
                  <div v-if="remainingPlatforms.length === 0" class="px-4 py-2 text-xs text-gray-400 italic">
                    {{ t('profile.all_platforms_added') }}
                  </div>
                </div>
              </div>
            </div>

            <div class="text-xs text-gray-500">{{ t('profile.social_media_desc') }}</div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div v-for="(social, idx) in userSocials" :key="social.platform"
                class="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                      :class="getPlatformIconBagde(social.platform)">
                      <Icon :icon="getPlatformInfo(social.platform).icon" class="text-lg" />
                    </div>
                    <span class="text-xs font-black text-navy tracking-widest">{{
                      getPlatformInfo(social.platform).title }}</span>
                  </div>
                  <button @click="removeSocial(idx)" class="text-gray-400 hover:text-red-500 transition-colors">
                    <Icon icon="ph:trash-bold" />
                  </button>
                </div>
                <div class="flex items-center gap-3">
                  <input v-model="social.handle" type="text" :placeholder="getPlatformInfo(social.platform).placeholder"
                    class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium shadow-sm transition-all" />
                </div>
              </div>

              <div v-if="userSocials.length === 0"
                class="py-8 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                <Icon icon="ph:share-network" class="text-4xl text-gray-200 mx-auto mb-2" />
                <div class="text-xs text-gray-400 font-medium">{{ t('profile.no_socials') }}</div>
              </div>
            </div>


          </div>
        </div>

        <!-- TAB 2: BIOGRAFI & PRESTASI -->
        <div v-if="activeTab === 'profile'" class="space-y-6">
          <!-- Bio Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div class="border-b border-slate-100 pb-4">
              <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2">
                <Icon icon="ph:identification-card-bold" class="text-primary text-xl" />
                {{ t('profile.about_me') }}
              </h3>
              <div class="text-xs text-slate-500 font-medium mt-1">
                {{ t('profile.bio_hint') }}
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-bold text-navy mb-2">{{ t('profile.self_desc') }}</label>
                <ClientOnly>
                  <TiptapEditor v-model="profile.bio"
                    :placeholder="t('profile.bio_placeholder')"
                    minHeight="180px" />
                </ClientOnly>
              </div>
            </div>
          </div>

          <!-- Achievements Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div class="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2">
                  <Icon icon="ph:medal-bold" class="text-primary text-xl" />
                  {{ t('profile.achievements') }}
                </h3>
                <div class="text-xs text-slate-500 font-medium mt-1">
                  {{ t('profile.star_hint') }}
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div v-for="(ach, idx) in achievementsList" :key="idx" class="flex items-center gap-2">
                <!-- Highlight Star Toggle -->
                <button type="button" @click="toggleAchievementHighlight(idx)"
                  :title="t('profile.highlight_hint')"
                  :class="ach.is_highlighted ? 'bg-amber-50 text-amber-600 border-amber-300 shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-amber-500'"
                  class="h-11 px-3 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all shrink-0">
                  <Icon :icon="ach.is_highlighted ? 'ph:star-fill' : 'ph:star-bold'" class="text-base" />
                  <span v-if="ach.is_highlighted" class="hidden sm:inline text-[10px] font-black capitalize tracking-wider">{{ t('profile.highlight_badge') }}</span>
                </button>

                <BaseInput v-model="ach.text" :placeholder="t('profile.achievement_placeholder')" icon="ph:medal-bold"
                  class="flex-1" />

                <button @click="achievementsList.splice(idx, 1)"
                  class="h-11 w-11 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 border border-slate-200 flex items-center justify-center transition-colors shrink-0">
                  <Icon icon="ph:trash-bold" class="text-base" />
                </button>
              </div>

              <div v-if="achievementsList.length === 0"
                class="py-8 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                <Icon icon="ph:trophy" class="text-4xl text-gray-200 mx-auto mb-2" />
                <div class="text-xs text-gray-400 font-medium">{{ t('profile.no_achievements_yet', 'No achievements added yet') }}</div>
              </div>

              <BaseButton variant="outline" size="md" icon="ph:plus-bold"
                @click="achievementsList.push({ text: '', is_highlighted: false })" class="w-full font-bold min-h-[44px]">
                {{ t('profile.add_achievement') }}
              </BaseButton>
            </div>
          </div>

          <!-- Event History Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2 mb-6">
              <Icon icon="ph:calendar-check-bold" class="text-primary text-xl" />
              {{ t('profile.event_history') }}
            </h3>
            <div class="space-y-4">
              <div class="text-sm text-gray-600">
                {{ t('profile.event_history_desc') }}
              </div>
              <div class="p-4 bg-gray-50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="text-sm text-gray-500">
                  {{ t('profile.total_events_label') }} <span class="font-black text-navy text-base">{{ userStats.totalEvents || 0 }} Event</span>
                </div>
                <NuxtLink to="/dashboard/archer/certificates" class="text-xs font-bold text-navy hover:text-primary flex items-center gap-1.5 transition-colors">
                  <span>{{ t('profile.view_all_certificates') }}</span>
                  <Icon icon="ph:arrow-right-bold" />
                </NuxtLink>
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
import MediaLibrary from '~/components/common/MediaLibrary.vue'
import ClubSelector from '~/components/common/ClubSelector.vue'
import TiptapEditor from '~/components/common/TiptapEditor.client.vue'
import { ref, onMounted, watch, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()

useHead({
  title: computed(() => `${t('profile.title')} - Archeris Dashboard`)
})

const { user, archerProfile } = useAuth()
const { get, put } = useApi()
const toast = useToast()

const isSaving = ref(false)
const profile = ref({
  bio: '',
  achievements: '',
  equipment: ''
})

const achievementsList = ref([])
const showMediaLibrary = ref(false)
const mediaTarget = ref('') 

const openMediaLibrary = (target) => {
  mediaTarget.value = target
  showMediaLibrary.value = true
}

const handleMediaSelect = (media) => {
  if (mediaTarget.value === 'avatar') {
    accountForm.value.avatar_url = media.url
  } else if (mediaTarget.value === 'banner') {
    accountForm.value.banner_url = media.url
  }
}

const platformOptions = [
  { value: 'instagram', title: 'Instagram', icon: 'ph:instagram-logo', iconColor: 'text-pink-500', placeholder: '@username_instagram' },
  { value: 'tiktok', title: 'TikTok', icon: 'ph:tiktok-logo', iconColor: 'text-black', placeholder: '@username_tiktok' },
  { value: 'whatsapp', title: 'WhatsApp', icon: 'ph:whatsapp-logo', iconColor: 'text-green-600', placeholder: '081234567890' },
  { value: 'facebook', title: 'Facebook', icon: 'ph:facebook-logo', iconColor: 'text-blue-600', placeholder: 'username / link' },
  { value: 'twitter', title: 'Twitter / X', icon: 'ph:twitter-logo', iconColor: 'text-slate-800', placeholder: '@username' },
  { value: 'youtube', title: 'YouTube', icon: 'ph:youtube-logo', iconColor: 'text-red-600', placeholder: 'channel / link' },
  { value: 'spotify', title: 'Spotify', icon: 'ph:spotify-logo', iconColor: 'text-green-500', placeholder: 'username / link' },
  { value: 'website', title: 'Website', icon: 'ph:globe-simple', iconColor: 'text-blue-500', placeholder: 'https://example.com' },
  { value: 'pinterest', title: 'Pinterest', icon: 'ph:pinterest-logo', iconColor: 'text-red-700', placeholder: 'username / link' },
  { value: 'linkedin', title: 'LinkedIn', icon: 'ph:linkedin-logo', iconColor: 'text-blue-700', placeholder: 'username / link' }
]

const userSocials = ref([])

const remainingPlatforms = computed(() => {
  return platformOptions.filter(p => !userSocials.value.some(s => s.platform === p.value))
})

const addSocial = (platform) => {
  userSocials.value.push({ platform, handle: '' })
}

const removeSocial = (index) => {
  userSocials.value.splice(index, 1)
}

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
  if (platform === 'spotify') return 'bg-green-50 text-green-600 border border-green-100'
  return 'bg-gray-50 text-gray-700 border border-gray-200'
}

const countries = [
  { title: 'Indonesia', value: 'Indonesia' },
  { title: 'Malaysia', value: 'Malaysia' },
  { title: 'Singapore', value: 'Singapore' },
  { title: 'Thailand', value: 'Thailand' },
  { title: 'Philippines', value: 'Philippines' },
  { title: 'United States', value: 'United States' },
  { title: 'Australia', value: 'Australia' },
  { title: 'Japan', value: 'Japan' },
  { title: 'South Korea', value: 'South Korea' }
]

const accountForm = ref({
  full_name: '',
  username: '',
  nik: '',
  date_of_birth: '',
  gender: 'male',
  hand_dominance: 'right',
  height_cm: null,
  weight_kg: null,
  phone: '',
  email: '',
  emergency_contact_name: '',
  city: '',
  country: 'Indonesia',
  bow_type: 'recurve',
  address: '',
  avatar_url: '',
  banner_url: '',
  club_id: '',
  new_club_name: '',
  new_club_acronym: ''
})

const isUsernameTaken = ref(false)
let usernameDebounceTimer = null

watch(() => accountForm.value.username, (newVal) => {
  isUsernameTaken.value = false
  if (usernameDebounceTimer) clearTimeout(usernameDebounceTimer)
  
  const cleaned = newVal ? newVal.trim().toLowerCase() : ''
  if (cleaned.length < 3) return
  
  usernameDebounceTimer = setTimeout(async () => {
    try {
      const excludeUuid = user.value?.uuid || ''
      const res = await get(`/auth/check-username?username=${encodeURIComponent(cleaned)}&exclude_uuid=${excludeUuid}`)
      isUsernameTaken.value = res.exists
    } catch (err) {
      console.error('Failed to check username:', err)
    }
  }, 500)
})

const userStats = ref({
  totalEvents: 0,
  bestScore: null
})

const activeTab = ref('information')
const tabs = computed(() => [
  { id: 'information', label: t('profile.tab_info'), icon: 'ph:user-circle-bold' },
  { id: 'profile', label: t('profile.tab_bio'), icon: 'ph:identification-card-bold' }
])

const toggleAchievementHighlight = (idx) => {
  const current = achievementsList.value[idx]
  if (!current) return
  if (!current.is_highlighted) {
    const totalHighlighted = achievementsList.value.filter(a => a.is_highlighted).length
    if (totalHighlighted >= 3) {
      toast.warning(t('profile.highlight_max_error'))
      return
    }
    current.is_highlighted = true
  } else {
    current.is_highlighted = false
  }
}

const loadProfile = async () => {
  try {
    const response = await get('/archer/me')
    const data = response.data || response

    accountForm.value = {
      full_name: data.full_name || '',
      username: data.username || '',
      nik: data.nik || '',
      date_of_birth: data.date_of_birth ? new Date(data.date_of_birth).toISOString().split('T')[0] : '',
      gender: data.gender || 'male',
      hand_dominance: data.hand_dominance || 'right',
      height_cm: data.height_cm || null,
      weight_kg: data.weight_kg || null,
      phone: data.phone || '',
      email: data.email || '',
      emergency_contact_name: data.emergency_contact_name || '',
      city: data.city || '',
      country: data.country || 'Indonesia',
      bow_type: data.bow_type || 'recurve',
      address: data.address || '',
      avatar_url: data.avatar_url || '',
      banner_url: data.banner_url || '',
      club_id: data.club_id || '',
      new_club_name: '',
      new_club_acronym: ''
    }

    profile.value = {
      bio: data.bio || '',
      achievements: data.achievements || '',
      equipment: data.equipment || ''
    }

    achievementsList.value = data.achievements ? data.achievements.split(/\r?\n/).filter(a => a.trim() !== '').map(a => {
      if (a.startsWith('[H] ')) return { text: a.replace('[H] ', ''), is_highlighted: true }
      return { text: a, is_highlighted: false }
    }) : []

    userSocials.value = []
    if (data.social_instagram) userSocials.value.push({ platform: 'instagram', handle: data.social_instagram })
    if (data.social_tiktok) userSocials.value.push({ platform: 'tiktok', handle: data.social_tiktok })
    if (data.social_whatsapp) userSocials.value.push({ platform: 'whatsapp', handle: data.social_whatsapp })
    if (data.social_facebook) userSocials.value.push({ platform: 'facebook', handle: data.social_facebook })
    if (data.social_twitter) userSocials.value.push({ platform: 'twitter', handle: data.social_twitter })
    if (data.social_youtube) userSocials.value.push({ platform: 'youtube', handle: data.social_youtube })
    if (data.social_spotify) userSocials.value.push({ platform: 'spotify', handle: data.social_spotify })
    if (data.social_website) userSocials.value.push({ platform: 'website', handle: data.social_website })
    if (data.social_pinterest) userSocials.value.push({ platform: 'pinterest', handle: data.social_pinterest })
    if (data.social_linkedin) userSocials.value.push({ platform: 'linkedin', handle: data.social_linkedin })

    try {
      const stats = await get('/archers/me/stats')
      if (stats) {
        userStats.value = {
          totalEvents: stats.total_events || 0,
          bestScore: stats.best_score || null
        }
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }

  } catch (error) {
    console.error('Failed to load profile:', error)
  }
}

const saveFullProfile = async () => {
  if (isUsernameTaken.value) {
    toast.error('Username is already taken!')
    return
  }

  isSaving.value = true
  try {
    const payload = {
      ...accountForm.value,
      bio: profile.value.bio,
      equipment: profile.value.equipment,
      achievements: achievementsList.value.filter(a => a.text.trim() !== '').map(a => a.is_highlighted ? `[H] ${a.text.trim()}` : a.text.trim()).join('\n'),
      social_instagram: userSocials.value.find(s => s.platform === 'instagram')?.handle || '',
      social_tiktok: userSocials.value.find(s => s.platform === 'tiktok')?.handle || '',
      social_whatsapp: userSocials.value.find(s => s.platform === 'whatsapp')?.handle || '',
      social_facebook: userSocials.value.find(s => s.platform === 'facebook')?.handle || '',
      social_twitter: userSocials.value.find(s => s.platform === 'twitter')?.handle || '',
      social_youtube: userSocials.value.find(s => s.platform === 'youtube')?.handle || '',
      social_spotify: userSocials.value.find(s => s.platform === 'spotify')?.handle || '',
      social_website: userSocials.value.find(s => s.platform === 'website')?.handle || '',
      social_pinterest: userSocials.value.find(s => s.platform === 'pinterest')?.handle || '',
      social_linkedin: userSocials.value.find(s => s.platform === 'linkedin')?.handle || ''
    }

    await put('/user/profile', payload)
    toast.success(t('profile.toast_profile_success'))
    await loadProfile()
  } catch (error) {
    console.error('Failed to save profile:', error)
    toast.error(error?.data?.error || t('profile.toast_profile_failed'))
  } finally {
    isSaving.value = false
  }
}

const previewProfile = () => {
  const uname = accountForm.value.username || user.value?.username
  if (uname) {
    window.open(`/archers/${uname}`, '_blank')
  } else {
    toast.warning(t('profile.toast_username_required'))
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
</style>

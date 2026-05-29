<template>
  <div class="flex flex-col gap-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black text-navy tracking-tight">{{ t('profile.title') }}</h1>
        <p class="text-gray-500 mt-1 font-medium">{{ t('profile.subtitle') }}</p>
      </div>
      <div class="flex gap-3">
        <BaseButton v-if="user?.username" variant="outline" size="sm" icon="ph:eye" @click="previewProfile">
          {{ t('profile.preview') }}
        </BaseButton>
        <BaseButton variant="gold" size="sm" icon="ph:floppy-disk" @click="saveProfile" :loading="isSaving">
          {{ t('profile.save_profile') }}
        </BaseButton>
      </div>
    </div>

    <div class="flex gap-1 bg-gray-100/80 rounded-2xl p-1.5 overflow-x-auto no-scrollbar shadow-sm">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        :class="activeTab === tab.id ? 'bg-white shadow text-navy' : 'text-gray-500 hover:text-navy hover:bg-white/50'"
        class="flex items-center justify-center gap-2 flex-1 min-w-[140px] px-5 py-2.5 rounded-xl text-sm font-black transition-all">
        <Icon :icon="tab.icon" class="text-lg" />
        {{ tab.label }}
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Tab: Informasi (Personal Data) -->
        <div v-if="activeTab === 'information'" class="space-y-6">
          <!-- Media Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2 mb-6">
              <Icon icon="ph:image-bold" class="text-primary text-xl" />
              {{ t('profile.media_title') }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Avatar -->
              <div class="space-y-4">
                <div class="text-[10px] font-black text-navy/30 tracking-widest">{{ t('profile.avatar_label') }}</div>
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
                    <h5 class="text-xs font-black text-navy ">{{ t('profile.picture_title') }}</h5>
                    <div class="text-[10px] text-gray-500 max-w-[160px]">{{ t('profile.picture_desc') }}</div>
                    <BaseButton variant="outline" size="xs" icon="ph:pencil-simple" @click="openMediaLibrary('avatar')">
                      {{ t('profile.change_photo') }}</BaseButton>
                  </div>
                </div>
              </div>

              <!-- Banner -->
              <div class="space-y-4">
                <div class="text-[10px] font-black text-navy/30 tracking-widest">{{ t('profile.banner_label') }}</div>
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

          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2 mb-6">
              <Icon icon="ph:user-circle-bold" class="text-primary text-xl" />
              {{ t('profile.personal_data') }}
            </h3>
            <div class="text-sm text-gray-600">
              {{ t('profile.personal_desc') }}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <BaseInput v-model="accountForm.full_name" :label="t('profile.full_name')" :placeholder="t('profile.full_name_placeholder')"
                required />
              <BaseInput v-model="accountForm.username" :label="t('profile.username')" placeholder="username"
                :hint="t('profile.username_hint')" :error="isUsernameTaken ? 'Username is already taken' : ''" />

              <BaseDatePicker v-model="accountForm.date_of_birth" :label="t('profile.dob')" />
              <BaseSelect v-model="accountForm.gender" :label="t('profile.gender')" :items="[
                { title: t('profile.male'), value: 'male' },
                { title: t('profile.female'), value: 'female' }
              ]" icon="ph:gender-intersex" />

              <BaseInput v-model="accountForm.phone" :label="t('profile.phone')" type="tel" placeholder="+62 812-3456-7890"
                icon="ph:phone" numberOnly :rules="[v => !v || String(v).length >= 8 || t('profile.phone_error')]" />
              <BaseSelect v-model="accountForm.city" :label="t('profile.city')" :items="cityOptions"
                :placeholder="t('profile.select_city')" icon="mingcute:building-2-line" />

              <BaseSelect v-model="accountForm.country" :label="t('profile.country') || 'Country'" :items="countries"
                placeholder="Select Country..." icon="ph:globe" searchable />
              <BaseSelect v-model="accountForm.bow_type" :label="t('profile.bow_type')" :items="[
                { title: 'Recurve', value: 'recurve' },
                { title: 'Compound', value: 'compound' },
                { title: 'Barebow', value: 'barebow' },
                { title: 'Traditional', value: 'traditional' }
              ]" icon="hugeicons:archer" />

              <ClubSelector 
                v-model="accountForm.club_id"
                v-model:newClubName="accountForm.new_club_name"
                v-model:newClubAcronym="accountForm.new_club_acronym"
                label="Club" />

              <div class="md:col-span-2">
                <BaseTextarea v-model="accountForm.address" :label="t('profile.address')" :placeholder="t('profile.address_placeholder')"
                  :rows="3" icon="ph:house" />
              </div>
            </div>

            <div class="flex justify-end mt-6 pt-6 border-t border-gray-100">
              <BaseButton variant="gold" size="md" icon="ph:floppy-disk" @click="saveAccountInfo"
                :loading="isSavingAccount">
                {{ t('profile.save_info') }}
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Media Library Modal -->
        <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />

        <!-- Tab: Profil (Bio, Prestasi, Riwayat Event) -->
        <div v-if="activeTab === 'profile'" class="space-y-6">
          <!-- Bio Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2 mb-6">
              <Icon icon="ph:identification-card-bold" class="text-primary text-xl" />
              {{ t('profile.about_me') }}
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-bold text-navy mb-2">{{ t('profile.self_desc') }}</label>
                <TiptapEditor v-model="profile.bio"
                  :placeholder="t('profile.bio_placeholder')"
                  minHeight="180px" />
              </div>
              <div class="text-[10px] text-gray-400 font-medium italic">
                {{ t('profile.bio_hint') }}
              </div>
            </div>
          </div>

          <!-- Achievements Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2 mb-6">
              <Icon icon="ph:medal-bold" class="text-primary text-xl" />
              {{ t('profile.achievements') }}
            </h3>
            <div class="space-y-4">
              <div v-for="(ach, idx) in achievementsList" :key="idx" class="flex items-center gap-3">
                <BaseInput v-model="ach.text" :placeholder="t('profile.achievement_placeholder')" icon="ph:medal-bold"
                  class="flex-1" />
                <button @click="achievementsList.splice(idx, 1)"
                  class="text-gray-400 hover:text-red-500 transition-colors p-2 mt-1">
                  <Icon icon="ph:trash-bold" />
                </button>
              </div>

              <BaseButton variant="outline" size="sm" icon="ph:plus-bold"
                @click="achievementsList.push({ text: '' })" class="w-full">
                {{ t('profile.add_achievement') }}
              </BaseButton>
            </div>
          </div>

          <!-- Equipment Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2 mb-6">
              <Icon icon="ph:bow-arrow-bold" class="text-primary text-xl" />
              {{ t('profile.gear') }}
            </h3>
            <div class="space-y-4">
              <div v-for="(eq, idx) in equipmentList" :key="idx" class="flex items-center gap-3">
                <BaseInput v-model="equipmentList[idx]" :placeholder="t('profile.gear_placeholder')" class="flex-1"
                  icon="ph:gear-bold" />
                <button @click="equipmentList.splice(idx, 1)"
                  class="text-gray-400 hover:text-red-500 transition-colors p-2 mt-1">
                  <Icon icon="ph:trash-bold" />
                </button>
              </div>

              <BaseButton variant="outline" size="sm" icon="ph:plus-bold" @click="equipmentList.push('')"
                class="w-full">
                {{ t('profile.add_gear') }}
              </BaseButton>

              <div class="text-[10px] text-gray-400 font-medium italic">
                {{ t('profile.gear_hint') }}
              </div>
            </div>
          </div>

          <!-- Event History Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2 mb-6">
              <Icon icon="ph:calendar-check-bold" class="text-primary text-xl" />
              {{ t('profile.event_history') }}
            </h3>
            <div class="space-y-4">
              <div class="text-sm text-gray-600">
                {{ t('profile.event_history_desc') }}
              </div>
              <div class="p-4 bg-gray-50 rounded-xl">
                <div class="text-sm text-gray-500">
                  {{ t('profile.total_events_label') }} <span class="font-bold text-navy">{{ userStats.totalEvents || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Kontak (Sosial Media) -->
        <div v-if="activeTab === 'contact'" class="space-y-6">
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
                <Icon icon="ph:share-network-bold" class="text-primary text-xl" />
                {{ t('profile.social_media') }}
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

            <div class="text-sm text-gray-600">{{ t('profile.social_media_desc') }}</div>

            <div class="grid grid-cols-1 gap-4 mt-2">
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
                class="py-12 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                <Icon icon="ph:share-network" class="text-4xl text-gray-200 mx-auto mb-3" />
                <div class="text-sm text-gray-400 font-medium">{{ t('profile.no_socials') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Sidebar -->
      <div class="space-y-6">
        <!-- Profile Card Preview -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm overflow-hidden relative">
          <div class="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          <div class="flex flex-col items-center text-center mt-4">
            <div
              class="w-24 h-24 rounded-full bg-primary/10 border-4 border-white p-1 mb-4 overflow-hidden shadow-lg relative">
              <img
                :src="useImageOrDefault(accountForm.avatar_url || user?.avatar_url, accountForm.full_name || user?.full_name)"
                class="w-full h-full object-cover rounded-full" />
            </div>
            <h4 class="font-black text-navy text-lg leading-tight">{{ accountForm.full_name || user?.full_name }}</h4>
            <div class="text-gray-400 text-xs font-bold  tracking-tighter mt-1">@{{ accountForm.username || user?.username
            }}</div>

            <div v-if="profile.bio" class="mt-4 px-2">
              <div class="text-xs text-gray-500 italic line-clamp-3">"{{ profile.bio }}"</div>
            </div>

            <div class="w-full h-px bg-gray-50 my-6"></div>

            <div class="grid grid-cols-2 w-full gap-4">
              <div class="text-center">
                <div class="text-[10px] font-black text-gray-400  tracking-widest">Events</div>
                <div class="text-navy font-black">{{ userStats.totalEvents || 0 }}</div>
              </div>
              <div class="text-center border-l border-gray-50">
                <div class="text-[10px] font-black text-gray-400  tracking-widest">Best Score</div>
                <div class="text-navy font-black">{{ userStats.bestScore || '-' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import MediaLibrary from '~/components/common/MediaLibrary.vue'
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'

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
const isSavingAccount = ref(false)
const profile = ref({
  bio: '',
  achievements: '',
  equipment: ''
})

const achievementsList = ref([])
const equipmentList = ref([])

const showMediaLibrary = ref(false)
const mediaTarget = ref('') // 'avatar' or 'banner'

const openMediaLibrary = (target) => {
  mediaTarget.value = target
  showMediaLibrary.value = true
}

const handleMediaSelect = (media) => {
  if (mediaTarget.value === 'avatar') {
    accountForm.value.avatar_url = media.url
  } else if (mediaTarget.value === 'banner') {
    const img = new Image()
    img.src = media.url
    img.onload = () => {
      const ratio = img.width / img.height
      if (ratio < 1.8 || ratio > 3.2) {
        toast.error('Banner image must be wide (aspect ratio between 1.8 and 3.2, ideal 21:9)')
        return
      }
      accountForm.value.banner_url = media.url
    }
    img.onerror = () => {
      accountForm.value.banner_url = media.url
    }
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

const userSocials = ref([]) // Dynamic list: [{ platform: 'instagram', handle: 'stewie' }]

const remainingPlatforms = computed(() => {
  return platformOptions.filter(p => !userSocials.value.some(s => s.platform === p.value))
})

const addSocial = (platform) => {
  userSocials.value.push({ platform, handle: '' })
}

const toggleHighlight = (index) => {
  const item = achievementsList.value[index]
  if (!item.is_highlighted) {
    const activeHighlights = achievementsList.value.filter(a => a.is_highlighted).length
    if (activeHighlights >= 3) {
      toast.warning(t('profile.toast_max_highlight'))
      return
    }
  }
  item.is_highlighted = !item.is_highlighted
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
  if (platform === 'website') return 'bg-blue-50 text-blue-600 border border-blue-100'
  if (platform === 'pinterest') return 'bg-red-50 text-red-700 border border-red-100'
  if (platform === 'linkedin') return 'bg-blue-50 text-blue-700 border border-blue-100'
  return 'bg-gray-100 text-gray-600'
}

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

const accountForm = ref({
  full_name: '',
  username: '',
  date_of_birth: '',
  gender: '',
  phone: '',
  city: '',
  country: '',
  bow_type: '',
  address: '',
  avatar_url: '',
  banner_url: '',
  club_id: ''
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

const cityOptions = ref([])
const clubOptions = ref([])

const userStats = ref({
  totalEvents: 0,
  bestScore: null
})

// Available section types
const allSections = [
  {
    type: 'bio',
    label: 'Tentang Saya',
    description: 'Ceritakan tentang diri Anda',
    icon: 'ph:identification-card-bold',
    defaultVisible: true
  },
  {
    type: 'achievements',
    label: 'Prestasi & Penghargaan',
    description: 'Daftar prestasi dan penghargaan',
    icon: 'ph:medal-bold',
    defaultVisible: true
  },
  {
    type: 'contact',
    label: 'Kontak',
    description: 'Informasi kontak',
    icon: 'ph:phone-bold',
    defaultVisible: false
  },
  {
    type: 'social',
    label: 'Media Sosial',
    description: 'Tautan media sosial',
    icon: 'ph:share-network-bold',
    defaultVisible: false
  },
  {
    type: 'equipment',
    label: 'Peralatan',
    description: 'Daftar peralatan panahan',
    icon: 'ph:bow-arrow-bold',
    defaultVisible: false
  },
  {
    type: 'gallery',
    label: 'Galeri',
    description: 'Foto-foto event dan latihan',
    icon: 'ph:images-bold',
    defaultVisible: false
  },
  {
    type: 'event_history',
    label: 'Riwayat Event',
    description: 'Daftar event yang diikuti',
    icon: 'ph:calendar-check-bold',
    defaultVisible: false
  }
]

const activeTab = ref('information')
const tabs = computed(() => [
  { id: 'information', label: t('profile.tab_information'), icon: 'ph:user-circle-bold' },
  { id: 'profile', label: t('profile.tab_profile'), icon: 'ph:identification-card-bold' },
  { id: 'contact', label: t('profile.tab_contact'), icon: 'ph:phone-bold' }
])


// Initialize from user data
onMounted(async () => {

  // Load cities
  try {
    const citiesRes = await get('/cities')
    cityOptions.value = (citiesRes.data || []).map(c => ({ title: c.name, value: c.name }))
  } catch (e) {
    console.error('Failed to load cities:', e)
  }

  // Load clubs
  try {
    const clubsRes = await get('/clubs?limit=1000')
    clubOptions.value = (clubsRes.data || []).map(c => ({ title: c.name, value: c.uuid }))
  } catch (e) {
    console.error('Failed to load clubs:', e)
  }

  // Load profile and account data
  await loadProfile()

  // Use global archerProfile (already loaded by server middleware)
  if (archerProfile.value) {
    const data = archerProfile.value
    profile.value.bio = data.bio || ''
    profile.value.achievements = data.achievements || ''
    profile.value.social_instagram = data.social_instagram || ''
    profile.value.social_tiktok = data.social_tiktok || ''
    profile.value.social_whatsapp = data.social_whatsapp || ''

    // Fetch user stats (this is separate from basic profile)
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
  }
})

// Load profile data
const loadProfile = async () => {
  try {
    const response = await get('/archer/me')
    const data = response.data || response

    // Load account information
    accountForm.value = {
      full_name: data.full_name || '',
      username: data.username || '',
      date_of_birth: data.date_of_birth ? new Date(data.date_of_birth).toISOString().split('T')[0] : '',
      gender: data.gender || '',
      phone: data.phone || '',
      city: data.city || '',
      country: data.country || '',
      bow_type: data.bow_type || '',
      address: data.address || '',
      avatar_url: data.avatar_url || '',
      banner_url: data.banner_url || '',
      club_id: data.club_id || ''
    }

    // Load detailed profile information
    profile.value = {
      bio: data.bio || '',
      achievements: data.achievements || '',
      equipment: data.equipment || ''
    }

    achievementsList.value = data.achievements ? data.achievements.split('\n').filter(a => a.trim() !== '').map(a => {
      if (a.startsWith('[H] ')) return { text: a.replace('[H] ', ''), is_highlighted: true }
      return { text: a, is_highlighted: false }
    }) : []
    equipmentList.value = data.equipment ? data.equipment.split('\n').filter(e => e.trim() !== '') : []

    // Populate dynamic socials
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

  } catch (error) {
    console.error('Failed to load profile:', error)
  }
}

// Save account information
const saveAccountInfo = async () => {
  if (isUsernameTaken.value) {
    toast.error('Username is already taken!')
    return
  }
  isSavingAccount.value = true
  try {
    await put('/user/profile', accountForm.value)
    toast.success(t('profile.toast_save_success'))
  } catch (error) {
    console.error('Failed to save account info:', error)
    toast.error(t('profile.toast_save_failed'))
  } finally {
    isSavingAccount.value = false
  }
}

const saveProfile = async () => {
  isSaving.value = true
  try {
    const payload = {
      bio: profile.value.bio,
      achievements: achievementsList.value.filter(a => a.text.trim() !== '').map(a => a.is_highlighted ? `[H] ${a.text}` : a.text).join('\n'),
      equipment: equipmentList.value.filter(e => e.trim() !== '').join('\n'),
      social_instagram: userSocials.value.find(s => s.platform === 'instagram')?.handle || '',
      social_tiktok: userSocials.value.find(s => s.platform === 'tiktok')?.handle || '',
      social_whatsapp: userSocials.value.find(s => s.platform === 'whatsapp')?.handle || '',
      social_facebook: userSocials.value.find(s => s.platform === 'facebook')?.handle || '',
      social_twitter: userSocials.value.find(s => s.platform === 'twitter')?.handle || '',
      social_youtube: userSocials.value.find(s => s.platform === 'youtube')?.handle || '',
      social_spotify: userSocials.value.find(s => s.platform === 'spotify')?.handle || '',
      social_website: userSocials.value.find(s => s.platform === 'website')?.handle || '',
      social_pinterest: userSocials.value.find(s => s.platform === 'pinterest')?.handle || '',
      social_linkedin: userSocials.value.find(s => s.platform === 'linkedin')?.handle || '',
      avatar_url: accountForm.value.avatar_url,
      banner_url: accountForm.value.banner_url
    }
    await put('/user/profile', payload)
    toast.success(t('profile.toast_profile_success'))
  } catch (error) {
    toast.error(error.message || t('profile.toast_profile_failed'))
  } finally {
    isSaving.value = false
  }
}

const previewProfile = () => {
  if (user.value?.username) {
    window.open(`/archers/${user.value.username}`, '_blank')
  } else {
    toast.warning(t('profile.toast_username_required'))
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>

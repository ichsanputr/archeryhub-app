<template>
  <div class="flex flex-col gap-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black text-navy tracking-tight">Profil Klub</h1>
        <p class="text-gray-500 mt-1">Perbarui identitas, kontak, fasilitas, dan jadwal latihan klub Anda.</p>
      </div>
      <div class="flex gap-3">
        <BaseButton variant="navy" icon="ph:floppy-disk" :loading="saving" @click="saveProfile"
          class="shadow-md shadow-primary/20 !px-4 !py-2.5 !rounded-xl !text-sm">
          Simpan Profil
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
      <div class="lg:col-span-2 space-y-6">

        <!-- Tab: Umum -->
        <div v-if="activeTab === 'general'" class="space-y-6">
          <!-- Logo & Banner -->
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2">
              <Icon icon="ph:image-bold" class="text-primary text-xl" />
              BRANDING VISUAL
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Logo Upload -->
              <div class="space-y-4">
                <p class="text-[10px] font-black text-navy/30 uppercase tracking-widest">Logo Klub</p>
                <div class="flex items-center gap-6">
                  <div
                    class="w-24 h-24 rounded-full bg-gray-50 border-4 border-white shadow-md overflow-hidden shrink-0 relative group">
                    <img v-if="form.logoUrl" :src="form.logoUrl" class="w-full h-full object-cover" />
                    <Icon v-else icon="ph:shield-bold" class="w-full h-full p-6 text-gray-200" />
                    <div
                      class="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      @click="openMediaLibrary('logo')">
                      <Icon icon="ph:camera-bold" class="text-white text-2xl" />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <h5 class="text-xs font-black text-navy uppercase">Club Logo</h5>
                    <p class="text-[10px] text-gray-500 max-w-[160px]">Rasio 1:1 direkomendasikan. Gunakan logo
                      transparan jika ada.</p>
                    <BaseButton variant="outline" size="xs" icon="ph:pencil-simple" @click="openMediaLibrary('logo')">
                      Ganti Logo</BaseButton>
                  </div>
                </div>
              </div>

              <!-- Banner Upload -->
              <div class="space-y-4">
                <p class="text-[10px] font-black text-navy/30 uppercase tracking-widest">Banner Profil (Hero)</p>
                <div
                  class="w-full aspect-[21/9] rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden relative group">
                  <img v-if="form.bannerUrl" :src="form.bannerUrl" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <Icon icon="ph:image-square" class="text-3xl mb-1" />
                    <span class="text-[10px] font-bold">Belum ada banner</span>
                  </div>
                  <div
                    class="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    @click="openMediaLibrary('banner')">
                    <Icon icon="ph:pencil-simple-bold" class="text-white text-2xl" />
                  </div>
                  <button v-if="form.bannerUrl" @click.stop="form.bannerUrl = ''"
                    class="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon icon="ph:trash" />
                  </button>
                </div>
                <p class="text-[10px] text-gray-500">Akan digunakan sebagai latar belakang di profil publik klub Anda.
                </p>
              </div>
            </div>
          </div>

          <!-- Identitas -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2">
                <Icon icon="ph:identification-badge-bold" class="text-primary text-xl" /> IDENTITAS UTAMA
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="form.name" label="Nama Klub" placeholder="Nama resmi klub" required />

              <!-- Slug URL with availability check -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Slug URL</label>
                <div class="relative">
                  <input v-model="form.slug" type="text" :disabled="slugLocked" :class="[
                    'w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none font-bold',
                    slugLocked ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-100' : 'bg-white border-gray-200 focus:border-navy',
                    slugStatus === 'available' ? 'border-green-300 focus:border-green-500 bg-green-50/30' : '',
                    slugStatus === 'taken' ? 'border-red-300 focus:border-red-500 bg-red-50/30' : ''
                  ]" placeholder="contoh: garuda-archery" @input="checkSlugAvailability" />
                  <div v-if="checkingSlug" class="absolute right-3 top-1/2 -translate-y-1/2">
                    <Icon icon="ph:spinner" class="text-gray-400 animate-spin" />
                  </div>
                  <div v-else-if="slugStatus === 'available'" class="absolute right-3 top-1/2 -translate-y-1/2">
                    <Icon icon="ph:check-circle-fill" class="text-green-500" />
                  </div>
                  <div v-else-if="slugStatus === 'taken'" class="absolute right-3 top-1/2 -translate-y-1/2">
                    <Icon icon="ph:x-circle-fill" class="text-red-500" />
                  </div>
                </div>
                <p v-if="slugLocked" class="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1 font-medium">
                  <Icon icon="ph:lock-fill" /> Slug hanya dapat diubah sekali
                </p>
                <p v-else-if="slugStatus === 'taken'" class="text-[10px] text-red-500 mt-1.5 font-bold">Slug sudah
                  digunakan</p>
                <p v-else-if="slugStatus === 'available'" class="text-[10px] text-green-600 mt-1.5 font-bold">Slug
                  tersedia</p>
                <p v-else class="text-[10px] text-gray-400 mt-1.5 font-medium italic">URL: archeryhub.id/clubs/{{
                  form.slug || 'slug-anda' }}</p>
              </div>

              <BaseInput v-model="form.established" label="Tahun Berdiri" type="number" placeholder="Contoh: 2010" />

              <!-- City Autocomplete -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Kota/Kabupaten</label>
                <div class="relative">
                  <input v-model="citySearch" type="text"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold transition-all outline-none focus:border-navy bg-white"
                    placeholder="Cari kota..." @focus="showCityDropdown = true" @blur="handleCityBlur"
                    @input="filterCities" />
                  <div v-if="showCityDropdown && filteredCities.length > 0"
                    class="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-md max-h-60 overflow-y-auto p-1 py-2">
                    <button v-for="city in filteredCities" :key="city" type="button"
                      class="w-full px-4 py-2.5 text-left text-sm font-bold text-navy hover:bg-gray-50 rounded-xl transition-colors"
                      @mousedown.prevent="selectCity(city)">
                      {{ city.name }}
                    </button>
                  </div>
                </div>
              </div>

            </div>
            <BaseTextarea v-model="form.description" label="Tentang Klub" rows="5"
              placeholder="Berikan deskripsi singkat dan menarik tentang klub Anda..." />
          </div>
        </div>

        <!-- Tab: Kontak -->
        <div v-if="activeTab === 'contact'" class="space-y-6">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
            <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2">
              <Icon icon="ph:phone-bold" class="text-primary text-xl" /> INFORMASI KONTAK
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="form.whatsapp" label="Nomor WhatsApp" placeholder="Contoh: 081234567890" />
              <BaseInput v-model="form.email" label="Alamat Email" type="email" placeholder="info@klub.id" />
              <BaseInput v-model="form.website" label="Website Resmi" placeholder="https://www.klub.id" />
            </div>
            <BaseTextarea v-model="form.address" label="Alamat Lengkap (Latihan)" rows="3"
              placeholder="Tuliskan alamat lengkap lokasi latihan atau kantor sekretariat..." />
          </div>

          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2">
                <Icon icon="ph:share-network-bold" class="text-primary text-xl" />
                MEDIA SOSIAL
              </h3>

              <div class="relative group">
                <BaseButton variant="outline" size="xs" icon="ph:plus-bold">
                  Tambah Media Sosial
                </BaseButton>
                <!-- Dropdown for adding socials -->
                <div
                  class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                  <button v-for="plat in remainingPlatforms" :key="plat.value"
                    @mousedown.prevent="addSocial(plat.value)"
                    class="w-full text-left px-4 py-2 text-sm font-bold text-navy hover:bg-gray-50 flex items-center gap-3">
                    <Icon :icon="plat.icon" :class="plat.iconColor" />
                    {{ plat.title }}
                  </button>
                  <p v-if="remainingPlatforms.length === 0" class="px-4 py-2 text-xs text-gray-400 italic">
                    Semua platform sudah ditambahkan
                  </p>
                </div>
              </div>
            </div>

            <p class="text-sm text-gray-600">Hubungkan klub dengan member melalui platform sosial favorit.</p>

            <div class="grid grid-cols-1 gap-4 mt-2">
              <div v-for="(social, idx) in userSocials" :key="social.platform"
                class="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                      :class="getPlatformIconBagde(social.platform)">
                      <Icon :icon="getPlatformInfo(social.platform).icon" class="text-lg" />
                    </div>
                    <span class="text-xs font-black text-navy uppercase tracking-widest">{{
                      getPlatformInfo(social.platform).title }}</span>
                  </div>
                  <button @click="removeSocial(idx)" class="text-gray-400 hover:text-red-500 transition-colors">
                    <Icon icon="ph:trash-bold" />
                  </button>
                </div>
                <div class="flex items-center gap-3">
                  <input v-model="social.handle" type="text" :placeholder="getPlatformInfo(social.platform).placeholder"
                    class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold shadow-sm transition-all" />
                </div>
              </div>

              <div v-if="userSocials.length === 0"
                class="py-12 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                <Icon icon="ph:share-network" class="text-4xl text-gray-200 mx-auto mb-3" />
                <p class="text-sm text-gray-400 font-medium">Belum ada media sosial yang ditambahkan</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Fasilitas & Jadwal -->
        <div v-if="activeTab === 'facilities'" class="space-y-6">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2">
                <Icon icon="ph:check-circle-bold" class="text-primary text-xl" /> DAFTAR FASILITAS
              </h3>
            </div>
            <div class="flex gap-3">
              <input v-model="facilityInput" placeholder="Contoh: Lapangan Indoor 30m"
                class="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold focus:border-navy outline-none"
                @keyup.enter="addFacility" />
              <button
                class="px-6 py-3 bg-navy text-white rounded-xl text-sm font-black hover:bg-navy-dark transition shadow-md shadow-navy/20"
                @click="addFacility">
                Tambah
              </button>
            </div>
            <div class="flex flex-wrap gap-3">
              <transition-group name="list">
                <span v-for="(item, idx) in form.facilities" :key="idx"
                  class="pl-4 pr-2 py-2 bg-gray-50 border border-gray-100 text-sm font-black text-navy rounded-xl flex items-center gap-3 group hover:border-primary/30 transition-all">
                  {{ item }}
                  <button class="p-1 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    @click="removeFacility(idx)">
                    <Icon icon="ph:x-bold" class="text-xs" />
                  </button>
                </span>
              </transition-group>
              <div v-if="!form.facilities.length"
                class="w-full text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
                <Icon icon="ph:hand-fist-light" class="text-4xl text-gray-200 mx-auto mb-2" />
                <p class="text-sm text-gray-400 font-bold">Tekan <span class="text-navy">Enter</span> untuk menambahkan
                  fasilitas</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-[11px] font-black text-navy  tracking-[0.2em] flex items-center gap-2">
                <Icon icon="ph:calendar-bold" class="text-primary text-xl" /> Jadwal Latihan Rutin
              </h3>
              <button
                class="flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl text-xs font-black hover:bg-navy-dark transition shadow-md"
                @click="addSchedule">
                <Icon icon="ph:plus-bold" /> Tambah Jadwal
              </button>
            </div>
            <div class="space-y-4">
              <transition-group name="list">
                <div v-for="(item, idx) in form.schedules" :key="idx"
                  class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 group">
                  <div class="md:col-span-5">
                    <BaseInput v-model="item.day" label="Hari" placeholder="Senin - Rabu" class="!bg-white" />
                  </div>
                  <div class="md:col-span-5">
                    <BaseInput v-model="item.time" label="Waktu" placeholder="16:00 - 18:00 WIB" class="!bg-white" />
                  </div>
                  <div class="md:col-span-2 flex items-end justify-end h-full">
                    <button class="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      @click="removeSchedule(idx)">
                      <Icon icon="ph:trash-bold" class="text-xl" />
                    </button>
                  </div>
                </div>
              </transition-group>
              <div v-if="!form.schedules.length"
                class="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
                <Icon icon="ph:clock-light" class="text-4xl text-gray-200 mx-auto mb-2" />
                <p class="text-sm text-gray-400 font-bold  tracking-widest">Jadwal belum diatur</p>
              </div>
            </div>
          </div>
        </div>


      </div>

      <!-- Side card -->

      <!-- Side card -->
      <div class="space-y-4">

        <div class="bg-navy rounded-2xl p-6 text-white shadow-sm relative overflow-hidden group">
          <Icon icon="ph:broadcast-bold"
            class="absolute -right-4 -top-4 text-8xl text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          <h3 class="font-black mb-2 flex items-center gap-2 relative z-10 uppercase tracking-widest text-sm">
            Profil Publik
            <Icon icon="ph:check-circle-fill" class="text-primary" />
          </h3>
          <p class="text-xs text-blue-200 mb-6 relative z-10 leading-relaxed font-medium">Profil Anda aktif dan dapat
            diakses publik melalui URL unik Archery Hub.</p>
          <NuxtLink v-if="form.slug" :to="`/clubs/${form.slug}`" target="_blank"
            class="relative z-10 block w-full py-3.5 bg-primary text-navy font-black rounded-xl text-center hover:bg-white hover:scale-[1.02] transition-all shadow-md active:scale-95 text-xs uppercase tracking-widest">
            Lihat Halaman Publik
          </NuxtLink>
          <p v-else class="text-xs text-blue-300 italic relative z-10">Slug URL belum diatur</p>
        </div>
      </div>
    </div>

    <!-- Media Library Modal -->
    <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '#imports'

definePageMeta({
  title: 'Profil Klub',
  layout: 'dashboard',
  middleware: ['auth']
})

useHead({
  title: 'Profil Klub - ArcheryHub Dashboard'
})

const router = useRouter()
const { get, put, upload } = useApi()
const { user, clubProfile } = useAuth()
const toast = useToast()

const saving = ref(false)
const facilityInput = ref('')
const activeTab = ref('general')

const tabs = [
  { id: 'general', label: 'Info Umum', icon: 'ph:identification-badge-bold' },
  { id: 'contact', label: 'Kontak & Sosmed', icon: 'ph:phone-bold' },
  { id: 'facilities', label: 'Fasilitas & Jadwal', icon: 'ph:check-circle-bold' }
]

const pageSettings = reactive({
  sections: {
    identity: true,
    contact: true,
    social: true,
    facilities: true,
    schedules: true
  }
})

const socialPlatformOptions = [
  { value: 'instagram', title: 'Instagram', icon: 'ph:instagram-logo', iconColor: 'text-pink-500', placeholder: '@username_instagram' },
  { value: 'facebook', title: 'Facebook', icon: 'ph:facebook-logo', iconColor: 'text-blue-600', placeholder: 'username / link' },
  { value: 'twitter', title: 'Twitter / X', icon: 'ph:twitter-logo', iconColor: 'text-slate-800', placeholder: '@username' },
  { value: 'tiktok', title: 'TikTok', icon: 'ph:tiktok-logo', iconColor: 'text-black', placeholder: '@username_tiktok' },
  { value: 'youtube', title: 'YouTube', icon: 'ph:youtube-logo', iconColor: 'text-red-600', placeholder: 'channel link' }
]

const userSocials = ref([])
const remainingPlatforms = computed(() => {
  return socialPlatformOptions.filter(p => !userSocials.value.some(s => s.platform === p.value))
})

const addSocial = (platform) => {
  if (!userSocials.value.some(s => s.platform === platform)) {
    userSocials.value.push({ platform, handle: '' })
  }
}

const removeSocial = (index) => {
  userSocials.value.splice(index, 1)
}

const getPlatformInfo = (platform) => {
  return socialPlatformOptions.find(p => p.value === platform) || socialPlatformOptions[0]
}

const getPlatformIconBagde = (platform) => {
  if (platform === 'instagram') return 'bg-pink-50 text-pink-600 border border-pink-100'
  if (platform === 'tiktok') return 'bg-black text-white border border-black'
  if (platform === 'facebook') return 'bg-blue-50 text-blue-600 border border-blue-100'
  if (platform === 'twitter') return 'bg-slate-50 text-slate-800 border border-slate-100'
  if (platform === 'youtube') return 'bg-red-50 text-red-600 border border-red-100'
  return 'bg-gray-100 text-gray-600'
}

const form = reactive({
  name: '',
  slug: '',
  originalSlug: '', // Track original slug for lock check
  bannerUrl: '',
  logoUrl: '',
  city: '',
  province: '',
  established: '',
  description: '',
  phone: '',
  whatsapp: '',
  email: '',
  website: '',
  address: '',
  facilities: [],
  schedules: [],
  socialMedia: [],
  registrationConfig: {
    fields: []
  }
})


// Slug checking
const slugLocked = ref(false)
const slugStatus = ref('') // 'available', 'taken', ''
const checkingSlug = ref(false)
let slugCheckTimeout = null

const checkSlugAvailability = () => {
  if (slugCheckTimeout) clearTimeout(slugCheckTimeout)
  slugStatus.value = ''

  if (!form.slug || form.slug.length < 3) return

  slugCheckTimeout = setTimeout(async () => {
    checkingSlug.value = true
    try {
      const response = await get(`/clubs/check-slug?slug=${encodeURIComponent(form.slug)}`)
      slugStatus.value = response?.available ? 'available' : 'taken'
    } catch (error) {
      console.error('Slug check error:', error)
      slugStatus.value = ''
    } finally {
      checkingSlug.value = false
    }
  }, 500)
}

// City autocomplete - Indonesia cities
const citySearch = ref('')
const showCityDropdown = ref(false)
const filteredCities = ref([])

const indonesiaCities = ref([])

const fetchCities = async () => {
  try {
    const resp = await get('/cities')
    indonesiaCities.value = resp.data || []
  } catch (e) {
    console.error('Failed to fetch cities', e)
  }
}

const filterCities = () => {
  const search = citySearch.value.toLowerCase()
  if (!search) {
    filteredCities.value = indonesiaCities.value.slice(0, 10)
  } else {
    filteredCities.value = indonesiaCities.value
      .filter(city => city.name.toLowerCase().includes(search))
      .slice(0, 10)
  }
}

const selectCity = (city) => {
  form.city = city.name
  citySearch.value = city.name
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

// Social media handlers (moved to new methods addSocial/removeSocial)

const loadProfile = async () => {
  try {
    // Use clubProfile (already loaded by server middleware)
    const data = clubProfile.value
    if (data) {
      form.name = data.name || ''
      form.slug = data.slug || ''
      form.originalSlug = data.slug || '' // Store original slug
      form.bannerUrl = data.banner_url || ''
      form.logoUrl = data.logo_url || ''
      form.city = data.city || ''
      form.province = data.province || ''
      form.description = data.description || ''
      form.phone = data.phone || ''
      form.whatsapp = data.whatsapp || ''
      form.email = data.email || ''
      form.website = data.website || ''
      form.address = data.address || ''

      const parseOrRaw = (val) => {
        if (typeof val === 'string' && val.startsWith('[')) {
          try { return JSON.parse(val) } catch (e) { return [] }
        }
        return Array.isArray(val) ? val : []
      }

      form.facilities = parseOrRaw(data.facilities)
      form.schedules = parseOrRaw(data.schedules)

      // Initialize userSocials for dynamic UI
      userSocials.value = []
      if (data.instagram) userSocials.value.push({ platform: 'instagram', handle: data.instagram })
      if (data.facebook) userSocials.value.push({ platform: 'facebook', handle: data.facebook })
      if (data.tiktok) userSocials.value.push({ platform: 'tiktok', handle: data.tiktok })
      if (data.twitter) userSocials.value.push({ platform: 'twitter', handle: data.twitter })
      if (data.whatsapp) form.whatsapp = data.whatsapp

      // Convert established date to year number
      if (data.established) {
        try {
          const date = new Date(data.established)
          form.established = date.getFullYear()
        } catch (e) {
          form.established = ''
        }
      } else {
        form.established = ''
      }

      // Handle registration config
      if (data.registration_config) {
        try {
          const parsed = typeof data.registration_config === 'string' ? JSON.parse(data.registration_config) : data.registration_config
          if (parsed && parsed.fields) {
            form.registrationConfig = parsed
          }
        } catch (e) {
          console.error('Failed to parse registration_config', e)
        }
      }

      // Set city search for autocomplete
      citySearch.value = data.city || ''

      // Lock slug if it was already set
      slugLocked.value = !!(data.slug && data.slug.length > 0 && data.slug_changed)

      // Load page settings
      if (data.page_settings) {
        try {
          const parsed = typeof data.page_settings === 'string' ? JSON.parse(data.page_settings) : data.page_settings
          if (parsed.sections && !Array.isArray(parsed.sections)) {
            Object.assign(pageSettings.sections, parsed.sections || {})
          }
        } catch (e) {
          console.error('Failed to parse page_settings', e)
        }
      }
    }
  } catch (error) {
    console.error('Load profile error:', error)
    toast.error('Gagal memuat profil klub')
  }
}

const saveProfile = async () => {
  saving.value = true
  try {
    // Extract individual socials from userSocials
    const instagram = userSocials.value.find(s => s.platform === 'instagram')?.handle || ''
    const facebook = userSocials.value.find(s => s.platform === 'facebook')?.handle || ''
    const tiktok = userSocials.value.find(s => s.platform === 'tiktok')?.handle || ''
    const twitter = userSocials.value.find(s => s.platform === 'twitter')?.handle || ''

    await put('/clubs/me', {
      name: form.name,
      slug: form.slug,
      banner_url: form.bannerUrl,
      logo_url: form.logoUrl,
      city: form.city,
      province: form.province,
      established: form.established ? `${form.established}-01-01` : '',
      description: form.description,
      phone: form.phone,
      whatsapp: form.whatsapp,
      email: form.email,
      website: form.website,
      instagram,
      facebook,
      tiktok,
      twitter,
      address: form.address,
      facilities: form.facilities,
      schedules: form.schedules,
      social_media: userSocials.value,
      page_settings: JSON.stringify(pageSettings),
      registration_config: JSON.stringify(form.registrationConfig)
    })
    toast.success('Profil klub berhasil disimpan!')
  } catch (error) {
    console.error('Save profile error:', error)
    const errorMessage = error?.data?.error || error?.response?.data?.error || error?.message || 'Gagal menyimpan profil'
    toast.error(errorMessage)
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  loadProfile()
}

const addFacility = () => {
  if (facilityInput.value.trim()) {
    form.facilities.push(facilityInput.value.trim())
    facilityInput.value = ''
  }
}

const removeFacility = (index) => {
  form.facilities.splice(index, 1)
}

const addSchedule = () => {
  form.schedules.push({ day: '', time: '' })
}

const removeSchedule = (index) => {
  form.schedules.splice(index, 1)
}

const fieldTypeOptions = [
  { value: 'text', title: 'Teks Pendek' },
  { value: 'textarea', title: 'Teks Panjang' },
  { value: 'number', title: 'Angka' },
  { value: 'email', title: 'Email' },
  { value: 'tel', title: 'Nomor Telepon' },
  { value: 'select', title: 'Pilihan (Dropdown)' },
  { value: 'checkbox', title: 'Centang (Checkbox)' }
]

const addRegistrationField = () => {
  form.registrationConfig.fields.push({
    label: '',
    name: '',
    type: 'text',
    required: false,
    placeholder: '',
    options: [],
    optionsRaw: ''
  })
}

const removeRegistrationField = (index) => {
  form.registrationConfig.fields.splice(index, 1)
}

const updateFieldOptions = (field) => {
  field.options = field.optionsRaw.split(',').map(o => ({
    title: o.trim(),
    value: o.trim()
  })).filter(o => o.value !== '')
}


onMounted(() => {
  fetchCities()
  loadProfile()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>

<template>
  <div class="flex flex-col gap-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black text-navy tracking-tight">Profil Klub</h1>
        <p class="text-gray-500 mt-1">Perbarui identitas, kontak, fasilitas, dan jadwal latihan klub Anda.</p>
      </div>
      <div class="flex gap-3">
        <button
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl font-semibold text-sm shadow-md shadow-primary/20 hover:bg-navy-dark transition"
          :disabled="saving" @click="saveProfile">
          <LoadingSpinner v-if="saving" size="sm" />
          <Icon v-else icon="ph:floppy-disk" class="text-lg" />
          <span>{{ saving ? 'Menyimpan...' : 'Simpan Profil' }}</span>
        </button>
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
              <h3 class="text-[11px] font-black text-navy  tracking-[0.2em] flex items-center gap-2">
                <Icon icon="ph:identification-badge-bold" class="text-primary text-lg" /> Identitas Utama
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
                      {{ city }}
                    </button>
                  </div>
                </div>
              </div>

              <BaseInput v-model="form.province" label="Provinsi" placeholder="Contoh: Jawa Tengah" />
            </div>
            <BaseTextarea v-model="form.description" label="Tentang Klub" rows="5"
              placeholder="Berikan deskripsi singkat dan menarik tentang klub Anda..." />
          </div>

          <!-- Logo & Banner -->
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
            <h3 class="text-[11px] font-black text-navy  tracking-[0.2em] flex items-center gap-2">
              <Icon icon="ph:image-bold" class="text-primary text-lg" /> Branding Visual
            </h3>

            <div class="space-y-8">
              <!-- Logo Upload -->
              <div class="space-y-4">
                <label class="block text-sm font-black text-navy">Logo Klub</label>
                <div class="flex flex-col items-center gap-5 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div
                    class="w-32 h-32 rounded-2xl bg-white border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center shadow-inner group">
                    <img v-if="form.logoUrl" :src="form.logoUrl"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <Icon v-else icon="ph:shield-bold" class="text-5xl text-gray-200" />
                  </div>
                  <div class="flex gap-2 w-full">
                    <button type="button" @click="openMediaLibrary('logo')"
                      class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-navy text-white text-xs font-black rounded-xl hover:bg-navy-dark transition shadow-md">
                      <Icon icon="ph:cloud-arrow-up-bold" class="text-base" />
                      Pilih Logo
                    </button>
                    <button v-if="form.logoUrl" type="button" @click="form.logoUrl = ''"
                      class="px-4 py-2.5 bg-red-50 text-red-600 text-xs font-black rounded-xl hover:bg-red-100 transition">
                      <Icon icon="ph:trash-bold" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Banner Upload -->
              <div class="space-y-4">
                <label class="block text-sm font-black text-navy">Banner Profil</label>
                <div class="relative group">
                  <div
                    class="h-44 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center shadow-inner">
                    <img v-if="form.bannerUrl" :src="form.bannerUrl"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div v-else class="text-center p-6">
                      <Icon icon="ph:image-square-bold" class="text-4xl text-gray-200 mx-auto mb-2" />
                      <p class="text-[10px] text-gray-400 font-bold  tracking-wider">Upload banner 1200x400</p>
                    </div>
                  </div>
                  <div class="mt-4 flex gap-2">
                    <button type="button" @click="openMediaLibrary('banner')"
                      class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-navy text-white text-xs font-black rounded-xl hover:bg-navy-dark transition shadow-md">
                      <Icon icon="ph:image-bold" class="text-base" />
                      Ganti Banner
                    </button>
                    <button v-if="form.bannerUrl" type="button" @click="form.bannerUrl = ''"
                      class="px-4 py-2.5 bg-red-50 text-red-600 text-xs font-black rounded-xl hover:bg-red-100 transition">
                      <Icon icon="ph:trash-bold" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Kontak -->
        <div v-if="activeTab === 'contact'" class="space-y-8">
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <h3 class="text-[11px] font-black text-navy  tracking-[0.2em] flex items-center gap-2">
              <Icon icon="ph:phone-bold" class="text-primary text-xl" /> Informasi Kontak
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="form.phone" label="Nomor Telepon" placeholder="Contoh: 021-xxxxxxxx" />
              <BaseInput v-model="form.whatsapp" label="Nomor WhatsApp" placeholder="Contoh: 08xx-xxxx-xxxx" />
              <BaseInput v-model="form.email" label="Alamat Email" type="email" placeholder="info@klub.id" />
              <BaseInput v-model="form.website" label="Website Resmi" placeholder="https://www.klub.id" />
            </div>
            <BaseTextarea v-model="form.address" label="Alamat Lengkap (Latihan)" rows="3"
              placeholder="Tuliskan alamat lengkap lokasi latihan atau kantor sekretariat..." />
          </div>

          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <h3 class="text-[11px] font-black text-navy  tracking-[0.2em] flex items-center gap-2">
              <Icon icon="ph:share-network-bold" class="text-primary text-xl" /> Kehadiran Media Sosial
            </h3>
            <p class="text-sm text-gray-500 font-medium">Hubungkan klub dengan member melalui platform sosial favorit.
            </p>

            <div class="space-y-4">
              <transition-group name="list">
                <div v-for="(social, idx) in form.socialMedia" :key="idx"
                  class="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 group">
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="md:col-span-1">
                      <BaseSelect v-model="social.platform" :items="socialPlatformOptions"
                        placeholder="Pilih Platform" />
                    </div>
                    <BaseInput v-model="social.username" placeholder="Username atau Link Profil"
                      class="md:col-span-2 !bg-white" />
                  </div>
                  <button @click="removeSocialMedia(idx)"
                    class="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                    <Icon icon="ph:trash-bold" class="text-xl" />
                  </button>
                </div>
              </transition-group>

              <button v-if="form.socialMedia.length < 5" @click="addSocialMedia"
                class="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-black text-gray-400 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 group">
                <Icon icon="ph:plus-circle-bold" class="text-xl group-hover:rotate-90 transition-transform" />
                Tambah Platform Baru
              </button>
              <p v-else class="text-[10px] text-gray-400 text-center font-bold tracking-widest ">Maksimal 5
                platform media sosial</p>
            </div>
          </div>
        </div>

        <!-- Tab: Fasilitas & Jadwal -->
        <div v-if="activeTab === 'facilities'" class="space-y-8">
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-[11px] font-black text-navy  tracking-[0.2em] flex items-center gap-2">
                <Icon icon="ph:check-circle-bold" class="text-primary text-xl" /> Daftar Fasilitas
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

        <!-- Public Profile Link -->
        <div
          class="bg-gradient-to-br from-navy to-navy-light rounded-3xl p-6 text-white shadow-md shadow-navy/20 relative overflow-hidden group">
          <Icon icon="ph:broadcast-bold"
            class="absolute -right-4 -top-4 text-8xl text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          <h3 class="font-black mb-2 flex items-center gap-2 relative z-10">
            Profil Publik
            <Icon icon="ph:check-circle-fill" class="text-primary" />
          </h3>
          <p class="text-xs text-blue-200 mb-6 relative z-10 leading-relaxed font-medium">Profil Anda aktif dan dapat
            diakses publik melalui URL unik Archery Hub.</p>
          <NuxtLink v-if="form.slug" :to="`/clubs/${form.slug}`" target="_blank"
            class="relative z-10 block w-full py-3.5 bg-primary text-navy font-black rounded-2xl text-center hover:bg-primary-hover hover:scale-[1.02] transition-all shadow-md active:scale-95">
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
  { value: 'instagram', title: 'Instagram', icon: 'ph:instagram-logo' },
  { value: 'facebook', title: 'Facebook', icon: 'ph:facebook-logo' },
  { value: 'twitter', title: 'X (Twitter)', icon: 'ph:x-logo' },
  { value: 'youtube', title: 'YouTube', icon: 'ph:youtube-logo' },
  { value: 'tiktok', title: 'TikTok', icon: 'ph:tiktok-logo' },
  { value: 'linkedin', title: 'LinkedIn', icon: 'ph:linkedin-logo' }
]

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

const indonesiaCities = [
  'Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur',
  'Bandung', 'Cimahi', 'Bekasi', 'Depok', 'Bogor', 'Tangerang', 'Tangerang Selatan',
  'Surabaya', 'Malang', 'Sidoarjo', 'Gresik', 'Kediri', 'Mojokerto', 'Madiun', 'Jember',
  'Semarang', 'Solo', 'Surakarta', 'Yogyakarta', 'Magelang', 'Salatiga', 'Pekalongan',
  'Medan', 'Binjai', 'Pematang Siantar', 'Tebing Tinggi', 'Padang', 'Bukittinggi', 'Palembang',
  'Bandar Lampung', 'Metro', 'Bengkulu', 'Jambi', 'Pekanbaru', 'Dumai', 'Batam', 'Tanjung Pinang',
  'Pontianak', 'Singkawang', 'Banjarmasin', 'Banjarbaru', 'Balikpapan', 'Samarinda', 'Tarakan',
  'Makassar', 'Parepare', 'Palopo', 'Manado', 'Bitung', 'Tomohon', 'Gorontalo', 'Kendari',
  'Denpasar', 'Mataram', 'Kupang', 'Ambon', 'Ternate', 'Jayapura', 'Sorong', 'Manokwari',
  'Cirebon', 'Tasikmalaya', 'Sukabumi', 'Garut', 'Karawang', 'Purwakarta', 'Subang',
  'Tegal', 'Brebes', 'Purwokerto', 'Cilacap', 'Kudus', 'Jepara', 'Demak', 'Kendal',
  'Blitar', 'Probolinggo', 'Pasuruan', 'Batu', 'Lumajang', 'Tulungagung', 'Nganjuk',
  'Serang', 'Cilegon', 'Pandeglang', 'Lebak'
]

const filterCities = () => {
  const search = citySearch.value.toLowerCase()
  if (!search) {
    filteredCities.value = indonesiaCities.slice(0, 10)
  } else {
    filteredCities.value = indonesiaCities
      .filter(city => city.toLowerCase().includes(search))
      .slice(0, 10)
  }
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
const addSocialMedia = () => {
  if (form.socialMedia.length < 5) {
    form.socialMedia.push({ platform: 'instagram', username: '' })
  }
}

const removeSocialMedia = (index) => {
  form.socialMedia.splice(index, 1)
}

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
      form.established = data.established || ''
      form.description = data.description || ''
      form.phone = data.phone || ''
      form.whatsapp = data.whatsapp || ''
      form.email = data.email || ''
      form.website = data.website || ''
      form.address = data.address || ''

      // Handle JSON strings if necessary
      const parseOrRaw = (val) => {
        if (typeof val === 'string' && val.startsWith('[')) {
          try { return JSON.parse(val) } catch (e) { return [] }
        }
        return Array.isArray(val) ? val : []
      }

      form.facilities = parseOrRaw(data.facilities)
      form.schedules = parseOrRaw(data.schedules)
      form.socialMedia = parseOrRaw(data.social_media)

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
    await put('/clubs/me', {
      name: form.name,
      slug: form.slug,
      banner_url: form.bannerUrl,
      logo_url: form.logoUrl,
      city: form.city,
      province: form.province,
      established: form.established,
      description: form.description,
      phone: form.phone,
      whatsapp: form.whatsapp,
      email: form.email,
      website: form.website,
      address: form.address,
      facilities: form.facilities,
      schedules: form.schedules,
      social_media: form.socialMedia,
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
  loadProfile()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>

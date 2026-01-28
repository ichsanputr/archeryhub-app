<template>
  <div class="flex flex-col gap-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black text-navy tracking-tight">Profil Organisasi</h1>
        <p class="text-gray-500 mt-1">Perbarui identitas, kontak, dan halaman publik organisasi Anda.</p>
      </div>
      <div class="flex gap-3">
        <button
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-navy-dark transition"
          :disabled="saving" @click="saveProfile">
          <LoadingSpinner v-if="saving" size="sm" />
          <Icon v-else icon="ph:floppy-disk" class="text-lg" />
          <span>{{ saving ? 'Menyimpan...' : 'Simpan Profil' }}</span>
        </button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div
      class="flex items-center gap-1 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
        'px-5 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap flex items-center gap-2',
        activeTab === tab.id
          ? 'bg-navy text-white shadow-lg shadow-navy/20'
          : 'text-gray-400 hover:text-navy hover:bg-gray-50'
      ]">
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
              <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
                <Icon icon="ph:identification-badge-bold" class="text-primary text-lg" /> Identitas Utama
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="form.name" label="Nama Organisasi" placeholder="Nama resmi organisasi" required />

              <!-- Username URL -->
              <BaseInput v-model="form.username" label="Username" placeholder="perpani-indonesia"
                helper="Digunakan untuk URL profil publik" />

              <!-- City Autocomplete -->
              <div class="relative">
                <label class="block text-sm font-bold text-navy mb-2">Kota</label>
                <input v-model="citySearch" type="text"
                  class="w-full px-4 py-3 rounded-xl border border-gray-100 text-sm font-bold transition-all outline-none focus:border-navy bg-gray-50"
                  placeholder="Cari kota..." @focus="showCityDropdown = true" @blur="handleCityBlur"
                  @input="handleCitySearch" />

                <div v-if="showCityDropdown && filteredCities.length > 0"
                  class="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-1 py-2">
                  <button v-for="city in filteredCities" :key="city" type="button"
                    class="w-full px-4 py-2.5 text-left text-sm font-bold text-navy hover:bg-gray-50 rounded-xl transition-colors"
                    @mousedown.prevent="selectCity(city)">
                    {{ city }}
                  </button>
                </div>
                <div v-if="loadingCities" class="absolute right-3 top-[38px]">
                  <Icon icon="ph:circle-notch-bold" class="animate-spin text-gray-400" />
                </div>
              </div>
            </div>
            <BaseTextarea v-model="form.description" label="Tentang Organisasi" rows="5"
              placeholder="Berikan deskripsi singkat dan menarik tentang organisasi Anda..." />
          </div>

          <!-- Logo & Banner -->
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
            <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
              <Icon icon="ph:image-bold" class="text-primary text-lg" /> Branding Visual
            </h3>

            <div class="space-y-8">
              <!-- Logo Upload -->
              <div class="space-y-4">
                <label class="block text-sm font-black text-navy">Logo Organisasi</label>
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
                      <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Upload banner 1200x400</p>
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
            <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
              <Icon icon="ph:phone-bold" class="text-primary text-xl" /> Informasi Kontak
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="form.phone" label="Nomor Telepon" placeholder="Contoh: 021-xxxxxxxx" />
              <BaseInput v-model="form.whatsapp" label="Nomor WhatsApp" placeholder="Contoh: 08xx-xxxx-xxxx" />
              <BaseInput v-model="form.email" label="Alamat Email" type="email" placeholder="info@organisasi.id"
                disabled />
              <BaseInput v-model="form.website" label="Website Resmi" placeholder="https://www.organisasi.id" />
            </div>
            <BaseTextarea v-model="form.address" label="Alamat Lengkap (Kantor)" rows="3"
              placeholder="Tuliskan alamat lengkap kantor sekretariat..." />
          </div>

          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
              <Icon icon="ph:share-network-bold" class="text-primary text-xl" /> Kehadiran Media Sosial
            </h3>
            <p class="text-sm text-gray-500 font-medium">Hubungkan organisasi dengan anggota melalui platform sosial
              favorit.</p>

            <div class="space-y-4">
              <transition-group name="list">
                <div v-for="(social, idx) in form.socialMedia" :key="idx"
                  class="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 group">
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="relative md:col-span-1">
                      <select v-model="social.platform"
                        class="w-full bg-white border border-gray-200 text-sm font-black text-navy rounded-xl px-4 py-3 outline-none focus:border-navy appearance-none">
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="twitter">X (Twitter)</option>
                        <option value="youtube">YouTube</option>
                        <option value="tiktok">TikTok</option>
                        <option value="linkedin">LinkedIn</option>
                      </select>
                      <Icon icon="ph:caret-down-bold"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
              <p v-else class="text-[10px] text-gray-400 text-center font-bold tracking-widest uppercase">Maksimal 5
                platform media sosial</p>
            </div>
          </div>
        </div>

        <!-- Tab: Konten -->
        <div v-if="activeTab === 'content'" class="space-y-8">
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
                <Icon icon="ph:stack-bold" class="text-primary text-xl" /> Konten Halaman Dinamis
              </h3>
              <button
                class="flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-xl text-sm font-black hover:bg-navy-dark transition shadow-lg shadow-navy/20"
                @click="addSection">
                <Icon icon="ph:plus-circle-bold" class="text-lg" /> Tambah Section Baru
              </button>
            </div>

            <div class="space-y-6">
              <transition-group name="list">
                <div v-for="(section, idx) in dynamicSections" :key="idx"
                  class="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow relative">
                  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div class="flex items-center gap-4">
                      <div
                        class="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center font-black shadow-sm">
                        {{ idx + 1 }}
                      </div>
                      <div class="relative">
                        <select v-model="section.type"
                          class="bg-gray-50 border border-gray-200 text-sm font-black text-navy rounded-xl px-5 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 appearance-none pr-10">
                          <option value="about">Tentang Kami (Text)</option>
                          <option value="gallery">Galeri Foto</option>
                          <option value="testimonials">Testimoni</option>
                          <option value="faq">FAQ</option>
                          <option value="hero">Promotion Banner</option>
                        </select>
                        <Icon icon="ph:caret-down-bold"
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-navy pointer-events-none" />
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <button @click="moveSection(idx, -1)" :disabled="idx === 0"
                        class="p-2.5 bg-gray-50 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-xl disabled:opacity-20 transition-colors">
                        <Icon icon="ph:arrow-up-bold" class="text-lg" />
                      </button>
                      <button @click="moveSection(idx, 1)" :disabled="idx === dynamicSections.length - 1"
                        class="p-2.5 bg-gray-50 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-xl disabled:opacity-20 transition-colors">
                        <Icon icon="ph:arrow-down-bold" class="text-lg" />
                      </button>
                      <button @click="removeSection(idx)"
                        class="p-2.5 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-colors">
                        <Icon icon="ph:trash-bold" class="text-lg" />
                      </button>
                    </div>
                  </div>

                  <!-- Content Editor Based on Type -->
                  <div class="grid grid-cols-1 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-50">
                    <BaseInput v-model="section.title" label="Judul Section" placeholder="Masukkan judul utama..."
                      class="!bg-white" />

                    <div v-if="section.type === 'about'">
                      <BaseTextarea v-model="section.content" label="Konten Paragraf" rows="5"
                        placeholder="Tuliskan cerita detail atau visi misi organisasi..." class="!bg-white" />
                    </div>

                    <div v-else-if="section.type === 'gallery'" class="space-y-4">
                      <div class="flex items-center justify-between">
                        <label class="block text-sm font-bold text-gray-700">Media Galeri</label>
                        <button @click="openMediaLibrary('section-gallery-' + idx)"
                          class="text-xs font-black text-primary hover:underline flex items-center gap-1">
                          <Icon icon="ph:plus-bold" /> Tambah dari Media
                        </button>
                      </div>
                      <BaseTextarea v-model="section.images" rows="3" placeholder="Paste link gambar dipisahkan koma..."
                        class="!bg-white text-xs font-mono" />
                      <p class="text-[10px] text-gray-400 font-medium">Contoh: https://link1.jpg, https://link2.jpg</p>
                    </div>

                    <div v-else-if="section.type === 'testimonials'" class="space-y-4">
                      <div v-for="(t, tIdx) in section.items" :key="tIdx"
                        class="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 relative group">
                        <button @click="section.items.splice(tIdx, 1)"
                          class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                          <Icon icon="ph:x-bold" />
                        </button>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <BaseInput v-model="t.author" label="Nama Penulis" placeholder="Contoh: Bapak Budi" />
                          <BaseInput v-model="t.role" label="Jabatan/Status" placeholder="Contoh: Ketua Umum" />
                        </div>
                        <BaseTextarea v-model="t.text" label="Testimoni" rows="3"
                          placeholder="Apa kata mereka tentang organisasi?" />
                      </div>
                      <button @click="section.items.push({ author: '', text: '', role: '' })"
                        class="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-xs font-black text-navy hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                        <Icon icon="ph:plus-bold" /> Tambah Testimoni
                      </button>
                    </div>

                    <div v-else-if="section.type === 'faq'" class="space-y-4">
                      <div v-for="(item, fIdx) in section.items" :key="fIdx"
                        class="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4 relative group">
                        <button @click="section.items.splice(fIdx, 1)"
                          class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                          <Icon icon="ph:x-bold" />
                        </button>
                        <BaseInput v-model="item.question" label="Pertanyaan"
                          placeholder="Apa syarat menjadi anggota?" />
                        <BaseTextarea v-model="item.answer" label="Jawaban" rows="2"
                          placeholder="Syarat bergabung adalah..." />
                      </div>
                      <button @click="section.items.push({ question: '', answer: '' })"
                        class="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-xs font-black text-navy hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                        <Icon icon="ph:plus-bold" /> Tambah FAQ Item
                      </button>
                    </div>
                  </div>
                </div>
              </transition-group>

              <div v-if="!dynamicSections.length"
                class="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                <div class="size-20 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-5">
                  <Icon icon="ph:stack-light" class="text-4xl text-gray-200" />
                </div>
                <h4 class="text-navy font-black mb-1">Section Tambahan Masih Kosong</h4>
                <p class="text-sm text-gray-400 max-w-sm mx-auto">Tambahkan section seperti FAQ, Testimoni, atau Galeri
                  untuk mempercantik halaman publik Anda.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Side card -->
      <div class="space-y-4">
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
            <Icon icon="ph:gear-six-bold" class="text-primary text-lg" /> Visibilitas Halaman
          </h3>
          <p class="text-xs text-gray-500 font-medium">Atur bagian mana yang dapat dilihat publik.</p>
          <div class="space-y-4 pt-2">
            <BaseCheckbox v-model="pageSettings.sections.identity" label="Identitas Organisasi" />
            <BaseCheckbox v-model="pageSettings.sections.contact" label="Kontak & Sosmed" />
          </div>
        </div>

        <!-- Public Profile Link -->
        <div
          class="bg-gradient-to-br from-navy to-navy-light rounded-3xl p-6 text-white shadow-xl shadow-navy/20 relative overflow-hidden group">
          <Icon icon="ph:broadcast-bold"
            class="absolute -right-4 -top-4 text-8xl text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          <h3 class="font-black mb-2 flex items-center gap-2 relative z-10">
            Profil Publik
            <Icon icon="ph:check-circle-fill" class="text-primary" />
          </h3>
          <p class="text-xs text-blue-200 mb-6 relative z-10 leading-relaxed font-medium">Profil Anda aktif dan dapat
            diakses publik melalui URL unik Archery Hub.</p>
          <NuxtLink v-if="form.username" :to="`/organization/${form.username}`" target="_blank"
            class="relative z-10 block w-full py-3.5 bg-primary text-navy font-black rounded-2xl text-center hover:bg-primary-hover hover:scale-[1.02] transition-all shadow-lg active:scale-95">
            Lihat Halaman Publik
          </NuxtLink>
          <p v-else class="text-xs text-blue-300 italic relative z-10">Username belum diatur</p>
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
  title: 'Profil Organisasi',
  layout: 'dashboard',
  middleware: ['auth']
})

const router = useRouter()
const { get, put } = useApi()
const { user } = useAuth()
const toast = useToast()

const saving = ref(false)
const activeTab = ref('general')

const tabs = [
  { id: 'general', label: 'Info Umum', icon: 'ph:identification-badge-bold' },
  { id: 'contact', label: 'Kontak & Sosmed', icon: 'ph:phone-bold' },
  { id: 'content', label: 'Konten Tambahan', icon: 'ph:stack-bold' }
]

const pageSettings = reactive({
  sections: {
    identity: true,
    contact: true
  }
})

const form = reactive({
  name: '',
  username: '',
  bannerUrl: '',
  logoUrl: '',
  city: '',
  description: '',
  phone: '',
  whatsapp: '',
  email: '',
  website: '',
  address: '',
  socialMedia: []
})

const dynamicSections = ref([])

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
      // Using a public API for Indonesian regions
      const response = await fetch('https://raw.githubusercontent.com/drshofian/indonesia-regions/master/data/regencies.json')
      const cities = await response.json()

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
  } else if (mediaTarget.value.startsWith('section-gallery-')) {
    const idx = parseInt(mediaTarget.value.replace('section-gallery-', ''))
    if (!isNaN(idx) && dynamicSections.value[idx]) {
      const currentImages = dynamicSections.value[idx].images || ''
      dynamicSections.value[idx].images = currentImages
        ? `${currentImages}, ${media.url}`
        : media.url
    }
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
    const resp = await get('/organizations/me')
    const data = resp?.data || resp || {}
    if (data) {
      form.name = data.name || ''
      form.username = data.username || ''
      form.bannerUrl = data.banner_url || ''
      form.logoUrl = data.logo_url || data.avatar_url || ''
      form.city = data.city || ''
      citySearch.value = data.city || ''
      form.description = data.description || ''
      form.phone = data.phone || ''
      form.whatsapp = data.whatsapp || ''
      form.email = data.email || ''
      form.website = data.website || ''
      form.address = data.address || ''
      form.socialMedia = Array.isArray(data.social_media) ? data.social_media : []

      // Load page settings
      if (data.page_settings) {
        try {
          const parsed = typeof data.page_settings === 'string' ? JSON.parse(data.page_settings) : data.page_settings
          Object.assign(pageSettings.sections, parsed.sections || {})
        } catch (e) {
          console.error('Failed to parse page_settings', e)
        }
      }

      // Load dynamic sections
      if (data.dynamic_sections) {
        try {
          dynamicSections.value = typeof data.dynamic_sections === 'string'
            ? JSON.parse(data.dynamic_sections)
            : data.dynamic_sections
        } catch (e) {
          console.error('Failed to parse dynamic_sections', e)
        }
      }
    }
  } catch (error) {
    console.error('Load profile error:', error)
    const errorMessage = error?.data?.error || error?.response?.data?.error || error?.message || 'Gagal memuat profil organisasi'
    toast.error(errorMessage)
  }
}

const saveProfile = async () => {
  saving.value = true
  try {
    await put('/organizations/me', {
      name: form.name,
      username: form.username,
      banner_url: form.bannerUrl,
      logo_url: form.logoUrl,
      avatar_url: form.logoUrl, // Some APIs might expect avatar_url
      city: form.city,
      description: form.description,
      phone: form.phone,
      whatsapp: form.whatsapp,
      website: form.website,
      address: form.address,
      social_media: form.socialMedia,
      page_settings: JSON.stringify(pageSettings),
      dynamic_sections: JSON.stringify(dynamicSections.value)
    })
    toast.success('Profil organisasi berhasil disimpan!')
  } catch (error) {
    console.error('Save profile error:', error)
    const errorMessage = error?.data?.error || error?.response?.data?.error || error?.message || 'Gagal menyimpan profil'
    toast.error(errorMessage)
  } finally {
    saving.value = false
  }
}

const addSection = () => {
  dynamicSections.value.push({
    type: 'about',
    title: '',
    content: '',
    images: '',
    items: []
  })
}

const removeSection = (index) => {
  dynamicSections.value.splice(index, 1)
}

const moveSection = (index, direction) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < dynamicSections.value.length) {
    const temp = dynamicSections.value[index]
    dynamicSections.value[index] = dynamicSections.value[newIndex]
    dynamicSections.value[newIndex] = temp
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

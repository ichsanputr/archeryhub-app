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

              <!-- Slug URL -->
              <BaseInput v-model="form.slug" label="Slug URL" placeholder="perpani-indonesia"
                helper="Digunakan untuk URL profil publik (archeryhub.id/organization/slug)" />

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
                    <img :src="useImageOrDefault(form.logoUrl, form.name)"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
              <BaseInput v-model="form.whatsapp_no" label="Nomor WhatsApp" placeholder="Contoh: 08xx-xxxx-xxxx"
                required />
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

        <!-- Tab: Visi, Misi & Sejarah -->
        <div v-if="activeTab === 'about'" class="space-y-8">
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
              <Icon icon="ph:eye-bold" class="text-primary text-xl" /> Visi & Misi
            </h3>
            <BaseTextarea v-model="form.vision" label="Visi" rows="3" placeholder="Tuliskan visi organisasi..." />
            <BaseTextarea v-model="form.mission" label="Misi" rows="5"
              placeholder="Tuliskan misi organisasi (bisa per poin)..." />
          </div>

          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
              <Icon icon="ph:book-open-bold" class="text-primary text-xl" /> Sejarah Organisasi
            </h3>
            <BaseTextarea v-model="form.history" label="Sejarah Singkat" rows="8"
              placeholder="Ceritakan sejarah berdirinya organisasi..." />
          </div>
        </div>

        <!-- Tab: FAQ -->
        <div v-if="activeTab === 'faq'" class="space-y-8">
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
                <Icon icon="ph:question-bold" class="text-primary text-xl" /> Pertanyaan Sering Diajukan (FAQ)
              </h3>
              <button @click="addFAQ"
                class="text-xs font-black text-primary hover:text-primary-dark flex items-center gap-1 transition">
                <Icon icon="ph:plus-circle-bold" /> Tambah FAQ
              </button>
            </div>

            <div class="space-y-4">
              <div v-for="(item, idx) in form.faq" :key="idx"
                class="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 relative group">
                <button @click="removeFAQ(idx)"
                  class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                  <Icon icon="ph:trash-bold" />
                </button>
                <BaseInput v-model="item.question" label="Pertanyaan"
                  placeholder="Contoh: Bagaimana cara menjadi anggota?" />
                <BaseTextarea v-model="item.answer" label="Jawaban" rows="3"
                  placeholder="Tuliskan jawaban lengkap..." />
              </div>

              <div v-if="form.faq.length === 0"
                class="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
                <Icon icon="ph:chat-centered-dots-bold" class="text-4xl text-gray-200 mx-auto mb-2" />
                <p class="text-sm text-gray-400 font-bold uppercase tracking-widest">Belum ada FAQ</p>
                <button @click="addFAQ"
                  class="mt-4 px-4 py-2 bg-navy text-white text-xs font-black rounded-xl shadow-lg hover:bg-navy-dark transition">Buat
                  FAQ Pertama</button>
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
            <BaseCheckbox v-model="pageSettings.sections.about" label="Visi, Misi & Sejarah" />
            <BaseCheckbox v-model="pageSettings.sections.faq" label="FAQ" />
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
          <NuxtLink v-if="form.slug" :to="`/organization/${form.slug}`" target="_blank"
            class="relative z-10 block w-full py-3.5 bg-primary text-navy font-black rounded-2xl text-center hover:bg-primary-hover hover:scale-[1.02] transition-all shadow-lg active:scale-95">
            Lihat Halaman Publik
          </NuxtLink>
          <p v-else class="text-xs text-blue-300 italic relative z-10">Slug belum diatur</p>
        </div>
      </div>
    </div>

    <!-- Media Library Modal -->
    <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({
  title: 'Profil Organisasi',
  layout: 'dashboard',
  middleware: ['auth']
})

const router = useRouter()
const { get, put } = useApi()
const { user, organizationProfile } = useAuth()
const toast = useToast()

const saving = ref(false)
const activeTab = ref('general')

const tabs = [
  { id: 'general', label: 'Info Umum', icon: 'ph:identification-badge-bold' },
  { id: 'contact', label: 'Kontak & Sosmed', icon: 'ph:phone-bold' },
  { id: 'about', label: 'Visi & Misi', icon: 'ph:eye-bold' },
  { id: 'faq', label: 'FAQ', icon: 'ph:question-bold' }
]

const pageSettings = reactive({
  sections: {
    identity: true,
    contact: true,
    about: true,
    faq: true
  }
})

const form = reactive({
  name: '',
  slug: '',
  bannerUrl: '',
  logoUrl: '',
  city: '',
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
const addSocialMedia = () => {
  if (form.socialMedia.length < 5) {
    form.socialMedia.push({ platform: 'instagram', username: '' })
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
      form.city = org.city || ''
      citySearch.value = org.city || ''
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
      city: form.city,
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

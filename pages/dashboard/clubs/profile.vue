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
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-navy-dark transition"
          :disabled="saving" @click="saveProfile">
          <LoadingSpinner v-if="saving" size="sm" />
          <Icon v-else icon="ph:floppy-disk" class="text-lg" />
          <span>{{ saving ? 'Menyimpan...' : 'Simpan Profil' }}</span>
        </button>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex items-center gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        class="px-6 py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap"
        :class="activeTab === tab.id ? 'text-navy border-navy bg-gray-50' : 'text-gray-500 border-transparent hover:text-navy hover:bg-gray-50'">
        <Icon :icon="tab.icon" class="text-xl" />
        {{ tab.name }}
      </button>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Tab: Identitas -->
        <template v-if="activeTab === 'identitas'">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div class="flex items-center justify-between">
              <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
                <Icon icon="ph:identification-badge" class="text-primary" /> Identitas Klub
              </h3>
              <BaseCheckbox v-model="pageSettings.sections.identity" label="Tampilkan" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <BaseInput v-model="form.name" label="Nama Klub" placeholder="Nama resmi klub" required />

              <!-- Slug URL with availability check -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1.5">Slug URL</label>
                <div class="relative">
                  <input v-model="form.slug" type="text" :disabled="slugLocked" :class="[
                    'w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none',
                    slugLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white',
                    slugStatus === 'available' ? 'border-green-300 focus:border-green-500' : '',
                    slugStatus === 'taken' ? 'border-red-300 focus:border-red-500' : '',
                    slugStatus === '' ? 'border-gray-200 focus:border-navy' : ''
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
                <p v-if="slugLocked" class="text-xs text-gray-400 mt-1">
                  <Icon icon="ph:lock-fill" class="inline text-xs" /> Slug hanya dapat diubah sekali
                </p>
                <p v-else-if="slugStatus === 'taken'" class="text-xs text-red-500 mt-1">Slug sudah digunakan</p>
                <p v-else-if="slugStatus === 'available'" class="text-xs text-green-600 mt-1">Slug tersedia</p>
                <p v-else class="text-xs text-gray-400 mt-1">URL: archeryhub.id/clubs/{{ form.slug || 'slug-anda' }}</p>
              </div>

              <BaseInput v-model="form.established" label="Tahun Berdiri" type="number" />

              <!-- City Autocomplete -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1.5">Kota/Kabupaten</label>
                <div class="relative">
                  <input v-model="citySearch" type="text"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm transition-all outline-none focus:border-navy bg-white"
                    placeholder="Cari kota..." @focus="showCityDropdown = true" @blur="handleCityBlur"
                    @input="filterCities" />
                  <div v-if="showCityDropdown && filteredCities.length > 0"
                    class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    <button v-for="city in filteredCities" :key="city" type="button"
                      class="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors"
                      @mousedown.prevent="selectCity(city)">
                      {{ city }}
                    </button>
                  </div>
                </div>
              </div>

              <BaseInput v-model="form.province" label="Provinsi" placeholder="DKI Jakarta" />
            </div>
            <BaseTextarea v-model="form.description" label="Deskripsi" rows="4"
              placeholder="Ceritakan tentang klub..." />
          </div>

          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
              <Icon icon="ph:image-bold" class="text-primary" /> Logo & Banner
            </h3>

            <!-- Logo Upload -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Logo Klub</label>
              <div class="flex items-start gap-4">
                <div
                  class="w-24 h-24 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                  <img v-if="form.logoUrl" :src="form.logoUrl" class="w-full h-full object-cover" />
                  <Icon v-else icon="ph:user-circle-bold" class="text-4xl text-gray-300" />
                </div>
                <div class="flex-1 space-y-3">
                  <div class="flex flex-wrap gap-2">
                    <button type="button" @click="openMediaLibrary('logo')"
                      class="flex items-center gap-2 px-4 py-2 bg-navy text-white text-sm font-bold rounded-lg hover:bg-navy-dark transition">
                      <div class="flex items-center justify-center">
                        <Icon icon="ph:image-bold" />
                      </div>
                      <div>Pilih Logo</div>
                    </button>
                    <button v-if="form.logoUrl" type="button" @click="form.logoUrl = ''"
                      class="px-3 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-lg hover:bg-red-100 transition">
                      Hapus
                    </button>
                  </div>
                  <p class="text-xs text-gray-400">Pilih dari galeri media atau upload logo baru.</p>
                </div>
              </div>
            </div>

            <!-- Banner Upload -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Banner Klub</label>
              <div class="relative">
                <div
                  class="h-32 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
                  <img v-if="form.bannerUrl" :src="form.bannerUrl" class="w-full h-full object-cover" />
                  <div v-else class="text-center">
                    <Icon icon="ph:image-bold" class="text-3xl text-gray-300 mx-auto mb-2" />
                    <p class="text-xs text-gray-400">Upload banner klub</p>
                  </div>
                </div>
                <div class="mt-3 flex gap-2">
                  <button type="button" @click="openMediaLibrary('banner')"
                    class="flex items-center gap-2 px-4 py-2 bg-navy text-white text-sm font-bold rounded-lg hover:bg-navy-dark transition">
                    <Icon icon="ph:image-bold" class="mr-1" />
                    <div>Pilih Banner</div>
                  </button>
                  <button v-if="form.bannerUrl" type="button" @click="form.bannerUrl = ''"
                    class="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-lg hover:bg-red-100 transition">
                    <div>Hapus</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Tab: Kontak -->
        <template v-if="activeTab === 'kontak'">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div class="flex items-center justify-between">
              <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
                <Icon icon="ph:phone-bold" class="text-primary" /> Kontak
              </h3>
              <BaseCheckbox v-model="pageSettings.sections.contact" label="Tampilkan" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <BaseInput v-model="form.phone" label="Telepon" placeholder="021-xxxxxxx" />
              <BaseInput v-model="form.whatsapp" label="WhatsApp" placeholder="+62 8xx xxxx xxxx" />
              <BaseInput v-model="form.email" label="Email" type="email" placeholder="info@klub.com" />
              <BaseInput v-model="form.website" label="Website" placeholder="https://..." />
            </div>
            <BaseTextarea v-model="form.address" label="Alamat Latihan" rows="3"
              placeholder="Alamat lengkap lokasi latihan." />
          </div>
        </template>

        <!-- Tab: Sosial Media -->
        <template v-if="activeTab === 'sosial'">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div class="flex items-center justify-between">
              <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
                <Icon icon="ph:share-network-bold" class="text-primary" /> Media Sosial
              </h3>
              <BaseCheckbox v-model="pageSettings.sections.social" label="Tampilkan" />
            </div>
            <p class="text-sm text-gray-500">Tambahkan hingga 5 akun media sosial untuk ditampilkan di halaman publik.
            </p>

            <div class="space-y-4">
              <div v-for="(social, idx) in form.socialMedia" :key="idx"
                class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <select v-model="social.platform"
                  class="bg-white border border-gray-200 text-sm font-bold rounded-lg px-3 py-2 outline-none focus:border-primary w-40">
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
                <BaseInput v-model="social.username" placeholder="Username atau URL" class="flex-1" />
                <button @click="removeSocialMedia(idx)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                  <Icon icon="ph:trash-bold" class="text-lg" />
                </button>
              </div>

              <button v-if="form.socialMedia.length < 5" @click="addSocialMedia"
                class="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:border-primary hover:text-primary transition flex items-center justify-center gap-2">
                <Icon icon="ph:plus-bold" />
                Tambah Media Sosial
              </button>
              <p v-else class="text-xs text-gray-400 text-center">Maksimal 5 akun media sosial</p>
            </div>
          </div>
        </template>

        <!-- Tab: Fasilitas -->
        <template v-if="activeTab === 'fasilitas'">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
                <Icon icon="ph:check-circle" class="text-primary" /> Fasilitas
              </h3>
              <BaseCheckbox v-model="pageSettings.sections.facilities" label="Tampilkan" />
            </div>
            <div class="flex gap-2">
              <BaseInput v-model="facilityInput" placeholder="Tambah fasilitas" class="flex-1" />
              <button
                class="px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-dark transition"
                @click="addFacility">
                Tambah
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-for="(item, idx) in form.facilities" :key="idx"
                class="px-3 py-1 bg-gray-50 border border-gray-200 text-sm font-semibold text-navy rounded-xl flex items-center gap-2">
                {{ item }}
                <button class="text-gray-400 hover:text-red-500" @click="removeFacility(idx)">
                  <Icon icon="ph:x" class="text-sm" />
                </button>
              </span>
              <p v-if="!form.facilities.length" class="text-sm text-gray-500">Belum ada fasilitas ditambahkan.</p>
            </div>
          </div>
        </template>

        <!-- Tab: Jadwal -->
        <template v-if="activeTab === 'jadwal'">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
                <Icon icon="ph:calendar-bold" class="text-primary" /> Jadwal Latihan
              </h3>
              <div class="flex items-center gap-4">
                <BaseCheckbox v-model="pageSettings.sections.schedules" label="Tampilkan" />
                <button
                  class="px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-dark transition"
                  @click="addSchedule">
                  Tambah Jadwal
                </button>
              </div>
            </div>
            <div class="space-y-3">
              <div v-for="(item, idx) in form.schedules" :key="idx"
                class="grid grid-cols-1 md:grid-cols-3 gap-3 items-center bg-gray-50/60 p-3 rounded-xl border border-gray-100">
                <BaseInput v-model="item.day" label="Hari" placeholder="Senin - Rabu" />
                <BaseInput v-model="item.time" label="Jam" placeholder="16:00 - 19:00" />
                <div class="flex items-end justify-end">
                  <button class="px-3 py-2 text-sm font-semibold text-red-600 hover:text-red-700"
                    @click="removeSchedule(idx)">
                    Hapus
                  </button>
                </div>
              </div>
              <p v-if="!form.schedules.length" class="text-sm text-gray-500">Belum ada jadwal latihan.</p>
            </div>
          </div>
        </template>

        <!-- Tab: Konten -->
        <template v-if="activeTab === 'konten'">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
                <Icon icon="ph:stack" class="text-primary" /> Konten Dinamis (Custom Sections)
              </h3>
              <button
                class="px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-dark transition"
                @click="addSection">
                Tambah Section
              </button>
            </div>
            <div class="space-y-6">
              <div v-for="(section, idx) in dynamicSections" :key="idx"
                class="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm relative group">
                <div class="flex justify-between items-center mb-6">
                  <div class="flex items-center gap-4">
                    <div
                      class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                      {{ idx + 1 }}
                    </div>
                    <select v-model="section.type"
                      class="bg-gray-50 border border-gray-200 text-sm font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                      <option value="about">Tentang Kami (Text)</option>
                      <option value="gallery">Galeri Foto</option>
                      <option value="testimonials">Testimoni</option>
                      <option value="faq">FAQ</option>
                      <option value="hero">Banner Kecil (Promotion)</option>
                    </select>
                  </div>
                  <div class="flex gap-2">
                    <button @click="moveSection(idx, -1)" :disabled="idx === 0"
                      class="p-2 text-gray-400 hover:text-navy disabled:opacity-30">
                      <Icon icon="ph:arrow-up-bold" />
                    </button>
                    <button @click="moveSection(idx, 1)" :disabled="idx === dynamicSections.length - 1"
                      class="p-2 text-gray-400 hover:text-navy disabled:opacity-30">
                      <Icon icon="ph:arrow-down-bold" />
                    </button>
                    <button @click="removeSection(idx)" class="p-2 text-red-400 hover:text-red-600">
                      <Icon icon="ph:trash-bold" />
                    </button>
                  </div>
                </div>

                <!-- Content Editor Based on Type -->
                <div class="space-y-4">
                  <BaseInput v-model="section.title" label="Judul Section" placeholder="Masukkan judul..." />

                  <div v-if="section.type === 'about'">
                    <BaseTextarea v-model="section.content" label="Konten" rows="4"
                      placeholder="Masukkan cerita atau informasi detail..." />
                  </div>

                  <div v-else-if="section.type === 'gallery'" class="space-y-3">
                    <label class="block text-sm font-bold text-gray-700">Image URLs (comma separated)</label>
                    <BaseTextarea v-model="section.images" rows="2"
                      placeholder="https://image1.jpg, https://image2.jpg" />
                  </div>

                  <div v-else-if="section.type === 'testimonials'" class="space-y-4">
                    <div v-for="(t, tIdx) in section.items" :key="tIdx"
                      class="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-3">
                      <div class="flex justify-between">
                        <span class="text-xs font-bold text-gray-400">Testimoni {{ tIdx + 1 }}</span>
                        <button @click="section.items.splice(tIdx, 1)"
                          class="text-red-500 text-xs font-bold">Hapus</button>
                      </div>
                      <BaseInput v-model="t.author" label="Nama Pengirim" class="!bg-white" />
                      <BaseTextarea v-model="t.text" label="Pesan" rows="2" class="!bg-white" />
                    </div>
                    <button @click="section.items.push({ author: '', text: '' })"
                      class="text-sm font-bold text-primary hover:underline">+ Tambah Testimoni</button>
                  </div>
                </div>
              </div>
              <div v-if="!dynamicSections.length"
                class="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
                <Icon icon="ph:stack-light" class="text-4xl text-gray-200 mx-auto mb-2" />
                <p class="text-sm text-gray-400">Belum ada konten tambahan. Klik "Tambah Section" untuk memperkaya
                  profil klub Anda.</p>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Side card -->
      <div class="space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em]">Pengaturan Tampilan</h3>
          <p class="text-sm text-gray-500">Pilih section yang ingin ditampilkan di halaman publik.</p>
          <div class="space-y-3">
            <BaseCheckbox v-model="pageSettings.sections.identity" label="Identitas Klub" />
            <BaseCheckbox v-model="pageSettings.sections.contact" label="Kontak" />
            <BaseCheckbox v-model="pageSettings.sections.social" label="Media Sosial" />
            <BaseCheckbox v-model="pageSettings.sections.facilities" label="Fasilitas" />
            <BaseCheckbox v-model="pageSettings.sections.schedules" label="Jadwal Latihan" />
          </div>
        </div>

        <!-- Public Profile Link -->
        <div class="bg-gradient-to-br from-navy to-navy-light rounded-2xl p-5 text-white">
          <h3 class="font-black mb-2">Profil Publik</h3>
          <p class="text-sm text-blue-200 mb-4">Lihat bagaimana klub Anda terlihat oleh pengunjung</p>
          <NuxtLink v-if="form.slug" :to="`/clubs/${form.slug}`" target="_blank"
            class="block w-full py-3 bg-primary text-navy font-bold rounded-xl text-center hover:bg-primary-hover transition-colors">
            Lihat Halaman Publik
          </NuxtLink>
          <p v-else class="text-xs text-blue-300 italic">Slug URL belum diatur</p>
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

const router = useRouter()
const { get, put, upload } = useApi()
const { user } = useAuth()
const toast = useToast()

const saving = ref(false)
const facilityInput = ref('')
const activeTab = ref('identitas')

const tabs = [
  { id: 'identitas', name: 'Identitas', icon: 'ph:identification-badge' },
  { id: 'kontak', name: 'Kontak', icon: 'ph:phone-bold' },
  { id: 'sosial', name: 'Media Sosial', icon: 'ph:share-network-bold' },
  { id: 'fasilitas', name: 'Fasilitas', icon: 'ph:check-circle' },
  { id: 'jadwal', name: 'Jadwal', icon: 'ph:calendar-bold' },
  { id: 'konten', name: 'Konten', icon: 'ph:stack' }
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
  socialMedia: []
})

const dynamicSections = ref([])

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
    const resp = await get('/clubs/me')
    const data = resp?.data || resp || {}
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
      form.facilities = Array.isArray(data.facilities) ? data.facilities : []
      form.schedules = Array.isArray(data.schedules) ? data.schedules : []
      form.socialMedia = Array.isArray(data.social_media) ? data.social_media : []

      // Set city search for autocomplete
      citySearch.value = data.city || ''

      // Lock slug if it was already set (not empty/default)
      slugLocked.value = !!(data.slug && data.slug.length > 0 && data.slug_changed)

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
      dynamic_sections: JSON.stringify(dynamicSections.value)
    })
    toast.success('Profil klub berhasil disimpan!')
  } catch (error) {
    console.error('Save profile error:', error)
    toast.error('Gagal menyimpan profil')
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
</style>

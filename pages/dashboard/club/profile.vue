<template>
  <div class="flex flex-col gap-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
          <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-[12px]" />
          <span class="text-navy">Profile Klub</span>
        </div>
        <h1 class="text-3xl font-extrabold text-navy tracking-tight">Profil Klub</h1>
        <p class="text-gray-500 font-medium mt-1">Perbarui identitas, kontak, fasilitas, dan jadwal latihan klub Anda.</p>
      </div>
      <div class="flex gap-3">
        <button
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-semibold text-sm text-navy shadow-sm hover:bg-gray-50 transition"
          @click="resetForm">
          <Icon icon="ph:arrow-counter-clockwise" class="text-lg" />
          Reset
        </button>
        <button
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-navy-dark transition"
          :disabled="saving"
          @click="saveProfile">
          <CommonLoadingSpinner v-if="saving" size="sm" />
          <Icon v-else icon="ph:floppy-disk" class="text-lg" />
          <span>{{ saving ? 'Menyimpan...' : 'Simpan Profil' }}</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Identitas & Media -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
            <Icon icon="ph:identification-badge" class="text-primary" /> Identitas Klub
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <BaseInput v-model="form.name" label="Nama Klub" placeholder="Nama resmi klub" required />
            <BaseInput v-model="form.slug" label="Slug URL" placeholder="contoh: garuda-archery" />
            <BaseInput v-model="form.established" label="Tahun Berdiri" type="number" />
            <BaseInput v-model="form.rating" label="Rating (0-5)" type="number" step="0.1" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <BaseInput v-model="form.city" label="Kota/Kabupaten" placeholder="Contoh: Jakarta Selatan" />
            <BaseInput v-model="form.province" label="Provinsi" placeholder="DKI Jakarta" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <BaseInput v-model="form.bannerUrl" label="Banner URL" placeholder="https://..." />
            <BaseInput v-model="form.logoUrl" label="Logo URL" placeholder="https://..." />
          </div>
          <BaseTextarea v-model="form.description" label="Deskripsi" rows="4"
            placeholder="Ceritakan tentang klub, filosofi, dan layanan pelatihan." />
        </div>

        <!-- Kontak & Sosial -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
            <Icon icon="ph:phone-bold" class="text-primary" /> Kontak & Sosial
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <BaseInput v-model="form.phone" label="Telepon" placeholder="021-xxxxxxx" />
            <BaseInput v-model="form.whatsapp" label="WhatsApp" placeholder="+62 8xx xxxx xxxx" />
            <BaseInput v-model="form.email" label="Email" type="email" placeholder="info@klub.com" />
            <BaseInput v-model="form.instagram" label="Instagram" placeholder="@akun" />
            <BaseInput v-model="form.facebook" label="Facebook" placeholder="Nama Halaman" />
            <BaseInput v-model="form.website" label="Website" placeholder="https://..." />
          </div>
          <BaseTextarea v-model="form.address" label="Alamat Latihan" rows="3"
            placeholder="Alamat lengkap lokasi latihan." />
        </div>

        <!-- Fasilitas -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
              <Icon icon="ph:check-circle" class="text-primary" /> Fasilitas
            </h3>
            <div class="flex gap-2">
              <BaseInput v-model="facilityInput" placeholder="Tambah fasilitas" class="!w-48" />
              <button class="px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-dark transition"
                @click="addFacility">
                Tambah
              </button>
            </div>
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

        <!-- Jadwal Latihan -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
              <Icon icon="ph:calendar-bold" class="text-primary" /> Jadwal Latihan
            </h3>
            <button class="px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-dark transition"
              @click="addSchedule">
              Tambah Jadwal
            </button>
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
      </div>

      <!-- Side card -->
      <div class="space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em]">Informasi</h3>
          <div class="rounded-xl border border-gray-100 p-4 bg-gray-50">
            <p class="text-sm text-gray-500">Data klub akan tampil di halaman publik klub.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, reactive, computed } from 'vue'
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
const { get, put } = useApi()
const { user } = useAuth()
const toast = useToast()

const saving = ref(false)
const facilityInput = ref('')
const form = reactive({
  name: '',
  slug: '',
  bannerUrl: '',
  logoUrl: '',
  city: '',
  province: '',
  established: '',
  rating: '',
  description: '',
  phone: '',
  whatsapp: '',
  email: '',
  instagram: '',
  facebook: '',
  website: '',
  address: '',
  facilities: [],
  schedules: []
})


const loadProfile = async () => {
  try {
    // Attempt to load club profile for current user; fallback to dummy
    const resp = await get('/clubs/me')
    const data = resp?.data || resp || {}
    if (data) {
      form.name = data.name || ''
      form.slug = data.slug || ''
      form.bannerUrl = data.banner_url || ''
      form.logoUrl = data.logo_url || ''
      form.city = data.city || ''
      form.province = data.province || ''
      form.established = data.established || ''
      form.rating = data.rating || ''
      form.description = data.description || ''
      form.phone = data.phone || ''
      form.whatsapp = data.whatsapp || ''
      form.email = data.email || ''
      form.instagram = data.instagram || ''
      form.facebook = data.facebook || ''
      form.website = data.website || ''
      form.address = data.address || ''
      form.facilities = data.facilities || []
      form.schedules = data.schedules || []
    }
  } catch {
    // fallback dummy
    form.name = user.value?.club_name || 'Klub Panahan'
    form.slug = 'klub-panahan'
    form.city = 'Jakarta'
    form.province = 'DKI Jakarta'
    form.established = '2018'
    form.description = 'Isi profil klub Anda di sini.'
    form.facilities = ['Lapangan Indoor 18m', 'Lapangan Outdoor 70m']
    form.schedules = [{ day: 'Sabtu', time: '08:00 - 12:00' }]
  }
}

onMounted(() => {
  loadProfile()
})

const addFacility = () => {
  if (!facilityInput.value) return
  form.facilities.push(facilityInput.value)
  facilityInput.value = ''
}

const removeFacility = (idx) => {
  form.facilities.splice(idx, 1)
}

const addSchedule = () => {
  form.schedules.push({ day: '', time: '' })
}

const removeSchedule = (idx) => {
  form.schedules.splice(idx, 1)
}

const resetForm = () => {
  loadProfile()
}

const saveProfile = async () => {
  saving.value = true
  try {
    const payload = {
      name: form.name,
      slug: form.slug,
      banner_url: form.bannerUrl,
      logo_url: form.logoUrl,
      city: form.city,
      province: form.province,
      established: form.established,
      rating: form.rating,
      description: form.description,
      phone: form.phone,
      whatsapp: form.whatsapp,
      email: form.email,
      instagram: form.instagram,
      facebook: form.facebook,
      website: form.website,
      address: form.address,
      facilities: form.facilities,
      schedules: form.schedules
    }
    await put('/clubs/me', payload)
    toast.success('Profil klub berhasil disimpan')
  } catch {
    toast.error('Gagal menyimpan profil klub')
  } finally {
    saving.value = false
  }
}

</script>

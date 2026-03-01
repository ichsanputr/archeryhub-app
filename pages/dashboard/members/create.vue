<template>
  <div class="flex flex-col gap-6 sm:gap-8">
    <!-- Header Section -->
    <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
      <!-- Theme Motif Pattern -->
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
      </div>
      <!-- Decorative Background Elements -->
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

      <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-4">
          <!-- Mobile-styled Breadcrumb -->
          <div class="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-widest text-primary/80">
            <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
            <Icon icon="ph:caret-right-bold" class="text-[10px] opacity-50" />
            <NuxtLink to="/dashboard/members" class="hover:text-primary transition-colors text-primary font-black">
              Anggota</NuxtLink>
            <Icon icon="ph:caret-right-bold" class="text-[10px] opacity-50" />
            <span class="text-white">Pendaftaran</span>
          </div>

          <div class="flex items-center gap-4">
            <div
              class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
              <Icon icon="ph:user-plus-bold" class="text-primary text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-black tracking-tight leading-none">Daftar Anggota</h1>
              <p class="text-slate-300 text-xs sm:text-sm font-medium mt-1">Daftarkan pemanah baru ke roster klub Anda
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <BaseButton @click="submit" variant="primary" :loading="isSubmitting"
            class="w-full h-11 px-8 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px] sm:text-xs">
            <template #icon>
              <Icon v-if="!isSubmitting" icon="ph:floppy-disk-bold" />
            </template>
            {{ isSubmitting ? 'Menyimpan...' : 'Simpan Anggota' }}
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Form Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Main Form -->
      <div class="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden content-fade">
        <div class="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
          <h3 class="text-sm font-black text-navy uppercase tracking-widest">Informasi Personal</h3>
        </div>

        <div class="p-6 space-y-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <BaseInput v-model="form.full_name" label="Nama Lengkap" placeholder="Nama sesuai identitas" required
              class="sm:col-span-2" :error="errors.full_name" />
            <BaseInput v-model="form.nickname" label="Nama Panggilan" placeholder="Panggilan akrab" />
            <BaseInput v-model="form.phone" label="No. Telepon" type="tel" placeholder="08xxxxxxxxxx"
              :error="errors.phone" />
            <BaseInput v-model="form.email" label="Alamat Email" type="email" placeholder="email@archery.com" required
              :error="errors.email" />
            <BaseInput v-model="form.password" label="Password Akses" type="password" placeholder="Min. 6 karakter"
              required :error="errors.password" />
            <BaseInput v-model="form.date_of_birth" label="Tanggal Lahir" type="date" />
            <BaseSelect v-model="form.gender" label="Jenis Kelamin" :items="genderOptions" />
            <BaseSelect v-model="form.bow_type" label="Jenis Busur" :items="bowOptions" />
            <BaseInput v-model="form.id" label="ID Atlet/KTA" placeholder="ARC-2025-XXX" />
          </div>

          <div class="pt-6 border-t border-gray-50">
            <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Domisili & Pendidikan</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <BaseSelect v-model="form.city" label="Kota/Kabupaten" :items="cityOptions" searchable
                placeholder="Cari kota..." :error="errors.city" />
              <BaseInput v-model="form.school" label="Institusi/Sekolah" placeholder="Nama sekolah/kantor (opsional)" />
              <BaseTextarea v-model="form.address" label="Alamat Lengkap" placeholder="Alamat domisili saat ini"
                :rows="3" class="sm:col-span-2" />
            </div>
          </div>

          <div class="pt-6 border-t border-gray-50 flex flex-col items-center gap-4">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-full">Foto
              Profil</label>
            <div @click="showMediaLibrary = true"
              class="group relative h-32 w-32 rounded-[2rem] bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all shadow-inner">
              <img v-if="form.avatar_url" :src="form.avatar_url" class="h-full w-full object-cover" />
              <div v-else class="text-center p-4">
                <Icon icon="ph:image-bold"
                  class="text-3xl text-gray-200 mx-auto mb-1 group-hover:text-primary transition-colors" />
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pilih Foto</p>
              </div>
              <div v-if="form.avatar_url"
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Icon icon="ph:pencil-simple-bold" class="text-white text-2xl" />
              </div>
            </div>
            <p v-if="form.avatar_url" class="text-[10px] text-gray-400 font-bold text-center">Klik untuk mengganti foto
            </p>
          </div>

          <div class="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex gap-3">
            <Icon icon="ph:info-bold" class="text-primary text-xl shrink-0" />
            <p class="text-xs text-navy/70 leading-relaxed">
              Anggota baru akan otomatis masuk ke roster <span class="font-black text-navy">{{ clubName }}</span>.
              Beritahu mereka untuk login menggunakan email dan password di atas.
            </p>
          </div>
        </div>
      </div>

      <!-- Helper Summary (Sidebar) -->
      <div class="lg:col-span-4 space-y-6 sticky top-8">
        <div class="bg-navy rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-navy/20">
          <div class="absolute -top-10 -right-10 size-32 rounded-full bg-white/5 blur-2xl"></div>
          <h3 class="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Afiliasi Klub</h3>
          <div class="flex items-center gap-4">
            <div
              class="size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-2xl font-black text-primary">
              {{ clubInitial }}
            </div>
            <div>
              <p class="font-black text-lg leading-tight">{{ clubName }}</p>
              <p class="text-[10px] text-primary/80 font-bold uppercase tracking-tighter mt-1">Confirmed Affiliation</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h3 class="text-[10px] font-black text-navy uppercase tracking-widest mb-4">Tips Pendaftaran</h3>
          <ul class="space-y-4">
            <li v-for="(tip, i) in tips" :key="i" class="flex gap-3">
              <Icon icon="ph:check-circle-fill" class="text-primary text-lg shrink-0" />
              <p class="text-xs text-gray-500 font-medium">{{ tip }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Media Library -->
    <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

definePageMeta({
  title: 'Tambah Anggota Klub',
  layout: 'dashboard',
  middleware: ['auth']
})

useHead({
  title: 'Tambah Anggota - ArcheryHub Dashboard'
})

const router = useRouter()
const { get, post } = useApi()
const { user } = useAuth()
const toast = useToast()

const isSubmitting = ref(false)
const showMediaLibrary = ref(false)
const cities = ref([])
const errors = reactive({})

const form = reactive({
  full_name: '',
  nickname: '',
  email: '',
  password: '',
  phone: '',
  date_of_birth: '',
  gender: 'male',
  bow_type: 'recurve',
  id: '',
  city: '',
  school: '',
  address: '',
  avatar_url: '',
})

const cityOptions = computed(() => {
  return cities.value.map(c => ({
    title: c.name,
    value: c.name,
    description: c.province
  }))
})

const handleMediaSelect = (media) => {
  form.avatar_url = media.url
  showMediaLibrary.value = false
}

const fetchCities = async () => {
  try {
    const resp = await get('/cities')
    cities.value = resp?.data || []
  } catch (error) {
    console.error('Failed to fetch cities:', error)
  }
}

onMounted(() => {
  fetchCities()
})
const genderOptions = [
  { title: 'Putra', value: 'male' },
  { title: 'Putri', value: 'female' }
]

const bowOptions = [
  { title: 'Recurve', value: 'recurve' },
  { title: 'Compound', value: 'compound' },
  { title: 'Barebow', value: 'barebow' },
  { title: 'Traditional', value: 'traditional' }
]

const tips = [
  'Password minimal terdiri dari 6 karakter.',
  'Email harus unik dan belum terdaftar di sistem.',
  'Pemanah yang sudah terdaftar dapat login secara mandiri.',
  'Lengkapi ID Atlet jika tersedia untuk memudahkan pencarian.'
]

const clubName = computed(() => user.value?.club_name || user.value?.organization_name || user.value?.full_name || '')
const clubInitial = computed(() => (clubName.value || 'K')[0])


const validate = () => {
  const newErrors = {}
  if (!form.full_name) newErrors.full_name = 'Nama lengkap wajib diisi'
  if (!form.email) newErrors.email = 'Email wajib diisi'
  else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Format email tidak valid'

  if (!form.password) newErrors.password = 'Password wajib diisi'
  else if (form.password.length < 6) newErrors.password = 'Password minimal 6 karakter'

  if (form.phone && !/^\d+$/.test(form.phone.replace(/[\s\-\+]/g, ''))) {
    newErrors.phone = 'Nomor telepon hanya boleh berisi angka'
  }

  Object.assign(errors, newErrors)
  // Clear errors that are fixed
  Object.keys(errors).forEach(key => {
    if (!newErrors[key]) delete errors[key]
  })

  return Object.keys(newErrors).length === 0
}

const submit = async () => {
  if (!validate()) {
    toast.error('Mohon lengkapi formulir dengan benar')
    return
  }

  if (!clubName.value) {
    toast.error('Profil klub belum lengkap')
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      full_name: form.full_name,
      nickname: form.nickname || undefined,
      email: form.email,
      password: form.password,
      username: form.email.split('@')[0], // Generate username from email
      phone: form.phone || undefined,
      date_of_birth: form.date_of_birth || undefined,
      gender: form.gender === 'male' ? 'male' : 'female',
      bow_type: form.bow_type,
      id: form.id || undefined,
      city: form.city || undefined,
      school: form.school || undefined,
      address: form.address || undefined,
      avatar_url: form.avatar_url || undefined
    }

    await post('/archers', payload)
    toast.success('Anggota berhasil dibuat')
    router.push('/dashboard/members')
  } catch (error) {
    console.error('Failed to create member:', error)
    const errorMessage = error?.data?.error || error?.response?.data?.error || error?.message || 'Gagal membuat anggota'
    toast.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}
</script>
